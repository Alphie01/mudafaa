import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { CasePackage } from '@mudafaa/case-schema';
import { ContentService, type FileReader } from '../../../src/modules/content/content.service.js';
import { ValidationService } from '../../../src/modules/content/validation.service.js';
import type { TestApp } from './app.js';
import { DAVA07_DIR, retag, uniqueIdentity } from './fixtures.js';

/** 1×1 saydam PNG (mini-case'in sahne görseli yerine). */
export const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64',
);

/** Varlık okuyucu: Dava #07 dizininden gerçek dosyalar, bulunamayan yollar için küçük PNG. */
export const fixtureFiles: FileReader = async (p) => readFile(join(DAVA07_DIR, p)).catch(() => TINY_PNG);

export interface Published {
  caseId: string;
  versionId: string;
  snapshotId: string;
  pkg: CasePackage;
}

/**
 * Paketi benzersiz slug/numarayla içe aktarır, doğrular ve yayınlar (servisler üzerinden; HTTP uçları kendi
 * testlerinde). `requiredRank` verilirse pakete yazılır. `legal` true ise hukuki onaylı yayınlanır.
 */
export async function publishFixture(
  t: TestApp,
  pkg: CasePackage,
  opts: { slug?: string; number?: number; requiredRank?: string; legal?: boolean; prefix?: string } = {},
): Promise<Published> {
  const id = uniqueIdentity(opts.prefix ?? 'pub');
  const p = retag(pkg, { slug: opts.slug ?? id.slug, number: opts.number ?? id.number });
  for (const a of p.assets) delete a.sha256;
  if (opts.requiredRank !== undefined) p.meta.requiredRank = opts.requiredRank;
  const content = t.app.get(ContentService);
  const { caseId } = await content.findOrCreateCase(p);
  const { versionId } = await content.importDraft(caseId, p, 'IMPORT', {}, fixtureFiles);
  const v = await t.app.get(ValidationService).runNow(versionId);
  if (v.status !== 'PASSED') throw new Error(`Doğrulama geçmedi: ${v.status} (${p.meta.slug})`);
  const { snapshotId } = await content.publish(caseId, versionId, { legalReviewConfirmed: opts.legal === true });
  return { caseId, versionId, snapshotId, pkg: await content.exportVersion(versionId) };
}
