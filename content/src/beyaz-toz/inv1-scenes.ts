import { fallback, rawChoice, sceneSearch, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import type { NodeDef } from '@mudafaa/case-schema';
import { INV1, card, me, n, th, voice } from './shared.js';

// 51-investigation-sahne: üç olay yeri araması (arka oda, ön oda + koridor, bina girişi).

const miss = (id: string) =>
  fallback(id, 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  });

/** Bina aramasının bitişi merdiven sahnesine gider (oradan hub'a dönülür). */
const toMerdiven = <T extends NodeDef>(node: T): T => ({
  ...node,
  choices: node.choices.map((c) => (c.id === 'BINA_BITIR' ? { ...c, next: 'INV_MERDIVEN' } : c)),
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
            n('Kare 14: oda kapısı, kapalı. Kare 15: kapı, aralık. Kare 16 yok; numara atlanmış. Kare 17: odanın içi, flaşın beyaz yaraları duvarlarda.'),
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
            n('Ön odanın duvarında bir takvim; ekim sayfasında açık kalmış. Perşembeler kırmızı kalemle yuvarlak içine alınmış. Kasım sayfasına hiç geçilmemiş.'),
          ],
        },
      ],
      scene: 'sc_on',
      instruction: 'Fotoğrafta şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps_o',
      miss: miss('FB_ON'),
      finish: { id: 'ON_BITIR' },
    }),
    toMerdiven(sceneSearch('INV_BINA', {
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
    })),
    story('INV_MERDIVEN', {
      ...INV1,
      title: 'Merdiven boşluğu',
      background: 'sokak_karanlik',
      lines: [
        {
          lines: [
            card('IHLAMUR SOKAK 14 — MERDİVEN BOŞLUĞU', 'sokak_karanlik'),
            n('Merdiven ışığının otomatiği on beş saniye yanıyordu. Dördüncü kata on beş saniyede çıkılmıyordu; ikinci katta karanlık beni yakaladı.'),
            n('Karanlıkta bir kapı aralandı. Kapı zinciri, bir göz, bir öğrenci kulaklığından taşan müzik.'),
            voice('KOMŞU KIZ', 'Avukat mısınız? Yedi numaranın? … Ben altıdayım. Bir şey diyeceğim ama adımı yazmayın.', 'whisper'),
            voice('KOMŞU KIZ', 'O sabah keski sesiyle uyandım. Metal metale. Sonra biri “anahtarı ver” dedi, biri “yok bende” dedi. Sonra yine keski.', 'whisper'),
            voice('KOMŞU KIZ', 'Bir şey daha. Arka odadaki çocuk, kurye olan, gece hep merdivende telefonla konuşurdu. Fısıltıyla. Ben kulaklık takardım; duymak istemezdim.', 'whisper'),
            me('Bunu mahkemede anlatır mısınız?'),
            voice('KOMŞU KIZ', 'Hayır. Burslu okuyorum. Babam duyarsa beni eve geri alır. Size söyledim, o kadar. Kusura bakmayın.', 'whisper'),
            n('Kapı kapandı. Zincir şıkırdadı. Merdiven ışığına yeniden bastım; on beş saniye.'),
            th('“Anahtarı ver.” “Yok bende.” Bir tanık değil; bir kapının arkasından gelen bir cümle. Mahkemeye taşıyamam. Ama artık ne arayacağımı biliyorum: o cümleyi söyleyen polisin kendi ağzını.'),
          ],
        },
      ],
      choices: [
        rawChoice('CONTINUE', 'MERDIVEN_BITIR', 'Binadan çık', { role: 'BACK', next: '$return' }),
      ],
    }),
  ],
};
