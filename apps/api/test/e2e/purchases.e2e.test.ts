import { randomUUID } from 'node:crypto';
import { MeResponse, PremiumPickResponse, PurchaseResponse } from '@mudafaa/case-schema';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bootstrapApp, client, type Client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { testEnv } from './support/env.js';
import { miniCase } from './support/fixtures.js';
import { startCase } from './support/play.js';

// Uygulama içi satın alma (docs/iap.md): ücret kilidi açık, sahte doğrulayıcı (`test:` token'ları).
describe('purchases', () => {
  let t: TestApp;
  let free: string;
  const paid: Published[] = [];

  /** Ücretsiz dava: #01 ya da #02 (paylaşılan test DB'sinde varsa o kullanılır, yoksa mini-case o numarayla açılır). */
  async function freeCase(): Promise<string> {
    for (const number of [1, 2]) {
      const c = await t.prisma.case.findUnique({ where: { number } });
      if (c === null) return (await publishFixture(t, miniCase(), { prefix: 'iap-free', number })).caseId;
      if (c.currentVersionId !== null && c.archivedAt === null && c.requiredRankKey === null) return c.id;
    }
    throw new Error('#01 ve #02 oynanabilir değil');
  }

  const user = async (): Promise<Client> => client(t.app, (await emulatorUser()).idToken);
  const card = async (c: Client, caseId: string) =>
    ((await c.get('/cases')).body as { items: { id: string; access: string }[] }).items.find((x) => x.id === caseId);
  const buyCase = (c: Client, caseId: string, token = `test:case:${randomUUID()}`) =>
    c.post('/purchases', { platform: 'ANDROID', productId: 'dava_kilidi', token, caseId });
  const subscribe = (c: Client, token: string, platform = 'IOS') =>
    c.post('/purchases', { platform, productId: 'premium_aylik', token });
  const me = async (c: Client) => MeResponse.parse((await c.get('/me')).body);

  beforeAll(async () => {
    t = await bootstrapApp({ PAYWALL_ENABLED: 'true' });
    free = await freeCase();
    for (let i = 0; i < 5; i++) paid.push(await publishFixture(t, miniCase(), { prefix: `iap-paid${i}` }));
  });
  afterAll(() => t?.close());

  const paidId = (i: number): string => (paid[i] as Published).caseId;

  it('free case (#01/#02) starts without a purchase', async () => {
    const c = await user();
    expect((await card(c, free))?.access).toBe('FREE');
    expect((await startCase(c, free)).status).toBe(201);
  });

  it('paid case is locked: access PAID_LOCKED and start → 403 case_not_owned', async () => {
    const c = await user();
    expect((await card(c, paidId(0)))?.access).toBe('PAID_LOCKED');
    const res = await c.post(`/cases/${paidId(0)}/start`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('case_not_owned');
  });

  it('fake purchase unlocks the case; the same token again is idempotent', async () => {
    const c = await user();
    const token = `test:case:${randomUUID()}`;
    const first = await buyCase(c, paidId(0), token);
    expect(first.status).toBe(200);
    const body = PurchaseResponse.parse(first.body);
    expect(body).toMatchObject({ productId: 'dava_kilidi', status: 'VERIFIED', caseId: paidId(0), access: 'OWNED' });
    expect((await card(c, paidId(0)))?.access).toBe('OWNED');
    expect((await startCase(c, paidId(0))).status).toBe(201);

    const again = await buyCase(c, paidId(0), token);
    expect(again.status).toBe(200);
    expect(again.body.purchaseId).toBe(body.purchaseId);
    expect(await t.prisma.purchase.count({ where: { token } })).toBe(1);
    const p = await t.prisma.purchase.findUniqueOrThrow({ where: { token } });
    expect(await t.prisma.caseEntitlement.count({ where: { userId: p.userId ?? '' } })).toBe(1);
  });

  it('a token already used by another user → 409 purchase_token_in_use', async () => {
    const token = `test:case:${randomUUID()}`;
    expect((await buyCase(await user(), paidId(1), token)).status).toBe(200);
    const thief = await user();
    const res = await buyCase(thief, paidId(1), token);
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('purchase_token_in_use');
    expect((await card(thief, paidId(1)))?.access).toBe('PAID_LOCKED');

    const subToken = `test:sub:30:${randomUUID()}`;
    expect((await subscribe(await user(), subToken)).status).toBe(200);
    expect((await subscribe(thief, subToken)).status).toBe(409);
  });

  it('rejects invalid requests and receipts', async () => {
    const c = await user();
    const noCase = await c.post('/purchases', { platform: 'ANDROID', productId: 'dava_kilidi', token: 'test:x' });
    expect(noCase.status).toBe(400);
    expect(noCase.body.error).toBe('validation_error');
    const real = await buyCase(c, paidId(0), 'GPA.0000-not-a-test-token');
    expect(real.status).toBe(400);
    expect(real.body.error).toBe('purchase_invalid');
    expect((await buyCase(c, randomUUID())).status).toBe(404);
  });

  it('premium: adFree, 3 picks per billing period, renewal resets the counter', async () => {
    const c = await user();
    const before = await me(c);
    expect(before.premium).toEqual({ active: false, expiresAt: null, picksLeft: 0 });
    expect(before.adFree).toBe(false);
    const denied = await c.post('/me/premium-picks', { caseId: paidId(0) });
    expect(denied.status).toBe(403);
    expect(denied.body.error).toBe('premium_required');

    const id = randomUUID();
    const sub = await subscribe(c, `test:sub:30:${id}`);
    expect(sub.status).toBe(200);
    expect(PurchaseResponse.parse(sub.body)).toMatchObject({ adFree: true, premium: { active: true, picksLeft: 3 } });
    expect(await me(c)).toMatchObject({ adFree: true, premium: { active: true, picksLeft: 3 } });

    for (let i = 0; i < 3; i++) {
      const res = await c.post('/me/premium-picks', { caseId: paidId(i) });
      expect(res.status).toBe(200);
      expect(PremiumPickResponse.parse(res.body)).toMatchObject({ access: 'OWNED', premium: { picksLeft: 2 - i } });
    }
    // Zaten sahip olunan dava hak harcamaz.
    const owned = await c.post('/me/premium-picks', { caseId: paidId(0) });
    expect(owned.status).toBe(200);
    expect(owned.body.premium.picksLeft).toBe(0);
    const over = await c.post('/me/premium-picks', { caseId: paidId(3) });
    expect(over.status).toBe(409);
    expect(over.body.error).toBe('no_picks_left');
    expect((await card(c, paidId(3)))?.access).toBe('PAID_LOCKED');
    expect((await startCase(c, paidId(2))).status).toBe(201);

    // Yenileme (aynı abonelik, yeni bitiş tarihi) → yeni dönem, 3 hak.
    const renewed = await subscribe(c, `test:sub:60:${id}`);
    expect(renewed.body.premium.picksLeft).toBe(3);
    expect((await c.post('/me/premium-picks', { caseId: paidId(3) })).status).toBe(200);
    expect(await t.prisma.subscription.count({ where: { originalId: `test:sub:${id}` } })).toBe(1);
  });

  it('expired subscription: no adFree, no picks; picked cases stay owned', async () => {
    const c = await user();
    const id = randomUUID();
    await subscribe(c, `test:sub:30:${id}`, 'ANDROID');
    expect((await c.post('/me/premium-picks', { caseId: paidId(4) })).status).toBe(200);
    await subscribe(c, `test:sub:-1:${id}`, 'ANDROID');
    const m = await me(c);
    expect(m.adFree).toBe(false);
    expect(m.premium).toMatchObject({ active: false, picksLeft: 0 });
    expect((await c.post('/me/premium-picks', { caseId: paidId(3) })).body.error).toBe('premium_required');
    expect((await card(c, paidId(4)))?.access).toBe('OWNED');
  });

  it('store mode without credentials → 503 store_not_configured, nothing granted', async () => {
    const store = await bootstrapApp({ PAYWALL_ENABLED: 'true', PURCHASE_VERIFY_MODE: 'store' });
    try {
      const c = client(store.app, (await emulatorUser()).idToken);
      for (const platform of ['ANDROID', 'IOS']) {
        const res = await c.post('/purchases', { platform, productId: 'dava_kilidi', token: 'tok', caseId: paidId(0) });
        expect(res.status).toBe(503);
        expect(res.body.error).toBe('store_not_configured');
      }
      expect(await store.prisma.purchase.count({ where: { token: 'tok' } })).toBe(0);
    } finally {
      await store.close();
    }
  });

  it('fake verification mode is rejected in production', () => {
    expect(() =>
      testEnv({ NODE_ENV: 'production', PURCHASE_VERIFY_MODE: 'fake', FIREBASE_AUTH_EMULATOR_HOST: undefined }),
    ).toThrow(/PURCHASE_VERIFY_MODE/);
  });
});
