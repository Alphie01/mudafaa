import type { SpriteDef } from '../../../tools/content/src/kit/index.js';

// Davaya özgü sprite'lar (16×20, ortak palet). content/shared/sprites/ yalnızca tasarımdan çıkarılan 21 ortak sprite'ı
// taşır (tools/content/test/extract-sprites.test.ts); bu yüzden yeni karakterler burada, paketin içinde tanımlanır.
// Yüz bölgesi 4–11. sütunlar, 4–8. satırlardır (ifade katmanı oraya çizilir).

/** Halil Ekinci: kır saç, başının üstünde unutulmuş gözlük, gri takım, lacivert kravat. */
const zf_halil: SpriteDef = {
  id: 'zf_halil',
  rows: [
    '....kkkkkkkk....',
    '...kyyNNNNyyk...',
    '..kyyyyyyyyyyk..',
    '..kyssssssssyk..',
    '..kyssssssssyk..',
    '..kysessssesyk..',
    '..kyssssssssyk..',
    '..kyssskksssyk..',
    '...ksyyyyyysk...',
    '....kkSSSSkk....',
    '...kkvwwwwvkk...',
    '..kvvvwBBwvvvk..',
    '..kvvvvBBvvvvk..',
    '..kvvvvBBvvvvk..',
    '..kvvvvvvvvvvk..',
    '..ksvvvvvvvvsk..',
    '...kZZZZZZZZk...',
    '...kZZZkkZZZk...',
    '...kZZZkkZZZk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Zehra Ekinci: koyu, omuza inen saç; yeşil hemşire forması. */
const zf_zehra: SpriteDef = {
  id: 'zf_zehra',
  rows: [
    '....kkkkkkkk....',
    '...khhhhhhhhk...',
    '..khhhhhhhhhhk..',
    '..khhssssssshk..',
    '..khsssssssshk..',
    '..khsesssseshk..',
    '..khsssssssshk..',
    '..khssskkssshk..',
    '..khhsssssshhk..',
    '..kh.kkSSkk.hk..',
    '..khkwttttwkhk..',
    '..kttttwwttttk..',
    '..kttttttttttk..',
    '..ktwttttttwtk..',
    '..kttttttttttk..',
    '..ksttttttttsk..',
    '...kTTTTTTTTk...',
    '...kTTTkkTTTk...',
    '...kwwwkkwwwk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Sinan Kaplan: geriye taranmış koyu saç, açık renk ceket, bilekte yeşil ışıklı saat. */
const zf_sinan: SpriteDef = {
  id: 'zf_sinan',
  rows: [
    '....kkkkkkkk....',
    '...kjjjjjjjjk...',
    '..kjjjjjjjjjjk..',
    '..kjjssssssjjk..',
    '..kjssssssssjk..',
    '..kjsessssesjk..',
    '..kjssssssssjk..',
    '..kjssskksssjk..',
    '...kssssssssk...',
    '....kkSSSSkk....',
    '...kkxwwwwxkk...',
    '..kxxxwwwwxxxk..',
    '..kxxxwbbwxxxk..',
    '..kxxxwbbwxxxk..',
    '..kxxxxxxxxxxk..',
    '..ksixxxxxxxsk..',
    '...kddddddddk...',
    '...kdddkkdddk...',
    '...kdddkkdddk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Bayram Öz: kahverengi deri mont, bıyık, kısa kahve saç. */
const zf_bayram: SpriteDef = {
  id: 'zf_bayram',
  rows: [
    '....kkkkkkkk....',
    '...kHHHHHHHHk...',
    '..kHHHHHHHHHHk..',
    '..kHssssssssHk..',
    '..kHssssssssHk..',
    '..kHsessssesHk..',
    '..kHssssssssHk..',
    '..kHssskksssHk..',
    '...kshhhhhhsk...',
    '....kkSSSSkk....',
    '...kkOOyyOOkk...',
    '..kOOOOyyOOOOk..',
    '..kOjOOyyOOjOk..',
    '..kOOOOyyOOOOk..',
    '..kOOOOOOOOOOk..',
    '..ksOOOOOOOOsk..',
    '...knnnnnnnnk...',
    '...knnnkknnnk...',
    '...knnnkknnnk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Ferda Yalçın: kısa, kırlaşmış saç; bordo ceket, beyaz bluz. */
const zf_ferda: SpriteDef = {
  id: 'zf_ferda',
  rows: [
    '....kkkkkkkk....',
    '...kyyyyyyyyk...',
    '..kyyyyyyyyyyk..',
    '..kyyssssssyyk..',
    '..kyssssssssyk..',
    '..kysessssesyk..',
    '..kyssssssssyk..',
    '..kyssskksssyk..',
    '..kyyssssssyyk..',
    '....kkSSSSkk....',
    '...kkFwwwwFkk...',
    '..kFFFwwwwFFFk..',
    '..kFFFFwwFFFFk..',
    '..kFFFFFFFFFFk..',
    '..kFFFFFFFFFFk..',
    '..ksFFFFFFFFsk..',
    '...knnnnnnnnk...',
    '...knnnkknnnk...',
    '...knnnkknnnk...',
    '..kkkkk..kkkkk..',
  ],
};

export const caseSprites: SpriteDef[] = [zf_halil, zf_zehra, zf_sinan, zf_bayram, zf_ferda];
