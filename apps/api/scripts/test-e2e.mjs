// E2E paketini Firebase Auth Emulator ile çalıştırır (kökteki `npm run test:e2e`).
// localhost:9099'da çalışan bir emulator varsa (ör. `npm run emulators` ya da geliştirme oturumu) onu kullanır; yoksa
// `firebase emulators:exec` ile geçici bir emulator açar. Ek argümanlar vitest'e geçer (ör. dosya süzgeci).
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../..', import.meta.url));
const args = process.argv.slice(2);
const vitest = ['vitest', 'run', '--project', 'api-e2e', ...args];

const running = await fetch('http://localhost:9099/', { signal: globalThis.AbortSignal.timeout(1500) }).then(
  () => true,
  () => false,
);

const quote = (a) => (/^[\w@%+=:,./-]+$/.test(a) ? a : `'${a.replaceAll("'", "'\\''")}'`);
const result = running
  ? spawnSync('npx', vitest, {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, FIREBASE_AUTH_EMULATOR_HOST: 'localhost:9099' },
    })
  : spawnSync(
      'firebase',
      ['emulators:exec', '--only', 'auth', '--project', 'demo-mudafaa', ['npx', ...vitest].map(quote).join(' ')],
      { cwd: root, stdio: 'inherit' },
    );
process.exit(result.status ?? 1);
