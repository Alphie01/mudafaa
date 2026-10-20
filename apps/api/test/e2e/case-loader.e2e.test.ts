import type { Redis } from 'ioredis';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { CaseLoaderService, pkgKey } from '../../src/modules/content/case-loader.service.js';
import { REDIS } from '../../src/redis/redis.module.js';
import { bootstrapApp, type TestApp } from './support/app.js';
import { publishFixture } from './support/cases.js';
import { miniCase } from './support/fixtures.js';

// CaseLoader: bellek LRU → Redis (gzip) → veritabanı; snapshot değişmez olduğu için geçersizleştirme yok.
describe('case loader', () => {
  let t: TestApp;

  beforeAll(async () => {
    t = await bootstrapApp();
  });
  afterAll(() => t?.close());

  it('loader caches by snapshot (memory, then Redis)', async () => {
    const { snapshotId, caseId, versionId } = await publishFixture(t, miniCase(), { prefix: 'cl' });
    const loader = t.app.get(CaseLoaderService);
    const redis = t.app.get<Redis>(REDIS);
    await redis.del(pkgKey(snapshotId));
    loader.clearMemory();
    const db = vi.spyOn(t.prisma.contentVersion, 'findUnique');

    const first = await loader.getCompiled(snapshotId);
    expect(first).toMatchObject({ snapshotId, caseId, caseVersionId: versionId });
    expect(first.analysis?.categoryMax).toBeDefined();
    expect(db).toHaveBeenCalledTimes(1);
    expect(await redis.exists(pkgKey(snapshotId))).toBe(1);
    expect(await redis.ttl(pkgKey(snapshotId))).toBeGreaterThan(6 * 24 * 3600);

    const second = await loader.getCompiled(snapshotId);
    expect(second).toBe(first);
    expect(db).toHaveBeenCalledTimes(1);

    loader.clearMemory();
    const third = await loader.getCompiled(snapshotId);
    expect(third.compiled.hash).toBe(first.compiled.hash);
    expect(db).toHaveBeenCalledTimes(1); // Redis'ten geldi
    expect(third.assetUrl({ id: 'img_sc1', path: 'assets/sc1.png' })).toMatch(/^\/v1\/assets\/[0-9a-f]{64}$/);
    db.mockRestore();
  });

  it('unknown snapshot → 404', async () => {
    await expect(
      t.app.get(CaseLoaderService).getCompiled('0190f000-0000-7000-8000-000000000000'),
    ).rejects.toMatchObject({ code: 'not_found' });
  });
});
