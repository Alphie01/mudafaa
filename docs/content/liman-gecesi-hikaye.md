# Dava #10 — Liman Gecesi · Hikâye Kitabı (noir)

> Bu belge Dava #10'un **anlatı çıtasıdır**; Dava #07 v2 hikâye kitabının (`gece-bekcisinin-sirri-hikaye.md`) yapısını ve
> yoğunluğunu izler. Hukuki gerçek, delil zinciri, sonuç koşulları ve puan mantığı `docs/content/liman-gecesi.md`'de;
> madde doğrulamaları ve yorum kararları `docs/legal/liman-gecesi.md`'dedir. Kaynak: `content/src/liman-gecesi/`.

## 0. Ton ve kurallar

- **Noir dram.** Mudanya, kasım ortası. Poyraz, çiseleyen yağmur, rıhtımda mazot ve yosun kokusu, vinç uyarı düdükleri,
  konteynerlerin arasından sızan sodyum ışığı. Her sahnede bir duyusal ayrıntı: ıslak çelik, termostaki acı kahve, kantinin
  florasanı, iskele büfesinin buğulu camı, cezaevi kapılarının kilit sesi.
- **İç ses.** Deniz `style: "thought"` ile kısa, keskin cümlelerle düşünür. Gözlemler, sezer; çözümü **asla söylemez**.
  - Örnek: *"Limanda saatler gemilere göre işler. İnsanlara göre değil."*
- **Kuru, seyrek mizah.** Şükrü Usta'nın işitme cihazı, Nail Usta'nın radyosu, Leyla'nın masadaki kapalı sigara paketi.
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numarası yalnızca Leyla'nın kısa açıklamalarında, seçenek geri
  bildiriminde, rapor ipucunda, delil notunda, resmî duruşma dilinde (savcı, başkan) ve hüküm metninde geçer.
- **Gizem korunur.** Soğuk açılışta sesler isimsizdir (`speaker: "narrator"`, `name: "SARHOŞ SES"`, `"GENÇ SES"`). İkinci
  kişinin varlığı ve kimliği hiçbir satırda söylenmez ya da güçlü biçimde ima edilmez; oyuncu onu otopsi raporundan, telefon
  kaydından, turnike dökümünden, lastik izinden ve araç takip kaydından kendisi kurar. Kenan Aksoy oyunun başından sonuna
  kadar **yardımsever ve babacan** görünür; Deniz'in iç sesi ondan şüphelenmez, yalnızca delillerin söylediğini söyler.
- **Her sahne bir şey değiştirir.** Yeni bilgi, yeni şüphe, ya da bir ilişkide kırılma.
- **Satır kuralları:** bir satır en çok ~220 karakter; yeni mekânda ilk satır `style: "card"` + `bg`
  (ör. `"15 KASIM · 06.10 — MUDANYA LİMANI, B SAHASI"`); sert anlarda `fx` (`shake` kapı/tokmak, `flash` flaş/şimşek,
  `fade` bölüm sonu).
- **Sözcük bütçesi:** tipik yol (BERAAT_E) **13–16 bin sözcük** (`case:duration`), ≥ 200 aksiyon; bütün dallar ≥ 18 bin.

## 1. Logline ve tema

- **Logline:** Mudanya limanında bir puantör konteynerlerin arasında ölü bulunur; kavga ettiği laşing işçisi Tarık Demirel
  "öldürmek için geri döndü" iddiasıyla müebbetle yargılanır. Tarık o gece bir yumruk attığını saklamaz; ama yumruk
  öldürmez. Deniz'in elinde bir otopsi raporu, bir telefon kaydı ve kırk dakikalık bir boşluk vardır.
- **Tema / dramatik soru:** *Bir insanın yaptığı şeyin bedelini ödemesi ile yapmadığı şeyin bedelini ödemesi arasındaki
  fark.* Tarık suçsuz değildir; ama katil de değildir. Savunma, müvekkilin vurduğu yumruğu inkâr etmeden onun ölçüsünü
  doğru tartabilmektir.
- **Ana mekânlar:** Mudanya Limanı (4 no'lu rıhtım, B sahası, kantin, vardiya ofisi), iskele büfesi, Tarık'ın Güzelyalı'daki
  evi, Bursa Kapalı Cezaevi görüş odası, emekli adli tıpçının çalışma odası, Arslan Hukuk, Bursa Adliyesi, Bursa 6. Ağır Ceza.

## 2. Kadro: sesler, sırlar, yaylar

| Karakter | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **Deniz Arslan** (oyuncu) | Kıdemli avukat; ilk kasten öldürme dosyası. | İç ses kısa, gözlemci; dışarıda sakin. Rıhtımda insanlara "usta" der. | Bir yumruğu "cinayet" yapan dosyalardan korkar: müvekkile yalan söyletmeden onu korumak. | Kuşku → ölçü. "Masum" ile "katil değil" arasındaki farkı savunmayı öğrenir. |
| **Leyla Erdem** (mentor) | 58, büronun kurucusu. | Az konuşur, her cümlesi bir ders; kapalı sigara paketini çevirir. | Ters çerçeve masada (Dava #15 tohumu, yalnızca bir ima). | Deniz'i izler; etik çizgide sert. |
| **Tarık Demirel** (müvekkil) | 33, laşing işçisi, Rize'den Mudanya'ya göçmüş; bir kızı (Elif, 6) var. | Kısa cümleler, Karadeniz ağzından kırıntılar ("ha", "da"), kendi ellerine bakarak konuşur. Utandıkça susar. | Kolluğa "ittim, düştü" dedi; yumruğu utancından sakladı. Eve 00.10'da döndü; arada iskelede ağladı, bunu kimseye söylemedi. Ağabeyi Emre iki yıl önce gece yüklemesinde konteyner altında kaldı. | Utanç → dürüstlük. Duruşmada "vurdum" diyebildiği an, savunmanın kurulduğu andır. |
| **Gülay Demirel** (eş) | 30, evde terzilik yapar. | Hızlı, pratik, cümlesini bitirmeden ikincisine geçer; iğneyi yakasına takar. | Kocasının eve geç geldiğini biliyor ve bunun aleyhe kullanılacağından korkuyor: "23.30'da geldi derim" önerisi. | Korku → güven. Doğruyu söylemeyi seçerse duruşmada en güçlü tanık olur. |
| **Kenan Aksoy** (vardiya şefi) | 52, eski römorkör kaptanı; maktul ona “Kaptan” derdi (oyuncu bunu ara evresinde öğrenir). | Babacan, deniz benzetmeleriyle konuşur ("Deniz durgunken herkes kaptan"), herkese "evlat" der; konuşurken elini bir bez parçasına siler. | Gece yüklemelerinde manifestoya girmeyen konteynerler. Ercan bunu biliyordu ve "yarın her şeyi anlatırım" dedi. | Yardımsever tanık → çatlayan ifade → susma hakkına sığınan adam. Oyuncuya hiçbir zaman "katil" diye gösterilmez. |
| **Şükrü Balcı** (görgü tanığı) | 61, forklift operatörü, emekliliğine dört ay var. | Yüksek sesle konuşur, her soruyu "Ha?" diye bir kez tekrarlatır; dürüst, inatçı. | O gece işitme cihazının pili bitikti; "Seni gebertirim"i kimin bağırdığını görmedi, sesin geldiği yönü tahmin etti. | Yanlış emin → dürüst şüphe. Kürsüde "Bilmiyorum" diyebilmesi bir onur anıdır. |
| **Nail Usta** (mazeret tanığı) | 72, iskele büfesinin sahibi, uykusuz. | Radyosu hep açık; her cümleyi bir hava durumu raporuyla bitirir. | — | Görmezden gelinen tanık → kürsüde birkaç cümlelik doğruluk. |
| **Sevim Yavuz** (maktulün eşi) | 41, kasiyer. | Kesik, öfkeli; sonra yorgun. | Ercan'ın son haftalarda "Kaptan bize borçlu, yakında rahatlayacağız" dediğini ve bir defter sakladığını biliyor. | Düşmanlık → ortak bir gerçeğe ihtiyaç. Kocasının katilinin Tarık olmadığını kabullenmek zorundadır. |
| **Dr. Orhan Beyaz** (uzman) | 74, emekli adli tıp uzmanı. | Yavaş, kesin; ders anlatır gibi; çayını hiç içmez. | — | Deniz'e bilimin dilini verir. |
| **Bşk. Nurten Aydemir** (kolluk) | 47, cinayet büro amiri. | Hızlı, sert, sigarasını yakmadan tutar. | Dosyayı iki günde kapattı; içten içe twistlock'u beğenmedi. | Ara evresinde suç duyurusundan sonra kapıyı aralar. |
| **Doç. Dr. Selma Karaca** (ATK bilirkişisi) | 45 | Teknik, dürüst; "olabilir" ile "uyumludur" arasındaki farkı bilir. | — | Doğru soru karşısında raporunu daraltır. |
| **Başkan Melih Sarp / Üye Derya Alkan** | Bursa 6. Ağır Ceza | Başkan sabırlı ve resmî; Üye Alkan'ın soruları kısa ve keskin. | — | — |
| **Savcı Bora Kılınç** | 39 | Soğuk, düzenli; dosyayı sever, sanığı değil. | — | Delil karşısında mütalaasını değiştirebilen rakip. |
| **Mübaşir Hasan Efendi** | 63 | Adları uzatarak çağırır. | — | — |
| **Cevdet** (infaz koruma memuru) | 50 | Tek cümle. | "Bu adam her gece kızının resmine bakıyor." | — |

## 3. Gerçek ve kronoloji

| Saat (14–15 Kasım) | Olay | Kim biliyor | Oyuncu nasıl öğrenir |
|---|---|---|---|
| 20.00–23.00 | Tarık 4 no'lu rıhtımda laşing yapar; yüzlerce twistlock eline geçer (kafesteki twistlock'taki iz bundan). | Tarık, Şükrü | Tarık görüşmesi (vardiya), olay yeri: kafes |
| 22.40 | Ercan (matarasında rakı) Tarık'a Emre'yi sorar: "Kardeşin de senin gibi ayağına bakmazdı, o yüzden ezildi." Tükürür, iter. | Tarık | Tarık görüşmesi (kardeş konusu, açılır) |
| 23.04 | Tarık bir yumruk atar. Ercan 7 no'lu babanın dibine oturur; burnu ve dudağı kanar. "Seni gebertirim lan!" diye bağıran Ercan'dır. | Tarık, Şükrü (yanlış duyar), Kenan | Şükrü görüşmesi (cihaz), 1. celse Şükrü'nün kırılması |
| 23.08 | Kenan gelir, ayırır; Tarık'ı eve, Ercan'ı kantine yollar. | Kenan, Şükrü | Kenan'ın ifadesi, Şükrü |
| 23.18 | Tarık 2 no'lu personel turnikesinden çıkar; bir daha girmez. | Kayıt | Turnike dökümü (dilekçe → 1. celse) |
| 23.34 | Ercan kantinde personel kartıyla tost ve ayran alır; burnunda pamuk. | Şükrü, kantin kaydı | Şükrü görüşmesi (kantin), otopsi: mide içeriği |
| 23.37 | Tarık iskele büfesinde kartla iki çay öder; Nail Usta elindeki kanlı peçeteyi görür. | Tarık (saklıyor), Nail | Gülay'ın hesap dökümü, Nail Usta |
| 23.41 | Ercan, rehberde "Kaptan" diye kayıtlı numarayı arar (2 dk 07 sn): "Gel beni al… ya da yarın her şeyi anlatırım." İçerik bilinmez, yalnızca kayıt. | Kenan | Maktulün telefon inceleme tutanağı (belge), "Kaptan" lakabı (Şükrü, Tarık) |
| 23.52–00.06 | Kenan'ın servis kamyoneti B sahasında durur. Kenan, kamyonetteki laşing kitinden aldığı twistlock'la Ercan'ın başının arkasına vurur; onu iki konteynerin arasına sürükler. | Kenan | Araç takip kaydı (ara karar), lastik izi ve sürüklenme izi (B sahası), otopsi (desenli kırık, karşı kutup yok) |
| 00.10 | Tarık eve döner; Gülay saati bilir. | Gülay | Gülay görüşmesi |
| 00.14 | Kenan'ın kamyoneti araç kapısından çıkar. | Kayıt | Turnike/araç kapısı dökümü |
| 06.10 | Sabah vardiyası cesedi B sahasında bulur. | — | Soğuk açılış |
| 08.00 | Kenan kolluğa: "23.40'ta B sahasının ağzında Tarık'ı gördüm, elinde demir gibi bir şey vardı; projektörler yanıyordu." Twistlock, rıhtım 4'teki kafeste bulunur; üstünde Tarık'ın kısmi izi, kan yok. | Kolluk | Dosya |
| 15 Kasım | Ön otopsi raporu: "künt kafa travması; düşme ya da künt cisim"; mide içeriği yazılı ama yorumlanmamış. B sahası projektörleri 23.00–02.00 bakımda. Kenan'ın kitindeki eksik twistlock "kayıp" diye tamamlanır. | — | Ön rapor (belge), projektör etiketi (olay yeri), envanter (ara) |
| Sonra | Tarık tutuklanır; iddianame TCK 81/1 ile Bursa 6. Ağır Ceza'ya. Baro görevlendirmesiyle tutulan avukat bir kez gelir. Gülay, 1. celseden 16 gün önce Deniz'i arar. | | Bölüm 1 |

**Savcılığın teorisi:** kavgadan sonra Tarık geri döndü ve Ercan'ı twistlock'la öldürdü (doğrudan kast; TCK 81/1).
Teori çökerse savcının yedeği: yumruk Ercan'ı babaya düşürdü, kafatası kırıldı, Tarık onu kanlar içinde bırakıp gitti
(olası kast; 81/1 + 21/2). Savunmanın katmanları:
1. **Dönüş yok** (turnike + büfe + Nail + Kenan'ın ifadesinin çökmesi) → savcı olası kasta geriler; kast yokluğu savunması
   yapılırsa **87/4** (yaralama sonucu ölüm), Emre'ye hakaret ve itme ispatlanırsa **+ haksız tahrik (29)**.
2. **Düşme değil, darbe; saat sonra** (desenli kırık + karşı kutup lezyonu yok + mide içeriği/kantin + 23.41 araması) →
   ölüm Tarık'ın eylemiyle bağlantılı değil: **223/2-e** (şüphe) ya da kanıt eksiksizse **223/2-b**.
3. **Gerçek fail** (Kaptan araması + araç takip + lastik izi + eksik twistlock + manifestoya girmeyen konteynerler) ve
   savcılığa suç duyurusu → **223/2-b** ve dosyanın Başsavcılığa gönderilmesi. Yumruk her beraat sonucunda TCK 86/2
   (şikâyete bağlı; şikâyet yok) → **CMK 223/8 düşme**.

## 4. Yapı (bölümler ve node haritası)

```
PR_00 Soğuk açılış (14 Kasım 23.02, isimsiz sesler) → PR_01 15 Kasım 06.10 B sahası → PR_02 08.00 Güzelyalı, gözaltı
BR_00 Bölüm 1 · Gülay büroda (yağmurlu gece; söz / ücret / dürüstlük) → BR_01 Leyla, ceza aralığı → BR_01B dosyadaki kâğıtlar → BR_02 Dosya + strateji
INV_SABAH Mudanya sabahı (araba, poyraz) → INV_HUB (4 gün × 3 EP; Leyla'ya danış günde 1, 0 EP; kolluk ifadeleri 0 EP)
  Olay yeri: INV_RIHTIM (sahne) · INV_BSAHA (sahne)
  Cezaevi: INV_GORUSME (konu × ton; konular fakta bağlı açılır)
  İnsanlar: INV_GULAY (ev; etik tuzak) · INV_SUKRU · INV_KENAN · INV_NAIL · INV_ORHAN (uzman görüşü)
  Arşiv: INV_TELEFON · INV_ONRAPOR · INV_TURNIKE (dilekçeyle) · INV_IFADE (0 EP) · INV_DIL (CMK 177, 2 hak) · INV_CIKARIM (9 tarif + çeldiriciler) · INV_LEYLA
  Gün sonu: INV_DAY_END (DECISION) → INV_AKSAM1 / INV_AKSAM2 / INV_AKSAM3
INV_GECE_* Duruşmadan önceki gece → H1_00 (koridor) → H1_01 iddianame → H1_02 sanık savunması → H1_03 Şükrü (ifade) → H1_04 itiraz
→ H1_02Q sanığa sorular (masumiyet karinesi) → H1_04B kısa ara → H1_05 Kenan (ifade; bastır/sun/itiraz) → H1_05K → H1_06 ara karar
talepleri (3 hak) → H1_07 tutukluluk → H1_08 erteleme
ARA_GIRIS_* → ARA_HUB (3 gün × 2 EP; yığınsız, doğrudan dönüş)
  ARA_SEVIM (maktulün eşi; defter, “Kaptan” lakabı) · ARA_TARIK (şema = eski tip kilit konisi) · ARA_KAYIT (araç takip + zimmet) · ARA_DEFTER · ARA_EMANET (sahne) · ARA_TALEP (ek talep)
  ARA_NURTEN (kolluk) · ARA_SUC (suç duyurusu) · ARA_KENAN (yüzleşme tuzağı) · ARA_CIKARIM (tahta) · ARA_LEYLA
  ARA_DAY_END → ARA_AKSAM_*
ARA_SON_* → T_00 → T_01 bilirkişi (ifade) → T_02 Kenan yeniden (ifade, CMK 48) | T_02Y → T_03 Nail → T_04 ek savunma (CMK 226)
→ T_05 mütalaa (DECISION varyantları) → T_06 cevap → T_07 esas savunma → T_08 son söz → T_09 hüküm → R_KARAR + epilog
T_COKUS (♥0) → T_09
```

## 5. Sahne sahne

> Sözcük sayıları hedeftir (± %20). Örnek satırlar tonu tarif eder.

### PR_00 — Soğuk açılış · "GECE 23.02" (~550) · bg: liman_gece
- `card`: "14 KASIM · GECE 23.02 — MUDANYA LİMANI, 4 NO'LU RIHTIM". Poyraz konteynerlerin arasında ıslık çalar.
- Uzak bir forkliftin farı iki silueti yakalar. **SARHOŞ SES**: "Kardeşin de senin gibiydi. Ayağına bakmazdı."
  **GENÇ SES**: "Ağzına alma onu." Bir tükürük. Bir itiş; çelik babaya çarpan bir omuz (`fx: shake`).
- Yumruk. Bir beden 7 no'lu babanın dibine oturur. Gülüş, kan, sövgü: "Seni gebertirim lan!" Sesin kime ait olduğu söylenmez.
- Fener sallayan biri yaklaşır; iki siluet ayrılır. Biri karanlığa yürür.
- narrator: "Saat 23.10'du. Ercan Yavuz'un hayatının son saatinin başı. Ya da sonu; dosya buna henüz karar vermemişti." (`fade`)

### PR_01 — "06.10" (~350) · bg: depo_gece → sokak_sabah
- Sabah vardiyası B sahasında iki konteynerin arasında bir beden bulur. Polis şeridi, martılar, sodyum lambalarının sönüşü.
- Bşk. Nurten Aydemir'in tek cümlesi: "Kavga kiminleydi?" Bir ses (Kenan'ın adı söylenmeden "vardiya şefi" diye): "Tarık'la."

### PR_02 — "08.00, Güzelyalı" (~300) · bg: ev
- Kapı çalınır. Tarık'ın sağ elinin boğumları yara. Elif uyuyor. Gülay'ın "Ne oldu?" sorusuna Tarık cevap vermez.
- narrator: "Dört gün sonra tutuklandı. İki ay sonra iddianame: kasten öldürme. On altı gün sonra ilk celse. Bir kadın, bir
  avukat aradı."

### BR_00 — Bölüm 1 · "Gülay Hanım" (~800) · bg: buro_gece
- `card`: "PERŞEMBE 21.15 — ARSLAN HUKUK, BURSA". Deniz (thought): "Kasımda yağmur dikiş tutmaz. Her yeri söker."
- Gülay ıslak bir kumaş çantayla girer: Tarık'ın liman kartı, bordrosu, Elif'in çizdiği bir gemi resmi.
- "Vurmuş. Biliyorum, vurmuş. Ama benim kocam adam öldürmez avukat hanım."
- Seçim (puanı yok, ilişki etkisi var): "Ücreti sonra konuşuruz" (güven +), "Vekâlet ücretini anlatayım" (nötr),
  "Söz veremem; doğruyu bulacağım" (dürüstlük, Gülay'ın etik tuzaktaki tutumunu yumuşatır).
- Leyla kapıda: "Bir yumruğun bedeli ile bir ölümün bedeli aynı değil. Ama bunu mahkemeye sen tarttıracaksın."

### BR_01 — Ceza aralığı (~550)
- Leyla: "İddianame 81/1. Savcının yedeği ne olur, bizim tabanımız ne olur?" A–D: 81/1 müebbet · olası kastta 20–25 yıl ·
  87/4'te 10–14 yıl (doğru üçlü) / yanlış seçenekler (85 taksirle öldürme "en kolayı"; 87/4 "8–12 yıl" eski metin;
  81/1 "15–20 yıl").
- Leyla'nın ters çerçevesi (thought, tek cümle).

### BR_01B / BR_02 — Dosyadaki kâğıtlar ve strateji (~500)
- Altı kâğıt: iddianame, ön otopsi raporu, Kenan'ın ifadesi, Şükrü'nün ifadesi, Tarık'ın kolluk ifadesi ("ittim"), twistlock
  ve kriminal rapor, maktulün telefon inceleme tutanağı.
- Strateji: Masumiyet ("Tarık vurdu, Deniz. Masumiyet derken neyi kastediyorsun?") · Usul/ispat ("Dosyanın en zayıf yeri,
  en çok güvendiği yerdir.") · Terditli ("Önce beraat, olmazsa ölçü. Ama ölçüyü erken söylersen beraati kendin bırakırsın.").

### Bölüm 2 · SORUŞTURMA (INV_*), ~5.000
- **INV_SABAH (~300):** Deniz'in arabası Mudanya yolunda; poyraz; liman vinçleri sisin içinde. Kapıdaki güvenlik:
  "İzin vardiya şefinden." **Uygulama kararı:** “Kaptan” lakabı soruşturmada hiç geçmez; telefon tutanağında yalnızca
  rehber kısaltması “Kptn” ve kenar notu “Kptn kim?” vardır. Vardiya ofisindeki çerçevesiz römorkör fotoğrafı tohumdur;
  lakabı ara evresinde Sevim Yavuz söyler (“Ercan ona Kaptan derdi; eskiden römorkör kaptanıymış”).
- **INV_HUB:** gün başına hedef kutusu (gün 1 "Tarık'ın ne yaptığını ve ne yapmadığını ayır"; gün 2 "Ercan kavgadan sonra
  ne kadar yaşadı?"; gün 3 "Kâğıtlar: rapor, telefon, kart"; gün 4 "Dilekçe son gün").
- **INV_GORUSME — Görüş odası (~1.400):** Cevdet: "Kızının resmine bakıyor her gece." Tarık ellerine bakar.
  Konular: O gece · Ercan · Vardiya (twistlock) · Eve dönüş (açılır: Gülay ya da hesap dökümü) · Ağabeyin (açılır: Şükrü ya
  da "Ercan" konusu) · Kaptan (açılır: Kenan ziyareti ya da telefon kaydı). Sert ton bilgi verir, güveni düşürür.
  - Kırılma: güven yeterliyse "Vurdum. Bir kere. Polise ittim dedim, utandım." Bu, savunmanın temelidir.
- **INV_GULAY — Güzelyalı'daki ev (~800):** dikiş makinesi, Elif'in resmi. Hesap dökümü: 23.37 İskele Büfe. **Etik tuzak:**
  "Saati 23.30 desem? Kimse bilmez." Doğru: "Gördüğünüz saati söyleyin." Yanlış: "23.30 deyin" → TCK 272 + 38, Av.K. 34.
- **INV_SUKRU — Forklift garajı (~600):** "Ha?" Cihazın pili. Kantin: "Burnunda pamuk, tost yiyordu." "Kaptan ayırdı."
- **INV_KENAN — Vardiya ofisi (~600):** termos kahve, bez parçası, "evlat". "Projektörler yanıyordu, gündüz gibiydi."
  Telefon kaydı bulunduysa "Ercan seni aramış mı?" sorusu açılır: sormak **Kenan'ı uyarır** (`kenan_uyarildi`; arada
  envanter düzeltilir, bir delil kaybolur).
- **INV_NAIL — İskele büfesi (~500):** radyo, buğulu cam; "Çocuk ağlıyordu. Erkek adam öyle ağlamaz, ağladı." (açılır: hesap
  dökümü ya da eve dönüş konusu).
- **INV_ORHAN — Emekli adli tıpçı (~600):** coup / contrecoup dersi: "Hareketli baş, sabit zemin: karşı tarafta da yara.
  Sabit baş, hareketli cisim: yalnız vurulan yerde." (açılır: ön rapordaki desen ya da karşı kutup satırı).
- **INV_RIHTIM / INV_BSAHA (sahneler):** baba 7'deki kan oturma hizasında; projektör direğinde bakım etiketi; laşing kafesi;
  B sahasında topuk sürüklenme izleri, taze çift lastik izi, rıhtımdan B'ye kan izi yok. Çeldiriciler: rakı matarası, martı
  tüyü, eski kaynak lekeleri.
- **INV_TELEFON / INV_ONRAPOR (belgeler):** "Kaptan 23.41 · 2 dk 07 sn"; "3,2 cm dairesel çökme kırığı", "karşı kutup
  lezyonu saptanmadı" (küçük not), "mide: yarı sindirilmiş ekmek, peynir, süt ürünü", "burun/dudak: basit tıbbi müdahale".
- **INV_AKSAM (gün sonları):** Leyla ile kısa sahne; Gülay'ın telefonu (Elif'in sorusu); Kenan uyarıldıysa babacan bir
  arama: "Evlat, kendini yorma."
- **INV_GECE (~400):** pano, poyraz, Leyla: "Yarın birinin elinde bir yumruk var, birinin elinde bir ölüm. Karıştırma."

### Bölüm 3 · BİRİNCİ CELSE (H1_*), ~2.600 · bg: durusma_salonu
- Koridorda Gülay ve (ön sırada) Sevim. İki kadın birbirine bakmaz.
- Sanık savunması: Tarık'a ne tavsiye ettin? Dürüst savunma ("vurdum, bir kere") / inkâr ("ittim") / meşru müdafaa /
  susma. Dürüst savunma tahrikin ve kast yokluğunun temeli; inkâr Şükrü karşısında çöker.
- Şükrü: "Ha?" — bastırınca pil; doğru zamanda "Bilmiyorum, sesi babanın oradan geldi" der.
- Kenan: sakin, babacan; bastırma ve delil sunumuyla ifadesi çatlar (projektör, turnike). Asla "katil" sözcüğü geçmez.
- Ara karar: ATK'dan nihai rapor ve bilirkişinin dinlenmesi, araç takip ve kantin kayıtları (dayanağı varsa), tutukluluk.

### Bölüm 4 · ARA (ARA_HUB, 3 gün × 2 EP), ~3.000
- **ARA_SEVIM:** kapı aralığından öfke → defter: "Ercan bunu buzdolabının üstünde saklardı."
- **ARA_TARIK:** otopsi şemasını görür: "Bu… bunu bilirim. Twistlock'un konisi."
- **ARA_GPS / ARA_DEFTER (belgeler):** araç takip satırı 23.52–00.06 B sahası; defterdeki üç konteyner manifestoda yok.
- **ARA_EMANET (sahne):** emanet fotoğrafları: Tarık'ın montunda yalnız damla kan; emanetteki twistlock temiz.
- **ARA_NURTEN / ARA_SUC:** bilgi kolluğa değil savcılığa; suç duyurusu somut dayanakla. Kenan'la yüzleşmek kötü işaret.
- **ARA_AKSAM:** tahliye olduysa Tarık mutfakta Elif'e gemi çizer; olmadıysa Gülay boş sandalyeye tabak koyar.

### Bölüm 5 · İKİNCİ CELSE (T_*), ~3.000
- Bilirkişi Doç. Dr. Karaca: "olabilir" ile "uyumludur" arasındaki fark; doğru delille raporu daraltır.
- Kenan yeniden: başkan CMK 48'i hatırlatır; Kenan susar. Salon sessizleşir. Sevim ayağa kalkar, oturur.
- Mütalaa varyantları; cevap; esas savunma Deniz'in ağzından 3–5 satır; Tarık'ın son sözü.

### EPİLOGLAR (her biri ~250–400)
- **BERAAT_B:** Yağmur diner. Sevim koridorda: "Defteri doğru ellere vermişim." Tarık Emre'nin mezarına gider. Son kart:
  "Kenan Aksoy hakkında soruşturma başlatıldı."
- **BERAAT_E:** Tarık çıkar; liman kapısında işçiler başlarını çevirir: "Şüpheden." Deniz (thought): "Kapı açıldı; ışık hâlâ
  kapalı."
- **NİTELİK (87/4 + 29):** Ring aracının camı; Tarık: "Bir yumruğun bedeli bu mu abla?" Deniz: "Ödediğin bedel senin
  yumruğun değil." (thought) — eksik kalan kırk dakika.
- **MAHKÛMİYET (olası kast / müebbet):** Gülay Elif'in gemi resmini Deniz'e verir. Deniz (thought): "Bir yumruk. Bir
  boşluk. Ve benim dolduramadığım kırk dakika."
- **ETİK:** Leyla masaya Avukatlık Kanunu'nu bırakır, bir şey söylemez. Gülay hakkında yalan tanıklık soruşturması.
- **ÇÖKÜŞ:** Savcı dosyasını toplarken: "Bir yumruğu savunmak zordur, avukat hanım. Bir cinayeti savunmaktan zor."

## 6. Uygulama notları (yazımdan sonra)

- Kod: `content/src/liman-gecesi/` (96 node). Bölümler, node haritası ve ölçümler için bkz. `docs/content/liman-gecesi.md`.
- 1. celse ile 2. celse arasındaki ters köşe, mahkemeden istenen BTK abone bilgisiyle gelir; oyuncu 23.41 aramasını bulup
  talep etmemişse ara evresinde ek talep (ARA_TALEP) ya da Sevim Yavuz'un “Kaptan” lakabı ve defter yoluyla da bağ
  kurulabilir.
- Akşam sahneleri (INV_AKSAM1–3, ARA_AKSAM1–2) kısa seçimlerle biter; “Devam” düğmesi yerine bir karar.
- Epiloglar `OutcomeDef.epilogue` olarak yazıldı: ETIK, BERAAT_B, BERAAT_E, NITELIK (87/4 + 29), MAHKUMIYET (çöküş notuyla).
