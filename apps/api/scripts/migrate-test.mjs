// Test veritabanına (DATABASE_URL_TEST, varsayılan 5434) bekleyen migration'ları uygular. Yıkıcı değildir: test
// konteyneri tmpfs'tedir ve her açılışta boş gelir; temiz bir veritabanı için `npm run db:down && npm run db:test:up`.
// Testler boş veritabanı varsaymaz, benzersiz veriyle çalışır.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import process from 'node:process';

if (existsSync('.env')) process.loadEnvFile('.env');
const url = process.env.DATABASE_URL_TEST ?? 'postgresql://mudafaa:mudafaa@localhost:5434/mudafaa_test';
execSync('npx prisma migrate deploy', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: url } });
