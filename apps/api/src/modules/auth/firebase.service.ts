import { Inject, Injectable } from '@nestjs/common';
import { type App, getApps, initializeApp } from 'firebase-admin/app';
import { type DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { ENV, type Env } from '../../config/env.js';

/** firebase-admin sarmalayıcısı; FIREBASE_AUTH_EMULATOR_HOST tanımlıysa emulator token'larını doğrular. */
@Injectable()
export class FirebaseService {
  private readonly app: App;

  constructor(@Inject(ENV) env: Env) {
    if (env.FIREBASE_AUTH_EMULATOR_HOST !== undefined) {
      process.env.FIREBASE_AUTH_EMULATOR_HOST = env.FIREBASE_AUTH_EMULATOR_HOST;
    }
    this.app = getApps()[0] ?? initializeApp({ projectId: env.FIREBASE_PROJECT_ID });
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
