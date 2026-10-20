import type { Category, ChoiceDef, Effect, MarkQuality, Next } from '@mudafaa/case-schema';
import { discover, scores } from './expr.js';
import type { ScoreMap } from './expr.js';

// Oyuncu seçenekleri. `option` A–D kararlarının temel taşıdır: kalite işareti (`q` + `feedback`), skor tablosu ve
// etkiler tek nesnede yazılır, çıktı düz bir ChoiceDef'tir.

/** ChoiceDef'in kimlik, tür ve etiket dışındaki ham alanları. */
export type ChoiceFields = Omit<ChoiceDef, 'id' | 'kind' | 'label'>;

/**
 * Seçenek kısaltmaları:
 * - `discovers`: DISCOVER etkileri; en öne eklenir (bulunma yolu `withDiscoveryPaths` ya da elle yazılır).
 * - `score`: SCORE etkileri; `discovers`'tan sonra, `effects`'in ÖNÜNE eklenir (yazım sırası korunur).
 * - `good` / `bad` / `neutral` (en çok biri) + isteğe bağlı `category`: `quality` alanı (rapordaki iyi / kötü hamle
 *   metni). `category` verilmezse `score` tablosunun ilk kategorisi kullanılır; `neutral` kategori almaz. Ham
 *   `quality` ile birlikte kullanılamaz. (`feedback` ise şemadaki aksiyon sonucu kutusudur: `{title?, text?, label?, tone}`.)
 */
export interface OptionSpec extends ChoiceFields {
  discovers?: string | readonly string[];
  score?: ScoreMap;
  good?: string;
  bad?: string;
  neutral?: string;
  category?: Category;
}

const fail = (id: string, message: string): never => {
  throw new Error(`${id}: ${message}`);
};

function choice(kind: ChoiceDef['kind'], id: string, label: string | undefined, spec: OptionSpec): ChoiceDef {
  const { discovers, score: scoreMap, good, bad, neutral, category, effects, quality, ...rest } = spec;
  const marks: [MarkQuality, string][] = [];
  if (good !== undefined) marks.push(['GOOD', good]);
  if (bad !== undefined) marks.push(['BAD', bad]);
  if (neutral !== undefined) marks.push(['NEUTRAL', neutral]);
  if (marks.length > 1) fail(id, 'good, bad ve neutral kısaltmalarından en çok biri verilebilir');
  if (quality !== undefined && marks.length > 0) fail(id, 'quality ile good/bad/neutral birlikte kullanılamaz');
  const [q, feedback] = marks[0] ?? [];
  const found = discovers === undefined ? [] : typeof discovers === 'string' ? [discovers] : [...discovers];
  const all: Effect[] = [...found.map(discover), ...scores(scoreMap), ...(effects ?? [])];
  const cat = category ?? (q === 'NEUTRAL' ? undefined : (Object.keys(scoreMap ?? {})[0] as Category | undefined));
  const out: ChoiceDef = { id, kind, ...(label === undefined ? {} : { label }), ...rest };
  if (all.length > 0) out.effects = all;
  if (quality !== undefined) out.quality = quality;
  if (q !== undefined && feedback !== undefined) {
    out.quality = cat === undefined ? { q, feedback } : { q, feedback, category: cat };
  }
  return out;
}

/** OPTION: tek seferlik seçenek (A–D kararları, sorular). */
export const option = (id: string, label: string, spec: OptionSpec = {}): ChoiceDef =>
  choice('OPTION', id, label, spec);

/** CONTINUE: devam düğmesi; `next` zorunlu. */
export const cont = (id: string, label: string, next: Next, spec: OptionSpec = {}): ChoiceDef =>
  choice('CONTINUE', id, label, { ...spec, next });

/** NAVIGATE: gezinme seçeneği (sınırsız kullanım). */
export const nav = (id: string, label: string, next: Next, spec: OptionSpec = {}): ChoiceDef =>
  choice('NAVIGATE', id, label, { ...spec, next });

/** Alt ekrandan hub'a dönüş: `role: 'BACK'`, `next: '$return'`. */
export const back = (id: string, label = 'Geri dön', spec: OptionSpec = {}): ChoiceDef =>
  choice('CONTINUE', id, label, { role: 'BACK', ...spec, next: '$return' });

/** Ham tür ile seçenek (kurallar ve FALLBACK için de kullanılabilir). */
export const rawChoice = (kind: ChoiceDef['kind'], id: string, label: string | undefined, spec: OptionSpec = {}) =>
  choice(kind, id, label, spec);

/** `next`'i olmayan seçeneklere varsayılan `next` verir (A–D kararlarında hepsi aynı node'a gider). */
export const withNext = (choices: readonly ChoiceDef[], next: Next | undefined): ChoiceDef[] =>
  choices.map((ch) =>
    next === undefined || ch.next !== undefined || !['OPTION', 'CONTINUE', 'NAVIGATE', 'TOPIC'].includes(ch.kind)
      ? ch
      : { ...ch, next },
  );
