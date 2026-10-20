import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { CasePackage } from '@mudafaa/case-schema';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { importCase } from '../../src/cli/case-import.js';
import { ContentService } from '../../src/modules/content/content.service.js';
import { contentHash } from '../../src/modules/content/mapper/index.js';
import { ValidationService } from '../../src/modules/content/validation.service.js';
import { bootstrapApp, type TestApp } from './support/app.js';
import { fixtureFiles } from './support/cases.js';
import { DAVA07_DIR, miniCase, retag, uniqueIdentity } from './support/fixtures.js';

// Sürüm yaşam döngüsü: taslak → doğrulama → yayın (hash kapısı, hukuki inceleme), klon, değişmezlik ve CLI.
describe('content pipeline', () => {
  let t: TestApp;
  let content: ContentService;
  let validation: ValidationService;

  beforeAll(async () => {
    t = await bootstrapApp();
    content = t.app.get(ContentService);
    validation = t.app.get(ValidationService);
  });
  afterAll(() => t?.close());

  async function draft(pkg: CasePackage = miniCase()) {
    const p = retag(pkg, uniqueIdentity('cp'));
    const { caseId } = await content.findOrCreateCase(p);
    const { versionId } = await content.importDraft(caseId, p, 'IMPORT', {}, fixtureFiles);
    return { caseId, versionId, pkg: p };
  }

  it('import writes relational rows, an IMPORT snapshot and stored assets', async () => {
    const { versionId } = await draft();
    const v = await t.prisma.caseVersion.findUniqueOrThrow({ where: { id: versionId } });
    expect(v.status).toBe('DRAFT');
    expect(await t.prisma.storyNode.count({ where: { caseVersionId: versionId } })).toBeGreaterThan(0);
    const snaps = await t.prisma.contentVersion.findMany({ where: { caseVersionId: versionId } });
    expect(snaps.map((s) => s.kind)).toEqual(['IMPORT']);
    const asset = await t.prisma.asset.findFirstOrThrow({ where: { caseVersionId: versionId } });
    expect(asset.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(asset.mime).toBe('image/png');
    expect(existsSync(join(t.env.ASSET_DIR, asset.sha256))).toBe(true);
  });

  it('compile errors → 400 validation_error with issues', async () => {
    const p = retag(miniCase(), uniqueIdentity('bad'));
    const { caseId } = await content.findOrCreateCase(p);
    const broken = JSON.parse(JSON.stringify(p)) as CasePackage;
    broken.config.startNode = 'n_yok';
    await expect(content.importDraft(caseId, broken, 'IMPORT', {}, fixtureFiles)).rejects.toMatchObject({
      status: 400,
      code: 'validation_error',
      errors: expect.arrayContaining([expect.objectContaining({ message: expect.stringContaining('DANGLING_REF') })]),
    });
  });

  it('assets without sha256 need a file reader', async () => {
    const p = retag(miniCase(), uniqueIdentity('nosha'));
    const { caseId } = await content.findOrCreateCase(p);
    await expect(content.importDraft(caseId, p)).rejects.toMatchObject({ code: 'validation_error' });
  });

  it('publish requires a passing validation', async () => {
    const { caseId, versionId } = await draft();
    await expect(content.publish(caseId, versionId, { legalReviewConfirmed: false })).rejects.toMatchObject({
      status: 409,
      code: 'validation_required',
    });
    expect((await validation.runNow(versionId)).status).toBe('PASSED');
    const { snapshotId } = await content.publish(caseId, versionId, { legalReviewConfirmed: false });
    const c = await t.prisma.case.findUniqueOrThrow({ where: { id: caseId } });
    expect(c.currentVersionId).toBe(versionId);
    const snap = await t.prisma.contentVersion.findUniqueOrThrow({ where: { id: snapshotId } });
    expect(snap.kind).toBe('PUBLISH_SNAPSHOT');
    const v = await t.prisma.caseVersion.findUniqueOrThrow({ where: { id: versionId } });
    expect(v.status).toBe('PUBLISHED');
    expect(v.analysis).toMatchObject({ categoryMax: expect.any(Object) });
    const audit = await t.prisma.adminAuditLog.findFirst({ where: { action: 'case.publish', targetId: versionId } });
    expect(audit).not.toBeNull();
  });

  it('edit after validation requires revalidation', async () => {
    const { caseId, versionId } = await draft();
    await validation.runNow(versionId);
    const original = await content.exportVersion(versionId);
    const legalOnly = await content.exportVersion(versionId);
    legalOnly.meta.legalReview = { status: 'PENDING' };
    await content.replaceDraft(versionId, legalOnly);
    // Yalnızca hukuki onay değişti: içerik hash'i aynı, yeniden doğrulama gerekmez.
    const edited = await content.exportVersion(versionId);
    expect(contentHash(edited)).toBe(contentHash(original));
    edited.meta.title = 'Değişmiş Başlık';
    await content.replaceDraft(versionId, edited);
    await expect(content.publish(caseId, versionId, { legalReviewConfirmed: false })).rejects.toMatchObject({
      code: 'validation_required',
    });
    await validation.runNow(versionId);
    await expect(content.publish(caseId, versionId, { legalReviewConfirmed: false })).resolves.toBeTruthy();
  });

  it('legal-only change keeps the validation valid', async () => {
    const { caseId, versionId } = await draft();
    await validation.runNow(versionId);
    const p = await content.exportVersion(versionId);
    p.meta.legalReview = { status: 'PENDING' };
    await content.replaceDraft(versionId, p);
    await expect(content.publish(caseId, versionId, { legalReviewConfirmed: true })).resolves.toBeTruthy();
    const v = await t.prisma.caseVersion.findUniqueOrThrow({ where: { id: versionId } });
    expect(v.legalReviewStatus).toBe('APPROVED');
    expect(v.legalReviewBy).toBe('cli');
    expect(v.legalReviewAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const snap = await t.prisma.contentVersion.findFirstOrThrow({
      where: { caseVersionId: versionId, kind: 'PUBLISH_SNAPSHOT' },
    });
    expect((snap.package as CasePackage).meta.legalReview.status).toBe('APPROVED');
  });

  it('published versions are immutable', async () => {
    const { caseId, versionId } = await draft();
    await validation.runNow(versionId);
    await content.publish(caseId, versionId, { legalReviewConfirmed: false });
    const p = await content.exportVersion(versionId);
    await expect(content.replaceDraft(versionId, p)).rejects.toMatchObject({ status: 409, code: 'version_not_draft' });
    await expect(content.publish(caseId, versionId, { legalReviewConfirmed: false })).rejects.toMatchObject({
      code: 'version_not_draft',
    });
  });

  it('publish supersedes, pinned sessions keep snapshot', async () => {
    const { caseId, versionId } = await draft();
    await validation.runNow(versionId);
    const first = await content.publish(caseId, versionId, { legalReviewConfirmed: false });
    const before = await t.prisma.contentVersion.findUniqueOrThrow({ where: { id: first.snapshotId } });
    const { versionId: v2 } = await content.cloneToDraft(caseId);
    const p = await content.exportVersion(v2);
    p.meta.title = 'İkinci Sürüm';
    await content.replaceDraft(v2, p);
    await validation.runNow(v2);
    await content.publish(caseId, v2, { legalReviewConfirmed: false });
    const old = await t.prisma.caseVersion.findUniqueOrThrow({ where: { id: versionId } });
    expect(old.status).toBe('SUPERSEDED');
    const after = await t.prisma.contentVersion.findUniqueOrThrow({ where: { id: first.snapshotId } });
    expect(after.packageHash).toBe(before.packageHash);
    expect(after.package).toEqual(before.package);
    expect((await t.prisma.case.findUniqueOrThrow({ where: { id: caseId } })).currentVersionId).toBe(v2);
  });

  it('clone makes an independent draft', async () => {
    const { caseId, versionId } = await draft();
    await validation.runNow(versionId);
    await content.publish(caseId, versionId, { legalReviewConfirmed: false });
    const { versionId: clone, versionNo } = await content.cloneToDraft(caseId);
    expect(versionNo).toBe(2);
    const published = await content.exportVersion(versionId);
    const copy = await content.exportVersion(clone);
    expect(contentHash(copy)).toBe(contentHash(published));
    copy.meta.title = 'Taslakta değişti';
    await content.replaceDraft(clone, copy);
    expect((await content.exportVersion(versionId)).meta.title).toBe(published.meta.title);
    expect((await t.prisma.caseVersion.findUniqueOrThrow({ where: { id: clone } })).source).toBe('CLONE');
  });

  it('production publish without legal approval → 409 legal_review_required', async () => {
    // Üretimde doğrulama katıdır (doğrulanamayan softlock hata); mini-case için varsayılan bütçe ~3 sn.
    const prod = await bootstrapApp({
      NODE_ENV: 'production',
      FIREBASE_AUTH_EMULATOR_HOST: undefined,
      LOG_LEVEL: 'error',
      VALIDATOR_MAX_STATES: '20000',
      VALIDATOR_WALKS: '400',
    });
    try {
      const svc = prod.app.get(ContentService);
      const p = retag(miniCase(), uniqueIdentity('prod'));
      p.meta.legalReview = { status: 'PENDING' };
      const { caseId } = await svc.findOrCreateCase(p);
      const { versionId } = await svc.importDraft(caseId, p, 'IMPORT', {}, fixtureFiles);
      await prod.app.get(ValidationService).runNow(versionId);
      await expect(svc.publish(caseId, versionId, { legalReviewConfirmed: false })).rejects.toMatchObject({
        status: 409,
        code: 'legal_review_required',
      });
      await expect(svc.publish(caseId, versionId, { legalReviewConfirmed: true })).resolves.toBeTruthy();
    } finally {
      await prod.close();
    }
  });

  it('case:import CLI imports and publishes Dava #07', async () => {
    const existing = await t.prisma.case.findUnique({ where: { slug: 'gece-bekcisinin-sirri' } });
    const r = await importCase(t.app, DAVA07_DIR, { publish: true });
    expect(r.validation).toBe('PASSED');
    expect(r.snapshotId).toBeDefined();
    if (existing !== null) expect(r.caseId).toBe(existing.id);
    const v = await t.prisma.caseVersion.findUniqueOrThrow({ where: { id: r.versionId } });
    expect(v.status).toBe('PUBLISHED');
    const assets = await t.prisma.asset.findMany({ where: { caseVersionId: r.versionId } });
    expect(assets.length).toBeGreaterThan(0);
    for (const a of assets) {
      expect(a.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(existsSync(join(t.env.ASSET_DIR, a.sha256))).toBe(true);
    }
  });
});
