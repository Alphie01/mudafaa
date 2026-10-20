import { cont, dec, inc, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, S } from './dsl.js';
import { BRIEF, INV1, PRO, p1 } from './shared.js';

// 40-briefing: soğuk açılış (isimsiz sesler), Emniyet gecesi, Zehra büroda, Leyla'nın dosya devri ve ceza aralığı
// sorusu, dinleme ve kışkırtma dersi, dosyadaki dört kâğıt, dosya ekranı + strateji, cezaevi kapısında ilk sabah.

const strategy = (id: string, value: string, pct: number, reply: string) =>
  option(id, value === 'MASUMIYET' ? 'Masumiyet' : value === 'USUL' ? 'Hukuka aykırı delil' : 'Terditli savunma', {
    group: 'g_strateji',
    effects: [set('strategy', value), set('strategy_pct', pct), ...p1.start()],
    responses: B(S`
      leyla: ${reply}
      - Leyla paltosunu aldı, kapıda durdu.
      leyla: Yarın sabah cezaevine git. Müvekkilini dosyadan önce gör; dosya onu tanımıyor.
    `),
    next: 'INV1_SABAH',
  });

export const briefing: CasePart = {
  nodes: [
    story('PROLOG', {
      ...PRO,
      title: '12 Mart · 10.31',
      background: 'sokak_yagmur',
      lines: B(S`
        = 12 MART 2027 · 10.31 — NİLÜFER TAPU MÜDÜRLÜĞÜ @sokak_yagmur
        - Yağmur, müdürlüğün önündeki sıraya inatla yağıyordu. Takipçiler dosyalarını başlarına tutmuş, sıra fişi makinesi her otuz saniyede bir "dıt" diyordu.
        - Islak bir yağmurluk makinenin önünde durdu. Bir fiş çekti: 147. Yağmurluğun iç cebinde bir zarf vardı; göğsünde, gömleğin altında, bantla yapıştırılmış ince bir kablo.
        ?KULAKLIK{phone}: Deneme. Bir, iki. Sesin geliyor. Rahat ol. Normal konuş. Sadece zarfı ver ve çık.
        - Yağmurluk cevap vermedi. Turnikeden geçerken güvenlik görevlisi başını bile kaldırmadı. Bu binada herkes bir şey taşır: tapu, vekâletname, umut.
        = 10.35 — İKİNCİ KAT, KONTROL ODASI @adliye
        - İkinci katın sonundaki odada bir dahili telefon çaldı. Elli yaşlarını geçmiş bir memur başını dosyadan kaldırdı. Gözlüğü, unuttuğu yerde, başının üstündeydi.
        - Ahizeyi kaldırdı. Karşıdaki ses boğuktu, aceleciydi. Memur dinledi, telefonun ekranına baktı, kalemini aldı ve takvimine bir şey yazdı.
        ?MEMUR: Geliyorum. Müdür Hanım beklemesin.
        - Ceketini almadı. Dosyayı kapatmadan önce sayfanın kenarını masanın kenarıyla hizaladı. Yirmi yıllık bir alışkanlık. Sonra çıktı, merdivenlere yürüdü.
        - Masanın üçüncü çekmecesi her zamanki gibi kilitsizdi. Kilidi vardı; kullanılmazdı.
        = 10.38 — KORİDOR
        - Koridorda florasan bir lamba titriyordu. Çay ocağından demlik buharı, uzaktan bir radyonun cızırtısı.
        ?FISILTI: Burada değil. Bana ver. Ben bırakırım. Üçüncü çekmece; hiç kilitlemez zaten.
        ?KULAKLIK{phone}: Ne diyorsun? Duyamıyorum. Kimle konuşuyorsun? Hey—
        - Kablonun içinden kısa bir cızırtı geçti. Sonra hiçbir şey. 10.39. Kulaklıktaki adam ekranına baktı: kayıt durmuştu. !flash
        - Koridorun bir yerinde bir kapı açıldı, kapandı. Yirmi saniye. Havada tatlı, keskin bir koku kaldı; bir an, sonra o da dağıldı.
        = 10.44 @adliye
        - Merdivenden sivil giyimli üç adam çıktı. Önde yürüyen, cebinden bir kâğıt çıkararak kontrol odasının kapısını açtı.
        - Oda boştu. Bir masa, bir takvim, kurumuş bir sardunya, soğumuş bir çay bardağı. Adamlar birbirine baktı.
        - İki dakika sonra memur döndü. Elinde hâlâ kalemi vardı; yüzünde, aşağıda boşuna beklemiş birinin sabırsızlığı.
        ?MEMUR: Müdür Hanım toplantıdaymış, kimseyi çağırmamış. Siz kimsiniz? Burası kontrol odası, efendim; izinsiz girilmez.
        ?SİVİL POLİS: Halil Ekinci siz misiniz? Mali Şube. Masanızı açacağız. Yanımızda durun lütfen.
        - Üçüncü çekmece açıldı. Kahverengi bir iç yazışma zarfı. Kenarından iki yüzlükler görünüyordu. Bir flaş patladı. !flash
        - Memur zarfa baktı. Sonra polise. Sonra yine zarfa. Gözlüğünü başından indirip burnuna taktı; sanki doğru bakarsa zarf kaybolacakmış gibi.
        ?MEMUR: Bu zarf benim değil.
        - Kimse cevap vermedi. Bu cümleyi her çekmecede, her ceplerde, her bagajda duymuşlardı. Bir kez bile doğru olup olmadığını sormamışlardı. !fade
      `),
      choices: [cont('PROLOG_DEVAM', 'Aynı gece', 'PROLOG_2', { role: 'PRIMARY' })],
    }),
    story('PROLOG_2', {
      ...PRO,
      title: 'Aynı gece',
      background: 'karakol',
      lines: B(S`
        = 12 MART 2027 · 23.10 — EMNİYET, MALİ SUÇLARLA MÜCADELE @karakol
        - İfade odasının florasanı vızıldıyordu. Masada bir bardak su, bir kalem, bir dosya. Halil Ekinci sandalyede dimdik oturuyordu; yirmi yedi yıllık bir memur gibi.
        - Karşısındaki komiser bir kâğıt okudu. Sesi düzdü; bu cümleyi daha önce de okumuş, okurken bir şey hissetmemeyi öğrenmişti.
        ?KOMİSER: Bir telefon görüşmesi, Halil Bey. Dün gece. "Kontrolcüyü hallettik. Zarf yarın masada." Kontrolcü kim?
        - Halil bir süre sustu. Gözlüğü yine başının üstüne çıkmıştı. Kendisi fark etmemişti.
        ?MEMUR: Kontrolcü benim, efendim. Binada bir tane. Ama ben hallolacak adam değilim. Yirmi yedi yılda kimse beni halledemedi.
        ?KOMİSER: Zarf çekmecenizden çıktı. Paralar bizim kaydettiğimiz paralar. Muhbir zarfı size verdiğini söylüyor.
        ?MEMUR: Muhbiriniz yalan söylüyor. Ben odamda değildim. Müdür Hanım çağırdı dediler, indim. Kayda geçsin lütfen: indim.
        - Komiser yazdı. Altını çizmedi. Çizmesine gerek yoktu; dosyada bir zarf, bir kayıt ve bir muhbir vardı. Gerisi, bir memurun "kayda geçsin"iydi.
        - Ertesi gün bir sulh ceza hâkimi tutuklama kararı verdi. Halil Ekinci cezaevine giderken ring aracının arka camından müdürlüğün önünden geçti. Sıra fişi makinesi hâlâ "dıt" diyordu.
        - Altı hafta sonra, ilk duruşmaya on sekiz gün kala, kızı bir avukat aradı. !fade
      `),
      choices: [cont('PROLOG2_DEVAM', 'Dosyayı aç', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...BRIEF,
      title: 'Zehra',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('leyla'), meet('zehra')],
      lines: B(S`
        = 22 NİSAN 2027 · 22.40 — ARSLAN HUKUK, BURSA @buro_gece
        ~ Bu şehirde herkes bir gün bir tapuya imza atar. Kimse imzanın arkasındaki eli düşünmez. Ben bu gece o eli düşüneceğim.
        - Yağmur camda kısa çizgiler çiziyordu. Kapı açıldığında içeri bir kadın girdi; yağmurluğunun altından yeşil bir hastane forması görünüyordu, ayaklarında hâlâ beyaz terlikleri.
        zehra: Arslan Hukuk? Kusura bakmayın, nöbetten çıktım, doğruca geldim. Saat on bir gibi kapanırsınız diye koştum.
        > Gelin, oturun. Bir çay söyleyeyim; nöbetten çıkana çay iyi gelir.
        zehra: Çay acilde kandan sonra en çok içilen sıvıdır. Teşekkürler, ama şimdi değil. Önce şunu söyleyeyim: babam rüşvet almaz.
        - Çantasından bir poşet çıkardı. İçinde bir tutanak fotokopisi, bir iddianame, bir de bir gözlük kılıfı vardı.
        zehra: Babam Halil Ekinci. Tapu kontrol memuru. Yirmi yedi yıl. Bir kere bir vatandaş masasına çikolata bıraktı diye tutanak tuttu. Çikolata için tutanak. Biz evde dalga geçerdik: Hâkim Bey derdik ona.
        zehra/uzgun: Şimdi gerçekten hâkim karşısına çıkacak. Altı haftadır içeride. Kendi gözlüğünü bile alamadı; polis götürürken başının üstündeydi, kaybolmuş.
        - Gözlük kılıfını masaya bıraktı. Kahverengi, eski, kenarı yıpranmış.
        zehra: Yedek gözlüğü bu. Okumadan uyuyamaz. Bana vermediler; "görüş günü değil" dediler. Kural. Babam olsa o da öyle derdi, biliyorum. Ama yine de.
        ~ Kuralı en çok seven adamın kızı, kuralın duvarına çarpmış. Ve bu gece duvarın öbür tarafındaki kapıyı çalıyor.
        zehra: Bir de bu var. Şubatta babamın ceketinin cebinde buldum. Ona göstermedim; o da bana göstermemişti.
        - Poşetten katlanmış bir kâğıt çıkardı. Yazıcı çıktısı, tek satır: "Her dosyayı durduran, bir gün kendisi durur."
        zehra: Babam dosya durdururdu. İşi buydu. Ve şimdi biri onu durdurdu.
        - Kâğıdı bana uzatmadı. Masaya, gözlük kılıfının yanına bıraktı; iki eşya yan yana, bir babanın iki hâli gibi.
        zehra: Ücretinizi bilmiyorum. Nöbetler çift ödeniyor, ek nöbet aldım. Yetmezse...
      `),
      choices: [
        option('BR00_A', 'Ücreti sonra konuşuruz. Önce dosya.', {
          effects: [raise('ucret_sonra'), inc('trust', 6)],
          responses: B(S`
            - Zehra bir süre bana baktı, sonra başını salladı. Hemşireler insanın yüzünden bir şey okumayı bilir; triyajda yüze bakılır.
            zehra: Peki. Ama ben borç unutmam. Babamın kızıyım.
          `),
          next: 'BR_01',
        }),
        option('BR00_B', 'Ücret tarifemizi anlatayım; sonra siz karar verin.', {
          responses: B(S`
            - Tarifeyi anlattım: dosya ücreti, duruşma başına, masraflar. Zehra her kalemde bir kez başını salladı; bir ilaç dozunu onaylar gibi.
            zehra: Anlaşıldı. Babam da olsa önce tarife derdi. Kural kuraldır.
          `),
          next: 'BR_01',
        }),
        option('BR00_C', 'Söz veremem. Ama dosyanın her satırını okurum.', {
          effects: [raise('deniz_durust'), inc('trust', 3)],
          responses: B(S`
            - Zehra ilk kez gülümsedi; yorgun, kısa.
            zehra: Söz veren avukatları sevmem zaten. Acilde de söz veren doktordan korkarız. Okuyun.
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
        - Zehra gittikten sonra Leyla kapının pervazından ayrıldı. Ne zamandır orada durduğunu bilmiyordum. Elinde soğumuş bir çay vardı; soğuk çayı sever, kimse nedenini bilmez.
        leyla: Kurallı insanların düşmanı çok olur, Deniz. Çünkü kural, herkesin işine gelmez.
        - Masama oturdu, iddianameyi çevirdi, gözlüğünü burnunun ucuna indirdi.
        leyla: Halil Ekinci. Tapu kontrol memuru. Çekmecesinden işaretli paralar çıkmış, bir dinleme kaydı, bir muhbir. Ağır cezada. Tutuklu.
        leyla: Bu tür dosyalar Bursa'da yılda birkaç kez açılır. Gazeteler "suçüstü" diye yazar. Suçüstü kelimesi, mahkemeden önce verilmiş bir hükümdür.
        leyla: Önce şunu bil. Neyle karşı karşıyayız? İddianamedeki suçun ceza aralığı ne?
        ~ Leyla soru sorduğunda cevabı bilir. Benim bilip bilmediğimi merak eder.
      `),
      choices: [
        option('BR01_A', 'Rüşvet: görevle ilgili bir iş için menfaat alan memur, 4–12 yıl hapis', {
          score: { HUKUKI_BILGI: 60 },
          good: 'TCK 252/2: görevinin ifasıyla ilgili bir işi yapması ya da yapmaması için menfaat sağlayan kamu görevlisi, veren kişi gibi (252/1) dört yıldan on iki yıla kadar hapisle cezalandırılır; anlaşma hâlinde suç tamamlanmış sayılır (252/3).',
          effects: [raise('br01_dogru')],
          responses: B(S`
            leyla/mutlu: Doğru. Ve şunu unutma: anlaşmanın kendisi yeter. Para el değiştirmese bile. Savcı bu yüzden "anlaştılar" diyecek.
            - Leyla gözlüğünü çıkardı, camını kazağının ucuyla sildi.
          `),
          next: 'BR_01K',
        }),
        option('BR01_B', 'İrtikap: memur parayı zorla istemiş; 5–10 yıl hapis, veren kişi mağdur', {
          bad: 'İrtikap (TCK 250/1) memurun nüfuzunu kötüye kullanarak icbarıdır; iddianame ise rüşvetten (TCK 252/2) açılmıştır: 4–12 yıl. Muhbirin ihbarında irtikap anlatısı vardır; bu ayrım ileride önem kazanacak.',
          category: 'HUKUKI_BILGI',
          responses: B(S`
            leyla: Muhbirin ilk ifadesi öyle diyor, evet. Ama savcı rüşvetten dava açmış. Dört ile on iki. Bu ayrımı aklında tut; ileride lazım olacak.
          `),
          next: 'BR_01K',
        }),
        option('BR01_C', 'Görevi kötüye kullanma: görevin gereklerine aykırı davranış, 6 ay–2 yıl', {
          bad: 'Görevi kötüye kullanma (TCK 257/1) torba bir suçtur ve “kanunda ayrıca suç olarak tanımlanan haller dışında” uygulanır. İddianame rüşvetten (TCK 252/2): 4–12 yıl.',
          category: 'HUKUKI_BILGI',
          responses: B(S`
            leyla: Keşke. O torba suçtur; başka bir suç tanımına girmeyen davranışlar için. Burada savcı rüşvet diyor. Alt sınır dört yıl.
          `),
          next: 'BR_01K',
        }),
        option('BR01_D', 'Rüşvet ama zarf kabul edilmediği için yarı oranında indirimli: 2–6 yıl', {
          bad: 'TCK 252/4’teki indirim, teklif ya da talebin karşı tarafça kabul edilmediği hâller içindir. İddianame, memurun parayı aldığını ve anlaştığını iddia ediyor: 252/2, dört yıldan on iki yıla.',
          category: 'HUKUKI_BILGI',
          responses: B(S`
            leyla: O indirim, teklifin geri çevrildiği hâller için. Savcı geri çevrildi demiyor; "aldı" diyor. Dört ile on iki, Deniz.
          `),
          next: 'BR_01K',
        }),
      ],
    }),
    story('BR_01K', {
      ...BRIEF,
      title: 'Anahtar deliği',
      background: 'buro_gece',
      lines: B(S`
        leyla: Bu dosyanın omurgası bir dinleme kaydı. Dinleme bir anahtar deliğidir, Deniz. Kayda bakmadan önce deliğin hangi kapıda olduğuna bak.
        leyla: Hangi hat, kimin adına, hangi suç için, hangi tarihten hangi tarihe. Bir hâkim kararı bunları tek tek yazar. Yazmadığı her şey, kapının dışında kalır.
        > Ve kapının dışından dinlenen?
        leyla: Hiç dinlenmemiş sayılır. Hukuka aykırı elde edilen delil, ne kadar doğru söylerse söylesin, hükme esas olamaz. Anayasa böyle der; usul kanunu da.
        leyla: Bir de muhbir var. Polis ona para vermiş, üstüne bir kayıt cihazı takmış, içeri yollamış. Polis bir suçu ortaya çıkarabilir; yaratamaz. Aradaki çizgiyi sen bulacaksın.
        - Masasındaki ters çevrilmiş çerçeveye bir an baktı. Hiç sormadım; sormamam gerektiğini biliyordum.
        ~ Bir yıl önce bir dosyada bir kaydı okutmuştum. İtiraz etmemiştim; "nasıl olsa okunur" demiştim. Sonra kararın hiç alınmadığını öğrendim. Leyla o dosyayı hatırlıyor. Ben de.
        leyla: Bir şey daha. Müvekkilin dürüst biri olabilir. Dürüst insanlar da bazen bir kez eğilir. Eğildiği yeri bul; savcı bulmadan önce.
      `),
      choices: [cont('BR01K_DEVAM', 'Dosyadaki kâğıtlara bak', 'BR_01B', { role: 'PRIMARY' })],
    }),
    story('BR_01B', {
      ...BRIEF,
      title: 'Dört kâğıt',
      background: 'buro_gece',
      lines: B(S`
        - Leyla dosyayı dört kâğıda indirdi ve masaya, iskambil açar gibi dizdi.
        leyla: Yakalama tutanağı. Üçüncü çekmece, kahverengi bir zarf, iki yüz tane iki yüzlük. Seri numaraları polisin listesiyle eşleşmiş.
        leyla: Dinleme kayıtları. Bir hâkim kararı, birkaç çözüm tutanağı. İddianame iki cümleye yaslanıyor: "Dosyana bakarım Bayram" ve "Zarf yarın masada."
        leyla: Muhbirin ifadeleri. Bayram Öz, tapu takipçisi. Hakkında "durumu önceden bildirdi" denip cezaya hükmolunmayacağı yazılmış. Rahat bir adam.
        leyla: Ve müvekkilin ifadesi. "Bu zarf benim değil. Odamda değildim. Çekmecemi kilitlemem."
        - Bir süre kâğıtlara baktık. Yağmur, çatıdaki olukta bir şarkıyı yarım bırakıp yeniden başlıyordu.
        leyla: Dördünde de bir el eksik, Deniz. Zarfı o çekmeceye koyan el. Tutanak zarfı buluyor; kimin koyduğunu yazmıyor. Kayıt bir cümle söylüyor; kimin ağzından, söylemiyor.
        leyla: Bir de şunu not et: muhbir "kendi elimle verdim" diyor. Müvekkil "odamda değildim" diyor. İkisi aynı anda doğru olamaz.
      `),
      choices: [cont('BR01B_DEVAM', 'Dosya ekranı', 'BR_02', { role: 'PRIMARY' })],
    }),
    story('BR_02', {
      ...BRIEF,
      phase: 'BRIEFING',
      title: 'Zarf',
      background: 'buro_gece',
      onFirstEnter: [meet('halil')],
      blocks: [
        {
          type: 'profileCard',
          character: 'halil',
          label: 'MÜVEKKİL',
          lines: ['Halil Ekinci, 54', 'Tapu kontrol memuru · 27 yıl · sabıkasız · tutuklu'],
          charge: 'Rüşvet (TCK 252/2)',
          demand: 'İddianame: 4–12 yıl hapis',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'gold', 'gold', 'red', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 40,
          labels: ['Beraat', '257: 6 ay–2 yıl', '4 yıl', '12 yıl'],
          demandLabel: 'İSTEM: TCK 252/2',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '12 Mart 2027’de Emniyet, tapu takipçisi Bayram Öz’ün ihbarı üzerine Nilüfer Tapu Müdürlüğünde kontrollü teslimat yaptı. Seri numaraları kaydedilen 40.000 TL, kontrol memuru Halil Ekinci’nin masasının üçüncü çekmecesinde bir iç yazışma zarfında bulundu. İddianame, bir dinleme kaydına ve muhbirin beyanına dayanıyor. Halil, zarfı hiç görmediğini ve o sırada odasında olmadığını söylüyor.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'İşaretli paralar sanığın çekmecesinde', strength: 'STRONG' },
            { label: 'Dinleme: “Kontrolcüyü hallettik, zarf yarın masada”', strength: 'STRONG' },
            { label: 'Muhbirin beyanı: “Kendi elimle verdim”', strength: 'MEDIUM' },
            { label: 'Sanığın kendi hattında: “Dosyana bakarım Bayram”', strength: 'MEDIUM' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET:
              'Masumiyet: zarfı çekmeceye koyanı ve tuzağı göstermeyi hedeflersin. Uyan esas savunma ×1,5 puan.',
            STR_USUL:
              'Hukuka aykırı delil: kayıtların kapsamını ve kolluğun kurduğu teslimatı çökertirsin; şüphe sanık lehine. Uyan esas savunma ×1,2 puan.',
            STR_INDIRIM:
              'Terditli: önce beraat; olmazsa rüşvet yerine daha hafif bir suç ve lehe hükümler. Uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        strategy(
          'STR_MASUMIYET',
          'MASUMIYET',
          150,
          'Cesur. Bir zarfın hangi elden geldiğini göstermen gerekecek. Elini bulursan, adını da bulursun.',
        ),
        strategy(
          'STR_USUL',
          'USUL',
          120,
          'Anahtar deliğinden başla. Ama unutma: kaydı düşürmek zarfı düşürmez. Çekmeceyi de açıklaman gerekecek.',
        ),
        strategy(
          'STR_INDIRIM',
          'INDIRIM',
          80,
          'Güvenli. Ama yirmi yedi yıllık bir memura "bir şey yaptın" mı diyeceksin? Kapıyı erken açma.',
        ),
      ],
    }),
    story('INV1_SABAH', {
      ...INV1,
      title: 'Cezaevi kapısı',
      background: 'sokak_sabah',
      lines: B(S`
        = 23 NİSAN · 08.30 — BURSA H TİPİ CEZAEVİ @sokak_sabah
        - Cezaevinin önü, sabahın erken saatinde bir otogar gibiydi: poşetler, termoslar, bekleyen kadınlar. Yağmur gece dinmiş, asfalt hâlâ parlıyordu.
        - Zehra kapının yanındaki duvara yaslanmıştı. Formasını değiştirmişti ama yüzünde hâlâ gece vardı. Elinde gözlük kılıfı.
        zehra: Görüş günü değil, biliyorum. Ama siz avukatsınız; sizin için gün yok. Bunu ona verebilir misiniz?
        - Kılıfı uzattı. İçinden bir kâğıt düştü; ikiye katlanmış, tükenmez kalemle yazılmış birkaç satır. Zehra kâğıdı yerden alıp yeniden kılıfa koydu.
        zehra: Bir de not yazdım. Okumak zorunda değilsiniz. "Baba, sardunyanı sulayamadım, odana girmeme izin vermediler" diye başlıyor. Öyle şeyler.
        ~ Avukatın görüş odasına götürebileceği şeyler bellidir. Bir gözlük, bir mektup. Kural bunlara izin verir; ama kuralı uygulayan kapıdaki memurdur.
        zehra: Babam kuralları sever. İçeride kurallara uyuyormuş. Gardiyan söylemiş: kütüphaneyi baştan düzenlemiş, kitapları yayınevine göre dizmiş.
        zehra/uzgun: Biz onunla dalga geçerdik. Şimdi o kurallar onu ayakta tutuyor sanırım.
      `),
      choices: [
        option('SABAH_A', 'Gözlüğü ve notu götürürüm. Kapıdan geçebildiği kadar.', {
          effects: [inc('trust', 5), raise('gozluk')],
          responses: B(S`
            - Kılıfı aldım. Kapıdaki memur içine baktı, gözlüğü ışığa tuttu, notu açıp okumadan katladı. "Geçebilir" dedi.
            zehra: Teşekkür ederim. Ona söyleyin: sardunya kurudu ama ben yeni bir tane aldım.
            ~ Bir müvekkilin güveni bazen bir dosyayla değil, bir gözlükle başlar.
          `),
          next: 'INV1_ILK',
        }),
        option('SABAH_B', 'Kurallar belli; ben dosyayla girerim, siz görüş gününü bekleyin.', {
          effects: [dec('trust', 4)],
          responses: B(S`
            zehra: Haklısınız. Babam da öyle derdi. Kural kural.
            - Kılıfı çantasına geri koydu. Fermuarı yavaş kapattı; sesi, bir kapının kapanması kadar uzun sürdü.
            ~ Doğru bir cümle, yanlış bir anda söylenince kapı yarı kapanır.
          `),
          next: 'INV1_ILK',
        }),
      ],
    }),
      story('INV1_ILK', {
      ...INV1,
      title: 'Pano',
      background: 'buro',
      lines: B(S`
        = 23 NİSAN · 11.40 — ARSLAN HUKUK @buro
        - Büroya döndüğümde Leyla mantar panoyu odamın duvarına çoktan asmıştı. Boş. Yalnızca ortada bir iğne, iğnede bir kâğıt: "ZARF."
        leyla: Her dosyanın bir merkezi vardır, Deniz. Bu dosyanın merkezi bir zarf. Etrafına dört soru yaz. Cevaplarını değil; soruları.
        - Kalemi aldım. Dört kâğıt, dört soru.
        - Birincisi: "Kayıt hangi kapının deliğinden alındı?" İkincisi: "Halil 10.35 ile 10.46 arasında neredeydi?" Üçüncüsü: "Muhbir neyi, kime, ne zaman verdi?" Dördüncüsü: "Bu zarf kimin işine yarar?"
        leyla: Dördüncüsünü en sona sakla. Mahkeme "kimin işine yarar" diye hüküm kurmaz. Ama sen o soruyu sormadan ilk üçüne doğru cevap bulamazsın.
        - Leyla bir dosya kutusunu masama bıraktı. İçinde dinleme kayıtlarının çözümleri, tutanaklar, bir CD. CD'nin üstünde kolluğun el yazısıyla: "Kayıt 1–14."
        leyla: Kayıtları dinlemeye kalkma. Önce kararı oku. Kayıt sana ne söylendiğini söyler; karar, söylenenin duyulmaya izinli olup olmadığını.
        ~ On dört kayıt, bir karar, bir zarf. Ve on yedi gün.
      `),
      choices: [
        option('ILK_A', 'Önce kararı ve tutanakları okuyacağım; kâğıt, insanlardan önce.', {
          effects: [raise('ilk_kagit')],
          responses: B(S`
            leyla: Kâğıt sabırlıdır. İnsanlar değil. Ama kâğıdı okumadan insanla konuşan, insanın anlattığını kâğıt sanar.
          `),
          next: 'INV1_HUB',
        }),
        option('ILK_B', 'Önce insanları göreceğim; kâğıt bekler, hafıza beklemez.', {
          effects: [raise('ilk_insan')],
          responses: B(S`
            leyla: Doğru. Yedi hafta geçti; hafıza her gün biraz daha tutanak gibi konuşmaya başlar. Ama kararı da unutma.
          `),
          next: 'INV1_HUB',
        }),
      ],
    }),
  ],
};
