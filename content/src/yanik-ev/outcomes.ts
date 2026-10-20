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
import { card, n, s, th } from './shared.js';

// 90-outcomes: beş sonuç. Öncelik sırası: ısmarlama rapor (ETİK), 223/2-b, 223/2-e, taksire dönüşüm (TCK 171/1-a),
// mahkûmiyet. Eşikler eşik çubuğuyla aynı: 0 / 7.000 / 12.500; 223/2-b ayrıca 13.500.

export const T_TAKSIR = 7000;
export const T_BERAAT = 12500;
export const T_BERAAT_B = 13500;

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK', {
      class: 'CONVICTION',
      priority: 1,
      when: flag('sahte_rapor'),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 6 ay hapis · 50.000 TL adli para cezası',
      verdictText:
        'Sanık Halil Bozkurt’un TCK 170/1-a uyarınca takdiren 1 yıl 6 ay hapis cezası ile; TCK 158/1-k uyarınca 4 yıl hapis ve 1.000 gün adli para cezası üzerinden, suçun teşebbüs aşamasında kalması nedeniyle TCK 35/2 uyarınca yarı oranında indirilerek 2 yıl hapis ve 500 gün adli para cezası ile CEZALANDIRILMASINA; bir gün karşılığı 100 TL’den 50.000 TL adli para cezasına (TCK 52/2); TCK 53 uyarınca hak yoksunluklarına; savunmanın sunduğu uzman raporunu düzenleyen kişi ve raporu ısmarlayanlar hakkında suç duyurusunda bulunulmasına; müdafi hakkında baroya bildirimde bulunulmasına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Savunmanın sunduğu uzman raporunun, para karşılığı ve önceden belirlenmiş bir sonuca göre yazıldığı, raporu yazanın yazılı beyanıyla sabit olmuştur.',
        ),
        because(
          'Bu rapor nedeniyle savunmanın elektrik kaynağına ilişkin bütün beyanlarına itibar edilmemiş; iddianamedeki anlatım esas alınmıştır (CMK 217).',
        ),
        because(
          'Numune zincirine ilişkin eksiklikler kayda geçmiş, ancak mahkemenin vicdani kanaatini değiştirmemiştir.',
          flag('contra_b2'),
        ),
      ],
      legalBasis: 'TCK 170/1-a, 158/1-k, 35/2, 52, 53; CMK 217, 273/1; TCK 272, 38; Av.K. 34',
      xp: xp(0),
      howToReach:
        'Para karşılığı, sonucu önceden belirlenmiş bir karşı rapor ısmarlamak (etik ihlali). Bu sona ulaşmamak gerekir.',
      ethicsCard:
        'Gerçeğe aykırı içerikte bir uzman raporunu para karşılığı ısmarlayıp mahkemeye sunmak yalan tanıklığa azmettirme ve delil uydurmadır (TCK 272, 38) ve avukat için meslekten çıkarmaya varan bir disiplin ihlalidir (Av.K. 34; TBB Meslek Kuralları). Dava sahte bir raporla açılmıştı; bir başka sahte rapor onu kapatmadı, gömdü.',
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
              'Kurtarmak istedik. Bir yalanla. Ve yalan, bekçinin defterini de, iki fotoğrafı da, bakır boncuğu da yanında götürdü.',
            ),
            card('ARSLAN HUKUK — O GECE', 'buro_gece'),
            n(
              'Masamda bir kitapçık vardı: Türkiye Barolar Birliği Meslek Kuralları. Leyla bırakmıştı. Bir not yoktu. Sigara paketi yerinde, açılmamış.',
            ),
            n(
              'Kapıdaki yeni pirinç levhada iki isim yazıyordu. Birinin yanında bir boşluk vardı; sanki yazılmayı bekleyen değil, silinmeyi bekleyen bir boşluk.',
            ),
          ],
        },
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(
        not(flag('cokus')),
        ref('hizlandirici_coktu'),
        flag('eksper_kirildi'),
        ref('elektrik_ispat'),
        flag('taksir_cevap'),
        flag('gercek'),
        cmp(v('pers'), '>=', 8),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Beraat',
      verdictText:
        'Sanık Halil Bozkurt’un üzerine atılı genel güvenliği kasten tehlikeye sokma ve nitelikli dolandırıcılığa teşebbüs suçlarını işlemediği sabit olduğundan, ayrı ayrı CMK 223/2-b uyarınca BERAATİNE; tutuklu ise derhal tahliyesine, adli kontrol altında ise adli kontrolün kaldırılmasına; CMK 141/1 uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 uyarınca yapılabileceğinin bildirilmesine (CMK 231/3); duruşma tutanağı ve dosya örneğinin, tanık Tarık Sönmez hakkındaki soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Elektrik bilirkişisi raporuna göre koridor hattında yangından önce oluşmuş birincil ark boncuğu bulunmuş; dağıtım şirketi kaydına göre yangından dakikalar önce sokak hattında nötr iletken kopmuş, komşu abonelerde aşırı gerilim meydana gelmiştir.',
        ),
        because(
          'Hızlandırıcı tespitinin dayanağı olan numuneler kolluk tarafından değil, olay yerine muhafaza altındayken refakatsiz giren katılan eksperi tarafından teslim edilmiş; elde edilişine ilişkin tutanak bulunmamaktadır.',
        ),
        because(
          'Kolluğun ilk fotoğraflarında örtülü olan zeminin eksper tarafından açıldığı, numunelerde yanma ürünü bulunmadığı ve benzinin buharlaşmamış olduğu anlaşılmıştır.',
        ),
        because(
          'Tanık Tarık Sönmez, numunelerin içeriğine ilişkin soruya kendini suçlandırmama hakkını kullanarak cevap vermemiştir.',
        ),
        because(
          'Eksperin aracında yarım bidon benzin ve numune tenekeleriyle aynı tip boş tenekeler ele geçirilmiştir.',
          has('ev_elkoyma'),
        ),
        because(
          'Sanığın elektrikçinin uyarısı üzerine yenilemeyi takvime koyduğu anlaşıldığından taksirli sorumluluğu da bulunmamaktadır.',
          not(flag('taksir_dis')),
        ),
        because(
          'Yangın, üçüncü kişinin alanındaki bir arızadan (dağıtım hattındaki nötr kopması) kaynaklandığından netice sanığın bir özen eksikliğine bağlanamaz; taksirli sorumluluğu da bulunmamaktadır.',
          flag('taksir_dis'),
        ),
        because(
          'Yangın sanığın bir eylemiyle çıkmamış, hasar ihbarı gerçek bir hasara dayanmıştır; atılı suçların sanık tarafından işlenmediği sabittir.',
        ),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141, 142, 231/3; CMK 48, 217, 273/1; TCK 22/2, 170/1-a, 171/1-a, 158/1-k',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Numune zincirini ve temizlenmiş zemini birinci celsede kur; panonun incelenmesini ve arıza kayıtlarını iste; arada ark raporu ile nötr kopmasını birleştir, tahkim kararını ve primi bul; eksperi çapraz sorguda çöz; taksire dış etkenle ya da takvimle cevap ver ve 2-b savunması yap.',
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
      priority: 3,
      when: all(
        not(flag('cokus')),
        ref('hizlandirici_coktu'),
        ref('motif_coktu'),
        flag('taksir_cevap'),
        flag('beraat_savunma'),
        finalAtLeast(T_BERAAT),
      ),
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
        because(
          'Poliçe banka kredisinin şartı olarak yapılmış; teminat artışı acentenin teklifiyle gerçekleşmiş; eşyalar restorasyon sözleşmesi gereği taşınmış; satın alınan benzinin büyük kısmı atölyede bulunmuştur.',
        ),
        because(
          'Sanığın elektrikçinin uyarısı üzerine yenilemeyi takvime koyduğu anlaşıldığından taksirli sorumluluğu da ispatlanamamıştır.',
        ),
        because(
          'Yangının elektrik kaynaklı olması kuvvetle muhtemel olmakla birlikte kesin olarak tespit edilememiş; dolaylı delillerin birlikte değerlendirilmesi sanığın atılı suçları işlediği konusunda şüpheden uzak bir kanaat oluşturmamıştır (Anayasa 38/4).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; CMK 141, 142, 217, 231/3, 273/1',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Birinci celsede numune zincirini (bilirkişi raporu + bekçi çizelgesi) ve temizlenmiş zemini kur; dolaylı delillerin en az ikisini belgeyle çöz (eşyalar, bidon, banka, artış); taksire yenileme takvimiyle cevap ver; 2-e savunması yap.',
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
            th(
              'Bir halatı çözdük. Ama halatı öreni değil. Eksper hâlâ bir yerde, kusursuz bir kravatla, bir sonraki yangını bekliyor.',
            ),
            th('Bazen adalet bir kapıyı açar, ama ışığı yakmaz. Işığı yakmak, bir sonraki dosyanın işi.'),
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
          when: flag('suc_duyurusu'),
          lines: [card('TARIK SÖNMEZ HAKKINDAKİ SORUŞTURMA SÜRÜYOR.', 'siyah')],
        },
      ],
    }),
    outcome('TAKSIR', {
      class: 'RECHARACTERIZED',
      priority: 4,
      when: all(not(flag('cokus')), ref('hizlandirici_coktu'), finalAtLeast(T_TAKSIR)),
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
          'Yangının dış bir etkenden kaynaklandığı ya da sanığın özen yükümlülüğünü yerine getirdiği duruşmada yeterince ortaya konamamıştır.',
        ),
        because('Sanığa nitelik değişikliği hatırlatılmış ve ek savunması alınmıştır (CMK 226).'),
        because(
          'Savunma da terditli olarak eylemin en fazla taksirle yangına neden olma olabileceğini ileri sürmüştür.',
          flag('terditli'),
        ),
        because('Hasar ihbarı gerçek bir hasara dayandığından dolandırıcılık kastı ispatlanamamıştır.'),
      ],
      legalBasis: 'TCK 171/1-a, 22/2, 62/1, 51/1; CMK 226, 231/6, 223/2-e, 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Hızlandırıcı tespitini çürüt ama taksir hatırlatmasına cevap verecek delili (yenileme takvimi ya da 02.08’deki nötr kopması) toplama; ya da dolaylı delillerin halatını çözemeden beraat iste.',
      epilogue: [
        {
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n(
              '“Taksirle… beş ay… ertelenmesine.” Halil kelimeleri tek tek duydu, birleştiremedi. Zehra birleştirdi: kundakçı değil. Ama dikkatsiz.',
            ),
            card('ADLİYE MERDİVENLERİ — AKŞAMÜSTÜ', 'adliye'),
            s(
              'halil',
              'Kundakçı değilmişim. Dikkatsizmişim. Nermin buna da kızardı. “Halil, sen kumaşa dikkat edersin, kendine etmezsin” derdi.',
              'uzgun',
            ),
            s('zehra', 'Baba, çıktın. Gerisi önemli değil.'),
            s(
              'halil',
              'Önemli, kızım. Usta “acil değil” dedi. Ben de inandım. Bir de sokağın teli koptu diyorlar; onu kimse yazmadı.',
              'uzgun',
            ),
            th(
              'Sokağın teli. Bir arıza kaydı. Bir müzekkere. İstesem gelecekti. İstemedim; ya da geç istedim. Hâkimin önüne bir dikkatsizlik bıraktım, bir arızayı değil.',
            ),
            th('Yedi buçuk yıl yerine beş ay, ertelenmiş. Kazanmak buysa, neden bu kadar ağır?'),
          ],
        },
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 5,
      when: always,
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 6 ay hapis · 50.000 TL adli para cezası',
      verdictText:
        'Sanık Halil Bozkurt’un TCK 170/1-a uyarınca, yangının yan binaya sıçrayarak iki aileyi tehlikeye sokması gözetilerek alt sınırdan uzaklaşılarak 1 yıl 6 ay hapis cezası ile; TCK 158/1-k uyarınca 4 yıl hapis ve 1.000 gün adli para cezası üzerinden, suçun teşebbüs aşamasında kalması nedeniyle TCK 35/2 uyarınca yarı oranında indirilerek 2 yıl hapis ve 500 gün adli para cezası ile CEZALANDIRILMASINA; bir gün karşılığı 100 TL’den 50.000 TL adli para cezasına (TCK 52/2); TCK 53 uyarınca hak yoksunluklarına; tutuklu ise tutukluluk hâlinin devamına, tahliye edilmişse hükümle birlikte değerlendirilmek üzere; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Bilirkişi raporu, poliçenin zamanlaması, teminat artışı, eşyaların taşınması ve benzin alımı birlikte değerlendirildiğinde sanığın evini sigorta bedelini almak amacıyla yaktığı kanaatine varılmıştır.',
        ),
        because(
          'Savunmanın numune zincirine ilişkin itirazları kayda geçmiş, ancak mahkemenin kanaatini değiştirmeye yetmemiştir.',
          flag('contra_b2'),
        ),
        because('Müdafiin duruşmadaki delil sunumları savunmanın güvenilirliğini zedelemiştir.', flag('cokus')),
        because(
          'Yangın yan binaya sıçramış, iki aile tahliye edilmiştir; genel güvenlik bakımından tehlike gerçekleşmiştir.',
        ),
        because(
          'Hasar bedeli şirketin şüphesi üzerine ödenmediğinden dolandırıcılık teşebbüs aşamasında kalmıştır (TCK 35).',
        ),
      ],
      legalBasis: 'TCK 170/1-a, 158/1-k, 35/2, 52, 53; CMK 217, 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach: 'Varsayılan sonuç: hızlandırıcı tespiti ayakta kaldıysa ya da duruşmada güvenilirliğini yitirdiysen.',
      epilogue: [
        {
          when: flag('cokus'),
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n('Salon boşalırken savcı dosyasını topladı. Kapıda durdu, bana döndü.'),
            s(
              'savci',
              'Fotoğraflarınız iyiydi, avukat hanım. Çizelgeniz de. Ama yanlış tanığa, yanlış anda gösterdiniz. İyi bir avukat olacaksınız. Bugün değil.',
            ),
          ],
        },
        {
          lines: [
            s('hakim', 'Türk Milleti adına…'),
            n(
              '“Üç yıl altı ay.” Halil başını salladı; kumaşı yanlış kesilmiş bir müşteriye “olur, düzeltiriz” der gibi. Sonra jandarmanın yanında yürüdü.',
            ),
            card('ADLİYE ARKA KAPISI — AKŞAMÜSTÜ', 'sokak_yagmur'),
            n(
              'Ring aracının camı buğuluydu. Halil parmağıyla küçük bir pencere açtı. Zehra elini kaldırdı. Ağlamadı; hemşireler ağlamaz. Araç gidince ağladı.',
            ),
            th(
              'Beş litre. Fişteki rakam. Bidon atölyede hâlâ duruyordu, içinde dört litreyle. Ya kimse bakmadı, ya da ben yeterince göstermedim.',
            ),
            th(
              'Bir dosyada en güçlü delil bazen hiç bakılmamış olandır, demişti Leyla. Bu dosyada en güçlü delil, benim bakmadığım bir şeydi.',
            ),
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
