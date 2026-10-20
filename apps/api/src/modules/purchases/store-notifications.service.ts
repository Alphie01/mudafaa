import { Inject, Injectable, Logger } from '@nestjs/common';
import { PRODUCT_PREMIUM } from '@mudafaa/case-schema';
import { z } from 'zod';
import { ApiError } from '../../common/api-error.js';
import { ENV, type Env } from '../../config/env.js';
import { CLOCK, type Clock } from './clock.js';
import { EntitlementService, sandboxPlatforms } from './entitlement.service.js';
import type { AppleNotificationDecoder } from './store/apple.verifier.js';
import { purchaseInvalid, storeNotConfigured } from './store/verifier.js';

/** App Store bildirim çözücüsünün enjeksiyon token'ı (e2e testleri imzasız sahte çözücüyle değiştirir). */
export const APPLE_NOTIFICATIONS = Symbol('APPLE_NOTIFICATIONS');
export type AppleNotifications = Pick<AppleNotificationDecoder, 'decode'>;

/** Pub/Sub push OIDC token doğrulayıcısının enjeksiyon token'ı (e2e testleri sahte doğrulayıcı kullanır). */
export const GOOGLE_OIDC = Symbol('GOOGLE_OIDC');
/** İmzası, süresi ve audience'ı doğrulanmış token'ın kimlik alanları; geçersiz token'da hata fırlatır. */
export interface GoogleOidcVerifier {
  verify(idToken: string, audience: string): Promise<{ email?: string; emailVerified?: boolean }>;
}

/** Pub/Sub push gövdesi: `message.data` base64 JSON (DeveloperNotification). */
export const PubSubPush = z.object({
  message: z.object({ data: z.string().min(1), messageId: z.string().optional() }),
  subscription: z.string().optional(),
});

/** Play RTDN (DeveloperNotification) yalnızca kullandığımız alanlarla. */
const DeveloperNotification = z.object({
  packageName: z.string(),
  eventTimeMillis: z.coerce.number().optional(),
  subscriptionNotification: z
    .object({ notificationType: z.number().int(), purchaseToken: z.string(), subscriptionId: z.string() })
    .optional(),
  oneTimeProductNotification: z
    .object({ notificationType: z.number().int(), purchaseToken: z.string(), sku: z.string() })
    .optional(),
  voidedPurchaseNotification: z
    .object({ purchaseToken: z.string(), orderId: z.string().optional(), productType: z.number().int().optional() })
    .optional(),
  testNotification: z.object({}).passthrough().optional(),
});
export type DeveloperNotification = z.infer<typeof DeveloperNotification>;

/** SubscriptionNotification.notificationType: 12 = SUBSCRIPTION_REVOKED (iade ile geri alındı). */
const SUBSCRIPTION_REVOKED = 12;
/** VoidedPurchaseNotification.productType: 1 abonelik · 2 tek seferlik ürün. */
const VOIDED_SUBSCRIPTION = 1;

export type NotificationResult = { handled: boolean; action: string };

/**
 * Mağaza sunucu bildirimleri: iade, geri alma, yenileme ve süre dolumu hesaba yansıtılır.
 * - App Store Server Notifications v2: imzalı yük Apple kök sertifikalarıyla doğrulanır.
 * - Google Play RTDN (Pub/Sub push): Google imzalı OIDC Bearer token'ı; audience GOOGLE_RTDN_AUDIENCE olmalı,
 *   GOOGLE_RTDN_SERVICE_ACCOUNT tanımlıysa token o servis hesabına ait olmalı.
 * Sandbox kapısı kapalıyken (production, APPLE_ALLOW_SANDBOX=false) sandbox bildirimleri hiçbir şey değiştirmez.
 */
@Injectable()
export class StoreNotificationsService {
  private readonly logger = new Logger('StoreNotifications');

  constructor(
    private readonly entitlements: EntitlementService,
    @Inject(APPLE_NOTIFICATIONS) private readonly apple: AppleNotifications,
    @Inject(GOOGLE_OIDC) private readonly oidc: GoogleOidcVerifier,
    @Inject(ENV) private readonly env: Env,
    @Inject(CLOCK) private readonly now: Clock,
  ) {}

  // ── App Store ──
  async handleApple(signedPayload: string): Promise<NotificationResult> {
    const n = await this.apple.decode(signedPayload);
    if (n.environment === 'SANDBOX' && !sandboxPlatforms(this.env).includes('IOS')) {
      this.logger.warn(`Sandbox App Store bildirimi yok sayıldı (${n.type}); APPLE_ALLOW_SANDBOX kapalı.`);
      return { handled: false, action: 'ignored:sandbox' };
    }
    const tx = n.transaction;
    if (tx === undefined) return { handled: false, action: `ignored:${n.type}` };
    const product = tx.productId;
    const at = new Date(tx.revocationDate ?? this.now().getTime());
    switch (n.type) {
      case 'REFUND':
      case 'REVOKE': {
        if (product === PRODUCT_PREMIUM && tx.originalTransactionId !== undefined) {
          // İade edilen dönemin başı işlemin satın alma (yenileme) tarihidir; o tarihten sonraki seçimler geri alınır.
          const periodStart = tx.purchaseDate === undefined ? undefined : new Date(tx.purchaseDate);
          const sub = await this.entitlements.revokeSubscription('IOS', tx.originalTransactionId, at, periodStart);
          if (tx.transactionId !== undefined) await this.entitlements.revokePurchase('IOS', tx.transactionId, at);
          return { handled: sub, action: 'subscription_revoked' };
        }
        const ok =
          tx.transactionId !== undefined && (await this.entitlements.revokePurchase('IOS', tx.transactionId, at));
        return { handled: ok, action: 'purchase_revoked' };
      }
      case 'EXPIRED':
      case 'DID_RENEW': {
        if (product !== PRODUCT_PREMIUM || tx.originalTransactionId === undefined || tx.expiresDate === undefined) {
          return { handled: false, action: `ignored:${n.type}` };
        }
        const ok = await this.entitlements.updateSubscription('IOS', tx.originalTransactionId, {
          expiresAt: new Date(tx.expiresDate),
          autoRenewing: n.type === 'DID_RENEW',
        });
        return { handled: ok, action: n.type === 'DID_RENEW' ? 'subscription_renewed' : 'subscription_expired' };
      }
      default:
        return { handled: false, action: `ignored:${n.type}` };
    }
  }

  // ── Google Play ──
  /** Pub/Sub push isteğinin `Authorization: Bearer <OIDC>` başlığı; audience tanımsızsa uç kapalıdır (503). */
  async authenticateGoogle(authorization: string | undefined): Promise<void> {
    const audience = this.env.GOOGLE_RTDN_AUDIENCE;
    if (audience === undefined) throw storeNotConfigured('Play bildirimleri yapılandırılmamış.');
    const m = /^Bearer\s+(\S+)$/i.exec(authorization ?? '');
    const unauthorized = () => new ApiError(401, 'unauthorized', 'Bildirim kimliği doğrulanamadı.');
    if (m === null) throw unauthorized();
    let identity: { email?: string; emailVerified?: boolean };
    try {
      identity = await this.oidc.verify(m[1] as string, audience);
    } catch (e) {
      this.logger.warn(`Play bildirimi OIDC doğrulaması başarısız: ${(e as Error).message}`);
      throw unauthorized();
    }
    const expected = this.env.GOOGLE_RTDN_SERVICE_ACCOUNT;
    if (expected !== undefined && (identity.email !== expected || identity.emailVerified !== true)) {
      this.logger.warn(`Play bildirimi beklenmeyen servis hesabından: ${identity.email ?? '?'}`);
      throw unauthorized();
    }
  }

  static decodeGoogle(push: z.infer<typeof PubSubPush>): DeveloperNotification {
    let json: unknown;
    try {
      json = JSON.parse(Buffer.from(push.message.data, 'base64').toString('utf8'));
    } catch {
      throw purchaseInvalid('Bildirim çözülemedi.');
    }
    const r = DeveloperNotification.safeParse(json);
    if (!r.success) throw purchaseInvalid('Bildirim biçimi geçersiz.');
    return r.data;
  }

  async handleGoogle(n: DeveloperNotification): Promise<NotificationResult> {
    if (n.packageName !== this.env.GOOGLE_PLAY_PACKAGE) return { handled: false, action: 'ignored:package' };
    const at = new Date(n.eventTimeMillis ?? this.now().getTime());
    if (n.voidedPurchaseNotification !== undefined) {
      const v = n.voidedPurchaseNotification;
      const purchase = await this.entitlements.revokePurchase('ANDROID', v.purchaseToken, at);
      const sub =
        v.productType === VOIDED_SUBSCRIPTION
          ? await this.entitlements.revokeSubscription('ANDROID', v.purchaseToken, at)
          : false;
      return { handled: purchase || sub, action: 'voided' };
    }
    if (n.subscriptionNotification !== undefined) {
      const s = n.subscriptionNotification;
      if (s.notificationType === SUBSCRIPTION_REVOKED) {
        const ok = await this.entitlements.revokeSubscription('ANDROID', s.purchaseToken, at);
        await this.entitlements.revokePurchase('ANDROID', s.purchaseToken, at);
        return { handled: ok, action: 'subscription_revoked' };
      }
      // Diğer durum değişiklikleri (yenileme, iptal, askı, süre dolumu): güncel durum mağazadan okunur.
      const ok = await this.entitlements.reverifySubscription('ANDROID', s.subscriptionId, s.purchaseToken);
      return { handled: ok, action: 'subscription_reverified' };
    }
    if (n.oneTimeProductNotification !== undefined) {
      // Satın alma / iptal bildirimi: hak yalnızca istemcinin gönderdiği doğrulanmış makbuzla verilir.
      return { handled: false, action: `ignored:one_time:${n.oneTimeProductNotification.sku}` };
    }
    return { handled: false, action: n.testNotification === undefined ? 'ignored' : 'test' };
  }

  log(store: string, r: NotificationResult): void {
    this.logger.log(`${store} bildirimi: ${r.action}${r.handled ? '' : ' (eşleşen kayıt yok)'}`);
  }
}
