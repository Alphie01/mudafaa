import { randomInt, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CasePackage } from '@mudafaa/case-schema';
import { loadCase } from '@mudafaa/validator';
import type { PrismaClient } from '../../../src/generated/prisma/client.js';
import { versionMeta } from '../../../src/modules/content/mapper/index.js';

export const MINI_PATH = fileURLToPath(
  new URL('../../../../../packages/case-schema/fixtures/mini-case.json', import.meta.url),
);
export const DAVA07_DIR = fileURLToPath(new URL('../../../../../content/cases/gece-bekcisinin-sirri', import.meta.url));

/** Sabit, geçerli bir sha256 (eşleyici testlerinde varlık dosyası gerekmez). */
export const FAKE_SHA = 'a'.repeat(64);

/** Mini-case paketinin bağımsız kopyası (ham JSON; Zod çıktısı girdiye eşittir). */
export const miniRaw = (): CasePackage => JSON.parse(readFileSync(MINI_PATH, 'utf8')) as CasePackage;
export const miniCase = (): CasePackage => CasePackage.parse(miniRaw());

/** Dava #07'nin birleştirilmiş paketi. */
export async function dava07(): Promise<CasePackage> {
  return CasePackage.parse(await loadCase(DAVA07_DIR));
}

/** Testler boş veritabanı varsaymaz: her dava benzersiz slug ve numarayla açılır. */
export function uniqueIdentity(prefix = 't'): { slug: string; number: number } {
  return { slug: `${prefix}-${randomUUID().slice(0, 8)}`, number: randomInt(10_000, 2_000_000_000) };
}

/** Paketin kopyası: yeni slug/numara ve (isteğe bağlı) bütün varlıklarda sabit sha256. */
export function retag(pkg: CasePackage, id: { slug: string; number: number }, sha?: string): CasePackage {
  const out = JSON.parse(JSON.stringify(pkg)) as CasePackage;
  out.meta.slug = id.slug;
  out.meta.number = id.number;
  if (sha !== undefined) for (const a of out.assets) a.sha256 = sha;
  return out;
}

/** Eşleyici testleri için: dava + boş DRAFT sürüm satırı. */
export async function createVersion(
  prisma: PrismaClient,
  pkg: CasePackage,
): Promise<{ caseId: string; versionId: string }> {
  const c = await prisma.case.create({
    data: { slug: pkg.meta.slug, number: pkg.meta.number, difficultyLevel: pkg.meta.difficulty },
  });
  const v = await prisma.caseVersion.create({
    data: { caseId: c.id, versionNo: 1, status: 'DRAFT', source: 'IMPORT', ...versionMeta(pkg) },
  });
  return { caseId: c.id, versionId: v.id };
}
