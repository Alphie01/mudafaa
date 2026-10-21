import type { SpriteDef } from '../../../tools/content/src/kit/index.js';

// Dava #14'ün yeni karakter sprite'ları (16×20, ortak palet). content/shared/sprites/ yalnızca tasarımdan çıkarılan
// ortak sprite'ları tutar (tools/content/test/extract-sprites.test.ts); davaya özgü sprite'lar burada yaşar.

/** Halil Bozkurt: kır saç, bıyık, döşemeci önlüğü. */
const HALIL: SpriteDef = {
  id: 'yanik_ev_halil',
  rows: [
    '....kkkkkkkk....',
    '...kyyyyyyyyk...',
    '..kyyyyyyyyyyk..',
    '..kyysssssssyk..',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...kshhhhhhsk...',
    '....kssssssk....',
    '.....kkSSkk.....',
    '...kkbbwwbbkk...',
    '..kbbxxxxxxbbk..',
    '..kbbxxxxxxbbk..',
    '..kbbxxOOxxbbk..',
    '..kSbxxxxxxbSk..',
    '...kxxxxxxxxk...',
    '...knnnnnnnnk...',
    '...knnnkknnnk...',
    '...knnnkknnnk...',
    '..kkkkk..kkkkk..',
  ],
  noMouth: true,
};

/** Zehra Bozkurt: uzun koyu saç, açık mavi hemşire forması. */
const ZEHRA: SpriteDef = {
  id: 'yanik_ev_zehra',
  rows: [
    '....kkkkkkkk....',
    '...kjjjjjjjjk...',
    '..kjjjjjjjjjjk..',
    '..kjjssssssjjk..',
    '..kjssssssssjk..',
    '..kjsessssesjk..',
    '..kjssssssssjk..',
    '..kjsssrrsssjk..',
    '..kjjssssssjjk..',
    '..kjjkkSSkkjjk..',
    '..kjkCCwwCCkjk..',
    '..kCCCCwwCCCCk..',
    '..kCCCCCCCCCCk..',
    '..kCwCCCCCCCCk..',
    '..kSCCCCCCCCSk..',
    '...kCCCCCCCCk...',
    '...kCCCCCCCCk...',
    '...kCCCkkCCCk...',
    '...kwwwkkwwwk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Tarık Sönmez: taranmış saç, gri-mavi takım, kırmızı kravat. */
const TARIK: SpriteDef = {
  id: 'yanik_ev_tarik',
  rows: [
    '....kkkkkkkk....',
    '...khhhhhhhhk...',
    '..khhhhhhhhhhk..',
    '..khhssssssshk..',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...kssskksssk...',
    '....kssssssk....',
    '.....kkSSkk.....',
    '...kkcwRRwckk...',
    '..kcccwRRwccck..',
    '..kccccRRccccck.',
    '..kcAcccccccAck.',
    '..kScccccccccSk.',
    '...kAAAAAAAAk...',
    '...kAAAkkAAAk...',
    '...kAAAkkAAAk...',
    '...kAAAkkAAAk...',
    '..kkkkk..kkkkk..',
  ],
};

export const caseSprites: SpriteDef[] = [HALIL, ZEHRA, TARIK];
