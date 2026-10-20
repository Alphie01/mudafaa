# Dava #08 — Kırık Kadeh · Hikâye Kitabı (noir)

> Bu belge Dava #08'in **anlatı çıtasıdır** ve kod yazılmadan önce yazıldı. Yapı ve yoğunluk Dava #07 v2 hikâye kitabını
> (`docs/content/gece-bekcisinin-sirri-hikaye.md`) izler. Hukuki gerçek, delil zinciri, sonuç koşulları ve puan mantığı
> `docs/content/kirik-kadeh.md` ve `docs/legal/kirik-kadeh.md`'dedir; bu belge onları **sahneye** çevirir.

## 0. Ton ve kurallar

- **Noir dram.** Bursa, ocak sonu, Setbaşı. Gökdere'nin taşkın sesi, yağmur, köprü altında sarı sokak lambası. Gölge adlı
  küçük bir bar: koyu ahşap tezgâh, pirinç ayak demiri, duvarda solmuş bir boks fotoğrafı. Her sahnede bir duyusal ayrıntı:
  rakının anason kokusu, cam kırığının ayak altında çıtırtısı, sargı bezinin iyot kokusu, florasanın vızıltısı.
- **İç ses.** Deniz `style: "thought"` ile birinci tekil, kısa, keskin. Gözlemler, sezer, alay eder; **çözümü söylemez.**
  - Örnek: *"Barlarda iki tür sessizlik vardır: kapanıştan sonraki ve kavgadan hemen önceki. İkincisi daha gürültülüdür."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numaraları yalnızca Leyla'nın kısa açıklamalarında, seçenek geri
  bildiriminde, rapor ve hüküm metninde, duruşmadaki resmî konuşmada (savcı, hâkim, Tolga Şen'in resmî talepleri) geçer.
- **Gizem korunur.** Soğuk açılışta herkes isimsizdir (`speaker: "narrator"`, `name: "BİR SES"`, `"İKİNCİ SES"`,
  `"KADIN SESİ"`). Kimin önce saldırdığı **görünmez**: ekran kararır, yalnızca cam kırılma sesi ve bir çığlık. Onur'un
  Serkan'ın arkadaşı (ve çalışanı) olduğu oyuncuya **söylenmez**; adisyon, kolluk ifadesi ve eczane kamerasından oyuncu
  kendisi kurar. Bora'nın sakladığı tanık (Ece) de ancak sahnede önlük bulunduğunda ya da Bora sıkıştırıldığında ortaya çıkar.
- **Her sahne bir şey değiştirir.** Yeni bilgi, yeni şüphe ya da bir ilişkide kırılma.
- **Satır kuralları:** ≤ ~220 karakter; her yeni mekânda ilk satır `style: "card"` + `bg`; sert anlarda `fx` (kapı/tokmak
  `shake`, flaş/şimşek `flash`, bölüm sonu `fade`).
- **Kelime bütçesi:** tipik yol (BERAAT_E) ~13–16 bin sözcük (`case:duration`); tüm dallar ≥ 18 bin. Süre 90–120 dk.

## 1. Kadro: sesler, sırlar, yaylar

| Karakter (kimlik) | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **Deniz Arslan** (`deniz`, oyuncu) | 31, büroda üçüncü yıl. Dava #07'den sonra ilk "kendi" dosyası. | Kısa, alaycı iç ses; dışarıda nazik ama inatçı. | Kavgalardan nefret eder; babası da bar kavgasında bir gece hastanelik olmuştu (yalnızca bir iç ses satırı). | Önyargı ("barcı, eski boksör") → insanı görmek. Müvekkilin sırrını korumakla gerçeği ortaya koymak arasında çizgiyi öğrenir. |
| **Leyla Erdem** (`leyla`, mentor) | 58, büronun kurucusu. | Az konuşur; her cümlesi bir ders. Sigara paketini çevirir, yakmaz. | Ters çerçeve yerinde (Dava #15 tohumu; bu davada yalnızca bir an). | Deniz'i izler, kurtarmaz. Tanıkla görüşme ve karşı tarafla temas konusunda sert. |
| **Bora Yalçın** (`bora`, müvekkil, sanık) | 47, Gölge bar'ın sahibi. Gençliğinde amatör boksör (milli takım kampı, 1996). Sabıkasız. | Çok az konuşur; on kelimeyi geçen cümlesi yok. "Avukat hanım." Konuşurken bardak siler. Güldüğünde yalnızca burnundan nefes verir. | **1)** Kameralar her gece 01.00'de zaman ayarlı prizle kapanır: ruhsat saati 01.00, o 02.00'ye kadar servis yapar (idari para cezası ve ruhsat korkusu). **2)** Olaydan sonra garsonu Ece'yi polis gelmeden arka kapıdan gönderdi: Ece sigortasızdı, ailesi barda çalıştığını bilmiyor. Dosyada Ece'nin adı yok. | Gurur ve suskunluk → "Ben vurdum, gerisi beni ilgilendirmez" → Ece'yi korumanın ona neye mal olduğunu görür; Ece'nin kararına saygı duymayı öğrenir. |
| **Serkan Aydemir** (`serkan`, katılan/müşteki) | 35, Aydemir Sigorta Aracılık'ın satış müdürü (babasının şirketi). | Yüksek sesli, yapışkan bir neşe; "kardeşim", "bak şimdi", "biz medeni insanız". Duruşmada mağdur rolünü ağlamaklı oynar. | O gece 1,9 promil. Ece'yi bileğinden tutup "bir kadeh benimle" dedi; Bora uyarınca rakı kadehini tezgâha vurup kırdı ve sapıyla saldırdı. Bora'nın önkolundaki kesik nedeniyle ayrı bir soruşturmada **şüpheli**; tazminat ve "karşı şikâyeti ezmek" istiyor. | Kibir → duruşmada kendi yalanlarına takılır. Kötü değil, kendine acıyan bir sarhoş. |
| **Onur Kılıç** (`onur`, görgü tanığı) | 33, Aydemir Sigorta'da satış uzmanı: Serkan'ın **çalışanı** ve arkadaşı. | Kibar, fazla düzgün cümleler; ezberlenmiş gibi. "Açıkçası…", "net olarak gördüm". Gözünü kaçırır, kol saatini düzeltir. | Kollukta "müştekiyi tanımam, bara tek gittim" dedi. Serkan'la birlikte geldiler; hesabı Onur'un kartı ödedi. Masası kolonun arkasındaydı; yerde olanı göremezdi. Serkan "terfin benden" dedi. | Yalan → çözülme. Kürsüde kırılması ikinci celsenin doruğudur: "Müdürüm o. Yerde… tekme görmedim. Ayağı bileğindeydi." |
| **Ece Tan** (`ece`, saklanan tanık) | 22, Bursa'da üniversite öğrencisi, Gölge'de sigortasız garson. | Hızlı konuşur, cümlelerini yarıda keser; sinirlenince Kütahya ağzı çıkar ("he ya", "gız"). Saçını kulağının arkasına atar. | Babası barda çalıştığını bilmiyor. Serkan'ın bileğini sıktığını, kadehi kıranın ve sapla saldıranın Serkan olduğunu gördü. Polis gelmeden Bora onu arka kapıdan gönderdi. | Korku → karar. Tanıklığı **kendi** kararıdır; Deniz onu yönlendirirse (etik ihlal) kürsüde çöker. |
| **Av. Tolga Şen** (`tolga`, katılan vekili) | 44, Bursa'nın "usul avcısı". | Pürüzsüz, gülümseyerek keser. Duruşmada madde numarasıyla konuşur; koridorda samimi ve tehlikeli. "Meslektaşım." | Müvekkilinin karşı soruşturmasını öldürmek için bu davayı büyütüyor. Özel bir klinikten "3. derece" rapor alır. | Rakip. Doğru delil karşısında geri çekilmeyi bilen bir profesyonel. |
| **Savcı Orhan Baysal** (`savci`) | 50 | Yorgun, adil, dosyaya sadık. "Tutanak böyle diyor." | — | Delil yeterliyse mütalaada meşru müdafaayı kendisi ister. |
| **Hâkim Selma Karaca** (`hakim`) | Bursa 7. Asliye Ceza | Sabırlı, kısa, net; kimseye söz kestirmez. "Soruya itiraz var. Gerekçe?" | — | — |
| **Mübaşir Rıza Bey** (`mubasir`) | 60 | Dosya adını şarkı gibi uzatır. | — | — |
| **Polis Memuru Sinan Kurt** (`polis`) | 29 | Ürkek, dürüst; tutanağı aceleyle yazdığını bilir. | Kırık sapı "tezgâhın önünde" yazdı; aslında müştekinin elinin altındaydı. | Ara evresinde bunu söyler (yalnızca: "Fotoğraf 7'ye bakın.") |
| **Defne Yurt** (`defne`, telefon sesi) | 26 | Hızlı, şehirli, telefonda. | O gece masa 7'de bir Instagram hikâyesi çekti; arka planda tezgâh görünüyor. Hikâye 24 saatte silindi, arşivinde duruyor. | Ara evresinde videoyu gönüllü verir. |

## 2. Gerçek ve kronoloji

| Saat (2 Kasım gecesi) | Olay |
|---|---|
| 22.10 | Serkan ve Onur birlikte Gölge'ye girer (eczane kamerası). Masa 4, kolonun arkası. |
| 23.30–00.50 | Altı duble rakı. Serkan Ece'ye laf atar. Masa 7'de Defne ve arkadaşı. |
| 01.00 | Kameralar zaman ayarlı prizle kapanır (her gece). |
| 01.35 | Serkan tezgâha gelir, Ece'nin bileğini tutar. Bora "Bırak kızı. Hesabını öde, çık." der. Serkan: "Sen kim oluyorsun, eski kafa travmalı boksör." |
| 01.40 | Serkan rakı kadehini tezgâhın müşteri tarafındaki kenarına vurur, kırar; sapı elinde tezgâhın üstünden Bora'ya savurur. Bora'nın sol önkolu (ulnar yüz) kesilir; kan tezgâhın iç tarafına damlar. |
| 01.40:30 | Bora tezgâhın arkasında sıkışık (kaçış yok); Serkan'ın bileğini tutar, tek yumruk: burun. Serkan geriye, tabureye çarparak yere düşer; düşerken sapı kavradığı avucu kesilir. |
| 01.41 | Defne'nin 15 saniyelik hikâyesi (arka planda saldırı). Onur kolonun arkasından kalkar, Bora'yı arkadan tutmaya çalışır; Bora onu iter. |
| 01.41:20 | Serkan yerde sapı yeniden kavrar; Bora tezgâhtan çıkıp ayağıyla Serkan'ın **sağ bileğine basar**, sapı bıraktırır, uzağa iter. ("Tekme" diye anlatılan budur.) |
| 01.45 | Bora Ece'ye "Arka kapı. Git. Seni burada görmedim." der. Ece gider (eczane kamerası 01.52: arka sokaktan koşan kadın). |
| 01.50 | Bora polisi ve ambulansı kendisi arar. |
| 02.05–02.10 | Polis ve ambulans. Sinan Kurt tutanak ve fotoğraflar (fotoğraf 7: sap, müştekinin sağ elinin altında). Tutanağa "tezgâh önünde" yazılır. |
| 02.25 | Serkan acilde: anamnezde "yumrukla vuruldu" der; kan alkolü 1,9 promil; burun kemiği kırığı (deplasmansız); sağ avuç içinde transvers kesi. |
| 03.30 | Karakolda Onur: "Müştekiyi tanımam, tesadüfen oradaydım. Sanık kadehi kırıp yüzüne vurdu, yerdeyken tekmeledi." Bora: "Saldırdı. Vurdum. Bir kere." |
| Aralık | İddianame: TCK 86/1, 86/3-e, 87/3. Serkan katılan; vekili Tolga Şen. Bora tutuksuz yargılanıyor. Tensip: 1. celse ocak sonu. |
| Ocak, 1. celseden 10 gün önce | Bora, büroya gelir. Oyun burada başlar. |

## 3. Yapı (bölümler ve node haritası)

```
PR_00 Soğuk açılış (01.39, isimsiz sesler; kimin saldırdığı görünmez) → PR_01 Sabah: karakol, iki ifade
BR_00 Bölüm 1 · DOSYA: Bora büroda (sargılı kol) → BR_01 Leyla, ceza aralığı → BR_01B dosya devri → BR_02 dosya + strateji
INV_SABAH Setbaşı, kapalı bar → INV_HUB (3 gün × 4 EP; Leyla'ya danış günde bir, 0 EP; tahta 0 EP)
  OLAY YERİ: INV_ARAMA (bar içi) · INV_ARAMA2 (kolluk fotoğrafları) · INV_ARAMA3 (dış sokak)
  KİŞİLER: INV_BORA (görüşme, konu × ton, fakta bağlı konular) · INV_BORA2 · INV_ONUR · INV_TOLGA · INV_ECE (kilitli) · INV_ECZANE (kilitli)
  ARŞİV: INV_HASTANE · INV_DARP · INV_IFADE (belgeler) · INV_DIL (dilekçe) · INV_CIKARIM (7 tarif + çeldiriciler) · INV_LEYLA
  Gün sonu: INV_DAY_END (DECISION) → INV_AKSAM1 (Tolga'nın teklifi) / INV_AKSAM2 (Bora'nın gece telefonu)
INV_GECE_* duruşmadan önceki gece (koşullu hafıza zinciri) → H1
H1_00G koridor → H1_00 açılış → H1_01 iddianame → H1_02 Bora'nın savunması (oyuncu yönlendirir) → H1_03 boksörlük itirazı
  → H1_04 Serkan'ın beyanı (K1–K5; bastır/sun/itiraz) → H1_05 delil talepleri → H1_ARA erteleme
ARA_GIRIS → ARA_HUB (2 gün × 3 EP; yığınsız, doğrudan dönüş)
  ARA_ECE (Ece'nin babası arar; karar) · ARA_ONUR (Onur kapıda; etik sınır) · ARA_SINAN (fotoğraf 7) · ARA_DEFNE (kilitli)
  ARA_ATK / ARA_KRIMINAL (belgeler) · ARA_BORA (Ece'nin sırrı yüzleşmesi) · ARA_CIKARIM · ARA_LEYLA
  ARA_DAY_END → ARA_AKSAM → ARA_SON_* → T
T_00G koridor → T_00 açılış → T_01 özel rapor (itiraz) → T_02 Onur (O1–O5) ⇄ T_02H kırılma
  → T_03 Ece (Tolga'nın soruları; itiraz) → T_04 video / boş ekran → T_05 mütalaa → T_06P dayanaklar → T_06 esas savunma
  → T_07 son söz → T_08 hüküm → R_KARAR + epilog | T_COKUS (♥0) → T_08
```

## 4. Sahne sahne

> Sözcük sayıları hedeftir (± %20). Örnek satırlar tonu tarif eder.

### PR_00 — Soğuk açılış · "GECE 01.39" (~650) · bg: sokak_karanlik → siyah
- `card`: "3 KASIM · GECE 01.39 — SETBAŞI, BURSA". Gökdere taşkın; köprünün altında sarı lamba.
- narrator: "Gölge'nin tabelasındaki G harfi üç aydır yanmıyordu. İçeriden bakınca, ölçe yazıyordu."
- İçeride (bg: siyah, yalnızca sesler): BİR SES (kalın, alçak): "Bırak." · İKİNCİ SES (yüksek, sarhoş): "Sen kim oluyorsun be?" ·
  KADIN SESİ: "Abi, tamam, abi—"
- Cam kırılma sesi (`fx: flash`). Bir tabure devrilir (`fx: shake`). Kimin kimi tuttuğu görünmez.
- narrator: "Sonraki on saniyeyi dört kişi dört ayrı biçimde anlatacaktı. Biri hiç anlatmayacaktı."
- BİR SES (fısıltı): "Arka kapı. Git. Seni burada görmedim."
- narrator: "Saat 01.50'de biri 112'yi aradı. Arayan, sonradan sanık olacak adamdı." (`fx: fade`)

### PR_01 — "KARAKOL 03.30" (~400) · bg: karakol
- İki ifade, iki sandalye. Onur (adı görünür ama rolü: "tanık"): "Müştekiyi tanımam. Tesadüfen oradaydım. Net olarak gördüm."
- Bora (sargılı kol): "Saldırdı. Vurdum. Bir kere." Polis: "Kolunuz?" Bora: "Bir şey değil."
- narrator: "Dosya o sabah kapandı sayıldı: bar sahibi, eski boksör, kırık bir burun, kırık bir kadeh. Kimse ikinci bir kadeh sormadı."

### BR_00 — Bölüm 1 · "Gölge'nin sahibi" (~850) · bg: buro_gece
- `card`: "PERŞEMBE 22.10 — ARSLAN HUKUK, BURSA". Deniz yalnız, yağmur.
- Bora kapıyı çalmadan girer, ıslak kasket, sargılı sol kol. Masaya bir zarf değil, **bir anahtar** koyar: Gölge'nin anahtarı.
  "Barı kapattım. Açarsam herkes bakar. Kapalı da bakıyorlar."
- Deniz'in önyargısı (thought): "Eski boksör, bar sahibi, kırık burun. Dosyanın yarısını kapıdan girerken okudum. Yanlış okudum mu?"
- Seçim (ilişki): "Önce kolunuzu görelim." (trust +, Bora sargıyı açar, 6 cm kesik → ilk ipucu tohumu) / "Ücreti konuşalım." (nötr) /
  "Vurduğunuzu kabul ediyorsunuz, değil mi?" (trust −, ama dürüst yanıt: "Bir kere.").
- Leyla kapıda; Bora gidince: "Az konuşan müvekkil iki şey saklar: utancını ya da birini."

### BR_01 / BR_01B — Ceza aralığı ve devir (~650) · bg: buro_gece
- Leyla: "86/1, 86/3-e, 87/3. Aralık?" A–D. Doğru: 2 yıl 3 ay'ın üstü – 6 yıl 9 ay; asliye ceza. Leyla paketi çevirir.
- Yanlış (ör. 87/3'ü "iki katına kadar" sanmak): "Eski metni okuyorsun. 2006'dan beri yarısına kadar."
- Devir: "Meşru müdafaa bir cümleyle kazanılmaz. Dört şeyi ispatlayacaksın: saldırı, o an, orantı, başka çıkış yokluğu."

### BR_02 — Dosya ekranı + strateji (~250)
- Masumiyet (meşru müdafaa) → "Cesur. Saldırıyı ondan önce kanıtlaman gerekecek."
- Usul → "Tutanak aceleyle yazılmış. Acele, savunmanın en iyi tanığıdır."
- Terditli (tahrik + derece) → "Güvenli. Ama Bora'ya 'haklıydın ama ceza alacaksın' diyebilecek misin?"

### Bölüm 2 · SORUŞTURMA (INV_*), ~5.000
**INV_SABAH (~250):** Setbaşı, kapalı bar, kepenkte "KAPALI" yazısı Bora'nın el yazısı. Leyla'nın SMS'i (phone): "Önce yere bak. İnsanlar sonra."

**INV_HUB:** Hedef kartı gün başına (1: "Kim kimin yanında oturuyordu? Kadeh kimin elindeydi?"; 2: "Tanığın gözü nereye
bakıyordu? Kayıtlar silinmeden yetiş."; 3: "Dilekçe son gün. Kimi dinletiyorsun?"). Hızlı konuşma: Bora, "Vurdum. Bir kere."

**INV_ARAMA — Gölge'nin içi (sahne):** zaman ayarlı priz (kamera 01.00 kapanış), Ece'nin önlüğü (isim kartı "ECE" →
saklanan tanık), kolon (masa 4'ten tezgâhın önü görünmez), adisyon çivisi (masa 4: 2 kişi, kart: O. KILIÇ), boks fotoğrafı
(çeldirici), kırık ayna (ıska).

**INV_ARAMA2 — Kolluk fotoğrafları (sahne):** fotoğraf 7 (kırık sap, yerde, düşen adamın sağ elinin yanında), tezgâhın iç
kenarındaki kan (Bora önce tezgâh arkasında kanadı), kırılma noktası (cam kırıkları müşteri tarafındaki kenarda), masa 4
(iki kadeh, iki ceket).

**INV_ARAMA3 — Gökdere sokağı (sahne):** nöbetçi eczanenin kamerası kapıya bakıyor (kayıt 15 gün saklanır → acele),
arka sokak (Ece'nin kaçış yolu), taksi durağı (çeldirici).

**INV_BORA — Görüşme (bar, tezgâhın başında):** konular O gece / Kolun / Serkan / Kameralar (zaman ayarlı priz
bulununca) / Önlük (önlük bulununca: Bora susar, sert tonda "Bir kız vardı. Gönderdim." itirafı) / Geçmiş (boks).
Yumuşak ton güven, sert ton bilgi ama güven kaybı. Görüşme 20 dk.

**INV_ONUR — Sigorta acentesinin kapısı (~550):** Onur kibar ve ezberli. Seçimler: "Masanız neredeydi?" (bilgi) /
"Yalan tanıklığın cezası ağır" (TCK 277 tuzağı, etik) / "Kartınızla kim ödedi?" (adisyon bulunduysa; Onur bocalar, gider).

**INV_TOLGA — Tolga'nın bürosu (~450):** Rakip nezaketi; "Meslektaşım, müvekkilim bir uzlaşmaya açık." Teklif akşam gelir.
Seçim: Serkan'la doğrudan konuşmak istemek (etik: karşı tarafla avukatı dışında temas) / dosya incelemek.

**INV_ECE — Kütahyalı garson (kilitli; önlük ya da Bora itirafıyla açılır) (~800):** Üniversite kantini. Ece korkar;
babası. Deniz'in seçimi: "Ne gördüysen onu anlat; görmediğini söyleme." (doğru) / "Kadehi önce onun kaldırdığını kesin
söylemelisin." (yönlendirme → etik ihlal; kürsüde çöker) / "Tanık olmak zorunda değilsin." (yanlış bilgi; tanıklık
çağrılınca zorunludur). Ece Defne'den söz eder ("masa 7'deki kız video çekiyordu" → ARA ipucu).

**INV_ECZANE (kilitli; kamera bulununca):** Eczacı: "Kayıt 15 gün. Mahkeme isterse veririz." Dilekçede istenmezse silinir.

**INV_HASTANE / INV_DARP / INV_IFADE — Belgeler:** acil kaydı (1,9 promil; anamnez "yumrukla"; avuç içi kesi;
deplasmansız kırık) · Bora'nın darp raporu (sol önkol ulnar yüzde kesi) · Onur'un ifade tutanağı (tanımam / kadehle vurdu /
yerde tekmeledi / her yeri gördüm).

**INV_DIL — Delil dilekçesi:** eczane kaydı (acele), Kriminal inceleme (sap üzerindeki izler), ATK kesin rapor, Ece'nin
tanık olarak dinlenmesi, (çeldirici) Bora'nın karakter tanıkları, (yanlış) Onur'un dinlenmemesi talebi.

**INV_CIKARIM — Tahta:** 7 tarif (bkz. tasarım belgesi §7) + çeldiriciler (boks fotoğrafı, taksi durağı).

**INV_LEYLA:** günde bir; meşru müdafaanın dört şartı, tanıkla görüşme sınırı, şikâyetten vazgeçmenin bu davada işe
yaramaması (86/3-e şikâyete bağlı değil).

**Gün sonları:** Gün 1 → Tolga'nın teklifi telefonda (phone): "Yetmiş bin, şikâyetten vazgeçer." Doğru: reddet ve nedenini bil.
Gün 2 → Gece 02.00'de Bora arar: "Barın önünde biri dikiliyordu. Gitti." (Onur ziyaret edildiyse "Onur'du galiba.")

**INV_GECE — Duruşmadan önceki gece (~400):** Pano; bulunanlar koşullu sayılır. Leyla: "Yarın Bora konuşacak. Ona ne
diyeceğini söyleme. Doğruyu söylemesinin bedelini söyle."

### Bölüm 3 · BİRİNCİ CELSE (H1_*), ~2.200 · bg: durusma_salonu
- `card`: "BURSA 7. ASLİYE CEZA MAHKEMESİ — 1. CELSE". Rıza Bey: "Bora Yalçııın!"
- Koridorda Serkan burnunda bantla, Onur iki adım arkasında; birlikte geldiler. (Oyuncu Onur'un rolünü henüz bilmiyorsa bu
  yalnızca bir ayrıntıdır.)
- **H1_02 Bora'nın savunması:** oyuncu yönlendirir: "Olduğu gibi anlat" / "Ece'den bahsetme" (müvekkilin kararı; etik değil
  ama bedeli var) / "Hiç vurmadığını söyle" (yalan → güvenilirlik çöker).
- **H1_03:** Tolga Bora'nın boksörlük geçmişini dosyaya sokar → itiraz (davayla ilgisiz/karakter).
- **H1_04 Serkan'ın beyanı (yeminsiz, katılan):** K1 "bir iki kadeh" · K2 "Onur'u o gece tanıdım" · K3 "elimde bir şey yoktu" ·
  K4 "kadehi yüzüme vurdu" · K5 "sadece hesabı sordum". Bastır, sun, itiraz.
- **H1_05:** Delil talepleri (ATK, Kriminal, eczane, Ece, Onur'un 2. celsede dinlenmesi). Hâkim ara karar kurar.
- **H1_ARA:** Bir ay erteleme. Koridorda Tolga: "Güzel başladınız. Bitiş başka."

### Bölüm 4 · ARA (ARA_HUB, 2 gün × 3 EP), ~2.500
- **ARA_ECE:** Ece'nin babası aramış (biri ona "kızın barda çalışıyor" demiş). Ece vazgeçmek üzere. Deniz yönlendirmez;
  seçim ona aittir. Güven ve dürüstlük yeterliyse: "Ben gördüğümü söylerim. Babam da duyar. Duysun."
- **ARA_ONUR:** Onur bürounun kapısında, yağmurda: "Konuşmak istiyorum." Doğru: ifade almamak, "Avukatınla savcılığa git"
  demek. Yanlış: kayda almak ya da "Şimdi anlat" demek.
- **ARA_SINAN:** Polis memuru: "Tutanağı ben yazdım. Fotoğraf 7'ye bakın. Ben… acele ettim."
- **ARA_ATK / ARA_KRIMINAL:** ATK: derece 1, sağ el bileğinde bası izi (kırık yok). Kriminal: sapta Serkan'ın avuç izi
  (kavrama konumunda), tabanda Bora'nın kısmi izi (servis).
- **ARA_DEFNE (kilitli):** Telefonda Defne: "Hikâye mi? Arşivde var. Mahkemeye mi? Gönderirim, ama adım geçmesin." →
  Deniz: adın geçecek, mahkeme isteyecek; gönüllü teslim + bilirkişi.
- **ARA_BORA:** Ece'nin babası olayını öğrenen Bora: "Ben gönderdim onu. Benim yüzümden." Ruhsat ve kamera.
- **ARA_SON:** Gece, pano; Leyla: "Yarın Onur'a soracakların, onu kurtaracak sorular olsun. Batıracak değil."

### Bölüm 5 · İKİNCİ CELSE (T_*), ~2.500
- `card`: "BİR AY SONRA — 2. CELSE". Tolga özel kliniğin "3. derece" raporunu sunar → itiraz (ATK resmî kurum raporu, özel
  rapor uzman mütalaası; çelişkide ATK/üst kurul).
- **T_02 Onur:** O1 "tesadüfen oradaydım" · O2 "kadehi kırıp vurdu" · O3 "yerdeyken tekmeledi" · O4 "Serkan elini kaldırmadı" ·
  O5 "her yeri görüyordum". Kırılma (T_02H): "Müdürüm o. Ben… yerde tekme görmedim. Ayağı… bileğindeydi. Elinde cam vardı."
- **T_03 Ece:** Tolga'nın sorusu: "Babanız bu işi biliyor mu?" → itiraz (davayla ilgisiz, onur kırıcı). Ece'nin anlatımı.
  Yönlendirildiyse: Tolga "Avukat hanım size ne söyleyeceğinizi söyledi mi?" → Ece: "…Evet. 'Kesin gördüm de' dedi." Çöküş.
- **T_04 Video:** Defne'nin videosu oynatılır (yalnızca elde edildiyse): on beş saniye, tezgâh, bir kol, bir parıltı.
- **T_05 Mütalaa:** delil gücüne göre üç varyant (mahkûmiyet / tahrik ve derece / meşru müdafaa).
- **T_06 Esas savunma:** dayanak seçimi (3), ardından konuşma: meşru müdafaa (223/2-d) · şüphe (223/2-e) · sınırın aşılması
  (223/3-c) · terditli (tahrik + derece).
- **T_07 Son söz:** Bora: "Ben vurdum. Bir kere. Bir daha olsa yine vururum. Ama kızı göndermezdim."

## 5. Epiloglar (OutcomeDef.epilogue, her biri ~250–400)
- **BERAAT_D (223/2-d, meşru müdafaa):** Gölge'nin kepengi yarıya kadar açılır. Ece tezgâhın arkasında, sigortalı; bir
  zarfta SGK girişi. Bora boks fotoğrafını duvardan indirir: "Artık gerek yok." Onur hakkında yalan tanıklıktan, Serkan
  hakkında yaralamadan dava. Leyla: "Meşru müdafaa bir hak. Hak, ispat edilene kadar bir hikâyedir."
- **BERAAT_E (223/2-e):** Beraat; ama koridorda Serkan "Daha bitmedi" der. Bar açılır, müşteriler gelmez. thought: "Şüphe
  bir kapıyı açtı. İçeri girip girmemek Setbaşı'na kaldı."
- **CVYO (223/3-c):** "Ceza verilmesine yer olmadığına." Bora: "Suçlu muyum, değil miyim?" Deniz: "Korktuğun için affedildin."
  Bora: "Korkmadım." thought: "Kanun bazen insanı haklı bulmaz, yalnızca anlar."
- **İNDİRİM (tahrik + derece, HAGB):** 11 ay 20 gün, hükmün açıklanması geri bırakıldı. Bora tabelanın G'sini tamir eder.
  thought: "Kazandık mı? Bora 'haklıydın ama' cümlesini ömür boyu taşıyacak."
- **MAHKÛMİYET:** 2 yıl 11 ay. Bora anahtarı Deniz'e geri verir. "Barı sat. Ya da yak. Fark etmez." Yağmur.
- **ETİK:** Ece kürsüde ağlar; Leyla Deniz'in masasına Meslek Kuralları kitapçığını bırakır. Tek kelime yok.
- **ÇÖKÜŞ:** Tolga dosyasını toplarken: "Meslektaşım, bir dahaki sefere delilinizi sunmadan önce okuyun."

## 6. Uygulama notları (yazım sırasında verilen kararlar)

- **Sonuç seti.** Beraatler: meşru savunma **223/2-d** (BERAAT_D; lineup'taki 2-b'nin yerine, çünkü Bora vurduğunu kabul
  eder) ve **223/2-e** (BERAAT_E, tipik yol). Ayrıca **CVYO** (223/3-c, TCK 27/2), **INDIRIM** (tahrik + silah artırımının
  düşmesi, 11 ay 20 gün HAGB), **MAHKUMIYET** (2 yıl 11 ay; çöküş dahil) ve **ETIK** (yönlendirilen Ece kürsüde çöker).
  Gerekçe `docs/legal/kirik-kadeh.md` §5.
- **Eklenen sahneler.** BR_03 (dosya gecesi), INV_SABAH2/3 (Leyla ve gazete; köprüdeki simitçi), H1_03S (savcının "neden
  tezgâhtan çıktınız?" sorusu), H1_MOLA (on dakikalık ara), ARA_SABAH2 (asansörde savcı), T_02S (Serkan'ın patlaması),
  T_05P (mütalaa arası), T_07P (son sözden önce). Bunlar hikâye kitabındaki vuruşları bölmek ve yorgun savcıyı bir
  karakter olarak açmak için yazıldı.
- **Ara dönemi** 2 gün × 4 EP; Onur'un kapıya gelişi ilk ara günün sonundaki sabit sahnedir (ARA_DAY_END).
- **Tanık kürsüsü:** Defne kürsüye çıkmaz; videosu bilirkişi notuyla oynatılır. Sinan Kurt ek dilekçeyle çağrılırsa kısa bir
  tanıklık yapar (T_04S).
