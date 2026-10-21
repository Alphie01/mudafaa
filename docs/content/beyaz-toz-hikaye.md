# Dava #04 — Beyaz Toz · Hikâye Kitabı (noir)

> Bu belge Dava #04'ün **anlatı çıtasıdır**; yapı ve yoğunluk bakımından Dava #07 v2 hikâye kitabını
> (`docs/content/gece-bekcisinin-sirri-hikaye.md`) örnek alır. Hukuki gerçek, deliller, sonuç koşulları ve puan mantığı
> `docs/content/beyaz-toz.md` ve `docs/legal/beyaz-toz.md`'de kalır; bu belge onları **sahneye** çevirir. Kaynak:
> `content/src/beyaz-toz/` → `content/cases/beyaz-toz/`.

## 0. Ton ve kurallar

- **Noir dram.** Bursa, ocak sonu. Sulu kar, lodosun getirdiği ılık yağmur, Görükle'nin öğrenci sokaklarında ıslak
  karton ve kızarmış ekmek kokusu. Her sahnede bir duyusal ayrıntı: asma kilidin soğuğu, florasan vızıltısı, eczane
  dolaplarının ilaç kokusu, motosiklet egzozunun sabah ayazında asılı kalan dumanı.
- **Uyuşturucu ciddiyetle anlatılır.** Hiçbir sahnede kullanım çekici, eğlenceli ya da "havalı" gösterilmez. Madde bir
  hastalık, bir borç, bir yalnızlık olarak durur: kaçırılan cenaze, acile kaldırılan bir gece, kız kardeşin bozulan
  güveni, annenin bilmediği bir defter. Kullanım ayrıntısı (nasıl, ne kadar, nereden) verilmez; yalnızca sonuçları
  görünür. Tedavi bir zayıflık değil, Kaan'ın en cesur kararıdır.
- **İç ses.** Deniz `style: "thought"` ile birinci tekil şahıs, kısa ve keskin cümlelerle konuşur. Gözlemler, sezer,
  ama çözümü söylemez. Örnek: *"Bursa'da kış iki şey getirir: lodos ve iddianame."*
- **Hukuk konuşmada değil, sonuçta yaşar.** Madde numaraları yalnızca Leyla'nın kısa açıklamalarında, seçenek geri
  bildirimlerinde, rapor ve hüküm metinlerinde ve duruşmanın resmî dilinde (başkan, savcı) geçer. Deniz mahkemede hukuk
  dili kullanır, sokakta insan gibi konuşur.
- **Gizem korunur.** Satıcının kim olduğu oyuncuya hiçbir zaman söylenmez. Soğuk açılışta sesler isimsizdir
  (`speaker: "narrator"`, `name: "BİR SES"` / `"İKİNCİ SES"`); merdivendeki adam bir siluettir. Ev arkadaşı Barış
  dosyanın başında yalnızca müvekkilin iddiasıdır: savcılık "böyle biri yok" der. Oyuncu önce **Barış'ın var olduğunu**,
  sonra **arka odanın onun olduğunu**, en son **satış zincirinin ona çıktığını** delillerden kendisi kurar. Ayrıca iki
  çeldirici şüphe vardır: evin eski kiracısı **Tolga** (anahtarı hâlâ elinde) ve "müvekkil kendisi" (savcılık tezi).
- **Satır kuralları:** satır ≤ ~220 karakter; her yeni mekânın ilk satırı `style: "card"` + `bg`
  (`"PERŞEMBE 21.10 — ARSLAN HUKUK, BURSA"`); sert anlarda `fx` (`shake` kapı/kelepçe, `flash` şimşek/fotoğraf, `fade`
  bölüm sonu). Kimliği bilinmeyen ses karakter kimliğiyle değil, `narrator` + `name` ile konuşur.
- **Sözcük bütçesi:** tipik yol (BERAAT_E) ~14–15 bin sözcük (`case:duration` ölçüsü), ≥ 200 aksiyon, 90–120 dk; tüm
  dallar ≥ 18 bin sözcük.

## 1. Logline ve tema

- **Logline:** Görükle'de bir öğrenci evine şafak baskını yapılır; kilitli arka odadan 46 paket kokain, bir hassas terazi
  ve kilitli poşetler çıkar. Kira sözleşmesi Kaan Yıldız'ın adınadır; Kaan "o oda ev arkadaşım Barış'ın" der. Savcılığa
  göre Barış diye biri yoktur. Kaan kullanıcıdır, tedaviye yeni başlamıştır ve 15 ila 30 yıl hapisle yargılanmaktadır.
- **Dramatik soru:** *Kullanan ile satan arasındaki çizgiyi kim çizer?* Kaan'ın utancı (kullandığını söylemek) ile
  kurtuluşu (gerçeği söylemek) aynı cümlede durur. Deniz ise "kazanmak için müvekkilin sırrını kullanmak" ile "müvekkilin
  rızası" arasındaki çizgiyi öğrenir.
- **Ana mekânlar:** Arslan Hukuk (gece), Bursa H Tipi Cezaevi görüş odası, Defne'nin Mudanya'daki eczanesi, Görükle
  Ihlamur Sokak 14 (merdiven boşluğu, zemin kattaki Nesrin Hanım'ın evi, bodrum), Paketçi kurye durağı, Bursa 5. Ağır
  Ceza Mahkemesi.

## 2. Kadro: sesler, sırlar, yaylar

| Kimlik | Karakter | Ses (nasıl konuşur) | Sır / istek | Yay |
|---|---|---|---|---|
| deniz (oyuncu) | **Av. Deniz Arslan**, 31. İlk uyuşturucu ticareti dosyası. | Kısa, alaycı iç ses; dışarıda nazik ama inatçı. | Üniversitede bir arkadaşını aynı "beyaz tozla" kaybetti; bu dosyada yargılamamaya çalışıyor. | Önyargı → anlayış. "Kullanıcı" kelimesinin bir insanı silmediğini öğrenir. |
| leyla (mentor) | **Av. Leyla Erdem**, 58. | Az konuşur; her cümlesi bir ders. Sigarayı bıraktı, paketi masada. | Bu tür dosyalarda bir müvekkilini "itiraf ettirip" kurtardığını sandığı bir geçmiş. Burada yalnızca ima. | Deniz'i izler, kurtarmaz. Rıza ve etik çizgide serttir. |
| kaan (müvekkil) | **Kaan Yıldız**, 24, iktisat son sınıf (uzamış), Görükle'de "Kahve Durağı"nda barista. Sabıkasız. | Kendini küçümseyen kuru şakalar, yarım bırakılmış cümleler; "neyse" der, konuyu kapatır. Güvendikçe düz ve sade konuşur; sert tona alayla kapanır. | Babasının ölümünden sonra bir yıldır kokain kullanıyordu. Ekimde acile kaldırıldı, AMATEM'de tedaviye başladı; ablası dışında kimse bilmiyor. Eylülde Barış'tan iki kez **aldı**; bunu söylemek hem utancı hem kurtuluşudur. | Utanç → dürüstlük. Duruşmada "kullandım, satmadım" diyebildiği an onun zaferidir. |
| defne (abla) | **Defne Yıldız**, 31, Mudanya'da eczacı. Avukatı o tutar. | Hızlı, keskin, bilimsel; kızınca daha da kibarlaşır. "Kardeşim" yerine "o" der. | Kaan'ı acile o götürdü, tedaviyi o buldu; annelerine "Kaan sınavlara çalışıyor" diye yalan söylüyor. Çaresizlikte yanlış bir kapıyı aralar (sahte tanık teklifi). | Öfke → kabul. Kardeşini "bağımlı" değil "hasta" diye anmayı öğrenir. |
| nesrin (ev sahibi) | **Nesrin Uysal**, 69, emekli terzi, zemin katta yalnız yaşıyor; binanın sahibi. | Bursa ağzı, "evladım", her cevaba rahmetli eşinden bir anekdotla başlar; kedilerine isim isim seslenir. Korkunca resmîleşir: "Ben imzaladım, gerisini bilmem." | Kirayı elden alır, **kira defteri** tutar (vergi korkusu). Barış'ı tanır: "çantamı taşıyan kurye oğlan". Baskın sabahı aramaya sonradan çağrıldı, kapı çoktan kırılmıştı. | Korku → tanıklık. Kürsüde gözlüğünü takıp defterini açtığı an. |
| tolga (muhbir) | **Tolga Kaplan**, 29, evin eski arka oda kiracısı; işsiz. Kendisi de kullanıcı; eski bir dosyasında kovuşturma ertelemesi var. | Hızlı, savunmacı, her cümlenin sonunda "yani"; göz teması kurmaz, cümle ortasında konu değiştirir. | 9 Kasım gecesi Barış'tan aldığı paketle yakalandı; Barış'tan korktuğu ve evden çıkarıldığı için kinlendiği Kaan'ın adını verdi. | Yalan → çözülme. Kürsüdeki kırılma oyunun duygusal doruğudur. |
| tuncay (polis) | **Kom. Yrd. Tuncay Sezer**, 44, Narkotik Şube. Aramayı yönetti, tutanağı yazdı. | Kısa, emin, rapor dili: "Usulüne uygun", "tespit edilmiştir". Sıkışınca sesini alçaltır. | Kilidi keskiyle kestiğini ve parantez içindeki "(şüphelinin kullanımındaki)" ibaresini sonradan eklediğini biliyor. Kötü biri değil; aceleci. | Duvar → itiraf. "Ev onun üstüneydi; oda da onundur sandık." |
| savci | **Savcı Serap Akın**, 46. | Kuru, kesin; "Ben dosyaya bakarım, hikâyeye değil." Adil. | — | Doğru delil karşısında mütalaasını değiştirebilen bir rakip. |
| baskan / uye | **Başkan Halil Özkan**, **Üye Hâkim Merve Tan** | Başkan sabırlı ve usulcü; Merve Tan'ın soruları kısa ve keskindir. | — | — |
| mubasir | **Sabri Efendi** | Yorgun, tekdüze; her çağrıyı iki kez söyler. | — | — |
| gardiyan | **İnfaz koruma memuru Hasan Çakır** | Az konuşur, insanı süzer. | "Bu çocuk her akşam sayıyor: kaç gün oldu temiz diye." | — |
| selim | **Selim Usta**, 47, Paketçi Görükle durağının sorumlusu. | Esnaf dili, telaşlı, telefonu hiç susmayan biri; "abla" der. | Barış'ın çantasının astarını kendi diktiğini, Tolga'nın sık sık durağa uğradığını görmüştü. | Bilgi kaynağı; duruşmaya çağrılmaz. |
| — | **Barış Demirel**, 27, motosikletli kurye. | Yalnızca bir telefon sesi (`narrator`, "BİR SES"); kendini tanıtınca `name: "BARIŞ"`. | Gerçek satıcı. Baskını görüp döndü, İzmir'e kaçtı. | Sahnede hiç görünmez; yakalanırsa epilogda bir kart. |

## 3. Gerçek ve kronoloji (oyuncuya söylenmez; delillerden kurulur)

| Zaman | Olay | Keşif yolu |
|---|---|---|
| Ağustos | Kaan, Ihlamur Sokak 14/7'yi (3+1, en üst kat) kiralar; sözleşme onun adına. Arka odada alt kiracı Tolga oturur. | Kira sözleşmesi (savcılık), Nesrin'in defteri |
| Eylül başı | Tolga kirayı ödemez; Kaan onu çıkarır, depozitoyu borca sayar. Tolga'nın anahtar kopyası "kaybolmuştur". | Nesrin, Kaan (Tolga konusu) |
| 20 Eylül | Barış arka odaya taşınır; kirayı Kaan'a elden verir. Kapıya asma kilit takar ("kurye malzemem var"). | Nesrin'in kira defteri, mesajlar, olay yeri fotoğrafları |
| 24 ve 28 Eylül | Kaan, Barış'tan iki kez kullanmak için alır ("akşam 2 tane bırakır mısın"). | Mesaj dökümü (iki yüzlü delil), Kaan'ın itirafı (yüksek güven) |
| 3 Ekim | Kaan bir partide fenalaşır; Defne onu acile götürür. | Defne, hastane epikrizi |
| 10 Ekim | Kaan AMATEM'de ayaktan tedaviye başlar; 31 Ekim idrar testi negatif. | Randevu kartı (fotoğraf), tedavi kayıtları |
| 9 Kasım 23.00 | Tolga, binanın önünde Barış'tan bir paket alır; 300 m ötede devriyeye takılır. Kaan o saatte kafede kasa kapatıyordur (Z raporu 23.41). | Tolga'nın ifadesi, Z raporu (ara evre) |
| 10 Kasım 01.30 | Tolga ifadesinde "Daire 7'den, Kaan'dan aldım" der; ama "kapıyı açanın elinde kask vardı" diye bir ayrıntı kaçırır. | Tolga'nın ifadesi (belge incelemesi) |
| 10 Kasım 14.15 | Sulh ceza hâkimliği arama kararı verir: "şüphelinin kullanımındaki oda, ortak alanlar ve üzeri"; 48 saat. | Arama kararı (belge incelemesi) |
| 10 Kasım 22.40 | Barış, Kaan'a yazar: "bu gece geç gelirim, odaya girme sakın". | Mesaj dökümü |
| 11 Kasım 07.00 | Baskın. Kaan ön odada uyurken yakalanır. Arka oda kilitli; polis kilidi keskiyle keser. 46 paket, terazi, poşet, 8.750 TL. Mutfaktaki şekerlikte 2 paket. | Tutanak, kroki, fotoğraflar |
| 07.15 | Barış motosikletiyle köşeye gelir, polis araçlarını görür, döner. Nesrin her sabahki gibi erkenden kalkmıştır, pencereden görür. | Nesrin; Paketçi GPS kaydı (07.16) |
| 07.35 | Nesrin aramaya tanık olarak çağrılır; arka oda kapısı çoktan açılmıştır. Tutanağa "arama başında hazır" diye yazılır. | Nesrin; tutanakta imza saati |
| 12 Kasım | Barış Paketçi'den "kendi isteğiyle" ayrılır; Kaan tutuklanır. | Paketçi kayıtları |
| Aralık | Kriminal rapor: 46 paket net 39,8 g kokain; şekerlikteki 2 paket aynı poşet ve gramaj (0,85 g); terazide şüpheliyle uyuşmayan bir parmak izi; şekerlik kavanozunda Kaan'ın izi. Saç analizi: son üç ayda kullanım. İddianame: TCK 188/3, 188/4-a. | Kriminal rapor, saç analizi |
| 14 Ocak | Defne Arslan Hukuk'a gelir. 1. celseye 12 gün var. | Bölüm 1 |

## 4. Yapı (bölümler ve node haritası)

```
PROLOG   Soğuk açılış (11 Kasım 05.58, isimsiz sesler, merdivendeki siluet)        STORY → PR_02
PR_02    Şafak baskını: kesilen kilit, ön odadaki uyku, kelepçe                     STORY → BR_00
BR_00    Bölüm 1 · DOSYA: Defne büroda (yağmur, zarf, öfke)                         STORY (3 seçim)
BR_01    Leyla dosyayı devreder: ceza aralığı sorusu                                STORY (A–D)
BR_01B   Leyla'nın üç kâğıdı: kullanan ile satan                                     STORY
BR_02    Dosya ekranı + strateji                                                     STORY → INV_SABAH
INV_SABAH Ihlamur Sokak, sulu kar                                                   STORY → INV_HUB
INV_HUB  Bölüm 2 · SORUŞTURMA (3 gün × 4 EP; Leyla'ya danış günde bir, 0 EP)         INVESTIGATION
  Olay yeri:  INV_ARKA (arka oda fotoğrafları) · INV_ON (ön oda + salon fotoğrafları) · INV_BINA (bina, bizzat)
  Cezaevi:    INV_GORUS_G_* → INV_GORUSME (konu × ton; konular başka yerlerde bulunan bilgilerle açılır)
  Kişiler:    INV_DEFNE (eczane) · INV_NESRIN (zemin kat)
  Arşiv:      INV_TUTANAK · INV_KARAR · INV_MESAJ · INV_KRIMINAL · INV_TOLGA (belge) · INV_DIL (CMK 177) · INV_CIKARIM (tahta) · INV_LEYLA
  Gün sonu:   INV_DAY_END (DECISION) → INV_AKSAM1 / INV_AKSAM2
INV_GECE_* Duruşmadan önceki gece (hafıza zinciri) → INV_GECE
H1_00…H1_06 Bölüm 3 · BİRİNCİ CELSE: açılış → iddianame → Kaan'ın savunması ve müdafiin soruları
            → savcının sorusu (itiraz) → Kom. Yrd. Tuncay'ın çapraz sorgusu → talepler → ara karar (tutukluluk)
ARA_GIRIS_* → ARA_HUB  Bölüm 4 · ARA (2 gün × 3 EP; yığınsız, doğrudan dönüş)
  ARA_SELIM (kurye durağı) · ARA_GPS (belge) · ARA_ZRAPOR (belge) · ARA_KAAN (rıza) · ARA_DEFNE (sahte tanık teklifi)
  ARA_BODRUM (Nesrin'in telefonu: bodrumdaki çanta) · ARA_SUC (suç duyurusu) · ARA_CIKARIM · ARA_LEYLA
  ARA_DAY_END → ARA_TELEFON (gece, BİR SES) → ARA_SON_* → T_00
T_00…T_08 Bölüm 5 · İKİNCİ CELSE: açılış ve ara karar cevapları → (sahte tanık: T_OKAN çöküşü)
          → Nesrin → Tolga (savcının sorusu + çapraz sorgu) → delil tartışması (arama, şekerlik)
          → mütalaa (+ CMK 226 ek savunma) → esas savunma → son söz → hüküm → R_KARAR + epilog
T_COKUS (♥0) → T_08
```

## 5. Sahne sahne

> Sözcük sayıları hedeftir (± %20). Örnek satırlar tonu tarif eder; aynen kullanılabilir.

### PROLOG — Soğuk açılış · "05.58" (~550) · bg: sokak_karanlik
- `card`: "11 KASIM · 05.58 — GÖRÜKLE, IHLAMUR SOKAK"
- Anlatıcı: "Sokak lambası titredi. Öğrenci evlerinin camları karanlıktı; bir tek dördüncü katta, arka odada, bir kalem
  ışığı yanıp söndü."
- Bir motosikletin rölantisi; merdivenden inen bir siluet (yüz yok). Bir telefon (`phone`):
  - BİR SES: "Kapıyı kilitledin mi?" — İKİNCİ SES: "Kilitledim. Anahtar bende. Sen o çocuğa bir şey söyleme."
  - BİR SES: "Hangi çocuğa?" — İKİNCİ SES (sessizlik): "Uyuyan çocuğa. Uyusun."
- Köşede üç araç farlarını söndürür. Biri bir keski uzatır. `fx: fade`.
- **Kural:** iki ses de kimliksizdir; kimin konuştuğu, kimin dinlediği söylenmez.

### PR_02 — "07.00" baskın (~550) · bg: ev
- Kapı vurulur (`shake`). Kaan ön odada, kulaklıkla uyuyakalmıştır. Narkotik ekibi içeri dolar.
- Tuncay: "Kaan Yıldız? Arama kararı var. Kalk." Kaan: "Ben… arka oda benim değil." Tuncay: "Ev senin üstüne değil mi?"
- Keskinin metal sesi (`flash`, bir fotoğraf makinesi patlar). Ayakkabı kutusundan paketler. Mutfakta şekerlik.
- Kaan'ın tek cümlesi: "Barış'a sorun. Barış… Nerede Barış?" Kelepçe.
- `card`: "ÜÇ GÜN SONRA TUTUKLANDI. İKİ AY SONRA İDDİANAME. ON İKİ GÜN SONRA İLK CELSE."

### BR_00 — Bölüm 1 · DOSYA · "Defne Hanım" (~800) · bg: buro_gece
- `card`: "PERŞEMBE 21.10 — ARSLAN HUKUK, BURSA". Deniz (thought): "Bursa'da kış iki şey getirir: lodos ve iddianame."
- Defne ıslak bir eczane poşetiyle gelir: iddianamenin fotokopisi, bir hastane epikrizi, bir zarf.
- Çekirdek: "Kardeşim kullanıyordu, avukat hanım. Bunu ilk ben söyleyeyim ki siz sonra şaşırmayın. Ama satmadı.
  Satacak kadar düzenli bir insan değil." Zarf: "Annem bilmiyor. Ücreti ben ödeyeceğim."
- Seçim (puan yok, ilişki etkisi): "Önce gerçeği konuşalım, para sonra." (+güven, `defne_durust`) / "Ücret
  tarifesini anlatayım." (nötr) / "Kazanırız, merak etmeyin." (`soz_verdi`; Leyla sonra uyarır).
- Leyla kapıda: "Bağımlılık bir savunma değildir, Deniz. Bir gerçektir. Gerçekleri savunmaya çevirmek senin işin."

### BR_01 — Leyla dosyayı devreder (~500) · bg: buro_gece
- Ceza aralığı sorusu (A–D): doğru "188/3 + 188/4-a: 15–30 yıl". Yanlışlar: "188/3: 10–20 yıl" (kokain artırımı
  unutulmuş), "191: 2–5 yıl" (iddianame bu değil), "188/1: 20–30 yıl" (imal/ithal değil).
- Leyla doğru cevapta paketi çevirir: "Doğru. Kokain olduğu için on yıl, on beş olur. Sırf o odanın kimin olduğu
  yüzünden."

### BR_01B — Üç kâğıt (~350) · bg: buro_gece
- Leyla üç kâğıdı masaya dizer: **miktar, paketleme, iletişim**. "Kullanan cebinde taşır. Satan tartar, böler,
  konuşur. Bir de dördüncüsü var: kimin odası." Ters çerçeveye bakış; söylenmeyen bir geçmiş.

### BR_02 — Dosya ekranı + strateji (~250)
- Strateji: Masumiyet (×1,5) / Usul (×1,2) / Terditli (×0,8); Leyla tek cümleyle karşılar.

### Bölüm 2 · SORUŞTURMA (INV_*), tipik yolda ~5.000 sözcük
**INV_SABAH (~300) · bg: sokak_sabah:** Ihlamur Sokak'ta sabah; balkonda kalmış bir kurye kutusu; Deniz binaya bakar.
**INV_HUB:** gün başlıkları ve hedef satırı (gün 1: "Arka oda kimin?"; gün 2: "Kâğıtlar ne diyor, fotoğraflar ne
gösteriyor?"; gün 3: "Dilekçe son gün; kimi dinletmek istiyorsun?"). Hedef satırı bulgulara göre değişir.

**INV_GORUSME — Cezaevi (~1.600) · bg: gorus_odasi**
- Giriş: Hasan Çakır: "Konuşmanızı duymam. Görürüm ama." Kaan gri eşofmanla, tırnak etleri yenmiş.
- Konular: "O sabah", "Arka oda", "Barış", "Kendin" baştan açık; **"Kilit"** (clue_kilit), **"Şekerlik"**
  (clue_sekerlik), **"Mesaj"** (clue_odaya_girme), **"Tolga"** (Tolga'nın ifadesi okunduysa ya da Nesrin anlattıysa),
  **"Tedavi"** (randevu kartı ya da Defne) başka yerlerde bulunan bilgilerle açılır.
- Doruk (güven ≥ 50, "Mesaj" konusu): Kaan susar, sonra: "Eylülde ondan iki kez aldım. Kullanmak için. Sonra acil,
  sonra tedavi. Bunu mahkemede söylersem… annem duyar." Deniz rızasını sorar (rıza kullanılacaksa ara evrede yenilenir).

**INV_ARKA / INV_ON / INV_BINA — üç arama (~350 + 350 + 300):** Her bulguda iç ses yorumu. "Kilit kesik. Kesik kilit,
kilitli bir kapı demektir. Kilitli kapı, başkasının odası." Iska: "Bazen bir kül tablası sadece bir kül tablasıdır."

**INV_DEFNE — Mudanya eczanesi (~700) · bg: hastane (eczane iç mekânı):** Defne reçete keserken konuşur; epikriz ve
AMATEM kayıtları (Kaan'ın yazılı onayıyla). "41 giyer. Ehliyeti yok, bisiklet bile süremez." Öfke: "Ben onu acile
taşıdım. Siz satıcı diyorsunuz."

**INV_NESRIN — Zemin kat (~1.000) · bg: ev:** Kediler, çay, rahmetlinin dikiş makinesi. Doğru yaklaşım sabır ve açık uçlu
soru; "Barış'ı gördünüz, değil mi?" gibi yönlendirici soru `nesrin_telkin` olur (kürsüde bedeli ödenir). Kira defteri,
07.15'te dönen motor, kapının "ben çıkınca zaten kırılmıştı" hâli.

**Belge incelemeleri (~250 her biri):** Tutanak ve kroki (UV değil, büyüteç ve karşılaştırma); arama kararı (kapsam);
mesaj dökümü (odaya girme, iki tane, hat sahibi); kriminal rapor (yabancı iz, aynı parti, kavanoz izi); Tolga'nın
ifadesi (kask, saat).

**INV_AKSAM1/2 (~350):** Leyla ile gün sonu; ikinci akşam Defne'nin telefonu ("annem sordu").
**INV_GECE (~400):** Pano, koşullu hafıza satırları; Leyla: "Yarın polisin yazdığını değil, yazamadığını oku."

### Bölüm 3 · BİRİNCİ CELSE (H1_*), ~2.300 · bg: durusma_salonu
- `card`: "26 OCAK · BURSA 5. AĞIR CEZA MAHKEMESİ". Sabri Efendi: "Kaan Yıldız! Kaan Yıldız!"
- Kaan'ın savunması ve müdafiin soruları: dürüst kullanım beyanı yalnızca rızayla (yoksa Kaan donar, güven düşer).
- Savcının polise yönlendirici sorusu → itiraz (CMK 201/1).
- **Tuncay'ın çapraz sorgusu doruktur:** kilit fotoğrafı karşısında "Kilit… evet. Keskiyle açtık." Kroki karşısında
  "Ev onun üstüneydi; oda da onundur sandık." Kişisel kanaat cümlesine itiraz.
- Talepler (CMK 206/1) ve tutukluluk incelemesi: odanın kimin olduğu sarsıldıysa adli kontrolle tahliye.

### Bölüm 4 · ARA (ARA_*), ~3.000
- ARA_GIRIS: Tahliye edildiyse adliye merdiveninde Defne ile Kaan'ın sessiz sarılması; değilse ring aracının camı.
- ARA_SELIM (~600, bg: kafe — kurye durağı): Barış'ın gerçek adı soyadı, astarını kendi diktiği çanta, "Tolga diye biri
  sık uğrardı", 12 Kasım sabahı gelen "abi ben bırakıyorum" mesajı.
- ARA_GPS (belge): Paketçi kayıtları (istenmişse): 07.16 Ihlamur Sok. "teslimat iptal"; ayrılış 12 Kasım; İzmir adresi.
- ARA_ZRAPOR (belge): Kahve Durağı Z raporu, kasa kapanışı 23.41 — Tolga'nın "23.00, Kaan sattı" anlatısının altı oyulur.
- ARA_KAAN (~500): rıza. "Söyleyeceğim. Annemi ben arayacağım, sizden önce."
- ARA_DEFNE (~500): **Etik tuzak.** "Barış'ın arkadaşı Okan, biraz para verirsek 'Barış bana itiraf etti' der." Doğru:
  reddetmek; Okan gerçekten bir şey biliyorsa savcılığa gitmeli. Yanlış: kabul (TELKİN sonu).
- ARA_BODRUM (~400): Nesrin arar: bodrumdaki 7 numaralı kömürlükte astarı yırtık bir kurye çantası. Doğru: dokunma,
  savcılığa bildir (el koyma). Yanlış: çantayı al, mahkemeye kendin getir (delil zinciri bozulur, etik).
- ARA_SUC: kimlik ve kayıtlarla Barış hakkında suç duyurusu (CMK 158); kimlik yoksa "meçhul" duyuru zayıf kalır.
- ARA_TELEFON (gece, ~350): BİR SES: "Avukat hanım, Kaan'a söyleyin, beni karıştırmasın." Kendini ele verir: "Ben
  Barış." Doğru: saati not et, savcılığa bildir. Yanlış: pazarlık ya da tehdit.

### Bölüm 5 · İKİNCİ CELSE (T_*), ~2.600
- `card`: "16 ŞUBAT · İKİNCİ CELSE". Ara karar cevapları okunur (kurye kayıtları, el konulan çanta, Barış yakalandıysa
  parmak izi karşılaştırması).
- Nesrin kürsüde gözlüğünü takar, defterini açar. Telkin edilmişse savcı: "Avukat hanım size Barış'ı sordu mu?"
- **Tolga'nın çapraz sorgusu:** kask, saat, kin. Kırılma: "Barış'tı. Korktum. 'Beni söylersen…' dedi. Kaan'ı söyledim
  çünkü Kaan beni sokağa atmıştı." Salon uğuldar, başkan uyarır (`shake`).
- Delil tartışması: kapsam dışı arama (CMK 119, 206/2-a, 217/2); şekerlikteki paketlerin aynı stoktan geldiği.
- Mütalaa: delillere göre üç varyant (beraat + suç duyurusu / 191 ve ek savunma / 188 mahkûmiyet).
- Esas savunma Deniz'in ağzından 3–5 satırlık konuşma; son söz Kaan'ın cümlesi.

### Epiloglar (OutcomeDef.epilogue, her biri ~250–400)
- **BERAAT_B:** "Türk Milleti adına…" Defne'nin sarılması; Nesrin koridorda defterini çantasına koyar. Kart: "Barış
  Demirel, İzmir'de yakalandı." Kaan: "Perşembe randevum var. Kaçırmayacağım."
- **BERAAT_E:** Kaan çıkar, ama koridorda bir fısıltı: "Şüpheden yararlandı." Barış'ın yeri bilinmez. thought: "Bazen
  adalet bir kapıyı açar, ama odanın ışığını yakmaz."
- **NİTELİK (191):** Ticaret düşer; kullanım kalır. Hüküm açıklanmaz, denetim ve tedavi. Kaan: "Belki de hak ettiğim
  buydu: bir doktor ve bir takvim."
- **MAHKÛMİYET:** Ring aracının arka camı; Defne'nin eczane poşetinde hâlâ randevu kartı. thought: "On iki buçuk yıl.
  Bir oda yüzünden."
- **TELKİN:** Okan'ın kürsüdeki çöküşü; Leyla, Deniz'in masasına meslek kuralları kitapçığını bırakır.
- **ÇÖKÜŞ:** Savcı dosyasını toplarken: "Kilidi buldunuz, avukat hanım. Anahtarı kaybettiniz."

## 6. Ters köşeler ve önceden ekilen ipuçları

1. **Barış vardır** (bölüm 2): ipuçları — mesajdaki "odaya girme", posta kutusundaki "DEMİREL", Nesrin'in kira defteri,
   45 numara ayakkabı ve kurye montu. Hiçbiri tek başına "satıcı Barış" demez; yalnızca arka odada başka biri yaşadığını.
2. **Polis kilitli kapıyı kırdı** (1. celse): ipuçları — fotoğraftaki kesik kilit, tutanaktaki sıkıştırılmış parantez,
   tanığın imza saati, kararın kapsamı.
3. **Muhbir yalan söyledi** (2. celse): ipuçları — Tolga'nın ifadesindeki kask, Selim'in "Tolga sık uğrardı" sözü, Z
   raporundaki 23.41, Nesrin'in "çıkardığımız oğlan" anısı.
4. **Kullanıcı itirafı** (bölüm 2 ve 1. celse): Kaan'ın utancı. Rızası olmadan kullanılırsa güven çöker.

## 7. Karar ve mekanik bağları
- Yeni bayraklar sonuçlara ve hükümlere metinsel olarak yansır; sonuç koşulları ve puan tabloları `docs/content/beyaz-toz.md`
  §10–11'de.
- Golden path'ler: TIPIK (BERAAT_E), G_B (BERAAT_B), G_N (NİTELİK), G_M (MAHKÛMİYET), G_ETIK (TELKİN), W (çöküş).

## 8. Uygulamada eklenen ve değişen sahneler

Yazım sırasında tempo ve süre bütçesi için hikâyeye şu vuruşlar eklendi (node kimlikleriyle):

- **INV_MERDIVEN** — bina aramasından sonra merdiven boşluğu: 6 numaradaki öğrenci, adını vermeden keski sesini ve
  “anahtarı ver / yok bende” konuşmasını anlatır; tanıklık etmez. Deniz bunu mahkemeye taşımaz; yalnızca polise
  soracağı soruyu öğrenir.
- **INV_SABAH3** — üçüncü gün sabahı Kahve Durağı: kafe sahibi Elif Hanım, Kaan'ın pazar kapanışlarını ve perşembe
  izinlerini anlatır (mazeretin ilk tohumu; Z raporu ara evrede gelir).
- **INV_EMANET** — emanet eşya tutanağı (belge): üç anahtarlı anahtarlık, 140 TL, reçeteli ilaç.
- **H1_00K** — birinci celseden önce nezarethane: beş dakikalık avukat görüşü; rıza varsa avucuna yazılmış “Satmadım”.
- **H1_08** — birinci celsenin akşamı: tahliyede Defne'nin sofrası ve annenin telefonu; değilse büroda tek başına Deniz.
- **ARA_AKSAM** — ara evrenin ilk gecesi: Leyla yirmi iki yıl önceki bir dosyayı anlatır (bir müvekkili ikrara
  yönlendirmiş, terazinin sahibi sonradan çıkmış). Dava #15 tohumu; ters çerçevenin bir köşesi.
- **ARA_SABAH** — ikinci gün sabahı: tahliyedeyse ilk imza günü ve AMATEM; değilse cezaevi görüş kuyruğu.
- **ARA_NESRIN** — Nesrin'e teşekkür ziyareti; kira defterinin fotokopisi (“aslı bende kalır”).
- **T_00K** — ikinci celseden önce koridor: Nesrin “ne diyeyim, söyle ezberleyeyim” der; doğru cevap ona bir şey
  söylememektir (dikte etmek TCK 277 ve meslek kuralları ihlalidir).
- **T_03S** — muhbir kürsüden inerken: çözüldüyse polis eşliğinde, çelişkiye düştüyse “ben söyledim işte” diye
  mırıldanarak, ayakta kaldıysa savcının onaylayan bakışıyla.
- **T_06P** — esas savunmadan önce dayanak seçimi (en çok üç; ispatlanmış dayanak ikna eder, ispatlanmamış zayıflatır).
- **Eylem puanları:** soruşturma 3 gün × 5 EP, ara evre 2 gün × 4 EP (ilk tasarımda 3 × 4 ve 2 × 3).
- **Tipik yolun duygusal çizgisi:** 223/2-e beraatte muhbir kask ve saat çelişkisinde çöker ama satıcının adını vermez;
  şekerlik ikinci celsede delil tartışmasında aklanır. Adın söylendiği an (Tolga'nın kırılması) 223/2-b yolunun ve
  ara evrede kurye durağına gidenlerin ödülüdür.
- **Eşikler:** 223/2-e puan eşiği taşımaz (delil zinciri kurulduysa beraat); 223/2-b 11.000 ister; erken çözüm denetimi için `docs/content/beyaz-toz.md` §12.
