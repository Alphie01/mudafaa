import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { Injectable } from '@nestjs/common';
import type { CasePackage } from '@mudafaa/case-schema';
import { canonicalJson, compile, ENGINE_VERSION, fnv1a64 } from '@mudafaa/engine';
import { loadCase } from '@mudafaa/validator';
import { ApiError } from '../../common/api-error.js';
import { PrismaService } from '../../database/prisma.service.js';
import { AssetStore } from './asset.store.js';

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

/**
 * İçerik hattı (M1 hızlı yol): dava dizinini yükler, derler, varlıkları depoya koyar ve yayınlanmış değişmez bir
 * snapshot üretir. Önceki yayın SUPERSEDED olur; ona sabitlenmiş oturumlar oynanmaya devam eder.
 */
@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assets: AssetStore,
  ) {}

  async importDir(
    dir: string,
    opts: { legalApproved?: boolean } = {},
  ): Promise<{ caseId: string; versionId: string; snapshotId: string }> {
    const raw = (await loadCase(dir)) as CasePackage;
    const compiled = compile(raw);
    if (!compiled.ok) {
      throw new ApiError(400, 'validation_error', 'Dava derlenemedi.', {
        errors: compiled.issues.slice(0, 50).map((i) => ({ path: i.path, message: `${i.code}: ${i.message}` })),
      });
    }
    const pkg = JSON.parse(JSON.stringify(compiled.c.pkg)) as CasePackage;
    const files: { key: string; kind: string; path: string; sha256: string; mime: string; size: number }[] = [];
    for (const a of pkg.assets) {
      const bytes = await readFile(join(dir, a.path));
      const { sha256, size } = await this.assets.put(bytes);
      a.sha256 = sha256;
      files.push({
        key: a.id,
        kind: a.kind,
        path: a.path,
        sha256,
        mime: MIME[extname(a.path).toLowerCase()] ?? 'application/octet-stream',
        size,
      });
    }
    if (opts.legalApproved)
      pkg.meta.legalReview = {
        status: 'APPROVED',
        by: 'Claude (iç inceleme)',
        at: new Date().toISOString().slice(0, 10),
      };
    return this.publish(pkg, files);
  }

  private async publish(
    pkg: CasePackage,
    files: { key: string; kind: string; path: string; sha256: string; mime: string; size: number }[],
  ): Promise<{ caseId: string; versionId: string; snapshotId: string }> {
    const m = pkg.meta;
    const hash = fnv1a64(canonicalJson(pkg));
    return this.prisma.$transaction(async (tx) => {
      const c = await tx.case.upsert({
        where: { slug: m.slug },
        update: {
          number: m.number,
          difficultyLevel: m.difficulty,
          requiredRankKey: m.requiredRank ?? null,
          archivedAt: null,
        },
        create: {
          slug: m.slug,
          number: m.number,
          difficultyLevel: m.difficulty,
          requiredRankKey: m.requiredRank ?? null,
        },
      });
      const last = await tx.caseVersion.findFirst({ where: { caseId: c.id }, orderBy: { versionNo: 'desc' } });
      await tx.caseVersion.updateMany({ where: { caseId: c.id, status: 'PUBLISHED' }, data: { status: 'SUPERSEDED' } });
      const v = await tx.caseVersion.create({
        data: {
          caseId: c.id,
          versionNo: (last?.versionNo ?? 0) + 1,
          status: 'PUBLISHED',
          source: 'IMPORT',
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
          config: JSON.parse(JSON.stringify({ config: pkg.config, report: pkg.report, tests: pkg.tests ?? null })),
          packageHash: hash,
          legalReviewStatus: m.legalReview.status,
          legalReviewBy: m.legalReview.by ?? null,
          legalReviewAt: m.legalReview.at ?? null,
          publishedAt: new Date(),
        },
      });
      await tx.asset.createMany({ data: files.map((f, i) => ({ ...f, caseVersionId: v.id, sortOrder: i })) });
      const snap = await tx.contentVersion.create({
        data: {
          caseVersionId: v.id,
          kind: 'PUBLISH_SNAPSHOT',
          package: JSON.parse(JSON.stringify(pkg)),
          packageHash: hash,
          engineVersion: ENGINE_VERSION,
        },
      });
      await tx.case.update({ where: { id: c.id }, data: { currentVersionId: v.id } });
      return { caseId: c.id, versionId: v.id, snapshotId: snap.id };
    });
  }
}
