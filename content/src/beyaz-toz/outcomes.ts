import {
  all,
  always,
  any,
  because,
  flag,
  has,
  not,
  outcome,
  ref,
  xp,
  cmp,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { card, me, n, s, th, voice } from './shared.js';

// 90-outcomes: beş sonuç. Öncelik sırası: sahte tanık (TELKİN), 223/2-b, 223/2-e, 191'e dönüşüm (HAGB), mahkûmiyet.
// Hiçbir sonuç puan ya da ikna eşiği taşımaz: hüküm yalnızca duruşmada kurulan kayda (bayraklar, sunulan deliller)
// bağlıdır. Erken çözümü puan değil delil önkoşulları engeller (tasarım belgesi §12). Özensiz oyun yalnızca kapanış
// sahnesinde Deniz’in ve Leyla’nın sözlerini değiştirir, hükmü değil.
// Kararın gerekçe satırları duruşmada kurulan bayraklara göre seçilir; hiçbir satır duruşmada çürütülmüş bir olguya dayanmaz.

/** Muhbirin anlatısı duruşmada sarsıldı mı? */
const muhbirSarsildi = any(flag('contra_t3'), flag('contra_t4'), flag('contra_t5'), flag('tolga_kirildi'));
/** Muhbirin satış anlatımı esasen çöktü mü (kapıdaki kasklı adam, saat ya da dönüş)? Kask tutarsızlığı (T5) tek başına değil. */
const muhbirCoktu = any(flag('contra_t3'), flag('contra_t4'), flag('tolga_kirildi'));

export const outcomes: CasePart = {
  outcomes: [
    outcome('TELKIN', {
      class: 'CONVICTION',
      priority: 1,
      when: flag('okan_tanik'),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '12 yıl 6 ay hapis · 125.000 TL adli para cezası',
      verdictText:
        'Sanık Kaan Yıldız’ın eylemine uyan TCK 188/3 uyarınca takdiren alt sınırdan 10 yıl hapis ve 1.000 gün adli para cezası; maddenin kokain olması nedeniyle TCK 188/4-a uyarınca yarı oranında artırılarak 15 yıl hapis ve 1.500 gün adli para cezası; sanığın sabıkasız geçmişi gözetilerek TCK 62/1 uyarınca 1/6 oranında indirilerek 12 yıl 6 ay hapis ve 1.250 gün adli para cezası ile CEZALANDIRILMASINA; bir gün karşılığı en az 100 TL’den 125.000 TL adli para cezasına (TCK 52/2); TCK 53 uyarınca hak yoksunluklarına; tutukluluk hâlinin devamına (adli kontrolle tahliye edilmişse hükümle birlikte tutuklanmasına); tanık Okan Er ve tanığa ifade yazdıranlar hakkında suç duyurusunda bulunulmasına; müdafi hakkında baroya bildirimde bulunulmasına; tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Savunma tanığı Okan Er, para karşılığı ve kendisine yazdırılan bir beyanla dinlendiğini duruşmada kabul etmiştir.',
        ),
        because(
          'Savunmanın arka odayı bir ev arkadaşına bağlayan anlatımı para karşılığı bir tanıkla desteklenmek istendiğinden heyet, bu anlatıma ve ona dayanan savunma beyanlarına itibar etmemiştir (CMK 217).',
        ),
        because(
          'Muhbir tanık duruşmada paketi Daire 7’den sanıktan aldığını beyan etmiş; müdafi tanığa soru sormamıştır.',
        ),
        because(
          'Kira sözleşmesi sanık adınadır; arka odada ve ortak alanda ele geçen paketler, hassas terazi ve kilitli poşetler ticaret kastını göstermektedir.',
          not(flag('contra_s3')),
        ),
        because(
          'Arka odadaki materyal kararın kapsamı dışında, kilit kırılarak elde edildiğinden hükme esas alınmamıştır (Anayasa 38/6, CMK 206/2-a, 217/2); bu sonuç tanığın durumundan bağımsızdır.',
          flag('contra_s3'),
        ),
        because(
          'Ortak alandaki şekerlikte satışa hazır hâlde iki paket ele geçmiş, kavanozda sanığın izi bulunmuştur; heyet bu paketleri, savunmanın çöken anlatımı karşısında sanığın zilyetliğinde kabul etmiştir (CMK 217).',
          flag('contra_s3'),
        ),
      ],
      legalBasis: 'TCK 188/3, 188/4-a, 52, 53, 62/1; CMK 206/2-a, 217, 273/1; Anayasa 38/6; TCK 272, 38; Av.K. 34',
      xp: xp(0),
      howToReach: 'Para karşılığı bir tanığın beyanını hazırlamak (etik ihlali). Bu sona ulaşmamak gerekir.',
      ethicsCard:
        'Para karşılığı tanıklık ve tanığa beyan yazdırmak yalan tanıklığa azmettirmedir (TCK 272, 38) ve avukat için ağır disiplin ihlalidir (Av.K. 34; TBB Meslek Kuralları). Bir yalan, savunmanın bütün gerçeklerini yanında götürür.',
      epilogue: [
        {
          lines: [
            s('baskan', 'Türk Milleti adına…'),
            n(
              '“On iki yıl altı ay.” Kaan rakamı duydu; anlamını duymadı. Jandarma koluna dokundu. Kaan ablasına bakmadı. Bakamadı.',
            ),
            card('ADLİYE KORİDORU — AKŞAMÜSTÜ', 'adliye'),
            n(
              'Okan koridorda iki polisin yanında bir ifade tutanağı imzalıyordu. Defne bir sandalyede oturuyordu; çantasındaki zarf hâlâ oradaydı. Kimse ona dokunmamıştı.',
            ),
            s(
              'defne',
              'Ben istedim. Siz de “tutarlı olsun” dediniz. İkimiz de… ikimiz de onu kurtarmak istedik.',
              'uzgun',
            ),
            th('Kurtarmak istedik. Bir yalanla. Ve yalan, kilidi de, krokiyi de, randevu kartını da yanında götürdü.'),
            card('ARSLAN HUKUK — O GECE', 'buro_gece'),
            n(
              'Masamda bir kitapçık vardı: Türkiye Barolar Birliği Meslek Kuralları. Leyla bırakmıştı. Bir not yoktu. Sigara paketi yerinde, açılmamış.',
            ),
            n('Kitapçığın bir sayfasının köşesi kıvrılmıştı. Okumadım. Ne yazdığını biliyordum.'),
          ],
        },
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(
        not(flag('cokus')),
        // “İşlemediğinin sabit olması” olumlu ispat ister: satışı yapanın Barış olduğu (muhbirin dönüşü + terazideki iz +
        // 9 Kasım GPS kaydı + sanığın o saatteki mazereti), arka odanın ona kiralandığı (oda varsayımının çöküşü + ev
        // sahibinin defteri), baskın sabahı kaçışı (GPS 07.16 + Nesrin) ve usulüne uygun el konulan çantası.
        flag('tolga_kirildi'),
        flag('jar_cleared'),
        has('ev_iz_eslesme'),
        flag('contra_t4'),
        flag('fact_gps9'),
        has('ded_kacis'),
        flag('contra_s2'),
        flag('defter_sunuldu'),
        has('ev_canta'),
        flag('gercek_fail'),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık Kaan Yıldız’ın üzerine atılı suçu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; başka suçtan tutuklu değilse derhal tahliyesine (adli kontrol altındaysa adli kontrolün kaldırılmasına); CMK 141/1 uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 uyarınca yapılabileceğinin bildirilmesine (CMK 231/3); ele geçen maddenin müsaderesine (TCK 54); karar ve dosya örneğinin Barış Demirel hakkındaki soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere.',
      reasoning: [
        because(
          'Terazideki parmak izi Barış Demirel’e aittir; kurye kayıtları onu baskın sabahı olay yerinde ve muhbirin paketi aldığı saatte binanın kapısında göstermektedir.',
        ),
        because(
          'Muhbir tanık, paketi Barış Demirel’den aldığını, sanığın adını korku ve kin nedeniyle verdiğini duruşmada beyan etmiştir; sanık o saatte işyerinde kasa başındadır (Z raporu).',
        ),
        because(
          'Ev sahibinin kira defteri arka odanın Barış Demirel’e kiralandığını göstermektedir; Demirel baskın sabahı binanın önünden dönmüş, ertesi gün işi bırakmıştır.',
        ),
        because(
          'Savcılıkça usulüne uygun el konulan kurye çantasının astarındaki gizli bölmede kokain bulaşığı ve kilitli poşet artıkları bulunmuştur (CMK 123, 127).',
        ),
        because(
          'Arka odanın sanığa ait olduğu kolluk tarafından varsayılmıştır; oda üçüncü kişinin kilitli odasıdır.',
          flag('contra_s2'),
        ),
        because(
          'Arka odadaki materyal kararın kapsamı dışında, kilit kırılarak elde edildiğinden ayrıca hukuka aykırıdır (Anayasa 38/6, CMK 206/2-a, 217/2).',
          flag('key_excluded'),
        ),
        because(
          'Sanığın madde kullanıcısı olması, yüklenen ticaret fiilini göstermez; kullanım iddianamedeki fiil değildir (CMK 225/1).',
        ),
        because('Bu deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 141, 142, 231/3; TCK 54; Anayasa 38/6; CMK 206/2-a, 217/2, 225/1',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Barış’ın kimliğiyle suç duyurusu ve gece gelen telefonun bildirimi (yakalanır, iz eşleşir); muhbiri kask ve saat çelişkisiyle sarsıp adını söylet; esas savunmada gerçek faili göster.',
      epilogue: [
        {
          lines: [
            s('baskan', 'Türk Milleti adına…'),
            n(
              '“Beraatine.” Kaan kelimeyi duyduğunda gözlüğünü çıkardı. Bandı yerindeydi. Gözlüğü katladı, cebine koydu, sonra yeniden taktı; ne yapacağını bilmeyen eller.',
            ),
            n('Defne ayağa kalkmamıştı. Oturduğu yerde iki elini yüzüne kapadı. Omuzları bir kez sarsıldı; o kadar.'),
            card('ADLİYE MERDİVENLERİ — ÖĞLEDEN SONRA', 'adliye'),
            n(
              'Ayaz dinmişti. Uludağ’ın üstünde, aylardır ilk kez, karlı bir zirve görünüyordu. Merdivenler kuru ve aydınlıktı.',
            ),
            n(
              'Kaan merdivenin başında durdu, gökyüzüne baktı. Defne yanına geldi, kardeşinin yakasını düzeltti. Bu sefer bir şey söylemedi.',
            ),
            s('kaan', 'Perşembe randevum var. Kaçırmayacağım. Bunu da bir yere yazın, avukat hanım.'),
            me('Kendin yaz. Avucuna değil; bir deftere.'),
          ],
        },
        {
          when: flag('defter_sunuldu'),
          lines: [
            n(
              'Koridorun ucunda Nesrin Hanım kareli defterini çantasına yerleştiriyordu. “Kayıt insandan uzun yaşar” dedi, kimseye değil, kendine.',
            ),
          ],
        },
        {
          lines: [
            card(
              'BARIŞ DEMİREL HAKKINDA İDDİANAME DÜZENLENDİ. TOLGA KAPLAN HAKKINDA İFTİRA SORUŞTURMASI AÇILDI.',
              'siyah',
            ),
            card('ARSLAN HUKUK — O GECE', 'buro_gece'),
            n('Leyla masasındaki ters çerçeveyi çevirdi; bir an, yalnızca bir an. Sonra yeniden ters koydu.'),
            th('Ece’yi düşündüm. “Sadece hafta sonları” derdi. Kaan’ın hafta sonları artık bir deftere yazılıyor.'),
            s(
              'leyla',
              'Bir müvekkilin sırrını mahkemede o kendisi söyledi, Deniz. Sen sadece kapıyı açık tuttun. Bunu unutma. Bir gün bunu konuşacağız.',
            ),
            th(
              'Bir oda, iki kapı, bir kilit. Kilidi bir keski açmıştı; doğruyu bir parmak izi. Ve Kaan’ı, kendi sesi.',
            ),
          ],
        },
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      // Delil zinciri (beraat_e) kurulduysa heyet beraat eder; puan, esas savunmanın biçimi ve ikna sayacı hükmü
      // değiştirmez. Kayıt sanık lehineyken mahkûmiyet hukuken savunulamaz; özensiz oyun yalnızca kapanışı değiştirir.
      when: ref('beraat_e'),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Tahliye',
      verdictText:
        'Sanık Kaan Yıldız’ın üzerine atılı suçu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; başka suçtan tutuklu değilse derhal tahliyesine (adli kontrol altındaysa adli kontrolün kaldırılmasına); CMK 141/1 uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142 uyarınca yapılabileceğinin bildirilmesine (CMK 231/3); ele geçen maddenin müsaderesine (TCK 54); arka odanın kiracısı hakkında suç duyurusunda bulunulmasına; istinaf yolu açık olmak üzere.',
      reasoning: [
        because(
          'Arka odanın sanığın kullanımında olduğu tespit edilmemiş, kolluk tarafından varsayılmıştır; sanık ön odada yaşamakta ve orada uyurken bulunmuştur.',
          flag('contra_s2'),
        ),
        because(
          'Arka oda üçüncü kişiye ait kilitli bir odadır; kilit kararın kapsamı dışında kırılarak açılmıştır (CMK 119/1–2).',
          flag('contra_s3'),
        ),
        because(
          'Kapsam dışı aramayla elde edilen materyal hükme esas alınmamıştır (Anayasa 38/6, CMK 206/2-a, 217/2, 230/1-b).',
          flag('key_excluded'),
        ),
        because(
          'Terazideki parmak izi Barış Demirel’e aittir; muhbir tanık paketi ondan aldığını ve sanığın adını korkudan verdiğini duruşmada beyan etmiştir.',
          all(flag('tolga_kirildi'), has('ev_iz_eslesme')),
        ),
        because(
          'Savunmanın sunduğu uzman mütalaasına göre şekerlikteki iki paket arka odadaki stoktan ayrılmıştır (ardışık poşet numaraları, aynı kapatma izi, aynı saflık); paketlerde sanığın izi yoktur ve sanığın zilyetliğinde oldukları gösterilememiştir (CMK 67/6, 217).',
          all(flag('jar_cleared'), has('ded_stok')),
        ),
        because(
          'Muhbir tanık, şekerlikteki paketleri arka odanın kiracısının aldığını duruşmada anlatmıştır; paketlerin sanığın zilyetliğinde olduğu gösterilememiştir.',
          all(flag('jar_cleared'), not(has('ded_stok'))),
        ),
        because(
          'Muhbir tanığın anlatımı kendi kolluk ifadesiyle çelişmektedir; tarif ettiği satıcı kasklıdır, sanığın ne kaskı ne ehliyeti vardır.',
          any(flag('contra_t3'), flag('contra_t5')),
        ),
        because(
          'Sanık, muhbirin paketi aldığını söylediği saatte işyerinde kasa başındadır (Z raporu).',
          flag('contra_t4'),
        ),
        because(
          'Arka odadaki materyal üçüncü kişinin kilitli odasında ele geçmiştir; dairede madde bulunduğunu gösterse de muhbirin satıcının kimliğine ilişkin anlatımını doğrulamaz.',
          all(not(muhbirSarsildi), not(flag('key_excluded'))),
        ),
        because(
          'Geriye kalan muhbir beyanı, etkin pişmanlık beklentisiyle verilmiş ve kimlik yönünden başka bir delille desteklenmeyen tek beyandır; tek başına hükme esas alınamaz.',
          not(muhbirSarsildi),
        ),
        because(
          'Müdafiin duruşma sonundaki ilgisiz sunumları kayıttaki delilleri değiştirmez; heyet hükmü duruşmada kurulan kayda dayandırmıştır.',
          flag('cokus'),
        ),
        because(
          'Savcı bulunmaksızın yapılan aramada iki yerine tek tanık bulundurulmuş; o tanık da aramanın başında değil, kilitli kapı açıldıktan sonra çağrılmıştır (CMK 119/4).',
          flag('contra_s4'),
        ),
        because(
          'Sanığın odasındaki ilaçlar ve randevu kartı bir tedavi sürecine aittir; kullanıcı profili satıcı profili değildir.',
          flag('contra_s5'),
        ),
        because(
          'Ev sahibinin olay zamanında tuttuğu kira defteri, arka odanın üçüncü kişiye kiralandığını göstermektedir.',
          flag('defter_sunuldu'),
        ),
        because(
          'Şekerlik mutfakta değil arka oda kapısının yanındaki raftadır; kolluk tanığı bunu kabul etmiştir.',
          flag('contra_s6'),
        ),
        because(
          'Sanığın madde kullanıcısı olması tek başına ticaret kastını göstermez; kullanım iddianamedeki fiil değildir (CMK 225/1).',
        ),
        because(
          'Müdafi esas hakkındaki savunmasında kuşkunun sanık lehine değerlendirilmesini istemiştir; heyet bu talebi kayıtla uyumlu bulmuştur.',
          flag('beraat_savunma'),
        ),
        because(
          'Sanığın suçu işlediğine dair kesin ve inandırıcı delil yoktur; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; AİHS 6/2; CMK 141, 142, 231/3; TCK 54; CMK 119, 206/2-a, 217/2, 225/1',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Krokiyi ve ön odayı birleştirip polise “varsaydım” dedirt; şekerliği arka odanın stoğuna bağla; muhbirin kask ya da saat çelişkisini delille ortaya koy; esas savunmada şüphe.',
      epilogue: [
        {
          lines: [
            s('baskan', 'Türk Milleti adına…'),
            n(
              '“Sabit olmadığından… beraatine.” Kaan kelimeleri tek tek duydu; sonuncusunda nefesini verdi. Uzun, sessiz, üç ay birikmiş bir nefes.',
            ),
            card('ADLİYE KORİDORU — ÖĞLEDEN SONRA', 'adliye'),
            n(
              'Koridor kalabalıktı. İki avukat, bir sanık yakını, bir çaycı. Kaan’ın yanından geçen biri, kimseye söylemiyormuş gibi söyledi:',
            ),
            voice('BİR SES', 'Şüpheden yararlandı.', 'whisper'),
            n(
              'Kaan duydu. Durdu. Sonra yürümeye devam etti. Defne kolunu kardeşinin koluna geçirdi; bir eczacının ilaç tartarken kullandığı dikkatle.',
            ),
            s('kaan', 'Şüpheden yararlandım. Üç ay boyunca şüpheden zarar gördüm; bir kere de yararlanayım.', 'mutlu'),
            card('ADLİYE MERDİVENLERİ — AKŞAMÜSTÜ', 'adliye'),
            n(
              'Dışarıda ayaz vardı ve güneş batıyordu. Merdivenlerin dibinde Nesrin Hanım, kareli defterini kucağına bastırmış, bir taksi bekliyordu.',
            ),
            s(
              'nesrin',
              'Kedilere geç kaldım evladım. Pamuk küser şimdi. Kaan, sen pazar günü bir çaya gel. Şekersiz içersin, biliyorum.',
              'mutlu',
            ),
            s('kaan', 'Gelirim, Nesrin Teyze. Şekerliğe dokunmam.'),
            n(
              'İkisi de güldü. Defne bir an onlara baktı, sonra başını öbür tarafa çevirdi; ağlamamak için değil, ağladığı görülmesin diye.',
            ),
          ],
        },
        {
          when: not(any(flag('kaan_riza'), flag('anne_kaan'))),
          lines: [
            n(
              'Kaan merdivenlerin başında durdu, cebinden telefonunu çıkardı, bir numara çevirdi. “Anne. Bitti. Hayır, sınav değildi. Eve geliyorum.” Sesi titremedi.',
            ),
          ],
        },
        {
          when: any(flag('kaan_riza'), flag('anne_kaan')),
          lines: [
            n(
              'Merdivenlerin dibinde beyaz saçlı bir kadın bekliyordu; tespihi elinde, bu sefer çevirmeden. Kaan iki basamak birden indi. “Anne. Bitti. Eve gidiyoruz.” Sesi titremedi.',
            ),
          ],
        },
        {
          lines: [
            n(
              'Defne bana döndü. Elini uzattı; eczacı eli, sabit, soğuk, kesin. Sonra vazgeçti ve bana sarıldı. Kısa, sert, bir kere.',
            ),
            s(
              'defne',
              'Bir zarf daha getireceğim. Bu sefer bir teşekkür kartıyla. Ve hayır, kart için ücret almayacaksınız.',
              'mutlu',
            ),
            th(
              'Bir dosya kapanırken herkes kendi hikâyesine döner. Nesrin kedilerine, Defne eczanesine, Kaan perşembe randevusuna. Ben masama. Masamda bir sonraki dosya.',
            ),
          ],
        },
        {
          when: flag('suc_duyurusu'),
          lines: [
            th(
              'Barış Demirel hakkında bir yakalama kararı vardı. Nerede olduğunu kimse bilmiyordu. Ama adı artık bir dosyanın kapağındaydı; Kaan’ınki değil.',
            ),
          ],
        },
        {
          when: not(flag('suc_duyurusu')),
          lines: [
            th(
              'Arka odanın kiracısı hâlâ bir hayaletti. Bir gün bir yerde bir kapıyı daha açacaktı. Kimin kapısını, bilmiyordum.',
            ),
          ],
        },
        {
          when: any(cmp(v('wrong'), '>=', 3), cmp(v('cred'), '<=', 2)),
          lines: [
            th(
              'Merdivenlerden inerken tutanağın kopyası koltuğumun altındaydı. Yanlış sunduğum kartlar da oradaydı, boşa giden itirazlar da. Kayıt kazandırdı; ben değil.',
            ),
          ],
        },
        {
          lines: [
            card('ARSLAN HUKUK — O GECE', 'buro_gece'),
            n(
              'Leyla masamın kenarına oturdu. Bunu ilk kez yapıyordu. Sigara paketini avucunda çevirdi, bir kez, iki kez.',
            ),
            s(
              'leyla',
              'Muhbir adı söylemedi. Polis “varsaydım” dedi. Savcı bir isim istedi, sen bir şüphe verdin. Mahkeme şüpheyi kabul etti.',
            ),
            s(
              'leyla',
              'Bir gün o arka odanın sahibi bir yerde yakalanacak. O gün dosyayı yeniden açarlar ve senin bulduğun kilit, kroki, şekerlik orada olacak. Kâğıtlar insandan uzun yaşar.',
            ),
            me('Nesrin Hanım da öyle diyor. “Kayıt insandan uzun yaşar.”'),
            s('leyla', 'Akıllı kadın. Bir gün bize çaya çağır onu. Kedileriyle birlikte.', 'mutlu'),
          ],
        },
        {
          when: any(cmp(v('wrong'), '>=', 3), cmp(v('cred'), '<=', 2)),
          lines: [
            s(
              'leyla',
              'Bir şey daha. Bugün kayıt seni taşıdı. Yanlış kartlar, boş itirazlar; bir heyet bunları da yazar. Bir dahaki sefere kayıt bu kadar sağlam olmayabilir.',
            ),
          ],
        },
        {
          lines: [
            s(
              'leyla',
              'Beraat iki türlüdür, demiştim. Bugün “yapmadı” diyemedin; “yaptığı ispatlanamadı” dedin. Bu da bir beraattir. Bazen yeterlidir.',
            ),
            th(
              'Bazen adalet bir kapıyı açar, ama odanın ışığını yakmaz. Kaan bu akşam evinde, kendi odasında, kendi ışığını yakacak. Arka oda karanlık kalacak.',
            ),
            n(
              'Leyla paltosunu giydi, kapıya yürüdü, durdu. Masamdaki sarı yapışkan notlardan birini aldı: “önce bul, sonra inan.” Okudu, geri yapıştırdı.',
            ),
            s('leyla', 'Bunu kaldırma. Bir sonraki dosyada da lazım olacak.'),
            th('Kaldırmadım. Hâlâ orada. Masamın köşesinde, ters çevrilmiş bir çerçeve olmadan.'),
            th(
              'Gece eve dönerken rehberde Ece’nin numarasını buldum. Yıllardır aramadığım, silemediğim numara. Onun dosyasını kimse okumamıştı. Kaan’ınkini okudum. Bu da bir şeydi.',
            ),
          ],
        },
      ],
    }),
    outcome('NITELIK_191', {
      class: 'RECHARACTERIZED',
      priority: 4,
      when: all(
        not(flag('jar_cleared')),
        // 191 kaydın kendisinden doğar: arka oda sanığa bağlanamadı (oda varsayımı çöktü), muhbirin satış anlatımı zaman
        // bakımından çöktü (Z raporu) ve şekerlik aklanmadı; geriye bir kullanıcının (saç analizi) ortak alandaki iki
        // paketi kalır. Bu kayıtta mütalaa T_05N'ye gider ve CMK 226 hatırlatması (ek savunma) her durumda yapılır.
        flag('contra_s2'),
        muhbirCoktu,
        flag('ek_savunma'),
      ),
      stamp: 'NİTELİK DEĞİŞTİ',
      stampTone: 'amber',
      sentence: '2 yıl hapis · hükmün açıklanması geri bırakıldı',
      verdictText:
        'Sanığın eyleminin TCK 191/1’de tanımlanan kullanmak için bulundurma suçunu oluşturduğu, CMK 226 uyarınca ek savunması alınarak kabul edildiğinden: TCK 191/1 uyarınca alt sınırdan 2 yıl hapis cezasıyla cezalandırılmasına; TCK 191/8 uyarınca HÜKMÜN AÇIKLANMASININ GERİ BIRAKILMASINA; beş yıl denetim süresi içinde denetimli serbestlik tedbiri uygulanmasına ve gerekli görülürse tedaviye tabi tutulmasına (CMK 231/8, TCK 191/3); tahliyesine; ele geçen maddenin müsaderesine (TCK 54); itiraz yolu açık olmak üzere (CMK 231/12).',
      reasoning: [
        because('Arka odanın sanığa ait olduğu ispat edilememiştir; ticaret kastı sabit değildir.', flag('contra_s2')),
        because(
          'Sanığın 9 Kasım gecesi işyerinde kasa başında olduğu Z raporuyla sabittir; muhbirin satış anlatımı hükme esas alınmamıştır. Satış ya da satışa arz fiili ispatlanamamıştır.',
          flag('contra_t4'),
        ),
        because(
          'Muhbir tanık duruşmada paketi sanıktan değil arka odanın kiracısından aldığını beyan etmiştir; satış ya da satışa arz fiili sanık yönünden ispatlanamamıştır.',
          all(flag('tolga_kirildi'), not(flag('contra_t4'))),
        ),
        because(
          'Muhbir tanığın tarif ettiği satıcı kasklı bir kuryedir; sanığın ne kaskı ne ehliyeti vardır. Satış anlatımı sanığa bağlanamamış, hükme esas alınmamıştır.',
          all(flag('contra_t3'), not(flag('contra_t4')), not(flag('tolga_kirildi'))),
        ),
        because(
          'Duruşma müdafiin ilgisiz sunumları üzerine kısa kesilmiş; heyet nitelik değişikliğini sanığa hatırlatarak ek savunmasını almıştır (CMK 226/1).',
          flag('cokus'),
        ),
        because(
          'Ortak alandaki şekerlikte iki paket ele geçmiş, kavanozda sanığın izi bulunmuştur; sanığın kullanıcı olduğu saç analiziyle sabittir. Bu olgular kullanmak için bulundurmayla uyumludur.',
        ),
        because('Sanığın tedavi kayıtları kullanıcı profilini ayrıca doğrulamaktadır.', flag('contra_s5')),
        because('Sanık duruşmada madde kullandığını kendisi açıklamıştır.', flag('kaan_durust')),
        because(
          'Sanık terditli savunmasında eylemin en fazla kullanmak için bulundurma olduğunu ileri sürmüştür.',
          flag('terditli'),
        ),
        because(
          'Kovuşturma evresinde suçun münhasıran TCK 191 kapsamına girdiği anlaşıldığından hükmün açıklanması geri bırakılmıştır (TCK 191/8).',
        ),
      ],
      legalBasis: 'TCK 191/1, 191/3, 191/8; CMK 225/2, 226, 231/8, 231/12; TCK 54',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Odanın sanığa ait olmadığını göster, muhbirin satış anlatımını (kask, saat ya da dönüş) çürüt, ama şekerliği arka odanın stoğuna bağlayamazsan; ek savunma hakkını kullan.',
      epilogue: [
        {
          lines: [
            s('baskan', 'Türk Milleti adına…'),
            n(
              '“Hükmün açıklanmasının geri bırakılmasına.” Kaan bir an anlamadı. Bana baktı. Başımı salladım: dışarı çıkıyorsun, ama bir takvimle.',
            ),
            card('ADLİYE MERDİVENLERİ — ÖĞLEDEN SONRA', 'adliye'),
            n(
              'Ticaret düştü. Kullanım kaldı. Beş yıl: bir denetim memuru, bir doktor, bir test takvimi. Ve bir sicil satırı, açılmamış bir zarf gibi bekleyen.',
            ),
            s(
              'kaan',
              'Belki de hak ettiğim buydu, avukat hanım. Bir doktor ve bir takvim. Satmadım; ama kullandım. İkisini de söyledim.',
            ),
            s('defne', 'Şekerlik. Bir şekerlik yüzünden.', 'kizgin'),
            th(
              'Bir şekerlik. Arka odanın kapısının dibinde, kimsenin bakmadığı bir rafta. Ben de bakmadım. Ya da yeterince bakmadım.',
            ),
            card('ARSLAN HUKUK — O GECE', 'buro_gece'),
            s(
              'leyla',
              'Kaan bu gece evinde uyuyacak. Bunu küçümseme. Ama bir dahaki sefere savcının yedek planına da bak. Hep bir “ortak alan” vardır.',
            ),
            th(
              'Ece’ye kimse bir doktor, bir takvim vermemişti. Kaan’a bir mahkeme verdi. Yanlış kapıdan da olsa, bir kapı.',
            ),
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
      sentence: '12 yıl 6 ay hapis · 125.000 TL adli para cezası',
      verdictText:
        'Sanık Kaan Yıldız’ın eylemine uyan TCK 188/3 uyarınca takdiren alt sınırdan 10 yıl hapis ve 1.000 gün adli para cezası; maddenin kokain olması nedeniyle TCK 188/4-a uyarınca yarı oranında artırılarak 15 yıl hapis ve 1.500 gün adli para cezası; sabıkasız geçmişi ve cezanın geleceği üzerindeki olası etkileri gözetilerek TCK 62/1 uyarınca 1/6 oranında indirilerek 12 yıl 6 ay hapis ve 1.250 gün adli para cezası ile CEZALANDIRILMASINA; bir gün karşılığı en az 100 TL’den 125.000 TL adli para cezasına (TCK 52/2); TCK 53 uyarınca hak yoksunluklarına; ele geçen maddenin müsaderesine (TCK 54); tutukluluk hâlinin devamına (adli kontrolle tahliye edilmişse hükümle birlikte tutuklanmasına); tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      // Bu sonuca düşen kayıtlar: oda sanığa bağlı kaldı (contra_s2 yok) ya da oda bağlanamadı ama şekerlik aklanmadı
      // ve muhbirin satış anlatımı çökmedi. Oda bağlanamamış + şekerlik aklanmış kayıt beraattir; oda bağlanamamış +
      // anlatı çökmüş kayıt 191'dir (T_05N ya da çöküşte heyetin CMK 226 hatırlatması).
      reasoning: [
        because(
          'Kira sözleşmesi sanık adınadır; arka odanın sanığın kullanımında olmadığı gösterilememiştir. Arka odada ve ortak alanda ele geçen paketler, hassas terazi ve kilitli poşetler ticaret kastını göstermektedir.',
          all(not(flag('contra_s2')), not(flag('jar_cleared'))),
        ),
        because(
          'Kira sözleşmesi sanık adınadır; arka odanın sanığın kullanımında olmadığı gösterilememiştir. Orada ele geçen kırk altı paket, hassas terazi ve kilitli poşetler ticaret kastını göstermektedir; şekerlikteki iki paket hükme esas alınmamıştır.',
          all(not(flag('contra_s2')), flag('jar_cleared')),
        ),
        because(
          'Arka odanın kilidinin kırılarak açıldığı kayda geçmiştir; ancak odanın sanığın kullanımında olduğu çürütülemediğinden heyet aramayı kararın kapsamında saymıştır (CMK 119/1).',
          all(not(flag('contra_s2')), flag('contra_s3')),
        ),
        because(
          'Muhbir tanığın anlatımındaki çelişkiler kayda geçmiştir; hüküm muhbir beyanına değil, sanığın kullanımında kabul edilen arka odada ele geçen materyale dayanmaktadır.',
          all(not(flag('contra_s2')), muhbirSarsildi),
        ),
        because(
          'Muhbir tanığın paketi Daire 7’den sanıktan aldığına ilişkin beyanı da bu yöndedir.',
          all(not(flag('contra_s2')), not(muhbirSarsildi)),
        ),
        because(
          'Arka odanın sanığın kullanımında olduğu kanıtlanamamıştır; arka odadaki materyal sanığın zilyetliğine bağlanmamıştır.',
          flag('contra_s2'),
        ),
        because(
          'Arka odadaki materyal ayrıca kapsam dışı aramayla elde edildiğinden hükme esas alınmamıştır (Anayasa 38/6, CMK 206/2-a, 217/2).',
          flag('key_excluded'),
        ),
        because(
          'Muhbir tanığın 9 Kasım gecesi paketi Daire 7’den sanıktan aldığına ilişkin beyanı duruşmada çürütülmemiş; ortak alandaki şekerlikte satışa hazır hâlde ele geçen iki paket ve kavanozdaki sanığın iziyle desteklenmiştir. Hüküm bu satışa ve şekerlikteki paketlere dayanmaktadır (CMK 217).',
          flag('contra_s2'),
        ),
        because(
          'Muhbir tanığın kask ayrıntısındaki tutarsızlığı kayda geçmiştir; heyet bunu gece yarısı alınan ifadenin çevresel ayrıntısı saymıştır. Bu, istinafta denetlenecek bir delil takdiridir.',
          all(flag('contra_s2'), flag('contra_t5')),
        ),
        because(
          'Savunmanın duruşmada sunduğu belgeler ileri sürdüğü çelişkileri göstermemiş; heyet delilleri iddianamedeki anlatım doğrultusunda değerlendirmiştir (CMK 217).',
          all(flag('cokus'), not(flag('contra_s2'))),
        ),
        because(
          'Savunma, duruşmanın sonunda tanığa ilgisiz belgeler sunarak çapraz sorgu imkânını kendisi tüketmiştir; muhbirin anlatımı bu nedenle sınanamamıştır.',
          all(flag('cokus'), flag('contra_s2')),
        ),
      ],
      legalBasis: 'TCK 188/3, 188/4-a, 52, 53, 54, 62/1; CMK 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach: 'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir.',
      epilogue: [
        {
          when: flag('cokus'),
          lines: [
            s('baskan', 'Türk Milleti adına…'),
            n('Salon boşalırken Serap Akın dosyasını topladı. Yanımdan geçerken durdu.'),
            s('savci', 'Kilidi buldunuz, avukat hanım. Anahtarı kaybettiniz.'),
          ],
        },
        {
          lines: [
            n(
              '“On iki yıl altı ay.” Kaan rakamı tekrar etmedi. Gözlüğünü çıkarmadı. Sadece ellerine baktı; ilk görüşmedeki gibi.',
            ),
            card('ADLİYE ARKA KAPISI — AKŞAMÜSTÜ', 'adliye'),
            n('Ring aracının arka camı buğuluydu. Kaan parmağıyla bir pencere açmadı bu sefer. Araç hareket etti.'),
            n(
              'Defne kaldırımda kaldı. Elinde eczane poşeti; içinde, aylardır taşıdığı bir randevu kartı. 13 Kasım, Perşembe, 10.30.',
            ),
            th(
              'On iki buçuk yıl. Bir oda yüzünden. Bir kilit, bir kroki, bir şekerlik. Hepsi oradaydı; ben hepsini aynı cümlede kuramadım.',
            ),
            card('ARSLAN HUKUK — O GECE', 'buro_gece'),
            s('leyla', 'İstinaf var. İki hafta. Bu gece ağla, yarın yaz. Dosya bitmedi; sadece bir celse bitti.'),
          ],
        },
        {
          when: all(not(flag('cokus')), any(cmp(v('wrong'), '>=', 3), cmp(v('cred'), '<=', 2))),
          lines: [
            s(
              'leyla',
              'Tutanağı oku, Deniz. Yanlış kapılar, boş itirazlar, savrulan kartlar; heyet hepsini yazmış. Dağınık bir savunma, elindeki doğruyu bile bulanıklaştırır.',
            ),
            th(
              'Elimdeki parçaları bir hikâyeye değil, bir yığına çevirdim. İstinaf dilekçesinin ilk cümlesi belli: kayıt.',
            ),
          ],
        },
      ],
    }),
  ],
};
