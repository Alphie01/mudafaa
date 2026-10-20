import { flag, hint, missedEvidence, not } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 95-report: dava sonu raporundaki "kaçırdıkların". Her önemli delil ve bilgi için bir ipucu; metin oyuncuya neyi
// nerede kaçırdığını ve hukuki dayanağını söyler.

export const report: CasePart = {
  report: {
    hints: [
      missedEvidence('h_a', 'clue_a', 'TODO: olay yerindeki A bulgusunu kaçırdın.', 'ARASTIRMA'),
      missedEvidence('h_c', 'clue_c', 'TODO: belgeye UV tutmadın.', 'DELIL_ANALIZI'),
      missedEvidence('h_ded', 'ded_ab', 'TODO: A ile B’yi tahtada birleştirmedin.', 'DELIL_ANALIZI'),
      hint(
        'h_suc',
        not(flag('suc_duyurusu')),
        'TODO: gerçek faile giden yol suç duyurusuydu (CMK 158).',
        'USUL_BILGISI',
      ),
    ],
  },
};
