import { TYPICAL_PATH, chooseAll, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { Action, CasePart } from '../../../tools/content/src/kit/index.js';
import {
  OB_ASANSOR,
  OB_CV,
  OB_KAMERA,
  OB_KAPI,
  OB_LAMBA,
  OB_LAPTOP,
  OB_NOT,
  OB_PANO,
  OB_SAKSI,
  OB_SERIT,
  OB_TELEFON,
  OB_TUP,
  OB_YONETIM,
} from './scenes.js';

// 99-tests: her sonuç için golden path. TIPIK = BERAAT_E (case:duration 90–120 dk ölçer).

const { choose, tapCenter, examine, combine, press, present, object } = step;
const C = chooseAll;
const soft = (topic: string): Action => choose(topic, 'soft');
const hard = (topic: string): Action => choose(topic, 'hard');

// --- Bölüm 1 ---
const intro = (strategy: string, ucret = 'BR00_C', ceza = 'BR01_A') =>
  C('PROLOG_DEVAM', 'PROLOG2_DEVAM', ucret, ceza, 'BR01K_DEVAM', 'BR01B_DEVAM', strategy, 'SABAH_A');

// --- Soruşturma ---
const oda = [
  C('A_ODA'),
  tapCenter(OB_CV),
  tapCenter(OB_LAMBA),
  tapCenter(OB_NOT),
  tapCenter(OB_LAPTOP),
  tapCenter(OB_TELEFON),
  C('ODA_BITIR'),
];
const odaYarim = [C('A_ODA'), tapCenter(OB_CV), tapCenter(OB_SERIT), tapCenter(OB_TELEFON), tap(5, 5), C('ODA_BITIR')];
function tap(x: number, y: number): Action {
  return step.tap(x, y);
}
const eceTam = [
  C('A_ECE'),
  soft('TP_ILAN'),
  soft('TP_PARA'),
  soft('TP_TELEFON'),
  soft('TP_KOD'),
  soft('TP_EKRAN'),
  C('G_YUZLES', 'TAV_A', 'G_BITIR'),
];
const hesap = [
  C('A_HESAP'),
  examine('mag', 'h2'),
  examine('mag', 'h1'),
  examine('cmp', 'h4'),
  examine('mag', 'h5'),
  C('HESAP_BITIR'),
];
const sikayet = [C('A_SIKAYET'), examine('mag', 's1'), examine('mag', 's2'), C('SIKAYET_BITIR')];
const om = [
  C('A_OM', 'OM_NOVA', 'OM_SOZLESME', 'OM_KORIDOR'),
  tapCenter(OB_PANO),
  tapCenter(OB_KAPI),
  tapCenter(OB_ASANSOR),
  C('KORIDOR_BITIR'),
];
const tahta1 = [
  C('A_CIKARIM'),
  combine('clue_cv', 'ev_not'),
  combine('clue_hr_no', 'clue_satici_no'),
  combine('clue_avans', 'clue_mdemir_cikis'),
  combine('clue_sgk_mesaj', 'ev_not'),
  combine('clue_kvkk_mesaj', 'ev_sim_dokum'),
  combine('clue_ding_ece', 'clue_ding_nurettin'),
  combine('clue_simyok', 'ev_sim_dokum'),
  C('CIKARIM_BITIR'),
];
const gun1 = [oda, eceTam, C('A_LEYLA', 'LEYLA_GERI'), hesap, sikayet, C('AK1_A')];
const gun2 = [
  C('A_LEYLA', 'LEYLA_GERI', 'A_OPERATOR', 'OP_A', 'A_SEVIM', 'SEV_BURAK', 'SEV_KUTU', 'SEV_ECE', 'SEV_GERI'),
  om,
  tahta1,
  C('A_GOKHAN', 'GOK_LOG', 'GOK_SIM', 'GOK_ECE', 'GOK_ATM', 'GOK_GERI', 'AK2_A'),
];
const gun3 = [
  C('A_LEYLA', 'LEYLA_GERI', 'A_DIL', 'DIL_LOG', 'DIL_HTS', 'DIL_BAYI', 'DIL_VER'),
  C(
    'A_BAYI',
    'BAY_SOR',
    'BAY_DOSYA',
    'BAY_GERI',
    'A_BURAK',
    'BUR_ALIBI',
    'BUR_IMEI',
    'BUR_TEKLIF',
    'BURT_RED',
    'A_ECE2',
  ),
  soft('TP_BURAK'),
  C('G_BITIR', 'GO_H1', 'GECE_A'),
];

// --- 1. celse ---
const celse1Acilis = C('HK_DEVAM', 'HK2_DEVAM', 'H100_DEVAM', 'H101_A', 'H102_DEVAM');
const gokhanTam = [
  press('G1'),
  present('ev_banka_log', 'G1'),
  press('G2'),
  present('ded_dongu', 'G2'),
  press('G3'),
  present('ev_sim_dokum', 'G3'),
  press('G4'),
  object('g_kanaat', 'G4'),
  press('G5'),
  present('ded_aldatma', 'G5'),
  C('H105_BITIR'),
];
const celse1 = [
  celse1Acilis,
  C(
    'H102D_DEVAM',
    'H102Q_A',
    'H102Q_B',
    'H102Q_C',
    'H102Q_BITTI',
    'H103_A',
    'H104_DEVAM',
    'H104Q_A',
    'H104Q_B',
    'H104Q_BITTI',
    'H105_DEVAM',
  ),
  gokhanTam,
  C('RQ_YASAK', 'RQ_BITTI', 'H107_DEVAM', 'H108_DEVAM', 'H109_A'),
];

// --- Ara ---
const belge = [
  C('A2_BELGE'),
  examine('mag', 'b1'),
  examine('chk', 'b2'),
  examine('mag', 'b4'),
  examine('cmp', 'b3'),
  C('BELGE_BITIR'),
];
const ara1 = (fourth: Action[]) => [
  C('ARA_GIRIS_DEVAM', 'A2_LEYLA', 'ARALEYLA_GERI'),
  belge,
  C('A2_SUC', 'SUC_A', 'SUC_C', 'SUC_VER', 'A2_ARDA', 'AR_A'),
  fourth,
  C('ARAK_A'),
];
const tahta2 = (necdet: boolean) => [
  C('A2_CIKARIM'),
  combine('clue_cv', 'clue_kartvizit'),
  combine('clue_iphone_imei', 'ev_hts'),
  combine('ev_banka_log', 'clue_iphone_imei'),
  combine('clue_parlama', 'clue_lamba'),
  combine('clue_arda_otopark', 'clue_yonetim_park'),
  combine('clue_vekil_arda', 'ev_sozlesme'),
  ...(necdet ? [combine('ev_imei_rapor', 'clue_kartvizit')] : []),
  C('ARA_CIKARIM_BITIR'),
];
const otopark = [C('A2_OTOPARK'), tapCenter(OB_YONETIM), tapCenter(OB_KAMERA), C('OTOPARK_BITIR')];
const ara2 = (third: Action[], necdet: boolean) => [
  C('A2_LEYLA', 'ARALEYLA_GERI'),
  otopark,
  C('A2_ECE', 'EC_HATIRLA', 'EC_SALON', 'EC_HAZIR', 'EC_GERI'),
  third,
  C('A2_BURAK', 'ABUR_A'),
  tahta2(necdet),
  C('GO_T', 'ARASON_DEVAM', 'KOR_A', 'KOR2_DEVAM'),
];
const gokhan2 = C('A2_GOKHAN', 'GK2_ZINCIR', 'GK2_KAYIT', 'GK2_IMEI', 'GK2_GERI');
const nurettin2 = C('A2_NURETTIN', 'NU_ES', 'NU_FOTO', 'NU_GERI');

// --- 2. celse ---
const arda = C('T00_DEVAM', 'T01_DEVAM', 'T01Q_A', 'T01Q_B', 'T01Q_BITTI', 'T02_DEVAM', 'T02P_A');
const onurTam = [
  press('O1'),
  present('ev_bayi_belge', 'O1'),
  press('O2'),
  present('ev_noter_yok', 'O2'),
  press('O3'),
  object('g_duyum', 'O3'),
  present('ev_arda_beyan', 'O3_EK'),
  press('O4'),
  C('T02T_BITIR', 'T03_DEVAM'),
];
const necdetE = [
  press('N1'),
  present('ev_arda_beyan', 'N1'),
  press('N2'),
  present('ded_bina', 'N2'),
  press('N3'),
  press('N4'),
  present('ded_otopark', 'N4'),
  C('T03T_BITIR', 'T035_A', 'MOLA_A'),
];
const necdetB = [
  press('N1'),
  present('ev_arda_beyan', 'N1'),
  press('N2'),
  present('ded_bina', 'N2'),
  press('N3'),
  present('ded_necdet', 'N3'),
  C('T03X_DEVAM', 'T035_A', 'MOLA_B'),
];

// --- İNDİRİM: kayıtlar istenmez, hattın ve cihazın elden çıktığı gösterilemez; terditli savunma. ---
const indirim = [
  C('PROLOG_DEVAM', 'PROLOG2_DEVAM', 'BR00_B', 'BR01_C', 'BR01K_DEVAM', 'BR01B_DEVAM', 'STR_INDIRIM', 'SABAH_B'),
  oda,
  C('A_ECE'),
  hard('TP_ILAN'),
  soft('TP_PARA'),
  hard('TP_TELEFON'),
  soft('TP_KOD'),
  soft('TP_EKRAN'),
  C('G_YUZLES', 'TAV_C', 'G_BITIR'),
  hesap,
  sikayet,
  C('AK1_C'),
  C('A_LEYLA', 'LEYLA_GERI', 'A_SEVIM', 'SEV_BURAK', 'SEV_GERI', 'A_OM', 'OM_NOVA', 'OM_GERI'),
  C('A_CIKARIM'),
  combine('clue_hr_no', 'clue_satici_no'),
  combine('clue_avans', 'clue_mdemir_cikis'),
  combine('clue_sgk_mesaj', 'ev_not'),
  combine('clue_ding_ece', 'clue_ding_nurettin'),
  C('CIKARIM_BITIR', 'A_GOKHAN', 'GOK_LOG', 'GOK_GERI', 'A_BURAK', 'BUR_ALIBI', 'BUR_GERI', 'AK2_B'),
  C('A_LEYLA', 'LEYLA_GERI', 'A_DIL', 'DIL_ATM', 'DIL_KESIF', 'DIL_NOVA', 'DIL_VER', 'A_ECE2'),
  soft('TP_ANNE'),
  soft('TP_BURAK'),
  C('G_BITIR', 'A_OPERATOR', 'OP_A', 'A_BAYI', 'BAY_SOR', 'BAY_GERI', 'GO_H1', 'GECE_B'),
  C('HK_DEVAM', 'HK2_DEVAM', 'H100_DEVAM', 'H101_D', 'H102_DEVAM', 'H102S_DEVAM', 'H102Q_A', 'H102Q_BITTI', 'H103_C'),
  C('H104_DEVAM', 'H104Q_A', 'H104Q_BITTI', 'H105_DEVAM'),
  press('G2'),
  present('ded_dongu', 'G2'),
  press('G1'),
  press('G3'),
  present('ded_aldatma', 'G5'),
  C('H105_BITIR', 'RQ_BITTI', 'H107_DEVAM', 'H108_DEVAM', 'H109_C'),
  C('ARA_GIRIS_DEVAM', 'A2_ARDA', 'AR_A', 'A2_SUC', 'SUC_A', 'SUC_VER', 'A2_GOKHAN', 'GK2_ZINCIR', 'GK2_GERI'),
  C('A2_NURETTIN', 'NU_ES', 'NU_GERI', 'ARAK_B'),
  C('A2_ECE', 'EC_HAZIR', 'EC_GERI', 'A2_OTOPARK'),
  tapCenter(OB_YONETIM),
  C('OTOPARK_BITIR', 'A2_BURAK', 'ABUR_A', 'GO_T', 'ARASON_DEVAM', 'KOR_C', 'KOR2_DEVAM'),
  C('T00_DEVAM', 'T02_DEVAM', 'T02P_A'),
  press('O1'),
  press('O2'),
  C('T02T_BITIR', 'T03_DEVAM'),
  press('N1'),
  press('N2'),
  C('T03T_BITIR', 'T035_C', 'MOLA_B', 'T04_B', 'T045_DEVAM', 'T05_B', 'T07_C', 'T08_C'),
];

// --- MAHKÛMİYET: sert tonlar, eksik araştırma, dayanaksız itirazlar, duygusal savunma. ---
const mahkumiyet = [
  C('PROLOG_DEVAM', 'PROLOG2_DEVAM', 'BR00_B', 'BR01_B', 'BR01K_DEVAM', 'BR01B_DEVAM', 'STR_MASUMIYET', 'SABAH_B'),
  odaYarim,
  C('A_ECE'),
  hard('TP_ILAN'),
  hard('TP_KOD'),
  hard('TP_PARA'),
  hard('TP_TELEFON'),
  C('G_BITIR', 'A_HESAP'),
  examine('cmp', 'h1'),
  examine('mag', 'h3'),
  C('HESAP_BITIR', 'A_SIKAYET'),
  examine('mag', 's3'),
  C('SIKAYET_BITIR', 'AK1_B'),
  C('A_SEVIM', 'SEV_BURAK', 'SEV_ECE', 'SEV_GERI', 'A_OM', 'OM_KAMERA', 'OM_NOVA', 'OM_SOZLESME', 'OM_KORIDOR'),
  tapCenter(OB_TUP),
  tapCenter(OB_SAKSI),
  tapCenter(OB_PANO),
  C('KORIDOR_BITIR'),
  C('A_BURAK', 'BUR_ALIBI', 'BUR_GERI', 'A_GOKHAN', 'GOK_ECE', 'GOK_SIM', 'GOK_GERI', 'AK2_B'),
  C('A_LEYLA', 'LEYLA_GERI', 'A_DIL', 'DIL_KESIF', 'DIL_NOVA', 'DIL_VER', 'A_ECE2'),
  hard('TP_BURAK'),
  hard('TP_ANNE'),
  C('G_BITIR', 'A_OPERATOR', 'OP_B', 'A_BAYI', 'BAY_DOSYA', 'BAY_GERI', 'GO_H1', 'GECE_C'),
  C('HK_DEVAM', 'HK2_DEVAM', 'H100_DEVAM', 'H101_B', 'H102_DEVAM', 'H102I_DEVAM', 'H102Q_A', 'H102Q_C', 'H102Q_BITTI'),
  C('H103_B', 'H104_DEVAM', 'H104Q_C', 'H104Q_BITTI', 'H105_DEVAM'),
  press('G1'),
  press('G2'),
  press('G4'),
  C('H105_BITIR', 'RQ_BERAAT', 'RQ_BITTI', 'H107_DEVAM', 'H108_DEVAM', 'H109_B'),
  C('ARA_GIRIS_DEVAM', 'A2_SUC', 'SUC_B', 'SUC_VER', 'A2_GOKHAN', 'GK2_ZINCIR', 'GK2_IMEI', 'GK2_GERI'),
  C('A2_NURETTIN', 'NU_ES', 'NU_GERI', 'A2_ECE', 'EC_HATIRLA', 'EC_HAZIR', 'EC_GERI', 'ARAK2_DEVAM'),
  C('A2_BURAK', 'ARABURAK_GERI', 'A2_ARDA', 'AR_B', 'A2_OTOPARK'),
  tapCenter(OB_KAMERA),
  tap(5, 290),
  C('OTOPARK_BITIR', 'GO_T', 'ARASON_DEVAM', 'KOR_B', 'KOR2_DEVAM'),
  C('T00_DEVAM', 'T02_DEVAM', 'T02P_C'),
  press('O1'),
  press('O3'),
  C('T02T_BITIR', 'T03_DEVAM'),
  press('N1'),
  press('N3'),
  C('T03T_BITIR', 'T035_B', 'MOLA_A', 'T04_D', 'T045_DEVAM', 'T05_C', 'T07_D', 'T08_B'),
];

// --- ETİK: Burak'ın yetkisiz bayi kaydı alınır ve duruşmada sunulur. ---
const gun3etik = [
  C('A_LEYLA', 'LEYLA_GERI', 'A_DIL', 'DIL_LOG', 'DIL_HTS', 'DIL_BAYI', 'DIL_VER'),
  C(
    'A_BAYI',
    'BAY_SOR',
    'BAY_DOSYA',
    'BAY_GERI',
    'A_BURAK',
    'BUR_ALIBI',
    'BUR_IMEI',
    'BUR_TEKLIF',
    'BURT_KABUL',
    'A_ECE2',
  ),
  soft('TP_BURAK'),
  C('G_BITIR', 'GO_H1', 'GECE_A'),
];
const celse1etik = [
  celse1Acilis,
  C(
    'H102D_DEVAM',
    'H102Q_A',
    'H102Q_B',
    'H102Q_C',
    'H102Q_BITTI',
    'H103_A',
    'H104_DEVAM',
    'H104Q_A',
    'H104Q_BITTI',
    'H105_DEVAM',
  ),
  press('G1'),
  present('ev_banka_log', 'G1'),
  press('G2'),
  present('ded_dongu', 'G2'),
  press('G3'),
  present('ev_bayi_ekran', 'G3'),
  present('ev_sim_dokum', 'G3'),
  C('H105_BITIR', 'RQ_BITTI', 'H107_DEVAM', 'H108_DEVAM', 'H109_A'),
];

// --- ÇÖKÜŞ (W): Ece kodu hiç anlatmaz; müdafi onu kürsüde kendi deliliyle yalanlar, ikinci celsede yanlış
// deliller sunar ve güvenilirlik sıfıra iner. ---
const gun1w = [
  oda,
  C('A_ECE'),
  soft('TP_ILAN'),
  soft('TP_PARA'),
  soft('TP_TELEFON'),
  soft('TP_KOD'),
  soft('TP_EKRAN'),
  C('G_BITIR', 'A_LEYLA', 'LEYLA_GERI'),
  hesap,
  sikayet,
  C('AK1_A'),
];
const celse1w = [
  celse1Acilis,
  C('H102I_DEVAM', 'H102Q_A', 'H102Q_C', 'H102Q_BITTI', 'H103_A', 'H104_DEVAM', 'H104Q_A', 'H104Q_BITTI', 'H105_DEVAM'),
  press('G1'),
  present('ev_banka_log', 'G1'),
  press('G3'),
  present('ev_sim_dokum', 'G3'),
  present('ded_aldatma', 'G5'),
  C('H105_BITIR', 'RQ_BITTI', 'H107_DEVAM', 'H108_DEVAM', 'H109_A'),
];
const cokus = [
  C('T00_DEVAM', 'T01_DEVAM', 'T01Q_A', 'T01Q_BITTI', 'T02_DEVAM', 'T02P_C'),
  present('ev_siber_rapor', 'O1'),
  present('ev_ece_ifade', 'O2'),
  present('ev_sikayet', 'O4'),
  present('ev_not', 'O1'),
  C('COKUS_SON'),
];

// --- BERAAT_E (ikinci yol): iş merkezine hiç gidilmez; İMEİ raporu kartvizitsiz kalır (kısmi sunum). ---
const gun2OmYok = [
  C('A_LEYLA', 'LEYLA_GERI', 'A_OPERATOR', 'OP_A', 'A_SEVIM', 'SEV_BURAK', 'SEV_KUTU', 'SEV_ECE', 'SEV_GERI'),
  C('A_BURAK', 'BUR_ALIBI', 'BUR_IMEI', 'BUR_TEKLIF', 'BURT_RED'),
  tahta1,
  C('A_GOKHAN', 'GOK_LOG', 'GOK_SIM', 'GOK_ECE', 'GOK_ATM', 'GOK_GERI', 'AK2_A'),
];
const gun3OmYok = [
  C('A_LEYLA', 'LEYLA_GERI', 'A_DIL', 'DIL_LOG', 'DIL_HTS', 'DIL_BAYI', 'DIL_VER'),
  C('A_BAYI', 'BAY_SOR', 'BAY_DOSYA', 'BAY_GERI', 'A_ECE2'),
  soft('TP_BURAK'),
  soft('TP_ANNE'),
  C('G_BITIR', 'GO_H1', 'GECE_A'),
];
const ara2OmYok = [
  C('A2_LEYLA', 'ARALEYLA_GERI'),
  otopark,
  C('A2_ECE', 'EC_HATIRLA', 'EC_HAZIR', 'EC_GERI'),
  gokhan2,
  C('A2_BURAK', 'ABUR_A'),
  C('A2_CIKARIM'),
  combine('clue_iphone_imei', 'ev_hts'),
  combine('ev_banka_log', 'clue_iphone_imei'),
  combine('clue_parlama', 'clue_lamba'),
  combine('clue_arda_otopark', 'clue_yonetim_park'),
  C('ARA_CIKARIM_BITIR', 'GO_T', 'ARASON_DEVAM', 'KOR_A', 'KOR2_DEVAM'),
];
const necdetE2 = [
  press('N1'),
  present('ev_arda_beyan', 'N1'),
  press('N2'),
  present('ded_bina', 'N2'),
  press('N3'),
  present('ev_imei_rapor', 'N3'),
  press('N4'),
  present('ded_otopark', 'N4'),
  C('T03T_BITIR', 'T035_A', 'MOLA_A'),
];

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E', finalMin: 10212, finalMax: 11288 },
        intro('STR_USUL'),
        gun1,
        gun2,
        gun3,
        celse1,
        ara1(nurettin2),
        ara2(gokhan2, false),
        arda,
        onurTam,
        necdetE,
        C('T04_A', 'T045_DEVAM', 'T05_A', 'T07_B', 'T08_A'),
      ),
      goldenPath(
        'G_B',
        { outcome: 'BERAAT_B', finalMin: 10530, finalMax: 11640 },
        intro('STR_MASUMIYET'),
        gun1,
        gun2,
        gun3,
        celse1,
        ara1(gokhan2),
        ara2(nurettin2, true),
        arda,
        onurTam,
        necdetB,
        C('T04_A', 'T045_DEVAM', 'T05_D', 'T07_A', 'T08_A'),
      ),
      goldenPath(
        'G_E2',
        { outcome: 'BERAAT_E', finalMin: 9842, finalMax: 10878 },
        intro('STR_USUL', 'BR00_A'),
        gun1,
        gun2OmYok,
        gun3OmYok,
        celse1,
        ara1(nurettin2),
        ara2OmYok,
        arda,
        onurTam,
        necdetE2,
        C('T04_A', 'T045_DEVAM', 'T05_B', 'T07_B', 'T08_A'),
      ),
      goldenPath('G_I', { outcome: 'INDIRIM', finalMin: 3985, finalMax: 4405 }, indirim),
      goldenPath(
        'G_ETIK_I',
        { outcome: 'ETIK_INDIRIM', finalMin: 3795, finalMax: 4195 },
        (indirim.flat(3) as Action[]).flatMap((x) =>
          x.kind === 'CHOOSE' && x.choiceId === 'BUR_GERI' ? C('BUR_TEKLIF', 'BURT_KABUL') : [x],
        ),
      ),
      goldenPath('G_M', { outcome: 'MAHKUMIYET', finalMin: 366, finalMax: 404 }, mahkumiyet),
      goldenPath(
        'G_ETIK2',
        { outcome: 'ETIK', finalMin: 220, finalMax: 250 },
        (mahkumiyet.flat(3) as Action[]).flatMap((x) =>
          x.kind !== 'CHOOSE'
            ? [x]
            : x.choiceId === 'BUR_GERI'
              ? C('BUR_TEKLIF', 'BURT_KABUL')
              : x.choiceId === 'T07_D'
                ? C('COKUS_SON')
                : x.choiceId === 'T08_B'
                  ? []
                  : [x],
        ),
      ),
      goldenPath(
        'G_ETIK',
        { outcome: 'ETIK_BERAAT', finalMin: 9339, finalMax: 10322 },
        intro('STR_MASUMIYET'),
        gun1,
        gun2,
        gun3etik,
        celse1etik,
        ara1(nurettin2),
        ara2(gokhan2, false),
        arda,
        onurTam,
        necdetE,
        C('T04_A', 'T045_DEVAM', 'T05_A', 'T07_B', 'T08_A'),
      ),
      goldenPath(
        'W',
        { outcome: 'MAHKUMIYET', finalMin: 5814, finalMax: 6426 },
        intro('STR_USUL'),
        gun1w,
        gun2,
        gun3,
        celse1w,
        ara1(nurettin2),
        ara2(gokhan2, false),
        cokus,
      ),
    ],
  },
};
