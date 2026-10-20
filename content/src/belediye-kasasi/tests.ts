import { TYPICAL_PATH, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { Action, CasePart, Rect } from '../../../tools/content/src/kit/index.js';
import * as S from './scenes.js';

// 99-tests: her sonuç için golden path. Adımlar kısa yazımla: "c SEÇENEK [varyant]", "t OB_NESNE", "e alet satır",
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

// --- Ortak parçalar ---

const PROLOG = (soz: string, strateji: string, ceza = 'BR01_A') =>
  A(`
c PR00_DEVAM
c PR01_DEVAM
c ${soz}
c BR00B_DEVAM
c ${ceza}
c BR01B_DEVAM
c ${strateji}
c SABAH_DEVAM
`);

const LOG = A(`
c H_LOG
e vz r21
e mesai r27
e mag r09
e mag rtop
e mag r12
c LOG_BITIR
`);

const VEZNE = A(`
c H_VEZNE
t OB_YONERGE
t OB_VZ02
t OB_ONODA
t OB_TUSTAKIMI
t OB_TURNIKE
t OB_POSTIT
t OB_KAMERA
c VEZNE_BITIR
`);

const EV = A(`
c H_EV
t OB_DEFTER
t OB_KARBON
t OB_PDKS
t OB_KLASOR
t OB_TAPU
t OB_RANDEVU
t OB_SATRANC
c EV_BITIR
c EV_SON_DON
`);

const GORUS1 = A(`
c H_GORUS
c TP_AKSAM soft
c TP_KREDI soft
c TP_SIFRE soft
c TP_ERCAN soft
c TP_14OCAK soft
c TP_TESLIM soft
c G_BITIR
`);

const PDKS = A(`
c H_PDKS
e log pozet
e mag p09
e log p12
c PDKS_BITIR
`);

const TUTANAK = A(`
c H_TUTANAK
e compare t_tutar
e mag t_rapor
e uv t_eden
e mag t_alan
c TUT_BITIR
`);

const BANKA = A(`
c H_BANKA
e mag b_kredi
e tapu b_havale
e mag b_eczane
c BANKA_BITIR
`);

const HAYRI = A(`
c H_T_HAYRI
c HQ_ODEME
c HQ_VEZNEDAR
c HQ_ERTESI
c HAYRI_BITIR
`);

const ERCAN = A(`
c H_T_ERCAN
c EQ_SISTEM
c EQ_TESLIM
c EQ_ZARF
c EQ_ORHAN
c ERCAN_BITIR
`);

const MELEK = A(`
c H_T_MELEK
c MQ_ORHAN
c MQ_ZARF
c MQ_AMIR
c MQ_BITIR
`);

const GORUS2 = A(`
c H_GORUS2
c TP_9OCAK soft
c TP_MELEK soft
c G_BITIR
`);

const DIL3 = A(`
c H_DIL
c DIL_KASA
c DIL_PDKS
c DIL_TICKET
c DIL_VER
`);

/** Tam soruşturma (3 gün × 4 EP). */
const SORUSTURMA = [
  LOG,
  VEZNE,
  EV,
  A(`
c H_CIKARIM
m clue_yonerge ev_talimat
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
`),
  GORUS1,
  A('c AK1_SAAT'),
  PDKS,
  TUTANAK,
  A(`
c H_CIKARIM
m clue_terminal clue_cikis
m clue_saat clue_izin
m clue_defter clue_tutar_fark
m clue_imza_kopya clue_basim
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
`),
  BANKA,
  A(`
c H_CIKARIM
m clue_kredi clue_tapu
c CIKARIM_BITIR
`),
  HAYRI,
  A('c AK2N_A'),
  ERCAN,
  MELEK,
  A(`
c H_LEYLA
c LEYLA_DON
`),
  GORUS2,
  DIL3,
  A(`
c H_DURUSMA
c GECE_DEVAM
`),
];

const CELSE1 = A(`
c H1K_A
c H100_DEVAM
c H101_A
c H101S_DEVAM
c Q_CIKIS
c Q_DEFTER
c Q_9OCAK
c Q_TESLIM
c Q_KREDI
c Q_BITIR
c H102_A
c H103_A
p E1
p E2
p E3
p E4
s ded_baskasi E2
s ev_talimat E3
s ded_baskasi E4
s ded_teslim E1
s ded_kredi E5
o g_kanaat E5
c H104_BITIR
c H104K_DEVAM
c H105_BITIR
c H1ARA_DEVAM
c H106_DEVAM
c H107_DEVAM
`);

const ARA_GUN1 = A(`
c ARA_GIRIS_DEVAM
c A_KASA
e log k_1202
e mag k_01
e mag k_sabah
c KASA_BITIR
c A_PDKS2
e log d_ercan
e log d_melek
e log d_selim
c PDKS2_BITIR
c A_CIKARIM
m clue_kod02 clue_ercan_cikis
c ARA_CIKARIM_BITIR
c A_LEYLA
c ARA_LEYLA_DON
c A_MELEK
c MK_A
c A_EV
c EV_A
c OT_A
`);

const BURAK = A(`
c A_BURAK
c BK_KIM
c BK_YEDEK
c BK_A
`);

const TICKET = A(`
c A_TICKET
e mag tk1
e log tk2
e mag tk5
c TICKET_BITIR
`);

const KESIF = A(`
c A_KESIF
t OB_PC03
t OB_TUS
t OB_TAKVIM
t OB_YAZICI
t OB_CEKMECE
c KESIF_BITIR
`);

const ARA_GUN2 = [
  BURAK,
  TICKET,
  KESIF,
  A(`
c A_LEYLA
c ARA_LEYLA_DON
c A_HAYRI
c HY_TANIK
c A_DURUSMA
c ARA_SON_DEVAM
`),
];

const BILIRKISI = A(`
c T00_DEVAM
c BQ_TERM
c BQ_ONAY
c BQ_PC03
c BQ_YAZICI
c BQ_BITIR
`);

const MELEK_H2 = A(`
p M1
p M2
p M3
s ev_pdks M3
s ev_pdks_mud M4
c T02_BITIR
`);

const KAPANIS_E = A(`
c T04_A
c T05_DEVAM
c P_BASKASI
c P_ZILYET
c P_KASA
c P_BITIR
c S_MASUMIYET
c L_HESAP
`);

const TIPIK = goldenPath(
  TYPICAL_PATH,
  { outcome: 'BERAAT_E' },
  PROLOG('BR00_A', 'STR_MASUMIYET'),
  SORUSTURMA,
  CELSE1,
  ARA_GUN1,
  ARA_GUN2,
  BILIRKISI,
  A('c T01H_DEVAM'),
  MELEK_H2,
  A(`
c T03_DEVAM
p R1
p R2
p R3
s ev_pdks_mud R1
s ev_kasa R2
s ev_ticket R3
s ded_sahte_tutanak R4
c T03T_BITIR
`),
  KAPANIS_E,
);

export const tests: CasePart = {
  tests: {
    goldenPaths: [TIPIK],
  },
};
