import { TYPICAL_PATH, chooseAll, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import {
  OB_AYAKKABI,
  OB_KILIT,
  OB_MONT,
  OB_POSTA,
  OB_RANDEVU,
  OB_SEKERLIK,
  OB_YAG,
  OB_YATAK,
  OB_ZINCIR,
  OB_GITAR,
} from './scenes.js';

// 99-tests: her sonuç için golden path. TIPIK = 223/2-e beraat (case:duration 90–120 dk hedefi).

const { choose, tap, tapCenter, examine, combine, press, present, object } = step;

const brifing = (strateji: string, defne = 'BR00_A', soru = 'BR01_A') =>
  chooseAll('PROLOG_DEVAM', 'PR02_DEVAM', defne, 'BR00L_DEVAM', soru, 'BR01B_DEVAM', strateji, 'SABAH_DEVAM');

const arka = [choose('A_ARKA'), tapCenter(OB_KILIT), tapCenter(OB_MONT), tapCenter(OB_ZINCIR), choose('ARKA_BITIR')];
const on = [
  choose('A_ON'),
  tapCenter(OB_YATAK),
  tap(5, 5),
  tapCenter(OB_RANDEVU),
  tapCenter(OB_SEKERLIK),
  tapCenter(OB_AYAKKABI),
  choose('ON_BITIR'),
];
const gorus1 = [
  choose('A_GORUS'),
  choose('TP_SABAH', 'soft'),
  choose('TP_ARKA', 'soft'),
  choose('TP_BARIS', 'soft'),
  choose('TP_KENDI', 'soft'),
  choose('TP_DEFNE', 'soft'),
  choose('TP_KILIT', 'soft'),
  choose('TP_SEKER', 'soft'),
  choose('G_BITIR'),
];
const tutanak = [
  choose('A_TUTANAK'),
  examine('lupe', 'r_arka'),
  examine('lupe', 'r_tanik'),
  examine('lupe', 'r_mutfak'),
  examine('kars', 'r_kroki'),
  choose('TUTANAK_BITIR'),
];
const karar = [
  choose('A_KARAR'),
  examine('lupe', 'r_k_kapsam'),
  examine('lupe', 'r_k_talep'),
  examine('kars', 'r_k_sure'),
  choose('KARAR_BITIR'),
];
const mesaj = [
  choose('A_MESAJ'),
  examine('lupe', 'm_kasim'),
  examine('lupe', 'm_eylul1'),
  examine('lupe', 'm_ekim'),
  examine('kars', 'm_hat'),
  choose('MESAJ_BITIR'),
];
const kriminal = [
  choose('A_KRIMINAL'),
  examine('kars', 'k_seker'),
  examine('lupe', 'k_terazi'),
  examine('lupe', 'k_kavanoz'),
  choose('KRIMINAL_BITIR'),
];
const bina = [choose('A_BINA'), tapCenter(OB_POSTA), tapCenter(OB_YAG), choose('BINA_BITIR')];
const nesrin = chooseAll('A_NESRIN', 'NS_ACIK', 'NS_DEFTER', 'NS_TOLGA', 'NS_TANIK', 'NS_BITIR');
const tolgaIfade = [
  choose('A_TOLGA'),
  examine('lupe', 't_ayrinti'),
  examine('lupe', 't_saat'),
  examine('kars', 't_gecmis'),
  examine('lupe', 't_not'),
  choose('TOLGA_BITIR'),
];
const gorus2 = [
  choose('A_GORUS2'),
  choose('TP_MESAJ', 'soft'),
  choose('G_RIZA_C'),
  choose('TP_TOLGA', 'soft'),
  choose('TP_PAZAR', 'soft'),
  choose('G_BITIR'),
];
const emanet = [
  choose('A_EMANET'),
  examine('lupe', 'e_anahtar'),
  examine('lupe', 'e_cuzdan'),
  examine('kars', 'e_ilac'),
  choose('EMANET_BITIR'),
];
const defne = chooseAll('A_DEFNE', 'DF_TEDAVI', 'DF_GUNLUK', 'DF_PARA', 'DF_BARIS', 'DF_BITIR');
const tahta = [
  choose('A_CIKARIM'),
  combine('clue_kilit', 'clue_kapsam'),
  combine('clue_on_oda', 'clue_kroki'),
  combine('clue_ayakkabi', 'clue_kaan_olcu'),
  combine('clue_mont', 'clue_zincir'),
  combine('clue_odaya_girme', 'clue_kira_defteri'),
  combine('clue_hat', 'clue_posta'),
  combine('clue_iki_tane', 'clue_kavanoz_iz'),
  combine('clue_ayni_parti', 'clue_sekerlik'),
  combine('clue_tolga_kask', 'clue_kaan_olcu'),
  combine('clue_randevu', 'clue_tedavi'),
  combine('clue_anahtarlik', 'clue_kilit'),
  choose('CIKARIM_BITIR'),
];
const leyla = chooseAll('A_LEYLA', 'LEYLA_BITIR');
const dilekce = chooseAll('A_DIL', 'DIL_KURYE', 'DIL_NESRIN', 'DIL_IZ', 'DIL_VER');

const celse1Acilis = chooseAll('GECE_B', 'K_C', 'H100_DEVAM', 'H101_DEVAM', 'H102_DEVAM', 'Q_ODA', 'Q_KILIT', 'Q_KULLANIM', 'Q_TEDAVI', 'Q_BITIR', 'H103_A');
const tuncay = [
  press('S1'),
  press('S2'),
  present('ded_oda', 'S2'),
  press('S3'),
  present('ded_kapsam', 'S3'),
  present('ev_karar', 'S1'),
  press('S4'),
  object('g_kanaat', 'S5'),
  present('ded_kullanici', 'S5'),
  press('S6'),
  present('ded_sekerlik', 'S6'),
  choose('H104_BITIR'),
];
const celse1Son = chooseAll('TL_TAHLIYE', 'TL_BITIR', 'H107_DEVAM', 'H108_B', 'ARA_GIRIS_DEVAM');

const araGun1 = [
  choose('A2_GPS'),
  examine('lupe', 'g_11kasim'),
  examine('kars', 'g_9kasim'),
  examine('lupe', 'g_fesih'),
  examine('lupe', 'g_personel'),
  choose('GPS_BITIR'),
  ...chooseAll('A2_SELIM', 'SL_BARIS', 'SL_CANTA', 'SL_TOLGA', 'SL_BITIR'),
  choose('A2_ZRAPOR'),
  examine('lupe', 'z_kapanis'),
  examine('kars', 'z_son'),
  choose('Z_BITIR'),
];
const araTahta = [
  choose('A2_CIKARIM'),
  combine('clue_gps', 'clue_nesrin_moto'),
  combine('clue_selim_tolga', 'clue_tolga_kask'),
  combine('clue_z_rapor', 'clue_tolga_saat'),
  choose('ARA_CIKARIM_BITIR'),
];

const tolgaSorgu = [
  press('T1'),
  press('T2'),
  object('g_duyum', 'T2'),
  press('T3'),
  present('ded_kask', 'T3'),
  press('T5'),
  present('ev_tolga_ifade', 'T5'),
  press('T4'),
  present('ded_alibi', 'T4'),
  present('ded_tolga_baris', 'T1'),
  choose('T03_BITIR'),
];

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E' },
        brifing('STR_USUL'),
        arka,
        on,
        gorus1,
        tutanak,
        leyla,
        emanet,
        choose('AK1_B'),
        leyla,
        karar,
        mesaj,
        kriminal,
        bina,
        defne,
        choose('AK2_A'),
        leyla,
        nesrin,
        tolgaIfade,
        gorus2,
        tahta,
        dilekce,
        choose('GO_H1'),
        celse1Acilis,
        tuncay,
        celse1Son,
        araGun1,
        chooseAll('A2_LEYLA', 'ARA_LEYLA_BITIR', 'A2_KAAN', 'KA_TOLGA', 'KA_SONSOZ', 'KA_BITIR', 'ARAK_B', 'TEL_C'),
        chooseAll('A2_DEFNE', 'DN_RED', 'DN_BITIR', 'A2_LEYLA', 'ARA_LEYLA_BITIR'),
        araTahta,
        chooseAll('A2_SUC', 'SC_KIMLIK', 'A2_BODRUM', 'BD_SAVCI', 'A2_NESRIN', 'NS2_DEFTER', 'NS2_BARIS', 'NS2_BITIR', 'GO_T', 'TK_A'),
        chooseAll('T01_DEVAM', 'T01_A', 'T02_A'),
        tolgaSorgu,
        chooseAll('T04_A', 'T05E_A', 'D_ODA', 'D_MUHBIR', 'D_SEKER', 'D_BITIR', 'T06_E', 'T07_A'),
      ),
    ],
  },
};

void OB_GITAR;
