import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * E2E paketinden önce bir kez:
 * 1. Test veritabanına bekleyen migration'lar (referans verisi dahil) uygulanır (yıkıcı değil).
 * 2. Firebase Auth Emulator bulunur: `FIREBASE_AUTH_EMULATOR_HOST` (npm run test:e2e ayarlar) ya da localhost:9099'da
 *    çalışan bir emulator. Hiçbiri yoksa paket açık bir hatayla durur. Ortam değişkeni burada ayarlanınca test
 *    işçilerine de geçer (işçiler kurulumdan sonra başlar).
 */
export default async function setup(): Promise<void> {
  const cwd = fileURLToPath(new URL('../../..', import.meta.url));
  execSync('node scripts/migrate-test.mjs', { cwd, stdio: 'pipe' });
  const host = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? 'localhost:9099';
  try {
    await fetch(`http://${host}/`, { signal: AbortSignal.timeout(2000) });
  } catch {
    throw new Error(
      `Firebase Auth Emulator ${host} adresinde yok. E2E paketini \`npm run test:e2e\` ile çalıştırın ` +
        '(emulator yoksa firebase emulators:exec ile açar).',
    );
  }
  process.env.FIREBASE_AUTH_EMULATOR_HOST = host;
}
