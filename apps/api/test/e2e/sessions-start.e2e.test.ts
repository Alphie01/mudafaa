import { SessionSummary, SessionView, StartResponse } from '@mudafaa/case-schema';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ContentService } from '../../src/modules/content/content.service.js';
import { ValidationService } from '../../src/modules/content/validation.service.js';
import { bootstrapApp, client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { miniCase } from './support/fixtures.js';
import { startCase } from './support/play.js';

// Oturum başlatma, devam, yeniden başlatma, görünüm (ETag) ve sürüm sabitleme.
describe('session start', () => {
  let t: TestApp;
  let mini: Published;

  beforeAll(async () => {
    t = await bootstrapApp();
    mini = await publishFixture(t, miniCase(), { prefix: 'ss' });
  });
  afterAll(() => t?.close());

  it('start creates then resumes; restart abandons', async () => {
    const c = client(t.app, (await emulatorUser()).idToken);
    const first = await startCase(c, mini.caseId);
    expect(first.status).toBe(201);
    const body = StartResponse.parse(first.body);
    const startNode = mini.pkg.nodes.find((n) => n.id === mini.pkg.config.startNode);
    expect(body.view.node.type).toBe(startNode?.type);
    expect(body.session).toMatchObject({ mode: 'NORMAL', status: 'ACTIVE', stateVersion: 0, caseId: mini.caseId });

    const again = await startCase(c, mini.caseId);
    expect(again.status).toBe(200);
    expect(again.body.session.id).toBe(body.session.id);

    const restarted = await startCase(c, mini.caseId, true);
    expect(restarted.status).toBe(201);
    expect(restarted.body.session.id).not.toBe(body.session.id);
    const old = await t.prisma.gameSession.findUniqueOrThrow({ where: { id: body.session.id } });
    expect(old.status).toBe('ABANDONED');
    const progress = await t.prisma.userProgress.findFirstOrThrow({
      where: { caseId: mini.caseId, activeSessionId: restarted.body.session.id },
    });
    expect(progress.lastPlayedAt).not.toBeNull();
  });

  it('locked case → 403 case_locked; unknown case → 404', async () => {
    const locked = await publishFixture(t, miniCase(), { prefix: 'ss-lock', requiredRank: 'ORTAK' });
    const c = client(t.app, (await emulatorUser()).idToken);
    const res = await c.post(`/cases/${locked.caseId}/start`);
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ error: 'case_locked', message: 'Ortak Avukat rütbesi gerekir' });
    expect((await c.post('/cases/0190f000-0000-7000-8000-000000000000/start')).status).toBe(404);
  });

  it('current-node etag → 304 on match', async () => {
    const c = client(t.app, (await emulatorUser()).idToken);
    const { body } = await startCase(c, mini.caseId);
    const res = await c.get(`/sessions/${body.session.id}/current-node`);
    expect(res.status).toBe(200);
    SessionView.parse(res.body);
    expect(res.headers.etag).toBe(`"${body.session.id}:0"`);
    const cached = await c
      .get(`/sessions/${body.session.id}/current-node`)
      .set('If-None-Match', res.headers.etag ?? '');
    expect(cached.status).toBe(304);
    const summary = await c.get(`/sessions/${body.session.id}`);
    expect(SessionSummary.parse(summary.body).id).toBe(body.session.id);
  });

  it('start after republish uses new snapshot; open sessions stay pinned', async () => {
    const own = await publishFixture(t, miniCase(), { prefix: 'ss-rep' });
    const c = client(t.app, (await emulatorUser()).idToken);
    const v1 = await startCase(c, own.caseId);
    const oldTitle = v1.body.view.header.title;

    const content = t.app.get(ContentService);
    const { versionId: v2 } = await content.cloneToDraft(own.caseId);
    const p = await content.exportVersion(v2);
    const start = p.nodes.find((n) => n.id === p.config.startNode);
    if (start === undefined) throw new Error('başlangıç node yok');
    start.title = 'Yeni Sürüm Başlığı';
    await content.replaceDraft(v2, p);
    expect((await t.app.get(ValidationService).runNow(v2)).status).toBe('PASSED');
    await content.publish(own.caseId, v2, { legalReviewConfirmed: false });

    const pinned = await c.get(`/sessions/${v1.body.session.id}/current-node`);
    expect(pinned.body.header.title).toBe(oldTitle);
    expect(JSON.stringify(pinned.body)).not.toContain('Yeni Sürüm Başlığı');

    const fresh = await startCase(c, own.caseId, true);
    expect(fresh.status).toBe(201);
    expect(fresh.body.view.header.title).toBe('Yeni Sürüm Başlığı');
    const row = await t.prisma.gameSession.findUniqueOrThrow({ where: { id: fresh.body.session.id } });
    expect(row.caseVersionId).toBe(v2);
  });

  it('parallel starts yield one active session', async () => {
    const u = await emulatorUser();
    const c = client(t.app, u.idToken);
    await c.get('/me'); // kullanıcı satırı önceden oluşsun (JIT yarışı bu testin konusu değil)
    const results = await Promise.all(Array.from({ length: 10 }, () => startCase(c, mini.caseId)));
    for (const r of results) expect([200, 201]).toContain(r.status);
    expect(new Set(results.map((r) => r.body.session.id)).size).toBe(1);
    const user = await t.prisma.user.findUniqueOrThrow({ where: { firebaseUid: u.uid } });
    expect(
      await t.prisma.gameSession.count({
        where: { userId: user.id, caseId: mini.caseId, status: 'ACTIVE', mode: 'NORMAL' },
      }),
    ).toBe(1);
  });

  it('GET /me/sessions lists the new session', async () => {
    const c = client(t.app, (await emulatorUser()).idToken);
    const { body } = await startCase(c, mini.caseId);
    const res = await c.get('/me/sessions');
    expect(res.status).toBe(200);
    const list = (res.body as unknown[]).map((s) => SessionSummary.parse(s));
    expect(list[0]?.id).toBe(body.session.id);
  });
});
