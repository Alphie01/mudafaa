// Geliştirme verisi: content/cases altındaki her davayı içe aktarır, doğrular ve yayınlar (case:import --publish).
// Hukuki inceleme kullanıcı tarafından Claude'a devredildiği için onaylı yayınlanır.
// Kullanım: npm run seed -w @mudafaa/api [-- <dava dizini>...]
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { describeImport, importCase } from './case-import.js';
import { CliModule } from './cli.module.js';

const envFile = join(import.meta.dirname, '..', '..', '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

const root = resolve(import.meta.dirname, '..', '..', '..', '..', 'content', 'cases');
const dirs =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2).map((d) => resolve(d))
    : readdirSync(root).map((d) => join(root, d));
const app = await NestFactory.createApplicationContext(CliModule, { logger: ['error', 'warn'] });
let failed = 0;
for (const dir of dirs) {
  try {
    const r = await importCase(app, dir, { publish: true, legalApproved: true, reviewer: 'Claude (iç inceleme)' });
    for (const line of describeImport(dir, r)) console.log(line);
    if (r.snapshotId === undefined) failed += 1;
  } catch (e) {
    failed += 1;
    console.error(
      `HATA ${dir}: ${e instanceof Error ? e.message : String(e)}`,
      (e as { errors?: unknown }).errors ?? '',
    );
  }
}
await app.close();
process.exit(failed > 0 ? 1 : 0);
