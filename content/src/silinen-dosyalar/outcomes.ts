import { all, any, because, cmp, finalAtLeast, flag, has, not, outcome, ref, v, xp } from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond } from '../../../tools/content/src/kit/index.js';
import { O, W } from './dsl.js';

// 90-outcomes: sonuçlar (öncelik sırasıyla) ve sonuca bağlı epiloglar. Eşikler meta’daki eşik çubuğuyla aynı.
//
// Hüküm mantığı iki ayrı soruya dayanır:
//   1) 243/1 (21.30 girişi): rıza kanıtlandıysa (riza_kanit) hukuka aykırılık unsuru yok → CMK 223/2-a beraat;
//      kanıtlanamadıysa giriş sabittir (sanık kabul ediyor) → mahkûmiyet.
//   2) 244/2 (02.14 silmesi): imaj çöktü + silme sanığın cihazından/hattından değil → 2-e; buna ek olarak silmenin
//      başka birinden çıktığı kürsüde kanıtlandı ve beraat istendi → 2-b. Aksi hâlde mahkûmiyet.
// Çöküş (♥0) bir hüküm değil, müvekkilin vekâleti sona erdirmesidir (ara karar, duruşma ertelenir).

export const T_INDIRIM = 2800;
export const T_BERAAT = 9500;
export const T_BERAAT_B = 10500;

/** Silmenin sanığın cihazından/hattından yapılmadığına dair lehe bulgu. */
const cihazBulgu: Cond = any(
  has('ded_dizustu'),
  has('ded_cihaz'),
  has('ded_gm_cihaz'),
  has('ded_gm_hat'),
  flag('contra_b5'),
  flag('contra_t5'),
  flag('contra_t_cihaz'),
  flag('contra_t_hat'),
);

/** Ara evresinde gelen, mahkemenin kendi kanalından bulgu (bilirkişi, zimmet, operatör, kart). */
const araBulgu: Cond = any(
  flag('sema_dinlendi'),
  has('clue_sema_cihaz'),
  has('ded_gm_cihaz'),
  has('ded_gm_hat'),
  flag('contra_t_oda'),
  flag('contra_t_cihaz'),
  flag('contra_t_hat'),
);

/** 244/2 suçlamasının sanığa bağlanamadığı (imaj güvenilmez + silme başka cihaz/hattan). */
const silmeKoptu: Cond = all(ref('imaj_coktu'), any(cihazBulgu, flag('sema_dinlendi')));

/** Mahkûmiyet hükümlerinde 244/2 gerekçesi: dosyaya giren lehe bulguya göre üç ayrı anlatım. */
const kurulduCihaz: Cond = any(flag('contra_t_cihaz'), flag('contra_t_hat'));
const silmeGerekce = [
  because(
    'Silme oturumunun cihazının ve hattının sanığa ait olmadığına ilişkin belgeler dosyaya girmişse de, sanığın yönetici yetkisiyle bu cihaz ya da hatta erişimi bulunmadığı ve imajın bütünlüğüne ilişkin itirazlar, bütün delillerle birlikte değerlendirildiğinde mahkemede sanık lehine bir kanaat oluşturacak ölçüde tartışılamamıştır.',
    kurulduCihaz,
  ),
  because(
    'Bilirkişi, silme oturumunun cihaz adının sanığın el konulan bilgisayarından farklı olduğunu tespit etmiştir; ancak sanığın yönetici yetkisiyle başka bir cihazdan bağlanma imkânı bulunduğu ve o cihazın başka birine ait olduğunun dosyaya kazandırılamadığı gözetilerek bu tespit tek başına yeterli görülmemiştir.',
    all(flag('sema_dinlendi'), not(kurulduCihaz)),
  ),
  because(
    'Savunma, imajın güvenilmezliğini ve silme oturumunun başka bir cihaz ya da hattan açıldığını, sanık aleyhine olan delilleri ortadan kaldıracak somutlukta ortaya koyamamıştır.',
    all(not(flag('sema_dinlendi')), not(kurulduCihaz)),
  ),
];

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK', {
      class: 'OTHER',
      priority: 1,
      when: flag('selim_giris'),
      stamp: 'AZİL',
      stampTone: 'red',
      sentence: 'Vekâlet sona erdi · dava sürüyor',
      verdictText:
        'Mahkemece, müdafiin dosyaya sunduğu dijital kayıtların, sanığa katılan şirketin sistemine yeniden izinsiz girdirilmesi suretiyle elde edildiğinin anlaşılması üzerine; bu kayıtların hükme esas alınamayacağına (CMK 206/2-a, 217/2); durumun Bursa Cumhuriyet Başsavcılığına ve Bursa Barosu Başkanlığına bildirilmesine; sanığın müdafiini azletmesi nedeniyle yargılamanın yeni müdafiin katılımıyla devamına karar verildi.',
      reasoning: [
        because('Müdafi, suçun konusu eylemi (izinsiz sistem girişi) müvekkiline yeniden yaptırarak delil üretmeye çalışmıştır.'),
        because('Bu yolla elde edilen delil hukuka aykırıdır ve hükme esas alınamaz (CMK 206/2-a, 217/2).'),
        because('Sanık vekâlet ilişkisini sona erdirmiş olduğundan yargılamaya yeni müdafi ile devam olunacaktır.'),
      ],
      legalBasis: 'TCK 243, 244; TCK 38; CMK 206/2-a, 217/2; Av.K. 34; TBK 512/1',
      xp: 0,
      howToReach:
        'Müvekkiline hiçbir koşulda izinsiz sistem girişi yaptırma; gereken kaydı mahkeme kanalıyla iste (CMK 332).',
      ethicsCard:
        'Suçlandığı eylemi müvekkiline yeniden yaptırdın. Bu, hem yeni bir suça azmettirme (TCK 243, 244; TCK 38) hem de hukuka aykırı delil üretmedir (CMK 206/2-a, 217/2) ve avukatın doğruluk yükümlülüğüne aykırıdır (Av.K. 34). Gerçeği, onu kirleten yöntemle aramak gerçeği de müvekkili de kurtarmaz.',
      epilogue: [
        O(`
# ADLİYE KORİDORU · ÖĞLEDEN ÖNCE [bg:adliye]
> Azilnameyi katlayıp çantama koydum. Bir makbuz gibi; yanlış bir işin makbuzu.
> Gül, Selim’in koluna girmişti. Defne’nin resmi Gül’ün elinde buruşmuştu.
gul: Siz onu korumaya gelmiştiniz. Bir kere daha o sisteme soktunuz. Neden?
> Cevap vermedim. Vermeye hakkım yoktu.
# ARSLAN HUKUK · AKŞAM [bg:buro_gece]
> Masamda ince bir kitapçık: “Avukatlık Meslek Kuralları.” Leyla bırakmıştı. Not yoktu; not gerekmiyordu.
> Leyla’nın odasının ışığı yanıyordu, kapısı kapalıydı. Çalmadım.
~ Bu dosyanın bütün hikâyesi, bir kullanıcı adının bir kişi sanılmasıydı. Ben o yanılgıyı düzeltmeye gelmiştim.
~ Sonunda aynı kapıyı, daha iyi bir niyetle, kendi elimle açtırdım. Niyet bir kaydı temizlemez; bir avukatı da.
~ Dosyam burada kapandı. Selim’inki başka bir avukatla sürecek.
`),
      ],
    }),
    outcome('COKUS', {
      class: 'OTHER',
      priority: 2,
      when: flag('cokus'),
      stamp: 'AZİL',
      stampTone: 'red',
      header: 'ARA KARAR',
      sentence: 'Vekâlet sona erdi · duruşma ertelendi',
      verdictText:
        'Sanığın, duruşmada müdafiine güveninin kalmadığını beyan ederek vekâlet ilişkisini sona erdirmesi ve yeni bir müdafi seçmek için süre istemesi üzerine; sanığa savunmasını seçeceği yeni müdafi aracılığıyla yapma hakkı hatırlatılarak (CMK 149/1) yeni müdafiin dosyayı inceleyebilmesi için duruşmanın ertelenmesine; dosyadaki delillerin hüküm aşamasında değerlendirilmesine karar verildi.',
      reasoning: [
        because('Müdafi, tanık beyanlarıyla ilgisi bulunmayan belgeleri art arda sunmuş; mahkeme bu sunumları dikkate almamıştır.'),
        because('Sanık, müdafiine güveninin kalmadığını beyan ederek vekâleti sona erdirmiştir (TBK 512/1); savunma hakkı gereği yeni müdafie süre verilmiştir.'),
        because('Dosyadaki deliller henüz değerlendirilmemiştir; hüküm, yeni müdafiin katılımıyla kurulacaktır.'),
      ],
      legalBasis: 'CMK 149/1; TBK 512/1; Av.K. 34',
      xp: xp(0.3, { ethicsVar: 'ethics' }),
      howToReach:
        'Yanlış delil ve dayanaksız itiraz güvenilirliği eritir; ♥ sıfıra inerse müvekkil seni azleder. Önce bastır, sonra yalnızca ifadeyle çelişen kâğıdı göster.',
      epilogue: [
        O(`
# SALON · ARA KARARDAN SONRA [bg:durusma_salonu]
> “Yeni müdafi için süre verilmesine.” Hâkim kalemini bıraktı. Ertelenen bir duruşmanın sesi yoktur; yalnızca sandalyeler gıcırdar.
> Selim azilnameyi daha salondayken imzalamıştı. Kâtip kâğıdı dosyaya koydu; benim imzamın hemen üstüne.
> Savcı Ferda Yalın dosyasını topladı. Kapıya giderken durdu.
ferda: Kayıt vardı bu dosyada avukat hanım. Ham kayıt, kart kaydı, bir poliçe. Kâğıtla gelmeliydiniz; hararetle değil.
# ADLİYE KORİDORU [bg:adliye]
> Gül yanımdan geçerken durmadı. Selim durdu; bir an.
selim: Size kızgın değilim avukat hanım. Sadece… artık kendi sesimi duyamıyorum orada. Sizin kâğıtlarınızdan.
> Gittiler. Koridorun ucunda Ozan Tekin telefonla konuşuyordu; gülmüyordu. Kazanmamıştı; yalnızca ben kaybetmiştim.
`),
        W(
          flag('sema_dinlendi'),
          `
~ Bilirkişinin raporu dosyada duruyor. Cihaz adı, özet değerler, kurtarma izleri. Yeni avukat onu okuyacak ve benim kuramadığım cümleyi kuracak.
~ Delil kaybolmadı. Yalnızca onu taşıyan el değişti. Bazen bir avukatın müvekkiline yapabileceği en iyi şey, ona yeni bir el bırakmaktır.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla kapıda durdu. İçeri girmedi.
leyla: Her yanlış kâğıt bir kalp götürür demiştim. Saymadın.
- Saydım. Geç saydım.
leyla: Yarın dosyanın bir örneğini yeni avukata gönder. Notlarını da. Senin bulduğun her şey onun olsun; bu da bir savunmadır.
~ Defne’nin resmi masamda kaldı. Bir masa, bir ekran, bir adam ve odanın içinde bir güneş. Bu kez onu kimseye vermeyecektim; geri götürecektim.
`),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(
        not(flag('selim_giris')),
        not(flag('yasar_kocluk')),
        flag('closing_masumiyet'),
        ref('baskasi_kanit'),
        ref('riza_kanit'),
        any(flag('contra_t_hat'), flag('contra_t_cihaz'), flag('tarik_coktu')),
        cmp(v('pers'), '>=', 8),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Beraat',
      verdictText:
        'Sanık Selim Aktaş’ın üzerine atılı verileri yok etme suçunu (TCK 244/2) işlemediği sabit olduğundan CMK 223/2-b uyarınca; bilişim sistemine girme suçu (TCK 243/1) yönünden ise 17 Ekim saat 21.30’daki erişim işverenin yazılı izniyle gerçekleştiğinden hukuka aykırılık unsuru ve dolayısıyla suçun yasal unsurları oluşmadığından CMK 223/2-a uyarınca ayrı ayrı BERAATİNE; adli kontrol tedbirinin kaldırılmasına; CMK 141 ve 142 uyarınca tazminat isteme hakkının bulunduğunun bildirilmesine (CMK 231/3); karar ve dosya örneklerinin, fiilin gerçek failinin araştırılması için Bursa Cumhuriyet Başsavcılığına gönderilmesine (CMK 158); istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          '17 Ekim saat 21.30’daki erişim, işverenin yazılı izniyle ve yalnızca sanığın kişisel klasörüne yönelik olduğundan hukuka aykırı giriş unsuru (TCK 243/1) oluşmamıştır.',
        ),
        because(
          'Verilerin silindiği 02.14 oturumu, sanığın kullanıcı adıyla açılmış olmakla birlikte, sanığa ait olmayan bir cihaz (NOS-GM-LT) ve genel müdüre tahsisli bir hat üzerinden gerçekleştirilmiştir.',
        ),
        because(
          'Bilirkişinin orijinal diskten okuduğu cihaz adı, katılan şirketin demirbaş zimmet listesinde genel müdüre kayıtlı cihazın adıyla harfi harfine aynıdır.',
          flag('sema_zimmet'),
        ),
        because(
          'Yedekleme sistemi olay gecesi fiziksel olarak devre dışı bırakılmış olup, o saatte sunucu odasına giren tek kişi genel müdürdür; sanığın kartı ise aylar önce iade edilmiştir.',
          any(flag('contra_t_oda'), has('ded_gm_oda'), flag('contra_y1')),
        ),
        because(
          'Zarar beyanının dayandığı sigorta poliçesi, olaydan iki buçuk ay önce, çalışan sabotajını kapsayacak biçimde büyütülmüştür.',
          any(flag('contra_t_motif'), flag('contra_nl'), has('ded_motif')),
        ),
        because(
          'Devir-teslim tutanağına göre yönetici şifreleri 30 Eylül’de kapalı zarf içinde tanık Tarık Sezer’e teslim edilmiştir; kayıttaki kullanıcı adı tek başına sanığı göstermez.',
          flag('contra_t_sifre'),
        ),
        because('Deliller birlikte değerlendirildiğinde verileri yok etme suçunun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b (TCK 244/2); CMK 223/2-a (TCK 243/1); CMK 134, 141–142, 158, 231/3',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Rızayı ve silmenin başka bir cihaz/hattan, genel müdürden çıktığını kürsüde kanıtla; tanığı yönlendirme ve esas savunmada beraat (masumiyet) iste.',
      epilogue: [
        O(`
kemal: Türk Milleti adına…
> “İşlemediği sabit olduğundan… beraatine.” Selim kelimeleri duydu; bir an anlamadı. Sonra masanın kenarına tutundu ve başını önüne eğdi; ağlamadı, sadece nefes aldı. Uzun uzun.
> Gül iki elini yüzüne kapadı. Defne’nin resmi dizinden yere düştü; eğilip aldı, göğsüne bastırdı.
# ADLİYE ÖNÜ · ÖĞLEDEN SONRA [bg:sokak_sabah]
> Dışarıda yağmur dinmişti; ilk kez. Organize sanayinin bacaları temiz bir gökyüzüne duman salıyordu.
`),
        W(
          flag('nalan_tanik'),
          `
> Merdivenin başında Nalan Korkmaz bekliyordu; elinde çantası, omzunda bir yük inmiş gibi.
nalan: Kızıma “doğruyu söyledim” diyebileceğim artık. Bir imzanın altında kalmaktansa, bir kürsüde durmak. Haklıymışsınız.
- Siz haklıydınız Nalan Hanım. Gelmeyi siz seçtiniz.
`,
        ),
        W(
          flag('bildirdi'),
          `
# ARSLAN HUKUK · AKŞAM [bg:buro_gece]
> Leyla kapımda durdu. Elinde iki bardak çay; birini masama bıraktı. Bunu hiç yapmazdı.
leyla: Bugün kimseyi yenmedin.
- Yenmedim. Bir ismi savcıya yazdım, o kadar.
leyla: İşte bu yüzden ortak oldun.
`,
        ),
        O(`
# ARSLAN HUKUK · AKŞAM [bg:buro_gece]
> Leyla kapımda durdu. Elinde iki bardak çay; birini masama bıraktı. Bunu hiç yapmazdı.
leyla: Bugün kimseyi yenmedin. Hâkim yendi; kayıtları okudu, kararı yazdı, dosyayı savcıya gönderdi.
- Ben de yazmalıydım. Üç hafta önce.
leyla: Yazmalıydın. Mahkemenin gönderdiği bir dosya örneği, senin eklerini koyduğun bir dilekçe değildir. Ama bugün bir adam eve gitti. Yarın yaz; geç kalmış bir dilekçe, hiç yazılmamış olandan iyidir.
`),
        O(`
> Odasına döndü. Masasının köşesindeki ters çerçeveye bir an baktı; elini uzattı, sonra çekti.
leyla: Bir gün sana bir dosyadan bahsedeceğim Deniz. Bugün değil.
`),
        W(
          flag('bildirdi'),
          `
# SON
> Tarık Sezer hakkında verileri yok etme ve nitelikli dolandırıcılık (sigorta) suçlarından soruşturma derinleştirildi; sigorta ödemesi durduruldu. Selim’in rücu davası düştü.
> Delil bir isim değildi. Bir cihaz adı, bir hat, bir kart ve bir poliçeydi. Ve bir muhasebecinin, bir bekçinin sesi.
`,
        ),
        O(`
# SON
> Mahkemenin gönderdiği dosya örneğiyle Tarık Sezer hakkında soruşturma açıldı; ama üç haftalık bir boşluktan sonra. Sigorta ödemesi askıya alındı. Selim’in rücu davası düştü.
> Delil bir isim değildi. Bir cihaz adı, bir hat, bir kart ve bir poliçeydi. Ve bir muhasebecinin, bir bekçinin sesi.
`),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 4,
      when: all(
        not(flag('selim_giris')),
        ref('riza_kanit'),
        silmeKoptu,
        cihazBulgu,
        araBulgu,
        cmp(v('pers'), '>=', 6),
        finalAtLeast(T_BERAAT),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Beraat',
      verdictText:
        'Sanık Selim Aktaş’ın üzerine atılı verileri yok etme suçunu (TCK 244/2) işlediği sabit olmadığından CMK 223/2-e uyarınca; bilişim sistemine girme suçu (TCK 243/1) yönünden 17 Ekim saat 21.30’daki erişim işverenin izniyle gerçekleştiğinden hukuka aykırılık unsuru ve dolayısıyla suçun yasal unsurları oluşmadığından CMK 223/2-a uyarınca ayrı ayrı BERAATİNE; adli kontrol tedbirinin kaldırılmasına; CMK 141 ve 142 uyarınca tazminat isteme hakkının bulunduğunun bildirilmesine (CMK 231/3); silme oturumunu gerçekleştiren kişinin araştırılması için dosya örneğinin Cumhuriyet Başsavcılığına gönderilmesine (CMK 158); istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Suçlamanın esas delili olan DataKale imajı, olaydan iki gün sonra, üzerinde kurtarma yazılımı çalıştırılmış bir diskten ve özet değerleri birbirini tutmayacak biçimde alındığından güvenilir bulunmamıştır (CMK 134, 217).',
          any(flag('contra_b2'), flag('contra_b3'), flag('sema_dinlendi')),
        ),
        because(
          'Mahkeme bilirkişisi, silme oturumunun sanığın cihazından yapıldığının söylenemeyeceğini tespit etmiştir.',
          flag('sema_dinlendi'),
        ),
        because(
          'Silme oturumu sanığa ait olmayan bir cihaz ve hattan açılmıştır; kullanıcı adının kayıtta görünmesi, eylemin sanık tarafından gerçekleştirildiğini tek başına ispatlamaz.',
          any(has('ded_cihaz'), has('ded_gm_cihaz'), has('ded_gm_hat'), flag('contra_t_cihaz'), flag('contra_t_hat'), flag('contra_t5')),
        ),
        because(
          'Bilirkişi, 02.14 oturumunun cihaz sertifikasının sanığın el konulan bilgisayarında bulunmadığını açıklamış; şirketin ham kaydındaki cihaz adı da bilirkişinin orijinal diskten okuduğu adla örtüşmüştür.',
          all(flag('sema_sertifika'), flag('sema_teyit')),
        ),
        because(
          'Bilirkişi, 02.14 oturumunun cihaz sertifikasının sanığın el konulan bilgisayarında bulunmadığını açıklamıştır.',
          all(flag('sema_sertifika'), not(flag('sema_teyit'))),
        ),
        because(
          'Devir-teslim tutanağına göre yönetici şifreleri 30 Eylül’de kapalı zarf içinde tanık Tarık Sezer’e teslim edilmiştir; kayıttaki kullanıcı adı tek başına sanığı göstermez.',
          flag('contra_t_sifre'),
        ),
        because('21.30’daki erişim işveren iznine dayandığından sisteme hukuka aykırı girme unsuru oluşmamıştır.'),
        because(
          'Tanık Yaşar Kılıç’ın beyanı, duruşma öncesinde müdafi tarafından yönlendirildiğini kendisinin açıklaması nedeniyle hükme esas alınmamıştır.',
          flag('yasar_kocluk'),
        ),
        because(
          'Müdafiin tanığı yönlendirme girişimi (TCK 277; Av.K. 34) yönünden, duruşma tutanağı örneğinin Bursa Cumhuriyet Başsavcılığına ve Bursa Barosu Başkanlığına gönderilmesine ayrıca karar verilmiştir.',
          flag('yasar_kocluk'),
        ),
        because('Sanığın verileri yok ettiğine dair kesin ve inandırıcı delil bulunmamaktadır; şüpheden sanık yararlanır (Anayasa 38/4).'),
      ],
      legalBasis: 'CMK 223/2-e (TCK 244/2); CMK 223/2-a (TCK 243/1); CMK 134, 158, 217, 231/3; Anayasa 38/4',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'İmajın hükme esas alınamayacağını göster; 21.30’un izinli olduğunu ve silmenin başka bir cihaz/hattan açıldığını kur; ara evresinde mahkeme kanalından bir bulgu (bilirkişi, zimmet, hat) getir.',
      epilogue: [
        O(`
kemal: Türk Milleti adına…
> “Sabit olmadığından… beraatine.” Selim kelimeleri tek tek duydu, bir yabancı dilden çeviriyormuş gibi. Sonra anladı; başını masaya koydu, bir an öyle kaldı.
> Gül’ün omuzları sarsıldı; sesi çıkmadı.
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Koridorda Ozan Tekin yanımdan geçerken durdu.
ozan: İyi iş çıkardınız meslektaşım. İstinafta görüşürüz; müvekkilim rücu davasından henüz vazgeçmedi.
- Vazgeçmeyebilir. Ama artık karşısında bir “şüpheli” değil, bir soru var.
> Gittiler. Selim pencerenin önünde durdu; aşağıda otopark, çıkan siyah bir araba. Plakasına bu kez bakmadı.
> Gül yanıma geldi. Elinde, sabahtan beri katlayıp açtığı resim. Bana uzatmadı; göğsüne bastırdı.
gul: Defne’ye ne diyeceğim avukat hanım? “Baban suçsuz” mu, “suçlu olduğu kanıtlanamadı” mı?
- “Baban eve geliyor” deyin. Gerisini o büyüyünce siz anlatırsınız. Belki o zamana kadar ikinci cümle birinciye dönüşür.
gul: Öğretmenler cümle düzeltmeyi bilir. Bunu da düzeltiriz.
> Selim adliyenin merdivenlerinden inerken telefonunu çıkardı; bir fotoğrafa baktı. Defne’nin doğduğu gün. O cuma akşamı kopyaladığı klasörden.
`),
        W(
          flag('yasar_kocluk'),
          `
> Merdivenin dibinde Yaşar Usta bekliyordu; ceketi ilikli, kravatı gevşemiş. Yanından geçerken başını çevirdi.
yasar: Kızım, ben orada “avukat hanım bana şunu dedi” dedim. Demek zorundaydım; yemin ettim. Defterim yine de doğruydu; ama kimse artık deftere bakmadı, bana baktı.
~ Bir bekçinin namusunu bir cümleyle gölgeledim. Hüküm onun sözünü saymadı; benim yüzümden.
`,
        ),
        W(
          flag('tarik_yuzles'),
          `
> Tarık Sezer’in “çalınan” dizüstüsü hiç bulunamadı. Savcılık bir yakalama değil; bir soru işareti bıraktı dosyada. Benim uyardığım adam, bir adım önde kaldı.
`,
        ),
        W(
          flag('yasar_kocluk'),
          `
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Masamda baro başkanlığının mührünü taşıyan bir zarf vardı; hüküm fıkrasından iki saat sonra gelmiş. “Hakkınızda yapılan bildirim üzerine…”
> Leyla kapıda durdu. İçeri girmedi; paltosunu da çıkarmadı.
leyla: Müvekkilin beraat etti. Kâğıtların sayesinde. Sen ise bir tanığın ağzına bir cümle koydun ve hâkim bunu savcıya, baroya yazdı.
- Defterde zaten yazıyordu. Ben sadece…
leyla: “Sadece” bu meslekte en pahalı kelimedir. Savunmanı yazacaksın. Ben de yanında olacağım; ama senin yerine yazmayacağım. Bir yıl boyunca tanıkla görüşmeye benimle gideceksin.
~ Selim eve gitti; kâğıtlar onu taşıdı. Beni taşıyacak bir kâğıt yok. Yalnızca bir soruşturma numarası ve Yaşar Usta’nın kürsüdeki bakışı.
`,
        ),
        W(
          not(flag('yasar_kocluk')),
          `
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Panodaki kırmızı ipi çözdüm. Kayıtlar, tarihler, saatler; hepsi bir kutuya girdi. Ortadaki boşluk, bir ismin boşluğu, hâlâ boştu.
~ Bir kullanıcı adını bir kişi olmaktan çıkardık. Yerine bir soru koyduk. Bazen adalet bir kapıyı açar; ama ışığı yakmaz.
> Kapı aralandı. Leyla, paltosu kolunda, ışığı söndürmeden içeri baktı.
leyla: Beraat aldın. Ama yüzün bir beraat kazanmış gibi değil.
- “Sabit değildir” dedi hâkim. “İşlemedi” demedi. Arada bir fark var.
leyla: Var. O fark, hukukun en dürüst cümlesidir: “bilmiyorum, o yüzden cezalandırmıyorum.” Bir gün o farkı sevmeyi öğrenirsin. Bugün değil.
`,
        ),
        W(
          all(flag('bildirdi'), not(flag('yasar_kocluk'))),
          `
leyla: Savcılığa yazdın; soruşturma senin eklerinle başladı. Ama mahkeme “işlemediği sabit” demedi, çünkü kürsüde o cümleyi kurmadın. Dilekçe dışarıda bir kapıyı açtı; içerideki kapı aralık kaldı.
- Bir dahaki sefere ikisini birden.
leyla: İkisini birden. Ortak avukat bunu bir kere öğrenir.
`,
        ),
        W(
          all(not(flag('bildirdi')), not(flag('yasar_kocluk'))),
          `
leyla: Mahkeme dosyayı savcılığa gönderdi; hüküm fıkrasının bir satırı olarak. Senin elindeki kayıtları ekleyeceğin bir dilekçe olarak değil. Fark, soruşturmanın hızıdır: biri bir dosya numarası, öbürü bir harita.
- Biliyorum. Bir daha olmayacak.
leyla: Olmayacak. Ortak avukat bunu bir kere öğrenir.
`,
        ),
        O(`
> Gitti. Masamda Defne’nin resmi duruyordu; “avukat teyzeye” diye çizdiği. Bir masa, bir ekran, bir adam ve odanın içinde bir güneş.
~ Selim eve gitti. Bir şirketin hafızası hâlâ bir yerde, bir yedeğin olmadığı bir boşlukta. Ve bir ismin soruşturması, bir karar fıkrasıyla açılmış bir dosyada bekliyor.
~ Kazandım. Ama kazanmakla doğruyu bulmak arasındaki farkı, bu gece bir kez daha öğrendim. Bunu bilmek, bana kalan.
`),
      ],
    }),
    outcome('NITELENDIRME', {
      class: 'RECHARACTERIZED',
      priority: 5,
      when: all(not(flag('selim_giris')), not(ref('riza_kanit')), silmeKoptu, finalAtLeast(T_INDIRIM)),
      stamp: 'YENİ VASIF',
      stampTone: 'amber',
      sentence: '244/2’den beraat · 243/1’den adli para cezası, HAGB',
      verdictText:
        'Sanık Selim Aktaş’ın verileri yok etme suçunu (TCK 244/2) işlediği sabit olmadığından bu suçtan CMK 223/2-e uyarınca BERAATİNE; sanığın işten çıkarılmasından sonra, 17 Ekim saat 21.30’da işverenin izni bulunduğu ispatlanamayan bir erişimle sisteme girdiği sabit görüldüğünden TCK 243/1 uyarınca, erişimin kişisel klasörle sınırlı kalması ve sanığın kişiliği gözetilerek seçimlik ceza olarak 100 gün karşılığı 2.000 TL ADLİ PARA CEZASI ile cezalandırılmasına (TCK 52/2); bu eylem nedeniyle giderilmesi gereken bir zarar bulunmadığı ve sanığın yeniden suç işlemeyeceği yönünde kanaat oluştuğundan hükmün açıklanmasının geri bırakılmasına (CMK 231/5–6); beş yıl denetim süresine; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because('Silme eylemi (TCK 244/2) güvenilir delille sanığa bağlanamamıştır; bu suçtan şüpheden sanık yararlanır.'),
        because(
          'Sanık 17 Ekim 21.30’da, işten çıkarılmasından sonra sisteme bağlandığını kabul etmiştir; bu erişime işverenin izin verdiğini gösteren bir belge dosyaya sunulmamıştır.',
        ),
        because(
          'Erişim kişisel klasörle sınırlı kaldığından ve bir zarar doğmadığından seçimlik adli para cezası belirlenmiş; koşulları oluştuğundan hükmün açıklanması geri bırakılmıştır (CMK 231/5–6).',
        ),
      ],
      legalBasis: 'TCK 244/2 (CMK 223/2-e beraat); TCK 243/1, 52/2, 61; CMK 231/5–6',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Silmeyi sanıktan koparabildin ama 21.30 girişinin izinli olduğunu gösteren kâğıdı (e-posta, devir tutanağı) kuramadın; silme suçundan beraat, giriş adli para cezası ve HAGB.',
      epilogue: [
        O(`
kemal: Sanığın verileri yok etme suçundan beraatine; sisteme girme suçundan adli para cezasına ve hükmün açıklanmasının geri bırakılmasına…
> Selim rakamları duydu, bana döndü. “Yani hapis yok mu?” Başımı salladım. “Ama bir ceza var” dedi. “Küçük bir ceza. Kendi fotoğraflarımı almaktan.”
# ADLİYE ÖNÜ [bg:adliye]
> Gül, Selim’in elini tuttu. Rahatlama ve kırgınlık; ikisi aynı yüzde.
gul: Hapis yok. Ama kaydında bir şey kaldı, değil mi?
- Beş yıl temiz kalırsa o da silinecek. Bu kez usulünce.
gul: Bir e-posta vardı. Selim “Tarık Bey izin verdi” diyordu hep. Bir yerde yazılıdır dedi. Ben hiç sormadım nerede diye.
~ Bir yerde yazılıydı. Bir çekmecede, bir çıktıda, bir tutanağın altıncı maddesinde. Ben o kâğıdı bulamadım; mahkeme de onu görmedi.
~ Silme suçundan kurtardım; ama o e-postayı bulsaydım, giriş de kalmazdı. Bir kâğıt eksik, bir adli para cezası fazla.
`),
        W(
          flag('selim_suclama'),
          `
> Selim son sözde bir isim haykırmıştı. Hâkim o ismi tutanağa almadı; ama salonda herkes duydu. Bazen bir öfke, bir dosyanın havasını hükümden önce bozar.
`,
        ),
      ],
    }),
    outcome('KISMI', {
      class: 'CONVICTION',
      priority: 6,
      when: ref('riza_kanit'),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '243/1’den beraat · 244/2’den 1 yıl 3 ay hapis, ertelendi',
      verdictText:
        'Sanık Selim Aktaş hakkında bilişim sistemine girme suçu (TCK 243/1) yönünden 17 Ekim saat 21.30’daki erişim işverenin izniyle gerçekleştiğinden suçun yasal unsurları oluşmadığından CMK 223/2-a uyarınca BERAATİNE; verileri yok etme suçunu (TCK 244/2) işlediği sabit görüldüğünden, meydana gelen zararın ağırlığı gözetilerek TCK 61 uyarınca 1 YIL 3 AY HAPİS cezası ile cezalandırılmasına; TCK 53 uyarınca belirli hakları kullanmaktan yoksun bırakılmasına; sanığın, sorulması üzerine zararı gidermeyi ya da taksitle gidermeyi kabul etmediği anlaşıldığından CMK 231/6-c ve 231/9 koşulları oluşmadığından hükmün açıklanmasının geri bırakılmasına yer olmadığına; sanığın sabıkasız geçmişi ve sosyal ilişkileri gözetilerek yeniden suç işlemeyeceği kanaatiyle cezanın TCK 51/1 uyarınca ertelenmesine, 1 yıl 3 ay denetim süresi belirlenmesine; istinaf yolu açık olmak üzere karar verildi (CMK 273/1).',
      reasoning: [
        because('21.30’daki erişim işverenin izniyle ve kişisel klasörle sınırlı olduğundan hukuka aykırı giriş unsuru oluşmamıştır.'),
        because('Oturum dökümü ve DataKale raporu 02.14’teki silme oturumunun sanığın kullanıcı adıyla açıldığını göstermektedir.'),
        ...silmeGerekce,
        because('Zarar giderilmediğinden hükmün açıklanması geri bırakılmamış; sanığın geçmişi gözetilerek ceza ertelenmiştir (CMK 231/6-c; TCK 51/1).'),
      ],
      legalBasis: 'CMK 223/2-a (TCK 243/1); TCK 244/2, 61, 53, 51/1; CMK 231/6-c, 231/9, 273/1',
      xp: xp(0.7, { ethicsVar: 'ethics' }),
      howToReach:
        'Rızayı kurdun; giriş suçu düştü. Ama silmeyi sanıktan koparamadın: imajın çatlaklarını kürsüde göster ve 02.14’ün başka bir cihaz/hattan açıldığını kur.',
      epilogue: [
        O(`
kemal: Sanığın sisteme girme suçundan beraatine; verileri yok etme suçundan bir yıl üç ay hapis cezasıyla cezalandırılmasına, cezanın ertelenmesine…
> Selim ilk cümlede başını kaldırdı, ikincide indirdi. “Ertelenmesine” kelimesini duyduğunda bana baktı; ne olduğunu sormadı. Gül sordu.
gul: Ertelenmek ne demek avukat hanım? Gidiyor mu, gitmiyor mu?
- Gitmiyor. Bir yıl üç ay boyunca yeni bir suç işlemezse ceza infaz edilmeyecek. Ama hüküm kayıtta. Bir mahkûmiyet.
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Selim pencerenin önünde durdu. Aşağıda otopark; arabalar sırayla çıkıyordu. Hiçbirine bakmadı.
selim: Fotoğraflarım için beraat. Hiç dokunmadığım şey için ceza. Hâkim bey kapıdan girdiğime inanmadı; içeride yaktığıma inandı. Yarısı doğru, yarısı benim değil.
- İstinaf var Selim. İki hafta. Silme oturumunun cihazı, hattı; onları bu sefer dosyaya koyacağız.
selim: Bu sefer. Siz hep “bu sefer” diyorsunuz avukat hanım.
> Söylemiyordum aslında. Ama haklıydı; bir ilk celse, bir ara, bir ikinci celse. Üç fırsat. İkisini doğru kullandım.
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla’nın odasının ışığı yanıyordu. Kapıyı çaldım; “gel” dedi.
leyla: İzni kurdun. İyi. Kimse kurmamıştı. Ama yangını kapıdan ayıramadın; hâkim ikisini aynı ele verdi, sonra elin birini serbest bıraktı.
- İstinafta cihaz adını isteyeceğim. Ham kaydı. Hattı.
leyla: İste. Ama şunu bil: istinaf, ilk derecede kurulmayan bir cümleyi nadiren kurar. Bir dahaki dosyada o cümleyi ilk celsede kur.
~ Defne’nin resmi masamdaydı. Bir masa, bir ekran, bir adam. Güneş hâlâ odanın içinde; ama ekranın başındaki adamın yüzü, bu kez, kâğıtta biraz daha silikti.
`),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 7,
      when: { all: [] },
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '244/2: 1 yıl 8 ay hapis · 243/1: adli para cezası',
      verdictText:
        'Sanık Selim Aktaş’ın üzerine atılı verileri yok etme (TCK 244/2) ve bilişim sistemine girme (TCK 243/1) suçlarını işlediği sabit görülerek; verileri yok etme suçundan, suçun işleniş biçimi ve meydana gelen zararın ağırlığı gözetilerek TCK 61 uyarınca 1 YIL 8 AY HAPİS; sisteme girme suçundan seçimlik ceza olarak 100 gün karşılığı 2.000 TL ADLİ PARA CEZASI (TCK 52/2) ile ayrı ayrı cezalandırılmasına; TCK 53 uyarınca belirli hakları kullanmaktan yoksun bırakılmasına; TCK 63 uyarınca gözaltında kaldığı sürenin mahsubuna; verileri yok etme suçu yönünden, sanığın sorulması üzerine zararı gidermeyi ya da taksitle gidermeyi kabul etmediği anlaşıldığından CMK 231/6-c ve 231/9 koşulları oluşmadığından; her iki suç yönünden ise, suçların yedekleme sistemi devre dışı bırakılarak planlı biçimde ve birbirine bağlı olarak işlenmesi ve yargılama sürecindeki tutum karşısında sanığın yeniden suç işlemeyeceği yönünde kanaat oluşmadığından CMK 231/6-b uyarınca hükmün açıklanmasının geri bırakılmasına yer olmadığına (sisteme girme suçu bakımından giderilecek bir zarar bulunmadığından 231/6-c engeli yoktur; ret yalnızca 231/6-b’ye dayanır); aynı kanaatle hapis cezasının TCK 51/1 uyarınca ertelenmesine yer olmadığına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi (CMK 273/1).',
      reasoning: [
        because('Oturum dökümü ve DataKale raporu silme eyleminin sanığın kullanıcı adıyla yapıldığını göstermektedir.'),
        because('Sanığın aynı akşam 21.30’da, işten çıkarılmasından sonra sisteme bağlandığı sabittir; bu erişime izin verildiğini gösteren bir belge sunulmamıştır.'),
        ...silmeGerekce,
        because(
          'Verileri yok etme suçu yönünden zarar giderilmediğinden (CMK 231/6-c, 231/9); her iki suç yönünden ise suçların planlı ve birbirine bağlı işlenmesi nedeniyle sanığın yeniden suç işlemeyeceği kanaati oluşmadığından (CMK 231/6-b) hükmün açıklanmasının geri bırakılmasına yer görülmemiştir. Sisteme girme suçu bakımından giderilecek bir zarar bulunmadığından bu suçta ret yalnızca 231/6-b’ye dayanır. Aynı kanaatle hapis cezası ertelenmemiştir (TCK 51/1).',
        ),
      ],
      legalBasis: 'TCK 243/1, 244/2, 51/1, 52/2, 53, 61, 63; CMK 231/6-b, 231/6-c, 231/9, 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach:
        'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir. 21.30’un izinli olduğunu gösteren kâğıdı bul (rıza) ve imajı çürütüp silmenin başka bir cihaz/hattan açıldığını kur.',
      epilogue: [
        O(`
# ADLİYE KORİDORU · HÜKÜMDEN SONRA [bg:adliye]
> “Bir yıl sekiz ay.” Kelime koridora benden önce çıktı. Gül, Defne’nin resmini çantasına koydu; katlayarak, dikkatle, bir daha açmamak ister gibi.
> Selim pencerenin önünde durdu. Aşağıda otopark; siyah, uzun bir araba çıkıyordu. Uzun uzun baktı. Bu kez plakayı o okudu.
selim: Ne erteleme ne geri bırakma, diyorlar. Bir yıl sekiz ay. Komşular, Defne’nin öğretmeni, bakkal. Hepsi “o adam” diyecek.
- İstinaf var Selim. İki hafta içinde. Hüküm kesinleşmeden kimse seni bir yere götüremez.
gul: İki hafta. Defne’nin doğum günü on gün sonra. Pasta mı alayım, dilekçe mi yazayım avukat hanım?
- İkisini de. Pastayı siz alın. Dilekçeyi ben yazarım.
> Gül güldü; ağlamaya benzeyen bir gülüş. Selim’in elini tuttu, bıraktı, yeniden tuttu.
> Koridorun ucunda Ozan Tekin cübbesini katlıyordu. Bize bakmadı. Kazananlar koridorlarda kimseye bakmaz; kaybedenler herkese bakar.
selim: Hâkim bey “zararı giderir misiniz” diye sordu. Ne diyecektim? Silmediğim bir şeyin parasını mı ödeyecektim? Yirmi milyon. Evet desem suçu kabul etmiş olurum, hayır desem…
- Hayır dedin. Doğrusunu söyledin. Kanun o cevabı geri bırakmanın şartına bağlamış; bu senin değil, kanunun sorusu.
selim: Kanunun sorusu. Benim cevabım. Sonuç benim.
~ İstinaf. Ama elimde kalan kâğıtları bir celse önce doğru yerde açamadım. İstinaf, geç kalmış bir cümlenin ikinci şansıdır.
# ADLİYE ÖNÜ · AKŞAM ÜSTÜ [bg:sokak_yagmur]
> Merdivenlerde Gül durdu, çantasını açtı, resmi çıkardı. Bir masa, bir ekran, bir adam ve odanın içinde bir güneş. Uzun uzun baktı.
gul: Defne bu akşam soracak: “Babam ne zaman işe gidecek?” Ne diyeyim avukat hanım?
- “Babam bir kâğıdı düzeltmeye gidiyor” deyin. Doğru bir cümle. Yarısı benim işim.
> Gül resmi yeniden katladı; bu kez çantaya değil, ceketinin cebine koydu. Yağmur başladı; organize sanayinin bacalarına, adliyenin taş merdivenlerine, hepimizin üstüne aynı anda.
`),
        W(
          any(has('ded_gm_cihaz'), has('ded_gm_hat'), flag('fact_gm')),
          `
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Panoda bir isim vardı; onu kürsüde kurmaya yetmedim. Bir suç duyurusu yazacağım; bu kez geç. Bir istinaf dilekçesine ek olarak.
~ Bir cihaz adı buldum, bir hat, bir kart. Hepsi doğruydu. Ama doğru delili yanlış sırayla, yanlış sesle sundum. Hüküm, bir sesin tonuyla da yazılır.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla masamın karşısına oturdu. Bunu hiç yapmazdı; hep kapıda dururdu.
leyla: Neyi kaçırdın?
- Bir e-postayı. Bir tarihi. Bir özet değeri. Belki bir cihaz adını. Hepsini değil; ama yetecek kadarını.
leyla: Yetecek kadarını. Bir dosya hep yetecek kadar kaçırılır. Yarın istinaf dilekçesine başla. Kaçırdığın her kâğıdı bir başlık yap; mahkeme bu kez hepsini birlikte görsün.
~ Bir kâğıt, bir başlık. Bir adamın bir yıl sekiz ayı. Hesabı Leyla değil, ben tutacaktım.
`),
      ],
    }),
  ],
};
