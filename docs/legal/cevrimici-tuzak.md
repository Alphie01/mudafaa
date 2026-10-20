# Dava #02 "Çevrimiçi Tuzak" — Hukuki İnceleme Notları

> Durum: **Onaylandı — Claude (iç inceleme), 2026-10-20.** `meta.legalReview = { status: 'APPROVED', by: 'Claude (iç
> inceleme)', at: '2026-10-20' }`. Kullanıcı kararı (lineup): hukuki incelemeyi Claude üstlenir. Aşağıdaki "yorum gerektiren
> noktalar" bir insan avukatın ikinci okumasına açıktır; içerik değişikliği yalnızca `content/` verisini ve golden path'leri etkiler.

Metinler aşağıdaki güncel mevzuat PDF'leriyle karşılaştırılmıştır (erişim: 2026-10-20; metinler `pdftotext` ile çıkarıldı):

- TCK 5237 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5237.pdf (7589 sayılı Kanunun 16/7/2026 tarihli değişiklikleri işlenmiş)
- CMK 5271 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5271.pdf (7589 sayılı Kanunla değişen 231 dahil)
- Avukatlık Kanunu 1136 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.1136.pdf
- 5320 sayılı Kanun geçici 3 (asliye cezada savcının duruşmaya katılmaması) — 2020'de sona erdi; AYM 2012/10, İHAM *İmret/Türkiye* (2024) kaynaklarından teyit.

## 1. Kullanılan maddeler ve doğrulama

| Madde | Kullanıldığı yer | Kontrol edilen metin (kısa) |
|---|---|---|
| TCK 158/1-f ve son cümle | künye, BR_01 (A–D), hükümler | Bilişim sistemleri, banka veya kredi kurumlarının araç olarak kullanılması; 3–10 yıl hapis ve 5.000 güne kadar adli para; (e),(f),(j),(k),(l) hâllerinde hapsin alt sınırı **4 yıl**, adli para **menfaatin iki katından az olamaz** (6763/14). |
| TCK 158/4 (Ek: 16/7/2026-7589/13) | BR_01K, T_04 (B), T_07 (C), INDIRIM | İştirak, hesabın kullanılmasını sağlayan zorunlu bilgi/araçları haksız menfaat amacıyla başkasına vermekle sınırlıysa ceza **yarı oranında indirilir**. Yürürlük 31/7/2026. |
| TCK 158/3 | (kullanılmadı; not) | Üç veya daha fazla kişiyle birlikte işlenme → yarı oranında artırım. İddianame bu bendi içermediği için görevli mahkeme asliye cezadır (§3). |
| TCK 7/2 | BR_01K, INDIRIM | Suç tarihi ile sonraki kanun farklıysa failin lehine olan uygulanır. |
| TCK 21/1, 37/1, 39, 40/1 | Leyla (gün 1), T_04 (A), hükümler | Kast: bilerek ve isteyerek; birlikte gerçekleştiren fail; yardım edene cezanın yarısı indirilir (39/1), araç sağlama (39/2-b); iştirak için kasten ve hukuka aykırı işlenmiş bir fiil (40/1). |
| TCK 52/1–2 | hükümler | Gün sayısı × günlük miktar; günlük miktar **100–500 TL** (7499, 2024). |
| TCK 53, 62/1 | hükümler | Hak yoksunlukları; takdiri indirim altıda bire kadar. |
| TCK 51/1 | MAHKUMIYET | Erteleme ≤ 2 yıl hapis. |
| TCK 106, 136, 243, 267, 277 | etik seçenekler, rapor | Tehdit; kişisel verileri hukuka aykırı ele geçirme; bilişim sistemine girme; iftira; "görülmekte olan bir davada" tanığı etkilemeye teşebbüs. |
| CMK 48 | T_01, T_02, PR_O4 | Tanık kendini suçlayabilecek sorulara cevap vermekten çekinebilir; önceden bildirilir. |
| CMK 109/3-a, 110 | RQ_YASAK, hükümler | Yurt dışına çıkamamak adli kontrol yükümlülüğü; kaldırılması. |
| CMK 135/6 | INV1_DIL, H1_06, ARA_SUC, ev_hts, ev_imei_rapor | Şüpheli/sanığın telekomünikasyon yoluyla iletişiminin tespiti; kovuşturmada **mahkeme kararı**, soruşturmada hâkim kararı. 135/8 kataloğu dinleme içindir; tespit için katalog yoktur. |
| CMK 147/1-e | TAV_C, H1_02 | Susma hakkı. |
| CMK 158, 160/2 | ARA_SUC, T_05 (B), rapor | Suç duyurusu; savcının lehe ve aleyhe delilleri toplama yükümlülüğü (eksik soruşturma). |
| CMK 177 | INV1_DIL | Savunma delillerinin toplanması dilekçesi, duruşmadan en az beş gün önce. |
| CMK 188/1 | duruşma kadrosu | Hâkim, savcı ve kâtibin hazır bulunması şarttır. |
| CMK 201/1 | H1_03, T_02P, T01Q_C | Savcı ve müdafi sanığa, tanığa, katılana doğrudan soru yöneltir; itiraz üzerine hâkim karar verir. |
| CMK 215, 216, 217 | T_035, T_045, T_05, gerekçeler | Diyecek; söz sırası katılan → savcı → sanık/müdafi; cevap hakkı (216/2); son söz (216/3); duruşmada tartışılmış delil (217). |
| CMK 223/2-b, 223/2-e | beraat hükümleri | Suçun sanık tarafından işlenmediğinin sabit olması / işlendiğinin sabit olmaması. |
| CMK 231/5, 231/6, 231/9 (7589 ile değişik) | INDIRIM | HAGB: ≤ 2 yıl hapis veya adli para; (c) zararın giderilmesi; derhal giderilemezse denetim süresince aylık taksitle giderme koşulu. |
| CMK 237/1 | H1_01 | Suçtan zarar gören, hüküm verilinceye kadar kamu davasına katılabilir. |
| CMK 273/1 | hükümler | İstinaf: hükmün gerekçesiyle tebliğinden itibaren iki hafta. |
| CMK 141/1 | (bilinçli olarak kullanılmadı) | Tazminat bentleri yakalama/tutuklama ve bazı adli kontroller (l: konutu terk etmeme, tedavi) içindir; yurt dışı yasağı kapsanmaz → beraat hükümlerinde 141 bildirimi yapılmadı. |
| Av.K. 34, 38/1-b | etik seçenekler, ETIK kartı | Doğruluk ve meslek kurallarına uyma yükümlülüğü; aynı işte menfaati zıt tarafa avukatlık yasağı (kurye Arda'ya hukuki yardım verilmemesi). |
| KVKK md. 11 | INV1_OPERATOR | İlgili kişinin kendi verisine erişim hakkı (abonenin kendi işlem dökümünü istemesi). |

## 2. Ceza hesabı

Menfaat (kapora): 75.000 TL → adli para cezası tabanı 150.000 TL (158/1 son cümle).

- **MAHKUMIYET / ETIK** (158/1-f, 37/1): temel ceza alt sınırdan **4 yıl hapis** ve 1.500 gün (×100 TL = 150.000 TL ≥ taban)
  → TCK 62/1 (1/6): **3 yıl 4 ay hapis**, 1.250 gün → günlüğü 100 TL'den **125.000 TL**. TCK 53. Ceza 2 yılı aştığından
  erteleme (TCK 51/1) ve HAGB (CMK 231/5) yok. Sanık tutuksuz olduğundan mahsup yok.
- **INDIRIM** (158/1-f, 37/1 + 158/4, TCK 7/2): 4 yıl + 1.500 gün → 158/4 (1/2): **2 yıl**, 750 gün → TCK 62/1: **1 yıl 8 ay**,
  625 gün × 100 TL = **62.500 TL** → CMK 231/5 HAGB (231/6-a, b; c koşulu 231/9 uyarınca denetim süresinde aylık taksitle),
  beş yıl denetim (231/8). HAGB kararında hapis ertelenemez (231/7). Kanun yolu: istinaf (231/12, 7499 ile itirazdan istinafa çevrildi).
- **BERAAT_B / BERAAT_E**: ceza yok; adli kontrol (yurt dışı yasağı) kaldırılır; 223/2-b'de Necdet Sarı ve diğerleri
  hakkında dosya örneği Başsavcılığa; 223/2-e'de kimliği belirsiz failler için soruşturmaya devam.

## 3. Usul akışı
- **Görevli mahkeme:** 158/1-f'nin üst sınırı 10 yıl olduğundan asliye ceza (5235 md. 12: ağır ceza "on yıldan fazla"
  hapis gerektiren suçlar). Tek hâkim; hitap "Sayın Hâkim". 2020'den beri savcı asliye ceza duruşmalarında hazır bulunur
  (CMK 188/1; 5320 geçici 3'ün süresi doldu).
- **1. celse:** açılış ve kimlik; katılma talebi (237); sanığın sorgusu ve hakların hatırlatılması (147); sanığa sorular
  (201); katılanın beyanı ve soruları; kolluk görevlisinin tanıklığı (yemin, 201); taleplerin alınması; ara karar
  (eksik delillerin toplanması, tanıkların çağrılması; mahkeme maddi gerçeği resen de araştırır); erteleme.
- **Ara:** kayıtların gelişi; suç duyurusu (158) ve İMEİ sorgusu için soruşturma evresinde hâkim kararı (135/6).
- **2. celse:** ara karar cevapları; tanıklar (48 uyarısı, 201 itirazları); diyecek (215); söz sırası katılan → savcı
  mütalaası → müdafi cevabı (216/1-2); esas savunma; son söz (216/3); hüküm ayakta dinlenir (231/4).

## 4. Yorum gerektiren noktalar ve verilen kararlar
1. **158/4 ile TCK 39'un birlikte uygulanması.** 7589 sayılı Kanunla gelen 158/4, iştirakin hesap bilgisi vermekle sınırlı
   olmasını yarı oranında indirime bağlar. Katkı yardım etme (39/2-b) olarak nitelendirilirse 39/1 indirimi de gündeme
   gelebilir. *Karar:* INDIRIM hükmünde aynı katkı için çifte indirim yapılmadı; 158/4'ün bu katkı biçimini özel olarak
   düzenlediği kabul edildi ve gerekçeye yazıldı. Karşı görüş (önce 39, sonra 158/4) cezayı 10 aya indirirdi; uygulama
   oluşunca güncellenmelidir.
2. **Müşterek faillik / yardım etme ayrımı.** İddianame sanığı 37/1 uyarınca fail sayar ("işlemleri bizzat yaparak").
   Banka kaydı işlemlerin başka cihazdan yapıldığını gösterdiğinde müşterek faillik iddiası çöker; geriye "kodu vermek"
   kalır. Kast yoksa (aldatma: TCK 21/1, 40/1) hiçbir iştirak biçimi oluşmaz → beraat. Kast kabul edilirse katkı 158/4
   kapsamındadır → INDIRIM.
3. **223/2-b mi, 223/2-e mi, 223/2-c mi?** Aldatılan hesap sahibi için Yargıtay uygulamasında sık görülen gerekçe
   "kesin ve inandırıcı delil yokluğu"dur (2-e). Gerçek fail belgeyle gösterildiğinde (İMEİ + kartvizit + sahte vekâletname)
   "sanık tarafından işlenmediğinin sabit olması" (2-b) seçildi. Kast yokluğu (2-c) da savunulabilirdi; lineup'ın iki beraat
   sınıfı 2-b ve 2-e olduğundan 2-c kullanılmadı.
4. **Sanığın kendi hattı için 135/6.** Kovuşturmada sanığın hattı için tespit kararını mahkeme verir; savunma talebiyle
   istenebilir. Başkasının hattı/cihazı için ancak o kişi şüpheli olduğunda soruşturmada hâkim kararıyla tespit yapılabilir;
   bu yüzden İMEİ sorgusu suç duyurusu üzerinden kurgulandı ve rapor "Bursa C. Başsavcılığı" kaynaklı gösterildi.
5. **İMEİ sorgusunun 135/6 kapsamında sayılması.** Bir cihazda kullanılan hatların belirlenmesi "iletişimin tespiti"
   niteliğinde değerlendirildi ve hâkim kararına bağlandı (kişisel veri ve haberleşme gizliliği).
6. **Abonenin kendi işlem dökümü.** Operatörün aboneye kendi SIM değişikliği kaydını vermesi KVKK md. 11 ile
   temellendirildi; avukat kimliğiyle verilmemesi ve abonenin bizzat istemesi gerçekçi bir uygulama olarak yazıldı.
7. **Asliye cezada katılanın ve tanıkların sorgulanması.** Müdafinin katılana doğrudan soru sorması 201/1'e uygundur;
   katılana yönelik "neden gönderdiniz" sorusu hukuken yasak değil, ama oyunda kötü strateji (mağduru suçlama) olarak işlendi.
8. **"Telkin edici/yönlendirici soru" itirazı.** CMK'da ayrı bir "telkin edici soru" yasağı yoktur; 201/1 itiraz üzerine
   sorunun yöneltilip yöneltilmeyeceğine hâkimin karar vermesini düzenler. Dava #07'deki `g_telkin` gerekçesiyle tutarlı
   olarak "cevabı içinde taşıyan soru" itirazı bu çerçevede kabul edildi.
9. **Kurye Arda ile görüşme.** Kurye, ayrı bir dosyada şüpheli olabileceğinden ve çıkarı sanıkla çatışabileceğinden
   müdafinin ona hukuki yardım vermemesi, ifade almaması ve baroya (adli yardım/CMK servisi) yönlendirmesi doğru yol
   sayıldı (Av.K. 34, 38/1-b kıyasen). Yazılı beyan almak meslek kuralı ihlali (hafif), cümle dikte etmek TCK 277 (ağır).
10. **Katılanla doğrudan temas.** Avukatı olmayan katılanla konuşmak yasak değildir; avukatın kimin vekili olduğunu
    açıklaması, yanıltmaması ve söz vermemesi gerekir. "Paranızı geri alacağız" sözü yanıltıcı ve müvekkil aleyhine bir
    kabul gibi okunur; "şikâyetten vazgeçin" telkini hem etik ihlali hem de hukuken anlamsızdır (158 şikâyete bağlı değildir).
11. **Yurt dışı çıkış yasağının kaldırılması (1. celse).** Delil durumunun değiştiği hâllerde (iki çürütme) mahkemenin
    adli kontrolü kaldırması makul bir takdir olarak yazıldı.
12. **Asliye cezada "Türk Milleti Adına" başlığı ve heyet yerine tek hâkim.** Hükümler tek hâkim tarafından kurulur;
    başlık her hükümde kullanılır.
13. **ETİK sonucunda mahkûmiyet.** Hukuka aykırı delilin dışlanması kendi başına mahkûmiyet sebebi değildir; ETİK sonu,
    müdafinin hukuka uygun delilleri toplamadığı ve güvenilirliğini yitirdiği bir dosyada mahkemenin iddianameyi esas
    alması olarak kurgulandı; bu sonuca yalnızca açık etik ihlalleriyle ulaşılır.

## 5. Hassas konu denetimi
Lineup sınırı: cinsel suçlar, çocuklara yönelik suçlar ve terör yok. Bu davada: yok. Yaşlı mağdur ve hasta eş unsuru dram
için kullanıldı; TCK 158/1-c (algılama yeteneğinin zayıflığı) iddia edilmedi.

## 6. Öz-inceleme kontrol listesi
- [x] Bütün madde atıfları güncel metinle doğrulandı (tablo dolu; 7589 değişiklikleri dahil).
- [x] Ceza hesapları alt/üst sınırlar içinde ve aritmetik doğru (4 yıl → 3 yıl 4 ay; 4 yıl → 2 yıl → 1 yıl 8 ay; adli para tabanı).
- [x] Görevli mahkeme asliye ceza; tek hâkim; hitap "Sayın Hâkim"; savcı duruşmada.
- [x] Hükümlerde ve HAGB kararında istinaf (CMK 231/12, 273/1); adli kontrolün kaldırılması; suç duyurusu.
- [x] Etik ihlal seçenekleri doğru maddeye bağlı (Av.K. 34, 38; TCK 136, 243, 267, 277).
- [x] Delil yasakları: yetkisiz erişimle alınan kayıt (Anayasa 38/6; CMK 206/2-a, 217/2).
