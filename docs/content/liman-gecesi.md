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
| Tarık 23.18'de çıktı, 23.37'de büfede, 00.00'a kadar iskelede | INV_GULAY (GL_SAAT → GL_KART: ev_hesap) → INV_GORUSME (TP_DONUS: hangi büfe) → INV_BUFE (banka satırıyla clue_pos; NL_SAAT'ten sonra clue_radyo), INV_NAIL; INV_GORUSME (TP_GECE) → INV_DIL → INV_TURNIKE (INV_IFADE i3 ile karşılaştırma: clue_cikis) |
| B sahası projektörleri 23.00–02.00 bakımdaydı | INV_RIHTIM (ob_proj) + INV_KENAN (clue_kenan_isik) → ded_isik |
| Düşme değil, darbe | INV_ONRAPOR (o2 cetvel: desen; o3 dipnot: değerlendirme nihai rapora bırakılmış) → INV_LEYLA (LEYLA_RAPOR: Orhan Hoca'yı arar) → INV_ORHAN (OR_DERS) → **ARA_ATK** (n3 histopatoloji: clue_kontrkup) → ara tahtası ded_darbe |
| Ercan 23.34'te yedi, 23.41'de telefonda konuştu | INV_ORHAN (OR_MIDE) açar: INV_SUKRU SK_KANTIN ya da H1_03 S3 bastırma (clue_kantin; kürsü beyanı s3_kantin) · INV_DIL / TL_KANTIN (ev_kantin) · **ARA_ATK** (n4: clue_mide) → ara tahtası ded_saat; INV_TELEFON (t3) → ded_canli (B2'de kısmi) |
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
| ev_onrapor | Ön otopsi raporu | EVIDENCE | baştan | INV_ONRAPOR belgesi (desen; dipnot ve mide nihai rapora bırakılmış); S2 kısmi | ✓ |
| ev_telefon | Telefon inceleme tutanağı | EVIDENCE | baştan | INV_TELEFON belgesi | ✓ |
| ev_hesap | Hesap dökümü 23.37 | EVIDENCE | INV_GULAY (GL_KART) | K1 | ✓ |
| ev_turnike | Turnike ve araç kapısı dökümü | EVIDENCE | INV_DIL → gün sonu / duruşma gecesi | INV_TURNIKE belgesi; K1 | ✓ |
| ev_kantin | Kantin kaydı | EVIDENCE | INV_DIL / TL_KANTIN | B2 kısmi | ✓ |
| ev_atk | ATK nihai raporu | EVIDENCE | ARA_GIRIS (her zaman) | **ARA_ATK belgesi** (clue_kontrkup, clue_mide); B1 kısmi; ARA_TARIK şeması | ✓ |
| ev_gps | Araç takip ve zimmet | EVIDENCE | TL_GPS / EK_GPS | ARA_KAYIT belgesi; K5 | ✓ |
| ev_abone | BTK abone bilgisi | EVIDENCE | TL_ABONE / EK_ABONE | K6 | ✓ |
| ev_defter | Ercan'ın defteri | EVIDENCE | ARA_SEVIM | ARA_DEFTER belgesi | ✓ |
| clue_* | 37 ipucu | CLUE | sahne / belge / konuşma | tahtaya; clue_pil, clue_projektor, clue_servis_arac, clue_envanter sunulabilir | kısmen |
| ded_cikis | Tarık geri dönmedi | INSIGHT | cikis + pos | K1, N1 (tek kayıt — ev_turnike, ev_hesap, ded_buf — kısmi) | ✓ |
| ded_buf | Gece yarısına kadar iskelede | INSIGHT | nail + radyo | K1; donus_yok | ✓ |
| ded_isik | Projektörler sönüktü | INSIGHT | kenan_isik + projektor | K2 | ✓ |
| ded_kan | Yumruk başı vurdurmadı | INSIGHT | baba_kan + basit | S2 | ✓ |
| ded_darbe | Düşme değil, darbe | INSIGHT | desen + kontrkup (yalnız ara tahtası) | B1 | ✓ |
| ded_saat | Ölüm 23.34'ten sonra | INSIGHT | mide + kantin (yalnız ara tahtası) | B2 (son öğün saati kayıtta: ev_kantin ∨ s3_kantin; değilse kısmi) | ✓ |
| ded_canli | 23.41'de yaşıyordu | INSIGHT | arama2341 + cikis | B2 kısmi (hattın kullanıldığını gösterir, konuşanı değil) | ✓ |
| ded_tasima | Araçla gelen biri onu taşıdı | INSIGHT | surukleme + lastik (ya da kan_yolu + lastik) | anlatı / tahta | — (sunum kuralı yok; uyarı) |
| ded_silah | Emanetteki kilit yarayı açamaz | INSIGHT | koni + desen | B3 | ✓ |
| ded_arac | Kamyonet ölüm saatinde B sahasında | INSIGHT | gps + zimmet | K5 | ✓ |
| ded_motif | 23.41'deki konuşmanın sebebi | INSIGHT | defter_satir/manifesto + arama2341 | K6 | ✓ |
| ded_eksik | Kitten eksik eski tip kilit | INSIGHT | envanter + tarik_koni | K7 | ✓ |

Tahta: soruşturma tahtası (16 kart) 7 tarif (6 çıkarım, 1 alternatif); ara tahtası (15 kart) 7 tarif (6 çıkarım, 1 alternatif)
— toplam 14 tarif, 12 çıkarım. Tıbbi tarifler (darbe, saat) nihai rapor kartlarına bağlı olduğu için yalnızca ara tahtasındadır. Çeldirici kartlar: matara, kafes, pamuk, kan yolu (tek başına), mont, servis aracı (tek
başına); yanlış çift −50. Havuzlar simülasyon dallanmasını sınırlamak için yalnızca tarife giren kartlar ve birkaç çeldiriciyle tutuldu.

## 5. Çelişkiler

**Şükrü Balcı (1. celse, yeminli):** S1 “Tarık bağırdı” (bastır; clue_pil → contra_s1, kırılma “Bilmiyorum”) · S2 “kafası
babaya çarptı” (ded_kan → contra_s2; ev_onrapor kısmi) · S3 “söverek kantine yürüdü” (bastır → clue_kantin ve S4) ·
S4 “hırslıdır, döner” (itiraz g_kanaat).
**Kenan Aksoy (1. celse):** K1 “B sahasının ağzında gördüm” (yalnız ded_cikis → contra_k1; ev_turnike / ev_hesap / ded_buf tek başına kısmi: “kartını başkasına vermiştir”, büfecinin anlatımı kayıtta değil) ·
K2 “gündüz gibiydi” (ded_isik / clue_projektor → contra_k2) · K3 kanaat (itiraz) · K4 “sabaha kadar ofisteydim”
(clue_servis_arac kısmi). İkisi birden → “belki yanılmışımdır”.
**Doç. Dr. Karaca (2. celse; yalnız TL_ATK ya da EK_ATK ile dinlenir, yoksa rapor okunur ve T_02'ye geçilir):** B1 düşmeyle
oluşabilir (ded_darbe; ev_atk kısmi; telkin itirazı) · B2 23.00–01.00 (ded_saat + son öğün saati kayıtta; kayıtsız ded_saat,
ded_canli, ev_kantin, ev_telefon kısmi) · B3 dosyadaki kilit (ded_silah) · B4 (bastırınca) eski tip kilit.
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
  ded_cikis/ded_buf çıkarımları sunulmadıkça kayda geçmez. K1 ve N1 yalnızca ded_cikis ile (turnike çıkışı + büfenin
  gün sonu fişi; banka satırı aynı) çöker; tek bir kayıt kısmi isabettir.
- **olum_sonra:** contra_b1 ∧ contra_b2. Darbe şekli düşme mekanizmasını (ve yumruk → düşme → bilinç açıklığı sonrası
  gecikmiş ölüm ihtimalini) dışlar; saat ölümü sanığın ayrılışından sonraya koyar. contra_b3 (kilit ölçüsü) gerekçeye
  ve puana girer, tek başına bunların yerini tutmaz. Her ikisi de ikinci celsede, uzman dinlenirse kurulur; ikisinin
  kartları (karşı kutup, mide) ancak ara evresinde nihai raporla gelir. B2 ayrıca son öğün saatinin duruşma kaydında
  olmasını ister (kantin kaydı ya da Şükrü Usta'nın ilk celsedeki kürsü beyanı; CMK 217/1).
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
ARA_SEVIM_G, ARA_TARIK_G, ARA_TALEP (EK_ATK dahil), **ARA_ATK** (nihai rapor belgesi), ARA_SON_1…3, T_00G, T_01K, T_02K, T_03E (etik), T_03G, T_06S, T_COKUS. Soruşturma
hub'ı push/`$return`; ara hub'ı yığınsız (`retarget`). Motor sınırları: koşullu parçalar DECISION zincirleriyle;
tekrar eden ceza kuralları `maxUses: 3`; tahta tarifleri `IF ¬hasEvidence` ile yalnızca ilk kurulumda puanlı.

## 9. Golden path'ler

| Ad | Sonuç | Özet |
|---|---|---|
| G1 | BERAAT_B | Masumiyet; tam soruşturma; arada nihai rapor, kolluk amiri (K7) ve savcılığa suç duyurusu; esas savunma 223/2-b |
| TIPIK | BERAAT_E | İspat stratejisi; tam soruşturma; suç duyurusu yok; esas savunma 223/2-e |
| G3 | NITELIK | Terditli; ölüm saati ve darbe kanıtlanmaz; dönüş yok K1 ile; ek savunmada süre; terditli savunma |
| G4 | MAHKUMIYET | Dağınık soruşturma, telkin, inkâr, dayanaksız talepler, olası kastın kabulü |
| G5 | ETIK | İyi bir soruşturma; Gülay'a “on bir buçuk deyin” |
| OLGU_D | BERAAT_E | TIPIK + esas savunmada olası kastın kabulü (T06_D): olgular kayıttaysa beraat değişmez |
| OLGU_T | BERAAT_E | TIPIK + terditli esas savunma (T06_T) |
| OLGU_X | BERAAT_E | TIPIK + yalnızca merhamet isteyen esas savunma (T06_X) |
| OLGU_EK | BERAAT_E | Araç kaydı ilk celsede değil, ara evresinde ek talep dilekçesiyle (EK_GPS) |
| OLGU_KAYIT | NITELIK | TIPIK, ama kantin kaydı istenmez ve Şükrü'ye kürsüde son öğün sorulmaz: ded_saat elde olsa da 23.34 kayıtta değil, B2 kısmi kalır (CMK 217/1) |
| OLGU_B | NITELIK | Yüzleşme tuzağı (KY_SOR), savcıya asılların sunulması (SAV_ASIL), bilirkişiye kâğıt gösterilmez: gerçek fail savunması 223/2-b'ye ulaşamaz |
| W | NITELIK (çöküş) | G3 benzeri yol; ikinci celsede bilirkişiye art arda yanlış delil, ♥0; dönüş yok ilk celsede kayıtta |

## 10. Erken çözüm denetimi

Tipik yol yeniden döküldü (/tmp/lg10/tipik-dump.txt, 1.353 satır; üçüncü turda yeniden tarandı: yeni satırlar — Leyla'nın
Orhan Hoca'yı araması, dipnot, nihai rapor, büfe terminali, Şükrü'nün kürsüde son öğünü — Kenan'a işaret etmez) ve ara
evresine kadar olan bölüm tarandı. Kaldırılanlar: soğuk
açılışta “Fener bir süre olduğu yerde kaldı”; gün 1'deki “Vardiya şefinin HTS kayıtları” seçeneği (yerine olay yeri
tutanağını okumadan kamera kaydı isteme hatası); telefon tutanağındaki “Kptn kim?” kenar notu; vardiya ofisindeki
römorkör fotoğrafı (ARA_KENAN'a taşındı); Tarık'ın kamyonet cümlesi (ARA_TARIK, TR_GECE'ye taşındı); “Ya biliyorsa?”;
ilk celsede tanık odasındaki bez parçası telaşı; TL_YAKALA artık “teşhiste yanılan tanık hakkında suç duyurusu”
(yanlış ve nötr). Kalan tohumlar yalnızca kayda dayanır: aydınlatma etiketi, araç kapısı dökümü (23.21 çıkış, 23.49
giriş), rehber kısaltması “Kptn”. Kenan'ın fail olduğu hiçbir satırda söylenmez; abone kaydı yalnızca 23.41 aramasını
bulup talep eden oyuncuya ara evresinde gelir. Mahkeme seçeneklerinde doğru cevabın konumu ve uzunluğu değişkendir
(BR_01 3., H1_02 2., H1_02Q 1., H1_04 3., H1_07 2., ARA_SUC 3., ARA_SAVCI 1., T_04 2., T_05 1., T_06 2./5., T_07 2.).

## 11. Olgu kapıları ve erken çözüm ölçümü

Skor eşiği yoktur; beraat olgulara bağlıdır. Erken çözümü kapatmak için olguların **kartları** birbirine bağlandı
(2026-10-21, üçüncü tur):

| Kapı | Ne ister | Gerekçe |
|---|---|---|
| Büfe (H_BUFE) | `fact_donus` (Tarık'ın TP_DONUS anlatımı) | Banka satırındaki terminal adı (“MDN ISKELE GIDA”) hiçbir tabelaya uymaz; hangi büfe olduğunu o gece orada oturan söyler. |
| TP_DONUS → GL_KART → GL_SAAT | ev_hesap; GL_KART yalnızca “kaçta geldi” sorusundan sonra | Bir saatlik boşluk önce eşin ağzından duyulur. |
| Gün sonu fişi (ob_zrapor) | ev_hesap | Kırk yıllık fiş yığınında satırı saat ve tutar bulur. |
| Yayın akışı (ob_akis) | NL_SAAT | Akış, Nail Usta çocuğun ne zaman kalktığını anlatınca anlam kazanır. |
| Turnike dilekçesi (DIL_TURNIKE) | `fact_gece` (TP_GECE: “kartımı bastım, çıktım”) | Hangi kapı, hangi saatler: müvekkilin anlatımı. |
| Turnike karşılaştırması (EX_G2) | `fact_ifade_tarik` (INV_IFADE i3) | “Karşılaştır” aleti bir beyana karşı okunur: “on bir buçuk gibi” ↔ 23.18.42. |
| Orhan Hoca (H_ORHAN) | `orhan_ref` (INV_LEYLA → LEYLA_RAPOR; desen ya da dipnot gerekir) | Kapıyı Leyla açar (Orhan'ın açılış satırı: “Leyla aradı”). |
| Karşı kutup (ARA_ATK n3) | `fact_coup` + `fact_dipnot` | Ön rapor değerlendirmeyi histopatolojiye bırakır; satırı okumayı uzman öğretir (uzman okuması). |
| Mide (ARA_ATK n4) | `fact_mide` | Nihai rapor mideyi yazar, yorumlamaz. |
| Kantin (SK_KANTIN; H1 PR_S3) | `fact_mide` | Son öğünün neden önemli olduğunu bilen müdafi sorar; kürsü beyanı `s3_kantin` olarak kayda geçer. |
| ded_darbe, ded_saat | yalnız ara tahtası | Kartların biri ön rapordan/tanıktan, öbürü nihai rapordan: farklı gün ve yerlerden. |
| B2 (PS_B2) | ded_saat ∧ (ev_kantin ∨ s3_kantin) | CMK 217/1: son öğünün saati duruşmaya getirilmiş olmalı; değilse kısmi (PS_B2_KAYITSIZ). |
| B2, ded_canli | kısmi | Tutanak hattın kullanıldığını gösterir; konuşanı göstermez. |
| K1, N1 | yalnız ded_cikis | Tek kayıt teşhisi çürütmez (“kartını başkasına vermiştir”; 23.37 ödemenin saatidir, gelişin değil). |
| Uzman (T_01) | TL_ATK ∨ EK_ATK | İstenmezse rapor okunur (CMK 214/1; dinleme CMK 68/1); “oluşabilir” sorgulanmaz. |
| GO_H1 | gün 4 | Ara evresindeki GO_T2 kuralıyla aynı: duruşma günü bellidir. |

Böylece ara evresi beraatin iki olgusunun kartlarını (karşı kutup, mide) üretir, ikinci celse iki zorunlu çelişkiyi (B1,
B2) verir; birinci celse K1'i (ya da ikinci celse N1+N2'yi) ancak üç ayrı yerden toplanmış kayıtla kurar.

**Ölçüm** (`/tmp/lg10/probe.mts`: tek süreç, iş başına ~45 sn blok silme + ~60 sn `enumerateActions` takası ve kısa
silme; golden path'ten ya da elle kurulmuş tohumdan başlar; 2026-10-21, load ≈ 3). Tipik yol 222 aksiyon.

| Sonuç | Başlangıç | En kısa bulunan | Tipik yola oranı | Süre (case:duration formülü) |
|---|---|---|---|---|
| BERAAT_E | TIPIK ve K1 tohumu | **102** (önce 94) | **0,46** (önce 0,43) | 64,5 dk |
| BERAAT_B | G1 | **171** | 0,77 | 86,5 dk |
| NITELIK | G3 | **87** | 0,39 | 57,2 dk |
| ETIK | G5 | **69** | 0,31 | 48,2 dk |
| MAHKUMIYET (varsayılan) | G4 | 68 | 0,31 | 47,9 dk |

BERAAT_E'nin en kısa yolu artık şunları ister: ön rapor (desen + dipnot), Leyla'ya rapor ve Orhan Hoca'nın iki dersi,
kolluk ifadesi (i3), Gülay (saat → döküm), Tarık (o gece + eve dönüş), turnike dilekçesi ve karşılaştırma, büfe (Nail, fiş),
tahtada çıkış; ilk celsede S3'te son öğün sorusu ve K1; TL_ATK; arada nihai rapor (iki satır) ve ara tahtasında darbe +
saat; ikinci celsede B1 ve B2. Atlananlar: rıhtım ve B sahası aramaları, Kenan görüşmesi, telefon tutanağı, 2-b zinciri
(abone, araç, defter, emanet, suç duyurusu), tanık çelişkilerinin kayıt dışı kalanları, epilog dalları. Bunların hiçbiri
223/2-e için hukuken gerekli değildir: kayıtla çöken teşhis + darbe şekli + ölüm saati beraati zorunlu kılar (CMK 223/2-e,
şüpheden sanık yararlanır); bunları zorunlu kılmak ya puan dolgusu (yasak) ya da beraat gerektiren kayıtla mahkûmiyet
(hukuka aykırı) olurdu. **0,60 hedefi BERAAT_E, NITELIK ve ETIK için karşılanmıyor;** kalan açık rapora yazıldı.
ETIK bir çöküş sonucudur (Gülay'a yalan öğütleyip ikinci celseye gitmek yeter); NITELIK yalnızca dönüş yok zincirini ister.

## 12. Doğrulayıcı

Son koşu (`npm run case:validate -- liman-gecesi`, varsayılan bütçe, 2026-10-21, load ≈ 3): **PASSED — 0 hata,
1 uyarı** (SIMULATION_INCOMPLETE, uzun davada beklenen). Simülasyon ≈ 90.500 durum, ≈ 409.000 geçiş, 400 yürüyüş;
bütün sonuçlara ulaşıldı (ETIK, BERAAT_B, BERAAT_E, NITELIK, MAHKUMIYET); kapsam node 109/109, seçenek 206/206,
kural 82/82, delil 56/56; golden path 12/12; softlock / çıkmaz / sızıntı yok. Süre 56 sn.
`npx vitest run --project content-tools --project case-schema --project engine --project validator --maxWorkers=2`:
37 dosya, 1.885 test geçti. `npm run lint` ve `npm run build` temiz.

## 13. Süre ve sözcük ölçümü

`npm run case:duration -- liman-gecesi` (2026-10-21):

```
  G1            104.5 dk   14788 sözcük   223 aksiyon  BERAAT_B (12425)
  TIPIK         104.2 dk   14756 sözcük   222 aksiyon  BERAAT_E (12110)
  G3             76.3 dk   11052 sözcük   149 aksiyon  NITELIK (4765)
  G4             66.7 dk    9562 sözcük   136 aksiyon  MAHKUMIYET (145)
  G5             69.9 dk   10146 sözcük   135 aksiyon  ETIK (6485)
  OLGU_D        103.2 dk   14579 sözcük   222 aksiyon  BERAAT_E (11790)
  OLGU_T        103.3 dk   14592 sözcük   222 aksiyon  BERAAT_E (11990)
  OLGU_X        103.0 dk   14552 sözcük   222 aksiyon  BERAAT_E (11820)
  OLGU_EK       101.8 dk   14398 sözcük   218 aksiyon  BERAAT_E (11955)
  OLGU_KAYIT    101.1 dk   14255 sözcük   219 aksiyon  NITELIK (11295)
  OLGU_B         98.7 dk   13979 sözcük   210 aksiyon  NITELIK (9475)
  W              68.4 dk    9842 sözcük   137 aksiyon  NITELIK (2790)
  ==> TİPİK YOL (TIPIK): 104.2 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```

Paket (`node tools/content/word-count.mjs content/cases/liman-gecesi`): 1.531 satır, 18.899 satır sözcüğü; ekran
metinleriyle toplam **23.646** sözcük; en uzun satır 212 karakter. İkinci celse artık büfeci Nail'in press/present
tanıklığını (N1–N4), Kenan'ın K5–K8 karşılıklarını, eşin CMK 45/51 hatırlatmasıyla dinlenmesini ve kayıtlı saatlerle
genişleyen esas savunmayı içerir; ara evresine savcılık ziyareti (ARA_SAVCI) eklendi.
