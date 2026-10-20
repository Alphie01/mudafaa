import {
  back,
  dec,
  chosen,
  choiceNode,
  conversation,
  documentExam,
  examine,
  fallback,
  has,
  inc,
  any,
  option,
  raise,
  row,
  sceneSearch,
  tool,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, S, minus } from './dsl.js';
import { INV1 } from './shared.js';

// 52-inv1-saha: OM İş Merkezi (Necdet) ve 4. kat koridoru (sahne), Mavi İletişim (Onur), Burak ve etik tuzak,
// Siber Şube (Gökhan), hesap hareketleri ve şikâyet dilekçesi (belge incelemeleri).

export const inv1Saha: CasePart = {
  nodes: [
    conversation('INV1_OM', {
      ...INV1,
      title: 'OM İş Merkezi',
      background: 'buro',
      room: { label: 'OM İŞ MERKEZİ · İŞLETME MÜDÜRLÜĞÜ', character: 'necdet' },
      onFirstEnter: [{ type: 'MEET', character: 'necdet' }],
      lines: B(S`
        = OSMANGAZİ · OM İŞ MERKEZİ · 11.10 @sokak_yagmur
        - Cam cepheli, on katlı, yağmurdan çok temizlik ilacı kokan bir bina. Lobide bir güvenlik masası, bir kiracı panosu, bir kauçuk ağacı.
        - Güvenlik görevlisi "Nova mı? Müdür bey bilir" dedi ve asansörü gösterdi. Kapılar kapanırken bir sinyal geldi, ardından kayıtlı bir kadın sesi: "İkinci kat." !flash
        ~ Kayıtlı, sıkılmış bir kadın sesi. Bir yerden tanıdık geliyor; nereden, çıkaramadım. Asansörler birbirine benzer.
        - İşletme müdürlüğünün kapısı açıktı. İçeride ütülü bir takım elbise; masada bir şişe limon kolonyası, iki ince belli bardak. @buro
        necdet: Buyurun efendim, buyurun! Avukat hanım, değil mi? Güvenlik aradı. Necdet Sarı, işletme müdürü. Oturun, bir çay söyleyeyim.
        - Çay geldi. Çayını karıştırırken kaşığı bardağın kenarına iki kez vurdu; tın, tın. Kolonya şişesini uzattı.
        necdet: Kolonya alır mısınız? Yağmurda iyi gelir. Biz burada güven satıyoruz efendim; misafire kolonya, kiracıya güler yüz.
        - Duvarda çerçeveli bir belge: "Yılın Yöneticisi — Osmangazi Ticaret Odası, 2019". Yanında bir takvim, bir de saksıda iyi bakılmış bir orkide.
        ~ Her şey yerli yerinde. Bu odada kimse bir şey kaybetmez; kaybetse de bulur.
      `),
      choices: [
        option('OM_NOVA', 'Nova Dijital’i hatırlıyor musunuz?', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_necdet_hikaye')],
          responses: B(S`
            necdet: Nova… hatırlamaz olur muyum efendim. Polis de sordu geçen yıl, bir kere, telefonla. Sanal ofis kiraladılar. Adres hizmeti, posta kabulü.
            necdet: Genç bir çocuk geldi, kendisi imzaladı. Nakit ödedi, iki aylık. Sonra kayboldular. Kira bitti, ben de tabelalarını sökmeye üşendim, ayıp bende.
            necdet/uzgun: Gençler iş arıyor efendim. İlanlara inanıyorlar. Yazık. Bizim zamanımızda insan, adamın gözüne bakıp işe girerdi.
            necdet: Benim de bir oğlum var, Ankara'da okuyor. Her ay "baba, bir iş ilanı gördüm" diye arar. "Oğlum" derim, "gözünü açık tut." Ne yapalım, devir böyle.
            ~ Gözüne bakıp. Ece kimsenin gözüne bakamamıştı; Kaan'ın kamerası bozuktu.
          `),
          next: '$stay',
        }),
        option('OM_SOZLESME', 'Sözleşmenin bir örneğini alabilir miyim?', {
          discovers: 'ev_sozlesme',
          score: { ARASTIRMA: 40 },
          responses: B(S`
            necdet: Tabii efendim, tabii. Saklayacak bir şeyimiz yok. Bir dakika.
            - Arkasındaki dolaptan bir klasör çıkardı, bir sayfayı fotokopi makinesine koydu. Makine ısınırken bana döndü.
            necdet: Kiracı Arda Kılıç diye bir genç. Kimlik fotokopisi de ekte. Polise verirdim ama isteyen olmadı. Siz alın, belki işinize yarar.
            - Fotokopi makinesi sıcak bir kâğıt verdi. Necdet kâğıdı bana uzatmadan önce bir kez düzeltti, kenarlarını hizaladı. Titiz bir adam.
            ~ Bir yıl boyunca kimsenin istemediği bir kâğıt. Üstünde bir isim var: Arda Kılıç. Bir isim, bir yüz değildir; ama bir başlangıçtır.
          `),
          next: '$stay',
        }),
        option('OM_KIRACI', 'Kattaki kiracılar Nova’dan birini hiç gördü mü?', {
          score: { SORGULAMA: 20 },
          responses: B(S`
necdet: Sanal ofis efendim; kimse gelmez ki görsün. Posta gelir, biz alırız, haber veririz. Nova'ya iki zarf geldi galiba, bir de kargo. Sonra o da kesildi.
necdet: Dördüncü katta altı firma var. Bir muhasebeci, bir mimar, iki yazılımcı, bir sigorta acentesi. Bir de bizim arşiv. Herkes kendi işinde.
`),
          next: '$stay',
        }),
        option('OM_KAMERA', 'Lobideki kamera geçen yılı hatırlar mı?', {
          score: { ARASTIRMA: 10 },
          responses: B(S`
            necdet: Keşke efendim. On beş gün tutuyor. Yasal süre, biz de yasaya uyarız. Bir yıl önceyi Allah bilir, bir de kiracılar.
            - Güldü. Kaşık yine bardağa çarptı.
          `),
          next: '$stay',
        }),
        option('OM_KORIDOR', 'Dördüncü kattaki ofise bakabilir miyim?', {
          responses: B(S`
            necdet: Bakın efendim. 407. Kapısı açık değil ama koridor herkese açık. Ben bir telefonu bekliyorum, yoksa eşlik ederdim.
            - Kartvizitini masanın üstünden kaydırdı. Kabartma harfler, hafif bir limon kokusu.
            necdet: Bir şey lazım olursa arayın. Cep numaram üstünde. Avukatlara her zaman açığız.
          `),
          discovers: 'clue_kartvizit',
          next: 'INV1_KORIDOR',
        }),
        back('OM_GERI', 'Teşekkür et, çık', {
          visibleWhen: { not: { chosen: 'OM_KORIDOR' } },
          effects: [
            {
              type: 'IF',
              when: { not: has('clue_kartvizit') },
              then: [{ type: 'DISCOVER', evidence: 'clue_kartvizit' }],
            },
          ],
          responses: B(S`
            - Kalkarken kartvizitini uzattı. Kabartma harfler, hafif bir limon kokusu.
            necdet: Bir şey lazım olursa arayın efendim. Cep numaram üstünde.
          `),
        }),
      ],
    }),
    sceneSearch('INV1_KORIDOR', {
      ...INV1,
      title: 'Dördüncü kat',
      background: 'buro',
      hud: ['taps_k'],
      exposeCounts: true,
      scene: 'sc_koridor',
      lines: B(S`
        - Koridor halı ve toz kokuyordu. Kapıların çoğu kapalıydı; birinin ardından klavye sesi, bir başkasından bir radyo.
        - Asansörün yanında bir pano, panonun yanında bir yangın tüpü, ilerde bir saksı. Koridorun sonunda tek bir kapı, numarası 407, kapısının önünde paspas bile yok.
        ~ "Nova Dijital" burada bir yıl önce iki ay yaşamış. Bir kâğıt üstünde. Kâğıtlar duvara bir iz bırakır mı?
        - Pencereden aşağıda, iş merkezinin otoparkına inen rampa görünüyordu. Bariyer kalkıp iniyordu; kalkıp iniyordu. Bir binanın nabzı.
      `),
      instruction: 'Koridorda dikkat çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps_k',
      miss: fallback('FB_KORIDOR', 'TAP', {
        score: { ARASTIRMA: -10 },
        feedback: { text: 'Boş bir duvar. Halıda bir leke. (−1 büyüteç)', label: `${minus(10)} SKOR`, tone: 'error' },
      }),
      finish: { id: 'KORIDOR_BITIR', label: 'Binadan çık' },
    }),
    conversation('INV1_BAYI', {
      ...INV1,
      title: 'Mavi İletişim',
      background: 'sokak_yagmur',
      room: { label: 'MAVİ İLETİŞİM · KENT MEYDANI', character: 'onur' },
      onFirstEnter: [{ type: 'MEET', character: 'onur' }],
      lines: B(S`
        = KENT MEYDANI · MAVİ İLETİŞİM · 15.20 @sokak_yagmur
        - Dar bir dükkân. Duvarda kılıflar, camda "SIM KART · FATURA · YEDEK PARÇA". Tezgâhta mavi tişörtlü bir genç telefonla oyun oynuyordu.
        onur: Abla hoş geldin, kılıf mı, hat mı? Kampanya var, internetli.
        > Avukatım. Geçen yıl 4 Kasım'da burada bir SIM değişikliği yapılmış. Kimin yaptığını öğrenmek istiyorum.
        - Telefonu ters çevirdi. Gülümsemesi yerinde kaldı ama gözleri kapıya kaydı.
        onur: Abla, geçen yıl… Günde kırk hat değişiyor burada. KVKK var abla, ben bir şey gösteremem. Sistem öyle.
        - Arka odadan bir radyo sesi geliyordu; bir futbol yorumcusu hakemi suçluyordu. Onur radyonun sesini kısmadı; arkasına saklanmak ister gibi.
      `),
      choices: [
        option('BAY_SOR', 'Belge istemiyorum. Hat değişikliği nasıl yapılır?', {
          discovers: 'clue_onur_vekil',
          score: { SORGULAMA: 40 },
          responses: B(S`
            onur: Normalde? Hat sahibi gelir, kimliğinin aslını gösterir. Yüz yüze bakarız, çipli kimliği okuturuz, sisteme yükleriz. Prosedür abla.
            onur: Bazen vekâletle gelen olur, noterden. O zaman vekâletnameyi tararız… yani o gün de vekâletle gelen bir abiydi galiba. Yani! Çok müşteri var, hatırlamam.
            - Kendi cümlesinin ortasında durdu, sonra hızla bitirdi. Telefonunu yeniden çevirdi, oyunu açtı. Oyun açılmadı.
            - Arkasındaki camda bir yazı: "Kimlik aslı olmadan işlem yapılmaz." Yazı güneşten solmuştu; bir yerinde bir kalpli çıkartma vardı.
            ~ "Bir abi." Hat sahibi bir kadın. Kendi ağzından kaçtı. Ama tezgâhta söylenen söz tutanağa girmez; mahkemede yeniden söylenmesi gerekir.
          `),
          next: '$stay',
        }),
        option('BAY_DOSYA', 'İşlem dosyasını mahkeme isterse verir misiniz?', {
          score: { USUL_BILGISI: 20 },
          effects: [raise('fact_bayi_yol')],
          responses: B(S`
            onur: Mahkemeden yazı gelirse tabii abla, merkez verir. Biz yüklüyoruz zaten, her şey operatörde. Ben bir şey saklamıyorum ki.
            onur: Bizim burası bayi abla, biz sadece aracıyız. Operatör ne derse o. Ben de burada staj yapıyormuş gibi çalışıyorum zaten, maaş asgari.
            ~ Saklamıyorsa neden kapıya bakıyor? Belgeler operatörde. Yol mahkemeden geçiyor; dükkânın tezgâhından değil.
          `),
          next: '$stay',
        }),
        option('BAY_BASKI', 'Dosyayı göstermezsen mahkemede seni de sorumlu tutarım, bilesin.', {
          score: { USUL_BILGISI: -100 },
          effects: [inc('ethics'), dec('cred'), raise('onur_baski')],
          bad: 'Muhtemel bir tanığı korkutmak, tanığı etkilemeye teşebbüs sayılabilir (TCK 277) ve meslek kurallarına aykırıdır.',
          responses: B(S`
            onur/kizgin: Beni mi tehdit ediyorsun abla? Patron! Patron, avukat tehdit ediyor!
            - Arka odadan biri seslendi. Onur tezgâhın arkasına çekildi, kollarını kavuşturdu.
            onur: Mahkemede konuşurum. Seninle değil.
            ~ Bir tanığı kaybetmek için bir cümle yeter. Kazanmak için bir duruşma bile yetmeyebilir.
          `),
          next: '$return',
        }),
        option('BAY_PARA', 'Bir kahve parası bırakayım; dosyaya bir göz atayım.', {
          score: { USUL_BILGISI: -150 },
          effects: [inc('ethics', 2), dec('cred'), raise('tanik_etkileme'), raise('onur_para')],
          bad: 'Tanığa ya da kayıt tutana menfaat teklif etmek tanığı etkilemedir (TCK 277) ve kişisel verileri hukuka aykırı elde etmeye azmettirme oluşturabilir (TCK 136, 38). Ağır meslek ihlali (Av.K. 34).',
          responses: B(S`
            - Onur'un gözleri banknotta bir an durdu. Sonra kameraya, tavandaki küçük siyah göze.
            onur: Abla… bunu kayda alıyor o. Al paranı. Allah aşkına, al.
            - Parayı geri aldım. Elim yanıyordu. Tavandaki kamera bir şeyi kaydetmişti: benim, bir tanığa para uzatışımı.
            ~ Bir yıl önce biri bu tezgâha bin lira bırakmıştı. Bugün ben bıraktım. Aramızdaki tek fark, onun aldığı.
          `),
          next: '$return',
        }),
        back('BAY_GERI', 'Teşekkür et, çık'),
      ],
    }),
    conversation('INV1_BURAK', {
      ...INV1,
      title: 'Tamirci',
      background: 'sokak_gece',
      room: { label: 'TAMİR ATÖLYESİ · YILDIRIM', character: 'burak' },
      onFirstEnter: [{ type: 'MEET', character: 'burak' }],
      lines: B(S`
        = YILDIRIM · TELEFON TAMİRCİSİ · 18.05 @sokak_gece
        - Bir merdiven altı dükkân. Tezgâhta sökülmüş telefonlar, bir lehim makinesi, bir bardak soğumuş çay. Burak bir ekranı cımbızla kaldırıyordu.
        burak: Avukat ha. Sevim teyze yolladı, değil mi? "O yaptı" dedi. Her şeyi ben yaptım zaten; küresel ısınmayı da.
        burak: Sor bakalım. Ama çabuk; bu ekran soğumadan takılacak.
        - Tezgâhın köşesinde bir fotoğraf çerçevesi, ters çevrilmiş. Burak bakışımı fark etti, çerçeveyi bir çekmeceye kaldırdı.
        burak: Eski. Kırık zaten. Tamir edemediğim tek şey.
      `),
      choices: [
        option('BUR_ALIBI', '4 Kasım sabahı, onu on geçe neredeydin?', {
          discovers: 'clue_burak_alibi',
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_burak_temiz')],
          responses: B(S`
            - Cımbızı bıraktı, ekranı bir bezle sardı. Bir an bana baktı; bir yıllık bir kırgınlığın içinden bakar gibi.
            burak: Burada. Her sabah burada. Dokuzda açarım. Dur bakayım.
            - Kasanın yanındaki eski bilgisayarda bir şeyler aradı. POS dökümü. 4 Kasım 2025: 10.09, 10.20, 10.31. Üç ekran değişimi. Kendi kamerasının kaydı da duruyordu; o gün hiçbir şeyi silmemiş.
            burak: Ben kayıt silmem. Silen, saklayandır. Ece öğretti bana bunu, her şeyin ekran görüntüsünü alırdı.
            burak: Sevim teyzeye söyle; ben Ece'ye kızgındım, evet. Ama kızgın olmak, bir insanın hattını çalmak değil. Ben telefon tamir ederim, hayat bozmam.
            ~ Bir alibi. Ve bir ayrılığın arkasında hâlâ duran bir saygı.
          `),
          next: '$stay',
        }),
        option('BUR_IMEI', 'Bir SIM nasıl başkasının eline geçer?', {
          score: { HUKUKI_BILGI: 20, ARASTIRMA: 20 },
          effects: [raise('fact_imei')],
          responses: B(S`
            burak: SIM kart dediğin bir anahtar. Bayi de çilingir. Kimliğin aslı lazım, yüz yüze. Ama bir fotokopi, bir de sahte vekâletname getirirsen, tembel bir çilingir kapıyı açar.
            burak: Yeni kartı kim nereye takarsa, operatör onu görür. Her telefonun bir kimliği var, IMEI. On beş hane. Kutunun altında yazar.
            burak: Kart değişir, telefon değişmez. Ece'nin kartını başka bir telefona taktılarsa, kayıtlarda o telefonun numarası çıkar. Eski iPhone'un numarası değil.
            burak: Bir de şunu bil: bu işleri yapanlar çoğunlukla telefonu da tek kullanır. Ucuz bir Android alırlar, her şeyi ona takarlar. Tembeldirler. Tembellik iz bırakır.
            ~ Leyla'nın cümlesi: kart bir telefonun içinde yaşar, telefonun da kimliği vardır.
          `),
          next: '$stay',
        }),
        option('BUR_TEKLIF', 'Burak’ın söyleyeceği bir şey daha var gibi', {
          visibleWhen: any(chosen('BUR_ALIBI'), chosen('BUR_IMEI')),
          responses: B(S`
            - Burak cımbızı bıraktı. Sesini alçalttı, dükkânda ikimizden başka kimse yokken.
            burak: Bak. Eski çalıştığım bayinin şifresi hâlâ duruyor bende. Kapatmayı unutmuşlar. Girerim, Ece'nin hattının o günkü kaydını çekerim. Beş dakika.
          `),
          next: 'INV1_BURAK_T',
        }),
        back('BUR_GERI', 'Teşekkür et, çık'),
      ],
    }),
    choiceNode('INV1_BURAK_T', {
      ...INV1,
      title: 'Beş dakika',
      background: 'sokak_gece',
      prompt: { speaker: 'burak', text: 'Ne diyorsun? Kimse bilmez. Ece için.' },
      choices: [
        option('BURT_RED', 'Hayır. Mahkemeden isteriz; şifreyi kapat.', {
          score: { USUL_BILGISI: 60 },
          effects: [raise('burak_red')],
          good: 'Yetkisiz erişimle alınan kayıt suçtur (TCK 243, 136) ve delil olarak kullanılamaz (Anayasa 38/6; CMK 206/2-a, 217/2). Doğru yol mahkeme yazısıdır (CMK 177).',
          responses: B(S`
            burak: Mahkemeden. Bir yıl sürer.
            > On üç günde gelecek. Ve geldiğinde kimse ondan şüphe etmeyecek.
            - Burak omuz silkti, sonra bilgisayarı açıp bir şeyleri sildi. "Kapattım" dedi. "Ece'ye söyleme. Benim böyle bir şey teklif ettiğimi."
          `),
          next: '$return',
        }),
        option('BURT_KABUL', 'Çek. Ece için; kimse bilmeyecek, ben de kimseye göstermem.', {
          discovers: 'ev_bayi_ekran',
          score: { USUL_BILGISI: -100 },
          effects: [inc('ethics', 2), dec('cred'), raise('illegal_alindi')],
          bad: 'Yetkisiz erişime ve kişisel veriyi hukuka aykırı ele geçirmeye azmettirme (TCK 243, 136, 38); ağır meslek ihlali (Av.K. 34). Bu kayıt mahkemede delil olamaz; sunulursa savunmanın güvenilirliği çöker.',
          responses: B(S`
            - Burak beş dakika bile sürmedi. Ekranda Ece'nin hattı, 4 Kasım, 10.12: "SIM değişikliği — Mavi İletişim." Telefonuyla bir fotoğraf çekti, bana gönderdi.
            burak: Al. Kimse bilmez.
            ~ Kimse bilmez. Ben bilirim. Bir delilin nereden geldiğini unutmak, onu kullananın işi değil; onu dinleyen hâkimin işidir.
          `),
          next: '$return',
        }),
      ],
    }),
    conversation('INV1_GOKHAN', {
      ...INV1,
      title: 'Siber Şube',
      background: 'karakol',
      room: { label: 'EMNİYET · SİBER SUÇLARLA MÜCADELE', character: 'gokhan' },
      onFirstEnter: [{ type: 'MEET', character: 'gokhan' }],
      lines: B(S`
        = EMNİYET · SİBER ŞUBE · 10.00 @karakol
        - Üç monitör, iki boş kahve bardağı, bir saksıda ölmüş bir sukulent. Gökhan Ateş ekranlardan birini kapatmadan bana döndü.
        gokhan: Avukat hanım, bende dört yüz dosya var. Dört yüz. Hepsi aynı: biri ilan veriyor, biri para gönderiyor, para bir hesaptan geçiyor. Hesap kiminse, dosya onun.
        gokhan: Ece Yalın. Hatırlıyorum. Ağladı. Hepsi ağlar. Buyurun, ne soracaksınız?
        - Duvarda bir pano, panoda onlarca dekont fotokopisi, her birinin üstünde bir isim. İsimlerin çoğu genç. Bazılarının yanında soru işareti.
        gokhan: Şuna bakın. Hepsi aynı hikâye. Bir ilan, bir hesap, bir kurban. Kimin kurban kimin fail olduğunu ayırmaya vaktim yok. Hesap kimdeyse, dosya onda.
        - Telefonu titredi; baktı, açmadı. Ekranda "ANNEM" yazıyordu. Ters çevirdi. Dört yüz dosyanın arasında bir annenin araması da beklemek zorundaydı.
      `),
      choices: [
        option('GOK_LOG', 'Bankadan cihaz kaydı istediniz mi?', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_polis_eksik')],
          responses: B(S`
            - Ekrana bir şey yazdı, sonra sildi. Kahve bardağını aldı, boş olduğunu fark etti, yine de dudağına götürdü.
            gokhan: Hesap özeti istedik. Banka özet gönderdi. "Mobil kanal" yazıyordu; mobil kanal, sanığın mobil şubesi demek.
            > Hangi cihaz?
            gokhan: …Cihaz istemedik. Gerek görmedik. Hesap onun, şifre onun, uygulama onun. Dört yüz dosya, avukat hanım.
            gokhan: Bakın, isteseydik belki gelirdi. Ama bankadan cihaz kaydı istemek bir ay, operatörden bir ay daha. Dosya o arada savcıya gider, savcı iddianameyi yazar.
            ~ "Mobil kanal." Bir kanalın iki ucu vardır. Polis yalnızca birine bakmış.
          `),
          next: '$stay',
        }),
        option('GOK_SIM', 'Hattın 4 Kasım’da değiştirildiğine baktınız mı?', {
          score: { SORGULAMA: 20 },
          responses: B(S`
            gokhan: SIM mi? Hayır. İfadesinde "telefonum çekmiyordu" dedi; bunu herkes der. Hattın tespiti için mahkeme kararı lazım, dosya da zaten açıktı.
            gokhan: Siz isterseniz mahkeme isteyebilir. Sanığın kendi hattı, sorun olmaz. Başkasının hattına bakacaksanız o başka iş; şüpheli olması lazım.
          `),
          next: '$stay',
        }),
        option('GOK_ECE', 'Ece’nin ifadesinde sizi ikna eden ne oldu?', {
          score: { SORGULAMA: 20 },
          effects: [raise('fact_gokhan_mantik')],
          responses: B(S`
            gokhan: "Kimseyle kod paylaşmadım" dedi. Peki. O zaman yeni cihazı kim tanımladı? Kod onun telefonuna geldiyse, ya o tanımladı ya birine verdi.
            gokhan: Vermediğini söylüyorsa, kendisi tanımlamıştır. Mantık bu. Ben mantıkla çalışırım.
            gokhan: Bakın avukat hanım, ben kötü bir polis değilim. Ben yorgun bir polisim. İkisi dışarıdan aynı görünür. İçeriden değil.
            ~ Mantık sağlam. Öncülü çürük. Ve öncülü çürütmenin tek yolu, Ece'nin kendi cümlesi.
          `),
          next: '$stay',
        }),
        option('GOK_ATM', 'ATM görüntüsü dosyada yok. Neden?', {
          score: { SORGULAMA: 10 },
          responses: B(S`
            gokhan: İstedik. Gelmedi. Banka bir yazı yazdı, "kamera kayıtları talep hâlinde" diye. Sonra iddianame çıktı, kimse peşine düşmedi.
            gokhan: Siz isteyin. Gelirse bana da bir kopya. Merak ettim şimdi.
          `),
          next: '$stay',
        }),
        back('GOK_GERI', 'Teşekkür et, çık'),
      ],
    }),
    documentExam('INV1_HESAP', {
      ...INV1,
      title: 'Hesap hareketleri',
      background: 'buro',
      hud: ['exam_left'],
      lines: B(S`
        - Banka yazısı tek sayfa: beş satır, beş saat, beş tutar. Para bir nehir gibi girmiş, deltaya varmış gibi dağılmış.
        - Yetmiş beş bin lira, yirmi beş dakikada üçe bölünmüş. Bir kısmı bir kripto platformuna, bir kısmı bir isme, bir kısmı bir ATM'ye. Para hızlı; iz yavaş.
        ~ Bir alet seç, sonra satıra dokun. Rakamlar yalan söylemez; ama sorulmadan da bir şey söylemez.
        - Banka yazısının altında bir imza, bir kaşe ve bir cümle: "Bilgilerinize arz olunur." Bir yıl boyunca kimse bu bilgiyi arz edilenin ötesinde okumamış.
      `),
      header: { left: 'VADESİZ HESAP · ECE YALIN', right: '01.11–04.11.2025' },
      columns: [
        { label: 'TARİH / SAAT', flex: 1.2 },
        { label: 'İŞLEM', flex: 2 },
        { label: 'TUTAR', flex: 1 },
      ],
      rows: [
        row('h1', ['01.11 09.14', 'Gelen EFT · MEHMET DEMİR', '+4.500,00']),
        row('h2', ['04.11 13.40', 'Gelen EFT · NURETTİN AKSOY', '+75.000,00']),
        row('h3', ['04.11 13.52', 'Giden · KRİPTO PLATFORM A.Ş.', '−40.000,00']),
        row('h4', ['04.11 13.58', 'Giden EFT · M. DEMİR …0418', '−15.000,00']),
        row('h5', ['04.11 14.05', 'Kartsız çekim · ATM', '−20.000,00']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
      costVar: 'exam_left',
      rules: [
        examine('EX_H1', 'mag', 'h1', {
          discovers: 'clue_avans',
          score: { DELIL_ANALIZI: 100 },
          feedback: {
            title: 'YENİ İPUCU',
            text: 'Açıklama alanı: “NOVA DIJITAL EGITIM AVANSI”. Gönderen IBAN …0418. Savcı buna “kira bedeli” demiş; gönderen ona “eğitim avansı” demiş.',
            label: '+100 SKOR · Not defterine eklendi',
            tone: 'special',
          },
        }),
        examine('EX_H4', 'cmp', 'h4', {
          discovers: 'clue_mdemir_cikis',
          score: { DELIL_ANALIZI: 150 },
          feedback: {
            title: 'YENİ İPUCU',
            text: 'IBAN …0418. 1 Kasım’da 4.500 TL’yi gönderen hesapla aynı. Avansı gönderen, kaporadan payını geri almış.',
            label: '+150 SKOR · Not defterine eklendi',
            tone: 'special',
          },
        }),
        examine('EX_H5', 'mag', 'h5', {
          discovers: 'clue_qr_atm',
          score: { DELIL_ANALIZI: 100 },
          feedback: {
            title: 'YENİ İPUCU',
            text: 'Kartsız çekim: ATM ekranındaki karekod, mobil şubeye tanımlı bir telefonla okutulur. Yer: Kent Meydanı, Osmangazi. Ece’nin telefonunda ise o sabahtan beri “SIM yok” yazıyordu.',
            label: '+100 SKOR · Not defterine eklendi',
            tone: 'special',
          },
        }),
      ],
      miss: fallback('FB_HESAP', 'EXAMINE', {
        score: { DELIL_ANALIZI: -20 },
        feedback: {
          title: 'SONUÇ YOK',
          text: 'Bu aletle bu satırda yeni bir şey görünmüyor.',
          label: `${minus(20)} SKOR`,
          tone: 'error',
        },
      }),
      finish: { id: 'HESAP_BITIR' },
    }),
    documentExam('INV1_SIKAYET', {
      ...INV1,
      title: 'Şikâyet dilekçesi',
      background: 'buro',
      hud: ['exam_sk'],
      lines: B(S`
        - Nurettin Aksoy'un dilekçesi temiz bir el yazısıyla, sonra bilgisayarda yeniden yazılmış. Paragraflar numaralı. Bir yerde, parantez içinde, bir dipnot.
        - İlk sayfanın köşesinde bir not: "Eşimin diyaliz günleri: Salı, Perşembe, Cumartesi. Duruşmaların bu günlere denk getirilmemesini saygılarımla arz ederim."
        ~ Öğretmenler hiçbir şeyi atlamaz. Atladıkları şeyi de dipnota yazarlar.
        - Dilekçenin son sayfasında, imzanın altında küçük bir not daha: "Paramın tamamını değil, eşimin bir yıllık yol parasını istiyorum." Sonra üstü çizilmiş; ama okunuyor.
      `),
      header: { left: 'ŞİKÂYET DİLEKÇESİ · N. AKSOY', right: '04.11.2025' },
      columns: [
        { label: 'SAAT', flex: 0.8 },
        { label: 'OLAY', flex: 2 },
        { label: 'NOT', flex: 1.4 },
      ],
      rows: [
        row('s1', ['13.05', 'İlanı gördüm, satıcıyı aradım', 'İlan görüntüsü ekte']),
        row('s2', ['13.31', 'İkinci görüşme: “kardeşimin hesabı”', '(Dipnot 1)']),
        row('s3', ['13.40', 'EFT ile 75.000 TL gönderdim', 'Dekont ekte']),
        row('s4', ['14.40', 'Satıcıya ulaşılamadı', '13 arama']),
        row('s5', ['18.10', 'İlandaki adres boş bir otopark', '—']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
      costVar: 'exam_sk',
      rules: [
        examine('EX_S1', 'mag', 's1', {
          discovers: 'clue_satici_no',
          score: { DELIL_ANALIZI: 100 },
          feedback: {
            title: 'YENİ İPUCU',
            text: 'İlan görüntüsü: “Sahibinden acil, Clio 2014. Arayın: 0532 614 41 07 — Kaan.”',
            label: '+100 SKOR · Not defterine eklendi',
            tone: 'special',
          },
        }),
        examine('EX_S2', 'mag', 's2', {
          discovers: 'clue_ding_nurettin',
          score: { DELIL_ANALIZI: 150 },
          feedback: {
            title: 'YENİ İPUCU',
            text: 'Dipnot 1: “Görüşme sırasında arkadan bir asansör sinyali ve kayıtlı bir kadın sesiyle ‘Dördüncü kat’ anonsu duyulmuştur.” Kırk yıllık öğretmen.',
            label: '+150 SKOR · Not defterine eklendi',
            tone: 'special',
          },
        }),
      ],
      miss: fallback('FB_SIKAYET', 'EXAMINE', {
        score: { DELIL_ANALIZI: -20 },
        feedback: {
          title: 'SONUÇ YOK',
          text: 'Bu satırda bu aletle yeni bir şey yok.',
          label: `${minus(20)} SKOR`,
          tone: 'error',
        },
      }),
      finish: { id: 'SIKAYET_BITIR' },
    }),
  ],
};
