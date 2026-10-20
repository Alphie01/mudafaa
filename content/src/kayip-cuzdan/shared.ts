import { chapter, court } from '../../../tools/content/src/kit/index.js';

// Dava genelinde paylaşılan tanımlar: bölüm etiketleri ve duruşma salonları. Soruşturma ve ara evresinin hub'ları
// Dava #07 kalıbıyla elle kurulur (gün sonu DECISION + akşam sahneleri; ara evresinde yığınsız dönüş).

export const COLD = chapter('Soğuk Açılış', 'DAVA #01 · SOĞUK AÇILIŞ');
export const BRIEF = chapter('Bölüm 1 · Dosya', 'DAVA #01 · BÖLÜM 1');
export const INV = chapter('Bölüm 2 · Soruşturma', 'DAVA #01 · SORUŞTURMA');
export const HEAR1 = chapter('Bölüm 3 · Birinci Celse', 'DURUŞMA · 1. CELSE');
export const ARA = chapter('Bölüm 4 · Ara', 'DAVA #01 · ARA');
export const TRIAL = chapter('Bölüm 5 · İkinci Celse', 'DURUŞMA · 2. CELSE');
export const VERDICT = chapter('Karar', 'DAVA #01 · HÜKÜM');

/** Soruşturma evresi: 3 gün × 4 eylem puanı. */
export const INV_DAYS = 3;
export const INV_AP = 4;
/** Ara evresi: 3 gün × 3 eylem puanı. */
export const ARA_DAYS = 3;
export const ARA_AP = 3;

/** Asliye ceza: tek hâkim; kâtip ve duruşma savcısı. */
const bench = [
  ['katip', 'ZABIT KÂTİBİ', 0.14],
  ['hakim', 'HÂKİM', 0.5],
  ['savci', 'C. SAVCISI', 0.86],
] as const;

export const court1 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...HEAR1 });
export const court2 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...TRIAL });
