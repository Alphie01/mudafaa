import { fallback, sceneSearch } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { INV1, card, n, th } from './shared.js';

// 51-investigation-sahne: üç olay yeri araması (arka oda, ön oda + koridor, bina girişi).

const miss = (id: string) =>
  fallback(id, 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  });

export const inv1Scenes: CasePart = {
  nodes: [
    sceneSearch('INV_ARKA', {
      ...INV1,
      title: 'Arka oda · olay yeri fotoğrafları',
      hud: ['taps_a'],
      exposeCounts: true,
      background: 'buro',
      lines: [
        {
          lines: [
            card('ADLİYE · SAVCILIK DOSYASI — FOTOĞRAF ALBÜMÜ, 1. BÖLÜM', 'adliye'),
            n('Kırk iki fotoğraf. Flaşla çekilmiş, köşeleri numaralı. Kâğıt üzerinde bir oda, kâğıttan daha soğuk.'),
            th('Polis bu fotoğrafları kendi tutanağını desteklemek için çekti. Bir fotoğraf ise kimseyi desteklemez; sadece gösterir.'),
          ],
        },
      ],
      scene: 'sc_arka',
      instruction: 'Fotoğrafta şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps_a',
      miss: miss('FB_ARKA'),
      finish: { id: 'ARKA_BITIR' },
    }),
    sceneSearch('INV_ON', {
      ...INV1,
      title: 'Ön oda ve koridor · olay yeri fotoğrafları',
      hud: ['taps_o'],
      exposeCounts: true,
      background: 'buro',
      lines: [
        {
          lines: [
            card('ADLİYE · SAVCILIK DOSYASI — FOTOĞRAF ALBÜMÜ, 2. BÖLÜM', 'adliye'),
            n('Ön oda, giriş, koridor. Bir öğrenci odası: kitap, gözlük, telefon şarjı. Bir de bir ayakkabılık, iki farklı hayatın ayakkabılarıyla.'),
            th('Savcının dosyasında bu fotoğraflar “genel görünüm” diye geçiyor. Genel görünüm, ayrıntının mezarlığıdır.'),
          ],
        },
      ],
      scene: 'sc_on',
      instruction: 'Fotoğrafta şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps_o',
      miss: miss('FB_ON'),
      finish: { id: 'ON_BITIR' },
    }),
    sceneSearch('INV_BINA', {
      ...INV1,
      title: 'Ihlamur Sokak 14 · bina girişi',
      hud: ['taps_b'],
      exposeCounts: true,
      background: 'sokak_sabah',
      lines: [
        {
          lines: [
            card('IHLAMUR SOKAK 14 — BİNA GİRİŞİ, 10.40', 'sokak_sabah'),
            n('Yağmur dinmişti ama saçaklar hâlâ damlıyordu. Bina kapısının camında bir öğrenci evinin kiralık ilanı, yarısı yırtılmış.'),
            n('Dairenin anahtarı Defne’deydi; ama arka odanın kapısı artık mühürlü değildi, boştu. Ben ortak alanlara baktım: kapı, posta kutuları, köşe.'),
            th('Bir binanın girişi, sakinlerinin özgeçmişidir. Kim geliyor, kim gidiyor, kim adını nereye yazıyor.'),
            n('Zemin kattaki pencerede perde bir kez daha aralandı. Bu sefer kapanmadı.'),
          ],
        },
      ],
      scene: 'sc_bina',
      instruction: 'Girişte şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps_b',
      miss: miss('FB_BINA'),
      finish: { id: 'BINA_BITIR', label: 'Girişten ayrıl' },
    }),
  ],
};
