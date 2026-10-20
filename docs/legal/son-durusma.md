# Dava #15 "Son Duruşma" — Hukuki İnceleme Notları

> Durum: **Onaylandı (Claude, iç inceleme), 2026-10-20.** `meta.legalReview = { status: 'APPROVED', by: 'Claude (iç inceleme)', at: '2026-10-20' }`.
> Madde atıfları karakterlerin gündelik konuşmasında geçmez; Leyla'nın kısa açıklamalarında, seçenek geri bildirimlerinde,
> rapor ipuçlarında, hüküm/gerekçe metinlerinde ve duruşmanın resmî dilinde (başkan, savcı, Deniz'in talepleri) yer alır.

Metinler aşağıdaki güncel mevzuat metinleriyle karşılaştırılmıştır (erişim: 2026-10-20):

- TCK 5237 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5237.pdf
- CMK 5271 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5271.pdf
- 1136 sayılı Avukatlık Kanunu — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.1136.pdf
- 6384 sayılı Avrupa İnsan Hakları Mahkemesine Yapılmış Bazı Başvuruların Tazminat Ödenmek Suretiyle Çözümüne Dair Kanun
  (CMK 141–142 tazminat istemlerinin Adalet Bakanlığı Tazminat Komisyonu'na yapılması bakımından)

## 1. Kullanılan maddeler ve doğrulama

| Madde | Kullanıldığı yer | Kontrol edilen metin (kısa) |
|---|---|---|
| TCK 81/1 | BR_01 (B şıkkı), mütalaa varyantı, INDIRIM, IKRAR | Bir insanı kasten öldüren kişi müebbet hapis cezası ile cezalandırılır. |
| TCK 82/1-a | lawRef, iddianame (H1_00), BR_01 (doğru şık), MAHKUMIYET | Kasten öldürmenin tasarlayarak işlenmesi: ağırlaştırılmış müebbet hapis. |
| TCK 29 | INV_LEYLA (3. gün), BR_01 (C şıkkı), P_TAHRIK, S_TERDIT, INDIRIM, IKRAR | Haksız bir fiilin meydana getirdiği hiddet veya şiddetli elemin etkisi altında suç işleyene ağırlaştırılmış müebbet yerine 18–24 yıl, müebbet yerine 12–18 yıl; diğer hâllerde ¼–¾ indirim. |
| TCK 61 | INDIRIM (temel ceza belirlemesi) | Temel cezanın belirlenmesi ve indirim sırası. |
| TCK 62/1 | INDIRIM, IKRAR, MAHKUMIYET, BR_01 (D şıkkı) | Takdiri indirim: ağırlaştırılmış müebbet yerine müebbet, müebbet yerine 25 yıl; diğer cezalarda altıda birine kadar indirim. |
| TCK 53, 63 | Mahkûmiyet hükümleri | Hak yoksunlukları; tutuklulukta geçen sürenin mahsubu. |
| TCK 272, 38 | Süleyman'a söz ezberletme (SK_BICAK), rapor | Gerçeğe aykırı tanıklık; azmettirme. |
| TCK 277 | Cansu'ya menfaat vaadi (CK_IS), rapor | Yargı görevi yapanı, bilirkişiyi veya tanığı hukuka aykırı olarak etkilemeye teşebbüs. |
| CMK 46/1-a | T2_03 (Leyla'nın tanıklığı), ARA_LEYLA, rapor | Avukatlar ve stajyerleri, meslekleri dolayısıyla öğrendikleri bilgiler hakkında tanıklıktan çekinebilir. |
| CMK 48 | T3_01K (baş tanığın susması), T3_00 başkan ihtarı | Tanık, kendisini veya 45. maddedeki yakınlarını ceza kovuşturmasına uğratabilecek sorulara cevap vermeyebilir. |
| CMK 52/2, 217 | İtiraz gerekçesi g_kanaat | Tanık bildiklerini anlatır; değerlendirme hâkimin vicdani kanaatine aittir. |
| CMK 63, 67 | Sesli mesaj ve DVR bilirkişi incelemesi, adli tıp uzmanı (AQ_EL, AQ_KESIN) | Özel ve teknik bilgi gerektiren hâllerde bilirkişi; bilirkişi hukuki değerlendirme yapamaz. |
| CMK 100, 101, 108, 109 | H1_05B, T2_04 tutukluluk ve adli kontrol | Kuvvetli suç şüphesi; tutukluluğun incelenmesi; adli kontrol (konutu terk etmeme, imza). |
| CMK 116, 119 | AD_DOLAP geri bildirimi | Makul şüphe ve arama kararı. |
| CMK 135 | DIL_TARIK_HTS geri bildirimi | İletişimin tespiti ölçülülük ve somut şüphe ister. |
| CMK 141/1-e, 142, 231/3 | Beraat hükümleri | Tutuklandıktan sonra beraat edene tazminat hakkı; hükümde bildirimi. |
| CMK 147/1-e | AE_DOGRU geri bildirimi, IKRAR etik kartı | Kendisi aleyhine tanıklık etmeme ve susma hakkı. |
| CMK 158, 160 | ARA2_BILDIR, rapor ipucu h_bildir, ARA_LEYLA | Suç duyurusu; savcının araştırma yükümlülüğü. |
| CMK 177, 178 | INV_DIL, ARA_DIL, tanık bildirimleri | Sanık ve müdafiin delil talebi; duruşmadan en az beş gün önce dilekçe; reddedilen tanığın doğrudan getirilmesi. |
| CMK 201 | İtiraz gerekçesi g_telkin, H1_04 | Doğrudan soru hakkı; soruya itirazda başkan karar verir. |
| CMK 206, 209 | H1_05 sözlü talepler, ARA2_ARSIV | Duruşmada delil ikamesi talebi; belgelerin okunması. |
| CMK 210 | İtiraz gerekçesi g_duyum, EX_I_R6 | Delil bir kişinin açıklamasından ibaretse o kişi dinlenir. |
| CMK 223/2-b, e | BERAAT_B, BERAAT_E, mütalaa varyantları | Suçun sanık tarafından işlenmediğinin sabit olması / işlendiğinin sabit olmaması. |
| CMK 226 | T3_00 sahte ikrar yolunda ihtar | Hukuki nitelendirmenin değişmesi hâlinde sanığa ek savunma hakkı. |
| CMK 273/1 | Mahkûmiyet hükümleri | İstinaf süresi: gerekçeli hükmün tebliğinden itibaren iki hafta. |
| CMK 311/1-e, 312 | BERAAT_B epilogu (Kemal'in 2004 hükmü) | Yeni olay veya delil hâlinde mahkûmiyet aleyhine olmayan yargılamanın yenilenmesi; hükmün infaz edilmiş olması engel değildir. |
| Av.K. 34 | Bütün etik geri bildirimleri, IKRAR | Avukat görevini özen, doğruluk ve onur içinde yerine getirir. |
| Av.K. 36 | T2_03, ARA2_ARSIV (Leyla'nın notları) | Avukatın sır saklama yükümlülüğü. |
| Anayasa 38/4; AİHS 6/2 | BERAAT_E gerekçesi | Masumiyet karinesi; şüpheden sanık yararlanır. |

## 2. Ceza hesabı

- **BERAAT_B / BERAAT_E:** ceza yok; tahliye ya da adli kontrolün kaldırılması; CMK 141/1-e, 142 ve 231/3 uyarınca tazminat
  hakkının bildirimi. B'de dosyanın tanık Tarık Sezer hakkındaki soruşturmaya gönderilmesi; E'de tanık hakkında suç duyurusu.
- **INDIRIM (farklı nitelendirme, RECHARACTERIZED):** tasarlama unsuru oluşmadığından TCK 82/1-a yerine 81/1 (müebbet)
  → TCK 29 ile müebbet yerine 12–18 yıl aralığında, olayın ağırlığı ve tahrikin derecesi gözetilerek **15 yıl**
  → TCK 62/1 (altıda bir: 2 yıl 6 ay) → **12 yıl 6 ay**. TCK 53, 63. Ceza 2 yılı aştığından HAGB ve erteleme yok.
- **IKRAR (etik sonu):** aynı nitelendirme ve hesap (81/1 + 29 + 62/1 = 12 yıl 6 ay); oyun içinde etik ihlal sonucu olarak
  `OTHER` sınıfındadır ve XP vermez.
- **MAHKUMIYET:** TCK 82/1-a: ağırlaştırılmış müebbet → TCK 62/1 ile **müebbet** hapis. TCK 53, 63. İstinaf CMK 273/1.
- **Çöküş:** aynı mahkûmiyet hükmü; gerekçeye "savunmanın inandırıcılığı çöktü" notu eklenir (oyun içi açıklama).

## 3. Usul akışı

- Görevli mahkeme: Bursa Ağır Ceza Mahkemesi (üç hâkim; Mudanya, Bursa Ağır Ceza'nın yargı çevresindedir).
- **1. celse (cs_1):** açılış ve iddianame özeti (CMK 191), sanığın savunması ve müdafiin soruları (CMK 201), savcının
  delil talebi (2004 hükmünün getirtilmesi), bulaşıkçı tanığın dinlenmesi; gelmeyen tanığın zorla getirilmesi (CMK 44),
  delil talepleri (CMK 177, 206), tutukluluk incelemesi (CMK 108).
- **Ara evre:** kurum kayıtları (BURULAŞ, mali hafıza, bilirkişi raporları) mahkeme yazısıyla gelir; emanetteki delil
  mahkeme izniyle ve kâtip huzurunda incelenir; savunma tanık ve kayıt taleplerini ek dilekçeyle yapar.
- **2. celse (cs_2):** adli tıp uzmanı (CMK 67), baş tanığın dinlenmesi ve çapraz sorgu, garson tanık, savcının avukatı
  tanık olarak dinletme talebi (CMK 46/1-a ile ret), ara karar ve adli kontrolle tahliye (CMK 101, 109).
- **İkinci ara:** savunma 2004 dosyasının getirtilmesini ister (CMK 206); başka bir kişinin fail olabileceğine ilişkin
  bulguları Cumhuriyet Başsavcılığına yazılı olarak bildirir (CMK 158); arama ve gözaltı savcılığın ve hâkimin işidir.
- **3. celse (cs_3):** tanığın yeniden dinlenmesi; CMK 48 hatırlatması; mütalaa (CMK 216/1), esas hakkında savunma, son söz
  (CMK 216/3), hüküm (CMK 223, 232).

## 4. Yorum gerektiren noktalar ve verilen kararlar

1. **Tasarlamanın unsurları.** Yargıtay uygulamasına göre tasarlama; suç işleme kararı ile icra arasında makul bir süre,
   bu sürede kararda sebat, kararın soğukkanlılıkla alınması ve icranın planlanması ister. Oyun bunları Leyla'nın
   açıklamasında (INV_LEYLA 1. gün) ve iddianamenin "üç ayağında" (mesaj = karar, taş = hazırlık, bekleyiş = sebat) işler.
   Üç ayağın çürütülmesi `tasarlama_coktu` yüklemidir.
2. **Tasarlama ile haksız tahrikin birlikteliği.** Öğretide ve Yargıtay kararlarında tartışmalıdır; kural olarak
   soğukkanlılık ile hiddet bir arada düşünülmez, ancak süregelen haksız fiillerde birlikte uygulama da görülmüştür.
   Oyunda terditli savunma "tasarlama yok **ve** tahrik var" yapısıyla kurulur; INDIRIM sonucu 81/1 + 29'dur. Leyla'nın
   uyarısı ("öfke ile plan aynı odada zor oturur") bu gerilimi öğretir.
3. **Tahrikin kaynağı yirmi iki yıllık bir fiil.** Haksız fiil eski olsa da sanığın onu olay gecesi öğrenmesi (maktulün
   kendi itirafı) hiddetin güncelliğini sağlar; oyunda yalnızca terditli savunmada ve maktulün itirafı bulunduysa
   (`fact_itiraf`) dayanak sayılır. Tahrik indirimi orta derecede (15 yıl) seçilmiştir.
4. **Bıçağın sanığa ait olması ve tasarlama.** Aşçının bıçak çantasını her gün taşıması mesleğin olağanıdır; bileği taşı
   şefin yazılı talimatıyla alınmıştır. Bunlar hazırlık sayılmaz (ded_bileme).
5. **Maktulün sesli mesajı.** Sesli mesaj, Kemal Yalçın'ın kendi telefonundadır; sahibinin rızasıyla incelenmesi ve operatör
   kaydıyla karşılaştırılması hukuka uygundur. Doğru yol aslın korunması ve mahkeme kanalıyla bilirkişi incelemesidir
   (CMK 63, 177/206). Avukatın kendi telefonuna kopya alması yasak değildir ama delil bütünlüğü bakımından zayıftır;
   oyunda puan kaybıyla gösterilir.
6. **Avukatın tanıklıktan çekinmesi.** Av. Leyla Erdem bu davada müdafi değildir; savcının onu husumet konusunda tanık
   olarak dinletme talebine doğru cevap CMK 46/1-a (meslek sırrı) ve Av.K. 36'dır. "Savunma ekibinden" gerekçesi yanlış
   dayanak olarak cezalandırılır.
7. **Leyla'nın 2004 notları.** Müvekkil–avukat görüşmelerine ilişkin notlar müvekkilin sırrıdır; rızası olmadan kullanılmaz.
   Aynı bilgi (evde bulunanların adları) arşivdeki kesinleşmiş dosyanın arama tutanağında resmî belge olarak bulunur;
   doğru yol bu dosyanın mahkeme kanalıyla getirtilmesidir.
8. **Baş tanığın susması.** Yeniden dinlenen tanık, kendisini suçlayabilecek sorulara cevap vermeme hakkını kullanabilir
   (CMK 48). Bu, tek başına bir suç delili değildir; B sonucu ayrıca sesli mesaj, Kentkart, arşiv ve savcılığın kendi
   araması (gömlek) birlikte gerçekleştiğinde verilir.
9. **2-b ile 2-e ayrımı.** Sanığın olay anında başka yerde bulunduğu kesinleşir ve maktulün sanık gittikten sonra yaşadığı
   kayıtla sabit olursa 223/2-b; tek tanığın çöküşü ve tasarlamanın kanıtlanamaması ise 223/2-e'dir. Tipik yol (TIPIK)
   sesli mesajı bulmadığı için 2-e'de kalır.
10. **Sahte ikrar.** Masumiyetini söyleyen müvekkile daha az ceza için gerçeğe aykırı ikrar önermek Av.K. 34'e aykırıdır;
    oyunda etik ihlal sonu (IKRAR, XP 0). Mahkeme ikrarı dosya kapsamıyla birlikte değerlendirir ve tasarlamayı yeterli
    bulmayarak 81/1 + 29 uygular; nitelendirme değişikliği için CMK 226 ihtarı yapılır.
11. **Sesli mesajın içeriği ve gizem.** Mesaj bir kişinin kapıya geldiğini söyler ama adını söylemez; failin kimliği arşiv,
    gömlek ve iz yazısıyla birlikte kurulur.
12. **Yargılamanın yenilenmesi.** B epilogunda Leyla, Kemal Yalçın'ın 2004 mahkûmiyeti için CMK 311/1-e uyarınca
    yargılamanın yenilenmesi dilekçesi yazar; CMK 312 hükmün infaz edilmiş olmasını engel saymaz. 2004 olayları 765
    sayılı TCK dönemindedir; oyun eski hükmün maddesini anmaz.

## 5. Hassas konu denetimi

Cinsel suç, çocuğa yönelik suç ya da terör unsuru yoktur. Sanık 22 yaşındadır. Uyuşturucu yalnızca 2004 dosyasının geçmişi
olarak anılır; ayrıntı verilmez.

## 6. Öz-inceleme kontrol listesi

- [x] Maddeler güncel metinle karşılaştırıldı (erişim tarihi yukarıda).
- [x] Ceza hesapları adım adım (TCK 29 → 62/1 sırası; ağırlaştırılmış müebbet → müebbet).
- [x] Gündelik konuşmada madde atfı yok; atıflar geri bildirim, rapor, hüküm ve resmî usul dilinde.
- [x] Etik ihlal seçenekleri doğru maddeye bağlı (Av.K. 34, 36; TCK 272, 277) ve `ethics` sayacını artırıyor.
- [x] Avukat şüpheliyi kovalamaz; doğru yol savcılığa bildirimdir (ARA2_YUZLES cezalandırılır).
- [x] `legalReview` onaylandı (Claude, iç inceleme).
