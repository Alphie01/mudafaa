// İçerik içe aktarma: npm run case:import -- <dava dizini | case.json> [--publish] [--legal-approved]
// Dava yoksa meta.slug/number ile oluşturulur; paket DRAFT olarak içe aktarılır ve doğrulanır. --publish ile doğrulama
// geçtiyse yayınlanır (--legal-approved hukuki incelemeyi onaylı işaretler). Doğrulama geçmezse çıkış kodu 1.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ContentService, type ImportResult } from '../modules/content/content.service.js';
import { CliModule } from './cli.module.js';

export interface ImportOptions {
  publish?: boolean;
  legalApproved?: boolean;
  reviewer?: string;
}

/** CLI'nin çekirdeği (testler doğrudan çağırır). */
export function importCase(
  app: INestApplicationContext,
  path: string,
  opts: ImportOptions = {},
): Promise<ImportResult> {
  return app.get(ContentService).importDir(path, opts);
}

/** Sonucu insan okunur satırlara çevirir. */
export function describeImport(path: string, r: ImportResult): string[] {
  const out = [`${path}: sürüm ${r.versionNo} (${r.versionId}) · doğrulama ${r.validation}`];
  for (const i of r.issues.slice(0, 20)) out.push(`  ${i.severity} ${i.code} ${i.path}: ${i.message}`);
  if (r.issues.length > 20) out.push(`  … ${r.issues.length - 20} sorun daha`);
  if (r.snapshotId !== undefined) out.push(`  yayınlandı: snapshot ${r.snapshotId}`);
  return out;
}

async function main(argv: string[]): Promise<number> {
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  const paths = argv.filter((a) => !a.startsWith('--')).map((p) => resolve(p));
  if (paths.length === 0) {
    console.error('Kullanım: case:import <dava dizini | case.json>... [--publish] [--legal-approved]');
    return 2;
  }
  const app = await NestFactory.createApplicationContext(CliModule, { logger: ['error', 'warn'] });
  let code = 0;
  try {
    for (const path of paths) {
      try {
        const r = await importCase(app, path, {
          publish: flags.has('--publish'),
          legalApproved: flags.has('--legal-approved'),
        });
        for (const line of describeImport(path, r)) console.log(line);
        if (r.validation !== 'PASSED') code = 1;
      } catch (e) {
        code = 1;
        const errors = (e as { errors?: { path: string; message: string }[] }).errors ?? [];
        console.error(`HATA ${path}: ${e instanceof Error ? e.message : String(e)}`);
        for (const err of errors.slice(0, 20)) console.error(`  ${err.path}: ${err.message}`);
      }
    }
  } finally {
    await app.close();
  }
  return code;
}

if (process.argv[1] !== undefined && import.meta.filename === resolve(process.argv[1])) {
  const envFile = join(import.meta.dirname, '..', '..', '.env');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  process.exit(await main(process.argv.slice(2)));
}
