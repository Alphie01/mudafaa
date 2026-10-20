# Dava #09 "Sahte İmza" — Dava Tasarımı

> Kaynak: `content/src/sahte-imza/` (yazım kiti) → `content/cases/sahte-imza/` (`npm run case:build -- sahte-imza`).
> Hikâye kitabı (ton, kadro sesleri, sahne vuruşları, epiloglar): `docs/content/sahte-imza-hikaye.md`.
> Hukuki notlar: `docs/legal/sahte-imza.md`. Lineup: TCK 204/1 · zorluk 3/5 · rütbe şartı yok.

## 1. Logline, gerçek ve ters köşe

Matbaacı Vedat Ateş (49), demanslı annesinin Hisar'daki evini satış yetkisi eklenmiş sahte bir noter suretiyle satmakla
suçlanıyor; tapu senedinde onun adı, kimliği ve "imzası" var, grafolog "aynı elin ürünü" diyor. **Gerçek:** imzayı, 2023'te
babaannesinin vekâletnamesini taramış olan solak yeğen Tarık Ateş atmıştır: sureti 6 Şubat gecesi matbaanın ortak
bilgisayarından basmış, amcasının kimliğini ceketinin iç cebinden almış, kep ve gözlükle tapuya girmiş, evi bahis
borcuna mahsuben alacaklısı Erol Kılınç'a devretmiş; sonra kolluğa "amcamın imzaları" diye kendi imzaladığı irsaliyeleri
teslim etmiştir. Bilirkişi raporu bu yüzden doğru ama yanlış şeyi kanıtlar.

## 2. Kronoloji (özet; ayrıntı hikâye kitabı §3)

10.05.2023 sınırlı vekâletname (yev. 08817) · 06.02.2026 02.14 matbaada iki sayfalık gece baskısı · 09.02 kapora makbuzu ·
10.02 10.12 randevu Tarık'ın hattından · 17.02 akşam kimlik ceketten alınır · 18.02 09.52 Vedat'ın "kimliğimi
bulamıyorum" mesajı · 11.06 teyit araması (41 sn) · 11.19–11.37 kurye matbaada Vedat'la · 11.22–11.24 tapuda satış (sol
el, zincir gerilir) · 19.02 kimlik cebe döner · 20.03 Tarık mukayese belgelerini teslim eder · 02.04 grafoloji raporu ·
07.05 iddianame · 14.10 1. celse · 04.11 2. celse.

## 3. Yapı ve node haritası

```
PR_00 (tapu gişesi, isimsiz sesler) → PR_01 (üç an) → BR_00 Sevgi → BR_00L → BR_01 (A–D suç/ceza) → BR_01B (A–D resmî/özel)
  → BR_02 dosya + strateji → INV_SABAH
INV_HUB 4 gün × 3 EP (push/$return): OLAY YERİ matbaa araması · Hisar (komşu → ev araması) · huzurevi
  KİŞİLER Vedat görüşmesi (konu×ton, 12 dk; 2. ziyaret 8 dk) · Tarık · Emre · Nermin · Erol
  ARŞİV senet · suret · rapor · irsaliye (matbaada klasör bulununca) · noter · tapu · dilekçe · tahta (0 EP) · Leyla (0 EP/gün)
  Gün sonları: AKSAM1 (Leyla) · AKSAM2E (tehdit, Erol ziyaret edildiyse) / AKSAM2S (Sevgi) · AKSAM3 (Tarık börekle; sır)
INV_GECE_1..6 → INV_GECE → C1_00G koridor → C1_00K → C1_00 açılış → C1_01/C1_01X sanık savunması
  → C1_03 savcının sorusu (A–D) → C1_03N şikâyetçi (A–D) → C1_04 tapu memuru (G1–G5, G3B; bastır/sun/itiraz) ⇄ C1_04K
  → C1_05 rapor (A–D) → C1_06 delil talepleri → C1_ARA → C1_ARA2 → C1_CAY → ARA_GIRIS_1 (teslimler)
ARA_HUB 3 gün × 3 EP (yığınsız): kargo · randevu · asıl tutanak (0 EP) · tanık listesi · suç duyurusu · tahta · Leyla
  · Sinan · Sevgi · Emre (etik tuzak) · Nermin · Hayriye · emlak bürosu (sahne) · gece matbaa (kovalama yok)
ARA_SON_1..5 → ARA_SON → C2_00G → C2_00 (Adli Tıp raporları) → C2_00A/B → [C2_E etik çöküş → R_KARAR]
  → C2_01 kurye (A–D) → C2_02 Erol (E1–E5, E1B) ⇄ C2_02K mahsup → C2_03G → C2_03C0 → C2_03C (A–D çekinme)
  → C2_03 Tarık (T1–T5, T3X) → C2_03F → C2_03H susuş → C2_TENEFFUS → C2_04A/B rapor → C2_05 mütalaa (A/B/C)
  → C2_06P dayanaklar (3 hak) → C2_06 esas savunma → C2_06R → C2_07 son söz → C2_08 → R_KARAR (+ epilog)
tg_cokus (duruşmada güvenilirlik 0) → C2_COKUS → C2_08
```

## 4. Delil zinciri

| Kimlik | Tür | Nerede | Ne işe yarar |
|---|---|---|---|
| ev_senet, ev_suret, ev_rapor1, ev_makbuz | savcılık | başlangıç | Sunulursa ceza (G1/G4'te senet fotoğrafı istisna) |
| clue_sivanma, clue_senet_saat, clue_foto_kapali | ipucu | INV_SENET | solak imza, saat, örtülü yüz |
| clue_toner_muhur, clue_kagit, clue_ekli_satir | ipucu | INV_SURET | basılmış mühür, güvenliksiz kâğıt, eklenmiş satır |
| clue_noter_arsiv | ipucu | INV_NOTER | asıl nüshada satış yok |
| clue_mukayese_ozel, clue_tutanak_ad | ipucu | INV_RAPOR | özel belge mukayesesi, okunmayan teslim eden |
| clue_iki_el | ipucu | INV_IRSALIYE | irsaliyelerde iki el |
| clue_tel_liste, clue_yazici, clue_takvim, clue_aski, clue_makas, clue_kase | ipucu | matbaa | numara çizelgesi, gece baskısı, kurye notu… |
| clue_sag_el, clue_ceket, clue_mesaj | ipucu | Vedat görüşmesi (bulguyla açılan konular) | sağ el, kimliğin yeri, 09.52 mesajı |
| clue_doblo, clue_bos_dosya, clue_ruhsat, clue_aile_foto | çeldirici | Hisar | yanlış izler |
| ev_kargo, ev_randevu, ev_tutanak | gecikmeli | ARA_GIRIS_1 (dilekçe/C1_06 talebiyle) | mazeret, arayan hat, teslim eden Tarık |
| clue_kargo_saat, clue_kargo_imza, clue_randevu_no, clue_teyit | ipucu | ARA_KARGO, ARA_RANDEVU | 11.19–11.37; terminal imzası; numara |
| clue_mahsup / clue_bahis | ipucu | emlak bürosu / Sevgi (halka şartıyla) | borca mahsup |
| ev_rapor2 | gecikmeli | C2_00 (yeni bilirkişi istendiyse) | imza sanığın değil, sol el |
| ev_rapor2_ek | gecikmeli | C2_00 (bilirkişi + somut suç duyurusu) | Tarık'ın örnekleriyle uyum |

**Tahta (1. evre, 6 çıkarım + 2 alternatif tarif, 4 çeldirici):** ded_solak (sıvanma+sağ el), ded_suret_sahte (toner|satır
+arşiv), ded_mukayese (özel+iki el), ded_kimlik (ceket+mesaj), ded_kurye (takvim+saat), ded_baski (yazıcı+toner|kâğıt).
**Ara tahtası:** ded_mazeret, ded_randevu (numara|teyit + çizelge), ded_imza_farki, ded_borc; geç kalanlar için solak,
suret, mukayese; çeldiriciler. `ded_baski` kürsüye götürülürse cezalıdır (müvekkilin matbaasını işaret eder).

## 5. Çelişkiler (çapraz sorgu)

- **Gülten (C1_04):** G1 fotoğraf↔ded_kimlik / senet fotoğrafı; G2 sistem doğrulaması↔ded_suret_sahte; G3 bastırılınca G3B
  açılır, ded_solak → C1_04K (zincir gerildi); G4 salon teşhisi↔senet fotoğrafı + itiraz g_salon; G5 itiraz g_kanaat.
- **Erol (C2_02):** E1 bastırılınca E1B (yeğen aracı) ↔ ded_randevu; E2↔ev_rapor2; E3↔ded_borc → C2_02K mahsup itirafı;
  E4↔ded_mazeret/ev_kargo; E5 itiraz.
- **Tarık (C2_03):** T1↔ded_mukayese/ded_imza_farki; T2↔ev_tutanak; T3↔ded_randevu (gece matbaada yüzleşildiyse T3X,
  yalnızca kısmi); T4 kısmi; T5↔ev_rapor2_ek. Üç çelişki → C2_03H susma (tarik_sustu).

## 6. Sonuçlar ve eşikler

| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | ETIK | OTHER | Emre'ye yalan söyletmek (etik_kirlik) | Azil, suç duyurusu | 0 |
| 2 | COKUS | CONVICTION | duruşmada güvenilirlik 0 | 2 yıl 6 ay | 0,3 |
| 3 | BERAAT_B | ACQUITTAL 223/2-b | rapor2 + ek rapor + Tarık sustu + mazeret + ikna ≥ 8 + final ≥ 11 000 | beraat | 1,2 |
| 4 | BERAAT_E | ACQUITTAL 223/2-e | (rapor2 ya da sol el çelişkisi + kirli mukayese) + ikna ≥ 6 + final ≥ 9 500 | beraat | 1,0 |
| 5 | INDIRIM | REDUCED | ikna ≥ 3 + final ≥ 3 000 | 1 yıl 8 ay, ertelendi | 0,85 |
| 6 | MAHKUMIYET | CONVICTION | varsayılan | 2 yıl 6 ay | 0,6 |

Eşik çubuğu: Mahkûmiyet 0 · İndirim 3 000 · Beraat 9 500 (`outcomes.ts` sabitleri). `scaleMax` 11 500 (gözlenen tavan
12 060'ın ~%95'i). Yalnızca lehe hüküm isteyen esas savunma (`closing_indirim`) beraati kapatır. Her sonucun epilogu
`OutcomeDef.epilogue` içindedir; BERAAT_B ve BERAAT_E epilogları bayraklara göre (Sevgi'nin itirafı, randevu numarası)
ek bloklar taşır.

## 7. Skor

Altı kategori; döküm satırları: Delil toplama (ARASTIRMA+DELIL_ANALIZI), Çapraz sorgu, İtiraz isabeti
(USUL+HUKUKI), Savunma, Hatalı delil. Tutarlar Dava #07 ölçeğinde: nesne +20/+60, ıska −10; belge +100/+150, yanlış alet
−20; tarif +300 (+200 yardımcı çıkarımlar), yanlış çift −50; bastırma +25/+50; doğru sunum +200/+300, kısmi +80/+100,
yanlış −150 ve −1 güvenilirlik; itiraz +50/+100, dayanaksız −50; esas savunma `strategyAmount(200, …)`.

## 8. Golden path'ler

| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 11 020 | Tam soruşturma, sol el çelişkisi, yeni rapor, kurye; suç duyurusu yok |
| BERAAT_B | BERAAT_B | 12 060 | Tipik + emlak bürosu, borç çıkarımı, somut suç duyurusu, Tarık'ın susması |
| INDIRIM | INDIRIM | 4 490 | Rapor ve irsaliye okunmuyor, bilirkişi istenmiyor; gece matbaada yüzleşme; terditli savunma |
| MAHKUMIYET | MAHKUMIYET | −100 | Kâğıtlara bakmayan soruşturma, etik hatalar, yalnızca lehe hüküm |
| ETIK | ETIK | 7 695 | Ara evrede Emre'ye yalan söyletme → 2. celsede çöküş ve azil |
| COKUS | COKUS | 6 975 | Erol'a beş kez ilgisiz delil → güvenilirlik 0 |

## 9. Erken çözüm denetimi

Kısa yol araması `enumerateActions` ile tam yapılamadı (durum uzayı ~70 bin durumda kesiliyor); bunun yerine en verimli
kısa yol elle kuruldu ve motorla oynatıldı: en yüksek değerli eylemlerle (senet, matbaa, Vedat, rapor, irsaliye, suret,
noter, dilekçe, ilk celsenin bütün isabetleri, kargo/randevu, ikinci celsenin isabetleri) **116 aksiyonda final 8 950**
(INDIRIM). 9 500 eşiğini aşmak için en az ~126 aksiyon gerekir: tipik yolun (205) **%61'i**. Beraat, sol el çelişkisi +
kirli mukayese ya da Adli Tıp raporu olmadan hiçbir skorla verilmez; BERAAT_B ayrıca suç duyurusu ve Tarık'ın üç çelişkisini
ister. Tipik yolun satırları tarandı: Tarık'ın adı 1. evrede yalnızca numara çizelgesinde (altı numaradan biri) ve sıradan
bir yeğen olarak geçer; solaklığı, borcu ve teslim tutanağı ancak ilgili halka bulunduktan sonra açılır (Emre: ded_solak;
Sevgi/Nermin/Hayriye: `halka`; emlak bürosu: randevu çıkarımı ya da tutanak). Makas kesim masasına, gece baskısı ortak
bilgisayara taşındı ve Emre'nin gece davetiyeleri çeldirici olarak eklendi.

## 10. Süre ve sözcük ölçümü

`npm run case:duration -- sahte-imza` (2026-10-20):

```
  TIPIK          93.9 dk   13219 sözcük   205 aksiyon  BERAAT_E (11020)
  BERAAT_B       94.9 dk   13295 sözcük   210 aksiyon  BERAAT_B (12060)
  INDIRIM        73.6 dk   10376 sözcük   160 aksiyon  INDIRIM (4490)
  MAHKUMIYET     61.9 dk    8468 sözcük   149 aksiyon  MAHKUMIYET (-100)
  ETIK           78.1 dk   10854 sözcük   178 aksiyon  ETIK (7695)
  COKUS          81.6 dk   11308 sözcük   188 aksiyon  COKUS (6975)
  ==> TİPİK YOL (TIPIK): 93.9 dk  ✓ süre hedefte
```

Paketin toplam ekran metni (bütün satırlar, yanıtlar, geri bildirimler, epiloglar): bkz. §11.

## 11. Toplam metin

Toplam sözcük sayısı `content/cases/sahte-imza/*.json` içindeki bütün `text`, `label`, `feedback`, `verdictText`,
`reasoning` ve epilog satırları sayılarak ölçüldü (delil kartları ve golden path hariç): **21 227** sözcük; delil kartları dahil 24 436.
