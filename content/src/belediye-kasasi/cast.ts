import { character, sharedSprite } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 10-cast: sprite'lar, karakterler ve ilişkiler.
// Ortak sprite'lar content/shared/sprites/*.json'dadır; yeni karakter için `content/shared/sprites/belediye-kasasi-<ad>.json`
// yaz ve `npm run case:sprite-preview -- belediye-kasasi-<ad>` ile bak. Büro kadrosu (Deniz, Leyla) sabittir.

export const cast: CasePart = {
  sprites: [
    sharedSprite('avukat_cubbe'),
    sharedSprite('mentor'),
    sharedSprite('muvekkil'),
    sharedSprite('tanik'),
    sharedSprite('hakim'),
    sharedSprite('uye_hakim'),
    sharedSprite('savci'),
    sharedSprite('mubasir'),
  ],
  characters: [
    character('deniz', {
      name: 'Av. Deniz Arslan',
      shortLabel: 'Deniz',
      role: 'COUNSEL',
      occupation: 'Avukat',
      bio: 'Arslan Hukuk · Bursa.',
      accent: '#2f6dbb',
      spriteId: 'avukat_cubbe',
      initiallyKnown: true,
    }),
    character('leyla', {
      name: 'Av. Leyla Erdem',
      shortLabel: 'Leyla',
      role: 'MENTOR',
      occupation: 'Mentor · büro sahibi',
      accent: '#6a4a9c',
      spriteId: 'mentor',
      initiallyKnown: true,
    }),
    character('muvekkil', {
      name: 'TODO Müvekkil Adı',
      shortLabel: 'TODO',
      role: 'CLIENT',
      age: 30,
      occupation: 'TODO',
      bio: 'TODO kısa özgeçmiş.',
      accent: '#e2802f',
      spriteId: 'muvekkil',
      notes: 'TODO gerçek (oyuncuya gitmez).',
    }),
    character('tanik', {
      name: 'TODO Tanık Adı',
      shortLabel: 'TODO',
      role: 'WITNESS',
      occupation: 'TODO',
      accent: '#3f8a62',
      spriteId: 'tanik',
    }),
    character('baskan', {
      name: 'TODO Başkan',
      shortLabel: 'Başkan',
      role: 'JUDGE',
      accent: '#5c5a66',
      spriteId: 'hakim',
    }),
    character('uye', {
      name: 'TODO Üye Hâkim',
      shortLabel: 'Üye',
      role: 'JUDGE',
      accent: '#5c5a66',
      spriteId: 'uye_hakim',
    }),
    character('savci', {
      name: 'TODO Savcı',
      shortLabel: 'Savcı',
      role: 'PROSECUTOR',
      accent: '#c0392b',
      spriteId: 'savci',
    }),
    character('mubasir', {
      name: 'Mübaşir',
      shortLabel: 'Mübaşir',
      role: 'USHER',
      accent: '#7d8590',
      spriteId: 'mubasir',
    }),
  ],
  relationships: [{ from: 'leyla', to: 'deniz', type: 'MENTOR', description: 'Dosyayı Deniz’e devretti.' }],
};
