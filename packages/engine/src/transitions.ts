import type { Next, ResponseBlock, TriggerDef } from '@mudafaa/case-schema';
import { ctxOf } from './draft.js';
import type { Draft } from './draft.js';
import { applyEffects } from './effects.js';
import { EngineError } from './errors.js';
import { evalCond, evalVal } from './expr/eval.js';
import { getOwn } from './own.js';
import { computeScore, selectOutcome } from './scoring.js';

/** Aksiyon başına en fazla node girişi ve tetikleyici ateşlemesi (aşılırsa aksiyon `LOOP_LIMIT` ile reddedilir). */
export const MAX_HOPS = 16;
export const MAX_STACK = 4;

export type RejectCode =
  | 'SESSION_NOT_ACTIVE'
  | 'ACTION_NOT_ALLOWED'
  | 'CHOICE_UNAVAILABLE'
  | 'RESOURCE_EXHAUSTED'
  | 'INVALID_PARAMS'
  | 'NO_MATCH'
  | 'LOOP_LIMIT';

/** Aksiyonu yan etkisiz reddeden iç sinyal (`act` yakalar ve `{ok:false}` döndürür). */
export class Reject extends Error {
  readonly code: RejectCode;
  constructor(code: RejectCode, message: string) {
    super(message);
    this.name = 'Reject';
    this.code = code;
  }
}

/** `when` koşulunu tutan ilk yanıt bloğunun satırlarını sonuca ekler. */
export function pushResponses(d: Draft, blocks: readonly ResponseBlock[] | undefined): void {
  const block = (blocks ?? []).find((b) => b.when === undefined || evalCond(b.when, ctxOf(d)));
  if (block !== undefined) d.lines.push(...block.lines);
}

/** Node'a girer: ziyaret sayacı, giriş etkileri, anlatı satırları; DECISION hemen yönlendirir, RESULT davayı bitirir. */
export function enterNode(d: Draft, id: string): void {
  d.hops += 1;
  if (d.hops > MAX_HOPS) throw new Reject('LOOP_LIMIT', 'Aksiyon başına node geçiş sınırı aşıldı');
  const node = d.c.nodes.get(id);
  if (node === undefined) throw new EngineError('TYPE', `Bilinmeyen node: ${id}`);
  d.s.nodeId = id;
  d.nodeChanged = true;
  const before = getOwn(d.s.visits, id) ?? 0;
  d.s.visits[id] = before + 1;
  d.events.push({ type: 'NODE_ENTER', node: id });
  const saved = d.source;
  d.source = id;
  if (before === 0) applyEffects(node.def.onFirstEnter, d);
  applyEffects(node.def.onEnter, d);
  d.source = saved;
  const start = d.lines.length;
  pushResponses(d, node.def.lines);
  d.entry = { node: id, start, count: d.lines.length - start };
  if (d.goto !== undefined || d.end !== undefined) return;
  if (node.def.type === 'DECISION') {
    const route = node.def.routes.find((r) => r.when === undefined || evalCond(r.when, ctxOf(d)));
    // Eşleşen rota yoksa oturum görünümü olmayan bir node'da kalırdı: aksiyon hiçbir şey kaydedilmeden düşer.
    if (route === undefined) throw new EngineError('TYPE', `DECISION ${id}: eşleşen rota yok`);
    enterNode(d, route.to);
    return;
  }
  if (node.def.type === 'RESULT') finalize(d);
}

/** Seçeneğin `next`'ini uygular (GOTO/END bekliyorsa onları `settle` işler). */
export function resolveNext(d: Draft, next: Next | undefined): void {
  if (d.goto !== undefined || d.end !== undefined) return;
  const n = next ?? '$stay';
  if (n === '$stay') return;
  if (n === '$return') {
    const back = d.s.stack.pop();
    if (back !== undefined) enterNode(d, back);
    return;
  }
  if (typeof n === 'string') {
    enterNode(d, n);
    return;
  }
  if ('push' in n) {
    if (d.s.stack.length >= MAX_STACK) throw new Reject('LOOP_LIMIT', 'Node yığını derinlik sınırı aşıldı');
    d.s.stack.push(d.s.nodeId);
    enterNode(d, n.push);
    return;
  }
  const route = n.routes.find((r) => r.when === undefined || evalCond(r.when, ctxOf(d)));
  if (route !== undefined) enterNode(d, route.to);
}

/** Davayı bitirir: skor, sonuç (END ile zorlanmış ya da önceliğe göre), XP; durum `COMPLETED`. */
export function finalize(d: Draft): void {
  if (d.s.status === 'COMPLETED') return;
  const score = computeScore(d.c, d.s);
  const forced = d.end?.outcome;
  const outcome =
    forced === undefined ? selectOutcome(d.c, d.s, score.final) : d.c.outcomes.find((o) => o.id === forced);
  if (outcome === undefined) throw new EngineError('TYPE', `Bilinmeyen sonuç: ${String(forced)}`);
  const xpVal = evalVal(outcome.xp, ctxOf(d, score.final));
  if (typeof xpVal !== 'number') throw new EngineError('TYPE', 'xp sayı olmalı');
  const xp = Math.max(0, Math.floor(xpVal));
  d.s.outcome = { id: outcome.id, raw: score.raw, final: score.final, xp };
  d.s.status = 'COMPLETED';
  d.events.push({ type: 'OUTCOME', id: outcome.id, raw: score.raw, final: score.final, xp });
  d.fx.push({ kind: 'VERDICT', label: outcome.stamp, id: outcome.id });
}

const onceKey = (id: string): string => `${id}#once`;

/**
 * Bir tetikleyici turu. Kapsamdaki (genel + mevcut node'a bağlı) tetikleyicilerin hepsi aynı durum üzerinde
 * değerlendirilir: koşulu false olanın mandalı düşer (yeniden kurulur); koşulu true ve mandalı düşük olanlardan
 * öncelikçe ilki ateşlenir ve mandalı kalkar. Aynı turda yükselen diğerleri kurulu kalır, koşulları sürerse sonraki
 * turda ateşlenir. Kapsam dışındaki tetikleyici gözlenmez; mandalı olduğu gibi kalır. Ateşleme olduysa true döner.
 */
function triggerPass(d: Draft): boolean {
  let chosen: TriggerDef | undefined;
  for (const t of d.c.triggers) {
    if (t.scope !== undefined && t.scope !== d.s.nodeId) continue;
    if (t.once === true && getOwn(d.s.latches, onceKey(t.id)) === true) continue;
    if (!evalCond(t.when, ctxOf(d))) d.s.latches[t.id] = false;
    else if (chosen === undefined && getOwn(d.s.latches, t.id) !== true) chosen = t;
  }
  if (chosen === undefined) return false;
  d.s.latches[chosen.id] = true;
  d.triggerFires += 1;
  if (d.triggerFires > MAX_HOPS) throw new Reject('LOOP_LIMIT', 'Aksiyon başına tetikleyici sınırı aşıldı');
  d.events.push({ type: 'TRIGGER', id: chosen.id });
  const saved = d.source;
  d.source = chosen.id;
  applyEffects(chosen.effects, d);
  d.source = saved;
  if (chosen.goto !== undefined) d.goto = chosen.goto;
  if (chosen.once === true) d.s.latches[onceKey(chosen.id)] = true;
  return true;
}

/** Bekleyen GOTO/END'i izler ve tetikleyicileri sakinleşene kadar çalıştırır. */
export function settle(d: Draft): void {
  for (;;) {
    if (d.end !== undefined && d.s.status !== 'COMPLETED') {
      const result = d.c.pkg.nodes.find((n) => n.type === 'RESULT');
      if (result === undefined) throw new EngineError('TYPE', 'END için RESULT node yok');
      d.goto = undefined;
      d.s.stack = [];
      enterNode(d, result.id);
      finalize(d);
      continue;
    }
    if (d.goto !== undefined) {
      const target = d.goto;
      d.goto = undefined;
      d.s.stack = [];
      enterNode(d, target);
      continue;
    }
    if (d.s.status === 'COMPLETED') return;
    if (!triggerPass(d)) return;
  }
}
