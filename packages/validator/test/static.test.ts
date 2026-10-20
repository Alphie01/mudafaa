import { describe, expect, it } from 'vitest';
import type { CasePackage } from '@mudafaa/case-schema';
import { staticChecks } from '../src/index.js';
import { choice, compiled, fresh, node, withPatch } from './helpers/mini.js';
import type { Json } from './helpers/mini.js';

const codes = (p: Json, strict = false): string[] => {
  const c = compiled(p);
  return staticChecks(c.pkg as CasePackage, c, { strict }).map((i) => i.code);
};
const errors = (p: Json): string[] => {
  const c = compiled(p);
  return staticChecks(c.pkg as CasePackage, c)
    .filter((i) => i.severity === 'ERROR')
    .map((i) => i.code);
};

describe('staticChecks', () => {
  it('mini-case has no static errors', () => {
    expect(errors(fresh())).toEqual([]);
  });

  const cases: [string, (p: Json) => void][] = [
    [
      'MISSING_FALLBACK',
      (p) =>
        (node(p, 'n_scene').choices = node(p, 'n_scene').choices.filter((ch: { id: string }) => ch.id !== 'fb_tap')),
    ],
    ['DECISION_NO_DEFAULT', (p) => (node(p, 'n_dec').routes = [{ when: { ref: 'p_strong' }, to: 'n_story_good' }])],
    [
      'RESULT_HAS_CHOICES',
      (p) => node(p, 'n_result').choices.push({ id: 'ch_again', kind: 'CONTINUE', label: 'Yeniden', next: 'n_brief' }),
    ],
    ['NO_EXIT', (p) => delete choice(p, 'n_story_good', 'ch_good_next').next],
    ['MISSING_TEXT', (p) => (choice(p, 'n_obj', 'ob_a').label = '  ')],
    [
      'DISCOVERY_MISMATCH',
      (p) => (p.discoveryPaths = p.discoveryPaths.filter((d: { evidence: string }) => d.evidence !== 'c_a')),
    ],
    [
      'UNDISCOVERABLE_EVIDENCE',
      (p) =>
        p.evidence.push({
          ...p.evidence.find((e: { id: string }) => e.id === 'c_uv'),
          id: 'c_lost',
          title: 'Kayıp ipucu',
        }),
    ],
    ['NOT_COMBINABLE', (p) => (p.evidence.find((e: { id: string }) => e.id === 'c_a').combinable = false)],
    ['HUD_HIDDEN_VAR', (p) => node(p, 'n_hub').hud.push('wrong')],
    ['COST_HIDDEN_VAR', (p) => (choice(p, 'n_hub', 'ch_go_board').cost = [{ var: 'wrong', amount: 1 }])],
    ['SHOWN_UNDISCOVERED', (p) => (node(p, 'n_ev').evidence = 'i_ab')],
    [
      'SCORE_LINE_UNMAPPED',
      (p) => (p.config.scoring.lines.find((l: { id: string }) => l.id === 'savunma').categories = []),
    ],
    ['OUTCOME_PRIORITY_DUP', (p) => (p.outcomes.find((o: { id: string }) => o.id === 'o_mid').priority = 1)],
    [
      'OUTCOME_DEFAULT_MISSING',
      (p) => (p.outcomes.find((o: { id: string }) => o.id === 'o_lose').when = { cmp: [{ score: 'final' }, '<', 100] }),
    ],
    ['TYPE_MISMATCH', (p) => (choice(p, 'n_obj', 'ob_b').visibleWhen = { cmp: [{ var: 'trust' }, '==', true] })],
    ['TYPE_MISMATCH', (p) => (choice(p, 'n_obj', 'ob_b').visibleWhen = { cmp: [{ score: 'final' }, '>', 0] })],
    ['RESERVED_ID', (p) => p.predicates.push({ id: 'constructor', label: 'x', when: { all: [] } })],
    [
      'DECISION_CYCLE',
      (p) => {
        p.nodes.push(
          { id: 'n_d1', type: 'DECISION', choices: [], routes: [{ to: 'n_d2' }] },
          { id: 'n_d2', type: 'DECISION', choices: [], routes: [{ to: 'n_d1' }] },
        );
        node(p, 'n_hub').choices.push({ id: 'ch_loop', kind: 'NAVIGATE', label: 'Döngü', next: 'n_d1' });
      },
    ],
  ];
  for (const [code, mutate] of cases) {
    it(`detects ${code}`, () => {
      expect(errors(withPatch(mutate))).toContain(code);
    });
  }

  it('warnings: unused presentable, indistinguishable choices, threshold mismatch', () => {
    expect(codes(fresh())).toContain('UNUSED_PRESENTABLE');
    const twins = withPatch((p) => {
      const a = choice(p, 'n_obj', 'ob_a');
      Object.assign(choice(p, 'n_obj', 'ob_b'), { effects: a.effects, next: a.next });
    });
    expect(codes(twins)).toContain('INDISTINGUISHABLE_CHOICES');
    const band = withPatch((p) =>
      p.config.scoring.thresholdBar.splice(2, 0, { label: 'Ara', from: 200, tone: 'amber' }),
    );
    expect(codes(band)).toContain('THRESHOLD_MISMATCH');
    expect(errors(twins)).toEqual([]);
  });

  it('role, unread variable and scene-exit checks', () => {
    const roles = withPatch((p) => node(p, 'n_court1').stage.bench.push({ character: 'k', label: 'Üye', xFrac: 0.2 }));
    expect(codes(roles)).toContain('ROLE_MISMATCH');
    expect(codes(fresh())).toContain('UNREAD_VARIABLE');
    const objectExit = withPatch((p) => {
      const scene = node(p, 'n_scene');
      scene.choices = scene.choices.filter((ch: { id: string }) => ch.id !== 'ch_scene_end');
      const obj = p.scenes[0].objects.find((o: { id: string }) => o.id === 'o_cam');
      obj.effects = [...(obj.effects ?? []), { type: 'GOTO', node: 'n_hub' }];
    });
    expect(errors(objectExit)).not.toContain('NO_EXIT');
  });

  it('legal review pending is INFO, ERROR when strict', () => {
    const pending = withPatch((p) => (p.meta.legalReview = { status: 'PENDING' }));
    const c = compiled(pending);
    const loose = staticChecks(c.pkg as CasePackage, c).find((i) => i.code === 'LEGAL_REVIEW_PENDING');
    const strict = staticChecks(c.pkg as CasePackage, c, { strict: true }).find(
      (i) => i.code === 'LEGAL_REVIEW_PENDING',
    );
    expect(loose?.severity).toBe('INFO');
    expect(strict?.severity).toBe('ERROR');
  });
});
