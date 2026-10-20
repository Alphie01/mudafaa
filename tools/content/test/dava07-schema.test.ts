import { CasePackage } from '@mudafaa/case-schema';
import type { ChoiceDef, Effect, NodeDef } from '@mudafaa/case-schema';
import { describe, expect, it } from 'vitest';
import { mergedCase, partFiles } from './helpers/dava07.js';

// Motor ve doğrulayıcı olmadan yapılabilen ucuz denetimler: şema, referanslar, DISCOVER ↔ bulunma yolu 1:1, HUD,
// çıkışlar, fallback'ler, sonuçlar ve skor satırları. Motor düzeyindeki davranış dava07-investigation/golden testlerinde.

const pkg = CasePackage.parse(mergedCase());

type Obj = Record<string, unknown>;
const isObj = (x: unknown): x is Obj => typeof x === 'object' && x !== null && !Array.isArray(x);

/** Değeri derinlemesine dolaşır; her düz nesne için `visit` çağrılır. */
const walk = (x: unknown, visit: (o: Obj) => void): void => {
  if (Array.isArray(x)) x.forEach((item) => walk(item, visit));
  else if (isObj(x)) {
    visit(x);
    Object.values(x).forEach((value) => walk(value, visit));
  }
};

const ids = <T extends { id: string }>(items: readonly T[]) => new Set(items.map((item) => item.id));
const duplicates = (values: readonly string[]) => values.filter((v, i) => values.indexOf(v) !== i);

const nodes = pkg.nodes;
const allChoices = nodes.flatMap((n) => n.choices);
const sets = {
  nodes: ids(nodes),
  choices: ids(allChoices),
  vars: ids(pkg.variables),
  evidence: ids(pkg.evidence),
  characters: ids(pkg.characters),
  sprites: ids(pkg.sprites),
  scenes: ids(pkg.scenes),
  objects: ids(pkg.scenes.flatMap((s) => s.objects)),
  predicates: ids(pkg.predicates),
  assets: ids(pkg.assets),
  lines: ids(pkg.config.scoring.lines),
  grounds: ids(pkg.config.objectionGrounds),
};
const boolVars = new Set(pkg.variables.filter((v) => v.type === 'bool').map((v) => v.id));
const visibleVars = new Set(pkg.variables.filter((v) => v.visibility === 'VISIBLE').map((v) => v.id));
const evidenceById = new Map(pkg.evidence.map((e) => [e.id, e]));
const PLAYER_KINDS = new Set(['OPTION', 'TOPIC', 'NAVIGATE', 'CONTINUE']);
const RULE_KINDS = new Set(['EXAMINE', 'COMBINE', 'PRESS', 'PRESENT', 'OBJECT', 'FALLBACK']);

/** Etki listesindeki (IF dalları dahil) her etki. */
const flatEffects = (effects: readonly Effect[] | undefined): Effect[] =>
  (effects ?? []).flatMap((e) => (e.type === 'IF' ? [e, ...flatEffects(e.then), ...flatEffects(e.else)] : [e]));

/** Her etki listesi, kaynağıyla (Ruling 7: seçenek / kural / nesne / tetikleyici / node kimliği). */
const effectSources = (): { type: string; id: string; effects: Effect[] }[] => {
  const out: { type: string; id: string; effects: Effect[] }[] = [];
  for (const node of nodes) {
    out.push({
      type: 'NODE',
      id: node.id,
      effects: flatEffects([...(node.onFirstEnter ?? []), ...(node.onEnter ?? [])]),
    });
    for (const choice of node.choices) {
      const type = PLAYER_KINDS.has(choice.kind) ? 'CHOICE' : 'RULE';
      const variantEffects = (choice.variants ?? []).flatMap((v) => v.effects ?? []);
      out.push({ type, id: choice.id, effects: flatEffects([...(choice.effects ?? []), ...variantEffects]) });
    }
  }
  for (const scene of pkg.scenes) {
    for (const obj of scene.objects) out.push({ type: 'OBJECT', id: obj.id, effects: flatEffects(obj.effects) });
  }
  for (const trigger of pkg.triggers)
    out.push({ type: 'TRIGGER', id: trigger.id, effects: flatEffects(trigger.effects) });
  return out;
};

describe('Dava #07 package (schema-level)', () => {
  it('parts merge in filename order and parse as CasePackage', () => {
    expect(partFiles()[0]).toBe('00-meta.json');
    expect(pkg.meta.slug).toBe('gece-bekcisinin-sirri');
    expect(pkg.config.startNode).toBe('PR_00');
  });

  it('ids are unique per namespace', () => {
    const statements = nodes.flatMap((n) => (n.type === 'COURTROOM' ? (n.statements ?? []).map((s) => s.id) : []));
    for (const list of [
      nodes.map((n) => n.id),
      allChoices.map((c) => c.id),
      pkg.variables.map((v) => v.id),
      pkg.evidence.map((e) => e.id),
      pkg.characters.map((c) => c.id),
      pkg.sprites.map((s) => s.id),
      pkg.scenes.map((s) => s.id),
      pkg.scenes.flatMap((s) => s.objects.map((o) => o.id)),
      statements,
      pkg.outcomes.map((o) => o.id),
      pkg.triggers.map((t) => t.id),
      pkg.predicates.map((p) => p.id),
    ]) {
      expect(duplicates(list)).toEqual([]);
    }
  });

  it('declares the node ids of the design', () => {
    for (const id of [
      'BR_01',
      'BR_02',
      'INV_HUB',
      'INV_DAY_END',
      'INV_GORUSME',
      'INV_ARAMA',
      'INV_INCELEME',
      'INV_CIKARIM',
      'INV_BEL',
      'INV_HTS',
      'INV_HTS_SELIN',
      'INV_DIL',
      'INV_T_HUS',
      'INV_T_SEL',
      'INV_T_MUR',
      'C_00',
    ]) {
      expect(sets.nodes.has(id), id).toBe(true);
    }
  });

  it('every referenced id exists', () => {
    const missing: string[] = [];
    const need = (set: Set<string>, id: unknown, what: string) => {
      if (typeof id === 'string' && !set.has(id)) missing.push(`${what}:${id}`);
    };
    const { relationships, evidenceRelations, tests, ...rest } = pkg;
    walk(rest, (o) => {
      need(sets.evidence, o.hasEvidence, 'evidence');
      if (typeof o.flag === 'string' && !boolVars.has(o.flag)) missing.push(`flag:${o.flag}`);
      if (typeof o.var === 'string') need(sets.vars, o.var, 'var');
      need(sets.choices, o.chosen, 'choice');
      need(sets.choices, o.uses, 'choice');
      need(sets.nodes, o.visited, 'node');
      need(sets.nodes, o.atNode, 'node');
      need(sets.nodes, o.visits, 'node');
      need(sets.objects, o.found, 'object');
      need(sets.predicates, o.ref, 'predicate');
      need(sets.characters, o.met, 'character');
      if (o.count === 'evidence' && typeof o.tag === 'string') {
        if (!pkg.evidence.some((e) => e.tags?.includes(o.tag as string))) missing.push(`tag:${o.tag}`);
      }
      if (o.type === 'DISCOVER') need(sets.evidence, o.evidence, 'evidence');
      if (o.type === 'MEET') need(sets.characters, o.character, 'character');
      if (o.type === 'GOTO') need(sets.nodes, o.node, 'node');
      if (o.type === 'SCORE') need(sets.lines, o.line, 'line');
      if (typeof o.speaker === 'string' && o.speaker !== 'player' && o.speaker !== 'narrator') {
        need(sets.characters, o.speaker, 'speaker');
      }
      need(sets.characters, o.character, 'character');
      need(sets.characters, o.counsel, 'character');
      need(sets.characters, o.witness, 'character');
      need(sets.characters, o.coverCharacter, 'character');
      need(sets.sprites, o.spriteId, 'sprite');
      need(sets.nodes, o.push, 'node');
      need(sets.nodes, o.to, 'node');
      if (typeof o.next === 'string' && o.next !== '$stay' && o.next !== '$return') need(sets.nodes, o.next, 'node');
      need(sets.nodes, o.goto, 'node');
      need(sets.nodes, o.scope, 'node');
      need(sets.nodes, o.entryNode, 'node');
      need(sets.nodes, o.startNode, 'node');
      need(sets.nodes, o.inspectNode, 'node');
      need(sets.scenes, o.scene, 'scene');
      need(sets.assets, o.image, 'asset');
      need(sets.evidence, o.prosecutionEvidence, 'evidence');
    });
    for (const r of relationships) [r.from, r.to].forEach((id) => need(sets.characters, id, 'character'));
    for (const r of evidenceRelations) [r.from, r.to].forEach((id) => need(sets.evidence, id, 'evidence'));
    for (const p of pkg.discoveryPaths) need(sets.evidence, p.evidence, 'evidence');
    for (const path of tests?.goldenPaths ?? []) {
      for (const a of path.actions) {
        if (a.kind === 'CHOOSE') need(sets.choices, a.choiceId, 'golden-choice');
        if (a.kind === 'PRESENT') need(sets.evidence, a.evidenceId, 'golden-evidence');
        if (a.kind === 'COMBINE') [a.a, a.b].forEach((id) => need(sets.evidence, id, 'golden-evidence'));
        if (a.kind === 'OBJECT') need(sets.grounds, a.groundId, 'golden-ground');
      }
      need(new Set(pkg.outcomes.map((o) => o.id)), path.expect.outcome, 'golden-outcome');
    }
    expect(missing).toEqual([]);
  });

  it('node-local references (tabs, groups, matches, pools, grounds) resolve', () => {
    const problems: string[] = [];
    for (const node of nodes) {
      const local = ids(node.choices);
      const needLocal = (id: string, what: string) => {
        if (!local.has(id)) problems.push(`${node.id}.${what}:${id}`);
      };
      if (node.type === 'INVESTIGATION') {
        node.tabs.forEach((tab) => tab.choices.forEach((id) => needLocal(id, 'tab')));
        node.quickTalk?.choices.forEach((id) => needLocal(id, 'quickTalk'));
      }
      if (node.type === 'STORY') {
        for (const b of node.blocks ?? []) {
          if (b.type !== 'choiceGroup') continue;
          if (!node.choices.some((c) => c.group === b.group)) problems.push(`${node.id}.group:${b.group}`);
          Object.keys(b.hints ?? {}).forEach((id) => needLocal(id, 'hint'));
        }
      }
      const statements = node.type === 'COURTROOM' ? ids(node.statements ?? []) : new Set<string>();
      for (const choice of node.choices) {
        const m = choice.match;
        if (m === undefined) continue;
        if ('tool' in m && node.type === 'DOCUMENT') {
          if (!node.tools.some((t) => t.id === m.tool)) problems.push(`${choice.id}.tool:${m.tool}`);
          if (!node.rows.some((r) => r.id === m.target)) problems.push(`${choice.id}.target:${m.target}`);
        }
        if ('a' in m && node.type === 'DEDUCTION') {
          for (const id of [m.a, m.b]) {
            if (!node.pool.includes(id) || evidenceById.get(id)?.combinable !== true)
              problems.push(`${choice.id}.combine:${id}`);
          }
        }
        if ('statement' in m && m.statement !== undefined && !statements.has(m.statement)) {
          problems.push(`${choice.id}.statement:${m.statement}`);
        }
        if ('evidence' in m) {
          for (const id of m.evidence)
            if (evidenceById.get(id)?.presentable !== true) problems.push(`${choice.id}.present:${id}`);
        }
        if ('ground' in m && node.type === 'COURTROOM' && !(node.objectionGrounds ?? []).includes(m.ground)) {
          problems.push(`${choice.id}.ground:${m.ground}`);
        }
      }
      if (node.type === 'DEDUCTION') {
        for (const id of node.pool)
          if (evidenceById.get(id)?.combinable !== true) problems.push(`${node.id}.pool:${id}`);
      }
      if (node.type === 'COURTROOM') {
        for (const g of node.objectionGrounds ?? [])
          if (!sets.grounds.has(g)) problems.push(`${node.id}.groundDef:${g}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('DISCOVER effects and discovery paths match 1:1 (Ruling 7)', () => {
    const effectKeys = effectSources().flatMap((src) =>
      src.effects.flatMap((e) => (e.type === 'DISCOVER' ? [`${e.evidence}|${src.type}|${src.id}`] : [])),
    );
    const pathKeys = pkg.discoveryPaths
      .filter((p) => p.source.type !== 'INITIAL')
      .map((p) => `${p.evidence}|${p.source.type}|${p.source.id ?? ''}`);
    expect(duplicates(effectKeys)).toEqual([]);
    expect(duplicates(pathKeys)).toEqual([]);
    expect([...pathKeys].sort()).toEqual([...effectKeys].sort());
  });

  it('every evidence is initially known (with an INITIAL path) or discoverable', () => {
    for (const e of pkg.evidence) {
      const paths = pkg.discoveryPaths.filter((p) => p.evidence === e.id);
      const initial = paths.some((p) => p.source.type === 'INITIAL');
      expect(initial, e.id).toBe(e.initiallyKnown);
      expect(paths.length > 0, e.id).toBe(true);
    }
  });

  it('collectable key evidence is the six listed items, none initially known', () => {
    const key = pkg.evidence.filter((e) => e.tags?.includes('key'));
    expect(key.map((e) => e.id).sort()).toEqual([
      'ev_ariza_kaydi',
      'ev_dna',
      'ev_fis',
      'ev_hts',
      'ev_isg_zimmet',
      'ev_kamera',
    ]);
    expect(key.every((e) => !e.initiallyKnown)).toBe(true);
  });

  it('HUD lists only VISIBLE variables', () => {
    const hidden = nodes.flatMap((n) => (n.hud ?? []).filter((v) => !visibleVars.has(v)).map((v) => `${n.id}:${v}`));
    expect(hidden).toEqual([]);
  });

  it('every non-RESULT node has a way out; RESULT nodes have no choices', () => {
    for (const node of nodes) {
      if (node.type === 'RESULT') expect(node.choices, node.id).toEqual([]);
      else if (node.type === 'DECISION')
        expect(
          node.routes.some((r) => r.when === undefined),
          node.id,
        ).toBe(true);
      else
        expect(
          node.choices.some((c) => PLAYER_KINDS.has(c.kind)),
          node.id,
        ).toBe(true);
    }
  });

  it('parametric nodes have the fallbacks the validator requires', () => {
    const hasFallback = (node: NodeDef, kind: ChoiceDef['fallbackFor']) =>
      node.choices.some((c) => c.kind === 'FALLBACK' && c.fallbackFor === kind);
    for (const node of nodes) {
      if (node.type === 'SCENE') expect(hasFallback(node, 'TAP'), node.id).toBe(true);
      if (node.type === 'DOCUMENT') expect(hasFallback(node, 'EXAMINE'), node.id).toBe(true);
      if (node.type === 'DEDUCTION') expect(hasFallback(node, 'COMBINE'), node.id).toBe(true);
      if (node.type === 'COURTROOM' && node.mode === 'TESTIMONY')
        expect(hasFallback(node, 'PRESENT'), node.id).toBe(true);
      if (node.type === 'COURTROOM' && (node.objectionGrounds ?? []).length > 0) {
        expect(hasFallback(node, 'OBJECT'), node.id).toBe(true);
      }
    }
  });

  it('player-facing texts are not empty', () => {
    const empty: string[] = [];
    for (const choice of allChoices) {
      if (PLAYER_KINDS.has(choice.kind) && !choice.label?.trim()) empty.push(`${choice.id}.label`);
      if (RULE_KINDS.has(choice.kind) && choice.label !== undefined) empty.push(`${choice.id}.ruleLabel`);
    }
    walk(pkg, (o) => {
      if (o.type === 'MARK' && !(o.feedback as string).trim()) empty.push('MARK');
      if (typeof o.text === 'string' && !o.text.trim()) empty.push('text');
    });
    expect(empty).toEqual([]);
  });

  it('every SCORE maps to a scoring line', () => {
    const mapped = new Set(pkg.config.scoring.lines.flatMap((l) => l.categories ?? []));
    walk(pkg, (o) => {
      if (o.type === 'SCORE' && o.line === undefined)
        expect(mapped.has(o.category as never), String(o.category)).toBe(true);
    });
  });

  it('outcomes: unique priorities and the default last', () => {
    const sorted = [...pkg.outcomes].sort((a, b) => a.priority - b.priority);
    expect(duplicates(sorted.map((o) => String(o.priority)))).toEqual([]);
    expect(sorted.at(-1)?.when).toEqual({ all: [] });
  });

  it('search scene follows the design rects', () => {
    const scene = pkg.scenes.find((s) => s.id === 'sc_depo_sokagi');
    expect(scene).toMatchObject({ width: 344, height: 380 });
    const rects = Object.fromEntries((scene?.objects ?? []).map((o) => [o.id, o.shapes[0]]));
    expect(rects).toEqual({
      ob_lamba: { rect: { x: 244, y: 44, w: 64, h: 52 } },
      ob_kamera: { rect: { x: 144, y: 76, w: 56, h: 90 } },
      ob_iz: { rect: { x: 180, y: 302, w: 60, h: 66 } },
      ob_cop: { rect: { x: 292, y: 236, w: 52, h: 62 } },
    });
    expect(scene?.objects.every((o) => o.marker === 'HIDDEN')).toBe(true);
    const preview = pkg.scenes.find((s) => s.id === 'sc_olay_yeri_depo');
    expect(preview).toMatchObject({ width: 344, height: 214 });
    expect(preview?.objects.every((o) => o.marker === 'VISIBLE')).toBe(true);
  });

  it('cast sprites come from content/shared/sprites unchanged and the counsel is Av. Deniz Arslan', () => {
    const counsel = pkg.characters.filter((c) => c.role === 'COUNSEL');
    expect(counsel).toMatchObject([{ id: 'deniz', name: 'Av. Deniz Arslan', spriteId: 'avukat_cubbe' }]);
    expect(pkg.sprites.length).toBe(new Set(pkg.characters.map((c) => c.spriteId)).size);
  });
});
