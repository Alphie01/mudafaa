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
| B sahası projektörleri 23.00–02.00 bakımdaydı | INV_RIHTIM (ob_proj: clue_projektor) — ilk celsede K2'yi tek başına çürütür; INV_KENAN (KN_GECE → KN_ISIK: clue_kenan_isik) + ob_proj → ded_isik |
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
| ded_isik | Projektörler sönüktü | INSIGHT | kenan_isik + projektor | K2 (clue_projektor de yeter; önce BASTIR) | ✓ |
| ded_kan | Yumruk başı vurdurmadı | INSIGHT | baba_kan + basit | S2; **B1'in ikinci ayağı** | ✓ |
| ded_darbe | Düşme değil, darbe | INSIGHT | desen + kontrkup (yalnız ara tahtası) | **B1'in birinci ayağı** | ✓ |
| ded_saat | Ölüm 23.34'ten sonra | INSIGHT | mide + kantin (yalnız ara tahtası) | B2 (son öğün saati kayıtta: ev_kantin ∨ s3_kantin; değilse kısmi) | ✓ |
| ded_canli | 23.41'de yaşıyordu | INSIGHT | arama2341 + cikis | B2 kısmi (hattın kullanıldığını gösterir, konuşanı değil) | ✓ |
| ded_tasima | Araçla gelen biri onu taşıdı | INSIGHT | surukleme + lastik (ya da kan_yolu + lastik) | **B5** (bilinç açıklığı tezine karşı; önce BASTIR) | ✓ |
| ded_silah | Emanetteki kilit yarayı açamaz | INSIGHT | koni + desen | B3 | ✓ |
| ded_arac | Kamyonet ölüm saatinde B sahasında | INSIGHT | gps + zimmet | K5 | ✓ |
| ded_motif | 23.41'deki konuşmanın sebebi | INSIGHT | defter_satir/manifesto + arama2341 | K6 | ✓ |
| ded_eksik | Kitten eksik eski tip kilit | INSIGHT | envanter + tarik_koni | K7 | ✓ |

Tahta: soruşturma tahtası (16 kart) 7 tarif (6 çıkarım, 1 alternatif); ara tahtası (15 kart) 7 tarif (6 çıkarım, 1 alternatif)
— toplam 14 tarif, 12 çıkarım. Tıbbi tarifler (darbe, saat) nihai rapor kartlarına bağlı olduğu için yalnızca ara tahtasındadır. Çeldirici kartlar: matara, kafes, pamuk, kan yolu (tek başına), mont, servis aracı (tek
başına); yanlış çift −50. Havuzlar simülasyon dallanmasını sınırlamak için yalnızca tarife giren kartlar ve birkaç çeldiriciyle tutuldu.

## 5. Çelişkiler

Kilit çelişkilerde oyunun kendi kuralı uygulanır: **önce BASTIR, sonra sun** (tanığın ya da bilirkişinin iddiasını kendi
ağzıyla kesinleştir, sonra kâğıdı göster). Basılmadan yapılan sunum cezasızdır ama sonuç vermez (PS_*_ERKEN: tanık kâğıdın
etrafından dolaşır). Kurulmuş bir çelişkiye aynı delilin yeniden sunulması da cezasız, puansızdır (PS_*_TEKRAR).

**Şükrü Balcı (1. celse, yeminli):** S1 “Tarık bağırdı” (bastır; clue_pil → contra_s1) · S2 “kafası babaya çarptı”
(ded_kan → contra_s2; ev_onrapor kısmi) · S3 “söverek kantine yürüdü” (bastır → clue_kantin, `s3_kantin` ve S4) · S4
“hırslıdır, döner” (itiraz g_kanaat).
**Kenan Aksoy (1. celse) — teşhis iki ayaklıdır:** K1 “on ikiye yirmi var, B sahasının ağzında gördüm” (BASTIR → 23.40
kesinleşir; ded_cikis → contra_k1. K2 henüz kurulmadıysa tanık saatini esnetir: “belki daha geçti; ama yüzünü gördüm”;
ev_turnike / ev_hesap / ded_buf tek başına kısmi) · K2 “projektörler yanıyordu, gündüz gibiydi” (BASTIR; clue_projektor
ya da ded_isik → contra_k2. K1 henüz kurulmadıysa tanık yürüyüşe ve saate tutunur) · K3 kanaat (itiraz) · K4 “sabaha kadar
ofisteydim” (clue_servis_arac kısmi). İkisi birden → “belki yanılmışımdır” (H1_05K) ve tahliye (H107_A).
**Doç. Dr. Karaca (2. celse; yalnız TL_ATK ya da EK_ATK ile dinlenir, yoksa rapor okunur):** B1 “düşmeyle de oluşabilir”
— **iki ayak**: ded_darbe (karşı darbe yok) ve ded_kan (babada çarpma izi yok); biri tek başına kısmi (bilirkişi “babanın
köşesine çarpmış olabilir” ya da “betona düşmüş olabilir” der), ikisi birlikte → düşmeyi dışlar; ev_atk kısmi; telkin
itirazı · B2 23.00–01.00 (BASTIR → “son öğün bilinmediği için yorumlanmadı”; ded_saat + son öğün kayıtta → contra_b2;
kayıtsız ded_saat, ded_canli, ev_kantin, ev_telefon kısmi) · B3 dosyadaki kilit (ded_silah) · B4 (B3 bastırınca) eski tip
kilit · **B5** (B1 bastırınca; savcının yedeği) “yaralı bir süre yürümüş, sonra yığılmış olabilir” (BASTIR → “açık kırık
bol kanar, iz bırakır”; ded_tasima → contra_b5; ded_canli tuzak: konuşabilen biri bilinçlidir, tezi destekler).
**Büfeci Nail Kocaman (2. celse):** N1 “on bire doğru” (BASTIR → kartla ödeme; ded_cikis → contra_n1; ev_hesap kısmi) ·
N2 “on ikiye çeyrek kala kalkmış olabilir” (BASTIR → radyo; ded_buf → contra_n2; telkin itirazı) · N3, N4 bastır.
**Kenan Aksoy (2. celse, CMK 48):** K5 kamyonet (ded_arac / ev_gps) · K6 arama (ev_abone / ded_motif) · K7 kit (ded_eksik /
clue_envanter) · K8 kanaat (itiraz). Her çelişkide tanık cevap vermemeyi seçer.

Diğer kararlar: H1_02 sanığa tavsiye, H1_02Q masumiyet karinesi itirazı, H1_04 twistlock, H1_06 üç ara karar talebi, H1_07
tutukluluk, T_03 telkin edici soru, T_04 ek savunma, T_05 mütalaaya cevap, T_06 esas savunma (5 seçenek), T_07 son söz.

## 6. Sonuçlar

Karar yalnızca duruşma kaydındaki olgulara bağlıdır (CMK 217/1; heyet esas savunmanın adıyla bağlı değildir, CMK 225).
**Hiçbir sonuç skor ya da ikna eşiğine bakmaz** (dördüncü tur, 2026-10-21: BERAAT_B'deki `final ≥ 10.000` ve `ikna ≥ 8`
kaldırıldı). Esas savunmanın seçimi puanı, iknayı, kapanış metnini ve epilog tonunu değiştirir; hükmü değil.

| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | ETIK | OTHER | `etik_gulay` (Gülay'a yalan saat öğütlendi; ikinci celsede ortaya çıkar) | Azil; Başsavcılık ve Baro bildirimi | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | ¬çöküş ∧ `gercek_fail` ∧ donus_yok ∧ olum_sonra | Beraat + yumruk için 223/8 düşme | 1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | donus_yok ∧ olum_sonra | Beraat + 223/8 düşme | 1,0 |
| 4 | NITELIK | RECHARACTERIZED | donus_yok ∧ ¬olum_sonra | 87/4 + 29 + 62/1: 6 yıl 3 ay | 0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan (= ¬donus_yok) | 81/1 + 21/2 + 62/1: 16 yıl 8 ay | 0,6 (çöküş 0,3) |

- **donus_yok** = (contra_k1 ∨ contra_n1) ∧ (contra_k2 ∨ contra_n2). Teşhisin iki ayağı: **saat** (tanığın kesinleştirdiği
  23.40'ı turnike + büfe fişi/banka kaydı çürütür: ilk celsede K1 ya da ikinci celsede büfecinin ağzından N1) ve **teşhisin
  kendisi** (ışık yoktu: K2; ya da sanık gece yarısına kadar iskeledeydi: N2). Yalnız saat çürürse tanık saatini esnetip yüze
  tutunur; yalnız ışık düşerse yürüyüşe ve saate tutunur (MAHKUMIYET gerekçesi bu iki durumu ayrı satırla yazar).
- **olum_sonra** = contra_b1 ∧ contra_b2 ∧ contra_b5. Savcılığın 87/4 yedek tezi üç adımdır: yumruk → babaya düşme → birkaç
  adım → ölüm. B1 (karşı darbe yok + babada iz yok) düşmeyi, B2 (son öğün kayıtta) zamanı, B5 (yolda kan yok, sürüklenme ve
  araç izi) yürüyüşü/bilinç açıklığını kapatır. B3 (kilit ölçüsü) gerekçeye girer.
- **gercek_fail** (T06_B ile): suç duyurusu ∧ contra_k5 ∧ (contra_k6 ∨ contra_k7) ∧ donus_yok ∧ olum_sonra.
- **supheli** (T06_E/T ile): donus_yok ∧ olum_sonra; yalnızca kapanış metnini seçer.
- 87/4 gerekçesi kısmi bilirkişi bulgusuna göre dört ayrı satırla yazılır (B1 ve B2 yok; yalnız B2; yalnız B1; B1 + B2 ama B5
  yok); kayıttaki bir olguyla çelişen gerekçe satırı yoktur.
- **Çöküş** (♥ 0): ikinci celsede tanık sorgusu kesilir; ek savunma hatırlatması, mütalaa, kısa esas savunma ve son söz aynı
  düğümde alınır (T_COKUS; CMK 216, 226), sonra hüküm. İlk celsede ♥ biterse heyet o tanığın sorgusunu keser ve celse
  talepler/tutuklulukla sürer (H1_COKUS, `cokus1`, ♥ 2'ye döner).
- Etik sayaç: SK_TELKIN, SUC_C, KY_SOR (+1), GL_YALAN (+2), T_03E (+1). XP etikte yarıya iner; ETIK'te 0.


## 7. Skor

- Kategoriler ve döküm satırları: Delil toplama (ARAŞTIRMA + DELİL ANALİZİ) · Çapraz sorgu (SORGULAMA) · İtiraz isabeti
  (USUL + HUKUKİ, `legal_hits`) · Savunma · Hatalı delil (`wrong`). Güvenilirlik bonusu ♥ × 100.
- Strateji çarpanı yalnızca uyumlu esas savunmada (MASUMIYET ×1,5 → T06_B; USUL ×1,2 → T06_E; INDIRIM ×0,8 → T06_T).
- Eşik çubuğu tek bant: “Savunma puanı · karar olgulara bağlı” (0). Hiçbir sonuç skor eşiğine bakmaz.
- Tutarlar: olay yeri +20…+60, çeldirici/ıska −10; belge +60…+150, yanlış alet −20; tarif +300, yanlış çift −50;
  BASTIR +25; doğru sunum +300, kısmi +100; yanlış sunum −150 ♥−1; usul +40…+150, dayanaksız −40…−80 ♥−1; esas savunma
  150–375 (çarpanlı), başarısız −100; etik ihlaller −60…−150.

## 8. Node grafiği

Bkz. hikâye kitabı §4. Uygulamadaki ek node'lar: INV_GORUSME_G, INV_BUFE_G, INV_GULAY_G, INV_IFADE (0 EP belge),
INV_GECE_1…6 + 3B (koşullu hafıza zinciri), H1_00G, H1_02Q/H102Q_SON, H1_04B (kısa ara), H1_05K, ARA_GIRIS_1/2,
ARA_SEVIM_G, ARA_TARIK_G, ARA_TALEP (EK_ATK dahil), **ARA_ATK** (nihai rapor belgesi), ARA_SON_1…3, T_00G, T_01K, T_02K, T_03E (etik), T_03G, T_06S, T_COKUS + T_COKUS_K (çöküş: kısa ek savunma, mütalaa, esas savunma, son söz; etikte T_03E), H1_COKUS (ilk celsede ♥ 0: tanık sorgusu kesilir, celse sürer). INV_KENAN'da ışık sorusu ayrı konu (KN_GECE → KN_ISIK). GO_H1 ve GO_T2, son günün eylem puanları kullanılınca (ya da EP harcanacak yer kalmadıysa) görünür. Soruşturma
hub'ı push/`$return`; ara hub'ı yığınsız (`retarget`). Motor sınırları: koşullu parçalar DECISION zincirleriyle;
tekrar eden ceza kuralları `maxUses: 3`; tahta tarifleri `IF ¬hasEvidence` ile yalnızca ilk kurulumda puanlı.

## 9. Golden path'ler

| Ad | Sonuç | Özet |
|---|---|---|
| G1 | BERAAT_B | Masumiyet; tam soruşturma; arada nihai rapor, kolluk amiri (K7) ve savcılığa suç duyurusu; esas savunma 223/2-b |
| G1_AZ | BERAAT_B | **Düşük skor (8.625, eski 10.000 eşiğinin altında)**: kısaltma sondasının bulduğu en kısa 223/2-b yolu; gerçek fail olgusu kayıtta olduğundan hüküm 223/2-b (skor hükmü seçmez) |
| TIPIK | BERAAT_E | İspat stratejisi; tam soruşturma; suç duyurusu yok; esas savunma 223/2-e |
| G3 | NITELIK | Terditli; ölüm saati ve darbe kanıtlanmaz; teşhis K1 + K2 ile; ek savunmada süre; terditli savunma |
| G4 | MAHKUMIYET | Dağınık soruşturma, telkin, inkâr, dayanaksız talepler, olası kastın kabulü |
| G5 | ETIK | İyi bir soruşturma; Gülay'a “on bir buçuk deyin”; yalan ikinci celsede ortaya çıkar |
| OLGU_D | BERAAT_E | TIPIK + esas savunmada olası kastın kabulü (T06_D): olgular kayıttaysa beraat değişmez |
| OLGU_T | BERAAT_E | TIPIK + terditli esas savunma (T06_T); **ters sıra**: önce K2 sonra K1, bilirkişide önce kan sonra darbe (PS_K1, PS_B1 kapsamı) |
| OLGU_X | BERAAT_E | TIPIK + yalnızca merhamet isteyen esas savunma (T06_X) |
| OLGU_EK | BERAAT_E | Araç kaydı ilk celsede değil, ara evresinde ek talep dilekçesiyle (EK_GPS) |
| OLGU_KAYIT | NITELIK | TIPIK, ama kantin kaydı istenmez ve Şükrü'ye kürsüde son öğün sorulmaz: B2 kısmi kalır (CMK 217/1) |
| OLGU_B | NITELIK | Yüzleşme tuzağı (KY_SOR), savcıya asılların sunulması (SAV_ASIL), bilirkişiye kâğıt gösterilmez: 223/2-b'ye ulaşamaz |
| W | NITELIK (çöküş) | G3 benzeri yol; ikinci celsede bilirkişiye art arda yanlış delil, ♥ 0; teşhis ilk celsede çürütülmüş |

## 10. Erken çözüm denetimi (sızıntı)

Tipik yol dördüncü turda yeniden döküldü (`/tmp/lg10b/tipik.txt`, 1.519 satır; ara evresine kadar 919 satır) ve
“kenan, kamyonet, kptn, kaptan, araç, servis, babacan, bez parçası” için tarandı. Yeni satırlar — Kenan'ın ışık konusu
(KN_ISIK: direk, yirmi metre, yürüyüş), kürsüde saatini esnetmesi (“saat yanılır, göz yanılmaz”), Leyla'nın iki ayaklı
teşhis dersi, B sahası girişindeki “bol kan, yalnız burada” notu, Dr. Beyaz'ın baba ve kan yolu notu, ilk celse sonrası
Leyla telefonu — teşhisin güvenilirliği ve ölüm biçimi hakkındadır; Kenan'ın fail olduğunu söylemez ya da ima etmez.
İnceleme bulgusu üzerine Leyla'nın INV_GECE'deki “vardiya şefine dikkat et… iyi adamlar en tehlikeli tanıklardır”
satırı “emin tanık, dürüst tanıktan tehlikelidir; çünkü yanılsa da emin konuşur” olarak genelleştirildi; gün 4'teki
“biri dürüst ve yanılan, biri babacan ve kesin” satırı da “yanılabileceğini bilen / hiç düşünmeyen” diye nötrleştirildi.
B5'teki “maktulü oraya biri götürmüştür” ikinci celsede, ara evresinden sonradır ve bir isim içermez. Kalan tohumlar
yalnızca kayda dayanır: aydınlatma etiketi, araç kapısı dökümü (23.21 çıkış, 23.49 giriş), rehber kısaltması “Kptn”.
Önceki turların kaldırdıkları (soğuk açılıştaki fener, HTS seçeneği, “Kptn kim?”, römorkör fotoğrafı, Tarık'ın kamyonet
cümlesi, “Ya biliyorsa?”, bez parçası telaşı) geri gelmedi. Mahkeme seçeneklerinde doğru cevabın konumu ve uzunluğu
değişkendir (BR_01 3., H1_02 2., H1_02Q 1., H1_04 3., H1_07 2., ARA_SUC 3., ARA_SAVCI 1., T_04 2., T_05 1., T_06 2./5., T_07 2.).
Ayrıca bir içerik hatası düzeltildi: Kenan'ın turu “on bire yirmi var” (22.40) yazıyordu; kolluk ifadesi ve bütün
gerekçeler 23.40 der → “on ikiye yirmi var”.

## 11. Olgu kapıları ve erken çözüm ölçümü (dördüncü tur, 2026-10-21)

Hiçbir sonuç skor eşiğine bakmaz. Erken çözüm, **olguların kendisini** daha fazla soruşturmaya bağlayarak kapatıldı;
her yeni şart hukuken gerekli bir ayaktır (gerekçe: `docs/legal/liman-gecesi.md` §4/17–22):

| Kapı | Ne ister | Gerekçe |
|---|---|---|
| Teşhis (donus_yok) | saat (K1 ya da N1) **ve** teşhisin kendisi (K2 ya da N2) | Saati çürütülen tanık saatini esnetir; ışığı çürütülen tanık yürüyüşe ve saate tutunur. Eski kural (yalnız K1 ya da N1 + N2) K2'yi ve ışık delilini atlatıyordu. |
| K2 | rıhtım fotoğrafındaki bakım etiketi (ob_proj) ya da ded_isik (KN_GECE → KN_ISIK + etiket) | Tanığın “gündüz gibiydi” iddiasının karşısındaki kayıt. |
| B1 | ded_darbe (desen + kontrkup: ön rapor + Leyla + Orhan + **ara**: nihai rapor) **ve** ded_kan (rıhtım fotoğrafı 9 + ön rapor o1) | Karşı darbe yokluğu “babanın köşesine kısa mesafeden çarpma”yı dışlamaz; babada iz olmaması dışlar. |
| B5 (yeni) | ded_tasima (B sahası: sürüklenme + çift lastik, ya da yolda kan yok + lastik) | Savcının yedek tezi bir bilinç açıklığı ister; açık kırık kanar, rıhtımdan B sahasına kan yok: yaralı yürümedi. |
| B2 | ded_saat (mide: **ara** + kantin) ∧ son öğün kayıtta (S3 ya da kantin kaydı) | CMK 217/1 (üçüncü turdan). |
| Kilit çelişkiler | önce BASTIR (K1, K2, B2, B5, N1, N2) | Oyunun kendi kuralı (“önce bastır, sonra sun”); tanığı kesinleştirmeden kâğıt sonuç vermez, cezası da yoktur. |
| Celseye gidiş | son günün EP'si kullanılınca (yer kalmadıysa hemen) | Duruşma günü bellidir; gün 4 ve ara gün 3 “son gün” olarak oynanır (yumuşak kilit önlemiyle). |
| Önceki turdan | büfe (fact_donus), Orhan (orhan_ref), turnike dilekçesi (fact_gece), karşılaştırma (fact_ifade_tarik), karşı kutup (fact_coup + fact_dipnot), mide (fact_mide), kantin, uzman (TL_ATK/EK_ATK) | Değişmedi. |

Ara evresi beraatin iki tıbbi kartını (karşı kutup, mide) üretir; ikinci celse dört zorunlu çelişkiyi verir (B1 iki
ayaklı, B2, B5, ayrıca teşhis N yoluyla kurulacaksa N1/N2); birinci celse teşhisi iki ayağından çürütür.

**Ölçüm.** `/tmp/lg10b/shrink4.mts`: tek süreç, sınırlı (sonuç başına 120–200 sn); `enumerateActions` üzerinden blok
silme + “k aksiyonu tek aksiyonla değiştir” takası; golden path'ten ya da elle kurulmuş tohumdan başlar. Ek olarak
`edit.mts` ile hub ziyaretleri elle en ucuz alternatife çevrildi (K yolu tohumu). Tipik yol **226** aksiyon. Load ≈ 4–5.

| Sonuç | Başlangıç | En kısa bulunan | Tipik yola oranı | Süre (case:duration formülü) | Önceki tur |
|---|---|---|---|---|---|
| BERAAT_E | TIPIK (134), elle K yolu tohumu | **127** | **0,56** | 75,2 dk | 102–108 (0,46–0,49), 64,5–65,8 dk |
| BERAAT_B | G1, G1_AZ | **148** | 0,65 | 80,6 dk | 171 (eşikle) |
| NITELIK | W (çöküş), G3, OLGU_KAYIT | **104** | 0,46 | **61,2 dk** (G3'ten 105 / 64,7 dk) | 86 / 53,4 dk |
| ETIK | G5 | 77 | 0,34 | 51,7 dk | 69–71 / 48–49 dk |
| MAHKUMIYET (varsayılan) | G4 | 72 | 0,32 | 49,6 dk | 68 / 47,9 dk |

BERAAT_E'nin en kısa yolu artık şunların hepsini ister: Gülay (saat → döküm), Tarık (o gece + eve dönüş), kolluk ifadesi
(i3), turnike dilekçesi ve karşılaştırma, büfe (Nail, gün sonu fişi), rıhtım (baba + projektör etiketi), B sahası
(sürüklenme + lastik), ön rapor (o1, o2, o3), Leyla'ya rapor, Orhan'ın iki dersi, soruşturma tahtasında üç tarif
(kan, çıkış, taşıma); ilk celsede S3'te son öğün, H1_04, K1 ve K2 (ikisi de önce bastırılarak), TL_ATK; arada nihai rapor
(iki satır) ve ara tahtasında darbe + saat; ikinci celsede B1 (iki ayak), B5, B2 (üçü de bastırılarak). Atlananlar
yalnızca 223/2-e için hukuken gerekmeyenlerdir: Kenan görüşmesi (K2'yi etiket tek başına kurar), telefon tutanağı,
Sevim ve defter, araç/abone/kit zinciri, Şükrü'nün S1/S2'si, kilit ölçüsü, epilog dalları.

**0,60 hedefi BERAAT_E (0,56) ve NITELIK (0,46) için karşılanmıyor; bilinçli olarak bırakıldı.** Kalan her aday şart
(ör. Kenan görüşmesini, telefonu ya da kilit ölçüsünü beraat için zorunlu kılmak; K2 ile N2'yi birlikte istemek)
hukuken gerekli değildir ve onu kaçıran bir kayıtta mahkûmiyet ya da 87/4 vermek CMK 217/1 ve 223/2-e'ye aykırı
olurdu (bağlayıcı şart 1). İncelemenin “~25–30 zorunlu aksiyon” tahmini, soruşturmada 12 ve arada 6 EP'nin zaten
harcanmak zorunda olduğunu (Kenan ve B sahası ziyaretlerinin en kısa yolda boş dolgu olarak zaten bulunduğunu) hesaba
katmıyordu; yeni ayaklar ziyaret değil ziyaret içi aksiyon ekler. NITELIK = donus_yok ∧ ¬olum_sonra olduğundan en kısa
yolu teşhis zinciridir; ona ayrıca bilirkişi ya da kilit şartı koymak, teşhisi çürütülmüş bir sanığı 81/1'den mahkûm
etmek demek olurdu. NITELIK'in 60 dk tabanı ise sağlandı (61,2 dk).
**ETIK ve MAHKUMIYET 60 dk / 0,60 tabanından muaf tutuldu** (başarısızlık sonları: biri etik çöküş, biri varsayılan
kayıp; ikisi de bir “çözüm” değildir, kısayol oyuncuya bir şey kazandırmaz). Golden path'leri G5 75,0 dk ve G4 68,8 dk.

## 12. Doğrulayıcı

Son koşu (`npm run case:validate -- liman-gecesi`, varsayılan bütçe, 2026-10-21, load ≈ 4,7): **PASSED — 0 hata,
1 uyarı** (SIMULATION_INCOMPLETE, uzun davada beklenen). Simülasyon ≈ 116.000 durum, ≈ 453.000 geçiş, 400 yürüyüş;
bütün sonuçlara ulaşıldı (ETIK, BERAAT_B, BERAAT_E, NITELIK, MAHKUMIYET); kapsam node 111/111, seçenek 207/207,
kural 101/101, delil 56/56; golden path 13/13; softlock / çıkmaz / sızıntı yok. Süre 73 sn.
(Ara bir sürümde çöküş ek savunmadan son söze kadar ayrı düğümlerden geçiyordu; kaçış araması T_02K → T_03E kısayolu
yüzünden uzaklık sıralamasında yanılıp dört SOFTLOCK_UNVERIFIED verdi — tanıklar elle 9–13 adımda bitirildi. Çöküş tek
düğümde kısaltılınca uyarılar kalktı.)
`npx vitest run --project content-tools --project case-schema --project engine --project validator --maxWorkers=2`:
37 dosya, 1.885 test geçti. `npm run lint` ve `npm run build` temiz.

## 13. Süre ve sözcük ölçümü

`npm run case:duration -- liman-gecesi` (2026-10-21):

```
  G1            109.5 dk   15627 sözcük   227 aksiyon  BERAAT_B (12930)
  G1_AZ          80.6 dk   11843 sözcük   148 aksiyon  BERAAT_B (8625)
  TIPIK         109.5 dk   15641 sözcük   226 aksiyon  BERAAT_E (12615)
  G3             81.9 dk   11887 sözcük   159 aksiyon  NITELIK (4910)
  G4             68.8 dk    9906 sözcük   138 aksiyon  MAHKUMIYET (145)
  G5             75.0 dk   10873 sözcük   146 aksiyon  ETIK (6530)
  OLGU_D        108.3 dk   15431 sözcük   226 aksiyon  BERAAT_E (12295)
  OLGU_T        108.4 dk   15444 sözcük   226 aksiyon  BERAAT_E (12495)
  OLGU_X        108.2 dk   15404 sözcük   226 aksiyon  BERAAT_E (12325)
  OLGU_EK       107.1 dk   15283 sözcük   222 aksiyon  BERAAT_E (12460)
  OLGU_KAYIT    106.3 dk   15114 sözcük   223 aksiyon  NITELIK (11800)
  OLGU_B        101.8 dk   14531 sözcük   211 aksiyon  NITELIK (9505)
  W              74.3 dk   10729 sözcük   147 aksiyon  NITELIK (2935)
  ==> TİPİK YOL (TIPIK): 109.5 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```

Paket (`node tools/content/word-count.mjs content/cases/liman-gecesi`): 1.650 satır, 20.687 satır sözcüğü; ekran
metinleriyle toplam **25.759** sözcük; en uzun satır 215 karakter. Tipik yolun satır sözcüğü **13.004** (önceki tur
12.178): yeni zorunlu ayaklara bağlı kısa sahneler (KN_ISIK, Leyla'nın iki ders satırı, Dr. Beyaz'ın baba/kan notu,
B sahası girişi, nihai rapor okuması, B1/B5 cevapları, ek savunma ve büfe tutanağı, duruşma öncesi gece, ilk celse
sonrası telefon). NITELIK epiloğuna cezaevi görüşmesi eklendi.
