import type { Cond, Effect, Val } from '@mudafaa/case-schema';
import { malformed } from '../errors.js';

/**
 * Bir ifadenin ya da etkinin başvurduğu kimlikler, ad alanına göre. Doğrulayıcı ve editör bunlarla kırık referansları
 * ve kullanım dağılımını çıkarır. `Set` ekleme sırasını korur; çıktıyı etkileyen yinelemelerde anahtarlar sıralanmalıdır.
 */
export interface RefSet {
  /** `{var}`, `{flag}`, VAR etkisinin `var`'ı. */
  vars: Set<string>;
  /** `{hasEvidence}`, DISCOVER. */
  evidence: Set<string>;
  /** `{met}`, MEET. */
  characters: Set<string>;
  /** `{visited}`, `{atNode}`, `{visits}`, GOTO. */
  nodes: Set<string>;
  /** `{chosen}` (varyant kimliği dahil değil), `{uses}`. */
  choices: Set<string>;
  /** `{found}`. */
  objects: Set<string>;
  /** `{ref}`. */
  predicates: Set<string>;
  /** SCORE ve MARK `category`'si, `{score:'cat:X'}`. */
  categories: Set<string>;
}

export const newRefSet = (): RefSet => ({
  vars: new Set(),
  evidence: new Set(),
  characters: new Set(),
  nodes: new Set(),
  choices: new Set(),
  objects: new Set(),
  predicates: new Set(),
  categories: new Set(),
});

const isEffectList = (x: unknown): x is readonly Effect[] => Array.isArray(x);

/** Etkiler `type` taşır; koşul ve değer ifadelerinin hiçbir üyesi `type` anahtarı taşımaz. */
const isEffect = (x: Cond | Val | Effect): x is Effect => typeof x === 'object' && x !== null && 'type' in x;

/** Koşul ya da değer ifadesini gezer; ikisinin anahtarları çakışmadığı için tek işlev ikisini de taşır. */
function visitExpr(x: Cond | Val, out: RefSet): void {
  if (typeof x !== 'object') return; // number | string | boolean sabiti
  if (x === null) return malformed('ifade', x);

  // Koşullar
  if ('all' in x) {
    for (const part of x.all) visitExpr(part, out);
    return;
  }
  if ('any' in x) {
    for (const part of x.any) visitExpr(part, out);
    return;
  }
  if ('not' in x) {
    visitExpr(x.not, out);
    return;
  }
  if ('cmp' in x) {
    visitExpr(x.cmp[0], out);
    visitExpr(x.cmp[2], out);
    return;
  }
  if ('hasEvidence' in x) {
    out.evidence.add(x.hasEvidence);
    return;
  }
  if ('met' in x) {
    out.characters.add(x.met);
    return;
  }
  if ('visited' in x) {
    out.nodes.add(x.visited);
    return;
  }
  if ('atNode' in x) {
    out.nodes.add(x.atNode);
    return;
  }
  if ('chosen' in x) {
    out.choices.add(x.chosen);
    return;
  }
  if ('found' in x) {
    out.objects.add(x.found);
    return;
  }
  if ('flag' in x) {
    out.vars.add(x.flag);
    return;
  }
  if ('ref' in x) {
    out.predicates.add(x.ref);
    return;
  }

  // Değerler
  if ('var' in x) {
    out.vars.add(x.var);
    return;
  }
  if ('score' in x) {
    if (x.score.startsWith('cat:')) out.categories.add(x.score.slice('cat:'.length));
    return;
  }
  if ('count' in x) return; // `kind` ve `tag` bir kimlik alanı değil süzgeçtir
  if ('uses' in x) {
    out.choices.add(x.uses);
    return;
  }
  if ('visits' in x) {
    out.nodes.add(x.visits);
    return;
  }
  if ('add' in x) {
    for (const part of x.add) visitExpr(part, out);
    return;
  }
  if ('sub' in x) {
    for (const part of x.sub) visitExpr(part, out);
    return;
  }
  if ('mul' in x) {
    for (const part of x.mul) visitExpr(part, out);
    return;
  }
  if ('div' in x) {
    for (const part of x.div) visitExpr(part, out);
    return;
  }
  if ('min' in x) {
    for (const part of x.min) visitExpr(part, out);
    return;
  }
  if ('max' in x) {
    for (const part of x.max) visitExpr(part, out);
    return;
  }
  if ('round' in x) {
    visitExpr(x.round, out);
    return;
  }
  if ('if' in x) {
    visitExpr(x.if.when, out);
    visitExpr(x.if.then, out);
    visitExpr(x.if.else, out);
    return;
  }
  return malformed('ifade', x);
}

function visitEffect(e: Effect, out: RefSet): void {
  switch (e.type) {
    case 'VAR':
      out.vars.add(e.var);
      visitExpr(e.value, out);
      return;
    case 'SCORE':
      out.categories.add(e.category);
      visitExpr(e.amount, out); // `line` bir skor satırıdır (scoring.lines); RefSet'te ad alanı yok
      return;
    case 'DISCOVER':
      out.evidence.add(e.evidence);
      return;
    case 'MEET':
      out.characters.add(e.character);
      return;
    case 'MARK':
      if (e.category !== undefined) out.categories.add(e.category);
      return;
    case 'IF':
      visitExpr(e.when, out);
      for (const effect of e.then) visitEffect(effect, out);
      for (const effect of e.else ?? []) visitEffect(effect, out);
      return;
    case 'GOTO':
      out.nodes.add(e.node);
      return;
    case 'END':
      return; // `outcome` bir sonuç kimliğidir; RefSet'te ad alanı yok
    default:
      return malformed('etki', e);
  }
}

/**
 * Koşul, değer, etki ya da etki listesinin her düğümünü gezer (IF dalları, SCORE tutarları, VAR değerleri dahil) ve
 * kimlikleri ad alanına göre toplar. `out` verilirse içine eklenir ve aynı nesne döner; verilmezse yeni bir `RefSet`
 * kurulur. `{ref}` yalnızca adı toplar: yüklemin gövdesine inmez (döngü denetimi `compile`'ındır).
 * Tipin dışındaki bir biçim TYPE fırlatır.
 */
export function collectRefs(x: Cond | Val | Effect | readonly Effect[], out: RefSet = newRefSet()): RefSet {
  if (isEffectList(x)) {
    for (const effect of x) visitEffect(effect, out);
  } else if (isEffect(x)) {
    visitEffect(x, out);
  } else {
    visitExpr(x, out);
  }
  return out;
}
