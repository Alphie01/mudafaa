# Dava #13 "Silinen Dosyalar" — Dava Tasarımı

> Kaynak: `content/src/silinen-dosyalar/` → `content/cases/silinen-dosyalar/` (`npm run case:build -- silinen-dosyalar`).
> Hikâye kitabı: `docs/content/silinen-dosyalar-hikaye.md`. Hukuki notlar: `docs/legal/silinen-dosyalar.md`.
> Rütbe ORTAK · zorluk 4/5 · Bursa 9. Asliye Ceza (tek hâkim).

## 1. Logline ve tema
- Tek cümle: İşten çıkarılan bir sistem yöneticisi, şirketin verilerini silmekle suçlanır; gerçekte verileri, sigorta
  tazminatı için kendi şirketini sabote eden genel müdür silmiştir.
- Tema / dramatik soru: "Kayıt yalan söylemez" denir — ama kaydı tutan, özetleyen ve mahkemeye getiren eller yalan
  söyleyebilir. Bir kullanıcı adı bir kişi midir, bir anahtar mı?
- Ton: dijital noir; organize sanayi, gece vardiyası, yağmur, soğumuş çay. Ana mekânlar: fabrika, sunucu odası,
  Aktaşların evi, büro, adliye.

## 2. Gerçek ve kronoloji
| Zaman | Olay | Kim biliyor | Nasıl keşfedilir |
|---|---|---|---|
| 3 Ağustos | Siber poliçe zeyilnamesi: limit 2M→20M, "çalışan kötü niyeti" teminatı | Tarık, Nalan | ARA · zeyilname (mahkeme yazısı) + Nalan |
| 30 Eylül | Selim işten çıkar; yönetici şifreleri zarfla Tarık'a teslim | Selim, Tarık | INV · devir-teslim tutanağı (ev) |
| 30 Eylül 18.02 | Tarık'tan Selim'e izin e-postası ("hesabın açık kalacak") | Selim, Gül, Tarık | INV · e-posta çıktısı (ev çekmecesi) |
| 17 Ekim 21.30 | Selim izinle bağlanıp yalnızca kişisel klasörünü kopyalar | Selim | INV · oturum dökümü / görüşme (21.30 konusu) |
| 17 Ekim 22.00 | Son başarılı yedek | — | INV · sunucu odası fotoğrafı (yedek ekranı) |
| 17 Ekim 23.11 | Tarık'ın kartıyla sunucu odası; yedek devre dışı | Tarık | ARA · kart kaydı; INV · bekçi defteri, boş yuva |
| 18 Ekim 02.14 | Selim'in kullanıcı adıyla, NOS-GM-LT cihazı ve GM hattından silme | Tarık | INV · ham kayıt (cihaz adı); ARA · operatör (hat) |
| 18 Ekim 08.30 | Sunucu odasında boş klasörler; hoparlördeki DataKale "önce kurtarmayı deneriz, polis sonra" der | Bülent | Soğuk açılış (PR_01); INV · Ek-3 |
| 18 Ekim 11.20 | Sigorta eksperi odada (polisten iki gün önce; Tarık kendisi aradı) | Tarık, Bülent, Nalan | ARA · eksper fotoğrafları; T_04 Nalan (NL4) |
| 20 Ekim | DataKale imaj alır (kurcalanmış diskten); suç duyurusu; ihbar evrakı bu tarihle düzenlenir | Bülent, Tarık, Nalan | INV · DataKale raporu (tarih, hash, kurtarma) |
| 22 Ekim | Selim'in dizüstüsü usulünce imajlanır: yalnızca 21.30 | Hakan | INV · emniyet raporu |

## 3. Kadro
Hikâye kitabı §1'de tam ses tablosu var. Özet: müvekkil Selim Aktaş (masum, 21.30'u saklar), eşi Gül (öğretmen),
genel müdür Tarık Sezer (gerçek fail), mali işler müdürü Nalan Korkmaz (vicdan tanığı), DataKale sahibi Bülent Arıkan
(özensiz uzman, golf arkadaşı), bekçi Yaşar Kılıç, Kom. Yrd. Hakan Ilgaz, bilirkişi Dr. Sema Uçar, katılan vekili
Ozan Tekin, savcı Ferda Yalın, hâkim Kemal Oran.

## 4. Delil zinciri
| Kimlik | Ad | Tür | Keşif | İşlevi |
|---|---|---|---|---|
| ev_log_ozet | VPN özet dökümü | DIJITAL | dosyada | Savcılığın temel delili; cihaz sütunu eksik |
| ev_imaj_rapor | DataKale raporu | ADLI_RAPOR | dosyada | Uzman mütalaası; tarih/hash/kurtarma çatlakları |
| ev_emniyet | Emniyet raporu | ADLI_RAPOR | dosyada | Dizüstünde yalnızca 21.30; usulüne uygun |
| ev_devir | Devir-teslim tutanağı | BELGE | INV ev (masa) | Şifreler zarfla GM'de; hesap açık; kart iade |
| ev_eposta | İzin e-postası | BELGE | INV ev (çekmece) | 21.30 girişi rızaya dayanıyor (243 unsuru yok) |
| ev_tam_log | Ham VPN kaydı | DIJITAL | INV dilekçe | 02.14 cihaz adı NOS-GM-LT |
| ev_sema | Bilirkişi tutanağı | ADLI_RAPOR | ARA (celse1 talebi) | Orijinal disk: cihaz adı + kurtarma izleri |
| ev_turnike | Kart kaydı + zimmet | BELGE | ARA (celse1 talebi) | 23.11 GM kartı; NOS-GM-LT GM zimmetinde |
| ev_operator | GSM operatör cevabı | TELEFON_KAYDI | ARA (talep) | 02.14 hattı GM'ye tahsisli, Görükle |
| ev_zeyil | Poliçe zeyilnamesi | BELGE | ARA (talep) | Saik: limit on katı + çalışan teminatı |

Çıkarımlar (tahta): ded_sifre, ded_zincir, ded_ozet, ded_dizustu, ded_hat, ded_riza, ded_yedek, ded_cihaz (soruşturma);
ded_gm_oda, ded_gm_cihaz, ded_gm_hat, ded_motif, ded_once_sigorta (ara). Çeldirici çiftler her tahtada (modem+kapı,
hakan+kisisel, eksper+yedek, hash+hat…).

## 5. Çelişkiler (çapraz sorgu)
- **1. celse — Bülent (B1–B6):** "ilk iş imaj aldık" ↔ künye 20.10 (iki gün); "kimse dokunmadı" ↔ Ek-3 kurtarma;
  "özet değerler tuttu" ↔ iki farklı hash (kırılma → H1_03K); "şifreyi kimse bilmez" ↔ devir tutanağı; "sanığın
  evinden" ↔ emniyet (02.14 yok, GSM) **ya da** ham kayıt / `ded_cihaz` (NOS-GM-LT; iki kural aynı bayrağı tek sefer
  verir). B6 kanaat cümlesi → itiraz (g_kanaat).
- **2. celse — Bilirkişi Sema (S1–S4, T_01S):** imaj iki gün sonra; "silme izlerinin" bir kısmı kurtarma yazılımının;
  cihaz adı NOS-GM-LT; "kimin kullandığına kanaat bildirmem." Bastırmak açıklatır; ham kayıt S3'ü, zimmet S4'ü
  doğrular. Ardından **T_01X:** Ozan "ad değiştirilebilir mi?" — doğru hamle itiraz etmemek (teknik olasılık bilirkişinin
  alanında; cevap: sertifika değişmez); "varsayım" ve "vekil soru soramaz" itirazları yanlış.
- **2. celse — Tarık (T1–T5):** "evimdeydim (Görükle)" ↔ operatör (02.14 Görükle, GM hattı) ya da kart kaydı; "şifre
  bende değil" ↔ e-posta/devir; "yedek aylardır arızalı" ↔ `ded_yedek` (cuma 22.00 başarılı yedek, kablo sökülmüş);
  "şifre bende değil" ayrıca ↔ devir tutanağı/`ded_sifre` (PS_T_SIFRE: 4. madde, zarfı teslim alan T. Sezer →
  `contra_t_sifre`, hüküm gerekçesinde bir cümle);
  "sigorta yıllardır aynı" ↔ zeyilname ya da `ded_once_sigorta` (eksper polisten önce); "başka cihaz söz konusu değil" ↔
  zimmet (NOS-GM-LT → T_02K, CMK 48 çekinme) ya da ham kayıt/bilirkişi/`ded_cihaz` (başka cihaz; kime ait olduğu ayrı).
- **2. celse — Yaşar (Y1–Y3):** defter 23.05 ↔ kart kaydı 23.11. Tanık yönlendirildiyse (YD_SAAT ya da YA_EZBER) Ozan
  sorar, Yaşar dürüstçe anlatır: ♥−1, ikna −2, **−1.500 skor** ("Etik ihlali" satırı), XP yarıya (ethics), defter sunumu
  ikna vermez, 2-b beraati kapanır; hâkim tutanak örneğinin Cumhuriyet Başsavcılığına ve Bursa Barosuna gönderilmesine
  karar verir, BERAAT_E gerekçesi bildirimi anar, epilogda Leyla'nın baro zarfı sahnesi normal kapanışın yerini alır.
  Ölçüm: TIPIK'te YA_EZBER ya da YD_SAAT → BERAAT_E 11.530 (−1.700), XP 1.323 → 576; G1'de → BERAAT_E 11.770, XP 1.616 → 588. Ozan'ın yönlendirici sorusu → itiraz (CMK 201/1); "ilişki sorulamaz" itirazı yanlış
  (CMK 58/1).
- **2. celse — Nalan (NL1–NL4):** zeyilname, nakit sıkıntısı; "gerekçesini bilmiyorum" (bastır: "bir çalışan sorun
  çıkarırsa diye"; zeyilname metni çürütür); "ihbar pazartesi" ↔ `ded_once_sigorta` (Tarık cumartesi sabahı eksperi
  aramış, evrak geriye tarihlenmiş).

## 6. Sonuçlar
Hüküm iki soruya bölünür: 243/1 (rıza: `riza_kanit`) ve 244/2 (silme sanıktan koptu mu: imaj çöktü + cihaz bulgusu ya da
bilirkişi). Beraat türü mahkemedeki delile bağlıdır; savcılığa bildirim yalnızca epilogu ve gerçek failin soruşturmasını
değiştirir. Ayrıntı ve ceza hesabı: `docs/legal/silinen-dosyalar.md` §2, §4.

| Öncelik | Kimlik | Sınıf | Koşul (özet) | Sonuç | XP |
|---|---|---|---|---|---|
| 1 | ETIK | OTHER | selim_giris | Azil; delil dışlanır | 0 |
| 2 | COKUS | OTHER | ♥0 (cokus) | Ara karar: sanık vekâleti sona erdirir, yeni müdafi için erteleme | 0,3 |
| 3 | BERAAT_B | ACQUITTAL | rıza + başka fail (cihaz/hat) + Tarık çözüldü + masumiyet talebi + tanık yönlendirilmedi + ikna≥8 + final≥10500 | 244/2: 2-b · 243/1: 2-a | 1,2 |
| 4 | BERAAT_E | ACQUITTAL | rıza + imaj çöktü + cihaz bulgusu + ara evresi bulgusu (bilirkişi/zimmet/hat/kart) + ikna≥6 + final≥9500 | 244/2: 2-e · 243/1: 2-a | 1,0 |
| 5 | NITELENDIRME | RECHARACTERIZED | rıza YOK + silme koptu + final≥2800 | 244/2: 2-e · 243/1: 2.000 TL adli para + HAGB | 0,85 |
| 6 | KISMI | CONVICTION | rıza var, silme koparılamadı | 243/1: 2-a · 244/2: 1 yıl 3 ay, ertelendi (HAGB yok) | 0,7 |
| 7 | MAHKUMIYET | CONVICTION | varsayılan | 244/2: 1 yıl 8 ay · 243/1: 2.000 TL adli para; HAGB ve erteleme somut gerekçeyle yok | 0,6 |

Epilog koşulları (doğrulayıcı okumaz, elle denetlendi): BERAAT_B ve BERAAT_E'de Leyla'nın sahnesi `bildirdi`ye göre
iki varyant; BERAAT_E'de tanık yönlendirmesi ve faille yüzleşme blokları; COKUS'ta bilirkişi dinlendiyse "delil dosyada"
bloğu; mahkûmiyet gerekçelerinde 244/2 cümlesi dosyaya giren lehe bulguya (zimmet/hat, bilirkişi, hiçbiri) göre üç varyant.

## 7. Skor
- Kategoriler: HUKUKI_BILGI, DELIL_ANALIZI, ARASTIRMA, SORGULAMA, SAVUNMA_STRATEJISI, USUL_BILGISI.
- Eşik çubuğu: Mahkûmiyet 0 · İndirim 2800 · Beraat 9500 (sonuç koşullarıyla aynı; BERAAT_B ek eşik 10500). BERAAT_E'ye
  ara evresi delil şartı eklendi; eşiğin 8500'e indirilmesi denendi ve erken çözüm denetiminde %52'ye düştüğü için
  9500'de bırakıldı (§10).
- `scaleMax` 13000; ölçülen final aralığı tavanı ~13470 (G1). Güvenilirlik bonusu cred×100.
- Çıkarım tahtalarında yanlış eşleşme: her yeni çift −50; 6. ve 12. yanlış çiftte −1 güvenilirlik ve Leyla'nın uyarısı.
- Belge incelemesinde yanlış alet/hedef: −50 (DELIL_ANALIZI). Tanık yönlendirme: −1.500 ("Etik ihlali" satırı).

## 8. Node grafiği
Hikâye kitabı §3'teki harita kaynağa birebir uygulandı. Parçalar: 40-briefing, 50-investigation-1, 52-inv-people,
60-hearing-1, 70-investigation-2, 80-trial, 90-outcomes, 95-report. Motor sınırları: INV_GECE_* ve T_02K DECISION/stage
zincirleri (ilk-blok sınırı); ara evresi yığınsız (etkinlikler doğrudan ARA_HUB'a döner, `retarget`); tekrarlı ceza
kuralları `maxUses`; ara tahtası ödülleri `firstTime` ile tek sefer.
Savcılığa bildirim (K_BILDIR) ertesi sabah başsavcılık bürosundaki kısa ARA_KARAR_BILDIRILDI sahnesine gider, oradan ARA_HUB'a döner.

## 9. Golden path'ler
| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| G1 | BERAAT_B | 13470 | Tam soruşturma; savcılığa bildirim; bilirkişi, Tarık, Yaşar, Nalan; masumiyet savunması |
| TIPIK | BERAAT_E | 13230 | Aynı soruşturma; bildirmez (bekler); usul savunması |
| G3 | NITELENDIRME | 6810 | E-posta bulunmaz, hesap-açık maddesi okunmaz (rıza yok); imaj çürütülür, bilirkişi dinlenir; terditli savunma |
| G5 | KISMI | 6120 | Rıza kurulur; imajın çatlakları birleştirilmez; bilirkişi yalnızca dilekçede istenir (ara kararla atanır, rapor gelir) ama dinlenmez; cihaz/hat kurulmaz |
| G4 | MAHKUMIYET | 1415 | Dağınık soruşturma: e-posta yok, genel müdür vekilsiz ziyaret edilir, uzman raporu kabul edilir; duygusal savunma |
| ETIK | ETIK | 8760 | Ara evresinde müvekkile izinsiz giriş yaptırılır |
| W | COKUS | 9100 | Tipik soruşturma ve ara evresi; bilirkişi dinlenir; Tarık'a art arda ilgisiz belge, ♥0 → azil, erteleme |

## 10. Erken çözüm denetimi
- **Arama:** golden path'ten başlayan delta küçültme (`act` ile motor oynatması; reddedilen aksiyonlar atlanır; 32→1
  boyutlu parça silme, sonuç beraat kaldıkça kabul; tek süreç, 300 sn bütçe). Kaynak: TIPIK ve G1.
- **İnceleme öncesi:** en kısa beraat 150 aksiyon / 222 (%68), yalnızca skor eşiğiyle.
- **Bu tur (2026-10-21):** BERAAT_E'ye ara evresi delil şartı eklendi. Eşik 8500'e indirilince en kısa beraat 121
  aksiyona (%52) düştü; eşik 9500'de bırakıldı. Ölçüm: TIPIK'ten **151** aksiyon, G1'den **149** (tipik 233 → %64);
  BERAAT_B için en kısa **163** (%70). Küçültülmüş yollar da rıza (e-posta + 21.30), imajın çöküşü (zincir + B2/B3),
  dizüstü çıkarımı, bilirkişi, kart/zimmet ve operatör zincirini kuruyor; kısalan, tanık görüşmeleri ve akşamlar.
- **Sızıntı taraması:** tipik yolun satır dökümü yeniden okundu. Soğuk açılışta bir kadroya eşlenebilecek ayrıntı yok
  (yaka, saat, zarf, iç cep çıkarıldı; yalnızca eller, ekran, sesler). PR_01'de "polisi sonra arayalım" cümlesi
  hoparlördeki isimsiz bilgi işlem sesine verildi; "…, gece yarısı bile / cumartesi sabahı bile" yankısı kaldırıldı.
  T_02K'deki iç cep jesti artık bir kurulumla eşleşmiyor. Soğuk açılıştaki "doktor" ve imzasız notun krem kâğıdı ancak
  ara evresinde, poliçe sorusundan sonra Nalan'ın cümleleriyle karşılık bulur ve Deniz "benzerlik delil değildir" der.
  Genel müdürü adıyla hedef alan seçenekler önceki turdaki gibi delile bağlı.

- **Şeytanın avukatı turu (2026-10-21, ikinci):** delta küçültme fixpoint'e kadar (6 geçiş) yeniden koşuldu:
  TIPIK'ten en kısa beraat **155**, G1'den **153** aksiyon (tipik 233 → %66); BERAAT_B için **163** (%70). Hepsi %60
  sınırının üstünde ve rıza + imaj çöküşü + cihaz + ara evresi bulgusu zincirini kuruyor.
- **Kazanılmamış bilgi denetimi (aynı tur):** her golden path'in satır dökümü, oyuncunun elindeki delile karşı tarandı.
  Düzeltilenler: PR_T1'deki "Operatör kaydındaki baz istasyonu da Görükle" yalnızca `clue_hat_gm`/`ev_operator` varken
  (yoksa "Not ettim; elimde bunu bir şeye bağlayacak kâğıt yok"); ARA_GIRIS "bir kullanıcı adı, bir cihaz, bir hat, bir
  poliçe… bir yüz" yerine gelen müzekkere cevabı sayısına göre üç varyant (ARA_GIRIS_3/4 DECISION zinciri); ARA_SON_1
  poliçe yalnızca `ev_zeyil` + `fact_gm`; ARA_SON_2 "bir isim buldum" yalnızca `fact_gm`; ARA_SON'da Leyla'nın "yarın bir
  isim kürsüye oturabilir"i `fact_gm`'e bağlı, Görükle villaları ve dörtlü liste kaldırıldı; ARA_LEYLA ve ARA_KARAR_SEC /
  K_BILDIR'deki "kart, zimmet, hat, poliçe" listeleri genelleştirildi. Bilirkişi süreklilik: dilekçedeki bilirkişi
  talebi (DIL_BILIRKISI) H1_05B'de `bilirkisi_atandi`yı da kaldırır (tek bayrak); T_00G_*, T_00, ARA_HAKAN (HA_DISK
  dahil) ve ARA_LEYLA'daki Sema/rapor satırları bilirkişi yoksa başka varyanta düşer; "kibrini çatlattık" yalnızca
  `contra_b2`/`contra_b3` ile. G4 dökümünde artık hiçbir kazanılmamış iddia yok.
- **Diğer:** INV_DIL'e DIL_HTS, H1_05'e R_HTS uzun ve hukuki görünen tuzak talepleri eklendi; DIL_BILIRKISI ve R_OPR
  etiketleri kısaltıldı. Belge incelemesinde yanlış alet −20 → **−50**. Soruşturma ve ara evresi yer kartlarından gün
  adları kaldırıldı (sahne sırası serbest). INV_SABAH'ta Yaşar'ın bakışı idari binadan kulübe saatine çevrildi; araba
  kaldı, iki ipucunu bağlayan kesme yok. Hakan'ın dosya listesinde "çocuk" yerine "hesap ele geçirme".

## 11. Süre ve sözcük ölçümü
`npm run case:duration -- silinen-dosyalar` (2026-10-21):

```
  G1            103.5 dk   14424 sözcük   234 aksiyon  BERAAT_B (13470)
  TIPIK         103.4 dk   14422 sözcük   233 aksiyon  BERAAT_E (13230)
  G3             81.7 dk   11663 sözcük   169 aksiyon  NITELENDIRME (6810)
  G5             76.3 dk   10829 sözcük   161 aksiyon  KISMI (6120)
  G4             64.7 dk    9457 sözcük   122 aksiyon  MAHKUMIYET (1415)
  ETIK           75.1 dk   10478 sözcük   169 aksiyon  ETIK (8760)
  W              89.2 dk   12380 sözcük   204 aksiyon  COKUS (9100)
  ==> TİPİK YOL (TIPIK): 103.4 dk  ✓ süre hedefte · KAPI ✓ GEÇTİ
```

`node tools/content/word-count.mjs content/cases/silinen-dosyalar`: tipik yolda 11.600 satır sözcüğü (ekran metinleriyle
14.422); paket 1.412 satır, toplam ~24.500 sözcük; en uzun satır 220 karakter. Bütün sonuç yolları 60 dakikanın üstünde.

## 12. Doğrulama
`npm run case:validate -- silinen-dosyalar` (varsayılan bütçe, 76 sn):

```
content/cases/silinen-dosyalar: PASSED — 0 hata, 42 uyarı, 0 bilgi
  simülasyon: 65782 durum, 432278 geçiş, 400 yürüyüş, BFS kesildi; sonuçlar: ETIK ✓, COKUS ✓, BERAAT_B ✓, BERAAT_E ✓, NITELENDIRME ✓, KISMI ✓, MAHKUMIYET ✓
  kapsam: node 99/99, seçenek 204/204, kural 115/115, delil 54/54
  golden path: 7/7
```

Uyarılar: okunmayan bilgi bayrakları (UNREAD_VARIABLE; anlatı izleri), katılan vekilinin kürsü rolü (ROLE_MISMATCH,
Dava #07'deki gibi) ve uzun davada beklenen SIMULATION_INCOMPLETE. Ayırt edilemeyen seçenek ve sunum kuralı olmayan
sunulabilir kart uyarıları giderildi. Diğer kapılar: `npm run build`, `npm run lint`,
`npx vitest run --project content-tools --project case-schema --project engine --project validator --maxWorkers=2`
(37 dosya, 1885 test) geçti.
