import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SessionView } from '@mudafaa/case-schema';
import type { Action } from '@mudafaa/case-schema';
import { act, start, view } from '../src/index.js';
import type { CompiledCase, SessionState } from '../src/index.js';
import { FIXTURE_DIR, buildViewFixtures } from '../scripts/export-view-fixtures.js';
import { GP_LOSE, GP_MID, GP_WIN, at, choose, compiled, play, press, tap } from './helpers/run.js';

const META = { sessionId: 'ses_1', caseId: 'case_1', stateVersion: 0, mode: 'NORMAL' as const };
const v = (c: CompiledCase, s: SessionState) => view(c, s, META);
const json = (c: CompiledCase, s: SessionState) => JSON.stringify(v(c, s));

describe('view', () => {
  it('hidden choices never appear', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a'), choose('ch_go_talk')]);
    expect(s.evidence.c_a).toBeUndefined();
    expect(json(c, s)).not.toContain('ch_show_a');
    expect(v(c, s).choices.map((ch) => ch.id)).toEqual(['tp_night', 'ch_talk_end']);
  });

  it('scene exposes only found objects', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a'), choose('ch_go_scene')]);
    const before = v(c, s);
    expect(before.node).toMatchObject({ type: 'SCENE', found: [], hiddenTotal: 3, width: 100, height: 100 });
    expect(JSON.stringify(before)).not.toContain('o_lamp');
    const after = v(c, play(c, [tap(15, 15)], s));
    if (after.node.type !== 'SCENE') throw new Error('SCENE bekleniyordu');
    expect(after.node.found[0]).toMatchObject({ objectId: 'o_lamp', rect: { x: 10, y: 10, w: 20, h: 20 } });
    expect(JSON.stringify(after)).not.toContain('o_cam');
  });

  it('hud excludes hidden vars', () => {
    const c = compiled();
    for (const path of [GP_WIN, GP_MID, GP_LOSE]) {
      let s = start(c).state;
      expect(json(c, s)).not.toContain('strategy_pct');
      for (const a of path) {
        s = play(c, [a], s);
        expect(json(c, s)).not.toContain('strategy_pct');
        expect(json(c, s)).not.toContain('"wrong"');
      }
    }
  });

  it('hud shows node vars with display labels', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a')]);
    expect(v(c, s).hud.map((h) => [h.id, h.value])).toEqual([
      ['day', 1],
      ['ap', 3],
    ]);
  });

  it('testimony highlight hidden until revealed', () => {
    const c = compiled();
    const s = at(c, 'n_court1');
    const seg = (st: SessionState) => {
      const node = v(c, st).node;
      if (node.type !== 'COURTROOM') throw new Error('COURTROOM bekleniyordu');
      return node.statements?.[0];
    };
    expect(seg(s)?.segments[1]?.highlight).toBe(false);
    expect(seg(s)?.pressed).toBe(false);
    const pressed = play(c, [press('st1')], s);
    expect(seg(pressed)?.segments[1]?.highlight).toBe(true);
    expect(seg(pressed)?.pressed).toBe(true);
  });

  it('bag and notebook split by kind', () => {
    const c = compiled();
    const s = start(c).state;
    expect(v(c, s).bag.items.map((e) => e.id)).toEqual(['e_key']);
    expect(v(c, s).notebook.items).toEqual([]);
    const later = play(c, GP_WIN.slice(0, 3));
    expect(v(c, later).notebook.items.map((e) => e.id)).toEqual(['c_a']);
  });

  it('undiscovered evidence titles absent', () => {
    const c = compiled();
    const title = c.evidence.get('i_ab')?.title ?? '';
    expect(title.length).toBeGreaterThan(0);
    let s = start(c).state;
    for (const a of GP_WIN.slice(0, 7)) {
      expect(s.evidence.i_ab === undefined ? json(c, s) : '').not.toContain(title);
      s = play(c, [a], s);
    }
    expect(s.evidence.i_ab).toBeDefined();
  });

  it('view keeps Turkish text verbatim', () => {
    const c = compiled();
    const node = v(c, at(c, 'n_court1')).node;
    if (node.type !== 'COURTROOM') throw new Error('COURTROOM bekleniyordu');
    expect(node.statements?.[0]?.segments.map((sg) => sg.text)).toEqual(['Lamba ', 'yanıyordu']);
  });

  it('cast covers bench, witness and counsel', () => {
    const c = compiled();
    expect(Object.keys(v(c, at(c, 'n_court1')).cast).sort()).toEqual(['av', 'j', 'w']);
  });

  it('result view sums breakdown and shows outcome', () => {
    const c = compiled();
    const r = v(c, play(c, GP_WIN));
    if (r.node.type !== 'RESULT') throw new Error('RESULT bekleniyordu');
    expect(r.node.outcome.id).toBe('o_win');
    expect(r.node.total).toBe(1430);
    expect(r.node.breakdown.reduce((sum, row) => sum + row.value, 0)).toBe(1430);
    expect(r.node.xp.gained).toBe(171);
    expect(r.session.status).toBe('COMPLETED');
  });

  it('every golden-path view parses', () => {
    const c = compiled();
    for (const path of [GP_WIN, GP_MID, GP_LOSE]) {
      let s = start(c).state;
      const check = () => {
        const parsed = SessionView.safeParse(v(c, s));
        if (!parsed.success) throw new Error(`${s.nodeId}: ${parsed.error.message}`);
      };
      check();
      for (const a of path as Action[]) {
        const r = act(c, s, a);
        if (!r.ok) throw new Error(r.code);
        s = r.state;
        check();
      }
    }
  });

  it('view does not mutate state', () => {
    const c = compiled();
    const s = play(c, GP_WIN.slice(0, 10));
    const before = JSON.stringify(s);
    v(c, s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('view fixtures are up to date', () => {
    const fresh = buildViewFixtures();
    expect(Object.keys(fresh).sort()).toEqual(
      [
        'choice',
        'courtroom-objection',
        'courtroom-testimony',
        'deduction',
        'dialogue',
        'document',
        'evidence',
        'investigation',
        'result',
        'scene',
        'story',
      ].sort(),
    );
    for (const [name, value] of Object.entries(fresh)) {
      const onDisk: unknown = JSON.parse(readFileSync(`${FIXTURE_DIR}${name}.json`, 'utf8'));
      expect(onDisk, `${name}.json eski: node packages/engine/scripts/export-view-fixtures.ts`).toEqual(value);
      expect(SessionView.safeParse(onDisk).success).toBe(true);
    }
  });
});
