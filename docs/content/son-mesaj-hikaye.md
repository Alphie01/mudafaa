# Dava #06 — Son Mesaj · Hikâye Kitabı (noir)

> Anlatı çıtası Dava #07 v2'dir (`docs/content/gece-bekcisinin-sirri-hikaye.md`). Bu belge davanın **sahne** hâlidir:
> gerçek, kronoloji, kadro sesleri, yapı, sahne sahne vuruşlar, ters köşenin ekimi ve sonuç başına epiloglar. Hukuki
> çerçeve `docs/legal/son-mesaj.md`, delil zinciri ve sonuç koşulları `docs/content/son-mesaj.md`'dedir.
>
> Lineup satırı: Şantaj (TCK 107/2) ve özel hayatın gizliliğini ihlal (TCK 134). Eksen: mesajların kimden çıktığı (hesap
> ele geçirme, cihaz incelemesi); dijital delilin imaj alma ve hash ile korunması (CMK 134). Gerçek: müvekkilin
> telefonundaki mesajlar, onun hesabını ele geçiren eski iş ortağı tarafından gönderilmiştir. Zorluk 3/5, rütbe şartı yok.
> Özel hayata ilişkin içerik **cinsel değildir**: bir boşanma döneminin ses kaydı ve eski bir klinik taburcu belgesi.

## 0. Ton ve kurallar

- **Noir dram.** Bursa, kasım sonu. Lodos, ardından yağmur. Tophane'de eski bir hanın üst katında bir mimarlık ofisi;
  gece yarısından sonra yanan ekranlar; bir acil servisin florasan ışığı. Her sahnede bir duyusal ayrıntı: ıslak taş,
  modemin yeşil ışığı, kurşun kalemin tıkırtısı, hastane çayının teneke tadı.
- **Davanın imgesi: yanan ekran.** Bütün dava, gece 02.00 sularında yanan bir ekranın kime ait olduğu sorusudur.
  Telefon mu, başka bir şey mi? Bu soru hikâyenin ilk yarısında **hiç sorulmaz**; oyuncu onu Ek-3 tablosundaki bir
  sütundan kendisi çıkarır.
- **İç ses.** Deniz `style: "thought"` ile kısa, keskin cümlelerle düşünür. Gözlemler, sezer, hiçbir zaman çözümü söylemez.
  - Örnek: *"Bir mesajın altında bir isim yazar. Mesajı kimin yazdığını yazmaz."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numarası yalnızca Leyla'nın kısa açıklamalarında, geri bildirimde,
  raporda, hüküm metninde ve duruşmanın resmî dilinde geçer. Deniz büroda ve sokakta insan gibi konuşur.
- **Gizem korunur.**
  - Soğuk açılış yalnızca **alıcının** gözünden: karanlık bir oda, titreyen bir telefon, ekranda bir gönderen adı. Mesajı
    yazan hiç görünmez. Konuşan kadın isimsizdir (`narrator` + `name: "BİR KADIN"`).
  - Ozan Tekin dosyaya **savcılık tanığı ve eski ortak** olarak girer; sıcak, yardımsever, kimseyi suçlamayan biridir.
    Hiçbir karakter birinci evrede onun adını şüpheyle anmaz. Müvekkilin ilk teorisi bile yanlış yöndedir: "Melis
    kendisi yazmış olabilir."
  - Ozan'a giden her bağ oyuncunun bulduğu bir kayıttan doğar: Ek-3'teki gönderen cihaz sütunu, hesap verisindeki
    bağlı cihazlar listesi, demirbaş listesi, IP abone yanıtı, üslup. Ozan'ın adı ilk kez şüpheyle, ancak oyuncu
    **07 numaralı dizüstünün ofise dönmediğini** kendisi kurduktan sonra telaffuz edilir.
- **Etik çizgi.** Avukat tanığı yönlendirmez, katılanla avukatı varken doğrudan görüşmez, bilirkişiyle gizli temas kurmaz,
  başkasının hesabına girmez, delili ayıklamaz, şüpheliyi kovalamaz (savcılığa bildirir). Bu çizgilerin her birinde bir
  seçim vardır; yanlış taraf bir bedel öder.
- **Satır kuralları:** en fazla ~220 karakter; her yeni mekân `card` + `bg` ile açılır; sert anlarda `fx`
  (`shake` kapı ve tokmak, `flash` bildirim ve şimşek, `fade` bölüm sonu).
- **Sözcük bütçesi:** tipik yol (BERAAT_E) 13–16 bin sözcük (`case:duration` ölçüsü), ≥200 aksiyon, 90–120 dk; paket
  toplamı ≥18 bin sözcük.

## 1. Gerçek ve kronoloji

**Arka plan.**
- *Aksoy Tekin Mimarlık* üç yıl önce Tophane'deki Eski Pirinç Han'ın üst katında kuruldu: Tarık Aksoy (tasarım) ve
  Ozan Tekin (iş geliştirme, ihaleler, "bilgisayar işleri").
- Ofisin bütün cihazlarını Ozan kurdu. 14 Şubat'ta Tarık'ın mesajlaşma hesabını (PUSULA) ofisin 07 numaralı
  dizüstüsüne "masaüstü oturumu" olarak bağladı: "Müşterilere ofisten de yazarsın." İki adımlı doğrulama kapalı. Tarık'ın
  PUSULA şifresi, ofisin kablosuz ağ şifresiyle aynıdır: kızının doğum yılı, `Ece2016!`.
- Mart'ta ortaklık kavgayla bitti. Ayrılık protokolüne göre Ozan, zimmetindeki 07 numaralı dizüstüyü iade edecekti.
  İade etmedi; mali müşavire "bozuldu, attım" dedi. Ozan Nilüfer'de *Tekin Yapı Danışmanlık*'ı kurdu.
- Eylül'de Tarık, restorasyon mimarı **Melis Karaca** ile Bursa Kültür Vakfı'nın Eski Pirinç Han restorasyonu ihalesine
  ortak girdi. Restorasyon uzmanlık belgesi Melis'te; o çekilirse teklif düşer. Rakip teklif verenlerden biri
  Tekin Yapı'dır.
- Ekim başında Melis, Tarık'a PUSULA'dan güvenerek iki şey gönderdi: dört yıl önceki boşanma döneminden bir ses
  kaydı (ağlayarak kardeşine anlattığı bir telefon konuşmasının kaydı) ve o dönem yattığı kliniğin taburcu belgesinin
  fotoğrafı. Vakfın özgeçmiş görüşmesinde "iki yıllık boşluğu" nasıl anlatacağını soruyordu.
- 25 Ekim gece: Tarık ile Melis arasında pay oranı kavgası (Melis eşit pay istiyor). Tarık'ın kendi mesajları
  gerçek ve sert: "bu şartlarla devam edemeyiz melis". Tarık her şeyi küçük harfle, noktalama koymadan yazar.

| Zaman | Olay |
|---|---|
| 3 Kasım 18.02 | Stajyer Kübra'nın kullandığı ofis tableti (cihaz 2) PUSULA'dan çıkış yapar; tablet sıfırlanır. |
| 6 Kasım 02.09–02.13 | 07 numaralı dizüstü (cihaz 3) Tekin Yapı'nın internet hattından (IP 85.105.44.17) çevrimiçi olur. Tarık'ın hesabından Melis'e ilk mesaj: "Sn. Karaca, ihaleden çekilmeniz herkes için en iyisi olur... Saygılar." Taburcu belgesinin fotoğrafı ekte. Sohbet aynı cihazdan **arşivlenir**; Tarık'ın sohbet listesinde görünmez. Tarık evde uyuyordur. |
| 9 Kasım 01.20 | Tarık, babası Necati Aksoy'u ritim bozukluğuyla Çekirge'deki devlet hastanesinin acil servisine getirir. |
| 9 Kasım 01.40 | Tarık'ın telefonu hemşire masasındaki şarj istasyonunda, kilitli. Hemşire Gülay Tunç bandın üstüne "AKSOY 01.40" yazar, nöbet defterine "telefon şarj istasyonunda emanet" diye işler. |
| 9 Kasım 02.10 | Tarık, babasının girişim onam formunu imzalar; form saatlidir. |
| 9 Kasım 02.12–02.14 | Cihaz 3 aynı IP'den çevrimiçi. Melis'e ikinci mesaj; Melis'in ses kaydı vakıf yönetim kurulu üyesi Hayri Sezer'e iletilir: "Hayri Bey, ortağım hakkında bilmeniz gerekenler." |
| 9 Kasım 06.05–06.10 | Nöbet defterine teslim yazılır (06.05); telefon şarjdan alınır, ilk kilit açılışı (06.10). |
| 12 Kasım 02.17–02.21 | Cihaz 3 aynı IP'den. Üçüncü mesaj: "Son mesajım. Cuma'ya kadar dosyadan imzanızı çekin. Yoksa sesiniz herkesin telefonunda. Saygılar." |
| 12 Kasım 09.00 | Melis, avukatı Av. Sinan Bulut ile Siber Suçlarla Mücadele Şube'ye şikâyette bulunur. |
| 12 Kasım 14.30 | Polis Tarık'ı ofisinde ifadeye davet eder. Tarık telefonunu kendisi verir. |
| 12 Kasım 15.40–15.52 | Şube'de Kom. Yrd. Hakan Demirci, Tarık'tan kilidi açmasını ister; telefonda sohbetleri açar, 14 ekran görüntüsü alır, ekranı kendi telefonuyla fotoğraflar. "Ön inceleme tutanağı"na "şüphelinin rızasıyla" yazar; Tarık'ın imza hanesi boş kalır. Telefon mühürsüz bir zarfa konur. |
| 13 Kasım 10.20 | Sulh ceza hâkimliği, savcılığın talebiyle telefonda arama, kopyalama ve el koyma kararı verir. |
| 14 Kasım 11.05 | Telefonun adli kopyası (imaj) alınır, SHA-256 değeri hesaplanır. Rapor "son kilit açılış: 12 Kasım 15.52" kaydını ve Ek-3 mesaj tablosunu (gönderen cihaz no sütunuyla) içerir; sonuç bölümü sütunu yok sayar: "Mesajlar şüpheliye ait cihazdaki hesap üzerinden gönderilmiştir." |
| Aralık | Uzlaştırma (TCK 134 yönünden) sonuçsuz. İddianame: TCK 107/2 (43/1 zincirleme) ve 134/2; Bursa 7. Asliye Ceza Mahkemesi. Tarık tutuksuz; yurt dışı çıkış yasağı. Ozan, katılan vekilinin bildirdiği tanıktır: "Tarık, Melis'in sırlarını bildiğini, 'pişman edeceğim' dediğini anlattı." (yalan) |
| Şubat | Tarık'ın eski avukatı dosyadan çekilir. Tarık Arslan Hukuk'a gelir. İlk celseye 12 gün var. |

**Ozan neden?** İhale ve kin. Melis çekilirse Tarık'ın teklifi düşer, Tekin Yapı'nın önü açılır; Tarık da şantajcı
olarak yargılanır. Ozan tehditleri Tarık'ın üslubuyla yazmaya çalışmaz bile: Tarık'ın asla yazmadığı gibi yazar.
"Sn.", büyük harf, üç nokta, "Saygılar." Bu, onun bütün e-postalarının imzasıdır.

## 2. Kadro: sesler, sırlar, yaylar

| Karakter | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **Deniz Arslan** (oyuncu) | Arslan Hukuk, avukat. | Kısa, alaycı iç ses; dışarıda kibar, inatçı. | Kaybettiği ilk davanın ağırlığı; "doğru delil" saplantısı. | Ekran görüntüsüne güvenen bir avukattan, delilin zincirini soran bir avukata. |
| **Leyla Erdem** (mentor) | Büronun kurucusu. | Az konuşur; her cümlesi bir ders. Bıraktığı sigaranın paketi masada. | Ters çevrilmiş çerçeve (yalnızca bir bakış). | İzler, kurtarmaz. Etik çizgide sert. |
| **Tarık Aksoy** (müvekkil, sanık) | 39, mimar. Boşanmış; 9 yaşında kızı Ece haftada üç gün onda. | Ölçülerle konuşur ("üç metre", "on iki gün"); kısa, kuru cümleler; elinde hep bir mekanik kurşun kalem, tıkırdatır. Yazarken hep küçük harf, noktasız. | Bütün şifreleri tek: kızının doğum yılı. Utanır. 25 Ekim'deki sert mesajları gerçekten yazdı. İlk teorisi yanlış: "Melis kendisi yazmış olabilir." | Kibirden tevazuya: "Herkese aynı anahtarı vermişim." |
| **Melis Karaca** (katılan) | 34, restorasyon mimarı. | Kısa, denetimli, ironik cümleler; konuyu "Neyse." ile kapatır; Deniz'e "siz" der. | Mesajların "Tarık'a benzemediğini" ilk günden sezdi ama ses kaydının Hayri Bey'e gitmesi güvenini bitirdi. | Suçlayan → kuşkulanan. Kötü değil; yaralı. |
| **Av. Sinan Bulut** (katılan vekili) | 45. | Pürüzsüz, usulcü, "müvekkilem" der; her şeyi yazılı ister. | Müvekkilini korur; kendi etik çizgisi nettir. | Rakip, ama doğru delil karşısında kapı aralayan biri. |
| **Ozan Tekin** (eski ortak, savcılık tanığı, **gerçek fail**) | 42, Tekin Yapı Danışmanlık. | Sıcak, gürültülü, herkese "üstat" der; çay ve simit ısmarlar; eski Bursa hanları üstüne bitmeyen hikâyeler. Konuşurken asla resmî değil; yazarken hep resmî: "Sn.", "Saygılar.", üç nokta. | 07 numaralı dizüstü onda. Tarık'ın şifresini o koydu. İhale. | Dost maskesi → köşeye sıkışma → CMK 48'e sığınma. |
| **Hayri Sezer** | 67, vakıf yönetim kurulu üyesi. | Ağır, eski İstanbul Türkçesi; han ve kervansaray benzetmeleri; "evladım". | Ses kaydını üç saniye dinleyip kapattı; "Başkasının sesini dinlemem." Bildirim saati telefonunda duruyor: 02.14. | Yaşlı bir beyefendinin vicdanı; tanık kürsüsünde sade bir doğruluk. |
| **Gülay Tunç** | 46, acil servis hemşiresi. | Yorgun, pratik, gece nöbetinin kara mizahı; lafı uzatmaz. | Telefonu şarja koyduğu için Tarık'ı azarlamıştı: "Masam priz değil." Bantta yazısı var. | Küçük ama kesin bir tanıklık; ikinci celsede savunma tanığı olarak kürsüye çıkar, savcının sorusuyla bir an tereddüt eder ve telefonun kendi kilit kaydıyla düzeltir. |
| **Nurten Sarı** | 55, mali müşavir. | Rakamlarla konuşur; demirbaş numaralarını ezbere bilir; dedikodudan hoşlanır ama sınırı bilir. | Ozan'ın "bozuldu, attım" dediğini not etmişti. | Belgeyi veren. |
| **Kom. Yrd. Hakan Demirci** | 35, Siber Şube. | Savunmacı, "usule uygun" nakaratı; teknik terimleri yanlış yerde kullanır. | Kararı beklemeden ekran görüntüsü aldı; tutanağa imza aldırmadı. | Kürsüde çatlayan bir kendinden eminlik. |
| **Dr. Nazlı Uçar** | 44, adli bilişim bilirkişisi (mahkemece atanır). | Klinik, kesin; "Ekran görüntüsü delil değil, anekdottur." | — | Doğru soruyu soranın müttefiki, kimsenin avukatı değil. |
| **Hâkim Feride Ateş** | Bursa 7. Asliye Ceza (tek hâkim). | Sabırlı, kuru; kısa ve öldürücü sorular. | — | — |
| **Savcı Tolga Ekinci** | 38. | Hızlı, iddialı, ama adil; delil karşısında görüş değiştirebilir. | — | — |
| **Derya** (zabıt kâtibi), **Recep Bey** (mübaşir) | | Recep Bey davaları bir tiyatro anonsu gibi çağırır. | — | — |

## 3. Yapı ve node haritası

```
PR_00  Soğuk açılış · 6/9/12 Kasım gecesi (BİR KADIN, ekran)          STORY → PR_01
PR_01  12 Kasım öğleden sonra: ofis, polis, Şube; telefon ve ekran görüntüleri   STORY → BR_00
BR_00  Bölüm 1 · DOSYA: Tarık büroda, yağmurlu akşam (seçim: ücret / söz)   STORY → BR_01
BR_01  Leyla dosyayı devreder (ceza aralığı sorusu)                     STORY
BR_01B Dosyadaki kâğıtlar (Leyla'nın üç sorusu)                         STORY
BR_02  Dosya ekranı + strateji                                          STORY → INV_SABAH → INV_HUB
INV_*  Bölüm 2 · SORUŞTURMA (3 gün × 4 EP; Leyla'ya danış günde bir, 0 EP)
  Olay yeri: INV_ARAMA_OFIS (Aksoy Mimarlık ofisi) · INV_ARAMA_HASTANE (acil servis)
  İnsanlar: INV_GORUSME (Tarık; konu × ton; fakta bağlı konular) · INV_T_GULAY · INV_T_HAYRI · INV_T_SINAN · INV_T_OZAN
  Arşiv: INV_TUTANAK (ön inceleme tutanağı) · INV_IMAJ (adli kopya raporu, Ek-3) · INV_HESAP (hesap verisi; indir → ertesi gün)
         INV_HASTANE_KAYIT (epikriz + onam formu) · INV_DIL (delil ve bilirkişi talepleri) · INV_CIKARIM (tahta, 0 EP) · INV_LEYLA
  Gün sonu: INV_DAY_END (teslimler) → INV_AKSAM1 / INV_AKSAM2
INV_GECE  Duruşmadan önceki gece (koşullu hafıza zinciri)
H1_*   Bölüm 3 · BİRİNCİ CELSE: açılış → iddianame → sanığın savunması → katılanın beyanı → ekran görüntüleri (itiraz)
       → Kom. Yrd. Demirci'nin tanıklığı (S1–S5) → talepler → ara karar ve erteleme
ARA_*  Bölüm 4 · ARA (2 gün × 3 EP; yığınsız, doğrudan dönüş)
  ARA_MELIS (Sinan'ın bürosunda) · ARA_NURTEN (demirbaş belgesi) · ARA_EV (Tarık'ın evi, sahne) · ARA_SUC (suç duyurusu)
  ARA_TARIK (Tarık'ın teklifi: etik tuzak) · ARA_CIKARIM · ARA_LEYLA · olay: ARA_OZAN (Ozan büroya gelir)
  ARA_DAY_END → ARA_AKSAM · ARA_SON (gelen cevaplar)
T_*    Bölüm 5 · İKİNCİ CELSE: bilirkişi → Hayri → Ozan (O1–O5; CMK 48) → savcının karşı delili → mütalaa + cevap
       → dayanaklar → esas savunma → son söz → hüküm → epilog
T_COKUS  (güvenilirlik 0) → son söz → hüküm
```

## 4. Sahne sahne

> Sözcük sayıları hedeftir (±%20).

### PR_00 — Soğuk açılış · "02.11" (~650) · bg: sokak_karanlik → ev
- `card`: "6 KASIM · GECE 02.11 — BURSA". Lodos camları zorluyor. Bir yatak odası; komodinde titreyen bir telefon (`flash`).
- BİR KADIN uyku sersemi ekranı okur. EKRAN satırları anlatıcı olarak: gönderen adı "TARIK AKSOY". "Sn. Karaca…"
- Kadın bir fotoğrafı tanır: kendi taburcu belgesi. Nefesi kesilir. Yazmaya başlar, siler.
- `card`: "9 KASIM · 02.14". Bu kez bir sesli mesajın "iletildi" bildirimi; kadın kendi ağlayan sesini, yıllar önceki
  sesini duyar; bir başkasına gittiğini öğrenir.
- `card`: "12 KASIM · 02.19". "Son mesajım." Kadın telefonu yatağa bırakır, sonra yeniden alır ve bir numara çevirir:
  "Sinan Bey. Uyandırdım, biliyorum. Bir avukata ihtiyacım var."
- Kapanış iç sesi yok (henüz Deniz yok); anlatıcı: "Ekranda bir isim yazıyordu. Bütün dava o ismin üstüne kuruldu."

### PR_01 — "12 KASIM · 14.30" (~600) · bg: buro → karakol
- Eski Pirinç Han'ın taş merdivenleri; Aksoy Mimarlık. İki sivil polis. Tarık ölçü masasında; kurşun kalem tıkırtısı.
- Telefonunu kendisi uzatır: "Bakın. Saklayacak bir şeyim yok."
- `card`: "SİBER SUÇLARLA MÜCADELE ŞUBE · 15.40". Kom. Yrd. Demirci: "Kilidi açar mısınız? Sadece bakacağız."
  Ekran görüntüsü sesleri; bir başka telefonun flaşı (`flash`). Tarık arşivlenmiş bir sohbetin içinde kendi adıyla
  yazılmış satırları görür: "Ben bunu yazmadım." Demirci: "Herkes öyle der."
- Zarf; bant; mühür yok. Bu ayrıntı tek bir anlatıcı cümlesiyle geçer.
- Anlatıcı: "Üç ay sonra iddianame. Bir celse önce avukatı çekildi. Bir şubat akşamı, yağmurda, Arslan Hukuk'un kapısını çaldı."

### BR_00 — Bölüm 1 · "Tarık Bey" (~900) · bg: buro_gece
- `card`: "ŞUBAT · SALI 20.50 — ARSLAN HUKUK, BURSA". Deniz (thought): "Kasımda mesaj gelir, şubatta avukat."
- Tarık ıslak bir rulo çizimle girer; teklifin vakıftaki son günü yaklaşmaktadır. Konuşmayı ölçülerle yapar.
- Duygusal çekirdek: "Kızım okulda birinin annesinden duymuş. 'Baban kötü mesaj mı atmış?'"
- Seçim (puansız, ilişki etkili): "Önce dosyayı okuyayım, sonra konuşuruz." (güven +4; dürüstlük) · "Beraat
  ettiririz." (söz; güven +6 ama Leyla'nın uyarısı ve olumsuz sonuçta epilogda hatırlatma) · "Tarifemizi anlatayım." (nötr).
- Leyla kapıda: "Söz verme. Dosyaya bak."

### BR_01 — Leyla dosyayı devreder (~600)
- Ceza aralığı sorusu sahnenin içinde: 107/2 (1–3 yıl hapis + adli para; zincirleme) ve 134/2 (2–5 yıl). Görevli
  mahkeme asliye ceza, tek hâkim. Yanlışlarda kısa ders.
- Leyla'nın masasındaki ters çerçeve (bir satır).

### BR_01B — Dosyadaki kâğıtlar (~450)
- Leyla üç kâğıdı masaya dizer: ön inceleme tutanağı, adli kopya raporu, Melis'in şikâyet dilekçesi. "Hangisine önce
  bakarsın?" (seçim yalnızca yorum ve ipucu sırası; puansız). Leyla: "Ekran görüntüsü bir fotoğraftır. Fotoğrafın
  çerçevesinin dışını sor."

### BR_02 — Dosya ekranı + strateji (~300)
- Masumiyet → "Cesur. Mesajları kimin yazdığını göstermen gerekecek." · Usul → "Ekran görüntüleri kararsız alındıysa
  yarı yoldasın. Yarısı." · Terditli → "Güvenli. Ama müvekkiline 'birini yazmış olabilirsin' mi diyeceksin?"

### Bölüm 2 · SORUŞTURMA (~5.500 tipik yolda)
- **INV_SABAH** (~250) · bg: sokak_sabah: Tophane'de sabah; han kapısında simitçi; Deniz'in planı.
- **Hub hedefleri:** gün 1 "Mesajlar nereden çıktı? Telefon karakolda kimin elindeydi?"; gün 2 (bulgulara göre)
  "Ek-3'teki sütun / hastane gecesi / bağlı cihazlar"; gün 3 "Talepler son gün. Duruşmada neyi istiyorsun?"
- **INV_T_KUBRA** (Tophane'de kahve): eski stajyer; tablet ve wifi notu. "Bilgisayarları kim kurardı?" ancak Ek-3'teki
  cihaz sütunu bulunduktan, "Ozan Bey'le görüştünüz mü?" ancak ofisteki boş "07" dok bulunduktan sonra açılır.
- **INV_GORUSME (~1.400)** · bg: buro. Tarık'ın kızını okuldan alma saatine 15 dakika var. Konular: "O geceler",
  "Melis", "Karakolda telefon", "Şifre" (ofiste yapışkan not bulunduysa), "Ozan" (dok istasyonu ya da üslup bulgusu
  varsa), "Bağlı cihazlar" (Ek-3 sütunu bulunduysa). Yumuşak ton güven +4, sert ton −8 ve ek bilgi (sert tonun
  verdiği bilgi duruşmada okunur).
  - "O geceler" (yumuşak): "6'sında uyuyordum. 9'unda… 9'unda hastanedeydim. Babam." (hastane etkinliğini açar)
  - "Melis" (sert): "Pay kavgası gerçek. Yazdıklarım da. Ama o geceki mesajlar… Belki kendisi yazdı. İhaleden beni
    atmak için." (yanlış iz)
  - "Şifre": "Ece2016. Ünlemle. Her yerde. Biliyorum. Mimarım, kasa çilingiri değil."
- **INV_ARAMA_OFIS** (sahne): Ozan'ın boş masası; üstünde "07" etiketli boş bir dok istasyonu; klavyenin altında
  yapışkan not "wifi: Ece2016!"; rafta "Yazışmalar" klasörü: ayrılık protokolünün kapak yazısı, eki eksik, kenarda
  "Asıl liste N. Sarı'da" (Nurten'e giden iplik; imza eşleşmesi burada değil, ARA'da); ortaklık fotoğrafı (dikkat
  dağıtıcı); Pirinç Han planı (dikkat dağıtıcı). Masa on bir aydır boş (Mart'tan beri).
- **INV_ARAMA_HASTANE** (sahne; Tarık "hastane" dediyse açılır): hemşire masasındaki şarj istasyonu, bantta "AKSOY 01.40";
  koridor kamerası; onam formu panosu; otomat. Hemşire Gülay'la kısa konuşma (INV_T_GULAY, ancak sahne arandıktan sonra):
  telefonun yeri (bant), onam formunun saatini kimin yazdığı (kayıtlar ancak bundan sonra istenebilir), "çağırırlarsa gelirim".
- **INV_TUTANAK** (belge): imza hanesi boş; mühür hanesi "—"; ekran görüntülerinin saati (12 Kasım 15.44) ile hâkimlik
  kararının saati (13 Kasım 10.20). Karşılaştır aletiyle oyuncu kararsızlığı kendisi görür.
- **INV_IMAJ** (belge; dosyanın en uzun anı): "son kilit açılış 12.11 15.52"; imaj tarihi 14.11; Ek-3 satırları. Büyüteç
  üslubu, karşılaştır gönderen cihaz numarasını açar. Bu an bir kırılmadır (`flash`): "Cihaz 0. Cihaz 0. Cihaz 3."
- **INV_HESAP** (belge; müvekkil "bağlı cihazlar" konusunda indirmeyi kabul ettikten sonra istenir, ertesi gün okunur;
  Ek-3'te dört satır ve IP'de dört satır tek tek karşılaştırılmalı): cihaz 2 (ofis tableti, 3 Kasım'da çıkış) ve
  cihaz 3 (OFIS-LAPTOP-07, son etkin 12.11 02.21; IP 85.105.44.17), arşivleme olayı. İndirme Tarık'ın kendi hakkıdır;
  Deniz dosyayı noterde hash'le tespit ettirir (dijital delili savunma da korur).
- **INV_HASTANE_KAYIT** (belge; Gülay'dan sonra): epikriz ve onam formu; Tarık'ın imzası 02.10. Tahtada iki adım: kilit +
  bant → "Kilitli, hemşire masasında"; bu kart + onam → "02.14'te Tarık acil serviste".
- **INV_T_SINAN** (kafe): katılan vekiliyle konuşma. Doğru yol: görüşmeyi onun aracılığıyla istemek. Yanlış yollar:
  Melis'i doğrudan aramak (etik), "müvekkiliniz uydurdu" demek (iftira riski).
- **INV_T_HAYRI** (vakıf ofisi): bildirim saati 02.14; "Başkasının sesini dinlemem evladım."
- **INV_T_OZAN** (Tekin Yapı; çay, simit, han hikâyeleri). Ozan yardımseverdir: "Tarık'ı severim üstat, ama o gece kafede
  söyledikleri…" Tuzak: Deniz bağlı cihazlardan ya da 07'den söz ederse Ozan uyarılmış olur (`ozan_uyarildi`): ara
  evresinde dizüstü bulunamaz, bir puan kaybedilir. Cihaz sorusu ancak boş dok ya da bağlı cihaz kaydı bulunduktan sonra
  sorulabilir. Ayrılırken imzasız bir veda ("Hadi, kolay gelsin."): birinci evrede Ozan'ın ağzından "Saygılar" çıkmaz.
- **INV_DIL** (talepler, 3 hak): bağımsız adli bilişim bilirkişisi ve imajın kopyası (cihaz 3 görülmüşse; CMK 134/5, 63,
  67); hastane kayıtlarının resmî celbi; Hayri Sezer'in tanık olarak dinlenmesi (bildirim saatini öğrendiyse); ücretsiz ek:
  noter tespitli hesap dökümü; reddedilecek olanlar (katılanın telefonunun incelenmesi; platformdan yurt dışı yazışma; keşif).
- **INV_CIKARIM** (tahta, 0 EP): altı tarif + yanlış iz kartları (pay kavgası, "Melis yazdı" teorisi).
- **INV_AKSAM1/2** (~300): Leyla ile kısa sahne; ikinci akşam Tarık'ın kızı Ece telefonda ("Babam yalan söylemez");
  Ozan ziyaret edildiyse masada yalnızca kartviziti kalır; Deniz onu çekmeceye koyar (imzalı mesaj yok; gizem korunur).
- **INV_GECE** (~450): pano, koşullu sayım; Leyla: "Yarın tanık kürsüde ne derse desin, tutanağı oku."

### Bölüm 3 · BİRİNCİ CELSE (~2.600) · bg: durusma_salonu
- `card`: "BURSA 7. ASLİYE CEZA MAHKEMESİ — 1. CELSE". Recep Bey: "Tarık Aksoy dosyası!"
- Açılış ve iddianame; Melis ve Sinan katılan sırasında. Tarık kurşun kalemini ceketine saklar.
- **Sanığın savunması:** Deniz'in tavsiyesi (anlat / sus / "Melis yazdı" / "başkası yazdı" erken suçlama).
- **Katılanın beyanı:** Melis'in kısa ve sert konuşması; ses kaydının iletildiği an. Salon sessiz.
- **Ekran görüntüleri:** savcı okutur; itiraz (CMK 134/1, Anayasa 20/2, 38/6, CMK 206/2-a, 217/2).
- **Kom. Yrd. Demirci** (S1–S5): rıza, "telefona dokunmadık", "mesajlar telefondan gönderildi", hash, kanaat. Doruk:
  Ek-3'teki cihaz sütunu sunulunca Demirci tabloya bakar ve susar: "O sütun… raporun ekinde."
- **Talepler ve ara karar:** bilirkişi, IP sorgusu (ancak 9 Kasım Demirci'ye sunulup tutanağa geçtikten ve hesap dökümü
  dosyaya girdikten sonra: "O gece cihazın başında kim varsa, bu hattın ucundaydı"), hemşire Gülay Tunç (aynı kayıttan
  sonra), hastane kayıtları, hesap dökümünün dosyaya alınması; üç hafta erteleme. Adli kontrolün kaldırılması talebi.

### Bölüm 4 · ARA (~3.000)
- **ARA_GIRIS:** adliye merdivenleri, yağmur. Sinan yanına gelir: "Müvekkilem sizinle konuşmak istiyor. Benim bürom, benim
  huzurumda." (ancak birinci celsede Ek-3 sunulmuşsa ya da INV'de görüşme usulüne uygun istenmişse; aksi hâlde Melis
  yalnızca bir yazılı not bırakır).
- **ARA_MELIS** (~700): Melis: "Tarık bana bir kere bile 'Sn.' demedi. Bir tek ihale yazışmalarında görürdüm bunu."
  Ses kaydını yalnızca Tarık'a gönderdiğini söyler. Şikâyetten vazgeçmesi önerilirse Sinan toplantıyı bitirir.
- **ARA_NURTEN** (belge): ayrılık protokolü ve demirbaş listesi; 07 numaralı dizüstü "iade: —", not: "O.T. 'bozuldu' dedi."
  Nurten, Ozan'ın "Sn. Sarı, 07 için tutanağa gerek görmüyorum... Saygılar." e-postasını protokolün arkasına zımbalamıştır;
  imzanın tehditlerle eşleşmesi ilk kez burada, tahtada mümkün olur.
- **ARA_EV** (sahne): Tarık'ın çalışma odası: Ozan'ın Mart'ta geri yolladığı koli (içinde her şey, dizüstü hariç;
  üstünde "Gerisi sende... Saygılar." notu); modem; eski tablet; Ece'nin çizimi.
- **ARA_OZAN** (olay; ilk ara akşamı): Ozan büroya gelir, "yardım etmek" ister; sorular sorar ("Bilirkişi ne dedi
  üstat?"). Oyuncu bilgi vermezse güvende; verirse `ozan_uyarildi`.
- **ARA_HRESMI** (belge): mahkemenin celbettiği hastane yazısı: onam formunun aslı gibi örneği, nöbet defteri (01.40
  emanet, 06.05 teslim, paraf G.T.), kamera kaydının saklama süresi dolduğu. Bant atılır, defter kalır.
- **ARA_TARIK** (etik tuzak; yalnızca dava güçlüyken: sütun ve 9 Kasım salonda, rapor okunmuş, suç duyurusu verilmiş):
  Tarık, Ozan'ın e-postasına eski ortak şifresiyle girmeyi ya da 25 Ekim mesajlarını noter dökümünün kopyasından silmeyi
  önerir. Kabul edilirse ikinci celsenin başında ortaya çıkar (hash uyuşmazlığı ya da büronun hattından giriş kaydı). Doğru yol: reddetmek ve savcılığa suç duyurusu. Yanlış yol: `karartma` → ETİK sonu.
- **ARA_SUC** (suç duyurusu): hesabı ele geçiren kişi(ler) hakkında; Ozan'ın adı yalnızca demirbaş + IP/bağlı cihaz
  dayanağıyla yazılabilir. Savcılık Tekin Yapı'da arama yapar; Ozan uyarılmadıysa 07 numaralı dizüstü dolapta bulunur.
- **ARA_RAPOR** (belge, 2. hafta; ~450): Dr. Uçar'ın raporu. Leyla: "Bilirkişi senin tanığın değil; mahkemenin gözü."
  İsabetler: cihaz 3 = PUSULA Masaüstü (Windows); 9 Kasım'da dokunma olayı yok; polisin 14 ekran görüntüsünün imajdan
  önce telefona yazılmış olması (karşılaştır); raporun dürüst sınırı: "cihaz 3'ü kullanan bu imajdan belirlenemez."
- **ARA_VAKIF** (Koza Han, belge; ~500): Hayri Bey ihale dosyasını gösterir ("Dosya vakfındır, mahkeme isterse
  gönderirim; gözünle bakmana kimse bir şey demez"). Gelen evrak defterinde 10 Kasım 09.12'de Tekin Yapı'dan bir e-posta:
  "Sn. Kurul, ortak girişimin bir üyesine ilişkin özel kayıtların dolaşımda olduğu... Saygılar." Ses kaydı yedi saat
  önce iletilmiş, dedikodu bir hafta sonra yayılmıştır: yazanın bildiği, yalnızca göndericinin bilebileceği bir şeydir.
  Tahtada tehditlerin üslubuyla ikinci bir "aynı imza" yolu açar.
- **ARA_SON** (~400): IP abone yanıtı gelir (istendiyse): "85.105.44.17 — Tekin Yapı Danışmanlık Ltd. Şti., Nilüfer."
  Deniz (thought): "Bir ekran. Bir hat. Bir adres."

### Bölüm 5 · İKİNCİ CELSE (~3.000)
- `card`: "ÜÇ HAFTA SONRA — 2. CELSE". Ozan tanık bekleme salonunda, takım elbiseli, gülümsüyor.
- **Dizüstü (T_00L; yalnızca savcılık bulduysa, ~350):** Savcı aramayı ve mühürlü torbayı bildirir. Deniz'in sınavı:
  "Hemen açılsın, ekranı görelim" (polisin hatasının tekrarı) mı, yoksa "mühür tutanakla açılsın, imaj ve hash alınsın,
  inceleme kopyada yapılsın" mı? Davanın hukuki ekseni bu kez savunmanın kendi elindeki delilde sınanır.
- **Bilirkişi Dr. Uçar:** rapor; sorular (cihaz 3, kilit kayıtları, ekran görüntülerinin değeri). Bilirkişi istenmediyse
  yalnızca polis raporu okunur.
- **Hayri Sezer:** 02.14 bildirimi; sade doğruluk (soru ancak soruşturmada saat öğrenildiyse sorulabilir).
- **Gülay Tunç (yeni, savunma tanığı):** bant ve nöbet defteri (G2), savcının sorusuyla doğan tereddüt: "ikiye doğru
  telefona bir kez baktı galiba" (G3) → müdafi kilit kaydını gösterir, tanık "görmedim, sandım" diye düzeltir; onam
  formunu kendi yazısı olarak tanır (G4). Telkin değil, açık duruşmada belgeyle karşılaştırma.
- **Bilirkişi daraltması:** B1/B2 teyidi raporun Bulgu 1/2'si okunmadan alınamaz; "teknik olarak sanığın kendisi de
  olabilir" (B4) cümlesi ancak sağlayıcı yanıtı + ev hattının belgesiyle üç gece için daraltılır.
- **Ozan Tekin** (O1–O5): "pişman edeceğim" iddiası (kanaat/duyum); "her şeyi teslim ettim" (demirbaş); "PUSULA'yı yalnızca
  telefonda kullanırım" (IP); "Tarık'ın şifresini nereden bileyim" (yapışkan not, kurulum); "mesajlar Tarık'ın
  üslubu" (üslup). Kırılma: hâkim CMK 48'i hatırlatır; Ozan "Bu soruya cevap vermeyeceğim." Salon uğuldar (`shake`).
- **Ozan suç duyurusuyla şüpheli konumundaysa** hâkim onu yeminsiz dinler (CMK 50/1-c); Ozan bunu bir ayrıcalık gibi
  gülümseyerek karşılar.
- **Katılanın beyanı (T_04K; ara evresinde Melis'le görüşüldüyse, ~250):** Melis: "Bugün o ismin, mesajları yazan kişi
  olduğundan emin değilim. Şikâyetimi geri almıyorum; doğru kişiye yönelsin istiyorum." Deniz beyanı saygıyla tutanağa
  geçirtir; "vazgeçme sayılsın" demek ya da özür beklemek bedel öder.
- **Savcının karşı delili:** 25 Ekim mesajları (saik). Doğru cevap: öfkeli ama tehdit içermeyen ticari tartışma;
  üslup farkı.
- **Mütalaa** (dört varyant: beraat / 9 Kasım yönünden beraat, öbür iki gece için ceza / takdir + ceza / ceza) ve cevap.
- **Karar arası:** Deniz tutanağı satır satır sayar (kaynak, 9 Kasım, el, usul, savunma); hüküm bu satırlara dayanır. **Dayanaklar** (3 seçim). **Esas savunma** 3–5 satırlık konuşma. **Son söz:** Tarık'ın
  seçilen cümlesi.

### Epiloglar (OutcomeDef.epilogue; her biri ~200–350)
- **BERAAT_B:** "TÜRK MİLLETİ ADINA…" Koridorda Melis, Tarık'a yaklaşamaz; Deniz'e "Neyse." der, sonra "Teşekkür ederim."
  Ozan'ın adı geçen bir suç duyurusu; Tarık telefonunu emanetten alır, PUSULA'yı açar, "bağlı cihazlar"a girer ve bütün
  oturumları kapatır. Son satır: "Ekran karardı. Bu kez kimse yazmıyordu."
- **BERAAT_E:** (suç duyurusu verilip dizüstü bulunduysa: "Kâğıtlar ismi söyledi; ben esas savunmada susmuştum" varyantı) Beraat, ama vakıf ihaleyi başka firmaya verdi; koridorda "Şüpheden yararlandı" fısıltısı. Tarık: "Kızıma ne
  diyeceğim? 'Kanıtlayamadılar' mı?" İç ses: "Bazen beraat bir kapıyı açar, ama ekran hâlâ yanar."
- **KISMİ (İNDİRİM):** 134'ten beraat, 107'den HAGB (beş yıl denetim). Tarık: "Yarım masumiyet." Melis koridorda bakmadan
  geçer; merdivende Gülay ve Hayri; Leyla: "Bir gece kurtardın; çünkü o geceyi kâğıtla anlatan herkesi salona getirdin."
- **MAHKÛMİYET:** Emanetten alınan telefon; arşivlenmiş sohbet hâlâ orada. İç ses: "Bir sütun. Bakmadım."
  Çöküşte: savcının "İyi bir avukat olacaksınız. Bugün değil." cümlesi.
- **ETİK:** Leyla masaya meslek kuralları kitapçığını bırakır; Tarık'ın kurşun kalemi masada unutulmuştur; üç hafta sonra
  baro disiplin kurulu.
- Söz verildiyse ("Beraat ettiririz") olumsuz sonuçlarda bir satır daha.
