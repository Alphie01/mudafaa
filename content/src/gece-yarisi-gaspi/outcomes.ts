import { all, any, because, cmp, finalAtLeast, flag, has, not, outcome, ref, v, xp } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { O, W } from './dsl.js';

// 70-outcomes: sonuçlar (öncelik sırasıyla) ve sonuca bağlı epiloglar. Eşikler meta’daki eşik çubuğuyla aynı.

export const T_INDIRIM = 3000;
export const T_BERAAT = 9000;
export const T_BERAAT_B = 10000;

const tutukluluk =
  'tutukluluk hâlinin devamına (ikinci celseden önce adli kontrolle tahliye edilmişse, hükmolunan cezanın miktarı gözetilerek hükümle birlikte tutuklanmasına, CMK 100–101)';

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
        'Mahkemece, sanık müdafiinin duruşma dışında mağdura fotoğraf göstererek teşhis yaptırmaya çalıştığının anlaşılması üzerine durumun Bursa Barosu Başkanlığına ve Bursa Cumhuriyet Başsavcılığına bildirilmesine; mağdurun bundan sonraki teşhise ilişkin beyanlarının değerlendirmede dikkate alınmamasına; sanığın müdafiini azletmesi nedeniyle duruşmanın yeni müdafiin katılımıyla devamına karar verildi.',
      reasoning: [
        because('Müdafi, kolluğun teşhisi kirleten tek fotoğraf gösterimini savunma eliyle tekrarlamıştır.'),
        because('Sanık, vekâlet ilişkisini tek taraflı olarak sona erdirmiştir (TBK 512/1).'),
        because('Dava, başka bir müdafiin katılımıyla devam edecektir; senin dosyan burada kapandı.'),
      ],
      legalBasis: 'Av.K. 34; TCK 277; TBK 512/1; PVSK ek md. 6',
      xp: 0,
      howToReach: 'Mağdura hiçbir koşulda fotoğraf gösterme; başka bir kişinin fail olabileceğini savcılığa yaz (CMK 158).',
      ethicsCard:
        'Tanıklık eden mağdura duruşma dışında bir fotoğraf göstererek teşhis yaptırmaya çalıştın. Bu, tanığı etkileme girişimidir (TCK 277) ve avukatın özen ve doğruluk yükümlülüğüne aykırıdır (Av.K. 34). Kirlenmiş bir hafıza, ikinci bir fotoğrafla temizlenmez.',
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
      when: all(
        not(flag('cokus')),
        flag('tolga_teslim'),
        ref('teshis_coktu'),
        any(has('ded_baskasi'), has('ded_hesap')),
        any(has('ded_mazeret'), has('ded_evde')),
        cmp(v('pers'), '>=', 8),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık Barış Kılınç’ın üzerine atılı nitelikli yağma suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; başka suçtan tutuklu değilse derhâl TAHLİYESİNE, hakkındaki adli kontrol tedbirinin kaldırılmasına; CMK 141/1-e uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 ile 6384 sayılı Kanuna göre yapılabileceğinin bildirilmesine (CMK 231/3); mağdura ait köstekli saatin mağdura iadesine; karar ve dosya örneklerinin Tolga Kılınç hakkındaki soruşturmaya ve teşhis işlemine ilişkin suç duyurusuna eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Mağdurun teşhisi, kolluk görevlisinin teşhisten önce acil serviste tek fotoğraf göstermesi nedeniyle kanuni güvencelerden yoksundur ve hükme esas alınamaz (PVSK ek md. 6; CMK 217).',
        ),
        because('Sanık, olay saatinde Yıldırım’daki evindedir; bu husus bağımsız tanık beyanı, kesinti kaydı ve telefon kaydıyla doğrulanmıştır.'),
        because(
          'Sanık adına açılmış kurye hesabı olay gecesi başka bir cihazdan, sol kulağında halka bulunan bir kişi tarafından kullanılmıştır; bu tarif mağdurun ilk beyanıyla örtüşmektedir.',
        ),
        because('Tolga Kılınç olayı ikrar etmiş; mağdura ait köstekli saat onun odasında ele geçirilmiştir.'),
        because('Deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141/1-e, 142, 231/3; PVSK ek md. 6; CMK 217',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Teşhisin kirlendiğini kanıtla, mazereti kayda bağla, hesabı kimin taşıdığını göster ve bilgiyi savcılığa yaz; aileye ne yapacağını değil, ne yapabileceğini söyle.',
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
      when: all(not(flag('cokus')), cmp(v('pers'), '>=', 6), ref('teshis_coktu'), ref('lehe2'), finalAtLeast(T_BERAAT)),
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
          'Mağdurun kirlenmeden önceki ilk tarifinde failin sol kulağında halka bulunduğu belirtilmiş; sanığın kulaklarında delik ya da iz bulunmamaktadır.',
          any(has('ded_halka'), flag('contra_n5')),
        ),
        because('Sanığın olay saatinde evinde olduğu tanık beyanı ve kesinti kaydıyla desteklenmiştir.', has('ded_mazeret')),
        because('Sanığın telefonu olay saatinden iki dakika önce evinin bulunduğu bölgeden elektrik arıza hattını aramıştır.', has('ded_evde')),
        because(
          'Sanık adına açılmış kurye hesabı olay gecesi sanığa ait olmayan bir cihazdan açılmıştır; konum kaydı hesabın yerini gösterir, sanığın yerini göstermez.',
          any(has('ded_hesap'), has('ded_baskasi')),
        ),
        because('İddia edilen bıçak bulunamamış, mağdurun ilk beyanında yer almamıştır.', any(has('ded_bicak'), flag('contra_n2'))),
        because('Acil servis hemşiresi, teşhisten önce mağdura telefondan tek fotoğraf gösterildiğini duruşmada doğrulamıştır.', flag('gamze_dinlendi')),
        because('Sanığın suçu işlediğine dair kesin ve inandırıcı delil bulunmamaktadır; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).'),
      ],
      legalBasis: 'CMK 223/2-e; CMK 141/1-e, 142, 231/3; PVSK ek md. 6; CMK 217; Anayasa 38/4; AİHS 6/2',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach: 'Teşhisin kirlendiğini göster; mazeret ya da hesabın başkasınca kullanıldığı gibi en az iki bağımsız lehe bulgu kur.',
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
> Barış iki haftadır dışarıdaydı ama bugün başka türlü çıktı. İmza defteri yok, karakol yok. Kapıdan geçerken omuzlarını düzeltti.
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
> Cevabını biliyordum. Kanıtlayamamıştım. Bu ikisi aynı şey değil.
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
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Fişleri, dökümleri, tutanakları dosyaya kaldırdım. Panodaki kırmızı ipi çözdüm. Ortadaki boşluk hâlâ boştu.
~ Bir yüzü sildik. Yerine bir soru bıraktık. Bazen adalet bir kapıyı açar ama ışığı yakmaz.
~ Barış eve gitti. Bir kadının saati hâlâ bir yerlerde, bir çorabın içinde, bir çekmecede. Bunu bilmek, bu gece bana kalan şey.
`),
      ],
    }),
    outcome('INDIRIM', {
      class: 'REDUCED',
      priority: 4,
      when: all(not(flag('cokus')), flag('closing_terdit'), flag('arg_silah'), finalAtLeast(T_INDIRIM)),
      stamp: 'İNDİRİM',
      stampTone: 'amber',
      sentence: '8 yıl 4 ay hapis',
      verdictText: `Sanık Barış Kılınç’ın cezalandırılmasına: silah unsuru ispatlanamadığından TCK 149/1-a’nın uygulanmasına yer olmadığına; eylemin gece vaktinde işlenmesi nedeniyle TCK 149/1-h uyarınca takdiren alt sınırdan 10 YIL; sanığın geçmişi ve cezanın geleceği üzerindeki olası etkileri gözetilerek TCK 62/1 ile 8 YIL 4 AY HAPİS; TCK 53; TCK 63 mahsup; cezanın süresi nedeniyle hükmün açıklanmasının geri bırakılması (CMK 231/5) ve erteleme (TCK 51/1) koşulları bulunmadığına; ${tutukluluk}; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because('Mağdurun ilk beyanında bıçaktan söz edilmemiş, bıçak ele geçirilmemiştir; silah unsuru ispatlanamamıştır.'),
        because('Eylem gece vaktinde işlendiğinden TCK 149/1-h uygulanmıştır.'),
        because('Savunmanın terditli talebi doğrultusunda temel ceza alt sınırdan belirlenmiş ve TCK 62/1 uygulanmıştır.'),
        because(
          'Mağdurun teşhisi ve sanık adına açılmış hesabın konum kaydı birlikte değerlendirilmiştir; savunmanın teşhise yönelik itirazları heyeti beraate götürecek ölçüde güçlü bulunmamıştır.',
        ),
      ],
      legalBasis: 'TCK 149/1-h, 61, 62/1, 53, 63; CMK 231/5; TCK 51/1; CMK 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach: 'Esas savunmada terditli talepte bulun ve silah unsurunun ispatlanmadığını delille göster (112 dökümü + cam kırığı).',
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
          flag('fact_tolga'),
          `
> Derya, Tolga’dan söz etmedi. Ben de etmedim. İkimiz de bir ismin, bir arabanın camına çarpıp geri döndüğünü biliyorduk.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
~ Bıçak yoktu. Bunu kanıtladım. Bıçağın olmadığı bir hapishanede sekiz yıl dört ay.
~ Terazinin bir kefesine “yapmadı”, öbürüne “yaptıysa da bıçaksız” koydum. Heyet ikinci kefeyi tuttu. Ben ikisini birden tutmak zorundaydım.
`),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 5,
      when: { all: [] },
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      sentence: '10 yıl hapis',
      verdictText: `Sanık Barış Kılınç’ın üzerine atılı nitelikli yağma suçundan, eylemin silahla ve gece vaktinde işlendiği kabul edilerek TCK 149/1-a, h uyarınca iki nitelikli hâlin birlikte gerçekleşmesi gözetilerek alt sınırdan uzaklaşılarak 12 YIL; TCK 62/1 ile 10 YIL HAPİS cezası ile cezalandırılmasına; TCK 53; TCK 63 mahsup; ${tutukluluk}; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi (CMK 273/1).`,
      reasoning: [
        because('Mağdurun teşhisi, sanık adına açılmış hesabın konum kaydı ve sanığın bölgede kurye olarak çalışması birlikte değerlendirilmiştir.'),
        because('Savunmanın teşhise ve kayıtlara yönelik itirazları somut delillerle desteklenmemiştir.', not(flag('cokus'))),
        because('Savunmanın inandırıcılığı duruşmada çöktü; heyet iddianamedeki anlatımı esas aldı.', flag('cokus')),
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
        'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir. Yanlış delil ve dayanaksız itiraz güvenilirliği eritir; teşhisi çürütmeden ve mazereti kayda bağlamadan beraat gelmez.',
      epilogue: [
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
> “On yıl.” Kelime koridora benden önce çıktı. Sevim Hanım’ın tespihi koptu; taneler mermer zeminde yuvarlandı, banklarının altına, kapıların eşiğine.
> Eğildim. Topladım. Bir, iki, otuz üç. Birini bulamadım.
> Derya annesinin koluna girmişti. Bana bakmadı. Merdivenin başında durdu; geri döndü.
derya: Salonun kirası. İki koltuk. Bir de kardeşim. Hepsi gitti canım.
> Nermin Hanım öbür uçta, kızının yanında oturuyordu. Kalkmadı. Sevinmiyordu. Saatini kimse geri getirmemişti.
`),
        W(
          flag('fact_tolga'),
          `
> Tolga hakkında bir dilekçe yazacağım. Savcılığa. Bunu ikinci celseden önce yapmalıydım. Şimdi bir istinaf dilekçesine bir ek olacak.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Avucumda bir tespih tanesi. Otuz üçüncüsü yoktu; bu otuz dördüncüydü belki, ya da birinciydi. Masama koydum.
~ Bir fotoğraf bir hafızayı kirletti. Ben o kiri temizleyemedim. Kimse “yalan” demedi; herkes “eminim” dedi.
~ İstinaf var. Her zaman bir sonraki kapı vardır. Ama bu gece kapıların hepsi kapalı.
`),
      ],
    }),
  ],
};
