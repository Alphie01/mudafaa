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
Hikâye kitabı §5 PROLOG: 18.42 otobüste gri kapüşonlu genç cüzdanı bulur (isimsiz); 18.49 Altıparmak'ta isimsiz bir ses kartı üç
ayrı çektirir; 08.15 polis öğrenci evinin kapısındadır. Kartları kimin kullandığı söylenmez; "suç ortağı" okumasına da açıktır.

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
| 3 | INV_SABAH, INV_HUB, INV_* | Soruşturma | Arda'nın hikâyesi; kayıt eksik; kartlar başkasında | 3 sahne, 3 belge, görüşme, 3 konuşma, dilekçe, tahta, mentor | 33 | 4 600 |
| 4 | INV_GECE_* | Soruşturma | Pano; Arda'nın mesajı | — | 2 | 350 |
| 5 | H1_00–H1_08 | 1. celse | Sorgu, müşteki, Hayri'nin çapraz sorgusu, CD, nitelendirme uyarısı | A–D ×5, tanık ifadesi | 17 | 2 400 |
| 6 | ARA_* | Ara | Tam kayıt: ters köşe; Gülten'in mesajı; büfe | 2 belge, 3 konuşma, suç duyurusu, tahta | 22 | 2 700 |
| 7 | H2_00–H2_09 | 2. celse | Teknisyen ve şoför çöker; ek savunma; mütalaa | tanık ifadesi ×2, A–D ×5 | 18 | 2 600 |
| 8 | R_KARAR | Karar | Hüküm + epilog | — | 3 | 500 |

## 6. Ters köşeler ve epiloglar
Bkz. hikâye kitabı §5 (epiloglar) ve §6 (ekilen ipuçları).

## 7. Delil zinciri
**Dosyadaki deliller (başlangıçta bilinir):** `ev_klip` (CD kaydı, savcılık), `ev_aktarim_formu` (CD aktarım formu), `ev_tutanak`
(el koyma tutanağı), `ev_banka` (kart hareketleri), `ev_hayri_ifade`, `ev_recep_ifade`, `ev_gulten_ifade`, `ev_kentkart`.

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

**Çıkarımlar (INSIGHT, sunulabilir):** birinci evre 7 tarif (+300 her biri), ARA 5 tarif (+300; tahta tekrarı puan vermez).

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
| 3 | BERAAT_E | ACQUITTAL | çöküş yok, beraat talebi, `beraat_zemini` (en az 3 bulgu), ikna ≥ 5, final ≥ eşik E | CMK 223/2-e | 1,0 |
| 4 | NITELENDIRME | RECHARACTERIZED | çöküş yok, `buldu_zemini`, final ≥ eşik N | TCK 160 → adli para cezası; HAGB | 0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan | 141/1 → 62/1; TCK 51 erteleme | 0,6 |

Eşikler §13 ölçümünden sonra yazılır; eşik çubuğu = sonuç eşikleri.

## 11. Skor
Dava #07 ölçeği: sahne nesnesi +40/+60, ıska −10; belge isabeti +100/+150, yanlış alet −20; tarif +300, yanlış çift −50; BASTIR +25;
doğru sunum +300, kısmi +100/+200, yanlış −150 ve ♥−1; usul itirazı +50…+150, dayanaksız −50 ve ♥−1; esas savunma
`strategyAmount(200, …)`. Bonus: güvenilirlik × 100.

## 12. Golden path'ler
| Ad | Sonuç | Özet |
|---|---|---|
| TIPIK | BERAAT_E | Tam soruşturma, tam kayıt; Volkan ve Recep çöker; suç duyurusu yok |
| G_B | BERAAT_B | TIPIK + dayanaklı suç duyurusu + Cemil + Bşk. Orhan |
| G_N | NITELENDIRME | Kayıt istenmez; teslim izleri eksik; terditli savunma |
| G_M | MAHKUMIYET | Yüzeysel soruşturma, yanlış hamleler |
| G_I | IKRAR | Ek savunmada sahte ikrar |
| W | MAHKUMIYET (çöküş) | Yanlış sunumlarla ♥0 |

## 13. Süre ve sözcük ölçümü
Teslimde `npm run case:duration -- kayip-cuzdan` çıktısı buraya yapıştırılır.
