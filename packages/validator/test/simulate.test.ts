import { describe, expect, it } from 'vitest';
import { act, start } from '@mudafaa/engine';
import { explore, runGoldenPaths, validatePackage } from '../src/index.js';
import { FAST, choice, compiled, fresh, node, preStart, withPatch } from './helpers/mini.js';
import type { Json } from './helpers/mini.js';

const codes = (p: Json, opts = FAST): string[] => validatePackage(p, opts).issues.map((i) => i.code);

describe('explore', () => {
  it('mini-case explores completely', { timeout: 120_000 }, () => {
    const c = compiled(fresh());
    const r = explore(c, { maxStates: 200_000, walks: 100 });
    expect(r.complete).toBe(true);
    expect(r.aborted).toBe(false);
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

  it('rejected actions are errors', { timeout: 60_000 }, () => {
    const p = withPatch((q) => {
      for (let i = 1; i <= 5; i++) {
        q.nodes.push({
          id: `n_p${i}`,
          type: 'CHOICE',
          title: `Kat ${i}`,
          choices: [{ id: `ch_p${i}`, kind: 'NAVIGATE', label: 'İn', next: { push: `n_p${i === 5 ? 1 : i + 1}` } }],
        });
      }
      choice(q, 'n_hub', 'ch_go_board').next = { push: 'n_p1' };
    });
    const r = validatePackage(p, FAST);
    expect(r.issues.map((i) => i.code)).toContain('ACTION_REJECTED');
    expect(r.status).toBe('FAILED');
  });

  it('leak check does not depend on order', { timeout: 60_000 }, () => {
    const leaky = (order: 'ab' | 'ba'): Json =>
      withPatch((q) => {
        q.evidence.push({
          ...q.evidence.find((e: { id: string }) => e.id === 'c_uv'),
          id: 'x_secret',
          title: 'Gizli tutanak',
        });
        q.discoveryPaths.push({ evidence: 'x_secret', source: { type: 'CHOICE', id: 'ch_pre_a' } });
        const a = {
          id: 'ch_pre_a',
          kind: 'OPTION',
          label: 'A',
          effects: [{ type: 'DISCOVER', evidence: 'x_secret' }],
          next: 'n_brief',
        };
        const b = { id: 'ch_pre_b', kind: 'OPTION', label: 'B', next: 'n_brief' };
        preStart(q, order === 'ab' ? [a, b] : [b, a]);
        choice(q, 'n_brief', 'ch_str_a').label = 'Masumiyet (Gizli tutanak)';
      });
    expect(codes(leaky('ab'))).toContain('LEAK');
    expect(codes(leaky('ba'))).toContain('LEAK');
  });

  it('score-gated choices are explored', { timeout: 60_000 }, () => {
    const p = withPatch((q) => {
      preStart(
        q,
        [40, 0, 20].map((amount, i) => ({
          id: `ch_pre_${i}`,
          kind: 'OPTION',
          label: `Hazırlık ${i}`,
          effects: amount === 0 ? [] : [{ type: 'SCORE', category: 'ARASTIRMA', amount }],
          next: 'n_brief',
        })),
      );
      q.nodes.push({
        id: 'n_stuck',
        type: 'CHOICE',
        title: 'Bekleme',
        choices: [{ id: 'ch_wait', kind: 'CONTINUE', label: 'Bekle', next: '$stay' }],
      });
      node(q, 'n_brief').choices.push({
        id: 'ch_trap',
        kind: 'OPTION',
        label: 'Tuzak',
        visibleWhen: { cmp: [{ score: 'cat:ARASTIRMA' }, '==', 20] },
        next: 'n_stuck',
      });
    });
    const r = explore(compiled(p), { ...FAST, walks: 0 });
    expect(r.coverage.nodes.missing).not.toContain('n_stuck');
    expect(r.softlocks.length).toBeGreaterThan(0);
  });

  it('converging scores are not loops', { timeout: 60_000 }, () => {
    const p = withPatch((q) => {
      for (let i = 1; i <= 6; i++) {
        node(q, 'n_hub').choices.push({
          id: `ch_s${i}`,
          kind: 'OPTION',
          label: `Not ${i}`,
          effects: [{ type: 'SCORE', category: 'ARASTIRMA', amount: i * 10 }],
        });
      }
    });
    const r = explore(compiled(p), FAST);
    expect(r.scoreLoops).toEqual([]);
    expect(codes(p)).not.toContain('SCORE_LOOP');
  });

  it('free penalty loops are warnings, not score loops', { timeout: 60_000 }, () => {
    const p = withPatch((q) => {
      const talk = node(q, 'n_talk');
      talk.allowPresent = true;
      talk.choices.push({
        id: 'fb_show',
        kind: 'FALLBACK',
        fallbackFor: 'PRESENT',
        effects: [{ type: 'SCORE', category: 'SORGULAMA', amount: -10 }],
      });
    });
    const r = validatePackage(p, FAST);
    const found = r.issues.map((i) => i.code);
    expect(found).toContain('PENALTY_LOOP');
    expect(found).not.toContain('SCORE_LOOP');
    expect(r.issues.find((i) => i.code === 'PENALTY_LOOP')?.severity).toBe('WARNING');
  });

  it('static errors do not crash validation', () => {
    const typed = withPatch((q) => {
      choice(q, 'n_hub', 'ch_go_board').effects = [{ type: 'VAR', var: 'trust', op: 'set', value: true }];
    });
    const noDefault = withPatch((q) => (node(q, 'n_dec').routes = [{ when: { ref: 'p_strong' }, to: 'n_story_good' }]));
    for (const [p, code] of [
      [typed, 'TYPE_MISMATCH'],
      [noDefault, 'DECISION_NO_DEFAULT'],
    ] as const) {
      const r = validatePackage(p, FAST);
      expect(r.status).toBe('FAILED');
      expect(r.issues.map((i) => i.code)).toEqual(expect.arrayContaining([code, 'SIMULATION_SKIPPED']));
      expect(r.simulation).toBeUndefined();
    }
  });

  it('exploration is deterministic', { timeout: 60_000 }, () => {
    const c = compiled(fresh());
    expect(JSON.stringify(explore(c, FAST))).toBe(JSON.stringify(explore(c, FAST)));
  });

  it('unreachable content is reported', { timeout: 60_000 }, () => {
    const p = withPatch((q) =>
      q.nodes.push({
        id: 'n_orphan',
        type: 'CHOICE',
        title: 'Yetim',
        choices: [{ id: 'ch_orphan', kind: 'CONTINUE', label: 'Devam', next: 'n_result' }],
      }),
    );
    expect(codes(p)).toEqual(expect.arrayContaining(['UNREACHED_NODE', 'UNREACHED_CHOICE']));
  });
});
