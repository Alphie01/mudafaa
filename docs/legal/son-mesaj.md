# Dava #06 "Son Mesaj" — Hukuki İnceleme Notları

> Durum: **Onaylandı (iç inceleme).** `meta.legalReview` → `{ status: 'APPROVED', by: 'Claude (iç inceleme)', at: '2026-10-20' }`.
> Üretim yayını öncesinde bir avukatın dış incelemesi önerilir (§4'teki yorum noktaları).

Metinler aşağıdaki güncel mevzuat metinleri esas alınarak yazılmış ve denetlenmiştir (erişim/kontrol: 2026-10-20):

- TCK 5237 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5237.pdf
- CMK 5271 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5271.pdf
- 1136 sayılı Avukatlık Kanunu — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.1136.pdf
- 5235 sayılı Adlî Yargı İlk Derece Mahkemeleri Kanunu (görev)
- Anayasa md. 20, 38; AİHS md. 6/2

## 1. Kullanılan maddeler ve doğrulama

| Madde | Kullanıldığı yer | Kontrol edilen metin (kısa) |
|---|---|---|
| TCK 107/1-2 | İddianame, BR_01 ceza sorusu, hüküm metinleri | 107/1: 1–3 yıl hapis ve 5.000 güne kadar adli para. 107/2: yarar sağlamak maksadıyla şeref veya saygınlığa zarar verecek hususların açıklanacağı tehdidi → aynı ceza. |
| TCK 43/1 | Zincirleme (üç gece, tek karar) | Ceza dörtte birden dörtte üçe kadar artırılır. |
| TCK 134/2 | Ses kaydının üçüncü kişiye iletilmesi | Özel hayata ilişkin görüntü veya sesleri ifşa: 2–5 yıl hapis. |
| TCK 139/1 | T04K_VAZGEC geri bildirimi | Bölümdeki suçlar (veri suçları hariç) şikâyete bağlıdır; 134 şikâyete bağlı, 107 değil. |
| TCK 73/4 | T04K_VAZGEC | Şikâyete bağlı suçta şikâyetten vazgeçme davayı düşürür; vazgeçme açık olmalıdır. |
| TCK 61, 62 | KISMI ve MAHKÛMİYET hesapları | Temel ceza → artırım (43) → takdiri indirim (62, 1/6). |
| TCK 53 | MAHKÛMİYET | Belli hakları kullanmaktan yoksunluk. |
| TCK 243 | Etik tuzak TK_GIRIS; Ozan için suç duyurusu | Bilişim sistemine hukuka aykırı girme. |
| TCK 281 | Etik tuzak TK_SIL, ETİK sonu | Delilleri yok etme, gizleme, değiştirme. |
| TCK 267 | SUC_MELIS geri bildirimi | İftira. |
| Av.K. 34 | ETİK sonu, etik geri bildirimleri | Avukatın görevini özen, doğruluk ve onur içinde yürütme yükümlülüğü. |
| CMK 134/1 | Ekran görüntüsü itirazı, tutanak ipuçları, rapor | Bilgisayar, program ve kütüklerde arama, kopyalama: hâkim (gecikmede sakınca varsa savcı) kararı. |
| CMK 134/4–5 | T_00L (dizüstü), INV_DIL, H1 ara karar | El koymada bütün verilerin yedeği alınır; yedekten bir kopya şüpheli/vekiline verilir ve tutanağa geçer. |
| CMK 63, 67 | Bilirkişi talebi ve raporu | Özel veya teknik bilgi gerektiren konuda bilirkişi; raporun içeriği. |
| CMK 50/1-c | T_03 (suç duyurusu varsa) | Soruşturma konusu suçta şüpheli olan tanık yeminsiz dinlenir. |
| CMK 48 | T_04 | Tanığın kendisini veya yakınlarını ceza kovuşturmasına maruz bırakabilecek sorulara cevap vermeme hakkı; hatırlatma. |
| CMK 158 | ARA_SUC | Suç duyurusu Cumhuriyet başsavcılığına. |
| CMK 116 vd., 119, 127 | ARA_SUC geri bildirimi, dizüstü araması | Arama kararı hâkimin (gecikmede sakınca varsa savcının); el koyma. |
| CMK 206/2-a, 217/2 | Ekran görüntüsü itirazı, mütalaaya cevap | Hukuka aykırı elde edilen delil reddedilir; hüküm hukuka uygun delille kurulur. |
| CMK 215, 216 | Katılan beyanı, mütalaa, cevap, son söz | Delil tartışması; esas hakkında mütalaa; sanık ve müdafinin cevap hakkı; son söz. |
| CMK 223/2-b, 223/2-e | BERAAT_B, BERAAT_E | Suçun sanık tarafından işlenmediğinin sabit olması / sabit olmaması. |
| CMK 231 | KISMI | HAGB: 2 yıl veya daha az hapis. |
| CMK 141–142 | BERAAT_B | El koyma dâhil koruma tedbirleri nedeniyle tazminat; süre ve usul. |
| CMK 273/1 | Hüküm metinleri | İstinaf: hükmün açıklanmasından/tebliğden itibaren iki hafta. |
| Anayasa 20/2, 38/4, 38/6; AİHS 6/2 | Mentor açıklamaları, BERAAT_E gerekçesi | Özel hayat ve arama; masumiyet karinesi; hukuka aykırı delil yasağı. |

## 2. Ceza hesabı
- **BERAAT_B / BERAAT_E:** ceza yok; adli kontrol (yurt dışı çıkış yasağı) kaldırılır; BERAAT_B'de gerçek fail yönünden
  suç duyurusu ve el koyma tedbiri nedeniyle CMK 141 vd. tazminat hatırlatması.
- **KISMI:** TCK 134/2'den beraat (ifşanın sanıkça yapıldığı ispatlanamadı). TCK 107/2: temel ceza alt sınır 1 yıl →
  TCK 43/1 ile 1/4 artırım = 1 yıl 3 ay → TCK 62 ile 1/6 indirim = **1 yıl 15 gün** hapis ve adli para cezası;
  2 yılı aşmadığı ve sanık sabıkasız olduğu için HAGB (CMK 231/5–6). Somut maddi zarar bulunmadığından 231/6-c engel değil.
- **MAHKÛMİYET:** TCK 134/2: 2 yıl 6 ay (alt sınırdan TCK 61 ile kısmen uzaklaşma: özel hayatın en hassas alanı).
  TCK 107/2 + 43/1: 1 yıl 3 ay. Toplam 3 yıl 9 ay hapis + adli para; HAGB ve erteleme sınırının üstü (CMK 231/5,
  TCK 51/1 her biri ayrı değerlendirilse de 134/2 cezası 2 yılı aşar). TCK 53. Sanık gözaltına alınmadığından TCK 63
  mahsubu metinden çıkarıldı.
- **ETİK:** hüküm değil, savunmanın delil karartmasına (TCK 281) veya hesaba izinsiz girişe (TCK 243) katılmasının
  başsavcılığa ve baroya bildirimi; yargılamaya devam.

## 3. Usul akışı
Görevli mahkeme: Bursa Asliye Ceza (5235 md. 11–12; üst sınırlar 10 yılın altında), tek hâkim; hitap "Sayın Hâkim".
1. celse: kimlik ve haklar (CMK 191), iddianame özeti, sanığın savunması, katılanın dinlenmesi, delillerin okunması ve
   itiraz (CMK 206, 215), tanık Demirci (yemin, CMK 54 vd.; çapraz sorgu CMK 201), talepler: bilirkişi (CMK 63),
   sağlayıcı müzekkeresi, adli kontrolün kaldırılması (CMK 109–110); erteleme (CMK 190).
Ara: suç duyurusu (CMK 158), savcılığın Tekin Yapı'da arama ve el koyması (CMK 116, 119, 127), sağlayıcı yanıtı.
2. celse: dizüstünün mühür tutanakla açılıp imaj ve hash alınması (CMK 134/4–5'in kıyasen uygulanması, bkz. §4/3),
bilirkişi (CMK 67), tanıklar Hayri Sezer ve Ozan Tekin (suç duyurusu varsa yeminsiz, CMK 50/1-c; CMK 48 hatırlatması), katılan beyanı, savcının karşı delili,
mütalaa ve cevap (CMK 216/1–2), esas hakkında savunma, son söz (CMK 216/3), hüküm (CMK 223, 231).

## 4. Yorum gerektiren noktalar ve verilen kararlar
1. **"Rıza" ile telefonda arama.** CMK 134 hâkim (gecikmede sakınca varsa savcı) kararı ister; rızaya dayalı inceleme
   uygulamada tartışmalıdır. Karar: tutanakta şüphelinin imzası ve "imzadan imtina" şerhi bulunmadığından rıza
   ispatlanamamış sayıldı; görüntüler CMK 206/2-a, 217/2 ve Anayasa 38/6 uyarınca hükme esas alınmadı. Telefonu teslim
   etmek, içinde arama yapılmasına rıza değildir (hâkimin H1_05 cümlesi).
2. **Ekran görüntüsünün delil değeri.** Bilirkişinin "anekdot" nitelemesi teknik bir kanaat olarak sunuldu; mahkeme
   görüntüleri zaten usulsüzlük nedeniyle dışladı. Dijital delilin imaj ve hash ile korunması CMK 134/4'teki yedekleme
   yükümlülüğüne ve adli bilişim pratiğine dayandırıldı; "hash" kanunda geçmez, bu uygulama bilgisidir.
3. **Üçüncü kişinin (Ozan'ın) cihazı.** CMK 134 "şüphelinin kullandığı" bilgisayarı düzenler; dizüstü, ayrı
   soruşturmada şüpheli konumundaki Ozan'dan CMK 116 vd. ve 127 ile el konulmuş kabul edildi; 2. celsedeki imaj/hash
   talebi CMK 134/4–5'in amacına uygun bir usul talebi olarak kurgulandı.
4. **CMK 48 suskunluğu.** Hâkimin "tek başına delil değildir" cümlesi korundu; BERAAT_B gerekçesi suskunluğa değil,
   demirbaş, IP abone bilgisi, cihaz kaydı ve üslup birlikteliğine dayanır.
5. **Ozan'ın tanıklığı.** Savunma Ozan hakkında suç duyurusu verdiyse (`suc_duyurusu`) ayrı soruşturmada şüpheli
   konumuna geçtiği için hâkim onu CMK 50/1-c uyarınca yeminsiz dinler; suç duyurusu yoksa olağan yeminli tanıktır.
   Her iki varyantta CMK 48 hatırlatması aynıdır.
6. **Uzlaştırma.** TCK 134 şikâyete bağlı ve uzlaşmaya tabidir (CMK 253/1-a); 107 değildir. Dosyada 134 yönünden
   uzlaştırmanın sonuçsuz kaldığı varsayıldı (hikâye kitabı kronolojisi, Aralık).
7. **Avukatın katılanla görüşmesi.** Katılanın avukatı varken onunla doğrudan temas meslek kurallarına aykırı kabul
   edildi (INV_T_SINAN "doğrudan ara" seçeneği bedel öder); görüşme yalnızca vekilinin bürosunda ve huzurunda yapılır.
8. **Tanıklarla temas.** Avukatın tanığa duruşma bilgisi vermesi serbest, beyanını yönlendirmesi ihlal sayıldı
   (Hayri, Gülay, Kübra konuşmalarındaki "şunu derseniz iyi olur" seçenekleri). Delil güvenceye alınmadan olası failin
   uyarılması (ARA_OZ_ANLAT / ARA_OZ_SOR) etik ihlal değil, savunma hatası olarak puanlandı ve dizüstünün kaybolmasıyla
   sonuçlanır.
9. **Hesap verisinin savunmaca indirilmesi.** Hesap sahibinin kendi verisini platformdan istemesi hukuka uygundur;
   noterde hash ile tespiti delilin bütünlüğünü korumak için önerildi (ekran görüntüsü seçeneği zayıf delil sayılır).
10. **Vakıf dosyası.** Avukatın vakıf yöneticisinin izniyle evrakı yerinde görmesi serbest kabul edildi; resmî kullanım
    için mahkemeden celbi gerekir (Hayri'nin "mahkeme isterse gönderirim" cümlesi).

## 5. Hassas konu denetimi
Lineup sınırı: cinsel suçlar, çocuklara yönelik suçlar ve terör davaları yok. Bu davada özel hayat içeriği cinsel
değildir: bir boşanma döneminde kardeşe yapılan ağlamaklı bir telefon konuşmasının kaydı ve bir klinik taburcu
belgesi. İçerik hiçbir sahnede ayrıntılandırılmaz; ruh sağlığı damgalanmaz (Hayri kaydı dinlemeyi reddeder).

## 6. Öz-inceleme kontrol listesi
- [x] Bütün madde atıfları güncel metinle doğrulandı (tablo dolu).
- [x] Ceza hesapları alt/üst sınırlar içinde ve aritmetik doğru (1y × 5/4 = 1y3a; × 5/6 = 1y15g).
- [x] Tek hâkimli asliye cezada hitap "Sayın Hâkim"; görevli mahkeme doğru.
- [x] Hüküm metinlerinde istinaf yolu (CMK 273/1) ve gerekli bildirimler var.
- [x] Etik ihlal seçenekleri doğru maddeye bağlı (Av.K. 34, TCK 243, 267, 281).
- [x] Hukuki atıflar yalnızca mentor açıklamalarında, geri bildirimde, raporda, hükümde ve duruşmanın resmî dilinde.
