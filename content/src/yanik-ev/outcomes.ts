import {
  all,
  always,
  any,
  because,
  chosen,
  flag,
  has,
  not,
  outcome,
  ref,
  xp,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { card, n, s, th } from './shared.js';

// 90-outcomes: yedi sonuç. Hüküm skora değil kayda bağlıdır (CMK 217, 223; Anayasa 38/4): hiçbir sonuç eşik skoru
// istemez. Öncelik: ısmarlama rapor (ETİK: mahkeme mütalaayı dışlar, kalan kayda göre mahkûmiyet / beraat / taksir),
// 223/2-b, 223/2-e, taksire dönüşüm (TCK 171/1-a), mahkûmiyet.
// Kast: hızlandırıcı tespitinin bütün ayakları kayıtla çökmedikçe (`hizlandirici_coktu`) iddia ayakta kalır; çöktüyse hiçbir
// yolda kasten mahkûmiyet yoktur. Taksir: çöküşten sonra taksir mahkûmiyeti ancak taksire kayıtla bir karşılık yoksa kurulur
// (`taksir_red`: notun yazarıyla doğrulanan yenileme takvimi ya da dosyadaki nötr kopması kaydı); karşılık varsa beraat.
// Beraatin dayanağını mahkeme seçer: elektrik kaynağı duruşmada sabitse 2-b, değilse 2-e; savunmanın istediği dayanak ya da
// esas savunmanın biçimi (terditli, duygusal) yalnızca skoru ve gerekçedeki bir cümleyi değiştirir.

/** Kalan delillerin beraati taşıdığı kayıt (mütalaa ve skor hariç): kasıt çöktü ve taksir kayıtla karşılandı. */
const kayitBeraat = all(ref('hizlandirici_coktu'), ref('taksir_red'));

/** Dış etken kayıtta: dağıtım kaydı dosyada ya da nötr kopması duruşmada kuruldu. */
const disEtken = any(has('ev_ariza'), flag('taksir_dis'), flag('contra_u6_notr'));
/** Takvim savunması notun yazarıyla kuruldu ve dış etken kayıtta değil. */
const takvim = all(flag('taksir_cevap'), not(disEtken));

const ETIK_KART =
  'Gerçeğe aykırı içerikte bir uzman raporunu para karşılığı ısmarlayıp mahkemeye sunmak yalan tanıklığa azmettirme ve delil uydurmadır (TCK 272, 38) ve avukat için meslekten çıkarmaya varan bir disiplin ihlalidir (Av.K. 34; TBB Meslek Kuralları). Mahkeme ısmarlama mütalaayı hükme esas almaz ve kararını kalan delillere göre verir: sahte bir rapor müvekkili kurtarmaz, yalnızca savunmanın sesini kısar.';

const ETIK_BURO = [
  card('ARSLAN HUKUK — O GECE', 'buro_gece'),
  n(
    'Masamda bir kitapçık vardı: Türkiye Barolar Birliği Meslek Kuralları. Leyla bırakmıştı. Bir not yoktu. Sigara paketi yerinde, açılmamış.',
  ),
  n(
    'Kapıdaki yeni pirinç levhada iki isim yazıyordu. Birinin yanında bir boşluk vardı; sanki yazılmayı bekleyen değil, silinmeyi bekleyen bir boşluk.',
  ),
];

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK', {
      class: 'CONVICTION',
      priority: 1,
      when: all(flag('sahte_rapor'), not(ref('hizlandirici_coktu'))),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 6 ay hapis · 50.000 TL adli para cezası',
      verdictText:
        'Sanık Halil Bozkurt’un TCK 170/1-a uyarınca takdiren 1 yıl 6 ay hapis cezası ile; TCK 158/1-k uyarınca 4 yıl hapis ve 1.000 gün adli para cezası üzerinden, suçun teşebbüs aşamasında kalması nedeniyle TCK 35/2 uyarınca yarı oranında indirilerek 2 yıl hapis ve 500 gün adli para cezası ile CEZALANDIRILMASINA; bir gün karşılığı 100 TL’den 50.000 TL adli para cezasına (TCK 52/2); TCK 53 uyarınca hak yoksunluklarına; tutuklulukta geçen sürenin TCK 63 uyarınca mahsubuna; savunmanın sunduğu uzman mütalaasını düzenleyen kişi ve mütalaayı ısmarlayanlar hakkında suç duyurusunda bulunulmasına; müdafi hakkında baroya bildirimde bulunulmasına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Savunmanın sunduğu uzman mütalaasının para karşılığı ve önceden belirlenmiş bir sonuca göre yazıldığı, düzenleyenin yazılı beyanıyla anlaşılmıştır; bu mütalaa hükme esas alınmamıştır.',
        ),
        because(
          'Mütalaa dışlandıktan sonra dosyadaki diğer deliller değerlendirilmiştir. Bilirkişi raporundaki hızlandırıcı tespiti ve laboratuvar bulgusu, duruşmada çürütülememiştir (CMK 217).',
        ),
        because(
          'Numune zincirine ilişkin itirazlar kayda geçmiş, ancak hızlandırıcı tespitini ortadan kaldıracak ölçüde ispatlanamamıştır.',
          any(flag('contra_b1'), flag('contra_b2'), flag('contra_b4')),
        ),
        because(
          'Bilirkişi raporu, poliçenin zamanlaması, teminat artışı, eşyaların taşınması ve benzin alımı birlikte değerlendirildiğinde sanığın evini sigorta bedelini almak amacıyla yaktığı kanaatine varılmıştır.',
        ),
        because(
          'Hasar bedeli şirketin şüphesi üzerine ödenmediğinden dolandırıcılık teşebbüs aşamasında kalmıştır (TCK 35).',
        ),
      ],
      legalBasis: 'TCK 170/1-a, 158/1-k, 35/2, 52, 53, 63; CMK 217, 273/1; TCK 272, 38; Av.K. 34',
      xp: xp(0),
      howToReach:
        'Para karşılığı, sonucu önceden belirlenmiş bir karşı rapor ısmarlamak (etik ihlali), numune zinciri de birinci celsede kurulamamışsa. Bu sona ulaşmamak gerekir.',
      ethicsCard: ETIK_KART,
      epilogue: [
        {
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n(
              '“Üç yıl altı ay.” Halil rakamı duydu; anlamını duymadı. Jandarma koluna dokundu. Halil kızına bakmadı. Bakamadı.',
            ),
            card('ADLİYE KORİDORU — AKŞAMÜSTÜ', 'adliye'),
            n(
              'Onur’un tanıdığı eksper koridorda iki polisin yanında bir ifade tutanağı imzalıyordu. Zehra bir bankta oturuyordu; elleri dizlerinin üstünde, avuçları yukarı, babası gibi.',
            ),
            s('zehra', 'Ben istemedim. Ama sustum. Siz de “yazsın” dediniz. Hepimiz onu kurtarmak istedik.', 'uzgun'),
            th(
              'Kurtarmak istedik. Bir yalanla. Gerçeğin kanıtını bulamadığım yerde bir yalan satın aldım; yalan da kendi faturasını kesti.',
            ),
            ...ETIK_BURO,
          ],
        },
      ],
    }),
    outcome('ETIK_E', {
      // Müvekkil beraat eder; ama bu bir etik sonudur (XP 0, baroya bildirim): oyuncu istatistiğinde beraat sayılmaz.
      class: 'OTHER',
      priority: 2,
      when: all(flag('sahte_rapor'), kayitBeraat),
      stamp: 'BERAAT',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Beraat · müdafi baroya bildirildi',
      verdictText:
        'Sanık Halil Bozkurt’un üzerine atılı genel güvenliği kasten tehlikeye sokma ve nitelikli dolandırıcılığa teşebbüs suçlarını işlediği sabit olmadığından, ayrı ayrı CMK 223/2-e uyarınca BERAATİNE; tutuklu ise derhal tahliyesine; CMK 141/1 uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 uyarınca yapılabileceğinin bildirilmesine (CMK 231/3); savunmanın sunduğu uzman mütalaasını düzenleyen kişi ve mütalaayı ısmarlayanlar hakkında suç duyurusunda bulunulmasına; müdafi hakkında baroya bildirimde bulunulmasına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Savunmanın sunduğu uzman mütalaasının para karşılığı ve önceden belirlenmiş bir sonuca göre yazıldığı, düzenleyenin yazılı beyanıyla anlaşılmıştır; bu mütalaa hükme esas alınmamıştır.',
        ),
        because(
          'Mütalaa dışlandıktan sonra dosyadaki diğer deliller değerlendirilmiştir. Müdafiin usulsüz davranışı sanığın aleyhine delil oluşturmaz; hüküm yalnızca hukuka uygun delillere dayanır (CMK 217).',
        ),
        because(
          'Hızlandırıcı tespitinin dayanağı olan numuneler olay yerine refakatsiz giren katılan eksperi tarafından teslim edilmiş; elde ediliş zinciri güvenilir değildir.',
        ),
        because(
          'Mahkemenin elektrik bilirkişisinin koridor hattında tespit ettiği birincil ark, yangının elektrik kaynaklı olduğunu göstermektedir.',
          has('ev_ark'),
        ),
        because(
          'Elektrikçi tanığın yeminli beyanı ve yazılı notuna göre sanık uyarı üzerine yenilemeyi takvime koymuş ve yükü azaltmıştır; taksirli sorumluluğu da ispatlanamamıştır.',
          takvim,
        ),
        because(
          'Dağıtım şirketinin kaydına göre yangından dakikalar önce sokak hattında nötr iletken kopmuş ve aşırı gerilim oluşmuştur; neticenin sanığın bir özen eksikliğine bağlandığı şüpheden uzak biçimde ispatlanamamıştır.',
          disEtken,
        ),
        because(
          'Dolaylı delillerin (poliçe, teminat artışı, eşyaların taşınması, benzin alımı) belgeli açıklamaları karşısında sanığın atılı suçları işlediği konusunda şüpheden uzak bir kanaat oluşmamıştır (Anayasa 38/4).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; CMK 141, 142, 217, 231/3, 273/1; TCK 272, 38; Av.K. 34',
      xp: xp(0),
      howToReach:
        'Bilirkişi raporunun bütün ayaklarını kayıtla çürütüp taksire de kayıtla cevap verdikten sonra para karşılığı bir karşı rapor ısmarlamak (etik ihlali). Halil kalan delillerle beraat eder; sen baroya bildirilirsin. Bu sona ulaşmamak gerekir.',
      ethicsCard: ETIK_KART,
      epilogue: [
        {
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n(
              '“…sabit olmadığından… beraatine… müdafi hakkında baroya bildirimde bulunulmasına.” Salon ilk kelimede nefes aldı, son cümlede bana döndü. Halil dönmedi.',
            ),
            card('ADLİYE KORİDORU — AKŞAMÜSTÜ', 'adliye'),
            n(
              'Onur’un tanıdığı eksper koridorda iki polisin yanında bir ifade tutanağı imzalıyordu. Zehra bir bankta oturuyordu; elleri dizlerinin üstünde, avuçları yukarı, babası gibi.',
            ),
            s(
              'halil',
              'Beraat etmişim, avukat hanım. Bunu bir bekçinin defteri söyledi, bir ustanın notu söyledi. O satın aldığınız kâğıt değil.',
              'uzgun',
            ),
            s('zehra', 'Ben istemedim. Ama sustum. Hepimiz onu kurtarmak istedik. Kurtulacakmış zaten.', 'uzgun'),
            th(
              'Gerçek yetiyordu. Defter, fotoğraflar, tenekeler, bir ustanın notu. Ben gerçeğin yetmeyeceğinden korktum ve yanına bir yalan koydum. Hâkim ikisini ayırdı; yalanı da sahibini de.',
            ),
            ...ETIK_BURO,
          ],
        },
      ],
    }),
    outcome('ETIK_T', {
      class: 'RECHARACTERIZED',
      priority: 3,
      when: all(flag('sahte_rapor'), ref('hizlandirici_coktu')),
      stamp: 'TAKSİR',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '5 ay hapis · ertelendi · dolandırıcılıktan beraat · müdafi baroya bildirildi',
      verdictText:
        'Sanık Halil Bozkurt’un eylemine uyan TCK 171/1-a uyarınca takdiren 6 ay hapis cezası ile cezalandırılmasına, TCK 62/1 uyarınca 1/6 oranında indirilerek 5 ay hapis cezası ile CEZALANDIRILMASINA; cezanın TCK 51/1 uyarınca ERTELENMESİNE, denetim süresinin 1 yıl olarak belirlenmesine; nitelikli dolandırıcılığa teşebbüs suçundan atılı suçu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; tutuklu ise tahliyesine; savunmanın sunduğu uzman mütalaasını düzenleyen kişi ve mütalaayı ısmarlayanlar hakkında suç duyurusunda bulunulmasına; müdafi hakkında baroya bildirimde bulunulmasına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Savunmanın sunduğu uzman mütalaasının para karşılığı ve önceden belirlenmiş bir sonuca göre yazıldığı, düzenleyenin yazılı beyanıyla anlaşılmıştır; bu mütalaa hükme esas alınmamıştır.',
        ),
        because(
          'Mütalaanın dışlanması iddianın ispat yükünü ortadan kaldırmaz: hızlandırıcı tespitinin dayanağı olan numunelerin elde ediliş zinciri güvenilir olmadığından yangının kasten çıkarıldığı ispatlanamamıştır (Anayasa 38/4; CMK 217).',
        ),
        because(
          'Mahkemenin elektrik bilirkişisinin koridor hattında tespit ettiği birincil ark, yangının elektrik kaynaklı olduğunu göstermektedir.',
          has('ev_ark'),
        ),
        because(
          'Sanık, tesisatın eski olduğu ve koridor buatının ısındığı konusunda elektrikçi tarafından uyarılmış, tesisatı kullanmaya devam etmiştir.',
        ),
        because(
          'Yangının dış bir etkenden kaynaklandığı ya da sanığın özen yükümlülüğünü yerine getirdiği, hükme esas alınabilecek delillerle duruşmada ortaya konamamıştır: dosyada dağıtım hattına ilişkin bir kayıt yoktur, uyarıyı yapan elektrikçi de dinlenmemiştir. Dışlanan mütalaa bu boşluğu doldurmaz.',
        ),
        because('Sanığa nitelik değişikliği hatırlatılmış ve ek savunması alınmıştır (CMK 226).'),
        because('Hasar ihbarı gerçek bir hasara dayandığından dolandırıcılık kastı ispatlanamamıştır.'),
      ],
      legalBasis: 'TCK 171/1-a, 22/2, 62/1, 51/1; CMK 217, 223/2-e, 226, 273/1; Anayasa 38/4; TCK 272, 38; Av.K. 34',
      xp: xp(0),
      howToReach:
        'Hızlandırıcı tespitini çürüttükten sonra para karşılığı bir karşı rapor ısmarlamak (etik ihlali), taksire kayıtla bir karşılık bulmadan (ne notun yazarı dinlendi ne de dağıtım kaydı getirtildi). Halil kasıttan kurtulur, taksirden kurtulamaz. Bu sona ulaşmamak gerekir.',
      ethicsCard: ETIK_KART,
      epilogue: [
        {
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n(
              '“Taksirle… beş ay… ertelenmesine… müdafi hakkında baroya bildirimde bulunulmasına.” Son cümlede salon döndü ve bana baktı. Halil bakmadı.',
            ),
            card('ADLİYE KORİDORU — AKŞAMÜSTÜ', 'adliye'),
            n(
              'Onur’un tanıdığı eksper koridorda iki polisin yanında bir ifade tutanağı imzalıyordu. Zehra bir bankta oturuyordu; elleri dizlerinin üstünde, avuçları yukarı, babası gibi.',
            ),
            s(
              'halil',
              'Kundakçı değilmişim, avukat hanım. Bunu bir bekçinin defteri söyledi, iki fotoğraf söyledi. O satın aldığınız kâğıt değil.',
              'uzgun',
            ),
            s('zehra', 'Ben istemedim. Ama sustum. Hepimiz onu kurtarmak istedik.', 'uzgun'),
            th(
              'Gerçeği bulmuştum. Defteri, fotoğrafları, tenekeleri. Sonra korktum ve gerçeğin yanına bir yalan koydum. Hâkim ikisini ayırdı; yalanı da sahibini de.',
            ),
            ...ETIK_BURO,
          ],
        },
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 4,
      // Kayıt suçun işlenmediğini gösteriyor: kasıt çöktü, eksper kırıldı, elektrik kaynağı (ark + nötr) duruşmada sabit.
      // Elektrik kaynağı sabitse dağıtım kaydı dosyadadır; taksir de bu kayıtla karşılanmış olur.
      when: all(ref('hizlandirici_coktu'), flag('eksper_kirildi'), ref('elektrik_ispat'), ref('taksir_red')),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Beraat',
      verdictText:
        'Sanık Halil Bozkurt’un üzerine atılı genel güvenliği kasten tehlikeye sokma ve nitelikli dolandırıcılığa teşebbüs suçlarını işlemediği sabit olduğundan, ayrı ayrı CMK 223/2-b uyarınca BERAATİNE; tutuklu ise derhal tahliyesine, adli kontrol altında ise adli kontrolün kaldırılmasına; CMK 141/1 uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 uyarınca yapılabileceğinin bildirilmesine (CMK 231/3); duruşma tutanağı ve dosya örneğinin, tanık Tarık Sönmez hakkındaki soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Mahkemenin elektrik bilirkişisinin raporuna göre koridor hattında yangından önce oluşmuş birincil ark boncuğu bulunmuştur.',
          has('ev_ark'),
        ),
        because(
          'Dağıtım şirketinin kaydına göre yangından dakikalar önce sokak hattında nötr iletken kopmuş, komşu abonelerde aşırı gerilim meydana gelmiştir.',
          any(has('ded_notr'), has('ev_ariza')),
        ),
        because(
          'Hızlandırıcı tespitinin dayanağı olan numuneler kolluk tarafından değil, olay yerine muhafaza altındayken refakatsiz giren katılan eksperi tarafından teslim edilmiş; elde edilişine ilişkin tutanak bulunmamaktadır.',
        ),
        because(
          'Kolluğun ilk fotoğraflarında örtülü olan zeminin sonradan, eksper tarafından açıldığı anlaşılmıştır.',
          any(flag('contra_b1'), flag('contra_u2')),
        ),
        because(
          'Numunelerde yanmış ahşabın piroliz ürünleri bulunmadığı ve benzinin buharlaşmamış olduğu anlaşılmıştır.',
          any(flag('contra_b4'), flag('contra_u3')),
        ),
        because(
          'Eksper, sigorta panosunun o sabah emanette olduğunu ve elektrik incelemesi yapmadığını çapraz sorguda açıklayamamıştır.',
          flag('contra_u6_ark'),
        ),
        because(
          'Eksperin raporunda yangın gecesine ait dağıtım hattı kaydı incelenmemiş; eksper bu konudaki soruya cevap verememiştir.',
          flag('contra_u6_notr'),
        ),
        because(
          'Tanık Tarık Sönmez, numunelerin içeriğine ilişkin soruya kendini suçlandırmama hakkını kullanarak cevap vermemiştir.',
        ),
        because(
          'Eksperin aracında yarım bidon benzin ve numune tenekeleriyle aynı tip boş tenekeler ele geçirilmiştir.',
          has('ev_elkoyma'),
        ),
        because(
          'Sanık elektrikçinin uyarısı üzerine yenilemeyi takvime koymuş ve yükü azaltmıştır; bu da elektrikçinin yeminli beyanıyla doğrulanmıştır.',
          flag('taksir_cevap'),
        ),
        because(
          'Yangın, üçüncü kişinin alanındaki bir arızadan (dağıtım hattındaki nötr kopması) kaynaklandığından netice sanığın bir özen eksikliğine bağlanamaz; taksirli sorumluluğu da bulunmamaktadır.',
        ),
        because(
          'Savunma beraatin dayanağını 223/2-e olarak göstermiş ya da esas hakkında beraat istememişse de, mahkeme beraatin dayanağını kayda göre kendisi belirler (CMK 223/2).',
          not(flag('savunma_b')),
        ),
        because(
          'Yangın sanığın bir eylemiyle çıkmamış, hasar ihbarı gerçek bir hasara dayanmıştır; atılı suçların sanık tarafından işlenmediği sabittir.',
        ),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141, 142, 231/3; CMK 48, 217, 273/1; TCK 22/2, 170/1-a, 171/1-a, 158/1-k',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Bilirkişi raporunun her ayağını kayıtla çürüt (zincir, zemin, koku, başlangıç, elektrik dışlaması, laboratuvar); panonun incelenmesini ve arıza kayıtlarını iste; arada ark raporu ile nötr kopmasını birleştir; eksperi çapraz sorguda çöz ve nötr kopmasının bu yangınla bağını duruşmada kur. Dayanağı mahkeme seçer.',
      epilogue: [
        {
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n(
              '“…beraatine.” Halil kelimeyi duyduğunda ellerine baktı. Sonra kızına. Sonra yeniden ellerine. Ve ağladı; iki aydır, iki yıldır, belki otuz yıldır ilk kez.',
            ),
            n(
              'Zehra kalkmadı. Oturduğu yerde babasının sırtına elini koydu; bir hastaya “buradayım” der gibi, sessiz ve sıcak.',
            ),
            card('ADLİYE MERDİVENLERİ — ÖĞLEDEN SONRA', 'sokak_sabah'),
            n('Yağmur dinmişti. Uludağ’ın üstünde, mayısın ilk gerçek güneşi. Merdivenler kuru ve aydınlıktı.'),
            n(
              'Zehra babasının ellerini tuttu ve çevirdi. Nasırlı, çatlak, cilalı, temiz. Bir şey söylemedi. Söylemesine gerek yoktu.',
            ),
            s(
              'halil',
              'Ev için kredi yine duruyor, kızım. Usta da duruyor. Nermin’in evini yeniden yaparız. Bu sefer önce elektrik.',
              'mutlu',
            ),
            s('zehra', 'Önce elektrik, baba. Sonra her şey.', 'mutlu'),
            n(
              'Merdivenin dibinde Gülsüm Hanım bekliyordu. Başını salladı; bir kez, yavaşça. Sonra kalabalığa karıştı.',
            ),
            n(
              'Bekçi Cevdet şapkasını takıp nöbetine yürüdü. Arkasından baktım. Bir defter bir evi kurtarmıştı; bir bekçinin el yazısıyla.',
            ),
          ],
        },
        {
          when: flag('mektup'),
          lines: [
            n(
              'Zehra’nın çantasında kurdeleli mektuplar. Akşam babasıyla birlikte okuyacaklarmış. “Annem bu günü görse ne derdi” dedi. Halil güldü: “Kendini germe derdi.”',
            ),
          ],
        },
        {
          lines: [
            card('ARSLAN HUKUK — O GECE', 'buro_gece'),
            n(
              'Leyla kapımı çaldı. Elinde iki bardak çay. Masanın köşesindeki ters çerçeveye baktım; düz duruyordu. İlk kez.',
            ),
            s('leyla', 'İyi iş çıkardın, ortak. Bir gün bunu konuşacağız.', 'mutlu'),
            th('Çerçevedeki yüzü göremedim. Leyla çayını bitirdi, çerçeveyi yeniden çevirdi ve çıktı. Bir gün.'),
            card(
              'TARIK SÖNMEZ HAKKINDA İFTİRA VE DELİL UYDURMA SORUŞTURMASI BAŞLATILDI. KALKAN SİGORTA HASAR DOSYASINI YENİDEN AÇTI.',
              'siyah',
            ),
          ],
        },
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 5,
      when: kayitBeraat,
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Beraat',
      verdictText:
        'Sanık Halil Bozkurt’un üzerine atılı genel güvenliği kasten tehlikeye sokma ve nitelikli dolandırıcılığa teşebbüs suçlarını işlediği sabit olmadığından, ayrı ayrı CMK 223/2-e uyarınca BERAATİNE; tutuklu ise derhal tahliyesine, adli kontrol altında ise adli kontrolün kaldırılmasına; CMK 141/1 uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 uyarınca yapılabileceğinin bildirilmesine (CMK 231/3); gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Hızlandırıcı tespitinin dayanağı olan numuneler olay yerine refakatsiz giren katılan eksperi tarafından teslim edilmiş; elde ediliş zinciri güvenilir değildir.',
        ),
        because(
          'Kolluğun ilk fotoğraflarında zeminin örtülü olduğu, “döküntü izi”nin moloz kaldırıldıktan sonra fotoğraflandığı anlaşılmıştır.',
          any(flag('contra_b1'), flag('contra_u2')),
        ),
        because('Bilirkişi, elektrik tesisatını ve sigorta panosunu incelemediğini kabul etmiştir.', flag('contra_b3')),
        because('Poliçe, banka kredisinin kullandırım şartı olarak yapılmıştır.', flag('motif_banka')),
        because('Teminat artışı acentenin kampanya teklifiyle gerçekleşmiştir.', flag('motif_artis')),
        because('Eşyalar restorasyon sözleşmesi gereği, etiketlenerek taşınmıştır.', flag('contra_s3')),
        because('Satın alınan benzinin büyük kısmı atölyede, jeneratörün yanında bulunmuştur.', flag('contra_s6')),
        because(
          'Sanığın yangın gecesi kilitli sanayi sitesindeki atölyesinde bulunduğu, sitenin kapı kaydı ve bekçisinin beyanıyla desteklenmektedir.',
          flag('alibi_kayit'),
        ),
        because(
          'Sanığın elektrikçinin uyarısı üzerine yenilemeyi takvime koyduğu, notu yazan elektrikçinin yeminli beyanıyla anlaşıldığından taksirli sorumluluğu da ispatlanamamıştır.',
          takvim,
        ),
        because(
          'Dağıtım şirketinin kaydına göre yangından dakikalar önce sokak hattında nötr iletken kopmuş ve aşırı gerilim oluşmuştur; neticenin sanığın bir özen eksikliğine bağlandığı şüpheden uzak biçimde ispatlanamadığından taksirli sorumluluğu da ispatlanamamıştır.',
          disEtken,
        ),
        because(
          'Müdafi esas hakkında beraat istememişse de mahkeme delilleri kendiliğinden değerlendirir; kayıt beraati gerektirmektedir (CMK 217, 223).',
          chosen('T06_D'),
        ),
        because(
          'Savunmanın suçun işlenmediğinin sabit olduğu yönündeki talebi kabul görmemiştir; ancak mahkeme beraatin dayanağını kendisi belirler ve atılı suçların işlendiği de sabit değildir (CMK 223/2-e).',
          all(flag('savunma_b'), not(flag('gercek'))),
        ),
        because(
          'Savunmanın öncelikli talebi beraat olduğundan ve bu talep kabul edildiğinden, terditli olarak ileri sürülen taksir nitelendirmesinin incelenmesine yer olmamıştır.',
          flag('terditli'),
        ),
        because(
          'Yangının elektrik kaynaklı olması kuvvetle muhtemel olmakla birlikte kesin olarak tespit edilememiş; dolaylı delillerin birlikte değerlendirilmesi sanığın atılı suçları işlediği konusunda şüpheden uzak bir kanaat oluşturmamıştır (Anayasa 38/4).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; CMK 141, 142, 217, 231/3, 273/1',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Bilirkişi raporunun her ayağını kayıtla çürüt: numune zinciri (bilirkişi, yeminli bekçi, eksperin girişi), zemin izi, koku tanığı, başlangıç noktası, elektrik dışlaması (pano incelemesi) ve laboratuvar bulgusu (ham veri, mühür). Taksire kayıtla karşılık bul: notu yazan elektrikçiyi hazır et ya da dağıtım kaydını getirt.',
      epilogue: [
        {
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n('“…sabit olmadığından… beraatine.” Halil bir an anlamadı. Zehra anladı; yüzünü ellerinin arasına aldı.'),
            card('ADLİYE KORİDORU — ÖĞLEDEN SONRA', 'adliye'),
            n('Koridorda biri, bir başkasına, alçak sesle: “Şüpheden yararlandı.” Halil duydu. Durdu. Yürüdü.'),
            s(
              'halil',
              '“Yararlandı.” Bir şeyden yararlanmak… hayatımda ilk defa bir şeyden yararlandım, avukat hanım. Bir şüpheden.',
              'uzgun',
            ),
            card('KALEM SOKAK 9 — AKŞAM', 'sokak_karanlik'),
            n(
              'Halil, Nermin’in çeyiz sandığını yanık evin önüne getirdi. Kapağını açtı. İçinde mektuplar, bir dantel, bir çift eski terlik.',
            ),
            n(
              'Saadet Hanım penceresini açtı. Bir süre baktı. Sonra elinde bir tabak kurabiyeyle aşağı indi; iki yıl sonra ilk kez.',
            ),
            s(
              'saadet',
              'Küslük bitsin artık, Halil. Ben yanlış burunla konuştum. Sen de beni Nermin’e bırakmadın. Ödeştik.',
            ),
            n(
              'Halil kurabiyeyi aldı. Bir süre ikisi de bir şey söylemedi; yanık evin kömür tahtalarına baktılar, kırk yılın bütün akşamlarına.',
            ),
            s(
              'halil',
              'Nermin seni çok severdi, Saadet. Son günlerinde seni sordu. Ben… yorulmasın diye kimseyi almadım. Yanlış yaptım.',
              'uzgun',
            ),
            s('saadet', 'Yanlış yaptın. Ben de yanlış burunla konuştum. Hadi, çay koy. Evin yok ama ocağın var mı?'),
            n(
              'Zehra atölyeden getirdiği tüpü sandığın yanına koydu. Yanık evin önünde, kaldırımda, üç kişi çay içti. Muradiye’de bir yas böyle biter: bir demlik, bir sandık, bir küslüğün sonu.',
            ),
          ],
        },
        {
          when: not(flag('suc_duyurusu')),
          lines: [
            th(
              'Bir halatı çözdük. Ama halatı öreni değil. Eksper hâlâ bir yerde, kusursuz bir kravatla, bir sonraki yangını bekliyor.',
            ),
            th('Bazen adalet bir kapıyı açar, ama ışığı yakmaz. Işığı yakmak, bir sonraki dosyanın işi.'),
          ],
        },
        {
          when: flag('suc_duyurusu'),
          lines: [
            th(
              'Bir halatı çözdük. Halatı öreni artık savcılık arıyor; bir bekçinin defteri, bir dulun naylon dosyası ve benim dilekçemle.',
            ),
            th('Bazen adalet bir kapıyı açar, ama ışığı yakmaz. Bu sefer birinin elinde bir el feneri var.'),
          ],
        },
        {
          lines: [
            card('ARSLAN HUKUK — O GECE', 'buro_gece'),
            n(
              'Leyla dosyayı kapatıp rafa kaldırdı; 1996 tarihli sararmış dosyanın yanına. İkisi yan yana durdu: biri dört yıl, biri dört ay.',
            ),
            s(
              'leyla',
              'Şüpheden yararlandı diyorlar. Doğru. Ama o şüpheyi sen kurdun, Deniz. Şüphe de bir delildir; onu toplamak da bir iştir.',
            ),
            th(
              'Gemlik’teki ev. Sigortanın “kusur” dediği kış. Bu gece ilk kez o evin yandığı geceyi düşünmeden uyuyabilirim. Belki.',
            ),
          ],
        },
        {
          when: flag('alibi_kayit'),
          lines: [
            card('YILDIRIM, ESKİ SANAYİ — ERTESİ SABAH', 'depo'),
            n(
              'Ertesi sabah atölyeye uğradım; anahtarı Zehra’ya geri verecektim. Kapıda sanayinin bekçisi, elinde bir tepsi: iki çay.',
            ),
            n(
              'Halil kırkıncı sandalyenin oturağını geriyordu; duruşmadan sonraya bıraktığı son sandalye. Bitirince otele teslim edecekti. Sonra bir ev yapacaktı; önce elektriğiyle.',
            ),
            s(
              'halil',
              'Kırkıncıyı sana ayırdım, avukat hanım. Bürona. Müşteriler rahat otursun; ben iki ay rahat oturamadım.',
            ),
          ],
        },
        {
          when: flag('suc_duyurusu'),
          lines: [card('TARIK SÖNMEZ HAKKINDAKİ SORUŞTURMA SÜRÜYOR.', 'siyah')],
        },
      ],
    }),
    outcome('TAKSIR', {
      class: 'RECHARACTERIZED',
      priority: 6,
      when: ref('hizlandirici_coktu'),
      stamp: 'TAKSİR',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '5 ay hapis · ertelendi · dolandırıcılıktan beraat',
      verdictText:
        'Sanık Halil Bozkurt’un eylemine uyan TCK 171/1-a uyarınca takdiren 6 ay hapis cezası ile cezalandırılmasına, TCK 62/1 uyarınca 1/6 oranında indirilerek 5 ay hapis cezası ile CEZALANDIRILMASINA; yan binada oluşan zarar giderilmediğinden hükmün açıklanmasının geri bırakılması koşulları (CMK 231/6-c) oluşmadığından, sanığın sabıkasız olması ve yeniden suç işlemeyeceği kanaatiyle cezanın TCK 51/1 uyarınca ERTELENMESİNE, denetim süresinin 1 yıl olarak belirlenmesine; nitelikli dolandırıcılığa teşebbüs suçundan atılı suçu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; tutuklu ise tahliyesine; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Hızlandırıcı tespitinin dayanağı olan numunelerin elde ediliş zinciri güvenilir olmadığından yangının kasten çıkarıldığı ispatlanamamıştır.',
        ),
        because(
          'Sanık, tesisatın eski olduğu ve koridor buatının ısındığı konusunda elektrikçi tarafından uyarılmış; tesisatı yenilenene kadar kullanmaya devam etmiştir.',
        ),
        because(
          'Yangının başlangıç noktasının koridor buatı hattı olduğu ve bu hatta birincil ark oluştuğu, savunmanın da dayandığı itfaiye raporu ve mahkemenin elektrik bilirkişisi raporuyla sabittir.',
        ),
        because(
          'Yangının dış bir etkenden kaynaklandığı ya da sanığın özen yükümlülüğünü yerine getirdiği duruşmada ortaya konamamıştır: dosyada dağıtım hattına ilişkin bir kayıt yoktur, uyarıyı yapan elektrikçi de dinlenmemiştir.',
        ),
        because('Sanığa nitelik değişikliği hatırlatılmış ve ek savunması alınmıştır (CMK 226).'),
        because(
          'Savunma da terditli olarak eylemin en fazla taksirle yangına neden olma olabileceğini ileri sürmüştür.',
          flag('terditli'),
        ),
        because(
          'Müdafiin duruşmadaki hatalı delil sunumları kayda geçmiştir; ancak hüküm dosyadaki delillere dayanır ve numune zincirinin kopukluğu bu sunumlarla giderilmiş sayılamaz.',
          flag('cokus'),
        ),
        because('Hasar ihbarı gerçek bir hasara dayandığından dolandırıcılık kastı ispatlanamamıştır.'),
      ],
      legalBasis: 'TCK 171/1-a, 22/2, 62/1, 51/1; CMK 226, 231/6, 223/2-e, 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Bilirkişi raporunun bütün ayaklarını kayıtla çürüt, ama taksire kayıtla bir karşılık bulmadan bitir: notu yazan elektrikçiyi hazır etme, dağıtım şirketinin kaydını getirtme.',
      epilogue: [
        {
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n(
              '“Taksirle… beş ay… ertelenmesine.” Halil kelimeleri tek tek duydu, birleştiremedi. Zehra birleştirdi: kundakçı değil. Ama dikkatsiz.',
            ),
          ],
        },
        {
          when: flag('cokus'),
          lines: [
            n('Salon boşalırken savcı dosyasını topladı. Kapıda durdu, bana döndü.'),
            s(
              'savci',
              'İyi başladınız, avukat hanım. Numune zincirini siz kurdunuz; o zincir müvekkilinizi kurtardı. Bugün yanlış kâğıtları yanlış tanığa gösterdiniz. O da beraati götürdü.',
            ),
            th(
              'Hâkim kastı benim sesim yüzünden değil, bir bekçinin defteri yüzünden düşürdü. Beraati de benim yüzümden düşürdü. İkisini birden taşımak zor.',
            ),
          ],
        },
        {
          when: not(flag('cokus')),
          lines: [
            card('ADLİYE MERDİVENLERİ — AKŞAMÜSTÜ', 'adliye'),
            s(
              'halil',
              'Kundakçı değilmişim. Dikkatsizmişim. Nermin buna da kızardı. “Halil, sen kumaşa dikkat edersin, kendine etmezsin” derdi.',
              'uzgun',
            ),
            s('zehra', 'Baba, çıktın. Gerisi önemli değil.'),
          ],
        },
        {
          when: all(not(flag('cokus')), not(has('ev_ariza')), flag('fact_tv')),
          lines: [
            s(
              'halil',
              'Önemli, kızım. Usta “acil değil” dedi. Ben de inandım. Bir de sokağın teli koptu diyorlar; onu kimse yazmadı.',
              'uzgun',
            ),
            th(
              'Sokağın teli. Bir arıza kaydı. Bir müzekkere. İstesem gelecekti. İstemedim; ya da geç istedim. Hâkimin önüne bir dikkatsizlik bıraktım, bir arızayı değil.',
            ),
          ],
        },
        {
          when: all(not(flag('cokus')), any(has('ev_ariza'), not(flag('fact_tv')))),
          lines: [
            s(
              'halil',
              'Önemli, kızım. Usta “acil değil” dedi. Ben de inandım. İnanmak da bir dikkatsizlikmiş.',
              'uzgun',
            ),
            th(
              'Kâğıtlar dosyadaydı. Hâkimin önüne onları bir kapı gibi değil, bir yığın gibi koydum. İkinci kapı açık kaldı ve Halil oradan geçti.',
            ),
          ],
        },
        {
          lines: [th('Yedi buçuk yıl yerine beş ay, ertelenmiş. Kazanmak buysa, neden bu kadar ağır?')],
        },
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 7,
      when: always,
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 6 ay hapis · 50.000 TL adli para cezası',
      verdictText:
        'Sanık Halil Bozkurt’un TCK 170/1-a uyarınca, yangının yan binaya sıçrayarak iki aileyi tehlikeye sokması gözetilerek alt sınırdan uzaklaşılarak 1 yıl 6 ay hapis cezası ile; TCK 158/1-k uyarınca 4 yıl hapis ve 1.000 gün adli para cezası üzerinden, suçun teşebbüs aşamasında kalması nedeniyle TCK 35/2 uyarınca yarı oranında indirilerek 2 yıl hapis ve 500 gün adli para cezası ile CEZALANDIRILMASINA; bir gün karşılığı 100 TL’den 50.000 TL adli para cezasına (TCK 52/2); TCK 53 uyarınca hak yoksunluklarına; tutuklulukta geçen sürenin TCK 63 uyarınca mahsubuna; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Bilirkişi raporu, poliçenin zamanlaması, teminat artışı, eşyaların taşınması ve benzin alımı birlikte değerlendirildiğinde sanığın evini sigorta bedelini almak amacıyla yaktığı kanaatine varılmıştır.',
        ),
        because(
          'Savunmanın numune zincirine ilişkin itirazları kayda geçmiş, ancak hızlandırıcı tespitini ortadan kaldıracak ölçüde ispatlanamamıştır.',
          any(flag('contra_b1'), flag('contra_b2'), flag('contra_b4')),
        ),
        because(
          'Yangın yan binaya sıçramış, iki aile tahliye edilmiştir; genel güvenlik bakımından tehlike gerçekleşmiştir.',
        ),
        because(
          'Hasar bedeli şirketin şüphesi üzerine ödenmediğinden dolandırıcılık teşebbüs aşamasında kalmıştır (TCK 35).',
        ),
      ],
      legalBasis: 'TCK 170/1-a, 158/1-k, 35/2, 52, 53, 63; CMK 217, 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach:
        'Varsayılan sonuç: hızlandırıcı tespiti (numune zinciri ve zemin ya da laboratuvar) ayakta kaldıysa. Zincir kurulmadan ikinci celsede güvenilirliğini yitirmek de buraya götürür.',
      epilogue: [
        {
          when: flag('cokus'),
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n(
              '“Üç yıl altı ay.” Halil başını salladı. Bir şey söylemedi. Jandarma koluna girmeden önce bana baktı; suçlamadan, sadece baktı.',
            ),
            n('Salon boşalırken savcı dosyasını topladı. Kapıda durdu, bana döndü.'),
            s(
              'savci',
              'Elinizde ne vardıysa hepsini gösterdiniz, avukat hanım. Ama yanlış tanığa, yanlış anda. Bir delil ancak yerine oturunca delildir. İyi bir avukat olacaksınız. Bugün değil.',
            ),
            card('ADLİYE ARKA KAPISI — AKŞAMÜSTÜ', 'sokak_yagmur'),
            th(
              'Her yanlış kâğıt hâkimin önüne bir taş koydu. Numune zincirini kuramadım; kuramadığım yere kâğıt yığdım. Yığın bir duvar oldu, Halil duvarın öbür tarafında kaldı.',
            ),
          ],
        },
        {
          when: not(flag('cokus')),
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n(
              '“Üç yıl altı ay.” Halil başını salladı; kumaşı yanlış kesilmiş bir müşteriye “olur, düzeltiriz” der gibi. Sonra jandarmanın yanında yürüdü.',
            ),
            card('ADLİYE ARKA KAPISI — AKŞAMÜSTÜ', 'sokak_yagmur'),
            n(
              'Ring aracının camı buğuluydu. Halil parmağıyla küçük bir pencere açtı. Zehra elini kaldırdı. Ağlamadı; hemşireler ağlamaz. Araç gidince ağladı.',
            ),
          ],
        },
        {
          when: all(not(flag('cokus')), not(has('clue_bidon'))),
          lines: [
            th('Beş litre. Fişteki rakam. Bidon belki hâlâ bir yerde duruyordu. Kimse bakmadı; ben de bakmadım.'),
            th(
              'Bir dosyada en güçlü delil bazen hiç bakılmamış olandır, demişti Leyla. Bu dosyada en güçlü delil, benim bakmadığım bir şeydi.',
            ),
          ],
        },
        {
          when: all(not(flag('cokus')), has('clue_bidon')),
          lines: [
            th(
              'Bidonu buldum, sandığı buldum, sözleşmeyi buldum. İplikleri tek tek gevşettim. Ama halatın ucundaki rapora dokunamadım; numunelerin kimin elinden geldiğini kürsüde kimseye söyletemedim.',
            ),
            th('Bir halat, ucu bağlı kaldıkça halattır. Ben iplikleri saydım; düğüme bakmadım.'),
          ],
        },
        {
          when: flag('suc_duyurusu'),
          lines: [card('TARIK SÖNMEZ HAKKINDAKİ SORUŞTURMA SÜRÜYOR. SAVUNMA İSTİNAF BAŞVURUSUNDA BULUNDU.', 'siyah')],
        },
      ],
    }),
  ],
};
