import type { CasePackage, ChoiceDef, Cond, Effect, Val } from '@mudafaa/case-schema';

// İçerikteki etki, koşul ve değer ifadelerinin bulunduğu yerleri (yollarıyla) sıralar. Statik kontroller bu listeler
// üzerinde çalışır; yol biçimi `nodes[3].choices[1].effects[0]`.

/** Etkiyi uygulayan kaynağın türü: motor `DISCOVER`'ın bulunma yolunu bu kaynakla eşleştirir. */
export type SourceType = 'NODE' | 'CHOICE' | 'RULE' | 'OBJECT' | 'TRIGGER';

export interface EffectSite {
  path: string;
  source: { type: SourceType; id: string };
  node?: string;
  effects: readonly Effect[];
}

const RULE_LIKE: ReadonlySet<string> = new Set(['EXAMINE', 'COMBINE', 'PRESS', 'PRESENT', 'OBJECT', 'FALLBACK']);

/** Seçeneğin bulunma yolu türü: oyuncu seçenekleri CHOICE, kurallar ve FALLBACK RULE. */
export const sourceTypeOf = (ch: ChoiceDef): SourceType => (RULE_LIKE.has(ch.kind) ? 'RULE' : 'CHOICE');

export function effectSites(pkg: CasePackage): EffectSite[] {
  const out: EffectSite[] = [];
  pkg.nodes.forEach((n, i) => {
    const base = `nodes[${i}]`;
    const nodeSource = { type: 'NODE' as const, id: n.id };
    if (n.onFirstEnter)
      out.push({ path: `${base}.onFirstEnter`, source: nodeSource, node: n.id, effects: n.onFirstEnter });
    if (n.onEnter) out.push({ path: `${base}.onEnter`, source: nodeSource, node: n.id, effects: n.onEnter });
    n.choices.forEach((ch, j) => {
      const cp = `${base}.choices[${j}]`;
      const source = { type: sourceTypeOf(ch), id: ch.id };
      if (ch.effects) out.push({ path: `${cp}.effects`, source, node: n.id, effects: ch.effects });
      ch.variants?.forEach((v, k) => {
        if (v.effects) out.push({ path: `${cp}.variants[${k}].effects`, source, node: n.id, effects: v.effects });
      });
    });
  });
  pkg.scenes.forEach((sc, i) =>
    sc.objects.forEach((o, j) => {
      if (o.effects) {
        out.push({
          path: `scenes[${i}].objects[${j}].effects`,
          source: { type: 'OBJECT', id: o.id },
          effects: o.effects,
        });
      }
    }),
  );
  pkg.triggers.forEach((t, i) => {
    if (t.effects)
      out.push({ path: `triggers[${i}].effects`, source: { type: 'TRIGGER', id: t.id }, effects: t.effects });
  });
  return out;
}

/** Etkileri IF dalları dahil yollarıyla gezer. */
export function eachEffect(effects: readonly Effect[], path: string, fn: (e: Effect, path: string) => void): void {
  effects.forEach((e, i) => {
    const p = `${path}[${i}]`;
    fn(e, p);
    if (e.type === 'IF') {
      eachEffect(e.then, `${p}.then`, fn);
      if (e.else) eachEffect(e.else, `${p}.else`, fn);
    }
  });
}

/** Paketteki bütün etkiler (IF dalları dahil), bulundukları kaynakla. */
export function allEffects(pkg: CasePackage): { effect: Effect; path: string; site: EffectSite }[] {
  const out: { effect: Effect; path: string; site: EffectSite }[] = [];
  for (const site of effectSites(pkg))
    eachEffect(site.effects, site.path, (effect, path) => out.push({ effect, path, site }));
  return out;
}

export interface CondSite {
  path: string;
  cond: Cond;
}

/** Paketteki bütün koşullar (etkilerdeki IF koşulları dahil). */
export function condSites(pkg: CasePackage): CondSite[] {
  const out: CondSite[] = [];
  const add = (cond: Cond | undefined, path: string): void => {
    if (cond !== undefined) out.push({ cond, path });
  };
  pkg.predicates.forEach((p, i) => add(p.when, `predicates[${i}].when`));
  pkg.nodes.forEach((n, i) => {
    const b = `nodes[${i}]`;
    n.lines?.forEach((l, k) => add(l.when, `${b}.lines[${k}].when`));
    n.choices.forEach((ch, j) => {
      const cp = `${b}.choices[${j}]`;
      add(ch.visibleWhen, `${cp}.visibleWhen`);
      add(ch.enabledWhen, `${cp}.enabledWhen`);
      ch.responses?.forEach((r, k) => add(r.when, `${cp}.responses[${k}].when`));
      ch.variants?.forEach((v, vi) =>
        v.responses?.forEach((r, k) => add(r.when, `${cp}.variants[${vi}].responses[${k}].when`)),
      );
      if (ch.next !== undefined && typeof ch.next === 'object' && 'routes' in ch.next) {
        ch.next.routes.forEach((r, k) => add(r.when, `${cp}.next.routes[${k}].when`));
      }
    });
    if (n.type === 'DECISION') n.routes.forEach((r, k) => add(r.when, `${b}.routes[${k}].when`));
    if (n.type === 'DIALOGUE') {
      n.moodRules?.forEach((m, k) => add(m.when, `${b}.moodRules[${k}].when`));
      n.objectives?.forEach((o, k) => add(o.when, `${b}.objectives[${k}].when`));
    }
    if (n.type === 'COURTROOM') {
      n.statements?.forEach((st, k) => {
        add(st.visibleWhen, `${b}.statements[${k}].visibleWhen`);
        st.segments.forEach((sg, m) => add(sg.highlightWhen, `${b}.statements[${k}].segments[${m}].highlightWhen`));
      });
    }
  });
  pkg.scenes.forEach((sc, i) => {
    add(sc.unlockWhen, `scenes[${i}].unlockWhen`);
    sc.objects.forEach((o, j) => add(o.activeWhen, `scenes[${i}].objects[${j}].activeWhen`));
  });
  pkg.discoveryPaths.forEach((d, i) => add(d.requires, `discoveryPaths[${i}].requires`));
  pkg.relationships.forEach((r, i) => add(r.revealWhen, `relationships[${i}].revealWhen`));
  pkg.triggers.forEach((t, i) => add(t.when, `triggers[${i}].when`));
  pkg.outcomes.forEach((o, i) => {
    add(o.when, `outcomes[${i}].when`);
    o.reasoning.forEach((r, k) => add(r.when, `outcomes[${i}].reasoning[${k}].when`));
  });
  pkg.report.hints.forEach((h, i) => add(h.when, `report.hints[${i}].when`));
  for (const { effect, path } of allEffects(pkg)) if (effect.type === 'IF') add(effect.when, `${path}.when`);
  return out;
}

/** Tamsayı olması gereken değer ifadeleri: SCORE tutarı, bonuslar, genel çarpan, sonuç XP'si. */
export function intValSites(pkg: CasePackage): { path: string; val: Val }[] {
  const out: { path: string; val: Val }[] = [];
  for (const { effect, path } of allEffects(pkg))
    if (effect.type === 'SCORE') out.push({ path: `${path}.amount`, val: effect.amount });
  pkg.config.scoring.bonuses.forEach((b, i) => out.push({ path: `config.scoring.bonuses[${i}].value`, val: b.value }));
  if (pkg.config.scoring.multiplierPct !== undefined) {
    out.push({ path: 'config.scoring.multiplierPct', val: pkg.config.scoring.multiplierPct });
  }
  pkg.outcomes.forEach((o, i) => out.push({ path: `outcomes[${i}].xp`, val: o.xp }));
  return out;
}

/** Koşul ağacındaki `cmp` ve `flag` düğümlerini (değerlerin `if` koşulları dahil) gezer. */
export function eachCondLeaf(
  cond: Cond,
  fn: (leaf: Extract<Cond, { cmp: unknown } | { flag: unknown }>) => void,
): void {
  if ('all' in cond) for (const c of cond.all) eachCondLeaf(c, fn);
  else if ('any' in cond) for (const c of cond.any) eachCondLeaf(c, fn);
  else if ('not' in cond) eachCondLeaf(cond.not, fn);
  else if ('cmp' in cond) {
    fn(cond);
    eachValCond(cond.cmp[0], (c) => eachCondLeaf(c, fn));
    eachValCond(cond.cmp[2], (c) => eachCondLeaf(c, fn));
  } else if ('flag' in cond) fn(cond);
}

/** Değer ifadesinin içindeki koşullar (`{if:{when}}`). */
export function eachValCond(v: Val, fn: (c: Cond) => void): void {
  if (typeof v !== 'object' || v === null) return;
  if ('if' in v) {
    fn(v.if.when);
    eachValCond(v.if.then, fn);
    eachValCond(v.if.else, fn);
    return;
  }
  for (const key of ['add', 'mul', 'min', 'max', 'sub', 'div'] as const) {
    if (key in v) for (const part of (v as Record<string, Val[]>)[key] ?? []) eachValCond(part, fn);
  }
  if ('round' in v) eachValCond(v.round, fn);
}
