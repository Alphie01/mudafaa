import type { NodeDef, NodeView } from '@mudafaa/case-schema';
import { getOwn } from '../own.js';
import { objectRect } from '../resolve/hit-test.js';
import { activeObject, addCast, sceneImage, visibleChoice } from './common.js';
import type { ViewCtx } from './common.js';

/** Soruşturma hub'ı: sekmeler yalnızca görünür seçenekleri; sahne önizlemesi görünür ya da bulunmuş nesneleri taşır. */
export function investigationView(vc: ViewCtx, def: Extract<NodeDef, { type: 'INVESTIGATION' }>): NodeView {
  const scene = def.scenePreview === undefined ? undefined : vc.c.scenes.get(def.scenePreview.scene);
  const scenePreview =
    scene === undefined
      ? undefined
      : {
          ...sceneImage(vc, scene),
          markers: scene.objects.flatMap((o) => {
            const found = getOwn(vc.s.found, o.id) !== undefined;
            if (!found && !(o.marker === 'VISIBLE' && activeObject(vc, o))) return [];
            return [
              {
                id: o.id,
                label: found ? o.feedback.short : o.name,
                rect: objectRect(scene, o),
                state: found ? ('EXAMINED' as const) : ('UNEXAMINED' as const),
              },
            ];
          }),
        };
  const qt = def.quickTalk;
  if (qt !== undefined) addCast(vc, qt.character);
  return {
    type: 'INVESTIGATION',
    id: def.id,
    tabs: def.tabs.map((t) => ({
      id: t.id,
      label: t.label,
      kind: t.kind,
      choiceIds: t.choices.filter((id) => visibleChoice(vc, id)),
    })),
    ...(scenePreview === undefined ? {} : { scenePreview }),
    ...(qt === undefined
      ? {}
      : {
          quickTalk: {
            characterKey: qt.character,
            line: qt.line,
            choiceIds: qt.choices.filter((id) => visibleChoice(vc, id)),
          },
        }),
  };
}
