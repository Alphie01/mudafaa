import { PrismaPg } from '@prisma/adapter-pg';
import type { CasePackage } from '@mudafaa/case-schema';
import { canonicalJson } from '@mudafaa/engine';
import { afterAll, describe, expect, it } from 'vitest';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { contentHash, exportPackage, importPackage, packageHash } from '../../src/modules/content/mapper/index.js';
import { TEST_DATABASE_URL } from './support/env.js';
import { createVersion, dava07, FAKE_SHA, miniCase, retag, uniqueIdentity } from './support/fixtures.js';

// İçerik eşleyici II: dünya tabloları ve paketin kayıpsız gidiş-dönüşü.
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: TEST_DATABASE_URL }) });
afterAll(() => prisma.$disconnect());

const opts = { timeout: 30_000 };

async function roundTrip(pkg: CasePackage) {
  const { versionId } = await createVersion(prisma, pkg);
  await prisma.$transaction((tx) => importPackage(tx, versionId, pkg), opts);
  const out = await prisma.$transaction((tx) => exportPackage(tx, versionId), opts);
  return { versionId, out };
}

describe('package mapper', () => {
  it('mini-case round-trips exactly', async () => {
    const pkg = retag(miniCase(), uniqueIdentity('mr'), FAKE_SHA);
    const { out } = await roundTrip(pkg);
    expect(canonicalJson(out)).toBe(canonicalJson(pkg));
  });

  it('Dava #07 round-trips exactly', async () => {
    const pkg = retag(await dava07(), uniqueIdentity('mr7'), FAKE_SHA);
    const { out } = await roundTrip(pkg);
    expect(canonicalJson(out)).toBe(canonicalJson(pkg));
    expect(packageHash(out)).toBe(packageHash(pkg));
  });

  it('reimport replaces rows', async () => {
    const pkg = retag(miniCase(), uniqueIdentity('mrr'), FAKE_SHA);
    const { versionId } = await roundTrip(pkg);
    const where = { caseVersionId: versionId };
    const before = [await prisma.storyChoice.count({ where }), await prisma.storyEffect.count({ where })];
    await prisma.$transaction((tx) => importPackage(tx, versionId, pkg), opts);
    expect([await prisma.storyChoice.count({ where }), await prisma.storyEffect.count({ where })]).toEqual(before);
  });

  it('slug mismatch rejected', async () => {
    const pkg = retag(miniCase(), uniqueIdentity('mrs'), FAKE_SHA);
    const { versionId } = await createVersion(prisma, pkg);
    const other = retag(pkg, uniqueIdentity('other'));
    await expect(prisma.$transaction((tx) => importPackage(tx, versionId, other), opts)).rejects.toMatchObject({
      code: 'validation_error',
    });
  });

  it('unknown rank rejected', async () => {
    const pkg = retag(miniCase(), uniqueIdentity('mrk'), FAKE_SHA);
    const { versionId } = await createVersion(prisma, pkg);
    pkg.meta.requiredRank = 'GENERAL';
    await expect(prisma.$transaction((tx) => importPackage(tx, versionId, pkg), opts)).rejects.toMatchObject({
      code: 'validation_error',
    });
  });

  it('contentHash ignores legal review', () => {
    const a = miniCase();
    const b = miniCase();
    b.meta.legalReview = { status: 'PENDING' };
    expect(contentHash(a)).toBe(contentHash(b));
    expect(packageHash(a)).not.toBe(packageHash(b));
    b.meta.title = 'Başka';
    expect(contentHash(a)).not.toBe(contentHash(b));
  });
});
