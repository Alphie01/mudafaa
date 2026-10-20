import { describe, expect, it } from 'vitest';
import type { Action } from '@mudafaa/case-schema';
import { act, enumerateActions, hitTest, start } from '../src/index.js';
import type { CompiledCase, SessionState } from '../src/index.js';
import { GP_LOSE, GP_MID, GP_WIN, at, choose, compiled, play, tap } from './helpers/run.js';

const taps = (as: Action[]) => as.filter((a): a is Extract<Action, { kind: 'TAP' }> => a.kind === 'TAP');

describe('enumerateActions', () => {
  it('enumerateActions includes miss probe and excludes found objects', () => {
    const c = compiled();
    const scene = c.scenes.get('sc1');
    if (scene === undefined) throw new Error('fixture');
    const s = play(c, [choose('ch_str_a'), choose('ch_go_scene')]);
    const hitIds = (st: SessionState) =>
      taps(enumerateActions(c, st)).map((a) => hitTest(scene, a.x, a.y, () => true)?.id ?? null);
    expect(hitIds(s)).toEqual(['o_lamp', 'o_cam', 'o_cover', null]);
    const after = play(c, [tap(15, 15)], s);
    expect(hitIds(after)).toEqual(['o_cam', 'o_cover', null]);
  });

  it('probe finds an uncovered point when the centre is covered', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a'), choose('ch_go_scene')]);
    const lamp = taps(enumerateActions(c, s))[0];
    expect(lamp).toBeDefined();
    expect(lamp === undefined ? null : [lamp.x, lamp.y]).not.toEqual([20, 20]);
  });

  it('no taps when taps are exhausted', () => {
    const c = compiled();
    const s = at(c, 'n_scene', (st) => {
      st.vars.taps = 0;
    });
    expect(taps(enumerateActions(c, s))).toEqual([]);
  });

  it('variants enumerate separately and hidden choices are excluded', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a'), choose('ch_go_talk')]);
    expect(enumerateActions(c, s)).toEqual([
      { kind: 'CHOOSE', choiceId: 'tp_night', variant: 'soft' },
      { kind: 'CHOOSE', choiceId: 'tp_night', variant: 'hard' },
      { kind: 'CHOOSE', choiceId: 'ch_talk_end' },
    ]);
  });

  it('exhausted rules and spent pairs drop out', () => {
    const c = compiled();
    const doc = at(c, 'n_doc');
    const examined = play(c, [{ kind: 'EXAMINE', tool: 'uv', target: 'r2' }], doc);
    expect(enumerateActions(c, doc)).toContainEqual({ kind: 'EXAMINE', tool: 'uv', target: 'r2' });
    expect(enumerateActions(c, examined)).not.toContainEqual({ kind: 'EXAMINE', tool: 'uv', target: 'r2' });
  });

  it('testimony offers press, present and pairs only discovered presentable evidence', () => {
    const c = compiled();
    const s = at(c, 'n_court1');
    const as = enumerateActions(c, s);
    expect(as).toContainEqual({ kind: 'PRESS', statementId: 'st1' });
    expect(as).toContainEqual({ kind: 'PRESENT', evidenceId: 'e_key', statementId: 'st1' });
    expect(as.some((a) => a.kind === 'PRESENT' && a.evidenceId === 'i_ab')).toBe(false);
  });

  it('every enumerated action is accepted along the golden paths', () => {
    const c: CompiledCase = compiled();
    for (const path of [GP_WIN, GP_MID, GP_LOSE]) {
      let s = start(c).state;
      for (const step of path) {
        for (const a of enumerateActions(c, s)) {
          const r = act(c, s, a);
          if (!r.ok) throw new Error(`${s.nodeId}: ${JSON.stringify(a)} → ${r.code}`);
          expect(r.result.resolution).not.toBe('NOOP');
        }
        s = play(c, [step], s);
      }
      expect(enumerateActions(c, s)).toEqual([]);
    }
  });
});
