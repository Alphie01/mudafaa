import {
  any,
  back,
  conversation,
  costOf,
  dec,
  fallback,
  flag,
  has,
  inc,
  interview,
  mood,
  objective,
  option,
  raise,
  sceneSearch,
  set,
  story,
  topic,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './dsl.js';
import { C2 } from './shared.js';

// 52-inv-insanlar: Tarık görüşmesi (konu × ton), ofis ve acil servis aramaları, hemşire, Hayri Bey, katılan vekili ve
// eski ortak. Etkinlikler hub'dan push ile gelir, `$return` ile döner.

const tapMiss = (id: string) =>
  fallback(id, 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  });

export const invInsanlar: CasePart = {
  nodes: [
    interview('INV_GORUSME', {
      ...C2,
      title: 'Tarık’la görüşme',
      hud: ['min', 'trust'],
      background: 'buro',
      room: { label: 'ARSLAN HUKUK · GÖRÜŞME ODASI', character: 'tarik' },
      lines: [
        W(
          { cmp: [{ visits: 'INV_GORUSME' }, '>', 1] },
          `
          # ARSLAN HUKUK · GÖRÜŞME ODASI |bg=buro
          > Tarık yine aynı sandalyede. Bu kez çizim yok. Kurşun kalem yine elinde.
          tarik: Ece’yi dörtte alıyorum. Bir çeyrek saatim daha var. Ne öğrendiniz?
        `,
        ),
        O(`
          # ARSLAN HUKUK · GÖRÜŞME ODASI — 14.45 |bg=buro
          > Tarık pencerenin önünde, ayakta. Aşağıda, Tophane’nin dar sokağında bir kamyonet geri geri manevra yapıyor.
          tarik: Kızımı üçte okuldan alıyorum. Yarım saatim var, sonra trafik başlar. Sorun.
          ~ On beş dakika. Bir insanın üç gecesini on beş dakikaya sığdıracağız.
          > Oturdu. Tık. Tık.
          tarik: Sorun. Ölçü verir gibi cevap veririm.
        `),
      ],
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
        { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla bilgi' },
      ],
      toneEffects: {
        soft: [inc('trust', 4), set('tone', 'soft')],
        hard: [dec('trust', 8), set('tone', 'hard')],
      },
      moodRules: [
        mood('Savunmada', 'error', 'kizgin', { cmp: [{ var: 'trust' }, '<', 40] }),
        mood('Gergin', 'neutral', 'kizgin', { cmp: [{ var: 'tone' }, '==', 'hard'] }),
        mood('Ölçülü', 'neutral', 'normal'),
      ],
      objectives: [
        objective('obj_geceler', flag('fact_uyku'), 'Üç gece: evde, hastanede, evde.', 'Üç gece Tarık neredeydi?'),
        objective(
          'obj_telefon',
          flag('fact_rizasiz'),
          'Kilidi istek üzerine açtı; hiçbir şey imzalamadı.',
          'Telefon Şube’de nasıl açıldı?',
        ),
        objective(
          'obj_erisim',
          flag('fact_sifre'),
          'Tek şifre; cihazları eski ortak kurdu.',
          'Hesaba başka kim erişebilirdi?',
        ),
      ],
      topics: [
        topic('TP_GECELER', 'O geceler', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_uyku'), raise('fact_hastane')],
          tones: {
            soft: {
              prompt: 'Üç geceyi anlatır mısınız? Saat ikiyi geçerken neredeydiniz?',
              says: S(`
                tarik: 6 Kasım. Evdeydim. Uyuyordum. On bir buçukta yatarım, bu benim yıllanmış alışkanlığım. Telefon mutfakta, tezgâhın üstünde şarjda durur; yatak odasına sokmam, ışığı uykumu böler.
                tarik: Sabah altıda kalkarım, ilk işim kahve. O gece de öyle oldu. Hiçbir şey olmamış gibi. Bir hafta sonra bir kadının o saatte benim adıma bir mesaj okuduğunu öğrendim.
                tarik: 12 Kasım. Aynı. Evdeydim, uyuyordum. Ertesi öğlen polis ofise geldi zaten. O gece bir şey yazmış olsam, uyurken rüyamda mı yazdım?
                tarik/uzgun: 9 Kasım… 9’u ayrı. O gece evde değildim. Babamın kalbi gece bir gibi tekledi. Göğsünü tuttu, rengi gitti. Arabaya attım, Çekirge’deki acile götürdüm.
                tarik/uzgun: Sabaha kadar o koridorda, bir plastik sandalyede oturdum. Babam perdenin ardında, ben önünde. Telefonum da yanımda değildi; hemşire şarja koydurttu.
                ~ Hastane. Üç geceden biri bir hastane. Kimse bu kelimeyi dosyaya yazmamış. Savcı yazmamış, polis yazmamış, önceki avukat bile yazmamış.
                ~ Bir mimarın en sevdiği şey sağlam zemindir. Bu adamın anlattığı gece, üstüne bir şey kurulabilecek ilk sağlam zemin.
              `),
            },
            hard: {
              prompt: 'Saat saat. 02.11, 02.14, 02.19. Neredeydiniz?',
              says: S(`
                tarik/kizgin: Saat saat mi? Peki. 6’sı 02.11: yataktaydım. Ece de evdeydi, salonda kanepede uyuyakalmıştı, taşıdım.
                tarik: 9’u 02.14: Çekirge’de, acil serviste. Babam sedyedeydi. 12’si 02.19: yine yataktaydım.
                tarik: Tanığım mı? Dokuz yaşında bir çocuk, bir hemşire ve kalbi teklemiş bir adam.
                ~ Hastane. Kimse bu kelimeyi dosyaya yazmamış.
              `),
              effects: [raise('fact_ece')],
            },
          },
        }),
        topic('TP_MELIS', 'Melis', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          tones: {
            soft: {
              prompt: 'Melis Hanım’la aranız nasıldı?',
              effects: [{ type: 'DISCOVER', evidence: 'clue_pay' }],
              says: S(`
                tarik: İyi bir mimar. Benden iyi, bunu söylemekten gocunmam. Restorasyonda gözü var; bir taşın hangi yüzyıldan kaldığını dokunarak bilir. Eski Pirinç Han’ın kemerlerini o gün gibi okur.
                tarik: İhaleye birlikte girdik. Restorasyon uzmanlık belgesi onda; o olmasa teklif bile veremezdim. Ortaklık onun imzasının üstüne kuruluydu.
                tarik: Pay oranında anlaşamadık. O yarı yarıya istedi, haklıydı belki. Ben altmışa kırk dedim, inat ettim. 25 Ekim gecesi sert yazıştık, ikimiz de uyumadık herhâlde.
                tarik: Ama sert söz başka, gece yarısı tehdit başka. Ben ona “bu şartlarla olmaz” dedim. “Sesini herkese dinletirim” demedim. Öyle bir şeyi düşünemem bile.
                tarik: Sonra konuşmadık. On beş gün sessizlik. Sonra bir sabah kapıda polis vardı. Aramızdaki o sessizliğin içine birisi girmiş, benim adıma konuşmuş.
              `),
            },
            hard: {
              prompt: 'Sert yazıştınız. Ne yazdınız tam olarak?',
              effects: [
                { type: 'DISCOVER', evidence: 'clue_pay' },
                { type: 'DISCOVER', evidence: 'clue_melis_teori' },
                raise('fact_pay_sert'),
              ],
              says: S(`
                tarik/kizgin: “Bu şartlarla devam edemeyiz.” Yazdım. “Kimse senin imzan için bana fazladan pay biçmez.” Onu da yazdım. Gerçek.
                tarik: Ama o geceki mesajlar… Belki kendisi yazdı. Bilmiyorum. İhaleden beni atmak için. Belge onda, teklif onun üstüne kalır.
                ~ İlk teori. En kolay teori. Kolay teoriler, genellikle müvekkilin içini rahatlatanlardır.
              `),
            },
          },
        }),
        topic('TP_KARAKOL', 'Şube’de telefon', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_rizasiz')],
          tones: {
            soft: {
              prompt: 'Şube’de telefonunuzu nasıl açtınız?',
              says: S(`
                tarik: Beni bir odaya aldılar. Florasan bir ışık, çatlak bir duvar saati. “Kilidi açar mısınız, şöyle bir bakacağız, sizin de lehinize” dedi.
                tarik: Açtım. Ne bakacaklarını bilmiyordum, saklayacak bir şeyim de yoktu. Parmağımı ekrana koydum, o aldı. Sonra menülerde dolaştı, bir şeyler buldu.
                tarik: Bir kâğıt imzalamadım. “İmzayı sonra alırız” dedi. O sonra hiç gelmedi. Ben de aklımdan çıkardım; suçsuz insan imza düşünmez.
                tarik: Telefonu kahverengi bir zarfa koydu, ağzını bantladı. Mum yoktu, mühür yoktu, bir bant. Çekmecesine attı, çekmeceyi kilitledi. Ben çıktım, dışarıda yağmur başlamıştı.
                tarik: İki gün sonra geri aldım. Aynı zarf, aynı bant. Kim açtı, kim kapadı, bilmiyorum. Bir mimar olsam, o zarfa bakıp “bu kapı iki kez açılmış” derdim.
              `),
            },
            hard: {
              prompt: 'Rıza verdiniz mi, vermediniz mi? Net olsun.',
              says: S(`
                tarik/kizgin: Rıza mı? Polis “açın” dedi, açtım. Bu rıza mı? Bilmiyorum. Hayır demek aklıma gelmedi. Saklayacak bir şeyim yoktu.
                tarik: “İmzayı sonra alırız” dedi. Kâğıdı hiç görmedim. Zarfın üstünde mühür, mum, bir şey yoktu. Bant.
              `),
            },
          },
        }),
        topic('TP_SIFRE', 'Şifre', {
          visibleWhen: has('ev_not'),
          cost: costOf('min', 3),
          score: { SORGULAMA: 30 },
          effects: [raise('fact_sifre')],
          tones: {
            soft: {
              prompt: 'Ofiste klavyenin altında bir not buldum. “Ece2016!”',
              says: S(`
                tarik/uzgun: Ece’nin doğduğu yıl. Sonuna bir ünlem. Wifi, banka, e-posta, PUSULA, bilgisayar oturumu. Hepsi aynı. Biliyorum, biliyorum.
                tarik: Mimarım avukat hanım, kasa çilingiri değil. Bir binanın bütün kapılarına tek anahtar yapmak hatadır, bunu bilirim. Ama kendi hayatıma aynı hatayı yapmışım.
                tarik: O notu ben yazmadım ama. Benim elimden çıkmaz öyle bir şey, büyük harfle, üç noktayla. Birisi “herkes kullansın” diye yazıp klavyenin altına yapıştırmış.
                tarik: Düşünsenize: şifrem bir masanın üstünde, bir kâğıtta, aylarca durmuş. Ofise gelen herkes görebilirdi. Stajyer, kargocu, müşteri. Ve bir de ortağım.
                ~ Tek bir anahtar. Ve o anahtar bir masanın üstünde, bir klavyenin altında, herkesin gözü önünde durmuş. Soru şu: kim eğilip aldı?
              `),
            },
            hard: {
              prompt: 'PUSULA şifreniz de bu mu? Kim biliyordu?',

              says: S(`
                tarik/kizgin: Evet. Kim biliyordu? Ofise gelen herkes. Stajyer, temizlikçi, müşteriler, kargocu. Wifi şifresi sonuçta.
                tarik: Cihazları ben kurmadım zaten. Bilgisayar işlerine Ozan bakardı. Eski ortağım. Telefon, tablet, ofis dizüstüleri. Hepsini o ayarladı.
              `),
            },
          },
        }),
        topic('TP_OZAN', 'Eski ortak', {
          visibleWhen: any(has('clue_dock'), has('clue_uslup_ozan'), flag('fact_sifre')),
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          tones: {
            soft: {
              prompt: 'Ozan Bey’den bahseder misiniz?',
              says: S(`
                tarik: On yıllık arkadaşım. Üç yıllık ortağım. Mart’ta ayrıldık. Para, iş, her zamanki şeyler. Kavga ettik, kapıyı çarptı.
                tarik: İddianamede tanık. Benim ona Melis hakkında bir şey söylediğimi anlatmış. Söylemedim. Ama Ozan… Ozan böyle bir şey yapmaz. Abartır, yalan söylemez.
                tarik: Masası hâlâ boş. Bir dizüstü vardı, ofisin. Bozuldu dedi, attım dedi. Mali müşavir bir tutanak tuttu galiba.
              `),
            },
            hard: {
              prompt: 'Ayrılık ne kadar kötüydü?',

              says: S(`
                tarik/kizgin: Kötü. Bana “Bu ofisi ben ayakta tuttum, sen çizim yaptın” dedi. Ben de ona “Sen ihale kovaladın, ben bina yaptım” dedim.
                tarik: Şimdi Nilüfer’de kendi firması var. Tekin Yapı. Pirinç Han’a o da teklif verdi. Ama bu… bu ayrı bir şey.
                tarik: Cihazların hepsini o kurmuştu. Dizüstüsü bozulmuş. Öyle dedi.
              `),
            },
          },
        }),
        topic('TP_CIHAZ', 'Bağlı cihazlar', {
          visibleWhen: has('clue_cihaz3'),
          cost: costOf('min', 3),
          score: { SORGULAMA: 30 },
          effects: [raise('fact_hesap_fikri')],
          tones: {
            soft: {
              prompt: 'Raporun ekinde “cihaz 3” diye bir kayıt var. Ne olabilir?',
              says: S(`
                tarik/saskin: Cihaz 3? Benim bir telefonum var, bir tane. Cihaz 0 o olmalı. Ofiste bir tablet vardı, stajyer Kübra kullanırdı, o da ikidir herhâlde.
                tarik: Üç? Üçüncü bir cihaz… Aklıma ofisin eski bilgisayarları geliyor. Ben hiçbirine kendi elimle hesap kurmadım. O işlere hep Ozan bakardı.
                tarik: PUSULA’da bir “bağlı cihazlar” diye bir ekran vardı galiba. Hiç açmadım. Açsaydım belki bugün burada olmazdık. Mimarlar menü okumaz, çizim okur.
                tarik: Telefon emanette ama hesap benim. Yeni bir telefona girerim, o listeyi açarız. Ne isterseniz. Ben artık her kapıyı açmaya hazırım, yeter ki doğru kapı olsun.
                ~ Hesap onun. Hesabın sahibi kendi geçmişini isteyebilir. Polisin iki gün uğraşıp alamadığı şeyi, bir adam telefonuna bir düğmeyle indirebilir.
                ~ Üç cihaz. Biri onun. Biri bir çocuğun oyuncağı. Üçüncüsü? Üçüncüsü bu davanın tamamı.
              `),
            },
            hard: {
              prompt: 'Hesabınıza başka bir cihazdan girildiyse bilmeniz gerekirdi. Neden bilmiyorsunuz?',
              says: S(`
                tarik/kizgin: Neden mi? Çünkü bir mesajlaşma uygulamasının ayar menüsünü okumak için mimar olmadım.
                tarik: Bir ekranı vardı. “Bağlı cihazlar.” Hiç açmadım. Hesap benim; yeni bir telefona açarım, bakarız. Ne istiyorsanız.
              `),
            },
          },
        }),
        topic('TP_IHALE', 'İhale', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          tones: {
            soft: {
              prompt: 'Eski Pirinç Han ihalesini anlatır mısınız? Kimler teklif verdi?',
              says: S(`
                tarik: Vakıf, Han’ı restore ettirecek. Üç firma teklif verdi. Biri biz: ben ve Melis. Biri büyük bir şirket, şansları zayıf. Biri de… Tekin Yapı.
                tarik: Ozan’ın firması. Ayrıldıktan sonra Nilüfer’de kurdu. İlk işi de eski ortağının girdiği ihaleye girmek oldu. Bursa küçük, diyorlar. Bazen fazla küçük.
                tarik: Melis çekilse, bizim teklif düşerdi; restorasyon belgesi onda. Teklif düşünce de sıralama değişirdi. Kimin lehine, hiç düşünmemiştim. O gece kadar.
                ~ Bir ihale. Bir belge. Bir kadının çekilmesi. Kimin işine yarardı? Soru bu kadar basit olabilir mi?
              `),
            },
            hard: {
              prompt: 'Melis çekilseydi kim kazanırdı?',
              says: S(`
                tarik/kizgin: Düşünmek istemiyordum ama soruyorsunuz: Melis çekilseydi bizim teklif düşerdi. Kalan iki firmadan biri Tekin Yapı. Ozan.
                tarik: Bunu söylemek bile ağır geliyor. On yıllık arkadaşım. Ama siz sordunuz, ben de rakamları veriyorum. Rakamlar yalan söylemez.
              `),
            },
          },
        }),
        topic('TP_ECE', 'Kızın', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 10 },
          tones: {
            soft: {
              prompt: 'Ece nasıl? Bu süreç ona nasıl yansıdı?',
              says: S(`
                tarik/uzgun: Dokuz yaşında. Haftada üç gün bende. O günler benim için bayram, onun için sıradan; çocuklar öyledir, kıymeti sonra anlarlar.
                tarik: Okulda bir şey duymuş. “Baban kötü mesaj mı attı?” diye sordu. Yalan söyleyemedim, “hayır” dedim ama “ispatlayacağım” diyemedim. Henüz diyemiyorum.
                tarik: Geçen akşam çizim yaparken yanıma geldi, “Ben büyüyünce avukat olacağım, babaları kurtaracağım” dedi. Ne diyeceğimi bilemedim.
                ~ Bu adamın en büyük korkusu hapis değil. Kızının gözündeki soru işareti. Ve ben o soru işaretini silmek için buradayım.
              `),
            },
            hard: {
              prompt: 'Kızınız için en çok neyden korkuyorsunuz?',
              says: S(`
                tarik: İçeri girmekten değil. Ece’nin bir gün “demek yapmışsın” diye düşünmesinden. Bir kere bile. Bir an bile.
                tarik: Bu yüzden beraat yetmez bana. “Yapmadığı anlaşıldı” lazım. İkisi farklı, biliyorum. Siz de biliyorsunuz.
              `),
            },
          },
        }),
        topic('TP_AVUKAT', 'Önceki avukat', {
          visibleWhen: { visited: 'INV_GORUSME' },
          cost: costOf('min', 3),
          score: { SORGULAMA: 10 },
          tones: {
            soft: {
              prompt: 'Önceki avukatınız neden çekildi?',
              says: S(`
                tarik: “Mesajlar telefonunda Tarık Bey, ben ne yapayım” dedi. Üç celse boyunca aynı cümle. Dosyayı hiç açmadı sanırım.
                tarik: Ekleri okumamış. Sadece sonucu okumuş, sonuç da beni gösteriyor. Sizin gibi “çerçevenin dışı” demedi hiç.
                tarik: Çekilince rahatladım aslında. Umutsuz bir avukat, umutsuzluğu bulaştırıyor.
              `),
            },
            hard: {
              prompt: 'Önceki avukatınız dosyada ne kaçırdı?',
              says: S(`
                tarik: Her şeyi. O sütunu, o imzasız tutanağı, hastaneyi. Hiçbirini sormadı. Belki de ben anlatamadım; korkudan.
              `),
            },
          },
        }),
        topic('TP_VAKIF', 'Vakıf görüşmesi', {
          visibleWhen: { visited: 'INV_GORUSME' },
          cost: costOf('min', 3),
          score: { SORGULAMA: 10 },
          tones: {
            soft: {
              prompt: 'Melis’in vakıfla bir özgeçmiş görüşmesi mi vardı?',
              says: S(`
                tarik: Evet. Vakıf, ekipteki herkesle tanışmak istemişti. Melis’in özgeçmişinde iki yıllık bir boşluk vardı; onu nasıl anlatacağını düşünüyordu.
                tarik: Bana “o dönemi bir arkadaşıma danışacağım” demişti. Meğer o arkadaş bendim; o kaydı, o belgeyi bana göndermiş. Bana güvenmiş.
                tarik: Ve o güven, benim hesabımdan ona karşı kullanıldı. En çok bu koyuyor. Güvendiği yerden vuruldu, hem de benim adımla.
              `),
            },
            hard: {
              prompt: 'O belgeleri sana neden gönderdi?',
              says: S(`
                tarik: Güvendiği için. “Sen mimarsın, soğukkanlısın, nasıl anlatayım” dedi. Ben de bir dosyaya koydum, kimse görmesin diye. Meğer biri görmüş.
              `),
            },
          },
        }),
        topic('TP_SABAH', 'O sabah', {
          visibleWhen: { visited: 'INV_GORUSME' },
          cost: costOf('min', 3),
          score: { SORGULAMA: 10 },
          tones: {
            soft: {
              prompt: 'Polis ofise geldiği sabahı anlatır mısın?',
              says: S(`
                tarik: Çizim masasındaydım, vakfa teslim edeceğim projeyi bitiriyordum. İki sivil geldi. “Telefonunuzu alın” dediler.
                tarik: İçimden “saklayacak bir şeyim yok” dedim, verdim. Şimdi düşünüyorum: belki de en büyük hatam, hiçbir şey saklamayacak kadar rahat olmamdı.
                tarik: Şube’de o arşiv klasörünü açtıklarında dünyam döndü. Kendi adımla yazılmış cümleler. Hiç yazmadığım cümleler.
              `),
            },
            hard: {
              prompt: 'Telefonu neden hemen verdin? Bir avukat aramadın mı?',
              says: S(`
                tarik: Aramadım. Suçsuz insan avukat aramaz sandım. Yanılmışım. İlk dersim bu oldu: suçsuzluk, tek başına bir savunma değildir.
              `),
            },
          },
        }),
      ],
      finish: { id: 'G_BITIR', label: 'Görüşmeyi bitir' },
    }),
    story('INV_OFIS_GIRIS', {
      ...C2,
      title: 'Aksoy Mimarlık',
      background: 'buro',
      lines: B(`
        # ESKİ PİRİNÇ HAN · ÜST KAT — 10.00 |bg=buro
        > Han’ın taş merdiveni yüz elli yıldır aynı yerden aşınıyor; basamakların ortası çukurlaşmış.
        > Kapıda pirinç bir tabela: “AKSOY TEKİN MİMARLIK”. “TEKİN” kelimesinin üstü siyah bantla kapatılmış, ama bant kenarından kıvrılmış; altındaki harfler hâlâ okunuyor.
        tarik: Buyurun. Polis bir şeye dokunmadı, telefonumu aldılar yalnızca. Buraya hiç çıkmadılar bile.
        tarik: Ozan’ın masası altı aydır öyle duruyor; silmeye kıyamadım, belki de temizlemek istemedim.
        > Kemerlerin altında iki çizim masası. Birinin üstünde kâğıt yığınları, maketler, bir kahve fincanı.
        > Öbürü boş, tozlu, bir mezar taşı kadar sessiz. Pencereden Tophane’nin çatıları ve yağmurun ince sesi.
        ~ Polis buraya bakmamış. Polis bir telefona bakmış, bir isim görmüş, defteri kapamış. Oysa bir hikâye hep iki masa arasında saklanır.
        ~ Boş masa en çok konuşan masadır. Üstündeki tozda bile bir biçim var: bir şeyin durduğu, sonra alındığı yer.
        > Sahnede dikkatini çeken yerlere dokun. Boş yere dokunmak bir büyüteç hakkı yer.
      `),
      choices: [{ id: 'OFIS_BASLA', kind: 'CONTINUE', label: 'Ofisi ara', next: 'INV_ARAMA_OFIS' }],
    }),
    sceneSearch('INV_ARAMA_OFIS', {
      ...C2,
      title: 'Aksoy Mimarlık · ofis',
      hud: ['taps'],
      exposeCounts: true,
      background: 'buro',
      scene: 'sc_ofis',
      instruction: 'Ofiste şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps',
      miss: tapMiss('FB_OFIS'),
      finish: { id: 'OFIS_BITIR' },
    }),
    story('INV_HASTANE_GIRIS', {
      ...C2,
      title: 'Acil servis',
      background: 'hastane',
      lines: B(`
        # DEVLET HASTANESİ · ACİL SERVİS — 23.40 |bg=hastane
        > Bilerek aynı saatte geldim. Bir yeri anlamak istiyorsan, onu kendi saatinde görmelisin. Gece yarısına yirmi dakika var. Bekleme sırasında bir adam elindeki serumla uyukluyor; bir kadın telefonda alçak sesle ağlıyor.
        > Florasan ışık her şeyi aynı solgun renge boyuyor: sedyeleri, duvarları, bekleyenlerin yüzlerini. Bir kokteyl: dezenfektan, soğuk çay, yorgunluk.
        ~ Tarık bir kasım gecesi tam burada oturdu. Babası arkadaki perdenin ardında, monitöre bağlı. O önünde, bir plastik sandalyede, sabahı bekliyordu.
        ~ Soru basit: o beklerken telefonu neredeydi? Cebinde mi, elinde mi, yoksa başka bir yerde mi? Bu hastane her şeyin saatini yazar; belki bunun da yazmıştır.
        > Sahnede dikkatini çeken yerlere dokun.
      `),
      choices: [{ id: 'HAST_BASLA', kind: 'CONTINUE', label: 'Acil servise bak', next: 'INV_ARAMA_HASTANE' }],
    }),
    sceneSearch('INV_ARAMA_HASTANE', {
      ...C2,
      title: 'Acil servis',
      hud: ['taps2'],
      exposeCounts: true,
      background: 'hastane',
      scene: 'sc_hastane',
      instruction: 'Acil serviste dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps2',
      miss: tapMiss('FB_HASTANE'),
      finish: { id: 'HASTANE_BITIR' },
    }),
    conversation('INV_T_GULAY', {
      ...C2,
      title: 'Hemşire Gülay Tunç',
      background: 'hastane',
      room: { label: 'ACİL SERVİS · HEMŞİRE MASASI', character: 'gulay' },
      onFirstEnter: [{ type: 'MEET', character: 'gulay' }],
      lines: B(`
        # ACİL SERVİS · HEMŞİRE MASASI — 03.10 |bg=hastane
        > Nöbetin en ölü saati. Hemşire bir dosyaya bir şeyler yazıyor, bir yandan da soğumuş çayını içiyor.
        gulay: Avukat mısınız? Gece üçte avukat. Hayırdır. Kim öldü?
        P: Kimse. Kasımda bir gece, bir hastanın oğlu. Tarık Aksoy. Necati Aksoy’un oğlu.
        gulay: Necati Bey. Ritim. Hatırlıyorum, kalp hastası unutulmaz. Oğlu da… mimar mıydı neydi.
      `),
      choices: [
        option('GUL_TEL', 'O gece telefonunu nerede bıraktığını hatırlıyor musunuz?', {
          score: { SORGULAMA: 40 },
          effects: [raise('fact_gulay')],
          responses: B(`
            gulay: Hatırlıyorum, çünkü azarladım. Şarj istasyonunu sırf bizim telefonlar için koyduk; o geldi, “Şarjım bitti” dedi, taktı.
            gulay: Masam priz değil dedim. Sonra babasının hâlini görünce sustum. Bandına adını ve saati yazdım. Kural.
            gulay: Sabah altıya kadar orada durdu. Ellemedi bile. Adam perdenin önünden ayrılmadı.
          `),
        }),
        option('GUL_ONAM', 'Onam formunun saatini kim yazar?', {
          score: { SORGULAMA: 20 },
          responses: B(`
            gulay: Biz yazarız. Hasta yakını imzalar, saati biz yazarız, altına bir de biz imza atarız. Mahkemelik olur diye.
            gulay: Bakın, mahkemelik oldu işte.
          `),
        }),
        option('GUL_TANIK', 'Gerekirse mahkemede bunu anlatır mısınız?', {
          neutral: 'Tanığa ne söyleyeceğini değil, ne gördüğünü sormak doğru yoldur; çağrılırsa tanık kendi bildiğini anlatır.',
          responses: B(`
            gulay: Çağırırlarsa gelirim. Nöbetim yoksa. Gördüğümü söylerim, gördüğümden fazlasını değil.
            ~ İyi. Gördüğünden fazlasını söyleyen tanık, gördüğünü de yaktırır.
          `),
        }),
        option('GUL_YONLENDIR', '“Saat tam 02.00’de oradaydı” derseniz çok yardımcı olursunuz.', {
          score: { USUL_BILGISI: -50 },
          effects: [inc('ethics')],
          bad: 'Tanığa ne söyleyeceğini telkin etmek avukatlık meslek kurallarına aykırıdır; tanığı etkilemeye çalışmak TCK 277 kapsamında suç oluşturabilir.',
          responses: B(`
            gulay/kizgin: Ben ne gördüysem onu söylerim avukat hanım. Bana saat ezberletmeyin.
            > Dosyasını kapattı ve bana sırtını döndü.
            ~ Yanlış. Bunu yapmamalıydım.
          `),
        }),
        back('GUL_BITIR', 'Teşekkür et ve çık'),
      ],
    }),
    conversation('INV_T_HAYRI', {
      ...C2,
      title: 'Hayri Sezer',
      background: 'kafe',
      room: { label: 'BURSA KÜLTÜR VAKFI · KOZA HAN', character: 'hayri' },
      onFirstEnter: [{ type: 'MEET', character: 'hayri' }],
      lines: B(`
        # KOZA HAN · VAKIF ODASI — 11.00 |bg=kafe
        > Koza Han’ın avlusunda ipek satıcıları tezgâh açmış. Üst kattaki vakıf odası küçük, kitap kokulu. Hayri Bey çay söyledi, ben söylemeden.
        hayri: Evladım, hanlar insanlara benzer. Dışı taş, içi avlu. Avluda ne olduğunu ancak içeri girersen görürsün.
        hayri: Tarık Bey’in avukatısınız. Bu iş beni çok üzdü. Hem o kızcağız için, hem Tarık Bey için. İkisini de severdim.
      `),
      choices: [
        option('HAY_SAAT', 'Ses kaydı size ne zaman geldi?', {
          score: { SORGULAMA: 40 },
          effects: [raise('fact_hayri_saat')],
          responses: B(`
            > Cebinden eski bir telefon çıkardı, gözlüğünü alnından burnuna indirdi, ekranı bana çevirdi.
            hayri: Bakın. 9 Kasım. 02.14. Uyuyordum, sesine uyandım. Bizim yaşta gece gelen mesaj kötü haberdir; açtım.
            hayri: Silmedim bildirimi. Savcılık sordu, gösterdim. Saati yazdılar mı bilmem.
          `),
        }),
        option('HAY_DINLEDI', 'Kaydı dinlediniz mi?', {
          score: { SORGULAMA: 20 },
          responses: B(`
            hayri: Üç saniye. Bir kadının ağladığını duydum, kapattım. Başkasının sesini dinlemem evladım. Hele ağlayan bir sesi.
            hayri: Ertesi gün Melis Hanım’ı aradım. “Kızım, bir şey geldi, dinlemedim” dedim. Sesi titriyordu.
          `),
        }),
        option('HAY_DEDIKODU', 'Bu kayıttan başka kimin haberi oldu?', {
          score: { ARASTIRMA: 20 },
          responses: B(`
            hayri: Ertesi hafta bütün teklif sahipleri biliyordu. Üç firma var ihalede. Bursa küçük, evladım; bir avlu.
            hayri: Kimden çıktı bilmem. Benden çıkmadı, onu bilirim.
          `),
        }),
        option('HAY_YONLENDIR', 'Mahkemede “Tarık Bey o saatte hastanedeydi” derseniz çok iyi olur.', {
          score: { USUL_BILGISI: -50 },
          effects: [inc('ethics')],
          bad: 'Tanığın bilmediği bir olguyu söylemesini istemek telkindir; meslek kurallarına aykırıdır ve TCK 277 kapsamında tanığı etkileme sayılabilir.',
          responses: B(`
            hayri/uzgun: Evladım, ben Tarık Bey’in nerede olduğunu bilmem. Benim bildiğim telefonumdaki saat. Ben onu söylerim.
            ~ Haklıydı. Yaşlı bir adam bana mesleğimi hatırlattı.
          `),
        }),
        back('HAY_BITIR', 'Çayın için teşekkür et'),
      ],
    }),
    conversation('INV_T_KUBRA', {
      ...C2,
      title: 'Stajyer Kübra',
      background: 'kafe',
      room: { label: 'TOPHANE · BİR KAHVE', character: 'kubra' },
      onFirstEnter: [{ type: 'MEET', character: 'kubra' }],
      lines: B(`
        # TOPHANE · KÜÇÜK BİR KAHVE — 13.00 |bg=kafe
        > Han’ın yanındaki kahvede, köşede bir masa. Karşımda yirmi iki yaşında bir mimarlık öğrencisi: Kübra. Aksoy Tekin’de bir yıl staj yapmış.
        > Elinde bir fincan, parmakları tedirgin. “Başım derde girer mi?” diye sordu önce. “Hayır,” dedim. “Yalnızca gerçeği.”
        kubra: Tarık Bey iyi adamdır abla. Ozan Bey de… O da iyiydi. Ama farklıydılar. Tarık Bey çizerdi, Ozan Bey konuşurdu.
      `),
      choices: [
        option('KUB_TABLET', 'Ofis tabletini sen mi kullanıyordun?', {
          score: { ARASTIRMA: 30 },
          responses: B(`
            kubra: Evet, ben kullanıyordum; müşteri sunumları için. Üçüncü demirbaş, tablet. Ayrılırken teslim ettim, sıfırladılar.
            kubra: Kasımda ben artık yoktum zaten, stajım eylülde bitti. O tabletle bir işim olamaz.
          `),
        }),
        option('KUB_WIFI', 'Ofisin wifi şifresini biliyor muydun?', {
          score: { ARASTIRMA: 30 },
          responses: B(`
            kubra: “Ece2016!” Herkes bilirdi abla, klavyenin altında yazardı. Ben bile bilirdim, kargocu bile.
            kubra: Bir keresinde Tarık Bey’e “bu riskli” demiştim. Güldü, “ben mimarım, hacker değil” dedi. Keşke dinleseymiş.
          `),
        }),
        option('KUB_CIHAZLAR', 'Bilgisayarları kim kurardı?', {
          visibleWhen: has('clue_cihaz3'),
          score: { ARASTIRMA: 30 },
          responses: B(`
            kubra: Ozan Bey. Bütün “dijital işler” onundu; mailler, bulut, yedekler, oturumlar. Tarık Bey bir şifreyi bile zor girerdi.
            kubra: Ozan Bey bir keresinde “Tarık’ın hesabını ofis bilgisayarına da kurdum, buradan da yazsın” demişti. Övünerek söylemişti, pratik diye.
          `),
        }),
        option('KUB_OZAN', 'Ozan Bey ayrıldıktan sonra görüştünüz mü?', {
          visibleWhen: has('clue_dock'),
          score: { ARASTIRMA: 20 },
          responses: B(`
            kubra: Bir kere. Nilüfer’de yeni ofisini açmış, beni işe çağırdı. Gitmedim; Tarık Bey’e ayıp olurdu.
            kubra: Masasında bir dizüstü vardı; bizim ofistekilere benziyordu. Etiketine bakmadım, emin değilim. Ozan Bey “eski dostlar ömür boyu yeter” demişti, gülerek.
          `),
        }),
        option('KUB_YONLENDIR', '“Ozan o dizüstüyü kullanıyordu” dersen çok iyi olur.', {
          score: { USUL_BILGISI: -40 },
          effects: [inc('ethics')],
          bad: 'Tanığa ne söyleyeceğini telkin etmek meslek kurallarına aykırıdır; gördüğünü sorabilirsin, söyleyeceğini değil.',
          responses: B(`
            kubra: Ben gördüğümü söylerim abla. Emin olmadığım şeyi söyleyemem. Bana ağız yapmayın lütfen.
            > Fincanını bıraktı, sandalyesini geri itti.
          `),
        }),
        back('KUB_BITIR', 'Teşekkür et'),
      ],
    }),
    conversation('INV_T_SINAN', {
      ...C2,
      title: 'Av. Sinan Bulut',
      background: 'kafe',
      room: { label: 'ADLİYE KANTİNİ', character: 'sinan' },
      onFirstEnter: [{ type: 'MEET', character: 'sinan' }, { type: 'MEET', character: 'melis' }],
      lines: B(`
        # ADLİYE · KANTİN — 12.30 |bg=kafe
        > Kantin kalabalık; cübbeler sandalyelerin arkasına asılmış. Av. Sinan Bulut tek başına, önünde bir tost, yanında dört dosya.
        sinan: Meslektaşım. Otur lütfen. Tarık Aksoy’un yeni avukatı. Tebrik etmeyeceğim; kolay bir dosya değil.
        sinan: Müvekkilem çok yıprandı. Bilmeni isterim. Bu bir ticari kavga değil. Bir kadının en kötü dört yılı, gece yarısı, bir yabancının telefonuna gitti.
      `),
      choices: [
        option('SIN_KAPI', 'Müvekkilinizle, sizin aracılığınızla ve huzurunuzda görüşmek isterim.', {
          score: { USUL_BILGISI: 40 },
          effects: [raise('fact_sinan_kapi')],
          good: 'Karşı tarafın avukatı varken onunla doğrudan değil, avukatı aracılığıyla temas kurulur (TBB Meslek Kuralları). Doğru kapıyı çaldın.',
          responses: B(`
            sinan: Kibarsın. Şimdi olmaz. Duruşmadan önce olmaz. Ama aklımda tutarım.
            sinan: Sana bir şey söyleyeyim, kayda geçmesin: müvekkilem ilk gece bana “Tarık hiç nokta koymaz” dedi. Sonra ses kaydı Hayri Bey’e gitti ve bir daha bunu söylemedi.
            ~ Nokta. Bir avukat bana bir noktayı hediye etti.
          `),
        }),
        option('SIN_DOGRUDAN', 'Melis Hanım’ı doğrudan arayıp konuşacağım.', {
          score: { USUL_BILGISI: -50 },
          effects: [inc('ethics'), raise('melis_dogrudan')],
          bad: 'Avukatı bulunan karşı tarafla avukatı atlanarak doğrudan görüşmek meslek kurallarına aykırıdır; katılanı etkileme girişimi gibi de algılanır.',
          responses: B(`
            sinan/kizgin: Denersen baroya yazarım. Ciddiyim. Müvekkilemle konuşacaksan benimle konuşursun.
            > Tostunu yarım bıraktı, dosyalarını topladı, kalktı.
          `),
        }),
        option('SIN_UYDURMA', 'Bu mesajları müvekkiliniz kendisi yazmış olabilir mi?', {
          score: { SAVUNMA_STRATEJISI: -40 },
          bad: 'Somut dayanak olmadan mağduru suçlamak hem savunmayı zayıflatır hem de iftira (TCK 267) riski doğurur. Mesajlar sanığın hesabında duruyor; mağdurun uydurduğuna dair tek bir veri yok.',
          responses: B(`
            sinan: Bunu mahkemede söylersen salondaki herkes sana döner. Hâkim dahil.
            sinan: Mesajlar senin müvekkilinin hesabında meslektaşım. Benimkinin değil.
            ~ Haklı. Tarık’ın teorisi, Tarık’ı rahatlatıyor. Beni değil.
          `),
        }),
        back('SIN_BITIR', 'Kalk ve vedalaş'),
      ],
    }),
    conversation('INV_T_OZAN', {
      ...C2,
      title: 'Ozan Tekin',
      background: 'buro',
      room: { label: 'TEKİN YAPI DANIŞMANLIK · NİLÜFER', character: 'ozan' },
      onFirstEnter: [{ type: 'MEET', character: 'ozan' }, raise('ozan_ziyaret')],
      lines: B(`
        # TEKİN YAPI DANIŞMANLIK · NİLÜFER — 15.30 |bg=buro
        > Yeni bir plaza, cam cephe, girişte bir bonsai. Ozan Tekin beni asansörün önünde karşıladı, kolunu omzuma attı.
        ozan/mutlu: Avukat hanım! Üstat! Buyurun, buyurun. Çay mı, kahve mi? Simit de var, Tophane’den getirttim, eski alışkanlık.
        ozan: Tarık’ın avukatısınız. Biliyorum. Bursa bir avlu, herkes her şeyi duyar. Çok üzüldüm. On yıllık arkadaşım.
        ozan: Bakın, şimdi size bir şey anlatayım: Pirinç Han’ın doğu kanadında bir kemer var, 1890’da yıkılmış, yeniden örülmüş. Taşlar başka taşlar. Ama kemer aynı kemer.
        ~ Bir hikâye. Neden anlattığını bilmiyorum. O da bilmiyor olabilir.
      `),
      choices: [
        option('OZ_BEYAN', 'Kolluktaki beyanınızı konuşmak istiyorum.', {
          score: { SORGULAMA: 30 },
          responses: B(`
            ozan: Tabii üstat. Ekim ortasıydı galiba. Tophane’de, türbenin altındaki çay bahçesinde. Tarık çok sinirliydi, Melis’e kızıyordu.
            ozan/uzgun: “Onun sırlarını biliyorum, pişman edeceğim” dedi. Ben de “Saçmalama” dedim. Ciddiye almadım. Sonra bunlar oldu.
            ozan: Melis’in avukatı aradı, ben de bildiğimi söyledim. Ne yapayım, yalan mı söyleyeyim?
          `),
        }),
        option('OZ_CIHAZ', 'Ofisten ayrılırken cihazları teslim ettiniz mi? Bir dizüstü sorulabilir.', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [raise('ozan_uyarildi')],
          bad: 'Savunmanın teknik teorisini, delil güvenceye alınmadan dosyanın bir tanığına açtın. Bir delil, güvenceye alınmadan önce kimseye haber verilmez.',
          responses: B(`
            ozan: Dizüstü mü? Ha, o. Bozuldu üstat. Ekranı gitti, attım. Nurten Hanım’a da söyledim. Neden sordunuz?
            > Gülümsemesi bir saniyeliğine durdu. Sonra yeniden başladı, aynı yerden.
            ozan: Her şeyi teslim ettim. Bir koli dolusu. Anahtar, cetvel, ne varsa.
          `),
        }),
        option('OZ_TARIK', 'Tarık Bey nasıl biridir sizce?', {
          score: { SORGULAMA: 10 },
          responses: B(`
            ozan: Tarık mı? Dâhi. Bir kemeri ilk bakışta görür. Ama insanları görmez üstat. İnsanlara hep tek bir anahtarla yaklaşır.
            ozan: Herkese güvenir. Sonra şaşırır. Bu dava da öyle bir şaşkınlık bence.
          `),
        }),
        back('OZ_BITIR', 'Duruşmada görüşmek üzere', {
          responses: B(`ozan/mutlu: Ne zaman isterseniz üstat. Kapım açık. Hadi, saygılar.`),
        }),
      ],
    }),
  ],
};

