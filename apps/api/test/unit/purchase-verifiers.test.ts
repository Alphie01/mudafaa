import { APIException, VerificationException, VerificationStatus } from '@apple/app-store-server-library';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../src/common/api-error.js';
import { loadEnv } from '../../src/config/env.js';
import {
  AppleVerifier,
  type AppleEnvironment,
  appleRootCertificates,
} from '../../src/modules/purchases/store/apple.verifier.js';
import { FakeVerifier } from '../../src/modules/purchases/store/fake.verifier.js';
import { GoogleVerifier } from '../../src/modules/purchases/store/google.verifier.js';
import { decodeP8, PurchaseVerifier } from '../../src/modules/purchases/store/purchase-verifier.service.js';

const NOW = Date.parse('2026-10-20T12:00:00.000Z');

/** Hata kodunu yakalar (ApiError değilse yeniden fırlatır). */
async function codeOf(p: Promise<unknown>): Promise<string> {
  try {
    await p;
  } catch (e) {
    if (e instanceof ApiError) return `${e.status} ${e.code}`;
    throw e;
  }
  return 'ok';
}

describe('FakeVerifier', () => {
  const fake = new FakeVerifier(() => NOW);

  it('accepts test: product tokens and rejects anything else', async () => {
    await expect(fake.verifyProduct('dava_kilidi', 'test:case:1')).resolves.toMatchObject({ productId: 'dava_kilidi' });
    expect(await codeOf(fake.verifyProduct('dava_kilidi', 'GPA.1234'))).toBe('400 purchase_invalid');
    expect(await codeOf(fake.verifyProduct('dava_kilidi', 'test:sub:30'))).toBe('400 purchase_invalid');
  });

  it('derives subscription expiry and identity from test:sub:<days>[:<id>]', async () => {
    const s = await fake.verifySubscription('premium_aylik', 'test:sub:30:abc');
    expect(s.expiresAt.toISOString()).toBe('2026-11-19T12:00:00.000Z');
    expect(s).toMatchObject({ originalId: 'test:sub:abc', latestToken: 'test:sub:30:abc', autoRenewing: true });
    const expired = await fake.verifySubscription('premium_aylik', 'test:sub:-1');
    expect(expired.expiresAt.getTime()).toBeLessThan(NOW);
    expect(expired).toMatchObject({ originalId: 'test:sub:-1', autoRenewing: false });
    expect(await codeOf(fake.verifySubscription('premium_aylik', 'test:case:1'))).toBe('400 purchase_invalid');
  });
});

describe('GoogleVerifier', () => {
  const json = (status: number, body: unknown) =>
    new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
  const make = (...responses: Response[]) => {
    const fetch = vi.fn<typeof globalThis.fetch>();
    for (const r of responses) fetch.mockResolvedValueOnce(r);
    const v = new GoogleVerifier({ packageName: 'com.monolithyazilim.mudafaa', accessToken: async () => 'at', fetch });
    return { v, fetch };
  };

  it('verifies a purchased in-app product via purchases.products.get', async () => {
    const { v, fetch } = make(json(200, { purchaseState: 0, orderId: 'GPA.1', productId: 'dava_kilidi' }));
    await expect(v.verifyProduct('dava_kilidi', 'tok/1')).resolves.toMatchObject({ orderId: 'GPA.1' });
    const [url, init] = fetch.mock.calls[0] ?? [];
    expect(url).toBe(
      'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/com.monolithyazilim.mudafaa/purchases/products/dava_kilidi/tokens/tok%2F1',
    );
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer at');
  });

  it('marks license-tester purchases (purchaseType 0 / testPurchase) as SANDBOX', async () => {
    const test = make(json(200, { purchaseState: 0, purchaseType: 0 }));
    expect((await test.v.verifyProduct('dava_kilidi', 't')).environment).toBe('SANDBOX');
    const real = make(json(200, { purchaseState: 0 }));
    expect((await real.v.verifyProduct('dava_kilidi', 't')).environment).toBe('PRODUCTION');
    const sub = make(
      json(200, {
        subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE',
        testPurchase: {},
        lineItems: [{ productId: 'premium_aylik', expiryTime: '2026-11-20T12:00:00Z' }],
      }),
    );
    expect((await sub.v.verifySubscription('premium_aylik', 't')).environment).toBe('SANDBOX');
  });

  it('rejects pending/canceled purchases and mismatched products', async () => {
    expect(await codeOf(make(json(200, { purchaseState: 2 })).v.verifyProduct('dava_kilidi', 't'))).toBe(
      '400 purchase_invalid',
    );
    expect(
      await codeOf(make(json(200, { purchaseState: 0, productId: 'baska' })).v.verifyProduct('dava_kilidi', 't')),
    ).toBe('400 purchase_invalid');
  });

  it('maps HTTP errors: 404/410 invalid, 401/403 not configured, 5xx unavailable', async () => {
    expect(await codeOf(make(json(404, '')).v.verifyProduct('dava_kilidi', 't'))).toBe('400 purchase_invalid');
    expect(await codeOf(make(json(410, '')).v.verifyProduct('dava_kilidi', 't'))).toBe('400 purchase_invalid');
    expect(await codeOf(make(json(401, '')).v.verifyProduct('dava_kilidi', 't'))).toBe('503 store_not_configured');
    expect(await codeOf(make(json(403, '')).v.verifyProduct('dava_kilidi', 't'))).toBe('503 store_not_configured');
    expect(await codeOf(make(json(500, '')).v.verifyProduct('dava_kilidi', 't'))).toBe('502 store_unavailable');
  });

  it('reads subscriptionsv2 expiry and acknowledges a pending subscription', async () => {
    const { v, fetch } = make(
      json(200, {
        subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE',
        acknowledgementState: 'ACKNOWLEDGEMENT_STATE_PENDING',
        latestOrderId: 'GPA.9',
        lineItems: [
          {
            productId: 'premium_aylik',
            expiryTime: '2026-11-20T12:00:00Z',
            autoRenewingPlan: { autoRenewEnabled: true },
          },
        ],
      }),
      json(200, ''),
    );
    const s = await v.verifySubscription('premium_aylik', 'subtok');
    expect(s).toMatchObject({ originalId: 'subtok', latestToken: 'subtok', autoRenewing: true, orderId: 'GPA.9' });
    expect(s.expiresAt.toISOString()).toBe('2026-11-20T12:00:00.000Z');
    expect(fetch).toHaveBeenCalledTimes(2);
    const [ackUrl, ackInit] = fetch.mock.calls[1] ?? [];
    expect(ackUrl).toMatch(/purchases\/subscriptions\/premium_aylik\/tokens\/subtok:acknowledge$/);
    expect(ackInit?.method).toBe('POST');
  });

  it('rejects pending subscriptions and foreign products', async () => {
    const pending = make(json(200, { subscriptionState: 'SUBSCRIPTION_STATE_PENDING', lineItems: [] }));
    expect(await codeOf(pending.v.verifySubscription('premium_aylik', 't'))).toBe('400 purchase_invalid');
    const other = make(
      json(200, {
        subscriptionState: 'SUBSCRIPTION_STATE_ACTIVE',
        lineItems: [{ productId: 'baska', expiryTime: '2026-11-20T12:00:00Z' }],
      }),
    );
    expect(await codeOf(other.v.verifySubscription('premium_aylik', 't'))).toBe('400 purchase_invalid');
  });

  it('reports a missing access token as not configured', async () => {
    const v = new GoogleVerifier({
      packageName: 'p',
      accessToken: () => Promise.reject(new Error('invalid_grant')),
      fetch: vi.fn<typeof fetch>(),
    });
    expect(await codeOf(v.verifyProduct('dava_kilidi', 't'))).toBe('503 store_not_configured');
  });
});

describe('AppleVerifier', () => {
  const tx = (over: Record<string, unknown> = {}) => ({
    bundleId: 'com.monolithyazilim.mudafaa',
    productId: 'dava_kilidi',
    transactionId: '2000001',
    originalTransactionId: '2000001',
    ...over,
  });
  const env = (name: string, opts: { found?: unknown; status?: unknown; verified?: unknown; noVerifier?: boolean }) => {
    const notFound = new APIException(404, 4040010, 'Transaction id not found.');
    const e: AppleEnvironment = {
      name,
      client: {
        getTransactionInfo: vi.fn(() =>
          opts.found === undefined ? Promise.reject(notFound) : Promise.resolve(opts.found as never),
        ),
        getAllSubscriptionStatuses: vi.fn(() =>
          opts.status === undefined ? Promise.reject(notFound) : Promise.resolve(opts.status as never),
        ),
      },
      verifier: opts.noVerifier
        ? undefined
        : {
            verifyAndDecodeTransaction: vi.fn(() => Promise.resolve((opts.verified ?? tx()) as never)),
            verifyAndDecodeRenewalInfo: vi.fn(() => Promise.resolve({ autoRenewStatus: 1 } as never)),
          },
    };
    return e;
  };
  const BUNDLE = 'com.monolithyazilim.mudafaa';

  it('falls back from production to sandbox when the transaction is not found', async () => {
    const prod = env('production', {});
    const sandbox = env('sandbox', { found: { signedTransactionInfo: 'jws' } });
    const v = new AppleVerifier(BUNDLE, [prod, sandbox]);
    await expect(v.verifyProduct('dava_kilidi', '2000001')).resolves.toMatchObject({
      orderId: '2000001',
      environment: 'SANDBOX',
    });
    expect(prod.client.getTransactionInfo).toHaveBeenCalledWith('2000001');
    expect(sandbox.verifier?.verifyAndDecodeTransaction).toHaveBeenCalledWith('jws');
  });

  it('returns 400 when no environment knows the transaction', async () => {
    const v = new AppleVerifier(BUNDLE, [env('production', {}), env('sandbox', {})]);
    expect(await codeOf(v.verifyProduct('dava_kilidi', '1'))).toBe('400 purchase_invalid');
  });

  it('needs APPLE_APP_ID to verify a production transaction', async () => {
    const v = new AppleVerifier(BUNDLE, [
      env('production', { found: { signedTransactionInfo: 'jws' }, noVerifier: true }),
    ]);
    expect(await codeOf(v.verifyProduct('dava_kilidi', '1'))).toBe('503 store_not_configured');
  });

  it('rejects wrong product, wrong bundle, revoked and unverifiable transactions', async () => {
    const found = { signedTransactionInfo: 'jws' };
    const run = (verified: unknown) =>
      codeOf(new AppleVerifier(BUNDLE, [env('sandbox', { found, verified })]).verifyProduct('dava_kilidi', '1'));
    expect(await run(tx({ productId: 'premium_aylik' }))).toBe('400 purchase_invalid');
    expect(await run(tx({ bundleId: 'com.baska' }))).toBe('400 purchase_invalid');
    expect(await run(tx({ revocationDate: NOW }))).toBe('400 purchase_invalid');
    const broken = env('sandbox', { found });
    vi.mocked(broken.verifier!.verifyAndDecodeTransaction).mockRejectedValueOnce(
      new VerificationException(VerificationStatus.VERIFICATION_FAILURE),
    );
    expect(await codeOf(new AppleVerifier(BUNDLE, [broken]).verifyProduct('dava_kilidi', '1'))).toBe(
      '400 purchase_invalid',
    );
  });

  it('maps auth errors to not configured', async () => {
    const e = env('production', {});
    vi.mocked(e.client.getTransactionInfo).mockRejectedValueOnce(new APIException(401));
    expect(await codeOf(new AppleVerifier(BUNDLE, [e]).verifyProduct('dava_kilidi', '1'))).toBe(
      '503 store_not_configured',
    );
  });

  it('reads the latest subscription transaction and renewal status', async () => {
    const status = {
      data: [{ lastTransactions: [{ signedTransactionInfo: 'jws', signedRenewalInfo: 'ren' }] }],
    };
    const expires = Date.parse('2026-11-20T12:00:00.000Z');
    const e = env('sandbox', {
      status,
      verified: tx({ productId: 'premium_aylik', expiresDate: expires, originalTransactionId: '1000' }),
    });
    const s = await new AppleVerifier(BUNDLE, [e]).verifySubscription('premium_aylik', '2000009');
    expect(s).toMatchObject({ originalId: '1000', latestToken: '1000', autoRenewing: true });
    expect(s.expiresAt.getTime()).toBe(expires);
  });

  it('ships the Apple root certificates', () => {
    expect(appleRootCertificates()).toHaveLength(3);
  });
});

describe('PurchaseVerifier', () => {
  const base = {
    DATABASE_URL: 'postgresql://mudafaa:mudafaa@localhost:5432/mudafaa',
    REDIS_URL: 'redis://localhost:6379',
    FIREBASE_PROJECT_ID: 'demo-mudafaa',
  };

  it('returns 503 store_not_configured when store credentials are missing', () => {
    const v = new PurchaseVerifier(loadEnv(base));
    expect(() => v.for('ANDROID')).toThrow(expect.objectContaining({ status: 503, code: 'store_not_configured' }));
    expect(() => v.for('IOS')).toThrow(expect.objectContaining({ status: 503, code: 'store_not_configured' }));
  });

  it('uses the fake verifier for both platforms in fake mode', () => {
    const v = new PurchaseVerifier(loadEnv({ ...base, PURCHASE_VERIFY_MODE: 'fake' }));
    expect(v.for('ANDROID')).toBeInstanceOf(FakeVerifier);
    expect(v.for('IOS')).toBeInstanceOf(FakeVerifier);
  });

  it('decodes a base64 or PEM .p8 key', () => {
    const pem = '-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----';
    expect(decodeP8(Buffer.from(pem).toString('base64'))).toBe(pem);
    expect(decodeP8(pem.replace(/\n/g, '\\n'))).toBe(pem);
  });
});
