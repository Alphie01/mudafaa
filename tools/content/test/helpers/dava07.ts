import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeCaseParts } from '@mudafaa/case-schema';

// Dava #07 testlerinin ortak yardımcıları. Dosya adı `.test.ts` ile bitmediği için Vitest bunu test olarak çalıştırmaz.

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
export const caseDir = join(repoRoot, 'content/cases/gece-bekcisinin-sirri');

/** `NN-*.json` parçaları, dosya adına göre sıralı. */
export const partFiles = (): string[] =>
  readdirSync(caseDir)
    .filter((file) => /^\d\d-[a-z0-9-]+\.json$/.test(file))
    .sort();

/** Parçaları ada göre sıralı okuyup `mergeCaseParts` ile tek CasePackage girdisine birleştirir. */
export const mergedCase = (): unknown =>
  mergeCaseParts(partFiles().map((file) => JSON.parse(readFileSync(join(caseDir, file), 'utf8')) as unknown));

/** Sahne nesnesi rect'inin merkezi (TAP koordinatı). */
export const center = (x: number, y: number, w: number, h: number) => ({
  kind: 'TAP' as const,
  x: x + Math.floor(w / 2),
  y: y + Math.floor(h / 2),
});
