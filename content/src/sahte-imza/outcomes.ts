import {
  all,
  any,
  atLeast,
  because,
  cmp,
  finalAtLeast,
  flag,
  has,
  not,
  outcome,
  v,
  xp,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { O, W } from './lib.js';

// 90-outcomes: sonuçlar (öncelik sırasıyla) ve sonuca bağlı epiloglar. Eşikler meta'daki eşik çubuğuyla aynı.

export const T_INDIRIM = 3000;
export const T_BERAAT = 9500;
export const T_BERAAT_B = 11000;

/**
 * Makul şüphe çekirdeği: tapu memurunun sol el beyanı, kargo kaydının kürsüde tanığa sunulması ve kuryenin açık
 * uçlu tanıklığı. Bunlardan ikisi dosyadaysa hiçbir mahkûmiyet sonucu seçilemez (CMK 223/2-e; şüpheden sanık
 * yararlanır). Tam beraatin koşulları (BERAAT_B/E) yoksa mahkeme çelişkiyi araştırarak giderir: Adli Tıp raporu varsa
 * UST_KURUL, yoksa RESEN_RAPOR (CMK 63, 67, 217). Şüphe ilkesi araştırma imkânları tükenince uygulanır.
 */
export const makulSuphe = atLeast(2, flag('contra_g3'), flag('contra_e4'), flag('mazeret_tanik'));

const istinaf = 'hükmün tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 272, 273/1)';

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK', {
      class: 'OTHER',
      priority: 1,
      when: flag('etik_kirlik'),
      stamp: 'AZİL',
      stampTone: 'red',
      sentence: 'Vekâlet sona erdi · dava sürüyor',
      verdictText:
        'Mahkemece, tanık Emre Kaya’nın sanık müdafiinin telkiniyle gerçeğe aykırı beyanda bulunduğunu açıklaması üzerine tutanak örneğinin Bursa Cumhuriyet Başsavcılığına ve Bursa Barosu Başkanlığına gönderilmesine; tanığın beyanının değerlendirme dışı bırakılmasına; sanığın müdafiini azletmesi nedeniyle duruşmanın yeni müdafiin katılımıyla devamına karar verildi.',
      reasoning: [
        because(
          'Müdafi, olay sabahı okulda bulunan bir tanıktan, görmediği bir olayı mahkemede anlatmasını istemiştir.',
        ),
        because(
          'Bu davranış yalan tanıklığa azmettirme şüphesi oluşturur (TCK 272, 38) ve avukatlık meslek kurallarına aykırıdır (Av.K. 34).',
        ),
        because(
          'Sanık vekâlet ilişkisini sona erdirmiştir (TBK 512/1). Dava başka bir müdafiin katılımıyla sürecektir.',
        ),
      ],
      legalBasis: 'TCK 272, 38; Av.K. 34; TBK 512/1',
      xp: 0,
      howToReach: 'Hiçbir tanığa görmediği bir şeyi söyletme; mazereti kayıtlarla kur.',
      ethicsCard:
        'Bir çocuğa, görmediği bir şeyi yeminle anlatmasını söyledin. Bu, yalan tanıklığa azmettirmedir ve bir avukatın meslekten çıkarılmasına yol açabilir. Gerçek bir mazeret zaten bir kurye terminalinde duruyordu.',
      epilogue: [
        O(`
C#adliye: ADLİYE KORİDORU · ÖĞLEDEN ÖNCE
N: Emre merdivenlerin başında, annesinin yanında oturuyordu. Annesi bana bakmadı; Emre baktı. On dokuz yaşında bir yüz, yirmi yıl yaşlanmış.
emre: Abla… Ben özür diledim. Siz de diler misiniz? Kimden, bilmiyorum.
N: Cevap vermedim. Vermeye hakkım yoktu.
N: Vedat koridorun öbür ucunda, yeni bir avukatla konuşuyordu. Avukat bir şey yazıyor, Vedat başını sallıyordu. Bir kez bana döndü. Sağ elini kaldırdı; ne bir selam, ne bir veda.
C#buro_gece: ARSLAN HUKUK · AKŞAM
N: Masamda ince bir kitapçık: Avukatlık Kanunu. Leyla bırakmıştı. Not yoktu. Not gerekmiyordu.
N: Kurşun harfler kitapçığın yanında duruyordu: Ş, E, T, A. Kâğıda basılınca ATEŞ.
T: Bu dosyanın bütün hikâyesi, birinin bir başkasının adına bir çizgi çekmesiydi. Ben o çizgiyi silmeye gelmiştim.
T: Sonunda bir çocuğun ağzına, onun olmayan bir cümle koydum. Daha iyi bir niyetle. Niyet bir cümleyi temizlemez; bir avukatı da.
`),
      ],
    }),
    outcome('COKUS', {
      class: 'CONVICTION',
      priority: 2,
      when: all(flag('cokus'), not(has('ev_rapor2')), not(makulSuphe)),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '2 yıl 6 ay hapis',
      verdictText: `Sanık Vedat Ateş’in sahte resmî belge düzenleme ve kullanma suçundan TCK 204/1 uyarınca, zararın ağırlığı gözetilerek temel cezanın 3 yıl hapis olarak belirlenmesine; duruşmadaki hâli lehine takdiri indirim nedeni sayılarak TCK 62/1 uyarınca 2 yıl 6 ay hapis cezası ile CEZALANDIRILMASINA; cezanın süresi gözetilerek erteleme ve hükmün açıklanmasının geri bırakılması hükümlerinin uygulanmasına yer olmadığına; ${istinaf} karar verildi.`,
      reasoning: [
        because('Savunma, sunduğu delillerin beyanlarla ilgisini ortaya koyamamış; itirazları dayanaksız kalmıştır.'),
        because(
          'Dosyadaki bilirkişi raporu ve tanık beyanları karşısında aksini gösteren somut bir delil tartışılamamıştır.',
          not(any(has('ev_kargo'), flag('contra_g3'), has('ev_rapor2_belirsiz'))),
        ),
        because(
          'Dosyaya giren kayıtlar ve beyanlar duruşmada savunmaca birbirine bağlanamamış; soruşturmadaki raporun ispat gücünü sarsacak ağırlıkta görülmemiştir.',
          any(has('ev_kargo'), flag('contra_g3')),
        ),
        because(
          'Adli Tıp Kurumu, mukayese imzası yetersiz olduğundan kesin kanaat bildirmemiştir; bu rapor ilk raporla çelişmemektedir.',
          has('ev_rapor2_belirsiz'),
        ),
      ],
      legalBasis: 'TCK 204/1, 61, 62/1; CMK 231/5; TCK 51/1',
      xp: xp(0.3, { ethicsVar: 'ethics' }),
      howToReach: 'Kürsüde yalnızca beyanla çelişen delili sun; dayanaksız itiraz güvenilirliği eritir.',
      epilogue: [
        O(`
C#adliye: ADLİYE ÖNÜ · ÖĞLEDEN SONRA
N: Savcı merdivenlerde durdu. Bana döndü; ilk kez.
savci: Kâğıtlarınız iyiydi avukat hanım. Elleriniz titredi.
N: Gitti. Ben kâğıtlarımı çantama koydum; düzgün, sıralı, kimsenin okumadığı.
C#depo: ATEŞ MATBAASI · AKŞAM
N: Vedat kurşun dizgi makinesinin başındaydı. Bir kasadan harfler aldı, tek tek dizdi: kendi adı. Ters. Sonra harfleri kasaya geri döktü.
vedat: İstinafa gideriz, değil mi avukat hanım? Bir kâğıt daha. Bir imza daha.
T: Bir imza daha. Bu kez benim imzam; bir istinaf dilekçesinin altında. Elim titremesin diye sabah makineye bakacağım.
`),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(
        not(flag('cokus')),
        not(flag('closing_indirim')),
        has('ev_rapor2'),
        has('ev_rapor2_ek'),
        flag('tarik_sustu'),
        any(has('ded_mazeret'), flag('contra_e4'), flag('mazeret_tanik')),
        cmp(v('pers'), '>=', 8),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · adli kontrol kaldırıldı',
      verdictText: `Sanık Vedat Ateş’in üzerine atılı sahte resmî belge düzenleme ve kullanma suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; hakkındaki adli kontrol tedbirinin kaldırılmasına; CMK 141 ve 142 uyarınca tazminat isteminde bulunabileceğinin bildirilmesine (CMK 231/3); duruşma tutanakları, Adli Tıp raporları ve tanık Erol Kılınç’ın beyanının bir örneğinin Tarık Ateş hakkında yürütülen soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; ${istinaf} karar verildi.`,
      reasoning: [
        because(
          'Adli Tıp Kurumu raporuna göre senet ve kapora makbuzundaki imzalar sanığın resmî mukayese imzalarıyla uyumsuzdur; sanığın el ürünü değildir.',
        ),
        because(
          'Soruşturmadaki grafoloji raporu, kaynağı ve imza sahibi belirsiz özel belgelerle yapıldığından hükme esas alınamamıştır.',
        ),
        because(
          'Tapu memuru, işlemi yapan kişinin imzayı sol eliyle attığını beyan etmiştir; sanık sağ elini kullanmaktadır.',
          flag('contra_g3'),
        ),
        because('Kargo kaydı ve kurye beyanı, sanığın işlem saatinde işyerinde olduğunu göstermektedir.'),
        because(
          'Randevu kaydı, teslim tutanağı, satış bedelinin bir borca mahsup edildiğine ilişkin beyan ve ek Adli Tıp raporu, işlemin başka bir kişi tarafından yapıldığını ortaya koymaktadır.',
        ),
        because('Deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141, 142, 231/3; CMK 63, 67/5, 217',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'İmzanın sanığa ait olmadığını resmî mukayeseyle kanıtla, mazereti kayda bağla, randevu numarasının sahibini bul ve somut bir suç duyurusuyla savcılığa bildir; kimseyle yüzleşme.',
      epilogue: [
        O(`
hakim: Türk Milleti adına…
N: “İşlemediği sabit olduğundan… beraatine.” Vedat kelimeleri duydu. Bir an anlamadı. Sonra iki elini birden masanın üstüne koydu ve gözlerini kapadı.
N: Sevgi arka sıradan kalktı, öne yürüdü, kocasının sağ elini avucuna aldı. Kâtip, tutanağın son satırını yazarken bir an durdu ve gülümsedi.
C#sokak_sabah: ADLİYE ÖNÜ · ÖĞLEDEN SONRA
N: Yağmur dinmişti. Adliyenin merdivenleri ıslak parlıyordu; Uludağ’ın üstünde bulutlar yırtılmış, arasından soluk bir güneş.
N: Nermin Kurt merdivenin başında bekliyordu. Elinde bir ilaç poşeti. Vedat’ı görünce bir adım attı; sonra bir adım daha.
nermin.uzgun: Kardeşim… Ben sana… Ben şikâyet ettim. Ben senin adına bir şikâyet yazdım.
vedat: Biliyorum abla. Kâğıt yalan söylemiyordu; kâğıdı tutan el söylüyordu.
nermin: O çocuğu küçükken ben de büyüttüm. Okul harçlarını ben ödedim. Elini öğretmen bağlardı, annem çözerdi.
N: İkisi de bir süre konuşmadı. Sonra Nermin poşetten bir kutu ilaç çıkardı ve Vedat’a uzattı.
nermin: Annemin. Pazar sen götürürsün. Perdesini de soruyor; sana söylesin.
`),
        W(
          flag('sevgi_anlatti'),
          `
N: Sevgi merdivenin dibinde, bir süre telefonuna baktı; sonra cebine koydu.
sevgi: Söyleseydim, belki hiçbiri olmazdı. Ocakta. O masada.
P: Belki. Belki de yine olurdu, ve siz bunu hiç bilmezdiniz.
sevgi: Öğretmenler hep “sonra anlatırım” der. Sonra diye bir şey yokmuş.
`,
        ),
        O(`
C#depo: ATEŞ MATBAASI · AKŞAM
N: Vedat kepengi kaldırdı. Dijital odanın ışığı kapalıydı. Kesim masasındaki makasın kolu hâlâ sola takılıydı. Vedat onu bir süre seyretti; dokunmadı.
vedat: On dört yıl avukat hanım. Ağabeyimin oğlu. Ona bir makas bile yasaklamadım.
C#buro_gece: ARSLAN HUKUK · GECE
N: Leyla kapımda durdu. Elinde iki bardak çay. Birini masama bıraktı.
leyla: Bazı davaları kazanırsın. Bazılarını kazandığın için kaybedersin. Bugün bir aile bir kişi eksildi Deniz. Senin yüzünden değil; ama senin önünde.
leyla: Kimseyi kovalamadın. Bunu hatırla. Bir gün kovalamak isteyeceksin.
N: Odasına döndü. Masasının köşesindeki ters çerçeveye bir an baktı; elini uzattı, sonra çekti.
C: SON
N: Tarık Ateş hakkında resmî belgede sahtecilik ve nitelikli dolandırıcılık suçlarından soruşturma sürüyor. Hayriye Ateş’in vasisi, tapu iptal ve tescil davası açtı.
N: Hayriye Hanım her pazar Halit’e çorba koymaya devam ediyor. Evinin yerinde durduğunu biliyor. Bu kez doğru biliyor.
`),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 4,
      when: all(
        not(flag('cokus')),
        not(flag('closing_indirim')),
        has('ded_mukayese'),
        any(has('ev_rapor2'), flag('contra_g3')),
        any(flag('contra_g3'), has('ded_mazeret'), flag('contra_e4'), flag('mazeret_tanik')),
        cmp(v('pers'), '>=', 6),
        finalAtLeast(T_BERAAT),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · adli kontrol kaldırıldı',
      verdictText: `Sanık Vedat Ateş’in üzerine atılı sahte resmî belge düzenleme ve kullanma suçunu işlediğine dair mahkûmiyetine yeter, her türlü şüpheden uzak, kesin ve inandırıcı delil bulunmadığından CMK 223/2-e uyarınca BERAATİNE; hakkındaki adli kontrol tedbirinin kaldırılmasına; CMK 141 ve 142 uyarınca tazminat isteminde bulunabileceğinin bildirilmesine (CMK 231/3); sahte suretin kim tarafından düzenlendiğinin araştırılması için dosya örneğinin Bursa Cumhuriyet Başsavcılığına gönderilmesine; ${istinaf} karar verildi.`,
      reasoning: [
        because(
          'Senet ve makbuzdaki imzaların sanığa ait olmadığı Adli Tıp Kurumu raporuyla anlaşılmıştır.',
          has('ev_rapor2'),
        ),
        because(
          'Soruşturmadaki grafoloji raporu, kaynağı ve imza sahibi belirsiz özel belgelerle yapıldığından hükme esas alınamamıştır.',
        ),
        because(
          'Tapu memuru, işlemi yapan kişinin imzayı sol eliyle attığını beyan etmiştir; sanık sağ elini kullanmaktadır.',
          flag('contra_g3'),
        ),
        because(
          'Sanığın işlem saatinde işyerinde olduğuna ilişkin kayıt dosyaya girmiştir.',
          any(has('ded_mazeret'), flag('contra_e4')),
        ),
        because(
          'Tapu memurunun sol el beyanı ve mukayese malzemesinin belirsizliği karşısında yeni bir imza incelemesi, şüpheyi gidermeye elverişli görülmediğinden ayrıca rapor alınmasına gerek görülmemiştir.',
          not(has('ev_rapor2')),
        ),
        because(
          'Sahte sureti kimin düzenlediği ve tapuda kimin bulunduğu kesin olarak belirlenememiştir; şüpheden sanık yararlanır.',
        ),
      ],
      legalBasis: 'CMK 223/2-e; CMK 141, 142, 231/3; CMK 217',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'İmzayı sanıktan ayır: sıvanmış mürekkebi sağ elle karşılaştır, tapu memurunun hafızasını aç, mukayese malzemesinin kirli olduğunu göster ve resmî imzalarla yeni rapor iste.',
      epilogue: [
        O(`
hakim: Türk Milleti adına…
N: “Mahkûmiyetine yeter… delil bulunmadığından… beraatine.” Vedat kelimeleri duydu. Başını salladı; bir müşterinin siparişini onaylar gibi. Sonra oturdu.
N: Sevgi arkasından eğilip omzuna dokundu. Vedat elini, sağ elini, onun elinin üstüne koydu.
C#adliye: ADLİYE KORİDORU · ÖĞLEDEN SONRA
N: Koridorda iki adliye görevlisi konuşuyordu; beni görmediler.
?BİR_SES@whisper: Sahtekâr ama kurtuldu. Avukatı iyiymiş.
N: Vedat da duydu. Durdu. Döndü. Sonra yürümeye devam etti.
vedat: Beraat dedi avukat hanım. Ama “yapmadı” demedi. “Kanıt yok” dedi. Bunu herkes duydu.
P: Kanıt yok demek, sizin aleyhinize hiçbir şey yok demek Vedat Bey. Kâğıtta adınız temiz.
vedat: Kâğıtta. Evet. Ben kâğıda inanırım. Bir ömür inandım.
N: Merdivenlerden inerken bir an durdu. Elini, sağ elini, tırabzana koydu; mürekkebin izleri hâlâ tırnaklarının dibindeydi.
vedat: Yarın dükkânı açacağım. Bir düğün davetiyesi var; bir çift evleniyor. Kâğıdı ben seçeceğim, harfleri ben dizeceğim. İsimlerini ben basacağım.
vedat: Bir ismi basmak kolaydır avukat hanım. Bir ismin altına imza atmak, onu taşımaktır. Ben kendi adımı yeniden taşımayı öğreneceğim.
N: Adliyenin önünde bir simitçi tezgâhını açıyordu. Vedat iki simit aldı; birini bana uzattı, birini Sevgi’ye. Kendine almadı.
vedat: Beş aydır boğazımdan bir şey geçmiyor. Yarın geçer belki. Yarın dükkânda, makinenin başında.
`),
        W(
          flag('tarik_sustu'),
          `
N: Tarık duruşmadan sonra kimseye görünmedi. Arka kapıdan çıkmıştı; Doblo otoparkta değildi. Sevgi telefonunu iki kez aradı, açılmadı.
N: Vedat merdivenlerin başında bir an durdu, arkasına baktı. Kimseyi beklemiyordu; yine de baktı. Sonra Sevgi’nin koluna girip indi.
`,
        ),
        W(
          all(has('ded_randevu'), not(flag('tarik_sustu'))),
          `
N: Merdivenlerin başında Tarık bekliyordu. Sevgi’nin koluna girdi, onu arabaya doğru götürdü. Vedat arkalarından baktı.
T: Bir numara biliyorum. Bir randevu kaydı. Onları bir savcının masasına koymadım. Belki bir gün biri koyar. Belki hiç kimse.
`,
        ),
        W(
          not(flag('tarik_sustu')),
          `
N: Tarık arabanın kapısını Sevgi için açtı. Vedat’a el salladı; Vedat el salladı. Araba yokuştan aşağı kaydı, yağmurun içinde kayboldu.
`,
        ),
        O(`
C#buro_gece: ARSLAN HUKUK · GECE
N: Leyla odamın kapısında durdu. Elinde paltosu.
`),
        W(
          flag('tarik_sustu'),
          `
leyla: Bir imzayı sahibinden ayırdın. İyi iş. Bir numarayı da kürsüde sahibine bağladın.
leyla: Kürsüde gösterdin ama savcıya yazmadın; bir tutanak, bir suç duyurusu değildir.
P: Hâkim dosyayı Başsavcılığa gönderdi.
leyla: Sahte sureti gönderdi. Numarayı, borcu, mahsubu bir dilekçede yan yana yazan kimse yok. Kalabalık bir masada bir savcı onları kendiliğinden dizmez.
P: Ben bir müvekkili savundum Leyla Hanım. Bir faili aramadım.
leyla: Aramadın; buldun. Bulduğunu da yarı yolda bıraktın. Bunu da kendine söylemeyi öğreneceksin. Hiçbir gece tamamen kolay olmaz.
`,
        ),
        W(
          not(flag('tarik_sustu')),
          `
leyla: Bir imzayı sahibinden ayırdın. İyi iş. Ama kimin eline ait olduğunu bulamadın.
P: Bulmam gerekmiyordu.
leyla: Gerekmiyordu. Haklısın. Ceza davasında şüphe sanığındır. Ama bir ailede şüphe herkesindir Deniz. Bu ailede artık herkes herkesin elinden şüphelenecek.
leyla: Kâğıtlarda bir numara gördün mü? Bir randevu kaydı? Bir tutanak? Gördüysen ve bir yere yazmadıysan, onu bir gün yeniden göreceksin. Uykunda.
P: Ben bir müvekkili savundum Leyla Hanım. Bir faili aramadım.
leyla: Doğru. Bunu da kendine söylemeyi öğreneceksin. Her gece biraz daha kolay olur. Hiçbir gece tamamen kolay olmaz.
`,
        ),
        O(`
N: Gitti. Kurşun harfler masamda duruyordu: Ş, E, T, A. Kâğıda basılınca ATEŞ.
N: Pencereyi açtım. Yağmur dinmiş, sokak lambaları ıslak asfalta uzun sarı çizgiler bırakmıştı. Bir yerde bir köpek havladı, sonra sustu.
N: Dosyayı kapadım ve dolaba kaldırdım. Etiketine kendi el yazımla “Ateş · Beraat” yazdım. Harflerim sağa yatıktı; elim titremiyordu.
`),
        W(
          flag('tarik_sustu'),
          `T: Numarayı kürsüde söyledim; bir dilekçeye yazmadım. Bu dosyada bir el hâlâ havada duruyor; bir kalem tutar gibi.`,
        ),
        W(
          not(flag('tarik_sustu')),
          `T: Bir imzayı sahibinden ayırdım. Kimin eline ait olduğunu bulamadım. Bu dosyada bir el hâlâ havada duruyor; bir kalem tutar gibi.`,
        ),
        O(`
N: Telefon titredi. Sevgi’den bir mesaj: “Vedat dükkânı açtı. Makineyi çalıştırdı. Bir düğün davetiyesi basıyor; isimleri kendisi diziyor.”
N: Bir dakika sonra ikinci mesaj: “Tarık bugün gelmedi. Telefonu kapalı.”
T: İki mesaj. Biri bir adamın hayatına döndüğünü söylüyor. Öbürü, bir başkasının hayatından bir kapının kapandığını. Kâğıtlar bunu yazmayacak; ama ben biliyorum.
C: SON
N: Vedat Ateş beraat etti. Hisar’daki evin tapusu hâlâ Erol Kılınç adına kayıtlı. Hayriye Hanım’ın vasisi tapu iptal davası açmayı düşünüyor.
`),
      ],
    }),
    outcome('UST_KURUL', {
      class: 'OTHER',
      priority: 5,
      when: has('ev_rapor2'),
      stamp: 'KARAR YOK',
      stampTone: 'amber',
      header: 'ARA KARAR',
      sentence: 'Dosya Adli Tıp kurulunda · duruşma ertelendi',
      verdictText:
        'Mahkemece, soruşturmada alınan grafoloji raporu ile Adli Tıp Kurumu raporu arasındaki çelişkinin giderilmesi için dosyanın Adli Tıp Kurumu Fizik İhtisas Kurulu’na gönderilmesine; Adli Tıp raporu gözetilerek sanık hakkındaki adli kontrol tedbirinin kaldırılmasına; duruşmanın kurul raporunun gelmesine kadar ertelenmesine karar verildi.',
      reasoning: [
        because(
          'Adli Tıp Kurumu raporuna göre senet ve makbuzdaki imzalar sanığın resmî mukayese imzalarıyla uyumsuzdur; soruşturmadaki rapor ise aynı elin ürünü olduğunu söylemektedir.',
        ),
        because(
          'İki bilirkişi raporu arasındaki çelişki giderilmeden hüküm kurulamaz; çelişki üst düzey bir kuruldan rapor alınarak giderilmelidir (CMK 63, 67, 217).',
        ),
        because(
          'Raporlar arasındaki çelişkiyi açıklayacak ve imzayı sanıktan ayıracak başka bir delil duruşmada tartışılmamıştır.',
          not(any(flag('contra_g3'), has('ded_mazeret'), flag('contra_e4'), flag('mazeret_tanik'))),
        ),
        because(
          'Savunma, dosyadaki delilleri duruşmada beyanlarla ilişkilendirememiştir; mahkeme çelişkiyi kendiliğinden çözme yoluna gitmemiştir.',
          any(flag('contra_g3'), has('ded_mazeret'), flag('contra_e4'), flag('mazeret_tanik')),
        ),
      ],
      legalBasis: 'CMK 63, 67, 68, 217',
      xp: xp(0.7, { ethicsVar: 'ethics' }),
      howToReach:
        'Adli Tıp raporunu aldın; tek başına bırakma. Kürsüde sol el beyanını, mazereti ve kirli mukayeseyi rapora bağla; dayanaklarını ve esas savunmanı bunların üstüne kur.',
      epilogue: [
        O(`
hakim: Ara karar…
N: “Fizik İhtisas Kurulu’na gönderilmesine… adli kontrol tedbirinin kaldırılmasına… ertelenmesine.” Vedat kelimeleri duydu; hangisinin iyi, hangisinin kötü olduğunu bilemedi.
N: Kâtip ara kararı yazdırdı. Hâkim dosyayı kapadı, bir sonrakini açtı. Bir aile salonun ortasında, ne kazanmış ne kaybetmiş, ayakta kaldı.
C#adliye: ADLİYE KORİDORU · ÖĞLEDEN SONRA
vedat: Kurul. Bir kurul daha. Bir kâğıt daha avukat hanım. Kaç ay?
P: Birkaç ay. Belki daha fazla. Ama imzayı tutmanız gerekmiyor artık; karakola da gitmeyeceksiniz.
vedat: Karakol değil mesele. Mahalle. Dükkâna gelen müşteri. “Sahtekâr Vedat” daha birkaç ay. Kurul ne der, mahalle onu duymaz.
`),
        W(
          cmp(v('mutalaa'), '==', 'BERAAT'),
          `
N: Savcı beraat istemişti. Hâkim mütalaayla bağlı değildi; iki raporla da. Bir üçüncüsünü istedi.
T: Savcıyı ikna eden kâğıtlar, hâkimi yalnız bıraktı. Kâğıtları ben konuşturmalıydım; konuşturmadım.
`,
        ),
        W(
          flag('cokus'),
          `
N: Savcı merdivenlerde yanımdan geçti; durmadı. Hâkimin sesi hâlâ kulağımdaydı: “Savunmanızı yazılı olarak verin.”
T: Bir rapor bu dosyayı kurtardı; ben neredeyse batırıyordum. Kâğıtlar benden iyi avukattı.
`,
        ),
        O(`
N: Sevgi kocasının koluna girdi.
`),
        W(
          flag('tarik_sustu'),
          `N: Koridorun ucu boştu. Tarık duruşmadan sonra kimseye görünmemişti; Sevgi telefonuna bir kez baktı, sonra cebine koydu.`,
        ),
        W(
          not(flag('tarik_sustu')),
          `N: Koridorun ucunda Tarık bekliyordu; Doblo’nun anahtarı elinde. Sevgi bir an durdu, sonra yürüdü.`,
        ),
        O(`
C#depo: ATEŞ MATBAASI · AKŞAM
N: Vedat kepengi kaldırdı. Makineyi çalıştırmadı. Kurşun harf kasasının başında durdu; bir harf aldı, avucunda tarttı, geri koydu.
vedat: Babam derdi ki: baskıya girmeden önce son bir prova alınır. Prova temizse basarsın. Benim provam bir kurulda.
C#buro_gece: ARSLAN HUKUK · GECE
leyla: Bir rapor kazandın. Davayı kazanmak için onu konuşturman gerekiyordu. Bir hâkim iki raporun arasında yalnız kalırsa, üçüncü bir rapor ister.
leyla: Raporun yanına bir tanık koy, bir kayıt koy, bir zincir koy. Sonra hâkim yalnız kalmaz.
P: Kurul raporu gelince yeniden kürsüye çıkacağız.
leyla: Çıkacaksınız. O gün kâğıtlarını sırala; bugünkü gibi değil.
C: SON
N: Dosya Adli Tıp Kurumu Fizik İhtisas Kurulu’nda. Vedat Ateş hakkında adli kontrol kaldırıldı. Hisar’daki ev hâlâ Erol Kılınç adına kayıtlı.
`),
      ],
    }),
    outcome('RESEN_RAPOR', {
      class: 'OTHER',
      priority: 6,
      when: makulSuphe,
      stamp: 'KARAR YOK',
      stampTone: 'amber',
      header: 'ARA KARAR',
      sentence: 'Adli Tıp’a resmî imzalarla inceleme · duruşma ertelendi',
      verdictText:
        'Mahkemece, soruşturmada alınan grafoloji raporu ile tapu memurunun beyanı ve sanığın işlem saatine ilişkin deliller arasındaki çelişki karşısında imzanın aidiyeti hususunda hükme yeter açıklık bulunmadığından, sanığın noter, banka ve nüfus kayıtlarındaki resmî imzaları getirtilerek senet ve kapora makbuzundaki imzalar hakkında Adli Tıp Kurumu’ndan rapor alınmasına; sanık hakkındaki adli kontrol tedbirinin kaldırılmasına; duruşmanın raporun gelmesine kadar ertelenmesine karar verildi.',
      reasoning: [
        because(
          'Soruşturmadaki grafoloji raporu imzanın sanığa ait olduğunu bildirmektedir; ancak bilirkişi raporu hâkimi bağlamaz ve dosyadaki diğer delillerle birlikte değerlendirilir (CMK 217).',
        ),
        because(
          'Raporun mukayese malzemesi, kaynağı ve imza sahibi belirsiz özel belgelerden oluşmaktadır.',
          has('ded_mukayese'),
        ),
        because(
          'Tapu memuru, işlemi yapan kişinin imzayı sol eliyle attığını beyan etmiştir; sanık sağ elini kullanmaktadır.',
          flag('contra_g3'),
        ),
        because(
          'Kargo terminali kaydı sanığı imza saatinde işyerinin önünde göstermektedir; alıcı tanık bu kayıt karşısında beyanını açıklayamamıştır.',
          flag('contra_e4'),
        ),
        because('Bağımsız kurye tanık, sanığın 11.19–11.37 arasında yanından ayrılmadığını beyan etmiştir.', flag('mazeret_tanik')),
        because(
          'Bu deliller raporla çelişmektedir; çelişki giderilmeden sanık aleyhine hüküm kurulamaz. Şüphe, araştırma imkânları tüketildiğinde sanık lehine sonuç doğurur.',
        ),
        because(
          'Adli Tıp Kurumu ilk incelemede ek mukayese örneği gerektiğini bildirmiştir; noter ve banka kayıtlarındaki imzalar getirtilerek inceleme tamamlanacaktır.',
          has('ev_rapor2_belirsiz'),
        ),
        because(
          'Sanığın tartışmasız resmî imzalarıyla yapılacak bir inceleme çelişkiyi giderebilecek nitelikte olduğundan mahkemece re’sen rapor alınmasına karar verilmiştir (CMK 63, 67).',
        ),
      ],
      legalBasis: 'CMK 63, 67, 217; CMK 223/2-e (şüphe ilkesi)',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach:
        'Yeni bilirkişi talebini mahkeme senin yerine yaptı. Resmî imzalarla rapor iste, mukayesenin kirli olduğunu göster ve kürsüde halkaları birbirine bağla.',
      epilogue: [
        O(`
hakim: Ara karar…
N: “…Adli Tıp Kurumu’ndan rapor alınmasına… adli kontrol tedbirinin kaldırılmasına… ertelenmesine.” Vedat kelimeleri duydu; hangisinin kendisi için olduğunu bilemedi.
N: Kâtip ara kararı yazdırdı. Savcı dosyasını kapadı, bana bir an baktı; sonra bir sonraki dosyanın kapağını açtı.
C#adliye: ADLİYE KORİDORU · ÖĞLEDEN SONRA
vedat: Bir rapor daha mı avukat hanım? Hâkim bana inanmadı mı?
P: İnanmadığı şey rapordu Vedat Bey. Bir tapu memuru bir eli hatırladı, bir kayıt bir sabahı. Hâkim onları duydu; şimdi kendi gözüyle bir kâğıt görmek istiyor.
vedat: Siz istemediniz mi o kâğıdı?
T: İstememiştim. Resmî imzalarla bir inceleme. Hâkim, benim yazmadığım dilekçeyi kendisi yazdı.
`),
        W(
          flag('cokus'),
          `
N: Savcı merdivenlerde yanımdan geçti, durmadan konuştu: “Tanıklarınız dosyayı ayakta tuttu avukat hanım. Kâğıtlarınız değil.”
T: Haklıydı. Ben salonda düşerken iki tanık ayakta kalmıştı.
`,
        ),
        W(
          flag('closing_indirim'),
          `T: Kapanışta indirim istemiştim. Hâkim dosyada benim inanmadığım bir şeyi gördü; benim kâğıtlarımda.`,
        ),
        W(
          flag('tarik_sustu'),
          `N: Tarık duruşmadan sonra kimseye görünmedi. Sevgi telefonuna iki kez baktı; ekran karanlık kaldı.`,
        ),
        W(
          not(flag('tarik_sustu')),
          `N: Koridorun ucunda Tarık, Sevgi’ye su getirdi. Sevgi bardağı aldı, içti. Vedat merdivenleri tek başına indi.`,
        ),
        O(`
C#depo: ATEŞ MATBAASI · AKŞAM
N: Vedat kepengi kaldırdı, ışığı yaktı; makinenin başına geçmedi. Duvardaki çerçeveye baktı: “Ateş Matbaası’nda her harf doğrudur.”
vedat: Karakola gitmeyeceğim artık. Ama mahallede kimse ara karar okumaz avukat hanım. “Daha bitmedi” derler, geçerler.
C#buro_gece: ARSLAN HUKUK · GECE
leyla: Hâkim senin yerine bilirkişi istedi. Bunu bir iltifat sanma.
P: Bir sol el. Bir sabah. Bir kayıt. Yetmedi mi?
leyla: Halkalar dosyada; zincir değil. Araştırma yolu açıkken hâkim şüpheyle karar vermez. O yolu sen açmalıydın: resmî imzalar, Adli Tıp, gerekçeli bir dilekçe.
T: Bir imza hâlâ kimseye ait değil. Rapor gelince yeniden kürsüye çıkacağım; bu kez kâğıtlarım sıralı.
C: SON
N: Dosya Adli Tıp Kurumu’nda. Vedat Ateş hakkında adli kontrol kaldırıldı. Hisar’daki ev hâlâ Erol Kılınç adına kayıtlı.
`),
      ],
    }),
    outcome('INDIRIM', {
      class: 'REDUCED',
      priority: 7,
      when: all(
        not(flag('cokus')),
        not(has('ev_rapor2')),
        not(makulSuphe),
        cmp(v('pers'), '>=', 3),
        finalAtLeast(T_INDIRIM),
      ),
      stamp: 'İNDİRİM',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '1 yıl 8 ay hapis · ertelendi',
      verdictText: `Sanık Vedat Ateş’in sahte resmî belge düzenleme ve kullanma suçundan TCK 204/1 uyarınca alt sınırdan 2 yıl hapis cezası ile cezalandırılmasına; sabıkasızlığı ve duruşmadaki hâli lehine takdiri indirim nedeni sayılarak TCK 62/1 uyarınca 1 yıl 8 ay hapis cezası ile CEZALANDIRILMASINA; zarar giderilmediğinden hükmün açıklanmasının geri bırakılmasına yer olmadığına (CMK 231/6-c); cezanın TCK 51/1 uyarınca ERTELENMESİNE, 1 yıl denetim süresi belirlenmesine; ${istinaf} karar verildi.`,
      reasoning: [
        because(
          'Soruşturmadaki grafoloji raporu imzanın sanığa ait olduğunu tespit etmiştir; savunmanın itirazları raporun ispat gücünü tümüyle ortadan kaldıramamıştır.',
        ),
        because(
          'Adli Tıp Kurumu, mukayese imzası yetersiz olduğundan kesin kanaat bildirmemiştir; bu rapor ilk raporu çürütmemektedir.',
          has('ev_rapor2_belirsiz'),
        ),
        because(
          'Tapu memurunun beş ay sonra hatırladığı sol el beyanı, başka bir delille desteklenmediğinden tek başına grafoloji raporunun ispat gücünü sarsacak nitelikte görülmemiştir.',
          flag('contra_g3'),
        ),
        because(
          'Kargo terminali kaydı, teslimi kimin yaptığını değil terminale kimin dokunduğunu gösterir; tek başına sanığın imza saatinde başka yerde olduğunu ispatlamaz.',
          all(has('ev_kargo'), not(flag('mazeret_tanik'))),
        ),
        because(
          'Kurye tanığın beyanı, başka bir delille desteklenmediğinden tek başına raporla belirlenen imza aidiyetini ortadan kaldıracak nitelikte görülmemiştir.',
          flag('mazeret_tanik'),
        ),
        because('Sanığın sabıkasızlığı ve duruşmadaki tutumu takdiri indirimde gözetilmiştir.'),
        because('Hayriye Ateş’in zararı giderilmediğinden hükmün açıklanması geri bırakılamamıştır.'),
      ],
      legalBasis: 'TCK 204/1, 62/1, 51/1; CMK 231/6-c',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Beraat için imzanın sanığa ait olmadığını kanıtlayan bir rapor ya da sol el beyanının yanına bir mazeret koymalısın; tek bir halka raporu sarsmaz.',
      epilogue: [
        O(`
hakim: Türk Milleti adına…
N: “Bir yıl sekiz ay… ertelenmesine.” Vedat kelimeleri duydu. Sevgi “ertelendi” kelimesini iki kez tekrarladı, kendine. İçeri girmeyecekti. Ama bir sicili olacaktı.
C#adliye: ADLİYE KORİDORU · ÖĞLEDEN SONRA
vedat: Ertelendi. İçeri girmeyeceğim. Ama sicilime “sahtekâr” yazdılar avukat hanım. Bir matbaacının siciline.
vedat: Babam bu dükkânı açtığında bir kâğıt bastı, çerçeveletip duvara astı: “Ateş Matbaası’nda her harf doğrudur.” O kâğıdı indireceğim.
P: İstinafa gideriz Vedat Bey. Kâğıtlar hâlâ konuşuyor.
vedat: Gidelim. Gidelim de… Annemin evini kim geri getirecek? O da istinafta mı?
`),
        W(
          not(flag('tarik_sustu')),
          `N: Koridorun ucunda Tarık bir sandalyeye oturmuş, başını elleri arasına almıştı. Sevgi yanına gitti, bir şey söyledi. Tarık başını kaldırmadı.`,
        ),
        O(`
C#depo: ATEŞ MATBAASI · AKŞAM
N: Vedat kepengi yarıya kadar indirdi. Duvardaki çerçeveyi aldı, tozunu sildi, bir çekmeceye koydu.
vedat: Bir kâğıt doğru basılmaz bazen. Mürekkep kaçar. O zaman kâğıdı atarsın, yeniden basarsın. Hayatı yeniden basamazsın.
C#buro_gece: ARSLAN HUKUK · GECE
leyla: Bir yıl sekiz ay, ertelendi. Bazıları buna kazanmak der. Müvekkiline sor; o ne diyor?
P: Sicili.
leyla: Sicili. İstinaf dilekçesini yarın sabah yaz. Bugün değil. Bugün kendine şunu sor: hangi kâğıdı istemedin? Hangi soruyu sormadın?
C: SON
N: İstinaf dilekçesi on dört gün içinde verildi. Hisar’daki ev hâlâ Erol Kılınç adına kayıtlı.
`),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 8,
      when: { all: [] },
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '2 yıl 6 ay hapis',
      verdictText: `Sanık Vedat Ateş’in sahte resmî belge düzenleme ve kullanma suçundan TCK 204/1 uyarınca, zararın ağırlığı gözetilerek temel cezanın 3 yıl hapis olarak belirlenmesine; sabıkasızlığı lehine takdiri indirim nedeni sayılarak TCK 62/1 uyarınca 2 yıl 6 ay hapis cezası ile CEZALANDIRILMASINA; cezanın süresi gözetilerek erteleme ve hükmün açıklanmasının geri bırakılması hükümlerinin uygulanmasına yer olmadığına; ${istinaf} karar verildi.`,
      reasoning: [
        because('Grafoloji raporuna göre senetteki imza sanığa aittir.'),
        because(
          'Rapora karşı ileri sürülen itirazlar somut bir delille desteklenmemiştir.',
          not(any(has('ev_kargo'), flag('contra_g3'), has('ded_mukayese'))),
        ),
        because(
          'Savunmanın ileri sürdüğü sol el beyanı, kayıtlar ve mukayese malzemesine ilişkin itirazlar, duruşmada raporun ispat gücünü ortadan kaldıracak biçimde ortaya konulamamıştır.',
          any(has('ev_kargo'), flag('contra_g3'), has('ded_mukayese')),
        ),
        because(
          'Adli Tıp Kurumu, mukayese imzası yetersiz olduğundan kesin kanaat bildirmemiştir.',
          has('ev_rapor2_belirsiz'),
        ),
        because('Tapu memuru, sanığı işlemi yapan kişi olarak tanımıştır.', not(any(flag('contra_g4'), flag('ob_g4')))),
        because('Sanığın 2024 yılında taşınmazı satmak istediği sabittir.'),
      ],
      legalBasis: 'TCK 204/1, 61, 62/1; CMK 231/5; TCK 51/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach:
        'Senedi büyüteçle incele, raporun eklerine bak, sanığın elini izle; tapu memuruna “hangi elle” diye sor ve resmî imzalarla yeni bilirkişi iste.',
      epilogue: [
        O(`
hakim: Türk Milleti adına…
N: “İki yıl altı ay… erteleme… yer olmadığına.” Vedat ayağa kalkmıştı; hükmü ayakta dinlerken sağ eli masanın kenarındaydı. Kelimeler bitince elini çekti, cebine soktu.
N: Sevgi arka sırada oturdu kaldı. Ağlamadı. Bir öğretmen sınıfında ağlamaz; mahkeme salonu da bir sınıftı, kimse ona öyle söylememiş olsa da.
C#adliye: ADLİYE KORİDORU · ÖĞLEDEN SONRA
vedat: İstinaf. Biliyorum. Bir kâğıt daha. Bir imza daha. Sizin imzanız bu sefer.
vedat: Avukat hanım, bir şey soracağım. O imza kimin? Bunu bilmeden içeri girersem, her gece düşüneceğim.
T: Cevap veremedim. Bilmiyordum. Bilmediğimi bilmek, bu dosyada öğrendiğim tek şeydi.
`),
        W(
          not(flag('tarik_sustu')),
          `N: Koridorun ucunda Tarık, Sevgi’ye su getirdi. Sevgi bardağı aldı, içmedi. Tarık amcasının omzuna dokundu; Vedat dokunuşu fark etmedi.`,
        ),
        O(`
C#depo: ATEŞ MATBAASI · GECE
N: Vedat son kez dizgi makinesini çalıştırdı. Bir kasadan harfler aldı, tek tek dizdi: kendi adı. Ters.
N: Kâğıda bastı. VEDAT ATEŞ. Kâğıda baktı. Sonra kâğıdı katladı, ceketinin iç cebine koydu; kimliğinin durduğu yere.
C#buro_gece: ARSLAN HUKUK · GECE
leyla: Kazanamadığın dava, en uzun ders verendir. Bu dersi oku Deniz. Sonra istinaf dilekçesini yaz. Ve bu kez her eki oku.
C: SON
N: İstinaf dilekçesi süresinde verildi. Karar kesinleşmedi. Vedat o pazar da huzurevine gitti; annesi evini sordu. “Yerinde” dedi.
`),
      ],
    }),
  ],
};
