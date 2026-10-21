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
| ev_kurye | Paketçi personel ve GPS kayıtları | EVIDENCE | DIL_KURYE / TL_KURYE → ARA girişi | kimlik, 9 Kasım 23.00 ve 11 Kasım 07.16 | evet (T3) |
| ev_zrapor | Kahve Durağı Z raporu | EVIDENCE | ARA_ZRAPOR (son satış satırı okunduktan sonra kapanış satırı) | mazeret (23.41) | evet (T4) |
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
| CB_SEKER | benzer poşet + şekerlik | ded_sekerlik (yalnızca benzerlik) | S6 → contra_s6 (yer kabulü); uzman yolunu açar |
| CB_KASK | kask + Kaan'ın ölçüleri | ded_kask | T3 → contra_t3 |
| CB_KULLANICI | randevu + tedavi | ded_kullanici | S5 |
| CB_KACIS (ara) | GPS + Nesrin'in motoru | ded_kacis | T1 kısmi |
| CB_TOLGA (ara) | Selim'in sözü + kask | ded_tolga_baris | T1 → tolga_kirildi |
| CB_ALIBI (ara) | Z raporu + 23.00 | ded_alibi | T4 → contra_t4 |
| CB_STOK (ara) | mütalaa (ardışık poşetler) + şekerlik | ded_stok | T04B_A → jar_cleared (Q_SEKER ile) |

Çeldiriciler (tahtada): clue_iki_tane, clue_kavanoz_iz (1. evre); clue_istifa, clue_selim_astar, clue_iki_tane (ara).
Yanlış çift −50 (her çift bir kez). Kaçış araması için havuzlar yalnızca tarif kartları ve birkaç çeldiriciyle sınırlıdır
(clue_yag, clue_tanik_saat, clue_ekleme, clue_iz_yabanci tahtaya girmez; duruşmada ve anlatıda kullanılır).

## 4. Çelişkiler (çapraz sorgu)
**1. celse — müdafiin soruları (H1_02Q), kayıt kurar:** Q_ODA (nerede uyuyor), Q_KILIT (kilit ve anahtar; ayrıntıyı ancak
görüşmede TP_KILIT konuşulduysa verir → `q_kilit_tam`), Q_SEKER (şekerliği ne için kullandığı; TP_SEKER gerekir, TP_SEKER
de kavanozdaki izin ve şekerliğin yerinin bulunmasını ister), Q_EHLIYET (ehliyet/motosiklet yok; TP_KENDI gerekir).

**1. celse — Kom. Yrd. Tuncay Sezer (H1_04):**
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

**2. celse — Tolga Kaplan (T_03):**
- T1 “Satan Kaan'dı.” ev_iz_eslesme (contra_t3 ∨ contra_t4 sonrası) **ya da** ded_tolga_baris (contra_t3 ∧ contra_t4 ∧
  saik: T2 bastırması etkin pişmanlık notu + kin/eski kiracılık bilgisiyle) → tolga_kirildi; şekerlik yalnızca
  contra_s6 varsa aklanır (muhbir şekerliği ancak yeri kayda geçtiyse anlatır). Erken kısmi (+100).
- T2 BASTIR (saik → `tolga_saik`); İTİRAZ g_duyum.
- T3 “Kapıyı o açtı.” BASTIR → T5 görünür; **önce T5'te ev_tolga_ifade (kask satırı okunmuş olmalı) → contra_t5**, sonra
  ded_kurye / ev_kurye ya da ded_kask (**Q_EHLIYET kayıttaysa**) → contra_t3.
- T4 “23.00 gibiydi.” BASTIR + ded_alibi / ev_zrapor → contra_t4.

**2. celse — delillerin tartışılması:** T04_A dışlama = contra_s1 ∧ contra_s2 ∧ defter_sunuldu. T04B_A şekerlik =
ded_stok ∧ Q_SEKER (uzman salonda dinlenir, CMK 68/3); yalnızca benzerlikle kısmi.

## 5. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | TELKIN | CONVICTION + etik kartı | okan_tanik | 188/3 + 188/4-a, TCK 62/1: 12 yıl 6 ay, 1.250 gün (125.000 TL); `contra_s3` varsa arka oda materyali dışlanır | 0 |
| 2 | BERAAT_B | ACQUITTAL (223/2-b) | ¬çöküş ∧ tolga_kirildi ∧ jar_cleared ∧ ev_iz_eslesme ∧ contra_t4 ∧ fact_gps9 ∧ ded_kacis ∧ contra_s2 ∧ defter_sunuldu ∧ ev_canta ∧ gercek_fail; **puan/ikna eşiği yok** | ceza yok | 1,2 |
| 3 | BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş ∧ contra_s2 ∧ jar_cleared ∧ (contra_t3 ∨ contra_t4 ∨ tolga_kirildi ∨ key_excluded); puan eşiği yok | ceza yok | 1,0 |
| 4 | NITELIK_191 | RECHARACTERIZED | ¬çöküş ∧ ¬jar_cleared ∧ contra_s2 ∧ contra_t4 ∧ ek_savunma (T_05N'de her durumda); **puan eşiği yok** | 191/1: 2 yıl; 191/8 HAGB | 0,85 |
| 5 | MAHKUMIYET | CONVICTION (varsayılan; çöküş varyantı) | — | 12 yıl 6 ay, 1.250 gün (125.000 TL) | 0,6 |

Mütalaa yönlendirmesi (T_05): tolga_kirildi ∧ ev_iz_eslesme ∧ contra_s2 → T_05B; beraat_e → T_05E; contra_s2 ∧
contra_t4 ∧ ¬jar_cleared → T_05N (191 + CMK 226 ek savunma); diğer → T_05M. Ceza hesabı: hukuki notlar §2.

Gerekçe satırları bayraklara bağlıdır ve duruşmada çürütülmüş bir olguya dayanmaz (bkz. hukuki notlar §4-12, §4-14).
223/2-b olumlu ispat ister: satışı yapanın Barış olduğu (dönüş + iz + 9 Kasım GPS + mazeret), arka odanın ona
kiralandığı (varsayımın çöküşü + defter), kaçışı (GPS 07.16 + Nesrin) ve usulüne uygun el konulan çanta. Bunlardan biri
eksikse ama 2-e zinciri kuruluysa hüküm yine beraattir (2-e). 191, arka oda sanığa bağlanamadığında ve muhbirin satış
anlatımı Z raporuyla zaman bakımından çöktüğünde, aklanmamış şekerlikteki iki paket üzerinden kurulur; kullanıcı
olduğu savcılığın kendi saç analiziyle sabittir.

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
ARA_TELEFON → ARA_SABAH → ARA_HUB. `GO_T → ARA_SON_1…3 → T_00K → T_00 → T_00A → T_00B → (T_OKAN | T_01 → T_01Q | T_02) →
T_03 → T_03S → T_04 → T_04R → (T_04B) → T_05 → T_05B/E/N/M → T_06P → T_06 → T_07 → T_08 → R_KARAR`. Çöküş:
`tg_cokus` (♥0, mahkemede) → T_COKUS → T_08.

## 8. Golden path'ler
| Ad | Sonuç | Özet |
|---|---|---|
| TIPIK | BERAAT_E | Her mekânı dolaşan oyuncu: oda varsayımı çöker; şekerliğin yeri 1. celsede kabul ettirilir, aynı stok ara evrede uzman mütalaasıyla kurulur ve 2. celsede aklanır; muhbir kask ve saatte çöker ama adı vermez; dışlama da kurulur (Nesrin'in defteri). |
| G_E2 | BERAAT_E | Muhbir ayakta kalır; arka oda materyali dışlanmış (kapsam + varsayım + defter), şekerlik mütalaayla aklanmış; geriye desteksiz tek beyan kalır. Mütalaa satırları başka sırayla okunur. |
| G_E_DAG | BERAAT_E | Zincir kurulur ama tahta yarım, 1. celsede üç savcılık delili “çelişki” diye sunulur (♥ 2); 8.310 puanla beraat, kapanışta Leyla dağınıklığı söyler. |
| G_B | BERAAT_B | Kurye kayıtları + kimlikli suç duyurusu + gece telefonu + iz karşılaştırma talebi; bodrum çantası savcılığa; muhbir kask, saat ve izle çözülür; esas savunma 223/2-b. |
| G_N | NITELIK_191 | Oda varsayımı çöker, muhbirin saati Z raporuyla çöker; uzmana gidilmez, şekerlik aklanmaz; mütalaa 191, ek savunma. |
| G_M | MAHKUMIYET | Yönlendirici sorular, yanlış deliller, kimlik kartı olmadan oda savunması (PS_S2_TEK); kask satırı okunmadan T5 yüzleşmesi (PS_T5_ERKEN). |
| G_ETIK | TELKIN | Sahte tanık teklifi kabul edilir; kapsam satırı okunmadan karar sunulur (PS_S1_SATIR). |
| W | MAHKUMIYET (çöküş) | Sorguda kilit ve ehliyet sorulmaz (PS_S2_EKSIK, PS_T3_EHLIYET); 2. celsede savcılık delilleri art arda; güvenilirlik 0. |

## 12. Erken çözüm denetimi
- **Gizem:** değişmedi (soğuk açılış isimsiz; Barış'ın varlığı kira defteri / mesaj / posta kutusuyla, odanın onun olduğu
  polis “varsaydım” dediğinde, satıcı olduğu 2. celsede muhbirin çelişkisi ve iz ile kurulur). Yeni metinler (uzman,
  mütalaa, sorgu soruları, Selim/iz yolları) satıcının adını vermez; Q_SEKER'de Kaan yalnızca kendi bildiğini (şekerliği
  ev arkadaşının taşıdığını) söyler. Tipik yol yeniden döküldü (2.926 satır): “Demirel” ilk kez mesaj raporunda (eylem 53),
  satıcılık ancak T_03'te muhbirin çözülmesiyle.
- **Delil zinciri (2026-10-21 yeniden dengeleme):** puan eşikleri kaldırıldı (2-b ve 191 dahil); kestirmeler delil
  önkoşullarıyla kapatıldı (§3, §4): kroki ↔ tutanak ilk satırı ↔ ön oda; hat ↔ “odaya girme”; kapsam ↔ talep yazısı;
  oda varsayımı ↔ anahtarlık + kimlik kartı + sanığın sorgu beyanı (hazırlıklı); şekerlik ↔ 1. celsede yer kabulü →
  kriminal raporun ekleri → uzman (3 soru) → mütalaa (3 satır) → ara tahta → Q_SEKER; dışlama ↔ kapsam + varsayım +
  defter (2. celse); kask ↔ T5 tutarsızlığı + ifadenin okunması + ehliyet beyanı; muhbirin Selim'e dayanan çözülmesi
  ↔ kask + saat + saik; çözülmenin şekerliği aklaması ↔ 1. celsede yer kabulü; iz ↔ karşılaştırma talebi + kurye
  kayıtlarıyla kimlikli suç duyurusu.
- **Ara evre** her beraat yolunda bir bulgu üretir: uzman mütalaası (şekerlik) ya da muhbiri çözen Z raporu / Selim /
  yakalanma + iz. **İkinci celse** her beraat yolunda zorunlu bir katkı verir: şekerlik ya da muhbirin çözülmesi orada
  kurulur (1. celse şekerliği artık aklamaz); dışlama Nesrin'in defter tanıklığını ister.
- **En kısa yol araması (2026-10-21, tek süreç, sonuç başına ≤ 5 dk):** golden path'lerden ve elle kurulmuş rota
  tohumlarından (her beraat rotası için en ucuz dolgu ziyaretleriyle) açgözlü silme (12→1) + dolgu ziyaret ikamesi +
  tekil seçim ikamesi (`/tmp` betikleri `shrink3.mjs`). Bulunan en kısa yollar (üst sınır; tipik yol 216 eylem):

  | Sonuç | Rota | Eylem | Tipik yola oran | Tahmini süre |
  |---|---|---|---|---|
  | BERAAT_E | iz + muhbirin çözülmesi (Z raporu, kimlikli duyuru, karşılaştırma talebi, şekerliğin yeri) | **106** | %49 | 59,5 dk |
  | BERAAT_E | Selim + kask + saat + saik ile çözülme | 115 | %53 | 63,7 dk |
  | BERAAT_E | Z raporu (contra_t4) + uzman mütalaası | 116 | %54 | 63,0 dk |
  | BERAAT_E | kask (contra_t3) + uzman mütalaası | 117 | %54 | 64,0 dk |
  | BERAAT_E | dışlama (kapsam + defter) + uzman mütalaası | 119 | %55 | 65,9 dk |
  | BERAAT_B | tam olumlu ispat | **121** | %56 | 65,7 dk |
  | NITELIK_191 | oda + Z raporu, şekerlik aklanmaz | **100** | %46 | 56,2 dk |
  | TELKIN | sahte tanık kabulü | 70 | %32 | 45,3 dk |
  | MAHKUMIYET | varsayılan | 68 | %31 | 44,9 dk |

  Önceki tur: BERAAT_E 102 (açgözlü; gerçek alt sınır iz rotasında ~95), BERAAT_B 167 ve NITELIK_191 116 yalnızca puan
  eşikleri yüzündendi. %60 hedefi **karşılanmıyor**: her beraat rotası kendi başına hukuken yeterli bir kayıttır ve
  tipik yol (her mekânı dolaşan, beş rotanın hepsine dokunan oyuncu) 216 eylemdir; bir rota yaklaşık 105–120 eylemle
  kurulabiliyor. Kalan fark puanla değil yalnızca hukuken gereksiz önkoşullarla kapatılabilirdi (ör. dışlama varken
  muhbirin de çürütülmesini istemek ya da tek başına yeterli bir kayıtta ikinci bir zincir şartı); bu, bağlayıcı hukuki
  ölçütü (kayıt sanık lehineyken mahkûmiyet yok) ihlal edeceği için yapılmadı. TELKIN bir etik tuzağın sonucudur
  (teklif kabul edildiği anda), soruşturmaya bağlanmadı.

## 13. Ölçümler
`npm run case:duration -- beyaz-toz` (2026-10-21, delil zinciri yeniden dengelendi, puan eşikleri yok):

```
TIPIK          98.5 dk   13849 sözcük   216 aksiyon  BERAAT_E (12805)
G_E2           94.5 dk   13274 sözcük   208 aksiyon  BERAAT_E (11390)
G_E_DAG        86.3 dk   12337 sözcük   178 aksiyon  BERAAT_E (8310)
G_B            95.9 dk   13473 sözcük   211 aksiyon  BERAAT_B (12850)
G_N            79.6 dk   11350 sözcük   165 aksiyon  NITELIK_191 (7530)
G_M            65.8 dk    9227 sözcük   145 aksiyon  MAHKUMIYET (1315)
G_ETIK         78.6 dk   11168 sözcük   166 aksiyon  TELKIN (8480)
W              81.9 dk   11603 sözcük   174 aksiyon  MAHKUMIYET (8235)
==> TİPİK YOL (TIPIK): 98.5 dk  ✓ süre hedefte
```

`node tools/content/word-count.mjs content/cases/beyaz-toz`: paket 1.372 satır, 18.327 satır sözcüğü; ekran metinleriyle
toplam **24.462** sözcük; en uzun satır 219 karakter.

`npm run case:validate -- beyaz-toz` (2026-10-21): **PASSED — 0 hata**, 21 uyarı (1 SIMULATION_INCOMPLETE, 20
SOFTLOCK_UNVERIFIED — kaçış araması durum bütçesinde bitmeyen derin durumlar; önceki turla aynı sınıf, gerçek kilitlenme
değil); kapsam node 95/95, seçenek 225/225, kural 93/93, delil 59/59; golden path 8/8; softlock, sızıntı yok. Yeni
kuralların kapsamı golden path varyasyonlarıyla sağlanır (G_E2 / G_E_DAG mütalaa satır sırası, G_M PS_T5_ERKEN, G_ETIK
PS_S1_SATIR, W PS_S2_EKSIK ve PS_T3_EHLIYET).
