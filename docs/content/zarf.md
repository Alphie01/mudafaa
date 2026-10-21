# Dava #12 "Zarf" — Dava Tasarımı

> Anlatı kaynağı: `docs/content/zarf-hikaye.md` (hikâye kitabı). Hukuki notlar: `docs/legal/zarf.md`.
> Kaynak: `content/src/zarf/` (yazım kiti + satır DSL'i) → `content/cases/zarf/` (`npm run case:build -- zarf`).
> Rütbe: KIDEMLI · Zorluk 4/5 · Bursa 5. Ağır Ceza Mahkemesi (heyet).

## 1. Gerçek (oyuncunun kurması gereken)
Tapu kontrol memuru Halil Ekinci, Ateşoğlu İnşaat'ın on bir şerhli dosyasını durdurdu ve bir deftere yazdı. Devir Servisi-2
memuru Sinan Kaplan (dosyaları parayla hızlandıran) onu "masasından kaldırmak" için borçlu takipçi Bayram Öz'ü polise
"memur zorla para istiyor" diye gönderdi. Polis kendi parasıyla kontrollü teslimat kurdu. 12 Mart 10.35'te Sinan, kendi dahilisi
214'ten Halil'i "Müdür Hanım çağırıyor" diye odasından indirdi; Bayram kayıt cihazını 10.39.12'de elle durdurdu ve zarfı
koridorda Sinan'a verdi; Sinan 10.41'de zarfı Halil'in kilitsiz üçüncü çekmecesine bıraktı. Polis 10.44'te boş odaya girdi,
Halil 10.46'da döndü. İddianamenin iki kaydı hukuka aykırıdır: #14 kararın süresi bittikten sonra, #9 kararda olmayan
sanığın hattından alınmıştır. Halil'in tek kusuru: yirmi yedi yılda bir kez, yetkisi olmadan Bayram'a öncelikli randevu vermesi.

## 2. Delil zinciri

| Halka | Delil / ipucu (kimlik) | Nerede | Çıkarım |
|---|---|---|---|
| Kayıtların kapsamı | `clue_sure` + `clue_kayit14` | INV1_KARAR (chk k3, mag k6) | `ded_sure_disi` |
| | `clue_hedef_hat` + `clue_kayit9` | INV1_KARAR (mag k2, mag k5) | `ded_hat_disi` |
| Sahte çağrı | `clue_takvim_214` + `clue_rehber_214` | INV1_ODA + INV1_KORIDOR | `ded_sahte_cagri` |
| Boş oda | `clue_saat_tutanak` + `clue_kayit_durdu` | INV1_TUTANAK (cmp t4, mag t2) | `ded_bos_oda` |
| İrtikabın çöküşü | `clue_dosya_devir2` + `clue_ihbar_icbar` | INV1_MUDUR + INV1_IFADE | `ded_yetkisiz` |
| Muhbirin iki hikâyesi | `clue_ihbar_icbar` + `clue_savcilik_anlasma` | INV1_IFADE | `ded_iki_hikaye` |
| Hedef | `clue_inat` + `clue_uyari_notu` | INV1_KARAR (k4) + INV1_ZEHRA | `ded_hedef` |
| Kışkırtma | `ev_para` (başlangıç) + `fact_para_emniyet` | Komiser | K2 çürütmesi |
| Cihaz | `ev_cihaz` → `clue_manuel`, `clue_fisilti` | ARA_CIHAZ (teslim: dl/rq cihaz) | B4, B5 |
| Zarfın kaynağı | `clue_barkod` + `clue_zimmet` | INV1_TUTANAK + ARA_ARSIV | `ded_zarf_kaynagi` |
| Tek masa | `clue_214_cagri`/`clue_takvim_214` + `clue_izin_gulay` | ARA_SANTRAL (teslim: dl/rq santral) | `ded_tek_kisi` |
| Kamera | `ev_kamera` → `clue_kare_saat`, `clue_kol_saat` + `clue_sinan_saat` | ARA_KAMERA + INV1_SINAN | `ded_kameradaki` |
| Alibi | `clue_cay_defteri` + `clue_sinan_arsiv` | ARA_MUZAFFER + INV1_SINAN | `ded_alibi` |
| Çıkar | `ev_kirmizi_defter` | ARA_ARSIV (defterin yeri: TP_DEFTER güven ≥ 55 ya da AH_DEFTER) | S4 |
| Çift yönlü | `ev_sira_disi` | INV1_MUDUR | yüzleşme, terditli savunma; tanığa karşı sunulursa ceza |

Çeldiriciler (tahta): `clue_kilit`, `clue_kamera_var`, `clue_zarf_stok`, `clue_manuel`, `clue_fisilti`, `clue_kare_zarf`,
`clue_kare_saat` (tarifsiz). Yanlış çift −50.

## 3. Çelişkiler (duruşma)

| Tanık · ifade | Çürüten | Bayrak |
|---|---|---|
| Komiser K1 "kuvvetli deliller" | `ded_sure_disi` | `contra_k1` |
| K2 "parayı muhbir getirdi" | `ev_para` | `contra_k2` (kışkırtma) |
| K3 "sanık başındayken" | `ded_bos_oda` (tam) / `ev_tutanak` (kısmi) | `contra_k3` / `k3_kismi` |
| K4 "olağandır" | itiraz: kanaat | `obj_k4` |
| K5 "kendi telefonunda" (bastırınca) | `ded_hat_disi` / itiraz: hukuka aykırı delil | `contra_k5` / `obj_k5` |
| Bayram B1 "dosyamı bekletti" | `ded_yetkisiz` | `contra_b1` |
| B2 "anlaştık; herkesten aldığı bilinir" | `ded_iki_hikaye` / itiraz: duyum | `contra_b2` / `obj_b2` |
| B3 "kendi elimle verdim" | `ded_bos_oda`, `ev_kamera` | `contra_b3` |
| B4 "kendiliğinden kapandı" | `ev_cihaz` (manuel durdurma bulunduysa) | `contra_b4` |
| B5 "koridorda birine verdim" (B3 + B4/fısıltıdan sonra) | `ded_tek_kisi` / `ded_zarf_kaynagi` / `ded_kameradaki` | `contra_b5`, `bayram_ifsa` |
| Sinan S1 "arşivdeydim" | `ded_alibi` / `ded_kameradaki` | `contra_s1` |
| S2 "aramadım" | `ev_santral` / `ded_tek_kisi` | `contra_s2` |
| S3 "zarflar ortak dolaptan" | `ded_zarf_kaynagi` | `contra_s3` |
| S4 "ne çıkarım olur; abi yorgundu" | `ev_kirmizi_defter` / itiraz: kanaat | `contra_s4` / `obj_s4` |

Sinan'ın çözülmesi: dört çelişkiden en az üçü → `sinan_ifsa` (T_02Y; CMK 48 ile susar).

## 4. Usul kararları (A–D) ve oyun kuralları
H1_02 savcının yönlendirici sorusu · H1_03 kayıtların okunması (CMK 206/2-a: iki çıkarım birlikte → `red_14`, `red_9`) ·
H1_05 talepler ve tahliye (≥ 2 çelişki/ret → `halil_tahliye`) · T_04 vasıf değişikliği ve ek savunma (CMK 226) · T_05 mütalaaya
cevap · T_07 esas savunma (parçaları T_07P1…P4/S1…S3 karar node'larında, o oyunda kurulan olguya bağlı) · T_08 son söz.
Etik kararlar: TAV_B (inkâr tavsiyesi), BAY_B/BAY_C (muhbire beyan yazdırma / dikte), MUZ_BASKI, ARAK_C (tanığı izleme),
HK2_B (koridorda tanıkla temas).

Oyun kuralları (erken çözümü önleyen yapı, Dava #07 ile uyumlu):
- **Celse günü sabittir.** `GO_H1` 3. günün eylem puanı bitince ve Leyla'ya danışılmışsa; `GO_T` ara evresinin 2. günü
  eylem puanı bitince ve Leyla'ya danışılmışsa açılır. Yumuşak kilit olmasın diye her iki hub'da 1 EP'lik, en çok üç kez
  kullanılabilen yedek etkinlik var (`A_DOSYA` "Dosyayı baştan oku", `A2_DOSYA` "Duruşma hazırlığı"); metinleri o ana kadar
  kurulan zincire göre değişir.
- **Boş ziyaret yok.** Görüşmelerden (Müdür, Komiser, Zehra, Devir-2, Muzaffer, ara evresinde Halil) en az bir soru
  sorulmadan; ara evresindeki sahne/belgelerden (kamera, arşiv, santral, cihaz) en az bir ayrıntıya bakılmadan çıkılamaz.
- **Önce bastır, sonra sun.** Komiser, muhbir ve Devir-2 memurunun çürütülebilir ifadelerinde doğru belge ancak ifadeye
  bastırıldıktan sonra işler; erken sunum cezasız geri çevrilir (`PS_*_ERKEN`: "önce sorunuzu sorun").

## 5. Sonuçlar ve koşullar

Suçluluk skora bağlanmaz. Beraat, savcının beraat mütalaası verdiği koşulla aynı koşula bağlıdır; skor yalnızca 2-b / 2-e
derecesini ve XP'yi belirler. Mahkûmiyet ve 257 gerekçe satırları o oyunda duruşmada kurulan olgulara göre koşulludur.

| Sonuç | Sınıf | Koşul | Eşik |
|---|---|---|---|
| ETIK | OTHER (beraat + baro) | ¬çöküş ∧ `tanik_etkileme` (BAY_C / MUZ_BASKI) ∧ (`beraat_kosul` ∨ gerçek fail) | — |
| BERAAT_B | ACQUITTAL (223/2-b) | ¬çöküş ∧ ¬tanık etkileme ∧ gerçek fail ∧ `gercek_fail` (T07_A) ∧ `kayit_disi` | 12.000 |
| BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş ∧ ¬tanık etkileme ∧ (`beraat_kosul` ∨ gerçek fail) | — |
| GOREV | RECHARACTERIZED (257/1 + HAGB) | ¬çöküş ∧ `terditli` (T07_C; `ev_sira_disi` gerekir) ∧ (contra_b1 ∨ contra_b2) ∧ (red_14 ∨ contra_k1 ∨ contra_b3 ∨ contra_k3) | 4.000 |
| MAHKUMIYET | CONVICTION (252/2) | varsayılan; tanık etkilemede ve etik ihlallerde epilog notu | — |

Yüklemler:
- `kayit_disi` = (red_14 ∨ contra_k1) ∧ (red_9 ∨ contra_k5 ∨ obj_k5)
- `oda_bos` = contra_k3 ∨ contra_b3 ∨ k3_kismi
- `ayrilis` (sahte çağrı) = q_takvim (H101Q_B; `ded_sahte_cagri` gerekir) ∨ contra_s2 (santral). Kamera tek başına yetmez:
  sanığın çıktığını gösterir, neden çıktığını göstermez.
- `zarf_suphe` = oda_bos ∧ ayrilis ∧ contra_b4
- `muhbir_coktu` = contra_b1 ∧ contra_b2
- `beraat_kosul` = kayit_disi ∧ zarf_suphe ∧ muhbir_coktu (T_05'te savcı da beraat ister)
- gerçek fail (`gercekProven`) = kayit_disi ∧ oda_bos ∧ ((sinan_ifsa ∧ contra_b2) ∨ (bayram_ifsa ∧ ¬etki_bayram ∧
  (ded_tek_kisi ∨ ded_zarf_kaynagi) ∧ muhbir_coktu))

Etik ihlaller (tanık etkileme dışında, `ethics ≥ 2`): hüküm hukuki bayraklara göre kurulur; her sonucun epilogunda Leyla'nın
uyarısı ve Deniz'in baroya kendi bildirimi yer alır. Tanık etkileme beraate yetmeyen bir oyunda olursa yönlendirilen beyan
gerekçede dışlanır ve epiloga savcılık/baro yazısı eklenir. Eşik çubuğu 0 / 4.000 / 12.000; `scaleMax` 11.000.

## 6. Skor
Kit ölçeği (Dava #07): sahne nesnesi +40/+60 (defter +80), ıska −10; belge +100/+150, yanlış alet −20; tarif +300, yanlış çift
−50; bastır +25; doğru sunum +300, kısmi +100, yanlış −150 ve ♥−1; itiraz +50, dayanaksız ♥−1 −50; usul hamleleri +20…+150;
esas savunma `strategyAmount(200, …)`; bonus `cred × 100`. XP: 223/2-b 1,2 · 223/2-e 1,0 · 257 0,85 · mahkûmiyet 0,6 · etik 0.

## 7. Node haritası
Hikâye kitabı §4. Parçalar: `40-briefing` (PROLOG…INV1_ILK), `50-inv1-hub` (hub, gün sonları, Leyla, dilekçe, tahta, gece
zinciri), `51-inv1-people` (Halil görüşmesi, tavsiye, Zehra, müdür, Devir-2, Komiser), `52-inv1-docs` (iki sahne, üç belge),
`60-hearing-1`, `70-ara` (yığınsız hub; iki belge, iki sahne, üç kişi, suç duyurusu, tahta, gece/sabah sahneleri, son gece
zinciri), `80-trial` (koridor, üç tanık, kısa ara, ek savunma, mütalaa, savunma, son söz, hüküm), `90-outcomes`, `95-report`.

## 8. Golden path'ler ve ölçüm (`npm run case:duration -- zarf`)

| Yol | Sonuç | Final | Sözcük | Aksiyon | Süre |
|---|---|---|---|---|---|
| **TIPIK** | BERAAT_E | 11.515 | 15.008 | 213 | **104,7 dk** |
| G_B | BERAAT_B | 13.165 | 15.317 | 226 | 107,7 dk |
| G_E2 (kısmi K3, muhbir adı söyler, Sinan çağrılmaz) | BERAAT_E | 11.475 | 14.917 | 214 | 104,3 dk |
| G_GOREV | GOREV (257/1 + HAGB) | 5.455 | 11.846 | 172 | 83,0 dk |
| G_M | MAHKUMIYET | 625 | 9.563 | 135 | 66,6 dk |
| G_ETIK | ETIK (beraat + baro) | 11.305 | 14.764 | 213 | 103,3 dk |
| W | MAHKUMIYET (çöküş) | 8.265 | 12.811 | 197 | 90,9 dk |

Paket metni: satır `text` alanlarında ~23.600 sözcük (seçenek etiketleri, geri bildirim ve rapor metinleriyle ~32.000).

**Erken çözüm denetimi** (sonuç koşulları hukuki zincire bağlandıktan sonra yeniden ölçüldü): golden path'lerden aksiyon
blokları silinerek (64→1) ve ardından `enumerateActions` ile her adımda alternatif eylem deneyip silerek (yerel arama, tek
süreç, 8 dk bütçe; yakınsadı) her sonuca ulaşan en kısa yol arandı:

| Hedef | Başlangıç | En kısa | Tipik yola oranı | Süre |
|---|---|---|---|---|
| Beraat (2-e/2-b/ETIK) | TIPIK | **134 aksiyon** | %63 (213) | ~74 dk |
| Beraat | G_E2 | 138 | %65 | 76,0 dk |
| ETIK | G_ETIK | 136 | %64 | 74,3 dk |
| BERAAT_B | G_B | 206 | %91 | 100,8 dk |
| GOREV | G_GOREV | 142 | — | 73,3 dk |
| MAHKUMIYET | W | 106 | — | 60,1 dk |

Beraat, `beraat_kosul` (kayıtlar ayıklandı ∧ boş oda ∧ sahte çağrı ∧ elle durdurulan cihaz ∧ muhbirin iki anlatısı
çöktü) olmadan gelmez; skor yalnızca 2-b/2-e derecesini belirler. Celse günlerinin sabit olması (eylem puanı bitmeden ve
Leyla'ya danışmadan duruşmaya gidilmez) ve boş ziyaret yasağı, bütün sonuç yollarını 60 dakikanın üstünde tutar.

**Gizem denetimi:** tipik yolun satırları döküldü; Sinan Kaplan'ın fail olduğu ARA_CIKARIM'daki `ded_tek_kisi` /
`ded_kameradaki` tariflerinden ve çay defterinden önce hiçbir satırda söylenmez. Soruşturma evresinde Sinan'a bağlı
tek adil ipucu kalır: bileğindeki akıllı saat (renk, sahne). Nane şekeri yalnız soğuk açılışta ve kapıdaki adamın hikâyesinde
geçer; Devir-2 odasında kase ve ikram yoktur (ARA'ya ertelendi). Sinan'ın mazereti kadastro paftalarıdır (Halil'in defter
için verdiği 1987 ciltleri değil); `clue_sinan_saat` ancak kamera karesindeki kol saati bulunduktan sonra deftere girer.
Şüphe uyandıran iç ses satırları kaldırıldı. Yeniden döküm (Ekim 2026): ARA öncesinde fail ima eden satır yok.
Seçenek etiketlerinden isim çıkarıldı (BAY_C, MUZ_BASKI).

## 9. Doğrulayıcı
`npm run case:validate -- zarf --max-ms 3500000`: **PASSED — 0 hata, 1 uyarı**, 67.193 durum, 400 yürüyüş, bütün sonuçlara
ulaşıldı; kapsam node 112/112, seçenek 210/210, kural 74/74, delil 51/51; golden path 7/7. Tek uyarı SIMULATION_INCOMPLETE
(uzun davada beklenen). PS_K3_P kuralı K3 sunumlarının önüne alınarak kapsandı. Not: bu ölçüm, makinede başka iş akışı ajanları çalışırken (yük ortalaması ~25, 8 çekirdek) yapıldı;
varsayılan 600 sn bütçesi bu yükte aşıldığı için süre bütçesi artırıldı. Durum başına maliyet Dava #02 ile aynı düzeydedir
(golden path boyunca ölçüm: 204 durum 3,9 sn; #02 200 durum 5,9 sn).
