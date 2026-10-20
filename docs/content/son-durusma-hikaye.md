# Dava #15 — Son Duruşma · Hikâye Kitabı (noir, dizi finali)

> Bu belge Dava #07 v2 hikâye kitabının (`docs/content/gece-bekcisinin-sirri-hikaye.md`) yapısını ve yoğunluğunu izler.
> Hukuki gerçek, delil zinciri, sonuç koşulları ve puanlar `docs/content/son-durusma.md`'de; madde doğrulamaları
> `docs/legal/son-durusma.md`'de. Kaynak: `content/src/son-durusma/` → `content/cases/son-durusma/`.

## 0. Ton ve kurallar

- **Noir dram, dizi finali.** Bursa ve Mudanya, şubat–mart; deniz tuzlu bir yağmur, iskelede sallanan lambalar,
  bir meyhanenin yarısı sönük neon tabelası: TOKER BAL K (I harfi yanmaz). Kuru, seyrek mizah. Her sahnede bir duyusal
  ayrıntı: kızgın yağ, bileği taşının hışırtısı, forkliftin geri vites bip'i, cezaevi koridorunda çamaşır suyu.
- **Dizi kapanışı.** On dört dava boyunca Leyla'nın masasında ters duran çerçeve bu davada çevrilir. Leyla'nın
  yirmi iki yıl önce bir müvekkiline "ikrar et, indirim alırsın" demesi (Dava #04'te anlattığı hikâye) bu davanın
  ahlaki eksenidir: aynı cümle bu kez Deniz'in önüne, başka bir ağızdan gelir.
- **İç ses.** Deniz `style: "thought"` ile birinci tekil şahıs, kısa ve keskin. Gözlemler, sezer; çözümü söylemez.
  - Örnek: *"Mudanya'da deniz gece de çalışır. Kıyıya ne getirdiğini sabah görürsün."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numarası yalnızca Leyla'nın kısa açıklamalarında, `quality.feedback`
  metinlerinde, rapor ve hüküm metinlerinde ve duruşmanın resmî dilinde (başkan, savcı, Deniz'in talepleri) geçer.
- **Gizem korunur.** Soğuk açılışta sesler isimsizdir (`speaker: "narrator"`, `name: "GENÇ BİR SES"`, `"BİR ADAM"`).
  Baş tanık Tarık Sezer'in fail olduğu hiçbir metinde söylenmez ya da güçlüce ima edilmez; oyuncu bunu ikinci celsede
  ifadesindeki çatlaklardan, ara evredeki kayıtlardan ve Leyla'nın eski dosyasından kendisi kurar. Erken ipuçları yalnızca
  ekilmiş ayrıntılardır (beyaz gömlek, erken gönderilen garson, "kamera arızalıydı" cümlesi).
- **Satır kuralları:** en çok ~220 karakter; yeni mekânda ilk satır `card` + `bg`; sert anlarda `fx` (`shake` kapı,
  `flash` şimşek ya da flaş, `fade` bölüm sonu).
- **Sözcük bütçesi:** tipik yol (BERAAT_E) **14–16 bin sözcük**, ≥ 200 aksiyon, 90–120 dk; tüm dallar toplamı ≥ 20 bin.

## 1. Kadro: sesler, sırlar, yaylar

| Karakter (kimlik) | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **Deniz Arslan** (`deniz`, oyuncu) | Büronun en genç ortak adayı; on dört dava geride. | Kısa, alaycı iç ses; dışarıda nazik, inatçı. | İlk kez mentorunun geçmişinin içindeki bir dosyayı taşıyor. | Öğrenci → ortak. Sonunda Leyla'nın hatasını tekrarlamamayı seçer (ya da seçmez). |
| **Leyla Erdem** (`leyla`, mentor) | 58, büronun kurucusu. | Az konuşur; her cümlesi ders. Sigara paketini çevirir, açmaz. Bu davada ilk kez cümleleri yarıda kalır. | Ters çerçevedeki fotoğraf: 2008'de cezaevi kapısında Kemal Yalçın, kucağında üç buçuk yaşındaki Emir. Fotoğrafı Leyla çekti. 2004'te Kemal'e "ikrar et" dedi. | Saklayan → anlatan. Çerçeveyi ikinci ara evrede çevirir; epilogda sonuca göre ya düz bırakır ya da yeniden kapatır. |
| **Emir Yalçın** (`emir`, müvekkil) | 22, Toker Balık'ta aşçı yardımcısı; solak. | Az ve kısa; mutfak dili ("servis", "pas", "fileto"). Öfkelenince cümleleri kesilir. "Abla" der. | Pazartesi akşamı arkadaşına "bu adamın hesabını soracağım" diye yazdı; kastettiği bir yüzleşmeydi. O gece Ercan'ın itirafını duyup "Babamın hayatını çaldın!" diye bağırdı ve mektubu almadan çıktı. Mektubu almadığı için kendini suçlu sayıyor. | Öfke → utanç → babasını ilk kez anlamak. |
| **Kemal Yalçın** (`kemal`, baba) | 43, Demirtaş'ta bir depoda gece vardiyası forklift operatörü. | Kısa, yorgun, kırgın; konuşurken ellerine bakar. "Avukat hanım" der; Leyla'ya adıyla hitap etmez. | 2004'te Leyla'nın müvekkiliydi; ikrar etti, dört yıl yattı. Ercan'ın aylardır aramalarına çıkmadı; o gece 23.58'deki aramayı da açmadı. Sesli mesajı hiç dinlemedi. Umutsuzluktan oğluna "tahrik altında yaptım" dedirtmeyi düşünüyor. | Kin → çaresizlik → (doğru yolda) Leyla'yla eşikte bir uzlaşma. |
| **Meral Yalçın** (`meral`, anne) | 41, evden terzilik yapar. | Sakin, pratik; dikiş iğnesi gibi kısa cümleler. | Emir'in o gece 01.20'de eve geldiğini, ağladığını, mutfakta su içip yattığını biliyor; polis "anneler hep evdeydi der" dedi. | Taşıyan kadın. Epiloglarda duygusal çapa. |
| **Tarık Sezer** (`tarik`, baş tanık · gerçek fail) | 45, Toker Balık'ın ortağı ve işletme müdürü. | Sıcak, ölçülü, cömert; "avukat hanım" der, çay ısmarlar, herkesin adını hatırlar. Yalan söylerken ayrıntı ekler. | 2004'te Görükle'deki öğrenci evinin üçüncü kiracısı ve esrarın asıl sahibi; Ercan terazisini saklamıştı. Restoranda sahte faturalarla kasa açığı yarattı. Ercan o gece ortaklığı bitireceğini ve Kemal'e yazdığı itiraf mektubunu vereceğini söyledi. Tarık, Emir çıktıktan sonra ofise girdi, Emir'in fileto bıçağıyla Ercan'ı öldürdü, mektubu aldı, lacivert gömleğini değiştirdi, kamerayı kapattı. | Dost maskesi → kürsüde ayrıntı yığını → çöküş (B'de tanıklıktan çekinme ve tutuklama). |
| **Süleyman Çiftçi** (`suleyman`, tanık) | 61, bulaşıkçı; sol kulağı ağır işitir. | Yavaş, tekrarlayan, dürüst; her cümlenin sonuna "vallahi" ekler. Saatleri dolmuşla ölçer. | Bağırışı duydu (savcılığın elindeki tek ses). Emir'in 23.40'ta arka kapıdan elleri boş, önlüksüz çıktığını gördü; bunu kimse sormadığı için söylemedi. | Korku → kürsüde sade bir cesaret. |
| **Nuri Balcı** (`nuri`, şef) | 52, mutfak şefi. | Bağıran ama adil bir şef; "evladım", "pas!" der. | Çarşamba günü bütün mutfağa "cuma nişan var, bıçaklar bileylensin" diye tahtaya yazdı; tahtayı polis görmedi. | Öfkeli → savunmaya istemeden yardım eden. |
| **Cansu Güler** (`cansu`, garson) | 24, garson. | Hızlı, telaşlı, alaycı; telefonu elinden düşmez. | O gece Tarık onu her zamankinden erken, 23.25'te "kasayı ben kapatırım" diye gönderdi. Telefonunda nişan masasının 23.12 tarihli fotoğrafı var; arkada Tarık lacivert gömlekle. Perşembe Ercan'la Tarık'ın "faturalar" diye bağırıştığını duydu. | Korku (işini kaybetme) → tanıklık. |
| **Gülay Toker** (`gulay`, katılan) | 42, maktulün eşi. | Kırık, öfkeli, dik; savunmayı düşman bilir. | Ercan'ın son haftalarda geceleri ofiste "eski bir arkadaşa" mektup yazdığını biliyor; polisin geri verdiği eşyalarda mektup yoktu. | Düşmanlık → şüphe → (B'de) Deniz'e "Teşekkür ederim" demeyi bilmemek. |
| **Başkan Nihat Soylu** (`baskan`) | Bursa 3. Ağır Ceza başkanı. | Sabırlı, resmî, kısa; "Müdafi, diyeceğiniz?" | — | — |
| **Üye Hâkim Pınar Yener** (`uye`) | Üye. | Az soru sorar; her biri bir çivi. | — | — |
| **C. Savcısı Selim Karaman** (`savci`) | 47 | Keskin, adil, acelesiz; kâğıtla konuşur. | — | Doğru delil karşısında mütalaasını değiştirebilen rakip. |
| **Dr. Sema Ilgaz** (`sema`) | Adli Tıp Bursa Grup Başkanlığı. | Teknik, dürüst, "muhtemel" kelimesinin değerini bilir. | — | — |
| **Mübaşir Recep** (`recep`) | | Kalın sesli; her çağrıdan sonra boğazını temizler. | — | — |
| **İnfaz Koruma Memuru Cemil** (`cemil`) | 50 | Az konuşur. "Bu çocuk bıçak tutmayı bilir ama kime tutacağını bilmez." | — | — |
| **Ercan Toker** (`ercan`, maktul) | 44, Toker Balık'ın sahibi. | Yalnızca sesli mesajda ve mektubun izinde konuşur. | 2004'te terazi onun dolabındaydı; asıl sahibini (Tarık) hiç söylemedi. Üç yıldır ayıktı; Emir'i bilerek işe aldı; o gece itiraf etti. | — |

## 2. Gerçek ve kronoloji (oyuncudan saklı)

| Zaman | Olay | Kim biliyor | Oyuncu nasıl öğrenir |
|---|---|---|---|
| 2004 Ekim | Görükle'de öğrenci evi baskını: ortak odada esrar ve terazi. Kiracılar Kemal Yalçın, Ercan Toker, Tarık Sezer. | Tarık, Ercan | ARA2: arşivden 2004 dosyası (arama tutanağında üç kiracı) |
| 2005 | Kemal, Leyla'nın tavsiyesiyle ikrar etti; dört yıl yattı. Emir cezaevindeyken doğdu. | Leyla, Kemal | BR_01 (Kemal), BR_02 (Leyla) |
| 2008 | Tahliye günü Leyla cezaevi kapısında Kemal'in kucağında Emir'le fotoğrafını çekti. | Leyla | ARA2_GIRIS (çerçeve çevrilir) |
| 2009 | Ercan başka bir dosyada aynı marka terazilerle yakalandı; Leyla "terazinin sahibi"nin Ercan olduğunu düşündü, Kemal'e söyledi; Kemal büroyla bağını kopardı. | Leyla, Kemal | BR_02 |
| 2010 | Ercan ve Tarık Mudanya'da Toker Balık'ı açtı (sermaye Tarık'tan). | Herkes | INV mutfak |
| 2026 Nisan | Ercan, Emir'i aşçı yardımcısı olarak işe aldı (soyadını bilerek). | Ercan | INV Emir görüşmesi |
| Eylül–Ekim | Ercan Kemal'i defalarca aradı; Kemal açmadı. Ercan Tarık'ın sahte faturalarını (Sezer Gıda) fark etti. | Ercan, Tarık | ARA Cansu, ARA not bloku |
| **10 Kasım Pzt 21.14** | Kemal, Emir'in patronunu öğrenip evde patladı. Emir arkadaşına yazdı: "Patronun kim olduğunu öğrendim. Babamın hayatını yakan adammış. Bu hafta hesabını soracağım. Neden yaptığını yüzüne soracağım." İddianame yalnızca ilk üç cümleyi alıntılar. | Emir | INV telefon raporu (tam metin) |
| 12 Kasım Çrş | Şef Nuri tahtaya yazdı: "CUMA 120 KİŞİ NİŞAN — HERKES BIÇAĞINI BİLEYLESİN." Emir aynı gün nalburdan bileği taşı aldı (fiş). | Nuri, Emir | INV mutfak sahnesi + ev sahnesi |
| 13 Kasım Prş | Ercan ile Tarık ofiste "faturalar" diye bağırıştı. Ercan: "Pazartesi muhasebeciye gidiyoruz." | Cansu | ARA Cansu (fakta bağlı konu) |
| **14 Kasım Cuma 22.47** | Ercan → Emir: "Kapanıştan sonra ofise uğra. Baban hakkında konuşmamız lazım. E." | Emir | INV telefon raporu |
| 23.12 | Nişan masasının fotoğrafı; arkada Tarık, lacivert gömlek. | Cansu | ARA Cansu |
| 23.25 | Tarık, Cansu'yu "kasayı ben kapatırım" diye erken gönderir. | Cansu | ARA Cansu |
| 23.30 | Emir ofise girer. Ercan itiraf eder: terazi kendi dolabındaydı, Kemal masumdu; mektubu uzatır. | Emir | INV Emir (konu "O gece"), H1 |
| 23.35 | Emir: "Babamın hayatını çaldın!" Süleyman bulaşıkhanede duyar. | Süleyman | Kolluk ifadesi (dosyada), INV Süleyman |
| **23.40** | Emir arka kapıdan elleri boş, önlüksüz çıkar; bıçak çantası tezgâhta kalır. Süleyman çöp kovalarının yanında görür. | Süleyman | INV Süleyman, H1 (S3 bastır) |
| 23.44.10 | DVR'ın elektriği kesilir (Tarık fişi çeker). | Tarık | ARA kasa ve kamera kaydı |
| 23.45 | Süleyman her geceki dolmuşa biner. | Süleyman | INV Süleyman |
| 23.48 | Kasa Z raporu basılır. | Tarık | ARA kasa ve kamera kaydı |
| **23.52** | Emir'in Kentkart'ı İskele durağında 1/M otobüsünde okutulur. | Emir | ARA Kentkart dökümü (dilekçeyle) |
| **23.58** | Ercan Kemal'i arar; 52 sn sesli mesaj: "Oğlun buradaydı… Mektup masamda, yarın sabah sana getiriyorum… Kapıda biri var. Gel, otur." | Kemal (dinlemedi) | INV maktulün HTS'i → Kemal görüşmesi → ARA bilirkişi raporu |
| ~00.00 | Tarık ofise girer; tartışma; Emir'in fileto bıçağıyla tek darbe. Mektubu alır, not bloğunun üst sayfasını koparır. Lacivert gömleği dolabındaki beyazla değiştirir. | Tarık | ARA not bloku (iz yazısı), ARA Cansu fotoğrafı + INV olay yeri fotoğrafı |
| 00.16 | Tarık 112'yi arar: "Ortağım bıçaklandı, aşçı çocuk yaptı." | Herkes | Dosya |
| 00.40 | Olay yeri fotoğrafları: bıçak cesedin yanında, önlük askıda temiz, Tarık şeridin dışında beyaz gömlekle. | Dosya | INV ofis sahnesi |
| 00.41 | Emir'in kartı Emek metrosunda okutulur. | — | ARA Kentkart |
| 02.30 | Emir Hamitler'deki evinde gözaltına alınır; giysilerinde kan bulunmaz. | Dosya | INV belge |

## 3. Yapı ve node haritası

```
PR_00 Soğuk açılış (23.35, isimsiz sesler) → PR_01 (02.30, Hamitler, gözaltı)
BR_00 Bölüm 1 · DOSYA: Kemal büroda ("Leyla Hanım'la değil, seninle") → BR_01 Leyla, ceza aralığı (A–D)
BR_01B Leyla'nın eski hikâyesi (Dava #04'teki terazi) → BR_02 Dosya + strateji → INV_SABAH (Mudanya iskelesi)
INV_HUB (3 gün × 3 EP; push/$return)
  OLAY YERİ: INV_OFIS (sahne: olay yeri fotoğrafları) · INV_MUTFAK_G → INV_MUTFAK (sahne) → INV_NURI (konuşma, Tarık kamera önü)
             · INV_EV_G → INV_EV (sahne) 
  CEZAEVİ:   INV_GORUSME_G → INV_GORUSME (görüşme: konu × ton, fakta bağlı konular)
  TANIKLAR:  INV_SULEYMAN (konuşma + karar) · INV_KEMAL (görüşme; "Son arama" konusu HTS'ten açılır)
  ARŞİV:     INV_IFADE (belge: Tarık'ın kolluk ifadesi) · INV_HTS (belge) · INV_TEL (belge: Emir'in telefonu)
             · INV_DIL (CMK 177 dilekçesi, 3 talep) · INV_CIKARIM (tahta) · INV_LEYLA (günde bir)
  Gün sonu: INV_DAY_END → INV_AKSAM1 (Leyla: "Kimin hikâyesini savunuyorsun?") / INV_AKSAM2 (Tarık'ın telefonu)
INV_GECE_1…5 (koşullu hafıza zinciri) → INV_GECE
H1_00G_1…3 + H1_00K koridor → H1_00 açılış → H1_01 sanık savunması (sorular) → H1_02 savcının talebi (itiraz)
  → H1_03 Süleyman (S1–S5; bastır/sun/itiraz) ⇄ H1_03K → H1_04 katılanın sözü (itiraz) → H1_05 ara karar → H1_06 koridor
ARA_GIRIS_1…2 + ARA_GIRIS → ARA_HUB (2 gün × 3 EP; yığınsız)
  ARA_KENT (belge) · ARA_KASA (belge: Z raporu + DVR) · ARA_DURAK (sahne: İskele durağı) · ARA_CANSU (konuşma)
  · ARA_GULAY (konuşma) · ARA_EMANET (belge: not bloku, yan ışık) · ARA_EMIR (görüşme: ikrar ikilemi)
  · ARA_KEMAL (sesli mesaj ve ikrar önerisi) · ARA_DIL (ek dilekçe) · ARA_CIKARIM · ARA_LEYLA
  ARA_DAY_END → ARA_TARIK (Tarık büroya gelir) ; ARA_SON_1…3 + ARA_SON
T2_00G_1…2 → T2_00 açılış → T2_01 adli tıp (sorular) → T2_02 Tarık (T1–T6) ⇄ T2_02K → T2_03 savcının talebi: Leyla tanık
  (itiraz, CMK 46) → T2_04 ara karar (tahliye?) → T2_05 koridor
ARA2_GIRIS (Leyla çerçeveyi çevirir) → ARA2_HUB (1 gün × 2 EP) : ARA2_ARSIV · ARA2_BILDIR · ARA2_YUZLES · ARA2_AILE
  → ARA2_SON
T3_00G_1…2 → T3_00 açılış (arşiv teslimi) → T3_IKRAR? → T3_01 Tarık yeniden (R1–R4) ⇄ T3_01K (çöküş)
  → T3_02 mütalaa → T3_03P dayanaklar → T3_03 esas savunma → T3_04 son söz → T3_05 hüküm → R_KARAR + epilog
T_INT_COKUS (♥0) → T3_05
```

Celseler: `cs_1` (açılış, sanık savunması, tanık), `cs_2` (tanık, delil tartışma), `cs_3` (tanık, mütalaa, savunma,
son söz, karar).

## 4. Sahne sahne

> Sözcük sayıları tipik yol içindir (± %20). Örnek satırlar tonu tarif eder.

### PR_00 — Soğuk açılış · "GECE 23.35" (~550) · bg: liman_gece → kafe
- `card`: "14 KASIM · GECE 23.35 — MUDANYA İSKELESİ"
- Deniz yok. Yağmur iskele lambalarında, bir meyhanenin neonunda "TOKER BAL K". Kapanmış bir nişan yemeğinin
  artıkları; bir garson şemsiyesiz koşar, bir motor geçer.
- Mutfakta bulaşık suyu; arka koridorda bir kapı. İçeriden bir ses yükselir:
  `GENÇ BİR SES`: "Babamın hayatını çaldın! Yirmi iki yıl!" (`shake`)
  `BİR ADAM`: "Otur. Lütfen otur. Al şunu, babana ver…" / `GENÇ BİR SES`: "Kendin ver!"
- Arka kapı çarpar. Yağmurda koşan biri; iskeleye doğru; elleri ceplerinde.
- Bir köşede, bir kameranın kırmızı ışığı. Birkaç dakika sonra söner. Kimse fark etmez.
- narrator: "Yarım saat sonra biri 112'yi aradı. Sesi sakindi. Sakin seslere hep inanılır." (`fade`)
> Kimin girip çıktığı, ışığı kimin söndürdüğü söylenmez. Bağıran sesin müvekkil olduğu ilk bölümde anlaşılır; bu bir
> sır değildir, savcılığın elindeki en güçlü delildir.

### PR_01 — "GECE 02.30 · HAMİTLER" (~350) · bg: sokak_karanlik
- Ekip aracı, üçüncü kat; kapıyı Meral açar. Emir uyanık, mutfakta su içiyor, gözleri şiş. "Ne oldu?" Telefonu poşete.
- Emir: "Ercan abi mi? Ben… ben bağırdım sadece." Kelepçe. Meral'in elinde bir dikiş iğnesi, ipliği sallanır.
- narrator: "Üç ay sonra iddianame geldi: tasarlayarak öldürme. On bir gün sonra baba bir avukat kapısı çaldı."

### BR_00 — "Kemal" (~900) · bg: buro_gece
- `card`: "CUMA 22.10 — ARSLAN HUKUK, BURSA". Deniz'in iç sesi; on dört dava; masada bir kahve.
- Kemal kapıyı çalmadan girer; yağmurluk, iş botları, eldivenlerinin birini çıkarmamış. Leyla'nın kapısına bakar.
- "Leyla Hanım'la değil. Seninle konuşacağım." Bürodaki gerilim; Leyla kapıda belirir, bir şey demez, geri çekilir.
- Kemal'in anlattığı: oğlu, meyhane, "o adam"ın kim olduğu (Ercan 2004'te ev arkadaşıydı), zorunlu müdafinin iki
  görüşmesi, Meral'in ısrarı: "Bu büro bize borçlu."
- Seçim (puansız, ilişki): "Borç değil; dosyayı okuyacağım" (+güven, `kemal_durust`) · "Leyla Hanım bu dosyada yok"
  (Kemal rahatlar, Leyla duyar: `leyla_kapi`) · "Ücreti konuşalım" (nötr). 

### BR_01 — Leyla dosyayı verir (~550) · bg: buro_gece
- Leyla, Kemal gittikten sonra Deniz'in masasına bir klasör bırakır; elleri sigara paketini çevirir.
- Ceza aralığı sorusu (A–D): doğru = TCK 82/1-a, ağırlaştırılmış müebbet. Yanlışlar: 81/1 müebbet; 82/1-a + 29 "doğrudan
  18–24 yıl"; "20–25 yıl, ilk okuma".
- Leyla'nın tek dersi: "Tasarlama bir saat değildir, bir zihin hâlidir. Savcı o zihni kâğıtlardan kuracak."

### BR_01B — "Yirmi iki yıl" (~500) · bg: buro_gece
- Leyla, Deniz'e Dava #04'te anlattığı hikâyeyi bu kez adıyla anlatır: Görükle, bir terazi, Kemal. "İkrar et dedim."
- Deniz: "Bunu bana anlatmıştınız." Leyla: "Adını söylememiştim."
- Ters çerçeve: Leyla ona bakmaz. thought: "On dört davadır o çerçeveye bakmadım. Bu gece o bana bakıyordu."
- Leyla'nın sınırı: "Dosya senin. Ben salonda dinleyici sırasında olacağım. Bir şey sorarsan cevap veririm; sormazsan
  susarım."

### BR_02 — Dosya + strateji (~250)
- Profil kartı, ceza çubuğu, olay özeti, savcılığın elindekiler (Tarık'ın görgü tanıklığı STRONG; bıçak ve parmak izi
  STRONG; pazartesi mesajı MEDIUM; bağırış MEDIUM; bileği taşı fişi WEAK).
- Strateji: Masumiyet ×1,5 · Tasarlamayı çürüt ×1,2 · Terditli (tahrik) ×0,8. Leyla tek cümle.

### INV_SABAH — Mudanya iskelesi (~250) · bg: liman_gece
- Sabah sekiz; iskelede martılar, kapalı meyhane, neonun I'sı. Bir dolmuş geçer. Deniz yürüyerek ölçer: meyhaneden
  durağa dokuz dakika. thought: "Bu dosyada iki saat var: savcınınki ve dolmuşunki."

### Bölüm 2 · SORUŞTURMA (INV_*, 3 gün × 3 EP; ~4.300)

**INV_HUB** hedef kutusu (gün 1: "Savcının tasarlama hikâyesinin üç ayağını bul"; gün 2: "Tanığın saatleri birbirini
tutuyor mu?"; gün 3: "Dilekçe ve tahta. Kürsüde kimi sınayacaksın?").

**INV_OFIS — Olay yeri fotoğrafları (sahne, ~250)**: bıçak cesedin yanında (önemli: "elinde bıçakla çıktı" ile çelişir),
askıda temiz önlük, masada üst sayfası koparılmış not bloğu, DVR'ın sönük ışığı, şeridin dışında beyaz gömlekli ortak
(Tarık; yalnızca "ortak" diye anılır, tohum), çeldirici: rakı kadehi, akvaryum.

**INV_MUTFAK + INV_NURI (~650)**: Şef Nuri servis öncesi bağırır; tahta (CUMA 120 KİŞİ NİŞAN — BIÇAKLAR BİLEYLENSİN),
bıçak askısı, Emir'in istasyonu, arka kapı ve çöp kovaları (Süleyman'ın yeri), kasa (Z raporu her gece kapanışta; Nuri:
"Kasayı Tarık Bey kapatır"). Konuşma: Nuri'nin Emir'e öfkesi ve savunusu ("Bıçak çantasını her gün taşır; aşçı bıçağını
eve götürür"). Tarık sahnenin sonunda gelir, sıcak: "Ne lazımsa avukat hanım." Seçim: nazik bir soru (kamera) → "Üç gündür
arızalıydı, servis çağırmıştık" (tohum ve ileride çelişki) ya da sert bir soru → `tarik_uyarildi`.

**INV_EV (sahne, ~400)**: Hamitler; Meral'in dikiş makinesi; Emir'in odası: bileği taşı ve nalbur fişi (Çarşamba),
aşçılık okulu diploması, babasının hediyesi bıçak setinin boş yuvası (fileto), duvarda 1/M otobüs saatleri (Emir'in
güzergâhı), çeldirici: boks eldiveni. Meral: "Bir buçukta geldi. Su içti, ağladı, yattı."

**INV_GORUSME — Cezaevi (~1.300)**: Cemil kapıyı açar. Konular: O gece (yumuşakta itirafı anlatır; sertte kapanır) ·
Bıçak çantası · Pazartesi mesajı (tam metni bilmiyorsa savunur; telefon raporundan sonra "neden yaptığını soracaktım") ·
Ercan abi (işe alınması, iyiliği) · Babanla kavga · **Davet** (telefon raporundan açılır: 22.47 mesajı) · **Solak**
(adli tıp raporundan açılır). Emir her şeyi sol eliyle yapar (imza, bardak). Kırılma anı: "Mektubu almadım abla.
Alsaydım…"

**INV_SULEYMAN (~600)**: Mudanya'da bir kahvehanenin önü (bg sokak_yagmur). Süleyman korkak, dürüst. Sorular: saat
(dolmuş), ne duydu (sol kulak), ne gördü (eller boş, önlük yok), polis ne sordu (yalnızca bağırışı). Karar: "Gördüğünüzü
anlatın" (doğru) · "Bıçak olmadığını kesin söyleyin" (etik ihlal) · yazılı beyan (zayıf).

**INV_KEMAL (~700)**: Demirtaş, gece vardiyası, depo (bg depo_gece). Forkliftin bip'i. Konular: 2004 · Ercan'ın
aramaları · Emir'le kavga · **Son arama** (HTS'ten açılır: 23.58, 52 sn). Kemal telefonunu çıkarır: bir cevapsız arama ve
dinlenmemiş bir sesli mesaj simgesi. Karar: "Silmeyin; bilirkişiye inceletelim" (doğru, `sesli_korundu`) · "Şimdi
dinleyelim, telefonuma kaydedeyim" (zayıf delil, `sesli_kopya`) · "Sonra bakarız" (kaybolur).

**INV_IFADE / INV_HTS / INV_TEL (belgeler, her biri ~150)**: Tarık'ın ifadesi (23.55, bıçak elinde, önlükte kan, 00.15'e
kadar sayım, kamera arızalı) — karşılaştır aletiyle olay yeri tutanağına; HTS: 23.58 son arama, numara Kemal'in vekâlet
formundaki numara; telefon raporu: pazartesi mesajının tamamı (büyüteç), 22.47 davet (karşılaştır: iddianame "kendi
isteğiyle kaldı").

**INV_DIL**: 3 talep: Kentkart (Emir'in otobüs biletinden açılır), DVR teknik incelemesi (Tarık'ın "arızalı" sözünden),
Z raporu ve POS kayıtları (Nuri'den), çeldiriciler: Tarık'ın HTS'i (dayanaksız), yeniden olay yeri keşfi (nötr), bıçakta DNA
(gereksiz: bıçak zaten Emir'in).

**INV_CIKARIM**: ded_davet, ded_bileme, ded_hesap, ded_onluk, ded_bicak_yeri, ded_saat; çeldiriciler.

**INV_LEYLA (günde bir; ~350)**: tasarlamanın dört unsuru (karar–icra arası makul süre, kararda sebat, soğukkanlılık,
plan); haksız tahrikin tasarlamayla gerilimi; "tanığa saat söyletme".

**INV_AKSAM1 (gün 1 sonu)**: Leyla: "Kimin hikâyesini savunuyorsun: Emir'in mi, Kemal'in mi?" Seçim iç sese yansır.
**INV_AKSAM2 (gün 2 sonu)**: Gizli numara değil, tanıdık bir ses: Tarık arar, "bir şey lazım olursa" der, bileği taşından
söz eder (bunu nereden biliyor?). Tohum değil; Tarık'ın soruşturma dosyasını kolluktan dinlemiş olabileceği ima edilir.
Seçim: nazikçe kapat · bilgi ver (kötü, `tarik_uyarildi`).

**INV_GECE (~350)**: Pano; koşullu hafıza satırları; Leyla'dan mesaj: "Yarın o yaşlı adam kürsüde titrerse, ona saati
sorma. Dolmuşu sor."

### Bölüm 3 · BİRİNCİ CELSE (~2.200) · bg: durusma_salonu
- Koridor: Kemal ve Meral; Gülay siyahlar içinde; Leyla dinleyici sırasının en arkasına oturur; Tarık "hastalık raporu"
  göndermiş, salonda yok.
- Açılış; iddianame özeti (savcı): tasarlamanın üç ayağı + baş tanık + bıçak.
- Sanığın savunması: Emir anlatır; Deniz'in soruları (davet, bıçak çantası, otobüs, pazartesi mesajının devamı). Kötü
  sorular: "Ercan'dan nefret ediyor muydunuz?"
- Savcının talebi: 2004 dosyasının husumet delili olarak getirtilmesi → seçenekler (katıl ve tamamını iste / karşı çık /
  ilgisiz / sus).
- **Süleyman (S1–S5):** S1 "Bağırışı duydum; 'Babamın hayatını çaldın' dedi." · S2 "Saat on bir buçuğu geçiyordu,
  vallahi." · S3 "Çocuk koşarak çıktı, çok sinirliydi." · S4 (S3 bastırılınca) "Elinde bir şey yoktu; önlüğü de yoktu." ·
  S5 "O hâliyle bir şey yapar mı, yapar; gençlik." Bastır S2 → dolmuş saati (23.45). Sun: ev_tarik_ifade → S2 (23.55 ile
  çelişki), ev_olay_foto/ded_onluk → S4, ded_bicak_yeri → S4; itiraz S5 (kanaat). Kırılma: Süleyman "Ben bir şey görmedim
  dediler, ben gördüm" der.
- Katılanın sözü: Gülay'ın dinleyiciden bağırması; savcının telkinli sorusu → itiraz.
- Ara karar: Tarık'ın zorla getirilmesi (CMK 44/1: usulüne göre çağrılıp gelmeyen tanık), talep edilen kayıtların
  istenmesi; tutukluluk (devam; doğru talep yalnızca puan ve tutanak kazandırır).
- Koridor: Kemal ile Leyla ilk kez göz göze; tek cümle: "Oğlumun yanında durma." Leyla durmaz; uzaklaşır.

### Bölüm 4 · ARA (ARA_HUB, 2 gün × 3 EP; ~2.300)
- **ARA_GIRIS**: Kayıtlar gelir (Kentkart, DVR teknik raporu, Z raporu; talebe bağlı). Leyla'nın kapısı kapalı.
- **ARA_KENT (belge)**: 23.52 İskele, 00.41 Emek. **ARA_KASA (belge)**: Z raporu 23.48; DVR "güç kesintisi 23.44.10;
  önceki 72 saatte kesintisiz kayıt; disk arızalı, görüntü kurtarılamadı".
- **ARA_DURAK (sahne, gece)**: İskele durağı: sefer çizelgesi (23.52 son 1/M), durak kamerası (belediye, 7 gün saklama →
  çeldirici), yürüme mesafesi tabelası, meyhanenin arka kapısından görünen ofis penceresi.
- **ARA_CANSU (~450)**: kafe; Cansu'nun telefonu: 23.12 nişan fotoğrafı (lacivert gömlek); "Tarık abi beni erken
  gönderdi"; "Perşembe" konusu (ancak Z raporu ya da fatura ipucu varsa): Ercan ile Tarık'ın kavgası. Karar: tanık
  bildirimi · "işini kaybetmezsin, sana iş bulurum" (etik ihlal: menfaat vaadi).
- **ARA_GULAY (~400)**: Gülay'ın evi; düşmanca; mektup: "Geceleri bir arkadaşına mektup yazıyordu. Eşyalarında yoktu."
- **ARA_EMANET (belge)**: mahkeme izniyle emanette not bloğu; yan ışıkla iz yazısı: "Kemal, o terazi senin değildi…
  Tarık'ın… susan bendim…" (yarım, yalnızca kelimeler).
- **ARA_KEMAL (~500)**: sesli mesaj (korunduysa: bilirkişiye gidecek); ve Kemal'in önerisi: "Oğlum 'yaptım, tahrik
  oldum' desin. On iki yıl müebbetten iyidir." Seçim: reddet (doğru) · "Emir'le konuşurum" (nötr) · "Haklısınız" (etik).
- **ARA_EMIR (~500)**: Emir: "Babam bir şey dedi abla. Sen ne dersin?" Seçim: "Yapmadıysan yaptım deme" (doğru) · "İkrar
  edersen on iki yıl…" (etik ihlal: sahte ikrar yolu, `ikrar_onerisi`).
- **ARA_TARIK (gün sonu olayı, ~350)**: Tarık büroya Ercan'ın bir fotoğrafını getirir ("Gülay Hanım'a verirsiniz"); ne
  bildiğini yoklar. Seçim: hiçbir şey söyleme (doğru) · Z raporunu sor (kötü: uyarır) · tehdit et (kötü).
- **ARA_SON**: duruşmadan önceki gece; koşullu hafıza; Leyla'nın kapısı aralık.

### Bölüm 5 · İKİNCİ CELSE (~2.000)
- Açılış; Tarık salonda, takım elbise, dinleyicilere baş selamı.
- **Adli tıp (T2_01)**: Dr. Sema'ya sorular: ölüm saati aralığı (23.30–01.00), tek darbe, saldırganın muhtemelen sağ eli
  ("muhtemel"), giysilerde kan yok.
- **Tarık (T1–T6):** T1 "Saat 23.55 gibi bağırış duydum." · T2 "Emir ofisten koştu; elinde bıçak, önlüğünde kan vardı." ·
  T3 "00.15'e kadar kasada sayım yaptım; sonra ofise girdim." · T4 "Kamera sistemi üç gündür arızalıydı." · T5 "Sanığın
  ailesini tanımam; Ercan'ın eski meselelerinden haberim yoktu." · T6 (T3 bastırılınca) "Ercan'ı yerde görünce ona
  sarıldım; üstüm kan oldu." Sun: ded_saat → T1, ded_onluk/ded_bicak_yeri → T2, ev_z/ded_kasa → T3, ev_dvr/ded_kamera →
  T4, ded_gomlek → T6 ("üstüm kan oldu" ama polis fotoğrafında temiz beyaz gömlek). T5 bu celsede çürütülemez (arşiv
  dosyası henüz yok); bastırılınca küçük bir sürçme: "Ercan anlatırdı… Görükle'deki evi… bilmiyorum."
- **Savcının talebi (T2_03)**: Av. Leyla Erdem'in husumet konusunda tanık dinlenmesi → itiraz: avukatın meslek sırrı
  nedeniyle çekinme hakkı (CMK 46/1-a; Av.K. 36) ve husumetin zaten tartışmasız olduğu.
- **Ara karar (T2_04)**: sesli mesaj bilirkişi raporu ve tanık Cansu için erteleme; tahliye talebi (Tarık'ın anlatımı
  sarsıldıysa adli kontrolle tahliye).
- Koridor: Tarık, Deniz'in yanından geçerken "Ercan sizi severdi avukat hanım" der. Yalnızca bu.

### Bölüm 6 · İKİNCİ ARA (ARA2, 1 gün × 2 EP; ~900)
- **ARA2_GIRIS — Çerçeve (~450)**: Gece; Leyla'nın odası. Leyla çerçeveyi çevirir: 2008, cezaevi kapısı, Kemal ve
  kucağında Emir. "Fotoğrafı ben çektim." 2004'ü yeniden anlatır; bu kez sonunu: "Arama tutanağında üç ad vardı. Ben
  ikisini okudum." Esas numarasını verir: Bursa 2. Ağır Ceza 2004/311.
- **ARA2_ARSIV**: arşiv dosyasını mahkeme kanalıyla iste (doğru) · Leyla'nın kendi notlarını fotokopiyle sun (etik:
  müvekkil sırrı) .
- **ARA2_BILDIR**: savcılığa yazılı bildirim (CMK 158): kayıp mektup, iz yazısı, gömlek, sesli mesaj → Tarık hakkında
  soruşturma, dolabının araması.
- **ARA2_YUZLES**: meyhaneye gidip Tarık'la yüzleşme (kötü: şüpheliyi uyarır; avukat kovalamaz).
- **ARA2_AILE**: Kemal'i Emir'in görüşüne götürmek; baba ve oğul; Kemal ilk kez 2004'ü anlatır.
- **ARA2_SON**: Leyla: "Yarın son duruşma. Benim için değil; onun için."

### Bölüm 7 · ÜÇÜNCÜ CELSE (~2.400)
- Açılış; arşiv dosyası (talep edildiyse) gelmiştir. Sahte ikrar yolunda Emir söz alır ve "Ben yaptım, tahrik oldum" der
  (T3_IKRAR): Kemal başını eğer; Leyla salondan çıkar.
- **Tarık yeniden (R1–R4)**: R1 "İfademin arkasındayım." · R2 "O gece ofise ben 00.15'te girdim." · R3 "Görükle'yi
  bilmem; o evde hiç oturmadım." · R4 "Mektup diye bir şey görmedim." Sun: ev_arsiv → R3 (arama tutanağında adı),
  ev_sesli/ded_canli → R2 ("Kapıda biri var… Gel, otur" 23.58), ded_mektup → R4, ded_gomlek → R1. Üçü bir aradaysa
  T3_01K: Tarık "Kendimi suçlayacak sorulara cevap vermeyeceğim" der (CMK 48); savcı ayağa kalkar.
- **Mütalaa (T3_02)**: 2-b (Tarık çöktüyse ve bildirim varsa) · 2-e (tanık çöktüyse) · 81/1 + 29 (terditli ve tahrik
  tartışıldıysa) · 82/1-a (varsayılan).
- **Dayanaklar (T3_03P, 3 hak)**: saat · 23.58 · tanık · tasarlama · tahrik · mektup.
- **Esas savunma (T3_03)**: Masumiyet / Şüphe / Terditli / Duygu.
- **Son söz (T3_04)**: Emir: "Mektubu almadım. Babamın mektubunu. Alsaydım…" / sessizlik / "Babama…".
- **Hüküm (T3_05)** → R_KARAR.

## 5. Ters köşeler ve ekilen ipuçları

1. **Baş tanık faildir.** İpuçları: INV_OFIS'te şeridin dışındaki beyaz gömlekli ortak (çeldirici gibi durur); INV_NURI'de
   "kasayı Tarık Bey kapatır" ve Tarık'ın "kamera arızalıydı" cümlesi; INV_AKSAM2'de Tarık'ın bileği taşını bilmesi;
   Cansu'nun "erken gönderildim"i. Kanıt ancak ARA'da (Z raporu, DVR, gömlek, iz yazısı) ve ARA2'de (arşiv) gelir.
2. **Davet maktulden geldi.** İddianame "kendi isteğiyle kaldı" der; telefon raporundaki 22.47 mesajı bunu çevirir.
3. **Ercan 23.58'de yaşıyordu.** HTS'teki son arama → Kemal'in dinlemediği sesli mesaj. Kemal'in kini, oğlunun kurtuluşunu
   saklıyordu.
4. **Çerçeve.** On dört dava boyunca ters duran fotoğrafta sanık, üç buçuk yaşında, babasının kucağındadır.

## 6. Epiloglar (OutcomeDef.epilogue; her biri ~250–450 sözcük)

- **BERAAT_B:** "İşlemediği sabit olduğundan…" Emir babasına döner; Kemal ilk kez ağlar. Koridorda Gülay, Deniz'e bir
  şey diyemez; elindeki mektubun fotokopisini (iz yazısından) ister. Büroda Leyla çerçeveyi düz koyar; Kemal kapıda belirir,
  içeri girmez: "Yirmi iki yıl." Leyla: "Biliyorum." Son kart: Tarık Sezer tutuklandı; Leyla, Kemal'in 2004 mahkûmiyeti
  için yargılamanın yenilenmesi dilekçesini yazıyor (CMK 311, 312).
- **BERAAT_E:** "Sabit olmadığından…" Emir çıkar; koridorda "şüpheden yararlandı" fısıltısı. Gülay: "Kocamı kim öldürdü
  o zaman?" Leyla çerçeveyi çevirir ama kaldıramaz: "Bir şey eksik." Tarık meyhaneyi açar; neonun I'sı hâlâ yanmaz.
- **INDIRIM (farklı nitelendirme):** "Tasarlama unsuru oluşmadığından… haksız tahrik… on iki yıl altı ay." Ring aracı.
  Kemal: "Ben de ikrar etmiştim." Leyla çerçeveyi çekmeceye koyar.
- **MAHKUMIYET:** "Ağırlaştırılmış müebbet… TCK 62 ile müebbet." Meral'in iğnesi yere düşer. Leyla, Deniz'e 2004 dosyasını
  verir: "İstinafa ikimiz gideceğiz." Çöküş varyantı: savcı "kâğıtla gelmeliydiniz" der.
- **IKRAR (etik):** Emir yapmadığı bir şeyi ikrar eder; on iki yıl altı ay. Leyla masasındaki çerçeveyi Deniz'in eline
  verir: "Yirmi iki yıl önce ben de bunu dedim. Sen de artık bir tane taşıyacaksın."

## 7. Mekanik bağlar (yazım kontrol listesi)

- Her ters köşenin en az iki ekilmiş ipucu var (§5).
- Etik çizgiler: tanığa saat/söz ezberletmek (Süleyman), tanığa menfaat vaadi (Cansu), müvekkile sahte ikrar önermek
  (Emir), meslek sırrını müvekkil onayı olmadan kullanmak (Leyla'nın notları), şüpheliyi kovalamak (Tarık) → `ethics`.
- Sonuçlar: IKRAR (1) · BERAAT_B (2) · BERAAT_E (3) · INDIRIM (4) · MAHKUMIYET (5, varsayılan; çöküş varyantı).
- Golden path'ler: G1 (B) · TIPIK (E) · G3 (İNDİRİM) · G4 (MAHKÛMİYET) · G5 (İKRAR) · W (çöküş).
