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
import type { CasePart, Cond, ResponseBlock } from '../../../tools/content/src/kit/index.js';
import { O, W } from './dsl.js';

// 70-outcomes: sonuçlar (öncelik sırasıyla) ve sonuca bağlı epiloglar.
// Hüküm delile bağlıdır, skora değil: gerçek failin ikrarı ve saatin ele geçirilmesi (tolga_teslim; kayıtlara
// bağlı bildirim + ailenin kendi kararı) 223/2-b'ye; tam delil zinciri (teşhis çöktü + konum kaydı cevaplandı +
// bağımsız mazeret) ile savcının beraat mütalaası ya da heyetin ikna düzeyi 223/2-e'ye götürür. Skor yalnızca XP'yi
// ve indirim sınırını belirler. Silah unsuru duruşmada çürütüldüyse mahkûmiyet yalnızca 149/1-h üzerinden kurulur.

export const T_INDIRIM = 3000;
// Beraat için skor eşiği yoktur: beraat delille gelir (eşik çubuğunda bu yüzden yalnızca indirim sınırı var).

/** Silah unsurunun duruşmada çürütüldüğü (kayda geçtiği) durum. */
const silahDustu: Cond = any(flag('contra_n2'), flag('contra_f4'), flag('arg_silah'));
/**
 * 223/2-e: delil zinciri tam (teşhis çöktü + konum kaydı cevaplandı + bağımsız mazeret) ve ya savcı mütalaada
 * beraat istedi (mutalaa_b, T_05'te kaydedilir) ya da esas savunmadan sonra heyetin ikna düzeyi en az 6.
 * Savcının beraat istediği dosyada mahkûmiyet/indirim kurulmaz.
 */
const beraatDosyasi: Cond = all(
  not(flag('cokus')),
  any(flag('mutalaa_b'), all(ref('beraat_delil'), cmp(v('pers'), '>=', 6), ref('derin'))),
);
/** Delil zinciri tam ama kayıtlar duruşmada derinlemesine tartışılmadı: mahkûmiyet değil, bilirkişi ve erteleme. */
const ertelemeDosyasi: Cond = all(
  not(flag('cokus')),
  not(flag('tolga_teslim')),
  not(beraatDosyasi),
  ref('beraat_delil'),
  cmp(v('pers'), '>=', 6),
);
/** Tanık yönlendirme (Kadir Usta ya da bakkal). */
const kocluk: Cond = any(flag('kadir_kocluk'), flag('ali_kocluk'));

const tutukluluk =
  'tutukluluk hâlinin devamına (ikinci celseden önce adli kontrolle tahliye edilmişse, hükmolunan cezanın miktarı gözetilerek hükümle birlikte tutuklanmasına, CMK 100–101)';

/** Tanık yönlendirmenin beraat epiloglarındaki izi. */
const koclukEpilog: ResponseBlock = W(
  kocluk,
  `
> Kapıdan çıkarken Leyla döndü. Sesi alçaktı; koridorda kimse duymasın diye değil, ben unutmayayım diye.
leyla: Bir şey daha. Bir tanığa söyleyeceği cümleyi verdin. Bugün beraat geldi; o cümle gelmedi diye değil, gelmesine rağmen.
leyla: Savcı Başsavcılığa bir yazı yazacak. Cevabını sen yazacaksın; ben okumayacağım. Okumam gerekmesin diye.
~ Bir beraat, bir avukatın yaptığı her şeyi temize çıkarmaz. Heyet Barış’ı aklar; beni aklayacak bir heyet yok.
`,
);

/** Mahkûmiyet epilogu: hükmün süresi çağrıda verilir. */
const mahkumiyetEpilog = (sure: string, sureKucuk: string): ResponseBlock[] => [
  W(
    flag('cokus'),
    `
# SALON · HÜKÜMDEN SONRA [bg:durusma_salonu]
> Salon boşaldı. Jandarma Barış’ı götürdü. Sevim Hanım’ı biri koluna girip dışarı çıkardı.
> Masamda oturuyordum. Notlarım önümde. Hiçbirine bakmamıştım; hiçbiri işe yaramamıştı.
> Savcı Orhan Bayar dosyasını topladı. Kapıya giderken durdu, bana döndü.
orhan: Hafızayla değil, kâğıtla gelmeliydiniz avukat hanım. Bu dosyada kâğıtlar vardı.
> Kapı arkasından kapandı. Radyatör tıkırdadı. Başka ses yoktu.
`,
  ),
  O(`
# ADLİYE KORİDORU · HÜKÜMDEN SONRA [bg:adliye]
> “${sure}.” Kelime koridora benden önce çıktı. Sevim Hanım’ın tespihi koptu; taneler mermer zeminde yuvarlandı, bankların altına, kapıların eşiğine.
> Eğildim. Topladım. Bir, iki, otuz üç. Birini bulamadım.
> Derya annesinin koluna girmişti. Bana bakmadı. Merdivenin başında durdu; geri döndü.
derya: Salonun kirası. İki koltuk. Bir de kardeşim. Hepsi gitti canım.
> Nermin Hanım öbür uçta, kızının yanında oturuyordu. Kalkmadı. Sevinmiyordu. Saatini kimse geri getirmemişti.
`),
  W(
    all(flag('fact_tolga'), not(flag('bildirdi'))),
    `
> Tolga hakkında bir dilekçe yazacağım. Savcılığa. Bunu ikinci celseden önce yapmalıydım. Şimdi bir istinaf dilekçesine bir ek olacak.
`,
  ),
  W(
    all(flag('bildirdi'), not(flag('tolga_kacti'))),
    `
> Tolga hakkındaki bildirimim savcının masasında; bir dosya numarası aldı, bir ifade tarihi almadı. Kâğıt yolunu yürüyor. Barış o yolun sonunu cezaevinden bekleyecek.
`,
  ),
  W(
    flag('tolga_kacti'),
    `
> Tolga’nın odası hâlâ boş. Benim çaldığım kapıdan çıkan adam, artık bir yakalama kararının adı.
`,
  ),
  O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Avucumda bir tespih tanesi. Otuz üçüncüsü yoktu; bu otuz dördüncüydü belki, ya da birinciydi. Masama koydum.
~ Bir fotoğraf bir hafızayı kirletti. Ben o kiri temizleyemedim. Kimse “yalan” demedi; herkes “eminim” dedi.
~ İstinaf var. Her zaman bir sonraki kapı vardır. Ama bu gece kapıların hepsi kapalı. ${sureKucuk}; bir takvimin bütün sayfaları.
`),
];

const mahkumiyetGerekce = [
  because(
    'Mağdurun teşhisi, sanık adına açılmış hesabın konum kaydı ve sanığın bölgede kurye olarak çalışması birlikte değerlendirilmiştir.',
    not(ref('teshis_coktu')),
  ),
  because(
    'Teşhis işlemindeki usulsüzlük nedeniyle mağdurun teşhisi hükme esas alınmamıştır; ancak sanık adına açılmış kurye hesabının olay anında olay yerinde bulunduğuna ilişkin konum kaydı duruşmada cevapsız kalmıştır.',
    all(ref('teshis_coktu'), not(ref('hesap_kayitta'))),
  ),
  because(
    'Teşhis hükme esas alınmamış, hesabın o gece başka bir cihazdan açıldığı duruşmada ortaya konmuştur; ancak sanığın olay saatinde başka bir yerde bulunduğu kayıtla gösterilmemiş, sanığın hesabını kullandıran kişiyle birlikte hareket ettiği ihtimali giderilememiştir.',
    all(ref('teshis_coktu'), ref('hesap_kayitta'), not(ref('mazeret_kayitta'))),
  ),
  because(
    'Savunma, hesabın olay gecesi başka bir kişi ya da cihaz tarafından kullanıldığını duruşmada delille ortaya koymamıştır.',
    all(not(flag('cokus')), not(ref('hesap_kayitta'))),
  ),
  because(
    'Sanığın olay saatinde evinde olduğuna ilişkin savunması, duruşmada aile beyanı dışında bağımsız bir kayıtla desteklenmemiştir.',
    all(not(flag('cokus')), not(ref('mazeret_kayitta'))),
  ),
  because(
    'Savunmanın duruşmada ortaya koyduğu bulgular, iddianamedeki anlatımı bütünüyle sarsacak kapsamda değildir; dosyadaki diğer çelişkiler tartışılmamıştır.',
    all(not(flag('cokus')), ref('teshis_coktu'), ref('hesap_kayitta'), ref('mazeret_kayitta')),
  ),
  because(
    'Yakın komşu tanığın saate ilişkin beyanı, müdafiin tanığa saat söylediğinin anlaşılması nedeniyle hükme esas alınmamıştır.',
    flag('kadir_ifsa'),
  ),
  because(
    'Olay yeri tanığı bakkalın müdafi tarafından yönlendirildiğine ilişkin beyanı tutanağa geçmiş ve Başsavcılığa bildirilmiştir.',
    flag('ali_ifsa'),
  ),
  because('Savunmanın inandırıcılığı duruşmada çöktü; heyet iddianamedeki anlatımı esas aldı.', flag('cokus')),
];

export const outcomes: CasePart = {
  outcomes: [
    outcome('AZIL', {
      class: 'OTHER',
      priority: 1,
      when: flag('etik_kirlik'),
      stamp: 'AZİL',
      stampTone: 'red',
      sentence: 'Vekâlet sona erdi · dava sürüyor',
      verdictText:
        'Mahkemece, sanık müdafiinin duruşma dışında mağdura fotoğraf göstererek teşhis yaptırmaya çalıştığının anlaşılması üzerine durumun tutanağa geçirilmesine ve Bursa Barosu Başkanlığı ile Bursa Cumhuriyet Başsavcılığına bildirilmesine; sanığın müdafiini azletmesi nedeniyle duruşmanın yeni müdafiin katılımıyla devamına karar verildi.',
      reasoning: [
        because('Müdafi, kolluğun teşhisi kirleten tek fotoğraf gösterimini savunma eliyle tekrarlamıştır.'),
        because('Sanık, vekâlet ilişkisini tek taraflı olarak sona erdirmiştir (TBK 512/1).'),
        because('Mağdurun beyanlarının ne ölçüde değerlendirileceği hükümde, delillerin bütünü içinde takdir edilecektir (CMK 217).'),
        because('Dava, başka bir müdafiin katılımıyla devam edecektir; senin dosyan burada kapandı.'),
      ],
      legalBasis: 'Av.K. 34; TCK 277; TBK 512/1; PVSK ek md. 6; CMK 217',
      xp: 0,
      howToReach:
        'Mağdura hiçbir koşulda fotoğraf gösterme; başka bir kişinin fail olabileceğini savcılığa yaz (CMK 158).',
      ethicsCard:
        'Tanıklık eden mağdura duruşma dışında bir fotoğraf göstererek teşhis yaptırmaya çalıştın. Bu, avukatın özen ve doğruluk yükümlülüğüne aykırıdır (Av.K. 34) ve tanığı etkileme girişimi olarak soruşturulabilir (TCK 277). Kirlenmiş bir hafıza, ikinci bir fotoğrafla temizlenmez.',
      epilogue: [
        O(`
# ADLİYE KORİDORU · ÖĞLEDEN ÖNCE [bg:adliye]
> Azilnameyi katlayıp cüzdanıma koydum; neden bilmiyorum. Bir makbuz gibi.
> Koridorun öbür ucunda Nermin Hanım kızının koluna girmiş, çıkışa yürüyordu. Bir an durdu. Bana döndü.
nermin: Neden herkes bana bir fotoğraf gösteriyor evladım? Sen de mi?
> Cevap vermedim. Vermeye hakkım yoktu. Kadın yürüdü; bir daha dönmedi.
> Merdivenlerde Derya, Sevim Hanım’ın koluna girmişti. Barış önlerinden iniyordu; başı dik, gözleri hiçbir yere bakmayarak.
# ARSLAN HUKUK · AKŞAM [bg:buro_gece]
> Masamda ince bir kitapçık: “Avukatlık Meslek Kuralları.” Leyla bırakmıştı. Not yoktu. Not gerekmiyordu.
> Leyla’nın odasının kapısı kapalıydı. Işığı yanıyordu. Kapıyı çalmadım.
~ Bu dosyanın bütün hikâyesi bir polisin bir telefon ekranını bir kadının yüzüne tutmasıydı. Ben o hikâyeyi çözmeye gelmiştim.
~ Sonunda aynı ekranı, aynı yüze, kendi elimle tuttum. Daha iyi bir niyetle. Niyet bir hafızayı temizlemez; bir avukatı da.
`),
        W(
          flag('tolga_kacti'),
          `
> Tolga hâlâ bulunamadı. Barış’ın yeni avukatı bir dilekçe yazmış; savcılık kayıtları istemiş. Doğru yol. Benim gitmediğim yol.
`,
        ),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: flag('tolga_teslim'),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık Barış Kılınç’ın üzerine atılı nitelikli yağma suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; başka suçtan tutuklu değilse derhâl TAHLİYESİNE, hakkındaki adli kontrol tedbirinin kaldırılmasına; CMK 141/1-e uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 ile 6384 sayılı Kanuna göre yapılabileceğinin bildirilmesine (CMK 231/3); mağdura ait köstekli saatin mağdura iadesine; karar ve dosya örneklerinin Tolga Kılınç hakkındaki soruşturmaya ve teşhis işlemine ilişkin suç duyurusuna eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Tolga Kılınç, Başsavcılıkta müdafii huzurunda olayı ikrar etmiş; mağdura ait köstekli saat onun odasında ele geçirilmiştir.',
        ),
        because(
          'Tolga Kılınç, sanık adına açılmış kurye hesabını olay gecesi kendi telefonundan kendisinin kullandığını beyan etmiştir; konum kaydı bu kullanımı gösterir.',
        ),
        because(
          'Hesabın o gece başka bir cihazdan açıldığı ve doğrulama özçekimindeki kişinin sol kulağında halka bulunduğu, ikrardan bağımsız olarak dosyaya girmiştir.',
          ref('hesap_curudu'),
        ),
        because(
          'Mağdurun teşhisi, kolluk görevlisinin teşhisten önce acil serviste tek fotoğraf göstermesi nedeniyle kanuni güvencelerden yoksundur ve hükme esas alınamaz (PVSK ek md. 6; CMK 217).',
          ref('teshis_coktu'),
        ),
        because(
          'Sanığın olay saatinde Yıldırım’daki evinde olduğu bağımsız kayıtlarla da doğrulanmıştır.',
          ref('mazeret_var'),
        ),
        because(
          'Müdafiin duruşmadaki dağınık sunumları, Başsavcılıkça toplanan delillerin açıklığını değiştirmemiştir.',
          flag('cokus'),
        ),
        because('Deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141/1-e, 142, 231/3; PVSK ek md. 6; CMK 217',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Hesabı kimin taşıdığını kayıtlarla göster ve bunu savcılığa yaz (CMK 158); aileye ne yapacağını değil, ne yapabileceğini söyle. Kovalamak avukatın işi değildir.',
      epilogue: [
        O(`
rahmi: Türk Milleti adına…
> “İşlemediği sabit olduğundan… beraatine.” Barış kelimeleri duydu. Bir an anlamadı. Sonra kürsünün kenarına tutundu ve gözlerini kapadı.
> Sevim Hanım ayağa kalktı. Tespih elinden kaydı, yere düştü, taneleri dağılmadı. Derya tespihi yerden aldı ve annesinin avucuna kapattı.
# ADLİYE ÖNÜ · ÖĞLEDEN SONRA [bg:sokak_sabah]
> Dışarıda yağmur dinmişti. İlk kez. Adliyenin merdivenleri ıslak parlıyordu; Uludağ’ın üstünde bulutlar yırtılmış, arasından soluk bir güneş.
> Nermin Hanım merdivenin başında bekliyordu. Elinde köstekli bir saat; camı çizik, zinciri yeni silinmiş. Barış’ı görünce bir adım attı. Sonra bir adım daha.
nermin/uzgun: Evladım… Ben seni… Ben o fotoğrafı…
baris: Biliyorum teyze. Siz yalan söylemediniz. Size yalan gösterdiler.
> Nermin Hanım saati avucunda sıktı. Sonra Barış’ın elini tuttu; kısa, sert, bir hasta bakıcının eli gibi.
nermin: İsmail’in saati. On iki yıl. Bir daha merdivenden inerken türkü söyleyemem herhalde. Ama saat… saat eve geldi.
`),
        W(
          flag('derya_konustu'),
          `
> Derya merdivenin dibinde, bir sigarayı yakmadan parmaklarında çeviriyordu. Yanıma geldi.
derya: Tolga’yı ziyarete gideceğim. Cezaevine. Camın arkasından. Barış da gelecek; daha bilmiyor ama gelecek.
derya: Bir aileyi kurtarmak için öbürünü yakmamak… Olmadı canım. Bir aileyi kurtarmak için öbürünün gerçeğini söylemek gerekiyormuş.
`,
        ),
        O(`
# ARSLAN HUKUK · AKŞAM [bg:buro_gece]
> Leyla kapımda durdu. Elinde iki bardak çay. Birini masama bıraktı; bunu hiç yapmazdı.
leyla: Bugün kimseyi yenmedin.
- Yenmedim.
leyla: İyi.
`),
        koclukEpilog,
        O(`
> Odasına döndü. Masasının köşesindeki ters çerçeveye bir an baktı; elini uzattı, sonra çekti.
leyla: Bir gün sana bir dosyadan bahsedeceğim Deniz. Bugün değil.
# SON
> Tolga Kılınç hakkında yağma suçundan dava açıldı. Kolluk görevlisi Ferhat Oral hakkında idari soruşturma başlatıldı. Mağdur, usulüne uygun yapılan teşhiste kimseyi göstermedi: “Bilmiyorum” dedi.
> Delil bir yüz değildi. Bir kayıttı, bir halkaydı, bir kesintiydi. Ve bir ablanın sesi.
`),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      when: beraatDosyasi,
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık Barış Kılınç’ın üzerine atılı nitelikli yağma suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; başka suçtan tutuklu değilse derhâl TAHLİYESİNE, hakkındaki adli kontrol tedbirinin kaldırılmasına; CMK 141/1-e uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 ile 6384 sayılı Kanuna göre yapılabileceğinin bildirilmesine (CMK 231/3); kurye hesabını olay gecesi kullanan kişi ve teşhis işlemi yönünden suç duyurusunda bulunulmasına; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Mağdurun teşhisi, teşhisten önce acil serviste tek fotoğraf gösterilmesi ve tutanağın kanuni güvencelerden yoksun olması nedeniyle hükme esas alınamamıştır (PVSK ek md. 6; CMK 217).',
          any(flag('contra_n3'), flag('contra_f2')),
        ),
        because(
          'Teşhis tutanağı, tarifin teşhisten sonra alındığını ve sanığın fotoğrafının diğerlerinden farklı olduğunu göstermektedir; teşhis kanuni güvencelerden yoksundur (PVSK ek md. 6).',
          all(not(flag('contra_n3')), not(flag('contra_f2'))),
        ),
        because(
          'Sanık adına açılmış kurye hesabı olay gecesi sanığa ait olmayan bir cihazdan açılmıştır; konum kaydı hesabın yerini gösterir, sanığın yerini göstermez.',
          ref('hesap_curudu'),
        ),
        because(
          'Mağdurun kirlenmeden önceki ilk tarifinde failin sol kulağında halka bulunduğu belirtilmiş; sanığın kulaklarında delik ya da iz bulunmamaktadır.',
          ref('halka_var'),
        ),
        because(
          'Sanığın olay saatinde evinde olduğu tanık beyanı ve kesinti kaydıyla desteklenmiştir.',
          all(has('ded_mazeret'), not(flag('kadir_kocluk'))),
        ),
        because(
          'Sanığın telefonu olay saatinden iki dakika önce evinin bulunduğu bölgeden elektrik arıza hattını aramıştır.',
          has('ded_evde'),
        ),
        because(
          'Kolluk görevlisi, sanığın mazeretine ilişkin hiçbir araştırma yapılmadığını duruşmada kabul etmiştir.',
          flag('contra_f6'),
        ),
        because(
          'Yakın komşu tanığın saate ilişkin beyanı, müdafiin tanığa saat söylediğinin anlaşılması nedeniyle hükme esas alınmamıştır.',
          flag('kadir_ifsa'),
        ),
        because(
          'Olay yeri tanığı bakkalın müdafi tarafından yönlendirildiğine ilişkin beyanı tutanağa geçmiş ve Başsavcılığa bildirilmiştir; bu tanığın bıçağa ilişkin anlatımı değerlendirmeye alınmamıştır.',
          flag('ali_ifsa'),
        ),
        because(
          'İddia edilen bıçak bulunamamış, mağdurun ilk beyanında yer almamıştır.',
          any(has('ded_bicak'), flag('contra_n2')),
        ),
        because(
          'Acil servis hemşiresi, teşhisten önce mağdura telefondan tek fotoğraf gösterildiğini duruşmada doğrulamıştır.',
          flag('gamze_dinlendi'),
        ),
        because(
          'Cumhuriyet savcısı da esas hakkındaki mütalaasında sanığın beraatini talep etmiştir.',
          flag('mutalaa_b'),
        ),
        because(
          'Kolluk tanığı, “onaylı” denen kimlik doğrulama özçekimine ve oturumun açıldığı cihaza hiç bakmadığını duruşmada kabul etmiştir.',
          flag('contra_f7'),
        ),
        because(
          'Sanığın suçu işlediğine dair kesin ve inandırıcı delil bulunmamaktadır; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; CMK 141/1-e, 142, 231/3; PVSK ek md. 6; CMK 217; Anayasa 38/4; AİHS 6/2',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Delil zincirini tamamla: teşhisin kirlendiğini göster, savcının konum kaydını kayıtlarla cevapla (hesap o gece başka bir telefonda ya da başka bir yüzdeydi) ve mazereti bağımsız bir kayda bağla. Duruşmada heyeti ikna et (en az 6).',
      epilogue: [
        O(`
rahmi: Türk Milleti adına…
> “Sabit olmadığından… beraatine.” Barış kelimeleri tek tek duydu; bir yabancı dilden çeviriyormuş gibi. Sonra anladı ve oturdu. Ayakta dinlemesi gerekiyordu; kimse bir şey demedi.
> Sevim Hanım iki elini yüzüne kapadı. Sesi çıkmadı. Omuzları sarsıldı; o kadar.
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
`),
        W(
          flag('released'),
          `
> Barış üç haftadır dışarıdaydı ama bugün başka türlü çıktı. İmza defteri yok, karakol yok. Kapıdan geçerken omuzlarını düzeltti.
`,
        ),
        W(
          not(flag('released')),
          `
> Tahliye müzekkeresi öğleden sonra cezaevine ulaştı. Barış akşam yedide kapıdan çıktı; elinde bir naylon poşet, ayakkabıları bağcıksız. Derya arabada bekliyordu.
`,
        ),
        O(`
> Koridorda iki avukat konuşuyordu; biri ötekine bir şey fısıldadı. Duydum: “Şüpheden yararlandı.”
> Nermin Hanım kızıyla çıkışa yürüdü. Yanımdan geçerken durdu. Bana bakmadı; konuştu.
nermin: Saatimi kim aldı o zaman evladım?
`),
        W(
          flag('bildirdi'),
          `
> Cevabını biliyordum; savcının masasında, ekleriyle, bir dilekçede yazıyordu. Ama bir dilekçe bir kadına saatini geri vermez.
- Savcılık araştırıyor Nermin Hanım. Bu sefer usulüyle.
> Başını salladı. İnanmak istiyordu; inanmaya artık o kadar hevesli değildi.
`,
        ),
        W(
          all(flag('fact_tolga'), not(flag('bildirdi'))),
          `
> Cevabını biliyordum. Kanıtlayamamıştım. Kimseye de yazmamıştım. Bu üçü aynı şey değil.
`,
        ),
        W(
          not(flag('fact_tolga')),
          `
> Cevabını bilmiyordum. Hesabın o gece başka bir telefonda olduğunu biliyordum; o telefonun kimin cebinde olduğunu değil.
- Bilmiyorum Nermin Hanım. Savcılık hesabı kullananı arayacak.
`,
        ),
        O(`
> Kızı annesini kolundan çekti. Nermin Hanım yürüdü; merdivenin başında durdu, aşağı baktı. Adliyenin merdivenleri de taştı, ıslaktı. Basamakları saymadı. Biliyordum; çünkü ben saydım: yirmi iki.
~ Bir kadın bir yüzü geri verdi. Karşılığında hiçbir şey almadı; saatini de, gerçeği de. Bu beraat onun değil.
`),
        W(
          flag('tolga_kacti'),
          `
> Tolga’nın telefonu hâlâ kapalıydı. Demirtaş’taki odası boş. Savcılık bir yakalama kararı istemiş. Benim çaldığım kapıdan çıkan adam, artık bir dosya numarası.
`,
        ),
        W(
          all(flag('fact_tolga'), not(flag('tolga_kacti'))),
          `
> Tolga’nın telefonu kapalıydı. Derya, “Gelecek” diyor. “Bir gün kendisi gelecek.” Belki.
`,
        ),
        koclukEpilog,
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Fişleri, dökümleri, tutanakları dosyaya kaldırdım. Panodaki kırmızı ipi çözdüm. Ortadaki boşluk hâlâ boştu.
~ Bir yüzü sildik. Yerine bir soru bıraktık. Bazen adalet bir kapıyı açar ama ışığı yakmaz.
~ Barış eve gitti. Bir kadının saati hâlâ bir yerlerde, bir çorabın içinde, bir çekmecede. Bunu bilmek, bu gece bana kalan şey.
`),
      ],
    }),
    outcome('ERTELEME', {
      class: 'OTHER',
      priority: 4,
      when: ertelemeDosyasi,
      stamp: 'ERTELEME',
      stampTone: 'amber',
      sentence: 'Hüküm yok · Bilirkişi incelemesi',
      verdictText:
        'Mahkemece; HızlıPaket hesap ve konum kayıtları, telefon inceleme raporu ve UEDAŞ kesinti kaydı üzerinde, kayıtların hangi cihaz ve kişiyle ilişkili olduğu ile olay saatine göre birbirleriyle uyumu konusunda bilirkişi incelemesi yaptırılmasına (CMK 63, 67); delil durumu ve tutuklulukta geçen süre gözetilerek sanığın imza yükümlülüğü şeklinde adli kontrol tedbiri uygulanarak tahliyesine (CMK 109); esas hakkındaki mütalaa için dosyanın Cumhuriyet savcılığına tevdiine ve duruşmanın ertelenmesine karar verildi.',
      reasoning: [
        because('Mağdurun teşhisi, kanuni güvencelerden yoksun yapıldığı duruşmada ortaya konduğundan hükme esas alınamayacak durumdadır (PVSK ek md. 6; CMK 217).'),
        because('Savunma, sanık adına açılmış hesabın olay gecesi başka bir cihazdan ya da başka bir kişi tarafından kullanıldığını ve sanığın olay saatinde evinde olduğunu gösteren kayıtlar sunmuştur.'),
        because('Ancak bu teknik kayıtların birbiriyle ve olay saatiyle ilişkisi duruşmada yeterince tartışılmamış; heyet hükümden önce bilirkişi görüşü alınmasını gerekli görmüştür (CMK 216, 63).'),
        because('Dava sürmektedir. Beraat yakın; ama bugün gelmedi.'),
      ],
      legalBasis: 'CMK 63, 67, 109, 216, 217; PVSK ek md. 6',
      xp: xp(0.5, { ethicsVar: 'ethics' }),
      howToReach:
        'Delil zincirini kurarsın ama kayıtları duruşmada derinlemesine tartışmazsın: belgeleri incele, tanıkları bastır, doğru delili doğru beyana göster. Kâğıt dosyada durmakla konuşmaz.',
      epilogue: [
        O(`
rahmi: Duruşma ertelenmiştir.
> Tokmak bir kez vurdu. Kimse ayağa kalkmadı; ayağa kalkacak bir hüküm yoktu.
> Barış bana döndü. “Abla, bitti mi?” diye sormadı. Gözleri sordu.
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Derya bankta oturuyordu; elinde bir sigara, yakmadan. Sevim Hanım tespihini çekiyordu, ama sayısını tutmadan.
derya: Bilirkişi ne demek canım? Bir ay mı, üç ay mı?
- Bir kişi kayıtları okuyacak. Bizim okuduğumuzu, bir kez daha, mühürle.
derya: Sen okumadın mı?
- Okudum. Mahkemede yeterince okutamadım.
`),
        W(
          not(flag('released')),
          `
> Barış akşam yedide cezaevinin kapısından çıktı; adli kontrolle. Bir imza defteri, bir karakol, bir bekleyiş. Ama dışarıda.
`,
        ),
        W(
          flag('released'),
          `
> Barış eve gitti; imza defteri cebinde. Üç haftadır her sabah karakola gidiyordu. Bir süre daha gidecek.
`,
        ),
        koclukEpilog,
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla dosyayı masama bıraktı. Kenarına kurşun kalemle tek bir kelime yazmıştı: “Tartış.”
leyla: Kâğıtları topladın Deniz. Hepsini. Sonra masaya koydun ve heyetin kendi kendine okumasını bekledin.
leyla: Mahkeme okur; ama ona neyi, hangi sırayla, neden okuması gerektiğini sen söylersin. Duruşma bunun için var.
~ Bir dosya kazanılmadan kaybedilmez. Ama kazanılmadan da beklenebilir; aylarca. Barış bekleyecek. Ben de.
`),
      ],
    }),
    outcome('INDIRIM', {
      class: 'REDUCED',
      priority: 5,
      when: all(
        not(flag('cokus')),
        not(flag('tolga_teslim')),
        not(beraatDosyasi),
        not(ertelemeDosyasi),
        flag('closing_terdit'),
        flag('arg_silah'),
        finalAtLeast(T_INDIRIM),
      ),
      stamp: 'İNDİRİM',
      stampTone: 'amber',
      sentence: '8 yıl 4 ay hapis',
      verdictText: `Sanık Barış Kılınç’ın cezalandırılmasına: silah unsuru ispatlanamadığından TCK 149/1-a’nın uygulanmasına yer olmadığına; eylemin gece vaktinde işlenmesi nedeniyle TCK 149/1-h uyarınca takdiren alt sınırdan 10 YIL; sanığın geçmişi ve cezanın geleceği üzerindeki olası etkileri gözetilerek TCK 62/1 ile 8 YIL 4 AY HAPİS; TCK 53; TCK 63 mahsup; cezanın süresi nedeniyle hükmün açıklanmasının geri bırakılması (CMK 231/5) ve erteleme (TCK 51/1) koşulları bulunmadığına; ${tutukluluk}; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because(
          'Mağdurun ilk beyanında bıçaktan söz edilmemiş, bıçak ele geçirilmemiştir; silah unsuru ispatlanamamıştır.',
        ),
        because('Eylem gece vaktinde işlendiğinden TCK 149/1-h uygulanmıştır.'),
        because(
          'Savunmanın terditli talebi doğrultusunda temel ceza alt sınırdan belirlenmiş ve TCK 62/1 uygulanmıştır.',
        ),
        because(
          'Mağdurun teşhisi ve sanık adına açılmış hesabın konum kaydı birlikte değerlendirilmiştir; savunmanın teşhise yönelik itirazları heyeti beraate götürecek ölçüde güçlü bulunmamıştır.',
          not(ref('teshis_coktu')),
        ),
        because(
          'Teşhis hükme esas alınmamıştır; ancak sanık adına açılmış hesabın olay anında olay yerinde bulunduğuna ilişkin konum kaydı cevapsız kalmıştır.',
          ref('teshis_coktu'),
        ),
      ],
      legalBasis: 'TCK 149/1-h, 61, 62/1, 53, 63; CMK 231/5; TCK 51/1; CMK 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Esas savunmada terditli talepte bulun ve silah unsurunun ispatlanmadığını delille göster (112 dökümü + cam kırığı).',
      epilogue: [
        O(`
rahmi: Sanığın cezalandırılmasına…
> “Sekiz yıl dört ay.” Barış rakamları duydu ve bana döndü. Ne anlama geldiğini soran bir bakış.
~ On yıldan on beş yıla kadar istenen bir davada sekiz yıl dört ay. Bıçak düştü. Hukuken bir kazanım. Bir çocuğun gözünde, sekiz yıl dört ay.
# ADLİYE ARKA KAPISI · RİNG ARACI [bg:adliye]
> Ring aracının arka camı buğuluydu. Barış elini cama koydu. Sevim Hanım dışarıdan elini onun elinin üstüne, camın öbür tarafına koydu.
> Araç hareket etti. Sevim Hanım birkaç adım yürüdü, sonra durdu. Eli havada kaldı.
> Derya bir sigara yaktı. İki nefes çekti, sonra yere atıp ezdi; bitirmeden.
derya: İstinaf var, değil mi canım? Bir yol daha var, değil mi?
- Var.
~ Var. İstinaf bir yoldur. Ama bir yolun sonunda ne olduğunu bilmeden ona “yol” demek, bir umut vermektir.
`),
        W(
          all(flag('fact_tolga'), not(flag('bildirdi'))),
          `
> Derya, Tolga’dan söz etmedi. Ben de etmedim. İkimiz de bir ismin, bir arabanın camına çarpıp geri döndüğünü biliyorduk.
`,
        ),
        W(
          flag('bildirdi'),
          `
> Derya, Tolga’dan söz etmedi. Savcıya yazdığım dilekçe bir dosya numarası almıştı; bir ifade tarihi almamıştı. İstinafa bir ek daha.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
~ Bıçak yoktu. Bunu kanıtladım. Bıçağın olmadığı bir hapishanede sekiz yıl dört ay.
~ Terazinin bir kefesine “yapmadı”, öbürüne “yaptıysa da bıçaksız” koydum. Heyet ikinci kefeyi tuttu. Ben ikisini birden tutmak zorundaydım.
`),
      ],
    }),
    outcome('MAHKUMIYET_H', {
      class: 'CONVICTION',
      priority: 6,
      when: all(not(flag('tolga_teslim')), not(beraatDosyasi), not(ertelemeDosyasi), silahDustu),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      sentence: '9 yıl 2 ay hapis',
      verdictText: `Sanık Barış Kılınç’ın cezalandırılmasına: duruşmada silah unsuru ispatlanamadığından TCK 149/1-a’nın uygulanmasına yer olmadığına; eylemin gece vaktinde işlenmesi nedeniyle TCK 149/1-h uyarınca, mağdurun yaşı ve uğradığı yaralanma gözetilerek (TCK 61/1) alt sınırdan uzaklaşılarak 11 YIL; TCK 62/1 ile 9 YIL 2 AY HAPİS cezası ile cezalandırılmasına; TCK 53; TCK 63 mahsup; ${tutukluluk}; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi (CMK 273/1).`,
      reasoning: [
        ...mahkumiyetGerekce,
        because(
          'Mağdurun ilk beyanında bıçak bulunmadığı ve bıçağın ele geçirilmediği duruşmada ortaya konduğundan silah unsuru uygulanmamıştır; mahkeme suçun hukuki nitelendirmesini resen yapar (CMK 225/2).',
        ),
      ],
      legalBasis: 'TCK 149/1-h, 61/1, 62/1, 53, 63; CMK 225/2, 273/1',
      xp: {
        if: {
          when: flag('cokus'),
          then: xp(0.3, { ethicsVar: 'ethics' }),
          else: xp(0.6, { ethicsVar: 'ethics' }),
        },
      },
      howToReach:
        'Silah unsurunu duruşmada çürütürsün ama teşhisi ve konum kaydını cevapsız bırakırsın; terditli talepte de bulunmazsan heyet temel cezayı alt sınırdan belirlemez.',
      epilogue: mahkumiyetEpilog('Dokuz yıl iki ay', 'Dokuz yıl iki ay'),
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 7,
      // Varsayılan (doğrulayıcı son sonucun koşulsuz olmasını ister). Öncelik sırası nedeniyle yalnızca
      // not(tolga_teslim) ∧ not(beraatDosyasi) ∧ not(ertelemeDosyasi) ∧ not(silahDustu) durumunda seçilir.
      when: { all: [] },
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      sentence: '10 yıl hapis',
      verdictText: `Sanık Barış Kılınç’ın üzerine atılı nitelikli yağma suçundan, eylemin silahla ve gece vaktinde işlendiği kabul edilerek TCK 149/1-a, h uyarınca iki nitelikli hâlin birlikte gerçekleşmesi gözetilerek alt sınırdan uzaklaşılarak 12 YIL; TCK 62/1 ile 10 YIL HAPİS cezası ile cezalandırılmasına; TCK 53; TCK 63 mahsup; ${tutukluluk}; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi (CMK 273/1).`,
      reasoning: [
        ...mahkumiyetGerekce,
        because('Mağdurun kolluk ifadesindeki bıçak beyanı duruşmada çürütülmemiştir.'),
      ],
      legalBasis: 'TCK 149/1-a, h, 61, 62/1, 53, 63; CMK 273/1',
      xp: {
        if: {
          when: flag('cokus'),
          then: xp(0.3, { ethicsVar: 'ethics' }),
          else: xp(0.6, { ethicsVar: 'ethics' }),
        },
      },
      howToReach:
        'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir. Yanlış delil ve dayanaksız itiraz güvenilirliği eritir; teşhisi çürütmeden ve konum kaydını cevaplamadan beraat gelmez.',
      epilogue: mahkumiyetEpilog('On yıl', 'On yıl'),
    }),
  ],
};
