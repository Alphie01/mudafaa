import { describe, expect, it } from 'vitest';
import mini from '@mudafaa/case-schema/fixtures/mini-case.json' with { type: 'json' };
import { compile, initialState, stateHash } from '../src/index.js';
import type { CompiledCase } from '../src/index.js';

const clone = (): typeof mini => JSON.parse(JSON.stringify(mini)) as typeof mini;

function compiled(): CompiledCase {
  const r = compile(clone());
  if (!r.ok) throw new Error(JSON.stringify(r.issues));
  return r.c;
}

describe('compile', () => {
  it('compiles mini-case cleanly', () => {
    const r = compile(clone());
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.warnings).toHaveLength(0);
      expect(r.c.key).toBe('mini-case');
      expect(r.c.hash).toMatch(/^[0-9a-f]{16}$/);
      expect(r.c.nodes.get('n_court1')?.fallbacks.PRESENT?.id).toBe('fb_ps');
      expect(r.c.nodes.get('n_doc')?.rules.EXAMINE.map((x) => x.id)).toEqual(['ex_uv_r2', 'ex_mag_r1']);
      expect(r.c.triggers.map((t) => t.id)).toEqual(['tg_collapse', 'tg_day']);
      expect(r.c.lineByCategory.get('SORGULAMA')).toBe('capraz');
    }
  });

  it('duplicate choice id across nodes', () => {
    const pkg = clone();
    const n2 = pkg.nodes[2];
    const n1 = pkg.nodes[1];
    if (!n2 || !n1 || !n2.choices[0] || !n1.choices[0]) throw new Error('fixture');
    n2.choices[0].id = n1.choices[0].id;
    const r = compile(pkg);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.issues).toContainEqual(
        expect.objectContaining({ code: 'DUPLICATE_ID', path: 'nodes[2].choices[0].id' }),
      );
    }
  });

  it('dangling next target', () => {
    const pkg = clone();
    const n0 = pkg.nodes[0];
    if (!n0 || !n0.choices[0]) throw new Error('fixture');
    (n0.choices[0] as { next?: unknown }).next = 'n_yok';
    const r = compile(pkg);
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.issues).toContainEqual(
        expect.objectContaining({ code: 'DANGLING_REF', path: 'nodes[0].choices[0].next' }),
      );
  });

  it('predicate cycle', () => {
    const pkg = clone();
    (pkg.predicates as unknown[]).push(
      { id: 'p1', label: 'p1', when: { ref: 'p2' } },
      { id: 'p2', label: 'p2', when: { ref: 'p1' } },
    );
    const r = compile(pkg);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.issues.map((i) => i.code)).toContain('PREDICATE_CYCLE');
  });

  it('schema issues inside unions report the deepest path', () => {
    const pkg = clone();
    (pkg.predicates as unknown[]).push({ id: 'p_bad', label: 'x', when: { cmp: [1, '=~', 2] } });
    const r = compile(pkg);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      const issue = r.issues.find((i) => i.code === 'SCHEMA');
      expect(issue?.path.startsWith('predicates[1].when')).toBe(true);
    }
  });
});

describe('initialState and stateHash', () => {
  it('initialState', () => {
    const c = compiled();
    const s = initialState(c);
    expect(s.vars.cred).toBe(3);
    expect(s.evidence.e_key?.via).toBe('INITIAL');
    expect(s.nodeId).toBe('n_brief');
    expect(Object.values(s.score.cat).every((v) => v === 0)).toBe(true);
  });

  it('stateHash ignores key order and detects value change', () => {
    const c = compiled();
    const a = initialState(c);
    const b = JSON.parse(JSON.stringify(a)) as typeof a;
    const reordered = Object.fromEntries(Object.entries(b).reverse()) as typeof a;
    expect(stateHash(reordered)).toBe(stateHash(a));
    b.vars.cred = 2;
    expect(stateHash(b)).not.toBe(stateHash(a));
    expect(stateHash(a)).toMatch(/^[0-9a-f]{16}$/);
  });
});
