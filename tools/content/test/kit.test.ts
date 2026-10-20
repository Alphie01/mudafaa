import { CasePackage, ChoiceDef, NodeDef, mergeCaseParts } from '@mudafaa/case-schema';
import { act, compile, start } from '@mudafaa/engine';
import { runGoldenPaths } from '@mudafaa/validator';
import { describe, expect, it } from 'vitest';
import {
  DuplicateIdError,
  assertUniqueIds,
  court,
  discover,
  findDuplicateIds,
  option,
  phase,
  topic,
  withDiscoveryPaths,
  xp,
} from '../src/kit/index.js';
import type { CaseParts } from '../src/kit/index.js';
import { miniParts } from './fixtures/mini-case.js';

// Yazım kiti: yardımcıların çıktısı şemaya birebir uyar, birleşen parçalar derlenir ve oynanır, yinelenen kimlik yazım
// anında yakalanır.

const merged = (parts: CaseParts) =>
  mergeCaseParts(
    Object.keys(parts)
      .sort()
      .map((k) => parts[k]),
  );

describe('yazım kiti', () => {
  it('örnek davanın parçaları şemaya uyar, derlenir ve golden path’ler geçer', () => {
    const pkg = merged(miniParts());
    expect(CasePackage.safeParse(pkg).success).toBe(true);
    const c = compile(pkg);
    if (!c.ok) throw new Error(JSON.stringify(c.issues, null, 2));
    expect(c.warnings).toEqual([]);
    for (const r of runGoldenPaths(c.c)) expect(r, JSON.stringify(r)).toMatchObject({ passed: true });
  });

  it('her node ve seçenek tek başına şemadan geçer (yardımcılar ek alan sızdırmaz)', () => {
    const pkg = merged(miniParts()) as CasePackage;
    for (const n of pkg.nodes) {
      expect(NodeDef.safeParse(n).success, n.id).toBe(true);
      for (const ch of n.choices) expect(ChoiceDef.parse(ch)).toEqual(ch);
    }
  });

  it('option: discovers → score → effects sırası ve good kalitesinin kategorisi', () => {
    const ch = option('X', 'Etiket', {
      discovers: 'ev',
      score: { USUL_BILGISI: 100, HUKUKI_BILGI: 5 },
      effects: [{ type: 'VAR', var: 'v', op: 'inc', value: 1 }],
      good: 'İyi.',
      next: 'N',
    });
    expect(ch).toEqual({
      id: 'X',
      kind: 'OPTION',
      label: 'Etiket',
      next: 'N',
      effects: [
        { type: 'DISCOVER', evidence: 'ev' },
        { type: 'SCORE', category: 'USUL_BILGISI', amount: 100 },
        { type: 'SCORE', category: 'HUKUKI_BILGI', amount: 5 },
        { type: 'VAR', var: 'v', op: 'inc', value: 1 },
      ],
      quality: { q: 'GOOD', feedback: 'İyi.', category: 'USUL_BILGISI' },
    });
    expect(option('N', 'n', { neutral: 'Nötr.', score: { ARASTIRMA: 1 } }).quality).toEqual({
      q: 'NEUTRAL',
      feedback: 'Nötr.',
    });
    expect(() => option('Y', 'y', { good: 'a', bad: 'b' })).toThrow(/en çok biri/);
  });

  it('topic: ton etiketleri ve says kısaltması varyanta dönüşür', () => {
    const t = topic('T', 'Konu', {
      tones: { soft: { says: [{ speaker: 'narrator', text: 'a' }] }, hard: { prompt: 'p' } },
    });
    expect(t.variants).toEqual([
      { id: 'soft', label: 'Yumuşak', responses: [{ lines: [{ speaker: 'narrator', text: 'a' }] }] },
      { id: 'hard', label: 'Sert', prompt: 'p' },
    ]);
  });

  it('phase: gün sonu node’u, tetikleyici ve gün devri Dava #07 kalıbıyla aynı', () => {
    const p = phase({ hub: 'H', dayEnd: 'E', trigger: 'tg', dayVar: 'day', apVar: 'ap', days: 3, ap: 3 });
    const { node, trigger } = p.dayEnd({ continueId: 'NEXT' });
    expect(trigger).toEqual({
      id: 'tg',
      scope: 'H',
      priority: 1,
      when: {
        all: [{ cmp: [{ var: 'ap' }, '<=', 0] }, { cmp: [{ var: 'day' }, '<', 3] }],
      },
      goto: 'E',
    });
    expect(node.onEnter).toEqual([
      { type: 'VAR', var: 'day', op: 'inc', value: 1 },
      { type: 'VAR', var: 'ap', op: 'set', value: 3 },
    ]);
    expect(p.activity('A', 'a', 'X')).toMatchObject({
      kind: 'NAVIGATE',
      cost: [{ var: 'ap', amount: 1 }],
      next: { push: 'X' },
    });
  });

  it('court: kürsü bir kez yazılır, testimony fallback’siz kurulamaz', () => {
    const salon = court({ bench: [['h', 'BAŞKAN', 0.5]], counsel: 'av', hud: ['cred'], chapter: 'C' });
    expect(salon.stage('S')).toMatchObject({
      type: 'COURTROOM',
      mode: 'STAGE',
      chapter: 'C',
      hud: ['cred'],
      stage: {
        banner: 'ADALET MÜLKÜN TEMELİDİR',
        bench: [{ character: 'h', label: 'BAŞKAN', xFrac: 0.5 }],
        counsel: 'av',
      },
    });
    expect(() =>
      salon.testimony('T', {
        witness: 'w',
        statements: [],
        rules: [],
        presentMiss: option('X', 'x'),
        finish: { id: 'F', next: 'N' },
      }),
    ).toThrow(/PRESENT fallback/);
  });

  it('xp: ⌊final/10 × f⌋, etik ihlalinde yarı', () => {
    expect(xp(1.2)).toEqual({ div: [{ mul: [{ score: 'final' }, 120] }, 1000] });
    expect(xp(0)).toBe(0);
    expect(xp(0.85, { ethicsVar: 'ethics' })).toMatchObject({
      if: { then: { div: [{ mul: [{ score: 'final' }, 85] }, 2000] } },
    });
    expect(() => xp(0.333)).toThrow(/iki ondalıklı/);
  });

  it('yinelenen kimlik: ad alanı ve parça:yol konumlarıyla raporlanır', () => {
    const parts = miniParts();
    const extra: CaseParts = { '45-ek': { nodes: [{ id: 'HUB', type: 'RESULT', choices: [] }] } };
    const dups = findDuplicateIds({ ...parts, ...extra });
    expect(dups).toContainEqual({ namespace: 'node', id: 'HUB', locations: ['40-akis:nodes[1]', '45-ek:nodes[0]'] });
    expect(() => assertUniqueIds({ ...parts, ...extra })).toThrow(DuplicateIdError);
    expect(() => assertUniqueIds({ ...parts, ...extra })).toThrow(/node "HUB": 40-akis:nodes\[1\], 45-ek:nodes\[0\]/);
    // Farklı ad alanlarında aynı kimlik serbesttir (Dava #07: belge satırı = karakter kimliği).
    expect(findDuplicateIds(parts)).toEqual([]);
  });

  it('withDiscoveryPaths: eksik koşulsuz yolları ekler, var olanlara dokunmaz', () => {
    const parts: CaseParts = {
      '10-a': {
        evidence: [],
        nodes: [
          { id: 'N', type: 'STORY', onEnter: [discover('e1')], choices: [option('C', 'c', { discovers: 'e2' })] },
        ],
        discoveryPaths: [{ evidence: 'e1', source: { type: 'NODE', id: 'N' }, requires: { flag: 'f' } }],
      },
    };
    expect(withDiscoveryPaths(parts)['10-a']?.discoveryPaths).toEqual([
      { evidence: 'e1', source: { type: 'NODE', id: 'N' }, requires: { flag: 'f' } },
      { evidence: 'e2', source: { type: 'CHOICE', id: 'C' } },
    ]);
  });

  it('gecikmeli teslim: istenmeyen rapor gün sonunda gelmez', () => {
    const c = compile(merged(miniParts()));
    if (!c.ok) throw new Error('derlenmedi');
    let s = start(c.c).state;
    for (const choiceId of ['BR_A', 'A_ARA', 'ARA_BITIR']) {
      const r = act(c.c, s, { kind: 'CHOOSE', choiceId });
      if (!r.ok) throw new Error(`${choiceId}: ${r.code}`);
      s = r.state;
    }
    expect(s.nodeId).toBe('DAY_END');
    expect(s.evidence.ev_gec).toBeUndefined();
  });
});
