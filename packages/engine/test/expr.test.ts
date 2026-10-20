import type { Cond, Effect, Val } from '@mudafaa/case-schema';
import { describe, expect, it } from 'vitest';
import { EngineError, collectRefs, evalCond, evalVal, getOwn, newRefSet, typeOf, variantKey } from '../src/index.js';
import type { RefSet } from '../src/index.js';
import { makeCtx } from './helpers/ctx.js';

const expectEngineError = (fn: () => unknown, code: EngineError['code']): void => {
  let caught: unknown;
  try {
    fn();
  } catch (error) {
    caught = error;
  }
  expect(caught).toBeInstanceOf(EngineError);
  expect((caught as EngineError).code).toBe(code);
};

/** RefSet'i karşılaştırması kolay, sıralı dizilere çevirir. */
const plain = (refs: RefSet) => Object.fromEntries(Object.entries(refs).map(([key, set]) => [key, [...set].sort()]));
const none = {
  vars: [],
  evidence: [],
  characters: [],
  nodes: [],
  choices: [],
  objects: [],
  predicates: [],
  categories: [],
};
const only = (patch: Partial<Record<keyof RefSet, string[]>>) => ({ ...none, ...patch });

// Kimlikler `constructor`, `toString` gibi sözcükler de olabilir (Ruling 18); düz nesnelerden kalıtılan bu adlar
// "yok" okunmalıdır.
const PROTOTYPE_NAMES = ['constructor', 'toString', 'hasOwnProperty', 'valueOf', '__proto__'];

describe('evalVal', () => {
  it('div floors', () => {
    const ctx = makeCtx();
    expect(evalVal({ div: [7, 2] }, ctx)).toBe(3);
    expect(evalVal({ div: [-7, 2] }, ctx)).toBe(-4);
    expect(evalVal({ div: [5, 0] }, ctx)).toBe(0);
    // Bölen negatif; tam bölünme; sıfıra bölme bölünenin işaretinden bağımsız 0 verir.
    expect(evalVal({ div: [7, -2] }, ctx)).toBe(-4);
    expect(evalVal({ div: [-7, -2] }, ctx)).toBe(3);
    expect(evalVal({ div: [6, 3] }, ctx)).toBe(2);
    expect(evalVal({ div: [-5, 0] }, ctx)).toBe(0);
    expect(evalVal({ div: [-1, 5] }, ctx)).toBe(-1);
    // Strateji çarpanı kalıbı (docs/plan.md): 200 × %150 / 100.
    expect(evalVal({ div: [{ mul: [200, 150] }, 100] }, ctx)).toBe(300);
  });

  it('round half up', () => {
    const ctx = makeCtx();
    expect(evalVal({ round: 2.5 }, ctx)).toBe(3);
    expect(evalVal({ round: 2.4 }, ctx)).toBe(2);
    expect(evalVal({ round: 0.5 }, ctx)).toBe(1);
    // "Yukarı" +∞ yönüdür: yarım negatifte sıfıra doğru gider.
    expect(evalVal({ round: -2.5 }, ctx)).toBe(-2);
    expect(evalVal({ round: -2.6 }, ctx)).toBe(-3);
    expect(evalVal({ round: { mul: [0.5, 5] } }, ctx)).toBe(3);
  });

  it('never produces negative zero', () => {
    // toBe, Object.is ile karşılaştırır: −0 ile 0 ayrışır. Durum ve skor +0 ile kalmalı.
    const ctx = makeCtx();
    expect(evalVal({ round: -0.2 }, ctx)).toBe(0);
    expect(evalVal({ round: -0.5 }, ctx)).toBe(0);
    expect(evalVal({ mul: [0, -5] }, ctx)).toBe(0);
    expect(evalVal({ div: [0, -5] }, ctx)).toBe(0);
    expect(evalVal({ sub: [0, 0] }, ctx)).toBe(0);
    expect(evalVal({ add: [-0, -0] }, ctx)).toBe(0);
    expect(evalVal(-0, ctx)).toBe(0);
  });

  it('if selects branch', () => {
    const expr: Val = { if: { when: { flag: 'f' }, then: 1, else: 2 } };
    expect(evalVal(expr, makeCtx({ vars: { f: false } }))).toBe(2);
    expect(evalVal(expr, makeCtx({ vars: { f: true } }))).toBe(1);
  });

  it('if evaluates only the selected branch', () => {
    // Seçilmeyen dal değerlendirilmez: burada ctx.final yok, bu yüzden değerlendirilseydi FINAL_UNAVAILABLE fırlardı.
    const expr: Val = { if: { when: { flag: 'f' }, then: { score: 'final' }, else: 2 } };
    expect(evalVal(expr, makeCtx({ vars: { f: false } }))).toBe(2);
    expectEngineError(() => evalVal(expr, makeCtx({ vars: { f: true } })), 'FINAL_UNAVAILABLE');
    const nested: Val = {
      if: {
        when: { cmp: [{ var: 'trust' }, '>=', 40] },
        then: { if: { when: { flag: 'f' }, then: 10, else: 20 } },
        else: 30,
      },
    };
    expect(evalVal(nested, makeCtx())).toBe(20);
    expect(evalVal(nested, makeCtx({ vars: { trust: 10 } }))).toBe(30);
  });

  it('score raw sums categories', () => {
    const ctx = makeCtx({ cat: { SORGULAMA: 300, USUL_BILGISI: -50 } });
    expect(evalVal({ score: 'raw' }, ctx)).toBe(250);
    expect(evalVal({ score: 'cat:SORGULAMA' }, ctx)).toBe(300);
    expect(evalVal({ score: 'cat:USUL_BILGISI' }, ctx)).toBe(-50);
    expect(evalVal({ score: 'cat:ARASTIRMA' }, ctx)).toBe(0);
    expect(evalVal({ score: 'raw' }, makeCtx())).toBe(0);
    // Altı kategorinin hepsi toplanır.
    const all = makeCtx({
      cat: { HUKUKI_BILGI: 1, DELIL_ANALIZI: 2, ARASTIRMA: 4, SORGULAMA: 8, SAVUNMA_STRATEJISI: 16, USUL_BILGISI: 32 },
    });
    expect(evalVal({ score: 'raw' }, all)).toBe(63);
  });

  it('score final requires ctx.final', () => {
    expectEngineError(() => evalVal({ score: 'final' }, makeCtx()), 'FINAL_UNAVAILABLE');
    expect(evalVal({ score: 'final' }, makeCtx({ final: 1430 }))).toBe(1430);
    // 0 ve negatif final geçerli değerlerdir; yalnızca `undefined` "yok" demektir.
    expect(evalVal({ score: 'final' }, makeCtx({ final: 0 }))).toBe(0);
    expect(evalVal({ score: 'final' }, makeCtx({ final: -450 }))).toBe(-450);
    expect(evalCond({ cmp: [{ score: 'final' }, '>=', 1000] }, makeCtx({ final: 1430 }))).toBe(true);
    // `raw` final'e bağlı değildir.
    expect(evalVal({ score: 'raw' }, makeCtx({ final: 1430 }))).toBe(0);
  });

  it('count evidence by kind', () => {
    const ctx = makeCtx({ evidence: ['e_key', 'c_a'] });
    expect(evalVal({ count: 'evidence', kind: 'CLUE' }, ctx)).toBe(1);
    expect(evalVal({ count: 'evidence', kind: 'EVIDENCE' }, ctx)).toBe(1);
    expect(evalVal({ count: 'evidence', kind: 'INSIGHT' }, ctx)).toBe(0);
    expect(evalVal({ count: 'evidence' }, ctx)).toBe(2);
    expect(evalVal({ count: 'evidence' }, makeCtx())).toBe(0);
  });

  it('count evidence by tag counts only found evidence', () => {
    const ctx = makeCtx({
      evidence: ['e_key', 'c_a', 'c_b'],
      tags: { e_key: ['t_x'], c_a: ['t_night'], c_b: ['t_night', 't_x'], e_doc: ['t_night'] },
    });
    // e_doc etiketli ama bulunmadı: sayılmaz.
    expect(evalVal({ count: 'evidence', tag: 't_night' }, ctx)).toBe(2);
    expect(evalVal({ count: 'evidence', tag: 't_x' }, ctx)).toBe(2);
    expect(evalVal({ count: 'evidence', kind: 'CLUE', tag: 't_x' }, ctx)).toBe(1);
    expect(evalVal({ count: 'evidence', kind: 'EVIDENCE', tag: 't_night' }, ctx)).toBe(0);
    expect(evalVal({ count: 'evidence', tag: 't_none' }, ctx)).toBe(0);
  });

  it('chosen with variant', () => {
    const ctx = makeCtx({ uses: { 'tp_night#soft': 1 } });
    expect(evalCond({ chosen: 'tp_night', variant: 'soft' }, ctx)).toBe(true);
    expect(evalCond({ chosen: 'tp_night', variant: 'hard' }, ctx)).toBe(false);
    // Varyantsız `chosen` varyant anahtarına değil seçeneğin kendi sayacına bakar.
    expect(evalCond({ chosen: 'tp_night' }, ctx)).toBe(false);
    expect(evalCond({ chosen: 'tp_night' }, makeCtx({ uses: { tp_night: 2 } }))).toBe(true);
    expect(evalCond({ chosen: 'tp_night' }, makeCtx())).toBe(false);
  });

  it('variantKey joins choice and variant ids', () => {
    expect(variantKey('tp_night', 'soft')).toBe('tp_night#soft');
  });

  it('cmp numeric and enum equality', () => {
    const ctx = makeCtx({ vars: { strategy: 'USUL' } });
    expect(evalCond({ cmp: [{ var: 'trust' }, '>=', 40] }, ctx)).toBe(true);
    expect(evalCond({ cmp: [{ var: 'trust' }, '>=', 51] }, ctx)).toBe(false);
    expect(evalCond({ cmp: [{ var: 'strategy' }, '==', 'USUL'] }, ctx)).toBe(true);
    expect(evalCond({ cmp: [{ var: 'strategy' }, '==', 'MASUMIYET'] }, ctx)).toBe(false);
    expect(evalCond({ cmp: [{ var: 'strategy' }, '!=', 'USUL'] }, ctx)).toBe(false);
    expect(evalCond({ cmp: [{ var: 'strategy' }, '!=', 'MASUMIYET'] }, ctx)).toBe(true);
  });

  it('cmp supports every operator on numbers, bools and variable operands', () => {
    const ctx = makeCtx(); // trust 50, cred 3, f false
    const cmp = (l: Val, op: '==' | '!=' | '<' | '<=' | '>' | '>=', r: Val) => evalCond({ cmp: [l, op, r] }, ctx);
    expect(cmp({ var: 'trust' }, '==', 50)).toBe(true);
    expect(cmp({ var: 'trust' }, '!=', 50)).toBe(false);
    expect(cmp({ var: 'trust' }, '<', 50)).toBe(false);
    expect(cmp({ var: 'trust' }, '<=', 50)).toBe(true);
    expect(cmp({ var: 'trust' }, '>', 50)).toBe(false);
    expect(cmp({ var: 'trust' }, '>=', 50)).toBe(true);
    expect(cmp({ var: 'cred' }, '<', { var: 'trust' })).toBe(true);
    expect(cmp({ add: [{ var: 'cred' }, 2] }, '==', 5)).toBe(true);
    expect(cmp({ var: 'f' }, '==', false)).toBe(true);
    expect(cmp({ var: 'f' }, '!=', true)).toBe(true);
    expect(cmp(true, '==', { var: 'f' })).toBe(false);
  });

  it('cmp rejects operands of different types and ordering on non-numbers', () => {
    const ctx = makeCtx();
    expectEngineError(() => evalCond({ cmp: [{ var: 'trust' }, '==', '50'] }, ctx), 'TYPE');
    expectEngineError(() => evalCond({ cmp: [{ var: 'f' }, '==', 0] }, ctx), 'TYPE');
    expectEngineError(() => evalCond({ cmp: [{ var: 'strategy' }, '<', 'USUL'] }, ctx), 'TYPE');
    expectEngineError(() => evalCond({ cmp: [true, '>=', false] }, ctx), 'TYPE');
    expectEngineError(() => evalCond({ cmp: [1, '<', 'a'] }, ctx), 'TYPE');
  });

  it('unknown var throws UNKNOWN_VAR', () => {
    const ctx = makeCtx();
    expectEngineError(() => evalVal({ var: 'nope' }, ctx), 'UNKNOWN_VAR');
    expectEngineError(() => evalCond({ cmp: [{ var: 'nope' }, '>=', 1] }, ctx), 'UNKNOWN_VAR');
    expectEngineError(() => evalCond({ flag: 'nope' }, ctx), 'UNKNOWN_VAR');
    expectEngineError(() => evalVal({ add: [1, { var: 'nope' }] }, ctx), 'UNKNOWN_VAR');
  });

  it('reads variable values of every type', () => {
    const ctx = makeCtx({ vars: { strategy: 'INDIRIM', f: true } });
    expect(evalVal({ var: 'trust' }, ctx)).toBe(50);
    expect(evalVal({ var: 'strategy' }, ctx)).toBe('INDIRIM');
    expect(evalVal({ var: 'f' }, ctx)).toBe(true);
  });

  it('returns literals as they are', () => {
    const ctx = makeCtx();
    expect(evalVal(42, ctx)).toBe(42);
    expect(evalVal(2.5, ctx)).toBe(2.5);
    expect(evalVal(-7, ctx)).toBe(-7);
    expect(evalVal('USUL', ctx)).toBe('USUL');
    expect(evalVal(true, ctx)).toBe(true);
    expect(evalVal(false, ctx)).toBe(false);
  });

  it('add, sub and mul fold their operands', () => {
    const ctx = makeCtx(); // trust 50, cred 3
    expect(evalVal({ add: [1, 2, 3] }, ctx)).toBe(6);
    expect(evalVal({ add: [{ var: 'trust' }, { var: 'cred' }, -3] }, ctx)).toBe(50);
    expect(evalVal({ sub: [10, 4] }, ctx)).toBe(6);
    expect(evalVal({ sub: [4, 10] }, ctx)).toBe(-6);
    expect(evalVal({ mul: [2, 3, 4] }, ctx)).toBe(24);
    expect(evalVal({ mul: [{ var: 'cred' }, 100] }, ctx)).toBe(300);
    // Boş toplam 0, boş çarpım 1'dir (şema boş add/mul'u reddetmez).
    expect(evalVal({ add: [] }, ctx)).toBe(0);
    expect(evalVal({ mul: [] }, ctx)).toBe(1);
  });

  it('min and max pick from the operands and reject an empty list', () => {
    const ctx = makeCtx();
    expect(evalVal({ min: [5, 2, 9] }, ctx)).toBe(2);
    expect(evalVal({ max: [5, 2, 9] }, ctx)).toBe(9);
    expect(evalVal({ min: [{ var: 'trust' }, 100] }, ctx)).toBe(50);
    expect(evalVal({ max: [{ var: 'cred' }, { var: 'trust' }] }, ctx)).toBe(50);
    expect(evalVal({ min: [-3] }, ctx)).toBe(-3);
    expect(evalVal({ max: [-3, -8] }, ctx)).toBe(-3);
    // Şema boş listeyi reddeder ama TS tipi izin verir: ±Infinity yerine TYPE.
    expectEngineError(() => evalVal({ min: [] }, ctx), 'TYPE');
    expectEngineError(() => evalVal({ max: [] }, ctx), 'TYPE');
  });

  it('arithmetic rejects non-numeric operands', () => {
    const ctx = makeCtx();
    expectEngineError(() => evalVal({ add: ['a', 1] }, ctx), 'TYPE');
    expectEngineError(() => evalVal({ add: [{ var: 'f' }, 1] }, ctx), 'TYPE');
    expectEngineError(() => evalVal({ sub: [true, 1] }, ctx), 'TYPE');
    expectEngineError(() => evalVal({ mul: [2, { var: 'strategy' }] }, ctx), 'TYPE');
    expectEngineError(() => evalVal({ div: [1, 'x'] }, ctx), 'TYPE');
    expectEngineError(() => evalVal({ min: [1, 'x'] }, ctx), 'TYPE');
    expectEngineError(() => evalVal({ max: [false] }, ctx), 'TYPE');
    expectEngineError(() => evalVal({ round: 'x' }, ctx), 'TYPE');
  });

  it('reads uses and visits counters, absent ones as 0', () => {
    const ctx = makeCtx({ uses: { ch_a: 2 }, visits: { n_hub: 3 } });
    expect(evalVal({ uses: 'ch_a' }, ctx)).toBe(2);
    expect(evalVal({ uses: 'ch_b' }, ctx)).toBe(0);
    expect(evalVal({ visits: 'n_hub' }, ctx)).toBe(3);
    expect(evalVal({ visits: 'n_talk' }, ctx)).toBe(0);
  });

  it('rejects malformed expressions with TYPE', () => {
    const ctx = makeCtx();
    expectEngineError(() => evalVal({} as unknown as Val, ctx), 'TYPE');
    expectEngineError(() => evalVal({ nope: 1 } as unknown as Val, ctx), 'TYPE');
    expectEngineError(() => evalVal(null as unknown as Val, ctx), 'TYPE');
    expectEngineError(() => evalVal(undefined as unknown as Val, ctx), 'TYPE');
    expectEngineError(() => evalVal({ score: 'cat:NOPE' } as unknown as Val, ctx), 'TYPE');
    expectEngineError(() => evalVal({ score: 'cat:constructor' } as unknown as Val, ctx), 'TYPE');
    expectEngineError(() => evalVal({ sub: [1] } as unknown as Val, ctx), 'TYPE');
  });
});

describe('evalCond', () => {
  it('all and any short-circuit and handle empty lists', () => {
    const ctx = makeCtx();
    // `{all:[]}` her zaman doğrudur (varsayılan sonucun koşulu); `{any:[]}` hiçbir zaman.
    expect(evalCond({ all: [] }, ctx)).toBe(true);
    expect(evalCond({ any: [] }, ctx)).toBe(false);
    expect(evalCond({ all: [{ flag: 'f' }, { flag: 'f' }] }, ctx)).toBe(false);
    expect(evalCond({ all: [{ not: { flag: 'f' } }, { cmp: [{ var: 'trust' }, '>', 0] }] }, ctx)).toBe(true);
    expect(evalCond({ any: [{ flag: 'f' }, { cmp: [{ var: 'trust' }, '>', 0] }] }, ctx)).toBe(true);
    expect(evalCond({ any: [{ flag: 'f' }, { cmp: [{ var: 'trust' }, '<', 0] }] }, ctx)).toBe(false);
    // Kısa devre: ilk false/true'dan sonrası değerlendirilmez (yoksa UNKNOWN_VAR fırlardı).
    expect(evalCond({ all: [{ flag: 'f' }, { flag: 'nope' }] }, ctx)).toBe(false);
    expect(evalCond({ any: [{ not: { flag: 'f' } }, { flag: 'nope' }] }, ctx)).toBe(true);
    expectEngineError(() => evalCond({ all: [{ not: { flag: 'f' } }, { flag: 'nope' }] }, ctx), 'UNKNOWN_VAR');
  });

  it('not negates', () => {
    const ctx = makeCtx();
    expect(evalCond({ not: { flag: 'f' } }, ctx)).toBe(true);
    expect(evalCond({ not: { not: { flag: 'f' } } }, ctx)).toBe(false);
    expect(evalCond({ not: { all: [] } }, ctx)).toBe(false);
  });

  it('flag is true only for a bool variable that is true', () => {
    expect(evalCond({ flag: 'f' }, makeCtx({ vars: { f: true } }))).toBe(true);
    expect(evalCond({ flag: 'f' }, makeCtx({ vars: { f: false } }))).toBe(false);
    // bool olmayan değişken `=== true` olmadığı için bayrak sayılmaz.
    expect(evalCond({ flag: 'trust' }, makeCtx())).toBe(false);
    expect(evalCond({ flag: 'strategy' }, makeCtx({ vars: { strategy: 'USUL' } }))).toBe(false);
  });

  it('hasEvidence, met, visited, found and atNode read the state', () => {
    const ctx = makeCtx({
      evidence: ['c_a'],
      characters: { w: 4, k: 0 },
      visits: { n_hub: 2, n_talk: 0 },
      found: { o_lamp: 3 },
      nodeId: 'n_hub',
    });
    expect(evalCond({ hasEvidence: 'c_a' }, ctx)).toBe(true);
    expect(evalCond({ hasEvidence: 'c_b' }, ctx)).toBe(false);
    expect(evalCond({ met: 'w' }, ctx)).toBe(true);
    // Kayıt değeri 0 olabilir (ör. başlangıçta tanışılan karakter): "var" sayılması için doğruluk değil varlık bakılır.
    expect(evalCond({ met: 'k' }, ctx)).toBe(true);
    expect(evalCond({ met: 'j' }, ctx)).toBe(false);
    expect(evalCond({ visited: 'n_hub' }, ctx)).toBe(true);
    expect(evalCond({ visited: 'n_talk' }, ctx)).toBe(false);
    expect(evalCond({ visited: 'n_scene' }, ctx)).toBe(false);
    expect(evalCond({ found: 'o_lamp' }, ctx)).toBe(true);
    expect(evalCond({ found: 'o_cam' }, ctx)).toBe(false);
    expect(evalCond({ found: 'o_lamp' }, makeCtx({ found: { o_lamp: 0 } }))).toBe(true);
    expect(evalCond({ atNode: 'n_hub' }, ctx)).toBe(true);
    expect(evalCond({ atNode: 'n_talk' }, ctx)).toBe(false);
  });

  it('resolves {ref} through c.predicates', () => {
    // mini-case: p_strong = pers >= 5
    expect(evalCond({ ref: 'p_strong' }, makeCtx({ vars: { pers: 4 } }))).toBe(false);
    expect(evalCond({ ref: 'p_strong' }, makeCtx({ vars: { pers: 5 } }))).toBe(true);
    // Yüklemler birbirini çağırabilir.
    const predicates: { id: string; when: Cond }[] = [
      { id: 'p_both', when: { all: [{ ref: 'p_strong' }, { flag: 'f' }] } },
    ];
    expect(evalCond({ ref: 'p_both' }, makeCtx({ vars: { pers: 6, f: true }, predicates }))).toBe(true);
    expect(evalCond({ ref: 'p_both' }, makeCtx({ vars: { pers: 6, f: false }, predicates }))).toBe(false);
    expect(evalCond({ ref: 'p_both' }, makeCtx({ vars: { pers: 4, f: true }, predicates }))).toBe(false);
  });

  it('unknown predicate throws UNKNOWN_PREDICATE', () => {
    const ctx = makeCtx();
    expectEngineError(() => evalCond({ ref: 'p_missing' }, ctx), 'UNKNOWN_PREDICATE');
    // Yüklemler Map'tedir: prototip adları da "yok" okunur.
    for (const name of PROTOTYPE_NAMES) {
      expectEngineError(() => evalCond({ ref: name }, ctx), 'UNKNOWN_PREDICATE');
    }
  });

  it('rejects malformed conditions with TYPE', () => {
    const ctx = makeCtx();
    expectEngineError(() => evalCond({} as unknown as Cond, ctx), 'TYPE');
    expectEngineError(() => evalCond({ nope: 'x' } as unknown as Cond, ctx), 'TYPE');
    expectEngineError(() => evalCond(null as unknown as Cond, ctx), 'TYPE');
    expectEngineError(() => evalCond('x' as unknown as Cond, ctx), 'TYPE');
  });

  it('does not mutate the state', () => {
    // makeCtx durumu derin dondurur; değiştirmeye kalkan her değerlendirme katı kipte TypeError fırlatırdı.
    const ctx = makeCtx({ evidence: ['c_a'], uses: { ch_a: 1 }, cat: { SORGULAMA: 300 }, final: 100 });
    const before = JSON.stringify(ctx.s);
    evalCond(
      {
        all: [
          { hasEvidence: 'c_a' },
          { cmp: [{ add: [{ score: 'raw' }, { count: 'evidence' }, { uses: 'ch_a' }, { score: 'final' }] }, '>', 0] },
          { ref: 'p_strong' },
        ],
      },
      ctx,
    );
    expect(Object.isFrozen(ctx.s)).toBe(true);
    expect(JSON.stringify(ctx.s)).toBe(before);
  });
});

describe('prototype-named ids (Ruling 18)', () => {
  it.each(PROTOTYPE_NAMES)('an absent var named %s is UNKNOWN_VAR, not an Object.prototype member', (name) => {
    const ctx = makeCtx();
    expectEngineError(() => evalVal({ var: name }, ctx), 'UNKNOWN_VAR');
    expectEngineError(() => evalCond({ cmp: [{ var: name }, '==', 0] }, ctx), 'UNKNOWN_VAR');
    expectEngineError(() => evalCond({ flag: name }, ctx), 'UNKNOWN_VAR');
  });

  it.each(PROTOTYPE_NAMES)('absent %s reads as absent in every other namespace', (name) => {
    const ctx = makeCtx({
      evidence: ['c_a'],
      characters: { w: 1 },
      uses: { ch_a: 1 },
      visits: { n_hub: 1 },
      found: { o_lamp: 1 },
    });
    expect(evalCond({ hasEvidence: name }, ctx)).toBe(false);
    expect(evalCond({ met: name }, ctx)).toBe(false);
    expect(evalCond({ visited: name }, ctx)).toBe(false);
    expect(evalCond({ found: name }, ctx)).toBe(false);
    expect(evalCond({ chosen: name }, ctx)).toBe(false);
    expect(evalCond({ chosen: 'ch_a', variant: name }, ctx)).toBe(false);
    expect(evalVal({ uses: name }, ctx)).toBe(0);
    expect(evalVal({ visits: name }, ctx)).toBe(0);
  });

  it('a variable really named constructor is readable', () => {
    const ctx = makeCtx({
      defs: [{ id: 'constructor', type: 'int', initial: 7, visibility: 'HIDDEN' }],
      evidence: ['constructor'],
      characters: { toString: 0 },
      uses: { valueOf: 2 },
      visits: { hasOwnProperty: 1 },
      found: { constructor: 5 },
    });
    expect(evalVal({ var: 'constructor' }, ctx)).toBe(7);
    expect(evalCond({ cmp: [{ var: 'constructor' }, '==', 7] }, ctx)).toBe(true);
    expect(evalCond({ hasEvidence: 'constructor' }, ctx)).toBe(true);
    expect(evalCond({ met: 'toString' }, ctx)).toBe(true);
    expect(evalVal({ uses: 'valueOf' }, ctx)).toBe(2);
    expect(evalCond({ chosen: 'valueOf' }, ctx)).toBe(true);
    expect(evalCond({ visited: 'hasOwnProperty' }, ctx)).toBe(true);
    expect(evalCond({ found: 'constructor' }, ctx)).toBe(true);
    // Delil sayımı kendi anahtarlarına bakar; tanımı olmayan kimlik süzgece uymaz.
    expect(evalVal({ count: 'evidence' }, ctx)).toBe(1);
    expect(evalVal({ count: 'evidence', kind: 'CLUE' }, ctx)).toBe(0);
  });

  it('getOwn reads own properties only', () => {
    const record: Record<string, number> = { a: 1 };
    expect(getOwn(record, 'a')).toBe(1);
    expect(getOwn(record, 'b')).toBeUndefined();
    for (const name of PROTOTYPE_NAMES) expect(getOwn(record, name)).toBeUndefined();
    // JSON.parse `__proto__`'yu kendi özelliği olarak üretir; kalıtılandan ayrışmalı.
    const own = JSON.parse('{"constructor": 3, "__proto__": 4}') as Record<string, number>;
    expect(getOwn(own, 'constructor')).toBe(3);
    expect(getOwn(own, '__proto__')).toBe(4);
    const bare: Record<string, number> = Object.assign(Object.create(null) as Record<string, number>, { x: 9 });
    expect(getOwn(bare, 'x')).toBe(9);
    expect(getOwn(bare, 'y')).toBeUndefined();
  });
});

describe('collectRefs', () => {
  it('collectRefs gathers all namespaces', () => {
    const cond: Cond = {
      all: [{ hasEvidence: 'c_a' }, { cmp: [{ var: 'cred' }, '<=', 0] }, { chosen: 'ob_a' }],
    };
    expect(plain(collectRefs(cond))).toEqual(only({ evidence: ['c_a'], vars: ['cred'], choices: ['ob_a'] }));
  });

  it('maps every Cond kind to its namespace', () => {
    const cond: Cond = {
      any: [
        { not: { met: 'w' } },
        { visited: 'n_hub' },
        { atNode: 'n_talk' },
        { found: 'o_lamp' },
        { flag: 'f' },
        { ref: 'p_strong' },
        { chosen: 'tp_night', variant: 'soft' },
        { hasEvidence: 'e_key' },
        { all: [] },
      ],
    };
    expect(plain(collectRefs(cond))).toEqual(
      only({
        characters: ['w'],
        nodes: ['n_hub', 'n_talk'],
        objects: ['o_lamp'],
        vars: ['f'],
        predicates: ['p_strong'],
        choices: ['tp_night'],
        evidence: ['e_key'],
      }),
    );
  });

  it('walks every Val kind', () => {
    const val: Val = {
      add: [
        { var: 'a' },
        { sub: [{ var: 'b' }, { uses: 'ch_x' }] },
        { mul: [{ visits: 'n_y' }, { score: 'cat:SORGULAMA' }] },
        { div: [{ min: [{ var: 'c' }, { max: [{ var: 'd' }] }] }, { round: { var: 'e' } }] },
        { count: 'evidence', kind: 'CLUE', tag: 't_night' },
        { score: 'raw' },
        { score: 'final' },
        7,
        'USUL',
        true,
      ],
    };
    expect(plain(collectRefs(val))).toEqual(
      only({
        vars: ['a', 'b', 'c', 'd', 'e'],
        choices: ['ch_x'],
        nodes: ['n_y'],
        categories: ['SORGULAMA'],
      }),
    );
  });

  it('walks the condition and both branches of an if value', () => {
    const val: Val = {
      if: {
        when: { flag: 'f' },
        then: { var: 'a' },
        else: { if: { when: { met: 'k' }, then: { uses: 'ch' }, else: 0 } },
      },
    };
    expect(plain(collectRefs(val))).toEqual(only({ vars: ['a', 'f'], characters: ['k'], choices: ['ch'] }));
  });

  it('literals reference nothing', () => {
    for (const literal of [1, 'x', true, false]) expect(plain(collectRefs(literal))).toEqual(none);
    expect(plain(collectRefs([]))).toEqual(none);
    expect(plain(collectRefs({ all: [] }))).toEqual(none);
  });

  it('walks each Effect kind', () => {
    const cases: [Effect, ReturnType<typeof only>][] = [
      [{ type: 'VAR', var: 'ap', op: 'dec', value: { var: 'cost' } }, only({ vars: ['ap', 'cost'] })],
      [{ type: 'VAR', var: 'ap', op: 'set', value: 3 }, only({ vars: ['ap'] })],
      [
        {
          type: 'SCORE',
          category: 'SORGULAMA',
          amount: { div: [{ mul: [200, { var: 'strategy_pct' }] }, 100] },
          line: 'capraz',
        },
        only({ categories: ['SORGULAMA'], vars: ['strategy_pct'] }),
      ],
      [{ type: 'DISCOVER', evidence: 'c_a' }, only({ evidence: ['c_a'] })],
      [{ type: 'MEET', character: 'w' }, only({ characters: ['w'] })],
      [
        { type: 'MARK', quality: 'GOOD', feedback: 'iyi', category: 'USUL_BILGISI' },
        only({ categories: ['USUL_BILGISI'] }),
      ],
      [{ type: 'MARK', quality: 'BAD', feedback: 'kötü' }, none],
      [{ type: 'GOTO', node: 'n_collapse' }, only({ nodes: ['n_collapse'] })],
      [{ type: 'END', outcome: 'o_win' }, none],
      [{ type: 'END' }, none],
    ];
    for (const [effect, expected] of cases) expect(plain(collectRefs(effect))).toEqual(expected);
  });

  it('walks IF effects through condition, then and else, nested', () => {
    const effect: Effect = {
      type: 'IF',
      when: { hasEvidence: 'c_uv' },
      then: [
        { type: 'DISCOVER', evidence: 'e_doc' },
        {
          type: 'IF',
          when: { flag: 'f' },
          then: [{ type: 'GOTO', node: 'n_a' }],
          else: [{ type: 'MEET', character: 'j' }],
        },
      ],
      else: [{ type: 'SCORE', category: 'DELIL_ANALIZI', amount: { var: 'x' } }],
    };
    expect(plain(collectRefs(effect))).toEqual(
      only({
        evidence: ['c_uv', 'e_doc'],
        vars: ['f', 'x'],
        nodes: ['n_a'],
        characters: ['j'],
        categories: ['DELIL_ANALIZI'],
      }),
    );
    // `else` yoksa yalnızca koşul ve `then` gezilir.
    expect(
      plain(collectRefs({ type: 'IF', when: { ref: 'p_strong' }, then: [{ type: 'MEET', character: 'w' }] })),
    ).toEqual(only({ predicates: ['p_strong'], characters: ['w'] }));
  });

  it('walks an effect list and accumulates into the given set', () => {
    const effects: Effect[] = [
      { type: 'DISCOVER', evidence: 'c_a' },
      { type: 'MEET', character: 'w' },
      { type: 'VAR', var: 'trust', op: 'inc', value: 5 },
    ];
    const refs = collectRefs(effects);
    expect(plain(refs)).toEqual(only({ evidence: ['c_a'], characters: ['w'], vars: ['trust'] }));

    const out = newRefSet();
    expect(collectRefs({ flag: 'f' }, out)).toBe(out);
    collectRefs({ hasEvidence: 'c_b' }, out);
    collectRefs([{ type: 'GOTO', node: 'n_hub' }], out);
    expect(plain(out)).toEqual(only({ vars: ['f'], evidence: ['c_b'], nodes: ['n_hub'] }));
  });

  it('newRefSet returns independent empty sets', () => {
    const a = newRefSet();
    const b = newRefSet();
    a.vars.add('x');
    expect(plain(a)).toEqual(only({ vars: ['x'] }));
    expect(plain(b)).toEqual(none);
  });

  it('rejects malformed input with TYPE', () => {
    expectEngineError(() => collectRefs({ nope: 1 } as unknown as Cond), 'TYPE');
    expectEngineError(() => collectRefs({ type: 'NOPE' } as unknown as Effect), 'TYPE');
    expectEngineError(() => collectRefs(null as unknown as Cond), 'TYPE');
  });
});

describe('typeOf', () => {
  const { c } = makeCtx();

  it('typeOf infers int for arithmetic and bool for flags', () => {
    // `{flag}` bir koşuldur; bool değişken değer olarak `{var}` ile okunur ve `bool` tipindedir.
    expect(typeOf({ add: [1, 2] }, c)).toBe('int');
    expect(typeOf({ sub: [{ var: 'trust' }, 1] }, c)).toBe('int');
    expect(typeOf({ mul: [{ var: 'cred' }, 100] }, c)).toBe('int');
    expect(typeOf({ div: [{ var: 'trust' }, 2] }, c)).toBe('int');
    expect(typeOf({ min: [1, { var: 'trust' }] }, c)).toBe('int');
    expect(typeOf({ max: [1, { var: 'trust' }] }, c)).toBe('int');
    expect(typeOf({ round: { div: [7, 2] } }, c)).toBe('int');
    expect(typeOf({ var: 'f' }, c)).toBe('bool');
    expect(typeOf(true, c)).toBe('bool');
    expect(typeOf(false, c)).toBe('bool');
  });

  it('types literals, variables and counters', () => {
    expect(typeOf(42, c)).toBe('int');
    expect(typeOf(2.5, c)).toBe('int');
    expect(typeOf('USUL', c)).toBe('string');
    expect(typeOf({ var: 'trust' }, c)).toBe('int');
    expect(typeOf({ var: 'strategy' }, c)).toBe('enum:strategy');
    expect(typeOf({ score: 'raw' }, c)).toBe('int');
    expect(typeOf({ score: 'final' }, c)).toBe('int');
    expect(typeOf({ score: 'cat:SORGULAMA' }, c)).toBe('int');
    expect(typeOf({ count: 'evidence', kind: 'CLUE' }, c)).toBe('int');
    expect(typeOf({ uses: 'ch_a' }, c)).toBe('int');
    expect(typeOf({ visits: 'n_hub' }, c)).toBe('int');
  });

  it('types an if by its branches', () => {
    const when: Cond = { flag: 'f' };
    expect(typeOf({ if: { when, then: 1, else: { var: 'trust' } } }, c)).toBe('int');
    expect(typeOf({ if: { when, then: true, else: { var: 'f' } } }, c)).toBe('bool');
    expect(typeOf({ if: { when, then: 'a', else: 'b' } }, c)).toBe('string');
    // Enum değişken ile metin sabiti uyumludur; sonuç enum olur.
    expect(typeOf({ if: { when, then: { var: 'strategy' }, else: 'USUL' } }, c)).toBe('enum:strategy');
    expect(typeOf({ if: { when, then: 'USUL', else: { var: 'strategy' } } }, c)).toBe('enum:strategy');
    expectEngineError(() => typeOf({ if: { when, then: 1, else: 'a' } }, c), 'TYPE');
    expectEngineError(() => typeOf({ if: { when, then: true, else: 0 } }, c), 'TYPE');
  });

  it('rejects ill-typed expressions and unknown variables', () => {
    expectEngineError(() => typeOf({ add: [1, { var: 'f' }] }, c), 'TYPE');
    expectEngineError(() => typeOf({ sub: ['a', 1] }, c), 'TYPE');
    expectEngineError(() => typeOf({ mul: [{ var: 'strategy' }, 2] }, c), 'TYPE');
    expectEngineError(() => typeOf({ div: [1, true] }, c), 'TYPE');
    expectEngineError(() => typeOf({ round: 'x' }, c), 'TYPE');
    expectEngineError(() => typeOf({ min: [] }, c), 'TYPE');
    expectEngineError(() => typeOf({ max: [] }, c), 'TYPE');
    expectEngineError(() => typeOf({ var: 'nope' }, c), 'UNKNOWN_VAR');
    for (const name of PROTOTYPE_NAMES) expectEngineError(() => typeOf({ var: name }, c), 'UNKNOWN_VAR');
    expectEngineError(() => typeOf({ nope: 1 } as unknown as Val, c), 'TYPE');
  });
});

describe('EngineError', () => {
  it('is an Error carrying a code', () => {
    const error = new EngineError('UNKNOWN_VAR', 'trust2');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(EngineError);
    expect(error.name).toBe('EngineError');
    expect(error.code).toBe('UNKNOWN_VAR');
    expect(error.message).toContain('UNKNOWN_VAR');
    expect(error.message).toContain('trust2');
  });

  it('defaults the message to the code', () => {
    expect(new EngineError('TYPE').message).toBe('TYPE');
  });
});
