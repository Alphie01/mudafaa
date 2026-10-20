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
- Ton: noir dram; uyuşturucu ciddiyetle, özendirmeden anlatılır (hikâye kitabı §0).

## 2. Gerçek (oyuncuya söylenmez)
Satıcı arka odanın kiracısı motosikletli kurye **Barış Demirel**'dir. Paketler, terazi ve poşetler onun kilitli odasındadır;
koridorda arka oda kapısının dibindeki rafa taşınmış şekerlikte "hazır" bekleyen iki paket de aynı stoktandır. Kaan
kullanıcıdır: eylülde Barış'tan iki kez kullanmak için almış, ekimde acile kaldırılmış, AMATEM'de tedaviye başlamıştır;
baskın günü üzerinde ya da odasında madde yoktur. Muhbir **Tolga Kaplan** (evin eski kiracısı) 9 Kasım gecesi paketi
Barış'tan almış; korkudan, kinden ve etkin pişmanlık umuduyla Kaan'ın adını vermiştir. 9 Kasım 23.00'te Kaan kafede
kasa başındadır (Z raporu). Polis, kararın kapsamı "şüphelinin kullanımındaki oda ve ortak alanlar" iken kilitli üçüncü
kişi odasını keskiyle açmış, tutanağa "(şüphelinin kullanımındaki)" ibaresini sonradan eklemiş, krokide odaları ters
etiketlemiş, tanığı kapı açıldıktan sonra çağırmıştır. Kronoloji: hikâye kitabı §3.

## 3. Delil zinciri
| Kimlik | Ad | Tür | Keşif | Ne yapar | Sunulabilir |
|---|---|---|---|---|---|
| ev_tutanak | Arama ve el koyma tutanağı | EVIDENCE (savcılık) | başlangıç; INV_TUTANAK | belge incelemesinin kaynağı | hayır |
| ev_karar | Sulh ceza hâkimliğinin arama kararı | EVIDENCE | başlangıç; INV_KARAR | kapsam (CMK 119/2-b) | evet (S1) |
| ev_kriminal | Kriminal polis laboratuvarı raporu | EVIDENCE (savcılık) | başlangıç; INV_KRIMINAL | iz, parti, kavanoz | hayır |
| ev_mesaj | Telefon inceleme raporu | EVIDENCE (savcılık) | başlangıç; INV_MESAJ | “odaya girme”; iki yüzlü “2 tane” | evet (cezalı kural) |
| ev_tolga_ifade | Muhbirin kolluk ifadesi | EVIDENCE (savcılık) | başlangıç; INV_TOLGA | kask, saat, etkin pişmanlık notu | evet (T5) |
| ev_kira | Kira sözleşmesi | EVIDENCE (savcılık) | başlangıç | savcılık tezi | evet (cezalı kural) |
| ev_sac | Saç analizi raporu | EVIDENCE (savcılık) | başlangıç | kullanım | evet (cezalı kural) |
| ev_tedavi | Epikriz ve AMATEM kayıtları | EVIDENCE | INV_DEFNE | kullanıcı profili | evet (S5) |
| ev_kurye | Paketçi personel ve GPS kayıtları | EVIDENCE | DIL_KURYE / TL_KURYE → ARA girişi | kimlik, 9 Kasım 23.00 ve 11 Kasım 06.21 | evet (T3) |
| ev_zrapor | Kahve Durağı Z raporu | EVIDENCE | ARA_ZRAPOR | mazeret (23.41) | evet (T4) |
| ev_canta | El konulan kurye çantası | EVIDENCE | ARA_BODRUM → BD_SAVCI → T_00 | gizli bölme, bulaşık | evet (T1 kısmi) |
| ev_iz_eslesme | Parmak izi karşılaştırma raporu | EVIDENCE | SC_KIMLIK + TEL_A → Barış yakalanır → T_00 | terazideki iz Barış'ın | evet (T1) |
| clue_kilit · clue_mont · clue_zincir | arka oda fotoğrafları | CLUE | INV_ARKA | kilitli başka oda, kurye | tahta |
| clue_on_oda · clue_randevu · clue_sekerlik · clue_ayakkabi | ön oda ve koridor fotoğrafları | CLUE | INV_ON | Kaan'ın odası, tedavi, şekerliğin yeri, 45 numara | tahta |
| clue_posta · clue_yag | bina girişi | CLUE | INV_BINA | DEMİREL soyadı; motor (çeldirici) | tahta / — |
| clue_kroki · clue_tanik_saat · clue_ekleme | tutanak | CLUE | INV_TUTANAK | oda; CMK 119/4; sonradan ekleme | tahta / — / — |
| clue_kapsam | karar | CLUE | INV_KARAR | CMK 119 | tahta |
| clue_odaya_girme · clue_iki_tane · clue_hat | mesajlar | CLUE | INV_MESAJ | Barış; kullanıcı; Demirel | tahta |
| clue_iz_yabanci · clue_ayni_parti · clue_kavanoz_iz | kriminal | CLUE | INV_KRIMINAL | yabancı iz; aynı stok; kavanozda Kaan | — / tahta / tahta |
| clue_tolga_kask · clue_tolga_saat | muhbir ifadesi | CLUE | INV_TOLGA | kask; 23.00 | tahta |
| clue_anahtarlik | emanet | CLUE | INV_EMANET | asma kilit anahtarı yok | tahta |
| clue_kaan_olcu · clue_tedavi | kişiler, emanet | CLUE | TP_KENDI / DF_GUNLUK; DF_TEDAVI / TP_TEDAVI / EX_EMA_ILAC | 41 numara, ehliyet yok; tedavi | tahta |
| clue_kira_defteri · clue_nesrin_moto | Nesrin | CLUE | INV_NESRIN | Barış'ın kiracılığı; 06.20 motor | tahta / ara tahta |
| clue_gps · clue_istifa | Paketçi | CLUE | ARA_GPS | 06.21; ertesi gün ayrılış | ara tahta |
| clue_selim_tolga · clue_selim_astar | Selim Usta | CLUE | ARA_SELIM | Tolga ↔ Barış; astar | ara tahta |
| clue_z_rapor | kafe | CLUE | ARA_ZRAPOR | 23.41 | ara tahta |

**Çıkarımlar (INSIGHT, sunulabilir):**
| Tarif | Kartlar | Çıkarım | Kullanım |
|---|---|---|---|
| CB_KAPSAM | kilit + kapsam | ded_kapsam: kararın dışında kalan oda | S3 → contra_s3; T04_A |
| CB_ANAHTAR | anahtarlık + kilit | ded_anahtar: anahtarsız kiracı | S3 (alternatif) |
| CB_ODA | ön oda + kroki | ded_oda: Kaan ön odada yaşıyor | S2 → contra_s2 |
| CB_NUMARA | ayakkabı + Kaan'ın ölçüleri | ded_numara | S2 kısmi |
| CB_KURYE | mont + zincir | ded_kurye | S2 kısmi, T3 |
| CB_BARIS | “odaya girme” + kira defteri | ded_baris | S2 kısmi, T1 kısmi |
| CB_DEMIREL | hat + posta | ded_demirel | DIL_IZ, SC_KIMLIK; S2/T1 kısmi |
| CB_SEKER | aynı parti + şekerlik | ded_sekerlik | S6 → jar_cleared; T04B_A |
| CB_KASK | kask + Kaan'ın ölçüleri | ded_kask | T3 → contra_t3 |
| CB_KULLANICI | randevu + tedavi | ded_kullanici | S5 |
| CB_KACIS (ara) | GPS + Nesrin'in motoru | ded_kacis | T1 kısmi |
| CB_TOLGA (ara) | Selim'in sözü + kask | ded_tolga_baris | T1 → tolga_kirildi |
| CB_ALIBI (ara) | Z raporu + 23.00 | ded_alibi | T4 → contra_t4 |

Çeldiriciler (tahtada): clue_iki_tane, clue_kavanoz_iz (1. evre); clue_istifa, clue_selim_astar, clue_iki_tane (ara).
Yanlış çift −50 (her çift bir kez). Kaçış araması için havuzlar yalnızca tarif kartları ve birkaç çeldiriciyle sınırlıdır
(clue_yag, clue_tanik_saat, clue_ekleme, clue_iz_yabanci tahtaya girmez; duruşmada ve anlatıda kullanılır).

## 4. Çelişkiler (çapraz sorgu)
**1. celse — Kom. Yrd. Tuncay Sezer (H1_04):**
- S1 “Karara uygun yapıldı.” BASTIR; kilit itirafından (contra_s3) sonra ev_karar → contra_s1 (+300, ikna +2); erken sunum kısmi (+100).
- S2 “Arka oda şüphelinin yatak odasıydı.” ded_oda → contra_s2 (“varsaydım”) (+300, ikna +2); ded_kurye/numara/baris/demirel kısmi (+100).
- S3 “Kapılar olağan şekilde açıldı.” ded_kapsam / ded_anahtar → contra_s3 (“keskiyle açtık”) (+300).
- S4 “Komşu tanık hazırdı.” Nesrin'den saat öğrenildiyse BASTIR → contra_s4 (+50, ikna +1).
- S5 “Profil belli.” İTİRAZ g_kanaat (+50); ev_tedavi / ded_kullanici → contra_s5 (+100).
- S6 “Şekerlik ortak alandaydı.” ded_sekerlik → contra_s6 + jar_cleared (+300); g_kanaat itirazı reddedilir.
- Savcılık delilleri (ev_kira, ev_sac, ev_mesaj): yanlış delil (♥−1, −150, en çok 3 kez).
**2. celse — Tolga Kaplan (T_03):**
- T1 “Satan Kaan'dı.” Ancak contra_t3 ya da contra_t4'ten sonra ded_tolga_baris / ev_iz_eslesme → tolga_kirildi + jar_cleared (+300); erken kısmi (+100).
- T2 “Herkes bilir.” BASTIR (kin; etkin pişmanlık notu okunduysa saik) ; İTİRAZ g_duyum (+50).
- T3 “Kapıyı o açtı.” ded_kask / ded_kurye / ev_kurye → contra_t3 (+300). BASTIR T5'i açar.
- T4 “23.00 gibiydi.” ded_alibi / ev_zrapor → contra_t4 (+300).
- T5 “Kasksız, terlikliydi.” ev_tolga_ifade → contra_t5 (+100).

## 5. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | TELKIN | CONVICTION + etik kartı | okan_tanik (para karşılığı tanık kürsüye çıktı) | 188/3 + 188/4-a: 15 yıl, 1.500 gün (150.000 TL) | 0 |
| 2 | BERAAT_B | ACQUITTAL (223/2-b) | ¬çöküş ∧ tolga_kirildi ∧ ev_iz_eslesme ∧ gercek_fail ∧ ikna ≥ 8 ∧ final ≥ 11.000 | ceza yok | 1,2 |
| 3 | BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş ∧ beraat_e (contra_s2 ∧ jar_cleared ∧ (contra_t3 ∨ contra_t4 ∨ tolga_kirildi)) ∧ (beraat_savunma ∨ terditli) ∧ ikna ≥ 6 ∧ final ≥ 10.500 | ceza yok | 1,0 |
| 4 | NITELIK_191 | RECHARACTERIZED | ¬çöküş ∧ (contra_s2 ∨ terditli) ∧ ek_savunma ∧ final ≥ 3.000 | 191/1: 2 yıl; 191/8 HAGB | 0,85 |
| 5 | MAHKUMIYET | CONVICTION (varsayılan; çöküş varyantı) | — | 12 yıl 6 ay, 1.250 gün (125.000 TL) | 0,6 |

Mütalaa yönlendirmesi (T_05): tolga_kirildi ∧ ev_iz_eslesme → T_05B (beraat, Barış hakkında soruşturma); beraat_e →
T_05E (şüphe beraati); contra_s2 → T_05N (191 + CMK 226 ek savunma); diğer → T_05M (188). Ceza hesabı: hukuki notlar §2.

## 6. Skor
- Kategoriler ve döküm satırları kılavuzdaki gibi; güvenilirlik bonusu cred × 100.
- Tutarlar: sahne nesnesi +40/+60, çeldirici ve ıska −10; belge isabeti +100/+150 (bilgi satırları +20/+50), yanlış alet
  −20; tarif +300, yanlış çift −50; BASTIR +25/+50; doğru sunum +300, kısmi +100, yanlış −150 (♥−1); usul itirazı/talebi
  +30…+150, dayanaksız −40/−50 (♥−1); esas savunma +200 (strateji çarpanı yalnızca uyumlu savunmada: 2-b ↔ Masumiyet,
  2-e ↔ Usul, terditli ↔ İndirim); dayanak +40/−40; etik sınır ihlalleri −40…−100.
- Eşik çubuğu: Mahkûmiyet 0 · Nitelik 3.000 · Beraat 10.500; `scaleMax` 10.000 (doğrulayıcının en yüksek ölçtüğü final
  12.595 civarı; çubuk taşar, bilinçli). 223/2-b ayrıca 11.000 ister.

## 7. Node grafiği özeti
`PROLOG → PR_02 → BR_00 → BR_00L → BR_01 → BR_01B → BR_02 → INV_SABAH → INV_HUB` (3 gün × 5 EP; Leyla günde bir, 0 EP).
Hub etkinlikleri `{push}` ile alt ekranlara gider, `$return` ile döner: INV_ARKA, INV_ON, INV_BINA → INV_MERDIVEN,
INV_GORUS_G_1 → INV_GORUSME (iki ziyaret), INV_DEFNE, INV_NESRIN, INV_TUTANAK, INV_KARAR, INV_MESAJ, INV_KRIMINAL,
INV_TOLGA, INV_EMANET, INV_DIL, INV_CIKARIM, INV_LEYLA. Gün sonu `tg_inv_day` → INV_DAY_END → INV_AKSAM1 / INV_AKSAM2 →
INV_SABAH3. `GO_H1 → INV_GECE_1…5 → INV_GECE → H1_00K → H1_00 … H1_06B → H1_07 → H1_08 → ARA_GIRIS_1 → ARA_GIRIS →
ARA_HUB` (2 gün × 4 EP; yığınsız, her etkinlik doğrudan ARA_HUB'a döner). Gün sonu `tg_ara_day` → ARA_DAY_END → ARA_AKSAM →
ARA_TELEFON → ARA_SABAH → ARA_HUB. `GO_T → ARA_SON_1…3 → T_00K → T_00 → T_00A → T_00B → (T_OKAN | T_01 → T_01Q | T_02) →
T_03 → T_03S → T_04 → T_04R → (T_04B) → T_05 → T_05B/E/N/M → T_06P → T_06 → T_07 → T_08 → R_KARAR`. Çöküş:
`tg_cokus` (♥0, mahkemede) → T_COKUS → T_08.

## 8. Golden path'ler
| Ad | Sonuç | Özet |
|---|---|---|
| TIPIK | BERAAT_E | Her mekânı dolaşan, birkaç hata yapan oyuncu: oda varsayımı çöker, şekerlik 2. celsede aklanır, muhbir kask ve saatte çöker ama adı vermez; esas savunma 223/2-e. |
| G_B | BERAAT_B | Kimlikle suç duyurusu + gece telefonunun bildirimi + bodrum çantasının usulüne uygun el konulması; Barış yakalanır, iz eşleşir; muhbir çözülür; esas savunma 223/2-b. |
| G_N | NITELIK_191 | Oda varsayımı çöker, kriminal rapor ve muhbir ifadesi okunmaz; şekerlik ve muhbir ayakta kalır; ek savunma ve terditli savunma. |
| G_M | MAHKUMIYET | Yönlendirici tanık sorusu, yanlış deliller, dayanaksız itirazlar; oda varsayımı ayakta. |
| G_ETIK | TELKIN | Defne'nin sahte tanık teklifi kabul edilir; tanık kürsüde çöker. |
| W | MAHKUMIYET (çöküş) | 2. celsede muhbire art arda savcılık delilleri sunulur; güvenilirlik 0. |

## 12. Erken çözüm denetimi
- **Gizem:** Soğuk açılış isimsiz seslerle (satış anı ve muhbirin yakalanışı) kurulur; muhbir bir isim “seçer”, ama
  kimin satıcı olduğu söylenmez. Barış'ın varlığı ancak kira defteri / mesaj / posta kutusu ile, arka odanın onun
  olduğu ancak polis “varsaydım/keskiyle açtık” dediğinde, satıcı olduğu ancak 2. celsede muhbirin kendi çelişkisi ve
  (2-b yolunda) parmak iziyle kurulur. Gece telefonundaki Barış satıcılığı inkâr eder ve Tolga'yı işaret eder (çeldirici).
  Tipik yolun satır dökümü taranarak 4. kattaki “perde” satırı soğuk açılıştan çıkarıldı (Kaan'ın evde olduğunu ima
  ediyordu).
- **Etiketler:** ceza aralığı seçenekleri aynı biçime getirildi; yanlış itiraz seçeneklerinden biri madde atfı taşır
  (CMK 217, CMK 118) ki doğru seçenek yalnızca atıf taşıdığı için seçilmesin.
- **En kısa beraat:** (a) Elle kurulan en yoğun yol (her eylemi en yüksek puanlı bulguya harcayan, ara evreyi atlayan)
  104 eylemde 8.390 puana ulaşır ve eşiğin altında kalır; 10.500'e ulaşmak için ara evre kayıtları (Z raporu, GPS,
  ara tahtası, T4 sunumu), ek belge satırları ve duruşma bastırmaları gerekir: ~135–140 eylem (tipik yolun %65–68'i).
  (b) `enumerateActions` üzerinde puan + anahtar bayrak sezgiselli ışın araması (genişlik 60) ilk beraati **186.
  eylemde** buldu (BERAAT_B, 12.500). İki ölçüm de hedefi (en kısa beraat ≥ tipik yolun %60'ı = 124 eylem) karşılar.
  Beraat yalnızca puanla değil, gerçek zincirle kilitlidir: contra_s2 (ön oda + kroki), jar_cleared (aynı parti +
  şekerliğin yeri ya da muhbirin dönüşü), muhbir çelişkisi (kask ya da saat) ve uyumlu esas savunma.

## 13. Ölçümler
`npm run case:duration -- beyaz-toz` (2026-10-20):

```
TIPIK          93.3 dk   13093 sözcük   206 aksiyon  BERAAT_E (12145)
G_B            91.3 dk   12748 sözcük   205 aksiyon  BERAAT_B (12530)
G_N            76.4 dk   10941 sözcük   156 aksiyon  NITELIK_191 (6645)
G_M            62.7 dk    8787 sözcük   139 aksiyon  MAHKUMIYET (855)
G_ETIK         76.4 dk   10764 sözcük   166 aksiyon  TELKIN (9210)
W              78.9 dk   11146 sözcük   170 aksiyon  MAHKUMIYET (8360)
==> TİPİK YOL (TIPIK): 93.3 dk  ✓ süre hedefte
```

`node tools/content/word-count.mjs content/cases/beyaz-toz`: paket 1.191 satır, 15.697 satır sözcüğü; ekran metinleriyle
toplam **20.655** sözcük; en uzun satır 218 karakter.

`npm run case:validate -- beyaz-toz`: **PASSED — 0 hata**, 1 uyarı (SIMULATION_INCOMPLETE, uzun davada beklenen); kapsam
node 93/93, seçenek 212/212, kural 67/67, delil 56/56; golden path 6/6; softlock, sızıntı yok.
