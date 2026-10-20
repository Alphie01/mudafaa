# Dava #02 "Çevrimiçi Tuzak" — Tasarım Belgesi

> Kaynak: `content/src/cevrimici-tuzak/` (yazım kiti + satır DSL'i `dsl.ts`) → `content/cases/cevrimici-tuzak/`
> (`npm run case:build -- cevrimici-tuzak`). Hikâye kitabı: `docs/content/cevrimici-tuzak-hikaye.md`. Hukuki notlar:
> `docs/legal/cevrimici-tuzak.md`. Lineup: #02 · TCK 158/1-f · rütbe şartı yok · zorluk 1.

## 1. Logline ve tema
- İş arayan 23 yaşındaki Ece Yalın, banka hesabından bir emeklinin kaporası geçip dağıldığı için nitelikli
  dolandırıcılıkla yargılanıyor. Hesap onun; hesabın o gün **kimin elinde** olduğunu Deniz bulmak zorunda.
- Tema: *Güven, en kolay çalınan kimliktir.* Dramatik soru: "Kandırılmış olmak suç mu?"
- Ton: noir dram, dijital çağ (bkz. hikâye kitabı §0).

## 2. Soğuk açılış
`PROLOG` (4 Kasım 2025; Nurettin'in kaporası, isimsiz "SATICI", kapüşonlu kurye, "SIM yok") → `PROLOG_2` (7 Kasım 2025,
Siber'de müdafisiz ifade: "kimseyle kod paylaşmadım"). Konuşmacılar `narrator` + `name`; fail ya da işveren adı geçmez.

## 3. Karakterler
Bkz. hikâye kitabı §2 (sesler, sırlar, yaylar). Kimlikler: `ece`, `sevim`, `nurettin`, `gokhan`, `onur`, `arda`,
`necdet` (gerçek fail; kadroda rolü `WITNESS`), `burak` (kırmızı ringa), `hakim`, `savci`, `mubasir`, `leyla`, `deniz`.
Yeni sprite'lar paketin içinde: `content/src/cevrimici-tuzak/sprites.ts` (`ct_ece`, `ct_nurettin`, `ct_onur`, `ct_arda`,
`ct_necdet`, `ct_burak`; `content/shared/sprites/` yalnızca tasarımdaki 21 sprite'ı tutar, bkz. `extract-sprites.test.ts`); ortak: `anne`,
`polis`, `hakim`, `savci`, `mubasir`, `mentor`, `avukat_cubbe`.

## 4. Gerçek ve kronoloji
Bkz. hikâye kitabı §3. Özet: "Nova Dijital İK / Kaan Bey" = OM İş Merkezi müdürü **Necdet Sarı**. 3 Kasım 14.29'da Ece'ye
"SGK kodu" diye bankanın cihaz tanımlama kodu okutuldu; 4 Kasım 10.12'de hat sahte vekâletname (vekil: Arda Kılıç) ve
Ece'nin Nova'ya yolladığı fotoğraftan basılmış "fotokopi" ile Mavi İletişim'de kopyalandı; kopya SIM ve İK hattı aynı
Samsung'da (IMEI 35 491207…) kullanıldı; 2 Kasım 23.48'de Necdet kendi hattını (0533 287 19 90) bu cihaza 6 dakika taktı.

## 5. Sahne listesi (tipik yol)
| # | Sahne (node'lar) | Vuruş | Mekanik |
|---|---|---|---|
| 1 | PROLOG, PROLOG_2 | Kurban, kurye, susan telefon; inkâr cümlesi | — |
| 2 | BR_00 → BR_01 → BR_01K → BR_01B → BR_02 | Sevim, ücret seçimi; ceza aralığı (A–D); 7589/158-4 dersi; dört kâğıt; strateji | A–D, strateji |
| 3 | INV1_SABAH → INV1_HUB (3 gün × 4 EP) | Ece kapıda; güven seçimi | hub, Leyla (0 EP), tahta (0 EP) |
| 4 | INV1_ECE (+INV1_ECE_TAVSIYE) | İlan, avans, susan telefon, inkâr; ekran görüntüleri; sarı notla yüzleşme; tavsiye | görüşme (konu × ton), konu açılımları |
| 5 | INV1_ODA | Lamba, sarı not, tablo, "SIM yok" | sahne araması |
| 6 | INV1_HESAP, INV1_SIKAYET | Avans açıklaması, dönen 15.000 TL, QR çekim; satıcı numarası, "Dördüncü kat" dipnotu | belge incelemesi ×2 |
| 7 | INV1_OPERATOR | Ece kendi kaydını ister: 10.12 vekil, 19.20 itiraz | seçim |
| 8 | INV1_SEVIM | Burak şüphesi, IMEI kutusu, 11.05 araması | konuşma |
| 9 | INV1_OM → INV1_KORIDOR | Necdet, sözleşme (kiracı Arda), kartvizit; Nova etiketinin altında "YÖNETİM ARŞİVİ" | konuşma, sahne araması |
| 10 | INV1_BAYI, INV1_BURAK(+_T), INV1_GOKHAN | "Vekâletle gelen bir abi"; Burak alibisi, IMEI dersi, **etik tuzak**; polis cihazı sormamış | konuşma, etik seçim |
| 11 | INV1_DIL, INV1_CIKARIM | CMK 177 (3 hak); altı tarif | dilekçe, çıkarım |
| 12 | INV1_AKSAM1/2(B), INV1_GECE_1…6 → INV1_GECE | Nurettin'in telefonu; tehdit mesajı; hafıza zinciri | seçim, DECISION zinciri |
| 13 | H1_KORIDOR… H1_08 | Banka kaydı; katılma; Ece'nin üç hâli; sanığa sorular; yönlendirici soru; katılan; **Gökhan G1–G5**; talepler; ara karar | itiraz, tanıklık, A–D |
| 14 | ARA_GIRIS_1…3 → ARA_HUB (2 gün × 4 EP, yığınsız) | Gelen kayıtlar; bayi dosyası; kurye; otopark; katılan; Siber; suç duyurusu/İMEİ; Ece; Burak–Sevim | belge, sahne, konuşma, tahta (11 tarif) |
| 15 | ARA_AKSAM(2), ARA_SON_1…3 → ARA_SON | İsimsiz telefon; son gece | seçim, DECISION zinciri |
| 16 | T_00 … T_09 | Arda; **Onur O1–O4**; **Necdet N1–N4**; diyecek; iştirak çıkışı; katılan; mütalaa; esas savunma; son söz | itiraz, tanıklık ×2, A–D |
| 17 | R_KARAR | Hüküm + sonuca bağlı epilog | — |

## 6. Ters köşeler
1. **İş ilanı bir tuzaktı** (soruşturma): `ded_kaan` = İK numarası (ekran görüntüleri) + satıcı numarası (şikâyet).
   Ekimler: Ece'nin kamerası bozuk işvereni, "Dördüncü kat" (iki ayrı kaynak), avansın geri dönüşü.
2. **"Kaan" = Necdet Sarı** (2. celse): `ev_imei_rapor` + `clue_kartvizit` (= `ded_necdet`) ya da İMEİ raporunun
   kartvizit varken sunulması. Ekimler (hiçbiri tek başına isim vermez): limon kolonyası ve mühür yüzük (INV1_OM),
   "YÖNETİM ARŞİVİ" levhası (koridor), yönetim park yeri (otopark + Arda), Ece'nin iki saniyelik kamera anısı (yüzük),
   Onur'un kürsüdeki tarifi, Necdet'in "kâğıt üstünde bizdeydiler" sözü.

## 7. Delil zinciri
| Kimlik | Ad | Tür | Keşif | Ne işe yarar | Sunulabilir |
|---|---|---|---|---|---|
| ev_siber_rapor, ev_hesap, ev_sikayet, ev_ece_ifade | Dosyadaki dört kâğıt | EVIDENCE | başlangıç | savcılık delilleri (yanlış sunum cezalı) | ✓ |
| ev_not | Sarı not "4471 — SGK" | EVIDENCE | INV1_ODA | aldatma; G5 | ✓ |
| clue_tablo | Başvuru tablosu | CLUE | INV1_ODA | TP_EKRAN'ı açar | — |
| clue_lamba, clue_simyok, clue_cv*, clue_vesikalik* | Lamba/oje, "SIM yok", çeldiriciler | CLUE | INV1_ODA | ded_kopya, ded_sim | — |
| clue_ding_ece | Mülakattaki anons | CLUE | TP_ILAN | ded_bina | — |
| clue_sgk_mesaj, clue_kvkk_mesaj, clue_hr_no | Ekran görüntüleri | CLUE | TP_EKRAN | ded_aldatma, ded_kesinti, ded_kaan | — |
| clue_iphone_imei | Kutu IMEI | CLUE | INV1_SEVIM | ded_imei | — |
| clue_avans, clue_mdemir_cikis, clue_qr_atm | Hesap bulguları | CLUE | INV1_HESAP | ded_dongu | — |
| clue_satici_no, clue_ding_nurettin | Şikâyet bulguları | CLUE | INV1_SIKAYET | ded_kaan, ded_bina | — |
| ev_sim_dokum | Operatör işlem dökümü | EVIDENCE | INV1_OPERATOR | G3, O1 (kısmi), ded_sim, ded_kesinti | ✓ |
| ev_sozlesme, clue_kartvizit | Sözleşme, kartvizit | EV / CLUE | INV1_OM | ded_arda_kimlik, ded_necdet | ✓ / — |
| clue_asansor, clue_levha, clue_kiraci | Koridor bulguları | CLUE | INV1_KORIDOR | tahta kartları | — |
| clue_onur_vekil, clue_burak_alibi | Sürçme, alibi | CLUE | INV1_BAYI / INV1_BURAK | anlatı | — |
| ev_bayi_ekran | Yetkisiz bayi ekranı | EVIDENCE (EXCLUDABLE) | BURT_KABUL | **ETİK** | ✓ (cezalı) |
| ev_banka_log | Banka cihaz/erişim kaydı | EVIDENCE | H1_KORIDOR (DIL_LOG) / ARA_GIRIS_1 (RQ_LOG) | G1, T_00K | ✓ |
| ev_hts | Hattın iletişim tespiti | EVIDENCE | ARA_GIRIS_1 (DIL_HTS/RQ_HTS) | ded_imei, İMEİ talebi | ✓ |
| ev_bayi_belge | Bayi işlem dosyası | EVIDENCE | ARA_GIRIS_1 (DIL_BAYI/RQ_BAYI) | O1, ARA_BELGE | ✓ |
| ev_atm | ATM kareleri | EVIDENCE | ARA_GIRIS_1 (DIL_ATM/RQ_ATM) | Arda'yı açar, O3_EK | ✓ |
| ev_imei_rapor | İMEİ sorgu raporu | EVIDENCE | ARA_DAY_END / T_00 (SUC_A + ded_kaan + ev_hts) | N3, ded_necdet | ✓ |
| ev_noter_yok, clue_parlama, clue_vekil_arda | Belge bulguları | EV / CLUE | ARA_BELGE | O2; ded_kopya; ded_arda_kimlik | ✓ / — |
| clue_arda_otopark, clue_yonetim_park | Teslim yeri | CLUE | ARA_ARDA / ARA_OTOPARK | ded_otopark | — |
| ev_ilan_foto, clue_yuzuk_ece | İlan fotoğrafı, yüzük anısı | EV / CLUE | ARA_NURETTIN / ARA_ECE | N2 (kısmi); anlatı | ✓ / — |
| ev_arda_beyan | Arda'nın duruşma beyanı | EVIDENCE | T_01 | O3_EK, N1 | ✓ |

Çıkarımlar (tahta, +300): **INV1** ded_kaan, ded_dongu, ded_aldatma, ded_kesinti, ded_bina, ded_sim · **ARA** ded_imei,
ded_kopya, ded_otopark, ded_necdet, ded_arda_kimlik (+ INV1 tariflerinin ARA kopyaları; puan yalnız ilk kurulumda).
Çeldirici kartlar: clue_cv, clue_vesikalik, clue_kiraci, clue_levha, clue_asansor, clue_qr_atm (yanlış çift −50).

## 8. Çelişkiler (çapraz sorgu)
**Gökhan Ateş (H1_05T)**
| İfade | Bastır | Doğru sunum | Kısmi | Not |
|---|---|---|---|---|
| G1 "sanığın kendi telefonundan" | press_g1 → G5 görünür | ev_banka_log (+300, contra_g1) | — | |
| G2 "kiralama bedeli" | press_g2 | ded_dongu (+300, contra_g2) | ev_hesap (clue_avans), ded_kaan (+100) | |
| G3 "SMS'ler sanığın hattına" | press_g3 | ev_sim_dokum / ded_sim / ded_kesinti (+300, contra_g3) | — | ev_bayi_ekran → ETİK |
| G4 "muhtemelen yakını" | press_g4 | — | — | İTİRAZ g_kanaat (+50) |
| G5 "o hâlde kendisi tanımlamış" | PR_G5 | ded_aldatma/ev_not: ece_durust → +300; inkârda → −150, ♥−1; susmada → +100 | | İTİRAZ g_kanaat |

**Onur Demirci (T_02T)** · önce savcının yönlendirici sorusu (T_02P)
| O1 "yüz yüze kontrol" | press | ev_bayi_belge / ded_kopya (+300) | ev_sim_dokum (+100) |
| O2 "noterde sorgulattım" | press | ev_noter_yok (+300) | |
| O3 "nişanlısıydı" → O3_EK "genç çocuktu" | press_o3 açar | O3_EK: ev_arda_beyan / ded_arda_kimlik / ev_atm (+300, **tarif_yuzuk**) | İTİRAZ g_duyum (O3) |
| O4 "kimseden almadım" | press → CMK 48 uyarısı, bin lira itirafı | | |

**Necdet Sarı (T_03T)**
| N1 "Arda imzaladı" | press_n1 → N4 görünür | ev_arda_beyan / ded_arda_kimlik (+300) | ev_sozlesme (−50, tanığı doğrular) |
| N2 "kimse gelmedi" | press | ded_bina (+300) | ev_ilan_foto (+100); İTİRAZ g_kanaat |
| N3 "numaralarla ilgim yok" | press (yüzük anısı) | **ded_necdet** ya da ev_imei_rapor + kartvizit (+300/+250, **necdet_ifsa** → T_03X) | ev_imei_rapor kartvizitsiz (+100), ded_imei/ev_hts (+100) |
| N4 "aracım servisteydi" | press | ded_otopark (+200) | |

## 9. Node grafiği özeti
- Bölüm 2 hub'ı push/`$return`; ara hub'ı yığınsız (`direct()` yardımcı fonksiyonu alt ekranlardaki `$return`'ü ARA_HUB'a çevirir).
- Gün sonları DECISION: `INV1_DAY_END` (gün 2 → INV1_AKSAM1; gün 3 → saha ziyareti varsa INV1_AKSAM2, yoksa INV1_AKSAM2B),
  `ARA_DAY_END` (İMEİ teslimi; suç duyurusu varsa ARA_AKSAM).
- Koşullu satır birleştirme DECISION zincirleriyle: INV1_GECE_1…6, H1_K3, H1_03R, ARA_GIRIS_1…3, ARA_ECE_0, ARA_NURETTIN_0,
  ARA_SON_1…3, T_00R, T_03R, T_07S1…2.
- Tetikleyiciler: `tg_inv1_day`, `tg_ara_day`, `tg_cokus` (♥0 → T_COKUS → T_09).

## 10. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul | Ceza | XP |
|---|---|---|---|---|---|
| 1 | ETIK | CONVICTION + etik kartı | illegal_used ∨ tanik_etkileme ∨ ethics ≥ 2 | 3 yıl 4 ay + 125.000 TL; baroya bildirim | 0 |
| 2 | BERAAT_B | ACQUITTAL (223/2-b) | ¬çöküş ∧ necdet_ifsa ∧ gercek_fail ∧ sim_proven ∧ cihaz_proven ∧ ikna ≥ 7 ∧ final ≥ 8.000 | — | 1,2 |
| 3 | BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş ∧ sim_proven ∧ cihaz_proven ∧ ikna ≥ 5 ∧ final ≥ 6.500 | — | 1,0 |
| 4 | INDIRIM | RECHARACTERIZED (158/4) | ¬çöküş ∧ (terditli ∨ terditli_erken) ∧ final ≥ 3.000 | 1 yıl 8 ay + 62.500 TL, HAGB (CMK 231/5, 231/9) | 0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan | 3 yıl 4 ay + 125.000 TL | 0,6 |

Yüklemler: `sim_proven` = contra_g3 ∨ contra_o1 ∨ contra_o2 · `cihaz_proven` = contra_g1 ∨ cihaz_t04.
Ceza hesapları ve gerekçeler: `docs/legal/cevrimici-tuzak.md` §2.

## 11. Skor
- Ölçek (Dava #07 ile aynı): sahne nesnesi +40/+60, ıska/çeldirici −10; belge +100/+150, yanlış alet −20; tarif +300, yanlış
  çift −50; bastır +25; doğru sunum +300, kısmi +100, yanlış ♥−1 −150; usul itirazı +50…+150, dayanaksız ♥−1 −50; esas
  savunma `strategyAmount(200, …)`; etik ihlalleri −60…−150 ve `ethics`.
- Döküm satırları: Delil toplama ({{count.evidence:key}}) · Çapraz sorgu · İtiraz isabeti · Savunma · Hatalı delil.
- Eşik çubuğu: Mahkûmiyet 0 · İndirim 3.000 · Beraat 6.500 (BERAAT_B ayrıca 8.000). `scaleMax` 10.500 (teorik tavan ≈ 11.085).

## 12. Golden path'ler
| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 10.750 | Eksik soruşturma stratejisi; bütün kayıtlar; G1–G5; Onur çöker; Necdet'in numarası bağlanmaz |
| G_B | BERAAT_B | 11.085 | Masumiyet; İMEİ raporu + kartvizit tahtada; N3'te ded_necdet; esas savunmada gerçek fail |
| G_E2 | BERAAT_E | 10.360 | İş merkezine hiç gidilmez; İMEİ raporu kartvizitsiz (kısmi) |
| G_I | INDIRIM | 4.195 | Yanlış dilekçe talepleri, hat/cihaz gösterilemez; susma tavsiyesi; erken ve esasta terditli |
| G_M | MAHKUMIYET | 455 | Sert tonlar, yanlış ceza aralığı, dayanaksız itirazlar, Burak'a iftira dilekçesi, duygusal savunma |
| G_ETIK | ETIK | 8.735 | Burak'ın yetkisiz bayi ekranı alınır ve H1/H2'de sunulur |
| W | MAHKUMIYET (çöküş) | 5.750 | Ece kodu anlatmaz; müdafi onu G5'te yalanlar; 2. celsede yanlış deliller, ♥0 |

**Erken çözüm denetimi:** golden path'lerden aksiyon silerek (16→1 blok) yerel en kısa beraat yolu arandı
(`scratchpad/shortest.mjs`, motor `act` ile): BERAAT_E 137 aksiyon (TIPIK'in %68,5'i), BERAAT_B 137 aksiyon. İkisi de banka
kaydını, hattın elden çıktığını (G3 ya da O1/O2) ve skor eşiğini zorunlu tutar; B ayrıca İMEİ + kartvizit bağını ister.

## 13. Süre ve sözcük ölçümü
`npm run case:duration -- cevrimici-tuzak` (2026-10-20):

```
  TIPIK          93.1 dk   13161 sözcük   200 aksiyon  BERAAT_E (10750)
  G_B            92.3 dk   13019 sözcük   200 aksiyon  BERAAT_B (11085)
  G_E2           90.0 dk   12738 sözcük   192 aksiyon  BERAAT_E (10360)
  G_I            66.1 dk    9476 sözcük   135 aksiyon  INDIRIM (4195)
  G_M            61.5 dk    8729 sözcük   130 aksiyon  MAHKUMIYET (455)
  G_ETIK         90.0 dk   12705 sözcük   194 aksiyon  ETIK (8735)
  W              77.3 dk   10849 sözcük   170 aksiyon  MAHKUMIYET (5750)
  ==> TİPİK YOL (TIPIK): 93.1 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```
