import { defineCase, withDiscoveryPaths } from '../../../tools/content/src/kit/index.js';
import { briefing } from './briefing.js';
import { cast } from './cast.js';
import { evidencePart } from './evidence.js';
import { hearing1 } from './hearing-1.js';
import { investigation1 } from './investigation-1.js';
import { investigation2 } from './investigation-2.js';
import { meta } from './meta.js';
import { outcomes } from './outcomes.js';
import { report } from './report.js';
import { scenes } from './scenes.js';
import { tests } from './tests.js';
import { trial } from './trial.js';

// Dava #13 kaynağı. `npm run case:build -- silinen-dosyalar` bu fonksiyonu çalıştırır ve her anahtarı
// `content/cases/silinen-dosyalar/<anahtar>.json` olarak yazar. Anahtarlar iki basamaklı önekle sıralanır; parçalar bu sırayla
// birleştirilir (diziler uç uca eklenir). `withDiscoveryPaths`, koşulsuz DISCOVER'ların bulunma yollarını ekler.

export default defineCase(() =>
  withDiscoveryPaths({
    '00-meta': meta,
    '10-cast': cast,
    '20-evidence': evidencePart,
    '30-scenes': scenes,
    '40-briefing': briefing,
    '50-investigation-1': investigation1,
    '60-hearing-1': hearing1,
    '70-investigation-2': investigation2,
    '80-trial': trial,
    '90-outcomes': outcomes,
    '95-report': report,
    '99-tests': tests,
  }),
);
