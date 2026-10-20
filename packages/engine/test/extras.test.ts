import { describe, expect, it } from 'vitest';
import { CharactersResponse, EvidenceListResponse, ScenesResponse } from '@mudafaa/case-schema';
import { breakdownRows, computeScore, sessionCharacters, sessionEvidence, sessionScenes, start } from '../src/index.js';
import { GP_WIN, choose, compiled, play, tap } from './helpers/run.js';

describe('session extras', () => {
  it('evidence: bag starts with the initial key, notebook empty', () => {
    const c = compiled();
    const r = sessionEvidence(c, start(c).state);
    expect(EvidenceListResponse.parse(r)).toEqual(r);
    expect(r.bag.map((e) => e.id)).toEqual(['e_key']);
    expect(r.notebook).toEqual([]);
  });

  it('evidence: clues go to the notebook once found', () => {
    const c = compiled();
    const s = play(c, GP_WIN.slice(0, 7));
    const r = sessionEvidence(c, s);
    expect(r.notebook.map((e) => e.id)).toEqual(expect.arrayContaining(['c_a', 'c_b']));
    expect(r.bag.map((e) => e.id)).toEqual(['e_key']); // çıkarım (countsInBag: false) çantaya girmez
  });

  it('scenes expose only found objects', () => {
    const c = compiled();
    const s = play(c, [choose('ch_str_a'), choose('ch_go_scene')]);
    const before = sessionScenes(c, s, (a) => `/v1/assets/${a.id}`);
    expect(ScenesResponse.parse(before)).toEqual(before);
    expect(before.scenes[0]).toMatchObject({ id: 'sc1', imageUrl: '/v1/assets/img_sc1', found: [] });
    const after = sessionScenes(c, play(c, [tap(15, 15)], s));
    expect(after.scenes[0]?.found.map((f) => f.objectId)).toEqual(['o_lamp']);
    expect(after.scenes[0]?.imageUrl).toBe('assets/sc1.png');
    expect(JSON.stringify(after)).not.toContain('o_cam');
  });

  it('scenes honour unlockWhen', () => {
    const pkg = JSON.parse(JSON.stringify(compiled().pkg)) as { scenes: { unlockWhen?: unknown }[] };
    const scene = pkg.scenes[0];
    if (scene === undefined) throw new Error('sahne yok');
    scene.unlockWhen = { hasEvidence: 'e_doc' };
    const c = compiled(pkg);
    expect(sessionScenes(c, start(c).state).scenes).toEqual([]);
  });

  it('characters: only met ones, package order', () => {
    const c = compiled();
    const r = sessionCharacters(c, start(c).state);
    expect(CharactersResponse.parse(r)).toEqual(r);
    const ids = r.characters.map((ch) => ch.id);
    expect(ids).toContain('k');
    expect(ids).not.toContain('w');
    expect(JSON.stringify(r)).not.toContain('notes');
  });

  it('breakdown rows come from the score summary', () => {
    const c = compiled();
    const s = play(c, GP_WIN);
    const rows = breakdownRows(computeScore(c, s));
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.reduce((n, r) => n + r.value, 0)).toBe(s.outcome?.final);
  });
});
