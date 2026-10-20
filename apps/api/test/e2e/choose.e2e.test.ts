import { ChooseResponse } from '@mudafaa/case-schema';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { actionBody, bootstrapApp, client, type Client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { miniCase } from './support/fixtures.js';
import { goldenPath, playActions, startAndPlay, startCase } from './support/play.js';

// POST /sessions/:id/choose: transaction, idempotency, iyimser sürüm, ret, bitiş ve XP.
describe('choose', () => {
  let t: TestApp;
  let mini: Published;

  beforeAll(async () => {
    t = await bootstrapApp();
    mini = await publishFixture(t, miniCase(), { prefix: 'ch' });
  });
  afterAll(() => t?.close());

  async function fresh(): Promise<{ c: Client; uid: string; userId: string; sessionId: string }> {
    const u = await emulatorUser();
    const c = client(t.app, u.idToken);
    const { body } = await startCase(c, mini.caseId);
    const user = await t.prisma.user.findUniqueOrThrow({ where: { firebaseUid: u.uid } });
    return { c, uid: u.uid, userId: user.id, sessionId: body.session.id };
  }
  const CH_STR_A = { kind: 'CHOOSE', choiceId: 'ch_str_a' };

  it('first action, replay, reused key, stale version and rejection', async () => {
    const { c, sessionId } = await fresh();
    const req = actionBody(0, CH_STR_A);
    const first = await c.post(`/sessions/${sessionId}/choose`, req);
    expect(first.status).toBe(200);
    const body = ChooseResponse.parse(first.body);
    expect(body.view.session.stateVersion).toBe(1);
    expect(first.headers['x-idempotent-replay']).toBeUndefined();
    expect(await t.prisma.sessionChoice.count({ where: { sessionId } })).toBe(1);
    expect((await t.prisma.gameSession.findUniqueOrThrow({ where: { id: sessionId } })).currentNodeKey).toBe('n_hub');

    // replay returns stored response
    const replay = await c.post(`/sessions/${sessionId}/choose`, req);
    expect(replay.status).toBe(200);
    expect(replay.headers['x-idempotent-replay']).toBe('true');
    expect(replay.body).toEqual(first.body);
    expect(await t.prisma.sessionChoice.count({ where: { sessionId } })).toBe(1);

    // same key different body → 422
    const reused = await c.post(`/sessions/${sessionId}/choose`, {
      ...req,
      action: { kind: 'CHOOSE', choiceId: 'ch_go_talk' },
    });
    expect(reused.status).toBe(422);
    expect(reused.body.error).toBe('idempotency_key_reused');

    // stale version → 409, nothing written
    const stale = await c.post(
      `/sessions/${sessionId}/choose`,
      actionBody(0, { kind: 'CHOOSE', choiceId: 'ch_go_talk' }),
    );
    expect(stale.status).toBe(409);
    expect(stale.body.error).toBe('state_version_mismatch');
    expect((await t.prisma.sessionState.findUniqueOrThrow({ where: { sessionId } })).stateVersion).toBe(1);
    const current = await c.get(`/sessions/${sessionId}/current-node`);
    expect(current.body.session.stateVersion).toBe(1);

    // rejected action → 422, nothing written
    const rejected = await c.post(
      `/sessions/${sessionId}/choose`,
      actionBody(1, { kind: 'CHOOSE', choiceId: 'ch_show_a' }),
    );
    expect(rejected.status).toBe(422);
    expect(rejected.body).toMatchObject({ error: 'action_rejected', reason: 'CHOICE_UNAVAILABLE' });
    expect(await t.prisma.sessionChoice.count({ where: { sessionId } })).toBe(1);

    // geçersiz gövde → 400
    const invalid = await c.post(`/sessions/${sessionId}/choose`, {
      clientActionId: 'x',
      expectedStateVersion: 1,
      action: CH_STR_A,
    });
    expect(invalid.status).toBe(400);
    expect(invalid.body.errors[0].path).toBe('clientActionId');
  });

  it('completion credits XP once and blocks further actions', async () => {
    const { c, userId, sessionId } = await fresh();
    const win = goldenPath(mini.pkg, 'gp_win');
    const almost = await playActions(c, sessionId, 0, win.slice(0, -1));
    const finalReq = actionBody(almost.view.session.stateVersion, win.at(-1));
    const last = await c.post(`/sessions/${sessionId}/choose`, finalReq);
    expect(last.status).toBe(200);
    expect(last.body.result.completed).toBe(true);
    expect(last.body.view.node).toMatchObject({ type: 'RESULT', outcome: { id: 'o_win' } });
    expect((await t.prisma.userStatistics.findUniqueOrThrow({ where: { userId } })).xp).toBe(171);
    const prog = await t.prisma.userProgress.findFirstOrThrow({ where: { userId, caseId: mini.caseId } });
    expect(prog).toMatchObject({
      bestOutcomeKey: 'o_win',
      bestOutcomeClass: 'ACQUITTAL',
      xpCredited: 171,
      activeSessionId: null,
    });

    const replay = await c.post(`/sessions/${sessionId}/choose`, finalReq);
    expect(replay.headers['x-idempotent-replay']).toBe('true');
    expect((await t.prisma.userStatistics.findUniqueOrThrow({ where: { userId } })).xp).toBe(171);

    const more = await c.post(
      `/sessions/${sessionId}/choose`,
      actionBody(last.body.view.session.stateVersion, CH_STR_A),
    );
    expect(more.status).toBe(409);
    expect(more.body.error).toBe('session_not_active');
    const session = await t.prisma.gameSession.findUniqueOrThrow({ where: { id: sessionId } });
    expect(session).toMatchObject({ status: 'COMPLETED', outcomeKey: 'o_win', finalScore: 1430, xpEarned: 171 });

    // ledgers
    const scores = await t.prisma.sessionScore.findMany({ where: { sessionId } });
    expect(scores.reduce((n, s) => n + s.amount, 0)).toBe(1130);
    const found = (await t.prisma.discoveredEvidence.findMany({ where: { sessionId } })).map((d) => d.evidenceKey);
    expect(found).toEqual(expect.arrayContaining(['c_a', 'c_b', 'i_ab']));
    expect(await t.prisma.sessionEvent.count({ where: { sessionId } })).toBeGreaterThan(0);
  });

  it('no XP farm on replaying the case', async () => {
    const { c, userId } = await fresh();
    await startAndPlay(c, mini.caseId, goldenPath(mini.pkg, 'gp_win'));
    expect((await t.prisma.userStatistics.findUniqueOrThrow({ where: { userId } })).xp).toBe(171);
    await startAndPlay(c, mini.caseId, goldenPath(mini.pkg, 'gp_mid'), true);
    expect((await t.prisma.userStatistics.findUniqueOrThrow({ where: { userId } })).xp).toBe(171);
    await startAndPlay(c, mini.caseId, goldenPath(mini.pkg, 'gp_win'), true);
    const stats = await t.prisma.userStatistics.findUniqueOrThrow({ where: { userId } });
    expect(stats).toMatchObject({ xp: 171, closedCases: 1, acquittals: 1 });
    const prog = await t.prisma.userProgress.findFirstOrThrow({ where: { userId, caseId: mini.caseId } });
    expect(prog).toMatchObject({ completedCount: 3, bestOutcomeKey: 'o_win', xpCredited: 171 });
  });
});
