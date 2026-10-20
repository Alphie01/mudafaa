import type {
  ActionKind,
  ActionResult,
  CasePackage,
  Category,
  CharacterDef,
  ChoiceDef,
  Cond,
  DiscoveryPath,
  EvidenceDef,
  NodeDef,
  OutcomeDef,
  SceneDef,
  SceneObject,
  SpriteDef,
  Statement,
  TriggerDef,
  VariableDef,
} from '@mudafaa/case-schema';

/**
 * Oturum durumu: JSON'a serileştirilebilir düz kayıtlar (Map/Set yok). Kimlik anahtarlı kayıtlar yalnızca `getOwn`
 * ile okunur (içerik kimliği `constructor` gibi bir sözcük olabilir).
 * - `vars`: değişken değerleri (int, bool ya da enum metni).
 * - `evidence`: bulunan deliller; `seq` bulunduğu aksiyonun sırası, `via` bulunma yolunun kaynak kimliği.
 * - `characters`: tanışılan karakterler. Değer bir sayıdır ve 0 olabilir; bu yüzden `{met}` doğruluğa değil varlığa bakar.
 * - `visits`: node → girilme sayısı. `uses`: seçenek → seçilme sayısı; varyantlar `ch#variant` anahtarıyla ayrıca sayılır.
 * - `paramUses`: parametre başına bir kez uygulanan (`ONCE_PER_PARAMS`) seçeneklerin kullanılmış parametre anahtarları.
 * - `found`: bulunan sahne nesneleri (`{found}` varlığa bakar). `latches`: tetikleyici kenar durumu (koşulun son değeri).
 * - `score`: kategori toplamları ve döküm satırları (tamsayı). `marks`: kalite işaretleri.
 * - `last`: son aksiyonun sonucu (devam edilince yeniden gösterilir). `outcome`: dava bitince hesaplanan sonuç.
 */
export interface SessionState {
  schema: 1;
  seq: number;
  status: 'ACTIVE' | 'COMPLETED';
  nodeId: string;
  stack: string[];
  vars: Record<string, number | boolean | string>;
  evidence: Record<string, { seq: number; via: string }>;
  characters: Record<string, number>;
  visits: Record<string, number>;
  uses: Record<string, number>;
  paramUses: Record<string, string[]>;
  found: Record<string, number>;
  latches: Record<string, boolean>;
  score: { cat: Record<Category, number>; line: Record<string, number> };
  marks: { seq: number; source: string; quality: 'GOOD' | 'BAD' | 'NEUTRAL'; feedback: string; category?: Category }[];
  last?: ActionResult;
  outcome?: { id: string; raw: number; final: number; xp: number };
}

/**
 * İfade değerlendirme bağlamı. `final` yalnızca sonuç hesaplanırken (sonuç koşulu, xp) dolar; boşken
 * `{score:'final'}` `FINAL_UNAVAILABLE` hatası verir.
 */
export interface EvalCtx {
  c: CompiledCase;
  s: Readonly<SessionState>;
  final?: number;
}

/** Derlenmiş node: tanım ile seçenek/kural/fallback dizinleri. */
export interface CNode {
  def: NodeDef;
  choices: Map<string, ChoiceDef>;
  rules: Record<'EXAMINE' | 'COMBINE' | 'PRESS' | 'PRESENT' | 'OBJECT', ChoiceDef[]>;
  fallbacks: Partial<Record<ActionKind, ChoiceDef>>;
  scopedTriggers: TriggerDef[];
}

/**
 * Derlenmiş dava: tanımlar kimlikle `Map`'lerde durur (kimlik anahtarlı tanım okumaları prototip adlarına karşı
 * güvenlidir). `compile()` (Task 9) üretir. İfade katmanı yalnızca bir kısmını okur: `evalVal`/`evalCond` `evidence`
 * (tür ve etiket süzgeci) ile `predicates`'i, `typeOf` `vars`'ı.
 */
export interface CompiledCase {
  key: string;
  hash: string;
  pkg: Readonly<CasePackage>;
  nodes: Map<string, CNode>;
  choiceIndex: Map<string, { node: string; choice: ChoiceDef }>;
  vars: Map<string, VariableDef>;
  evidence: Map<string, EvidenceDef>;
  characters: Map<string, CharacterDef>;
  sprites: Map<string, SpriteDef>;
  scenes: Map<string, SceneDef>;
  objects: Map<string, { scene: string; obj: SceneObject }>;
  statements: Map<string, { node: string; st: Statement }>;
  predicates: Map<string, Cond>;
  triggers: TriggerDef[];
  outcomes: OutcomeDef[];
  discovery: Map<string, DiscoveryPath[]>;
  grounds: Map<string, { id: string; label: string; legalBasis?: string }>;
  lineByCategory: Map<Category, string>;
}
