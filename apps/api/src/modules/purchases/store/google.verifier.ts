import { Logger } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import type { ServiceAccount } from '../../../config/env.js';
import type { StoreVerifier, VerifiedProduct, VerifiedSubscription } from './verifier.js';
import { purchaseInvalid, storeNotConfigured, storeUnavailable } from './verifier.js';

const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';
const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';

/** purchases.products.get yanıtının kullandığımız alanları. */
interface ProductPurchase {
  purchaseState?: number;
  consumptionState?: number;
  orderId?: string;
  productId?: string;
  purchaseType?: number;
}

/** purchases.subscriptionsv2.get yanıtının kullandığımız alanları. */
interface SubscriptionPurchaseV2 {
  subscriptionState?: string;
  acknowledgementState?: string;
  latestOrderId?: string;
  linkedPurchaseToken?: string;
  lineItems?: { productId?: string; expiryTime?: string; autoRenewingPlan?: { autoRenewEnabled?: boolean } }[];
}

export interface GoogleVerifierOptions {
  packageName: string;
  /** OAuth erişim token'ı (servis hesabı JWT'si); testlerde sahte. */
  accessToken: () => Promise<string>;
  fetch?: typeof fetch;
}

/** Bekleyen ya da iptal edilmiş ödeme: abonelik hiç başlamamıştır. */
const NOT_STARTED = new Set(['SUBSCRIPTION_STATE_PENDING', 'SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED']);

/** Google Play: Android Publisher API v3 (REST + servis hesabı). Abonelik onayı (acknowledge) sunucuda yapılır. */
export class GoogleVerifier implements StoreVerifier {
  private readonly logger = new Logger('GoogleVerifier');
  private readonly fetch: typeof fetch;

  constructor(private readonly opts: GoogleVerifierOptions) {
    this.fetch = opts.fetch ?? globalThis.fetch;
  }

  /** Servis hesabı anahtarından doğrulayıcı (erişim token'ı google-auth-library önbelleğinden). */
  static fromServiceAccount(sa: ServiceAccount, packageName: string): GoogleVerifier {
    const jwt = new JWT({ email: sa.clientEmail, key: sa.privateKey, scopes: [SCOPE] });
    return new GoogleVerifier({
      packageName,
      accessToken: async () => {
        const { token } = await jwt.getAccessToken();
        if (token === null || token === undefined) throw storeNotConfigured("Google erişim token'ı alınamadı.");
        return token;
      },
    });
  }

  private async call<T>(method: 'GET' | 'POST', path: string): Promise<T> {
    let token: string;
    try {
      token = await this.opts.accessToken();
    } catch (e) {
      this.logger.error(`Google servis hesabı token'ı alınamadı: ${(e as Error).message}`);
      throw storeNotConfigured();
    }
    const url = `${API}/${encodeURIComponent(this.opts.packageName)}/purchases/${path}`;
    let res: Response;
    try {
      res = await this.fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(method === 'POST' ? { body: '{}' } : {}),
        signal: AbortSignal.timeout(10_000),
      });
    } catch (e) {
      this.logger.warn(`Google Play API'ye ulaşılamadı: ${(e as Error).message}`);
      throw storeUnavailable();
    }
    if (res.ok) {
      const text = await res.text();
      return (text === '' ? {} : JSON.parse(text)) as T;
    }
    const detail = await res.text().catch(() => '');
    // 400/404/410: token geçersiz, başka pakete ait ya da süresi çoktan dolmuş.
    if (res.status === 400 || res.status === 404 || res.status === 410) throw purchaseInvalid();
    if (res.status === 401 || res.status === 403) {
      this.logger.error(`Google Play API yetki hatası ${res.status}: ${detail.slice(0, 300)}`);
      throw storeNotConfigured('Google Play servis hesabı yetkili değil.');
    }
    this.logger.warn(`Google Play API ${res.status}: ${detail.slice(0, 300)}`);
    throw storeUnavailable();
  }

  async verifyProduct(productId: string, token: string): Promise<VerifiedProduct> {
    const p = await this.call<ProductPurchase>(
      'GET',
      `products/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(token)}`,
    );
    // purchaseState: 0 satın alındı · 1 iptal · 2 bekliyor.
    if (p.purchaseState !== 0) throw purchaseInvalid('Ödeme tamamlanmamış ya da iptal edilmiş.');
    if (p.productId !== undefined && p.productId !== productId) throw purchaseInvalid('Ürün eşleşmiyor.');
    return { productId, orderId: p.orderId, raw: p };
  }

  async verifySubscription(productId: string, token: string): Promise<VerifiedSubscription> {
    const s = await this.call<SubscriptionPurchaseV2>('GET', `subscriptionsv2/tokens/${encodeURIComponent(token)}`);
    if (s.subscriptionState === undefined || NOT_STARTED.has(s.subscriptionState)) {
      throw purchaseInvalid('Abonelik ödemesi tamamlanmamış.');
    }
    const items = (s.lineItems ?? []).filter((i) => i.productId === productId && i.expiryTime !== undefined);
    if (items.length === 0) throw purchaseInvalid('Ürün eşleşmiyor.');
    const latest = items.reduce((a, b) => (Date.parse(a.expiryTime ?? '') >= Date.parse(b.expiryTime ?? '') ? a : b));
    const expiresAt = new Date(latest.expiryTime ?? 0);
    if (Number.isNaN(expiresAt.getTime())) throw storeUnavailable();
    if (s.acknowledgementState === 'ACKNOWLEDGEMENT_STATE_PENDING') await this.acknowledge(productId, token);
    return {
      productId,
      originalId: token,
      latestToken: token,
      expiresAt,
      autoRenewing: latest.autoRenewingPlan?.autoRenewEnabled === true,
      orderId: s.latestOrderId,
      raw: s,
    };
  }

  /** Onaylanmayan abonelik 3 gün içinde Google tarafından iade edilir; hata hakkı engellemez (istemci de onaylar). */
  private async acknowledge(productId: string, token: string): Promise<void> {
    try {
      await this.call(
        'POST',
        `subscriptions/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(token)}:acknowledge`,
      );
    } catch (e) {
      this.logger.warn(`Abonelik onaylanamadı: ${(e as Error).message}`);
    }
  }
}
