// Geliştirme verisi: content/cases altındaki her davayı içe aktarıp yayınlar.
// Kullanım: npm run seed -w @mudafaa/api [-- <dava dizini>...]
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { ContentService } from '../modules/content/content.service.js';

const envFile = join(import.meta.dirname, '..', '..', '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

const root = resolve(import.meta.dirname, '..', '..', '..', '..', 'content', 'cases');
const dirs =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2).map((d) => resolve(d))
    : readdirSync(root).map((d) => join(root, d));
const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
const content = app.get(ContentService);
let failed = 0;
for (const dir of dirs) {
  try {
    const r = await content.importDir(dir, { legalApproved: true });
    console.log(`yayınlandı: ${dir} → sürüm ${r.versionId}`);
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
