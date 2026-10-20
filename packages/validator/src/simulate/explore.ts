import { Category } from '@mudafaa/case-schema';
import type { Action, ActionResult, ChoiceDef } from '@mudafaa/case-schema';
import { act, computeScore, enumerateActions, evalCond, getOwn, start, view } from '@mudafaa/engine';
import type { ActOk, CompiledCase, EngineEvent, SessionState } from '@mudafaa/engine';
import { analyzeLiveness } from './liveness.js';
import { reducer } from './reduce.js';

export type CoverageKind =
  'nodes' | 'choices' | 'variants' | 'rules' | 'fallbacks' | 'objects' | 'evidence' | 'statements' | 'outcomes';

/** Tanık dizisiyle birlikte raporlanan durum. */
export interface Witnessed {
  key: string;
  witness: Action[];
}

export interface ExploreResult {
  /** BFS indirgenmiş durum uzayını bütçeye takılmadan bitirdi mi. */
  complete: boolean;
  /** Süre sınırı (`maxMs`) aşıldı: sonuçlar eksiktir ve rapor geçmez. */
  aborted: boolean;
  states: number;
  edges: number;
  walks: number;
  /** BFS sınırında kalan ve kaçış araması örneğine girmeyen durum sayısı. */
  frontierUnchecked: number;
  coverage: Record<CoverageKind, { total: number; reached: number; missing: string[] }>;
  deadEnds: Witnessed[];
  softlocks: Witnessed[];
  /** Kaçış araması bütçesi içinde doğrulanamayan durumlar. */
  unverified: Witnessed[];
  /** `enumerateActions`'ın sunduğu ama motorun reddettiği aksiyonlar (ör. LOOP_LIMIT). */
  rejected: (Witnessed & { code: string; message: string })[];
  /** Motorun fırlattığı hatalar (içerik motoru güvensiz bir duruma soktu). */
  engineErrors: (Witnessed & { message: string })[];
  outcomes: Record<string, { reached: boolean; witness?: Action[]; finalMin?: number; finalMax?: number }>;
  categoryMax: Record<Category, number>;
  finalMin: number;
  finalMax: number;
  /** Skoru artıran ve tekrarlanabilen döngüler. */
  scoreLoops: string[];
  /** Yalnızca skoru düşüren, kaynak tüketmeyen döngüler (uyarı). */
  penaltyLoops: string[];
  leaks: { key: string; token: string }[];
}

export interface ExploreOptions {
  /** BFS'in en çok indirgenmiş durum sayısı (varsayılan 20 000). */
  maxStates?: number;
  /** Tohumlu rastgele yürüyüş sayısı (varsayılan 400). */
  walks?: number;
  /** Bir yürüyüşün en çok adımı (varsayılan 400). */
  walkSteps?: number;
  /** Kaçış araması başına en çok durum (varsayılan 4 000). */
  escapeBudget?: number;
  /** Kaçışı denetlenecek BFS sınır durumu sayısı (varsayılan 200). */
  frontierSample?: number;
  /** Ek senaryolar (golden path'ler): baştan oynatılır, kapsama ve sızıntı denetimine katılır. */
  scripts?: readonly (readonly Action[])[];
  /** Sert süre sınırı, ms (varsayılan 300 000). Aşılırsa keşif durur ve `aborted` olur; sonuç deterministik değildir. */
  maxMs?: number;
}

/**
 * Bir anahtar, skor aralığı genişledikçe en çok bu kadar kez yeniden genişletilir. Skor döngüleri graf üzerinden ayrıca
 * bulunur; bu sınır yalnızca işi sınırlar.
 */
const WIDEN_LIMIT = 16;
/** Raporlanan listelerin üst sınırı. */
const LIST_LIMIT = 20;
/** Kapsam hedefli aşama için node başına saklanan temsilci durum (tanık kaydı) sayısı. */
const REPS_PER_NODE = 8;

const PLAYER: ReadonlySet<string> = new Set(['OPTION', 'TOPIC', 'NAVIGATE', 'CONTINUE']);
const META = { sessionId: 'sim', caseId: 'sim', stateVersion: 0, mode: 'TEST' as const };

/** Küçük, deterministik PRNG (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface KeyInfo {
  first: number;
  finalMin: number;
  finalMax: number;
  catMax: number[];
  widen: number;
  /** Bütün ardılları kaydedildi mi (BFS genişletmesi ya da çıkmaz). */
  expanded: boolean;
  completed: boolean;
}

function viewStrings(value: unknown, key: string, texts: string[], values: Set<string>, idVals: Set<string>): void {
  if (typeof value === 'string') {
    texts.push(value);
    values.add(value);
    if (key === 'id' || key === 'var') idVals.add(value);
  } else if (Array.isArray(value)) {
    for (const v of value) viewStrings(v, key, texts, values, idVals);
  } else if (typeof value === 'object' && value !== null) {
    for (const [k, v] of Object.entries(value)) viewStrings(v, k, texts, values, idVals);
  }
}

const rawOf = (s: SessionState): number => Category.options.reduce((n, k) => n + s.score.cat[k], 0);
const message = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/** Yinelemeli Tarjan: her anahtarın güçlü bağlı bileşen numarası ve döngü içeren bileşenler. */
function components(succ: ReadonlyMap<string, ReadonlySet<string>>): {
  comp: Map<string, number>;
  cyclic: Set<number>;
} {
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const comp = new Map<string, number>();
  const cyclic = new Set<number>();
  let next = 0;
  let compNo = 0;
  for (const root of succ.keys()) {
    if (index.has(root)) continue;
    const work: { v: string; it: Iterator<string> }[] = [{ v: root, it: (succ.get(root) ?? new Set()).values() }];
    index.set(root, next);
    low.set(root, next++);
    stack.push(root);
    onStack.add(root);
    while (work.length > 0) {
      const top = work[work.length - 1];
      if (top === undefined) break;
      const step = top.it.next();
      if (!step.done) {
        const w = step.value;
        if (!index.has(w)) {
          index.set(w, next);
          low.set(w, next++);
          stack.push(w);
          onStack.add(w);
          work.push({ v: w, it: (succ.get(w) ?? new Set()).values() });
        } else if (onStack.has(w)) {
          low.set(top.v, Math.min(low.get(top.v) ?? 0, index.get(w) ?? 0));
        }
        continue;
      }
      work.pop();
      const parent = work[work.length - 1];
      if (parent !== undefined) low.set(parent.v, Math.min(low.get(parent.v) ?? 0, low.get(top.v) ?? 0));
      if (low.get(top.v) === index.get(top.v)) {
        let size = 0;
        let w: string | undefined;
        do {
          w = stack.pop();
          if (w === undefined) break;
          onStack.delete(w);
          comp.set(w, compNo);
          size += 1;
        } while (w !== top.v);
        if (size > 1 || (succ.get(top.v)?.has(top.v) ?? false)) cyclic.add(compNo);
        compNo += 1;
      }
    }
  }
  return { comp, cyclic };
}

/**
 * Durum uzayı keşfi; bütçeler sayıyla verilir, bu yüzden aynı girdi her makinede aynı sonucu verir (yalnızca sert süre
 * sınırı aşılırsa `aborted`). Ortak bir indirgenmiş durum grafiği üzerinde dört aşama:
 * 1. Bütçeli BFS. Anahtar canlılık analiziyle indirgenir; skor, bir koşul okumadıkça anahtar başına aralık olarak
 *    izlenir.
 * 2. Golden path'ler ve tohumlu rastgele yürüyüşler; yarısı golden önekli, yarısı soruşturmayı erken bırakmamaya
 *    çalışır. Ardından kapsam hedefli aşama.
 * 3. Softlock denetimi. Tamamen genişletilmiş ama bitişe ya da bilinmeyene ulaşamayan durumlar kesin softlock'tur.
 *    Bitmeyen yürüyüşler ve BFS sınırından bir örnek, RESULT'a statik uzaklıkla yönlendirilen kaçış aramasıyla
 *    denetlenir.
 * 4. Diğer bulgular:
 *    - kapsam, sonuçlar ve skor sınırları;
 *    - reddedilen aksiyonlar ve motor hataları;
 *    - grafın güçlü bağlı bileşenleri içindeki skor değiştiren kenarlarla skor döngüleri;
 *    - her gözlenen geçişte (yanıt metni) ve her yeni görünüm imzasında (görünüm JSON'u) sızıntı.
 */
export function explore(c: CompiledCase, opts: ExploreOptions = {}): ExploreResult {
  const maxStates = opts.maxStates ?? 20_000;
  const walkCount = opts.walks ?? 400;
  const walkSteps = opts.walkSteps ?? 400;
  const escapeBudget = opts.escapeBudget ?? 4_000;
  const frontierSample = opts.frontierSample ?? 200;
  const maxMs = opts.maxMs ?? 300_000;
  const began = performance.now();
  let aborted = false;
  const timeUp = (): boolean => {
    if (!aborted && performance.now() - began > maxMs) aborted = true;
    return aborted;
  };
  const liveness = analyzeLiveness(c);
  const reduce = reducer(c, liveness);
  const distanceOf = (node: string): number => liveness.distance.get(node) ?? Infinity;

  const parent: number[] = [];
  const via: (Action | null)[] = [];
  const record = (from: number, action: Action | null): number => {
    parent.push(from);
    via.push(action);
    return parent.length - 1;
  };
  const witness = (id: number): Action[] => {
    const out: Action[] = [];
    for (let i = id; i >= 0; i = parent[i] ?? -1) {
      const a = via[i];
      if (a !== null && a !== undefined) out.push(a);
    }
    return out.reverse();
  };
  const replay = (actions: readonly Action[]): SessionState | undefined => {
    try {
      let s = start(c).state;
      for (const a of actions) {
        const r = act(c, s, a);
        if (!r.ok) return undefined;
        s = r.state;
      }
      return s;
    } catch {
      return undefined;
    }
  };

  const keys = new Map<string, KeyInfo>();
  const succ = new Map<string, Set<string>>();
  const upEdges = new Set<string>();
  const downEdges = new Set<string>();
  const edge = (from: string, to: string): void => {
    let set = succ.get(from);
    if (set === undefined) succ.set(from, (set = new Set()));
    set.add(to);
  };
  let edges = 0;

  const reached: Record<CoverageKind, Set<string>> = {
    nodes: new Set(),
    choices: new Set(),
    variants: new Set(),
    rules: new Set(),
    fallbacks: new Set(),
    objects: new Set(),
    evidence: new Set(),
    statements: new Set(),
    outcomes: new Set(),
  };
  const outcomes: ExploreResult['outcomes'] = Object.fromEntries(c.outcomes.map((o) => [o.id, { reached: false }]));
  const categoryMax = Object.fromEntries(Category.options.map((k) => [k, 0])) as Record<Category, number>;
  let finalMin = Infinity;
  let finalMax = -Infinity;
  const scoreLoops = new Set<string>();
  const penaltyLoops = new Set<string>();
  const leaks: ExploreResult['leaks'] = [];
  const leakSeen = new Set<string>();
  const viewChecked = new Set<string>();
  const deadEnds: Witnessed[] = [];
  const deadKeys = new Set<string>();
  const rejected: ExploreResult['rejected'] = [];
  const rejectSeen = new Set<string>();
  const engineErrors: ExploreResult['engineErrors'] = [];
  const reps = new Map<string, number[]>();

  const leak = (key: string, token: string): void => {
    if (leakSeen.has(token) || leaks.length >= LIST_LIMIT) return;
    leakSeen.add(token);
    leaks.push({ key, token });
  };

  /** Motor çağrısı: ret ve hata rapora girer; ikisinde de `undefined` döner. */
  const step = (s: SessionState, a: Action, id: number, key: string): ActOk | undefined => {
    try {
      const r = act(c, s, a);
      if (r.ok) return r;
      const sig = `${key}|${JSON.stringify(a)}`;
      if (!rejectSeen.has(sig) && rejected.length < LIST_LIMIT) {
        rejected.push({ key, witness: [...witness(id), a], code: r.code, message: r.message });
      }
      rejectSeen.add(sig);
    } catch (e) {
      if (engineErrors.length < LIST_LIMIT)
        engineErrors.push({ key, witness: [...witness(id), a], message: message(e) });
    }
    return undefined;
  };
  const actions = (s: SessionState, id: number, key: string): Action[] => {
    try {
      return enumerateActions(c, s);
    } catch (e) {
      if (engineErrors.length < LIST_LIMIT) engineErrors.push({ key, witness: witness(id), message: message(e) });
      return [];
    }
  };

  const noteTransition = (before: SessionState, after: SessionState, events: readonly EngineEvent[]): void => {
    edges += 1;
    for (const e of events) {
      if (e.type === 'NODE_ENTER') reached.nodes.add(e.node);
      if (e.type === 'DISCOVER') reached.evidence.add(e.evidence);
    }
    for (const k of Object.keys(after.uses)) {
      if ((getOwn(after.uses, k) ?? 0) <= (getOwn(before.uses, k) ?? 0)) continue;
      if (k.startsWith('obj:')) reached.objects.add(k.slice(4));
      else if (k.includes('#')) reached.variants.add(k);
      else {
        const kind = c.choiceIndex.get(k)?.choice.kind;
        if (kind !== undefined)
          reached[PLAYER.has(kind) ? 'choices' : kind === 'FALLBACK' ? 'fallbacks' : 'rules'].add(k);
      }
    }
  };

  /** Bu aksiyonun sonucundaki metinlerde (yanıt satırları, geri bildirim, isabet) hâlâ bulunmamış delil başlığı var mı. */
  const scanResult = (result: ActionResult, after: SessionState, key: string): void => {
    const texts = [
      ...result.lines.map((l) => l.text),
      result.feedback?.title,
      result.feedback?.text,
      result.feedback?.label,
      result.hit?.text,
    ].filter((t): t is string => t !== undefined && t !== '');
    if (texts.length === 0) return;
    for (const ev of c.evidence.values()) {
      if (getOwn(after.evidence, ev.id) !== undefined || ev.title.trim() === '') continue;
      if (texts.some((t) => t.includes(ev.title))) leak(key, ev.title);
    }
  };

  /**
   * Görünüm sızıntısı. Görünümdeki metinleri seçen her şey imzaya girer (node, bütün bulunmuş deliller ve nesneler,
   * görünür ve etkin seçenekler, görünür ifadeler, satır bloğu, ruh hâli, hedefler); her yeni imzada görünüm JSON'u
   * taranır. Son aksiyonun metinleri (`last`) `scanResult` ile ayrıca her geçişte taranır.
   */
  const checkView = (s: SessionState, key: string, id: number): void => {
    const node = c.nodes.get(s.nodeId)?.def;
    if (node === undefined || node.type === 'DECISION' || leaks.length >= LIST_LIMIT) return;
    const ctx = { c, s };
    const holds = (when: Parameters<typeof evalCond>[0] | undefined): boolean =>
      when === undefined || evalCond(when, ctx);
    let signature: string;
    let statements: string[];
    try {
      const visible = node.choices.filter((ch: ChoiceDef) => PLAYER.has(ch.kind) && holds(ch.visibleWhen));
      statements =
        node.type === 'COURTROOM'
          ? (node.statements ?? []).filter((st) => holds(st.visibleWhen)).map((st) => st.id)
          : [];
      signature = JSON.stringify([
        s.nodeId,
        Object.keys(s.evidence).sort(),
        Object.keys(s.found).sort(),
        visible.map((ch) => ch.id),
        visible.filter((ch) => holds(ch.enabledWhen)).map((ch) => ch.id),
        statements,
        (node.lines ?? []).findIndex((b) => holds(b.when)),
        node.type === 'DIALOGUE' ? (node.moodRules ?? []).findIndex((m) => holds(m.when)) : -1,
        node.type === 'DIALOGUE' ? (node.objectives ?? []).map((o) => holds(o.when)) : [],
      ]);
    } catch (e) {
      if (engineErrors.length < LIST_LIMIT) engineErrors.push({ key, witness: witness(id), message: message(e) });
      return;
    }
    for (const st of statements) reached.statements.add(st);
    if (viewChecked.has(signature)) return;
    viewChecked.add(signature);
    const texts: string[] = [];
    const values = new Set<string>();
    const idVals = new Set<string>();
    try {
      const v = view(c, s, META);
      viewStrings({ ...v, last: undefined }, '', texts, values, idVals);
    } catch (e) {
      if (engineErrors.length < LIST_LIMIT) engineErrors.push({ key, witness: witness(id), message: message(e) });
      return;
    }
    const shown = new Set<string>();
    if (node.type === 'EVIDENCE') shown.add(node.evidence);
    if (node.type === 'COURTROOM' && node.prosecutionEvidence !== undefined) shown.add(node.prosecutionEvidence);
    for (const ev of c.evidence.values()) {
      if (getOwn(s.evidence, ev.id) !== undefined || shown.has(ev.id)) continue;
      if (values.has(ev.id)) leak(key, ev.id);
      if (ev.title.trim() !== '' && texts.some((t) => t.includes(ev.title))) leak(key, ev.title);
    }
    for (const ch of node.choices) {
      const hidden = !PLAYER.has(ch.kind) || !holds(ch.visibleWhen);
      if (hidden && values.has(ch.id)) leak(key, ch.id);
    }
    for (const { obj } of c.objects.values()) {
      if (obj.marker === 'HIDDEN' && getOwn(s.found, obj.id) === undefined && values.has(obj.id)) leak(key, obj.id);
    }
    for (const v of c.vars.values()) if (v.visibility === 'HIDDEN' && idVals.has(v.id)) leak(key, v.id);
  };

  const onCompleted = (s: SessionState, id: number): void => {
    const o = s.outcome;
    const entry = o === undefined ? undefined : outcomes[o.id];
    if (o === undefined || entry === undefined) return;
    reached.outcomes.add(o.id);
    if (!entry.reached) {
      entry.reached = true;
      entry.witness = witness(id);
    }
    entry.finalMin = Math.min(entry.finalMin ?? Infinity, o.final);
    entry.finalMax = Math.max(entry.finalMax ?? -Infinity, o.final);
    finalMin = Math.min(finalMin, o.final);
    finalMax = Math.max(finalMax, o.final);
  };

  const finalOf = (s: SessionState, id: number, key: string): number => {
    if (s.outcome !== undefined) return s.outcome.final;
    try {
      return computeScore(c, s).final;
    } catch (e) {
      if (engineErrors.length < LIST_LIMIT) engineErrors.push({ key, witness: witness(id), message: message(e) });
      return 0;
    }
  };

  /**
   * Bir geçişi grafa kaydeder. Dönen `fresh`: anahtar yeni ya da skor aralığını genişletti (BFS yeniden genişletir).
   * `id`, bu duruma giden tanık zincirinin kaydı (`always` ise anahtar bilinse de yeni kayıt açılır).
   */
  const observe = (
    s: SessionState,
    from: number,
    action: Action | null,
    before: SessionState | undefined,
    fromKey: string | undefined,
    always: boolean,
  ): { key: string; id: number; fresh: boolean; known: boolean } => {
    const key = reduce(s);
    if (fromKey !== undefined) {
      edge(fromKey, key);
      if (before !== undefined) {
        const delta = rawOf(s) - rawOf(before);
        if (delta > 0) upEdges.add(`${fromKey}\n${key}`);
        if (delta < 0) downEdges.add(`${fromKey}\n${key}`);
      }
    }
    const cats = Category.options.map((k) => s.score.cat[k]);
    Category.options.forEach((k, i) => {
      categoryMax[k] = Math.max(categoryMax[k], cats[i] ?? 0);
    });
    const done = s.status === 'COMPLETED';
    const info = keys.get(key);
    let id = -1;
    let fresh = false;
    if (info === undefined) {
      id = record(from, action);
      const list = reps.get(s.nodeId) ?? [];
      if (!done && list.length < REPS_PER_NODE) reps.set(s.nodeId, [...list, id]);
      const final = finalOf(s, id, key);
      keys.set(key, {
        first: id,
        finalMin: final,
        finalMax: final,
        catMax: cats,
        widen: 0,
        expanded: done,
        completed: done,
      });
      if (done) onCompleted(s, id);
      fresh = true;
    } else {
      const final = finalOf(s, from, key);
      // Yalnızca final skorun aralığı genişleyince yeniden genişletilir (sonuç eşikleri final'e bakar); kategori en
      // yüksekleri tüm gözlenen durumlardan ayrıca toplanır.
      const widened = final < info.finalMin || final > info.finalMax;
      if (widened || always) id = record(from, action);
      if (widened) {
        info.finalMin = Math.min(info.finalMin, final);
        info.finalMax = Math.max(info.finalMax, final);
        info.catMax = info.catMax.map((v, i) => Math.max(v, cats[i] ?? 0));
        info.widen += 1;
        if (done) onCompleted(s, id);
        fresh = info.widen <= WIDEN_LIMIT;
      }
    }
    checkView(s, key, id >= 0 ? id : (keys.get(key)?.first ?? from));
    return { key, id, fresh, known: info !== undefined };
  };

  // (1) BFS
  let truncated = false;
  const cutOff = new Set<string>();
  let first: ReturnType<typeof start>;
  try {
    first = start(c);
  } catch (e) {
    engineErrors.push({ key: '', witness: [], message: message(e) });
    return emptyResult(c, engineErrors);
  }
  for (const e of first.events) if (e.type === 'NODE_ENTER') reached.nodes.add(e.node);
  for (const ev of c.pkg.evidence) if (ev.initiallyKnown) reached.evidence.add(ev.id);
  const root = observe(first.state, -1, null, undefined, undefined, false);
  const queue: ({ id: number; s: SessionState; key: string } | undefined)[] = [
    { id: root.id, s: first.state, key: root.key },
  ];
  for (let head = 0; head < queue.length; head++) {
    if (timeUp()) break;
    const item = queue[head];
    queue[head] = undefined;
    if (item === undefined) continue;
    const { id, s, key } = item;
    const info = keys.get(key);
    if (info !== undefined) info.expanded = true;
    const list = actions(s, id, key);
    if (list.length === 0) {
      if (!deadKeys.has(key) && deadEnds.length < LIST_LIMIT) deadEnds.push({ key, witness: witness(id) });
      deadKeys.add(key);
      continue;
    }
    for (const a of list) {
      const r = step(s, a, id, key);
      if (r === undefined) {
        cutOff.add(key); // reddedilen aksiyonun ardılı bilinmiyor: softlock analizinde iyimser davran
        continue;
      }
      noteTransition(s, r.state, r.events);
      scanResult(r.result, r.state, key);
      if (!keys.has(reduce(r.state)) && keys.size >= maxStates) {
        truncated = true;
        cutOff.add(key);
        continue;
      }
      const o = observe(r.state, id, a, s, key, false);
      if (o.fresh && r.state.status === 'ACTIVE') queue.push({ id: o.id, s: r.state, key: o.key });
    }
  }
  // Sınır: bütçe yüzünden ardılı eklenemeyen durumlar (ve henüz genişletilmemişler).
  const frontier = [...keys].filter(([k, i]) => !i.completed && (!i.expanded || cutOff.has(k))).map(([k]) => k);
  if (frontier.length > 0 || aborted) truncated = true;

  // (2) Senaryolar ve yürüyüşler
  const stuck: { key: string; id: number; s: SessionState }[] = [];
  const pick = (list: readonly Action[], s: SessionState, rand: () => number, patient: boolean): Action => {
    const here = distanceOf(s.nodeId);
    const leaves = (a: Action): boolean => {
      if (a.kind !== 'CHOOSE') return false;
      const next = c.nodes.get(s.nodeId)?.choices.get(a.choiceId)?.next;
      const targets =
        typeof next === 'string'
          ? next === '$stay' || next === '$return'
            ? []
            : [next]
          : next === undefined
            ? []
            : 'push' in next
              ? [next.push]
              : next.routes.map((r) => r.to);
      return targets.length > 0 && Math.min(...targets.map(distanceOf)) < here;
    };
    let pool = list;
    if (patient && rand() < 0.95) {
      const staying = list.filter((a) => !leaves(a));
      if (staying.length > 0) pool = staying;
    }
    const unseen = pool.filter((a) =>
      a.kind === 'CHOOSE'
        ? !(a.variant === undefined
            ? reached.choices.has(a.choiceId)
            : reached.variants.has(`${a.choiceId}#${a.variant}`))
        : false,
    );
    if (unseen.length > 0 && rand() < 0.5) pool = unseen;
    return pool[Math.floor(rand() * pool.length)] ?? (list[0] as Action);
  };
  /**
   * Yürüyüş: verilen durumdan başlar; önce senaryonun ilk `scripted` aksiyonu, sonra (senaryo bütünüyle oynanmıyorsa)
   * rastgele seçim. Aynı anahtara farklı skorla dönmek bir döngüdür: artışsa skor döngüsü, düşüşse ceza döngüsü.
   */
  const walkFrom = (
    s0: SessionState,
    id0: number,
    key0: string,
    script: readonly Action[] | undefined,
    scripted: number,
    seed: number,
  ): void => {
    const rand = rng(seed);
    let s = s0;
    let id = id0;
    let key = key0;
    const raws = new Map<string, number>([[key, rawOf(s)]]);
    const whole = script !== undefined && scripted >= script.length;
    const steps = whole ? scripted : scripted + walkSteps;
    for (let i = 0; i < steps && s.status === 'ACTIVE'; i++) {
      if (timeUp()) return;
      let a: Action | undefined = i < scripted ? script?.[i] : undefined;
      if (a === undefined) {
        const list = actions(s, id, key);
        if (list.length === 0) {
          if (!deadKeys.has(key) && deadEnds.length < LIST_LIMIT) deadEnds.push({ key, witness: witness(id) });
          deadKeys.add(key);
          const info = keys.get(key);
          if (info !== undefined) info.expanded = true;
          return;
        }
        a = pick(list, s, rand, seed % 2 === 1);
      }
      const r = step(s, a, id, key);
      if (r === undefined) return;
      noteTransition(s, r.state, r.events);
      scanResult(r.result, r.state, key);
      const o = observe(r.state, id, a, s, key, true);
      const raw = rawOf(r.state);
      const prior = raws.get(o.key);
      if (prior !== undefined && r.state.status === 'ACTIVE') {
        if (raw > prior) scoreLoops.add(o.key);
        if (raw < prior) penaltyLoops.add(o.key);
      }
      raws.set(o.key, raw);
      s = r.state;
      id = o.id;
      key = o.key;
    }
    if (s.status === 'ACTIVE' && !whole) stuck.push({ key, id, s });
  };
  const walk = (script: readonly Action[] | undefined, scripted: number, seed: number): void =>
    walkFrom(first.state, root.id, root.key, script, scripted, seed);
  const scripts = opts.scripts ?? [];
  for (const script of scripts) walk(script, script.length, 0);
  // Yürüyüşlerin yarısı bir golden path'in rastgele uzunluktaki önekinden başlar: başarılı yolların yakınındaki
  // alternatifler (ör. duruşmanın derin aşamaları) böylece örneklenir.
  let walks = 0;
  for (; walks < walkCount && !timeUp(); walks++) {
    const script = walks % 2 === 0 ? scripts[(walks / 2) % Math.max(1, scripts.length)] : undefined;
    const cut = script === undefined ? 0 : Math.floor(rng(1_000 + walks)() * script.length);
    walk(script, cut, 7 + walks);
  }

  // Kategori başına açgözlü yürüyüş: her adımda o kategoriyi en çok artıran aksiyon (eşitlikte RESULT'a yaklaşan,
  // sonra ilk) seçilir. Raporun beceri tavsiyesindeki `categoryMax` için ulaşılabilir en yüksek skoru yaklaştırır.
  for (const [k, cat] of Category.options.entries()) {
    let s = first.state;
    let id = root.id;
    let key = root.key;
    for (let i = 0; i < walkSteps && s.status === 'ACTIVE' && !timeUp(); i++) {
      let best: { a: Action; r: ActOk; gain: number; d: number } | undefined;
      for (const a of actions(s, id, key)) {
        const r = step(s, a, id, key);
        if (r === undefined) continue;
        const gain = r.state.score.cat[cat] - s.score.cat[cat];
        const d = distanceOf(r.state.nodeId);
        if (best === undefined || gain > best.gain || (gain === best.gain && d < best.d)) best = { a, r, gain, d };
      }
      if (best === undefined) break;
      noteTransition(s, best.r.state, best.r.events);
      scanResult(best.r.result, best.r.state, key);
      const o = observe(best.r.state, id, best.a, s, key, true);
      s = best.r.state;
      id = o.id;
      key = o.key;
    }
    void k;
  }

  // (2b) Kapsam hedefli aşama: kapsanmamış seçenek, varyant, kural, fallback ya da nesnesi olan node'larda saklanan
  // temsilci durumlara dönülür, her aksiyon denenir; yeni bir şey kapsayan aksiyondan sonra yürüyüş sürdürülür.
  const coverageSize = (): number => Object.values(reached).reduce((n, set) => n + set.size, 0);
  const gapNodes = (): string[] => {
    const out = new Set<string>();
    for (const n of c.pkg.nodes) {
      for (const ch of n.choices) {
        const kind = PLAYER.has(ch.kind) ? 'choices' : ch.kind === 'FALLBACK' ? 'fallbacks' : 'rules';
        if (!reached[kind].has(ch.id)) out.add(n.id);
        for (const v of ch.variants ?? []) if (!reached.variants.has(`${ch.id}#${v.id}`)) out.add(n.id);
      }
      if (n.type === 'SCENE') {
        for (const o of c.scenes.get(n.scene)?.objects ?? []) if (!reached.objects.has(o.id)) out.add(n.id);
      }
    }
    return [...out];
  };
  let targetSeed = 100_000;
  for (const node of gapNodes()) {
    for (const repId of reps.get(node) ?? []) {
      if (timeUp() || !gapNodes().includes(node)) break;
      const s = replay(witness(repId));
      if (s === undefined || s.nodeId !== node || s.status !== 'ACTIVE') continue;
      const key = reduce(s);
      for (const a of actions(s, repId, key)) {
        const before = coverageSize();
        const r = step(s, a, repId, key);
        if (r === undefined) continue;
        noteTransition(s, r.state, r.events);
        scanResult(r.result, r.state, key);
        if (coverageSize() === before) continue;
        const o = observe(r.state, repId, a, s, key, true);
        walkFrom(r.state, o.id, o.key, undefined, 0, targetSeed++);
      }
    }
  }

  // (3) Softlock denetimi
  const reverse = new Map<string, string[]>();
  for (const [from, tos] of succ) {
    for (const to of tos) {
      const list = reverse.get(to);
      if (list === undefined) reverse.set(to, [from]);
      else list.push(from);
    }
  }
  const close = (seeds: Iterable<string>, into: Set<string>): void => {
    const stack = [...seeds];
    while (stack.length > 0) {
      const k = stack.pop();
      if (k === undefined || into.has(k)) continue;
      into.add(k);
      for (const p of reverse.get(k) ?? []) if (!into.has(p)) stack.push(p);
    }
  };
  const proven = new Set<string>();
  close(
    [...keys].filter(([, i]) => i.completed).map(([k]) => k),
    proven,
  );

  const softlocks: Witnessed[] = [];
  const unverified: Witnessed[] = [];
  const softKeys = new Set<string>();
  // Kesin: bütün ardılları bilinen ve bitişe / bilinmeyene ulaşamayan durumlar.
  const hopeful = new Set<string>();
  close(
    [...keys].filter(([k, i]) => i.completed || !i.expanded || cutOff.has(k)).map(([k]) => k),
    hopeful,
  );
  for (const [k, i] of keys) {
    if (softlocks.length >= LIST_LIMIT) break;
    if (!hopeful.has(k) && !deadKeys.has(k)) {
      softlocks.push({ key: k, witness: witness(i.first) });
      softKeys.add(k);
    }
  }
  // Kaçış araması: RESULT'a statik uzaklığa göre en iyi-önce; kanıtlı iyi bir anahtara ya da bitişe ulaşmalı.
  const escape = (s0: SessionState, key0: string, id0: number): 'ok' | 'stuck' | 'budget' => {
    if (proven.has(key0)) return 'ok';
    // Uzaklık kovaları; kova içinde en son eklenen önce (derinlik-önce), böylece eşit uzaklıktaki geniş node'larda
    // (ör. tanık ifadesi) genişlik-önce patlama olmaz.
    const buckets = new Map<number, { s: SessionState; key: string; id: number }[]>();
    const push = (item: { s: SessionState; key: string; id: number }): void => {
      const d = distanceOf(item.s.nodeId);
      const list = buckets.get(d);
      if (list === undefined) buckets.set(d, [item]);
      else list.push(item);
    };
    const pop = (): { s: SessionState; key: string; id: number } | undefined => {
      let best = Infinity;
      for (const [d, list] of buckets) if (list.length > 0 && d < best) best = d;
      return buckets.get(best)?.pop();
    };
    push({ s: s0, key: key0, id: id0 });
    const seen = new Set<string>([key0]);
    const path = new Map<string, string>();
    for (let cur = pop(); cur !== undefined; cur = pop()) {
      if (seen.size > escapeBudget || timeUp()) return 'budget';
      for (const a of actions(cur.s, cur.id, cur.key)) {
        const r = step(cur.s, a, cur.id, cur.key);
        if (r === undefined) continue;
        noteTransition(cur.s, r.state, r.events);
        scanResult(r.result, r.state, cur.key);
        const o = observe(r.state, cur.id, a, cur.s, cur.key, true);
        if (r.state.status === 'COMPLETED' || proven.has(o.key)) {
          for (let k: string | undefined = cur.key; k !== undefined; k = path.get(k)) proven.add(k);
          proven.add(o.key);
          return 'ok';
        }
        if (seen.has(o.key)) continue;
        seen.add(o.key);
        path.set(o.key, cur.key);
        push({ s: r.state, key: o.key, id: o.id });
      }
    }
    return 'stuck';
  };
  const judge = (s: SessionState, key: string, id: number): void => {
    if (softKeys.has(key) || deadKeys.has(key)) return;
    const verdict = escape(s, key, id);
    if (verdict === 'stuck' && softlocks.length < LIST_LIMIT) {
      softlocks.push({ key, witness: witness(id) });
      softKeys.add(key);
    } else if (verdict === 'budget' && unverified.length < LIST_LIMIT) unverified.push({ key, witness: witness(id) });
  };
  for (const st of stuck) judge(st.s, st.key, st.id);
  const stride = Math.max(1, Math.floor(frontier.length / Math.max(1, frontierSample)));
  let sampled = 0;
  for (let i = 0; i < frontier.length && !timeUp(); i += stride) {
    const k = frontier[i];
    const info = k === undefined ? undefined : keys.get(k);
    if (k === undefined || info === undefined) continue;
    sampled += 1;
    if (proven.has(k)) continue;
    const s = replay(witness(info.first));
    if (s !== undefined) judge(s, k, info.first);
  }

  // (4) Skor döngüleri: güçlü bağlı bir bileşenin içindeki skor değiştiren kenar tekrarlanabilir.
  const { comp, cyclic } = components(succ);
  const inCycle = (pair: string): string | undefined => {
    const [from, to] = pair.split('\n');
    if (from === undefined || to === undefined) return undefined;
    const cf = comp.get(from);
    return cf !== undefined && cf === comp.get(to) && cyclic.has(cf) ? to : undefined;
  };
  for (const pair of upEdges) {
    const to = inCycle(pair);
    if (to !== undefined) scoreLoops.add(to);
  }
  for (const pair of downEdges) {
    const to = inCycle(pair);
    if (to !== undefined && !scoreLoops.has(to)) penaltyLoops.add(to);
  }

  const totals: Record<CoverageKind, string[]> = {
    nodes: c.pkg.nodes.map((n) => n.id),
    choices: c.pkg.nodes.flatMap((n) => n.choices.filter((ch) => PLAYER.has(ch.kind)).map((ch) => ch.id)),
    variants: c.pkg.nodes.flatMap((n) => n.choices.flatMap((ch) => (ch.variants ?? []).map((v) => `${ch.id}#${v.id}`))),
    rules: c.pkg.nodes.flatMap((n) =>
      n.choices.filter((ch) => !PLAYER.has(ch.kind) && ch.kind !== 'FALLBACK').map((ch) => ch.id),
    ),
    fallbacks: c.pkg.nodes.flatMap((n) => n.choices.filter((ch) => ch.kind === 'FALLBACK').map((ch) => ch.id)),
    // Yalnızca SCENE node'larında aranan sahnelerin nesneleri (hub önizlemesindeki işaretler dokunulamaz).
    objects: c.pkg.scenes
      .filter((sc) => c.pkg.nodes.some((n) => n.type === 'SCENE' && n.scene === sc.id))
      .flatMap((sc) => sc.objects.map((o) => o.id)),
    evidence: c.pkg.evidence.map((e) => e.id),
    statements: c.pkg.nodes.flatMap((n) => (n.type === 'COURTROOM' ? (n.statements ?? []).map((st) => st.id) : [])),
    outcomes: c.outcomes.map((o) => o.id),
  };
  const coverage = Object.fromEntries(
    (Object.keys(totals) as CoverageKind[]).map((k) => {
      const missing = totals[k].filter((id) => !reached[k].has(id));
      return [k, { total: totals[k].length, reached: totals[k].length - missing.length, missing }];
    }),
  ) as ExploreResult['coverage'];

  return {
    complete: !truncated,
    aborted,
    states: keys.size,
    edges,
    walks,
    frontierUnchecked: Math.max(0, frontier.length - sampled),
    coverage,
    deadEnds,
    softlocks,
    unverified,
    rejected,
    engineErrors,
    outcomes,
    categoryMax,
    finalMin: Number.isFinite(finalMin) ? finalMin : 0,
    finalMax: Number.isFinite(finalMax) ? finalMax : 0,
    scoreLoops: [...scoreLoops].slice(0, LIST_LIMIT),
    penaltyLoops: [...penaltyLoops].slice(0, LIST_LIMIT),
    leaks,
  };
}

/** `start()` bile çalışmadığında dönen boş sonuç. */
function emptyResult(c: CompiledCase, engineErrors: ExploreResult['engineErrors']): ExploreResult {
  const none = { total: 0, reached: 0, missing: [] };
  return {
    complete: false,
    aborted: false,
    states: 0,
    edges: 0,
    walks: 0,
    frontierUnchecked: 0,
    coverage: {
      nodes: none,
      choices: none,
      variants: none,
      rules: none,
      fallbacks: none,
      objects: none,
      evidence: none,
      statements: none,
      outcomes: none,
    },
    deadEnds: [],
    softlocks: [],
    unverified: [],
    rejected: [],
    engineErrors,
    outcomes: Object.fromEntries(c.outcomes.map((o) => [o.id, { reached: false }])),
    categoryMax: Object.fromEntries(Category.options.map((k) => [k, 0])) as Record<Category, number>,
    finalMin: 0,
    finalMax: 0,
    scoreLoops: [],
    penaltyLoops: [],
    leaks: [],
  };
}
