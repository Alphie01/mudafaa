# Dava #05 "Gece Yarısı Gaspı" — Dava Tasarımı

> Kaynak: `content/src/gece-yarisi-gaspi/` (yazım kiti + satır kısaltması `dsl.ts`) → `content/cases/gece-yarisi-gaspi/`
> (`npm run case:build -- gece-yarisi-gaspi`). Hikâye kitabı: `docs/content/gece-yarisi-gaspi-hikaye.md` (önce yazıldı).
> Hukuki notlar: `docs/legal/gece-yarisi-gaspi.md`. Lineup: #05, rütbe şartı yok, zorluk 2.

## 1. Logline ve tema

- **Logline:** Tophane'de bir hasta bakıcının çantası kapılır; ertesi sabah kadın, karakolda altı fotoğraf arasından genç bir
  motokuryeyi seçer. Kurye o gece ateşler içinde evde olduğunu söyler. Avukat, mağduru yalancı çıkarmadan onun hafızasının
  acil serviste gösterilen tek bir fotoğrafla nasıl kirlendiğini ve o gece kuryenin hesabını kimin taşıdığını kanıtlamalıdır.
- **Tema:** Hafıza bir delil değil, bir sahnedir. Kimse yalan söylemiyor; herkes yanılıyor.
- **Dava #07'den farkı:** Dava #07'de görgü tanığı fail nişanlısını korumak için bilerek yalan söylüyordu; mazeret çay ocağı
  fişi ve çaycıydı. Burada mağdur dürüst ve kirlenmiş bir tanıktır (çapraz sorgunun amacı onu yenmek değil, ilk sözlerini
  ona geri vermektir); mazeret bir elektrik kesintisi, üst kat komşusu ve 186 arıza hattı aramasıdır; ters köşe bir kurye
  hesabının, ona benzeyen kuzen tarafından kullanılmasıdır.

## 2. Gerçek ve kronoloji

Ayrıntılı tablo hikâye kitabının §2'sindedir. Oyuncunun öğrenme sırası:

| Gerçek | Nerede öğrenilir |
|---|---|
| Mağdur 112'de "sol kulağında halka", "itti, düştüm" dedi; bıçak demedi | INV_112 (belge: dinle × c5, karşılaştır × c2); INV_T_ALI (bakkal) |
| Teşhis tutanağı usulsüz (renkli/büyük tek kare, tarif sonra, tek tekrar) | INV_TESHIS (belge) |
| Acilde polis tek fotoğraf gösterdi | INV_ARAMA3 (nöbet çizelgesi) → INV_T_GAMZE; INV_T_FERHAT ("bir baktırdım"); INV_DIL → ev_gozlem |
| Barış'ın kulakları delinmemiş; polisin karesi üç yıllık | INV_GORUSME (Kulak, Eski dosya); INV_ARAMA2 (vesikalık) |
| Kesintide Barış balkondaydı | INV_ARAMA2 (balkon mumu) → INV_T_KADIR; INV_DIL → ev_uedas → INV_UEDAS |
| Hesap 23.41'de merdiven dibinde (ters köşe) | ARA_GIRIS (ev_gps) |
| Hesap başka telefondan açıldı; 22.31 mesajı "Tolga" | ARA_GPS (cihaz), ARA_TEL (ek-3) |
| Barış 23.40'ta evinden 186'yı aradı | ARA_TEL (karşılaştır × t3) |
| Oturum özçekiminde sol kulakta halka | ARA_SELFIE (yakınlaştır × s3; özçekim H1_02'de ya da ARA_DIL ile istenmeli) |
| Tolga hesabı kullanıyordu; kulağında halka var | ARA_BARIS (BQ_GPS, BQ_HALKA) |
| Derya'nın şafak sırrı | ARA_DERYA |
| Kebapçıdaki bereli, halkalı kurye | ARA_KEBAP (sahne) |

## 3. Kadro

Bkz. hikâye kitabı §1. Yeni sprite'lar (Derya, Tolga, Nermin, Kadir, Gamze) `content/src/gece-yarisi-gaspi/sprites.ts`'te satır
içi tanımlıdır: `content/shared/sprites/` dizini `tools/content/test/extract-sprites.test.ts` gereği yalnızca tasarımdan
çıkarılmış ortak sprite'ları tutar (yeni dosya testi kırar). Sprite'lar yazım sırasında `case:sprite-preview` ile denetlendi. Ortak sprite'lar: avukat_cubbe (Deniz), mentor (Leyla), muvekkil (Barış), anne
(Sevim), polis (Ferhat), hakim/uye_hakim/savci/mubasir (heyet), gardiyan (Hasan), bora (Ali Rıza), bilirkisi (Cemal Usta).

## 4. Delil zinciri

| Kimlik | Ad | Tür | Keşif | Ne işe yarar | Sunulur |
|---|---|---|---|---|---|
| ev_teshis | Fotoğrafla teşhis tutanağı | EVIDENCE (savcılık) | baştan | N4/F3'e (clue_foto_farkli ile) | ✓ |
| ev_nermin_kolluk | Mağdurun kolluk ifadesi | EVIDENCE (savcılık) | baştan | — (yanlış sunum cezası) | ✓ |
| ev_ihbar | İhbar formu ve 112 dökümü | EVIDENCE | baştan | N2 (clue_bicak_yok ile), N5 (clue_halka ile) | ✓ |
| ev_darp | Adli muayene raporu | EVIDENCE (savcılık) | baştan | — | ✓ |
| ev_sabika | 2023 gözaltı kaydı | EVIDENCE (savcılık) | baştan | F4 (yumruk, bıçak değil) | ✓ |
| ev_gozlem | Hemşire gözlem formu | EVIDENCE | INV_DIL → gün sonu / duruşma gecesi | N3, F2 (kırılma) | ✓ |
| ev_uedas | UEDAŞ kesinti kaydı | EVIDENCE | INV_DIL / ARA_DIL | F6; INV_UEDAS/ARA_UEDAS belgesi | ✓ |
| ev_gps | HızlıPaket dökümü | EVIDENCE (savcılık) | ARA_GIRIS | ARA_GPS belgesi | ✓ |
| ev_tel | Telefon inceleme raporu | EVIDENCE | ARA_GIRIS | ARA_TEL belgesi; F6 | ✓ |
| ev_selfie | Doğrulama özçekimi | EVIDENCE | ARA_GIRIS (H102_A) / ARA_DIL | ARA_SELFIE belgesi; F5 | ✓ |
| clue_* | 30 ipucu (sahne, belge, görüşme) | CLUE | sahne/belge/görüşme | tahtaya | — |
| ded_kirlenme | Teşhis acilde kirlendi | INSIGHT | gamze_beyan/ferhat + foto_farkli | N3, F2 | ✓ |
| ded_usulsuz | Teşhis usulsüz | INSIGHT | tarif_sonra + tek_tekrar | N4, F1 | ✓ |
| ded_halka | İlk tarif uymuyor | INSIGHT | halka/ali_halka + kulak | N5, F5 | ✓ |
| ded_bicak | Bıçak yoktu | INSIGHT | bicak_yok + cam | N2, F4; silah unsuru | ✓ |
| ded_mazeret | Kesintide evdeydi | INSIGHT | kadir + kesinti | F6, X_215 | ✓ |
| ded_eski_foto | Gösterilen yüz eski | INSIGHT | eski_foto + vesikalik | N1 (kısmi) | ✓ |
| ded_baskasi | Hesabı taşıyan halkalıydı | INSIGHT | selfie/cemal + halka | T_01, F5 | ✓ |
| ded_hesap | Hesap başka telefondaydı | INSIGHT | cihaz + mesaj | T_01, F5 | ✓ |
| ded_evde | 23.40'ta 186 araması | INSIGHT | 186 + kesinti | T_01, F6 | ✓ |

Çeldiriciler: eczane kamerası, kedi, duvar saati, koridor kamerası/bank, kurye aynası, kebapçı kamerası (−10); tahtada
ateş + kutu, aile fotoğrafı + askı, durak + motor, bahis + aile fotoğrafı (−50); yanlış alet (−20).

## 5. Çelişkiler

**Nermin Aksoy (1. celse, yeminsiz):** N1 "yüzünü çok yakından gördüm" (bastır → N5 açılır; ded_eski_foto kısmi) · N2 "bıçak
vardı" (ev_ihbar + clue_bicak_yok ya da ded_bicak → contra_n2) · N3 "polis kimseyi göstermedi" (ev_gozlem / ded_kirlenme →
contra_n3) · N4 "tereddüt etmedim … böyle çocuklar hep gece dolaşır" (ev_teshis + clue_foto_farkli ya da ded_usulsuz →
contra_n4; itiraz g_kanaat) · N5 "kulağında bir şey yoktu" (ev_ihbar + clue_halka ya da ded_halka → contra_n5 → kırılma
H1_03K). Savcılık delilleri yanlış sunumda ♥−1, −150.

**Ferhat Oral (2. celse, yeminli):** F1 "kurallara uygun" (ded_usulsuz) · F2 "acilde göstermedim" (ev_gozlem / ded_kirlenme →
kırılma T_02K; bastırma clue_ferhat ile ek puan) · F3 "fotoğraflar benziyordu" (ev_teshis + clue_foto_farkli) · F4 "kaydında
bıçaklı yaralama" (ev_sabika / ded_bicak) · F5 "tarife uyan tek kişi … kaydı olan bir daha yapar" (ded_halka / ded_baskasi /
ded_hesap; ev_selfie + clue_selfie; itiraz g_kanaat) · F6 (F5 bastırılınca) "annesinden başka bir şey yoktu" (ded_mazeret /
ded_evde; ev_uedas / ev_tel kayıt ipuçlarıyla) · F7 "hesap sanığın, konum oradaydı, özçekim onaylı" (ded_hesap / ded_baskasi →
contra_f7, ikna +2; ev_gps / ev_tel / ev_selfie kayıt ipucuyla kısmi; savcılık delilleri yanlış sunumda ♥−1, −150).

**Yönlendirilmiş tanıklar:** bakkala "bıçak olmadığını da söyleyin" (ALI_EVET → `ali_kocluk`) ikinci celsenin açılışında
savcı tarafından tutanağa geçirilir (`ali_ifsa`: ♥−1, ikna −1, −150). Kadir Usta'ya saat verilmişse (KD_SAAT / KA_SAAT →
`kadir_kocluk`) savcının karşı sorusu saati her durumda sınar ve yönlendirmeyi açığa çıkarır (`kadir_ifsa`: ♥−1, ikna −2,
−200); Kadir'in mazereti `mazeret_var` / `mazeret_kayitta` içinde sayılmaz. Her ikisi gerekçeye ve etik epiloguna düşer.

**Diğer kararlar:** H1_02 kayıt talebi (özçekim eklemek), H1_04 salonda teşhis itirazı, H1_05 tutukluluk, T_01 kayda karşı
diyecekler (cihaz, özçekim, 186, Barış'ın açıklaması; kaydı "hatalı" demek cezalı), T_03X savcının karşı sorusu (itiraz
dayanaksız; diyecek ded_mazeret/ded_evde ile), T_06P üç dayanak (kanıtsız dayanak −40), T_06 esas savunma, T_07 son söz.

## 6. Sonuçlar

Hüküm delile bağlıdır, skora değil. Skor yalnızca XP'yi, indirim sınırını, "derin tartışma" eşiğini (ham ≥ 7.500) ve
savcının ikinci celseden önce harekete geçip geçmediğini (ham ≥ 6.500) belirler.

| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | AZIL | OTHER (etik) | `etik_kirlik` (mağdura özçekim) | Vekâlet sona erdi; durum tutanağa, Baroya ve Başsavcılığa bildirim | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | `tolga_teslim` | Ceza yok, tahliye, saat iadesi, karar örneği Tolga soruşturmasına | 1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | ¬çöküş ∧ (`mutalaa_b` ∨ (beraat_delil ∧ ikna ≥ 6 ∧ derin)) | Ceza yok, tahliye, suç duyurusu | 1,0 |
| 4 | ERTELEME | OTHER | ¬çöküş ∧ ¬teslim ∧ beraat_delil ∧ ikna ≥ 6 (ama derin değil) | Bilirkişi (CMK 63, 67), adli kontrolle tahliye (CMK 109) | 0,5 |
| 5 | INDIRIM | REDUCED | ¬çöküş ∧ ¬teslim ∧ ¬beraat ∧ ¬erteleme ∧ terditli esas savunma ∧ silah dayanağı ∧ final ≥ 3.000 | 149/1-h, 10 yıl → 62/1 → 8 yıl 4 ay | 0,85 |
| 6 | MAHKUMIYET_H | CONVICTION | ¬teslim ∧ ¬beraat ∧ ¬erteleme ∧ silah unsuru duruşmada düştü (contra_n2 ∨ contra_f4 ∨ arg_silah) | Yalnız 149/1-h, 11 yıl → 62/1 → 9 yıl 2 ay | 0,6 (çöküş 0,3) |
| 7 | MAHKUMIYET | CONVICTION | varsayılan | 149/1-a, h, 12 yıl → 62/1 → 10 yıl | 0,6 (çöküş 0,3) |

- **teshis_coktu:** contra_n3 ∨ contra_f2 ∨ (contra_n4 ∧ contra_n5) ∨ (contra_f1 ∧ contra_f3).
- **hesap_kayitta** (hesap cevabı tutanakta): (contra_gps ∧ ded_hesap) ∨ (contra_selfie ∧ ded_baskasi) ∨ contra_f7.
- **mazeret_kayitta:** (contra_186 ∧ ded_evde) ∨ (contra_f6 ∧ mazeret_var) ∨ kadir_215; `mazeret_var` yönlendirilmiş Kadir'i saymaz.
- **halka_var:** ded_halka ∨ contra_n5 ∨ contra_f5 — aynı 112 beyanı tek bulgu olarak sayılır ve tek başına beraat getirmez.
- **dosya_butun:** dokuz çıkarımdan en az yedisi. **beraat_delil** = teshis_coktu ∧ hesap_kayitta ∧ mazeret_kayitta ∧ dosya_butun.
- **mutalaa_b** (T_05'te): ¬tolga_teslim ∧ beraat_delil ∧ ikna ≥ 6 ∧ derin → savcı beraat ister; o dosyada mahkûmiyet/indirim kurulmaz.
- **tolga_teslim** (ARA_SON_1): `bildirim_guclu` (K_BILDIR ∧ ded_baskasi ∧ ded_hesap ∧ dosya_butun) ∧ `derya_konustu`
  (D_SAVCI ya da D_TOLGA) ∧ ¬tolga_kacti (yüzleşme yok) ∧ ham ≥ 6.500. Skor düşük olsa da 223/2-b gelir (TESLIM_D).
- Etik sayaç (`ethics`): N_ISRAR, ALI_EVET, KD_SAAT, KA_SAAT, Z_TUT (+1), K_NERMIN (+2). XP etikte yarıya iner; AZIL'de 0.
  D_TOLGA (aileye "teslim olsun" demek: güven −10, −40, Leyla telefonu), FQ_TEHDIT (−80, Leyla telefonu), K_YUZLES (−80,
  Tolga kaçar, Leyla "Kovalamak avukatın işi değildir") ayrıca geri bildirim verir.
- Epiloglar `bildirdi`, `fact_tolga`, `tolga_kacti`, `released` ve yönlendirme bayraklarına göre ayrılır (doğrulayıcı epilog
  koşullarını okumaz; tutarlılık elle denetlendi: bildirim yapılmışsa "dilekçe yazacağım" satırı çıkmaz, teslimde 2-e epilogu kurulmaz).

## 7. Skor

- Kategoriler ve döküm satırları: Delil toplama (ARAŞTIRMA + DELİL ANALİZİ, `key` etiketli 12 delil) · Çapraz sorgu
  (SORGULAMA) · İtiraz isabeti (USUL + HUKUKİ, `legal_hits`/6) · Savunma (SAVUNMA STRATEJİSİ) · Hatalı delil (`wrong`).
- Güvenilirlik bonusu: ♥ × 100. Strateji çarpanı yalnızca uyumlu esas savunmada (MASUMIYET ×1,5 · USUL ×1,2 · INDIRIM ×0,8).
- Eşik çubuğu: Mahkûmiyet 0 · İndirim 3.000 (beraat skor eşiğine bağlı olmadığı için çubukta beraat yok). `scaleMax` 12.000.
- Tutarlar: olay yeri nesnesi +20…+60, ıska/çeldirici −10; belge isabeti +100/+150, yanlış alet −20; tarif +300, yanlış çift
  −50; BASTIR +25; doğru sunum +200/+300, kısmi +100; yanlış sunum −150 ♥−1; usul +50…+150, dayanaksız −50 ♥−1; dayanak +60 /
  −40; esas savunma 150–300 (çarpanlı); etik sınır ihlalleri −50…−150.

## 8. Node grafiği

Bkz. hikâye kitabı §3. Uygulamadaki ek node'lar: INV_EV_G (ev girişi), INV_T_ALI_K / INV_T_KADIR_K / INV_T_GAMZE_K (tanık
kararları), INV_GECE_1…7 (koşullu hafıza zinciri), H1_00G_1…3 + H1_00K (koridor), H1_04B (kısa ara), ARA_BARIS_G, ARA_KEBAP_G,
ARA_SON_1…3, T_00G_1…2, T_ETIK (azil), T_02R (kısa ara), T_03_G / T_03Y, T_04_G / T_04 / T_04C_G / T_04C. Soruşturma hub'ı
push/`$return`; ara hub'ı yığınsız (her alt ekran doğrudan ARA_HUB'a döner; `retarget`). Toplam 106 node.

Motor sınırlarına çözümler: koşullu parçalar DECISION zincirleriyle (INV_GECE_*, H1_00G_*, ARA_SON_*, T_00G_*); tekrar
eden ceza kuralları `maxUses`; alternatif tarifler `IF ¬hasEvidence` ile yalnızca ilk kurulumda puanlı.

## 9. Golden path'ler

| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| G1 | BERAAT_B | 11.450 | Masumiyet; tam soruşturma; zarf alınır ve iade edilir; Derya'yla doğru konuşma + kayıtlara bağlı bildirim → Tolga teslim olur |
| G2 = TIPIK | BERAAT_E | 11.290 | Usul; tam soruşturma; savcılığa bildirim, Derya'ya gidilmez; Tolga teslim olmaz; savcı beraat ister |
| G3 | INDIRIM | 3.870 | Terditli; acil gösterimi kanıtlanmaz; halka ve bıçak çelişkileri; yüzleşme hatası; silah dayanağı |
| G4 | MAHKUMIYET | −395 | Dağınık soruşturma, etik sınır ihlalleri (kapı, bakkal, terzi, zarf), dayanaksız savunma |
| G5 | AZIL | 8.130 | İyi bir soruşturma; ara evresinde mağdura özçekim gösterilir |
| W | MAHKUMIYET_H (çöküş) | 7.180 | İkinci celsede kolluk tanığına art arda savcılık delili; ♥0; bıçak çelişkisi kayıtta olduğundan yalnız 149/1-h |
| TESLIM_D | BERAAT_B | 7.620 | Uç durum: kayıtlara bağlı bildirim + Derya'nın kendi kararı; düşük skorla da 223/2-b |
| E_DUSUK | BERAAT_E | 8.000 | Uç durum: tam delil zinciri tutanakta, savcı beraat istiyor; eski 9.000 eşiğinin altında da 223/2-e |
| ERTELEME | ERTELEME | 7.995 | Delil zinciri tam ama kayıtlar derin tartışılmadı → bilirkişi ve adli kontrolle tahliye |
| ETIK | BERAAT_E | 10.390 | Tipik yol, ama bakkala ve Kadir Usta'ya cümle verilir; ikisi de duruşmada açığa çıkar; etik epilogu, yarım XP |

## 10. Erken çözüm denetimi

Tek süreçli, bütçeli küçültme yoklaması (`act`/`enumerateActions` üzerinde; golden path'ten parça silme + her konumda
alternatif aksiyon takası; 2026-10-21):

| Kaynak yol | Hedef | En kısa bulunan | Oran |
|---|---|---|---|
| TIPIK (208) | 223/2-e ya da 2-b | 129 aksiyon, BERAAT_E 8.000 | 0,62 |
| G1 (211) | 223/2-b | 138 aksiyon, BERAAT_B 7.630 | 0,65 |
| E_DUSUK (145) | 223/2-e | 138 aksiyon | — |
| TESLIM_D (154) | 223/2-b | 150 aksiyon | — |

Her kısa beraat yolu iki celseyi, ara evresini ve tam zinciri içerir (teşhis kirlenmesi, halka, bıçak, mazeret + 186, cihaz +
mesaj, özçekim; dokuzdan en az yedi çıkarım). Erken mahkemeye gitmek beraat getirmez; skor tek başına beraat getirmez.
Tipik yolun metni yeniden döküldü ve tarandı: Tolga'nın fail olduğu ARA_TEL/ARA_BARIS'ten (HızlıPaket kayıtlarından) önce
hiçbir metinde söylenmez ya da güçlü biçimde ima edilmez. Soğuk açılış 112 çağrısı ve acil servisteki sargıyla biter (telefon,
"galiba", form yok). Tolga'nın 2. gün akşamki ziyaretinde kulak/bere ayrıntısı ve karşılaştırma yoktur; aile düşünceleri
nötrdür. Erken ekilen ayrıntılar (görüşmede "amcamın oğlu Tolga", aile fotoğrafı, zarf, Derya'nın "boş ver"i) tek başına
bir yön göstermez.

## 11. Süre ve sözcük ölçümü

`npm run case:duration -- gece-yarisi-gaspi` (2026-10-21):

```
  G1             95.6 dk   13417 sözcük   211 aksiyon  BERAAT_B (11450)
  G2             94.4 dk   13240 sözcük   208 aksiyon  BERAAT_E (11290)
  G3             67.3 dk    9700 sözcük   134 aksiyon  INDIRIM (3870)
  G4             63.5 dk    9196 sözcük   124 aksiyon  MAHKUMIYET (-395)
  G5             79.0 dk   11058 sözcük   176 aksiyon  AZIL (8130)
  W              82.3 dk   11535 sözcük   182 aksiyon  MAHKUMIYET_H (7180)
  TESLIM_D       75.9 dk   10883 sözcük   154 aksiyon  BERAAT_B (7620)
  E_DUSUK        74.0 dk   10711 sözcük   145 aksiyon  BERAAT_E (8000)
  ERTELEME       75.4 dk   10900 sözcük   148 aksiyon  ERTELEME (7995)
  ETIK           95.2 dk   13374 sözcük   209 aksiyon  BERAAT_E (10390)
  TIPIK          94.4 dk   13240 sözcük   208 aksiyon  BERAAT_E (11290)
  ==> TİPİK YOL (TIPIK): 94.4 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```

Doğrulayıcı: PASSED — 0 hata, 1 uyarı (SIMULATION_INCOMPLETE); kapsam node 106/106, seçenek 204/204, kural 83/83, delil
49/49; golden path 11/11. Tipik yol 13,2 bin sözcükle görev aralığında (13–16 bin); kitin 15–25 bin "hedef" uyarısı bilinçli
olarak bırakıldı.
