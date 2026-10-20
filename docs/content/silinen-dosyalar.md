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
| 18 Ekim 11.20 | Sigorta eksperi odada (polisten iki gün önce) | Tarık, Bülent | ARA · eksper fotoğrafları |
| 20 Ekim | DataKale imaj alır (kurcalanmış diskten); suç duyurusu + hasar ihbarı | Bülent, Tarık | INV · DataKale raporu (tarih, hash, kurtarma) |
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
  evinden" ↔ emniyet (02.14 yok, GSM). B6 kanaat cümlesi → itiraz (g_kanaat).
- **2. celse — Tarık (T1–T5):** "evimdeydim (Görükle)" ↔ operatör (02.14 Görükle, GM hattı); "cihaz söz konusu değil"
  ↔ zimmet (NOS-GM-LT); "yedek aylardır arızalı" ↔ devir "son yedek başarılı"; "sigorta yıllardır aynı" ↔ zeyilname;
  "şifre bilmem" ↔ e-posta izni. Cihaz ya da hat sunumu → T_02K (CMK 48 çekinme).
- **2. celse — Yaşar (Y1–Y3):** defter 23.05 ↔ kart kaydı 23.11 (iki bağımsız kayıt). Ozan'ın yönlendirici sorusu →
  itiraz (CMK 201/1). **Nalan (NL1–NL2):** zeyilname ve nakit sıkıntısı (saik).

## 6. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul (özet) | Sonuç | XP |
|---|---|---|---|---|---|
| 1 | ETIK | OTHER | selim_giris (müvekkile izinsiz giriş yaptırıldı) | Azil; delil dışlanır | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | bildirdi + cihaz/hat + rıza + tarik_coktu/contra + pers≥8 + final≥10500 | Beraat; gerçek fail soruşturulur | 1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | imaj çürük + rıza + cihaz/hat + pers≥6 + final≥9500 | Beraat (şüpheden) | 1,0 |
| 4 | NITELENDIRME | RECHARACTERIZED | rıza + final≥2800 (cihaz kurulmazsa) | 244'ten beraat, 243 adli para + HAGB | 0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan (+çöküş alt dalı) | 1 yıl 8 ay + 4 ay = 2 yıl hapis | 0,6 / 0,3 |

Ceza hesabı: `docs/legal/silinen-dosyalar.md` §2.

## 7. Skor
- Kategoriler: HUKUKI_BILGI, DELIL_ANALIZI, ARASTIRMA, SORGULAMA, SAVUNMA_STRATEJISI, USUL_BILGISI.
- Eşik çubuğu: Mahkûmiyet 0 · İndirim 2800 · Beraat 9500 (sonuç koşullarıyla aynı; BERAAT_B ek eşik 10500). Beraat eşiği
  erken çözüm denetiminde 8500'den 9500'e çıkarıldı (§10).
- `scaleMax` 13000; ölçülen final aralığı tavanı ~12565 (G1). Güvenilirlik bonusu cred×100.

## 8. Node grafiği
Hikâye kitabı §3'teki harita kaynağa birebir uygulandı. Parçalar: 40-briefing, 50-investigation-1, 52-inv-people,
60-hearing-1, 70-investigation-2, 80-trial, 90-outcomes, 95-report. Motor sınırları: INV_GECE_* ve T_02K DECISION/stage
zincirleri (ilk-blok sınırı); ara evresi yığınsız (etkinlikler doğrudan ARA_HUB'a döner, `retarget`); tekrarlı ceza
kuralları `maxUses`; ara tahtası ödülleri `firstTime` ile tek sefer.
Savcılığa bildirim (K_BILDIR) ertesi sabah başsavcılık bürosundaki kısa ARA_KARAR_BILDIRILDI sahnesine gider, oradan ARA_HUB'a döner.

## 9. Golden path'ler
| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| G1 | BERAAT_B | 12565 | Tam soruşturma; savcılığa bildirim; masumiyet savunması |
| TIPIK | BERAAT_E | 12325 | Aynı soruşturma; bildirmez (bekler); usul savunması |
| G3 | NITELENDIRME | 7230 | Özenli ama eksik: ham kayıt okunmaz, dizüstü/cihaz çıkarımı yapılmaz, kart/hat istenmez; rıza ve imaj kurulur; terditli savunma |
| G4 | MAHKUMIYET | 1410 | Dağınık soruşturma: e-posta bulunmaz, genel müdür vekilsiz ziyaret edilir, uzman raporu kabul edilir; duygusal savunma |
| ETIK | ETIK | 8745 | Ara evresinde müvekkile izinsiz giriş yaptırılır |
| W | MAHKUMIYET (çöküş) | 9025 | Tipik soruşturma ve ara evresi; ikinci celsede genel müdüre art arda ilgisiz belge sunulur, ♥0 |

Not (W): skor yüksek kalsa da çöküş bayrağı lehe bütün sonuçları kapatır; hüküm gerekçesi çöküşü anar.

## 10. Erken çözüm denetimi
- **Arama:** golden path'ten başlayan delta küçültme (`enumerateActions`/`act` ile motor oynatması; geçersizleşen aksiyonlar
  atlanır; 32→1 boyutlu parça silme, sonuç beraat kaldıkça kabul). Betik oturum notlarında; kaynak golden path'ler 99-tests.
- **İlk ölçüm (eşik 8500):** TIPIK'ten en kısa beraat 129 aksiyon (%58) — hedefin altında. Bu yol da rıza + imaj + dizüstü
  çıkarımı + bilirkişi + kart/cihaz zincirini kuruyordu; kısa olan, soruşturma çeşitliliğiydi.
- **Düzeltme:** BERAAT_E eşiği 9500. Yeni ölçüm: TIPIK'ten **146** aksiyon (%66), G1'den 145 (%65); BERAAT_B için en kısa
  180 aksiyon (%81). Bütün beraatler (a) rızanın kurulması, (b) imajın çürütülmesi ve (c) silme oturumunun cihaz/hat
  yoluyla müvekkilden ayrılması zincirini birlikte gerektirir.
- **Sızıntı taraması:** tipik yolun satır dökümü okundu. Genel müdürü erken işaret eden üç seçenek delile bağlandı:
  ARA dilekçesindeki "Genel müdürün gözaltına alınması" (kart/zimmet/hat ipucu ya da `fact_gm` olmadan görünmez),
  Nalan'a "Genel müdür o gece nerede?" sorusu (poliçe sorusundan sonra) ve son sözdeki "Asıl silen genel müdürdür!"
  (genel müdüre bağlayan bir bulgu olmadan görünmez). Erken ve delilsiz "tepki planları" nötrleştirildi: sabah
  sahnesinde bekçinin "GENEL MÜDÜR" park yerine bakışı, ilk celsede zarf anılınca düşen gazete, koridordaki fısıltı ve
  plaka vurgusu, imzasız notun "genel müdürlük kâğıdı" benzetmesi, ikinci celsede Tarık'ın girişindeki "ismini
  kayıtlar söyleyecek" iç sesi. Kalan işaretler (zarfı genel müdürün alması, defterdeki "GM aracı", cihaz adındaki
  "GM") oyuncunun bulduğu belgelere dayanır ve tek başına bir fail söylemez. Tarık
  Sezer'in fail olduğu, cihaz adı + kart + hat + poliçe ara evresinde birleşene kadar hiçbir metinde söylenmez.

## 11. Süre ve sözcük ölçümü
`npm run case:duration -- silinen-dosyalar` (2026-10-20):

```
  G1             97.2 dk   13488 sözcük   223 aksiyon  BERAAT_B (12565)
  TIPIK          97.4 dk   13537 sözcük   222 aksiyon  BERAAT_E (12325)
  G3             79.5 dk   11286 sözcük   168 aksiyon  NITELENDIRME (7230)
  G4             62.3 dk    9016 sözcük   122 aksiyon  MAHKUMIYET (1410)
  ETIK           74.8 dk   10429 sözcük   169 aksiyon  ETIK (8745)
  W              87.1 dk   12025 sözcük   203 aksiyon  MAHKUMIYET (9025)
  ==> TİPİK YOL (TIPIK): 97.4 dk  ✓ süre hedefte · KAPI ✓ GEÇTİ
```

`node tools/content/word-count.mjs content/cases/silinen-dosyalar`: tipik yolda 10.868 satır sözcüğü (ekran metinleriyle
13.537); paket 1.239 satır, 16.161 satır sözcüğü, ekran metinleriyle toplam **20.981** sözcük; en uzun satır 220 karakter.
Bütün sonuç yolları 60 dakikanın üstünde.

## 12. Doğrulama
`npm run case:validate -- silinen-dosyalar --max-ms 3600000`: makine paylaşımlı ve yüklüyken (yük ortalaması ~18, 8 çekirdek)
varsayılan 600 sn sert süre sınırı sayı bütçesine (20.000 durum) ulaşmadan doluyordu; aynı ölçüm Dava #07'de de 603 sn'de
kesildi. Sayı bütçeleri değiştirilmeden yalnızca sert süre sınırı uzatıldı; sonuç aşağıda.

```
content/cases/silinen-dosyalar: PASSED — 0 hata, 49 uyarı, 0 bilgi
  simülasyon: 69329 durum, 437381 geçiş, 400 yürüyüş, BFS kesildi; sonuçlar: ETIK ✓, BERAAT_B ✓, BERAAT_E ✓, NITELENDIRME ✓, MAHKUMIYET ✓
  kapsam: node 97/97, seçenek 196/196, kural 101/101, delil 54/54
  final skor aralığı: -8315…12565
  golden path: 6/6
```

Uyarılar: okunmayan bilgi bayrakları (UNREAD_VARIABLE; anlatı izleri), katılan vekilinin kürsü rolü (ROLE_MISMATCH,
Dava #07'deki gibi), iki ayırt edilemez seçenek çifti (ton farkı), beş sunulabilir ama sunum kuralı olmayan kart
(dilekçe/tahta için) ve uzun davada beklenen SIMULATION_INCOMPLETE. Diğer kapılar: `npm run build`, `npm run lint`,
`npx vitest run --project content-tools --project case-schema --project engine --project validator` (37 dosya, 1885 test;
Dava #07 doğrulayıcı testi makine yükü altında bir kez zaman aşımına uğradı, tek başına yeniden çalıştırıldığında geçti).
