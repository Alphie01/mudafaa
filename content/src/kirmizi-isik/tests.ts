import { TYPICAL_PATH, chooseAll, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import {
  OB_ABS,
  OB_ARKA,
  OB_BEBEK,
  OB_CAM,
  OB_CICEK,
  OB_EKRAN,
  OB_FAR,
  OB_FREN,
  OB_KABIN,
  OB_KAMERA,
  OB_POSET,
  OB_TAMPON,
} from './scenes.js';

// 99-tests: her sonuç için golden path. TIPIK = 223/2-e (Kusur itirazı stratejisi).

const { choose, tapCenter, examine, combine, press, present, object } = step;

const prolog = (strategy: string, gul = 'BR00_A', ceza = 'BR01_A') =>
  chooseAll(
    'PR00_DEVAM',
    'PR01_DEVAM',
    'PR02_DEVAM',
    gul,
    'BR00B_DEVAM',
    ceza,
    'BR01B_A',
    'BR01C_A',
    strategy,
    'SABAH_DEVAM',
  );

const aramaGece = [
  choose('H_ARAMA'),
  tapCenter(OB_FREN),
  tapCenter(OB_CAM),
  tapCenter(OB_ARKA),
  tapCenter(OB_POSET),
  choose('ARAMA_BITIR'),
];
const rapor = [
  choose('H_RAPOR'),
  examine('mag', 'r_isik'),
  examine('cmp', 'r_hiz'),
  examine('cmp', 'r_carpma'),
  examine('mag', 'r_iz'),
  examine('mag', 'r_sonuc'),
  choose('RAPOR_BITIR'),
];
const tutanak = [
  choose('H_TUTANAK'),
  examine('mag', 't_arac'),
  examine('mag', 't_tanik'),
  examine('mag', 't_hava'),
  choose('TUTANAK_BITIR'),
];
const gorusme1 = [
  choose('H_GORUS'),
  choose('TP_GECE', 'soft'),
  choose('TP_ISIK', 'soft'),
  choose('TP_TELEFON', 'soft'),
  choose('TP_CARPMA', 'soft'),
  choose('TP_HATICE', 'soft'),
  choose('TP_ONUNDE', 'soft'),
  choose('G_BITIR'),
];
const dilekce = (...reqs: string[]) => [choose('H_DIL'), ...chooseAll(...reqs), choose('DIL_VER')];
const otopark = [
  choose('H_ARAMA3'),
  tapCenter(OB_TAMPON),
  tapCenter(OB_FAR),
  tapCenter(OB_ABS),
  tapCenter(OB_EKRAN),
  tapCenter(OB_BEBEK),
  choose('ARAMA3_BITIR'),
];
const otopsi = [
  choose('H_OTOPSI'),
  examine('mag', 'o_bacak'),
  examine('cmp', 'o_sirt'),
  examine('mag', 'o_mont'),
  choose('OTOPSI_BITIR'),
];
const necati = chooseAll('H_T_NEC', 'NQ_YER', 'NQ_GORDUN', 'NQ_ARAC', 'NQ_TEL', 'NQ_BITIR');
const kavsak = [
  choose('H_ARAMA2'),
  tapCenter(OB_KABIN),
  tapCenter(OB_KAMERA),
  tapCenter(OB_CICEK),
  choose('ARAMA2_BITIR'),
];
const sinyal = [
  choose('H_SINYAL'),
  examine('mag', 's_isemri'),
  examine('mag', 's_cakisma'),
  examine('cmp', 's_kart'),
  choose('SINYAL_BITIR'),
];
const tahta1 = [
  choose('H_CIKARIM'),
  combine('clue_fren', 'clue_abs'),
  combine('clue_cam', 'clue_far'),
  combine('clue_kirik56', 'clue_tampon44'),
  combine('clue_arka', 'clue_necati_yer'),
  combine('clue_kabin', 'clue_is_emri'),
  choose('CIKARIM_BITIR'),
];
const serkan = chooseAll('H_T_SER', 'SQ_SAYGI', 'SQ_ANNE', 'SQ_GECE', 'SQ_BITIR');
const sevim = chooseAll('H_T_SEV', 'VQ_KAYIT', 'VQ_TESLIM', 'VQ_GECE', 'VQ_BITIR');
const bufe = [
  choose('H_BUFE'),
  examine('kare', 'b_titreme'),
  examine('kare', 'b_1841'),
  examine('kare', 'b_1848'),
  choose('BUFE_BITIR'),
];
const gorusme2 = [
  choose('H_GORUS2'),
  choose('TP_DARBE', 'soft'),
  choose('TP_ABS', 'soft'),
  choose('TP_KABUL', 'soft'),
  choose('TP_GUL', 'soft'),
  choose('G_BITIR'),
];
const hastane = chooseAll('H_T_HAS', 'FQ_GECE', 'FQ_ISIK', 'FQ_SERKAN', 'FQ_BITIR');
const hamdi = chooseAll('H_T_HAM', 'HQ_KABIN', 'HQ_ISEMRI', 'HQ_TANIK', 'HQ_BITIR');

const celse2 = [
  ...chooseAll(
    'K_DOGRU',
    'H100_DEVAM',
    'H100B_DEVAM',
    'H101_DEVAM',
    'Q_TEL',
    'Q_HIZ',
    'Q_GOLGE',
    'H102_BITIR',
    'O_TELKIN',
    'S4_SORU',
    'H104V_DEVAM',
  ),
  press('N2'),
  present('ded_goremez', 'N2'),
  press('N3'),
  present('ev_necati_ifade', 'N3'),
  object('g_kanaat', 'N3'),
  press('N4'),
  present('ded_fren', 'N4'),
  press('N5'),
  present('ev_multimedya', 'N5'),
  choose('H105_BITIR'),
  choose('R5_DURUST'),
  choose('R_ITIRAZ'),
  choose('AK_IZIN'),
  choose('H108_LEYLA'),
];

const edr = [
  choose('A_EDR'),
  examine('mag', 'e_hiz'),
  examine('mag', 'e_fren'),
  examine('cmp', 'e_dv'),
  choose('EDR_BITIR'),
];
const heyet = [
  choose('A_HEYET'),
  examine('mag', 'h_isik'),
  examine('mag', 'h_iz'),
  examine('cmp', 'h_kusur'),
  choose('HEYET_BITIR'),
];

const celse3E = [
  ...chooseAll('K2_VOLKAN', 'T00_DEVAM', 'S0_GORDUGU', 'T01_DEVAM', 'O2_TELKIN'),
  press('TH1'),
  present('ev_sinyal_log', 'TH1'),
  present('ded_ariza', 'TH3'),
  present('ev_sesli', 'TH4'),
  choose('T03_BITIR'),
  choose('T04_DEVAM'),
  object('g_yorum', 'C1'),
  present('ev_heyet', 'C1'),
  present('ev_edr', 'C2'),
  press('C3'),
  present('ev_far_parca', 'C3'),
  present('ded_yukseklik', 'C4'),
  choose('T05_BITIR'),
  ...chooseAll('NQ_ISIK', 'NQ_KUSUR', 'NQ_ILK', 'T05N_BITIR'),
  ...chooseAll('AT_CAM', 'AT_IZ', 'T06_BITIR', 'ARG_EDR', 'ARG_ATK', 'ARG_HEYET', 'T07_BITIR', 'M_KUSUR'),
  ...chooseAll('D_ISIK', 'D_HIZ', 'D_IZ', 'T09P_BITIR', 'T09_E', 'T09R_DEVAM', 'SS_DOGRU'),
];

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E' },
        prolog('STR_KUSUR'),
        // Gün 1
        aramaGece,
        choose('H_LEYLA'),
        choose('LEYLA_GERI'),
        rapor,
        tutanak,
        gorusme1,
        choose('AK1_B'),
        // Gün 2
        dilekce('DIL_SINYAL', 'DIL_EDR', 'DIL_ATK'),
        otopark,
        otopsi,
        necati,
        choose('AK2L_DEVAM'),
        // Gün 3
        kavsak,
        sinyal,
        choose('H_LEYLA'),
        choose('LEYLA_GERI'),
        serkan,
        hastane,
        choose('AK3_BEKLE'),
        // Gün 4
        tahta1,
        sevim,
        bufe,
        gorusme2,
        hamdi,
        choose('H_DURUSMA'),
        choose('GECE_ARA'),
        celse2,
        // Ara
        choose('ARAG_DEVAM'),
        edr,
        chooseAll('A_VOLKAN', 'VO_DOGRU', 'A_HAMDI', 'HA_BILGI', 'A_NECATI', 'NE_DINLE'),
        choose('ARAK_DEVAM'),
        heyet,
        chooseAll('A_AYTEN', 'AY_SAVCI', 'A_SERKAN', 'SE_SAVCI', 'A_NALAN', 'NA_RED'),
        chooseAll('A_LEYLA', 'ARALEY_GERI', 'A_CIKARIM'),
        combine('ev_atk', 'clue_sirt'),
        chooseAll('CIKARIM2_BITIR', 'A_DURUSMA', 'ARASON_DEVAM', 'T00Y_DEVAM'),
        celse3E,
      ),
    ],
  },
};
