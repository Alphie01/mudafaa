import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { ara } from './ara.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { typography } from './dsl.js';
import { evidencePart } from './evidence.js';
import { hearing1 } from './hearing-1.js';
import { inv1Ev } from './inv1-ev.js';
import { inv1Hub } from './inv1-hub.js';
import { inv1Saha } from './inv1-saha.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial } from './trial.js';

// Dava #02 "Çevrimiçi Tuzak". `npm run case:build -- cevrimici-tuzak` her anahtarı
// `content/cases/cevrimici-tuzak/<anahtar>.json` olarak yazar. Uzun diyaloglar satır DSL'iyle (dsl.ts) yazılır;
// tipografi (’ ve “ ”) paketin tamamına en sonda uygulanır.

export default defineCase(() =>
  typography(
    withDiscoveryPaths({
      '00-meta': meta,
      '10-cast': cast,
      '20-evidence': evidencePart,
      '30-scenes': scenes,
      '40-briefing': briefing,
      '50-inv1-hub': inv1Hub,
      '51-inv1-ev': inv1Ev,
      '52-inv1-saha': inv1Saha,
      '60-hearing-1': hearing1,
      '70-ara': ara,
      '80-trial': trial,
      '90-outcomes': outcomes,
      '95-report': report,
      '99-tests': tests,
    }),
  ),
);
