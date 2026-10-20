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

| Olgu | Gerçek | Nasıl keşfedilir |
|---|---|---|
| Ekran görüntüleri kararsız alındı | 12.11 15.44 görüntü, 13.11 10.20 karar, imza hanesi boş | INV_TUTANAK (büyüteç t6, karşılaştır t2) |
| Telefon mühürsüz iki gün durdu | Zarf bantlı; son kilit açılışı 12.11 15.52; imaj 14.11 | INV_TUTANAK t4 + INV_IMAJ i3 |
| Mesajlar telefondan çıkmadı | Ek-3 `sender_device = 3` | INV_IMAJ (karşılaştır i6) |
| Cihaz 3 = OFIS-LAPTOP-07 | 14 Şubat'tan beri açık masaüstü oturumu | INV_HESAP (hesap verisi; noter + hash) |
| 9 Kasım gecesi telefon kilitli | Ek-2 kilit olayları; onam formu 02.10; bant "AKSOY 01.40" | INV_IMAJ i4, INV_HKAYIT k3, acil servis sahnesi, Gülay |
| Sohbeti gizleyen hesabı kullanan | Arşivleme 06.11 02.13, cihaz 3 | INV_HESAP h7 |
| Üç gece tek IP | 85.105.44.17 (cihaz 3), ev hattı 176.88.12.4 (cihaz 0) | INV_HESAP h4 |
| 07 ofise dönmedi | Boş dok "07"; demirbaş listesinde iade hanesi boş; kolide dizüstü yok | Ofis sahnesi, ARA_DEMIRBAS d4, ev sahnesi |
| Hat Tekin Yapı'nın | Sağlayıcı yanıtı | 1. celsede T1_ISP talebi → ARA gün sonu teslimi |
| Üslup | Tarık küçük harf/noktasız; tehditler "Sn.", üç nokta, "Saygılar." = Ozan'ın e-postaları | INV_IMAJ i5/i6, ofisteki e-posta çıktısı, Melis (ARA), vakıf yazısı |
| Ozan kaydı herkesten önce biliyordu | 10.11 09.12 vakfa e-posta | ARA_VAKIF v5 |
| Dizüstü Tekin Yapı'da | Arşiv dolabında, açık oturumla | ARA_SUC (somut dayanaklı suç duyurusu) + Ozan uyarılmamışsa |

**Gizem kuralları.** Soğuk açılış yalnızca alıcının gözünden (isimsiz "BİR KADIN"). Ozan birinci evrede sıcak, yardımsever
bir savcılık tanığıdır; Kübra'nın Ozan'a dair konuları yalnızca ilgili bulgular bulunduktan sonra açılır (`KUB_CIHAZLAR` ←
`clue_cihaz3`, `KUB_OZAN` ← `clue_dock`). Ozan'ın adı şüpheyle ilk kez, 07'nin ofise dönmediği kurulduktan sonra anılır.

## 3. Delil zinciri

| Kimlik | Ad | Tür | Keşif | Neyi destekler/çürütür | Sunulabilir |
|---|---|---|---|---|---|
| ev_tutanak | Ön inceleme tutanağı | EVIDENCE | Başlangıç | Rıza imzasız (S1) | ✓ |
| ev_imaj | Adli kopya raporu | EVIDENCE | Başlangıç | Ek-2/Ek-3 (S3, S4) | ✓ |
| ev_ss | Ekran görüntüleri | EVIDENCE | Başlangıç | Savcılık delili; bilirkişi "anekdot" (B3) | ✓ |
| ev_pay | 25 Ekim yazışması | EVIDENCE | Başlangıç | Savcının saik delili (T_05) | ✓ |
| ev_not | Yapışkan not | EVIDENCE | Ofis sahnesi | Ozan "şifreyi bilemem" (O4) | ✓ |
| ev_hesap | Hesap verisi (noter) | EVIDENCE | INV_HESAP_IND → ertesi gün | Bağlı cihazlar, IP, arşivleme | — |
| ev_hastane | Epikriz ve onam | EVIDENCE | INV_HKAYIT | 02.10 onam | — |
| ev_isp | Sağlayıcı yanıtı | EVIDENCE | T1_ISP → ARA | Hat Tekin Yapı'nın (O3) | ✓ |
| ev_laptop | 07 numaralı dizüstü | EVIDENCE | SUC_OZAN ve Ozan uyarılmamışsa | O2; T_00L imaj/hash kararı | ✓ |
| clue_* (20) | Belge/sahne/görüşme ipuçları | CLUE | §2 tablosu | Tahta kartları | clue_koli |
| ded_ss | Kararsız, imzasız görüntüler | INSIGHT | clue_imza_yok + clue_ss_karar | S1; görüntülerin dışlanması | ✓ |
| ded_zincir | Mühürsüz iki gün | INSIGHT | clue_muhur_yok + clue_son_erisim | S2, S4 | ✓ |
| ded_bagli | Tehditler telefondan çıkmadı | INSIGHT | clue_cihaz3 + clue_bagli_cihaz | S3, B1 — davanın ekseni | ✓ |
| ded_hastane | 02.14'te Tarık acil serviste | INSIGHT | clue_kilit + clue_onam | S3, B2 | ✓ |
| ded_laptop_ozan | 07 ofise dönmedi | INSIGHT | clue_envanter + clue_dock / clue_koli | O2 | ✓ |
| ded_ip_tekin | Tehdit hattının adresi | INSIGHT | ev_isp + clue_ip_ayni | O3 | ✓ |
| ded_uslup_ozan | Aynı imza | INSIGHT | clue_uslup_ozan / clue_vakif_yazi + clue_uslup_tehdit | O5 | ✓ |
| ded_uslup, ded_tablet, ded_arsiv | Ara çıkarımlar | INSIGHT | tahta | Skor, esas savunma dayanakları | — |

**Tahta:** INV_CIKARIM 9 tarif (8 çıkarım; 02.14 çıkarımının iki yolu), ARA_CIKARIM aynı 8 tarif + 5 yeni (07, IP, üslup, vakıf yazısı); toplam 10 farklı çıkarım. Çeldirici kartlar:
`clue_pay`, `clue_melis_teori`, `clue_kamera_h`, `clue_sarj` (yanlış eşleşme −50, parametre başına bir kez).

**Gecikmeli teslimler:** hesap verisi (talep: INV_HESAP_IND, teslim: gün sonu, noter seçeneği hash'li delil verir),
sağlayıcı yanıtı (T1_ISP → ARA 1. hafta sonu), dizüstü (SUC_OZAN ∧ ¬ozan_uyarildi → ARA son gece).

## 4. Çelişkiler (çapraz sorgu)

**1. celse · Kom. Yrd. Demirci (H1_05T)**
| İfade | Bastır | Doğru delil | Sonuç |
|---|---|---|---|
| S1 rıza | imza sonraya kaldı | ev_tutanak, ded_ss | contra_s1 |
| S2 güvence altında | zarf bantlı, mühür yok | ded_zincir | contra_s2 |
| S3 telefondan, onun eliyle | "hepsi aynı şey" | ded_bagli (tam), ev_imaj (kısmi), ded_hastane | contra_s3 / partial_s3 |
| S4 bütünlük tam | hash 14.11 | ev_imaj, ded_zincir | contra_s4 |
| S5 kanaat | — | itiraz g_kanaat | legal_hits |

**2. celse · Bilirkişi (T_01T):** B1 cihaz 3 (ded_bagli), B2 kilit (ded_hastane), B3 ekran görüntüsü (ev_ss).
**Ozan Tekin (T_03T):** O1 "pişman edeceğim" (itiraz g_kanaat), O2 her şeyi teslim (ded_laptop_ozan / ev_laptop /
clue_koli), O3 PUSULA'yı yalnızca telefonda (ev_isp / ded_ip_tekin), O4 şifreyi bilemem (ev_not), O5 Tarık'ın tarzı
(ded_uslup_ozan). İki ve üzeri çelişki → savcı CMK 48 hatırlatması ister, Ozan cevap vermez (T_04).

## 5. Node grafiği özeti
`PR_00 → PR_01 → BR_00 → BR_01 → BR_01B → BR_02 → INV_SABAH → INV_HUB` (3 gün × 6 EP; ofis, hastane sahneleri; Tarık ×2,
Hayri, Sinan, Kübra, Ozan, Gülay; tutanak, imaj, hesap, hastane belgeleri; talepler; tahta; Leyla) `→ INV_GECE → H1_00…H1_07`
(savunma tavsiyesi, katılan, ekran görüntüsü itirazı, Demirci, talepler, ara karar) `→ ARA_GIRIS → ARA_HUB` (2 hafta × 3 EP:
Melis, Nurten/demirbaş, Tarık'ın evi, bilirkişi raporu, vakıf dosyası, suç duyurusu, tahta, Leyla; olay: Ozan'ın ziyareti)
`→ ARA_TEKLIF` (etik tuzak) `→ ARA_SON → T_00 → [T_00L dizüstü] → T_01/T_01T → T_02/T_02Q → T_03/T_03T → [T_04 CMK 48] →
[T_04K katılan beyanı] → T_05 → T_06 → T_08P → T_08 → T_09 → R_KARAR`; çöküş: `T_COKUS`.

## 6. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | ETIK | OTHER | `karartma` (TK_SIL / TK_GIRIS) | Baroya ve başsavcılığa bildirim | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | ¬cokus ∧ gercek_fail ∧ contra_o3 ∧ pers ≥ 7 ∧ final ≥ 8000 | Beraat, adli kontrol kalkar, suç duyurusu | ×1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | ¬cokus ∧ kaynak_suphesi ∧ ek_supheler(≥2) ∧ final ≥ 7000 | Şüpheden beraat | ×1,0 |
| 4 | KISMI | REDUCED | ¬cokus ∧ (terditli ∨ supheden ∨ ss_excluded) ∧ final ≥ 3000 | 134'ten beraat; 107/2+43/1: 1y3a → TCK 62: 1y15g, HAGB | ×0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan (çöküş varyantı epilogla) | 134/2: 2y6a + 107/2,43/1: 1y3a | ×0,6 |

Epiloglar `OutcomeDef.epilogue` ile; BERAAT_E epilogu suç duyurusu verilip dizüstü bulunduysa farklı bir kapanış gösterir;
MAHKÛMİYET epilogu sütunun görülüp görülmediğine ve çöküşe göre değişir; "Beraat ettiririz" sözü verildiyse olumsuz
sonuçlarda ek satır.

## 7. Skor
- Kategoriler: ARASTIRMA, DELIL_ANALIZI, SORGULAMA, USUL_BILGISI, HUKUKI_BILGI, SAVUNMA_STRATEJISI; döküm satırları: delil
  toplama, çapraz sorgu, itiraz isabeti, savunma, hatalı delil; güvenilirlik bonusu (kalp × 100).
- Eşik çubuğu: Mahkûmiyet 0 · Kısmi 3000 · Beraat 7000 (BERAAT_B için 8000), `thresholds.ts`.
- Bedeller: yanlış delil (♥ ve −150), belge/sahne ıskası (−10/−20, deneme hakkı), tahta ıskası (−50), sert görüşme tonu
  (güven), etik dışı seçenekler (Melis'i doğrudan arama, tanığa yön verme, Ozan'a teori anlatma → dizüstü kaybolur).
- `case:validate` final skor aralığı: −5720…11265.

## 8. Golden path'ler
| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 11175 | Usul stratejisi, tam soruşturma, Ozan'a karşı delil, esas savunma "şüpheden" |
| G_B | BERAAT_B | 11265 | Masumiyet stratejisi; IP + demirbaş + üslup; esas savunmada gerçek fail |
| G_KISMI | KISMI | 4485 | Eksik delil zinciri; terditli savunma |
| G_M | MAHKUMIYET | 5250 | Sütunu sunmadan; "Melis yazdı" iftira savunması |
| G_ETIK | ETIK | 10285 | Güçlü dava, ama Tarık'ın "sil" teklifi kabul |
| W | MAHKUMIYET | 7580 | Çöküş: yanlış delillerle güvenilirlik sıfırlanır |

**Erken çözüm denetimi (2026-10-20):** golden path'ler üzerinde aksiyon silme (delta) aramasıyla yerel en kısa yollar:
BERAAT_E 122 aksiyon (tipik yolun %61'i), BERAAT_B 132 aksiyon (%66). Her ikisi de ded_bagli (Ek-3 sütunu + noter tespitli
hesap verisi), ded_hastane ve 1. celsede Demirci'nin çürütülmesini zorunlu tutar; BERAAT_B ayrıca IP yanıtı, demirbaş ve
Ozan'ın çapraz sorgusunu ister.

## 9. Süre ve sözcük ölçümü
`npm run case:duration -- son-mesaj` (2026-10-20):

```
TIPIK          96.9 dk   13839 sözcük   200 aksiyon  BERAAT_E (11175)
G_B            95.5 dk   13709 sözcük   193 aksiyon  BERAAT_B (11265)
G_KISMI        65.2 dk    9510 sözcük   124 aksiyon  KISMI (4485)
G_M            67.8 dk    9629 sözcük   143 aksiyon  MAHKUMIYET (5250)
G_ETIK         90.0 dk   12745 sözcük   192 aksiyon  ETIK (10285)
W              79.7 dk   11243 sözcük   172 aksiyon  MAHKUMIYET (7580)
==> TİPİK YOL (TIPIK): 96.9 dk  ✓ süre hedefte · KAPI: ✓ GEÇTİ
```

Paket toplamı (testler hariç bütün metin): ~24 100 sözcük. Satır sınırı 220 karakter (DSL derleme hatası).
