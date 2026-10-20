# Dava #01 — Kayıp Cüzdan · Hikâye Kitabı (noir)

> Serinin ilk davası. Çıta: `docs/content/gece-bekcisinin-sirri-hikaye.md` (Dava #07 v2). Hukuki gerçek, delil zinciri, sonuç
> koşulları ve puanlar `docs/content/kayip-cuzdan.md` ve `docs/legal/kayip-cuzdan.md`'dedir; bu belge onları **sahneye** çevirir.
> Zorluk 1: mekanikler hikâyenin içinde, nazikçe öğretilir (Leyla'nın kısa açıklamaları, ilk ekranlarda iç ses ipuçları), ama
> dava 90–120 dakikalık tam bir hikâyedir.

## 0. Ton ve kurallar

- **Noir dram.** Bursa, ekim sonu. Yağmur Uludağ'dan iner, Çarşı'nın taş sokaklarında birikir. Otobüs camlarında buğu, ıslak
  yün kokusu, florasan vızıltısı, validatörün bip sesi, sahafta eski kâğıt kokusu. Kuru ve seyrek mizah.
- **İç ses.** Deniz `style: "thought"` ile birinci tekil şahıs, kısa cümlelerle konuşur. Gözler, sezer; çözümü asla söylemez.
  - Örnek: *"Bursa'da kayıp eşya iki yere gider: ya sahibine ya dosyaya. Bu cüzdan dosyaya gitmişti."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numaraları yalnızca Leyla'nın kısa açıklamalarında, `good`/`bad`/`neutral`
  geri bildiriminde, rapor ve hüküm metninde ve resmî duruşma dilinde (savcı, hâkim) geçer. Arda "hocam", Zehra "avukat hanım"
  der; kimse sokakta "TCK 160" demez.
- **Gizem korunur.** Soğuk açılışta sesler isimsizdir (`speaker: "narrator"`, `name: "BİR SES"`, `"BÜFECİ"` değil
  `"TEZGÂHTAKİ SES"`). Kartları kimin kullandığı, cüzdanı kimin çaldığı **ARA evresindeki tam kayda kadar** söylenmez, ima da
  edilmez. Birinci evrede oyuncu yalnızca "kartlar Arda'nın elinde değildi" ve "kayıt eksik" sonucuna delille ulaşır; savcılık da
  aynı bilgiye "Arda kartları bir suç ortağına verdi" diye bakar. İki okuma da açık kalır.
- **Her sahne bir şey değiştirir.** Yeni bilgi, yeni şüphe ya da bir ilişkide kırılma.
- **Satır kuralları:** satır ≤ 220 karakter; her yeni mekânda ilk satır `style: "card"` + `bg`; sert anlarda `fx` (`shake`,
  `flash`, `fade`).
- **Etik çizgi:** Deniz tanığa baskı yapmaz, müştekiyi şikâyetinden döndürmeye çalışmaz, şüphelileri kovalamaz (savcılığa
  bildirir), müvekkiline yalan ya da sahte ikrar telkin etmez. Bunların her biri oyunda seçenek olarak vardır ve bedeli olur.
- **Sözcük bütçesi:** tipik yol (BERAAT_E) `case:duration` ile 13–16 bin sözcük, ≥ 200 aksiyon, 90–120 dk; bütün dallar
  toplamı ≥ 18 bin sözcük.

## 1. Tema ve dramatik soru

- **Logline:** Son sınıf öğretmen adayı Arda Çınar, otobüste koltuğun altında bulduğu cüzdan yüzünden hırsızlıkla yargılanır;
  kartlar o daha cüzdanı görmeden harcanmıştır, ama elindeki tek şey "teslim edecektim" cümlesidir.
- **Tema:** *Niyet görünmez; ama iz bırakır.* İyi niyetin kanıtı, insanların umursamadan geçtiği küçük kayıtlardadır: bir çağrı
  merkezi notu, bir yapışkan kâğıt, bir kamera açısı, bir büfecinin fişin arkasına düştüğü not.
- **Dramatik soru:** Kötü bir anda iyi bir şey yapmak, kötü bir şey yapmak gibi görünüyorsa; bunu kim, neyle ispat edecek?
- **Deniz'in yayı:** Leyla'nın ona ilk kez bir dosyayı baştan sona bıraktığı dava. Deniz "kazanmak" için değil, eksik kalan
  dakikaları bulmak için çalışmayı öğrenir: *"Kayıt eksikse, hüküm de eksiktir."*

## 2. Kadro: sesler, sırlar, yaylar

| Kimlik | Karakter | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| `deniz` | **Av. Deniz Arslan**, büroda ikinci yılı; ilk kez tek başına bir dosya | İç ses kısa, alaycı, gözlemci; dışarıda nazik ve inatçı | Leyla'nın güvenini hak etmek istiyor; kayıp eşya bürolarından hoşlanmaz (çocukken kaybettiği bir bisiklet). | Hevesten titizliğe. |
| `leyla` | **Av. Leyla Erdem**, 58, büronun kurucusu | Az konuşur, her cümlesi bir ders; çayını hep yarım bırakır | Masasının alt çekmecesinde otuz yılda müvekkillerin büroda unuttuğu eşyalar durur (bir eldiven, bir tespih, bir çocuk çorabı). Epilogda açılır. | Deniz'i izler, kurtarmaz; etik çizgide serttir. |
| `arda` | **Arda Çınar**, 22, son sınıf sınıf öğretmenliği; Kars Sarıkamışlı; Çarşı'da "Eski Sayfa" sahafında yarı zamanlı | Kibar, ölçülü, biraz resmî; "hocam" der; gerilince sayı sayar ("üç durak, iki dakika"); kuru, kendini küçümseyen espriler | Polisten korkar: liseden bir kimlik kontrolünün aşağılayıcı hatırası. Gece karakola gitmemesinin asıl sebebi budur ve utanır. 153'ü aradığını "kimse not almadı ki" diye önemsizler. | Utançtan dik duruşa. Son sözünde kendi cümlesini kurar. |
| `zehra` | **Zehra Çınar**, 28, devlet hastanesinde gece vardiyalı hemşire; Arda'nın ablası | Hızlı, yorgun, iğneleyici; "avukat hanım" der, sonra "Deniz Hanım"a döner; tehlikede sertleşir | Avukat parasını iki gece fazla mesaiyle denkleştiriyor; annelerine davayı söylemedi. | Güvensizlikten ortaklığa. |
| `gulten` | **Gülten Sarı**, 67, emekli terzi, astsubay dulu; Beşevler | Yavaş, nazik ama kırgın; "evladım" der; dikiş terimleriyle düşünür ("söküğü olan iş") | Cüzdandaki asıl kayıp para değil, kocası İsmail'in fotoğrafıdır. Facebook hesabını torunu Elif yönetir; mesaj isteklerine hiç bakılmamıştır. | Öfkeden adalet duygusuna. Duruşmada "o çocuk bana ulaşmaya çalışmış" der. |
| `hayri` | **Hayri Doğan**, 72, emekli PTT dağıtıcısı; Beşevler | Gururlu, ayrıntıcı, "otuz yıl mektup dağıttım, yüz unutmam" der; gazeteyi gözlüksüz okur (miyop) | Kötü biri değil; yanlış hatırladığını kabul etmek zor gelir. Otobüste gazete okuyordu; başını kaldırdığında gördüğü şey yalnızca gri bir kapüşondu. | Kesinlikten şüpheye; dürüst bir geri adım. |
| `recep` | **Recep Ateş**, 49, Kent Ulaşım şoförü, 22 yıllık | Kısa, huysuz, "abi/abla" yerine "hanımefendi"; yorgunluk ve korku | Son disiplin uyarısındaydı. Bulunan eşyayı alıp buluntu defterine işlemek zorundaydı; Arda'yı "yarın kayıp eşya bürosuna götür" diye geri çevirdi. Polise "kimse bir şey getirmedi" dedi. | Yalan → kürsüde çözülme (2. celse). |
| `volkan` | **Volkan Sezer**, 34, Kent Ulaşım kamera/kayıt teknisyeni (ortak sprite `tanik`) | Teknik, savunmacı, "sistem böyle" der | CD'ye yalnızca polis memurunun işaret ettiği 2,5 dakikayı ve tek kamerayı aktardı; bir segment yazılırken bozuldu. Tam sefer kaydı (4 kamera, 18.10–19.10) "olay klasöründe" duruyor. | Savunmacılıktan dürüst teknik tanıklığa. |
| `cemil` | **Cemil Yavuz**, 54, Altıparmak'ta tekel büfesi | Esnaf ağzı, şakacı, hızlı; "abla" der; her şeye fiyat biçer | Ters ibrazlardan (chargeback) bıktığı için tuhaf ödemeleri gün sonu fişlerinin arkasına not eder. | Umursamazlıktan küçük bir yurttaşlık cesaretine (savcılığa ifade). |
| `ozan` | **Ozan Kaplan**, 23, makine mühendisliği; Arda'nın ev arkadaşı | Lakayt, hızlı, argo; Arda'yı korur | Polisi sabah 08.15'te kapıda o karşıladı; masadaki sarı notu gördü ama kimse ona sormadı. | Tanık olarak küçük ama kritik. |
| `orhan` | **Bşk. Orhan Kılınç**, Asayiş Şube, hırsızlık büro (ortak sprite `polis`) | Ağır, kuru, rakamla konuşur | Hat 38 ve 19'da aynı yöntemle (cüzdan boşaltılıp koltuk altına bırakılır, kartlar şifresiz temassızla yarım saat içinde harcanır) altı şikâyet dosyası var; failleri bulamıyor. | Savunmanın suç duyurusuyla düğümü çözer (yalnızca 223/2-b yolunda kürsüye çıkar). |
| `hakim` | **Hâkim Feride Aslan**, Bursa 9. Asliye Ceza (tek hâkim) | Sakin, kısa, sabırlı; "Müdafi, diyeceğiniz?" | — | Doğru delil karşısında soru sorar, tarafını belli etmez. |
| `savci` | **Savcı Tolga Uçar** (duruşma savcısı) | Keskin, adil ama yorgun; dosya yığını | — | 1. celsede 142/2-b'ye nitelendirme ister; 2. celsede delile göre görüşünü değiştirebilir. |
| `katip` / `mubasir` | **Melek Şen** (zabıt kâtibi), **Mübaşir Nihat** | Kâtip bürokratik, sonra yardımsever; mübaşir tören sesiyle | — | Emanette Melek "dokunmak yok, bakmak serbest" der. |

**Gizli kalanlar (oyuncuya ad olarak ancak ARA sonunda/2. celsede söylenir):** "parkalı adam" ve "yeşil bereli kadın" —
yankesici çift. Hiçbiri karakter kimliği olarak kadroya girmez; görüntüde ve tanık anlatımında betimlemeyle geçerler. Adları
(Kenan ve Sevda T.) yalnızca 223/2-b yolunda Bşk. Orhan'ın tanıklığında söylenir.

## 3. Gerçek ve kronoloji (6 Mart 2026, Cuma, yağmurlu)

| Saat | Olay | Kim biliyor | Nasıl keşfedilir |
|---|---|---|---|
| 17.52 | Arda, Çarşı'daki ATM'den KYK bursundan 600 TL çeker (kira payı), zarfa koyar. | Arda | Oda araması: ATM fişi (çekmece) · tutanakta "zarf içinde 600 TL" |
| 18.12 | Gülten Hanım Heykel'den Hat 38'e biner (kardiyoloji randevusundan, kız kardeşine uğrayıp dönüyor). Parkalı adam ve bereli kadın da biner. | — | Tam kayıt (ARA) |
| 18.20 | Arda Çarşı durağından biner (kişiye özel öğrenci kartı). Kalabalık; orta kapı yanında, kulaklıkla ayakta. | Arda, savcılık | Kent kart kaydı (dosyada) |
| 18.31–18.34 | Orta kapıda bereli kadın açık şemsiyesiyle perde yapar; parkalı adam Gülten Hanım'ın bez çantasından cüzdanı alır, kadın nakit ve iki kartı çıkarır. Hayri Bey arkaya bakan 9 numaralı koltukta gözlüksüz gazete okur; başını kaldırınca "gri bir kapüşon" görür (parkanın kapüşonu). | çift | Tam kayıt KAM-3 · Hayri ziyareti (gözlük) · çapraz sorgu |
| 18.36 | Parkalı adam arka kapıya ilerlerken boş cüzdanı 14 numaralı koltuğun altındaki boşluğa bırakır. | çift | Tam kayıt KAM-4 · otobüs sahnesi (koltuk boşluğu) |
| 18.37 | Çift Altıparmak'ta iner. | çift | Tam kayıt KAM-1 |
| 18.42 | Arda boşalan 14'e oturur; ayağı cüzdana takılır; alır, açar (kimlik, fotoğraf, eczane fişi; para ve kart yok), etrafına bakar. | Arda | Savcılığın CD klibi (18.42.00–18.44.30, yalnızca KAM-2) |
| 18.43 | Arda cüzdanı yanındaki yolcuya gösterip "sizin mi?" diye sorar. Bu dakika CD'de **bozuk segment** olarak yoktur. | Arda, Volkan | CD dışa aktarım günlüğü · Volkan'ın tanıklığı · tam kayıt |
| 18.46 | Gülten Hanım ön taraftan Beşevler'de iner; çantasına bakmaz. Hayri Bey de iner. | — | Tam kayıt · müşteki beyanı |
| 18.49 | Altıparmak Tekel Büfe: 3 ayrı temassız çekim (740 TL). Bereli kadın. Cemil fişin arkasına "yeşil bere — 3 ayrı çek, şifresiz" yazar. | çift, Cemil | Banka dökümü · büfe sahnesi (fiş kutusu) · Cemil |
| 18.55 / 19.06 | Altıparmak GSM aksesuar (1.450 TL) · Kültürpark petrol (750 TL). Toplam 2.940 TL. | çift | Banka dökümü |
| 19.05 | Görükle'de Arda ön kapıya gider, cüzdanı şoföre uzatır. Recep: "Ben bakamam, yarın kayıp eşya bürosuna götür." | Arda, Recep | Tam kayıt KAM-1 · Recep'in çözülmesi |
| 19.18 | Arda 153 Çözüm Merkezi'ni arar (3 dk 12 sn). Operatör not düşer: "Hat 38'de bulunan cüzdan; yolcuya ertesi gün terminal kayıp eşya bürosuna teslim etmesi söylendi." | Arda, çağrı merkezi | Oda araması (arama geçmişi) · delil dilekçesi → çağrı kaydı (ARA) |
| 19.20 | Gülten Hanım evde banka SMS'lerini görür; 20.10'da karakola gider. | Gülten | Müşteki beyanı |
| 21.14 | Arda, kimlikteki adla bulduğu Facebook hesabına yazar: "Merhaba, 38 numaralı otobüste cüzdanınızı buldum. Size nasıl ulaştırabilirim?" Mesaj isteklerinde okunmadan kalır. | Arda | Oda araması (telefonunda gönderilmiş mesaj) · ARA'da Gülten/Elif |
| 22.30 | Arda masasına sarı yapışkan not yapıştırır: "Yarın 9 — karakol. G. Sarı cüzdan." Ozan görür. | Arda, Ozan | Emanet incelemesi (büyüteç) · Ozan |
| 23.40 | Polis memurunun talebiyle Volkan CD'ye yalnızca KAM-2'nin 18.42.00–18.44.30 aralığını aktarır; tam sefer kaydı olay klasörüne alınır. | Volkan | CD dışa aktarım günlüğü (kaynak dosya) |
| 7 Mart 08.15 | Polis Görükle'deki öğrenci evine gelir; cüzdan sırt çantasında, 600 TL'lik zarf ve sarı not el konur. Arda: "Buldum, bugün teslim edecektim." | Ozan, polis | Tutanak (dosyada) |
| Sonra | Soruşturmada uzlaştırma denenir; Gülten Hanım reddeder ("o çocuk cezasını çeksin"). İddianame: TCK 141/1; kartların kullanımı yönünden faili belirlenemediğinden ayrı soruşturma. Bursa 9. Asliye Ceza. | — | Dosya ekranı, Leyla |
| 13 Ekim | Zehra büroya gelir. 1. celse 27 Ekim, 2. celse 17 Kasım. | — | — |

**Savcılığın okuması (oyuncuya da makul görünmelidir):** Arda kalabalıkta kadının arkasındaydı (Hayri), cüzdanı aldı, kartları
Altıparmak'ta inen bir suç ortağına verdi, boş cüzdanı "buldum" diyebilmek için yanında tuttu, 15 saat kimseye bildirmedi,
çantasında "kadının parası" olan 600 TL vardı. Birinci evredeki her bulgu bu okumayı zayıflatır ama çürütmez; çürüten tam kayıt ARA'da
gelir.

## 4. Yapı (bölümler ve node haritası)

```
PROLOG  Soğuk açılış (otobüs 18.42 · büfe 18.49 · kapı 08.15; isimsiz)               STORY → PR_02 → BR_00
BR_00   Bölüm 1 · Zehra büroda (yağmurlu akşam; ücret, korku, "o çocuk bir şey çalmaz")  STORY + seçim
BR_01   Leyla dosyayı devreder: ceza aralığı sorusu (141/1 · 142/1-c · 142/2-b · 160)    STORY + A–D
BR_02   Dosya ekranı + strateji                                                       STORY (BRIEFING)
INV_SABAH → INV_HUB  Bölüm 2 · SORUŞTURMA (3 gün × 4 EP; Leyla'ya danış günde 1, 0 EP)
  YERLER:   INV_OTOBUS (+INV_OTOBUS_SON) · INV_ODA (+INV_ODA_SON) · INV_BUFE (+INV_BUFE_SON) · INV_TERMINAL (kayıp eşya bürosu)
  KİŞİLER:  INV_ARDA (görüşme; sahaf; konu kilitleri) · INV_HAYRI (kıraathane) · INV_RECEP (garaj) · INV_ZEHRA (hastane, gece)
  ARŞİV:    INV_EMANET (+INV_EMANET_SON) (belge: el koyma tutanağı + emanet) · INV_KLIP (belge: CD dışa aktarım günlüğü) · INV_BANKA (belge:
            kart hareketleri) · INV_DIL (CMK 177 dilekçesi, 3 hak) · INV_CIKARIM (tahta) · INV_LEYLA
  Gün sonu: INV_DAY_END (DECISION) → INV_AKSAM1 / INV_AKSAM2
INV_GECE_* Duruşmadan önceki gece (koşullu hafıza zinciri) → INV_GECE
H1_00…H1_09  Bölüm 3 · BİRİNCİ CELSE: açılış → Arda'nın sorgusu → müşteki → Hayri (bastır/sun/itiraz) → CD → talepler →
             nitelendirme uyarısı (CMK 226) → ara karar/erteleme
ARA_GIRIS_0/1 → ARA_GIRIS → ARA_HUB  Bölüm 4 · ARA (3 gün × 3 EP; yığınsız, doğrudan dönüş)
  ARA_KAYIT (+ARA_KAYIT_SON gece yarısı) (belge: tam kayıt — ters köşe) · ARA_CAGRI (belge: 153 kaydı) · ARA_GULTEN (müşteki ve torunu)
  ARA_VOLKAN (teknik oda) · ARA_OZAN (tanık, ezber tuzağı) · ARA_HAYRI (büroya gelen tanık) · ARA_KARAKOL (Pol. Mem. Serkan Ulu)
  ARA_CEMIL (büfe, ikinci ziyaret) · ARA_SUC (suç duyurusu) · ARA_ARDA (ek savunma hazırlığı, Zehra) · ARA_CIKARIM · ARA_LEYLA
  ARA_YANLIS (çifti kendin bulmaya gitmek — etik/güvenlik dersi)
ARA_SON_* → H2_00…H2_12  Bölüm 5 · İKİNCİ CELSE: teknisyen → şoför → müşteki → (Bşk. Orhan) → ek savunma → mütalaa → cevap
             → esas savunma → son söz → hüküm
H2_HUKUM → R_KARAR + epilog (OutcomeDef.epilogue)
H_COKUS (♥0) → H2_HUKUM
```

## 5. Sahne sahne (dakika ve sözcük bütçesiyle; tipik yol)

### PROLOG — Soğuk açılış (~750 sözcük, 5 dk) · bg: arac → sokak_yagmur → sokak_sabah
- `card` "6 MART · 18.42 — HAT 38, HEYKEL–GÖRÜKLE". Buğulu camlar, validatör bip sesi, kalabalığın seyrelmesi.
- Gri kapüşonlu bir genç boşalan koltuğa oturur. Ayağı bir şeye takılır. Kahverengi, eski, deri bir cüzdan. Açar. Bir kimlik,
  bir fotoğraf, bir eczane fişi. Para yok, kart yok. Etrafına bakar. Kırmızı kayıt lambası. *Kimse bakmıyor. Kamera bakıyor.*
- `card` "18.49 — ALTIPARMAK". Bir büfe. İsimsiz sesler: TEZGÂHTAKİ SES "Toplam yedi yüz kırk, abla." BİR SES "Üçe böl.
  Ayrı ayrı." "Zengin misin abla, üç ayrı çekiyorsun?" "Şifremi unuttum." Kartın üç kez bip'i. Islak bir eldiven. (Kimin
  kartı, kimin eli söylenmez.)
- `card` "7 MART · 08.15 — GÖRÜKLE, BİR ÖĞRENCİ EVİ". Kapı çalınır (`shake`). Polis. Sırt çantası açılır; kahverengi cüzdan.
  Genç: "Buldum… bugün teslim edecektim." Polis: "Hepsi öyle der." Masada sarı bir kâğıt kıpırdar; kimse bakmaz (`fade`).
- Kural: "kartları kullanan başkası" ihtimali kurulur ama savcılığın "suç ortağı" okumasıyla da uyumludur.

### BR_00 — Bölüm 1 · "Zehra" (~800 sözcük) · bg: buro_gece
- `card` "13 EKİM · PAZARTESİ 21.10 — ARSLAN HUKUK, BURSA". thought: *"Bursa'da kayıp eşya iki yere gider: ya sahibine ya
  dosyaya."*
- Zehra hemşire önlüğünün üstüne yağmurluk geçirmiş; vardiya arası. Bir dosya poşeti: iddianame, tutanak fotokopileri,
  Arda'nın bir fotoğrafı (sahafta, kitap kolisi taşırken).
- Duygusal çekirdek: "O çocuk sokakta para bulsa muhtara götürür. Muhtar yoksa camiye. Cami kapalıysa sabaha kadar bekler."
  "Öğretmen olacak. Hırsızlıktan mahkûm olursa atanamaz, biliyor musunuz?" (thought: *Biliyordum.*)
- Seçim (puan yok; ilişki): "Ücreti sonra konuşuruz." (+güven, Zehra yumuşar) · "Söz veremem; dosyayı okuyacağım." (dürüstlük,
  `deniz_durust`) · "Beraat garanti." (kötü işaret; Leyla duyar, kısa ve sert ders).

### BR_01 — Leyla dosyayı devreder (~600 sözcük) · bg: buro_gece
- Leyla kapıda: "Bu dosya senin. Baştan sona." Ceza aralığı sorusu sahnenin içinde: iddianame 141/1 (1–3 yıl). Yanlış
  seçenekler: 142/1-c (toplu taşımada bulunan eşya, 3–7 yıl), 142/2-b (özel beceri, 5–10 yıl), 160 (bir yıla kadar, şikâyete bağlı).
  Doğru cevapta Leyla ekler: "Savcı bu sınırda durmayabilir. Kalabalıkta, çantadan… 'özel beceri' derse beş yıldan başlarız."
  (2. celsedeki nitelendirme uyarısının tohumu.)
- Leyla'nın kuralı: "Kayıt eksikse hüküm de eksiktir. Eksik dakikayı bul."

### BR_02 — Dosya ekranı + strateji (~250 sözcük)
- Profil kartı, ceza çubuğu, olay özeti, savcılığın elindekiler (CD klibi, tanık Hayri, tutanak, kent kart, banka dökümü).
- Strateji: Masumiyet (×1,5) · Usul/delil bütünlüğü (×1,2) · Terditli (önce beraat, olmazsa 160 / lehe hükümler; ×0,8).

### Bölüm 2 · SORUŞTURMA (~4.500 sözcük, 3 gün × 4 EP)
- **INV_SABAH** (~200): `card` "14 EKİM · 08.30 — ÇARŞI". Deniz yağmurda Kapalıçarşı'nın arkasındaki sahafa yürür; hedef kutusu.
- **INV_HUB** gün hedefleri: G1 "Arda o akşam ne yaptı? Kayıt neyi gösteriyor, neyi göstermiyor?" · G2 "Kartlar: kim, nerede,
  ne zaman?" · G3 "Dilekçe son gün. Duruşmada neyi istiyorsun?" `quickTalk`: Arda'nın son cümlesi.
- **INV_ARDA — Sahaf "Eski Sayfa" (~900)** · bg: kafe. Kitap kolilerinin arasında. Tonlar: yumuşak (+güven) / sert (−güven,
  ek bilgi). Konular: *O akşam* · *Cüzdan* (ne vardı, ne yoktu) · *Neden polise gitmedin?* (sert tonda lise anısı, utanç) ·
  *Zarftaki para* (tutanakta 600 TL görüldüyse açılır) · *Telefonun* (oda aramasında arama geçmişi bulunduysa: 153'ü aradığını
  söyler) · *Şoför* (otobüs sahnesinde tabela bulunduysa: "Şoföre uzattım, almadı") · *Kendisi* (öğretmenlik, staj). Delil
  sunma: sarı not → "Ozan gördü"; ATM fişi → güven.
- **INV_OTOBUS — Hat 38'e aynı saatte binmek (sahne, ~350)** · bg: arac. Nesneler: dört kamera (KAM-1 ön, KAM-2 orta, KAM-3
  orta kapı, KAM-4 arka) · 14 numaranın altındaki boşluk · "Bulunan eşyayı sürücüye teslim ediniz" çıkartması · arkaya bakan 9
  numara (Hayri'nin koltuğu; orta kapıya üç metre) · çeldirici: validatör, durak ekranı, reklam.
- **INV_ODA — Öğrenci evi (sahne, ~350)** · bg: ev. Arda ve Ozan eşliğinde, rızayla. Nesneler: çekmecede ATM fişi (17.52, 600 TL)
  · telefonda arama geçmişi (19.18, 153, 3 dk) · telefonda gönderilmiş Facebook mesajı (21.14) · sarı not bloğu (aynı not
  kâğıdı) · çeldirici: kira sözleşmesi (iki ay gecikme — savcılığın "motiv"i; Arda'yı kötü gösterir ama doğrudur), kitap yığını.
- **INV_BUFE — Altıparmak (sahne, ~300)** · bg: sokak_gece. Banka dökümü görüldüyse açılır. Nesneler: temassız POS çıkartması ·
  kamera (Cemil: "otuz günde kendini siler") · gün sonu fiş kutusu (fişin arkasında "yeşil bere — 3 ayrı çek, şifresiz") · durak
  tabelası "Altıparmak" 40 m. Cemil ilk ziyarette şakacıdır; tanık olmak istemez.
- **INV_HAYRI — Kıraathane (~500)** · bg: kafe. Gözlüğünü çıkarıp gazete okur. "Otuz yıl mektup dağıttım." Sorular: oturduğu
  yer (9), ne gördü (gri kapüşon, "eli çantanın hizasında"), gözlük ("okurken çıkarırım"). Baskı/telkin seçenekleri cezalı.
- **INV_RECEP — Garaj kantini (~450)** · bg: depo. Recep: "Kimse bir şey getirmedi." Ön kamera sorusu (dört kamera bulunduysa)
  onu gerer. Baskı yapmak (disiplin, "yalan tanıklık" tehdidi) TCK 277 dersi. Doğru yol: sorularını sorup mahkemede dinletmek.
- **INV_ZEHRA — Hastane, gece (~300)** · bg: hastane. Zehra Arda'nın polis korkusunu anlatır (lise). Güven +.
- **INV_EMANET — Adliye emanet (belge, ~200)** · bg: adliye. El koyma tutanağı satırları: cüzdan içeriği · zarf 600 TL · sarı
  not · telefon (iade) · öğrenci kartı. Aletler: büyüteç, karşılaştır (müşteki beyanıyla), UV. Bulgular: kartlar ve nakit cüzdanda
  yok · notun metni · zarfın bantlı banka zarfı olduğu.
- **INV_KLIP — CD dışa aktarım günlüğü (belge, ~200)** · Volkan'ın imzalı aktarım formu. Bulgular: kaynak dosya "SEFER_0306_1810-1910
  (4 kanal)" · yalnızca KAM-2 aktarılmış · 18.43 segmenti "yazma hatası" · son kare 18.44.30 "Sıradaki durak: Beşevler".
- **INV_BANKA — Kart hareketleri (belge, ~150)** · Bulgular: 18.49 Altıparmak büfe (3 çekim) · 18.55 GSM · 19.06 petrol.
- **INV_DIL — CMK 177 dilekçesi (~200)** · 3 hak: tam sefer kaydı (4 kamera) · 153 çağrı kaydı · tanık Ozan · bilirkişi
  incelemesi · tanık Recep (zaten tanık) · büfe kamerası (silinmiş: nötr) · Gülten'in Facebook kayıtları (özel hayat; ret).
- **INV_CIKARIM — Tahta (0 EP)**: tarifler §7'de.
- **INV_LEYLA (günde bir)**: öğretici, kısa; madde atıfları burada.
- **Akşamlar (~250/gün):** G1 büroda Leyla ve soğuk çay ("Bugün ne öğrendin?" seçimi iç sese yansır) · G2 Zehra'nın telefonu
  (annelerine söylememiş) ya da Arda'nın mesajı.
- **INV_GECE (~350):** Pano; bulunanlar koşullu satırlarla sayılır. Arda'dan mesaj: "Yarın kravat takayım mı hocam?" Leyla:
  "Yarın kimseyi ikna etmeye çalışma. Eksik dakikayı göster."

### Bölüm 3 · BİRİNCİ CELSE (~2.400 sözcük) · bg: durusma_salonu
- `card` "27 EKİM · 10.40 — BURSA 9. ASLİYE CEZA MAHKEMESİ". Mübaşir: "Arda Çınar!"
- H1_00 açılış (kimlik, iddianame özeti, haklar). Gülten Hanım dinleyici sırasının önünde, çantasını kucağına bastırmış.
- H1_01 Arda'nın sorgusu: oyuncu yönlendirir — "her şeyi, 153 dahil anlat" · "susma hakkını kullan" · "cüzdanı açmadığını
  söyle" (yalan; Gülten'in fişleri, kayıt; kötü) · "pişmanım de" (belirsiz ikrar tehlikesi).
- H1_02 müşteki Gülten: öfkeli ve kırgın; "İsmail'imin fotoğrafı…" Deniz'in sorusu: saldırmak (kötü) / tek soru: "Cüzdanı
  geri aldığınızda fotoğraf yerinde miydi?" (evet → Arda dokunmamış; iyi).
- H1_03 savcının Hayri'ye telkinli sorusu → itiraz (CMK 201).
- H1_04 Hayri'nin ifadesi (bastır/sun/itiraz): H1 "9'da oturuyordum, her şeyi gördüm" · H2 "gri kapüşonlu genç kadının arkasındaydı"
  · H3 "eli çantasının hizasındaydı" · H4 "sonra oturdu, cüzdanı çantasına koydu" · H5 (bastırınca) "gazetemi okuyordum…".
  Doğru sunumlar: gözlük bulgusu/çıkarım H1'e, gri kapüşon (parka ile ayrım yok henüz; "kalabalık" çıkarımı) H2'ye, CD'nin
  son karesi H4'e (oturduktan sonra aldığı açık; "çaldı" değil "buldu" okuması). Kanaat itirazı: "O çocuktu, eminim."
- H1_05 CD klibi izlenir (savcılık delili): itiraz seçenekleri — "kayıt eksik; tam sefer kaydı ve dört kamera getirtilsin (CMK
  206/1, 217)" doğru · "kayıt hukuka aykırı, dışlansın" (yanlış dayanak) · "diyeceğimiz yok".
- H1_06 talepler (dilekçede istenmeyenler duruşmada CMK 206 ile istenebilir; hak sayısı sınırlı).
- H1_07 savcının nitelendirme talebi: 142/2-b → hâkim CMK 226 uyarısı → Deniz: ek savunma için süre iste (226/3) · itiraz
  "iddianameye bağlısınız" (CMK 225/2 yanlış) · sessiz kal.
- H1_08 ara karar ve erteleme (17 Kasım). Koridor: Gülten Hanım Deniz'e bakmadan geçer; Arda'nın elleri titrer.

### Bölüm 4 · ARA (~2.600 sözcük, 3 gün × 3 EP)
- **ARA_GIRIS:** Zehra'nın arabası, yağmur, Arda'nın staj okulundan gelen e-posta ("dava sonuçlanana kadar…").
- **ARA_KAYIT — Tam sefer kaydı (belge, ters köşe):** (istendiyse) Kent Ulaşım'dan gelen dört kanallı kayıt, kare dökümü
  satırlarıyla: 18.31 KAM-3 kalabalık, açık şemsiye, yeşil bere · 18.33 KAM-3 parkalı adamın eli bez çantanın içinde · 18.36 KAM-4
  14'ün altına bir cisim · 18.37 KAM-1 çift Altıparmak'ta iniyor · 18.42 KAM-4 Arda oturuyor, alıyor · 18.43 KAM-4 yanındakine
  gösteriyor · 19.05 KAM-1 şoföre uzatıyor, şoför el sallıyor. Büyüteç ve karşılaştır: parka kapüşonu ile Arda'nın kapüşonu;
  bere ile büfe notu. thought: *"Eksik dakika buradaydı. Arda'nın değil; başkasının."*
- **ARA_CAGRI — 153 kaydı (belge).**
- **ARA_GULTEN — Beşevler, Gülten Hanım'ın evi (~700):** Telefon: torun Elif "Babaanne mesaj isteklerinde bir mesaj
  bulduk." Etik seçim: tek başına gidip "şikâyetinizi geri alın" demek (yanlış; zaten 141'de şikâyet geri alma davayı düşürmez,
  ayrıca baskı) · "Bunu mahkemeye kendiniz anlatabilirsiniz; ben yalnızca dinlerim" (doğru) · para teklifi (etik ihlali).
  Dikiş makinesi, İsmail'in fotoğrafı yerine konmuş. "Söküğü olan iş."
- **ARA_CEMIL — Büfe, ikinci ziyaret (~400):** Fişin arkasındaki not; Cemil'in hatırlaması. Telkin seçeneği (kareyi tek başına
  gösterip "bu kadın mıydı?" demek) kötü; açık soru iyi; "savcılığa ifade verir misiniz?"
- **ARA_SUC — Suç duyurusu (CMK 158):** dayanaklı (kare dökümü + büfe notu + banka saatleri) → Bşk. Orhan devreye girer,
  çift 2. celseden önce yakalanır (`sebeke_yakalandi`) · dayanaksız (isimsiz "şebeke") → kötü · hiç yapmamak.
- **ARA_YANLIS — Kendin Altıparmak'ta beklemek:** Leyla'nın sert dersi; bir şey bulunmaz, güven ve puan gider.
- **ARA_ARDA — Ek savunma hazırlığı (~400):** Arda'ya ne söyleyeceğini değil, doğruyu söylemesini öğütlemek; lise anısını
  mahkemede anlatmak isteyip istemediği; Zehra'nın "annemize söyleyeceğim" kararı.
- **ARA_LEYLA, ARA_CIKARIM.** Akşam: ARA_AKSAM (Leyla'nın çekmecesi açılmaz; "sonra").

### Bölüm 5 · İKİNCİ CELSE (~2.600 sözcük)
- `card` "17 KASIM · 10.15 — 2. CELSE". Ara karar cevapları okunur (koşullu).
- **H2_01 Volkan (teknisyen) ifadesi:** V1 "aktarım eksiksizdir" · V2 "tek kamera yeterliydi, olay anı oydu" · V3 "segment hatası
  olmaz" · V4 (bastırınca) "kaynak dosya klasörde duruyor". Sunumlar: kaynak dosya/eksik kayıt çıkarımı V1'e, bozuk segment V3'e.
- **H2_02 Recep (şoför) ifadesi:** R1 "kimse bana bir şey getirmedi" · R2 "kurala göre eşyayı alır deftere yazarım" · R3 "o gün
  defterde bir şey yok çünkü getiren olmadı" · R4 (bastırınca) "yorgundum…". Sunum: KAM-1 19.05 karesi (ya da sürücü reddi
  çıkarımı) R1'e → çözülme: "Yarın götür dedim. Defter… başım derde girer diye." `fx: shake`. Savcının itirazı/hâkimin CMK 48 uyarısı.
- **H2_03 Müşteki Gülten (Facebook mesajı bulunduysa ve etik yol izlendiyse):** "O çocuk bana yazmış." Kendi cümlesi.
- **H2_04 Bşk. Orhan (yalnızca suç duyurusu yapıldıysa):** altı dosya, aynı yöntem; çift yakalandı, kartlar bende; Gülten Hanım'ın
  kartı da aralarında. Savcının itirazı: "bu dosya ayrı" → müdafiin cevabı (CMK 217/1; 206/2-b'ye girmez).
- **H2_05 Ek savunma (CMK 226):** 142/2-b'ye karşı: özel beceri yok, alma eylemi yok; 160'a karşı: "malik gibi tasarruf" yok,
  bildirme girişimleri var.
- **H2_06 Mütalaa** (varyantlar: mahkûmiyet 141/1 · 160'a nitelendirme · beraat 223/2-e · beraat 223/2-b ve dosyanın ayrı
  soruşturmayla birleştirilmesi) + cevap (CMK 216/2).
- **H2_07 Esas savunma:** Deniz'in konuşması 3–5 satır; seçenek: 223/2-b · 223/2-e · terditli (önce beraat, olmazsa 160 ve HAGB) ·
  duygusal.
- **H2_08 Son söz:** Arda'nın cümlesi (seçilen): "Bir cüzdan buldum. Sahibine ulaştırmak istedim. Becerememişim; ama
  çalmadım." · ağlayarak af · susmak.
- **H2_HUKUM → R_KARAR.**

### Uygulamada eklenen sahneler (süre ve derinlik için, hikâyeye bağlı)
- **INV_TERMINAL:** Kent Ulaşım kayıp eşya bürosu (“cumartesi 09.00”) ve hareket memurunun “olay klasörü” — tam kaydın varlığına ikinci
  bir yol; Recep’in iki tutanağı.
- **Sahne sonrası anlar:** Görükle’de başka bir şoförün bir şemsiyeyi “yarın kayıp eşyaya” diye kabine atması (kuralın uygulanmayışı,
  ayna sahne); Ozan’ın mutfakta sabahı anlatması; Melek Hanım’ın “saklamak bizim işimiz”i; Cemil Usta’nın ters ibraz alışkanlığı.
- **1. celse:** savcının sanığa üç sorusu (kira borcu, çanta, “dokuzu beklemek”), itiraz zamanlaması kararı.
- **Ara:** tam kaydın gece yarısı Leyla’ya telefonla anlatılması; teknisyenle, Ozan’la ve Görükle karakolunda memurla görüşmeler; büroya
  habersiz gelen Hayri Bey (“yanlış kapı”); Zehra’nın annesine söylemesi; duruşmadan önceki gece ilk cümle.
- **2. celse:** kaydın duruşmada seçilerek izletilmesi; şoför çözüldükten sonra koridorda Recep–Arda karşılaşması; ek savunmada
  142/2-b ile birlikte TCK 160 yönünden de hatırlatma; savcının ek savunmaya sorusu; hüküm öncesi iç ses.

### Epiloglar (OutcomeDef.epilogue, her biri ~200–350 sözcük)
- **BERAAT_B:** Adliye merdiveni, yağmur dinmiş. Gülten Hanım Arda'ya fotoğrafı gösterir: "Yerinde. Sen dokunmamışsın."
  Bşk. Orhan'ın kısa telefonu: altı dosya kapandı. Leyla'nın çekmecesi açılır: otuz yılın kayıp eşyaları. "Bunları niye
  saklıyorsun?" "Sahipleri dönmedi. Ama dönebilirlerdi." Son kart: "Kenan ve Sevda T. hakkında kamu davası açıldı."
- **BERAAT_E:** Arda serbest; ama koridorda bir ses: "Şüpheden yararlandı." Zehra annelerini arar. thought: *"Beraat bir
  kapıyı açar. Işığı yakmaz."* Kartları kimin kullandığı dosyada "faili belirlenemedi" olarak kalır.
- **NITELENDIRME (TCK 160, HAGB):** Arda'nın sicili temiz kalır ama "denetim süresi" kelimesini öğrenir. Gülten Hanım uzlaşmaya
  yanaşmamıştır. thought: *"Ne beraat ne mahkûmiyet. Bir askıda kalış. Beş yıl."*
- **MAHKUMIYET:** Ertelenmiş hapis; öğretmenlik ataması kapanır. Sahafın camında "ELEMAN ARANIYOR" yazısı silinmez.
  Çöküşte hâkimin "Müdafi, bir dahaki sefere hazırlıklı gelin" cümlesi.
- **IKRAR (etik):** Arda HAGB alır; ama "suçu kabul ediyorum" cümlesi tutanakta kalır. Leyla, Deniz'in masasına meslek kuralları
  kitapçığını bırakır ve hiçbir şey söylemez. Zehra büronun kapısını kapatır.

## 6. Ters köşeler ve ekilen ipuçları

1. **Kayıt eksik (1. evre):** ekilen ipuçları — otobüste dört kamera; CD formunda "4 kanal" kaynak dosyası; bozuk 18.43
   segmenti; prologdaki kırmızı kayıt lambası.
2. **Kartları başkası kullandı (1. evre, ama "suç ortağı" okumasına açık):** cüzdanın boş gelmesi; banka dökümündeki 18.49
   Altıparmak saati; CD'nin son karesindeki "Sıradaki durak: Beşevler"; prologdaki büfe sesi.
3. **Teslim niyeti (1. evre + ARA):** sarı not (emanette), 153 araması (telefon), Facebook mesajı (telefon; ARA'da Gülten
   tarafında okunur), şoför çıkartması (otobüs), Recep'in tedirginliği.
4. **Yankesici çift (ARA, tam kayıt):** Hayri'nin "gri kapüşon"u (parka); prologdaki ıslak eldiven ve "şifremi unuttum"; büfe
   fişinin arkasındaki "yeşil bere"; Bşk. Orhan'ın Hat 38 dosyaları (2. celse).

## 7. Mekanik bağları (özet; ayrıntı `docs/content/kayip-cuzdan.md`)
- Arama sahneleri: otobüs, öğrenci evi, büfe (3). Belge: emanet, CD günlüğü, banka, tam kayıt, 153 kaydı (5).
- Çıkarım tahtası: birinci evrede 6 tarif + çeldiriciler; ARA'da 4 tarif daha (toplam 10).
- Görüşme: Arda (konular olgulara bağlı açılır); konuşmalar: Hayri, Recep, Zehra, Cemil ×2, Gülten.
- Tanık ifadesi: Hayri (1. celse), Volkan ve Recep (2. celse); itirazlar (telkin, kanaat, duyum).
- Gecikmeli delil: dilekçe → ARA girişinde tam kayıt ve 153 kaydı; Ozan 2. celsede.
- Mentor: INV_LEYLA (günde bir), ARA_LEYLA.
