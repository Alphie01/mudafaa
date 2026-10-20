import {
  all,
  always,
  any,
  because,
  cmp,
  finalAtLeast,
  flag,
  not,
  outcome,
  v,
  xp,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 90-outcomes: en az dört sonuç sınıfı (lineup): 223/2-b beraat, 223/2-e beraat, indirim / farklı nitelendirme,
// mahkûmiyet (varsayılan, en sonda, koşulu `always`). Öncelikler benzersiz. Final eşikleri eşik çubuğunun `from`
// değerleriyle aynı olmalı. Ceza hesabı hüküm metninde adım adım yazılır (kılavuz §6).

export const outcomes: CasePart = {
  outcomes: [
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 1,
      when: all(
        not(flag('cokus')),
        flag('gercek_fail'),
        flag('contra_s2'),
        cmp(v('pers'), '>=', 7),
        finalAtLeast(1800),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık TODO’nun üzerine atılı suçu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; TODO tahliye, tazminat hakkı bildirimi (CMK 141/1-e, 142/2, 231/3), suç duyurusu; istinaf yolu açık olmak üzere.',
      reasoning: [
        because('TODO gerçek failin gösterildiği deliller.'),
        because('TODO hukuka aykırı delil hükme esas alınmadı.', flag('key_excluded')),
        because('Bu deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141/1-e, 142/2, 231/3',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach: 'TODO: gerçek faili gösteren delilleri birleştir; esas savunmada gerçek faili göster.',
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(not(flag('cokus')), any(flag('contra_s1'), flag('contra_s2')), finalAtLeast(1800)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık TODO’nun üzerine atılı suçu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; TODO tahliye ve tazminat hakkı bildirimi; istinaf yolu açık olmak üzere.',
      reasoning: [
        because('TODO teşhis güvenilirliğini yitirdi.', flag('contra_s2')),
        because('TODO tanığın beyanı çelişkili.', flag('contra_s1')),
        because(
          'Sanığın suçu işlediğine dair kesin ve inandırıcı delil yoktur; şüpheden sanık yararlanır (Anayasa 38/4, AİHS 6/2).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; AİHS 6/2',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach: 'TODO: tanığın çelişkisini delille çürüt.',
    }),
    outcome('INDIRIM', {
      class: 'REDUCED',
      priority: 3,
      when: all(not(flag('cokus')), flag('terditli'), finalAtLeast(1000)),
      stamp: 'İNDİRİM',
      stampTone: 'amber',
      sentence: 'TODO yıl TODO ay hapis',
      verdictText: 'TODO temel ceza → artırım → TCK 62/1 indirimi adım adım; TCK 53; TCK 63; istinaf (CMK 273/1).',
      reasoning: [because('TODO lehe hükümlerin gerekçesi.')],
      legalBasis: 'TODO TCK md., 62/1, 53, 63; CMK 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach: 'TODO: terditli savunma ile lehe hükümleri iste.',
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 4,
      when: always,
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      sentence: 'TODO yıl hapis',
      verdictText: 'TODO hüküm metni; TCK 53; TCK 63; istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because('TODO ceza hesabı.'),
        because('Savunmanın inandırıcılığı duruşmada çöktü; heyet iddianamedeki anlatımı esas aldı.', flag('cokus')),
      ],
      legalBasis: 'TODO TCK md., 53, 63; CMK 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach: 'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir.',
    }),
  ],
};
