# Dava #04 — Beyaz Toz · Hukuki İnceleme Notları

> Durum: **Onaylandı — Claude (iç inceleme), 2026-10-20.** `meta.legalReview = { status: 'APPROVED', by: 'Claude (iç
> inceleme)', at: '2026-10-20' }`. Dava #07'deki gibi, iç incelemenin bıraktığı yorum soruları §4'te açık tutulur;
> üretimde bir avukatın ikinci okuması önerilir.

Metinler aşağıdaki güncel mevzuat PDF'leriyle karşılaştırılmıştır (erişim: 2026-10-20; metinler `pdftotext` ile okundu):

- TCK 5237 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5237.pdf
- CMK 5271 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5271.pdf
- Anayasa (md. 20, 21, 38), AİHS 6/2, 1136 sayılı Avukatlık Kanunu (md. 34, 36), TBB Meslek Kuralları (tanıkla ilişki,
  delile müdahale yasağı) — genel bilgi olarak; metin doğrulaması TCK/CMK için yapıldı.

## 1. Kullanılan maddeler ve doğrulama

| Madde | Kullanıldığı yer | Kontrol edilen metin (özet) |
|---|---|---|
| TCK 188/3 | iddianame, BR_01, hükümler | Ülke içinde satan, satışa arz eden, … bulunduran: **on yıldan az olmamak üzere** hapis ve 1.000–20.000 gün APC (6545 ve 694/7078 değişiklikleriyle). |
| TCK 188/4-a | iddianame, BR_01, hükümler | Madde eroin, **kokain**, morfin, bazmorfin, sentetik kannabinoid/katinon/opioid, amfetamin ve türevleriyse ceza **yarı oranında artırılır** (7445 sayılı Kanunla genişletilmiş liste). |
| TCK 49/1, 61/7 | BR_01 (üst sınır) | Süreli hapis kanunda aksi yoksa en çok 20 yıl; artırımlarla sonuç ceza 30 yılı geçemez → 188/3 + 188/4-a: **15–30 yıl**. |
| TCK 52/2 | MAHKÛMİYET, TELKİN | Bir gün karşılığı APC **en az 100, en fazla 500 TL** → 1.250 gün × 100 TL = 125.000 TL; 1.500 gün × 100 TL = 150.000 TL. |
| TCK 62/1–2 | MAHKÛMİYET ve TELKİN (indirim), T07_B | Takdiri indirim 1/6; failin geçmişi ve yargılama sürecindeki **kendi** davranışları değerlendirilir; şeklî tutum tek başına neden değildir. Üçüncü kişilerin (abla, müdafi) davranışı indirimi reddetme gerekçesi yapılmadı. |
| TCK 53, 54 | hükümler | Hak yoksunlukları; suçta kullanılan/suç teşkil eden eşyanın müsaderesi (beraatte de madde müsadere edilir). |
| TCK 191/1 | NİTELİK_191, BR01_C, T06_T | Kullanmak için satın alan, kabul eden, bulunduran ya da kullanan: **2–5 yıl** hapis. |
| TCK 191/8–9 | NİTELİK_191 | 188 kovuşturmasında suçun **münhasıran 191 kapsamına girdiği** anlaşılırsa bu madde çerçevesinde **HAGB**; aksine hüküm yoksa CMK 231. |
| TCK 191/3 | NİTELİK_191 (denetimli serbestlik, tedavi) | Erteleme süresinde en az bir yıl denetimli serbestlik; gerekirse tedavi (7445 değişikliği). HAGB denetim süresi CMK 231/8 ile beş yıldır. |
| TCK 192/2–3 | INV_TOLGA (t_not), PR_T2 | Kullanıcı, resmî makamlar haber almadan önce kimden aldığını bildirirse ceza verilmez; haber alındıktan sonraki gönüllü yardım ¼–½ indirim → muhbirin “bir isim verme” saiki. |
| TCK 6/1-e | T04_C | Gece vakti: güneşin batmasından bir saat sonra başlar, doğmasından bir saat önce biter. 11 Kasım 2025 Bursa gün doğumu **07.43 TSİ** (bkz. §4-9) → gece vakti 06.43'te biter; baskın **07.00**'de başladı; CMK 118 itirazı dayanaksızdır. |
| TCK 272, 38 | TELKİN, DN_KABUL | Yalan tanıklık; tanığa para karşılığı beyan yazdırmak azmettirme. |
| TCK 277 | TK_B, NS_BASKI (anlatı) | Tanığı hukuka aykırı biçimde etkileme teşebbüsü (duruşma öncesi dikte). |
| CMK 119/1–2 | INV_KARAR, ded_kapsam, PS_S1/S3, T04_A | Konutta arama hâkim kararı ya da gecikmesinde sakınca varsa savcının yazılı emriyle; kararda **fiil, aranacak kişi/yer/eşya ve süre açıkça gösterilir**. |
| CMK 119/4 | clue_tanik_saat, PR_S4_A | Savcı yokken konut aramasında ihtiyar heyetinden ya da komşulardan **iki kişi** bulundurulur. |
| CMK 118 | T04_C | Konutta gece vaktinde arama yapılamaz (istisnalar 118/2). |
| CMK 120 | (anlatı) | Aranacak yerin sahibi/zilyedi hazır bulunabilir; avukatın aramada bulunmasına engel olunamaz. |
| CMK 123, 127 | ARA_BODRUM, T_00A | El koyma hâkim kararı / gecikmesinde sakınca varsa savcı, ulaşılamazsa kolluk amiri emriyle; avukat delile el koyamaz. |
| CMK 134 | ev_mesaj | Şüphelinin bilgisayar/cihazında arama ve kopyalama hâkim (gecikmede savcı) kararıyla. |
| CMK 141/1-e, 142 | beraat hükümleri | Tutuklanıp beraat eden kişinin tazminat hakkı ve istem süresi; hükümde bildirilir (CMK 231/3; bkz. §4-7). |
| CMK 147/1-e; Anayasa 38/5 | G_RIZA_B | Kimse kendini suçlayan beyana zorlanamaz. |
| CMK 158 | ARA_SUC, TEL_A | Suç ihbarı/şikâyeti; avukat şüpheliyi kovalamaz, savcılığa bildirir. |
| CMK 177 | INV_DIL | Delil dilekçesi duruşmadan **en az beş gün önce**; takvim: 3. gün (17 Ocak) = celseye 9 gün. |
| CMK 48 | T_02 | Tanık kendini suçlama tehlikesi olan sorulara cevap vermeyebilir. |
| CMK 44 | NS_BASKI geri bildirimi | Zorla getirme kurumu (tanığa tehdit olarak kullanılamaz). |
| CMK 108/3, 100, 109 | H1_06 | Duruşmada tutukluluk her oturumda incelenir; kuvvetli şüphe zayıfladıysa adli kontrol. |
| CMK 192, 201/1 | H1_03, T_02 itirazları | Başkanın duruşmayı yönetmesi; doğrudan soru hakkı. “Telkin edici soru” Türk usulünde ayrıca adlandırılmış bir itiraz kurumu değildir (bkz. §4-1). |
| CMK 206/1–2-a | TL_*, T04_A | Duruşmada delil istemi; **kanuna aykırı elde edilen delil reddolunur**. |
| CMK 210, 217 | g_duyum, g_kanaat | Doğrudan doğruyalık; hâkim yalnızca duruşmada tartışılan, hukuka uygun delillere dayanır ve vicdani kanaatiyle takdir eder. |
| CMK 216/2–3 | T_05*, T_07 | Mütalaaya cevap; son söz sanığındır. |
| CMK 223/2-b, 223/2-e | BERAAT_B, BERAAT_E | Yüklenen suçun sanık tarafından **işlenmediğinin sabit olması** / **işlendiğinin sabit olmaması**. |
| CMK 225/1–2 | T05N_C, beraat gerekçeleri | Hüküm iddianamedeki fiil ve faile ilişkindir; mahkeme nitelendirmede bağlı değildir. |
| CMK 226/1, 226/3 | T_05N, T06_T, NİTELİK_191 | Hukuki niteliğin değişmesinden önce sanığa haber verilir; istemi üzerine ek savunma süresi. |
| CMK 230/1-b | beraat gerekçeleri | Hukuka aykırı delillerin gerekçede ayrıca gösterilmesi. |
| CMK 231/8, 231/12 | NİTELİK_191 | HAGB'de beş yıl denetim süresi; HAGB kararına itiraz. |
| CMK 273/1 | mahkûmiyet hükümleri | İstinaf: gerekçeli hükmün tebliğinden itibaren **iki hafta**. |
| Anayasa 20, 21, 38/4, 38/6; AİHS 6/2 | ded_kapsam, beraat gerekçeleri | Özel hayat ve konut dokunulmazlığı; masumiyet karinesi; kanuna aykırı bulgular delil olarak kabul edilemez. |
| Av.K. 34, 36; TBB Meslek Kuralları | AK2_C, G_RIZA_C, DN_KABUL, BD_AL, TK_B, SL_ADRES | Avukatın özen ve doğruluk yükümlülüğü, sır saklama, tanığı etkilememe, delile müdahale etmeme. |

## 2. Ceza hesabı

- **MAHKÛMİYET:** TCK 188/3 alt sınır 10 yıl hapis + 1.000 gün APC → 188/4-a (kokain) ½ artırım: 15 yıl + 1.500 gün →
  TCK 62/1 1/6 indirim: **12 yıl 6 ay** + **1.250 gün**; gün karşılığı en az 100 TL (TCK 52/2) = **125.000 TL**. TCK 53,
  54; tutukluluğun devamı (2. celsede tahliye edilmişse hükümle birlikte tutuklama); istinaf iki hafta (CMK 273/1).
  Sıra TCK 61'e uygundur (temel ceza → artırım → takdiri indirim); 61/7 tavanı (30 yıl) aşılmaz.
- **TELKİN:** aynı temel, artırım ve TCK 62/1 indirimi: **12 yıl 6 ay** + **1.250 gün** × 100 TL = **125.000 TL**.
  Sahte tanığı ayarlayan abla ve müdafidir; sanığın kendi davranışı değildir, bu yüzden TCK 62 reddedilmedi (§4-6).
  Etik sonucu ceza miktarı değil, savunmanın çöküşü, suç duyurusu ve baroya bildirim taşır.
- **NİTELİK_191:** TCK 191/1 alt sınır **2 yıl** hapis; TCK 191/8 uyarınca **HAGB**; beş yıl denetim süresi
  (CMK 231/8), denetimli serbestlik ve gerekirse tedavi (TCK 191/3). Ek savunma verilmiştir (CMK 226/1, 226/3).
- **BERAAT_B / BERAAT_E:** ceza yok; tahliye (adli kontrol varsa kaldırılması), tazminat hakkı bildirimi (CMK 141/1-e,
  142), maddenin müsaderesi (TCK 54).
- Dosya ekranı ceza aralığı etiketleri: “Beraat · 191: 2 yıl, HAGB · 62: 12y6a · 30 yıl” (HAGB ve erteleme ≤ 2 yıl
  sınırına uygun: CMK 231/5, TCK 51/1).

## 3. Usul akışı

- **Soruşturma:** avukat dosyayı UYAP'tan inceler; emanetteki eşyayı ve fotoğrafları görür, dokunmaz (CMK 153);
  tanıklarla görüşür ama yönlendirmez; özel şirket kayıtlarını mahkemenin ara kararıyla ister (CMK 177).
- **1. celse** (`cs_1`): açılış ve yoklama (CMK 191), iddianame özeti, sanığın sorgusu ve hakları (CMK 147, 191),
  müdafiin soruları (CMK 201), kolluk tanığının yemini ve dinlenmesi (CMK 58), çapraz sorgu, delil istemleri (CMK 206/1),
  tutukluluk incelemesi (CMK 108/3, 109), erteleme.
- **2. celse** (`cs_2`): ara karar cevapları ve gecikmeli deliller, tanıklar (Nesrin; muhbir zorla getirilmiş, CMK 44, 48),
  delillerin tartışılması (CMK 206, 217), mütalaa ve cevap (CMK 216/2), gerektiğinde nitelik değişikliği hatırlatması ve
  ek savunma (CMK 226), esas hakkında savunma, son söz (CMK 216/3), hüküm (CMK 223, 231/4 ayakta dinleme).
- Görevli mahkeme ağır ceza (5235 md. 12: alt sınır 10 yıldan fazla); sahnede iki hâkim gösterilir (Dava #07'deki gibi
  tasarım sınırı; heyet üç hâkimdir).

## 4. Yorum gerektiren noktalar ve verilen kararlar

1. **“Telkin edici soru”, “duyum” ve “kanaat” itirazları:** Türk ceza muhakemesinde bunlar adlandırılmış itiraz
   kurumları değildir; başkanın soruyu yöneltme ve reddetme yetkisi (CMK 192, 201) ile delilin takdiri (CMK 210, 217)
   çerçevesinde oyunda “itiraz” olarak sunuldu (Dava #07 kararıyla aynı).
2. **Kapsam dışı arama:** Karar “şüphelinin kullanımındaki oda ve ortak alanlar” ile sınırlıyken üçüncü kişinin kilitli
   odası zorla açıldı. Bu bölümde elde edilen materyalin hukuka aykırı delil sayılması (Anayasa 38/6, CMK 206/2-a,
   217/2) bir yorumdur; uygulamada kararın kapsamının “adres” mi “kişi” mi olduğu tartışılır. Oyunda dışlama
   (`key_excluded`) şu sonucu doğurur: oda varsayımı çökmüş (`contra_s2`) ve şekerlik aklanmışsa (`jar_cleared`),
   arka oda materyali dışlandığında dosyada yalnızca muhbirin beyanı kalır. Etkin pişmanlık beklentisiyle verilmiş ve
   başka delille desteklenmeyen bir muhbir beyanının tek başına mahkûmiyete yetmeyeceği Yargıtay'ın yerleşik
   yaklaşımıdır (karar numarası verilmedi; ilke düzeyinde). “2 tane” yazışması iki yüzlüdür (Kaan'ın eylülde aldığı
   iki paket) ve destek sayılmadı. Bu yüzden `beraat_e` = `contra_s2 ∧ jar_cleared ∧ (muhbir sarsıldı ∨ key_excluded)`;
   mütalaa bu durumda beraat yönündedir (T_05E). Dışlama yoksa ve muhbir ayaktaysa aynı dairede ele geçen ticari
   materyal muhbirin “Daire 7'den aldım” sözünü destekler; savcı 188 ister (T_05M, `contra_s2` varyantı).
3. **CMK 119/4 (iki komşu) ihlali:** Savcı yokken tek komşu bulundurulmuş, o da kapı açıldıktan sonra çağrılmıştır.
   PR_S4_A bastırmasında Deniz ikinci tanığın yokluğunu da sorar; gerekçede iki eksiklik birlikte yer alır. Tek başına
   delili her zaman hükümsüz kılmaz; güvenilirliği zayıflatan bir usul aykırılığı olarak işlendi (sonuç doğurmaz).
4. **Şekerlikteki iki paket (ortak alan):** Savcılığın “ortak alanda ortak zilyetlik” yedek tezi, aynı stoktan gelme ve
   konum delilleriyle çürütülmezse mahkeme eylemi TCK 191 kapsamında kabul edebilir (CMK 225/2, 226). Kullanımın
   kendisi (saç analizi) iddianamedeki fiil olmadığından 191'e dönüşüm yalnızca bu iki paket üzerinden kurgulandı
   (CMK 225/1). Bu yüzden NİTELİK_191 `¬jar_cleared` ister: şekerlik aklanmışsa ve arka oda sanığa bağlanamıyorsa
   191'in dayanacağı bir zilyetlik kalmaz. 191 kararı ayrıca kullanıcı profilinin duruşmada kurulmasını
   (`contra_s5` ya da Kaan'ın kendi beyanı) ve muhbirin en az bir kez sorgulanmasını ister; T_05N savcı satırları
   yalnızca şekerlik aklanmamışken okunur.
5. **Müvekkilin kullanıcı olduğunu açıklaması:** Avukat müvekkilin rızası olmadan bu bilgiyi kullanamaz (Av.K. 36 sır
   saklama; aydınlatılmış rıza). Oyunda rıza yoksa soru Kaan'ı inkâra iter ve güvenilirlik düşer; rıza varsa beyan
   “kullanıcı ama satıcı değil” ayrımını güçlendirir.
6. **Sahte tanığın sonucu (TELKİN):** Savunma tanığının para karşılığı ifade verdiğinin anlaşılması halinde heyetin
   savunmanın “ev arkadaşı” anlatımına ve ona dayanan beyanlara itibar etmemesi CMK 217 takdiri içinde bir yorumdur;
   tasarım gereği bu sonuç önceliklidir. Delil yasağı ise takdire bağlı değildir: kolluk kilidin kesildiğini kabul
   ettiyse (`contra_s3`) arka oda materyali gerekçede açıkça dışlanır (Anayasa 38/6, CMK 206/2-a, 217/2) ve hüküm
   geriye kalanlara dayanır: şekerlik aklanmadıysa iki paket ve muhbir beyanı; aklandıysa muhbirin sorgulanmadan kalan
   beyanı ve “2 tane” yazışması. Bu son durum zayıf bir mahkûmiyettir ve bilinçli olarak öyle bırakıldı: yalanın
   savunmanın gerçeklerini de götürdüğü etik sondur. TCK 62 sanığın kendi davranışına bağlı olmadığı için uygulanır.
   Avukat ve abla hakkında suç duyurusu (TCK 272, 38) ve baroya bildirim hükümde yer alır.
7. **Tazminat bildirimi dayanağı:** Dava #07'deki ifade korunarak “CMK 141/1 ve 142” gösterildi; bildirimin hüküm
   fıkrasında yer alması uygulamaya uygundur.
8. **Muhbirin etkin pişmanlık saiki:** TCK 192/3'ün (haber alındıktan sonra yardım) beyanın değerini kendiliğinden
   düşürmediği savcının ağzından ayrıca söylenir; heyet beyanın neden verildiğini CMK 217 çerçevesinde değerlendirir.
9. **Gece vakti:** 11 Kasım 2025 Bursa (40,18° K, 29,07° D) gün doğumu NOAA güneş konumu algoritmasıyla (NOAA Global
   Monitoring Laboratory, “Solar Calculation Details”; standart kırılma −0,833°) **07.43 TSİ** hesaplandı (Türkiye
   2016'dan beri yıl boyu UTC+3). Gece vakti 06.43'te biter. İlk taslaktaki 06.05 baskın saati gece vaktine düşüyordu;
   baskın **07.00**'ye alındı ve bağlı saatler kaydırıldı: motorun dönüşü 07.15 (Nesrin), GPS 07.16, tanığın imzası
   07.35 (otuz beş dakika farkı korunur), arama bitişi 08.35, emanet tutanağı 08.50. 17 dakikalık pay, birkaç dakikalık
   hesap hatasına dayanıklıdır; hava hâlâ karanlıktır (sivil alacakaranlık ~07.15), itirazın çekiciliği bundandır.
10. **Avukatın tanıkla görüşmesi:** Ev sahibi ve kurye durağı sorumlusuyla görüşme serbesttir; yönlendirici soru
    (`nesrin_telkin`), duruşma öncesi dikte (TK_B) ve korkutma (NS_BASKI) cezalıdır. Muhbirle (karşı tarafın tanığı)
    görüşme hiç sunulmadı.
11. **Delile el koyma:** Bodrumdaki çantayı avukatın kendisinin alması delil zincirini koparır; mahkeme delili kabul
    etmez (CMK 123, 127, 206/2-a) ve baroya bildirim yapar.
12. **Hükmün delil zincirine bağlanması:** Beraat (223/2-e) delil zinciri kurulduğunda (`beraat_e`) verilir; esas
    savunmanın biçimi ve ikna sayacı hükmü değiştirmez. Oyun puanı yalnızca bir “özen” eşiği olarak kalır (7.500):
    zincir kurulduğu hâlde puan bunun altındaysa (tipik yoldan ~90 yanlış kart çifti kadar bilinçli kayıp) varsayılan
    mahkûmiyet okunur; gerekçe satırları bu durumda da duruşmada çürütülmüş hiçbir olguya dayanmaz: dışlanan arka oda
    materyali ve aklanan şekerlik gerekçeye girmez, muhbir sarsıldıysa heyetin çelişkileri “çevresel ayrıntı” sayan
    takdiri, döndüyse iki beyanından hiçbirinin esas alınmadığı yazılır; geriye kalan dayanak (“2 tane” yazışması ve
    kavanozdaki iz) açıkça bir delil takdiri olarak, ispat yükü sanığa yüklenmeden ifade edilir. Bu takdir, hukuken
    istinafta zor ayakta duracak zayıf bir mahkûmiyettir; epilogda Leyla bunu açıkça söyler (kayıt eksiksizdir,
    gerekçe zayıftır, istinaf yolu açıktır). Puan eşiği bir oyun kısıtıdır (kestirme oyunun beraat almasını
    engeller), hukuki bir iddia değildir. Eşiği düşüren ya da zincir için eşiksiz ikinci koşul ekleyen denemeler en
    kısa beraati tipik yolun %60'ının altına indirdiği için (tasarım belgesi §12) tek eşik korundu.
13. **Takvim:** 9 Kasım 2025 pazar, 11 Kasım salı, 13 Kasım perşembe (AMATEM randevusu), 14 Ocak 2026 çarşamba (Defne
    büroya gelir), 15–17 Ocak perşembe–cumartesi (soruşturma), 26 Ocak pazartesi (1. celse), 29 Ocak ve 5 Şubat
    perşembe (ara günler), 16 Şubat pazartesi (2. celse). Tedavi 9 Ekim perşembe başlar, test 30 Ekim perşembe.
    Kaan'ın “temiz gün” sayısı 3 Ekim'den sayılır (26 Ocak'ta 115, 16 Şubat'ta 136); tutukluluk 11 Kasım–26 Ocak
    arası 76 gündür.

## 5. Hassas konu denetimi

Lineup sınırı: cinsel suçlar, çocuklara yönelik suçlar ve terör yok — bu davada da yok. Uyuşturucu kullanımı **özendirmeden**
anlatıldı: kullanım ayrıntısı (yöntem, miktar, temin yolu) verilmez; kullanımın sonuçları (acil servis, tedavi, aile)
ve tedavinin cesaret olarak çerçevelenmesi öne çıkar. TCK 188/3'ün çocuğa satış cümlesi kullanılmadı.

## 6. Öz-inceleme kontrol listesi

- [x] Bütün madde atıfları güncel metinle doğrulandı (TCK 188, 191, 192, 49, 52, 61/7, 62, 6/1-e; CMK 44, 48, 118, 119,
      123, 127, 134, 177, 206, 217, 223, 225, 226, 273).
- [x] Ceza hesapları alt/üst sınırlar içinde ve aritmetik doğru (TCK 52/2'deki güncel 100 TL alt sınırı uygulandı).
- [x] Mahkemeye hitap “Sayın Başkan”; ağır ceza görevli.
- [x] Mahkûmiyet hükümlerinde istinaf süresi (CMK 273/1); HAGB'de itiraz (CMK 231/12); beraatte tazminat bildirimi.
- [x] Etik ihlal seçenekleri doğru maddeye bağlı (TCK 272, 38, 277; Av.K. 34, 36; CMK 123, 127, 158).
- [x] Madde atıfları gündelik konuşmada değil; geri bildirim, rapor, hüküm ve duruşmanın resmî dilinde.
