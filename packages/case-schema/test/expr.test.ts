import { describe, expect, it } from 'vitest';
import { Cond, Val } from '@mudafaa/case-schema';

// Her Val ve Cond biçiminden en az bir örnek var: şemada bir biçim eksik kalırsa bu tablolar kırılır.
const validVals: [name: string, value: unknown][] = [
  ['number', 42],
  ['negative number', -7],
  ['fractional number', 2.5],
  ['string', 'USUL'],
  ['boolean', true],
  ['var', { var: 'trust' }],
  ['score raw', { score: 'raw' }],
  ['score final', { score: 'final' }],
  ['score cat', { score: 'cat:USUL_BILGISI' }],
  ['count evidence', { count: 'evidence' }],
  ['count evidence by kind EVIDENCE', { count: 'evidence', kind: 'EVIDENCE' }],
  ['count evidence by kind CLUE', { count: 'evidence', kind: 'CLUE' }],
  ['count evidence by tag', { count: 'evidence', tag: 'foto' }],
  ['count evidence by kind and tag', { count: 'evidence', kind: 'INSIGHT', tag: 'foto' }],
  ['uses', { uses: 'tp_night' }],
  ['visits', { visits: 'n_hub' }],
  ['add', { add: [1, 2, 3] }],
  ['sub', { sub: [10, { var: 'cred' }] }],
  ['mul', { mul: [2, 3] }],
  ['div', { div: [{ mul: [200, { var: 'strategy_pct' }] }, 100] }],
  ['min', { min: [{ var: 'ap' }, 1] }],
  ['max', { max: [0, { score: 'raw' }] }],
  ['round', { round: { div: [5, 2] } }],
  ['if', { if: { when: { flag: 'f' }, then: 1, else: { var: 'x' } } }],
];

const invalidVals: [name: string, value: unknown][] = [
  ['null', null],
  ['undefined', undefined],
  ['NaN', Number.NaN],
  ['Infinity', Number.POSITIVE_INFINITY],
  ['bare array', [1, 2]],
  ['empty object', {}],
  ['unknown key', { foo: 1 }],
  ['var with an extra key', { var: 'trust', extra: 1 }],
  ['var with an invalid id', { var: '7x' }],
  ['var that is not a string', { var: 7 }],
  ['score of an unknown category', { score: 'cat:HUKUK' }],
  ['score with a bare cat: prefix', { score: 'cat:' }],
  ['score keyword that does not exist', { score: 'total' }],
  ['count of something other than evidence', { count: 'characters' }],
  ['count with an unknown kind', { count: 'evidence', kind: 'CLUES' }],
  ['count with an invalid tag id', { count: 'evidence', tag: 'not an id' }],
  ['uses with an invalid id', { uses: 'ch#soft' }],
  ['visits with an invalid id', { visits: '7x' }],
  ['sub with one operand', { sub: [1] }],
  ['sub with three operands', { sub: [1, 2, 3] }],
  ['div with one operand', { div: [1] }],
  ['add that is not an array', { add: 1 }],
  // min/max of nothing is undefined (the engine would produce ±Infinity), so the schema refuses it.
  ['min of nothing', { min: [] }],
  ['max of nothing', { max: [] }],
  ['round of an array', { round: [1] }],
  ['if without else', { if: { when: { flag: 'f' }, then: 1 } }],
  ['if with an invalid condition', { if: { when: { flag: '7x' }, then: 1, else: 2 } }],
  ['if with an extra key', { if: { when: { flag: 'f' }, then: 1, else: 2, extra: 3 } }],
  ['two operators in one object', { add: [1], mul: [2] }],
  ['invalid operand deep inside', { add: [1, { mul: [2, { var: '7x' }] }] }],
];

const cmpOps = ['==', '!=', '<', '<=', '>', '>='] as const;

const validConds: [name: string, value: unknown][] = [
  ['all', { all: [{ flag: 'a' }, { flag: 'b' }] }],
  // `all: []` her zaman doğrudur; varsayılan sonucun koşulu budur (OUTCOME_DEFAULT_MISSING).
  ['all of nothing', { all: [] }],
  ['any', { any: [{ flag: 'a' }, { met: 'k' }] }],
  ['any of nothing', { any: [] }],
  ['not', { not: { flag: 'cokus' } }],
  ...cmpOps.map((op): [string, unknown] => [`cmp ${op}`, { cmp: [{ var: 'trust' }, op, 40] }]),
  ['cmp on strings', { cmp: [{ var: 'strategy' }, '==', 'USUL'] }],
  ['hasEvidence', { hasEvidence: 'ev_fis' }],
  ['met', { met: 'k' }],
  ['visited', { visited: 'n_hub' }],
  ['atNode', { atNode: 'n_court1' }],
  ['chosen', { chosen: 'pr_st1' }],
  ['chosen with a variant', { chosen: 'tp_night', variant: 'soft' }],
  ['found', { found: 'o_lamp' }],
  ['flag', { flag: 'cokus' }],
  ['ref', { ref: 'alibi' }],
];

const invalidConds: [name: string, value: unknown][] = [
  ['null', null],
  ['empty object', {}],
  ['bare boolean', true],
  ['bare string', 'cokus'],
  ['unknown operator', { cmp: [1, '=~', 2] }],
  ['cmp with two operands', { cmp: [1, '=='] }],
  ['cmp with four operands', { cmp: [1, '==', 2, 3] }],
  ['cmp with the operator first', { cmp: ['==', 1, 2] }],
  ['misspelled atom', { hasEvidnce: 'x' }],
  ['atom with an extra key', { flag: 'x', extra: 1 }],
  ['two atoms in one object', { flag: 'x', met: 'k' }],
  ['atom with an invalid id', { hasEvidence: 'not an id' }],
  ['variant without chosen', { variant: 'soft' }],
  ['chosen with an invalid variant id', { chosen: 'tp_night', variant: '7x' }],
  ['all that is not an array', { all: { flag: 'a' } }],
  ['all with an invalid member', { all: [{ flag: 'a' }, { nope: 1 }] }],
  ['not of an array', { not: [{ flag: 'a' }] }],
  ['cmp with an invalid operand', { cmp: [{ var: '7x' }, '>=', 1] }],
];

describe('Val', () => {
  it('Val parses nested arithmetic', () => {
    const value = { add: [1, { var: 'trust' }, { mul: [2, { score: 'cat:SORGULAMA' }] }] };
    const result = Val.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

  it.each(validVals)('accepts %s unchanged', (_name, value) => {
    const result = Val.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

  it.each(invalidVals)('rejects %s', (_name, value) => {
    expect(Val.safeParse(value).success).toBe(false);
  });
});

describe('Cond', () => {
  it('Cond parses combinators and atoms', () => {
    const value = {
      all: [{ hasEvidence: 'ev_fis' }, { cmp: [{ var: 'trust' }, '>=', 40] }, { not: { flag: 'cokus' } }],
    };
    const result = Cond.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

  it('Cond rejects unknown operator', () => {
    expect(Cond.safeParse({ cmp: [1, '=~', 2] }).success).toBe(false);
  });

  it.each(validConds)('accepts %s unchanged', (_name, value) => {
    const result = Cond.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

  it.each(invalidConds)('rejects %s', (_name, value) => {
    expect(Cond.safeParse(value).success).toBe(false);
  });
});

describe('Val and Cond recursion', () => {
  it('nest through each other to any depth', () => {
    const inner = { if: { when: { flag: 'a' }, then: 1, else: 2 } };
    const val = { if: { when: { cmp: [inner, '>', 1] }, then: 10, else: 20 } };
    expect(Val.safeParse(val).success).toBe(true);
    expect(Cond.safeParse({ not: { cmp: [val, '==', 10] } }).success).toBe(true);

    let deep: unknown = 0;
    for (let i = 0; i < 50; i += 1) deep = { round: { add: [deep, 1] } };
    expect(Val.safeParse(deep).success).toBe(true);
  });

  it('report an invalid leaf however deep it sits', () => {
    let deep: unknown = { var: '7x' };
    for (let i = 0; i < 20; i += 1) deep = { if: { when: { not: { cmp: [deep, '==', 1] } }, then: 1, else: 2 } };
    expect(Val.safeParse(deep).success).toBe(false);
  });
});
