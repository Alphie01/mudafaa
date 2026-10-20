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
| 9 | INV1_OM → INV1_KORIDOR | Necdet, sözleşme (kiracı Arda), kartvizit; asansörün kayıtlı sesi; Nova etiketinin altında sökülmüş bir levhanın "ARŞİV" izi | konuşma, sahne araması |
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
   kartvizit varken sunulması. Ekimler (hiçbiri tek başına isim vermez): limon kolonyası (INV1_OM; yüzük orada
   gösterilmez), sökülmüş levhada yalnızca "ARŞİV" izi (koridor; "yönetim arşivi" ancak N2'de Necdet'in ağzından çıkar),
   yönetim park yeri (otopark + Arda), Ece'nin iki saniyelik kamera anısı ("bir yüzük parladı"; biçimi yok), H2'de Arda'nın
   ve Onur'un yüzük/kolonya tarifi, T_03'te kürsüye vurulan yüzük. İnceleme sonrası (devil's advocate) kaldırılan
   ipuçları: `clue_asansor`'daki "Necdet'in odası dördüncü katta", INV1_OM'daki yaş/yüzük tarifi, Nurettin'in "kırkını
   geçmiş, kibar ses"i, ARA_AKSAM'daki arayanın "efendim"i ve "tanıdık şirket adı" satırları, İMEİ raporundaki abone adı
   (artık yalnızca "kurumsal hat; abone bilgisi ayrıca istendi"; bağ yalnızca kartvizitle kurulur).

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
| ev_banka_log | Banka cihaz/erişim kaydı | EVIDENCE | H1_KORIDOR (DIL_LOG) / ARA_GIRIS_1 (RQ_LOG) | G1, T_00K, ded_cihaz | ✓ |
| ev_hts | Hattın iletişim tespiti | EVIDENCE | ARA_GIRIS_1 (DIL_HTS/RQ_HTS) | ded_imei, İMEİ talebi | ✓ |
| ev_bayi_belge | Bayi işlem dosyası | EVIDENCE | ARA_GIRIS_1 (DIL_BAYI/RQ_BAYI) | O1, ARA_BELGE | ✓ |
| ev_atm | ATM kareleri | EVIDENCE | ARA_GIRIS_1 (DIL_ATM/RQ_ATM) | Arda'yı açar, O3_EK | ✓ |
| ev_imei_rapor | İMEİ sorgu raporu | EVIDENCE | ARA_DAY_END / T_00 (SUC_A + ded_kaan + ev_hts) | N3, ded_necdet | ✓ |
| ev_noter_yok, clue_parlama, clue_vekil_arda | Belge bulguları | EV / CLUE | ARA_BELGE | O2; ded_kopya; ded_arda_kimlik | ✓ / — |
| clue_arda_otopark, clue_yonetim_park | Teslim yeri | CLUE | ARA_ARDA / ARA_OTOPARK | ded_otopark | — |
| ev_ilan_foto, clue_yuzuk_ece | İlan fotoğrafı, yüzük anısı | EV / CLUE | ARA_NURETTIN / ARA_ECE | N2 (kısmi); anlatı | ✓ / — |
| ev_arda_beyan | Arda'nın duruşma beyanı | EVIDENCE | T_01 | O3_EK, N1 | ✓ |

Çıkarımlar (tahta, +300): **INV1** ded_kaan, ded_dongu, ded_aldatma, ded_kesinti, ded_bina, ded_sim · **ARA** ded_imei,
ded_kopya, ded_otopark, ded_necdet, ded_arda_kimlik, ded_cihaz (ev_banka_log + clue_iphone_imei: "Samsung, iPhone değil")
(+ INV1 tariflerinin ARA kopyaları; puan yalnız ilk kurulumda).

**Talep dayanağı (erken çözüm kapısı).** CMK 177 dilekçesi (INV1_DIL) ve 1. celse talepleri (H1_06) aynı `dil_hak` bütçesini
(3) paylaşır ve her talep soruşturmada bulunmuş bir olguya bağlıdır: banka cihaz kaydı ← `fact_polis_eksik` (Gökhan'a
"cihaz kaydı istediniz mi?"); iletişim tespiti ← `clue_simyok` ∨ `clue_iphone_imei`; bayi belgeleri ← `ev_sim_dokum`
(operatör ziyareti); ATM ← `clue_qr_atm`. Dolayısıyla `ev_bayi_belge` (O1) operatör dökümü olmadan gelmez.
Çeldirici kartlar: clue_cv, clue_vesikalik, clue_kiraci, clue_levha, clue_asansor, clue_qr_atm (yanlış çift −50).

## 8. Çelişkiler (çapraz sorgu)
Bütün tam/kısmi sunumlar ilgili ifadenin önce **bastırılmasını** ister (`enabledWhen: press_x`); bastırmadan
sunulan belge için hâkim "önce tanığa sorun" der (`PS_*_ERKEN`, `maxUses: 3`, cezasız ama boşa aksiyon).

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
| 1 | ETIK_BERAAT | ACQUITTAL (223/2-e) + etik kartı | ¬çöküş ∧ etik_ihlal ∧ delil_beraat | — ; kayıt dışlanır, ihlal salonda görüldüyse karar örneği baroya ve Başsavcılığa | 0 |
| 2 | ETIK | CONVICTION + etik kartı | etik_ihlal (ve hukuka uygun delil beraate yetmiyor) | 3 yıl 4 ay + 125.000 TL | 0 |
| 3 | BERAAT_B | ACQUITTAL (223/2-b) | ¬çöküş ∧ necdet_ifsa ∧ gercek_fail ∧ sim_proven ∧ cihaz_proven ∧ ikna ≥ 7 ∧ final ≥ 8.000 | — | 1,2 |
| 4 | BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş ∧ delil_beraat (skordan bağımsız) | — | 1,0 |
| 5 | INDIRIM | RECHARACTERIZED (158/4) | ¬çöküş ∧ (terditli ∨ terditli_erken) ∧ final ≥ 3.000 | 1 yıl 8 ay + 62.500 TL, HAGB (CMK 231/5, 231/9) | 0,85 |
| 6 | MAHKUMIYET | CONVICTION | varsayılan | 3 yıl 4 ay + 125.000 TL | 0,6 |

`etik_ihlal` = illegal_used ∨ tanik_etkileme ∨ ethics ≥ 2 (BURT_KABUL tek başına ethics +2: TCK 243/136'ya azmettirme).
Tek bir hafif ihlal (TAV_B, BAY_BASKI, NU_VAZGEC; ethics 1, ♥−1) beraati engellemez ama BERAAT_E/B epiloguna Leyla'nın
ihtar sahnesi eklenir.

Yüklemler (`00-meta.json`):
- `sim_kismen` = contra_g3 ∨ contra_o1 ∨ contra_o2 · `cihaz_kismen` = contra_g1 ∨ cihaz_t04 (yalnız gerekçe seçimi için).
- `sim_proven` = contra_g3 ∧ contra_o1 ∧ contra_o2 ∧ contra_o3 ∧ ded_kopya ∧ (ded_sim ∨ ded_kesinti).
- `cihaz_proven` = contra_g1 ∧ ded_imei (T00K_A tek başına yetmez).
- `kast_yok` = (istirak_cevap ∨ contra_g5 ∨ necdet_ifsa) ∧ ded_kaan ∧ ded_aldatma ∧ fact_itiraz_tutanak ∧ fact_kaan_erkek ∧
  (arda_teslim ∨ necdet_ifsa) · `kira_yok` = contra_g2 ∨ g2_kaan · `nova_sahte` = (contra_n1 ∧ contra_n2) ∨ necdet_ifsa.
- `savunma_tam` = sim_proven ∧ cihaz_proven ∧ kast_yok ∧ kira_yok ∧ nova_sahte.
- `savunma_arda_disi`: yönlendirilen kuryenin (AR_C) beyanı ve ona dayanan çıkarımlar düşüldüğünde kalan hukuka uygun delil.
- `delil_beraat` = (¬Arda yönlendirildi-ve-dinlendi ∧ savunma_tam) ∨ (Arda yönlendirildi-ve-dinlendi ∧ savunma_arda_disi) ∨
  (necdet_ifsa ∧ sim_proven ∧ cihaz_proven).

**Mütalaa (T_05):** `delil_beraat ∧ ikna ≥ 8 ∧ ♥ ≥ 2` ise savcı beraat ister (necdet_ifsa varsa 2-b gerekçesiyle); aksi hâlde
mahkûmiyet ister (hat ve cihaz kısmen gösterildiyse "kodu bilerek sağladı" gerekçesiyle). Beraat mütalaası verilen her yolda delil koşulu tam olduğundan hüküm beraattir;
mahkûmiyet gerekçesi `sim_kismen ∧ cihaz_kismen` durumunda "ileri sürülmüşse de her yönüyle gösterilememiş" diye ayrışır.
Beraat hükümlerinde yurt dışı yasağı 1. celsede kaldırıldıysa (yasak_kalkti) yeniden kaldırılmaz, yalnızca gerekçede anılır.
Epiloglar: motor eşleşen bütün blokları gösterdiği için her yedek blok, koşullu kardeşinin olumsuzunu taşır
(nurettin_saygi, illegal_used, ev_not); `ct/probe.mts epi` ile 8 golden path'in epilogu tekrar satır içermez.
Ceza hesapları ve gerekçeler: `docs/legal/cevrimici-tuzak.md` §2.

## 11. Skor
- Ölçek (Dava #07 ile aynı): sahne nesnesi +40/+60, ıska/çeldirici −10; belge +100/+150, yanlış alet −20; tarif +300, yanlış
  çift −50; bastır +25; doğru sunum +300, kısmi +100, yanlış ♥−1 −150; usul itirazı +50…+150, dayanaksız ♥−1 −50; esas
  savunma `strategyAmount(200, …)`; etik ihlalleri −60…−150 ve `ethics`.
- Döküm satırları: Delil toplama ({{count.evidence:key}}) · Çapraz sorgu · İtiraz isabeti · Savunma · Hatalı delil.
- Eşik çubuğu: Mahkûmiyet 0 · İndirim 3.000 · Beraat (2-b) 8.000. İnceleme sonrası BERAAT_E için skor kapısı yok (delil
  koşulu `delil_beraat`); skor yalnızca INDIRIM (3.000) ve BERAAT_B (8.000) için kapıdır. `scaleMax` 10.500 (teorik tavan ≈ 11.465).

## 12. Golden path'ler
| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 11.130 | Eksik soruşturma stratejisi; bütün kayıtlar; G1–G5; Onur çöker; Necdet'in numarası bağlanmaz |
| G_B | BERAAT_B | 11.465 | Masumiyet; İMEİ raporu + kartvizit tahtada; N3'te ded_necdet; esas savunmada gerçek fail |
| G_E2 | BERAAT_E | 10.420 | İş merkezine hiç gidilmez; İMEİ raporu kartvizitsiz (kısmi) |
| G_I | INDIRIM | 4.195 | Yanlış dilekçe talepleri, hat/cihaz gösterilemez; susma tavsiyesi; erken ve esasta terditli |
| G_M | MAHKUMIYET | 385 | Sert tonlar, yanlış ceza aralığı, dayanaksız itirazlar, Burak'a iftira dilekçesi, duygusal savunma |
| G_ETIK | ETIK_BERAAT | 9.840 | Burak'ın yetkisiz bayi ekranı alınır ve H1'de sunulur; hukuka uygun deliller yine de beraate yeter; baroya bildirim |
| G_ETIK2 | ETIK | 235 | G_M'nin zayıf soruşturması + Burak'ın yetkisiz kaydını kabul (BURT_KABUL, ethics +2); hukuka uygun delil yok |
| W | MAHKUMIYET (çöküş) | 6.130 | Ece kodu anlatmaz; müdafi onu G5'te yalanlar; 2. celsede yanlış deliller, ♥0 |

**Erken çözüm denetimi (devil's advocate sonrası yeniden ölçüldü).** İnceleme, 1. celseye gün 2'de gidip H1_06'da bütün
kayıtları dayanaksız isteyerek 104 aksiyonda BERAAT_E'ye, 116 aksiyonda BERAAT_B'ye ulaşıldığını gösterdi (eski §12'deki
137 ölçümü yanlıştı). Düzeltmeler: (1) H1_06 talepleri INV1 olgularına bağlandı ve INV1_DIL ile aynı `dil_hak` (3)
bütçesini paylaşıyor; (2) bütün sunumlar önce bastırma istiyor; (3) çıplak itirazlar (H103_A, OB_G4, OB_G5) ikna vermiyor;
(4) `cihaz_proven` T00K_A ile değil contra_g1 ∧ ded_imei ile, `sim_proven` G3 + O1 + O2 + O3 + ded_kopya ile kuruluyor;
(5) beraat `delil_beraat` yüklemine (hat, cihaz, kast, kira, Nova) bağlı, skor eşiğine değil.
Sonda: `scratchpad/ct/probe.mts` (motor `act`; golden path'ler ve "erken mahkeme" eklemeli tohumlar — H1'e itiraz/
bastırma, bütün RQ talepleri, T00K_A — üzerinde 32→1 blok silme minimizasyonu). Sonuç (2026-10-20):

| Hedef | En kısa | TIPIK'e oranı | Süre | Sözcük |
|---|---|---|---|---|
| Herhangi bir beraat (BERAAT_E/B, ETIK_BERAAT) | 123 aksiyon | %60 (123/205) | 70,9 dk | 10.555 |
| BERAAT_B | 130 aksiyon | %63 | 73,8 dk | 10.951 |

En kısa beraat yolu da odayı, Ece görüşmesini (sarı notla yüzleşme), operatörü, Sevim'in kutusunu, iş merkezini,
Gökhan'ı, dayanaklı dilekçeyi, bayi dosyası incelemesini, suç duyurusunu, kuryeyi, tahtayı ve iki celsenin çapraz
sorgularını içerir. Soruşturmasız erken mahkeme (inceleme yolu a1) artık MAHKUMIYET verir (hiçbir talep açılmaz, savcı mahkûmiyet ister, gerekçe kayıtla çelişmez).

## 13. Süre ve sözcük ölçümü
`npm run case:duration -- cevrimici-tuzak` (2026-10-20):

```
  TIPIK         103.9 dk   15014 sözcük   205 aksiyon  BERAAT_E (11130)
  G_B           102.5 dk   14761 sözcük   205 aksiyon  BERAAT_B (11465)
  G_E2           99.8 dk   14460 sözcük   195 aksiyon  BERAAT_E (10420)
  G_I            73.0 dk   10636 sözcük   139 aksiyon  INDIRIM (4195)
  G_M            68.3 dk    9876 sözcük   134 aksiyon  MAHKUMIYET (385)
  G_ETIK2        68.2 dk    9863 sözcük   134 aksiyon  ETIK (235)
  G_ETIK        101.5 dk   14676 sözcük   200 aksiyon  ETIK_BERAAT (9840)
  W              86.2 dk   12381 sözcük   174 aksiyon  MAHKUMIYET (6130)
  ==> TİPİK YOL (TIPIK): 103.9 dk  ✓ süre hedefte
  ==> SÖZCÜK BÜTÇESİ: ✓ 15014 sözcük: hedefte (15–25 bin)
  ==> KAPI: ✓ GEÇTİ
```
