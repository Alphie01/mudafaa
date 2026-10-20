import { documentExam, examine, fallback, raise, row, tool } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { INV1, card, n, s, th } from './shared.js';

// 54-investigation-belge: beş belge incelemesi. Alet + satır = ipucu. Yanlış alet ya da boş satır −20.

const lupe = tool('lupe', 'Büyüteç', 'magnifier');
const kars = tool('kars', 'Karşılaştır', 'compare');

const miss = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda dikkat çeken bir şey bulamadın.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

const hit = (title: string, text: string, amount = 150) => ({
  title,
  text,
  label: `+${amount} SKOR · Not defterine eklendi`,
  tone: 'special' as const,
});

export const inv1Docs: CasePart = {
  nodes: [
    documentExam('INV_TUTANAK', {
      ...INV1,
      title: 'Arama ve el koyma tutanağı',
      hud: ['ex_tut'],
      background: 'adliye',
      lines: [
        {
          lines: [
            card('ADLİYE · SAVCILIK DOSYASI — ARAMA TUTANAĞI VE KROKİ', 'adliye'),
            n('İki sayfa daktilo düzeninde yazı, bir sayfa elle çizilmiş kroki. Altında üç imza. Kâğıt, onu yazan elin aceleciliğini taşıyordu.'),
            th('Bir alet seç, sonra şüpheli satıra dokun. Büyüteç yazının kendisine, karşılaştırma satırlar arasındaki çelişkiye bakar.'),
          ],
        },
      ],
      header: { left: 'ARAMA VE EL KOYMA TUTANAĞI', right: '11.11 · 06.05–07.40' },
      columns: [
        { label: 'BÖLÜM', flex: 1 },
        { label: 'KAYIT', flex: 3 },
      ],
      rows: [
        row('r_bas', ['Başlangıç', '06.05 · Kapı açıldı. Şüpheli ön odada yatağında uyurken bulundu.']),
        row('r_kapi', ['Giriş', 'Odaların kapıları olağan şekilde açıldı; zor kullanılmadı.']),
        row('r_arka', ['Arka oda', 'Evin arka odasında (şüphelinin kullanımındaki) dolapta 46 paket, hassas terazi, kilitli poşetler, 8.750 TL.'], {
          lupe: {
            cells: ['Arka oda', 'Evin arka odasında [şüphelinin kullanımındaki — satır arasına, başka kalemle] dolapta 46 paket…'],
            tone: 'special',
          },
        }),
        row('r_mutfak', ['Mutfak', 'Mutfakta şekerlik içinde 2 paket.']),
        row('r_tanik', ['Tanık', 'Arama başında hazır bulundurulan komşu: Nesrin Uysal · imza'], {
          lupe: { cells: ['Tanık', 'Nesrin Uysal · imzanın yanında el yazısıyla: 06.40'], tone: 'special' },
        }),
        row('r_kroki', ['Kroki', 'Ön oda: “misafir odası” · Arka oda: “şüphelinin yatak odası” · Salon, mutfak, banyo']),
      ],
      tools: [lupe, kars],
      costVar: 'ex_tut',
      rules: [
        examine('EX_TUT_EKLEME', 'lupe', 'r_arka', {
          discovers: 'clue_ekleme',
          score: { DELIL_ANALIZI: 100 },
          feedback: hit('SIKIŞTIRILMIŞ PARANTEZ', '“(şüphelinin kullanımındaki)” satır arasına, daha ince bir kalemle sıkıştırılmış. Biri bu odanın kimin olduğunu sonradan yazmış.', 100),
        }),
        examine('EX_TUT_TANIK', 'lupe', 'r_tanik', {
          discovers: 'clue_tanik_saat',
          score: { DELIL_ANALIZI: 100 },
          feedback: hit('06.40', 'Arama 06.05’te başlamış. Tanık imzasının yanında 06.40 yazıyor. “Arama başında hazır” bulunan tanık, otuz beş dakika sonra gelmiş.', 100),
        }),
        examine('EX_TUT_KROKI', 'kars', 'r_kroki', {
          discovers: 'clue_kroki',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit('KROKİ ÇELİŞKİSİ', 'Tutanak Kaan’ı ön odada, kendi yatağında uyurken buluyor. Kroki aynı odaya “misafir odası” diyor ve arka odayı ona veriyor. Biri ya yanlış görmüş ya da görmek istediğini çizmiş.'),
        }),
      ],
      miss: miss('FB_TUTANAK'),
      finish: { id: 'TUTANAK_BITIR' },
    }),
    documentExam('INV_KARAR', {
      ...INV1,
      title: 'Arama kararı',
      hud: ['ex_kar'],
      background: 'adliye',
      lines: [
        {
          lines: [
            n('Tek sayfa. Mühür, imza, kısa cümleler. Bir hâkimin bir gece yarısı önüne gelen talebe verdiği cevap.'),
            th('Arama kararı bir anahtar gibidir: hangi kapıyı açtığı üstüne yazılıdır.'),
          ],
        },
      ],
      header: { left: 'BURSA SULH CEZA HÂKİMLİĞİ · ARAMA KARARI', right: '10.11 · 14.15' },
      columns: [
        { label: 'BAŞLIK', flex: 1 },
        { label: 'İÇERİK', flex: 3 },
      ],
      rows: [
        row('r_k_fiil', ['Fiil', 'Uyuşturucu veya uyarıcı madde ticareti şüphesi.']),
        row('r_k_talep', ['Talep', 'Kolluk yazısı: şüphelinin adreste bir ev arkadaşıyla kaldığı öğrenilmiştir.']),
        row('r_k_kapsam', ['Kapsam', 'Şüpheli Kaan Yıldız’ın kullanımındaki oda ve ortak kullanım alanları ile şüphelinin üzeri.']),
        row('r_k_sure', ['Süre', 'Karar tarihinden itibaren 48 saat geçerlidir.']),
      ],
      tools: [lupe, kars],
      costVar: 'ex_kar',
      rules: [
        examine('EX_KAR_KAPSAM', 'lupe', 'r_k_kapsam', {
          discovers: 'clue_kapsam',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit('KAPSAM', 'Karar evin tamamını değil, Kaan’ın kullanımındaki odayı ve ortak alanları kapsıyor. Hâkim bir ev arkadaşı olduğunu biliyordu ve sınırı buna göre çizmiş.'),
        }),
        examine('EX_KAR_TALEP', 'lupe', 'r_k_talep', {
          score: { DELIL_ANALIZI: 50 },
          effects: [raise('fact_talep')],
          feedback: {
            title: 'EV ARKADAŞI BİLİNİYORDU',
            text: 'Kolluk talep yazısında bir ev arkadaşından söz etmiş. Yani polis, aramadan önce evde iki kişinin yaşadığını biliyordu.',
            label: '+50 SKOR',
            tone: 'info',
          },
        }),
        examine('EX_KAR_SURE', 'kars', 'r_k_sure', {
          score: { DELIL_ANALIZI: 20 },
          feedback: {
            title: 'SÜRE İÇİNDE',
            text: 'Karar 10 Kasım 14.15’te verilmiş; arama 11 Kasım 06.05’te. 48 saatin içinde. Burada bir hata yok; her kapı kırık değildir.',
            label: '+20 SKOR · doğru okuma',
            tone: 'info',
          },
        }),
      ],
      miss: miss('FB_KARAR'),
      finish: { id: 'KARAR_BITIR' },
    }),
    documentExam('INV_MESAJ', {
      ...INV1,
      title: 'Mesaj dökümü',
      hud: ['ex_mes'],
      background: 'buro',
      lines: [
        {
          lines: [
            n('Telefon inceleme raporu: on dört sayfa ekran görüntüsü, saat damgaları, bir operatör yazısı. Savcılık bir satırın altını kırmızıyla çizmiş.'),
            th('Mesajlar, insanların konuştuğunu sandıkları gibi değil, gerçekten konuştukları gibidir. Kısaltmalarıyla, emojileriyle, yalanlarıyla.'),
          ],
        },
      ],
      header: { left: 'TELEFON İNCELEME RAPORU · KAAN YILDIZ', right: '“B.” ile yazışmalar' },
      columns: [
        { label: 'TARİH', flex: 1 },
        { label: 'KİMDEN', flex: 1 },
        { label: 'MESAJ', flex: 3 },
      ],
      rows: [
        row('m_eylul1', ['24.09 21.12', 'Kaan', 'akşam 2 tane bırakır mısın']),
        row('m_eylul2', ['24.09 23.40', 'B.', 'kapıya koydum kardeş :)']),
        row('m_ekim', ['30.10 18.05', 'B.', 'bıraktın diye sevindim aslında. bi daha sorma bana']),
        row('m_kasim', ['10.11 22.40', 'B.', 'bu gece geç gelirim, odaya girme sakın']),
        row('m_hat', ['Operatör', '—', '“B.” numarası: abone Fatma Demirel, Karşıyaka / İzmir']),
      ],
      tools: [lupe, kars],
      costVar: 'ex_mes',
      rules: [
        examine('EX_MES_ODA', 'lupe', 'm_kasim', {
          discovers: 'clue_odaya_girme',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit('“ODAYA GİRME”', 'Baskından yedi buçuk saat önce: “odaya girme sakın.” Kendi odası olmayan birine bunu kimse yazmaz. Bir başkasının odası var ve o başkası Kaan’ın girmesini istemiyor.'),
        }),
        examine('EX_MES_IKI', 'lupe', 'm_eylul1', {
          discovers: 'clue_iki_tane',
          score: { DELIL_ANALIZI: 100 },
          feedback: hit('“2 TANE”', 'Savcılığın kırmızı çizgisi. “Akşam 2 tane bırakır mısın.” Bir sipariş mi, bir alım mı? Kimin kime sattığını bu satır söylemiyor. Ama bir şey söylüyor.', 100),
        }),
        examine('EX_MES_EKIM', 'lupe', 'm_ekim', {
          score: { DELIL_ANALIZI: 50 },
          effects: [raise('fact_birakti')],
          feedback: {
            title: '“BIRAKTIN DİYE SEVİNDİM”',
            text: '30 Ekim. B., Kaan’ın bıraktığını biliyor ve “bi daha sorma bana” diyor. Kim kimden bir şey isterdi? Bu satır yönü gösteriyor.',
            label: '+50 SKOR',
            tone: 'info',
          },
        }),
        examine('EX_MES_HAT', 'kars', 'm_hat', {
          discovers: 'clue_hat',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit('HAT SAHİBİ', 'Hat İzmir’de bir Fatma Demirel adına. Kolluk ona ulaşamamış ve orada bırakmış. Bir soyadı, bir şehir: hayaletin ilk adresi.'),
        }),
      ],
      miss: miss('FB_MESAJ'),
      finish: { id: 'MESAJ_BITIR' },
    }),
    documentExam('INV_KRIMINAL', {
      ...INV1,
      title: 'Kriminal rapor',
      hud: ['ex_kri'],
      background: 'buro',
      lines: [
        {
          lines: [
            n('Kriminal Polis Laboratuvarı. Ağırlıklar, fotoğraflar, parmak izi kartları. Bilim tarafsızdır; onu okuyan değil.'),
            th('Savcı bu raporu “paketleme ve terazi” diye özetlemiş. Ben satır satır okuyacağım.'),
          ],
        },
      ],
      header: { left: 'KRİMİNAL POLİS LABORATUVARI RAPORU', right: 'Aralık' },
      columns: [
        { label: 'MATERYAL', flex: 1 },
        { label: 'BULGU', flex: 3 },
      ],
      rows: [
        row('k_paket', ['46 paket', 'Net 39,8 g kokain; kilitli poşet, ısıyla kapatılmış.']),
        row('k_seker', ['Şekerlik', '2 paket, net 1,7 g kokain.'], {
          kars: {
            cells: ['Şekerlik', '2 paket · poşet tipi, kesim ve ortalama gramaj (0,85 g) arka odadaki paketlerle aynı.'],
            tone: 'special',
          },
        }),
        row('k_terazi', ['Terazi', 'Kefede kokain bulaşığı; karşılaştırmaya elverişli bir parmak izi.']),
        row('k_kavanoz', ['Kavanoz', 'Şekerlik kavanozunun dış yüzeyinde parmak izleri.']),
        row('k_para', ['Para', '8.750 TL; 50 ve 100 liralık banknotlar.']),
      ],
      tools: [lupe, kars],
      costVar: 'ex_kri',
      rules: [
        examine('EX_KRI_PARTI', 'kars', 'k_seker', {
          discovers: 'clue_ayni_parti',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit('AYNI STOK', 'Şekerlikteki iki paket, arka odadakilerle aynı poşette, aynı kesimle, aynı gramajda. İki ayrı satıcı değil; tek bir stok.'),
        }),
        examine('EX_KRI_IZ', 'lupe', 'k_terazi', {
          discovers: 'clue_iz_yabanci',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit('YABANCI İZ', 'Terazideki iz Kaan Yıldız’ınki değil. Parmak izi sisteminde kaydı yok. Teraziyi tutan el, savcının sanık sandalyesine oturttuğu el değil.'),
        }),
        examine('EX_KRI_KAVANOZ', 'lupe', 'k_kavanoz', {
          discovers: 'clue_kavanoz_iz',
          score: { DELIL_ANALIZI: 50 },
          feedback: hit('KAVANOZDA KAAN', 'Kavanozun dışında Kaan’ın izleri. Paketlerde elverişli iz yok. Savcının şekerlik tezi bu satıra yaslanıyor; bunu bilmek iyi.', 50),
        }),
      ],
      miss: miss('FB_KRIMINAL'),
      finish: { id: 'KRIMINAL_BITIR' },
    }),
    documentExam('INV_TOLGA', {
      ...INV1,
      title: 'Muhbirin ifadesi',
      hud: ['ex_tol'],
      background: 'buro',
      lines: [
        {
          lines: [
            n('İki sayfalık bir kolluk ifadesi, gece 01.30’da alınmış. Altında titrek bir imza. Bir müdafi adı yok; “avukat istemiyorum” kutusu işaretli.'),
            th('Gece yarısı, bir karakolda, cebinden bir paket çıkmış bir adam. Böyle bir adam doğruyu da söyleyebilir, işine geleni de.'),
          ],
        },
      ],
      header: { left: 'KOLLUK İFADESİ · TOLGA KAPLAN', right: '10.11 · 01.30' },
      columns: [
        { label: 'SORU', flex: 1 },
        { label: 'CEVAP', flex: 3 },
      ],
      rows: [
        row('t_yakalama', ['Yakalanma', '9.11 · 23.09 · Ihlamur Sokak alt kısmı · üzerinde 1 paket (0,9 g).']),
        row('t_nereden', ['Nereden', 'Ihlamur 14 Daire 7’den, Kaan Yıldız’dan aldım.']),
        row('t_saat', ['Saat', 'Saat 23.00 gibi binanın kapısında aldım.']),
        row('t_ayrinti', ['Ayrıntı', 'Kapıyı açanın elinde kask vardı, aceleyle çıkacaktı. Parayı elden verdim.']),
        row('t_gecmis', ['Tanışıklık', 'Daha önce o evde kaldım, tanırım.']),
        row('t_not', ['Not', 'Şüpheliye satıcıyı bildirmesinin cezasına etkisi hatırlatıldı; “yararlanmak istiyorum” dedi.']),
      ],
      tools: [lupe, kars],
      costVar: 'ex_tol',
      rules: [
        examine('EX_TOL_KASK', 'lupe', 't_ayrinti', {
          discovers: 'clue_tolga_kask',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit('KASK', '“Kapıyı açanın elinde kask vardı, aceleyle çıkacaktı.” Kimse bu cümlenin altını çizmemiş. Kask taşıyan biri, motosiklet kullanan biridir.'),
        }),
        examine('EX_TOL_SAAT', 'lupe', 't_saat', {
          discovers: 'clue_tolga_saat',
          score: { DELIL_ANALIZI: 100 },
          feedback: hit('23.00', 'Satış 23.00 sularında, binanın kapısında. Bu saatte Kaan neredeydi? Bir pazar gecesi.', 100),
        }),
        examine('EX_TOL_GECMIS', 'kars', 't_gecmis', {
          score: { DELIL_ANALIZI: 50 },
          effects: [raise('fact_tolga_eski')],
          feedback: {
            title: 'ESKİ KİRACI',
            text: '“Daha önce o evde kaldım.” Muhbir evin eski sakini. Neden ayrıldığını ifadede kimse sormamış.',
            label: '+50 SKOR',
            tone: 'info',
          },
        }),
        examine('EX_TOL_NOT', 'lupe', 't_not', {
          score: { DELIL_ANALIZI: 100 },
          effects: [raise('fact_tolga_192')],
          feedback: {
            title: 'BİR İSİM VERMEK',
            text: 'Gece yarısı, üzerinde bir paketle yakalanan adama bir kapı gösterilmiş: satıcıyı söylersen cezan düşer ya da azalır. Bir isim vermesi gerekiyordu. Hangi ismi seçeceği ona kalmıştı.',
            label: '+100 SKOR',
            tone: 'info',
          },
        }),
      ],
      miss: miss('FB_TOLGA'),
      finish: { id: 'TOLGA_BITIR' },
    }),
    documentExam('INV_EMANET', {
      ...INV1,
      title: 'Emanet eşya tutanağı',
      hud: ['ex_ema'],
      background: 'adliye',
      lines: [
        {
          lines: [
            card('ADLİYE · EMANET BÜROSU', 'adliye'),
            n('Emanet memuru kalın bir defteri açtı, parmağını satırların üstünde gezdirdi, bir naylon torba çıkardı. Torbanın içinde bir insanın sabah altıda cebinde taşıdığı her şey.'),
            s('defne', 'Kaan’ın anahtarlığı bu. Liseden kalma bir kartal figürü var ucunda. Hâlâ taşıyormuş.'),
            th('Dokunmak yok; bakmak serbest. Bir torba dolusu sıradanlık. Ama bazen sıradanlık, olmayan bir şeyi gösterir.'),
          ],
        },
      ],
      header: { left: 'EMANET EŞYA TUTANAĞI · KAAN YILDIZ', right: '11.11 · 07.55' },
      columns: [
        { label: 'EŞYA', flex: 1 },
        { label: 'AÇIKLAMA', flex: 3 },
      ],
      rows: [
        row('e_anahtar', ['Anahtarlık', '3 anahtar · kartal figürlü halka']),
        row('e_cuzdan', ['Cüzdan', '140 TL · öğrenci kartı · bir eczane fişi']),
        row('e_telefon', ['Telefon', 'İmaj alınmak üzere ayrıca muhafaza edildi.']),
        row('e_ilac', ['İlaç', 'Reçeteli ilaç, 2 kutu (yatak başı)']),
      ],
      tools: [lupe, kars],
      costVar: 'ex_ema',
      rules: [
        examine('EX_EMA_ANAHTAR', 'lupe', 'e_anahtar', {
          discovers: 'clue_anahtarlik',
          score: { DELIL_ANALIZI: 150 },
          effects: [raise('fact_anahtarlik')],
          feedback: hit('ÜÇ ANAHTAR', 'Daire kapısı, bina dış kapısı, posta kutusu. Bir asma kilidin anahtarı yok. Kilitli bir odanın sahibi, o odanın anahtarını taşır.'),
        }),
        examine('EX_EMA_CUZDAN', 'lupe', 'e_cuzdan', {
          score: { DELIL_ANALIZI: 50 },
          effects: [raise('fact_para')],
          feedback: {
            title: '140 LİRA',
            text: 'Cüzdanda 140 lira ve bir eczane fişi. Arka odada 8.750 lira bulunmuş. Bir satıcının cüzdanı bu kadar ince olmaz.',
            label: '+50 SKOR',
            tone: 'info',
          },
        }),
        examine('EX_EMA_ILAC', 'kars', 'e_ilac', {
          discovers: 'clue_tedavi',
          score: { DELIL_ANALIZI: 50 },
          feedback: hit('REÇETE', 'Kutuların üstündeki reçete etiketi: AMATEM polikliniği, ekim. Polisin “ilaç kutuları” dediği şey bir tedavinin kendisi.', 50),
        }),
      ],
      miss: miss('FB_EMANET'),
      finish: { id: 'EMANET_BITIR' },
    }),
  ],
};
