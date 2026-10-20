import { TYPICAL_PATH, chooseAll, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { Action, CasePart } from '../../../tools/content/src/kit/index.js';
import {
  OB_BKAMERA,
  OB_BOSLUK,
  OB_BUZDOLABI,
  OB_CEKMECE,
  OB_CIKARTMA,
  OB_DOKUZ,
  OB_DURAK,
  OB_EKRAN,
  OB_FISKUTUSU,
  OB_KAM,
  OB_KITAPLIK,
  OB_LAPTOP,
  OB_NOTBLOK,
  OB_POS,
  OB_TELEFON,
  OB_VALIDATOR,
} from './scenes.js';

// 99-tests: her sonuç için bir golden path. TIPIK = 223/2-e (case:duration bunu 90–120 dk hedefiyle ölçer).
// Final pencereleri ilk başarılı ölçümün ±%5'i.

const { choose, tapCenter, examine, combine, press, present, object } = step;
const soft = (id: string): Action => choose(id, 'soft');
const hard = (id: string): Action => choose(id, 'hard');

// --- Bölüm 1 ---
const acilis = (strateji: string, br00 = 'BR00_B', br01 = 'BR01_A') =>
  chooseAll('PR_DEVAM', br00, br01, 'BR01B_DEVAM', strateji, 'SABAH_DEVAM');

// --- Soruşturma parçaları ---
const ardaIlk = [
  choose('H_ARDA'),
  soft('TP_AKSAM'),
  soft('TP_CUZDAN'),
  soft('TP_ZARF'),
  soft('TP_SAHIBI'),
  soft('TP_POLIS'),
  soft('TP_ILK_AVUKAT'),
  soft('TP_GULTEN'),
  choose('ARDA_BITIR'),
];
const terminal = chooseAll('H_TERMINAL', 'TR_SAAT', 'TR_KLASOR', 'TR_RECEP', 'TR_ISIM', 'TR_DEFTER', 'TR_BITIR');
const bufe = [
  choose('H_BUFE'),
  tapCenter(OB_FISKUTUSU),
  tapCenter(OB_DURAK),
  tapCenter(OB_POS),
  chooseAll('BUFE_BITIR', 'BFS_ISIM'),
];
const zehra = chooseAll('H_ZEHRA', 'ZH_POLIS', 'ZH_PARA', 'ZH_ANNE', 'ZH_BITIR');
const leyla = chooseAll('H_LEYLA', 'LEYLA_DON');
const banka = [choose('H_BANKA'), examine('mag', 'b1'), choose('BANKA_BITIR')];
const klip = [
  choose('H_KLIP'),
  examine('play', 'k6'),
  examine('mag', 'k1'),
  examine('mag', 'k4'),
  examine('play', 'k5'),
  choose('KLIP_BITIR'),
];
const otobus = [
  choose('H_OTOBUS'),
  tapCenter(OB_KAM),
  tapCenter(OB_BOSLUK),
  tapCenter(OB_CIKARTMA),
  tapCenter(OB_DOKUZ),
  choose('OTOBUS_BITIR'),
  choose('OTS_NOT'),
];
const oda = [
  choose('H_ODA'),
  tapCenter(OB_CEKMECE),
  tapCenter(OB_TELEFON),
  tapCenter(OB_LAPTOP),
  choose('ODA_BITIR'),
  choose('ODS_TANIK'),
];
const emanet = [
  choose('H_EMANET'),
  examine('cmp', 'e1'),
  examine('mag', 'e2'),
  examine('mag', 'e3'),
  choose('EMANET_BITIR'),
  choose('EMS_ORNEK'),
];
const hayri = chooseAll('H_HAYRI', 'HY_YER', 'HY_GORDU', 'HY_GOZLUK', 'HY_KARAKOL', 'HY_HAYAT', 'HY_BITIR');
const ardaIkinci = [
  choose('H_ARDA2'),
  soft('TP_TELEFON'),
  soft('TP_SOFOR'),
  hard('TP_HAYRI_TANI'),
  soft('TP_KENDI'),
  present('clue_sari_not'),
  choose('ARDA_BITIR'),
];
const recep = chooseAll('H_RECEP', 'RC_SOR', 'RC_DEFTER', 'RC_KAMERA', 'RC_EV', 'RC_BITIR');
const dilekce = chooseAll('H_DIL', 'DIL_KAYIT', 'DIL_153', 'DIL_OZAN', 'DIL_VER');
const tahta1 = [
  choose('H_CIKARIM'),
  combine('clue_son_kare', 'clue_harcama_saat'),
  combine('clue_atm_fisi', 'clue_zarf'),
  combine('clue_sari_not', 'clue_153_arama'),
  combine('clue_dort_kamera', 'clue_kaynak_dosya'),
  combine('clue_gozluk', 'clue_dokuz_koltuk'),
  combine('clue_koltuk_boslugu', 'clue_ilk_kare'),
  combine('clue_kart_yok', 'clue_fis_notu'),
  choose('CIKARIM_BITIR'),
];
const gece = chooseAll('H_DURUSMA', 'GECE_DEVAM');

const soruskurmaTam = [
  // Gün 1
  ardaIlk,
  leyla,
  banka,
  klip,
  otobus,
  terminal,
  choose('AK1_KAYIT'),
  // Gün 2
  leyla,
  oda,
  emanet,
  hayri,
  bufe,
  choose('AK2_DURUST'),
  // Gün 3
  leyla,
  ardaIkinci,
  recep,
  zehra,
  dilekce,
  tahta1,
  gece,
];

// --- 1. celse ---
const hayriCapraz = [
  press('HS1'),
  present('ded_hayri_gormedi', 'HS1B'),
  press('HS2'),
  object('g_kanaat', 'HS2B'),
  press('HS3'),
  object('g_duyum', 'HS3B'),
  press('HS4'),
  present('ded_buldu', 'HS4'),
  choose('H104_BITIR'),
];
const celse1Tam = [
  chooseAll(
    'H100_DEVAM',
    'H101_NIYET',
    'H101_NEDEN',
    'H101_BITIR',
    'H101S1_CEVAP',
    'H101S2_CEVAP',
    'H101S3_ITIRAZ',
    'H102_FOTO',
    'H102_BITIR',
    'H103_A',
  ),
  hayriCapraz,
  chooseAll(
    'H105_EKSIK',
    'H105_SEGMENT',
    'H105_BITIR',
    'H106_RECEP',
    'H106_BITIR',
    'H107_SURE',
    'H109_DEVAM',
    'ARAGIRIS_DEVAM',
  ),
];

// --- Ara ---
const kayit = [
  choose('A2_KAYIT'),
  examine('mag', 'f2'),
  examine('mag', 'f3'),
  examine('mag', 'f4'),
  examine('mag', 'f5'),
  examine('play', 'f6'),
  examine('play', 'f7'),
  choose('KAYIT_BITIR'),
  choose('KS_ARDA'),
];
const kayitEksik = [
  choose('A2_KAYIT'),
  examine('mag', 'f2'),
  examine('mag', 'f3'),
  examine('mag', 'f4'),
  examine('mag', 'f5'),
  examine('play', 'f6'),
  choose('KAYIT_BITIR'),
  choose('KS_SUS'),
];
const cagri = [choose('A2_CAGRI'), examine('mag', 'c2'), choose('CAGRI_BITIR')];
const gulten = chooseAll('A2_GULTEN', 'GL_DINLE', 'GL_MAHKEME', 'GL_FOTO', 'GL_BITIR');
const ardaAra = chooseAll('A2_ARDA', 'AA_DOGRU', 'AA_CERCEVE', 'AA_BITIR');
const araLeyla = chooseAll('A2_LEYLA', 'ARA_LEYLA_DON');
const volkanAra = chooseAll('A2_VOLKAN', 'VK_NASIL', 'VK_SEGMENT', 'VK_BITIR');
const ozanAra = chooseAll('A2_OZAN', 'OZ_SABAH', 'OZ_DOGRU', 'OZ_BITIR');
const hayriAra = chooseAll('A2_HAYRI', 'HYA_DINLE', 'HYA_TESEKKUR', 'HYA_BITIR');
const tahta2 = (extra: Action[] = []) => [
  choose('A2_CIKARIM'),
  combine('clue_kare_birakma', 'clue_kare_inis'),
  combine('clue_kare_bere', 'clue_fis_notu'),
  combine('clue_kare_parka', 'clue_gri_kapuson'),
  combine('clue_kare_sofor', 'clue_cikartma'),
  combine('clue_cagri_notu', 'clue_kare_soru'),
  ...extra,
  choose('ARA_CIKARIM_BITIR'),
];

const tahta2Eksik = [
  choose('A2_CIKARIM'),
  combine('clue_kare_birakma', 'clue_kare_inis'),
  combine('clue_kare_parka', 'clue_gri_kapuson'),
  choose('ARA_CIKARIM_BITIR'),
];

// --- 2. celse ---
const volkan = [
  chooseAll('HV0_DEVAM'),
  press('VS1'),
  present('ded_eksik_kayit', 'VS1B'),
  object('g_kanaat', 'VS2'),
  press('VS3'),
  present('ev_aktarim_formu', 'VS3B'),
  choose('H2V_BITIR'),
];
const recepCapraz = [
  choose('HRC0_A'),
  press('RS1'),
  present('ded_sofor_red', 'RS1'),
  press('RS2'),
  press('RS3'),
  present('ev_recep_ifade', 'RS3'),
  choose('H2RC_BITIR'),
];

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E', finalMin: 10825, finalMax: 11965 },
        acilis('STR_USUL'),
        soruskurmaTam,
        celse1Tam,
        // Ara gün 1
        araLeyla,
        kayit,
        cagri,
        gulten,
        ardaAra,
        choose('AA_DAKIKA'),
        // Ara gün 2
        araLeyla,
        volkanAra,
        ozanAra,
        hayriAra,
        choose('AK3_GELSIN'),
        // Ara gün 3
        araLeyla,
        tahta2(),
        chooseAll('A2_CEMIL', 'CM_FIS', 'CM_BITIR', 'A2_KARAKOL', 'KR_SABAH', 'KR_CD', 'KR_BITIR'),
        chooseAll('A2_SUC', 'SUC_DAYANAKLI', 'A2_DURUSMA', 'AS_EKSIK'),
        // 2. celse
        chooseAll('H200_DEVAM', 'IZ_BIRAKMA', 'IZ_SORU', 'IZ_BITIR'),
        volkan,
        recepCapraz,
        chooseAll('KR_ARDA', 'HG_YOK', 'HO_NOT', 'EK_HICBIRI', 'HEQ_CEVAP', 'MC_A', 'SAV_E', 'SON_A'),
      ),
      goldenPath(
        'G_B',
        { outcome: 'BERAAT_B', finalMin: 10977, finalMax: 12133 },
        acilis('STR_MASUMIYET', 'BR00_A'),
        soruskurmaTam,
        celse1Tam,
        araLeyla,
        kayit,
        cagri,
        gulten,
        ardaAra,
        choose('AA_DAKIKA'),
        araLeyla,
        volkanAra,
        ozanAra,
        hayriAra,
        choose('AK3_GELSIN'),
        araLeyla,
        chooseAll('A2_CEMIL', 'CM_FIS', 'CM_SAVCI', 'CM_BITIR'),
        tahta2(),
        chooseAll('A2_SUC', 'SUC_DAYANAKLI', 'A2_DURUSMA', 'AS_EKSIK'),
        chooseAll('H200_DEVAM', 'IZ_BIRAKMA', 'IZ_SORU', 'IZ_BITIR'),
        volkan,
        recepCapraz,
        chooseAll('KR_UZAK', 'HG_YOK', 'HO_NOT', 'HOR_A', 'EK_HICBIRI', 'HEQ_CEVAP', 'MC_A', 'SAV_B', 'SON_A'),
      ),
      goldenPath(
        'G_N',
        { outcome: 'NITELENDIRME', finalMin: 3011, finalMax: 3329 },
        acilis('STR_INDIRIM', 'BR00_A', 'BR01_B'),
        // Gün 1
        [
          choose('H_ARDA'),
          soft('TP_AKSAM'),
          soft('TP_CUZDAN'),
          hard('TP_POLIS'),
          soft('TP_ZARF'),
          soft('TP_KENDI'),
          soft('TP_GULTEN'),
          soft('TP_ILK_AVUKAT'),
          choose('ARDA_BITIR'),
        ],
        banka,
        [choose('H_KLIP'), examine('play', 'k6'), examine('play', 'k5'), examine('lock', 'k2'), choose('KLIP_BITIR')],
        [
          choose('H_OTOBUS'),
          tapCenter(OB_BOSLUK),
          tapCenter(OB_VALIDATOR),
          tapCenter(OB_EKRAN),
          tapCenter(OB_DOKUZ),
          chooseAll('OTOBUS_BITIR', 'OTS_SOR'),
        ],
        chooseAll('H_TERMINAL', 'TR_SAAT', 'TR_DEFTER', 'TR_BITIR'),
        choose('AK1_ARDA'),
        // Gün 2
        leyla,
        zehra,
        chooseAll('H_HAYRI', 'HY_YER', 'HY_GORDU', 'HY_BITIR'),
        [
          choose('H_BUFE'),
          tapCenter(OB_POS),
          tapCenter(OB_DURAK),
          tapCenter(OB_BKAMERA),
          chooseAll('BUFE_BITIR', 'BFS_GIT'),
        ],
        [choose('H_EMANET'), examine('mag', 'e2'), examine('uv', 'e3'), chooseAll('EMANET_BITIR', 'EMS_GIT')],
        choose('AK2_RAHAT'),
        // Gün 3
        leyla,
        [
          choose('H_ODA'),
          tapCenter(OB_BUZDOLABI),
          tapCenter(OB_KITAPLIK),
          tapCenter(OB_CEKMECE),
          chooseAll('ODA_BITIR', 'ODS_SUS'),
        ],
        chooseAll('H_RECEP', 'RC_SOR', 'RC_DEFTER', 'RC_BITIR'),
        chooseAll('H_DIL', 'DIL_BILIRKISI', 'DIL_BUFE', 'DIL_VER'),
        [choose('H_ARDA2'), soft('TP_HAYRI_TANI'), present('clue_atm_fisi'), choose('ARDA_BITIR')],
        [
          choose('H_CIKARIM'),
          combine('clue_son_kare', 'clue_harcama_saat'),
          combine('clue_koltuk_boslugu', 'clue_ilk_kare'),
          combine('clue_kira', 'clue_zarf'),
          combine('clue_atm_fisi', 'clue_zarf'),
          choose('CIKARIM_BITIR'),
        ],
        gece,
        // 1. celse
        chooseAll(
          'H100_DEVAM',
          'H101_PISMAN',
          'H101_BITIR',
          'H101S1_CEVAP',
          'H101S2_CEVAP',
          'H101S3_CEVAP',
          'H102_PARA',
          'H102_BITIR',
          'H103_B',
        ),
        [press('HS1'), press('HS2'), press('HS4'), present('ded_buldu', 'HS4'), choose('H104_BITIR')],
        chooseAll('H105_BITIR', 'H106_RECEP', 'H106_BITIR', 'H107_SIMDI', 'H109_DEVAM', 'ARAGIRIS_DEVAM'),
        // Ara
        araLeyla,
        chooseAll('A2_ARDA', 'AA_CERCEVE', 'AA_DOGRU', 'AA_BITIR'),
        chooseAll('A2_CEMIL', 'CM_ACIK', 'CM_BITIR'),
        chooseAll('A2_HAYRI', 'HYA_DINLE', 'HYA_BITIR'),
        choose('AA_KAZAN'),
        araLeyla,
        chooseAll('A2_SUC', 'SUC_GENEL', 'A2_DURUSMA', 'AS_MASUM'),
        // 2. celse
        chooseAll('H200_DEVAM', 'HRC0_B'),
        [press('RS1'), press('RS2'), press('RS3'), present('ev_recep_ifade', 'RS3'), choose('H2RC_BITIR')],
        chooseAll('EK_160', 'HEQ_ITIRAZ', 'MC_B', 'SAV_T', 'SON_C'),
      ),
      goldenPath(
        'G_M',
        { outcome: 'MAHKUMIYET', finalMin: 351, finalMax: 389 },
        acilis('STR_MASUMIYET', 'BR00_C', 'BR01_D'),
        // Gün 1
        [
          choose('H_ARDA'),
          hard('TP_AKSAM'),
          hard('TP_CUZDAN'),
          hard('TP_POLIS'),
          hard('TP_ZARF'),
          hard('TP_KENDI'),
          hard('TP_ILK_AVUKAT'),
          choose('ARDA_BITIR'),
        ],
        chooseAll('H_HAYRI', 'HY_YER', 'HY_TELKIN'),
        chooseAll('H_RECEP', 'RC_SOR', 'RC_BASKI'),
        chooseAll('H_TERMINAL', 'TR_DEFTER', 'TR_RECEP', 'TR_SAAT', 'TR_ISIM', 'TR_BITIR'),
        choose('AK1_KART'),
        // Gün 2
        leyla,
        chooseAll('H_ZEHRA', 'ZH_PARA', 'ZH_ANNE', 'ZH_BITIR'),
        [
          choose('H_ODA'),
          tapCenter(OB_BUZDOLABI),
          tapCenter(OB_KITAPLIK),
          tapCenter(OB_NOTBLOK),
          chooseAll('ODA_BITIR', 'ODS_SUS'),
        ],
        [
          choose('H_EMANET'),
          examine('uv', 'e3'),
          examine('uv', 'e1'),
          examine('mag', 'e2'),
          chooseAll('EMANET_BITIR', 'EMS_GIT'),
        ],
        [
          choose('H_OTOBUS'),
          tapCenter(OB_VALIDATOR),
          tapCenter(OB_EKRAN),
          tapCenter(OB_DOKUZ),
          tapCenter(OB_CIKARTMA),
          tapCenter(OB_KAM),
          chooseAll('OTOBUS_BITIR', 'OTS_SOR'),
        ],
        choose('AK2_RAHAT'),
        // Gün 3
        leyla,
        [choose('H_ARDA2'), present('clue_kira'), choose('ARDA_BITIR')],
        [choose('H_KLIP'), examine('mag', 'k7'), examine('lock', 'k2'), examine('mag', 'k3'), choose('KLIP_BITIR')],
        banka,
        [choose('H_BUFE'), tapCenter(OB_POS), tapCenter(OB_DURAK), chooseAll('BUFE_BITIR', 'BFS_GIT')],
        chooseAll('H_DIL', 'DIL_FB', 'DIL_BUFE', 'DIL_VER'),
        [
          choose('H_CIKARIM'),
          combine('clue_kira', 'clue_zarf'),
          combine('clue_kira', 'clue_dokuz_koltuk'),
          choose('CIKARIM_BITIR'),
        ],
        gece,
        // 1. celse
        chooseAll(
          'H100_DEVAM',
          'H101_ACMADIN',
          'H101_PISMAN',
          'H101_BITIR',
          'H101S1_ITIRAZ',
          'H101S2_CEVAP',
          'H101S3_CEVAP',
          'H102_CANTA',
          'H103_B',
        ),
        [press('HS1'), press('HS2'), press('HS3'), choose('H104_BITIR')],
        chooseAll(
          'H105_BITIR',
          'H106_GULTEN_FB',
          'H106_RECEP',
          'H106_BITIR',
          'H107_YOK',
          'H109_DEVAM',
          'ARAGIRIS_DEVAM',
        ),
        // Ara
        araLeyla,
        chooseAll('A2_ARDA', 'AA_CERCEVE', 'AA_IKRAR', 'IKRAR_GERI'),
        chooseAll('A2_CEMIL', 'CM_ACIK', 'CM_BITIR'),
        chooseAll('A2_KARAKOL', 'KR_SABAH', 'KR_CD', 'KR_SUCLA', 'KR_BITIR', 'AA_KAZAN'),
        araLeyla,
        chooseAll('A2_SUC', 'SUC_GENEL', 'A2_DURUSMA', 'AS_MASUM'),
        // 2. celse
        chooseAll('H200_DEVAM', 'HRC0_B'),
        [press('RS1'), press('RS2'), press('RS3'), choose('H2RC_BITIR')],
        chooseAll('EK_YOK', 'HEQ_CEVAP', 'MC_B', 'SAV_D', 'SON_B'),
      ),
      goldenPath(
        'G_I',
        { outcome: 'IKRAR', finalMin: 8579, finalMax: 9481 },
        acilis('STR_INDIRIM'),
        soruskurmaTam,
        celse1Tam,
        araLeyla,
        kayitEksik,
        cagri,
        chooseAll('A2_ARDA', 'AA_CERCEVE', 'AA_IKRAR', 'IKRAR_ISRAR'),
        gulten,
        choose('AA_KAZAN'),
        araLeyla,
        volkanAra,
        ozanAra,
        hayriAra,
        choose('AK3_GELMESIN'),
        araLeyla,
        tahta2Eksik,
        chooseAll('A2_DURUSMA', 'AS_MASUM'),
        chooseAll('H200_DEVAM', 'IZ_BIRAKMA', 'IZ_HEPSI', 'IZ_BITIR'),
        volkan,
        [choose('HRC0_A'), press('RS1'), present('ev_tam_kayit', 'RS1'), press('RS2'), choose('H2RC_BITIR')],
        chooseAll('HG_YOK', 'HO_NOT', 'HEKI_DEVAM', 'MC_A', 'SAV_T', 'SON_A'),
      ),
      goldenPath(
        'G_E2',
        { outcome: 'BERAAT_E', finalMin: 9424, finalMax: 10416 },
        acilis('STR_USUL'),
        [
          ardaIlk,
          leyla,
          banka,
          [choose('H_KLIP'), examine('play', 'k6'), examine('mag', 'k1'), examine('play', 'k5'), choose('KLIP_BITIR')],
          otobus,
          terminal,
          choose('AK1_KAYIT'),
          leyla,
          oda,
          emanet,
          hayri,
          bufe,
          choose('AK2_DURUST'),
          leyla,
          ardaIkinci,
          recep,
          zehra,
          dilekce,
          [
            choose('H_CIKARIM'),
            combine('clue_son_kare', 'clue_harcama_saat'),
            combine('clue_atm_fisi', 'clue_zarf'),
            combine('clue_sari_not', 'clue_153_arama'),
            combine('clue_dort_kamera', 'clue_kaynak_dosya'),
            combine('clue_gozluk', 'clue_dokuz_koltuk'),
            combine('clue_koltuk_boslugu', 'clue_ilk_kare'),
            choose('CIKARIM_BITIR'),
          ],
          gece,
        ],
        chooseAll(
          'H100_DEVAM',
          'H101_NIYET',
          'H101_BITIR',
          'H101S1_CEVAP',
          'H101S2_ITIRAZ',
          'H101S3_ITIRAZ',
          'H102_FOTO',
          'H102_BITIR',
          'H103_A',
        ),
        hayriCapraz,
        chooseAll(
          'H105_EKSIK',
          'H105_BITIR',
          'H106_RECEP',
          'H106_VOLKAN',
          'H106_BITIR',
          'H107_SURE',
          'H109_DEVAM',
          'ARAGIRIS_DEVAM',
        ),
        araLeyla,
        kayit,
        cagri,
        gulten,
        ardaAra,
        choose('AA_DAKIKA'),
        araLeyla,
        chooseAll('A2_VOLKAN', 'VK_NASIL', 'VK_BITIR'),
        ozanAra,
        hayriAra,
        choose('AK3_GELSIN'),
        araLeyla,
        tahta2(),
        chooseAll('A2_SUC', 'SUC_SOFOR', 'A2_DURUSMA', 'AS_EKSIK'),
        chooseAll('H200_DEVAM', 'IZ_BIRAKMA', 'IZ_BITIR', 'HV0_DEVAM'),
        press('VS1'),
        present('ded_eksik_kayit', 'VS1B'),
        press('VS3'),
        present('ev_aktarim_formu', 'VS3B'),
        choose('H2V_BITIR'),
        chooseAll('HRC0_A'),
        present('ded_sofor_red', 'RS1'),
        choose('H2RC_BITIR'),
        chooseAll('HG_YOK', 'HO_NOT', 'EK_HICBIRI', 'HEQ_CEVAP', 'MC_A', 'SAV_E', 'SON_A'),
      ),
      goldenPath(
        'W',
        { outcome: 'MAHKUMIYET', finalMin: 7581, finalMax: 8379 },
        acilis('STR_USUL'),
        soruskurmaTam,
        celse1Tam,
        araLeyla,
        kayit,
        cagri,
        gulten,
        ardaAra,
        choose('AA_DAKIKA'),
        araLeyla,
        volkanAra,
        ozanAra,
        hayriAra,
        choose('AK3_GELMESIN'),
        araLeyla,
        tahta2(),
        chooseAll('A2_DURUSMA', 'AS_MASUM'),
        chooseAll('H200_DEVAM', 'IZ_HEPSI', 'IZ_BITIR', 'HV0_DEVAM'),
        present('ev_cagri_kaydi', 'VS1'),
        present('ev_tam_kayit', 'VS2'),
        present('ev_cagri_kaydi', 'VS2'),
        present('ev_tam_kayit', 'VS3'),
        present('ev_cagri_kaydi', 'VS3'),
        choose('COKUS_SON'),
      ),
    ],
  },
};
