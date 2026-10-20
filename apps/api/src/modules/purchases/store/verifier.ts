import { ApiError } from '../../../common/api-error.js';

/** SANDBOX: App Store sandbox işlemi ya da Google Play test satın alması (lisans test kullanıcısı). */
export type StoreEnvironment = 'PRODUCTION' | 'SANDBOX';

/** Mağazanın doğruladığı tek seferlik ürün (dava kilidi). */
export interface VerifiedProduct {
  productId: string;
  orderId: string | undefined;
  environment: StoreEnvironment;
  /** Mağazanın ham yanıtı (purchases.verification). */
  raw: unknown;
}

/** Mağazanın doğruladığı abonelik: dönem, mağazanın bildirdiği bitiş tarihidir. */
export interface VerifiedSubscription {
  productId: string;
  /** Yenilemelerde değişmeyen kimlik (Android: purchaseToken · iOS: originalTransactionId). */
  originalId: string;
  /** Mağazaya sonradan yeniden sorulurken kullanılacak token. */
  latestToken: string;
  expiresAt: Date;
  autoRenewing: boolean;
  orderId: string | undefined;
  environment: StoreEnvironment;
  raw: unknown;
}

/** Bir mağazanın sunucu API'si üzerinden makbuz doğrulayıcısı; geçersiz makbuz → 400 `purchase_invalid`. */
export interface StoreVerifier {
  verifyProduct(productId: string, token: string): Promise<VerifiedProduct>;
  verifySubscription(productId: string, token: string): Promise<VerifiedSubscription>;
}

export const purchaseInvalid = (message = 'Satın alma doğrulanamadı.'): ApiError =>
  new ApiError(400, 'purchase_invalid', message);

/** Mağaza kimlik bilgileri eksik ya da yetkisiz: hak asla verilmez. */
export const storeNotConfigured = (message = 'Mağaza doğrulaması yapılandırılmamış.'): ApiError =>
  new ApiError(503, 'store_not_configured', message);

/** Mağaza API'si beklenmeyen bir yanıt döndü (istemci daha sonra yeniden dener). */
export const storeUnavailable = (message = 'Mağazaya şu anda ulaşılamıyor; daha sonra tekrar deneyin.'): ApiError =>
  new ApiError(502, 'store_unavailable', message);
