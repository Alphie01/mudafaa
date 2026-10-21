import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { evidencePart } from './evidence.js';
import { hearing1 } from './hearing-1.js';
import { investigation } from './investigation-1.js';
import { ara } from './investigation-2.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial } from './trial.js';

// Dava #10 kaynağı. `npm run case:build -- liman-gecesi` her anahtarı `content/cases/liman-gecesi/<anahtar>.json`
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
    '68-trial-2': trial,
    '70-outcomes': outcomes,
    '80-report': report,
    '90-tests': tests,
  }),
);
