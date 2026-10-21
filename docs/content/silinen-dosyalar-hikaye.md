# Dava #13 — Silinen Dosyalar · Hikâye Kitabı (noir)

> Anlatı çıtası Dava #07 v2'dir (`docs/content/gece-bekcisinin-sirri-hikaye.md`). Delil zinciri, sonuç koşulları ve skor
> `docs/content/silinen-dosyalar.md`'de; hukuki çerçeve `docs/legal/silinen-dosyalar.md`'de. Kaynak:
> `content/src/silinen-dosyalar/` → `content/cases/silinen-dosyalar/`. Rütbe ORTAK · zorluk 4/5.

## 0. Ton ve kurallar

- **Noir dram, ekim sonu, Bursa.** Organize sanayinin gece vardiyası, yağmurun altında yanan fabrika ışıkları, florasan
  vızıltısı, soğumuş çay, sunucu odasının uğultusu. Kuru ve seyrek mizah. Her sahnede bir duyusal ayrıntı.
- **İç ses.** Deniz `style: "thought"` ile kısa, keskin cümleler kurar. Gözlemler, sezer; çözümü asla söylemez.
  Örnek: *"Bir dosya silinince gitmez. Sadece kimin elinden çıktığını unutursun."*
- **Teknik ayrıntı hikâyenin hizmetindedir.** Kayıt, imaj, özet değer (hash), oturum, cihaz adı gibi kavramlar oyuncunun
  anlayacağı sadelikte geçer; nasıl yapıldığı değil, *kimin, ne zaman* yaptığı sorulur. Hiçbir metin bir sistemi
  bozmanın ya da iz silmenin yöntemini anlatmaz.
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numaraları yalnızca Leyla'nın kısa açıklamalarında, geri bildirimde,
  rapor ipuçlarında, hüküm metinlerinde ve duruşmanın resmî dilinde geçer.
- **Gizem korunur.** Soğuk açılışta konuşan isimsizdir (`narrator` + `name: "BİR ADAM"`), yüz görünmez; bir kadroya
  eşlenebilecek hiçbir giysi, aksesuar ya da jest (yaka, saat, iç cep, zarf) gösterilmez: yalnızca eller, ekran, sesler. Genel müdürün
  sabotajı oyuncuya hiçbir zaman söylenmez; turnike kaydı, cihaz adı ve poliçe zeyilnamesi bir araya gelene kadar Tarık
  Sezer yalnızca "müşteki şirketin kibar genel müdürü"dür. Ekilen ipuçları (zarflanmış şifreler, "evrak unuttum",
  ağustosta yenilenen poliçe, aylardır arızalı denen yedek) tek başına bir şey söylemez.
- **Satır kuralları:** satır ≤ 220 karakter; her yeni mekân `style: "card"` + `bg` ile açılır; sert anlarda `fx`.
- **Etik çizgi:** avukat tanığı yönlendirmez, karşı tarafın çalışanına belge çaldırmaz, müvekkilin elindeki eski
  şifreyle sisteme girmez ya da girdirmez, şüpheliyi kovalamaz; bildiğini savcılığa yazar.

## 1. Kadro: sesler, sırlar, yaylar

| Kimlik | Kim | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| **deniz** (oyuncu) | Av. Deniz Arslan, büroda dördüncü yıl; ilk kez "ortak" imzasıyla bir dosya. | İç ses kısa ve alaycı; dışarıda nazik, inatçı. | Teknolojiden anlamadığını düşünür; bu dosyada ilk kez bir dili baştan öğrenmek zorunda. | "Kayıt yalan söylemez" → "kaydı da biri tutar". |
| **leyla** (mentor) | Av. Leyla Erdem, 58, büronun kurucusu. | Az ve öğretici; her cümlesi bir ders. Sigara paketi açılmamış durur. | Ters çerçeve (Dava #15 tohumu; yalnızca ima). Bu dosyada Deniz'i ortaklığa hazırlıyor: "Bu dosya seni tartacak." | İzler, kurtarmaz. Etik çizgide sert. |
| **selim** (müvekkil) | Selim Aktaş, 34, Nilüfer Örme Tekstil'in eski sistem yöneticisi; Eylül sonunda işten çıkarıldı. | Kısa, teknik, kuru espri; "abla" demez, "avukat hanım" der. Gerilince her şeyi yüzdeyle anlatır. | 17 Ekim gecesi 21.30'da VPN'le bağlanıp **kendi kişisel klasörünü** kopyaladı; bunu utancından ve korkusundan saklar. Genel müdürün izin e-postası telefonunda duruyor; önemini anlamamış. | Kibir → çaresizlik → güven. "Ben sisteme hep doğruyu söyledim; sistem bana yalan söyledi." |
| **gul** | Gül Aktaş, 32, ilkokul öğretmeni; Selim'in eşi. | Düzgün, öğretmen sesi; kızgınken daha da yavaş konuşur. "Kızım duymasın" der. | E-postanın çıktısını, "ileride lazım olur" diye mutfak çekmecesindeki faturaların arasına koymuş. | Dayanıklılık; sonuç sahnelerinin duygusal çapası. |
| **tarik** (gerçek fail) | Tarık Sezer, 54, Nilüfer Örme Tekstil genel müdürü ve küçük ortağı. | Sıcak, babacan, "evladım" der; golf ve ihracat benzetmeleri. Cümleyi hep bir iyilikle bitirir. | Şirket borç batağında. Ağustosta siber risk poliçesinin limitini on katına çıkardı; poliçe "çalışan kötü niyeti"ni de kapsıyor. Cuma 23.08'de yedek cihazını devre dışı bıraktı, gece 02.14'te kendi dizüstüsünden, Selim'in teslim ettiği şifreyle bağlanıp verileri sildi. | Dost maskesi → kürsüde çatlak → susma hakkı. |
| **nalan** | Nalan Korkmaz, 46, mali işler müdürü. | Hesap makinesi gibi; rakamla konuşur, duyguyu dipnota koyar. Telefonda fısıldar. | Poliçe zeyilnamesini kendisi imzaladı; neden yapıldığını sormadı. Şimdi soruyor. | Korku → tanıklık (doğru kanaldan). |
| **bulent** | Bülent Arıkan, 41, DataKale Bilişim'in sahibi; şirketin dış servis firması. | Hızlı, jargon dolu, kendinden emin; "teknik olarak" diye başlar. | Tarık'ın golf arkadaşı. İmajı olaydan iki gün sonra, kendi "kurtarma denemelerinden" sonra aldı; özet değerler raporda tutmuyor. Kötü niyetli değil, özensiz ve bağımlı. | Ukala uzman → kürsüde küçülen adam. |
| **yasar** | Yaşar Kılıç, 63, fabrika gece bekçisi. | Ağır, köylü ağzı; "beyim" der; her şeyi saatle değil ezanla, servisle anlatır. | Cuma gecesi genel müdürün siyah aracını gördü; "evrak unuttum" dediğini duydu. İşini kaybetmekten korkuyor. | Korku → tanıklık. |
| **hakan** | Kom. Yrd. Hakan Ilgaz, 39, Siber Suçlarla Mücadele Büro. | Yorgun, dürüst, kısa: "Elimize ne verdilerse onu inceledik." | Şirketin imajını sorgulamadı; Selim'in dizüstüsünü ise kurallara uygun inceledi. | Vicdan anı: ara evresinde "orijinal disklerin şirkette" olduğunu söyler. |
| **sema** | Dr. Sema Uçar, 45, mahkemenin atadığı bilirkişi (bilgisayar mühendisi). | Ölçülü, kesin; "bulgu" ve "kanaat"i ayırır. | — | İkinci celsenin tarafsız sesi. |
| **ozan** | Av. Ozan Tekin, 38, katılan şirket vekili. | Parlak, alaycı, kalabalığa oynar. | — | Rakip. |
| **ferda** | Savcı Ferda Yalın, 44. | Kuru, adil, dosyaya sadık. | — | Doğru delille görüş değiştirir. |
| **kemal** | Hâkim Kemal Oran, Bursa 9. Asliye Ceza (tek hâkim). | Sabırlı, kısa; "Müdafi, diyeceğiniz?" | — | — |
| **cevdet** | Mübaşir Cevdet. | Uzatarak çağırır; her çağrıdan sonra boğazını temizler. | — | — |

## 2. Gerçek ve kronoloji (oyuncudan saklı)

| Zaman | Olay | Oyuncu nerede öğrenir |
|---|---|---|
| Temmuz | Banka kredisi yeniden yapılandırılıyor; şirket nakit sıkıntısında. | ARA · Nalan |
| 3 Ağustos | Siber risk poliçesine zeyilname: limit 2 milyon TL'den 20 milyon TL'ye; "çalışan kötü niyeti" teminatı eklendi. İmza: T. Sezer, N. Korkmaz. | ARA · zeyilname belgesi (mahkeme yazısıyla) |
| 30 Eylül | Selim, yedekleme bütçesi tartışmasının ardından işten çıkarılır. Devir-teslim tutanağı: yönetici şifreleri "kapalı zarf içinde" Tarık Sezer'e teslim edildi. | INV · Selim'in evi (tutanak örneği) |
| 30 Eylül 18.02 | Tarık'tan Selim'e e-posta: "Kişisel dosyalarını 31 Ekim'e kadar uzaktan alabilirsin, hesabın açık kalacak." | INV · Gül'ün çekmecesi / görüşme |
| 17 Ekim Cuma 21.30–21.52 | Selim evinden bağlanır, yalnızca `Selim_kisisel` klasörünü kopyalar. | INV · oturum dökümü (21.30 satırı) |
| 17 Ekim 22.00 | Son başarılı yedekleme (yedek cihazının ekran kaydı). | INV · sunucu odası fotoğrafı |
| 17 Ekim 23.08–23.31 | Tarık'ın personel kartı idari binaya girer/çıkar; yedek cihazının kablosu sökülür. Yaşar, siyah aracı görür: "Evrak unuttum." | INV · fabrika kapısı / ARA · turnike kaydı, Yaşar |
| 18 Ekim 02.14–02.41 | Selim'in kullanıcı adıyla ikinci oturum; bağlantı bir GSM hattından, cihaz adı `NOS-GM-LT`. Dosya sunucusundaki veriler silinir. | INV · tam kayıt (dilekçeyle) / ARA · operatör cevabı |
| 18 Ekim 08.30 | Silme fark edilir; Tarık önce polisi değil DataKale'yi çağırır. | H1 · Bülent'in ifadesi |
| 18–19 Ekim | DataKale "kurtarma denemesi" yapar (diske yazar). | INV · imaj raporu eki |
| 20 Ekim | DataKale imaj alır; aynı gün suç duyurusu ve sigorta hasar ihbarı. | INV · rapor / ARA · zeyilname |
| 22 Ekim | Polis Selim'in evinde arama yapar, dizüstüsünü kurallara uygun imajlar: 21.30 bağlantısı var, 02.14 yok. | INV · emniyet inceleme raporu |
| Aralık | İddianame: TCK 244/2 ve 243/1, Bursa 9. Asliye Ceza. Önceki avukat çekildi. | BR |

## 3. Yapı ve node haritası

```
PR_00  Soğuk açılış: 02.14, isimsiz bir adam, iki el, bir ekran                      STORY
PR_01  18 Ekim 08.30 sunucu odası → 22 Ekim 06.40 arama                             STORY
BR_00  Gül büroda (ücret: sonra / sözleşme / dürüstlük)                             STORY (seçim)
BR_01  Leyla dosyayı devreder: ceza aralığı A–D                                     STORY
BR_01B "Altı kâğıt" · BR_02 dosya ekranı + strateji → INV_SABAH (fabrika önü)       STORY
INV_HUB (3 gün × 4 EP; push/$return)
  OLAY YERİ: INV_ARAMA (sunucu odası fotoğrafları) · INV_EV_G → INV_ARAMA2 (Aktaşların evi) · INV_KAPI (fabrika kapısı, sahne 3)
  MÜVEKKİL: INV_GORUSME_G_1 → INV_GORUSME (konu × ton; 21.30 konusu kayıttan açılır)
  TANIKLAR: INV_T_YASAR · INV_T_HAKAN · INV_T_BULENT · INV_T_TARIK (müşteki; ziyaret riski)
  ARŞİV: INV_LOG (oturum dökümü) · INV_IMAJ (DataKale raporu) · INV_EMN (emniyet raporu) · INV_DEVIR (tutanak) · INV_TAM (tam kayıt, dilekçeyle) · INV_DIL · INV_CIKARIM · INV_LEYLA
  INV_DAY_END → INV_AKSAM1 / INV_AKSAM2
INV_GECE_1…6 → INV_GECE (duruşmadan önceki gece)
H1_00G_* → H1_00K koridor → H1_00 açılış → H1_01 sanığa sorular → H1_02 "uzman raporu" itirazı
  → H1_03 Bülent'in tanıklığı (B1–B5) ⇄ H1_03K kırılma → H1_04 katılan vekilinin talebi → H1_05 ara karar → H1_06 koridor
ARA_GIRIS_* → ARA_HUB (3 gün × 3 EP; yığınsız)
  ARA_SEMA (bilirkişi ön görüşmesi, belge) · ARA_ZEYIL (poliçe) · ARA_TURNIKE (kart kaydı) · ARA_OPR (operatör cevabı)
  ARA_NALAN (telefon → doğru kanal) · ARA_YASAR (tanık hazırlığı) · ARA_HAKAN (vicdan ipucu) · ARA_SELIM (eski şifre teklifi)
  ARA_EKSPER (sahne 4: eksper fotoğrafları) · ARA_DIL · ARA_KARAR (savcılığa yaz / yüzleş / bekle) · ARA_CIKARIM · ARA_LEYLA
  ARA_DAY_END → ARA_AKSAM1/2 → ARA_SON_* → ARA_SON
T_00G_* → T_00 (yeni gelişme / etik ihlali) → T_01 bilirkişi raporu tartışması ⇄ T_01S bilirkişinin dinlenmesi (S1–S4)
  → T_01X katılan vekilinin bilirkişiye sorusu → T_02 Tarık'ın tanıklığı (T1–T5) ⇄ T_02K çekinme → T_03 Yaşar
  → T_03X katılan vekilinin sorusu (itiraz) → T_04 Nalan (NL1–NL4) → T_05 mütalaa → T_06P dayanaklar → T_06 esas savunma
  → T_07 son söz → T_08 hüküm → R_KARAR (+ epilog)
T_INT_COKUS (♥0: müvekkil vekâleti sona erdirir) → R_KARAR (COKUS ara kararı) · T_ETIK → R_KARAR
```

## 4. Sahne sahne (sözcük bütçesi tipik yol içindir, ±%20)

### PR_00 — Soğuk açılış · "02.14" (~550) · bg: siyah → sokak_karanlik
Bir evin çalışma odası, perdeler kapalı, yalnızca bir ekranın mavi ışığı. Yüz görünmez: parmak uçları, soğumuş bir
çay. El bir an bekler, on üç tuşa basar. Ekranda ilerleme çubuğu. Telefon titrer; `phone`, BİR KADIN: "Uyumadın mı?
… Doktor ne dedi, unuttun mu?" BİR ADAM: "Unutmadım. Az kaldı." Adam arkasına yaslanır, yüzü karanlığa karışır; masada
yalnızca iki kenetli el. narrator: "Bir şirketin on iki yıllık hafızası, bir çay soğuyana kadar sürmüştü." `fx: fade`.
Kimlik ipucu yok: giysi, saat, zarf, iç cep gibi bir kadroya eşlenebilecek hiçbir ayrıntı gösterilmez. Telefondaki
"doktor" yalnızca ara evresinde, poliçe ve cihaz zinciri kurulduktan sonra Nalan'ın "geçen yıl kalp ameliyatı oldu"
cümlesiyle karşılık bulur.

### PR_01 — "SABAH 08.30" + "ARAMA 06.40" (~550) · bg: depo → ev
Sunucu odasında boş klasörler; genç bir muhasebe elemanı ağlıyor: "Siparişlerin hepsi yok." Hoparlördeki bir ses
(yoldaki bilgi işlem firması; adı geçmez): "Panik yok. Kimse dokunmasın; önce kurtarmayı deneriz… Polis gelince her şeyi
mühürler." Bu ses imajdan önceki kurtarma denemesini (Ek-3) ekler; faili değil. Dört gün sonra şafakta Aktaşların kapısı çalınır; altı yaşındaki Defne pijamasıyla
merdivende; dizüstü bilgisayar şeffaf poşete girer. Selim: "Ben bir şey silmedim. Ben ömrüm boyunca yedek aldım."
Narratör: "İki ay sonra iddianame. Tensip zaptından birkaç gün sonra avukatı çekildi. Duruşmaya on iki gün kala, eşi bir avukat aradı."

### BR_00 — Bölüm 1 · DOSYA · "Gül" (~900) · bg: buro_gece
Gül, öğretmen çantası ve bir naylon dosyayla gelir. Ücret konusunda seçim (Dava #07 kalıbı): "sonra konuşuruz" (Gül
Defne'nin resmini verir: görüşmede güven), "sözleşme" (nötr), "söz veremem ama her satırı okurum" (dürüstlük bayrağı).
Gül'ün çekirdeği: "Kocam bir sistemi sabote edecek adam değil. Kocam, evdeki modemi bile etiketler." ve "Şirket bizden
yirmi milyon istiyormuş. Sigortası istiyormuş. Ben o rakamı yazamam bile."

### BR_01 — Leyla dosyayı devreder (~600)
Ceza aralığı sorusu (244/2: 6 ay–3 yıl; 243/1: 1 yıla kadar hapis ya da adli para cezası; görevli mahkeme asliye
ceza). Çeldiriciler: 244/4 (yarar sağlama), 243/3 (netice sebebiyle ağırlaşma), ağır ceza. Leyla: "Ceza küçük görünür.
Ama arkasından bir rücu davası gelir; yirmi milyon. Bu dosyada hapis değil, bir ömür tartılıyor."

### BR_01B — "Altı kâğıt" (~350)
İddianame, şirket şikâyeti, DataKale "imaj ve analiz raporu", emniyet inceleme raporu, oturum dökümü özeti, bir de
"kimsenin okumadığı" ek: devir-teslim tutanağı dosyada **yok**; Leyla: "Bir adam işten çıkarken neyi kime teslim etti?
Bunu kimse sormamış."

### BR_02 — Dosya ekranı + strateji (~250) → INV_SABAH (~300, bg: sokak_sabah)
Masumiyet / Usul / Terditli. Sabah fabrika önü: servis otobüsleri, bekçi kulübesi, Yaşar Usta'nın çayı. Tarık'ın
siyah aracı otoparkta; plakası "16 NS 001". Yalnızca bir manzara.

### Bölüm 2 · SORUŞTURMA (~5.200)
- **INV_HUB:** gün başı hedef kartları (gün 1: "kaydı kim, nasıl tuttu?"; gün 2: "o hesap kimdeydi?"; gün 3: "dilekçe ve
  tahta"). Sekmeler: OLAY YERİ, MÜVEKKİL, TANIKLAR, ARŞİV.
- **INV_ARAMA — sunucu odası fotoğrafları (şikâyet ekindeki 24 fotoğraf):** yedek cihazının ekranında "son yedek 17.10
  22.00" (ipucu), arka paneldeki boş bağlantı yuvası ve tozdaki temiz iz (ipucu), kapıdaki kartlı okuyucu (ipucu: odaya
  kartla girilir), çeldiriciler: klima, yangın tüpü.
- **INV_EV_G → INV_ARAMA2 — Aktaşların evi:** Gül'ün mutfak çekmecesi (e-posta çıktısı: izin), çalışma masası
  (devir-teslim tutanağının imzalı örneği), Defne'nin resmi "babamın bilgisayarı" (çeldirici, duygu), etiketli modem
  (ipucu: ev hattının adresi/IP'si sabit), duvar saati (çeldirici).
- **INV_KAPI — fabrika kapısı (dışarıdan, kamuya açık alan):** bekçi kulübesinin kayıt defteri (Yaşar gösterir:
  "araçlar" sütununda cuma 23.05 "GM aracı" — ipucu), turnike direği (ipucu: kart sistemi kayıt tutar), park yeri
  (çeldirici), servis tabelası (çeldirici).
- **INV_GORUSME — Selim, evinin balkonu (adli kontrol; tutuklu değil):** konular: o gece, işten çıkarılış, devir-teslim,
  şifreler, yedekleme kavgası; **21.30 oturumu** konusu dökümde 21.30 satırı bulununca açılır: sert tonda Selim çözülür
  ("Fotoğraflarımı aldım. Defne'nin doğduğu günün fotoğrafları o klasördeydi."), yumuşakta da gelir ama daha geç.
  **İzin e-postası** konusu (e-posta bulununca): "Tarık Bey yazdı. Unutmuşum. Önemli mi?"
- **INV_T_YASAR — bekçi kulübesi:** korkulu; doğru yol tanık bildirmek, yanlış yol saat ezberletmek (etik).
- **INV_T_HAKAN — Emniyet önü:** "Elimize ne verdilerse." Sorular: imajı kim aldı, Selim'in dizüstüsünde ne vardı.
- **INV_T_BULENT — DataKale ofisi:** ukala; "Teknik olarak imaj tertemiz." İpucu: "Cumartesi sabahı biraz kurcaladık,
  belki kurtarırız diye."
- **INV_T_TARIK — genel müdürlük:** sıcak karşılama, çay, golf. Yararlı tek şey: "Ben teknik adam değilim evladım,
  şifre mifre bilmem." Ziyaret bir bayrak kaldırır (ara evresinde Yaşar'ın vardiyası değişir: korkutulmuş tanık) ve
  katılan vekili bunu ilk celsede kullanır. Kartvizitinde "16 NS 001" plakalı aracın golf kulübü çıkartması (çeldirici).
- **Belgeler:** INV_LOG (oturum dökümü özeti: 21.30 satırı; 02.14 satırında "kaynak: GSM" notu, ama cihaz adı yok),
  INV_IMAJ (DataKale raporu: imaj tarihi 20.10; "kurtarma denemesi" eki; iki ayrı özet değer), INV_EMN (emniyet: Selim'in
  dizüstüsü yalnızca 21.30 bağlantısı), INV_DEVIR (tutanak: şifreler zarfta Tarık'a), INV_TAM (tam kayıt, dilekçeyle,
  gün sonu teslim: cihaz adı `NOS-GM-LT`, Selim'in cihazı `SELIM-PC`).
- **INV_DIL — dilekçe (3 hak):** şirketten tam VPN kaydı; mahkemece bilirkişi atanması ve orijinal disklerin muhafazası;
  bekçi kayıt defteri (çeldirici değil, ama ARA'da da istenebilir); çeldiriciler: "Selim'in sosyal medyası", "şirketin
  tüm e-postaları" (kapsamsız).
- **INV_CIKARIM:** tarifler: ŞİFRE (devir + log), ZİNCİR (imaj tarihi + kurtarma), ÖZET (iki hash), DİZÜSTÜ (emniyet + 02.14),
  RIZA (e-posta + 21.30), YEDEK (son yedek + boş yuva), CİHAZ (tam kayıt + emniyet cihaz adı). Çeldiriciler: modem + klima,
  Defne'nin resmi + yangın tüpü.
- **INV_AKSAM1:** Leyla: "Bugün neye inandın?" (makineye / insana / kimseye). **INV_AKSAM2:** Nalan'ın ilk, isimsiz
  telefonu ("Poliçeye bakın. Bir de… beni aramayın.") — ARA'yı tohumlar.
- **INV_GECE:** koşullu hafıza zinciri; kapı altından bir zarf: içinde boş bir A4 ve bir golf topu. `fx: flash`.

### Bölüm 3 · BİRİNCİ CELSE (~2.800) · bg: durusma_salonu
Koridor (Gül ve Defne'nin resmi; Gül'e söz: "bugün başlıyor" / "bu iş bugün biter"). Açılış: hâkim Kemal Oran, savcı
Ferda Yalın, katılan vekili Ozan Tekin. Sanığa sorular (21.30'u kendisi anlatsın mı? İzin e-postası; devir-teslim; yanlış
soru: "Şifreleri başka kime söylediniz?" savcıya kapı açar). **H1_02:** Ozan DataKale raporunu "bilirkişi raporu" olarak
okutmak ister → doğru: "Özel uzman mütalaasıdır; mahkemece bilirkişi atanmalı, orijinal diskler muhafaza edilmeli"
(CMK 63, 67/6, 134). **H1_03 Bülent (B1–B5)**; kırılma: iki özet değer + kurtarma eki → "Biz… biz biraz kurcaladık."
Ozan'ın kanaat cümlesine itiraz (g_kanaat). **H1_04:** Ozan sanığın eski disiplin kaydını okutmak ister (ilgisiz;
itiraz). **H1_05 ara karar:** bilirkişi atanması, şirketten tam kayıt ve kart geçişleri; savunma talebiyle operatör
kaydı (gerekçe gösterilirse). Erteleme üç hafta.

### Bölüm 4 · ARA (3 gün × 3 EP; ~3.300)
Hedef: "Biri o hesabı kullandı. Kim? Kanıtla; kovalamadan." Yeni gelişmeler: tam kayıt (gelmediyse burada), bilirkişinin
ön inceleme tutanağı, zeyilname (mahkeme yazısıyla), turnike kaydı. Nalan büroya gelir: doğru yol "Bildiklerinizi
savcılığa ya da mahkemeye tanık olarak söyleyin; belge getirmeyin"; yanlış yol "Muhasebeden poliçe dosyasını
fotokopiyle getirin" (etik ve hukuka aykırı delil riski). Selim'in teklifi: "Yedek yönetici hesabı hâlâ açıksa
girip gerçek kayıtları indiririm." → doğru: reddet ve mahkemeye bildir; yanlış: kabul et → **ETİK** sonu. Yaşar
korkutulmuş (Tarık ziyaret edildiyse vardiyası gündüze alınmış). Yaşar'a "gelenin Selim olmadığını açıkça söyleyin"
demek tanığı yönlendirmektir: Yaşar reddeder ve duruşmada Ozan'ın sorusuna dürüstçe anlatır (♥ ve ikna düşer, beyan
değerlendirme dışı kalır, 2-b beraati kapanır). Hakan: "Orijinal diskler şirkette" ve "acele etmeyin" telefonunun
genel müdürlükten geldiği. Leyla imzasız notun savcılığa teslim edildiğini söyler; Nalan genel müdürlüğün krem rengi,
filigranlı kâğıdını anar (benzerlik delil değildir; kâğıdı savcı inceletir). Karar: savcılığa yaz (doğru; gerçek
failin soruşturmasını başlatır, epilogu değiştirir) / Tarık'la yüzleş (delil kaybı: dizüstü "çalınmış" olarak
bildirilir) / koridorda sözlü bilgi (ihbar sayılmaz) / bekle.

### Bölüm 5 · İKİNCİ CELSE (~3.300)
Bilirkişi Sema Uçar kürsüde (S1–S4): imaj iki gün sonra alındı; bazı "silme izleri" kurtarma yazılımının; orijinal
diskte 02.14'ün cihaz adı `NOS-GM-LT`; "kimin kullandığına kanaat bildirmem." Ozan "ad değiştirilebilir mi?" diye
sorar; doğru hamle itiraz değil cevabı beklemektir: "Ad değişir; sertifika değişmez." Nalan (NL1–NL4): zeyilname,
nakit sıkıntısı, "gerekçesini bilmiyorum" (bastırınca: "bir çalışan sorun çıkarırsa diye"), "ihbar pazartesi" (eksper
fotoğrafıyla çürür: genel müdür cumartesi sabahı sigortayı aramış). **T_02 Tarık (T1–T5)**: evdeydim / şifre bilmem / yedek zaten arızalıydı / poliçe yıllardır aynı / o cihaz
Selim'in. Kırılma: turnike + cihaz adı + operatör → hâkimin CMK 48 hatırlatması; Tarık "Avukatımla görüşmeden cevap
vermeyeceğim." Salon donar. Yaşar'ın kısa tanıklığı; Ozan'ın yönlendirici sorusuna itiraz. Mütalaa varyantları; dayanaklar
(3 hak); esas savunma (masumiyet/usul/terdit/duygu); son söz (Selim'in cümlesi); hüküm.

## 5. Ters köşeler ve ekilen ipuçları

1. **Selim de o gece bağlandı** (21.30): dökümde açık satır; Selim ilk görüşmede söylemez; Gül'ün "o akşam fotoğraflara
   bakıyordu" cümlesi; hard tonla açılır. Ters köşe oyuncunun güvenini sarsar, ardından izin e-postasıyla hukuki çekirdeğe
   döner: yetki ve rıza.
2. **Sabotajı yapan genel müdürdür:** zarflanmış şifreler (devir-teslim), "evrak unuttum" (bekçi defteri), "yedek aylardır
   arızalıydı" (yedek ekranı tersini söyler), Nalan'ın telefonu, poliçe zeyilnamesi, cihaz adı. Hiçbiri tek başına bir
   isim söylemez; isim ancak ARA'da turnike + cihaz adı tahtada birleşince düşer (`ded_gm`).

## 6. Epiloglar (OutcomeDef.epilogue; 250–400 sözcük)

- **BERAAT_B:** 244/2'den "işlenmediği sabit" (2-b), 243/1'den rıza nedeniyle 2-a. Koridorda Nalan; adliye önünde yağmur
  diner; Leyla iki bardak çay. Savcılığa yazıldıysa "işte bu yüzden ortak oldun"; yazılmadıysa "yarın yaz" ve
  soruşturmanın üç hafta gecikmesi.
- **BERAAT_E:** "Sabit olmadığından." Ozan'ın "istinafta görüşürüz"ü; şirket rücu davasını askıya alır ama vazgeçmez;
  Selim balkonda modemin etiketini söker: "Artık kimseye kanıtlayacak bir şeyim yok. Ya da her şey."
- **NITELENDIRME:** rıza kurulamadı: 244/2'den 2-e beraat, 243/1'den adli para cezası ve HAGB. Selim: "Kendi
  fotoğraflarımı almaktan." Gül e-postanın bir yerde yazılı olduğunu söyler; Deniz onu bulamadığını bilir.
- **KISMI:** rıza kuruldu ama silme koparılamadı: 243/1'den 2-a beraat, 244/2'den 1 yıl 3 ay, ertelendi (HAGB yok:
  zarar giderilmedi). Selim: "Fotoğraflarım için beraat, hiç dokunmadığım şey için ceza."
- **MAHKUMIYET:** 1 yıl 8 ay + adli para; HAGB ve erteleme somut gerekçeyle reddedilir. Gül resmi katlar; Selim'in
  "zararı giderir misiniz" sorusuna verdiği cevap; Leyla "neyi kaçırdın?"
- **COKUS (ara karar):** ♥0'da Selim vekâleti sona erdirir, yeni müdafi için duruşma ertelenir. Ferda: "Kâğıtla
  gelmeliydiniz; hararetle değil." Bilirkişi dinlendiyse delil dosyada kalır; yeni el taşıyacaktır.
- **ETİK:** Leyla masaya meslek kurallarını bırakır; Selim'in yeni avukatı; hukuka aykırı delil dosyadan çıkarılır.

## 7. Mekanik bağlar (yazım kontrol listesi)
- Tahtada her kart `kart` etiketli; tarif ödülleri ilk kurulumda (`firstTime`).
- Tam kayıt (`ev_tam_log`), bilirkişi raporu (`ev_sema`), zeyilname (`ev_zeyil`), turnike (`ev_turnike`), operatör
  (`ev_operator`) koşullu teslimler; her biri `deliver()` ile yollu.
- Etik bayrakları (`yasar_kocluk`, `nalan_belge`, `tarik_yuzles`, `selim_giris`) bir yerde okunur.

## 8. Uygulama notları (yazım sonrası)
- Tipik yolda belgelerin açılışları, iki akşam sahnesi, ara evresinin belgeleri ve akşamları, mütalaa ve esas savunma
  birer duyusal ayrıntı ve iç ses vuruşuyla genişletildi (Leyla'nın "menteşe" hikâyesi, Selim'in tutanağın arkasındaki
  kupa notu, Deniz'in cübbesi). Tipik yol ~13,5 bin sözcük.
- Gizem denetimi: genel müdürü adıyla hedef alan seçenekler (ek dilekçede gözaltı talebi, Nalan'a "o gece nerede?",
  son sözde suçlama) ancak genel müdüre bağlayan bir bulgudan sonra görünür. Birinci celse koridorunda plaka vurgusu yok.
- MAHKÛMİYET epilogu hükümle uyumlu: "ne erteleme ne geri bırakma"; istinaf için iki hafta; Gül'ün pasta/dilekçe cümlesi.
- W (çöküş) ikinci celsede: oyuncu bütün kâğıtları bulur ama genel müdürün kürsüsünde ilgisiz belgeyle ısrar eder.
  Çöküş bir mahkûmiyet değil, COKUS ara kararıdır (müvekkil azleder); hiçbir hüküm müdafiin güvenilirliğine dayanmaz.
- Leyla'nın sigara paketi tek bir zaman çizgisinde: bıraktığı gün aldığı paket, dört yıldır dolu. Defne'nin güneşli
  resmi "avukat teyzeye"dir; Selim'e iletilecek olan, balkon ve "YASAK" işaretli ikinci resimdir.
