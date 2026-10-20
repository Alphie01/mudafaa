import { describe, expect, it, vi } from 'vitest';
import { loadEnv } from '../../src/config/env.js';
import type { PrismaService } from '../../src/database/prisma.service.js';
import {
  EntitlementService,
  isFreeCase,
  PREMIUM_PICKS_PER_PERIOD,
  premiumOf,
} from '../../src/modules/purchases/entitlement.service.js';
import type { PurchaseVerifier } from '../../src/modules/purchases/store/purchase-verifier.service.js';

const NOW = new Date('2026-10-20T12:00:00.000Z');
const LATER = new Date('2026-11-20T12:00:00.000Z');
const EARLIER = new Date('2026-10-01T12:00:00.000Z');
const base = {
  DATABASE_URL: 'postgresql://mudafaa:mudafaa@localhost:5432/mudafaa',
  REDIS_URL: 'redis://localhost:6379',
  FIREBASE_PROJECT_ID: 'demo-mudafaa',
};

function service(opts: { owned?: string[]; sub?: Record<string, unknown> | null; paywall?: boolean } = {}) {
  const prisma = {
    caseEntitlement: { findMany: vi.fn(async () => (opts.owned ?? []).map((caseId) => ({ caseId }))) },
    subscription: {
      findFirst: vi.fn(async () => opts.sub ?? null),
      update: vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({ ...opts.sub, ...data })),
    },
  };
  const verifySubscription = vi.fn();
  const verifier = { for: () => ({ verifySubscription, verifyProduct: vi.fn() }) };
  const env = loadEnv({ ...base, ...(opts.paywall === false ? { PAYWALL_ENABLED: 'false' } : {}) });
  const svc = new EntitlementService(
    prisma as unknown as PrismaService,
    verifier as unknown as PurchaseVerifier,
    env,
    () => NOW,
  );
  return { svc, prisma, verifySubscription };
}

const sub = (over: Record<string, unknown> = {}) => ({
  id: 's1',
  platform: 'ANDROID',
  productId: 'premium_aylik',
  latestToken: 'tok',
  expiresAt: LATER,
  autoRenewing: true,
  picksPeriodEnd: null,
  picksUsed: 0,
  checkedAt: NOW,
  ...over,
});

describe('free case rule', () => {
  it('only cases #01 and #02 are free', () => {
    expect([0, 1, 2, 3, 7].map(isFreeCase)).toEqual([false, true, true, false, false]);
  });
});

describe('premiumOf', () => {
  it('no subscription → inactive, no picks', () => {
    expect(premiumOf(null, NOW)).toEqual({ active: false, expiresAt: null, picksLeft: 0 });
  });

  it('counts picks only within the current period (expiry window)', () => {
    expect(premiumOf(sub(), NOW)).toEqual({ active: true, expiresAt: LATER.toISOString(), picksLeft: 3 });
    expect(premiumOf(sub({ picksPeriodEnd: LATER, picksUsed: 2 }), NOW).picksLeft).toBe(1);
    expect(premiumOf(sub({ picksPeriodEnd: LATER, picksUsed: PREMIUM_PICKS_PER_PERIOD }), NOW).picksLeft).toBe(0);
    // Yenileme: bitiş tarihi ilerledi → önceki dönemin sayacı geçersiz.
    expect(premiumOf(sub({ picksPeriodEnd: EARLIER, picksUsed: 3 }), NOW).picksLeft).toBe(3);
  });

  it('expired subscription keeps expiresAt but grants nothing', () => {
    expect(premiumOf(sub({ expiresAt: EARLIER }), NOW)).toEqual({
      active: false,
      expiresAt: EARLIER.toISOString(),
      picksLeft: 0,
    });
  });
});

describe('EntitlementService.accessMap', () => {
  const cases = [
    { id: 'a', number: 1 },
    { id: 'b', number: 2 },
    { id: 'c', number: 3 },
    { id: 'd', number: 4 },
  ];

  it('free / owned / paid locked', async () => {
    const { svc, prisma } = service({ owned: ['c'] });
    const m = await svc.accessMap('u', cases);
    expect([...m.values()]).toEqual(['FREE', 'FREE', 'OWNED', 'PAID_LOCKED']);
    expect(prisma.caseEntitlement.findMany).toHaveBeenCalledWith({
      where: { userId: 'u', caseId: { in: ['c', 'd'] } },
      select: { caseId: true },
    });
  });

  it('paywall disabled (non-production only) → everything free without a query', async () => {
    const { svc, prisma } = service({ paywall: false });
    expect([...(await svc.accessMap('u', cases)).values()].every((a) => a === 'FREE')).toBe(true);
    expect(prisma.caseEntitlement.findMany).not.toHaveBeenCalled();
  });

  it('assertPlayable rejects only paid locked cases', () => {
    const { svc } = service();
    expect(() => svc.assertPlayable('PAID_LOCKED')).toThrow(
      expect.objectContaining({ status: 403, code: 'case_not_owned' }),
    );
    expect(() => svc.assertPlayable('OWNED')).not.toThrow();
    expect(() => svc.assertPlayable('FREE')).not.toThrow();
  });
});

describe('EntitlementService.premium', () => {
  it('re-verifies an expired auto-renewing subscription and picks up the renewal', async () => {
    const stale = sub({ expiresAt: EARLIER, checkedAt: EARLIER });
    const { svc, verifySubscription, prisma } = service({ sub: stale });
    verifySubscription.mockResolvedValueOnce({ expiresAt: LATER, autoRenewing: true, latestToken: 'tok' });
    expect(await svc.premium('u')).toMatchObject({ active: true, picksLeft: 3 });
    expect(verifySubscription).toHaveBeenCalledWith('premium_aylik', 'tok');
    expect(prisma.subscription.update).toHaveBeenCalled();
  });

  it('does not ask the store again within the refresh interval', async () => {
    const { svc, verifySubscription } = service({ sub: sub({ expiresAt: EARLIER, checkedAt: NOW }) });
    expect((await svc.premium('u')).active).toBe(false);
    expect(verifySubscription).not.toHaveBeenCalled();
  });

  it('a store failure during refresh keeps the subscription expired', async () => {
    const { svc, verifySubscription } = service({ sub: sub({ expiresAt: EARLIER, checkedAt: EARLIER }) });
    verifySubscription.mockRejectedValueOnce(new Error('down'));
    expect((await svc.premium('u')).active).toBe(false);
  });
});
