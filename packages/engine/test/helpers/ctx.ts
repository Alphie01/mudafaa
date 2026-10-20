import { CasePackage, Category } from '@mudafaa/case-schema';
import type { Cond, VariableDef } from '@mudafaa/case-schema';
import mini from '@mudafaa/case-schema/fixtures/mini-case.json' with { type: 'json' };
import type { CompiledCase, EvalCtx, SessionState } from '../../src/types.js';

// İfade testlerinin ortak yardımcısı: mini-case'ten küçük bir `CompiledCase` taslağı ve ayarlanabilir bir oturum durumu
// kurar. Gerçek `compile()` Task 9'da gelir; bu taslak yalnızca ifade katmanının okuduğu tabloları (`vars`, `evidence`,
// `predicates`) ve `characters`'ı doldurur, kalan tabloları boş bırakır (`pkg` ise paketin tamamıdır). Dosya adı
// `.test.ts` ile bitmediği için Vitest bunu test dosyası olarak çalıştırmaz.

type VarValue = number | boolean | string;

/** mini-case'te bool ve enum değişken yok; `{flag}` ve enum eşitliği testleri için bu ikisi her taslağa eklenir. */
const EXTRA_DEFS: VariableDef[] = [
  { id: 'f', type: 'bool', initial: false, visibility: 'HIDDEN' },
  {
    id: 'strategy',
    type: 'enum',
    initial: 'YOK',
    enumValues: ['YOK', 'MASUMIYET', 'USUL', 'INDIRIM'],
    visibility: 'HIDDEN',
  },
];

export interface CtxOptions {
  /** Taslağa eklenen değişken tanımları (`f` ve `strategy`'ye ek olarak). */
  defs?: VariableDef[];
  /** Durum değişkenleri: tanımların başlangıç değerlerinin üstüne yazılır; tanımsız adlar da eklenebilir. */
  vars?: Record<string, VarValue>;
  /** Bulunmuş deliller (`via: 'TEST'`). */
  evidence?: string[];
  /** Tanışılmış karakterler: kimlik → tanışılan `seq` (0 geçerlidir). */
  characters?: Record<string, number>;
  /** Kategori skorları; verilmeyenler 0'dır. */
  cat?: Partial<Record<Category, number>>;
  uses?: Record<string, number>;
  visits?: Record<string, number>;
  found?: Record<string, number>;
  nodeId?: string;
  /** `EvalCtx.final`: yalnızca sonuç hesaplanırken dolu olur. */
  final?: number;
  /** Delil kimliği → etiketler (`{count:'evidence', tag}` testi için; mini-case delilleri etiketsizdir). */
  tags?: Record<string, string[]>;
  /** Taslağa eklenen adlandırılmış yüklemler (mini-case'in `p_strong`'una ek olarak). */
  predicates?: { id: string; when: Cond }[];
}

/** Değerlendiricinin durumu değiştirmediğini kanıtlar: değiştirmeye kalkarsa (katı kipte) TypeError fırlar. */
function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Reflect.ownKeys(value)) deepFreeze((value as Record<PropertyKey, unknown>)[key]);
  }
  return value;
}

/** JSON klonu: her taslak kendi kopyasını kullanır, içe aktarılan fikstüre yazılmaz. */
const parsePackage = (): CasePackage => CasePackage.parse(JSON.parse(JSON.stringify(mini)));

export function makeCtx(options: CtxOptions = {}): EvalCtx {
  const pkg = parsePackage();
  for (const [id, tags] of Object.entries(options.tags ?? {})) {
    const def = pkg.evidence.find((e) => e.id === id);
    if (def === undefined) throw new Error(`Etiket verilen delil mini-case'te yok: ${id}`);
    def.tags = tags;
  }
  const defs = [...pkg.variables, ...EXTRA_DEFS, ...(options.defs ?? [])];
  const predicates = [...pkg.predicates, ...(options.predicates ?? [])];

  const c: CompiledCase = {
    key: pkg.meta.slug,
    hash: 'stub',
    pkg,
    nodes: new Map(),
    choiceIndex: new Map(),
    vars: new Map(defs.map((d) => [d.id, d])),
    evidence: new Map(pkg.evidence.map((e) => [e.id, e])),
    characters: new Map(pkg.characters.map((ch) => [ch.id, ch])),
    sprites: new Map(),
    scenes: new Map(),
    objects: new Map(),
    statements: new Map(),
    predicates: new Map(predicates.map((p) => [p.id, p.when])),
    triggers: [],
    outcomes: [],
    discovery: new Map(),
    grounds: new Map(),
    lineByCategory: new Map(),
  };

  const cat = Object.fromEntries(Category.options.map((k) => [k, options.cat?.[k] ?? 0])) as Record<Category, number>;
  const s: SessionState = {
    schema: 1,
    seq: 0,
    status: 'ACTIVE',
    nodeId: options.nodeId ?? pkg.config.startNode,
    stack: [],
    vars: { ...Object.fromEntries(defs.map((d) => [d.id, d.initial])), ...options.vars },
    evidence: Object.fromEntries((options.evidence ?? []).map((id) => [id, { seq: 0, via: 'TEST' }])),
    characters: { ...options.characters },
    visits: { ...options.visits },
    uses: { ...options.uses },
    paramUses: {},
    found: { ...options.found },
    latches: {},
    score: { cat, line: {} },
    marks: [],
  };

  return options.final === undefined ? { c, s: deepFreeze(s) } : { c, s: deepFreeze(s), final: options.final };
}
