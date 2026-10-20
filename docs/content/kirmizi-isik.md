# Dava #03 "Kırmızı Işık" — Dava Tasarımı

> Kaynak: `content/src/kirmizi-isik/` (yazım kiti) → `content/cases/kirmizi-isik/` (`npm run case:build -- kirmizi-isik`).
> Hikâye kitabı: `docs/content/kirmizi-isik-hikaye.md`. Hukuki notlar: `docs/legal/kirmizi-isik.md`. Lineup satırı #03.
> Referans uygulama: Dava #07 v2 (`docs/content/dava-07-v2-report.md`).

## 1. Logline ve tema

- **Logline:** Gece vardiyasından dönen Volkan Eren, Gökdere kavşağında bir yayaya çarptığına inanıyor; bilirkişi onu
  kırmızı ışıkta, hızlı ve telefonla konuşurken %100 kusurlu buluyor. Hamile karısı bir avukat tutuyor. Gerçek: kavşağın
  denetleyicisi arızalıydı (taşıt ve yaya yeşili birlikte yandı) ve ölümcül çarpmayı yedi saniye önce geçip kaçan bir panelvan
  yaptı; Volkan'ın aracı yerde yatan kadına sonradan sürtündü.
- **Tema:** suçluluk duygusu ile suç aynı şey değildir; kusur ve illiyet.
- **Ton:** noir dram; kasım–şubat Bursası, yağmur. Ana mekânlar: Arslan Hukuk, Volkan'ın evi, Gökdere–Çınarlı kavşağı (gece ve
  gündüz), yediemin otoparkı, taksi durağı, belediye sinyal deposu, köşedeki büfe, Devlet Hastanesi, trafik şube, adliye,
  Kestel sanayi sitesi, Emirsultan mezarlığı, doğumhane.

## 2. Gerçek ve kronoloji
Ayrıntılı tablo hikâye kitabında (§1). Özet: 9 Kasım ihbar → 10 Kasım iş emri ertelenir → 14 Kasım 00.58 gerilim düşümü,
denetleyici yeniden başlar, çatışma uyarısı bastırılır → 01.05 Hatice'nin sesli mesajı → 01.11.41 panelvan çarpar ve kaçar
(18 m kilit izi, sağ far camı, sağ stop lambası kırık) → 01.11.48 Volkan yeşilde 38 km/s, yerdeki yayaya sol ön tamponla
sürtünür, durur, 112'yi arar → 01.12 taksici gümbürtüyle başını kaldırır, kendi kırmızısını görür → 01.24 polis; cam
kırıkları tutanağa girer, emanete alınmaz → 14 Kasım sabah panelvan faturasız onarılır → 15 Kasım kart değişir.

## 3. Yapı ve node haritası

| Bölüm | Node'lar | İçerik |
|---|---|---|
| Soğuk açılış | PR_00, PR_01, PR_02 | İsimsiz sesler (SÜRÜCÜ, TELEFONDAKİ SES, BİR POLİS, BİR ADAM, BİR KADIN): araç içi, kavşak, eşin gecesi |
| Bölüm 1 · Dosya | BR_00 (+BR_00B), BR_01, BR_01B, BR_01C, BR_02, INV_SABAH | Gül büroda (3 seçim), ceza aralığı (A–D), altı kâğıt + bilirkişi dersi (seçim), kusur sorusu (A–D), dosya ekranı + strateji, kavşak sabahı |
| Bölüm 2 · Soruşturma | INV_HUB (4 gün × 4 EP; Leyla günde bir, 0 EP; tahta 0 EP) | 3 sahne araması, 5 belge, dilekçe, tahta, Volkan (2 görüşme), 6 tanık; akşamlar INV_AKSAM1/2S/2L/3; INV_GECE_1…4 + INV_GECE |
| Bölüm 3 · 2. celse | H1_00K, H1_00, H1_00B, H1_01, H1_02Q, H1_03, H1_04, H1_04V, H1_05, H1_05R, H1_06, H1_06T…T6, H1_07, H1_08 | Koridor seçimi, açılış, iddianame, savunma, sanığa sorular, telkin itirazı, katılan ve sanığın diyeceği, taksicinin çapraz sorgusu (N1–N5), kısa ara, CMK 67/5 itirazı (kabulse bulunan eksikler H1_06T zincirinde tek tek sayılır; soyutsa gerekçeli ret), ara karar + adli kontrol, merdivenler |
| Bölüm 4 · Ara | ARA_GIRIS_1/2, ARA_GIRIS, ARA_HUB (2 gün × 4 EP, yığınsız) | ARA_EDR, ARA_HEYET (belge), ARA_VOLKAN, ARA_AYTEN, ARA_SERKAN, ARA_HAMDI, ARA_NECATI, ARA_NALAN, ARA_SANAYI, ARA_SUC; ARA_CIKARIM, ARA_LEYLA; ARA_DAY_END → ARA_AKSAM; ARA_SON_1…3 → ARA_SON |
| Bölüm 5 · 3. celse | T_00Y, T_00K, T_00G1/2, T_00, T_00S, T_01, T_02, T_03, T_04, T_05, T_05D, T_05N, T_06, T_07, T_08, T_09P, T_09, T_09R, T_10, T_11 | Sabah, koridor, savcılık yazısı/dilekçeler, sanığın diyeceği, teknisyen (TH1–TH4), telkin itirazı, bilirkişi (C1–C4), heyet başkanı, polis, delillerin tartışılması, mütalaa + cevap, dayanaklar, esas savunma, cevaplar, son söz |
| Karar | R_KARAR + sonuç başına `epilogue`; T_COKUS (♥0) | |

Celseler: `cs_2` (2. celse) ve `cs_3` (3. celse). Asliye ceza, tek hâkim; kürsüde zabıt kâtibi.

## 4. Mekanikler (kılavuz §4 eşlemesi)

| Mekanik | Node | Not |
|---|---|---|
| Soruşturma hub'ı, EP, gün sonu | INV_HUB, INV_DAY_END (DECISION) | 17 EP'lik etkinlik, 16 EP: biri dışarıda kalır; gecikmeli teslimler gün sonunda ve INV_GECE_1'de |
| Ara hub'ı (yığınsız) | ARA_HUB, ARA_DAY_END | 10 etkinlik, 8 EP; bazıları bulguya bağlı açılır |
| Görüşme (konu × ton) | INV_GORUSME | 16 + 8 dk; 7 konu + 3 fakta bağlı konu (TP_ONUNDE, TP_DARBE, TP_ABS) |
| Serbest konuşma | INV_T_NEC/SER/HAM/SEV/HAS/AYT, ARA_* | etik tuzaklar (telkin, para, fotokopi, katılanı suçlama) |
| Olay yeri araması | INV_ARAMA, INV_ARAMA2, INV_ARAMA3 | büyüteç 6/5/6; dikkat dağıtıcı nesne −10 |
| Belge incelemesi | INV_RAPOR, INV_TUTANAK, INV_OTOPSI, INV_BUFE, INV_SINYAL, ARA_EDR, ARA_HEYET | 7 belge, alet × satır; lens (büfe kare kare) |
| Çıkarım tahtası | INV_CIKARIM (6 tarif), ARA_CIKARIM (+2 tarif) | çeldiriciler: karanfiller, yağmur, yorgunluk, boya (INV'de), sırt (INV'de) |
| Rapora itiraz | H1_06 R_ITIRAZ → H1_06T…T6 | `itiraz_dayanak` = en az 3 somut eksik (rapor_plan/iz/kopya/cam/yorum, ded_fren/cam/yukseklik/ariza), en az biri saha çıkarımı; `itiraz_guclu` ≥ 5 eksik (+150, +1 ikna). Soyut itiraz: −40, ♥−1, gerekçeli ret |
| Tanık ifadesi | H1_05 (Necati), T_03 (Hamdi), T_05 (bilirkişi) | bastır / sun / itiraz (g_kanaat, g_yorum) |
| A–D kararları | BR_01, BR_01C, H1_03, H1_06, H1_07, T_02, T_08, T_09 … | |
| Gecikmeli delil | ev_sinyal_log, clue_uedas, ev_edr, ev_atk, ev_boya, ev_heyet, ev_savcilik, ev_far_parca | |
| Mentor danışması | INV_LEYLA (günde bir), ARA_LEYLA | koşullu, en uygun ipucu |
| Çöküş | tg_cokus → T_COKUS | ♥0 |

## 5. Delil zinciri

| Kimlik | Tür | Bulunma | Ne işe yarar | Sunulabilir |
|---|---|---|---|---|
| ev_bilirkisi, ev_hts, ev_volkan_ifade, ev_necati_ifade | EVIDENCE | başlangıç | savcılık; yanlış sunum cezalı (ev_necati_ifade N3'te doğru) | evet |
| ev_tutanak, ev_otopsi | EVIDENCE | başlangıç | C3 (tutanak), C4 kısmi (otopsi), N2 kısmi | evet |
| clue_fren | CLUE | sahne ob_fren / tutanak t_iz | ded_fren | — |
| clue_cam | CLUE | sahne ob_cam / tutanak t_bulgu | ded_cam; Ayten'i açar | — |
| clue_arka | CLUE | sahne ob_arka | ded_goremez | — |
| clue_far, clue_necati_yer, clue_yagmur | CLUE | tutanak (far, tanık, hava) / sahne ob_far / Necati | ded_cam, ded_goremez; yağmur çeldirici | — |
| clue_kirik56, clue_sirt, clue_boya | CLUE | otopsi | ded_yukseklik, ded_olum; boya → DIL_BOYA | — |
| clue_tampon44, clue_abs, ev_multimedya | CLUE/EVIDENCE | otopark | ded_yukseklik, ded_fren; N5 | multimedya evet |
| clue_kabin, clue_bufe_kamera, clue_cicek | CLUE | kavşak bugün | ded_ariza; büfeyi açar; çeldirici | — |
| clue_is_emri | CLUE | Hamdi (HQ_ISEMRI) / sinyal günlüğü | ded_ariza | — |
| ev_bufe; clue_titreme, clue_tek_stop | EVIDENCE/CLUE | Sevim (gönüllü teslim) → büfe belgesi | ded_saat, ded_arac | ev_bufe evet |
| ev_sinyal_log | EVIDENCE | DIL_SINYAL → gün sonu | N2 kısmi, TH1/TH2/TH4B, C1 | evet |
| clue_uedas | CLUE | DIL_UEDAS → gün sonu | ded_saat | — |
| ev_edr | EVIDENCE | DIL_EDR ∨ kabul edilen R_ITIRAZ (`h1_itiraz`) → ARA girişi | C2, C4 kısmi, ARG_EDR, D_HIZ | evet |
| ev_atk | EVIDENCE (combinable) | DIL_ATK ∨ kabul edilen R_ITIRAZ → ARA girişi | ded_olum, C4, ARG_ATK | evet |
| ev_boya | EVIDENCE (combinable) | DIL_BOYA ∨ (kabul edilen R_ITIRAZ ∧ clue_boya) → ARA girişi | ded_arac, C3 kısmi | evet |
| ev_heyet | EVIDENCE | kabul edilen R_ITIRAZ → ARA 1. gün sonu | C1; tali kusur paragrafı (contra_heyet) | evet |
| ev_sesli | EVIDENCE | ARA_SERKAN (saygı yolu, Serkan'ın kendi teslimi) | TH4, C1 | evet |
| ev_far_parca | EVIDENCE | ARA_AYTEN (AY_SAVCI) → 3. celse | C3 | evet |
| ev_savcilik | EVIDENCE | ARA_SUC (SU_DAYANAKLI, ded_arac gerekir; garaj yoksa) → 3. celse | C4, 223/2-b | evet |
| ev_garaj | EVIDENCE (EXCLUDABLE) | ARA_SANAYI (SA_GARAJ, etik ihlal) | PS_GARAJ cezası; hükme esas alınmaz; ETIK sonu ya da disiplin epilogu | evet |

**Çıkarımlar:** ded_fren (fren + ABS), ded_cam (cam + sağlam farlar), ded_yukseklik (56 cm + 44 cm), ded_goremez (sinyalin sırtı +
tanığın yeri), ded_ariza (kabin etiketi + iş emri), ded_saat (titreme + UEDAŞ), ded_olum (ATK + sırt sıyrıkları, ara),
ded_arac (boya raporu + tek stop, ara). Çeldirici kombinasyonlar −50 (aynı çift bir kez).

**Ters köşe hazırlığı:** ikinci araç — fren izi, cam, 56 cm kırık, boya, kamera, Necati'nin "minibüs"ü, Sevim'in iki freni,
Volkan'ın "alçaktı" ve tek kırmızı lambası; sinyal arızası — kabin etiketi, iş emri, ihbar, UEDAŞ, Fadime'nin "ışıklar delirdi"si,
Serkan'ın "annem kırmızıda geçmezdi"si, sesli mesaj, sinyalin siyah sırtı.

## 6. Çelişkiler (çapraz sorgu)

| Tanık | İfade | Bastır | Doğru sunum (bayrak) | Kısmi |
|---|---|---|---|---|
| Necati (H1_05) | N1 kırk yıllık şoför | övünme | — | — |
| | N2 “kırmızıda daldı” | “hangi lamba?” | ded_goremez → contra_n2 | ev_sinyal_log, ded_ariza, ev_tutanak |
| | N3 “çarptığını gördüm” | gümbürtü | ev_necati_ifade (bastırdıktan ya da durakta öğrendikten sonra) → contra_n3; g_kanaat | — |
| | N4 “başka araç yoktu” | minibüs | ded_saat → contra_n4 | ded_fren, ded_cam, ded_yukseklik, ev_bufe |
| | N5 “telefonla konuşuyordu” | “durunca” | ev_multimedya → contra_n5; g_kanaat | — |
| Hamdi (T_03) | TH1 “sağlamdı” | | ev_sinyal_log → contra_h | — |
| | TH2 “kayıtta arıza yok” | | ev_sinyal_log (UYARI 07 bulunmuşsa) → contra_h | — |
| | TH3 “rutin bakım” | | ded_ariza → contra_h | — |
| | TH4 “kimse şikâyet etmedi” | hastane | ev_sesli → contra_h; g_kanaat | ev_sinyal_log (ihbar) |
| Bilirkişi (T_05) | C1 “kırmızı; bilinçli taksirdir” | plan | ev_sinyal_log, ev_heyet, ded_ariza, ev_sesli → contra_c1; **g_yorum (CMK 67/3)** | — |
| | C2 “18 m iz = 68 km/s” | | ded_fren, ev_edr → contra_c2 | — |
| | C3 “başka araç izi yok” | “eski kaza” | ded_cam, ev_far_parca, ev_tutanak → contra_c3; g_kanaat | ev_boya, ded_saat, ev_bufe, ded_arac |
| | C4 “sağ ön köşesiyle” | | ded_yukseklik, ev_savcilik, ev_atk, ded_olum → contra_c4 | ev_otopsi, ev_edr |

Heyet raporundaki “tali kusur” paragrafı ARA_HEYET'te EDR ile karşılaştırılarak çürütülür (contra_heyet); T_05N'de heyet
başkanı bu paragraftan geri adım atar.

## 7. Sonuçlar (öncelik sırasıyla)

| Öncelik | Kimlik | Sınıf | Koşul | Ceza | XP |
|---|---|---|---|---|---|
| 1 | BERAAT_B | ACQUITTAL (223/2-b) | ¬çöküş ∧ `gercek_neden` (T09_B: ded_olum ∧ ikinci_arac ∧ ev_savcilik ∧ ¬garaj) ∧ kusur_yok ∧ ikna ≥ 8 ∧ final ≥ 9.500 | yok | 1,2 |
| 2 | BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş ∧ (`supheden` ∨ `gercek_neden` ∨ `arg_atk`) ∧ kusur_yok ∧ findings (≥5 çelişki) ∧ ikna ≥ 6 ∧ final ≥ 9.000 | yok | 1,0 |
| 3 | INDIRIM | RECHARACTERIZED | ¬çöküş ∧ ¬`arg_atk` ∧ `inv_derin` (≥2 saha çıkarımı) ∧ (`mutalaa_basit` ∨ (`arg_basit` ∧ (kusur_yok ∨ `arg_edr` ∨ contra_c2))) ∧ final ≥ 5.000 | 1 yıl 8 ay → 600 gün APC, ehliyet 6 ay | 0,85 |
| 4 | ETIK | CONVICTION | `etik_garaj` ∧ ¬kusur_yok (garaja izinsiz giriş ve kırmızı ışık iddiası hukuka uygun delillerle çürütülmedi) | 3 yıl 9 ay; fotoğraflar dışlanır; savcılığa ve baroya bildirim | 0 + etik kartı |
| 5 | MAHKUMIYET | CONVICTION | her zaman (çöküş dahil) | 3 yıl 9 ay, ehliyet 2 yıl | 0,6 |

**Garaj (etik_garaj) diğer sonuçlarla:** hüküm hukuka uygun delillerden kurulur. BERAAT_E, INDIRIM ve MAHKUMIYET gerekçesine
"garaj fotoğrafları hükme esas alınmamıştır" eklenir ve epiloga disiplin bloğu (şikâyet, baro bildirimi, Leyla'nın kitapçığı)
eklenir. BERAAT_B garajla kurulamaz (T09_B ¬garaj ister; savcılık yazısı garajda gelmez).

`kusur_yok` = contra_n2 ∨ contra_h ∨ contra_c1 (kırmızı ışık iddiası kürsüde çöktü). `supheden` T09_E ile, yalnızca kusur_yok ∧
findings tutarsa kalkar. Mütalaa üç biçimde: beraat (ev_savcilik ∧ (ded_olum ∨ arg_atk)), basit taksir (kusur_yok ∧ (arg_edr ∨
contra_c2 ∨ arg_heyet)), bilinçli taksir.

## 8. Skor

- Döküm satırları: Delil toplama (ARAŞTIRMA + DELİL ANALİZİ), Çapraz sorgu (SORGULAMA), İtiraz isabeti (USUL + HUKUKİ BİLGİ),
  Savunma (SAVUNMA STRATEJİSİ), Hatalı delil. Bonus: güvenilirlik × 100.
- Tutarlar Dava #07 ölçeğinde: sahne nesnesi +40/+60, dikkat dağıtıcı −10; belge isabeti +50…+200, ıska −20; tarif +300,
  yanlış çift −50; bastır +10/+25; doğru sunum +200/+300, kısmi +100/+150, yanlış ♥−1 ve −150; itiraz +50…+120, dayanaksız
  ♥−1 ve −50; esas savunma `strategyAmount(200)` (uyumlu strateji ×1,5 / ×1,2 / ×0,8); dayanak ±40; etik ihlaller −30…−100.
- Eşik çubuğu: Mahkûmiyet 0 · İndirim 5.000 · Beraat 9.000 (BERAAT_B ayrıca 9.500). `scaleMax` 12.000 (simülasyonda görülen en
  yüksek final 12.060).

## 9. Golden path'ler

| Ad | Strateji | Sonuç | Final | Aksiyon | Süre |
|---|---|---|---|---|---|
| TIPIK | Kusur itirazı | BERAAT_E | 11.385 | 210 | 101,7 dk |
| G_B | Masumiyet | BERAAT_B | 12.060 | 217 | 101,6 dk |
| G_ETIK | Masumiyet (garaj; kırmızı ışık kürsüde çürütülmez) | ETIK | 9.295 | 206 | 96,2 dk |
| G_ETIK_E | Masumiyet (garaj; T09_B garaj yüzünden düşer, ATK + şüphe) | BERAAT_E + disiplin epilogu | 11.060 | 216 | 101,2 dk |
| G_I | Terditli | INDIRIM | 6.365 | 179 | 80,5 dk |
| G_M | Kusur itirazı (kötü avukatlık) | MAHKUMIYET | −200 | 142 | 64,6 dk |
| W | Kusur itirazı (çöküş, 3. celsede) | MAHKUMIYET | 4.700 | 149 | 72,6 dk |
| NEG_GUN1 | Negatif test: soruşturma atlanır, ilk gün duruşma | MAHKUMIYET | 770 | 44 | 34,7 dk |

NEG_GUN1 bir sonuç yolu değil, erken çözüm için negatif testtir (60 dk tabanı ona uygulanmaz): soyut itiraz reddedilir,
heyet/ATK/EDR gelmez, kırmızı ışık çökmez → mahkûmiyet.
Pencereler ölçülen finalin ±%5'i. Bütün yollar `case:validate` ile oynatılır; kapsam node/seçenek/kural/delil %100.

## 10. Erken çözüm denetimi

İnceleme sonrası (devil's advocate) yeniden ölçüldü. Yöntem: golden path'ten aksiyon blokları silerek yerel en kısa yolu
arayan küçültme (24'lük bloklardan teke, reddedilen aksiyonlar atlanır) ve "ilk gün duruşmaya git" tohumları (prolog +
H_DURUSMA + golden path'in kalanı).

| Hedef | Tohum | En kısa | TIPIK'e oran | Süre |
|---|---|---|---|---|
| Beraat (B ∨ E) | G_B | 138 aksiyon (BERAAT_E) | %66 | 69,1 dk |
| Beraat (B ∨ E) | TIPIK | 155 aksiyon | %74 | — |
| Beraat (B ∨ E) | G_ETIK_E | 165 aksiyon | %79 | — |
| Beraat / İndirim | ilk gün duruşma (TIPIK, G_I tohumları) | ulaşılamıyor → MAHKUMIYET | — | — |
| İndirim | G_I | 98 aksiyon | %47 | 49,1 dk |

- **Kapatılan kısa yol:** önceki sürümde R_ITIRAZ her durumda kabul ediliyordu; ilk gün duruşmaya giden oyuncu heyet, ATK ve
  EDR'yi bedavaya alıp 73 aksiyonda İNDİRİM'e ulaşıyordu. Şimdi itiraz `itiraz_dayanak` (en az üç somut eksik, biri sahadan)
  ister; aksi hâlde CMK 67/5 gerekçeli ret, −40, ♥−1. İNDİRİM ayrıca `inv_derin` (≥2 saha çıkarımı), kürsüde hız iddiasının
  çürütülmesi (kusur_yok ∨ arg_edr ∨ contra_c2) ve 5.000 final ister. NEG_GUN1 golden path'i ilk gün duruşmanın mahkûmiyetle
  bittiğini sabitler.
- **En kısa beraatin içeriği:** gece araması, rapor, tutanak, kavşak, otopsi, dilekçe (ATK), otopark, tanıklar, tahtada
  dört çıkarım, 2. celsede kabul edilen itiraz, arada heyet + EDR + ATK × sırt (ded_olum), 3. celsede kırmızı ışığın
  çökmesi ve en az beş çelişki. Kısa yol yok: beraat; kusur_yok, findings (≥5), ikna ≥ 6 ve 9.000 finali birlikte ister.
- **İndirim:** bilerek "kısmi kazanç" olarak daha erişilebilir bırakıldı (yaklaşık iki soruşturma günü + iki celse). Yine de
  soruşturmayı atlayan yol kapalıdır.
- **Sızıntı denetimi:** ikinci araç ve sinyal arızası hiçbir anlatıcı ya da iç ses satırında önceden söylenmez. Soğuk
  açılışta "yerde mi" kalktı ("bir poşet mi, bir gölge mi"); Volkan'ın "Ayakta biri değildi sanki"si ve sert tondaki "Yerdeydi belki"si kalktı ("Alçaktı" tohumu kalır). Tampon nesnesi
  yalnızca ölçümü verir (44 cm, yatay iz); yorum tahtadaki ded_yukseklik geri bildirimindedir. clue_sirt ve clue_kirik56
  açıklamaları olgusaldır. INV_AKSAM3'teki sayılmış "altı saniye" kalktı. Strateji menüsünde "İlliyet: ölümün gerçek nedeni
  başka" yerine genel "Masumiyet" var; Leyla'nın illiyet dersi göz kırpmadan, ispat yüküne bağlanır. Doğrulayıcı LEAK
  denetimi temiz.
- **Hüküm gerekçeleri ve ispat yükü:** MAHKUMIYET ve ETIK'teki `arg_atk` gerekçesi de pozitif tespite çevrildi (ATK
  raporu aracı belirlememiş; mahkeme raporu diğer delillerle CMK 217/1 uyarınca tartıp illiyeti kabul eder). "Başka aracın
  varlığı ispatlanamadığından" ifadesi kalktı (bkz. docs/legal/kirmizi-isik.md §5/15).
- **Seçenek dengesi:** iyi ve kötü seçeneği olan 32 setin 8'inde (%25) doğru seçenek en uzun etiket; madde numarası
  yanlış seçeneklerde de geçer (K_SUS, O_SUS, R_CIKAR, AK_BERAAT, O2_SALDIR, ARG_DUYGU, M_CIKAR).

## 11. Ölçüm

`npm run case:duration -- kirmizi-isik` (2026-10-20, inceleme düzeltmeleri sonrası):

```
TIPIK         101.7 dk   14524 sözcük   210 aksiyon  BERAAT_E (11385)
G_B           101.6 dk   14379 sözcük   217 aksiyon  BERAAT_B (12060)
G_ETIK         96.2 dk   13602 sözcük   206 aksiyon  ETIK (9295)
G_ETIK_E      101.2 dk   14329 sözcük   216 aksiyon  BERAAT_E (11060)
G_I            80.5 dk   11265 sözcük   179 aksiyon  INDIRIM (6365)
G_M            64.6 dk    9077 sözcük   142 aksiyon  MAHKUMIYET (-200)
NEG_GUN1       34.7 dk    5445 sözcük    44 aksiyon  MAHKUMIYET (770)
W              72.6 dk   10384 sözcük   149 aksiyon  MAHKUMIYET (4700)
==> TİPİK YOL (TIPIK): 101.7 dk  ✓ süre hedefte
==> KAPI: ✓ GEÇTİ
```

`npm run case:validate -- kirmizi-isik --max-ms 3000000` (makine yükü nedeniyle süre sınırı yükseltildi; varsayılan
600 sn'de yoğun makinede SIMULATION_ABORTED alınabilir): **PASSED — 0 hata, 1 uyarı (SIMULATION_INCOMPLETE, uzun davada
beklenen)**; ~60.000 durum, 400 yürüyüş; bütün sonuçlara ulaşıldı; kapsam node 107/107, seçenek 236/236, kural 77/77,
delil 44/44; golden path 8/8; softlock, çıkmaz, sızıntı yok.

Paket toplamı: 1.436 satır, 17.951 satır sözcüğü; etiket, geri bildirim, belge ve hüküm metinleriyle ~26.500 sözcük. En
uzun satır 203 karakter.

## 12. Görseller ve sprite'lar

- Sahneler: `content/src/kirmizi-isik/scenes/{kavsak-gece,kavsak-sabah,otopark}.html` → `npm run case:scenes -- kirmizi-isik`
  → `content/cases/kirmizi-isik/assets/scenes/*@4x.png` (344 × 300, ×4).
- Yeni karakterler (Volkan, Gül, Necati, Serkan, Hamdi, Sevim, Nalan, Rüstem) `content/src/kirmizi-isik/sprites.ts` içinde
  satır içi `SpriteDef` olarak tutulur. Önce kılavuzdaki gibi `content/shared/sprites/kirmizi-isik-*.json` olarak yazılıp
  `case:sprite-preview` ile denetlendi; ancak `tools/content/test/extract-sprites.test.ts` o dizinin yalnızca tasarımdan
  çıkarılan 21 ortak sprite'ı içermesini şart koştuğundan (content-tools kapısı) dava kaynağına taşındı. Ortak sprite'lar
  (mentor, avukat_cubbe, hakim, savci, rakip, mubasir, polis, bilirkisi, anne, katip) `sharedSprite` ile kullanılır.
