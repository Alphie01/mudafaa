import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CASE_FORMAT, CasePackage } from '@mudafaa/case-schema';
import type { ChoiceDef, NodeDef } from '@mudafaa/case-schema';
import { acceptsUnchanged, clone, loadMiniCase, pathsOf, rejects, rejectsInvalidIdAt, withValueAt } from './helpers.js';

const raw = loadMiniCase();

describe('mini-case fixture', () => {
  it('mini-case.json parses as CasePackage', () => {
    const result = CasePackage.safeParse(loadMiniCase());
    expect(result.error?.issues ?? []).toEqual([]);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(raw);
  });

  it('is exported as @mudafaa/case-schema/fixtures/mini-case.json', async () => {
    const pkg = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8')) as {
      exports: Record<string, unknown>;
    };
    expect(pkg.exports['./fixtures/*']).toBe('./fixtures/*');
    const module = (await import('@mudafaa/case-schema/fixtures/mini-case.json', { with: { type: 'json' } })) as {
      default: unknown;
    };
    expect(module.default).toEqual(raw);
  });
});

// Sonraki görevlerin testleri (motor, doğrulayıcı) bu kimliklere ve sayılara dayanır: tablo Task 7 brief'inden
// birebir alınmıştır. Fikstür değişirse burası kırılır.
describe('mini-case fixture follows the Task 7 table', () => {
  const pkg = CasePackage.parse(loadMiniCase());
  const nodes = new Map(pkg.nodes.map((node) => [node.id, node]));
  const nodeOf = (id: string): NodeDef => {
    const node = nodes.get(id);
    if (node === undefined) throw new Error(`node yok: ${id}`);
    return node;
  };
  const choiceOf = (nodeId: string, choiceId: string): ChoiceDef => {
    const choice = nodeOf(nodeId).choices.find((c) => c.id === choiceId);
    if (choice === undefined) throw new Error(`seçenek yok: ${nodeId}/${choiceId}`);
    return choice;
  };
  const score = (category: string, amount: unknown, line?: string) =>
    line === undefined ? { type: 'SCORE', category, amount } : { type: 'SCORE', category, amount, line };
  const setVar = (name: string, op: string, value: unknown) => ({ type: 'VAR', var: name, op, value });

  it('meta, config, court and assets', () => {
    expect(pkg.format).toBe(CASE_FORMAT);
    expect(pkg.meta).toMatchObject({
      slug: 'mini-case',
      number: 0,
      title: 'Mini Dava',
      crimeLabel: 'Hırsızlık',
      lawRef: 'TCK 141',
      demandText: 'İddianame: TCK 141',
      possibleSentence: '1–3 yıl',
      difficulty: 1,
      category: 'CEZA',
      estimatedMinutes: 5,
      coverCharacter: 'k',
      legalReview: { status: 'APPROVED', by: 'test', at: '2026-10-20' },
    });
    expect(pkg.config.startNode).toBe('n_brief');
    expect(pkg.config.objectionGrounds).toEqual([]);
    expect(pkg.config.display).toEqual({ showRunningScore: true });
    expect(pkg.court).toEqual({
      sessions: [
        {
          id: 'cs2',
          title: '2. Celse',
          stages: [
            { id: 'stg_tanik', type: 'TANIK_DINLEME', entryNode: 'n_court1' },
            { id: 'stg_delil', type: 'DELIL_TARTISMA', entryNode: 'n_obj' },
          ],
        },
      ],
    });
    expect(pkg.assets).toEqual([{ id: 'img_sc1', kind: 'IMAGE', path: 'assets/sc1.png' }]);
    expect(pkg.predicates).toMatchObject([{ id: 'p_strong', when: { cmp: [{ var: 'pers' }, '>=', 5] } }]);
  });

  it('variables', () => {
    const table: [
      id: string,
      initial: number,
      min?: number,
      max?: number,
      visibility?: string,
      widget?: string,
      analysis?: string,
    ][] = [
      ['day', 1, 1, 3, 'VISIBLE', 'pips'],
      ['ap', 3, 0, 3, 'VISIBLE', 'pips'],
      ['trust', 50, 0, 100, 'VISIBLE', 'percentBar'],
      ['minutes', 6, 0, 6, 'VISIBLE', 'minutes'],
      ['taps', 3, 0, 3, 'VISIBLE', 'counter', 'resource'],
      ['exam', 2, 0, 2, 'VISIBLE', 'counter'],
      ['cred', 3, 0, 3, 'VISIBLE', 'hearts'],
      ['pers', 2, 0, 10, 'VISIBLE', 'meter10'],
      ['strategy_pct', 100, 0, 200, 'HIDDEN'],
      ['wrong', 0, undefined, undefined, 'HIDDEN', undefined, 'counter'],
    ];
    expect(pkg.variables.map((v) => v.id)).toEqual(table.map(([id]) => id));
    for (const [id, initial, min, max, visibility, widget, analysis] of table) {
      const v = pkg.variables.find((variable) => variable.id === id);
      expect(v, id).toBeDefined();
      expect({ type: v?.type, initial: v?.initial, min: v?.min, max: v?.max, visibility: v?.visibility }, id).toEqual({
        type: 'int',
        initial,
        min,
        max,
        visibility,
      });
      expect(v?.display?.widget, id).toBe(widget);
      expect(v?.analysis, id).toBe(analysis);
    }
  });

  it('characters and sprites', () => {
    expect(pkg.characters.map((c) => [c.id, c.role, c.spriteId])).toEqual([
      ['k', 'CLIENT', 's_k'],
      ['w', 'WITNESS', 's_w'],
      ['j', 'JUDGE', 's_j'],
      ['av', 'COUNSEL', 's_av'],
    ]);
    expect(pkg.sprites.map((s) => s.id)).toEqual(['s_k', 's_w', 's_j', 's_av']);
    // Satırlar design/reference/project/Sprite.dc.html'den (muvekkil, tanik, hakim, avukat_cubbe) birebir alındı:
    // hepsi 16 piksel genişliğinde; hâkimin gözleri çizilmez (tasarımdaki META).
    for (const sprite of pkg.sprites) {
      expect(
        sprite.rows.map((row) => row.length),
        sprite.id,
      ).toEqual(Array.from({ length: 20 }, () => 16));
    }
    expect(pkg.sprites.map((s) => [s.id, s.noEyes, s.noMouth, s.skin])).toEqual([
      ['s_k', undefined, undefined, undefined],
      ['s_w', undefined, undefined, undefined],
      ['s_j', true, undefined, undefined],
      ['s_av', undefined, undefined, undefined],
    ]);
    expect(pkg.sprites[0]?.rows[10]).toBe('...kkoowwookk...');
  });

  it('evidence', () => {
    expect(
      pkg.evidence.map((e) => [e.id, e.kind, e.presentable, e.combinable, e.countsInBag, e.initiallyKnown]),
    ).toEqual([
      ['e_key', 'EVIDENCE', true, false, true, true],
      ['e_doc', 'EVIDENCE', true, false, false, false],
      ['c_a', 'CLUE', false, true, false, false],
      ['c_b', 'CLUE', false, true, false, false],
      ['c_uv', 'CLUE', false, true, false, false],
      ['i_ab', 'INSIGHT', true, false, false, false],
    ]);
  });

  it('scene sc1: three hidden objects (Ruling 8)', () => {
    expect(pkg.scenes).toHaveLength(1);
    const scene = pkg.scenes[0];
    expect(scene).toMatchObject({ id: 'sc1', width: 100, height: 100, image: 'img_sc1' });
    expect(scene?.objects.map((o) => [o.id, o.marker, o.z])).toEqual([
      ['o_lamp', 'HIDDEN', undefined],
      ['o_cam', 'HIDDEN', undefined],
      ['o_cover', 'HIDDEN', 2],
    ]);
    const [lamp, cam, cover] = scene?.objects ?? [];
    expect(lamp?.shapes).toEqual([{ rect: { x: 10, y: 10, w: 20, h: 20 } }]);
    expect(lamp?.effects).toEqual([{ type: 'DISCOVER', evidence: 'c_a' }, score('ARASTIRMA', 40)]);
    expect(cam?.shapes).toEqual([{ circle: { cx: 70, cy: 70, r: 10 } }]);
    expect(cam?.effects).toEqual([{ type: 'DISCOVER', evidence: 'c_b' }, score('ARASTIRMA', 40)]);
    expect(cover?.shapes).toEqual([{ rect: { x: 20, y: 20, w: 10, h: 10 } }]);
    expect(cover?.effects).toBeUndefined();
    expect(cover?.feedback.text.length).toBeGreaterThan(0);
  });

  it('node ids, types and choices', () => {
    const table: [id: string, type: string, choices: [string, string][]][] = [
      [
        'n_brief',
        'STORY',
        [
          ['ch_str_a', 'OPTION'],
          ['ch_str_b', 'OPTION'],
        ],
      ],
      [
        'n_hub',
        'INVESTIGATION',
        [
          ['ch_go_scene', 'NAVIGATE'],
          ['ch_go_talk', 'NAVIGATE'],
          ['ch_go_doc', 'NAVIGATE'],
          ['ch_go_board', 'NAVIGATE'],
          ['ch_go_court', 'NAVIGATE'],
        ],
      ],
      [
        'n_talk',
        'DIALOGUE',
        [
          ['tp_night', 'TOPIC'],
          ['ch_show_a', 'OPTION'],
          ['ch_talk_end', 'CONTINUE'],
        ],
      ],
      [
        'n_scene',
        'SCENE',
        [
          ['fb_tap', 'FALLBACK'],
          ['ch_scene_end', 'CONTINUE'],
        ],
      ],
      [
        'n_doc',
        'DOCUMENT',
        [
          ['ex_uv_r2', 'EXAMINE'],
          ['ex_mag_r1', 'EXAMINE'],
          ['fb_ex', 'FALLBACK'],
          ['ch_doc_end', 'CONTINUE'],
        ],
      ],
      [
        'n_board',
        'DEDUCTION',
        [
          ['cb_ab', 'COMBINE'],
          ['fb_cb', 'FALLBACK'],
          ['ch_board_end', 'CONTINUE'],
        ],
      ],
      [
        'n_court1',
        'COURTROOM',
        [
          ['pr_st1', 'PRESS'],
          ['ps_st1', 'PRESENT'],
          ['fb_ps', 'FALLBACK'],
          ['ch_court_next', 'CONTINUE'],
        ],
      ],
      [
        'n_obj',
        'COURTROOM',
        [
          ['ob_a', 'OPTION'],
          ['ob_b', 'OPTION'],
        ],
      ],
      [
        'n_choice',
        'CHOICE',
        [
          ['cl_a', 'OPTION'],
          ['cl_b', 'OPTION'],
        ],
      ],
      ['n_ev', 'EVIDENCE', [['ev_ok', 'OPTION']]],
      ['n_dec', 'DECISION', []],
      ['n_story_good', 'STORY', [['ch_good_next', 'CONTINUE']]],
      ['n_collapse', 'STORY', [['ch_collapse_next', 'CONTINUE']]],
      ['n_result', 'RESULT', []],
    ];
    expect(pkg.nodes.map((n) => [n.id, n.type, n.choices.map((c) => [c.id, c.kind])])).toEqual(table);
  });

  it('HUD lists show visible variables only', () => {
    expect(pkg.nodes.filter((n) => n.hud !== undefined).map((n) => [n.id, n.hud])).toEqual([
      ['n_hub', ['day', 'ap']],
      ['n_talk', ['minutes', 'trust']],
      ['n_scene', ['taps']],
      ['n_doc', ['exam']],
      ['n_court1', ['cred', 'pers']],
      ['n_obj', ['cred', 'pers']],
    ]);
  });

  it('n_brief', () => {
    const node = nodeOf('n_brief');
    expect(node.type === 'STORY' && node.phase).toBe('BRIEFING');
    expect(node.onFirstEnter).toEqual([{ type: 'MEET', character: 'k' }]);
    expect(node.type === 'STORY' && node.blocks?.map((b) => b.type)).toEqual([
      'profileCard',
      'sentenceRange',
      'paragraph',
      'strengthList',
      'choiceGroup',
    ]);
    expect(node.type === 'STORY' && node.blocks?.[4]).toMatchObject({ type: 'choiceGroup', group: 'strategy' });
    expect(choiceOf('n_brief', 'ch_str_a')).toMatchObject({
      group: 'strategy',
      effects: [setVar('strategy_pct', 'set', 150)],
      next: 'n_hub',
    });
    expect(choiceOf('n_brief', 'ch_str_b')).toMatchObject({
      group: 'strategy',
      effects: [setVar('strategy_pct', 'set', 80)],
      next: 'n_hub',
    });
  });

  it('n_hub', () => {
    const node = nodeOf('n_hub');
    expect(node.type === 'INVESTIGATION' && node.tabs).toEqual([
      expect.objectContaining({ id: 't_scene', kind: 'SCENE', choices: ['ch_go_scene'] }),
      expect.objectContaining({ id: 't_people', kind: 'PEOPLE', choices: ['ch_go_talk'] }),
      expect.objectContaining({ id: 't_archive', kind: 'ARCHIVE', choices: ['ch_go_doc', 'ch_go_board'] }),
    ]);
    for (const [id, target] of [
      ['ch_go_scene', 'n_scene'],
      ['ch_go_talk', 'n_talk'],
      ['ch_go_doc', 'n_doc'],
    ] as const) {
      expect(choiceOf('n_hub', id), id).toMatchObject({ cost: [{ var: 'ap', amount: 1 }], next: { push: target } });
    }
    expect(choiceOf('n_hub', 'ch_go_board')).toMatchObject({ next: { push: 'n_board' } });
    expect(choiceOf('n_hub', 'ch_go_board').cost).toBeUndefined();
    expect(choiceOf('n_hub', 'ch_go_court').next).toBe('n_court1');
    expect(choiceOf('n_hub', 'ch_go_court').cost).toBeUndefined();
  });

  it('n_talk', () => {
    const node = nodeOf('n_talk');
    expect(node).toMatchObject({ type: 'DIALOGUE', mode: 'INTERVIEW', tones: [{ id: 'soft' }, { id: 'hard' }] });
    const topic = choiceOf('n_talk', 'tp_night');
    expect(topic.cost).toEqual([{ var: 'minutes', amount: 2 }]);
    expect(topic.variants?.map((v) => [v.id, v.effects])).toEqual([
      ['soft', [setVar('trust', 'inc', 4)]],
      ['hard', [setVar('trust', 'dec', 8), { type: 'DISCOVER', evidence: 'c_b' }]],
    ]);
    expect(topic.variants?.find((v) => v.id === 'soft')?.responses?.[0]?.lines.length).toBeGreaterThan(0);
    const show = choiceOf('n_talk', 'ch_show_a');
    expect(show).toMatchObject({ visibleWhen: { hasEvidence: 'c_a' }, cost: [{ var: 'minutes', amount: 2 }] });
    expect(show.effects).toMatchObject([score('ARASTIRMA', 200), { type: 'MARK', quality: 'GOOD' }]);
    expect(choiceOf('n_talk', 'ch_talk_end').next).toBe('$return');
  });

  it('n_scene', () => {
    const node = nodeOf('n_scene');
    expect(node).toMatchObject({ type: 'SCENE', scene: 'sc1', actionCosts: { TAP: [{ var: 'taps', amount: 1 }] } });
    // Gizli nesne sayısı görünüme yalnızca exposeCounts ile gider; Task 14 burada hiddenTotal 3 bekler (Ruling 8).
    expect(node.exposeCounts).toBe(true);
    expect(choiceOf('n_scene', 'fb_tap')).toMatchObject({ fallbackFor: 'TAP', effects: [score('ARASTIRMA', -10)] });
    expect(choiceOf('n_scene', 'ch_scene_end').next).toBe('$return');
  });

  it('n_doc', () => {
    const node = nodeOf('n_doc');
    expect(node).toMatchObject({
      type: 'DOCUMENT',
      tools: [
        { id: 'mag', icon: 'magnifier' },
        { id: 'uv', icon: 'uv', visualMode: 'UV' },
      ],
      rows: [
        { id: 'r1', cells: ['A', 'B'] },
        { id: 'r2', cells: ['C', 'D'], lens: { uv: { cells: ['C', 'D*'], tone: 'special' } } },
      ],
      actionCosts: { EXAMINE: [{ var: 'exam', amount: 1 }] },
    });
    expect(choiceOf('n_doc', 'ex_uv_r2')).toMatchObject({
      match: { tool: 'uv', target: 'r2' },
      effects: [{ type: 'DISCOVER', evidence: 'c_uv' }, score('DELIL_ANALIZI', 150)],
    });
    expect(choiceOf('n_doc', 'ex_mag_r1')).toMatchObject({
      match: { tool: 'mag', target: 'r1' },
      effects: [{ type: 'DISCOVER', evidence: 'e_doc' }, score('DELIL_ANALIZI', 100)],
    });
    expect(choiceOf('n_doc', 'fb_ex')).toMatchObject({
      fallbackFor: 'EXAMINE',
      effects: [score('DELIL_ANALIZI', -20)],
    });
    expect(choiceOf('n_doc', 'ch_doc_end').next).toBe('$return');
  });

  it('n_board', () => {
    expect(nodeOf('n_board')).toMatchObject({ type: 'DEDUCTION', pool: ['c_a', 'c_b', 'c_uv'] });
    expect(choiceOf('n_board', 'cb_ab')).toMatchObject({
      match: { a: 'c_a', b: 'c_b' },
      effects: [{ type: 'DISCOVER', evidence: 'i_ab' }, score('DELIL_ANALIZI', 300)],
    });
    expect(choiceOf('n_board', 'fb_cb')).toMatchObject({
      fallbackFor: 'COMBINE',
      repeat: 'ONCE_PER_PARAMS',
      effects: [score('DELIL_ANALIZI', -50)],
    });
    expect(choiceOf('n_board', 'ch_board_end').next).toBe('$return');
  });

  it('n_court1', () => {
    const node = nodeOf('n_court1');
    expect(node).toMatchObject({ type: 'COURTROOM', mode: 'TESTIMONY', stage: { witness: 'w', counsel: 'av' } });
    expect(node.type === 'COURTROOM' && node.statements?.map((s) => s.id)).toEqual(['st1', 'st2']);
    expect(node.type === 'COURTROOM' && node.statements?.[0]?.segments).toEqual([
      { text: 'Lamba ' },
      { text: 'yanıyordu', highlightWhen: { any: [{ hasEvidence: 'i_ab' }, { chosen: 'pr_st1' }] } },
    ]);
    expect(choiceOf('n_court1', 'pr_st1')).toMatchObject({
      match: { statement: 'st1' },
      effects: [score('SORGULAMA', 25)],
    });
    expect(choiceOf('n_court1', 'ps_st1')).toMatchObject({
      match: { statement: 'st1', evidence: ['i_ab', 'e_doc'] },
      effects: [score('SORGULAMA', 300), setVar('pers', 'inc', 2), { type: 'MARK', quality: 'GOOD' }],
    });
    expect(choiceOf('n_court1', 'fb_ps')).toMatchObject({
      fallbackFor: 'PRESENT',
      effects: [setVar('cred', 'dec', 1), setVar('wrong', 'inc', 1), score('SORGULAMA', -150, 'hatali')],
    });
    expect(choiceOf('n_court1', 'ch_court_next').next).toBe('n_obj');
  });

  it('n_obj, n_choice and n_ev', () => {
    expect(nodeOf('n_obj')).toMatchObject({
      type: 'COURTROOM',
      mode: 'OBJECTION',
      prosecutionEvidence: 'e_key',
      stage: { counsel: 'av' },
    });
    expect(choiceOf('n_obj', 'ob_a')).toMatchObject({
      effects: [score('USUL_BILGISI', 150), setVar('pers', 'inc', 1)],
      next: 'n_choice',
    });
    expect(choiceOf('n_obj', 'ob_b')).toMatchObject({
      effects: [setVar('cred', 'dec', 1), score('USUL_BILGISI', -50)],
      next: 'n_choice',
    });
    expect(choiceOf('n_choice', 'cl_a')).toMatchObject({
      effects: [score('SAVUNMA_STRATEJISI', { div: [{ mul: [200, { var: 'strategy_pct' }] }, 100] })],
      next: 'n_ev',
    });
    expect(choiceOf('n_choice', 'cl_b')).toMatchObject({ next: 'n_ev' });
    expect(choiceOf('n_choice', 'cl_b').effects).toBeUndefined();
    expect(nodeOf('n_ev')).toMatchObject({ type: 'EVIDENCE', evidence: 'e_key' });
    expect(choiceOf('n_ev', 'ev_ok').next).toBe('n_dec');
  });

  it('n_dec, n_story_good, n_collapse and n_result', () => {
    expect(nodeOf('n_dec')).toMatchObject({
      type: 'DECISION',
      routes: [{ when: { ref: 'p_strong' }, to: 'n_story_good' }, { to: 'n_result' }],
    });
    expect(choiceOf('n_story_good', 'ch_good_next').next).toBe('n_result');
    expect(choiceOf('n_collapse', 'ch_collapse_next').next).toBe('n_result');
    expect(nodeOf('n_result').choices).toEqual([]);
  });

  it('triggers', () => {
    expect(pkg.triggers).toEqual([
      {
        id: 'tg_day',
        scope: 'n_hub',
        priority: 1,
        when: { all: [{ cmp: [{ var: 'ap' }, '<=', 0] }, { cmp: [{ var: 'day' }, '<', 3] }] },
        effects: [setVar('day', 'inc', 1), setVar('ap', 'set', 3)],
      },
      { id: 'tg_collapse', priority: 0, once: true, when: { cmp: [{ var: 'cred' }, '<=', 0] }, goto: 'n_collapse' },
    ]);
  });

  it('outcomes', () => {
    expect(pkg.outcomes.map((o) => ({ id: o.id, priority: o.priority, when: o.when, xp: o.xp }))).toEqual([
      {
        id: 'o_win',
        priority: 1,
        when: { all: [{ cmp: [{ var: 'pers' }, '>=', 5] }, { cmp: [{ score: 'final' }, '>=', 300] }] },
        xp: { div: [{ mul: [{ score: 'final' }, 12] }, 100] },
      },
      {
        id: 'o_mid',
        priority: 2,
        when: { cmp: [{ score: 'final' }, '>=', 100] },
        xp: { div: [{ score: 'final' }, 10] },
      },
      { id: 'o_lose', priority: 3, when: { all: [] }, xp: 0 },
    ]);
  });

  it('scoring', () => {
    const { scoring } = pkg.config;
    expect(scoring.categories).toHaveLength(6);
    expect(scoring.lines.map((l) => [l.id, l.categories])).toEqual([
      ['delil', ['ARASTIRMA', 'DELIL_ANALIZI']],
      ['capraz', ['SORGULAMA']],
      ['itiraz', ['USUL_BILGISI', 'HUKUKI_BILGI']],
      ['savunma', ['SAVUNMA_STRATEJISI']],
      ['hatali', undefined],
    ]);
    // Ruling 21: bonus kendi döküm satırıdır; `line` alanı yazılmaz.
    expect(scoring.bonuses).toEqual([
      { id: 'b_cred', label: expect.any(String), value: { mul: [{ var: 'cred' }, 100] } },
    ]);
    expect(scoring.scaleMax).toBe(1000);
    expect(scoring.thresholdBar.map((b) => [b.label, b.from])).toEqual([
      ['Mahkûmiyet', 0],
      ['İndirim', 100],
      ['Beraat', 300],
    ]);
  });

  it('discovery paths: one per DISCOVER', () => {
    expect(pkg.discoveryPaths).toEqual([
      { evidence: 'c_a', source: { type: 'OBJECT', id: 'o_lamp' } },
      { evidence: 'c_b', source: { type: 'OBJECT', id: 'o_cam' } },
      { evidence: 'c_b', source: { type: 'CHOICE', id: 'tp_night' } },
      { evidence: 'c_uv', source: { type: 'RULE', id: 'ex_uv_r2' } },
      { evidence: 'e_doc', source: { type: 'RULE', id: 'ex_mag_r1' } },
      { evidence: 'i_ab', source: { type: 'RULE', id: 'cb_ab' } },
      { evidence: 'e_key', source: { type: 'INITIAL' } },
    ]);
  });

  it('report hints', () => {
    expect(pkg.report.hints.map((h) => [h.id, h.when])).toEqual([
      ['h_cam', { not: { hasEvidence: 'c_b' } }],
      ['h_uv', { not: { hasEvidence: 'c_uv' } }],
    ]);
  });

  it('golden paths', () => {
    const choose = (choiceId: string) => ({ kind: 'CHOOSE', choiceId });
    const wrongPresent = { kind: 'PRESENT', evidenceId: 'e_key', statementId: 'st1' };
    expect(pkg.tests?.goldenPaths).toEqual([
      {
        name: 'gp_win',
        actions: [
          choose('ch_str_a'),
          choose('ch_go_scene'),
          { kind: 'TAP', x: 15, y: 15 },
          { kind: 'TAP', x: 70, y: 70 },
          choose('ch_scene_end'),
          choose('ch_go_board'),
          { kind: 'COMBINE', a: 'c_a', b: 'c_b' },
          choose('ch_board_end'),
          choose('ch_go_court'),
          { kind: 'PRESENT', evidenceId: 'i_ab', statementId: 'st1' },
          choose('ch_court_next'),
          choose('ob_a'),
          choose('cl_a'),
          choose('ev_ok'),
          choose('ch_good_next'),
        ],
        expect: { outcome: 'o_win', finalMin: 1430, finalMax: 1430 },
      },
      {
        name: 'gp_mid',
        actions: ['ch_str_b', 'ch_go_court', 'ch_court_next', 'ob_a', 'cl_b', 'ev_ok'].map(choose),
        expect: { outcome: 'o_mid', finalMin: 450, finalMax: 450 },
      },
      {
        name: 'gp_lose',
        actions: [
          choose('ch_str_b'),
          choose('ch_go_court'),
          wrongPresent,
          wrongPresent,
          wrongPresent,
          choose('ch_collapse_next'),
        ],
        expect: { outcome: 'o_lose', finalMin: -450, finalMax: -450 },
      },
    ]);
  });

  it('no node text names evidence the player has not found yet', () => {
    // Görünüm sızıntı testleri (Task 14, 17) bulunmamış delil başlıklarını ve kimliklerini arar: node metinleri bunları
    // önceden içermemeli.
    const nodeText = JSON.stringify(pkg.nodes);
    for (const evidence of pkg.evidence.filter((e) => !e.initiallyKnown)) {
      expect(nodeText.includes(evidence.title), evidence.title).toBe(false);
    }
  });
});

describe('CasePackage', () => {
  it('format is the CASE_FORMAT literal', () => {
    expect(CasePackage.shape.format.value).toBe(CASE_FORMAT);
    expect(pathsOf(CasePackage, { ...raw, format: 'mudafaa.case/v2' })).toEqual(['format']);
  });

  const requiredKeys = [
    'format',
    'meta',
    'config',
    'predicates',
    'variables',
    'sprites',
    'characters',
    'relationships',
    'evidence',
    'evidenceRelations',
    'discoveryPaths',
    'scenes',
    'court',
    'nodes',
    'triggers',
    'outcomes',
    'report',
    'assets',
  ];

  it('has exactly these top-level keys, all required except tests', () => {
    expect(Object.keys(CasePackage.shape)).toEqual([...requiredKeys, 'tests']);
  });

  it.each(requiredKeys)('requires %s', (key) => {
    expect(pathsOf(CasePackage, { ...raw, [key]: undefined })).toContain(key);
  });

  const meta = raw.meta as Record<string, unknown>;
  const config = raw.config as Record<string, unknown>;
  const goldenPath = {
    name: 'gp_x',
    actions: [{ kind: 'CHOOSE', choiceId: 'ch_str_a' }],
    expect: { outcome: 'o_win' },
  };

  acceptsUnchanged(CasePackage, [
    ['the mini-case', raw],
    ['the mini-case without tests', { ...raw, tests: undefined }],
    ['an optional requiredRank', { ...raw, meta: { ...meta, requiredRank: 'stajyer' } }],
    ['a pending legal review without reviewer', { ...raw, meta: { ...meta, legalReview: { status: 'PENDING' } } }],
    ['difficulty 5', { ...raw, meta: { ...meta, difficulty: 5 } }],
    ['a slug with digits and hyphens', { ...raw, meta: { ...meta, slug: 'gece-bekcisinin-sirri-07' } }],
    [
      'objection grounds and a chronology',
      {
        ...raw,
        config: {
          ...config,
          objectionGrounds: [
            { id: 'g_duyum', label: 'Duyuma dayalı tanıklık', legalBasis: 'CMK 217' },
            { id: 'g_kanaat', label: 'Tanığın kişisel kanaati' },
          ],
          chronology: [{ id: 'ch_2300', time: '23.00', text: 'Depo kapısı açılır.' }],
        },
      },
    ],
    [
      'relationships, hidden and revealed by a condition',
      {
        ...raw,
        relationships: [
          { from: 'k', to: 'w', type: 'KOMSU', description: 'Aynı sokakta oturuyorlar.' },
          { from: 'w', to: 'j', type: 'AKRABA', description: 'Kuzenler.', hidden: true, revealWhen: { flag: 'f' } },
        ],
      },
    ],
    [
      'a FILE asset with a checksum',
      { ...raw, assets: [{ id: 'f_dosya', kind: 'FILE', path: 'docs/dosya.pdf', sha256: 'a'.repeat(64) }] },
    ],
    [
      'an asset path with an @2x suffix',
      { ...raw, assets: [{ id: 'img_sc1', kind: 'IMAGE', path: 'assets/scenes/depo-sokagi@4x.png' }] },
    ],
    ['a golden path without a score window', { ...raw, tests: { goldenPaths: [goldenPath] } }],
    [
      'a golden path with only an upper bound',
      { ...raw, tests: { goldenPaths: [{ ...goldenPath, expect: { outcome: 'o_lose', finalMax: 800 } }] } },
    ],
    ['no golden paths', { ...raw, tests: { goldenPaths: [] } }],
    [
      'empty content lists',
      { ...raw, predicates: [], relationships: [], evidenceRelations: [], triggers: [], assets: [] },
    ],
  ]);

  rejects(CasePackage, [
    ['null', null],
    ['an unknown top-level key', { ...raw, notes: 'x' }],
    ['an upper-case slug', withValueAt(raw, 'meta.slug', 'Mini-Case')],
    ['a slug with an underscore', withValueAt(raw, 'meta.slug', 'mini_case')],
    ['a slug with a space', withValueAt(raw, 'meta.slug', 'mini case')],
    ['a slug with a Turkish letter', withValueAt(raw, 'meta.slug', 'gece-bekçi')],
    ['an empty slug', withValueAt(raw, 'meta.slug', '')],
    ['a fractional case number', withValueAt(raw, 'meta.number', 0.5)],
    ['a negative case number', withValueAt(raw, 'meta.number', -1)],
    ['difficulty 0', withValueAt(raw, 'meta.difficulty', 0)],
    ['difficulty 6', withValueAt(raw, 'meta.difficulty', 6)],
    ['a fractional difficulty', withValueAt(raw, 'meta.difficulty', 2.5)],
    ['a category other than CEZA', withValueAt(raw, 'meta.category', 'HUKUK')],
    ['zero estimated minutes', withValueAt(raw, 'meta.estimatedMinutes', 0)],
    ['fractional estimated minutes', withValueAt(raw, 'meta.estimatedMinutes', 4.5)],
    ['an unknown legal review status', withValueAt(raw, 'meta.legalReview.status', 'REJECTED')],
    ['a legal review date that is not a calendar date', withValueAt(raw, 'meta.legalReview.at', '20.10.2026')],
    ['a legal review timestamp instead of a date', withValueAt(raw, 'meta.legalReview.at', '2026-10-20T10:00:00Z')],
    ['an unknown meta key', withValueAt(raw, 'meta.author', 'x')],
    ['a resultNode (not part of v1)', withValueAt(raw, 'config.resultNode', 'n_result')],
    ['a display without showRunningScore', withValueAt(raw, 'config.display', {})],
    ['a non-boolean showRunningScore', withValueAt(raw, 'config.display.showRunningScore', 'yes')],
    ['an objection ground without a label', withValueAt(raw, 'config.objectionGrounds', [{ id: 'g_duyum' }])],
    ['a chronology entry without text', withValueAt(raw, 'config.chronology', [{ id: 'c1', time: '23.00' }])],
    ['a predicate without a condition', withValueAt(raw, 'predicates.0.when', undefined)],
    ['a predicate with an invalid condition', withValueAt(raw, 'predicates.0.when', { cmp: [1, '=~', 2] })],
    ['a relationship without a description', { ...raw, relationships: [{ from: 'k', to: 'w', type: 'KOMSU' }] }],
    ['a court without sessions', withValueAt(raw, 'court', {})],
    ['a report without hints', withValueAt(raw, 'report', {})],
    ['an asset of an unknown kind', withValueAt(raw, 'assets.0.kind', 'AUDIO')],
    ['an absolute asset path', withValueAt(raw, 'assets.0.path', '/etc/passwd')],
    ['an asset path that climbs out', withValueAt(raw, 'assets.0.path', 'assets/../../secret.png')],
    ['an asset path with a backslash', withValueAt(raw, 'assets.0.path', 'assets\\sc1.png')],
    ['an empty asset path', withValueAt(raw, 'assets.0.path', '')],
    ['an asset checksum that is not sha256 hex', withValueAt(raw, 'assets.0.sha256', 'abc')],
    ['an upper-case asset checksum', withValueAt(raw, 'assets.0.sha256', 'A'.repeat(64))],
    [
      'a golden path with a float TAP',
      withValueAt(raw, 'tests.goldenPaths.0.actions.2', { kind: 'TAP', x: 15.5, y: 15 }),
    ],
    ['a golden path with an unknown action', withValueAt(raw, 'tests.goldenPaths.0.actions.0', { kind: 'UNDO' })],
    ['a golden path without an outcome', withValueAt(raw, 'tests.goldenPaths.0.expect', { finalMin: 0 })],
    ['a fractional score window', withValueAt(raw, 'tests.goldenPaths.0.expect.finalMin', 1.5)],
    ['an unknown expectation', withValueAt(raw, 'tests.goldenPaths.0.expect.xp', 171)],
    ['tests without goldenPaths', { ...raw, tests: {} }],
    ['a variable that breaks its own rules', withValueAt(raw, 'variables.0.initial', 9)],
    ['a node of an unknown type', withValueAt(raw, 'nodes.0.type', 'MINIGAME')],
  ]);

  it('rejects a score window whose minimum is above its maximum, at finalMax', () => {
    const bad = withValueAt(raw, 'tests.goldenPaths.0.expect', { outcome: 'o_win', finalMin: 1500, finalMax: 1400 });
    expect(pathsOf(CasePackage, bad)).toEqual(['tests.goldenPaths.0.expect.finalMax']);
    const equal = withValueAt(raw, 'tests.goldenPaths.0.expect', { outcome: 'o_win', finalMin: 1430, finalMax: 1430 });
    expect(CasePackage.safeParse(equal).success).toBe(true);
  });

  it('reports nested content errors at their full path', () => {
    expect(pathsOf(CasePackage, withValueAt(raw, 'nodes.3.choices.0.fallbackFor', undefined))).toEqual([
      'nodes.3.choices.0.fallbackFor',
    ]);
    expect(pathsOf(CasePackage, withValueAt(raw, 'variables.0.initial', 9))).toEqual(['variables.0.initial']);
  });

  const withExtras = clone(raw);
  Object.assign(withExtras.meta as object, { requiredRank: 'stajyer' });
  Object.assign(withExtras.config as object, {
    objectionGrounds: [{ id: 'g_duyum', label: 'Duyum' }],
    chronology: [{ id: 'c1', time: '23.00', text: 'x' }],
  });
  withExtras.relationships = [{ from: 'k', to: 'w', type: 'KOMSU', description: 'x' }];
  rejectsInvalidIdAt(CasePackage, withExtras, [
    'meta.requiredRank',
    'meta.coverCharacter',
    'config.startNode',
    'config.objectionGrounds.0.id',
    'config.chronology.0.id',
    'predicates.0.id',
    'relationships.0.from',
    'relationships.0.to',
    'assets.0.id',
    'tests.goldenPaths.0.name',
    'tests.goldenPaths.0.expect.outcome',
    'tests.goldenPaths.0.actions.0.choiceId',
  ]);
});
