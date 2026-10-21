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
m clue_matara clue_kafes
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_RAPOR
c LEYLA_DON
c H_IFADE
e mag i2
e compare i1
e mag i3
c IFADE_BITIR
c H_GULAY
c GL_SAAT
c GL_KART
c GL_EMRE
c GL_TEKLIF
c GL_DOGRU
c GL_BITIR
c AK1_A
`);

const GUN2 = A(`
c H_GORUS
c TP_GECE soft
c TP_ERCAN hard
c G_RESIM
c TP_YUMRUK soft
c TP_DONUS soft
c TP_EMRE soft
c G_BITIR
c H_TELEFON
e mag t3
e compare t5
c TELEFON_BITIR
c H_LEYLA
c LEYLA_DON
c H_DIL
c DIL_TURNIKE
c DIL_KANTIN
c DIL_BAKIM
c DIL_GONDER
c AK2_B
`);

const GUN3 = A(`
c H_TURNIKE
e compare g2
e mag g4
c TURNIKE_BITIR
c H_BAKIM
e mag b2
c BAKIM_BITIR
c H_ORHAN
c OR_DERS
c OR_MIDE
c OR_ALET
c OR_BITIR
c H_CIKARIM
m clue_arama2341 clue_cikis
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_SUKRU
c SK_GECE
c SK_KIM
c SK_KANTIN
c SK_EMRE
c SK_BITIR
c AK3_A
`);

const GUN4 = A(`
c H_KENAN
c KN_GECE
c KN_ISIK
c KN_ERCAN
c KN_TARIK
c KN_BITIR
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
m clue_kenan_isik clue_enerji
m clue_surukleme clue_lastik
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c GO_H1
c GECE_DEVAM
`);

// Ters sıra: önce ışık (K2), sonra saat (K1); bilirkişide önce olay yeri (kan), sonra kırığın şekli (darbe).
const swapPair = (src: string, a: string, b: string): string => {
  const [x, y] = [src.indexOf(a), src.indexOf(b)];
  return src.slice(0, x) + b + src.slice(x + a.length, y) + a + src.slice(y + b.length);
};

const CELSE1_SRC = `
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
`;
const CELSE1 = A(CELSE1_SRC);
const CELSE1_TERS = A(swapPair(CELSE1_SRC, 'p K1\ns ded_cikis K1', 'p K2\ns ded_isik K2'));

// İlk celsede araç kaydı istenmez; ara evresinde ek talep dilekçesiyle istenir (EK_GPS).
const CELSE1_ARACSIZ = CELSE1.filter((a) => !('choiceId' in a && a.choiceId === 'TL_GPS'));

// Ek talep yolu: ilk gün dilekçe, araç kaydı ikinci gün gelir; savcı ziyareti yerine Sevim üçüncü güne kalır.
const ARA_EK = A(`
c ARA_GIRIS_DEVAM
c A_LEYLA
c LEYLA2_DON
c A_TALEP
c EK_GPS
c EK_GONDER
c A_ATK
e mag n3
e mag n4
c ATK_BITIR
c AA1_A
c A_ORHAN
c OT_KONTR
c OT_MIDE
c OT_KAYIT
c OT_BITIR
c A_CIKARIM
m clue_desen clue_kontrkup
m clue_mide clue_kantin
c ARA_CIKARIM_BITIR
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
c A_SEVIM
c SV_TAZIYE
c SV_ERCAN
c SV_HAFTA
c SV_TUTANAK
c SV_BITIR
c A_DEFTER
e mag d4
e compare d3
c DEFTER_BITIR
c A_CIKARIM
m clue_koni clue_desen
m clue_defter_satir clue_arama2341
m clue_mont clue_pamuk
c ARA_CIKARIM_BITIR
c A_LEYLA
c LEYLA2_DON
c GO_T2
c ARA_SON_DEVAM
`);

// Yüzleşme tuzağı (KY_SOR) ve savcıya asılların sunulması (SAV_ASIL); bilirkişiye kâğıt gösterilmez.
const ARA_YUZLESME = A(`
c ARA_GIRIS_DEVAM
c A_LEYLA
c LEYLA2_DON
c A_SEVIM
c SV_TAZIYE
c SV_ERCAN
c SV_HAFTA
c SV_TUTANAK
c SV_BITIR
c A_KENAN
c KY_SOR
c ARA_AKSAM1_DEVAM
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
m clue_defter_satir clue_arama2341
c ARA_CIKARIM_BITIR
c A_SUC
c SUC_A
c A_LEYLA
c LEYLA2_DON
c A_SAVCI
c SAV_ASIL
c SAV_BITIR
c GO_T2
c ARA_SON_DEVAM
`);

// G1 emanet yerine kolluk amirine gider (kitten eksik kilit → K7); TIPIK emanette koniyi ölçer (B3).
const NURTEN = `
c A_NURTEN
c NU_TWIST
c NU_KIT
c NU_BITIR
`;

const EMANET = `
c A_EMANET
t OB_KONI
t OB_MONT
c EMANET_BITIR
`;

const ARA_TAM = (suc: boolean) =>
  A(`
c ARA_GIRIS_DEVAM
c A_LEYLA
c LEYLA2_DON
c A_ATK
e mag n2
e mag n3
e mag n4
c ATK_BITIR
c A_ORHAN
c OT_KONTR
c OT_MIDE
c OT_KAYIT
c OT_BITIR
c A_SEVIM
c SV_TAZIYE
c SV_ERCAN
c SV_HAFTA
c SV_TUTANAK
c SV_BITIR
c AA1_A
c A_CIKARIM
m clue_desen clue_kontrkup
m clue_mide clue_kantin
c ARA_CIKARIM_BITIR
c A_KAYIT
e mag a2
e compare z1
c KAYIT_BITIR
c A_CIKARIM
m clue_gps clue_zimmet
c ARA_CIKARIM_BITIR
c A_LEYLA
c LEYLA2_DON
c A_TARIK
c TR_SEMA
c TR_SONSOZ
c TR_GECE
c TR_BITIR
c AA2_B
${suc ? NURTEN : EMANET}
c A_DEFTER
e mag d4
e compare d3
c DEFTER_BITIR
c A_CIKARIM
${suc ? 'm clue_envanter clue_tarik_koni' : 'm clue_koni clue_desen'}
m clue_defter_satir clue_arama2341
${suc ? '' : 'm clue_mont clue_pamuk'}
c ARA_CIKARIM_BITIR
${suc ? 'c A_SUC\nc SUC_A' : ''}
c A_LEYLA
c LEYLA2_DON
c GO_T2
c ARA_SON_DEVAM
`);

const BILIRKISI = (silah: boolean) => `
p B1
s ded_darbe B1
s ded_kan B1
p B5
s ded_tasima B5
p B2
s ded_saat B2
p B3
${silah ? 's ded_silah B3' : ''}
`;

const BILIRKISI_YOK = `
p B1
p B2
p B3
`;

const CELSE2 = (
  esas: string,
  devam: string,
  opts: { k7?: boolean; bilirkisi?: boolean; silah?: boolean; ters?: boolean } = {},
) =>
  A(`
c T00_DEVAM
${opts.bilirkisi === false ? BILIRKISI_YOK : opts.ters === true ? swapPair(BILIRKISI(opts.silah !== false), 's ded_darbe B1', 's ded_kan B1') : BILIRKISI(opts.silah !== false)}
c T01_BITIR
p K5
s ded_arac K5
p K6
s ded_motif K6
p K7
${opts.k7 === false ? '' : 's ded_eksik K7'}
p K8
o g_kanaat K8
c T02_BITIR
p N1
s ded_cikis N1
p N2
s ded_buf N2
p N3
p N4
c T03_BITIR
c T03G_DEVAM
c T04_A
c T05_A
c ${esas}
c ${devam}
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
c H_GULAY
c GL_SAAT
c GL_KART
c GL_TEKLIF
c GL_DOGRU
c GL_BITIR
c H_GORUS
c TP_GECE soft
c TP_ERCAN hard
c TP_YUMRUK soft
c TP_EMRE soft
c TP_DONUS soft
c G_BITIR
c AK1_A
c H_KENAN
c KN_GECE
c KN_ISIK
c KN_TARIK
c KN_BITIR
c H_DIL
c DIL_TURNIKE
c DIL_BAKIM
c DIL_KESIF
c DIL_GONDER
c H_SUKRU
c SK_GECE
c SK_KIM
c SK_EMRE
c SK_BITIR
c AK2_B
c H_LEYLA
c LEYLA_DON
c H_IFADE
e mag i3
e mag i2
c IFADE_BITIR
c H_BAKIM
e mag b1
e mag b2
c BAKIM_BITIR
c H_TURNIKE
e compare g2
e mag g4
c TURNIKE_BITIR
c H_BUFE
c NL_GECE
c NL_SAAT
c NL_BAK
t OB_ZRAPOR
t OB_AKIS
c BUFE_BITIR
c H_CIKARIM
m clue_cikis clue_pos
m clue_kenan_isik clue_enerji
m clue_baba_kan clue_kafes
c CIKARIM_BITIR
c H_TELEFON
e mag t3
e mag t1
c TELEFON_BITIR
c AK3_A
c H_LEYLA
c LEYLA_DON
c H_BSAHA
t OB_SURUK
t OB_LASTIK
t OB_KEDI
t OB_PALET
c BSAHA_BITIR
c H_ONRAPOR
e mag o1
e mag o4
c ONRAPOR_BITIR
c H_GORUS2
c TP_VARDIYA soft
c G_BITIR
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
s ded_cikis K1
p K2
s ded_isik K2
c H105_BITIR
c TL_ATK
c TL_KANTIN
c TL_GPS
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
c A_KAYIT
e compare a1
e mag a2
e compare z1
c KAYIT_BITIR
c AA2_B
c A_CIKARIM
m clue_gps clue_zimmet
c ARA_CIKARIM_BITIR
c A_TALEP
c EK_ABONE
c EK_GONDER
c A_SAVCI
c SAV_BITIR
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
s ded_arac K5
p K6
c T02_BITIR
p N1
s ev_hesap N1
o g_telkin N2
c T03_BITIR
c T03G_DEVAM
c T04_B
c T05_A
c T06_T
c T06ST_DEVAM
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
c H_GORUS2
c TP_YUMRUK hard
c TP_DONUS soft
c G_BITIR
c H_BUFE
c NL_GECE
c NL_POLIS
c NL_BITIR
c H_IFADE
e compare i4
e mag i1
c IFADE_BITIR
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
c A_SAVCI
c SAV_PAZAR
c SAV_BITIR
c AA2_A
c A_ATK
c ATK_BITIR
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
p N2
c T03_BITIR
c T03G_DEVAM
c T04_C
c T05_B
c T06_D
c T06SD_DEVAM
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
c SK_EMRE
c SK_BITIR
c AK2_B
c H_CIKARIM
m clue_baba_kan clue_basit
c CIKARIM_BITIR
c H_KENAN
c KN_GECE
c KN_ISIK
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
m clue_surukleme clue_lastik
c CIKARIM_BITIR
c H_TURNIKE
e compare g2
c TURNIKE_BITIR
c H_GORUS2
c TP_VARDIYA soft
c G_BITIR
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
s clue_projektor K2
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
c A_ATK
c ATK_BITIR
c A_SAVCI
c SAV_BITIR
c GO_T2
c ARA_SON_DEVAM
c T00_DEVAM
p B1
p B2
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
c T01_BITIR
p K5
s ded_arac K5
s ev_tarik_ifade K6
s clue_pil K6
s ev_hesap K7
`),
];

// --- Düşük skorlu gerçek fail (G1_AZ): olgular kayıtta, skor eski 10.000 eşiğinin altında; hüküm yine 223/2-b ---
// (skor hiçbir hükmü seçmez). Kısaltma sondasından (shrink) alınmış en kısa 223/2-b yolu.
const G1_AZ = A(`
c PR00_DEVAM
c PR01_DEVAM
c PR02_DEVAM
c BR00_C
c BR01_A
c BR01B_DEVAM
c STR_MASUMIYET
c SABAH_DEVAM
c H_RIHTIM
t OB_BABA
t OB_PROJ
c RIHTIM_BITIR
c H_ONRAPOR
e mag o1
e ruler o2
e mag o3
c ONRAPOR_BITIR
c H_CIKARIM
m clue_baba_kan clue_basit
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_RAPOR
c LEYLA_DON
c H_IFADE
e mag i3
c IFADE_BITIR
c H_GULAY
c GL_SAAT
c GL_KART
c GL_BITIR
c AK1_A
c H_GORUS
c TP_GECE soft
c TP_DONUS soft
c G_BITIR
c H_TELEFON
e mag t3
c TELEFON_BITIR
c H_DIL
c DIL_TURNIKE
c DIL_BAKIM
c DIL_GONDER
c AK2_B
c H_TURNIKE
e compare g2
e mag g4
c TURNIKE_BITIR
c H_BAKIM
e mag b2
c BAKIM_BITIR
c H_ORHAN
c OR_DERS
c OR_MIDE
c OR_BITIR
c H_SUKRU
c SK_BITIR
c AK3_A
c H_KENAN
c KN_GECE
c KN_ISIK
c KN_BITIR
c H_BUFE
c NL_GECE
c NL_SAAT
c NL_BAK
t OB_ZRAPOR
t OB_AKIS
c BUFE_BITIR
c H_BSAHA
t OB_SURUK
t OB_LASTIK
c BSAHA_BITIR
c H_CIKARIM
m clue_cikis clue_pos
m clue_nail clue_radyo
m clue_surukleme clue_lastik
m clue_kenan_isik clue_enerji
c CIKARIM_BITIR
c GO_H1
c GECE_DEVAM
c H100_DEVAM
c H101_DEVAM
c H102_A
c H102S_DEVAM
c H102Q_A
c H102Q_DEVAM
p S3
c H103_BITIR
c H104_A
c H104B_DEVAM
s ev_tarik_ifade K1
s ev_sukru_ifade K4
p K2
s ded_isik K2
c H105_BITIR
c TL_ATK
c TL_GPS
c TL_BITIR
c H107_A
c H108_DEVAM
c ARA_GIRIS_DEVAM
c A_ATK
e mag n3
e mag n4
c ATK_BITIR
c A_ORHAN
c OT_KONTR
c OT_MIDE
c OT_BITIR
c A_SEVIM
c SV_TAZIYE
c SV_HAFTA
c SV_TUTANAK
c SV_BITIR
c AA1_A
c A_CIKARIM
m clue_desen clue_kontrkup
m clue_mide clue_kantin
c ARA_CIKARIM_BITIR
c A_KAYIT
e mag a2
e compare z1
c KAYIT_BITIR
c A_CIKARIM
m clue_gps clue_zimmet
c ARA_CIKARIM_BITIR
c A_TARIK
c TR_BITIR
c AA2_B
c A_EMANET
t OB_KONI
c EMANET_BITIR
c A_DEFTER
e mag d4
c DEFTER_BITIR
c A_CIKARIM
m clue_koni clue_desen
m clue_defter_satir clue_arama2341
c ARA_CIKARIM_BITIR
c A_SUC
c SUC_A
c GO_T2
c ARA_SON_DEVAM
c T00_DEVAM
p B1
s ded_darbe B1
s ded_kan B1
p B5
s ded_tasima B5
p B2
s ded_saat B2
p B3
s ded_silah B3
c T01_BITIR
p K5
s ded_arac K5
s ded_motif K6
c T02_BITIR
p N1
s ded_cikis N1
p N2
s ded_buf N2
c T03_BITIR
c T03G_DEVAM
c T04_A
c T05_A
c T06_B
c T06SB_DEVAM
c T07_A
`);

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        'G1',
        { outcome: 'BERAAT_B', finalMin: 12490, finalMax: 13810 },
        PROLOG('BR00_C', 'BR01_A', 'STR_MASUMIYET'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA_TAM(true),
        CELSE2('T06_B', 'T06SB_DEVAM', { silah: false }),
      ),
      goldenPath('G1_AZ', { outcome: 'BERAAT_B', finalMax: 9990 }, G1_AZ),
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E', finalMin: 12190, finalMax: 13480 },
        PROLOG('BR00_C', 'BR01_A', 'STR_USUL'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA_TAM(false),
        CELSE2('T06_E', 'T06SE_DEVAM', { k7: false }),
      ),
      goldenPath(
        'G3',
        { outcome: 'NITELIK', finalMin: 5795, finalMax: 6405 },
        PROLOG('BR00_A', 'BR01_D', 'STR_INDIRIM'),
        G3_SORUSTURMA,
        G3_CELSE1,
        G3_ARA,
        G3_CELSE2,
      ),
      goldenPath(
        'G4',
        { outcome: 'MAHKUMIYET', finalMin: 138, finalMax: 152 },
        PROLOG('BR00_B', 'BR01_B', 'STR_MASUMIYET'),
        G4,
      ),
      goldenPath(
        'G5',
        { outcome: 'ETIK', finalMin: 5730, finalMax: 6330 },
        PROLOG('BR00_A', 'BR01_A', 'STR_USUL'),
        G5_SORUSTURMA,
        G5_CELSE1,
      ),
      // Olgu testleri: dönüş yok + ölüm sonra duruşma kaydındaysa esas savunmanın adı (E, T, D, X) beraati değiştirmez;
      // OLGU_EK araç kaydını ara evresinde ister; OLGU_B yüzleşme tuzağına düşer ve bilirkişiye kâğıt
      // gösterilmeden (ölüm sonra kurulmadan) gerçek fail savunması 223/2-b'ye ulaşamaz.
      goldenPath(
        'OLGU_D',
        { outcome: 'BERAAT_E' },
        PROLOG('BR00_C', 'BR01_A', 'STR_USUL'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA_TAM(false),
        CELSE2('T06_D', 'T06SD_DEVAM', { k7: false }),
      ),
      goldenPath(
        'OLGU_T',
        { outcome: 'BERAAT_E' },
        PROLOG('BR00_C', 'BR01_A', 'STR_INDIRIM'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1_TERS,
        ARA_TAM(false),
        CELSE2('T06_T', 'T06ST_DEVAM', { k7: false, ters: true }),
      ),
      goldenPath(
        'OLGU_X',
        { outcome: 'BERAAT_E' },
        PROLOG('BR00_C', 'BR01_A', 'STR_INDIRIM'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA_TAM(false),
        CELSE2('T06_X', 'T06SX_DEVAM', { k7: false }),
      ),
      goldenPath(
        'OLGU_EK',
        { outcome: 'BERAAT_E' },
        PROLOG('BR00_C', 'BR01_A', 'STR_USUL'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1_ARACSIZ,
        ARA_EK,
        CELSE2('T06_E', 'T06SE_DEVAM', { k7: false }),
      ),
      // Son öğün saati duruşmaya getirilmezse (kantin kaydı istenmedi, Şükrü Usta'ya kürsüde sorulmadı) bilirkişi
      // saati daraltmaz: CMK 217/1. Dönüş yok kayıtta olduğundan heyet 87/4'te kalır.
      goldenPath(
        'OLGU_KAYIT',
        { outcome: 'NITELIK' },
        PROLOG('BR00_C', 'BR01_A', 'STR_USUL'),
        GUN1,
        GUN2.filter((a) => !('choiceId' in a && a.choiceId === 'DIL_KANTIN')),
        GUN3,
        GUN4,
        CELSE1.filter((a) => !('statementId' in a && (a.statementId === 'S3' || a.statementId === 'S4'))),
        ARA_TAM(false),
        CELSE2('T06_E', 'T06SX_DEVAM', { k7: false }),
      ),
      goldenPath(
        'OLGU_B',
        { outcome: 'NITELIK' },
        PROLOG('BR00_C', 'BR01_A', 'STR_MASUMIYET'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA_YUZLESME,
        CELSE2('T06_B', 'T06SF_DEVAM', { bilirkisi: false, k7: false }),
      ),
      // Çöküş: savunma ikinci celsede düşer; dönüş yok ilk celsede kayda geçtiği için heyet 87/4'te kalır.
      goldenPath(
        'W',
        { outcome: 'NITELIK' },
        PROLOG('BR00_B', 'BR01_C', 'STR_MASUMIYET'),
        W_YOL,
        A('c COKUS_SON'),
      ),
    ],
  },
};
