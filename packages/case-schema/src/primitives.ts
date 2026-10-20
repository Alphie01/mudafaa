import { z } from 'zod';

// Her şema ile tipi aynı adı taşır (`Id` hem değer hem tip): `Id.parse(x)` ve `const a: Id`.
// Nesne şemaları `z.strictObject` ile kurulur; bilinmeyen anahtar hatadır (`.strict()` ile aynı davranış).

/** İçerik kimliği: harfle başlar; harf, rakam ve `_` içerir; en çok 64 karakter. */
export const Id = z
  .string()
  .regex(
    /^[A-Za-z][A-Za-z0-9_]{0,63}$/,
    'Geçersiz kimlik: harfle başlamalı, yalnızca harf/rakam/_ içermeli, en çok 64 karakter olmalı',
  );
export type Id = z.infer<typeof Id>;

/** `#RRGGBB` rengi. */
export const Hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Geçersiz renk: #RRGGBB biçiminde olmalı');
export type Hex = z.infer<typeof Hex>;

/** Skor kategorileri (Karar ekranındaki beceri çubukları). */
export const Category = z.enum([
  'HUKUKI_BILGI',
  'DELIL_ANALIZI',
  'ARASTIRMA',
  'SORGULAMA',
  'SAVUNMA_STRATEJISI',
  'USUL_BILGISI',
]);
export type Category = z.infer<typeof Category>;

/** Karakter sprite'ının yüz ifadeleri. */
export const Expression = z.enum(['normal', 'mutlu', 'kizgin', 'saskin', 'uzgun']);
export type Expression = z.infer<typeof Expression>;

/** Geri bildirim ve etiketlerin rengi/anlamı. */
export const Tone = z.enum(['success', 'error', 'neutral', 'special', 'info']);
export type Tone = z.infer<typeof Tone>;

/** Sahne birimiyle tamsayı dikdörtgen: başlangıç noktası ≥ 0, boyut > 0. */
export const Rect = z.strictObject({
  x: z.int().min(0),
  y: z.int().min(0),
  w: z.int().positive(),
  h: z.int().positive(),
});
export type Rect = z.infer<typeof Rect>;
