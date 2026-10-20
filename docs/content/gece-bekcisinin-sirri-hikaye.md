# Dava #07 — Gece Bekçisinin Sırrı · Hikâye Kitabı (v2, noir)

> Bu belge v1 içeriğinin (34 node, 1.154 kelime; "hikâye kılığında hukuk sınavı") yerini alan **anlatı çıtasıdır**. Diğer 14 dava bu belgenin yapısını ve yoğunluğunu örnek alır. Hukuki gerçek, deliller, sonuç koşulları ve puan mantığı `docs/content/dava-07.md` ve `docs/legal/dava-07.md`'de kalır; bu belge onları **sahneye** çevirir.

## 0. Ton ve kurallar

- **Noir dram.** Bursa, mart sonu, yağmur. Karanlık, ağırbaşlı, kuru ve seyrek mizah. Her sahnede bir duyusal ayrıntı olur: ıslak asfalt, florasan vızıltısı, demlik buharı, kelepçe şıkırtısı.
- **İç ses.** Deniz, `style: "thought"` ile birinci tekil şahıs, kısa ve keskin cümlelerle anlatır. Klasik noir anlatıcı gibi gözlemler ve sezer, ama hiçbir zaman çözümü söylemez.
  - Örnek: *"Bursa'da yağmur iki şey getirir: çamur ve müvekkil."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Karakterler madde numarasıyla konuşmaz.
  - Madde numaraları yalnızca şu yerlerde geçer: Leyla'nın kısa açıklamaları, `quality.feedback`, rapor ve hüküm metinleri, duruşma tutanağı dili (savcı, başkan).
  - Deniz mahkemede hukuk dili kullanır; ofiste ve sokakta insan gibi konuşur.
- **Gizem korunur.** Soğuk açılışta sesler isimsizdir (`speaker: "narrator"`, `name: "BİR SES"` / `"İKİNCİ SES"`). Murat'ın fail olduğu oyuncuya hiçbir zaman söylenmez; oyuncu bunu delillerden kendisi kurar.
- **Her sahne bir şey değiştirir.** Yeni bilgi, yeni şüphe, ya da bir ilişkide kırılma. Salt bilgi aktaran sahne yoktur.
- **Satır kuralları:**
  - Bir satır en fazla ~220 karakter; uzun konuşmalar birden fazla satıra bölünür.
  - Her yeni mekânda ilk satır `style: "card"` + `bg` ile açılır: `"ÇARŞAMBA 21.40 — ARSLAN HUKUK, BURSA"`.
  - Sert anlarda `fx` kullanılır: kapı çarpması `shake`, flaş ya da şimşek `flash`, bölüm sonu `fade`.
- **Kelime bütçesi:** tipik yol (BERAAT_E) **14–18 bin kelime**; tüm dallar toplamı ~22–26 bin. Süre: okuma (~180 kelime/dk) + karar ve bulmaca süresi = 95–115 dk.

## 1. Kadro: sesler, sırlar, yaylar

| Karakter | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **Deniz Arslan** (oyuncu) | 31, büroda üçüncü yılı. İlk ağır ceza dosyası. | Kısa, alaycı iç ses; dışarıda nazik ama inatçı. | Bir yıl önce kaybettiği ilk davayı (bir hırsızlık, müvekkil sonradan suçsuz çıktı) unutamıyor. Bu dosya bir rövanş. | Kuşku → kararlılık. Sonunda "kazanmak" ile "doğruyu bulmak" arasındaki farkı öğrenir. |
| **Leyla Erdem** (mentor) | 58, büronun kurucusu. Otuz yıl ağır ceza. | Az konuşur; her cümlesi bir ders. Sigarayı bıraktı ama paketi hâlâ masada duruyor. | Masasında, ters çevrilmiş çerçevede yıllar önceki bir müvekkilin fotoğrafı var (Dava #15'e tohum; burada yalnızca ima). | Deniz'i izler, kurtarmaz. Etik çizgide sert. |
| **Kerem Aydın** (müvekkil) | 24, Depo 1 işçisi. Sabıkasız. | Az ve çekingen konuşur; "abi/abla" der. Güvendikçe açılır, sert tonla kapanır. | Annesinin ilaç borcu var. **Bütün fişleri saklar**, çünkü annesinin masraf defterini tutar; mazeret fişinin cüzdandan çıkmasının sebebi budur. Murat'a "abi" diye bağlıdır, onu ele vermek istemez. | Saflık → hayal kırıklığı (Murat'ın onu kullandığını anlar). |
| **Saniye Aydın** (anne) | 52, okul temizlik görevlisi. | Ağır, dua eder gibi konuşur; gururlu. | Avukat ücretini bilezik bozdurarak bir zarfa koymuş. | Umut taşıyıcısı. Sonuç sahnelerinde duygusal çapa. |
| **Hüseyin Tan** (mazeret tanığı) | 67, depodaki çay ocağının işletmecisi. | Atasözleriyle konuşur, çay koymadan söze girmez, sözü dolandırır. | Çay ocağı firmanın izniyle duruyor; "şirkete laf gelirse ocağı kapatırlar" diye korkuyor. İlk ziyarette tanıklıktan kaçar. | Korku → cesaret. Duruşmaya gelişi bir kahramanlık anıdır. |
| **Selin Kaya** (görgü tanığı) | 29, özel güvenlik görevlisi. | Kısa, savunmacı, hep resmî; kendini "görevimi yaptım" ile korur. | Murat'ın gizli nişanlısı. Yüzüğü zincirle boynunda taşıyor. Vardiya saatini sonradan değiştirdi. Uykusu yok. | Yalan → çözülme. Kötü değil, kapana kısılmış biri. Kürsüdeki kırılma oyunun dorukta duygusal anıdır. |
| **Murat Koç** (gerçek fail) | 36, Depo 3 işçisi. | Sıcak, esprili, "kardeşim" diye hitap eder. Gülerken gözleri gülmez. | Tefeci Kara Ziya'ya borçlu (Ziya hiç görünmez, yalnızca telefon ve ima). Kerem'i bilerek seçti. | Dost maskesi → tehdit → kaçış (Gemlik limanı, ara evresinde). |
| **Kom. Yusuf Er** | 50, yorgun komiser. | Kısa ve bıkkın; "dosya belli" der. | Kolay çözümü seçtiğini içten içe biliyor. | Ara evresinde Deniz'e gayriresmî bir ipucu verir (vicdan anı). |
| **Savcı Cem Toprak** | 40 | Keskin, adil ama acele eder. | — | Doğru delil karşısında görüşünü değiştirebilen bir rakip. |
| **Başkan Nevzat Ural / Üye Ayşe Demir** | heyet | Başkan resmî ve sabırlı; Ayşe Demir'in soruları kısa ve öldürücüdür. | — | — |
| **Zeynep Kılıç** (kâtip) | 26 | Yorgun, bürokratik, zamanla yardımsever. | — | Emanet incelemesinde Deniz'e "beş dakika daha" verir. |
| **Ali Çetin** (gardiyan) | 45 | Az konuşur. | Kerem'i sever: "Bu çocuk buraya ait değil." | — |
| **Dr. Kaan Öz** (bilirkişi) | 48 | Teknik, dürüst. | — | — |

## 2. Yapı (bölümler ve node haritası)

Yeni node'lar **[YENİ]** ile işaretli. Mevcut node kimlikleri, golden path ve validator uyumu için **korunur**; içleri yeniden yazılır.

```
PR_00  Soğuk açılış (gece 23.04)                          [YENİ] STORY   → PR_01
PR_01  Sabah 08.05: depo, anahtar, gözaltı                [YENİ] STORY   → BR_00
BR_00  Bölüm 1 · DOSYA: Saniye büroda (yağmurlu akşam)    [YENİ] STORY   → BR_01
BR_01  Leyla dosyayı devreder (ceza aralığı sorusu)                STORY
BR_02  Dosya ekranı + strateji                                     STORY   → INV_HUB
INV_*  Bölüm 2 · SORUŞTURMA (3 gün × 3 EP)                         mevcut + zenginleştirilmiş
INV_DAY_END → gün sonu akşam sahneleri (gün 1, gün 2; koşullu bloklar)
INV_GECE  Duruşmadan önceki gece                          [YENİ] STORY   → C_00
C_00…C_06H  Bölüm 3 · BİRİNCİ CELSE: açılış → Selin'in çapraz sorgusu
C_ARA   Mahkeme ara verir; delil talepleri, 1 hafta erteleme   [YENİ] COURTROOM/STAGE → ARA_HUB
ARA_HUB Bölüm 4 · ARA: 2 gün × 2 EP                       [YENİ] INVESTIGATION
  ARA_SELIN  Adliye merdivenleri, Selin'le yüzleşme       [YENİ] DIALOGUE
  ARA_YUSUF  Komiserle çay (vicdan ipucu)                 [YENİ] DIALOGUE
  ARA_HUS    Hüseyin'e gözdağı verilmiş                   [YENİ] DIALOGUE
  ARA_LIMAN  Gemlik limanı, Murat kaçıyor                 [YENİ] SCENE/CHOICE
  ARA_KEREM  Kerem'e gerçeği söylemek                     [YENİ] DIALOGUE
C_07…C_13  Bölüm 5 · İKİNCİ CELSE: Hüseyin → anahtar → iz → kolluk ifadesi → mütalaa → esas savunma → son söz
C_14 → R_KARAR → EPİLOG (sonuca göre koşullu satırlar; RESULT öncesi STORY)   [YENİ] EP_*
```

- **Neden ara evresi?** v1'de duruşma tek oturumda bitiyordu. Lineup "1. ile 2. celse arası yeni deliller, Murat ve Selin'in hesaplaşması" istiyor. Mahkemenin delil toplamak için ara vermesi usulen olağan. Hesaplaşma, kaçış ve gözdağı burada yaşanır; oyun süresi de dramatik olarak doğal biçimde uzar.
- **Ara evresindeki delil akışı:** DNA, kamera raporu ve HTS gibi delillerin bir kısmı ara evresinde gelir. Böylece ikinci celseye "yeni silahlarla" girilir. Mekanik bağlantılar (bayraklar ve tetikleyiciler) yeniden yazımda kurulur. Sonuç koşulları korunur, gerekirse eşikler ince ayarlanır ve `docs/content/dava-07.md`'ye işlenir.

## 3. Sahne sahne

> Kelime sayıları hedeftir (± %20). Her sahnede örnek satırlar tonu tarif eder; aynen kullanılabilir.

### PR_00 — Soğuk açılış · "GECE 23.04" (~450 kelime) · bg: sokak_gece → depo_gece
Her şey karanlıkta. Konuşmacılar isimsiz.

- `card`: "12 MART · GECE 23.04 — NİLÜFER, DEPO SOKAĞI"
- narrator: "On dört numaralı direğin ampulü üç gündür yanmıyordu. Kimse şikâyet etmemişti. Karanlık, bazılarının işine geliyordu."
- Bir minibüsün kapısı kapanır (`fx: shake`). Islak asfaltta bot sesleri. Bir izmaritin kor ucu yanar, söner.
- `phone`, BİR SES: "Bitti mi?" — anlatıcı sesin kime ait olduğunun seçilmediğini söyler (cinsiyet, meslek, monitör, defter **yok**).
- `phone`, İKİNCİ SES: "Bitti."
- BİR SES: "Ya biri sorarsa?"
- İKİNCİ SES (uzun bir sessizlikten sonra): "Kimse sormaz. Bu sokakta kimse bir şey sormaz."
- narrator: "Hat kesildi. İzmarit çöp kutusunun dibine düştü ve tısladı." `fx: fade`

> **v3 (inceleme sonrası):** Önceki sürümdeki "monitörde sinyalin gittiğini gördüm, deftere yazmam lazım" (güvenlik görevlisini ele veriyordu) ve
> "turuncu montlu birini gördün… sen kimi gördüğünü bilirsin" (teşhisin dikte edildiğini söylüyordu) satırları çıkarıldı. Telefonun
> anlamı ancak C_06H'de Selin'in itirafıyla ("O gece aradı. 'Bitti' dedi…") ve CMK 135/6 kaydıyla (23.05, 6 dk) kazanılır. "Kimse sormaz"
> davanın nakaratıdır ("kimse sormadı") ve hiçbir şüpheliyi göstermez.

### PR_01 — "SABAH 08.05" (~500 kelime) · bg: depo → karakol
- Hırsızlık fark edilir; polis gelir; işçiler avluda toplanmıştır.
- Önce Murat kalabalıktan kısa bir cümleyle suçlar: "Gece Depo 3'ün orada Kerem dolaşıyordu, ben gördüm." Bütün başlar Kerem'e döner.
- Sonra Selin, görevi bitmiş olduğu halde kulübeden çıkar, Kerem'in çantasını elinden alır ve anahtarı havaya kaldırır: "Bu ne o zaman?" (`fx: flash`).
  Sıra önemlidir: bir iş arkadaşı suçlar, güvenlikçi arar; doğal görünür. Selin'in doğrudan çantaya yürümesi ve Murat'ın "fazla uzun kalan
  parmakları" (v2) bağlantıyı erkenden ele verdiği için kaldırıldı.
- Murat Kerem'in omzunu sıkar: "Korkma. Yanlış anlaşılmadır, düzelir." (Ara evresinde Kerem bu ânı kendisi hatırlar.)
- **Gözlem seçimi [v3]:** avlu donar; oyuncu "çamurdaki çanta / komiserin kâğıdı / kalabalığın yüzleri"nden birine bakar (PR01_*). Seçim
  `pr_bakis` değişkenine yazılır ve INV_SABAH'ta Deniz'in dosyadan (fotoğraf, tutanak, avlu kareleri) hatırladığı bir ayrıntı olarak geri döner.
- Kerem: "Abi ben… ben sadece top taşıdım…" Kelepçe sesi.
- `card`: "KARAKOL, 09.30" (PR_01B). Kerem'in müdafisiz ifadesinden tek bir cümle: "19.30'da Murat abinin isteğiyle Depo 3'e top taşıdım." Oyuncu bunu fark edebilir; daha sonra hem silah hem tehlike olur.
- narrator: "Üç gün sonra tutuklandı. İki ay sonra iddianame. Bir celse sonra, annesi bir avukat aradı."

### BR_00 — Bölüm 1 · DOSYA · "Saniye Hanım" (~900 kelime) · bg: buro_gece
- `card`: "ÇARŞAMBA 21.40 — ARSLAN HUKUK, BURSA". Yağmur camda.
- Deniz (thought): "Bursa'da yağmur iki şey getirir: çamur ve müvekkil."
- Saniye ıslak bir naylon poşetle girer. İçinde oğlunun nüfus cüzdanı, maaş bordrosu, bir çay ocağı fişi ve bir zarf var.
- Duygusal çekirdek:
  - "Benim oğlum hırsız değil avukat hanım. Sigara bile içmez."
  - Zarfı masaya koyar: "Bileziklerimi bozdurdum. Yetmezse taksit…"
- Oyuncu seçimi (puanı yok, ilişki etkisi var):
  - "Zarfı sonra konuşuruz." → `trust` +4. Saniye, Kerem'e bir mektup verir; görüşmede güven bonusu.
  - "Ücret tarifesini anlatayım." → nötr.
  - "Söz veremem, ama elimden geleni yaparım." → +2, dürüstlük.
- Leyla kapıda belirir; Saniye gidince Deniz'e: "Annelerin gözüne bakarak söz verme. Dosyaya bakarak ver."
- Fişe bakış (thought): "22.57. İki çay, bir tost. Hırsızlık saati: 23.00. Ya bu fiş bir şey, ya da hiçbir şey."

### BR_01 — Leyla dosyayı devreder (~600 kelime) · bg: buro_gece
- Ceza aralığı sorusu kalır, ama sahnenin içinde sorulur.
  - **v3:** Kartta "TCK 142/2-h, 143" ve aralık yazdığı için soru artık kartın cevaplamadığı şeyi sorar: "Kapakta iki madde var: 142/2-h ve
    143. İkincisi ne yapar? Gece vakti cezaya ne olur?" Seçenekler: yarısına kadar artırılabilir (doğru, TCK 143/1) · üçte bir oranında ·
    gece ayrı suç sayılır, cezalar toplanır · alt ve üst sınır iki katına çıkar. Etiketler benzer uzunlukta.
  - Doğru cevapta Leyla: "Bu heyet gece hırsızlığında genelde yarıyı uygular. Alt sınırdan bile kurulsa, müvekkilin yedi buçuk yıl konuşuyor." ve sigara paketini çevirir.
  - Yanlış cevapta kısa, sert bir ders verir.
- İma (thought): Leyla'nın masasındaki ters çerçeve. "Hiç sormadım. Sormamam gerektiğini biliyordum."

### BR_02 — Dosya ekranı + strateji (~250 kelime) · mevcut bloklar
Blokların metinleri sadeleşir. Strateji seçimini Leyla tek bir cümleyle karşılar:
- Masumiyet → "Cesur. Bütün delilleri yıkman gerekecek."
- Usul → "Polisin aceleciliği bazen en iyi tanığındır."
- İndirim → "Güvenli. Ama müvekkiline masum olmadığını mı söyleyeceksin?"

### Bölüm 2 · SORUŞTURMA (INV_*), toplam ~5.500 kelime

**INV_HUB:**
- Giriş satırları kısa bir durum/hedef kutusudur:
  - gün 1: "Hedef: Kerem'in o gece nerede olduğunu kanıtla; teşhisin neye dayandığını bul."
  - gün 2: "Hedef: çizelgedeki saatler ve ışık. Selin neyi görebilirdi?"
  - gün 3: "Hedef: dilekçe son gün. Duruşmada kimi ve neyi istiyorsun?"
- Hedef metni bayraklara göre değişir (koşullu bloklar).
- `quickTalk` satırı da son görüşmeye göre değişir.

**INV_GORUSME — Cezaevi görüş odası (~1.600 kelime) · bg: gorus_odasi**
- `card`: "BURSA H TİPİ CEZAEVİ — AVUKAT GÖRÜŞ ODASI". Ali Çetin kapıyı açar: "Yarım saatte bir bakarım. Konuşmanızı duymam."
- Kerem ilk görüşte kısa cevaplar verir, ellerine bakar. Saniye'nin mektubu verildiyse okur, gözleri dolar: güven +.
- Konular aynı kalır (o gece, anahtar, Hüseyin abi, kendisi); her biri 2–4 satırlık insani bir cevaba dönüşür.
  - "Hüseyin abi": "Fişi ben saklarım abla. Annemin defterine yazıyorum, her kuruşu. İlaç parası…"
  - "O gece" (sert): "Murat abi çağırdı. Abi derim ona. Bana bir şey olmaz derdi…" Bu cevap şüpheyi besler.
- Bot izi sunumu (güven ≥40):
  - Kerem önce sessiz kalır, sonra: "Benim ayağım 39. … Murat abi o gece Depo 3'teydi. Söylemedim, çünkü… o beni işe aldırdı."
  - Bu sahne ilk büyük kırılmadır (`fx: shake` yok, sessizlik var).
- Tekrar ziyarette Kerem "Annem nasıl?" diye sorar; kısa bir sahne.

**INV_ARAMA — 13 Mart fotoğraf albümü:** Her bulguda Deniz'in iç sesiyle bir yorum gelir.
- Ampul: "Üç gündür yanmayan bir lambanın altında yirmi metreden yüz seçilir mi?"
- İz: "28,5 santim. Kerem'in ayakkabısı bunu dolduramaz."
- Iska: "Hiçbir şey. Bazen fotoğraf sadece fotoğraftır."

**INV_INCELEME — Adliye emanet bürosu (~500 kelime) · bg: adliye**
- Zeynep Kılıç bıkkındır: "Yarım saat. Dokunmak yok, eldiven var."
- UV anı dramatik bir ifşadır: Selin satırında silinmiş "18.00–24.00" UV ışığında belirir (`fx: flash`). thought: "Biri saatini sonradan değiştirmiş. Ve o biri, bu dosyanın tek görgü tanığı."
- Zeynep, Deniz'in heyecanını görüp "Beş dakika daha" der.

**INV_T_HUS — Çay ocağı (~700 kelime) · bg: cay_ocagi**
- Hüseyin önce çay koyar: "Önce çay. Söz, çaydan sonra gelir."
- Korkusunu dolaylı anlatır: "Şirket bu ocağı bana kırk yıllık hatırına verdi. Mahkemeye gidip şirketin işçisini aklarsam, şirketin bekçisini yalancı çıkarırım."
- Seçimler:
  - "Tanık bildir" → ikna sahnesi. "Kerem'in annesi bileziklerini bozdurdu." Hüseyin susar, sonra: "Rulo kasada. Getiririm."
  - "Yazılı beyan yeter" → kolay ama zayıf yol.

**INV_T_SEL — Güvenlik kulübesi (~600 kelime) · bg: depo**
- Selin kulübeden çıkmaz, camın arkasından konuşur. Boynundaki zinciri sürekli düzeltir.
  - thought: "Zincirin ucunda bir şey var. Saklıyor."
- "Görüşme iste" → "Mahkemede konuşurum." Kapıyı kapatır (`fx: shake`).
- "Baskı yap" → Selin ağlamaz, sertleşir. Etik ihlal geri bildirimi aynen kalır; ayrıca Leyla akşam bunu öğrenir ve soğuk bir sahne yaşanır.

**INV_T_MUR — Depo 3 kapısı (~600 kelime) · bg: depo**
- Murat sıcak ve yardımseverdir: "Avukat hanım! Kerem kardeşim için ne lazımsa. Benim için de zor, inan." Sigara yakar.
- Yalanı rahattır. Ayrılırken: "Bu işler uzadıkça, insanlar konuşur. Konuşan insanlar da… bazen yanlış şeyler söyler." Gülümser.
- Geri bildirim aynı kalır (olası faili uyardın). Bu ziyaret, ara evresinde Hüseyin'e gözdağı verilmesini **tetikler**.

**INV_DAY_END — Akşam sahneleri (~350 kelime/gün) · bg: buro_gece**
- Gün 1: Leyla ile kısa bir sahne. Deniz'in o güne dair notları (koşullu): "Bugün öğrendiğin en önemli şey neydi?" Puanı yok; seçim iç sese yansır.
- Gün 2: Telefon çalar, numara gizli (`phone`, BİR SES): "Avukat hanım, bazı dosyalar açık kalınca soğuk algınlığı yapar." Hat kapanır. Yalnızca Murat ziyaret edildiyse ya da Selin'e baskı yapıldıysa gelir.
- Gün 2 (alternatif): Saniye arar, Kerem'in mektubuna cevap yazdığını söyler.

**INV_GECE — Duruşmadan önceki gece (~400 kelime) · bg: buro_gece → sokak_yagmur** [YENİ]
- Deniz panoyu toparlar; elindeki deliller koşullu satırlarla sayılır.
- Kapının altından bir not: "Bazı kapılar açık kalmasın." (`fx: flash`, şimşek).
- Leyla: "Yarın tanık kürsüde ne görürse, sen de onu gör. Ne istediğini değil."

### Bölüm 3 · BİRİNCİ CELSE (C_00–C_06H), ~2.800 kelime · bg: durusma_salonu
- `card`: "BURSA 4. AĞIR CEZA MAHKEMESİ — 2. CELSE". Rıza Bey davayı çağırır: "Kerem Aydın davası!"
- Mevcut aşama içerikleri korunur; her aşamaya 2–4 satır insan katmanı eklenir:
  - Kerem salona girerken annesini arar gözleriyle.
  - Savcı sertçe başlar.
  - Selin yemin ederken eli titrer.
  - Murat dinleyici sırasındadır ve bacak bacak üstüne atar; bu yalnızca bir kez anlatılır, rahatsız edicidir.
- **Selin'in çapraz sorgusu doruk noktasıdır.**
  - Çelişki sunumlarında Selin'in cevapları kısalır, cümleleri bölünür.
  - HTS ile C_06H'de kırılma:
    > SELİN: "…Murat. Nişanlım. 'Kerem'di de' dedi. Ben… ben görmedim. Karanlıktı. Hiçbir şey görmedim."
  - Salon uğuldar, başkan tokmak vurur (`fx: shake`). Murat dinleyiciler arasından kalkar ve çıkar.
  - Bu çıkış ara evresinin motorudur.
- Kırılma olmazsa (HTS yoksa): Selin ayakta kalır, ama Ayşe Demir'in sorusu ("Ana kapıdan arka sokak görünür mü?") onu sarsar.

### C_ARA — Mahkeme ara verir (~400 kelime) [YENİ]
- Başkan, istenen delillerin (DNA, kamera bilirkişisi, belediye kaydı) gelmesi için bir hafta erteleme kararı verir. Tutukluluk incelenir.
  - Kerem'in tutukluluğuna devam: daha karanlık bir ara.
  - Lehe yeterli bulgu varsa tahliye talebi kabul edilebilir: Kerem dışarıda bekler, annesiyle sahne.
  - Bu, ara evresindeki diyalog seçimlerini değiştirir.
- Murat'ın salondan çıkışı kayıtlara geçer; Selin hakkında suç duyurusu yapıldıysa savcı not alır.

### Bölüm 4 · ARA (ARA_HUB, 2 gün × 2 EP), ~3.000 kelime [YENİ]
**ARA_HUB:** Hedef kutusu: "Bir hafta. Murat'ın nerede olduğunu, Selin'in ne kadar söyleyeceğini ve Hüseyin'in gelip gelmeyeceğini bilmiyorsun."

**ARA_SELIN — Adliye merdivenleri, yağmur (~800 kelime) · bg: adliye**
- Selin şemsiyesiz bekliyor. Tanıkla görüşme sınırı korunur: Deniz ifadeyi yönlendirmez, ama Selin konuşmak ister.
- Seçimler:
  - "Avukatın olmadan konuşmamalısın" → etik doğru. Selin şunu söyler: "Murat Gemlik'e gidiyor. Bir gemide tanıdığı var." Bu, liman ipucunu açar.
  - "Ne biliyorsan anlat, kayda geçireyim" → etik sınır uyarısı (Leyla'nın dersi), ama bilgi yine gelir. Küçük bir ceza.
  - "Seni de içeri atarlar" → Selin kaçar, ipucu yok.
- Yüzük sahnesi: zinciri çıkarıp avucunda tutar. "Bunu bana o gece verdi. 'Bitti' dediği gece."

**ARA_YUSUF — Karakol önünde çay (~600 kelime) · bg: karakol**
- Komiser başta duvardır. Deniz'in elindeki bir bulguya (UV, iz ya da HTS) göre çözülür.
- "İzmariti emanete ben koydum. Gönderin dedim, gerek yok dediler. … Ben demedim bunu, avukat hanım."
- DNA talebi yapılmadıysa bu, son şanstır: mahkemeye ek talep seçeneği açılır.

**ARA_HUS — Çay ocağı kapalı (~500 kelime) · bg: cay_ocagi**
- INV_T_MUR ziyaret edildiyse: ocağın camı kırık, Hüseyin korkmuş. "Gece biri geldi. 'Dede, mahkemede ağzını aç da gör' dedi."
- Seçimler: "Kolluğa koruma talebi + mahkemeye bildirim" ya da "Gelmezsen anlarım."
  - Gelmezsen anlarım → Hüseyin kendisi karar verir. Güven yeterliyse "Ben kırk yıl bu kapıda korkmadım" der ve gelir. Duygusal bir zafer.

**ARA_LIMAN — Gemlik limanı, gece (~600 kelime) · bg: liman_gece** (Selin'in ipucuyla açılır)
- Deniz limana tek başına gitmez. Seçim:
  - "Savcılığa bildir" → doğru yol. Murat yakalanır; ikinci celsede savcı "şüpheli yakalandı" der ve bu, BERAAT_B'nin mütalaasını besler.
  - "Kendin git" → tehlikeli. Konteyner arasında Murat ile kısa bir yüzleşme:
    > MURAT: "Kardeşim'e iyi bak avukat hanım. O benim kardeşim gibiydi."
    > DENİZ: "Kardeşini sattın."
    - Murat kaçar, etik ve güvenlik ihlali yoktur ama bir işaret kaybedilir. Dramatik ama zararlı bir seçim.
  - "Bırak, bu benim işim değil" → Murat kaçar; dosya sanığın beraatine odaklanır.

**ARA_KEREM — Kerem'e gerçeği söylemek (~500 kelime) · bg: gorus_odasi (tutukluysa) / ev (tahliyeyse)**
- Murat'ın onu kullandığını öğrenir. "Bana 'kardeşim' derdi…"
- Ek savunma için hazırlık: Kerem'e ne söylemesi gerektiğini değil, **doğruyu söylemesini** tavsiye etmek. C_02'deki seçimlerin bir provası olur ve güveni etkiler.

### Bölüm 5 · İKİNCİ CELSE (C_07–C_13), ~2.600 kelime · bg: durusma_salonu
- `card`: "BİR HAFTA SONRA — 3. CELSE".
- Hüseyin'in girişi: salonda sessizlik. Fişi titreyen elle uzatır. Hüseyin gelmediyse boş tanık kürsüsü anlatılır.
- Anahtar, parmak izi ve kolluk ifadesi aşamaları aynı kalır; savcının itirazları ve başkanın tepkileri daha canlıdır.
- Mütalaa varyantları korunur. Murat yakalandıysa savcı: "Dosyaya yeni bir şüpheli eklenmiştir."
- Esas savunma (C_12): oyuncunun seçtiği savunmanın **metni** Deniz'in ağzından 3–5 satırlık bir konuşma olarak okunur. Seçim yalnızca etiket olarak kalmaz.
- Son söz (C_13): Kerem'in seçilen cümlesi tam sahne olarak oynar.

### C_14 → EPİLOGLAR (her biri ~350–450 kelime) [YENİ: EP_* STORY node'ları, DECISION'dan RESULT'a giderken]
- **BERAAT_B:** "TÜRK MİLLETİ ADINA…" Kerem salondan çıkar, yağmur dinmiştir. Saniye ile sarılma. Selin koridorda başı önünde bekler; Deniz'e "Teşekkür ederim" der. Deniz susar. Leyla çerçeveyi çevirir, ilk kez Deniz'e bakarak: "Bir gün bunu konuşacağız." (Dava #15 tohumu.) Son kart: "Murat Koç hakkında soruşturma başlatıldı."
- **BERAAT_E:** Kerem serbest kalır, ama koridorda bir fısıltı: "Şüpheden yararlandı." Murat'ın yeri bilinmez. thought: "Bazen adalet bir kapıyı açar, ama ışığı yakmaz."
- **İNDİRİM:** Ring aracının arka camı. Kerem elini cama koyar. thought: "Yedi buçuk yerine altı yıl üç ay. Kazanmak buysa, neden bu kadar ağır?"
- **MAHKÛMİYET:** Saniye'nin poşeti, içinde hâlâ fiş. Deniz fişi alır. thought: "22.57. Bir fiş, bir insanı kurtarmaya yetmedi. Ben yetmedim."
- **İKRAR:** Leyla, Deniz'in masasına etik kurul yönetmeliğini bırakır ve hiçbir şey söylemez. Kerem'in son bakışı.
- **ÇÖKÜŞ:** Salon boşalır. Savcı dosyasını toplarken: "İyi bir avukat olacaksınız. Bugün değil."

## 4. Karar ve mekanik bağları (yeniden yazım için kontrol listesi)

- Mevcut sonuç koşulları, golden path'ler ve puan tabloları korunur. Yeni node'lar puanı çoğunlukla değiştirmez; ara evresi ve epiloglar ilişki bayrakları (`trust`, `huseyin_will_attend`, `murat_caught`, `selin_hint_liman`, `kerem_released`) ve küçük, adil puanlar ekler.
- Ara evresi yeni bayrakları sonuçlara ve hükümlere **metinsel** olarak yansıtır. Sonuç *koşulları* yalnızca gerektiği kadar değişir; her değişiklik `docs/content/dava-07.md` A.6 ve A.7'ye işlenir.
- Golden path'ler G1–G5 ve W, yeni node'ları geçecek biçimde güncellenir. Beklenen skorlar yeniden ölçülür ve plan A.7'ye yazılır.
- `npm run validate:cases` sonucu: PASSED, %100 kapsam, softlock ve sızıntı yok.
- Anlatı ölçümü:
  - Tipik yol (BERAAT_E golden path'inde görülen satırlar) **≥14.000 kelime**.
  - Tüm içerik ≥20.000 kelime.
  - `case:duration` ölçümü 90–120 dk.

## v3 — inceleme sonrası değişiklikler (2026-10-20)

- **Gizem:** Soğuk açılış ve sabah sahnesi yukarıdaki gibi yeniden kuruldu. BR_01B'de Selin'in kolluk ifadesi yalnızca "Uzaktan, karanlıktı,
  yüzünü tam seçemedim; turuncu iş montu." diye biter; teşhisin Murat'ın sözüyle yapıldığı ancak kürsüde S4 bastırılınca öğrenilir. Murat'la
  konuşan Deniz soğuk açılıştaki kor ucu "hatırlamaz" (bakış açısı ihlali). Telefon kayıtları istemi tarafsızdır. Ara evresinin açılışındaki
  "Murat nerede?" hedefi, Selin'in merdivende bekleyen adamın yanına koşması ve panodaki iplerin "Depo 3'ün kapısına" gitmesi yalnızca
  `murat_iz` (dayanak_murat ∨ contra_s4_hts ∨ selin_cozuldu) tutarken görünür; aksi hâlde tarafsız sürümler oynar.
- **Ara evresi sonucu belirler:** 3. celseye ancak aranın son günü gidilir. Yeni etkinlik **Duruşma tutanağını oku** (ARA_TUTANAK_1…4 →
  ARA_TUTANAK): Deniz 2. celsenin tutanağını okur; kürsüde neyi kazandığı, neyi kaybettiği kâtibin cümleleriyle geri döner; Leyla "kısa konuş"
  dersini verir. Komiserin anlatımı (ded_arama) olmadan anahtar dışlanmaz; kart kayıtları Murat'ın 00.12 çıkışını gösterir ve Kom. Yusuf'un
  Y2 beyanını doğrudan çürütür. Nişan yüzüğü + CMK 135/6 kaydı ara tahtasında **ded_nisan** ("Tanığı susturan bağ") olur; esas savunmada
  gerçek fail anlatısına bir cümle ekler.
- **Etik:** Tanığa kürsüde gözdağı, aradaki Selin'den beyan toplamak ya da onu korkutmak, kaçan şüpheliyi limanda kovalamak ve Kerem'e ezber
  son söz vermek artık etik sayacını artırır. Selin'den tutanak isteyen avukat liman ipucunu da yüzüğü de alamaz: Selin imzalamadan gider.
- **Yeni küçük sahneler:** Kerem görüşmesinde üç fotoğraftan birini gösterme (yanlışı dakika ve güven götürür); koğuşta Murat'ı soran adamın
  "Ziya abinin selamı var" diyerek başka koğuşa alınması; belediye ekip şefi Tuncay'ın kendi sprite'ı (baret, turuncu yelek); heyetin üçüncü
  hâkimi Orhan Tekin; müzakere beklerken Hüseyin ile Saniye'nin koridordaki şekeri.
