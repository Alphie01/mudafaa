import { TYPICAL_PATH, chooseAll, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { Action, CasePart } from '../../../tools/content/src/kit/index.js';
import {
  OB_BIDON,
  OB_BUAT,
  OB_CUMBA,
  OB_KARE21,
  OB_KARE30,
  OB_KARE9,
  OB_KOMBI,
  OB_MODEM,
  OB_MOLOZ,
  OB_PANO,
  OB_SANDIK,
  OB_SOZLESME,
  OB_TV,
  OB_V,
  OB_KUMAS,
} from './scenes.js';

// 99-tests: her sonuç için golden path. TIPIK = 223/2-e beraat (case:duration 90–120 dk hedefi).

const { choose, tapCenter, examine, combine, press, present, object } = step;

const brifing = (strateji: string, zehra = 'BR00_A', soru = 'BR01_A') =>
  chooseAll('PROLOG_DEVAM', 'PR02_DEVAM', zehra, 'BR00L_DEVAM', soru, 'BR01B_DEVAM', strateji, 'SABAH_DEVAM');

const leyla = chooseAll('A_LEYLA', 'LEYLA_BITIR');
const ev = [
  choose('A_EV'),
  tapCenter(OB_BUAT),
  tapCenter(OB_V),
  tapCenter(OB_CUMBA),
  tapCenter(OB_MOLOZ),
  tapCenter(OB_PANO),
  chooseAll('EV_BITIR', 'EVSON_BITIR'),
];
const foto = [choose('A_FOTO'), tapCenter(OB_KARE21), tapCenter(OB_KARE9), tapCenter(OB_KARE30), choose('FOTO_BITIR')];
const bilirkisi = [
  choose('A_BILIRKISI'),
  examine('kars', 'b_materyal'),
  examine('lupe', 'b_lab'),
  examine('lupe', 'b_elektrik'),
  examine('lupe', 'b_ek3'),
  examine('kars', 'b_kesif'),
  choose('BILIRKISI_BITIR'),
];
const saadet = chooseAll('A_SAADET', 'SA_GECE', 'SA_KOKU', 'SA_ESYA', 'SA_NERMIN', 'SA_BEKCI', 'SA_BITIR');
const gorus1 = [
  choose('A_GORUS'),
  choose('TP_GECE', 'soft'),
  choose('TP_EV', 'soft'),
  choose('TP_BORC', 'soft'),
  choose('TP_BENZIN', 'soft'),
  choose('TP_ESYA', 'soft'),
  choose('TP_ELEKTRIK', 'soft'),
  choose('TP_ZEHRA', 'soft'),
  choose('G_BITIR'),
];
const atolye = [
  chooseAll('A_ATOLYE', 'ATOLYE_GIR'),
  tapCenter(OB_BIDON),
  tapCenter(OB_KUMAS),
  tapCenter(OB_SANDIK),
  tapCenter(OB_SOZLESME),
  chooseAll('ATOLYE_BITIR', 'ATOLYESON_BITIR'),
];
const cevdet = chooseAll('A_CEVDET', 'CV_GECE', 'CV_SABAH', 'CV_TANIK', 'CV_BITIR');
const itfaiye = [
  choose('A_ITFAIYE'),
  examine('lupe', 'i_gozlem'),
  examine('kars', 'i_baslangic'),
  examine('lupe', 'i_sirama'),
  choose('ITFAIYE_BITIR'),
];
const police = [
  choose('A_POLICE'),
  examine('lupe', 'p_ozel'),
  examine('lupe', 'p_ek'),
  examine('lupe', 'p_zeyil'),
  choose('POLICE_BITIR'),
];
const necati = chooseAll('A_NECATI', 'NC_KESIF', 'NC_ACIL', 'NC_SUC', 'NC_BITIR');
const kader = chooseAll('A_KADER', 'KD_ARTIS', 'KD_POLICE', 'KD_EKSPER', 'KD_BITIR');
const gorus2 = [choose('A_GORUS2'), choose('TP_ARTIS', 'soft'), choose('G_BITIR')];

const tahta = (onlem = true): Action[] => [
  choose('A_CIKARIM'),
  combine('clue_foto_tavan', 'clue_eksper_foto'),
  combine('clue_numune', 'clue_eksper_giris'),
  combine('clue_pano', 'clue_pano_yok'),
  combine('clue_borc', 'clue_kampanya'),
  combine('clue_v_izi', 'clue_baslangic'),
  combine('clue_buat', 'clue_necati'),
  combine('clue_esyalar', 'clue_restorasyon'),
  combine('clue_bidon', 'clue_jenerator'),
  combine('clue_banka', 'clue_dain'),
  combine('clue_kampanya', 'clue_cagri'),
  combine('clue_taze', 'clue_su'),
  ...(onlem ? [combine('clue_restorasyon', 'clue_necati')] : []),
  combine('clue_saadet_fener', 'clue_devriye'),
  choose('CIKARIM_BITIR'),
];

/** 1. evre: üç gün, on iki eylem puanı. */
const sorusturma = (dil: string[], aksam1 = 'AK1_A', aksam2 = 'AK2_A', onlem = true): Action[] => [
  leyla,
  ev,
  foto,
  bilirkisi,
  saadet,
  chooseAll(aksam1, 'SABAH2_DEVAM'),
  leyla,
  gorus1,
  atolye,
  cevdet,
  itfaiye,
  chooseAll(aksam2, 'SABAH3_DEVAM'),
  leyla,
  police,
  necati,
  kader,
  gorus2,
  tahta(onlem),
  choose('A_DIL'),
  chooseAll(...dil, 'DIL_VER'),
  choose('GO_H1'),
].flat();

const saadetCapraz = [
  press('S1'),
  present('ded_fener', 'S1'),
  press('S2'),
  present('ev_itfaiye', 'S2'),
  press('S3'),
  present('ded_tasima', 'S3'),
  press('S4'),
  object('g_kanaat', 'S5'),
  press('S6'),
  present('ded_bidon', 'S6'),
  choose('H104_BITIR'),
];
const tezelCapraz = [
  press('B1'),
  present('ded_temizlenmis', 'B1'),
  press('B2'),
  present('ded_zincir', 'B2'),
  press('B3'),
  present('ded_pano', 'B3'),
  press('B4'),
  present('ded_taze', 'B4'),
  object('g_uzmanlik', 'B5'),
  choose('H106_BITIR'),
  choose('H106K_DEVAM'),
];

/** 1. celse: tam çapraz sorgu. */
const celse1 = (talepler: string[]): Action[] => [
  chooseAll('GECE_B', 'K_DOGRU', 'H100_DEVAM', 'H101_DEVAM', 'H102_DEVAM'),
  chooseAll('Q_BENZIN', 'Q_ESYA', 'Q_ELEKTRIK', 'Q_ONLEM', 'Q_BITIR', 'H103_A'),
  saadetCapraz,
  choose('H105_A'),
  tezelCapraz,
  chooseAll(...talepler, 'T1_TAHLIYE', 'T1_BITIR', 'H108_DEVAM', 'H109_DEVAM', 'ARAGIRIS_DEVAM'),
].flat();

const lab = [
  choose('A2_LAB'),
  examine('lupe', 'l_piroliz'),
  examine('kars', 'l_kabul'),
  examine('lupe', 'l_not'),
  choose('LAB_BITIR'),
];
const ark = [choose('A2_ARK'), examine('lupe', 'k_linye'), examine('kars', 'k_pano'), choose('ARK_BITIR')];
const ariza = [choose('A2_ARIZA'), examine('lupe', 'a_0208'), examine('kars', 'a_abone'), choose('ARIZA_BITIR')];
const gulsum = chooseAll('A2_GULSUM', 'GL_SONUC', 'GL_NEDEN', 'GL_TANIK', 'GL_BITIR');
const tahkim = [
  choose('A2_TAHKIM'),
  examine('kars', 't_ek'),
  examine('lupe', 't_yazi'),
  examine('lupe', 't_karar'),
  choose('TAHKIM_BITIR'),
];
const saadet2 = [choose('A2_SAADET'), tapCenter(OB_TV), tapCenter(OB_MODEM), tapCenter(OB_KOMBI), choose('SAADET2_BITIR')];
const cevdet2 = chooseAll('A2_CEVDET', 'CV2_CANTA', 'CV2_AMIR', 'CV2_BITIR');
const halil2 = chooseAll('A2_HALIL', 'HL_GERCEK', 'HL_EK', 'HL_ZEHRA', 'HL_BITIR');
const leyla2 = chooseAll('A2_LEYLA', 'LEYLA2_BITIR');
const tahta2 = (notr: boolean): Action[] => [
  choose('A2_CIKARIM'),
  combine('clue_piroliz', 'clue_teneke'),
  combine('clue_ark', 'clue_buat'),
  combine('clue_ayni', 'clue_prim'),
  ...(notr ? [combine('clue_notr', 'clue_tv')] : []),
  choose('CIKARIM2_BITIR'),
];

const tarikCapraz = [
  press('U1'),
  present('ev_cizelge', 'U1'),
  press('U2'),
  present('ded_temizlenmis', 'U2'),
  press('U3'),
  present('ded_ekilmis', 'U3'),
  press('U4'),
  present('ev_tahkim', 'U4'),
  press('U5'),
  present('ded_kopya', 'U5'),
  press('U6'),
  present('ev_ark', 'U6'),
  choose('T03_BITIR'),
];

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E' },
        brifing('STR_USUL'),
        sorusturma(['DIL_PANO', 'DIL_LAB', 'DIL_CEVDET']),
        celse1([]),
        // Ara, 1. gün: LAB, ARK, GÜLSÜM, TAHKİM
        leyla2,
        lab,
        ark,
        gulsum,
        tahkim,
        chooseAll('ON_RED', 'ARASABAH2_DEVAM'),
        // Ara, 2. gün
        leyla2,
        saadet2,
        cevdet2,
        halil2,
        tahta2(false),
        chooseAll('A2_SUC', 'SC_DUYURU'),
        chooseAll('GO_T', 'KP_BILDIR', 'T00K_DEVAM', 'CV_Q1', 'CV_Q2', 'CV_Q3', 'CV_QBITIR', 'T02_A'),
        tarikCapraz,
        chooseAll('T03K_DEVAM', 'T04_DEVAM', 'T05_A', 'T05E_DEVAM', 'R_BANKA', 'R_ARTIS', 'R_BIDON', 'R_BITIR'),
        chooseAll('D_ZINCIR', 'D_ZEMIN', 'D_IPLIK', 'D_BITIR', 'T06_E', 'T07_A'),
      ),
      goldenPath(
        'G_B',
        { outcome: 'BERAAT_B' },
        brifing('STR_MASUMIYET'),
        sorusturma(['DIL_PANO', 'DIL_ARIZA', 'DIL_LAB']),
        celse1(['T1_CEVDET']),
        leyla2,
        lab,
        ark,
        ariza,
        gulsum,
        chooseAll('ON_MUTALAA', 'ARASABAH2_DEVAM'),
        leyla2,
        tahkim,
        saadet2,
        cevdet2,
        halil2,
        tahta2(true),
        chooseAll('A2_SUC', 'SC_DUYURU'),
        chooseAll('GO_T', 'KP_BILDIR', 'T00K_DEVAM', 'CV_Q1', 'CV_Q2', 'CV_Q3', 'CV_QBITIR', 'T02_A'),
        tarikCapraz,
        chooseAll('T03K_DEVAM', 'T04_DEVAM', 'T05_B', 'T05B_DEVAM', 'R_BANKA', 'R_ARTIS', 'R_BIDON', 'R_BITIR'),
        chooseAll('D_ELEKTRIK', 'D_EKSPER', 'D_ZINCIR', 'D_BITIR', 'T06_B', 'T07_A'),
      ),
    ],
  },
};

