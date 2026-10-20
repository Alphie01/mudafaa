import type { SpriteDef } from '../../../tools/content/src/kit/index.js';

// Davaya özgü yeni karakter sprite'ları (16×20, ortak palet). content/shared/sprites/ yalnızca tasarımdan çıkarılmış
// ortak sprite'ları tutar (tools/content/test/extract-sprites.test.ts); bu yüzden yeni karakterler burada, satır içi.
// Önizleme: dosyayı geçici olarak content/shared/sprites/'a kopyalayıp `npm run case:sprite-preview -- <ad>`.

/** Kemal Yalçın: kırlaşmış saç, uzamış sakal, reflektörlü turuncu iş montu. */
export const SPRITE_KEMAL: SpriteDef = {
  id: 'sd_kemal',
  rows: [
    '................',
    '....kkkkkkkk....',
    '...kzZzZzZzZk...',
    '...kZzzzzzzZk...',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...kszsrrszsk...',
    '....kzzzzzzk....',
    '.....kkSSkk.....',
    '...kkooooookk...',
    '..koooooooOOok..',
    '..kyyyyyyyyyyk..',
    '..koOooooooOok..',
    '..kSooooooooSk..',
    '...kooooooook...',
    '...knnnkknnnk...',
    '...knnnkknnnk...',
    '...kjjjkkjjjk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Tarık Sezer: geriye taranmış koyu saç, kırlaşmış şakaklar, koyu takım elbise, beyaz gömlek, kırmızı kravat. */
export const SPRITE_TARIK: SpriteDef = {
  id: 'sd_tarik',
  rows: [
    '................',
    '....kkkkkkkk....',
    '...khhhhhhhhk...',
    '...kyhhhhhhyk...',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...ksssrrsssk...',
    '....kssssssk....',
    '.....kkSSkk.....',
    '...kkAwrrwAkk...',
    '..kAAAwrrwAAAk..',
    '..kAAAAwwAAAAk..',
    '..kAcAAAAAAcAk..',
    '..kSAAAAAAAASk..',
    '...kAAAAAAAAk...',
    '...kAAAkkAAAk...',
    '...kAAAkkAAAk...',
    '...knnnkknnnk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Cansu Güler: at kuyruğu, beyaz gömlek üstüne siyah garson önlüğü. */
export const SPRITE_CANSU: SpriteDef = {
  id: 'sd_cansu',
  rows: [
    '....kkkkkkkk....',
    '...kHHHHHHHHk...',
    '..kHHHHHHHHHHk..',
    '..kHHssssssHHkk.',
    '..kHssssssssHkHk',
    '..kHsessssesHkHk',
    '..kHssssssssHk.k',
    '..kHsssrrsssHk..',
    '...kkssssssk....',
    '.....kkSSkk.....',
    '...kkwwwwwwkk...',
    '..kwwwwwwwwwwk..',
    '..kwnnnnnnnnwk..',
    '..kwnnnnnnnnwk..',
    '..kSnnnnnnnnSk..',
    '...knnnnnnnnk...',
    '...knnnkknnnk...',
    '...kNNNkkNNNk...',
    '...knnnkknnnk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Gülay Toker: siyah başörtüsü, siyah yas giysisi. */
export const SPRITE_GULAY: SpriteDef = {
  id: 'sd_gulay',
  rows: [
    '....kkkkkkkk....',
    '...knnnnnnnnk...',
    '..knnnnnnnnnnk..',
    '..knnssssssnnk..',
    '..knssssssssnk..',
    '..knsessssesnk..',
    '..knssssssssnk..',
    '..knsssrrsssnk..',
    '..knnssssssnnk..',
    '..knnnnSSnnnnk..',
    '...kkNNNNNNkk...',
    '..kNNNNNNNNNNk..',
    '..kNNNNNNNNNNk..',
    '..kNnNNNNNNnNk..',
    '..kSNNNNNNNNSk..',
    '..knnnnnnnnnnk..',
    '..knnnnnnnnnnk..',
    '..knnnnnnnnnnk..',
    '...knnnnnnnnk...',
    '...kkkk..kkkk...',
  ],
};
