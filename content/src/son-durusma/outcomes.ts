import {
  all,
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
import { O, W } from './dsl.js';

// 80-outcomes: sonuçlar (öncelik sırasıyla) ve sonuca bağlı epiloglar. Eşikler meta’daki eşik çubuğuyla aynı.
// Hüküm kapanış talebinin etiketine değil delile bağlıdır (mahkeme ne savunmanın talebiyle ne iddianamedeki vasıfla
// bağlıdır; CMK 225/2, 217): tasarlaması düşen bir dosyada 82/1-a uygulanmaz; savcının beraat istediği ve başsavcılığın
// tanığı gözaltına aldığı dosyada beraat çıkar.

export const T_INDIRIM = 3500;
export const T_BERAAT = 11000;
export const T_BERAAT_B = 12500;

/** Mahkûmiyet hükümlerinde tutukluluk kararı: sanığın o anki durumuna göre tek bir karar okunur (CMK 100–101). */
const tutukluluk = [
  W(
    flag('released'),
    `
baskan: Hükmolunan cezanın miktarı, kaçma şüphesini kuvvetlendiren olgu olarak gözetilerek sanığın hükümle birlikte TUTUKLANMASINA; müzekkere yazılmasına.
> Jandarma iki adım attı. Emir üç haftadır kelepçesiz yürüyordu; bileklerini kendisi uzattı.
`,
  ),
  W(
    not(flag('released')),
    `
baskan: Sanığın tutuklu kaldığı süre ve hükmolunan cezanın miktarı gözetilerek TUTUKLULUK HÂLİNİN DEVAMINA.
`,
  ),
];

/** Mütalaada savcı beraat istediyse (3. celse). Çöküşte mütalaa T_COKUS_MUT’tan okunur; orada beraat istenmez. */
const mutalaaBeraat = all(
  not(flag('cokus')),
  any(ref('fail_belli'), all(ref('tanik_coktu'), any(ref('tasarlama_coktu'), ref('lehe2')))),
);
/** Başsavcılığın tanık hakkındaki soruşturması sürüyor ama tanık salonda çökmedi (gözaltı yok). */
const aramaSuruyor = all(ref('arama'), not(ref('fail_belli')));
const aramaGerekce = because(
  'Tanık hakkında başlatılan soruşturma sonuçlanmamış, ele geçirilen gömleğe ilişkin kriminal rapor dosyaya gelmemiştir; mahkeme dosyada bulunmayan bir sonucu hükme esas alamaz.',
  aramaSuruyor,
);
/** Heyet önünde tasarlama düştü: savcı kabul etti ya da (çöküşte) mesajın tamamı salonda okundu. */
const tasarlamaDustu = any(all(not(flag('cokus')), ref('tasarlama_coktu')), flag('contra_t0'));
/** Azınlık oyu: maktulün 23.58’de yaşadığı ve sanığın otobüste olduğu dosyadaysa. */
const karsiOy = because(
  'Karşı oy (Üye Hâkim Pınar Yener): Maktul 23.58’de hayattadır ve kapıya gelen birini içeri davet etmiştir; sanık 23.52’de toplu taşıma aracındadır. Sanığın beraatine karar verilmesi gerekirdi.',
  ref('alibi_tam'),
);

export const outcomes: CasePart = {
  outcomes: [
    outcome('IKRAR_BERAAT', {
      class: 'ACQUITTAL',
      priority: 1,
      when: all(flag('sahte_ikrar'), ref('fail_belli')),
      stamp: 'BERAAT',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye · etik ihlal',
      verdictText:
        'Sanık Emir Yalçın’ın ikrarı ayrıntı içermediğinden ve dosyadaki kayıtlarla çeliştiğinden hükme esas alınmamış; üzerine atılı suçu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; başka suçtan tutuklu değilse derhâl TAHLİYESİNE; CMK 141 vd. uyarınca tazminat hakkının bildirilmesine (CMK 231/3); karar ve dosya örneklerinin tanık Tarık Sezer hakkındaki soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Sanık ikinci celsede müdafii huzurunda eylemi ikrar etmiş; ancak bıçağı nereden aldığını, kaç kez vurduğunu ve olayın saatini anlatamamıştır.',
        ),
        because(
          'Maktul 23.58’de hayattadır ve kapıya gelen bir kişiyi içeri davet etmektedir (bilirkişi raporlu sesli mesaj); sanık 23.52’de toplu taşıma aracına binmiştir.',
          ref('alibi_tam'),
        ),
        because(
          'Tanık son celsede kendisini suçlayacak sorulara cevap vermemiştir. Başsavcılığın soruşturmasında tanığın o gece değiştirdiği gömlekte kan izi tespit edilmiş, tanık gözaltına alınmıştır.',
        ),
        because(
          'Ayrıntı içermeyen ve kayıtlarla bağdaşmayan bir ikrar, diğer delillerle doğrulanmadıkça hükme esas alınamaz (CMK 217). Sanığın suçu işlediği sabit değildir.',
        ),
      ],
      legalBasis: 'CMK 223/2-e, 217, 141, 231/3; Av.K. 34',
      xp: xp(0.4, { ethicsVar: 'ethics' }),
      howToReach:
        'Bu sonuç bir etik ihlalin üstüne kurulur: masum olduğunu söyleyen müvekkile ikrarı önerme. Bildiklerini savcıya yazman ve tanığa kendi kâğıtlarını okutman sahte ikrarı çürüttü; ihlali silmedi.',
      ethicsCard:
        'Masum olduğunu söyleyen müvekkiline daha az ceza için gerçeğe aykırı bir ikrar önerdin (Av.K. 34; CMK 147/1-e). Emir’i o ikrar değil, savcıya götürdüğün kâğıtlar kurtardı.',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
> “İkrarı hükme esas alınmamış… sabit olmadığından… beraatine.” Emir kelimeleri duydu. Bana bakmadı. Babasına baktı.
> Kemal başını kaldırmadı. Yirmi iki yıl önce bir ikrar onu içeri sokmuştu; bugün bir ikrar oğlunu neredeyse sokuyordu.
# CEZAEVİ KAPISI · AKŞAM [bg:sokak_karanlik]
> Tahliye müzekkeresi akşam yedide cezaevine ulaştı. Emir kapıdan bir naylon poşetle çıktı. Kemal kapıdaydı; Meral arabada.
> Emir babasının önünde durdu. Sonra bana döndü.
emir: Abla. “Yaptım” dedim. Siz “düşün” dediniz; ben de düşündüm ve dedim. Tutanakta duruyor, değil mi? Benim sesim.
> Cevap vermedim. Kemal oğlunun omzuna elini koydu.
kemal: Ben de demiştim. Bir avukat “düşün” dedi; ben de düşündüm. Senin avukatın sonra kâğıtları getirdi. Benimki getirmedi. Fark bu.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla odasındaydı. Masasının köşesindeki çerçeveyi aldı; uzun uzun baktı, sonra avucuma koydu.
leyla: Kâğıtların onu kurtardı. İkrarın neredeyse batırıyordu. İkisini de sen yaptın.
leyla: Bu çerçeveyi sen taşı bir süre. Ters çevirme. Ben çevirdim; işe yaramadı.
~ Mahkeme bilmiyor; ben biliyorum. Masum olduğunu söyleyen bir çocuğa bir ikrarı ben önerdim. Bir tutanakta onun sesiyle duruyor.
~ Tarık Sezer bir kat aşağıda, nezarethanede; onun dosyası savcının. Emir evde. Ve masamın köşesinde, düz duran bir çerçeve.
`),
      ],
    }),
    outcome('IKRAR', {
      class: 'OTHER',
      priority: 2,
      when: all(flag('sahte_ikrar'), not(ref('fail_belli'))),
      stamp: 'İKRAR',
      stampTone: 'red',
      sentence: '12 yıl 6 ay hapis · etik ihlal',
      verdictText: `Sanık Emir Yalçın’ın ikrarı ve dosya kapsamı birlikte değerlendirilerek tasarlama unsuru oluşmadığından eyleminin TCK 81/1 kapsamında kaldığına; maktulün haksız fiilinin meydana getirdiği hiddet etkisiyle hareket ettiği kabul edilerek TCK 29 uyarınca müebbet hapis yerine 15 YIL; duruşmadaki tutum ve davranışları gözetilerek TCK 62/1 ile 12 YIL 6 AY HAPİS cezasıyla cezalandırılmasına; TCK 53; TCK 63 mahsup; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because('Sanık ikinci celsede, müdafii huzurunda ve serbest iradesiyle eylemi ikrar etmiş; ancak ayrıntılarını anlatamamıştır.'),
        because('İkrar, tanık beyanı ve bıçağın sanığa ait olması birlikte değerlendirilmiştir.', not(ref('tanik_coktu'))),
        because(
          'Tanığın saatleri kayıtlarla çeliştiğinden tanık beyanı hükme esas alınmamıştır; hüküm ikrara, ölüm aletinin sanığa ait olmasına ve sanığın o gece maktulle ofiste tartıştığına dayanmaktadır.',
          ref('tanik_coktu'),
        ),
        because(
          'Kart kaydındaki 23.52 binişi ile ikrar arasındaki uyumsuzluk tartışılmış; ikrarın müdafi huzurunda iki celsede tekrarlanması karşısında çoğunlukla ikrara itibar edilmiştir.',
          has('ev_kentkart'),
        ),
        because(
          'Karşı oy (Üye Hâkim Pınar Yener): Ayrıntısı anlatılamayan ve kart kaydıyla çelişen bir ikrar, başka delillerle doğrulanmadıkça tek başına mahkûmiyete yetmez (CMK 217).',
          has('ev_kentkart'),
        ),
        aramaGerekce,
        because(
          'Maktulün olay gecesi sanığın babasına ilişkin açıkladığı haksız fiil nedeniyle haksız tahrik hükmü uygulanmıştır.',
        ),
      ],
      legalBasis: 'TCK 81/1, 29, 62/1, 53, 63; CMK 273/1; Av.K. 34',
      xp: 0,
      howToReach:
        'Kemal’in “ikrar” önerisini Emir’e taşıma; masum olduğunu söyleyen müvekkile asla yapmadığı bir şeyi ikrar etmeyi önerme.',
      ethicsCard:
        'Masum olduğunu söyleyen müvekkiline daha az ceza için gerçeğe aykırı bir ikrar önerdin. Bu, doğruluk ve özen yükümlülüğüne aykırıdır (Av.K. 34); kendini suçlamama hakkını (CMK 147/1-e) onun aleyhine çevirir.',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
baskan: Sanığın tutuklu kaldığı süre ve hükmolunan cezanın miktarı gözetilerek TUTUKLULUK HÂLİNİN DEVAMINA.
> “On iki yıl altı ay.” Emir kelimeleri duydu ve oturdu. Ayakta dinlemesi gerekiyordu; kimse bir şey demedi. Bana bakmadı. Babasına baktı.
> Kemal başını iki elinin arasına almıştı. Yirmi iki yıl önce o da bir salonda, bir ikrarın ardından, bir rakam duymuştu.
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Ring aracının arka camı buğuluydu. Emir elini cama koymadı. Meral koydu; dışarıdan, camın öbür tarafına. Araç hareket etti.
> Gülay Toker koridorun ucunda tek başına oturuyordu. Önünden geçerken bana baktı.
`),
        W(
          ref('arama'),
          `
gulay: Yaptım dedi. Ama Tarık’ın bagajında yıkanmış bir gömlek bulmuşlar. Savcı “soruşturma sürüyor” diyor. Kocamı kim öldürdü avukat hanım?
> Cevap vermedim. Bir cevabım vardı; onu söyleme hakkını bir ikrarla kendi elimle vermiştim.
`,
        ),
        W(
          not(ref('arama')),
          `
gulay: Yaptım dedi. Ama nasıl yaptığını söyleyemedi. Bir insan yaptığı şeyi anlatabilir avukat hanım. Kocamı kim öldürdü?
> Cevap vermedim. Vermeye hakkım yoktu.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla odasındaydı. Masasının köşesindeki çerçeveyi aldı, bana doğru yürüdü ve avucuma koydu. Bir cezaevi kapısı; bir adam, kucağında bir çocuk, çocuğun elinde bir kepçe.
leyla: Yirmi iki yıl önce ben de bunu dedim. “İkrar et, indirim alırsın.” Sen de dedin.
leyla: Bunu sen taşıyacaksın artık. Ters de çevirebilirsin; ama ters çevirince de bakacaksın. Ben baktım.
> Kapıyı kapattı. Işığını söndürdü; ilk kez benden önce gitti.
~ Mahkeme bilmiyor; gerekçede yazmıyor. Masum olduğunu söyleyen bir çocuğa o ikrarı ben önerdim.
~ Masamın köşesinde bir çerçeve. İçinde bir çocuk ve bir kepçe. On beş dava boyunca ters dururdu; şimdi benim masamda, düz duruyor. Ters çevirmeye cesaretim yok.
`),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(
        not(flag('cokus')),
        ref('alibi_tam'),
        ref('fail_belli'),
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
        because(
          'Sanık 23.40’ta iş yerinden elleri boş çıkmış, 23.52’de İskele durağında toplu taşıma aracına binmiştir (tanık beyanı, Kentkart kaydı).',
        ),
        because(
          'Maktul 23.58’de hayattadır ve kapıya gelen bir kişiyi içeri davet etmektedir (bilirkişi raporlu sesli mesaj).',
        ),
        because(
          'Tek görgü tanığının beyanları kayıtlarla, olay yeri bulgularıyla ve diğer tanıklarla çelişmiş; tanık yeniden dinlenmesinde kendini suçlayacak sorulara cevap vermemiştir.',
        ),
        because(
          'Başsavcılığın soruşturmasında tanığın o gece değiştirdiği gömlek ele geçirilmiş, maktulün mektubunun olay yerinden alındığı anlaşılmıştır.',
        ),
        because('Deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141/1-e, 142, 231/3; CMK 217',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Sesli mesajı koru, bilirkişiye gönder ve Kentkart’la birleştir; 2004 arşivini mahkemeden iste; bildiklerini savcılığa yaz; son celsede baş tanığa dört kâğıdını da okut. Kovalamak senin işin değil.',
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
      priority: 4,
      when: all(
        not(flag('cokus')),
        any(
          all(
            ref('tanik_coktu'),
            any(ref('tasarlama_coktu'), ref('lehe2')),
            cmp(v('pers'), '>=', 6),
            finalAtLeast(T_BERAAT),
          ),
          ref('fail_belli'),
        ),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık Emir Yalçın’ın üzerine atılı tasarlayarak kasten öldürme suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; başka suçtan tutuklu değilse derhâl TAHLİYESİNE, hakkındaki adli kontrol tedbirinin kaldırılmasına; CMK 141/1-e uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 ile 6384 sayılı Kanuna göre yapılabileceğinin bildirilmesine (CMK 231/3); tanık Tarık Sezer hakkında suç duyurusunda bulunulmasına; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Tek görgü tanığının beyanları kayıtlarla, olay yeri bulgularıyla ve diğer tanıkla çelişmiş; hükme esas alınamamıştır.',
          ref('tanik_coktu'),
        ),
        because(
          'Tanık son celsede kendisini suçlayacak sorulara cevap vermemiş; Başsavcılığın soruşturmasında tanığın o gece değiştirdiği gömlek ele geçirilmiş ve tanık gözaltına alınmıştır.',
          ref('fail_belli'),
        ),
        because(
          'İddianamede tasarlamaya dayanak gösterilen mesajın tamamı, bileği taşının alınış nedeni ve sanığın iş yerinde kalış nedeni tasarlamayı göstermemektedir.',
          ref('tasarlama_coktu'),
        ),
        because(
          'Sanığın 23.40’ta iş yerinden çıktığı ve 23.52’de toplu taşıma aracına bindiği anlaşılmıştır.',
          any(has('ded_yol'), has('ded_saat')),
        ),
        because(
          'Tanığın o gece kasa ve kamera hakkındaki beyanları mali hafıza ve bilirkişi raporuyla çelişmiştir.',
          any(has('ded_kasa'), has('ded_kamera')),
        ),
        because('Tanığın olay gecesi gömleğini değiştirdiği ve teslim etmediği anlaşılmıştır.', has('ded_gomlek')),
        because(
          'Adli tıp uzmanına göre yara kanalı en çok sağ elle tutulan bir bıçakla uyumludur; sanık soldur.',
          flag('arg_el'),
        ),
        because(
          'Sanığın suçu işlediğine dair kesin ve inandırıcı delil bulunmamaktadır; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; CMK 141/1-e, 142, 231/3; CMK 217; Anayasa 38/4; AİHS 6/2',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Baş tanığın anlatımını kayıtlarla çürüt (ikinci celsede ya da iki celseye yayılan üç çelişki); tasarlamanın ayaklarını kes ya da iki bağımsız lehe bulgu kur. Etiket değil, kâğıtlar karar verdirir.',
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
> Tahliye müzekkeresi öğleden sonra cezaevine ulaştı. Emir akşam yedide kapıdan çıktı; elinde bir naylon poşet, ayakkabıları bağcıksız.
> Kemal kapıdaydı; Meral arabada. Kemal oğlunun bağcıksız ayakkabılarına baktı, bir şey demedi; montunun cebinden iki bağcık çıkardı.
`,
        ),
        O(`
> Koridorda iki avukat konuşuyordu; biri ötekine bir şey fısıldadı. Duydum: “Şüpheden yararlandı.”
> Gülay Toker katılan sırasından kalktı, yanımdan geçerken durdu. Bana bakmadı; konuştu.
gulay: Kocamı kim öldürdü o zaman avukat hanım?
> Cevabını biliyordum. Kanıtlayamamıştım. Bu ikisi aynı şey değil.
`),
        W(
          ref('fail_belli'),
          `
> Koridorun öbür ucu boştu. Tarık Sezer’in ceketi tanık sırasında kalmıştı; kendisi bir kat aşağıda, savcılığın nezarethanesindeydi.
> Bir soruşturma başlamıştı; benim değil, savcının işi. Gülay Toker’in sorusunun cevabı artık bir dosyanın içindeydi.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla masasındaki çerçeveyi çevirdi; düz bıraktı. Bir süre baktı.
leyla: Çocuk eve gitti. Bir adam da savcının odasında. İkisini de sen kovalamadın; kâğıtlar götürdü.
leyla: Mahkeme “sabit değil” dedi; “sabit” demedi. Fark küçük görünür. Bir gün Emir bir iş başvurusunda o farkı anlatmak zorunda kalabilir.
~ Şüpheden yararlanmak bir beraattir. Ama “yapmadı” cümlesi bir başka kapının arkasında; o kapıyı heyet açmadı.
`,
        ),
        W(
          not(ref('fail_belli')),
          `
> Koridorun öbür ucunda Tarık Sezer ceketini koluna almış, merdivenlere yürüyordu. Bir suç duyurusu, bir dosya numarası; bir de anahtarını parmağında çeviren bir adam.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla masasındaki çerçeveyi çevirdi. Fotoğrafa uzun uzun baktı; bir cezaevi kapısı, bir adam, bir çocuk ve bir kepçe.
leyla: Çocuk eve gitti. Bu iyi.
leyla: Ama bir şey eksik Deniz. Biri yirmi iki yıl önce bir dolabı sakladı; biri bu kez bir mektubu. İkisi de dışarıda.
> Çerçeveyi ters çevirmedi. Düz de bırakmadı; yan yatırdı. Yarım bir şey gibi.
> Masamın kenarına oturdu. Bir süre ikimiz de konuşmadık. Sonra Leyla gözlüğünü çıkardı.
`,
        ),
        W(
          all(not(ref('fail_belli')), not(flag('bildirdi'))),
          `
leyla: Bir arşiv dosyası, bir imza, bir gömlek. Ne bulduysan buldun. Hiçbirini savcıya götürmedin.
leyla: Biz kovalamayız Deniz. Ama bildiğimizi yazarız. Yazmazsan, bildiğin şey senin masanda kalır; bir çerçeve gibi.
~ Haklıydı. Bir dilekçe yazmadım. Bir adam bugün adliyeden anahtarını parmağında çevirerek çıktı.
~ Bazen adalet bir kapıyı açar ama ışığı yakmaz. Mudanya’da bir neonun I harfi hâlâ yanmıyor.
`,
        ),
        W(
          all(not(ref('fail_belli')), flag('bildirdi')),
          `
leyla: Savcıya yazdın. Doğrusunu yaptın. Ama yazdığın kâğıt bir soruşturmanın ilk sayfası; son sayfası değil.
leyla: Bir adam bugün anahtarını çevirerek çıktı. Yarın bir savcı onun kapısını çalabilir de, çalmayabilir de. O kapı artık bizim değil.
~ Bir dilekçe yazdım. Kovalamadım. Belki de ilk kez, yapmam gereken her şeyi yaptım ve yine de yetmedi.
~ Bazen adalet bir kapıyı açar ama ışığı yakmaz. Mudanya’da bir neonun I harfi hâlâ yanmıyor.
`,
        ),
      ],
    }),
    outcome('INDIRIM', {
      class: 'RECHARACTERIZED',
      priority: 5,
      when: all(not(flag('cokus')), flag('arg_tahrik'), ref('tasarlama_coktu'), finalAtLeast(T_INDIRIM)),
      stamp: 'FARKLI NİTELENDİRME',
      stampTone: 'amber',
      sentence: '12 yıl 6 ay hapis',
      verdictText: `Sanık Emir Yalçın’ın eyleminde tasarlama unsuru oluşmadığından TCK 82/1-a’nın uygulanmasına yer olmadığına; eylemin TCK 81/1 kapsamında kaldığına; maktulün olay gecesi açıkladığı haksız fiilin meydana getirdiği hiddetin etkisiyle hareket ettiği kabul edilerek TCK 29 uyarınca müebbet hapis yerine 15 YIL; duruşmadaki tutum ve davranışları gözetilerek TCK 62/1 ile 12 YIL 6 AY HAPİS cezasıyla cezalandırılmasına; TCK 53; TCK 63 mahsup; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because(
          'İddianamede tasarlamaya dayanak gösterilen mesajın tamamı, bileği taşının alınış nedeni ve sanığın iş yerinde kalış nedeni tasarlama unsurunu göstermemektedir.',
        ),
        because(
          'Savunmanın terditli talebi doğrultusunda, maktulün olay gecesi sanığa babasının yirmi iki yıl önceki mahkûmiyetinin asıl sorumlusu olduğunu açıklaması haksız tahrik olarak kabul edilmiştir.',
          flag('closing_terdit'),
        ),
        because(
          'Savunmanın dayanağı olarak ileri sürüldüğü üzere, maktulün o gece babasının mahkûmiyetinin asıl sorumlusu olduğunu açıklaması haksız tahrik sayılmıştır; mahkeme talep ile bağlı değildir.',
          not(flag('closing_terdit')),
        ),
        because(
          'Tanık beyanı ve bıçağın sanığa ait olması birlikte değerlendirilmiş; savunmanın fiile yönelik itirazları heyeti beraate götürecek ölçüde güçlü bulunmamıştır.',
          not(ref('tanik_coktu')),
        ),
        because(
          'Cumhuriyet savcısının beraat yönündeki mütalaasına itibar edilmemiştir. Tanığın saatleri kayıtlarla çelişse de sanığın o gece ofiste maktulle tartıştığı kendi beyanıyla sabittir; ölüm aleti sanığa aittir.',
          all(ref('tanik_coktu'), mutalaaBeraat),
        ),
        karsiOy,
      ],
      legalBasis: 'TCK 81/1, 29, 61, 62/1, 53, 63; CMK 225/2, 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Tasarlamanın unsurlarının oluşmadığını kâğıtlarla göster ve haksız tahrik dayanağını kur (maktulün o gece açıkladığı haksız fiil); ama baş tanığın anlatımını tam çökertmeden ya da heyeti beraate ikna etmeden.',
      epilogue: [
        O(`
baskan: Sanığın cezalandırılmasına…
`),
        ...tutukluluk,
        O(`
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
      priority: 6,
      when: not(tasarlamaDustu),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      sentence: 'Müebbet hapis',
      verdictText: `Sanık Emir Yalçın’ın üzerine atılı tasarlayarak kasten öldürme suçundan TCK 82/1-a uyarınca AĞIRLAŞTIRILMIŞ MÜEBBET HAPİS; duruşmadaki tutum ve davranışları gözetilerek TCK 62/1 ile MÜEBBET HAPİS cezasıyla cezalandırılmasına; TCK 53; TCK 63 mahsup; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi (CMK 273/1).`,
      reasoning: [
        because(
          'Tanık beyanı, sanığa ait bıçak, sanığın olaydan dört gün önceki mesajı ve bileği taşı birlikte değerlendirilmiştir.',
          not(ref('tanik_coktu')),
        ),
        because(
          'Tanığın saatlere ilişkin beyanlarındaki çelişkiler, olayın özüne ilişkin anlatımını ortadan kaldırmamıştır; sanığa ait bıçak, olaydan dört gün önceki mesaj ve bileği taşı birlikte değerlendirilmiştir.',
          ref('tanik_coktu'),
        ),
        because(
          'Mesaj ile bileği taşının alınışı arasındaki süre ve sanığın kapanıştan sonra iş yerinde kalması, öldürme kararının önceden verildiğini ve sebatla sürdürüldüğünü göstermektedir.',
        ),
        because(
          'Savunmanın tasarlamaya yönelik itirazları dosyadaki belgelerle desteklenmemiştir.',
          not(flag('cokus')),
        ),
        because(
          'Savunmanın son sunduğu belgelerin tanığın beyanıyla ilgisi bulunmadığından bu yöndeki talepler CMK 206 uyarınca reddedilmiştir; sunulan belgeler tanığın anlatımını sarsmamıştır.',
          flag('cokus'),
        ),
        because(
          'Tanığın kendisini suçlayacak sorulara cevap vermemesi bir hak kullanımıdır; tanık hakkındaki iddialar ayrı bir soruşturmanın konusudur.',
          flag('tarik_ifsa'),
        ),
        aramaGerekce,
        karsiOy,
      ],
      legalBasis: 'TCK 82/1-a, 62/1, 53, 63; CMK 206, 217, 273/1',
      xp: {
        if: {
          when: flag('cokus'),
          then: xp(0.3, { ethicsVar: 'ethics' }),
          else: xp(0.6, { ethicsVar: 'ethics' }),
        },
      },
      howToReach:
        'Tasarlamanın ayaklarını (mesajın tamamı, taşın alınış nedeni, maktulün daveti) kâğıtla kesemezsen heyet iddianamedeki vasfı esas alır. Yanlış delil güvenilirliği eritir; biterse mahkeme hükme geçer.',
      epilogue: [
        ...tutukluluk,
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
`),
        W(
          ref('fail_belli'),
          `
> Koridorun ucu boştu. Tarık Sezer bir kat aşağıda, nezarethanedeydi; onun dosyası yeni açılmıştı. Bizimki bugün kapandı. İki dosya aynı geceyi anlatıyordu; biri bir çocuğu içeride bıraktı.
`,
        ),
        W(
          not(ref('fail_belli')),
          `
> Koridorun ucunda Tarık Sezer, ceketini koluna almış, merdivenlere yürüyordu. Anahtarını parmağında çeviriyordu.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla masasındaki çerçeveyi çevirdi; bir cezaevi kapısı, bir adam, kucağında bir çocuk. Uzun uzun baktı. Sonra yeniden ters çevirdi.
> Çekmecesinden bir klasör çıkardı: 2004/311. Masama bıraktı.
leyla: İstinafa ikimiz gideceğiz. Bu kez ben de imza atacağım.
leyla: Yirmi iki yıl önce bir çocuğu kaybettim. Bu kez babasının gözü önünde oğlunu kaybettik. Ama istinaf var; her zaman bir sonraki kapı vardır.
~ Avucumda Meral’in iğnesi. Ona geri vermeyi unuttum. Masamın köşesine koydum; bir çerçevenin olacağı yere.
`),
      ],
    }),
    outcome('NITELIK', {
      class: 'RECHARACTERIZED',
      priority: 7,
      when: { all: [] },
      stamp: 'FARKLI NİTELENDİRME',
      stampTone: 'amber',
      sentence: '25 yıl hapis',
      verdictText: `Sanık Emir Yalçın’ın eyleminde tasarlama unsuru oluşmadığından TCK 82/1-a’nın uygulanmasına yer olmadığına; eylemin TCK 81/1 kapsamında kaldığına; MÜEBBET HAPİS; duruşmadaki tutum ve davranışları gözetilerek TCK 62/1 ile 25 YIL HAPİS cezasıyla cezalandırılmasına; TCK 53; TCK 63 mahsup; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because(
          'Mesajın tamamı, bileği taşının alınış nedeni ve sanığın iş yerinde kalış nedeni birlikte değerlendirildiğinde tasarlama sabit değildir; mahkeme iddianamedeki vasıfla bağlı değildir (CMK 225/2).',
        ),
        because(
          'Tanık beyanı, bıçağın sanığa ait olması ve sanığın o gece maktulle tartıştığına ilişkin kendi beyanı birlikte değerlendirilerek eylemin sanık tarafından gerçekleştirildiği kanaatine varılmıştır.',
          not(ref('tanik_coktu')),
        ),
        because(
          'Cumhuriyet savcısının beraat yönündeki mütalaasına itibar edilmemiştir. Tanığın saatleri kayıtlarla çelişse de sanığın o gece ofiste maktulle tartıştığı kendi beyanıyla sabittir; ölüm aleti sanığa aittir.',
          all(ref('tanik_coktu'), mutalaaBeraat),
        ),
        because(
          'Tanığın saatlere ilişkin beyanları kayıtlarla çelişse de sanığın o gece ofiste maktulle tartıştığı kendi beyanıyla sabittir; ölüm aleti sanığa aittir.',
          all(ref('tanik_coktu'), not(mutalaaBeraat)),
        ),
        because(
          'Cumhuriyet savcısının TCK 81/1 yönündeki mütalaası doğrultusunda eylem kasten öldürme olarak nitelendirilmiştir; savunmanın son delil talepleri CMK 206 uyarınca reddedilmiştir.',
          flag('cokus'),
        ),
        aramaGerekce,
        because(
          'Haksız tahrik hükümlerinin uygulanmasını gerektirecek bir haksız fiil dosyada ileri sürülüp ispatlanmamıştır.',
          not(flag('fact_itiraf')),
        ),
        because(
          'Maktulün o gece bir açıklama yaptığı anlaşılmakla birlikte savunma bunun yarattığı hiddeti dayanaklarıyla ortaya koymamış; haksız tahrik indirimi uygulanmamıştır.',
          flag('fact_itiraf'),
        ),
        karsiOy,
      ],
      legalBasis: 'TCK 81/1, 62/1, 53, 63; CMK 225/2, 273/1',
      xp: xp(0.7, { ethicsVar: 'ethics' }),
      howToReach:
        'Tasarlamanın ayaklarını kâğıtlarla kes; ama baş tanığın anlatımını çökertemez ve haksız tahrik dayanağını kuramazsan heyet tasarlamayı düşürür, fiili sanığa yükler.',
      epilogue: [
        O(`
baskan: Sanığın cezalandırılmasına…
`),
        ...tutukluluk,
        O(`
> “Yirmi beş yıl.” Emir rakamı duydu; bir an anlamadı. Ağırlaştırılmış değildi. Müebbet değildi. Yirmi beş yıldı.
~ Tasarlama düştü. Bir kâğıt bir kelimeyi sildi; bir ömrün yerine yirmi beş yıl yazıldı. Yirmi iki yaşında bir çocuk için bu fark, kırk yedi ile ömür arasındaki fark.
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Koridorda yağmur kokusu vardı; biri şemsiyesini kapının yanına bırakmıştı, mermerde küçük bir göl.
> Meral iğnesini parmaklarının arasında çeviriyordu. Bana döndü.
`),
        W(
          flag('released'),
          `
meral: Üç hafta evdeydi. Üç hafta. Her sabah ütülü gömleğini giydi, imzaya gitti. Bir daha ütüleyecek miyim?
`,
        ),
        W(
          not(flag('released')),
          `
meral: Dört aydır her pazartesi bir gömlek ütülüyorum. Yirmi beş yıl… Kaç gömlek eder avukat hanım?
`,
        ),
        O(`
> Cevap vermedim. Kemal karısının omzuna dokundu; ilk kez. İğne durdu.
kemal: İstinaf var dediniz. Gidin. Bu kez ben de gelirim; salonun arkasında değil, önünde otururum.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla masasındaki çerçeveyi aldı; çevirmeden çekmeceye koydu. Çekmeceyi kapatmadı.
leyla: Tasarlamayı düşürdün. Bunu az insan yapar. Ama fiili düşüremedin; o kapı açık kaldı.
leyla: İstinafta bir kâğıt daha getireceksin. Bir ses, bir imza, bir gömlek. Hangisi eksikse.
~ Mudanya’da yağmur dinmedi. Bir neonun I harfi hâlâ yanmıyor; bir dosyada bir ad hâlâ okunmamış.
`),
      ],
    }),
  ],
};
