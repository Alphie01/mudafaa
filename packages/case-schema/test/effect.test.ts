import { describe, expect, it } from 'vitest';
import { Effect, MarkQuality } from '@mudafaa/case-schema';

// Her etki türünden en az bir örnek var: şemada bir tür eksik kalırsa bu tablo kırılır.
const validEffects: [name: string, value: unknown][] = [
  ['VAR set', { type: 'VAR', var: 'strategy_pct', op: 'set', value: 150 }],
  ['VAR inc', { type: 'VAR', var: 'trust', op: 'inc', value: 4 }],
  ['VAR dec by an expression', { type: 'VAR', var: 'trust', op: 'dec', value: { mul: [2, { var: 'wrong' }] } }],
  ['VAR set a flag', { type: 'VAR', var: 'cokus', op: 'set', value: true }],
  ['VAR set an enum value', { type: 'VAR', var: 'strategy', op: 'set', value: 'USUL' }],
  ['SCORE', { type: 'SCORE', category: 'ARASTIRMA', amount: 40 }],
  ['SCORE with a line', { type: 'SCORE', category: 'SORGULAMA', amount: -150, line: 'hatali' }],
  ['DISCOVER', { type: 'DISCOVER', evidence: 'c_a' }],
  ['MEET', { type: 'MEET', character: 'k' }],
  ['MARK GOOD', { type: 'MARK', quality: 'GOOD', feedback: 'İfadedeki çelişkiyi yakaladın.' }],
  ['MARK BAD with a category', { type: 'MARK', quality: 'BAD', feedback: 'Yanlış delil.', category: 'DELIL_ANALIZI' }],
  ['MARK NEUTRAL', { type: 'MARK', quality: 'NEUTRAL', feedback: 'Fark etmez.' }],
  [
    'IF with else',
    {
      type: 'IF',
      when: { flag: 'f' },
      then: [{ type: 'DISCOVER', evidence: 'c_a' }],
      else: [{ type: 'SCORE', category: 'ARASTIRMA', amount: -10 }],
    },
  ],
  [
    'IF without else',
    { type: 'IF', when: { cmp: [{ var: 'cred' }, '<=', 0] }, then: [{ type: 'GOTO', node: 'n_collapse' }] },
  ],
  ['GOTO', { type: 'GOTO', node: 'n_collapse' }],
  ['END', { type: 'END' }],
  ['END with an outcome', { type: 'END', outcome: 'o_lose' }],
];

const invalidEffects: [name: string, value: unknown][] = [
  ['null', null],
  ['bare string', 'VAR'],
  ['empty object', {}],
  ['missing type', { var: 'trust', op: 'inc', value: 1 }],
  ['unknown type', { type: 'TELEPORT', node: 'n_x' }],
  ['lower-case type', { type: 'var', var: 'trust', op: 'inc', value: 1 }],
  ['VAR with an unknown op', { type: 'VAR', var: 'trust', op: 'mul', value: 2 }],
  ['VAR without a value', { type: 'VAR', var: 'trust', op: 'inc' }],
  ['VAR with an invalid var id', { type: 'VAR', var: '7x', op: 'inc', value: 1 }],
  ['VAR with an invalid value expression', { type: 'VAR', var: 'trust', op: 'inc', value: { var: '7x' } }],
  ['VAR with an extra key', { type: 'VAR', var: 'trust', op: 'inc', value: 1, extra: true }],
  ['SCORE without a category', { type: 'SCORE', amount: 40 }],
  ['SCORE without an amount', { type: 'SCORE', category: 'ARASTIRMA' }],
  ['SCORE with an invalid line id', { type: 'SCORE', category: 'ARASTIRMA', amount: 1, line: 'not an id' }],
  ['SCORE with an invalid amount expression', { type: 'SCORE', category: 'ARASTIRMA', amount: { add: 1 } }],
  ['DISCOVER without evidence', { type: 'DISCOVER' }],
  ['DISCOVER with an invalid id', { type: 'DISCOVER', evidence: 'ev fis' }],
  ['MEET without a character', { type: 'MEET' }],
  ['MARK with an unknown quality', { type: 'MARK', quality: 'OK', feedback: 'x' }],
  ['MARK without feedback', { type: 'MARK', quality: 'GOOD' }],
  ['MARK with an unknown category', { type: 'MARK', quality: 'GOOD', feedback: 'x', category: 'HUKUK' }],
  ['IF without when', { type: 'IF', then: [] }],
  ['IF without then', { type: 'IF', when: { flag: 'f' } }],
  ['IF with a then that is not an array', { type: 'IF', when: { flag: 'f' }, then: { type: 'END' } }],
  ['IF with an invalid condition', { type: 'IF', when: { cmp: [1, '=~', 2] }, then: [] }],
  ['IF with an invalid nested effect', { type: 'IF', when: { flag: 'f' }, then: [{ type: 'GOTO' }] }],
  ['IF with an invalid nested else effect', { type: 'IF', when: { flag: 'f' }, then: [], else: [{ type: 'NOPE' }] }],
  ['GOTO without a node', { type: 'GOTO' }],
  ['GOTO with an invalid node id', { type: 'GOTO', node: '$return' }],
  ['END with an invalid outcome id', { type: 'END', outcome: '7x' }],
  ['END with an extra key', { type: 'END', outcome: 'o_lose', extra: 1 }],
];

describe('Effect', () => {
  it('Effect SCORE accepts Val amount', () => {
    const value = {
      type: 'SCORE',
      category: 'SAVUNMA_STRATEJISI',
      amount: { div: [{ mul: [200, { var: 'strategy_pct' }] }, 100] },
      line: 'savunma',
    };
    const result = Effect.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

  it('Effect rejects unknown category', () => {
    expect(Effect.safeParse({ type: 'SCORE', category: 'HUKUK', amount: 10 }).success).toBe(false);
  });

  it('MarkQuality is exactly GOOD, BAD and NEUTRAL', () => {
    expect(MarkQuality.options).toEqual(['GOOD', 'BAD', 'NEUTRAL']);
  });

  it.each(validEffects)('accepts %s unchanged', (_name, value) => {
    const result = Effect.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

  it.each(invalidEffects)('rejects %s', (_name, value) => {
    expect(Effect.safeParse(value).success).toBe(false);
  });

  it('nests IF inside IF and takes conditions with nested expressions', () => {
    const value = {
      type: 'IF',
      when: { all: [{ hasEvidence: 'i_ab' }, { cmp: [{ if: { when: { flag: 'a' }, then: 1, else: 2 } }, '>', 1] }] },
      then: [
        { type: 'IF', when: { flag: 'b' }, then: [{ type: 'MEET', character: 'w' }], else: [{ type: 'END' }] },
        { type: 'GOTO', node: 'n_obj' },
      ],
      else: [{ type: 'IF', when: { not: { flag: 'b' } }, then: [{ type: 'DISCOVER', evidence: 'c_b' }] }],
    };
    const result = Effect.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

  it('reports an invalid effect however deep it sits', () => {
    let deep: unknown = { type: 'GOTO', node: '7x' };
    for (let i = 0; i < 20; i += 1) deep = { type: 'IF', when: { flag: 'f' }, then: [deep] };
    expect(Effect.safeParse(deep).success).toBe(false);
  });

  it('keeps Turkish text byte for byte', () => {
    const feedback = '“Sokak lambası yanıyordu” — İ ı ş ğ −150';
    const result = Effect.parse({ type: 'MARK', quality: 'GOOD', feedback });
    expect(result).toEqual({ type: 'MARK', quality: 'GOOD', feedback });
    expect(result.type === 'MARK' && result.feedback === feedback).toBe(true);
  });
});
