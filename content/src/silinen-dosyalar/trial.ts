import {
  L,
  P,
  all,
  any,
  choiceNode,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  fallback,
  flag,
  ground,
  has,
  hl,
  ifThen,
  inc,
  mark,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  resultNode,
  says,
  score,
  statement,
  story,
  strategyAmount,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { TRIAL, VERDICT, court2 } from './shared.js';

// 80-trial: 2. celse (tanık dinleme + çapraz sorgu, delillerin tartışılması, mütalaa, esas savunma, son söz, hüküm)
// (~25–35 dk). TODO: gerçek davada 2–3 tanığın çapraz sorgusu ve 4–7 A–D usul kararı olsun.

const wrongEvidence = [dec('cred'), dec('pers'), inc('wrong')];

export const trial: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_kanaat', 'Tanığın kişisel kanaati'),
      ground('g_telkin', 'Telkin edici soru (CMK 201/1)', 'CMK 201/1'),
    ],
  },
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T_00'],
        ['s2_tanik', 'TANIK_DINLEME', 'T_01'],
        ['s2_delil', 'DELIL_TARTISMA', 'T_04'],
        ['s2_mutalaa', 'MUTALAA', 'T_05'],
        ['s2_savunma', 'SAVUNMA', 'T_06'],
        ['s2_son_soz', 'SON_SOZ', 'T_07'],
        ['s2_karar', 'KARAR', 'T_08'],
      ]),
    ],
  },
  nodes: [
    court2.stage('T_00', {
      title: 'Duruşma · 2. Celse',
      courtStage: 'ACILIS',
      lines: says(
        L('mubasir', 'TODO dosyası! Taraflar salona.'),
        L('baskan', 'Yoklama yapıldı; ara karar cevapları okundu.'),
      ),
      choices: [cont('T00_DEVAM', 'Devam', 'T_01')],
    }),
    court2.stage('T_01', {
      title: 'Tanık',
      courtStage: 'TANIK_DINLEME',
      witness: 'tanik',
      witnessLabel: 'TANIK · TODO',
      lines: says(
        L('mubasir', 'Tanık TODO!'),
        // Satırlar konuşma dilinde; madde atfı (CMK 58) kalite geri bildiriminde, raporda ve mentor açıklamasındadır.
        L('baskan', 'Kimliğiniz tespit edildi. Gerçeği söylemekle yükümlüsünüz.'),
      ),
      choices: [cont('T01_DEVAM', 'Tanık yemin ederek dinlensin', 'T_02')],
    }),
    court2.objection('T_02', {
      title: 'Savcının sorusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'tanik',
      witnessLabel: 'TANIK · TODO',
      say: [L('savci', 'Tanık, gördüğünüz kişi sanıktı, değil mi?')],
      next: 'T_03',
      options: [
        option('T02_A', 'İtiraz: telkin edici soru (CMK 201/1)', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits')],
          good: 'Telkin edici soru yasaktır (CMK 201/1); itiraz kabul edildi.',
        }),
        option('T02_B', 'Sessiz kal', { effects: [dec('pers')], neutral: 'Telkinli soru cevaplandı.' }),
        option('T02_C', 'Tanık yalan söylüyor!', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Dayanaksız suçlama; itiraz bir usul kuralına dayanmalı.',
        }),
      ],
    }),
    court2.testimony('T_03', {
      title: 'Çapraz sorgu',
      courtStage: 'TANIK_DINLEME',
      witness: 'tanik',
      witnessLabel: 'TANIK · TODO',
      say: [L('baskan', 'Tanık ifadesini kesintisiz verdi. Müdafi, sorularınız?')],
      rulesText: 'İpucu: Çelişkiyi bul ve doğru delille vur. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_kanaat', 'g_telkin'],
      statements: [
        statement('S1', 1, ['TODO ', hl('çelişkili parça', any(flag('press_s1'), has('ded_ab'))), ' TODO devamı.']),
        statement('S2', 2, ['TODO ikinci ifade; ', hl('bence o yaptı'), '.']),
      ],
      rules: [
        // Savcılık delilini savunma lehine sunmak: kural (bir kez), yanlış delil cezası + açıklayıcı yanıt.
        presentRule('PS_IDDIA', undefined, ['ev_iddia'], {
          effects: [
            ...wrongEvidence,
            score('SORGULAMA', -150, 'hatali'),
            mark('BAD', 'TODO bu delil iddianın dayanağı.', 'SORGULAMA'),
          ],
          responses: says(L('savci', 'Sayın Başkan, müdafi bizim delilimizi sunuyor.'), L('baskan', 'Devam edin.')),
        }),
        pressRule('PR_S1', 'S1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s1')],
          responses: says(P('TODO bastırma sorusu?'), L('tanik', 'TODO yanıt.')),
        }),
        presentRule('PS_S1', 'S1', ['ded_ab', 'ev_tanik_kolluk'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s1'), mark('GOOD', 'TODO çelişki çürütüldü.', 'SORGULAMA')],
          responses: says(L('tanik', 'TODO tanık geri adım atar.', 'saskin')),
        }),
        pressRule('PR_S2', 'S2', {
          score: { SORGULAMA: 25 },
          responses: says(P('TODO bastırma sorusu?'), L('tanik', 'TODO yanıt.')),
        }),
        presentRule('PS_S2', 'S2', ['ev_rapor', 'ev_yeni'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s2'), mark('GOOD', 'TODO teşhis çöktü.', 'SORGULAMA')],
          responses: says(L('tanik', 'TODO …belki yanılmışımdır.', 'uzgun')),
        }),
        objectRule('OB_S2', 'S2', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), mark('GOOD', 'İtiraz yerinde: tanık kanaatini aktarıyor.', 'SORGULAMA')],
          responses: says(L('baskan', 'İtiraz yerinde. Tanık, yalnızca gördüklerinizi anlatın.')),
        }),
      ],
      presentMiss: fallback('FB_T03_PRESENT', 'PRESENT', {
        effects: [...wrongEvidence, score('SORGULAMA', -150, 'hatali'), mark('BAD', 'Yanlış delil.', 'SORGULAMA')],
        responses: says(L('baskan', 'Bu delilin ifadeyle ilgisi görülmedi.')),
      }),
      objectMiss: fallback('FB_T03_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: says(L('baskan', 'İtiraz reddedildi.')),
      }),
      finish: { id: 'T03_BITIR', next: 'T_04' },
    }),
    court2.objection('T_04', {
      title: 'Savcılık delilinin tartışılması',
      courtStage: 'DELIL_TARTISMA',
      prosecutionEvidence: 'ev_iddia',
      say: [L('baskan', 'Müdafi, delile karşı diyeceğiniz?')],
      next: 'T_05',
      options: [
        option('T04_A', 'TODO hukuka aykırı delil: Anayasa 38/6, CMK 206/2-a, 217/2', {
          score: { USUL_BILGISI: 150 },
          effects: [raise('key_excluded'), inc('legal_hits'), inc('pers')],
          good: 'TODO delil hükme esas alınamaz.',
        }),
        option('T04_B', 'TODO ispat gücü yok', {
          score: { DELIL_ANALIZI: 75 },
          good: 'TODO tek başına irtibat kurmaz.',
        }),
        option('T04_C', 'TODO yanlış dayanak', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'TODO neden yanlış.',
        }),
        option('T04_D', 'Diyeceğimiz yok', { bad: 'TODO itiraz edilmedi.', category: 'USUL_BILGISI' }),
      ],
    }),
    court2.objection('T_05', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      say: [
        L('savci', 'TODO mütalaa: sanığın TCK md. uyarınca cezalandırılmasına karar verilmesini talep ederim.'),
        L('baskan', 'Müdafi, mütalaaya karşı diyeceğiniz?'),
      ],
      next: 'T_06',
      options: [
        option('T05_A', 'TODO cevap: hukuka aykırı delil hükme esas alınamaz (CMK 217/2, 230/1-b)', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits')],
          good: 'Cevap hakkını yerinde kullandın (CMK 216/2).',
        }),
        option('T05_B', 'Cevap yok'),
        option('T05_C', 'Mütalaa tutanaktan çıkarılsın', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Mütalaa tutanaktan çıkarılamaz (CMK 216/2).',
        }),
      ],
    }),
    choiceNode('T_06', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      prompt: L('baskan', 'Müdafi, esas hakkındaki savunmanızı yapın.'),
      next: 'T_07',
      choices: [
        option('T06_A', 'Gerçek fail başkası: CMK 223/2-b', {
          effects: [
            ifThen(
              all(flag('contra_s2'), has('ev_yeni'), flag('suc_duyurusu')),
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')),
                inc('pers'),
                raise('gercek_fail'),
                mark('GOOD', 'TODO gerçek fail iddiası delillerle örtüşüyor.', 'SAVUNMA_STRATEJISI'),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100),
                dec('pers'),
                mark('BAD', 'Gerçek fail iddiası delille desteklenmedi.', 'SAVUNMA_STRATEJISI'),
              ],
            ),
          ],
        }),
        option('T06_B', 'Şüpheden sanık yararlanır: CMK 223/2-e', {
          effects: [
            ifThen(
              any(flag('contra_s1'), flag('contra_s2')),
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')),
                inc('pers'),
                mark('GOOD', 'TODO teşhis çöktü; kalan şüphe sanık lehine.', 'SAVUNMA_STRATEJISI'),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100),
                mark('BAD', 'Şüphe savunması için yeterli bulgu ortaya konmadı.', 'SAVUNMA_STRATEJISI'),
              ],
            ),
          ],
        }),
        option('T06_C', 'Öncelikle beraat; aksi hâlde lehe hükümler (terditli)', {
          score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
          effects: [raise('terditli')],
          good: 'Terditli savunma meşru bir yoldur.',
        }),
        option('T06_D', 'Duygusal saldırı', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Duygusal söylem delilin yerini tutmaz.',
        }),
      ],
    }),
    choiceNode('T_07', {
      ...court2.base,
      title: 'Son söz',
      prompt: L('baskan', 'Sanık, son sözünüz?'),
      next: 'T_08',
      choices: [
        option('T07_A', '“TODO kısa ve onurlu son söz.”', {
          score: { SAVUNMA_STRATEJISI: 25 },
          good: 'Kısa ve onurlu bir son söz.',
        }),
        option('T07_B', 'Ağlayarak merhamet dilesin', {
          neutral: 'TCK 62/2: şeklî tutum tek başına indirim nedeni değildir.',
        }),
      ],
    }),
    decisionNode('T_08', [{ to: 'R_KARAR' }], {
      ...TRIAL,
      lines: says(L('baskan', 'Hüküm fıkrası ayakta dinlenir.')),
    }),
    story('T_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      lines: says(L('baskan', 'Sanık, kısaca son sözünüz?')),
      choices: [cont('COKUS_SON', 'Son söz: “Ben yapmadım.”', 'T_08')],
    }),
    resultNode('R_KARAR', { ...VERDICT, title: 'Karar Açıklandı' }),
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(flag('in_court'), cmp(v('cred'), '<=', 0)),
      effects: [raise('cokus')],
      goto: 'T_COKUS',
    },
  ],
};
