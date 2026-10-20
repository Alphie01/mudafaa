import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { APP_OPTIONS, configureApp } from './app.setup.js';
import { ENV, loadEnv, type Env } from './config/env.js';
import { WorkerModule } from './worker.module.js';

// Yerel geliştirmede apps/api/.env okunur (ortamda tanımlı değişkenler ezilmez); üretimde değişkenler ortamdan gelir.
// Ortam, modül yüklenirken değil NestFactory.create sırasında (EnvModule) okunduğu için buradaki sıra yeterlidir.
const envFile = join(import.meta.dirname, '..', '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

// APP_ROLE: api → HTTP uçları (kuyruğa yalnızca iş koyar) · worker → yalnızca kuyruk işleyicisi, HTTP dinlemez ·
// all → ikisi aynı süreçte (geliştirme ve e2e).
if (loadEnv(process.env).APP_ROLE === 'worker') {
  const ctx = await NestFactory.createApplicationContext(WorkerModule);
  ctx.enableShutdownHooks();
  Logger.log('Doğrulama işleyicisi çalışıyor (content-validation)', 'Bootstrap');
} else {
  const app = configureApp(await NestFactory.create(AppModule, APP_OPTIONS));
  app.enableShutdownHooks();
  const { PORT } = app.get<Env>(ENV);
  await app.listen(PORT);
  Logger.log(`API dinliyor: http://localhost:${PORT}/v1`, 'Bootstrap');
}
