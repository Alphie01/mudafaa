import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Inject, Injectable } from '@nestjs/common';
import type { CasePackage } from '@mudafaa/case-schema';
import { compile, ENGINE_VERSION } from '@mudafaa/engine';
import { loadCase } from '@mudafaa/validator';
import { ApiError, notFound } from '../../common/api-error.js';
import { isUuid } from '../../common/uuid.js';
import { ENV, type Env } from '../../config/env.js';
import { PrismaService } from '../../database/prisma.service.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { AuditService } from '../admin/audit.service.js';
import type { AuthUser } from '../auth/decorators.js';
import { AssetStore } from './asset.store.js';
import {
  contentHash,
  exportPackage,
  importPackage,
  mimeOf,
  packageHash,
  versionMeta,
  type AssetInfo,
  type Tx,
} from './mapper/index.js';
import { ValidationService } from './validation.service.js';

/** Mutasyonun kimin adına ve hangi istekte yapıldığı (denetim kaydı için). CLI'da `actor` yoktur. */
export interface ActorCtx {
  actor?: AuthUser | null;
  requestId?: string;
}

/** Varlık baytlarını paket dizininden okuyan geri çağrı (dosya yoksa null). */
export type FileReader = (path: string) => Promise<Buffer | null>;

const json = (v: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue;
const today = (): string => new Date().toISOString().slice(0, 10);

/** `case:import` sonucunun özeti. */
export interface ImportResult {
  caseId: string;
  versionId: string;
  versionNo: number;
  validationId: string;
  validation: 'PASSED' | 'FAILED' | 'ERROR';
  issues: { severity: string; code: string; path: string; message: string }[];
  snapshotId?: string;
}

/**
 * İçerik hattı (docs/plan.md §8): dava ve sürüm yaşam döngüsü. İçerik ilişkisel tablolarda düzenlenir (DRAFT),
 * doğrulanır ve yayında değişmez bir PUBLISH_SNAPSHOT'a dondurulur; oturumlar bu snapshot'lara sabitlenir.
 * - Yalnızca DRAFT sürüm değiştirilebilir (`assertDraft` → 409 `version_not_draft`).
 * - Yayın, sürümün güncel içerik hash'ini taşıyan PASSED bir doğrulama ister (`validation_required`).
 * - Üretimde hukuki onay olmadan yayın yapılmaz (`legal_review_required`).
 */
@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assets: AssetStore,
    private readonly audit: AuditService,
    private readonly validation: ValidationService,
    @Inject(ENV) private readonly env: Env,
  ) {}

  // ── Dava ──

  async createCase(input: { slug: string; number: number; difficulty?: number }, ctx: ActorCtx = {}) {
    const clash = await this.prisma.case.findFirst({
      where: { OR: [{ slug: input.slug }, { number: input.number }] },
    });
    if (clash !== null) {
      throw new ApiError(400, 'validation_error', 'Bu slug ya da dava numarası kullanımda.', {
        errors: [{ path: clash.slug === input.slug ? 'slug' : 'number', message: 'kullanımda' }],
      });
    }
    return this.prisma.$transaction(async (tx) => {
      const c = await tx.case.create({
        data: { slug: input.slug, number: input.number, difficultyLevel: input.difficulty ?? 1 },
      });
      await this.audit.record(tx, {
        actor: ctx.actor,
        action: 'case.create',
        targetType: 'case',
        targetId: c.id,
        payload: { slug: input.slug, number: input.number },
        requestId: ctx.requestId,
      });
      return { caseId: c.id };
    });
  }

  /** Paketin slug'ıyla davayı bulur ya da (slug + numara ile) oluşturur. */
  async findOrCreateCase(pkg: CasePackage, ctx: ActorCtx = {}): Promise<{ caseId: string; created: boolean }> {
    const existing = await this.prisma.case.findUnique({ where: { slug: pkg.meta.slug } });
    if (existing !== null) return { caseId: existing.id, created: false };
    const { caseId } = await this.createCase(
      { slug: pkg.meta.slug, number: pkg.meta.number, difficulty: pkg.meta.difficulty },
      ctx,
    );
    return { caseId, created: true };
  }

  // ── Sürüm ──

  /** Paket derlenir (şema, kimlik, referans); hata → 400 `validation_error`, `errors` = derleme sorunları. */
  private compileOrThrow(input: unknown): CasePackage {
    const r = compile(input);
    if (!r.ok) {
      throw new ApiError(400, 'validation_error', 'Dava paketi derlenemedi.', {
        errors: r.issues.slice(0, 100).map((i) => ({ path: i.path, message: `${i.code}: ${i.message}` })),
      });
    }
    return JSON.parse(JSON.stringify(r.c.pkg)) as CasePackage;
  }

  /**
   * Varlıkları çözer: `files` verilmişse her `assets[].path` okunup depoya konur ve `sha256` doldurulur; verilmemişse
   * `sha256` zorunludur ve depoda bulunmalıdır. Dönen bilgi `assets` satırlarının tür/boyut kolonlarıdır.
   */
  private async resolveAssets(pkg: CasePackage, files?: FileReader): Promise<AssetInfo> {
    const info: AssetInfo = {};
    const errors: { path: string; message: string }[] = [];
    for (const [i, a] of pkg.assets.entries()) {
      if (files !== undefined) {
        const bytes = await files(a.path);
        if (bytes === null) {
          errors.push({ path: `assets[${i}].path`, message: `dosya bulunamadı: ${a.path}` });
          continue;
        }
        const mime = mimeOf(a.path);
        const { sha256, size } = await this.assets.put(bytes, mime);
        a.sha256 = sha256;
        info[a.id] = { mime, size };
        continue;
      }
      if (a.sha256 === undefined) {
        errors.push({ path: `assets[${i}].sha256`, message: 'sha256 gerekli (önce varlığı yükleyin)' });
        continue;
      }
      const st = await this.assets.stat(a.sha256);
      if (st === null) {
        errors.push({ path: `assets[${i}].sha256`, message: `depoda yok: ${a.sha256}` });
        continue;
      }
      info[a.id] = { mime: st.mime ?? mimeOf(a.path), size: st.size };
    }
    if (errors.length > 0) throw new ApiError(400, 'validation_error', 'Varlıklar çözülemedi.', { errors });
    return info;
  }

  private async lockCase(tx: Tx, caseId: string): Promise<void> {
    if (!isUuid(caseId)) throw notFound('Dava bulunamadı.');
    const rows = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM cases WHERE id = ${caseId}::uuid FOR UPDATE`;
    if (rows.length === 0) throw notFound('Dava bulunamadı.');
  }

  /** Sürümü kilitler; DRAFT değilse 409 `version_not_draft`. Yazımlar bundan geçer. */
  async assertDraft(tx: Tx, versionId: string) {
    if (!isUuid(versionId)) throw notFound('Sürüm bulunamadı.');
    await tx.$queryRaw`SELECT id FROM case_versions WHERE id = ${versionId}::uuid FOR UPDATE`;
    const v = await tx.caseVersion.findUnique({ where: { id: versionId } });
    if (v === null) throw notFound('Sürüm bulunamadı.');
    if (v.status !== 'DRAFT') throw new ApiError(409, 'version_not_draft', 'Yalnızca taslak sürüm değiştirilebilir.');
    return v;
  }

  /** Yeni DRAFT sürüm: satırlar + IMPORT snapshot'ı, tek transaction'da. */
  private async createDraft(
    caseId: string,
    pkg: CasePackage,
    info: AssetInfo,
    source: 'IMPORT' | 'CLONE',
    ctx: ActorCtx,
  ): Promise<{ versionId: string; versionNo: number }> {
    return this.prisma.$transaction(
      async (tx) => {
        await this.lockCase(tx, caseId);
        const last = await tx.caseVersion.findFirst({ where: { caseId }, orderBy: { versionNo: 'desc' } });
        const versionNo = (last?.versionNo ?? 0) + 1;
        const v = await tx.caseVersion.create({
          data: { caseId, versionNo, status: 'DRAFT', source, ...versionMeta(pkg) },
        });
        await importPackage(tx, v.id, pkg, info);
        await tx.contentVersion.create({
          data: {
            caseVersionId: v.id,
            kind: 'IMPORT',
            package: json(pkg),
            packageHash: packageHash(pkg),
            engineVersion: ENGINE_VERSION,
            createdById: ctx.actor?.id ?? null,
          },
        });
        await this.audit.record(tx, {
          actor: ctx.actor,
          action: source === 'CLONE' ? 'case.version.clone' : 'case.import',
          targetType: 'case_version',
          targetId: v.id,
          payload: { caseId, versionNo, packageHash: packageHash(pkg) },
          requestId: ctx.requestId,
        });
        return { versionId: v.id, versionNo };
      },
      { timeout: 60_000 },
    );
  }

  /** Paketi yeni bir DRAFT sürüm olarak içe aktarır (derleme → varlıklar → satırlar + IMPORT snapshot'ı). */
  async importDraft(
    caseId: string,
    input: unknown,
    source: 'IMPORT' | 'CLONE' = 'IMPORT',
    ctx: ActorCtx = {},
    files?: FileReader,
  ): Promise<{ versionId: string; versionNo: number }> {
    const pkg = this.compileOrThrow(input);
    const info = await this.resolveAssets(pkg, files);
    return this.createDraft(caseId, pkg, info, source, ctx);
  }

  /** DRAFT sürümün içeriğini bütünüyle değiştirir (varlıklar depoda olmalı). */
  async replaceDraft(versionId: string, input: unknown, ctx: ActorCtx = {}): Promise<void> {
    const pkg = this.compileOrThrow(input);
    const info = await this.resolveAssets(pkg);
    await this.prisma.$transaction(
      async (tx) => {
        await this.assertDraft(tx, versionId);
        await importPackage(tx, versionId, pkg, info);
        await this.audit.record(tx, {
          actor: ctx.actor,
          action: 'case.version.replace',
          targetType: 'case_version',
          targetId: versionId,
          payload: { packageHash: packageHash(pkg) },
          requestId: ctx.requestId,
        });
      },
      { timeout: 60_000 },
    );
  }

  /** Sürümün satırlarından paket (yoksa 404). */
  async exportVersion(versionId: string): Promise<CasePackage> {
    if (!isUuid(versionId)) throw notFound('Sürüm bulunamadı.');
    const v = await this.prisma.caseVersion.findUnique({ where: { id: versionId } });
    if (v === null) throw notFound('Sürüm bulunamadı.');
    return this.prisma.$transaction((tx) => exportPackage(tx, versionId), { timeout: 30_000 });
  }

  /** Yayındaki (yoksa en son) sürümden bağımsız bir DRAFT kopya açar. */
  async cloneToDraft(caseId: string, ctx: ActorCtx = {}): Promise<{ versionId: string; versionNo: number }> {
    if (!isUuid(caseId)) throw notFound('Dava bulunamadı.');
    const c = await this.prisma.case.findUnique({ where: { id: caseId } });
    if (c === null) throw notFound('Dava bulunamadı.');
    const sourceId =
      c.currentVersionId ??
      (await this.prisma.caseVersion.findFirst({ where: { caseId }, orderBy: { versionNo: 'desc' } }))?.id;
    if (sourceId === undefined) throw notFound('Kopyalanacak sürüm yok.');
    const pkg = await this.exportVersion(sourceId);
    const info = await this.resolveAssets(pkg);
    return this.createDraft(caseId, pkg, info, 'CLONE', ctx);
  }

  // ── Yayın ──

  /**
   * DRAFT sürümü yayınlar (tek transaction, ReadCommitted): dava satırı kilitlenir; içerik hash'i son PASSED doğrulamayla
   * eşleşmeli; hukuki inceleme kuralı uygulanır; PUBLISH_SNAPSHOT yazılır; önceki yayın SUPERSEDED olur.
   */
  async publish(
    caseId: string,
    versionId: string,
    opts: { legalReviewConfirmed: boolean; reviewer?: string } & ActorCtx,
  ): Promise<{ snapshotId: string; versionNo: number }> {
    return this.prisma.$transaction(
      async (tx) => {
        await this.lockCase(tx, caseId);
        const v = isUuid(versionId) ? await tx.caseVersion.findUnique({ where: { id: versionId } }) : null;
        if (v === null || v.caseId !== caseId) throw notFound('Sürüm bulunamadı.');
        if (v.status !== 'DRAFT') throw new ApiError(409, 'version_not_draft', 'Yalnızca taslak sürüm yayınlanabilir.');
        const pkg = await exportPackage(tx, versionId);
        const passed = await tx.contentValidationResult.findFirst({
          where: { caseVersionId: versionId, status: 'PASSED' },
          orderBy: { createdAt: 'desc' },
        });
        if (passed === null || passed.packageHash !== contentHash(pkg)) {
          throw new ApiError(409, 'validation_required', 'Yayından önce sürümün güncel içeriği doğrulanmalı.');
        }
        let legal = { status: v.legalReviewStatus, by: v.legalReviewBy, at: v.legalReviewAt };
        if (opts.legalReviewConfirmed) {
          legal = { status: 'APPROVED', by: opts.reviewer ?? opts.actor?.email ?? 'cli', at: today() };
        } else if (this.env.NODE_ENV === 'production' && v.legalReviewStatus !== 'APPROVED') {
          throw new ApiError(409, 'legal_review_required', 'Üretimde yayın için hukuki inceleme onayı gerekir.');
        }
        pkg.meta.legalReview = {
          status: legal.status,
          ...(legal.by === null ? {} : { by: legal.by }),
          ...(legal.at === null ? {} : { at: legal.at }),
        };
        const analysis = (passed.report as { analysis?: unknown } | null)?.analysis;
        await tx.caseVersion.update({
          where: { id: versionId },
          data: {
            status: 'PUBLISHED',
            legalReviewStatus: legal.status,
            legalReviewBy: legal.by,
            legalReviewAt: legal.at,
            ...(analysis === undefined ? {} : { analysis: json(analysis) }),
            packageHash: packageHash(pkg),
            publishedAt: new Date(),
            publishedById: opts.actor?.id ?? null,
          },
        });
        await tx.caseVersion.updateMany({
          where: { caseId, status: 'PUBLISHED', id: { not: versionId } },
          data: { status: 'SUPERSEDED' },
        });
        const snap = await tx.contentVersion.create({
          data: {
            caseVersionId: versionId,
            kind: 'PUBLISH_SNAPSHOT',
            package: json(pkg),
            packageHash: packageHash(pkg),
            engineVersion: ENGINE_VERSION,
            createdById: opts.actor?.id ?? null,
          },
        });
        await tx.case.update({
          where: { id: caseId },
          data: {
            currentVersionId: versionId,
            difficultyLevel: pkg.meta.difficulty,
            requiredRankKey: pkg.meta.requiredRank ?? null,
          },
        });
        await this.audit.record(tx, {
          actor: opts.actor,
          action: 'case.publish',
          targetType: 'case_version',
          targetId: versionId,
          payload: { caseId, versionNo: v.versionNo, snapshotId: snap.id, legalReview: legal.status },
          requestId: opts.requestId,
        });
        return { snapshotId: snap.id, versionNo: v.versionNo };
      },
      { isolationLevel: 'ReadCommitted', timeout: 30_000 },
    );
  }

  /** Herhangi bir sürümden (taslak dahil) TEST_SNAPSHOT: yönetici test oturumları buna sabitlenir. */
  async testSnapshot(versionId: string, ctx: ActorCtx = {}): Promise<{ snapshotId: string; caseId: string }> {
    const pkg = this.compileOrThrow(await this.exportVersion(versionId));
    return this.prisma.$transaction(async (tx) => {
      const v = await tx.caseVersion.findUniqueOrThrow({ where: { id: versionId } });
      const snap = await tx.contentVersion.create({
        data: {
          caseVersionId: versionId,
          kind: 'TEST_SNAPSHOT',
          package: json(pkg),
          packageHash: packageHash(pkg),
          engineVersion: ENGINE_VERSION,
          createdById: ctx.actor?.id ?? null,
        },
      });
      await this.audit.record(tx, {
        actor: ctx.actor,
        action: 'case.test_snapshot',
        targetType: 'case_version',
        targetId: versionId,
        payload: { snapshotId: snap.id },
        requestId: ctx.requestId,
      });
      return { snapshotId: snap.id, caseId: v.caseId };
    });
  }

  // ── Dosyadan içe aktarma (CLI, seed) ──

  /**
   * `case:import`: dava dizini (ya da tek JSON dosyası) yüklenir; dava yoksa oluşturulur; DRAFT içe aktarılır ve
   * doğrulanır. `publish` verilmişse ve doğrulama geçtiyse yayınlanır. Doğrulama geçmezse yayın yapılmaz.
   */
  async importDir(
    path: string,
    opts: { publish?: boolean; legalApproved?: boolean; reviewer?: string } = {},
  ): Promise<ImportResult> {
    const raw = await loadCase(path);
    const pkg = this.compileOrThrow(raw);
    const dir = (await stat(path)).isDirectory() ? path : dirname(path);
    const files: FileReader = (p) => readFile(join(dir, p)).catch(() => null);
    const { caseId } = await this.findOrCreateCase(pkg);
    const { versionId, versionNo } = await this.importDraft(caseId, pkg, 'IMPORT', {}, files);
    const { validationId, status } = await this.validation.runNow(versionId);
    const row = await this.prisma.contentValidationResult.findUniqueOrThrow({ where: { id: validationId } });
    const issues = ((row.report as { issues?: ImportResult['issues'] } | null)?.issues ?? []).filter(
      (i) => i.severity === 'ERROR',
    );
    const result: ImportResult = { caseId, versionId, versionNo, validationId, validation: status, issues };
    if (opts.publish === true && status === 'PASSED') {
      const { snapshotId } = await this.publish(caseId, versionId, {
        legalReviewConfirmed: opts.legalApproved === true,
        ...(opts.reviewer === undefined ? {} : { reviewer: opts.reviewer }),
      });
      result.snapshotId = snapshotId;
    }
    return result;
  }
}
