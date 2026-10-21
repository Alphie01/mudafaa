import { cont, decisionNode, fallback, meet, sceneSearch } from '../../../tools/content/src/kit/index.js';
import { B } from './dsl.js';
import { INV } from './shared.js';

// 50-investigation (yerler): olay yeri fotoğrafları (ofis), Toker Balık mutfağı, Yalçınların evi.

export const ofis = sceneSearch('INV_OFIS', {
  ...INV,
  title: 'Ofis · olay yeri fotoğrafları',
  hud: ['taps'],
  exposeCounts: true,
  scene: 'sc_ofis',
  background: 'buro_gece',
  instruction: 'Fotoğrafta şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps',
  lines: B(`
# BÜRO — OLAY YERİ ALBÜMÜ [bg:buro_gece]
> Kırk altı kare. Flaşla çekilmiş, beyaz patlayan duvarlar, kenarları karanlıkta kaybolan bir oda. Bir halı, bir masa, bir adam.
~ Olay yeri fotoğrafı bir gecenin en dürüst tanığıdır. Kimseye bir şey anlatmaz; yalnızca gösterir. Göstermediği yere de bakmak gerekir.
> Albümün başında ekip amirinin el yazısı: “Olay yeri: ofis. Şüpheli kaçmış. Kayıt cihazı çalışmıyor.” Üç cümle; üçü de birer sonuç.
`),
  miss: fallback('FB_OFIS', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'OFIS_BITIR', label: 'Albümü kapat' },
});

export const mutfakGiris = decisionNode('INV_MUTFAK_G', [{ to: 'INV_MUTFAK' }], {
  ...INV,
  title: 'Toker Balık',
  lines: B(`
# ÇARŞAMBA 16.20 — TOKER BALIK, MUDANYA [bg:kafe]
> Meyhane üç aydır yarım kapasite çalışıyormuş. Salonda masa örtüleri serilmiş, kadehler ters. Neonun I’sı hâlâ yanmıyor.
> Mutfaktan kızgın yağ, limon, buz kokusu. Elli yaşlarında, göbekli, beyaz önlüklü bir adam bir çırağa bağırıyordu.
nuri: O levrek öyle temizlenmez evladım! Pul pul olacak, pul pul! Kim öğretti sana bunu? Ben mi öğrettim? Ben öğretmedim!
> Beni görünce bağırmayı kesti; kaşlarını çattı.
nuri: Avukat. Emir’in avukatı. Gir bakalım. Elini hiçbir şeye sürme; benim mutfağım burası.
~ Bir mutfak bir şehir gibidir: herkesin yeri, herkesin saati, herkesin bir yolu. O gece bu şehirde biri yolunu değiştirdi.
`),
});

export const mutfak = sceneSearch('INV_MUTFAK', {
  ...INV,
  title: 'Toker Balık · mutfak',
  hud: ['taps2'],
  exposeCounts: true,
  scene: 'sc_mutfak',
  background: 'kafe',
  instruction: 'Mutfakta dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps2',
  miss: fallback('FB_MUTFAK', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Sıradan bir köşe; şef sana kaşlarını çattı. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  choices: [cont('MUTFAK_NURI', 'Şefle konuş', 'INV_NURI', { role: 'PRIMARY' })],
  finish: { id: 'MUTFAK_BITIR', label: 'Mutfaktan çık' },
});

export const evGiris = decisionNode('INV_EV_G', [{ to: 'INV_EV' }], {
  ...INV,
  title: 'Yalçınların evi',
  onFirstEnter: [meet('meral')],
  lines: B(`
# PERŞEMBE 11.00 — HAMİTLER [bg:ev]
> Üçüncü kat. Merdiven boşluğunda bir dikiş makinesinin tıkırtısı; kapıya yaklaştıkça yavaşladı, durdu.
> Kapıyı Meral açtı. Kırk yaşlarında, kısa saçlı, boynunda bir mezura. Ağzında iki toplu iğne; çıkardı, yakasına taktı.
meral: Gelin. Kemal uyuyor; gece vardiyasından geldi. Uyandırmayalım. Uyandığında da konuşmaz zaten.
> İki oda bir salon. Salonun yarısı atölye: bir dikiş makinesi, bir manken, yarım bir gelinlik. Duvarda bir saat, bir takvim, bir aile fotoğrafı.
meral: O gece bir buçukta geldi. Mutfağa girdi, su içti. Ağlıyordu. “Ne oldu” dedim; “Anne, babam suçsuzmuş” dedi. Sonra yattı.
meral: Bir saat sonra kapı çalındı. Polis. “Anneler hep evdeydi der” dediler bana. Ben evdeydi demedim ki; bir buçukta geldi dedim.
- Emir’in odasına bakabilir miyim?
meral: Bakın. Kimse bakmadı. Polis bile. Kapıdan aldılar, gittiler.
~ Bir annenin sözü yalan değildir; ama mahkemede tek başına bir saat de değildir. Saatin kendisi bu evde bir yerde duruyor olmalı.
`),
});

export const ev = sceneSearch('INV_EV', {
  ...INV,
  title: 'Emir’in odası',
  hud: ['taps3'],
  exposeCounts: true,
  scene: 'sc_ev',
  background: 'ev',
  instruction: 'Odada dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps3',
  miss: fallback('FB_EV', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Bir gencin odasının sıradan bir köşesi. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'EV_BITIR', label: 'Evden ayrıl' },
});
