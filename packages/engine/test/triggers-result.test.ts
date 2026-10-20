import { describe, expect, it } from 'vitest';
import { CaseReport } from '@mudafaa/case-schema';
import { act, computeScore, report, stateHash } from '../src/index.js';
import { GP_LOSE, GP_MID, GP_WIN, at, choose, compiled, miniPkg, play, present, press } from './helpers/run.js';

describe('triggers', () => {
  it('day rollover only at hub', () => {
    const c = compiled();
    const s = at(c, 'n_hub', (st) => {
      st.vars.ap = 1;
    });
    const inScene = play(c, [choose('ch_go_scene')], s);
    expect(inScene.vars.ap).toBe(0);
    expect(inScene.vars.day).toBe(1);
    const back = play(c, [choose('ch_scene_end')], inScene);
    expect(back.nodeId).toBe('n_hub');
    expect(back.vars.day).toBe(2);
    expect(back.vars.ap).toBe(3);
  });

  it('latch fires once per edge', () => {
    const pkg = miniPkg();
    (pkg.triggers as unknown[]).push({
      id: 'tg_low',
      priority: 5,
      when: { cmp: [{ var: 'cred' }, '<=', 1] },
      effects: [{ type: 'VAR', var: 'pers', op: 'inc', value: 1 }],
    });
    const c = compiled(pkg);
    let s = at(c, 'n_court1', (st) => {
      st.vars.cred = 2;
    });
    s = play(c, [present('e_key', 'st1')], s); // cred 2 → 1: ateşler
    expect(s.vars.pers).toBe(3);
    s = play(c, [press('st1')], s); // cred 1'de kalır: ateşlemez
    expect(s.vars.pers).toBe(3);
    s.vars.cred = 2;
    s = play(c, [press('st1')], s); // koşul false: mandal düşer
    expect(s.vars.pers).toBe(3);
    s = play(c, [present('e_key', 'st1')], s); // 2 → 1 yeniden: ateşler
    expect(s.vars.pers).toBe(4);
  });

  it('global collapse', () => {
    const c = compiled();
    const s = play(c, GP_LOSE.slice(0, 4));
    const r = act(c, s, present('e_key', 'st1'));
    if (!r.ok) throw new Error(r.code);
    expect(r.state.nodeId).toBe('n_collapse');
    expect(r.events).toContainEqual({ type: 'TRIGGER', id: 'tg_collapse' });
    expect(r.state.vars.wrong).toBe(3);
    expect(r.state.score.line.hatali).toBe(-450);
  });

  it('loop limit rejects', () => {
    const pkg = miniPkg();
    (pkg.triggers as unknown[]).push(
      { id: 'tg_a', priority: 2, when: { atNode: 'n_story_good' }, goto: 'n_collapse' },
      { id: 'tg_b', priority: 3, when: { atNode: 'n_collapse' }, goto: 'n_story_good' },
    );
    const c = compiled(pkg);
    const s = at(c, 'n_ev', (st) => {
      st.vars.pers = 5;
    });
    const before = stateHash(s);
    expect(act(c, s, choose('ev_ok'))).toMatchObject({ ok: false, code: 'LOOP_LIMIT' });
    expect(stateHash(s)).toBe(before);
  });

  it('scoped trigger latch persists while out of scope', () => {
    const pkg = miniPkg();
    (pkg.triggers as unknown[]).push(
      { id: 'tg_a', priority: 2, scope: 'n_story_good', when: { atNode: 'n_story_good' }, goto: 'n_collapse' },
      { id: 'tg_b', priority: 3, scope: 'n_collapse', when: { atNode: 'n_collapse' }, goto: 'n_story_good' },
    );
    const c = compiled(pkg);
    const s = at(c, 'n_ev', (st) => {
      st.vars.pers = 5;
    });
    const r = act(c, s, choose('ev_ok'));
    expect(r.ok && r.state.nodeId).toBe('n_story_good');
  });
});

describe('result, scoring and report', () => {
  it('mini golden paths', () => {
    const c = compiled();
    const win = play(c, GP_WIN);
    expect(win.status).toBe('COMPLETED');
    expect(win.outcome).toMatchObject({ id: 'o_win', final: 1430, xp: 171 });
    const mid = play(c, GP_MID);
    expect(mid.outcome).toMatchObject({ id: 'o_mid', final: 450, xp: 45 });
    const lose = play(c, GP_LOSE);
    expect(lose.outcome).toMatchObject({ id: 'o_lose', final: -450, xp: 0 });
  });

  it('breakdown sums to final', () => {
    const c = compiled();
    const s = play(c, GP_WIN);
    const score = computeScore(c, s);
    const sum = score.lines.reduce((a, l) => a + l.value, 0) + score.bonuses.reduce((a, b) => a + b.value, 0);
    expect(sum).toBe(1430);
  });

  it('report after gp_mid', () => {
    const c = compiled();
    const s = play(c, GP_MID);
    const r = report(c, s);
    expect(CaseReport.safeParse(r).success).toBe(true);
    const win = c.outcomes.find((o) => o.id === 'o_win');
    expect(r.alternatives).toContainEqual({ outcomeId: 'o_win', howToReach: win?.howToReach });
    expect(r.skills).toHaveLength(6);
    const hint = c.pkg.report.hints.find((h) => h.id === 'h_cam');
    expect(r.missed.map((m) => m.text)).toContain(hint?.text);
  });
});
