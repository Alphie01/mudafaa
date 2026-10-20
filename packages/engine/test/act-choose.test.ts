import { describe, expect, it } from 'vitest';
import { act, start, stateHash } from '../src/index.js';
import { at, choose, compiled, play } from './helpers/run.js';

describe('CHOOSE and transitions', () => {
  it('start enters n_brief and meets k', () => {
    const { state } = start(compiled());
    expect(state.nodeId).toBe('n_brief');
    expect(state.characters.k).toBeGreaterThanOrEqual(0);
    expect(state.visits.n_brief).toBe(1);
  });

  it('strategy choice sets pct and moves to hub', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a')]);
    expect(s.vars.strategy_pct).toBe(150);
    expect(s.nodeId).toBe('n_hub');
  });

  it('hidden and unknown choices are indistinguishable', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a'), choose('ch_go_talk')]);
    const hidden = act(c, s, choose('ch_show_a'));
    const unknown = act(c, s, choose('nope'));
    expect(hidden).toMatchObject({ ok: false, code: 'CHOICE_UNAVAILABLE' });
    expect(unknown).toMatchObject({ ok: false, code: 'CHOICE_UNAVAILABLE' });
    if (!hidden.ok && !unknown.ok) expect(hidden.message).toBe(unknown.message);
  });

  it('cost gating rejects without side effects', () => {
    const c = compiled();
    const s = at(c, 'n_hub', (st) => {
      st.vars.ap = 0;
    });
    const before = stateHash(s);
    const r = act(c, s, choose('ch_go_scene'));
    expect(r).toMatchObject({ ok: false, code: 'RESOURCE_EXHAUSTED' });
    expect(stateHash(s)).toBe(before);
  });

  it('push and $return', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a'), choose('ch_go_talk'), choose('ch_talk_end')]);
    expect(s.nodeId).toBe('n_hub');
    expect(s.stack).toEqual([]);
  });

  it('TOPIC requires variant', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a'), choose('ch_go_talk')]);
    expect(act(c, s, choose('tp_night'))).toMatchObject({ ok: false, code: 'INVALID_PARAMS' });
    const r = act(c, s, choose('tp_night', 'soft'));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.state.vars.trust).toBe(54);
      expect(r.state.vars.minutes).toBe(4);
      expect(r.result.lines.length).toBeGreaterThan(0);
    }
  });

  it('TOPIC once', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a'), choose('ch_go_talk'), choose('tp_night', 'soft')]);
    expect(act(c, s, choose('tp_night', 'hard'))).toMatchObject({ ok: false, code: 'CHOICE_UNAVAILABLE' });
  });

  it('DECISION routes immediately', () => {
    const c = compiled();
    const s = at(c, 'n_ev', (st) => {
      st.vars.pers = 5;
    });
    const r = act(c, s, choose('ev_ok'));
    expect(r.ok && r.state.nodeId).toBe('n_story_good');
  });

  it('COMPLETED session rejects', () => {
    const c = compiled();
    const s = at(c, 'n_hub', (st) => {
      st.status = 'COMPLETED';
    });
    expect(act(c, s, choose('ch_go_court'))).toMatchObject({ ok: false, code: 'SESSION_NOT_ACTIVE' });
  });
});
