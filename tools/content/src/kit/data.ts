import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  Category,
  CharacterDef,
  Cond,
  EvidenceDef,
  OutcomeDef,
  ReportHint,
  ScoringConfig,
  SpriteDef,
  Val,
  VariableDef,
} from '@mudafaa/case-schema';
import { cmp, finalScore, not, has, v } from './expr.js';

// Dava verisi: değişkenler, kadro ve sprite'lar, deliller, skor yapılandırması, sonuçlar ve rapor ipuçları.

// --- Değişkenler ---

/** Gizli bool bayraklar (başlangıç false): `flags('fact_gece', 'contra_s1')`. */
export const flags = (...ids: string[]): VariableDef[] =>
  ids.map((id) => ({ id, type: 'bool', initial: false, visibility: 'HIDDEN' }));

/** Gizli tamsayı sayaç (ör. `wrong`, `legal_hits`, `ethics`); `analysis: 'counter'`, alt sınır 0. */
export const counter = (id: string, initial = 0): VariableDef => ({
  id,
  type: 'int',
  initial,
  min: 0,
  visibility: 'HIDDEN',
  analysis: 'counter',
});

/** Gizli tamsayı. */
export const hiddenInt = (id: string, initial: number, min?: number, max?: number): VariableDef => ({
  id,
  type: 'int',
  initial,
  ...(min === undefined ? {} : { min }),
  ...(max === undefined ? {} : { max }),
  visibility: 'HIDDEN',
});

/** Gizli enum (ör. `tone`). */
export const hiddenEnum = (id: string, values: string[], initial = values[0] ?? ''): VariableDef => ({
  id,
  type: 'enum',
  initial,
  enumValues: values,
  visibility: 'HIDDEN',
});

type Widget = NonNullable<VariableDef['display']>['widget'];

/**
 * HUD'da görünen tamsayı gösterge: 0..max aralığı, `display.max = max`. Kaynak sayaçları (büyüteç, deneme hakkı)
 * için `resource: true` → `analysis: 'resource'`.
 */
export function meter(
  id: string,
  label: string,
  widget: Widget,
  initial: number,
  max: number,
  opts: { min?: number; lowAt?: number; format?: string; resource?: boolean } = {},
): VariableDef {
  return {
    id,
    type: 'int',
    initial,
    min: opts.min ?? 0,
    max,
    visibility: 'VISIBLE',
    ...(opts.resource === true ? { analysis: 'resource' as const } : {}),
    display: {
      label,
      widget,
      max,
      ...(opts.lowAt === undefined ? {} : { lowAt: opts.lowAt }),
      ...(opts.format === undefined ? {} : { format: opts.format }),
    },
  };
}

/** Görünür enum etiketi (ör. strateji). */
export const labelEnum = (id: string, label: string, values: string[], initial = values[0] ?? ''): VariableDef => ({
  id,
  type: 'enum',
  initial,
  enumValues: values,
  visibility: 'VISIBLE',
  display: { label, widget: 'label' },
});

// --- Kadro ---

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

/**
 * `content/shared/sprites/<file>.json` sprite'ını okur. Davadaki kimliği `id` (varsayılan dosya adı). Yeni karakterler
 * için sprite dosyası `content/shared/sprites/<slug>-<ad>.json` olarak yazılır (`npm run case:sprite-preview`).
 */
export function sharedSprite(file: string, id: string = file): SpriteDef {
  const raw = JSON.parse(readFileSync(join(repoRoot, 'content/shared/sprites', `${file}.json`), 'utf8')) as SpriteDef;
  return { ...raw, id };
}

/** Karakter: ham alanlar; `spriteId` varsayılanı karakter kimliğidir. */
export const character = (
  id: string,
  spec: Omit<CharacterDef, 'id' | 'spriteId'> & { spriteId?: string },
): CharacterDef => ({ id, ...spec, spriteId: spec.spriteId ?? id });

// --- Deliller ---

type EvidenceSpec = Omit<
  EvidenceDef,
  'id' | 'kind' | 'presentable' | 'combinable' | 'countsInBag' | 'initiallyKnown' | 'legalValidity'
> &
  Partial<Pick<EvidenceDef, 'presentable' | 'combinable' | 'countsInBag' | 'initiallyKnown' | 'legalValidity'>>;

/**
 * Delil (EVIDENCE). Varsayılanlar: presentable true, combinable false, countsInBag true, initiallyKnown false,
 * legalValidity VALID. Her biri açıkça verilerek ezilebilir.
 */
export const evidence = (id: string, spec: EvidenceSpec): EvidenceDef => ({
  id,
  kind: 'EVIDENCE',
  presentable: true,
  combinable: false,
  countsInBag: true,
  initiallyKnown: false,
  legalValidity: 'VALID',
  ...spec,
});

/**
 * İpucu (CLUE: not defterine girer, çıkarım tahtasında kullanılır). Varsayılanlar: presentable false, combinable true,
 * countsInBag false, initiallyKnown false, legalValidity VALID.
 */
export const clue = (id: string, spec: EvidenceSpec): EvidenceDef => ({
  id,
  kind: 'CLUE',
  presentable: false,
  combinable: true,
  countsInBag: false,
  initiallyKnown: false,
  legalValidity: 'VALID',
  ...spec,
});

/**
 * Çıkarım (INSIGHT: tahtada iki ipucundan doğar, duruşmada sunulur). Varsayılanlar: presentable true, combinable false,
 * countsInBag true, initiallyKnown false, legalValidity VALID.
 */
export const insight = (id: string, spec: EvidenceSpec): EvidenceDef => ({
  id,
  kind: 'INSIGHT',
  presentable: true,
  combinable: false,
  countsInBag: true,
  initiallyKnown: false,
  legalValidity: 'VALID',
  ...spec,
});

// --- Skor ---

/** Altı kategorinin oyundaki sabit etiketleri. */
export const CATEGORY_LABELS: Readonly<Record<Category, string>> = {
  HUKUKI_BILGI: 'Hukuki bilgi',
  DELIL_ANALIZI: 'Delil analizi',
  ARASTIRMA: 'Araştırma',
  SORGULAMA: 'Sorgulama',
  SAVUNMA_STRATEJISI: 'Savunma stratejisi',
  USUL_BILGISI: 'Usul bilgisi',
};

type Advice = ScoringConfig['categories'][number]['advice'];

/** Altı kategori, sabit etiketlerle ve davaya özgü tavsiyelerle (zayıf <%40, orta %40–75, güçlü >%75). */
export const categories = (advice: Record<Category, Advice>): ScoringConfig['categories'] =>
  (Object.keys(CATEGORY_LABELS) as Category[]).map((id) => ({ id, label: CATEGORY_LABELS[id], advice: advice[id] }));

/** Eşik çubuğu: `[['Mahkûmiyet', 0, 'red'], ['İndirim', 2000, 'amber'], ['Beraat', 3200, 'green']]`. */
export const thresholdBar = (
  bands: readonly (readonly [label: string, from: number, tone: 'green' | 'amber' | 'red'])[],
): ScoringConfig['thresholdBar'] => bands.map(([label, from, tone]) => ({ label, from, tone }));

/**
 * XP ifadesi: ⌊final / 10 × f⌋ (motor tabana yuvarlar). `f` en çok iki ondalıklı çarpandır (1,2 · 1 · 0,85 · 0,6 · 0,3).
 * `ethicsVar` verilirse o sayaç > 0 iken XP yarıya iner (Dava #07 kuralı).
 */
export function xp(f: number, opts: { ethicsVar?: string } = {}): Val {
  const num = Math.round(f * 100);
  if (Math.abs(num - f * 100) > 1e-9) throw new Error(`xp: çarpan en çok iki ondalıklı olmalı (${f})`);
  if (num === 0) return 0;
  const of = (den: number): Val => ({ div: [{ mul: [finalScore, num] }, den] });
  if (opts.ethicsVar === undefined) return of(1000);
  return { if: { when: cmp(v(opts.ethicsVar), '>', 0), then: of(2000), else: of(1000) } };
}

// --- Sonuçlar ve rapor ---

/** Gerekçe parçası: `because('…', flag('key_excluded'))`. */
export const because = (text: string, when?: Cond): OutcomeDef['reasoning'][number] =>
  when === undefined ? { text } : { when, text };

/** Sonuç: ham OutcomeDef (kimlik dışındaki bütün alanlar açıkça yazılır). */
export const outcome = (id: string, spec: Omit<OutcomeDef, 'id'>): OutcomeDef => ({ id, ...spec });

/** Final skor eşiği: `finalAtLeast(3200)` → `{cmp: [{score:'final'}, '>=', 3200]}`. */
export const finalAtLeast = (n: number): Cond => cmp(finalScore, '>=', n);

/** Rapor ipucu. */
export const hint = (id: string, when: Cond, text: string, category?: Category): ReportHint =>
  category === undefined ? { id, when, text } : { id, when, text, category };

/** "Bu delili bulmadın" ipucu: `when: {not: {hasEvidence}}`. */
export const missedEvidence = (id: string, evidenceId: string, text: string, category?: Category): ReportHint =>
  hint(id, not(has(evidenceId)), text, category);
