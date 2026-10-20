import { describe, expect, it } from 'vitest';
import { act, start } from '@mudafaa/engine';
import { explore, runGoldenPaths, validatePackage } from '../src/index.js';
import { FAST, choice, compiled, fresh, node, withPatch } from './helpers/mini.js';

describe('explore', () => {
  it('mini-case explores completely', { timeout: 120_000 }, () => {
    const c = compiled(fresh());
    const r = explore(c, { walks: 100 });
    expect(r.complete).toBe(true);
    expect(r.coverage.nodes.missing).toEqual([]);
    expect(r.coverage.choices.missing).toEqual([]);
    expect(r.coverage.evidence.missing).toEqual([]);
    expect(r.softlocks).toEqual([]);
    expect(r.deadEnds).toEqual([]);
    expect(r.leaks).toEqual([]);
    expect(r.scoreLoops).toEqual([]);
    for (const id of ['o_win', 'o_mid', 'o_lose']) {
      const o = r.outcomes[id];
      expect(o?.reached, id).toBe(true);
      // Tanık dizisi baştan oynatılınca o sonuca ulaşır.
      let s = start(c).state;
      for (const a of o?.witness ?? []) {
        const step = act(c, s, a);
        if (!step.ok) throw new Error(step.code);
        s = step.state;
      }
      expect(s.outcome?.id).toBe(id);
    }
    expect(r.categoryMax.SORGULAMA).toBeGreaterThanOrEqual(300);
    expect(r.finalMax).toBeGreaterThanOrEqual(1430);
  });

  it('detects softlock', { timeout: 60_000 }, () => {
    const p = withPatch((q) => {
      q.nodes.push({
        id: 'n_stuck',
        type: 'CHOICE',
        title: 'Bekleme',
        choices: [{ id: 'ch_wait', kind: 'CONTINUE', label: 'Bekle', next: '$stay' }],
      });
      choice(q, 'n_choice', 'cl_b').next = 'n_stuck';
    });
    const r = explore(compiled(p), FAST);
    expect(r.softlocks.length).toBeGreaterThan(0);
    expect(validatePackage(p, FAST).issues.map((i) => i.code)).toContain('SOFTLOCK');
  });

  it('detects dead end', { timeout: 60_000 }, () => {
    const p = withPatch((q) => {
      q.nodes.push({
        id: 'n_wall',
        type: 'CHOICE',
        title: 'Duvar',
        choices: [{ id: 'ch_knock', kind: 'OPTION', label: 'Kapıyı çal', next: '$stay' }],
      });
      choice(q, 'n_choice', 'cl_b').next = 'n_wall';
    });
    expect(validatePackage(p, FAST).issues.map((i) => i.code)).toContain('DEAD_END');
  });

  it('detects unreachable outcome', { timeout: 60_000 }, () => {
    const p = withPatch((q) => {
      q.variables.push({ id: 'never_var', type: 'bool', initial: false, visibility: 'HIDDEN' });
      q.outcomes.find((o: { id: string }) => o.id === 'o_win').when = { flag: 'never_var' };
    });
    const codes = validatePackage(p, FAST).issues.map((i) => i.code);
    expect(codes).toContain('OUTCOME_UNREACHABLE');
    expect(codes).toContain('GOLDEN_PATH_FAILED');
  });

  it('detects leak', { timeout: 60_000 }, () => {
    const p = withPatch((q) => {
      const title = q.evidence.find((e: { id: string }) => e.id === 'i_ab').title as string;
      choice(q, 'n_hub', 'ch_go_court').label = `Duruşmaya git: ${title}`;
    });
    const r = validatePackage(p, FAST);
    expect(r.issues.map((i) => i.code)).toContain('LEAK');
    expect(r.status).toBe('FAILED');
  });

  it('detects score loop', { timeout: 60_000 }, () => {
    const p = withPatch((q) => {
      choice(q, 'n_hub', 'ch_go_board').effects = [{ type: 'SCORE', category: 'ARASTIRMA', amount: 5 }];
    });
    expect(validatePackage(p, FAST).issues.map((i) => i.code)).toContain('SCORE_LOOP');
  });

  it('golden paths pass', () => {
    const results = runGoldenPaths(compiled(fresh()));
    expect(results.map((g) => [g.name, g.passed, g.outcome])).toEqual([
      ['gp_win', true, 'o_win'],
      ['gp_mid', true, 'o_mid'],
      ['gp_lose', true, 'o_lose'],
    ]);
  });

  it('compile errors short-circuit the report', () => {
    const p = withPatch((q) => (node(q, 'n_hub').tabs[0].choices = ['ch_missing']));
    const r = validatePackage(p, FAST);
    expect(r.status).toBe('FAILED');
    expect(r.simulation).toBeUndefined();
    expect(r.issues.map((i) => i.code)).toContain('DANGLING_REF');
  });
});
