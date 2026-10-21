import {
  all,
  back,
  choiceNode,
  cmp,
  conversation,
  costOf,
  dec,
  flag,
  has,
  inc,
  interview,
  mark,
  mood,
  not,
  objective,
  option,
  raise,
  set,
  topic,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { ASKED_REASON, askedOne, B, S } from './dsl.js';
import { INV1 } from './shared.js';

// 51-inv1-people: Halil ile görüşme (konu × ton; defter ve randevu başka yerde bulunanlarla açılır), yüzleşme ve tavsiye
// kararı, Zehra (acil servis), Tapu Müdürü, Devir Servisi-2, Komiser.

const trustOk = cmp(v('trust'), '>=', 40);
const trustHigh = cmp(v('trust'), '>=', 55);

export const inv1People: CasePart = {
  nodes: [
    interview('INV1_HALIL', {
      ...INV1,
      title: 'Halil ile görüşme',
      background: 'gorus_odasi',
      hud: ['min', 'trust'],
      room: { label: 'BURSA H TİPİ CEZAEVİ · AVUKAT GÖRÜŞ ODASI', character: 'halil' },
      onFirstEnter: [{ type: 'MEET', character: 'gardiyan' }],
      lines: [
        {
          when: all(cmp({ visits: 'INV1_HALIL' }, '==', 1), flag('gozluk')),
          lines: S`
            = BURSA H TİPİ CEZAEVİ · GÖRÜŞ ODASI · 10.10 @gorus_odasi
            gardiyan: Yarım saat, avukat hanım. Konuşmanızı duymam. Halil Bey'e iyi bakın; buranın kütüphanesini o düzenledi.
            - Halil kapıdan girdiğinde önce masaya baktı, sonra bana. Masadaki kâğıtların kenarını bir parmakla hizaladı; ancak ondan sonra oturdu.
            - Gözlük kılıfını uzattım. Bir süre ona dokunmadı. Sonra açtı, gözlüğü taktı, Zehra'nın notunu okudu. Bir kez. Katladı, gömlek cebine koydu.
            halil: Sardunya kurumuş. Bekliyordum. Yedi haftadır kimse sulamadı. Kızım yenisini almış. Kızım her şeyin yenisini alır; ben eskisini onarırım.
            halil: Teşekkür ederim. Altı haftadır okuyamıyordum; kütüphanede büyük puntolu üç kitap var, üçünü de bitirdim. Kayda geçsin, avukat hanım: gözlüğüm için teşekkür ederim.
          `,
        },
        {
          when: cmp({ visits: 'INV1_HALIL' }, '==', 1),
          lines: S`
            = BURSA H TİPİ CEZAEVİ · GÖRÜŞ ODASI · 10.10 @gorus_odasi
            gardiyan: Yarım saat, avukat hanım. Konuşmanızı duymam. Halil Bey'e iyi bakın; buranın kütüphanesini o düzenledi.
            - Halil kapıdan girdiğinde önce masaya baktı, sonra bana. Masadaki kâğıtların kenarını bir parmakla hizaladı; ancak ondan sonra oturdu.
            - Gözlüğü yoktu. Kâğıtlara kollarını uzatarak, kaşlarını çatarak baktı. Okuyamadığını belli etmemeye çalışıyordu.
            halil: Kızım bir avukat bulduğunu söyledi. Hoş geldiniz. Size ne anlatmamı istiyorsanız usulüne uygun anlatırım. Ama önce bir şey söyleyeyim: o zarf benim değil.
          `,
        },
        {
          lines: S`
            - Halil aynı sandalyede, aynı dik oturuşla bekliyordu. Kâğıtları bu sefer önceden hizalamıştı.
            halil: Yine geldiniz. İyi. On dakikamız var. Sorun; cevabım hazır olmayanı sonraya bırakırım.
          `,
        },
      ],
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
        { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla ayrıntı' },
      ],
      toneEffects: {
        soft: [inc('trust', 4), set('tone', 'soft')],
        hard: [dec('trust', 8), set('tone', 'hard')],
      },
      moodRules: [
        mood('Çözülüyor', 'success', 'uzgun', flag('fact_sira_itiraf')),
        mood('Kapanmış', 'error', 'kizgin', cmp(v('trust'), '<', 40)),
        mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
        mood('Resmî', 'neutral', 'normal'),
      ],
      objectives: [
        objective(
          'obj_sabah',
          flag('fact_cagri'),
          '10.35’te bir dahili çağrı: “Müdür Hanım bekliyor.”',
          'O sabah Halil neden odasından çıktı?',
        ),
        objective(
          'obj_bayram',
          flag('fact_bayram_red'),
          'Halil, Bayram’a “şerh kalkmadan imza yok” demiş.',
          'Halil Bayram’la ne konuştu?',
        ),
        objective(
          'obj_kontrol',
          flag('fact_onbir_dosya'),
          'On bir dosya durdurulmuş; biri içeriden dosya hızlandırıyor.',
          'Halil’i kim durdurmak isterdi?',
        ),
        objective(
          'obj_sira',
          flag('fact_sira_itiraf'),
          'Halil bir kez kuralı esnetti: sıra dışı randevu.',
          'Halil bir şey saklıyor mu?',
        ),
      ],
      topics: [
        topic('TP_SABAH', 'O sabah', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_cagri')],
          tones: {
            soft: {
              prompt: '12 Mart sabahını baştan anlatır mısınız? Saat saat.',
              says: S`
                halil: Sekiz yirmi beşte geldim, her zamanki gibi. Sardunyayı suladım. Dokuzdan on bire kadar kontrol saatidir; kapımı kapatırım, kimse rahatsız etmez.
                halil: Dokuz kırkta Ateşoğlu İnşaat'ın bir dosyası daha geldi. Şerhli. Geri çevirdim; on ikinci. Gerekçemi yazdım.
                halil: On otuz beşte dahili çaldı. Ekranda bir numara vardı; ben her arayanın numarasını takvime yazarım, alışkanlık. "Halil Bey, Müdür Hanım aşağıda bekliyor, acil."
                halil: Ses boğuktu. Sekreterlik sandım; ahize kötüdür orada. Ceketimi almadan indim. Müdürlüğün kapısı kapalıydı; sekreter "Müdür Hanım telekonferansta, kimseyi çağırmadı" dedi.
                halil: Beş dakika bekledim. Belki çıkar, belki yanlış anlaşılma, dedim. Usulen beklenir. On kırk altıda döndüm. Odamda üç polis.
                ~ Takvime yazar. Her arayanın numarasını. Bir adamın alışkanlığı, bazen bir dosyanın en sağlam tanığıdır.
              `,
            },
            hard: {
              prompt: 'Muhbir zarfı size verdiğini söylüyor. Neden odanızda olmadığınıza inanayım?',
              says: S`
                halil/kizgin: Çünkü odamda değildim, avukat hanım! İnanmanız gerekmiyor; kontrol edebilirsiniz. Ben her şeyin kontrol edilmesinden yanayım.
                halil: On otuz beşte dahili çaldı, "Müdür Hanım bekliyor" dediler. İndim. Sekreter kimseyi çağırmadığını söyledi. On kırk altıda döndüm.
                halil: Arayanın numarasını takvime yazdım. Hep yazarım. Takvim masada duruyorsa, oradadır. Kimse kaldırmadıysa.
                ~ "Kimse kaldırmadıysa." Yedi hafta geçmiş. O masaya kim dokunmuş, bilmiyorum.
              `,
            },
          },
        }),
        topic('TP_CEKMECE', 'Çekmece', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_kilitsiz')],
          tones: {
            soft: {
              prompt: 'Çekmecenizi neden kilitlemezdiniz?',
              says: S`
                halil: Kilit, güvensizliğin itirafıdır, avukat hanım. Yirmi yedi yıldır o çekmecede ne olduğunu herkes bilir: mühür yastığı, ataş, yedek kalem, bir de bir paket bisküvi.
                halil: Bir memurun çekmecesinde saklanacak bir şey olmamalı. Benim yoktu. Herkes açabilirdi; biri açmış.
                halil/uzgun: Şimdi düşünüyorum da... kural adamı olmak, kapıyı açık bırakmakmış. Ben bunu erdem sanıyordum.
              `,
            },
            hard: {
              prompt: 'Rüşvet alan biri de çekmecesini kilitlemez; şüphe çekmemek için. Öyle değil mi?',
              says: S`
                halil/kizgin: Bu sizin mantığınız mı, savcının mı? Kilitlersem suçlu, kilitlemezsem kurnaz. O hâlde masumiyetin bir yolu yok.
                halil: Yirmi yedi yıldır kilitlemedim. Bunu odaya giren herkes bilir. Çaycı bilir, temizlikçi bilir, karşı odadakiler bilir. Kim bildiyse, o kullandı.
                ~ "Kim bildiyse." Herkes biliyordu. Bu bir kapıyı daraltmıyor; ama kapının neden açık durduğunu söylüyor.
              `,
            },
          },
        }),
        topic('TP_BAYRAM', 'Bayram Öz', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_bayram_red')],
          tones: {
            soft: {
              prompt: 'Bayram Öz’ü nereden tanıyorsunuz?',
              says: S`
                halil: Takipçidir. On yıldır koridorda görürüm. Herkesin dosyasını takip eder, kendi dosyasını hiç takip etmez; borçludur, herkes bilir.
                halil: Mart başında bir başvurusu vardı. Babasından kendisine, Görükle'de bir tarla. İhtiyati tedbir şerhi var; şerh kalkmadan devir olmaz.
                halil: Bana geldi, ağladı. "Babam yoğun bakımda, ölmeden devir olsun" dedi. Ben de söyledim: "Bayram, şerh kalkmadan imza yok. Kalkarsa ilk sen girersin."
                halil: Para teklif etmedi. Etse kovardım. O bunu bilir.
                ~ "Kalkarsa ilk sen girersin." Bir cümlenin ikinci yarısı. İlk yarısını duyan birinin işine yarayacak türden.
              `,
            },
            hard: {
              prompt: 'Bayram size neden kırk bin lira getirsin? Aranızda ne vardı?',
              says: S`
                halil/kizgin: Hiçbir şey yoktu! Bir takipçiyle bir kontrol memuru arasında ne olabilir? Dosya. Sadece dosya.
                halil: Babası ölüyordu, ağladı. Ben de "şerh kalkmadan olmaz" dedim. O kadar. Kırk bin liranın lafı bile geçmedi.
                halil/uzgun: Belki biri ona "Halil'e götür" dedi. Ben kimseyi suçlamam; kanıtım olmadan isim söylemem.
                ~ Kanıt olmadan isim söylemez. Ama "biri ona dedi" diyor. Kafasında bir isim var.
              `,
            },
          },
        }),
        topic('TP_TELEFON', '8 Mart’taki telefon', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_tam_cumle')],
          tones: {
            soft: {
              prompt: 'İddianamede kendi telefonunuzdan bir cümle var: “Dosyana bakarım Bayram.” Hatırlıyor musunuz?',
              says: S`
                halil: Hatırlıyorum. Akşam yemeğindeydim; Bayram aradı, yine babasını anlattı. Ben "Dosyana bakarım Bayram, ama şerh kalkmadan imza yok" dedim.
                halil: İddianamede yalnızca ilk yarısı var. İkinci yarısını kim sildi, bilmem. Ama ben cümlemi yarım kurmam, avukat hanım. Hiçbir zaman.
                halil: Bir de... benim telefonumu neden dinliyorlardı? Hakkımda bir soruşturma olduğunu bilmiyordum. Hâlâ bilmiyorum. Kâğıtlarda bir karar gördünüz mü?
                ~ İyi soru. Kâğıtlarda Halil adına bir karar var mı? Kararı açıp okumam lazım; satır satır.
              `,
            },
            hard: {
              prompt: '“Dosyana bakarım.” Bu, para karşılığı iş görmek demek değil mi?',
              says: S`
                halil/kizgin: Bakmak, görmek değildir! Bakarım, şerhe bakarım, kalkmış mı bakarım. Ve cümlemin geri kalanı: "ama şerh kalkmadan imza yok."
                halil: Kim yarısını yazdıysa, öbür yarısını bilerek atmıştır. Yarım cümle, tam yalandan daha tehlikelidir.
              `,
            },
          },
        }),
        topic('TP_KONTROL', 'Kontrol masası', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 30 },
          effects: [raise('fact_onbir_dosya')],
          tones: {
            soft: {
              prompt: 'Son aylarda masanıza gelen işlerde tuhaf bir şey var mıydı?',
              says: S`
                halil: Ekimden beri bir şirketin dosyaları. Ateşoğlu İnşaat. Hepsi şerhli ya da eksik evraklı; hepsi bir şekilde hızlıca hazırlanmış, hepsi bana "acil" diye gelmiş.
                halil: On bir dosya durdurdum. Her birinin gerekçesini yazdım. Bir de... bir defter tuttum. Kendime. Kim hazırlamış, hangi gün, hangi eksik.
                halil: Biri içeriden dosyaları hızlandırıyordu. Kim olduğunu biliyorum sanıyorum. Ama kanıtım olmadan isim söylemem; kayda geçsin.
                ~ Bir defter. Ve bir memur, kanıtsız isim vermeyecek kadar dürüst. Ya da korkmuş. Belki ikisi.
              `,
            },
            hard: {
              prompt: 'Düşmanınız var mıydı? Biri sizi bu kadar mı istemezdi?',
              says: S`
                halil: Düşman değil, avukat hanım. Engel. Ben bir engeldim. On bir dosyanın önünde bir engel.
                halil/kizgin: Şubatta biri cebime bir not koydu; "her dosyayı durduran bir gün kendisi durur" diye. Ben bunu bir tehdit saymadım. Saymalıymışım.
                halil: Bir defterim var; her şeyi yazdım. Ama nerede olduğunu burada söylemem. Bu odanın duvarlarına güvenirim, kapısına güvenmem.
              `,
            },
          },
        }),
        topic('TP_DEFTER', 'Defter', {
          visibleWhen: all(has('clue_toz_izi'), trustHigh),
          cost: costOf('min', 2),
          score: { SORGULAMA: 40 },
          effects: [raise('fact_defter_yeri')],
          tones: {
            soft: {
              prompt: 'Odanızdaki rafta bir defter boyutunda temiz bir iz var. Defter nerede?',
              says: S`
                - Halil uzun süre bir şey söylemedi. Gözlüğünü çıkardı, camlarını gömleğinin ucuyla sildi, yeniden taktı.
                halil: Raftan kaldırdım. Şubattaki nottan sonra. Odama giren herkes görürdü; kırmızı kaplıdır.
                halil: Arşivde. 1987 ciltlerinin arkasında, duvarla rafın arasında. O ciltlere yirmi yıldır kimse bakmaz; Görükle'nin eski parselleri.
                halil: Mahkemeye siz götürün. Usulüne uygun. Ben kimseyi suçlamadım; defter suçlasın.
                ~ Bir defter, bir ciltlerin arkası. Yirmi yıldır kimsenin bakmadığı bir raf. Umarım hâlâ öyledir.
              `,
            },
            hard: {
              prompt: 'Bir defteriniz olduğunu biliyorum. Saklamak sizi daha çok batırır. Nerede?',
              says: S`
                halil/kizgin: Batırır mı? Beni batıran o defterin içindekiler değil, dışındakiler.
                - Bir süre sustu. Sonra sesini alçalttı.
                halil: Arşivde. 1987 ciltlerinin arkasında. Siz götürün; usulüne uygun. Ben bu odadan bir şey götüremem.
              `,
            },
          },
        }),
        topic('TP_DEFTER_X', 'Defter', {
          visibleWhen: all(has('clue_toz_izi'), not(trustHigh)),
          cost: costOf('min', 2),
          tones: {
            soft: {
              prompt: 'Odanızdaki rafta bir defter boyutunda temiz bir iz var. Defter nerede?',
              says: S`
                halil: Bir defter. Evet. Bir yerde. Size henüz söyleyemem, avukat hanım; sizi tanımıyorum. Kızım tanıyor, ben tanımıyorum.
                ~ Henüz. Güven kazanılmadan sorulan soru, cevabı daha derine gömer.
              `,
            },
            hard: {
              prompt: 'O defter nerede? Benden saklarsanız size yardım edemem.',
              says: S`
                halil/kizgin: Yardım etmek için önce güvenmeyi öğreneceksiniz. Ben de. İkimiz de bugün öğrenmedik.
              `,
            },
          },
        }),
        topic('TP_YIRMIYEDI', 'Yirmi yedi yıl', {
          visibleWhen: cmp({ visits: 'INV1_HALIL' }, '>=', 2),
          cost: costOf('min', 2),
          score: { SORGULAMA: 10 },
          effects: [raise('fact_kariyer')],
          tones: {
            soft: {
              prompt: 'Bu işe nasıl başladınız? Neden kontrol?',
              says: S`
                halil: Doksan yılında girdim. Tapu sicil katibi. O zaman her şey kâğıttı; mürekkep, mühür, bir de koca defterler. Bir parselin geçmişini öğrenmek bir gün sürerdi.
                halil: Kontrole on beş yıl önce geçtim. Kimse istemez; kontrol, herkesin işini geri çeviren adamdır. Ben istedim. Çünkü bir imzanın arkasında bir aile vardır, avukat hanım.
                halil: Bir keresinde bir kadının evi, kocasının sahte vekâletiyle satılmak üzereydi. Ben bir imzanın eğriliğinden şüphelendim. Durdurdum.
                halil: Kadın bir yıl sonra bir kutu lokum getirdi; tutanak tuttum, lokumu iade ettim. Kızım hâlâ benimle dalga geçer.
                halil/uzgun: Şimdi bir zarf yüzünden buradayım. Lokumu iade eden adam, zarfla yakalandı. Kader bazen kötü bir şakacıdır.
                ~ Bir adamın bütün hayatı, geri çevirdiği şeylerin listesi. Ve şimdi kendisi, birinin geri çeviremediği bir hediye.
              `,
            },
            hard: {
              prompt: 'Yirmi yedi yıl. Hiç mi hata yapmadınız?',
              says: S`
                halil: Yaptım. Bir kere. Biliyorsunuz zaten. Onu da size anlattım. Bir hata, avukat hanım, bir pazarlık değildir. Ben ikisinin farkını yirmi yedi yıl başkalarına anlattım.
                halil/kizgin: Şimdi kendime anlatamıyorum. Garip, değil mi?
              `,
            },
          },
        }),
        topic('TP_ZEHRA', 'Zehra', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 10 },
          effects: [raise('fact_zehra')],
          tones: {
            soft: {
              prompt: 'Zehra çok uğraşıyor. Onunla konuşmamı istediğiniz bir şey var mı?',
              says: S`
                halil/uzgun: Annesi öleli üç yıl oldu. O günden beri her şeyi o taşıyor. Nöbetler, faturalar, şimdi de ben.
                halil: Ona söyleyin: ek nöbet almasın. Avukat ücretini ben öderim. Yirmi yedi yıllık memurum; bir ikramiyem var. Kimse onu benden alamaz. Belki alırlar. Bilmiyorum artık.
                ~ Bir babanın tek korkusu kızının yorgunluğu. Kendi kelepçesi listede ikinci sırada.
              `,
            },
            hard: {
              prompt: 'Zehra bu davada ne kadar şey biliyor?',
              says: S`
                halil: Bilmesi gerekenden fazlasını. Şubattaki notu o buldu, bana söylemedi; ben de ona söylemedim. Ekinci ailesi böyledir: herkes herkesi korur, kimse kimseye anlatmaz.
              `,
            },
          },
        }),
      ],
      choices: [
        option('G_YUZLES', 'Sıra dışı randevu kaydını masaya koy', {
          prompt:
            'Halil Bey. 3 Mart’ta Bayram Öz’e öncelikli randevu onayı vermişsiniz. İmzanız var. Bana anlatmak istediğiniz bir şey var mı?',
          visibleWhen: all(has('ev_sira_disi'), flag('fact_bayram_red'), trustOk),
          cost: costOf('min', 3),
          score: { SORGULAMA: 150 },
          effects: [
            raise('fact_sira_itiraf'),
            inc('trust', 6),
            mark(
              'GOOD',
              'Saklanan bilgi açığa çıktı: Halil yirmi yedi yılda bir kez kuralı esnetmiş; karşılığında bir şey almamış.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            - Halil kâğıda baktı. Gözlüğünü çıkarmadı. Uzun süre baktı; kendi imzasını tanır gibi değil, bir yabancının imzası gibi.
            halil/uzgun: Yirmi yedi yılda bir kez. Bir kez, avukat hanım. Babası yoğun bakımdaydı. Ölmeden tarlayı oğluna devretmek istiyormuş. Ben de... sırayı öne aldım.
            halil/uzgun: Yetkim yoktu. Öncelikli randevuyu müdür onaylar. Ben onayladım, çünkü Müdür Hanım izindeydi ve adam ağlıyordu. Ve ben bir kez, kuralın değil, adamın yüzüne baktım.
            halil: Para almadım. Bir çay bile içmedim. Sıra öne alındı; şerh kalkmadığı için imza yine çıkmadı. Kimse bir şey kazanmadı.
            halil: Polise söylemedim. Söyleseydim, "işte iş, işte zarf" derlerdi. Yirmi yedi yılın tek eğilişini, bir zarfın yanına koyarlardı.
            ~ Bir yalan değil; bir utanç. Ama mahkeme için ikisinin farkı, ne zaman ve kimin ağzından söylendiğindedir.
          `),
          next: 'INV1_HALIL_TAVSIYE',
        }),
        option('G_YUZLES_X', 'Sıra dışı randevu kaydını masaya koy', {
          prompt:
            'Halil Bey. 3 Mart’ta Bayram Öz’e öncelikli randevu onayı vermişsiniz. İmzanız var. Bana anlatmak istediğiniz bir şey var mı?',
          visibleWhen: all(has('ev_sira_disi'), flag('fact_bayram_red'), not(trustOk)),
          cost: costOf('min', 3),
          effects: [
            dec('trust', 4),
            mark('BAD', 'Güveni düşük müvekkil sakladığını açmaz; önce güven kur, sonra yüzleştir.', 'SORGULAMA'),
          ],
          responses: B(S`
            halil/kizgin: Siz benim avukatım mısınız, savcım mı? Bu kâğıdı nereden buldunuz? Müdürlükten mi? Demek oraya gittiniz ve benim imzalarımı topladınız.
            - Kalktı, kapıya döndü, gardiyana işaret etti. Sonra durdu; ama yeniden oturmadı.
            ~ Kapıyı çok sert çaldım. Bazı kapılar ancak içeriden açılır.
          `),
        }),
      ],
      finish: { id: 'G_BITIR' },
    }),
    choiceNode('INV1_HALIL_TAVSIYE', {
      ...INV1,
      title: 'Ne yapacağız?',
      background: 'gorus_odasi',
      prompt: {
        speaker: 'halil',
        expression: 'uzgun',
        text: 'Mahkemede bunu söylersem savcı “işte” diyecek. Söylemezsem bulacaklar. Siz ne derseniz onu yapacağım; ama doğrusunu söyleyin.',
      },
      choices: [
        option('TAV_A', 'Randevuyu mahkemede kendiniz, gerekçesiyle anlatmanızı öneririm.', {
          score: { SAVUNMA_STRATEJISI: 100 },
          effects: [raise('halil_durust'), inc('trust', 4)],
          good: 'Avukat müvekkile gerçeğe aykırı beyan önermez. Sıra dışı randevu en fazla yetki aşımıdır; karşılık olmadan rüşvetin “iş–menfaat” bağı kurulmaz. Doğrunun sanığın ağzından ve belgeyle anlatılması, savcının bulmasından iyidir.',
          responses: B(S`
            halil: Herkesin önünde mi? Kızımın önünde?
            > Herkesin önünde. Ama yalnız değil. Randevu kaydı, şerh ve imzanın çıkmadığı belgeyle aynı anda konuşacak. Kararı siz veriyorsunuz; ben bedelini ve faydasını anlattım.
            - Halil başını salladı. Bir kez. Sonra kâğıdı aldı, kenarını masanın kenarıyla hizaladı ve bana geri verdi.
            halil: Yirmi yedi yıl önce ilk günümde müdürüm bir şey söylemişti: "Halil, bu masada bir kez eğilirsen, bir daha hep eğik oturursun." Ben eğildim. Şimdi doğrulacağım.
          `),
          next: 'INV1_HALIL',
        }),
        option('TAV_B', 'Kimse bilmiyor; sorulursa randevuyu Müdür Hanım’ın onayladığını söyleyin.', {
          score: { SAVUNMA_STRATEJISI: -100 },
          effects: [raise('halil_inkar'), inc('ethics')],
          bad: 'Avukat müvekkiline gerçeğe aykırı beyanda bulunmasını, hele bir başkasını işaret ederek, öğütleyemez (Av.K. 34; TBB Meslek Kuralları). Kayıt ortaya çıkınca inkâr, savunmanın en büyük yükü olur.',
          responses: B(S`
            halil: Müdür Hanım'ı mı? O izindeydi. Ama... siz avukatsınız.
            - Halil'in yüzünde bir şey kırıldı. Yirmi yedi yıl boyunca yalan söylememiş bir adam, ilk yalanını bir avukattan öğreniyordu.
            ~ "Siz avukatsınız." Evet. Bu yüzden söylememem gerekirdi.
          `),
          next: 'INV1_HALIL',
        }),
        option('TAV_C', 'Bu konuda susma hakkınız var; sorulursa cevap vermeyebilirsiniz.', {
          neutral: 'Susma hakkı meşrudur (CMK 147/1-e); ama sessizlik, savcının anlatısına boşluk bırakır.',
          effects: [raise('halil_sus')],
          responses: B(S`
            halil: Susmak. Ben yirmi yedi yıl kâğıtları konuşturdum, kendim susarak. Bir gün daha susarım.
            ~ Haklı. Ve bu yüzden susması, kimseye bir şey anlatmayacak.
          `),
          next: 'INV1_HALIL',
        }),
      ],
    }),
    conversation('INV1_ZEHRA', {
      ...INV1,
      title: 'Acil servis',
      background: 'hastane',
      room: { label: 'ŞEHİR HASTANESİ · ACİL SERVİS', character: 'zehra' },
      lines: B(S`
        = ŞEHİR HASTANESİ · ACİL SERVİS · 03.10 @hastane
        - Acil servis gece üçte bir liman gibiydi: herkes bir yerden gelmiş, kimse bir yere gitmiyordu. Florasan, dezenfektan, bir bebeğin bitmeyen ağlaması.
        - Zehra hemşire odasının kapısında, elinde bir karton bardak kahveyle bekliyordu. Formasının cebinde üç kalem, bir makas, bir de babasınınkine benzeyen bir gözlük.
        zehra: On dakikam var. Triyajda bir kalp krizi, iki kırık, bir de kendini kalp krizi sanan bir panik atak. Sorun.
      `),
      choices: [
        option('ZEH_NOT', 'Şubatta bulduğunuz notu tekrar görebilir miyim?', {
          discovers: 'clue_uyari_notu',
          score: { ARASTIRMA: 40 },
          responses: B(S`
            - Zehra çantasından naylon poşeti çıkardı. Notu ışığa tuttu; gözleri, bir röntgene bakar gibi kısıldı.
            zehra: Ceketinin iç cebindeydi. On dört şubat. Sevgililer günü; bu yüzden hatırlıyorum. Babam o gün eve geç geldi, yemek yemedi.
            zehra: Ona sormadım. O da bana söylemedi. Biz böyle bir aileyiz; herkes herkesi korur, kimse kimseye anlatmaz.
            ~ "Her dosyayı durduran, bir gün kendisi durur." Bir tehdit. Ama kimin, hangi dosya için? Notu dosyaya koyuyorum; tek başına bir şey söylemiyor.
          `),
          next: '$stay',
        }),
        option('ZEH_TAKVIM', 'Babanızın iş alışkanlıklarını anlatın. Küçük şeyleri.', {
          score: { SORGULAMA: 20 },
          effects: [raise('fact_takvim_aliskanlik')],
          responses: B(S`
            zehra: Küçük şeyler mi? Babamda büyük şey yoktur, hepsi küçüktür. Kâğıtları hizalar. Gözlüğünü başının üstünde unutur, sonra evi yıkar.
            zehra: Telefon çalınca arayanın numarasını yazar. Evde de. Buzdolabının üstündeki takvimde annemin hastane numarası hâlâ yazılı. Üç yıldır silmedi.
            zehra/uzgun: Bir keresinde ona "Baba, neden yazıyorsun?" dedim. "Unutmamak için değil kızım" dedi, "inkâr etmemek için."
            ~ İnkâr etmemek için. Bir adam, kendisine karşı bile tanıklık edecek kadar düzenli.
          `),
          next: '$stay',
        }),
        option('ZEH_EV', 'Evinize gelen “müdürlükten biri” hakkında başka bir şey hatırlıyor musunuz?', {
          visibleWhen: flag('evrak_bildirildi'),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_ev_ziyaret')],
          responses: B(S`
            zehra: Komşu bir şey daha söyledi. Adam giderken merdivende telefonla konuşmuş: "Evde yok. Başka yerde olmalı." Kiminle konuştuğunu duymamış.
            zehra: Ben savcılığa yazdım, sizin dediğiniz gibi. Saat, tarif, şemsiye. Hemşireyiz; ne gördüysek onu yazarız.
            ~ "Başka yerde olmalı." Biri bir şey arıyor ve bulamadı. Benden önce bulursa, kaybederim.
          `),
          next: '$stay',
        }),
        back('ZEH_GERI', 'Teşekkür et, çık', {
          enabledWhen: askedOne('ZEH_NOT', 'ZEH_TAKVIM', 'ZEH_EV'),
          lockedReason: ASKED_REASON,
        }),
      ],
    }),
    conversation('INV1_MUDUR', {
      ...INV1,
      title: 'Müdürlük makamı',
      background: 'buro',
      room: { label: 'NİLÜFER TAPU MÜDÜRLÜĞÜ · MAKAM', character: 'ferda' },
      onFirstEnter: [{ type: 'MEET', character: 'ferda' }],
      lines: B(S`
        = NİLÜFER TAPU MÜDÜRLÜĞÜ · MAKAM · 11.20 @buro
        - Makam odası, binanın geri kalanından daha sessizdi; halı sesleri yutuyordu. Duvarda bir Atatürk portresi, bir harita, bir de çerçeveli "Hizmet Kalite Belgesi".
        - Ferda Yalçın masasının arkasından kalkmadı. Kırlaşmış kısa saç, bordo bir ceket, boynunda okuma gözlüğü. Önünde bir dosya; kapağını kapattı.
        ferda: Avukat Hanım. Hoş geldiniz. Size ne kadar yardımcı olabileceğimi bilmiyorum; kurumumuz bir soruşturmanın tarafı. Ama prosedür gereği ne verebilirsem veririm.
        ferda: Halil Bey'le yirmi yıl çalıştım. Bu binanın vicdanıdır. Vicdan da yorar, biliyor musunuz. Herkesi.
      `),
      choices: [
        option('MUD_SABAH', '12 Mart sabahı Halil Bey’i çağırdınız mı?', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_mudur_cagirmadi')],
          responses: B(S`
            ferda: Hayır. On ile on bir arası il müdürlüğüyle telekonferanstaydım; hat bağlıydı, kimseyi aramadım. Sekreterim de aramadı; ona sordum.
            ferda: Halil Bey aşağı inmiş, kapıda beklemiş. Sekreterim "kimse çağırmadı" demiş. Beş dakika beklemiş yine de. Halil Bey'dir; bir yanlış anlaşılmayı da usulüne uygun bekler.
            ferda: Polise de söyledim bunu. Tutanağa geçti mi, bilmiyorum. Kimse bir daha sormadı.
            ~ Müdür çağırmadı. Ama biri, müdür adına çağırdı. Bir binada müdür adına konuşabilecek kaç kişi var?
          `),
          next: '$stay',
        }),
        option('MUD_DOSYA', 'Bayram Öz’ün başvurusunun iş dağıtım kaydını görebilir miyim?', {
          discovers: ['clue_dosya_devir2', 'ev_sira_disi'],
          score: { ARASTIRMA: 60 },
          responses: B(S`
            - Ferda bir an tereddüt etti. Sonra bilgisayarına döndü, birkaç tuşa bastı. Yazıcı homurdandı.
            ferda: Başvuru 2027/3318. Görükle, 112 ada 7 parsel. Atanan servis: Devir-2. Durum: beklemede, ihtiyati tedbir şerhi. Kontrole hiç gelmemiş; gelemezdi, şerh var.
            - Kâğıdın altında ikinci bir satır vardı. Ferda onu da okudu; sesi bir ton düştü.
            ferda: Bir de... öncelikli randevu onayı. 3 Mart. Onaylayan: H. Ekinci. Ben o hafta izindeydim. Bu yetki benimdir, avukat hanım. Halil Bey'in değil.
            ferda/uzgun: Bunu polis sormadı. Ben de söylemedim. Sorulmayan soruya cevap vermek, kurumun işi değil. Ama size soruldu; size veriyorum.
            ~ Bir kâğıt, iki satır. Biri müvekkilimi kurtarabilir, öbürü batırabilir. İkisi aynı yazıcıdan çıktı.
          `),
          next: '$stay',
        }),
        option('MUD_ODA', 'Halil Bey’in odasına bakmama izin verir misiniz?', {
          score: { ARASTIRMA: 20 },
          effects: [raise('oda_izin')],
          responses: B(S`
            ferda: Oda mühürlü değil; polis aramasını yaptı, teslim etti. Eşyaları koliye koyduk ama masası yerinde. Kimse oturmadı; oturamadı.
            ferda: Yanınızda bir memur olacak; prosedür. Bir şey alırsanız tutanakla. Dokunmayın demeyeceğim, ama bozmayın.
          `),
          next: '$stay',
        }),
        option('MUD_HALIL', 'Halil Bey nasıl bir memurdu?', {
          score: { SORGULAMA: 10 },
          responses: B(S`
            ferda: Kurallı. Yorucu derecede kurallı. Bir keresinde benim imzaladığım bir dosyayı geri çevirdi; eksik evrak. Haklıydı. Bir hafta konuşmadım onunla.
            ferda: Son aylarda bir şirketin dosyalarını durduruyordu. Bana bir rapor yazacağını söyledi. Yazmadı; ya da yazdı da bana gelmedi. Sonra bu oldu.
            ~ Bir rapor. Bir defter. Halil'in yazmaya niyetlendiği şey, ondan önce davrananları korkutmuş olabilir.
          `),
          next: '$stay',
        }),
        back('MUD_GERI', 'Teşekkür et, çık', {
          enabledWhen: askedOne('MUD_SABAH', 'MUD_DOSYA', 'MUD_ODA', 'MUD_HALIL'),
          lockedReason: ASKED_REASON,
        }),
      ],
    }),
    conversation('INV1_SINAN', {
      ...INV1,
      title: 'Devir Servisi-2',
      background: 'buro',
      room: { label: 'NİLÜFER TAPU MÜDÜRLÜĞÜ · DEVİR SERVİSİ-2', character: 'sinan' },
      onFirstEnter: [{ type: 'MEET', character: 'sinan' }, raise('sinan_goruldu')],
      lines: B(S`
        = DEVİR SERVİSİ-2 · 214 · 14.30 @buro
        - İki masalı bir oda. Masalardan biri boş ve tozlu, üstünde bir saksı kaktüs. Öbüründe dosyalar, bir bilgisayar, yarım bir bardak çay.
        - Masadaki memur ayağa kalktı; otuzlarının sonunda, geriye taranmış saç, açık renk bir ceket. Elimi sıktı; sıcak, kuru bir el.
        sinan: Avukat hanım! Halil abinin avukatı, değil mi? Buyurun, buyurun. Çay söyleyeyim mi? Muzaffer Usta'nın çayı bu binada tek dürüst şeydir, derler.
        sinan: Halil abi bizim büyüğümüzdür. Biraz katıdır, ama büyüğümüzdür. Ne lazımsa.
        - Konuşurken bileğindeki saate bir kez baktı; ekranı yeşil yandı, söndü. "Doktor günde on bin adım dedi" diye güldü. "Bu binada oturmaktan herkes hasta."
      `),
      choices: [
        option('SIN_SABAH', 'O sabah neredeydiniz?', {
          discovers: 'clue_sinan_arsiv',
          score: { SORGULAMA: 30 },
          responses: B(S`
            sinan: Ben mi? Arşivdeydim abla. On buçuktan on bire kadar. Kadastro paftalarının arasındaydım; bir ifraz dosyası için eski bir pafta lazımdı.
            sinan: Gürültüyü duyunca çıktım. Halil abiyi polisler arasında gördüm. İnanamadım. Hâlâ inanamıyorum.
            sinan: Bizim oda sabahları ana baba günüdür abla. Telefon susmaz, takipçi eksik olmaz. Arşive kaçmak bazen nefes almaktır.
            ~ Arşiv, on buçuktan on bire. Not defterime yazdım; o sabahı bana anlatan herkesin saatini yazdığım gibi.
          `),
          next: '$stay',
        }),
        option('SIN_BAYRAM', 'Bayram Öz’ün dosyası sizin servisinizde, değil mi?', {
          score: { SORGULAMA: 20 },
          responses: B(S`
            sinan: Evet, bizde. Şerhli bir dosya. Bayram'ı tanırım; takipçi, her gün buradadır. Babası rahmetli oldu, duydunuz mu? Yirmisinde. Allah rahmet eylesin.
            sinan: Halil abiye gitmiş galiba. Neden gittiyse... Dosya bizde. Halil abi kontrol; dosya ona gelmeden bir şey yapamaz zaten. Ama Bayram bilmez bunları, takipçidir.
            ~ "Dosya ona gelmeden bir şey yapamaz." Bunu bana bir Devir memuru söylüyor. Muhbirin ifadesinde başka bir şey yazıyor.
          `),
          next: '$stay',
        }),
        option('SIN_HALIL', 'Halil Bey’le aranız nasıldı?', {
          score: { SORGULAMA: 10 },
          responses: B(S`
            sinan: Abiyle mi? İyi. Yani... bazı dosyalarımı geri çevirdi, kızdım tabii. Herkes kızar. Ama haklıdır, eksik varsa eksiktir.
            sinan: Ben müdür yardımcılığı sınavını kazandım, atama bekliyorum. Halil abi tebrik etti. "Masaya otururken kuralı da yanına al" dedi. Unutmam.
            - Ekrandaki bir dosyayı kapattı, masadaki kâğıtları bir kenara itti. Kenarlarını hizalamadı; Halil'in odasından sonra bunu fark etmek tuhaftı.
            ~ Bir sınav, bir atama, bir tebrik. Bu binada herkesin beklediği bir sıra var.
          `),
          next: '$stay',
        }),
        back('SIN_GERI', 'Teşekkür et, çık', {
          enabledWhen: askedOne('SIN_SABAH', 'SIN_BAYRAM', 'SIN_HALIL'),
          lockedReason: ASKED_REASON,
          responses: B(S`
            - Kapıdan çıkarken Sinan arkamdan seslendi; sesi hâlâ sıcaktı.
            sinan: Avukat hanım! Halil abiye selamımı söyleyin. Kolay gelsin.
            ~ Bu binada herkes Halil'e selam yolluyor. Selamları toplasam bir dilekçe olur; ama hiçbiri delil değil.
          `),
        }),
      ],
    }),
    conversation('INV1_KOMISER', {
      ...INV1,
      title: 'Mali Şube',
      background: 'karakol',
      room: { label: 'EMNİYET · MALİ SUÇLARLA MÜCADELE ŞUBE', character: 'komiser' },
      onFirstEnter: [{ type: 'MEET', character: 'komiser' }],
      lines: B(S`
        = EMNİYET · MALİ SUÇLARLA MÜCADELE · 16.00 @karakol
        - Şube, bir muhasebe bürosuna benziyordu: dosya dolapları, hesap makineleri, duvarda bir organizasyon şeması. Kimse silah taşımıyormuş gibi; herkes taşıyordu.
        - Komiser Levent Arı masasından kalktı, elimi sıktı. Kırklarının ortasında, ütülü bir gömlek, kravatsız. Masasında bir çerçeve: üniformalı bir genç, mezuniyet töreni.
        komiser: Avukat hanım. Dosyayı biliyorum, tanık olarak çağrılacağım da. Konuşmamda bir sakınca yok; ama dosyanın gizli kısımlarını söylemem, onu da bilin.
        komiser: Bu bir kontrollü teslimattı. Ders kitabı gibi. Muhbir geldi, biz planladık, para işaretlendi, zarf çekmecede bulundu. Gerisi mahkemenin işi.
      `),
      choices: [
        option('KOM_BASLA', 'Soruşturma nasıl başladı? Halil Bey’in adı ilk ne zaman geçti?', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_komiser_dinleme')],
          responses: B(S`
            komiser: Bir müteahhit hakkında yürüyen bir dinleme vardı. Başka bir dosya. O dinlemede "kontrolcü" diye birinden söz edildi, birkaç kez.
            komiser: Sonra 11 Mart gecesi muhbir geldi, "kontrol memuru para istiyor" dedi. Aynı gece kayıtta "zarf yarın masada" cümlesi vardı. İkisi üst üste oturdu.
            > Dinleme kararı o tarihte hâlâ geçerli miydi?
            komiser: O teknik bir konu. Kayıtları biz çözeriz; kararın süresini savcılık takip eder. Bana gelen kayıttı, ben de kaydı tutanağa koydum.
            ~ "Bana gelen kayıttı." Bir kayıt nereden gelir? Bir kararın süresi biterse, sistem durur mu, yoksa biri durdurmak zorunda mı?
          `),
          next: '$stay',
        }),
        option('KOM_PARA', 'Zarftaki para kimin parasıydı?', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_para_emniyet')],
          responses: B(S`
            komiser: Bizim. Emniyetin. Kontrollü teslimatlarda böyle yapılır; seri numaraları kaydedilir, muhbire verilir, teslimden sonra el konulur. Usul bu.
            komiser: Muhbirin kırk bin lirası yoktu zaten. Takipçi; borçlu biri. Bizim paramız olmasa teslimat da olmazdı.
            ~ "Bizim paramız olmasa teslimat da olmazdı." Bir cümle. Komiser bunu bir gurur gibi söyledi; ben bir itiraf gibi duydum.
          `),
          next: '$stay',
        }),
        option('KOM_CIHAZ', 'Muhbirin kayıt cihazı neden kayıt almadı?', {
          score: { SORGULAMA: 20 },
          effects: [raise('fact_kayit_ariza')],
          responses: B(S`
            komiser: Teknik arıza. Olur. 10.39'da kesildi; muhbir sonra "cızırdadı, sustu" dedi. Cihazı emanete koyduk. İncelenmesine gerek görülmedi; zarf zaten çekmecedeydi.
            > Cihazı kim taktı, kim çıkardı?
            komiser: Ben taktım. Muhbir kendisi çıkardı, bize teslim etti. Bir sorun mu var?
            ~ Kendisi çıkardı. Kendisi teslim etti. Ve kimse bakmadı. Bazen bir cihaz, onu taşıyandan daha dürüst bir tanıktır; yeter ki biri sorsun.
          `),
          next: '$stay',
        }),
        option('KOM_ODA', 'Odaya girdiğinizde Halil Bey neredeydi?', {
          score: { SORGULAMA: 20 },
          effects: [raise('fact_komiser_oda')],
          responses: B(S`
            komiser: Biz girdiğimizde oda boştu, iki dakika sonra geldi. Ama arama onun huzurunda yapıldı; usule uygun. Zarf çekmecesindeydi.
            komiser: Muhbir zarfı ona verdiğini söyledi. Biz de verdikten sonra çekmeceye koyup çıktığını değerlendirdik. Mantıklı.
            ~ "Değerlendirdik." Bir tutanakta görülen ile değerlendirilen arasındaki mesafe, bazen bir insanın özgürlüğüdür.
          `),
          next: '$stay',
        }),
        option('KOM_OGUL', 'Masanızdaki fotoğraf?', {
          score: { SORGULAMA: 10 },
          effects: [raise('fact_komiser_ogul')],
          responses: B(S`
            - Komiser fotoğrafa baktı; yumuşadı, sonra yumuşadığını fark edip yeniden sertleşti.
            komiser: Oğlum. Polis okulundan mezun oldu geçen yıl. Ona ilk günden şunu söyledim: "Tutanak senin vicdanındır. Ne gördüysen onu yaz."
            komiser: Ben de öyle yazdım, avukat hanım. Ne gördüysem. Görmediğimi de... değerlendirdim. Değerlendirme de işimiz.
            ~ "Ne gördüysen onu yaz." İyi bir öğüt. Tutanağı bir daha okuyacağım; gördüğünü yazmış mı, değerlendirdiğini mi?
          `),
          next: '$stay',
        }),
        back('KOM_GERI', 'Teşekkür et, çık', {
          enabledWhen: askedOne('KOM_BASLA', 'KOM_PARA', 'KOM_CIHAZ', 'KOM_ODA', 'KOM_OGUL'),
          lockedReason: ASKED_REASON,
        }),
      ],
    }),
  ],
};
