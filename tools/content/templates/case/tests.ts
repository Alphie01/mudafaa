import { TYPICAL_PATH, chooseAll, goldenPath, step } from '__KIT__';
import type { CasePart } from '__KIT__';
import { OB_A, OB_B } from './scenes.js';

// 99-tests: her sonuç için en az bir golden path; tipik oyun `TIPIK` adıyla (case:duration bunu 90–120 dk hedefiyle
// ölçer; çoğunlukla 223/2-e yolu). Adımlar gün / celse gruplarıyla yazılır. Final pencerelerini (`finalMin`/`finalMax`)
// ilk başarılı derlemeden sonra ölçülen değerin ±%5'i olarak koy.

const { choose, tapCenter, examine, combine, press, present } = step;

const gun1 = [
  choose('A_ARAMA'),
  tapCenter(OB_A),
  tapCenter(OB_B),
  choose('ARAMA_BITIR'),
  choose('A_GORUS'),
  choose('TP_GECE', 'soft'),
  choose('TP_TANIK', 'soft'),
  choose('G_BITIR'),
  ...chooseAll('A_DIL', 'DIL_RAPOR', 'INV1_DAY_NEXT'),
];
const gun2 = [
  choose('A_BELGE'),
  examine('uv', 'r2'),
  choose('BELGE_BITIR'),
  choose('A_CIKARIM'),
  combine('clue_a', 'clue_b'),
  choose('CIKARIM_BITIR'),
  choose('GO_H1'),
];
const celse1 = chooseAll('H100_DEVAM', 'H101_A', 'H102_DEVAM');
const evre2 = chooseAll('A2_TANIK', 'T2_SOR', 'A2_SUC', 'SUC_A', 'INV2_DAY_NEXT', 'GO_T');
const caprazSorgu = [
  ...chooseAll('T00_DEVAM', 'T01_DEVAM', 'T02_A'),
  press('S1'),
  present('ded_ab', 'S1'),
  press('S2'),
  present('ev_rapor', 'S2'),
  choose('T03_BITIR'),
];

export const tests: CasePart = {
  tests: {
    goldenPaths: [
      goldenPath(
        TYPICAL_PATH,
        { outcome: 'BERAAT_E' },
        chooseAll('BR01_A', 'STR_USUL'),
        gun1,
        gun2,
        celse1,
        evre2,
        caprazSorgu,
        chooseAll('T04_A', 'T05_A', 'T06_B', 'T07_A'),
      ),
      goldenPath(
        'G_B',
        { outcome: 'BERAAT_B' },
        chooseAll('BR01_A', 'STR_MASUMIYET'),
        gun1,
        gun2,
        celse1,
        evre2,
        caprazSorgu,
        chooseAll('T04_A', 'T05_A', 'T06_A', 'T07_A'),
      ),
      goldenPath(
        'G_I',
        { outcome: 'INDIRIM' },
        chooseAll('BR01_A', 'STR_INDIRIM', 'A_ARAMA'),
        tapCenter(OB_A),
        tapCenter(OB_B),
        chooseAll('ARAMA_BITIR', 'A_GORUS'),
        choose('TP_GECE', 'soft'),
        chooseAll('G_BITIR', 'A_BELGE'),
        examine('uv', 'r2'),
        chooseAll('BELGE_BITIR', 'INV1_DAY_NEXT', 'A_CIKARIM'),
        combine('clue_a', 'clue_b'),
        chooseAll('CIKARIM_BITIR', 'GO_H1'),
        celse1,
        chooseAll('GO_T', 'T00_DEVAM', 'T01_DEVAM', 'T02_A', 'T03_BITIR', 'T04_A', 'T05_A', 'T06_C', 'T07_A'),
      ),
      goldenPath(
        'G_M',
        { outcome: 'MAHKUMIYET' },
        chooseAll('BR01_B', 'STR_MASUMIYET', 'GO_H1', 'H100_DEVAM', 'H101_D', 'H102_DEVAM', 'GO_T'),
        chooseAll('T00_DEVAM', 'T01_DEVAM', 'T02_B', 'T03_BITIR', 'T04_D', 'T05_B', 'T06_D', 'T07_B'),
      ),
      goldenPath(
        'W',
        { outcome: 'MAHKUMIYET' },
        chooseAll('BR01_A', 'STR_USUL', 'GO_H1', 'H100_DEVAM', 'H101_C', 'H102_DEVAM', 'GO_T'),
        chooseAll('T00_DEVAM', 'T01_DEVAM', 'T02_C'),
        present('ev_iddia', 'S1'),
        present('ev_tanik_kolluk', 'S2'),
        present('ev_yeni', 'S1'),
        choose('COKUS_SON'),
      ),
    ],
  },
};
