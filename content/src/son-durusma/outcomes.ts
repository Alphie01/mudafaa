import { all, any, because, cmp, finalAtLeast, flag, has, not, outcome, ref, v, xp } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { O, W } from './dsl.js';

// 80-outcomes: sonuçlar (öncelik sırasıyla) ve sonuca bağlı epiloglar. Eşikler meta’daki eşik çubuğuyla aynı.

export const T_INDIRIM = 3500;
export const T_BERAAT = 9000;
export const T_BERAAT_B = 10500;

const tutukluluk =
  'tutukluluk hâlinin devamına (ikinci celsede adli kontrolle tahliye edilmişse hükmolunan cezanın miktarı gözetilerek hükümle birlikte tutuklanmasına, CMK 100–101)';

export const outcomes: CasePart = {
  outcomes: [
    outcome('IKRAR', {
      class: 'OTHER',
      priority: 1,
      when: flag('sahte_ikrar'),
      stamp: 'İKRAR',
      stampTone: 'red',
      sentence: '12 yıl 6 ay hapis · etik ihlal',
      verdictText: `Sanık Emir Yalçın’ın ikrarı ve dosya kapsamı birlikte değerlendirilerek tasarlama unsuru oluşmadığından eyleminin TCK 81/1 kapsamında kaldığına; maktulün haksız fiilinin meydana getirdiği hiddet etkisiyle hareket ettiği kabul edilerek TCK 29 uyarınca müebbet hapis yerine 15 YIL; duruşmadaki tutum ve davranışları gözetilerek TCK 62/1 ile 12 YIL 6 AY HAPİS cezasıyla cezalandırılmasına; TCK 53; TCK 63 mahsup; ${tutukluluk}; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because('Sanık ikinci celsede eylemi ikrar etmiş; ancak ayrıntılarını anlatamamıştır.'),
        because('İkrar, tanık beyanı ve bıçağın sanığa ait olması birlikte değerlendirilmiştir.'),
        because('Maktulün olay gecesi sanığın babasına ilişkin açıkladığı haksız fiil nedeniyle haksız tahrik hükmü uygulanmıştır.'),
        because('Savunma, masumiyetini söyleyen sanığa gerçeğe aykırı bir ikrarı önermiştir; mahkemenin bilgisi dışında kalan bu durum hükmü değiştirmemiştir.'),
      ],
      legalBasis: 'TCK 81/1, 29, 62/1, 53, 63; CMK 273/1; Av.K. 34',
      xp: 0,
      howToReach:
        'Kemal’in “ikrar” önerisini Emir’e taşıma; masum olduğunu söyleyen müvekkile asla yapmadığı bir şeyi ikrar etmeyi önerme.',
      ethicsCard:
        'Masum olduğunu söyleyen müvekkiline daha az ceza için gerçeğe aykırı bir ikrarı önerdin. Bu, avukatın doğruluk ve özen yükümlülüğüne aykırıdır (Av.K. 34) ve müvekkilin kendini suçlamama hakkını (CMK 147/1-e) onun aleyhine çevirir. Yirmi iki yıl önce Leyla aynı cümleyi kurdu; bugün sen kurdun.',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
> “On iki yıl altı ay.” Emir kelimeleri duydu ve oturdu. Ayakta dinlemesi gerekiyordu; kimse bir şey demedi. Bana bakmadı. Babasına baktı.
> Kemal başını iki elinin arasına almıştı. Yirmi iki yıl önce o da bir salonda, bir ikrarın ardından, bir rakam duymuştu.
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Ring aracının arka camı buğuluydu. Emir elini cama koymadı. Meral koydu; dışarıdan, camın öbür tarafına. Araç hareket etti.
> Gülay Toker koridorun ucunda tek başına oturuyordu. Önünden geçerken bana baktı.
gulay: Yaptım dedi. Ama nasıl yaptığını söyleyemedi. Bir insan yaptığı şeyi anlatabilir avukat hanım. Kocamı kim öldürdü?
> Cevap vermedim. Vermeye hakkım yoktu.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla odasındaydı. Masasının köşesindeki çerçeveyi aldı, bana doğru yürüdü ve avucuma koydu. Bir cezaevi kapısı; bir adam, kucağında bir çocuk, çocuğun elinde bir kepçe.
leyla: Yirmi iki yıl önce ben de bunu dedim. “İkrar et, indirim alırsın.” Sen de dedin.
leyla: Bunu sen taşıyacaksın artık. Ters de çevirebilirsin; ama ters çevirince de bakacaksın. Ben baktım.
> Kapıyı kapattı. Işığını söndürdü; ilk kez benden önce gitti.
~ Masamın köşesinde bir çerçeve. İçinde bir çocuk ve bir kepçe. On beş dava boyunca ters dururdu; şimdi benim masamda, düz duruyor. Ters çevirmeye cesaretim yok.
`),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(
        not(flag('cokus')),
        ref('alibi_tam'),
        ref('fail_belli'),
        any(flag('closing_masumiyet'), flag('closing_suphe')),
        cmp(v('pers'), '>=', 8),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık Emir Yalçın’ın üzerine atılı tasarlayarak kasten öldürme suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; başka suçtan tutuklu değilse derhâl TAHLİYESİNE, hakkındaki adli kontrol tedbirinin kaldırılmasına; CMK 141/1-e uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 ile 6384 sayılı Kanuna göre yapılabileceğinin bildirilmesine (CMK 231/3); karar ve dosya örneklerinin tanık Tarık Sezer hakkındaki soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because('Sanık 23.40’ta iş yerinden elleri boş çıkmış, 23.52’de İskele durağında toplu taşıma aracına binmiştir (tanık beyanı, Kentkart kaydı).'),
        because('Maktul 23.58’de hayattadır ve kapıya gelen bir kişiyi içeri davet etmektedir (bilirkişi raporlu sesli mesaj).'),
        because('Tek görgü tanığının beyanları kayıtlarla, olay yeri bulgularıyla ve diğer tanıklarla çelişmiş; tanık yeniden dinlenmesinde kendini suçlayacak sorulara cevap vermemiştir.'),
        because('Başsavcılığın soruşturmasında tanığın o gece değiştirdiği gömlek ele geçirilmiş, maktulün mektubunun olay yerinden alındığı anlaşılmıştır.'),
        because('Deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141/1-e, 142, 231/3; CMK 217',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Sesli mesajı koru ve bilirkişiye gönder; Kentkart’la birleştir; Leyla’nın verdiği esas numarasıyla 2004 arşivini iste; bildiklerini savcılığa yaz ve son celsede baş tanığa kendi kâğıtlarını okut. Kovalamak senin işin değil.',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
> “İşlemediği sabit olduğundan… beraatine.” Emir kelimeleri duydu. Bir an anlamadı. Sonra babasına döndü.
> Kemal ayağa kalktı. Yirmi iki yıl önce bir salonda bir rakam duyan adam, bu salonda bir kelime duydu. Ağladı; ilk kez, sesini çıkarmadan, ellerini yüzüne kapatmadan.
# ADLİYE ÖNÜ · ÖĞLEDEN SONRA [bg:sokak_sabah]
> Dışarıda güneş vardı. Adliyenin merdivenleri kurumuştu. Meral oğlunun takımının omuzlarını düzeltti; dikişini kontrol eder gibi.
> Gülay Toker merdivenin başında duruyordu. Siyahlar içinde, elinde bir zarf.
gulay: Avukat hanım. O iz yazısının bir fotokopisi… bana verebilir misiniz? Ercan’ın son mektubu. Yarısı da olsa.
> Verdim. Fotokopiyi katlayıp zarfın içine koydu. “Teşekkür ederim” demedi; diyemedi. Başını eğdi ve gitti.
> Emir merdivenin dibinde babasını bekliyordu. Kemal indi, oğlunun yanında durdu. Bir süre ikisi de konuşmadı.
emir: Baba. Ercan abi sana bir mektup yazmıştı. Ben almadım.
kemal: Biliyorum. Duydum. Mahkemede duydum.
kemal: Ben de onun telefonunu açmamıştım. İkimiz de almadık. Bir dahaki sefere alırız.
`),
        O(`
# ARSLAN HUKUK · AKŞAM [bg:buro_gece]
> Leyla odasındaydı. Masasının köşesindeki çerçeve düz duruyordu; ters değil.
> Kapı çalındı. Bu kez gerçekten çalındı; bir kez. Kemal eşikteydi. İçeri girmedi.
kemal: Yirmi iki yıl.
leyla: Biliyorum.
> Bir süre öyle durdular; biri eşikte, biri masanın arkasında. Sonra Kemal çerçeveye baktı.
kemal: Düz duruyor.
leyla: Duruyor.
> Kemal başını salladı ve gitti. Merdivenlerde botları, sokak kapısı, sonra bir motorun öksürüğü.
> Leyla masasından bir dilekçe çıkardı; yarısı yazılmıştı. Başlığında: “Yargılamanın yenilenmesi talebi. Hükümlü: Kemal Yalçın. Bursa 2. Ağır Ceza 2004/311.”
leyla: Hükmün infaz edilmiş olması engel değil. Yirmi iki yıl geç; ama engel değil.
# SON
> Tarık Sezer tasarlayarak kasten öldürme ve yalan tanıklıktan tutuklandı. Toker Balık’ın neonunun I harfi bir hafta sonra yandı; Gülay Toker yaptırmıştı.
> Delil bir yüz değildi. Bir kart okuyucuydu, bir kasaydı, bir ölünün sesiydi ve yirmi iki yıl önce okunmamış bir ad.
`),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(
        not(flag('cokus')),
        ref('tanik_coktu'),
        any(ref('tasarlama_coktu'), ref('lehe2')),
        any(flag('closing_masumiyet'), flag('closing_suphe')),
        cmp(v('pers'), '>=', 6),
        finalAtLeast(T_BERAAT),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık Emir Yalçın’ın üzerine atılı tasarlayarak kasten öldürme suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; başka suçtan tutuklu değilse derhâl TAHLİYESİNE, hakkındaki adli kontrol tedbirinin kaldırılmasına; CMK 141/1-e uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 ile 6384 sayılı Kanuna göre yapılabileceğinin bildirilmesine (CMK 231/3); tanık Tarık Sezer hakkında suç duyurusunda bulunulmasına; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because('Tek görgü tanığının beyanları kayıtlarla, olay yeri bulgularıyla ve diğer tanıkla çelişmiş; hükme esas alınamamıştır.', ref('tanik_coktu')),
        because('İddianamede tasarlamaya dayanak gösterilen mesajın tamamı, bileği taşının alınış nedeni ve sanığın iş yerinde kalış nedeni tasarlamayı göstermemektedir.', ref('tasarlama_coktu')),
        because('Sanığın 23.40’ta iş yerinden çıktığı ve 23.52’de toplu taşıma aracına bindiği anlaşılmıştır.', any(has('ded_yol'), has('ded_saat'))),
        because('Tanığın o gece kasa ve kamera hakkındaki beyanları mali hafıza ve bilirkişi raporuyla çelişmiştir.', any(has('ded_kasa'), has('ded_kamera'))),
        because('Tanığın olay gecesi gömleğini değiştirdiği ve teslim etmediği anlaşılmıştır.', has('ded_gomlek')),
        because('Sanığın suçu işlediğine dair kesin ve inandırıcı delil bulunmamaktadır; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).'),
      ],
      legalBasis: 'CMK 223/2-e; CMK 141/1-e, 142, 231/3; CMK 217; Anayasa 38/4; AİHS 6/2',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Baş tanığın anlatımını kayıtlarla çürüt; tasarlamanın ayaklarını kâğıtlarla kes ya da en az iki bağımsız lehe bulgu kur; esas savunmada beraat iste.',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
> “Sabit olmadığından… beraatine.” Emir kelimeleri tek tek duydu; bir yabancı dilden çeviriyormuş gibi. Sonra anladı ve oturdu. Ayakta dinlemesi gerekiyordu; kimse bir şey demedi.
> Meral iğnesini yakasına taktı; iki eliyle oğlunun yüzünü tuttu. Kemal arkada ayakta kaldı.
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
`),
        W(
          flag('released'),
          `
> Emir üç haftadır dışarıdaydı ama bugün başka türlü çıktı. İmza defteri yok, karakol yok. Kapıdan geçerken omuzlarını düzeltti.
`,
        ),
        W(
          not(flag('released')),
          `
> Tahliye müzekkeresi öğleden sonra cezaevine ulaştı. Emir akşam yedide kapıdan çıktı; elinde bir naylon poşet, ayakkabıları bağcıksız. Kemal kapıdaydı; Meral arabada. Kemal oğlunun bağcıksız ayakkabılarına baktı, bir şey demedi; montunun cebinden iki bağcık çıkardı.
`,
        ),
        O(`
> Koridorda iki avukat konuşuyordu; biri ötekine bir şey fısıldadı. Duydum: “Şüpheden yararlandı.”
> Gülay Toker katılan sırasından kalktı, yanımdan geçerken durdu. Bana bakmadı; konuştu.
gulay: Kocamı kim öldürdü o zaman avukat hanım?
> Cevabını biliyordum. Kanıtlayamamıştım. Bu ikisi aynı şey değil.
> Koridorun öbür ucunda Tarık Sezer ceketini koluna almış, merdivenlere yürüyordu. Bir suç duyurusu, bir dosya numarası; bir de anahtarını parmağında çeviren bir adam.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla masasındaki çerçeveyi çevirdi. Fotoğrafa uzun uzun baktı; bir cezaevi kapısı, bir adam, bir çocuk ve bir kepçe.
leyla: Çocuk eve gitti. Bu iyi.
leyla: Ama bir şey eksik Deniz. Biri yirmi iki yıl önce bir dolabı sakladı; biri bu kez bir mektubu. İkisi de dışarıda.
> Çerçeveyi ters çevirmedi. Düz de bırakmadı; yan yatırdı. Yarım bir şey gibi.
~ Bazen adalet bir kapıyı açar ama ışığı yakmaz. Mudanya’da bir neonun I harfi hâlâ yanmıyor.
`),
      ],
    }),
    outcome('INDIRIM', {
      class: 'RECHARACTERIZED',
      priority: 4,
      when: all(not(flag('cokus')), flag('closing_terdit'), flag('arg_tahrik'), ref('tasarlama_coktu'), finalAtLeast(T_INDIRIM)),
      stamp: 'FARKLI NİTELENDİRME',
      stampTone: 'amber',
      sentence: '12 yıl 6 ay hapis',
      verdictText: `Sanık Emir Yalçın’ın eyleminde tasarlama unsuru oluşmadığından TCK 82/1-a’nın uygulanmasına yer olmadığına; eylemin TCK 81/1 kapsamında kaldığına; maktulün olay gecesi açıkladığı haksız fiilin meydana getirdiği hiddetin etkisiyle hareket ettiği kabul edilerek TCK 29 uyarınca müebbet hapis yerine 15 YIL; duruşmadaki tutum ve davranışları gözetilerek TCK 62/1 ile 12 YIL 6 AY HAPİS cezasıyla cezalandırılmasına; TCK 53; TCK 63 mahsup; ${tutukluluk}; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because('İddianamede tasarlamaya dayanak gösterilen mesajın tamamı, bileği taşının alınış nedeni ve sanığın iş yerinde kalış nedeni tasarlama unsurunu göstermemektedir.'),
        because('Savunmanın terditli talebi doğrultusunda, maktulün olay gecesi sanığa babasının yirmi iki yıl önceki mahkûmiyetinin asıl sorumlusu olduğunu açıklaması haksız tahrik olarak kabul edilmiştir.'),
        because('Tanık beyanı ve bıçağın sanığa ait olması birlikte değerlendirilmiş; savunmanın fiile yönelik itirazları heyeti beraate götürecek ölçüde güçlü bulunmamıştır.'),
      ],
      legalBasis: 'TCK 81/1, 29, 61, 62/1, 53, 63; CMK 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Esas savunmada terditli talepte bulun; tasarlamanın unsurlarının oluşmadığını kâğıtlarla göster ve haksız tahrik dayanağını kur.',
      epilogue: [
        O(`
baskan: Sanığın cezalandırılmasına…
> “On iki yıl altı ay.” Emir rakamı duydu ve bana döndü. Ne anlama geldiğini soran bir bakış. Sonra babasına; babası başını eğdi.
~ Ağırlaştırılmış müebbet istenen bir davada on iki yıl altı ay. Tasarlama düştü. Hukuken bir kazanım. Bir çocuğun gözünde, yapmadığı bir şey için on iki yıl altı ay.
# ADLİYE ARKA KAPISI · RİNG ARACI [bg:adliye]
> Ring aracının arka camı buğuluydu. Emir elini cama koydu. Meral dışarıdan elini onun elinin üstüne, camın öbür tarafına koydu.
> Kemal arabanın yanında durdu. Bana döndü.
kemal: Ben de ikrar etmiştim avukat hanım. O ikrar etmedi; siz de “olmazsa” dediniz. Ben ikisinin farkını bilmiyorum.
> Araç hareket etti. Kemal birkaç adım yürüdü, durdu. Eli havada kaldı.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla masasındaki çerçeveyi aldı. Bakmadı. Çekmecesini açtı, çerçeveyi içine koydu ve çekmeceyi kapattı.
leyla: İstinaf var. Yarın sabah başlıyoruz; ikimiz.
~ Terazinin bir kefesine “yapmadı”, öbürüne “yaptıysa öfkeden” koydum. Heyet ikinci kefeyi tuttu. Yirmi iki yıl önce de bir avukat iki kefeli konuşmuştu.
`),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 5,
      when: { all: [] },
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      sentence: 'Müebbet hapis',
      verdictText: `Sanık Emir Yalçın’ın üzerine atılı tasarlayarak kasten öldürme suçundan TCK 82/1-a uyarınca AĞIRLAŞTIRILMIŞ MÜEBBET HAPİS; duruşmadaki tutum ve davranışları gözetilerek TCK 62/1 ile MÜEBBET HAPİS cezasıyla cezalandırılmasına; TCK 53; TCK 63 mahsup; ${tutukluluk}; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi (CMK 273/1).`,
      reasoning: [
        because('Tanık beyanı, sanığa ait bıçak, sanığın olaydan dört gün önceki mesajı ve bileği taşı birlikte değerlendirilmiştir.'),
        because('Savunmanın tanığa ve tasarlamaya yönelik itirazları somut delillerle desteklenmemiştir.', not(flag('cokus'))),
        because('Savunmanın inandırıcılığı duruşmada çöktü; heyet iddianamedeki anlatımı esas aldı.', flag('cokus')),
      ],
      legalBasis: 'TCK 82/1-a, 62/1, 53, 63; CMK 273/1',
      xp: {
        if: {
          when: flag('cokus'),
          then: xp(0.3, { ethicsVar: 'ethics' }),
          else: xp(0.6, { ethicsVar: 'ethics' }),
        },
      },
      howToReach:
        'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir. Yanlış delil ve dayanaksız itiraz güvenilirliği eritir; baş tanığı çürütmeden ve tasarlamanın ayaklarını kesmeden beraat gelmez.',
      epilogue: [
        W(
          flag('cokus'),
          `
# SALON · HÜKÜMDEN SONRA [bg:durusma_salonu]
> Salon boşaldı. Jandarma Emir’i götürdü. Meral’i biri koluna girip dışarı çıkardı.
> Masamda oturuyordum. Notlarım önümde. Hiçbirine bakmamıştım; hiçbiri işe yaramamıştı.
> Savcı Karaman dosyasını topladı. Kapıya giderken durdu, bana döndü.
savci: Hafızayla değil, kâğıtla gelmeliydiniz avukat hanım. Bu dosyada kâğıtlar vardı.
> Kapı arkasından kapandı. Radyatör tıkırdadı. Başka ses yoktu.
`,
        ),
        O(`
# ADLİYE KORİDORU · HÜKÜMDEN SONRA [bg:adliye]
> “Müebbet.” Kelime koridora benden önce çıktı. Meral’in iğnesi elinden kaydı; mermerin üstünde ince bir ses çıkardı. Eğildim, aldım, ona uzattım. Almadı.
> Kemal duvara yaslanmıştı. Gözleri kapalı. Yirmi iki yıl önce bir salonda bir rakam duymuştu; bugün bir kelime duydu.
> Gülay Toker katılan sırasından kalktı. Sevinmiyordu. Kocası yine dönmemişti.
> Koridorun ucunda Tarık Sezer, ceketini koluna almış, merdivenlere yürüyordu. Anahtarını parmağında çeviriyordu.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla masasındaki çerçeveyi çevirdi; bir cezaevi kapısı, bir adam, kucağında bir çocuk. Uzun uzun baktı. Sonra yeniden ters çevirdi.
> Çekmecesinden bir klasör çıkardı: 2004/311. Masama bıraktı.
leyla: İstinafa ikimiz gideceğiz. Bu kez ben de imza atacağım.
leyla: Yirmi iki yıl önce bir çocuğu kaybettim. Bu kez babasının gözü önünde oğlunu kaybettik. Ama istinaf var; her zaman bir sonraki kapı vardır.
~ Avucumda Meral’in iğnesi. Ona geri vermeyi unuttum. Masamın köşesine koydum; bir çerçevenin olacağı yere.
`),
      ],
    }),
  ],
};
