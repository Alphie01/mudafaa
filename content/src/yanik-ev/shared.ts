import {
  chapter,
  cmp,
  court,
  dec,
  fallback,
  flag,
  ifThen,
  inc,
  not,
  phase,
  presentRule,
  score,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { Backdrop, ChoiceDef, Expression, Line, LineFx } from '@mudafaa/case-schema';

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

/**
 * Çapraz sorguda "önce tanığı beyanına bağla, sonra çeliştir": çelişkiyi kuran belge, ifade bastırılmadan (tanık kendi
 * cümlesini açmadan) sunulursa tanık kaçacak bir kapı bulur; çelişki kayda geçmez ama ceza da yoktur. Tam kural aynı
 * ifade ve delil için önce gelir ve `pressFlag` ister.
 */
export const erkenSunum = (
  id: string,
  statementId: string,
  evidence: readonly string[],
  pressFlag: string,
  witnessLine: Line,
) =>
  presentRule(id, statementId, evidence, {
    enabledWhen: not(flag(pressFlag)),
    score: { SORGULAMA: 40 },
    quality: {
      q: 'NEUTRAL',
      feedback:
        'Doğru belge, erken an. Önce tanığı kendi cümlesine bağla: ifadeyi bastır, cevabını al; sonra belgeyi göster. Sorulmadan gösterilen belge, tanığa bir açıklama kapısı bırakır.',
      category: 'SORGULAMA',
    },
    responses: [
      {
        lines: [
          witnessLine,
          {
            speaker: 'player',
            style: 'thought',
            text: 'Kâğıt doğruydu, an yanlış. Önce ona kendi cümlesini sormalıydım; neye karşı gösterdiğimi bilmeyen tanık kâğıdın etrafından dolaşır.',
          },
        ],
      },
    ],
  });

/** Tahtanın günlük yanlış bağlantı hakkı (her tahta için ayrı; gün sonunda yenilenir). */
export const TAHTA_HAK = 3;

/**
 * Çıkarım tahtasında yanlış çift: −50 skor ve günlük hakkından bir eksilme. Hak bitince tahta o gün için bulanıklaşır:
 * tarifler kilitlenir (`tahtaKilit`), yeni çiftler bir şey söylemez, hub kartı ertesi güne kadar kapanır. Rastgele denemenin
 * bedeli böylece skordan oyuna geçer: son günde kilitlenen tahta, celseye eksik delille gitmek demektir.
 */
export const tahtaIska = (id: string, hak: string): ChoiceDef =>
  fallback(id, 'COMBINE', {
    repeat: 'ONCE_PER_PARAMS',
    effects: [ifThen(cmp(v(hak), '>', 0), [dec(hak), score('DELIL_ANALIZI', -50)])],
    responses: [
      {
        when: cmp(v(hak), '<=', 0),
        lines: [
          {
            speaker: 'player',
            style: 'thought',
            text: 'Kartlar birbirine karıştı. Bugün bu tahtadan bir şey çıkmaz; yarın taze bir gözle bakmalıyım.',
          },
        ],
      },
    ],
    feedback: {
      title: 'Bu ikisi birbirini açıklamıyor',
      text: 'Yan yana duruyorlar ama aynı cümleyi kurmuyorlar. Her yanlış çift günlük bağlantı hakkından birini götürür; hak bitince tahta ertesi güne kadar kapanır.',
      label: 'BAĞLANTI YOK · −50 SKOR · −1 HAK',
      tone: 'error',
    },
  });

/** Tarifleri günlük hakka bağlar: hak bitince doğru çift de o gün kurulamaz. */
export const tahtaKilit = (hak: string, recipes: readonly ChoiceDef[]): ChoiceDef[] =>
  recipes.map((r) => ({ ...r, enabledWhen: cmp(v(hak), '>', 0) }));
