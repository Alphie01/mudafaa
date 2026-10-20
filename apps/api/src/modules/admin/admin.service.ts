import { Injectable } from '@nestjs/common';
import type { StartResponse } from '@mudafaa/case-schema';
import { ApiError, notFound } from '../../common/api-error.js';
import { isAllowedMime, sniffMime } from '../../common/asset-types.js';
import { isUuid } from '../../common/uuid.js';
import { PrismaService } from '../../database/prisma.service.js';
import type { CaseVersion } from '../../generated/prisma/client.js';
import { AuthCache } from '../auth/auth-cache.js';
import type { AuthUser } from '../auth/decorators.js';
import { AssetStore } from '../content/asset.store.js';
import { ContentService, type ActorCtx } from '../content/content.service.js';
import { ValidationQueue } from '../content-validation/validation.queue.js';
import { ValidationService } from '../content/validation.service.js';
import { GameService } from '../game/game.service.js';
import { AuditService } from './audit.service.js';

const versionDto = (v: CaseVersion) => ({
  id: v.id,
  versionNo: v.versionNo,
  status: v.status,
  source: v.source,
  title: v.title,
  legalReviewStatus: v.legalReviewStatus,
  legalReviewBy: v.legalReviewBy,
  legalReviewAt: v.legalReviewAt,
  packageHash: v.packageHash,
  publishedAt: v.publishedAt?.toISOString() ?? null,
  createdAt: v.createdAt.toISOString(),
});

/**
 * İnce yönetim API'si (M1; editör M2'de): dava ve sürüm yaşam döngüsü, doğrulama kuyruğu, yayın, test oturumları,
 * varlık yükleme, denetim kaydı ve roller. Her mutasyon denetim kaydını kendi transaction'ında yazar.
 */
@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly content: ContentService,
    private readonly validation: ValidationService,
    private readonly queue: ValidationQueue,
    private readonly audit: AuditService,
    private readonly assets: AssetStore,
    private readonly game: GameService,
    private readonly authCache: AuthCache,
  ) {}

  // ── Davalar ──

  createCase(input: { slug: string; number: number; difficulty?: number }, ctx: ActorCtx) {
    return this.content.createCase(input, ctx);
  }

  async cloneVersion(caseId: string, ctx: ActorCtx) {
    return this.content.cloneToDraft(caseId, ctx);
  }

  async listCases() {
    const rows = await this.prisma.case.findMany({
      orderBy: { number: 'asc' },
      include: { versions: { orderBy: { versionNo: 'asc' } } },
    });
    return rows.map((c) => this.caseDto(c));
  }

  async getCase(caseId: string) {
    const c = isUuid(caseId)
      ? await this.prisma.case.findUnique({
          where: { id: caseId },
          include: { versions: { orderBy: { versionNo: 'asc' } } },
        })
      : null;
    if (c === null) throw notFound('Dava bulunamadı.');
    return this.caseDto(c);
  }

  private caseDto(c: {
    id: string;
    slug: string;
    number: number;
    requiredRankKey: string | null;
    currentVersionId: string | null;
    archivedAt: Date | null;
    versions: CaseVersion[];
  }) {
    return {
      id: c.id,
      slug: c.slug,
      number: c.number,
      requiredRankKey: c.requiredRankKey,
      currentVersionId: c.currentVersionId,
      archivedAt: c.archivedAt?.toISOString() ?? null,
      versions: c.versions.map(versionDto),
    };
  }

  async updateCase(caseId: string, patch: { requiredRankKey?: string | null; archived?: boolean }, ctx: ActorCtx) {
    await this.getCase(caseId);
    if (patch.requiredRankKey !== undefined && patch.requiredRankKey !== null) {
      const rank = await this.prisma.rank.findUnique({ where: { key: patch.requiredRankKey } });
      if (rank === null) {
        throw new ApiError(400, 'validation_error', 'Bilinmeyen rütbe.', {
          errors: [{ path: 'requiredRankKey', message: `bilinmeyen rütbe: ${patch.requiredRankKey}` }],
        });
      }
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.case.update({
        where: { id: caseId },
        data: {
          ...(patch.requiredRankKey === undefined ? {} : { requiredRankKey: patch.requiredRankKey }),
          ...(patch.archived === undefined ? {} : { archivedAt: patch.archived ? new Date() : null }),
        },
      });
      await this.audit.record(tx, {
        actor: ctx.actor,
        action: patch.archived === true ? 'case.archive' : 'case.update',
        targetType: 'case',
        targetId: caseId,
        payload: patch,
        requestId: ctx.requestId,
      });
    });
    return this.getCase(caseId);
  }

  /** Gövdedeki paket: dava slug ile bulunur ya da oluşturulur; DRAFT içe aktarılır (varlıklar depoda olmalı). */
  async importPackage(body: unknown, ctx: ActorCtx) {
    const pkg = this.content.compilePackage(body); // derleme hatası → 400, dava açılmadan
    const { caseId } = await this.content.findOrCreateCase(pkg, ctx);
    const { versionId, versionNo } = await this.content.importDraft(caseId, pkg, 'IMPORT', ctx);
    return { caseId, versionId, versionNo };
  }

  async listVersions(caseId: string) {
    return (await this.getCase(caseId)).versions;
  }

  private async versionOf(caseId: string, versionId: string): Promise<CaseVersion> {
    const v = isUuid(versionId) ? await this.prisma.caseVersion.findUnique({ where: { id: versionId } }) : null;
    if (v === null || v.caseId !== caseId) throw notFound('Sürüm bulunamadı.');
    return v;
  }

  async exportVersion(caseId: string, versionId: string) {
    await this.versionOf(caseId, versionId);
    return this.content.exportVersion(versionId);
  }

  async replaceVersion(caseId: string, versionId: string, body: unknown, ctx: ActorCtx) {
    await this.versionOf(caseId, versionId);
    await this.content.replaceDraft(versionId, body, ctx);
  }

  async exportPublished(caseId: string) {
    const c = await this.getCase(caseId);
    if (c.currentVersionId === null) throw notFound('Yayınlanmış sürüm yok.');
    return this.content.exportVersion(c.currentVersionId);
  }

  // ── Doğrulama ve yayın ──

  async enqueueValidation(caseId: string, versionId: string, ctx: ActorCtx): Promise<{ validationId: string }> {
    await this.versionOf(caseId, versionId);
    const validationId = await this.prisma.$transaction(async (tx) => {
      const id = await this.validation.createRow(versionId, ctx.actor, tx);
      await this.audit.record(tx, {
        actor: ctx.actor,
        action: 'case.validate',
        targetType: 'case_version',
        targetId: versionId,
        payload: { validationId: id },
        requestId: ctx.requestId,
      });
      return id;
    });
    await this.queue.add(validationId);
    return { validationId };
  }

  async getValidation(id: string) {
    const v = isUuid(id) ? await this.prisma.contentValidationResult.findUnique({ where: { id } }) : null;
    if (v === null) throw notFound('Doğrulama bulunamadı.');
    return {
      id: v.id,
      caseVersionId: v.caseVersionId,
      status: v.status,
      strict: v.strict,
      packageHash: v.packageHash,
      report: v.report,
      createdAt: v.createdAt.toISOString(),
      startedAt: v.startedAt?.toISOString() ?? null,
      finishedAt: v.finishedAt?.toISOString() ?? null,
    };
  }

  async publish(caseId: string, versionId: string, legalReviewConfirmed: boolean, ctx: ActorCtx) {
    const r = await this.content.publish(caseId, versionId, { legalReviewConfirmed, ...ctx });
    const v = await this.prisma.caseVersion.findUniqueOrThrow({ where: { id: versionId } });
    return { ...r, versionId, legalReviewStatus: v.legalReviewStatus };
  }

  async startTestSession(caseId: string, versionId: string, user: AuthUser, requestId: string): Promise<StartResponse> {
    await this.versionOf(caseId, versionId);
    const { snapshotId } = await this.content.testSnapshot(versionId, { actor: user, requestId });
    return this.game.startTest(user, snapshotId);
  }

  // ── Varlıklar, denetim, roller ──

  async uploadAsset(bytes: Buffer, mime: string, ctx: ActorCtx) {
    if (!Buffer.isBuffer(bytes) || bytes.length === 0) {
      throw new ApiError(400, 'validation_error', 'Boş dosya yüklenemez.');
    }
    if (!isAllowedMime(mime) || sniffMime(bytes) !== mime) {
      throw new ApiError(400, 'validation_error', 'Dosya içeriği bildirilen türle uyuşmuyor.', {
        errors: [{ path: 'mime', message: `içerik ${sniffMime(bytes) ?? 'tanınmayan tür'}, bildirilen ${mime}` }],
      });
    }
    const { sha256, size } = await this.assets.put(bytes, mime);
    await this.prisma.$transaction((tx) =>
      this.audit.record(tx, {
        actor: ctx.actor,
        action: 'asset.upload',
        targetType: 'asset',
        targetId: sha256,
        payload: { mime, size },
        requestId: ctx.requestId,
      }),
    );
    return { sha256, size, mime, url: `/v1/assets/${sha256}` };
  }

  async auditLogs(limit: number) {
    const rows = await this.prisma.adminAuditLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
    return rows.map((r) => ({
      id: r.id,
      actorId: r.actorId,
      action: r.action,
      targetType: r.targetType,
      targetId: r.targetId,
      payload: r.payload,
      requestId: r.requestId,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async setRole(userId: string, role: AuthUser['role'], ctx: ActorCtx) {
    const u = isUuid(userId) ? await this.prisma.user.findUnique({ where: { id: userId } }) : null;
    if (u === null) throw notFound('Kullanıcı bulunamadı.');
    const updated = await this.prisma.$transaction(async (tx) => {
      const row = await tx.user.update({ where: { id: userId }, data: { role } });
      await this.audit.record(tx, {
        actor: ctx.actor,
        action: 'user.role',
        targetType: 'user',
        targetId: userId,
        payload: { from: u.role, to: role },
        requestId: ctx.requestId,
      });
      return row;
    });
    this.authCache.evict(u.firebaseUid);
    return { id: updated.id, role: updated.role };
  }
}
