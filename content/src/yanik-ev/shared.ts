import { chapter, court, dec, inc, phase } from '../../../tools/content/src/kit/index.js';
import type { Backdrop, Expression, Line, LineFx } from '@mudafaa/case-schema';

// Dava genelinde paylaşılan tanımlar: bölüm etiketleri, soruşturma evreleri, duruşma salonları ve satır kısaltmaları.

export const PRO = chapter('Soğuk açılış', 'DAVA #14 · YANIK EV');
export const BRIEF = chapter('Bölüm 1 · Dosya', 'DAVA #14 · DOSYA');
export const INV1 = chapter('Bölüm 2 · Soruşturma', 'DAVA #14 · SORUŞTURMA');
export const HEAR1 = chapter('Bölüm 3 · Birinci celse', 'DURUŞMA · 1. CELSE');
export const INV2 = chapter('Bölüm 4 · Ara', 'DAVA #14 · ARA');
export const TRIAL = chapter('Bölüm 5 · İkinci celse', 'DURUŞMA · 2. CELSE');
export const VERDICT = chapter('Karar', 'DAVA #14 · HÜKÜM');

/** 1. evre: 1. celseden önce (3 gün × 4 eylem puanı). */
export const p1 = phase({
  hub: 'INV_HUB',
  dayEnd: 'INV_DAY_END',
  trigger: 'tg_inv_day',
  dayVar: 'day',
  apVar: 'ap',
  days: 3,
  ap: 4,
});

/** Ara evre: 1. celseden sonra (2 gün × 4 eylem puanı). */
export const p2 = phase({
  hub: 'ARA_HUB',
  dayEnd: 'ARA_DAY_END',
  trigger: 'tg_ara_day',
  dayVar: 'day2',
  apVar: 'ap2',
  days: 2,
  ap: 4,
});

/** Asliye ceza: tek hâkim; cumhuriyet savcısı; katılan vekili (Kalkan Sigorta). */
const bench = [
  ['hakim', 'HÂKİM', 0.5],
  ['savci', 'C. SAVCISI', 0.85],
] as const;

export const court1 = court({
  bench,
  counsel: 'deniz',
  hud: ['cred', 'pers'],
  ...HEAR1,
});
export const court2 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...TRIAL });

/** Yanlış delil sunumunun ortak bedeli. */
export const wrongEvidence = [dec('cred'), dec('pers'), inc('wrong')];

// --- Satır kısaltmaları ---

/** Konuşma satırı. */
export const s = (speaker: string, text: string, expression?: Expression): Line =>
  expression === undefined ? { speaker, text } : { speaker, expression, text };
/** Anlatıcı satırı (isteğe bağlı arka plan / efekt). */
export const n = (text: string, opts: { bg?: Backdrop; fx?: LineFx } = {}): Line => ({
  speaker: 'narrator',
  text,
  ...opts,
});
/** Yer/saat kartı. */
export const card = (text: string, bg: Backdrop, fx?: LineFx): Line => ({
  speaker: 'narrator',
  text,
  style: 'card',
  bg,
  ...(fx === undefined ? {} : { fx }),
});
/** Deniz'in iç sesi. */
export const th = (text: string): Line => ({ speaker: 'player', text, style: 'thought' });
/** Deniz'in kendi konuşması. */
export const me = (text: string): Line => ({ speaker: 'player', text });
/** Kadroda olmayan, adı bilinen biri (sprite yerine siluet). */
export const named = (name: string, text: string): Line => ({ speaker: 'narrator', name, text });
/** Kimliği gizli ses (telefon ya da fısıltı). */
export const voice = (name: string, text: string, style: 'phone' | 'whisper' = 'phone'): Line => ({
  speaker: 'narrator',
  name,
  text,
  style,
});
