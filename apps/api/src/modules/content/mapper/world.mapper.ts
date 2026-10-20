import type { CasePackage, SceneDef, SceneObject, Shape } from '@mudafaa/case-schema';
import type { Prisma } from '../../../generated/prisma/client.js';
import { defined, emptyCollections, groupBy, idsByKey, json, must, opt, restore, type Tx } from './collections.js';
import type { EffectIndex, OwnedRows } from './story.mapper.js';

export type WorldPart = Pick<
  CasePackage,
  | 'sprites'
  | 'characters'
  | 'relationships'
  | 'evidence'
  | 'evidenceRelations'
  | 'discoveryPaths'
  | 'scenes'
  | 'court'
  | 'outcomes'
  | 'assets'
>;

/** Varlık satırının paket dışı bilgisi (dosya türü ve boyutu); yükleyici doldurur. */
export type AssetInfo = Record<string, { mime: string; size: number }>;

const MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  json: 'application/json',
  pdf: 'application/pdf',
};

/** Uzantıdan dosya türü (bilinmeyen uzantı `application/octet-stream`). */
export const mimeOf = (path: string): string =>
  MIME[path.split('.').pop()?.toLowerCase() ?? ''] ?? 'application/octet-stream';

function hotspot(shape: Shape): { shape: string; geometry: Prisma.InputJsonValue } {
  if ('rect' in shape) return { shape: 'RECT', geometry: shape.rect };
  if ('circle' in shape) return { shape: 'CIRCLE', geometry: shape.circle };
  return { shape: 'POLYGON', geometry: shape.polygon };
}

function shapeOf(row: { shape: string; geometry: unknown }): Shape {
  if (row.shape === 'RECT') return { rect: row.geometry } as Shape;
  if (row.shape === 'CIRCLE') return { circle: row.geometry } as Shape;
  return { polygon: row.geometry } as Shape;
}

/**
 * Dünya bölümünü (kadro, sprite'lar, ilişkiler, deliller, sahneler, mahkeme, sonuçlar, varlıklar) satırlara yazar.
 * Sahne nesnelerinin etkileri `story_effects(OBJECT)` olarak `owned`'a eklenir.
 */
export async function importWorld(
  tx: Tx,
  versionId: string,
  pkg: WorldPart,
  owned: OwnedRows,
  assetInfo: AssetInfo = {},
): Promise<void> {
  const caseVersionId = versionId;
  const many = async <T>(rows: T[], write: (data: T[]) => Promise<unknown>) => {
    if (rows.length > 0) await write(rows);
  };

  await many(
    pkg.sprites.map((s, i) => ({
      caseVersionId,
      key: s.id,
      sortOrder: i,
      rows: s.rows,
      skin: s.skin,
      noEyes: s.noEyes,
      noMouth: s.noMouth,
    })),
    (data) => tx.characterSprite.createMany({ data }),
  );
  await many(
    pkg.characters.map((c, i) => ({
      caseVersionId,
      key: c.id,
      sortOrder: i,
      name: c.name,
      shortLabel: c.shortLabel,
      role: c.role,
      age: c.age,
      occupation: c.occupation,
      bio: c.bio,
      accent: c.accent,
      spriteKey: c.spriteId,
      notes: c.notes,
      initiallyKnown: c.initiallyKnown,
    })),
    (data) => tx.character.createMany({ data }),
  );
  await many(
    pkg.relationships.map((r, i) => ({
      caseVersionId,
      sortOrder: i,
      fromKey: r.from,
      toKey: r.to,
      type: r.type,
      description: r.description,
      hidden: r.hidden,
      revealWhen: json(r.revealWhen),
    })),
    (data) => tx.characterRelationship.createMany({ data }),
  );
  await many(
    pkg.evidence.map((e, i) => ({
      caseVersionId,
      key: e.id,
      sortOrder: i,
      kind: e.kind,
      type: e.type,
      title: e.title,
      shortText: e.shortText,
      description: e.description,
      sourceLabel: e.sourceLabel,
      tagLabel: e.tagLabel,
      icon: e.icon,
      side: e.side,
      strength: e.strength,
      legalValidity: e.legalValidity,
      legalNote: e.legalNote,
      presentable: e.presentable,
      combinable: e.combinable,
      countsInBag: e.countsInBag,
      initiallyKnown: e.initiallyKnown,
      relatedCharacters: json(e.relatedCharacters),
      relatedEvents: json(e.relatedEvents),
      tags: json(e.tags),
      missedHint: e.missedHint,
    })),
    (data) => tx.evidence.createMany({ data }),
  );
  await many(
    pkg.evidenceRelations.map((r, i) => ({ caseVersionId, sortOrder: i, fromKey: r.from, toKey: r.to, type: r.type })),
    (data) => tx.evidenceRelationship.createMany({ data }),
  );
  await many(
    pkg.discoveryPaths.map((d, i) => ({
      caseVersionId,
      sortOrder: i,
      evidenceKey: d.evidence,
      sourceType: d.source.type,
      sourceKey: d.source.id,
      requires: json(d.requires),
      hint: d.hint,
    })),
    (data) => tx.evidenceDiscoveryCondition.createMany({ data }),
  );

  // Sahneler → görsel (scene_assets), nesneler → hotspot'lar ve etkiler
  const sceneRows = await tx.scene.createManyAndReturn({
    select: { id: true, key: true },
    data: pkg.scenes.map((s, i) => ({
      caseVersionId,
      key: s.id,
      sortOrder: i,
      title: s.title,
      description: s.description,
      width: s.width,
      height: s.height,
      touchPadding: s.touchPadding,
      unlockWhen: json(s.unlockWhen),
    })),
  });
  const sceneIds = idsByKey(sceneRows);
  await many(
    pkg.scenes.map((s) => ({
      caseVersionId,
      sceneId: must(sceneIds, s.id, 'sahne'),
      sortOrder: 0,
      assetKey: s.image,
      role: 'BACKGROUND',
    })),
    (data) => tx.sceneAsset.createMany({ data }),
  );
  const objectRows = await tx.sceneObject.createManyAndReturn({
    select: { id: true, key: true },
    data: pkg.scenes.flatMap((s) =>
      s.objects.map((o, j) => ({
        caseVersionId,
        sceneId: must(sceneIds, s.id, 'sahne'),
        key: o.id,
        sortOrder: j,
        name: o.name,
        marker: o.marker,
        z: o.z,
        activeWhen: json(o.activeWhen),
        feedback: o.feedback,
        badge: o.badge,
        inspectNodeKey: o.inspectNode,
        maxUses: o.maxUses,
        emptyCollections: emptyCollections(o, ['effects']),
      })),
    ),
  });
  const objectIds = idsByKey(objectRows);
  await many(
    pkg.scenes.flatMap((s) =>
      s.objects.flatMap((o) => {
        const objectId = must(objectIds, o.id, 'sahne nesnesi');
        owned.addEffects('OBJECT', objectId, o.effects);
        return o.shapes.map((sh, k) => ({ caseVersionId, objectId, sortOrder: k, ...hotspot(sh) }));
      }),
    ),
    (data) => tx.sceneHotspot.createMany({ data }),
  );

  // Mahkeme
  const sessionRows = await tx.courtSession.createManyAndReturn({
    select: { id: true, key: true },
    data: pkg.court.sessions.map((s, i) => ({ caseVersionId, key: s.id, sortOrder: i, title: s.title })),
  });
  const sessionIds = idsByKey(sessionRows);
  await many(
    pkg.court.sessions.flatMap((s) =>
      s.stages.map((st, j) => ({
        caseVersionId,
        sessionId: must(sessionIds, s.id, 'celse'),
        key: st.id,
        sortOrder: j,
        type: st.type,
        entryNodeKey: st.entryNode,
      })),
    ),
    (data) => tx.courtStage.createMany({ data }),
  );
  await many(
    pkg.outcomes.map((o, i) => ({
      caseVersionId,
      key: o.id,
      sortOrder: i,
      class: o.class,
      priority: o.priority,
      when: o.when as Prisma.InputJsonValue,
      stamp: o.stamp,
      stampTone: o.stampTone,
      header: o.header,
      sentence: o.sentence,
      verdictText: o.verdictText,
      reasoning: o.reasoning as Prisma.InputJsonValue,
      legalBasis: o.legalBasis,
      xp: o.xp as Prisma.InputJsonValue,
      howToReach: o.howToReach,
      ethicsCard: o.ethicsCard,
    })),
    (data) => tx.courtOutcome.createMany({ data }),
  );

  // Varlıklar (sha256 zorunlu; yükleyici doldurur)
  await many(
    pkg.assets.map((a, i) => {
      if (a.sha256 === undefined) throw new Error(`İçerik eşleyici: ${a.id} varlığının sha256'sı yok`);
      const info = assetInfo[a.id];
      return {
        caseVersionId,
        key: a.id,
        sortOrder: i,
        kind: a.kind,
        path: a.path,
        sha256: a.sha256,
        mime: info?.mime ?? mimeOf(a.path),
        size: info?.size ?? 0,
      };
    }),
    (data) => tx.asset.createMany({ data }),
  );
}

/** Dünya bölümünü satırlardan yeniden kurar (`importWorld`'ün tersi). */
export async function exportWorld(tx: Tx, versionId: string, effects: EffectIndex): Promise<WorldPart> {
  const where = { caseVersionId: versionId };
  const orderBy = { sortOrder: 'asc' as const };
  const [
    sprites,
    characters,
    relationships,
    evidence,
    evidenceRelations,
    discovery,
    scenes,
    sceneAssets,
    objects,
    hotspots,
    sessions,
    stages,
    outcomes,
    assets,
  ] = await Promise.all([
    tx.characterSprite.findMany({ where, orderBy }),
    tx.character.findMany({ where, orderBy }),
    tx.characterRelationship.findMany({ where, orderBy }),
    tx.evidence.findMany({ where, orderBy }),
    tx.evidenceRelationship.findMany({ where, orderBy }),
    tx.evidenceDiscoveryCondition.findMany({ where, orderBy }),
    tx.scene.findMany({ where, orderBy }),
    tx.sceneAsset.findMany({ where, orderBy }),
    tx.sceneObject.findMany({ where, orderBy }),
    tx.sceneHotspot.findMany({ where, orderBy }),
    tx.courtSession.findMany({ where, orderBy }),
    tx.courtStage.findMany({ where, orderBy }),
    tx.courtOutcome.findMany({ where, orderBy }),
    tx.asset.findMany({ where, orderBy }),
  ]);
  const objectsByScene = groupBy(objects, (o) => o.sceneId);
  const hotspotsByObject = groupBy(hotspots, (h) => h.objectId);
  const imageByScene = new Map(sceneAssets.filter((a) => a.role === 'BACKGROUND').map((a) => [a.sceneId, a.assetKey]));
  const stagesBySession = groupBy(stages, (s) => s.sessionId);

  const objectOf = (o: (typeof objects)[number]): SceneObject => {
    const obj: Record<string, unknown> = defined({
      id: o.key,
      name: o.name,
      marker: o.marker,
      shapes: (hotspotsByObject.get(o.id) ?? []).map(shapeOf),
      z: opt(o.z),
      activeWhen: opt(o.activeWhen),
      feedback: o.feedback,
      badge: opt(o.badge),
      inspectNode: opt(o.inspectNodeKey),
      maxUses: opt(o.maxUses),
    });
    restore(obj, 'effects', effects.get(`OBJECT:${o.id}`) ?? [], o.emptyCollections);
    return obj as SceneObject;
  };

  return {
    sprites: sprites.map(
      (s) =>
        defined({
          id: s.key,
          rows: s.rows,
          skin: opt(s.skin),
          noEyes: opt(s.noEyes),
          noMouth: opt(s.noMouth),
        }) as CasePackage['sprites'][number],
    ),
    characters: characters.map(
      (c) =>
        defined({
          id: c.key,
          name: c.name,
          shortLabel: c.shortLabel,
          role: c.role,
          age: opt(c.age),
          occupation: opt(c.occupation),
          bio: opt(c.bio),
          accent: c.accent,
          spriteId: c.spriteKey,
          notes: opt(c.notes),
          initiallyKnown: opt(c.initiallyKnown),
        }) as CasePackage['characters'][number],
    ),
    relationships: relationships.map(
      (r) =>
        defined({
          from: r.fromKey,
          to: r.toKey,
          type: r.type,
          description: r.description,
          hidden: opt(r.hidden),
          revealWhen: opt(r.revealWhen),
        }) as CasePackage['relationships'][number],
    ),
    evidence: evidence.map(
      (e) =>
        defined({
          id: e.key,
          kind: e.kind,
          type: e.type,
          title: e.title,
          shortText: e.shortText,
          description: e.description,
          sourceLabel: e.sourceLabel,
          tagLabel: opt(e.tagLabel),
          icon: e.icon,
          side: opt(e.side),
          strength: opt(e.strength),
          legalValidity: e.legalValidity,
          legalNote: opt(e.legalNote),
          presentable: e.presentable,
          combinable: e.combinable,
          countsInBag: e.countsInBag,
          initiallyKnown: e.initiallyKnown,
          relatedCharacters: opt(e.relatedCharacters),
          relatedEvents: opt(e.relatedEvents),
          tags: opt(e.tags),
          missedHint: opt(e.missedHint),
        }) as CasePackage['evidence'][number],
    ),
    evidenceRelations: evidenceRelations.map(
      (r) => ({ from: r.fromKey, to: r.toKey, type: r.type }) as CasePackage['evidenceRelations'][number],
    ),
    discoveryPaths: discovery.map(
      (d) =>
        defined({
          evidence: d.evidenceKey,
          source: defined({ type: d.sourceType, id: opt(d.sourceKey) }),
          requires: opt(d.requires),
          hint: opt(d.hint),
        }) as CasePackage['discoveryPaths'][number],
    ),
    scenes: scenes.map(
      (s) =>
        defined({
          id: s.key,
          title: s.title,
          description: opt(s.description),
          width: s.width,
          height: s.height,
          image: imageByScene.get(s.id) ?? '',
          touchPadding: opt(s.touchPadding),
          unlockWhen: opt(s.unlockWhen),
          objects: (objectsByScene.get(s.id) ?? []).map(objectOf),
        }) as SceneDef,
    ),
    court: {
      sessions: sessions.map((s) => ({
        id: s.key,
        title: s.title,
        stages: (stagesBySession.get(s.id) ?? []).map((st) => ({
          id: st.key,
          type: st.type,
          entryNode: st.entryNodeKey,
        })),
      })) as CasePackage['court']['sessions'],
    },
    outcomes: outcomes.map(
      (o) =>
        defined({
          id: o.key,
          class: o.class,
          priority: o.priority,
          when: o.when,
          stamp: o.stamp,
          stampTone: o.stampTone,
          header: opt(o.header),
          sentence: o.sentence,
          verdictText: o.verdictText,
          reasoning: o.reasoning,
          legalBasis: o.legalBasis,
          xp: o.xp,
          howToReach: o.howToReach,
          ethicsCard: opt(o.ethicsCard),
        }) as CasePackage['outcomes'][number],
    ),
    assets: assets.map(
      (a) => ({ id: a.key, kind: a.kind, path: a.path, sha256: a.sha256 }) as CasePackage['assets'][number],
    ),
  };
}
