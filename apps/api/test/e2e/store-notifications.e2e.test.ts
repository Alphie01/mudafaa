import { randomUUID } from 'node:crypto';
import { MeResponse } from '@mudafaa/case-schema';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { AppleNotification } from '../../src/modules/purchases/store/apple.verifier.js';
import { purchaseInvalid } from '../../src/modules/purchases/store/verifier.js';
import { APPLE_NOTIFICATIONS } from '../../src/modules/purchases/store-notifications.service.js';
import { bootstrapApp, client, type Client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { miniCase } from './support/fixtures.js';

// Mağaza bildirimleri: iade/geri alma hakkı kaldırır, yenileme bitiş tarihini ilerletir. App Store imzası burada
// sahte çözücüyle atlanır (imza doğrulaması birim testlerinde); Play bildirimleri paylaşılan anahtarla gelir.
const SECRET = 'rtdn-gizli-anahtar';

/** İmzasız "signedPayload": doğrudan çözülmüş bildirimin JSON'u. */
const fakeApple = {
  decode: (signed: string): Promise<AppleNotification> => {
    try {
      return Promise.resolve(JSON.parse(signed) as AppleNotification);
    } catch {
      return Promise.reject(purchaseInvalid('Bildirim imzası doğrulanamadı.'));
    }
  },
};

describe('store notifications', () => {
  let t: TestApp;
  const paid: Published[] = [];

  beforeAll(async () => {
    t = await bootstrapApp({ PAYWALL_ENABLED: 'true', GOOGLE_RTDN_SECRET: SECRET }, [
      { token: APPLE_NOTIFICATIONS, value: fakeApple },
    ]);
    for (let i = 0; i < 2; i++) paid.push(await publishFixture(t, miniCase(), { prefix: `rtdn${i}` }));
  });
  afterAll(() => t?.close());

  const caseId = (i: number) => (paid[i] as Published).caseId;
  const user = async (): Promise<Client> => client(t.app, (await emulatorUser()).idToken);
  const access = async (c: Client, id: string) =>
    ((await c.get('/cases')).body as { items: { id: string; access: string }[] }).items.find((x) => x.id === id)
      ?.access;
  const me = async (c: Client) => MeResponse.parse((await c.get('/me')).body);
  const apple = (n: Partial<AppleNotification>) =>
    t
      .http()
      .post('/v1/store-notifications/apple')
      .send({ signedPayload: JSON.stringify({ environment: 'SANDBOX', ...n }) });
  const google = (data: unknown, secret: string | null = SECRET) =>
    t
      .http()
      .post(`/v1/store-notifications/google${secret === null ? '' : `?secret=${secret}`}`)
      .send({ message: { data: Buffer.from(JSON.stringify(data)).toString('base64'), messageId: '1' } });

  it('App Store REFUND revokes the case purchase', async () => {
    const c = await user();
    const token = `test:case:${randomUUID()}`;
    await c.post('/purchases', { platform: 'IOS', productId: 'dava_kilidi', token, caseId: caseId(0) });
    expect(await access(c, caseId(0))).toBe('OWNED');
    const ent = await t.prisma.caseEntitlement.findFirstOrThrow({ where: { caseId: caseId(0), purchase: { token } } });
    expect(ent.sandbox).toBe(true);

    const res = await apple({ type: 'REFUND', transaction: { transactionId: token, productId: 'dava_kilidi' } });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ handled: true, action: 'purchase_revoked' });
    expect(await access(c, caseId(0))).toBe('PAID_LOCKED');
    const p = await t.prisma.purchase.findUniqueOrThrow({ where: { token } });
    expect(p.status).toBe('REVOKED');
    expect(p.revokedAt).not.toBeNull();
    // Geri alınmış makbuzun yeniden gönderilmesi hakkı geri getirmez.
    const again = await c.post('/purchases', { platform: 'IOS', productId: 'dava_kilidi', token, caseId: caseId(0) });
    expect(again.body).toMatchObject({ status: 'REVOKED', access: 'PAID_LOCKED' });
  });

  it('App Store DID_RENEW extends, REVOKE ends the subscription; picked cases stay owned', async () => {
    const c = await user();
    const id = randomUUID();
    await c.post('/purchases', { platform: 'IOS', productId: 'premium_aylik', token: `test:sub:30:${id}` });
    expect((await c.post('/me/premium-picks', { caseId: caseId(1) })).status).toBe(200);
    const original = `test:sub:${id}`;
    const renewedUntil = Date.now() + 60 * 86_400_000;
    const renew = await apple({
      type: 'DID_RENEW',
      transaction: { originalTransactionId: original, productId: 'premium_aylik', expiresDate: renewedUntil },
    });
    expect(renew.body).toEqual({ handled: true, action: 'subscription_renewed' });
    expect(Date.parse((await me(c)).premium.expiresAt ?? '')).toBe(renewedUntil);

    const revoke = await apple({
      type: 'REVOKE',
      transaction: { originalTransactionId: original, productId: 'premium_aylik', revocationDate: Date.now() - 1000 },
    });
    expect(revoke.body).toEqual({ handled: true, action: 'subscription_revoked' });
    const m = await me(c);
    expect(m.premium.active).toBe(false);
    expect(m.adFree).toBe(false);
    expect(await access(c, caseId(1))).toBe('OWNED');
  });

  it('App Store: unknown types are acknowledged, bad signatures rejected', async () => {
    expect((await apple({ type: 'TEST' })).body).toEqual({ handled: false, action: 'ignored:TEST' });
    const bad = await t.http().post('/v1/store-notifications/apple').send({ signedPayload: 'not-a-jws' });
    expect(bad.status).toBe(400);
    expect(bad.body.error).toBe('purchase_invalid');
    expect((await t.http().post('/v1/store-notifications/apple').send({})).status).toBe(400);
  });

  it('Google RTDN requires the shared secret', async () => {
    const data = { packageName: 'com.monolithyazilim.mudafaa', testNotification: { version: '1.0' } };
    expect((await google(data, null)).status).toBe(401);
    expect((await google(data, 'yanlis')).status).toBe(401);
    const ok = await google(data);
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual({ handled: false, action: 'test' });
  });

  it('Google voided purchase revokes the case; SUBSCRIPTION_REVOKED ends premium', async () => {
    const c = await user();
    const token = `test:case:${randomUUID()}`;
    await c.post('/purchases', { platform: 'ANDROID', productId: 'dava_kilidi', token, caseId: caseId(0) });
    expect(await access(c, caseId(0))).toBe('OWNED');
    const voided = await google({
      packageName: 'com.monolithyazilim.mudafaa',
      eventTimeMillis: String(Date.now()),
      voidedPurchaseNotification: { purchaseToken: token, orderId: 'GPA.1', productType: 2 },
    });
    expect(voided.body).toEqual({ handled: true, action: 'voided' });
    expect(await access(c, caseId(0))).toBe('PAID_LOCKED');

    const subToken = `test:sub:30:${randomUUID()}`;
    await c.post('/purchases', { platform: 'ANDROID', productId: 'premium_aylik', token: subToken });
    expect((await me(c)).premium.active).toBe(true);
    const revoked = await google({
      packageName: 'com.monolithyazilim.mudafaa',
      subscriptionNotification: { notificationType: 12, purchaseToken: subToken, subscriptionId: 'premium_aylik' },
    });
    expect(revoked.body).toEqual({ handled: true, action: 'subscription_revoked' });
    expect((await me(c)).premium.active).toBe(false);
  });

  it('Google subscription state change re-verifies with the store', async () => {
    const c = await user();
    const id = randomUUID();
    await c.post('/purchases', { platform: 'ANDROID', productId: 'premium_aylik', token: `test:sub:-1:${id}` });
    expect((await me(c)).premium.active).toBe(false);
    // Sahte doğrulayıcıda yeni token aynı aboneliğin yenilenmiş hâlidir.
    await t.prisma.subscription.updateMany({
      where: { originalId: `test:sub:${id}` },
      data: { latestToken: `test:sub:30:${id}` },
    });
    const res = await google({
      packageName: 'com.monolithyazilim.mudafaa',
      subscriptionNotification: {
        notificationType: 2,
        purchaseToken: `test:sub:30:${id}`,
        subscriptionId: 'premium_aylik',
      },
    });
    expect(res.body).toEqual({ handled: true, action: 'subscription_reverified' });
    expect((await me(c)).premium.active).toBe(true);
  });

  it('Google RTDN for another package or a malformed body', async () => {
    expect((await google({ packageName: 'com.baska', testNotification: {} })).body.action).toBe('ignored:package');
    const bad = await t.http().post(`/v1/store-notifications/google?secret=${SECRET}`).send({ message: {} });
    expect(bad.status).toBe(400);
  });
});
