import { chapter, court, dec, inc, phase } from '../../../tools/content/src/kit/index.js';
import type { Effect } from '../../../tools/content/src/kit/index.js';

// Dava #09 genelinde paylaşılan tanımlar: bölüm etiketleri, soruşturma evresi ve duruşma salonları.

export const PRO = chapter('Soğuk Açılış', 'DAVA #09 · SOĞUK AÇILIŞ');
export const BRIEF = chapter('Bölüm 1 · Dosya', 'DAVA #09 · BÖLÜM 1');
export const INV = chapter('Bölüm 2 · Soruşturma', 'DAVA #09 · SORUŞTURMA');
export const HEAR1 = chapter('Bölüm 3 · Birinci Celse', 'DURUŞMA · 1. CELSE');
export const ARA = chapter('Bölüm 4 · Ara', 'DAVA #09 · ARA');
export const HEAR2 = chapter('Bölüm 5 · İkinci Celse', 'DURUŞMA · 2. CELSE');

/** 1. evre: 4 gün × 3 eylem puanı (hub push / $return). */
export const p1 = phase({
  hub: 'INV_HUB',
  dayEnd: 'INV_DAY_END',
  trigger: 'tg_day_end',
  dayVar: 'day',
  apVar: 'ap',
  days: 4,
  ap: 3,
});

/** Ara evresi: 3 gün × 3 eylem puanı; yığınsız (etkinlikler doğrudan ARA_HUB'a döner). */
export const ARA_DAYS = 3;
export const ARA_AP = 3;

/** Bursa 7. Asliye Ceza: tek hâkim; kâtip ve savcı kürsüde. */
const bench = [
  ['katip', 'ZABIT KÂTİBİ', 0.15],
  ['hakim', 'HÂKİM', 0.5],
  ['savci', 'C. SAVCISI', 0.85],
] as const;

export const court1 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...HEAR1 });
export const court2 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...HEAR2 });

/** Yanlış sunum / dayanaksız itiraz ortak etkileri. */
export const wrongMove: Effect[] = [dec('cred'), dec('pers'), inc('wrong')];
