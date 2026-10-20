# Dava #14 — Yanık Ev · Hikâye Kitabı

> Bu belge koddan önce yazıldı ve `content/src/yanik-ev/` kaynağının anlatı sözleşmesidir. Çıta Dava #07 v2'nin hikâye
> kitabıdır (`docs/content/gece-bekcisinin-sirri-hikaye.md`). Delil zinciri, sonuç koşulları ve skor `docs/content/yanik-ev.md`'de,
> hukuki dayanaklar `docs/legal/yanik-ev.md`'dedir.

## 0. Ton ve kurallar

- **Noir dram.** Bursa, ocak sonundan mayısa. Muradiye'nin dar, arnavutkaldırımlı sokakları; yüz yıllık ahşap evler, cumbalar,
  saçaklardan damlayan yağmur. Yanık evin kokusu davanın bütün sahnelerine siner: ıslak kül, eriyik plastik, kömürleşmiş
  ceviz. Mizah kuru ve seyrektir; çoğu Saadet Hanım'ın ağzından ya da Deniz'in iç sesinden gelir.
- **İç ses.** Deniz `style: "thought"` ile kısa, keskin cümlelerle düşünür; gözlemler, şüphelenir, hiçbir zaman çözümü
  söylemez. Örnek: *"Yangın dosyaları iki şey bırakır: kül ve bir hikâye. Kül susar. Hikâyeyi kim anlatırsa dosya onundur."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numaraları yalnızca Leyla'nın kısa açıklamalarında, seçenek geri
  bildirimlerinde, rapor ipuçlarında, hüküm metninde ve mahkemedeki resmî konuşmada geçer.
- **Gizem korunur.** Soğuk açılışta sesler isimsizdir. Yangının elektrik arızasıyla çıktığı ve hızlandırıcı izinin eksperin
  sonradan getirdiği numunelerden geldiği, oyuncu bunu delillerle kurmadan söylenmez. Eksper Tarık Sönmez ilk görüldüğünde
  yalnızca "şirketin adamı"dır: kibar, titiz, yorgun.
- **Her yeni mekân** `card` + `bg` ile açılır: `"16 OCAK · 07.40 — MURADİYE, KALEM SOKAK"`. Sert anlarda `fx` (`shake`,
  `flash`, `fade`).
- **Satır ≤ 220 karakter.** Tipik yol (BERAAT_E) 13–16 bin sözcük; toplam ≥ 18 bin.

## 1. Logline ve tema

- **Logline:** Muradiye'de yüz yıllık ahşap bir ev gece yanar; ev sahibi döşemeci Halil Bozkurt, evi sigorta bedeli için
  benzinle yaktığı iddiasıyla tutuklanır. Poliçe kırk yedi gün önce yapılmış, teminat on iki gün önce artırılmış, eşyalar
  bir hafta önce taşınmış, cüzdanında bir benzin fişi var. Deniz Arslan, her biri tek başına masum, yan yana konunca bir
  ilmeğe dönen dolaylı delilleri tek tek çözmek zorundadır.
- **Dramatik soru:** Bir halatı oluşturan iplikler tek tek koparılabilir mi? Ve bir halatı kim örmüştür?
- **Tema:** Rapor ile gerçek arasındaki mesafe. Bir uzmanın imzası bir gerçeği kanıtlamaz; yalnızca birinin onu söylediğini
  kanıtlar. Davanın aynası: dava sahte bir uzman raporuyla açılmıştır; ara evresinde Deniz'e de sahte bir karşı rapor teklif
  edilir.
- **Ana mekânlar:** Arslan Hukuk (büro), yanık ev (Muradiye, Kalem Sokak 9), Halil'in döşeme atölyesi (Yıldırım, eski sanayi),
  Bursa H Tipi Cezaevi görüş odası, Saadet Hanım'ın evi, mahalle bekçi kulübesi, adliye ve Bursa 7. Asliye Ceza Mahkemesi.

## 2. Gerçek ve kronoloji

| Tarih / saat | Olay | Kim biliyor | Oyuncu nasıl keşfeder |
|---|---|---|---|
| İki yıl önce | Halil'in karısı Nermin, kendi ailesinden kalan Kalem Sokak 9'daki evde ölür. Ev onun hatırasıdır. | Halil, Zehra | BR_00 (Zehra), görüşme |
| 28 Kasım | Halil restorasyon için bankadan 180.000 TL kredi çeker. Banka, dain-i mürtehin kaydıyla konut (yangın) sigortası şart koşar; poliçe acente Kader Acar üzerinden Kalkan Sigorta'dan yapılır (başlangıç 30 Kasım). | Halil, banka, acente | Poliçe belgesi (dain-i mürtehin satırı), Kader'le görüşme |
| 12 Aralık | Elektrikçi Necati Usta keşif yapar: tesisat eski, koridor buatı ısınmış, kaçak akım rölesi yok; "yenileme restorasyonun ilk haftasında yapılsın; o zamana kadar ağır yük çekmeyin." Yazılı keşif notu. | Necati, Halil | Necati ziyareti, atölyedeki sözleşme |
| 20 Aralık | Restorasyon sözleşmesi: başlangıç 19 Ocak; ilk iş elektrik tesisatının yenilenmesi; "odalar 15 Ocak'a kadar boşaltılacak." | Halil, usta | Atölye araması (duvardaki sözleşme) |
| 3 Ocak | Acente Kader Acar, kampanya kapsamında Halil'i arar ("restorasyondan sonra ev değerlenecek, teminatı şimdi yükseltelim"); zeyilname: bina teminatı 1,2 → 1,8 milyon TL. | Kader, Halil | Poliçe zeyilnamesi (kampanya kodu), acentenin çağrı kaydı |
| 9 Ocak | Halil değerli eşyaları (Nermin'in çeyiz sandığı, babasından kalma konsol, dikiş makinesi) atölyeye taşır; restorasyon için. | Halil, komşular | Saadet'in ifadesi (aleyhe), atölye araması (lehe) |
| 12 Ocak | Halil bir akaryakıt istasyonundan bidonla 5 litre benzin alır: atölyedeki jeneratör için (sanayide sık elektrik kesintisi). Fiş cüzdanındadır. Bidon atölyede, içinde 4 litre kalmıştır; kolluk bakmamıştır. | Halil | Dosyadaki fiş (aleyhe), atölyedeki bidon (lehe) |
| 14 Ocak gece | Halil atölyede bir otel siparişinin döşemesini bitirir, kanepede uyur (ev yarı boş ve soğuk; bir haftadır böyle). | Halil, atölye bekçisi | Görüşme |
| 15 Ocak 01.30 | Bekçi Cevdet Alkan devriyede Kalem Sokak 9'un kapısını yoklar. Saadet Hanım penceresinden "el fenerli bir adam" görür. | Cevdet | Saadet ifadesi (S1), bekçi devriye çizelgesi |
| 02.08 | Sokağın dağıtım hattında nötr iletken kopar. Üç hanede aşırı gerilim: Saadet'in televizyonu ve modemi "pat" diye söner. | Dağıtım şirketi, Saadet | Saadet'in sözü (S4), arıza kaydı (ara), Saadet'in evi (ara) |
| 02.10–02.14 | Aşırı gerilim, zaten yorgun olan koridor buatında ark yapar; yangın mutfak–koridor duvarındaki lambride başlar, ahşap yapıda hızla büyür. | — | Yanık ev araması (buat), itfaiye raporu, elektrik bilirkişi raporu (ara) |
| 02.21 / 02.29 | İhbar; itfaiye gelir. 03.50 kontrol altında. Yan evin saçağı tutuşur, iki aile tahliye edilir (genel güvenlik tehlikesi). | İtfaiye | İtfaiye raporu |
| 04.30 | Kolluk olay yeri inceleme ekibi fotoğraf çeker: salonun tavanı çökmüş, zemin moloz ve tavan tahtalarıyla örtülü. Sigorta kutusu (pano) itfaiye amirinin "elektrik olabilir" sözü üzerine emanete alınır; incelemesi istenmez. Hızlandırıcı numunesi alınmaz. | Kolluk | Olay yeri fotoğrafları (04.30), bilirkişi raporu (pano satırı) |
| 05.00–10.30 | Olay yeri şeritle kapatılır; muhafazayı bekçi Cevdet üstlenir. | Cevdet | Devriye çizelgesi |
| 07.40 | Halil gelir; yıkılır. Polis cüzdanındaki benzin fişini görür. | Halil, kolluk | PR_02 |
| 09.20–10.05 | Kalkan Sigorta'nın eksperi Tarık Sönmez "şirket gönderdi" diyerek şeridin altından girer; bekçi deftere yazar. Salonun ortasındaki molozu kenara iter, kendi getirdiği iki metal tenekeye "numune" koyar, temizlenmiş zemindeki ıslak, düzensiz lekenin fotoğrafını çeker. Tenekelerdeki döküntü, önceden taze benzine batırılmıştır. | Tarık; Cevdet (girişi) | Devriye çizelgesi, eksper fotoğrafı (09.40), laboratuvar ham verisi (ara), Cevdet (ara) |
| 15 Ocak 14.00 | Halil acente aracılığıyla hasar ihbarında bulunur. | Halil, acente | Poliçe belgesi |
| 17 Ocak | Tarık'ın ekspertiz raporu: "salon zemininde döküntü izi, hızlandırıcı şüphesi." Kalkan Sigorta savcılığa şikâyet eder, numuneleri ve raporu teslim eder. | Tarık, sigorta | Bilirkişi raporu (numune kaynağı satırı) |
| 21 Ocak | Savcılığın yangın bilirkişisi Dr. Orhan Tezel olay yerine altı gün sonra, yağmurdan sonra gider. Numuneler (eksperinkiler) laboratuvara gönderilir: "kurşunsuz benzin; buharlaşma düşük." Rapor: "yangın hızlandırıcı ile çıkarılmıştır; elektrik kaynaklı iz tespit edilmemiştir." Pano incelenmemiştir. | Tezel | Bilirkişi raporu |
| 4 Şubat | Halil tutuklanır. | | PR_02 kartı |
| 20 Mart | İddianame: TCK 170/1-a ve TCK 158/1-k, 35. Bursa 7. Asliye Ceza Mahkemesi. Kalkan Sigorta katılan. | | Dosya |
| 3 Nisan | Önceki avukat dosyayı bırakır; Zehra Arslan Hukuk'a gelir. Birinci celseye on bir gün. | | BR_00 |
| 14 Nisan | Birinci celse. | | H1 |
| 5 Mayıs | İkinci (ve üçüncü) celse; karar. | | T |

**Eksperin nedeni (ara evresinde ortaya çıkar):** Kalkan Sigorta'nın bölge hasar müdürlüğü, "suiistimal tespit primi" adıyla,
reddedilen büyük hasar dosyalarında eksperlere ek ücret ödemektedir. Tarık daha önce de, bir dul kadının (Gülsüm Yaşar)
yangın dosyasında aynı kalıpla rapor yazmış; Sigorta Tahkim Komisyonu o raporu "bilimsel dayanaktan yoksun" bulup şirketi
ödemeye mahkûm etmiştir. İki raporun "döküntü izi" paragrafı kelimesi kelimesine aynıdır.

## 3. Kadro: sesler, sırlar, yaylar

| Karakter | Kim | Ses (nasıl konuşur) | Sır / istek | Yay | Örnek replik |
|---|---|---|---|---|---|
| **Deniz Arslan** (oyuncu) | 31, Arslan Hukuk; büroda dördüncü yılı, ortaklığa yeni yükseldi. | Dışarıda nazik ve inatçı; içeride kuru, gözlemci. | Büyükbabasının Gemlik'teki evi bir kışın yanmıştı; sigorta ödememişti. Sigortacıya kör bir öfke taşıyor; bunun gözünü bulandırmasından korkuyor. | Öfke → titizlik. "Bir raporu yıkmak için başka bir rapor değil, bir kronoloji lazım." | “Önce bul, sonra inan. Yangında ikisini karıştırmak kolay.” |
| **Leyla Erdem** (mentor) | 58, büronun kurucusu. | Az konuşur; her cümlesi bir ders. Gözlüğünü silmeden önemli bir şey söylemez. | Ters çerçeve (Dava #15 tohumu; burada yalnızca ima). | Deniz'e ilk kez bir dosyada "ortak" diye hitap eder. | “Bilirkişi raporu bir hüküm değildir, Deniz. Bir tanıktır. Tanık da sorgulanır.” |
| **Halil Bozkurt** (müvekkil) | 54, döşemeci; Yıldırım'da eski sanayide atölyesi var. | Ağır, ölçülü, elleriyle konuşur; her cümleyi kumaş gibi katlar. Sert tonla taş kesilir. | Borçlu (iki icra dosyası, atölye kirası) ve bundan utanıyor; kızına söylememiş. Nermin'in çeyiz sandığını atölyeye taşıdığı için kendini suçlu hissediyor: "Evi boşalttım, ev de gitti." | Utanç → onur. Son sözünde Nermin'in evini anlatır. | “O evin her tahtasını ben cilaladım, avukat hanım. Benzin dökeceğim yer mi?” |
| **Zehra Bozkurt** (kızı) | 27, devlet hastanesinde acil hemşiresi; gece nöbetleri. | Hızlı, keskin, yorgun; tıbbi bir soğukkanlılıkla duygusunu saklar. | İçinde bir kuşku var: babasının borçlarını iddianameden öğrendi. "Ya yaptıysa?" sorusunu kimseye soramıyor. Nişanlısı Onur'un ara evresindeki "tanıdık eksper" teklifini o getirir. | Kuşku → güven. Epilogda babasının ellerini tutar. | “Acilde yanık hastası gelince önce yanığın derecesine bakarız. Siz de babamın derecesine bakın.” |
| **Saadet Koru** (komşu, savcılık tanığı) | 71, emekli tütün işçisi, yalnız yaşıyor. | Lafı dolandırır, her şeye bir hikâye bulur, "burnum köpek gibidir" der; gözleri zayıf. | Polis ona "benzin gibi mi kokuyordu?" diye sormuş, o da "evet" demiş. Halil'i sever ama Nermin'in ölümünden sonra onunla küs. | Kesinlik → tereddüt → dürüstlük. Kürsüde "yanlış burun" anı. | “Kızım, ben kırk yıl tütün ayıkladım. Kokuyu tanırım. … Galiba.” |
| **Cevdet Alkan** (bekçi) | 46, çarşı ve mahalle bekçisi. | Resmî ve sıkıntılı; her cümleye "amirim" der gibi başlar; defterine sarılır. | Eksperi şeridin altından tek başına içeri aldığı için kendini suçlu hissediyor; "başım yanar" korkusuyla susmuştur. | Korku → sorumluluk. Defterinin bir fotokopisini Deniz'e verir; ara evresinde tenekeleri anlatır. | “Defter yalan söylemez avukat hanım. Ben yazdım, ben imzaladım. Başıma ne gelirse gelsin.” |
| **Necati Usta** (elektrikçi) | 63, otuz beş yıllık elektrikçi. | Teknik sözcükleri halk diline çevirir; sigara içmez ama hep bir kablo parçası çiğner. | Halil'e "acil değil" dediği için kendini suçluyor; tanıklığı iki uçlu bir bıçaktır (elektrik kaynağını destekler, ihmal tezini de besler). | Suçluluk → doğru tanıklık. | “Tesisat yaşlı adam gibidir, avukat hanım. Kendi kendine ölmez; biri omzuna yük bindirirse ölür.” |
| **Tarık Sönmez** (eksper) | 44, Sönmez Ekspertiz; Kalkan Sigorta'nın anlaşmalı eksperi. | Kibar, kusursuz takım elbise, teknik terimlere sığınır; "objektif" kelimesini sever. Hiç ses yükseltmez. | Suiistimal tespit primi; Gülsüm Yaşar dosyası; numune tenekelerini önceden hazırlamıştır. | Saygınlık → çözülme. Kürsüde kendini suçlandırmama hakkına (CMK 48) sığınır; susuşu itiraftan gürültülüdür. | “Ben bir yangını okurum, avukat hanım. Yangın da yalan söylemez.” |
| **Dr. Orhan Tezel** (savcılığın bilirkişisi) | 61, makine mühendisi, yangın bilirkişisi. | Akademik, ağır, biraz kibirli ama dürüst; yanılabileceğini kabul etmesi zaman alır. | Numunelerin eksperden geldiğini raporuna yazmıştır ama üstünde durmamıştır; panoyu incelememiştir. | Kibir → mesleki dürüstlük. Birinci celsede "numuneleri ben almadım" der. | “Yangın bir kitaptır; bilen okur. … Ama sayfaları yırtılmışsa, bilen de yanılır.” |
| **Kader Acar** (acente) | 38, sigorta acentesi. | Satışçı, güler yüzlü, kampanya kodlarıyla konuşur. | Teminat artışını kendisinin teklif ettiğini savcılık ifadesinde "müşteri talep etti" diye yazdırmıştır (prim komisyonu). | Savunmacılık → kayıt karşısında teslimiyet. | “Abla bizde her şey sistemde. Arayan biz miyiz, o mu, sistem söyler.” |
| **Gülsüm Yaşar** (eski mağdur) | 66, dul. | Yavaş, kırgın, dua eder gibi; isim vermekten çekinir. | Elinde tahkim kararı ve bir şirket yazışması var. | — | “O adam benim evimi de yaktı, kızım. Ateşle değil; kalemle.” |
| **Onur Taş** (Zehra'nın nişanlısı) | 30, inşaat mühendisi. | Hızlı, iş bitirici, "çözüm" kelimesini sever. | "Tanıdık bir eksper" ile para karşılığı karşı rapor yazdırma teklifi (etik tuzak). | — | “Onlar rapor yazdıysa biz de yazarız. Dünya böyle dönüyor.” |
| **Hâkim Nilgün Aksoy** | Bursa 7. Asliye Ceza hâkimi. | Kısa, sabırlı, kuru; usul cümlelerini sade kurar. "Müdafi, diyeceğiniz?" | — | — | “Bilirkişi, hukuku bana bırakın.” |
| **Savcı Kemal Dinçer** | 45 | Ölçülü, dosyaya sadık, ikna olursa bunu söylemekten çekinmez. | — | Mütalaada görüşünü değiştirebilir. | “Tek tek bakınca her şeyin bir açıklaması var, Sayın Hâkim. Yan yana koyunca yok.” |
| **Av. Sinan Varol** (katılan vekili, Kalkan Sigorta) | 40 | Parlak, sabırsız, ticari dil. | — | — | “Müvekkil şirket mağdurdur; bu bir sigorta dosyası değil, bir dolandırıcılık dosyasıdır.” |
| **Bayram Efendi** (mübaşir), **Ömer Çakmak** (gardiyan) | | Mübaşir isimleri uzatarak çağırır; gardiyan kısa ve insancıl. | | | |

## 4. Yapı ve node haritası

```
PROLOG  Soğuk açılış (15 Ocak 01.30–02.30; isimsiz sesler)            → PR_02
PR_02   Sabah 07.40: kül, cüzdan, fiş                                  → BR_00
BR_00   Bölüm 1 · DOSYA: Zehra büroda (söz / tarife / dürüstlük)      → BR_00L Leyla
BR_01   Ceza aralığı sorusu (A–D) → BR_01B Halatın üç ipliği → BR_02 Dosya + strateji → INV_SABAH Kalem Sokak
INV_HUB Bölüm 2 · SORUŞTURMA (3 gün × 4 EP, push/$return)
  OLAY YERİ: INV_EV (yanık ev, sahne) · INV_FOTO (04.30 albümü, sahne) · INV_ATOLYE (atölye, sahne)
  CEZAEVİ:   INV_GORUS_G_1 → INV_GORUSME (konu × ton; konular başka yerden öğrenilenlerle açılır)
  KİŞİLER:   INV_SAADET · INV_CEVDET · INV_NECATI · INV_KADER
  ARŞİV:     INV_BILIRKISI · INV_ITFAIYE · INV_POLICE (belge) · INV_DIL (delil dilekçesi) · INV_CIKARIM (tahta) · INV_LEYLA
  Gün sonu:  INV_DAY_END → INV_AKSAM1 (Zehra) / INV_AKSAM2 (Halil'in telefonu)
INV_GECE_1…4 → INV_GECE (duruşmadan önceki gece)
H1_00K koridor → H1_00 açılış → H1_01 iddianame → H1_02 sanık savunması → H1_02Q sorular → H1_03 itiraz (eksper raporu)
  → H1_04 Saadet (S1–S5) → H1_05 itiraz (bilirkişiye soru) → H1_06 Dr. Tezel (B1–B5) → H1_07 talepler → H1_08 ara karar
ARA_GIRIS_1 (tahliye ya da ring aracı) → ARA_GIRIS → ARA_HUB (2 gün × 3 EP, doğrudan dönüş)
  ARA_LAB (belge) · ARA_GULSUM → ARA_TAHKIM (belge) · ARA_SAADET (sahne: yanmış televizyon) · ARA_ARIZA (belge)
  ARA_ARK (belge) · ARA_CEVDET · ARA_HALIL · ARA_ONUR (etik tuzak) · ARA_SUC (suç duyurusu) · ARA_CIKARIM · ARA_LEYLA
  ARA_DAY_END → ARA_AKSAM (kapıdaki eksper)
ARA_SON_1…3 → T_00K → T_00 raporlar → T_01 bekçinin dinlenmesi → T_02 itiraz → T_03 Tarık (U1–U5) → T_03K kırılma
  → T_04 kısa ara (cs_3) → T_05 ek savunma (TCK 171'e hatırlatma) → T_05M mütalaa + cevap → T_06P dayanaklar
  → T_06 esas savunma → T_07 son söz → T_08 hüküm → R_KARAR (sonuç başına epilog)
T_COKUS (güvenilirlik 0) → T_08
```

Celseler: `cs_1` (14 Nisan), `cs_2` (5 Mayıs sabah: raporlar, bekçi, eksper), `cs_3` (5 Mayıs öğleden sonra: ek savunma,
mütalaa, savunma, son söz, karar). Zorluk 5: son celse iki oturuma bölünmüştür.

## 5. Sahne sahne

> Sözcük sayıları tipik yol içindir (± %20).

### PROLOG — "02.08" (~650) · bg: sokak_karanlik
- `card`: "15 OCAK · GECE 01.30 — MURADİYE, KALEM SOKAK".
- Islak arnavutkaldırımı, cumbaların altından damlayan yağmur. Bir el feneri kapıları tek tek yoklar; bir düdük, bir köpek.
  Bir pencerenin perdesi aralanır (Saadet, isimsiz: "BİR KADIN"): "Kim o? … Neyse."
- 02.08: sokak lambaları bir an kararır, sonra fazla parlak yanar. Bir pencerede televizyon "pat" diye söner. Kimse
  önemsemez. (Ekilen ipucu 1; yorum yok.)
- Bir evin içinden çatırtı; turuncu bir ışık koridor camında büyür. "BİR SES" (komşu, telefonda): "İtfaiye! Kalem Sokak,
  dokuz numara! Ahşap ev, çabuk!" (`fx: flash`).
- Sirenler, hortumlar, yan evin saçağı tutuşur; bir anne çocuğunu battaniyeyle taşır. Ev bir fener gibi yanar.
- Son: "Sabaha karşı ateş söndü. Ama bir şey yanmaya devam etti; adı henüz konmamış bir şey." `fade`.

### PR_02 — "07.40" (~550) · bg: sokak_sabah
- Islak kül, şerit, bir bekçi. Halil koşarak gelir; şeridin önünde dizleri tutmaz. "Nermin'in evi…"
- Bir polis kimlik ister; cüzdandan bir fiş düşer: "12 Ocak, kurşunsuz benzin, 5 litre, bidon." Polis fişi çevirir, bir
  meslektaşına gösterir. Kimse Halil'e bir şey sormaz; sormaya gerek görmezler.
- Halil: "Jeneratör için…" — cümlesini kimse duymaz.
- Belirsiz bir satır: "Saat dokuzu yirmi geçe, şeridin altından biri daha geçti. Bekçi defterine bir satır daha yazıldı.
  Kimse o satırı aylarca okumadı." (Ekilen ipucu 2; isim yok.)
- `card`: "YİRMİ GÜN SONRA TUTUKLANDI. İDDİANAME MARTTA GELDİ. BİRİNCİ CELSEYE ON BİR GÜN VAR."

### BR_00 — Zehra (~750) · bg: buro_gece
- `card`: "3 NİSAN · PERŞEMBE 22.15 — ARSLAN HUKUK, BURSA". Deniz (thought): "Bursa'da nisan yağmuru iki şey getirir:
  çamur ve gecikmiş vicdanlar."
- Zehra nöbetten çıkıp gelir; üniforma ceketinin altında, ellerinde dezenfektan kokusu. Önceki avukat "dosya kötü"
  diyerek bırakmış. İddianameyi masaya koyar: poliçe, artış, eşyalar, benzin, borç.
- Duygusal çekirdek: "O ev annemin eviydi. Babam o evin her tahtasını kendisi cilaladı." Ardından, sesi düşerek:
  "Borçları iddianameden öğrendim. Kızına söylememiş. … Ne bileyim artık."
- Seçim (puan yok, ilişki): "Önce bana babanı anlat" (güven +, `zehra_durust`) · "Ücret ve vekâlet" (nötr) ·
  "Babanın masum olduğundan eminim" (söz, `soz_verdi`; Leyla'nın uyarısı).

### BR_00L — Leyla (~250) · BR_01 — Ceza aralığı (~450) · BR_01B — Halatın üç ipliği (~350)
- Leyla: "Bir kızın gözüne bakarak söz verme. Dosyaya bakarak ver."
- Soru: TCK 170/1-a ve 158/1-k (teşebbüs) cezaları. Doğru: 170/1 bir–beş yıl; 158/1-k dört–on yıl, teşebbüste dörtte
  birden dörtte üçe indirim; görevli mahkeme asliye ceza (üst sınır on yılı geçmiyor).
- BR_01B: Leyla üç kâğıt yazar: **NEREDE**, **NEYLE**, **KİM**. "Bir yangın dosyası bu üç soruya bakar. Savcının cevabı
  salon, benzin, Halil. Senin işin cevapları değil, soruları sorgulamak." Ve: "Dolaylı delil bir halattır. Tek bir iplik
  kimseyi asmaz; halat asar. İplikleri tek tek ayır." Ters çerçeve imgesi.

### BR_02 — Dosya + strateji (~250) · INV_SABAH — Kalem Sokak (~350) · bg: sokak_sabah
- Strateji: Masumiyet ×1,5 / Usul ×1,2 / Terditli ×0,8 (taksir alternatifi).
- INV_SABAH: kömürleşmiş cumba, yan evin is tutmuş saçağı, Saadet Hanım'ın perdesi. Deniz'in büyükbabasının evi (iç ses,
  kısa; Deniz'in sırrı).

### Bölüm 2 · SORUŞTURMA (~5.000)
- **INV_HUB** gün başlıkları: gün 1 "Hedef: nerede başladı? Evi, fotoğrafları, raporu gör." · gün 2 (koşullu) "Hedef: halatın
  iplikleri: poliçe, eşyalar, benzin." · gün 3 "Hedef: delil dilekçesi son gün."
- **INV_EV — yanık ev (sahne, büyüteç 6)** (~350): koridor buatı (eriyik bakır, `clue_buat`), mutfak duvarındaki lambri ve
  priz (V izi koridora doğru, `clue_v_izi`), salonun ortasında kenara itilmiş moloz yığını (`clue_moloz`), boş pano yuvası
  (`clue_pano`); çeldiriciler: kömürleşmiş dikiş masası, cumba camı.
- **INV_FOTO — olay yeri albümü 04.30 (sahne, büyüteç 5)** (~250): salonun zemini tavan tahtalarıyla örtülü (`clue_foto_tavan`),
  koridor duvarında en derin kömürleşme (`clue_foto_koridor`), itfaiye hortumu ve su birikintisi (`clue_su`); çeldirici:
  meraklı kalabalık.
- **INV_ATOLYE — atölye (sahne, büyüteç 5)** (~350): jeneratörün yanında kırmızı bidon, neredeyse dolu (`clue_bidon`), çeyiz
  sandığı ve konsol (`clue_esyalar`), duvardaki restorasyon sözleşmesi (`clue_restorasyon`); çeldirici: kumaş topları, takvim.
  Atölye bekçisi (isimsiz ses) "Halil Abi o gece buradaydı, ışığı sabaha kadar yandı" der.
- **INV_GORUSME — Halil (görüşme)** (~1.100): konular O gece · Ev · Nermin · Borç (sert tonla; utanç) · ve açılan konular
  Benzin (fiş ya da bidon bulununca) · Eşyalar (sözleşme ya da Saadet'ten sonra) · Elektrikçi (buat ya da Necati'den sonra) ·
  Teminat artışı (poliçeden sonra). Doruk: Halil'in borcu kızına söylememesi ve "Evi boşalttım, ev de gitti."
- **INV_SAADET** (~450): çay, kediler, hikâyeler; "benzin kokusu", "el fenerli adam", televizyonu. Etik: tanığa cevap verme
  (telkin seçeneği → `saadet_telkin`, ceza).
- **INV_CEVDET** (~400): bekçi kulübesi; devriye çizelgesinin fotokopisi (`ev_cizelge`): 01.30 kontrol; 05.00–10.30
  muhafaza; 09.20–10.05 "sigorta eksperi T.S. girdi-çıktı". Cevdet tanık olmaktan korkar; etik seçim.
- **INV_NECATI** (~400): keşif notu (`clue_necati`): "acil değil, restorasyonla"; iki uçlu bıçak (Leyla akşam uyarır).
- **INV_KADER** (~350): acente; "sistemde arayan biz miyiz o mu" → çağrı kaydı (`clue_cagri`).
- **INV_BILIRKISI (belge)**: numune kaynağı (`clue_numune`), inceleme tarihi (`clue_gec`), pano satırı (`clue_pano_yok`),
  laboratuvar satırı UV/büyüteçle "buharlaşma düşük" (`clue_taze`).
- **INV_ITFAIYE (belge)**: "akaryakıt kokusu alınmamıştır" (`clue_koku_yok`), "başlangıç mutfak–koridor" (`clue_baslangic`),
  söndürme 80 dakika (`clue_su` destek).
- **INV_POLICE (belge)**: dain-i mürtehin (`clue_dain`), kredi şartı (`clue_banka`), zeyilname kampanya kodu (`clue_kampanya`).
- **INV_CIKARIM (tahta, 8 tarif + çeldiriciler)**; **INV_DIL** (delil dilekçesi, üç hak); **INV_LEYLA** (günde bir).
- **INV_AKSAM1** (~350): Zehra telefonda; kuşkusunu söyler. Seçim: dürüst güven / teselli / kuşkuyu büyütmek.
- **INV_AKSAM2** (~300): cezaevi telefonundan Halil: "Sandığı açtınız mı? Nermin'in mektupları…" Seçim.
- **INV_GECE** (~450): koşullu hafıza zinciri; Leyla: "Yarın bilirkişi kürsüde olacak. Onu küçük düşürme; sayfalarını say."

### Bölüm 3 · BİRİNCİ CELSE (~2.600) · bg: durusma_salonu
- `card`: "14 NİSAN · 09.30 — BURSA 7. ASLİYE CEZA MAHKEMESİ". Tek hâkim; katılan vekili.
- Halil savunmasında Nermin'in evini anlatır; oyuncunun soruları (H1_02Q) jeneratörü, eşyaları, elektrikçiyi ortaya koyar.
- H1_03: savcı eksper raporunu "bilirkişi raporu" diye okutur → itiraz: eksper raporu katılanın uzman görüşüdür; yazarı
  tanık olarak dinlenmeli.
- H1_04 Saadet: "el fenerli adam" (bekçi çizelgesi), "benzin kokusu" (itfaiye raporu), eşyalar (restorasyon), kanaat
  ("borçlu adam neler yapmaz": itiraz), televizyon (BASTIR: "yangından önceydi"; ekilen ipucu 3).
- H1_06 Dr. Tezel: "salon zemininde döküntü izi" (04.30 fotoğrafı + moloz), "numunelerde benzin" (numune kaynağı + çizelge),
  "elektrik izi yok" (pano incelenmedi), "hızlı yayılım" (ahşap yapı), hukuki değerlendirme ("borç ve poliçe": itiraz).
- Doruk: Tezel "Numuneleri ben almadım. Eksperin teslim ettiği tenekelerdi." Salon uğuldar; Tarık dinleyici sırasında
  kalemini kapatır.
- H1_07 talepler: panonun elektrik bilirkişisine incelettirilmesi, dağıtım şirketinin arıza kayıtları, laboratuvar ham
  verileri, eksperin ve bekçinin tanık olarak dinlenmesi, tahliye.
- H1_08 ara karar: erteleme; tutukluluk incelemesi (zincir koptuysa tahliye).

### Bölüm 4 · ARA (~3.000)
- **ARA_GIRIS_1**: tahliye edildiyse Halil'in atölyeye dönüşü (sandığın başında); değilse ring aracının camı.
- **ARA_GIRIS**: adliye koridorunda Tarık Deniz'e kartvizitini uzatır: "Objektif olmak zor iştir. Kolay gelsin." (Tehdit
  değil; tehdit kadar soğuk.)
- **ARA_LAB (belge, talep edildiyse)**: kromatogram; "buharlaşma yok", "piroliz ürünü yok" (`clue_piroliz`).
- **ARA_GULSUM**: Gülsüm Yaşar büroya gelir (Zehra'nın hastanesinden duymuş): tahkim kararı (`ev_tahkim`) ve şirket
  yazısı (`clue_prim`). **ARA_TAHKIM (belge)**: aynı paragraf (`clue_ayni`).
- **ARA_SAADET (sahne)**: yanmış televizyon, modem, kombi kartı; Saadet "televizyon yangından önce gitti" (`clue_tv`).
- **ARA_ARIZA (belge, talep edildiyse)**: nötr kopukluğu 02.08 (`clue_notr`).
- **ARA_ARK (belge, talep edildiyse)**: koridor buat hattında birincil ark boncuğu (`clue_ark`).
- **ARA_CEVDET**: tenekeleri ve spor çantayı anlatır; tanıklığa razı olur (yönlendirme yok).
- **ARA_HALIL**: gerçeği konuşmak; ek savunmaya hazırlık (doğruyu söylemesini tavsiye etmek).
- **ARA_ONUR (etik tuzak)**: para karşılığı karşı rapor. Reddet (doğru) · "Düşüneyim" (iz bırakır) · Kabul et (`sahte_rapor`
  → ETİK sonu).
- **ARA_SUC**: eksper hakkında suç duyurusu (savcılığa; TCK 267/2) — ya da onu kendin sıkıştırmak (yanlış; Leyla'nın dersi).
  Suç duyurusu → savcılığın el koyması (`ev_elkoyma`: aracındaki benzin bidonu ve boş tenekeler) ikinci celsede gelir.
- **ARA_CIKARIM**, **ARA_LEYLA**.
- **ARA_AKSAM**: Tarık büronun kapısında, yağmurda: "Bazen yangın sadece yangındır." Seçim: konuşmayı kayda geçir ve
  savcılığa bildir · tehdit et · kapıyı kapat.

### Bölüm 5 · İKİNCİ CELSE (cs_2 + cs_3, ~3.300)
- `card`: "5 MAYIS · 09.30 — BURSA 7. ASLİYE CEZA MAHKEMESİ, İKİNCİ CELSE".
- T_00: gelen raporlar okunur (ark, arıza kaydı, el koyma) — koşullu satırlar.
- T_01: bekçi Cevdet dinlenir (sorular): 09.20 girişi, tenekeler.
- T_02: katılan vekilinin eksperi "yönlendiren" sorusu → itiraz.
- T_03 Tarık: U1 "polis izniyle girdim" (çizelge), U2 "molozun altında iz gördüm" (04.30 fotoğrafı/moloz), U3 "numuneleri
  zeminden aldım" (piroliz yok/taze benzin), U4 "raporlarım hep doğrulandı" (tahkim/aynı paragraf), U5 "beklentim yok"
  (prim yazısı).
- T_03K: Hâkim, eksperi CMK 48 hakkı konusunda uyarır; Tarık: "Bu soruya cevap vermeyeceğim." Hâkim suç duyurusu için
  tutanağın savcılığa verilmesine karar verir. Sessizlik.
- T_04 `card`: "13.40 — İKİNCİ OTURUM". T_05: Hâkim, eylemin TCK 171 (taksir) kapsamında değerlendirilebileceğini hatırlatır
  (CMK 226). Ek savunma: restorasyon takvimi / nötr kopukluğu / "ihmal yok" (dayanaksız) / susmak.
- T_05M: mütalaa (beraat talebi, taksir talebi ya da mahkûmiyet) + cevap.
- T_06P: üç dayanak; T_06: esas savunma 3–5 satırlık konuşma; T_07: Halil'in son sözü (Nermin'in evi).
- T_08: hüküm.

### Epiloglar (her biri 200–400)
- **BERAAT_B:** "Beraatine." Halil ilk kez ağlar. Merdivenlerde Zehra babasının ellerine bakar: nasırlı, cilalı, temiz.
  Gülsüm Hanım koridorun ucunda başını sallar. Son kart: "Tarık Sönmez hakkında iftira ve delil uydurma soruşturması
  başlatıldı. Kalkan Sigorta hasar dosyasını yeniden açtı."
- **BERAAT_E:** Serbest ama yarım: "şüpheden yararlandı." Kalem Sokak'ta kömür tahtalar; Halil çeyiz sandığını yanık evin
  önüne koyar, açar. Deniz (thought): "Bir halatı çözdük. Halatı öreni değil."
- **TAKSIR:** "Taksirle… hükmün açıklanmasının geri bırakılmasına." Halil evine bakar: "Kundakçı değilmişim; dikkatsizmişim.
  Nermin buna da kızardı." Kuru, acı.
- **MAHKUMIYET:** Ring aracı; Zehra bir hemşire soğukkanlılığıyla ağlamamaya çalışır. Deniz fişi düşünür: 5 litre. "Bidon
  atölyede hâlâ dolu duruyordu. Kimse bakmadı. Ben de yeterince göstermedim." Çöküşte: hâkimin cümlesi.
- **ETIK:** Onur'un eksperi kürsüde çözülür; Leyla masaya meslek kuralları kitapçığını bırakır. "Onlar sahte rapor yazdı;
  biz de yazdık. Hâkim aradaki farkı soracaktı. Fark yoktu."

## 6. Ters köşeler ve hazırlığı

1. **Numuneler eksperindi (1. celse doruğu).** Ekilen ipuçları: prologdaki "dokuzu yirmi geçe defterdeki satır", bilirkişi
   raporundaki numune kaynağı satırı, bekçi çizelgesi, Saadet'in "sabah bir adam iki tenekeyle çıktı" yan cümlesi.
2. **Yangın elektrikle çıktı (ara evresi).** Ekilen ipuçları: prologda lambaların titremesi ve sönen televizyon, Saadet'in
   kürsüdeki "televizyonum bile bozuldu", buattaki eriyik bakır, itfaiyenin "mutfak–koridor" tespiti, Necati'nin keşif notu.
3. **Eksperin nedeni (ara evresi).** Gülsüm'ün gelişi; aynı paragraf; prim yazısı.

## 7. Sözcük bütçesi (tipik yol)

| Bölüm | ~sözcük |
|---|---|
| Soğuk açılış + Bölüm 1 | 3.000 |
| Soruşturma | 5.000 |
| Birinci celse | 2.600 |
| Ara | 3.000 |
| İkinci celse + karar + epilog | 3.300 |
| **Toplam** | **~16.900 (ölçüm: case:duration)** |
