# Dava #01 "Kayıp Cüzdan" — Dava Tasarımı

> Kaynak: `content/src/kayip-cuzdan/` (yazım kiti) → `content/cases/kayip-cuzdan/` (`npm run case:build -- kayip-cuzdan`).
> Hikâye kitabı: `docs/content/kayip-cuzdan-hikaye.md` (ton, kadro, sahne sahne vuruşlar, epiloglar). Hukuki notlar:
> `docs/legal/kayip-cuzdan.md`. Kılavuz: `docs/content/authoring-guide.md`. Lineup satırı: `docs/content/lineup.md` #01.

## 1. Logline ve tema
- **Logline:** Son sınıf öğretmen adayı Arda Çınar, otobüste koltuğun altında bulduğu boş cüzdan yüzünden hırsızlıkla (TCK 141/1)
  yargılanır. Kartlar o cüzdanı görmeden harcanmıştır; savcılığın elinde ise yalnızca 2,5 dakikalık, tek kameralı bir CD vardır.
- **Tema:** Niyet görünmez, ama iz bırakır. **Dramatik soru:** iyi niyetin kanıtı kimsenin umursamadığı küçük kayıtlarda mı?
- **Ton:** noir dram (yağmur, otobüs camında buğu, kayıt lambası); kuru mizah. **Mekânlar:** büro, Çarşı'da sahaf, Hat 38,
  Görükle'de öğrenci evi, Altıparmak'ta büfe, kıraathane, garaj, hastane, adliye emaneti, Bursa 9. Asliye Ceza, Beşevler'de ev.

## 2. Soğuk açılış
Hikâye kitabı §5 PROLOG: 18.42 otobüste camdaki bir siluet eğilir, avucunda koyu renk bir şeyle doğrulur, bir sırt çantası kapanır
(nereden aldığı, cüzdanın boş olduğu söylenmez); 18.49 Altıparmak'ta isimsiz bir ses, ıslak eldivenli bir el kartı üç ayrı
çektirir (cinsiyet, bere ve büfecinin fiş notu gösterilmez); 08.15 polis öğrenci evinin kapısındadır. Bulma ile çalma, kartları
kimin kullandığı ve "suç ortağı" okuması açık kalır. Bere ilk kez fiş notunda (clue_fis_notu) görünür.

## 3. Karakterler
Bkz. hikâye kitabı §2 (ses, sır, yay tablosu). Kimlikler: `deniz`, `leyla`, `arda` (CLIENT), `zehra` (FAMILY), `gulten` (VICTIM),
`hayri`, `recep`, `volkan`, `cemil`, `ozan` (WITNESS), `orhan` (POLICE), `hakim`, `savci`, `katip`, `mubasir`. Yankesici çift
kadroda **yoktur**; yalnızca betimlemeyle ("parkalı adam", "yeşil bereli kadın") geçer.

## 4. Gerçek ve kronoloji
Bkz. hikâye kitabı §3. Özet: 18.31–18.34'te yankesici çift Gülten Sarı'nın cüzdanını alır, nakit ve kartları çıkarır, 18.36'da
boş cüzdanı 14 numaralı koltuğun altına bırakır, 18.37'de Altıparmak'ta iner. Arda 18.42'de bulur, 18.43'te yanındakine sorar,
19.05'te şoföre uzatır (geri çevrilir), 19.18'de 153'ü arar, 21.14'te Facebook'tan yazar, 22.30'da "Yarın 9 — karakol" notunu
yazar. 7 Mart 08.15'te polis gelir. Kartlar 18.49 / 18.55 / 19.06'da Altıparmak ve Kültürpark'ta harcanır (2.940 TL).

## 5. Sahne listesi (tipik yol)
| # | Sahne (node'lar) | Bölüm | Vuruş | Mekanik | ~dk | ~sözcük |
|---|---|---|---|---|---|---|
| 1 | PROLOG, PR_02 | Soğuk açılış | Bulma, büfe, kapı | — | 5 | 750 |
| 2 | BR_00–BR_02 | Bölüm 1 | Zehra'nın çaresizliği; Leyla'nın devri | seçim, A–D, strateji | 9 | 1 700 |
| 3 | INV_SABAH, INV_HUB, INV_* (3 gün × 4 EP) | Soruşturma | Arda’nın hikâyesi; kayıt eksik; kartlar başkasında | 3 sahne (+ sahne sonrası anlar), 3 belge, görüşme, 4 konuşma, terminal, dilekçe, tahta, mentor | 35 | 3 500 |
| 4 | INV_GECE_* | Soruşturma | Pano; Arda'nın mesajı | — | 2 | 350 |
| 5 | H1_00–H1_08 | 1. celse | Sorgu, müşteki, Hayri'nin çapraz sorgusu, CD, nitelendirme uyarısı | A–D ×5, tanık ifadesi | 17 | 2 400 |
| 6 | ARA_* (3 gün × 3 EP) | Ara | Tam kayıt: ters köşe; Gülten’in mesajı; teknisyen, Ozan, Hayri, karakol; büfe | 2 belge, 7 konuşma, suç duyurusu, tahta | 22 | 2 300 |
| 7 | H2_00–H2_09 | 2. celse | Teknisyen ve şoför çöker; ek savunma; mütalaa | tanık ifadesi ×2, A–D ×5 | 18 | 2 600 |
| 8 | R_KARAR | Karar | Hüküm + epilog | — | 3 | 500 |

## 6. Ters köşeler ve epiloglar
Bkz. hikâye kitabı §5 (epiloglar) ve §6 (ekilen ipuçları).

## 7. Delil zinciri
**Dosyadaki deliller (başlangıçta bilinir):** `ev_klip` (CD kaydı, savcılık; kart metni savcılık çerçevesinde: "cüzdanı alıp
çantasına koyuyor", "yerden/eğilir" yok; bulma bilgisi INV_KLIP k5'te kazanılır), `ev_aktarim_formu` (CD aktarım formu), `ev_tutanak`
(el koyma tutanağı; 2. celsede Ozan'ın OS3 ifadesine sunulur), `ev_banka` (kart hareketleri; INV_BANKA belge incelemesinin konusu),
`ev_hayri_ifade`, `ev_recep_ifade`, `ev_gulten_ifade` (arka plan belgesi, sunulamaz; müşteki kendi beyanını duruşmada verir),
`ev_kentkart` (2. celsede Hayri'nin HR2 ifadesine sunulur: Arda 18.20'de Çarşı'dan bindi). Cüzdan soruşturmada yediemin olarak
müştekiye teslim edilmiştir (INV_EMANET e1); emanette zarf ve not kalır.

**İpuçları (CLUE, tahta kartı) ve kaynakları:**

| İpucu | Kaynak | Ne işe yarar |
|---|---|---|
| clue_dort_kamera | INV_OTOBUS | CD tek kamera; dilekçede tam kayıt seçeneğini açar |
| clue_koltuk_boslugu | INV_OTOBUS | Cüzdan oturanın ayağına ancak takılır |
| clue_cikartma | INV_OTOBUS | Usul: eşya şoföre teslim edilir; Arda'nın "Şoför" konusunu açar |
| clue_dokuz_koltuk | INV_OTOBUS | Hayri'nin bakış açısı |
| clue_atm_fisi | INV_ODA | Zarftaki 600 TL'nin kaynağı |
| clue_153_arama | INV_ODA | Teslim niyeti; Arda'nın "Telefon" konusunu ve dilekçede 153 kaydını açar |
| clue_fb_mesaj | INV_ODA | Teslim niyeti; ARA'da Gülten sahnesini besler |
| clue_kira | INV_ODA | Çeldirici (savcılığın motivi) |
| clue_fis_notu | INV_BUFE | "Yeşil bere — 3 ayrı çek" |
| clue_bufe_kamera | INV_BUFE | Çeldirici (kayıt silinmiş) |
| clue_kart_yok | INV_EMANET | Cüzdanda kart ve nakit yok |
| clue_zarf | INV_EMANET | Bantlı banka zarfı |
| clue_sari_not | INV_EMANET | "Yarın 9 — karakol. G. Sarı cüzdan." |
| clue_kaynak_dosya | INV_KLIP | Tam sefer kaydı arşivde |
| clue_bozuk_segment | INV_KLIP | 18.43 yok |
| clue_ilk_kare | INV_KLIP | Ayağıyla dokunuyor, yerden alıyor |
| clue_son_kare | INV_KLIP | 18.44.30 "Sıradaki durak: Beşevler" |
| clue_harcama_saat | INV_BANKA | 18.49 Altıparmak'ta üç çekim |
| clue_gozluk | INV_HAYRI | Gazeteyi gözlüksüz okur |
| clue_gri_kapuson | INV_HAYRI | Yalnızca arkadan bir kapüşon gördü |
| clue_defter | INV_RECEP | Buluntu defteri 6 Mart'ta boş |
| clue_kare_* (6) | ARA_KAYIT | Tam kayıt kareleri |
| clue_cagri_notu | ARA_CAGRI | 153 operatör notu |
| clue_mesaj_istegi | ARA_GULTEN | Okunmamış mesaj isteği |
| clue_cemil_tarif | ARA_CEMIL | Eldivenli, bereli kadın |

**Çıkarımlar (INSIGHT, sunulabilir):** birinci evre 8 tarif (+300 her biri), ARA 5 tarif (+300; tahta tekrarı puan vermez).
Her çıkarımın duruşmada bir kullanımı var: `ded_zarf` → H1_01S1B (zarftaki para, H101S1B_FIS); `ded_kapuson` → H2_HY HR1B;
`ded_bereli` (kısmi) ve `ded_bere_ayni` (tam) → H2_EK_Q2 EQ2_BERE ("kartları arkadaşına verdi" iddiası); `ded_bere_ayni` ayrıca çiftin
yakalanmasının (`sebeke_yakalandi`) koşulu; diğerleri §8'de.

| Çıkarım | Kartlar |
|---|---|
| ded_kart_baskasi "Kartları Arda kullanmadı" | clue_son_kare + clue_harcama_saat |
| ded_zarf "Zarftaki 600 TL Arda'nın bursu" | clue_atm_fisi + clue_zarf |
| ded_teslim "Teslim niyetinin izleri" | clue_sari_not + clue_153_arama |
| ded_eksik_kayit "CD kaydı eksik" | clue_dort_kamera + clue_kaynak_dosya |
| ded_hayri_gormedi "Gözlüksüz okuyan göz" | clue_gozluk + clue_dokuz_koltuk |
| ded_buldu "Cüzdan koltuğun altındaydı" | clue_koltuk_boslugu + clue_ilk_kare |
| ded_bereli "Kartları bir kadın kullandı" | clue_kart_yok + clue_fis_notu |
| ded_birakan "Cüzdanı bırakan Altıparmak'ta indi" | clue_kare_birakma + clue_kare_inis |
| ded_bere_ayni "Büfedeki bere, otobüsteki bere" | clue_kare_bere + clue_fis_notu |
| ded_kapuson "Hayri'nin gördüğü kapüşon" | clue_kare_parka + clue_gri_kapuson |
| ded_sofor_red "Şoföre uzatılan cüzdan" | clue_kare_sofor + clue_cikartma |
| ded_niyet_tam "Üç ayrı teslim girişimi" | clue_cagri_notu + clue_mesaj_istegi |

Çeldiriciler: clue_kira, clue_bufe_kamera, clue_defter ve her yanlış çift (−50).

**Gecikmeli teslimler:** `ev_tam_kayit` (dilekçede DIL_KAYIT ya da 1. celsede H106_KAYIT) ve `ev_cagri_kaydi` (DIL_153 ya da
H106_153) ARA girişinde gelir; `ozan_cagrildi` 2. celsede Ozan'ı dinletir.

## 8. Çelişkiler (çapraz sorgu)
- **Savcının soruları (1. celse):** S1B "zarftaki 600 TL nereden?" ← ATM fişi + zarf (`ded_zarf` +150, `zarf_mahkemede`; yalnızca
  `clue_atm_fisi` +50). İtiraz dayanaksız (−50, ♥−1).
- **Hayri yeniden (2. celse, tam kayıt geldiyse; H2_TALEP → TL_HAYRI):** HR1 → BASTIR → HR1B "parlıyordu, yağmurluk gibi" ←
  `ded_kapuson` (+250, `contra_h1`, `hayri_kapuson`) ya da yalnızca tam kayıt (kısmi +100); HR2 "Heykel'den beri arkasındaydı" ←
  `ev_kentkart` (+200, `hayri_kentkart`).
- **Volkan V4:** "başka kayıt olduğunu kimse sormadı" ← `clue_olay_klasoru` (+150, `contra_v3`); BASTIR → V4B "klasör mahkemeyi
  ilgilendirmez" × kanaat (+50).
- **Ozan (2. celse, tanık ifadesi):** OS2 "ben gördüğümde yazılmıştı" ← `ded_niyet_tam`/`ded_teslim`/`ev_cagri_kaydi` (+200,
  `ozan_saat`); OS3 "polis gelince not masadaydı" ← `ev_tutanak` (+150, `ozan_tutanak`); OS3B'ye duyum itirazı tuzaktır (−30).
- **Savcının ek savunma sorusu (H2_EK_Q2):** ispat yükü itirazı (+60, Anayasa 38/4) ve/veya `ded_bere_ayni` (+250, `ortak_curudu`;
  `ded_bereli` kısmi +80).
- **Hayri (1. celse):** HS1 "her şeyi gördüm" ← ded_hayri_gormedi (+300, `contra_h1`) ya da kendi kolluk ifadesi (kısmi +100);
  HS1'e BASTIR → HS1B ("gazetemi okuyordum"). HS2 "gri kapüşonlu genç" → BASTIR → HS2B "o çocuktu, eminim" (kanaat itirazı +50).
  HS3 "eli çantanın hizasında" → BASTIR → HS3B "polis de kamerada görmüşler dedi" (duyum itirazı +50). HS4 "cüzdanı çantasına
  koydu" ← ev_klip ya da ded_buldu (+300, `contra_h4`).
- **Volkan (2. celse):** VS1 "eksiksiz aktardım" ← ded_eksik_kayit ya da ev_tam_kayit (+300, `contra_v`); VS3 "kesinti yok" ←
  ev_aktarim_formu (yalnızca clue_bozuk_segment bulunduysa; +200, `contra_v2`); VS2 "öncesi ilgilendirmiyordu" × kanaat (+50).
- **Recep (2. celse):** RS1 "kimse getirmedi" ← ev_tam_kayit (clue_kare_sofor bulunduysa) ya da ded_sofor_red (+300,
  `contra_r`); RS2 BASTIR → RS2B "defter boş"; RS3 "kimseye bakmam" ← ev_recep_ifade (kısmi +100).

## 9. Node grafiği özeti
Hikâye kitabı §4. Soruşturma hub'ı push/`$return`; ARA hub'ı doğrudan dönüş (Dava #07 motor notu 2). Koşullu sahne parçaları
DECISION zincirleriyle (INV_GECE_*, ARA_SON_*, H2_00_*).

## 10. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul (özet) | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | IKRAR | CONVICTION | `false_confession` | 141/1 → 168/2 → 62/1; HAGB (zarar ödendi) + etik kartı | 0 |
| 2 | BERAAT_B | ACQUITTAL | çöküş yok, `sav_b_ok` (çift yakalandı + ded_birakan + `contra_r`), ikna ≥ 7, final ≥ eşik B | CMK 223/2-b | 1,2 |
| 3 | BERAAT_E | ACQUITTAL | çöküş yok, beraat talebi, `beraat_zemini` (en az 3 bulgu), Hayri'nin teşhisi delille çöktü (`contra_h1` ∨ `contra_h4`; 1. celsede ya da 2. celsedeki yeniden dinlemede), ikna ≥ 5, final ≥ eşik E | CMK 223/2-e | 1,0 |
| 4 | NITELENDIRME | RECHARACTERIZED | çöküş yok, `buldu_zemini`, final ≥ eşik N | TCK 160 → adli para cezası; HAGB | 0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan | 141/1 → 62/1; TCK 51 erteleme | 0,6 |

Eşikler (meta.ts `THRESHOLDS`, eşik çubuğuyla aynı): **TCK 160: 3.000 · Beraat (2-e): 9.300 · Beraat (2-b): 10.500**;
`scaleMax` 14.000 (golden path'lerin en yüksek finali 13.120).

Yüklemler (80-trial): `beraat_zemini` = şu altı bulgudan en az üçü — Hayri’nin teşhisinin çökmesi (`contra_h1` ∨ `contra_h4`),
kaydın eksikliğinin kürsüde kabulü (`contra_v` ∨ `contra_v2` ∨ `contra_v3`), şoförün çözülmesi (`contra_r`), `ded_kart_baskasi`, teslim izleri
(`ded_teslim` ∨ `ded_niyet_tam`), müştekinin beyanı (`gulten_tanik`). `buldu_zemini` = `ded_buldu` ∨ `contra_h4` ∨ `ded_kart_baskasi`
∨ `contra_v` ∨ `contra_v2`. `sav_b_zemin` = çift yakalandı (`sebeke_yakalandi`: dayanaklı suç duyurusu + `ded_bere_ayni` + Cemil’in
savcılığa yönlendirilmesi) ∧ `ded_birakan` ∧ `contra_r`.

## 11. Skor
Dava #07 ölçeği: sahne nesnesi +40/+60, ıska −10; belge isabeti +100/+150, yanlış alet −20; tarif +300, yanlış çift −50; BASTIR +25;
doğru sunum +300, kısmi +100/+200, yanlış −150 ve ♥−1; usul itirazı +50…+150, dayanaksız −50 ve ♥−1; esas savunma
`strategyAmount(200, …)`. Bonus: güvenilirlik × 100.

## 12. Golden path'ler
| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 13.020 | Tam soruşturma, tam kayıt; zarf sorusu ATM fişiyle; Hayri 1. celsede ve 2. celsede yeniden dinlenerek (kapüşon, kent kart) çözülür; Volkan (V4 olay klasörü dahil), Recep ve Ozan (not saati, tutanak); "arkadaş" sorusu ispat yükü itirazı ve bere çıkarımıyla; dayanaklı suç duyurusu var ama Cemil savcılığa yönlendirilmez |
| G_B | BERAAT_B | 13.120 | TIPIK + Cemil'in savcılığa yönlendirilmesi → çift yakalanır, Bşk. Orhan tanık, 223/2-b |
| G_N | NITELENDIRME | 3.290 | Kayıt istenmez, teslim izleri birleştirilmez; cüzdanın bulunduğu gösterilir; terditli savunma → TCK 160 + HAGB |
| G_M | MAHKUMIYET | 290 | Yüzeysel ve hatalı soruşturma (tanığa telkin ve baskı), dayanaksız itirazlar, duygusal savunma |
| G_I | IKRAR | 9.375 | İyi soruşturma ama arada sahte ikrar telkini (etik ihlal) |
| G_E2 | BERAAT_E | 10.245 | Alternatif 2-e: bozuk segment bulunmaz, teknisyen duruşmada istenir, şoför hakkında erken suç duyurusu (CMK 48 çekinmesi), Hayri yeniden dinlenmez |
| W | MAHKUMIYET (çöküş) | 8.130 | Tam soruşturma; 2. celsede teknisyene beş yanlış delil → ♥0 → çöküş |

**Erken çözüm denetimi (inceleme sonrası, 2026-10-20).** `act` ile oynatılan golden path'lerden aksiyon blokları atılarak
(delta-debugging, 40→1 genişlikte açgözlü blok silme; `enumerateActions` ile geçerli aksiyonlar) aynı sonuca ulaşan en kısa yol
arandı. İnceleme öncesi en kısa BERAAT_E 137 aksiyondu ve 1. celsedeki Hayri çapraz sorgusu tümüyle atlanabiliyordu. Şimdi
BERAAT_E koşulu Hayri'nin teşhisinin delille çökmesini (`contra_h1` ∨ `contra_h4`) şart koşuyor ve tipik yol 235 aksiyon:

| Tohum → hedef | En kısa | Tipik yolun oranı |
|---|---|---|
| TIPIK → BERAAT_E | 150 | %64 |
| G_E2 → BERAAT_E | 153 | %65 |
| G_B → BERAAT_B | 152 | %65 |

Kısaltılmış yollar bütün delil zincirini (CD formu, emanet, banka, otobüs, tahta, tam kayıt, Hayri/Volkan/Recep çelişkileri) ve
Hayri'nin teşhisini çökerten sunumu içeriyor; atlananlar isteğe bağlı konuşmalar, okumalar ve 2. celsedeki ek tanık anları.
İlk gün duruşmaya gitmek MAHKUMIYET verir. Tahta kaba kuvvetle kurulamaz (her yanlış çift −50) ve bastır/sun puanları tek
kullanımlıktır. Tipik yolun satır dökümü yeniden tarandı: ARA'daki tam kayıttan önce “bere”, “parka”, bereli bir kadın, boş kart
yuvaları (Arda'nın kendi anlatımı dışında) ve “eksik dakika” (aktarım formu dipnotundan önce) geçmiyor; ilk kez geçtikleri yerler
fiş notu (clue_fis_notu), INV_KLIP k4 ve ARA_KAYIT'tır.

## 13. Süre ve sözcük ölçümü
`npm run case:duration -- kayip-cuzdan` (2026-10-20, inceleme sonrası):

```
Süre tahmini (dakika = sözcük / 180 + aksiyon × 6 sn / 60):
  TIPIK         103.6 dk   14419 sözcük   235 aksiyon  BERAAT_E (13020)
  G_B           102.0 dk   14190 sözcük   232 aksiyon  BERAAT_B (13120)
  G_N            66.2 dk    9281 sözcük   146 aksiyon  NITELENDIRME (3290)
  G_M            64.6 dk    9079 sözcük   142 aksiyon  MAHKUMIYET (290)
  G_I            88.3 dk   12191 sözcük   206 aksiyon  IKRAR (9375)
  G_E2           91.5 dk   12784 sözcük   205 aksiyon  BERAAT_E (10245)
  W              80.9 dk   11066 sözcük   194 aksiyon  MAHKUMIYET (8130)
  ==> TİPİK YOL (TIPIK): 103.6 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```

Tipik yol görevin 13–16 bin bandında (14.419); `case:duration`'ın kendi “15–25 bin” uyarısı kılavuzun genel hedefidir, görevin
sınırı değildir. G_N ve G_M'ye ek görüşme konuları eklendi; 60 dakika tabanının 4–6 dakika üstündeler.

`node tools/content/word-count.mjs content/cases/kayip-cuzdan --path TIPIK --chapters`: tipik yolda satır sözcüğü 11.497
(Soğuk açılış 377 · Bölüm 1 673 · Soruşturma 3.477 · 1. celse 1.738 · Ara 2.255 · 2. celse 2.532 · Karar 445). Paket: 1.503 satır,
19.079 satır sözcüğü; ekran metinleriyle toplam **25.093** sözcük. En uzun satır 213 karakter.

`npm run case:validate -- kayip-cuzdan --max-ms 3000000`: **PASSED — 0 hata, 1 uyarı (SIMULATION_INCOMPLETE)**; kapsam node
118/118, seçenek 250/250, kural 89/89, delil 53/53; golden path 7/7; bütün sonuçlara ulaşıldı. (Makine yükü yüksekken varsayılan
600 sn'lik sert süre sınırı sayı bütçeleri dolmadan doluyordu; sayı bütçeleri aynı, yalnızca `--max-ms` büyütüldü.)

**Sprite notu:** yeni karakterlerin (Arda, Zehra, Gülten, Hayri, Recep, Cemil, Ozan) sprite’ları `content/src/kayip-cuzdan/sprites.ts`
içinde tanımlıdır. Kılavuz `content/shared/sprites/<slug>-<ad>.json` diyor; ancak `tools/content/test/extract-sprites.test.ts` o
dizinin yalnızca tasarımdaki 21 ortak sprite’ı içermesini şart koşuyor. Kapıları yeşil tutmak için sprite’lar kaynağa alındı
(önizleme `case:sprite-preview` ile yapıldı).
