import type { Category, Effect } from '@mudafaa/case-schema';
import { ctxOf, formatSigned } from './draft.js';
import type { Draft } from './draft.js';
import { EngineError } from './errors.js';
import { evalCond, evalVal } from './expr/eval.js';
import { getOwn } from './own.js';

/** Etkileri sırayla uygular (değişkenler `[min,max]`'a sıkıştırılır; DISCOVER/MEET idempotenttir). */
export function applyEffects(effects: readonly Effect[] | undefined, d: Draft): void {
  for (const e of effects ?? []) applyEffect(e, d);
}

function applyEffect(e: Effect, d: Draft): void {
  switch (e.type) {
    case 'VAR':
      setVar(d, e.var, e.op, evalVal(e.value, ctxOf(d)));
      return;
    case 'SCORE': {
      const amount = evalVal(e.amount, ctxOf(d));
      if (typeof amount !== 'number') throw new EngineError('TYPE', `SCORE tutarı sayı olmalı: ${String(amount)}`);
      addScore(d, e.category, Math.trunc(amount), e.line);
      return;
    }
    case 'DISCOVER':
      discover(d, e.evidence);
      return;
    case 'MEET':
      meet(d, e.character);
      return;
    case 'MARK':
      mark(d, e.quality, e.feedback, e.category);
      return;
    case 'IF':
      applyEffects(evalCond(e.when, ctxOf(d)) ? e.then : e.else, d);
      return;
    case 'GOTO':
      d.goto = e.node;
      return;
    case 'END':
      d.end = e.outcome === undefined ? {} : { outcome: e.outcome };
      return;
  }
}

export function setVar(d: Draft, id: string, op: 'set' | 'inc' | 'dec', value: number | string | boolean): void {
  const def = d.c.vars.get(id);
  if (def === undefined) throw new EngineError('UNKNOWN_VAR', id);
  const from = getOwn(d.s.vars, id);
  let to: number | string | boolean;
  if (def.type === 'int') {
    if (typeof value !== 'number') throw new EngineError('TYPE', `${id} sayı bekliyor`);
    const cur = typeof from === 'number' ? from : 0;
    let n = Math.trunc(op === 'set' ? value : op === 'inc' ? cur + value : cur - value);
    if (def.min !== undefined) n = Math.max(def.min, n);
    if (def.max !== undefined) n = Math.min(def.max, n);
    to = n === 0 ? 0 : n;
  } else {
    if (op !== 'set') throw new EngineError('TYPE', `${id} yalnızca set ile değişir`);
    if (def.type === 'bool' && typeof value !== 'boolean') throw new EngineError('TYPE', `${id} bool bekliyor`);
    if (def.type === 'enum' && (typeof value !== 'string' || !(def.enumValues ?? []).includes(value))) {
      throw new EngineError('TYPE', `${id} için geçersiz enum değeri: ${String(value)}`);
    }
    to = value;
  }
  if (to === from) return;
  d.s.vars[id] = to;
  d.events.push({ type: 'VAR', var: id, from, to });
  if (def.visibility === 'VISIBLE' && def.display !== undefined) {
    if (typeof to === 'number' && typeof from === 'number') {
      d.fx.push({ kind: 'VAR', label: def.display.label, delta: to - from, id });
    } else {
      d.fx.push({ kind: 'VAR', label: def.display.label, id });
    }
  }
}

export function addScore(d: Draft, category: Category, amount: number, line?: string): void {
  if (amount === 0) return;
  d.s.score.cat[category] = (d.s.score.cat[category] ?? 0) + amount;
  const lineId = line ?? d.c.lineByCategory.get(category);
  if (lineId !== undefined) d.s.score.line[lineId] = (getOwn(d.s.score.line, lineId) ?? 0) + amount;
  d.events.push({
    type: 'SCORE',
    category,
    amount,
    ...(lineId === undefined ? {} : { line: lineId }),
    source: d.source,
  });
  d.fx.push({ kind: 'SCORE', label: `${formatSigned(amount)} SKOR`, delta: amount, id: category });
}

export function discover(d: Draft, id: string): void {
  if (getOwn(d.s.evidence, id) !== undefined) return;
  const def = d.c.evidence.get(id);
  if (def === undefined) throw new EngineError('TYPE', `Bilinmeyen delil: ${id}`);
  const mine = (d.c.discovery.get(id) ?? []).filter((p) => p.source.id === d.source);
  if (mine.length > 0 && !mine.some((p) => p.requires === undefined || evalCond(p.requires, ctxOf(d)))) return;
  d.s.evidence[id] = { seq: d.s.seq, via: d.source };
  d.discovered.push(id);
  d.events.push({ type: 'DISCOVER', evidence: id, source: d.source });
  d.fx.push({ kind: 'EVIDENCE', label: def.title, id });
}

export function meet(d: Draft, id: string): void {
  if (getOwn(d.s.characters, id) !== undefined) return;
  const def = d.c.characters.get(id);
  if (def === undefined) throw new EngineError('TYPE', `Bilinmeyen karakter: ${id}`);
  d.s.characters[id] = d.s.seq;
  d.events.push({ type: 'MEET', character: id });
  d.fx.push({ kind: 'CHARACTER', label: def.name, id });
}

export function mark(d: Draft, quality: 'GOOD' | 'BAD' | 'NEUTRAL', feedback: string, category?: Category): void {
  d.s.marks.push({
    seq: d.s.seq,
    source: d.source,
    quality,
    feedback,
    ...(category === undefined ? {} : { category }),
  });
  d.events.push({
    type: 'MARK',
    quality,
    feedback,
    ...(category === undefined ? {} : { category }),
    source: d.source,
  });
}
