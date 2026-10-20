import { chapter, court, phase } from '../../../tools/content/src/kit/index.js';

// Dava #06 genelinde paylaşılan tanımlar: bölüm etiketleri, soruşturma evreleri ve duruşma salonu.

export const C0 = chapter('Soğuk açılış', 'DAVA #06 · SON MESAJ');
export const C1 = chapter('Bölüm 1 · Dosya', 'DAVA #06 · DOSYA');
export const C2 = chapter('Bölüm 2 · Soruşturma', 'DAVA #06 · SORUŞTURMA');
export const C3 = chapter('Bölüm 3 · Birinci celse', 'DURUŞMA · 1. CELSE');
export const C4 = chapter('Bölüm 4 · Ara', 'DAVA #06 · ARA');
export const C5 = chapter('Bölüm 5 · İkinci celse', 'DURUŞMA · 2. CELSE');
export const CV = chapter('Karar', 'DAVA #06 · HÜKÜM');

/** Birinci evre: 3 gün × 4 eylem puanı (hub push / $return kullanır). */
export const p1 = phase({
  hub: 'INV_HUB',
  dayEnd: 'INV_DAY_END',
  trigger: 'tg_inv_day',
  dayVar: 'day',
  apVar: 'ap',
  days: 3,
  ap: 6,
});

/** Ara evresi: 2 gün × 3 eylem puanı; etkinlikler yığınsız, doğrudan ARA_HUB'a döner. */
export const p2 = phase({
  hub: 'ARA_HUB',
  dayEnd: 'ARA_DAY_END',
  trigger: 'tg_ara_day',
  dayVar: 'ara_day',
  apVar: 'ara_ap',
  days: 2,
  ap: 3,
  dayLabel: 'Ara günü',
});

/** Asliye ceza: tek hâkim; kâtip ve savcı kürsüde. */
const bench = [
  ['derya', 'ZABIT KÂTİBİ', 0.18],
  ['feride', 'HÂKİM', 0.5],
  ['tolga', 'C. SAVCISI', 0.82],
] as const;

export const court1 = court({
  bench,
  counsel: 'deniz',
  hud: ['cred', 'pers'],
  banner: 'ADALET MÜLKÜN TEMELİDİR',
  ...C3,
});
export const court2 = court({
  bench,
  counsel: 'deniz',
  hud: ['cred', 'pers'],
  banner: 'ADALET MÜLKÜN TEMELİDİR',
  ...C5,
});
