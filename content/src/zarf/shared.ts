import { all, any, chapter, court, flag, has, not, phase, ref } from '../../../tools/content/src/kit/index.js';

// Dava genelinde paylaşılan tanımlar: bölüm etiketleri, soruşturma evreleri ve duruşma salonu.

export const PRO = chapter('Soğuk Açılış', 'DAVA #12 · SOĞUK AÇILIŞ');
export const BRIEF = chapter('Bölüm 1 · Dosya', 'DAVA #12 · DOSYA');
export const INV1 = chapter('Bölüm 2 · Soruşturma', 'DAVA #12 · SORUŞTURMA');
export const HEAR1 = chapter('Bölüm 3 · Birinci Celse', 'DURUŞMA · 1. CELSE');
export const ARA = chapter('Bölüm 4 · Ara', 'DAVA #12 · ARA');
export const TRIAL = chapter('Bölüm 5 · İkinci Celse', 'DURUŞMA · 2. CELSE');
export const VERDICT = chapter('Karar', 'DAVA #12 · HÜKÜM');

/** 1. evre: 1. celseden önce (3 gün × 4 eylem puanı; push / $return). */
export const p1 = phase({
  hub: 'INV1_HUB',
  dayEnd: 'INV1_DAY_END',
  trigger: 'tg_inv1_day',
  dayVar: 'day',
  apVar: 'ap',
  days: 3,
  ap: 4,
});

/** Ara evresi: iki celse arası (2 gün × 4 eylem puanı; yığınsız, doğrudan ARA_HUB'a dönüş). */
export const p2 = phase({
  hub: 'ARA_HUB',
  dayEnd: 'ARA_DAY_END',
  trigger: 'tg_ara_day',
  dayVar: 'ara_day',
  apVar: 'ara_ap',
  days: 2,
  ap: 4,
  dayLabel: 'Ara günü',
});

/** Ağır ceza heyeti: üye hâkim, başkan, cumhuriyet savcısı. */
const bench = [
  ['uye', 'ÜYE HÂKİM', 0.2],
  ['baskan', 'BAŞKAN', 0.5],
  ['savci', 'C. SAVCISI', 0.82],
] as const;

export const court1 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...HEAR1 });
export const court2 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...TRIAL });

/**
 * Gerçek fail kanıtlandı: kayıtlar ayıklandı, zarfın sanık odada yokken girdiği tutanakla gösterildi ve ya Sinan kürsüde
 * çözüldü (muhbirin "anlaştık" anlatısı da çökmüşken) ya da muhbir zarfı kime verdiğini söyledi ve bu, zarfın kaynağı ya
 * da çağrının tek masasıyla desteklendi. Müdafiin yönlendirdiği muhbirin beyanı (BAY_C) bu hesaba katılmaz.
 */
export const gercekProven = all(
  ref('kayit_disi'),
  ref('oda_bos'),
  any(
    all(flag('sinan_ifsa'), flag('contra_b2')),
    all(
      flag('bayram_ifsa'),
      not(flag('etki_bayram')),
      any(has('ded_tek_kisi'), has('ded_zarf_kaynagi')),
      ref('muhbir_coktu'),
    ),
  ),
);
