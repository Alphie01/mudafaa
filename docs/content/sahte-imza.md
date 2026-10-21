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
C2_05 mütalaa: güçlü → C2_05A (beraat) · orta ya da kesin Adli Tıp raporu → C2_05B (takdir) · aksi → C2_05C (mahkûmiyet; belirsiz rapor varsa ayrı metin)
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
| ev_rapor2 | gecikmeli | C2_00 (yeni bilirkişi **gerekçeli** istendiyse: `bk_gerekce` = C105_A, ya da ded_mukayese varken DIL_BILIRKISI / T_BILIRKISI) | imza sanığın değil, sol el |
| ev_rapor2_belirsiz | gecikmeli | C2_00 (bilirkişi istendi ama gerekçesiz: C105_A2 ya da çıkarımsız dilekçe) | tek mukayese imzası; kesin kanaat yok |
| ev_rapor2_ek | gecikmeli | C2_00 (gerekçeli bilirkişi + somut suç duyurusu) | Tarık'ın örnekleriyle uyum |

Yeni bilirkişi seçenekleri (C105_A2, T_BILIRKISI, DIL_BILIRKISI) ancak raporun eki okunduğunda (clue_mukayese_ozel) görünür.

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
| 2 | COKUS | CONVICTION | duruşmada güvenilirlik 0, dosyada kesin Adli Tıp raporu yok ve makul şüphe çekirdeği yok | 2 yıl 6 ay | 0,3 |
| 3 | BERAAT_B | ACQUITTAL 223/2-b | rapor2 + ek rapor + Tarık sustu + mazeret + ikna ≥ 8 + final ≥ 11 000 | beraat | 1,2 |
| 4 | BERAAT_E | ACQUITTAL 223/2-e | kirli mukayese + (rapor2 ya da sol el çelişkisi) + bağımsız destek (sol el çelişkisi ya da mazeret) + ikna ≥ 6 + final ≥ 9 500 | beraat | 1,0 |
| 5 | UST_KURUL | OTHER | dosyada kesin Adli Tıp raporu (rapor2) var, beraat koşulları tutmuyor | ara karar: çelişki için Fizik İhtisas Kurulu, adli kontrol kalkar | 0,7 |
| 6 | RESEN_RAPOR | OTHER | makul şüphe çekirdeği (aşağıda), rapor2 yok, beraat koşulları tutmuyor | ara karar: mahkeme resmî imzalarla Adli Tıp raporu ister, adli kontrol kalkar | 0,6 |
| 7 | INDIRIM | REDUCED | rapor2 yok + makul şüphe çekirdeği yok + ikna ≥ 3 + final ≥ 3 000 | 1 yıl 8 ay, ertelendi | 0,85 |
| 8 | MAHKUMIYET | CONVICTION | varsayılan (rapor2 ve şüphe çekirdeği burada olamaz: 5. ve 6. sıra yakalar) | 2 yıl 6 ay | 0,6 |

**Makul şüphe çekirdeği** (`makulSuphe`): `contra_g3` (tapu memurunun sol el beyanı), `contra_e4` (kargo kaydı Erol'a
sunuldu), `mazeret_tanik` (kuryenin açık uçlu tanıklığı) bayraklarından en az ikisi. Bu çekirdek dosyadayken hiçbir sonuç
mahkûmiyet ya da indirim kurmaz: tam beraat koşulları (BERAAT_B/E) tutmuyorsa mahkeme çelişkiyi araştırarak giderir
(rapor2 varsa UST_KURUL, yoksa RESEN_RAPOR). Tek bir halka (yalnızca sol el ya da yalnızca kurye) indirim ve mahkûmiyette
kalabilir; gerekçe o halkanın neden tek başına raporu sarsmadığını açıklar ("şüphe doğurmuş ama yeterli görülmemiş" gibi
şüpheyi kabul edip mahkûm eden bir cümle yoktur).

Kesin Adli Tıp raporu dosyadayken hiçbir sonuç mahkûmiyet ya da indirim kurmaz. Mahkûmiyet, indirim ve çöküş gerekçe
satırları dosyadaki delile göre koşulludur (sol el beyanı, kargo kaydı, belirsiz rapor, salon teşhisine itiraz).

Eşik çubuğu: Mahkûmiyet 0 · İndirim 3 000 · Beraat 9 500 (`outcomes.ts` sabitleri). `scaleMax` 11 500 (gözlenen tavan
12 060'ın ~%95'i). Yalnızca lehe hüküm isteyen esas savunma (`closing_indirim`) beraati kapatır. Her sonucun epilogu
`OutcomeDef.epilogue` içindedir; BERAAT_B ve BERAAT_E epilogları bayraklara göre (Sevgi'nin itirafı, randevu numarası)
ek bloklar taşır. Tarık'ın 2. celsede CMK 48'e sığınıp arka kapıdan çıktığı yollarda (`tarik_sustu`) BERAAT_E, UST_KURUL,
RESEN_RAPOR, INDIRIM ve MAHKUMIYET epiloglarında Tarık görünmez; BERAAT_E'de Leyla, numarayı kürsüde gösterip savcılığa
yazmadığı için Deniz'i eleştirir ("bir tutanak, bir suç duyurusu değildir").

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
| INDIRIM | INDIRIM | 4 040 | Rapor ve irsaliye okunmuyor, bilirkişi istenmiyor; gece matbaada yüzleşme; 2. celsede kuryeye telkinli soru (C201_B), kargo kaydı Erol'a sunulmuyor → yalnızca sol el halkası; terditli savunma |
| RESEN_RAPOR | RESEN_RAPOR | 4 490 | INDIRIM ile aynı soruşturma; ama kuryeye açık uçlu soru (C201_A) ve E4'te kargo kaydı → sol el + mazeret: mahkûmiyet kurulamaz, mahkeme re'sen Adli Tıp ister |
| MAHKUMIYET | MAHKUMIYET | −100 | Kâğıtlara bakmayan soruşturma, etik hatalar, yalnızca lehe hüküm |
| ETIK | ETIK | 7 695 | Ara evrede Emre'ye yalan söyletme → 2. celsede çöküş ve azil |
| COKUS | COKUS | 6 615 | Bilirkişi istenmiyor (dilekçede ve kürsüde); kuryeye telkinli soru; Erol'a beş kez ilgisiz delil → güvenilirlik 0 |
| UST_KURUL | UST_KURUL | 7 935 | Tipik soruşturma ve gerekçeli rapor; ama 1. celsede sol el açılmıyor, 2. celsede hiçbir çelişki sunulmuyor, terditli savunma |
| BERAAT_E_RAPORSUZ | BERAAT_E | 10 340 | Tipik soruşturma, bilirkişi hiç istenmiyor; 2. celsede kirli mukayese itirazı (C204B_A) + sol el + mazeret |
| MAHKUMIYET_BELIRSIZ | MAHKUMIYET | 380 | Mahkûmiyet yolu, ama rapor eki okunup gerekçesiz bilirkişi isteniyor (C105_A2) → belirsiz Adli Tıp raporu (C204B_D; E2'de kısmi sunum) |

## 9. Erken çözüm denetimi

**İnceleme sonrası (2026-10-21).** Kısa yol araması golden path'lerden açgözlü eksiltmeyle yapıldı (`enumerateActions`
uzayı tam taranamıyor): her adımda 32/16/8/4/2/1 aksiyonluk bloklar çıkarılıp sonuç beraat kaldıkça kabul edildi.
Sonuçlar (2026-10-21, son düzeltmelerden sonra; tek süreç, 9 dk bütçe): TIPIK tohumundan **143** aksiyon (BERAAT_E,
9 505), BERAAT_E_RAPORSUZ tohumundan **145** (BERAAT_E, 9 505), BERAAT_B tohumundan **155** (BERAAT_E, 9 505).
Tipik yol 205 aksiyon: en kısa beraat **%70** (≥ %60 hedefi). Her kısa yol kirli mukayese çıkarımını, sol el
çelişkisini ve mazereti hâlâ içerir. Eski kısa yollar kapandı:

**İkinci inceleme sonrası (2026-10-21).** Makul şüphe çekirdeği eklendikten sonra yeniden ölçüldü (tek süreç; önce
açgözlü eksiltme, sonra her adımda `enumerateActions` alternatifleriyle yer değiştirme + eksiltme, 6 dk bütçe):
eksiltme TIPIK → 168, BERAAT_E_RAPORSUZ → 182, BERAAT_B → 154; yer değiştirme araması BERAAT_B'nin 154'ünden **145**
aksiyona indi (BERAAT_E, 9 510; **%71**). Şüphe çekirdeği ilk denemede bir beraat sonucu (CMK 223/2-e, düşük XP) olarak
yazılmıştı; arama ona 80 aksiyonda (%39) ulaştı. Bu yüzden çekirdek beraat değil, araştırma ara kararı (RESEN_RAPOR)
üretir: mahkûmiyeti engeller ama tam beraat için hâlâ kirli mukayese, ikna ve eşik gerekir.

- İlk gün duruşmaya gidip "yeni rapor" istemek (eski 51 aksiyonluk yol, dosyada kesin Adli Tıp raporuyla mahkûmiyet)
  artık mümkün değil: C105_A2/T_BILIRKISI rapor eki okunmadan görünmez; gerekçesiz talep yalnızca belirsiz rapor getirir.
  Kirli mukayese çıkarımıyla kısa bir yoldan kesin rapor alınsa bile skor düşükse sonuç UST_KURUL'dur (beraat değil,
  mahkûmiyet de değil).
- BERAAT_E, rapora ek olarak bağımsız bir destek (sol el çelişkisi ya da mazeret) ve 9 500 eşiği ister.

Seçenek etiketleri: puanı farklı 31 seçenek setinde en iyi seçenek 5 sette en uzun, 4 sette en kısa (önceki 20/31 en uzun).
Tipik yolun 1. evre satırları tarandı: Tarık'ın adı yalnızca sıradan bir yeğen olarak (Sevgi'yi getiren, çay ikram eden,
börek getiren) ve numara çizelgesinde geçer; anlatı onu şüpheli diye işaretlemez (börek gecesinde dosyalara bakışı ve
dijital odadaki "sır" düşüncesi de çıkarıldı); "ne lazımsa" yardımseverliği Emre'de de
var. Soğuk açılış el değişimini göstermez ("Zincir gerildi."); yazıcı günlüğündeki bilgisayar MATBAA-PC.

**Leyla'nın ters çerçevesi** (BR_01, ARA_AKSAM2, ARA_SON, BERAAT_B epilogu) bilinçli olarak bu davada çözülmez: seri
düzeyinde bir arktır (Leyla'nın otuz yıl önceki davası), sonraki davalara bırakılmıştır.

## 10. Süre ve sözcük ölçümü

`npm run case:duration -- sahte-imza` (2026-10-21, ikinci inceleme düzeltmelerinden sonra):

```
  TIPIK         103.9 dk   15005 sözcük   205 aksiyon  BERAAT_E (11020)
  BERAAT_B      104.4 dk   15014 sözcük   210 aksiyon  BERAAT_B (12060)
  INDIRIM        81.4 dk   11796 sözcük   159 aksiyon  INDIRIM (4040)
  RESEN_RAPOR    82.1 dk   11899 sözcük   160 aksiyon  RESEN_RAPOR (4490)
  MAHKUMIYET     67.8 dk    9523 sözcük   149 aksiyon  MAHKUMIYET (-100)
  ETIK           85.5 dk   12184 sözcük   178 aksiyon  ETIK (7695)
  COKUS          88.6 dk   12575 sözcük   187 aksiyon  COKUS (6615)
  UST_KURUL      94.3 dk   13477 sözcük   194 aksiyon  UST_KURUL (7935)
  BERAAT_E_RAPORSUZ  101.8 dk   14688 sözcük   202 aksiyon  BERAAT_E (10340)
  MAHKUMIYET_BELIRSIZ   69.0 dk    9747 sözcük   148 aksiyon  MAHKUMIYET (380)
  ==> TİPİK YOL (TIPIK): 103.9 dk  ✓ süre hedefte
  ==> SÖZCÜK BÜTÇESİ: ✓ 15005 sözcük: hedefte (15–25 bin)
```

`npm run case:validate -- sahte-imza` (varsayılan bütçe, 2026-10-21): **PASSED**, 0 hata; kapsam node 115/115, seçenek
239/239, kural 84/84, delil 49/49; 10/10 golden path; sekiz sonucun hepsi simülasyonda ulaşılır. Kalan uyarı: BFS durum
bütçesi (derin durumlar yürüyüşle örneklendi). `ev_rapor2_belirsiz` artık E2'de kısmi bir sunum kuralına sahip
(PS_E2_BELIRSIZ).

## 11. Toplam metin

`content/cases/sahte-imza/*.json` içindeki bütün `text`, `label`, `feedback`, `good/bad/neutral`, `title`, `verdictText`,
`sentence`, `howToReach` ve epilog satırları (golden path hariç): **26 149** sözcük; delil kartları dahil **27 810**.
