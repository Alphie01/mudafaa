import { Category } from '@mudafaa/case-schema';
import type { Action, ChoiceDef } from '@mudafaa/case-schema';
import { act, computeScore, enumerateActions, evalCond, getOwn, start, view } from '@mudafaa/engine';
import type { CompiledCase, EngineEvent, SessionState } from '@mudafaa/engine';
import { analyzeLiveness } from './liveness.js';
import { reducer } from './reduce.js';

export type CoverageKind =
  'nodes' | 'choices' | 'variants' | 'rules' | 'fallbacks' | 'objects' | 'evidence' | 'statements' | 'outcomes';

export interface ExploreResult {
  /** BFS indirgenmiş durum uzayını sınırlara takılmadan bitirdi mi. */
  complete: boolean;
  states: number;
  edges: number;
  walks: number;
  coverage: Record<CoverageKind, { total: number; reached: number; missing: string[] }>;
  deadEnds: { key: string; witness: Action[] }[];
  softlocks: { key: string; witness: Action[] }[];
  /** Kaçış araması bütçesi içinde doğrulanamayan durumlar (uyarı). */
  unverified: { key: string; witness: Action[] }[];
  outcomes: Record<string, { reached: boolean; witness?: Action[]; finalMin?: number; finalMax?: number }>;
  categoryMax: Record<Category, number>;
  finalMin: number;
  finalMax: number;
  scoreLoops: string[];
  leaks: { key: string; token: string }[];
}

export interface ExploreOptions {
  /** BFS'in en çok indirgenmiş durum sayısı (varsayılan 250 000). */
  maxStates?: number;
  /** Toplam süre bütçesi, ms (varsayılan 60 000); BFS en çok yarısını kullanır. */
  maxMs?: number;
  /** Tohumlu rastgele yürüyüş sayısı (varsayılan 400). */
  walks?: number;
  /** Bir yürüyüşün en çok adımı (varsayılan 400). */
  walkSteps?: number;
  /** Ek senaryolar (golden path'ler): baştan oynatılır, kapsama ve sızıntı denetimine katılır. */
  scripts?: readonly (readonly Action[])[];
}

/** Bir anahtarın skor aralığı BFS'te bu kadar kez genişlerse (döngüyle şişen skor) `scoreLoops` sayılır. */
const WIDEN_LIMIT = 64;
/** Raporlanan listelerin üst sınırı. */
const LIST_LIMIT = 20;
/** Kaçış araması başına en çok durum. */
const ESCAPE_BUDGET = 4_000;
/** Kaçışı denetlenecek BFS sınır durumu örneği. */
const FRONTIER_SAMPLE = 200;
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

/**
 * Durum uzayı keşfi. Dört aşama, ortak bir indirgenmiş durum grafiği üzerinde: (1) bütçeli BFS (canlılık indirgemeli
 * anahtarla; skor anahtar başına aralık olarak izlenir), (2) golden path'ler ve tohumlu rastgele yürüyüşler (derin
 * durumlar için; yarısı soruşturmayı erken bırakmamaya çalışır), (3) softlock denetimi: tamamen genişletilmiş ama bitişe
 * ve bilinmeyene geri erişimi olmayan durumlar kesin softlock'tur; bitmeyen yürüyüşlerin sonları ve BFS sınırından bir
 * örnek, RESULT'a statik uzaklıkla yönlendirilen kaçış aramasıyla denetlenir, (4) kapsam, sonuçlar, skor sınırları,
 * skor döngüleri ve görünüm sızıntıları.
 */
export function explore(c: CompiledCase, opts: ExploreOptions = {}): ExploreResult {
  const maxStates = opts.maxStates ?? 250_000;
  const maxMs = opts.maxMs ?? 60_000;
  const walkCount = opts.walks ?? 400;
  const walkSteps = opts.walkSteps ?? 400;
  const began = performance.now();
  const elapsed = (): number => performance.now() - began;
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
    let s = start(c).state;
    for (const a of actions) {
      const r = act(c, s, a);
      if (!r.ok) return undefined;
      s = r.state;
    }
    return s;
  };

  const keys = new Map<string, KeyInfo>();
  const succ = new Map<string, Set<string>>();
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
  const leaks: ExploreResult['leaks'] = [];
  const leakSeen = new Set<string>();
  const leakChecked = new Set<string>();
  const deadEnds: ExploreResult['deadEnds'] = [];
  const deadKeys = new Set<string>();
  const reps = new Map<string, number[]>();

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

  /** Görünüm sızıntısı: aynı node, bulunmuş deliller ve görünür seçenek/ifade kümesi için bir kez denetlenir. */
  const checkLeaks = (s: SessionState, key: string): void => {
    const node = c.nodes.get(s.nodeId)?.def;
    if (node === undefined || node.type === 'DECISION' || leaks.length >= LIST_LIMIT) return;
    const ctx = { c, s };
    const visible = (ch: ChoiceDef): boolean =>
      PLAYER.has(ch.kind) && (ch.visibleWhen === undefined || evalCond(ch.visibleWhen, ctx));
    const statements =
      node.type === 'COURTROOM'
        ? (node.statements ?? []).filter((st) => st.visibleWhen === undefined || evalCond(st.visibleWhen, ctx))
        : [];
    for (const st of statements) reached.statements.add(st.id);
    const signature = JSON.stringify([
      s.nodeId,
      Object.keys(s.evidence).sort(),
      Object.keys(s.found).sort(),
      node.choices.filter(visible).map((ch) => ch.id),
      statements.map((st) => st.id),
    ]);
    if (leakChecked.has(signature)) return;
    leakChecked.add(signature);
    const texts: string[] = [];
    const values = new Set<string>();
    const idVals = new Set<string>();
    viewStrings(view(c, s, META), '', texts, values, idVals);
    const shown = new Set<string>();
    if (node.type === 'EVIDENCE') shown.add(node.evidence);
    if (node.type === 'COURTROOM' && node.prosecutionEvidence !== undefined) shown.add(node.prosecutionEvidence);
    const leak = (token: string): void => {
      if (leakSeen.has(token) || leaks.length >= LIST_LIMIT) return;
      leakSeen.add(token);
      leaks.push({ key, token });
    };
    for (const ev of c.evidence.values()) {
      if (getOwn(s.evidence, ev.id) !== undefined || shown.has(ev.id)) continue;
      if (values.has(ev.id)) leak(ev.id);
      if (ev.title.trim() !== '' && texts.some((t) => t.includes(ev.title))) leak(ev.title);
    }
    for (const ch of node.choices) if (!visible(ch) && values.has(ch.id)) leak(ch.id);
    for (const { obj } of c.objects.values()) {
      if (obj.marker === 'HIDDEN' && getOwn(s.found, obj.id) === undefined && values.has(obj.id)) leak(obj.id);
    }
    for (const v of c.vars.values()) if (v.visibility === 'HIDDEN' && idVals.has(v.id)) leak(v.id);
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

  /**
   * Bir durumu grafa kaydeder. Dönen `fresh`: anahtar yeni ya da skor aralığını genişletti (BFS yeniden genişletir).
   * `id`, bu duruma giden tanık zincirinin kaydı (`always` ise anahtar bilinse de yeni kayıt açılır).
   */
  const observe = (
    s: SessionState,
    from: number,
    action: Action | null,
    fromKey: string | undefined,
    always: boolean,
  ): { key: string; id: number; fresh: boolean; known: boolean } => {
    const key = reduce(s);
    if (fromKey !== undefined) edge(fromKey, key);
    const final = s.outcome?.final ?? computeScore(c, s).final;
    const cats = Category.options.map((k) => s.score.cat[k]);
    Category.options.forEach((k, i) => {
      categoryMax[k] = Math.max(categoryMax[k], cats[i] ?? 0);
    });
    const done = s.status === 'COMPLETED';
    const info = keys.get(key);
    const keepRep = (id: number): void => {
      const list = reps.get(s.nodeId) ?? [];
      if (!done && list.length < REPS_PER_NODE) reps.set(s.nodeId, [...list, id]);
    };
    if (info === undefined) {
      const id = record(from, action);
      keepRep(id);
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
      else checkLeaks(s, key);
      return { key, id, fresh: true, known: false };
    }
    const widened = final < info.finalMin || final > info.finalMax || cats.some((v, i) => v > (info.catMax[i] ?? 0));
    let id = -1;
    if (widened || always) id = record(from, action);
    if (widened) {
      info.finalMin = Math.min(info.finalMin, final);
      info.finalMax = Math.max(info.finalMax, final);
      info.catMax = info.catMax.map((v, i) => Math.max(v, cats[i] ?? 0));
      info.widen += 1;
      if (done) onCompleted(s, id);
    }
    return { key, id, fresh: widened, known: true };
  };

  // (1) BFS
  let truncated = false;
  const cutOff = new Set<string>();
  const first = start(c);
  for (const e of first.events) if (e.type === 'NODE_ENTER') reached.nodes.add(e.node);
  for (const ev of c.pkg.evidence) if (ev.initiallyKnown) reached.evidence.add(ev.id);
  const root = observe(first.state, -1, null, undefined, false);
  const queue: ({ id: number; s: SessionState; key: string } | undefined)[] = [
    { id: root.id, s: first.state, key: root.key },
  ];
  for (let head = 0; head < queue.length; head++) {
    if (elapsed() > maxMs / 2) {
      truncated = true;
      break;
    }
    const item = queue[head];
    queue[head] = undefined;
    if (item === undefined) continue;
    const { id, s, key } = item;
    const info = keys.get(key);
    if (info !== undefined) info.expanded = true;
    const actions = enumerateActions(c, s);
    if (actions.length === 0) {
      if (!deadKeys.has(key) && deadEnds.length < LIST_LIMIT) deadEnds.push({ key, witness: witness(id) });
      deadKeys.add(key);
      continue;
    }
    for (const a of actions) {
      const r = act(c, s, a);
      if (!r.ok) continue;
      noteTransition(s, r.state, r.events);
      if (!keys.has(reduce(r.state)) && keys.size >= maxStates) {
        truncated = true;
        cutOff.add(key);
        continue;
      }
      const o = observe(r.state, id, a, key, false);
      if (!o.fresh || r.state.status === 'COMPLETED') continue;
      if (o.known && (keys.get(o.key)?.widen ?? 0) > WIDEN_LIMIT) {
        scoreLoops.add(o.key);
        continue;
      }
      queue.push({ id: o.id, s: r.state, key: o.key });
    }
  }
  const frontier = [...keys].filter(([, i]) => !i.expanded && !i.completed).map(([k]) => k);
  if (frontier.length > 0) truncated = true;

  // (2) Senaryolar ve yürüyüşler
  const stuck: { key: string; id: number; s: SessionState }[] = [];
  const pick = (actions: readonly Action[], s: SessionState, rand: () => number, patient: boolean): Action => {
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
    let pool = actions;
    if (patient && rand() < 0.95) {
      const staying = actions.filter((a) => !leaves(a));
      if (staying.length > 0) pool = staying;
    }
    const fresh = pool.filter((a) =>
      a.kind === 'CHOOSE'
        ? !(a.variant === undefined
            ? reached.choices.has(a.choiceId)
            : reached.variants.has(`${a.choiceId}#${a.variant}`))
        : false,
    );
    if (fresh.length > 0 && rand() < 0.5) pool = fresh;
    return pool[Math.floor(rand() * pool.length)] ?? (actions[0] as Action);
  };
  /**
   * Yürüyüş: verilen durumdan başlar; önce senaryonun ilk `scripted` aksiyonu, sonra (senaryo bütünüyle oynanmıyorsa)
   * rastgele seçim.
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
    const finals = new Map<string, number>([[key, computeScore(c, s).final]]);
    const whole = script !== undefined && scripted >= script.length;
    const steps = whole ? scripted : scripted + walkSteps;
    for (let step = 0; step < steps && s.status === 'ACTIVE'; step++) {
      let a: Action | undefined = step < scripted ? script?.[step] : undefined;
      if (a === undefined) {
        const actions = enumerateActions(c, s);
        if (actions.length === 0) {
          if (!deadKeys.has(key) && deadEnds.length < LIST_LIMIT) deadEnds.push({ key, witness: witness(id) });
          deadKeys.add(key);
          const info = keys.get(key);
          if (info !== undefined) info.expanded = true;
          return;
        }
        a = pick(actions, s, rand, seed % 2 === 1);
      }
      const r = act(c, s, a);
      if (!r.ok) return;
      noteTransition(s, r.state, r.events);
      const o = observe(r.state, id, a, key, true);
      const final = r.state.outcome?.final ?? computeScore(c, r.state).final;
      const before = finals.get(o.key);
      if (before !== undefined && before !== final && r.state.status === 'ACTIVE') scoreLoops.add(o.key);
      finals.set(o.key, final);
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
  for (; walks < walkCount && elapsed() < (maxMs * 3) / 4; walks++) {
    const script = walks % 2 === 0 ? scripts[(walks / 2) % Math.max(1, scripts.length)] : undefined;
    const cut = script === undefined ? 0 : Math.floor(rng(1_000 + walks)() * script.length);
    walk(script, cut, 7 + walks);
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
      if (elapsed() > maxMs || !gapNodes().includes(node)) break;
      const s = replay(witness(repId));
      if (s === undefined || s.nodeId !== node || s.status !== 'ACTIVE') continue;
      const key = reduce(s);
      for (const a of enumerateActions(c, s)) {
        const before = coverageSize();
        const r = act(c, s, a);
        if (!r.ok) continue;
        noteTransition(s, r.state, r.events);
        if (coverageSize() === before) continue;
        const o = observe(r.state, repId, a, key, true);
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

  const softlocks: ExploreResult['softlocks'] = [];
  const unverified: ExploreResult['unverified'] = [];
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
      if (seen.size > ESCAPE_BUDGET || elapsed() > maxMs) return 'budget';
      for (const a of enumerateActions(c, cur.s)) {
        const r = act(c, cur.s, a);
        if (!r.ok) continue;
        noteTransition(cur.s, r.state, r.events);
        const o = observe(r.state, cur.id, a, cur.key, true);
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
  const step = Math.max(1, Math.floor(frontier.length / FRONTIER_SAMPLE));
  for (let i = 0; i < frontier.length && elapsed() < maxMs; i += step) {
    const k = frontier[i];
    const info = k === undefined ? undefined : keys.get(k);
    if (k === undefined || info === undefined || proven.has(k)) continue;
    const w = witness(info.first);
    const s = replay(w);
    if (s !== undefined) judge(s, k, info.first);
  }

  // (4) Kapsam
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
    states: keys.size,
    edges,
    walks,
    coverage,
    deadEnds,
    softlocks,
    unverified,
    outcomes,
    categoryMax,
    finalMin: Number.isFinite(finalMin) ? finalMin : 0,
    finalMax: Number.isFinite(finalMax) ? finalMax : 0,
    scoreLoops: [...scoreLoops].slice(0, LIST_LIMIT),
    leaks,
  };
}
