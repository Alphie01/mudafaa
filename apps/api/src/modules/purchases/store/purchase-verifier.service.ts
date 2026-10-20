import { Inject, Injectable } from '@nestjs/common';
import type { StorePlatform } from '@mudafaa/case-schema';
import { ENV, type Env, parseServiceAccount } from '../../../config/env.js';
import { AppleVerifier } from './apple.verifier.js';
import { FakeVerifier } from './fake.verifier.js';
import { GoogleVerifier } from './google.verifier.js';
import { type StoreVerifier, storeNotConfigured } from './verifier.js';

/** .p8 anahtarı: base64 (önerilen) ya da düz PEM. */
export function decodeP8(raw: string): string {
  const text = raw.includes('BEGIN PRIVATE KEY') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  return text.replace(/\\n/g, '\n');
}

/**
 * Platforma göre doğrulayıcı seçer. `PURCHASE_VERIFY_MODE=fake` iken iki platform da sahte doğrulayıcıdır; `store`
 * iken kimlik bilgisi eksik platform 503 `store_not_configured` döner (hak asla verilmez).
 */
@Injectable()
export class PurchaseVerifier {
  private google: GoogleVerifier | undefined;
  private apple: AppleVerifier | undefined;
  private readonly fake = new FakeVerifier();

  constructor(@Inject(ENV) private readonly env: Env) {}

  for(platform: StorePlatform): StoreVerifier {
    if (this.env.PURCHASE_VERIFY_MODE === 'fake') return this.fake;
    return platform === 'ANDROID' ? this.googleVerifier() : this.appleVerifier();
  }

  private googleVerifier(): GoogleVerifier {
    if (this.google !== undefined) return this.google;
    const raw = this.env.GOOGLE_PLAY_SERVICE_ACCOUNT;
    const sa = raw === undefined ? null : parseServiceAccount(raw);
    if (sa === null) throw storeNotConfigured('Google Play doğrulaması yapılandırılmamış.');
    this.google = GoogleVerifier.fromServiceAccount(sa, this.env.GOOGLE_PLAY_PACKAGE);
    return this.google;
  }

  private appleVerifier(): AppleVerifier {
    if (this.apple !== undefined) return this.apple;
    const { APPLE_ISSUER_ID: issuerId, APPLE_KEY_ID: keyId, APPLE_PRIVATE_KEY: key } = this.env;
    if (issuerId === undefined || keyId === undefined || key === undefined) {
      throw storeNotConfigured('App Store doğrulaması yapılandırılmamış.');
    }
    this.apple = AppleVerifier.create({
      issuerId,
      keyId,
      privateKey: decodeP8(key),
      bundleId: this.env.APPLE_BUNDLE_ID,
      appAppleId: this.env.APPLE_APP_ID,
    });
    return this.apple;
  }
}
