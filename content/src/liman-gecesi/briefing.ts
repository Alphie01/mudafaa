import { L, N, cont, meet, option, set, says, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { BRIEF, p1 } from './shared.js';

// 40-briefing: soğuk açılış (prolog), mentorun dosyayı devretmesi, ceza aralığı sorusu, dosya ekranı ve strateji
// seçimi (~8–12 dk, ~1 500–2 500 sözcük). Hikâye kitabındaki (docs/content/liman-gecesi.md §2–3) sahneler buraya dökülür.

export const briefing: CasePart = {
  nodes: [
    story('PROLOG', {
      ...BRIEF,
      title: 'TODO Soğuk açılış',
      // Prolog: olay gecesinden bir an; karakterlerin kendi sesleri, madde atfı yok. 300–800 sözcük, birkaç blok.
      lines: says(
        N('TODO Olay gecesi. Mekânın ve havanın kısa tasviri.'),
        L('tanik', 'TODO tanığın kendi ağzından ilk replik.'),
        L('muvekkil', 'TODO müvekkilin o anki sözü; sonradan anlam kazanacak bir ayrıntı.', 'saskin'),
        N('TODO Sahneyi bir soruyla kapat: o gece gerçekte ne oldu?'),
      ),
      choices: [cont('PROLOG_DEVAM', 'Devam', 'BR_01', { role: 'PRIMARY' })],
    }),
    story('BR_01', {
      ...BRIEF,
      title: 'Dosya devri',
      onFirstEnter: [meet('leyla'), meet('deniz')],
      lines: says(
        L('leyla', 'Deniz, TODO dosyası artık senin. UYAP’tan dosyanın tamamını indirdim.'),
        L('leyla', 'TODO olayın iki cümlelik özeti.'),
        L('leyla', 'Dosyayı açmadan önce bir soru: iddianamedeki suçun olası ceza aralığı nedir?'),
      ),
      choices: [
        option('BR01_A', 'TODO doğru madde ve aralık', {
          score: { HUKUKI_BILGI: 50 },
          good: 'TODO doğru cevabın gerekçesi (madde ve hesap).',
          responses: says(L('leyla', 'Doğru. TODO kısa açıklama.', 'mutlu')),
          next: 'BR_02',
        }),
        option('BR01_B', 'TODO yanlış madde', {
          bad: 'TODO bu madde neden uymuyor.',
          category: 'HUKUKI_BILGI',
          responses: says(L('leyla', 'Hayır. TODO doğrusu.')),
          next: 'BR_02',
        }),
        option('BR01_C', 'TODO yanlış aralık', {
          bad: 'TODO bu aralık neden yanlış.',
          category: 'HUKUKI_BILGI',
          responses: says(L('leyla', 'Hayır. TODO doğrusu.')),
          next: 'BR_02',
        }),
      ],
    }),
    story('BR_02', {
      ...BRIEF,
      phase: 'BRIEFING',
      title: 'TODO Dava başlığı',
      onFirstEnter: [meet('muvekkil')],
      blocks: [
        {
          type: 'profileCard',
          character: 'muvekkil',
          label: 'MÜVEKKİL',
          lines: ['TODO Ad Soyad, yaş', 'TODO meslek · sabıka'],
          charge: 'TODO suç (TCK md.)',
          demand: 'İddianame: TODO',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'gold', 'gold', 'red', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 60,
          labels: ['Beraat', 'TODO', 'TODO', 'TODO'],
          demandLabel: 'İSTEM: TODO',
        },
        { type: 'paragraph', title: 'OLAY ÖZETİ', text: 'TODO olay özeti.' },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'TODO delil 1', strength: 'STRONG' },
            { label: 'TODO delil 2', strength: 'MEDIUM' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: beraat hedeflenir; stratejine uyan esas savunma ×1,5 puan.',
            STR_USUL: 'Usul hatası: hukuka aykırı delilleri dışlatırsın; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli savunma: önce beraat, aksi hâlde lehe hükümler; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          next: 'INV1_HUB',
        }),
        option('STR_USUL', 'Usul hatası', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120), ...p1.start()],
          next: 'INV1_HUB',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          next: 'INV1_HUB',
        }),
      ],
    }),
  ],
};
