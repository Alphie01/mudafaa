# Dava #12 — Zarf · Hikâye Kitabı (noir)

> Bu belge davanın **anlatı kaynağıdır**: ton, kadro, gerçek ve kronoloji, yapı, sahne sahne vuruşlar ve sonuç başına
> epiloglar. Deliller, çelişkiler, sonuç koşulları ve puanlar `docs/content/zarf.md`'de; hukuki çerçeve
> `docs/legal/zarf.md`'dedir. Çıta Dava #07 v2'dir (`docs/content/gece-bekcisinin-sirri-hikaye.md`).
> Kaynak: `content/src/zarf/` (yazım kiti + satır DSL'i `dsl.ts`).

## 0. Ton ve kurallar

- **Noir dram, bürokrasinin içinde.** Bursa, nisan sonu–mayıs; yağmur kısa ve sert yağıp kesiliyor. Tapu müdürlüğünün
  florasanlı koridorları, sıra fişi makinesinin "dıt" sesi, mühür mürekkebi, nemli dosya kartonu, çay ocağında demlik
  buharı, cezaevi görüş odasının kaynamış kahve kokusu. Her sahnede bir duyusal ayrıntı.
- **İç ses.** Deniz `style: "thought"` ile birinci tekil, kısa ve kuru konuşur. Gözlemler, sezer, **çözümü söylemez.**
  Örnek: *"Bu binada her şey mühürlenir. Mühürlenmeyen tek şey, kimin hangi kapıdan girdiğidir."*
- **Hukuk konuşmada değil, sonuçta.** Madde numaraları yalnızca Leyla'nın kısa açıklamalarında, seçenek geri bildiriminde,
  rapor ipuçlarında, hüküm metninde ve resmî duruşma dilinde geçer. Halil "yönetmelik" der ama numara saymaz.
- **Gizem korunur.** Zarfı çekmeceye bırakan, Devir Servisi-2 memuru **Sinan Kaplan**'dır. Bu, oyuncu ara evresinde
  *tek kişi* çıkarımını (santral + izin çizelgesi + sahte çağrı) ve kamera karesini kurmadan **hiçbir satırda söylenmez.**
  Önceden yalnızca zararsız görünen ayrıntılar ekilir: nane şekeri (Sinan herkese ikram eder; soğuk açılışta koridorda
  tatlı, keskin bir koku), akıllı saat (konuşurken adımlarını sayar; kamera karesinde bilekte yeşil bir ışık), "arşivdeydim,
  1987 ciltleriyle boğuşuyordum" cümlesi (defterin saklandığı yer), dahili 214'ün iki kişilik oda olduğu (kırmızı ringa: Gülay
  Erdem).
- **Soğuk açılışta** sesler isimsizdir: `speaker: "narrator"` + `name: "KULAKLIK"`, `"BİR SES"`, `"FISILTI"`. Müvekkil
  görünür (kimliği gizem değildir), çekmeceye uzanan el görünmez.
- **Satır kuralları:** satır ≤ 220 karakter; yeni mekân `style: "card"` + `bg`; sert anlarda `fx: shake / flash / fade`.
- **Etik çizgi:** tanığa baskı yok, telkin yok; şüpheli kovalanmaz, savcılığa bildirilir; müvekkile yalan tavsiye edilmez;
  gizli soruşturma kayıtları "tanıdık polis" yoluyla alınmaz. Bu çizgiyi aşan seçimler oyunda vardır ve bedeli ağırdır.
- **Sözcük bütçesi:** tipik yol (BERAAT_E) `case:duration` ölçüsüyle ~14–16 bin sözcük; ≥ 200 aksiyon; 90–120 dk.

## 1. Logline ve tema

- **Logline:** Yirmi yedi yıllık, "kural adamı" bir tapu kontrol memuru, çekmecesinden işaretli paralarla dolu bir zarf
  çıkınca rüşvet almaktan tutuklanıyor. Savcının elinde bir dinleme kaydı, bir muhbir ve bir zarf var. Deniz, kaydın hangi
  kapının anahtar deliğinden alındığını, zarfın o çekmeceye kimin elinden girdiğini ve müvekkilinin yirmi yedi yılda bir kez
  çiğnediği kuralın bedelini bulmak zorunda.
- **Tema:** *Kural, onu bozmak isteyenler için en kolay tuzaktır.* Halil'i kurallara bağlılığı hedef yaptı; bir kez esneyişi
  tuzağın kapısını açtı. Dramatik soru: "Delil, nasıl elde edildiğinden bağımsız mıdır?" — ve onun ikizi: "Bir iyilik,
  ne zaman görevi kötüye kullanmaya döner?"
- **Ana mekânlar:** Arslan Hukuk (büro, gece), Bursa H Tipi Cezaevi görüş odası, Nilüfer Tapu Müdürlüğü (2. kat koridoru,
  kontrol odası, arşiv, çay ocağı), Şehir Hastanesi acil servisi, Emniyet Mali Suçlarla Mücadele Şube, Bursa 5. Ağır Ceza
  Mahkemesi.

## 2. Kadro: sesler, sırlar, yaylar

| Kimlik | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **deniz** (oyuncu) | Av. Deniz Arslan; artık kıdemli avukat. | Kuru iç ses; dışarıda nazik ama inatçı. | Bir yıl önce bir dosyada "bu kayıt nasıl olsa okunur" diye itiraz etmemiş, sonra kaydın kararsız alındığını öğrenmişti. | Delile kolay inanmaktan, delilin nereden geldiğini sormaya. |
| **leyla** (mentor) | Av. Leyla Erdem, 58. | Az ve kesin; dinleme kayıtlarını "anahtar deliği" diye anar. | Masasındaki ters çerçeve (dizi tohumu; yalnızca ima). | İzler, kurtarmaz; etikte sert. |
| **halil** (müvekkil, tutuklu) | Halil Ekinci, 54; Nilüfer Tapu Müdürlüğü kontrol memuru, 27 yıl. Dul. | Resmî, eksiksiz cümleler; "efendim", "usulen", "kayda geçsin". Her şeyi dik açıya hizalar; gözlüğünü başının üstünde unutur. "Kanıtım olmadan isim söylemem." | (1) Bir şirketin 11 dosyasını durdurdu; içeriden birinin dosya hızlandırdığını bir **kırmızı deftere** yazdı ve defteri arşivde 1987 ciltlerinin arkasına sakladı. (2) **Yirmi yedi yılda bir kez kuralı esnetti:** babası yoğun bakımda diye Bayram'ın dosyasına sıra dışı randevu onayı verdi; utanır. | Gurur → bir kez esnediğini kürsüde kabul etmek → onur. |
| **zehra** (kızı) | Zehra Ekinci, 27; Şehir Hastanesi acil hemşiresi. | Hızlı, yorgun, nöbet mizahı ("triyajda ilk sen varsın"); kısa cümleler; babasına "Hâkim Bey" diye takılır. | Babasına şubatta gelen imzasız notu saklamış: "Her dosyayı durduran, bir gün kendisi durur." Kurumdan biri eve gelip "abinin evrakları" diye sormuş. | Öfke → güven; epilogda babasının gözlüğünü ona geri takar. |
| **sinan** (gerçek fail) | Sinan Kaplan, 38; Devir Servisi-2 memuru. Müdür yardımcılığı sınavını geçmiş, atama bekliyor. | Sıcak, pürüzsüz, "abiciğim", "estağfurullah". Cebinden nane şekeri ikram eder; konuşurken akıllı saatine bakar ("adım sayıyorum, doktor yürü dedi"). | Ateşoğlu İnşaat'ın dosyalarını parayla hızlandırıyor; Halil'in kontrolü işini ve atamasını tehdit ediyor. Bayram'ı kullandı, sahte çağrıyı dahili 214'ten yaptı, zarfı 10.41'de çekmeceye bıraktı. Defteri aradı ama bulamadı. | Yardımsever meslektaş → kürsüde alibisinin çöküşü (BERAAT_B). |
| **bayram** (muhbir/tanık) | Bayram Öz, 47; tapu takipçisi. | Geveze, "abicim", çocuklarının üstüne yemin eder; iki hikâyesi var, ikisini de inanarak anlatır. | Ateşoğlu'na borçlu. Sinan'ın yönlendirmesiyle polise "memur zorla para istedi" diye gitti; zarfı Halil'e değil, koridorda "Halil Bey'e ileteceğini" söyleyen Sinan'a verdi; kayıt cihazını kendi kapattı. Babası 20 Mart'ta öldü; sıra dışı randevu hikâyesi yarı doğruydu. | Yalan → çelişki → kürsüde çözülme (zarfı kime verdiğini söyler). |
| **komiser** | Kom. Levent Arı, 46; Emniyet Mali Suçlarla Mücadele. | Kendinden emin, operasyon jargonu ("kontrollü teslimat", "seri numaraları eşleşti"). Dürüst ama gayretli. | Dinlemedeki 11 Mart kaydının süre dışı olduğunu bilmiyordu (ya da sormadı); parayı Emniyet verdi; muhbirin kaydı "arızalandı" dediğine inandı. | Kürsüde eksiklerini kabul eden bir profesyonel. |
| **ferda** | Tapu Müdürü Ferda Yalçın, 57. | Temkinli, kurum diliyle ("kurumumuz", "prosedür gereği"); skandaldan korkar ama yalan söylemez. | O sabah il müdürlüğüyle telekonferanstaydı; kimseyi çağırmadı. | Duvardan tanığa. |
| **muzaffer** | Muzaffer Usta, 63; 2. katın çaycısı. | Çay benzetmeleriyle, ağır: "Çay demini bekler, insan da sırasını." Herkesi siparişinden tanır. | Sipariş defteri: 10.40'ta Sinan arşive çay istedi; 10.42'de götürdüğünde arşiv boştu. Birinin kontrol odasından çıktığını sırtından gördü: açık renk ceket. Korkuyor: "Ben çaycıyım, şahit değil." | Korku → kürsüye gelmek. |
| **baskan / uye** | Başkan Reşat Akın; Üye Hâkim Defne Sezer. | Başkan sabırlı ve kısa; Defne Sezer'in soruları az ve isabetli. | — | — |
| **savci** | Cumhuriyet Savcısı Kenan Yavuz, 44. | Keskin, kurallı: "Zarf çekmecede, para işaretli, kayıt ortada." | — | Doğru delil karşısında mütalaasını değiştiren bir rakip. |
| **mubasir** | Mübaşir Cavit Bey. | Davayı makam ağzıyla, iki kez çağırır. | — | — |
| **gardiyan** | İnfaz koruma memuru Sabri. | Az konuşur: "Yarım saat, avukat hanım." | Halil'e saygı duyar: "Buranın kütüphanesini o düzenledi." | — |

Kadroda olmayan ama anılan: **Cengiz Ateşoğlu** (müteahhit; dinlenen hattın sahibi, yalnızca kayıtta ses), **Gülay Erdem**
(Devir-2'nin öbür memuru; 12 Mart'ta yıllık izinde — kırmızı ringa).

## 3. Gerçek ve kronoloji

| Zaman (2027) | Olay | Kim biliyor | Oyuncu nasıl öğrenir |
|---|---|---|---|
| Ekim 2026–Şubat | Halil, Ateşoğlu İnşaat'ın 11 devir dosyasını şerh ve eksik evrak nedeniyle durdurur; kırmızı deftere işler. | Halil, Sinan | Halil görüşmesi (Kontrol), arşiv sahnesi (defter) |
| 4 Ocak | Sulh ceza hâkimliği, Ateşoğlu'nun 0532 418 77 20 hattı için rüşvet şüphesiyle **iki ay** dinleme kararı verir (4 Mart'ta biter; uzatma yok). | Kolluk | Karar belgesi (INV1_KARAR) |
| 19 Şubat 14.12 | **Kararın içinde** bir kayıt: Ateşoğlu "Kontrolcü yine imzalamadı, on bir dosya" der; kimliği belirsiz bir hat "Masasından kaldırırız" cevabını verir. | — | Karar belgesi (kayıt #6) |
| Şubat | Halil'e imzasız not: "Her dosyayı durduran, bir gün kendisi durur." | Halil, Zehra | Zehra görüşmesi |
| 3 Mart | Halil, Bayram'ın dosyasına sıra dışı randevu onayı verir (babası yoğun bakımda). Dosya Devir-2'nin; şerh var. | Halil, Bayram, Sinan | TAKBİS çıktısı (müdür), Halil'in yüzleşmesi |
| 4 Mart | Dinleme kararının süresi biter. Sonlandırma yazısı gönderilmez; sistem kaydetmeye devam eder. | — | Karar belgesi; ara evresinde gelen sonlandırma yazısı |
| 8 Mart 19.20 | Halil'in kendi hattı (0505 311 46 08) — **hiçbir kararda yok** — kaydedilir: "Dosyana bakarım Bayram, ama şerh kalkmadan imza yok." İddianame cümlenin ilk yarısını alıntılar. | — | Karar belgesi (kayıt #9), Halil görüşmesi |
| 11 Mart 21.05 | **Süre dışı** kayıt: Ateşoğlu ↔ belirsiz hat: "Kontrolcüyü hallettik. Zarf yarın masada." | — | Karar belgesi (kayıt #14) |
| 11 Mart 22.30 | Bayram Mali Şube'ye gider: "Kontrol memuru dosyamı bekletiyor, kırk bin istedi" (irtikap anlatısı). | Bayram, Sinan | İfadeler belgesi (INV1_IFADE) |
| 12 Mart 09.50 | Emniyet 200 adet 200 TL'yi seri numaralarıyla tutanağa geçirip Bayram'a verir; Bayram'a kayıt cihazı takılır (hâkim kararı yok). | Kolluk | Tutanak belgesi, Komiser |
| 10.31 | Bayram binaya girer (sıra fişi). | — | Tutanak |
| 10.35 | Dahili **214**'ten Halil'in hattı (231) aranır: "Müdür Hanım aşağıda bekliyor, acil." Halil takvimine "10.35 — 214 — Md. Hn.?" yazar, iner. | Sinan | Oda sahnesi (takvim) + koridor (rehber) → tahta; santral kaydı |
| 10.39.12 | Bayram kayıt cihazını **elle** durdurur. | Bayram | Cihaz bilirkişi raporu (ara) |
| 10.40 | Bayram zarfı arşiv kapısının önünde Sinan'a verir. Sinan aynı dakika çay ocağından arşive çay ister. | Bayram, Sinan | Muzaffer'in defteri (ara) |
| 10.41.07 | Açık renk ceketli biri kontrol odasına girer, 20 sn sonra çıkar (koridor kamerası; yüz görünmez, bilekte yeşil ışık, koltuk altında kahverengi köşe). | Sinan | Kamera karesi sahnesi (ara) |
| 10.42 | Muzaffer arşive çay götürür; arşiv boştur. | Muzaffer | Muzaffer (ara), Sinan'ın alibisi çöker |
| 10.43 | Bayram polise "TAMAM" mesajı atar. | — | Tutanak |
| 10.44 | Polis kontrol odasına girer; oda boştur. | Kolluk | Tutanak (saatler) |
| 10.46 | Halil döner; çekmece onun önünde açılır: kahverengi iç yazışma zarfı, barkod **0417**, 40.000 TL. | — | Tutanak; arşivdeki zimmet defteri (0401–0450 → Devir-2) |
| 13 Mart | Tutuklama. Bayram'ın savcılık ifadesi: "Anlaştık; zarfı kendi elimle verdim, kendisi çekmeceye koydu." | — | İfadeler belgesi |
| 9 Nisan | İddianame: TCK 252/2. Bayram hakkında TCK 254/2 (cezaya hükmolunmaz). | — | Dosya |
| 22 Nisan | Zehra büroya gelir. 1. celseye 18 gün. | — | Bölüm 1 |
| 10 Mayıs | 1. celse. | — | — |
| 31 Mayıs | 2. celse ve hüküm. | — | — |

## 4. Yapı (bölümler ve node haritası)

```
PROLOG       Soğuk açılış: 12 Mart 10.31 — sıra fişi, kulaklık, dahili telefon, kesilen kayıt, çekmece      STORY
PROLOG_2     Emniyet: "Kontrolcüyü hallettik." Tutuklama                                                     STORY → BR_00
BR_00        Bölüm 1 · Zehra büroda (nöbet sonrası; gözlük; imzasız not; ücret seçimi)                        STORY
BR_01        Leyla: ceza aralığı (A–D)  → BR_01K dinleme ve kışkırtma dersi → BR_01B dört kâğıt → BR_02 strateji
INV1_SABAH   Cezaevi kapısında Zehra: gözlük                                                                   STORY → INV1_HUB
INV1_HUB     Bölüm 2 · SORUŞTURMA (3 gün × 4 EP; Leyla'ya danış günde bir, 0 EP; tahta 0 EP)
  KİŞİLER:  INV1_HALIL (görüşme; konular başka yerdeki bulgularla açılır; yüzleşme + tavsiye) · INV1_ZEHRA · INV1_MUDUR ·
            INV1_SINAN · INV1_KOMISER
  YERLER:   INV1_ODA (kontrol odası, sahne) · INV1_KORIDOR (2. kat, sahne)
  KAYITLAR: INV1_KARAR (dinleme kararı, belge) · INV1_TUTANAK (yakalama ve para tutanağı, belge) · INV1_IFADE (Bayram'ın
            iki ifadesi, belge) · INV1_DIL (CMK 177) · INV1_CIKARIM (7 tarif + çeldiriciler)
  Gün sonu: INV1_DAY_END → INV1_AKSAM1 (eve gelen "kurumdan biri") / INV1_AKSAM2 (kapı altındaki not) / INV1_AKSAM2B
INV1_GECE_*  Duruşmadan önceki gece (koşullu hafıza zinciri) → INV1_GECE
H1_*         Bölüm 3 · BİRİNCİ CELSE: koridor → açılış → sanığın sorgusu (Halil'in üç hâli) → sorular → savcının sorusu (itiraz)
             → kayıtların okunması (CMK 206 itirazı) → Komiser (K1–K5) → talepler → tutukluluk + ara karar → merdivenler
ARA_*        Bölüm 4 · ARA (2 gün × 4 EP; yığınsız, doğrudan dönüş)
  ARA_SANTRAL (belge) · ARA_CIHAZ (belge) · ARA_KAMERA (kamera karesi, sahne) · ARA_ARSIV (sahne) · ARA_SUC (suç duyurusu) ·
  ARA_HALIL · ARA_MUZAFFER · ARA_BAYRAM (büroya gelen muhbir) · ARA_LEYLA · ARA_CIKARIM (4 yeni tarif)
  ARA_DAY_END → ARA_AKSAM (otoparkta yağmur) / ARA_AKSAM2 ; ARA_SON_* → ARA_SON
T_*          Bölüm 5 · İKİNCİ CELSE: açılış (raporlar) → Bayram (B1–B5) → Sinan (S1–S4) ya da boş kürsü → Muzaffer →
             ek savunma bildirimi (CMK 226: irtikap / görevi kötüye kullanma) → mütalaa + cevap → esas savunma → son söz → hüküm
R_KARAR      Karar + sonuca bağlı epilog (OutcomeDef.epilogue)
T_COKUS      Güvenilirlik 0 → çöküş kesintisi
```

## 5. Sahne sahne (tipik yol sözcük bütçeleriyle, ± %20)

### PROLOG — Soğuk açılış · "12 MART · 10.31" (~700) · bg: sokak_yagmur → adliye (tapu koridoru)
- `card` "12 MART 2027 · 10.31 — NİLÜFER TAPU MÜDÜRLÜĞÜ". Sıra fişi makinesi "dıt" eder: 147. Islak bir yağmurluk, iç cebinde
  bir zarf ve göğsünde bant ile yapıştırılmış bir kablo. `KULAKLIK` (phone): "Deneme. Bir, iki. Sesin geliyor."
- İkinci katta bir dahili telefon çalar; başının üstünde gözlüğü unutulmuş, yaşlıca bir memur ahizeyi kaldırır: "Geliyorum."
  Takvimine bir şey yazar, ceketini almadan iner.
- Koridorda bir `FISILTI`: "Üçüncü çekmece. Hiç kilitlemez." Kulaklık cızırdar, `10.39`'da susar. Koridorda tatlı, keskin bir koku.
- 10.44: kapı, sivil polisler, boş oda. 10.46: memur döner. Çekmece açılır; kahverengi zarf; flaş (`flash`). "Bu zarf benim değil."
- **Kimin bıraktığı görünmez.** Fısıltının sahibi, kokunun kaynağı, kayıt cihazını kimin kapattığı söylenmez.

### PROLOG_2 — Emniyet, gece (~400) · bg: karakol
- Komiser bir transkript okur: "Kontrolcüyü hallettik. Zarf yarın masada." Halil: "Kontrolcü benim. Ama ben hallolacak adam
  değilim." Gözlüğü hâlâ başının üstündedir. Tutuklama. "Altı hafta sonra, kızı bir avukat aradı."

### BR_00 — Bölüm 1 · Zehra büroda (~800) · bg: buro_gece
- `card` "22 NİSAN 2027 · 22.40 — ARSLAN HUKUK". thought: *"Bu şehirde herkes bir tapuya bir gün imza atar. Kimse imzanın
  arkasındaki eli düşünmez."*
- Zehra yağmurluğunun altında forma, elinde babasının yedek gözlüğü ve bir naylon poşette imzasız not. "Babam bir çay
  parasını bile iade eden adamdır."
- Ücret seçimi (puansız; ilişki): "Ücreti sonra" (güven +), "Tarifemiz" (nötr), "Söz veremem ama okurum" (dürüstlük).
- Leyla kapıda; Zehra gidince: "Kurallı insanların düşmanı çok olur, Deniz. Çünkü kural, herkesin işine gelmez."

### BR_01 / BR_01K / BR_01B / BR_02 — Leyla, ders, dört kâğıt, strateji (~1.300)
- Ceza aralığı (A–D): 252/2 (4–12 yıl) doğru; irtikap 250/1 (5–10), görevi kötüye kullanma 257/1, 252/4 yarı indirim yanlış.
- Ders: "Dinleme bir anahtar deliğidir. Kayda bakmadan önce deliğin hangi kapıda olduğuna bak: hangi hat, hangi tarih, hangi
  karar." ve "Polis bir suçu ortaya çıkarabilir; yaratamaz." Ters çerçeve.
- Dört kâğıt: yakalama tutanağı, dinleme transkriptleri, muhbirin ihbarı, Halil'in ifadesi. "Dördünde de bir el eksik: zarfı
  çekmeceye koyan el."
- Strateji: Masumiyet ×1,5 · Hukuka aykırı delil (usul) ×1,2 · Terditli ×0,8.

### INV1_SABAH — Cezaevi kapısı (~350)
- Zehra kapıda; görüş günü değil. Gözlüğü uzatır: "Babam okumadan uyuyamaz." Seçim: gözlüğü götürmek (güven +) ya da
  "kurallar" demek.

### Bölüm 2 · SORUŞTURMA (INV1_*), toplam ~5.000
- **INV1_HALIL (~1.600):** görüş odası; Halil kâğıtları dik açıyla dizer. Konular: O sabah · Çekmece · Bayram · Telefon (tam
  cümle) · Kontrol (11 dosya) · Defter (odadaki toz izinden sonra) · Zehra. Yüzleşme: sıra dışı randevu çıktısıyla; ilk
  kırılma: "Yirmi yedi yılda bir kez." Tavsiye: doğruyu anlat (doğru) / inkâr et (etik ihlali) / sus.
- **INV1_ZEHRA (~500):** acil servis, gece 03.00; not, babanın takvim alışkanlığı, eve gelen "kurumdan biri".
- **INV1_MUDUR (~500):** Ferda Yalçın: telekonferans; TAKBİS çıktısı (dosya Devir-2'nin; sıra dışı onay H. Ekinci); odaya izin.
- **INV1_SINAN (~450):** nane şekeri, akıllı saat; "arşivdeydim, 1987 ciltleriyle boğuşuyordum"; "abimiz biraz katıdır".
  Ziyaret, akşam kapı altındaki notu tetikler.
- **INV1_KOMISER (~450):** "Kontrollü teslimat"; para Emniyet'ten; kayıt "arızalandı"; uzatma kararını "savcılık bilir".
- **INV1_ODA / INV1_KORIDOR (sahne):** takvim (214), rehber (214 = Devir-2: S. Kaplan, G. Erdem), raftaki toz izi, paslı
  kilit, zarf dolabı, kamera; çeldiriciler.
- **INV1_KARAR / INV1_TUTANAK / INV1_IFADE (belge):** süre, hedef hat, kayıt #6/#9/#14; saatler, kayıt durması, barkod;
  irtikap anlatısı ile "anlaştık" anlatısı.
- **Gün sonları:** 1. akşam Zehra'nın telefonu (eve gelen kişi: savcılığa bildir / Zehra'ya "kimseye bir şey verme" / boş ver);
  2. akşam kapı altındaki not ("Tapu işleri uzun sürer. Bazen ömür boyu.") ya da Leyla'yla çay.
- **INV1_GECE:** koşullu hafıza zinciri; Halil'in görüş odasından gelen mektup: "Yarın beni değil, kâğıtları dinletin."

### Bölüm 3 · BİRİNCİ CELSE (H1_*), ~2.600 · bg: durusma_salonu
- Halil kelepçeyle getirilir; Zehra'yı görür, gözlüğünü düzeltir. Savcı: "Zarf çekmecede, para işaretli, kayıt ortada."
- Sanığın sorgusu üç hâlde (doğru / inkâr / susma). Savcının yönlendirici sorusu (itiraz).
- **Kayıtların okunması (CMK 206/2-a):** doğru itiraz süre dışı #14'ü ve karar dışı #9'u ayıklar; #6 kalır — ve lehe konuşur.
- **Komiser (K1–K5):** "kuvvetli delil" → süre dışı kayıt; "muhbir parayı getirdi" → para tutanağı (Emniyet verdi); "sanık
  başındayken" → saatler; "cihaz arızalandı" (bastır); "kendi hattında 'bakarım' dedi" (görünür olunca; hukuka aykırı delil
  itirazı).
- Talepler, tutukluluk değerlendirmesi (yeterli çelişki → adli kontrolle tahliye), ara karar: kamera, santral, cihaz bilirkişisi,
  Sinan ve Muzaffer tanık.

### Bölüm 4 · ARA (ARA_*), ~3.000
- Gelen kayıtlar zinciri (ARA_GIRIS_*); santral ve izin çizelgesi (Gülay izinli → **214'te tek kişi**); cihaz raporu (manuel
  durdurma); kamera karesi (açık renk ceket, bilekte yeşil ışık, kahverengi köşe); arşiv (defter, zimmet defteri: 0401–0450
  Devir-2; 1987 ciltleri karıştırılmış).
- **ARA_BAYRAM:** muhbir büroya gelir, korkmuştur. Doğru: kendi avukatına ve savcılığa yönlendirmek; yanlış: ifade yazdırmak;
  ağır yanlış: ne söyleyeceğini dikte etmek (TCK 277).
- **ARA_MUZAFFER:** çay defteri; "Ben çaycıyım, şahit değil" → mahkemenin dinlemesini istemek.
- **ARA_SUC:** somut dayanaklı suç duyurusu (zarf kaynağı + tek kişi) doğru; Ateşoğlu hakkında söylentiyle yanlış.
- **ARA_AKSAM:** büronun otoparkında yağmur; Sinan bir şemsiye uzatır: "Abim için ne lazımsa." Sinan'a cevap vermemek ve
  karşılaşmayı tutanağa geçirmek doğrudur; peşine düşmek yanlış.

### Bölüm 5 · İKİNCİ CELSE (T_*), ~3.200
- Bayram (B1–B5): irtikap mı anlaşma mı; "kendi elimle verdim" ↔ oda boştu; "kendiliğinden kapandı" ↔ manuel durdurma;
  "dosyama o bakıyordu" ↔ Devir-2; bastırınca açılan B5: "Koridorda birine verdim" → zarf kaynağı / tek kişi sunulursa adı söyler.
- Sinan (S1–S4): "Arşivdeydim" ↔ Muzaffer'in defteri; "Halil abiyi aramadım" ↔ santral; "Zarflar ortak dolaptan" ↔ zimmet;
  "Benim ne çıkarım olur?" ↔ kırmızı defter. Çöküş: BERAAT_B.
- Ek savunma bildirimi (CMK 226): vasıf irtikap ya da görevi kötüye kullanma olabilir; doğru cevap icbarın ve nüfuzun yokluğu.
- Mütalaa varyantları; cevap; esas savunma (2-b / 2-e / terditli 257 / duygusal); Halil'in son sözü ("Yirmi yedi yılda bir
  kez kuralı esnettim; o bir iyilikti, bir pazarlık değil").

### R_KARAR — Epiloglar (her biri ~250–400)
- **BERAAT_B:** "…işlemediği sabit olduğundan." Zehra babasının gözlüğünü başının üstünden alıp burnuna takar. Merdivende
  Muzaffer iki çay tutar. Leyla ters çerçeveye bakar. Son kart: "Sinan Kaplan hakkında soruşturma başlatıldı; Ateşoğlu
  dosyaları yeniden incelemeye alındı."
- **BERAAT_E:** "…sabit olmadığından." Koridorda bir fısıltı: "Kayıt usulsüzmüş, ondan çıktı." Halil'in görevine iadesi
  bekletilir. thought: *"Bir kapıyı açtım. Kimin kapattığını söyleyemedim."*
- **GÖREVİ KÖTÜYE KULLANMA (HAGB):** rüşvet düşer; sıra dışı randevu kalır. Halil: "Yirmi yedi yılın bedeli bir iyilik." 
- **MAHKÛMİYET:** ring aracının camı; Zehra'nın elinde gözlük. thought: *"Kayıt bir anahtar deliğiydi. Ben kapıyı hiç
  açamadım."* Çöküşte savcının cümlesi.
- **ETİK:** Leyla masaya Avukatlık Kanunu'nu bırakır; tanıdık polisin flaş belleği çekmecede, bir zarf gibi.
