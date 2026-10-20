import type { Category, Cond, Effect, MarkQuality, Val } from '@mudafaa/case-schema';

// Koşul (Cond), değer (Val) ve etki (Effect) kısaltmaları. Her fonksiyon şemadaki nesnenin aynısını döndürür; bir
// kısaltma yoksa ham nesne yazılır (ör. `{ cmp: [{ uses: 'X' }, '>', 1] }`).

/** Bool değişken true. */
export const flag = (id: string): Cond => ({ flag: id });
/** Delil bulunmuş. */
export const has = (evidence: string): Cond => ({ hasEvidence: evidence });
/** Node ziyaret edilmiş. */
export const visited = (node: string): Cond => ({ visited: node });
/** Seçenek (isteğe bağlı olarak belirli varyantıyla) seçilmiş. */
export const chosen = (choice: string, variant?: string): Cond =>
  variant === undefined ? { chosen: choice } : { chosen: choice, variant };
/** Karakterle tanışılmış. */
export const met = (character: string): Cond => ({ met: character });
/** Sahne nesnesi bulunmuş. */
export const found = (object: string): Cond => ({ found: object });
/** Adlandırılmış yüklem (`predicates`). */
export const ref = (predicate: string): Cond => ({ ref: predicate });
export const not = (cond: Cond): Cond => ({ not: cond });
export const all = (...conds: Cond[]): Cond => ({ all: conds });
export const any = (...conds: Cond[]): Cond => ({ any: conds });
/** Her zaman doğru koşul (`{all: []}`): varsayılan sonuç ve hep açık vurgu için. */
export const always: Cond = { all: [] };

type Op = '==' | '!=' | '<' | '<=' | '>' | '>=';
/** Karşılaştırma: `cmp(v('trust'), '>=', 40)`. */
export const cmp = (left: Val, op: Op, right: Val): Cond => ({ cmp: [left, op, right] });
/** Değişken değeri. */
export const v = (id: string): Val => ({ var: id });
/** Bulunmuş delil sayısı (isteğe bağlı etiket süzgeciyle). */
export const evidenceCount = (tag?: string): Val =>
  tag === undefined ? { count: 'evidence' } : { count: 'evidence', tag };
/** Final skor (yalnızca sonuç koşulu, gerekçe, XP ve rapor ipucunda). */
export const finalScore: Val = { score: 'final' };
/** Koşul doğruysa 1, değilse 0 (bulgu sayacı yüklemleri için). */
export const oneIf = (cond: Cond): Val => ({ if: { when: cond, then: 1, else: 0 } });
/** Doğru olan koşulların sayısı en az `n` mi: `atLeast(2, flag('a'), flag('b'), ref('c'))`. */
export const atLeast = (n: number, ...conds: Cond[]): Cond => cmp({ add: conds.map(oneIf) }, '>=', n);

// --- Etkiler ---

export const set = (id: string, value: Val): Effect => ({ type: 'VAR', var: id, op: 'set', value });
export const inc = (id: string, value: Val = 1): Effect => ({ type: 'VAR', var: id, op: 'inc', value });
export const dec = (id: string, value: Val = 1): Effect => ({ type: 'VAR', var: id, op: 'dec', value });
/** Bool bayrağı true yapar. */
export const raise = (id: string): Effect => set(id, true);
export const score = (category: Category, amount: Val, line?: string): Effect =>
  line === undefined ? { type: 'SCORE', category, amount } : { type: 'SCORE', category, amount, line };
export const discover = (evidence: string): Effect => ({ type: 'DISCOVER', evidence });
export const meet = (character: string): Effect => ({ type: 'MEET', character });
export const mark = (quality: MarkQuality, feedback: string, category?: Category): Effect =>
  category === undefined ? { type: 'MARK', quality, feedback } : { type: 'MARK', quality, feedback, category };
export const ifThen = (cond: Cond, then: Effect[], otherwise?: Effect[]): Effect =>
  otherwise === undefined ? { type: 'IF', when: cond, then } : { type: 'IF', when: cond, then, else: otherwise };
export const goto = (node: string): Effect => ({ type: 'GOTO', node });
export const end = (outcome?: string): Effect => (outcome === undefined ? { type: 'END' } : { type: 'END', outcome });

/** Kısa skor tablosu: `{ HUKUKI_BILGI: 150, USUL_BILGISI: -50 }` → SCORE etkileri (yazım sırasıyla). */
export type ScoreMap = Partial<Record<Category, Val>>;
export const scores = (map: ScoreMap | undefined): Effect[] =>
  Object.entries(map ?? {}).map(([category, amount]) => score(category as Category, amount as Val));

/**
 * Strateji çarpanı (Dava #07 kalıbı): seçili strateji `strategy` ise tutar `strategyPctVar` yüzdesiyle çarpılır, değilse
 * taban tutar kalır. Sonuç bir Val'dir; `score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET'))`.
 */
export const strategyAmount = (
  base: number,
  strategy: string,
  opts: { strategyVar?: string; pctVar?: string } = {},
): Val => ({
  if: {
    when: cmp(v(opts.strategyVar ?? 'strategy'), '==', strategy),
    then: { div: [{ mul: [base, v(opts.pctVar ?? 'strategy_pct')] }, 100] },
    else: base,
  },
});
