import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { ara } from './ara.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { evidencePart } from './evidence.js';
import { hearing1 } from './hearing-1.js';
import { invArsiv } from './inv-arsiv.js';
import { invHub } from './inv-hub.js';
import { invInsanlar } from './inv-insanlar.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial } from './trial.js';

// Dava #06 "Son Mesaj" kaynağı. `npm run case:build -- son-mesaj` her anahtarı content/cases/son-mesaj/<anahtar>.json
// olarak yazar. withDiscoveryPaths koşulsuz DISCOVER'ların bulunma yollarını ekler.

export default defineCase(() =>
  withDiscoveryPaths({
    '00-meta': meta,
    '10-cast': cast,
    '20-evidence': evidencePart,
    '30-scenes': scenes,
    '40-briefing': briefing,
    '50-inv-hub': invHub,
    '52-inv-insanlar': invInsanlar,
    '54-inv-arsiv': invArsiv,
    '60-hearing-1': hearing1,
    '65-ara': ara,
    '80-trial': trial,
    '90-outcomes': outcomes,
    '95-report': report,
    '99-tests': tests,
  }),
);
