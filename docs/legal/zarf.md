# Dava #12 "Zarf" — Hukuki İnceleme Notları

> Durum: **Onaylandı — Claude (iç inceleme), 2026-10-20.** `meta.legalReview = { status: 'APPROVED', by: 'Claude (iç
> inceleme)', at: '2026-10-20' }`. Kullanıcı kararı (lineup): hukuki incelemeyi Claude üstlenir. Aşağıdaki "yorum gerektiren
> noktalar" bir insan avukatın ikinci okumasına açıktır; içerik değişikliği yalnızca `content/` verisini ve golden path'leri etkiler.

Metinler güncel mevzuat PDF'leriyle karşılaştırılmıştır (erişim: 2026-10-20; `pdftotext` ile çıkarıldı):

- TCK 5237 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5237.pdf
- CMK 5271 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5271.pdf (7589 sayılı Kanunla değişen 231 dahil)
- Avukatlık Kanunu 1136 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.1136.pdf
- AİHM: *Teixeira de Castro/Portekiz* (1998), *Ramanauskas/Litvanya* (BD, 2008) — kışkırtma (entrapment) ölçütleri.

Dava 2027 baharında geçer; bugünkü (Ekim 2026) metinlerin o tarihte değişmediği varsayılmıştır.

## 1. Kullanılan maddeler ve doğrulama

| Madde | Kullanıldığı yer | Kontrol edilen metin (kısa) |
|---|---|---|
| TCK 252/1–2 | künye, BR_01 (A), hükümler | Görevinin ifasıyla ilgili bir işi yapması/yapmaması için menfaat sağlayan kişi ve kamu görevlisi **4–12 yıl** hapis (6352/87). |
| TCK 252/3 | BR_01 (doğru cevap yanıtı) | Rüşvet konusunda anlaşmaya varılması hâlinde suç tamamlanmış gibi cezaya hükmolunur. |
| TCK 252/4 | BR_01 (D, yanlış) | Talep ya da teklif karşı tarafça kabul edilmezse yarı oranında indirim; iddianame kabulü iddia ettiği için uygulanmaz. |
| TCK 250/1 | BR_01 (B), Leyla gün 3, T_04, ded_yetkisiz, GOREV gerekçesi | Görevin sağladığı **nüfuzu kötüye kullanarak icbar**: 5–10 yıl. Son cümle: haksız tutum karşısında haklı işinin görülmeyeceği endişesiyle mecbur hissederek menfaat temini → icbar kabul edilir. Muhbirin 11 Mart ihbarı bu anlatıyı kurar. |
| TCK 254/2 | INV1_IFADE (i5), PS_B2 | Rüşvet veren ya da anlaşan kişi, durum makamlarca öğrenilmeden önce pişmanlıkla bildirirse cezaya hükmolunmaz. Muhbirin "anlaştık" anlatısı onu bu hükümle korur. |
| TCK 257/1 | BR_01 (C), T_04, T_07 (C), GOREV | Kanunda ayrıca suç olarak tanımlananlar dışında, görevin gereklerine aykırı hareketle kişilerin mağduriyetine/kamunun zararına neden olma ya da haksız menfaat sağlama: **6 ay–2 yıl** (6086 ile). |
| TCK 53/1, 53/5, 62/1, 63 | hükümler | Hak yoksunlukları; yetkinin kötüye kullanılmasıyla işlenen suçta infazdan sonra yarıdan bir katına kadar yasak (53/5); takdiri indirim altıda bir; tutuklulukta geçen sürenin mahsubu. |
| TCK 51/1 | MAHKUMIYET | Erteleme ≤ 2 yıl. |
| TCK 106, 267, 272, 277, 285 | etik seçenekler, rapor, BERAAT_B | Tehdit; iftira (ve 267/4: iftira sonucu tutuklama); yalan tanıklık; görülmekte olan davada tanığı etkileme; gizliliğin ihlali. |
| Anayasa 38/4, 38/6 | gerekçeler, Leyla | Masumiyet karinesi; kanuna aykırı elde edilen bulgular delil olarak kabul edilemez. |
| AİHS 6, 6/2 | Leyla gün 1, PS_K2, gerekçeler | Adil yargılanma; kışkırtıcı ajan ölçütleri (devletin pasif kalıp kalmadığı, önceden somut şüphe bulunup bulunmadığı). |
| CMK 48 | T_01, T_02, T_02Y | Tanık kendisini ceza kovuşturmasına uğratabilecek sorulara cevap vermekten çekinebilir; önceden bildirilir. |
| CMK 63 | INV1_DIL, H1_05 | Bilirkişi incelemesi (kayıt cihazının iç günlüğü). |
| CMK 100, 108, 109 | H1_05 (RQ_TAHLIYE) | Tutuklama nedenleri (kuvvetli şüphe); tutukluluğun incelenmesi; adli kontrol. |
| CMK 135/1 | Leyla gün 2, ded_hat_disi, PS_K5 | Dinleme hâkim (gecikmede sakınca varsa savcı + 24 saatte hâkim onayı) kararıyla; şüpheli ya da sanığın iletişimi. Savcılığın "yazılı talimatı" hâkim kararının yerini tutmaz. |
| CMK 135/3 | H1_03 (C, yanlış) | Tanıklıktan çekinebilecek kişilerle iletişim kayda alınamaz; Bayram ve Ateşoğlu bu kapsamda değil. |
| CMK 135/4 | ded_sure_disi, H1_03, PS_K1 | Kararda suç türü, kişi, numara, kapsam ve süre gösterilir; **en çok iki ay, bir ay uzatılabilir**. |
| CMK 135/8-a-13 | Leyla gün 2, H1_03 (B, yanlış) | Rüşvet dinleme kataloğundadır; hukuka aykırılık suç türünde değil, kararın hattı ve süresindedir. |
| CMK 135/9 | PS_K5, gerekçe | Usul dışında hiç kimse başkasının iletişimini dinleyemez. |
| CMK 135/6 | ARA_SUC (SUC_A geri bildirimi) | Şüphelinin iletişiminin tespiti hâkim kararıyla. |
| CMK 137/1, 137/3 | clue_sure, ev_sonlandirma, beraat hükümleri | İşlemin başladığı ve bittiği tarih-saat tutanakla saptanır; beraat hâlinde kayıtlar hâkim denetiminde yok edilir (7331 ile eklenen cümle). |
| CMK 138/2 | Leyla gün 2 | Tesadüfen elde edilen delil; ancak kararın kapsamında yürüyen denetim sırasında elde edilmişse. |
| CMK 139/1, 139/7 | Leyla gün 1 | Gizli soruşturmacı bir **kamu görevlisidir**, hâkim kararıyla görevlendirilir; katalogda rüşvet yoktur. |
| CMK 140 | (not) | Teknik araçla izleme rüşvette mümkündür ama hâkim kararı gerekir; muhbire takılan cihaz için karar yoktur. Cihazın günlüğü savunma lehine kullanılmıştır (§4-3). |
| CMK 147/1-e | TAV_C, H1_01S | Susma hakkı. |
| CMK 158 | AK1_A, AK2_A, ARAK_A, ARA_SUC | Suç duyurusu; avukat şüpheliyi izlemez, bildirir. |
| CMK 177, 178 | INV1_DIL, H1_05, MUZ_TANIK | Savunma delillerinin toplanması dilekçesi (duruşmadan en az beş gün önce); tanığın doğrudan getirilmesi. |
| CMK 201/1 | H1_02, T_03Q (C) | Doğrudan soru; yönlendirici/telkin edici soruya itiraz. |
| CMK 206/2-a | H1_03, OB_K5 | Kanuna aykırı elde edilen delilin ortaya konulması istemi reddolunur. |
| CMK 206/2-b | DIL_KESIF | İspat edilmek istenen olayın karara etkisi yoksa ret. |
| CMK 216/2–3, 217/1–2 | T_05, T_08, gerekçeler | Cevap hakkı; son söz; duruşmada tartışılmış ve hukuka uygun delil. |
| CMK 223/2-b, 223/2-e | beraat hükümleri | Suçun sanık tarafından işlenmediğinin sabit olması / işlendiğinin sabit olmaması. |
| CMK 225/2, 226/1, 226/3 | T_04 | Mahkeme nitelendirmede bağlı değildir; vasıf değişecekse önce haber verilip ek savunma alınır; istem üzerine süre verilir. |
| CMK 231/3 | beraat hükümleri | Beraat eden sanığa tazminat isteyebileceği bildirilir. |
| CMK 231/5, 231/6, 231/8, 231/12 (7589 ile değişik) | GOREV | HAGB ≤ 2 yıl; beş yıl denetim; karara karşı **istinaf**. |
| CMK 141/1-a | beraat hükümleri | Kanunlarda öngörülen koşullar dışında / sonradan beraat eden tutuklunun tazminat hakkı (sanık 13 Mart'tan itibaren tutuklu). |
| CMK 273/1 | hükümler | İstinaf: gerekçeli hükmün tebliğinden itibaren iki hafta. |
| Av.K. 34, 38/1-b | etik seçenekler, ETIK kartı | Doğruluk ve meslek kurallarına uyma; menfaati zıt tarafa avukatlık yasağı (muhbire hukuki yardım verilmemesi, adli yardıma yönlendirme). |

## 2. Ceza hesabı

- **MAHKUMIYET / ETIK** (252/2): alt sınırdan **4 yıl** → TCK 62/1 (1/6) → **3 yıl 4 ay**. TCK 53/1 ve 53/5. Tutuklulukta
  geçen süre mahsup (TCK 63). 2 yılı aştığından erteleme ve HAGB yok. Para Emniyet'in olduğundan müsadere değil, iade.
- **GOREV** (257/1, ek savunma alınarak vasıf değişikliği): temel **1 yıl** (alt sınırdan uzaklaşma gerekçesi: kamu
  hizmetine güven ve yetki aşımı) → TCK 62/1 → **10 ay** → CMK 231/5 HAGB, beş yıl denetim (231/8); 231/6-c bakımından
  giderilecek somut bir zarar yok. HAGB'de hapis ertelenemez (231/7). Kanun yolu istinaf (231/12).
- **BERAAT_B / BERAAT_E**: ceza yok; tutuklama/adli kontrol kalkar; 40.000 TL Emniyet'e iade; dinleme kayıtlarının imhası
  (CMK 137/3); tazminat bildirimi (CMK 231/3, 141/1). 223/2-b'de Sinan Kaplan ve Bayram Öz için dosya örneği Başsavcılığa.

## 3. Usul akışı

- **Görevli mahkeme:** 252'nin üst sınırı 12 yıl → ağır ceza (5235 md. 12). Heyet: başkan + iki üye; hitap "Sayın Başkan".
- **Soruşturma:** 4 Ocak 2027 sulh ceza hâkimliği kararı (Ateşoğlu'nun hattı, rüşvet, iki ay); 4 Mart'ta biter, uzatılmaz,
  sonlandırma yazısı 12 Mart'ta. 11 Mart ihbar; 12 Mart kontrollü teslimat (para Emniyet'ten, muhbire hâkim kararsız cihaz);
  13 Mart tutuklama; 9 Nisan iddianame (252/2), muhbir için 254/2.
- **1. celse (10 Mayıs):** sanığın sorgusu (CMK 191, 147), sorular (201), kayıtların okunmasına itiraz (206/2-a), Komiser'in
  tanıklığı, talepler ve tutukluluk değerlendirmesi, ara karar.
- **Ara:** delil cevapları (kamera, santral, bilirkişi, sonlandırma yazısı); suç duyurusu (158); tanığın dinlenmesi talebi.
- **2. celse (31 Mayıs):** muhbir (CMK 48 uyarısı), Devir-2 memuru, çaycı; vasıf değişikliği bildirimi ve ek savunma (226);
  mütalaa ve cevap (216/2); esas savunma; son söz (216/3); hüküm ayakta dinlenir (231/4).

## 4. Yorum gerektiren noktalar ve verilen kararlar

1. **Süre dışı kayıt.** Kararın süresi dolduktan sonra sistemin kaydetmeye devam etmesi, kaydı "kararın kapsamında" yapmaz;
   tesadüfi delil (138/2) de ancak yürürlükteki bir denetim sırasında söz konusu olabilir. Kayıt #14 hukuka aykırı kabul edildi.
2. **Savcılık talimatıyla sanığın hattı.** Kayıt #9 için hâkim kararı yoktur; savcının gecikmede sakınca kararı da 24 saat
   içinde hâkim onayına sunulmamıştır. Bu nedenle kayıt hukuka aykırı sayıldı. İddianamenin cümleyi yarım alıntılaması
   ayrıca vurgulandı; ancak hukuka aykırı kaydın sanık lehine kullanılması tartışmalı olduğundan savunma bu kaydın içeriğine
   dayanmaz, cümlenin bütününü **sanığın kendi beyanıyla** (H101Q_C) tutanağa geçirir.
3. **Muhbire takılan cihaz.** Hâkim kararı olmadan (CMK 140) muhbire takılan cihazın kaydı sanık aleyhine kullanılamaz; oyunda
   aleyhe bir içerik yoktur. Cihazın **iç günlüğünün** (manuel durdurma) ve son saniyelerdeki ikinci sesin savunma lehine
   değerlendirilmesi kabul edildi: delil yasağı devletin aleyhe kullanımına yöneliktir (Anayasa 38/6'nın amacı); lehe kullanım
   doktrinde tartışmalıdır, kararda "değerlendirilmiştir" düzeyinde tutuldu.
4. **Kışkırtma.** Muhbir bir kamu görevlisi değildir; gizli soruşturmacı olamaz (139/1, katalogda rüşvet yok). Paranın ve
   planın kolluktan gelmesi, muhbiri devletin eli yapar; önceden somut şüphe yalnızca süre dışı kayda dayanır. Gerekçede
   AİHS 6'ya atıfla "gözetildi" denir; tek başına beraat nedeni yapılmadı, delil değerlendirmesinin bir halkası olarak kullanıldı.
5. **İrtikap–rüşvet ayrımı.** 250/1'in son cümlesindeki icbar karinesi muhbirin ilk anlatısına uyar; ancak dosya sanığın görev
   alanında değildir (nüfuz yok) ve muhbir iki gün sonra "anlaştık" demiştir. Vasıf değişikliği bildirimi (226/1) ikinci celsede
   heyetçe yapılır; GOREV sonucunda 257/1'e değişiklik bu bildirim üzerine kurulur.
6. **Öncelikli randevu → 257/1.** Yetki aşımının "kişilerin mağduriyeti"ne yol açıp açmadığı tartışmalıdır (sıradaki başvurular
   bir gün geriye itildi). GOREV sonucunda heyetin bunu kabul ettiği varsayıldı; rüşvet vasfı karşılık ispatlanamadığı için
   düşer. Bu sonuç bilinçli olarak "gerçekten" daha ağırdır (kötüye giden bir orta yol).
7. **Avukatın tanıkla teması.** Tanıkla görüşmek yasak değildir, ama ifadesini almak, yazdırmak, yönlendirmek ve bir isim
   vermek meslek ve ceza hukuku ihlalidir (Av.K. 34, TCK 277). Oyunda doğru seçimler: muhbiri adli yardıma, çaycıyı mahkemeye
   yönlendirmek; Devir-2 memurunun yaklaşmasını belgelemek ve savcılığa bildirmek; şüpheliyi izlememek.
8. **Tazminat bildirimi.** Beraat eden ve tutuklu kalmış sanığa CMK 141/1 ve 231/3 uyarınca tazminat bildirimi yapılır;
   tahliye edilmiş olsa da 13 Mart–tahliye arası tutukluluk vardır.

## 5. Hassas konu denetimi
Cinsel suç, çocuklara yönelik suç ya da terör içeriği yoktur. Kamu görevlileri gerçek kişi ya da kurumlara gönderme yapmaz;
"Nilüfer Tapu Müdürlüğü" kurgusal bir birim olarak, gerçek personel adı kullanılmadan anılır.

## 6. Kontrol listesi
- [x] Maddeler mevzuat.gov.tr metniyle karşılaştırıldı (2026-10-20).
- [x] Ceza hesapları sınırlar içinde; TCK 62/1 altıda bir; HAGB ≤ 2 yıl ve istinaf yolu.
- [x] Delil yasakları: kararın süresi ve hattı (CMK 135/1, 135/4); 206/2-a ve 217/2.
- [x] Etik seçenekler doğru maddeye bağlı ve `ethics` sayacını artırıyor.
- [x] `legalReview` onaylandı.
