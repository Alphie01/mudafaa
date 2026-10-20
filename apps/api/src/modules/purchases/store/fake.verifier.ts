import type { StoreVerifier, VerifiedProduct, VerifiedSubscription } from './verifier.js';
import { purchaseInvalid } from './verifier.js';

const DAY_MS = 86_400_000;
const SUB = /^test:sub:(-?\d{1,4})(?::(.+))?$/;

/**
 * Sahte doğrulayıcı (PURCHASE_VERIFY_MODE=fake; production'da yasak). Yalnızca `test:` önekli token'ları kabul eder:
 * - ürün: `test:<herhangi>` (ör. `test:case:abc`);
 * - abonelik: `test:sub:<gün>[:<kimlik>]` → bitiş şimdi + gün (eksi gün süresi dolmuş abonelik). Aynı `<kimlik>`
 *   yenileme gibi aynı aboneliği günceller; verilmezse token'ın kendisi kimliktir.
 */
export class FakeVerifier implements StoreVerifier {
  constructor(private readonly now: () => number = Date.now) {}

  verifyProduct(productId: string, token: string): Promise<VerifiedProduct> {
    if (!token.startsWith('test:') || SUB.test(token)) return Promise.reject(purchaseInvalid());
    return Promise.resolve({
      productId,
      orderId: `FAKE.${token.slice(5)}`,
      environment: 'SANDBOX',
      raw: { fake: true, productId, token },
    });
  }

  verifySubscription(productId: string, token: string): Promise<VerifiedSubscription> {
    const m = SUB.exec(token);
    if (m === null) return Promise.reject(purchaseInvalid());
    const days = Number(m[1]);
    const expiresAt = new Date(this.now() + days * DAY_MS);
    return Promise.resolve({
      productId,
      originalId: m[2] === undefined ? token : `test:sub:${m[2]}`,
      latestToken: token,
      expiresAt,
      autoRenewing: days > 0,
      orderId: `FAKE.${token.slice(5)}`,
      // Sahte satın almalar test satın alması sayılır (hakları `sandbox` işaretlidir).
      environment: 'SANDBOX',
      raw: { fake: true, productId, token, expiresAt: expiresAt.toISOString() },
    });
  }
}
