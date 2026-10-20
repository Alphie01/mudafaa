# Müdafaa — 15 Davalık Dizi (v1)

Kullanıcı kararı (2026-10-20):
- Oyunda **15 dava** olacak; her biri **90–120 dakikalık** bir hikâye sunacak.
- Hukuki incelemeyi Claude üstlenir: her dava yazımda hukuki öz-incelemeden geçer, ardından `legalReview: APPROVED (Claude)` olarak işaretlenir.

Tasarımdaki dört dava kartı adlarıyla korunur: #07 Gece Bekçisinin Sırrı, #08 Kırık Kadeh, #09 Sahte İmza, #10 Liman Gecesi (Kıdemli Avukat kilidi). Tasarımdaki örnek ceza rakamları güncel mevzuata göre düzeltilir (Dava #07'de yapıldığı gibi; bkz. plan Ek A.9).

## Ortak çerçeve
- **Büro:** Arslan Hukuk, Bursa. Oyuncu Av. Deniz Arslan'dır; mentor Leyla Erdem ve asistan kadrosu sabittir. Davalar ağırlıkla Bursa'da geçer (adliye, karakol, mahalle, sanayi, liman: Mudanya/Gemlik).
- **Rütbeler:**
  - #01–#09: rütbe şartı yok;
  - #10–#12: `KIDEMLI` (Kıdemli Avukat);
  - #13–#15: `ORTAK` (Ortak Avukat).
- **Zorluk** 1→5 artar. Erken davalar mekanikleri öğretir, ama hepsi 90–120 dakikalık tam hikâyelerdir.
- **Hassas konu sınırı:** cinsel suçlar, çocuklara yönelik suçlar ve terör davaları yoktur.
- **Sonuçlar:** her davada en az dört sonuç sınıfı bulunur: iki tür beraat (CMK 223/2-b gerçek fail ya da suçun işlenmediği, 223/2-e şüpheden yararlanma), indirim ya da farklı nitelendirme, mahkûmiyet. Davaya özgü bir "kötü avukatlık" sonu (etik ihlal, çöküş) olabilir.
- **Süre hedefi:** tipik oyunun golden path'i (çoğunlukla 223/2-e yolu) `npm run case:duration` ile 90–120 dakika ölçülür. Yöntem `docs/content/authoring-guide.md`'de.

## Dizi

| # | Başlık | Suç ve madde | Hukuki çekirdek (savunmanın ekseni) | Gerçek / ters köşe | Rütbe · Zorluk |
|---|---|---|---|---|---|
| 01 | Kayıp Cüzdan | Hırsızlık (TCK 141) | Kast ve vasıf: TCK 160 (kaybolmuş eşya üzerinde tasarruf) ile 141 ayrımı; teslim niyeti; kamera kaydının bütünlüğü | Müvekkil (üniversite öğrencisi) cüzdanı otobüste bulup teslim edecekti. Kartları kullanan, cüzdanın ilk sahibinden onu çalan yankesici şebekesidir. | — · 1 |
| 02 | Çevrimiçi Tuzak | Nitelikli dolandırıcılık (TCK 158/1-f) | Hesabın kimin elinde olduğu; SIM kart kopyalama (CMK 135/6 kayıtları); TCK 39 (yardım etme) ile müşterek faillik ayrımı | Müvekkilin kimlik bilgileri bir "iş ilanı" ile ele geçirilmiş, hesabı habersizce kullanılmış. Gerçek organizatör ilanı veren "işverendir". | — · 1 |
| 03 | Kırmızı Işık | Taksirle öldürme (TCK 85) | Kusur oranı ve bilirkişi raporuna itiraz (CMK 67); bilinçli taksir (TCK 22/3) ile basit taksir ayrımı; illiyet bağı | Kavşaktaki sinyalizasyon arızalıdır. Asıl çarpmayı yapıp kaçan ikinci bir araç vardır; müvekkilin aracı yayaya sonradan sürtünmüştür. | — · 2 |
| 04 | Beyaz Toz | Uyuşturucu ticareti (TCK 188/3) | 188 ile 191 (kullanmak için bulundurma) ayrımı: miktar, paketleme, terazi, iletişim; arama kararının kapsamı (CMK 119) | Madde ev arkadaşınındır. Paketleme ve terazi onun odasındadır; müvekkil kullanıcıdır ve satıcı değildir. | — · 2 |
| 05 | Gece Yarısı Gaspı | Yağma (TCK 148, 149/1-a) | Teşhis usulünün güvenilirliği (tek fotoğrafla teşhis, telkin), mazeret; CMK 217'de takdir | Benzer görünümlü kuzen. Mağdura gösterilen tek fotoğraf teşhisi kirletmiştir. | — · 2 |
| 06 | Son Mesaj | Şantaj (TCK 107/2) ve özel hayatın gizliliğini ihlal (TCK 134) | Mesajların kimden çıktığı (hesap ele geçirme, cihaz incelemesi); dijital delilin imaj alma ve hash ile korunması (CMK 134) | Müvekkilin telefonundaki mesajlar, onun hesabını ele geçiren eski iş ortağı tarafından gönderilmiştir. | — · 3 |
| 07 | Gece Bekçisinin Sırrı | Nitelikli hırsızlık (TCK 142/2-h, 143) | (mevcut) Teşhis, mazeret, hukuka aykırı arama; 90–120 dakikaya genişletilir: ikinci soruşturma evresi, 1. celse ile 2. celse arası yeni deliller, Murat ve Selin'in hesaplaşması | (mevcut) Murat Koç ile Selin Kaya | — · 3 |
| 08 | Kırık Kadeh | Kasten yaralama (TCK 86/1, 86/3-e) | Meşru müdafaa (TCK 25/1), sınırın aşılması (27/2), haksız tahrik (TCK 29); kemik kırığının derecesi (TCK 87 ile ilişkisi) | Bar kavgasında müvekkil saldırıya uğrayan taraftır. Görgü tanıklarının biri saldırganın arkadaşıdır. | — · 3 |
| 09 | Sahte İmza | Resmî belgede sahtecilik (TCK 204/1) | İmza incelemesi (bilirkişi, karşılaştırma imzaları), noter işlemleri; özel belge ile resmî belge ayrımı (TCK 207) | Tapu devrindeki imzayı, müvekkilin vekâletnamesini kopyalayan yeğeni atmıştır. | — · 3 |
| 10 | Liman Gecesi | Kasten öldürme (TCK 81/1) | Kastın yokluğu: neticesi sebebiyle ağırlaşmış yaralama (TCK 87/4), olası kast (TCK 21/2), haksız tahrik; otopsi raporu ve ölüm saatinin tespiti | Liman işçisinin ölümü. Müvekkilin vurduğu darbe öldürücü değildir; asıl ölüm sebebi sonradan gelen ikinci kişinin müdahalesidir. | KIDEMLI · 4 |
| 11 | Belediye Kasası | Zimmet (TCK 247/1-2) | Kullanıcı yetkileri ve log kayıtları; hizmet nedeniyle zilyetliğin kimde olduğu; etkin pişmanlık (TCK 248) seçeneğinin etik sınırı | Vezne sistemindeki açık, müvekkilin şifresini kullanan müdür yardımcısı tarafından istismar edilmiştir. | KIDEMLI · 4 |
| 12 | Zarf | Rüşvet (TCK 252) | İletişimin tespiti kararının kapsamı (CMK 135) ve hukuka aykırı delil (CMK 206/2-a, 217/2); kışkırtıcı ajan; rüşvet ile irtikap (TCK 250) ayrımı | Zarfı tapu memuru müvekkilin çekmecesine, ondan kurtulmak isteyen başka bir memur bırakmıştır. Dinleme kayıtları kapsam dışıdır. | KIDEMLI · 4 |
| 13 | Silinen Dosyalar | Bilişim sistemindeki verileri bozma ve yok etme (TCK 244/2), sisteme girme (TCK 243) | Log analizi, bilirkişi imajı, yetki ve rıza; "yetkisiz" girişin unsurları | Şirket verilerini silen, sigorta tazminatı için kendi sistemini sabote eden genel müdürdür. | ORTAK · 4 |
| 14 | Yanık Ev | Genel güvenliği kasten tehlikeye sokma (TCK 170/1-a) ve nitelikli dolandırıcılık, sigorta (TCK 158/1-k) | Yangın bilirkişi raporu (elektrik arızası mı, hızlandırıcı mı), sigorta poliçesinin zamanlaması; dolaylı delillerin zinciri | Yangın elektrik arızasıyla çıkmıştır. Hızlandırıcı izi, olay yerine sonradan giren bir eksperin sahte raporundandır. | ORTAK · 5 |
| 15 | Son Duruşma | Tasarlayarak kasten öldürme (TCK 82/1-a) | Tasarlamanın unsurları; haksız tahrik (TCK 29); üç celseye yayılan duruşma; tanıkların birbirini çürüten anlatımları | Büronun eski bir davasıyla bağlantılı final: mentor Leyla Erdem'in yıllar önceki bir müvekkilinin oğlu suçlanmıştır. Gerçek fail, davanın baş tanığıdır. | ORTAK · 5 |

## Her dava için zorunlu çıktılar
1. Hikâye kitabı `docs/content/<slug>.md`: gerçek ve kronoloji, kadro, delil zinciri, çelişkiler, node grafiği özeti, sonuçlar, golden path'ler, süre ölçümü.
2. Hukuki notlar `docs/legal/<slug>.md`: kullanılan maddeler ve doğrulama kaynağı (mevzuat.gov.tr), yorum gerektiren noktalar ve verilen kararlar.
3. İçerik `content/cases/<slug>/NN-*.json`: yazım kitiyle üretilir; kaynak `content/src/<slug>/`.
4. Her sonuç için golden path; tipik yolun ölçülen süresi 90–120 dakika.
5. `npm run case:validate -- <slug>`: PASSED (0 hata).
6. Yeni karakterler için sprite'lar `content/shared/sprites/<slug>-<ad>.json`; sahneler `content/cases/<slug>/assets/scenes/*.png` (yazım kitinin sahne render aracıyla).
