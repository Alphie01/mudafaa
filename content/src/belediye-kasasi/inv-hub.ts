import {
  all,
  any,
  cmp,
  cont,
  decisionNode,
  flag,
  flags,
  has,
  hiddenEnum,
  hiddenInt,
  inc,
  nav,
  not,
  option,
  raise,
  ref,
  set,
  story,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { INV, p1 } from './shared.js';

// 50-investigation: soruşturma hub’ı (3 gün × 4 EP), Leyla’ya danışma, gün sonları ve duruşmadan önceki gece.

const hubChoices = {
  yer: [
    p1.activity('H_VEZNE', 'Vezne salonuna git', 'INV_VEZNE', {
      once: true,
      description: 'Hisarönü Belediyesi · zemin kat',
    }),
    p1.activity('H_EV', 'Kılıçların evine git', 'INV_EV_G', {
      once: true,
      description: 'Yıldırım · Nazan ve Orhan’ın çalışma masası',
    }),
  ],
  muvekkil: [
    p1.activity('H_GORUS', 'Orhan’la görüş', 'INV_GORUSME_G', {
      description: 'Leyla’nın randevusuna 14 dk',
      visibleWhen: not(visited('INV_GORUSME')),
    }),
    p1.activity('H_GORUS2', 'Orhan’la yeniden görüş', 'INV_GORUSME_G', {
      description: 'Leyla’nın randevusuna 8 dk',
      visibleWhen: all(visited('INV_GORUSME'), cmp({ visits: 'INV_GORUSME' }, '<', 2)),
    }),
  ],
  tanik: [
    p1.activity('H_T_HAYRI', 'Hayri Özdemir', 'INV_T_HAYRI', {
      once: true,
      description: 'Mükellef · açığı o buldu',
    }),
    p1.activity('H_T_MELEK', 'Melek Yavuz', 'INV_T_MELEK', { once: true, description: 'Vezne 1 · yan veznedar' }),
    p1.activity('H_T_ERCAN', 'Ercan Tunalı', 'INV_T_ERCAN', {
      once: true,
      description: 'Müdür yardımcısı · savcılık tanığı',
    }),
  ],
  arsiv: [
    p1.activity('H_LOG', 'İptal kayıtlarını incele', 'INV_LOG', {
      once: true,
      description: 'Otuz bir sayfa, altı sütun',
    }),
    p1.activity('H_PDKS', 'Turnike dökümünü incele', 'INV_PDKS', {
      once: true,
      description: 'Orhan’ın kendi çıktısı',
      visibleWhen: has('ev_pdks'),
    }),
    p1.activity('H_TUTANAK', 'Tutanakları karbonla karşılaştır', 'INV_TUTANAK', {
      once: true,
      description: 'Beyaz asıllar ↔ sarı kopyalar',
      visibleWhen: has('ev_karbon'),
    }),
    p1.activity('H_BANKA', 'Banka dökümünü incele', 'INV_BANKA', {
      once: true,
      description: 'MASAK yazısının eki',
    }),
    p1.activity('H_DIL', 'Delil talebi dilekçesi (CMK 177)', 'INV_DIL', {
      description: '3 talep hakkı',
      visibleWhen: not(flag('dil_verildi')),
    }),
    p1.free('H_CIKARIM', 'Çıkarım tahtası', 'INV_CIKARIM', {
      description: '0 EP · ipuçlarını birleştir',
      enabledWhen: ref('kart2'),
      lockedReason: 'En az 2 ipucu gerekli.',
    }),
    p1.free('H_LEYLA', 'Leyla’ya danış', 'INV_LEYLA', {
      description: '0 EP · günde bir kez',
      visibleWhen: cmp(v('leyla_gun'), '<', v('day')),
      effects: [set('leyla_gun', v('day'))],
    }),
  ],
};

const hubLines = [
  W(
    cmp(v('day'), '==', 1),
    `
# GÜN 1/3 · BİRİNCİ CELSEYE 12 GÜN
> Hedef: kırk yedi iptalin saati, yeri ve sahibi. Orhan o saatlerde neredeydi?
`,
  ),
  W(
    all(cmp(v('day'), '==', 2), any(has('clue_terminal'), has('clue_cikis'), has('ded_baskasi'))),
    `
# GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN
> Hedef: kâğıtlar bir çatlak gösterdi. Şimdi para: teslim tutanakları, banka, tapu. Para ne zaman, kimin elinden çıktı?
`,
  ),
  W(
    cmp(v('day'), '==', 2),
    `
# GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN
> Hedef: kayıtlar hâlâ tek bir isim yazıyor. Sütunlara, saatlere, kâğıtların ikinci nüshalarına bak.
`,
  ),
  O(`
# GÜN 3/3 · BİRİNCİ CELSEYE 6 GÜN
> Hedef: dilekçe ve tahta. Duruşmada neyi isteyeceksin, kimin sözünü hangi kâğıtla tartacaksın?
`),
];

// --- Leyla ---

const leyla = story('INV_LEYLA', {
  ...INV,
  title: 'Leyla’ya danış',
  background: 'buro',
  lines: [
    W(
      cmp(v('day'), '==', 1),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Zimmet bir yakınlık suçudur Deniz. Parayı uzaktan zimmetine geçiremezsin; para senin elinde, senin korumanda olmalı.
leyla: Kanun “görevi nedeniyle zilyetliği kendisine devredilmiş” der. Ya da “koruma, gözetim ve denetimiyle yükümlü olduğu.” Kısacası: o an para kimin sorumluluğundaydı?
leyla: Bir veznedar parayı sayıp teslim ettiği anda, o paranın bekçisi olmaktan çıkar. Teslim alan bekçi olur. Bu dosyada kim, kime, ne zaman teslim etmiş? Bak.
leyla: Bir de kayıtlar. Log bir isim yazar; parmak yazmaz. Bir kullanıcı adının arkasında kim oturduğunu log söylemez, saat söyler, makine söyler, kapı söyler.
> Sigara paketini avucunda çevirdi. Açmadı.
leyla: Teftiş raporu iki sütun okumuş. Sen altısını oku.
`,
    ),
    W(
      cmp(v('day'), '==', 2),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Teftiş raporu bir idari incelemedir. Bilirkişi raporu değildir. Mahkeme onu belge olarak okur, değerini kendisi takdir eder.
leyla: Log, terminal, yetki, kimlik doğrulama: bunlar özel ve teknik bilgi ister. Bilişim bilirkişisi. İstemezsen kimse senin yerine istemez.
leyla: Dilekçeni duruşmadan en az beş gün önce ver. Kanun öyle der; geç kalan talep, “neden şimdi” sorusuyla karşılanır.
leyla: Her talebin altına neyi ispat edeceğini yaz. “Her şeyi isteyeyim, bir şey çıkar” diyen avukatın talepleri reddedilir. Haklı olarak.
leyla: Bir şey daha. Şifre paylaşmak suç değildir; ama disiplin suçudur ve bir kamu görevlisinin ihmali olabilir. Müvekkilin bir kapıyı aralık bıraktıysa, savcı o aralıktan girecek.
~ Aralık bir kapı. Orhan’ın “utanıyorum”u bir kapının aralığı olabilir mi?
`,
    ),
    O(`
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Birinci celsede savcının tanıklarını dinleyeceksin. Savcılık tanığına soru sormak, onun kâğıdını ona geri okumaktır. Kendi sözünü değil.
leyla: Önce dinle. Sonra bastır: “Ne demek istediniz?” Sonra kâğıdı göster. Sırayı karıştırırsan tanık değil sen sarsılırsın.
leyla: Kürsüde herkes kibar olur Deniz. Kibarlık bir delil değildir. Kabalık da değildir.
leyla: Bir de müvekkilin. Kürsüde ne anlatacağını ona sen söylemeyeceksin; ama neyin önemli olduğunu söyleyeceksin. Utandığı bir şey varsa, onu senden önce savcı bulmasın.
> Pencereye döndü. Yağmur camda ince çizgiler çiziyordu; bir tablo gibi, bir döküm gibi.
leyla: Gerçeği söyleyen müvekkili savunmak zor değildir. Zor olan, gerçeğin bir kısmını söyleyen müvekkili, gerçeğin tamamına ulaştırmaktır.
`),
  ],
  choices: [cont('LEYLA_DON', 'Teşekkür et', '$return', { role: 'BACK' })],
});

// --- Gün sonları ---

const dayEnd = decisionNode('INV_DAY_END', [{ when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' }, { to: 'INV_AKSAM2' }], {
  ...INV,
  title: 'Gün sonu',
  onEnter: [inc('day', 1), set('ap', 4)],
});

const aksam1 = story('INV_AKSAM1', {
  ...INV,
  title: 'İlk akşam',
  background: 'buro_gece',
  lines: B(`
# GECE 22.10 — ARSLAN HUKUK [bg:buro_gece]
> Büroda Leyla’yla ikimiz kaldık. Pencerenin önünde duruyordu; aşağıda bir belediye otobüsü, içinde üç yolcu, dördü de uyuyordu.
leyla: Bugün kayıtlarla oturdun. Kayıtlar sana ne söyledi?
`),
  choices: [
    option('AK1_ISIM', '“Bir isim söylediler. Hep aynı ismi.”', {
      effects: [set('aksam1', 'ISIM')],
      responses: B(`
leyla: İsim kolaydır. İsimler kâğıtta durur, kimse onlara itiraz etmez. Şimdi o ismin yanında bir saat, bir kapı, bir makine ara.
leyla: Kayıtlar bir isim söylediyse, bir şey daha söylemiştir: o ismin nerede olmadığını.
~ Nerede olmadığını. Bir ismin yokluğu, bazen varlığından daha çok şey söyler.
`),
      next: 'INV_HUB',
    }),
    option('AK1_SAAT', '“Saat söylediler. Herkes evine gittikten sonra.”', {
      effects: [set('aksam1', 'SAAT')],
      responses: B(`
leyla: Güzel. Saat, bir dosyanın en sessiz tanığıdır. Yalan söylemez, yorulmaz, kürsüde ağlamaz.
leyla: Ama saat bir şeyi tek başına kanıtlamaz. Saatin yanına bir de kapı koy: kim girdi, kim çıktı?
~ Kapılar. Turnike, kasa odası, ön oda. Bu binada her kapı bir şey biliyor.
`),
      next: 'INV_HUB',
    }),
    option('AK1_HIC', '“Hiçbir şey. Rakamlar bana konuşmuyor.”', {
      effects: [set('aksam1', 'HIC')],
      responses: B(`
leyla: Rakamlar herkese konuşur Deniz. Sen onları dinlemekten korkuyorsun.
leyla: Hukuk fakültesine sayısalcılar gelmez, biliyorum. Ama ceza dosyası bir hesap dosyasıdır; kimin, ne zaman, ne kadar. Yarın bir sütunu baştan sona oku. Sadece birini.
> Işığı kapatıp çıktı. Masa lambası yanık kaldı. Kasıtlı mı bilmiyorum.
`),
      next: 'INV_HUB',
    }),
  ],
});

const aksam2Sec = decisionNode(
  'INV_AKSAM2',
  [{ when: any(visited('INV_T_MELEK'), visited('INV_T_ERCAN')), to: 'INV_AKSAM2_TEL' }, { to: 'INV_AKSAM2_NAZAN' }],
  { ...INV, title: 'İkinci akşam' },
);

const aksam2Tel = story('INV_AKSAM2_TEL', {
  ...INV,
  title: 'Gizli numara',
  background: 'buro_gece',
  lines: B(`
# GECE 23.40 — ARSLAN HUKUK [bg:buro_gece]
> Masamın üstünde telefon titredi. Ekranda numara yoktu: “GİZLİ.” Açtım. Bir süre yalnızca nefes.
@GİZLİ NUMARA: Avukat hanım. [phone]
> Ses alçak ve boğuktu. Arkasında bir televizyon; bir maç, bir kalabalık, bir spiker gol diye bağırıyordu.
@GİZLİ NUMARA: Kasalar boş kalınca rüzgâr eser. Üşütmeyin. [phone]
> Hat kesildi. Pencereye gittim. Sokakta kimse yoktu; yalnızca yağmur ve bir simitçi tezgâhının üstündeki naylonun çırpınışı.
~ Bu ses bu dosyanın içinden değil. Dışından. Ama içeriyi biliyor.
`),
  choices: [
    option('AK2_BILDIR', 'Aramayı tutanağa geçirip savcılığa bildir', {
      score: { USUL_BILGISI: 40 },
      effects: [raise('tehdit_bildirildi')],
      good: 'Avukata yönelik tehdit ya da baskı savcılığa bildirilir; dosyaya giren her bilgi gibi kayıt altına alınır (CMK 158).',
      category: 'USUL_BILGISI',
      responses: B(`
> Sabah ilk iş, kısa bir dilekçe: saat, süre, söylenenler. Operatörden arama kaydının saklanmasını istedim. Leyla dilekçeyi okudu, imzamın altına kendi parafını attı.
leyla: Korkuyu kâğıda yaz. Kâğıda yazılan korku, birinin işi olur. Yazılmayan korku, senin işin olarak kalır.
`),
      next: 'INV_HUB',
    }),
    option('AK2_GEC', 'Önemseme; uyumaya çalış', {
      neutral:
        'Tehdidi kayda geçirmedin. Belki bir şaka, belki bir uyarı; ama kaydı olmayan bir uyarı kimseye bir şey anlatmaz.',
      responses: B(`
> Telefonu ters çevirdim. Uyumadım. Saat üçte bir kez daha baktım; ekran karanlıktı.
~ Bir ses, bir maç, bir rüzgâr. Kimse bunu sormayacak. Ben de unutmaya çalışacağım; beceremeyeceğim.
`),
      next: 'INV_HUB',
    }),
  ],
});

const aksam2Nazan = story('INV_AKSAM2_NAZAN', {
  ...INV,
  title: 'Nazan arıyor',
  background: 'buro_gece',
  lines: B(`
# GECE 23.10 — ARSLAN HUKUK [bg:buro_gece]
> Telefon çaldı. Nazan. Sesi her zamankinden yavaştı; iğnesiz konuşuyordu.
nazan: Avukat hanım, kusura bakmayın, geç oldu. Elif bir mesaj attı bana, kendi odasından. Okuyayım mı?
nazan: “Anne, babam uyumuyor. Salonda oturuyor, defterine bakıyor. Bir şey yazmıyor, sadece bakıyor.” [phone]
nazan: On dokuz yıl her akşam yazdı o deftere. Şimdi sadece bakıyor. Ne yazacak, bilmiyor.
~ Bir adamın bütün hayatı bir defterde. Ve o defterin bir sayfası, bir kasa açığının tam ortasında duruyor.
`),
  choices: [
    option('AK2N_A', '“Defteri bana getirmesini söyleyin.”', {
      effects: [inc('trust', 4)],
      responses: B(`
nazan: Getirir. Getirir de… Avukat hanım, o defter onun… Neyse. Getirir.
~ Bir defteri istedim. Belki bir hayatı istedim. Ama o defter mahkemede konuşabilir; Orhan’ın konuşamadığını.
`),
      next: 'INV_HUB',
    }),
    option('AK2N_B', '“Ona yarın bir şey soracağım; uyusun.”', {
      responses: B(`
nazan: Uyumaz. Ama söylerim. “Avukat yarın soracak” derim; o zaman belki hazırlanır, uyur. Hazırlanınca uyur bu adam.
`),
      next: 'INV_HUB',
    }),
  ],
});

// --- Duruşmadan önceki gece ---

const gece = [
  decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
    ...INV,
    title: 'Duruşmadan önceki gece',
    lines: B(`
# SALI 23.20 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu son kez toparladım. Raptiyeler, ipler, bir yığın fotokopi. Kırk yedi satırlık bir dökümün kenarına yazdığım kırk yedi soru işareti.
`),
  }),
  decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
    lines: [
      W(
        has('ded_baskasi'),
        `~ Kullanıcı adı Orhan’ın. Saat Orhan’ın değil, makine Orhan’ın değil. Klavyenin başında başka bir el vardı.`,
      ),
      W(
        any(has('clue_terminal'), has('clue_cikis')),
        `~ Bir sütunda bir çatlak buldum. Çatlağı öbür kâğıtla birleştiremedim henüz.`,
      ),
      O(`~ Kayıtlar hâlâ tek bir isim yazıyor. Sütunların hepsini okudum mu, gerçekten okudum mu?`),
    ],
  }),
  decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
    lines: [
      W(
        has('ded_zarf'),
        `~ Bir yönerge ve onu çiğneten bir not. Şifre bir insan değil; bir zarfın içindeki bir satır. Zarf kimin çekmecesindeydi?`,
      ),
      W(flag('fact_zarf'), `~ Orhan şifresini verdi. Bile bile. Bunu kürsüde ondan önce kimse söylememeli.`),
      O(`~ “Şifre kişiye özeldir efendim.” İlk gece bunu söylerken gözlüğünü elinde tutuyordu. Neden?`),
    ],
  }),
  decisionNode('INV_GECE_4', [{ to: 'INV_GECE_5' }], {
    lines: [
      W(
        any(has('ded_teslim'), has('ded_sahte_tutanak')),
        `~ Saat beşte kasa tamdı. Saat altıya doğru başka bir tutanak, başka bir rakam, fotokopi bir imza. Para teslimden sonra eridi.`,
      ),
      W(has('ev_karbon'), `~ Sarı nüshalar. Teslim alan kutusu boş. Bir imza sonradan atılmış. Neden sonradan?`),
      O(`~ Para Orhan’ın elinden nasıl çıktı? Bunu bilmeden zilyetlik diye bir kelimeyi kürsüye taşıyamam.`),
    ],
  }),
  decisionNode('INV_GECE_5', [{ to: 'INV_GECE_6' }], {
    lines: [
      W(
        flag('melek_kirgin'),
        `~ Melek’in kapıya bakışı. Sonra bardağın lavaboya çarpışı. Bir tanığı korkuttum; korkmuş tanık doğruyu fısıldar, mahkemede söylemez.`,
      ),
      W(
        flag('tehdit_bildirildi'),
        `~ Gizli numaranın sesi bir dilekçenin içinde artık. Korkum bir dosya numarası taşıyor.`,
      ),
      W(has('ded_kredi'), `~ Tahtaköprü’de dört dönüm tarla. Savcılığın “sebebi” bir ölünün mirası çıktı.`),
      W(cmp(v('aksam1'), '==', 'SAAT'), `~ Saat. Leyla haklıydı: saatin yanına bir kapı koymalıyım.`),
      O(`~ Leyla’nın sorusu aklımda: kayıtlar bana ne söyledi? Bir isim. Ve o ismin nerede olmadığını.`),
    ],
  }),
  decisionNode('INV_GECE_6', [{ to: 'INV_GECE_7' }], {
    lines: [
      W(
        all(flag('dil_verildi'), flag('bilirkisi_istendi')),
        `~ Dilekçe verildi; bilirkişi de içinde. Mahkeme kabul ederse makineyi bir uzman konuşturacak.`,
      ),
      W(
        flag('dil_verildi'),
        `~ Dilekçe verildi. Bilirkişiyi istemedim; duruşmada istemeliyim. Teftiş raporu tek başına kalmamalı.`,
      ),
      O(`~ Dilekçe vermedim. Yarın her şeyi kürsüde, son anda isteyeceğim. Son an, mahkemelerin en az sevdiği andır.`),
    ],
  }),
];

const gece7 = [
  decisionNode('INV_GECE_7', [{ to: 'INV_GECE_8' }], {
    lines: [
      W(
        all(flag('ercan_zarf_inkar'), has('ev_talimat')),
        `~ “Öyle bir uygulama bizde olmaz.” Müdür yardımcısının odasında, cebimde katlı bir kâğıtla dinledim bunu. Yarın kâğıt kürsüde açılacak.`,
      ),
      W(
        all(flag('melek_zarf_inkar'), has('ev_talimat')),
        `~ “Ne zarfı canım?” Melek çok hızlı söyledi. Hızlı “hayır”lar uzun bir “evet”in üstüne örtülmüş çarşaflardır.`,
      ),
      W(
        flag('ercan_sistem'),
        `~ “Yalnızca vezne terminalinden girilir efendim.” Kendinden emin bir cümle. Bir makinenin cümlesi değil, bir müdür yardımcısının.`,
      ),
      W(
        flag('ercan_ziyaret'),
        `~ İnce belli bir bardak, bir dolma kalem, bir babanın fotoğrafı. Kibar bir oda. Kalem bir tek kez sabırsızdı.`,
      ),
      O(`~ Tanıkları kürsüde ilk kez göreceğim. Ne söyleyeceklerini bilmeden. Bu iyi değil; ama dürüst.`),
    ],
  }),
  decisionNode('INV_GECE_8', [{ to: 'INV_GECE_9' }], {
    lines: [
      W(
        all(flag('fact_vz02'), flag('fact_onoda')),
        `~ Vezne camının arkasında VZ-02. Buzlu camın arkasında bir monitörün mavi ışığı. İki bilgisayar, iki oda, bir kullanıcı adı.`,
      ),
      W(
        flag('fact_talimat'),
        `~ Bordroların arasına sıkıştırılmış bir kareli kâğıt. Orhan onu saklamamıştı; unutmak istemişti. Unutmak, saklamanın yorgun biçimidir.`,
      ),
      W(
        flag('fact_ercan_teslim'),
        `~ “Kim müsaitse efendim.” Torbaların son durağı bir isim değil, bir nöbet listesi gibi anlatıldı. Nöbet listeleri de bir yerde yazılıdır.`,
      ),
      O(`~ İki oda, bir kasa, bir turnike. Bina bir şey biliyor; ben henüz bilmiyorum.`),
    ],
  }),
  decisionNode('INV_GECE_9', [{ to: 'INV_GECE' }], {
    lines: [
      W(
        any(flag('fact_9ocak_log'), flag('fact_12subat')),
        `~ 9 Ocak bir cuma. 12 Şubat bir perşembe. Bir hastane koridoru ve bir çorba kâsesi. İki akşam, iki iptal, aynı oda.`,
      ),
      W(
        flag('fact_hayri_dosya'),
        `~ “Dosyamı kendisi aldı, fotokopimi kendisi çekti.” Hayri Bey bunu bir nezaket örneği olarak anlattı. Ben de öyle not aldım. Şimdilik.`,
      ),
      W(
        flag('fact_borc_soylenti'),
        `~ “Kimseye söylemedim; ama herkes biliyordu.” Orhan’ın kredisini birisi koridorlara taşımış. Bir söylenti de bir kayıttır; yalnızca imzası yoktur.`,
      ),
      W(
        flag('orhan_kirgin'),
        `~ “Korkmak başka, utanmak başka.” İlk gece Orhan’a ezberlenmiş bir cümle söyledim. O bana dosyanın ilk gerçek cümlesini söyledi.`,
      ),
      W(flag('orhan_soz'), `~ “Anlatırım efendim. Söz.” Sözünü tuttu; zarfı anlattı. Yarın kürsüde de tutacak mı?`),
      O(`~ Orhan’ın gözlüğünü silişi. Her seferinde, söyleyemediği bir cümleden önce.`),
    ],
  }),
];

const geceSon = story('INV_GECE', {
  ...INV,
  title: 'Duruşmadan önceki gece',
  background: 'sokak_yagmur',
  lines: B(`
> Telefon titredi. Leyla’dan tek bir mesaj, gece yarısına beş kala.
leyla: Yarın savcının tanıkları kürsüde. Onları yenmeye çalışma. Onların kâğıtlarını oku; gerisini onlar kendileri okuyacak. [phone]
> Pencereyi açtım. Lodos dinmişti; yağmur artık düz yağıyordu. Aşağıda belediyenin çöp kamyonu sokağı yıkıyordu, turuncu ışığı duvarlarda dönüyordu. {flash}
~ Kırk yedi makbuz. Üç yüz seksen altı bin dört yüz lira. Yarın sabah dokuzda biri bana soracak: “Müdafi, diyeceğiniz?”
`),
  choices: [cont('GECE_DEVAM', 'Adliyeye git', 'H1_K', { role: 'PRIMARY' })],
});

export const investigation: CasePart = {
  variables: [
    hiddenInt('leyla_gun', 0, 0, 3),
    hiddenEnum('aksam1', ['YOK', 'ISIM', 'SAAT', 'HIC']),
    ...flags('tehdit_bildirildi'),
  ],
  nodes: [
    p1.hub({
      ...INV,
      title: 'Soruşturma',
      background: 'buro',
      lines: hubLines,
      scenePreview: { scene: 'sc_vezne' },
      tabs: [
        { id: 't_yer', label: 'YERLER', kind: 'SCENE', choices: hubChoices.yer },
        { id: 't_muvekkil', label: 'MÜVEKKİL', kind: 'PEOPLE', choices: hubChoices.muvekkil },
        { id: 't_tanik', label: 'TANIKLAR', kind: 'PEOPLE', choices: hubChoices.tanik },
        { id: 't_arsiv', label: 'ARŞİV', kind: 'ARCHIVE', choices: hubChoices.arsiv },
      ],
      quickTalk: {
        character: 'orhan',
        line: '“Kırk yedi makbuz efendim. Hiçbirini ben iptal etmedim.”',
        choices: ['H_GORUS', 'H_GORUS2'],
      },
      choices: [
        nav('H_DURUSMA', 'DURUŞMAYA GİT · 1. CELSE', 'INV_GECE_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
        }),
      ],
    }),
    leyla,
    dayEnd,
    aksam1,
    aksam2Sec,
    aksam2Tel,
    aksam2Nazan,
    ...gece,
    ...gece7,
    geceSon,
  ],
  triggers: [
    {
      id: 'tg_day_end',
      scope: 'INV_HUB',
      priority: 1,
      when: all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', 3)),
      goto: 'INV_DAY_END',
    },
  ],
};
