import {
  L,
  N,
  cont,
  courtSession,
  dec,
  discover,
  inc,
  meet,
  option,
  raise,
  says,
  story,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { HEAR1, court1, p2 } from './shared.js';

// 60-hearing-1: 1. celse (tensip sonrası ilk duruşma: kimlik, iddianame, sanık savunması, ilk itiraz) ve ters köşe
// (~12–18 dk). TODO: 1. celsede en az bir A–D usul kararı ve bir sanık savunması kararı olsun.

export const hearing1: CasePart = {
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_delil', 'DELIL_TARTISMA', 'H1_01'],
      ]),
    ],
  },
  nodes: [
    court1.stage('H1_00', {
      title: 'Duruşma · 1. Celse',
      courtStage: 'ACILIS',
      onFirstEnter: [raise('in_court'), meet('baskan'), meet('uye'), meet('savci'), meet('mubasir')],
      lines: says(
        L('mubasir', 'TODO dosyası! Taraflar salona.'),
        L('baskan', 'Sanığın kimliği tespit edildi. İddianame okundu; sanığa hakları hatırlatıldı.'),
      ),
      choices: [cont('H100_DEVAM', 'Devam', 'H1_01')],
    }),
    court1.objection('H1_01', {
      title: 'Savcılık delili',
      courtStage: 'DELIL_TARTISMA',
      prosecutionEvidence: 'ev_iddia',
      say: [L('savci', 'TODO savcılık delili okundu.'), L('baskan', 'Müdafi, diyeceğiniz?')],
      next: 'H1_02',
      options: [
        option('H101_A', 'TODO doğru itiraz (madde)', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'TODO doğru itirazın gerekçesi.',
        }),
        option('H101_B', 'TODO zayıf ama meşru itiraz', {
          score: { DELIL_ANALIZI: 50 },
          good: 'TODO kısmen isabetli.',
        }),
        option('H101_C', 'TODO dayanaksız itiraz', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'TODO neden dayanaksız.',
        }),
        option('H101_D', 'Diyeceğimiz yok', { neutral: 'TODO fırsat kaçtı.' }),
      ],
    }),
    story('H1_02', {
      ...HEAR1,
      title: 'Ara karar · ters köşe',
      hud: ['cred', 'pers'],
      onFirstEnter: [discover('ev_yeni'), ...p2.start()],
      lines: says(
        L('baskan', 'Eksik hususların tamamlanması için duruşma ertelendi.'),
        N('TODO ters köşe: koridorda dosyayı değiştiren yeni bilgi.'),
        L('leyla', 'TODO mentorun yorumu; ikinci evrede neye bakmalı?'),
      ),
      choices: [cont('H102_DEVAM', 'Soruşturmaya dön', 'INV2_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
