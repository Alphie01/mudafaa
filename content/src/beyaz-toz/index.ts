import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { evidencePart } from './evidence.js';
import { withExitGates } from './gates.js';
import { hearing1 } from './hearing-1.js';
import { inv1Docs } from './inv1-docs.js';
import { inv1Kaan } from './inv1-kaan.js';
import { inv1People } from './inv1-people.js';
import { inv1Scenes } from './inv1-scenes.js';
import { investigation1 } from './investigation-1.js';
import { investigation2 } from './investigation-2.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial } from './trial.js';

// Dava #04 “Beyaz Toz” kaynağı. `npm run case:build -- beyaz-toz` her anahtarı `content/cases/beyaz-toz/<anahtar>.json`
// olarak yazar; parçalar ad sırasıyla birleşir. `withExitGates` ziyaret ve çapraz sorgu çıkışlarına kapı koyar (gates.ts);
// `withDiscoveryPaths` koşulsuz DISCOVER'ların bulunma yollarını ekler.

export default defineCase(() =>
  withDiscoveryPaths(
    withExitGates({
      '00-meta': meta,
      '10-cast': cast,
      '20-evidence': evidencePart,
      '30-scenes': scenes,
      '40-briefing': briefing,
      '50-investigation-hub': investigation1,
      '51-investigation-sahne': inv1Scenes,
      '52-investigation-kaan': inv1Kaan,
      '53-investigation-kisiler': inv1People,
      '54-investigation-belge': inv1Docs,
      '60-hearing-1': hearing1,
      '70-investigation-2': investigation2,
      '80-trial': trial,
      '90-outcomes': outcomes,
      '95-report': report,
      '99-tests': tests,
    }),
  ),
);
