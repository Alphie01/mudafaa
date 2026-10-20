# Dava #07 "Gece Bekçisinin Sırrı" — v2 yeniden yazım raporu

> Tarih: 2026-10-20 · Kaynak: `docs/content/gece-bekcisinin-sirri-hikaye.md` (hikâye kitabı), koordinatör güncellemeleri
> (sonuca bağlı epilog, sözcük/süre bütçesi, "oyun süresinin yarısı oynanış" ve ≥200 aksiyon). Hukuki gerçek, deliller ve
> sonuç mantığı korunmuştur; eşikler yeniden ölçeklenmiştir (§5).

## 1. Özet

| Ölçü | v1 | v2 |
|---|---|---|
| Node | 34 | 111 (DECISION sahne parçaları dahil; hepsi simülasyonda kapsandı) |
| Oyuncu seçeneği / kural | 107 / 25 | 222 / 70 |
| Delil + ipucu + çıkarım | 24 | 49 |
| Satır (paket) | 107 | 1.654 |
| Satır sözcüğü (paket) | 933 | **20.182** (ekran metinleriyle toplam 23.998) |
| Tipik yol (TIPIK = G2, BERAAT_E) satır sözcüğü | ~450 | **11.787** |
| Tipik yol, `case:duration` sözcüğü (satır + etiket + geri bildirim + ifade + belge + hüküm + epilog) | — | **13.841** |
| Tipik yol aksiyonu | 56 | **204** |
| Tipik yol süresi (`case:duration`) | ~10 dk | **97,3 dk** |
| En uzun satır | 214 kr | 214 kr (≤ 220) |

## 2. Yapı

```
PR_00 Soğuk açılış (23.04, isimsiz sesler) → PR_01 Sabah 08.05 (avlu, tutanak, karakol)
BR_00 Saniye büroda (zarf: söz / tarife / dürüstlük) → BR_01 Leyla, ceza aralığı → BR_01B Altı kâğıt → BR_02 Dosya + strateji
INV_SABAH Depo sokağı sabahı → INV_HUB (4 gün × 4 EP; Leyla'ya danış günde 1, 0 EP)
  Olay yeri: INV_ARAMA (sokak) · INV_ARAMA2 (Depo 3 içi) · INV_ARAMA3 (çay ocağı) · INV_ARAMA4 (kulübe)
  Cezaevi: INV_GORUSME (zincir giriş INV_GORUSME_G_*; konu 2 dk; fakta bağlı konular)
  Tanıklar: INV_T_HUS (sorular) · INV_T_SEL (DVR sorusu) · INV_T_MUR (sorular; gözdağını tetikler)
  Arşiv: INV_INCELEME · INV_DVR · INV_RULO · INV_ARIZA · INV_BEL · INV_HTS(+_SELIN) · INV_DIL · INV_CIKARIM (7 tarif)
  Gün sonu: INV_DAY_END (DECISION, teslimler) → INV_AKSAM1 (seçim) / INV_AKSAM2 (tehdit ya da Saniye; seçim) / INV_AKSAM3 (Kerem'in telefonu)
INV_GECE_* Duruşmadan önceki gece (koşullu hafıza zinciri) → INV_GECE (kapı altındaki not: bildir / sakla)
C_00G_* + C_00K koridor (Saniye'ye söz) → C_00 (iddianame) → C_01 → C_02 → C_02Q (sanığa sorular) / C_02D → C_03 → C_04 → C_05
C_06 Selin (S1–S5 + S4_EK; bastır/sun/itiraz) ⇄ C_06H (kırılma) → C_06R kısa ara → C_ARA erteleme + tutukluluk
ARA_GIRIS_* → ARA_GIRIS → ARA_HUB (3 gün × 3 EP; yığınsız, doğrudan dönüş)
  ARA_SELIN · ARA_YUSUF · ARA_HUS · ARA_KEREM_* + ARA_KEREM · ARA_SANIYE · ARA_EKIP · ARA_KART (belge) · ARA_LIMAN(+_GECE) · ARA_CIKARIM · ARA_LEYLA
  ARA_DAY_END → ARA_AKSAM_* + ARA_AKSAM / ARA_AKSAM2
ARA_SON_* → ARA_SON → C_07A/B (raporlar) → C_07 Hüseyin (+ sorular) → C_07X savcının karşı sorusu  |  C_07Y boş kürsü
C_08T Kom. Yusuf'un tanıklığı (Y1–Y5) → C_08 anahtar → C_09 iz → C_10 kolluk ifadesi → C_11G raporlar → C_11 mütalaa
C_12P dayanaklar (3 seçim) → C_12 esas savunma (3–5 satırlık konuşma) → C_13 son söz → C_14 hüküm → R_KARAR + epilog
C_INT_COKUS (♥0) → C_14
```

Celseler: `cs_2` (2. celse: açılış, ek savunma, tanık) ve `cs_3` (3. celse: tanık, delil tartışması, mütalaa, savunma, son söz,
karar).

## 3. Yeni node'lar
- **Hikâye:** PR_00, PR_01, BR_00, BR_01B, INV_SABAH, INV_AKSAM1, INV_AKSAM2(+_1), INV_AKSAM3(+_1), INV_GECE(+_1…_6, _5B,
  _M_1…_6), INV_LEYLA, C_00K, C_00G_1…_4, C_06R, ARA_GIRIS(+_1, _2), ARA_AKSAM(+_1…_3), ARA_AKSAM2, ARA_SON(+_1…_4),
  ARA_LIMAN_GECE, ARA_LEYLA.
- **Oynanış:** INV_ARAMA2/3/4 (sahne), INV_DVR/RULO/ARIZA (belge), ARA_KART (belge), ARA_CIKARIM (tahta), ARA_HUB (hub),
  ARA_SELIN/YUSUF/HUS/KEREM/SANIYE/EKIP (konuşma), ARA_LIMAN (seçim), C_02Q (sanığa sorular), C_07X (itiraz),
  C_08T (tanık ifadesi), C_12P (dayanaklar), C_ARA (aşama), C_07A/B, C_07Y, C_11G_1, INV_GORUSME_G_1/2, ARA_KEREM_1…3,
  ARA_DAY_END.
- **Korunan kimlikler:** v1'in bütün node ve seçenek kimlikleri korundu (BR_01, BR_02, INV_*, C_00…C_14, C_INT_COKUS, R_KARAR);
  INV_DAY_END artık bir DECISION'dır (teslimler aynı node'dan yapılır). C07_YOK, C_07Y'ye taşındı.
- **Yeni sahneler:** `tools/content/scenes/{depo3-ic,cay-ocagi,kulube}.html` → `assets/scenes/*@4x.png`
  (`npm run render-scenes -w @mudafaa/content-tools`).

## 4. Sözcük sayıları
`node tools/content/word-count.mjs --chapters` (satırlar; aynı satır yol içinde bir kez) ve `npm run case:duration --
gece-bekcisinin-sirri` (satır + ekran metinleri; `tools/content/src/lib/duration.ts` artık karar ekranındaki epilog satırlarını da
sayar).

| Yol | Satır sözcüğü | `case:duration` sözcüğü | Aksiyon | Süre | Sonuç (final) |
|---|---|---|---|---|---|
| G1 | 10.605 | 12.480 | 145 | 83,8 dk | BERAAT_B (9.620) |
| **G2 = TIPIK** | **11.787** | **13.841** | **204** | **97,3 dk** | BERAAT_E (8.845) |
| G3 | 8.488 | 10.046 | 119 | 67,7 dk | İNDİRİM (3.340) |
| G4 | 7.560 | 8.773 | 118 | 60,5 dk | MAHKÛMİYET (−125) |
| G5 | 9.039 | 10.588 | 121 | 70,9 dk | İKRAR (4.670) |
| W | 7.955 | 9.050 | 104 | 60,7 dk | MAHKÛMİYET/çöküş (−445) |

Tipik yolda bölüm başına satır sözcüğü: Soğuk açılış 762 · Bölüm 1 898 · Soruşturma 4.082 · Birinci celse 1.759 · Ara 2.275 ·
İkinci celse 1.618 · Karar (hüküm + epilog) 393.

Paket toplamı: 1.654 satır, **20.182** satır sözcüğü; etiket, geri bildirim, ifade, hüküm ve gerekçe metinleriyle 23.998.

Not: Görev tanımındaki "tipik yolda ≥14.000 satır sözcüğü" hedefi, koordinatörün sonraki güncellemesiyle (180 sözcük/dk +
aksiyon başına 6 sn, 90–120 dk tavanı; tipik yolda 13–16 bin sözcük, ≥200 aksiyon) yerini aldı. Tipik yol `case:duration`
ölçüsüyle 13.841 sözcük ve 204 aksiyonla 97,3 dakikadır; yalnızca satırlar 11.787 sözcüktür.

## 5. Sonuç ve skor değişiklikleri
- **Eşikler** (docs/content/dava-07.md A.6 notu ve Ek B.3): İNDİRİM 2.000 → 3.000; BERAAT_E 3.200 → 7.000 (mazeret + çöken
  teşhis yolunda 2.600 → 5.500); BERAAT_B 3.600 → 8.000; eşik çubuğu 0 / 3.000 / 7.000; `scaleMax` 5.000 → 10.000. Koşulların
  geri kalanı aynı.
- **Epiloglar:** her sonuçta `epilogue` (koşulu tutan bütün bloklar sırayla): BERAAT_B (yağmur dinmiş, Selin'in teşekkürü,
  Leyla'nın düz çerçevesi, Murat'ın soruşturması), BERAAT_E ("şüpheden yararlandı" fısıltısı, fişin deftere yapıştırılması),
  İNDİRİM (ring aracının camı), MAHKÛMİYET (poşetteki fiş; çöküşte savcının cümlesi), İKRAR (meslek kuralları kitapçığı).
  Koridorda "bu akşam eve gelir" sözü verildiyse olumsuz sonuçlarda ayrıca hatırlanır.
- **Hükümler:** mahkûmiyet hükümlerinde tutukluluk ifadesi, 2. celsede tahliye olasılığını kapsar (hukuki not v2 #2).
- **Yeni bayraklar:** saniye_mektup, deniz_durust, aksam1, aksam2, baski_gunu, tehdit_bildirildi, kerem_released, ara_day,
  ara_ap, selin_hint_liman, murat_caught, yusuf_ipucu, huseyin_korunuyor, kerem_hazir, koridor, leyla_gun, leyla_ara,
  fact_ziya, fact_isik, fact_selin_murat, fact_cay_selin, fact_selin_dvr, fact_anne, fact_defter, contra_s5, contra_y1…y5,
  press_y1, press_y5; kaynak sayaçları taps2/3/4, dvr_left, rulo_left, ariza_left, kart_left, noktalar.
- **Küçük, adil puanlar:** yeni mekaniklerin tutarları Ek B.2 tablosunda. Yanlış seçimler bir şey götürür: ıska ve dikkat
  dağıtıcı nesne −10, yanlış alet −20, yanlış tahta çifti −50, yanlış sunum ♥−1 ve −150, dayanaksız itiraz ♥−1, ispatlanmamış
  dayanak −40, etik sınır ihlalleri −25…−50.
- **Etik sınırlar:** tanığa baskı (TCK 277) v1'deki gibi; aradaki Selin sahnesinde avukat yönlendirmez, ifade almaz, yalnızca
  avukatı ve savcılığı gösterir; kaçan şüpheli için savcılığa haber verilir, kovalanmaz; belediye ekip şefine isim önermek
  telkin sayılır.
- **Okunmayan bayrak uyarıları temizlendi:** v1'den kalan fact_murat_cagirdi, hint_selin_offduty, fact_borc (ara Kerem
  sahnesi), fact_sigara_yok, fact_kerem_39, illegal_hts (duruşmadan önceki gece), press_s2 (S2 sunumu), press_s3b (kısa ara)
  artık okunuyor; ev_anahtar ve ev_parmak_izi_raporu için açık bir ceza kuralı (PS_SAVCILIK), ev_fis için kısmi bir S4 kuralı var.

## 6. Golden path sonuçları
Bütün yollar beklenen sonuca ve ±%5 final penceresine ulaşır (7/7): G1 BERAAT_B 9.620 (XP 1.154) · G2/TIPIK BERAAT_E 8.845
(XP 884) · G3 İNDİRİM 3.340 (XP 283) · G4 MAHKÛMİYET −125 · G5 İKRAR 4.670 (XP 0, etik kartı) · W çöküş −445 (3. celsede,
Kom. Yusuf'a hukuka aykırı döküm sunulunca). `docs/plan.md` A.7'ye işlendi.

## 7. Doğrulayıcı
`npm run validate:cases`: **PASSED — 0 hata, 1 uyarı (SIMULATION_INCOMPLETE, uzun davada beklenen), 1 bilgi
(LEGAL_REVIEW_PENDING)**. Simülasyon ~64.700 durum, ~478.000 geçiş, 400 yürüyüş; bütün sonuçlara ulaşıldı; kapsam node
111/111, seçenek 222/222, kural 70/70, delil 49/49; golden path 7/7; softlock, çıkmaz, sızıntı, skor döngüsü yok. Süre ~1 dk 50 sn.
`tools/content/test/dava07-golden.test.ts` (maxStates 8.000, walks 200) da tam kapsamla geçer (~60 sn).

## 8. Motor sınırları ve içerikteki çözümler
1. **Node satırlarında yalnızca ilk tutan blok gösterilir.** Birden çok koşullu parçayı birleştirmek için DECISION
   "sahne parçası" zincirleri kullanıldı (ör. INV_GECE_1…6, C_00G_1…4, ARA_SON_1…4): her DECISION kendi koşullu satırını
   akıtır ve bir sonrakine yönlendirir (aksiyon başına ≤16 geçiş sınırının altında).
2. **Kaçış aramasının statik uzaklığı:** `$return` ile biten her node, bütün "push" eden hub'lara bağlanır. Ara hub'ı da push
   kullanınca soruşturma alt ekranları sona "yakın" görünüyor ve kaçış araması bütçeyi tüketiyordu (SOFTLOCK_UNVERIFIED).
   Ara evresindeki bütün etkinlikler yığın yerine doğrudan `ARA_HUB`'a döner; soruşturma hub'ı push/`$return` kullanmaya devam eder.
3. **Kurallar varsayılan olarak bir kez çalışır** (`repeat` kurallara uygulanmaz); tekrarlanabilir ceza kuralı için
   `maxUses` kullanıldı (PS_SAVCILIK).
4. **Ara tahtası tekrar ödülü:** aynı tarif iki evrede de kurulabilsin diye ara tahtasındaki kurallar `IF ¬hasEvidence(ded)` ile
   yalnızca ilk kurulumda puan verir.
5. **Hüküm metni tek parça:** tahliye edilmiş sanığın mahkûmiyetinde tutukluluk ifadesi koşullu yazılamadığı için iki durumu
   kapsayan bir ifade seçildi (hukuki inceleme sorusu).
6. **Doğrulayıcı epilog koşullarını okumuyor:** epilogda okunan `koridor` bayrağı ayrıca C_14'te okunarak UNREAD uyarısı
   giderildi.
7. **Sözcük ölçümü:** `case:duration` epilogu saymıyordu; `tools/content/src/lib/duration.ts` RESULT görünümündeki epilog
   satırlarını da sayacak şekilde düzeltildi.

## 9. Araçlar
- `tools/content/word-count.mjs`: golden path'leri motorla (`packages/engine` dist: `compile`, `start`, `act`, `view`) oynatır;
  `view.lines` + `view.last.lines` + karar ekranındaki epilog satırlarını (aynı satır bir kez) sayar; bölüm dökümü (`--chapters`),
  tek yol (`--path AD`) ve paket toplamı (satır ve ekran metni ayrı).
- İçerik, oturum boyunca bir üreteçle (satır DSL'i + yamalar) yazıldı; teslim edilen kaynak `content/cases/gece-bekcisinin-sirri/`
  altındaki Prettier biçimli JSON parçalarıdır (00, 10, 20, 30, 40, 50, 60, **65-ara**, **68-trial-2**, 70, 80, 90).

## 10. Açık noktalar
- Hukuki inceleme bekliyor (`docs/legal/dava-07.md`, v2 bölümü 12 madde).
- Mobil istemcinin yeni arka planları (`liman_gece`, `ev` …), `style`/`fx` alanlarını ve epilog görünümünü çizmesi gerekir
  (istemci bu görevde değiştirilmedi).
- Tipik yol yalnızca satırlarla 11.787 sözcük; `case:duration` ölçüsüyle 13.841 (15–25 bin "kılavuz" bandının altında uyarı,
  kapı geçer). Daha uzun okuma süreyi 120 dakikaya yaklaştırır.
