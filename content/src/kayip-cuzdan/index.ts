import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { ara } from './ara.js';
import { araKisiler } from './ara-kisiler.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { evidencePart } from './evidence.js';
import { hearing1 } from './hearing-1.js';
import { invArchive } from './inv-archive.js';
import { invHub } from './inv-hub.js';
import { invPeople } from './inv-people.js';
import { invPlaces } from './inv-places.js';
import { invTerminal } from './inv-terminal.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial } from './trial.js';

// Dava #01 kaynağı. `npm run case:build -- kayip-cuzdan` her anahtarı content/cases/kayip-cuzdan/<anahtar>.json olarak yazar.
// Parçalar ad sırasıyla birleşir; withDiscoveryPaths koşulsuz DISCOVER'ların bulunma yollarını ekler.

export default defineCase(() =>
  withDiscoveryPaths({
    '00-meta': meta,
    '10-cast': cast,
    '20-evidence': evidencePart,
    '30-scenes': scenes,
    '40-briefing': briefing,
    '50-investigation': invHub,
    '52-investigation-kisiler': invPeople,
    '54-investigation-yerler': invPlaces,
    '56-investigation-arsiv': invArchive,
    '58-investigation-terminal': invTerminal,
    '60-hearing-1': hearing1,
    '70-ara': ara,
    '72-ara-kisiler': araKisiler,
    '80-trial': trial,
    '90-outcomes': outcomes,
    '95-report': report,
    '99-tests': tests,
  }),
);
