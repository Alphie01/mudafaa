import { existsSync } from 'node:fs';
import { defineConfig } from 'prisma/config';

// Prisma 7 .env dosyasını kendisi yüklemez. Yerel .env varsa okunur; ortamda tanımlı değişkenler ezilmez.
if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // `prisma generate` adres istemez (postinstall .env olmadan da çalışır); migrate komutları DATABASE_URL ister.
  datasource: { url: process.env.DATABASE_URL },
});
