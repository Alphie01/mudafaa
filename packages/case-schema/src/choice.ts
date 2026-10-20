import { z } from 'zod';
import { Effect, MarkQuality } from './effect.js';
import { Cond } from './expr.js';
import { Category, Expression, Id, Tone } from './primitives.js';

// Boş metni (etiket, satır, geri bildirim) şema değil doğrulayıcı raporlar (MISSING_TEXT); bu yüzden metin
// alanlarında `.min(1)` yok. Varsayılanlar (`maxUses`, `repeat`) şemaya basılmaz: ayrıştırılan nesne girdiye
// eşit kalır, varsayılanları motor uygular.

/**
 * Bir konuşma satırı. `speaker` bir karakterin kimliği ya da ayrılmış `player` / `narrator` değeridir; ikisi de
 * kimlik kalıbına uyar, bu yüzden hiçbir karakter bu kimlikleri taşımamalıdır.
 */
export const Line = z.strictObject({
  speaker: z.union([Id, z.literal('player'), z.literal('narrator')]),
  expression: Expression.optional(),
  text: z.string(),
});
export type Line = z.infer<typeof Line>;

/** Koşula bağlı yanıt: `when` koşulunu tutan ilk blok gösterilir (`when` yoksa her zaman tutar). */
export const ResponseBlock = z.strictObject({
  when: Cond.optional(),
  lines: z.array(Line).min(1, 'lines en az bir satır içermeli'),
});
export type ResponseBlock = z.infer<typeof ResponseBlock>;

/** Aksiyon sonucunda gösterilen geri bildirim. */
export const Feedback = z.strictObject({
  title: z.string().optional(),
  text: z.string().optional(),
  label: z.string().optional(),
  tone: Tone,
});
export type Feedback = z.infer<typeof Feedback>;

/** Seçeneğin ya da aksiyonun düştüğü kaynak: `var` değişkeninden `amount` kadar. */
export const Cost = z.strictObject({ var: Id, amount: z.int().positive() });
export type Cost = z.infer<typeof Cost>;

/** Koşullu yönlendirme: ilk tutan rota izlenir. `Next.routes` ve `DECISION` node'u aynı biçimi kullanır. */
export const Route = z.strictObject({ when: Cond.optional(), to: Id });
export type Route = z.infer<typeof Route>;

/**
 * Seçimden sonra nereye gidileceği: bir node kimliği, `$stay` (aynı node), `$return` (yığından dön),
 * `{push}` (mevcut node'u yığına atıp git) ya da `{routes}`.
 */
export const Next = z.union([
  Id,
  z.literal('$stay'),
  z.literal('$return'),
  z.strictObject({ push: Id }),
  z.strictObject({ routes: z.array(Route).min(1, 'routes en az bir rota içermeli') }),
]);
export type Next = z.infer<typeof Next>;

/** Seçeneğin kalite işareti; motor bunu bir `MARK` etkisine çevirir. */
export const Quality = z.strictObject({ q: MarkQuality, feedback: z.string(), category: Category.optional() });
export type Quality = z.infer<typeof Quality>;

/** TOPIC seçeneğinin varyantı (ör. yumuşak / sert ton): kendi metni, etkisi ve yanıtı vardır. */
export const Variant = z.strictObject({
  id: Id,
  label: z.string(),
  prompt: z.string().optional(),
  effects: z.array(Effect).optional(),
  responses: z.array(ResponseBlock).optional(),
  quality: Quality.optional(),
});
export type Variant = z.infer<typeof Variant>;

/** Oyuncunun gönderebildiği aksiyon türleri. */
export const ActionKind = z.enum(['CHOOSE', 'TAP', 'EXAMINE', 'COMBINE', 'PRESS', 'PRESENT', 'OBJECT']);
export type ActionKind = z.infer<typeof ActionKind>;

/**
 * Parametre eşleşmeli kuralların eşleşme verisi; biçim kural türünü belirler:
 * EXAMINE `{tool, target}`, COMBINE `{a, b}`, PRESS `{statement}`, PRESENT `{statement?, evidence}`,
 * OBJECT `{statement?, ground}`. PRESENT ve OBJECT'te `statement` yoksa kural her ifade için geçerlidir.
 */
export const Match = z.union([
  z.strictObject({ tool: Id, target: Id }),
  z.strictObject({ a: Id, b: Id }),
  z.strictObject({ statement: Id }),
  z.strictObject({ statement: Id.optional(), evidence: z.array(Id).min(1, 'evidence en az bir delil içermeli') }),
  z.strictObject({ statement: Id.optional(), ground: Id }),
]);
export type Match = z.infer<typeof Match>;

/** Seçenek türü. İlk dördü oyuncunun gördüğü seçenektir; sonraki beşi kural, FALLBACK ise kuralsız girdiyi yakalar. */
export const ChoiceKind = z.enum([
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
]);
export type ChoiceKind = z.infer<typeof ChoiceKind>;

/** Seçeneğin üstündeki etiket. */
export const ChoiceTag = z.strictObject({
  label: z.string(),
  tone: z.enum(['witness', 'info', 'negative', 'neutral']),
});
export type ChoiceTag = z.infer<typeof ChoiceTag>;

/** `match`'in biçiminden hangi kural türüne ait olduğunu çıkarır. */
const matchFormOf = (match: Match): 'EXAMINE' | 'COMBINE' | 'PRESS' | 'PRESENT' | 'OBJECT' => {
  if ('tool' in match) return 'EXAMINE';
  if ('a' in match) return 'COMBINE';
  if ('evidence' in match) return 'PRESENT';
  if ('ground' in match) return 'OBJECT';
  return 'PRESS';
};

/** Kural türünün `match` biçimi; kural olmayan türler için `undefined`. */
const matchShapeOf = (kind: ChoiceKind): string | undefined => {
  switch (kind) {
    case 'EXAMINE':
      return '{tool, target}';
    case 'COMBINE':
      return '{a, b}';
    case 'PRESS':
      return '{statement}';
    case 'PRESENT':
      return '{statement?, evidence}';
    case 'OBJECT':
      return '{statement?, ground}';
    default:
      return undefined;
  }
};

/**
 * Hikâye seçeneği ya da kuralı. `kind` hangi alanların zorunlu olduğunu belirler:
 * - OPTION / TOPIC / NAVIGATE / CONTINUE: `label` zorunlu; `match` ve `fallbackFor` taşıyamaz.
 * - EXAMINE / COMBINE / PRESS / PRESENT / OBJECT: biçimi türüne uyan `match` zorunlu (bkz. `Match`).
 * - FALLBACK: `fallbackFor` zorunlu; `match` taşıyamaz (hiçbir kurala uymayan girdiyi yakalar).
 * - `fallbackFor` yalnızca FALLBACK'te kullanılır.
 * Mesajlar alan adlarını (`label`, `match`, `fallbackFor`) olduğu gibi içerir ve ihlal eden alanın yoluyla raporlanır.
 */
export const ChoiceDef = z
  .strictObject({
    id: Id,
    kind: ChoiceKind,
    label: z.string().optional(),
    description: z.string().optional(),
    prompt: z.string().optional(),
    group: Id.optional(),
    tags: z.array(ChoiceTag).optional(),
    visibleWhen: Cond.optional(),
    enabledWhen: Cond.optional(),
    lockedReason: z.string().optional(),
    cost: z.array(Cost).optional(),
    maxUses: z.int().positive().optional(),
    repeat: z.enum(['NOOP', 'REJECT', 'APPLY', 'ONCE_PER_PARAMS']).optional(),
    quality: Quality.optional(),
    effects: z.array(Effect).optional(),
    responses: z.array(ResponseBlock).optional(),
    feedback: Feedback.optional(),
    next: Next.optional(),
    variants: z.array(Variant).optional(),
    match: Match.optional(),
    fallbackFor: ActionKind.optional(),
    confirm: z.string().optional(),
    role: z.enum(['PRIMARY', 'BACK']).optional(),
  })
  .superRefine((choice, ctx) => {
    const fail = (key: string, message: string) => ctx.addIssue({ code: 'custom', path: [key], message });
    const { kind, label, match, fallbackFor } = choice;

    if ((kind === 'OPTION' || kind === 'TOPIC' || kind === 'NAVIGATE' || kind === 'CONTINUE') && label === undefined) {
      fail('label', `${kind} seçeneği label taşımalı`);
    }

    const shape = matchShapeOf(kind);
    if (shape !== undefined) {
      if (match === undefined) {
        fail('match', `${kind} seçeneği match taşımalı: ${shape}`);
      } else if (matchFormOf(match) !== kind) {
        fail('match', `${kind} seçeneğinin match değeri ${shape} biçiminde olmalı`);
      }
    } else if (match !== undefined) {
      fail(
        'match',
        `match yalnızca EXAMINE, COMBINE, PRESS, PRESENT ve OBJECT seçeneklerinde kullanılır (kind: ${kind})`,
      );
    }

    if (kind === 'FALLBACK') {
      if (fallbackFor === undefined) fail('fallbackFor', 'FALLBACK seçeneği fallbackFor taşımalı');
    } else if (fallbackFor !== undefined) {
      fail('fallbackFor', `fallbackFor yalnızca FALLBACK seçeneklerinde kullanılır (kind: ${kind})`);
    }
  });
export type ChoiceDef = z.infer<typeof ChoiceDef>;
