import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { ara } from './ara.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { evidencePart } from './evidence.js';
import { hearing1 } from './hearing-1.js';
import { invHub } from './inv-hub.js';
import { invPeople } from './inv-people.js';
import { invWork } from './inv-work.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial } from './trial.js';

// Dava #03 "Kırmızı Işık" kaynağı. `npm run case:build -- kirmizi-isik` her anahtarı
// `content/cases/kirmizi-isik/<anahtar>.json` olarak yazar.

export default defineCase(() =>
  withDiscoveryPaths({
    '00-meta': meta,
    '10-cast': cast,
    '20-evidence': evidencePart,
    '30-scenes': scenes,
    '40-briefing': briefing,
    '50-investigation-hub': invHub,
    '52-investigation-work': invWork,
    '54-investigation-people': invPeople,
    '60-hearing-1': hearing1,
    '65-ara': ara,
    '70-trial': trial,
    '90-outcomes': outcomes,
    '95-report': report,
    '99-tests': tests,
  }),
);
