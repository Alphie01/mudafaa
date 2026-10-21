import type { SpriteDef } from '../../../tools/content/src/kit/index.js';

// Davaya özgü yeni karakter sprite'ları (16×20, ortak palet). content/shared/sprites/ yalnızca tasarımdan çıkarılmış
// ortak sprite'ları tutar (tools/content/test/extract-sprites.test.ts); bu yüzden yeni karakterler burada, satır içi.
// Önizleme: dosyayı geçici olarak content/shared/sprites/'a kopyalayıp `npm run case:sprite-preview -- <ad>`.

/** Orhan Kılıç: 47, veznedar. Kırlaşmış kahverengi saç, gri hırka, kravat. */
export const SPRITE_ORHAN: SpriteDef = {
  id: 'bk_orhan',
  rows: [
    '................',
    '.....kkkkkk.....',
    '....kHHyHHHk....',
    '...kHHHHHHHHk...',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...kssskksssk...',
    '....kssssssk....',
    '.....kkSSkk.....',
    '...kkvwwwwvkk...',
    '..kvvvwBBwvvvk..',
    '..kvvvwBBwvvvk..',
    '..kvZvvBBvvZvk..',
    '..kSvvvvvvvvSk..',
    '...kvvvvvvvvk...',
    '...kNNNNNNNNk...',
    '...kNNNkkNNNk...',
    '...kjjjkkjjjk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Ercan Tunalı: 52, Mali Hizmetler Müdür Yardımcısı. Taranmış gri saç, koyu takım, kırmızı kravat. */
export const SPRITE_ERCAN: SpriteDef = {
  id: 'bk_ercan',
  rows: [
    '................',
    '....kyyyyyyk....',
    '...kyyyyyyyyk...',
    '...kyssssssyk...',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...kssskksssk...',
    '....kssssssk....',
    '.....kkSSkk.....',
    '...kknwwwwnkk...',
    '..knnnwRRwnnnk..',
    '..knnnwRRwnnnk..',
    '..knNnnRRnnNnk..',
    '..kSnnnnnnnnSk..',
    '...knnnnnnnnk...',
    '...knnnnnnnnk...',
    '...knnnkknnnk...',
    '...kkkkkkkkkk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Melek Yavuz: 36, veznedar. Bordo uzun saç, lacivert yelek, beyaz gömlek. */
export const SPRITE_MELEK: SpriteDef = {
  id: 'bk_melek',
  rows: [
    '....kkkkkkkk....',
    '...kppppppppk...',
    '..kppppppppppk..',
    '..kppssssssppk..',
    '..kpssssssssppk.',
    '..kpsessssesppk.',
    '..kpssssssssppk.',
    '..kpssskksssppk.',
    '..kppssssssppk..',
    '..kpp.kSSk.ppk..',
    '...kkBwwwwBkk...',
    '..kBBBwwwwBBBk..',
    '..kBBBwwwwBBBk..',
    '..kBgBBBBBBgBk..',
    '..kSBBBBBBBBSk..',
    '..kNNNNNNNNNNk..',
    '...kNNNkkNNNk...',
    '...kNNNkkNNNk...',
    '...kzzzkkzzzk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Burak Şen: 29, bilgi işlem teknikeri. Dağınık saç, yeşil kapüşonlu, kimlik kartı ipi. */
export const SPRITE_BURAK: SpriteDef = {
  id: 'bk_burak',
  rows: [
    '.....k.kk.k.....',
    '....khhkhhhk....',
    '...khhhhhhhhk...',
    '...khsssssshk...',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...kssskksssk...',
    '....kssssssk....',
    '.....kkSSkk.....',
    '...kkttttttkk...',
    '..kttttRRttttk..',
    '..kttttRRttttk..',
    '..ktTttwwttTtk..',
    '..kSttttttttSk..',
    '...kttttttttk...',
    '...kddddddddk...',
    '...kdddkkdddk...',
    '...kwwwkkwwwk...',
    '..kkkkk..kkkkk..',
  ],
};

/** Hayri Özdemir: 71, emekli tarih öğretmeni. Kel, beyaz kenar saç ve bıyık, kahverengi hırka. */
export const SPRITE_HAYRI: SpriteDef = {
  id: 'bk_hayri',
  rows: [
    '................',
    '.....kkkkkk.....',
    '....kssssssk....',
    '...kyssssssyk...',
    '...kssssssssk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '...ksyyyyyysk...',
    '....ksskkssk....',
    '.....kkSSkk.....',
    '...kkxwwwwxkk...',
    '..kxxxwwwwxxxk..',
    '..kxxxwddwxxxk..',
    '..kxOxwwwwxOxk..',
    '..kSxxxxxxxxSk..',
    '...kxxxxxxxxk...',
    '...kZZZZZZZZk...',
    '...kZZZkkZZZk...',
    '...kjjjkkjjjk...',
    '..kkkkk..kkkkk..',
  ],
  noMouth: true,
};
