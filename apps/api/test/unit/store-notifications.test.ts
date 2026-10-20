import { VerificationException, VerificationStatus } from '@apple/app-store-server-library';
import { describe, expect, it, vi } from 'vitest';
import { loadEnv } from '../../src/config/env.js';
import type { EntitlementService } from '../../src/modules/purchases/entitlement.service.js';
import { AppleNotificationDecoder, type AppleNotification } from '../../src/modules/purchases/store/apple.verifier.js';
import { StoreNotificationsService } from '../../src/modules/purchases/store-notifications.service.js';

const NOW = new Date('2026-10-20T12:00:00.000Z');
const base = {
  DATABASE_URL: 'postgresql://mudafaa:mudafaa@localhost:5432/mudafaa',
  REDIS_URL: 'redis://localhost:6379',
  FIREBASE_PROJECT_ID: 'demo-mudafaa',
};

function service(notification?: Partial<AppleNotification>, env: Record<string, string> = {}) {
  const entitlements = {
    revokePurchase: vi.fn(async () => true),
    revokeSubscription: vi.fn(async () => true),
    updateSubscription: vi.fn(async () => true),
    reverifySubscription: vi.fn(async () => true),
  };
  const decoder = {
    decode: vi.fn(async () => ({ type: 'TEST', subtype: undefined, environment: 'SANDBOX', ...notification })),
  };
  const svc = new StoreNotificationsService(
    entitlements as unknown as EntitlementService,
    decoder as never,
    loadEnv({ ...base, ...env }),
    () => NOW,
  );
  return { svc, entitlements };
}

describe('App Store notifications', () => {
  it('REFUND of a consumable revokes the purchase by transactionId', async () => {
    const { svc, entitlements } = service({
      type: 'REFUND',
      transaction: { transactionId: '2001', productId: 'dava_kilidi', revocationDate: NOW.getTime() - 5000 },
    });
    expect(await svc.handleApple('jws')).toEqual({ handled: true, action: 'purchase_revoked' });
    expect(entitlements.revokePurchase).toHaveBeenCalledWith('IOS', '2001', new Date(NOW.getTime() - 5000));
  });

  it('REVOKE of the subscription ends it by originalTransactionId', async () => {
    const { svc, entitlements } = service({
      type: 'REVOKE',
      transaction: { transactionId: '3002', originalTransactionId: '3000', productId: 'premium_aylik' },
    });
    expect((await svc.handleApple('jws')).action).toBe('subscription_revoked');
    expect(entitlements.revokeSubscription).toHaveBeenCalledWith('IOS', '3000', NOW);
    expect(entitlements.revokePurchase).toHaveBeenCalledWith('IOS', '3002', NOW);
  });

  it('DID_RENEW and EXPIRED update the expiry', async () => {
    const tx = { originalTransactionId: '3000', productId: 'premium_aylik', expiresDate: NOW.getTime() + 1000 };
    const renew = service({ type: 'DID_RENEW', transaction: tx });
    expect((await renew.svc.handleApple('jws')).action).toBe('subscription_renewed');
    expect(renew.entitlements.updateSubscription).toHaveBeenCalledWith('IOS', '3000', {
      expiresAt: new Date(NOW.getTime() + 1000),
      autoRenewing: true,
    });
    const expired = service({ type: 'EXPIRED', transaction: tx });
    expect((await expired.svc.handleApple('jws')).action).toBe('subscription_expired');
    expect(expired.entitlements.updateSubscription).toHaveBeenCalledWith('IOS', '3000', {
      expiresAt: new Date(NOW.getTime() + 1000),
      autoRenewing: false,
    });
  });

  it('other notification types are acknowledged without changes', async () => {
    const { svc, entitlements } = service({ type: 'CONSUMPTION_REQUEST', transaction: { productId: 'dava_kilidi' } });
    expect(await svc.handleApple('jws')).toEqual({ handled: false, action: 'ignored:CONSUMPTION_REQUEST' });
    expect(entitlements.revokePurchase).not.toHaveBeenCalled();
  });
});

describe('AppleNotificationDecoder', () => {
  const verifier = (fail: boolean) => ({
    verifyAndDecodeNotification: vi.fn(() =>
      fail
        ? Promise.reject(new VerificationException(VerificationStatus.INVALID_ENVIRONMENT))
        : Promise.resolve({ notificationType: 'REFUND', data: { signedTransactionInfo: 'tx' } } as never),
    ),
    verifyAndDecodeTransaction: vi.fn(() => Promise.resolve({ transactionId: '1' } as never)),
    verifyAndDecodeRenewalInfo: vi.fn(),
  });

  it('tries production then sandbox and decodes the transaction', async () => {
    const d = new AppleNotificationDecoder([
      { environment: 'PRODUCTION', verifier: verifier(true) },
      { environment: 'SANDBOX', verifier: verifier(false) },
    ]);
    expect(await d.decode('payload')).toMatchObject({
      type: 'REFUND',
      environment: 'SANDBOX',
      transaction: { transactionId: '1' },
    });
  });

  it('rejects a payload no environment can verify', async () => {
    const d = new AppleNotificationDecoder([{ environment: 'SANDBOX', verifier: verifier(true) }]);
    await expect(d.decode('payload')).rejects.toMatchObject({ status: 400, code: 'purchase_invalid' });
  });
});

describe('Google Play RTDN', () => {
  const push = (data: unknown) => ({ message: { data: Buffer.from(JSON.stringify(data)).toString('base64') } });

  it('requires GOOGLE_RTDN_SECRET and compares it exactly', () => {
    expect(() => service().svc.assertGoogleSecret('x')).toThrow(
      expect.objectContaining({ status: 503, code: 'store_not_configured' }),
    );
    const { svc } = service(undefined, { GOOGLE_RTDN_SECRET: 'gizli' });
    expect(() => svc.assertGoogleSecret('gizli')).not.toThrow();
    for (const bad of [undefined, '', 'gizl', 'gizli2']) {
      expect(() => svc.assertGoogleSecret(bad)).toThrow(expect.objectContaining({ status: 401 }));
    }
  });

  it('decodes the Pub/Sub message and rejects garbage', () => {
    const n = StoreNotificationsService.decodeGoogle(
      push({ packageName: 'p', eventTimeMillis: '1760961600000', testNotification: { version: '1.0' } }),
    );
    expect(n).toMatchObject({ packageName: 'p', eventTimeMillis: 1760961600000 });
    expect(() => StoreNotificationsService.decodeGoogle({ message: { data: '!!!' } })).toThrow(
      expect.objectContaining({ code: 'purchase_invalid' }),
    );
    expect(() => StoreNotificationsService.decodeGoogle(push({ nope: 1 }))).toThrow(
      expect.objectContaining({ code: 'purchase_invalid' }),
    );
  });

  it('voided purchases revoke the purchase (and the subscription for productType 1)', async () => {
    const { svc, entitlements } = service();
    const at = new Date(NOW.getTime() - 60_000);
    await svc.handleGoogle({
      packageName: 'com.monolithyazilim.mudafaa',
      eventTimeMillis: at.getTime(),
      voidedPurchaseNotification: { purchaseToken: 'tok', productType: 1 },
    });
    expect(entitlements.revokePurchase).toHaveBeenCalledWith('ANDROID', 'tok', at);
    expect(entitlements.revokeSubscription).toHaveBeenCalledWith('ANDROID', 'tok', at);
  });

  it('SUBSCRIPTION_REVOKED revokes; other subscription events re-verify', async () => {
    const { svc, entitlements } = service();
    const n = (type: number) => ({
      packageName: 'com.monolithyazilim.mudafaa',
      subscriptionNotification: { notificationType: type, purchaseToken: 'tok', subscriptionId: 'premium_aylik' },
    });
    expect((await svc.handleGoogle(n(12))).action).toBe('subscription_revoked');
    expect(entitlements.revokeSubscription).toHaveBeenCalledWith('ANDROID', 'tok', NOW);
    expect((await svc.handleGoogle(n(2))).action).toBe('subscription_reverified');
    expect(entitlements.reverifySubscription).toHaveBeenCalledWith('ANDROID', 'premium_aylik', 'tok');
  });

  it('ignores other packages', async () => {
    const { svc, entitlements } = service();
    expect(
      (await svc.handleGoogle({ packageName: 'com.baska', voidedPurchaseNotification: { purchaseToken: 't' } })).action,
    ).toBe('ignored:package');
    expect(entitlements.revokePurchase).not.toHaveBeenCalled();
  });
});
