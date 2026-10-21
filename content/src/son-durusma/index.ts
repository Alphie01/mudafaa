import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { ara } from './ara.js';
import { ara2 } from './ara2.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { evidencePart } from './evidence.js';
import { hearing1 } from './hearing-1.js';
import { investigation } from './investigation.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial2 } from './trial-2.js';
import { trial3 } from './trial-3.js';

// Dava #15 kaynağı. `npm run case:build -- son-durusma` her anahtarı `content/cases/son-durusma/<anahtar>.json`
// olarak yazar; parçalar ad sırasıyla birleşir. `withDiscoveryPaths` koşulsuz DISCOVER'ların bulunma yollarını ekler.

export default defineCase(() =>
  withDiscoveryPaths({
    '00-meta': meta,
    '10-cast': cast,
    '20-evidence': evidencePart,
    '30-scenes': scenes,
    '40-briefing': briefing,
    '50-investigation': investigation,
    '60-trial': hearing1,
    '65-ara': ara,
    '68-trial-2': trial2,
    '70-ara-2': ara2,
    '75-trial-3': trial3,
    '80-outcomes': outcomes,
    '85-report': report,
    '90-tests': tests,
  }),
);
