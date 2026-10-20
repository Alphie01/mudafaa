# Dava #11 — Belediye Kasası · Hikâye Kitabı (noir)

> Bu belge Dava #11'in **anlatı kaynağıdır**. Yapısı ve yoğunluğu Dava #07 v2'nin hikâye kitabını
> (`docs/content/gece-bekcisinin-sirri-hikaye.md`) örnek alır. Hukuki gerçek, delil zinciri, sonuç koşulları ve puan mantığı
> `docs/content/belediye-kasasi.md` ile `docs/legal/belediye-kasasi.md`'dedir; bu belge onları **sahneye** çevirir.
> Kaynak kod: `content/src/belediye-kasasi/` → derlenmiş paket `content/cases/belediye-kasasi/`.
>
> Hisarönü Belediyesi ve bütün kişiler kurmacadır; Bursa'daki gerçek bir kurumu ya da kişiyi temsil etmez.

## 0. Ton ve kurallar

- **Noir dram.** Bursa, kasım sonu. Yağmur bu kez soğuk ve yatay; lodos camları titretir. Belediye binası 1980'lerden kalma
  bir beton kutudur: florasanlar vızıldar, kalorifer petekleri tıkırdar, vezne salonunda sıra fişi makinesi "dıt" diye öter.
  Her sahnede bir duyusal ayrıntı: ıslak şemsiye kokusu, para sayma makinesinin hışırtısı, dolma kalemin tıkırtısı, ince
  belli bardakta çay.
- **İç ses.** Deniz `style: "thought"` ile birinci tekil şahıs, kısa ve keskin cümlelerle düşünür. Gözlemler, sezer, ama
  **asla çözümü söylemez.** Örnek: *"Kasalar para tutmaz. Para tutan insanlardır. Kasalar sadece kimin tuttuğunu
  unutmaz."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Karakterler madde numarasıyla konuşmaz. Madde atfı yalnızca Leyla'nın kısa
  açıklamalarında, seçenek geri bildiriminde, rapor ve hüküm metinlerinde, duruşma tutanağı dilinde (başkan, savcı,
  Deniz'in resmî konuşması) geçer.
- **Gizem korunur.** Soğuk açılışta sesler isimsizdir (`speaker: "narrator"`, `name: "BİR SES"`, `"İKİNCİ SES"`, siluet).
  Ercan Tunalı'nın fail olduğu oyuncuya hiçbir zaman söylenmez ve kanıt kazanılmadan güçlü biçimde ima edilmez. Ercan dosya
  boyunca **yardımsever, kibar ve güvenilir** görünür; şüpheyi üç yöne dağıtan bir kadro vardır: müvekkilin kendisi (kredi,
  kızının ameliyatı), Melek Yavuz (yeni araba, bilgisayarındaki not kâğıdı), Burak Şen (yönetici yetkisi, şifre sıfırlama).
- **Ortak tik, ayrı anlam.** Hem Orhan hem Ercan "efendim" der. Orhan'da bu, ağır bir alçakgönüllülüktür; Ercan'da kusursuz bir
  nezaket perdesi. Soğuk açılıştaki silüet de "efendim" der; oyuncu bunu ikisinden birine bağlayamaz.
- **Her sahne bir şey değiştirir:** yeni bilgi, yeni şüphe ya da bir ilişkide kırılma.
- **Satır kuralları:** bir satır en çok ~220 karakter; yeni mekân `style: "card"` + `bg` ile açılır
  (`"PERŞEMBE 21.20 — ARSLAN HUKUK, BURSA"`); sert anlarda `fx` (kapı `shake`, şimşek ya da flaş `flash`, bölüm sonu `fade`).
- **Arka planlar:** `sokak_karanlik` (belediye arkası, gece), `sokak_yagmur`, `sokak_sabah`, `buro` (vezne salonu ve
  belediye odaları da bu ofis arka planıyla çizilir), `buro_gece` (Arslan Hukuk), `ev` (Kılıçların evi), `kafe`, `cay_ocagi`
  (belediyenin çay ocağı), `depo` (belediye arşivi), `adliye`, `durusma_salonu`, `hastane`, `arac`, `siyah`.
- **Sözcük bütçesi:** tipik yol (BERAAT_E) `case:duration` ölçüsüyle **13–16 bin sözcük**, ≥ 200 aksiyon, 90–120 dk; diğer
  her sonuç yolu ≥ 60 dk; paket toplamı ≥ 18 bin sözcük.

## 1. Logline ve tema

- **Logline:** On dokuz yıldır bir kuruşu bile eksik çıkmamış vezne memuru Orhan Kılıç, kendi kullanıcı adıyla iptal edilmiş
  47 makbuz ve 386.400 liralık kasa açığı yüzünden zimmetle yargılanıyor. Sistemde imzası, raporda adı, kasada parmak izi var.
  Orhan "ben yapmadım" diyor; ama şifresini bir zarfa koyup kimin çekmecesine bıraktığını söylemeye utanıyor.
- **Tema / dramatik soru:** *Bir şifre bir insan mıdır?* Kayıtlar kimin adını yazar, kimin elini gösterir? Ve: masum bir
  insana "öde, kabul et, kurtul" demek ne zaman yardım, ne zaman ihanettir? (TCK 248'in etik sınırı.)
- **Ana mekânlar:** Arslan Hukuk (gece), Hisarönü Belediyesi vezne salonu, belediye çay ocağı, Kılıçların evi (Yıldırım'da,
  dördüncü kat, asansörsüz), Hayri Bey'in kitap dolu salonu, bir köşe kafe, belediye otoparkı, adliye koridoru, Bursa
  6. Ağır Ceza Mahkemesi duruşma salonu.

## 2. Kadro: sesler, sırlar, yaylar

| Kimlik | Karakter | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|---|
| `deniz` | **Av. Deniz Arslan** (oyuncu) | Büroda dördüncü yılı; Kıdemli Avukat. | İç ses kısa ve alaycı; dışarıda nazik ama sabırsız. | Rakamlardan korkar: "Hukuk fakültesine sayısalcılar gelmez." Bu dosya onu rakamlarla yüzleştirir. | Rakamdan kaçan avukat → kayıtları okuyan avukat. |
| `leyla` | **Av. Leyla Erdem** (mentor) | 58, büronun kurucusu. | Az konuşur; her cümlesi bir ders. Sigara paketini masada çevirir. | Yıllar önce bir müvekkiline "kabul et, çık" demiş ve pişman olmuş (248 sahnesinde yalnızca ima; Dava #15 tohumu). | Deniz'i izler, kurtarmaz. 248 konusunda sert. |
| `orhan` | **Orhan Kılıç** (müvekkil) | 47, veznedar, 19 yıllık memur. Görevden uzaklaştırılmış, adli kontrolde. | Ağır, resmî, "efendim" der; heyecanlanınca sayı sayar, her şeyi kuruşuna kadar söyler: "Kırk yedi makbuz efendim. Üç yüz seksen altı bin dört yüz lira." | Şifresini, müdür yardımcısının talimatıyla mühürlü zarfa koyup verdi; bilgi güvenliği yönergesini çiğnediği için utanıyor ve bunu söylemiyor. Bazı akşamlar teslim tutanağını "teslim alan" kısmı boş bırakılmış hâlde imzaladı. Evdeki çekmecesinde günlük toplamları yazdığı bir defter ve tutanakların karbon kopyaları var. | Utanç → onur. Sonunda "şifremi verdim" demeyi öğrenir; hatasını söyleyen adamın suçlu olmadığını anlar. |
| `nazan` | **Nazan Kılıç** | 45, terzi; Orhan'ın eşi. | Hızlı, pratik, öfkeli; kuru mizah. İğneyi ağzında tutarak konuşur. | Evi satıp açığı ödeyerek "bitirmek" istiyor; Ercan'ın "öderseniz hafifler" lafı kulağına gelmiş. | Panik → güven. Ödeme fikrini bırakması 248 sahnesinin kalbidir. |
| `ercan` | **Ercan Tunalı** | 52, Mali Hizmetler Müdür Yardımcısı. | Yumuşak, kusursuz kibar, bürokratik: "Efendim, mevzuat ne diyorsa." İnce belli bardakta çay ikram eder; dolma kalemini tıkırdatır; "rahmetli babam da maliyeciydi" der. | Yasa dışı bahis borcu. Vezne şifrelerini "devamlılık için" zarflarda toplayan oydu. Veznedar 17.00'de kasayı teslim edip çıktıktan sonra ön odadaki ortak bilgisayardan Orhan'ın kullanıcı adıyla makbuz iptal etti, gün sonu raporunu yeniden bastı, teslim tutanağını fotokopi imzalı bir sahtesiyle değiştirdi, farkı kasadan aldı. | Yardımsever amir → "çözüm" teklif eden adam → kürsüde susan tanık. Hiçbir zaman ağlamaz, bağırmaz; çöküşü bir sessizliktir. |
| `melek` | **Melek Yavuz** | 36, Vezne 1 veznedarı. | Hızlı, iğneleyici, sakız çiğner; "canım" der; cümlelerini yarım bırakır. | O da şifresini zarfa koydu. Yeni arabasını kredi ile aldı (çeldirici). Ercan, fazla mesai onaylarını ve görev yerini belirleyen amiridir; korkuyor. | Düşmanca → itiraf. İkinci celsede "Hepimiz verdik" demesi dönüm noktasıdır. |
| `burak` | **Burak Şen** | 29, bilgi işlem teknikeri. | Gergin, teknik terimler kullanır, sonra özür diler; enerji içeceği; "yani, şey, teknik olarak". | 14 Ocak'ta Ercan'ın "Orhan Bey kilitlendi" talebiyle şifreyi kimlik doğrulamadan sıfırladı; ertesi sabah Orhan için bir kez daha sıfırladı. Kendisinin suçlanacağından korkuyor. | Korku → dürüstlük. Kayıtların yedeğini sakladığını söylemesi ara evresinin motorudur. |
| `hayri` | **Hayri Özdemir** | 71, emekli tarih öğretmeni; açığı ortaya çıkaran mükellef. | Titiz, ukala ama sevimli; tarihten benzetmeler yapar, başkalarının Türkçesini düzeltir. | Bütün makbuzlarını ayakkabı kutusunda saklar; 12 Şubat'ta vergisini ödediği saati ve kasiyerin parayı nasıl saydığını hatırlar. | Şikâyetçi → tanık. "Ben bu adamı suçlamak için gelmedim, hesabımı sormaya geldim." |
| `baskan` | **Başkan Halit Sezer** | Bursa 6. Ağır Ceza Mahkemesi başkanı. | Resmî, sabırlı, kuru: "Müdafi, sorunuz?" | — | — |
| `uye` | **Üye Hâkim Nilgün Aras** | Heyetin genç üyesi. | Kısa ve öldürücü sorular sorar. | — | Kritik anda tek soruyla tanığı sarsar. |
| `savci` | **Savcı Gökhan Ersoy** | 44, duruşma savcısı. | Rakamlarla konuşur, sabırsız ama dürüst; yeni delil karşısında görüş değiştirebilir. | — | Rakip → adil hakem. |
| `mubasir` | **Mübaşir Cevdet** | 60. | Sesini kapı aralığından salona yayar; hep biraz geç kalmış gibidir. | — | — |
| `bilirkisi` | **Dr. Seda Karaca** | 41, bilişim bilirkişisi. | Teknik, net, espri yapmaz; "Log yalan söylemez; yalnızca eksik söyler." | — | İkinci celsede sistemin açığını anlatır. |

Kadroda görünmeyen ama adı geçenler: Müdür Rıfat Yener (ocak–şubatta raporlu; kasa kodu 01, çeldirici), müfettiş Kenan Ateş
(teftiş raporunun yazarı), Elif Kılıç (17, kalp ameliyatı geçirmiş kızı).

## 3. Gerçek ve kronoloji

| Tarih / saat | Olay | Kim biliyor | Oyuncu nasıl öğrenir |
|---|---|---|---|
| 2024 sonu | Ercan, ön odadaki ortak bilgisayarın (MHM-PC03) vezne programına da açık olduğunu fark eder: vezne kullanıcıları yalnızca vezne terminalinden değil, müdürlüğün her bilgisayarından girebilmektedir; 10.000 TL altındaki iptaller ikinci onay istemez. | Ercan | Bilirkişi raporu (2. celse), Burak (ara) |
| Eylül 2025 | Ercan, "devamlılık" gerekçesiyle veznedarlardan şifrelerini mühürlü zarfta ister; el yazısı talimat, imzasız: "Şifreler zarfta, müdürlükte kalacak. — Müdürlük." (O sırada müdür Rıfat Yener de görevdedir; not kendi başına yazanı göstermez.) Bilgi güvenliği yönergesi şifre paylaşımını yasaklar. | Ercan, Orhan, Melek | Orhan'ın evindeki talimat notu (arama), yönerge (vezne salonu panosu), Melek (ara/2. celse) |
| 3 Kas 2025 – 27 Şub 2026 | 23 günde 47 iptal, toplam 386.400 TL. Her biri 17.38–17.56 arasında, Orhan'ın kullanıcı adıyla (okilic), terminal **MHM-PC03**'ten. | Ercan | İptal kayıtları (belge incelemesi) |
| Aynı günler 17.00 | Orhan kasayı sayar, defterine günlük toplamı yazar, teslim tutanağını doldurur, karbon kopyasını alır; torbaları müdürlükte kim kaldıysa ona verir: kasım–aralıkta kimi akşam müdür Rıfat Bey, kimi akşam Ercan, birkaç kez vezne sorumlusu Selim; ocaktan sonra Selim ya da Ercan. Teslim alan "sonra imzalarım" der; asıllardaki paraf okunaksızdır. Hangi akşam kimin aldığını yalnızca kasa kodu ve müdürlük turnikesi ayırır. | Orhan, Ercan | Orhan'ın defteri ve karbon kopyalar (ev araması) |
| Aynı günler 17.02–17.09 | Orhan turnikeden çıkar. | PDKS | Orhan'ın PDKS dökümü (ev → belge) |
| Aynı günler 17.38–17.56 | Ercan PC03'ten iptalleri yapar, gün sonu raporunu yeniden basar (basım saati raporda yazılı), teslim tutanağını Orhan'ın imzasının fotokopisiyle hazırlanmış sahtesiyle değiştirir. | Ercan | Dosyadaki tutanaklar (büyüteç: toner imza; basım saati), bilirkişi |
| Aynı günler 17.52–17.58 | Kasa odası alarm paneli: kullanıcı kodu **02** (Ercan) ile açılış. | Ercan | Kasa alarm kayıtları (1. celsede/dilekçede istenirse ara evresinde gelir) |
| Aynı günler 18.15–18.40 | Ercan turnikeden çıkar. | PDKS | Müdürlük PDKS kayıtları (istenirse ara evresinde) |
| 9 Oca 2026 | Orhan yıllık izinde (Elif'in kontrolü, Uludağ Üniversitesi Hastanesi). Yine de o akşam 17.46'da onun kullanıcısıyla iki iptal. | — | PDKS dökümündeki "İZİN" satırı + iptal kaydı |
| 14 Oca 17.20 | Ercan bilgi işleme "okilic kilitlendi, sıfırlayın" talebi açar; Burak kimlik doğrulamadan sıfırlar, geçici şifreyi telefonla Ercan'a söyler. 17.44'te iptal. | Ercan, Burak | Burak (ara), destek talebi kayıtları (istenirse) |
| 15 Oca 08.35 | Orhan'ın şifresi çalışmaz; Burak bir kez daha sıfırlar. Ercan "zarfı yenile" der; Orhan yeniler. | Orhan, Burak | Görüşme ("Şifre" konusu), destek kayıtları |
| 12 Şub 16.40 | Hayri Bey emlak vergisini öder; Orhan parayı iki kez sayar. Makbuz 17.47'de iptal edilir. | Hayri | Hayri (makbuz) |
| 4 Mar 2026 | Hayri Bey borç bildirimiyle gelir; açık ortaya çıkar. Ercan "hemen bakalım efendim" der ve müdürlüğe ilk raporu kendisi yazar. | herkes | Prolog sabahı |
| Mar–Nis | Orhan görevden uzaklaştırılır; teftiş raporu açığı onun kullanıcısına bağlar. Orhan'ın erken kapattığı kredi (Elif'in ameliyatı) "sebep" sayılır; kapatma parası rahmetli babasından kalan tarlanın satışından gelir. | Orhan | Banka ve tapu belgeleri (belge incelemesi) |
| Tem 2026 | İddianame: TCK 247/1-2, 43. Adli kontrol (yurt dışı yasağı). | | Dosya |
| Kasım 2026 | Nazan, Arslan Hukuk'un kapısını çalar. | | Brifing |

**Kilit hukuki gerçek (zilyetlik):** veznedar sayımı bitirip torbaları müdür yardımcısına teslim ettiği anda para onun
"koruma ve gözetim" alanından çıkar; para, kasada müdür yardımcısının zilyetliğindedir. İptaller ve para kasadan
alındığında Orhan binada bile değildir.

## 4. Yapı (bölümler ve node haritası)

```
PR_00  Soğuk açılış (gece 17.51, isimsiz siluet ve telefon)          STORY → PR_01
PR_01  Sabah: Hayri Bey'in makbuzu, açık, görevden uzaklaştırma      STORY → BR_00
BR_00  Bölüm 1 · DOSYA: Nazan ve Orhan büroda (yağmurlu gece)         STORY (seçim: güven)
BR_01  Leyla dosyayı devreder (ceza aralığı sorusu)                    STORY (A–D)
BR_01B Dosyada ne var: iddianame, teftiş raporu, savcılığın sayıları   STORY
BR_02  Dosya ekranı + strateji                                         STORY (strateji)
INV_SABAH Belediye önü sabahı                                          STORY → INV_HUB
INV_HUB  Bölüm 2 · SORUŞTURMA (3 gün × 3 EP; Leyla günde bir, 0 EP; tahta 0 EP)
  Mekân: INV_VEZNE (sahne: vezne salonu) · INV_EV_G + INV_EV (sahne: Orhan'ın çalışma masası)
  Müvekkil: INV_GORUSME (konu × ton; fakta bağlı konular; iki ziyaret)
  Tanıklar: INV_T_HAYRI · INV_T_MELEK · INV_T_ERCAN (konuşma; sorular)
  Arşiv: INV_LOG (iptal kayıtları) · INV_PDKS (giriş-çıkış) · INV_TUTANAK (teslim tutanakları) · INV_BANKA (kredi ve tapu)
         INV_DIL (delil dilekçesi, 3 talep) · INV_CIKARIM (tahta) · INV_LEYLA
  Gün sonu: INV_DAY_END (DECISION) → INV_AKSAM1 / INV_AKSAM2 (koşullu)
INV_GECE_* → INV_GECE (duruşmadan önceki gece; koşullu hafıza zinciri)
H1_K  Adliye koridoru → H1_00 açılış → H1_01 sanığın savunması (A–D) → H1_02 teftiş raporu (itiraz)
H1_03 Tanık Ercan (savcının sorusu, itiraz) → H1_04 Ercan'ın ifadesi (E1–E5; bastır/sun/itiraz) → H1_05 duruşma içi talepler
H1_ARA Ara karar: bilirkişi, celpler, erteleme
ARA_GIRIS_* → ARA_HUB  Bölüm 4 · ARA (2 gün × 4 EP; yığınsız, doğrudan dönüş)
  ARA_MELEK (kafe, gece) · ARA_BURAK (kafe) · ARA_EV (Nazan ve Orhan: 248) · ARA_HAYRI · ARA_SUC (suç duyurusu)
  ARA_KASA (kasa alarm kaydı) · ARA_PDKS2 (müdürlük PDKS) · ARA_TICKET (destek talepleri) · ARA_ZARF (zarflar, UV)
  ARA_KESIF (sahne: ön oda, bilirkişiyle) · ARA_CIKARIM (tahta) · ARA_LEYLA
  ARA_DAY_END → ARA_OTOPARK (Ercan'ın teklifi; ilk akşam) / ARA_AKSAM2
ARA_SON_* → ARA_SON (duruşma sabahı)
T_00 açılış → T_01 bilirkişi (sorular) → T_02 Melek (M1–M4) → T_03 Ercan (yeminsiz; R1–R4) → T_04 nitelendirme uyarısı
T_05 mütalaa → T_06 esas savunma → T_07 son söz → T_08 hüküm → R_KARAR (sonuca göre epilog)
T_COKUS (güvenilirlik 0) → T_08
```

## 5. Sahne sahne

> Sözcük sayıları hedeftir (± %20). Örnek satırlar tonu tarif eder.

### PR_00 — Soğuk açılış · "17.51" (~650) · bg: sokak_karanlik → buro → sokak_karanlik
- `card`: "12 ŞUBAT · 17.51 — HİSARÖNÜ BELEDİYESİ, MALİ HİZMETLER". Lodos; boş vezne salonu; sıra makinesi ekranında "SON
  NUMARA 214". Mesai bitmiş, temizlik arabası koridorun sonunda.
- Ön odada tek bir monitörün ışığı. Bir siluet; yüzü yok, yalnızca klavyenin tıkırtısı. Ekranda bir pencere: "İPTAL
  EDİLSİN Mİ?" — "Evet". Sonra bir kez daha. Yazıcı uyanır, sıcak bir kâğıt kusar.
- Bir fermuar sesi. Kasa odasının panelinde dört kısa bip. Kâğıt para hışırtısı; birinin parmakları sayıyor ama
  saymayı yarıda bırakıyor.
- `phone`, BİR SES (erkek, boğuk, arkada televizyon maçı): "Cuma'ya kadar demiştik." — İKİNCİ SES (alçak, düzgün): "Cuma'ya
  kadar. Her zamanki gibi." — BİR SES: "Her zamanki gibi geç." — İKİNCİ SES: "Bu kez değil."
- Kapıda gece bekçisi (narrator, "BEKÇİ"): "İyi akşamlar." Siluet: "İyi akşamlar." Yaka kaldırılır, siluet otoparkın karanlığına karışır (şemsiye yok; adım ve ses betimlemesi Ercan'ın tanıtımıyla yankılanmaz).
- narrator: "Ertesi sabah vezne yine açıldı. Para yine sayıldı. Kimse saymadığı parayı aramadı." `fade`.

> İsim, yüz, makam yok. "Efendim" hem Orhan'ın hem Ercan'ın tikidir; oyuncu sesi kimseye bağlayamaz.

### PR_01 — "4 MART, 09.10" (~550) · bg: buro → sokak_sabah
- Hayri Bey vezne kuyruğunda, elinde ayakkabı kutusundan çıkmış bir makbuz ve bir borç bildirimi. Melek ("Vezne 1")
  sakız patlatır: "Amca sıra numaran?" Hayri: "Numara değil kızım, numaram var: makbuz numarası."
- Orhan (Vezne 2) makbuzu alır, gözlüğünü takar: "Bu makbuz benim kestiğim makbuz efendim. 12 Şubat, 16.40." Ekrana bakar.
  "İptal." Sesi bir an kırılır: "İptal… saat 17.47."
- Ercan arkadan yaklaşır, sakin: "Hemen bakalım efendim. Bir yanlışlık vardır." Hayri'ye çay söyler.
- `card` "ÜÇ HAFTA SONRA": müfettiş, kutulara doldurulan klasörler; Orhan'ın masasındaki kalemlik. Görevden uzaklaştırma
  yazısını Ercan uzatır, nazikçe: "Usul böyle Orhan Bey. Ben de üzgünüm."
- narrator: "Kırk yedi makbuz. Üç yüz seksen altı bin dört yüz lira. Hepsi Orhan Kılıç'ın kullanıcı adıyla."
- `card` "SEKİZ AY SONRA". İddianame. Bir celse sonra, eşi bir avukat aradı.

### BR_00 — Bölüm 1 · DOSYA · "Nazan Hanım" (~900) · bg: buro_gece
- `card` "PERŞEMBE 21.20 — ARSLAN HUKUK, BURSA". Lodos camı titretir. Deniz (thought): "Bursa'da kasımda iki şey
  bitmez: yağmur ve borç."
- Nazan önden, Orhan arkada; Orhan şemsiyeyi kapatıp kapıya dayar, sonra damlasın diye bir gazete serer. Nazan elinde bir
  kumaş çanta: iddianame, bir dosya dolusu banka dökümü, Elif'in ameliyat faturası.
- Orhan rakamlarla konuşur; Nazan araya girer: "Rakam söyleme Orhan, kadın rakam sormadı." Orhan: "Kırk yedi makbuz efendim.
  Hiçbirini ben iptal etmedim."
- Deniz sorar: "Şifrenizi başka biri biliyor muydu?" Orhan bir an susar, gözlüğünü siler: "Şifre kişiye özeldir efendim."
  (Cevap değil; oyuncu fark edebilir.)
- Seçim (puan yok, ilişki etkisi): **“Bana her şeyi söyleyeceksiniz, utandıklarınızı da.”** (güven +6, `orhan_soz`) ·
  **“Önce dosyayı okuyayım, sonra konuşuruz.”** (nötr) · **“Masumsanız korkacak bir şey yok.”** (güven −4; Nazan:
  "Masumlar da hapse giriyor avukat hanım.")
- Nazan çıkarken: "Evi satarım. Öderiz, biter. Duydum ki ödeyene ceza az veriyorlarmış." Orhan sert: "Nazan."
- Leyla kapıda; ikisi gidince: "Ödemekle bitmez. Ödemek bir şeyi kabul etmektir. Sen o kapıyı açmadan önce, kapının
  arkasında ne olduğunu bil."

### BR_01 — Leyla dosyayı devreder (~550) · bg: buro_gece
- Leyla iddianameyi bırakır: "Zimmet. Hileli. Zincirleme. Neyle karşı karşıyayız?"
- A–D (etiketler kısa ve dengeli): "247/1-2 + 43: 7,5–18 yıl, üstüne dörtte bir–dörtte üç" (doğru) · "247/1: 5–12 yıl" ·
  "155/2: 1–7 yıl" · "257/1: 6 ay–2 yıl".
- Doğruda Leyla: "Hileli davranış cezayı yarı oranında artırır. Kırk yedi iptal ayrı ayrı sayılırsa üstüne zincirleme
  gelir. Yani müvekkilin dokuz yılın üstünden başlıyor." Paketi çevirir.
- Yanlışta kısa ve sert ders. İma (thought): Leyla'nın "kabul et" dediği bir eski müvekkil; Leyla anlatmaz.

### BR_01B — "Altı klasör" (~350)
- Dosyanın içinden sayılar: teftiş raporu, iptal dökümü (yalnızca kullanıcı adı ve tutar sütunlarıyla özetlenmiş),
  teslim tutanakları, banka dökümü, Ercan'ın tanık ifadesi, Melek'in "bir şey bilmiyorum" ifadesi.
- thought: "Savcılığın elinde bir isim var. Benim elimde bir adam. Arada kırk yedi satır."

### BR_02 — Dosya ekranı + strateji (~250)
Leyla tek cümleyle karşılar: Masumiyet → "Kayıtlar bir isim yazar. Sen bir el bulmak zorundasın." · Usul → "Teftiş
raporu bilirkişi raporu değildir; bunu unutan çok olur." · Terditli → "Güvenli. Ama müvekkiline 'en azından ihmal'
diyeceksin. Dayanabilir mi?"

### INV_SABAH — Belediye önü (~250) · bg: sokak_sabah
Islak bayraklar, simitçi, belediyenin cam kapısında "VEZNE 08.30–17.00". thought: "On dokuz yıl her sabah bu kapıdan
girmiş. Şimdi karşı kaldırımdan bakıyorum."

### Bölüm 2 · SORUŞTURMA (INV_*), ~5.500

**INV_HUB:** gün kartı + hedef; hedef, bulgulara göre değişir:
- gün 1: "Hedef: Kırk yedi iptalin saati, yeri ve sahibi. Orhan o saatlerde neredeydi?"
- gün 2 (iptal kaydı ya da PDKS okunduysa): "Hedef: kâğıtlar. Teslim tutanakları, banka ve tapu. Para ne zaman, kimin
  elinden çıktı?"
- gün 3: "Hedef: dilekçe son gün. Duruşmada neyi istiyorsun, kimi soracaksın?"

**INV_VEZNE — Vezne salonu (sahne, ~350):** sıra makinesi, vezne camları, Vezne 2'nin terminali (VZ-02 etiketi), Melek'in
monitöründeki sarı not kâğıdı ("M. y. 1989" — çeldirici), panodaki **Bilgi Güvenliği Yönergesi** ("Şifreler hiçbir
koşulda paylaşılmaz, yazılmaz, zarfa konmaz"), tavandaki kamera (sıraya bakıyor, ekranlara değil), turnike (PDKS), ön
odanın buzlu camlı kapısı ve içerideki ikinci monitör (etiket okunmaz), kasa odası kapısındaki tuş takımı.
Iska satırları kısa iç ses: "Sıra fişi. 214. Biri bekledi, biri saydı, biri unuttu."

**INV_EV_G / INV_EV — Kılıçların evi (~900):** dördüncü kat, merdiven. Nazan dikiş makinesinin başında; Elif'in
çizimleri duvarda. Orhan'ın çalışma masası (sahne): **defter** (her günün toplamı, kurşun kalemle, 19 yıllık 23 cilt),
**karbon kopyalar** (sarı, "teslim alan" kısmı boş), **PDKS dökümü** (insan kaynaklarından aldığı), **el yazısı talimat**
("Şifreler zarfta, müdürlükte kalacak. — Müdürlük"; imzasız; Orhan bunu bir klasörün arasına sıkıştırmış, unutmuş), tapu satış
belgesi, satranç tahtası (çeldirici), Elif'in hastane randevu kartı (9 Ocak).
- Talimatı bulmak Orhan'ı utandırır: "Herkes verdi efendim. Ben de verdim. Yönergeyi biliyordum." Bu satır yalnızca not
  bulunduysa gelir (`fact_zarf`).

**INV_GORUSME — Büro, Orhan'la görüşme (~1.400):** Orhan büroya gelir (tutuklu değil); konuşma her ziyarette kapanan
büronun saati gibi "Leyla'nın randevusuna 14 dakika" ile sınırlıdır.
Konular: *O akşamlar* (17.00'de kasa sayımı, teslim, çıkış), *Kredi* (Elif'in ameliyatı, tarlanın satışı), *Ercan Bey*
(amir; "iyi adamdır efendim, babası da maliyeciydi"), *Melek* (komşu vezne), açılan konular: *Şifre* (yönerge ya da
talimat bulunduysa: zarf itirafı), *9 Ocak* (PDKS'deki izin satırı okunduysa: "O gün hastanedeydim"), *Teslim alan*
(karbon kopya bulunduysa: "Ercan Bey 'sonra imzalarım' derdi"), *14 Ocak sabahı* (zarf itirafından sonra: "Şifrem
çalışmadı, Burak sıfırladı").
Sert ton daha çok bilgi verir ama güveni düşürür; sert tonla gelen ayrıntılar (`fact_imza_bos`, `fact_borc_baski`)
duruşmadan önceki gecede okunur.

**INV_T_HAYRI — Hayri Bey'in salonu (~450):** kitap kuleleri, Osmanlı haritası, ayakkabı kutuları. "Ben bu adamı
suçlamak için gelmedim, hesabımı sormaya geldim." Sorular: *ödeme saati* (16.40; makbuz), *veznedar* ("İki kez saydı.
Bu devirde iki kez sayan adam az."), *ertesi gün* ("Müdür yardımcısı bey çok kibardı; çay söyledi, dosyamı kendisi
aldı."). Yanlış soru: "Orhan Bey sizce suçlu mu?" → kanaat sorusu; Hayri ders verir.

**INV_T_MELEK — Belediye çay ocağı (~450):** Melek sakız, telefon; Deniz'in her sorusuna soru ile cevap. Zarf sorusuna:
"Ne zarfı canım? Biz düğün mü yapıyoruz?" Ayrılırken yeni beyaz arabasının alarmını kapatır (çeldirici; `fact_araba`).
Baskı seçeneği: "Doğruyu söylemezsen sen de içeri girersin" → TCK 277 sınırı; geri bildirim ve Leyla'nın akşam soğukluğu.

**INV_T_ERCAN — Müdür yardımcısının odası (~500):** ince belli bardak, dolma kalem, babasının fotoğrafı. Kusursuz kibar:
"Ne lazımsa efendim. Orhan Bey'i on dokuz yıldır tanırım." Sorular: *sistem* ("Vezne programına yalnızca vezneden girilir
efendim"; yanlış ama kendinden emin), *teslim* ("Teslim tutanakları dosyada"), *zarf* ("Öyle bir uygulama bizde olmaz,
yönerge ortada"), *Melek* (kendisi açar: "Melek Hanım yeni araba aldı, söylemek istemezdim"). Ziyaret, ara evresinde
"teklif" sahnesinin tonunu değiştirir (`ercan_ziyaret`).

**INV_LOG — İptal kayıtları (belge):** sütunlar TARİH · SAAT · KULLANICI · TERMİNAL · TUTAR · AÇIKLAMA. Büyüteç
TERMİNAL sütununda: hep **MHM-PC03**, hiç VZ-02 değil (`clue_terminal`). Saat sütununda: hep 17.38–17.56
(`clue_saat`). 9 Ocak satırı (izinli gün). Açıklama sütununda "mükerrer tahsilat" (çeldirici: hileli davranış
iddiası).

**INV_PDKS — Giriş-çıkış (belge):** Orhan'ın çıkışları 17.02–17.09 (`clue_cikis`); 9 Ocak "YILLIK İZİN" (`clue_izin`).

**INV_TUTANAK — Teslim tutanakları (belge; karbon kopya bulunduysa):** dosyadaki tutanak ile karbon kopya yan yana. Tutar
farkı (`clue_tutar_fark`), basım saati 17.56 (`clue_basim`), büyüteçte imza: ıslak değil, toner (`clue_imza_kopya`).

**INV_BANKA — Kredi ve tapu (belge):** kredinin kapanış tarihi ve tutarı (`clue_kredi`), tapu satışı aynı hafta, aynı
tutar (`clue_tapu`).

**INV_DIL — Delil dilekçesi (CMK 177):** 3 talep: bilişim bilirkişisi (log, terminal, kimlik doğrulama), müdürlük
PDKS kayıtları, kasa alarm kayıtları, bilgi işlem destek talepleri, Melek'in banka hesapları (reddedilir: ilgisiz,
özel hayat), vezne kamera kayıtları (30 gün sonra üzerine yazılmış). İsabetli talepler ara evresinde teslim edilir.

**INV_CIKARIM — Çıkarım tahtası:** tarifler (§7) ve çeldiriciler (sarı not, kamera, araba, satranç).

**INV_AKSAM1 (~350):** Leyla ile pencere önü; "Bugün kayıtlar sana ne söyledi?" seçimi iç sese yansır.
**INV_AKSAM2 (~350):** gizli numara (`phone`, BİR SES, Ercan'ın sesi değil, hiç tanınmayan bir ses): "Avukat hanım,
kasalar boş kalınca rüzgâr eser." Yalnızca Ercan ya da Melek ziyaret edildiyse; aksi hâlde Nazan arar, Elif'in "babam
uyumuyor" mesajını okur.
**INV_GECE (~400):** pano, koşullu hafıza zinciri; kapının altından bir zarf: içinde boş bir kâğıt (`fx: flash`).
Seçim: savcılığa bildir / sakla (ara evresinde tutanakta okunur).

### Bölüm 3 · BİRİNCİ CELSE (H1_*), ~2.700 · bg: durusma_salonu
- **H1_K koridor:** Nazan ütülü gömleği Orhan'ın yakasına düzeltir. Ercan gelir, Orhan'ın elini iki eliyle sıkar: "Geçmiş
  olsun Orhan Bey. Elimden ne gelirse." Melek gözlerini kaçırır. Hayri Bey dinleyici sırasında, ayakkabı kutusuyla.
- **H1_00 açılış:** Mübaşir: "Orhan Kılıç dosyası!" Kimlik, iddianame özeti, haklar.
- **H1_01 sanığın savunması (A–D):** Deniz Orhan'a ne tavsiye eder? "Zarfı da anlat, utandığını da." (doğru: sonraki
  bütün çelişkilerin temeli; heyet ikna) · "Zarf konusunu hiç açma." (ikinci celsede Melek anlatınca güvenilirlik düşer) ·
  "Susma hakkını kullansın." (meşru, zayıf) · "Ercan Bey'i suçlasın." (dayanaksız; heyet soğur). Orhan'ın konuşması
  seçilen yola göre 4–6 satır.
- **H1_02 teftiş raporu (itiraz):** Savcı teftiş raporunu "uzman görüşü" olarak okur. Doğru: rapor idari incelemedir,
  bilirkişi raporu değildir; log, terminal ve kimlik doğrulama için bilişim bilirkişisi istenmelidir.
- **H1_03 Tanık Ercan:** yemin; savcının telkinli sorusu ("Sanık şifresini kimseyle paylaşmazdı, değil mi?") → itiraz.
- **H1_04 Ercan'ın ifadesi (E1–E5):**
  - E1 "On dokuz yıllık arkadaşımdır; kasayı her akşam o kapatırdı." (bastır → "kapatmak" ne demek: sayım ve teslim)
  - E2 "Saat altıya kadar çıkmazdı, titizdi." → PDKS çıkışları (`clue_cikis` ya da `ded_baskasi`) çelişki.
  - E3 "Şifreler kişiye özeldir; zarf, emanet, öyle bir uygulama bizde yok." → el yazısı talimat (`ev_talimat`) çelişki.
  - E4 "Bütün iptaller onun vezne bilgisayarından yapılmış." → terminal (`clue_terminal` → `ded_baskasi`) çelişki.
  - E5 "Son aylarda borç sıkıntısı vardı, krediyi bir anda kapattı. Bunu söylemek istemezdim." → `ded_kredi` çelişki;
    itiraz: kişisel kanaat (`g_kanaat`).
  - Doğru sunumlarda Ercan sarsılmaz; kibarca "yanlış hatırlamışım efendim" der. Çöküş yok. (Gizem: amirin yalanı disiplin
    korkusundan da olabilir.)
- **H1_05 duruşma içi talepler:** dilekçede istenmediyse son şans (CMK 206'ya bağlı yerinde/yersiz talepler).
- **H1_ARA ara karar:** bilişim bilirkişisi, celpler, bir ay erteleme. Adli kontrolün sürmesi. Ercan'ın salondan çıkarken
  Deniz'e bakıp hafifçe başını eğmesi (kibar; anlamı belirsiz).

### Bölüm 4 · ARA (ARA_*), ~4.200
**ARA_HUB:** "Bir ay. Bilirkişi çalışıyor, kâğıtlar geliyor. Melek iki kez aradı, mesaj bırakmadı."
- **ARA_MELEK — kafe, gece (~600):** Melek ilk kez sakızsız. "Ben de verdim. Zarfı. Hepimiz verdik." Korku: "O adam benim
  fazla mesaimi imzalıyor, beni arşive sürer." Seçim: "Bunu mahkemede söylemelisin; istersen bir avukatla konuş."
  (etik doğru, `melek_hazir`) · "Söylediklerini yazayım, imzala." (sınır: ifade almak avukatın işi değil; küçük ceza) ·
  "Söylemezsen ikimiz de yanarız." (baskı, TCK 277; Melek kaçar). Arabanın kredi belgesi: çeldirici kapanır (`fact_araba_kredi`).
- **ARA_BURAK — kafe (~500):** enerji içeceği; "Teknik olarak… vezne kullanıcısı her müdürlük bilgisayarından girebiliyor.
  Biliyordum. Kimse sormadı." 14 Ocak: "Ercan Bey aradı, 'Orhan Bey kilitlendi' dedi. Kimlik sormadım." Yedekler: "Log
  sunucusunun yedeği bende, yani kurumda, şeyde, ayrı diskte." Seçim: mahkemeye muhafaza talebi (doğru) / yedeği bana getir
  (delile müdahale; etik ceza) / boş ver.
- **ARA_EV — Kılıçların evi (~600):** Nazan emlakçıyla konuşmuş; ev satılırsa açık kapanır. TCK 248 sahnesi. Seçimler:
  **“Bu yolu açık açık anlatayım; karar sizin. Ama ödeme, suçu üstlenmek anlamına gelebilir.”** (doğru; Orhan: "Ben
  ödemem efendim. Ödersem yaptım derim.") · **“Ödeyin ve kabul edin; risk almayalım.”** (etik ihlal: masum müvekkile
  sahte ikrar yolu; `false_confession` yolu açılır) · **“Bu konuyu hiç konuşmayalım.”** (bilgilendirme yükümlülüğü;
  küçük ceza).
- **ARA_HAYRI (~300):** Hayri, 12 Şubat'ı yeniden anlatır; ertesi gün Ercan'ın kendi dosyasını "aldığını" söyler; yeni bir
  satır: "O akşam hırkamı unutmuştum, altıya doğru kapıdan seslendim. Bekçi bırakmadı. İçeride ön odanın ışığı yanıyordu."
  (ışık; kim olduğu belirsiz).
- **ARA_SUC — suç duyurusu (~200):** somut dayanakla (talimat, terminal, PDKS) "müdürlükte şifre zarflarını toplayan
  ve ön oda bilgisayarını kullanan kişiler" hakkında → savcılık arama yapar; zarflar ertesi gün emanete girer
  (`suc_duyurusu`). Dayanaksız "Melek yaptı" → iftira riski (TCK 267).
- **ARA_KASA / ARA_PDKS2 / ARA_TICKET / ARA_ZARF (belgeler):** kasa paneli kodu 02 (17.52–17.58), müdürlük PDKS (Ercan
  18.15–18.40; Melek 17.10; Burak ana binada), destek talepleri (14 Ocak 17.20 talep eden: E. TUNALI; 15 Ocak 08.35 talep
  eden: O. KILIÇ), zarflar (UV: okilic zarfının kapağında iki ayrı yapıştırıcı çizgisi; mühür imzası kaymış).
- **ARA_KESIF — ön oda (sahne, bilirkişiyle):** MHM-PC03 etiketi, oturum açık bırakılmış ekran koruyucu, kasa odası
  tuş takımında aşınmış 0 ve 2 tuşları, takvimde işaretli cumalar, yazıcı sayaç sayfası, Ercan'ın kilitli çekmecesi
  (açılmaz: etik), çöp kutusunda bir bahis kuponu parçası? — hayır: yalnızca boş bir zarf yırtığı (kanıt değil, bilirkişiye
  tutanak).
- **ARA_OTOPARK — Ercan'ın teklifi (ilk akşam, ~500):** belediye otoparkı, yağmur, Ercan şemsiyesini Deniz'e uzatır. "Efendim,
  bu iş uzarsa Orhan Bey yıpranır. Öderse, ben de ifademde 'ihmal olabilir' derim, müfettiş arkadaşla konuşurum." Seçimler:
  savcılığa bildir (doğru; `teklif_bildirildi`) · müvekkile ilet (etik ihlal: tanıkla pazarlık) · reddet ve git (nötr).
- **ARA_AKSAM2 (~300):** Orhan arar: "Elif sordu, babam hırsız mı diye. Ne diyeyim efendim?"
- **ARA_SON (~350):** duruşma sabahı; koşullu hafıza zinciri; Leyla: "Kürsüde susan adam da konuşur. Sen sesini değil,
  sessizliğini dinle."

### Bölüm 5 · İKİNCİ CELSE (T_*), ~3.200 · bg: durusma_salonu
- **T_00 açılış:** ara karar cevapları okunur (bilirkişi raporu, celpler; istenmeyenler "dosyada yok").
- **T_01 bilirkişi Dr. Seda Karaca:** sistemin açığı (her bilgisayardan giriş, 10.000 altı iptalde ikinci onay yok), log
  terminal kimliği; savcı "bilirkişi hukuki değerlendirme yapıyor" der; Deniz'in soru seçimi (CMK 67/3 sınırı: teknik soru
  doğru, "Sanık suçsuz mu?" yanlış).
- **T_02 Melek (M1–M4):** M2 "Zarf diye bir şey hatırlamıyorum" → talimat / zarflar (`ev_zarflar`) çelişki; Melek kırılır:
  "Verdim. Hepimiz verdik. Ercan Bey topladı." M3 "Orhan abi bazen geç kalırdı" → PDKS çelişki. M4 "Ben o bilgisayara hiç
  oturmadım" → müdürlük PDKS (`clue_melek_cikis`) teyit eder (doğru ama çelişki değil; sunum kısmi).
- **T_03 Ercan (suç duyurusu yapıldıysa yeminsiz; CMK 48 hatırlatması):** R1 "Mesai bitince çıkardım, altıyı geçmezdi" →
  müdürlük PDKS (`clue_ercan_cikis`); R2 "Kasa odasına akşam girmem, şifresini müdür bilir" → kasa alarm kaydı (`clue_kod02`
  / `ded_kasa`); R3 "Kimsenin şifresini istemedim, sıfırlatmadım" → destek talebi (`clue_ticket`) ve zarf UV (`ded_sifre`);
  R4 "Ben yalnızca usulü uyguladım efendim." Doğru sunumların ardından Ercan dolma kalemini masaya koyar: "Cevap vermekten
  çekiniyorum." Salon susar (`ercan_sustu`). Suç duyurusu yoksa Ercan yeminli tanıktır ve R2–R3 sunulsa da "bilmiyorum" der;
  çöküş olmaz.
- **T_04 nitelendirme uyarısı:** zarf gerçeği ortaya çıktıysa başkan, eylemin TCK 257/2 kapsamında değerlendirilebileceğini
  bildirir (CMK 226). Deniz: ek savunma süresi ister ya da hazır olduğunu söyler; ikisi de meşru, gerekçesi farklı.
- **T_05 mütalaa:** savcı, ercan_sustu + kasa + destek varsa beraat ve suç duyurusu; yalnızca şüphe varsa "kuşkulu ama
  mahkûmiyet"; hiçbiri yoksa ağır mütalaa. Cevap hakkı.
- **T_06 esas savunma:** Deniz'in 4–5 satırlık konuşması seçilen yola göre okunur.
- **T_07 son söz:** Orhan: "Kırk yedi makbuz efendim. Hiçbirini ben iptal etmedim. Ama şifremi verdim. Onun hesabını
  veririm."
- **T_08 → R_KARAR → epilog.**

### Epiloglar (OutcomeDef.epilogue; her biri ~250–400)
- **BERAAT_B:** "Türk Milleti adına…" Orhan gözlüğünü çıkarır, siler, yeniden takar. Adliye merdivenleri, yağmur dinmiş.
  Nazan onu kolundan çeker: "Rakam söyle bakalım." Orhan: "Sıfır." Hayri Bey ayakkabı kutusunu Deniz'e uzatır: "Bunu
  saklayın. Tarih, makbuzu saklayanlarındır." Büroda Leyla: "Bugün bir adam şifresini verdiğini söyledi ve kurtuldu. Bunu
  unutma." Son kart: "Ercan Tunalı hakkında zimmet ve resmî belgede sahtecilik soruşturması başlatıldı."
- **BERAAT_E:** Beraat, ama belediye koridorunda fısıltı: "Şüpheden yararlandı." Orhan göreve iade dilekçesini yazar,
  kuruşuna kadar. thought: "Kayıtlar bir adı sildi. Elini hâlâ göstermediler."
- **NITELENDIRME:** 5 ay, ertelendi. Orhan: "Hesabını vereceğim dediğim buydu efendim. Az değil, doğru." thought: "Zimmet
  değil, ihmal. Bir zarfın bedeli."
- **MAHKUMIYET:** Ring aracı değil; Orhan adli kontrolle dışarıda, istinafı bekler. Nazan emlakçıyı arar. thought: "Kırk yedi
  satır. Birini bile çeviremedim." Çöküşte savcının cümlesi: "Rakamlarla kazanılmaz avukat hanım. Ama rakamsız da kazanılmaz."
- **IKRAR (etik):** Orhan mahkemede "ben yaptım" der, ev satılır; ceza indirilir. Leyla Deniz'in masasına meslek kuralları
  kitapçığını bırakır. Orhan'ın defterinin son sayfası: "Bugün ilk kez yanlış saydım."

## 6. Ters köşeler ve ekilen ipuçları
1. **Şifre bir kişi değildir** (1. evre sonu, tahta): ekilen ipuçları — prolog (efendim diyen siluet, PC'nin ön odada
   olması), Orhan'ın kaçamak cevabı (BR_00), panodaki yönerge, evdeki talimat, iptal kaydındaki terminal sütunu.
2. **Para kasadayken kimin elindeydi?** (ara, belge): ekilen — Orhan'ın "teslim alan sonra imzalardı" cümlesi, karbon kopyalar,
   prologdaki kasa paneli bipleri, Hayri'nin "dosyamı kendisi aldı" satırı.
3. **Yardımsever amir** (2. celse): ekilen — Ercan'ın her ziyarette şüpheyi başkalarına kaydırması (kredi, Melek'in arabası),
   "yönerge ortada" diyen adamın el yazısı talimatı, 14 Ocak'taki iki sıfırlama, Ercan'ın otoparktaki teklifi.

## 7. Çıkarım tahtası (tarifler)
| Tarif | Kartlar | Çıkarım | Evre |
|---|---|---|---|
| CB_BASKASI | clue_terminal + clue_cikis | ded_baskasi — iptaller Orhan binadan çıktıktan sonra, başka bir bilgisayardan | 1 |
| CB_IZIN | clue_saat + clue_izin | ded_izin — izinli gününde bile iptal var | 1 |
| CB_ZARF | clue_yonerge + clue_talimat | ded_zarf — şifre kişiye özel değildi; zarflar müdürlükte | 1 |
| CB_KASA_ONCESI | clue_defter + clue_tutar_fark | ded_teslim — para Orhan'ın elinden tam çıktı; eksilme teslimden sonra | 1 |
| CB_TUTANAK | clue_imza_kopya + clue_basim | ded_sahte_tutanak — tutanak sonradan, fotokopi imzayla değiştirildi | 1 |
| CB_KREDI | clue_kredi + clue_tapu | ded_kredi — kredi tarla parasıyla kapandı | 1 |
| CB_KASA | clue_kod02 + clue_ercan_cikis | ded_kasa — kasa her iptal akşamı aynı kodla açıldı; o kod sahibi binadaydı | ara |
| CB_SIFRE | clue_ticket + clue_zarf_uv | ded_sifre — yeni şifreyi öğrenen ve zarfı açan aynı kişi | ara |
Çeldiriciler: clue_postit (Melek'in notu), clue_kamera, clue_araba, clue_satranc; yanlış çift −50.

## 8. Kelime bütçesi (tipik yol, `case:duration`)
Soğuk açılış ~1.200 · Bölüm 1 ~1.900 · Soruşturma ~5.000 · 1. celse ~2.300 · Ara ~2.800 · 2. celse ~2.200 · karar ve epilog
~600 → ~15.000 sözcük, ~210 aksiyon ≈ 104 dk.

## 9. Uygulama notları (kaynakla farklar)

- **Ara evresi** 2 gün × 4 EP olarak uygulandı (yığınsız); suç duyurusu 0 EP’lik bir “karar”dır, zarflar gün sonunda emanete girer.
  Ercan’ın teklifi (ARA_OTOPARK) tek gün sonunda gelir; Orhan’ın “Elif sordu” telefonu duruşmadan önceki gecenin zincirindedir (ARA_SON_5).
- **1. celsede sanığa tavsiye** seçeneklerinden “Ercan Bey’i suçlasın” çıkarıldı; yerine dayanaksız bir “Melek’in arabası” seçeneği kondu.
  Böylece gerçek failin adı, oyuncu kanıtla kazanmadan bir seçenek etiketinde geçmez.
- **Burak** 14 Ocak akşamı arayanın adını söylemez (“kibar biriydi, efendim dedi”); adı ancak destek talebi kaydı elde edildiyse kayıttan okur.
- **Melek** zarfı toplayanın adını kafede söylemez; adı yalnızca ikinci celsede, sorulunca (ya da belgeyle karşılaşınca) söyler.
- **Ercan, 1. celse E3:** el yazısı not gösterilince yazının kendisine ait olmadığını söyler; üye hâkim talimatı kimin verebileceğini sorunca “müdür ya da müdür yardımcısı; müdürümüz eylülde görevdeydi” der. İki aday kalır; gizem açık.
- **Teslim alan:** Orhan (TP_TESLIM) ve Ercan (EQ_TESLIM) torbaları “kim müsaitse” onun aldığını söyler (Rıfat, Selim, Ercan). Ara evresindeki kasa kodu (02) ve müdürlük turnikesi (Selim 17.20’den önce, Rıfat ocak–şubat raporlu) ayırt eder.
- **Saik (ara):** Burak, güvenlik duvarının müdür yardımcılığı bilgisayarından her cuma bahis sitelerine takılan girişleri kaydettiğini söyler (BK_BAHIS); keşifteki takvimde halkalı cumalar vardır. İkisi ded_borc’u kurar; 2. celsede R5 (“borç Orhan Bey’in derdiydi”) bununla çürütülür. Soğuk açılıştaki “Cuma’ya kadar” sesi ve gizli numara beraat epiloglarında bu tahsilat hattına bağlanır.
- **Keşif:** yalnızca 1. celsede bilirkişiyle birlikte keşif istenirse (H105_KESIF) ara kararla yapılır.
- **Sonuç sınıfı “Nitelendirme”** (TCK 257/2; CMK 226 uyarısıyla) hikâye kitabındaki NITELENDIRME epilogunu kullanır; IKRAR etik sonudur.
- Ölçümler ve golden path’ler: `docs/content/belediye-kasasi.md` §8–9.
