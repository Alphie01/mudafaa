import { cont, fallback, has, meet, rawChoice, sceneSearch, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import type { NodeDef } from '@mudafaa/case-schema';
import { INV1, card, me, n, named, s, th } from './shared.js';

// 51-inv-yerler: üç olay yeri araması (yanık ev, 04.30 albümü, atölye) ve çıkış sahneleri.

const miss = (id: string) =>
  fallback(id, 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  });

/** Aramanın bitişini bir çıkış sahnesine yönlendirir (oradan hub'a `$return`). */
const finishTo = <T extends NodeDef>(node: T, finishId: string, to: string): T => ({
  ...node,
  choices: node.choices.map((c) => (c.id === finishId ? { ...c, next: to } : c)),
});

const out = (id: string, label: string) => rawChoice('CONTINUE', id, label, { role: 'BACK', next: '$return' });

export const invPlaces: CasePart = {
  nodes: [
    finishTo(
      sceneSearch('INV_EV', {
        ...INV1,
        title: 'Kalem Sokak 9 · yanık ev',
        hud: ['taps_ev'],
        exposeCounts: true,
        background: 'sokak_sabah',
        lines: [
          {
            lines: [
              card('KALEM SOKAK 9 — YANIK EV, 10.20', 'sokak_sabah'),
              n(
                'Kapı yoktu; menteşeleri vardı. Eşikten adım atınca ayakkabılarımın altında kül ve cam çıtırdadı. Üç ay geçmişti; koku geçmemişti.',
              ),
              n(
                'Ev, yarısı gökyüzüne açık bir kutu gibiydi. Tavanın olduğu yerden gri bir ışık iniyor, kararmış duvarlarda yağmur izleri çiziyordu.',
              ),
              th(
                'Yangın bir hikâye yazar ve sonra kendi yazısının üstünü karalar. Benim işim karalamanın altındaki ilk cümleyi bulmak: nerede başladı?',
              ),
              th('Bilirkişi “salon” diyor. Önce salona değil, en çok yanan yere bakacağım.'),
            ],
          },
        ],
        scene: 'sc_ev',
        instruction: 'Evde şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
        costVar: 'taps_ev',
        miss: miss('FB_EV'),
        finish: { id: 'EV_BITIR', label: 'Evden çık' },
      }),
      'EV_BITIR',
      'INV_EV_SON',
    ),
    story('INV_EV_SON', {
      ...INV1,
      title: 'Kalem Sokak',
      background: 'sokak_sabah',
      lines: [
        {
          when: has('clue_moloz'),
          lines: [
            n(
              'Çıkarken salonun köşesindeki yığına bir kez daha baktım. Düzgün, sıkıştırılmış, kürek izli. Yangın bir şeyi böyle istiflemez. Bir el istifler.',
            ),
            th('Kimin eli? İtfaiyeci mi, polis mi, bilirkişi mi, bir başkası mı? Fotoğraflar söyler. En eskisi önce.'),
            n('Kaldırımda, karşı evin penceresinde perde yine aralanmıştı. Bu sefer içeriden bir el bana gel işareti yaptı, sonra vazgeçti.'),
          ],
        },
        {
          lines: [
            n('Kaldırıma çıktığımda ellerim kül olmuştu. Mendille sildim; kül mendile geçti, gitmedi.'),
            th('Bir yangın yerinde her şey aynı renktir. Önemli olanı önemsizden ayırmak için önce kendi gözünü temizlemen gerekir.'),
            n('Karşı evin penceresinde perde aralandı ve kapandı.'),
          ],
        },
      ],
      choices: [out('EVSON_BITIR', 'Büroya dön')],
    }),
    sceneSearch('INV_FOTO', {
      ...INV1,
      title: 'Olay yeri albümü · 04.30',
      hud: ['taps_foto'],
      exposeCounts: true,
      background: 'adliye',
      lines: [
        {
          lines: [
            card('ADLİYE · SAVCILIK DOSYASI — OLAY YERİ ALBÜMÜ', 'adliye'),
            n(
              'Otuz sekiz kare. Saat damgası 04.30–04.52. Flaşın beyaz yaraları, itfaiyecilerin sarı şeritli sırtları, buhar, su, kömür.',
            ),
            th('En eski fotoğraf, en az dokunulmuş olandır. Bu kareler, evin henüz kimsenin hikâyesi olmadığı anı gösteriyor.'),
            n('Dört kare masanın üstünde yan yana. Salon, koridor, su, sokak.'),
          ],
        },
      ],
      scene: 'sc_foto',
      instruction: 'Fotoğraflarda şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps_foto',
      miss: miss('FB_FOTO'),
      finish: { id: 'FOTO_BITIR', label: 'Albümü kapat' },
    }),
    story('INV_ATOLYE_G', {
      ...INV1,
      title: 'Atölye',
      background: 'depo',
      onFirstEnter: [meet('zehra')],
      lines: [
        {
          lines: [
            card('YILDIRIM, ESKİ SANAYİ — BOZKURT DÖŞEME, 16.40', 'depo'),
            n(
              'Eski sanayi bir labirentti: kaportacılar, torna atölyeleri, bir kebapçı, bir kahve. Kepenkler yarı inikti; çamurlu sokakta bir köpek bir lastiği kemiriyordu.',
            ),
            n('Zehra kapının önünde bekliyordu, elinde bir anahtarlık. Nöbetten çıkmış, formasının üstüne babasının eski montunu giymişti.'),
            s('zehra', 'İki aydır buraya girmedim. Polis girmedi bile. Kimse “atölyeye bakalım” demedi.'),
            named(
              'ATÖLYE BEKÇİSİ',
              'Halil Abi’nin avukatı mısınız? O gece buradaydı abla. Işığı sabaha kadar yandı. Sabah beşte ben çay götürdüm, makinenin başındaydı.',
            ),
            named('ATÖLYE BEKÇİSİ', 'Polis bana hiç sormadı. Ben de kimseye söylemedim; soran olmadı ki.'),
            th('Bir tanık daha; ama mahkemenin göremeyeceği bir tanık değil. Sadece kimsenin sormadığı bir tanık.'),
            n('Kilit gıcırdadı. İçeriden kumaş, tutkal ve soğuk makine yağı kokusu taştı.'),
          ],
        },
      ],
      choices: [cont('ATOLYE_GIR', 'İçeri gir', 'INV_ATOLYE', { role: 'PRIMARY' })],
    }),
    finishTo(
      sceneSearch('INV_ATOLYE', {
        ...INV1,
        title: 'Bozkurt Döşeme · atölye',
        hud: ['taps_atolye'],
        exposeCounts: true,
        background: 'depo',
        lines: [
          {
            lines: [
              n(
                'Yarım kalmış otel sandalyeleri bir koro gibi dizilmişti; hepsinin oturağı açık, yayları görünür. Duvarda makaslar, ölçü cetvelleri, bir çerçevesiz fotoğraf.',
              ),
              th('Savcıya göre Halil o gece evini yakıyordu. Bu odaya göre bir otelin kırk sandalyesini kaplıyordu. Hangisi daha çok iz bırakmış?'),
            ],
          },
        ],
        scene: 'sc_atolye',
        instruction: 'Atölyede dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
        costVar: 'taps_atolye',
        miss: miss('FB_ATOLYE'),
        finish: { id: 'ATOLYE_BITIR', label: 'Atölyeden çık' },
      }),
      'ATOLYE_BITIR',
      'INV_ATOLYE_SON',
    ),
    story('INV_ATOLYE_SON', {
      ...INV1,
      title: 'Atölye',
      background: 'depo',
      lines: [
        {
          when: has('clue_esyalar'),
          lines: [
            n(
              'Zehra çeyiz sandığının örtüsünü kaldırdı. Ceviz, el oyması bir lale motifi, pirinç bir kilit. Parmaklarını kapağın üstünde gezdirdi; açmadı.',
            ),
            s('zehra', 'Annemin sandığı. Babam bunu kurtarmış.', 'uzgun'),
            s('zehra', 'Savcı “değerli eşyalarını önceden çıkarmış” diyor. Bu sandık bir kuruş etmez. Kimse almaz bunu. Sadece biz…'),
            me('Etiketi okudun mu? “Restorasyon bitince geri.”'),
            s('zehra', 'Geri. Geri götürecekmiş. Neyin içine?', 'uzgun'),
            th('Bir kundakçı neyi kurtarır? Parayı. Bir dul neyi kurtarır? Sandığı. Bu ayrım mahkemede bir delil değil. Ama benim için bir pusula.'),
          ],
        },
        {
          lines: [
            n('Zehra kapıyı kilitlerken bir an durdu, anahtarı bana uzattı.'),
            s('zehra', 'Siz tutun. Ben buraya bir daha tek başıma gelemem.'),
            th('Bir anahtar daha. Bu dosyada herkes bana bir şey emanet ediyor. Kimse bir şey açıklamıyor.'),
          ],
        },
      ],
      choices: [out('ATOLYESON_BITIR', 'Büroya dön')],
    }),
  ],
};
