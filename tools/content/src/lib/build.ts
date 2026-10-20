import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mergeCaseParts } from '@mudafaa/case-schema';
import { compile } from '@mudafaa/engine';
import type { Issue } from '@mudafaa/engine';
import { format, resolveConfig } from 'prettier';
import { assertUniqueIds, checkPartNames } from '../kit/case.js';
import type { CaseParts } from '../kit/case.js';
import { caseOutDir, caseSrcDir } from './paths.js';

// case:build'in çekirdeği: kaynağı çalıştırır (tsx altında dinamik import), parça adlarını ve kimlik tekilliğini
// denetler, parçaları Prettier biçiminde `content/cases/<slug>/NN-ad.json` olarak yazar, birleştirip motorla derler.

/** JSON'u depodaki Prettier ayarlarıyla, Prettier'ın yazacağı biçimde metne çevirir. */
export async function formatJson(value: unknown, filepath: string): Promise<string> {
  const config = (await resolveConfig(filepath)) ?? {};
  return format(JSON.stringify(value), { ...config, filepath });
}

/** `content/src/<slug>/index.ts`'in varsayılan dışa aktarımını çalıştırıp parçaları döndürür. */
export async function loadSource(slug: string, root?: string): Promise<CaseParts> {
  const entry = join(caseSrcDir(slug, root), 'index.ts');
  if (!existsSync(entry)) throw new Error(`${entry} yok (önce: npm run case:new -- ${slug} <numara>)`);
  const mod = (await import(pathToFileURL(entry).href)) as { default?: unknown };
  if (typeof mod.default !== 'function') {
    throw new Error(`${entry}: varsayılan dışa aktarım bir fonksiyon olmalı (export default defineCase(() => ({…})))`);
  }
  const parts = (await (mod.default as () => unknown)()) as unknown;
  if (typeof parts !== 'object' || parts === null || Array.isArray(parts)) {
    throw new Error(`${entry}: fonksiyon { 'NN-ad': parça } nesnesi döndürmeli`);
  }
  return parts as CaseParts;
}

export interface BuildResult {
  ok: boolean;
  /** Yazılan (ya da `write: false` ise yazılacak) dosya adları, sıralı. */
  files: string[];
  merged: unknown;
  issues: Issue[];
  warnings: Issue[];
}

/** Parçaları denetler, birleştirir, derler ve (varsayılan) yazar. Eski adlı `NN-*.json` parçaları silinir. */
export async function buildParts(
  slug: string,
  parts: CaseParts,
  opts: { write?: boolean; root?: string } = {},
): Promise<BuildResult> {
  checkPartNames(parts);
  assertUniqueIds(parts);
  const names = Object.keys(parts).sort();
  const merged = mergeCaseParts(names.map((n) => parts[n]));
  const compiled = compile(merged);
  const files = names.map((n) => `${n}.json`);
  if (opts.write !== false) {
    const out = caseOutDir(slug, opts.root);
    mkdirSync(out, { recursive: true });
    for (const stale of readdirSync(out).filter((f) => /^\d{2}-.*\.json$/.test(f) && !files.includes(f))) {
      rmSync(join(out, stale));
    }
    for (const n of names) {
      const path = join(out, `${n}.json`);
      writeFileSync(path, await formatJson(parts[n], path));
    }
  }
  return compiled.ok
    ? { ok: true, files, merged, issues: [], warnings: compiled.warnings }
    : { ok: false, files, merged, issues: compiled.issues, warnings: [] };
}

/** Kaynaktan derleme: `loadSource` + `buildParts`. */
export async function buildCase(slug: string, opts: { write?: boolean; root?: string } = {}): Promise<BuildResult> {
  return buildParts(slug, await loadSource(slug, opts.root), opts);
}

/** Bulgu satırı (CLI çıktısı). */
export const issueLine = (i: Issue): string => `  ${i.severity} ${i.code} ${i.path}: ${i.message}`;
