# Dava #07 — Hukuki İnceleme Notları

> Durum: **Onaylandı — Claude (iç inceleme), 2026-10-20.** `meta.legalReview = { status: APPROVED, by: "Claude (iç inceleme)", at: "2026-10-20" }`,
> diğer davalarla aynı biçimde. Aşağıdaki A.9 ve v2 listelerindeki her soru, sondaki **"v3 — iç inceleme kararları"** bölümünde bir karar ve
> gerekçeyle kapatıldı. Üretimden önce bir avukatın dış incelemesi yine önerilir (docs/plan.md §2, §15); düzeltmeler yalnızca `content/`
> verisini ve golden path testlerini değiştirir.

Metinler aşağıdaki güncel mevzuat PDF'leriyle karşılaştırılmıştır (erişim: 2026-10-20):

- TCK 5237 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5237.pdf
- CMK 5271 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5271.pdf
- 5188 sayılı Özel Güvenlik Hizmetlerine Dair Kanun — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5188.pdf
- 1136 sayılı Avukatlık Kanunu — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.1136.pdf
- Yakalama, Gözaltına Alma ve İfade Alma Yönetmeliği — https://cigm.adalet.gov.tr/
- 5275 md. 59 (hükümlü/tutuklunun avukatıyla görüşmesi) yorumu ve Bursa 12 Mart gün doğumu/batımı saatleri (TCK 6/1-e "gece vakti" hesabı)

### A.9 Hukuki inceleme listesi ve tasarım düzeltmeleri
**İnceleme gerektirenler** (önem sırasıyla):
1. Görev süresi dışındaki özel güvenlik görevlisinin rızaya aykırı el aramasında delil yasağının uygulanması (5188 md. 7/a + 9/1).
2. Tanık HTS'sinin CMK 135/6 dışında kalması; Murat'ın şüpheli olduğu ayrı soruşturmadaki HTS'nin bu davada kullanılabilmesi.
3. İşverenin verdiği anahtarın 142/2-d dışında kalması (Yargıtay uygulaması); iki bentle temel cezanın alt sınırdan uzaklaşması.
4. Görevli mahkeme (5235 md. 12; 143 dahil) ve heyetin 3 hâkimden oluşması (tasarımda 1 üye var).
5. 2. celsede 142/2-d için ek savunma (CMK 226/1, 226/3).
6. Sanığın kendi sahte ikrarında TCK 270; avukatın azmettirici olarak sorumluluğu (TCK 38); ikrarın mazeretle çeliştiği durumda mahkûmiyetin gerçekçiliği.
7. Savunmanın talebiyle TCK 274/2 hatırlatması (CMK 48 ile birlikte).
8. İlgili soruşturmada şüpheli hâline gelmiş tanığın CMK 50/1-c ile yeminsiz dinlenmesi.
9. Teşhis usulü: mevzuatta düzenlenmemiş; telkinli yüzleştirme CMK 217 ve içtihat çerçevesinde değerlendirilir.
10. Düşük riskli noktalar:
    - CMK 153/4 ile emanete erişim ve kâtip önünde UV kullanımı;
    - 5275 md. 59/2 (görüş saatleri);
    - "telkin edici soru" itirazı (CMK 201/1);
    - 4982 md. 11'deki 15 iş günü süresi;
    - 2026 tarihli 7589 sayılı Kanun'un CMK 231 metnine etkisi (ceza 2 yılın üstünde olduğu için bu davayı etkilemez).

**Tasarımdaki hukuki rakam/metin düzeltmeleri** (UI aynı kalır, yalnızca veri değişir):

| # | Tasarımda | Sorun | Düzeltme |
|---|---|---|---|
| 1 | Davalar: "TCK 142 · 3–7 yıl" | 3–7 yıl ya bugünkü 142/1'in ya da 2014 öncesi 142/2'nin aralığı | "TCK 142/2-h, 143 · 7,5–15 yıl" |
| 2 | Dosya: "Savcılık talebi 5 yıl" | 143'ten sonraki alt sınırın altında; iddianame süre değil madde belirtir | "İddianame: 142/2-h, 143 (7 yıl 6 ay–15 yıl)" |
| 3 | Ceza aralığı: "TALEP: 5 YIL", "Beraat / İndirim / HAGB / 3 yıl / 7 yıl" | HAGB ve erteleme ≤2 yıl ceza (CMK 231/5, TCK 51/1) ve tam tazmin (231/6-c) ister | "İSTEM: 142/2-h + 143"; etiketler "Beraat · TCK 62: 6y3a · 7,5 yıl · 15 yıl" |
| 4 | İpucu: "etkin pişmanlık ve takdiri indirim" | TCK 168 failin tam tazminini ister; masum müvekkil için bu sahte ikrar demek | "Terditli: önce beraat; aksi halde 142/2-d'nin düşmesi, alt sınır, TCK 62" |
| 5 | Karar İNDİRİM: "142/1 + 62 = 2 yıl 6 ay" | 142/1 bu olaya uymuyor ve 143 unutulmuş | "142/2-h 5 yıl → 143: 7 yıl 6 ay → 62: 6 yıl 3 ay" |
| 6 | Karar MAHKÛMİYET: "142/1, 5 yıl" | Yanlış madde ve aralık; istinaf süresi yok | "142/2-d,h 6 yıl → 9 yıl → 62: 7 yıl 6 ay"; istinaf: tebliğden itibaren iki hafta (CMK 273/1) |
| 7 | Karar BERAAT: "223/2-e" | Şüphe sonucu için doğru | 223/2-b varyantı eklenir; tahliye, tazminat bildirimi (CMK 141/1-e, 142/2–6384, 231/3) ve "TÜRK MİLLETİ ADINA" |
| 8 | "Talep: 5 yıl › …" | 2. maddeyle aynı sorun | "İstem: 7,5–15 yıl › …" |
| 9 | HTS kaynağı: "Operatör kaydı" | Operatör kayıtları yalnızca hâkim kararıyla verir | "Başsavcılık soruşturması, CMK 135/6 hâkim kararı · Murat↔Selin 23.05, 6 dk" |
| 10 | Kamera: "22.40–23.30 kayıt dışı, kablo kesik" | Kesik kabloyla kayıt yeniden başlayamaz | "23.30'da bantla eklenmiş" eklenir |
| 11 | Görüşme: "14 dk", süreyi gardiyan tutuyor | Avukat–müvekkil görüşmesi süresiz ve gizli (CMK 149/3, 154/1) | "Görüş salonunun kapanışına 14 dk" (5275 md. 59/2); gardiyan görür ama duymaz |
| 12 | "Depo Sokağı 23.00": aylar sonra taze izmarit ve çamur izi | Sonraki bir keşifte gerçekçi değil | 13 Mart fotoğraf albümü; izmarit emanetten |
| 13 | İz tozu, el konulmuş delil üzerinde | Avukat inceleyebilir, delile müdahale edemez | Ceza + bilirkişi geri bildirimi |
| 14 | "Gece bekçisi" | Bekçi kamu görevlisidir (7245), yetkileri farklı | Başlık kalır; hukuki metinlerde "özel güvenlik görevlisi (5188)" |
| 15 | İTİRAZ! / "Sayın Hâkim" | Türk usulünde belirli dayanaklar var | İTİRAZ!, CMK 201/1, 192/2, 215, 216/2'ye bağlanır; heyete "Sayın Başkan" |
| 16 | Turuncu mont "eşleşiyor" | Yanıltıcı | Şirketin iş üniforması olduğu açıklanır |
| 17 | ×1,5 tüm skora | Beyan edilen strateji hükmü değiştirirdi | Yalnızca stratejiyle uyumlu esas savunmanın SS puanına |

Ana menüdeki "Müvekkilim masum, Sayın Hâkim!" balonu davadan bağımsız bir tasarım öğesi olduğu için korunur.


## Plan A sırasında eklenenler (incelemeye dahil)
- Duruşmadaki İTİRAZ! butonu için tanık ifadesine yönelik itiraz gerekçeleri: `g_duyum` (tanığın kendi gözlemi yerine başkasının söylediğini aktarması), `g_kanaat` (kişisel kanaat), `g_telkin` (telkin edici soru, CMK 201/1). S4 × g_duyum doğru kabul edilir; dayanaksız itiraz ♥−1. (Plan A Task 20)
  - İnceleme sorusu: Türk ceza muhakemesinde "duyuma dayalı tanıklık" ve "kişisel kanaat" için ayrı bir itiraz kurumu yoktur; delilin değerlendirilmesi (CMK 217) ve doğrudan doğruyalık (CMK 210) çerçevesinde bu gerekçelerin oyunda "itiraz" olarak sunulması uygun mu, yoksa "beyana karşı diyecek" (CMK 215) olarak mı adlandırılmalı?
  - Kural: S4 × `g_duyum` → Sorgulama +50, heyet iknası +1 (İtiraz isabeti x/7 sayacına girmez); diğer her gerekçe/ifade eşleşmesi → ♥−1, −50 (Hatalı delil satırı), "Dayanaksız itiraz.".

### İçerik yazımında metni değişen ya da eklenen yerler (Plan A Task 19–20)
Kaynak taslakta (docs/content/dava-07.md) metni verilmeyen ya da `…` ile kısaltılmış yerler aşağıdaki gibi dolduruldu; hepsi incelemeye dahildir:

1. **Görüşme yanıtları:** Tasarımdaki cevaplar A.2'deki bilgilerle birleştirildi: "O gece" cevabına 19.30'daki top taşıma eklendi; "Anahtar" cevabına "Sabah Selin abla çantamı elimden alıp açtı" (sert tonda ayrıca "Vardiyası gece bitmişti, sabah orada ne işi vardı?"); "Hüseyin abi" cevabına "cüzdan annemde". Kapıdaki Saniye Aydın: "oğlum sigara bile içmez… 39 numara".
2. **Strateji ipuçları (Dosya ekranı):** çarpanlar (×1,5 / ×1,2 / ×0,8) yalnızca stratejiyle uyumlu esas savunma puanına uygulanır (A.9 #17); "Ceza indirimi" ipucu terditli savunma olarak yazıldı (A.9 #4).
3. **Hüküm metinlerindeki boşluklar:** İKRAR "Sanık … ikrarı da dikkate alınarak cezalandırılmasına: TCK 142/2-h … "; İNDİRİM'deki "…" yerine "sanığın duruşmadaki tutum ve davranışları lehine takdiri indirim nedeni sayılarak TCK 62/1 ile"; MAHKÛMİYET genel hüküm cümlesi + A/B varyant metinleri ve çöküş notu gerekçe parçası olarak; BERAAT_E'nin koşullu gerekçe parçaları (arıza kaydı / önceki beyan, mazeret, anahtar, parmak izi, Anayasa 38/4 ve AİHS 6/2).
4. **Duruşma metinleri:** açılış (CMK 191: sanık bağsız, tanıklar dışarıda, ara karar cevapları), tanığın kimlik tespiti ve yalan tanıklık uyarısı (CMK 58), başkanın CMK 48 hatırlatması (C_06H), savcının iki mütalaa metni (beraat + suç duyurusu / 142/2-d, h, 143, 53, tutukluluğun devamı), cevap hakkı (CMK 216/2), son söz (CMK 216/3), hükmün ayakta dinlenmesi (CMK 231/4).
5. **Tanık ifadesi S4'e eklenen satır:** BASTIR B'den sonra görünen "Murat Koç'u… pek tanımam." satırı; CMK 135/6 kaydı (ev_hts) bu satıra sunulduğunda doğru kabul edilir.
6. **Delil dilekçesi ret gerekçeleri:** "Tanık Selin Kaya'nın HTS kaydı" → CMK 135/6 yalnızca şüpheli ve sanığın iletişimini kapsar; "Olay yerinde keşif" → lamba onarıldı, sokak değişti.
7. **Tanık ziyaretleri:** Selin'e "baskı yap" seçeneğinin geri bildirimi TCK 277; Hüseyin'e "yazılı beyan yeter" → CMK 210/1.
8. **Son inceleme düzeltmeleri (Plan A sonu):** İNDİRİM hükmünde TCK 62/1 gerekçesi "duruşmadaki tutum ve davranışlar" yerine "sabıkasız geçmiş ve cezanın geleceği üzerindeki olası etkiler" oldu (TCK 62/2 son cümle şeklî tutumu indirim nedeni saymaz; C13_B geri bildirimiyle tutarlı). MAHKÛMİYET'in B varyantı (yalnızca 142/2-h) çöküşte uygulanmaz; çöküşte A metni + çöküş notu kullanılır (A.6). İncelemede açık kalan içerik notları: C_07'de çağrılmamış Hüseyin'in kürsüde görünmesi (statik tanık alanı), S3'e yanlış sunumda genel geri bildirim ("Çelişki yok; bastırmak yeterliydi." yerine), sert tonun yalnızca anlatı bilgisi vermesi (fact_murat_cagirdi, hint_selin_offduty, fact_borc okunmuyor).

## v2 (hikâye ve oyun yüzeyi, 2026-10-20) — incelemeye eklenenler
v2 yeniden yazımı hukuki gerçeği değiştirmedi; yeni sahneler ve mekanikler aşağıdaki hukuki noktaları ekledi. Madde atıfları
karakterlerin gündelik konuşmasında değil; geri bildirimde, mentorun kısa açıklamalarında, rapor ve hüküm metinlerinde yer alır.

1. **Tutukluluk incelemesi ve tahliye (C_ARA):** Mahkeme delil toplamak için bir hafta erteler ve tutukluluğu inceler
   (CMK 108/3). Teşhisi sarsan bir bulgu (contra_s1 ∨ contra_s2 ∨ selin_cozuldu, sahte ikrar yoksa) varsa adli kontrol
   şartıyla tahliye (CMK 100/1, 109); yoksa talep reddedilir. "Hemen beraat" talebi kötü işaret alır: deliller toplanmadan
   esas hakkında hüküm kurulmaz. İnceleme sorusu: sabıkasız sanık ve teşhisin çökmesi karşısında tahliye takdirinin gerçekçiliği.
2. **Mahkûmiyet hükümlerinde tutukluluk ifadesi:** Sanık arada tahliye edilmiş olabileceği için hüküm fıkrası "tutukluluk
   hâlinin devamına (2. celsede adli kontrolle tahliye edilmişse, hükmolunan cezanın miktarı gözetilerek hükümle birlikte
   tutuklanmasına, CMK 100–101)" biçimine getirildi. Şema hükmü tek metin tuttuğu için iki durumu kapsayan bu ifade seçildi;
   inceleme sorusu: uygulamadaki standart ifadeye ("hükümle birlikte tutuklanmasına") uygunluğu.
3. **Kart okuyucu kayıtları (ARA_KART):** Özel şirketten belge avukatın Av.K. 2/3 yetkisiyle istenemez; kayıtlar mahkemenin
   ara kararıyla işverenden istenir (C_ARA'da başkanın satırı). Belediye kaydı ise Av.K. 2/3 ile istenir (değişmedi).
4. **Şüpheli konumundaki tanıkla temas (ARA_SELIN):** Selin kendiliğinden konuşmak ister. Doğru seçenek: avukatı ve
   savcılığı göstermek; bilgi kendi isteğiyle gelir (+). Karşı tarafın tanığından beyan toplayıp tutanak düzenlemek (−; ifade
   alma yetkisi yok, TBB Meslek Kuralları) ve korkutmak (−) cezalıdır. İnceleme sorusu: meslek kuralları atfının yeri.
5. **Kaçma şüphesi (ARA_LIMAN):** Avukat şüpheliyi kovalamaz; bilgiyi nöbetçi savcılığa iletir (CMK 158 ihbar; yakalama
   kolluğun işi). Kendi gitmek SS −25 ve kötü işaret alır; savcılığa bildirmek UB +50 ve `murat_caught`.
6. **Tehdit bildirimi (INV_GECE, ARA_HUS):** Kapı altındaki not ve çay ocağının camının kırılması savcılığa/kolluğa
   bildirilir (TCK 106 tehdit). Tanığa gözdağı için koruma talebi ve mahkemeye bildirim olumlu işaret alır.
7. **Duruşmada delil ve tanık talebi:** Aradaki DNA ek talebi ve Hüseyin'in duruşmada dinlenmesi talebi CMK 206/1'e
   dayandırıldı (CMK 177 süresi geçtikten sonra duruşmada talep).
8. **Sanığa müdafiin sorusu (C_02Q, CMK 201):** Bilgi veren sorular (+), boş soru ("yaptın mı?", nötr) ve sanığı tahmine
   zorlayan soru (savcının itirazı yerinde, −).
9. **Kolluk görevlisinin tanıklığı (C_08T):** Tutanak düzenleyen Kom. Yusuf Er 3. celsede tanık olarak dinlenir; beyanının
   duyuma dayanan kısmına (Murat Koç'un çıkış saati) itiraz `g_duyum` ile kabul edilir (A.9'daki "duyum" inceleme sorusu
   burada da geçerli). Komiser aramayı kendisinin yapmadığını, arama kararı ve tutanağı olmadığını kabul eder; bu, anahtarın
   hukuka aykırı aramayla elde edildiği tespitini (5188 md. 7/a, 9/1; CMK 119/1; Anayasa 38/6; CMK 206/2-a, 217/2) destekler.
10. **Savcılık delilini kendi tanığına sunmak (PS_SAVCILIK):** Anahtar ya da parmak izi raporunu tanığa "çelişki" diye sunmak
    yanlış delil gibi cezalandırılır; ayrı kural yalnızca gerekçeyi netleştirir.
11. **Esas savunma dayanakları (C_12P):** En çok üç dayanak; yalnızca duruşmada ispatlanmış dayanak + puan alır, ispatlanmamış
    dayanak − alır. Bu bir anlatı/strateji mekaniğidir; hukuki sonuç koşullarına girmez.
12. **Tanığa telkinli soru (ARA_EKIP):** Belediye ekip şefine isim önermek ("Murat Koç'tu, değil mi?") nötr/eksi; açık uçlu
    soru +. Kişi hukuken tanık sıfatı taşımaz (duruşmaya çağrılmaz); yalnızca bilgi kaynağıdır.


## v3 — iç inceleme kararları (2026-10-20)

Kaynaklar yukarıdaki mevzuat metinleridir (erişim 2026-10-20). "Yorum" işaretli kararlar mevzuatın açıkça düzenlemediği, oyunda bir
tercih yapılan yerlerdir.

### A.9 listesinin kapanışı
| # | Soru | Karar |
|---|---|---|
| 1 | Görev süresi dışındaki özel güvenlik görevlisinin rızaya aykırı çanta araması | 5188 md. 7 yetkileri görev alanı ve süresiyle sınırlıdır; görev süresi bitmiş görevlinin rızasız el araması ne 5188 md. 7 ne CMK 116–119 kapsamındadır. Delil hukuka aykırı yöntemle elde edilmiştir (Anayasa 38/6, CMK 206/2-a, 217/2, 230/1-b). **v3:** Mahkemenin bunu tespit edebilmesi için aramanın kim tarafından, nasıl yapıldığının dosyada gösterilmesi gerekir; oyunda bu, Kom. Yusuf'un anlatımı (clue_yusuf_arama → ded_arama) ile sağlanır. ded_arama yoksa C08_A tutanağa geçer ama anahtar dışlanmaz (yorum: ispat yükü iddia edende, CMK 206/2-a uygulaması somut tespit ister). |
| 2 | Tanık HTS'si | CMK 135/6 yalnızca şüpheli ve sanığın iletişimini kapsar; tanığın kaydı istenemez (HTS_TANIK, DIL_SELIN_HTS reddedilir). Murat hakkında somut dayanakla yapılan suç duyurusu üzerine ayrı soruşturmada hâkim kararıyla alınan kayıt (ev_hts), CMK 135/6'daki "aynı soruşturma" sınırlaması tartışmalı olsa da, bu davada savcılıkça dosyaya getirilen ve tarafların tartıştığı bir belge olarak değerlendirilir (yorum; CMK 138/2 tesadüfen elde edilen delil kurumu bu durumu doğrudan düzenlemez). |
| 3 | İşverenin verdiği anahtar ve 142/2-d | Bent "haksız yere elde bulundurulan anahtar" der; işverence teslim edilen anahtar bu kapsama girmez (C03_A, İNDİRİM ve MAHKÛMİYET B hükmü). İki bent birlikte uygulanırsa temel cezanın alt sınırdan uzaklaşması (TCK 61/1) olağandır. |
| 4 | Görevli mahkeme ve heyet | 5235 md. 12: ağır ceza mahkemesi başkan ve iki üyeden oluşur. **v3:** C_00 açılışında heyet "Başkan Nevzat Ural, üyeler Ayşe Demir ve Orhan Tekin" olarak okunur; hüküm sahnesinde üç hâkim yerini alır. Kürsü görseli iki hâkim gösterir (istemci sınırı). |
| 5 | 142/2-d için ek savunma | CMK 226/1 ek savunma hakkı; 226/3 hazırlanma süresi talebi (C01_A). |
| 6 | Sahte ikrar, TCK 270 ve mahkûmiyetin gerçekçiliği | Sanığın gerçeğe aykırı ikrarı TCK 270 kapsamında değerlendirilebilir; avukatın yönlendirmesi Av.K. 34 ve TBB Meslek Kuralları ihlalidir (etik kartı). **v3:** İKRAR gerekçesi artık mazeretle çelişen ikrarı "çelişse de" esas almaz. Mahkeme; ikrarın müdafi huzurunda ve iradi yapıldığını, son sözde sürdürüldüğünü (CMK 148/1), parmak izi ve [dışlanmamışsa] anahtarla örtüştüğünü (CMK 217/1) açıklar; mazeret ispatlanmışsa fişin bir ödemenin saatini gösterdiğini ama sanığın 22.30–23.15 arası kesintisiz çay ocağında kaldığını göstermediğini, çay ocağının aynı tesiste olduğunu ve tanığın aileye yakınlığını gerekçe gösterir (CMK 230/1 gerekçe yükümlülüğü). Yorum: istinafta bozulma ihtimali yüksek bir gerekçedir; oyunda bu, sahte ikrarın bedelini göstermek için bilerek seçildi ve epilog bunu anlatır. |
| 7 | Savunmanın talebiyle TCK 274 hatırlatması | CMK 48 yalnızca tanıklıktan çekinmeyi düzenler; TCK 274 (yalan tanıklıkta etkin pişmanlık) hatırlatmasını müdafi talep edebilir, başkan takdiren yapar (C06H_A). Yorum: uygulamada başkanın genel uyarısı olarak yer alır. |
| 8 | Şüpheli konumundaki tanığın yeminsiz dinlenmesi | CMK 50/1-c: hakkında soruşturma bulunan tanık yeminsiz dinlenir (C04_YEMINSIZ, sucduyurusu_selin ile). |
| 9 | Teşhis usulü | Mevzuatta ayrıntılı bir teşhis prosedürü yoktur; Yakalama, Gözaltına Alma ve İfade Alma Yönetmeliği'ndeki teşhis (sıra hâlinde gösterme) usulü uygulanmamış, teşhis başkasının sözüyle sabah yapılmıştır. Delil değeri CMK 217 serbest takdirine göre düşer (S4 bastırma, PS_S4_KOLLUK). |

### v2 listesinin kapanışı
| # | Konu | Karar |
|---|---|---|
| 1 | Tahliye takdiri (C_ARA) | Teşhisi sarsan bulgu varken sabıkasız ve ikametgâhı belli sanığın adli kontrolle tahliyesi gerçekçidir (CMK 100/1, 108/3, 109). Değişmedi. |
| 2 | Mahkûmiyet hükmünde tutukluluk ifadesi | İki durumu kapsayan ifade korunur; şema tek metin taşıdığı için bilinçli tercih. |
| 3 | Kart okuyucu kayıtları | Özel şirket kaydı Av.K. 2/3 ile istenemez; mahkemenin ara kararıyla gelir (CMK 332'deki bilgi isteme yetkisi ve CMK 206 çerçevesinde). Değişmedi. |
| 4 | Şüpheli konumundaki tanıkla temas | **v3:** ASEL_B (beyan toplayıp imzalatmak) ve ASEL_C (korkutmak) etik sayacını artırır; atıf Av.K. 34, TBB Meslek Kuralları, CMK 147/160–161 (ifade alma kolluk ve savcılığındır); korkutma TCK 277 yönünden değerlendirilebilir. ASEL_B artık bilgi de vermez. |
| 5 | Kaçma şüphesi | İhbar CMK 158; **v3:** kendi gitmek (ALIM_KENDIN) etik ihlali sayılır (Av.K. 34). |
| 6 | Tehdit bildirimi | TCK 106; değişmedi. |
| 7 | Duruşmada delil talebi | CMK 206/1; **v3:** Leyla'nın 4. gün cümlesi "geç verilen talep reddedilir" yanlışından arındırıldı: CMK 206/2 gecikmeyi ret sebebi saymaz; duruşmada talep erteleme ve gerekçe gerektirir. |
| 8 | Sanığa müdafiin sorusu | CMK 201; değişmedi. |
| 9 | Kolluk görevlisinin tanıklığı ve "duyum" itirazı | Türk usulünde ayrı bir "duyum itirazı" kurumu yoktur; oyunda bu, beyanın doğrudan doğruyalık (CMK 210) ve takdir (CMK 217) yönünden zayıflığını ileri süren bir "diyecek" (CMK 215) olarak çerçevelenir (yorum, oyun mekaniği). |
| 10 | Savcılık delilini tanığa sunmak | PS_SAVCILIK; **v3:** Kerem'in kolluk ifadesi de bu kurala eklendi. |
| 11 | Esas savunma dayanakları | Strateji mekaniği; hukuki sonuç koşullarına girmez. |
| 12 | Belediye ekip şefine telkinli soru | Kişi tanık değil, bilgi kaynağıdır; telkinli soru eksi puan alır. Değişmedi. |

### v3'te eklenen ya da değişen hukuki noktalar
1. **Ceza aralığı (kart ve BR_01):** TCK 142/2-h 5–10 yıl; TCK 143/1 gece vakti cezayı "yarısına kadar" artırır. Üst sınır 15 yıldır;
   artırım oranı mahkemenin takdirindedir, bu yüzden alt sınır 5 yılın biraz üstünden başlar. Kart artık "5–15 yıl (TCK 143 ile)" der;
   BR_01 bu aralığı değil, artırımın niteliğini sorar. Hükümlerde mahkeme yarı oranında artırır (5 yıl → 7 yıl 6 ay); bu takdir içindedir.
2. **HTSS_EKLE:** Çizelgede saatin sonradan değiştirilmesi iftira (TCK 267) değil; yalan tanıklık (TCK 272) ve özel belgede sahtecilik
   (TCK 207) yönünden değerlendirilir. Atıf etiketten geri bildirime taşındı.
3. **MAHKÛMİYET gerekçesi:** Mahkûmiyet delil değerlendirmesine dayanır (CMK 217, 230/1): teşhis (çürütülmediyse esas alınır; çeliştiyse
   bütünüyle çürümüş sayılmaz), parmak izi, anahtar (dışlanmadıysa destekleyici), mazeret (ispatlanmadı ya da teşhisi ortadan kaldırmaya
   yetmedi) ve ceza aritmetiği. "Savunmanın inandırıcılığı çöktü" bir hukuki gerekçe olmadığından gerekçeden çıkarıldı; çöküş yalnızca epilogda.
4. **İNDİRİM gerekçesi:** Hesaptan önce delil değerlendirmesi satırı eklendi (anahtar dışlandıysa teşhis ve iz).
5. **Etik ihlalleri:** TSEL_BASKI, HTS_OP, C02D_ISRAR'a ek olarak C06H_B (kürsüde tanığa gözdağı), ASEL_B, ASEL_C, ALIM_KENDIN ve AKER_EZBER
   (son söz sanığındır, CMK 216/3; müvekkilin ağzına söz konmaz, Av.K. 34) etik sayacını artırır; XP yarıya iner.
6. **C08_A:** Hukuka aykırı arama itirazı her zaman tutanağa geçer; ama anahtarın dışlanması (key_excluded) aramanın nasıl yapıldığının
   dosyada gösterilmesine (ded_arama) bağlıdır (bkz. A.9 #1).
7. **ded_nisan (tanığı susturan bağ):** Tanığın gerçek failin nişanlısı olması, beyanının güvenilirliği yönünden CMK 217/1 takdirine girer;
   esas savunmada 223/2-b anlatısını güçlendirir, kendi başına bir hukuki sonuç doğurmaz.
