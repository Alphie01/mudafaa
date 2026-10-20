# Dava #04 "Beyaz Toz" — Dava Tasarımı

> Kaynak: `content/src/beyaz-toz/` (yazım kiti) → `content/cases/beyaz-toz/` (`npm run case:build -- beyaz-toz`).
> Hikâye kitabı (ton, kadro, sahneler, epiloglar): `docs/content/beyaz-toz-hikaye.md`. Hukuki notlar:
> `docs/legal/beyaz-toz.md`. Kılavuz: `docs/content/authoring-guide.md`. Lineup satırı: #04 (rütbe yok, zorluk 2/5).

## 1. Logline ve tema
- Görükle'de bir öğrenci evinin kilitli arka odasından 46 paket kokain, hassas terazi ve kilitli poşetler çıkar; kira
  sözleşmesi müvekkil Kaan Yıldız'ın adınadır. Kaan kullanıcıdır, tedavidedir ve "oda ev arkadaşım Barış'ın" der.
  Savcılığa göre Barış yoktur. İddia: TCK 188/3, 188/4-a (15–30 yıl).
- Dramatik soru: kullanan ile satan arasındaki çizgiyi kim çizer? Hukuki eksen: 188 ile 191 ayrımı (miktar, paketleme,
  terazi, iletişim, kimin zilyetliğinde) ve arama kararının kapsamı (CMK 119).
- Ton: noir dram; uyuşturucu ciddiyetle, özendirmeden anlatılır.

## 2. Gerçek (oyuncuya söylenmez)
Satıcı arka odanın kiracısı motosikletli kurye **Barış Demirel**'dir. Paketler, terazi ve poşetler onun kilitli odasındadır;
mutfaktaki şekerlikte "hazır" bekleyen iki paket de aynı stoktandır. Kaan kullanıcıdır: eylülde Barış'tan iki kez kullanmak
için almış, ekimde acile kaldırılmış, AMATEM'de tedaviye başlamıştır; baskın günü üzerinde ya da odasında madde yoktur.
Muhbir **Tolga Kaplan** (evin eski kiracısı) 9 Kasım gecesi paketi Barış'tan almış, korkudan ve kinden Kaan'ın adını
vermiştir. Polis, kararın kapsamı "şüphelinin kullanımındaki oda ve ortak alanlar" iken kilitli üçüncü kişi odasını keskiyle
açmış, tutanağa "(şüphelinin kullanımındaki)" ibaresini sonradan eklemiş, tanığı kapı açıldıktan sonra çağırmıştır.
Kronoloji: hikâye kitabı §3.

## 3. Delil zinciri
| Kimlik | Ad | Tür | Keşif | Ne yapar | Sunulabilir |
|---|---|---|---|---|---|
| ev_tutanak | Arama ve el koyma tutanağı + kroki | EVIDENCE (savcılık) | başlangıç; INV_TUTANAK | belge incelemesinin kaynağı | hayır |
| ev_karar | Sulh ceza arama kararı | EVIDENCE | başlangıç; INV_KARAR | kapsam (CMK 119/2-b) | evet (S1) |
| ev_kriminal | Kriminal rapor | EVIDENCE (savcılık) | başlangıç; INV_KRIMINAL | iz, parti, kavanoz | hayır |
| ev_mesaj | CMK 134 inceleme raporu (mesaj dökümü) | EVIDENCE | başlangıç; INV_MESAJ | "odaya girme"; iki yüzlü "2 tane" | evet (H1 sanık, cezalı kural) |
| ev_tolga_ifade | Tolga'nın kolluk ifadesi | EVIDENCE (savcılık) | başlangıç; INV_TOLGA | kask, saat | evet (T5) |
| ev_kira | Kira sözleşmesi (Kaan adına) | EVIDENCE (savcılık) | başlangıç | savcılık tezi | evet (cezalı kural) |
| ev_sac | Saç analizi | EVIDENCE (savcılık) | başlangıç | kullanım; 191 yönüne iter | evet (cezalı kural) |
| ev_tedavi | Hastane epikrizi + AMATEM kayıtları | EVIDENCE | INV_DEFNE | kullanıcı profili | evet (S5) |
| ev_kurye | Paketçi kayıtları (personel + GPS) | EVIDENCE | DIL_KURYE / H1 talebi → ARA girişi | Barış'ın kimliği, 06.21 | evet (T3) |
| ev_zrapor | Kahve Durağı Z raporu ve vardiya çizelgesi | EVIDENCE | ARA_ZRAPOR | mazeret (23.41) | evet (T4) |
| ev_canta | El konulan kurye çantası ve laboratuvar ön raporu | EVIDENCE | ARA_BODRUM doğru yol → T_00 | kokain bulaşığı, astar | evet (T3/T1) |
| ev_iz_eslesme | Parmak izi karşılaştırma raporu | EVIDENCE | Barış yakalanırsa → T_00 | terazideki iz Barış'ın | evet (T1) |
| clue_kilit, clue_mont, clue_zincir | Kesik asma kilit · XL kurye montu · zincir kilit ve kask askısı | CLUE | INV_ARKA | başkasının odası, kurye | tahta |
| clue_on_oda, clue_randevu, clue_sekerlik, clue_ayakkabi | Ön odadaki yatak · randevu kartı · şekerlik · 45 numara | CLUE | INV_ON | Kaan'ın odası; tedavi; şekerliğin yeri | tahta |
| clue_posta, clue_yag | Posta kutusundaki "DEMİREL" · motor yağı lekesi | CLUE | INV_BINA | soyadı; motor | tahta |
| clue_kroki, clue_tanik_saat, clue_ekleme | Kroki çelişkisi · tanığın imza saati · sıkıştırılmış parantez | CLUE | INV_TUTANAK | oda; CMK 119/4 | tahta |
| clue_kapsam | Kararın kapsamı | CLUE | INV_KARAR | CMK 119 | tahta |
| clue_odaya_girme, clue_iki_tane, clue_hat | "odaya girme" · "2 tane" · hat sahibi Demirel | CLUE | INV_MESAJ | Barış; kullanıcı | tahta |
| clue_iz_yabanci, clue_ayni_parti, clue_kavanoz_iz | Yabancı iz · aynı parti · kavanozda Kaan izi | CLUE | INV_KRIMINAL | ticaretin sahibi; şekerlik | tahta |
| clue_tolga_kask, clue_tolga_saat | Kapıyı açanın kaskı · 23.00 | CLUE | INV_TOLGA | muhbirin anlatısı | tahta |
| clue_kaan_olcu, clue_tedavi | 41 numara, ehliyet yok · tedavi süreci | CLUE | INV_DEFNE / görüşme | Kaan profili | tahta |
| clue_kira_defteri, clue_nesrin_moto | Nesrin'in kira defteri · 06.20'de dönen motor | CLUE | INV_NESRIN | Barış var; kaçış | tahta |
| clue_gps, clue_istifa | GPS 06.21 · 12 Kasım ayrılış | CLUE | ARA_GPS | kaçış | ara tahta |
| clue_selim_tolga, clue_selim_astar | Tolga durağa uğrardı · astar | CLUE | ARA_SELIM | Tolga ↔ Barış | ara tahta |
| clue_z_rapor | Kasa kapanışı 23.41 | CLUE | ARA_ZRAPOR | mazeret | ara tahta |

**Çıkarımlar (INSIGHT, sunulabilir):**
| Tarif | Kartlar | Çıkarım | Nerede kullanılır |
|---|---|---|---|
| CB_KAPSAM | clue_kilit + clue_kapsam | ded_kapsam: kilitli üçüncü kişi odası kararın dışında | H1 S3 (kilit), T delil tartışması |
| CB_ODA | clue_on_oda + clue_kroki | ded_oda: Kaan ön odada yaşıyor; kroki yanlış | H1 S2 → contra_s2 |
| CB_NUMARA | clue_ayakkabi + clue_kaan_olcu | ded_numara: 45 numara Kaan'ın değil | H1 S2 (kısmi) |
| CB_KURYE | clue_mont + clue_zincir | ded_kurye: arka odada motorlu bir kurye yaşıyor | H1 S2 (kısmi), T3 |
| CB_BARIS | clue_odaya_girme + clue_kira_defteri | ded_baris: Barış gerçek, arka oda onun | H1 sanık, T1 |
| CB_DEMIREL | clue_hat + clue_posta | ded_demirel: hat ve posta kutusu aynı aile | ARA suç duyurusu (kimlik) |
| CB_SEKER | clue_ayni_parti + clue_sekerlik | ded_sekerlik: şekerlikteki paketler arka odadaki stoktan | T delil tartışması → jar_cleared |
| CB_KASK | clue_tolga_kask + clue_kaan_olcu | ded_kask: kapıyı açan kasklı adam Kaan olamaz | T3 → contra_t3 |
| CB_KULLANICI | clue_randevu + clue_tedavi | ded_kullanici: kullanıcı ve tedavide | H1 S5 |
| CB_KACIS (ara) | clue_gps + clue_nesrin_moto | ded_kacis: Barış baskını görüp döndü | T, mütalaa |
| CB_TOLGA (ara) | clue_selim_tolga + clue_tolga_kask | ded_tolga_baris: Tolga'nın satıcısı Barış'tı | T1 → tolga_kirildi |
| CB_ALIBI (ara) | clue_z_rapor + clue_tolga_saat | ded_alibi: satış anında Kaan kafedeydi | T4 → contra_t4 |

Çeldiriciler: clue_iki_tane, clue_kavanoz_iz, clue_tanik_saat, clue_ekleme, clue_yag, clue_istifa, clue_selim_astar.
Yanlış çift −50 (her çift bir kez).

**Gecikmeli teslimler:** ev_kurye (DIL_KURYE ya da H1 talebi → ARA girişi), ev_canta (ARA_BODRUM'da savcılığa bildirim →
T_00), ev_iz_eslesme (suç duyurusu + tehdit bildirimi → Barış yakalanır → T_00).

## 4. Çelişkiler (çapraz sorgu)
**1. celse — Kom. Yrd. Tuncay Sezer (H1_04):**
- S1 "Arama hâkim kararına uygun yapıldı." BASTIR → kapsam sorusu; kilit itirafından sonra ev_karar → contra_s1 (+300).
- S2 "Arka oda şüphelinin yatak odasıydı; kroki gösteriyor." ded_oda → contra_s2 (+300, ikna +2); ded_kurye / ded_numara
  kısmi (+100).
- S3 "Kapı olağan şekilde açıldı." ded_kapsam → contra_s3 ("Keskiyle açtık.") (+300).
- S4 "Arama başında iki komşu tanık hazırdı." BASTIR, Nesrin'den saat öğrenildiyse → contra_s4 (+50, ikna +1).
- S5 "Şüphelinin odasında ilaçlar vardı; profili belli." İTİRAZ g_kanaat (+50); ev_tedavi / ded_kullanici → contra_s5 (+100).
- Savcılık delili (ev_kira, ev_sac) sunmak: yanlış delil (♥−1, −150).
**2. celse — Tolga Kaplan (T_03):**
- T1 "Daire 7'den aldım; satan Kaan'dı." Çözülme yalnızca contra_t3 ya da contra_t4'ten sonra: ded_tolga_baris ya da
  ev_iz_eslesme → tolga_kirildi (+300, ikna +2).
- T2 "Kaan'ı tanırım, o evde o otururdu." BASTIR → "çıkarıldım" (kin) → press_t2.
- T3 "Kapıyı o açtı, paketi o verdi." ded_kask / ded_kurye / ev_kurye → contra_t3 (+300).
- T4 "Saat 23.00 gibiydi." ded_alibi / ev_zrapor → contra_t4 (+300).
- T5 (T3 bastırılınca) "Paketi içeriden getirdi… mutfaktan." ev_tolga_ifade → kask çelişkisi (+100); yalnızca
  tolga_kirildi'den sonra şekerlik aklanır.
- İTİRAZ: T2 × g_duyum ("herkes bilir") kabul; diğerleri ♥−1.

## 5. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | TELKIN | CONVICTION | sahte tanık kürsüye çıktı (okan_tanik) | 188/3, 188/4-a, 62: 12 yıl 6 ay + 1.250 gün APC; etik kartı | 0 |
| 2 | BERAAT_B | ACQUITTAL (223/2-b) | ¬çöküş, tolga_kirildi, ev_iz_eslesme, gercek_fail, ikna ≥ 8, final ≥ 8.000 | ceza yok | 1,2 |
| 3 | BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş, contra_s2, jar_cleared, (contra_t3 ∨ contra_t4), beraat_savunma, ikna ≥ 6, final ≥ 7.000 | ceza yok | 1,0 |
| 4 | NITELIK_191 | RECHARACTERIZED | ¬çöküş, (contra_s2 ∨ terditli), ek savunma verildi, final ≥ 3.000 | 191/1: 2 yıl; 191/8 HAGB | 0,85 |
| 5 | MAHKUMIYET | CONVICTION (varsayılan) | — | 12 yıl 6 ay + 1.250 gün APC | 0,6 |

Ceza hesabı: hukuki notlar §2.

## 6. Skor
- Kategoriler ve döküm satırları kılavuzdaki gibi (Delil toplama = AR + DA; Çapraz sorgu = SO; İtiraz isabeti = UB + HB;
  Savunma = SS; Hatalı delil).
- Tutarlar: sahne nesnesi +40/+60, ıska −10; belge isabeti +100/+150, yanlış alet −20; tarif +300, yanlış çift −50;
  BASTIR +25; doğru sunum +300, kısmi +100, yanlış −150 (♥−1); usul itirazı +50…+150, dayanaksız −50 (♥−1); esas savunma
  +200 (strateji çarpanı yalnızca uyumlu savunmada); etik sınır ihlalleri −50…−100.
- Eşik çubuğu: Mahkûmiyet 0 · Nitelik 3.000 · Beraat 7.000. `scaleMax` teorik tavanın ~%95'i (§13).

## 7. Golden path'ler
TIPIK (BERAAT_E), G_B (BERAAT_B), G_N (NITELIK_191), G_M (MAHKUMIYET), G_ETIK (TELKIN), W (çöküş → MAHKUMIYET).
Ölçümler §13.

## 13. Ölçümler
(case:duration çıktısı teslimde eklenir.)
