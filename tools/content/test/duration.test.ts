import { mergeCaseParts } from '@mudafaa/case-schema';
import { compile } from '@mudafaa/engine';
import { describe, expect, it } from 'vitest';
import {
  CASE_FORMAT_ID,
  L,
  always,
  categories,
  character,
  cont,
  goldenPath,
  outcome,
  resultNode,
  says,
  sharedSprite,
  step,
  story,
  thresholdBar,
} from '../src/kit/index.js';
import {
  READING_WPM,
  SECONDS_PER_ACTION,
  countWords,
  durationReport,
  estimateActions,
  formatDuration,
  judgeTypical,
  minutesOf,
  WORD_BUDGET,
} from '../src/lib/duration.js';

// Süre tahmini: elle sayılabilen küçük bir fikstür. Sayılan metinler:
//   başlangıç: satır "bir iki üç" (3) + seçenek "Devam et" (2) = 5
//   sonuç: yanıt "Tamam bitti" (2) + ceza "Ceza yok" (2) + hüküm "Beraatine karar verildi" (3)
//          + gerekçe "Şüpheden sanık yararlanır" (3) + gerekçe "Devam et" (yinelenen metin: 0) = 10
// Toplam 15 sözcük, 1 aksiyon.

const advice = { weak: 'w' };
const tiny = mergeCaseParts([
  {
    format: CASE_FORMAT_ID,
    meta: {
      slug: 'tiny',
      number: 97,
      title: 'Tiny',
      crimeLabel: 'x',
      lawRef: 'x',
      demandText: 'x',
      possibleSentence: 'x',
      difficulty: 1,
      category: 'CEZA',
      estimatedMinutes: 1,
      summary: 'x',
      coverCharacter: 'a',
      legalReview: { status: 'PENDING' },
    },
    config: {
      startNode: 'S',
      scoring: {
        categories: categories({
          HUKUKI_BILGI: advice,
          DELIL_ANALIZI: advice,
          ARASTIRMA: advice,
          SORGULAMA: advice,
          SAVUNMA_STRATEJISI: advice,
          USUL_BILGISI: advice,
        }),
        lines: [],
        bonuses: [],
        scaleMax: 100,
        thresholdBar: thresholdBar([['Beraat', 0, 'green']]),
      },
      objectionGrounds: [],
      display: { showRunningScore: false },
    },
    predicates: [],
    variables: [],
    sprites: [sharedSprite('avukat')],
    characters: [
      character('a', { name: 'A', shortLabel: 'A', role: 'COUNSEL', accent: '#000000', spriteId: 'avukat' }),
    ],
    relationships: [],
    evidence: [],
    evidenceRelations: [],
    discoveryPaths: [],
    scenes: [],
    court: { sessions: [] },
    nodes: [
      story('S', {
        lines: says(L('narrator', 'bir iki üç')),
        choices: [cont('C', 'Devam et', 'R', { responses: says(L('a', 'Tamam bitti')) })],
      }),
      resultNode('R'),
    ],
    triggers: [],
    outcomes: [
      outcome('O', {
        class: 'ACQUITTAL',
        priority: 1,
        when: always,
        stamp: 'BERAAT',
        stampTone: 'green',
        sentence: 'Ceza yok',
        verdictText: 'Beraatine karar verildi',
        reasoning: [{ text: 'Şüpheden sanık yararlanır' }, { text: 'Devam et' }],
        legalBasis: 'x',
        xp: 0,
        howToReach: 'x',
      }),
    ],
    report: { hints: [] },
    assets: [],
    tests: { goldenPaths: [goldenPath('TIPIK', { outcome: 'O' }, step.choose('C'))] },
  },
]);

describe('case:duration', () => {
  const c = compile(tiny);
  if (!c.ok) throw new Error(JSON.stringify(c.issues));

  it('sabitler tek yerde: 180 sözcük/dk, aksiyon başına 6 sn', () => {
    expect(READING_WPM).toBe(180);
    expect(SECONDS_PER_ACTION).toBe(6);
    expect(minutesOf(1800, 100)).toBe(20);
  });

  it('countWords yalnızca harf/rakam içeren parçaları sayar', () => {
    expect(countWords('“Ben yapmadım!” — dedi; 23.15’te.')).toBe(4);
    expect(countWords('  ')).toBe(0);
  });

  it('küçük fikstürde beklenen sözcük, aksiyon ve dakika', () => {
    const e = estimateActions(c.c, 'TIPIK', [step.choose('C')]);
    expect(e).toEqual({ name: 'TIPIK', words: 15, actions: 1, minutes: minutesOf(15, 1), outcome: 'O', final: 0 });
    expect(e.minutes).toBe(0.2);
  });

  it('tipik yol hedef dışıysa raporda işaretlenir', () => {
    const r = durationReport(c.c);
    expect(r.inRange).toBe(false);
    expect(r.typical?.words).toBe(15);
    const text = formatDuration(r);
    expect(text).toMatch(/TİPİK YOL \(TIPIK\): 0\.2 dk {2}✗ SÜRE HEDEF DIŞI \(90–120 dk\)/);
    expect(text).toMatch(/HİKÂYE YOK: 15 sözcük < 10000 taban/);
    expect(text).toMatch(/KAPI: ✗ KALDI/);
  });

  it('kısa metinli dava süreyi aksiyonla şişirerek geçemez; sözcük bütçesi ve süre birlikte gerekir', () => {
    const est = (words: number, actions: number) => ({
      name: 'TIPIK',
      words,
      actions,
      minutes: minutesOf(words, actions),
    });
    // 5 000 sözcük + 700 aksiyon ≈ 97,8 dk: süre tutar ama sözcük tabanı altında.
    expect(judgeTypical(est(5_000, 700))).toEqual({ words: 'FLOOR', inRange: false });
    expect(judgeTypical(est(12_000, 300))).toEqual({ words: 'LOW', inRange: true });
    expect(judgeTypical(est(16_000, 150))).toEqual({ words: 'OK', inRange: true });
    expect(judgeTypical(est(25_000, 200))).toEqual({ words: 'OK', inRange: false });
    expect(WORD_BUDGET).toEqual({ floor: 10_000, min: 15_000, max: 25_000 });
  });

  it('reddedilen aksiyon hata olarak raporlanır', () => {
    expect(estimateActions(c.c, 'X', [step.choose('YOK')]).error).toMatch(/1\. aksiyon reddedildi/);
  });
});
