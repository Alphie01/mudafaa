import type {
  CasePackage,
  ChoiceDef,
  Effect,
  Match,
  NodeDef,
  ResponseBlock,
  Statement,
  TriggerDef,
  Variant,
} from '@mudafaa/case-schema';
import type { Prisma } from '../../../generated/prisma/client.js';
import { defined, emptyCollections, groupBy, idsByKey, json, must, opt, restore, type Tx } from './collections.js';

type EffectOwner = 'NODE_ENTER' | 'NODE_FIRST_ENTER' | 'CHOICE' | 'OBJECT' | 'TRIGGER';
type DialogueOwner = 'NODE' | 'CHOICE';
export type StoryPart = Pick<CasePackage, 'variables' | 'predicates' | 'nodes' | 'triggers'>;

/** Polimorfik etki ve diyalog satırlarını toplayıp tek seferde yazan yardımcı (sahip satırları önce oluşur). */
export class OwnedRows {
  readonly effects: Prisma.StoryEffectCreateManyInput[] = [];
  readonly dialogues: Prisma.CharacterDialogueCreateManyInput[] = [];

  constructor(private readonly versionId: string) {}

  addEffects(ownerType: EffectOwner, ownerId: string, list: readonly Effect[] | undefined): void {
    (list ?? []).forEach((e, i) => {
      const { type, ...payload } = e;
      this.effects.push({
        caseVersionId: this.versionId,
        ownerType,
        ownerId,
        sortOrder: i,
        type,
        payload: payload as Prisma.InputJsonValue,
      });
    });
  }

  addDialogues(ownerType: DialogueOwner, ownerId: string, blocks: readonly ResponseBlock[] | undefined): void {
    (blocks ?? []).forEach((b, i) => {
      this.dialogues.push({
        caseVersionId: this.versionId,
        ownerType,
        ownerId,
        sortOrder: i,
        condition: json(b.when),
        lines: b.lines as Prisma.InputJsonValue,
      });
    });
  }

  async flush(tx: Tx): Promise<void> {
    if (this.effects.length > 0) await tx.storyEffect.createMany({ data: this.effects });
    if (this.dialogues.length > 0) await tx.characterDialogue.createMany({ data: this.dialogues });
  }
}

/** Etki satırları (sahip başına sıralı) → paketteki etki listesi. */
export type EffectIndex = Map<string, Effect[]>;
export type DialogueIndex = Map<string, ResponseBlock[]>;

export async function loadOwned(
  tx: Tx,
  versionId: string,
): Promise<{ effects: EffectIndex; dialogues: DialogueIndex }> {
  const [effectRows, dialogueRows] = await Promise.all([
    tx.storyEffect.findMany({
      where: { caseVersionId: versionId },
      orderBy: [{ ownerId: 'asc' }, { sortOrder: 'asc' }],
    }),
    tx.characterDialogue.findMany({
      where: { caseVersionId: versionId },
      orderBy: [{ ownerId: 'asc' }, { sortOrder: 'asc' }],
    }),
  ]);
  const effects: EffectIndex = new Map();
  for (const r of effectRows) {
    const k = `${r.ownerType}:${r.ownerId}`;
    const e = { type: r.type, ...(r.payload as object) } as Effect;
    const list = effects.get(k);
    if (list === undefined) effects.set(k, [e]);
    else list.push(e);
  }
  const dialogues: DialogueIndex = new Map();
  for (const r of dialogueRows) {
    const k = `${r.ownerType}:${r.ownerId}`;
    const b = defined({ when: opt(r.condition), lines: r.lines }) as ResponseBlock;
    const list = dialogues.get(k);
    if (list === undefined) dialogues.set(k, [b]);
    else list.push(b);
  }
  return { effects, dialogues };
}

// Node'un kolonlara ya da satırlara giden alanları; geri kalan her şey `config` JSON'una aynen gider.
const NODE_BASE = [
  'id',
  'type',
  'title',
  'eyebrow',
  'chapter',
  'background',
  'hud',
  'exposeCounts',
  'onEnter',
  'onFirstEnter',
  'lines',
  'choices',
  'mode',
  'scene',
  'courtStage',
  'statements',
  'routes',
] as const;

const COURT_MATCH = new Set(['PRESS', 'PRESENT', 'OBJECT']);

function choiceColumns(ch: ChoiceDef | (Variant & { kind: 'VARIANT' })) {
  const c = ch as ChoiceDef;
  return {
    label: c.label,
    description: c.description,
    prompt: c.prompt,
    groupKey: c.group,
    tags: json(c.tags),
    visibleWhen: json(c.visibleWhen),
    enabledWhen: json(c.enabledWhen),
    lockedReason: c.lockedReason,
    cost: json(c.cost),
    maxUses: c.maxUses,
    repeat: c.repeat,
    quality: json(c.quality),
    feedback: json(c.feedback),
    match: c.match !== undefined && !COURT_MATCH.has(c.kind) ? json(c.match) : undefined,
    fallbackFor: c.fallbackFor,
    confirm: c.confirm,
    role: c.role,
  };
}

/**
 * Hikâye bölümünü (değişkenler, yüklemler, node'lar, seçenekler, varyantlar, geçişler, tetikleyiciler, etkiler,
 * diyaloglar, ifadeler, court_choices) ilişkisel satırlara yazar. Kimlikleri veritabanı üretir (`uuid(7)`):
 * sahip satırları `createManyAndReturn` ile toplu eklenir ve çocuklar `key` → `id` haritasıyla bağlanır.
 */
export async function importStory(tx: Tx, versionId: string, pkg: StoryPart, owned?: OwnedRows): Promise<void> {
  const rows = owned ?? new OwnedRows(versionId);
  const caseVersionId = versionId;

  if (pkg.variables.length > 0) {
    await tx.storyVariable.createMany({
      data: pkg.variables.map((v, i) => ({
        caseVersionId,
        key: v.id,
        sortOrder: i,
        type: v.type,
        initial: v.initial as Prisma.InputJsonValue,
        min: v.min,
        max: v.max,
        enumValues: json(v.enumValues),
        visibility: v.visibility,
        analysis: v.analysis,
        display: json(v.display),
      })),
    });
  }
  if (pkg.predicates.length > 0) {
    await tx.storyCondition.createMany({
      data: pkg.predicates.map((p, i) => ({
        caseVersionId,
        key: p.id,
        sortOrder: i,
        label: p.label,
        condition: p.when as Prisma.InputJsonValue,
      })),
    });
  }

  // Node'lar
  const nodeRows = await tx.storyNode.createManyAndReturn({
    select: { id: true, key: true },
    data: pkg.nodes.map((n, i) => {
      const rec = n as Record<string, unknown>;
      const config: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(rec)) if (!(NODE_BASE as readonly string[]).includes(k)) config[k] = v;
      return {
        caseVersionId,
        key: n.id,
        sortOrder: i,
        type: n.type,
        mode: rec.mode as string | undefined,
        title: n.title,
        eyebrow: n.eyebrow,
        chapter: n.chapter,
        background: n.background,
        hud: json(n.hud),
        exposeCounts: n.exposeCounts,
        sceneKey: rec.scene as string | undefined,
        courtStage: rec.courtStage as string | undefined,
        config: config as Prisma.InputJsonValue,
        emptyCollections: emptyCollections(n, ['onEnter', 'onFirstEnter', 'lines', 'statements']),
      };
    }),
  });
  const nodeIds = idsByKey(nodeRows);

  // Seçenekler (üst düzey)
  const choiceRows = await tx.storyChoice.createManyAndReturn({
    select: { id: true, key: true },
    data: pkg.nodes.flatMap((n) =>
      n.choices.map((ch, j) => ({
        caseVersionId,
        nodeId: must(nodeIds, n.id, 'node'),
        key: ch.id,
        sortOrder: j,
        kind: ch.kind,
        ...choiceColumns(ch),
        emptyCollections: emptyCollections(ch, ['effects', 'responses', 'variants']),
      })),
    ),
  });
  const choiceIds = idsByKey(choiceRows);

  // Varyantlar: `<seçenek>#<varyant>` anahtarlı alt satırlar
  const variantRows = await tx.storyChoice.createManyAndReturn({
    select: { id: true, key: true },
    data: pkg.nodes.flatMap((n) =>
      n.choices.flatMap((ch) =>
        (ch.variants ?? []).map((v, k) => ({
          caseVersionId,
          nodeId: must(nodeIds, n.id, 'node'),
          parentId: must(choiceIds, ch.id, 'seçenek'),
          key: `${ch.id}#${v.id}`,
          sortOrder: k,
          kind: 'VARIANT',
          label: v.label,
          prompt: v.prompt,
          quality: json(v.quality),
          emptyCollections: emptyCollections(v, ['effects', 'responses']),
        })),
      ),
    ),
  });
  const variantIds = idsByKey(variantRows);

  const transitions: Prisma.StoryTransitionCreateManyInput[] = [];
  const courtChoices: Prisma.CourtChoiceCreateManyInput[] = [];
  const statements: Prisma.TestimonyStatementCreateManyInput[] = [];

  for (const n of pkg.nodes) {
    const nodeId = must(nodeIds, n.id, 'node');
    rows.addEffects('NODE_ENTER', nodeId, n.onEnter);
    rows.addEffects('NODE_FIRST_ENTER', nodeId, n.onFirstEnter);
    rows.addDialogues('NODE', nodeId, n.lines);
    if (n.type === 'DECISION') {
      n.routes.forEach((r, i) =>
        transitions.push({
          caseVersionId,
          sortOrder: i,
          kind: 'ROUTE',
          fromNodeId: nodeId,
          toNodeKey: r.to,
          condition: json(r.when),
        }),
      );
    }
    if (n.type === 'COURTROOM') {
      (n.statements ?? []).forEach((st, i) =>
        statements.push({
          caseVersionId,
          nodeId,
          key: st.id,
          sortOrder: i,
          order: st.order,
          visibleWhen: json(st.visibleWhen),
          segments: st.segments as Prisma.InputJsonValue,
        }),
      );
    }
    for (const ch of n.choices) {
      const choiceId = must(choiceIds, ch.id, 'seçenek');
      rows.addEffects('CHOICE', choiceId, ch.effects);
      rows.addDialogues('CHOICE', choiceId, ch.responses);
      for (const v of ch.variants ?? []) {
        const variantId = must(variantIds, `${ch.id}#${v.id}`, 'varyant');
        rows.addEffects('CHOICE', variantId, v.effects);
        rows.addDialogues('CHOICE', variantId, v.responses);
      }
      if (ch.match !== undefined && COURT_MATCH.has(ch.kind)) {
        const m = ch.match as { statement?: string; evidence?: string[]; ground?: string };
        courtChoices.push({
          caseVersionId,
          choiceId,
          statementKey: m.statement,
          evidenceKeys: json(m.evidence),
          groundKey: m.ground,
        });
      }
      const next = ch.next;
      if (next === undefined) continue;
      const base = { caseVersionId, kind: 'NEXT' as const, fromChoiceId: choiceId, sortOrder: 0 };
      if (next === '$stay') transitions.push({ ...base, target: 'STAY' });
      else if (next === '$return') transitions.push({ ...base, target: 'RETURN' });
      else if (typeof next === 'string') transitions.push({ ...base, target: 'NODE', toNodeKey: next });
      else if ('push' in next) transitions.push({ ...base, target: 'PUSH', toNodeKey: next.push });
      else
        next.routes.forEach((r, i) =>
          transitions.push({
            caseVersionId,
            sortOrder: i,
            kind: 'ROUTE',
            fromChoiceId: choiceId,
            toNodeKey: r.to,
            condition: json(r.when),
          }),
        );
    }
  }

  // Tetikleyiciler: geçiş satırı (TRIGGER); etkileri o satıra bağlanır
  const triggerRows = await tx.storyTransition.createManyAndReturn({
    select: { id: true, key: true },
    data: pkg.triggers.map((t, i) => ({
      caseVersionId,
      sortOrder: i,
      kind: 'TRIGGER' as const,
      key: t.id,
      priority: t.priority,
      once: t.once,
      fromNodeId: t.scope === undefined ? undefined : must(nodeIds, t.scope, 'node'),
      condition: t.when as Prisma.InputJsonValue,
      toNodeKey: t.goto,
      emptyCollections: emptyCollections(t, ['effects']),
    })),
  });
  const triggerIds = new Map(triggerRows.map((r) => [r.key ?? '', r.id] as const));
  for (const t of pkg.triggers) rows.addEffects('TRIGGER', must(triggerIds, t.id, 'tetikleyici'), t.effects);

  if (transitions.length > 0) await tx.storyTransition.createMany({ data: transitions });
  if (courtChoices.length > 0) await tx.courtChoice.createMany({ data: courtChoices });
  if (statements.length > 0) await tx.testimonyStatement.createMany({ data: statements });
  if (owned === undefined) await rows.flush(tx);
}

/** İlişkisel satırlardan hikâye bölümünü yeniden kurar (`importStory`'nin tersi). */
export async function exportStory(
  tx: Tx,
  versionId: string,
  index?: { effects: EffectIndex; dialogues: DialogueIndex },
): Promise<StoryPart> {
  const where = { caseVersionId: versionId };
  const order = { sortOrder: 'asc' as const };
  const [variables, conditions, nodes, choices, transitions, statements, courtChoices, owned] = await Promise.all([
    tx.storyVariable.findMany({ where, orderBy: order }),
    tx.storyCondition.findMany({ where, orderBy: order }),
    tx.storyNode.findMany({ where, orderBy: order }),
    tx.storyChoice.findMany({ where, orderBy: order }),
    tx.storyTransition.findMany({ where, orderBy: order }),
    tx.testimonyStatement.findMany({ where, orderBy: order }),
    tx.courtChoice.findMany({ where }),
    index ?? loadOwned(tx, versionId),
  ]);
  const fx = (owner: EffectOwner, id: string) => owned.effects.get(`${owner}:${id}`) ?? [];
  const dlg = (owner: DialogueOwner, id: string) => owned.dialogues.get(`${owner}:${id}`) ?? [];
  const nodeKey = new Map(nodes.map((n) => [n.id, n.key] as const));
  const choicesByNode = groupBy(
    choices.filter((c) => c.parentId === null),
    (c) => c.nodeId,
  );
  const variantsByParent = groupBy(
    choices.filter((c) => c.parentId !== null),
    (c) => c.parentId,
  );
  const nextByChoice = groupBy(
    transitions.filter((t) => t.kind !== 'TRIGGER'),
    (t) => t.fromChoiceId,
  );
  const routesByNode = groupBy(
    transitions.filter((t) => t.kind === 'ROUTE'),
    (t) => t.fromNodeId,
  );
  const statementsByNode = groupBy(statements, (s) => s.nodeId);
  const courtByChoice = new Map(courtChoices.map((c) => [c.choiceId, c] as const));

  const variantOf = (row: (typeof choices)[number], parentKey: string): Variant => {
    const v: Record<string, unknown> = defined({
      id: row.key.slice(parentKey.length + 1),
      label: row.label ?? '',
      prompt: opt(row.prompt),
      quality: opt(row.quality),
    });
    restore(v, 'effects', fx('CHOICE', row.id), row.emptyCollections);
    restore(v, 'responses', dlg('CHOICE', row.id), row.emptyCollections);
    return v as Variant;
  };

  const choiceOf = (row: (typeof choices)[number]): ChoiceDef => {
    const court = courtByChoice.get(row.id);
    const match =
      court === undefined
        ? opt(row.match)
        : defined({
            statement: opt(court.statementKey),
            evidence: opt(court.evidenceKeys),
            ground: opt(court.groundKey),
          });
    const ch: Record<string, unknown> = defined({
      id: row.key,
      kind: row.kind,
      label: opt(row.label),
      description: opt(row.description),
      prompt: opt(row.prompt),
      group: opt(row.groupKey),
      tags: opt(row.tags),
      visibleWhen: opt(row.visibleWhen),
      enabledWhen: opt(row.enabledWhen),
      lockedReason: opt(row.lockedReason),
      cost: opt(row.cost),
      maxUses: opt(row.maxUses),
      repeat: opt(row.repeat),
      quality: opt(row.quality),
      feedback: opt(row.feedback),
      match: match as Match | undefined,
      fallbackFor: opt(row.fallbackFor),
      confirm: opt(row.confirm),
      role: opt(row.role),
    });
    restore(ch, 'effects', fx('CHOICE', row.id), row.emptyCollections);
    restore(ch, 'responses', dlg('CHOICE', row.id), row.emptyCollections);
    restore(
      ch,
      'variants',
      (variantsByParent.get(row.id) ?? []).map((v) => variantOf(v, row.key)),
      row.emptyCollections,
    );
    const nexts = nextByChoice.get(row.id) ?? [];
    const first = nexts[0];
    if (first !== undefined) {
      if (first.kind === 'ROUTE') {
        ch.next = { routes: nexts.map((r) => defined({ when: opt(r.condition), to: r.toNodeKey ?? '' })) };
      } else if (first.target === 'STAY') ch.next = '$stay';
      else if (first.target === 'RETURN') ch.next = '$return';
      else if (first.target === 'PUSH') ch.next = { push: first.toNodeKey ?? '' };
      else ch.next = first.toNodeKey ?? '';
    }
    return ch as ChoiceDef;
  };

  const nodeOf = (row: (typeof nodes)[number]): NodeDef => {
    const n: Record<string, unknown> = {
      ...(row.config as Record<string, unknown>),
      ...defined({
        id: row.key,
        type: row.type,
        mode: opt(row.mode),
        title: opt(row.title),
        eyebrow: opt(row.eyebrow),
        chapter: opt(row.chapter),
        background: opt(row.background),
        hud: opt(row.hud),
        exposeCounts: opt(row.exposeCounts),
        scene: opt(row.sceneKey),
        courtStage: opt(row.courtStage),
      }),
    };
    restore(n, 'onEnter', fx('NODE_ENTER', row.id), row.emptyCollections);
    restore(n, 'onFirstEnter', fx('NODE_FIRST_ENTER', row.id), row.emptyCollections);
    restore(n, 'lines', dlg('NODE', row.id), row.emptyCollections);
    n.choices = (choicesByNode.get(row.id) ?? []).map(choiceOf);
    if (row.type === 'COURTROOM') {
      const sts: Statement[] = (statementsByNode.get(row.id) ?? []).map(
        (s) =>
          defined({
            id: s.key,
            order: s.order,
            visibleWhen: opt(s.visibleWhen),
            segments: s.segments,
          }) as Statement,
      );
      restore(n, 'statements', sts, row.emptyCollections);
    }
    if (row.type === 'DECISION') {
      n.routes = (routesByNode.get(row.id) ?? []).map((r) =>
        defined({ when: opt(r.condition), to: r.toNodeKey ?? '' }),
      );
    }
    return n as NodeDef;
  };

  const triggers: TriggerDef[] = transitions
    .filter((t) => t.kind === 'TRIGGER')
    .map((t) => {
      const tr: Record<string, unknown> = defined({
        id: t.key ?? '',
        scope: t.fromNodeId === null ? undefined : nodeKey.get(t.fromNodeId),
        priority: t.priority ?? 0,
        when: t.condition,
        once: opt(t.once),
        goto: opt(t.toNodeKey),
      });
      restore(tr, 'effects', fx('TRIGGER', t.id), t.emptyCollections);
      return tr as TriggerDef;
    });

  return {
    variables: variables.map(
      (v) =>
        defined({
          id: v.key,
          type: v.type,
          initial: v.initial,
          min: opt(v.min),
          max: opt(v.max),
          enumValues: opt(v.enumValues),
          visibility: v.visibility,
          analysis: opt(v.analysis),
          display: opt(v.display),
        }) as unknown as CasePackage['variables'][number],
    ),
    predicates: conditions.map(
      (c) => ({ id: c.key, label: c.label, when: c.condition }) as CasePackage['predicates'][number],
    ),
    nodes: nodes.map(nodeOf),
    triggers,
  };
}

/** Sürümün bütün içerik satırlarını siler (polimorfik etki ve diyaloglar dahil); sürüm satırı kalır. */
export async function clearContent(tx: Tx, versionId: string): Promise<void> {
  const where = { caseVersionId: versionId };
  await tx.storyEffect.deleteMany({ where });
  await tx.characterDialogue.deleteMany({ where });
  await tx.courtChoice.deleteMany({ where });
  await tx.storyTransition.deleteMany({ where });
  await tx.testimonyStatement.deleteMany({ where });
  await tx.storyChoice.deleteMany({ where: { ...where, parentId: { not: null } } });
  await tx.storyChoice.deleteMany({ where });
  await tx.storyNode.deleteMany({ where });
  await tx.storyVariable.deleteMany({ where });
  await tx.storyCondition.deleteMany({ where });
  await tx.sceneHotspot.deleteMany({ where });
  await tx.sceneObject.deleteMany({ where });
  await tx.sceneAsset.deleteMany({ where });
  await tx.scene.deleteMany({ where });
  await tx.characterRelationship.deleteMany({ where });
  await tx.character.deleteMany({ where });
  await tx.characterSprite.deleteMany({ where });
  await tx.evidenceRelationship.deleteMany({ where });
  await tx.evidenceDiscoveryCondition.deleteMany({ where });
  await tx.evidence.deleteMany({ where });
  await tx.courtStage.deleteMany({ where });
  await tx.courtSession.deleteMany({ where });
  await tx.courtOutcome.deleteMany({ where });
  await tx.asset.deleteMany({ where });
}
