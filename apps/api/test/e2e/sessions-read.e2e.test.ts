import {
  CaseReport,
  CharactersResponse,
  EvidenceListResponse,
  ProgressResponse,
  ScenesResponse,
  ScoreResponse,
} from '@mudafaa/case-schema';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { actionBody, bootstrapApp, client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { miniCase } from './support/fixtures.js';
import { goldenPath, playActions, startCase } from './support/play.js';

// Oturum okuma uçları (delil, sahneler, kadro, skor, rapor), terk etme ve /me/progress.
describe('session reads', () => {
  let t: TestApp;
  let mini: Published;

  beforeAll(async () => {
    t = await bootstrapApp();
    mini = await publishFixture(t, miniCase(), { prefix: 'sr' });
  });
  afterAll(() => t?.close());

  it('reads during and after the case', async () => {
    const c = client(t.app, (await emulatorUser()).idToken);
    const { body } = await startCase(c, mini.caseId);
    const id = body.session.id;
    const win = goldenPath(mini.pkg, 'gp_win');
    const mid = await playActions(c, id, 0, win.slice(0, 4)); // sahnede iki nesne bulundu

    const evidence = EvidenceListResponse.parse((await c.get(`/sessions/${id}/evidence`)).body);
    expect(evidence.bag.map((e) => e.id)).toContain('e_key');
    const scenes = ScenesResponse.parse((await c.get(`/sessions/${id}/scenes`)).body);
    expect(scenes.scenes[0]?.found.length).toBe(2);
    expect(scenes.scenes[0]?.imageUrl).toMatch(/^\/v1\/assets\/[0-9a-f]{64}$/);
    const characters = CharactersResponse.parse((await c.get(`/sessions/${id}/characters`)).body);
    expect(characters.characters.map((ch) => ch.id)).toContain('k');

    const during = ScoreResponse.parse((await c.get(`/sessions/${id}/score`)).body);
    expect(during.status).toBe('ACTIVE');
    expect(during.breakdown).toBeUndefined();
    expect(during.final).toBeUndefined();

    const early = await c.get(`/sessions/${id}/result`);
    expect(early.status).toBe(409);
    expect(early.body.error).toBe('session_not_completed');

    await playActions(c, id, mid.view.session.stateVersion, win.slice(4));
    const after = ScoreResponse.parse((await c.get(`/sessions/${id}/score`)).body);
    expect(after).toMatchObject({ status: 'COMPLETED', final: 1430, outcomeKey: 'o_win' });
    expect(after.breakdown?.length).toBeGreaterThan(0);

    const report = CaseReport.parse((await c.get(`/sessions/${id}/result`)).body);
    const v = await t.prisma.caseVersion.findUniqueOrThrow({ where: { id: mini.versionId } });
    const categoryMax = (v.analysis as { categoryMax: Record<string, number> }).categoryMax;
    for (const s of report.skills as { category?: string; max?: number }[]) {
      if (s.category !== undefined && s.max !== undefined && categoryMax[s.category] !== undefined) {
        expect(s.max).toBe(categoryMax[s.category]);
      }
    }

    const progress = ProgressResponse.parse((await c.get('/me/progress')).body);
    expect(progress.xp).toBe(171);
    expect(progress.cases.find((x) => x.caseId === mini.caseId)).toMatchObject({
      status: 'COMPLETED',
      bestOutcomeKey: 'o_win',
      bestOutcomeClass: 'ACQUITTAL',
      xpCredited: 171,
    });
  });

  it('abandon frees the slot; abandoned session rejects actions', async () => {
    const c = client(t.app, (await emulatorUser()).idToken);
    const { body } = await startCase(c, mini.caseId);
    const id = body.session.id;
    expect((await c.post(`/sessions/${id}/abandon`)).status).toBe(204);
    expect((await c.post(`/sessions/${id}/abandon`)).status).toBe(409);
    const choose = await c.post(`/sessions/${id}/choose`, actionBody(0, { kind: 'CHOOSE', choiceId: 'ch_str_a' }));
    expect(choose.status).toBe(409);
    expect(choose.body.error).toBe('session_not_active');
    const next = await startCase(c, mini.caseId);
    expect(next.status).toBe(201);
    expect(next.body.session.id).not.toBe(id);
    const progress = ProgressResponse.parse((await c.get('/me/progress')).body);
    expect(progress.cases.find((x) => x.caseId === mini.caseId)?.status).toBe('IN_PROGRESS');
  });
});
