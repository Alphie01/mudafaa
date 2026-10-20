import { cont, dec, inc, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, S } from './dsl.js';
import { BRIEF, INV1, PRO, p1 } from './shared.js';

// 40-briefing: soğuk açılış (isimsiz sesler), Sevim büroda, Leyla'nın dosya devri ve ceza aralığı sorusu, dosyadaki
// kâğıtlar, dosya ekranı + strateji, Yıldırım'da ilk sabah.

const strategy = (id: string, value: string, pct: number, reply: string) =>
  option(id, value === 'MASUMIYET' ? 'Masumiyet' : value === 'USUL' ? 'Eksik soruşturma' : 'Terditli savunma', {
    group: 'g_strateji',
    effects: [set('strategy', value), set('strategy_pct', pct), ...p1.start()],
    responses: B(S`
      leyla: ${reply}
      - Leyla şemsiyesini aldı, kapıda durdu.
      leyla: Yarın sabah müvekkilinin evine git. Dosyayı orada değil, odasında okuyacaksın.
    `),
    next: 'INV1_SABAH',
  });

export const briefing: CasePart = {
  nodes: [
    story('PROLOG', {
      ...PRO,
      title: '4 Kasım 2025',
      background: 'sokak_yagmur',
      lines: B(S`
        = 4 KASIM 2025 · 13.31 — NİLÜFER, BİR BANKA ŞUBESİNİN ÖNÜ @sokak_yagmur
        - Yağmur, şemsiyenin ucundan bir yaşlı adamın ayakkabısına damlıyordu. Adam şemsiyeyi kapatmayı unutmuştu; telefonu iki eliyle tutuyordu.
        - Kulağında bir erkek sesi. Sıcak, acelesiz, insana "hocam" demeyi bilen bir ses.
        ?SATICI{phone}: Hocam, araba tertemiz. Kırk yıllık şoför gibi kullanıldı. Akşam anahtarı elinize vereceğim, söz.
        ?SATICI{phone}: Yalnız benim hesabım bloke, malum, vergi işleri. Kardeşimin hesabına atın. Araba da onun üstüne zaten.
        - Hattın öbür ucundan kısa bir sinyal geldi. Ardından kayıtlı, sıkılmış bir kadın sesi: "Dördüncü kat."
        - Yaşlı adam cebinden bir kâğıt çıkardı, kalemin kapağını dişleriyle açtı. Kırk yıl öğretmenlik yapmış biri her şeyi not eder.
        ?SATICI{phone}: Hocam, siz öğretmen misiniz? Belli oluyor. Sesinizden belli. Benim de babam öğretmendi, rahmetli. Size kazık atarsam Allah bana atsın.
        - Adam gülümsedi. Kırk yıl boyunca velilerin, müfettişlerin, öğrencilerin yalanlarını dinlemişti. Bu ses yalan söylemiyordu; öyle geliyordu.
        - Eşi o sabah yine diyalizden yorgun dönmüştü. Belediye servisinin arka koltuğunda, başını cama yaslayıp. "Bir arabamız olsa" demişti, bir kez, ağzından kaçmış gibi.
        ?SATICI{phone}: Yazıyor musunuz hocam? İsim de yazın: Ece Yalın. Kaporayı atın, ilanı hemen kaldırıyorum. Başkası da arıyor, biliyorsunuz.
        - 13.40. Banka gişesinin camında adamın yüzü bulanık bir yansıma oldu. Yetmiş beş bin lira. Dekontu dört kez katladı, cüzdanına koydu.
        - Gişedeki genç memur bir an duraksadı. "Tanıdığınız birine mi gönderiyorsunuz, amca?" diye sordu; prosedür. Adam "kardeşi" dedi, sonra düzeltti: "Satıcının kardeşi."
        - Memur omuz silkti. Prosedür, bir soruyla biter; cevabın doğru olup olmadığına bakmaz.
        = 14.05 — KENT MEYDANI, BİR ATM @sokak_yagmur
        - Kapüşonlu bir genç ATM'nin önünde durdu. Kart takmadı. Telefonunun ekranını makineye tuttu; makine düşündü, bipledi, hışırdadı.
        - Sırtındaki montun sarı harfleri yağmurda parlıyordu. Parayı saymadan cebine soktu. Telefonu kulağına götürdü.
        ?KAPÜŞONLU{phone}: Abi tamam, çektim. Yirmi. Nereye getireyim?
        - Cevabı duyulmadı. Genç başını salladı, motoruna bindi ve trafiğin içinde kayboldu.
        - ATM'nin üstündeki küçük kamera her şeyi kaydetti: bir kapüşon, bir telefon, sarı harfler. Kimse o kaydı bir yıl boyunca izlemeyecekti.
        = 18.10 — NİLÜFER, İLANDAKİ ADRES @sokak_karanlik
        - Adres boş bir otoparktı. Ne Clio vardı ne kardeş. Islak asfaltta tek bir poşet uçuşuyordu.
        - Yaşlı adam numarayı on üçüncü kez aradı.
        ?KAYITLI SES{phone}: Aradığınız numaraya şu anda ulaşılamıyor.
        - Kâğıdı yeniden okudu. "Dördüncü kat." Neden bunu yazdığını kendisi de bilmiyordu. Ama silmedi.
        - Eve döndüğünde eşi uyuyordu. Adam mutfak masasına oturdu, kâğıdı önüne koydu ve bir dilekçe yazmaya başladı. Kırk yıl kompozisyon okumuştu; bu sefer yazacaktı.
        = AYNI GECE · 23.40 — YILDIRIM @sokak_karanlik
        - Yokuşun ortasındaki bir evde, bir odanın ışığı hâlâ yanıyordu. Genç bir kız eski telefonunu sallıyor, yeniden başlatıyor, yine sallıyordu.
        - Ekranın köşesinde iki kelime: "SIM yok."
        - Kız telefonu yastığın altına koydu. Sonra çıkardı. Sonra yine koydu. Yarın bir iş görüşmesi olacaktı; öyle sanıyordu. !fade
      `),
      choices: [cont('PROLOG_DEVAM', 'Üç gün sonra', 'PROLOG_2', { role: 'PRIMARY' })],
    }),
    story('PROLOG_2', {
      ...PRO,
      title: '7 Kasım 2025',
      background: 'sokak_sabah',
      lines: B(S`
        = 7 KASIM 2025 · 07.10 — YILDIRIM @sokak_sabah
        - Kapı zili ikinci kez çaldığında Sevim Yalın elinde tavayla açtı. Kapıda iki sivil polis vardı; biri ayakkabılarını paspasa sildi. Kibar bir tutuklama değildi; ifadeye davetti.
        ?POLİS: Ece Yalın burada mı oturuyor? Hanımefendi, kızınızın ifadesine ihtiyaç var. Korkacak bir şey yok.
        - Mutfakta çay demleniyordu. Kimse içmedi.
        - Ece odasından çıktığında üstünde pijama vardı. Polislerden biri bakışını kaçırdı. Sevim tavayı ocağa bırakmayı unuttu; elinde tuttu, ta ki yağ soğuyana kadar.
        = 10.30 — EMNİYET, SİBER ŞUBE @karakol
        - İfade odasının florasanı vızıldıyordu. Masada bir bardak su, bir kalem, bir dosya. Ece'nin yanında avukat yoktu. Bir avukat isteyebileceğini biliyordu; istemedi. Suçlu görünmekten korktu.
        gokhan: Hesap sizin. Para sizin hesabınıza geldi, sizin hesabınızdan çıktı. Birine kod verdiniz mi?
        - Ece kalemin ucuyla tırnağının kenarını kazıdı. Ojesi köşeden kırıktı.
        ece/uzgun: Bir iş başvurusu yapmıştım. Maaş için IBAN verdim. Ama ben… kimseyle kod paylaşmadım.
        - Komiser yardımcısı bu cümleyi yazdı. Altını çizmedi; çizmesine gerek yoktu.
        gokhan: Bir iş başvurusu. Hangi şirket?
        ece: Nova Dijital. Uzaktan müşteri temsilcisi. Ben… yazışmaları sildim. Onlar sil dedi.
        - Gökhan Ateş başını kaldırmadan yazmaya devam etti. Masasında dört yüz dosya vardı; bu, dört yüz birinciydi.
        - Üç ay sonra bir iddianame geldi: nitelikli dolandırıcılık. Bir yıl sonra, ilk duruşmaya on üç gün kala, annesi bir avukat aradı. !fade
      `),
      choices: [cont('PROLOG2_DEVAM', 'Dosyayı aç', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...BRIEF,
      title: 'Sevim Hanım',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('leyla'), meet('sevim')],
      lines: B(S`
        = 22 EKİM 2026 · 21.10 — ARSLAN HUKUK, BURSA @buro_gece
        ~ Eskiden dolandırıcı kapıyı çalardı. Şimdi bildirim gönderiyor. Ve kapıyı çalanlar, dolandırılanların anneleri oluyor.
        - Yağmur camda ince ince çizgiler çiziyordu. Kapı açıldığında içeri soğuk ve bir kadın girdi; elinde bir plastik dosya vardı, dosyanın üstünde yağmur damlaları.
        sevim: Arslan Hukuk burası mı? Sizi atölyedeki Nezahat Hanım tavsiye etti. Oğlunun trafik işini çözmüşsünüz.
        > Buyurun, oturun. Islanmışsınız, bir çay söyleyeyim.
        sevim: Çay sonra. Önce şunu söyleyeyim, sonra ne isterseniz sorun. Benim kızım dolandırıcı değil.
        - Dosyayı masaya koydu. Her kâğıt ayrı bir şeffaf poşetteydi: iddianame, tebligat, bir banka yazısı, bir ilaç reçetesi, yanlışlıkla girmiş bir fatura.
        sevim: Sekiz aydır iş arıyordu. Okulu bitirdi, İşletme, şerefiyle. Yüz kırk üç yere başvurdu. Ben de dedim ki: "Kızım, devlet kapısı bekleme, ne iş bulursan gir."
        sevim/uzgun: Girdi de. İnternetten bir iş. Evden çalışacakmış. Sonra polis kapıya geldi.
        sevim: Babası öldüğünde Ece on iki yaşındaydı. O günden beri "anne, ben hallederim" der. Faturayı o öder, tüpü o çağırır, kirayı o pazarlık eder. Halletmeye alışmış.
        sevim/uzgun: Bu sefer halledemedi. Bir yıldır odasından çıkmıyor. Yüz kırk dördüncü başvuruyu yapamıyor, çünkü her başvuruda adli sicil soruyorlar.
        ~ Yüz kırk üç. Bir annenin bu sayıyı ezbere bilmesi, kızının her reddedilişini onunla yaşadığını söylüyor.
        sevim: Bir de o Burak denen çocuk var. Ayrıldılar. "Pişman olacaksın" diye mesaj attı. Telefonun şifresini biliyordu. Ben ona hiç güvenmedim.
        > İsimleri not alıyorum. Ama önce dosyayı okumam lazım, Sevim Hanım. Kimseyi suçlamadan.
        sevim: Okuyun. Ben dikiş dikerim; ipin ucunu kaçırırsan bütün dikiş söker. Siz de kaçırmayın.
        - Çantasından kalın bir zarf çıkardı. Zarfın köşesi, çok kez açılıp kapanmaktan yumuşamıştı.
        sevim: Gece vardiyasına da kaldım. Yetmezse taksit yaparız. Siz söyleyin.
        - Zarfı masaya koymadı. Elinde tuttu, sanki masaya koyarsa bir şeyi kabul etmiş olacakmış gibi.
        ~ Bir anne bir avukata para uzatırken aslında bir şey satın almaya çalışmaz. Bir sözü kiralamaya çalışır. Ben söz kiralamam. Ama kapıyı da kapatamam.
      `),
      choices: [
        option('BR00_A', 'Ücreti sonra konuşuruz. Önce dosya.', {
          effects: [raise('ucret_sonra'), inc('trust', 6)],
          responses: B(S`
            - Sevim zarfı bir süre elinde tuttu. Sonra çantasına geri koydu, ama fermuarını kapatmadı.
            sevim: Siz bilirsiniz. Ama borç borçtur; ben kimseye borçlu kalmam.
          `),
          next: 'BR_01',
        }),
        option('BR00_B', 'Ücret tarifemizi anlatayım; sonra karar verin.', {
          responses: B(S`
            - Tarifeyi anlattım: dosya ücreti, duruşma başına, masraflar. Sevim her rakamda bir kez başını salladı, bir kez yutkundu.
            sevim: Anladım. Hakkınız. Siz çalışın, ben dikerim.
          `),
          next: 'BR_01',
        }),
        option('BR00_C', 'Söz veremem. Ama dosyanın her satırını okurum.', {
          effects: [raise('deniz_durust'), inc('trust', 3)],
          responses: B(S`
            - Sevim ilk kez yüzüme baktı. Uzun uzun.
            sevim: Söz veren çok oldu. Okuyan olmadı. Okuyun.
          `),
          next: 'BR_01',
        }),
      ],
    }),
    story('BR_01', {
      ...BRIEF,
      title: 'Leyla',
      background: 'buro_gece',
      lines: B(S`
        - Sevim gittikten sonra Leyla kapının pervazından ayrıldı. Ne zamandır orada durduğunu bilmiyordum.
        leyla: Anneler dosyanın ilk sayfasıdır, Deniz. Son sayfası değil.
        - Masama oturdu, iddianameyi çevirdi. Gözlüğünü burnunun ucuna indirdi. Masasında tuşlu telefonu titredi; bakmadı.
        leyla: Ece Yalın. Yirmi üç yaşında. Hesabına bir emeklinin kaporası gelmiş, yirmi beş dakika içinde üç yere dağılmış. Asliye cezada. Tutuksuz.
        leyla: Bu dosyalardan Bursa'da ayda yüz tane açılıyor. Kırkı hesap sahibinin cezasıyla biter. Hesap sahiplerinin yarısı paranın yüzünü bile görmemiştir.
        leyla: Önce şunu bil. Neyle karşı karşıyayız? İddianamedeki suçun ceza aralığı ne?
        ~ Leyla soru sorduğunda cevabı bilir. Benim bilip bilmediğimi merak eder.
      `),
      choices: [
        option(
          'BR01_A',
          'Nitelikli dolandırıcılık: 4–10 yıl hapis; adli para en az menfaatin iki katı',
          {
            score: { HUKUKI_BILGI: 60 },
            good: 'TCK 158/1-f: üç yıldan on yıla hapis ve beş bin güne kadar adli para; (f) bendinde hapsin alt sınırı dört yıl, adli para cezası menfaatin iki katından az olamaz (158/1 son cümle).',
            effects: [raise('br01_dogru')],
            responses: B(S`
            leyla/mutlu: Doğru. Ve şunu unutma: adli para cezası, alınan paranın iki katından az olamaz. Yetmiş beş bin liranın iki katı.
            - Leyla gözlüğünü çıkardı, camını kazağının ucuyla sildi.
          `),
            next: 'BR_01K',
          },
        ),
        option('BR01_B', 'Basit dolandırıcılık: 1–5 yıl hapis ve adli para; banka burada yalnızca bir araç', {
          bad: 'TCK 157 basit dolandırıcılıktır; banka ve bilişim sistemi araç olarak kullanıldığında suç TCK 158/1-f’ye girer: 4–10 yıl hapis ve menfaatin iki katından az olmayan adli para.',
          category: 'HUKUKI_BILGI',
          responses: B(S`
            leyla: Hayır. Para bir bankadan geçti; bir uygulama, bir telefon. Bu nitelikli hâl. Alt sınır dört yıl, Deniz.
          `),
          next: 'BR_01K',
        }),
        option('BR01_C', 'Nitelikli dolandırıcılık: 3–10 yıl hapis; adli para cezasının miktarı hâkimin takdirinde', {
          bad: 'Genel aralık 3–10 yıldır; ama (f) bendinde hapsin alt sınırı dört yıl, adli para cezası menfaatin iki katından az olamaz (TCK 158/1 son cümle).',
          category: 'HUKUKI_BILGI',
          responses: B(S`
            leyla: Yarısı doğru. Yarım doğru, mahkemede tam yanlıştır. Bu bentte alt sınır dört yıl, para cezasının da tabanı var.
          `),
          next: 'BR_01K',
        }),
        option('BR01_D', 'Banka veya kredi kartlarının kötüye kullanılması: 3–6 yıl hapis', {
          bad: 'TCK 245 kartın ya da kart bilgilerinin kötüye kullanılmasıdır; burada kart değil, aldatmayla gönderilen para ve banka aracılığı vardır: TCK 158/1-f.',
          category: 'HUKUKI_BILGI',
          responses: B(S`
            leyla: Kart yok ki. Kimse bir kart kopyalamamış; bir adam bir ilan vermiş, bir emekli para göndermiş. Dolandırıcılık bu. Nitelikli hâli.
          `),
          next: 'BR_01K',
        }),
      ],
    }),
    story('BR_01K', {
      ...BRIEF,
      title: 'Temmuzdaki değişiklik',
      background: 'buro_gece',
      lines: B(S`
        leyla: Bir şey daha. Temmuzda kanun değişti. Dolandırıcılığa katılan biri, katkısı yalnızca hesabını ya da hesabın şifrelerini başkasına vermekse, cezası yarıya iniyor.
        leyla: Olay geçen yıl. Ama lehe olan yeni kanun geriye yürür. Savcı bunu bilir; hâkim bilir. Sen de bil.
        > Yani bir kapı var.
        leyla: Bir kapı var. Ama o kapıdan geçen, içeride bir şey yapmış sayılır. Müvekkilin bir şey yapmadıysa kapıyı en sona sakla.
        - Tuşlu telefonu yine titredi. Bu sefer kapattı.
        ~ Leyla'nın telefonunu kopyalamaya kalkan, önce tuşlarını bulmak zorunda kalır. Kopyalanacak bir şeyi olmayan tek insan.
        leyla: Bir de şu, Deniz. Senin ilk yılındaki o dosya. Hesabını "kiraya veren" çocuk. Ona "yardım etmekten ceza alırsın, kurtulursun" demiştin.
        - Bir şey demedim. Leyla hiçbir şeyi unutmaz; yalnızca ne zaman hatırlatacağını seçer.
        leyla: Sonra o çocuğun da kandırıldığı çıktı. Bu dosyada kolay olana koşma. Önce doğruyu bul; kolayı sonra konuşuruz.
      `),
      choices: [cont('BR01K_DEVAM', 'Dosyadaki kâğıtlara bak', 'BR_01B', { role: 'PRIMARY' })],
    }),
    story('BR_01B', {
      ...BRIEF,
      title: 'Dört kâğıt',
      background: 'buro_gece',
      lines: B(S`
        - Leyla dosyayı dört kâğıda indirdi ve masaya, iskambil açar gibi dizdi.
        leyla: Siber Şube'nin raporu. Hesap onun, işlemler onun mobil şubesinden. Dört bin beş yüz lira da "hesap kiralama bedeli".
        leyla: Hesap hareketleri. Gelen para, giden para. Rakamlar yalan söylemez; ama soruyu sen sormazsan cevap da vermez.
        leyla: Katılanın şikâyeti. Emekli bir öğretmen. Dilekçeyi bir ödev gibi yazmış; dipnotları bile var.
        leyla: Ve müvekkilin ifadesi. Avukatsız. "Kimseyle kod paylaşmadım."
        leyla: Bu cümleyi bir yıl önce bir genç kız, bir ifade odasında söyledi. Doğru olabilir. Ama bu dosyada en çok o cümle konuşacak; ya onun lehine, ya aleyhine.
        - Bir süre kâğıtlara baktık. Yağmur, çatıdaki olukta bir şarkıyı yarım bırakıp yeniden başlıyordu.
        leyla: Dördünün de ortak bir eksiği var. Hiçbiri bir telefonu anlatmıyor. Para bir telefondan çıktı, Deniz. Hangi telefondan?
      `),
      choices: [cont('BR01B_DEVAM', 'Dosya ekranı', 'BR_02', { role: 'PRIMARY' })],
    }),
    story('BR_02', {
      ...BRIEF,
      phase: 'BRIEFING',
      title: 'Çevrimiçi Tuzak',
      background: 'buro_gece',
      onFirstEnter: [meet('ece')],
      blocks: [
        {
          type: 'profileCard',
          character: 'ece',
          label: 'MÜVEKKİL',
          lines: ['Ece Yalın, 23', 'İşletme mezunu · sabıkasız · tutuksuz'],
          charge: 'Nitelikli dolandırıcılık (TCK 158/1-f, 37/1)',
          demand: 'İddianame: 4–10 yıl hapis ve adli para cezası',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'gold', 'gold', 'red', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 55,
          labels: ['Beraat', '158/4: 2 yıl', '4 yıl', '10 yıl'],
          demandLabel: 'İSTEM: TCK 158/1-f, 37/1',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '4 Kasım 2025’te Nurettin Aksoy, sahte bir araç ilanı için 75.000 TL kaporayı Ece Yalın adına kayıtlı hesaba gönderdi. Para yirmi beş dakika içinde kripto platformuna, bir şahsa ve kartsız ATM çekimine dağıldı. Ece, 1 Kasım’da hesabına gelen 4.500 TL’nin bir iş için “eğitim avansı” olduğunu söylüyor.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'Hesap sanık adına; para bu hesaba geldi ve çıktı', strength: 'STRONG' },
            { label: 'Kolluk raporu: işlemler sanığın mobil şubesinden', strength: 'STRONG' },
            { label: '1 Kasım’da 4.500 TL “kiralama bedeli”', strength: 'MEDIUM' },
            { label: 'Sanığın ifadesi: kimseyle kod paylaşmadığı', strength: 'WEAK' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET:
              'Masumiyet: hesabın o gün başkasının elinde olduğunu ve gerçek faili göstermeyi hedeflersin. Uyan esas savunma ×1,5 puan.',
            STR_USUL:
              'Eksik soruşturma: delillerin toplanmadığını, şüphenin sanık lehine olduğunu savunursun. Uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli: önce beraat; olmazsa 158/4 ve lehe hükümler. Uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        strategy(
          'STR_MASUMIYET',
          'MASUMIYET',
          150,
          'Cesur. Hesabın o gün kimin elinde olduğunu göstermen gerekecek. Adı da bulursan, daha iyi.',
        ),
        strategy('STR_USUL', 'USUL', 120, 'Polis hesabın kimin adına olduğuna bakmış. Sen kimin elinde olduğuna bak.'),
        strategy(
          'STR_INDIRIM',
          'INDIRIM',
          80,
          'Güvenli. Ama müvekkiline "bir şey yaptın" mı diyeceksin? Kapıyı erken açma.',
        ),
      ],
    }),
    story('INV1_SABAH', {
      ...INV1,
      title: 'Yokuş',
      background: 'sokak_sabah',
      lines: B(S`
        = 23 EKİM · 08.40 — YILDIRIM, YALINLARIN SOKAĞI @sokak_sabah
        - Yokuş ıslaktı. Balkonlarda dün geceden kalan çamaşırlar, kimsenin toplamaya cesaret edemediği bayraklar gibi asılıydı.
        - Kapıyı Ece açtı. Makyajsız, saçları aceleyle toplanmış. Elinde bir deste yazdırılmış CV vardı; sanki her an bir mülakata çağrılacakmış gibi.
        ece: Avukat hanım? Annem söyledi. Şey… kusura bakmayın, ev biraz dağınık. Ben normalde böyle değilim, yani… ben aptal değilim.
        > Kimse öyle bir şey demedi, Ece.
        ece/uzgun: Demiyorlar. Bakıyorlar.
        ~ Bir yıl önce birisi ona "ailemize hoş geldiniz" demiş. Şimdi kapıda bir avukat var. İkimizden hangisine güveneceğini bilmiyor.
        - Mutfaktan dikiş makinesinin sesi geliyordu; Sevim Hanım sabah işe gitmeden bir etek bitiriyordu. Duvarda takvim: 4 Kasım'ın etrafına kırmızı kalemle bir daire.
        ece: Duruşma o gün. Tam bir yıl sonra. Komik, değil mi?
        > Değil. Ama kullanışlı. Bir yıl önce o gün ne olduysa, on üç günde bulacağız.
        - Ece güldü; kısa, şaşkın bir gülüş. Sonra kendini toparladı, CV destesini kapının yanındaki komodine bıraktı.
        ece: Bir şey söyleyeyim mi? Bir yıldır kimse bana "bulacağız" demedi. Herkes "ne yaptın" dedi.
      `),
      choices: [
        option('SABAH_A', '“Ben de sormayacağım. Ne olduğunu soracağım.”', {
          effects: [inc('trust', 4)],
          responses: B(S`
            ece: Ne olduğunu. Tamam. Onu ben de bilmiyorum zaten. Belki birlikte buluruz.
            ~ Bir müvekkilin güveni bir cümleyle başlar. Bir cümleyle de biter. Bunu unutmamalıyım.
          `),
          next: 'INV1_HUB',
        }),
        option('SABAH_B', '“Önce ne yaptığını bilmem lazım. Sonra ne olduğunu.”', {
          effects: [dec('trust', 4)],
          responses: B(S`
            ece/uzgun: Herkes öyle diyor. Peki. Ne yaptığımı anlatırım. Bir işe başvurdum. Yaptığım bu.
            ~ Doğru bir soru, yanlış bir sırayla sorulunca kapı yarı kapanır.
          `),
          next: 'INV1_HUB',
        }),
      ],
    }),
  ],
};
