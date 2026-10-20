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

// 90-outcomes: sonuçlar (öncelik sırasıyla) ve sonuca bağlı epiloglar. Eşikler meta’daki eşik çubuğuyla aynı.

export const T_NITEL = 3000;
export const T_BERAAT = 8000;
export const T_BERAAT_B = 9500;

export const outcomes: CasePart = {
  outcomes: [
    outcome('IKRAR', {
      class: 'OTHER',
      priority: 1,
      when: flag('ikrar_yolu'),
      stamp: 'ETİK İHLALİ',
      stampTone: 'red',
      sentence: '5 yıl 2 ay 15 gün hapis',
      verdictText:
        'Sanık Orhan Kılıç’ın, ikrarı ve zararın hükümden önce tamamen giderilmesi gözetilerek, zimmet suçundan TCK 247/1 uyarınca 5 YIL; hileli davranışla işlenmesi nedeniyle 247/2 ile yarı oranında artırılarak 7 YIL 6 AY; zincirleme suç nedeniyle TCK 43/1 ile dörtte bir oranında artırılarak 9 YIL 4 AY 15 GÜN; zararın kovuşturma evresinde gönüllü olarak giderilmesi nedeniyle TCK 248/3 ile üçte bir oranında indirilerek 6 YIL 3 AY; TCK 62/1 ile 5 YIL 2 AY 15 GÜN HAPİS cezası ile cezalandırılmasına; TCK 53; cezanın süresi nedeniyle CMK 231/5 ve TCK 51/1 koşulları bulunmadığına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1) karar verildi.',
      reasoning: [
        because('Sanık, ikinci celsede atılı suçu kabul etmiş ve kamu zararını hükümden önce tamamen gidermiştir.'),
        because(
          'Sanığın ikrarı, iptallerin hangi bilgisayardan ve nasıl yapıldığına ilişkin soruları cevapsız bırakmıştır; heyet bu çelişkiyi tutanağa geçirmiştir.',
        ),
        because('Etkin pişmanlık (TCK 248/3) ve takdiri indirim (TCK 62/1) uygulanmıştır.'),
      ],
      legalBasis: 'TCK 247/1-2, 43/1, 248/3, 61, 62/1, 53; CMK 231/5; TCK 51/1; CMK 273/1; Av.K. 34',
      xp: 0,
      howToReach:
        'Etkin pişmanlık yolunu müvekkile dürüstçe anlat; kararı ona bırak. Masum olduğunu söyleyen birine işlemediği bir suçu kabul ettirme.',
      ethicsCard:
        'Masum olduğunu söyleyen müvekkiline, işlemediği bir suçu kabul etmesini önerdin. Etkin pişmanlık (TCK 248) ikrar istemez; sen istedin. Avukat müvekkilini bilgilendirir, seçenekleri ve sonuçlarını dürüstçe anlatır; ama gerçeğe aykırı bir ikrarın yolunu açamaz (Av.K. 34; Avukatlık Meslek Kuralları md. 3–4). Güvenli görünen yol, bir insanın on dokuz yılına mal oldu.',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
> “Beş yıl iki ay on beş gün.” Orhan rakamları duydu. Rakamları ilk kez saymadı.
# ADLİYE ARKA KAPISI · ÖĞLEDEN SONRA [bg:adliye]
> Ring aracı geldi. Orhan arka kapıya yürürken durdu; gözlüğünü çıkardı, mendiliyle sildi, yeniden taktı. Sonra bindi.
> Nazan arabanın camına elini koydu. Kalabalığın içinde Elif yoktu. Okulda değildi; evde de değildi. Bir arkadaşının evindeydi, telefonunu kapatmıştı.
# YILDIRIM · BİR HAFTA SONRA [bg:ev]
> Daire boşaltılmıştı. Yeni sahipleri cuma taşınacaktı. Nazan son kutuyu bağlarken bana bir defter uzattı: yirmi üçüncü cilt.
nazan: Orhan size versin istedi. Son sayfayı okuyun dedi.
> Son sayfada, kurşun kalemle, Orhan’ın düzgün el yazısı: “Bugün ilk kez yanlış saydım.”
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Masamda ince bir kitapçık: “Avukatlık Meslek Kuralları.” Leyla bırakmıştı. Not yoktu.
> Leyla’nın odasının ışığı yanıyordu. Kapıyı çalmadım. Masasındaki sigara paketini görebiliyordum; ilk kez açılmıştı.
~ Güvenli yolu seçtim. Güvenli olan benim içindi.
`),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(
        not(flag('cokus')),
        flag('ercan_sustu'),
        has('ded_kasa'),
        has('ded_sifre'),
        ref('baskasi'),
        cmp(v('pers'), '>=', 8),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Adli kontrol kaldırıldı',
      verdictText:
        'Sanık Orhan Kılıç’ın üzerine atılı zimmet suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; hakkındaki adli kontrol tedbirinin kaldırılmasına; duruşma tutanaklarının ve karar örneğinin Ercan Tunalı hakkında zimmet ve resmî belgede sahtecilik suçlarından yürütülen soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1) karar verildi.',
      reasoning: [
        because(
          'Kırk yedi iptalin tamamı, sanık turnikeden çıktıktan sonra, vezne terminalinden değil, ön odadaki ortak bilgisayardan yapılmıştır (bilirkişi raporu; turnike kayıtları).',
        ),
        because(
          'İptallerin her birinden dakikalar sonra kasa odası, sanığa ait olmayan ve o saatte binada bulunan müdür yardımcılığına tanımlı 02 koduyla açılmıştır.',
        ),
        because(
          'Sanığın şifresi 14 Ocak’ta müdür yardımcılığı kullanıcısının talebiyle sıfırlanmış; şifre zarfı açılıp kapatılmış ve müdür yardımcılığı odasındaki kilitli çekmecede bulunmuştur.',
        ),
        because(
          'Teslim tutanaklarının asılları iptallerden sonra yeniden basılan raporlarla ve sanığın fotokopi imzasıyla düzenlenmiştir; sanık parayı eksiksiz teslim etmiş, para teslimden sonra sanığın zilyetliğinde değildir.',
          has('ded_sahte_tutanak'),
        ),
        because(
          'Tanık Ercan Tunalı kendisini suçlayabilecek sorulara cevap vermekten çekinmiştir (CMK 48); bu çekinme tek başına delil sayılmamış, diğer delillerle birlikte değerlendirilmiştir.',
        ),
        because('Deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; TCK 247; CMK 48, 50/1-d, 63, 67/3, 158, 217, 273/1',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Kullanıcı adının arkasındaki eli göster (terminal + turnike), parayı teslimden sonra kimin tuttuğunu kanıtla (kasa kodu + müdürlük turnikesi, sıfırlama talebi + zarf) ve bilgiyi suç duyurusuyla savcılığa taşı.',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
> “İşlemediği sabit olduğundan… beraatine.” Orhan kelimeleri duydu. Gözlüğünü çıkardı, mendiliyle sildi, yeniden taktı. Sonra bir daha çıkardı; bu kez gözlerini sildi.
> Nazan dinleyici sırasında ayağa kalktı. İğneler yakasındaydı; hiçbiri düşmedi.
# ADLİYE ÖNÜ · ÖĞLEDEN SONRA [bg:sokak_sabah]
> Dışarıda yağmur dinmişti. İlk kez. Adliyenin merdivenleri ıslak parlıyordu; Uludağ’ın üstünde bulutlar yırtılmış, arasından soluk bir güneş.
nazan: Rakam söyle bakalım Orhan.
orhan: Sıfır.
nazan: Sıfır ne?
orhan: Sıfır makbuz. Sıfır lira. Sıfır gün.
> Nazan güldü. Ağzında iğne yoktu; ilk kez iki eliyle güldü.
> Hayri Bey merdivenin başında bekliyordu. Ayakkabı kutusunu bana uzattı.
hayri: Bunu saklayın avukat hanım. Tarih, makbuzu saklayanlarındır. Siz de bir makbuz sakladınız; sarı, karbonlu.
`),
        W(
          flag('melek_hazir'),
          `
> Melek merdivenlerin dibinde, bir sigarayı yakmadan parmaklarında çeviriyordu. Yanıma geldi.
melek: Selim abiyle Orhan abiye çay ısmarlayacağız. Çay ocağında, Rıza abinin semaverinden. Sen de gel canım. Demim acıdır, biliyorsun.
`,
        ),
        O(`
# ARSLAN HUKUK · AKŞAM [bg:buro_gece]
> Leyla kapımda durdu. Elinde iki bardak çay. Birini masama bıraktı; bunu hiç yapmazdı.
leyla: Bugün bir adam şifresini verdiğini söyledi ve kurtuldu. Bunu unutma. Hatasını söyleyen insan suçlu değildir; hatasını saklayan, birilerinin suçuna kapı aralar.
> Odasına döndü. Masasının köşesindeki açılmamış sigara paketine bir an baktı; elini uzattı, sonra çekti.
leyla: Bir gün sana o eski dosyadan bahsedeceğim Deniz. Tamamını. Bugün değil.
# SON
> Ercan Tunalı hakkında zimmet ve resmî belgede sahtecilik suçlarından dava açıldı. Görevden uzaklaştırıldı. Soruşturma dosyasında yasa dışı bahis borçlarına ilişkin kayıtlar da yer aldı.
> Orhan Kılıç göreve iade edildi. Vezne 2’nin camındaki “KAPALI” yazısı söküldü. İlk akşam kasayı iki kez saydı; tutanağı, teslim alanın önünde, teslim alana imzalattı.
`),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(not(flag('cokus')), ref('baskasi'), ref('lehe2'), cmp(v('pers'), '>=', 6), finalAtLeast(T_BERAAT)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Adli kontrol kaldırıldı',
      verdictText:
        'Sanık Orhan Kılıç’ın üzerine atılı zimmet suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; hakkındaki adli kontrol tedbirinin kaldırılmasına; iptalleri gerçekleştiren kişi ya da kişiler yönünden Bursa Cumhuriyet Başsavcılığına suç duyurusunda bulunulmasına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1) karar verildi.',
      reasoning: [
        because(
          'İptallerin tamamı sanık binadan çıktıktan sonra ve sanığın vezne terminalinden değil, ortak kullanımdaki bir bilgisayardan yapılmıştır.',
        ),
        because(
          'Vezne programında terminal kısıtlaması ve küçük tutarlı iptaller için ikinci onay bulunmadığı bilirkişi raporuyla anlaşılmıştır.',
          has('ev_bilirkisi'),
        ),
        because(
          'Sanık 9 Ocak’ta yıllık izinde olduğu hâlde aynı akşam onun kullanıcısıyla iptal yapılmıştır.',
          has('ded_izin'),
        ),
        because(
          'Sanığın kasayı eksiksiz teslim ettiği defter ve karbon nüshalarla, dosyadaki tutanakların ise sonradan düzenlendiği bulgularla desteklenmiştir.',
          any(has('ded_teslim'), has('ded_sahte_tutanak')),
        ),
        because(
          'Veznedar şifrelerinin müdürlükte zarflarda toplandığı anlaşılmıştır; kullanıcı adı tek başına sanığı göstermemektedir.',
          any(has('ded_zarf'), flag('contra_m2'), flag('contra_e3')),
        ),
        because(
          'İptal akşamlarında kasa odasının sanığa ait olmayan bir kodla açıldığı görülmüştür.',
          any(has('ded_kasa'), flag('contra_r2')),
        ),
        because(
          'Sanığın suçu işlediğine dair kesin ve inandırıcı delil bulunmamaktadır; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; TCK 247; CMK 63, 67/3, 217, 273/1; Anayasa 38/4; AİHS 6/2',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'İptallerin sanık binadan çıktıktan sonra başka bir bilgisayardan yapıldığını göster; buna en az iki bağımsız lehe bulgu ekle (izin günü, teslim tutanakları, kasa kodu, zarflar).',
      epilogue: [
        O(`
baskan: Türk Milleti adına…
> “Sabit olmadığından… beraatine.” Orhan kelimeleri tek tek duydu; bir yabancı dilden çeviriyormuş gibi. Sonra anladı ve oturdu. Ayakta dinlemesi gerekiyordu; kimse bir şey demedi.
> Nazan iki elini yüzüne kapadı. Sesi çıkmadı; omuzları sarsıldı, o kadar.
# HİSARÖNÜ BELEDİYESİ · BİR HAFTA SONRA [bg:buro]
> Orhan göreve iade dilekçesini yazdı. Kuruşu kuruşuna: maaş farkları, kesintiler, faiz. Dilekçeyi iki kez okudu, imzaladı, imzasının altına tarih ve saat yazdı.
> Belediye koridorunda iki memur fısıldaştı. Duydum: “Şüpheden yararlandı.” Orhan da duydu. Durmadı.
`),
        W(
          flag('suc_duyurusu'),
          `
> Başsavcılıktaki soruşturma sürüyordu. Zarflar emanette, kodlar bir dosyada, bir isim bir numaranın arkasında. Kimse acele etmiyordu.
`,
        ),
        W(
          not(flag('suc_duyurusu')),
          `
> Mahkemenin suç duyurusu Başsavcılığa gitti; “kişi ya da kişiler” hakkında. Bir isim yoktu. İsimsiz bir dosya, bir rafta, bir sıra numarasıyla.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Panodaki kırmızı ipi çözdüm. Ortadaki boşluk hâlâ boştu.
~ Kayıtlar bir adı sildi. Eli hâlâ göstermediler.
~ Orhan’ın yarın sabah kartını turnikeye okutacağını düşündüm. Kapı açılacak. Ve ön odada, buzlu camın ardında, bir monitörün mavi ışığı yine yanacak.
`),
      ],
    }),
    outcome('NITELENDIRME', {
      class: 'RECHARACTERIZED',
      priority: 4,
      when: all(
        not(flag('cokus')),
        flag('nitel_uyari'),
        any(flag('closing_terdit'), flag('ihmal_kabul'), ref('baskasi')),
        finalAtLeast(T_NITEL),
      ),
      stamp: 'NİTELENDİRME',
      stampTone: 'amber',
      sentence: '5 ay hapis · ertelendi',
      verdictText:
        'Sanık Orhan Kılıç’ın üzerine atılı zimmet suçunun unsurları oluşmadığından, CMK 226 uyarınca yapılan ek savunma hakkı hatırlatması doğrultusunda eyleminin ihmal suretiyle görevi kötüye kullanma suçunu oluşturduğu kabul edilerek TCK 257/2 uyarınca takdiren 6 AY; TCK 62/1 ile 5 AY HAPİS cezası ile cezalandırılmasına; sanığın geçmişi ve suç işleme eğilimi gözetilerek cezanın TCK 51/1 uyarınca ERTELENMESİNE, denetim süresinin 1 yıl olarak belirlenmesine (TCK 51/3); gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1) karar verildi.',
      reasoning: [
        because(
          'İptallerin sanık tarafından yapıldığı ve paranın sanık tarafından zimmete geçirildiği sabit olmamıştır; zimmet suçunun unsurları oluşmamıştır.',
        ),
        because(
          'Sanık, kurum yönergesine aykırı olarak şifresini zarf içinde müdürlüğe teslim etmiş ve kamu zararının doğmasına imkân vermiştir.',
        ),
        because('Eylem TCK 257/2 kapsamında değerlendirilmiş; sanığa CMK 226 uyarınca ek savunma hakkı tanınmıştır.'),
        because('Sanığın sabıkasız geçmişi gözetilerek takdiri indirim ve erteleme uygulanmıştır.'),
      ],
      legalBasis: 'TCK 257/2, 61, 62/1, 51/1, 51/3; CMK 226, 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Zarf gerçeğini ortaya çıkar (nitelendirme uyarısı gelir); iptallerin sanıkça yapılmadığını göster ya da terditli savunmayla ihmal nitelendirmesini iste.',
      epilogue: [
        O(`
baskan: Sanığın cezalandırılmasına…
> “Beş ay. Ertelendi.” Orhan rakamı duydu ve bana döndü. Gözlüğünün arkasından, bir hesap sorar gibi değil; bir hesap verir gibi baktı.
# ADLİYE MERDİVENLERİ · ÖĞLEDEN SONRA [bg:sokak_yagmur]
> Yağmur hafiflemişti. Nazan şemsiyeyi açtı, Orhan’ın başına tuttu; kendisi ıslandı.
orhan: Hesabını vereceğim dediğim buydu efendim. Az değil. Doğru.
nazan: Doğru mu? Beş ay doğru mu?
orhan: Bir zarfın bedeli Nazan. Kırk yedi makbuzun değil. Bir zarfın.
~ Zimmet değil, ihmal. Bir zarfın bedeli. Hukuken bir kazanım; bir adamın sicilinde, yine de bir satır.
`),
        W(
          flag('suc_duyurusu'),
          `
> Başsavcılıktaki soruşturma sürüyordu. Zarflar emanette. Orhan’ın “ihmali” bir mahkûmiyet kararında; başkasının kastı bir soruşturma dosyasında. İki kâğıt, iki ayrı rafta.
`,
        ),
        O(`
# ARSLAN HUKUK · GECE [bg:buro_gece]
> Leyla dosyayı okudu, kapattı.
leyla: Terazinin bir kefesine “yapmadı”, öbürüne “yaptıysa da ihmal” koydun. Heyet ikinci kefeyi tuttu. Bazen adalet, ağır olanı değil, tutulabileni seçer.
~ İstinaf var. Orhan istemiyor. “Hesabını verdim efendim” diyor. Belki haklı. Belki de bu, on dokuz yıllık bir alışkanlığın son cümlesi.
`),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 5,
      when: { all: [] },
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      sentence: '7 yıl 9 ay 22 gün hapis',
      verdictText:
        'Sanık Orhan Kılıç’ın zimmet suçundan TCK 247/1 uyarınca 5 YIL; hileli davranışla işlenmesi nedeniyle 247/2 ile yarı oranında artırılarak 7 YIL 6 AY; zincirleme suç nedeniyle TCK 43/1 ile dörtte bir oranında artırılarak 9 YIL 4 AY 15 GÜN; TCK 62/1 ile 7 YIL 9 AY 22 GÜN HAPİS cezası ile cezalandırılmasına; TCK 53; kamu zararının tahsili için katılan kurumun hukuk yoluna başvurma hakkının saklı tutulmasına; cezanın süresi nedeniyle CMK 231/5 ve TCK 51/1 koşulları bulunmadığına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1) karar verildi.',
      reasoning: [
        because('İptaller sanığın kullanıcı adıyla yapılmış; teslim tutanakları sanığın imzasını taşımaktadır.'),
        because('Savunmanın kayıtlara yönelik itirazları somut delillerle desteklenmemiştir.', not(flag('cokus'))),
        because(
          'Savunmanın inandırıcılığı duruşmada çökmüş; heyet iddianamedeki anlatımı esas almıştır.',
          flag('cokus'),
        ),
      ],
      legalBasis: 'TCK 247/1-2, 43/1, 61, 62/1, 53; CMK 231/5; TCK 51/1; CMK 273/1',
      xp: {
        if: {
          when: flag('cokus'),
          then: xp(0.3, { ethicsVar: 'ethics' }),
          else: xp(0.6, { ethicsVar: 'ethics' }),
        },
      },
      howToReach:
        'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir. Kayıtların bütün sütunlarını okumadan, teslim tutanaklarını karbonla karşılaştırmadan ve tanıkları kendi kâğıtlarıyla sınamadan beraat gelmez.',
      epilogue: [
        W(
          flag('cokus'),
          `
# SALON · HÜKÜMDEN SONRA [bg:durusma_salonu]
> Salon boşaldı. Orhan’ı adli kontrol kâğıdıyla birlikte koridora çıkardılar; tutuklanmadı, istinafı dışarıda bekleyecekti.
> Savcı Gökhan Ersoy dosyasını topladı. Kapıya giderken durdu, bana döndü.
savci: Rakamlarla kazanılmaz avukat hanım. Ama rakamsız da kazanılmaz. Bu dosyada rakamlar vardı.
> Kapı arkasından kapandı. Kalorifer peteği tıkırdadı. Başka ses yoktu.
`,
        ),
        O(`
# ADLİYE KORİDORU · HÜKÜMDEN SONRA [bg:adliye]
> “Yedi yıl dokuz ay yirmi iki gün.” Rakam koridora benden önce çıktı. Orhan rakamı tekrarlamadı. İlk kez bir rakamı tekrarlamadı.
> Nazan telefonunu çıkardı, bir numara aradı. Emlakçı. Sesini alçaltmadı.
nazan: Satılık. Evet. Ne kadar çabuk olursa.
> Orhan karısının elinden telefonu almadı. Gözlüğünü çıkardı; silmedi.
# ARSLAN HUKUK · GECE [bg:buro_gece]
~ Kırk yedi satır. Birini bile çeviremedim.
~ İstinaf var. Her zaman bir sonraki kapı vardır. Ama bu gece bütün kapılar kapalı; bir tek ön odanın buzlu camlı kapısı hariç. O kapının ardında hâlâ bir monitör yanıyor.
`),
      ],
    }),
  ],
};
