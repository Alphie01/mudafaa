import type { CasePackage, ChoiceDef, DiscoveryPath, Effect, NodeDef } from '@mudafaa/case-schema';

// Davanın parçaları ve derleme öncesi denetimler. Kaynak `content/src/<slug>/index.ts`, `defineCase(() => parts)`'ı
// varsayılan dışa aktarır; `parts` anahtarları JSON dosya adlarıdır (`50-investigation` → `50-investigation.json`).
// Parçalar `mergeCaseParts` ile ad sırasıyla birleşir: diziler uç uca eklenir, nesneler derin birleşir.

type DeepPartial<T> = T extends readonly unknown[] ? T : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

/** Bir parça: CasePackage'ın herhangi bir alt kümesi (diziler tam öğelerle). */
export type CasePart = DeepPartial<CasePackage>;
/** Davanın bütün parçaları; anahtar `NN-ad` biçimindedir. */
export type CaseParts = Record<string, CasePart>;
export type CaseSource = () => CaseParts | Promise<CaseParts>;

/** Kaynağın varsayılan dışa aktarımı. */
export const defineCase = (source: CaseSource): CaseSource => source;

/** Parça adı: iki basamaklı önek + küçük harf/rakam/tire (validator `loadCase` ile aynı sıralama). */
export const PART_NAME = /^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function checkPartNames(parts: CaseParts): void {
  const bad = Object.keys(parts).filter((name) => !PART_NAME.test(name));
  if (bad.length > 0) {
    throw new Error(`Geçersiz parça adı (NN-ad olmalı, ör. 50-investigation): ${bad.join(', ')}`);
  }
}

export interface DuplicateId {
  namespace: string;
  id: string;
  /** `parça:yol` biçiminde tanım yerleri. */
  locations: string[];
}

/** Yinelenen kimlikler: motorun ad alanları ve kitin ek ad alanları (rapor ipucu, golden path, celse, skor satırı…). */
export class DuplicateIdError extends Error {
  readonly duplicates: DuplicateId[];
  constructor(duplicates: DuplicateId[]) {
    super(
      `Yinelenen kimlik (${duplicates.length}):\n` +
        duplicates.map((d) => `  ${d.namespace} "${d.id}": ${d.locations.join(', ')}`).join('\n'),
    );
    this.name = 'DuplicateIdError';
    this.duplicates = duplicates;
  }
}

type Entry = { namespace: string; id: string; at: string };
const idOf = (x: unknown): string | undefined =>
  typeof x === 'object' && x !== null && typeof (x as { id?: unknown }).id === 'string'
    ? (x as { id: string }).id
    : undefined;
const list = (x: unknown): unknown[] => (Array.isArray(x) ? x : []);

function entriesOf(partName: string, part: CasePart): Entry[] {
  const out: Entry[] = [];
  const add = (namespace: string, items: unknown, path: string): void =>
    list(items).forEach((item, i) => {
      const id = idOf(item);
      if (id !== undefined) out.push({ namespace, id, at: `${partName}:${path}[${i}]` });
    });
  const goldenNames = list(part.tests?.goldenPaths).map((g) => (g as { name?: unknown }).name);
  goldenNames.forEach((name, i) => {
    if (typeof name === 'string')
      out.push({ namespace: 'golden path', id: name, at: `${partName}:tests.goldenPaths[${i}]` });
  });
  add('değişken', part.variables, 'variables');
  add('sprite', part.sprites, 'sprites');
  add('karakter', part.characters, 'characters');
  add('delil', part.evidence, 'evidence');
  add('yüklem', part.predicates, 'predicates');
  add('tetikleyici', part.triggers, 'triggers');
  add('sonuç', part.outcomes, 'outcomes');
  add('varlık', part.assets, 'assets');
  add('rapor ipucu', part.report?.hints, 'report.hints');
  add('itiraz gerekçesi', part.config?.objectionGrounds, 'config.objectionGrounds');
  add('skor satırı', part.config?.scoring?.lines, 'config.scoring.lines');
  add('bonus', part.config?.scoring?.bonuses, 'config.scoring.bonuses');
  add('kronoloji', part.config?.chronology, 'config.chronology');
  add('celse', part.court?.sessions, 'court.sessions');
  list(part.court?.sessions).forEach((s, i) =>
    add(`celse ${idOf(s) ?? i} aşaması`, (s as { stages?: unknown }).stages, `court.sessions[${i}].stages`),
  );
  add('sahne', part.scenes, 'scenes');
  list(part.scenes).forEach((s, i) =>
    add('sahne nesnesi', (s as { objects?: unknown }).objects, `scenes[${i}].objects`),
  );
  add('node', part.nodes, 'nodes');
  list(part.nodes).forEach((raw, i) => {
    const n = raw as NodeDef;
    const p = `nodes[${i}]`;
    add('seçenek', n.choices, `${p}.choices`);
    list(n.choices).forEach((ch, j) =>
      add(`${n.id}/${idOf(ch) ?? j} varyantı`, (ch as ChoiceDef).variants, `${p}.choices[${j}].variants`),
    );
    if (n.type === 'COURTROOM') add('ifade', n.statements, `${p}.statements`);
    if (n.type === 'INVESTIGATION') add(`${n.id} sekmesi`, n.tabs, `${p}.tabs`);
    if (n.type === 'DOCUMENT') {
      add(`${n.id} satırı`, n.rows, `${p}.rows`);
      add(`${n.id} aleti`, n.tools, `${p}.tools`);
    }
    if (n.type === 'DIALOGUE') {
      add(`${n.id} hedefi`, n.objectives, `${p}.objectives`);
      add(`${n.id} tonu`, n.tones, `${p}.tones`);
    }
  });
  return out;
}

/** Bütün parçalardaki yinelenen kimlikler (ad alanı başına; farklı ad alanlarında aynı kimlik serbesttir). */
export function findDuplicateIds(parts: CaseParts): DuplicateId[] {
  const seen = new Map<string, Entry[]>();
  for (const [name, part] of Object.entries(parts).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    for (const e of entriesOf(name, part)) {
      const key = `${e.namespace}\u0000${e.id}`;
      seen.set(key, [...(seen.get(key) ?? []), e]);
    }
  }
  return [...seen.values()]
    .filter((es) => es.length > 1)
    .map((es) => ({ namespace: es[0]?.namespace ?? '', id: es[0]?.id ?? '', locations: es.map((e) => e.at) }));
}

/** Yinelenen kimlik varsa `DuplicateIdError` fırlatır. */
export function assertUniqueIds(parts: CaseParts): void {
  const dups = findDuplicateIds(parts);
  if (dups.length > 0) throw new DuplicateIdError(dups);
}

type Source = DiscoveryPath['source'];
const keyOf = (evidence: string, source: Source): string => `${evidence}|${source.type}|${source.id ?? ''}`;

const discovered = (effects: readonly Effect[] | undefined): string[] =>
  (effects ?? []).flatMap((e) =>
    e.type === 'DISCOVER' ? [e.evidence] : e.type === 'IF' ? [...discovered(e.then), ...discovered(e.else)] : [],
  );

const RULE_KINDS = new Set(['EXAMINE', 'COMBINE', 'PRESS', 'PRESENT', 'OBJECT', 'FALLBACK']);

/**
 * Eksik bulunma yollarını ekler: her DISCOVER etkisi (IF dalları dahil) için kaynağının (NODE, CHOICE, RULE, OBJECT,
 * TRIGGER) koşulsuz yolu ve başlangıçta bilinen her delil için INITIAL yolu. Yeni yol, etkinin bulunduğu parçanın
 * `discoveryPaths` dizisine eklenir. Var olan yollara (koşullu `requires` olanlar dahil) dokunmaz; koşullu teslim
 * (`deliver`) yolları yine açıkça yazılmalıdır. Girdi değişmez.
 */
export function withDiscoveryPaths(parts: CaseParts): CaseParts {
  const existing = new Set<string>();
  for (const part of Object.values(parts)) {
    for (const dp of list(part.discoveryPaths) as DiscoveryPath[]) existing.add(keyOf(dp.evidence, dp.source));
  }
  const out: CaseParts = {};
  for (const [name, part] of Object.entries(parts)) {
    const added: DiscoveryPath[] = [];
    const need = (evidence: string, source: Source): void => {
      const key = keyOf(evidence, source);
      if (existing.has(key)) return;
      existing.add(key);
      added.push({ evidence, source });
    };
    for (const ev of list(part.evidence) as { id: string; initiallyKnown?: boolean }[]) {
      if (ev.initiallyKnown === true) need(ev.id, { type: 'INITIAL' });
    }
    for (const n of list(part.nodes) as NodeDef[]) {
      for (const e of [...discovered(n.onFirstEnter), ...discovered(n.onEnter)]) need(e, { type: 'NODE', id: n.id });
      for (const ch of n.choices ?? []) {
        const type = RULE_KINDS.has(ch.kind) ? 'RULE' : 'CHOICE';
        const all = [...discovered(ch.effects), ...(ch.variants ?? []).flatMap((vr) => discovered(vr.effects))];
        for (const e of all) need(e, { type, id: ch.id });
      }
    }
    for (const sc of list(part.scenes) as { objects?: { id: string; effects?: Effect[] }[] }[]) {
      for (const o of sc.objects ?? []) for (const e of discovered(o.effects)) need(e, { type: 'OBJECT', id: o.id });
    }
    for (const t of list(part.triggers) as { id: string; effects?: Effect[] }[]) {
      for (const e of discovered(t.effects)) need(e, { type: 'TRIGGER', id: t.id });
    }
    out[name] =
      added.length === 0
        ? part
        : { ...part, discoveryPaths: [...(list(part.discoveryPaths) as DiscoveryPath[]), ...added] };
  }
  return out;
}
