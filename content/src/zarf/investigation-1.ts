import {
  L,
  N,
  back,
  choiceNode,
  costOf,
  dec,
  deductionBoard,
  documentExam,
  examine,
  fallback,
  flag,
  inc,
  interview,
  mood,
  nav,
  objective,
  option,
  raise,
  recipe,
  ref,
  row,
  sceneSearch,
  set,
  says,
  tool,
  topic,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { INV1, p1 } from './shared.js';

// 50-investigation-1: 1. evre (2 gün × 3 eylem puanı). Hub sekmeleri, olay yeri araması, müvekkil görüşmesi
// (konu × ton), belge incelemesi, delil dilekçesi (gecikmeli teslim) ve çıkarım tahtası (~25–35 dk).
// TODO: gerçek davada 3–6 tanık/mekân, 2–3 gün; her etkinlik anlamlı bir karar ya da bilgi vermeli.

const dayEnd = p1.dayEnd({
  ...INV1,
  title: 'Gün sonu',
  continueId: 'INV1_DAY_NEXT',
  // `requires` tutarsa o günün sonunda gelir; tutmazsa DISCOVER yok sayılır.
  deliveries: [{ evidence: 'ev_rapor', requires: flag('rapor_istendi'), hint: 'TODO: raporu dilekçeyle iste.' }],
});

export const investigation1: CasePart = {
  nodes: [
    p1.hub({
      ...INV1,
      title: 'TODO Olay yeri',
      lines: p1.dayLines(['GÜN 1/2 · 1. celseye 10 gün var.', 'GÜN 2/2 · 1. celseye 5 gün var.']),
      scenePreview: { scene: 'sc_olay' },
      tabs: [
        {
          id: 't_olay',
          label: 'OLAY YERİ',
          kind: 'SCENE',
          choices: [p1.activity('A_ARAMA', 'Olay yeri fotoğraflarını ara', 'INV1_ARAMA', { once: true })],
        },
        {
          id: 't_cezaevi',
          label: 'CEZAEVİ',
          kind: 'PEOPLE',
          choices: [p1.activity('A_GORUS', 'Müvekkille görüş', 'INV1_GORUSME', { once: true })],
        },
        {
          id: 't_arsiv',
          label: 'ARŞİV',
          kind: 'ARCHIVE',
          choices: [
            p1.activity('A_BELGE', 'TODO belgeyi incele', 'INV1_BELGE', { once: true }),
            p1.activity('A_DIL', 'Delil dilekçesi (CMK 177)', 'INV1_DIL', { once: true }),
            p1.free('A_CIKARIM', 'Çıkarım tahtası', 'INV1_CIKARIM', {
              description: '0 EP · ipuçlarını birleştir',
              enabledWhen: ref('kart2'),
              lockedReason: 'En az 2 ipucu gerekli.',
            }),
          ],
        },
      ],
      quickTalk: { character: 'muvekkil', line: '“TODO müvekkilin tek cümlelik iddiası.”', choices: ['A_GORUS'] },
      choices: [
        nav('GO_H1', 'DURUŞMAYA GİT · 1. CELSE', 'H1_00', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen bu evre biter. Emin misin?',
        }),
      ],
    }),
    dayEnd.node,
    sceneSearch('INV1_ARAMA', {
      ...INV1,
      title: 'TODO Olay yeri fotoğrafları',
      hud: ['taps'],
      exposeCounts: true,
      scene: 'sc_olay',
      instruction: 'Sahnede şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps',
      miss: fallback('FB_ARAMA', 'TAP', {
        score: { ARASTIRMA: -10 },
        feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
      }),
      finish: { id: 'ARAMA_BITIR' },
    }),
    interview('INV1_GORUSME', {
      ...INV1,
      title: 'Müvekkil Görüşmesi',
      hud: ['min', 'trust'],
      room: { label: 'CEZAEVİ · GÖRÜŞ ODASI', character: 'muvekkil' },
      lines: says(N('Görüş salonunun kapanışına 12 dakika var.')),
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
        { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla bilgi' },
      ],
      toneEffects: {
        soft: [inc('trust', 4), set('tone', 'soft')],
        hard: [dec('trust', 8), set('tone', 'hard')],
      },
      moodRules: [
        mood('Savunmada', 'error', 'kizgin', { cmp: [{ var: 'trust' }, '<', 40] }),
        mood('Gergin', 'neutral', 'kizgin', { cmp: [{ var: 'tone' }, '==', 'hard'] }),
        mood('Temkinli', 'neutral', 'normal'),
      ],
      objectives: [
        objective('obj_gece', flag('fact_gece'), 'TODO bilinen', 'TODO müvekkil o saatte neredeydi?'),
        objective('obj_tanik', flag('fact_tanik'), 'TODO bilinen', 'TODO tanık neden onu gösteriyor?'),
      ],
      topics: [
        topic('TP_GECE', 'O gece', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_gece')],
          tones: {
            soft: { prompt: 'O gece neler oldu, baştan anlatır mısın?', says: [L('muvekkil', 'TODO yumuşak yanıt.')] },
            hard: { prompt: 'Saat saat anlat.', says: [L('muvekkil', 'TODO sert yanıt; ek bilgi.', 'kizgin')] },
          },
        }),
        topic('TP_TANIK', 'Tanık', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_tanik')],
          tones: {
            soft: { prompt: 'Tanığı tanıyor musun?', says: [L('muvekkil', 'TODO yanıt.')] },
            hard: { prompt: 'Tanık neden seni gösteriyor?', says: [L('muvekkil', 'TODO yanıt.', 'kizgin')] },
          },
        }),
      ],
      finish: { id: 'G_BITIR' },
    }),
    documentExam('INV1_BELGE', {
      ...INV1,
      title: 'TODO Belge',
      hud: ['exam_left'],
      lines: says(N('Bir alet seç, sonra belgede şüpheli satıra dokun. Doğru alet + doğru yer = yeni ipucu.')),
      header: { left: 'TODO BELGE BAŞLIĞI', right: 'TODO TARİH' },
      columns: [
        { label: 'KİŞİ', flex: 1.4 },
        { label: 'SAAT', flex: 1 },
      ],
      rows: [
        row('r1', ['TODO Kişi 1', '08.00–16.00']),
        row('r2', ['TODO Kişi 2', '22.00–06.00'], { uv: { cells: ['TODO Kişi 2', '18.00 → 22.00'], tone: 'special' } }),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('uv', 'UV ışık', 'uv', 'UV')],
      costVar: 'exam_left',
      rules: [
        examine('EX_UV_R2', 'uv', 'r2', {
          discovers: 'clue_c',
          score: { DELIL_ANALIZI: 150 },
          feedback: {
            title: 'YENİ İPUCU',
            text: 'TODO UV ışıkta ne görüldü?',
            label: '+150 SKOR · Not defterine eklendi',
            tone: 'special',
          },
        }),
      ],
      miss: fallback('FB_BELGE', 'EXAMINE', {
        score: { DELIL_ANALIZI: -20 },
        feedback: {
          title: 'SONUÇ YOK',
          text: 'Bu aletle burada dikkat çeken bir şey bulamadın.',
          label: '−20 SKOR',
          tone: 'error',
        },
      }),
      finish: { id: 'BELGE_BITIR' },
    }),
    choiceNode('INV1_DIL', {
      ...INV1,
      title: 'Delil dilekçesi (CMK 177)',
      prompt: 'Mahkemeye delil dilekçesi: neyi isteyeceksin?',
      choices: [
        option('DIL_RAPOR', 'TODO raporun alınması', {
          score: { USUL_BILGISI: 20 },
          effects: [raise('rapor_istendi')],
          good: 'TODO: rapor gün sonunda gelir.',
          next: '$return',
        }),
        option('DIL_KESIF', 'Olay yerinde keşif', {
          neutral: 'TODO: keşif bugün bir şey göstermez.',
          next: '$return',
        }),
        back('DIL_GERI', 'Vazgeç'),
      ],
    }),
    deductionBoard('INV1_CIKARIM', {
      ...INV1,
      title: 'Çıkarım Tahtası',
      lines: says(N('İki ipucunu seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir DELİL doğar.')),
      pool: ['clue_a', 'clue_b', 'clue_c'],
      recipes: [
        recipe('CB_AB', 'clue_a', 'clue_b', {
          discovers: 'ded_ab',
          score: { DELIL_ANALIZI: 300 },
          feedback: { title: 'TODO çıkarım başlığı', text: 'TODO', label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
        }),
      ],
      miss: fallback('FB_CIKARIM', 'COMBINE', {
        repeat: 'ONCE_PER_PARAMS',
        score: { DELIL_ANALIZI: -50 },
        feedback: {
          title: 'Bu ikisi birbirini açıklamıyor',
          text: 'Başka bir ipucu dene.',
          label: 'BAĞLANTI YOK · −50 SKOR',
          tone: 'error',
        },
      }),
      finish: { id: 'CIKARIM_BITIR' },
    }),
  ],
  triggers: [dayEnd.trigger],
  discoveryPaths: dayEnd.discoveryPaths,
};
