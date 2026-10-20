import { Inject, Injectable } from '@nestjs/common';
import { type App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { type DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { ENV, type Env, parseServiceAccount } from '../../config/env.js';

/**
 * firebase-admin sarmalayıcısı; FIREBASE_AUTH_EMULATOR_HOST tanımlıysa emulator token'larını doğrular,
 * FIREBASE_SERVICE_ACCOUNT tanımlıysa yönetim çağrıları o anahtarla yapılır.
 */
@Injectable()
export class FirebaseService {
  private readonly app: App;

  constructor(@Inject(ENV) env: Env) {
    if (env.FIREBASE_AUTH_EMULATOR_HOST !== undefined) {
      process.env.FIREBASE_AUTH_EMULATOR_HOST = env.FIREBASE_AUTH_EMULATOR_HOST;
    }
    const sa = env.FIREBASE_SERVICE_ACCOUNT === undefined ? null : parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT);
    this.app =
      getApps()[0] ??
      initializeApp({ projectId: env.FIREBASE_PROJECT_ID, ...(sa === null ? {} : { credential: cert(sa) }) });
  }

  verify(token: string, checkRevoked: boolean): Promise<DecodedIdToken> {
    return getAuth(this.app).verifyIdToken(token, checkRevoked);
  }

  async deleteUser(uid: string): Promise<void> {
    const auth = getAuth(this.app);
    await auth.revokeRefreshTokens(uid).catch(() => undefined);
    await auth.deleteUser(uid).catch(() => undefined);
  }
}
