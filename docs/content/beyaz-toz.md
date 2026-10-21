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
kasa başındadır (Z raporu: 22.44–23.18 arası beş satış onun koduyla, 22.53 ve 23.02 kartlı; kafe kapıya 15 dk). Polis, kararın kapsamı "şüphelinin kullanımındaki oda ve ortak alanlar" iken kilitli üçüncü
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
| ev_kurye | Paketçi personel ve GPS kayıtları | EVIDENCE | DIL_KURYE / TL_KURYE → ARA girişi | kimlik, 9 Kasım 23.00 ve 11 Kasım 07.16 | evet (T3) |
| ev_zrapor | Kahve Durağı Z raporu | EVIDENCE | ARA_ZRAPOR (satış dökümü okunduktan sonra kapanış satırı) | mazeret: 22.44–23.18 beş satış (kartlı, slipli), kapanış 23.41 | evet (T4) |
| ev_mutalaa | Uzman mütalaası (CMK 67/6) | EVIDENCE | ARA_MUTALAA (2. ara gün; uzmana üç soru sorulduysa) | şekerlik paketlerinin kaynağı | hayır (T04B_A'da ded_stok üzerinden) |
| ev_canta | El konulan kurye çantası | EVIDENCE | ARA_BODRUM → BD_SAVCI → T_00 | gizli bölme, bulaşık | evet (T1 kısmi) |
| ev_iz_eslesme | Parmak izi karşılaştırma raporu | EVIDENCE | SC_KIMLIK (kurye kayıtları gerekli) + TEL_A + iz karşılaştırma talebi (DIL_IZ / TL_IZ; yabancı iz ve Demirel kartı gerekir) → T_00 | terazideki iz Barış'ın | evet (T1) |
| clue_kilit · clue_mont · clue_zincir | arka oda fotoğrafları | CLUE | INV_ARKA | kilitli başka oda, kurye | tahta |
| clue_on_oda · clue_randevu · clue_sekerlik · clue_ayakkabi | ön oda ve koridor fotoğrafları | CLUE | INV_ON | Kaan'ın odası, tedavi, şekerliğin yeri, 45 numara | tahta |
| clue_posta · clue_yag | bina girişi | CLUE | INV_BINA | DEMİREL soyadı; motor (çeldirici) | tahta / — |
| clue_kroki · clue_tanik_saat · clue_ekleme | tutanak | CLUE | INV_TUTANAK (kroki: önce ilk satır `r_bas` okunmuş ve ön oda görülmüş olmalı) | oda; CMK 119/4; sonradan ekleme | tahta / — / — |
| clue_kapsam | karar | CLUE | INV_KARAR (karşılaştırma: önce talep yazısı okunmalı) | CMK 119 | tahta |
| clue_odaya_girme · clue_iki_tane · clue_hat | mesajlar | CLUE | INV_MESAJ (hat: önce “odaya girme” okunmalı) | Barış; kullanıcı; Demirel | tahta |
| clue_iz_yabanci · clue_ayni_parti · clue_kavanoz_iz | kriminal | CLUE | INV_KRIMINAL | yabancı iz; **benzer** poşet (karşılaştırma yok); kavanozda Kaan | — / tahta / tahta |
| fact_paket · fact_ekler | kriminal | bayrak | INV_KRIMINAL (`k_paket`, `k_ekler`) | baskı numarası + ısı çizgisi; açılmamış ekler | uzman yolunu açar |
| clue_ek_stok | uzman mütalaası | CLUE | ARA_MUTALAA (kesim, baskı no., kromatogram satırlarının üçü de okununca) | aynı rulo, makine, tarif | ara tahta |
| clue_tolga_kask · clue_tolga_saat | muhbir ifadesi | CLUE | INV_TOLGA | kask; 23.00 | tahta |
| clue_anahtarlik | emanet | CLUE | INV_EMANET | asma kilit anahtarı yok | tahta |
| clue_kaan_olcu · clue_tedavi | kişiler, emanet | CLUE | TP_KENDI / DF_GUNLUK; DF_TEDAVI / TP_TEDAVI / EX_EMA_ILAC | 41 numara, ehliyet yok; tedavi | tahta |
| clue_kira_defteri · clue_nesrin_moto | Nesrin | CLUE | INV_NESRIN | Barış'ın kiracılığı; 07.15 motor | tahta / ara tahta |
| clue_gps · clue_istifa | Paketçi | CLUE | ARA_GPS | 07.16; ertesi gün ayrılış | ara tahta |
| clue_selim_tolga · clue_selim_astar | Selim Usta | CLUE | ARA_SELIM | Tolga ↔ Barış; astar | ara tahta |
| clue_z_rapor | kafe | CLUE | ARA_ZRAPOR | 22.53 / 23.02 / 23.11 satışları, 23.41 | ara tahta |

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
| CB_SEKER | benzer poşet + şekerlik | ded_sekerlik (yalnızca benzerlik) | S6 → contra_s6 (yer kabulü); uzman yolunu açar |
| CB_KASK | kask + Kaan'ın ölçüleri | ded_kask | T3 → contra_t3 |
| CB_KULLANICI | randevu + tedavi | ded_kullanici | S5 |
| CB_KACIS (ara) | GPS + Nesrin'in motoru | ded_kacis | T1 kısmi |
| CB_TOLGA (ara) | Selim'in sözü + kask | ded_tolga_baris | T1 → tolga_kirildi |
| CB_ALIBI (ara) | Z raporu + 23.00 | ded_alibi | T4 → contra_t4 |
| CB_STOK (ara) | mütalaa (ardışık poşetler) + şekerlik | ded_stok | T04B_A → jar_cleared (Q_SEKER ile) |

Çeldiriciler (tahtada): clue_iki_tane, clue_kavanoz_iz (1. evre); clue_istifa, clue_selim_astar, clue_iki_tane (ara).
Yanlış çift −50 (her çift bir kez) ve bir **bağlantı hakkı** (`tahta`, günde 3): hak bitince tahta ertesi güne kadar
kapanır (A_CIKARIM / A2_CIKARIM kilitli); gün sonu ve ara evre girişi hakları yeniler. Kaçış araması için havuzlar yalnızca tarif kartları ve birkaç çeldiriciyle sınırlıdır
(clue_yag, clue_tanik_saat, clue_ekleme, clue_iz_yabanci tahtaya girmez; duruşmada ve anlatıda kullanılır).

## 4. Çelişkiler (çapraz sorgu)
**1. celse — müdafiin soruları (H1_02Q), kayıt kurar:** Q_ODA (nerede uyuyor), Q_KILIT (kilit ve anahtar; ayrıntıyı ancak
görüşmede TP_KILIT konuşulduysa verir → `q_kilit_tam`), Q_SEKER (şekerliği ne için kullandığı; TP_SEKER gerekir, TP_SEKER
de kavanozdaki izin ve şekerliğin yerinin bulunmasını ister), Q_EHLIYET (ehliyet/motosiklet yok; TP_KENDI gerekir).

**1. celse — Kom. Yrd. Tuncay Sezer (H1_04):** çapraz sorgu ancak altı beyanın her biri en az bir kez bastırıldıktan
sonra bitirilebilir (H104_BITIR kapısı; S5 için PR_S5 eklendi).
- S1 “Karara uygun yapıldı.” BASTIR; kilit itirafından (contra_s3) **ve kapsam satırı talep yazısıyla okunduktan
  (clue_kapsam)** sonra ev_karar → contra_s1 (+300); kapsam okunmadıysa PS_S1_SATIR (sonuçsuz); erken sunum kısmi.
- S2 “Arka oda şüphelinin yatak odasıydı.” BASTIR + ded_oda + **odanın kiralandığını gösteren kart** (ded_baris ya da
  ded_demirel; mont/ayakkabı “misafir” sayılır) + **ded_anahtar + Q_ODA + q_kilit_tam** → contra_s2 (“varsaydım”).
  Eksik dayanakta PS_S2_EKSIK / PS_S2_TEK (sonuçsuz).
- S3 “Kapılar olağan şekilde açıldı.” BASTIR + ded_kapsam / ded_anahtar → contra_s3 (“keskiyle açtık”).
- S4, S5 değişmedi. S6 “Şekerlik ortak alandaydı.” BASTIR + ded_sekerlik → **contra_s6 (yer ve paketlerde iz
  olmadığı kabul edilir; şekerlik aklanmaz)**: savcı “aynı tip poşet her markette satılır” der.
- Savcılık delilleri: yanlış delil (♥−1, −150, en çok 3 kez).

**Ara evre:** A2_UZMAN (contra_s6 ∧ fact_ekler; Leyla danışması da ekleri gösterir) → UZ_KESIM / UZ_POSET (fact_paket
gerekir) / UZ_SAFLIK üçü sorulunca `uzman_istendi`; UZ_SONUC (uzmana hukuki sonuç yazdırmak) cezalı. 2. gün
A2_MUTALAA → clue_ek_stok → CB_STOK → ded_stok.

**2. celse — Nesrin (T_01Q):** T01_A kira defteri → `defter_sunuldu` (kapsam dışı arama dışlamasının dayanağı).

**2. celse — Tolga Kaplan (T_03):** beş beyanın her biri en az bir kez bastırılmadan T03_BITIR açılmaz.
- T1 “Satan Kaan'dı.” **contra_t3 ∧ contra_t4** sonrası ev_iz_eslesme **ya da** ded_tolga_baris (saik: T2 bastırması
  etkin pişmanlık notu + kin/eski kiracılık bilgisiyle) → tolga_kirildi (tek çatlakla muhbir adı vermez); şekerlik yalnızca
  contra_s6 varsa aklanır (muhbir şekerliği ancak yeri kayda geçtiyse anlatır). Erken kısmi (+100).
- T2 BASTIR (saik → `tolga_saik`); İTİRAZ g_duyum.
- T3 “Kapıyı o açtı.” BASTIR → T5 görünür; **önce T5'te ev_tolga_ifade (kask satırı okunmuş olmalı) → contra_t5**, sonra
  ded_kurye / ev_kurye ya da ded_kask (**Q_EHLIYET kayıttaysa**) → contra_t3.
- T4 “23.00 gibiydi.” BASTIR + ded_alibi / ev_zrapor → contra_t4 (22.53, 23.02, 23.11 kasada; gidiş-dönüş 30 dk).

**2. celse — delillerin tartışılması:** T04_A dışlama = contra_s1 ∧ contra_s2 ∧ defter_sunuldu. T04B_A şekerlik =
ded_stok ∧ Q_SEKER (uzman salonda dinlenir, CMK 68/3); yalnızca benzerlikle kısmi.

## 5. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | TELKIN | CONVICTION + etik kartı | okan_tanik | 188/3 + 188/4-a, TCK 62/1: 12 yıl 6 ay, 1.250 gün (125.000 TL); `contra_s3` varsa arka oda materyali dışlanır | 0 |
| 2 | BERAAT_B | ACQUITTAL (223/2-b) | ¬çöküş ∧ tolga_kirildi ∧ jar_cleared ∧ ev_iz_eslesme ∧ contra_t4 ∧ fact_gps9 ∧ ded_kacis ∧ contra_s2 ∧ defter_sunuldu ∧ ev_canta ∧ gercek_fail | ceza yok | 1,2 |
| 3 | BERAAT_E | ACQUITTAL (223/2-e) | **contra_s2 ∧ jar_cleared** (çöküş dahil) | ceza yok | 1,0 |
| 4 | NITELIK_191 | RECHARACTERIZED | ¬jar_cleared ∧ contra_s2 ∧ (contra_t3 ∨ contra_t4 ∨ tolga_kirildi) ∧ ek_savunma (T_05N ya da çöküşte T_COKUS) | 191/1: 2 yıl; 191/8 HAGB | 0,85 |
| 5 | MAHKUMIYET | CONVICTION (varsayılan; çöküş varyantı) | — | 12 yıl 6 ay, 1.250 gün (125.000 TL) | 0,6 |

Hiçbir sonuç puan, ikna ya da çöküş şartı taşımaz (BERAAT_B'nin müdafi talebi çöküşte kurulamaz). Mütalaa yönlendirmesi
(T_05): tolga_kirildi ∧ ev_iz_eslesme ∧ beraat_e → T_05B; beraat_e → T_05E; contra_s2 ∧ ¬jar_cleared ∧ (t3 ∨ t4 ∨
kırıldı) → T_05N (191 + CMK 226; kask / saat / dönüş varyantları); diğer → T_05M. Savcı beraat istediğinde mahkûmiyet
çıkmaz; yönlendirme ile sonuç koşulları 560 bayrak bileşiminde denetlendi (uyumsuzluk yok; hukuki notlar §4-12 tablosu).
Çöküş (T_COKUS) kaydı değiştirmez: 191 kaydında başkan CMK 226 hatırlatmasını kendisi yapar (`ek_savunma`); çöküş ancak
muhbir kürsüye çıktıktan sonra (visited T_03) olur.

Gerekçe satırları bayraklara bağlıdır ve duruşmada çürütülmüş bir olguya dayanmaz. BERAAT_E'de muhbir sarsılmadıysa
gerekçe, üçüncü kişinin odasındaki materyalin muhbirin kimlik anlatımını doğrulamadığını ve etkin pişmanlık
beklentisiyle verilen desteksiz beyanın tek başına yetmediğini söyler (hukuki notlar §4-2). 223/2-b olumlu ispat ister;
biri eksikse ama 2-e kaydı varsa hüküm 2-e'dir. 191, arka oda sanığa bağlanamadığında ve muhbirin satış anlatımı
çöktüğünde, aklanmamış şekerlikteki iki paket üzerinden kurulur; kullanıcı olduğu savcılığın kendi saç analiziyle sabittir.

## 6. Skor
- Kategoriler ve döküm satırları kılavuzdaki gibi; güvenilirlik bonusu cred × 100.
- Tutarlar: sahne nesnesi +40/+60, çeldirici ve ıska −10; belge isabeti +100/+150 (bilgi satırları +20/+50), yanlış alet
  −20; tarif +300, yanlış çift −50; BASTIR +25/+50; doğru sunum +300, kısmi +100, yanlış −150 (♥−1); usul itirazı/talebi
  +30…+150, dayanaksız −40/−50 (♥−1); esas savunma +200 (strateji çarpanı yalnızca uyumlu savunmada: 2-b ↔ Masumiyet,
  2-e ↔ Usul, terditli ↔ İndirim); dayanak +40/−40; etik sınır ihlalleri −40…−100.
- Eşik çubuğu tek banttır (“Hüküm kayda bağlıdır”): hiçbir sonuç puan eşiği taşımaz; puan savunmanın kalitesini
  gösterir. `scaleMax` 10.000 (tipik final 12.805; çubuk taşar, bilinçli).

## 7. Node grafiği özeti
`PROLOG → PR_02 → BR_00 → BR_00L → BR_01 → BR_01B → BR_02 → INV_SABAH → INV_HUB` (3 gün × 5 EP; Leyla günde bir, 0 EP).
Hub etkinlikleri `{push}` ile alt ekranlara gider, `$return` ile döner: INV_ARKA, INV_ON, INV_BINA → INV_MERDIVEN,
INV_GORUS_G_1 → INV_GORUSME (iki ziyaret), INV_DEFNE, INV_NESRIN, INV_TUTANAK, INV_KARAR, INV_MESAJ, INV_KRIMINAL,
INV_TOLGA, INV_EMANET, INV_DIL, INV_CIKARIM, INV_LEYLA. Ara evreye ARA_UZMAN (1. ya da 2. gün) ve ARA_MUTALAA (2. gün)
eklendi; ikisi de doğrudan ARA_HUB'a döner. Gün sonu `tg_inv_day` → INV_DAY_END → INV_AKSAM1 / INV_AKSAM2 →
INV_SABAH3. `GO_H1 → INV_GECE_1…5 → INV_GECE → H1_00K → H1_00 … H1_06B → H1_07 → H1_08 → ARA_GIRIS_1 → ARA_GIRIS →
ARA_HUB` (2 gün × 4 EP; yığınsız, her etkinlik doğrudan ARA_HUB'a döner). Gün sonu `tg_ara_day` → ARA_DAY_END → ARA_AKSAM →
ARA_TELEFON → ARA_SABAH → ARA_HUB. `GO_T → ARA_SON_1…3 → T_00K → T_00 → T_00A → T_00B → (T_01 → T_01Q →) T_02 → T_02D → (T_OKAN → T_08 |
T_03) → T_03S → T_04 → T_04R → (T_04B) → T_05 → T_05B/E/N/M → T_06P → T_06 → T_07 → T_08 → R_KARAR`. Çöküş:
`tg_cokus` (♥0, mahkemede, T_03'e girildikten sonra) → T_COKUS → T_08.

**Kapılar (gates.ts, `withExitGates`):** eylem puanlı ziyaretlerin “bitir” seçeneği en az iki inceleme / dokunuş /
soru ister (INV_NESRIN, ARA_DEFNE, ARA_UZMAN bir; görüşmenin ikinci ziyareti bir konu ya da konu kalmamışsa serbest);
H104_BITIR ve T03_BITIR her beyanın bastırılmasını ister. GO_H1: 3. gün ∧ Leyla'ya danışıldı (`leyla_gun ≥ 3`) ∧ (EP = 0
∨ eylem puanlı iş kalmadı). GO_T: 2. gün ∧ `leyla_ara ≥ 2` ∧ (EP = 0 ∨ iş kalmadı; “iş kalmadı” koşulu hub
seçeneklerinden türetilir, kilitlenme yok).

## 8. Golden path'ler
| Ad | Sonuç | Özet |
|---|---|---|
| TIPIK | BERAAT_E | Her mekânı dolaşan oyuncu: oda varsayımı çöker; şekerliğin yeri 1. celsede kabul ettirilir, aynı stok ara evrede uzman mütalaasıyla kurulur ve 2. celsede aklanır; muhbir kask ve saatte çöker ama adı vermez; dışlama da kurulur (Nesrin'in defteri). |
| G_E2 | BERAAT_E | Muhbir ayakta kalır; arka oda materyali dışlanmış (kapsam + varsayım + defter), şekerlik mütalaayla aklanmış; geriye desteksiz tek beyan kalır. Mütalaa satırları başka sırayla okunur. |
| G_E_DAG | BERAAT_E | Zincir kurulur ama tahta yarım, 1. celsede üç savcılık delili “çelişki” diye sunulur (♥ 2); 8.310 puanla beraat, kapanışta Leyla dağınıklığı söyler. |
| G_B | BERAAT_B | Kurye kayıtları + kimlikli suç duyurusu + gece telefonu + iz karşılaştırma talebi; bodrum çantası savcılığa; muhbir kask, saat ve izle çözülür; esas savunma 223/2-b. |
| G_N | NITELIK_191 | Oda varsayımı çöker, muhbirin saati Z raporuyla çöker; uzmana gidilmez, şekerlik aklanmaz; mütalaa 191, ek savunma. |
| G_M | MAHKUMIYET | Yönlendirici sorular, yanlış deliller, kimlik kartı olmadan oda savunması (PS_S2_TEK); kask satırı okunmadan T5 yüzleşmesi (PS_T5_ERKEN). |
| G_ETIK | TELKIN | Sahte tanık teklifi kabul edilir; kapsam satırı okunmadan karar sunulur (PS_S1_SATIR); Okan muhbirden sonra dinlenir, müdafi muhbire soru sormaz. |
| W | MAHKUMIYET (çöküş) | Sorguda kilit ve ehliyet sorulmaz (PS_S2_EKSIK, PS_T3_EHLIYET); 2. celsede savcılık delilleri art arda; güvenilirlik 0; oda varsayımı ayakta olduğundan kayıt da mahkûmiyettir. |

## 12. Erken çözüm denetimi
- **Gizem:** soğuk açılış isimsiz ve yargısız (“Siluet yutkundu. … Sonra konuştu.”); muhbirin bir isim *seçtiğine* dair
  her ima kaldırıldı (kolluk ifadesi geri bildirimi yalnızca dosyadaki etkin pişmanlık notunu söyler; T_02 iç sesi
  yargı vermez). Tipik yol yeniden döküldü (1.178 satır): “Demirel” ilk kez mesaj raporunda (eylem 52–56), satıcılığın
  muhbirin ağzından kurulması T_03'te.
- **Çatışmanın çözümü (hukuk ↔ erken çözüm):** hüküm yalnızca kayda bağlıdır (puan, ikna ve çöküş şartı yok; §5).
  Erken çözümü puan eşiği değil, delil zinciri ve oyun yapısı engeller:
  - *Delil önkoşulları* (önceki turdan): kroki ↔ tutanak ilk satırı ↔ ön oda; hat ↔ “odaya girme”; kapsam ↔ talep
    yazısı; oda varsayımı ↔ anahtarlık + kimlik kartı + sanığın sorgu beyanı; şekerlik ↔ 1. celsede yer kabulü →
    kriminal raporun ekleri → uzman (3 soru) → mütalaa (3 satır, 2. ara gün) → ara tahta → Q_SEKER → 2. celsede T04B_A;
    dışlama ↔ kapsam + varsayım + defter; kask ↔ T5 tutarsızlığı + ifadenin okunması + ehliyet beyanı; iz ↔
    karşılaştırma talebi + kurye kayıtlarıyla kimlikli suç duyurusu + gece telefonunun bildirimi.
  - *Yeni:* muhbir ancak **iki** çatlaktan (kask ve saat) sonra döner: iz rotası artık ara evrenin Z raporunu da ister.
  - *Yeni oyun yapısı:* (1) çapraz sorgularda her beyan en az bir kez bastırılır (usul adımı, CMK 201); (2) eylem puanlı
    ziyaretler boş geçilmez (en az iki inceleme/soru; tek cevap bekleyen konuşmalarda bir); (3) son gün (1. evre 3. gün,
    ara evre 2. gün) eylem puanı bitene ya da yapılacak iş kalmayana dek sürer ve her celseden önce Leyla'ya danışılır;
    (4) küsen ev sahibinin kapısı ara evrede de çalınabilir (tanığı korkutmak ara evreyi kısaltan bir kestirme olmaktan
    çıktı); (5) görüşmenin ikinci ziyareti en az bir konu ister (konu kalmadıysa serbest).
- **Ara evre** her beraat rotasında bir bulgu üretir: uzman mütalaası (şekerlik) ya da Z raporu + kimlikli suç duyurusu +
  gece telefonu (iz rotası) ya da Selim + Z raporu (saik rotası). **İkinci celse** her beraatte zorunlu katkı verir:
  şekerlik yalnızca orada aklanır (T_03 dönüşü ya da T04B_A uzman dinlemesi).
- **En kısa yol araması (2026-10-21, tek süreç, sonuç başına ≤ 6 dk, ardışık):** golden path'lerden ve rota tohumlarından
  (iz, uzman, Selim rotaları; 191 için Z ve kask rotaları) açgözlü silme (12→1) + dolgu ziyaret ikamesi + bir adımlık
  onarım (kapalı bir çıkış için tek inceleme ekler) + son günde Leyla ziyareti (`/tmp/bt-fix/shrink.mjs`). Bulunan en
  kısa yollar (üst sınır; tipik yol **217** eylem, %60 = 130,2):

  | Sonuç | Rota | Eylem | Tipik yola oran | Tahmini süre | Önceki tur |
  |---|---|---|---|---|---|
  | BERAAT_E | iz + muhbirin dönüşü (kask + Z raporu + kimlikli duyuru + karşılaştırma talebi + şekerliğin yeri) | **148** | %68 | 73,8 dk | 106–112 |
  | BERAAT_E | uzman mütalaası (şekerlik 2. celsede aklanır) | 153 | %71 | 74,8 dk | 116 |
  | BERAAT_E | Selim + kask + saat + saik ile dönüş | 154 | %71 | 76,2 dk | 115 |
  | BERAAT_B | tam olumlu ispat | **156** | %72 | 77,2 dk | 121–123 |
  | NITELIK_191 | oda + Z raporu (ya da kask), şekerlik aklanmaz | **134** | %62 | 66,3 dk | 97–100 |
  | MAHKUMIYET | varsayılan | 116 | %53 | 58,7 dk | 65–68 |
  | TELKIN | sahte tanık kabulü | 109 | %50 | 57,7 dk | 61–70 |

  Beraatler ve 191 tipik yolun %60'ının üzerinde. MAHKUMIYET varsayılan sonuçtur; TELKIN bir etik tuzağın sonucudur
  (teklif kabul edildiği anda) ve soruşturmaya bağlanmadı: bilerek yanlış bir karar vermek “kazanılacak” bir sonuç
  değildir. İkisinin golden path'leri 60 dk'nın üzerindedir (§13).
- **Hüküm-kayıt denetimi:** T_05 yönlendirmesi ve sonuç koşulları T_04'ten itibaren 560 bayrak bileşiminde (oda, şekerlik,
  kask/saat/T5, dönüş, dışlama, kapsam, defter, çöküş, iz) değerlendirildi (`/tmp/bt-fix/matrix.mjs`): savcı beraat
  istediğinde beraat, 191 istediğinde 191, 188 istediğinde mahkûmiyet; çöküşte kayıt neyse o. Uyumsuzluk yok.

## 13. Ölçümler
`npm run case:duration -- beyaz-toz` (2026-10-21, ikinci inceleme düzeltmeleri sonrası; hüküm kayda bağlı, kapılar):

```
TIPIK          99.1 dk   13940 sözcük   217 aksiyon  BERAAT_E (12830)
G_E2           96.3 dk   13517 sözcük   212 aksiyon  BERAAT_E (11490)
G_E_DAG        91.5 dk   12995 sözcük   193 aksiyon  BERAAT_E (8600)
G_B            96.8 dk   13590 sözcük   213 aksiyon  BERAAT_B (12900)
G_N            85.3 dk   12089 sözcük   181 aksiyon  NITELIK_191 (7900)
G_M            68.4 dk    9508 sözcük   156 aksiyon  MAHKUMIYET (1475)
G_ETIK         85.1 dk   12084 sözcük   180 aksiyon  TELKIN (8775)
W              85.8 dk   12097 sözcük   186 aksiyon  MAHKUMIYET (8320)
==> TİPİK YOL (TIPIK): 99.1 dk  ✓ süre hedefte
```

`node tools/content/word-count.mjs content/cases/beyaz-toz`: paket 1.414 satır, 18.967 satır sözcüğü; ekran metinleriyle
toplam **25.083** sözcük; en uzun satır 219 karakter.

`npm run case:validate -- beyaz-toz --max-ms 3000000` (tek başına, 1.528 sn; varsayılan 600 sn sınırı yükte
SIMULATION_ABORTED verdi, içerik değiştirilmedi): **PASSED — 0 hata**, 21 uyarı (1 SIMULATION_INCOMPLETE, 20
SOFTLOCK_UNVERIFIED); kapsam node 96/96, seçenek 227/227, kural 94/94, delil 59/59; golden path 8/8; softlock, sızıntı
yok. 20 SOFTLOCK_UNVERIFIED'in hepsi H1_04'tedir: kaçış araması (4.000 durumluk, kodda sabit bütçe) aynı uzaklıktaki
DELİL SUN / İTİRAZ dallarına dalıp “her beyanı bastır” kapısını bütçede geçemiyor. Elle denetim: her beyanın tek ve
koşulsuz bir BASTIR kuralı var (S4 için birbirini tamamlayan iki kural), bastırmalar güvenilirlik harcamaz ve tekrarı
NOOP'tur; kapı her durumda altı bastırmayla açılır. Diğer kapılar da kilitlenmez: belgelerde deneme hakkı ≥ 4 ve ıska
her zaman mümkün, sahnelerde büyüteç ≥ 4, iki soru isteyen konuşmalarda en az iki koşulsuz seçenek var, son gün
kapıları “yapılacak iş kalmadı” koşuluyla açılır.
