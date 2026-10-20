import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  type CaseAccess,
  PRODUCT_CASE_UNLOCK,
  PRODUCT_PREMIUM,
  type PremiumPickResponse,
  type PremiumStatus,
  type PurchaseRequest,
  type PurchaseResponse,
} from '@mudafaa/case-schema';
import { ApiError, notFound } from '../../common/api-error.js';
import { isUuid } from '../../common/uuid.js';
import { ENV, type Env } from '../../config/env.js';
import { PrismaService } from '../../database/prisma.service.js';
import type { Prisma, Purchase, Subscription } from '../../generated/prisma/client.js';
import { CLOCK, type Clock } from './clock.js';
import { PurchaseVerifier } from './store/purchase-verifier.service.js';
import type { VerifiedProduct, VerifiedSubscription } from './store/verifier.js';

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
      select: { caseId: true },
    });
    const ownedIds = new Set(owned.map((e) => e.caseId));
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
  private latestSubscription(userId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({ where: { userId }, orderBy: { expiresAt: 'desc' } });
  }

  /**
   * Premium durumu. Süresi dolmuş ama otomatik yenilenen abonelik mağazaya yeniden sorulur (sunucu bildirimi
   * olmadan yenilemeyi yakalamak için; en fazla 10 dakikada bir). Mağaza hatası durumu değiştirmez.
   */
  async premium(userId: string): Promise<PremiumStatus> {
    const now = this.now();
    let sub = await this.latestSubscription(userId);
    if (
      sub !== null &&
      sub.autoRenewing &&
      sub.expiresAt.getTime() <= now.getTime() &&
      now.getTime() - sub.checkedAt.getTime() >= REFRESH_INTERVAL_MS
    ) {
      sub = await this.refresh(sub, now);
    }
    return premiumOf(sub, now);
  }

  private async refresh(sub: Subscription, now: Date): Promise<Subscription> {
    try {
      const v = await this.verifier.for(sub.platform).verifySubscription(sub.productId, sub.latestToken);
      return await this.prisma.subscription.update({
        where: { id: sub.id },
        data: { expiresAt: v.expiresAt, autoRenewing: v.autoRenewing, latestToken: v.latestToken, checkedAt: now },
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
        return this.response(userId, await this.saveProduct(userId, req, v, caseRow?.id as string));
      }
      const v = await verifier.verifySubscription(req.productId, req.token);
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
          verification: v.raw as Prisma.InputJsonValue,
        },
      });
      // Dava zaten sahipliyse (ör. premium seçimi) mevcut hak korunur; satın alma yine kayıtlıdır.
      const owned = await tx.caseEntitlement.findUnique({ where: { userId_caseId: { userId, caseId } } });
      if (owned === null) {
        await tx.caseEntitlement.create({ data: { userId, caseId, source: 'PURCHASE', purchaseId: p.id } });
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
        checkedAt: now,
      };
      if (sub === null) {
        await tx.subscription.create({ data: { userId, platform: req.platform, originalId: v.originalId, ...fields } });
      } else {
        await tx.subscription.update({ where: { id: sub.id }, data: fields });
      }
      const data = {
        userId,
        orderId: v.orderId ?? null,
        status: 'VERIFIED' as const,
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
          data: { userId, caseId: c.id, source: 'PREMIUM_PICK', subscriptionId: sub.id },
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
