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

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E' },
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
    ],
  },
};
