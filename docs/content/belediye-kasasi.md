# Dava #11 "Belediye Kasası" — Dava Tasarımı

> Kaynak: `content/src/belediye-kasasi/` (yazım kiti) → `content/cases/belediye-kasasi/` (`npm run case:build -- belediye-kasasi`).
> Hikâye kitabı: `docs/content/belediye-kasasi-hikaye.md`. Hukuki notlar: `docs/legal/belediye-kasasi.md`.
> Lineup: #11 · Zimmet (TCK 247/1-2) · KIDEMLI · zorluk 4/5.

## 1. Logline ve tema
- On dokuz yıllık veznedar Orhan Kılıç, kendi kullanıcı adıyla yapılmış 47 makbuz iptali ve 386.400 TL açık yüzünden zimmetle
  yargılanıyor. Şifresini amirinin talimatıyla zarfa koyup verdiğini söylemeye utanıyor. Gerçek fail, şifre zarflarını toplayan,
  akşamları kasayı teslim alan müdür yardımcısı Ercan Tunalı'dır.
- Tema: *Bir şifre bir insan mıdır?* Ve: masum bir müvekkile "öde, kabul et" demek ne zaman yardım, ne zaman ihanettir (TCK 248'in etik sınırı)?
- Ton: noir dram; Bursa, kasım–ocak, lodos ve yağmur.

## 2. Gerçek ve kronoloji
Hikâye kitabı §3'teki tablo bağlayıcıdır. Özet: Eylül 2025'te şifreler zarfta toplanır; 3.11.2025–27.02.2026 arasında 23 günde 47 iptal,
hepsi 17.38–17.56 arasında, hepsi ön odadaki MHM-PC03'ten. Orhan her akşam 17.02–17.09'da çıkar; kasa her iptal akşamı 17.52–17.58'de
02 koduyla (müdür yardımcılığı) açılır; Ercan 18.15–18.40'ta çıkar. 9 Ocak Orhan izinli; 14 Ocak 17.20'de sıfırlama talebini Ercan açar.

## 3. Yapı ve node haritası

```
PR_00 (soğuk açılış, isimsiz siluet) → PR_01 (4 Mart: Hayri’nin makbuzu) → BR_00 (Nazan ve Orhan) → BR_00B → BR_01 (A–D ceza aralığı)
  → BR_01B → BR_02 (dosya + strateji) → INV_SABAH
INV_HUB (3 gün × 4 EP; hub, Leyla günde bir 0 EP, tahta 0 EP)
  YERLER: INV_VEZNE (sahne sc_vezne) · INV_EV_G → INV_EV (sahne sc_calisma) → INV_EV_SON_1 → INV_EV_SON
  MÜVEKKİL: INV_GORUSME_G → INV_GORUSME (konu × ton; Şifre/9 Ocak/Teslim alan/14 Ocak bulgularla açılır)
  TANIKLAR: INV_T_HAYRI · INV_T_MELEK · INV_T_ERCAN
  ARŞİV: INV_LOG · INV_PDKS · INV_TUTANAK (UV merceği) · INV_BANKA · INV_DIL (3 talep) · INV_CIKARIM · INV_LEYLA
  Gün sonu: INV_DAY_END → INV_AKSAM1 / INV_AKSAM2 (→ _TEL ya da _NAZAN)
  INV_GECE_1…9 (koşullu hafıza zinciri) → INV_GECE
H1_K…K4 (koridor) → H1_00 → H1_01 (A–D sanığa tavsiye) → H1_01S → H1_01Q (sorular) → H1_02 (teftiş raporu itirazı)
  → H1_03 (telkinli soru itirazı) → H1_04 (Ercan E1–E5) → H1_04K → H1_05 (duruşma içi talepler) → H1_ARA → H1_06 → H1_07 → H1_08G → H1_08
ARA_GIRIS_1…ARA_GIRIS → ARA_HUB (2 gün × 4 EP; yığınsız)
  KAYITLAR: ARA_KASA · ARA_PDKS2 · ARA_TICKET · ARA_ZARF · ARA_DIL · ARA_CIKARIM · ARA_LEYLA
  İNSANLAR: ARA_MELEK · ARA_BURAK · ARA_EV_G → ARA_EV (TCK 248) · ARA_HAYRI
  KEŞİF: ARA_KESIF_G → ARA_KESIF (sahne sc_onoda)   KARAR: ARA_SUC (0 EP)
  ARA_DAY_END → ARA_OTOPARK (Ercan’ın teklifi) · ARA_SON_1…5 → ARA_SON
T_00G_1…4 → T_00 → T_00R ─ ikrar → T_IKRAR → T_IKRAR_M → T_IKRAR_S → T_08
                         ├ bilirkişi → T_01 (sorular) ─┐
                         └ yok → T_01X ───────────────┴→ T_01H_G → (T_01H Hayri) → T_02 (Melek M1–M4) → T_02K
  → T_03 → T_03T (Ercan R1–R4; suç duyurusu varsa yeminsiz; R2+R3 → T_03S sessizlik) → T_03K → T_04G → (T_04 CMK 226)
  → T_05 (mütalaa) → T_06P (dayanaklar) → T_06 (esas savunma) → T_07 (son söz) → T_08 → R_KARAR (sonuca göre epilog)
T_COKUS (güvenilirlik 0, duruşmada) → T_08
```

## 4. Delil zinciri

| Kimlik | Tür | Keşif | Neyi gösterir | Sunulabilir |
|---|---|---|---|---|
| ev_teftis, ev_dokum, ev_tutanak, ev_banka, ev_ercan_ifade | EVIDENCE (savcılık) | dosya | savcılığın davası | evet (yanlış sunum cezalı) |
| ev_yonerge + clue_yonerge | EVIDENCE/CLUE | sc_vezne pano | şifre zarfa konmaz | evet |
| ev_talimat (kart) | EVIDENCE | sc_calisma klasör | "Şifreler zarfta — E.T." | evet (E3, M2) |
| ev_defter + clue_defter | EVIDENCE/CLUE | sc_calisma | Orhan’ın saydığı tutar | evet (E1 kısmi) |
| ev_karbon | EVIDENCE | sc_calisma | teslim alan boş, tutar yüksek | evet (E1) |
| ev_pdks | EVIDENCE | sc_calisma | turnike dökümü | evet (E2, M3) |
| ev_tapu | EVIDENCE | sc_calisma | tarla satışı | evet (E5) |
| ev_makbuz | EVIDENCE | INV_T_HAYRI | 16.40 ödeme, 17.47 iptal | evet (nötr) |
| clue_terminal, clue_saat | CLUE | INV_LOG | MHM-PC03; 17.38–17.56 | — |
| clue_cikis, clue_izin | CLUE | INV_PDKS | 17.10’dan önce çıkış; 9 Ocak izin | — |
| clue_tutar_fark, clue_basim, clue_imza_kopya | CLUE | INV_TUTANAK | asıl sonradan, toner imza | — |
| clue_kredi, clue_tapu | CLUE | INV_BANKA | kredinin kaynağı | — |
| ev_bilirkisi | EVIDENCE | ARA girişi (bilirkişi istendiyse) | kısıt yok; 47/47 PC03 | evet (nötr) |
| ev_kasa → clue_kod02, clue_kod01 | EVIDENCE/CLUE | ARA (dil_kasa / ara_kasa) | kasa 02 koduyla açıldı | evet (R2) |
| ev_pdks_mud → clue_ercan_cikis, clue_melek_cikis | EVIDENCE/CLUE | ARA (dil_pdks / ara_pdks) | binada kalan tek kişi | evet (R1, M4) |
| ev_ticket → clue_ticket | EVIDENCE/CLUE | ARA (dil_ticket / ara_ticket) | sıfırlamayı E. Tunalı istedi | evet (R3) |
| ev_zarflar → clue_zarf_uv | EVIDENCE/CLUE | ARA gün sonu (suç duyurusu) | zarf açılıp kapatılmış | evet (R3, M2) |
| clue_burak | CLUE | ARA_BURAK | kimlik sorulmadan sıfırlama | — |
| Çeldiriciler | CLUE | clue_postit, clue_kamera, clue_araba, clue_satranc | yanlış izler | — |

**Tarifler (tahta):** BASKASI (terminal + çıkış) · IZIN (saat + izin) · ZARF (yönerge + not) · TESLIM (defter + tutar farkı) ·
TUTANAK (toner imza + basım saati) · KREDI (kredi + tapu) · ARA: KASA (kod02 + müdür yrd. çıkışı) · SIFRE (destek talebi + zarf UV).
Çeldirici çiftler −50: postit+yönerge, araba+kredi, kamera+terminal, satranç+defter, kod01+çıkış, Melek çıkışı+terminal, Burak+kod02.

**Gecikmeli teslimler:** ARA_GIRIS_1 (dilekçe/1. celse talepleri), ARA_DAY_END ve ARA_SON_1 (ek dilekçe, suç duyurusu → zarflar).

## 5. Çelişkiler

- **Ercan, 1. celse (yeminli):** E1 "kasayı o kapatırdı" ↔ ded_teslim / ev_karbon · E2 "altıya kadar çıkmazdı" ↔ ded_baskasi / ev_pdks
  (ded_izin kısmi) · E3 "zarf yok" ↔ ev_talimat / ded_zarf (Ercan baş harfleri başka birine yönlendirir) · E4 "vezne bilgisayarından"
  ↔ ded_baskasi / ev_dokum (+clue_terminal) · E5 (E2 bastırılınca) "borç sıkıntısı… insan sıkışınca" ↔ ded_kredi / ev_tapu; itiraz g_kanaat.
  E1–E4'ün hepsinde çöküş yok: "yanlış hatırlamışım efendim".
- **Melek, 2. celse:** M2 "zarf hatırlamıyorum" ↔ ev_talimat / ded_zarf / ev_zarflar (melek_hazir ise BASTIR yeter; baskı yapıldıysa kısmi);
  M3 "geç kalırdı" ↔ ev_pdks / ded_baskasi · M4 doğrulanır (ev_pdks_mud, kısmi).
- **Ercan, 2. celse:** R1 ↔ ev_pdks_mud · R2 ↔ ev_kasa / ded_kasa · R3 ↔ ev_ticket / ded_sifre / ev_zarflar · R4 (görünür olunca) ↔ ded_sahte_tutanak.
  Suç duyurusu yapıldıysa yeminsizdir; R2 ve R3 çelişkileri birlikte → T_03S (çekinme, `ercan_sustu`).

## 6. Sonuçlar

| Öncelik | Kimlik | Sınıf | Koşul | Ceza | XP |
|---|---|---|---|---|---|
| 1 | IKRAR | OTHER (etik) | ARA_EV’de "öde ve kabul et" (ikrar_yolu) | 5 yıl 2 ay 15 gün | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | ercan_sustu ∧ ded_kasa ∧ ded_sifre ∧ baskasi ∧ ikna ≥ 8 ∧ final ≥ 10 000 | — | 1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | baskasi ∧ lehe2 ∧ ikna ≥ 6 ∧ final ≥ 9 000 | — | 1,0 |
| 4 | NITELENDIRME | RECHARACTERIZED (TCK 257/2) | nitelendirme uyarısı ∧ (terdit ∨ ihmal kabulü ∨ baskasi) ∧ final ≥ 3 000 | 5 ay, ertelendi | 0,85 |
| 5 | MAHKUMIYET | CONVICTION (varsayılan; çöküş varyantı) | — | 7 yıl 9 ay 22 gün | 0,6 / 0,3 |

`baskasi` = ded_baskasi ∨ contra_e4 ∨ contra_e2. `lehe2` = şu bulgulardan en az ikisi: ded_izin, ded_teslim, ded_sahte_tutanak, ded_kasa,
contra_r1–r3, contra_m2, contra_e1. Etik sayaç (`ethics`) XP’yi yarıya indirir: Melek’e tehdit, tanığa baskı, log yedeğini isteme,
teklifi müvekkile taşıma, ikrar önerme.

## 7. Skor
- Kategoriler: altı standart; döküm satırları delil / çapraz sorgu / itiraz / savunma / hatalı delil.
- Eşik çubuğu: Mahkûmiyet 0 · Nitelendirme 3 000 · Beraat 9 000 (sonuç koşullarıyla aynı). `scaleMax` 12 000.
- Validator final skor aralığı (örneklenmiş): −6 020…11 360.

## 8. Golden path'ler

| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 11 010 | Tam soruşturma, üç talepli dilekçe, Ercan’ın dört çelişkisi; arada kasa/turnike/destek kayıtları; suç duyurusu yok → Ercan yeminli, susmaz |
| G_B | BERAAT_B | 11 360 | TIPIK + suç duyurusu, zarf UV, SIFRE tarifi; Ercan yeminsiz, R2+R3 → çekinme |
| G_N | NITELENDIRME | 8 280 | Terditli strateji; baskasi kurulmaz; zarf ortaya çıkar, CMK 226 uyarısı, terditli esas savunma |
| G_M | MAHKUMIYET | 3 140 | Dilekçe ve tahta yok, yanlış usul hamleleri, bilirkişi yok |
| G_C | MAHKUMIYET (çöküş) | 2 620 | G_M + 2. celsede yanlış sunumlar → güvenilirlik 0 |
| G_I | IKRAR | 7 850 | ARA_EV’de "öde ve kabul et" |

**Erken çözüm denetimi (2026-10-20):** TIPIK’ten aksiyon parçalarını açgözlü silen yerel en küçükleme (scratch `min.mts`), beraatle biten
en kısa yolu **161 aksiyon** buldu (TIPIK 209; oran **0,77**; hedef ≥ 0,60). Beraat; terminal + turnike çıkarımı, teslim tutanağı
incelemesi, en az iki bağımsız lehe bulgu, 1. ve 2. celsede kayıtlarla çelişki ve ikna ≥ 6 gerektirir. Gerçek failin adı oyuncuya hiçbir
yerde söylenmez; ilk doğrudan işaret, oyuncunun istediği kasa kod listesinde (ara evresi) ve Melek’in 2. celse tanıklığında gelir.

## 9. Süre ve sözcük ölçümü
`npm run case:duration -- belediye-kasasi` (2026-10-20):

```
  TIPIK          94.1 dk   13176 sözcük   209 aksiyon  BERAAT_E (11010)
  G_B            95.0 dk   13262 sözcük   213 aksiyon  BERAAT_B (11360)
  G_N            86.3 dk   12081 sözcük   192 aksiyon  NITELENDIRME (8280)
  G_M            70.7 dk    9971 sözcük   153 aksiyon  MAHKUMIYET (3140)
  G_C            67.0 dk    9538 sözcük   140 aksiyon  MAHKUMIYET (2620)
  G_I            79.3 dk   11104 sözcük   176 aksiyon  IKRAR (7850)
  ==> TİPİK YOL (TIPIK): 94.1 dk  ✓ süre hedefte
```

Paket: ~1.290 satır, ~16.700 satır sözcüğü; geri bildirim, delil ve hüküm metinleriyle toplam ekran metni ~30 bin sözcük; en uzun satır ≤ 220 karakter.
`case:validate`: PASSED, 0 hata; kapsam node 114/114, seçenek, kural ve delil %100; golden path 6/6.
