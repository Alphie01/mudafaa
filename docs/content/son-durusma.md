# Dava #15 "Son Duruşma" — Dava Tasarımı

> Kaynak: `content/src/son-durusma/` (yazım kiti) → `content/cases/son-durusma/` (`npm run case:build -- son-durusma`).
> Hikâye kitabı: `docs/content/son-durusma-hikaye.md`. Hukuki notlar: `docs/legal/son-durusma.md`. Lineup: `docs/content/lineup.md` #15.
> Rütbe şartı ORTAK · zorluk 5/5 · üç celse, iki ara evre · dizi finali (Leyla'nın ters çerçevesi).

## 1. Logline ve tema

- **Tek cümle:** Mudanya'daki bir meyhanenin sahibi ofisinde bıçaklanır; bıçak aşçı yardımcısı Emir'in, baş tanık onu elinde
  bıçakla kaçarken görmüştür; Emir'in babası yirmi iki yıl önce Leyla Erdem'in "ikrar et" dediği müvekkildir — ve gerçek
  fail davanın baş tanığı, maktulün ortağı Tarık Sezer'dir.
- **Dramatik soru:** Bir avukat, mentorunun yirmi iki yıl önce yaptığı hatayı (kolay yol: ikrar) tekrar etmeden bir çocuğu
  kurtarabilir mi?
- **Tema:** okunmamış satırlar. Polis bir tanığa yalnızca bir soru sordu; savcı bir mesajı yarıda kesti; Leyla 2004'te
  tutanaktaki üçüncü adı okumadı; Kemal bir sesli mesajı dinlemedi; Emir bir mektubu almadı.
- **Ton:** noir dram; şubat–mart, Bursa ve Mudanya; yağmur, iskele, neonun yanmayan I harfi.

## 2. Gerçek ve kronoloji

Ayrıntılı tablo hikâye kitabı §2'de. Özet:

| Zaman | Olay | Oyuncu nasıl öğrenir |
|---|---|---|
| 2004 | Görükle'deki öğrenci evinde esrar ve terazi; evde Kemal, Ercan ve "misafir" Tarık. Kemal ikrar etti, dört yıl yattı. | BR_00–BR_01B; ARA2 çerçeve; 2004 arşivi (ev_arsiv) |
| 10.11 21.14 | Emir: "…hesabını soracağım. Neden yaptığını yüzüne soracağım." | INV_TEL (büyüteç) |
| 12.11 | Şefin "bıçaklar bileylensin" talimatı; Emir taş alır. | INV_MUTFAK tahta, INV_EV taş, INV_TEL şef mesajı |
| 14.11 22.47 | Ercan → Emir: "Kapanıştan sonra ofise uğra." | INV_TEL (karşılaştır) |
| 23.12 | Nişan fotoğrafı: Tarık lacivert gömlekli. | ARA_CANSU |
| 23.25 | Tarık, Cansu'yu erken gönderir. | INV_NURI, ARA_CANSU |
| 23.35 | "Babamın hayatını çaldın!" | dosya (Süleyman'ın ifadesi) |
| 23.40 | Emir arka kapıdan elleri boş, önlüksüz çıkar. | INV_SULEYMAN, H1 S3–S4 |
| 23.44.10 | DVR'ın fişi çekilir. | ARA_DVR (dilekçe) |
| 23.48.11 | Z raporu basılır. | ARA_Z (dilekçe) |
| 23.52.40 | Emir'in kartı İskele'de 1/M otobüsünde. | ARA_KENT (dilekçe) |
| 23.58.07 | Ercan Kemal'e sesli mesaj: "Kapıda biri var. Gel, otur." | INV_HTS → INV_KEMAL → bilirkişi (ARA_SESLI) |
| ~00.00 | Tarık, Emir'in bıçağıyla Ercan'ı öldürür, mektubu alır, gömleği değiştirir. | ARA_EMANET iz yazısı, ded_gomlek, T3 |
| 00.16 | Tarık 112'yi arar. | dosya |

## 3. Kadro

Hikâye kitabı §1. Yeni sprite'lar satır içi (`sprites.ts`): `sd_kemal`, `sd_tarik`, `sd_cansu`, `sd_gulay`. Ortak sprite'lar:
avukat_cubbe, mentor, muvekkil (Emir), anne (Meral), hakim, uye_hakim, savci, mubasir, gardiyan (Cemil), bora (Şef Nuri),
bilirkisi (Dr. Ilgaz), huseyin (Süleyman), tanik (Ercan), polis.

## 4. Delil zinciri

| Kimlik | Ad | Tür | Keşif | Neyi çürütür / destekler | Sunulabilir |
|---|---|---|---|---|---|
| ev_tarik_ifade | Tarık'ın kolluk ifadesi | EVIDENCE (savcılık) | başta | 23.55, bıçak, kan, sayım, kamera | evet (S2/S4'te karşılaştırma) |
| ev_bicak, ev_mesaj_pzt, ev_suleyman_ifade, ev_tas_fis, ev_otopsi | savcılık delilleri | EVIDENCE | başta | — | evet (cezalı kurallar) |
| ev_olay_foto, ev_hts, ev_tel_rapor | dosya | EVIDENCE | başta | sahne, belge kaynakları | evet (kısmi / cezalı) |
| ev_kentkart | Kentkart dökümü | EVIDENCE | dilekçe/H1 talebi → ARA girişi | T1 (23.55) | evet |
| ev_dvr | DVR raporu | EVIDENCE | dilekçe/H1 → ARA | T4 (kamera arızalı) | evet |
| ev_z | Z raporu | EVIDENCE | dilekçe/H1 → ARA | T3 (sayım) | evet |
| ev_sesli | sesli mesaj raporu | EVIDENCE | Kemal'in rızası + dilekçe → ARA / ARA2 | T2, R2 | evet |
| ev_cansu_foto | nişan fotoğrafı | EVIDENCE | ARA_CANSU | T6, R1 | evet |
| ev_iz_yazisi | not bloğu tutanağı | EVIDENCE | ARA_EMANET (yan ışık) | T5, R4 | evet |
| ev_arsiv | 2004 arama tutanağı | EVIDENCE | ARA2 dilekçe → 3. celse girişi | R3 | evet |
| clue_* (31) | tahta kartları | CLUE | sahneler, belgeler, görüşmeler | çıkarımlar | hayır |
| ded_davet, ded_bileme, ded_niyet | tasarlamanın üç ayağı | INSIGHT | tahta | tasarlama (T0) | davet/bileme evet, niyet dayanak |
| ded_onluk, ded_bicak_yeri, ded_saat | tanığın çıkış anlatımı | INSIGHT | tahta | S2/S4, T1/T2 | evet |
| ded_kasa, ded_kamera, ded_yol, ded_gomlek, ded_mektup | ara evre çıkarımları | INSIGHT | ara tahtası | T3, T4, T1, T6/R1, T5/R4 | evet |
| ded_canli | maktul 23.58'de yaşıyordu | INSIGHT | ara tahtası (sesli + Kentkart) | T2, R2; 2-b | evet |

**Tahta tarifleri (13 + 4 çeldirici):** DAVET (davet+dolandı) · BILEME / BILEME2 (tahta+taş / tahta+çanta) · NIYET (mesajın
tamamı+kavga) · ONLUK · BICAK · SAAT · KASA · KAMERA · YOL / YOL2 · CANLI · GOMLEK · MEKTUP; çeldiriciler: rakı+son arama,
boks+mesaj, beyaz+önlük, durak kamerası+davet.

**Gecikmeli teslimler:** Kentkart / DVR / Z / sesli mesaj — INV dilekçesi (`dil_*`) ya da H1 sözlü talep (`h1_*`) → ARA_GIRIS_1;
ARA ek dilekçesi (`ara_dil_*`) → ARA_SON_1 (sesli mesaj → ARA2_G0); arşiv (`arsiv_talep`) → T3_00G_1.

## 5. Çelişkiler (çapraz sorgu)

- **Süleyman (H1, S1–S5):** S1 bastır → kâğıt sesi; S2 bastır → dolmuş 23.45; S2'ye ev_tarik_ifade/ded_saat → contra_s2;
  S3 bastır → S4 açılır ("elinde bir şey yoktu"); S4'e ev_tarik_ifade/ded_onluk/ded_bicak_yeri → contra_s4 (ev_olay_foto kısmi);
  S5 kanaat itirazı. İkisi birden → H1_03K ("kimse sormadı").
- **Tarık (H2, T0–T6):** T0 ded_davet/ded_bileme + duyum itirazı; T1 ded_yol/ev_kentkart/ded_saat; T2 ded_onluk/ded_bicak_yeri/
  ded_canli/ev_sesli; T3 ev_z/ded_kasa (uyarıldıysa kısmi ikna); T4 ev_dvr/ded_kamera; T5 ded_mektup/ev_iz_yazisi; T6 (T3 bastırılınca)
  ded_gomlek/ev_cansu_foto. Üç çelişki → T2_02K ("saatler karışmış olabilir"). T5 bastırılınca "Gemlik" sürçmesi.
- **Tarık yeniden (H3, R1–R4):** R1 ded_gomlek; R2 ev_sesli/ded_canli; R3 ev_arsiv; R4 ded_mektup. R2 ∧ R3 ∧ (R1 ∨ R4) → T3_01K
  (CMK 48 ile susma; bildirim yapıldıysa savcılığın bulduğu gömlek ve gözaltı).

## 6. Sonuçlar

| Öncelik | Kimlik | Sınıf | Koşul | Ceza | XP |
|---|---|---|---|---|---|
| 1 | IKRAR | OTHER (etik) | `sahte_ikrar` | 12 yıl 6 ay (81/1 + 29 + 62) | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | ¬çöküş ∧ alibi_tam ∧ fail_belli ∧ beraat savunması ∧ ikna ≥ 8 ∧ final ≥ 12.500 | — | 1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | ¬çöküş ∧ tanik_coktu ∧ (tasarlama_coktu ∨ lehe2) ∧ beraat savunması ∧ ikna ≥ 6 ∧ final ≥ 11.000 | — | 1,0 |
| 4 | INDIRIM | RECHARACTERIZED | ¬çöküş ∧ terditli savunma ∧ tahrik dayanağı ∧ tasarlama_coktu ∧ final ≥ 3.500 | 12 yıl 6 ay | 0,85 |
| 5 | MAHKUMIYET | CONVICTION (varsayılan) | — | ağırlaştırılmış müebbet → 62/1 müebbet | 0,6 (çöküş 0,3) |

Yüklemler: `tasarlama_sarsildi` (bir ayak), `tasarlama_coktu` (iki ayak), `tanik_celiski` (S2 ∨ S4), `tarik_sarsildi` (≥3 T),
`tanik_coktu`, `lehe2`, `alibi_tam` (ded_canli ∧ (ded_yol ∨ ev_kentkart)), `fail_belli` (tarik_ifsa ∧ bildirdi ∧ ¬yüzleşme).
Etik sayaç: SK_BICAK, CK_IS, AKS_EVET, AR_NOT (+1), AE_IKRAR (+2). XP etikte yarıya iner.

## 7. Skor

- Kategoriler ve döküm satırları: Delil toplama (ARAŞTIRMA + DELİL ANALİZİ, `key` etiketli 22 delil) · Çapraz sorgu ·
  İtiraz isabeti (`legal_hits`/9) · Savunma · Hatalı delil (`wrong`). Güvenilirlik bonusu ♥ × 100.
- Strateji çarpanı yalnızca uyumlu esas savunmada: Masumiyet ×1,5 (S_MASUMIYET) · Tasarlama ×1,2 (S_SUPHE) · Terdit ×0,8.
- Eşik çubuğu: Mahkûmiyet 0 · Farklı nitelendirme 3.500 · Beraat 11.000 (sonuç eşikleriyle aynı); B ayrıca 12.500.
- Tutarlar: nesne +10…+60 / ıska −10; belge +100/+150, yanlış alet −20; tarif +300 (CANLI +400), yanlış çift −50; BASTIR +25;
  sunum +200/+300 (R2 +400), kısmi +150; yanlış −150 ♥−1; usul +40…+120, dayanaksız −50 ♥−1; dayanak +60/−40; esas savunma
  150–300 (çarpanlı); etik −50…−200.

## 8. Node grafiği

Hikâye kitabı §3. Soruşturma hub'ı push/`$return`; iki ara hub'ı yığınsız (`retarget`, doğrudan dönüş). Koşullu parçalar
DECISION zincirleriyle (INV_GECE_1…5, H1_00G_*, H1_03S*, ARA_GIRIS_*, ARA_SON_1…5, T2_00G_*, ARA2_G0, T3_00G_1…4, T3_00I,
T3_04G). Tekrarlayan ceza kuralları `maxUses`; iki tahtadaki tarifler `IF ¬hasEvidence` ile yalnızca ilk kurulumda puanlı.

## 9. Golden path'ler

| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| G1 | BERAAT_B | 13.430 | Masumiyet; HTS → Kemal → sesli mesaj korunur ve bilirkişiye gider; ara evrede bütün kayıtlar; arşiv + savcılığa bildirim; son celsede R1–R3 → tanık susar |
| TIPIK | BERAAT_E | 12.680 | Tasarlamayı çürüt; sesli mesaj yolu yok; tanık ikinci celsede çöker; arşiv istenir ama bildirim yapılmaz |
| G3 | INDIRIM | 7.860 | Terditli; tipik soruşturma, kısa ara, zayıf çapraz sorgu; esas savunmada tahrik |
| G4 | MAHKUMIYET | 510 | Dağınık soruşturma, sert tonlar, tanığa söz ezberletme, menfaat vaadi, yüzleşme, dayanaksız savunma |
| G5 | IKRAR | 12.380 | Tipik yol; Kemal'in önerisi Emir'e taşınır, Emir ikinci celsede sahte ikrar eder |
| W | MAHKUMIYET (çöküş) | 7.450 | Tipik yol ikinci celseye kadar; baş tanığa art arda savcılık delili, ♥0 |

## 10. Erken çözüm denetimi

Açgözlü en küçükleme (TIPIK'ten 16/8/4/2/1'lik aksiyon parçaları silinip hâlâ bir beraate ulaşan yol, motorla yeniden oynatılarak): en kısa beraat **180 aksiyon** (TIPIK 226; oran **0,80**; hedef ≥ 0,60). Beraat; tanığın çöküşünü (iki celsede en az üç çelişki ya da Süleyman + son celse), tasarlamanın iki
ayağını ya da iki lehe bulguyu, beraat savunmasını, ikna ≥ 6'yı ve 11.000 finali birlikte ister. Tipik yolun metni tarandı:
Tarık Sezer'in fail olduğu, ikinci celsedeki çelişkilerden ve ara evredeki kayıtlardan önce söylenmez; erken ayrıntılar
(şeridin dışındaki beyaz gömlek, erken gönderilen garson, "kamera arızalıydı", bileği taşını bilmesi) yalnızca tohumdur.
Sesli mesajın "kapıda biri var" cümlesi bir ad vermez; yalnızca Kemal yolunu kat eden oyuncuya, bir kayıtla, gelir.

## 11. Süre ve sözcük ölçümü

`npm run case:duration -- son-durusma` (2026-10-20):

```
  G1             99.3 dk   13835 sözcük   224 aksiyon  BERAAT_B (13430)
  G3             83.6 dk   11658 sözcük   188 aksiyon  INDIRIM (7860)
  G4             69.7 dk    9848 sözcük   150 aksiyon  MAHKUMIYET (510)
  G5             97.3 dk   13424 sözcük   227 aksiyon  IKRAR (12380)
  W              76.0 dk   10353 sözcük   185 aksiyon  MAHKUMIYET (7450)
  TIPIK          97.2 dk   13433 sözcük   226 aksiyon  BERAAT_E (12680)
  ==> TİPİK YOL (TIPIK): 97.2 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```

Paket toplamı (satır, etiket, geri bildirim, hüküm ve epilog metinleri): ~26.600 sözcük; en uzun satır ≤ 220 karakter
(yalnızca BR_02'deki olay özeti paragrafı daha uzun). Doğrulama: `npm run case:validate -- son-durusma --max-states 3000
--walks 200 --max-ms 1500000` → PASSED, 0 hata; kapsam node 123/123, seçenek 237/237, kural 93/93, delil 56/56; 6/6 golden
path; tek uyarı SIMULATION_INCOMPLETE (uzun davada beklenir). Varsayılan bütçeyle (20.000 durum) BFS 600 sn sınırına takılır;
bu dava için yukarıdaki bütçe kullanılmalıdır (~7 dk).
