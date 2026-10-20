# Dava #09 — Sahte İmza · Hukuki İnceleme Notları

> Durum: **Onaylandı** — `meta.legalReview = { status: 'APPROVED', by: 'Claude (iç inceleme)', at: '2026-10-21' }`
> (Dava #07 ile aynı iç inceleme biçimi). Kaynak: `content/src/sahte-imza/`, tasarım: `docs/content/sahte-imza.md`.

## 1. Kullanılan maddeler ve doğrulama

Metinler mevzuat.gov.tr'deki güncel 5237 sayılı TCK, 5271 sayılı CMK, 1136 sayılı Avukatlık Kanunu, 1512 sayılı Noterlik
Kanunu ve 4721 sayılı TMK metinleriyle karşılaştırıldı (erişim: 2026-10-20; çevrimdışı çalışmada en son bilinen metin esas
alındı, fıkra numaraları bu metne göredir).

| Madde | Kullanıldığı yer | Kontrol edilen içerik (kısa) |
|---|---|---|
| TCK 204/1 | İddianame, BR_01, hükümler | Resmî belgeyi sahte düzenleme, değiştirme, sahte belgeyi kullanma: 2–5 yıl hapis. |
| TCK 204/2 | BR_01 (yanlış seçenek) | Görevi gereği düzenleme yetkisi olan kamu görevlisi: 3–8 yıl. |
| TCK 204/3 | BR_01 (Leyla'nın notu) | Kanun hükmü gereği sahteliği sabit oluncaya kadar geçerli belgede ceza yarı oranında artırılır; iddianamede yok. |
| TCK 207/1 | BR_01, BR_01B, rapor ipuçları | Özel belgede sahtecilik: 1–3 yıl. Makbuz, irsaliye, kargo fişi özel belgedir. |
| TCK 158 | BR_01 (yanlış seçenek) | Nitelikli dolandırıcılık; bu iddianamenin konusu değil (Tarık hakkındaki soruşturmada anılır). |
| TCK 61, 62/1 | INDIRIM, MAHKUMIYET, COKUS | Temel ceza tayini; takdiri indirim altıda bir. |
| TCK 51/1 | INDIRIM | 2 yıl veya daha az hapis cezası ertelenebilir. |
| TCK 267 | SUC_NERMIN | Dayanaksız suç duyurusunun iftira riski. |
| TCK 272, 38 | MQ_YALAN, ETIK | Yalan tanıklık ve azmettirme. |
| TCK 106 | AK2_BILDIR | Tehdit (bildirim). |
| CMK 45/1-c, 46, 48 | C2_03C | Üçüncü derece dahil kan hısımı tanıklıktan çekinebilir; hatırlatma zorunlu; kendini veya yakınını suçlayan sorulara cevap vermeme. |
| CMK 51 | C203C_B (yanlış seçenek) | Tanıklıktan çekinebilecek olanlar yeminden de çekinebilir; bu hak tanığındır, müdafiin talebi değildir. |
| CMK 52, 201 | İtiraz gerekçeleri, C2_01 | Tanık bildiklerini anlatır; taraflar doğrudan soru sorar, tereddütte mahkeme karar verir. |
| CMK 63, 67/5, 68 | DIL_BILIRKISI, C1_05, T_BILIRKISI, C2_04, UST_KURUL | Bilirkişi ataması; rapora karşı görüş ve yeni bilirkişi istemi; bilirkişinin dinlenmesi. |
| CMK 67/3 | C105_B, C204B_B (yanlış seçenekler) | Bilirkişi uzmanlık dışı açıklama, hukuki nitelendirme ve değerlendirme yapamaz (6754 s. Kanunla değişik). Soruşturmadaki rapor yalnızca teknik bir tespit ("aynı elin ürünü") içerdiği için bu itiraz dayanaksızdır. |
| CMK 147/1-e | C103_D | Susma hakkı. |
| CMK 158 | ARA_SUC, TG_GIT | Suç duyurusu Cumhuriyet Başsavcılığına yapılır. |
| CMK 177, 178, 332 | Dilekçe, tanık listesi | Duruşma hazırlığında delil ve tanık istemi; doğrudan davet; kurumlardan bilgi istenmesi. |
| CMK 206/2-a, 217 | C1_04 itirazı, gerekçeler, UST_KURUL | Hukuka aykırı delil (rapor bu kapsamda değil); vicdani kanaat ve delillerin takdiri. |
| CMK 223/2-b, 223/2-e | BERAAT_B, BERAAT_E | Suçun sanık tarafından işlenmediğinin sabit olması; mahkûmiyete yeter delil bulunmaması. |
| CMK 231/3, 141, 142 | Beraat hükümleri | Tazminat hakkının bildirilmesi. |
| CMK 231/5, 231/6-c | INDIRIM, C206_I | HAGB için zararın giderilmesi şartı. |
| CMK 272, 273/1 | Hükümler | İstinaf; tebliğden itibaren iki hafta (7499 s. Kanun sonrası metin). |
| Av.K. 34, 36 | Etik geri bildirimleri | Özen ve doğruluk; sır saklama. |
| TMK 462 vd. | HQ_IFADE | Vasi altındaki kişi adına işlemler ve vasinin izni. |
| TBK 512/1 | ETIK | Vekâlet ilişkisinin tek taraflı sona erdirilmesi (azil). |

## 2. Ceza hesabı

- **BERAAT_B / BERAAT_E:** ceza yok; adli kontrol kaldırılır; CMK 141–142 tazminat bildirimi (CMK 231/3); suç duyurusu /
  dosya örneğinin Başsavcılığa gönderilmesi.
- **INDIRIM:** TCK 204/1 alt sınır 2 yıl → TCK 62/1 (1/6 indirim) → **1 yıl 8 ay**. Ceza 2 yılı aşmadığından TCK 51/1
  ertelemesi mümkün; denetim süresi 1 yıl (TCK 51/3: 1–3 yıl). HAGB: mağdurun zararı giderilmediği için CMK 231/6-c
  şartı yok → uygulanmaz.
- **UST_KURUL:** hüküm yok (ara karar). Dosya, iki bilirkişi raporu arasındaki çelişkinin giderilmesi için Adli Tıp
  Kurumu Fizik İhtisas Kurulu'na gönderilir; Adli Tıp raporu gözetilerek adli kontrol kaldırılır; duruşma ertelenir.
- **MAHKUMIYET / COKUS:** Temel ceza zararın ağırlığı gözetilerek 3 yıl (TCK 61/1) → TCK 62/1 → **2 yıl 6 ay**. 2 yılı
  aştığından erteleme (TCK 51/1) ve HAGB (CMK 231/5) yok. Hüküm kesinleşmediğinden tutuklama yok; sanık serbest.

## 3. Usul akışı

- Görevli mahkeme: Asliye Ceza (TCK 204/1 üst sınırı 5 yıl; ağır ceza görev sınırı 10 yıl üstü). Tek hâkim, savcı,
  kâtip, mübaşir. Mahkemeye hitap "Sayın Hâkim".
- 1. celse: açılış ve kimlik tespiti (CMK 191), iddianamenin özeti, sanığın savunması ve soru (CMK 191/3, 201), şikâyetçinin
  beyanı, tanık (tapu memuru, yeminli; CMK 54), bilirkişi raporunun okunması ve itiraz (CMK 67/4–5, 209), delil talepleri
  (CMK 177), ara karar ve erteleme.
- Ara evre: müzekkere cevapları; suç duyurusu (CMK 158); tanık listesi (CMK 177/178).
- 2. celse: cevapların okunması, tanıklar (kurye, alıcı, akraba tanık; CMK 45/48 hatırlatması), delillerin tartışılması
  (CMK 215), mütalaa ve esas savunma (CMK 216/1), son söz (CMK 216/3), hüküm (CMK 223), istinaf (CMK 272–273).

## 4. Yorum gerektiren noktalar ve verilen kararlar

1. **Noter suretinin niteliği.** Sahte "aslı gibidir" şerhli suret resmî belge sahteciliğinin konusudur (TCK 204/1). Noter
   senetleri Noterlik Kanunu 82 uyarınca aksi sabit oluncaya kadar geçerli olduğundan 204/3 tartışılabilir; iddianamede
   uygulanmadığı için oyunda yalnızca Leyla'nın notunda geçer, mütalaada istenmez (ek savunma, CMK 226, gerektirmemek için).
2. **Tapu senedindeki imza ve "kullanma".** Sahte sureti tapuda kullanan ve senedi imzalayan kişi Tarık'tır; senedin kendisi
   gerçek bir resmî belgedir, içerik olarak yanlış beyan içerir. İddianame sanığa sahte sureti düzenleme ve kullanma
   eylemlerini yüklemiştir; hükümler bu çerçevede kurulmuştur.
3. **Mukayese imzası.** Grafoloji incelemesinde mukayese imzalarının tartışmasız olması (resmî makam önünde atılmış ya da
   sanıkça kabul edilmiş) yerleşik uygulamadır; soruşturmadaki rapor özel belgelerle ve kaynağı belirsiz örneklerle
   yapıldığı için CMK 67/5 kapsamında yeni bilirkişi istemi kabul edilir. Rapor hukuka aykırı delil değildir; itiraz
   ispat gücüne yöneltilir (C105_B yanlış seçenek).
4. **Avukatın tanıkla görüşmesi.** Savunma tanıklarıyla (kurye) duruşma öncesi görüşmek yasak değildir; yönlendirme ve söz
   koyma (SQ_KOCLUK, MQ_YALAN) meslek kuralı ihlalidir. Savcılık tanığına (tapu memuru) gidilmemesi bir tavsiye olarak
   işlenmiştir.
5. **Akraba tanık.** Yeğen, üçüncü derece kan hısımıdır; CMK 45/1-c çekinme hakkı vardır ve CMK 46 hatırlatması zorunludur.
   Tanığın susması (CMK 48) tek başına delil sayılmaz; BERAAT_B koşulu belgelere (Adli Tıp ek raporu, randevu kaydı, teslim
   tutanağı, mahsup beyanı) dayanır.
6. **Suç duyurusu.** Somut delillere dayanan bildirim (SUC_SOMUT) doğru yoldur; savcılığın üçüncü kişinin resmî imza
   örneklerini toplaması ve Adli Tıp'a göndermesi oyunda ek raporla temsil edilir. Dayanaksız bildirim (SUC_NERMIN) iftira
   riskine bağlanmıştır.
7. **Mahkemenin "Tarık'ı şüpheli olarak dinleme" talebi.** Mahkeme soruşturma yürütmez; bu talep yanlış seçenektir
   (C203C_C).

8. **Adli Tıp raporunun kesinliği (oyun soyutlaması).** İmza incelemesinde sonucun kesinliği, gönderilen tartışmasız
   mukayese imzalarının sayısına ve çağdaşlığına bağlıdır. Müdafi talebini gerekçelendirip (irsaliyelerdeki iki ayrı el)
   kaynakları tek tek sayarsa (noter imza beyannamesi, banka imza kartonu, nüfus kaydı) mahkeme üçünü de celbeder ve
   rapor kesin olur (`bk_gerekce` → ev_rapor2). Gerekçesiz talepte yalnızca nüfus kaydındaki tek imza gider; Adli Tıp
   "kesin kanaate varılamadı, ek örnek gerekir" der (ev_rapor2_belirsiz). Bu, gerçek uygulamadaki "yetersiz mukayese
   malzemesi" sonucunun sadeleştirilmiş biçimidir. Rapor eki okunmadan (clue_mukayese_ozel) yeni bilirkişi seçeneği
   görünmez; savunma, neyin neden yetersiz olduğunu bilmeden bu talebi kuramaz.
9. **Kesin Adli Tıp raporu dosyadayken hüküm (UST_KURUL).** Dosyada sanığın el ürünü olmadığını söyleyen kesin bir Adli Tıp
   raporu varken mahkûmiyet, indirim ya da çöküş hükmü kurulmaz. Beraat için ayrıca bağımsız bir destek (sol el beyanı
   ya da mazeret) ve savunmanın raporu kürsüde öteki delillere bağlaması gerekir. Bunlar yoksa mahkeme, iki rapor
   arasındaki çelişkiyi kendisi çözmez; Yargıtay'ın yerleşik uygulaması doğrultusunda (bilirkişi raporları arasındaki
   çelişki giderilmeden hüküm kurulamaz; çelişki üst düzey bir kuruldan rapor alınarak giderilir) dosyayı Adli Tıp
   Kurumu'nun ilgili ihtisas kuruluna gönderir. Kurulun adı ("Fizik İhtisas Kurulu") Kurumun iç yapısına göre seçildi;
   madde numarası verilmedi. Mütalaa beraat yönünde olsa bile mahkeme mütalaayla bağlı değildir (CMK 217).
10. **Süreler (dramatik sıkıştırma).** Birinci celse 14 Ekim, ara evre 20 Ekim'de ("altı gün sonra") açılır, ikinci celse
   4 Kasım'dadır. Adli Tıp raporunun üç haftada gelmesi gerçek uygulamaya göre hızlıdır; metinde ara kararın "ivedi"
   şerhiyle açıklanır. Ek raporun (suç duyurusundan ~12 gün sonra, savcılığın ayrı soruşturmadaki örnekleri aynı
   incelemeye eklemesi) hızı da bilinçli bir sıkıştırmadır.
11. **Süreklilik.** Halit Ateş 14 yıl önce (2012) öldü; Tarık o sırada 27 yaşındaydı (2026'da 41). 1992 fotoğrafındaki
   yedi yaşındaki çocuk Tarık'tır.

## 5. Hassas konu denetimi

Cinsel suç, çocuklara yönelik suç ya da terör yok. Demans konusu (Hayriye Hanım) onurlu biçimde işlenir; ona imza/ifade
aldırmak etik ihlal olarak cezalandırılır. Bahis borcu yalnızca bir arka plan unsurudur.

## 6. Öz-inceleme kontrol listesi

- [x] Bütün madde atıfları güncel metinle karşılaştırıldı (tablo dolu).
- [x] Kesin Adli Tıp raporu dosyadayken hiçbir sonuç raporla çelişmez; mahkûmiyet/indirim gerekçeleri koşullu (dosyadaki delile göre).
- [x] Ceza hesapları alt/üst sınırlar içinde ve aritmetik doğru (2y → 1y8a; 3y → 2y6a).
- [x] Mahkemeye hitap "Sayın Hâkim"; asliye ceza, tek hâkim.
- [x] Hükümlerde istinaf (CMK 272, 273/1) ve tazminat bildirimi (CMK 231/3) var.
- [x] Etik ihlal seçenekleri doğru maddeye bağlı (Av.K. 34, 36; TCK 267, 272, 38; TMK 462).
- [x] Madde atıfları gündelik konuşmada değil; Leyla'nın açıklamaları, geri bildirimler, hüküm ve rapor metinlerinde.
