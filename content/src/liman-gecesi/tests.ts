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

const PROLOG = (gulay: string, ceza: string, strateji: string) =>
  A(`
c PR00_DEVAM
c PR01_DEVAM
c PR02_DEVAM
c ${gulay}
c ${ceza}
c BR01B_DEVAM
c ${strateji}
c SABAH_DEVAM
`);

// --- Tam soruşturma (G1, TIPIK) ---

const GUN1 = A(`
c H_RIHTIM
t OB_BABA
t OB_PROJ
t OB_MARTI
t OB_KAFES
t OB_MATARA
c RIHTIM_BITIR
c H_ONRAPOR
e mag o1
e ruler o2
e mag o2
e mag o3
e mag o4
c ONRAPOR_BITIR
c H_CIKARIM
m clue_baba_kan clue_basit
m clue_desen clue_kontrkup
m clue_matara clue_kafes
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_IFADE
e mag i2
e compare i1
e mag i3
c IFADE_BITIR
c H_GORUS
c TP_GECE soft
c TP_ERCAN hard
c G_RESIM
c TP_YUMRUK soft
c TP_VARDIYA soft
c TP_EMRE soft
c G_BITIR
c AK1_A
`);

const GUN2 = A(`
c H_TELEFON
e mag t3
e compare t5
c TELEFON_BITIR
c H_LEYLA
c LEYLA_DON
c H_GULAY
c GL_SAAT
c GL_KART
c GL_EMRE
c GL_TEKLIF
c GL_DOGRU
c GL_BITIR
c H_DIL
c DIL_TURNIKE
c DIL_KANTIN
c DIL_GONDER
c AK2_B
`);

const GUN3 = A(`
c H_TURNIKE
e compare g2
e mag g4
c TURNIKE_BITIR
c H_SUKRU
c SK_GECE
c SK_KIM
c SK_KANTIN
c SK_EMRE
c SK_BITIR
c H_CIKARIM
m clue_mide clue_kantin
m clue_arama2341 clue_cikis
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_KENAN
c KN_GECE
c KN_ERCAN
c KN_TARIK
c KN_BITIR
c AK3_A
`);

const GUN4 = A(`
c H_BUFE
c NL_GECE
c NL_SAAT
c NL_POLIS
c NL_BAK
t OB_ZRAPOR
t OB_KAMERA
t OB_AKIS
c BUFE_BITIR
c H_BSAHA
t OB_SURUK
t OB_LASTIK
t OB_PAMUK
t OB_KANYOL
c BSAHA_BITIR
c H_CIKARIM
m clue_cikis clue_pos
m clue_nail clue_radyo
m clue_kenan_isik clue_projektor
m clue_surukleme clue_lastik
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_ORHAN
c OR_DERS
c OR_MIDE
c OR_ALET
c OR_BITIR
c GO_H1
c GECE_DEVAM
`);

const CELSE1 = A(`
c H100_DEVAM
c H101_DEVAM
c H102_A
c H102S_DEVAM
c H102Q_A
c H102Q_DEVAM
p S1
s clue_pil S1
p S2
s ded_kan S2
p S3
o g_kanaat S4
c H103_BITIR
c H104_A
c H104B_DEVAM
p K1
s ded_cikis K1
p K2
s ded_isik K2
p K3
o g_kanaat K3
p K4
s clue_servis_arac K4
c H105_BITIR
c TL_ATK
c TL_GPS
c TL_ABONE
c TL_BITIR
c H107_A
c H108_DEVAM
`);

const ARA_TAM = (suc: boolean) =>
  A(`
c ARA_GIRIS_DEVAM
c A_LEYLA
c LEYLA2_DON
c A_SEVIM
c SV_TAZIYE
c SV_HAFTA
c SV_TUTANAK
c SV_BITIR
c A_TARIK
c TR_SEMA
c TR_SONSOZ
c TR_GECE
c TR_BITIR
c AA1_A
c A_KAYIT
e mag a2
e compare z1
c KAYIT_BITIR
c A_CIKARIM
m clue_gps clue_zimmet
c ARA_CIKARIM_BITIR
c A_LEYLA
c LEYLA2_DON
c A_EMANET
t OB_KONI
t OB_MONT
c EMANET_BITIR
c AA2_B
c A_DEFTER
e mag d4
e compare d3
c DEFTER_BITIR
c A_CIKARIM
m clue_koni clue_desen
m clue_defter_satir clue_arama2341
${suc ? '' : 'm clue_mont clue_pamuk'}
c ARA_CIKARIM_BITIR
${suc ? 'c A_SUC\nc SUC_A' : ''}
c A_LEYLA
c LEYLA2_DON
c A_NURTEN
c NU_TWIST
c NU_KIT
c NU_BITIR
c A_CIKARIM
m clue_envanter clue_tarik_koni
c ARA_CIKARIM_BITIR
c GO_T2
c ARA_SON_DEVAM
`);

const CELSE2 = (esas: string) =>
  A(`
c T00_DEVAM
p B1
s ded_darbe B1
p B2
s ded_saat B2
p B3
s ded_silah B3
c T01_BITIR
p K5
s ded_arac K5
p K6
s ded_motif K6
p K7
s ded_eksik K7
o g_kanaat K8
c T02_BITIR
c T03_A
c T03G_DEVAM
c T04_A
c T05_A
c ${esas}
c T06S_DEVAM
c T07_A
`);

// --- Kısmi soruşturma (G3: 87/4 + tahrik) ---

const G3_SORUSTURMA = A(`
c H_RIHTIM
t OB_BABA
t OB_PROJ
t OB_KAFES
t OB_MARTI
t OB_KAYNAK
c RIHTIM_BITIR
c H_GORUS
c TP_GECE soft
c TP_ERCAN hard
c TP_YUMRUK soft
c TP_EMRE soft
c G_BITIR
c H_KENAN
c KN_GECE
c KN_TARIK
c KN_BITIR
c AK1_A
c H_GULAY
c GL_SAAT
c GL_KART
c GL_TEKLIF
c GL_DOGRU
c GL_BITIR
c H_SUKRU
c SK_GECE
c SK_KIM
c SK_EMRE
c SK_BITIR
c H_CIKARIM
m clue_kenan_isik clue_projektor
m clue_baba_kan clue_kafes
c CIKARIM_BITIR
c H_BUFE
c NL_GECE
c NL_SAAT
c NL_BITIR
c AK2_B
c H_LEYLA
c LEYLA_DON
c H_BSAHA
t OB_SURUK
t OB_KEDI
t OB_PALET
c BSAHA_BITIR
c H_GORUS2
c TP_DONUS soft
c TP_KENAN soft
c G_BITIR
c H_TELEFON
e mag t3
e mag t1
c TELEFON_BITIR
c AK3_A
c H_LEYLA
c LEYLA_DON
c GO_H1
c GECE_DEVAM
`);

const G3_CELSE1 = A(`
c H100_DEVAM
c H101_DEVAM
c H102_A
c H102S_DEVAM
c H102Q_A
c H102Q_DEVAM
p S1
s clue_pil S1
p S2
s ev_onrapor S2
c H103_BITIR
c H104_D
c H104B_DEVAM
p K1
s ev_hesap K1
p K2
s ded_isik K2
c H105_BITIR
c TL_ATK
c TL_KANTIN
c TL_BITIR
c H107_A
c H108_DEVAM
`);

const G3_ARA = A(`
c ARA_GIRIS_DEVAM
c A_TARIK
c TR_SONSOZ
c TR_SEMA
c TR_BITIR
c A_SEVIM
c SV_TAZIYE
c SV_HAFTA
c SV_AL
c SV_BITIR
c AA1_A
c A_LEYLA
c LEYLA2_DON
c A_EMANET
t OB_MONT
t OB_ETIKET
t OB_ELDIVEN
c EMANET_BITIR
c A_DEFTER
e compare d1
e mag d4
c DEFTER_BITIR
c AA2_B
c A_TALEP
c EK_ABONE
c EK_GONDER
c GO_T2
c ARA_SON_DEVAM
`);

const G3_CELSE2 = A(`
c T00_DEVAM
p B1
s ev_atk B1
p B2
s ev_kantin B2
p B3
c T01_BITIR
p K5
p K6
c T02_BITIR
c T03_A
c T03G_DEVAM
c T04_B
c T05_A
c T06_T
c T06S_DEVAM
c T07_A
`);

// --- Zayıf oyun (G4: mahkûmiyet) ---

const G4 = A(`
c H_RIHTIM
t OB_MARTI
t OB_KAYNAK
t OB_MATARA
t OB_KAFES
t OB_BABA
c RIHTIM_BITIR
c H_KENAN
c KN_GECE
c KN_ERCAN
c KN_TARIK
c KN_BITIR
c H_GORUS
c TP_GECE hard
c TP_VARDIYA soft
c TP_ERCAN soft
c TP_KENAN hard
c G_BITIR
c AK1_A
c H_SUKRU
c SK_GECE
c SK_KIM
c SK_TELKIN
c SK_BITIR
c H_ONRAPOR
e ruler o1
e ruler o4
e mag o5
e mag o6
c ONRAPOR_BITIR
c H_DIL
c DIL_KESIF
c DIL_HTS
c DIL_GONDER
c AK2_B
c H_BSAHA
t OB_KEDI
t OB_PALET
t OB_PAMUK
c BSAHA_BITIR
c H_TELEFON
e compare t1
e compare t2
e mag t6
c TELEFON_BITIR
c H_GULAY
c GL_EMRE
c GL_SAAT
c GL_TEKLIF
c GL_GEC
c GL_BITIR
c AK3_A
c H_LEYLA
c LEYLA_DON
c H_BUFE
c NL_GECE
c NL_POLIS
c NL_BITIR
c H_ORHAN
c OR_ALET
c OR_BITIR
c H_GORUS2
c TP_YUMRUK hard
c TP_DONUS soft
c G_BITIR
c GO_H1
c GECE_DEVAM
c H100_DEVAM
c H101_DEVAM
c H102_B
c H102S_DEVAM
c H102Q_C
c H102Q_DEVAM
p S1
p S2
p S3
c H103_BITIR
c H104_B
c H104B_DEVAM
p K1
p K2
p K3
p K4
c H105_BITIR
c TL_YAKALA
c TL_ATK
c TL_BITIR
c H107_C
c H108_DEVAM
c ARA_GIRIS_DEVAM
c A_SEVIM
c SV_ISRAR
c SV_BITIR
c A_TARIK
c TR_SONSOZ
c TR_BITIR
c AA1_A
c A_EMANET
t OB_ETIKET
t OB_ELDIVEN
t OB_MONT
c EMANET_BITIR
c A_LEYLA
c LEYLA2_DON
c GO_T2
c ARA_SON_DEVAM
c T00_DEVAM
p B1
p B2
p B3
c T01_BITIR
p K5
p K6
p K7
c T02_BITIR
c T03_B
c T03G_DEVAM
c T04_C
c T05_B
c T06_D
c T06S_DEVAM
c T07_C
`);

// --- Etik dalı (G5) ---

const G5_SORUSTURMA = A(`
c H_GULAY
c GL_SAAT
c GL_KART
c GL_TEKLIF
c GL_YALAN
c GL_BITIR
c H_RIHTIM
t OB_BABA
t OB_PROJ
t OB_KAFES
c RIHTIM_BITIR
c H_GORUS
c TP_GECE soft
c TP_ERCAN hard
c TP_YUMRUK soft
c TP_DONUS soft
c G_BITIR
c AK1_A
c H_ONRAPOR
e mag o1
e ruler o2
e mag o3
e mag o4
c ONRAPOR_BITIR
c H_TELEFON
e mag t3
c TELEFON_BITIR
c H_SUKRU
c SK_GECE
c SK_KIM
c SK_KANTIN
c SK_BITIR
c AK2_B
c H_CIKARIM
m clue_desen clue_kontrkup
m clue_mide clue_kantin
m clue_baba_kan clue_basit
c CIKARIM_BITIR
c H_KENAN
c KN_GECE
c KN_BITIR
c H_BUFE
c NL_GECE
c NL_SAAT
c NL_BAK
t OB_ZRAPOR
t OB_AKIS
c BUFE_BITIR
c H_DIL
c DIL_TURNIKE
c DIL_KANTIN
c DIL_GONDER
c AK3_A
c H_LEYLA
c LEYLA_DON
c H_BSAHA
t OB_SURUK
t OB_LASTIK
c BSAHA_BITIR
c H_CIKARIM
m clue_nail clue_radyo
m clue_kenan_isik clue_projektor
m clue_surukleme clue_lastik
c CIKARIM_BITIR
c GO_H1
c GECE_DEVAM
`);

const G5_CELSE1 = A(`
c H100_DEVAM
c H101_DEVAM
c H102_A
c H102S_DEVAM
c H102Q_A
c H102Q_DEVAM
p S1
s clue_pil S1
p S2
s ded_kan S2
c H103_BITIR
c H104_A
c H104B_DEVAM
p K1
s ev_hesap K1
p K2
s ded_isik K2
c H105_BITIR
c TL_ATK
c TL_ABONE
c TL_BITIR
c H107_A
c H108_DEVAM
c ARA_GIRIS_DEVAM
c A_SEVIM
c SV_TAZIYE
c SV_HAFTA
c SV_TUTANAK
c SV_BITIR
c A_TARIK
c TR_SEMA
c TR_GECE
c TR_BITIR
c AA1_A
c A_EMANET
t OB_KONI
t OB_MONT
c EMANET_BITIR
c A_CIKARIM
m clue_koni clue_desen
c ARA_CIKARIM_BITIR
c A_DEFTER
e mag d4
e compare d3
c DEFTER_BITIR
c AA2_B
c A_CIKARIM
m clue_defter_satir clue_arama2341
c ARA_CIKARIM_BITIR
c A_LEYLA
c LEYLA2_DON
c GO_T2
c ARA_SON_DEVAM
c T00_DEVAM
p B1
s ded_darbe B1
p B2
s ded_saat B2
p B3
s ded_silah B3
c T01_BITIR
p K6
s ded_motif K6
c T02_BITIR
c T03E_DEVAM
`);

// --- Çöküş (W) ---

const W_YOL = [
  ...G3_SORUSTURMA,
  ...G3_CELSE1,
  ...G3_ARA,
  ...A(`
c T00_DEVAM
s ev_twistlock B1
s ev_kenan_ifade B2
p B1
s ev_tarik_ifade B3
s clue_pil B1
s ev_hesap B2
`),
];

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        'G1',
        { outcome: 'BERAAT_B' },
        PROLOG('BR00_C', 'BR01_A', 'STR_MASUMIYET'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA_TAM(true),
        CELSE2('T06_B'),
      ),
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E' },
        PROLOG('BR00_C', 'BR01_A', 'STR_USUL'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA_TAM(false),
        CELSE2('T06_E'),
      ),
      goldenPath(
        'G3',
        { outcome: 'NITELIK' },
        PROLOG('BR00_A', 'BR01_D', 'STR_INDIRIM'),
        G3_SORUSTURMA,
        G3_CELSE1,
        G3_ARA,
        G3_CELSE2,
      ),
      goldenPath('G4', { outcome: 'MAHKUMIYET' }, PROLOG('BR00_B', 'BR01_B', 'STR_MASUMIYET'), G4),
      goldenPath('G5', { outcome: 'ETIK' }, PROLOG('BR00_A', 'BR01_A', 'STR_USUL'), G5_SORUSTURMA, G5_CELSE1),
      goldenPath('W', { outcome: 'MAHKUMIYET' }, PROLOG('BR00_B', 'BR01_C', 'STR_MASUMIYET'), W_YOL, A('c COKUS_SON')),
    ],
  },
};
