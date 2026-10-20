# Dava #05 — Gece Yarısı Gaspı · Hikâye Kitabı (noir)

> Bu belge Dava #05'in **anlatı kaynağıdır**; yapı ve yoğunluk olarak Dava #07 v2 hikâye kitabını
> (`docs/content/gece-bekcisinin-sirri-hikaye.md`) örnek alır. Hukuki gerçek, delil zinciri, sonuç koşulları ve puanlar
> `docs/content/gece-yarisi-gaspi.md` ve `docs/legal/gece-yarisi-gaspi.md`'dedir; bu belge onları **sahneye** çevirir.
> Kod bu belgeden sonra yazıldı (authoring-guide §1).

## 0. Ton ve kurallar

- **Noir dram.** Bursa, ocak sonu ile nisan arası; Tophane'nin merdivenli sokakları, Yıldırım'ın sıra apartmanları,
  acil servisin florasan ışığı. Yağmur hiç tam dinmez. Her sahnede bir duyusal ayrıntı: ıslak taş basamak, sarı kurye
  kutusunun plastik kokusu, monitör bipi, kesik elektrikte mum alevi, motosiklet egzozunun soğukta tüten dumanı.
- **Tema: hafıza bir delil değil, bir sahnedir.** Mağdur yalan söylemiyor; ona gösterilen tek bir fotoğraf, aklındaki
  yüzün üstüne yapıştı. Dava #07'de tanık bilerek yalan söylüyordu; burada kimse yalan söylemiyor ve herkes yanılıyor.
  Gerçeği bulmak, bir insanı yalancı çıkarmadan onun hafızasının nasıl kirlendiğini göstermektir.
- **İç ses.** Deniz `style: "thought"`, birinci tekil şahıs, kısa ve keskin. Gözlemler, kuşkulanır; çözümü asla
  söylemez. Örnek: *"Bir yüzü hatırlamak, onu yeniden çizmektir. Her çizimde biraz değişir."*
- **Hukuk konuşmada değil, sonuçta.** Madde numarası yalnızca Leyla'nın kısa açıklamalarında, seçenek geri
  bildiriminde, rapor ve hüküm metinlerinde ve duruşmanın resmî dilinde (başkan, savcı, Deniz'in talepleri) geçer.
- **Gizem korunur.** Soğuk açılışta faile ve polise ad verilmez (`speaker: "narrator"` + `name`: "KAPÜŞONLU",
  "BİR POLİS"). Kuzen Tolga'nın fail olduğu, oyuncu ara evresinde HızlıPaket kayıtlarını eline alana kadar hiçbir
  metinde söylenmez ya da güçlü biçimde ima edilmez. Tolga'nın ilk görünüşünde (2. gün akşamı) beresi kulaklarına
  kadar iner; küpe deliği görünmez. Bu adil bir ipucudur, ama bir işaret parmağı değildir.
- **Etik çizgiler gerçektir.** Avukat tanığa saat ezberletmez, mağdurun kapısında ısrar etmez, mağdura fotoğraf
  göstermez, şüpheliyi kovalamaz; bildiğini savcılığa yazar. Bu çizgilerin her biri oyunda bir seçimdir ve bedeli vardır.
- **Satır kuralları:** satır ≤ ~220 karakter; her yeni mekân `style: "card"` + `bg` ile açılır ("CUMA 21.15 — ARSLAN
  HUKUK, BURSA"); sert anlarda `fx` (`shake` kapı/tokmak, `flash` flaş/şimşek, `fade` bölüm sonu).
- **Sözcük bütçesi:** tipik yol (BERAAT_E) ~14 bin `case:duration` sözcüğü, ≥200 aksiyon, 90–120 dk; bütün dallar
  ≥18 bin sözcük.

## 1. Kadro: sesler, sırlar, yaylar

| Karakter | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **Deniz Arslan** (oyuncu) | 31, Arslan Hukuk. Dava #07'den önce ya da sonra fark etmez: hâlâ "ilk dosyasını" kaybetmenin yükünü taşıyor. | Kısa, alaycı iç ses; dışarıda nazik ama inatçı. | Bir yüzü hatırladığından emin olan insanlara inanmamayı öğrenmiş; bu dosyada o kuşkunun bir yaraya dönüşmemesi gerekiyor. | Kuşku → empati. Mağduru yalancı çıkarmadan kazanmayı öğrenir. |
| **Leyla Erdem** (mentor) | 58, büronun kurucusu. | Az konuşur; her cümlesi bir ders. Masasında bırakılmış sigara paketi. | Ters çevrili çerçeve (Dava #15 tohumu; burada bir kez görünür). | İzler, kurtarmaz. Etikte sert: "Tanığa dokunduğun an, tanık senin olur. O zaman kimsenin değildir." |
| **Barış Kılınç** (müvekkil) | 22, HızlıPaket motokuryesi. 2023'te bir düğün kavgasından HAGB'li bir yaralama dosyası var; polisin elinde o günün gözaltı fotoğrafı duruyor. | Hızlı konuşur, espriyle kaçar; "abla" der. Ateşliyken sesi kısık. Güven azalınca susar, "boş ver abla" der. | Ehliyeti askıdaki kuzeni Tolga'ya dört aydır kendi kurye hesabını ve motorunu kullandırıyor (sözleşmeye aykırı). O gece de Tolga çalıştı. Barış bunu, Tolga'yı ve işini korumak için kimseye söylemedi; Tolga'nın bir kadını soyabileceğine inanmıyor. | Sadakat → kırılma → doğruyu söylemek (son söz). |
| **Derya Kılınç** (abla, büroya gelen) | 29, Yıldırım'da küçük bir kuaför salonu. | Keskin, kısa cümleler; sigara içer; makas, ayna, boya metaforları. Kimseye "abla" dedirtmez, herkese "canım" der. | 19 Ocak şafakta Tolga'nın ıslak sırılsıklam gelip motor anahtarını paspasın altına bıraktığını, kolunun yırtık olduğunu gördü. Kuşkulandı, sustu; salonunun birikimiyle avukat tuttu. | Susmak → konuşmak. Ara evresinde Tolga'yı savcılığa kendisi götürür (yalnızca doğru yolda). |
| **Sevim Kılınç** (anne) | 54. | Tespihli, kısık; "oğlum" ile başlar, "Allah'ım" ile biter. | Polise "evdeydi" dedi; kimse yazmadı. | Kısa sahneler; duygusal çapa. |
| **Tolga Kılınç** (kuzen, gerçek fail) | 25, Barış'ın amca oğlu; ikiz gibi büyüdüler. Ehliyeti alkolden askıda; inşaatta günlükçü. | Alçak sesli, mahcup, "kanka"; cümlelerini yarıda bırakır. | Kaçak bahis borcu. O gece Barış'ın hesabıyla çalışırken Sırmakeş merdivenlerinde bir kadının çantasını kaptı. Suçluluğunu avukat ücretine "katkı" zarfıyla bastırmaya çalışır. | Gölge → itiraf (B yolu) ya da kaçış (E yolu). |
| **Nermin Aksoy** (mağdur) | 59, özel bir hastanede hasta bakıcı; dul. | Nazik, yorgun; merhum kocası İsmail'den söz eder; "evladım" der. | Yalan söylemiyor. Acil serviste bir polisin telefonunda gösterilen tek fotoğraf, aklındaki yüzün yerine geçti; 112'de söylediği "kulağında halka" ve "itti, düştüm" ayrıntıları, ertesi sabah "bıçak" ve "düz bir çocuk" oldu. Çantasında İsmail'in köstekli saati vardı. | Kesinlik → şüphe → (B) saatine kavuşur. Kürsüdeki "Ben öyle mi demişim?" anı davanın duygusal doruğudur. |
| **Kom. Yrd. Ferhat Oral** | 38, Osmangazi asayiş. | Hızlı, rakamlarla konuşur: "iki ayda dört gasp", "prosedür". Sigara. | Acil serviste telefonundan tek fotoğraf gösterdi ve "kaydı var, bıçakla yakalanmıştı" dedi (yanlış: 2023 dosyası yumruktu). Ertesi gün aynı fotoğrafı beş benzemez arşiv fotoğrafının arasına koydu. | Savunmacı → kürsüde çatlar (bastırılırsa). Kötü değil; aceleci ve baskı altında. |
| **Kadir Bayram (Kadir Usta)** | 71, emekli terzi, Kılınçların üst kat komşusu; mazeret tanığı. | Terzi diliyle: "Ölçmeden biçmem." Uykusuz, gözlüklü. | Gözlerinde katarakt var; o gece Barış'ı karanlıkta sesinden tanıdı. Mahkemelerden korkar (oğlunun eski davası). | Çekingen → tanıklık. Savcının "kuzenleri ayırabilir misiniz" sorusu onu sınar. |
| **Gamze Ateş** | 31, acil servis hemşiresi. | Hızlı, profesyonel, nöbet yorgunu; tıbbi kısaltmalarla konuşur. | Hemşire gözlem formuna "00.40 polis memuru hastaya telefondan fotoğraf gösterdi" yazdı; başı derde girer diye korkuyor. | Korku → mahkemede düz anlatım. |
| **Ali Rıza** | 63, Sırmakeş merdivenlerinin dibindeki bakkal. | Lafazan; mahallenin hafızası. | 112'yi Nermin onun telefonundan aradı; "kulağında halka" sözünü o da duydu. | Bağımsız bir doğrulama sesi. |
| **Cemal Usta** | 50, Tophane Kebap Salonu ustası (ara evresi). | Kısa, ızgara başında. | O gece 23.31'de siparişi alan kuryenin "bereli, kulağı halkalı" olduğunu hatırlar; adını bilmez. | — |
| **Savcı Orhan Bayar** | 54. | Ağır, metodik, adil: "Delil, avukat hanım. Duygu değil." | — | Doğru delille görüş değiştirir; Tolga teslim olursa beraat ister. |
| **Başkan Rahmi Yazıcı / Üye Elif Karaca** | Bursa 6. Ağır Ceza heyeti. | Başkan sabırlı, resmî; Elif Karaca'nın soruları kısa ve keskin. | — | — |
| **Mübaşir Şükrü** | — | "Barış Kılınç dosyası, taraflar salona!" Her çağrıdan sonra boğazını temizler. | — | — |
| **İnfaz koruma memuru Hasan** | 45. | Az konuşur. | — | — |

## 2. Gerçek ve kronoloji (oyuncudan saklı)

| Saat | Olay |
|---|---|
| 18 Ocak 17.40 | Barış aile hekiminde: ateş 39,1; e-reçete (parasetamol). Eve dönüp yatar. |
| 22.31 | Tolga → Barış mesajı: "Hesabı ben açıyorum bu gece, sen yat kanka." |
| 22.45 | Tolga, Barış'ın motorunu (yedek anahtarla) sokaktan alır. |
| 22.58 | Tolga, kendi telefonundan (Redmi, cihaz …7741) Barış'ın HızlıPaket hesabına girer; zorunlu özçekimi bereli ve sol kulağında halkayla çeker; yüz eşleştirme %91 "onaylı" der. |
| 23.31 | Tophane Kebap Salonu'ndan sipariş alımı (kurye: "Barış K."). Cemal Usta bereli, halkalı kuryeyi görür. |
| 23.36–23.51 | Yıldırım, Mimar Sinan Mah.'de trafo arızası; elektrik kesik (UEDAŞ kaydı). |
| ~23.38 | Kesik elektrikte Barış öksürerek balkona çıkar; üst kattaki Kadir Usta mumla balkondadır: "Usta sizde de mi gitti?" |
| 23.39–23.44 | Barış'ın telefonu evdeki modeme bağlı, ekranı açık (telefon inceleme raporu). |
| 23.41 | Hesap konumu Sırmakeş merdivenlerinin alt başında durur (GPS). |
| 23.42 | Tolga merdivenden çıkar, Nermin'in çantasını soldan çeker, iter. Nermin kırık şişe camının üstüne düşer; sol avucu kesilir. Tolga motora koşar. Bir şey parlar: Tolga'nın halkası. |
| 23.43 | Nermin bakkal Ali Rıza'nın telefonundan 112'yi arar: "Kurye gibiydi, sırtında sarı kutu… itti beni, düştüm, elim kesildi… kulağında halka vardı, parladı." Bıçak yok. |
| 23.55 | Tolga siparişi teslim eder (soğumuş bir kebap). 00.20 hesaptan çıkar. |
| 19 Ocak 00.21 | Nermin acile getirilir; yaraya iki dikiş. |
| 00.40 | Kom. Yrd. Ferhat Oral gelir. Bölgede kayıtlı kuryeleri taramış; telefonunda Barış'ın 2023 gözaltı fotoğrafı (kazınmış saç, ince bıyık; Tolga'nın bugünkü hâline daha çok benzer): "Bu mu teyze? Kaydı var. Bıçakla yakalanmıştı." Nermin ağlar: "Galiba… o." Hemşire Gamze gözlem formuna not düşer. |
| 00.38 | Tolga → Barış: "Anahtarı paspasın altına koydum." (Barış uyuyor.) |
| 05.50 | Derya, abisinin evine uğrar (salonu açmadan); Tolga'yı merdivende ıslak, kolu yırtık görür; sorar, "düştüm" der. |
| 08.10 | Barış evde gözaltına alınır (ateşli). Telefonuna el konur. Annesi "evdeydi" der; tutanağa girmez. |
| 10.05 | Karakolda fotoğrafla teşhis: altı fotoğraf; Barış'ınki aynı 2023 karesi, renkli ve büyük; diğer beşi siyah-beyaz, 38–52 yaş. Uyarı yapılmaz, işlem bir kez yapılır, video yok. "Tarif beyanı" bölümü 10.20'de doldurulur. Nermin 3 numarayı "hemen" seçer. |
| 11.30 | Nermin'in kolluk ifadesi: "Elinde bıçak vardı, parladı." Halkadan söz yok; "düz, temiz bir çocuktu." |
| 21 Ocak | Tutuklama. |
| Mart | İddianame: TCK 149/1-a, h (silahla, gece vakti). Bursa 6. Ağır Ceza. |
| 2 Nisan | Derya, Arslan Hukuk'a gelir. 1. celse 14 Nisan. |

**Ters köşe:** fail, Barış'ın hesabını ve motorunu kullanan, ona çok benzeyen kuzeni Tolga'dır. Teşhisi kirleten,
acil serviste gösterilen tek fotoğraftır; o fotoğraf üç yıl önceki Barış'tır ve bugünkü Barış'tan çok bugünkü Tolga'ya
benzer.

## 3. Yapı ve node haritası

```
PR_00 Soğuk açılış (23.42, isimsiz sesler) → PR_01 Acil servis 00.40 + sabah gözaltısı (isimsiz polis)
BR_00 Bölüm 1 · Derya büroda (yağmurlu akşam; zarf: ücret / söz / dürüstlük) → BR_01 Leyla, ceza aralığı
BR_01B Dosyanın kâğıtları → BR_02 Dosya + strateji → INV_SABAH Sırmakeş merdivenleri, sabah
INV_HUB Bölüm 2 · SORUŞTURMA (3 gün × 4 EP; Leyla'ya danış günde bir, 0 EP; push/$return)
  Olay yeri: INV_ARAMA (merdiven fotoğrafları) · INV_ARAMA2 (Kılınçların evi, Derya ve Sevim'le) · INV_ARAMA3 (acil servis koridoru)
  Cezaevi:   INV_GORUSME (zincir giriş INV_GORUSME_G_1; konu × ton; fakta bağlı konular: Kulak, Fotoğraf, Balkon)
  Tanıklar:  INV_T_ALI (bakkal) · INV_T_KADIR (balkon ipucuyla açılır) · INV_T_GAMZE (acil ipucuyla) · INV_T_FERHAT (karakol)
             INV_T_NERMIN (kapı; etik tuzağı)
  Arşiv:     INV_TESHIS (teşhis tutanağı, belge) · INV_112 (çağrı dökümü, belge) · INV_UEDAS (kesinti kaydı, teslimle gelir)
             INV_DIL (delil talepleri) · INV_CIKARIM (6 tarif + çeldiriciler) · INV_LEYLA
  Gün sonu:  INV_DAY_END → INV_AKSAM1 (Leyla) / INV_AKSAM2 (Tolga'nın zarfı) / INV_AKSAM3_1 → INV_GECE_* (duruşmadan önceki gece)
H1_00G_* koridor → H1_00 açılış → H1_01 sanığın savunması (sorular) → H1_02 savcının talebi (HızlıPaket) → H1_03 Nermin (N1–N5)
  ⇄ H1_03K kırılma → H1_04 salonda teşhis isteği (itiraz) → H1_05 ara karar + tutukluluk → H1_06 koridor
ARA_GIRIS_* → ARA_GIRIS (HızlıPaket kayıtları gelir: hesap olay yerinde) → ARA_HUB (3 gün × 3 EP; yığınsız, doğrudan dönüş)
  ARA_GPS (belge) · ARA_TEL (telefon raporu, belge) · ARA_BARIS (yüzleşme; Tolga adı burada ilk kez) · ARA_DERYA (abla'nın sırrı)
  ARA_KEBAP (sahne: kebapçı arka kapısı) · ARA_CIKARIM (tahta 2) · ARA_DIL (ek talep) · ARA_KADIR (tanık hazırlığı; etik tuzağı)
  ARA_KARAR → ARA_BILDIR (savcılık) / ARA_YUZLES (Demirtaş, kaçış) / ARA_NERMIN (etik ihlal) · ARA_ZARF (Tolga'nın zarfı) · ARA_LEYLA
  ARA_DAY_END → ARA_AKSAM_* ; ARA_SON_* → ARA_SON (duruşmadan önceki gece)
T_00G_* koridor → T_00 açılış → T_01 HızlıPaket kayıtlarının tartışılması (itiraz) → T_02 Ferhat (F1–F5) → T_03 Kadir (sorular)
  → T_03X savcının karşı sorusu (itiraz) → T_04 Gamze → T_05 mütalaa (koşullu) → T_06P dayanaklar (3) → T_06 esas savunma
  → T_07 son söz → T_08 hüküm (DECISION) → R_KARAR + epilog ; T_INT_COKUS (♥0) → T_08
```

Celseler: `cs_1` (1. celse: açılış, sanık savunması, tanık, ara karar), `cs_2` (2. celse: delil tartışması, tanıklar,
mütalaa, savunma, son söz, karar).

## 4. Sahne sahne

> Sözcük sayıları hedeftir (±%20). Örnek satırlar tonu tarif eder; içerikte aynen ya da yakın biçimde kullanıldı.

### PR_00 — Soğuk açılış · "GECE 23.42" (~550) · bg: sokak_karanlik
- `card`: "18 OCAK · GECE 23.42 — TOPHANE, SIRMAKEŞ MERDİVENLERİ".
- narrator: "Sırmakeş merdivenleri altmış dört basamaktır. Gündüz turistler sayar. Gece kimse saymaz; inen iner, çıkan çıkar."
- Bir kadın basamakları iniyor; elinde çanta, ağzında bir türkü mırıltısı. Aşağıda bir motor rölantide; sarı bir kutu.
- Koşan adımlar (`fx: shake`). "KAPÜŞONLU" yalnızca "Bırak!" der. Bir şey parlar: "Belki bir bıçak. Belki bir küpe.
  Belki yalnızca yağmurun bir sokak lambasında kırılışı."
- Düşüş, cam kırığı, avuçta sıcaklık. Motor uzaklaşır.
- Bakkalın camı; `phone` "112 ACİL": "Çantamı aldılar… kurye gibiydi… kulağında bir şey parladı…" (ad yok; yalnızca
  "KADIN").
- `fx: fade`.

### PR_01 — "ACİL 00.40" + "SABAH 08.10" (~550) · bg: hastane → sokak_sabah
- Acil servis koridoru; monitör bipi; dikiş. "BİR POLİS" ıslak montla gelir, telefon ekranını uzatır: "Bu mu teyze?
  Kaydı var. Bıçakla yakalanmıştı." Kadın: "Bilmiyorum… galiba… evet, o."
- Hemşire bir forma bir şey yazar (narrator: "Kimse ne yazdığını sormadı.").
- `card`: "19 OCAK · SABAH 08.10 — YILDIRIM". Ateşli bir genç kapıda gözaltına alınır; annesi "Evdeydi, ateşi var!"
  diye bağırır; kimse yazmaz. Telefonu bir poşete girer.
- narrator: "İki gün sonra tutuklandı. İki ay sonra iddianame. Bir celse kala, ablası bir avukat aradı."

### BR_00 — Bölüm 1 · DOSYA · "Derya" (~900) · bg: buro_gece
- `card`: "CUMA 21.15 — ARSLAN HUKUK, BURSA". Deniz (thought): "Bursa'da gece yarısından sonra iki şey açık kalır:
  fırınlar ve kötü haberler."
- Derya sırılsıklam girer, sigarasını kapıda söndürür. Masaya bir salon defteri, bir zarf ve Barış'ın kurye kimlik kartını
  koyar. "Kardeşim kimseyi soymaz. Kendi motorunu bile yıkatamayacak kadar tembeldir."
- Kardeşinin eski dosyasını kendisi söyler (dürüstlük): "Bir düğünde yumruk attı. Üç yıl önce. Polisin elinde fotoğrafı
  var, bütün mesele bu."
- Zarf: salonun kira birikimi. Seçim (puansız, ilişki etkisi):
  - "Ücreti sonra konuşuruz." → `trust` artar; Derya bir not verir: "Barış'a: Annem iyi. Sen dayan."
  - "Önce ücret ve vekâletname." → nötr.
  - "Söz veremem, ama dosyanın her sayfasını okuyacağım." → dürüstlük (deniz_durust).
- Derya kapıda bir an durur: "Bir şey daha… yok. Boş ver." (Sakladığı şey ara evresinde açılır.)

### BR_01 — Leyla dosyayı devreder (~600) · bg: buro_gece
- Leyla: "Ağlayan bir ablaya değil, okunmamış bir dosyaya söz ver." Ceza aralığı sorusu (A–D): 149/1-a, h → 10–15 yıl
  (doğru); 148/1 → 6–10; 142/2-a kapkaç → 5–10; "149/1 + 143 artırımı" (yanlış: 143 hırsızlığa özgüdür).
- Doğru cevapta: "İki nitelikli hâl var. Hâkim alt sınırdan başlamayabilir. Yirmi iki yaşında bir çocuk için on iki yıl
  demek bu."
- Ters çerçeve: "Hiç sormadım."

### BR_01B — "Dosyanın kâğıtları" (~350) · bg: buro_gece
- Leyla altı kâğıdı tek tek bırakır: iddianame, mağdur ifadesi, teşhis tutanağı, olay yeri fotoğrafları, gözaltı tutanağı,
  "bir de kimsenin okumadığı bir ihbar formu". Deniz: "Kimsenin okumadığı kâğıt, okunmayı bekleyen kâğıttır."

### BR_02 — Dosya ekranı + strateji (~250)
- Masumiyet → "Cesur. Bir kadının yüzünü hatırladığından emin olduğu bir dosyada masumiyet, onun hafızasıyla kavga
  etmek demek. Kavga etme. Anla."
- Usul → "Teşhis bir usuldür. Usulü yanlış yapılmış teşhis, yapılmamış teşhistir."
- Terditli → "Güvenli. Ama müvekkiline 'en kötü ihtimalle on yıl' demeye hazır mısın?"

### INV_SABAH — Sırmakeş merdivenleri, sabah (~300) · bg: sokak_sabah
- Deniz merdivenleri sayar: altmış dört. Turist bir çift fotoğraf çeker. Bakkal Ali Rıza dükkânın önünü süpürür,
  Deniz'e bakar: "Avukat mısın gazeteci mi? İkisi de soru sorar, biri para ister." Hedef kutusu.

### Bölüm 2 · SORUŞTURMA (~5.000)

**INV_HUB** — 3 gün × 4 EP. Hedefler: gün 1 "Teşhisin nasıl yapıldığını ve mağdurun ilk ne dediğini bul." gün 2 "Barış o
saatte neredeydi? Kim gördü, ne kanıtlar?" gün 3 "Dilekçe ve tahta: duruşmada neyi soracaksın?" Hızlı konuşma: Barış'ın
"Ben o gece yataktan kalkamadım abla. Ateşim kırkı buldu."

**INV_GORUSME — Cezaevi görüş odası (~1.600) · bg: gorus_odasi**
- Giriş zinciri: Sevim kapıda temiz çamaşırla bekler ("Gece ateşi vardı, ben bezle sildim alnını"). Hasan kapıyı açar.
- Konular (2 dk): O gece · Ateş · Eski dosya (2023 fotoğrafı) · Motor ve hesap (yalan söylemez ama eksik söyler:
  "Motor aşağıdaydı, hep orada durur.") · Derya · Fotoğraf (clue_eski_foto ile; "O fotoğraf mı? Saçlarım kazınmıştı,
  askerden yeni gelmiştim.") · Kulak (clue_halka ile: "Kulağımı hiç deldirmedim abla, bak." → clue_kulak) · Balkon
  (Kadir'in ipucuyla: "Elektrik gitti… Usta'yla konuştum galiba. Ateşten hatırlamıyorum." )
- Sert ton daha çok bilgi verir ama güveni düşürür; güven 40'ın altında Barış "boş ver abla" der, konular kısalır.

**INV_ARAMA — Merdiven fotoğrafları (19 Ocak 01.10)** — nesneler: kırık şişe camı ve kan (clue_cam), koparılmış çanta
askısı (sol halka; clue_aski), alt başta motor yağı lekesi (clue_motor), eczane kamerası (tutanak: "kayıt alınamadı";
çeldirici), bir kedi (ıska).

**INV_ARAMA2 — Kılınçların evi** — Derya ve Sevim. Nesneler: ilaç kutusu + e-reçete 17.40 (clue_ates), balkon ve üst kattaki
mum izi (clue_balkon → INV_T_KADIR açılır), aile fotoğrafı (iki çocuk bir motorun üstünde: "Barış ve… amcaoğlu. İkiz
sanılırlardı." clue_aile_foto; çeldirici, ara evresinde anlam kazanır), Barış'ın yeni vesikalığı (saçlı, sakallı;
clue_vesikalik), duvar saati (ıska).

**INV_ARAMA3 — Acil servis koridoru (kamuya açık alan)** — nesneler: triyaj panosu (geliş 00.21; clue_triyaj), "polis
bekleme" bankı (ıska), hemşire masasındaki nöbet çizelgesi (Gamze Ateş adı → INV_T_GAMZE açılır; clue_gamze), güvenlik
kamerası ("30 gün saklanır" levhası; çeldirici).

**INV_T_ALI — Bakkal (~500)** — 112'yi onun telefonundan aradılar. "Kulağında halka vardı diyordu, iki kere dedi. Bıçak
mıçak demedi, ben duymadım." (clue_ali_halka). Etik: Ali Rıza "İstersen mahkemede bıçak yoktu derim" der; Deniz "Ne
duyduysan onu" demelidir.

**INV_T_KADIR — Üst kat (~650)** — terzi atölyesi bozması salon, mum kokusu. "Elektrik gitti, balkona çıktım. Aşağıda
Barış öksürüyordu. 'Usta sizde de mi gitti' dedi." Saati bilmez: "Saate bakmadım, karanlıktı." Gözlerini sorarsan:
katarakt. Seçim: tanık bildir / yazılı beyan yeter / "elektrik 23.40'ta gitti deseniz?" (etik ihlal: tanığa saat
söyletmek, TCK 277'ye yakın; ethics +1).

**INV_T_GAMZE — Acil servis (~500)** — "Formu ben yazdım. Polis telefonundan bir fotoğraf gösterdi, kadın ağladı. Yazmak
zorundayım; hasta durumunu değiştiren her şeyi yazarız." Korkar; seçim: "Mahkemeye tanık olarak bildireceğim" / "Formu
mahkemeden isteyeceğim, size yük olmasın". İkisi de meşru; ilki daha güçlü ama Gamze'nin güvenini sınar.

**INV_T_FERHAT — Karakol önü (~500)** — sigara, rakamlar. "İki ayda dört gasp. Kurye listesini taradım, kaydı olan bir tek
o. Prosedür." Bastırırsan: "Teyze acıdan kıvranıyordu, ben de bir baktırdım, ne var?" (clue_ferhat_itiraf: kendi ağzından,
ama tanık değil; duruşmada F2'yi bastırmayı açar.) Uyarı: Ferhat'a "telefonunu ver" demek, ya da tehdit (−).

**INV_T_NERMIN — Mağdurun kapısı (~400)** — Kapıyı açmaz, zinciri takılı: "Avukat kızım, ben anlattım. Bir daha
anlatmam." Seçim: kartını bırakıp gitmek (doğru) / "Size gösterilen fotoğrafı soracağım, beş dakika" diye ısrar (etik:
mağdur üzerinde baskı; Nermin savcılığa şikâyet eder, 1. celsede başkan uyarır, ♥−1, ethics +1).

**INV_TESHIS — Teşhis tutanağı (belge)** — satırlar: tarif beyanı (saat 10.20), Foto 1–6 (yaş, renk, boyut), tekrar,
hatırlatma, kayıt. Aletler: büyüteç, karşılaştır, mevzuat (check), kamera. İsabetler: Foto 3 karşılaştır → farklı boyut
ve renk (clue_foto_farkli); tarif satırı büyüteç → teşhisten sonra yazılmış (clue_tarif_sonra); tekrar satırı mevzuat →
bir kez, hatırlatma yok (clue_tek_tekrar); diğerleri yaş büyüteç → 38–52 (aynı ipucunun ayrıntısı). Yanlış alet −20.

**INV_112 — İhbar formu ve çağrı dökümü (belge)** — satırlar saat damgalı. Aletler: büyüteç, karşılaştır (kolluk
ifadesiyle), dinle (phone). İsabetler: "kulağında halka" dinle → "sol kulağında" (clue_halka); "itti, düştüm" karşılaştır →
kolluk ifadesindeki bıçak 112'de yok (clue_bicak_yok); "sarı kutu" büyüteç → kurye (clue_kutu; çeldirici). Leyla'nın
"okumadığın her sayfa" yankısı.

**INV_UEDAS — Kesinti kaydı (belge, teslimle)** — UEDAŞ'tan dilekçeyle istenirse ertesi gün gelir. Satır: "Mimar Sinan
Mah., 23.36–23.51, trafo arızası" → karşılaştır (clue_kesinti).

**INV_DIL — Delil talepleri (3 hak)** — UEDAŞ kesinti kaydı (gün sonunda gelir) · hemşire gözlem formu (gün sonunda gelir:
ev_gozlem) · hastane kamerası (ret: 30 gün) · olay yerinde keşif (gereksiz) · mağdura yeniden teşhis (ret ve uyarı:
kirlenmiş hafıza yeniden teşhisle temizlenmez).

**INV_CIKARIM — Tahta** — tarifler: kirlenme (gözlem formu/Gamze + foto farkı), usulsüz teşhis (tarif sonra + tek
tekrar), halka (112 halka + Barış'ın kulağı), bıçak (112'de bıçak yok + cam kırığı), mazeret (Kadir + kesinti), eski
fotoğraf (2023 karesi + yeni vesikalık). Çeldiriciler: ateş + kutu, aile fotoğrafı + askı, motor + kutu… (−50).

**Gün sonları** — INV_AKSAM1: Leyla'yla kısa sahne; "Bugün kime inandın?" (iç sese yansır). INV_AKSAM2: Büronun kapısında
bereli, ıslak bir genç: Tolga. "Barış'ın amcaoğluyum. Ablaya söylemeyin. Ücrete katkı." Zarf. Seçim: al / alma / "Derya
Hanım'la birlikte konuşalım". (Beresi kulaklarına kadar iner; Deniz yalnızca "elleri titriyordu, soğuktan mı bilmem"
der.) INV_AKSAM3: Derya arar; annesi Barış'ın yorganını yıkamış.

**INV_GECE — Duruşmadan önceki gece (~450)** — koşullu hafıza zinciri (bulunan her önemli ipucu bir satır); Leyla:
"Yarın o kadın kürsüde ağlarsa, sakın onu yenmeye çalışma. Onun hafızasını, onu yaralamadan göster."

### Bölüm 3 · BİRİNCİ CELSE (~2.800) · bg: durusma_salonu
- Koridor zinciri: Sevim ve Derya; Tolga gelmemiştir ("işi varmış"). Nermin kızının koluna girmiş, Barış'a bakmaz.
- H1_00 açılış: mübaşir Şükrü; başkan Rahmi Yazıcı; savcı Orhan Bayar iddianameyi özetler.
- H1_01 sanığın savunması: Deniz'in Barış'a soracağı sorular (ateş, balkon, eski fotoğraf, kulak); kötü soru: "Olay
  saatinde ne yaptığınızı hatırlıyor musunuz, emin misiniz?" (telkin değil ama zarar).
- H1_02 savcının talebi: HızlıPaket hesap ve konum kayıtları + telefon incelemesi. Seçenekler: katılmak + "giriş cihazı
  ve kimlik doğrulama fotoğrafları da istensin" (en iyi; selfie_istendi) / yalnız katılmak / karşı çıkmak (delilden
  korkuyormuş gibi görünür, −).
- H1_03 Nermin'in tanıklığı (N1–N5). Kırılma: 112 dökümü N5'e sunulunca:
  > NERMİN: "Halka mı? Ben… öyle mi demişim? Ben o gece… bir şey parladı. Ben onu bıçak sandım. Sonra… sonra o fotoğrafı
  > gösterdiler."
  Salon susar; başkan bir süre yazdırmaz. Nermin ağlamaz; yorgun bir sesle: "Ben yalan söylemem evladım."
- H1_04 salonda teşhis: savcı "Şu an salonda o kişiyi görüyor musunuz?" der. İtiraz: sanık sandalyesindeki tek gence
  bakarak teşhis telkinlidir; doğru seçim.
- H1_05 ara karar + tutukluluk: talepler; kirlenme ya da halka çelişkisi kurulduysa adli kontrolle tahliye.
- H1_06 koridor: (tahliye) Barış annesine sarılır; (tutukluluk) ring aracının camı.

### Bölüm 4 · ARA (ARA_HUB, 3 gün × 3 EP; ~3.300)
- **ARA_GIRIS — ters köşe:** HızlıPaket kayıtları gelir. Leyla CD'yi masaya bırakır: "Müvekkilinin hesabı, olay saatinde,
  o merdivenin dibinde." Deniz (thought): "Bir an, yalnızca bir an, kendi müvekkilimden şüphelendim. Sonra o an geçmedi."
- **ARA_GPS (belge):** satırlar 22.58 özçekim/oturum · 23.31 alım · 23.41 durak · 23.55 teslim · 00.20 çıkış · cihaz.
  İsabetler: özçekim → kamera (clue_selfie: bereli, sol kulağında halka) — yalnızca H1'de istendiyse ya da ARA_DIL ile
  istenince görünür; cihaz satırı → karşılaştır (clue_cihaz: Redmi …7741, Barış'ın kayıtlı cihazı Samsung …2210);
  23.41 → büyüteç (clue_durak).
- **ARA_TEL (belge, telefon inceleme raporu):** 22.31 mesajı (clue_mesaj), 23.39–23.44 ev modemi (clue_modem), 00.38
  mesajı (anahtar).
- **ARA_BARIS — yüzleşme (~700):** GPS dökümünü sunarsan Barış önce susar, sonra: "Tolga'ydı. Hesabımı ona veriyorum…
  ehliyeti yok. Ama o yapmaz abla. O benim kardeşim." (Tolga adı ilk kez burada, kanıtla.) Seçim: "Doğruyu mahkemeye
  sen söyleyeceksin" / "Şimdilik kimseye söyleme" (−; etik değil ama savunmayı zayıflatır).
- **ARA_DERYA (~600):** salonda, aynalar arasında. Derya'nın sırrı: şafakta ıslak Tolga, yırtık kol, paspas. "Sustum. Bir
  aileyi kurtarmak için diğerini batırmak istemedim." Deniz yönlendirmez; "Bunu savcıya sen anlatabilirsin" der.
- **ARA_KEBAP (sahne):** Tophane Kebap Salonu arka kapısı; sipariş fişi (23.31, "Barış K."; clue_siparis), kuryelerin
  ayna köşesi (çeldirici), Cemal Usta'nın tezgâhı (clue_cemal: "bereliydi, kulağında halka"), kamera (30 gün; çeldirici),
  bahis kuponları panosu (clue_bahis: "Tolga'ya adamlar geldi").
- **ARA_CIKARIM:** başkası (özçekim halkası + 112 halkası), hesap (cihaz + mesaj), evde (modem + mazeret) + INV tarifleri.
- **ARA_KADIR — tanık hazırlığı:** Kadir Usta korkuyor. "Ne hatırlıyorsanız onu anlatın" (doğru) / "Saati 23.40 diye
  söyleyin, kayıt da öyle" (etik ihlal; savcı 2. celsede bunu tanığın ağzından çıkarır).
- **ARA_KARAR — ne yapacaksın?** Savcılığa yazılı bildirim (suç duyurusu + HızlıPaket cihaz kaydı + usulüne uygun teşhis
  talebi) → ARA_BILDIR (savcı Orhan, ağır: "Şüpheliyi ben bulurum, siz müvekkilinizi savunun.") · Tolga'yla kendin
  yüzleş → ARA_YUZLES (Demirtaş, gece; Tolga kaçar; Leyla'nın soğuk dersi) · Nermin Hanım'a özçekimi göster →
  ARA_NERMIN (etik ihlal: mağdura tek fotoğraf göstermek, aynı kirliliği tekrarlamak; etik sonu) · Şimdilik bekle.
- **ARA_ZARF:** Tolga'nın zarfı alındıysa: iade + müvekkile açıklama (doğru) / sus (ethics +1).
- **ARA_SON — duruşmadan önceki gece:** (bildirim + Derya) Derya arar: "Tolga'yı savcılığa ben götürdüm. Saati de
  verdi. Kadının saatini." (Yalnızca B yolunda.) Diğer yollarda: Tolga'nın telefonu kapalı.

### Bölüm 5 · İKİNCİ CELSE (~3.000)
- T_00 açılış: `card` "ÜÇ HAFTA SONRA — 2. CELSE". (B yolu) savcı: "Dosyaya ilişkin yeni bir gelişme var."
- T_01 HızlıPaket kayıtlarının tartışılması: savcı konumu okur. Doğru cevap: "Kayıt hesabın yerini gösterir, kişinin
  değil; giriş cihazı müvekkilin değil, özçekimdeki kişinin kulağında halka var" (ded_baskasi/ded_hesap gerekir).
- T_02 Ferhat'ın tanıklığı (F1–F5): F1 "Teşhisi usulüne uygun yaptırdım", F2 "Hastanede kimseye fotoğraf göstermedim",
  F3 "Altı fotoğraf birbirine benziyordu", F4 "Mağdur tereddütsüz seçti", F5 "Kuryeler arasında tarife uyan tek kişi
  sanıktı". Kırılma (gözlem formu F2'ye): "Teyze acı içindeydi… bir baktırdım. Prosedür değildi. Biliyorum."
- T_03 Kadir Usta (sorular): balkon, elektrik, ses. T_03X savcının karşı sorusu: "Karanlıkta, kataraktla, iki kuzeni
  ayırabilir misiniz?" Seçenekler: itiraz etmek (dayanaksız; soru meşru) / tanığa güvenmek (Kadir: "Tolga'yı bilmem;
  ama o balkon Barış'ın balkonu. O öksürük Barış'ın öksürüğü.") / soruya karşı kesinti kaydını hatırlatmak (CMK 215).
- T_04 Gamze (istendiyse): kısa, düz.
- T_05 mütalaa: (Tolga teslim) savcı 223/2-b beraat ve Tolga hakkında ayrı soruşturma; (değilse) mahkûmiyet ya da
  "takdir".
- T_06P dayanaklar (3 hak): kirlenme, halka, mazeret, hesap, bıçak, eski fotoğraf; kanıtlanmamış dayanak −40.
- T_06 esas savunma: masumiyet (teşhis + mazeret + başkası) / usul (teşhis hükme esas alınamaz) / terditli (silah unsuru
  düşsün, alt sınır, 62) / sahte bir "itiraf" yok — bu davada etik tuzak mağdur ve tanıklarla ilgilidir.
- T_07 son söz: Barış'ın cümlesi tam sahne ("Ben o kadının saatini almadım. Ama kim aldıysa… ona da söyleyin, kadının
  saatini versin.").
- T_08 → R_KARAR → epilog.

## 5. Ters köşeler ve ekilen ipuçları

| Ters köşe | Ekilen ipuçları (en az iki, önceden) |
|---|---|
| Teşhis tek fotoğrafla kirlendi | Soğuk açılıştaki acil sahnesi (isimsiz); hemşire masasındaki çizelge (Gamze); teşhis tutanağında farklı boyutlu renkli fotoğraf; Ferhat'ın "bir baktırdım"ı |
| "Bıçak" bir parıltıydı | Soğuk açılış: "Belki bir bıçak, belki bir küpe"; 112'de bıçak yok; basamaktaki kırık şişe camı; Ferhat'ın "bıçakla yakalanmıştı" yalanı (2023 dosyası yumruk) |
| Fail halkalı biri | 112 "kulağında halka"; Ali Rıza'nın tanıklığı; Barış'ın delinmemiş kulağı |
| Hesabı başkası kullandı | Barış'ın "motor hep aşağıda durur" eksik cevabı; HızlıPaket kaydında farklı cihaz |
| Kuzen Tolga | Aile fotoğrafı ("ikiz sanılırlardı"); 2. gün akşamı bereli, ıslak genç ve zarfı; Derya'nın "bir şey daha… yok"; 2023 fotoğrafının bugünkü Barış'a benzememesi |

## 6. Epiloglar (OutcomeDef.epilogue; her biri ~250–400 sözcük)

- **BERAAT_B (223/2-b):** Barış adliye merdivenlerinde; yağmur dinmiş. Nermin koridorda bekler; elinde
  İsmail'in köstekli saati (Tolga'nın odasından çıktı). Barış'a yaklaşır: "Evladım… ben seni…" Barış: "Biliyorum teyze.
  Siz yalan söylemediniz." Leyla: "Bugün kimseyi yenmedin. İyi." Son kart: "Tolga Kılınç hakkında yağma suçundan dava
  açıldı. Mağdur, usulüne uygun teşhiste kimseyi göstermedi; delil yüz değil, kayıttı."
- **BERAAT_E (223/2-e):** Beraat, ama Tolga'nın telefonu kapalı; koridorda "şüpheden yararlandı" fısıltısı. Nermin, Deniz'e
  bakmadan geçer: "Saatimi kim aldı o zaman?" thought: "Bir yüzü sildik. Yerine bir soru bıraktık."
- **İNDİRİM:** Silah unsuru düştü; 8 yıl 4 ay. Ring aracının arka camı; Derya'nın sigarası yanmadan biter. thought: "Bıçak
  yoktu. Bunu kanıtladım. Bıçağın olmadığı bir hapishanede sekiz yıl."
- **MAHKÛMİYET:** 10 yıl. Sevim'in tespihi koptu; taneler koridorda yuvarlanır; Deniz eğilip toplar. (Çöküşte) savcı:
  "Hafızayla değil, kâğıtla gelmeliydiniz avukat hanım."
- **ETİK (mağdura fotoğraf):** Nermin kürsüde: "Avukat hanım evime geldi, bir fotoğraf daha gösterdi. Artık hangi yüzü
  gördüğümü bilmiyorum." Leyla, Deniz'in masasına meslek kuralları kitapçığını bırakır. Barış'ın son bakışı.

## 7. Mekanik bağlar (yazım kontrol listesi)

- Sonuç koşulları `docs/content/gece-yarisi-gaspi.md` §6'da; epiloglar bayraklara göre ayrıntı ekler (`released`,
  `tolga_teslim`, `tolga_kacti`, `kadir_tanik`).
- Etik bayrakları: `nermin_baski` (kapı ısrarı), `kadir_kocluk` (saat ezberletme), `zarf_tuttu` (Tolga'nın zarfı),
  `etik_kirlik` (mağdura özçekim; etik sonu). Hepsi `ethics` sayacını artırır; yalnızca sonuncusu sonu zorlar.
- Golden path'ler: G1 BERAAT_B, G2 = TIPIK BERAAT_E, G3 İNDİRİM, G4 MAHKÛMİYET, G5 ETİK, W çöküş.
