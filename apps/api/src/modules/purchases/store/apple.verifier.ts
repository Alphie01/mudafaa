import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Logger } from '@nestjs/common';
import {
  APIException,
  AppStoreServerAPIClient,
  Environment,
  SignedDataVerifier,
  VerificationException,
  type JWSRenewalInfoDecodedPayload,
  type ResponseBodyV2DecodedPayload,
  type JWSTransactionDecodedPayload,
  type StatusResponse,
  type TransactionInfoResponse,
} from '@apple/app-store-server-library';
import { ApiError } from '../../../common/api-error.js';
import type { StoreEnvironment, StoreVerifier, VerifiedProduct, VerifiedSubscription } from './verifier.js';
import { purchaseInvalid, storeNotConfigured, storeUnavailable } from './verifier.js';

/** Apple kök sertifikaları (apple.com/certificateauthority: Root CA, G2, G3); imzalı işlem zinciri bunlara dayanır. */
export const APPLE_ROOT_DIR = fileURLToPath(new URL('../../../../certs/apple/', import.meta.url));

export function appleRootCertificates(dir = APPLE_ROOT_DIR): Buffer[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.cer'))
    .sort()
    .map((f) => readFileSync(`${dir}${f}`));
}

/** Bir App Store ortamı (production / sandbox): API istemcisi ve JWS doğrulayıcısı. */
export interface AppleEnvironment {
  name: string;
  client: Pick<AppStoreServerAPIClient, 'getTransactionInfo' | 'getAllSubscriptionStatuses'>;
  /** Yoksa (production'da APPLE_APP_ID eksik) bu ortamda bulunan işlem doğrulanamaz → 503. */
  verifier: Pick<SignedDataVerifier, 'verifyAndDecodeTransaction' | 'verifyAndDecodeRenewalInfo'> | undefined;
}

export interface AppleConfig {
  issuerId: string;
  keyId: string;
  /** .p8 içeriği (PEM). */
  privateKey: string;
  bundleId: string;
  appAppleId: number | undefined;
}

const envOf = (env: AppleEnvironment): StoreEnvironment => (env.name === 'sandbox' ? 'SANDBOX' : 'PRODUCTION');

/** Bu durum kodlarında işlem bu ortamda yoktur; sıradaki ortam denenir. */
const NOT_HERE = new Set([404]);

/**
 * App Store: App Store Server API (resmî Node kütüphanesi). İşlem önce production'da, bulunamazsa sandbox'ta aranır;
 * dönen imzalı işlem (JWS) Apple kök sertifikalarıyla doğrulanır.
 */
export class AppleVerifier implements StoreVerifier {
  private readonly logger = new Logger('AppleVerifier');

  constructor(
    private readonly bundleId: string,
    private readonly envs: AppleEnvironment[],
  ) {}

  static create(cfg: AppleConfig, roots: Buffer[] = appleRootCertificates()): AppleVerifier {
    const make = (name: string, environment: Environment, appId: number | undefined): AppleEnvironment => ({
      name,
      client: new AppStoreServerAPIClient(cfg.privateKey, cfg.keyId, cfg.issuerId, cfg.bundleId, environment),
      verifier:
        environment === Environment.PRODUCTION && appId === undefined
          ? undefined
          : new SignedDataVerifier(roots, true, environment, cfg.bundleId, appId),
    });
    return new AppleVerifier(cfg.bundleId, [
      make('production', Environment.PRODUCTION, cfg.appAppleId),
      make('sandbox', Environment.SANDBOX, cfg.appAppleId),
    ]);
  }

  /** `fn`'i ortamlarda sırayla dener; hiçbirinde işlem yoksa 400. */
  private async inEnvironments<T>(
    fn: (env: AppleEnvironment, verifier: NonNullable<AppleEnvironment['verifier']>) => Promise<T>,
    lookup: (env: AppleEnvironment) => Promise<unknown>,
  ): Promise<T> {
    for (const env of this.envs) {
      try {
        await lookup(env);
      } catch (e) {
        if (e instanceof APIException && NOT_HERE.has(e.httpStatusCode)) continue;
        throw this.mapError(e);
      }
      if (env.verifier === undefined) {
        this.logger.error(`İşlem ${env.name} ortamında bulundu ama APPLE_APP_ID tanımlı değil.`);
        throw storeNotConfigured('App Store doğrulaması için APPLE_APP_ID gerekir.');
      }
      try {
        return await fn(env, env.verifier);
      } catch (e) {
        throw this.mapError(e);
      }
    }
    throw purchaseInvalid("İşlem App Store'da bulunamadı.");
  }

  private mapError(e: unknown): Error {
    if (e instanceof ApiError) return e;
    if (e instanceof APIException) {
      if (e.httpStatusCode === 400) return purchaseInvalid();
      if (e.httpStatusCode === 401 || e.httpStatusCode === 403) {
        this.logger.error(`App Store Server API yetki hatası ${e.httpStatusCode}: ${e.errorMessage ?? ''}`);
        return storeNotConfigured('App Store anahtarı geçersiz.');
      }
      this.logger.warn(`App Store Server API ${e.httpStatusCode}: ${e.errorMessage ?? ''}`);
      return storeUnavailable();
    }
    // SignedDataVerifier: imza zinciri, bundle ya da ortam uyuşmazlığı.
    if (e instanceof VerificationException) return purchaseInvalid();
    this.logger.warn(`App Store doğrulama hatası: ${e instanceof Error ? e.message : String(e)}`);
    return storeUnavailable();
  }

  private checkTransaction(tx: JWSTransactionDecodedPayload, productId: string): void {
    if (tx.bundleId !== this.bundleId) throw purchaseInvalid('Uygulama eşleşmiyor.');
    if (tx.productId !== productId) throw purchaseInvalid('Ürün eşleşmiyor.');
    if (tx.revocationDate !== undefined) throw purchaseInvalid('Satın alma iade edilmiş.');
  }

  async verifyProduct(productId: string, token: string): Promise<VerifiedProduct> {
    let info: TransactionInfoResponse | undefined;
    return this.inEnvironments(
      async (env, verifier) => {
        if (info?.signedTransactionInfo === undefined) throw purchaseInvalid();
        const tx = await verifier.verifyAndDecodeTransaction(info.signedTransactionInfo);
        this.checkTransaction(tx, productId);
        return { productId, orderId: tx.transactionId, environment: envOf(env), raw: tx };
      },
      async (env) => {
        info = await env.client.getTransactionInfo(token);
      },
    );
  }

  async verifySubscription(productId: string, token: string): Promise<VerifiedSubscription> {
    let status: StatusResponse | undefined;
    return this.inEnvironments(
      async (env, verifier) => {
        let best: { tx: JWSTransactionDecodedPayload; renewal: JWSRenewalInfoDecodedPayload | undefined } | undefined;
        for (const group of status?.data ?? []) {
          for (const item of group.lastTransactions ?? []) {
            if (item.signedTransactionInfo === undefined) continue;
            const tx = await verifier.verifyAndDecodeTransaction(item.signedTransactionInfo);
            if (tx.productId !== productId || tx.bundleId !== this.bundleId || tx.expiresDate === undefined) continue;
            if (best !== undefined && (best.tx.expiresDate ?? 0) >= tx.expiresDate) continue;
            const renewal =
              item.signedRenewalInfo === undefined
                ? undefined
                : await verifier.verifyAndDecodeRenewalInfo(item.signedRenewalInfo);
            best = { tx, renewal };
          }
        }
        if (best === undefined || best.tx.originalTransactionId === undefined)
          throw purchaseInvalid('Ürün eşleşmiyor.');
        const { tx, renewal } = best;
        // İade edilen abonelik süresi dolmuş sayılır.
        const expiresAt = new Date(tx.revocationDate ?? tx.expiresDate ?? 0);
        return {
          productId,
          originalId: tx.originalTransactionId as string,
          latestToken: tx.originalTransactionId as string,
          expiresAt,
          autoRenewing: renewal?.autoRenewStatus === 1 && tx.revocationDate === undefined,
          orderId: tx.transactionId,
          environment: envOf(env),
          raw: { transaction: tx, renewal },
        };
      },
      async (env) => {
        status = await env.client.getAllSubscriptionStatuses(token);
      },
    );
  }
}

/** Çözülmüş App Store Server Notification v2. */
export interface AppleNotification {
  type: string;
  subtype: string | undefined;
  environment: StoreEnvironment;
  transaction: JWSTransactionDecodedPayload | undefined;
  renewal: JWSRenewalInfoDecodedPayload | undefined;
}

type NotificationVerifier = Pick<
  SignedDataVerifier,
  'verifyAndDecodeNotification' | 'verifyAndDecodeTransaction' | 'verifyAndDecodeRenewalInfo'
>;

/**
 * App Store Server Notifications v2: `signedPayload` Apple kök sertifikalarıyla doğrulanır (API anahtarı gerekmez).
 * Bildirimin ortamı imzadan önce bilinmediği için production ve sandbox doğrulayıcıları sırayla denenir.
 */
export class AppleNotificationDecoder {
  constructor(private readonly verifiers: { environment: StoreEnvironment; verifier: NotificationVerifier }[]) {}

  static create(bundleId: string, appAppleId: number | undefined, roots: Buffer[] = appleRootCertificates()) {
    return new AppleNotificationDecoder([
      // Production doğrulaması sayısal uygulama kimliği ister; yoksa yalnızca sandbox bildirimleri kabul edilir.
      ...(appAppleId === undefined
        ? []
        : [
            {
              environment: 'PRODUCTION' as const,
              verifier: new SignedDataVerifier(roots, true, Environment.PRODUCTION, bundleId, appAppleId),
            },
          ]),
      { environment: 'SANDBOX', verifier: new SignedDataVerifier(roots, true, Environment.SANDBOX, bundleId) },
    ]);
  }

  /** İmza geçersizse (hiçbir ortamda doğrulanamazsa) 400 `purchase_invalid`. */
  async decode(signedPayload: string): Promise<AppleNotification> {
    for (const { environment, verifier } of this.verifiers) {
      let payload: ResponseBodyV2DecodedPayload;
      try {
        payload = await verifier.verifyAndDecodeNotification(signedPayload);
      } catch (e) {
        if (e instanceof VerificationException) continue;
        throw e;
      }
      const data = payload.data;
      return {
        type: String(payload.notificationType ?? ''),
        subtype: payload.subtype === undefined ? undefined : String(payload.subtype),
        environment,
        transaction:
          data?.signedTransactionInfo === undefined
            ? undefined
            : await verifier.verifyAndDecodeTransaction(data.signedTransactionInfo),
        renewal:
          data?.signedRenewalInfo === undefined
            ? undefined
            : await verifier.verifyAndDecodeRenewalInfo(data.signedRenewalInfo),
      };
    }
    throw purchaseInvalid('Bildirim imzası doğrulanamadı.');
  }
}
