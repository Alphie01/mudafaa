import {
  all,
  any,
  because,
  flag,
  not,
  outcome,
  ref,
  xp,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { O, W } from './dsl.js';

// 70-outcomes: sonuçlar (öncelik sırasıyla) ve sonuca bağlı epiloglar. Hiçbir sonuç skor eşiğine bakmaz.

// Sonuçlar yalnızca duruşma kaydındaki olgulara bağlıdır (CMK 217/1): dönüş yok + ölüm sonra → beraat (gerçek fail
// kayıtta ve savcılığa bildirilmişse 223/2-b, değilse 223/2-e); yalnızca dönüş yok → 87/4; teşhis ayaktaysa 81/1 + 21/2.
// Skor hiçbir hükmü seçmez; yalnızca XP'yi ve notu etkiler.

const tahliye =
  'tutuklu ise derhâl TAHLİYESİNE, adli kontrol altındaysa tedbirin kaldırılmasına; CMK 141/1-e uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 ile 6384 sayılı Kanuna göre yapılabileceğinin bildirilmesine (CMK 231/3)';
const dusme =
  'kavga sırasındaki yumruk eyleminin basit tıbbi müdahaleyle giderilebilecek kasten yaralama (TCK 86/2) niteliğinde kaldığı, kovuşturulması şikâyete bağlı olup şikâyet bulunmadığından bu eylem yönünden davanın CMK 223/8 uyarınca DÜŞMESİNE';
const istinaf = 'tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 272, 273/1) karar verildi.';
const tutukluluk =
  'tutukluluk hâlinin devamına (ikinci celseden önce adli kontrolle tahliye edilmişse hükümle birlikte tutuklanmasına, CMK 100–101); tutuklulukta geçen sürenin cezadan mahsubuna (TCK 63)';

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK', {
      class: 'OTHER',
      priority: 1,
      when: flag('etik_gulay'),
      stamp: 'AZİL',
      stampTone: 'red',
      sentence: 'Vekâlet sona erdi · dava sürüyor',
      verdictText:
        'Mahkemece, sanığın eşi Gülay Demirel’in duruşmadaki beyanının banka kaydıyla çeliştiği ve tanığın bu beyanı müdafiin telkiniyle verdiğini açıkladığı anlaşıldığından tutanak örneğinin yalan tanıklık ve azmettirme iddiaları yönünden Bursa Cumhuriyet Başsavcılığına, müdafie ilişkin kısmının Bursa Barosu Başkanlığına gönderilmesine; sanığın müdafiini azletmesi nedeniyle duruşmanın yeni müdafiin katılımıyla devamına karar verildi.',
      reasoning: [
        because(
          'Müdafi, sanığın eşine eve dönüş saatini yanlış söylemesini öğütlemiştir; tanık bunu duruşmada açıklamıştır.',
        ),
        because('Sanık, vekâlet ilişkisini tek taraflı olarak sona erdirmiştir (TBK 512/1).'),
        because('Dava başka bir müdafiin katılımıyla devam edecektir; senin dosyan burada kapandı.'),
      ],
      legalBasis: 'TCK 272, 38; Av.K. 34; TBK 512/1; CMK 217',
      xp: 0,
      howToReach:
        'Bir tanığa asla ne söyleyeceğini öğütleme; geç saatin açıklamasını kayıtla (hesap dökümü, büfe) yap.',
      ethicsCard:
        'Sanığın eşine yalan bir saat söylemesini öğütledin. Bu, yalan tanıklığa azmettirmedir (TCK 272, 38) ve avukatın doğruluk yükümlülüğüne aykırıdır (Av.K. 34). Üstelik o bir saati açıklayan kayıt zaten elindeydi: 23.37, iskele büfesi.',
      epilogue: [
        O(`
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Azilnameyi katladım, cüzdanıma koydum. Neden bilmiyorum; bir makbuz gibi.
> Koridorun öbür ucunda Gülay ağlıyordu. Yanında bir zabıt kâtibi, elinde bir kâğıt. Elif’in resim defteri yere düşmüştü; kimse almıyordu.
> Ben aldım. Uzattım. Gülay defteri aldı, bana bakmadı.
gulay/uzgun: “Ne derseniz” demiştim size. Siz de dediniz.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Masamda ince bir kitapçık: “Avukatlık Kanunu.” Leyla bırakmıştı. Not yoktu. Not gerekmiyordu.
> Leyla’nın odasının kapısı kapalıydı, ışığı yanıyordu. Kapıyı çalmadım.
~ Bir saati sildim. Bir kadının ağzından. O saat iki ay sonra bir mahkeme salonunda geri geldi ve beni de yanında götürdü.
~ Oysa saat bir suç değildi. Saat bir büfede, bir taburede, ağlayan bir adamdı. Doğruyu söyleseydi, o bir saat Tarık’ın en iyi tanığı olacaktı.
# ÜÇ HAFTA SONRA · BURSA BAROSU, DİSİPLİN KURULU KORİDORU [bg:adliye]
> Tahta bir bank, bir dosya, bir çağrı kâğıdı. Kâğıtta adım ve bir madde numarası.
> Leyla geldi. Yanıma oturdu. Bir süre ikimiz de karşı duvardaki ilanlara baktık.
leyla: Savunmanı yaz. Doğruyu yaz. Bir kere de olsa bir saati silmeden.
- Tarık’ın yeni avukatı kim?
leyla: Genç bir kadın. İyi. Turnike kaydını ilk gün istemiş. Sevim Yavuz’a gidip başsağlığı dilemiş.
~ Benim yapabileceğim her şeyi yapıyor. Benim yapmamam gereken tek şeyi yapmadan.
`),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(not(flag('cokus')), flag('gercek_fail'), ref('donus_yok'), ref('olum_sonra')),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText: `Sanık Tarık Demirel’in üzerine atılı kasten öldürme suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; ${dusme}; ${tahliye}; karar ve duruşma tutanaklarının Kenan Aksoy hakkındaki soruşturma dosyasına eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; ${istinaf}`,
      reasoning: [
        because('Sanık 23.18’de limandan çıkmış ve geri dönmemiştir; aksi yöndeki teşhis kayıtlar karşısında çökmüştür.'),
        because(
          'Maktul 23.34’te yemek yemiş, 23.41’de telefonla görüşmüştür; ölüme yol açan darbe bundan sonra vurulmuştur.',
          flag('contra_b2'),
        ),
        because(
          'Kırık, yumrukla düşmeden değil, sabit duran başa sınırlı yüzeyli bir cisimle vurulmasından oluşmuştur; babada çarpma izi yoktur.',
          flag('contra_b1'),
        ),
        because(
          'Yaralı olay yerine yürümemiştir: yolda kan yoktur, yara cesedin bulunduğu yerde açılmıştır; bilinç açıklığı tezi dayanaksızdır.',
          flag('contra_b5'),
        ),
        because('Emanetteki kilit yaranın ölçüsüne uymamaktadır; savcılığın gösterdiği alet ölümle bağlantılı değildir.', flag('contra_b3')),
        because(
          'Ölüm saatinde olay yerinde bulunan tek araç başka bir kişinin zimmetindedir; bu kişi kendisini suçlayabilecek sorulara cevap vermemiş, hakkında soruşturma başlatılmıştır.',
        ),
        because(
          'Yumruk eylemi basit yaralama niteliğinde kalmış, şikâyet bulunmadığından bu yönden düşme kararı verilmiştir.',
        ),
        because('Deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b, 223/8; TCK 86/2, 73; CMK 141/1-e, 142, 231/3',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Teşhisi ve savcılığın yedek tezini kayıtla çürüt; abone, araç ve zimmet kayıtlarını savcılığa yazılı bildir; ikinci celsede vardiya şefinin beyanlarını kayıtla çürüt ve esas savunmada gerçek faili göster. Skor bu hükmü belirlemez.',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
> “İşlemediği sabit olduğundan… beraatine.” Tarık kelimeleri duydu. Bir an anlamadı. Sonra elini, sağ elini, boğumlarında hâlâ solgun bir iz taşıyan elini, kürsünün kenarına koydu ve gözlerini kapadı.
> Gülay ayağa kalktı. Elif’in resim defteri kucağından kaydı; açılan sayfada mavi bir gemi.
# ADLİYE ÖNÜ · ÖĞLE [bg:sokak_sabah]
> Yağmur dinmişti. İlk kez. Uludağ’ın üstünde bulutlar yırtılmış, güneş adliyenin ıslak merdivenlerinde parlıyordu.
> Merdivenin dibinde Sevim Yavuz bekliyordu. Bana doğru bir adım attı, durdu.
sevim: Defteri doğru ellere vermişim. Ercan yanlış sayılmak istemezdi.
> Sonra Tarık’a döndü. Uzun bir an. Tarık başını eğdi.
tarik: Özür dilerim yenge. O gece… vurdum. Vurmamalıydım.
sevim/uzgun: Vurdun. Ama öldürmedin. Ben üç ay seni öldürdü sandım. Kim haklı, kim haksız, bilmiyorum artık.
> Sevim gitti. Tarık arkasından baktı, sonra kızını kucağına aldı.
`),
        O(`
# ARSLAN HUKUK · AKŞAM [bg:buro]
> Leyla masasında, kapalı sigara paketi elinde. Paketi bana uzattı.
leyla: Al. Saklamana gerek yok artık; ben de bırakıyorum. Bunu.
- Neyi?
leyla: Paketi. On yıldır elimde çeviriyorum. Bugün bir yumruk ile bir ölümü birbirinden ayırdın. Ben de bir alışkanlığı bırakabilirim.
> Masasındaki ters çerçeveye bir an baktı. Düzeltmedi.
# BİR HAFTA SONRA · MUDANYA, EMRE DEMİREL’İN MEZARI [bg:sokak_sabah]
> Tarık mezarın başında, elinde bir kâğıt: Elif’in gemi resmi. Taşa yasladı, üstüne küçük bir taş koydu ki rüzgâr almasın.
tarik: Ağabey… ayağına bakmazdın derler. Ben baktım. Bir kere yine de tökezledim.
# KARTLAR
> Kenan Aksoy hakkında kasten öldürme soruşturması başlatıldı; servis kamyonetinin kitindeki eksik kilit, B sahasındaki bir rögarın içinde bulundu.
> Manifestoya girmeyen konteynerler için liman işletmesinde ayrı bir soruşturma açıldı.
`),
        W(
          flag('released'),
          `
~ İlk celsede tahliye olmuştu; bugün yalnızca adli kontrol kalktı. Bir kâğıt. Ama Tarık o kâğıdı katlayıp gömleğinin cebine koydu, kalbinin üstüne.
`,
        ),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(ref('donus_yok'), ref('olum_sonra')),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText: `Sanık Tarık Demirel’in üzerine atılı kasten öldürme suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; ${dusme}; ${tahliye}; ${istinaf}`,
      reasoning: [
        because(
          'Tanığın yeminle kesinleştirdiği 23.40, sanığın 23.18’de limandan çıktığını ve 23.37’de iskele büfesinde ödeme yaptığını gösteren kayıtlarla çürümüştür.',
          flag('contra_k1'),
        ),
        because(
          'Sanığın 23.18’de limandan çıktığı ve 23.37’de iskele büfesinde bulunduğu kayıtlar ve büfe sahibinin beyanıyla anlaşılmıştır.',
          all(flag('contra_n1'), not(flag('contra_k1'))),
        ),
        because(
          'Projektörlerin bakım nedeniyle kapalı olduğu bir sahada tanığın yüz seçmesi mümkün değildir; teşhisin dayanağı yoktur.',
          flag('contra_k2'),
        ),
        because(
          'Büfe sahibi, sanığın gece haberleri başlayana, saat on ikiye kadar büfede oturduğunu yeminle beyan etmiştir.',
          flag('contra_n2'),
        ),
        because('Sanığın olay yerine döndüğü ispatlanamamıştır.'),
        because('Ölüme yol açan kırık, düşmeyle değil sınırlı yüzeyli bir cisimle oluşmuştur.', flag('contra_b1')),
        because('Maktulün 23.34’ten sonra yaşadığı mide içeriği ve kayıtlarla anlaşılmıştır.', flag('contra_b2')),
        because('Yara cesedin bulunduğu yerde açılmıştır; maktul oraya yaralı olarak yürümemiştir.', flag('contra_b5')),
        because('Emanetteki kilit yaranın ölçüsüne uymamaktadır.', flag('contra_b3')),
        because(
          'Sanığın suçu işlediğine dair kesin ve inandırıcı delil yoktur; şüpheden sanık yararlanır (Anayasa 38/4, AİHS 6/2).',
        ),
        because(
          'Müdafiin ikinci celsedeki ilgisiz delil sunumları tutanağa geçmemiş; hüküm, ondan önce duruşmada tartışılmış delillere dayanmıştır.',
          flag('cokus'),
        ),
      ],
      legalBasis: 'CMK 223/2-e, 223/8; TCK 86/2; Anayasa 38/4; AİHS 6/2; CMK 141/1-e, 142, 231/3',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Teşhisi iki ayağından çürüt: saati kayıtla (turnike + büfe fişi), yüzü ışıkla (bakım etiketi) ya da büfecinin gece yarısı beyanıyla. İkinci celsede bilirkişiye darbe şeklini ve olay yerini, ölüm saatini ve yolda kan olmadığını kâğıtla göster. Karar duruşmada tartışılan bu olgulara bakar (CMK 217/1).',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
> “İşlediği sabit olmadığından… beraatine.” Tarık oturdu; ayakta dinlemesi gerektiğini unutmuştu. Mübaşir omzuna dokundu, kalktı.
> Gülay galeride iki elini ağzına kapadı. Sevim Yavuz ise kımıldamadan oturuyordu; gözleri boş kürsüdeydi.
# MUDANYA LİMANI · PERSONEL KAPISI · BİR HAFTA SONRA [bg:liman_gece]
> Tarık işe dönmek için kapıya geldi. Kartını okuttu; turnike döndü. Bir makinenin hafızası onu yeniden içeri aldı.
> Rıhtım 4’ün babası hâlâ oradaydı. Gövdesindeki kan izi yağmurlarla çoktan gitmişti; ama Tarık babaya baktı, sonra başını çevirdi.
> Kantinin önünde üç işçi sigara içiyordu. Biri başını çevirdi. Bir diğeri fısıldadı; poyraz sözün yarısını getirdi.
@BİR İŞÇİ: …şüpheden çıkmış. Şüpheden.
> Tarık durmadı. Rıhtım 4’e yürüdü, eldivenlerini taktı, ilk kilidi aldı.
> Akşam vardiyası biterken Şükrü Usta yanına geldi. Kulağının arkasında yeni bir cihaz, pili dolu.
sukru: Ha? Duydun mu beni? Bu sefer duyuyorum oğlum. Her şeyi duyuyorum.
> Tarık güldü. İki aydır ilk kez. Şükrü Usta omzuna vurdu, forkliftine yürüdü; emekliliğine üç ay kalmıştı.
`),
        W(
          flag('cokus'),
          `
~ Heyet savunmamı yarıda kesmişti. Kararı yine de tutanak verdi; benim söyleyemediğim cümleleri kâğıtlar söylemişti. Bunu bir zafer saymadım.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Panodaki son kâğıdı söktüm: “23.41.” Altında üç soru vardı: Kim? Neden? Sonra ne oldu?
`),
        W(
          not(flag('suc_duyurusu')),
          `
~ Birincisine bir isim yazabilirdim. Ama o ismi bir savcıya hiç yazmadım. Bir mahkeme beraat dedi; bir liman hâlâ fısıldıyor.
leyla: Beraat beraattir Deniz. “Şüpheden” diye bir damga yok kararda. [phone]
- Kararda yok. Kantinde var.
leyla: Kantinleri biz düzeltemeyiz. Ama bir dahaki sefere bir kâğıdı kime götüreceğini bilirsin. [phone]
> Kenan Aksoy o hafta vardiya şefliğinden emekliye ayrıldı. Bir veda yemeği verildi; Tarık gitmedi.
~ Ve 23.41’deki iki dakikanın öbür ucu, bir limanda hâlâ termos kahvesi içiyor.
`,
        ),
        W(
          flag('suc_duyurusu'),
          `
~ Birincisine bir isim yazmıştım; bir savcıya, ekleriyle. O dosya başka bir masada, başka bir hızla yürüyor. Benim dosyam bugün kapandı.
leyla: Beraat beraattir Deniz. “Şüpheden” diye bir damga yok kararda. [phone]
- Kararda yok. Kantinde var.
leyla: Kantinleri biz düzeltemeyiz. Duyurunu yazdın; gerisi savcılığın. Bekleyebilmek de bu mesleğin parçası. [phone]
`,
        ),
        O(`
> Gülay bir mesaj gönderdi: bir fotoğraf. Elif’in odasındaki harita; toplu iğne evin üstünde, bantla tutturulmuş.
> Bir saat sonra bir mesaj daha: “Elif sordu: avukat abla da gemiye biner mi?” Cevap yazmadım. Yazamadım.
~ Bir iğne eve döndü. Bir dosya kapandı.
~ Kapı açıldı. Işık hâlâ kapalı.
`),
      ],
    }),
    outcome('NITELIK', {
      class: 'RECHARACTERIZED',
      priority: 4,
      when: all(ref('donus_yok'), not(ref('olum_sonra'))),
      stamp: '87/4 · TAHRİK',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '6 yıl 3 ay hapis',
      verdictText: `Sanığın eyleminin kasten yaralama sonucu ölüme neden olma (TCK 87/4) suçunu oluşturduğu kabul edilerek: yaralamanın basit tıbbi müdahaleyle giderilebilir nitelikte olması TCK 87/4 birinci cümlesinin uygulanmasına engel görülmeyerek temel cezanın alt sınırdan 10 yıl hapis olarak belirlenmesine; maktulün sanığın ölen ağabeyine yönelik hakareti, tükürmesi ve itmesi nedeniyle haksız tahrik altında hareket ettiği anlaşıldığından TCK 29 uyarınca dörtte bir oranında indirimle 7 yıl 6 ay; sanığın yargılama sürecindeki tutumu nedeniyle TCK 62/1 uyarınca altıda bir oranında indirimle sonuç olarak 6 YIL 3 AY HAPİS cezasıyla cezalandırılmasına; TCK 53’teki hak yoksunluklarına; ${tutukluluk}; ${istinaf}`,
      reasoning: [
        because('Sanığın olay yerine geri döndüğü ispatlanamamış; öldürme kastı sabit görülmemiştir.'),
        because(
          'Heyet, ölümün sanığın yumruğuyla düşen maktulün başını çarpmasıyla oluştuğu kanaatine varmıştır; ölüm saatini ve darbe şeklini daraltan bir delil ortaya konmamıştır.',
          all(not(flag('contra_b1')), not(flag('contra_b2'))),
        ),
        because(
          'Maktulün 23.34’ten sonra yaşadığı anlaşılmışsa da düşmeye bağlı kafa travmalarında ölüm bir bilinç açıklığı döneminden sonra gelebilir; darbe şeklini düşmeden ayıran bir bulgu kürsüde ortaya konmadığından yumruk ile ölüm arasındaki bağ kopmamıştır.',
          all(flag('contra_b2'), not(flag('contra_b1'))),
        ),
        because(
          'Bilirkişi kırığın sınırlı yüzeyli bir cisimle oluştuğunu söylemişse de ölümün sanığın limandan ayrılmasından sonra geldiği ortaya konmamıştır; heyet darbenin kavga sırasında oluştuğu ihtimalini dışlayamamış, kuşkuyu sanık lehine en hafif nitelikte değerlendirmiştir.',
          all(flag('contra_b1'), not(flag('contra_b2'))),
        ),
        because(
          'Bilirkişi darbenin bir cisimle vurulduğunu ve ölümün 23.34’ten sonra geldiğini söylemişse de yaralının kavga yerinden bir bilinç açıklığı döneminde yürüdüğü ihtimali kürsüde kayıtla dışlanmamıştır; heyet darbenin kavga sırasında oluştuğu ihtimalini dışlayamamış, kuşkuyu sanık lehine en hafif nitelikte değerlendirmiştir.',
          all(flag('contra_b1'), flag('contra_b2'), not(flag('contra_b5'))),
        ),
        because(
          'Maktulün sanığın ölen ağabeyiyle alay etmesi, yüzüne tükürmesi ve onu itmesi haksız fiildir (TCK 29).',
        ),
        because('Ceza 87/4’ün alt sınırından belirlenmiş; tahrik ve takdiri indirim uygulanmıştır.'),
      ],
      legalBasis: 'TCK 87/4, 86/1–2, 29, 62/1, 53, 63; CMK 226, 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Teşhisi çürütürsün ama bilirkişiye darbe şeklini (karşı darbe + babadaki kan), ölüm saatini ve yolda kan olmadığını kâğıtla göstermezsen mahkeme savcılığın yedek tezini (yumruk → düşme → birkaç adım → ölüm, TCK 87/4) benimser.',
      epilogue: [
        O(`
baskan: Türk Milleti adına… altı yıl üç ay hapis cezasıyla…
> Tarık dimdik dinledi. “Altı yıl” kelimesinde bir şey kırıldı yüzünde; “öldürme kastı sabit görülmemiştir” cümlesinde bir şey yerine oturdu.
# ADLİYE ARKASI · RİNG ARACI [bg:adliye]
> Ring aracının kapısı açıktı. Tarık basamakta durdu, bana döndü.
tarik: Bir yumruğun bedeli bu mu abla?
- Ödediğin bedel senin yumruğun değil.
tarik: Kimin o zaman?
> Cevap veremedim. Kapı kapandı. Buğulu camın ardında bir el; açılıp kapanan parmaklar.
`),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
~ Kırk dakika. Ercan’ın kantinden çıktığı saat ile gece yarısı arasında, kimsenin bakmadığı kırk dakika.
~ O kırk dakikayı dolduramadım. Mahkeme onu bir yumrukla doldurdu; en kolay dolgu.
leyla: Müebbetten altı yıla indin. Bu bir yenilgi değil. Ama bir zafer olduğunu da söyleme kendine. İstinafa hazırlan. [phone]
- Bilirkişiye doğru kâğıdı göstermedim, Leyla. Elimdeydi belki. Ya da hiç toplamadım.
leyla: İstinaf dosyaya bakar, senin vicdanına değil. Kâğıtları topla. İki hafta. Uyuyabildiğin kadar uyu, gerisini oku. [phone]
> Gülay o akşam aradı. Bir şey söylemedi; yalnızca nefesini duydum. Arkada Elif’in sesi: “Babam hangi gemide?”
# İKİ HAFTA SONRA · ARSLAN HUKUK [bg:buro]
> İstinaf dilekçesinin son sayfasını yazarken masama bir zarf bırakıldı. İçinde Elif’in yeni bir resmi: mavi bir gemi, bu kez güvertede üç kişi.
> Birinin elinde bir çanta vardı. Gülay arkasına kurşun kalemle yazmıştı: “Avukat abla. Elif öyle istedi.”
~ Bir resim bir dilekçe değildir. Ama dilekçeyi bitirene kadar masamdan kaldırmadım.
# BİR AY SONRA · BURSA H TİPİ CEZAEVİ, AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Tarık zayıflamıştı. Ellerini masaya koydu; sağ elinin boğumlarındaki iz tamamen geçmişti.
tarik: İstinaf ne der abla?
- Dosyaya bakar. Gerekçeye bakar. Tutanakta ne varsa ona bakar; tutanağa geçmeyeni göremez.
tarik: Geçmeyen ne?
- Bir kırığın şekli. Bir saatin kâğıdı. Bir yolun fotoğrafı. Bazılarını buldum, bazılarını kürsüye götüremedim.
> Tarık uzun süre sustu. Sonra başını kaldırdı.
tarik: Ağabeyim de böyleydi. Bir kutuyu yanlış bağladılar, o ödedi. Ben bir yumruk attım; bir ölümü ödüyorum. Ama sen bunu bana dürüst söylüyorsun. Onu kimse söylememişti.
~ Bir yumruğun bedeli ile bir ölümün bedeli arasındaki fark altı yıldı. O farkı ben açamadım; istinaf açarsa, kâğıtla açacak.
`),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 5,
      when: { all: [] },
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '16 yıl 8 ay hapis',
      verdictText: `Sanığın maktulü olası kastla öldürdüğü kabul edilerek TCK 81/1 ve 21/2 uyarınca müebbet hapis yerine alt sınırdan 20 yıl hapis; TCK 62/1 uyarınca altıda bir oranında indirimle sonuç olarak 16 YIL 8 AY HAPİS cezasıyla cezalandırılmasına; TCK 53’teki hak yoksunluklarına; ${tutukluluk}; ${istinaf}`,
      reasoning: [
        because(
          'Tanık beyanları ve kavga sonrası teşhis, sanığın olay yerine döndüğü yönündeki iddiayı desteklemiştir.',
          all(not(flag('contra_k1')), not(flag('contra_n1')), not(flag('contra_k2')), not(flag('contra_n2'))),
        ),
        because(
          'Tanık saat konusunda yanılmış olabileceğini kabul etmiş, ancak sanığı yüzünden tanıdığını sürdürmüştür; teşhisin dayanağı olan aydınlatma ve sanığın gece yarısına kadar nerede olduğu kürsüde kayıtla tartışılmamıştır.',
          all(any(flag('contra_k1'), flag('contra_n1')), not(flag('contra_k2')), not(flag('contra_n2'))),
        ),
        because(
          'Aydınlatmanın kapalı olduğu anlaşılmışsa da tanık sanığı yürüyüşünden tanıdığını ve gördüğü saati sürdürmüştür; sanığın o saatte başka yerde olduğu kürsüde kayıtla gösterilmemiştir.',
          all(any(flag('contra_k2'), flag('contra_n2')), not(flag('contra_k1')), not(flag('contra_n1'))),
        ),
        because(
          'Başın arkasına sert bir cisimle vurulan darbede ölüm neticesinin öngörüldüğü kabul edilmiştir (TCK 21/2).',
        ),
        because(
          'Müdafi esas savunmada olası kastı kabul ederek yalnızca tahrik indirimi istemiştir.',
          flag('olasi_kabul'),
        ),
        because('Savunmanın inandırıcılığı duruşmada çöktü; heyet iddianamedeki anlatımı esas aldı.', flag('cokus')),
      ],
      legalBasis: 'TCK 81/1, 21/2, 62/1, 53, 63; CMK 273/1',
      xp: {
        if: { when: flag('cokus'), then: xp(0.3, { ethicsVar: 'ethics' }), else: xp(0.6, { ethicsVar: 'ethics' }) },
      },
      howToReach:
        'Varsayılan sonuç: teşhisi iki ayağından (saat ve yüz) kayıtla çürütemezsen teşhis ayakta kalır ve heyet iddianamedeki anlatımı esas alır.',
      epilogue: [
        O(`
baskan: Türk Milleti adına… on altı yıl sekiz ay hapis cezasıyla…
> Tarık bir şey söylemedi. Galeriye baktı; Gülay’a. Gülay ayakta, kıpırdamadan.
# ADLİYE KORİDORU [bg:adliye]
> Gülay yanıma geldi. Çantasından katlanmış bir kâğıt çıkardı; mavi bir gemi.
gulay/uzgun: Bunu siz saklayın avukat hanım. Ben bakamıyorum. Elif yenisini çizer. Hep çizer.
> Kâğıdı aldım. Gülay gitti. Arkasından bakarken koridorun ucunda Kenan Aksoy’u gördüm; yanında kimse yoktu, elinde bir bez parçası.
~ Bir yumruk. Bir boşluk. Ve benim dolduramadığım kırk dakika.
`),
        W(
          flag('cokus'),
          `
> Savcı dosyasını kapatırken bana bir kez daha baktı. “Bir yumruğu savunmak zordur” demişti. Haklıydı. Ben onu savunmadım bile; yalnızca kaybettim.
`,
        ),
        W(
          not(flag('cokus')),
          `
leyla: İstinaf süresi iki hafta. Kırk dakikayı bul, Deniz. Bu sefer kâğıtla. [phone]
`,
        ),
        O(`
# ARSLAN HUKUK · GECE YARISI [bg:buro_gece]
> Gece yarısına doğru Leyla büroya geldi. Kapımda durdu. Elinde sigara paketi; bu kez çevirmiyordu.
leyla: Bir yumruk ile bir ölümü ayıramadın. İlk celseden önce sana ne dedim, hatırlıyor musun?
- “Üçe böl.”
leyla: Üçe bölmek için önce üçünü de bulmak gerekir. Turnike, büfe, bir telefon. Hepsi kimsenin okumadığı kâğıtlardaydı.
> Paketi masama bıraktı. Gitti. Paketin içinde sigara yoktu; katlanmış bir kâğıt vardı: kendi el yazısıyla, otuz yıl önceki bir davanın ölüm saati.
~ Herkesin dolduramadığı bir kırk dakikası var. Leyla’nınki bir paketin içinde. Benimki şimdi Gülay’ın çantasında, mavi bir gemi.
`),
      ],
    }),
  ],
};
