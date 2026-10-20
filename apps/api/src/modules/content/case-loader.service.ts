import { promisify } from 'node:util';
import { gunzip, gzip } from 'node:zlib';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { CasePackage, Category } from '@mudafaa/case-schema';
import { compile, type CompiledCase } from '@mudafaa/engine';
import type { Redis } from 'ioredis';
import { LRUCache } from 'lru-cache';
import { notFound } from '../../common/api-error.js';
import { isUuid } from '../../common/uuid.js';
import { PrismaService } from '../../database/prisma.service.js';
import { REDIS } from '../../redis/redis.module.js';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

/** Redis anahtarı: `case:pkg:<snapshotId>` (gzip JSON, 7 gün). */
export const pkgKey = (snapshotId: string): string => `case:pkg:${snapshotId}`;
const TTL_SECONDS = 7 * 24 * 3600;

export interface LoadedCase {
  snapshotId: string;
  caseVersionId: string;
  caseId: string;
  compiled: CompiledCase;
  assetUrl: (a: { id: string; path: string }) => string;
  analysis: { categoryMax?: Partial<Record<Category, number>> } | null;
}

interface Cached {
  caseVersionId: string;
  caseId: string;
  analysis: LoadedCase['analysis'];
  package: unknown;
}

/**
 * Değişmez snapshot'tan derlenmiş dava. Arama sırası: bellek LRU (32) → Redis → `content_versions.package` → `compile`.
 * Snapshot değişmediği için geçersizleştirme yoktur. Redis erişilemezse doğrudan veritabanına düşülür.
 */
@Injectable()
export class CaseLoaderService {
  private readonly logger = new Logger(CaseLoaderService.name);
  private readonly cache = new LRUCache<string, LoadedCase>({ max: 32 });

  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  async getCompiled(snapshotId: string): Promise<LoadedCase> {
    const hit = this.cache.get(snapshotId);
    if (hit !== undefined) return hit;
    const cached = (await this.fromRedis(snapshotId)) ?? (await this.fromDb(snapshotId));
    const loaded = this.build(snapshotId, cached);
    this.cache.set(snapshotId, loaded);
    return loaded;
  }

  /** Geriye uyumlu ad. */
  get(snapshotId: string): Promise<LoadedCase> {
    return this.getCompiled(snapshotId);
  }

  /** Yalnızca testler: bellek katmanını boşaltır. */
  clearMemory(): void {
    this.cache.clear();
  }

  private async fromRedis(snapshotId: string): Promise<Cached | null> {
    try {
      const buf = await this.redis.getBuffer(pkgKey(snapshotId));
      if (buf === null) return null;
      return JSON.parse((await gunzipAsync(buf)).toString('utf8')) as Cached;
    } catch (e) {
      this.logger.warn(`Redis okunamadı (${snapshotId}): ${e instanceof Error ? e.message : String(e)}`);
      return null;
    }
  }

  private async fromDb(snapshotId: string): Promise<Cached> {
    const snap = isUuid(snapshotId)
      ? await this.prisma.contentVersion.findUnique({
          where: { id: snapshotId },
          include: { caseVersion: { select: { caseId: true, analysis: true } } },
        })
      : null;
    if (snap === null) throw notFound();
    const cached: Cached = {
      caseVersionId: snap.caseVersionId,
      caseId: snap.caseVersion.caseId,
      analysis: (snap.caseVersion.analysis as LoadedCase['analysis']) ?? null,
      package: snap.package,
    };
    try {
      const gz = await gzipAsync(Buffer.from(JSON.stringify(cached)));
      await this.redis.set(pkgKey(snapshotId), gz, 'EX', TTL_SECONDS);
    } catch (e) {
      this.logger.warn(`Redis'e yazılamadı (${snapshotId}): ${e instanceof Error ? e.message : String(e)}`);
    }
    return cached;
  }

  private build(snapshotId: string, cached: Cached): LoadedCase {
    const r = compile(cached.package as CasePackage);
    if (!r.ok) throw new Error(`Snapshot derlenemedi: ${snapshotId}`);
    const sha = new Map(r.c.pkg.assets.map((a) => [a.id, a.sha256] as const));
    return {
      snapshotId,
      caseVersionId: cached.caseVersionId,
      caseId: cached.caseId,
      compiled: r.c,
      analysis: cached.analysis,
      assetUrl: (a) => {
        const h = sha.get(a.id);
        return h === undefined ? a.path : `/v1/assets/${h}`;
      },
    };
  }
}
