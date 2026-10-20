import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { Category, SessionView } from '@mudafaa/case-schema';
import type { Action } from '@mudafaa/case-schema';
import { EngineError, act, enumerateActions, migrateState, start, stateHash, view } from '../src/index.js';
import type { EngineEvent, SessionState } from '../src/index.js';
import { GP_WIN, compiled, play } from './helpers/run.js';

const c = compiled();
const META = { sessionId: 'ses_p', caseId: 'case_p', stateVersion: 0, mode: 'NORMAL' as const };
const HIDDEN = c.pkg.variables.filter((v) => v.visibility === 'HIDDEN').map((v) => v.id);
const scoreSum = (events: readonly EngineEvent[]): number =>
  events.reduce((sum, e) => sum + (e.type === 'SCORE' ? e.amount : 0), 0);

/** `picks` ile `enumerateActions` içinden seçerek yürür; her adımda değişmezleri denetler. */
function walk(picks: readonly number[]): { log: Action[]; hashes: string[]; state: SessionState } {
  const first = start(c);
  let s = first.state;
  let scored = scoreSum(first.events);
  const log: Action[] = [];
  const hashes: string[] = [stateHash(s)];
  for (const pick of picks) {
    const options = enumerateActions(c, s);
    if (options.length === 0) break;
    const a = options[pick % options.length];
    if (a === undefined) break;
    const r = act(c, s, a);
    if (!r.ok) throw new Error(`${s.nodeId}: ${JSON.stringify(a)} → ${r.code}`);
    s = r.state;
    scored += scoreSum(r.events);
    log.push(a);
    hashes.push(stateHash(s));
    for (const v of c.pkg.variables) {
      const x = s.vars[v.id];
      if (v.type !== 'int' || typeof x !== 'number') continue;
      if (v.min !== undefined) expect(x).toBeGreaterThanOrEqual(v.min);
      if (v.max !== undefined) expect(x).toBeLessThanOrEqual(v.max);
    }
    expect(Category.options.reduce((sum, k) => sum + s.score.cat[k], 0)).toBe(scored);
    const v = view(c, s, META);
    expect(SessionView.safeParse(v).success).toBe(true);
    const text = JSON.stringify(v);
    for (const id of HIDDEN) expect(text).not.toContain(`"${id}"`);
  }
  return { log, hashes, state: s };
}

const picks = fc.array(fc.nat({ max: 1000 }), { maxLength: 60 });

describe('properties', () => {
  it('random walks keep invariants', () => {
    fc.assert(
      fc.property(picks, (p) => {
        walk(p);
      }),
      { seed: 7, numRuns: 200 },
    );
  });

  it('replay determinism', () => {
    fc.assert(
      fc.property(picks, (p) => {
        const first = walk(p);
        let s = start(c).state;
        const hashes = [stateHash(s)];
        for (const a of first.log) {
          const r = act(c, s, a);
          if (!r.ok) throw new Error(r.code);
          s = r.state;
          hashes.push(stateHash(s));
        }
        expect(hashes).toEqual(first.hashes);
      }),
      { seed: 7, numRuns: 50 },
    );
  });
});

describe('migrateState', () => {
  it('schema 1 round-trips through JSON', () => {
    const s = play(c, GP_WIN.slice(0, 10));
    const restored = migrateState(JSON.parse(JSON.stringify(s)));
    expect(stateHash(restored)).toBe(stateHash(s));
    expect(restored).not.toBe(s);
  });

  it('unknown schema and malformed state are rejected', () => {
    const s = start(c).state;
    for (const bad of [null, 'x', { ...s, schema: 2 }, { ...s, stack: 'n_hub' }, { ...s, vars: [] }]) {
      expect(() => migrateState(bad)).toThrow(EngineError);
    }
  });
});
