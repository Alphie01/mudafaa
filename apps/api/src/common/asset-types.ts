/**
 * Varlık deposunun kabul ettiği dosya türleri. API kökeninden sunulan dosyalar betik çalıştırabilecek türde olmamalı
 * (text/html, image/svg+xml… depolanmış XSS); yalnızca bu raster görsel türleri kendi türüyle sunulur, geri kalan her
 * şey `application/octet-stream` + `Content-Disposition: attachment` olarak iner.
 */
export const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp'] as const;
export type AllowedMime = (typeof ALLOWED_MIME)[number];

export const isAllowedMime = (mime: string | null | undefined): mime is AllowedMime =>
  mime !== null && mime !== undefined && (ALLOWED_MIME as readonly string[]).includes(mime);

const startsWith = (b: Buffer, sig: readonly number[], at = 0): boolean =>
  b.length >= at + sig.length && sig.every((x, i) => b[at + i] === x);

/** Sihirli baytlardan dosya türü (yalnızca izinli türler; tanınmayan içerik null). */
export function sniffMime(bytes: Buffer): AllowedMime | null {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return 'image/webp';
  }
  return null;
}
