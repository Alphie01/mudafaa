import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  ActionKind,
  Block,
  CharacterDef,
  CharacterRole,
  ChoiceDef,
  ChoiceKind,
  ChoiceTag,
  Cost,
  CourtSessionDef,
  CourtStageType,
  DiscoveryPath,
  EvidenceDef,
  EvidenceKind,
  EvidenceRelation,
  Feedback,
  IconKey,
  Line,
  Match,
  NodeDef,
  Next,
  OutcomeClass,
  OutcomeDef,
  Quality,
  ReportHint,
  ResponseBlock,
  SceneDef,
  SceneObject,
  ScoringConfig,
  Shape,
  SpriteDef,
  Statement,
  TriggerDef,
  Variant,
} from '@mudafaa/case-schema';

type Case = [name: string, value: unknown];

// Tablodaki her değer şemadan değişmeden geçmeli: şema alan eklemez, düşürmez, dönüştürmez (varsayılan değer de basmaz).
const acceptsUnchanged = (schema: z.ZodType, cases: Case[]) =>
  it.each(cases)('accepts %s unchanged', (_name, value) => {
    const result = schema.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

const rejects = (schema: z.ZodType, cases: Case[]) =>
  it.each(cases)('rejects %s', (_name, value) => {
    expect(schema.safeParse(value).success).toBe(false);
  });

// Listedeki her değişmez değer kabul edilir, listede olmayan reddedilir.
const enumField = (schema: z.ZodType, base: object, field: string, values: string[]) => {
  it.each(values)(`${field} accepts %s`, (value) => {
    expect(schema.safeParse({ ...base, [field]: value }).success).toBe(true);
  });
  it(`${field} rejects a value outside the list`, () => {
    expect(schema.safeParse({ ...base, [field]: 'NOPE' }).success).toBe(false);
  });
};

const issuesOf = (schema: z.ZodType, value: unknown) => {
  const result = schema.safeParse(value);
  return result.success ? [] : result.error.issues;
};
const pathsOf = (schema: z.ZodType, value: unknown) => issuesOf(schema, value).map((issue) => issue.path.join('.'));

// Kimlik tipli alanlar: örnekteki değer geçersiz bir kimlikle değiştirilir ve hata tam o yolda raporlanmalıdır
// (alan serbest metne gevşetilirse bu testler kırılır). Yollar noktayla yazılır; dizi indisleri de yoldur.
const withValueAt = (sample: unknown, path: string, value: unknown) => {
  const copy = structuredClone(sample) as Record<string, unknown>;
  const keys = path.split('.');
  let parent = copy;
  for (const key of keys.slice(0, -1)) parent = parent[key] as Record<string, unknown>;
  parent[keys[keys.length - 1] as string] = value;
  return copy;
};

const rejectsInvalidIdAt = (schema: z.ZodType, sample: unknown, paths: string[]) =>
  it.each(paths)('rejects an invalid id at %s', (path) => {
    expect(schema.safeParse(sample).success).toBe(true);
    expect(pathsOf(schema, withValueAt(sample, path, 'not an id'))).toContain(path);
  });

const turkish = '“Sokak lambası yanıyordu” — İ ı ş ğ −150';

const actionKinds = ['CHOOSE', 'TAP', 'EXAMINE', 'COMBINE', 'PRESS', 'PRESENT', 'OBJECT'];

const outcome = {
  id: 'o_win',
  class: 'ACQUITTAL',
  priority: 1,
  when: {
    all: [{ cmp: [{ var: 'pers' }, '>=', 5] }, { cmp: [{ score: 'final' }, '>=', 300] }],
  },
  stamp: 'BERAAT',
  stampTone: 'green',
  sentence: 'Ceza yok · Tahliye',
  verdictText: 'Sanığın beraatine karar verildi.',
  reasoning: [{ text: 'Mazeret doğrulandı.' }],
  legalBasis: 'CMK 223/2-b',
  xp: { div: [{ mul: [{ score: 'final' }, 12] }, 100] },
  howToReach: 'Mazeret ve çöken teşhisi birleştir.',
};

describe('SpriteDef', () => {
  const row = '...kkoowwookk...';
  const rows = (rowText = row) => Array.from({ length: 20 }, () => rowText);

  it('SpriteDef requires exactly 20 rows', () => {
    expect(SpriteDef.safeParse({ id: 's_k', rows: rows() }).success).toBe(true);

    const short = SpriteDef.safeParse({ id: 's_k', rows: rows().slice(0, 19) });
    expect(short.success).toBe(false);
    expect(pathsOf(SpriteDef, { id: 's_k', rows: rows().slice(0, 19) })).toEqual(['rows']);
    expect(SpriteDef.safeParse({ id: 's_k', rows: [...rows(), row] }).success).toBe(false);
  });

  rejectsInvalidIdAt(SpriteDef, { id: 's_k', rows: rows() }, ['id']);

  acceptsUnchanged(SpriteDef, [
    ['20 rows of 16 characters', { id: 's_k', rows: rows() }],
    ['rows shorter than 16, down to one character', { id: 's_k', rows: rows('k') }],
    ['upper and lower case palette letters', { id: 's_k', rows: rows('.AaBbZz.') }],
    ['skin, noEyes and noMouth', { id: 's_polis', rows: rows(), skin: 'Q', noEyes: true, noMouth: true }],
    ['noEyes and noMouth set to false', { id: 's_k', rows: rows(), noEyes: false, noMouth: false }],
  ]);

  rejects(SpriteDef, [
    ['null', null],
    ['missing rows', { id: 's_k' }],
    ['empty rows', { id: 's_k', rows: [] }],
    ['21 rows', { id: 's_k', rows: [...rows(), row] }],
    ['a row of 17 characters', { id: 's_k', rows: [...rows().slice(1), `${row}.`] }],
    ['an empty row', { id: 's_k', rows: [...rows().slice(1), ''] }],
    ['a row with a digit', { id: 's_k', rows: [...rows().slice(1), '...k1k...'] }],
    ['a row with a space', { id: 's_k', rows: [...rows().slice(1), '...k k...'] }],
    ['a row with a Turkish letter (palette keys are ASCII)', { id: 's_k', rows: [...rows().slice(1), '...kşk...'] }],
    ['a row with a trailing newline', { id: 's_k', rows: [...rows().slice(1), 'kk\n'] }],
    ['a row that is not a string', { id: 's_k', rows: [...rows().slice(1), 5] }],
    ['a skin of two characters', { id: 's_k', rows: rows(), skin: 'QQ' }],
    ['an empty skin', { id: 's_k', rows: rows(), skin: '' }],
    ['a skin that is the transparent dot', { id: 's_k', rows: rows(), skin: '.' }],
    ['a skin that is a digit', { id: 's_k', rows: rows(), skin: '1' }],
    ['a non-boolean noEyes', { id: 's_k', rows: rows(), noEyes: 'yes' }],
    ['a non-boolean noMouth', { id: 's_k', rows: rows(), noMouth: 1 }],
    ['an invalid id', { id: '7x', rows: rows() }],
    ['an unknown key', { id: 's_k', rows: rows(), palette: 'x' }],
  ]);
});

describe('CharacterDef', () => {
  const roles = [
    'CLIENT',
    'DEFENDANT',
    'VICTIM',
    'WITNESS',
    'COUNSEL',
    'PROSECUTOR',
    'JUDGE',
    'POLICE',
    'EXPERT',
    'CLERK',
    'USHER',
    'GUARD',
    'MENTOR',
    'ASSISTANT',
    'FAMILY',
    'SUSPECT',
    'OTHER',
  ];
  const character = {
    id: 'k',
    name: 'Kerem Aydın',
    shortLabel: 'Kerem',
    role: 'CLIENT',
    accent: '#e2802f',
    spriteId: 's_k',
  };

  rejectsInvalidIdAt(CharacterDef, character, ['id', 'spriteId']);

  it('CharacterRole is exactly the seventeen roles', () => {
    expect(CharacterRole.options).toEqual(roles);
  });

  acceptsUnchanged(CharacterDef, [
    ['the required fields only', character],
    [
      'every optional field',
      {
        ...character,
        age: 39,
        occupation: 'Depo 1 işçisi',
        bio: 'Murat’ın isteğiyle top taşıdı.',
        notes: 'Yazar notu: ağırbaşlı oynat.',
        initiallyKnown: true,
      },
    ],
    ['an upper-case hex colour', { ...character, accent: '#E2802F' }],
  ]);
  enumField(CharacterDef, character, 'role', roles);

  rejects(CharacterDef, [
    ['null', null],
    ['a lower-case role', { ...character, role: 'client' }],
    ['a missing role', { id: 'k', name: 'K', shortLabel: 'K', accent: '#e2802f', spriteId: 's_k' }],
    ['a missing name', { id: 'k', shortLabel: 'K', role: 'CLIENT', accent: '#e2802f', spriteId: 's_k' }],
    ['a missing shortLabel', { id: 'k', name: 'K', role: 'CLIENT', accent: '#e2802f', spriteId: 's_k' }],
    ['a missing accent', { id: 'k', name: 'K', shortLabel: 'K', role: 'CLIENT', spriteId: 's_k' }],
    ['a missing spriteId', { id: 'k', name: 'K', shortLabel: 'K', role: 'CLIENT', accent: '#e2802f' }],
    ['a short hex colour', { ...character, accent: '#fff' }],
    ['a colour name', { ...character, accent: 'orange' }],
    ['a spriteId that is not an id', { ...character, spriteId: 's k' }],
    ['an invalid id', { ...character, id: '7x' }],
    ['a negative age', { ...character, age: -1 }],
    ['a fractional age', { ...character, age: 39.5 }],
    ['an age given as text', { ...character, age: '39' }],
    ['a non-boolean initiallyKnown', { ...character, initiallyKnown: 'yes' }],
    ['an unknown key', { ...character, sprite: 's_k' }],
  ]);
});

describe('EvidenceDef, EvidenceRelation and DiscoveryPath', () => {
  const icons = [
    'key',
    'document',
    'receipt',
    'bulb',
    'camera',
    'phone',
    'fingerprint',
    'boot',
    'cigarette',
    'magnifier',
    'uv',
    'dust',
    'compare',
    'lock',
    'check',
  ];
  const evidence = {
    id: 'e_key',
    kind: 'EVIDENCE',
    type: 'FIZIKSEL',
    title: 'Depo anahtarı',
    shortText: 'Tüm vardiyada ortak anahtar',
    description: 'Kerem’in çantasında bulunan anahtar; çanta rızası olmadan arandı.',
    sourceLabel: 'Teslim tutanağı 08.20',
    icon: 'key',
    legalValidity: 'EXCLUDABLE',
    presentable: true,
    combinable: false,
    countsInBag: true,
    initiallyKnown: true,
  };

  rejectsInvalidIdAt(EvidenceDef, { ...evidence, relatedCharacters: ['k'], tags: ['key'] }, [
    'id',
    'relatedCharacters.0',
    'tags.0',
  ]);

  it('IconKey is exactly the fifteen icons', () => {
    expect(IconKey.options).toEqual(icons);
  });

  it('EvidenceDef.kind reuses the EvidenceKind schema instead of copying it (Ruling 19)', () => {
    expect(EvidenceDef.shape.kind).toBe(EvidenceKind);
  });

  acceptsUnchanged(EvidenceDef, [
    ['the required fields only', evidence],
    [
      'every optional field',
      {
        ...evidence,
        tagLabel: 'ANAHTAR',
        side: 'PROSECUTION',
        strength: 'WEAK',
        legalNote: 'Rızasız, yetkisiz arama → dışlanabilir.',
        relatedCharacters: ['k', 's'],
        relatedEvents: ['ev_0805', 'ev_0820'],
        tags: ['key', 'arama'],
        missedHint: 'Aramanın rızasız olduğunu fark etmedin.',
      },
    ],
    ['a CLUE that is combinable', { ...evidence, id: 'c_a', kind: 'CLUE', combinable: true, presentable: false }],
    ['an INSIGHT', { ...evidence, id: 'i_ab', kind: 'INSIGHT', icon: 'bulb' }],
    ['empty relation lists', { ...evidence, relatedCharacters: [], relatedEvents: [], tags: [] }],
    ['relatedEvents as free text (they are not ids)', { ...evidence, relatedEvents: ['8 Mart 22.40 · kablo kesildi'] }],
  ]);
  enumField(EvidenceDef, evidence, 'kind', ['EVIDENCE', 'CLUE', 'INSIGHT']);
  enumField(EvidenceDef, evidence, 'type', [
    'FIZIKSEL',
    'DIJITAL',
    'TANIK_IFADESI',
    'KAMERA_KAYDI',
    'TELEFON_KAYDI',
    'ADLI_RAPOR',
    'BELGE',
    'FOTOGRAF',
  ]);
  enumField(EvidenceDef, evidence, 'icon', icons);
  enumField(EvidenceDef, evidence, 'side', ['DEFENSE', 'PROSECUTION', 'NEUTRAL']);
  enumField(EvidenceDef, evidence, 'strength', ['STRONG', 'MEDIUM', 'WEAK']);
  enumField(EvidenceDef, evidence, 'legalValidity', ['VALID', 'EXCLUDABLE', 'EXCLUDED', 'UNKNOWN']);

  const without = (key: string) => Object.fromEntries(Object.entries(evidence).filter(([name]) => name !== key));
  rejects(EvidenceDef, [
    ['null', null],
    ...['id', 'kind', 'type', 'title', 'shortText', 'description', 'sourceLabel', 'icon', 'legalValidity'].map(
      (key): Case => [`a missing ${key}`, without(key)],
    ),
    ...['presentable', 'combinable', 'countsInBag', 'initiallyKnown'].map((key): Case => [
      `a missing ${key} flag (the four flags are required)`,
      without(key),
    ]),
    ['a kind outside EvidenceKind', { ...evidence, kind: 'CLUES' }],
    ['a lower-case kind', { ...evidence, kind: 'clue' }],
    ['an icon outside IconKey', { ...evidence, icon: 'gavel' }],
    ['a non-boolean presentable', { ...evidence, presentable: 'yes' }],
    ['relatedCharacters with an invalid id', { ...evidence, relatedCharacters: ['not an id'] }],
    ['relatedEvents that is not text', { ...evidence, relatedEvents: [1] }],
    ['tags with an invalid id', { ...evidence, tags: ['7x'] }],
    ['an invalid id', { ...evidence, id: 'e key' }],
    ['an unknown key', { ...evidence, weight: 3 }],
  ]);

  describe('EvidenceRelation', () => {
    const relation = { from: 'c_a', to: 'e_ariza', type: 'CONTRADICTS' };

    rejectsInvalidIdAt(EvidenceRelation, relation, ['from', 'to']);

    acceptsUnchanged(EvidenceRelation, [['a relation', relation]]);
    enumField(EvidenceRelation, relation, 'type', ['SUPPORTS', 'CONTRADICTS', 'DERIVED_FROM', 'REFUTES']);
    rejects(EvidenceRelation, [
      ['a missing from', { to: 'e_ariza', type: 'SUPPORTS' }],
      ['a missing to', { from: 'c_a', type: 'SUPPORTS' }],
      ['a missing type', { from: 'c_a', to: 'e_ariza' }],
      ['an invalid from id', { ...relation, from: '7x' }],
      ['an invalid to id', { ...relation, to: 'e ariza' }],
      ['an unknown key', { ...relation, weight: 1 }],
    ]);
  });

  describe('DiscoveryPath', () => {
    rejectsInvalidIdAt(DiscoveryPath, { evidence: 'c_a', source: { type: 'OBJECT', id: 'o_lamp' } }, [
      'evidence',
      'source.id',
    ]);

    acceptsUnchanged(DiscoveryPath, [
      ['an initial source without an id', { evidence: 'e_key', source: { type: 'INITIAL' } }],
      ['an object source', { evidence: 'c_a', source: { type: 'OBJECT', id: 'o_lamp' } }],
      [
        'a conditional rule source with a hint',
        {
          evidence: 'c_uv',
          source: { type: 'RULE', id: 'ex_uv_r2' },
          requires: { hasEvidence: 'e_vardiya' },
          hint: 'Çizelgeye UV tut.',
        },
      ],
    ]);
    it.each(['INITIAL', 'OBJECT', 'CHOICE', 'RULE', 'TRIGGER', 'NODE'])('source.type accepts %s', (type) => {
      expect(DiscoveryPath.safeParse({ evidence: 'c_a', source: { type } }).success).toBe(true);
    });
    rejects(DiscoveryPath, [
      ['a missing evidence', { source: { type: 'INITIAL' } }],
      ['a missing source', { evidence: 'c_a' }],
      ['a source type outside the list', { evidence: 'c_a', source: { type: 'MAGIC' } }],
      ['a source without a type', { evidence: 'c_a', source: { id: 'o_lamp' } }],
      ['a source id that is not an id', { evidence: 'c_a', source: { type: 'OBJECT', id: 'o lamp' } }],
      ['a source with an unknown key', { evidence: 'c_a', source: { type: 'OBJECT', node: 'n_scene' } }],
      ['an invalid requires condition', { evidence: 'c_a', source: { type: 'INITIAL' }, requires: { nope: 1 } }],
      ['an invalid evidence id', { evidence: '7x', source: { type: 'INITIAL' } }],
      ['an unknown key', { evidence: 'c_a', source: { type: 'INITIAL' }, extra: 1 }],
    ]);
  });
});

describe('Shape, SceneObject and SceneDef', () => {
  const rect = { rect: { x: 10, y: 10, w: 20, h: 20 } };

  acceptsUnchanged(Shape, [
    ['a rect', rect],
    ['a circle', { circle: { cx: 70, cy: 70, r: 10 } }],
    [
      'a triangle',
      {
        polygon: [
          [0, 0],
          [10, 0],
          [0, 10],
        ],
      },
    ],
    [
      'a polygon with many corners',
      {
        polygon: [
          [0, 0],
          [10, 0],
          [12, 6],
          [10, 10],
          [0, 10],
        ],
      },
    ],
  ]);
  rejects(Shape, [
    ['null', null],
    ['an empty object', {}],
    ['an unknown shape', { ellipse: { cx: 1, cy: 1, rx: 2, ry: 3 } }],
    ['two shapes in one object', { ...rect, circle: { cx: 1, cy: 1, r: 1 } }],
    ['a rect with a negative origin', { rect: { x: -1, y: 0, w: 5, h: 5 } }],
    ['a rect of zero width', { rect: { x: 0, y: 0, w: 0, h: 5 } }],
    ['a circle of radius zero', { circle: { cx: 5, cy: 5, r: 0 } }],
    ['a circle of negative radius', { circle: { cx: 5, cy: 5, r: -2 } }],
    ['a circle with a fractional centre', { circle: { cx: 5.5, cy: 5, r: 2 } }],
    ['a circle without a radius', { circle: { cx: 5, cy: 5 } }],
    ['a circle with an extra key', { circle: { cx: 5, cy: 5, r: 2, extra: 1 } }],
    [
      'a polygon of two corners',
      {
        polygon: [
          [0, 0],
          [10, 0],
        ],
      },
    ],
    ['an empty polygon', { polygon: [] }],
    [
      'a polygon corner with three coordinates',
      {
        polygon: [
          [0, 0],
          [10, 0],
          [0, 10, 5],
        ],
      },
    ],
    ['a polygon corner with one coordinate', { polygon: [[0, 0], [10, 0], [0]] }],
    [
      'a polygon with a fractional corner',
      {
        polygon: [
          [0, 0],
          [10, 0],
          [0, 10.5],
        ],
      },
    ],
    ['a polygon that is not nested', { polygon: [0, 0, 10, 0, 0, 10] }],
  ]);

  const object = {
    id: 'o_lamp',
    name: 'Sokak lambası',
    marker: 'HIDDEN',
    shapes: [rect],
    feedback: { text: 'Lamba o gece yanmıyordu.', short: 'Lamba' },
  };

  rejectsInvalidIdAt(SceneObject, { ...object, inspectNode: 'n_inspect' }, ['id', 'inspectNode']);

  acceptsUnchanged(SceneObject, [
    ['the required fields only', object],
    [
      'every optional field',
      {
        ...object,
        marker: 'VISIBLE',
        shapes: [rect, { circle: { cx: 5, cy: 5, r: 3 } }],
        z: 2,
        activeWhen: { not: { found: 'o_cover' } },
        effects: [
          { type: 'DISCOVER', evidence: 'c_a' },
          { type: 'SCORE', category: 'ARASTIRMA', amount: 40 },
        ],
        badge: '42',
        inspectNode: 'n_inspect',
        maxUses: 1,
      },
    ],
    ['a negative z (below the background)', { ...object, z: -1 }],
  ]);
  enumField(SceneObject, object, 'marker', ['HIDDEN', 'VISIBLE']);
  rejects(SceneObject, [
    ['null', null],
    ['no shapes', { ...object, shapes: [] }],
    ['a missing shapes list', { id: 'o', name: 'n', marker: 'HIDDEN', feedback: object.feedback }],
    ['an invalid shape', { ...object, shapes: [{ circle: { cx: 1, cy: 1, r: 0 } }] }],
    ['a missing feedback', { id: 'o', name: 'n', marker: 'HIDDEN', shapes: [rect] }],
    ['a feedback without short', { ...object, feedback: { text: 'x' } }],
    ['a feedback without text', { ...object, feedback: { short: 'x' } }],
    ['a feedback with an unknown key', { ...object, feedback: { text: 'x', short: 'y', long: 'z' } }],
    ['a missing name', { id: 'o', marker: 'HIDDEN', shapes: [rect], feedback: object.feedback }],
    ['a fractional z', { ...object, z: 1.5 }],
    ['an invalid activeWhen', { ...object, activeWhen: { found: '7x' } }],
    ['an invalid effect', { ...object, effects: [{ type: 'NOPE' }] }],
    ['an inspectNode that is not an id', { ...object, inspectNode: '$return' }],
    ['a zero maxUses', { ...object, maxUses: 0 }],
    ['a fractional maxUses', { ...object, maxUses: 1.5 }],
    ['an invalid id', { ...object, id: '7x' }],
    ['an unknown key', { ...object, color: '#ff0000' }],
  ]);

  const scene = { id: 'sc1', title: 'Depo Sokağı', width: 100, height: 100, image: 'img_depo', objects: [object] };

  rejectsInvalidIdAt(SceneDef, { ...scene, objects: [{ ...object, inspectNode: 'n_inspect' }] }, [
    'id',
    'image',
    'objects.0.id',
    'objects.0.inspectNode',
  ]);

  acceptsUnchanged(SceneDef, [
    ['the required fields only', scene],
    [
      'every optional field',
      {
        ...scene,
        description: '13 Mart olay yeri fotoğrafı',
        touchPadding: 8,
        unlockWhen: { visited: 'n_hub' },
      },
    ],
    ['a scene without objects', { ...scene, objects: [] }],
    ['a zero touchPadding', { ...scene, touchPadding: 0 }],
  ]);
  rejects(SceneDef, [
    ['null', null],
    ['a missing title', { id: 'sc1', width: 1, height: 1, image: 'i', objects: [] }],
    ['a missing width', { id: 'sc1', title: 't', height: 1, image: 'i', objects: [] }],
    ['a missing height', { id: 'sc1', title: 't', width: 1, image: 'i', objects: [] }],
    ['a missing image', { id: 'sc1', title: 't', width: 1, height: 1, objects: [] }],
    ['a missing objects list', { id: 'sc1', title: 't', width: 1, height: 1, image: 'i' }],
    ['a zero width', { ...scene, width: 0 }],
    ['a negative height', { ...scene, height: -5 }],
    ['a fractional width', { ...scene, width: 344.5 }],
    ['an image that is not an id', { ...scene, image: 'depo.png' }],
    ['a negative touchPadding', { ...scene, touchPadding: -1 }],
    ['a fractional touchPadding', { ...scene, touchPadding: 2.5 }],
    ['an invalid unlockWhen', { ...scene, unlockWhen: { visited: '7x' } }],
    ['an invalid object inside objects', { ...scene, objects: [{ ...object, shapes: [] }] }],
    ['an unknown key', { ...scene, layers: [] }],
  ]);

  it('reports an invalid object at its own path', () => {
    expect(pathsOf(SceneDef, { ...scene, objects: [object, { ...object, id: 'o_cam', shapes: [] }] })).toEqual([
      'objects.1.shapes',
    ]);
  });
});

describe('Line, ResponseBlock, Feedback, Cost, Quality and Variant', () => {
  it('Turkish text preserved', () => {
    const text = '“Sokak lambası yanıyordu” — İ ı ş ğ −150';
    expect(Line.parse({ speaker: 'player', text }).text).toBe(text);
  });

  it('keeps Turkish text byte for byte in every entity that carries player-facing text', () => {
    expect(Feedback.parse({ text: turkish, tone: 'info' }).text).toBe(turkish);
    expect(Quality.parse({ q: 'GOOD', feedback: turkish }).feedback).toBe(turkish);
    expect(ChoiceDef.parse({ id: 'c', kind: 'OPTION', label: turkish }).label).toBe(turkish);
    expect(Variant.parse({ id: 'v', label: turkish, prompt: turkish }).prompt).toBe(turkish);
    expect(ResponseBlock.parse({ lines: [{ speaker: 'narrator', text: turkish }] }).lines[0]?.text).toBe(turkish);
    expect(Statement.parse({ id: 'st', order: 1, segments: [{ text: turkish }] }).segments[0]?.text).toBe(turkish);
    expect(OutcomeDef.parse({ ...outcome, verdictText: turkish }).verdictText).toBe(turkish);
    expect(ReportHint.parse({ id: 'h', when: { all: [] }, text: turkish }).text).toBe(turkish);
  });

  rejectsInvalidIdAt(Line, { speaker: 'k', text: 'x' }, ['speaker']);

  acceptsUnchanged(Line, [
    ['a player line', { speaker: 'player', text: 'Olay günü neredeydiniz?' }],
    ['a narrator line', { speaker: 'narrator', text: 'Gece yarısı.' }],
    ['a character line with an expression', { speaker: 'k', expression: 'kizgin', text: 'Ben yapmadım!' }],
    ['an empty text (the validator reports missing text)', { speaker: 'k', text: '' }],
  ]);
  enumField(Line, { speaker: 'k', text: 'x' }, 'expression', ['normal', 'mutlu', 'kizgin', 'saskin', 'uzgun']);
  rejects(Line, [
    ['null', null],
    ['a missing speaker', { text: 'x' }],
    ['a missing text', { speaker: 'k' }],
    ['a speaker that is not an id', { speaker: 'Av. Deniz', text: 'x' }],
    ['an empty speaker', { speaker: '', text: 'x' }],
    ['an expression with Turkish letters', { speaker: 'k', expression: 'kızgın', text: 'x' }],
    ['a non-string text', { speaker: 'k', text: 5 }],
    ['an unknown key', { speaker: 'k', text: 'x', voice: 'low' }],
  ]);

  rejectsInvalidIdAt(ResponseBlock, { lines: [{ speaker: 'k', text: 'x' }] }, ['lines.0.speaker']);

  acceptsUnchanged(ResponseBlock, [
    ['a block without a condition', { lines: [{ speaker: 'k', text: 'Evet.' }] }],
    [
      'a conditional block with two lines',
      {
        when: { chosen: 'tp_night', variant: 'soft' },
        lines: [
          { speaker: 'k', text: 'Çay ocağındaydım.' },
          { speaker: 'narrator', text: 'Gözlerini kaçırdı.' },
        ],
      },
    ],
  ]);
  rejects(ResponseBlock, [
    ['no lines', { lines: [] }],
    ['a missing lines list', { when: { flag: 'f' } }],
    ['an invalid line', { lines: [{ speaker: 'k' }] }],
    ['an invalid condition', { when: { flag: '7x' }, lines: [{ speaker: 'k', text: 'x' }] }],
    ['an unknown key', { lines: [{ speaker: 'k', text: 'x' }], mood: 'sad' }],
  ]);

  acceptsUnchanged(Feedback, [
    ['a tone only', { tone: 'neutral' }],
    ['every field', { title: 'İyi hamle', text: 'Çelişkiyi yakaladın.', label: '+300 SKOR', tone: 'success' }],
  ]);
  enumField(Feedback, { text: 'x' }, 'tone', ['success', 'error', 'neutral', 'special', 'info']);
  rejects(Feedback, [
    ['no tone', { text: 'x' }],
    ['a tone outside Tone', { text: 'x', tone: 'warning' }],
    ['a non-string label', { tone: 'info', label: 300 }],
    ['an unknown key', { tone: 'info', icon: 'check' }],
  ]);

  rejectsInvalidIdAt(Cost, { var: 'ap', amount: 1 }, ['var']);

  acceptsUnchanged(Cost, [
    ['a cost of one', { var: 'ap', amount: 1 }],
    ['a larger cost', { var: 'minutes', amount: 14 }],
  ]);
  rejects(Cost, [
    ['a zero amount', { var: 'ap', amount: 0 }],
    ['a negative amount', { var: 'ap', amount: -1 }],
    ['a fractional amount', { var: 'ap', amount: 1.5 }],
    ['an amount given as text', { var: 'ap', amount: '1' }],
    ['a missing var', { amount: 1 }],
    ['a missing amount', { var: 'ap' }],
    ['a var that is not an id', { var: 'a p', amount: 1 }],
    ['an unknown key', { var: 'ap', amount: 1, label: 'EP' }],
  ]);

  acceptsUnchanged(Quality, [
    ['a quality mark', { q: 'GOOD', feedback: 'Doğru soru.' }],
    ['a quality mark with a category', { q: 'BAD', feedback: 'Yanlış delil.', category: 'DELIL_ANALIZI' }],
  ]);
  enumField(Quality, { feedback: 'x' }, 'q', ['GOOD', 'BAD', 'NEUTRAL']);
  rejects(Quality, [
    ['a missing q', { feedback: 'x' }],
    ['a missing feedback', { q: 'GOOD' }],
    ['the field name quality instead of q', { quality: 'GOOD', feedback: 'x' }],
    ['an unknown category', { q: 'GOOD', feedback: 'x', category: 'HUKUK' }],
    ['an unknown key', { q: 'GOOD', feedback: 'x', weight: 1 }],
  ]);

  rejectsInvalidIdAt(Variant, { id: 'soft', label: 'x' }, ['id']);

  acceptsUnchanged(Variant, [
    ['a bare variant', { id: 'soft', label: 'Yumuşak' }],
    [
      'a variant with everything',
      {
        id: 'hard',
        label: 'Sert',
        prompt: 'Yalan söylüyorsun!',
        effects: [{ type: 'VAR', var: 'trust', op: 'dec', value: 8 }],
        responses: [{ lines: [{ speaker: 'k', expression: 'kizgin', text: 'Ben yapmadım!' }] }],
        quality: { q: 'BAD', feedback: 'Güven sarsıldı.' },
      },
    ],
  ]);
  rejects(Variant, [
    ['a missing id', { label: 'Yumuşak' }],
    ['a missing label', { id: 'soft' }],
    ['an id with the reserved # (variant keys use it)', { id: 'ch#soft', label: 'x' }],
    ['an invalid effect', { id: 'soft', label: 'x', effects: [{ type: 'VAR' }] }],
    ['empty response lines', { id: 'soft', label: 'x', responses: [{ lines: [] }] }],
    ['an invalid quality', { id: 'soft', label: 'x', quality: { q: 'OK', feedback: 'x' } }],
    ['an unknown key', { id: 'soft', label: 'x', cost: [] }],
  ]);
});

describe('Next', () => {
  it('Next accepts $return and push', () => {
    expect(Next.safeParse('$return').success).toBe(true);
    expect(Next.safeParse({ push: 'n_scene' }).success).toBe(true);
    expect(Next.safeParse('$jump').success).toBe(false);
  });

  acceptsUnchanged(Next, [
    ['a node id', 'n_hub'],
    ['$stay', '$stay'],
    ['$return', '$return'],
    ['push', { push: 'n_scene' }],
    ['one route', { routes: [{ to: 'n_result' }] }],
    [
      'conditional routes',
      {
        routes: [{ when: { cmp: [{ var: 'pers' }, '>=', 5] }, to: 'n_story_good' }, { to: 'n_result' }],
      },
    ],
  ]);
  rejects(Next, [
    ['null', null],
    ['an unknown $ keyword', '$jump'],
    ['an empty string', ''],
    ['an id that starts with a digit', '7x'],
    ['a number', 7],
    ['push of a keyword', { push: '$return' }],
    ['push without a target', { push: '' }],
    ['push with an extra key', { push: 'n_scene', extra: 1 }],
    ['an empty object', {}],
    ['no routes', { routes: [] }],
    ['routes that is not an array', { routes: { to: 'n_a' } }],
    ['a route without a target', { routes: [{ when: { flag: 'f' } }] }],
    ['a route to a keyword', { routes: [{ to: '$stay' }] }],
    ['a route with an invalid condition', { routes: [{ when: { flag: '7x' }, to: 'n_a' }] }],
    ['a route with an extra key', { routes: [{ to: 'n_a', label: 'x' }] }],
    ['push and routes together', { push: 'n_a', routes: [{ to: 'n_b' }] }],
  ]);
});

describe('Match and ActionKind', () => {
  it('ActionKind is exactly the seven action kinds', () => {
    expect(ActionKind.options).toEqual(actionKinds);
  });

  acceptsUnchanged(Match, [
    ['tool and target', { tool: 'uv', target: 'r2' }],
    ['a pair', { a: 'c_a', b: 'c_b' }],
    ['a statement', { statement: 'st1' }],
    ['evidence for any statement', { evidence: ['e_key'] }],
    ['a statement and evidence', { statement: 'st1', evidence: ['i_ab', 'e_doc'] }],
    ['a ground for any statement', { ground: 'g_duyum' }],
    ['a statement and a ground', { statement: 's4', ground: 'g_duyum' }],
  ]);
  rejects(Match, [
    ['null', null],
    ['an empty object', {}],
    ['a tool without a target', { tool: 'uv' }],
    ['a target without a tool', { target: 'r2' }],
    ['a without b', { a: 'c_a' }],
    ['b without a', { b: 'c_b' }],
    ['empty evidence', { evidence: [] }],
    ['empty evidence with a statement', { statement: 'st1', evidence: [] }],
    ['evidence that is not a list', { evidence: 'e_key' }],
    ['evidence with an invalid id', { evidence: ['7x'] }],
    ['a tool that is not an id', { tool: 'u v', target: 'r2' }],
    ['a target that is not an id', { tool: 'uv', target: 'r 2' }],
    ['a that is not an id', { a: 'c a', b: 'c_b' }],
    ['b that is not an id', { a: 'c_a', b: 'c b' }],
    ['a statement with an invalid id', { statement: 'st 1' }],
    ['a ground with an invalid id', { ground: '7x' }],
    ['tool and a together', { tool: 'uv', target: 'r2', a: 'x', b: 'y' }],
    ['evidence and ground together', { evidence: ['e_key'], ground: 'g_duyum' }],
    ['a statement with evidence and a ground', { statement: 's', evidence: ['e'], ground: 'g' }],
    ['an unknown key', { statement: 'st1', extra: 1 }],
  ]);
});

describe('ChoiceTag', () => {
  acceptsUnchanged(ChoiceTag, [['a tag', { label: 'Tanık', tone: 'witness' }]]);
  enumField(ChoiceTag, { label: 'x' }, 'tone', ['witness', 'info', 'negative', 'neutral']);
  rejects(ChoiceTag, [
    ['a Tone value that is not a tag tone', { label: 'x', tone: 'success' }],
    ['a missing tone', { label: 'x' }],
    ['a missing label', { tone: 'info' }],
    ['an unknown key', { label: 'x', tone: 'info', icon: 'key' }],
  ]);
});

describe('ChoiceDef', () => {
  const choiceKinds = [
    'OPTION',
    'TOPIC',
    'NAVIGATE',
    'CONTINUE',
    'EXAMINE',
    'COMBINE',
    'PRESS',
    'PRESENT',
    'OBJECT',
    'FALLBACK',
  ];

  it('ChoiceKind is exactly the ten choice kinds', () => {
    expect(ChoiceKind.options).toEqual(choiceKinds);
  });

  it('ChoiceDef FALLBACK requires fallbackFor', () => {
    expect(ChoiceDef.safeParse({ id: 'fb_tap', kind: 'FALLBACK', fallbackFor: 'TAP' }).success).toBe(true);

    const bad = { id: 'fb_tap', kind: 'FALLBACK' };
    expect(ChoiceDef.safeParse(bad).success).toBe(false);
    expect(pathsOf(ChoiceDef, bad)).toEqual(['fallbackFor']);
  });

  it('ChoiceDef PRESENT requires match.evidence', () => {
    const good = { id: 'ps_st1', kind: 'PRESENT', match: { statement: 'st1', evidence: ['i_ab', 'e_doc'] } };
    expect(ChoiceDef.safeParse(good).success).toBe(true);

    const noEvidence = { id: 'ps_st1', kind: 'PRESENT', match: { statement: 'st1' } };
    expect(ChoiceDef.safeParse(noEvidence).success).toBe(false);
    expect(pathsOf(ChoiceDef, noEvidence)).toEqual(['match']);

    expect(ChoiceDef.safeParse({ id: 'ps_st1', kind: 'PRESENT' }).success).toBe(false);
    expect(ChoiceDef.safeParse({ id: 'ps_st1', kind: 'PRESENT', match: { evidence: [] } }).success).toBe(false);
  });

  it('does not bake defaults into the parsed object (the engine applies maxUses and repeat)', () => {
    const parsed = ChoiceDef.parse({ id: 'tp_night', kind: 'TOPIC', label: 'O gece' });
    expect(Object.keys(parsed)).toEqual(['id', 'kind', 'label']);
  });

  rejectsInvalidIdAt(
    ChoiceDef,
    {
      id: 'tp_night',
      kind: 'TOPIC',
      label: 'O gece',
      group: 'konular',
      cost: [{ var: 'minutes', amount: 2 }],
      variants: [{ id: 'soft', label: 'Yumuşak', responses: [{ lines: [{ speaker: 'k', text: 'x' }] }] }],
    },
    ['id', 'group', 'cost.0.var', 'variants.0.id', 'variants.0.responses.0.lines.0.speaker'],
  );

  acceptsUnchanged(ChoiceDef, [
    ['an OPTION with a label only', { id: 'ch_str_a', kind: 'OPTION', label: 'Masumiyet' }],
    [
      'an OPTION with every optional field',
      {
        id: 'cl_a',
        kind: 'OPTION',
        label: 'Gerçek fail başkası',
        description: 'CMK 223/2-b',
        prompt: 'Esas savunmayı seç.',
        group: 'savunma',
        tags: [
          { label: 'Tanık', tone: 'witness' },
          { label: 'Riskli', tone: 'negative' },
        ],
        visibleWhen: { hasEvidence: 'c_a' },
        enabledWhen: { cmp: [{ var: 'cred' }, '>', 0] },
        lockedReason: 'Güvenilirliğin tükendi.',
        cost: [{ var: 'minutes', amount: 2 }],
        maxUses: 1,
        repeat: 'REJECT',
        quality: { q: 'GOOD', feedback: 'Doğru dayanak.', category: 'SAVUNMA_STRATEJISI' },
        effects: [
          {
            type: 'SCORE',
            category: 'SAVUNMA_STRATEJISI',
            amount: { div: [{ mul: [200, { var: 'strategy_pct' }] }, 100] },
          },
        ],
        responses: [{ when: { flag: 'cokus' }, lines: [{ speaker: 'j', expression: 'saskin', text: 'Anlaşıldı.' }] }],
        feedback: { title: 'İyi', text: 'Güzel hamle.', label: '+200 SKOR', tone: 'success' },
        next: { routes: [{ when: { flag: 'f' }, to: 'n_a' }, { to: 'n_b' }] },
        confirm: 'Emin misin?',
        role: 'PRIMARY',
      },
    ],
    [
      'a TOPIC with variants',
      {
        id: 'tp_night',
        kind: 'TOPIC',
        label: 'O gece',
        cost: [{ var: 'minutes', amount: 2 }],
        variants: [
          {
            id: 'soft',
            label: 'Yumuşak',
            effects: [{ type: 'VAR', var: 'trust', op: 'inc', value: 4 }],
            responses: [{ lines: [{ speaker: 'k', text: 'Çay ocağındaydım.' }] }],
          },
          {
            id: 'hard',
            label: 'Sert',
            effects: [
              { type: 'VAR', var: 'trust', op: 'dec', value: 8 },
              { type: 'DISCOVER', evidence: 'c_b' },
            ],
          },
        ],
      },
    ],
    [
      'a NAVIGATE that pushes',
      {
        id: 'ch_go_scene',
        kind: 'NAVIGATE',
        label: 'Olay yeri',
        cost: [{ var: 'ap', amount: 1 }],
        next: { push: 'n_scene' },
      },
    ],
    ['a NAVIGATE with a back role', { id: 'ch_back', kind: 'NAVIGATE', label: 'Geri', next: '$return', role: 'BACK' }],
    ['a CONTINUE that returns', { id: 'ch_talk_end', kind: 'CONTINUE', label: 'Görüşmeyi bitir', next: '$return' }],
    [
      'an EXAMINE rule',
      {
        id: 'ex_uv_r2',
        kind: 'EXAMINE',
        match: { tool: 'uv', target: 'r2' },
        effects: [{ type: 'DISCOVER', evidence: 'c_uv' }],
      },
    ],
    ['a COMBINE rule', { id: 'cb_ab', kind: 'COMBINE', match: { a: 'c_a', b: 'c_b' } }],
    ['a PRESS rule', { id: 'pr_st1', kind: 'PRESS', match: { statement: 'st1' } }],
    [
      'a PRESENT rule for one statement',
      { id: 'ps_st1', kind: 'PRESENT', match: { statement: 'st1', evidence: ['i_ab', 'e_doc'] } },
    ],
    ['a PRESENT rule for any statement', { id: 'ps_any', kind: 'PRESENT', match: { evidence: ['e_key'] } }],
    [
      'an OBJECT rule for one statement',
      { id: 'ob_s4', kind: 'OBJECT', match: { statement: 's4', ground: 'g_duyum' } },
    ],
    ['an OBJECT rule for any statement', { id: 'ob_any', kind: 'OBJECT', match: { ground: 'g_telkin' } }],
    [
      'a rule that also has a label',
      { id: 'ex_label', kind: 'EXAMINE', label: 'İncele', match: { tool: 'uv', target: 'r1' } },
    ],
    [
      'a FALLBACK for TAP',
      {
        id: 'fb_tap',
        kind: 'FALLBACK',
        fallbackFor: 'TAP',
        effects: [{ type: 'SCORE', category: 'ARASTIRMA', amount: -10 }],
      },
    ],
    [
      'a FALLBACK that applies once per params',
      { id: 'fb_cb', kind: 'FALLBACK', fallbackFor: 'COMBINE', repeat: 'ONCE_PER_PARAMS' },
    ],
  ]);

  it.each(actionKinds)('a FALLBACK accepts fallbackFor %s', (fallbackFor) => {
    expect(ChoiceDef.safeParse({ id: 'fb', kind: 'FALLBACK', fallbackFor }).success).toBe(true);
  });
  it.each(['NOOP', 'REJECT', 'APPLY', 'ONCE_PER_PARAMS'])('repeat accepts %s', (repeat) => {
    expect(ChoiceDef.safeParse({ id: 'c', kind: 'OPTION', label: 'x', repeat }).success).toBe(true);
  });
  it.each(['PRIMARY', 'BACK'])('role accepts %s', (role) => {
    expect(ChoiceDef.safeParse({ id: 'c', kind: 'OPTION', label: 'x', role }).success).toBe(true);
  });

  const option = { id: 'c', kind: 'OPTION', label: 'x' };
  const examine = { id: 'c', kind: 'EXAMINE', match: { tool: 'uv', target: 'r2' } };
  const refineFailures: [name: string, value: unknown, path: string][] = [
    ['an OPTION without a label', { id: 'c', kind: 'OPTION' }, 'label'],
    ['a TOPIC without a label', { id: 'c', kind: 'TOPIC' }, 'label'],
    ['a NAVIGATE without a label', { id: 'c', kind: 'NAVIGATE' }, 'label'],
    ['a CONTINUE without a label', { id: 'c', kind: 'CONTINUE' }, 'label'],
    ['an EXAMINE without a match', { id: 'c', kind: 'EXAMINE' }, 'match'],
    ['a COMBINE without a match', { id: 'c', kind: 'COMBINE' }, 'match'],
    ['a PRESS without a match', { id: 'c', kind: 'PRESS' }, 'match'],
    ['a PRESENT without a match', { id: 'c', kind: 'PRESENT' }, 'match'],
    ['an OBJECT without a match', { id: 'c', kind: 'OBJECT' }, 'match'],
    ['an EXAMINE with a COMBINE-shaped match', { ...examine, match: { a: 'x', b: 'y' } }, 'match'],
    ['an EXAMINE with a PRESS-shaped match', { ...examine, match: { statement: 's' } }, 'match'],
    [
      'a COMBINE with an EXAMINE-shaped match',
      { id: 'c', kind: 'COMBINE', match: { tool: 'uv', target: 'r2' } },
      'match',
    ],
    [
      'a PRESS with a PRESENT-shaped match',
      { id: 'c', kind: 'PRESS', match: { statement: 's', evidence: ['e'] } },
      'match',
    ],
    [
      'a PRESS with an OBJECT-shaped match',
      { id: 'c', kind: 'PRESS', match: { statement: 's', ground: 'g' } },
      'match',
    ],
    ['a PRESENT with a statement but no evidence', { id: 'c', kind: 'PRESENT', match: { statement: 'st1' } }, 'match'],
    ['a PRESENT with an OBJECT-shaped match', { id: 'c', kind: 'PRESENT', match: { ground: 'g' } }, 'match'],
    ['an OBJECT with a PRESENT-shaped match', { id: 'c', kind: 'OBJECT', match: { evidence: ['e'] } }, 'match'],
    ['an OBJECT with a PRESS-shaped match', { id: 'c', kind: 'OBJECT', match: { statement: 's' } }, 'match'],
    ['a FALLBACK without fallbackFor', { id: 'c', kind: 'FALLBACK' }, 'fallbackFor'],
    [
      'a FALLBACK that carries a match',
      { id: 'c', kind: 'FALLBACK', fallbackFor: 'TAP', match: { statement: 's' } },
      'match',
    ],
    ['an OPTION that carries a match', { ...option, match: { statement: 's' } }, 'match'],
    ['a TOPIC that carries a match', { id: 'c', kind: 'TOPIC', label: 'x', match: { a: 'x', b: 'y' } }, 'match'],
    ['a NAVIGATE that carries a match', { id: 'c', kind: 'NAVIGATE', label: 'x', match: { statement: 's' } }, 'match'],
    ['a CONTINUE that carries a match', { id: 'c', kind: 'CONTINUE', label: 'x', match: { statement: 's' } }, 'match'],
    ['an OPTION that carries fallbackFor', { ...option, fallbackFor: 'TAP' }, 'fallbackFor'],
    ['a TOPIC that carries fallbackFor', { id: 'c', kind: 'TOPIC', label: 'x', fallbackFor: 'TAP' }, 'fallbackFor'],
    [
      'a NAVIGATE that carries fallbackFor',
      { id: 'c', kind: 'NAVIGATE', label: 'x', fallbackFor: 'TAP' },
      'fallbackFor',
    ],
    [
      'a CONTINUE that carries fallbackFor',
      { id: 'c', kind: 'CONTINUE', label: 'x', fallbackFor: 'TAP' },
      'fallbackFor',
    ],
    ['an EXAMINE that carries fallbackFor', { ...examine, fallbackFor: 'EXAMINE' }, 'fallbackFor'],
  ];

  it.each(refineFailures)('rejects %s at the offending field', (_name, value, path) => {
    const issues = issuesOf(ChoiceDef, value);
    expect(issues.map((issue) => issue.path.join('.'))).toEqual([path]);
    // Mesaj Türkçe yazılır ve alan adını olduğu gibi içerir.
    expect(issues[0]?.message).toContain(path);
    expect(issues[0]?.code).toBe('custom');
  });

  it('reports every violation, each at its own field', () => {
    const value = { id: 'c', kind: 'OPTION', match: { statement: 's' }, fallbackFor: 'TAP' };
    expect(pathsOf(ChoiceDef, value).sort()).toEqual(['fallbackFor', 'label', 'match']);
  });

  rejects(ChoiceDef, [
    ['null', null],
    ['a missing id', { kind: 'OPTION', label: 'x' }],
    ['a missing kind', { id: 'c', label: 'x' }],
    ['an invalid id', { ...option, id: 'ch#soft' }],
    ['an unknown kind', { id: 'c', kind: 'BUTTON', label: 'x' }],
    ['a lower-case kind', { id: 'c', kind: 'option', label: 'x' }],
    ['a group that is not an id', { ...option, group: 'Ceza aralığı' }],
    ['a tag with a Tone value', { ...option, tags: [{ label: 'x', tone: 'success' }] }],
    ['an invalid visibleWhen', { ...option, visibleWhen: { hasEvidence: '7x' } }],
    ['an invalid enabledWhen', { ...option, enabledWhen: { cmp: [1, '=~', 2] } }],
    ['a zero-amount cost', { ...option, cost: [{ var: 'ap', amount: 0 }] }],
    ['a zero maxUses', { ...option, maxUses: 0 }],
    ['a negative maxUses', { ...option, maxUses: -1 }],
    ['a fractional maxUses', { ...option, maxUses: 1.5 }],
    ['a repeat policy outside the list', { ...option, repeat: 'ALWAYS' }],
    ['a role outside the list', { ...option, role: 'SECONDARY' }],
    ['an invalid quality', { ...option, quality: { q: 'OK', feedback: 'x' } }],
    ['an invalid effect', { ...option, effects: [{ type: 'NOPE' }] }],
    ['responses with an empty lines list', { ...option, responses: [{ lines: [] }] }],
    ['a feedback without a tone', { ...option, feedback: { text: 'x' } }],
    ['a next outside the grammar', { ...option, next: '$jump' }],
    ['an invalid variant', { ...option, variants: [{ id: 'ch#soft', label: 'x' }] }],
    ['a fallbackFor outside ActionKind', { id: 'c', kind: 'FALLBACK', fallbackFor: 'CLICK' }],
    ['a non-string confirm', { ...option, confirm: true }],
    ['an unknown key', { ...option, score: 5 }],
  ]);
});

describe('Statement', () => {
  const statement = { id: 'st1', order: 1, segments: [{ text: 'Sokak lambası yanıyordu.' }] };

  rejectsInvalidIdAt(Statement, statement, ['id']);

  acceptsUnchanged(Statement, [
    ['a plain statement', statement],
    [
      'a statement with a conditional highlight',
      {
        id: 'st2',
        order: 2,
        visibleWhen: { chosen: 'pr_st1' },
        segments: [
          { text: 'Lamba ' },
          { text: 'yanıyordu', highlightWhen: { any: [{ hasEvidence: 'i_ab' }, { chosen: 'pr_st1' }] } },
          { text: ', yüzünü seçtim.' },
        ],
      },
    ],
  ]);
  rejects(Statement, [
    ['null', null],
    ['no segments', { ...statement, segments: [] }],
    ['a missing segments list', { id: 'st1', order: 1 }],
    ['a segment without text', { ...statement, segments: [{}] }],
    [
      'a segment with an invalid highlightWhen',
      { ...statement, segments: [{ text: 'x', highlightWhen: { flag: '7x' } }] },
    ],
    ['a segment with an unknown key', { ...statement, segments: [{ text: 'x', bold: true }] }],
    ['a missing order', { id: 'st1', segments: [{ text: 'x' }] }],
    ['a fractional order', { ...statement, order: 1.5 }],
    ['an invalid visibleWhen', { ...statement, visibleWhen: { chosen: '7x' } }],
    ['an invalid id', { ...statement, id: 'st 1' }],
    ['an unknown key', { ...statement, speaker: 'w' }],
  ]);
});

describe('Block', () => {
  const profileCard = {
    type: 'profileCard',
    character: 'k',
    label: 'Sanık',
    lines: ['39 yaşında', 'Depo işçisi'],
    charge: 'TCK 142/2-h, 143',
    demand: '7,5–15 yıl',
  };
  const segments = ['green', 'green', 'gold', 'gold', 'red', 'red', 'darkred', 'darkred'];
  const sentenceRange = {
    type: 'sentenceRange',
    segments,
    markerPct: 37.5,
    labels: ['Beraat', 'TCK 62: 6y3a', '7,5 yıl', '15 yıl'],
    demandLabel: 'İSTEM: 142/2-h + 143',
  };
  const strengthList = {
    type: 'strengthList',
    title: 'Deliller',
    items: [
      { label: 'Anahtar', strength: 'WEAK' },
      { label: 'Bot izi', strength: 'MEDIUM' },
      { label: 'Fiş', strength: 'STRONG' },
    ],
  };
  const choiceGroup = { type: 'choiceGroup', title: 'Strateji', group: 'strateji' };

  rejectsInvalidIdAt(Block, profileCard, ['character']);
  rejectsInvalidIdAt(Block, choiceGroup, ['group']);

  acceptsUnchanged(Block, [
    ['a profileCard', profileCard],
    ['a profileCard without lines', { ...profileCard, lines: [] }],
    ['a sentenceRange', sentenceRange],
    ['a sentenceRange with the marker at both ends', { ...sentenceRange, markerPct: 0 }],
    ['a sentenceRange with the marker at 100', { ...sentenceRange, markerPct: 100 }],
    ['a paragraph', { type: 'paragraph', title: 'Olay', text: 'Depo 3’ten 40 top kumaş çalındı.' }],
    ['a strengthList', strengthList],
    ['an empty strengthList', { ...strengthList, items: [] }],
    ['a choiceGroup', choiceGroup],
    ['a choiceGroup with hints', { ...choiceGroup, hints: { ch_str_a: 'Masum', ch_str_b: 'Usul hatası' } }],
    [
      'a choiceGroup with hint keys that collide with Object.prototype names',
      { ...choiceGroup, hints: { constructor: 'a', toString: 'b' } },
    ],
  ]);
  it.each(['green', 'gold', 'red', 'darkred'])('a sentenceRange segment accepts %s', (colour) => {
    expect(Block.safeParse({ ...sentenceRange, segments: [...segments.slice(1), colour] }).success).toBe(true);
  });
  it.each(['STRONG', 'MEDIUM', 'WEAK'])('a strengthList item accepts %s', (strength) => {
    expect(Block.safeParse({ ...strengthList, items: [{ label: 'x', strength }] }).success).toBe(true);
  });
  rejects(Block, [
    ['null', null],
    ['an unknown block type', { type: 'banner', title: 'x' }],
    ['a block without a type', { title: 'x', text: 'y' }],
    ['a profileCard without a demand', Object.fromEntries(Object.entries(profileCard).filter(([k]) => k !== 'demand'))],
    ['a profileCard without a charge', Object.fromEntries(Object.entries(profileCard).filter(([k]) => k !== 'charge'))],
    ['a profileCard with an invalid character id', { ...profileCard, character: 'Kerem Aydın' }],
    ['a profileCard with lines that are not text', { ...profileCard, lines: [39] }],
    ['a sentenceRange of seven segments', { ...sentenceRange, segments: segments.slice(0, 7) }],
    ['a sentenceRange of nine segments', { ...sentenceRange, segments: [...segments, 'red'] }],
    ['a sentenceRange with an unknown colour', { ...sentenceRange, segments: [...segments.slice(1), 'blue'] }],
    ['a sentenceRange with markerPct above 100', { ...sentenceRange, markerPct: 100.5 }],
    ['a sentenceRange with a negative markerPct', { ...sentenceRange, markerPct: -1 }],
    ['a sentenceRange of three labels', { ...sentenceRange, labels: ['a', 'b', 'c'] }],
    ['a sentenceRange of five labels', { ...sentenceRange, labels: ['a', 'b', 'c', 'd', 'e'] }],
    [
      'a sentenceRange without a demandLabel',
      Object.fromEntries(Object.entries(sentenceRange).filter(([k]) => k !== 'demandLabel')),
    ],
    ['a paragraph without text', { type: 'paragraph', title: 'x' }],
    ['a paragraph without a title', { type: 'paragraph', text: 'x' }],
    ['a strengthList item with an unknown strength', { ...strengthList, items: [{ label: 'x', strength: 'HUGE' }] }],
    ['a strengthList item without a label', { ...strengthList, items: [{ strength: 'WEAK' }] }],
    ['a choiceGroup without a group', { type: 'choiceGroup', title: 'x' }],
    ['a choiceGroup with a group that is not an id', { ...choiceGroup, group: 'Ceza aralığı' }],
    ['a choiceGroup hint keyed by something that is not an id', { ...choiceGroup, hints: { '7x': 'a' } }],
    ['a choiceGroup hint that is not text', { ...choiceGroup, hints: { ch_a: 1 } }],
    ['a paragraph with a choiceGroup field', { type: 'paragraph', title: 'x', text: 'y', group: 'g' }],
    ['a profileCard with an unknown key', { ...profileCard, extra: 1 }],
  ]);
});

describe('NodeDef', () => {
  const choices = [{ id: 'ch_a', kind: 'OPTION', label: 'Devam', next: 'n_hub' }];
  const stage = {
    banner: '2. CELSE · ÇAPRAZ SORGU',
    bench: [
      { character: 'j', label: 'Başkan', xFrac: 0.5 },
      { character: 'uj', label: 'Üye', xFrac: 0.2 },
    ],
    counsel: 'av',
  };
  const decision = { id: 'n1', type: 'DECISION', routes: [{ to: 'n2' }], choices: [] };
  const scene = { id: 'n_scene', type: 'SCENE', scene: 'sc1', instruction: 'Fotoğrafta ipucu ara.', choices: [] };
  const docNode = {
    id: 'n_doc',
    type: 'DOCUMENT',
    title: 'Vardiya çizelgesi',
    header: { left: 'EMANET', right: 'CMK 153/4' },
    columns: [
      { label: 'AD', flex: 1 },
      { label: 'VARDİYA', flex: 1.5 },
    ],
    rows: [
      { id: 'r1', cells: ['A', 'B'] },
      { id: 'r2', cells: ['C', 'D'], lens: { uv: { cells: ['C', 'D*'], tone: 'special' } } },
    ],
    tools: [
      { id: 'mag', label: 'Büyüteç', icon: 'magnifier' },
      { id: 'uv', label: 'UV', icon: 'uv', visualMode: 'UV' },
    ],
    choices: [],
  };
  const courtroom = {
    id: 'n_court1',
    type: 'COURTROOM',
    mode: 'TESTIMONY',
    stage: { ...stage, witness: 'w' },
    choices: [],
  };
  const dialogue = {
    id: 'n_talk',
    type: 'DIALOGUE',
    mode: 'INTERVIEW',
    room: { label: 'Görüşme salonu', character: 'k' },
    choices: [],
  };
  const investigation = {
    id: 'n_hub',
    type: 'INVESTIGATION',
    tabs: [{ id: 't_scene', label: 'OLAY YERİ', kind: 'SCENE', choices: ['ch_go_scene'] }],
    choices: [],
  };

  it('NodeDef discriminates by type', () => {
    expect(NodeDef.safeParse({ id: 'n1', type: 'DECISION', routes: [{ to: 'n2' }], choices: [] }).success).toBe(true);
    expect(NodeDef.safeParse({ id: 'n1', type: 'FOO', routes: [{ to: 'n2' }], choices: [] }).success).toBe(false);
  });

  it('COURTROOM bench xFrac must be within 0..1', () => {
    const withBench = (xFrac: number) => ({
      ...courtroom,
      stage: { ...courtroom.stage, bench: [{ character: 'j', label: 'Başkan', xFrac }] },
    });
    expect(NodeDef.safeParse(withBench(0.5)).success).toBe(true);
    expect(NodeDef.safeParse(withBench(0)).success).toBe(true);
    expect(NodeDef.safeParse(withBench(1)).success).toBe(true);
    expect(NodeDef.safeParse(withBench(1.2)).success).toBe(false);
    expect(NodeDef.safeParse(withBench(-0.01)).success).toBe(false);
    expect(pathsOf(NodeDef, withBench(1.2))).toEqual(['stage.bench.0.xFrac']);
  });

  it('reports a rule violation inside a node at the choice field', () => {
    const bad = { ...decision, choices: [{ id: 'fb', kind: 'FALLBACK' }] };
    expect(pathsOf(NodeDef, bad)).toEqual(['choices.0.fallbackFor']);
  });

  it.each([
    'STORY',
    'CHOICE',
    'EVIDENCE',
    'INVESTIGATION',
    'DIALOGUE',
    'SCENE',
    'DOCUMENT',
    'DEDUCTION',
    'COURTROOM',
    'DECISION',
    'RESULT',
  ])('NodeDef has a %s variant', (type) => {
    expect(NodeDef.options.map((option) => option.shape.type.value)).toContain(type);
  });
  it('NodeDef has exactly eleven variants', () => {
    expect(NodeDef.options).toHaveLength(11);
  });

  const withChoice = { choices: [{ id: 'ch_a', kind: 'OPTION', label: 'x' }] };
  rejectsInvalidIdAt(NodeDef, { ...decision, ...withChoice, hud: ['trust'] }, [
    'id',
    'hud.0',
    'choices.0.id',
    'routes.0.to',
  ]);
  rejectsInvalidIdAt(NodeDef, { id: 'n_ev', type: 'EVIDENCE', evidence: 'e_key', choices: [] }, ['evidence']);
  rejectsInvalidIdAt(
    NodeDef,
    {
      ...investigation,
      scenePreview: { scene: 'sc1' },
      quickTalk: { character: 'k', line: 'Merhaba', choices: ['ch_go_talk'] },
    },
    ['tabs.0.id', 'tabs.0.choices.0', 'scenePreview.scene', 'quickTalk.character', 'quickTalk.choices.0'],
  );
  rejectsInvalidIdAt(
    NodeDef,
    {
      ...dialogue,
      objectives: [{ id: 'ob_night', when: { flag: 'fact_gece' }, known: 'a', unknown: 'b' }],
      tones: [{ id: 'soft', label: 'Yumuşak' }],
    },
    ['room.character', 'objectives.0.id', 'tones.0.id'],
  );
  rejectsInvalidIdAt(NodeDef, { ...scene, actionCosts: { TAP: [{ var: 'taps', amount: 1 }] } }, [
    'scene',
    'actionCosts.TAP.0.var',
  ]);
  rejectsInvalidIdAt(NodeDef, { ...docNode, actionCosts: { EXAMINE: [{ var: 'exam', amount: 1 }] } }, [
    'rows.0.id',
    'tools.0.id',
    'actionCosts.EXAMINE.0.var',
  ]);
  rejectsInvalidIdAt(NodeDef, { id: 'n_board', type: 'DEDUCTION', pool: ['c_a'], choices: [] }, ['pool.0']);
  rejectsInvalidIdAt(
    NodeDef,
    {
      ...courtroom,
      statements: [{ id: 'st1', order: 1, segments: [{ text: 'x' }] }],
      prosecutionEvidence: 'e_key',
      objectionGrounds: ['g_duyum'],
    },
    [
      'stage.bench.0.character',
      'stage.witness',
      'stage.counsel',
      'statements.0.id',
      'prosecutionEvidence',
      'objectionGrounds.0',
    ],
  );

  acceptsUnchanged(NodeDef, [
    ['a STORY with no payload', { id: 'n_story', type: 'STORY', choices: [] }],
    [
      'a STORY with every common field, a phase and all five block types',
      {
        id: 'n_brief',
        type: 'STORY',
        title: 'Brifing',
        eyebrow: 'DAVA #07',
        chapter: 'Bölüm 1',
        background: 'buro',
        hud: ['trust', 'cred'],
        onEnter: [{ type: 'VAR', var: 'ap', op: 'set', value: 3 }],
        onFirstEnter: [{ type: 'MEET', character: 'k' }],
        lines: [{ lines: [{ speaker: 'm', text: 'Dosyayı sana devrediyorum.' }] }],
        exposeCounts: true,
        phase: 'BRIEFING',
        blocks: [
          {
            type: 'profileCard',
            character: 'k',
            label: 'Sanık',
            lines: ['39 yaşında'],
            charge: 'TCK 142/2-h, 143',
            demand: '7,5–15 yıl',
          },
          {
            type: 'sentenceRange',
            segments: ['green', 'green', 'gold', 'gold', 'red', 'red', 'darkred', 'darkred'],
            markerPct: 40,
            labels: ['Beraat', '6y3a', '7,5 yıl', '15 yıl'],
            demandLabel: 'İSTEM',
          },
          { type: 'paragraph', title: 'Olay', text: 'Depo 3’ten 40 top kumaş çalındı.' },
          { type: 'strengthList', title: 'Deliller', items: [{ label: 'Anahtar', strength: 'WEAK' }] },
          { type: 'choiceGroup', title: 'Strateji', group: 'strateji', hints: { ch_str_a: 'Masum' } },
        ],
        choices: [
          {
            id: 'ch_str_a',
            kind: 'OPTION',
            label: 'Masumiyet',
            group: 'strateji',
            effects: [{ type: 'VAR', var: 'strategy_pct', op: 'set', value: 150 }],
            next: 'n_hub',
          },
        ],
      },
    ],
    ['a CHOICE with no prompt', { id: 'n_choice', type: 'CHOICE', choices }],
    [
      'a CHOICE with a prompt',
      { id: 'n_choice', type: 'CHOICE', prompt: { speaker: 'narrator', text: 'Esas savunmayı seç.' }, choices },
    ],
    [
      'an EVIDENCE node',
      {
        id: 'n_ev',
        type: 'EVIDENCE',
        evidence: 'e_key',
        prompt: { speaker: 'j', expression: 'normal', text: 'Savcının delili.' },
        choices: [{ id: 'ev_ok', kind: 'OPTION', label: 'Tamam', next: 'n_dec' }],
      },
    ],
    [
      'an INVESTIGATION with tabs, a scene preview and a quick talk',
      {
        id: 'n_hub',
        type: 'INVESTIGATION',
        tabs: [
          { id: 't_scene', label: 'OLAY YERİ', kind: 'SCENE', choices: ['ch_go_scene'] },
          { id: 't_people', label: 'TANIKLAR', kind: 'PEOPLE', choices: ['ch_go_talk'] },
          { id: 't_archive', label: 'ARŞİV', kind: 'ARCHIVE', choices: ['ch_go_doc', 'ch_go_board'] },
        ],
        scenePreview: { scene: 'sc1' },
        quickTalk: { character: 'k', line: 'Neler oluyor, avukat hanım?', choices: ['ch_go_talk'] },
        choices: [
          {
            id: 'ch_go_scene',
            kind: 'NAVIGATE',
            label: 'Olay yeri',
            cost: [{ var: 'ap', amount: 1 }],
            next: { push: 'n_scene' },
          },
          {
            id: 'ch_go_court',
            kind: 'NAVIGATE',
            label: 'DURUŞMAYA GİT',
            confirm: 'Soruşturma bitsin mi?',
            next: 'n_court1',
          },
        ],
      },
    ],
    ['an INVESTIGATION with no tabs', { ...investigation, tabs: [] }],
    [
      'a DIALOGUE interview with every extra',
      {
        id: 'n_talk',
        type: 'DIALOGUE',
        mode: 'INTERVIEW',
        room: { label: 'Görüşme salonu', character: 'k', expression: 'uzgun' },
        moodRules: [
          { when: { cmp: [{ var: 'trust' }, '<', 40] }, label: 'Temkinli', tone: 'neutral', expression: 'uzgun' },
          { label: 'Çözülüyor', tone: 'success', expression: 'mutlu' },
        ],
        objectives: [
          { id: 'ob_night', when: { flag: 'fact_gece' }, known: 'O gece çay ocağındaydı.', unknown: 'O gece nerede?' },
        ],
        tones: [
          { id: 'soft', label: 'Yumuşak', hint: 'Güven +4' },
          { id: 'hard', label: 'Sert' },
        ],
        allowPresent: true,
        choices: [{ id: 'ch_talk_end', kind: 'CONTINUE', label: 'Görüşmeyi bitir', next: '$return' }],
      },
    ],
    ['a DIALOGUE conversation without extras', { ...dialogue, mode: 'CONVERSATION' }],
    [
      'a SCENE with an action cost',
      {
        ...scene,
        actionCosts: { TAP: [{ var: 'taps', amount: 1 }] },
        choices: [{ id: 'fb_tap', kind: 'FALLBACK', fallbackFor: 'TAP' }],
      },
    ],
    ['a SCENE without action costs', scene],
    ['a DOCUMENT', docNode],
    ['a DOCUMENT with an action cost', { ...docNode, actionCosts: { EXAMINE: [{ var: 'exam', amount: 1 }] } }],
    ['a DOCUMENT without rows, tools or columns', { ...docNode, columns: [], rows: [], tools: [] }],
    [
      'a DOCUMENT lens keyed by ids that collide with Object.prototype names',
      {
        ...docNode,
        rows: [{ id: 'r1', cells: ['A'], lens: { constructor: { cells: ['B'], tone: 'info' } } }],
      },
    ],
    [
      'a DEDUCTION',
      {
        id: 'n_board',
        type: 'DEDUCTION',
        pool: ['c_a', 'c_b', 'c_uv'],
        choices: [{ id: 'cb_ab', kind: 'COMBINE', match: { a: 'c_a', b: 'c_b' } }],
      },
    ],
    ['an empty DEDUCTION pool', { id: 'n_board', type: 'DEDUCTION', pool: [], choices: [] }],
    [
      'a COURTROOM TESTIMONY',
      {
        id: 'n_court1',
        type: 'COURTROOM',
        mode: 'TESTIMONY',
        stage: { ...stage, witness: 'w' },
        statements: [
          {
            id: 'st1',
            order: 1,
            segments: [
              { text: 'Lamba ' },
              { text: 'yanıyordu', highlightWhen: { any: [{ hasEvidence: 'i_ab' }, { chosen: 'pr_st1' }] } },
            ],
          },
          { id: 'st2', order: 2, visibleWhen: { chosen: 'pr_st1' }, segments: [{ text: 'Yüzünü seçtim.' }] },
        ],
        witnessLabel: 'TANIK · Selin Kaya',
        rulesText: 'Önce bastır, sonra sun.',
        courtStage: 'TANIK_DINLEME',
        choices: [
          { id: 'pr_st1', kind: 'PRESS', match: { statement: 'st1' } },
          { id: 'ps_st1', kind: 'PRESENT', match: { statement: 'st1', evidence: ['i_ab', 'e_doc'] } },
          { id: 'fb_ps', kind: 'FALLBACK', fallbackFor: 'PRESENT' },
          { id: 'ch_court_next', kind: 'CONTINUE', label: 'Çapraz sorguyu bitir', next: 'n_obj' },
        ],
      },
    ],
    [
      'a COURTROOM OBJECTION',
      {
        id: 'n_obj',
        type: 'COURTROOM',
        mode: 'OBJECTION',
        stage,
        prosecutionEvidence: 'e_key',
        objectionGrounds: ['g_duyum', 'g_telkin'],
        courtStage: 'DELIL_TARTISMA',
        choices: [{ id: 'ob_a', kind: 'OBJECT', match: { ground: 'g_telkin' } }],
      },
    ],
    [
      'a COURTROOM STAGE with an empty bench',
      { id: 'n_c0', type: 'COURTROOM', mode: 'STAGE', stage: { ...stage, bench: [] }, choices: [] },
    ],
    ['a DECISION', decision],
    [
      'a DECISION with conditional routes',
      {
        id: 'n_dec',
        type: 'DECISION',
        routes: [{ when: { cmp: [{ var: 'pers' }, '>=', 5] }, to: 'n_story_good' }, { to: 'n_result' }],
        choices: [],
      },
    ],
    ['a RESULT', { id: 'n_result', type: 'RESULT', choices: [] }],
  ]);

  enumField(NodeDef, dialogue, 'mode', ['CONVERSATION', 'INTERVIEW']);
  enumField(NodeDef, courtroom, 'mode', ['STAGE', 'TESTIMONY', 'OBJECTION']);
  enumField(NodeDef, courtroom, 'courtStage', [
    'ACILIS',
    'IDDIANAME',
    'SANIK_SAVUNMASI',
    'EK_SAVUNMA',
    'TANIK_DINLEME',
    'DELIL_TARTISMA',
    'MUTALAA',
    'SAVUNMA',
    'SON_SOZ',
    'KARAR',
  ]);
  it.each(['SCENE', 'PEOPLE', 'ARCHIVE'])('an INVESTIGATION tab accepts kind %s', (kind) => {
    const tabs = [{ id: 't', label: 'x', kind, choices: [] }];
    expect(NodeDef.safeParse({ ...investigation, tabs }).success).toBe(true);
  });

  rejects(NodeDef, [
    ['null', null],
    ['a node without a type', { id: 'n1', routes: [{ to: 'n2' }], choices: [] }],
    ['a lower-case type', { ...decision, type: 'decision' }],
    ['a missing id', { type: 'DECISION', routes: [{ to: 'n2' }], choices: [] }],
    ['an invalid id', { ...decision, id: '7x' }],
    [
      'a node without choices (the list is required, even when empty)',
      { id: 'n1', type: 'DECISION', routes: [{ to: 'n2' }] },
    ],
    ['a RESULT without choices', { id: 'n_result', type: 'RESULT' }],
    ['choices that is not a list', { ...decision, choices: {} }],
    ['an invalid choice', { ...decision, choices: [{ id: 'c', kind: 'BUTTON' }] }],
    ['a STORY with a field of another type', { id: 'n', type: 'STORY', choices: [], routes: [{ to: 'n2' }] }],
    ['a STORY with a phase other than BRIEFING', { id: 'n', type: 'STORY', phase: 'EPILOGUE', choices: [] }],
    [
      'a STORY with an invalid block',
      { id: 'n', type: 'STORY', blocks: [{ type: 'paragraph', title: 'x' }], choices: [] },
    ],
    ['a RESULT with an extra key', { id: 'n_result', type: 'RESULT', choices: [], outcome: 'o_win' }],
    ['a hud entry that is not an id', { id: 'n', type: 'STORY', hud: ['trust meter'], choices: [] }],
    ['a non-boolean exposeCounts', { id: 'n', type: 'STORY', exposeCounts: 'yes', choices: [] }],
    ['an invalid onEnter effect', { id: 'n', type: 'STORY', onEnter: [{ type: 'GOTO' }], choices: [] }],
    ['an invalid onFirstEnter effect', { id: 'n', type: 'STORY', onFirstEnter: [{ type: 'NOPE' }], choices: [] }],
    ['node lines with an empty block', { id: 'n', type: 'STORY', lines: [{ lines: [] }], choices: [] }],
    ['an EVIDENCE node without evidence', { id: 'n', type: 'EVIDENCE', choices: [] }],
    ['an EVIDENCE node with an invalid evidence id', { id: 'n', type: 'EVIDENCE', evidence: 'e key', choices: [] }],
    ['a CHOICE prompt that is not a line', { id: 'n', type: 'CHOICE', prompt: 'Seç.', choices: [] }],
    ['an INVESTIGATION without tabs', { id: 'n', type: 'INVESTIGATION', choices: [] }],
    ['a tab of an unknown kind', { ...investigation, tabs: [{ id: 't', label: 'x', kind: 'MAP', choices: [] }] }],
    ['a tab without choices', { ...investigation, tabs: [{ id: 't', label: 'x', kind: 'SCENE' }] }],
    [
      'a tab choice that is not an id',
      { ...investigation, tabs: [{ id: 't', label: 'x', kind: 'SCENE', choices: ['a b'] }] },
    ],
    ['a scenePreview without a scene', { ...investigation, scenePreview: {} }],
    ['a quickTalk without a line', { ...investigation, quickTalk: { character: 'k', choices: [] } }],
    ['a DIALOGUE room without a label', { ...dialogue, room: { character: 'k' } }],
    ['a DIALOGUE without a room', { id: 'n', type: 'DIALOGUE', mode: 'INTERVIEW', choices: [] }],
    ['a DIALOGUE without a mode', { id: 'n', type: 'DIALOGUE', room: dialogue.room, choices: [] }],
    [
      'a DIALOGUE room with an invalid expression',
      { ...dialogue, room: { label: 'x', character: 'k', expression: 'kızgın' } },
    ],
    ['a mood rule without an expression', { ...dialogue, moodRules: [{ label: 'x', tone: 'info' }] }],
    [
      'a mood rule with a tone outside Tone',
      { ...dialogue, moodRules: [{ label: 'x', tone: 'red', expression: 'normal' }] },
    ],
    ['an objective without a condition', { ...dialogue, objectives: [{ id: 'o', known: 'a', unknown: 'b' }] }],
    ['a tone option without a label', { ...dialogue, tones: [{ id: 'soft' }] }],
    ['a non-boolean allowPresent', { ...dialogue, allowPresent: 1 }],
    ['a SCENE without a scene', { id: 'n', type: 'SCENE', instruction: 'x', choices: [] }],
    ['a SCENE without an instruction', { id: 'n', type: 'SCENE', scene: 'sc1', choices: [] }],
    ['a SCENE with an EXAMINE action cost', { ...scene, actionCosts: { EXAMINE: [{ var: 'exam', amount: 1 }] } }],
    ['a SCENE with a zero-amount action cost', { ...scene, actionCosts: { TAP: [{ var: 'taps', amount: 0 }] } }],
    ['a DOCUMENT with a TAP action cost', { ...docNode, actionCosts: { TAP: [{ var: 'taps', amount: 1 }] } }],
    ['a DOCUMENT without a title', Object.fromEntries(Object.entries(docNode).filter(([k]) => k !== 'title'))],
    ['a DOCUMENT without a header', Object.fromEntries(Object.entries(docNode).filter(([k]) => k !== 'header'))],
    ['a DOCUMENT header without a right side', { ...docNode, header: { left: 'x' } }],
    ['a DOCUMENT column with a zero flex', { ...docNode, columns: [{ label: 'x', flex: 0 }] }],
    ['a DOCUMENT column with a negative flex', { ...docNode, columns: [{ label: 'x', flex: -1 }] }],
    ['a DOCUMENT column with a flex given as text', { ...docNode, columns: [{ label: 'x', flex: '1' }] }],
    ['a DOCUMENT row with a cell that is not text', { ...docNode, rows: [{ id: 'r1', cells: [1] }] }],
    [
      'a DOCUMENT lens with a tone outside Tone',
      { ...docNode, rows: [{ id: 'r1', cells: ['A'], lens: { uv: { cells: ['B'], tone: 'blue' } } }] },
    ],
    [
      'a DOCUMENT lens with a cell that is not text',
      { ...docNode, rows: [{ id: 'r1', cells: ['A'], lens: { uv: { cells: [2], tone: 'info' } } }] },
    ],
    ['a DOCUMENT row without cells', { ...docNode, rows: [{ id: 'r1' }] }],
    [
      'a DOCUMENT lens without a tone',
      { ...docNode, rows: [{ id: 'r1', cells: ['A'], lens: { uv: { cells: ['B'] } } }] },
    ],
    [
      'a DOCUMENT lens keyed by a non-id',
      { ...docNode, rows: [{ id: 'r1', cells: ['A'], lens: { 'u v': { cells: ['B'], tone: 'info' } } }] },
    ],
    ['a DOCUMENT tool with an unknown icon', { ...docNode, tools: [{ id: 'x', label: 'x', icon: 'hammer' }] }],
    [
      'a DOCUMENT tool with a visualMode other than UV',
      { ...docNode, tools: [{ id: 'x', label: 'x', icon: 'uv', visualMode: 'IR' }] },
    ],
    ['a DEDUCTION without a pool', { id: 'n', type: 'DEDUCTION', choices: [] }],
    ['a DEDUCTION pool with an invalid id', { id: 'n', type: 'DEDUCTION', pool: ['c a'], choices: [] }],
    ['a COURTROOM without a stage', { id: 'n', type: 'COURTROOM', mode: 'STAGE', choices: [] }],
    ['a COURTROOM without a mode', { id: 'n', type: 'COURTROOM', stage, choices: [] }],
    ['a COURTROOM stage without a counsel', { ...courtroom, stage: { banner: 'x', bench: [] } }],
    ['a COURTROOM stage without a banner', { ...courtroom, stage: { bench: [], counsel: 'av' } }],
    ['a bench seat without a label', { ...courtroom, stage: { ...stage, bench: [{ character: 'j', xFrac: 0.5 }] } }],
    [
      'a bench seat with an invalid character id',
      { ...courtroom, stage: { ...stage, bench: [{ character: 'Hâkim', label: 'x', xFrac: 0.5 }] } },
    ],
    [
      'a bench seat with an xFrac given as text',
      { ...courtroom, stage: { ...stage, bench: [{ character: 'j', label: 'x', xFrac: '0.5' }] } },
    ],
    ['a COURTROOM with an invalid statement', { ...courtroom, statements: [{ id: 'st1', order: 1, segments: [] }] }],
    ['a COURTROOM with an unknown courtStage', { ...courtroom, courtStage: 'ITIRAZ' }],
    ['a COURTROOM with an objectionGrounds entry that is not an id', { ...courtroom, objectionGrounds: ['g duyum'] }],
    ['a COURTROOM with objectionGrounds that is not a list', { ...courtroom, objectionGrounds: 'g_duyum' }],
    ['a DECISION without routes', { id: 'n', type: 'DECISION', choices: [] }],
    ['a DECISION with an empty routes list', { id: 'n', type: 'DECISION', routes: [], choices: [] }],
    ['a DECISION route without a target', { ...decision, routes: [{ when: { flag: 'f' } }] }],
    ['a DECISION route to a keyword', { ...decision, routes: [{ to: '$return' }] }],
  ]);
});

describe('CourtStageType and CourtSessionDef', () => {
  const stageTypes = [
    'ACILIS',
    'IDDIANAME',
    'SANIK_SAVUNMASI',
    'EK_SAVUNMA',
    'TANIK_DINLEME',
    'DELIL_TARTISMA',
    'MUTALAA',
    'SAVUNMA',
    'SON_SOZ',
    'KARAR',
  ];
  const session = {
    id: 'celse2',
    title: '2. Celse',
    stages: [
      { id: 'cs_open', type: 'ACILIS', entryNode: 'C_00' },
      { id: 'cs_ek', type: 'EK_SAVUNMA', entryNode: 'C_02' },
    ],
  };

  it('CourtStageType is exactly the ten stage types', () => {
    expect(CourtStageType.options).toEqual(stageTypes);
  });

  rejectsInvalidIdAt(CourtSessionDef, session, ['id', 'stages.0.id', 'stages.0.entryNode']);

  acceptsUnchanged(CourtSessionDef, [
    ['a session of two stages', session],
    ['a session without stages', { ...session, stages: [] }],
  ]);
  it.each(stageTypes)('a stage accepts type %s', (type) => {
    expect(CourtSessionDef.safeParse({ ...session, stages: [{ id: 's', type, entryNode: 'n' }] }).success).toBe(true);
  });
  rejects(CourtSessionDef, [
    ['null', null],
    ['a missing title', { id: 'celse2', stages: [] }],
    ['a missing stages list', { id: 'celse2', title: 'x' }],
    ['a stage of an unknown type', { ...session, stages: [{ id: 's', type: 'ITIRAZ', entryNode: 'n' }] }],
    ['a stage without an entryNode', { ...session, stages: [{ id: 's', type: 'ACILIS' }] }],
    ['a stage without an id', { ...session, stages: [{ type: 'ACILIS', entryNode: 'n' }] }],
    [
      'a stage with an entryNode that is not an id',
      { ...session, stages: [{ id: 's', type: 'ACILIS', entryNode: '$return' }] },
    ],
    ['a stage with an unknown key', { ...session, stages: [{ id: 's', type: 'ACILIS', entryNode: 'n', order: 1 }] }],
    ['an invalid id', { ...session, id: '7x' }],
    ['an unknown key', { ...session, date: '2026-03-20' }],
  ]);
});

describe('OutcomeDef', () => {
  it('OutcomeClass is exactly the five outcome classes', () => {
    expect(OutcomeClass.options).toEqual(['ACQUITTAL', 'REDUCED', 'CONVICTION', 'RECHARACTERIZED', 'OTHER']);
  });

  rejectsInvalidIdAt(OutcomeDef, outcome, ['id']);

  acceptsUnchanged(OutcomeDef, [
    ['the required fields only', outcome],
    [
      'every optional field and a conditional reasoning',
      {
        ...outcome,
        header: 'TÜRK MİLLETİ ADINA',
        reasoning: [
          { text: 'Mazeret doğrulandı.' },
          { when: { flag: 'key_excluded' }, text: 'Anahtar hukuka aykırı arama ile elde edildi.' },
        ],
        ethicsCard: 'Masum müvekkili suçu üstlenmeye yönlendirmek Av.K. md. 34’e aykırıdır.',
      },
    ],
    [
      'the default outcome (an empty all)',
      { ...outcome, id: 'o_lose', class: 'CONVICTION', priority: 3, when: { all: [] }, xp: 0 },
    ],
    ['a negative priority', { ...outcome, priority: -1 }],
  ]);
  enumField(OutcomeDef, outcome, 'class', ['ACQUITTAL', 'REDUCED', 'CONVICTION', 'RECHARACTERIZED', 'OTHER']);
  enumField(OutcomeDef, outcome, 'stampTone', ['green', 'amber', 'red']);

  const without = (key: string) => Object.fromEntries(Object.entries(outcome).filter(([name]) => name !== key));
  rejects(OutcomeDef, [
    ['null', null],
    ...[
      'id',
      'class',
      'priority',
      'when',
      'stamp',
      'stampTone',
      'sentence',
      'verdictText',
      'reasoning',
      'legalBasis',
      'xp',
      'howToReach',
    ].map((key): Case => [`a missing ${key}`, without(key)]),
    ['a lower-case class', { ...outcome, class: 'acquittal' }],
    ['a stampTone outside the list', { ...outcome, stampTone: 'blue' }],
    ['no reasoning entries', { ...outcome, reasoning: [] }],
    ['a reasoning entry without text', { ...outcome, reasoning: [{ when: { flag: 'f' } }] }],
    ['a reasoning entry with an invalid condition', { ...outcome, reasoning: [{ when: { flag: '7x' }, text: 'x' }] }],
    ['a reasoning entry that is plain text', { ...outcome, reasoning: ['Mazeret doğrulandı.'] }],
    ['a fractional priority', { ...outcome, priority: 1.5 }],
    ['an invalid condition', { ...outcome, when: { flag: '7x' } }],
    ['an invalid xp expression', { ...outcome, xp: { add: 1 } }],
    ['an invalid id', { ...outcome, id: 'o win' }],
    ['an unknown key', { ...outcome, color: 'green' }],
  ]);
});

describe('ScoringConfig', () => {
  const categoryIds = ['HUKUKI_BILGI', 'DELIL_ANALIZI', 'ARASTIRMA', 'SORGULAMA', 'SAVUNMA_STRATEJISI', 'USUL_BILGISI'];
  const categories = categoryIds.map((id) => ({ id, label: `${id} etiketi`, advice: { weak: `${id} zayıf` } }));
  const scoring = {
    categories,
    lines: [
      { id: 'delil', label: 'Delil toplama', categories: ['ARASTIRMA', 'DELIL_ANALIZI'] },
      { id: 'hatali', label: 'Hatalı delil' },
    ],
    bonuses: [{ id: 'b_cred', label: 'Güvenilirlik bonusu', value: { mul: [{ var: 'cred' }, 100] }, line: 'guven' }],
    scaleMax: 1000,
    thresholdBar: [
      { label: 'Mahkûmiyet', from: 0, tone: 'red' },
      { label: 'İndirim', from: 100, tone: 'amber' },
      { label: 'Beraat', from: 300, tone: 'green' },
    ],
  };

  rejectsInvalidIdAt(ScoringConfig, scoring, ['lines.0.id', 'bonuses.0.id', 'bonuses.0.line']);

  acceptsUnchanged(ScoringConfig, [
    ['a full configuration', scoring],
    [
      'every optional field',
      {
        ...scoring,
        categories: categories.map((c) => ({ ...c, advice: { weak: 'zayıf', medium: 'orta', strong: 'güçlü' } })),
        multiplierPct: { var: 'strategy_pct' },
        displayClampMin: 0,
      },
    ],
    ['categories in a different order', { ...scoring, categories: [...categories].reverse() }],
    ['no lines, bonuses or bars', { ...scoring, lines: [], bonuses: [], thresholdBar: [] }],
    ['a negative threshold start', { ...scoring, thresholdBar: [{ label: 'Taban', from: -500, tone: 'red' }] }],
    ['a plain number as the multiplier', { ...scoring, multiplierPct: 120 }],
  ]);
  it.each(['red', 'amber', 'green'])('a threshold band accepts tone %s', (tone) => {
    expect(ScoringConfig.safeParse({ ...scoring, thresholdBar: [{ label: 'x', from: 0, tone }] }).success).toBe(true);
  });

  it('requires exactly six categories, one per Category', () => {
    expect(ScoringConfig.safeParse({ ...scoring, categories: categories.slice(0, 5) }).success).toBe(false);
    expect(ScoringConfig.safeParse({ ...scoring, categories: [...categories, categories[0]] }).success).toBe(false);
    expect(ScoringConfig.safeParse({ ...scoring, categories: [] }).success).toBe(false);
  });

  it('reports a duplicated category at the duplicate and names the missing one', () => {
    const duplicated = [...categories.slice(0, 5), categories[0]];
    const issues = issuesOf(ScoringConfig, { ...scoring, categories: duplicated });
    expect(issues.map((issue) => issue.path.join('.'))).toEqual(['categories.5.id', 'categories']);
    expect(issues[0]?.message).toContain('HUKUKI_BILGI');
    expect(issues[1]?.message).toContain('USUL_BILGISI');
  });

  it('says how many categories are needed and names the missing one when fewer than six are given', () => {
    const issues = issuesOf(ScoringConfig, { ...scoring, categories: categories.slice(0, 5) });
    expect(issues.some((issue) => issue.message.includes('tam 6'))).toBe(true);
    expect(issues.some((issue) => issue.message.includes('USUL_BILGISI'))).toBe(true);
    expect(issues.every((issue) => issue.path.join('.') === 'categories')).toBe(true);
  });

  const category = { id: 'HUKUKI_BILGI', label: 'Hukuki bilgi', advice: { weak: 'x' } };
  const swap = (replacement: unknown) => ({ ...scoring, categories: [replacement, ...categories.slice(1)] });
  it('reports an unknown category id at the entry itself', () => {
    expect(pathsOf(ScoringConfig, swap({ ...category, id: 'HUKUK' }))).toContain('categories.0.id');
  });

  rejects(ScoringConfig, [
    ['null', null],
    ['an unknown category id', swap({ ...category, id: 'HUKUK' })],
    ['a category without a label', swap({ id: 'HUKUKI_BILGI', advice: { weak: 'x' } })],
    ['a category without advice', swap({ id: 'HUKUKI_BILGI', label: 'x' })],
    ['advice without a weak text', swap({ ...category, advice: { medium: 'x' } })],
    ['advice with an unknown level', swap({ ...category, advice: { weak: 'x', excellent: 'y' } })],
    ['a category with an unknown key', swap({ ...category, max: 100 })],
    ['a line without a label', { ...scoring, lines: [{ id: 'delil' }] }],
    ['a line with an unknown category', { ...scoring, lines: [{ id: 'delil', label: 'x', categories: ['HUKUK'] }] }],
    ['a bonus without a value', { ...scoring, bonuses: [{ id: 'b', label: 'x' }] }],
    ['a bonus with an invalid value expression', { ...scoring, bonuses: [{ id: 'b', label: 'x', value: { add: 1 } }] }],
    [
      'a bonus with a line that is not an id',
      { ...scoring, bonuses: [{ id: 'b', label: 'x', value: 1, line: 'güven' }] },
    ],
    ['an invalid multiplierPct expression', { ...scoring, multiplierPct: { mul: 2 } }],
    ['a missing scaleMax', Object.fromEntries(Object.entries(scoring).filter(([k]) => k !== 'scaleMax'))],
    ['a zero scaleMax', { ...scoring, scaleMax: 0 }],
    ['a fractional scaleMax', { ...scoring, scaleMax: 1000.5 }],
    ['a missing thresholdBar', Object.fromEntries(Object.entries(scoring).filter(([k]) => k !== 'thresholdBar'))],
    [
      'a threshold band with a tone outside the list',
      { ...scoring, thresholdBar: [{ label: 'x', from: 0, tone: 'blue' }] },
    ],
    [
      'a threshold band with a fractional start',
      { ...scoring, thresholdBar: [{ label: 'x', from: 0.5, tone: 'red' }] },
    ],
    ['a threshold band without a label', { ...scoring, thresholdBar: [{ from: 0, tone: 'red' }] }],
    ['a fractional displayClampMin', { ...scoring, displayClampMin: 0.5 }],
    ['an unknown key', { ...scoring, curve: 'linear' }],
  ]);
});

describe('TriggerDef', () => {
  const trigger = {
    id: 'tg_day',
    scope: 'n_hub',
    priority: 1,
    when: { all: [{ cmp: [{ var: 'ap' }, '<=', 0] }, { cmp: [{ var: 'day' }, '<', 3] }] },
    effects: [
      { type: 'VAR', var: 'day', op: 'inc', value: 1 },
      { type: 'VAR', var: 'ap', op: 'set', value: 3 },
    ],
  };

  rejectsInvalidIdAt(TriggerDef, { ...trigger, goto: 'n_collapse' }, ['id', 'scope', 'goto']);

  acceptsUnchanged(TriggerDef, [
    ['a node-scoped trigger', trigger],
    [
      'a global once trigger with a goto',
      { id: 'tg_collapse', priority: 0, when: { cmp: [{ var: 'cred' }, '<=', 0] }, once: true, goto: 'n_collapse' },
    ],
    ['a trigger with the required fields only', { id: 'tg', priority: 5, when: { all: [] } }],
    ['a trigger that is not once', { ...trigger, once: false }],
    ['a negative priority', { ...trigger, priority: -3 }],
  ]);
  rejects(TriggerDef, [
    ['null', null],
    ['a missing id', { priority: 1, when: { all: [] } }],
    ['a missing priority', { id: 'tg', when: { all: [] } }],
    ['a missing when', { id: 'tg', priority: 1 }],
    ['a fractional priority', { ...trigger, priority: 0.5 }],
    ['a priority given as text', { ...trigger, priority: '1' }],
    ['an invalid when', { ...trigger, when: { flag: '7x' } }],
    ['a scope that is not an id', { ...trigger, scope: 'n hub' }],
    ['a non-boolean once', { ...trigger, once: 'yes' }],
    ['an invalid effect', { ...trigger, effects: [{ type: 'NOPE' }] }],
    ['a goto that is not an id', { ...trigger, goto: '$return' }],
    ['an unknown key', { ...trigger, cooldown: 2 }],
  ]);
});

describe('ReportHint', () => {
  const hint = { id: 'h_cam', when: { not: { hasEvidence: 'c_b' } }, text: 'Kamera kablosunu kaçırdın.' };

  rejectsInvalidIdAt(ReportHint, hint, ['id']);

  acceptsUnchanged(ReportHint, [
    ['a hint', hint],
    ['a hint with a category', { ...hint, category: 'ARASTIRMA' }],
  ]);
  rejects(ReportHint, [
    ['null', null],
    ['a missing id', { when: { all: [] }, text: 'x' }],
    ['a missing when', { id: 'h', text: 'x' }],
    ['a missing text', { id: 'h', when: { all: [] } }],
    ['an invalid when', { ...hint, when: { hasEvidence: '7x' } }],
    ['an unknown category', { ...hint, category: 'HUKUK' }],
    ['an unknown key', { ...hint, severity: 'high' }],
  ]);
});

describe('JSON Schema export', () => {
  // Task 7'nin casePackageJsonSchema()'sı bu şemaları z.toJSONSchema ile çevirir; temsil edilemeyen bir yapı
  // (transform, custom, ...) eklenirse burada kırılır.
  it.each([
    ['SpriteDef', SpriteDef],
    ['CharacterDef', CharacterDef],
    ['EvidenceDef', EvidenceDef],
    ['EvidenceRelation', EvidenceRelation],
    ['DiscoveryPath', DiscoveryPath],
    ['SceneDef', SceneDef],
    ['ChoiceDef', ChoiceDef],
    ['NodeDef', NodeDef],
    ['CourtSessionDef', CourtSessionDef],
    ['OutcomeDef', OutcomeDef],
    ['ScoringConfig', ScoringConfig],
    ['TriggerDef', TriggerDef],
    ['ReportHint', ReportHint],
  ] as [string, z.ZodType][])('%s converts to JSON Schema', (_name, schema) => {
    const json = z.toJSONSchema(schema);
    expect(typeof json).toBe('object');
    expect(JSON.stringify(json).length).toBeGreaterThan(50);
  });
});
