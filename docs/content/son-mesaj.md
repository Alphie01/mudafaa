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

**Evre kapıları.** `GO_H1` yalnızca 3. günde ya da müvekkil görüşmesi, tutanak, imaj raporu ve ofis araması yapıldıysa
açılır. Arada "Haftayı kapat" (`A_BEKLE`) ilk haftada ancak en az iki iş yapıldıktan sonra görünür (Nurten ve ev her zaman
açıktır, softlock yok); ikinci hafta her zaman kapatılabilir. `GO_T` 2. haftada, üç ara işi tamamlandıysa ya da eylem
puanları bittiyse açılır. Hub'da "Günü kapat" (`I_BEKLE`) doğrulayıcının kaçış araması için korunur.

## 3. Delil zinciri: hangi bulgu neyi açar
Dengeleme turunda (2026-10-21) skor eşikleri kaldırıldı; beraat ve kısmi sonuç, aşağıdaki zincirin tutanağa geçen
halkalarına bağlandı. Her halka bir önceki keşfe dayanır:

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
B4 "teknik olarak sanığın kendisi de olabilir" (bastır + ded_ip_tekin, ev hattı belgesi elde → `bilirkisi_hat`;
ded_hastane yalnızca bir gece için daraltır → `bilirkisi_gece`), B5 "hash bütünlüğü tam" (ded_zincir → `bilirkisi_zincir`).
Raporu okumadan sorulan soru −40 ile geri çevrilir.
**Hayri Sezer (T_02Q):** bildirimin saati (`hayri_saat`; soru ancak soruşturmada `HAY_SAAT` öğrenildiyse açık).
**Gülay Tunç (T_02GT, yeni):** G2 bant (bastır + nöbet defteri → `bant_teyit`), G3 "ikiye doğru telefona baktı galiba"
(bastır + ded_hastane → tanık kilit kaydıyla düzeltir, `gulay_teyit`), G4 onam (ev_hastane → `onam_teyit`).
**Ozan Tekin (T_03T):** O1 "pişman edeceğim" (itiraz g_kanaat), O2 her şeyi teslim (ded_laptop_ozan / ev_laptop /
clue_koli), O3 PUSULA'yı yalnızca telefonda (bastır + ev_isp / ded_ip_tekin), O4 şifreyi bilemem (ev_not), O5 Tarık'ın
tarzı (ded_uslup_ozan). İki ve üzeri çelişki → CMK 48 hatırlatması, Ozan cevap vermez (T_04).

## 5. Node grafiği özeti
`PR_00 → PR_01 → BR_00 → BR_01 → BR_01B → BR_02 → INV_SABAH → INV_HUB` (3 gün × 6 EP; ofis, hastane sahneleri; Tarık ×2,
Hayri, Sinan, Kübra, Ozan, Gülay; tutanak, imaj, hesap, hastane belgeleri; talepler; tahta; Leyla) `→ INV_GECE → H1_00…H1_06`
(savunma tavsiyesi, katılan, ekran görüntüsü itirazı, Demirci, talepler) `→ H1_07_1…4` (ara karar) `→ ARA_GIRIS → ARA_HUB`
(2 hafta × 3 EP: Melis, Nurten/demirbaş, Tarık'ın evi, bilirkişi raporu, hastanenin resmî yazısı, vakıf dosyası, suç
duyurusu, tahta, Leyla; olay: Ozan'ın ziyareti) `→ [ARA_TEKLIF]` (etik tuzak, yalnızca güçlü davada) `→ ARA_SON → T_00 →
[T_00K karartma kaydı] → [T_00L dizüstü] → T_01/T_01T → T_01S → T_02/T_02Q → [T_02G/T_02GT → T_02GS Gülay] → T_03/T_03T →
[T_04 CMK 48] → [T_04K katılan beyanı] → T_05 → T_06 (mütalaa, dört varyant) → T_08P → T_08 → T_09 → T_10 → T_10A…E`
(karar arası: Deniz tutanağı sayar) `→ T_10Z → R_KARAR`; çöküş: `T_COKUS`.

## 6. Sonuçlar
Hiçbir sonuç skora ya da ikna göstergesine bağlı değildir; koşullar yalnızca tutanağa geçen bulguları okur
(yüklemler `00-meta`: `kaynak_suphesi`, `bilirkisi_teyit`, `alibi_kayit`, `hat_kayit`).

| Öncelik | Kimlik | Sınıf | Koşul (tutanak) | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | ETIK | OTHER | `karartma` (TK_SIL / TK_GIRIS; teklif yalnızca sütun + 9 Kasım salonda, rapor okunmuş, suç duyurusu verilmişken gelir) | Baroya ve başsavcılığa bildirim | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | ¬çöküş ∧ gerçek fail savunması (contra_o3 ∧ (CMK 48 ∨ contra_o2) ∧ suç duyurusu) ∧ kaynak ∧ bilirkişi teyidi ∧ 9 Kasım (alibi_kayit) ∧ hat (bilirkisi_hat ∧ contra_o3) ∧ (contra_o2 ∨ laptop_imaj) | Beraat, gerçek fail yönünden suç duyurusu, CMK 141 hatırlatması | ×1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | ¬çöküş ∧ kaynak (contra_s3 ∨ bilirkisi_cihaz) ∧ bilirkişi teyidi ∧ bilirkisi_hat (B4 üç gece için daraltıldı) | Şüpheden beraat | ×1,0 |
| 4 | KISMI | REDUCED | ¬çöküş ∧ alibi_kayit (bilirkisi_kilit ∧ hayri_saat ∧ gulay_teyit ∧ onam_teyit ∧ bant_teyit) | 9 Kasım işlemleri hükümden çıkar: 134'ten beraat; 6 ve 12 Kasım için 107/2+43/1: 1y3a → TCK 62: 1y15g, HAGB, 5 yıl denetim | ×0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan (çöküş varyantı epilogla) | 134/2: 2y6a + 107/2,43/1: 1y3a | ×0,6 |

Hukuki tutarlılık: kaynak + 9 Kasım mazereti tutanakta olup hat bilgisi yoksa, bilirkişinin "sanığın kendisi de olabilir"
cümlesi öbür iki gece için açık kalır → KISMI (gerekçe bunu söyler); hat bilgisi üç geceyi birlikte kapsar → BERAAT_E.
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
| TIPIK | BERAAT_E | 12155 | Usul stratejisi, tam soruşturma; Gülay ve Hayri dinlenir, bilirkişi B1/B2/B4/B5 daraltılır, Ozan'a karşı delil; esas savunma "şüpheden" |
| G_B | BERAAT_B | 12215 | Masumiyet stratejisi; hat + demirbaş + üslup + 9 Kasım; esas savunmada gerçek fail |
| G_KISMI | KISMI | 7860 | Hesap verisi soruşturmada okunmaz, arada okunur ama salona taşınmaz; 9 Kasım bilirkişi, Hayri ve Gülay ile kurulur; terditli savunma |
| G_M | MAHKUMIYET | 4200 | Sütunu ve 9 Kasım'ı salona taşımadan; "Melis yazdı" iftira savunması |
| G_ETIK | ETIK | 11475 | Güçlü dava, ama Tarık'ın "sil" teklifi kabul; hash uyuşmazlığı duruşmada ortaya çıkar |
| W | MAHKUMIYET | 7830 | Çöküş: yanlış delillerle güvenilirlik sıfırlanır |

**Erken çözüm denetimi (2026-10-21, dengeleme sonrası).** Tek süreç, bütçeli arama (`/private/tmp/sm06-rb/probe.mjs`):
golden path ve elle kurulmuş en kısa tohumlardan hoşgörülü (reddedilen aksiyon atlanır) delta küçültme 32→1, ardından
her konumda `enumerateActions` alternatifiyle takas + 1–8 aksiyon silme; tohum başına ≤ 200 sn. Elle kurulan tohumlar
gün/hafta kapatmayı (`I_BEKLE`/`A_BEKLE`) en ucuz biçimde kullanır.

| Hedef | En kısa | TIPIK'e (223) oran | Süre | İçerdiği zorunlu halkalar |
|---|---|---|---|---|
| BERAAT_E | 103 aksiyon | %46 | 60,9 dk | Ek-3 dört satır, müvekkil (TP_GECELER, TP_CIHAZ), noter, hesap h3+h4–h8, ofis modemi, acil servis + Gülay + kayıtlar, iki adımlı tahta, dökümün dosyaya sunulması, Demirci'ye 9 Kasım, T1_ISP, sağlayıcı yanıtı, ev modemi, ARA tahtası, rapor r2, B1 ve B4 (bastır + sun) |
| BERAAT_B | 134 aksiyon | %60 | 76,7 dk | yukarıdakiler + 9 Kasım'ın bütün tutanağı, demirbaş, suç duyurusu, Ozan'ın çapraz sorgusu (O2, O3) |
| KISMI | 96 aksiyon | %43 | 61,5 dk | müvekkil, acil servis + Gülay (üç konu) + kayıtlar, Hayri (saat), tahta, Demirci'ye 9 Kasım, T1_GULAY + bilirkişi talebi, hastane celbi → nöbet defteri (ARA), rapor r3, B2, Hayri'nin saati, Gülay G2/G3/G4 |
| ETIK | 101 aksiyon | %45 | 60,8 dk | sütun + 9 Kasım salonda, hat zinciri, demirbaş, suç duyurusu, rapor; teklif kabulü |
| MAHKUMIYET | 53 aksiyon | — | 37,9 dk | varsayılan sonuç (hiçbir şey kurulmadan duruşmaya gitmek) |

Bütün beraat ve varsayılan dışı sonuç yolları 60 dakikanın üstündedir. Beraat ve KISMI artık skorla değil, ikinci celsede
tutanağa geçen bir teyitle (bilirkişi B1/B2/B4, Gülay G2–G4) ve aradaki bir bulguyla (bilirkişi raporu; KISMI için ayrıca
nöbet defteri) kurulur; birinci celsede 9 Kasım'ın Demirci'ye sunulması sağlayıcı ve hemşire taleplerinin önkoşuludur.
**Kalan açık:** BERAAT_E, KISMI ve ETIK'in en kısa yolları TIPIK'in aksiyonlarının %60'ının altındadır. 2-e beraatinin
hukuken yeterli asgari tutanağı (kaynak + bilirkişinin hat bilgisiyle daraltılması) ve KISMI'nin tek gecelik mazereti,
TIPIK'in kapsadığı 2-b yolunun (Ozan, 07, üslup, vakıf, Melis) tamamını gerektirmez; bu yolları beraate şart koşmak,
hukuken beraat gerektiren bir tutanakta mahkûmiyete yol açardı (§6, hukuki notlar §4/14).

## 9. Süre ve sözcük ölçümü
`npm run case:duration -- son-mesaj` (2026-10-21):

```
TIPIK         109.8 dk   15742 sözcük   223 aksiyon  BERAAT_E (12155)
G_B           103.3 dk   14836 sözcük   209 aksiyon  BERAAT_B (12215)
G_KISMI        83.9 dk   12139 sözcük   165 aksiyon  KISMI (7860)
G_M            66.2 dk    9451 sözcük   137 aksiyon  MAHKUMIYET (4200)
G_ETIK        106.4 dk   15197 sözcük   220 aksiyon  ETIK (11475)
W              85.5 dk   12051 sözcük   185 aksiyon  MAHKUMIYET (7830)
==> TİPİK YOL (TIPIK): 109.8 dk  ✓ süre hedefte · SÖZCÜK BÜTÇESİ ✓ · KAPI: ✓ GEÇTİ
```

`case:validate`: PASSED, 0 hata; kapsam node 107/107, seçenek 216/216, kural 122/122, delil 49/49; softlock/sızıntı yok;
yalnızca altı INDISTINGUISHABLE_CHOICES (görüşme konuları) ve BFS bütçesi uyarısı; 138,8–211,7 sn (yük ≈ 3–8).
Satır sınırı 220 karakter (DSL derleme hatası).
