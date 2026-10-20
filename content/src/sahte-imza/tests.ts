import { TYPICAL_PATH, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { Action, CasePart, Shape } from '../../../tools/content/src/kit/index.js';
import * as SC from './scenes.js';

// 99-tests: her sonuç için golden path. Adımlar kısa yazımla: "c SEÇENEK [varyant]", "t OB_NESNE", "e alet satır",
// "m kart1 kart2", "p ifade", "s delil [ifade]", "o gerekçe [ifade]".

const SHAPES: Record<string, Shape> = Object.fromEntries(
  Object.entries(SC).filter(([k]) => k.startsWith('OB_')) as [string, Shape][],
);

export function A(src: string): Action[] {
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
          const r = SHAPES[a as string];
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

const PROLOG = (soz: string, strateji: string) =>
  A(`
c PR00_DEVAM
c PR01_DEVAM
c ${soz}
c BR00L_DEVAM
c BR01_A
c BR01B_A
c ${strateji}
c SABAH_DEVAM
`);

const GUN1 = A(`
c H_SENET
e mag imza
e mag zaman
e compare foto
e compare bedel
c SENET_BITIR
c H_MATBAA
t OB_LISTE
t OB_YAZICI
t OB_TAKVIM
t OB_MAKAS
t OB_ASKI
t OB_KLASOR
c ARAMA_M_BITIR
c H_LEYLA
c LEYLA_DON
c H_VEDAT
c TV_KIMLIK soft
c TV_EL soft
c TV_TAKVIM soft
c TV_MESAJ soft
c TV_ANNE hard
c TV_BORC soft
c GV_BITIR
c AK1_EL
`);

const GUN2 = A(`
c H_CIKARIM
m clue_sivanma clue_sag_el
m clue_ceket clue_mesaj
m clue_takvim clue_senet_saat
c CIKARIM_BITIR
c H_SURET
e mag muhur
e uv kagit
e compare yetki2
c SURET_BITIR
c H_NOTER
c BQ_ARSIV
c BQ_KAGIT
c BQ_SURET
c NOTER_BITIR
c H_LEYLA
c LEYLA_DON
c H_CIKARIM
m clue_toner_muhur clue_noter_arsiv
m clue_yazici clue_toner_muhur
c CIKARIM_BITIR
c H_TARIK
c TQ_GUN
c TQ_ODA
c TQ_POLIS
c TQ_AMCA
c TARIK_BITIR
c AK2S_DINLE
`);

const GUN3 = A(`
c H_RAPOR
e law mukayese
e mag tutanak
e compare sonuc
c RAPOR_BITIR
c H_IRSALIYE
e compare i2
e mag i1
c IRSALIYE_BITIR
c H_LEYLA
c LEYLA_DON
c H_CIKARIM
m clue_mukayese_ozel clue_iki_el
c CIKARIM_BITIR
c H_EMRE
c EQ_SABAH
c EQ_GECE_SOFT
c EQ_DUKKAN
c EMRE_BITIR
c AK3_SAKLA
`);

const GUN4 = A(`
c H_DIL
c DIL_BILIRKISI
c DIL_KARGO
c DIL_TUTANAK
c DIL_VER
c H_HISAR
c FQ_ARAC
c FQ_HAYRIYE
c FQ_EV
t OB_DOSYA
t OB_AILE
t OB_RUHSAT
t OB_DEFTER
c ARAMA_H_BITIR
c H_LEYLA
c LEYLA_DON
c H_HUZUR
c HQ_ESLIK
c HAYRIYE_BITIR
c H_DURUSMA
c GECE_DEVAM
`);

const CELSE1 = A(`
c C100K_A
c C100_DEVAM
c C101_DEVAM
c Q_KIMLIK
c Q_EL
c Q_KURYE
c Q_ANNE
c Q_BITIR
c C103_A
c C103N_A
p G1
s ded_kimlik G1
p G2
s ded_suret_sahte G2
p G3
s ded_solak G3B
c C104K_DEVAM
p G4
s ev_senet G4
o g_salon G4
p G5
o g_kanaat G5
c C104_BITIR
c C105_A
c T_RANDEVU
c T_BITIR
c CAY_KAYIT
`);

// Çöküş yolu: bilirkişi talebi yok (dilekçede ve kürsüde); Adli Tıp raporu dosyaya girmez.
const GUN4_NB = A(`
c H_DIL
c DIL_KARGO
c DIL_TUTANAK
c DIL_VER
c H_HISAR
c FQ_ARAC
c FQ_HAYRIYE
c FQ_EV
t OB_DOSYA
t OB_AILE
t OB_RUHSAT
t OB_DEFTER
c ARAMA_H_BITIR
c H_LEYLA
c LEYLA_DON
c H_HUZUR
c HQ_ESLIK
c HAYRIYE_BITIR
c H_DURUSMA
c GECE_DEVAM
`);

const CELSE1_NB = A(`
c C100K_A
c C100_DEVAM
c C101_DEVAM
c Q_KIMLIK
c Q_EL
c Q_KURYE
c Q_ANNE
c Q_BITIR
c C103_A
c C103N_A
p G1
s ded_kimlik G1
p G2
s ded_suret_sahte G2
p G3
s ded_solak G3B
c C104K_DEVAM
p G4
s ev_senet G4
o g_salon G4
p G5
o g_kanaat G5
c C104_BITIR
c C105_C
c T_RANDEVU
c T_BITIR
c CAY_KAYIT
`);

const ARA1 = A(`
c ARA_GIRIS_DEVAM
c A_KARGO
e mag varis
e compare imza
c KARGO_BITIR
c A_RANDEVU
e mag arayan
e mag teyit
c RANDEVU_BITIR
c A_TUTANAK
c TUTANAK_DON
c A_CIKARIM
m clue_kargo_saat clue_senet_saat
m clue_randevu_no clue_tel_liste
m clue_kargo_imza clue_iki_el
c CIKARIM2_BITIR
c A_LEYLA
c LEYLA2_DON
c A_SINAN
c SQ_SABAH
c SQ_TANIK
c SQ_IMZA
c SINAN_BITIR
c AA1_DURUST
`);

const ARA2_E = A(`
c A_EMRE
c MQ_SOLAK
c MQ_GECE
c EMRE2_BITIR
c A_LEYLA
c LEYLA2_DON
c A_SEVGI
c VQ_SIR
c VQ_VEDAT
c VQ_KARAR
c SEVGI_BITIR
c A_TANIK
c TN_SINAN
c TANIK_VER
c AA2_DEVAM
c A_NERMIN
c NQ2_SURET
c NQ2_TARIK
c NERMIN2_BITIR
c A_HAYRIYE
c HQ2_ESLIK
c HAYRIYE2_BITIR
c A_TARIK
c TG_GIT
c A_DURUSMA
c ARA_SON_DEVAM
`);

const CELSE2_E = A(`
c C200_DEVAM
c C201_A
p E1
s ded_randevu E1B
s ev_rapor2 E2
p E2
p E3
p E4
s ded_mazeret E4
o g_kanaat E5
c C202_BITIR
c C203C_A
s ded_mukayese T1
s ev_tutanak T2
s ded_randevu T3
c C203_BITIR
c C203H_DEVAM
c TENEFFUS_DEVAM
c C204A_A
c C205A_DEVAM
c ARG_RAPOR
c ARG_SOLAK
c ARG_MAZERET
c ARG_TAMAM
c C206_M
c C207_A
`);

const CELSE1_UK = A(`
c C100K_A
c C100_DEVAM
c C101_DEVAM
c Q_KIMLIK
c Q_EL
c Q_KURYE
c Q_ANNE
c Q_BITIR
c C103_A
c C103N_A
p G1
s ded_kimlik G1
p G2
s ded_suret_sahte G2
p G4
s ev_senet G4
c C104_BITIR
c C105_A
c T_RANDEVU
c T_BITIR
c CAY_KAYIT
`);

// Üst kurul: Adli Tıp raporu dosyada; ama ikinci celsede hiçbir çelişki kürsüye taşınmıyor, savunma dağınık.
const CELSE2_UK = A(`
c C200_DEVAM
c C201_B
p E1
p E2
p E3
p E4
c C202_BITIR
c C203C_B
p T1
p T4
p T5
c C203_BITIR
c TENEFFUS_DEVAM
c C204A_B
c C205B_DEVAM
c ARG_KIMLIK
c ARG_SURET
c ARG_IYI
c ARG_TAMAM
c C206_T
c C207_B
`);

const ARA2_B = A(`
c A_EMRE
c MQ_SOLAK
c MQ_GECE
c EMRE2_BITIR
c A_LEYLA
c LEYLA2_DON
c A_SEVGI
c VQ_SIR
c VQ_VEDAT
c VQ_KARAR
c SEVGI_BITIR
c A_TANIK
c TN_SINAN
c TN_TARIK
c TANIK_VER
c AA2_DEVAM
c A_EROL
c EROLG_DEVAM
t OB_MASATAKVIM
t OB_KARBON
c EROL2_BITIR
c A_CIKARIM
m clue_mahsup clue_bahis
c CIKARIM2_BITIR
c A_SUC
c SUC_SOMUT
c A_TARIK
c TG_GIT
c A_DURUSMA
c ARA_SON_DEVAM
`);

const CELSE2_B = A(`
c C200_DEVAM
c C201_A
p E1
s ded_randevu E1B
s ev_rapor2 E2
p E3
s ded_borc E3
c C202K_DEVAM
s ded_mazeret E4
o g_kanaat E5
c C202_BITIR
c C203C_A
s ded_mukayese T1
s ev_tutanak T2
s ded_randevu T3
s ev_rapor2_ek T5
c C203_BITIR
c C203H_DEVAM
c TENEFFUS_DEVAM
c C204A_A
c C205A_DEVAM
c ARG_RAPOR
c ARG_SOLAK
c ARG_FAIL
c ARG_TAMAM
c C206_M
c C207_A
`);

const ARA2_ETIK = A(`
c A_EMRE
c MQ_SOLAK
c MQ_YALAN
c EMRE2_BITIR
c A_LEYLA
c LEYLA2_DON
c A_SEVGI
c VQ_SIR
c VQ_VEDAT
c SEVGI_BITIR
c A_TANIK
c TN_SINAN
c TN_EMRE
c TANIK_VER
c AA2_DEVAM
c A_NERMIN
c NQ2_SURET
c NERMIN2_BITIR
c A_HAYRIYE
c HQ2_ESLIK
c HAYRIYE2_BITIR
c A_DURUSMA
c ARA_SON_DEVAM
c C200_DEVAM
c CE_DEVAM
`);

const CELSE2_COKUS = A(`
c C200_DEVAM
c C201_A
p E1
s ded_kimlik E1
s ded_kimlik E2
s ded_kimlik E3
s ded_kurye E1
s ded_kurye E2
c COKUS_DEVAM
`);

// İndirim: rapor ve irsaliye okunmadan, bilirkişi talebi olmadan; tapu memurunun sol el beyanı ve kurye kaydı var.
const IND_INV = A(`
c H_SENET
e mag imza
e mag zaman
c SENET_BITIR
c H_MATBAA
t OB_LISTE
t OB_YAZICI
t OB_TAKVIM
t OB_KASE
t OB_DIZGI
t OB_ASKI
c ARAMA_M_BITIR
c H_LEYLA
c LEYLA_DON
c H_VEDAT
c TV_SABAH soft
c TV_KIMLIK hard
c TV_EL soft
c TV_ANNE soft
c TV_IRSALIYE soft
c GV_BITIR
c AK1_AD
c H_CIKARIM
m clue_sivanma clue_sag_el
m clue_tel_liste clue_aski
c CIKARIM_BITIR
c H_EROL
c RQ_PAZARLIK
c RQ_BEDEL
c RQ_TAPU
c EROL_BITIR
c H_NERMIN
c NQ_VEKALET
c NQ_EMLAK
c NERMIN_BITIR
c H_LEYLA
c LEYLA_DON
c H_TAPU
c PQ_KAMERA
c PQ_RANDEVU
c PQ_GULTEN
c TAPU_BITIR
c AK2_UNUT
c H_SURET
e mag muhur
e uv kagit
c SURET_BITIR
c H_HISAR
c FQ_ARAC
c FQ_EV
t OB_DOSYA
t OB_KILIT
c ARAMA_H_BITIR
c H_LEYLA
c LEYLA_DON
c H_TARIK
c TQ_GUN
c TQ_HALA
c TARIK_BITIR
c AK3_SAKLA
c H_DIL
c DIL_KARGO
c DIL_RANDEVU
c DIL_BANKA
c DIL_VER
c H_HUZUR
c HQ_FOTO
c HAYRIYE_BITIR
c H_LEYLA
c LEYLA_DON
c H_EMRE
c EQ_SABAH
c EQ_GECE_HARD
c EMRE_BITIR
c H_DURUSMA
c GECE_DEVAM
`);

const IND_C1 = A(`
c C100K_B
c C100_DEVAM
c C101_DEVAM
c Q_EL
c Q_ANNE
c Q_BITIR
c C103_D
c C103N_C
p G1
p G2
p G3
s ded_solak G3B
c C104K_DEVAM
c C104_BITIR
c C105_C
c T_BITIR
c CAY_INSAN
`);

const IND_ARA = A(`
c ARA_GIRIS_DEVAM
c A_KARGO
e mag varis
c KARGO_BITIR
c A_RANDEVU
e mag arayan
c RANDEVU_BITIR
c A_LEYLA
c LEYLA2_DON
c A_SEVGI
c VQ_SIR
c VQ_VEDAT
c SEVGI_BITIR
c AA1_SOZ
c A_CIKARIM
m clue_kargo_saat clue_senet_saat
m clue_randevu_no clue_tel_liste
c CIKARIM2_BITIR
c A_EMRE
c MQ_OZUR
c MQ_SOLAK
c EMRE2_BITIR
c A_NERMIN
c NERMIN2_BITIR
c A_LEYLA
c LEYLA2_DON
c A_HAYRIYE
c HQ2_ESLIK
c HAYRIYE2_BITIR
c AA2_DEVAM
c A_SINAN
c SQ_SABAH
c SQ_TANIK
c SINAN_BITIR
c A_TANIK
c TN_SINAN
c TN_TARIK
c TANIK_VER
c A_TARIK
c TG_YUZLES
c A_DURUSMA
c ARA_SON_DEVAM
`);

const IND_C2 = A(`
c C200_DEVAM
c C201_A
p E1
s ded_mazeret E4
c C202_BITIR
c C203C_B
s ded_randevu T3X
c C203_BITIR
c TENEFFUS_DEVAM
c C204B_B
c C205B_DEVAM
c ARG_SOLAK
c ARG_MAZERET
c ARG_IYI
c ARG_TAMAM
c C206_T
c C207_B
`);

// Mahkûmiyet: yanlış sorular, etik hatalar, kâğıtlara bakmayan bir soruşturma.
const MAH_INV = A(`
c H_HUZUR
c HQ_IFADE
c HAYRIYE_BITIR
c H_EROL
c RQ_PAZARLIK
c RQ_BEDEL
c RQ_TAPU
c EROL_BITIR
c H_NERMIN
c NQ_SEBEP
c NQ_GERI
c NERMINX_BITIR
c AK1_HIC
c H_TAPU
c PQ_KAMERA
c PQ_GULTEN
c TAPU_BITIR
c H_HISAR
c FQ_ARAC
c FQ_HAYRIYE
c FQ_EV
t OB_CUMBA
t OB_KILIT
t OB_AILE
t OB_RUHSAT
c ARAMA_H_BITIR
c H_CIKARIM
m clue_aile_foto clue_ruhsat
m clue_doblo clue_ruhsat
m clue_aile_foto clue_doblo
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_EMRE
c EQ_SABAH
c EQ_DUKKAN
c EMRE_BITIR
c AK2_EROL
c H_LEYLA
c LEYLA_DON
c H_SENET
e compare bedel
e compare zaman
e compare satici
e compare alici
c SENET_BITIR
c H_MATBAA
t OB_DIZGI
t OB_KASE
t OB_ASKI
t OB_LISTE
c ARAMA_M_BITIR
c H_CIKARIM
m clue_kase clue_aski
m clue_tel_liste clue_kase
c CIKARIM_BITIR
c H_TARIK
c TQ_HALA
c TQ_ODA
c TQ_AMCA
c TQ_GUN
c TARIK_BITIR
c AK3_ANLAT
c H_DIL
c DIL_HTS
c DIL_HAYRIYE
c DIL_BANKA
c DIL_VER
c H_LEYLA
c LEYLA_DON
c H_SURET
e compare muhur
e uv baslik
e mag taraf
c SURET_BITIR
c H_VEDAT
c TV_SABAH hard
c TV_KIMLIK hard
c TV_ANNE hard
c TV_IRSALIYE hard
c TV_BORC hard
c GV_BITIR
c H_DURUSMA
c GECE_DEVAM
`);

const MAH_C1 = A(`
c C100K_B
c C100_DEVAM
c C101_DEVAM
c Q_ANNE
c Q_BITIR
c C103_C
c C103N_B
p G1
p G2
p G3
p G4
p G5
c C104_BITIR
c C105_D
c T_TUTUK
c T_BITIR
c CAY_INSAN
`);

const MAH_ARA = A(`
c ARA_GIRIS_DEVAM
c A_SEVGI
c VQ_SIR
c VQ_VEDAT
c SEVGI_BITIR
c A_EMRE
c EMRE2_BITIR
c A_NERMIN
c NERMIN2_BITIR
c AA1_SOZ
c A_HAYRIYE
c HQ2_ESLIK
c HAYRIYE2_BITIR
c A_LEYLA
c LEYLA2_DON
c A_TANIK
c TN_EMRE
c TN_HAYRIYE
c TANIK_VER
c A_CIKARIM
m clue_doblo clue_ruhsat
c CIKARIM2_BITIR
c A_DURUSMA
c ARA_SON_DEVAM
`);

const MAH_C2 = A(`
c C200_DEVAM
p E1
p E1B
p E2
p E3
p E4
p E5
c C202_BITIR
c TENEFFUS_DEVAM
c C204B_C
c C205C_DEVAM
c ARG_NERMIN
c ARG_IYI
c ARG_TAMAM
c C206_I
c C207_B
`);


// Bilirkişi talebi olmadan beraat (C204B_A): kirli mukayese + sol el + mazeret; yeni Adli Tıp raporu yok, CMK 223/2-e.
const CELSE2_NB = A(`
c C200_DEVAM
c C201_A
p E1
s ded_randevu E1B
p E2
p E3
p E4
s ded_mazeret E4
o g_kanaat E5
c C202_BITIR
c C203C_A
s ded_mukayese T1
s ev_tutanak T2
s ded_randevu T3
c C203_BITIR
c C203H_DEVAM
c TENEFFUS_DEVAM
c C204B_A
c C205A_DEVAM
c ARG_SOLAK
c ARG_MAZERET
c ARG_TAMAM
c C206_M
c C207_A
`);

// Mahkûmiyet, gerekçesiz bilirkişi talebiyle: Adli Tıp kesin kanaat bildirmez (C105_A2, C204B_D).
const MAH_INV_B = A(`
c H_HUZUR
c HQ_IFADE
c HAYRIYE_BITIR
c H_EROL
c RQ_PAZARLIK
c RQ_BEDEL
c RQ_TAPU
c EROL_BITIR
c H_NERMIN
c NQ_SEBEP
c NQ_GERI
c NERMINX_BITIR
c AK1_HIC
c H_TAPU
c PQ_KAMERA
c PQ_GULTEN
c TAPU_BITIR
c H_HISAR
c FQ_ARAC
c FQ_HAYRIYE
c FQ_EV
t OB_CUMBA
t OB_KILIT
t OB_AILE
t OB_RUHSAT
c ARAMA_H_BITIR
c H_CIKARIM
m clue_aile_foto clue_ruhsat
m clue_doblo clue_ruhsat
m clue_aile_foto clue_doblo
c CIKARIM_BITIR
c H_LEYLA
c LEYLA_DON
c H_EMRE
c EQ_SABAH
c EQ_DUKKAN
c EMRE_BITIR
c AK2_EROL
c H_LEYLA
c LEYLA_DON
c H_SENET
e compare bedel
e compare zaman
e compare satici
e compare alici
c SENET_BITIR
c H_MATBAA
t OB_DIZGI
t OB_KASE
t OB_ASKI
t OB_LISTE
c ARAMA_M_BITIR
c H_CIKARIM
m clue_kase clue_aski
m clue_tel_liste clue_kase
c CIKARIM_BITIR
c H_TARIK
c TQ_HALA
c TQ_ODA
c TQ_AMCA
c TQ_GUN
c TARIK_BITIR
c AK3_ANLAT
c H_DIL
c DIL_HTS
c DIL_HAYRIYE
c DIL_BANKA
c DIL_VER
c H_LEYLA
c LEYLA_DON
c H_RAPOR
e law mukayese
c RAPOR_BITIR
c H_VEDAT
c TV_SABAH hard
c TV_KIMLIK hard
c TV_ANNE hard
c TV_IRSALIYE hard
c TV_BORC hard
c GV_BITIR
c H_DURUSMA
c GECE_DEVAM
`);
const MAH_C1_B = A(`
c C100K_B
c C100_DEVAM
c C101_DEVAM
c Q_ANNE
c Q_BITIR
c C103_C
c C103N_B
p G1
p G2
p G3
p G4
p G5
c C104_BITIR
c C105_A2
c T_TUTUK
c T_BITIR
c CAY_INSAN
`);
const MAH_C2_B = A(`
c C200_DEVAM
p E1
p E1B
p E2
p E3
p E4
p E5
c C202_BITIR
c TENEFFUS_DEVAM
c C204B_D
c C205C_DEVAM
c ARG_NERMIN
c ARG_IYI
c ARG_TAMAM
c C206_I
c C207_B
`);

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E', finalMin: 10469, finalMax: 11571 },
        PROLOG('BR00_DINLE', 'STR_MASUMIYET'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA1,
        ARA2_E,
        CELSE2_E,
      ),
      goldenPath(
        'BERAAT_B',
        { outcome: 'BERAAT_B', finalMin: 11457, finalMax: 12663 },
        PROLOG('BR00_DINLE', 'STR_MASUMIYET'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA1,
        ARA2_B,
        CELSE2_B,
      ),
      goldenPath(
        'INDIRIM',
        { outcome: 'INDIRIM', finalMin: 4265, finalMax: 4714 },
        PROLOG('BR00_UCRET', 'STR_INDIRIM'),
        IND_INV,
        IND_C1,
        IND_ARA,
        IND_C2,
      ),
      goldenPath(
        'MAHKUMIYET',
        { outcome: 'MAHKUMIYET', finalMin: -200, finalMax: 0 },
        A(`
c PR00_DEVAM
c PR01_DEVAM
c BR00_SOZ
c BR00L_DEVAM
c BR01_B
c BR01B_B
c STR_USUL
c SABAH_DEVAM
`),
        MAH_INV,
        MAH_C1,
        MAH_ARA,
        MAH_C2,
      ),
      goldenPath(
        'ETIK',
        { outcome: 'ETIK', finalMin: 7310, finalMax: 8079 },
        PROLOG('BR00_DINLE', 'STR_MASUMIYET'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1,
        ARA1,
        ARA2_ETIK,
      ),
      goldenPath(
        'COKUS',
        { outcome: 'COKUS', finalMin: 6427, finalMax: 7103 },
        PROLOG('BR00_DINLE', 'STR_MASUMIYET'),
        GUN1,
        GUN2,
        GUN3,
        GUN4_NB,
        CELSE1_NB,
        ARA1,
        ARA2_E,
        CELSE2_COKUS,
      ),
      goldenPath(
        'UST_KURUL',
        { outcome: 'UST_KURUL', finalMin: 7538, finalMax: 8332 },
        PROLOG('BR00_DINLE', 'STR_MASUMIYET'),
        GUN1,
        GUN2,
        GUN3,
        GUN4,
        CELSE1_UK,
        ARA1,
        ARA2_E,
        CELSE2_UK,
      ),
      goldenPath(
        'BERAAT_E_RAPORSUZ',
        { outcome: 'BERAAT_E', finalMin: 9823, finalMax: 10857 },
        PROLOG('BR00_DINLE', 'STR_MASUMIYET'),
        GUN1,
        GUN2,
        GUN3,
        GUN4_NB,
        CELSE1_NB,
        ARA1,
        ARA2_E,
        CELSE2_NB,
      ),
      goldenPath(
        'MAHKUMIYET_BELIRSIZ',
        { outcome: 'MAHKUMIYET', finalMin: 100, finalMax: 600 },
        A(`
c PR00_DEVAM
c PR01_DEVAM
c BR00_SOZ
c BR00L_DEVAM
c BR01_B
c BR01B_B
c STR_USUL
c SABAH_DEVAM
`),
        MAH_INV_B,
        MAH_C1_B,
        MAH_ARA,
        MAH_C2_B,
      ),
    ],
  },
};
