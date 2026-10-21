# Dava #06 "Son Mesaj" — Dava Tasarımı

> Kaynak: `content/src/son-mesaj/` (yazım kiti) → `content/cases/son-mesaj/` (`npm run case:build -- son-mesaj`).
> Hikâye kitabı: `docs/content/son-mesaj-hikaye.md`. Hukuki notlar: `docs/legal/son-mesaj.md`. Kılavuz:
> `docs/content/authoring-guide.md`. Lineup satırı: `docs/content/lineup.md` (#06, zorluk 3/5, rütbe şartı yok).

## 1. Logline ve tema
- **Tek cümle:** Bursalı mimar Tarık Aksoy, iş ortağı Melis Karaca'ya gece yarısı şantaj mesajları göndermek ve onun
  eski bir ses kaydını vakıf yöneticisine iletmekle yargılanıyor; mesajlar onun telefonunda, onun hesabında. Ama
  hesabı, ofisin hiç iade edilmemiş 07 numaralı dizüstüsünden eski ortağı Ozan Tekin kullanmıştır.
- **Dramatik soru:** Bir mesajın altındaki isim, onu yazan el midir? ("Bir mesajın altında bir isim yazar. Mesajı kimin
  yazdığını yazmaz.")
- **Ton:** noir dram; Bursa, kasım–şubat, lodos ve yağmur. Mekânlar: Tophane'de Eski Pirinç Han, Siber Şube, Çekirge'de
  acil servis, Koza Han'da vakıf odası, Nilüfer'de bir plaza, Bursa 7. Asliye Ceza.
- **Hassas içerik:** özel hayata ilişkin malzeme cinsel değildir: bir boşanma döneminin ağlamaklı telefon kaydı ve bir
  klinik taburcu belgesi. Hiçbir sahnede içerik ayrıntılandırılmaz.

## 2. Gerçek ve kronoloji
Ayrıntılı kronoloji hikâye kitabının §1'indedir. Oyuncunun öğrenme yolu:

| Olgu | Gerçek | Nasıl keşfedilir (önkoşullar) |
|---|---|---|
| Ekran görüntüleri kararsız alındı | 12.11 15.44 görüntü, 13.11 10.20 karar, imza hanesi boş | INV_TUTANAK (büyüteç t6, karşılaştır t2) |
| Telefon mühürsüz iki gün durdu | Zarf bantlı; son kilit açılışı 12.11 15.52; imaj 14.11 | INV_TUTANAK t4 + INV_IMAJ i3 |
| Mesajlar telefondan çıkmadı | Ek-3 `sender_device`: Tarık'ın 25 Ekim mesajı 0, üç tehdit 3 | INV_IMAJ: dört satırın dördü de karşılaştırılmalı (i5, i6, i7, i8 → `clue_cihaz3`) |
| Cihaz 3 = OFIS-LAPTOP-07 | 14 Şubat'tan beri açık masaüstü oturumu | Müvekkil görüşmesinde `TP_CIHAZ` (← `clue_cihaz3`) → `H_HESAP_IND` (noter + hash) → ertesi gün INV_HESAP h3 |
| 9 Kasım gecesi telefon kilitli | Ek-2 kilit olayları; bant "AKSOY 01.40"; onam formu 02.10 | INV_IMAJ i4 + acil servis sahnesi (← `TP_GECELER`) + Gülay (← sahne) `GUL_ONAM` → INV_HKAYIT k3; tahtada iki adım: kilit + bant → `ded_sarj`, `ded_sarj` + onam → `ded_hastane` |
| Nöbet defteri | 01.40 telefon emanet, 06.05 teslim, paraf G.T. | Hastane kayıtlarının mahkemeden celbi (DIL_HASTANE / T1_HASTANE) → ARA'da `A_HRESMI` y3 |
| Sohbeti gizleyen hesabı kullanan | Arşivleme 06.11 02.13, cihaz 3 | INV_HESAP h7 |
| Üç gece tek IP | 85.105.44.17 (cihaz 3), ev hattı 176.88.12.4 (cihaz 0) | INV_HESAP: h4, h5, h6 ve h8'in dördü de karşılaştırılmalı (`clue_ip_ayni`) |
| Ofis hattı başka | Han'daki ofisin sabit adresi 78.186.20.9 | Ofis sahnesi, modem (`clue_ofis_hat`) |
| Ev hattı sanığın | Modem ekranı: abone T. Aksoy, 176.88.12.4 | ARA'da Tarık'ın evi, modem (`clue_ev_hat`) |
| 07 ofise dönmedi | Boş dok "07"; demirbaş listesinde iade hanesi boş; kolide dizüstü yok | Ofis sahnesi, ARA_DEMIRBAS d4, ev sahnesi |
| Hat Tekin Yapı'nın | Sağlayıcı yanıtı | 1. celsede T1_ISP (← `clue_ip_ayni` + `clue_ofis_hat` + 9 Kasım Demirci'ye sunulmuş + hesap dökümü dosyada) → ARA 1. hafta sonu |
| Bilirkişinin bulguları | Bulgu 1 cihaz, Bulgu 2 kilit | ARA 2. hafta `A_RAPOR` r2 (`clue_rapor_cihaz`), r3 (`clue_rapor_kilit`) |
| Üslup | Tarık küçük harf/noktasız; tehditler "Sn.", üç nokta, "Saygılar." = Ozan'ın e-postaları | INV_IMAJ i5/i6 (yalnızca iki ayrı el); eşleşme ARA'da: Nurten'in sakladığı "gerek görmüyorum" e-postası (NUR_LAPTOP), vakıf yazısı, Melis |
| Ozan kaydı herkesten önce biliyordu | 10.11 09.12 vakfa e-posta | ARA_VAKIF v5 |
| Dizüstü Tekin Yapı'da | Arşiv dolabında, açık oturumla | ARA_SUC (somut dayanaklı suç duyurusu) + Ozan uyarılmamışsa |

**Gizem kuralları.** Soğuk açılış yalnızca alıcının gözünden (isimsiz "BİR KADIN"). Ozan birinci evrede sıcak, yardımsever
bir savcılık tanığıdır; Kübra'nın Ozan'a dair konuları yalnızca ilgili bulgular bulunduktan sonra açılır (`KUB_CIHAZLAR` ←
`clue_cihaz3`, `KUB_OZAN` ← `clue_dock`); Ozan'a cihaz sorusu (`OZ_CIHAZ`) da `clue_dock`/`clue_bagli_cihaz` olmadan
görünmez ve dizüstü kelimesini anmaz. Tanığa telkin seçenekleri (Gülay, Hayri, Kübra) kimseyi işaret etmez. Birinci
evrede Ozan'ın ağzından ya da kaleminden tek bir "Saygılar." çıkmaz; birinci celsenin kapanışı da artık dizüstü ya da
demirbaş listesi anmaz ("kâğıtlar kimi gösteriyorsa"). Etik tuzaktaki e-posta sahnesi de "Saygılar." göstermez. İmzanın
Ozan'a bağlanması ancak ARA'da, Nurten'in sakladığı e-posta ya da vakıf yazısı tahtada tehditlerle birleştirildiğinde olur
(`CB_A_USLUP`/`CB_A_VAKIF`). Sağlayıcı yanıtındaki "Tekin Yapı" adı, ancak hesap dökümü, ofis hattı ve 9 Kasım kaydı
salona girdikten sonra istenebilen bir müzekkerenin cevabıdır.

**Evre kapıları (ikinci dengeleme turu).** Evreler boş geçirilemez. Soruşturmada "Günü kapat" (`I_BEKLE`) yalnızca
yapılacak iş kalmadığında (`inv_bos`) görünür; gün, eylem puanları bitince kendiliğinden kapanır. `GO_H1` 3. günde,
son günün bütün eylem puanları kullanıldıysa (ya da `inv_bos`) ve Leyla'ya en az bir kez danışıldıysa açılır. Arada
hafta, eylem puanları bitince ya da iş kalmayınca (`ara_bos`, tetikleyici) kapanır; `GO_T` ikinci haftanın bütün
puanları (ya da `ara_bos`) ve bir Leyla danışması ister. Görüşmelerden soru sormadan, belgelerden en az bir satıra
bakmadan, sahnelerden bir yere dokunmadan çıkılmaz (`askFirst`/`lookFirst`: her girişte sıfırlanan `sordu` sayacı;
deneme/büyüteç hakkı biterse bitiş açılır). Kaçış koşulları softlock'u önler; doğrulayıcı softlock bulmadı.

## 3. Delil zinciri: hangi bulgu neyi açar
Dengeleme turunda (2026-10-21) skor eşikleri kaldırıldı; beraat ve kısmi sonuç, aşağıdaki zincirin tutanağa geçen
halkalarına bağlandı. İkinci turda her güçlü halkanın temeli zorunlu oldu: B4 daraltması Bulgu 1'in teyidini, rapor
"Sınır" satırını (`clue_rapor_sinir`), ev hattını ve 07'nin zimmetini (`ded_laptop_ozan`) ister; O3 çelişkisi önce O2'yi;
sağlayıcı müzekkeresi mesajların cihaz 3'ten çıktığının Demirci'ye kabul ettirilmesini (`contra_s3`); somut suç duyurusu
tahtada `ded_laptop_ozan` ve `ded_ip_tekin` çıkarımlarını; nöbet defteri ipucu iki kaydı (01.40 emanet, 06.05 teslim);
hemşireye onam sorusu acil servisteki onam panosunu (`clue_onam_pano`); etik teklif üslup çıkarımlarını ve 25 Ekim
yazışmasını. Her halka bir önceki keşfe dayanır:

```
imaj i5–i8 ─► clue_cihaz3 ─► TP_CIHAZ ─► noterde hesap verisi ─(ertesi gün)► h3 ─► tahta: ded_bagli ─┐
                                 │                                 h4,h5,h6,h8 ─► clue_ip_ayni ─┐      │
TP_GECELER ─► acil servis sahnesi (bant) ─► Gülay (GUL_ONAM) ─► hastane kayıtları k3 ┐         │      │
imaj i4 (kilit) ──────────────────────────────────────────── tahta: ded_sarj ─► ded_hastane ─┤         │      │
ofis modemi ─► clue_ofis_hat ──────────────────────────────────────────────────────────────┼─────────┤      │
1. celse: S3'ü bastır → ded_hastane sun (kilit_mahkemede) ─► T1_ISP (+ hesap dökümü dosyada) ─► T1_GULAY
ARA 1. hafta sonu: sağlayıcı yanıtı ─► ev modemi (clue_ev_hat) ─► tahta: ded_ip_tekin
ARA 2. hafta: bilirkişi raporu r2/r3 ─► 2. celse B1 (cihaz) / B2 (kilit) teyidi; B4 "sanığın kendisi de olabilir" ─► ded_ip_tekin + ev hattı
ARA: hastanenin resmî yazısı (nöbet defteri) ─► 2. celse Gülay: G2 defter, G3 tereddüt ↔ kilit kaydı, G4 onam
```

| Kimlik | Ad | Tür | Keşif | Neyi destekler/çürütür | Sunulabilir |
|---|---|---|---|---|---|
| ev_tutanak | Ön inceleme tutanağı | EVIDENCE | Başlangıç | Rıza imzasız (S1) | ✓ |
| ev_imaj | Adli kopya raporu | EVIDENCE | Başlangıç | Ek-2/Ek-3 (S3, S4) | ✓ |
| ev_ss | Ekran görüntüleri | EVIDENCE | Başlangıç | Savcılık delili; bilirkişi "anekdot" (B3) | ✓ |
| ev_pay | 25 Ekim yazışması | EVIDENCE | Başlangıç | Savcının saik delili (T_05) | ✓ |
| ev_not | Yapışkan not | EVIDENCE | Ofis sahnesi | Ozan "şifreyi bilemem" (O4) | ✓ |
| ev_hesap | Hesap verisi (noter) | EVIDENCE | `TP_CIHAZ` → INV_HESAP_IND | Bağlı cihazlar, IP, arşivleme; dosyaya sunulmalı (`hesap_sunuldu`) | — |
| ev_hastane | Epikriz ve onam | EVIDENCE | INV_HKAYIT (← `GUL_ONAM`) ya da H1 celbi | G4: hemşire tanır (`onam_teyit`) | ✓ |
| ev_isp | Sağlayıcı yanıtı | EVIDENCE | T1_ISP → ARA | Hat Tekin Yapı'nın (O3) | ✓ |
| ev_laptop | 07 numaralı dizüstü | EVIDENCE | SUC_OZAN ve Ozan uyarılmamışsa | O2; T_00L imaj/hash kararı | ✓ |
| clue_nobet | Nöbet defteri 01.40 | CLUE | ARA `A_HRESMI` (← hastane celbi) | G2: bandın resmî karşılığı (`bant_teyit`) | ✓ |
| clue_ofis_hat / clue_ev_hat | Ofis ve ev hattı | CLUE | Ofis / ev modemi | T1_ISP önkoşulu / B4 daraltması | — |
| clue_rapor_cihaz / clue_rapor_kilit | Bilirkişi Bulgu 1/2 | CLUE | ARA_RAPOR r2/r3 | B1/B2 teyidinin önkoşulu | — |
| clue_* (diğer 20) | Belge/sahne/görüşme ipuçları | CLUE | §2 tablosu | Tahta kartları | clue_koli |
| ded_ss | Kararsız, imzasız görüntüler | INSIGHT | clue_imza_yok + clue_ss_karar | S1; görüntülerin dışlanması | ✓ |
| ded_zincir | Mühürsüz iki gün | INSIGHT | clue_muhur_yok + clue_son_erisim | S2, S4, B5 | ✓ |
| ded_bagli | Tehditler telefondan çıkmadı | INSIGHT | clue_cihaz3 + clue_bagli_cihaz | S3, B1 | ✓ |
| ded_sarj | Kilitli, hemşire masasında | INSIGHT (kart) | clue_kilit + clue_sarj | ded_hastane'nin ara halkası | — |
| ded_hastane | 02.14'te Tarık acil serviste | INSIGHT | ded_sarj + clue_onam | S3 (kilit_mahkemede), B2, G3 | ✓ |
| ded_laptop_ozan | 07 ofise dönmedi | INSIGHT | clue_envanter + clue_dock / clue_koli | O2 | ✓ |
| ded_ip_tekin | Tehdit hattının adresi | INSIGHT | ev_isp + clue_ip_ayni | B4 (ev hattıyla), O3 | ✓ |
| ded_uslup_ozan | Aynı imza | INSIGHT | clue_uslup_ozan / clue_vakif_yazi + clue_uslup_tehdit | O5 | ✓ |
| ded_uslup, ded_tablet, ded_arsiv | Ara çıkarımlar | INSIGHT | tahta | Skor, esas savunma dayanakları | — |

**Tahta:** INV_CIKARIM 8 tarif (7 çıkarım + `ded_sarj` ara kartı), ARA_CIKARIM aynı 8 tarif + 5 yeni (07 ×2, IP, üslup ×2).
Çeldirici kartlar: `clue_pay`, `clue_melis_teori`, `clue_kamera_h`, `clue_ofis_hat`, `clue_ev_hat` (yanlış eşleşme −50,
parametre başına bir kez).

**Gecikmeli teslimler:** hesap verisi (talep: `TP_CIHAZ` sonrası INV_HESAP_IND; okunması ertesi gün), sağlayıcı yanıtı
(T1_ISP → ARA 1. hafta sonu), hastanenin resmî yazısı (celp → ARA), dizüstü (SUC_OZAN ∧ ¬ozan_uyarildi → ARA son gece).

## 4. Çelişkiler (çapraz sorgu)
Ana çelişkilerde önce bastırmak gerekir; bastırmadan sunulan doğru delil cezasız geri çevrilir ("önce sorunuzu sorun").

**1. celse · Kom. Yrd. Demirci (H1_05T)**
| İfade | Bastır | Doğru delil | Sonuç |
|---|---|---|---|
| S1 rıza | imza sonraya kaldı | ev_tutanak, ded_ss | contra_s1 |
| S2 güvence altında | zarf bantlı, mühür yok | ded_zincir | contra_s2 |
| S3 telefondan, onun eliyle | "hepsi aynı şey" (zorunlu) | ded_bagli (tam), ded_hastane (`kilit_mahkemede`), ev_imaj (kısmi) | contra_s3 / partial_s3 |
| S4 bütünlük tam | hash 14.11 | ev_imaj, ded_zincir | contra_s4 |
| S5 kanaat | — | itiraz g_kanaat | legal_hits |

**2. celse · Bilirkişi (T_01T):** B1 cihaz 3 (bastır + ded_bagli; rapor Bulgu 1 okunmuş ve hesap dökümü dosyada olmalı →
`bilirkisi_cihaz`), B2 kilit (bastır + ded_hastane; Bulgu 2 okunmuş → `bilirkisi_kilit`), B3 ekran görüntüsü (ev_ss),
B4 "teknik olarak sanığın kendisi de olabilir" (bastır + ded_ip_tekin; B1 teyit edilmiş, rapor "Sınır" okunmuş, ev hattı ve
`ded_laptop_ozan` elde → `bilirkisi_hat`; B1 yoksa bilirkişi önce cihazı sorar (PS_B4C); zimmet ya da "Sınır" eksikse
cümlesini korur (PS_B4L); ded_hastane yalnızca bir gece için daraltır → `bilirkisi_gece`), B5 "hash bütünlüğü tam" (ded_zincir → `bilirkisi_zincir`).
Raporu okumadan sorulan soru −40 ile geri çevrilir.
**Hayri Sezer (T_02Q):** bildirimin saati (`hayri_saat`; soru ancak soruşturmada `HAY_SAAT` öğrenildiyse açık).
**Gülay Tunç (T_02GT, yeni):** G2 bant (bastır + nöbet defteri → `bant_teyit`), G3 "ikiye doğru telefona baktı galiba"
(bastır + ded_hastane → tanık kilit kaydıyla düzeltir, `gulay_teyit`), G4 onam (ev_hastane → `onam_teyit`).
**Ozan Tekin (T_03T):** O1 "pişman edeceğim" (itiraz g_kanaat), O2 her şeyi teslim (ded_laptop_ozan / ev_laptop /
clue_koli), O3 PUSULA'yı yalnızca telefonda (bastır + ev_isp / ded_ip_tekin; önce O2 çürütülmüş olmalı, yoksa tanık "plazanın
ortak ağı" der ve hâkim abone bilgisinin eli göstermediğini not eder: PS_O3N), O4 şifreyi bilemem (ev_not), O5 Tarık'ın
tarzı (ded_uslup_ozan). İki ve üzeri çelişki → CMK 48 hatırlatması, Ozan cevap vermez (T_04).

## 5. Node grafiği özeti
`PR_00 → PR_01 → BR_00 → BR_01 → BR_01B → BR_02 → INV_SABAH → INV_HUB` (3 gün × 6 EP; ofis, hastane sahneleri; Tarık ×2,
Hayri, Sinan, Kübra, Ozan, Gülay; tutanak, imaj, hesap, hastane belgeleri; talepler; tahta; Leyla) `→ INV_GECE → H1_KORIDOR (duruşma sabahı) → H1_00…H1_06`
(savunma tavsiyesi, katılan, ekran görüntüsü itirazı, Demirci, talepler) `→ H1_07_1…4` (ara karar) `→ ARA_GIRIS_0 → ARA_GIRIS → ARA_HUB` (ARA_AKSAM → ARA_HAFTA2: Leyla'nın ikinci hafta dersi)
(2 hafta × 3 EP: Melis, Nurten/demirbaş, Tarık'ın evi, bilirkişi raporu, hastanenin resmî yazısı, vakıf dosyası, suç
duyurusu, tahta, Leyla; olay: Ozan'ın ziyareti) `→ [ARA_TEKLIF]` (etik tuzak, yalnızca güçlü davada) `→ ARA_SON → T_SABAH → T_00 →
[T_00K karartma kaydı] → [T_00L dizüstü] → T_01/T_01T → T_01S → T_02/T_02Q → [T_02G/T_02GT → T_02GS Gülay] → T_03/T_03T →
[T_04 CMK 48] → [T_04K katılan beyanı] → T_05 → T_06 (mütalaa, dört varyant) → T_08P → T_08 → T_09 → T_10 → T_10A…E`
(karar arası: Deniz tutanağı sayar) `→ T_10Z → R_KARAR`; çöküş: `T_COKUS`.

## 6. Sonuçlar
Hiçbir sonuç skora ya da ikna göstergesine bağlı değildir; koşullar yalnızca tutanağa geçen bulguları okur
(yüklemler `00-meta`: `kaynak_suphesi`, `bilirkisi_teyit`, `alibi_kayit`, `hat_kayit`).

| Öncelik | Kimlik | Sınıf | Koşul (tutanak) | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | ETIK | OTHER | `karartma` (TK_SIL / TK_GIRIS; teklif yalnızca sütun + 9 Kasım salonda, rapor okunmuş, somut suç duyurusu, üslup çıkarımları ve 25 Ekim yazışması elde) | Baroya ve başsavcılığa bildirim | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | ¬çöküş ∧ gerçek fail savunması (contra_o3 ∧ (CMK 48 ∨ contra_o2) ∧ suç duyurusu) ∧ kaynak ∧ bilirkişi teyidi ∧ 9 Kasım (alibi_kayit) ∧ `hat_kayit` ((bilirkisi_hat ∨ laptop_imaj) ∧ contra_o3) | Beraat, gerçek fail yönünden suç duyurusu, CMK 141 hatırlatması | ×1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | ¬çöküş ∧ `beraat_kaydi` = kaynak ∧ bilirkişi teyidi ∧ `el_daraldi` (bilirkisi_hat ∨ contra_o3 ∨ (laptop_imaj ∧ contra_o2) ∨ alibi_kayit) | Şüpheden beraat | ×1,0 |
| 4 | KISMI | REDUCED | ¬çöküş ∧ alibi_kayit ∧ ¬kaynak_suphesi | 9 Kasım işlemleri hükümden çıkar: 134'ten beraat; 6 ve 12 Kasım için 107/2+43/1: 1y3a → TCK 62: 1y15g, HAGB, 5 yıl denetim | ×0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan (çöküş varyantı epilogla); gerekçe tutanakta neyin eksik olduğunu söyler | 134/2: 2y6a + 107/2,43/1: 1y3a | ×0,6 |

Hukuki tutarlılık: kaynak tutanaktayken 9 Kasım mazereti de kurulduysa üç mesajı gönderen tek cihaz o gece sanık acil
servisteyken çalışmıştır → BERAAT_E; KISMI yalnızca kaynak hiç tartışılmadığında verilir (gerekçe bunu söyler). Kötü
bir esas savunma hükmü değiştirmez (hâkim taleple bağlı değil); T08_D meslek ihlali sayılır (`ethics`, epilog).
Savcının mütalaası aynı ayrımı izler (beraat / 9 Kasım yönünden beraat / takdir + mahkûmiyet / mahkûmiyet). Ayrıntı:
`docs/legal/son-mesaj.md` §4/13–18.

## 7. Skor
- Kategoriler: ARASTIRMA, DELIL_ANALIZI, SORGULAMA, USUL_BILGISI, HUKUKI_BILGI, SAVUNMA_STRATEJISI; döküm satırları: delil
  toplama, çapraz sorgu, itiraz isabeti, savunma, hatalı delil; güvenilirlik bonusu (kalp × 100).
- Skor yalnızca performans göstergesidir; eşik çubuğu tek bantlıdır ("Savunma puanı") ve hükmü etkilemez.
- Bedeller: yanlış delil (♥ ve −150), raporu okumadan bilirkişiye soru (−40), belge/sahne ıskası (−10/−20, deneme hakkı),
  tahta ıskası (−50), sert görüşme tonu (güven), etik dışı seçenekler (Melis'i doğrudan arama, tanığa yön verme, Ozan'a
  teori anlatma → dizüstü kaybolur). Güvenilirlik sıfırlanırsa çöküş.

## 8. Golden path'ler
| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 12135 | Usul stratejisi, tam soruşturma; Gülay ve Hayri dinlenir, bilirkişi B1/B2/B4/B5 daraltılır, Ozan'a karşı delil (O2 → O3); esas savunma "şüpheden" |
| G_B | BERAAT_B | 12255 | Masumiyet stratejisi; hat + demirbaş + üslup + 9 Kasım; esas savunmada gerçek fail |
| G_KISMI | KISMI | 8020 | Noter son güne kalır, döküm arada okunur ama salona taşınmaz (kaynak tartışılmaz); 9 Kasım bilirkişi, Hayri ve Gülay ile kurulur; terditli savunma |
| G_M | MAHKUMIYET | 4430 | Sütunu ve 9 Kasım'ı salona taşımadan; "Melis yazdı" iftira savunması, T08_D |
| G_ETIK | ETIK | 11645 | Güçlü dava, ama Tarık'ın "sil" teklifi kabul; B4 önce sorulur (PS_B4C); hash uyuşmazlığı duruşmada ortaya çıkar |
| W | MAHKUMIYET | 8040 | Rapor "Sınır" okunmadan B4 (PS_B4L), sonra yanlış delillerle güvenilirlik sıfırlanır (çöküş) |

**Erken çözüm denetimi (ikinci dengeleme turu, 2026-10-21).** Tek süreç, bütçeli arama (`/tmp/sm06-fix/probe.mts`,
`probe2.mts`): golden path ve elle kurulmuş tohumlardan hoşgörülü delta küçültme 16→1, ardından her konumda
`enumerateActions` alternatifiyle takas + 1–12 aksiyon silme; hedef başına ≤ 450 sn, ölçüt aksiyon sayısı ve (ayrı
koşuda) `estimateActions` dakikası. BERAAT_E için iki ayrı rota tohumlandı (hat/zimmet rotası ve 9 Kasım + kaynak rotası).

| Hedef | En kısa (aksiyon) | TIPIK'e (224) oran | En kısa (dakika) | Rota ve zorunlu halkalar |
|---|---|---|---|---|
| BERAAT_E | 138 | %61,6 | 75,6 dk | Ek-3 dört satır, müvekkil (TP_GECELER, TP_CIHAZ), noter, hesap h3+h4–h8, ofis modemi ve dok, acil servis (şarj + onam panosu) + Gülay + kayıtlar, iki adımlı tahta, Demirci'ye cihaz ve 9 Kasım, T1_ISP, demirbaş, ev modemi, ARA tahtası (07, IP), rapor r2+r6, B1 ve B4; ayrıca bütün eylem puanları ve iki Leyla danışması. 9 Kasım + kaynak rotası: 143 |
| BERAAT_B | 156 | %69,6 | 86,4 dk | yukarıdakiler + 9 Kasım'ın bütün tutanağı, suç duyurusu, Ozan'ın çapraz sorgusu (O2 → O3) |
| KISMI | 138 | %61,6 | 78,9 dk | müvekkil, acil servis + Gülay (üç konu) + kayıtlar, Hayri (saat), tahta, Demirci'ye 9 Kasım, T1_GULAY + bilirkişi talebi, hastane celbi → nöbet defterinin iki kaydı, rapor r3, B2, Hayri'nin saati, Gülay G2/G3/G4 |
| ETIK | 137 | %61,2 | 74,4 dk | sütun + 9 Kasım salonda, hat zinciri, demirbaş, tahta (07, IP, üslup), somut suç duyurusu, rapor; teklif kabulü |
| MAHKUMIYET | 95 | — (varsayılan) | 60,5 dk | bütün eylem puanları, iki Leyla danışması, duruşmalar ve istinaf gecesi epiloğu |

Bütün sonuçların en kısa yolu 60 dakikanın, beraat ve varsayılan dışı sonuçların en kısa yolu TIPIK aksiyonlarının
%60'ının üstündedir; hiçbir koşul skora bağlı değildir. Mahkûmiyetin marjı dardır (60,5 dk); varsayılan sonuçtur ve
oran kuralının dışındadır.

## 9. Süre ve sözcük ölçümü
`npm run case:duration -- son-mesaj` / `case:validate` (2026-10-21, ikinci dengeleme turu):

```
TIPIK         114.4 dk   16557 sözcük   224 aksiyon  BERAAT_E (12135)
G_B           110.0 dk   15875 sözcük   218 aksiyon  BERAAT_B (12255)
G_KISMI        96.0 dk   13836 sözcük   191 aksiyon  KISMI (8020)
G_M            77.5 dk   11389 sözcük   142 aksiyon  MAHKUMIYET (4430)
G_ETIK        114.3 dk   16473 sözcük   228 aksiyon  ETIK (11645)
W              95.5 dk   13789 sözcük   189 aksiyon  MAHKUMIYET (8040)
==> TİPİK YOL (TIPIK): 114.4 dk  ✓ süre hedefte · SÖZCÜK BÜTÇESİ ✓ · KAPI: ✓ GEÇTİ
```

`node tools/content/word-count.mjs content/cases/son-mesaj` (yalnızca satırlar): TIPIK **13238** sözcük (önceki tur
12457); paket 1466 satır, 20890 satır sözcüğü, ekran metinleriyle toplam 26452. En uzun satır 219 karakter.

`case:validate`: PASSED, 0 hata; kapsam node 111/111, seçenek 215/215, kural 125/125, delil 51/51; softlock/sızıntı
yok. Uyarılar: dört INDISTINGUISHABLE_CHOICES (görüşme konuları; TP_OZAN ve TP_VAKIF artık sonraki içeriği açıyor),
BFS bütçesi ve yaklaşık yirmi SOFTLOCK_UNVERIFIED (evrelerin bütün eylem puanlarını istemesi kaçış aramasını
uzattı; kaçış koşulları `inv_bos`/`ara_bos` ve golden path'ler her durumda bitişe ulaşıyor). Satır sınırı 220 karakter
(DSL derleme hatası).
