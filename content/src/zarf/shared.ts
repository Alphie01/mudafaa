import { chapter, court, phase } from '../../../tools/content/src/kit/index.js';

// Dava genelinde paylaşılan tanımlar: bölüm etiketleri, soruşturma evreleri ve duruşma salonları.
// TODO: bölüm adlarını ve evre takvimini hikâyeye göre düzenle (kılavuz: docs/content/authoring-guide.md §2).

export const BRIEF = chapter('Brifing', 'DAVA #12 · BRİFİNG');
export const INV1 = chapter('Soruşturma · 1. evre', 'DAVA #12 · SORUŞTURMA');
export const HEAR1 = chapter('1. Celse', 'DURUŞMA · 1. CELSE');
export const INV2 = chapter('Soruşturma · 2. evre', 'DAVA #12 · SORUŞTURMA');
export const TRIAL = chapter('2. Celse', 'DURUŞMA · 2. CELSE');
export const VERDICT = chapter('Karar', 'DAVA #12 · HÜKÜM');

/** 1. evre: 1. celseden önce. */
export const p1 = phase({
  hub: 'INV1_HUB',
  dayEnd: 'INV1_DAY_END',
  trigger: 'tg_inv1_day',
  dayVar: 'day',
  apVar: 'ap',
  days: 2,
  ap: 3,
});

/** 2. evre: ters köşeden sonra, 2. celseden önce (ayrı değişkenler). */
export const p2 = phase({
  hub: 'INV2_HUB',
  dayEnd: 'INV2_DAY_END',
  trigger: 'tg_inv2_day',
  dayVar: 'day2',
  apVar: 'ap2',
  days: 2,
  ap: 2,
});

/** Ağır ceza heyeti: üye hâkim, başkan, cumhuriyet savcısı. */
const bench = [
  ['uye', 'ÜYE HÂKİM', 0.2],
  ['baskan', 'BAŞKAN', 0.5],
  ['savci', 'C. SAVCISI', 0.8],
] as const;

export const court1 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...HEAR1 });
export const court2 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...TRIAL });
