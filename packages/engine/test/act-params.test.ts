import { describe, expect, it } from 'vitest';
import type { SceneDef } from '@mudafaa/case-schema';
import { act, hitTest } from '../src/index.js';
import { at, choose, combine, compiled, examine, play, present, tap } from './helpers/run.js';

const inScene = () => {
  const c = compiled();
  return { c, s: play(c, [choose('ch_str_a'), choose('ch_go_scene')]) };
};

describe('hitTest', () => {
  it('hitTest picks topmost by z', () => {
    const c = compiled();
    const scene = c.scenes.get('sc1');
    if (!scene) throw new Error('fixture');
    expect(hitTest(scene, 25, 25, () => true)?.id).toBe('o_cover');
    expect(hitTest(scene, 15, 15, () => true)?.id).toBe('o_lamp');
  });

  it('hitTest circle and polygon', () => {
    const scene: SceneDef = {
      id: 's',
      title: 's',
      width: 100,
      height: 100,
      image: 'i',
      objects: [
        {
          id: 'c',
          name: 'c',
          marker: 'HIDDEN',
          shapes: [{ circle: { cx: 70, cy: 70, r: 10 } }],
          feedback: { text: 't', short: 't' },
        },
        {
          id: 'p',
          name: 'p',
          marker: 'HIDDEN',
          shapes: [
            {
              polygon: [
                [0, 0],
                [10, 0],
                [0, 10],
              ],
            },
          ],
          feedback: { text: 't', short: 't' },
        },
      ],
    };
    expect(hitTest(scene, 79, 70, () => true)?.id).toBe('c');
    expect(hitTest(scene, 81, 70, () => true)).toBeNull();
    expect(hitTest(scene, 2, 2, () => true)?.id).toBe('p');
    expect(hitTest(scene, 9, 9, () => true)).toBeNull();
  });
});

describe('parametric actions', () => {
  it('TAP hit discovers and costs', () => {
    const { c, s } = inScene();
    const r = act(c, s, tap(15, 15));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.state.evidence.c_a).toBeDefined();
      expect(r.state.vars.taps).toBe(2);
      expect(r.state.score.cat.ARASTIRMA).toBe(40);
      expect(r.result.resolution).toBe('HIT');
      expect(r.result.hit).toEqual({
        objectId: 'o_lamp',
        rect: { x: 10, y: 10, w: 20, h: 20 },
        text: expect.any(String),
      });
    }
  });

  it('TAP on found object is NOOP and free', () => {
    const { c, s } = inScene();
    const s1 = play(c, [tap(15, 15)], s);
    const r = act(c, s1, tap(15, 15));
    expect(r.ok && r.result.resolution).toBe('NOOP');
    if (r.ok) {
      expect(r.state.vars.taps).toBe(2);
      expect(r.state.score.cat.ARASTIRMA).toBe(40);
    }
  });

  it('TAP miss charges and applies fallback', () => {
    const { c, s } = inScene();
    const r = act(c, s, tap(95, 5));
    expect(r.ok && r.result.resolution).toBe('MISS');
    if (r.ok) {
      expect(r.state.vars.taps).toBe(2);
      expect(r.state.score.cat.ARASTIRMA).toBe(-10);
    }
  });

  it('TAP with zero taps', () => {
    const c = compiled();
    const s = at(c, 'n_scene', (st) => {
      st.vars.taps = 0;
    });
    expect(act(c, s, tap(15, 15))).toMatchObject({ ok: false, code: 'RESOURCE_EXHAUSTED' });
  });

  it('TAP outside bounds', () => {
    const { c, s } = inScene();
    expect(act(c, s, tap(100, 5))).toMatchObject({ ok: false, code: 'INVALID_PARAMS' });
  });

  it('EXAMINE rule then NOOP', () => {
    const c = compiled();
    const s = at(c, 'n_doc');
    const s1 = play(c, [examine('uv', 'r2')], s);
    expect(s1.evidence.c_uv).toBeDefined();
    expect(s1.vars.exam).toBe(1);
    expect(s1.score.cat.DELIL_ANALIZI).toBe(150);
    const r = act(c, s1, examine('uv', 'r2'));
    expect(r.ok && r.result.resolution).toBe('NOOP');
    expect(r.ok && r.state.vars.exam).toBe(1);
  });

  it('EXAMINE fallback each time until exhausted', () => {
    const c = compiled();
    const s = play(c, [examine('mag', 'r2'), examine('mag', 'r2')], at(c, 'n_doc'));
    expect(s.score.cat.DELIL_ANALIZI).toBe(-40);
    expect(s.vars.exam).toBe(0);
    expect(act(c, s, examine('mag', 'r2'))).toMatchObject({ ok: false, code: 'RESOURCE_EXHAUSTED' });
  });

  it('EXAMINE second rule discovers e_doc', () => {
    const c = compiled();
    const s = play(c, [examine('mag', 'r1')], at(c, 'n_doc'));
    expect(s.evidence.e_doc).toBeDefined();
    expect(s.score.cat.DELIL_ANALIZI).toBe(100);
  });

  it('COMBINE order-insensitive', () => {
    const c = compiled();
    const s = at(c, 'n_board', (st) => {
      st.evidence.c_a = { seq: 0, via: 'TEST' };
      st.evidence.c_b = { seq: 0, via: 'TEST' };
    });
    const s1 = play(c, [combine('c_b', 'c_a')], s);
    expect(s1.evidence.i_ab).toBeDefined();
    expect(s1.score.cat.DELIL_ANALIZI).toBe(300);
  });

  it('COMBINE invalid inputs', () => {
    const c = compiled();
    const s = at(c, 'n_board', (st) => {
      st.evidence.c_a = { seq: 0, via: 'TEST' };
    });
    expect(act(c, s, combine('c_a', 'e_key'))).toMatchObject({ ok: false, code: 'INVALID_PARAMS' });
  });

  it('COMBINE wrong pair penalised once per pair', () => {
    const c = compiled();
    const s = at(c, 'n_board', (st) => {
      st.evidence.c_a = { seq: 0, via: 'TEST' };
      st.evidence.c_uv = { seq: 0, via: 'TEST' };
    });
    const s1 = play(c, [combine('c_a', 'c_uv'), combine('c_uv', 'c_a')], s);
    expect(s1.score.cat.DELIL_ANALIZI).toBe(-50);
  });

  it('PRESENT correct', () => {
    const c = compiled();
    const s = at(c, 'n_court1', (st) => {
      st.evidence.i_ab = { seq: 0, via: 'TEST' };
    });
    const r = act(c, s, present('i_ab', 'st1'));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.state.vars.pers).toBe(4);
      expect(r.state.score.cat.SORGULAMA).toBe(300);
      expect(r.state.marks.at(-1)?.quality).toBe('GOOD');
    }
  });

  it('PRESENT wrong applies fallback', () => {
    const c = compiled();
    const s = play(c, [present('e_key', 'st1')], at(c, 'n_court1'));
    expect(s.vars.cred).toBe(2);
    expect(s.vars.wrong).toBe(1);
    expect(s.score.line.hatali).toBe(-150);
  });

  it('PRESENT undiscovered evidence', () => {
    const c = compiled();
    const s = at(c, 'n_court1');
    expect(act(c, s, present('i_ab', 'st1'))).toMatchObject({ ok: false, code: 'INVALID_PARAMS' });
  });
});
