import type { NodeDef, NodeView } from '@mudafaa/case-schema';
import { EngineError } from '../errors.js';
import { getOwn } from '../own.js';
import { objectRect } from '../resolve/hit-test.js';
import { sceneImage } from './common.js';
import type { ViewCtx } from './common.js';

/** Olay yeri araması: yalnızca bulunan nesneler (sınır dikdörtgeniyle); gizli nesne sayısı `exposeCounts` ise. */
export function sceneView(vc: ViewCtx, def: Extract<NodeDef, { type: 'SCENE' }>): NodeView {
  const scene = vc.c.scenes.get(def.scene);
  if (scene === undefined) throw new EngineError('TYPE', `Bilinmeyen sahne: ${def.scene}`);
  return {
    type: 'SCENE',
    id: def.id,
    ...sceneImage(vc, scene),
    instruction: def.instruction,
    found: scene.objects
      .filter((o) => getOwn(vc.s.found, o.id) !== undefined)
      .map((o) => ({
        objectId: o.id,
        rect: objectRect(scene, o),
        label: o.feedback.short,
        ...(o.badge === undefined ? {} : { badge: o.badge }),
      })),
    ...(def.exposeCounts === true ? { hiddenTotal: scene.objects.filter((o) => o.marker === 'HIDDEN').length } : {}),
  };
}
