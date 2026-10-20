import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { actionBody, bootstrapApp, client, type Client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { miniCase } from './support/fixtures.js';
import { goldenPath, playActions, startCase } from './support/play.js';

// Eşzamanlılık: ağ tekrarı (aynı clientActionId), aynı sürüme iki farklı aksiyon, son aksiyonun çift gönderimi.
describe('concurrency', () => {
  let t: TestApp;
  let mini: Published;

  beforeAll(async () => {
    t = await bootstrapApp();
    mini = await publishFixture(t, miniCase(), { prefix: 'cc' });
  });
  afterAll(() => t?.close());

  async function fresh(): Promise<{ c: Client; sessionId: string; userId: string }> {
    const u = await emulatorUser();
    const c = client(t.app, u.idToken);
    const { body } = await startCase(c, mini.caseId);
    const user = await t.prisma.user.findUniqueOrThrow({ where: { firebaseUid: u.uid } });
    return { c, sessionId: body.session.id, userId: user.id };
  }

  it('20 parallel identical requests → one write, 19 replays, identical bodies', async () => {
    const { c, sessionId } = await fresh();
    const req = actionBody(0, { kind: 'CHOOSE', choiceId: 'ch_str_a' });
    const results = await Promise.all(Array.from({ length: 20 }, () => c.post(`/sessions/${sessionId}/choose`, req)));
    for (const r of results) expect(r.status).toBe(200);
    const bodies = new Set(results.map((r) => JSON.stringify(r.body)));
    expect(bodies.size).toBe(1);
    expect(results.filter((r) => r.headers['x-idempotent-replay'] === 'true')).toHaveLength(19);
    expect(await t.prisma.sessionChoice.count({ where: { sessionId } })).toBe(1);
    expect((await t.prisma.gameSession.findUniqueOrThrow({ where: { id: sessionId } })).stateVersion).toBe(1);
  });

  it('two different actions on the same version → 200 + 409', async () => {
    const { c, sessionId } = await fresh();
    const [a, b] = await Promise.all([
      c.post(`/sessions/${sessionId}/choose`, actionBody(0, { kind: 'CHOOSE', choiceId: 'ch_str_a' }, randomUUID())),
      c.post(`/sessions/${sessionId}/choose`, actionBody(0, { kind: 'CHOOSE', choiceId: 'ch_str_b' }, randomUUID())),
    ]);
    expect([a?.status, b?.status].sort()).toEqual([200, 409]);
    const loser = a?.status === 409 ? a : b;
    expect(loser?.body.error).toBe('state_version_mismatch');
    expect(await t.prisma.sessionChoice.count({ where: { sessionId } })).toBe(1);
  });

  it('duplicate final action credits XP once', async () => {
    const { c, sessionId, userId } = await fresh();
    const win = goldenPath(mini.pkg, 'gp_win');
    const almost = await playActions(c, sessionId, 0, win.slice(0, -1));
    const req = actionBody(almost.view.session.stateVersion, win.at(-1));
    const results = await Promise.all(Array.from({ length: 5 }, () => c.post(`/sessions/${sessionId}/choose`, req)));
    for (const r of results) expect(r.status).toBe(200);
    expect((await t.prisma.userStatistics.findUniqueOrThrow({ where: { userId } })).xp).toBe(171);
    const prog = await t.prisma.userProgress.findFirstOrThrow({ where: { userId, caseId: mini.caseId } });
    expect(prog.completedCount).toBe(1);
  });
});
