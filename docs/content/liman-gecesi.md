# Dava #10 "Liman Gecesi" — Dava Tasarımı

> Kaynak: `content/src/liman-gecesi/` (yazım kiti + satır kısaltması `dsl.ts`) → `content/cases/liman-gecesi/`
> (`npm run case:build -- liman-gecesi`). Hikâye kitabı: `docs/content/liman-gecesi-hikaye.md` (önce yazıldı).
> Hukuki notlar: `docs/legal/liman-gecesi.md`. Lineup: #10, rütbe `KIDEMLI`, zorluk 4.

## 1. Logline ve tema

- **Logline:** Mudanya limanında bir puantör iki konteynerin arasında ölü bulunur; kavga ettiği laşing işçisi Tarık Demirel
  “öldürmek için geri döndü” iddiasıyla müebbetle yargılanır. Tarık bir yumruk attığını saklamaz; ama yumruk öldürmez.
- **Tema:** Bir insanın yaptığı şeyin bedelini ödemesi ile yapmadığı şeyin bedelini ödemesi arasındaki fark. Savunma
  yumruğu inkâr etmeden onun ölçüsünü tartmaktır.
- **Gemlik / Dava #07'den farkı:** Dava #07'nin liman sahnesi Gemlik'te, kaçan bir şüphelinin gemisidir. Burada mekân
  Mudanya limanının içi (rıhtım, B sahası, vardiya ofisi, forklift garajı) ve iskele büfesidir; ters köşe bir ölüm saati
  ve bir otopsi kırığıdır, kaçış yoktur.

## 2. Gerçek ve kronoloji

Ayrıntılı tablo hikâye kitabının §3'ündedir. Oyuncunun öğrenme sırası:

| Gerçek | Nerede öğrenilir |
|---|---|
| Ercan, ölü ağabey Emre'yle alay etti, tükürdü, itti | INV_GORUSME (TP_ERCAN sert / TP_EMRE), INV_SUKRU (SK_EMRE) |
| Tarık bir kez vurdu, utandığı için “ittim” dedi | INV_GORUSME (TP_YUMRUK; güven ya da olay yeri bulgusu gerekir) |
| Yumruk başı vurdurmadı (kan oturma hizasında; burun-dudak basit) | INV_RIHTIM (ob_baba) + INV_ONRAPOR (o1) → ded_kan |
| “Seni gebertirim”i kimin söylediği görülmedi | INV_SUKRU (SK_KIM → clue_pil); INV_IFADE kenar notu |
| Tarık 23.18'de çıktı, 23.37'de büfede, 00.00'a kadar iskelede | INV_GULAY (ev_hesap), INV_TURNIKE (clue_cikis), INV_BUFE (clue_pos, clue_radyo), INV_NAIL |
| B sahası projektörleri 23.00–02.00 bakımdaydı | INV_RIHTIM (ob_proj) + INV_KENAN (clue_kenan_isik) → ded_isik |
| Düşme değil, darbe | INV_ONRAPOR (o2 cetvel, o3 büyüteç) → ded_darbe; INV_ORHAN dersi |
| Ercan 23.34'te yedi, 23.41'de telefonda konuştu | INV_SUKRU / H1_03 (clue_kantin), INV_ONRAPOR (o4), INV_TELEFON (t3) → ded_saat, ded_canli |
| Ercan B sahasına taşındı; çift lastik izi | INV_BSAHA → ded_tasima |
| 23.49–00.14 bir servis kamyoneti girdi çıktı | INV_TURNIKE (g4 → clue_servis_arac) |
| 23.41 hattının abonesi Kenan Aksoy (**ters köşe**) | H1_06 TL_ABONE → ARA_GIRIS (ev_abone) |
| “Kptn” = Kenan'ın lakabı; “Kaptan bize borçlu”; defter | ARA_SEVIM |
| Kamyonet 23.52–00.06 B sahasında; zimmet K. Aksoy | H1_06 TL_GPS → ARA_KAYIT → ded_arac |
| Kırık eski tip manuel kilidin konisi; emanetteki SA-2 2,6 cm | ARA_TARIK (clue_tarik_koni), ARA_EMANET (clue_koni) → ded_silah |
| Kayıt dışı üç konteyner | ARA_DEFTER → ded_motif |
| Servis kitinden bir eski tip kilit ertesi sabah “kayıp” | ARA_NURTEN (clue_envanter; Kenan uyarılmışsa yok) → ded_eksik |

Mystery integrity: Kenan'ın fail olduğu hiçbir satırda söylenmez. İlk celsede onun teşhisi yalnızca “yanıldı” düzeyinde
çöker; kimliği ara evresinde mahkemenin istediği abone kaydıyla, ancak oyuncu 23.41 aramasını bulup talep ettiyse gelir.
Soruşturmadaki tohumlar yalnızca kayda dayanır: aydınlatma etiketi (“gündüz gibiydi”e karşı), araç kapısı dökümü
(23.21 çıkış, 23.49 giriş) ve rehber kısaltması “Kptn”. Kamyonetin ofis önünde çalışır duruşu (Tarık) ve römorkör
fotoğrafı ara evresine (ARA_TARIK, ARA_KENAN) taşındı; “Kptn kim?” kenar notu, “Fener … kaldı” satırı, gün 1’deki HTS
seçeneği ve “Ya biliyorsa?” kaldırıldı.

## 3. Kadro

Bkz. hikâye kitabı §2. Yeni sprite'lar (Gülay `lg_gulay`, Kenan `lg_kenan`, Doç. Karaca `lg_karaca`)
`content/src/liman-gecesi/sprites.ts`'te ortak gövde şablonlarının (anne, huseyin) palet harfleriyle yeniden boyanmasıyla
satır içi tanımlıdır; `content/shared/sprites/` değişmedi. Ortak sprite'lar: avukat_cubbe (Deniz), mentor (Leyla),
muvekkil (Tarık), bora (Şükrü), huseyin (Nail), anne (Sevim), bilirkisi (Dr. Beyaz), polis (Bşk. Aydemir), gardiyan
(Cevdet), hakim/uye_hakim/savci/mubasir.

## 4. Delil zinciri

| Kimlik | Ad | Tür | Keşif | Ne işe yarar | Sunulur |
|---|---|---|---|---|---|
| ev_twistlock | Emanet No. 2024/318: twistlock | EVIDENCE (savcılık) | baştan | H1_04 itirazı; yanlış sunum cezası | ✓ |
| ev_kenan_ifade, ev_sukru_ifade, ev_tarik_ifade | Kolluk beyanları | EVIDENCE (savcılık) | baştan | yanlış sunum cezası | ✓ |
| ev_onrapor | Ön otopsi raporu | EVIDENCE | baştan | INV_ONRAPOR belgesi; S2 kısmi | ✓ |
| ev_telefon | Telefon inceleme tutanağı | EVIDENCE | baştan | INV_TELEFON belgesi | ✓ |
| ev_hesap | Hesap dökümü 23.37 | EVIDENCE | INV_GULAY (GL_KART) | K1 | ✓ |
| ev_turnike | Turnike ve araç kapısı dökümü | EVIDENCE | INV_DIL → gün sonu / duruşma gecesi | INV_TURNIKE belgesi; K1 | ✓ |
| ev_kantin | Kantin kaydı | EVIDENCE | INV_DIL / TL_KANTIN | B2 kısmi | ✓ |
| ev_atk | ATK nihai raporu | EVIDENCE | ARA_GIRIS (her zaman) | B1 kısmi; ARA_TARIK şeması | ✓ |
| ev_gps | Araç takip ve zimmet | EVIDENCE | TL_GPS / EK_GPS | ARA_KAYIT belgesi; K5 | ✓ |
| ev_abone | BTK abone bilgisi | EVIDENCE | TL_ABONE / EK_ABONE | K6 | ✓ |
| ev_defter | Ercan'ın defteri | EVIDENCE | ARA_SEVIM | ARA_DEFTER belgesi | ✓ |
| clue_* | 37 ipucu | CLUE | sahne / belge / konuşma | tahtaya; clue_pil, clue_projektor, clue_servis_arac, clue_envanter sunulabilir | kısmen |
| ded_cikis | Tarık geri dönmedi | INSIGHT | cikis + pos | K1 | ✓ |
| ded_buf | Gece yarısına kadar iskelede | INSIGHT | nail + radyo | K1; donus_yok | ✓ |
| ded_isik | Projektörler sönüktü | INSIGHT | kenan_isik + projektor | K2 | ✓ |
| ded_kan | Yumruk başı vurdurmadı | INSIGHT | baba_kan + basit | S2 | ✓ |
| ded_darbe | Düşme değil, darbe | INSIGHT | desen + kontrkup | B1 | ✓ |
| ded_saat | Ölüm 23.34'ten sonra | INSIGHT | mide + kantin | B2 | ✓ |
| ded_canli | 23.41'de yaşıyordu | INSIGHT | arama2341 + cikis | B2 | ✓ |
| ded_tasima | Araçla gelen biri onu taşıdı | INSIGHT | surukleme + lastik (ya da kan_yolu + lastik) | anlatı / tahta | — (sunum kuralı yok; uyarı) |
| ded_silah | Emanetteki kilit yarayı açamaz | INSIGHT | koni + desen | B3 | ✓ |
| ded_arac | Kamyonet ölüm saatinde B sahasında | INSIGHT | gps + zimmet | K5 | ✓ |
| ded_motif | 23.41'deki konuşmanın sebebi | INSIGHT | defter_satir/manifesto + arama2341 | K6 | ✓ |
| ded_eksik | Kitten eksik eski tip kilit | INSIGHT | envanter + tarik_koni | K7 | ✓ |

Tahta: soruşturma tahtası (20 kart) 9 tarif (8 çıkarım, 1 alternatif); ara tahtası (12 kart) 5 tarif (4 çıkarım, 1 alternatif)
— toplam 14 tarif, 12 çıkarım. Çeldirici kartlar: matara, kafes, pamuk, kan yolu (tek başına), mont, servis aracı (tek
başına); yanlış çift −50. Havuzlar simülasyon dallanmasını sınırlamak için yalnızca tarife giren kartlar ve birkaç çeldiriciyle tutuldu.

## 5. Çelişkiler

**Şükrü Balcı (1. celse, yeminli):** S1 “Tarık bağırdı” (bastır; clue_pil → contra_s1, kırılma “Bilmiyorum”) · S2 “kafası
babaya çarptı” (ded_kan → contra_s2; ev_onrapor kısmi) · S3 “söverek kantine yürüdü” (bastır → clue_kantin ve S4) ·
S4 “hırslıdır, döner” (itiraz g_kanaat).
**Kenan Aksoy (1. celse):** K1 “B sahasının ağzında gördüm” (ded_cikis / ev_turnike / ev_hesap / ded_buf → contra_k1) ·
K2 “gündüz gibiydi” (ded_isik / clue_projektor → contra_k2) · K3 kanaat (itiraz) · K4 “sabaha kadar ofisteydim”
(clue_servis_arac kısmi). İkisi birden → “belki yanılmışımdır”.
**Doç. Dr. Karaca (2. celse):** B1 düşmeyle oluşabilir (ded_darbe; ev_atk kısmi; telkin itirazı) · B2 23.00–01.00
(ded_saat / ded_canli; ev_kantin kısmi) · B3 dosyadaki kilit (ded_silah) · B4 (bastırınca) eski tip kilit.
**Kenan Aksoy (2. celse, CMK 48):** K5 kamyonet (ded_arac / ev_gps) · K6 arama (ev_abone / ded_motif) · K7 kit (ded_eksik /
clue_envanter) · K8 kanaat (itiraz). Her çelişkide tanık cevap vermemeyi seçer.

Diğer kararlar: H1_02 sanığa tavsiye (dürüst / inkâr / meşru müdafaa / susma), H1_02Q masumiyet karinesi itirazı, H1_04
twistlock, H1_06 üç ara karar talebi, H1_07 tutukluluk, T_03 telkin edici soru, T_04 ek savunma, T_05 mütalaaya cevap,
T_06 esas savunma (5 seçenek), T_07 son söz.

## 6. Sonuçlar

Karar duruşma kaydındaki olgulara bağlıdır (CMK 217/1: hüküm yalnızca duruşmaya getirilip tartışılan delile dayanır;
heyet esas savunmanın adıyla bağlı değildir, CMK 225). Esas savunmanın seçimi (T06_B/E/T/D/X) puanı, iknayı, kapanış
metnini ve epilog tonunu değiştirir; beraati değil. Skor yalnızca XP'yi, notu ve 223/2-b eşiğini etkiler.

| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | ETIK | OTHER | `etik_gulay` (Gülay'a yalan saat öğütlendi) | Azil; Başsavcılık ve Baro bildirimi | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | ¬çöküş ∧ `gercek_fail` ∧ donus_yok ∧ olum_sonra ∧ ikna ≥ 8 ∧ final ≥ 10.000 | Beraat + yumruk için 223/8 düşme | 1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | donus_yok ∧ olum_sonra (skor eşiği yok) | Beraat + 223/8 düşme | 1,0 |
| 4 | NITELIK | RECHARACTERIZED | donus_yok ∧ ¬olum_sonra | 87/4 + 29 + 62/1: 6 yıl 3 ay | 0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan (= ¬donus_yok) | 81/1 + 21/2 + 62/1: 16 yıl 8 ay | 0,6 (çöküş 0,3) |

- **donus_yok:** contra_k1 ∨ (contra_n1 ∧ contra_n2). Yalnızca kürsüde sunulan kayıt sayılır: soruşturmadaki
  ded_cikis/ded_buf çıkarımları sunulmadıkça kayda geçmez.
- **olum_sonra:** contra_b1 ∧ contra_b2. Darbe şekli düşme mekanizmasını (ve yumruk → düşme → bilinç açıklığı sonrası
  gecikmiş ölüm ihtimalini) dışlar; saat ölümü sanığın ayrılışından sonraya koyar. contra_b3 (kilit ölçüsü) gerekçeye
  ve puana girer, tek başına bunların yerini tutmaz.
- **gercek_fail** (T06_B ile): suç duyurusu ∧ contra_k5 ∧ (contra_k6 ∨ contra_k7) ∧ donus_yok ∧ olum_sonra.
- **supheli** (T06_E/T ile): donus_yok ∧ olum_sonra; yalnızca kapanış metnini seçer.
- 87/4 gerekçesi kısmi bilirkişi bulgusuna göre üç ayrı satırla yazılır (B1 ve B2 yok; yalnızca B2 → bilinç açıklığı;
  yalnızca B1 → saat dışlanamadı); kayıttaki bir olguyla çelişen gerekçe satırı yoktur.
- Etik sayaç: SK_TELKIN, SUC_C, KY_SOR (+1), GL_YALAN (+2), T_03E (+1). XP etikte yarıya iner; ETIK'te 0.

## 7. Skor

- Kategoriler ve döküm satırları: Delil toplama (ARAŞTIRMA + DELİL ANALİZİ) · Çapraz sorgu (SORGULAMA) · İtiraz isabeti
  (USUL + HUKUKİ, `legal_hits`) · Savunma · Hatalı delil (`wrong`). Güvenilirlik bonusu ♥ × 100.
- Strateji çarpanı yalnızca uyumlu esas savunmada (MASUMIYET ×1,5 → T06_B; USUL ×1,2 → T06_E; INDIRIM ×0,8 → T06_T).
- Eşik çubuğu: Savunma puanı 0 · 223/2-b eşiği 10.000 (sonuçlar olgulara bağlı olduğundan beraat/87/4 eşiği yok).
- Tutarlar: olay yeri +20…+60, çeldirici/ıska −10; belge +60…+150, yanlış alet −20; tarif +300, yanlış çift −50;
  BASTIR +25; doğru sunum +300, kısmi +100; yanlış sunum −150 ♥−1; usul +40…+150, dayanaksız −40…−80 ♥−1; esas savunma
  150–375 (çarpanlı), başarısız −100; etik ihlaller −60…−150.

## 8. Node grafiği

Bkz. hikâye kitabı §4. Uygulamadaki ek node'lar: INV_GORUSME_G, INV_BUFE_G, INV_GULAY_G, INV_IFADE (0 EP belge),
INV_GECE_1…6 + 3B (koşullu hafıza zinciri), H1_00G, H1_02Q/H102Q_SON, H1_04B (kısa ara), H1_05K, ARA_GIRIS_1/2,
ARA_SEVIM_G, ARA_TARIK_G, ARA_TALEP, ARA_SON_1…3, T_00G, T_01K, T_02K, T_03E (etik), T_03G, T_06S, T_COKUS. Soruşturma
hub'ı push/`$return`; ara hub'ı yığınsız (`retarget`). Motor sınırları: koşullu parçalar DECISION zincirleriyle;
tekrar eden ceza kuralları `maxUses: 3`; tahta tarifleri `IF ¬hasEvidence` ile yalnızca ilk kurulumda puanlı.

## 9. Golden path'ler

| Ad | Sonuç | Özet |
|---|---|---|
| G1 | BERAAT_B | Masumiyet; tam soruşturma; ara evresinde savcılığa suç duyurusu; esas savunma 223/2-b |
| TIPIK | BERAAT_E | İspat stratejisi; tam soruşturma; suç duyurusu yok; esas savunma 223/2-e |
| G3 | NITELIK | Terditli; ölüm saati ve darbe kanıtlanmaz; dönüş yok K1 ile; ek savunmada süre; terditli savunma |
| G4 | MAHKUMIYET | Dağınık soruşturma, telkin, inkâr, dayanaksız talepler, olası kastın kabulü |
| G5 | ETIK | İyi bir soruşturma; Gülay'a “on bir buçuk deyin” |
| OLGU_D | BERAAT_E | TIPIK + esas savunmada olası kastın kabulü (T06_D): olgular kayıttaysa beraat değişmez |
| OLGU_T | BERAAT_E | TIPIK + terditli esas savunma (T06_T) |
| OLGU_X | BERAAT_E | TIPIK + yalnızca merhamet isteyen esas savunma (T06_X) |
| OLGU_EK | BERAAT_E | Araç kaydı ilk celsede değil, ara evresinde ek talep dilekçesiyle (EK_GPS) |
| OLGU_B | NITELIK | Yüzleşme tuzağı (KY_SOR), savcıya asılların sunulması (SAV_ASIL), bilirkişiye kâğıt gösterilmez: gerçek fail savunması 223/2-b'ye ulaşamaz |
| W | NITELIK (çöküş) | G3 benzeri yol; ikinci celsede bilirkişiye art arda yanlış delil, ♥0; dönüş yok ilk celsede kayıtta |

## 10. Erken çözüm denetimi

Tipik yol yeniden döküldü (/tmp dökümü, 1.334 satır) ve ara evresine kadar olan bölüm tarandı. Kaldırılanlar: soğuk
açılışta “Fener bir süre olduğu yerde kaldı”; gün 1'deki “Vardiya şefinin HTS kayıtları” seçeneği (yerine olay yeri
tutanağını okumadan kamera kaydı isteme hatası); telefon tutanağındaki “Kptn kim?” kenar notu; vardiya ofisindeki
römorkör fotoğrafı (ARA_KENAN'a taşındı); Tarık'ın kamyonet cümlesi (ARA_TARIK, TR_GECE'ye taşındı); “Ya biliyorsa?”;
ilk celsede tanık odasındaki bez parçası telaşı; TL_YAKALA artık “teşhiste yanılan tanık hakkında suç duyurusu”
(yanlış ve nötr). Kalan tohumlar yalnızca kayda dayanır: aydınlatma etiketi, araç kapısı dökümü (23.21 çıkış, 23.49
giriş), rehber kısaltması “Kptn”. Kenan'ın fail olduğu hiçbir satırda söylenmez; abone kaydı yalnızca 23.41 aramasını
bulup talep eden oyuncuya ara evresinde gelir. Mahkeme seçeneklerinde doğru cevabın konumu ve uzunluğu değişkendir
(BR_01 3., H1_02 2., H1_02Q 1., H1_04 3., H1_07 2., ARA_SUC 3., ARA_SAVCI 1., T_04 2., T_05 1., T_06 2./5., T_07 2.).

## 11. Erken çözüm ölçümü

`/tmp/lg9/probe.mts` (tek süreç, bütçeli: golden path'ten hoşgörülü blok silme + her konumda `enumerateActions`
alternatifleriyle takas), 2026-10-21:

- **BERAAT_B:** G1'den 223 → **154 aksiyon (0,69 / tipik 217)**. Ara evresi zorunludur (abone/defter/araç kaydı, suç
  duyurusu), ayrıca bilirkişiye B1 + B2.
- **BERAAT_E:** TIPIK'ten 217 → **94 aksiyon (0,43)**, final 4.205. En kısa yol yine bütün olgu zincirini ister:
  ön otopsi (desen + karşı darbe yok → ded_darbe), Şükrü'den kantin saati + otopsiden mide (ded_saat), turnike
  dilekçesi ve dökümü + Gülay'ın hesap dökümü (ded_cikis), Nail + radyo (ded_buf); ilk celsede K1'e kayıt, ikinci
  celsede B1 ve B2'ye kâğıt. Atlanan her şey isteğe bağlı keşif, puan ve epilog dallarıdır.
- Önceki ölçüm (148/214, 142/214) skor eşiğinin (9.000) dolgusuyla elde ediliyordu; inceleme bu eşiği hukuka aykırı
  sonuçlar ürettiği için kaldırttı (tam olgularla mahkûmiyet / 87/4). Olgu kapıları sıkılaştırılarak denendi
  (dönüş yok = K1 ∧ K2 ∧ N2, ölüm sonra = B1 ∧ B2 ∧ B3): en fazla 106/217 (0,49). Bu kapılar B1 ∧ B2 kayıttayken
  87/4'e düşüren aynı hukuka aykırılığı yeniden doğurduğundan tutulmadı. **0,60 hedefi BERAAT_E için karşılanmıyor;**
  bilinçli bir ödünleşimdir ve raporlandı.
- Mahkemeye gün 1'de gitmek MAHKUMIYET verir (kayıtta dönüş yok olgusu yoktur); ara evresini atlamak 223/2-e'yi
  engellemez (olgular soruşturmada bulunabilir) ama 223/2-b'yi engeller.

## 12. Doğrulayıcı

Son koşu (`npm run case:validate -- liman-gecesi`, varsayılan bütçe, 2026-10-21, load ≈ 3): **PASSED — 0 hata,
1 uyarı** (SIMULATION_INCOMPLETE, uzun davada beklenen). Simülasyon ≈ 50.000 durum, ≈ 363.000 geçiş, 400 yürüyüş;
bütün sonuçlara ulaşıldı (ETIK, BERAAT_B, BERAAT_E, NITELIK, MAHKUMIYET); kapsam node 108/108, seçenek 201/201,
kural 72/72, delil 56/56; golden path 11/11; softlock / çıkmaz / sızıntı yok. Süre 42 sn. Önceki koşulardaki
SIMULATION_ABORTED ve vitest zaman aşımları makine yüküne (load ≈ 20) bağlıydı; sakin makinede tekrarlanmadı.
`npx vitest run --project content-tools --project case-schema --project engine --project validator --maxWorkers=2`:
37 dosya, 1.885 test geçti. `npm run lint` ve `npm run build` temiz.

## 13. Süre ve sözcük ölçümü

`npm run case:duration -- liman-gecesi` (2026-10-21):

```
  G1            103.3 dk   14577 sözcük   223 aksiyon  BERAAT_B (12945)
  TIPIK         102.4 dk   14524 sözcük   217 aksiyon  BERAAT_E (11950)
  G3             73.2 dk   10705 sözcük   137 aksiyon  NITELIK (4180)
  G4             67.2 dk    9659 sözcük   135 aksiyon  MAHKUMIYET (205)
  G5             72.9 dk   10623 sözcük   139 aksiyon  ETIK (8160)
  OLGU_D        101.4 dk   14347 sözcük   217 aksiyon  BERAAT_E (11630)
  OLGU_T        101.5 dk   14360 sözcük   217 aksiyon  BERAAT_E (11830)
  OLGU_X        101.3 dk   14320 sözcük   217 aksiyon  BERAAT_E (11660)
  OLGU_EK       101.3 dk   14345 sözcük   216 aksiyon  BERAAT_E (11890)
  OLGU_B         97.4 dk   13740 sözcük   211 aksiyon  NITELIK (10175)
  W              65.2 dk    9481 sözcük   125 aksiyon  NITELIK (2105)
  ==> TİPİK YOL (TIPIK): 102.4 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```

Paket (`node tools/content/word-count.mjs content/cases/liman-gecesi`): 1.497 satır, 18.354 satır sözcüğü; ekran
metinleriyle toplam **22.817** sözcük; en uzun satır 212 karakter. İkinci celse artık büfeci Nail'in press/present
tanıklığını (N1–N4), Kenan'ın K5–K8 karşılıklarını, eşin CMK 45/51 hatırlatmasıyla dinlenmesini ve kayıtlı saatlerle
genişleyen esas savunmayı içerir; ara evresine savcılık ziyareti (ARA_SAVCI) eklendi.
