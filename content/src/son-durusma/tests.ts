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

const PROLOG = (kemal: string, strateji: string) =>
  A(`
c PR00_DEVAM
c PR01_DEVAM
c ${kemal}
c BR01_A
c BR01B_DEVAM
c ${strateji}
c SABAH_DEVAM
`);

// --- Soruşturma parçaları ---

const IFADE = A(`
c H_IFADE
e compare r3
e compare r2
e mag r1
e mag r4
e compare r5
e law r6
c IFADE_BITIR
`);
const TEL = A(`
c H_TEL
e mag t1
e compare t3
e compare t2
e mag t4
e mag t5
c TEL_BITIR
`);
const OFIS = A(`
c H_OFIS
t OB_BICAK
t OB_ONLUK
t OB_BLOK
t OB_BEYAZ
t OB_DVR
c OFIS_BITIR
`);
const MUTFAK = A(`
c H_MUTFAK
t OB_TAHTA
t OB_ISTASYON
t OB_KASA
t OB_DOLAP
c MUTFAK_NURI
c NQ_CANTA
c NQ_EMIR
c NQ_KASA
c NQ_KAMERA
c NURI_TARIK
c TQ_KAMERA
c TARIK_BITIR
`);
const SULEYMAN = (karar: string) =>
  A(`
c H_SULEYMAN
c SQ_DUYDU
c SQ_SAAT
c SQ_GORDU
c SQ_KULAK
c SULEYMAN_KARAR
c ${karar}
`);
const GORUS = A(`
c H_GORUS
c TP_GECE soft
c TP_CANTA soft
c TP_MESAJ soft
c TP_DAVET soft
c TP_MEKTUP soft
c TP_BABA soft
c TP_ERCAN soft
c G_BITIR
`);
const EV = A(`
c H_EV
t OB_TAS
t OB_SAAT
t OB_SET
t OB_DIPLOMA
c EV_BITIR
`);
const HTS = A(`
c H_HTS
e compare h4
e mag h2
e mag h3
e mag h5
c HTS_BITIR
`);
const KEMAL = (karar: string) =>
  A(`
c H_KEMAL
c K_2004 soft
c K_ARAMA soft
c K_KAVGA soft
c K_SON
c ${karar}
`);
const LEYLA = A(`
c H_LEYLA
c LEYLA_DON
`);
const BOARD = (...pairs: string[]) =>
  A(`
c H_CIKARIM
${pairs.map((p) => `m ${p}`).join('\n')}
c CIKARIM_BITIR
`);

// --- 1. celse ---

const CELSE1 = (ek: string, tutukluluk = 'H105B_A') =>
  A(`
c GECE_DEVAM
c H100K_A
c H100_DEVAM
c Q_DAVET
c Q_CANTA
c Q_OTOBUS
c Q_MESAJ
c Q_BITIR
c H102_A
p S1
p S2
p S3
p S4
o g_kanaat S5
s ded_saat S2
s ded_onluk S4
c H103K_DEVAM
c H104_A
c ${ek}
c ${tutukluluk}
c H106_DEVAM
c H107_DEVAM
`);

// --- 2. celse ---

const CELSE2 = (t2: string, extra: string, el = 'c AQ_EL') =>
  A(`
c T200_DEVAM
c AQ_SAAT
${el}
c AQ_KAN
c AQ_BITIR
p T0
o g_duyum T0
s ded_davet T0
p T1
s ded_yol T1
p T2
s ${t2} T2
c T202K_DEVAM
p T3
s ded_kasa T3
p T4
s ded_kamera T4
p T5
${extra}
c T202_BITIR
c T202C_DEVAM
c L_SIR
c TH_A
c T205_DEVAM
c T206_DEVAM
`);

// --- Yollar ---

const TIPIK_STEPS = [
  PROLOG('BR00_A', 'STR_TASARLAMA'),
  IFADE,
  TEL,
  BOARD('clue_davet clue_dolandi'),
  LEYLA,
  OFIS,
  A('c AK1_EMIR'),
  BOARD('clue_onluk clue_tarik_bicak', 'clue_bicak_ofiste clue_tarik_bicak'),
  LEYLA,
  MUTFAK,
  SULEYMAN('SK_ANLAT'),
  GORUS,
  A('c AK2_KAPAT'),
  BOARD('clue_dolmus clue_tarik_saat', 'clue_mesaj_tam clue_kavga', 'clue_nisan clue_canta'),
  LEYLA,
  EV,
  HTS,
  A(`
c H_DIL
c DIL_KENT
c DIL_DVR
c DIL_Z
c DIL_VER
c H_DURUSMA
`),
  CELSE1('H105_YOK'),
  A(`
c ARA_GIRIS_DEVAM
c A_KENT
e compare k3
e mag k4
e mag k1
c KENT_BITIR
c A_Z
e compare z2
e mag z3
e mag z1
c Z_BITIR
c A_DVR
e compare d1
e mag d4
e mag d3
c DVR_BITIR
c A_CIKARIM
m clue_z clue_tarik_sayim
m clue_dvr clue_tarik_ariza
m clue_kent clue_dolmus
c ARA_CIKARIM_BITIR
c A_LEYLA
c ARA_LEYLA_DON
c A_CANSU
c CQ_ERKEN
c CQ_FOTO
c CQ_PERSEMBE
c CANSU_KARAR
c CK_TANIK
c AKS_RED
c A_CIKARIM
m clue_lacivert clue_beyaz
c ARA_CIKARIM_BITIR
c A_LEYLA
c ARA_LEYLA_DON
c A_DURAK
t OB_TABELA
t OB_CIZELGE
c DURAK_BITIR
c A_EMIR
c AE_UMUT
c A_GULAY
c GQ_TAZIYE
c GQ_MEKTUP
c GQ_TARIK
c GULAY_BITIR
c A_EMANET
e isik b2
e mag b4
e mag b1
c EMANET_BITIR
c A_CIKARIM
m clue_iz clue_mektup_kayip
c ARA_CIKARIM_BITIR
c A_DURUSMA
c TS_SUS
c ARA_SON_DEVAM
`),
  CELSE2('ded_bicak_yeri', 's ded_mektup T5\ns ded_gomlek T6'),
  A(`
c CR_SUS
c B_ARSIV
c AR_MAHKEME
c B_AILE
c AILE_DON
c B_DURUSMA
c ARA2_SON_DEVAM
c T300_DEVAM
p R1
s ded_gomlek R1
p R2
p R3
s ev_arsiv R3
p R4
s ded_mektup R4
c T301_BITIR
c T302_DEVAM
c P_SAAT
c P_TANIK
c P_TASARLAMA
c P_BITIR
c S_SUPHE
c L_MEKTUP
`),
];

const G1_STEPS = [
  PROLOG('BR00_A', 'STR_MASUMIYET'),
  IFADE,
  TEL,
  BOARD('clue_davet clue_dolandi'),
  LEYLA,
  OFIS,
  A('c AK1_EMIR'),
  BOARD('clue_onluk clue_tarik_bicak', 'clue_bicak_ofiste clue_tarik_bicak'),
  LEYLA,
  MUTFAK,
  SULEYMAN('SK_ANLAT'),
  HTS,
  A('c AK2_KAPAT'),
  BOARD('clue_dolmus clue_tarik_saat', 'clue_nisan clue_canta'),
  LEYLA,
  KEMAL('KS_KORU'),
  GORUS,
  BOARD('clue_mesaj_tam clue_kavga'),
  A(`
c H_DIL
c DIL_KENT
c DIL_DVR
c DIL_SESLI
c DIL_VER
c H_DURUSMA
`),
  CELSE1('H105_Z'),
  A(`
c ARA_GIRIS_DEVAM
c A_KENT
e compare k3
e mag k4
e mag k1
c KENT_BITIR
c A_Z
e compare z2
e mag z3
e mag z1
c Z_BITIR
c A_DVR
e compare d1
e mag d4
e mag d3
c DVR_BITIR
c A_SESLI
e compare s1
e mag s4
e mag s3
c SESLI_BITIR
c AKS_RED
c A_CIKARIM
m clue_z clue_tarik_sayim
m clue_dvr clue_tarik_ariza
m clue_kent clue_dolmus
m clue_sesli clue_kent
c ARA_CIKARIM_BITIR
c A_LEYLA
c ARA_LEYLA_DON
c A_CANSU
c CQ_ERKEN
c CQ_FOTO
c CQ_PERSEMBE
c CANSU_KARAR
c CK_TANIK
c A_GULAY
c GQ_TAZIYE
c GQ_MEKTUP
c GQ_TARIK
c GULAY_BITIR
c A_EMANET
e isik b2
e mag b4
e mag b1
c EMANET_BITIR
c A_EMIR
c AE_UMUT
c A_CIKARIM
m clue_lacivert clue_beyaz
m clue_iz clue_mektup_kayip
c ARA_CIKARIM_BITIR
c A_DURUSMA
c TS_SUS
c ARA_SON_DEVAM
`),
  CELSE2('ded_canli', 's ded_mektup T5\ns ded_gomlek T6', ''),
  A(`
c CR_NEDEN
c B_ARSIV
c AR_MAHKEME
c B_BILDIR
c BILDIR_DON
c B_DURUSMA
c ARA2_SON_DEVAM
c T300_DEVAM
p R1
s ded_gomlek R1
p R2
s ev_sesli R2
p R3
s ev_arsiv R3
c T301K_DEVAM
c T302_DEVAM
c P_SAAT
c P_CANLI
c P_FAIL
c P_BITIR
c S_MASUMIYET
c L_MEKTUP
`),
];

const win = (outcome: string, final: number) =>
  final < 0 ? { outcome, finalMax: 0 } : { outcome, finalMin: Math.floor(final * 0.95), finalMax: Math.ceil(final * 1.05) };
export const MEASURED = { G1: 12000, TIPIK: 10000 };

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath('G1', { outcome: 'BERAAT_B' }, ...G1_STEPS),
      goldenPath(TYPICAL_PATH, { outcome: 'BERAAT_E' }, ...TIPIK_STEPS),
    ],
  },
};
void win;
