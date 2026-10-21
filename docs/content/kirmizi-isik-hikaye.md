# Dava #03 — Kırmızı Işık · Hikâye Kitabı (noir)

> Anlatı çıtası: `docs/content/gece-bekcisinin-sirri-hikaye.md` (Dava #07 v2). Hukuki gerçek, delil zinciri, sonuç koşulları ve
> puanlar `docs/content/kirmizi-isik.md` ile `docs/legal/kirmizi-isik.md`'de; bu belge onları **sahneye** çevirir.
> Kaynak: `content/src/kirmizi-isik/` → `content/cases/kirmizi-isik/` (`npm run case:build -- kirmizi-isik`).

## 0. Ton ve kurallar

- **Noir dram.** Bursa, kasım; ilk soğuklar, ince ve inatçı bir yağmur. Islak asfaltta trafik lambalarının yansıması,
  silecek gıcırtısı, sanayi sitesinde taşlama sesi, hastane koridorunun çamaşır suyu kokusu. Her sahnede bir duyusal ayrıntı.
- **Tema:** *suçluluk duygusu ile suç aynı şey değildir.* Volkan, birinin ölümünü tekerleğinin altında "hissettiği" için
  kendini katil sayıyor. Dava, hissedilenle olanı ayırmanın hikâyesi: hukuk dilinde kusur ve illiyet bağı.
- **İç ses.** Deniz `style: "thought"` ile birinci tekil şahıs, kısa ve keskin cümlelerle anlatır. Gözlemler, sezer, ama
  çözümü söylemez. Örnek: *"Kasımda Bursa erken kararır. Bazı dosyalar da öyle."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numaraları yalnızca Leyla'nın kısa açıklamalarında, `good/bad/neutral`
  geri bildirimlerinde, rapor ipuçlarında, hüküm metninde ve resmî duruşma dilinde (hâkim, savcı, katılan vekili, avukatın
  A–D etiketleri) geçer. Volkan, Gül, Necati, Serkan, Sevim, Hamdi madde numarası söylemez.
- **Gizem korunur.** Soğuk açılışta konuşmacılar isimsizdir (`speaker: "narrator"`, `name: "SÜRÜCÜ"`, `"TELEFONDAKİ SES"`,
  `"BİR POLİS"`, `"BİR ADAM"`). İkinci araç ve sinyal arızası anlatıcı ya da iç ses tarafından **hiçbir zaman** önceden
  söylenmez; oyuncu bunları belge hücrelerinden, sahne nesnelerinden ve tahtadan kendisi kurar. Panelvanın rengi, sürücünün
  adı ve fırının adı ancak ilgili delil bulunduktan sonra metne girer.
- **Satır kuralları:** satır ≤ ~220 karakter; yeni mekân `style: "card"` + `bg` ile açılır (`"PERŞEMBE 22.10 — ARSLAN HUKUK,
  BURSA"`); sert anlarda `fx` (`shake` çarpışma/kapı, `flash` flaş/şimşek, `fade` bölüm sonu).
- **Etik çizgi:** Deniz tanığa ne söyleyeceğini söylemez; kaçan bir şüpheliyi kovalamaz, savcılığa bildirir; kapalı bir
  işyerine izinsiz girmek, yasın içindeki bir aileye para teklif etmek ve tanığı korkutmak, puan ve sonuç kaybettiren etik
  ihlallerdir.
- **Kelime bütçesi:** tipik yol (BERAAT_E) `case:duration` ölçüsüyle 13–16 bin sözcük; tüm dallar ≥ 18 bin; 90–120 dk.

## 1. Gerçek ve kronoloji (oyuncu bunu sonda bilir)

| Saat (14 Kasım) | Olay | Kim biliyor | Oyuncu nereden öğrenir |
|---|---|---|---|
| 9 Kasım 19.40 | Bir vatandaş Belediye Beyaz Masa'ya ihbar eder: "Gökdere–Çınarlı kavşağında yaya ve araç yeşili aynı anda yanıyor." İş emri açılır, "malzeme bekleniyor" diye ertelenir. | Hamdi, belediye | Sinyal olay günlüğü (dilekçeyle), Hamdi'nin konuşması, tahta (`ded_ariza`) |
| 00.30 | Hatice Durmaz (54, hastane temizlik görevlisi) gece vardiyasından çıkar, yürüyerek eve gider. | — | Serkan |
| 00.58 | Fırtınada şebekede gerilim düşümü. Kavşak denetleyicisi yeniden başlar ve arızalı çatışma kartı yüzünden Gökdere taşıt yeşili ile yaya yeşilini birlikte yakar. Sokak lambaları bir an söner. | UEDAŞ, denetleyici kaydı | UEDAŞ yazısı, büfe kaydındaki titreme, sinyal günlüğü |
| 01.05 | Hatice oğluna sesli mesaj bırakır: "Işıklar yine bozuk oğlum, yeşil yanıyor ama arabalar da geçiyor. Az kaldı, geliyorum." | Serkan | ARA'da Serkan, güven kazanılmışsa |
| 01.09–01.11.40 | Volkan Eren (34) gece vardiyasından dönerken karısı Gül ile arabanın eller serbest sistemiyle konuşur. Yorgundur; 19 saattir ayaktadır. | Volkan, Gül | HTS, araç multimedya ekranı, görüşme |
| 01.11.41 | Koyu yeşil, sağ stop lambası kırık, 2007 model bir panelvan (Altın Başak Fırını'nın dağıtım aracı; sürücü Tarık Sezer, 27) Gökdere'den ~75 km/s ile gelir, yaya geçidinde yeşilde geçen Hatice'ye sağ ön köşesiyle çarpar. Hatice ~12 m savrulup sol şeride düşer. Panelvan ABS'siz frenler (18 m kesintisiz iz), sağ farının camı kırılır, kaçar. | Tarık, (sonra) fırın sahibi | Fren izi + ABS, far camı + sağlam farlar, 56 cm kırık + 44 cm tampon, boya parçası, büfe kaydı |
| 01.11.48 | Volkan yeşilde, ~38 km/s ile kavşağa girer. Islak asfaltta koyu bir şekil görür, frene basar (ABS), sol ön tamponu yerdeki Hatice'nin omzuna sürtünüp onu ~1,5 m iter. Durur, 112'yi arar, montunu Hatice'nin üstüne örter. | Volkan | Volkan'ın kolluk ifadesi, EDR, otopsi (sırt sıyrıkları) |
| 01.12 | Taksici Necati Bulut (58), Çınarlı Sokak'ta kendi kırmızısında beklerken bir gümbürtü duyar, başını kaldırır ve beyaz arabayı kadının yanında görür. "Kırmızıda geçti" der; gördüğü kırmızı kendi önündeki lambadır. | Necati (farkında değil) | Necati'nin konuşması, sahne (sinyal başlığının arkası), tahta (`ded_goremez`) |
| 01.24 | Polis ve ambulans. Hatice hastaneye kaldırılırken ölür (kafa travması). Polis memuru Ayten Yurt yaya geçidinin 9 m ilerisinde far camı kırıklarını tutanağa yazar; amiri "eski kazadan kalmadır, tek araç" der, kırıklar emanete alınmaz. Ayten bir parçayı dolabında saklar. | Ayten | Tutanak, Ayten (soruşturma ve ara) |
| 14 Kasım 09.00 | Tarık panelvanı Kestel'deki sanayi sitesinde Rüstem Usta'ya götürür; sağ ön köşe peşin parayla, faturasız onarılır ve boyanır. | Rüstem, Tarık | Ara evresinde sanayi (çıkarım `ded_arac` sonrası), savcılık yazısı |
| 15 Kasım | Belediye kavşağın kartını sessizce değiştirir (kabinde 15 Kasım tarihli bakım etiketi). | Hamdi | Kavşak araması, Hamdi |
| Aralık | Müh. Cengiz Ateş'in bilirkişi raporu: Volkan "kırmızı ışık ihlali" ile asli kusurlu (%100); fren izinden 68 km/s; arıza kaydı incelenmemiş, far camı yok sayılmış. | — | Rapor incelemesi |
| Ocak | İddianame: TCK 85/1 + 22/3 (bilinçli taksir: kırmızı ışık, hız, telefon). Volkan adli kontrol altında (yurt dışı yasağı, imza, taşıt kullanma yasağı). | — | Dosya |

## 2. Kadro: sesler, sırlar, yaylar

| Kimlik | Karakter | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| deniz | **Av. Deniz Arslan** (oyuncu), 31 | Kısa, alaycı iç ses; dışarıda nazik ama inatçı. | İlk ölümlü dosyası. Bir trafik kazasında babasını kaybetmiş bir arkadaşı vardı; ölümün "birinin suçu" olmasını isteyen tarafı tanıyor. | Kolay acıma → ayrım yapabilmek: Serkan'ın acısına saygı duyup Volkan'ı savunmayı öğrenir. |
| leyla | **Av. Leyla Erdem** (mentor), 58 | Az konuşur; her cümlesi ders. Sigara paketi masada, açılmamış. | Ters çerçeve (Dava #15 tohumu; yalnızca ima). | Deniz'i izler, kurtarmaz; bilirkişi raporunu "en tehlikeli tanık" diye öğretir. |
| volkan | **Volkan Eren** (müvekkil), 34, dokuma fabrikasında gece vardiyası ustabaşı | Ağır, az sözcük, uzun sessizlikler. Ellerine bakar. "Hissettim" sözcüğüne takılı. "Avukat hanım" der. | Telefonu kapatmak için ekrana bir an baktığını sanıyor ve bu yüzden suçlu hissediyor. Önünde uzaklaşan tek bir kırmızı lambayı gördü ama "kafamın uydurması" diye kimseye söylemedi. | Kendini cezalandırma isteği → gerçeği öğrenme. Kızı doğduğunda "Ona bir yalanla bakamam" der. |
| gul | **Gül Eren**, 31, sınıf öğretmeni, sekiz aylık hamile | Hızlı, pratik, kuru şakalar; dosyaları renkli klasörlerde taşır. Öfkesini düzenle saklar. | O gece telefonda Volkan'la tartıştığını, aramayı kendisinin uzattığını düşünüp kendini suçluyor. | Suçluluk → ortaklık; ara evresinde kızları Deniz'e haber verir. |
| necati | **Necati Bulut**, 58, taksici | Çok konuşur, sözü kendine getirir: "Kırk yıllık şoförüm ben." Kahve ve sigara, cümle sonlarında "di mi". | Önemli olmayı seviyor; o gece aslında bir gümbürtüyle başını kaldırdı. Kendi kırmızısını gördü. Yalancı değil, emin. | Kesinlik → tereddüt. Kürsüde "Ben… benim lambam kırmızıydı" dediği an. |
| serkan | **Serkan Durmaz**, 30, katılan, inşaat demircisi; maktulün oğlu | Kısa, sert, alaycı: "Siz avukatlar…" Annesinden "anam" diye söz eder. | Annesinin son sesli mesajını kimseye dinletmedi; dinleyemiyor. | Öfke → yönelme: öfkesi doğru kişiye döner (BERAAT_B'de Deniz'e başıyla selam verir). |
| hamdi | **Hamdi Kocabaş**, 56, belediye sinyalizasyon teknisyeni | Huysuz, teknik, "abla" der; sürekli tornavida çevirir. "Ben söyledim, yazdım, kimse okumadı." | İş emrini erteletmenin kendisi değil müdürü olduğunu biliyor; emekliliğine iki yıl var, korkuyor. | Korku → kürsüde dürüstlük. |
| sevim | **Sevim Akgül**, 63, köşedeki 24 saat büfenin sahibi | Annece, dedikoducu, "kuzum" der; her şeyi çayla ölçer. | Kamerasının saati yedi dakika ileridir; ayarlamayı hiç öğrenmemiş. Ara evresinde biri kaydı sormaya gelir. | Merak → tanıklık. |
| ayten | **Polis Memuru Ayten Yurt**, 33, trafik kaza tespit | Kısa, resmî, dikkatli; cümleleri tutanak gibi. | Amiri far camlarını "eski kaza" saydı; Ayten bir parçayı dolabında sakladı. Vicdanı rahat değil. | Sessizlik → doğru kanaldan teslim (savcılığa). |
| cengiz | **Müh. Cengiz Ateş**, 61, trafik bilirkişisi | Kendinden emin, jargon, "tecrübeyle sabittir". Raporları birbirine benzer. | Rapordaki bir paragraf başka dosyadan kopya (sağ ön köşe). | Kürsüde ilk kez "tespit edilmemiştir" demek zorunda kalır. |
| nalan | **Doç. Dr. Nalan Güneş**, 47, bilirkişi heyeti başkanı (trafik/makine) | Ölçülü, kesin, "veri bunu söylüyor, fazlasını değil". | — | Heyet raporu ikinci celsede dosyanın zeminini değiştirir; yine de "tali kusur" paragrafıyla Deniz'i sınar. |
| rustem | **Rüstem Usta**, kaportacı (Kestel sanayi) | Ağzı bozuk, telaşlı, sürekli taşlama sesi. | Faturasız onarım; korkuyor. | Yalnızca ara evresinde, etik sınavın sahnesi. |
| hakim | **Hâkim Orhan Tanrıverdi**, Bursa 7. Asliye Ceza (tek hâkim) | Sabırlı, kuru: "Müdafi, diyeceğiniz?" | — | — |
| savci | **Savcı Ebru Kalkan** | Keskin, adil; delil görünce görüş değiştirir. | — | İkinci celsede mütalaası delile göre değişir. |
| vekil | **Av. Kenan Ilgaz**, katılan vekili | Teatral, duygusal, telkinli sorular. | — | Rakip ses. |
| mubasir | **Mübaşir Şükrü** | Bıkkın, sesi koridorda yankılanır. | — | — |

Leyla'nın masasındaki ters çerçeve yalnızca bir kez görülür (BR_01). Gül'ün klasörleri, Volkan'ın elleri, Necati'nin
termosu, Hamdi'nin tornavidası, Sevim'in çaydanlığı: her karakterin bir nesnesi var.

## 3. Yapı (node haritası)

```
PR_00 Soğuk açılış (01.09, SÜRÜCÜ ve TELEFONDAKİ SES)                STORY → PR_01
PR_01 01.24 kavşak: polis, taksici, kelepçesiz bir gözaltı             STORY → PR_02
PR_02 02.10 bir mutfak: eşin gecesi (BİR KADIN, TELEFONDAKİ SES)       STORY → BR_00
BR_00 Bölüm 1 · Gül büroda (zarf/söz seçimi)                          STORY
BR_01 Leyla: ceza aralığı (A–D)                                       STORY
BR_01B Dosyanın kâğıtları, bilirkişi raporu dersi (seçim)             STORY
BR_02 Dosya ekranı + strateji                                         STORY → INV_SABAH
INV_SABAH Kavşak sabahı, direkte çiçekler                             STORY → INV_HUB
INV_HUB Bölüm 2 · SORUŞTURMA (4 gün × 4 EP; Leyla günde bir, 0 EP; + INV_T_HAS hastane, INV_AKSAM3 gece 01.11)
  Olay yeri: INV_ARAMA (polis fotoğrafları) · INV_ARAMA2 (kavşak bugün) · INV_ARAMA3 (yediemin otoparkı, araç)
  Kişiler: INV_GORUSME (Volkan, evde; fakta bağlı konular) · INV_T_NEC · INV_T_SER · INV_T_HAM · INV_T_SEV · INV_T_AYT
  Arşiv: INV_RAPOR · INV_TUTANAK · INV_OTOPSI · INV_BUFE · INV_SINYAL (belgeler) · INV_DIL (dilekçe) · INV_CIKARIM (tahta)
  Gün sonu: INV_DAY_END → INV_AKSAM1 (Gül'ün telefonu) / INV_AKSAM2 (Serkan'ın kapısı ya da Leyla)
INV_GECE_* Duruşmadan önceki gece (koşullu hafıza zinciri) → INV_GECE (Volkan'ın mesajı: seçim)
H1_00K Koridor (Volkan "kabul edeceğim" der: seçim) → H1_00 açılış → H1_01 sanık savunması → H1_02Q sanığa sorular
H1_03 katılan vekilinin sorusu (itiraz) → H1_04 Serkan'ın beyanı (seçim) → H1_05 Necati (N1–N5; bastır/sun/itiraz)
H1_06 bilirkişi raporu (CMK 67/5 itirazı + talepler) → H1_07 ara karar (adli kontrol talebi) → ARA_GIRIS
ARA_HUB Bölüm 4 · ARA (2 gün × 4 EP; yığınsız, doğrudan dönüş; + ARA_NECATI, ARA_NALAN)
  ARA_EDR (belge) · ARA_HEYET (belge) · ARA_AYTEN · ARA_SANAYI · ARA_SUC · ARA_VOLKAN · ARA_SERKAN · ARA_HAMDI
  ARA_CIKARIM (ikinci tahta) · ARA_LEYLA
  ARA_DAY_END → ARA_AKSAM ; ARA_SON_* → ARA_SON (gece) → T_00K
T_00K Koridor → T_00 açılış (raporlar, savcılık yazısı) → T_01 Hamdi (H1–H4) → T_02 savcının sorusu (itiraz)
T_03 Müh. Cengiz Ateş (C1–C4) → T_04 Ayten'e sorular → T_05 EDR/ATK tartışması → T_06 mütalaa (cevap)
T_07P dayanaklar → T_07 esas savunma → T_08 son söz → T_09 → R_KARAR (+ sonuç başına epilog)
T_COKUS (♥0) → T_09
```

İlk celse (kimlik, iddianame, sorgu) oyundan önce baro avukatıyla yapılmıştır; oyundaki celseler `cs_2` (2. celse: açılış,
savunmanın tamamlanması, tanık, delil tartışması) ve `cs_3` (3. celse: tanıklar, bilirkişi ve heyet başkanı,
delil tartışması, mütalaa, savunma, son söz, karar). Mahkeme Bursa 7. Asliye Ceza (TCK 85/1 + 22/3'ün üst sınırı 9 yıl;
ağır ceza değil), tek hâkim.

## 4. Sahne sahne (hedef sözcük ± %20)

### PR_00 — Soğuk açılış · "01.09" (~650) · bg: arac → sokak_yagmur
- `card`: "14 KASIM · GECE 01.09 — GÖKDERE BULVARI, BURSA".
- Araç içi: silecek, ısıtıcının kokusu, radyo kapalı. SÜRÜCÜ (isimsiz) eller serbest bir aramada; TELEFONDAKİ SES (kadın,
  yorgun, sitemkâr): "Yine mi son vardiya?" Kısa bir tartışma: kira, doktor randevusu, "bebek tekmeliyor, sen yoksun".
- SÜRÜCÜ: "Tamam. Kapat artık, geliyorum." Ekrandan aramayı kapatır. Yeşil ışık. Islak asfalt.
- "Farların ucunda koyu bir şey. Bir poşet mi, bir gölge mi." Fren (`fx: shake`). Sol önde bir tümsek. "Hissetti."
- SÜRÜCÜ arabadan iner: kadının ayakkabısı, bir naylon poşet, içinde hastane yemekhanesinden kalan iki simit. Montunu üstüne
  örter. 112'yi arar. Sesi titrer: "Bir kadına çarptım. Gökdere kavşağı. Lütfen."
- Son satır: "Yeşil yanıyordu. Yeşil yanıyordu. Bunu sonra çok kez söyleyecekti; her seferinde biraz daha az inanarak."
  (`fx: fade`)
> Kural: ikinci araç **yok**. Sürücü ne gördüyse o: yeşil ışık, koyu şekil, tümsek. Oyuncu Volkan'ın suçlu olduğuna inanmaya
> hazır başlar.

### PR_01 — "01.24" (~500) · bg: sokak_yagmur → karakol
- Mavi ışıklar, ambulansın kapısı. BİR POLİS (kadın) metreyle ölçüm yapar, yerde parıldayan bir şeyin fotoğrafını çeker
  (ayrıntı verilmez). BİR ADAM (taksici, yüksek sesle): "Kırmızıda geçti! Gözümle gördüm, kırk yıllık şoförüm ben!"
- SÜRÜCÜ kaldırımda, ellerine bakar. Alkol testi sıfır.
- `card`: "TRAFİK ŞUBE, 04.40". Müdafiiyle verdiği ifade: "Yeşildi. Ben… çarptım. Hissettim. Durdum." Sabah sulh ceza
  hâkimliği: adli kontrol (yurt dışı yasağı, haftada bir imza, taşıt kullanmama).
- narrator: "Hatice Durmaz hastaneye vardığında ölmüştü. Elli dört yaşındaydı. Otuz yıl aynı yolu yürümüştü."

### BR_00 — Bölüm 1 · DOSYA · "Gül Hanım" (~900) · bg: buro_gece
- `card`: "PERŞEMBE 21.50 — ARSLAN HUKUK, BURSA" (üç ay sonra, şubat). Yağmur.
- thought: "Kasımda Bursa erken kararır. Bazı dosyalar da öyle." (şubatta hâlâ kararmış.)
- Gül, renkli klasörlerle ve karnıyla girer: "Kocam birini öldürdüğünü düşünüyor avukat hanım. Ben düşünmüyorum. Fark bu."
- Klasörler: iddianame, bilirkişi raporu, ultrason fotoğrafı (yanlışlıkla). Duygusal çekirdek: "İlk celsede baro avukatı
  'kabul edin, indirim alırız' dedi. Volkan da kabul etmek istiyor."
- Seçim (puansız, ilişki): "Önce Volkan'ı dinlemem gerek" (+güven, `gul_dinle`) · "Ücreti konuşalım" (nötr) · "Kabul etmesi
  belki en iyisi" (güven −, Gül sertleşir; `gul_kirgin`).
- Leyla kapıda: "Suçluluk duygusu delil değildir, Deniz. Ama hâkim bazen onu delil gibi okur."

### BR_01 — Leyla: ceza aralığı (~550)
- Leyla ters çerçeveyi düzeltmeden dosyayı bırakır. Soru: iddianamedeki suçun ceza aralığı.
- A doğru: 85/1 iki–altı yıl; bilinçli taksirle üçte birden yarıya kadar artar (2 yıl 8 ay–9 yıl). Leyla: "Bilinçli taksir
  düşerse, bir de 50/4 kapısı açılır. Hapis yerine para. Bunu aklında tut."
- Yanlışlar: 85/2 (birden çok ölüm/yaralanma), olası kast (TCK 21/2, kasten öldürme), taksirle yaralama.

### BR_01B — Kâğıtlar (~600)
- Leyla altı kâğıdı tek tek çevirir: iddianame, Cengiz Ateş'in raporu, tutanak ve kroki, otopsi ön raporu, Necati'nin
  ifadesi, HTS. Bilirkişi dersi: "Bu dosyada en tehlikeli tanık kürsüye çıkmayacak. Bir rapor olarak gelecek." (CMK 63, 67/5,
  67/6 bu açıklamada.)
- Seçim: "İlk nereden başlarsın?" (rapor / kavşak / müvekkil) → yalnızca Leyla'nın cevabı ve küçük bir bayrak.

### BR_02 — Dosya ekranı + strateji (~300)
- Profil kartı, ceza aralığı, olay özeti, savcılığın elindekiler, strateji: **Masumiyet** (suçu işlemediğini ispat; 223/2-b, yüksek risk; ters köşeyi ima etmez), **Kusur
  itirazı** (ışık, hız, rapor), **Terditli** (basit taksir, alt sınır, 50/4). Leyla tek cümleyle karşılar.

### INV_SABAH — "Kavşak, sabah" (~350) · bg: sokak_sabah
- Direkte naylona sarılmış karanfiller, bir hastane kartı: "Hatice ablamıza. Kat 3 temizlik ekibi." Bir çocuk düğmeye basar,
  yaya ışığı yeşile döner. thought: "Işıklar şimdi kusursuz çalışıyor. Ölüler hep düzgün çalışan makinelerin önünde ölür."
  (Bu cümle arızayı söylemez; ironi.)

### Bölüm 2 · SORUŞTURMA (~5.500 tipik yolda)
**INV_HUB** hedef kutusu güne ve bayraklara göre değişir:
- Gün 1: "Volkan neyi hatırlıyor, rapor neye dayanıyor?" · Gün 2 (ikinci araç ipucu varsa): "Fren izi, cam kırıkları, boya.
  Kavşakta o gece kaç araç vardı?" / (yoksa) "Işık. Taksici neyi görebilirdi?" · Gün 3: "Dilekçe ve tahta. Duruşmada neyi
  istiyorsun?"

**INV_GORUSME — Volkan'ın evi (~1.500)** · bg: ev. Gül çay koyar, yan odadan çıkmaz ama dinler. Konular: o gece, ışık,
telefon, yorgunluk, Gül. Fakta bağlı konular: **"Önünde bir şey var mıydı?"** (fren izi ya da far camı bulunduysa: Volkan
uzakta tek bir kırmızı lamba gördüğünü ilk kez söyler; `fact_tek_lamba`), **"Darbeyi anlat"** (otopsi okunduysa: "Önden değil;
sol alttan. Cam bile çatlamadı."), **"ABS"** (araç incelendiyse: "Titredi pedal. Hep öyle yapar."). Sert ton daha çok bilgi,
daha az güven. İlk görüşmede Volkan'ın cümlesi: "Hissettim avukat hanım. Tekerleğin altında. Bunu bir hâkime nasıl
anlatırsınız?"

**INV_ARAMA — 14 Kasım polis fotoğrafları** (~6 dokunuş): kesintisiz fren izi, yaya geçidinin ilerisindeki cam kırıkları,
Çınarlı'dan görünen sinyal başlığının arkası (siyah sırt), kaldırımdaki poşet (0), rögar ve afiş (ıska).
**INV_ARAMA2 — Kavşak bugün** (sokak_sabah): kontrol kabinindeki 15 Kasım etiketi, büfenin yola bakan kamerası, direkteki
çiçekler (çeldirici kart), yaya butonu ve reklam panosu (ıska).
**INV_ARAMA3 — Yediemin otoparkı, Volkan'ın arabası**: sol ön tampondaki sürtünme (44 cm), sağlam farlar, ABS uyarı lambası,
multimedya ekranındaki arama kaydı (eller serbest), bebek koltuğu (0, duygu), arka koltukta bir fabrika önlüğü (0).

**INV_T_NEC — Taksi durağı (~650)** · bg: sokak_gece. Necati termos kahvesiyle. Sorular: o gece nerede bekliyordun
(Çınarlı, kendi kırmızısında; `clue_necati_yer`), ne duydun ("önce bir gümbürtü, sonra baktım"; `fact_gumburtu`), başka araç
("bir minibüs mü ne, ama çok önceydi" — yalnızca sert ama dürüst soruyla), ve bir etik tuzak: "Belki yanlış görmüşsündür
diyelim mi?" (telkin: −, `ethics`).

**INV_T_SER — Mezarlık çıkışı / Serkan'ın evi (~600)** · bg: ev. Serkan kapıyı aralık tutar. Seçimler: başsağlığı ve
yalnızca dinlemek (`serkan_saygi`), "şikâyetinden vazgeçer misin" (yanlış: takibi şikâyete bağlı değil; kırgınlık), para
teklifi (etik ihlali; Serkan kapıyı çarpar). Saygı yolunda Serkan şunu söyler: "Anam otuz yıl o yoldan geçti. Kırmızıda bir
kere bile geçmedi." ve "O gece bana mesaj bırakmış. Dinleyemedim." (ARA'da açılır.)

**INV_T_HAM — Belediye sinyal deposu (~550)** · bg: depo (kabin etiketi ya da 2. gün). Hamdi tornavidasıyla. Kabin etiketini
gösterirsen: "Kart değişti, evet. Neden değişti, bunu benden duymazsınız. Yazıyla isteyin." İş emri: "9'unda açtım, malzeme
yok dediler." (`clue_is_emri`) Seçim: resmî yazıyla iste (doğru) / kayıt dışı fotokopi iste (−).

**INV_T_SEV — Büfe (~500)** · bg: kafe. Sevim çay koyar, kaydı gönüllü olarak USB'ye verir; "saati ileri, kuzum, hep
ileri". Kaydın teslimi tutanakla (doğru) ya da "ben izlerim bırakın" (küçük ceza değil; zaman).

**INV_T_AYT — Trafik şube (~500)** · bg: karakol. Ayten resmî; cam kırıkları sorulursa: "Tutanağa yazdım. Fazlasını
söyleyemem." Bir seçimle (amirini suçlamadan sormak) "Emanete alınmadı" bilgisini verir (`fact_emanet_yok`).

**Belgeler:** INV_RAPOR (Cengiz Ateş raporu: "normal sinyal planı esas alınmıştır", "18 m iz → 68 km/s", "sağ ön köşesiyle"
kopya hatası, "olay yerinde başka araç izine rastlanmamıştır" ↔ tutanak), INV_TUTANAK (kroki: 18 m kesintisiz iz, cam
kırıkları, araçta sol ön sürtünme ve sağlam farlar, tanığın Çınarlı'daki yeri), INV_OTOPSI (56 cm tibia kırığı, sırt
sıyrıkları, montta koyu yeşil boya parçası, kan alkol negatif), INV_BUFE (kamera: 00.58'deki titreme, tek stoplu koyu araç
"01.18.41", Volkan "01.18.48"), INV_SINYAL (dilekçeyle: 00.58 yeniden başlatma, "çatışma uyarısı bastırıldı", 9 Kasım ihbarı,
ertelenen iş emri, 15 Kasım kart değişimi).

**INV_DIL — Delil dilekçesi (CMK 177; 3 talep):** sinyal kayıtları, UEDAŞ, EDR, boya incelemesi, ATK ayrıntılı rapor;
çeldiriciler sabıka kaydı ve keşif.

**INV_CIKARIM — Tahta (6 tarif + 3 çeldirici):** fren izi + ABS; cam + sağlam farlar; 56 cm + 44 cm; sinyal başlığının arkası
+ Necati'nin yeri; kabin etiketi + iş emri; titreme + UEDAŞ. Çeldiriciler: çiçekler, yağmur, yorgunluk.

**Akşamlar:** INV_AKSAM1 — Gül arar: bebeğin adı (Deniz'in fikrini sorar; seçim yalnızca iç sese yansır). INV_AKSAM2 —
Serkan saygıyla görüldüyse büronun önünde bekler ("Yarın mahkemede annemin adını söylerken düzgün söyleyin."); değilse Leyla
ile kısa bir sahne.

**INV_GECE — Duruşmadan önceki gece (~450):** Deniz panoyu toplar; elindekiler koşullu satırlarla sayılır. Volkan'dan mesaj:
"Yarın kabul edeceğim. Gül'e söylemeyin." Seçim: aramak ve konuşmak (doğru; karar onun ama bilgilendirilmiş olsun) / yazıp
"sabah konuşuruz" / görmezden gelmek.

### Bölüm 3 · İKİNCİ CELSE (2. celse, ~2.400; ayrıca H1_00B iddianame, H1_04V sanığın diyeceği, H1_05R kısa ara, H1_08 merdivenler)
- H1_00K koridor: Volkan kararsız. Seçim: "Ne hatırlıyorsan onu söyle; bilmediğini bilmiyorum de" (doğru) / "Susma hakkını
  kullan" (meşru, nötr) / "Kabul et, indirim alırız" (yanlış: `kabul_tavsiye`; bu durumda H1_01'de Volkan kusurunu kabul
  eder; terditli yol kalır, beraat zorlaşır).
- H1_00 açılış (Mübaşir Şükrü: "Volkan Eren dosyası!"), H1_01 sanık savunması (güvene ve tavsiyeye göre üç ayrı metin),
  H1_02Q sanığa sorular (bilgi veren soru +, tahmine zorlayan −), H1_03 katılan vekilinin telkinli sorusu ("Telefonla
  konuşuyordunuz, ekrana bakıyordunuz, değil mi?") — itiraz (CMK 201/1), H1_04 Serkan'ın beyanı (sus ve saygı göster /
  "duygusal" diye itiraz et: −), H1_05 **Necati'nin çapraz sorgusu** (N1 kırk yıllık şoför · N2 "kırmızıda geçti" · N3 "gümbürtüyü
  duyunca baktım" · N4 "başka araç yoktu" · N5 "telefonla konuşuyordu"; ded_goremez / ded_ariza / büfe kaydı / multimedya;
  kanaat itirazı), H1_06 bilirkişi raporu: CMK 67/5 itirazı ve yeni heyet + ATK + EDR talebi (doğru) / "rapor yok sayılsın"
  (dayanaksız) / sustur, H1_07 ara karar: talepler, erteleme (üç hafta), adli kontrol (taşıt yasağının kaldırılması talebi:
  meslekî zorunluluk, CMK 109/5).
- Necati kırılırsa: "Ben… benim önümdeki lamba kırmızıydı. Onunkini… görmedim. Görmüş gibi oldum." Salon uğuldar.

### Bölüm 4 · ARA (~2.400)
- ARA_GIRIS: üç haftalık erteleme; gelen raporlar koşullu (EDR, boya, ATK).
- ARA_EDR (belge): 38 km/s, fren 1,2 sn önce, ABS aktif, darbe ivmesi düşük → hız ve dikkatsizlik iddiası çöker.
- ARA_HEYET (belge, 1. gün sonunda gelir): "sinyal arızası nedeniyle kırmızı ışık ihlali atfedilemez", "fren izi sanığın
  aracına ait değildir", ama "sürücü yağışlı havada kavşağa yaklaşırken hızını yeterince azaltmamıştır: tali kusur" — Deniz bu
  paragrafın EDR ile çeliştiğini bulur (`contra_heyet`).
- ARA_AYTEN (vicdan): dolaptaki cam parçası. Seçim: "Savcılığa teslim et, tutanakla" (doğru) / "Bana ver" (−, zincir
  bozulur) / "Kimseye söyleme" (parça kaybolur).
- ARA_SANAYI (yalnızca `ded_arac` sonrası): Deniz Kestel'e bir yedek parçacının kataloğu için gelir (o model aralığının
  tampon ölçüsü, bilirkişiye soracağı soru). Dönüşte kaldırımdan geçerken kaporta dükkânının önünde yeşil boya tozu, yeni
  stop lambası kutusu, aralık garaj kapısı görür. Kimseyi sorgulamaz. Seçim: "Bir şey lazım değil" de, köşede not al
  (doğru; savcılığa bildirilecek) / ustaya panelvanı sor (etik hata: soruşturma savcılığın, soru uyarı olur) / arka garaja
  izinsiz girip fotoğraf çek (etik ihlal; disiplin epilogu, kürsüde çürütülemezse ETIK sonu).
- ARA_SUC: suç duyurusu (dayanaklı: boya + kamera + kırık stop + düzeltilmiş saat; kaporta işyerlerinin araştırılmasını
  savcılıktan iste; sanayi notu varsa blok numarasıyla bir satır / dayanaksız "başka bir araç olmalı" −).
- ARA_VOLKAN: kızları doğmuştur (Ela). Volkan: "Ona bir yalanla bakamam." Ek savunmaya hazırlık: doğruyu söylemesini
  öğütlemek.
- ARA_SERKAN (saygı yolunda): annesinin 01.05 sesli mesajını dinletir; Serkan'ın kendi kararıyla savcılığa teslimi (doğru)
  / Deniz'in telefonu alıp kopyalaması (−).
- ARA_HAMDI: müdürü baskı yapıyor; Deniz yalnızca "mahkeme sizi çağıracak, gördüğünüzü anlatın" der.
- ARA_CIKARIM: ATK + sırt sıyrıkları → ölüm ilk darbeden; boya modeli + tek stop → koyu yeşil hafif ticari araç.
- ARA_SON: gece; Deniz'in elindekiler; Leyla: "Yarın iki şey kanıtlayacaksın ya da bir şeyi şüpheye düşüreceksin. Hangisini
  seçtiğini bil."

### Bölüm 5 · ÜÇÜNCÜ CELSE (3. celse, ~2.500; ayrıca T_00Y sabah, T_00S sanığın diyeceği, T_05N heyet başkanı, T_09R cevaplar)
- T_00K koridor: Gül bebek arabasıyla; Serkan uzakta. T_00 açılış: raporlar okunur; suç duyurusu dayanaklıysa savcı
  "Altın Başak Fırını'na ait panelvan ve sürücüsü Tarık Sezer hakkında ayrı soruşturma; araçta onarım ve boya eşleşmesi"
  bildirir (`ev_savcilik`).
- T_01 **Hamdi** (H1 "sistem sağlamdı" · H2 "kayıtta arıza yok" · H3 "kart rutin bakımda değişti" · H4 "ihbarı ben görmedim"):
  sinyal günlüğü, ded_ariza, sesli mesaj; Hamdi kırılır: "Çatışma uyarısı bastırılmıştı. Ben yazdım. Okumadılar."
- T_02 savcının sorusu (telkin itirazı ya da sessizlik).
- T_03 **Müh. Cengiz Ateş** (C1 "kırmızı ışık sabittir" · C2 "18 m iz 68 km/s" · C3 "başka araç izi yok" · C4 "sağ ön köşesiyle
  çarptı"): sinyal günlüğü / heyet; ded_fren / EDR; ded_cam / tutanak; ded_yukseklik / araç fotoğrafları.
- T_04 Ayten'e sorular (cam kırıkları, emanet, parça).
- T_05 EDR/ATK tartışması (A–D).
- T_06 mütalaa (savcı delile göre: beraat / basit taksir / bilinçli taksir) ve cevap.
- T_07P dayanaklar (en çok üç; ispatlanmış +, ispatlanmamış −) → T_07 esas savunma (223/2-b illiyet / 223/2-e şüphe / terditli
  basit taksir / duygusal), 3–5 satırlık konuşma → T_08 son söz (Volkan) → T_09 hüküm.

## 5. Sonuç başına epiloglar (~300–450 sözcük)

- **BERAAT_B (223/2-b):** "Türk Milleti adına…" Volkan ilk kez başını kaldırır. Koridorda Serkan durur, bir şey söylemez,
  başıyla selam verir; savcının dosyasında başka bir isim vardır. Adliye önünde yağmur durmuştur. Gül bebeği Volkan'ın
  kucağına verir: "Tut. Ellerin temiz." Büroda Leyla açılmamış sigara paketini çekmeceye kaldırır. Son kart: "Tarık Sezer
  hakkında taksirle öldürme ve yardım etmeme suçlarından kamu davası açıldı."
- **BERAAT_E (223/2-e):** Beraat, ama koridorda katılan vekilinin fısıltısı: "Şüpheden." Volkan: "Ben hâlâ hissediyorum
  avukat hanım." Deniz: "Hissettiğin, olan değil." Panelvanın kim olduğu dosyada bir soru işareti olarak kalır (suç duyurusu
  yapılmışsa soruşturma sürmektedir); savcılık yazısı dosyaya girdiyse bir ad vardır ve o ad "başka bir dosyanın kapağında"dır. thought: "Bazen adalet bir kapıyı açar ama ışığı yakmaz. Bu sefer en azından kırmızı
  değildi."
- **INDIRIM (basit taksir, 50/4):** Hapis yok; para cezası ve ehliyet. Volkan rahatlamaz: "Demek ki biraz öldürdüm."
  Deniz'in cevabı yok. Gül klasörü kapatır. thought: "Kazanmak buysa, neden bu kadar ağır?"
- **BASIT_HAPIS (basit taksir, çevirme yok):** "Basit taksir" denince salonda bir şey gevşer, "çevrilmesine yer olmadığına"
  denince yeniden gerilir. İki yıl bir ay. Volkan: "Yeşildi dedim. Kabul ettiler. Yine de içerideyim." Gül istinafı sorar.
  Leyla: "Hâkime bir çerçeve verdin, içini doldurmadın." thought: "Hâkim ışığı yeşil saydı, hızı düşük saydı. Sonra sordu:
  başka ne var?"
- **MAHKUMIYET:** Volkan'ın elleri; bebek arabası koridorda. Serkan da rahatlamaz. thought: "Bir kadın öldü, bir adam ceza
  aldı. Teraziyi dengeli sanan herkes yanılıyordu; ben de." Çöküşte savcının cümlesi: "İyi bir avukat olacaksınız. Bugün
  değil."
- **ETIK (garaj + çürütülemeyen kırmızı ışık):** Garaj fotoğrafı hukuka aykırı delil sayılır ve dışlanır; mahkeme
  hukuka uygun delilleri ayrıca tartar ve dosyada kırmızı ışık tespitiyle çelişen hukuka uygun delil (heyet raporu, sinyal
  kaydı + sesli mesaj) olmadığı, hız iddiası da yıkılmadığı için mahkûm eder. Rüstem'in şikâyeti,
  baroya bildirim. Leyla meslek kuralları kitapçığını masaya bırakır ve hiçbir şey söylemez. Panelvan o hafta hurdaya
  çıkarılmıştır.
- **Disiplin epilogu (garaj + başka sonuç):** Garaja girilip dava hukuka uygun delillerle kazanılır ya da indirim alınırsa
  hüküm değişmez; gerekçeye "fotoğraflar hükme esas alınmamıştır" eklenir. Ertesi sabah şikâyet ve baro bildirimi; Leyla'nın
  kırmızı kitapçığı. "Mahkeme o fotoğrafları yok saydı. Ama ben o garaja girdim."
