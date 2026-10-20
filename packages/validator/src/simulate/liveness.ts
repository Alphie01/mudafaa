import type { Cond, Effect, NodeDef, Val } from '@mudafaa/case-schema';
import { maxUsesOf } from '@mudafaa/engine';
import type { CompiledCase } from '@mudafaa/engine';
import { eachEffect, eachValCond } from '../walk.js';

/**
 * Bir node'dan itibaren hâlâ okunabilecek durum parçaları. Yalnızca gidişatı (aksiyonların kullanılabilirliği, geçişler,
 * skor ve sonuç) etkileyen okumalar sayılır; yalnızca görünümü etkileyenler (satır metinleri, ruh hâli, hedefler, vurgu)
 * sayılmaz.
 */
export interface LiveSet {
  vars: Set<string>;
  evidence: Set<string>;
  characters: Set<string>;
  found: Set<string>;
  /** Kullanım sayacı anahtarı → indirgemede tutulacak üst sınır. */
  uses: Map<string, number>;
  /** Ziyaret sayacı (node) → üst sınır. */
  visits: Map<string, number>;
  latches: Set<string>;
  /** `ONCE_PER_PARAMS` fallback kimlikleri. */
  paramUses: Set<string>;
  /** Gidişatı etkileyen bir koşul skoru (`raw` ya da kategori) okuyor mu (sonuç koşulları hariç). */
  score: boolean;
}

const emptyLive = (): LiveSet => ({
  vars: new Set(),
  evidence: new Set(),
  characters: new Set(),
  found: new Set(),
  uses: new Map(),
  visits: new Map(),
  latches: new Set(),
  paramUses: new Set(),
  score: false,
});

const raise = (m: Map<string, number>, k: string, n: number): void => {
  m.set(k, Math.max(m.get(k) ?? 0, n));
};

function mergeInto(into: LiveSet, from: LiveSet): void {
  for (const k of ['vars', 'evidence', 'characters', 'found', 'latches', 'paramUses'] as const) {
    for (const v of from[k]) into[k].add(v);
  }
  for (const [k, n] of from.uses) raise(into.uses, k, n);
  for (const [k, n] of from.visits) raise(into.visits, k, n);
  into.score ||= from.score;
}

/** Sayaç değeri tam tutulacaksa kullanılan sınır (karşılaştırma sabiti bilinmeyen okumalar). */
const EXACT = Number.MAX_SAFE_INTEGER;

/** `{uses}` / `{visits}` bir sayı sabitiyle karşılaştırılıyorsa sabit+1'e kadar ayırt etmek yeter. */
function counterCap(v: Val, other: Val): { kind: 'uses' | 'visits'; id: string; cap: number } | undefined {
  if (typeof v !== 'object' || v === null || typeof other !== 'number') return undefined;
  if ('uses' in v) return { kind: 'uses', id: v.uses, cap: Math.max(1, Math.floor(other) + 1) };
  if ('visits' in v) return { kind: 'visits', id: v.visits, cap: Math.max(1, Math.floor(other) + 1) };
  return undefined;
}

/**
 * Koşul ve değer okumalarını canlı kümeye ekler (`{ref}` yüklemleri çözülerek). `scoreLive` false ise skor okumaları
 * sayılmaz (sonuç koşulları: final skor zaten anahtar başına aralık olarak izlenir).
 */
function readCond(c: CompiledCase, cond: Cond, out: LiveSet, seen = new Set<string>(), scoreLive = true): void {
  if ('all' in cond) for (const x of cond.all) readCond(c, x, out, seen, scoreLive);
  else if ('any' in cond) for (const x of cond.any) readCond(c, x, out, seen, scoreLive);
  else if ('not' in cond) readCond(c, cond.not, out, seen, scoreLive);
  else if ('cmp' in cond) {
    const [l, , r] = cond.cmp;
    const capped = counterCap(l, r) ?? counterCap(r, l);
    if (capped !== undefined) raise(capped.kind === 'uses' ? out.uses : out.visits, capped.id, capped.cap);
    else {
      readVal(c, l, out, seen, scoreLive);
      readVal(c, r, out, seen, scoreLive);
    }
  } else if ('hasEvidence' in cond) out.evidence.add(cond.hasEvidence);
  else if ('met' in cond) out.characters.add(cond.met);
  else if ('visited' in cond) raise(out.visits, cond.visited, 1);
  else if ('chosen' in cond)
    raise(out.uses, cond.variant === undefined ? cond.chosen : `${cond.chosen}#${cond.variant}`, 1);
  else if ('found' in cond) out.found.add(cond.found);
  else if ('flag' in cond) out.vars.add(cond.flag);
  else if ('ref' in cond) {
    if (seen.has(cond.ref)) return;
    seen.add(cond.ref);
    const p = c.predicates.get(cond.ref);
    if (p !== undefined) readCond(c, p, out, seen, scoreLive);
  }
}

function readVal(c: CompiledCase, v: Val, out: LiveSet, seen = new Set<string>(), scoreLive = true): void {
  if (typeof v !== 'object' || v === null) return;
  if ('var' in v) out.vars.add(v.var);
  else if ('uses' in v) raise(out.uses, v.uses, EXACT);
  else if ('visits' in v) raise(out.visits, v.visits, EXACT);
  else if ('score' in v) out.score ||= scoreLive;
  else if ('count' in v) {
    for (const ev of c.evidence.values()) {
      if ((v.kind === undefined || ev.kind === v.kind) && (v.tag === undefined || (ev.tags ?? []).includes(v.tag))) {
        out.evidence.add(ev.id);
      }
    }
  } else if ('if' in v) {
    readVal(c, v.if.then, out, seen, scoreLive);
    readVal(c, v.if.else, out, seen, scoreLive);
  } else {
    for (const part of Object.values(v)) {
      if (Array.isArray(part)) for (const p of part as Val[]) readVal(c, p, out, seen, scoreLive);
      else readVal(c, part as Val, out, seen, scoreLive);
    }
  }
  eachValCond(v, (cond) => readCond(c, cond, out, seen, scoreLive));
}

function readEffects(c: CompiledCase, effects: readonly Effect[] | undefined, out: LiveSet): void {
  eachEffect(effects ?? [], '', (e) => {
    if (e.type === 'VAR') {
      if (e.op !== 'set') out.vars.add(e.var);
      readVal(c, e.value, out);
    } else if (e.type === 'SCORE') readVal(c, e.amount, out);
    else if (e.type === 'IF') readCond(c, e.when, out);
  });
}

/** Etkilerin GOTO/END hedefleri (END bütün RESULT node'larına gider). */
function jumpTargets(c: CompiledCase, effects: readonly Effect[] | undefined, results: readonly string[]): string[] {
  const out: string[] = [];
  eachEffect(effects ?? [], '', (e) => {
    if (e.type === 'GOTO') out.push(e.node);
    if (e.type === 'END') out.push(...results);
  });
  return out;
}

export interface Liveness {
  /** Node'dan itibaren canlı parçalar (yığındaki dönüş node'ları ayrıca birleştirilir). */
  live: Map<string, LiveSet>;
  /** Node'dan bir RESULT node'una statik graf uzaklığı (erişilemiyorsa yok). */
  distance: Map<string, number>;
}

/**
 * Statik canlılık analizi. Node grafı: seçeneklerin `next` hedefleri (`push` dahil, `$return` hariç; dönüş adresleri
 * durumdaki yığından birleştirilir), DECISION rotaları, GOTO/END etkileri, sahne nesnelerinin `inspectNode`'u ve
 * tetikleyici hedefleri (genel tetikleyiciler her node'dan). Bir parça, node'dan erişilebilen bir node'da ya da genel
 * olarak (genel tetikleyiciler, sonuç koşulları, bonuslar, bulunma koşulları) okunuyorsa canlıdır.
 */
export function analyzeLiveness(c: CompiledCase): Liveness {
  const nodes = c.pkg.nodes;
  const results = nodes.filter((n) => n.type === 'RESULT').map((n) => n.id);
  const edges = new Map<string, Set<string>>();
  const local = new Map<string, LiveSet>();
  const global = emptyLive();

  const globalTargets = new Set<string>();
  for (const t of c.triggers) {
    const targets = [...(t.goto === undefined ? [] : [t.goto]), ...jumpTargets(c, t.effects, results)];
    const into = t.scope === undefined ? global : (local.get(t.scope) ?? emptyLive());
    if (t.scope !== undefined) local.set(t.scope, into);
    readCond(c, t.when, into);
    readEffects(c, t.effects, into);
    into.latches.add(t.id);
    into.latches.add(`${t.id}#once`);
    for (const target of targets) {
      if (t.scope === undefined) globalTargets.add(target);
      else {
        const set = edges.get(t.scope) ?? new Set<string>();
        set.add(target);
        edges.set(t.scope, set);
      }
    }
  }
  for (const o of c.outcomes) readCond(c, o.when, global, new Set(), false);
  for (const b of c.pkg.config.scoring.bonuses) readVal(c, b.value, global, new Set(), false);
  if (c.pkg.config.scoring.multiplierPct !== undefined) {
    readVal(c, c.pkg.config.scoring.multiplierPct, global, new Set(), false);
  }
  for (const d of c.pkg.discoveryPaths) if (d.requires !== undefined) readCond(c, d.requires, global);

  const addNode = (n: NodeDef): void => {
    const out = local.get(n.id) ?? emptyLive();
    local.set(n.id, out);
    const targets = edges.get(n.id) ?? new Set<string>();
    edges.set(n.id, targets);
    const cn = c.nodes.get(n.id);
    if (n.onFirstEnter !== undefined) raise(out.visits, n.id, 1);
    readEffects(c, n.onFirstEnter, out);
    readEffects(c, n.onEnter, out);
    for (const t of jumpTargets(c, [...(n.onEnter ?? []), ...(n.onFirstEnter ?? [])], results)) targets.add(t);
    for (const ch of n.choices) {
      if (ch.visibleWhen !== undefined) readCond(c, ch.visibleWhen, out);
      if (ch.enabledWhen !== undefined) readCond(c, ch.enabledWhen, out);
      for (const k of ch.cost ?? []) out.vars.add(k.var);
      readEffects(c, ch.effects, out);
      for (const v of ch.variants ?? []) readEffects(c, v.effects, out);
      const limit = maxUsesOf(ch);
      if (Number.isFinite(limit)) raise(out.uses, ch.id, limit);
      if (ch.repeat === 'ONCE_PER_PARAMS') out.paramUses.add(ch.id);
      const next = ch.next;
      if (typeof next === 'string') {
        if (next !== '$stay' && next !== '$return') targets.add(next);
      } else if (next !== undefined) {
        if ('push' in next) targets.add(next.push);
        else
          for (const r of next.routes) {
            targets.add(r.to);
            if (r.when !== undefined) readCond(c, r.when, out);
          }
      }
      for (const t of jumpTargets(
        c,
        [...(ch.effects ?? []), ...(ch.variants ?? []).flatMap((v) => v.effects ?? [])],
        results,
      )) {
        targets.add(t);
      }
      const m = ch.match;
      if (m !== undefined && 'evidence' in m) for (const id of m.evidence) out.evidence.add(id);
    }
    switch (n.type) {
      case 'DECISION':
        for (const r of n.routes) {
          targets.add(r.to);
          if (r.when !== undefined) readCond(c, r.when, out);
        }
        break;
      case 'SCENE': {
        for (const k of n.actionCosts?.TAP ?? []) out.vars.add(k.var);
        const scene = c.scenes.get(n.scene);
        for (const o of scene?.objects ?? []) {
          raise(out.uses, `obj:${o.id}`, o.maxUses ?? 1);
          if (o.activeWhen !== undefined) readCond(c, o.activeWhen, out);
          readEffects(c, o.effects, out);
          if (o.inspectNode !== undefined) targets.add(o.inspectNode);
          for (const t of jumpTargets(c, o.effects, results)) targets.add(t);
        }
        break;
      }
      case 'DOCUMENT':
        for (const k of n.actionCosts?.EXAMINE ?? []) out.vars.add(k.var);
        break;
      case 'DEDUCTION':
        for (const id of n.pool) out.evidence.add(id);
        break;
      case 'COURTROOM':
        if (n.mode === 'TESTIMONY') {
          for (const st of n.statements ?? []) if (st.visibleWhen !== undefined) readCond(c, st.visibleWhen, out);
          for (const ev of c.evidence.values()) if (ev.presentable) out.evidence.add(ev.id);
        }
        break;
      case 'DIALOGUE':
        if (n.allowPresent === true) for (const ev of c.evidence.values()) out.evidence.add(ev.id);
        break;
      default:
        break;
    }
    void cn;
  };
  for (const n of nodes) addNode(n);

  // Erişilebilirlik kapanışı (genel tetikleyici hedefleri her node'dan erişilebilir).
  const reach = (from: string): Set<string> => {
    const seen = new Set<string>();
    const stack = [from, ...globalTargets];
    while (stack.length > 0) {
      const id = stack.pop();
      if (id === undefined || seen.has(id)) continue;
      seen.add(id);
      for (const t of edges.get(id) ?? []) if (!seen.has(t)) stack.push(t);
    }
    return seen;
  };
  const live = new Map<string, LiveSet>();
  for (const n of nodes) {
    const set = emptyLive();
    mergeInto(set, global);
    for (const id of reach(n.id)) {
      const l = local.get(id);
      if (l !== undefined) mergeInto(set, l);
    }
    live.set(n.id, set);
  }

  // RESULT'a uzaklık: ters graf üzerinde BFS ($return kenarları itme yapan her node'a geri sayılır). Genel tetikleyici
  // hedefleri (ör. çöküş kesintisi) koşullu kesintilerdir; önce onlarsız hesaplanır, yalnızca başka yolu olmayan
  // node'lar için onlarla tamamlanır.
  const pushers = nodes.filter(
    (n) =>
      n.choices.some((ch) => typeof ch.next === 'object' && 'push' in ch.next) ||
      (n.type === 'SCENE' && (c.scenes.get(n.scene)?.objects ?? []).some((o) => o.inspectNode !== undefined)),
  );
  const distances = (withGlobal: boolean): Map<string, number> => {
    const reverse = new Map<string, Set<string>>();
    const link = (from: string, to: string): void => {
      const set = reverse.get(to) ?? new Set<string>();
      set.add(from);
      reverse.set(to, set);
    };
    for (const [from, tos] of edges) for (const to of tos) link(from, to);
    for (const n of nodes) {
      if (withGlobal) for (const t of globalTargets) link(n.id, t);
      if (n.choices.some((ch) => ch.next === '$return')) for (const p of pushers) link(n.id, p.id);
    }
    const out = new Map<string, number>();
    const queue = results.map((id) => {
      out.set(id, 0);
      return id;
    });
    for (let i = 0; i < queue.length; i++) {
      const id = queue[i];
      if (id === undefined) continue;
      const d = out.get(id) ?? 0;
      for (const p of reverse.get(id) ?? []) {
        if (!out.has(p)) {
          out.set(p, d + 1);
          queue.push(p);
        }
      }
    }
    return out;
  };
  const distance = distances(false);
  for (const [id, d] of distances(true)) if (!distance.has(id)) distance.set(id, d);
  return { live, distance };
}
