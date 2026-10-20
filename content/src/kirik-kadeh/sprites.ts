import type { SpriteDef } from '@mudafaa/case-schema';

// Davaya özgü sprite'lar (16×20, ortak palet). content/shared/sprites/ yalnızca tasarımdan çıkarılan 21 ortak sprite'ı
// taşır (tools/content/test/extract-sprites.test.ts); bu yüzden Serkan, Onur ve Ece burada, paketin içinde tanımlanır.

const kk_serkan: SpriteDef = {
  id: 'kk_serkan',
  rows: [
    '....kkkkkkkk....',
    '...khhhhhhhhk...',
    '..khhhhhhhhhhk..',
    '...khsssssshk...',
    '...kssssssssk...',
    '...ksessssesk...',
    '...ksssCCsssk...',
    '...kssskksssk...',
    '....kssssssk....',
    '.....kkwwkk.....',
    '...kkZwrrwZkk...',
    '..kZZZwrrwZZZk..',
    '..kZZZwrrwZZZk..',
    '..kZzZwwwwZzZk..',
    '..kSZZZZZZZZSk..',
    '...knnnnnnnnk...',
    '...knnnkknnnk...',
    '...knnnkknnnk...',
    '...knnnkknnnk...',
    '..kkkkk..kkkkk..',
  ],
};

const kk_onur: SpriteDef = {
  id: 'kk_onur',
  rows: [
    '....kkkkkkkk....',
    '...kHHHHHHHHk...',
    '...kHHHHHHHHHk..',
    '...kHsssssssk...',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...kssskksssk...',
    '....kssssssk....',
    '.....kkCCkk.....',
    '...kkBCCCCBkk...',
    '..kBBBCCCCBBBk..',
    '..kBBBCCCCBBBk..',
    '..kBdBCCCCBdBk..',
    '..kSBBBBBBBBSk..',
    '...kAAAAAAAAk...',
    '...kAAAkkAAAk...',
    '...kAAAkkAAAk...',
    '...kAAAkkAAAk...',
    '..kkkkk..kkkkk..',
  ],
};

const kk_ece: SpriteDef = {
  id: 'kk_ece',
  rows: [
    '....kkkkkkkk....',
    '...kJJJJJJJJk...',
    '..kJJJJJJJJJJk..',
    '..kJssssssssJk..',
    '..kJssssssssJk..',
    '..kJsessssesJk..',
    '..kJssssssssJk..',
    '..kJssskksssJk..',
    '..kJkssssssJJk..',
    '..kJJkkwwkkJJk..',
    '...kkwwwwwwkk...',
    '..kwwnnnnnnwwk..',
    '..kwwnnnnnnwwk..',
    '..kwwnnffnnwwk..',
    '..kSwnnnnnnwSk..',
    '...knnnnnnnnk...',
    '...knnnkknnnk...',
    '...kBBBkkBBBk...',
    '...kBBBkkBBBk...',
    '..kkkkk..kkkkk..',
  ],
};

export const caseSprites: SpriteDef[] = [kk_serkan, kk_onur, kk_ece];
