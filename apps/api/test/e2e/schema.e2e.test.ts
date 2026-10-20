import { PrismaPg } from '@prisma/adapter-pg';
import { afterAll, describe, expect, it } from 'vitest';
import { PrismaClient } from '../../src/generated/prisma/client.js';

// Şema düzeyindeki kısıtlar: referans verisi, spesifikasyonun tablo listesi, kısmi unique indeks ve cascade.
const url = process.env.DATABASE_URL_TEST ?? 'postgresql://mudafaa:mudafaa@localhost:5434/mudafaa_test';
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

/** Spesifikasyon §14'teki tablolar. */
const SPEC_TABLES = [
  'users',
  'user_profiles',
  'user_progress',
  'user_statistics',
  'cases',
  'case_versions',
  'case_categories',
  'case_difficulties',
  'story_nodes',
  'story_choices',
  'story_conditions',
  'story_effects',
  'story_variables',
  'story_transitions',
  'characters',
  'character_dialogues',
  'character_relationships',
  'scenes',
  'scene_assets',
  'scene_objects',
  'scene_hotspots',
  'evidence',
  'evidence_relationships',
  'evidence_discovery_conditions',
  'court_sessions',
  'court_stages',
  'court_choices',
  'court_outcomes',
  'game_sessions',
  'session_states',
  'session_choices',
  'session_variables',
  'discovered_evidence',
  'session_scores',
  'session_events',
  'content_generation_jobs',
  'content_versions',
  'content_validation_results',
  'admin_audit_logs',
];

let seq = 0;
const unique = (): number => ++seq + Math.floor(Math.random() * 1_000_000);

async function makeVersion(): Promise<{ caseId: string; versionId: string; snapshotId: string }> {
  const n = unique();
  const c = await prisma.case.create({ data: { slug: `sema-${n}`, number: 100_000 + n } });
  const v = await prisma.caseVersion.create({
    data: {
      caseId: c.id,
      versionNo: 1,
      source: 'IMPORT',
      title: 'Şema',
      crimeLabel: 'Hırsızlık',
      lawRef: 'TCK 141',
      demandText: 'İddianame',
      possibleSentence: '1–3 yıl',
      difficulty: 1,
      categoryKey: 'CEZA',
      estimatedMinutes: 5,
      summary: 'Özet',
      coverCharacterKey: 'k',
      config: {},
    },
  });
  const snap = await prisma.contentVersion.create({
    data: { caseVersionId: v.id, kind: 'PUBLISH_SNAPSHOT', package: {}, packageHash: 'h', engineVersion: 1 },
  });
  return { caseId: c.id, versionId: v.id, snapshotId: snap.id };
}

async function makeUser(): Promise<string> {
  const n = unique();
  const u = await prisma.user.create({
    data: { firebaseUid: `uid-${n}`, displayName: 'Deniz Arslan', provider: 'password' },
  });
  return u.id;
}

afterAll(async () => {
  await prisma.$disconnect();
});

describe('schema', () => {
  it('reference data is seeded', async () => {
    const ranks = await prisma.rank.findMany({ orderBy: { sortOrder: 'asc' } });
    expect(ranks.map((r) => r.key)).toEqual(['STAJYER', 'AVUKAT', 'KIDEMLI', 'ORTAK']);
    expect(ranks.map((r) => r.minXp)).toEqual([0, 1000, 3000, 6000]);
    expect(ranks[2]?.label).toBe('Kıdemli Avukat');
    expect((await prisma.caseCategory.findMany()).map((c) => c.key)).toEqual(['CEZA']);
    expect(await prisma.caseDifficulty.count()).toBe(5);
  });

  it('spec tables exist', async () => {
    const rows = await prisma.$queryRaw<{ table_name: string }[]>`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    const names = new Set(rows.map((r) => r.table_name));
    expect(SPEC_TABLES).toHaveLength(39);
    expect(SPEC_TABLES.filter((t) => !names.has(t))).toEqual([]);
  });

  it('one active normal session per user and case', async () => {
    const userId = await makeUser();
    const { caseId, versionId, snapshotId } = await makeVersion();
    const base = { userId, caseId, caseVersionId: versionId, snapshotId, engineVersion: 1, currentNodeKey: 'n' };
    await prisma.gameSession.create({ data: { ...base, mode: 'NORMAL' } });
    await expect(prisma.gameSession.create({ data: { ...base, mode: 'NORMAL' } })).rejects.toMatchObject({
      code: 'P2002',
    });
    await prisma.gameSession.create({ data: { ...base, mode: 'TEST' } });
    await prisma.gameSession.create({ data: { ...base, mode: 'NORMAL', status: 'ABANDONED' } });
    expect(await prisma.gameSession.count({ where: { userId } })).toBe(3);
  });

  it('content rows cascade with the version', async () => {
    const { versionId } = await makeVersion();
    const node = await prisma.storyNode.create({
      data: { caseVersionId: versionId, key: 'n_a', sortOrder: 0, type: 'STORY', config: {} },
    });
    const choice = await prisma.storyChoice.create({
      data: { caseVersionId: versionId, nodeId: node.id, key: 'ch_a', sortOrder: 0, kind: 'CONTINUE', label: 'Devam' },
    });
    await prisma.storyEffect.create({
      data: {
        caseVersionId: versionId,
        ownerType: 'CHOICE',
        ownerId: choice.id,
        sortOrder: 0,
        type: 'VAR',
        payload: {},
      },
    });
    await prisma.caseVersion.delete({ where: { id: versionId } });
    expect(await prisma.storyNode.count({ where: { caseVersionId: versionId } })).toBe(0);
    expect(await prisma.storyChoice.count({ where: { caseVersionId: versionId } })).toBe(0);
    expect(await prisma.storyEffect.count({ where: { caseVersionId: versionId } })).toBe(0);
  });
});
