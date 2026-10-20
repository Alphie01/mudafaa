import { randomBytes } from 'node:crypto';
import type { CasePackage, StartResponse } from '@mudafaa/case-schema';
import { canonicalJson } from '@mudafaa/engine';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { setRole as setRoleCli } from '../../src/cli/user-role.js';
import { AuthCache } from '../../src/modules/auth/auth-cache.js';
import { bootstrapApp, client, setRole, type Client, type TestApp } from './support/app.js';
import { TINY_PNG } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { miniCase, retag, uniqueIdentity } from './support/fixtures.js';
import { goldenPath, playActions } from './support/play.js';

// İnce yönetim API'si: roller, içe aktarma → kuyrukta doğrulama → yayın, denetim kaydı, test oturumu, paket ve varlık.
describe('admin API', () => {
  let t: TestApp;
  let editor: Client;
  let editorId: string;
  let admin: Client;
  let player: Client;
  let playerId: string;

  beforeAll(async () => {
    t = await bootstrapApp();
    const e = await emulatorUser();
    const a = await emulatorUser();
    const p = await emulatorUser();
    [editor, admin, player] = [client(t.app, e.idToken), client(t.app, a.idToken), client(t.app, p.idToken)];
    await Promise.all([editor.get('/me'), admin.get('/me'), player.get('/me')]);
    editorId = await setRole(t, e.uid, 'EDITOR');
    await setRole(t, a.uid, 'ADMIN');
    playerId = (await t.prisma.user.findUniqueOrThrow({ where: { firebaseUid: p.uid } })).id;
  });
  afterAll(() => t?.close());

  /** Varlığı yükleyip sha256'sını pakete yazar (admin içe aktarımı varlıkları depoda bekler). */
  async function uploadedMini(): Promise<CasePackage> {
    const up = await editor.raw('/admin/assets?mime=image/png', TINY_PNG);
    expect(up.status).toBe(201);
    const pkg = retag(miniCase(), uniqueIdentity('admin-mini'));
    for (const a of pkg.assets) a.sha256 = up.body.sha256 as string;
    return pkg;
  }

  async function waitValidation(id: string): Promise<{ status: string }> {
    for (let i = 0; i < 150; i++) {
      const res = await editor.get(`/admin/validations/${id}`);
      if (['PASSED', 'FAILED', 'ERROR'].includes(res.body.status as string)) return res.body as { status: string };
      await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error('doğrulama 30 sn içinde bitmedi');
  }

  it('roles: PLAYER 403, EDITOR 200, role management ADMIN only', async () => {
    expect((await player.get('/admin/cases')).status).toBe(403);
    expect((await player.get('/admin/cases')).body.error).toBe('forbidden');
    expect((await editor.get('/admin/cases')).status).toBe(200);
    expect((await editor.patch(`/admin/users/${playerId}/role`, { role: 'ADMIN' })).status).toBe(403);
    const ok = await admin.patch(`/admin/users/${playerId}/role`, { role: 'EDITOR' });
    expect(ok.status).toBe(200);
    expect((await player.get('/admin/cases')).status).toBe(200); // önbellek boşaltıldı
    expect((await admin.patch(`/admin/users/${playerId}/role`, { role: 'PLAYER' })).status).toBe(200);
    expect((await player.get('/admin/cases')).status).toBe(403);
    const log = await t.prisma.adminAuditLog.findFirst({ where: { action: 'user.role', targetId: playerId } });
    expect(log).not.toBeNull();
  });

  it('user:role CLI sets the role and writes an audit row', async () => {
    const u = await emulatorUser();
    const c = client(t.app, u.idToken);
    await c.get('/me');
    expect((await c.get('/admin/cases')).status).toBe(403);
    const r = await setRoleCli(t.app, u.email ?? '', 'ADMIN');
    t.app.get(AuthCache).evict(r.firebaseUid);
    expect((await c.get('/admin/cases')).status).toBe(200);
    const log = await t.prisma.adminAuditLog.findFirst({ where: { action: 'user.role.cli', targetId: r.id } });
    expect(log?.actorId).toBeNull();
  });

  it('import → validate (queue) → publish, with audit rows', async () => {
    const pkg = await uploadedMini();
    pkg.meta.legalReview = { status: 'PENDING' };
    const created = await editor.post('/admin/cases', { slug: pkg.meta.slug, number: pkg.meta.number });
    expect(created.status).toBe(201);
    const caseId = created.body.caseId as string;
    expect((await editor.post('/admin/cases', { slug: pkg.meta.slug, number: pkg.meta.number })).status).toBe(400);

    const imported = await editor.post('/admin/cases/import', pkg);
    expect(imported.status).toBe(201);
    expect(imported.body.caseId).toBe(caseId);
    const versionId = imported.body.versionId as string;

    const early = await editor.post(`/admin/cases/${caseId}/publish`, { versionId, legalReviewConfirmed: true });
    expect(early.status).toBe(409);
    expect(early.body.error).toBe('validation_required');

    const queued = await editor.post(`/admin/cases/${caseId}/validate`, { versionId });
    expect(queued.status).toBe(202);
    const result = await waitValidation(queued.body.validationId as string);
    expect(result.status).toBe('PASSED');

    const published = await editor.post(`/admin/cases/${caseId}/publish`, { versionId, legalReviewConfirmed: true });
    expect(published.status).toBe(200);
    expect(published.body).toMatchObject({ legalReviewStatus: 'APPROVED', versionId });

    const cards = await player.get('/cases');
    expect(cards.body.items.find((c: { id: string }) => c.id === caseId)).toMatchObject({ legalReviewPending: false });

    const detail = await editor.get(`/admin/cases/${caseId}`);
    expect(detail.body).toMatchObject({ currentVersionId: versionId, versions: [{ status: 'PUBLISHED' }] });

    for (const action of ['case.create', 'case.import', 'case.validate', 'case.publish']) {
      const row = await t.prisma.adminAuditLog.findFirst({
        where: { action, actorId: editorId, OR: [{ targetId: caseId }, { targetId: versionId }] },
      });
      expect(row, action).not.toBeNull();
      expect(row?.requestId).toBeTruthy();
    }
    const logs = await editor.get('/admin/audit-logs?limit=10');
    expect(logs.status).toBe(200);
    expect(logs.body.length).toBeLessThanOrEqual(10);

    const exported = await editor.get(`/admin/cases/${caseId}/export`);
    expect((exported.body as CasePackage).meta.legalReview.status).toBe('APPROVED');
  });

  it('import rejects broken packages and unknown assets', async () => {
    const pkg = await uploadedMini();
    const bad = await editor.post('/admin/cases/import', { ...pkg, nodes: 'yok' });
    expect(bad.status).toBe(400);
    const noAsset = retag(pkg, uniqueIdentity('admin-noasset'), 'f'.repeat(64));
    const res = await editor.post('/admin/cases/import', noAsset);
    expect(res.status).toBe(400);
    expect(res.body.errors[0].path).toBe('assets[0].sha256');
  });

  it('package round trip over HTTP and draft clone', async () => {
    const pkg = await uploadedMini();
    const { body } = await editor.post('/admin/cases/import', pkg);
    const path = `/admin/cases/${body.caseId}/versions/${body.versionId}/package`;
    const first = await editor.get(path);
    expect(first.status).toBe(200);
    expect((await editor.put(path, first.body)).status).toBe(204);
    const second = await editor.get(path);
    expect(canonicalJson(second.body)).toBe(canonicalJson(first.body));

    const clone = await editor.post(`/admin/cases/${body.caseId}/versions`);
    expect(clone.status).toBe(201);
    const versions = await editor.get(`/admin/cases/${body.caseId}/versions`);
    expect(versions.body.map((v: { versionNo: number }) => v.versionNo)).toEqual([1, 2]);
    expect((await editor.get(`/admin/cases/${body.caseId}/versions/${clone.body.versionId}/package`)).status).toBe(200);
    expect((await editor.get(`/admin/cases/${body.caseId}/export`)).status).toBe(404); // yayın yok
  });

  it('test session is isolated from progress', async () => {
    const pkg = await uploadedMini();
    const { body } = await editor.post('/admin/cases/import', pkg);
    const res = await editor.post(`/admin/cases/${body.caseId}/test-sessions`, { versionId: body.versionId });
    expect(res.status).toBe(201);
    const start = res.body as StartResponse;
    expect(start.session.mode).toBe('TEST');
    const last = await playActions(editor, start.session.id, 0, goldenPath(pkg, 'gp_win'));
    expect(last.result.completed).toBe(true);
    const session = await t.prisma.gameSession.findUniqueOrThrow({ where: { id: start.session.id } });
    expect(session).toMatchObject({ status: 'COMPLETED', mode: 'TEST', outcomeKey: 'o_win' });
    expect((await t.prisma.userStatistics.findUniqueOrThrow({ where: { userId: editorId } })).xp).toBe(0);
    expect(await t.prisma.userProgress.count({ where: { userId: editorId, caseId: body.caseId } })).toBe(0);
    const snap = await t.prisma.contentVersion.findUniqueOrThrow({ where: { id: session.snapshotId } });
    expect(snap.kind).toBe('TEST_SNAPSHOT');
  });

  it('asset upload is served back byte for byte', async () => {
    const bytes = randomBytes(256);
    const up = await editor.raw('/admin/assets?mime=image/webp', bytes);
    expect(up.status).toBe(201);
    expect(up.body.url).toBe(`/v1/assets/${up.body.sha256}`);
    const res = await t
      .http()
      .get(up.body.url as string)
      .buffer(true)
      .parse((r, cb) => {
        const chunks: Buffer[] = [];
        r.on('data', (c: Buffer) => chunks.push(c));
        r.on('end', () => cb(null, Buffer.concat(chunks)));
      });
    expect(res.headers['content-type']).toBe('image/webp');
    expect(Buffer.compare(res.body as Buffer, bytes)).toBe(0);
    expect((await editor.raw('/admin/assets?mime=nope', bytes)).status).toBe(400);
  });

  it('PATCH locks the case; DELETE archives it', async () => {
    const pkg = await uploadedMini();
    const { body } = await editor.post('/admin/cases/import', pkg);
    const q = await editor.post(`/admin/cases/${body.caseId}/validate`, { versionId: body.versionId });
    expect((await waitValidation(q.body.validationId as string)).status).toBe('PASSED');
    await editor.post(`/admin/cases/${body.caseId}/publish`, { versionId: body.versionId });
    const patched = await editor.patch(`/admin/cases/${body.caseId}`, { requiredRankKey: 'KIDEMLI' });
    expect(patched.status).toBe(200);
    const locked = await player.get('/cases?tab=locked');
    expect(locked.body.items.map((c: { id: string }) => c.id)).toContain(body.caseId);
    expect((await editor.patch(`/admin/cases/${body.caseId}`, { requiredRankKey: 'GENERAL' })).status).toBe(400);
    expect((await editor.delete(`/admin/cases/${body.caseId}`)).status).toBe(204);
    const all = [
      ...(await player.get('/cases?tab=active')).body.items,
      ...(await player.get('/cases?tab=locked')).body.items,
    ];
    expect(all.map((c: { id: string }) => c.id)).not.toContain(body.caseId);
  });
});
