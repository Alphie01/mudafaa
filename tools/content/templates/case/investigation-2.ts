import { L, choiceNode, conversation, nav, option, raise, says } from '__KIT__';
import type { CasePart } from '__KIT__';
import { INV2, p2 } from './shared.js';

// 70-investigation-2: ters köşeden sonraki 2. evre (2 gün × 2 eylem puanı) (~20–30 dk).
// TODO: yeni tanık(lar), yeni mekân, gecikmeli teslimler; 2. celsenin çapraz sorgusunu besleyen bilgiler.

const dayEnd = p2.dayEnd({ ...INV2, title: 'Gün sonu', continueId: 'INV2_DAY_NEXT' });

export const investigation2: CasePart = {
  nodes: [
    p2.hub({
      ...INV2,
      title: 'TODO İkinci evre',
      lines: p2.dayLines(['GÜN 1/2 · 2. celseye 8 gün var.', 'GÜN 2/2 · 2. celseye 4 gün var.']),
      tabs: [
        {
          id: 't2_tanik',
          label: 'TANIKLAR',
          kind: 'PEOPLE',
          choices: [p2.activity('A2_TANIK', 'TODO yeni tanıkla konuş', 'INV2_TANIK', { once: true })],
        },
        {
          id: 't2_arsiv',
          label: 'ARŞİV',
          kind: 'ARCHIVE',
          choices: [p2.activity('A2_SUC', 'TODO suç duyurusu', 'INV2_SUC', { once: true })],
        },
      ],
      choices: [
        nav('GO_T', 'DURUŞMAYA GİT · 2. CELSE', 'T_00', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
        }),
      ],
    }),
    dayEnd.node,
    conversation('INV2_TANIK', {
      ...INV2,
      title: 'TODO Yeni tanık',
      room: { label: 'TODO MEKÂN', character: 'tanik' },
      lines: says(L('tanik', 'TODO tanığın ilk sözü.')),
      choices: [
        option('T2_SOR', 'TODO doğru soru', {
          score: { SORGULAMA: 50 },
          good: 'TODO neden doğru.',
          responses: says(L('tanik', 'TODO yanıt.')),
          next: '$return',
        }),
        option('T2_BASKI', 'Baskı yap', {
          score: { USUL_BILGISI: -100 },
          bad: 'TCK 277: tanığı etkilemeye teşebbüs.',
          responses: says(L('tanik', 'Beni tehdit mi ediyorsunuz?', 'kizgin')),
          next: '$return',
        }),
      ],
    }),
    choiceNode('INV2_SUC', {
      ...INV2,
      title: 'TODO Suç duyurusu',
      prompt: 'TODO kimin hakkında, hangi dayanakla?',
      next: '$return',
      choices: [
        option('SUC_A', 'TODO somut dayanaklı suç duyurusu (CMK 158)', {
          score: { USUL_BILGISI: 40 },
          effects: [raise('suc_duyurusu')],
          good: 'TODO somut şüpheye dayalı.',
        }),
        option('SUC_B', 'TODO dayanaksız suçlama', {
          score: { USUL_BILGISI: -40 },
          bad: 'Somut dayanaksız; iftira riski (TCK 267).',
        }),
      ],
    }),
  ],
  triggers: [dayEnd.trigger],
  discoveryPaths: dayEnd.discoveryPaths,
};
