import { PrismaPg } from '@prisma/adapter-pg';
import type { CasePackage } from '@mudafaa/case-schema';
import { canonicalJson } from '@mudafaa/engine';
import { afterAll, describe, expect, it } from 'vitest';
import { PrismaClient } from '../../src/generated/prisma/client.js';
import { clearContent, exportStory, importStory } from '../../src/modules/content/mapper/index.js';
import { TEST_DATABASE_URL } from './support/env.js';
import { createVersion, dava07, miniCase, retag, uniqueIdentity } from './support/fixtures.js';

// İçerik eşleyici I: hikâye tabloları (değişken, yüklem, node, seçenek, varyant, geçiş, tetikleyici, etki, diyalog).
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: TEST_DATABASE_URL }) });
afterAll(() => prisma.$disconnect());

const STORY = ['variables', 'predicates', 'nodes', 'triggers'] as const;
const pick = (pkg: CasePackage) => Object.fromEntries(STORY.map((k) => [k, pkg[k]]));

async function roundTrip(pkg: CasePackage) {
  const { versionId } = await createVersion(prisma, pkg);
  await prisma.$transaction((tx) => importStory(tx, versionId, pkg), { timeout: 30_000 });
  const out = await prisma.$transaction((tx) => exportStory(tx, versionId), { timeout: 30_000 });
  return { versionId, out };
}

describe('story mapper', () => {
  it('mini-case story round-trips', async () => {
    const pkg = retag(miniCase(), uniqueIdentity('ms'));
    const { out } = await roundTrip(pkg);
    expect(canonicalJson(out)).toBe(canonicalJson(pick(pkg)));
  });

  it('Dava #07 story round-trips', async () => {
    const pkg = retag(await dava07(), uniqueIdentity('ms7'));
    const { out } = await roundTrip(pkg);
    expect(canonicalJson(out)).toBe(canonicalJson(pick(pkg)));
  });

  it('empty collections survive', async () => {
    const pkg = retag(miniCase(), uniqueIdentity('mse'));
    const brief = pkg.nodes.find((n) => n.id === 'n_brief');
    const strA = pkg.nodes.flatMap((n) => n.choices).find((c) => c.id === 'ch_str_a');
    if (brief === undefined || strA === undefined) throw new Error('mini-case değişti');
    brief.onEnter = [];
    strA.responses = [];
    delete strA.effects;
    const { out } = await roundTrip(pkg);
    const outBrief = out.nodes.find((n) => n.id === 'n_brief');
    const outStrA = out.nodes.flatMap((n) => n.choices).find((c) => c.id === 'ch_str_a');
    expect(outBrief?.onEnter).toEqual([]);
    expect(outStrA?.responses).toEqual([]);
    expect(outStrA && 'effects' in outStrA).toBe(false);
    for (const n of pkg.nodes) {
      const o = out.nodes.find((x) => x.id === n.id);
      for (const k of ['onEnter', 'onFirstEnter', 'lines'] as const) expect(o && k in o).toBe(k in n);
    }
    expect(canonicalJson(out)).toBe(canonicalJson(pick(pkg)));
  });

  it('clearContent removes polymorphic rows', async () => {
    const pkg = retag(miniCase(), uniqueIdentity('msc'));
    const { versionId } = await roundTrip(pkg);
    expect(await prisma.storyEffect.count({ where: { caseVersionId: versionId } })).toBeGreaterThan(0);
    await prisma.$transaction((tx) => clearContent(tx, versionId));
    expect(await prisma.storyEffect.count({ where: { caseVersionId: versionId } })).toBe(0);
    expect(await prisma.characterDialogue.count({ where: { caseVersionId: versionId } })).toBe(0);
    expect(await prisma.storyNode.count({ where: { caseVersionId: versionId } })).toBe(0);
  });

  it('variants are child rows', async () => {
    const pkg = retag(miniCase(), uniqueIdentity('msv'));
    const { versionId } = await roundTrip(pkg);
    const parent = await prisma.storyChoice.findFirstOrThrow({ where: { caseVersionId: versionId, key: 'tp_night' } });
    const child = await prisma.storyChoice.findFirstOrThrow({
      where: { caseVersionId: versionId, key: 'tp_night#soft' },
    });
    expect(child.kind).toBe('VARIANT');
    expect(child.parentId).toBe(parent.id);
  });
});
