import { sharedSprite } from '../../../tools/content/src/kit/index.js';
import type { SpriteDef } from '../../../tools/content/src/kit/index.js';

// Davaya özgü yeni karakter sprite'ları (16×20, ortak palet). content/shared/sprites/ yalnızca tasarımdan çıkarılmış
// 21 ortak sprite'ı tutar (tools/content/test/extract-sprites.test.ts); bu yüzden yeni karakterler burada, satır içi
// tanımlanır: ortak bir gövde şablonu harf harf yeniden boyanır. Önizleme: üretilen JSON'u geçici olarak
// content/shared/sprites/'a kopyalayıp `npm run case:sprite-preview -- <ad>`.

const recolor = (base: string, id: string, map: Record<string, string>, extra: Partial<SpriteDef> = {}): SpriteDef => {
  const src = sharedSprite(base);
  return {
    ...src,
    id,
    rows: src.rows.map((r) => [...r].map((c) => map[c] ?? c).join('')),
    ...extra,
  };
};

/** Gülay Demirel: koyu saç, yeşil bluz, lacivert etek. */
export const SPRITE_GULAY = recolor('anne', 'lg_gulay', { f: 'h', F: 'H', i: 't', I: 'T', Z: 'n' });

/** Kenan Aksoy: kır sakal, lacivert kazak, koyu pantolon (eski römorkör kaptanı). */
export const SPRITE_KENAN = recolor('huseyin', 'lg_kenan', { y: 'z', b: 'c', B: 'A', w: 'N', Z: 'D' });

/** Doç. Dr. Selma Karaca: koyu kahve saç, beyaz önlük, lacivert alt. */
export const SPRITE_KARACA = recolor('anne', 'lg_karaca', { f: 'j', F: 'j', i: 'w', I: 'y', Z: 'c' });
