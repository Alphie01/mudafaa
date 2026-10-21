import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { ara } from './ara.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { evidencePart } from './evidence.js';
import { hearing1 } from './hearing-1.js';
import { invDocs } from './inv-docs.js';
import { investigation } from './inv-hub.js';
import { invPeople } from './inv-people.js';
import { invPlaces } from './inv-places.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial } from './trial.js';

// Dava #11 kaynağı. `npm run case:build -- belediye-kasasi` her anahtarı `content/cases/belediye-kasasi/<anahtar>.json`
// olarak yazar; parçalar ad sırasıyla birleşir. `withDiscoveryPaths` koşulsuz DISCOVER'ların bulunma yollarını ekler.

export default defineCase(() =>
  withDiscoveryPaths({
    '00-meta': meta,
    '10-cast': cast,
    '20-evidence': evidencePart,
    '30-scenes': scenes,
    '40-briefing': briefing,
    '50-investigation': investigation,
    '52-investigation-kisiler': invPeople,
    '54-investigation-yerler': invPlaces,
    '56-investigation-arsiv': invDocs,
    '60-hearing-1': hearing1,
    '70-ara': ara,
    '80-trial': trial,
    '90-outcomes': outcomes,
    '95-report': report,
    '99-tests': tests,
  }),
);
