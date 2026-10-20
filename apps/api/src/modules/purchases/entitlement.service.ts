import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  type CaseAccess,
  PRODUCT_CASE_UNLOCK,
  PRODUCT_PREMIUM,
  type PremiumPickResponse,
  type PremiumStatus,
  type PurchaseRequest,
  type PurchaseResponse,
  type StorePlatform,
} from '@mudafaa/case-schema';
import { ApiError, notFound } from '../../common/api-error.js';
import { isUuid } from '../../common/uuid.js';
import { ENV, type Env } from '../../config/env.js';
import { PrismaService } from '../../database/prisma.service.js';
import type { Prisma, Purchase, Subscription } from '../../generated/prisma/client.js';
import { CLOCK, type Clock } from './clock.js';
import { PurchaseVerifier } from './store/purchase-verifier.service.js';
import type { StoreEnvironment, VerifiedProduct, VerifiedSubscription } from './store/verifier.js';

// ── Ticari kurallar (docs/iap.md; koordinatörün takdiri, değiştirmek için tek yer) ──
/** Ücretsiz davalar: #01 ve #02 (`meta.number`). */
export const FREE_CASE_NUMBERS: readonly number[] = [1, 2];
/** Premium: her fatura döneminde seçilebilecek kalıcı dava sayısı (kullanılmayan hak devretmez). */
export const PREMIUM_PICKS_PER_PERIOD = 3;
/** Süresi dolmuş ama otomatik yenilenen abonelik en fazla bu aralıkla mağazaya yeniden sorulur. */
const REFRESH_INTERVAL_MS = 10 * 60_000;

export const isFreeCase = (number: number): boolean => FREE_CASE_NUMBERS.includes(number);

const NO_PREMIUM: PremiumStatus = { active: false, expiresAt: null, picksLeft: 0 };

/** Abonelik satırından premium durumu: dönem bitiş tarihi değiştiyse sayaç yeni döneme aittir. */
export function premiumOf(
  sub: Pick<Subscription, 'expiresAt' | 'picksPeriodEnd' | 'picksUsed'> | null,
  now: Date,
): PremiumStatus {
  if (sub === null) return NO_PREMIUM;
  const active = sub.expiresAt.getTime() > now.getTime();
  const samePeriod = sub.picksPeriodEnd !== null && sub.picksPeriodEnd.getTime() === sub.expiresAt.getTime();
  const used = samePeriod ? sub.picksUsed : 0;
  return {
    active,
    expiresAt: sub.expiresAt.toISOString(),
    picksLeft: active ? Math.max(0, PREMIUM_PICKS_PER_PERIOD - used) : 0,
  };
}

/**
 * Sandbox / test verisinin hak verebildiği platformlar: production dışında hepsi; production'da yalnızca
 * APPLE_ALLOW_SANDBOX (iOS) ve GOOGLE_ALLOW_TEST_PURCHASES (Android) açık olanlar. Satın alma, bildirim, yenileme
 * ve erişim hesabı aynı kapıyı kullanır.
 */
export function sandboxPlatforms(
  env: Pick<Env, 'NODE_ENV' | 'APPLE_ALLOW_SANDBOX' | 'GOOGLE_ALLOW_TEST_PURCHASES'>,
): StorePlatform[] {
  if (env.NODE_ENV !== 'production') return ['ANDROID', 'IOS'];
  return [
    ...(env.GOOGLE_ALLOW_TEST_PURCHASES ? ['ANDROID' as const] : []),
    ...(env.APPLE_ALLOW_SANDBOX ? ['IOS' as const] : []),
  ];
}

/** İade edilen dönemin başı bilinmiyorsa: geri alma anından bir fatura ayı (aylık abonelik) öncesi. */
export function refundedPeriodStart(at: Date): Date {
  const d = new Date(at);
  d.setUTCMonth(d.getUTCMonth() - 1);
  return d;
}

/** Aktif ya da yenilenecek, geri alınmamış abonelik REFRESH_INTERVAL'den eskiyse mağazaya yeniden sorulur. */
export function needsRefresh(
  sub: Pick<Subscription, 'expiresAt' | 'autoRenewing' | 'checkedAt' | 'revokedAt'>,
  now: Date,
): boolean {
  if (sub.revokedAt !== null) return false;
  const live = sub.expiresAt.getTime() > now.getTime() || sub.autoRenewing;
  return live && now.getTime() - sub.checkedAt.getTime() >= REFRESH_INTERVAL_MS;
}

/**
 * Production'da sandbox (App Store) ve test (Google Play lisans test kullanıcısı) satın almaları hak vermez;
 * APPLE_ALLOW_SANDBOX / GOOGLE_ALLOW_TEST_PURCHASES App Review ve kapalı test için geçici olarak açar.
 */
export function assertEnvironmentAllowed(
  env: Pick<Env, 'NODE_ENV' | 'APPLE_ALLOW_SANDBOX' | 'GOOGLE_ALLOW_TEST_PURCHASES'>,
  platform: StorePlatform,
  environment: StoreEnvironment,
): void {
  if (environment === 'PRODUCTION' || sandboxPlatforms(env).includes(platform)) return;
  throw new ApiError(400, 'purchase_invalid', 'Test (sandbox) satın alması bu sunucuda kabul edilmez.');
}

const tokenInUse = (): ApiError =>
  new ApiError(409, 'purchase_token_in_use', 'Bu satın alma başka bir hesaba kayıtlı.');

const isUniqueViolation = (e: unknown): boolean => (e as { code?: string }).code === 'P2002';

/**
 * Hak (entitlement) kuralları ve satın alma kaydı: ücretsiz davalar, sahiplik, premium dönemi ve seçim hakkı.
 * Bütün yazmalar transaction içindedir; aynı token yalnızca bir kez (aynı kullanıcıda idempotent) kabul edilir.
 */
@Injectable()
export class EntitlementService {
  private readonly logger = new Logger('EntitlementService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly verifier: PurchaseVerifier,
    @Inject(ENV) private readonly env: Env,
    @Inject(CLOCK) private readonly now: Clock,
  ) {}

  // ── Erişim ──
  /** Davaların erişim durumu (tek sorgu). Ücret kilidi kapalıysa (yalnızca production dışı) her dava ücretsizdir. */
  async accessMap(userId: string, cases: readonly { id: string; number: number }[]): Promise<Map<string, CaseAccess>> {
    const out = new Map<string, CaseAccess>();
    const paid = cases.filter((c) => this.env.PAYWALL_ENABLED && !isFreeCase(c.number));
    for (const c of cases) out.set(c.id, 'FREE');
    if (paid.length === 0) return out;
    const owned = await this.prisma.caseEntitlement.findMany({
      where: { userId, caseId: { in: paid.map((c) => c.id) } },
      select: {
        caseId: true,
        sandbox: true,
        purchase: { select: { platform: true } },
        subscription: { select: { platform: true } },
      },
    });
    // Sandbox / test kaynaklı hak, platformunun sandbox kapısı kapalıyken sayılmaz.
    const allowed = sandboxPlatforms(this.env);
    const counts = (e: (typeof owned)[number]): boolean => {
      if (!e.sandbox) return true;
      const platform = e.purchase?.platform ?? e.subscription?.platform;
      return platform !== undefined && allowed.includes(platform);
    };
    const ownedIds = new Set(owned.filter(counts).map((e) => e.caseId));
    for (const c of paid) out.set(c.id, ownedIds.has(c.id) ? 'OWNED' : 'PAID_LOCKED');
    return out;
  }

  private async playableCase(caseId: string): Promise<{ id: string; number: number }> {
    const c = isUuid(caseId)
      ? await this.prisma.case.findFirst({
          where: { id: caseId, currentVersionId: { not: null }, archivedAt: null },
          select: { id: true, number: true },
        })
      : null;
    if (c === null) throw notFound();
    return c;
  }

  // ── Premium ──
  /** Kullanıcının en geç biten aboneliği; sandbox kapısı kapalı platformun sandbox aboneliği sayılmaz. */
  private latestSubscription(userId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({
      where: {
        userId,
        OR: [{ environment: 'PRODUCTION' }, { environment: 'SANDBOX', platform: { in: sandboxPlatforms(this.env) } }],
      },
      orderBy: { expiresAt: 'desc' },
    });
  }

  /**
   * Premium durumu. Aktif ya da otomatik yenilenen abonelik en fazla 10 dakikada bir mağazaya yeniden sorulur:
   * bildirim kaçsa bile yenileme, iade ve iptal yakalanır. Mağaza hatası durumu değiştirmez.
   */
  async premium(userId: string): Promise<PremiumStatus> {
    const now = this.now();
    let sub = await this.latestSubscription(userId);
    if (sub !== null && needsRefresh(sub, now)) sub = await this.refresh(sub, now);
    return premiumOf(sub, now);
  }

  private async refresh(sub: Subscription, now: Date): Promise<Subscription> {
    try {
      const v = await this.verifier.for(sub.platform).verifySubscription(sub.productId, sub.latestToken);
      return await this.prisma.subscription.update({
        where: { id: sub.id },
        data: {
          // Geri alınmış abonelik mağaza ne derse desin geri alma anında biter.
          expiresAt: sub.revokedAt === null ? v.expiresAt : sub.expiresAt,
          autoRenewing: sub.revokedAt === null && v.autoRenewing,
          latestToken: v.latestToken,
          checkedAt: now,
        },
      });
    } catch (e) {
      this.logger.warn(`Abonelik yenilemesi sorgulanamadı (${sub.id}): ${(e as Error).message}`);
      return this.prisma.subscription.update({ where: { id: sub.id }, data: { checkedAt: now } });
    }
  }

  /** Davayı başlatabilir mi: ücretli ve sahip olunmayan dava → 403 `case_not_owned`. */
  assertPlayable(access: CaseAccess): void {
    if (access === 'PAID_LOCKED') {
      throw new ApiError(403, 'case_not_owned', 'Bu dava satın alınmadı. Dava kilidi ya da premium ile açılabilir.');
    }
  }

  // ── Satın alma ──
  async recordPurchase(userId: string, req: PurchaseRequest): Promise<PurchaseResponse> {
    const caseRow = req.productId === PRODUCT_CASE_UNLOCK ? await this.playableCase(req.caseId ?? '') : undefined;
    const existing = await this.prisma.purchase.findUnique({ where: { token: req.token } });
    if (existing !== null) {
      if (existing.userId !== null && existing.userId !== userId) throw tokenInUse();
      if (existing.userId === null && existing.productId !== PRODUCT_PREMIUM) throw tokenInUse();
      if (existing.productId !== req.productId || existing.platform !== req.platform) {
        throw new ApiError(400, 'purchase_invalid', 'Satın alma başka bir ürüne ait.');
      }
      // Tüketilebilir ürün: aynı token'ın tekrarı mağazaya yeniden sorulmadan aynı sonucu döner.
      if (existing.productId === PRODUCT_CASE_UNLOCK) return this.response(userId, existing);
    }
    const verifier = this.verifier.for(req.platform);
    try {
      if (req.productId === PRODUCT_CASE_UNLOCK) {
        const v = await verifier.verifyProduct(req.productId, req.token);
        assertEnvironmentAllowed(this.env, req.platform, v.environment);
        return this.response(userId, await this.saveProduct(userId, req, v, caseRow?.id as string));
      }
      const v = await verifier.verifySubscription(req.productId, req.token);
      assertEnvironmentAllowed(this.env, req.platform, v.environment);
      return this.response(userId, await this.saveSubscription(userId, req, v));
    } catch (e) {
      if (!isUniqueViolation(e)) throw e;
      // Eşzamanlı aynı token: kazanan satır okunur; başka kullanıcınınsa 409.
      const again = await this.prisma.purchase.findUnique({ where: { token: req.token } });
      if (again === null || again.userId !== userId) throw tokenInUse();
      return this.response(userId, again);
    }
  }

  private saveProduct(userId: string, req: PurchaseRequest, v: VerifiedProduct, caseId: string): Promise<Purchase> {
    return this.prisma.$transaction(async (tx) => {
      const p = await tx.purchase.create({
        data: {
          userId,
          platform: req.platform,
          productId: req.productId,
          token: req.token,
          orderId: v.orderId ?? null,
          caseId,
          environment: v.environment,
          verification: v.raw as Prisma.InputJsonValue,
        },
      });
      // Dava zaten sahipliyse (ör. premium seçimi) mevcut hak korunur; satın alma yine kayıtlıdır.
      const owned = await tx.caseEntitlement.findUnique({ where: { userId_caseId: { userId, caseId } } });
      if (owned === null) {
        await tx.caseEntitlement.create({
          data: { userId, caseId, source: 'PURCHASE', purchaseId: p.id, sandbox: v.environment === 'SANDBOX' },
        });
      }
      return p;
    });
  }

  private saveSubscription(userId: string, req: PurchaseRequest, v: VerifiedSubscription): Promise<Purchase> {
    const now = this.now();
    return this.prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.findUnique({
        where: { platform_originalId: { platform: req.platform, originalId: v.originalId } },
      });
      if (sub !== null && sub.userId !== userId) throw tokenInUse();
      const fields = {
        productId: req.productId,
        latestToken: v.latestToken,
        expiresAt: v.expiresAt,
        autoRenewing: v.autoRenewing,
        environment: v.environment,
        checkedAt: now,
      };
      if (sub === null) {
        await tx.subscription.create({ data: { userId, platform: req.platform, originalId: v.originalId, ...fields } });
      } else {
        // Geri alınmış abonelik yeniden gönderilse de geri alınmış kalır.
        const revoked = sub.revokedAt !== null;
        await tx.subscription.update({
          where: { id: sub.id },
          data: revoked ? { ...fields, expiresAt: sub.expiresAt, autoRenewing: false } : fields,
        });
      }
      const data = {
        userId,
        orderId: v.orderId ?? null,
        environment: v.environment,
        verification: v.raw as Prisma.InputJsonValue,
      };
      return tx.purchase.upsert({
        where: { token: req.token },
        create: { ...data, platform: req.platform, productId: req.productId, token: req.token },
        update: data,
      });
    });
  }

  private async response(userId: string, p: Purchase): Promise<PurchaseResponse> {
    const premium = await this.premium(userId);
    const access =
      p.caseId === null ? undefined : (await this.accessMap(userId, [await this.caseNumber(p.caseId)])).get(p.caseId);
    return {
      purchaseId: p.id,
      productId: p.productId as PurchaseResponse['productId'],
      status: p.status,
      ...(p.caseId === null ? {} : { caseId: p.caseId }),
      ...(access === undefined ? {} : { access }),
      premium,
      adFree: premium.active,
    };
  }

  private async caseNumber(caseId: string): Promise<{ id: string; number: number }> {
    return this.prisma.case.findUniqueOrThrow({ where: { id: caseId }, select: { id: true, number: true } });
  }

  // ── İade ve geri alma (mağaza bildirimleri) ──
  /**
   * Satın almayı geri alır: durum REVOKED, o satın almanın verdiği dava hakkı silinir. Abonelik satın almasıysa
   * abonelik geri alma anında biter; premium ile seçilmiş davalar kalır (docs/iap.md, bilinen ödünleşim).
   * Bilinmeyen token sessizce yok sayılır. Dönen değer: geri alınan satın alma bulundu mu.
   */
  async revokePurchase(platform: StorePlatform, token: string, at: Date): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const p = await tx.purchase.findUnique({ where: { token } });
      if (p === null || p.platform !== platform) return false;
      if (p.status !== 'REVOKED') {
        await tx.purchase.update({ where: { id: p.id }, data: { status: 'REVOKED', revokedAt: at } });
      }
      await tx.caseEntitlement.deleteMany({ where: { purchaseId: p.id } });
      return true;
    });
  }

  /**
   * Aboneliği geri alır (iade / geri alma): bitiş = geri alma anı, yenileme kapalı. İade edilen dönemde yapılan
   * premium seçimleri de geri alınır (seçim `createdAt` ≥ dönem başı; dönem başı bilinmiyorsa geri alma − 1 ay).
   * Normal süre dolumunda (updateSubscription) seçimler kalıcıdır.
   */
  async revokeSubscription(
    platform: StorePlatform,
    key: string,
    at: Date,
    periodStart: Date = refundedPeriodStart(at),
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.findFirst({
        where: { platform, OR: [{ originalId: key }, { latestToken: key }] },
      });
      if (sub === null) return false;
      await tx.caseEntitlement.deleteMany({
        where: { subscriptionId: sub.id, source: 'PREMIUM_PICK', createdAt: { gte: periodStart } },
      });
      await tx.subscription.update({
        where: { id: sub.id },
        data: {
          revokedAt: sub.revokedAt ?? at,
          expiresAt: sub.expiresAt.getTime() < at.getTime() ? sub.expiresAt : at,
          autoRenewing: false,
          checkedAt: this.now(),
        },
      });
      return true;
    });
  }

  /** Bildirimden gelen yeni bitiş tarihi (yenileme / süre dolumu). Geri alınmış abonelik değişmez. */
  async updateSubscription(
    platform: StorePlatform,
    key: string,
    fields: { expiresAt: Date; autoRenewing: boolean; latestToken?: string },
  ): Promise<boolean> {
    const r = await this.prisma.subscription.updateMany({
      where: { platform, revokedAt: null, OR: [{ originalId: key }, { latestToken: key }] },
      data: { ...fields, checkedAt: this.now() },
    });
    return r.count > 0;
  }

  /** Bildirim sonrası aboneliği mağazaya yeniden sorar (Google RTDN: bildirim yalnızca token taşır). */
  async reverifySubscription(platform: StorePlatform, productId: string, token: string): Promise<boolean> {
    const sub = await this.prisma.subscription.findFirst({
      where: { platform, OR: [{ originalId: token }, { latestToken: token }] },
    });
    if (sub === null) return false;
    if (sub.environment === 'SANDBOX' && !sandboxPlatforms(this.env).includes(platform)) return false;
    const v = await this.verifier.for(platform).verifySubscription(productId, token);
    return this.updateSubscription(platform, token, {
      expiresAt: v.expiresAt,
      autoRenewing: v.autoRenewing,
      latestToken: v.latestToken,
    });
  }

  // ── Premium seçimi ──
  /**
   * Premium ile kalıcı dava seçimi. Zaten açık dava hak harcamaz (idempotent). Sayaç tek bir koşullu UPDATE ile
   * artar (dönem değiştiyse 1'den başlar); hak yoksa 409 `no_picks_left`.
   */
  async premiumPick(userId: string, caseId: string): Promise<PremiumPickResponse> {
    const c = await this.playableCase(caseId);
    const current = (await this.accessMap(userId, [c])).get(c.id) as CaseAccess;
    if (current !== 'PAID_LOCKED') return { caseId: c.id, access: current, premium: await this.premium(userId) };
    const status = await this.premium(userId);
    if (!status.active) throw new ApiError(403, 'premium_required', 'Bu işlem için aktif premium abonelik gerekir.');
    if (status.picksLeft === 0) throw noPicksLeft();
    const sub = await this.latestSubscription(userId);
    if (sub === null) throw new ApiError(403, 'premium_required', 'Bu işlem için aktif premium abonelik gerekir.');
    try {
      await this.prisma.$transaction(async (tx) => {
        const rows = await tx.$queryRaw<{ id: string }[]>`
          UPDATE subscriptions
             SET picks_used = CASE WHEN picks_period_end = expires_at THEN picks_used + 1 ELSE 1 END,
                 picks_period_end = expires_at,
                 updated_at = now()
           WHERE id = ${sub.id}::uuid
             AND expires_at > ${this.now()}
             AND (picks_period_end IS DISTINCT FROM expires_at OR picks_used < ${PREMIUM_PICKS_PER_PERIOD})
          RETURNING id`;
        if (rows.length === 0) throw noPicksLeft();
        await tx.caseEntitlement.create({
          data: {
            userId,
            caseId: c.id,
            source: 'PREMIUM_PICK',
            subscriptionId: sub.id,
            sandbox: sub.environment === 'SANDBOX',
          },
        });
      });
    } catch (e) {
      // Aynı davaya eşzamanlı ikinci seçim: transaction geri alınır (sayaç dahil), dava zaten sahiplidir.
      if (!isUniqueViolation(e)) throw e;
    }
    return { caseId: c.id, access: 'OWNED', premium: await this.premium(userId) };
  }
}

const noPicksLeft = (): ApiError => new ApiError(409, 'no_picks_left', 'Bu dönemki premium dava seçme hakkın bitti.');
