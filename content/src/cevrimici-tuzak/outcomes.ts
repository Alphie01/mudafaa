import {
  all,
  always,
  any,
  because,
  cmp,
  finalAtLeast,
  flag,
  has,
  not,
  outcome,
  ref,
  v,
  xp,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { S, W, O } from './dsl.js';

// 90-outcomes: ETİK (hukuka aykırı kayıt / tanığı etkileme), 223/2-b beraat, 223/2-e beraat, 158/4 (indirim),
// mahkûmiyet (varsayılan). Final eşikleri eşik çubuğunun `from` değerleriyle aynıdır (meta.ts).

export const T_INDIRIM = 3000;
export const T_BERAAT_B = 8000;

const notCollapsed = not(flag('cokus'));

/** Etik ihlali: hukuka aykırı kaydı sunmak ya da almak, tanığı etkilemek, iki ve daha fazla meslek ihlali. */
const ethicsBreach = any(flag('illegal_used'), flag('tanik_etkileme'), cmp(v('ethics'), '>=', 2));

/** Mahkemenin gözü önüne gelen ihlal: hukuka aykırı kaydın sunulması ya da tanığın salonda müdafii anlatması. */
const breachVisible = any(
  flag('illegal_used'),
  all(flag('arda_etkileme'), flag('arda_cagrildi')),
  all(any(flag('onur_para'), flag('onur_baski')), flag('onur_cagrildi')),
);
const ardaVisible = all(flag('arda_etkileme'), flag('arda_cagrildi'));
const baroLine = because(
  'Müdafiin tutumu nedeniyle karar örneğinin Bursa Barosuna ve gereği için Bursa Cumhuriyet Başsavcılığına gönderilmesine karar verilmiştir (Av.K. 34, 58; CMK 158).',
  breachVisible,
);

/**
 * 223/2-e beraatin delil koşulu: hat (sahte vekâlet, başka kişi), cihaz, kast ve kira iddiası hukuka uygun delillerle
 * çürütüldü. Delil tamsa skor ve ikna ne olursa olsun hüküm beraattir (mahkeme ispatlanmış olguya karşı mahkûm etmez);
 * skor yalnızca karnedeki derecelendirmedir. Mütalaa ayrıca ikna ≥ 8 ister; hâkim mütalaayla bağlı değildir.
 */
const acquitE = ref('delil_beraat');

/** Adli kontrol: 1. celsede kaldırıldıysa hükümde yeniden kaldırılmaz. */
const adliKontrol = [
  because('Sanık hakkındaki yurt dışına çıkış yasağı 4.11.2026 tarihli celsede kaldırılmıştır.', flag('yasak_kalkti')),
  because(
    'Sanık hakkındaki adli kontrol tedbirinin (yurt dışına çıkış yasağı) kaldırılmasına karar verilmiştir (CMK 109, 110).',
    not(flag('yasak_kalkti')),
  ),
];

/** Beraat epiloglarında meslek ihlallerinin izi. */
const ethicsEpilogue = [
  W(
    cmp(v('ethics'), '>=', 1),
    S`
      = ARSLAN HUKUK · ERTESİ SABAH @buro
      - Leyla beni odasına çağırdı. Kapıyı kapattı. Masasında bir kâğıt vardı; kâğıdı bana çevirmedi.
      leyla: Kazandın. Bunu kimse elinden alamaz. Ama nasıl kazandığını da kimse elinden alamaz, Deniz.
    `,
  ),
  W(
    flag('ece_inkar'),
    S`leyla: Müvekkiline "inkâr et" dedin. Doğruyu sonradan kendisi söyledi; sen söyletmedin. Bunu unutma.`,
  ),
  W(
    flag('onur_baski'),
    S`leyla: Bayideki çocuk tutanakta seni anlattı. Baro bir dosya açtı. Savunmanı yazarken bu davayı kazandığını yazma; bir tanığı korkuttuğunu yaz.`,
  ),
  W(
    flag('nurettin_baski'),
    S`leyla: Avukatı olmayan bir adama şikâyetinden vazgeç dedin. Kantinde. Bir öğretmene. O adam bunu unutmaz; ben de unutmam.`,
  ),
  W(
    cmp(v('ethics'), '>=', 1),
    S`
      - Leyla ters çerçeveye baktı, çevirmedi. "Bu dosyayı bir hafta sonra bana sözlü anlatacaksın" dedi. "Her ihlali. Tek tek."
      ~ Beraat kararı masamda duruyordu. Yanında Leyla'nın kâğıdı. İkisini aynı çekmeceye koyamadım. !fade
    `,
  ),
];

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK_BERAAT', {
      class: 'ACQUITTAL',
      priority: 1,
      when: all(notCollapsed, ethicsBreach, acquitE),
      stamp: 'BERAAT · BARO',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Sanık beraat etti · Müdafi hakkında disiplin yolu açık',
      verdictText:
        'Sanık Ece Yalın’ın üzerine atılı nitelikli dolandırıcılık suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Savunmanın sunduğu bayi sistemi ekran görüntüsü yetkisiz erişimle elde edildiğinden hükme esas alınmamıştır (Anayasa 38/6; CMK 206/2-a, 217/2).',
          flag('illegal_used'),
        ),
        because(
          'Müdafiin tanığa ne söyleyeceğini yönlendirdiği anlaşıldığından tanık Arda Kılıç’ın beyanı ve buna dayanan çıkarımlar değerlendirme dışı bırakılmıştır (CMK 217/1).',
          ardaVisible,
        ),
        because(
          'Müdafiin bayi çalışanına para bırakmaya çalıştığı tanık beyanıyla anlaşılmış; tanığın beyanı yalnızca belgelerle doğrulandığı ölçüde değerlendirilmiştir (CMK 217/1).',
          all(flag('onur_para'), flag('onur_cagrildi')),
        ),
        because(
          'Mahkeme kararıyla gelen banka kaydı, iletişim tespiti, operatör dökümü ve bayi işlem belgeleri, hattın sahte bir vekâletnameyle alındığını ve işlemlerin sanığın telefonundan yapılmadığını göstermiştir.',
        ),
        because(
          'Sanık kodu “SGK işe giriş kodu” sanarak okuduğunu açıklamış; iştirak kastı ispatlanamamıştır (TCK 21/1, 37).',
          ref('kast_yok'),
        ),
        ...adliKontrol,
        because(
          'Müdafiin delil elde etme ve tanıkla ilişki biçimi sanığın aleyhine yorumlanamaz; hükme yalnızca hukuka uygun deliller esas alınmıştır.',
          breachVisible,
        ),
        baroLine,
        because(
          'Sanığın suçu işlediğine dair kesin ve inandırıcı delil elde edilememiştir; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).',
        ),
      ],
      legalBasis: 'CMK 223/2-e, 206/2-a, 217/2, 158, 273/1; Anayasa 38/4, 38/6; TCK 21/1, 38, 136, 243, 277; Av.K. 34, 58',
      xp: 0,
      howToReach:
        'Müvekkilin masumiyetini hukuka uygun delillerle kanıtlarken bir yandan yetkisiz kayıt almak, bir tanığı yönlendirmek ya da birden fazla meslek kuralını çiğnemek. Müvekkil kurtulur; avukat kurtulmaz.',
      ethicsCard:
        'Müvekkil bu kez kurtuldu, çünkü hukuka uygun deliller yetti. Ama avukat delili yasal yoldan ister: yetkisiz erişimle kayıt aldırmak suçtur (TCK 243, 136, 38) ve hükme esas alınamaz (CMK 206/2-a, 217/2). Tanığa cümle vermek tanığı etkilemedir (TCK 277). Mahkeme karar örneğini baroya ve savcılığa gönderir; disiplin yaptırımı meslekten çıkarmaya kadar gidebilir (Av.K. 34, 135 vd.).',
      epilogue: [
        O(S`
          hakim: Türk Milleti adına… beraatine.
        `),
        W(
          breachVisible,
          S`
            hakim: …karar örneğinin Bursa Barosuna ve Başsavcılığa gönderilmesine.
            - İki cümle, aynı nefeste. Birincisinde Ece'nin omuzları düştü; ikincisinde benimkiler.
            - Ece bana döndü. Gülmeye çalıştı; sonra yüzümü gördü ve gülmeyi bıraktı. "Ne demek o?" dedi. Cevap vermedim.
          `,
        ),
        W(
          not(breachVisible),
          S`
            - Ece bana döndü, güldü, ağladı, yine güldü. Ben gülemedim. Salonda kimse bilmiyordu; ben biliyordum. Bilerek çiğnediğim bir kural, "kimse bilmez" diye susturduğum bir ses.
            - Leyla arka sıradan kalktı. Yanıma gelmedi. Kapıda durup bekledi; beni değil, benim ona gelmemi.
          `,
        ),
        O(S`
          = ADLİYE MERDİVENLERİ · ÖĞLE @adliye
          - Sevim Hanım iddianameyi dörde katlayıp çöpe attı. Sonra bana baktı; teşekkür etmek için ağzını açtı, kapattı.
          sevim: Kızımı kurtardınız. Kendinizi kurtaramadınız galiba.
        `),
        W(
          flag('illegal_used'),
          S`- Burak merdivenin dibindeydi. "Benim yüzümden mi?" dedi. "Hayır" dedim. "Benim elimden." O şifreyi o verdi; ama ekranın fotoğrafını ben istedim.`,
        ),
        W(
          flag('arda_etkileme'),
          S`- Arda koridorda baronun avukatıyla konuşuyordu. Beni görünce başını çevirdi. Ona bir cümle vermiştim; o cümle şimdi bir tutanakta, benim adımla duruyordu.`,
        ),
        W(
          not(breachVisible),
          S`
            - Leyla merdivenlerde konuştu, yüzüme bakmadan. "Mahkeme bilmiyor. Baro bilmiyor. Ben biliyorum, sen biliyorsun." Durdu. "Yarın sabah kendini bildireceksin. Dilekçeyi sen yazacaksın; ben okumayacağım."
          `,
        ),
        O(S`
          = BURSA BAROSU · ÜÇ HAFTA SONRA @adliye
          - Disiplin kurulunun koridoru adliyeninkinden daha sessizdi. Bir sandalye, bir dosya, bir numara. Dosyanın üstünde benim adım yazıyordu; bu sefer sanık sandalyesi benimdi.
          - Leyla yanımda oturuyordu. Avukatım olmayı kabul etmişti. "Seni savunurum" dedi. "Ama seni aklamam. Bunu sen yapacaksın; yıllarca."
          ~ Ece yüz kırk dördüncü başvurusunu yaptı. Kutucuğa "hayır" yazdı. Benim önümde de bir kutucuk var artık; ne yazacağımı kurul söyleyecek. !fade
        `),
      ],
    }),
    outcome('ETIK', {
      class: 'CONVICTION',
      priority: 2,
      when: ethicsBreach,
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 4 ay hapis · 125.000 TL adli para cezası',
      verdictText:
        'Sanık Ece Yalın’ın TCK 158/1-f ve 37/1 uyarınca 4 yıl hapis ve menfaatin iki katından az olmamak üzere 1.500 gün adli para cezası ile cezalandırılmasına; TCK 62/1 uyarınca 3 yıl 4 ay hapis ve 1.250 gün adli para cezasına; günlüğü 100 TL’den 125.000 TL adli para cezasına; TCK 53’teki hak yoksunluklarına; hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Savunmanın sunduğu kayıt yetkisiz erişimle elde edildiğinden hükme esas alınmamıştır (Anayasa 38/6; CMK 206/2-a, 217/2).',
          flag('illegal_used'),
        ),
        because(
          'Tanık Arda Kılıç’ın beyanının müdafi tarafından yönlendirildiği anlaşıldığından beyana ve ona dayanan çıkarımlara itibar edilmemiştir (CMK 217/1).',
          ardaVisible,
        ),
        because(
          'Hukuka uygun delillerle hattın ve cihazın sanığın elinde olmadığı ispatlanamamış; hesap ve işlemler sanığa aittir.',
          not(all(ref('sim_kismen'), ref('cihaz_kismen'))),
        ),
        because(
          'Hattın başka bir bayide değiştirildiği ve işlemlerin başka bir cihazdan yapıldığı ileri sürülmüşse de, değişikliğin sanığın bilgisi dışında yapıldığı, sanığın aldatıldığı ve 4.500 TL’nin kira bedeli olmadığı her yönüyle gösterilememiş; sanığın hesabını ve doğrulama kodunu bilerek sağladığı kabul edilmiştir (TCK 37/1).',
          all(ref('sim_kismen'), ref('cihaz_kismen'), not(flag('cokus'))),
        ),
        because('Savunmanın inandırıcılığı duruşmada çökmüştür.', flag('cokus')),
        because('Sanığın sabıkasız oluşu ve duruşmadaki tutumu takdiri indirim nedeni sayılmıştır (TCK 62/1).'),
        baroLine,
      ],
      legalBasis: 'TCK 158/1-f, 37/1, 52, 53, 62/1; Anayasa 38/6; CMK 206/2-a, 217/2, 273/1; Av.K. 34',
      xp: 0,
      howToReach:
        'Bir meslek ihlali yapmak (hukuka aykırı kayıt almak ya da sunmak, tanığı yönlendirmek) ve hattın ve cihazın sanığın elinde olmadığını hukuka uygun delillerle de gösterememek. Bu sona ulaşmamak gerekir.',
      ethicsCard:
        'Avukat delili yasal yoldan ister; operatör sistemine yetkisiz girişle alınan kayıt suçtur (TCK 243, 136) ve hükme esas alınamaz (CMK 206/2-a, 217/2). Tanığa ne söyleyeceğini dikte etmek tanığı etkilemedir (TCK 277) ve meslekten çıkarmaya kadar giden disiplin yaptırımı doğurabilir (Av.K. 34, 135 vd.). Bu davada doğru yol, CMK 177 dilekçesi ve CMK 135/6 kararıydı.',
      epilogue: [
        W(
          flag('illegal_used'),
          S`
            - Hâkim hükmü okurken bir an durdu, kâğıdın kenarına bir not düştü. Sonra okumaya devam etti: "…karar örneğinin Bursa Barosuna gönderilmesine."
            - Ece'nin yüzü bembeyazdı. Sevim plastik dosyayı göğsüne bastırdı; sanki içindeki kâğıtları birinin elinden kurtarıyormuş gibi.
          `,
        ),
        W(
          not(flag('illegal_used')),
          S`
          - Hâkim hükmü okurken bir an durdu. Tanık kürsüsünün önündeki boşluğa baktı; sonra bana.
          - Ece'nin yüzü bembeyazdı. Sevim plastik dosyayı göğsüne bastırdı.
        `,
        ),
        O(S`
          = ARSLAN HUKUK · O GECE @buro_gece
          - Masamda bir kitap duruyordu. Avukatlık Kanunu. Leyla'nın eski, sayfa kenarları kıvrılmış nüshası. Otuz dördüncü madde, kurşun kalemle çizilmiş.
          - Leyla odasındaydı. Kapısı kapalıydı. Bir kez bile dışarı çıkmadı.
          ~ Bir yıl önce bir kız bir kodu yanlış kişiye okudu ve bedelini ödedi. Ben bir kuralı bilerek çiğnedim. Bedelini o ödeyecek.
          ~ Ece'yi kurtaracak kâğıdı yasal yoldan bulamadım. Benim elimde neyin olduğunu da kaybettim. !fade
        `),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(
        notCollapsed,
        ref('delil_beraat'),
        flag('necdet_ifsa'),
        flag('gercek_fail'),
        ref('sim_proven'),
        ref('cihaz_proven'),
        cmp(v('pers'), '>=', 7),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Adli kontrol kalktı',
      verdictText:
        'Sanık Ece Yalın’ın üzerine atılı nitelikli dolandırıcılık suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; karar ve dosya örneklerinin Necdet Sarı ve diğer şüpheliler hakkında işlem yapılmak üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Banka cihaz kaydı ve iletişim tespiti, 4 Kasım işlemlerinin sanığın telefonundan değil, başka bir cihazdan yapıldığını göstermiştir (CMK 135/6).',
        ),
        because(
          'Sanığın hattı sahte vekâletname ve sanığın iş başvurusu için gönderdiği kimlik fotoğrafından basılmış bir fotokopiyle başka bir bayide kopyalanmıştır.',
        ),
        because(
          'Sanık, bir iş ilanı aracılığıyla aldatılmış; okuduğu kodun bankaya ait olduğunu bilmemiştir. İştirak kastı yoktur (TCK 21/1, 40/1).',
          any(flag('ece_durust'), flag('istirak_cevap')),
        ),
        because(
          'İMEİ sorgusu, sahte işveren hattının, kopya SIM’in ve tanık Necdet Sarı’nın kullandığı hattın aynı cihazda kullanıldığını ortaya koymuştur.',
        ),
        because('Bu deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
        ...adliKontrol,
      ],
      legalBasis: 'CMK 223/2-b; CMK 135/6, 217; TCK 21/1, 37, 39, 40/1; CMK 273/1',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Hattın ve cihazın sanığın elinde olmadığını tartıştır; suç duyurusuyla İMEİ sorgusu iste; raporu iş merkezi müdürünün kartvizitiyle eşleştirip duruşmada sun; esas savunmada gerçek faili göster.',
      epilogue: [
        O(S`
          hakim: Türk Milleti adına…
          - "Beraatine" kelimesi salona düştüğünde Ece hiçbir şey yapmadı. Sonra oturdu. Sonra yeniden kalktı, çünkü hüküm ayakta dinlenir. Gülmeye çalıştı; ağladı.
          = ADLİYE MERDİVENLERİ · ÖĞLE @adliye
          - Yağmur dinmişti. Uludağ'ın üstünde soluk bir güneş vardı. Sevim Hanım plastik dosyayı açtı, en üstteki kâğıdı, iddianameyi çıkardı, dörde katladı ve çöp kutusuna attı.
          sevim: Ben kâğıt atmam. Bunu atarım.
        `),
        W(
          flag('nurettin_saygi'),
          S`
            - Nurettin Aksoy merdivenlerin başında bekliyordu. Ece'ye doğru yürüdü, elini uzattı.
            nurettin: Kusura bakma kızım. Bir yıl adını taşıdım; yanlış adı. İkimizi de aynı ses kandırmış.
            ece: Ben de özür dilerim. Paranız…
            nurettin: Param onda. Senin adın sende. Bugün bu kadar yeter.
          `,
        ),
        W(
          not(flag('nurettin_saygi')),
          S`
          - Nurettin Aksoy merdivenlerin başında bekliyordu. Bir an tereddüt etti, sonra Ece'ye başını eğdi. Bir öğretmenin, yanlış not verdiği bir öğrenciye eğildiği gibi.
          nurettin: İkimizi de aynı ses kandırmış. Kusura bakma.
        `,
        ),
        O(S`
          = ARSLAN HUKUK · O GECE @buro_gece
          - Leyla odamın kapısında durdu. Elinde tuşlu telefonu vardı. Bir mesaj gösterdi: savcılıktan. "Necdet Sarı gözaltına alındı. Kayıp eşya defterinde o telefon yok."
          leyla: Benim telefonum yine tuşlu, Deniz. Kimse benim altı dakikamı bulamaz.
          - Masasındaki ters çerçeveye baktı. Çevirmedi. Ama bir parmağıyla kenarına dokundu, sanki birine "az kaldı" der gibi.
          ~ Bazen bir insanın bütün yalanı altı dakikadır. Bazen bir insanın bütün masumiyeti, bir sarı nota yazılmış dört rakam.
          ~ Ece başvuru tablosuna yüz kırk dördüncü satırı yazacak. Bu sefer kendi adıyla. !fade
          = Necdet Sarı hakkında soruşturma başlatıldı. Arda Kılıç ve Mehmet Demir’in dosyaları birleştirildi.
        `),
        ...ethicsEpilogue,
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 4,
      when: all(notCollapsed, acquitE),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Adli kontrol kalktı',
      verdictText:
        'Sanık Ece Yalın’ın üzerine atılı nitelikli dolandırıcılık suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; dosyanın bir örneğinin kimliği belirlenemeyen failler hakkında soruşturmaya devam edilmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'İşlemlerin sanığın telefonundan değil, başka bir cihazdan yapıldığı banka ve iletişim kayıtlarıyla anlaşılmıştır.',
          ref('cihaz_proven'),
        ),
        because(
          'Sanığın hattı 4 Kasım sabahı başka bir bayide vekil aracılığıyla değiştirilmiş; sanık aynı akşam operatöre itiraz etmiştir.',
          ref('sim_proven'),
        ),
        because(
          'Sanığa gönderilen 4.500 TL’yi gönderen hesap kaporadan pay almıştır; ödemenin kiralama bedeli olduğu ispatlanamamıştır.',
          flag('contra_g2'),
        ),
        because(
          'Sanık kodu “SGK kodu” sanarak okuduğunu açıklamış; bunu doğrulayan not ve yazışma dosyadadır.',
          flag('ece_durust'),
        ),
        because(
          'Bayi çalışanı, SIM değişikliğini belgeleri doğrulamadan ve kendisine bırakılan para karşılığında yaptığını kabul etmiştir.',
          flag('onur_bahsis'),
        ),
        because(
          'Sanal ofis sözleşmesinde kiracı gösterilen kişinin sözleşmeyi imzalamadığı ve kimliğinin başka bir sahte belgede de kullanıldığı anlaşılmıştır.',
          flag('contra_n1'),
        ),
        because(
          'Sahte işverenin görüşmelerinin tanık Necdet Sarı’nın yönettiği binanın dördüncü katından yapıldığı anlaşılmıştır.',
          flag('contra_n2'),
        ),
        because('Para teslimlerinin yönetime ayrılmış park yerinde yapıldığı tespit edilmiştir.', flag('contra_n4')),
        because(
          'SIM değişikliğine gelen kişinin sanık ya da vekil gösterilen kişi olmadığı tanık beyanıyla anlaşılmıştır.',
          flag('contra_o3'),
        ),
        because(
          'Tanıkların kişisel kanaat ve tahminleri hükme esas alınmamıştır (CMK 217).',
          any(flag('obj_g4'), flag('obj_g5'), flag('obj_o3'), flag('obj_n2'), flag('press_g4')),
        ),
        because(
          'İMEİ raporundaki kurumsal hattın kime ait olduğu ve kim tarafından kullanıldığı dosyada belirlenemediğinden bu hat bir kişiye bağlanamamış; araştırma savcılığa bırakılmıştır.',
          all(has('ev_imei_rapor'), not(flag('necdet_ifsa'))),
        ),
        ...adliKontrol,
        because(
          'Sanığın suçu işlediğine dair her türlü şüpheden uzak, kesin ve inandırıcı delil elde edilememiştir; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; AİHS 6/2; CMK 135/6, 217, 273/1',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Hattın kopyalandığını ve işlemlerin başka bir cihazdan yapıldığını duruşmada tartıştır; esas savunmada şüphenin sanık lehine olduğunu savun.',
      epilogue: [
        O(S`
          hakim: Türk Milleti adına…
          - "Beraatine." Ece ayakta duruyordu; dizleri titredi ama oturmadı. Hüküm ayakta dinlenir. Bir yıldır her şeyi ayakta dinlemişti.
          = ADLİYE KORİDORU · ÖĞLE @adliye
          - Koridorda biri, bir başkasına fısıldadı; duyulmasın diye değil, duyulsun diye: "Şüpheden yararlandı."
          - Ece duydu. Durmadı. Sevim durdu; dönüp fısıldayana baktı. Dikişçi bakışı: bir sökük gördüğünde iğneye uzanan el.
          - Leyla merdivenin başında bekliyordu. Bana bir şey söylemedi; Ece'nin omzuna bir kez dokundu, o kadar. Leyla'nın dokunuşu, başkalarının nutku kadar sürer.
          leyla: Beraat beraattir, kızım. Gerekçesini kimse okumaz. Sen de okuma; çerçevele.
        `),
        W(
          any(flag('tarif_yuzuk'), flag('arda_yuzuk')),
          S`
            - Merdivenlerde, aşağıda, ütülü bir takım elbise yağmurluğunu giyiyordu. Bir limon kolonyası kokusu. Bana dönüp başıyla selam verdi; kibar, acelesiz.
            ~ Bir tarif. Bir yüzük. Bir koku. Hiçbiri bir kâğıt değil. Savcılık "failleri belirsiz" diye yazdı. Belirsiz değil. Kanıtsız.
          `,
        ),
        O(S`
          - Gökhan Ateş adliyenin önünde beni bekliyordu. "Dosyayı yeniden açtılar" dedi. "Bu sefer cihazdan başlayacağım. Dört yüz dosyanın hepsine bir daha bakacağım. Belki."
          - Resmî olarak Kaan'ın kim olduğunu kimse bilmiyordu. Bir ses, bir numara, bir asansör. Savcılık dosyayı "failleri belirsiz" diye yeniden açtı.
          ~ Bazı kapılar açılır, ama ışığı kimse yakmaz.
        `),
        O(S`
          = YILDIRIM · O AKŞAM @ev
          - Sevim Hanım mutfakta dikiş makinesinin başındaydı; ama makine çalışmıyordu. Elinde bir kumaş, bir iğne. Dikmiyor, sadece tutuyordu.
          sevim: Kızım. Bir yıl. Bir yıl sonra ilk kez evde sessizlik kötü değil.
          - Ece laptopunu açtı. Tabloya yüz kırk dördüncü satırı ekledi. Şirket sütununa bir şey yazmadı; durum sütununa yazdı: "BERAAT."
          ece: Bir de şey… sizin büroda stajyer alıyor musunuz? Ekran görüntüsü almakta çok iyiyim.
          ~ Leyla'ya soracağım. Muhtemelen tuşlu telefonuyla güler. !fade
        `),
        ...ethicsEpilogue,
      ],
    }),
    outcome('INDIRIM', {
      class: 'RECHARACTERIZED',
      priority: 5,
      when: all(notCollapsed, any(flag('terditli'), flag('terditli_erken')), finalAtLeast(T_INDIRIM)),
      stamp: '158/4 · HAGB',
      stampTone: 'amber',
      sentence: '1 yıl 8 ay hapis · 62.500 TL adli para · HAGB',
      verdictText:
        'Sanığın katkısının hesabın kullanılmasını sağlayan bilgiyi vermekle sınırlı olduğu kabul edilerek TCK 158/1-f ve 37/1 uyarınca 4 yıl hapis ve 1.500 gün adli para cezası belirlenmesine; 16.7.2026 tarihli 7589 sayılı Kanunla eklenen ve lehe olan TCK 158/4 uyarınca (TCK 7/2) yarı oranında indirilerek 2 yıl hapis ve 750 gün adli para cezasına; TCK 62/1 uyarınca 1 yıl 8 ay hapis ve 625 gün adli para cezasına, günlüğü 100 TL’den 62.500 TL’ye; zararın denetim süresi içinde aylık taksitlerle giderilmesi koşuluyla CMK 231/5, 231/9 uyarınca HÜKMÜN AÇIKLANMASININ GERİ BIRAKILMASINA ve beş yıl denetim süresine; hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 231/12, 273/1).',
      reasoning: [
        because(
          'Sanığın, hesaba erişimi sağlayan kodu 4.500 TL karşılığında verdiği kabul edilmiştir; işlemleri bizzat yaptığına ya da kaporadan pay aldığına dair delil yoktur. Katkı, hesaba erişimi sağlayan bilgiyi vermekle sınırlıdır (TCK 158/4).',
        ),
        because(
          'Avans açıklamasının “eğitim avansı” olduğu ve işverenle satıcının aynı hattı kullandığı dosyaya yansımış; ancak ödemenin bir kiralama bedeli olmadığı tam olarak gösterilememiştir.',
          any(flag('g2_kismi'), flag('g2_kaan')),
        ),
        because(
          'Hattın vekil aracılığıyla değiştirildiği ve kopya SIM’in başka bir cihazda olduğu dosyaya girmiş; ancak sanığın bilgisi dışında olduğu kesin olarak ispatlanamamıştır.',
          any(flag('o1_kismi'), flag('n3_imei'), flag('n3_kismi'), flag('n2_kismi')),
        ),
        because(
          '7589 sayılı Kanunla eklenen TCK 158/4 sanık lehine olduğundan suç tarihinden sonra yürürlüğe girmiş olmasına rağmen uygulanmıştır (TCK 7/2). Aynı katkı için ayrıca TCK 39 indirimi yapılmamıştır.',
        ),
        because('Sanığın sabıkasızlığı ve duruşmadaki tutumu takdiri indirim nedeni sayılmıştır (TCK 62/1).'),
        because(
          'Hükmolunan ceza iki yılı aşmadığından ve zararın taksitle giderilmesi kabul edildiğinden hükmün açıklanması geri bırakılmıştır (CMK 231/5, 231/6, 231/9).',
        ),
      ],
      legalBasis: 'TCK 158/1-f, 158/4, 7/2, 37/1, 52, 62/1; CMK 231/5, 231/6, 231/9',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Beraat için gereken kayıtları tartıştıramadığında, esas savunmada terditli olarak TCK 158/4’ü ve lehe hükümleri iste.',
      epilogue: [
        O(S`
          hakim: …hükmün açıklanmasının geri bırakılmasına.
          - Ece "geri bırakılmasına" kelimesini anlamadı. Anlamadığı için yüzü bir an aydınlandı. Sonra bana baktı; ben yüzümü düz tutmaya çalıştım.
          = ADLİYE KORİDORU · ÖĞLE @adliye
          - Kalemde bir kâğıt imzalattılar: taksit planı. Yetmiş beş bin lira, beş yıl, aylık. Alacaklı: Nurettin Aksoy.
          ece: Yani ben… onun parasını ödeyeceğim. Beni dolandıranın aldığı parayı.
          > Beş yıl içinde başka bir şey olmazsa, bu hüküm hiç kurulmamış sayılacak. Sicilin temiz kalacak.
          ece: Temiz. Peki.
        `),
        W(
          flag('nurettin_saygi'),
          S`
            - Nurettin kâğıdı imzalarken Ece'ye baktı. "Taksitleri aksatma kızım" dedi; sonra bir şey ekledi, sesi alçaldı: "Ben de aksatmam. Ödediğin her ayı sana yazacağım."
          `,
        ),
        O(S`
          ~ Kazandığımızı söylediler. Leyla bile "fena değil" dedi. Ece taksit planını imzalarken eli titremedi. Benimki titredi.
          ~ Kaan'ın kim olduğunu kimse sormadı artık. Dosya kapandı; kapı açık kaldı. Leyla en sona sakla demişti. Ben sona gelmeden açtım. !fade
        `),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 6,
      when: always,
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 4 ay hapis · 125.000 TL adli para cezası',
      verdictText:
        'Sanık Ece Yalın’ın TCK 158/1-f ve 37/1 uyarınca 4 yıl hapis ve menfaatin iki katından az olmamak üzere 1.500 gün adli para cezası ile cezalandırılmasına; TCK 62/1 uyarınca 3 yıl 4 ay hapis ve 1.250 gün adli para cezasına; günlüğü 100 TL’den 125.000 TL adli para cezasına; TCK 53’teki hak yoksunluklarına; cezanın süresi nedeniyle erteleme ve hükmün açıklanmasının geri bırakılması koşulları bulunmadığına; hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Suçtan elde edilen para sanığın hesabına girmiş ve aynı hesaptan çıkmıştır; hesabın sanığın elinde olmadığı ispatlanamamıştır.',
          not(all(ref('sim_kismen'), ref('cihaz_kismen'))),
        ),
        because(
          'Hattın başka bir bayide değiştirildiği ve işlemlerin başka bir cihazdan yapıldığı ileri sürülmüşse de, değişikliğin sanığın bilgisi dışında yapıldığı, sanığın aldatıldığı ve 4.500 TL’nin kira bedeli olmadığı her yönüyle gösterilememiş; sanığın hesabını ve doğrulama kodunu bilerek sağladığı kabul edilmiştir (TCK 37/1).',
          all(ref('sim_kismen'), ref('cihaz_kismen'), not(flag('cokus'))),
        ),
        because('Sanığın kod paylaşmadığı yönündeki beyanı banka kaydıyla çelişmiştir.', flag('ece_inkar')),
        because(
          'Savunmanın inandırıcılığı duruşmada çökmüş; mahkeme iddianamedeki anlatımı esas almıştır.',
          flag('cokus'),
        ),
        because(
          'Temel ceza alt sınırdan belirlenmiş; sanığın sabıkasızlığı takdiri indirim nedeni sayılmıştır (TCK 62/1). Ceza iki yılı aştığından erteleme ve HAGB uygulanamamıştır (TCK 51/1; CMK 231/5).',
        ),
      ],
      legalBasis: 'TCK 158/1-f, 37/1, 52, 53, 62/1; TCK 51/1; CMK 231/5, 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach: 'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir.',
      epilogue: [
        W(
          flag('cokus'),
          S`
            - Salon boşalırken savcı dosyasını topladı. Yanımdan geçerken durdu.
            savci: İyi bir avukat olacaksınız. Bugün değil.
          `,
        ),
        O(S`
          hakim: …üç yıl dört ay hapis cezası ile cezalandırılmasına.
          - Ece ayakta kaldı. Hüküm ayakta dinlenir. Bir yıl önce bir ifade odasında oturarak söylediği cümle, bugün ayakta onu bulmuştu.
          = ADLİYE MERDİVENLERİ · ÖĞLE @adliye
          - Ece kelepçesiz, tutuksuz, ama bir hükümle merdivenleri indi. Cezası kesinleşmeden infaz yoktu; ama kesinleşme bir takvim meselesiydi, bir umut değil.
          - Yağmur yeniden başlamıştı. Sevim Hanım plastik dosyayı açtı, kâğıtları parmağıyla saydı, kapattı.
          sevim: İstinaf, değil mi? İki hafta. Ben dikişçiyim; bir dikiş sökülürse yeniden dikilir.
        `),
        W(
          has('ev_not'),
          S`
          - Dosyanın en üstünde hâlâ duruyordu: sarı bir not. "4471 — SGK." Altında küçük bir gülen yüz.
          ~ Dört rakam. Bir gülen yüz. Bir kızı kurtarmaya yetmedi. Ben yetmedim.
        `,
        ),
        O(S`
          ~ Bir yıl önce kimse "telefon kimin elindeydi" diye sormamıştı. Ben sordum; cevabı salona getiremedim.
          ~ Ve bir yerde, bir binanın dördüncü katında, bir asansör hâlâ "Dördüncü kat" diyor. Kimse kimin indiğine bakmıyor. !fade
        `),
      ],
    }),
  ],
};
