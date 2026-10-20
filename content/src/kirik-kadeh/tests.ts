import { TYPICAL_PATH, chooseAll, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { Action, CasePart } from '../../../tools/content/src/kit/index.js';
import {
  OB_ADISYON,
  OB_ARKA,
  OB_BOKS,
  OB_ECZANE,
  OB_KAN,
  OB_KIRILMA,
  OB_KOLON,
  OB_MASA4,
  OB_ONLUK,
  OB_PRIZ,
  OB_SAP,
  OB_TAKSI,
} from './scenes.js';

// 99-tests: her sonuç için bir golden path; tipik oyun `TIPIK` (223/2-e). Adımlar gün / celse gruplarıyla yazılır.

const { choose, tapCenter, examine, combine, press, present, object } = step;

const giris = (strategy: string): Action[] =>
  chooseAll('PR00_DEVAM', 'PR01_DEVAM', 'BR00_A', 'BR00B2_DEVAM', 'BR01_A', 'BR01B_DEVAM', strategy, 'BR03_DEVAM', 'SABAH_DEVAM');

const aramaBar = [
  choose('A_ARAMA'),
  tapCenter(OB_PRIZ),
  tapCenter(OB_ONLUK),
  tapCenter(OB_KOLON),
  tapCenter(OB_ADISYON),
  tapCenter(OB_BOKS),
  choose('ARAMA_BITIR'),
];
const aramaFoto = [
  choose('A_ARAMA2'),
  tapCenter(OB_SAP),
  tapCenter(OB_KAN),
  tapCenter(OB_KIRILMA),
  tapCenter(OB_MASA4),
  choose('ARAMA2_BITIR'),
];
const hastane = [
  choose('A_HASTANE'),
  examine('mag', 'h_anamnez'),
  examine('mag', 'h_lab'),
  examine('mag', 'h_yara'),
  examine('mag', 'h_grafi'),
  examine('cmp', 'h_gelis'),
  choose('HASTANE_BITIR'),
];
const boraGorusme = [
  choose('A_BORA'),
  choose('TB_GECE', 'soft'),
  choose('TB_KOL', 'soft'),
  choose('TB_SERKAN', 'soft'),
  choose('TB_ANAHTAR', 'soft'),
  choose('TB_KAMERA', 'soft'),
  choose('TB_ONLUK', 'hard'),
  choose('TB_GECMIS', 'hard'),
  choose('BORA_BITIR'),
];
const tolga = chooseAll('A_TOLGA', 'TOLGA_KARSI', 'TOLGA_TANIK', 'TOLGA_BITIR');
const gun1 = [...chooseAll('A_LEYLA1', 'LEYLA1_DON'), aramaBar, tolga, aramaFoto, hastane, boraGorusme, ...chooseAll('AKSAM1_RED', 'SABAH2_DEVAM')];

const darp = [
  choose('A_DARP'),
  examine('mag', 'd_yer'),
  examine('mag', 'd_el'),
  examine('cmp', 'd_alkol'),
  choose('DARP_BITIR'),
];
const ifade = [
  choose('A_IFADE'),
  examine('mark', 'i_2'),
  examine('mark', 'i_3'),
  examine('mark', 'i_4'),
  examine('mark', 'i_5'),
  examine('mag', 'i_6'),
  choose('IFADE_BITIR'),
];
const eceGorusme = (son: string) => [
  choose('A_ECE'),
  choose('TE_KORKU', 'soft'),
  choose('TE_GECE', 'soft'),
  choose('TE_SERKAN', 'soft'),
  choose('TE_BORA', 'soft'),
  choose('TE_MASA', 'soft'),
  choose(son),
];
const tahta = [
  choose('A_CIKARIM'),
  combine('clue_adisyon', 'clue_if_tanimam'),
  combine('clue_sap', 'clue_avuc'),
  combine('clue_onkol', 'clue_kan'),
  combine('clue_kolon', 'clue_if_gordum'),
  combine('clue_anamnez', 'clue_if_kadeh'),
  combine('clue_alkol', 'clue_kirilma'),
  combine('clue_priz', 'clue_ruhsat'),
  combine('clue_story', 'clue_masa7'),
  choose('CIKARIM_BITIR'),
];
const aramaSokak = [
  choose('A_ARAMA3'),
  tapCenter(OB_ECZANE),
  tapCenter(OB_ARKA),
  tapCenter(OB_TAKSI),
  choose('ARAMA3_BITIR'),
];
const gun2 = (eceSon: string) => [
  darp,
  ifade,
  eceGorusme(eceSon),
  tahta,
  chooseAll('A_LEYLA2', 'LEYLA2_DON'),
  aramaSokak,
  ...chooseAll('AKSAM2_BILDIR', 'SABAH3_DEVAM'),
];
const gun3 = [
  ...chooseAll('A_LEYLA3', 'LEYLA3_DON', 'A_ECZANE', 'ECZ_MAHKEME', 'A_ONUR', 'ONUR_MASA', 'ONUR_ISTE', 'ONUR_SERKAN', 'ONUR_KART', 'ONUR_BITIR'),
  ...chooseAll('A_DIL', 'DIL_KRIMINAL', 'DIL_ECZANE', 'DIL_ECE', 'DIL_GONDER'),
  ...chooseAll('A_BORA2', 'BORA2_DURUST', 'BORA2_ECE', 'BORA2_BITIR', 'GO_H1', 'GECE_DEVAM'),
];

const celse1Giris = chooseAll('H100K_DEVAM', 'H100_DEVAM', 'H101_DEVAM', 'H102_A', 'H102R_DEVAM', 'H103_A', 'H103R_DEVAM', 'H103S_A', 'H104V_DEVAM');
const serkanSorgu = [
  press('K1'),
  present('ev_hastane', 'K1'),
  present('ded_tanidik', 'K2'),
  press('K3'),
  present('ded_kadeh_serkan', 'K3'),
  press('K4'),
  present('ded_yumruk', 'K4'),
  press('K5'),
  object('g_kanaat', 'K5'),
  present('ded_savunma', 'K5'),
  choose('H104_BITIR'),
];
const celse1 = [celse1Giris, serkanSorgu, chooseAll('H104R_DEVAM', 'H1MOLA_DEVAM', 'H105_BITIR', 'H1ARA_DEVAM')];

const araBelgeler = [
  choose('B_ATK'),
  examine('mag', 'a_derece'),
  examine('mag', 'a_bilek'),
  examine('cmp', 'a_govde'),
  examine('mag', 'a_tani'),
  choose('ATK_BITIR'),
  choose('B_KRIM'),
  examine('mag', 'k_sap'),
  examine('mag', 'k_taban'),
  examine('mag', 'k_kan'),
  examine('mag', 'k_kirilma'),
  choose('KRIM_BITIR'),
  choose('B_ECZ'),
  examine('mag', 'e_2210'),
  examine('mag', 'e_0152'),
  examine('mag', 'e_0205'),
  choose('ECZ_BITIR'),
];
const araTahta = [choose('B_CIKARIM'), combine('clue_bilek', 'clue_if_tekme'), choose('ARA_CIKARIM_BITIR')];
const araGun1 = [
  ...chooseAll('ARAGIRIS_DEVAM', 'B_LEYLA1', 'ARALEYLA1_DON'),
  araBelgeler,
  ...chooseAll('B_SINAN', 'ARAS_FOTO', 'ARAS_ONUR', 'ARAS_BITIR', 'ARAG_DOGRU', 'ARASABAH2_DEVAM'),
];
const araGun2Tipik = [
  ...chooseAll('B_LEYLA2', 'ARALEYLA2_DON'),
  araTahta,
  ...chooseAll('B_ECE', 'ARAE_KARAR', 'B_BORA', 'ARAB_ECE', 'ARAB_SOZ', 'ARAB_BITIR'),
  ...chooseAll('B_DEFNE', 'ARAD_INDIR', 'ARAD_DOGRU', 'B_DIL', 'ARADIL_VIDEO', 'ARADIL_SINAN', 'ARADIL_GONDER'),
  ...chooseAll('GO_T', 'ARASON_DEVAM'),
];

const celse2Giris = chooseAll('T00G_DEVAM', 'T00_DEVAM', 'T01_A', 'T02V_DEVAM');
const onurSorgu = [
  press('O1'),
  present('ded_tanidik', 'O1'),
  press('O2'),
  object('g_kanaat', 'O2'),
  present('ded_gorus', 'O2'),
  press('O3'),
  present('ev_kriminal', 'O3'),
  press('O4'),
  present('ded_bilek', 'O4'),
  press('O5'),
  present('ded_savunma', 'O5'),
  choose('T02_SON'),
  choose('T02H_DEVAM'),
  choose('T02S_DEVAM'),
];
const eceKursu = chooseAll('T03_DEVAM', 'T03O_A', 'T03E_DEVAM');
const dayanaklar = chooseAll('D_SALDIRI', 'D_TEKME', 'D_TANIK', 'T06P_BITIR');

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E' },
        giris('STR_USUL'),
        gun1,
        gun2('ECE_DOGRU'),
        gun3,
        celse1,
        araGun1,
        araGun2Tipik,
        celse2Giris,
        onurSorgu,
        eceKursu,
        chooseAll('T04V_DEVAM', 'T04S_DEVAM', 'T04K_DEVAM', 'T04_A', 'T05P_DEVAM', 'T05A_DEVAM', 'T05R_A'),
        dayanaklar,
        chooseAll('T06_E', 'T06R_DEVAM', 'T07P_DEVAM', 'SS_DOGRU'),
      ),
      goldenPath(
        'G_D',
        { outcome: 'BERAAT_D' },
        giris('STR_MASUMIYET'),
        gun1,
        gun2('ECE_DOGRU'),
        gun3,
        celse1,
        araGun1,
        araGun2Tipik,
        celse2Giris,
        onurSorgu,
        eceKursu,
        chooseAll('T04V_DEVAM', 'T04S_DEVAM', 'T04K_DEVAM', 'T04_C', 'T05P_DEVAM', 'T05A_DEVAM', 'T05R_A'),
        chooseAll('D_SALDIRI', 'D_TEKME', 'D_KACIS', 'T06P_BITIR'),
        chooseAll('T06_MM', 'T06R_DEVAM', 'T07P_DEVAM', 'SS_DOGRU'),
      ),
      goldenPath(
        'G_CVYO',
        { outcome: 'CVYO' },
        giris('STR_MASUMIYET'),
        gun1,
        gun2('ECE_DOGRU'),
        gun3,
        celse1,
        araGun1,
        araGun2Tipik,
        celse2Giris,
        press('O1'),
        present('ded_tanidik', 'O1'),
        press('O3'),
        present('ev_kriminal', 'O3'),
        choose('T02_BITIR'),
        eceKursu,
        chooseAll('T04V_DEVAM', 'T04S_DEVAM', 'T04K_DEVAM', 'T04_A', 'T05P_DEVAM', 'T05B_DEVAM', 'T05R_A'),
        chooseAll('D_SALDIRI', 'D_KACIS', 'T06P_BITIR'),
        chooseAll('T06_SINIR', 'T06R_DEVAM', 'T07P_DEVAM', 'SS_DOGRU'),
      ),
      goldenPath(
        'G_I',
        { outcome: 'INDIRIM' },
        giris('STR_INDIRIM'),
        gun1,
        gun2('ECE_DOGRU'),
        gun3,
        celse1,
        araGun1,
        araGun2Tipik,
        celse2Giris,
        press('O1'),
        present('ded_tanidik', 'O1'),
        press('O5'),
        present('ded_savunma', 'O5'),
        choose('T02_BITIR'),
        eceKursu,
        chooseAll('T04V_DEVAM', 'T04S_DEVAM', 'T04K_DEVAM', 'T04_D', 'T05P_DEVAM', 'T05B_DEVAM', 'T05R_B'),
        chooseAll('D_SALDIRI', 'T06P_BITIR'),
        chooseAll('T06_T', 'T06R_DEVAM', 'T07P_DEVAM', 'SS_PISMAN'),
      ),
      goldenPath(
        'G_M',
        { outcome: 'MAHKUMIYET' },
        giris('STR_MASUMIYET'),
        gun1,
        gun2('ECE_DOGRU'),
        gun3,
        celse1,
        araGun1,
        araGun2Tipik,
        celse2Giris,
        press('O1'),
        present('ded_tanidik', 'O1'),
        choose('T02_BITIR'),
        eceKursu,
        chooseAll('T04V_DEVAM', 'T04S_DEVAM', 'T04K_DEVAM', 'T04_D', 'T05P_DEVAM', 'T05B_DEVAM', 'T05R_B'),
        chooseAll('D_KARAKTER', 'D_BOKS', 'T06P_BITIR'),
        chooseAll('T06_D', 'T06R_DEVAM', 'T07P_DEVAM', 'SS_INKAR'),
      ),
      goldenPath(
        'W',
        { outcome: 'MAHKUMIYET' },
        giris('STR_USUL'),
        gun1,
        gun2('ECE_DOGRU'),
        gun3,
        celse1,
        araGun1,
        araGun2Tipik,
        chooseAll('T00G_DEVAM', 'T00_DEVAM', 'T01_B', 'T02V_DEVAM'),
        present('ev_hastane', 'O1'),
        present('ev_darp', 'O2'),
        present('ev_atk', 'O1'),
        present('ev_eczane', 'O3'),
        choose('COKUS_SON'),
      ),
      goldenPath(
        'G_ETIK',
        { outcome: 'ETIK' },
        giris('STR_MASUMIYET'),
        gun1,
        gun2('ECE_YONLENDIR'),
        gun3,
        celse1,
        araGun1,
        chooseAll('B_LEYLA2', 'ARALEYLA2_DON'),
        araTahta,
        chooseAll('B_BORA', 'ARAB_ECE', 'ARAB_SOZ', 'ARAB_BITIR', 'B_DIL', 'ARADIL_SINAN', 'ARADIL_GONDER'),
        chooseAll('GO_T', 'ARASON_DEVAM'),
        celse2Giris,
        onurSorgu,
        chooseAll('T03_DEVAM', 'T03O_A', 'T03C_DEVAM', 'T04S_DEVAM', 'T04K_DEVAM', 'T04_A', 'T05P_DEVAM', 'T05A_DEVAM', 'T05R_A'),
        dayanaklar,
        chooseAll('T06_MM', 'T06R_DEVAM', 'T07P_DEVAM', 'SS_DOGRU'),
      ),
    ],
  },
};
