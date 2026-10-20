import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { APP_OPTIONS, configureApp } from './app.setup.js';
import { ENV, type Env } from './config/env.js';

// Yerel geliştirmede apps/api/.env okunur (ortamda tanımlı değişkenler ezilmez); üretimde değişkenler ortamdan gelir.
// Ortam, modül yüklenirken değil NestFactory.create sırasında (EnvModule) okunduğu için buradaki sıra yeterlidir.
const envFile = join(import.meta.dirname, '..', '.env');
if (existsSync(envFile)) process.loadEnvFile(envFile);

const app = configureApp(await NestFactory.create(AppModule, APP_OPTIONS));
app.enableShutdownHooks();

const { PORT } = app.get<Env>(ENV);
await app.listen(PORT);
Logger.log(`API dinliyor: http://localhost:${PORT}/v1`, 'Bootstrap');
