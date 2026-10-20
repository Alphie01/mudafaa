import { clue, evidence, insight } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 20-evidence: deliller (EVIDENCE), ipuçları (CLUE) ve çıkarımlar (INSIGHT), ilişkiler.
// Bulunma yolları (discoveryPaths) koşulsuz DISCOVER'lar için index.ts'teki `withDiscoveryPaths` ile eklenir;
// koşullu teslimler (`deliver`) kendi parçalarında yazılır. Delil başlığı, bulunmadan önce hiçbir metinde geçmemeli
// (doğrulayıcı LEAK).

export const evidencePart: CasePart = {
  evidence: [
    evidence('ev_iddia', {
      type: 'BELGE',
      title: 'TODO Savcılık delili',
      shortText: 'TODO kısa özet.',
      description: 'TODO açıklama.',
      sourceLabel: 'Soruşturma dosyası',
      icon: 'document',
      side: 'PROSECUTION',
      strength: 'MEDIUM',
      tagLabel: 'SAVCILIK',
      legalValidity: 'EXCLUDABLE',
      legalNote: 'TODO hukuki not (CMK md.).',
      initiallyKnown: true,
    }),
    evidence('ev_tanik_kolluk', {
      type: 'TANIK_IFADESI',
      title: 'TODO Tanığın kolluk ifadesi',
      shortText: 'TODO kısa özet.',
      description: 'TODO açıklama.',
      sourceLabel: 'Kolluk',
      icon: 'document',
      side: 'PROSECUTION',
      tagLabel: 'SAVCILIK',
      initiallyKnown: true,
    }),
    clue('clue_a', {
      type: 'FOTOGRAF',
      title: 'TODO Olay yeri bulgusu A',
      shortText: 'TODO',
      description: 'TODO',
      sourceLabel: 'Olay yeri fotoğrafı',
      icon: 'camera',
      tags: ['kart'],
    }),
    clue('clue_b', {
      type: 'FOTOGRAF',
      title: 'TODO Olay yeri bulgusu B',
      shortText: 'TODO',
      description: 'TODO',
      sourceLabel: 'Olay yeri fotoğrafı',
      icon: 'magnifier',
      tags: ['kart'],
    }),
    clue('clue_c', {
      type: 'BELGE',
      title: 'TODO Belge bulgusu',
      shortText: 'TODO',
      description: 'TODO',
      sourceLabel: 'Emanetteki belge',
      icon: 'uv',
      tags: ['kart'],
    }),
    insight('ded_ab', {
      type: 'BELGE',
      title: 'TODO Çıkarım',
      shortText: 'TODO çıkarımın sonucu.',
      description: 'TODO A ile B birlikte neyi gösteriyor?',
      sourceLabel: 'Çıkarım tahtası',
      icon: 'bulb',
      side: 'DEFENSE',
      strength: 'STRONG',
    }),
    evidence('ev_rapor', {
      type: 'ADLI_RAPOR',
      title: 'TODO Gecikmeli gelen rapor',
      shortText: 'TODO',
      description: 'TODO',
      sourceLabel: 'TODO kurum',
      icon: 'receipt',
      side: 'DEFENSE',
      missedHint: 'TODO: bu raporu dilekçeyle isteyebilirdin.',
    }),
    evidence('ev_yeni', {
      type: 'BELGE',
      title: 'TODO Ters köşe delili',
      shortText: 'TODO',
      description: 'TODO',
      sourceLabel: 'TODO',
      icon: 'key',
      side: 'DEFENSE',
      strength: 'STRONG',
    }),
  ],
  evidenceRelations: [
    { from: 'ded_ab', to: 'clue_a', type: 'DERIVED_FROM' },
    { from: 'ded_ab', to: 'clue_b', type: 'DERIVED_FROM' },
  ],
  discoveryPaths: [],
};
