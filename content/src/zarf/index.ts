import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { ara } from './ara.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { typography } from './dsl.js';
import { evidencePart } from './evidence.js';
import { hearing1 } from './hearing-1.js';
import { inv1Docs } from './inv1-docs.js';
import { inv1Hub } from './inv1-hub.js';
import { inv1People } from './inv1-people.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial } from './trial.js';

// Dava #12 "Zarf". `npm run case:build -- zarf` her anahtarı `content/cases/zarf/<anahtar>.json` olarak yazar.
// Uzun diyaloglar satır DSL'iyle (dsl.ts) yazılır; tipografi (’ ve “ ”) paketin tamamına en sonda uygulanır.

export default defineCase(() =>
  typography(
    withDiscoveryPaths({
      '00-meta': meta,
      '10-cast': cast,
      '20-evidence': evidencePart,
      '30-scenes': scenes,
      '40-briefing': briefing,
      '50-inv1-hub': inv1Hub,
      '51-inv1-people': inv1People,
      '52-inv1-docs': inv1Docs,
      '60-hearing-1': hearing1,
      '70-ara': ara,
      '80-trial': trial,
      '90-outcomes': outcomes,
      '95-report': report,
      '99-tests': tests,
    }),
  ),
);
