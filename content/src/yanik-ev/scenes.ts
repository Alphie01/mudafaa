import { rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: olay yeri sahneleri ve görselleri. Görsel `scenes/<ad>.html`'den `npm run case:scenes -- yanik-ev` ile
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
