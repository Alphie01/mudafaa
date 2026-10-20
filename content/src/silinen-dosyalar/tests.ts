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

export const MEASURED = { G1: 13470, TIPIK: 13230, G3: 6810, G5: 6120, G4: 1415, ETIK: 8760, W: 9100 };

const win = (outcome: string, final: number) =>
  final < 0 ? { outcome, finalMax: 0 } : { outcome, finalMin: Math.floor(final * 0.9), finalMax: Math.ceil(final * 1.1) };

const PROLOG = (ucret: string, strateji: string) =>
  A(`
c PR00_DEVAM
c PR01_DEVAM
c ${ucret}
c BR01_A
c BR01B_DEVAM
c ${strateji}
c SABAH_DEVAM
`);

// INV gün 1: belgeler + ev + görüşme + tahta
const INV_G1 = A(`
c H_LOG
e mag l1
e mag l2
e law l4
e compare l3
e mag l5
c LOG_BITIR
c H_IMAJ
e mag k1
e compare k3
e mag k4
e law k5
c IMAJ_BITIR
c H_EMN
e compare e4
e mag e2
e law e1
e mag e5
c EMN_BITIR
c H_EV
t OB_CEKMECE
t OB_MASA
t OB_MODEM
t OB_RESIM
c ARAMA2_BITIR
c H_DEVIR
e mag d4
e law d6
e compare d3
e compare d5
c DEVIR_BITIR
c H_CIKARIM
m ev_eposta clue_2130
m clue_imaj_tarih clue_kurtarma
m clue_emn_yok clue_gsm
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_GORUS
c G_RESIM
c TP_GECE soft
c TP_DEVIR soft
c TP_2130 soft
c TP_IZIN soft
c G_BITIR
c AK1_INSAN
`);

// INV gün 2: sahneler + tanıklar + ikinci görüşme + dilekçe
const INV_G2 = A(`
c H_ARAMA
t OB_YEDEK
t OB_YUVA
t OB_OKUYUCU
t OB_KLIMA
c ARAMA_BITIR
c H_KAPI
t OB_DEFTER
t OB_TURNIKE
t OB_PARK
c ARAMA3_BITIR
c H_CIKARIM
m clue_son_yedek clue_bos_yuva
c CIKARIM_BITIR
c H_T_YASAR
c YQ_GECE
c YQ_SELIM
c YQ_KORKU
c YASAR_KARAR
c YD_BILDIR
c H_T_HAKAN
c HQ_IMAJ
c HQ_DIZUSTU
c HAKAN_BITIR
c H_GORUS2
c TP_CIKIS soft
c TP_YEDEK soft
c TP_KIM soft
c G_BITIR
c H_DIL
c DIL_TAM
c DIL_BILIRKISI
c DIL_KART
c DIL_VER
c NA_KANAL
`);

// INV gün 3: ham kayıt + Bülent + duruşmaya
const INV_G3 = A(`
c H_TAM
e compare t2
e mag t4
e mag t1
c INV_TAM_BITIR
c H_T_BULENT
c BQ_IMAJ
c BQ_KURTARMA
c BQ_TARIK
c BULENT_BITIR
c H_CIKARIM
m clue_cihaz_adi clue_emn_cihaz
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_DURUSMA
c GECE_DEVAM
`);

// 1. celse (USUL yolu)
const CELSE1 = A(`
c H100K_A
c H100_DEVAM
c Q_2130
c Q_IZIN
c Q_DEVIR
c Q_BITIR
c H102_A
p B1
p B2
p B3
p B4
p B5
s ev_imaj_rapor B1
s ev_imaj_rapor B2
s ev_devir B4
s ev_emniyet B5
o g_kanaat B6
s ev_imaj_rapor B3
c H103K_DEVAM
c H104_A
c R_KART
c R_OPR
c R_ZEYIL
c R_BITIR
c H105B_DEVAM
c H106_DEVAM
`);

// Ara evresi (BERAAT_B: savcılığa bildir). Ara: 3 gün × 4 EP; frees 4. paid act'ten önce.
const ARA1 = A(`
c ARA_GIRIS_DEVAM
c A_SEMA
e compare s2
e mag s4
e mag s5
e compare s1
c ARA_SEMA_BITIR
c A_TURNIKE
e mag p2
e compare p4
e compare p5
c ARA_TURN_BITIR
c A_CIKARIM
m clue_turnike_gm clue_bos_yuva
m clue_sema_cihaz clue_zimmet
c ARA_CIKARIM_BITIR
c A_LEYLA
c ARA_LEYLA_DON
c A_OPR
e mag o3
e mag o4
e mag o2
c ARA_OPR_BITIR
c A_ZEYIL
e mag z2
e law z3
e mag z4
c ARA_ZEY_BITIR
c ARA_AKSAM1_DEVAM
`);

const ARA2 = A(`
c A_EKSPER
t OB_DAMGA
t OB_ZDEFTER
t OB_RAF
c ARA_EKS_BITIR
c A_CIKARIM
m clue_hat_gm clue_gsm
m clue_limit clue_teminat
m clue_eksper clue_ziyaretci
c ARA_CIKARIM_BITIR
c A_NALAN
c NQ_POLICE
c NQ_GM
c NQ_KANAL
c NALAN_BITIR
c A_HAKAN
c HA_DISK
c HAKAN2_BITIR
c A_DIL
c AD_TANIK
c AD_VER
c ARA_AKSAM2_DEVAM
`);

const ARA3 = (karar: string) =>
  A(`
c A_SELIM
c SQ_CIHAZ
c SQ_YEDEK
c SQ_SON
c SELIM_BITIR
c ST_RED
c A_KARAR
c ${karar}
${karar === 'K_BILDIR' ? 'c ARA_KB_DON' : ''}
c A_YASAR
c YA_DOGRU
c A_DURUSMA
c ARA_SON_DEVAM
`);

// 2. celse: dayanaklar + savunma + son söz, kapanışı parametrik.
const CELSE2_HEAD = A(`
c T00_DEVAM
c T01_SEMA
p S1
p S2
p S3
p S4
s ev_tam_log S3
s ev_turnike S4
c T01S_BITIR
c X_S_CEVAP
p T1
p T4
p T2
p T3
s ev_turnike T1
s ev_zeyil T4
s ev_eposta T2
s ded_yedek T3
s ev_turnike T5
c T02K_DEVAM
p Y1
p Y2
s ev_turnike Y1
c T03_BITIR
c X_ITIRAZ
p NL1
p NL2
p NL3
p NL4
s ev_zeyil NL1
s ded_once_sigorta NL4
c T04_BITIR
c T05_DEVAM
c P_RIZA
c P_CIHAZ
c P_MOTIF
c P_BITIR
`);

const CELSE2_FULL = (savunma: string, sonSoz: string) => [...CELSE2_HEAD, ...A(`c ${savunma}\nc ${sonSoz}`)];

// BERAAT_B: tam yol, savcılığa bildir, güçlü masumiyet savunması
const G1_STEPS = [
  PROLOG('BR00_A', 'STR_MASUMIYET'),
  INV_G1,
  INV_G2,
  INV_G3,
  CELSE1,
  ARA1,
  ARA2,
  ARA3('K_BILDIR'),
  CELSE2_FULL('S_MASUMIYET', 'L_HAFIZA'),
];

// TIPIK = BERAAT_E: aynı soruşturma, ama savcılığa bildirmez (bekler); usul savunması
const TIPIK_STEPS = [
  PROLOG('BR00_A', 'STR_USUL'),
  INV_G1,
  INV_G2,
  INV_G3,
  CELSE1,
  ARA1,
  ARA2,
  ARA3('K_BEKLE'),
  CELSE2_FULL('S_USUL', 'L_HAFIZA'),
];

// NITELENDIRME: özenli ama eksik soruşturma. İmaj çürütülür ve bilirkişi dinlenir (244 düşer); ama e-posta bulunmaz,
// devir tutanağının hesap-açık maddesi okunmaz, rıza hiçbir yerde kurulmaz → 243/1 kalır (adli para, HAGB).
const G3_STEPS = [
  PROLOG('BR00_C', 'STR_INDIRIM'),
  A(`
c H_LOG
e mag l1
e mag l2
e law l4
e compare l3
c LOG_BITIR
c H_IMAJ
e mag k1
e compare k3
e mag k4
e law k5
c IMAJ_BITIR
c H_EMN
e mag e2
e law e1
c EMN_BITIR
c H_EV
t OB_MASA
t OB_RESIM
c ARAMA2_BITIR
c H_DEVIR
e mag d4
e compare d3
c DEVIR_BITIR
c H_CIKARIM
m clue_imaj_tarih clue_kurtarma
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_GORUS
c TP_GECE soft
c TP_DEVIR soft
c TP_2130 soft
c G_BITIR
c AK1_KIMSE
`),
  A(`
c H_ARAMA
t OB_YEDEK
t OB_KLIMA
t OB_TUP
c ARAMA_BITIR
c H_KAPI
t OB_DEFTER
t OB_PARK
t OB_SERVIS
c ARAMA3_BITIR
c H_T_YASAR
c YQ_GECE
c YQ_SELIM
c YQ_KORKU
c YASAR_KARAR
c YD_BILDIR
c H_T_HAKAN
c HQ_IMAJ
c HQ_DIZUSTU
c HAKAN_BITIR
c H_DIL
c DIL_BILIRKISI
c DIL_KART
c DIL_VER
c H_GORUS2
c TP_CIKIS soft
c TP_KIM soft
c G_BITIR
c NA_DINLE
`),
  A(`
c H_T_BULENT
c BQ_IMAJ
c BQ_KURTARMA
c BQ_TARIK
c BULENT_BITIR
c H_LEYLA
c LEYLA_DON
c H_DURUSMA
c GECE_DEVAM
`),
  A(`
c H100K_A
c H100_DEVAM
c Q_2130
c Q_DEVIR
c Q_BITIR
c H102_A
p B1
p B2
p B3
s ev_imaj_rapor B1
s ev_imaj_rapor B2
s ev_imaj_rapor B3
c H103K_DEVAM
c H104_A
c R_ZEYIL
c R_BITIR
c H105B_DEVAM
c H106_DEVAM
`),
  A(`
c ARA_GIRIS_DEVAM
c A_SEMA
e mag s4
e mag s5
e compare s1
c ARA_SEMA_BITIR
c A_LEYLA
c ARA_LEYLA_DON
c A_HAKAN
c HA_DISK
c HAKAN2_BITIR
c A_YASAR
c YA_DOGRU
c A_ZEYIL
e mag z2
e law z3
e mag z4
c ARA_ZEY_BITIR
c ARA_AKSAM1_DEVAM
c A_EKSPER
t OB_DAMGA
t OB_ZDEFTER
t OB_KAHVE
c ARA_EKS_BITIR
c A_CIKARIM
m clue_limit clue_teminat
m clue_eksper clue_ziyaretci
c ARA_CIKARIM_BITIR
c A_NALAN
c NQ_POLICE
c NQ_KANAL
c NALAN_BITIR
c A_SELIM
c SQ_SON
c SELIM_BITIR
c A_DIL
c AD_TANIK
c AD_VER
c ARA_AKSAM2_DEVAM
c A_DURUSMA
c ARA_SON_DEVAM
`),
  A(`
c T00_DEVAM
c T01_SEMA
p S1
p S2
p S3
p S4
c T01S_BITIR
c X_S_CEVAP
p T1
p T2
p T4
s ev_zeyil T4
c T02_BITIR
p Y1
p Y2
c T03_BITIR
c X_ITIRAZ
p NL1
p NL2
p NL3
p NL4
s ev_zeyil NL1
s ded_once_sigorta NL4
c T04_BITIR
c T05_DEVAM
c P_IMAJ
c P_MOTIF
c P_BITIR
c S_TERDIT
c L_HAFIZA
`),
];

// KISMI: rıza kurulur (e-posta + 21.30); ama imajın çatlakları tahtada ve kürsüde birleştirilmez, bilirkişi istenmez,
// cihaz/hat kimliği kurulmaz → 243/1’den beraat (2-a), 244/2’den mahkûmiyet (ertelenmiş).
const G5_STEPS = [
  PROLOG('BR00_C', 'STR_INDIRIM'),
  A(`
c H_LOG
e mag l1
e mag l2
e law l4
e compare l3
c LOG_BITIR
c H_IMAJ
e mag k1
e compare k3
e mag k4
e law k5
c IMAJ_BITIR
c H_EMN
e mag e2
e law e1
c EMN_BITIR
c H_EV
t OB_CEKMECE
t OB_MASA
t OB_RESIM
c ARAMA2_BITIR
c H_DEVIR
e mag d4
e law d6
e compare d3
c DEVIR_BITIR
c H_CIKARIM
m ev_eposta clue_2130
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_GORUS
c TP_GECE soft
c TP_DEVIR soft
c TP_2130 soft
c TP_IZIN soft
c G_BITIR
c AK1_KIMSE
`),
  A(`
c H_ARAMA
t OB_YEDEK
t OB_KLIMA
t OB_TUP
c ARAMA_BITIR
c H_KAPI
t OB_DEFTER
t OB_PARK
t OB_SERVIS
c ARAMA3_BITIR
c H_T_YASAR
c YQ_GECE
c YQ_SELIM
c YQ_KORKU
c YASAR_KARAR
c YD_BILDIR
c H_T_HAKAN
c HQ_IMAJ
c HQ_DIZUSTU
c HAKAN_BITIR
c H_DIL
c DIL_BILIRKISI
c DIL_KART
c DIL_VER
c H_GORUS2
c TP_CIKIS soft
c TP_KIM soft
c G_BITIR
c NA_DINLE
`),
  A(`
c H_T_BULENT
c BQ_IMAJ
c BQ_KURTARMA
c BQ_TARIK
c BULENT_BITIR
c H_LEYLA
c LEYLA_DON
c H_DURUSMA
c GECE_DEVAM
`),
  A(`
c H100K_A
c H100_DEVAM
c Q_2130
c Q_IZIN
c Q_DEVIR
c Q_BITIR
c H102_C
p B1
p B2
p B3
s ev_imaj_rapor B1
c H103_BITIR
c H104_A
c R_ZEYIL
c R_BITIR
c H105B_DEVAM
c H106_DEVAM
`),
  A(`
c ARA_GIRIS_DEVAM
c A_LEYLA
c ARA_LEYLA_DON
c A_HAKAN
c HA_DISK
c HAKAN2_BITIR
c A_YASAR
c YA_DOGRU
c A_ZEYIL
e mag z2
e law z3
e mag z4
c ARA_ZEY_BITIR
c A_EKSPER
t OB_DAMGA
t OB_ZDEFTER
t OB_KAHVE
c ARA_EKS_BITIR
c ARA_AKSAM1_DEVAM
c A_CIKARIM
m clue_limit clue_teminat
m clue_eksper clue_ziyaretci
c ARA_CIKARIM_BITIR
c A_NALAN
c NQ_POLICE
c NQ_KANAL
c NALAN_BITIR
c A_SELIM
c SQ_SON
c SELIM_BITIR
c A_DIL
c AD_TANIK
c AD_VER
c A_DURUSMA
c ARA_SON_DEVAM
`),
  A(`
c T00_DEVAM
c T01_KABUL
c T01_BITIR
p T1
p T2
p T4
s ev_eposta T2
s ev_zeyil T4
c T02_BITIR
p Y1
p Y2
c T03_BITIR
c X_ITIRAZ
p NL1
p NL2
p NL3
p NL4
s ev_zeyil NL1
s ded_once_sigorta NL4
c T04_BITIR
c T05_DEVAM
c P_RIZA
c P_MOTIF
c P_BITIR
c S_TERDIT
c L_HAFIZA
`),
];

// MAHKUMIYET: soruşturma dağınık; e-posta bulunmaz, rıza hiçbir yerde kurulmaz. Karşı tarafın genel müdürü ziyaret edilir,
// duruşmada uzman raporu bilirkişi raporu gibi kabul edilir; zayıf savunma.
const G4_STEPS = [
  PROLOG('BR00_B', 'STR_INDIRIM'),
  A(`
c H_LOG
e mag l1
e mag l2
c LOG_BITIR
c H_IMAJ
e mag k1
e law k5
c IMAJ_BITIR
c H_EV
t OB_MODEM
t OB_RESIM
t OB_SAAT
c ARAMA2_BITIR
c H_T_TARIK
c TQ_SIFRE
c TQ_YEDEK
c TQ_SIGORTA
c TARIK_BITIR
c H_EMN
e mag e2
e law e1
c EMN_BITIR
c H_GORUS
c TP_GECE soft
c TP_DEVIR soft
c TP_KIM soft
c G_BITIR
c AK1_MAKINE
`),
  A(`
c H_ARAMA
t OB_KLIMA
t OB_TUP
t OB_OKUYUCU
c ARAMA_BITIR
c H_KAPI
t OB_PARK
t OB_SERVIS
t OB_TURNIKE
t OB_DEFTER
c ARAMA3_BITIR
c H_T_YASAR
c YQ_GECE
c YQ_SELIM
c YQ_KORKU
c YASAR_KARAR
c YD_BILDIR
c H_T_HAKAN
c HQ_IMAJ
c HAKAN_BITIR
c H_DIL
c DIL_EPOSTA
c DIL_KESIF
c DIL_VER
c H_LEYLA
c LEYLA_DON
c H_T_BULENT
c BQ_IMAJ
c BULENT_BITIR
c NA_ISIM
`),
  A(`
c H_GORUS2
c TP_CIKIS soft
c G_BITIR
c H_DURUSMA
c GECE_DEVAM
c H100K_B
c H100_DEVAM
c Q_KIN
c Q_SIFRE
c Q_BITIR
c H102_C
p B1
p B2
c H103_BITIR
c H104_B
c R_HEPSI
c R_BITIR
c H105B_DEVAM
c H106_DEVAM
`),
  A(`
c ARA_GIRIS_DEVAM
c A_HAKAN
c HAKAN2_BITIR
c A_SELIM
c SQ_SON
c SELIM_BITIR
c A_NALAN
c NQ_POLICE
c NQ_GM
c NALAN_BITIR
c A_YASAR
c YA_DOGRU
c ARA_AKSAM1_DEVAM
c A_LEYLA
c ARA_LEYLA_DON
c A_DIL
c AD_TANIK
c AD_VER
c A_DURUSMA
c ARA_SON_DEVAM
`),
  A(`
c T00_DEVAM
c T01_KABUL
c T01_BITIR
p T1
p T2
p T3
c T02_BITIR
p Y1
p Y2
c T03_BITIR
c X_CEVAP
c T05_DEVAM
c P_IMAJ
c P_YEDEK
c P_MOTIF
c P_BITIR
c S_DUYGU
c L_SESSIZ
`),
];

// ETIK: ara evresinde müvekkile izinsiz giriş yaptır
const ETIK_STEPS = [
  PROLOG('BR00_A', 'STR_MASUMIYET'),
  INV_G1,
  INV_G2,
  INV_G3,
  CELSE1,
  ARA1,
  A(`
c A_SELIM
c SQ_CIHAZ
c SQ_SON
c SELIM_BITIR
c ST_KABUL
c A_DURUSMA
c ARA_SON_DEVAM
`),
  A(`
c T00_ETIK
c TETIK_DEVAM
`),
];

// W (çöküş → COKUS): tipik yolun soruşturması ve ara evresi; ikinci celsede genel müdüre art arda yanlış belge sunulur,
// ♥0 → müvekkil vekâleti sona erdirir, duruşma ertelenir (ara karar).
const W_STEPS = [
  PROLOG('BR00_A', 'STR_USUL'),
  INV_G1,
  INV_G2,
  INV_G3,
  CELSE1,
  ARA1,
  ARA2,
  ARA3('K_BEKLE'),
  A(`
c T00_DEVAM
c T01_SEMA
c T01S_BITIR
c X_S_CEVAP
s ev_sikayet T1
s ev_sikayet T1
s ev_sikayet T1
s ev_sikayet T1
s ev_sikayet T1
c COKUS_DEVAM
`),
];

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath('G1', win('BERAAT_B', MEASURED.G1), ...G1_STEPS),
      goldenPath(TYPICAL_PATH, win('BERAAT_E', MEASURED.TIPIK), ...TIPIK_STEPS),
      goldenPath('G3', win('NITELENDIRME', MEASURED.G3), ...G3_STEPS),
      goldenPath('G5', win('KISMI', MEASURED.G5), ...G5_STEPS),
      goldenPath('G4', win('MAHKUMIYET', MEASURED.G4), ...G4_STEPS),
      goldenPath('ETIK', win('ETIK', MEASURED.ETIK), ...ETIK_STEPS),
      goldenPath('W', win('COKUS', MEASURED.W), ...W_STEPS),
    ],
  },
};
