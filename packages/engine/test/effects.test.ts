import { describe, expect, it } from 'vitest';
import { applyEffects, initialState, newDraft } from '../src/index.js';
import { compiled, miniPkg } from './helpers/run.js';

function draft(patch: (s: ReturnType<typeof initialState>) => void = () => {}, pkg = miniPkg()) {
  const c = compiled(pkg);
  const s = initialState(c);
  patch(s);
  return newDraft(c, s, 'src');
}

describe('applyEffects', () => {
  it('VAR inc clamps to max and emits nothing when unchanged', () => {
    const d = draft();
    applyEffects([{ type: 'VAR', var: 'cred', op: 'inc', value: 5 }], d);
    expect(d.s.vars.cred).toBe(3);
    expect(d.fx).toHaveLength(0);
    expect(d.events).toHaveLength(0);
  });

  it('VAR dec clamps to min', () => {
    const d = draft((s) => {
      s.vars.taps = 0;
    });
    applyEffects([{ type: 'VAR', var: 'taps', op: 'dec', value: 1 }], d);
    expect(d.s.vars.taps).toBe(0);
  });

  it('SCORE Val amount with strategy_pct', () => {
    const d = draft((s) => {
      s.vars.strategy_pct = 150;
    });
    applyEffects(
      [
        {
          type: 'SCORE',
          category: 'SAVUNMA_STRATEJISI',
          amount: { div: [{ mul: [200, { var: 'strategy_pct' }] }, 100] },
        },
      ],
      d,
    );
    expect(d.s.score.cat.SAVUNMA_STRATEJISI).toBe(300);
    expect(d.s.score.line.savunma).toBe(300);
    expect(d.fx[0]?.label).toBe('+300 SKOR');
  });

  it('negative SCORE label uses U+2212', () => {
    const d = draft();
    applyEffects([{ type: 'SCORE', category: 'SORGULAMA', amount: -150, line: 'hatali' }], d);
    expect(d.fx[0]?.label).toBe('−150 SKOR');
    expect(d.s.score.line.hatali).toBe(-150);
    expect(d.s.score.line.capraz).toBeUndefined();
  });

  it('DISCOVER idempotent', () => {
    const d = draft();
    applyEffects([{ type: 'DISCOVER', evidence: 'c_a' }], d);
    const seq = d.s.evidence.c_a?.seq;
    applyEffects([{ type: 'DISCOVER', evidence: 'c_a' }], d);
    expect(d.events.filter((e) => e.type === 'DISCOVER')).toHaveLength(1);
    expect(d.s.evidence.c_a?.seq).toBe(seq);
  });

  it('DISCOVER respects discovery path requires', () => {
    const pkg = miniPkg();
    (pkg.variables as unknown[]).push({ id: 'never_var', type: 'bool', initial: false, visibility: 'HIDDEN' });
    const path = (pkg.discoveryPaths as { evidence: string; requires?: unknown }[]).find((p) => p.evidence === 'c_uv');
    if (!path) throw new Error('fixture');
    path.requires = { flag: 'never_var' };
    const d = draft(() => {}, pkg);
    d.source = 'ex_uv_r2';
    applyEffects([{ type: 'DISCOVER', evidence: 'c_uv' }], d);
    expect(d.s.evidence.c_uv).toBeUndefined();
  });

  it('IF picks else branch', () => {
    const d = draft();
    applyEffects(
      [
        {
          type: 'IF',
          when: { cmp: [{ var: 'cred' }, '<', 0] },
          then: [{ type: 'VAR', var: 'pers', op: 'set', value: 9 }],
          else: [{ type: 'VAR', var: 'pers', op: 'set', value: 7 }],
        },
      ],
      d,
    );
    expect(d.s.vars.pers).toBe(7);
  });

  it('MARK appends with source', () => {
    const d = draft();
    applyEffects([{ type: 'MARK', quality: 'GOOD', feedback: 'iyi', category: 'SORGULAMA' }], d);
    expect(d.s.marks).toEqual([{ seq: 0, source: 'src', quality: 'GOOD', feedback: 'iyi', category: 'SORGULAMA' }]);
  });
});
