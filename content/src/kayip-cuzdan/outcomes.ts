import { all, always, any, because, cmp, finalAtLeast, flag, has, not, outcome, ref, v, xp } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { S } from './dsl.js';
import { THRESHOLDS } from './meta.js';

// 90-outcomes: beş sonuç. Öncelik: sahte ikrar → 223/2-b → 223/2-e → TCK 160 (nitelendirme) → mahkûmiyet (varsayılan).
// Epilog: karar ekranında hükümden sonra oynatılır; `when`'i tutan bütün bloklar sırayla birleşir.

const TAZMINAT =
  'CMK 141 ve devamı maddeleri uyarınca tazminat isteme hakkının bulunduğunun bildirilmesine (CMK 231/3); emanetteki cüzdanın müştekiye, zarf içindeki 600 TL ile el yazılı notun sanığa iadesine';

export const outcomes: CasePart = {
  outcomes: [
    outcome('IKRAR', {
      class: 'CONVICTION',
      priority: 1,
      when: flag('false_confession'),
      stamp: 'HAGB · ETİK İHLAL',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '5 ay hapis · hükmün açıklanması geri bırakıldı',
      verdictText:
        'Sanık Arda Çınar’ın sabit görülen eylemi nedeniyle TCK 141/1 uyarınca takdiren 1 yıl hapis cezası ile cezalandırılmasına; kovuşturma başladıktan sonra ve hüküm verilmeden önce zararın tamamen giderilmesi nedeniyle TCK 168/2 uyarınca cezasından 1/2 oranında indirim yapılarak 6 ay hapis cezası ile cezalandırılmasına; sanığın geçmişi ve duruşmadaki tutumu lehine takdiri indirim nedeni sayılarak TCK 62/1 uyarınca 1/6 oranında indirimle 5 ay hapis cezası ile cezalandırılmasına; zararın giderilmiş olması ve sanığın sabıkasız bulunması karşısında CMK 231/5 uyarınca HÜKMÜN AÇIKLANMASININ GERİ BIRAKILMASINA ve 5 yıl denetim süresine tabi tutulmasına; CMK 231/12 uyarınca istinaf yolu açık olmak üzere (CMK 273/1, tebliğden itibaren iki hafta).',
      reasoning: [
        because('Sanık ek savunmasında atılı suçu kabul etmiş, zarar sanık yakınınca giderilmiştir.'),
        because('Sanığın ikrarı, kolluk ve ilk celsedeki inkârıyla ve müştekiye gönderdiği mesajla çelişse de mahkeme sanığın son beyanını esas almıştır.', flag('gulten_mesaj')),
        because('Etkin pişmanlık ve takdiri indirim hükümleri uygulanmıştır.'),
      ],
      legalBasis: 'TCK 141/1, 168/2, 62/1; CMK 231/5–12, 273/1 · Avukatlık Kanunu md. 34; TCK 270',
      xp: 0,
      howToReach: 'Ulaşılmaması gereken sonuç: suçsuzluğunu söyleyen müvekkili suçu kabule yönlendirmek.',
      ethicsCard:
        'Müvekkil “ben almadım” diyordu ve delil onu doğruluyordu. Ona suçu kabul ettirdin. HAGB bir af değildir: sanığın yapmadığı bir şeyi yaptım demesi tutanakta kalır, beş yıllık denetim boyunca üstünde durur. Avukat müvekkilinin hukuki yararını gözetir ama gerçeğe aykırı bir beyana yönlendiremez (Av.K. md. 34); gerçeğe aykırı ikrar yetkili makamları yanıltmaya (TCK 270) kadar varabilir. Etkin pişmanlık (TCK 168) gerçek bir pişmanlık ister.',
      epilogue: [
        {
          lines: S(`
# adliye | 17 KASIM · 12.40 — ADLİYE MERDİVENLERİ
Yağmur yeniden başlamıştı. Zehra şemsiyesini açtı, Arda’nın üstüne tuttu. Arda şemsiyenin altından çıktı, ıslanmayı seçti.
zehra: Bitti. Sicile işlemiyor. Değil mi avukat hanım? İşlemiyor?
P: İşlemiyor. Beş yıl… denetim.
Arda bir şey söylemedi. Merdivenlerin sonunda durdu, adliyenin kapısına baktı. Sonra bana.
arda: Çocuklara ne anlatacağım hocam? Bir şey bulursanız teslim edin mi? Yoksa korkarsanız kabul edin mi?
Cevap vermedim. Verebileceğim bir cevap yoktu.
# buro_gece | AYNI GECE — ARSLAN HUKUK
Masamda bir kitapçık duruyordu: “Avukatlık Kanunu ve Meslek Kuralları.” Leyla bırakmıştı. Not yoktu. Gerek de yoktu.
Leyla’nın odasının ışığı yanıyordu. Kapısı kapalıydı. O gece kapıyı çalmadım.
> Bir müvekkilim vardı. Buldum, dedi. Ben ona “kabul et” dedim. Kazandığım tek şey, kaybetmediğimi sanmaktı.
`),
        },
        {
          when: flag('gulten_mesaj'),
          lines: S(`
> Gülten Hanım koridorda torununun telefonuna bakıyordu. 21.14’teki o mesaja. Sonra telefonu kapattı ve bana bakmadan geçti.
`),
        },
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(not(flag('cokus')), flag('sav_b_ok'), cmp(v('pers'), '>=', 7), finalAtLeast(THRESHOLDS.BERAAT_B)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · CMK 223/2-b',
      verdictText: `Sanık Arda Çınar’ın üzerine atılı hırsızlık suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; ${TAZMINAT}; dosyanın bir örneğinin ilgili soruşturmayla irtibatlandırılmak üzere Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere (CMK 273/1, tebliğden itibaren iki hafta).`,
      reasoning: [
        because('Dört kanallı tam sefer kaydında müştekinin cüzdanının 18.33’te başka bir kişi tarafından alındığı, 18.36’da koltuk altına bırakıldığı ve bu kişilerin 18.37’de araçtan indiği görülmüştür.'),
        because('Müştekinin kartıyla harcama yapan kişi büfe sahibi tanıkça teşhis edilmiş; müştekinin kartı ayrı soruşturmada yakalanan şüphelilerin üzerinde ele geçirilmiştir.'),
        because('Şoför tanık, sanığın cüzdanı kendisine uzattığını ve geri çevirdiğini duruşmada beyan etmiştir.', flag('contra_r')),
        because('Sanık cüzdanı bulduktan sonra çağrı merkezini aramış ve sahibine mesaj göndermiştir; teslim iradesi açıktır.', any(has('ded_niyet_tam'), has('ded_teslim'), has('ev_cagri_kaydi'))),
        because('Bu deliller birlikte değerlendirildiğinde yüklenen suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141, 231/3, 273/1',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Tam sefer kaydını iste ve kareleri incele; cüzdanı bırakanı ve inenleri tahtada bağla; büfedeki fişi Cemil Usta’yla oku ve onu savcılığa yönlendir; somut delillerle suç duyurusunda bulun; şoförü kayıtla çöz; esas savunmada 223/2-b’yi iste.',
      epilogue: [
        {
          lines: S(`
# sokak_sabah | 17 KASIM · 12.40 — ADLİYE MERDİVENLERİ
Yağmur dinmişti. Bulutların arasından ince, soğuk bir güneş, ıslak basamaklara vuruyordu. Bursa’da böyle günler az olur; olunca herkes yukarı bakar.
Arda merdivenlerin başında durdu. Zehra ona sarılırken telefonunu çıkardı, bir numara tuşladı. “Anne,” dedi. Sonra ağladı. Sonra güldü.
Gülten Hanım torununun koluna girmiş, yavaşça merdivenlerden iniyordu. Arda’nın yanında durdu. Cüzdanını açtı, fotoğrafı çıkardı ve ona gösterdi.
gulten: Yerinde. Sen dokunmamışsın. Ben de sana çok şey söyledim evladım. Söküğü olan iş. Ben dikerim.
arda: Ben de… teslim edemedim teyze. Geç kaldım.
gulten: Geç kalmadın. Ben bakmadım. Hadi, bir çayımı iç bir gün. Elif adresi verir.
Telefonum titredi. Başkomiser Orhan Kılınç.
orhan~phone: Avukat hanım, altı dosyanın altısı da kapandı. Hat 19’daki son kadının kartı da çıktı. Kuru bir teşekkür ederim. Islağını müşterilerinize bırakıyorum.
# buro_gece | AYNI AKŞAM — ARSLAN HUKUK
Leyla alt çekmecesini açmıştı. Bu kez beni çağırdı.
leyla: Bak. Bir eldiven, bir tespih, bir çocuk çorabı, bir çakmak. Otuz yıl. Sahipleri dönmedi. Ama dönebilirlerdi.
leyla: Kayıp eşyayı saklayan kişi hırsız değildir, Deniz. Sahibini bekleyendir. Bugün bunu bir mahkemeye gösterdin.
> Çekmeceyi kapatmadı. Anahtarı da çevirmedi. Bir dosya kapandı. Bir kapı açık kaldı.
`),
        },
        {
          when: flag('anne_gelecek'),
          lines: S(`
Arda’nın annesi Gülten Hanım’ın elini tuttu. İki kadın bir süre hiçbir şey söylemeden öyle durdu. Sonra Gülten Hanım fotoğrafı ona da gösterdi.
`),
        },
        {
          lines: S(`
# siyah | SON KART
Kenan ve Sevda T. hakkında, altı ayrı müşteki yönünden yankesicilik ve banka kartının kötüye kullanılması suçlarından kamu davası açıldı.
Arda Çınar bahar döneminde staj okuluna döndü. Dördüncü sınıflar onu tahtaya “HOŞ GELDİNİZ ARDA ÖĞRETMENİM” yazarak karşıladı.
`),
        },
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(not(flag('cokus')), flag('beraat_talep'), ref('beraat_zemini'), cmp(v('pers'), '>=', 5), finalAtLeast(THRESHOLDS.BERAAT_E)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · CMK 223/2-e',
      verdictText: `Sanık Arda Çınar’ın üzerine atılı hırsızlık suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; ${TAZMINAT}; kartların kullanılmasına ilişkin soruşturmanın sürdürülmesi için dosyanın bir örneğinin Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere (CMK 273/1, tebliğden itibaren iki hafta).`,
      reasoning: [
        because('Savcılığın dayandığı CD kaydı, dört kanallı ve bir saatlik bir sefer kaydının tek kanalından alınmış 2,5 dakika olup 18.43’e ait bir dakikası eksiktir.', any(flag('contra_v'), flag('contra_v2'))),
        because('Tanık Hayri Doğan, müştekinin arkasındaki kişinin yüzünü görmediğini, teşhisin karakolda kendisine gösterilen tek görüntüye dayandığını beyan etmiştir.', any(flag('contra_h1'), flag('contra_h4'))),
        because('Sanığın cüzdanı müştekinin çantasından değil, oturduğu koltuğun altından aldığı kayıtla sabittir.', any(flag('contra_h4'), has('ded_buldu'))),
        because('Müştekinin kartları sanık otobüsteyken kilometrelerce geride kullanılmış olup kartların sanıkta olduğuna dair bir delil yoktur.', has('ded_kart_baskasi')),
        because('Şoför tanık, sanığın cüzdanı kendisine uzattığını duruşmada kabul etmiştir.', flag('contra_r')),
        because('Sanık olay akşamı çağrı merkezini aramış, sahibine mesaj göndermiş ve ertesi sabah için karakol notu yazmıştır.', any(has('ded_teslim'), has('ded_niyet_tam'))),
        because('Müşteki, sanığın cüzdanını çaldığına artık inanmadığını beyan etmiştir.', flag('gulten_tanik')),
        because('Sanığın suçu işlediğine dair her türlü şüpheden uzak, kesin ve inandırıcı delil bulunmamaktadır; şüpheden sanık yararlanır (Anayasa 38/4, AİHS 6/2).'),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; AİHS 6/2; CMK 141, 231/3, 273/1',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach: 'Savcılık delillerini en az üç bulguyla sars (kayıt, tanık, kartlar, teslim izleri, şoför, müşteki) ve esas savunmada beraat iste.',
      epilogue: [
        {
          lines: S(`
# adliye | 17 KASIM · 12.40 — ADLİYE KORİDORU
“Beraatine.” Kelime salonda bir an asılı kaldı, sonra yere düştü ve kimse onu almadı. Arda yerinden kalkmadı. Kalkmayı unuttu.
Zehra arkadan omzuna dokundu. Arda o zaman kalktı. Bana döndü, bir şey söylemedi; sadece başını eğdi. Bir öğretmen öğrencisine nasıl teşekkür ederse öyle.
Koridorda iki avukat konuşuyordu. Biri bizim dosyayı soruyordu. Öbürü omuz silkti: “Şüpheden yararlandı.”
Arda duydu. Yüzü bir an karardı. Sonra bana baktı.
arda: Şüpheden mi yararlandım hocam?
P: Şüphe senin lehine işledi, çünkü şüpheyi kanıtlayan biz olduk. Bu, “belki yaptı” demek değil. “Yaptığını kimse gösteremedi” demek.
arda: Ama kartları kullananlar… onlar ne olacak?
P: Dosyada “faili belirlenemedi” yazıyor. Savcılık o dosyayı sürdürecek. Belki bir gün biri o fişin arkasındaki notu okur.
`),
        },
        {
          when: flag('hayri_ozur'),
          lines: S(`
Hayri Bey koridorun ucunda şapkasını takıyordu. Arda’nın yanına gelip durdu.
hayri: Evlat… Ben yanlış kapıya bıraktım. Otuz yılda ikinci kere. Kusura bakma.
arda: Siz gördüğünüzü söylediniz amca. Gördüğünüzü sandığınızı da. İkisini ayırdınız. Çok kişi ayıramaz.
`),
        },
        {
          when: flag('anne_gelecek'),
          lines: S(`
Merdivenlerin başında Arda’nın annesi bekliyordu. Kars’tan gece otobüsüyle gelmişti; paltosu buruşuktu. Oğluna sarılmadı önce; yüzüne dokundu, sanki gerçek mi diye.
@ARDA’NIN ANNESİ: Soğuk muydu bu sefer?
arda: Değildi anne. Bu sefer soğuk değildi.
`),
        },
        {
          when: flag('gulten_tanik'),
          lines: S(`
Gülten Hanım asansörün önünde bekliyordu. Arda’yı görünce elini kaldırdı; bir selam, bir çağrı, ikisinin arası.
gulten: Bir çayımı iç bir gün evladım. Elif adresi verir. Fotoğrafı da göstereyim sana; İsmail’i. Tanış.
`),
        },
        {
          lines: S(`
# buro_gece | AYNI AKŞAM — ARSLAN HUKUK
Leyla odasında, alt çekmecesi açık oturuyordu. Bir eldiven, bir tespih, bir çocuk çorabı. Beni görünce çekmeceyi kapattı ama kilitlemedi.
leyla: Beraat bir kapıyı açar, Deniz. Işığı yakmaz. Işığı yakmak bazen başkasının işidir. Sen kapıyı açtın.
leyla: Bu çekmecedekiler de öyle. Biri bir gün gelip “benim” derse, veririm. Gelmezlerse… saklarım. Saklamak da bir iş.
P: Hırsızlık değil yani.
leyla.mutlu: Hırsızlık değil. Sahibini beklemek.
> Eve dönerken Hat 38’e bindim. Validatör öttü. Altıparmak’ta bir parka, bir bere aradım gözümle. Yoktu. Ya da vardı ve ben göremedim.
`),
        },
      ],
    }),
    outcome('NITELENDIRME', {
      class: 'RECHARACTERIZED',
      priority: 4,
      when: all(not(flag('cokus')), ref('buldu_zemini'), finalAtLeast(THRESHOLDS.NITELENDIRME)),
      stamp: 'TCK 160 · HAGB',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '50 gün adli para cezası (5.000 TL) · hükmün açıklanması geri bırakıldı',
      verdictText:
        'Sanığın eyleminin TCK 160 kapsamında kaybolmuş eşya üzerinde tasarruf suçunu oluşturduğu kabul edilerek (CMK 226 uyarınca ek savunma hakkı tanınmıştır), müştekinin uzlaşmayı kabul etmeyeceğini duruşmada açıkça beyan etmesi karşısında, sanığın TCK 160 uyarınca takdiren 60 gün adli para cezası ile cezalandırılmasına; TCK 62/1 uyarınca 1/6 indirimle 50 gün adli para cezasına; günlüğü TCK 52/2 uyarınca 100 TL’den 5.000 TL adli para cezasına; cüzdanın müştekiye zarar görmeden teslim edilmiş olması ve sanığın sabıkasız bulunması karşısında CMK 231/5 uyarınca HÜKMÜN AÇIKLANMASININ GERİ BIRAKILMASINA ve 5 yıl denetim süresine tabi tutulmasına; zarf içindeki 600 TL ile el yazılı notun sanığa iadesine; CMK 231/12 ve 272/3-a gözetilerek kesin olmak üzere.',
      reasoning: [
        because('Sanığın cüzdanı müştekinin zilyetliğinden aldığı ispatlanamamış; cüzdanın araçta koltuk altında bulunduğu anlaşılmıştır. Bu nedenle hırsızlık suçunun unsurları oluşmamıştır.'),
        because('Ancak sanığın bulduğu cüzdanı yetkili mercilere teslim etmeyip yaklaşık on beş saat evinde tuttuğu sabittir; teslim girişimlerine dair beyanlar duruşmada yeterince desteklenmemiştir.'),
        because('Savunma kademeli olarak beraat, olmazsa TCK 160 ve hükmün açıklanmasının geri bırakılmasını talep etmiştir.', flag('terditli')),
        because('Müştekinin uğradığı zarar cüzdan yönünden mevcut değildir; sanık sabıkasızdır.'),
      ],
      legalBasis: 'TCK 160, 62/1, 52; CMK 226, 231/5–12, 272/3-a',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach: 'Cüzdanın bulunduğunu göster (CD’nin ilk kareleri, koltuk boşluğu, kartların başkasında olması) ama teslim girişimlerini ve tanık çelişkilerini delille kuramazsan mahkeme TCK 160’ta kalır.',
      epilogue: [
        {
          lines: S(`
# adliye | 17 KASIM · 12.40 — ADLİYE KORİDORU
“Hükmün açıklanmasının geri bırakılmasına.” Arda bu cümleyi anlamadı. Zehra anladı; ama yarısını.
zehra: Bitti mi? Ceza yok mu? Var mı?
P: Ne beraat ne mahkûmiyet. Hüküm kuruldu ama açıklanmadı. Beş yıl boyunca kasten bir suç işlemezse, hiç verilmemiş gibi düşecek.
arda: Beş yıl… Ben ne yaptım hocam? Hırsız değilmişim. Ama bir şey yapmışım. Ne?
P: Mahkeme, cüzdanı zamanında teslim etmediğini düşünüyor. Benim elimde onu teslim etmeye çalıştığını gösterecek kâğıtlar yeterince yoktu.
> Yeterince. Bir dilekçede bir satır, bir kayıtta bir dakika, bir şoförün ağzından bir cümle. Yeterince.
`),
        },
        {
          when: not(flag('gulten_tanik')),
          lines: S(`
Gülten Hanım torunuyla asansöre bindi. Bize bakmadı. Uzlaşma sorulduğunda “hayır” demişti; tek kelime. Kimse ona Facebook’taki o mesajı göstermemişti.
`),
        },
        {
          lines: S(`
# buro_gece | AYNI AKŞAM — ARSLAN HUKUK
Leyla dosyayı kapattı, bana uzattı.
leyla: Bu bir yenilgi değil. Ama bir zafer de değil. Bir askıda kalış. Müvekkilin beş yıl boyunca bunu taşıyacak. Sen de.
leyla: Bir dahaki dosyada eksik dakikayı daha erken ara. İstemediğin kayıt gelmez. Sormadığın soru tutanağa geçmez.
> Hat 38 camın önünden geçti. Validatörün sesi buraya kadar gelmedi. Ama ben duydum.
`),
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
      sentence: '10 ay hapis · ertelendi',
      verdictText:
        'Sanık Arda Çınar’ın üzerine atılı hırsızlık suçunu işlediği sabit olduğundan TCK 141/1 uyarınca takdiren 1 yıl hapis cezası ile cezalandırılmasına; sanığın sabıkasız geçmişi ve cezanın geleceği üzerindeki olası etkileri lehine takdiri indirim nedeni sayılarak TCK 62/1 uyarınca 1/6 indirimle 10 ay hapis cezası ile cezalandırılmasına; zararın giderilmemesi nedeniyle CMK 231/6-c koşulu gerçekleşmediğinden hükmün açıklanmasının geri bırakılmasına yer olmadığına; TCK 51/1 uyarınca cezanın ertelenmesine ve 1 yıl denetim süresi belirlenmesine; kısa süreli hapis cezası ertelendiğinden TCK 53/4 uyarınca TCK 53/1’in uygulanmamasına; istinaf yolu açık olmak üzere (CMK 273/1, tebliğden itibaren iki hafta).',
      reasoning: [
        because('Kamera kaydı, tanık beyanı ve cüzdanın sanığın çantasında bulunması birlikte değerlendirildiğinde sanığın eylemi sabit görülmüştür.'),
        because('Sanığın teslim etmek istediğine dair savunması dosya kapsamındaki delillerle desteklenmemiştir.'),
        because('Savunmanın inandırıcılığı duruşmada çöktü; mahkeme iddianamedeki anlatımı esas aldı.', flag('cokus')),
      ],
      legalBasis: 'TCK 141/1, 62/1, 51/1, 53/4; CMK 231/6-c, 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach: 'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir.',
      epilogue: [
        {
          lines: S(`
# sokak_yagmur | 17 KASIM · 12.40 — ADLİYE ÖNÜ
Yağmur bir an bile durmamıştı. Arda adliyenin önündeki banka oturdu. Ertelenmiş. Bir yıl denetim. Kelimeler onun için bir şey ifade etmiyordu.
Bir şey ifade eden tek kelime vardı ve onu Zehra söyledi, telefonda, kendi kendine konuşur gibi: “Atanamayacak.”
arda: İstinaf var, değil mi hocam? İki hafta?
P: Var. Yazacağım. Bu gece.
> Yazacaktım. Ama istinaf, ilk derecede kurulamayan bir şeyi ikinci derecede kurmaz. Eksik dakika bu salonda eksik kaldı.
`),
        },
        {
          when: flag('cokus'),
          lines: S(`
Savcı Tolga Uçar dosyasını toplarken yanımdan geçti. Durdu.
savci: İyi bir avukat olacaksınız. Bugün değil.
`),
        },
        {
          lines: S(`
# kafe | ÜÇ GÜN SONRA — ESKİ SAYFA, ÇARŞI
Sahafın camında bir kâğıt: “ELEMAN ARANIYOR.” Arda içerideydi; kitap etiketliyordu. Cemal Amca onu kovmamıştı. Arda kendi bırakıyordu.
arda: Kars’a dönüyorum hocam. Annem öğrendi. Ablam söylemedi, ben söyledim. Karakolun önündeki bankı sordu. Soğuk muydu, dedi.
Bir kitap uzattı: Sait Faik. Arasında bir ATM fişi vardı. 17.52, 600 TL.
arda: Ayraç. Sizde dursun. Bir gün bir şey bulursanız… teslim edin.
`),
        },
      ],
    }),
  ],
};
