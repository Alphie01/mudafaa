import { describe, expect, it } from 'vitest';
import { CasePackage, MergeError, mergeCaseParts } from '@mudafaa/case-schema';
import { clone, loadMiniCase } from './helpers.js';

/** `fn` bir MergeError fırlatmalı; hatayı döndürür. */
const mergeErrorOf = (fn: () => unknown): MergeError => {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(MergeError);
    return error as MergeError;
  }
  throw new Error('MergeError bekleniyordu, hiçbir şey fırlatılmadı');
};

const A = { id: 'n_a', type: 'RESULT', choices: [] };
const B = { id: 'n_b', type: 'RESULT', choices: [] };
const C = { id: 'n_c', type: 'RESULT', choices: [] };

describe('mergeCaseParts', () => {
  it('mergeCaseParts concatenates arrays and deep-merges objects', () => {
    expect(mergeCaseParts([{ nodes: [A] }, { nodes: [B], meta: { title: 'x' } }])).toEqual({
      nodes: [A, B],
      meta: { title: 'x' },
    });
  });

  it('mergeCaseParts throws on scalar conflict', () => {
    const error = mergeErrorOf(() => mergeCaseParts([{ meta: { title: 'a' } }, { meta: { title: 'b' } }]));
    expect(error.path).toBe('meta.title');
    expect(error.message).toContain('meta.title');
  });

  it('concatenates arrays in the order the parts are given', () => {
    expect(mergeCaseParts([{ nodes: [B] }, { nodes: [] }, { nodes: [C, A] }])).toEqual({ nodes: [B, C, A] });
    expect(mergeCaseParts([{ nodes: [C, A] }, { nodes: [B] }])).toEqual({ nodes: [C, A, B] });
  });

  it('deep-merges nested objects at every level', () => {
    const merged = mergeCaseParts([
      { config: { startNode: 'n_brief', display: { showRunningScore: true } } },
      { config: { scoring: { scaleMax: 1000 }, display: {} } },
      { config: { scoring: { lines: [{ id: 'delil' }] } } },
      { config: { scoring: { lines: [{ id: 'capraz' }] } } },
    ]);
    expect(merged).toEqual({
      config: {
        startNode: 'n_brief',
        display: { showRunningScore: true },
        scoring: { scaleMax: 1000, lines: [{ id: 'delil' }, { id: 'capraz' }] },
      },
    });
  });

  it('copies array elements without merging them', () => {
    expect(mergeCaseParts([{ nodes: [{ id: 'n_a', title: 'x' }] }, { nodes: [{ id: 'n_a', title: 'y' }] }])).toEqual({
      nodes: [
        { id: 'n_a', title: 'x' },
        { id: 'n_a', title: 'y' },
      ],
    });
  });

  it('keeps the key order of first appearance', () => {
    const merged = mergeCaseParts([
      { format: 'f', meta: { b: 1 } },
      { nodes: [], meta: { a: 2 } },
    ]);
    expect(Object.keys(merged as object)).toEqual(['format', 'meta', 'nodes']);
    expect(Object.keys((merged as { meta: object }).meta)).toEqual(['b', 'a']);
  });

  it('accepts the same scalar in several parts', () => {
    expect(
      mergeCaseParts([
        { format: 'mudafaa.case/v1', config: { startNode: 'n_brief' } },
        { format: 'mudafaa.case/v1', config: { startNode: 'n_brief' } },
      ]),
    ).toEqual({ format: 'mudafaa.case/v1', config: { startNode: 'n_brief' } });
    expect(
      mergeCaseParts([
        { a: null, b: false, c: 0 },
        { a: null, b: false, c: 0 },
      ]),
    ).toEqual({
      a: null,
      b: false,
      c: 0,
    });
  });

  it('returns an empty object for no parts and a copy of a single part', () => {
    expect(mergeCaseParts([])).toEqual({});
    const part = { meta: { title: 'Mini Dava' }, nodes: [A] };
    const merged = mergeCaseParts([part]) as typeof part;
    expect(merged).toEqual(part);
    expect(merged).not.toBe(part);
    expect(merged.meta).not.toBe(part.meta);
    expect(merged.nodes).not.toBe(part.nodes);
    expect(merged.nodes[0]).not.toBe(A);
  });

  it('neither mutates the parts nor shares structure with them', () => {
    const first = { meta: { title: 'x' }, nodes: [{ id: 'n_a', choices: [] as unknown[] }] };
    const second = { meta: { slug: 'mini-case' }, nodes: [{ id: 'n_b', choices: [] as unknown[] }] };
    const before = clone([first, second]);
    const merged = mergeCaseParts([first, second]) as typeof first & typeof second;
    expect([first, second]).toEqual(before);

    merged.nodes.push({ id: 'n_c', choices: [] });
    merged.meta.title = 'değişti';
    (merged.nodes[0] as { choices: unknown[] }).choices.push('x');
    expect([first, second]).toEqual(before);

    first.nodes.push({ id: 'n_d', choices: [] });
    expect(merged.nodes.map((node) => node.id)).toEqual(['n_a', 'n_b', 'n_c']);
  });

  it('skips undefined values like JSON does', () => {
    expect(mergeCaseParts([{ meta: { title: 'x', summary: undefined } }, { meta: { title: undefined } }])).toEqual({
      meta: { title: 'x' },
    });
    expect(
      Object.keys((mergeCaseParts([{ meta: { title: 'x', summary: undefined } }]) as { meta: object }).meta),
    ).toEqual(['title']);
  });

  it('accepts objects without a prototype as plain objects', () => {
    const bare = Object.assign(Object.create(null) as object, { title: 'x' });
    const merged = mergeCaseParts([{ meta: bare }, { meta: { slug: 'mini-case' } }]) as { meta: object };
    expect(merged).toEqual({ meta: { title: 'x', slug: 'mini-case' } });
    expect(Object.getPrototypeOf(merged.meta)).toBe(Object.prototype);
  });

  describe('conflicts', () => {
    it.each([
      ['two different strings', [{ meta: { title: 'a' } }, { meta: { title: 'b' } }], 'meta.title'],
      ['two different numbers', [{ meta: { number: 7 } }, { meta: { number: 8 } }], 'meta.number'],
      ['a number and the same digits as a string', [{ meta: { number: 7 } }, { meta: { number: '7' } }], 'meta.number'],
      [
        'true and false',
        [{ config: { display: { showRunningScore: true } } }, { config: { display: { showRunningScore: false } } }],
        'config.display.showRunningScore',
      ],
      [
        'null and a value',
        [{ meta: { requiredRank: null } }, { meta: { requiredRank: 'stajyer' } }],
        'meta.requiredRank',
      ],
      ['an array and an object', [{ nodes: [] }, { nodes: {} }], 'nodes'],
      ['an object and an array', [{ meta: {} }, { meta: [] }], 'meta'],
      ['an array and a scalar', [{ nodes: [] }, { nodes: 'n_a' }], 'nodes'],
      ['a scalar and an object', [{ format: 'mudafaa.case/v1' }, { format: { v: 1 } }], 'format'],
      ['an object and null', [{ config: {} }, { config: null }], 'config'],
      ['a top-level scalar', [{ format: 'mudafaa.case/v1' }, { format: 'mudafaa.case/v2' }], 'format'],
      [
        'a conflict found in the third part',
        [{ meta: { title: 'a' } }, { nodes: [] }, { meta: { title: 'b' } }],
        'meta.title',
      ],
    ])('reports %s at its path', (_name, parts, path) => {
      const error = mergeErrorOf(() => mergeCaseParts(parts));
      expect(error.path).toBe(path);
      expect(error.message).toContain(path);
    });

    it('names the part that brought the conflicting value (1-based)', () => {
      const error = mergeErrorOf(() =>
        mergeCaseParts([{ meta: { title: 'a' } }, { nodes: [] }, { meta: { title: 'b' } }]),
      );
      expect(error.message).toContain('3. parça');
      expect(error.message).toContain('"a"');
      expect(error.message).toContain('"b"');
    });

    it('is an Error named MergeError with a readable message', () => {
      const error = mergeErrorOf(() => mergeCaseParts([{ meta: { title: 'a' } }, { meta: { title: 'b' } }]));
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('MergeError');
      expect(typeof error.message).toBe('string');
      expect(error.message.length).toBeGreaterThan(10);
    });
  });

  describe('input checks', () => {
    it.each([
      ['null', null],
      ['an array', [{ nodes: [] }]],
      ['a string', 'mudafaa.case/v1'],
      ['a number', 7],
      ['undefined', undefined],
    ])('rejects a part that is %s, at the root path', (_name, part) => {
      const error = mergeErrorOf(() => mergeCaseParts([{ meta: {} }, part]));
      expect(error.path).toBe('');
      expect(error.message).toContain('2. parça');
    });

    class Box {
      title = 'x';
    }
    it.each([
      ['a function', () => 1],
      ['a symbol', Symbol('s')],
      ['a bigint', 10n],
      ['a Date', new Date(0)],
      ['a Map', new Map([['a', 1]])],
      ['a class instance', new Box()],
      ['an object with a custom prototype', Object.create({ polluted: true }) as object],
    ])('rejects %s as a non-JSON value at its path', (_name, value) => {
      expect(mergeErrorOf(() => mergeCaseParts([{ meta: { title: value } }])).path).toBe('meta.title');
      expect(mergeErrorOf(() => mergeCaseParts([{ nodes: [{ id: 'n_a' }, value] }])).path).toBe('nodes.1');
    });
  });

  describe('prototype pollution', () => {
    const forbidden = ['__proto__', 'constructor', 'prototype'];
    // JSON.parse, `__proto__`'yu kendi (own) özelliği olarak üretir; nesne değişmezi `{ __proto__: … }` ise prototipi
    // değiştirirdi. Bu yüzden saldırı girdileri JSON metninden kurulur.
    const part = (json: string) => JSON.parse(json) as unknown;

    it.each(forbidden)('rejects a top-level %s key', (key) => {
      const error = mergeErrorOf(() => mergeCaseParts([part(`{"${key}": {"polluted": true}}`)]));
      expect(error.path).toBe(key);
      expect(error.message).toContain(key);
    });

    it.each(forbidden)('rejects a nested %s key and reports its path', (key) => {
      const error = mergeErrorOf(() =>
        mergeCaseParts([{ meta: { title: 'x' } }, part(`{"meta": {"${key}": {"polluted": true}}}`)]),
      );
      expect(error.path).toBe(`meta.${key}`);
    });

    it.each(forbidden)('rejects a %s key inside an array element, with the index inside its part', (key) => {
      const error = mergeErrorOf(() =>
        mergeCaseParts([
          { nodes: [{ id: 'n_a' }] },
          part(`{"nodes": [{"id": "n_b"}, {"${key}": {"polluted": true}}]}`),
        ]),
      );
      expect(error.path).toBe(`nodes.1.${key}`);
    });

    it.each(forbidden)('rejects a %s key in the first part as well as in later parts', (key) => {
      expect(mergeErrorOf(() => mergeCaseParts([part(`{"a": {"b": {"${key}": 1}}}`)])).path).toBe(`a.b.${key}`);
      expect(mergeErrorOf(() => mergeCaseParts([{ a: { b: {} } }, part(`{"a": {"b": {"${key}": 1}}}`)])).path).toBe(
        `a.b.${key}`,
      );
    });

    it('never pollutes Object.prototype or the merge result', () => {
      for (const json of [
        '{"__proto__": {"polluted": true}}',
        '{"meta": {"__proto__": {"polluted": true}}}',
        '{"constructor": {"prototype": {"polluted": true}}}',
        '{"meta": {"constructor": {"prototype": {"polluted": true}}}}',
        '{"nodes": [{"__proto__": {"polluted": true}}]}',
      ]) {
        expect(() => mergeCaseParts([{ meta: {} }, part(json)])).toThrow(MergeError);
      }
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
      expect(Object.prototype).not.toHaveProperty('polluted');
    });

    it('merges keys that shadow Object.prototype members as ordinary data', () => {
      const merged = mergeCaseParts([
        { hints: { toString: 'a' } },
        { hints: { valueOf: 'b', hasOwnProperty: 'c', isPrototypeOf: 'd' } },
        { toString: 'e' },
      ]) as Record<string, unknown>;
      expect(merged).toEqual({
        hints: { toString: 'a', valueOf: 'b', hasOwnProperty: 'c', isPrototypeOf: 'd' },
        toString: 'e',
      });
      expect(Object.keys(merged.hints as object)).toEqual(['toString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf']);
    });

    it('treats an inherited member name as absent, not as a conflict', () => {
      expect(mergeCaseParts([{}, { toString: 'x', valueOf: [1] }])).toEqual({ toString: 'x', valueOf: [1] });
      expect(mergeCaseParts([{ hints: {} }, { hints: { hasOwnProperty: { a: 1 } } }])).toEqual({
        hints: { hasOwnProperty: { a: 1 } },
      });
    });
  });

  it('rebuilds the mini-case from content-style parts', () => {
    const whole = loadMiniCase();
    const nodes = whole.nodes as unknown[];
    const config = whole.config as Record<string, unknown>;
    const { scoring, ...configRest } = config;
    // Parçalar içerik dizinindeki gibi bölünür: üst bilgi, kadro, deliller, sahneler, node'lar (iki parça), sonuçlar.
    const parts = [
      {
        format: whole.format,
        meta: whole.meta,
        config: configRest,
        predicates: whole.predicates,
        variables: whole.variables,
      },
      { sprites: whole.sprites, characters: whole.characters, relationships: whole.relationships },
      { evidence: whole.evidence, evidenceRelations: whole.evidenceRelations, discoveryPaths: whole.discoveryPaths },
      { scenes: whole.scenes, assets: whole.assets },
      { nodes: nodes.slice(0, 6), court: whole.court },
      { nodes: nodes.slice(6), triggers: whole.triggers },
      { outcomes: whole.outcomes, config: { scoring }, report: whole.report },
      { tests: whole.tests },
    ];
    const merged = mergeCaseParts(parts);
    expect(merged).toEqual(whole);
    expect(CasePackage.safeParse(merged).success).toBe(true);
  });
});
