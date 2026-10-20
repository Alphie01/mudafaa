import { chapter, court, dec, inc, phase } from '../../../tools/content/src/kit/index.js';
import type { Effect } from '../../../tools/content/src/kit/index.js';

// Dava genelinde paylaşılan tanımlar: bölüm etiketleri, soruşturma evresi ve duruşma salonları.

export const PRO = chapter('Soğuk Açılış', 'DAVA #13 · SOĞUK AÇILIŞ');
export const C1 = chapter('Bölüm 1 · Dosya', 'DAVA #13 · BÖLÜM 1');
export const INV = chapter('Bölüm 2 · Soruşturma', 'DAVA #13 · SORUŞTURMA');
export const H1 = chapter('Bölüm 3 · Birinci Celse', 'DURUŞMA · 1. CELSE');
export const ARA = chapter('Bölüm 4 · Ara', 'DAVA #13 · ARA');
export const H2 = chapter('Bölüm 5 · İkinci Celse', 'DURUŞMA · 2. CELSE');

/** Soruşturma: 3 gün × 6 eylem puanı (push / $return). */
export const p1 = phase({
  hub: 'INV_HUB',
  dayEnd: 'INV_DAY_END',
  trigger: 'tg_day_end',
  dayVar: 'day',
  apVar: 'ap',
  days: 3,
  ap: 6,
});

/** Ara evresi: 3 gün × 4 eylem puanı; yığınsız (etkinlikler doğrudan ARA_HUB'a döner). */
export const ARA_DAYS = 3;
export const ARA_AP = 4;

/** Bursa 9. Asliye Ceza: tek hâkim; solda katılan vekili, sağda Cumhuriyet savcısı. */
const bench = [
  ['ozan', 'KATILAN VEKİLİ', 0.2],
  ['kemal', 'HÂKİM', 0.5],
  ['ferda', 'C. SAVCISI', 0.8],
] as const;

export const court1 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...H1 });
export const court2 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...H2 });

/** Yanlış sunum / dayanaksız itiraz ortak etkileri. */
export const wrongMove: Effect[] = [dec('cred'), dec('pers'), inc('wrong')];
