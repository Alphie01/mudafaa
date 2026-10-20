# Dava #09 — Sahte İmza · Hikâye Kitabı (noir)

> Bu belge Dava #09'un **anlatı çıtasıdır**; kod bu belgeden sonra yazıldı. Hukuki gerçek, delil zinciri, sonuç
> koşulları ve puan mantığı `docs/content/sahte-imza.md` ve `docs/legal/sahte-imza.md`'dedir; bu belge onları sahneye
> çevirir. Referans: Dava #07 v2 (`docs/content/gece-bekcisinin-sirri-hikaye.md`).

## 0. Ton ve kurallar

- **Noir dram.** Bursa, eylül sonundan kasım başına. Sonbahar yağmuru, Kayhan'ın dar sokakları, mürekkep ve toner
  kokusu, tapu dairesinin numaratör sesi, huzurevinin dezenfektan kokusu. Kuru, seyrek mizah.
- **Davanın imgesi kâğıttır.** Bir matbaacının sahtecilikle suçlanması dosyanın ironisidir: "Kâğıt yalan söylemez"
  diyen adamın imzası, kâğıt üstünde ona karşı tanıklık eder. Deniz'in iç sesi bu imgeyi taşır: mürekkep, ıslak imza,
  sayfanın arkasına geçen basınç, fotokopinin kaybettiği ayrıntı.
- **İç ses.** Deniz `style: "thought"` ile birinci tekil, kısa ve keskin cümlelerle düşünür. Gözlemler, sezer; çözümü
  söylemez. Örnek: *"Bir imza, insanın kâğıda bıraktığı en kısa itiraftır. Ya da en kısa yalan."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numaraları yalnızca Leyla'nın kısa açıklamalarında, seçenek geri
  bildirimlerinde, rapor ve hüküm metinlerinde, duruşmanın resmî dilinde geçer. Deniz mahkemede hukuk dili kullanır;
  büroda ve sokakta insan gibi konuşur.
- **Gizem korunur.** Soğuk açılışta konuşanlar isimsizdir (`speaker: "narrator"`, `name: "KEPLİ ADAM"`, `"GİŞE"`,
  `"ALICI"`). Tarık'ın fail olduğu, oyuncu delilleri kendisi birleştirmeden **hiçbir yerde söylenmez ve güçlü biçimde
  ima edilmez**. Tarık, ilk evrede yardımsever, yorgun, sevilen yeğendir. Onu işaret eden her bilgi (solaklık, telefon
  numarası, borç, teslim tutanağı) ancak oyuncu önceki halkayı bulduktan sonra açılır.
- **Kırmızı ringa balıkları:** Nermin (evi isteyen, şikâyetçi kız kardeş), Erol (ucuza alan, tefeci emlakçı), Emre
  (gece gizlice baskı yapan çırak) ve matbaanın kendisi (kaşe makinesi, lazer yazıcı). Her biri adil biçimde
  şüphelendirir ve adil biçimde temizlenir.
- **Etik çizgi.** Deniz tanıklara telkinde bulunmaz, kimseye baskı yapmaz, demansı olan Hayriye Hanım'a hiçbir şey
  imzalatmaz, şüpheliyi kovalamaz, onunla yüzleşmez; bulduğunu savcılığa bildirir. Çırak Emre'ye "o gün dükkândaydın
  de" demek yalan tanıklığa azmettirmedir ve davanın etik sonudur.
- **Satır kuralları:** satır ≤ 220 karakter; her yeni mekânın ilk satırı `style: "card"` + `bg`; sert anlarda `fx`.
- **Sözcük bütçesi:** tipik yol (BERAAT_E) 13–16 bin sözcük (`case:duration`), ≥ 200 aksiyon, 90–120 dk; paket ≥ 18 bin.

## 1. Logline ve tema

- **Logline:** Kırk dokuz yaşındaki matbaacı Vedat Ateş, demanslı annesinin Hisar'daki evini sahte bir noter
  suretiyle satmakla suçlanıyor. Tapu senedinde onun adı, kimliği ve "imzası" var. Genç avukat Deniz Arslan, bir
  imzanın kime ait olduğunu kanıtlamaya çalışırken, ailenin içindeki en sessiz kişiye ulaşır.
- **Tema / dramatik soru:** *Bir insanı ne tanımlar: imzası mı, yaptıkları mı?* İkinci soru: *Sevdiğin birini
  koruduğun için mi susarsın, yoksa ondan korktuğun için mi?*
- **Ana mekânlar:** Arslan Hukuk (gece), Ateş Matbaası (Kayhan), Hisar'daki boş aile evi, Çekirge'deki huzurevi,
  Bursa 14. Noterliği, Osmangazi Tapu Müdürlüğü, Mudanya'daki eczane, Erol'un emlak bürosu, Bursa 7. Asliye Ceza
  Mahkemesi.

## 2. Kadro: sesler, sırlar, yaylar

| Kimlik | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **deniz** (oyuncu) | 31, büroda üçüncü yıl. | İçeride alaycı ve keskin, dışarıda nazik ve inatçı. | Geçen yıl kaybettiği dosyanın yükü (Dava #07 ile ortak). | "Kâğıdın ne dediği" ile "insanın ne yaptığı" arasındaki farkı öğrenir. |
| **leyla** (mentor) | 58, büronun kurucusu. | Az konuşur, her cümle bir ders; kalemini çevirir. | Masasındaki ters çerçeve (Dava #15 tohumu; yalnızca bir kez ima). | Deniz'i izler, kurtarmaz. Etik çizgide sert. |
| **vedat** (müvekkil) | 49, Ateş Matbaası'nın sahibi; babasından kalma kurşun dizgi makinesini hâlâ çalıştırır. Adli kontrolle serbest. | Usta ağzı; kâğıt ve mürekkep benzetmeleri ("Her kâğıdın bir sesi vardır"). Kısa, gururlu; suçlanınca parlar, sonra utanır. **Sağlak.** | 2024 bayramında annesinden evi satmasını istemiş, kavga çıkmıştı (savcılığın sebep teorisi). Bunu ilk görüşmede saklar. İrsaliyeleri çoğunlukla başkalarının imzaladığını söylemek istemez: "Dükkândakiler benim çocuklarım." | İnkâr → öfke → ihanetin farkına varış. Son sözde "imza" ile "isim" arasındaki farkı söyler. |
| **sevgi** (eş) | 46, ilkokul öğretmeni. Dosyayı büroya o getirir. | Düzenli, pratik, hep "biz" der; sınıfta konuşur gibi madde madde anlatır. | Bir aile yemeğinde Tarık'ın telefonuna gelen bahis sitesi mesajlarını görmüş, Vedat'a söylememiş. Yalnızca oyuncu somut bir halka bulduktan sonra (ara evre) anlatır. | Sabır → kırılma → suçluluk ("Söyleseydim…"). |
| **tarik** (yeğen, gerçek fail) | 41, Vedat'ın rahmetli ağabeyi Halit'in oğlu; on dört yıldır matbaada, dijital baskı odasının sorumlusu. **Solak.** | Alçak sesli, kibar, yardımsever; kısa cümleler; çay ikram eder; "amcam" der, gözünü kaçırır. Yardımsever: "Ne lazımsa." (Aynı cümleyi Emre de kurar; anlatı bu yardımseverliği hiçbir yerde şüpheli diye işaretlemez.) | Çevrimiçi bahis borcu (Erol'un çevresine ~1,4 milyon TL). Hayriye'nin vekâletnamesini 2023'te "saklamak için" taramıştı; sahte sureti gece matbaada bastı, amcasının kimliğini ceketinden aldı, kep ve gözlükle tapuya girdi, amcasının imzasını yıllardır irsaliyelerde attığı gibi attı. Kolluğa "mukayese için amcamın imzaları" diye kendi attığı irsaliyeleri teslim etti. | Sevilen yeğen → (oyuncu kazanırsa) kürsüde susan adam. Kovalanmaz; çözülmez; sadece susar. Son cümlesi: "Sen hep kâğıda inandın amca." |
| **emre** (çırak) | 19, meslek lisesi son sınıf, öğleden sonra matbaada. | Argo, hızlı, kaygılı; "abi", "valla", "yani şey". | Geceleri patrondan habersiz düğün davetiyesi basıp para kazanıyor; bu yüzden gece erişimi hakkında yalan söyler (kırmızı ringa). 18 Şubat sabahı okuldaydı. | Korku → güven. Güvendiğinde "dükkânda solak kim" sorusunu yanıtlayan kişidir. |
| **hayriye** (mağdur) | 82, evin sahibi; orta evre Alzheimer, Çekirge'de huzurevinde. | Eski Bursa ağzı; geçmişle bugünü karıştırır; Deniz'e "kızım" der; aklı berrak anlarında keskin. | Berrak bir anında "Halit'in oğlu kâğıtlarımın resmini çekerdi, bankaya diye" der; bu satır ancak oyuncu Tarık'a giden bir halka bulduktan sonra açılır. | Davanın sessiz merkezi: evini kaybettiğini bilmez. |
| **nermin** (kız kardeş, vasi, şikâyetçi) | 54, Mudanya'da eczacı; annesinin vasisi. | Keskin, alaycı, yorgun; "kardeşim" sözcüğünü bıçak gibi kullanır. | Erol Kasım 2025'te evi 2,1 milyona ona teklif etmişti; reddetti. Huzurevi masrafının çoğunu o ödüyor; evin satılmasını o da istiyordu ama "doğru fiyata". | Düşmanlık → kuşku → (BERAAT_B'de) yıkım: Tarık'ı küçükken o da büyütmüştü (Halit 14 yıl önce öldüğünde Tarık 27 yaşındaydı). |
| **erol** (alıcı, savcılık tanığı) | 58, Kılınç Gayrimenkul; tefecilik yapar. | Pürüzsüz, "hacı", "abi", para atasözleri; altın zincir, cilalı ayakkabı. | Tarık'ın alacaklısıdır; evi borca mahsupla ucuza aldı. Tapudaki adamın Vedat olmadığını sezdi ama sormadı. | Kayıtsızlık → kaçamak → kürsüde mahsup itirafı. |
| **gulten** (tapu memuru, savcılık tanığı) | 44, Osmangazi Tapu. | Bürokratik, savunmacı; "Sistem onay verdi" der. | Günde altmış işlem; kepli adamın kalemi sol eline aldığını hatırlar ama kimse sormamıştır. | Prosedürün arkasına saklanan dürüst bir memur. |
| **sinan** (kurye, mazeret tanığı) | 31, kargo kuryesi. | Geveze, sıcak; insanları paketlerinden hatırlar ("Ben insanı koliden tanırım"). | Yok. Kimse ona sormamıştır. | Ara evrede bulunursa ikinci celsede mazereti taşır. |
| **bulent** (noter kâtibi) | 60, Bursa 14. Noterliği'nde otuz yıl. | Titiz, kuru, "usul" sözcüğüne âşık. | — | Noter işlemlerinin dersini verir. |
| **fikriye** (Hisar'da komşu) | 74 | Pencereden her şeyi gören komşu; "evladım". | — | "Beyaz bir Doblo" ve "Vedat'ın arabası değildi" ayrıntısı. |
| **hakim** Selma Akgün | Bursa 7. Asliye Ceza hâkimi (tek hâkim). | Resmî, sabırlı, kısa. | — | — |
| **savci** Orhan Bilgiç | 45 | Metodik, kuru, adil; doğru delil karşısında görüşünü değiştirir. | — | — |
| **katip** Melek, **mubasir** Kâzım | — | Kâzım her çağrıyı iki kez söyler. | — | — |

## 3. Gerçek ve kronoloji

| Tarih / saat | Olay | Kim biliyor | Oyuncu nasıl öğrenir |
|---|---|---|---|
| 10.05.2023 | Hayriye, Bursa 14. Noterliği'nde Vedat'a **sınırlı** genel vekâletname verir (yevmiye 08817): banka, emekli maaşı, kira tahsili, abonelikler. Satış yetkisi yok. Tarık arabayla götürür, vekâletnameyi matbaada tarar. | Vedat, Tarık, Bülent | Noter arşivi (INV_NOTER), suret incelemesi |
| Haziran 2024 | Bayramda Vedat, borçları için evin satılmasını ister; Hayriye reddeder; Nermin annesinin yanında durur. | Aile | Vedat görüşmesi (sert ton), Nermin; savcının sebep teorisi |
| 2025 | Hayriye'ye Alzheimer tanısı; eylülde huzurevine taşınır; Hisar evi boş. | Aile | Brifing, huzurevi |
| Kasım 2025 | Erol evi Nermin'e 2,1 milyona teklif eder; Nermin reddeder (piyasa ~3,5 milyon). | Nermin, Erol | Nermin (ara evre) |
| Ocak 2026 | Tarık'ın bahis borcu Erol'un çevresine 1,4 milyonu bulur; Erol'a "evi ucuza alırsın, amcamın vekâleti var" der. | Tarık, Erol | Ara evre: Erol'un mahsup itirafı, Sevgi |
| 06.02.2026 02.14 | Matbaanın renkli lazer yazıcısında 90 gr kâğıda 2 sayfalık iş, kullanıcı **MATBAA-PC**. Sahte "aslı gibidir" suret. Noter mührü toner baskısı. | Tarık | Matbaa araması (yazıcı günlüğü), suret incelemesi (toner mühür) |
| 09.02.2026 | Erol'un bürosunda "Hayriye Ateş vekili Vedat Ateş" adına 50.000 TL **kapora makbuzu** imzalanır (özel belge). | Tarık, Erol | Dosyada var; Erol'un ifadesi |
| 10.02.2026 10.12 | ALO 181'den tapu randevusu: 18 Şubat 11.15, satış; arayan numara 0532 418 77 47 (**Tarık'ın**). | Tarık | Ara evre: randevu kaydı (delil talebiyle) + matbaa telefon listesi → tahta |
| 17.02.2026 akşam | Vedat'ın kimliği askıdaki ceketinin iç cebinden alınır. | Tarık | Vedat görüşmesi; matbaa (askı) |
| 18.02.2026 09.52 | Vedat, Sevgi'ye yazar: "Kimliğimi bulamıyorum, ceketi de aradım." | Vedat, Sevgi | Sevgi'nin mesaj ekran görüntüsü (Vedat 2. görüşme / Sevgi) |
| 18.02.2026 11.06 | Tapu çağrı merkezi randevu teyidi için 0532…47'yi arar; 41 sn görüşme. | Tarık | Randevu kaydı (ara evre) |
| 18.02.2026 11.19–11.37 | Kurye Sinan matbaada; Vedat kolileri birlikte bantlar, el terminaline 11.37'de imza atar. | Vedat, Sinan | Matbaa takvimi ("Termal broşür · kargo 11.30") → kargo kaydı → Sinan |
| 18.02.2026 11.22–11.24 | Osmangazi Tapu: kepli, gözlüklü, atkılı bir adam "Vedat Ateş" olarak kimlik ve sahte sureti verir; Gülten yevmiye numarasını sorgular ("kayıt mevcut, iptal yok"), içeriği karşılaştırmaz; fotoğraf 11.22; senet 11.24. Adam kalemi **sol eline** alır. İmza sağa sıvanır. | Tarık, Erol, Gülten | Soğuk açılış (isimsiz), senet incelemesi (sıvanma), Gülten'in bastırılması |
| 19.02.2026 08.10 | Vedat kimliğini ceketinin iç cebinde bulur. | Vedat | Vedat görüşmesi |
| 03–04.03.2026 | Nermin evde yeni kilitler görür; e-Devlet'te satışı öğrenir; şikâyet eder. | Nermin | Brifing |
| 20.03.2026 | Kolluk matbaadan mukayese belgesi ister; Vedat hastanede annesinin yanındadır; **Tarık** 14 irsaliye ve 6 kargo fişini teslim eder. Dosyadaki tutanak faks kopyasıdır; teslim edenin adı okunmaz. | Tarık | Rapor incelemesi (okunmayan ad) → delil talebi → tam tutanak (2. celse) |
| 02.04.2026 | Grafolog Faruk Demirtaş: senetteki imza ile mukayese belgelerindeki imzalar "aynı elin ürünü". | — | Bilirkişi raporu |
| 07.05.2026 | İddianame: TCK 204/1 (sahte resmî belge düzenleme ve kullanma). | — | Brifing |
| 14.10.2026 | 1. celse. | — | Bölüm 3 |
| 04.11.2026 | 2. celse ve karar. | — | Bölüm 5 |

## 4. Yapı ve node haritası

```
PR_00 Soğuk açılış (18 Şubat 11.20, Osmangazi Tapu; KEPLİ ADAM / GİŞE / ALICI) → PR_01 (19 Şubat matbaa · 3 Mart Hisar · 7 Mayıs)
BR_00 Bölüm 1 · Sevgi büroda (söz / dinleme / ücret) → BR_01 Leyla: suç ve ceza aralığı (A–D) → BR_01B resmî mi özel mi (A–D)
  → BR_02 Dosya + strateji → INV_SABAH Matbaa sabahı (Vedat, Tarık, Emre ilk kez)
INV_HUB Bölüm 2 · SORUŞTURMA (4 gün × 4 EP; Leyla'ya danış günde 1, 0 EP; çıkarım tahtası 0 EP)
  Olay yeri: INV_ARAMA_M (matbaa) · INV_HISAR (komşu) → INV_ARAMA_H (Hisar evi)
  Kişiler: INV_VEDAT (görüşme, zincir girişli) · INV_TARIK · INV_EMRE · INV_NERMIN · INV_EROL · INV_HAYRIYE
  Arşiv: INV_SURET · INV_SENET · INV_RAPOR · INV_IRSALIYE (belge) · INV_NOTER · INV_TAPU · INV_DIL (dilekçe) · INV_CIKARIM (6+ tarif)
  Gün sonu: INV_DAY_END → INV_AKSAM1 (Leyla) / INV_AKSAM2 (tehdit ya da Sevgi) / INV_AKSAM3 (Tarık börekle gelir: sır saklama)
INV_GECE_* zinciri → INV_GECE (duruşmadan önceki gece)
C1_00K koridor → C1_00 açılış → C1_01 sanık savunması → C1_02Q sanığa sorular → C1_03 savcının sorusu (itiraz)
  → C1_04 Gülten (G1–G5 + G3_EK; bastır/sun/itiraz) → C1_05 bilirkişi raporu (A–D) → C1_06 delil talepleri → C1_ARA erteleme
ARA_GIRIS → ARA_HUB Bölüm 4 · ARA (3 gün × 3 EP; yığınsız)
  ARA_KARGO (belge) · ARA_SINAN · ARA_RANDEVU (belge) · ARA_SEVGI · ARA_EMRE (etik tuzak) · ARA_NERMIN · ARA_HAYRIYE
  ARA_EROL (sahne: emlak bürosu) · ARA_SUC (suç duyurusu) · ARA_TARIK (gece matbaa: kovalama yok) · ARA_CIKARIM · ARA_LEYLA
  ARA_DAY_END → ARA_AKSAM_* · ARA_SON_* → ARA_SON
C2_00 açılış (ara karar cevapları) → C2_01 Sinan (doğrudan soru, telkin tuzağı) | C2_01Y boş kürsü
  → C2_02 Erol (E1–E5 + E1_EK) → C2_03C Tarık'a çekinme hakkı (A–D) → C2_03 Tarık (T1–T5) ⇄ C2_03H susuş
  → C2_04 yeni rapor (A–D) → C2_05 mütalaa → C2_06P dayanaklar → C2_06 esas savunma → C2_07 son söz → C2_08 → R_KARAR + epilog
C2_COKUS (güvenilirlik 0) → C2_08
```

Celseler: `cs_1` (1. celse: açılış, sanık savunması, tanık, delil tartışması) ve `cs_2` (2. celse: açılış, tanıklar,
delil tartışması, mütalaa, savunma, son söz, karar). Mahkeme asliye cezadır: kürsüde tek hâkim, savcı ve kâtip.

## 5. Sahne sahne (tipik yol sözcük bütçesiyle)

> Bütçeler tipik yol içindir (± %20). Örnek satırlar tonu tarif eder.

### PR_00 — Soğuk açılış · "18 ŞUBAT · 11.20" (~500) · bg: adliye (tapu salonu)
- card: "18 ŞUBAT · 11.20 — OSMANGAZİ TAPU MÜDÜRLÜĞÜ". Numaratör sesi; ıslak şemsiyeler; floresan.
- Kepli, gözlüklü, boynunda gri atkı olan bir adam (KEPLİ ADAM) gişeye gelir. GİŞE (kadın, yorgun): "Adınız?"
  "Vedat Ateş." Kimlik kartı tezgâha kayar. Bir suret: "Aslı gibidir."
- GİŞE ekranda yevmiye numarasını sorgular: "Kayıt mevcut. İptal yok." Sureti okumaz; okumaya vakti yoktur.
- "Fotoğraf için kepinizi alır mısınız?" — "Soğuk aldım, başım üşüyor." Flaş (`fx: flash`). Kep kalır.
- Kalemlik gişenin sağındadır. Adam kalemi alır, bir an durur; "Zincir gerildi." (El değişimi gösterilmez; zincirin
  neden gerildiği ancak Gülten'in G3 bastırmasında anlaşılır.) İmza. Islak mürekkep.
- ALICI (pürüzsüz erkek sesi): "Hayırlı olsun." Dışarıda yağmur. ALICI: "Hesap kapandı. Bir daha karşıma çıkma."
  KEPLİ ADAM: "Çıkmam." Sonra yalnızca yağmur.
- narrator: "Senette bir isim vardı. İsim doğruydu. İmza, kâğıda düştüğü anda birinin elinden çıkmıştı. Kimin
  elinden çıktığını, o gün kimse sormadı." `fx: fade`

> İsim söylenmez, ses tarif edilmez, aile bağı ima edilmez. "Öbür el" gözlemi adil bir tohumdur; kimi gösterdiği
> ancak dördüncü halkada (Emre) anlaşılır.

### PR_01 — "19 ŞUBAT / 3 MART / 7 MAYIS" (~350) · bg: sokak_sabah → ev → siyah
- Matbaa, sabah 08.10: Vedat ceketinin iç cebinde kimliğini bulur. "Buradaymış. Dün bütün dükkânı aradım." Kimse
  cevap vermez; kurşun dizgi makinesi tıkırdar.
- Hisar, 3 Mart: Nermin kilitli kapının önünde. Anahtarı uymaz. Telefonda e-Devlet. "Satılmış. Annemin evi… satılmış."
- 7 Mayıs: "İddianame. Sanık: Vedat Ateş. Suç: Resmî belgede sahtecilik."
- narrator: "Beş ay sonra, karısı bir avukat aradı."

### BR_00 — Bölüm 1 · DOSYA · "Sevgi Hanım" (~800) · bg: buro_gece
- card: "22 EYLÜL · 21.10 — ARSLAN HUKUK, BURSA". Yağmur camda.
- Deniz (thought): "Bursa'da sonbahar iki şey getirir: yaprak ve dosya. Yaprağı süpürürsün."
- Sevgi ıslak bir karton klasörle girer: iddianame fotokopisi, bilirkişi raporu, bir matbaa kartviziti. Aşağıda
  arabada biri onu bekliyor (bir korna, yanıp sönen farlar; "Yeğenimiz getirdi."). Deniz'in iç sesi arabayı dosyanın
  unsurları arasında saymaz; yeğen sıradan bir yardımsever akrabadır.
- Duygusal çekirdek: "Kocam ömrü boyunca kâğıt bastı avukat hanım. Şimdi bir kâğıt onu basıyor."
- Seçim (puan yok, ilişki etkisi): "Önce Vedat Bey'i dinlemem lazım" (dürüst, güven +) · "Kazanırız, merak etmeyin"
  (söz; Leyla uyarır; koridorda ve epilogda hatırlanır) · "Ücreti ve süreci anlatayım" (nötr).
- Leyla kapıda: "Bir imzanın kime ait olduğunu bilmek için önce kimin olmadığını bilmen gerekir."

### BR_01 — Leyla dosyayı devreder (~500) · A–D: suç ve ceza aralığı
- Doğru: TCK 204/1, iki–beş yıl. Leyla: "Suret noterin kendi düzenlediği senet değil; savcı 204/3'ü koymamış.
  Mütalaada hatırlarsa itiraz edersin." (Bu bilgi ileride değil, burada bir ders olarak kalır.)
- Yanlışlar: 207 (özel belge; suret resmîdir), 204/2 (kamu görevlisi değil), 158 (dolandırıcılık bu iddianamede
  yok; ayrı soruşturmada).

### BR_01B — "Resmî mi, özel mi?" (~350) · A–D
- Leyla dört kâğıdı masaya dizer: noter sureti, tapu senedi, kapora makbuzu, irsaliye. "Hangileri resmî?"
- Doğru: suret ve senet resmî; makbuz ve irsaliye özel (TCK 207 alanı). Ders: "Bilirkişinin karşılaştırdığı imzalar
  hangi kâğıttan geliyor, ona bak." (Rapor incelemesine adil bir tohum.)

### BR_02 — Dosya ekranı + strateji (~250)
- Masumiyet → "Cesur. Bir imzayı sahibinden ayırman gerekecek."
- Usul → "Raporun dayandığı kâğıtlar, raporun kendisinden zayıf olabilir."
- Terditli → "Güvenli. Ama Vedat Bey'e 'imzan değil ama ceza alabilirsin' demeye hazır mısın?"

### INV_SABAH — Ateş Matbaası sabahı (~350) · bg: depo
- card: "23 EYLÜL · 08.30 — ATEŞ MATBAASI, KAYHAN". Kurşun dizgi makinesi, toner kokusu.
- Vedat makinenin başında, ellerinde mürekkep. Tarık dijital odadan çay getirir: "Avukat hanım, şekerli mi?" Emre
  koli bantlar, kulaklık takılı. Hiçbiri öne çıkarılmaz; Tarık'ın satırı sıradan bir nezakettir.

### Bölüm 2 · SORUŞTURMA (INV_*), tipik yolda ~4.800
**INV_HUB** gün hedefleri: gün 1 "İmza kimin? Tapuda kim vardı?"; gün 2 "Suret nereden çıktı?"; gün 3 "Kâğıtların
kaynağı: rapor, irsaliye, noter"; gün 4 "Dilekçe günü: kimi ve neyi istiyorsun?".

- **INV_VEDAT — görüşme (~1.300) · bg: depo (matbaanın arka odası).** Konular: "18 Şubat" (sabah PTT, kimlik
  yok, kargo), "Kimlik" (ceketin iç cebi; askı; 19 Şubat'ta buldu), "Annem ve ev" (yumuşak: annesini anlatır; sert:
  2024 kavgası, sebep teorisi açığa çıkar), "İrsaliyeler" (yumuşak: "Kim dükkândaysa o imzalar"; sert: kızar).
  Bulguya bağlı konular: *Sağ mı sol mu?* (sıvanma bulunduysa; Vedat sağ elini gösterir), *Takvim* (takvim
  bulunduysa: "Termal broşür… kurye geldi, evet!"), *Yazıcı günlüğü* (gece işi bulunduysa: "Gece kimse kalmaz…").
  İkinci görüşme: Sevgi'nin mesaj ekran görüntüsü (18 Şubat 09.52).
- **INV_ARAMA_M — matbaa araması:** telefon listesi (altı numara, kimseyi öne çıkarmadan), askı (ceket), yazıcı
  günlüğü (06 Şubat 02.14, MATBAA-PC), duvar takvimi (18 Şubat "Termal broşür · kargo 11.30"), ters takılı makas
  (solak biri için; kimin olduğu söylenmez), kaşe makinesi (kırmızı ringa: savcının "araç" teorisi), irsaliye klasörü.
- **INV_HISAR + INV_ARAMA_H — Hisar evi (~500):** komşu Fikriye: "Vedat'ın arabası değildi; beyaz bir Doblo"
  (matbaanın Doblo'sunu herkes kullanır). Arama: boş "VEKÂLET" dosyası (asıl vekâletname yok), yeni kilit, Erol'un
  tadilat ruhsatı, aile fotoğrafı (Halit, Vedat, Nermin, küçük bir çocuk; çocuk yalnızca "ağabeyin oğlu" diye geçer),
  Hayriye'nin imza denemeleri defteri.
- **INV_TARIK (~350):** dijital odada; yardımsever; Nermin ve Erol'u işaret eder; "amcam o hafta çok yorgundu,
  unutkandı" (sinsi ama sıradan duyulur).
- **INV_EMRE (~350):** kaygılı; gece erişimi hakkında yalan söyler (gece davetiyeleri). Baskı yapılırsa kapanır.
- **INV_NERMIN (~450):** Mudanya eczanesi; öfke: "Ağabeyim değil, kardeşim; ama insan kardeşini de tanımaz."
- **INV_EROL (~350):** pürüzsüz, tehditkâr; ziyaret, ikinci gece tehdit telefonunu tetikler.
- **INV_HAYRIYE (~450):** huzurevi; dinlemek. Doğru yaklaşım: soru sormadan eşlik etmek. Yanlış: imza ya da ifade
  istemek (etik geri bildirim, güven −).
- **INV_SURET (belge):** UV: güvenlik kâğıdı yok; büyüteç: mühür toner noktalarından; karşılaştır: satış yetkisi
  satırının yazı tipi diğerlerinden farklı.
- **INV_SENET (belge):** büyüteç: vekil imzası sağa sıvanmış; büyüteç: işlem saati 11.24; karşılaştır: fotoğrafta
  yüzün üst yarısı kep ve gözlükle örtülü.
- **INV_RAPOR (belge):** karşılaştır: mukayese belgelerinin hepsi özel belge; büyüteç: teslim tutanağında teslim
  edenin adı okunmuyor (faks).
- **INV_IRSALIYE (belge, matbaa araması sonrası):** karşılaştır: iki farklı "V. Ateş" eli.
- **INV_NOTER (~400):** Bülent: arşiv nüshasında satış yetkisi yok; suretler güvenlikli kâğıda basılır; Şubat'ta
  suret verilmedi.
- **INV_TAPU (~300):** müdür yardımcısı: kayıtlar mahkeme yazısıyla; kamera kaydı 60 gün tutulur (silinmiş);
  randevular telefonla da alınır.
- **INV_DIL — delil dilekçesi (CMK 177), 3 talep:** yeni bilirkişi (resmî mukayese imzalarıyla); tapu randevu kaydı;
  kargo kaydı (takvim bulunduysa görünür); tam teslim tutanağı (okunmayan ad bulunduysa); çeldiriciler: Nermin'in
  HTS'si, Hayriye'nin tanık olarak dinlenmesi, Erol'un banka hesapları.
- **INV_CIKARIM — tahta:** (1) senet saati + takvim → kurye çelişkisi; (2) sıvanma + Vedat sağ el → solak imza;
  (3) toner mühür + noter arşivi → sahte suret; (4) özel mukayese + iki el → kirli mukayese; (5) kimlik ceketi + senet
  kimliği → kimlik alındı; (6) yazıcı günlüğü + toner mühür → suret matbaada basıldı; çeldiriciler: Doblo, tadilat
  ruhsatı, kaşe makinesi, aile fotoğrafı.
- **Akşamlar:** 1. gün Leyla ("Kâğıt yalan söylemez. Kâğıdı tutan el söyler."); 2. gün Erol ziyaret edildiyse gizli
  numara: "Bazı evler satılınca satılmış kalır avukat hanım." değilse Sevgi'nin telefonu; 3. gün Tarık büroya börekle
  gelir: "Nasıl gidiyor? Duruşma ne zaman?" (genel bir soru; mukayeseyi sormaz, eşikte duraksamaz) — dosyayı anlatmak sır saklama yükümlülüğünü ihlal eder (Av.K. 36), ikinci celsede Tarık
  hazırlıklı gelir.
- **INV_GECE (~400):** pano; kapının altından değil, telefonda bir mesaj: Sevgi'den "Vedat uyuyamıyor." Leyla:
  "Yarın tanık ne hatırlıyorsa onu sor. Ne hatırlamasını istediğini değil."

### Bölüm 3 · BİRİNCİ CELSE (C1_*), ~2.300 · bg: durusma_salonu
- card: "14 EKİM — BURSA 7. ASLİYE CEZA MAHKEMESİ". Kâzım iki kez çağırır.
- Koridor: Sevgi, Tarık (Sevgi'nin koluna girer), Nermin uzakta. Vedat'ın elleri mürekkepli: "Sabah makineye
  baktım. Elim titremesin diye."
- Sanık savunması: Vedat'ın kendi sesi; oyuncu yönlendirmez, yalnızca soru seçer (kimlik, 18 Şubat, irsaliyeler,
  hangi el, anne). Savcının sorusu: "Annenizden evi satmasını istediniz, değil mi?" — telkin itirazı ya da cevap.
- **Gülten'in çapraz sorgusu (doruk):** G1 kimlik, G2 sistem doğrulaması, G3 "imzayı önümde attı", G4 fotoğraf,
  G5 "bu salondaki sanık". Sıvanma bulunduysa G3 bastırılınca: "…Sol. Kalemi sol eline geçirdi. Kalemlik hep sağdadır."
  Sağlak sanık ve solak imza çıkarımıyla G3_EK çöker. Salon uğuldar; Vedat sağ elini masaya koyar, bakar.
- Bilirkişi raporu (A–D): doğru itiraz mukayese belgelerinin niteliğine ve kaynağına yöneliktir (CMK 63, 67/5).
- Delil talepleri, ara karar: üç hafta erteleme; adli kontrol sürer.

### Bölüm 4 · ARA (ARA_*), ~3.000
- ARA_GIRIS: koridorda yağmur; Tarık Sevgi'yi arabaya bindirir; Vedat: "Üç hafta daha bu adıyla yaşayacağım."
- **ARA_KARGO / ARA_SINAN:** kayıt geldiyse 11.19 varış, 11.37 imza; Sinan: "On sekiz dakika bekledim. Abi çay
  koydu, kolileri birlikte bantladık." Doğrudan davet (CMK 178) seçeneği.
- **ARA_RANDEVU (belge):** arayan numara 0532 418 77 47; teyit araması 11.06, 41 sn. Tahtada telefon listesiyle
  birleşince numaranın sahibi ortaya çıkar (oyuncu kurar; metin yalnızca "listede bu numaranın karşısında ne
  yazıyordu?" der).
- **ARA_SEVGI:** halka bulunduysa bahis mesajlarını anlatır; bulunmadıysa yalnızca Vedat'ın uykusuzluğunu.
- **ARA_EMRE:** solak imza çıkarımı varsa "Dükkânda solak kim?" → "Tarık abi. Makası bile ayrı." Gece erişimi;
  etik tuzak: "O gün dükkândaydın, Vedat abiyi gördün de" (TCK 272 + 38; etik sonu).
- **ARA_NERMIN:** sahte suret çıkarımıyla yumuşar; Erol'un Kasım teklifi; halka varsa "Tarık ocakta annemin tapu
  fotokopisini istedi."
- **ARA_HAYRIYE:** halka varsa berrak an: "Halit'in oğlu kâğıtlarımın resmini çekerdi."
- **ARA_EROL (sahne):** emlak bürosu: senet defteri, kapora makbuzunun karbon nüshası, takvimde "T. — mahsup".
- **ARA_SUC:** somut dayanaklı suç duyurusu (kimliği belirsiz kişi ya da somut halkalarla Tarık); dayanaksız
  suçlama (Nermin, Erol) iftira riskidir.
- **ARA_TARIK:** gece matbaada Tarık yalnız; doğru olan konuşmamak, savcılığa bildirmek; yüzleşmek ya da takip
  etmek kovalama sayılır.
- **ARA_SON:** duruşmadan önceki gece; kazanılan halkalar sayılır; Leyla: "Yarın birinin hayatı bozulacak. Ya
  müvekkilinin ya da başkasının. Kâğıtların sana hangisini söylediğini dinle."

### Bölüm 5 · İKİNCİ CELSE (C2_*), ~2.400
- Ara karar cevapları okunur. Sinan geldiyse kürsü; telkinli soru tuzağı.
- **Erol:** E1 "pazarlık Vedat'la", bastırılınca "Görüşmeleri yeğeni yaptı… Tarık." E2 kapora makbuzu; E3 nakit,
  bastırılınca "bir kısmı alacağa mahsup"; E4 randevu; E5 "kimliği vardı".
- **Tarık:** hâkim CMK 45'i hatırlatır; "Amcam için konuşurum." T1 "irsaliyeleri amcam imzalardı", T2 "belgeleri
  ben verdim", T3 "18 Şubat'ta İnegöl'deydim", T4 "kimliğine dokunmam", T5 "benim imzam bambaşka". Üç çelişkiden
  sonra: "Bundan sonra soru cevaplamayacağım." Vedat: "Tarık?" Tarık: "Sen hep kâğıda inandın amca." Kürsüden iner.
- Yeni rapor (A–D), mütalaa (savcı kazanılan halkalara göre beraat ister, takdire bırakır ya da mahkûmiyet ister),
  dayanaklar, esas savunma (3–5 satırlık konuşma), Vedat'ın son sözü.

### Epiloglar (her biri ~300–450 sözcük; `OutcomeDef.epilogue`)
- **BERAAT_B:** "Türk Milleti adına…" Yağmur dinmiştir. Vedat matbaanın kepengini kaldırır; Tarık'ın dijital
  odası boş, ters makas masada. Nermin kapıda: "O çocuğu küçükken ben de büyüttüm." Leyla: "Bazı davaları kazanırsın,
  bazılarını kazandığın için kaybedersin." Son kart: "Tarık Ateş hakkında soruşturma başlatıldı. Hayriye Ateş'in
  evi için tapu iptal davası açıldı."
- **BERAAT_E:** Beraat, ama koridorda bir fısıltı: "Sahtekâr ama kurtuldu." Kimin imzası olduğu belirsiz kalır.
  Tarık Sevgi'yi arabaya bindirir. Deniz'in iç sesi: "Bir imzayı sahibinden ayırdım. Ama kimin eline ait olduğunu
  bulamadım."
- **İNDİRİM:** Bir yıl sekiz ay, ertelendi. Vedat kepengi indirir: "Sicilime sahtekâr yazdılar." Zarar
  giderilmediği için hükmün açıklanması geri bırakılamadı.
- **MAHKÛMİYET:** İki yıl altı ay. Vedat kurşun dizgi makinesinin başında, son kez harfleri dizer: kendi adı.
  Çöküşte savcının cümlesi: "Kâğıtlarınız iyiydi avukat hanım. Elleriniz titredi."
- **ETİK (yalan tanık):** Emre kürsüde çöker; okul devam kaydı. "Avukat abla öyle dedi." Baro'dan bir zarf.
  Leyla hiçbir şey söylemez; masaya Avukatlık Kanunu'nu bırakır.

## 6. Ters köşeler ve ekilen ipuçları

1. **Soğuk açılış ve imza (1. celse):** İmzayı atan solaktır. Ekilen: prolog ("zincir gerildi"), senette sıvanma,
   matbaada ters makas, Vedat'ın sağ eliyle kalem tutması (INV_SABAH ve görüşme). Kapanış: Gülten'in G3 bastırması.
2. **Bilirkişi raporu doğru ama yanlış şeyi kanıtlıyor:** Senetteki imza ile mukayese belgeleri gerçekten "aynı
   el"dir; çünkü o belgeleri de fail imzalamıştır. Ekilen: BR_01B (resmî/özel ayrımı), Vedat'ın "kim dükkândaysa o
   imzalar" sözü, irsaliyelerde iki el, raporda okunmayan teslim eden adı.
3. **Telefon numarası (ara evre):** Randevuyu alan numara, matbaadaki telefon listesinde yazılıdır. Ekilen: liste
   1. evrede bulunur, anlamsız görünür.
4. **Kürsüdeki yeğen (2. celse):** Tarık kovalanmaz, çözülmez; susar. Bu sessizlik, delillerin yerine geçmez;
   BERAAT_B için belgeler ve yeni rapor gerekir.

## 7. Son yapı notu (kod yazıldıktan sonra)

Uygulama bu kitaptan şu noktalarda ayrıldı; ayrıntılar `docs/content/sahte-imza.md`'de:

- **Soruşturma 4 gün × 3 EP** (4 × 4 değil): on beş etkinlikten on ikisi seçilebilir; seçim baskısı oyunun bir parçası.
  Ara evre 3 gün × 3 EP, yığınsız.
- **Erken fail ipuçları nötrleştirildi:** ters makas dijital odadan ortak kesim masasına, gece baskısı ortak ve şifresiz
  bilgisayara taşındı; Emre'nin gizli gece davetiyeleri yazıcı günlüğüne bir çeldirici olarak eklendi. Tarık'ın solaklığı
  yalnızca `ded_solak` bulunduktan sonra (Emre), Hayriye'nin anısı ve Sevgi'nin bahis sırrı ancak Tarık'a giden somut bir
  halkadan sonra açılır.
- **Eklenen sahneler:** şikâyetçinin kürsüde beyanı (C1_03N), adliye çay ocağında Leyla'yla değerlendirme (C1_CAY), ikinci
  celsede on beş dakikalık ara (C2_TENEFFUS), duruşmadan önceki gece Vedat'ın telefonu (INV_GECE_6).
- **Sonuçlar:** ETIK (Emre'ye yalan söyletmek → kürsüde çöküş ve azil), COKUS (güvenilirlik 0, kesin Adli Tıp raporu
  yokken), BERAAT_B, BERAAT_E, UST_KURUL (kesin Adli Tıp raporu var ama savunma onu kürsüde öteki delillere bağlayamadı →
  çelişki için Adli Tıp kuruluna gönderme), INDIRIM, MAHKUMIYET. Gece matbaada Tarık'la yüzleşmek ayrı bir sonuç değil; Tarık kürsüye hazırlıklı gelir (T3X).
- **Mahkeme:** Bursa 7. Asliye Ceza, tek hâkim (Selma Akgün); hitap "Sayın Hâkim".
