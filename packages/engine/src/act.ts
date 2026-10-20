import type { Action, ActionKind, ActionResult, ChoiceDef, Cost, Feedback, NodeDef, Rect } from '@mudafaa/case-schema';
import { ctxOf, newDraft } from './draft.js';
import type { Draft, EngineEvent } from './draft.js';
import { applyEffects, mark } from './effects.js';
import { evalCond, variantKey } from './expr/eval.js';
import { getOwn } from './own.js';
import { boundingRect, clampRect, hitTest } from './resolve/hit-test.js';
import { Reject, pushResponses, resolveNext, settle } from './transitions.js';
import type { RejectCode } from './transitions.js';
import type { CNode, CompiledCase, SessionState } from './types.js';

export interface ActOk {
  ok: true;
  state: SessionState;
  events: EngineEvent[];
  result: ActionResult;
}
export interface ActReject {
  ok: false;
  code: RejectCode;
  message: string;
}

interface Outcome {
  resolution: ActionResult['resolution'];
  feedback?: Feedback | undefined;
  hit?: { objectId: string; rect: Rect; text: string };
}

const PLAYER_KINDS: ReadonlySet<string> = new Set(['OPTION', 'TOPIC', 'NAVIGATE', 'CONTINUE']);
const UNAVAILABLE = 'Bu seçenek şu anda kullanılamıyor.';

/** Node türüne/moduna göre kabul edilen aksiyon türleri. */
export function acceptedKinds(def: NodeDef): readonly ActionKind[] {
  switch (def.type) {
    case 'DIALOGUE':
      return def.allowPresent === true ? ['CHOOSE', 'PRESENT'] : ['CHOOSE'];
    case 'SCENE':
      return ['CHOOSE', 'TAP'];
    case 'DOCUMENT':
      return ['CHOOSE', 'EXAMINE'];
    case 'DEDUCTION':
      return ['CHOOSE', 'COMBINE'];
    case 'COURTROOM':
      return def.mode === 'TESTIMONY' ? ['CHOOSE', 'PRESS', 'PRESENT', 'OBJECT'] : ['CHOOSE'];
    case 'DECISION':
    case 'RESULT':
      return [];
    default:
      return ['CHOOSE'];
  }
}

/** Varsayılan kullanım sınırı: OPTION/TOPIC 1; NAVIGATE/CONTINUE sınırsız; kurallar 1. */
export function maxUsesOf(ch: ChoiceDef): number {
  if (ch.maxUses !== undefined) return ch.maxUses;
  return ch.kind === 'NAVIGATE' || ch.kind === 'CONTINUE' || ch.kind === 'FALLBACK' ? Infinity : 1;
}

const usesOf = (d: Draft, key: string): number => getOwn(d.s.uses, key) ?? 0;
const bump = (d: Draft, key: string): void => {
  d.s.uses[key] = usesOf(d, key) + 1;
};
const condsOk = (d: Draft, ch: ChoiceDef): boolean =>
  (ch.visibleWhen === undefined || evalCond(ch.visibleWhen, ctxOf(d))) &&
  (ch.enabledWhen === undefined || evalCond(ch.enabledWhen, ctxOf(d)));

/** Maliyet karşılanabilir mi (aynı değişkene birden çok maliyet toplanır). */
export function affordable(s: SessionState, costs: readonly Cost[] | undefined): boolean {
  const need = new Map<string, number>();
  for (const cost of costs ?? []) need.set(cost.var, (need.get(cost.var) ?? 0) + cost.amount);
  for (const [v, amount] of need) {
    const have = getOwn(s.vars, v);
    if (typeof have !== 'number' || have < amount) return false;
  }
  return true;
}

function pay(d: Draft, costs: readonly Cost[] | undefined): void {
  if (!affordable(d.s, costs)) throw new Reject('RESOURCE_EXHAUSTED', 'Yeterli kaynak yok.');
  applyEffects(
    (costs ?? []).map((cost) => ({ type: 'VAR' as const, var: cost.var, op: 'dec' as const, value: cost.amount })),
    d,
  );
}

function applyQuality(d: Draft, q: ChoiceDef['quality']): void {
  if (q !== undefined) mark(d, q.q, q.feedback, q.category);
}

/** Kural ya da fallback uygulaması: etkiler, kalite, sayaç, yanıt, geçiş. */
function applyRule(d: Draft, rule: ChoiceDef): void {
  d.source = rule.id;
  applyEffects(rule.effects, d);
  applyQuality(d, rule.quality);
  bump(d, rule.id);
  pushResponses(d, rule.responses);
  resolveNext(d, rule.next);
}

/** Fallback bu parametreyle daha önce uygulandıysa (ONCE_PER_PARAMS) true. */
function fallbackSpent(d: Draft, fb: ChoiceDef, key: string): boolean {
  return fb.repeat === 'ONCE_PER_PARAMS' && (getOwn(d.s.paramUses, fb.id) ?? []).includes(key);
}

function applyFallback(d: Draft, fb: ChoiceDef, key: string): void {
  if (fb.repeat === 'ONCE_PER_PARAMS') d.s.paramUses[fb.id] = [...(getOwn(d.s.paramUses, fb.id) ?? []), key];
  applyRule(d, fb);
}

/** Kural ya da fallback ile çözülen parametrik aksiyonların ortak akışı. */
function resolveRuleOrFallback(
  d: Draft,
  node: CNode,
  kind: 'EXAMINE' | 'COMBINE' | 'PRESENT' | 'OBJECT',
  rule: ChoiceDef | undefined,
  key: string,
  costs: readonly Cost[] | undefined,
): Outcome {
  if (rule !== undefined) {
    if (usesOf(d, rule.id) >= maxUsesOf(rule)) {
      pushResponses(d, rule.responses);
      return { resolution: 'NOOP', feedback: rule.feedback };
    }
    pay(d, costs);
    applyRule(d, rule);
    return { resolution: 'RULE', feedback: rule.feedback };
  }
  const fb = node.fallbacks[kind];
  if (fb === undefined) throw new Reject('NO_MATCH', 'Bu girdi için tanımlı bir sonuç yok.');
  if (fallbackSpent(d, fb, key)) {
    pushResponses(d, fb.responses);
    return { resolution: 'NOOP', feedback: fb.feedback };
  }
  pay(d, costs);
  applyFallback(d, fb, key);
  return { resolution: 'FALLBACK', feedback: fb.feedback };
}

function doChoose(d: Draft, node: CNode, a: Extract<Action, { kind: 'CHOOSE' }>): Outcome {
  const ch = node.choices.get(a.choiceId);
  if (ch === undefined || !PLAYER_KINDS.has(ch.kind) || !condsOk(d, ch)) {
    throw new Reject('CHOICE_UNAVAILABLE', UNAVAILABLE);
  }
  const exhausted = usesOf(d, ch.id) >= maxUsesOf(ch);
  if (exhausted && ch.repeat !== 'NOOP') throw new Reject('CHOICE_UNAVAILABLE', UNAVAILABLE);
  const variants = ch.variants ?? [];
  let variant: (typeof variants)[number] | undefined;
  if (variants.length > 0) {
    variant = variants.find((v) => v.id === a.variant);
    if (variant === undefined) throw new Reject('INVALID_PARAMS', 'Geçerli bir varyant seçilmeli.');
  } else if (a.variant !== undefined) {
    throw new Reject('INVALID_PARAMS', 'Bu seçeneğin varyantı yok.');
  }
  if (exhausted) {
    pushResponses(d, variant?.responses ?? ch.responses);
    return { resolution: 'NOOP', feedback: ch.feedback };
  }
  d.source = ch.id;
  pay(d, ch.cost);
  applyEffects(ch.effects, d);
  if (variant !== undefined) applyEffects(variant.effects, d);
  applyQuality(d, ch.quality);
  if (variant !== undefined) applyQuality(d, variant.quality);
  bump(d, ch.id);
  if (variant !== undefined) bump(d, variantKey(ch.id, variant.id));
  pushResponses(d, variant?.responses ?? ch.responses);
  resolveNext(d, ch.next);
  return { resolution: 'CHOICE', feedback: ch.feedback };
}

function doTap(d: Draft, node: CNode, a: Extract<Action, { kind: 'TAP' }>): Outcome {
  if (node.def.type !== 'SCENE') throw new Reject('ACTION_NOT_ALLOWED', 'Bu ekranda dokunma yapılamaz.');
  const scene = d.c.scenes.get(node.def.scene);
  if (scene === undefined) throw new Reject('INVALID_PARAMS', 'Sahne bulunamadı.');
  if (a.x < 0 || a.y < 0 || a.x >= scene.width || a.y >= scene.height) {
    throw new Reject('INVALID_PARAMS', 'Dokunma sahnenin dışında.');
  }
  const costs = node.def.actionCosts?.TAP;
  const obj = hitTest(scene, a.x, a.y, (o) => o.activeWhen === undefined || evalCond(o.activeWhen, ctxOf(d)));
  if (obj !== null) {
    const first = obj.shapes[0];
    const rect = clampRect(first === undefined ? { x: 0, y: 0, w: 1, h: 1 } : boundingRect(first), scene);
    const hit = { objectId: obj.id, rect, text: obj.feedback.text };
    const key = `obj:${obj.id}`;
    if (usesOf(d, key) >= (obj.maxUses ?? 1)) {
      return { resolution: 'NOOP', feedback: { text: obj.feedback.text, tone: 'info' }, hit };
    }
    pay(d, costs);
    d.source = obj.id;
    applyEffects(obj.effects, d);
    if (getOwn(d.s.found, obj.id) === undefined) d.s.found[obj.id] = d.s.seq;
    bump(d, key);
    if (obj.inspectNode !== undefined) resolveNext(d, { push: obj.inspectNode });
    return { resolution: 'HIT', feedback: { text: obj.feedback.text, tone: 'success' }, hit };
  }
  const fb = node.fallbacks.TAP;
  if (fb === undefined) throw new Reject('NO_MATCH', 'Bu girdi için tanımlı bir sonuç yok.');
  const key = `${a.x},${a.y}`;
  if (fallbackSpent(d, fb, key)) {
    pushResponses(d, fb.responses);
    return { resolution: 'NOOP', feedback: fb.feedback };
  }
  pay(d, costs);
  applyFallback(d, fb, key);
  return { resolution: 'MISS', feedback: fb.feedback };
}

function doExamine(d: Draft, node: CNode, a: Extract<Action, { kind: 'EXAMINE' }>): Outcome {
  if (node.def.type !== 'DOCUMENT') throw new Reject('ACTION_NOT_ALLOWED', 'Bu ekranda inceleme yapılamaz.');
  if (!node.def.tools.some((t) => t.id === a.tool) || !node.def.rows.some((r) => r.id === a.target)) {
    throw new Reject('INVALID_PARAMS', 'Bilinmeyen alet ya da satır.');
  }
  const rule = node.rules.EXAMINE.find(
    (r) =>
      r.match !== undefined &&
      'tool' in r.match &&
      r.match.tool === a.tool &&
      r.match.target === a.target &&
      condsOk(d, r),
  );
  return resolveRuleOrFallback(d, node, 'EXAMINE', rule, `${a.tool}|${a.target}`, node.def.actionCosts?.EXAMINE);
}

function doCombine(d: Draft, node: CNode, a: Extract<Action, { kind: 'COMBINE' }>): Outcome {
  if (node.def.type !== 'DEDUCTION') throw new Reject('ACTION_NOT_ALLOWED', 'Bu ekranda birleştirme yapılamaz.');
  const pool = node.def.pool;
  const usable = (id: string): boolean =>
    pool.includes(id) && getOwn(d.s.evidence, id) !== undefined && d.c.evidence.get(id)?.combinable === true;
  if (a.a === a.b || !usable(a.a) || !usable(a.b)) throw new Reject('INVALID_PARAMS', 'Bu ipuçları birleştirilemez.');
  const pair = [a.a, a.b].sort().join('+');
  const rule = node.rules.COMBINE.find(
    (r) => r.match !== undefined && 'a' in r.match && [r.match.a, r.match.b].sort().join('+') === pair && condsOk(d, r),
  );
  return resolveRuleOrFallback(d, node, 'COMBINE', rule, pair, undefined);
}

function visibleStatement(d: Draft, node: CNode, id: string | undefined): boolean {
  if (id === undefined || node.def.type !== 'COURTROOM') return false;
  const st = (node.def.statements ?? []).find((s) => s.id === id);
  return st !== undefined && (st.visibleWhen === undefined || evalCond(st.visibleWhen, ctxOf(d)));
}

function doPress(d: Draft, node: CNode, a: Extract<Action, { kind: 'PRESS' }>): Outcome {
  if (!visibleStatement(d, node, a.statementId)) throw new Reject('INVALID_PARAMS', 'Bu ifade yok.');
  const rule = node.rules.PRESS.find(
    (r) => r.match !== undefined && 'statement' in r.match && r.match.statement === a.statementId && condsOk(d, r),
  );
  if (rule === undefined) return { resolution: 'NOOP' };
  if (usesOf(d, rule.id) >= maxUsesOf(rule)) {
    pushResponses(d, rule.responses);
    return { resolution: 'NOOP', feedback: rule.feedback };
  }
  applyRule(d, rule);
  return { resolution: 'RULE', feedback: rule.feedback };
}

function doPresent(d: Draft, node: CNode, a: Extract<Action, { kind: 'PRESENT' }>): Outcome {
  const ev = d.c.evidence.get(a.evidenceId);
  if (ev === undefined || getOwn(d.s.evidence, a.evidenceId) === undefined) {
    throw new Reject('INVALID_PARAMS', 'Bu delil elinizde yok.');
  }
  if (node.def.type === 'COURTROOM') {
    if (!ev.presentable) throw new Reject('INVALID_PARAMS', 'Bu delil mahkemede sunulamaz.');
    if (!visibleStatement(d, node, a.statementId)) throw new Reject('INVALID_PARAMS', 'Bir ifade seçilmeli.');
  }
  const rule = node.rules.PRESENT.find(
    (r) =>
      r.match !== undefined &&
      'evidence' in r.match &&
      (r.match.statement === undefined || r.match.statement === a.statementId) &&
      r.match.evidence.includes(a.evidenceId) &&
      condsOk(d, r),
  );
  return resolveRuleOrFallback(d, node, 'PRESENT', rule, `${a.statementId ?? ''}|${a.evidenceId}`, undefined);
}

function doObject(d: Draft, node: CNode, a: Extract<Action, { kind: 'OBJECT' }>): Outcome {
  if (node.def.type !== 'COURTROOM' || !(node.def.objectionGrounds ?? []).includes(a.groundId)) {
    throw new Reject('INVALID_PARAMS', 'Bu itiraz gerekçesi kullanılamaz.');
  }
  if (a.statementId !== undefined && !visibleStatement(d, node, a.statementId)) {
    throw new Reject('INVALID_PARAMS', 'Bu ifade yok.');
  }
  const rule = node.rules.OBJECT.find(
    (r) =>
      r.match !== undefined &&
      'ground' in r.match &&
      r.match.ground === a.groundId &&
      (r.match.statement === undefined || r.match.statement === a.statementId) &&
      condsOk(d, r),
  );
  return resolveRuleOrFallback(d, node, 'OBJECT', rule, `${a.statementId ?? ''}|${a.groundId}`, undefined);
}

function perform(d: Draft, node: CNode, a: Action): Outcome {
  switch (a.kind) {
    case 'CHOOSE':
      return doChoose(d, node, a);
    case 'TAP':
      return doTap(d, node, a);
    case 'EXAMINE':
      return doExamine(d, node, a);
    case 'COMBINE':
      return doCombine(d, node, a);
    case 'PRESS':
      return doPress(d, node, a);
    case 'PRESENT':
      return doPresent(d, node, a);
    case 'OBJECT':
      return doObject(d, node, a);
  }
}

/**
 * Bir oyuncu aksiyonunu uygular. Saf fonksiyondur: girdi durumu değişmez; kabul edilirse yeni durum, olaylar ve sonuç
 * döner, reddedilirse (`{ok:false}`) hiçbir şey değişmez.
 */
export function act(c: CompiledCase, s: SessionState, a: Action): ActOk | ActReject {
  if (s.status !== 'ACTIVE') return { ok: false, code: 'SESSION_NOT_ACTIVE', message: 'Oturum aktif değil.' };
  const node = c.nodes.get(s.nodeId);
  if (node === undefined || !acceptedKinds(node.def).includes(a.kind)) {
    return { ok: false, code: 'ACTION_NOT_ALLOWED', message: 'Bu aksiyon bu ekranda yapılamaz.' };
  }
  const d = newDraft(c, s, s.nodeId);
  d.s.seq += 1;
  try {
    const out = perform(d, node, a);
    settle(d);
    const result: ActionResult = {
      resolution: out.resolution,
      ...(out.feedback === undefined ? {} : { feedback: out.feedback }),
      lines: d.lines,
      fx: d.fx,
      discovered: d.discovered,
      ...(out.hit === undefined ? {} : { hit: out.hit }),
      nodeChanged: d.nodeChanged,
      completed: d.s.status === 'COMPLETED',
    };
    d.s.last = result;
    return { ok: true, state: d.s, events: d.events, result };
  } catch (e) {
    if (e instanceof Reject) return { ok: false, code: e.code, message: e.message };
    throw e;
  }
}
