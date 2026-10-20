import { TYPICAL_PATH, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { Action, CasePart, Rect } from '../../../tools/content/src/kit/index.js';
import * as S from './scenes.js';

// 90-tests: her sonuç için golden path. Adımlar kısa yazımla: "c SEÇENEK [varyant]", "t OB_NESNE", "e alet satır",
// "m kart1 kart2", "p ifade", "s delil [ifade]", "o gerekçe [ifade]".

const RECTS: Record<string, Rect> = Object.fromEntries(
  Object.entries(S)
    .filter(([k]) => k.startsWith('OB_'))
    .map(([k, v]) => [k, (v as { rect: Rect }).rect]),
);

function A(src: string): Action[] {
  return src
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('//'))
    .map((l) => {
      const [k, a, b] = l.split(/\s+/);
      switch (k) {
        case 'c':
          return step.choose(a as string, b);
        case 't': {
          const r = RECTS[a as string];
          if (r === undefined) throw new Error(`Bilinmeyen nesne: ${a}`);
          return step.tapCenter(r);
        }
        case 'e':
          return step.examine(a as string, b as string);
        case 'm':
          return step.combine(a as string, b as string);
        case 'p':
          return step.press(a as string);
        case 's':
          return step.present(a as string, b);
        case 'o':
          return step.object(a as string, b);
        default:
          throw new Error(`Bilinmeyen adım: ${l}`);
      }
    });
}

const PROLOG = (zarf: string, strateji: string) =>
  A(`
c PR00_DEVAM
c PR01_DEVAM
c ${zarf}
c BR01_A
c BR01B_DEVAM
c ${strateji}
c SABAH_DEVAM
`);

const GUN1 = A(`
c H_112
e dinle c5
e compare c2
e mag c4
e dinle c1
c IHBAR_BITIR
c H_TESHIS
e compare f3
e mag tarif
e law tekrar
e mag f1
c TESHIS_BITIR
c H_CIKARIM
m clue_tarif_sonra clue_tek_tekrar
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_ARAMA
t OB_CAM
t OB_ASKI
t OB_MOTOR
c ARAMA_BITIR
c H_CIKARIM
m clue_bicak_yok clue_cam
c CIKARIM_BITIR
c H_GORUS
`);

const GORUSME = (withNote: boolean) =>
  A(`
${withNote ? 'c G_NOT' : ''}
c TP_GECE soft
c TP_ESKI soft
c TP_KULAK soft
c TP_AILE soft
c TP_ATES soft
c G_BITIR
`);

const GUN2 = A(`
c H_EV
t OB_ILAC
t OB_BALKON
t OB_AILE
t OB_VESIKALIK
c ARAMA2_BITIR
c H_CIKARIM
m clue_halka clue_kulak
m clue_eski_foto clue_vesikalik
c CIKARIM_BITIR
c H_T_KADIR
c KQ_SAAT
c KQ_SES
c KQ_GOZ
c KADIR_KARAR
c KD_BILDIR
c H_LEYLA
c LEYLA_DON
c H_ACIL
t OB_TRIYAJ
t OB_CIZELGE
c ARAMA3_BITIR
c H_DIL
c DIL_UEDAS
c DIL_GOZLEM
c DIL_VER
`);

const GUN3 = A(`
c H_UEDAS
e compare u2
e mag u4
e mag u1
c INV_UEDAS_BITIR
c H_CIKARIM
m clue_kadir clue_kesinti
c CIKARIM_BITIR
c H_T_GAMZE
c GQ_POLIS
c GQ_KORKU
c GAMZE_KARAR
c G_TANIK
c H_CIKARIM
m clue_gamze_beyan clue_foto_farkli
c CIKARIM_BITIR
c H_T_ALI
c AQ_TARIF
c AQ_POLIS
c AQ_ISRAR
c ALI_DOGRU
c H_LEYLA
c LEYLA_DON
c H_T_FERHAT
c FQ_LISTE
c FQ_ACIL
c FQ_BICAK
c FERHAT_BITIR
c H_DURUSMA
c GECE_DEVAM
`);

const CELSE1 = A(`
c H100K_A
c H100_DEVAM
c Q_ATES
c Q_BALKON
c Q_FOTO
c Q_KULAK
c Q_BITIR
c H102_A
p N1
p N2
s ev_ihbar N2
p N3
s ev_gozlem N3
p N4
s ev_teshis N4
o g_kanaat N4
s ded_eski_foto N1
s ev_ihbar N5
c H103K_DEVAM
c H104_A
c H104B_DEVAM
c H105_A
c H106_DEVAM
`);

const ARA1 = A(`
c ARA_GIRIS_DEVAM
c A_GPS
e compare g_cihaz
e mag g_durak
e mag g_oturum
e mag g_teslim
c GPS_BITIR
c A_TEL
e mag t1
e compare t3
e mag t2
e mag t4
c TEL_BITIR
c A_CIKARIM
m clue_cihaz clue_mesaj
m clue_186 clue_kesinti
c CIKARIM2_BITIR
c A_LEYLA
c LEYLA2_DON
c A_BARIS
c BQ_GPS
c BQ_HALKA
c BQ_NEDEN
c B_DOGRU
c ARA_AKSAM1_DEVAM
`);

const ARA2 = (derya: string | undefined) =>
  A(`
c A_SELFIE
e zoom s3
e compare s2
e compare s4
c SELFIE_BITIR
c A_CIKARIM
m clue_selfie clue_halka
c CIKARIM2_BITIR
c A_LEYLA
c LEYLA2_DON
c A_KEBAP
t OB_FIS
t OB_TEZGAH
t OB_PANO
c KEBAP_BITIR
${derya === undefined ? 'c A_KADIR\nc KA_DOGRU' : `c A_DERYA\nc ${derya}`}
c ARA_AKSAM2_DEVAM
`);

const CELSE2_TANIK = A(`
c T00_DEVAM
c T01_CIHAZ
c T01_SELFIE
c T01_186
c T01_BARIS
c T01_BITIR
p F1
s ded_usulsuz F1
p F3
s ev_teshis F3
p F4
s ev_sabika F4
p F5
s ded_halka F5
o g_kanaat F5
p F2
s ev_gozlem F2
c T02K_DEVAM
c T02R_DEVAM
`);

const KADIR_H2 = A(`
c KS_GOZ
c KS_ELEKTRIK
c KS_SES
c KS_SAAT
c KS_BITIR
c X_215
`);

const TIPIK_STEPS = [
  PROLOG('BR00_A', 'STR_USUL'),
  GUN1,
  GORUSME(true),
  A('c AK1_NERMIN'),
  GUN2,
  A('c ZARF_RED'),
  GUN3,
  CELSE1,
  ARA1,
  ARA2(undefined),
  A(`
c A_KARAR
c K_BILDIR
c BILDIR_DON
c A_DIL
c AD_CEMAL
c AD_VER
c A_LEYLA
c LEYLA2_DON
c A_DURUSMA
c ARA_SON_DEVAM
`),
  CELSE2_TANIK,
  KADIR_H2,
  A(`
c T04_DEVAM
c T04C_DEVAM
c T05_DEVAM
c P_KIRLENME
c P_MAZERET
c P_HESAP
c P_BITIR
c S_USUL
c L_SAAT
`),
];

export const tests: CasePart = {
  tests: {
    goldenPaths: [goldenPath(TYPICAL_PATH, { outcome: 'BERAAT_E' }, ...TIPIK_STEPS)],
  },
};
