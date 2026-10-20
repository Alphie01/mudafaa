import { randomUUID } from 'node:crypto';

/** Auth Emulator adresi (global-setup ayarlar; `npm run test:e2e`). */
export function emulatorHost(): string {
  const host = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  if (host === undefined || host === '') {
    throw new Error('FIREBASE_AUTH_EMULATOR_HOST yok: e2e paketini `npm run test:e2e` ile çalıştırın.');
  }
  return host;
}

/** Emulator'da yeni kullanıcı açar (varsayılan: rastgele e-postalı; `anonymous` ile misafir) ve ID token döner. */
export async function emulatorUser(
  opts: { anonymous?: boolean; email?: string } = {},
): Promise<{ idToken: string; uid: string; email: string | null }> {
  const email = opts.anonymous === true ? null : (opts.email ?? `u-${randomUUID().slice(0, 12)}@test.mudafaa`);
  const res = await fetch(`http://${emulatorHost()}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      email === null ? { returnSecureToken: true } : { email, password: 'gizli-123', returnSecureToken: true },
    ),
  });
  if (!res.ok) throw new Error(`Emulator kaydı başarısız: ${res.status} ${await res.text()}`);
  const body = (await res.json()) as { idToken: string; localId: string };
  return { idToken: body.idToken, uid: body.localId, email };
}
