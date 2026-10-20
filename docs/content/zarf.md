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

## 4. Usul kararları (A–D)
H1_02 savcının yönlendirici sorusu · H1_03 kayıtların okunması (CMK 206/2-a: iki çıkarım birlikte → `red_14`, `red_9`) ·
H1_05 talepler ve tahliye (≥ 2 çelişki/ret → `halil_tahliye`) · T_04 vasıf değişikliği ve ek savunma (CMK 226) · T_05 mütalaaya
cevap · T_07 esas savunma · T_08 son söz. Etik kararlar: TAV_B (inkâr tavsiyesi), BAY_B/BAY_C (muhbire beyan yazdırma /
dikte), MUZ_BASKI, ARAK_C (tanığı izleme), HK2_B (koridorda tanıkla temas).

## 5. Sonuçlar ve koşullar

| Sonuç | Sınıf | Koşul | Eşik |
|---|---|---|---|
| ETIK | CONVICTION | `illegal_used` ∨ `tanik_etkileme` ∨ `ethics ≥ 2` | — |
| BERAAT_B | ACQUITTAL (223/2-b) | ¬çöküş ∧ gerçek fail kanıtlandı (`sinan_ifsa` ∨ `bayram_ifsa` ∧ zarf/tek kişi) ∧ `gercek_fail` (T07_A) ∧ `kayit_disi` ∧ pers ≥ 7 | 12.000 |
| BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş ∧ `kayit_disi` ∧ `zarf_suphe` ∧ pers ≥ 5 | 10.000 |
| GOREV | RECHARACTERIZED (257/1 + HAGB) | ¬çöküş ∧ `terditli` (T07_C) | 3.000 |
| MAHKUMIYET | CONVICTION (252/2) | varsayılan; çöküşte savcının cümlesi | — |

Yüklemler: `kayit_disi` = (red_14 ∨ contra_k1) ∧ (red_9 ∨ contra_k5 ∨ obj_k5); `zarf_suphe` = en az ikisi
{contra_k3, contra_b3, contra_b4, contra_b5}. Eşik çubuğu 0 / 3.000 / 10.000; `scaleMax` 11.000.

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
| **TIPIK** | BERAAT_E | 11.395 | 13.266 | 204 | **94,1 dk** |
| G_B | BERAAT_B | 13.045 | 13.875 | 217 | 98,8 dk |
| G_E2 (kısmi K3, muhbir adı söyler, Sinan çağrılmaz) | BERAAT_E | 11.005 | 13.370 | 205 | 94,8 dk |
| G_GOREV | GOREV (257/1 + HAGB) | 4.545 | 10.900 | 153 | 75,9 dk |
| G_M | MAHKUMIYET | 565 | 9.006 | 124 | 62,4 dk |
| G_ETIK | ETIK | 11.185 | 13.059 | 204 | 92,9 dk |
| W | MAHKUMIYET (çöküş) | 8.165 | 11.778 | 190 | 84,4 dk |

Paket metni: ~20.800 sözcük ekran metni (satır `text` alanları ~18.700).

**Erken çözüm denetimi:** TIPIK yolundan aksiyon blokları silinerek beraate ulaşan yerel en kısa yol arandı
(`enumerateActions`/`act` ile oynatma): **168 aksiyon** (tipik yolun %82'si). Beraat; karar belgesinin üç satırı, tutanak,
ifadeler ve tahtadaki çıkarımlar, CMK 206 itirazı, ara evresinde cihaz raporu ve Bayram'ın kürsüde çözülmesi olmadan
gelmez (`kayit_disi` ∧ `zarf_suphe` ∧ pers ≥ 5 ∧ final ≥ 10.000).

**Gizem denetimi:** tipik yolun satırları döküldü; Sinan Kaplan'ın fail olduğu ARA_CIKARIM'daki `ded_tek_kisi` /
`ded_kameradaki` tariflerinden ve çay defterinden önce hiçbir satırda söylenmez. Önceden ekilen zararsız ipuçları: nane
şekeri (soğuk açılışta koku, komşunun çocuğu, Devir-2 masası), akıllı saat, "arşivdeydim", 214'ün iki kişilik oda olması.
Seçenek etiketlerinden isim çıkarıldı (BAY_C, MUZ_BASKI).

## 9. Doğrulayıcı
`npm run case:validate -- zarf --max-ms 3500000`: **PASSED — 0 hata**, 65.176 durum, 400 yürüyüş, bütün sonuçlara ulaşıldı;
golden path 6/6 (G_E2 sonradan eklendi). Kalan uyarılar: SIMULATION_INCOMPLETE (uzun davada beklenen) ve G_E2 ile kapsanan
T_02B / PS_K3_P. Not: bu ölçüm, makinede başka iş akışı ajanları çalışırken (yük ortalaması ~25, 8 çekirdek) yapıldı;
varsayılan 600 sn bütçesi bu yükte aşıldığı için süre bütçesi artırıldı. Durum başına maliyet Dava #02 ile aynı düzeydedir
(golden path boyunca ölçüm: 204 durum 3,9 sn; #02 200 durum 5,9 sn).
