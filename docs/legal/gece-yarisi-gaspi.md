# Dava #05 "Gece Yarısı Gaspı" — Hukuki İnceleme Notları

> Durum: **Onaylandı (Claude, iç inceleme), 2026-10-21** (gözden geçirme sonrası hüküm mantığı yeniden incelendi). `meta.legalReview = { status: 'APPROVED', by: 'Claude (iç inceleme)', at: '2026-10-21' }`.
> Madde atıfları karakterlerin gündelik konuşmasında geçmez; Leyla'nın kısa açıklamalarında, seçenek geri bildirimlerinde,
> rapor ipuçlarında, hüküm/gerekçe metinlerinde ve duruşmanın resmî dilinde (başkan, savcı, Deniz'in talepleri) yer alır.

Metinler aşağıdaki güncel mevzuat PDF'leriyle karşılaştırılmıştır (erişim: 2026-10-20):

- TCK 5237 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5237.pdf
- CMK 5271 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5271.pdf
- PVSK 2559 (Polis Vazife ve Salahiyet Kanunu) — https://www.mevzuat.gov.tr/MevzuatMetin/1.3.2559.pdf
- 1136 sayılı Avukatlık Kanunu — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.1136.pdf
- Yakalama, Gözaltına Alma ve İfade Alma Yönetmeliği — https://cigm.adalet.gov.tr/ (teşhis hükmü içermediği doğrulandı; teşhis PVSK ek md. 6'dadır)

## 1. Kullanılan maddeler ve doğrulama

| Madde | Kullanıldığı yer | Kontrol edilen metin (kısa) |
|---|---|---|
| TCK 148/1 | BR_01 (B şıkkı), lawRef | Cebir/tehditle malı teslime ya da alınmasına karşı koymamaya mecbur kılma: 6–10 yıl. |
| TCK 149/1-a, h | İddianame, BR_01, H1_00, mütalaa, MAHKUMIYET/INDIRIM | Nitelikli yağma: silahla (a), gece vaktinde (h) … 10–15 yıl. |
| TCK 6/1-e, f | Hukuki not (gece vakti, silah tanımı) | Gece vakti: güneş batışından 1 saat sonra – doğuşundan 1 saat önce. Silah: kesici aletler ve fiilen saldırıya elverişli şeyler. |
| TCK 142/2-a | BR_01 (C şıkkı) | Kişinin üstünde/elinde taşıdığı eşyayı çekip alma (kapkaç) nitelikli hırsızlıktır; cebirle karşı koyma kırılırsa fiil yağmaya döner. |
| TCK 143 | BR_01 (D şıkkı) | Gece vakti artırımı hırsızlık suçlarına özgüdür; yağmada gece vakti 149/1-h'dir. |
| TCK 61/1 | MAHKUMIYET/INDIRIM, BR_01 | Temel cezanın belirlenmesinde işleniş biçimi, araç, zaman, yer… (iki nitelikli hâl alt sınırdan uzaklaşma gerekçesi). |
| TCK 62/1 | MAHKUMIYET/INDIRIM, S_TERDIT | Takdiri indirim altıda bir. |
| TCK 53, 63 | Mahkûmiyet hükümleri | Hak yoksunlukları; tutuklulukta geçen sürenin mahsubu. |
| TCK 51/1; CMK 231/5 | INDIRIM | Erteleme ve HAGB ≤ 2 yıl ceza ister; uygulanmaz. |
| TCK 272, 38 | Kadir Usta / Ali Rıza'ya söz ezberletme (geri bildirim) | Gerçeğe aykırı tanıklık; azmettirme. |
| TCK 277 | Mağdurun kapısında ısrar, mağdura özçekim gösterme (geri bildirim, AZIL) | Görülmekte olan davada gerçeğin ortaya çıkmasını engellemek ya da haksızlık oluşturmak amacıyla tanığı hukuka aykırı etkilemeye teşebbüs. |
| PVSK ek md. 6 | Leyla (INV_LEYLA), teşhis tutanağı geri bildirimleri, F1/F3/N4, esas savunma, hüküm gerekçeleri | Teşhisten önce tarif tutanağa geçer; birden fazla, aynı cinsten, görünüşçe benzer kişiler; numara; birbirini görmeme; en az iki tekrar ve "aralarında olmayabilir" hatırlatması; fotoğraf/görüntü dosyaya; fotoğrafla teşhiste tek fotoğraf ya da aynı kişinin farklı fotoğrafları yasak, fotoğraflar aynı büyüklük ve özellikte. |
| CMK 217 | Leyla, esas savunma, hüküm gerekçeleri | Hâkim duruşmada tartışılan delillere dayanır, vicdani kanaatle serbestçe takdir eder; hukuka uygun her türlü delil. |
| CMK 63, 67 | ERTELEME | Çözümü özel ve teknik bilgiyi gerektiren hâllerde bilirkişi atanması; bilirkişi raporu ve taraflara bildirim. |
| CMK 225/2 | MAHKUMIYET_H | Mahkeme, fiilin nitelendirilmesinde iddianameye bağlı değildir. |
| CMK 223/2-b, e | BERAAT_B, BERAAT_E | Suçun sanık tarafından işlenmediğinin sabit olması / işlendiğinin sabit olmaması. |
| CMK 141/1-e, 142; 231/3 | Beraat hükümleri | Tutuklandıktan sonra beraat edenin tazminat hakkı ve bildirimi. |
| CMK 177, 178 | INV_DIL, ARA_DIL, tanık bildirimleri | Savunma delil dilekçesi duruşmadan en az beş gün önce; reddedilen tanığın doğrudan getirilmesi. |
| CMK 201/1 | Salonda teşhis itirazı (H1_04), itiraz gerekçesi g_telkin, T_03X | Taraf avukatlarının doğrudan soru hakkı; soruya itirazda başkan karar verir. |
| CMK 210/1 | KD_YAZILI geri bildirimi | Delil bir tanığın açıklamasından ibaretse tanık duruşmada dinlenir; yazılı açıklama yerine geçmez. |
| CMK 215, 216 | T_01 (diyecek), T_03X (X_215), mütalaa, son söz | Delilden sonra diyecek; tartışma sırası; son söz sanığındır. |
| CMK 236/1 | H1_03 (mağdur yeminsiz dinlenir) | Mağdur tanık olarak dinlenirken yemin hariç tanıklık hükümleri uygulanır. |
| CMK 45/1-d | Hukuki not (Derya) | Üçüncü derece dahil kan hısımları tanıklıktan çekinebilir (kardeş evet; amca çocuğu dördüncü derece, hayır). |
| CMK 100, 101, 108, 109 | H1_05 tutukluluk, hüküm metni, ERTELEME (adli kontrolle tahliye) | Kuvvetli suç şüphesi; tutukluluğun incelenmesi; adli kontrol (yurt dışına çıkamama, belirli yerlere başvurma). |
| CMK 134 | H1_02 (D şıkkı) | El konulan cihazın incelenmesi mahkeme kararıyla ve kapsamla sınırlı. |
| CMK 158, 160 | ARA_KARAR, ARA_BILDIR, rapor | Suç duyurusu Cumhuriyet Başsavcılığına; savcının araştırma yükümlülüğü. |
| CMK 273/1 | Mahkûmiyet hükümleri | İstinaf: gerekçeli hükmün tebliğinden itibaren iki hafta. |
| Av.K. 34 | Bütün etik geri bildirimleri, AZIL | Avukat görevini özen, doğruluk ve onur içinde yerine getirir; meslek kurallarına uyar. |
| TBK 512/1 | AZIL gerekçesi | Vekil veren ve vekil sözleşmeyi her zaman tek taraflı sona erdirebilir. |
| Anayasa 38/4; AİHS 6/2 | BERAAT_E gerekçesi | Masumiyet karinesi; şüpheden sanık yararlanır. |

## 2. Ceza hesabı

- **BERAAT_B / BERAAT_E:** ceza yok; tahliye ya da adli kontrolün kaldırılması; CMK 141/1-e, 142 ve 231/3 uyarınca tazminat
  hakkının bildirimi. B'de mağdurun saatinin iadesi ve dosyanın Tolga Kılınç hakkındaki soruşturmaya gönderilmesi.
- **INDIRIM (silah unsuru düşer):** 149/1-a'nın uygulanmasına yer olmadığına; 149/1-h (gece vakti) tek başına nitelikli yağma
  aralığını (10–15 yıl) korur → temel ceza alt sınırdan **10 yıl** → TCK 62/1 (1/6 = 1 yıl 8 ay) → **8 yıl 4 ay**. TCK 53, 63.
  Ceza 2 yılın üstünde olduğundan HAGB (CMK 231/5) ve erteleme (TCK 51/1) yok.
- **MAHKUMIYET:** 149/1-a ve h birlikte; iki nitelikli hâl TCK 61/1 gereği alt sınırdan uzaklaşma gerekçesi → temel ceza
  **12 yıl** → TCK 62/1 (1/6 = 2 yıl) → **10 yıl**. TCK 53, 63. İstinaf CMK 273/1.
- **MAHKUMIYET_H (silah unsuru duruşmada düştü, terditli talep yok):** 149/1-a'nın uygulanmasına yer olmadığına; yalnız
  149/1-h; mağdurun yaşı ve yaralanması TCK 61/1 gereği alt sınırdan uzaklaşma gerekçesi → temel ceza **11 yıl** → TCK 62/1
  (1/6 = 1 yıl 10 ay) → **9 yıl 2 ay**. Nitelendirme mahkemenin resen görevidir (CMK 225/2). Bıçak çelişkisi tutanaktayken
  "silahla" mahkûmiyet kurulmaz.
- **ERTELEME:** hüküm yok; kayıtlar üzerinde bilirkişi incelemesi (CMK 63, 67), delil durumu ve tutuklulukta geçen süre
  gözetilerek imza yükümlülüğüyle tahliye (CMK 109), esas hakkında mütalaa için dosyanın savcılığa tevdii.
- **Çöküş:** ilgili mahkûmiyet hükmü; gerekçeye "savunmanın inandırıcılığı çöktü" notu eklenir (oyun içi açıklama).
- **Hükmün delile bağlılığı:** 223/2-b gerçek failin ikrarı ve saatin ele geçirilmesine (teslim), 223/2-e teşhisin çöktüğü,
  konum kaydının duruşmada cevaplandığı ve mazeretin bağımsız kayıtla doğrulandığı tam delil zincirine bağlıdır; skor
  yalnızca XP'yi ve sınır durumları belirler. Savcının beraat istediği dosyada mahkûmiyet ya da indirim kurulmaz.
- **AZIL:** hüküm yok; mahkeme bildirimleri ve vekâletin sona ermesi (bkz. §4.9).

## 3. Usul akışı

- **1. celse (cs_1):** açılış ve kimlik tespiti (CMK 191), iddianame özeti, sanığa hakları, sanığın savunması ve müdafinin
  soruları (CMK 201/1), savcının HızlıPaket ve telefon incelemesi talebi (müdafinin "giriş cihazı ve doğrulama özçekimi"
  eklemesi), mağdurun yeminsiz dinlenmesi (CMK 236/1) ve çapraz sorgu, salonda teşhis sorusuna itiraz, ara karar
  (müzekkereler, kolluk görevlisinin tanık olarak çağrılması) ve tutukluluk incelemesi (CMK 108; teşhisi sarsan bulgu varsa
  CMK 109/3-a, b ile adli kontrol).
- **Ara (üç hafta):** müzekkere cevapları; telefon inceleme raporu (CMK 134, kapsam 18.01 20.00 – 19.01 08.10); ek delil
  dilekçesi (CMK 177: duruşmadan en az beş gün önce); suç duyurusu (CMK 158).
- **2. celse (cs_2):** kayıtların tartışılması ve diyecek (CMK 215), kolluk görevlisinin tanıklığı ve çapraz sorgu, savunma
  tanıkları (Kadir Bayram; istenmişse Gamze Ateş ve Cemal Usta), savcının karşı sorusu (CMK 201/1), mütalaa, esas savunma,
  son söz (CMK 216/3), hükmün açıklanması.

## 4. Yorum gerektiren noktalar ve verilen kararlar

1. **İddianamede 149/1-h.** Lineup satırı "TCK 148, 149/1-a" der. Olay saati (23.42, ocak) TCK 6/1-e anlamında gece vaktidir;
   dikkatli bir savcı 149/1-h'yi de yazar. İddianame **149/1-a, h** olarak kurgulandı; bu, indirim sonucunu gerçekçi kıldı:
   silah unsuru düşse de gece vakti nedeniyle aralık değişmez, yalnızca temel ceza alt sınıra iner.
2. **Teşhis usulünün dayanağı.** Teşhis Yakalama, Gözaltına Alma ve İfade Alma Yönetmeliği'nde değil, **PVSK ek md. 6**'da
   düzenlidir (metin doğrulandı). Usule aykırı teşhis kanunda "hukuka aykırı delil" olarak sayılmaz; oyunda heyet, teşhisin
   güvencesiz olduğunu **CMK 217 takdiri** içinde değerlendirir ("hükme esas alınamaz" gerekçesi). Yerleşik Yargıtay
   uygulaması da tek fotoğrafla ya da tekrarı yapılmadan yaptırılan teşhisi tek başına mahkûmiyete yeterli görmez; oyunda
   karar künyesi verilmedi.
3. **Acil serviste tek fotoğraf gösterimi.** Teşhisten önce mağdura tek fotoğraf gösterilmesi PVSK ek md. 6'daki "tek fotoğraf
   üzerinden teşhis yaptırılamaz" kuralının açık ihlali ve sonraki teşhisi kirleten bir telkindir. Gösterimi kanıtlayan
   belge hemşire gözlem formudur (kamu hastanesi kaydı; mahkeme yazısıyla istenir).
4. **Salonda teşhis.** Sanık sandalyesindeki tek kişiye yöneltilen "bu mu?" sorusunun telkin olduğu doktrinde ve uygulamada
   kabul görür; mevzuatta açık bir yasak yoktur. Oyunda itiraz CMK 201/1 (soruya itiraz ve başkanın kararı) üzerinden
   kuruldu; başkan "salonda teşhise ayrıca değer vermez" der.
5. **İtiraz gerekçeleri (g_kanaat, g_duyum, g_telkin).** Dava #07'deki gibi: Türk usulünde ayrı itiraz kurumları değil;
   CMK 201/1 (soruya itiraz), 210 (doğrudan doğruyalık) ve 217 (takdir) çerçevesinde "diyecek" niteliğinde sunuldu.
6. **Özel şirket kayıtları.** HızlıPaket konum/oturum kayıtları ve UEDAŞ kesinti kaydı avukatın doğrudan isteyebileceği
   kayıtlar değildir; delil dilekçesiyle (CMK 177) mahkemeden müzekkere istenir. Kişisel veriler yargısal amaçla aktarılır
   (KVKK 28/1-d istisnası; oyunda atıf yok).
7. **Sanığın telefonu.** El konulan cihaz mahkeme kararıyla ve olay gecesiyle sınırlı incelenir (CMK 134). Raporda sanığın
   lehine çıkan mesaj ve arama kayıtları savunmanca kullanılabilir; savcının amacının "suç ortağı aramak" olması kaydın
   değerini değiştirmez.
8. **Tanığa ve mağdura yaklaşım.** Avukatın tanıkla görüşmesi yasak değildir; tanığa içerik ezberletmek ise Av.K. 34'e
   aykırıdır ve bilmediği bir saati söyletmek yalan tanıklığa azmettirme (TCK 272, 38) riskidir. Mağdurun kapısında ısrar
   ve mağdura tek fotoğraf göstermek, TCK 277'nin özel kastı (gerçeğin ortaya çıkmasını engelleme / haksızlık oluşturma)
   tartışmalı olsa da **soruşturulabilir** bir etkileme girişimidir; geri bildirimler "sayılabilir / değerlendirilebilir"
   diliyle yazıldı. Kesin olan meslek kuralı ihlalidir. Oyunda yönlendirme bedelsiz değildir: bakkala verilen cümle
   kahvehanede duyulur ve savcı ikinci celsede tutanağa geçirir; Kadir Usta'ya verilen saat savcının karşı sorusunda her
   durumda açığa çıkar ve o tanığın saati hükme esas alınmaz (gerekçeye ve etik epiloguna düşer).
9. **AZIL sonu.** Mağdura özçekim gösterildiği ortaya çıkınca mahkeme durumu tutanağa geçirir ve Baroya ve Başsavcılığa
   bildirir. Mağdurun beyanlarının ağırlığı ara kararla önceden dışlanmaz; hükümde delillerin bütünü içinde takdir edilir
   (CMK 217). Sanık vekâleti tek taraflı sona erdirir (TBK 512/1); dava başka
   müdafiyle sürer. Hüküm verilmediği için sonuç sınıfı OTHER'dır. Bu, Dava #07'nin "sahte ikrar = mahkûmiyet" sonundan farklı
   olarak verdict mantığını bozmaz: savunmanın diğer delilleri geçerli kalır, yalnızca bu avukatın dosyası kapanır.
10. **Ücretin üçüncü kişiden alınması.** Üçüncü kişinin ücret ödemesi kendi başına yasak değildir. Ödeyen kişinin menfaati
    müvekkilinkiyle çatışır hâle gelince (Tolga) ücretin iadesi ve müvekkilin bilgilendirilmesi gerekir; saklamak meslek
    kurallarına aykırıdır (Av.K. 34; TBB Meslek Kuralları, çıkar çatışması). Oyunda zarf yalnızca bu noktada bir etik karar olur.
11. **Avukatın şüpheliye yaklaşımı.** Avukatın şüpheliyi bulup sorgulaması yasak bir fiil değildir ama şüpheliyi uyarır ve
    delil karartma riski doğurur; doğru yol CMK 158 suç duyurusudur. Oyunda "yüzleşme" seçeneği etik ihlal değil, sonuca
    etkili bir mesleki hata olarak işlendi (Tolga kaçar; 223/2-b yolu kapanır).
12. **Derya'nın tanıklığı.** Derya, kardeşi Barış yönünden tanıklıktan çekinebilir (CMK 45/1-d: üçüncü derece dahil); kuzeni
    Tolga (dördüncü derece) yönünden çekinemez. Oyunda Derya'ya ne yapacağını söylemek yerine yolunu göstermek (D_SAVCI) doğru
    seçenek; Tolga'yı savcılığa onun götürmesi (teslim) bir aile kararıdır.
13. **Tahliye.** Teşhisi sarsan somut bulgu (acil gösterimi ya da ilk tarifle çelişki) kuvvetli suç şüphesini zayıflatır;
    mahkeme yurt dışına çıkış yasağı ve imza yükümlülüğüyle adli kontrole geçer (CMK 109/3-a, b). Mahkûmiyet hükümlerinde
    "tahliye edilmişse hükümle birlikte tutuklanmasına" ifadesi iki durumu kapsar (Dava #07 v2 notu #5 ile aynı kısıt).
14. **Kapkaç / yağma ayrımı.** Fail mağdurun karşı koymasını iterek kırdığı için fiil yağmadır (TCK 148); BR_01'deki kapkaç
    şıkkı (142/2-a) bu ayrımı öğretmek için yanlış seçenektir.

## 5. Hassas konu denetimi

Lineup sınırı: cinsel suçlar, çocuklara yönelik suçlar ve terör davaları yok. Bu davada: yok. Mağdur yetişkin; suç malvarlığına
yönelik yağma. Kaçak bahis yalnızca failin motivasyonu olarak anılır; ayrıntılandırılmaz.

## 6. Öz-inceleme kontrol listesi

- [x] Bütün madde atıfları güncel metinle doğrulandı (tablo dolu; erişim 2026-10-20).
- [x] Ceza hesapları alt/üst sınırlar içinde ve aritmetik doğru (12 yıl → 10 yıl; 10 yıl → 8 yıl 4 ay).
- [x] Mahkemeye hitap "Sayın Başkan"; heyet (başkan, üye hâkim) ve görevli mahkeme (Ağır Ceza) doğru.
- [x] Hüküm metinlerinde istinaf süresi (CMK 273/1) ve tazminat bildirimi (CMK 141/1-e, 142, 231/3) var.
- [x] Etik ihlal seçenekleri doğru maddeye bağlı (Av.K. 34; TCK 272/38; TCK 277; TBK 512/1).
- [x] Hüküm skordan değil delilden çıkar; savcı beraat istediğinde mahkûmiyet/indirim yok; silah unsuru düştüyse 149/1-a yok.
- [x] 9 yıl 2 ay (11 yıl − 1/6) ve ERTELEME'nin usul dayanakları (CMK 63, 67, 109, 216) kontrol edildi.
- [x] Mağdur yeminsiz dinlendi (CMK 236/1); delil dilekçesi süresi (CMK 177) metinde geçiyor.
