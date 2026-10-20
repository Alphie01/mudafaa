import {
  categories,
  CASE_FORMAT_ID,
  counter,
  flags,
  hiddenEnum,
  hiddenInt,
  labelEnum,
  meter,
  thresholdBar,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { p1, p2 } from './shared.js';

// 00-meta: künye, skor yapılandırması, yüklemler ve değişkenler.
// TODO: künyeyi lineup satırına göre doldur; eşikleri sonuç koşullarıyla birlikte ayarla (kılavuz §4).

export const meta: CasePart = {
  format: CASE_FORMAT_ID,
  meta: {
    slug: 'silinen-dosyalar',
    number: 13,
    title: 'TODO Dava başlığı',
    crimeLabel: 'TODO Suç adı',
    lawRef: 'TODO TCK md.',
    demandText: 'İddianame: TODO (alt–üst sınır)',
    possibleSentence: 'TODO yıl',
    difficulty: 1,
    category: 'CEZA',
    estimatedMinutes: 100,
    summary: 'TODO Oyuncunun dava kartında gördüğü iki üç cümlelik özet.',
    coverCharacter: 'muvekkil',
    legalReview: { status: 'PENDING' },
  },
  config: {
    startNode: 'PROLOG',
    scoring: {
      categories: categories({
        HUKUKI_BILGI: {
          weak: 'TODO: suç tipi ve ceza hesabını tekrar et.',
          strong: 'Vasıf ve ceza hesabında isabetlisin.',
        },
        DELIL_ANALIZI: { weak: 'TODO: ipuçlarını tahtada birleştir.', strong: 'Delilleri ustaca birbirine bağladın.' },
        ARASTIRMA: { weak: 'TODO: olay yerini ve kayıtları sistematik tara.', strong: 'Araştırman eksiksizdi.' },
        SORGULAMA: { weak: 'TODO: önce bastır, sonra sun.', strong: 'Çapraz sorgun tanığı çözdü.' },
        SAVUNMA_STRATEJISI: {
          weak: 'TODO: delille desteklenen bir esas savunma kur.',
          strong: 'Stratejin davayı kazandırdı.',
        },
        USUL_BILGISI: { weak: 'TODO: delil yasakları ve itiraz dayanakları.', strong: 'Usul itirazların yerindeydi.' },
      }),
      lines: [
        { id: 'delil', label: 'Delil toplama', categories: ['ARASTIRMA', 'DELIL_ANALIZI'] },
        { id: 'capraz', label: 'Çapraz sorgu', categories: ['SORGULAMA'] },
        { id: 'itiraz', label: 'İtiraz isabeti ({{var.legal_hits}})', categories: ['USUL_BILGISI', 'HUKUKI_BILGI'] },
        { id: 'savunma', label: 'Savunma', categories: ['SAVUNMA_STRATEJISI'] },
        { id: 'hatali', label: 'Hatalı delil ({{var.wrong}})' },
      ],
      bonuses: [{ id: 'guven', label: 'Güvenilirlik bonusu', value: { mul: [{ var: 'cred' }, 100] } }],
      scaleMax: 3000,
      // Bantların `from` değerleri sonuç koşullarındaki final eşikleriyle aynı olmalı (THRESHOLD_MISMATCH).
      thresholdBar: thresholdBar([
        ['Mahkûmiyet', 0, 'red'],
        ['İndirim', 1000, 'amber'],
        ['Beraat', 1800, 'green'],
      ]),
      displayClampMin: 0,
    },
    objectionGrounds: [],
    display: { showRunningScore: true },
  },
  predicates: [
    {
      id: 'kart2',
      label: 'Tahtada en az 2 kart var',
      when: { cmp: [{ count: 'evidence', tag: 'kart' }, '>=', 2] },
    },
  ],
  variables: [
    labelEnum('strategy', 'Strateji', ['YOK', 'MASUMIYET', 'USUL', 'INDIRIM']),
    hiddenInt('strategy_pct', 100, 0, 200),
    ...p1.variables(),
    ...p2.variables(),
    meter('trust', 'Güven', 'percentBar', 60, 100, { lowAt: 40 }),
    meter('min', 'Kalan süre', 'minutes', 12, 12, { lowAt: 4 }),
    meter('taps', 'Büyüteç', 'counter', 5, 5, { lowAt: 1, resource: true }),
    meter('exam_left', 'Deneme hakkı', 'counter', 6, 6, { lowAt: 2, resource: true }),
    meter('cred', 'Güvenilirlik', 'hearts', 5, 5, { lowAt: 1 }),
    meter('pers', 'Heyet iknası', 'meter10', 2, 10),
    hiddenEnum('tone', ['soft', 'hard']),
    counter('wrong'),
    counter('legal_hits'),
    counter('ethics'),
    ...flags(
      'in_court',
      'fact_gece',
      'fact_tanik',
      'rapor_istendi',
      'suc_duyurusu',
      'press_s1',
      'contra_s1',
      'contra_s2',
      'key_excluded',
      'gercek_fail',
      'terditli',
      'cokus',
    ),
  ],
};
