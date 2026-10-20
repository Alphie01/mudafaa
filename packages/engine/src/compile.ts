import { CasePackage, Category } from '@mudafaa/case-schema';
import type {
  ActionKind,
  ChoiceDef,
  Cond,
  Cost,
  Effect,
  Next,
  NodeDef,
  ResponseBlock,
  TriggerDef,
  Val,
} from '@mudafaa/case-schema';
import { collectRefs } from './expr/refs.js';
import type { RefSet } from './expr/refs.js';
import { canonicalJson, fnv1a64 } from './hash.js';
import type { CNode, CompiledCase } from './types.js';

/** Derleme ya da doğrulama bulgusu. `path`, paketteki yerin noktalı yoludur (ör. `nodes[2].choices[0].id`). */
export interface Issue {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  code: string;
  message: string;
  path: string;
}

export type CompileResult = { ok: true; c: CompiledCase; warnings: Issue[] } | { ok: false; issues: Issue[] };

const RULE_KINDS = ['EXAMINE', 'COMBINE', 'PRESS', 'PRESENT', 'OBJECT'] as const;
type RuleKind = (typeof RULE_KINDS)[number];

/** Zod yol dizisini `a.b[0].c` biçimine çevirir. */
export function formatPath(path: readonly PropertyKey[]): string {
  return path
    .map((seg, i) => (typeof seg === 'number' ? `[${seg}]` : i === 0 ? String(seg) : `.${String(seg)}`))
    .join('');
}

interface ZodIssueLike {
  code: string;
  path: readonly PropertyKey[];
  message: string;
  errors?: readonly (readonly ZodIssueLike[])[];
}

/**
 * Şema hatalarını düzleştirir. Birleşim (`invalid_union`) hatası tek başına "Invalid input" der; yazara yol göstermek için
 * dallardaki en derin hata seçilir ve yolu birleşimin yoluyla birleştirilir.
 */
function schemaIssues(issues: readonly ZodIssueLike[], prefix: readonly PropertyKey[] = []): Issue[] {
  const out: Issue[] = [];
  for (const issue of issues) {
    const path = [...prefix, ...issue.path];
    if (issue.code === 'invalid_union' && issue.errors && issue.errors.length > 0) {
      let best: Issue[] = [];
      let bestDepth = -1;
      for (const branch of issue.errors) {
        const flat = schemaIssues(branch, path);
        const depth = Math.max(-1, ...flat.map((f) => f.path.length));
        if (depth > bestDepth) {
          bestDepth = depth;
          best = flat;
        }
      }
      if (best.length > 0) {
        out.push(...best);
        continue;
      }
    }
    out.push({ severity: 'ERROR', code: 'SCHEMA', message: issue.message, path: formatPath(path) });
  }
  return out;
}

/** Yüklem grafiğinde döngü arar; döngüdeki ilk yüklemin kimliğini döndürür. */
function findPredicateCycles(preds: ReadonlyMap<string, Cond>): string[] {
  const state = new Map<string, 'visiting' | 'done'>();
  const cyclic = new Set<string>();
  const visit = (id: string, trail: string[]): void => {
    const st = state.get(id);
    if (st === 'done') return;
    if (st === 'visiting') {
      const start = trail.indexOf(id);
      for (const member of trail.slice(start)) cyclic.add(member);
      return;
    }
    const cond = preds.get(id);
    if (cond === undefined) return;
    state.set(id, 'visiting');
    for (const ref of [...collectRefs(cond).predicates].sort()) visit(ref, [...trail, id]);
    state.set(id, 'done');
  };
  for (const id of [...preds.keys()].sort()) visit(id, []);
  return [...cyclic].sort();
}

/**
 * Paketi doğrular ve derler: Zod şeması, kimlik tekilliği, sarkan referanslar, yüklem döngüleri. Hata yoksa sorgulama
 * tablolarıyla (`Map`) bir `CompiledCase` döndürür. Oyun kuralı denetimleri (fallback eksikliği, softlock…) doğrulayıcıdadır.
 */
export function compile(input: unknown): CompileResult {
  const parsed = CasePackage.safeParse(input);
  if (!parsed.success) return { ok: false, issues: schemaIssues(parsed.error.issues as readonly ZodIssueLike[]) };
  const pkg = parsed.data;
  const issues: Issue[] = [];
  const error = (code: string, message: string, path: string): void => {
    issues.push({ severity: 'ERROR', code, message, path });
  };

  // --- Kimlik kümeleri ve tekillik ---
  const collect = (label: string, entries: readonly { id: string; path: string }[]): Set<string> => {
    const seen = new Set<string>();
    for (const { id, path } of entries) {
      if (seen.has(id)) error('DUPLICATE_ID', `Yinelenen ${label} kimliği: ${id}`, path);
      seen.add(id);
    }
    return seen;
  };
  const nodeIds = collect(
    'node',
    pkg.nodes.map((n, i) => ({ id: n.id, path: `nodes[${i}].id` })),
  );
  const choiceIds = collect(
    'seçenek',
    pkg.nodes.flatMap((n, i) => n.choices.map((ch, j) => ({ id: ch.id, path: `nodes[${i}].choices[${j}].id` }))),
  );
  const varIds = collect(
    'değişken',
    pkg.variables.map((v, i) => ({ id: v.id, path: `variables[${i}].id` })),
  );
  const evidenceIds = collect(
    'delil',
    pkg.evidence.map((e, i) => ({ id: e.id, path: `evidence[${i}].id` })),
  );
  const characterIds = collect(
    'karakter',
    pkg.characters.map((ch, i) => ({ id: ch.id, path: `characters[${i}].id` })),
  );
  const spriteIds = collect(
    'sprite',
    pkg.sprites.map((s, i) => ({ id: s.id, path: `sprites[${i}].id` })),
  );
  const sceneIds = collect(
    'sahne',
    pkg.scenes.map((s, i) => ({ id: s.id, path: `scenes[${i}].id` })),
  );
  const objectIds = collect(
    'sahne nesnesi',
    pkg.scenes.flatMap((s, i) => s.objects.map((o, j) => ({ id: o.id, path: `scenes[${i}].objects[${j}].id` }))),
  );
  // İfade kimlikleri tüm dava genelinde tekildir (yalnızca tekillik denetlenir).
  collect(
    'ifade',
    pkg.nodes.flatMap((n, i) =>
      n.type === 'COURTROOM'
        ? (n.statements ?? []).map((st, j) => ({ id: st.id, path: `nodes[${i}].statements[${j}].id` }))
        : [],
    ),
  );
  const outcomeIds = collect(
    'sonuç',
    pkg.outcomes.map((o, i) => ({ id: o.id, path: `outcomes[${i}].id` })),
  );
  const triggerIds = collect(
    'tetikleyici',
    pkg.triggers.map((t, i) => ({ id: t.id, path: `triggers[${i}].id` })),
  );
  const predicateIds = collect(
    'yüklem',
    pkg.predicates.map((p, i) => ({ id: p.id, path: `predicates[${i}].id` })),
  );
  const groundIds = collect(
    'itiraz gerekçesi',
    pkg.config.objectionGrounds.map((g, i) => ({ id: g.id, path: `config.objectionGrounds[${i}].id` })),
  );
  const assetIds = collect(
    'varlık',
    pkg.assets.map((a, i) => ({ id: a.id, path: `assets[${i}].id` })),
  );
  const lineIds = new Set(pkg.config.scoring.lines.map((l) => l.id));

  // --- Referans denetimi yardımcıları ---
  const ref = (set: ReadonlySet<string>, label: string, id: string, path: string): void => {
    if (!set.has(id)) error('DANGLING_REF', `Bilinmeyen ${label}: ${id}`, path);
  };
  const checkRefSet = (refs: RefSet, path: string): void => {
    for (const id of refs.vars) ref(varIds, 'değişken', id, path);
    for (const id of refs.evidence) ref(evidenceIds, 'delil', id, path);
    for (const id of refs.characters) ref(characterIds, 'karakter', id, path);
    for (const id of refs.nodes) ref(nodeIds, 'node', id, path);
    for (const id of refs.choices) ref(choiceIds, 'seçenek', id, path);
    for (const id of refs.objects) ref(objectIds, 'sahne nesnesi', id, path);
    for (const id of refs.predicates) ref(predicateIds, 'yüklem', id, path);
  };
  const checkCond = (cond: Cond | undefined, path: string): void => {
    if (cond !== undefined) checkRefSet(collectRefs(cond), path);
  };
  const checkVal = (val: Val | undefined, path: string): void => {
    if (val !== undefined) checkRefSet(collectRefs(val), path);
  };
  const checkEffects = (effects: readonly Effect[] | undefined, path: string): void => {
    if (effects === undefined || effects.length === 0) return;
    checkRefSet(collectRefs(effects), path);
    // SCORE'un açık `line`'ı var olan bir skor satırını göstermeli.
    const walk = (list: readonly Effect[]): void => {
      for (const e of list) {
        if (e.type === 'SCORE' && e.line !== undefined) ref(lineIds, 'skor satırı', e.line, path);
        if (e.type === 'IF') {
          walk(e.then);
          walk(e.else ?? []);
        }
      }
    };
    walk(effects);
  };
  const checkResponses = (blocks: readonly ResponseBlock[] | undefined, path: string): void => {
    (blocks ?? []).forEach((b, i) => {
      checkCond(b.when, `${path}[${i}].when`);
      b.lines.forEach((line, j) => {
        if (line.speaker !== 'player' && line.speaker !== 'narrator') {
          ref(characterIds, 'karakter', line.speaker, `${path}[${i}].lines[${j}].speaker`);
        }
      });
    });
  };
  const checkCosts = (costs: readonly Cost[] | undefined, path: string): void => {
    (costs ?? []).forEach((cost, i) => ref(varIds, 'değişken', cost.var, `${path}[${i}].var`));
  };
  const checkNext = (next: Next | undefined, path: string): void => {
    if (next === undefined || next === '$stay' || next === '$return') return;
    if (typeof next === 'string') ref(nodeIds, 'node', next, path);
    else if ('push' in next) ref(nodeIds, 'node', next.push, `${path}.push`);
    else
      next.routes.forEach((r, i) => {
        checkCond(r.when, `${path}.routes[${i}].when`);
        ref(nodeIds, 'node', r.to, `${path}.routes[${i}].to`);
      });
  };

  const checkChoice = (node: NodeDef, ch: ChoiceDef, path: string): void => {
    checkCond(ch.visibleWhen, `${path}.visibleWhen`);
    checkCond(ch.enabledWhen, `${path}.enabledWhen`);
    checkCosts(ch.cost, `${path}.cost`);
    checkEffects(ch.effects, `${path}.effects`);
    checkResponses(ch.responses, `${path}.responses`);
    checkNext(ch.next, `${path}.next`);
    (ch.variants ?? []).forEach((v, i) => {
      checkEffects(v.effects, `${path}.variants[${i}].effects`);
      checkResponses(v.responses, `${path}.variants[${i}].responses`);
    });
    const m = ch.match;
    if (m === undefined) return;
    const nodeStatements = new Set(node.type === 'COURTROOM' ? (node.statements ?? []).map((s) => s.id) : []);
    if ('tool' in m) {
      const tools = new Set(node.type === 'DOCUMENT' ? node.tools.map((t) => t.id) : []);
      const rows = new Set(node.type === 'DOCUMENT' ? node.rows.map((r) => r.id) : []);
      ref(tools, 'alet', m.tool, `${path}.match.tool`);
      ref(rows, 'satır', m.target, `${path}.match.target`);
    } else if ('a' in m) {
      ref(evidenceIds, 'delil', m.a, `${path}.match.a`);
      ref(evidenceIds, 'delil', m.b, `${path}.match.b`);
    } else if ('evidence' in m) {
      if (m.statement !== undefined) ref(nodeStatements, 'ifade', m.statement, `${path}.match.statement`);
      m.evidence.forEach((e, i) => ref(evidenceIds, 'delil', e, `${path}.match.evidence[${i}]`));
    } else if ('ground' in m) {
      if (m.statement !== undefined) ref(nodeStatements, 'ifade', m.statement, `${path}.match.statement`);
      ref(groundIds, 'itiraz gerekçesi', m.ground, `${path}.match.ground`);
    } else {
      ref(nodeStatements, 'ifade', m.statement, `${path}.match.statement`);
    }
  };

  // --- Node'lar ---
  pkg.nodes.forEach((node, i) => {
    const p = `nodes[${i}]`;
    const local = new Set(node.choices.map((ch) => ch.id));
    (node.hud ?? []).forEach((v, j) => ref(varIds, 'değişken', v, `${p}.hud[${j}]`));
    checkEffects(node.onEnter, `${p}.onEnter`);
    checkEffects(node.onFirstEnter, `${p}.onFirstEnter`);
    checkResponses(node.lines, `${p}.lines`);
    node.choices.forEach((ch, j) => checkChoice(node, ch, `${p}.choices[${j}]`));
    switch (node.type) {
      case 'STORY':
        (node.blocks ?? []).forEach((b, j) => {
          if (b.type === 'profileCard') ref(characterIds, 'karakter', b.character, `${p}.blocks[${j}].character`);
        });
        break;
      case 'EVIDENCE':
        ref(evidenceIds, 'delil', node.evidence, `${p}.evidence`);
        break;
      case 'INVESTIGATION':
        node.tabs.forEach((t, j) =>
          t.choices.forEach((id, k) => ref(local, 'seçenek', id, `${p}.tabs[${j}].choices[${k}]`)),
        );
        if (node.scenePreview) ref(sceneIds, 'sahne', node.scenePreview.scene, `${p}.scenePreview.scene`);
        if (node.quickTalk) {
          ref(characterIds, 'karakter', node.quickTalk.character, `${p}.quickTalk.character`);
          node.quickTalk.choices.forEach((id, k) => ref(local, 'seçenek', id, `${p}.quickTalk.choices[${k}]`));
        }
        break;
      case 'DIALOGUE':
        ref(characterIds, 'karakter', node.room.character, `${p}.room.character`);
        (node.moodRules ?? []).forEach((r, j) => checkCond(r.when, `${p}.moodRules[${j}].when`));
        (node.objectives ?? []).forEach((o, j) => checkCond(o.when, `${p}.objectives[${j}].when`));
        break;
      case 'SCENE':
        ref(sceneIds, 'sahne', node.scene, `${p}.scene`);
        checkCosts(node.actionCosts?.TAP, `${p}.actionCosts.TAP`);
        break;
      case 'DOCUMENT':
        checkCosts(node.actionCosts?.EXAMINE, `${p}.actionCosts.EXAMINE`);
        break;
      case 'DEDUCTION':
        node.pool.forEach((id, j) => ref(evidenceIds, 'delil', id, `${p}.pool[${j}]`));
        break;
      case 'COURTROOM':
        node.stage.bench.forEach((b, j) =>
          ref(characterIds, 'karakter', b.character, `${p}.stage.bench[${j}].character`),
        );
        if (node.stage.witness !== undefined) ref(characterIds, 'karakter', node.stage.witness, `${p}.stage.witness`);
        ref(characterIds, 'karakter', node.stage.counsel, `${p}.stage.counsel`);
        if (node.prosecutionEvidence !== undefined) {
          ref(evidenceIds, 'delil', node.prosecutionEvidence, `${p}.prosecutionEvidence`);
        }
        (node.objectionGrounds ?? []).forEach((g, j) =>
          ref(groundIds, 'itiraz gerekçesi', g, `${p}.objectionGrounds[${j}]`),
        );
        (node.statements ?? []).forEach((st, j) => {
          checkCond(st.visibleWhen, `${p}.statements[${j}].visibleWhen`);
          st.segments.forEach((seg, k) =>
            checkCond(seg.highlightWhen, `${p}.statements[${j}].segments[${k}].highlightWhen`),
          );
        });
        break;
      case 'DECISION':
        node.routes.forEach((r, j) => {
          checkCond(r.when, `${p}.routes[${j}].when`);
          ref(nodeIds, 'node', r.to, `${p}.routes[${j}].to`);
        });
        break;
      default:
        break;
    }
  });

  // --- Diğer bölümler ---
  ref(nodeIds, 'node', pkg.config.startNode, 'config.startNode');
  ref(characterIds, 'karakter', pkg.meta.coverCharacter, 'meta.coverCharacter');
  pkg.characters.forEach((ch, i) => ref(spriteIds, 'sprite', ch.spriteId, `characters[${i}].spriteId`));
  pkg.relationships.forEach((r, i) => {
    ref(characterIds, 'karakter', r.from, `relationships[${i}].from`);
    ref(characterIds, 'karakter', r.to, `relationships[${i}].to`);
    checkCond(r.revealWhen, `relationships[${i}].revealWhen`);
  });
  pkg.evidenceRelations.forEach((r, i) => {
    ref(evidenceIds, 'delil', r.from, `evidenceRelations[${i}].from`);
    ref(evidenceIds, 'delil', r.to, `evidenceRelations[${i}].to`);
  });
  pkg.discoveryPaths.forEach((dp, i) => {
    const p = `discoveryPaths[${i}]`;
    ref(evidenceIds, 'delil', dp.evidence, `${p}.evidence`);
    checkCond(dp.requires, `${p}.requires`);
    const id = dp.source.id;
    if (dp.source.type !== 'INITIAL' && id === undefined) {
      error('DANGLING_REF', `${dp.source.type} bulunma yolu kaynak kimliği taşımalı`, `${p}.source.id`);
    } else if (id !== undefined) {
      const sets: Record<string, [ReadonlySet<string>, string]> = {
        OBJECT: [objectIds, 'sahne nesnesi'],
        CHOICE: [choiceIds, 'seçenek'],
        RULE: [choiceIds, 'seçenek'],
        TRIGGER: [triggerIds, 'tetikleyici'],
        NODE: [nodeIds, 'node'],
      };
      const target = sets[dp.source.type];
      if (target !== undefined) ref(target[0], target[1], id, `${p}.source.id`);
    }
  });
  pkg.scenes.forEach((s, i) => {
    ref(assetIds, 'varlık', s.image, `scenes[${i}].image`);
    checkCond(s.unlockWhen, `scenes[${i}].unlockWhen`);
    s.objects.forEach((o, j) => {
      const p = `scenes[${i}].objects[${j}]`;
      checkCond(o.activeWhen, `${p}.activeWhen`);
      checkEffects(o.effects, `${p}.effects`);
      if (o.inspectNode !== undefined) ref(nodeIds, 'node', o.inspectNode, `${p}.inspectNode`);
    });
  });
  pkg.court.sessions.forEach((cs, i) =>
    cs.stages.forEach((st, j) => ref(nodeIds, 'node', st.entryNode, `court.sessions[${i}].stages[${j}].entryNode`)),
  );
  pkg.triggers.forEach((t, i) => {
    const p = `triggers[${i}]`;
    if (t.scope !== undefined) ref(nodeIds, 'node', t.scope, `${p}.scope`);
    checkCond(t.when, `${p}.when`);
    checkEffects(t.effects, `${p}.effects`);
    if (t.goto !== undefined) ref(nodeIds, 'node', t.goto, `${p}.goto`);
  });
  pkg.outcomes.forEach((o, i) => {
    checkCond(o.when, `outcomes[${i}].when`);
    o.reasoning.forEach((r, j) => checkCond(r.when, `outcomes[${i}].reasoning[${j}].when`));
    checkVal(o.xp, `outcomes[${i}].xp`);
  });
  pkg.predicates.forEach((pr, i) => checkCond(pr.when, `predicates[${i}].when`));
  const scoring = pkg.config.scoring;
  scoring.bonuses.forEach((b, i) => {
    checkVal(b.value, `config.scoring.bonuses[${i}].value`);
    if (b.line !== undefined) ref(lineIds, 'skor satırı', b.line, `config.scoring.bonuses[${i}].line`);
  });
  checkVal(scoring.multiplierPct, 'config.scoring.multiplierPct');
  pkg.report.hints.forEach((h, i) => checkCond(h.when, `report.hints[${i}].when`));
  (pkg.tests?.goldenPaths ?? []).forEach((gp, i) =>
    ref(outcomeIds, 'sonuç', gp.expect.outcome, `tests.goldenPaths[${i}].expect.outcome`),
  );
  const predicates = new Map(pkg.predicates.map((p) => [p.id, p.when] as const));
  for (const id of findPredicateCycles(predicates)) {
    const index = pkg.predicates.findIndex((p) => p.id === id);
    error('PREDICATE_CYCLE', `Yüklem kendine dolaylı olarak başvuruyor: ${id}`, `predicates[${index}]`);
  }

  if (issues.length > 0) return { ok: false, issues };

  // --- Tablolar ---
  const byPriority = (a: { priority: number; id: string }, b: { priority: number; id: string }): number =>
    a.priority - b.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const triggers: TriggerDef[] = [...pkg.triggers].sort(byPriority);
  const nodes = new Map<string, CNode>();
  const choiceIndex = new Map<string, { node: string; choice: ChoiceDef }>();
  for (const def of pkg.nodes) {
    const rules = Object.fromEntries(RULE_KINDS.map((k) => [k, [] as ChoiceDef[]])) as Record<RuleKind, ChoiceDef[]>;
    const fallbacks: Partial<Record<ActionKind, ChoiceDef>> = {};
    const choices = new Map<string, ChoiceDef>();
    for (const ch of def.choices) {
      choices.set(ch.id, ch);
      choiceIndex.set(ch.id, { node: def.id, choice: ch });
      if ((RULE_KINDS as readonly string[]).includes(ch.kind)) rules[ch.kind as RuleKind].push(ch);
      if (ch.kind === 'FALLBACK' && ch.fallbackFor !== undefined && fallbacks[ch.fallbackFor] === undefined) {
        fallbacks[ch.fallbackFor] = ch;
      }
    }
    nodes.set(def.id, { def, choices, rules, fallbacks, scopedTriggers: triggers.filter((t) => t.scope === def.id) });
  }
  const discovery = new Map<string, typeof pkg.discoveryPaths>();
  for (const dp of pkg.discoveryPaths) discovery.set(dp.evidence, [...(discovery.get(dp.evidence) ?? []), dp]);
  const lineByCategory = new Map<Category, string>();
  for (const cat of Category.options) {
    const line = scoring.lines.find((l) => (l.categories ?? []).includes(cat));
    if (line !== undefined) lineByCategory.set(cat, line.id);
  }
  const statements = new Map<
    string,
    { node: string; st: NonNullable<Extract<NodeDef, { type: 'COURTROOM' }>['statements']>[number] }
  >();
  for (const def of pkg.nodes) {
    if (def.type === 'COURTROOM') for (const st of def.statements ?? []) statements.set(st.id, { node: def.id, st });
  }

  const c: CompiledCase = {
    key: pkg.meta.slug,
    hash: fnv1a64(canonicalJson(pkg)),
    pkg,
    nodes,
    choiceIndex,
    vars: new Map(pkg.variables.map((v) => [v.id, v] as const)),
    evidence: new Map(pkg.evidence.map((e) => [e.id, e] as const)),
    characters: new Map(pkg.characters.map((ch) => [ch.id, ch] as const)),
    sprites: new Map(pkg.sprites.map((s) => [s.id, s] as const)),
    scenes: new Map(pkg.scenes.map((s) => [s.id, s] as const)),
    objects: new Map(pkg.scenes.flatMap((s) => s.objects.map((obj) => [obj.id, { scene: s.id, obj }] as const))),
    statements,
    predicates,
    triggers,
    outcomes: [...pkg.outcomes].sort(byPriority),
    discovery,
    grounds: new Map(pkg.config.objectionGrounds.map((g) => [g.id, g] as const)),
    lineByCategory,
  };
  return { ok: true, c, warnings: [] };
}
