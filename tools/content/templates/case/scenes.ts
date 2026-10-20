import { rect, sceneAsset, sceneDef, sceneObject } from '__KIT__';
import type { CasePart } from '__KIT__';

// 30-scenes: olay yeri sahneleri ve görselleri. Görsel `scenes/<ad>.html`'den `npm run case:scenes -- __SLUG__` ile
// üretilir; `#scene` boyutu SceneDef'in width × height'ı ile aynı olmalı. Şekil sabitleri golden path'te
// `step.tapCenter(…)` için dışa aktarılır.

export const OB_A = rect(40, 150, 60, 50);
export const OB_B = rect(230, 60, 60, 60);

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_olay', {
      title: 'TODO Olay yeri · fotoğraflar',
      description: 'TODO',
      width: 344,
      height: 300,
      image: 'img_olay',
      objects: [
        sceneObject('ob_a', 'TODO nesne A', OB_A, {
          discovers: 'clue_a',
          score: { ARASTIRMA: 40 },
          text: 'TODO bulunca gösterilen metin.',
          short: 'TODO kısa etiket A',
        }),
        sceneObject('ob_b', 'TODO nesne B', OB_B, {
          discovers: 'clue_b',
          score: { ARASTIRMA: 60 },
          text: 'TODO bulunca gösterilen metin.',
          short: 'TODO kısa etiket B',
        }),
      ],
    }),
  ],
  assets: [sceneAsset('img_olay', 'olay-yeri')],
};
