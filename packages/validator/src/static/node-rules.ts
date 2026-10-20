import type { ActionKind, CasePackage, ChoiceDef, NodeDef } from '@mudafaa/case-schema';
import { canonicalJson } from '@mudafaa/engine';
import type { CompiledCase } from '@mudafaa/engine';
import { error, warning } from '../issues.js';
import type { Issue } from '../issues.js';
import { eachEffect } from '../walk.js';

const leavesNode = (effects: readonly ChoiceDef['effects'][]): boolean => {
  let found = false;
  for (const list of effects) {
    eachEffect(list ?? [], '', (e) => {
      if (e.type === 'GOTO' || e.type === 'END') found = true;
    });
  }
  return found;
};

/**
 * Node'dan bir çıkış var mı: `$stay` olmayan bir `next`, DECISION rotası, GOTO/END etkisi (sahne nesnelerininkiler dahil)
 * ya da node'a bağlı tetikleyici. Genel tetikleyiciler (ör. çöküş kesintisi) koşullu olduğu için çıkış sayılmaz.
 */
function hasExit(pkg: CasePackage, n: NodeDef): boolean {
  if (n.type === 'DECISION') return true;
  if (n.choices.some((ch) => ch.next !== undefined && ch.next !== '$stay')) return true;
  const effects = [
    n.onEnter,
    n.onFirstEnter,
    ...n.choices.flatMap((ch) => [ch.effects, ...(ch.variants ?? []).map((v) => v.effects)]),
  ];
  if (n.type === 'SCENE')
    effects.push(...(pkg.scenes.find((sc) => sc.id === n.scene)?.objects ?? []).map((o) => o.effects));
  if (leavesNode(effects)) return true;
  return pkg.triggers.some((t) => t.scope === n.id && (t.goto !== undefined || leavesNode([t.effects])));
}

const FALLBACK_NEEDS: { kind: ActionKind; what: string; applies: (n: NodeDef) => boolean }[] = [
  { kind: 'TAP', what: 'sahne araması', applies: (n) => n.type === 'SCENE' },
  { kind: 'EXAMINE', what: 'belge incelemesi', applies: (n) => n.type === 'DOCUMENT' },
  { kind: 'COMBINE', what: 'çıkarım tahtası', applies: (n) => n.type === 'DEDUCTION' },
  { kind: 'PRESENT', what: 'tanık ifadesi', applies: (n) => n.type === 'COURTROOM' && n.mode === 'TESTIMONY' },
  {
    kind: 'OBJECT',
    what: 'itiraz gerekçeleri',
    applies: (n) => n.type === 'COURTROOM' && n.mode === 'TESTIMONY' && (n.objectionGrounds ?? []).length > 0,
  },
  {
    kind: 'PRESENT',
    what: 'görüşmede delil gösterme',
    applies: (n) => n.type === 'DIALOGUE' && n.allowPresent === true,
  },
];

/** Aynı node'da etkisi, kalite işareti, maliyeti ve `next`'i aynı olan OPTION/TOPIC seçenekleri (uyarı). */
function indistinguishable(n: NodeDef, path: string, out: Issue[]): void {
  const seen = new Map<string, string>();
  n.choices.forEach((ch, j) => {
    if (ch.kind !== 'OPTION' && ch.kind !== 'TOPIC') return;
    const sig = canonicalJson({
      effects: ch.effects ?? [],
      quality: ch.quality ?? null,
      cost: ch.cost ?? [],
      next: ch.next ?? '$stay',
      variants: (ch.variants ?? []).map((v) => ({ effects: v.effects ?? [], quality: v.quality ?? null })),
    });
    const twin = seen.get(sig);
    if (twin !== undefined) {
      out.push(
        warning('INDISTINGUISHABLE_CHOICES', `${path}.choices[${j}]`, `${ch.id} ile ${twin} aynı sonucu doğuruyor`),
      );
    } else seen.set(sig, ch.id);
  });
}

/**
 * Koşulsuz otomatik geçiş döngüleri: koşulsuz DECISION rotaları ve giriş etkilerindeki (IF dışındaki) GOTO'lar bir
 * döngü kurarsa her girişte aksiyon LOOP_LIMIT ile düşer.
 */
function automaticCycles(pkg: CasePackage, out: Issue[]): void {
  const next = new Map<string, string[]>();
  for (const n of pkg.nodes) {
    const targets: string[] = [];
    if (n.type === 'DECISION') for (const r of n.routes) if (r.when === undefined) targets.push(r.to);
    for (const e of [...(n.onFirstEnter ?? []), ...(n.onEnter ?? [])]) if (e.type === 'GOTO') targets.push(e.node);
    next.set(n.id, targets);
  }
  const state = new Map<string, 'open' | 'done'>();
  const reported = new Set<string>();
  const visit = (id: string, trail: string[]): void => {
    state.set(id, 'open');
    for (const t of next.get(id) ?? []) {
      if (state.get(t) === 'open') {
        const cycle = [...trail.slice(trail.indexOf(t)), t];
        const head = [...cycle].sort()[0] ?? t;
        if (!reported.has(head)) {
          reported.add(head);
          const i = pkg.nodes.findIndex((n) => n.id === t);
          out.push(error('DECISION_CYCLE', `nodes[${i}]`, `Koşulsuz otomatik geçiş döngüsü: ${cycle.join(' → ')}`));
        }
      } else if (state.get(t) === undefined) visit(t, [...trail, t]);
    }
    state.set(id, 'done');
  };
  for (const n of pkg.nodes) if (state.get(n.id) === undefined) visit(n.id, [n.id]);
}

/** Node türü kuralları: fallback'ler, varsayılan rotalar, RESULT, çıkış, HUD ve ayırt edilemeyen seçenekler. */
export function nodeRuleChecks(pkg: CasePackage, c: CompiledCase): Issue[] {
  const out: Issue[] = [];
  pkg.nodes.forEach((n, i) => {
    const p = `nodes[${i}]`;
    const fallbacks = c.nodes.get(n.id)?.fallbacks ?? {};
    for (const need of FALLBACK_NEEDS) {
      if (need.applies(n) && fallbacks[need.kind] === undefined) {
        out.push(error('MISSING_FALLBACK', p, `${n.id}: ${need.what} için ${need.kind} fallback'i yok`));
      }
    }
    if (n.type === 'DECISION' && !n.routes.some((r) => r.when === undefined)) {
      out.push(error('DECISION_NO_DEFAULT', `${p}.routes`, `${n.id}: koşulsuz varsayılan rota yok`));
    }
    n.choices.forEach((ch, j) => {
      if (typeof ch.next === 'object' && 'routes' in ch.next && !ch.next.routes.some((r) => r.when === undefined)) {
        out.push(
          error('DECISION_NO_DEFAULT', `${p}.choices[${j}].next.routes`, `${ch.id}: koşulsuz varsayılan rota yok`),
        );
      }
    });
    if (n.type === 'RESULT' && n.choices.length > 0) {
      out.push(error('RESULT_HAS_CHOICES', `${p}.choices`, `${n.id}: RESULT node'unda seçenek olamaz`));
    }
    if (n.type !== 'RESULT' && !hasExit(pkg, n)) {
      out.push(error('NO_EXIT', p, `${n.id}: node'dan çıkış yok (seçenek, rota ya da GOTO)`));
    }
    const costVar = (v: string, path: string): void => {
      const def = c.vars.get(v);
      if (def !== undefined && (def.visibility !== 'VISIBLE' || def.display === undefined)) {
        out.push(error('COST_HIDDEN_VAR', path, `Maliyet görünür ve display tanımlı bir değişken olmalı: ${v}`));
      }
    };
    n.choices.forEach((ch, j) => ch.cost?.forEach((k, m) => costVar(k.var, `${p}.choices[${j}].cost[${m}]`)));
    if (n.type === 'SCENE') n.actionCosts?.TAP?.forEach((k, m) => costVar(k.var, `${p}.actionCosts.TAP[${m}]`));
    if (n.type === 'DOCUMENT')
      n.actionCosts?.EXAMINE?.forEach((k, m) => costVar(k.var, `${p}.actionCosts.EXAMINE[${m}]`));
    (n.hud ?? []).forEach((id, k) => {
      const v = c.vars.get(id);
      if (v === undefined) return;
      if (v.visibility !== 'VISIBLE') {
        out.push(error('HUD_HIDDEN_VAR', `${p}.hud[${k}]`, `${n.id}: HUD gizli değişken gösteriyor: ${id}`));
      } else if (v.display === undefined) {
        out.push(error('HUD_HIDDEN_VAR', `${p}.hud[${k}]`, `${n.id}: ${id} değişkeninin display tanımı yok`));
      }
    });
    indistinguishable(n, p, out);
  });
  automaticCycles(pkg, out);
  return out;
}
