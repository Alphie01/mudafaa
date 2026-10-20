import { all, any, because, cmp, finalAtLeast, flag, has, not, outcome, ref, v, xp } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { O, W } from './dsl.js';

// 90-outcomes: sonuçlar (öncelik sırasıyla) ve sonuca bağlı epiloglar. Eşikler meta’daki eşik çubuğuyla aynı.

export const T_INDIRIM = 2800;
export const T_BERAAT = 9500;
export const T_BERAAT_B = 10500;

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
        because('Sanık vekâlet ilişkisini sona erdirmiştir; dosyan burada kapandı.'),
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
`),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(
        not(flag('cokus')),
        not(flag('selim_giris')),
        flag('bildirdi'),
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
        'Sanık Selim Aktaş’ın üzerine atılı verileri yok etme ve bilişim sistemine girme suçlarını işlemediği sabit olduğundan CMK 223/2-b uyarınca her iki suçtan BERAATİNE; adli kontrol tedbirinin kaldırılmasına; CMK 141 vd. uyarınca tazminat hakkının bulunduğunun bildirilmesine (CMK 231/3); fiilin gerçek failine ilişkin suç duyurusu ve dosya örneklerinin, hâlen yürütülen soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          '21 Ekim saat 21.30’daki erişim, işverenin yazılı izniyle ve yalnızca sanığın kişisel klasörüne yönelik olduğundan hukuka aykırı giriş unsuru (TCK 243/1) oluşmamıştır.',
        ),
        because(
          'Verilerin silindiği 02.14 oturumu, sanığın kullanıcı adıyla açılmış olmakla birlikte, sanığa ait olmayan bir cihaz (NOS-GM-LT) ve genel müdüre tahsisli bir hat üzerinden gerçekleştirilmiştir.',
        ),
        because(
          'Yedekleme sistemi olay gecesi fiziksel olarak devre dışı bırakılmış olup, o saatte sunucu odasına giren tek kişi genel müdürdür; sanığın kartı ise aylar önce iade edilmiştir.',
        ),
        because('Zarar beyanının dayandığı sigorta poliçesi, olaydan iki buçuk ay önce, çalışan sabotajını kapsayacak biçimde büyütülmüştür.'),
        because('Deliller birlikte değerlendirildiğinde suçların sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; TCK 243/1, 244/2; CMK 134, 141 vd., 231/3, 158',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'İmajın güvenilmezliğini ve rızayı göster; cihaz/hat/kart ile silmenin genel müdürden çıktığını kanıtla ve bunu savcılığa yaz (celsede faili kovalama, bildir).',
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
        O(`
# ARSLAN HUKUK · AKŞAM [bg:buro_gece]
> Leyla kapımda durdu. Elinde iki bardak çay; birini masama bıraktı. Bunu hiç yapmazdı.
leyla: Bugün kimseyi yenmedin.
- Yenmedim. Bir ismi savcıya yazdım, o kadar.
leyla: İşte bu yüzden ortak oldun.
> Odasına döndü. Masasının köşesindeki ters çerçeveye bir an baktı; elini uzattı, sonra çekti.
leyla: Bir gün sana bir dosyadan bahsedeceğim Deniz. Bugün değil.
# SON
> Tarık Sezer hakkında verileri yok etme ve nitelikli dolandırıcılık (sigorta) suçlarından soruşturma derinleştirildi; sigorta ödemesi durduruldu. Selim’in rücu davası düştü.
> Delil bir isim değildi. Bir cihaz adı, bir hat, bir kart ve bir poliçeydi. Ve bir muhasebecinin, bir bekçinin sesi.
`),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(
        not(flag('cokus')),
        not(flag('selim_giris')),
        cmp(v('pers'), '>=', 6),
        ref('imaj_coktu'),
        ref('riza_kanit'),
        any(has('ded_dizustu'), has('ded_cihaz'), has('ded_gm_cihaz'), has('ded_gm_hat'), flag('contra_t_cihaz'), flag('contra_t_hat')),
        finalAtLeast(T_BERAAT),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Beraat',
      verdictText:
        'Sanık Selim Aktaş’ın üzerine atılı verileri yok etme suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; sisteme girme suçu yönünden eylemin işveren rızasına dayandığı anlaşıldığından CMK 223/2-b uyarınca BERAATİNE; adli kontrol tedbirinin kaldırılmasına; tazminat hakkının bildirilmesine (CMK 231/3); silme oturumunu gerçekleştiren kişi yönünden suç duyurusunda bulunulmasına; istinaf yolu açık olmak üzere karar verildi.',
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
          any(has('ded_cihaz'), has('ded_gm_cihaz'), has('ded_gm_hat'), flag('contra_t_cihaz'), flag('contra_t_hat')),
        ),
        because(
          '21.30’daki erişim işveren iznine dayandığından sisteme hukuka aykırı girme unsuru oluşmamıştır.',
          { ref: 'riza_kanit' },
        ),
        because('Sanığın suçu işlediğine dair kesin ve inandırıcı delil bulunmamaktadır; şüpheden sanık yararlanır (Anayasa 38/4).'),
      ],
      legalBasis: 'CMK 223/2-e, 223/2-b; TCK 243/1, 244/2; CMK 134, 217, 231/3, 158; Anayasa 38/4',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'İmajın hükme esas alınamayacağını göster; 21.30’un izinli olduğunu ve silmenin başka bir cihaz/hattan açıldığını kur (en az iki bağımsız lehe bulgu).',
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
          flag('tarik_yuzles'),
          `
> Tarık Sezer’in “çalınan” dizüstüsü hiç bulunamadı. Savcılık bir yakalama değil; bir soru işareti bıraktı dosyada. Benim uyardığım adam, bir adım önde kaldı.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Panodaki kırmızı ipi çözdüm. Cihaz adı, hat, poliçe; hepsi bir kutuya girdi. Ortadaki boşluk, bir ismin boşluğu, hâlâ boştu.
~ Bir kullanıcı adını bir kişi olmaktan çıkardık. Yerine bir soru koyduk. Bazen adalet bir kapıyı açar; ama ışığı yakmaz.
> Kapı aralandı. Leyla, paltosu kolunda, ışığı söndürmeden içeri baktı.
leyla: Beraat aldın. Ama yüzün bir beraat kazanmış gibi değil.
- “Sabit değildir” dedi hâkim. “İşlemedi” demedi. Arada bir fark var.
leyla: Var. O fark, hukukun en dürüst cümlesidir: “bilmiyorum, o yüzden cezalandırmıyorum.” Bir gün o farkı sevmeyi öğrenirsin. Bugün değil.
leyla: Savcılığa yazmadın. Bir isim buldun, kürsüde eğip büktün, ama bir dilekçeye dökmedin. O yüzden gerçek fail hâlâ dışarıda.
- Biliyorum. Bir daha olmayacak.
leyla: Olmayacak. Ortak avukat bunu bir kere öğrenir.
> Gitti. Masamda Defne’nin resmi duruyordu; Selim’e vermeyi yine unutmuştum. Bir masa, bir ekran, bir adam ve odanın içinde bir güneş.
~ Selim eve gitti. Bir şirketin hafızası hâlâ bir yerde, bir yedeğin olmadığı bir boşlukta. Ve bir ismin soruşturması, benim yazmadığım bir dilekçenin boşluğunda bekliyor.
~ Kazandım. Ama kazanmakla doğruyu bulmak arasındaki farkı, bu gece bir kez daha öğrendim. Bunu bilmek, bana kalan.
`),
      ],
    }),
    outcome('NITELENDIRME', {
      class: 'RECHARACTERIZED',
      priority: 4,
      when: all(not(flag('cokus')), not(flag('selim_giris')), ref('riza_kanit'), finalAtLeast(T_INDIRIM)),
      stamp: 'YENİ VASIF',
      stampTone: 'amber',
      sentence: '244/2’den beraat · 243/1’den adli para cezası, HAGB',
      verdictText:
        'Sanık Selim Aktaş’ın verileri yok etme suçunu (TCK 244/2) işlediği sabit olmadığından bu suçtan CMK 223/2-e uyarınca BERAATİNE; ancak 17 Ekim saat 21.30’daki erişimin kapsamı yönünden eylemin TCK 243/1 kapsamında kaldığı kabul edilerek, suçun işleniş biçimi ve sanığın kişiliği gözetilerek TCK 243/1 uyarınca ADLİ PARA CEZASI ile cezalandırılmasına; sanığın kişiliği ve suçu işledikten sonraki davranışları lehine kanaat oluşturduğundan hükmün açıklanmasının geri bırakılmasına (CMK 231/5); beş yıl denetim süresine karar verildi.',
      reasoning: [
        because('Silme eylemi (TCK 244/2) güvenilir delille sanığa bağlanamamıştır; bu suçtan beraat gerekmiştir.'),
        because(
          'Erişimin izin kapsamını bir ölçüde aştığı değerlendirildiğinden eylem TCK 243/1 olarak nitelendirilmiş; cezası seçimlik adli para cezası olarak belirlenmiştir.',
        ),
        because('Ceza miktarı ve sanığın geçmişi gözetilerek hükmün açıklanmasının geri bırakılmasına karar verilmiştir (CMK 231/5).'),
      ],
      legalBasis: 'TCK 244/2 (beraat); TCK 243/1, 61, 52; CMK 223/2-e, 231/5',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Silmeyi sanıktan koparabildin ama girişin tümüyle izinli olduğunu kuramadın; silme suçundan beraat, giriş adli para cezası ve HAGB.',
      epilogue: [
        O(`
kemal: Sanığın verileri yok etme suçundan beraatine; sisteme girme suçundan adli para cezasına ve hükmün açıklanmasının geri bırakılmasına…
> Selim rakamları duydu, bana döndü. “Yani hapis yok mu?” Başımı salladım. “Ama bir ceza var” dedi. “Küçük bir ceza. Kendi fotoğraflarımı almaktan.”
# ADLİYE ÖNÜ [bg:adliye]
> Gül, Selim’in elini tuttu. Rahatlama ve kırgınlık; ikisi aynı yüzde.
gul: Hapis yok. Ama kaydında bir şey kaldı, değil mi?
- Beş yıl temiz kalırsa o da silinecek. Bu kez usulünce.
~ Silme suçundan kurtardım; ama o e-postayı bir gün önce bulsaydım, giriş de kalmazdı. Bir günlük gecikme, bir adli para cezası.
`),
        W(
          flag('selim_suclama'),
          `
> Selim son sözde bir isim haykırmıştı. Hâkim o ismi tutanağa almadı; ama salonda herkes duydu. Bazen bir öfke, bir beraati bir nitelendirmeye çevirir.
`,
        ),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 5,
      when: { all: [] },
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      sentence: '2 yıl hapis',
      verdictText:
        'Sanık Selim Aktaş’ın üzerine atılı verileri yok etme (TCK 244/2) ve bilişim sistemine girme (TCK 243/1) suçlarını işlediği sabit görülerek; suçun işleniş biçimi ve meydana gelen zararın ağırlığı gözetilerek TCK 61 uyarınca verileri yok etme suçundan 1 YIL 8 AY, sisteme girme suçundan 4 AY olmak üzere ayrı ayrı cezalandırılmasına, cezaların toplanmasıyla sonuç olarak 2 YIL HAPİS; TCK 53; TCK 63 mahsup; cezanın miktarı ve sanığın olumsuz kişilik değerlendirmesi nedeniyle hükmün açıklanmasının geri bırakılmasına ve ertelemeye yer olmadığına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi (CMK 273/1).',
      reasoning: [
        because('Oturum dökümü ve DataKale raporu silme eyleminin sanığın kullanıcı adıyla yapıldığını göstermektedir.'),
        because('Savunmanın delillere yönelik itirazları somut biçimde ispatlanamamış; imajın güvenilmezliği ve rıza yeterince ortaya konamamıştır.', not(flag('cokus'))),
        because('Savunmanın inandırıcılığı duruşmada çöktüğünden mahkeme iddianamedeki anlatımı esas almıştır.', flag('cokus')),
      ],
      legalBasis: 'TCK 243/1, 244/2, 61, 53, 63; CMK 273/1',
      xp: {
        if: {
          when: flag('cokus'),
          then: xp(0.3, { ethicsVar: 'ethics' }),
          else: xp(0.6, { ethicsVar: 'ethics' }),
        },
      },
      howToReach:
        'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir. Yanlış delil ve dayanaksız itiraz güvenilirliği eritir; imajı çürütmeden ve rızayı kurmadan beraat gelmez.',
      epilogue: [
        W(
          flag('cokus'),
          `
# SALON · HÜKÜMDEN SONRA [bg:durusma_salonu]
> Salon boşaldı. Selim bir süre oturduğu yerde kaldı; sonra Gül onu kolundan tuttu, kaldırdı.
> Savcı Ferda Yalın dosyasını topladı. Kapıya giderken durdu.
ferda: Kayıt vardı bu dosyada avukat hanım. Ham kayıt, kart kaydı, bir poliçe. Kâğıtla gelmeliydiniz; hararetle değil.
> Kapı kapandı. Kalorifer tıkırdadı. Başka ses yoktu.
`,
        ),
        O(`
# ADLİYE KORİDORU · HÜKÜMDEN SONRA [bg:adliye]
> “İki yıl.” Kelime koridora benden önce çıktı. Gül, Defne’nin resmini çantasına koydu; katlayarak, dikkatle, bir daha açmamak ister gibi.
> Selim pencerenin önünde durdu. Aşağıda otopark; siyah, uzun bir araba çıkıyordu. Uzun uzun baktı. Bu kez plakayı o okudu.
selim: Ne erteleme ne geri bırakma, diyorlar. İki yıl. Komşular, Defne’nin öğretmeni, bakkal. Hepsi “o adam” diyecek.
- İstinaf var Selim. İki hafta içinde. Hüküm kesinleşmeden kimse seni bir yere götüremez.
gul: İki hafta. Defne’nin doğum günü on gün sonra. Pasta mı alayım, dilekçe mi yazayım avukat hanım?
- İkisini de. Pastayı siz alın. Dilekçeyi ben yazarım.
> Gül güldü; ağlamaya benzeyen bir gülüş. Selim’in elini tuttu, bıraktı, yeniden tuttu.
> Koridorun ucunda Ozan Tekin cübbesini katlıyordu. Bize bakmadı. Kazananlar koridorlarda kimseye bakmaz; kaybedenler herkese bakar.
~ Bir yol daha. Ama elimde kalan kâğıtları bir celse önce doğru yerde açamadım. İstinaf, geç kalmış bir cümlenin ikinci şansıdır.
`),
        W(
          any(has('ded_gm_cihaz'), has('ded_gm_hat'), flag('fact_gm')),
          `
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Panoda bir isim vardı; onu kürsüde kurmaya yetmedim. Bir suç duyurusu yazacağım; bu kez geç. Bir istinaf dilekçesine ek olarak.
~ Bir cihaz adı buldum, bir hat, bir kart. Hepsi doğruydu. Ama doğru delili yanlış sırayla, yanlış sesle sundum. Hüküm, bir sesin tonuyla da yazılır.
`,
        ),
      ],
    }),
  ],
};
