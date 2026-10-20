import { Injectable } from '@nestjs/common';
import type { CasePackage } from '@mudafaa/case-schema';
import { compile, type CompiledCase } from '@mudafaa/engine';
import { LRUCache } from 'lru-cache';
import { notFound } from '../../common/api-error.js';
import { PrismaService } from '../../database/prisma.service.js';

export interface LoadedCase {
  snapshotId: string;
  caseVersionId: string;
  compiled: CompiledCase;
  assetUrl: (a: { id: string; path: string }) => string;
}

/** Değişmez snapshot'tan derlenmiş dava; snapshot değişmediği için önbellek geçersizleştirilmez. */
@Injectable()
export class CaseLoaderService {
  private readonly cache = new LRUCache<string, LoadedCase>({ max: 32 });

  constructor(private readonly prisma: PrismaService) {}

  async get(snapshotId: string): Promise<LoadedCase> {
    const hit = this.cache.get(snapshotId);
    if (hit !== undefined) return hit;
    const snap = await this.prisma.contentVersion.findUnique({ where: { id: snapshotId } });
    if (snap === null) throw notFound();
    const r = compile(snap.package as unknown as CasePackage);
    if (!r.ok) throw new Error(`Snapshot derlenemedi: ${snapshotId}`);
    const sha = new Map(r.c.pkg.assets.map((a) => [a.id, a.sha256] as const));
    const loaded: LoadedCase = {
      snapshotId,
      caseVersionId: snap.caseVersionId,
      compiled: r.c,
      assetUrl: (a) => (sha.get(a.id) === undefined ? a.path : `/v1/assets/${sha.get(a.id) ?? ''}`),
    };
    this.cache.set(snapshotId, loaded);
    return loaded;
  }
}
