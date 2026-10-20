import { TYPICAL_PATH, chooseAll, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { Action, CasePart } from '../../../tools/content/src/kit/index.js';
import {
  OB_BARDAK,
  OB_BILEK,
  OB_CEKMECE,
  OB_CILTLER,
  OB_DAHILI,
  OB_DAMGA,
  OB_DOLAP,
  OB_KAMERA,
  OB_KOLTUK,
  OB_MERDIVEN,
  OB_OCAK,
  OB_RAF,
  OB_REHBER,
  OB_SAKSI,
  OB_SEBIL,
  OB_TAKVIM,
  OB_ZIMMET,
} from './scenes.js';

// 99-tests: her sonuç için golden path. TIPIK = BERAAT_E (case:duration 90–120 dk ölçer).

const { choose, tapCenter, examine, combine, press, present, object } = step;
const C = chooseAll;
const soft = (topic: string): Action => choose(topic, 'soft');
const hard = (topic: string): Action => choose(topic, 'hard');

// --- Bölüm 1 ---
const intro = (strategy: string, ucret = 'BR00_C', ceza = 'BR01_A', sabah = 'SABAH_A', ilk = 'ILK_A') =>
  C('PROLOG_DEVAM', 'PROLOG2_DEVAM', ucret, ceza, 'BR01K_DEVAM', 'BR01B_DEVAM', strategy, sabah, ilk);

// --- Soruşturma ---
const mudur = C('A_MUDUR', 'MUD_SABAH', 'MUD_DOSYA', 'MUD_ODA', 'MUD_HALIL', 'MUD_GERI');
const oda = [
  C('A_ODA'),
  tapCenter(OB_TAKVIM),
  tapCenter(OB_RAF),
  tapCenter(OB_CEKMECE),
  tapCenter(OB_DAHILI),
  C('ODA_BITIR'),
];
const halil = [
  C('A_HALIL'),
  soft('TP_SABAH'),
  soft('TP_BAYRAM'),
  soft('TP_TELEFON'),
  soft('TP_KONTROL'),
  soft('TP_DEFTER'),
  C('G_YUZLES', 'TAV_A'),
  soft('TP_CEKMECE'),
  C('G_BITIR'),
];
const karar = [
  C('A_KARAR'),
  examine('mag', 'k2'),
  examine('chk', 'k3'),
  examine('mag', 'k4'),
  examine('mag', 'k5'),
  examine('mag', 'k6'),
  C('KARAR_BITIR'),
];
const tutanak = [C('A_TUTANAK'), examine('mag', 't2'), examine('cmp', 't4'), examine('mag', 't5'), C('TUTANAK_BITIR')];
const ifade = [C('A_IFADE'), examine('mag', 'i1'), examine('cmp', 'i3'), examine('mag', 'i5'), C('IFADE_BITIR')];
const koridor = [
  C('A_KORIDOR'),
  tapCenter(OB_REHBER),
  tapCenter(OB_KAMERA),
  tapCenter(OB_DOLAP),
  tapCenter(OB_OCAK),
  C('KORIDOR_BITIR'),
];
const komiser = C('A_KOMISER', 'KOM_BASLA', 'KOM_PARA', 'KOM_CIHAZ', 'KOM_ODA', 'KOM_OGUL', 'KOM_GERI');
const zehra = C('A_ZEHRA', 'ZEH_NOT', 'ZEH_TAKVIM', 'ZEH_EV', 'ZEH_GERI');
const sinan = C('A_SINAN', 'SIN_SABAH', 'SIN_BAYRAM', 'SIN_HALIL', 'SIN_GERI');
const tahta1 = [
  C('A_CIKARIM'),
  combine('clue_kilit', 'clue_zarf_stok'),
  combine('clue_sure', 'clue_kayit14'),
  combine('clue_hedef_hat', 'clue_kayit9'),
  combine('clue_takvim_214', 'clue_rehber_214'),
  combine('clue_saat_tutanak', 'clue_kayit_durdu'),
  combine('clue_dosya_devir2', 'clue_ihbar_icbar'),
  combine('clue_ihbar_icbar', 'clue_savcilik_anlasma'),
  combine('clue_inat', 'clue_uyari_notu'),
  C('CIKARIM_BITIR'),
];
const gun1 = [mudur, oda, halil, karar, C('AK1_A')];
const gun2 = [C('A_LEYLA', 'LEYLA_GERI'), tutanak, ifade, koridor, komiser, C('AK2_A')];
const gun3 = [
  C('A_LEYLA', 'LEYLA_GERI'),
  zehra,
  tahta1,
  C('A_HALIL2'),
  soft('TP_ZEHRA'),
  soft('TP_YIRMIYEDI'),
  C('G_BITIR'),
  sinan,
  C('A_DIL', 'DIL_KAMERA', 'DIL_SANTRAL', 'DIL_CIHAZ', 'DIL_VER', 'GO_H1', 'GECE_A'),
];

// --- 1. celse ---
const celse1Acilis = C('HK_DEVAM', 'HK2_A', 'H100_DEVAM', 'H100B_DEVAM', 'H101_DEVAM');
const komiserTam = [
  press('K1'),
  present('ded_sure_disi', 'K1'),
  press('K2'),
  present('ev_para', 'K2'),
  press('K3'),
  present('ded_bos_oda', 'K3'),
  press('K4'),
  object('g_kanaat', 'K4'),
  press('K5'),
  present('ded_hat_disi', 'K5'),
  C('H104_BITIR'),
];
const komiserKismi = komiserTam.map((a) =>
  a.kind === 'PRESENT' && a.evidenceId === 'ded_bos_oda' ? present('ev_tutanak', 'K3') : a,
);
const celse1 = (rq: string[], komiser: Action[] = komiserTam) => [
  celse1Acilis,
  C('H101D_DEVAM', 'H101Q_A', 'H101Q_B', 'H101Q_C', 'H101Q_D', 'H101Q_BITTI', 'H102_A', 'H103_A', 'H104_DEVAM'),
  komiser,
  C(...rq, 'RQ_KARAR', 'RQ_TAHLIYE', 'RQ_BITTI', 'H106_DEVAM', 'H106B_DEVAM', 'H107_DEVAM'),
];

// --- Ara ---
const cihaz = [C('A2_CIHAZ'), examine('mag', 'c2'), examine('chk', 'c3'), examine('mag', 'c4'), C('CIHAZ_BITIR')];
const santral = [
  C('A2_SANTRAL'),
  examine('cmp', 's2'),
  examine('mag', 's5'),
  examine('mag', 's4'),
  C('SANTRAL_GULAY', 'GULAY_GERI'),
];
const kamera = [C('A2_KAMERA'), tapCenter(OB_DAMGA), tapCenter(OB_BILEK), tapCenter(OB_KOLTUK), C('KAMERA_BITIR')];
const arsiv = [
  C('A2_ARSIV'),
  tapCenter(OB_CILTLER),
  tapCenter(OB_ZIMMET),
  C('ARSIV_FERDA', 'FER_ZIMMET', 'FER_RAPOR', 'FER_GULAY', 'FER_GERI'),
];
const tahta2 = [
  C('A2_CIKARIM'),
  combine('clue_barkod', 'clue_zimmet'),
  combine('clue_214_cagri', 'clue_izin_gulay'),
  combine('clue_kol_saat', 'clue_sinan_saat'),
  combine('clue_cay_defteri', 'clue_sinan_arsiv'),
  C('ARA_CIKARIM_BITIR'),
];
const ara1 = [
  C('ARA_GIRIS_DEVAM', 'A2_LEYLA', 'ARALEYLA_GERI'),
  cihaz,
  santral,
  kamera,
  C('A2_BAYRAM', 'BAY_A', 'ARAK_A', 'ARA_GECE1_DEVAM', 'SAB2_A'),
];
const ara2 = [
  C('A2_LEYLA', 'ARALEYLA_GERI'),
  C('A2_MUZAFFER', 'MUZ_DEFTER', 'MUZ_GORDU', 'MUZ_TANIK', 'MUZ_GERI'),
  arsiv,
  tahta2,
  C('A2_HALIL', 'AH_SINAN', 'AH_DOSYALAR', 'AH_GECE', 'AH_HAZIR', 'AH_GERI'),
  C('A2_SUC', 'SUC_A', 'SUC_VER', 'GO_T', 'SON_A', 'TK_A'),
];

// --- 2. celse ---
const bayramTam = (ifsa: boolean) => [
  C('T00_DEVAM', 'T00S_DEVAM', 'T01_DEVAM'),
  press('B1'),
  present('ded_yetkisiz', 'B1'),
  press('B2'),
  present('ded_iki_hikaye', 'B2'),
  object('g_duyum', 'B2'),
  press('B3'),
  present('ded_bos_oda', 'B3'),
  press('B4'),
  present('ev_cihaz', 'B4'),
  press('B5'),
  ...(ifsa ? [present('ded_tek_kisi', 'B5')] : []),
  C('T01T_BITIR'),
];
const sinanTam = [
  C('T02_DEVAM'),
  press('S1'),
  present('ded_alibi', 'S1'),
  press('S2'),
  present('ev_santral', 'S2'),
  press('S3'),
  present('ded_zarf_kaynagi', 'S3'),
  press('S4'),
  object('g_kanaat', 'S4'),
  present('ev_kirmizi_defter', 'S4'),
  C('T02T_BITIR', 'T02Y_DEVAM'),
];
const muzaffer = C('T03_DEVAM', 'T03Q_A', 'T03Q_B', 'T03Q_D', 'T03Q_BITTI', 'T03S_DEVAM');

// --- GÖREVİ KÖTÜYE KULLANMA: kayıtlar ayıklanmaz, zarf açıklanamaz; terditli savunma. ---
const gorev = [
  intro('STR_INDIRIM', 'BR00_B', 'BR01_B', 'SABAH_B', 'ILK_B'),
  mudur,
  C('A_HALIL'),
  hard('TP_SABAH'),
  soft('TP_BAYRAM'),
  soft('TP_KONTROL'),
  hard('TP_TELEFON'),
  soft('TP_ZEHRA'),
  C('G_YUZLES', 'TAV_A'),
  C('G_BITIR'),
  koridor,
  ifade,
  C('AK1_C'),
  C('A_LEYLA', 'LEYLA_GERI'),
  oda,
  komiser,
  C('A_ZEHRA', 'ZEH_NOT', 'ZEH_TAKVIM', 'ZEH_GERI'),
  C('A_CIKARIM'),
  combine('clue_takvim_214', 'clue_rehber_214'),
  combine('clue_dosya_devir2', 'clue_ihbar_icbar'),
  combine('clue_ihbar_icbar', 'clue_savcilik_anlasma'),
  combine('clue_kilit', 'clue_kamera_var'),
  C('CIKARIM_BITIR', 'A_SINAN', 'SIN_SABAH', 'SIN_HALIL', 'SIN_GERI', 'AK2_B'),
  C('A_LEYLA', 'LEYLA_GERI', 'A_DIL', 'DIL_CENGIZ', 'DIL_KESIF', 'DIL_SANTRAL', 'DIL_VER'),
  C('A_HALIL2'),
  soft('TP_CEKMECE'),
  C('G_BITIR'),
  C('A_TUTANAK'),
  examine('mag', 't2'),
  examine('cmp', 't4'),
  C('TUTANAK_BITIR', 'A_CIKARIM'),
  combine('clue_saat_tutanak', 'clue_kayit_durdu'),
  C('CIKARIM_BITIR', 'A_DOSYA', 'DOSYA_BITIR', 'GO_H1', 'GECE_B'),
  celse1Acilis,
  C('H101D_DEVAM', 'H101Q_A', 'H101Q_D', 'H101Q_E', 'H101Q_BITTI', 'H102_C', 'H103_D', 'H104_DEVAM'),
  press('K1'),
  press('K2'),
  present('ev_para', 'K2'),
  press('K3'),
  present('ded_bos_oda', 'K3'),
  press('K4'),
  C('H104_BITIR', 'RQ_SINAN', 'RQ_BITTI', 'H106_DEVAM', 'H106B_DEVAM', 'H107_DEVAM'),
  C('ARA_GIRIS_DEVAM', 'A2_LEYLA', 'ARALEYLA_GERI'),
  santral,
  C(
    'A2_BAYRAM',
    'BAY_A',
    'A2_HALIL',
    'AH_HAZIR',
    'AH_GERI',
    'A2_MUZAFFER',
    'MUZ_GORDU',
    'MUZ_GERI',
    'ARAK_A',
    'ARA_GECE1_DEVAM',
    'SAB2_A',
  ),
  C('A2_LEYLA', 'ARALEYLA_GERI'),
  arsiv,
  C('A2_DOSYA', 'ARADOSYA_BITIR', 'A2_DOSYA', 'ARADOSYA_BITIR'),
  C('A2_SUC', 'SUC_B', 'SUC_VER', 'GO_T', 'SON_B', 'TK_B'),
  C('T00_DEVAM', 'T00S_DEVAM', 'T01_DEVAM'),
  press('B1'),
  present('ded_yetkisiz', 'B1'),
  press('B2'),
  present('ded_iki_hikaye', 'B2'),
  press('B3'),
  C('T01T_BITIR', 'T02_DEVAM'),
  press('S1'),
  press('S2'),
  C('T02T_BITIR', 'T02Z_DEVAM', 'T035_B', 'T04_B', 'T045_DEVAM', 'T05_A', 'T07_C', 'T08_C'),
];

// --- MAHKÛMİYET: sert tonlar, eksik araştırma, dayanaksız itirazlar, duygusal savunma. ---
const mahkumiyet = [
  intro('STR_MASUMIYET', 'BR00_B', 'BR01_C', 'SABAH_B', 'ILK_B'),
  C('A_HALIL'),
  hard('TP_SABAH'),
  hard('TP_BAYRAM'),
  hard('TP_KONTROL'),
  hard('TP_CEKMECE'),
  hard('TP_TELEFON'),
  hard('TP_ZEHRA'),
  C('G_BITIR'),
  mudur,
  C('A_ODA'),
  tapCenter(OB_BARDAK),
  tapCenter(OB_SAKSI),
  tapCenter(OB_RAF),
  C('ODA_BITIR'),
  C('A_KORIDOR'),
  tapCenter(OB_SEBIL),
  tapCenter(OB_DOLAP),
  C('KORIDOR_BITIR', 'AK1_B'),
  C(
    'A_KOMISER',
    'KOM_BASLA',
    'KOM_ODA',
    'KOM_PARA',
    'KOM_OGUL',
    'KOM_GERI',
    'A_SINAN',
    'SIN_BAYRAM',
    'SIN_HALIL',
    'SIN_GERI',
  ),
  C('A_IFADE'),
  examine('mag', 'i1'),
  examine('mag', 'i2'),
  C('IFADE_BITIR', 'A_CIKARIM'),
  combine('clue_zarf_stok', 'clue_ihbar_icbar'),
  C('CIKARIM_BITIR', 'A_ZEHRA', 'ZEH_TAKVIM', 'ZEH_NOT', 'ZEH_GERI', 'AK2_B'),
  C('A_DIL', 'DIL_CENGIZ', 'DIL_KESIF', 'DIL_VER', 'A_HALIL2'),
  C('G_YUZLES_X', 'G_BITIR', 'A_TUTANAK'),
  examine('cmp', 't1'),
  C('TUTANAK_BITIR', 'A_KARAR'),
  examine('cmp', 'k1'),
  C('KARAR_BITIR', 'A_LEYLA', 'LEYLA_GERI', 'GO_H1', 'GECE_B'),
  C('HK_DEVAM', 'HK2_B', 'H100_DEVAM', 'H100B_DEVAM', 'H101_DEVAM'),
  C('H101I_DEVAM', 'H101Q_A', 'H101Q_E', 'H101Q_BITTI', 'H102_D', 'H103_B', 'H104_DEVAM'),
  press('K1'),
  press('K2'),
  press('K3'),
  C('H104_BITIR', 'RQ_BITTI', 'H106_DEVAM', 'H106B_DEVAM', 'H107_DEVAM'),
  C('ARA_GIRIS_B', 'A2_SUC', 'SUC_B', 'SUC_VER', 'A2_BAYRAM', 'BAY_B', 'A2_HALIL', 'AH_EZBER', 'AH_GERI'),
  C('A2_MUZAFFER', 'MUZ_GORDU', 'MUZ_GERI', 'ARAK_B', 'ARA_GECE1_DEVAM', 'SAB2_B'),
  C('A2_ARSIV'),
  tapCenter(OB_CILTLER),
  tapCenter(OB_ZIMMET),
  C('ARSIV_BITIR', 'A2_LEYLA', 'ARALEYLA_GERI'),
  C('A2_DOSYA', 'ARADOSYA_BITIR', 'A2_DOSYA', 'ARADOSYA_BITIR', 'A2_DOSYA', 'ARADOSYA_BITIR'),
  C('GO_T', 'SON_B', 'TK_B'),
  C('T00_DEVAM', 'T00S_DEVAM', 'T01_DEVAM'),
  press('B1'),
  press('B3'),
  C('T01T_BITIR', 'T02N_DEVAM', 'T035_B', 'T04_D', 'T045_DEVAM', 'T05_C', 'T07_D', 'T08_B'),
];

// --- ETİK: tipik yol, ama muhbire mahkemede ne söyleyeceği dikte edilir. ---
const ara1etik = [
  C('ARA_GIRIS_DEVAM', 'A2_LEYLA', 'ARALEYLA_GERI'),
  cihaz,
  santral,
  kamera,
  C('A2_BAYRAM', 'BAY_C', 'ARAK_A', 'ARA_GECE1_DEVAM', 'SAB2_A'),
];

// --- ÇÖKÜŞ (W): ikinci celsede yanlış deliller sunulur, güvenilirlik sıfıra iner. ---
const cokus = [
  C('T00_DEVAM', 'T00S_DEVAM', 'T01_DEVAM'),
  present('ev_sira_disi', 'B1'),
  present('ev_tutanak', 'B2'),
  present('ev_dinleme', 'B3'),
  present('ev_para', 'B1'),
  present('ev_ihbar', 'B4'),
  present('ev_halil_ifade', 'B3'),
  present('ded_hedef', 'B4'),
  C('COKUS_SON'),
];

void OB_MERDIVEN;

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E', finalMin: 10825, finalMax: 11965 },
        intro('STR_USUL'),
        gun1,
        gun2,
        gun3,
        celse1([]),
        ara1,
        ara2,
        bayramTam(false),
        C('T02N_DEVAM'),
        muzaffer,
        C('T035_A', 'T04_A', 'T045_DEVAM', 'T05_A', 'T07_B', 'T08_A'),
      ),
      goldenPath(
        'G_B',
        { outcome: 'BERAAT_B', finalMin: 12392, finalMax: 13698 },
        intro('STR_MASUMIYET'),
        gun1,
        gun2,
        gun3,
        celse1(['RQ_SINAN']),
        ara1,
        ara2,
        bayramTam(true),
        sinanTam,
        muzaffer,
        C('T035_A', 'T04_A', 'T045_DEVAM', 'T05_D', 'T07_A', 'T08_A'),
      ),
      goldenPath(
        'G_E2',
        { outcome: 'BERAAT_E', finalMin: 10454, finalMax: 11556 },
        intro('STR_USUL', 'BR00_A'),
        gun1,
        gun2,
        gun3,
        celse1([], komiserKismi),
        ara1,
        ara2,
        bayramTam(true),
        C('T02B_DEVAM'),
        muzaffer,
        C('T035_B', 'T04_B', 'T045_DEVAM', 'T05_B', 'T07_B', 'T08_A'),
      ),
      goldenPath('G_GOREV', { outcome: 'GOREV', finalMin: 5182, finalMax: 5728 }, gorev),
      goldenPath('G_M', { outcome: 'MAHKUMIYET', finalMin: 594, finalMax: 656 }, mahkumiyet),
      goldenPath(
        'G_ETIK',
        { outcome: 'ETIK', finalMin: 10625, finalMax: 11745 },
        intro('STR_USUL'),
        gun1,
        gun2,
        gun3,
        celse1([]),
        ara1etik,
        ara2,
        bayramTam(false),
        C('T02N_DEVAM'),
        muzaffer,
        C('T035_A', 'T04_A', 'T045_DEVAM', 'T05_A', 'T07_B', 'T08_A'),
      ),
      goldenPath(
        'W',
        { outcome: 'MAHKUMIYET', finalMin: 7756, finalMax: 8574 },
        intro('STR_USUL'),
        gun1,
        gun2,
        gun3,
        celse1([]),
        ara1,
        ara2,
        cokus,
      ),
    ],
  },
};
