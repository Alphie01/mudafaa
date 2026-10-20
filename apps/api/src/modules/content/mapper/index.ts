import { CASE_FORMAT, CasePackage } from '@mudafaa/case-schema';
import { canonicalJson, fnv1a64 } from '@mudafaa/engine';
import { ApiError } from '../../../common/api-error.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import { defined, opt, type Tx } from './collections.js';
import { clearContent, exportStory, importStory, loadOwned, OwnedRows } from './story.mapper.js';
import { exportWorld, importWorld, type AssetInfo } from './world.mapper.js';

export type { Tx } from './collections.js';
export { clearContent, exportStory, importStory } from './story.mapper.js';
export { mimeOf, type AssetInfo } from './world.mapper.js';

/** `case_versions` meta kolonları (paketin `meta`'sından; slug ve numara `cases` satırındadır). */
export function versionMeta(pkg: CasePackage) {
  const m = pkg.meta;
  return {
    title: m.title,
    crimeLabel: m.crimeLabel,
    lawRef: m.lawRef,
    demandText: m.demandText,
    possibleSentence: m.possibleSentence,
    difficulty: m.difficulty,
    categoryKey: m.category,
    estimatedMinutes: m.estimatedMinutes,
    requiredRankKey: m.requiredRank ?? null,
    summary: m.summary,
    coverCharacterKey: m.coverCharacter,
    config: JSON.parse(
      JSON.stringify(defined({ config: pkg.config, report: pkg.report, tests: pkg.tests })),
    ) as Prisma.InputJsonValue,
    legalReviewStatus: m.legalReview.status,
    legalReviewBy: m.legalReview.by ?? null,
    legalReviewAt: m.legalReview.at ?? null,
  };
}

/**
 * Paketi sürümün ilişkisel satırlarına yazar: önceki içerik silinir, hikâye ve dünya tabloları doldurulur, sürümün meta
 * ve `config` kolonları güncellenir. Paketin slug/numarası davanınkiyle aynı olmalı; bilinmeyen rütbe reddedilir.
 */
export async function importPackage(
  tx: Tx,
  versionId: string,
  pkg: CasePackage,
  assetInfo: AssetInfo = {},
): Promise<void> {
  const version = await tx.caseVersion.findUniqueOrThrow({ where: { id: versionId }, include: { case: true } });
  if (pkg.meta.slug !== version.case.slug || pkg.meta.number !== version.case.number) {
    throw new ApiError(400, 'validation_error', 'Paketin slug/numarası davanınkiyle aynı olmalı.', {
      errors: [
        { path: 'meta.slug', message: `beklenen ${version.case.slug} (#${version.case.number})` },
        { path: 'meta.number', message: `gelen ${pkg.meta.slug} (#${pkg.meta.number})` },
      ],
    });
  }
  if (pkg.meta.requiredRank !== undefined) {
    const rank = await tx.rank.findUnique({ where: { key: pkg.meta.requiredRank } });
    if (rank === null) {
      throw new ApiError(400, 'validation_error', 'Bilinmeyen rütbe.', {
        errors: [{ path: 'meta.requiredRank', message: `bilinmeyen rütbe: ${pkg.meta.requiredRank}` }],
      });
    }
  }
  await clearContent(tx, versionId);
  const owned = new OwnedRows(versionId);
  await importStory(tx, versionId, pkg, owned);
  await importWorld(tx, versionId, pkg, owned, assetInfo);
  await owned.flush(tx);
  await tx.caseVersion.update({ where: { id: versionId }, data: versionMeta(pkg) });
}

/** Sürümün satırlarından paketi yeniden kurar; sonuç `CasePackage.parse`'tan geçer. */
export async function exportPackage(tx: Tx, versionId: string): Promise<CasePackage> {
  const version = await tx.caseVersion.findUniqueOrThrow({ where: { id: versionId }, include: { case: true } });
  const owned = await loadOwned(tx, versionId);
  const [story, world] = await Promise.all([
    exportStory(tx, versionId, owned),
    exportWorld(tx, versionId, owned.effects),
  ]);
  const cfg = version.config as { config: unknown; report: unknown; tests?: unknown };
  const pkg = {
    format: CASE_FORMAT,
    meta: defined({
      slug: version.case.slug,
      number: version.case.number,
      title: version.title,
      crimeLabel: version.crimeLabel,
      lawRef: version.lawRef,
      demandText: version.demandText,
      possibleSentence: version.possibleSentence,
      difficulty: version.difficulty,
      category: version.categoryKey,
      estimatedMinutes: version.estimatedMinutes,
      requiredRank: opt(version.requiredRankKey),
      summary: version.summary,
      coverCharacter: version.coverCharacterKey,
      legalReview: defined({
        status: version.legalReviewStatus,
        by: opt(version.legalReviewBy),
        at: opt(version.legalReviewAt),
      }),
    }),
    config: cfg.config,
    predicates: story.predicates,
    variables: story.variables,
    sprites: world.sprites,
    characters: world.characters,
    relationships: world.relationships,
    evidence: world.evidence,
    evidenceRelations: world.evidenceRelations,
    discoveryPaths: world.discoveryPaths,
    scenes: world.scenes,
    court: world.court,
    nodes: story.nodes,
    triggers: story.triggers,
    outcomes: world.outcomes,
    report: cfg.report,
    assets: world.assets,
    ...(cfg.tests === undefined || cfg.tests === null ? {} : { tests: cfg.tests }),
  };
  return CasePackage.parse(pkg);
}

/** İçerik hash'i: `meta.legalReview` HARİÇ (hukuki onay doğrulamayı geçersiz kılmaz); yayın kapısı bunu karşılaştırır. */
export function contentHash(pkg: CasePackage): string {
  return fnv1a64(canonicalJson({ ...pkg, meta: { ...pkg.meta, legalReview: undefined } }));
}

/** Paketin tam hash'i. */
export const packageHash = (pkg: CasePackage): string => fnv1a64(canonicalJson(pkg));
