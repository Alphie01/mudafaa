import { chapter, cmp, court, inc, set, v } from '../../../tools/content/src/kit/index.js';
import type { Effect } from '../../../tools/content/src/kit/index.js';

// Dava #09 genelinde paylaşılan tanımlar: bölüm etiketleri, evre değişkenleri ve duruşma salonu.

export const PRO = chapter('Soğuk açılış', 'DAVA #09 · SAHTE İMZA');
export const BRIEF = chapter('Bölüm 1 · Dosya', 'DAVA #09 · DOSYA');
export const INV = chapter('Bölüm 2 · Soruşturma', 'DAVA #09 · SORUŞTURMA');
export const HEAR1 = chapter('Bölüm 3 · Birinci Celse', 'DURUŞMA · 1. CELSE');
export const ARA = chapter('Bölüm 4 · Ara', 'DAVA #09 · ARA');
export const HEAR2 = chapter('Bölüm 5 · İkinci Celse', 'DURUŞMA · 2. CELSE');
export const VERDICT = chapter('Karar', 'DAVA #09 · HÜKÜM');

/** 1. evre: 4 gün × 4 eylem puanı (hub push / $return). */
export const P1 = { hub: 'INV_HUB', dayVar: 'day', apVar: 'ap', days: 4, ap: 4 } as const;
/** Ara evre: 3 gün × 3 eylem puanı (yığınsız; her etkinlik doğrudan ARA_HUB'a döner). */
export const P2 = { hub: 'ARA_HUB', dayVar: 'day2', apVar: 'ap2', days: 3, ap: 3 } as const;

export const startP1: Effect[] = [set(P1.dayVar, 1), set(P1.apVar, P1.ap)];
export const startP2: Effect[] = [set(P2.dayVar, 1), set(P2.apVar, P2.ap)];
export const nextDay1: Effect[] = [inc(P1.dayVar, 1), set(P1.apVar, P1.ap)];
export const nextDay2: Effect[] = [inc(P2.dayVar, 1), set(P2.apVar, P2.ap)];
export const day = (n: number) => cmp(v(P1.dayVar), '==', n);
export const day2 = (n: number) => cmp(v(P2.dayVar), '==', n);

/** Asliye ceza: tek hâkim; kâtip ve savcı kürsüde. */
const bench = [
  ['katip', 'ZABIT KÂTİBİ', 0.15],
  ['hakim', 'HÂKİM', 0.5],
  ['savci', 'C. SAVCISI', 0.85],
] as const;

export const court1 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...HEAR1 });
export const court2 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...HEAR2 });
