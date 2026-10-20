import { fileURLToPath } from 'node:url';
import { loadEnv, type Env } from '../../../src/config/env.js';

/** Docker "test" profili (npm run db:test:up): postgres-test 5434, redis-test 6380. */
export const TEST_DATABASE_URL =
  process.env.DATABASE_URL_TEST ?? 'postgresql://mudafaa:mudafaa@localhost:5434/mudafaa_test';
export const TEST_REDIS_URL = process.env.REDIS_URL_TEST ?? 'redis://localhost:6380';
/** Testlerin varlık deposu (git dışı `storage/`); uygulama yeniden başlatılınca aynı dizin kullanılır. */
export const TEST_ASSET_DIR = fileURLToPath(new URL('../../../storage/test-assets', import.meta.url));

/**
 * E2E ortamı: hızlı doğrulama bütçesi (sayım bütçeleri; `maxMs` yalnızca acil durdurma), yüksek hız sınırı (golden
 * path'ler saniyede onlarca aksiyon gönderir), APP_ROLE=all (kuyruk işleyicisi aynı süreçte).
 */
export function testEnv(overrides: Record<string, string | undefined> = {}): Env {
  return loadEnv({
    NODE_ENV: 'test',
    APP_ROLE: 'all',
    DATABASE_URL: TEST_DATABASE_URL,
    REDIS_URL: TEST_REDIS_URL,
    FIREBASE_PROJECT_ID: 'demo-mudafaa',
    FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST,
    ASSET_DIR: TEST_ASSET_DIR,
    THROTTLE_LIMIT: '100000',
    THROTTLE_CHOOSE_LIMIT: '100000',
    VALIDATOR_MAX_STATES: '1000',
    VALIDATOR_WALKS: '10',
    VALIDATOR_MAX_MS: '60000',
    ...overrides,
  });
}
