import { describe, expect, it } from 'vitest';
import {
  Action,
  ActionKind,
  ActionResult,
  CaseReport,
  ChoiceView,
  ClueCard,
  CourtroomMode,
  DialogueMode,
  EvidenceCard,
  HudItem,
  InvestigationTabKind,
  NodeDef,
  NodeView,
  SessionView,
  StoryPhase,
  ToolVisualMode,
  VariableWidget,
} from '@mudafaa/case-schema';
import { acceptsUnchanged, clone, pathsOf, rejects, rejectsInvalidIdAt, turkish, withValueAt } from './helpers.js';

// --- örnekler -------------------------------------------------------------------------------------------------

const rows20 = Array.from({ length: 20 }, () => '...kkoowwookk...');

const evidenceCard = {
  id: 'e_key',
  title: 'Depo anahtarı',
  shortText: 'Sanığın çantasından çıktı.',
  description: 'Tüm vardiya işçilerine aynı anahtar verilmiş.',
  kindLabel: 'SAVCILIK',
  sourceLabel: 'Olay yeri tutanağı',
  icon: 'key',
};
const clueCard = { id: 'c_a', title: 'Kararmış ampul', sourceLabel: 'OLAY YERİ', icon: 'bulb' };

const hudItem = { id: 'cred', label: 'Güvenilirlik', widget: 'hearts', value: 3 };
const choiceView = { id: 'ch_go_court', kind: 'NAVIGATE', label: 'DURUŞMAYA GİT', available: true, used: false };

const actionResult = {
  resolution: 'CHOICE',
  lines: [],
  fx: [],
  discovered: [],
  nodeChanged: false,
  completed: false,
};

const stage = {
  banner: '2. CELSE · ÇAPRAZ SORGU',
  bench: [{ characterKey: 'j', label: 'Başkan', xFrac: 0.5 }],
  counsel: 'av',
};

const sceneView = {
  type: 'SCENE',
  id: 'n_scene',
  imageUrl: '/a.png',
  width: 100,
  height: 100,
  instruction: '…',
  found: [],
  hiddenTotal: 3,
};

const views = {
  story: {
    type: 'STORY',
    id: 'n_brief',
    phase: 'BRIEFING',
    blocks: [
      {
        type: 'profileCard',
        character: 'k',
        label: 'Sanık',
        lines: ['45 yaşında'],
        charge: 'TCK 141',
        demand: '1–3 yıl',
      },
      {
        type: 'sentenceRange',
        segments: ['green', 'green', 'gold', 'gold', 'red', 'red', 'darkred', 'darkred'],
        markerPct: 40,
        labels: ['Beraat', '1 yıl', '2 yıl', '3 yıl'],
        demandLabel: 'İSTEM',
      },
      { type: 'paragraph', title: 'Olay', text: 'Depodan malzeme çalındı.' },
      { type: 'strengthList', title: 'Savcılık delilleri', items: [{ label: 'Depo anahtarı', strength: 'WEAK' }] },
      { type: 'choiceGroup', title: 'Strateji', group: 'strategy', hints: { ch_str_a: 'Masumiyet' } },
    ],
  },
  investigation: {
    type: 'INVESTIGATION',
    id: 'n_hub',
    tabs: [
      { id: 't_scene', label: 'OLAY YERİ', kind: 'SCENE', choiceIds: ['ch_go_scene'] },
      { id: 't_people', label: 'TANIKLAR', kind: 'PEOPLE', choiceIds: ['ch_go_talk'] },
      { id: 't_archive', label: 'ARŞİV', kind: 'ARCHIVE', choiceIds: ['ch_go_doc', 'ch_go_board'] },
    ],
    scenePreview: {
      imageUrl: '/assets/sc1.png',
      width: 100,
      height: 100,
      markers: [
        { id: 'o_lamp', label: 'Sokak lambası', rect: { x: 10, y: 10, w: 20, h: 20 }, state: 'EXAMINED' },
        { id: 'o_door', label: 'Depo kapısı', rect: { x: 50, y: 50, w: 10, h: 10 }, state: 'UNEXAMINED' },
      ],
    },
    quickTalk: { characterKey: 'k', line: 'Neler oluyor, avukat hanım?', choiceIds: ['ch_go_talk'] },
  },
  dialogue: {
    type: 'DIALOGUE',
    id: 'n_talk',
    mode: 'INTERVIEW',
    room: { label: 'Görüşme odası', characterKey: 'k', expression: 'normal' },
    mood: { label: 'Temkinli', tone: 'neutral' },
    objectives: [
      { text: 'O gece nerede olduğunu öğren.', known: false },
      { text: 'Çay ocağındaydı.', known: true },
    ],
    tones: [
      { id: 'soft', label: 'Yumuşak', hint: 'Güveni artırır' },
      { id: 'hard', label: 'Sert' },
    ],
    allowPresent: false,
  },
  choice: { type: 'CHOICE', id: 'n_choice', prompt: { speaker: 'narrator', text: 'Esas savunmayı seç.' } },
  evidence: {
    type: 'EVIDENCE',
    id: 'n_ev',
    prompt: { speaker: 'j', expression: 'normal', text: 'Savcılığın delili.' },
    evidence: { ...evidenceCard, legalNote: 'Arama tutanağı eksik.' },
  },
  scene: {
    ...sceneView,
    found: [
      { objectId: 'o_lamp', rect: { x: 10, y: 10, w: 20, h: 20 }, label: 'Lamba' },
      { objectId: 'o_cam', rect: { x: 60, y: 60, w: 20, h: 20 }, label: 'Kamera', badge: '42' },
    ],
  },
  document: {
    type: 'DOCUMENT',
    id: 'n_doc',
    title: 'Vardiya çizelgesi',
    header: { left: 'DEPO · VARDİYA', right: '12 MART' },
    columns: [
      { label: 'PERSONEL', flex: 1.4 },
      { label: 'SAAT', flex: 1 },
    ],
    rows: [
      { id: 'r1', cells: ['A', 'B'] },
      { id: 'r2', cells: ['C', 'D'], lens: { uv: { cells: ['C', 'D*'], tone: 'special' } } },
    ],
    tools: [
      { id: 'mag', label: 'Büyüteç', icon: 'magnifier' },
      { id: 'uv', label: 'UV ışık', icon: 'uv', visualMode: 'UV' },
    ],
    solved: [{ tool: 'uv', target: 'r2' }],
    hiddenRemaining: 1,
  },
  deduction: {
    type: 'DEDUCTION',
    id: 'n_board',
    cards: [
      { id: 'c_a', source: 'OLAY YERİ', text: 'Kararmış ampul' },
      { id: 'c_b', source: 'OLAY YERİ', text: 'Kesik kamera kablosu' },
    ],
    solved: [{ title: 'Lamba o gece yanmıyordu', hits: 'Çürütür: tanık teşhisi' }],
    recipesTotal: 1,
  },
  courtroomTestimony: {
    type: 'COURTROOM',
    id: 'n_court1',
    mode: 'TESTIMONY',
    stage: { ...stage, witness: 'w' },
    statements: [
      {
        id: 'st1',
        segments: [
          { text: 'Lamba ', highlight: false },
          { text: 'yanıyordu', highlight: true },
        ],
        pressed: true,
      },
    ],
    presentable: [evidenceCard],
    objectionGrounds: [{ id: 'g_duyum', label: 'Duyuma dayalı tanıklık', legalBasis: 'CMK 217' }],
    rulesText: 'Çelişkiyi bul ve doğru delille vur.',
  },
  courtroomObjection: {
    type: 'COURTROOM',
    id: 'n_obj',
    mode: 'OBJECTION',
    stage,
    prosecutionEvidence: evidenceCard,
  },
  result: {
    type: 'RESULT',
    id: 'n_result',
    outcome: { id: 'o_win', class: 'ACQUITTAL', stamp: 'BERAAT', tone: 'green' },
    strategyLabel: 'Masumiyet',
    sentence: { demand: '1–3 yıl', result: 'Ceza yok' },
    verdictText: 'Sanığın beraatine karar verildi.',
    reasoning: ['Tanığın lambayı yanık gördüğü sözü çürütüldü.'],
    breakdown: [
      { label: 'Delil toplama', value: 380, tone: 'neutral' },
      { label: 'Hatalı delil', value: -150, tone: 'error' },
      { label: 'Güvenilirlik bonusu', value: 300, tone: 'success' },
    ],
    total: 1430,
    thresholds: {
      scaleMax: 1000,
      bands: [
        { label: 'Mahkûmiyet', from: 0, tone: 'red' },
        { label: 'İndirim', from: 100, tone: 'amber' },
        { label: 'Beraat', from: 300, tone: 'green' },
      ],
    },
    xp: { gained: 171, rankLabel: 'Stajyer › Avukat', progressPct: 64 },
  },
};

const sessionView = {
  session: {
    id: 'ses_1',
    caseId: 'case_1',
    caseNumber: 0,
    caseTitle: 'Mini Dava',
    stateVersion: 3,
    status: 'ACTIVE',
    mode: 'NORMAL',
  },
  header: {},
  hud: [],
  cast: {},
  lines: [],
  choices: [],
  bag: { items: [] },
  notebook: { items: [] },
  node: sceneView,
};

const fullSessionView = {
  session: { ...sessionView.session, mode: 'TEST', status: 'COMPLETED', progressLabel: 'Soruşturma · Gün 1' },
  header: {
    eyebrow: 'DAVA #00 · SORUŞTURMA',
    title: 'Olay yeri',
    back: { a11yLabel: 'Hub’a dön', choiceId: 'ch_scene_end' },
  },
  hud: [hudItem, { id: 'taps', label: 'Büyüteç', widget: 'counter', value: 2, max: 3, low: true }],
  cast: {
    k: {
      name: 'Kâmil Demir',
      shortLabel: 'Kâmil',
      role: 'CLIENT',
      accent: '#e2802f',
      sprite: { rows: rows20 },
      expression: 'saskin',
    },
    j: {
      name: 'Selma Er',
      shortLabel: 'Başkan',
      role: 'JUDGE',
      accent: '#c4413a',
      sprite: { rows: rows20, skin: 'Q', noEyes: true, noMouth: false },
    },
  },
  lines: [
    { speaker: 'k', expression: 'kizgin', text: 'O gece depoda değildim!' },
    { speaker: 'player', text: 'Anlat bakalım.' },
    { speaker: 'narrator', text: 'Sessizlik.' },
  ],
  choices: [
    {
      id: 'tp_night',
      kind: 'TOPIC',
      group: 'topics',
      label: 'O gece',
      description: 'Olay gecesini sor.',
      tags: [{ label: 'TANIK', tone: 'witness' }],
      variants: [
        { id: 'soft', label: 'Yumuşak' },
        { id: 'hard', label: 'Sert' },
      ],
      cost: [{ var: 'minutes', amount: 2, label: '2 dk' }],
      available: false,
      lockedReason: 'Süre yetmiyor',
      used: true,
      confirm: 'Emin misin?',
    },
  ],
  primary: { choiceId: 'ch_scene_end', label: 'ARAMAYI BİTİR', tone: 'gold' },
  bag: { items: [evidenceCard], total: 6 },
  notebook: { items: [clueCard], total: 3 },
  last: {
    resolution: 'HIT',
    feedback: { title: 'YENİ İPUCU', text: 'Lambanın ampulü kararmış.', label: '+40 SKOR', tone: 'success' },
    lines: [{ speaker: 'narrator', text: 'Bir şey buldun.' }],
    fx: [
      { kind: 'SCORE', label: '+40 SKOR', delta: 40 },
      { kind: 'EVIDENCE', label: 'Kararmış ampul', id: 'c_a' },
      { kind: 'VAR', label: 'Büyüteç', delta: -1 },
    ],
    discovered: ['c_a'],
    hit: { objectId: 'o_lamp', rect: { x: 10, y: 10, w: 20, h: 20 }, text: 'Lambanın ampulü kararmış.' },
    nodeChanged: false,
    completed: false,
  },
  node: views.scene,
};

const caseReport = {
  outcome: {
    id: 'o_mid',
    class: 'REDUCED',
    stamp: 'İNDİRİM',
    stampTone: 'amber',
    header: 'Karar açıklandı',
    sentence: '1 yıl hapis',
    verdictText: 'Sanığın indirimli cezalandırılmasına karar verildi.',
    reasoning: ['Anahtar tek başına yeterli görülmedi.', 'Tanık kısmen güvenilir bulundu.'],
    legalBasis: 'TCK 141, TCK 62',
    ethicsCard: 'Müvekkilin sırrını koru.',
  },
  raw: 150,
  final: 450,
  breakdown: [
    { label: 'İtiraz isabeti', value: 150, tone: 'success' },
    { label: 'Güvenilirlik bonusu', value: 300, tone: 'success' },
  ],
  good: [{ source: 'ps_st1', feedback: 'Çelişkiyi yakaladın.', category: 'SORGULAMA' }],
  bad: [{ source: 'fb_ps', feedback: 'Yanlış delil.' }],
  missed: [{ text: 'Kameranın kablosuna bakmadın.', category: 'ARASTIRMA' }, { text: 'UV ışığı denemedin.' }],
  alternatives: [{ outcomeId: 'o_win', howToReach: 'Lamba çelişkisini ispatla.' }],
  skills: [
    {
      category: 'USUL_BILGISI',
      label: 'Usul bilgisi',
      earned: 150,
      max: 150,
      level: 'strong',
      advice: 'Usul itirazların yerindeydi.',
    },
    { category: 'HUKUKI_BILGI', label: 'Hukuki bilgi', earned: 0, max: 0, level: 'weak', advice: 'Kanunu oku.' },
  ],
  xp: 45,
};

// --- testler --------------------------------------------------------------------------------------------------

describe('Action', () => {
  it('Action rejects float TAP', () => {
    expect(Action.safeParse({ kind: 'TAP', x: 1.5, y: 2 }).success).toBe(false);
  });

  it('Action has one variant per ActionKind', () => {
    expect(Action.options.map((option) => option.shape.kind.value)).toEqual(ActionKind.options);
  });

  acceptsUnchanged(Action, [
    ['CHOOSE', { kind: 'CHOOSE', choiceId: 'ch_str_a' }],
    ['CHOOSE with a variant', { kind: 'CHOOSE', choiceId: 'tp_night', variant: 'soft' }],
    ['TAP', { kind: 'TAP', x: 15, y: 15 }],
    ['TAP outside the scene (the engine checks the bounds)', { kind: 'TAP', x: -1, y: 500 }],
    ['EXAMINE', { kind: 'EXAMINE', tool: 'uv', target: 'r2' }],
    ['COMBINE', { kind: 'COMBINE', a: 'c_a', b: 'c_b' }],
    ['PRESS', { kind: 'PRESS', statementId: 'st1' }],
    ['PRESENT with a statement', { kind: 'PRESENT', evidenceId: 'i_ab', statementId: 'st1' }],
    ['PRESENT without a statement (dialogue)', { kind: 'PRESENT', evidenceId: 'c_a' }],
    ['OBJECT with a statement', { kind: 'OBJECT', groundId: 'g_duyum', statementId: 'st4' }],
    ['OBJECT without a statement', { kind: 'OBJECT', groundId: 'g_duyum' }],
  ]);

  rejects(Action, [
    ['null', null],
    ['an empty object', {}],
    ['an unknown kind', { kind: 'SHOUT', choiceId: 'x' }],
    ['a lower-case kind', { kind: 'choose', choiceId: 'ch_str_a' }],
    ['CHOOSE without a choiceId', { kind: 'CHOOSE' }],
    ['CHOOSE with $stay as choiceId', { kind: 'CHOOSE', choiceId: '$stay' }],
    ['CHOOSE with an extra key', { kind: 'CHOOSE', choiceId: 'ch_str_a', expectedStateVersion: 1 }],
    ['TAP with a fractional y', { kind: 'TAP', x: 1, y: 2.5 }],
    ['TAP with string coordinates', { kind: 'TAP', x: '15', y: '15' }],
    ['TAP without y', { kind: 'TAP', x: 15 }],
    ['TAP with an infinite x', { kind: 'TAP', x: Number.POSITIVE_INFINITY, y: 0 }],
    ['EXAMINE without a target', { kind: 'EXAMINE', tool: 'uv' }],
    ['COMBINE with one card', { kind: 'COMBINE', a: 'c_a' }],
    ['COMBINE with an array', { kind: 'COMBINE', cards: ['c_a', 'c_b'] }],
    ['PRESS without a statement', { kind: 'PRESS' }],
    ['PRESENT without evidence', { kind: 'PRESENT', statementId: 'st1' }],
    ['PRESENT with the content field name', { kind: 'PRESENT', evidence: 'i_ab', statementId: 'st1' }],
    ['OBJECT without a ground', { kind: 'OBJECT', statementId: 'st1' }],
  ]);

  rejectsInvalidIdAt(Action, { kind: 'CHOOSE', choiceId: 'tp_night', variant: 'soft' }, ['choiceId', 'variant']);
  rejectsInvalidIdAt(Action, { kind: 'EXAMINE', tool: 'uv', target: 'r2' }, ['tool', 'target']);
  rejectsInvalidIdAt(Action, { kind: 'COMBINE', a: 'c_a', b: 'c_b' }, ['a', 'b']);
  rejectsInvalidIdAt(Action, { kind: 'PRESS', statementId: 'st1' }, ['statementId']);
  rejectsInvalidIdAt(Action, { kind: 'PRESENT', evidenceId: 'i_ab', statementId: 'st1' }, [
    'evidenceId',
    'statementId',
  ]);
  rejectsInvalidIdAt(Action, { kind: 'OBJECT', groundId: 'g_duyum', statementId: 'st1' }, ['groundId', 'statementId']);
});

describe('HudItem', () => {
  it('HudItem.widget reuses the variable display-widget enum', () => {
    expect(HudItem.shape.widget).toBe(VariableWidget);
  });

  it.each(['meter10', 'hearts', 'percentBar', 'minutes', 'pips', 'counter', 'score', 'label'])(
    'accepts the %s widget',
    (widget) => {
      expect(HudItem.safeParse({ ...hudItem, widget }).success).toBe(true);
    },
  );

  acceptsUnchanged(HudItem, [
    ['an int value', hudItem],
    ['max and low', { id: 'taps', label: 'Büyüteç', widget: 'counter', value: 0, max: 3, low: true }],
    ['a negative value', { id: 'score', label: 'SKOR', widget: 'score', value: -150 }],
    ['a bool value', { id: 'in_court', label: 'Duruşmada', widget: 'label', value: false }],
    ['an enum value', { id: 'strategy', label: 'Strateji', widget: 'label', value: 'MASUMIYET' }],
  ]);

  rejects(HudItem, [
    ['an unknown widget', { ...hudItem, widget: 'gauge' }],
    ['a fractional value', { ...hudItem, value: 2.5 }],
    ['a null value', { ...hudItem, value: null }],
    ['a fractional max', { ...hudItem, max: 2.5 }],
    ['a numeric low', { ...hudItem, low: 1 }],
    ['a lowAt field (the server sends the low flag)', { ...hudItem, lowAt: 1 }],
    ['no label', { id: 'cred', widget: 'hearts', value: 3 }],
    ['no value', { id: 'cred', label: 'Güvenilirlik', widget: 'hearts' }],
  ]);

  rejectsInvalidIdAt(HudItem, hudItem, ['id']);
});

describe('ChoiceView', () => {
  acceptsUnchanged(ChoiceView, [
    ['the required fields only', choiceView],
    ['every optional field', fullSessionView.choices[0]],
    ['an OPTION', { ...choiceView, kind: 'OPTION' }],
    ['a CONTINUE', { ...choiceView, kind: 'CONTINUE' }],
  ]);

  it.each(['EXAMINE', 'COMBINE', 'PRESS', 'PRESENT', 'OBJECT', 'FALLBACK'])(
    'rejects the %s kind (rules are never sent to the client)',
    (kind) => {
      expect(ChoiceView.safeParse({ ...choiceView, kind }).success).toBe(false);
    },
  );

  rejects(ChoiceView, [
    ['no label', { id: 'ch_a', kind: 'OPTION', available: true, used: false }],
    ['no available flag', { id: 'ch_a', kind: 'OPTION', label: 'x', used: false }],
    ['no used flag', { id: 'ch_a', kind: 'OPTION', label: 'x', available: true }],
    ['a zero cost', { ...choiceView, cost: [{ var: 'ap', amount: 0, label: '0 EP' }] }],
    ['a cost without a label', { ...choiceView, cost: [{ var: 'ap', amount: 1 }] }],
    ['an unknown tag tone', { ...choiceView, tags: [{ label: 'x', tone: 'loud' }] }],
    ['a variant with a prompt', { ...choiceView, variants: [{ id: 'soft', label: 'Yumuşak', prompt: 'x' }] }],
  ]);

  it.each([
    ['next', 'n_obj'],
    ['effects', [{ type: 'SCORE', category: 'SORGULAMA', amount: 300 }]],
    ['visibleWhen', { hasEvidence: 'c_a' }],
    ['enabledWhen', { flag: 'f' }],
    ['quality', { q: 'GOOD', feedback: 'x' }],
    ['responses', [{ lines: [{ speaker: 'k', text: 'x' }] }]],
    ['match', { statement: 'st1' }],
    ['maxUses', 1],
  ])('rejects the content field %s (no spoilers through a choice)', (field, value) => {
    expect(pathsOf(ChoiceView, { ...choiceView, [field]: value })).toEqual(['']);
  });

  rejectsInvalidIdAt(ChoiceView, fullSessionView.choices[0], ['id', 'group', 'variants.0.id', 'cost.0.var']);
});

describe('EvidenceCard and ClueCard', () => {
  acceptsUnchanged(EvidenceCard, [
    ['the required fields only', evidenceCard],
    ['a legal note', { ...evidenceCard, legalNote: 'Dışlanabilir: arama izni yok.' }],
  ]);
  rejects(EvidenceCard, [
    ['an unknown icon', { ...evidenceCard, icon: 'gun' }],
    ['no kindLabel', { ...evidenceCard, kindLabel: undefined }],
    ['the content kind enum', { ...evidenceCard, kind: 'EVIDENCE' }],
    ['a missedHint (spoiler)', { ...evidenceCard, missedHint: 'x' }],
    ['a presentable flag', { ...evidenceCard, presentable: true }],
  ]);
  rejectsInvalidIdAt(EvidenceCard, evidenceCard, ['id']);

  acceptsUnchanged(ClueCard, [['a clue', clueCard]]);
  rejects(ClueCard, [
    ['a description (clue cards are short)', { ...clueCard, description: 'x' }],
    ['no icon', { id: 'c_a', title: 'Kararmış ampul', sourceLabel: 'OLAY YERİ' }],
    ['an unknown icon', { ...clueCard, icon: 'gun' }],
  ]);
  rejectsInvalidIdAt(ClueCard, clueCard, ['id']);
});

describe('ActionResult', () => {
  acceptsUnchanged(ActionResult, [
    ['the required fields only', actionResult],
    ['every optional field', fullSessionView.last],
    ...['CHOICE', 'RULE', 'FALLBACK', 'NOOP', 'HIT', 'MISS'].map((resolution): [string, unknown] => [
      `resolution ${resolution}`,
      { ...actionResult, resolution },
    ]),
    ...['VAR', 'SCORE', 'EVIDENCE', 'CHARACTER', 'SHOUT', 'VERDICT'].map((kind): [string, unknown] => [
      `an fx of kind ${kind}`,
      { ...actionResult, fx: [{ kind, label: 'x' }] },
    ]),
    ['a node change that completes the case', { ...actionResult, nodeChanged: true, completed: true }],
  ]);

  rejects(ActionResult, [
    ['an unknown resolution', { ...actionResult, resolution: 'REJECTED' }],
    ['no lines', { ...actionResult, lines: undefined }],
    ['no fx', { ...actionResult, fx: undefined }],
    ['no discovered list', { ...actionResult, discovered: undefined }],
    ['no nodeChanged', { ...actionResult, nodeChanged: undefined }],
    ['no completed', { ...actionResult, completed: undefined }],
    ['an unknown fx kind', { ...actionResult, fx: [{ kind: 'SOUND', label: 'x' }] }],
    ['a fractional fx delta', { ...actionResult, fx: [{ kind: 'SCORE', label: 'x', delta: 1.5 }] }],
    ['feedback without a tone', { ...actionResult, feedback: { text: 'x' } }],
    [
      'a hit with a fractional rect',
      { ...actionResult, hit: { objectId: 'o_lamp', rect: { x: 1.5, y: 0, w: 1, h: 1 }, text: 'x' } },
    ],
    ['a line with an unknown expression', { ...actionResult, lines: [{ speaker: 'k', expression: 'mad', text: 'x' }] }],
  ]);

  rejectsInvalidIdAt(ActionResult, fullSessionView.last, [
    'fx.1.id',
    'discovered.0',
    'hit.objectId',
    'lines.0.speaker',
  ]);
});

describe('NodeView', () => {
  it('NodeView parses a SCENE view', () => {
    const result = NodeView.safeParse({
      type: 'SCENE',
      id: 'n_scene',
      imageUrl: '/a.png',
      width: 100,
      height: 100,
      instruction: '…',
      found: [],
      hiddenTotal: 3,
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual(sceneView);
  });

  const clientTypes = [
    'STORY',
    'INVESTIGATION',
    'DIALOGUE',
    'CHOICE',
    'EVIDENCE',
    'SCENE',
    'DOCUMENT',
    'DEDUCTION',
    'COURTROOM',
    'RESULT',
  ];

  it('NodeView covers exactly the ten client node types', () => {
    expect(NodeView.options.map((option) => option.shape.type.value)).toEqual(clientTypes);
  });

  it('every node type except DECISION has a view (DECISION routes immediately)', () => {
    const contentTypes = NodeDef.options.map((option) => option.shape.type.value);
    expect(contentTypes.filter((type) => !clientTypes.includes(type))).toEqual(['DECISION']);
  });

  acceptsUnchanged(
    NodeView,
    Object.entries(views).map(([name, value]): [string, unknown] => [`a full ${name} view`, value]),
  );

  acceptsUnchanged(NodeView, [
    ['a minimal STORY', { type: 'STORY', id: 'n_story', blocks: [] }],
    ['a minimal INVESTIGATION', { type: 'INVESTIGATION', id: 'n_hub', tabs: [] }],
    [
      'a minimal DIALOGUE',
      {
        type: 'DIALOGUE',
        id: 'n_talk',
        mode: 'CONVERSATION',
        room: { label: 'Oda', characterKey: 'k', expression: 'normal' },
        objectives: [],
        tones: [],
        allowPresent: true,
      },
    ],
    ['a minimal CHOICE', { type: 'CHOICE', id: 'n_choice' }],
    ['a minimal EVIDENCE', { type: 'EVIDENCE', id: 'n_ev', evidence: evidenceCard }],
    ['a SCENE without the hidden count (exposeCounts off)', { ...sceneView, hiddenTotal: undefined }],
    [
      'a minimal DOCUMENT',
      { ...views.document, solved: [], hiddenRemaining: undefined, rows: [{ id: 'r1', cells: [] }] },
    ],
    ['a minimal DEDUCTION', { type: 'DEDUCTION', id: 'n_board', cards: [], solved: [] }],
    ['a minimal COURTROOM', { type: 'COURTROOM', id: 'n_stage', mode: 'STAGE', stage }],
    [
      'a RESULT without strategy and career data',
      {
        ...views.result,
        strategyLabel: undefined,
        xp: { gained: 0 },
        breakdown: [],
        reasoning: [],
        total: -450,
      },
    ],
  ]);

  it('rejects the DECISION type and the client-only UNSUPPORTED fallback', () => {
    expect(NodeView.safeParse({ type: 'DECISION', id: 'n_dec' }).success).toBe(false);
    expect(NodeView.safeParse({ type: 'DECISION', id: 'n_dec', routes: [{ to: 'n_result' }] }).success).toBe(false);
    expect(NodeView.safeParse({ type: 'UNSUPPORTED', id: 'n_x' }).success).toBe(false);
  });

  it.each(Object.entries(views))('requires the node id on the %s view', (_name, value) => {
    expect(pathsOf(NodeView, { ...value, id: undefined })).toContain('id');
  });

  it.each(Object.entries(views))('rejects an unknown key on the %s view', (_name, value) => {
    expect(NodeView.safeParse({ ...value, choices: [] }).success).toBe(false);
  });

  it('keeps Turkish text byte for byte', () => {
    const testimony = withValueAt(views.courtroomTestimony, 'statements.0.segments.1.text', turkish);
    const parsed = NodeView.parse(testimony);
    expect(parsed.type === 'COURTROOM' && parsed.statements?.[0]?.segments[1]?.text).toBe(turkish);

    const result = NodeView.parse({ ...views.result, verdictText: turkish, reasoning: [turkish] });
    expect(result.type === 'RESULT' && result.verdictText).toBe(turkish);
    expect(result.type === 'RESULT' && result.reasoning[0]).toBe(turkish);
  });

  rejects(NodeView, [
    ['a STORY without blocks', { type: 'STORY', id: 'n_story' }],
    ['a STORY with an unknown phase', { ...views.story, phase: 'TRIAL' }],
    ['a STORY with an unknown block', { ...views.story, blocks: [{ type: 'video', url: 'x' }] }],
    ['an INVESTIGATION tab of an unknown kind', withValueAt(views.investigation, 'tabs.0.kind', 'CELL')],
    [
      'an INVESTIGATION tab with content field names',
      withValueAt(views.investigation, 'tabs.0', { id: 't', label: 'x', kind: 'SCENE', choices: [] }),
    ],
    ['a preview marker in an unknown state', withValueAt(views.investigation, 'scenePreview.markers.0.state', 'FOUND')],
    ['a preview with a zero width', withValueAt(views.investigation, 'scenePreview.width', 0)],
    [
      'a preview marker with shapes (geometry stays on the server)',
      withValueAt(views.investigation, 'scenePreview.markers.0.shapes', []),
    ],
    ['a DIALOGUE with an unknown mode', { ...views.dialogue, mode: 'CHAT' }],
    ['a DIALOGUE room without an expression', withValueAt(views.dialogue, 'room', { label: 'Oda', characterKey: 'k' })],
    ['a DIALOGUE mood with an unknown tone', withValueAt(views.dialogue, 'mood.tone', 'angry')],
    [
      'a DIALOGUE objective in the content shape (when/known/unknown texts)',
      withValueAt(views.dialogue, 'objectives.0', { id: 'ob', when: { flag: 'f' }, known: 'a', unknown: 'b' }),
    ],
    ['a DIALOGUE without allowPresent', { ...views.dialogue, allowPresent: undefined }],
    ['a CHOICE with an evidence card', { ...views.choice, evidence: evidenceCard }],
    ['an EVIDENCE without its card', { type: 'EVIDENCE', id: 'n_ev' }],
    ['an EVIDENCE with an evidence id instead of a card', { type: 'EVIDENCE', id: 'n_ev', evidence: 'e_key' }],
    ['a SCENE with a fractional width', { ...sceneView, width: 99.5 }],
    ['a SCENE with an empty imageUrl', { ...sceneView, imageUrl: '' }],
    ['a SCENE with a negative hidden count', { ...sceneView, hiddenTotal: -1 }],
    [
      'a SCENE found object without a label',
      { ...sceneView, found: [{ objectId: 'o_lamp', rect: { x: 10, y: 10, w: 20, h: 20 } }] },
    ],
    [
      'a SCENE found object with its effects',
      {
        ...sceneView,
        found: [{ objectId: 'o_lamp', rect: { x: 10, y: 10, w: 20, h: 20 }, label: 'Lamba', effects: [] }],
      },
    ],
    ['a DOCUMENT column with a zero flex', withValueAt(views.document, 'columns.0.flex', 0)],
    ['a DOCUMENT lens with an unknown tone', withValueAt(views.document, 'rows.1.lens.uv.tone', 'purple')],
    ['a DOCUMENT tool with an unknown visual mode', withValueAt(views.document, 'tools.1.visualMode', 'XRAY')],
    ['a DOCUMENT tool with an unknown icon', withValueAt(views.document, 'tools.0.icon', 'gun')],
    ['a DOCUMENT without solved', { ...views.document, solved: undefined }],
    ['a DOCUMENT solved entry given as a rule id', withValueAt(views.document, 'solved.0', { rule: 'ex_uv_r2' })],
    ['a DEDUCTION solved entry with numeric hits', withValueAt(views.deduction, 'solved.0.hits', 2)],
    ['a DEDUCTION with a fractional recipe total', { ...views.deduction, recipesTotal: 1.5 }],
    ['a COURTROOM with an unknown mode', { ...views.courtroomTestimony, mode: 'VERDICT' }],
    ['a COURTROOM bench seat outside 0..1', withValueAt(views.courtroomTestimony, 'stage.bench.0.xFrac', 1.2)],
    ['a COURTROOM stage without counsel', withValueAt(views.courtroomTestimony, 'stage', { banner: 'x', bench: [] })],
    [
      'a COURTROOM segment in the content shape (highlightWhen instead of highlight)',
      withValueAt(views.courtroomTestimony, 'statements.0.segments.0', {
        text: 'Lamba ',
        highlightWhen: { flag: 'f' },
      }),
    ],
    [
      'a COURTROOM segment without highlight',
      withValueAt(views.courtroomTestimony, 'statements.0.segments.0', { text: 'Lamba ' }),
    ],
    ['a COURTROOM statement without pressed', withValueAt(views.courtroomTestimony, 'statements.0.pressed', undefined)],
    ['a COURTROOM presentable list of ids', { ...views.courtroomTestimony, presentable: ['e_key'] }],
    ['a COURTROOM prosecution evidence id', { ...views.courtroomObjection, prosecutionEvidence: 'e_key' }],
    ['a COURTROOM objection ground id', { ...views.courtroomTestimony, objectionGrounds: ['g_duyum'] }],
    ['a RESULT with an unknown outcome class', withValueAt(views.result, 'outcome.class', 'PARDON')],
    ['a RESULT outcome tone outside green/amber/red', withValueAt(views.result, 'outcome.tone', 'success')],
    ['a RESULT outcome with its condition', withValueAt(views.result, 'outcome.when', { all: [] })],
    ['a RESULT with a fractional total', { ...views.result, total: 1430.5 }],
    ['a RESULT with a reasoning string', { ...views.result, reasoning: 'Gerekçe.' }],
    ['a RESULT breakdown row with a fractional value', withValueAt(views.result, 'breakdown.0.value', 0.5)],
    ['a RESULT breakdown row with an unknown tone', withValueAt(views.result, 'breakdown.0.tone', 'green')],
    ['a RESULT with a zero scale', withValueAt(views.result, 'thresholds.scaleMax', 0)],
    ['a RESULT band with an unknown tone', withValueAt(views.result, 'thresholds.bands.0.tone', 'neutral')],
    ['a RESULT with negative xp', withValueAt(views.result, 'xp.gained', -1)],
    ['a RESULT with progress above 100%', withValueAt(views.result, 'xp.progressPct', 101)],
    ['a RESULT without verdict text', { ...views.result, verdictText: undefined }],
  ]);

  // Görünüm nesneleri katıdır: geçerli bir nesneye içerikten tek bir alan (koşul, kural kimliği, etki, geometri)
  // eklemek, hatayı tam o nesnenin yolunda (unrecognized_keys) üretmelidir.
  it.each([
    ['a DIALOGUE objective', 'when', views.dialogue, 'objectives.0', { flag: 'f' }],
    ['a DIALOGUE tone', 'effects', views.dialogue, 'tones.0', []],
    ['the DIALOGUE room', 'moodRules', views.dialogue, 'room', []],
    ['an INVESTIGATION tab', 'choices', views.investigation, 'tabs.0', ['ch_show_a']],
    ['a preview marker', 'shapes', views.investigation, 'scenePreview.markers.0', []],
    ['a SCENE found object', 'effects', views.scene, 'found.0', []],
    ['a DOCUMENT solved entry', 'rule', views.document, 'solved.0', 'ex_uv_r2'],
    ['a DOCUMENT row', 'match', views.document, 'rows.0', { tool: 'uv', target: 'r1' }],
    ['a DEDUCTION card', 'combinable', views.deduction, 'cards.0', true],
    ['a DEDUCTION solved entry', 'match', views.deduction, 'solved.0', { a: 'c_a', b: 'c_b' }],
    ['a COURTROOM statement', 'visibleWhen', views.courtroomTestimony, 'statements.0', { flag: 'f' }],
    ['a COURTROOM segment', 'highlightWhen', views.courtroomTestimony, 'statements.0.segments.0', { flag: 'f' }],
    ['the COURTROOM stage', 'rules', views.courtroomTestimony, 'stage', []],
    ['a RESULT outcome', 'when', views.result, 'outcome', { all: [] }],
    ['the RESULT xp', 'formula', views.result, 'xp', { div: [{ score: 'final' }, 10] }],
  ] as [string, string, unknown, string, unknown][])(
    'rejects %s carrying the content field %s',
    (_name, field, view, path, value) => {
      expect(NodeView.safeParse(view).success).toBe(true);
      expect(pathsOf(NodeView, withValueAt(view, `${path}.${field}`, value))).toEqual([path]);
    },
  );

  rejectsInvalidIdAt(NodeView, views.story, ['id', 'blocks.0.character', 'blocks.4.group']);
  rejectsInvalidIdAt(NodeView, views.investigation, [
    'tabs.0.id',
    'tabs.0.choiceIds.0',
    'scenePreview.markers.0.id',
    'quickTalk.characterKey',
    'quickTalk.choiceIds.0',
  ]);
  rejectsInvalidIdAt(NodeView, views.dialogue, ['room.characterKey', 'tones.0.id']);
  rejectsInvalidIdAt(NodeView, views.evidence, ['prompt.speaker', 'evidence.id']);
  rejectsInvalidIdAt(NodeView, views.scene, ['found.0.objectId']);
  rejectsInvalidIdAt(NodeView, views.document, ['rows.0.id', 'tools.0.id', 'solved.0.tool', 'solved.0.target']);
  rejectsInvalidIdAt(NodeView, views.deduction, ['cards.0.id']);
  rejectsInvalidIdAt(NodeView, views.courtroomTestimony, [
    'stage.bench.0.characterKey',
    'stage.witness',
    'stage.counsel',
    'statements.0.id',
    'presentable.0.id',
    'objectionGrounds.0.id',
  ]);
  rejectsInvalidIdAt(NodeView, views.courtroomObjection, ['prosecutionEvidence.id']);
  rejectsInvalidIdAt(NodeView, views.result, ['outcome.id']);

  it('rejects an invalid tool id as a DOCUMENT lens key', () => {
    const bad = withValueAt(views.document, 'rows.1.lens', { 'not an id': { cells: ['x'], tone: 'special' } });
    expect(NodeView.safeParse(bad).success).toBe(false);
  });

  describe('enums shared with the content format', () => {
    // Görünüm, içerik şemasının enum'larını yeniden kullanır; içerikte yeni bir değer açılırsa görünüm de onu kabul eder.
    it('STORY accepts every StoryPhase', () => {
      expect(StoryPhase.options).toEqual(['BRIEFING']);
      for (const phase of StoryPhase.options) {
        expect(NodeView.safeParse({ ...views.story, phase }).success, phase).toBe(true);
      }
    });
    it('INVESTIGATION accepts every InvestigationTabKind', () => {
      expect(InvestigationTabKind.options).toEqual(['SCENE', 'PEOPLE', 'ARCHIVE']);
      for (const kind of InvestigationTabKind.options) {
        expect(NodeView.safeParse(withValueAt(views.investigation, 'tabs.0.kind', kind)).success, kind).toBe(true);
      }
    });
    it('DIALOGUE accepts every DialogueMode', () => {
      expect(DialogueMode.options).toEqual(['CONVERSATION', 'INTERVIEW']);
      for (const mode of DialogueMode.options) {
        expect(NodeView.safeParse({ ...views.dialogue, mode }).success, mode).toBe(true);
      }
    });
    it('DOCUMENT accepts every ToolVisualMode', () => {
      expect(ToolVisualMode.options).toEqual(['UV']);
      for (const visualMode of ToolVisualMode.options) {
        const view = withValueAt(views.document, 'tools.1.visualMode', visualMode);
        expect(NodeView.safeParse(view).success, visualMode).toBe(true);
      }
    });
    it('COURTROOM accepts every CourtroomMode', () => {
      expect(CourtroomMode.options).toEqual(['STAGE', 'TESTIMONY', 'OBJECTION']);
      for (const mode of CourtroomMode.options) {
        expect(NodeView.safeParse({ ...views.courtroomTestimony, mode }).success, mode).toBe(true);
      }
    });
  });
});

describe('SessionView', () => {
  acceptsUnchanged(SessionView, [
    ['the required fields only', sessionView],
    ['every optional field', fullSessionView],
    ...Object.entries(views).map(([name, node]): [string, unknown] => [`a ${name} node`, { ...sessionView, node }]),
  ]);

  rejects(SessionView, [
    ['null', null],
    ['no node', { ...sessionView, node: undefined }],
    ['no header', { ...sessionView, header: undefined }],
    ['no hud', { ...sessionView, hud: undefined }],
    ['no cast', { ...sessionView, cast: undefined }],
    ['no bag', { ...sessionView, bag: undefined }],
    ['no notebook', { ...sessionView, notebook: undefined }],
    ['an unknown session status', withValueAt(sessionView, 'session.status', 'PAUSED')],
    ['an unknown session mode', withValueAt(sessionView, 'session.mode', 'DEBUG')],
    ['an empty session id', withValueAt(sessionView, 'session.id', '')],
    ['an empty case id', withValueAt(sessionView, 'session.caseId', '')],
    ['a fractional state version', withValueAt(sessionView, 'session.stateVersion', 1.5)],
    ['a negative state version', withValueAt(sessionView, 'session.stateVersion', -1)],
    ['a negative case number', withValueAt(sessionView, 'session.caseNumber', -7)],
    ['a back button without a choice', withValueAt(sessionView, 'header.back', { a11yLabel: 'Geri' })],
    ['a cast member with a bad accent', withValueAt(fullSessionView, 'cast.k.accent', 'orange')],
    ['a cast member with an unknown role', withValueAt(fullSessionView, 'cast.k.role', 'BARISTA')],
    ['a cast member with 19 sprite rows', withValueAt(fullSessionView, 'cast.k.sprite.rows', rows20.slice(1))],
    ['a cast member with a sprite id', withValueAt(fullSessionView, 'cast.k.sprite.id', 's_k')],
    ['a cast member with author notes', withValueAt(fullSessionView, 'cast.k.notes', 'Yazar notu')],
    ['a cast member with an unknown expression', withValueAt(fullSessionView, 'cast.k.expression', 'mad')],
    ['a cast key that is not an id', { ...fullSessionView, cast: { 'not an id': fullSessionView.cast.k } }],
    ['a rule in the choice list', { ...sessionView, choices: [{ ...choiceView, kind: 'PRESENT' }] }],
    [
      'a primary button with an unknown tone',
      { ...sessionView, primary: { choiceId: 'ch_a', label: 'x', tone: 'green' } },
    ],
    ['a bag holding a clue card', { ...sessionView, bag: { items: [clueCard] } }],
    ['a notebook holding an evidence card', { ...sessionView, notebook: { items: [evidenceCard] } }],
    ['a negative bag total', { ...sessionView, bag: { items: [], total: -1 } }],
    ['a last result without a resolution', { ...sessionView, last: { ...actionResult, resolution: undefined } }],
    ['a hidden variable bag', { ...sessionView, vars: { strategy_pct: 150 } }],
  ]);

  rejectsInvalidIdAt(SessionView, fullSessionView, [
    'header.back.choiceId',
    'hud.0.id',
    'choices.0.id',
    'primary.choiceId',
    'bag.items.0.id',
    'notebook.items.0.id',
    'last.discovered.0',
    'node.id',
  ]);

  it('keeps Turkish text byte for byte', () => {
    const view = withValueAt(withValueAt(fullSessionView, 'lines.0.text', turkish), 'cast.k.name', turkish);
    const parsed = SessionView.parse(view);
    expect(parsed.lines[0]?.text).toBe(turkish);
    expect(parsed.cast.k?.name).toBe(turkish);
    expect(parsed).toEqual(view);
  });

  it('round-trips through JSON (the API sends it as JSON)', () => {
    const parsed = SessionView.parse(clone(fullSessionView));
    expect(SessionView.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(fullSessionView);
  });
});

describe('CaseReport', () => {
  acceptsUnchanged(CaseReport, [
    ['a full report', caseReport],
    [
      'a report with empty lists and no optional texts',
      {
        ...caseReport,
        outcome: { ...caseReport.outcome, header: undefined, ethicsCard: undefined, reasoning: [] },
        breakdown: [],
        good: [],
        bad: [],
        missed: [],
        alternatives: [],
        skills: [],
        raw: -450,
        final: -450,
        xp: 0,
      },
    ],
    ...['weak', 'medium', 'strong'].map((level): [string, unknown] => [
      `skill level ${level}`,
      withValueAt(caseReport, 'skills.0.level', level),
    ]),
    ['earned above max (max comes from literal amounts)', withValueAt(caseReport, 'skills.0.earned', 300)],
  ]);

  rejects(CaseReport, [
    ['an unknown outcome class', withValueAt(caseReport, 'outcome.class', 'PARDON')],
    ['a stamp tone outside green/amber/red', withValueAt(caseReport, 'outcome.stampTone', 'success')],
    ['a reasoning string', withValueAt(caseReport, 'outcome.reasoning', 'Gerekçe')],
    ['no legal basis', withValueAt(caseReport, 'outcome.legalBasis', undefined)],
    ['the outcome condition', withValueAt(caseReport, 'outcome.when', { all: [] })],
    ['a fractional raw score', { ...caseReport, raw: 1.5 }],
    ['a fractional final score', { ...caseReport, final: 1.5 }],
    ['a fractional breakdown value', withValueAt(caseReport, 'breakdown.0.value', 1.5)],
    ['a mark with an unknown category', withValueAt(caseReport, 'good.0.category', 'HUKUK')],
    ['a mark with a quality field', withValueAt(caseReport, 'good.0.quality', 'GOOD')],
    ['a missed entry without text', withValueAt(caseReport, 'missed.0', { category: 'ARASTIRMA' })],
    ['an unknown skill level', withValueAt(caseReport, 'skills.0.level', 'expert')],
    ['a negative earned score', withValueAt(caseReport, 'skills.0.earned', -10)],
    ['a negative max', withValueAt(caseReport, 'skills.0.max', -1)],
    ['a skill without advice', withValueAt(caseReport, 'skills.0.advice', undefined)],
    ['negative xp', { ...caseReport, xp: -5 }],
    ['fractional xp', { ...caseReport, xp: 4.5 }],
    ['an unknown key', { ...caseReport, seed: 7 }],
  ]);

  rejectsInvalidIdAt(CaseReport, caseReport, [
    'outcome.id',
    'good.0.source',
    'bad.0.source',
    'alternatives.0.outcomeId',
  ]);

  it('keeps Turkish text byte for byte', () => {
    const report = withValueAt(caseReport, 'missed.0.text', turkish);
    expect(CaseReport.parse(report).missed[0]?.text).toBe(turkish);
  });
});
