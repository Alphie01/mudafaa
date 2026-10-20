# Dava #02 — Çevrimiçi Tuzak · Hikâye Kitabı (noir)

> Bu belge davanın **anlatı kaynağıdır**: ton, kadro, gerçek ve kronoloji, yapı, sahne sahne vuruşlar ve sonuç başına
> epiloglar. Deliller, çelişkiler, sonuç koşulları ve puanlar `docs/content/cevrimici-tuzak.md`'de; hukuki çerçeve
> `docs/legal/cevrimici-tuzak.md`'dedir. Çıta Dava #07 v2'dir (`docs/content/gece-bekcisinin-sirri-hikaye.md`).
> Kaynak: `content/src/cevrimici-tuzak/` (yazım kiti + satır DSL'i `dsl.ts`).

## 0. Ton ve kurallar

- **Noir dram, dijital çağda.** Bursa, ekim sonu–kasım; yağmur hiç tam dinmiyor. Florasanlı GSM bayileri, iş merkezlerinin
  boş koridorları, asansörde kayıtlı bir kadın sesi ("Dördüncü kat"), telefon ekranının mavi ışığı. Her sahnede bir
  duyusal ayrıntı: ıslak şemsiye, limon kolonyası, ATM'nin bip sesi, dikiş makinesinin tıkırtısı.
- **İç ses.** Deniz `style: "thought"` ile birinci tekil, kısa ve kuru konuşur. Gözlemler, sezer, **hiçbir zaman çözümü
  söylemez.** Örnek: *"Eskiden dolandırıcı kapıyı çalardı. Şimdi bildirim gönderiyor."*
- **Hukuk konuşmada değil, sonuçta.** Madde numaraları yalnızca Leyla'nın kısa açıklamalarında, seçenek geri
  bildiriminde, rapor ipuçlarında, hüküm metninde ve resmî duruşma dilinde geçer. Ece, Sevim, Onur, Arda gündelik dille konuşur.
- **Gizem korunur — iki katmanlı.**
  1. *İlk katman (oyuncunun soruşturmada kazandığı ters köşe):* "İş ilanı" bir tuzaktı; işveren "Kaan Bey" ile sahte araç
     satıcısı aynı hattır. Bu bağ, oyuncu iki belgeyi tahtada birleştirmeden **hiçbir satırda söylenmez.**
  2. *İkinci katman (davanın gerçek ters köşesi):* "Kaan", OM İş Merkezi'nin yardımsever işletme müdürü **Necdet Sarı**'dır.
     Bu, ancak İMEİ raporu + kartvizit birleşince (ya da duruşmada sunulunca) açıklanır. Ondan önce Necdet'e dair yalnızca
     *zararsız görünen* ayrıntılar ekilir (limon kolonyası, bir "ARŞİV" levhası izi, yönetim park yeri). Yüzüğün biçimi
     (eski, yassı, mühür) ve kürsüye vuruşu ancak 2. celsede (Arda, Onur, T_03) görünür; Ece ARA'da yalnızca "bir yüzük parladı" der.
     Takma ad "Kaan" ile gerçek ad arasında ses benzerliği **yoktur** (bilerek seçildi).
- **Soğuk açılışta** sesler isimsizdir: `speaker: "narrator"` + `name: "SATICI"`, `"KAPÜŞONLU"`; karakter kimliği kullanılmaz.
- **Satır kuralları:** satır ≤ 220 karakter; yeni mekân `style: "card"` + `bg` ile açılır ("22 EKİM · 21.10 — ARSLAN HUKUK,
  BURSA"); sert anlarda `fx: shake / flash / fade`.
- **Etik çizgi:** tanığa baskı yok, telkin yok; şüpheli kovalanmaz, savcılığa bildirilir; müvekkile yalan tavsiye edilmez;
  hukuka aykırı yoldan kayıt alınmaz. Bu çizgiyi aşan seçimler oyunda vardır ve bedeli ağırdır.
- **Sözcük bütçesi:** tipik yol (BERAAT_E) `case:duration` ölçüsüyle ~14–16 bin sözcük; ≥ 200 aksiyon; 90–120 dk.

## 1. Logline ve tema

- **Logline:** İş arayan yirmi üç yaşında bir üniversite mezunu, banka hesabından bir emeklinin kaporası geçip
  kaybolduğu için "nitelikli dolandırıcılık"la yargılanıyor. Hesap onun; para onun hesabına geldi, onun hesabından çıktı.
  Deniz, hesabın o gün **kimin elinde** olduğunu bulmak zorunda — ve müvekkilinin kendisinden bile sakladığı bir kodu.
- **Tema:** *Güven, en kolay çalınan kimliktir.* Dolandırıcılar Ece'nin şifresini değil umudunu çaldı. Dramatik soru:
  "Kandırılmış olmak suç mu?" — ve onun ikizi: "Utanç yüzünden söylenmeyen gerçek, yalan mı?"
- **Ana mekânlar:** Arslan Hukuk (büro, gece), Yalınların evi (Yıldırım, yokuş), OM İş Merkezi (Osmangazi; 4. kat koridoru,
  otopark), Mavi İletişim (Kent Meydanı GSM bayisi), Emniyet Siber Şube, operatör mağazası, Bursa 7. Asliye Ceza Mahkemesi.

## 2. Kadro: sesler, sırlar, yaylar

| Kimlik | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **deniz** (oyuncu) | Av. Deniz Arslan, 31; büroda üçüncü yıl. | Kuru iç ses; dışarıda nazik ama inatçı. Teknolojiye Leyla'dan iyi, kendinden az güvenir. | İlk yılında bir "hesap kiralama" dosyasında müvekkilini "bari yardım etmeden ceza alsın" diye ikna etmişti; sonradan o çocuğun da kandırıldığını öğrendi. | Kolay pazarlıktan gerçeğe. "Terditli savunma" bir araçtır, kaçış değil. |
| **leyla** (mentor) | Av. Leyla Erdem, 58; büronun kurucusu. | Az ve kesin. Hâlâ çek defteri kullanır, akıllı telefonu yoktur: "Benim telefonumu kopyalamaya kalkan, tuşlarını bulamaz." | Masasındaki ters çerçeve (dizi tohumu; yalnızca ima). | Deniz'i izler, kurtarmaz. Etikte sert, teknolojide meraklı. |
| **ece** (müvekkil, sanık) | Ece Yalın, 23; İşletme mezunu, sekiz aydır işsiz. Tutuksuz; yurt dışı çıkış yasağı. | Hızlı, özür dileyerek konuşur; "yani", "şey", iş başvurusu jargonu ("esnek saat", "uzaktan", "motivasyon mektubu"). Sık sık "ben aptal değilim" der. | **Kodu okudu.** 3 Kasım'da "SGK işe giriş kodu" sanıp bankanın cihaz tanımlama kodunu "Kaan Bey"e telefonda okudu; utancından polise "kimseyle kod paylaşmadım" dedi. Kodu bir sarı nota yazmıştı. Her şeyin ekran görüntüsünü alır: 143 satırlık bir iş başvuru tablosu tutar. | Utanç → sahiplenme. Duruşmada "Kodu ben okudum; ne okuduğumu bilmiyordum" diyebilmesi yayın doruğudur. |
| **sevim** (anne) | Sevim Yalın, 49; Demirtaş'ta bir konfeksiyon atölyesinde dikişçi. | Dikiş benzetmeleriyle konuşur ("İpin ucunu kaçırırsan bütün dikiş söker"); pratik, gururlu, avukatlara güvensiz. Plastik bir dosyada her kâğıdı saklar; hiçbir kutuyu atmaz. | Ece'ye "devlet kapısı bekleme, ne iş bulursan gir" diyen kendisidir; suçluluk duyar. Ece'nin eski sevgilisi Burak'tan şüphelenir. | Suçlamadan kabullenmeye; Burak'tan özür diler. |
| **nurettin** (katılan) | Nurettin Aksoy, 64; emekli Türkçe öğretmeni. | Dilbilgisi düzeltir, noktalı virgülle konuşur gibi; öfkesini nezaketle kılıflar. "Kızım" der, sonra pişman olur. | 75.000 TL kapora; diyalize giden eşini taşımak için eski bir araba almak istiyordu. Şikâyet dilekçesini bir ödev gibi titizlikle yazmış: telefondaki "satıcının" arkasından gelen "Dördüncü kat" anonsunu bile not etmiş. | Ece'ye öfke → onun da bir kurban olduğunu görme. BERAAT_B epiloğunda Ece'nin elini sıkar. |
| **gokhan** | Kom. Yrd. Gökhan Ateş, 38; Emniyet Siber Suçlarla Mücadele. | Jargonlu, yorgun: "log", "IP", "MASAK", "bende dört yüz dosya var". Dürüst. | Bankadan yalnızca hesap özetini almış; cihaz kayıtlarını ve SIM değişikliği geçmişini hiç istememiş. | Rakipten profesyonele: kürsüde eksiğini kabul eder; arada "bu bir zincir" der. |
| **onur** | Onur Demirci, 26; Mavi İletişim bayisinde satış danışmanı. | Hızlı, argo ("abla", "kanka", "sistem öyle"), savunmacı; korkunca sesi incelir. | 4 Kasım'da sahte vekâletname ve kimlik fotokopisiyle SIM değiştirdi; masaya bırakılan bin lirayı aldı. İşini ve kendi dosyasını kaybetmekten korkar. | Yalan → itiraf. Kürsüde "takım elbiseli, kolonya kokan, eski mühür yüzüklü" adamı tarif eder. |
| **arda** | Arda Kılıç, 19; motorlu kurye. | Kısa, çekingen, "abi/abla"; telefonu elinden bırakmaz. | "Kurye işi" ilanıyla aynı "Kaan Abi" tarafından işe alındı; kimliğinin fotoğrafını verdi. ATM'den QR kodla para çekti, çekim başına 500 TL aldı; parayı OM İş Merkezi otoparkında yarım inen bir araba camından uzattı. Kimliği hem sanal ofis sözleşmesinde hem sahte vekâletnamede kullanıldı. | Korku → tanıklık. Kendisi de soruşturulabilir; hâkim onu kendini suçlamama hakkıyla uyarır. |
| **necdet** (gerçek fail) | Necdet Sarı, 47; OM İş Merkezi işletme müdürü. | Sıcak, cilalı, satıcı nezaketi: "efendim", "estağfurullah", "biz burada güven satıyoruz". Herkese limon kolonyası ikram eder. Eski, yassı bir mühür yüzüğü vardır; oyunda ilk kez 2. celsede görünür, INV1_OM'da gösterilmez. | **"Kaan Bey"dir.** Kripto borcu var. Dördüncü kattaki "Yönetim Arşivi" odasını "Nova Dijital"in sanal ofisi diye kâğıt üstünde Arda'nın kimliğiyle kiraya vermiş, İK hattını ve sahte satıcı hattını aynı Samsung telefonda kullanmıştır. 2 Kasım gecesi telefonunun şarjı bitince kendi hattını bu cihaza altı dakikalığına takmıştır: tek hatası. | Yardımsever tanık maskesi → kürsüde çöküş. Deniz'e sözleşmeyi kendi eliyle verir; o sözleşme Arda'yı işaret eder. |
| **burak** (kırmızı ringa) | Burak Toprak, 25; Yıldırım'da telefon tamircisi, Ece'nin eski sevgilisi. | Alaycı, kırgın, teknik: "SIM kart dediğin bir anahtar, bayi de çilingir." | Ayrılıkta "pişman olacaksın" diye mesaj attı; Ece'nin telefon şifresini biliyordu. Eski bir bayi giriş bilgisiyle Ece'nin hat kayıtlarını "çekebileceğini" söyler (etik tuzak). 4 Kasım 10.12'de dükkânındaydı (POS ve kamera). | Şüpheliden yardımcıya; IMEI'nin önemini Deniz'e o öğretir. |
| **hakim** | Hâkim Orhan Bilgiç, 52; Bursa 7. Asliye Ceza (tek hâkim). | Sabırlı, kısa: "Müdafi, buyurun." | — | Delile bakar, gösteriye değil. |
| **savci** | Cumhuriyet Savcısı Tarık Özen, 41. | Keskin, adil, acele: "Hesap sizin, para sizin hesabınıza geldi, sizin hesabınızdan çıktı. Gerisi hikâye." | — | Doğru delil karşısında mütalaasını değiştiren bir rakip. |
| **mubasir** | Mübaşir Şükrü Bey, 60. | Davayı tek nefeste, kafiyeli bir tonla çağırır. | — | — |

## 3. Gerçek ve kronoloji

| Zaman | Olay | Kim biliyor | Oyuncu nasıl öğrenir |
|---|---|---|---|
| Eylül 2025 | Necdet "Nova Dijital İK"yı kurgular: dördüncü kattaki yönetim arşivi odasına "Nova" etiketi, "kurye işi" ilanıyla Arda'nın kimlik fotoğrafı, Arda adına İK hattı 0532 614 41 07. | Necdet | Koridor araması (etiketin altındaki levha), sözleşme, İMEİ raporu |
| 20 Ekim | Ece "Uzaktan Müşteri Temsilcisi" ilanına başvurur. | Ece | Görüşme (İlan), başvuru tablosu |
| 22 Ekim | Kamerası "bozuk" Kaan Bey ile görüntülü mülakat; arkada "Dördüncü kat" anonsu. | Ece | Görüşme → `clue_ding_ece` |
| 24 Ekim | Ece kimliğinin ön-arka fotoğrafını (masa lambasının parlaması ve bordo ojeli başparmağı karede), kimlikli özçekim ve IBAN'ını gönderir. | Ece, Necdet | Oda araması (lamba, oje), bayi belgesi (fotokopide aynı parlama) |
| 1 Kasım 09.14 | "MEHMET DEMİR" hesabından 4.500 TL, açıklama "EĞİTİM AVANSI". | Ece | Hesap hareketleri |
| 3 Kasım 14.26–14.31 | Kaan: "SGK işe giriş için kod gelecek, okur musunuz?" Ece arar, "4471"i okur; sarı nota "4471 — SGK" yazar. 14.29'da mobil şubeye **Samsung Galaxy A54** tanımlanır. | Ece (utanır), Necdet | Ekran görüntüleri, sarı not, banka cihaz kaydı |
| 3 Kasım 21.10 | Kaan: "KVKK gereği yazışmaları silin; yarın kurumsal hatta geçiyoruz, hattınız birkaç saat kesilebilir." Ece siler — ama önce ekran görüntüsü alır. | Ece | Ekran görüntüleri → `clue_kvkk_mesaj` |
| 4 Kasım 10.12 | Mavi İletişim'de SIM değişikliği: "vekil Arda Kılıç", sahte vekâletname (Gemlik 2. Noterliği, yevmiye 18842), Ece'nin fotoğrafından basılmış kimlik fotokopisi. İşlemi Onur yapar, masadaki bin lirayı alır. Gelen: kırk yaşlarında, takım elbiseli, kolonya kokan, mühür yüzüklü bir adam. | Onur, Necdet | Operatör dökümü, bayi belgesi, Onur'un kürsüdeki itirafı |
| 10.13 | Ece'nin iPhone 8'i "SIM yok"; Ece ekran görüntüsü alır. | Ece | Oda araması |
| 11.05 | Ece annesinin telefonundan Kaan'ı arar: "Kurumsal hatta taşıyoruz, akşama düzelir." | Ece, Sevim | Görüşme (Telefon) |
| 13.31 | Nurettin, "sahibinden acil" 2014 Clio ilanı için "satıcı Kaan"ı arar; arkada "Dördüncü kat" anonsu. "Kardeşimin hesabı, Ece Yalın, araba onun üstüne." | Nurettin | Şikâyet dilekçesi |
| 13.40 | Nurettin 75.000 TL'yi Ece'nin IBAN'ına gönderir. | — | Hesap hareketleri |
| 13.52 / 13.58 | 40.000 TL kripto platformu hesabına; 15.000 TL **MEHMET DEMİR**'e (avansı gönderen hesap). | — | Hesap hareketleri (karşılaştır) |
| 14.05 | Kent Meydanı ATM'sinden kartsız (QR) 20.000 TL: kapüşonlu, "HIZLI PAKET" montlu genç (Arda). | Arda | ATM görüntüsü, Arda |
| 14.40–16.00 | Satıcıya ulaşılamaz; Nurettin karakola gider. | Nurettin | Şikâyet |
| 19.20 | Ece Yıldırım'daki operatör mağazasında hattının 10.12'de başka bayide değiştirildiğini öğrenir; yeni SIM alır, "işlemi ben yapmadım" itiraz formunu imzalar. | Ece, operatör | Operatör mağazası (Ece'yle) → `ev_sim_dokum` |
| 5–7 Kasım | Hesaba bloke. Ece Siber'de müdafisiz ifade verir: iş başvurusundan söz eder ama "kimseyle kod paylaşmadım" der. | Ece, Gökhan | `ev_ece_ifade` |
| Şubat 2026 | İddianame: TCK 158/1-f, 37/1 ("hesabını kullandırarak ve işlemleri bizzat yaparak"). Tutuksuz yargılama, yurt dışı çıkış yasağı. | — | Dosya |
| 31 Temmuz 2026 | 7589 sayılı Kanun yürürlükte: TCK 158/4 (iştirak hesap bilgisi vermekle sınırlıysa ceza yarı oranında indirilir); CMK 231 değişikliği. | — | Leyla (brifing) |
| 22 Ekim 2026 | Sevim büroya gelir. 1. celseye 13 gün. | — | Bölüm 1 |
| 4 Kasım 2026 | 1. celse (olaydan tam bir yıl sonra). | — | — |
| 25 Kasım 2026 | 2. celse ve hüküm. | — | — |

**Necdet'in tek hatası:** 2 Kasım 2025 23.48'de kendi hattı **0533 287 19 90** (abone: OM İş Merkezi Yönetim Ltd. Şti.)
aynı Samsung'a (IMEI 35 491207 …) altı dakikalığına takılmıştır. Bu numara Deniz'e verdiği kartvizitte yazılıdır.

## 4. Yapı (bölümler ve node haritası)

```
PROLOG       Soğuk açılış: 4 Kasım 2025 — Nurettin'in kaporası, kapüşonlu genç, susan telefon   STORY
PROLOG_2     Şubat: kapıdaki polis, bir ifade odası, "kimseyle kod paylaşmadım"                  STORY → BR_00
BR_00        Bölüm 1 · Sevim büroda (yağmur; plastik dosya; ücret seçimi)                        STORY
BR_01        Leyla dosyayı devreder: ceza aralığı sorusu (A–D) → 7589 ve 158/4 dersi            STORY
BR_01B       Dosyadaki dört kâğıt (savcılığın delilleri)                                         STORY
BR_02        Dosya ekranı + strateji                                                             STORY → INV1_SABAH
INV1_SABAH   Yıldırım'da sabah: Ece kapıda                                                       STORY → INV1_HUB
INV1_HUB     Bölüm 2 · SORUŞTURMA (3 gün × 4 EP; Leyla'ya danış günde bir, 0 EP; tahta 0 EP)
  EV:        INV1_ECE (görüşme; 2. ziyaret) · INV1_ODA (sahne) · INV1_SEVIM (atölye)
  KAYITLAR:  INV1_HESAP (belge) · INV1_SIKAYET (belge) · INV1_OPERATOR (Ece'yle mağaza) · INV1_DIL (CMK 177) · INV1_CIKARIM
  SAHA:      INV1_OM (Necdet) → INV1_KORIDOR (sahne) · INV1_BAYI (Onur) · INV1_BURAK · INV1_GOKHAN
  Gün sonu:  INV1_DAY_END (DECISION, teslimler) → INV1_AKSAM1 (Nurettin'in telefonu) / INV1_AKSAM2 (Sevim ve tehdit mesajı)
INV1_GECE_*  Duruşmadan önceki gece (koşullu hafıza zinciri) → INV1_GECE
H1_*         Bölüm 3 · BİRİNCİ CELSE: koridor → açılış → katılma (A–D) → sanığın sorgusu (Ece'nin itirafı) →
             savcının sorusu (itiraz) → katılanın beyanı → Gökhan'ın tanıklığı (G1–G5) → talepler → ara karar
ARA_*        Bölüm 4 · ARA (2 gün × 3 EP; yığınsız, doğrudan dönüş)
  ARA_BELGE (bayi belgesi; belge) · ARA_ARDA (büroya gelen kurye) · ARA_OTOPARK (sahne) · ARA_NURETTIN ·
  ARA_GOKHAN · ARA_SUC (suç duyurusu + İMEİ talebi) · ARA_ECE · ARA_BURAK · ARA_LEYLA · ARA_CIKARIM
  ARA_DAY_END → ARA_AKSAM (isimsiz telefon) ; ARA_SON_* → ARA_SON
T_*          Bölüm 5 · İKİNCİ CELSE: açılış (raporlar) → Arda'nın tanıklığı → Onur (O1–O4) → Necdet (N1–N4) →
             savcının "yardım etme" çıkışı (A–D) → mütalaa + cevap → katılanın son sözü → esas savunma → son söz → hüküm
R_KARAR      Karar + sonuca bağlı epilog (OutcomeDef.epilogue)
T_COKUS      Güvenilirlik 0 → çöküş kesintisi
```

## 5. Sahne sahne (tipik yol sözcük bütçeleriyle, ± %20)

### PROLOG — Soğuk açılış · "4 KASIM 2025" (~650) · bg: sokak_yagmur → arac → sokak_karanlik
- `card` "4 KASIM 2025 · 13.31 — NİLÜFER, BİR BANKA ŞUBESİNİN ÖNÜ". Yaşlı bir adam şemsiyesini kapatmadan telefonla konuşur.
- `phone` SATICI (isimsiz, sıcak erkek sesi): "Hocam, kardeşimin hesabı. Araba onun üstüne; Ece Yalın. Kaporayı atın, akşam
  anahtarı teslim edelim." Arkada kısa bir sinyal ve kayıtlı bir kadın sesi: "Dördüncü kat." Adam bunu not eder; öğretmendir.
- 13.40: EFT dekontu titreyen elle katlanır. 14.05: Kent Meydanı'nda bir ATM; KAPÜŞONLU bir genç ekrana telefon tutar, makine
  hışırdar, para. "Abi tamam, çektim." (`phone`). 18.00: boş bir otopark, "Bu numaraya şu anda ulaşılamıyor."
- Aynı akşam, Yıldırım'da bir oda: bir genç kız, ekranında "SIM yok" yazan telefonunu sallıyor; adı söylenmez.
- `fade`. **İsim yalnızca IBAN'daki addır; kimin konuştuğu, kimin çektiği açık kalır.**

### PROLOG_2 — "ŞUBAT 2026" (~350) · bg: sokak_sabah → karakol
- Sabah 07.10, kapıda iki polis: "Ece Yalın siz misiniz?" Sevim'in elinde bir tava.
- Siber'de ifade odası: Ece "Kimseyle kod paylaşmadım" der; kalemle tırnağını kazır. Gökhan: "Hesap sizin."
- "Sekiz ay sonra bir iddianame. Bir yıl sonra, annesi bir avukat aradı."

### BR_00 — Bölüm 1 · Sevim büroda (~750) · bg: buro_gece
- `card` "22 EKİM 2026 · 21.10 — ARSLAN HUKUK, BURSA". thought: "Eskiden dolandırıcı kapıyı çalardı. Şimdi bildirim gönderiyor."
- Sevim ıslak, plastik bir dosyayla gelir. "Benim kızım dolandırıcı değil. Bir iş bulayım diye çırpındı, o kadar."
- Kızının yerine konuşur; "o Burak denen çocuk" diye bir isim düşürür (kırmızı ringa ekimi).
- Ücret seçimi (puansız; ilişki): "Ücreti sonra konuşuruz" (güven +), "Tarifemizi anlatayım" (nötr),
  "Söz veremem, ama dosyayı sonuna kadar okurum" (dürüstlük bayrağı).
- Leyla kapıda; Sevim gidince: "Anneler dosyanın ilk sayfasıdır, son sayfası değil."

### BR_01 — Leyla dosyayı devreder (~550)
- Ceza aralığı A–D (158/1-f: 4–10 yıl + menfaatin iki katından az olmayan adli para / 157 / 158 alt sınırı 3 yıl /
  245). Doğruda Leyla gözlüğünü çıkarır; yanlışta kısa ve sert ders.
- Leyla'nın dersi: Temmuz'da yürürlüğe giren 158/4 ve lehe kanun (TCK 7/2). "Bu bir kapı. Ama kapıdan geçen, içeride bir şey
  yapmış sayılır. Müvekkilin bir şey yapmadıysa kapıyı sonraya sakla."
- İma: Leyla'nın telefonu tuşlu; thought: "Kopyalanacak bir şeyi olmayan tek insan."

### BR_01B — Dosyadaki dört kâğıt (~300)
- Siber raporu, hesap hareketleri, şikâyet dilekçesi, Ece'nin kolluk ifadesi. Leyla: "Dördünün de ortak bir eksiği var: hiçbiri
  bir telefonu anlatmıyor."

### BR_02 — Dosya ekranı + strateji (~250)
- Masumiyet → "Cesur. Hesabın o gün kimin elinde olduğunu göstermen gerekecek."
- Eksik soruşturma → "Polis yalnızca hesabın kimin adına olduğuna bakmış. Sen kimin elinde olduğuna bak."
- Terditli → "Güvenli. Ama müvekkiline 'bir şey yaptın' mı diyeceksin?"

### Bölüm 2 · SORUŞTURMA (INV1_*, ~5.500)
**INV1_SABAH** (~250): Yokuş, ıslak çamaşır ipleri; Ece kapıda, makyajsız, elinde yazdırılmış CV'ler.
**INV1_HUB** hedef kutusu (gün başına): "Kaan Bey kim? Para nasıl çıktı?" → "Telefon o gün kimin elindeydi?" → "Dilekçe son gün."

**INV1_ECE — Yalınların salonu (~1.400; 2. ziyaret ~300)** · bg: ev
- Görüşme, kapanışa değil Sevim'in atölyeden dönüşüne 14 dakika. Ton: Yumuşak (+4) / Sert (−8, ek bilgi).
- Konular: *İş ilanı* (Nova, Kaan Bey, kamerası bozuk mülakat, "Dördüncü kat"), *4.500 lira* (eğitim avansı), *Telefonun sustuğu gün*
  (10.13 "SIM yok", annesinin telefonuyla 11.05'te Kaan'ı araması, 19.20'de operatör mağazası), *Kod* (inkâr; sertte öfkeli
  inkâr), *Ekran görüntüleri* (başvuru tablosu bulunduysa: Kaan'la yazışmaların görüntüleri), *Burak* (annesi bahsettiyse).
- **Yüzleşme seçeneği** (sarı not ya da SGK mesajı varken, güven ≥ 40): Ece susar; sonra: "Okudum. SGK dedi. Ben… ilk kez biri bana
  'ailemize hoş geldiniz' dedi." Ardından Deniz'in tavsiyesi: doğruyu anlatmak (doğru), inkârda kalmak (etik ihlali), susmak (nötr).
- Güven < 40 ise Ece kapanır: "Siz de mi bana inanmıyorsunuz?"

**INV1_ODA — Ece'nin odası (sahne)**: lamba ("beyaz LED; parlak her yüzeye bir yıldız konduruyor"), sarı not, iPhone 8 ve
"SIM yok" ekran görüntüsü, başvuru tablosu açık laptop; çeldiriciler: CV yığını, yırtık vesikalık şeridi (Burak), otobüs kartı.

**INV1_SEVIM — Atölye (~400)** · bg: depo: dikiş makinesi tıkırtısı; Sevim Burak'ı suçlar; "Ben kutu atmam" der ve iPhone'un
kutusunu verir (IMEI etiketi).

**INV1_HESAP — Hesap hareketleri (belge)**: büyüteçle avans açıklaması; karşılaştırmayla 15.000 TL'nin alıcısı = avansı gönderen;
büyüteçle QR çekim.

**INV1_SIKAYET — Şikâyet dilekçesi (belge)**: satıcı numarası, "Dördüncü kat", "erkek sesi, Kaan".

**INV1_OPERATOR — Operatör mağazası (~350)**: Ece'yle; avukat hiçbir şey talep etmez, Ece kendi kaydını ister → işlem dökümü.

**INV1_OM — OM İş Merkezi (~700)** · bg: sokak_yagmur → buro: Lobide asansör "İkinci kat" der (kayıtlı ses tanıdık gelir;
Deniz bağlantıyı kurmaz). Çay, limon kolonyası, kaşık bardağa çarpar (yüzük yok; yaş tarifi yok).
"Nova mı? İki ay kira ödediler, sonra kayboldular. Gençler iş arıyor, ilanlara inanıyor; yazık." Sözleşmenin bir örneğini kendi
eliyle verir (kiracı: Arda Kılıç). Kartvizitini bırakır. **Necdet'e dair hiçbir şüphe satırı yazılmaz.**
- Ardından isteğe bağlı **INV1_KORIDOR** (sahne): asansörün "Dördüncü kat" anonsu, Nova etiketi ve altında harfleri sökülmüş
  bir levhanın "ARŞİV" izi ("yönetim arşivi" ancak N2'de Necdet'in ağzından), kiracı panosu (Nova yok),
  misafir ağı tabelası; çeldiriciler.

**INV1_BAYI — Mavi İletişim (~400)** · bg: sokak_yagmur: Onur "KVKK abla"; kibar soruya prosedürü anlatır ("kimliğin aslı, yüz yüze");
bir dil sürçmesi: "vekâletle gelen bir abi… yani, çok müşteri var." Baskı → etik uyarısı; para teklifi → etik ihlali.

**INV1_BURAK — Tamirci (~450)**: Burak alaycı; alibisi (10.12'de dükkânda, POS); IMEI dersi; **etik tuzak:** "Eski bayi şifrem
duruyor, hattın kaydını çekerim." Kabul → `ev_bayi_ekran` (hukuka aykırı), etik +2 (TCK 243/136'ya azmettirme, TCK 38).

**INV1_GOKHAN — Siber Şube (~400)**: "Dört yüz dosya." Banka yalnızca özet göndermiş; SIM geçmişi istenmemiş; ATM görüntüsü bekleniyor.

**INV1_DIL — CMK 177 dilekçesi**: üç hak; banka cihaz/IP kaydı, 135/6 hattın tespiti (IMEI dahil), bayi belgeleri, ATM görüntüsü;
çeldirici: keşif, "Nova'nın çağrılması".

**INV1_CIKARIM**: altı tarif (bkz. tasarım belgesi).

**Gün sonları:** Gün 1 akşamı Nurettin büroyu arar (katılan; Deniz dinler, söz vermez, mahkemeyi gösterir). Gün 2 akşamı Sevim
yemek getirir; Ece'ye gece gelen tek satırlık mesaj: "Avukatına çok konuşma." (Yalnızca saha ziyaretlerinden biri yapıldıysa.)

**INV1_GECE** (~350): Pano, sayılan bulgular (koşullu zincir); Leyla: "Yarın Ece kürsüde ne söylerse, sen onu duy. İstediğini değil."

### Bölüm 3 · BİRİNCİ CELSE (H1_*, ~2.400) · bg: durusma_salonu
- Koridorda Nurettin, Ece'ye bakmadan geçer. `card` "4 KASIM 2026 — BURSA 7. ASLİYE CEZA MAHKEMESİ · 1. CELSE".
- Katılma talebi (CMK 237): doğru cevap itiraz etmemek.
- Sanığın sorgusu: Ece'nin anlatımı Deniz'in tavsiyesine göre üç biçimde. Doğruyu anlatırsa sarı not ve ekran görüntüsü
  sunulur; savcının telkinli sorusuna itiraz anı.
- Katılanın beyanı: Nurettin'in öfkesi; Deniz kurbanı hedef almaz, "satıcının sesi"ni ve "Dördüncü kat"ı sorar.
- **Gökhan'ın tanıklığı** (doruk): cihaz kaydıyla "sanığın telefonundan" iddiası çöker; "hesap kiralama bedeli" döngüyle çöker;
  "SMS'ler sanığın hattına gitti" SIM dökümüyle çöker; "kapüşonlu muhtemelen yakını" kanaatine itiraz; bastırınca açılan
  "kimseyle kod paylaşmadı" ifadesi aldatma çıkarımıyla çöker.
- Talepler ve ara karar: eksik kayıtlar, iş merkezi yetkilisinin tanık olarak çağrılması (hâkim kendiliğinden ekler), yurt dışı
  yasağının kaldırılması talebi. Erteleme: üç hafta.

### Bölüm 4 · ARA (ARA_*, ~3.000)
- **ARA_GIRIS**: gelen kayıtlar (HTS/IMEI, bayi belgesi, ATM).
- **ARA_BELGE**: QR doğrulaması → "belge bulunamadı"; fotokopide masa lambasının parlaması ve bordo ojeli başparmak; vekil adı.
- **ARA_ARDA** (~450): Kurye büroya gelir. Deniz onu kendi avukatına yönlendirir, ifade almaz, yönlendirmez; o yine de anlatır:
  otopark, köşedeki ayrılmış yer, yarım inen cam. Telkin seçeneği etik ihlalidir.
- **ARA_OTOPARK** (sahne): "YÖNETİM" ayrılmış park yeri, kamera (30 gün), birikintiler.
- **ARA_NURETTIN** (~350): Adliye merdiveni; ilan fotoğrafları. Deniz teklif etmez, baskı yapmaz.
- **ARA_GOKHAN** (~300): "Bu bir zincir." İMEİ sorgusu için şüpheli soruşturması gerekir → suç duyurusu.
- **ARA_SUC**: Failleri belirsiz suç duyurusu + 135/6 talepleri (İK hattı, IMEI). Dayanaksız suçlama (Burak/Onur) iftira riski.
- **ARA_ECE** (~350): İş teklifini kaybetmiş; mülakatta bir an açılan kamerada bir elde parlayan bir yüzüğü hatırlar (biçimi yok).
- **ARA_BURAK**: Sevim'in özrü; Burak'ın IMEI'yi kontrol etmesi için öğüt (kendisi hiçbir kayda dokunmaz).
- **ARA_AKSAM**: Suç duyurusundan sonra büroya isimsiz telefon (`phone`, BİR SES): "Avukat hanım, bazı dosyalar uzarsa insanın
  işi de uzar." Fısıltı; yaşı, cinsiyeti seçilemez; tik yok. Kimse adını söylemez. İMEİ raporundaki üçüncü hat yalnızca
  "kurumsal hat, abone bilgisi ayrıca istendi" diye görünür.
- **ARA_SON**: Duruşmadan önceki gece (koşullu zincir).

### Bölüm 5 · İKİNCİ CELSE (T_*, ~3.000)
- Açılış: gelen raporlar okunur. Arda'nın tanıklığı (hâkim kendini suçlamama hakkını hatırlatır; telkinli soru tuzağı).
- **Onur** (O1–O4): yüz yüze kontrol yalanı, noter yalanı, "nişanlısı/genç çocuk" yalanı, bahşiş inkârı; bastırılınca tarif.
- **Necdet** (N1–N4): "Arda imzaladı", "oda hep boştu", "o numaraları ilk kez duyuyorum" (İMEİ + kartvizit → çöküş),
  "otoparkı bilmem".
- Savcının "yardım etme/158/4" çıkışı; mütalaa ve cevap; Nurettin'in son sözü; esas savunma konuşması; Ece'nin son sözü.

### EPİLOGLAR (OutcomeDef.epilogue; her biri ~250–400)
- **BERAAT_B:** Yağmur diner. Nurettin koridorda Ece'nin elini sıkar: "Kusura bakma kızım. İkimizi de aynı ses kandırmış."
  Necdet Sarı hakkında suç duyurusu; kartvizit dosyada. Leyla: "Telefonum yine tuşlu." thought: "Bazen bir insanın tek hatası
  altı dakikadır."
- **BERAAT_E:** Ece serbest ama koridorda bir fısıltı: "Şüpheden yararlandı." Kaan'ın kim olduğunu kimse bilmiyor.
  Ece başvuru tablosuna 144. satırı yazar: "Arslan Hukuk — staj?" thought: "Bazı kapılar açılır ama ışığı kimse yakmaz."
- **İNDİRİM (158/4):** HAGB; Ece, kendisini dolandırmış bir zincirin borcunu aylık taksitle Nurettin'e ödeyecek. thought:
  "Kazandığımızı söylediler. Ece taksit planını imzalarken eli titremedi. Benimki titredi."
- **MAHKÛMİYET:** Sevim plastik dosyayı kapatır; içinde hâlâ sarı not. Çöküşte savcı: "İyi bir avukat olacaksınız. Bugün değil."
- **ETİK_BERAAT:** Hukuka uygun deliller yeter; Ece beraat eder, ama hâkim aynı nefeste karar örneğini baroya ve Başsavcılığa
  gönderir (ihlal salonda görüldüyse; görülmediyse Leyla Deniz'e kendini bildirmesini söyler). Sevim: "Kızımı kurtardınız.
  Kendinizi kurtaramadınız galiba." Üç hafta sonra disiplin kurulu koridoru; Leyla Deniz'in avukatıdır: "Seni savunurum,
  ama seni aklamam."
- **ETİK_İNDİRİM (158/4 + etik):** Hukuka uygun deliller 158/4'e yeter; hüküm İNDİRİM ile aynı (HAGB, taksit). İhlal salonda
  görüldüyse hâkim karar örneğini baroya gönderir; görülmediyse salonda yalnız Deniz ve Leyla bilir. Ece: "Benim beş yılım
  var. Sizin?" Leyla Avukatlık Kanunu'nu 34. maddede açık bırakır: "Yarın sabah baroya kendin yazacaksın."
- **ETİK (mahkûmiyet):** Yalnızca ihlal varken hukuka uygun delil ne beraate ne 158/4'e yettiğinde. Hâkim hukuka aykırı kaydı dışlar; Leyla
  masaya Avukatlık Kanunu'nu bırakır, bir şey demez.
- **Hafif ihlalli beraat:** BERAAT_E/B'ye Leyla'nın ertesi sabahki ihtarı eklenir (inkâr tavsiyesi, bayide tehdit, katılana
  "vazgeç" telkini; her biri ayrı bir cümle).
