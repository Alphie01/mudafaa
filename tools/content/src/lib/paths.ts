import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Depo içi yollar. Kök, bu dosyanın konumundan bulunur (komutlar hangi dizinden çalışırsa çalışsın).

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

/** Dava kısa adı: küçük harf, rakam ve tek tire (CasePackage.meta.slug ile aynı alfabe). */
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertSlug(slug: string | undefined): string {
  if (slug === undefined || !SLUG.test(slug)) {
    throw new UsageError(`Geçersiz dava adı: ${String(slug)} (küçük harf, rakam ve tire; ör. kayip-cuzdan)`);
  }
  return slug;
}

export const caseSrcDir = (slug: string, root = repoRoot): string => join(root, 'content/src', slug);
export const caseOutDir = (slug: string, root = repoRoot): string => join(root, 'content/cases', slug);
export const sharedSpritesDir = (root = repoRoot): string => join(root, 'content/shared/sprites');

/** Kullanım hatası (çıkış kodu 2). */
export class UsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}
