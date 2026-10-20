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

/**
 * Sahne arka planı: istemcinin genel illüstrasyon setinden biri (davaya özgü değildir; büro, görüş odası, gece sokağı…).
 * Node'un açılış arka planı ve diyalog içinde satır bazında sahne değişimi için kullanılır.
 */
export const Backdrop = z.enum([
  'siyah',
  'buro',
  'buro_gece',
  'gorus_odasi',
  'durusma_salonu',
  'adliye',
  'karakol',
  'sokak_gece',
  'sokak_yagmur',
  'sokak_karanlik',
  'sokak_sabah',
  'depo',
  'depo_gece',
  'cay_ocagi',
  'ev',
  'kafe',
  'hastane',
  'liman_gece',
  'arac',
]);
export type Backdrop = z.infer<typeof Backdrop>;

/** Satırla birlikte oynatılan tek seferlik görsel efekt. */
export const LineFx = z.enum(['shake', 'flash', 'fade']);
export type LineFx = z.infer<typeof LineFx>;

/**
 * Satırın sunum biçimi: `card` tam ekran başlık kartı (yer/saat), `whisper` fısıltı, `thought` iç ses,
 * `phone` telefon/hoparlör sesi. Yoksa olağan konuşma balonu.
 */
export const LineStyle = z.enum(['card', 'whisper', 'thought', 'phone']);
export type LineStyle = z.infer<typeof LineStyle>;

/** Geri bildirim ve etiketlerin rengi/anlamı. */
export const Tone = z.enum(['success', 'error', 'neutral', 'special', 'info']);
export type Tone = z.infer<typeof Tone>;

/** Delil türü: `EvidenceDef.kind` ile `{count:'evidence', kind}` süzgeci bu şemayı paylaşır. */
export const EvidenceKind = z.enum(['EVIDENCE', 'CLUE', 'INSIGHT']);
export type EvidenceKind = z.infer<typeof EvidenceKind>;

/** Sahne birimiyle tamsayı dikdörtgen: başlangıç noktası ≥ 0, boyut > 0. */
export const Rect = z.strictObject({
  x: z.int().min(0),
  y: z.int().min(0),
  w: z.int().positive(),
  h: z.int().positive(),
});
export type Rect = z.infer<typeof Rect>;
