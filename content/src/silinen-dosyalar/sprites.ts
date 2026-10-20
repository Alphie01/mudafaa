import type { SpriteDef } from '../../../tools/content/src/kit/index.js';

// Davaya özgü yeni karakter sprite'ları (16×20, ortak palet). content/shared/sprites/ yalnızca tasarımdan çıkarılmış
// ortak sprite'ları tutar (tools/content/test/extract-sprites.test.ts); bu yüzden yeni karakterler burada, satır içi.
// Önizleme: dosyayı geçici olarak content/shared/sprites/'a kopyalayıp `npm run case:sprite-preview -- <ad>`.

/** Gül Aktaş: öğretmen; topuz saç, hardal hırka. */
export const SPRITE_GUL: SpriteDef = {
  id: 'sd_gul',
  rows: [
    '.....kkkkkk.....',
    '....kHHHHHHk....',
    '...kHHHHHHHHk...',
    '..kHHssssssHHk..',
    '..kHssssssssHk..',
    '..kHsessssesHk..',
    '..kHssssssssHk..',
    '..kHsssrrsssHk..',
    '...kHssssssHk...',
    '....kkkSSkkk....',
    '...kkggwwggkk...',
    '..kggggwwggggk..',
    '..kggggggggggk..',
    '..kgOggggggOgk..',
    '..kSggggggggSk..',
    '..kddddddddddk..',
    '...kddddddddk...',
    '...kddddddddk...',
    '...kjjjkkjjjk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Tarık Sezer: genel müdür; kır saç, lacivert takım, kırmızı kravat. */
export const SPRITE_TARIK: SpriteDef = {
  id: 'sd_tarik',
  rows: [
    '................',
    '....kyyyyyyk....',
    '...kyyyyyyyyk...',
    '...kyssssssyk...',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...kssyyyysskk..',
    '....ksssssk.....',
    '.....kkSSkk.....',
    '...kkAAwwAAkk...',
    '..kAAAwRRwAAAk..',
    '..kAAAwRRwAAAk..',
    '..kAAAAwRAAAAk..',
    '..kSAAAAAAAASk..',
    '..kAAAAAAAAAAk..',
    '...kAAAkkAAAk...',
    '...kAAAkkAAAk...',
    '...kkkkkkkkkk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Nalan Korkmaz: mali işler müdürü; kısa koyu saç, gözlük, gri ceket. */
export const SPRITE_NALAN: SpriteDef = {
  id: 'sd_nalan',
  rows: [
    '....kkkkkkkk....',
    '...khhhhhhhhk...',
    '..khhhhhhhhhhk..',
    '..khhsssssshhk..',
    '..khssssssssk...',
    '..khkekkkkekk...',
    '..khssssssssk...',
    '..khsssrrsssk...',
    '...kkssssssk....',
    '.....kkSSkk.....',
    '...kkZZwwZZkk...',
    '..kZZZZwwZZZZk..',
    '..kZZZZZZZZZZk..',
    '..kZbZZZZZZbZk..',
    '..kSZZZZZZZZSk..',
    '..knnnnnnnnnnk..',
    '...knnnnnnnnk...',
    '...knnnnnnnnk...',
    '....kkkkkkkk....',
    '...kkkk..kkkk...',
  ],
  noEyes: true,
};
