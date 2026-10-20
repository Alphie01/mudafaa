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
Erken tohumlar: “bazen fazla sayardı”, kamyonetin ofis önünde çalışır duruşu (Tarık), römorkör fotoğrafı, telefon
tutanağının kenarındaki “Kptn kim?” notu.

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

Tahta: soruşturmada 9 tarif (7 çıkarım, 2 alternatif), arada 4 yeni + 1 alternatif (toplam 14 tarif, 12 çıkarım).
Çeldirici kartlar: matara, kafes, pamuk, cevapsız arama, mont, servis aracı (tek başına), kardeş; yanlış çift −50.

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

| Öncelik | Kimlik | Sınıf | Koşul | Hüküm | XP |
|---|---|---|---|---|---|
| 1 | ETIK | OTHER | `etik_gulay` (Gülay'a yalan saat öğütlendi) | Azil; Başsavcılık ve Baro bildirimi | 0 |
| 2 | BERAAT_B | ACQUITTAL 223/2-b | ¬çöküş ∧ `gercek_fail` ∧ ikna ≥ 8 ∧ final ≥ 10.000 | Beraat + yumruk için 223/8 düşme | 1,2 |
| 3 | BERAAT_E | ACQUITTAL 223/2-e | ¬çöküş ∧ (`supheli` ∨ `gercek_fail`) ∧ ikna ≥ 6 ∧ final ≥ 9.000 | Beraat + 223/8 düşme | 1,0 |
| 4 | NITELIK | RECHARACTERIZED | ¬çöküş ∧ donus_yok ∧ (terditli ∨ supheli ∨ kabul87) ∧ (dürüst savunma ∨ tahrik bilgisi) ∧ final ≥ 3.000 | 87/4 + 29 + 62/1: 6 yıl 3 ay | 0,85 |
| 5 | MAHKUMIYET | CONVICTION | varsayılan | 81/1 + 21/2 + 62/1: 16 yıl 8 ay | 0,6 (çöküş 0,3) |

- **donus_yok:** contra_k1 ∨ (ded_cikis ∧ ded_buf).
- **olum_sonra:** contra_b1, contra_b2, contra_b3'ten en az ikisi.
- **gercek_fail** (T06_B ile): suç duyurusu ∧ contra_k5 ∧ (contra_k6 ∨ contra_k7) ∧ donus_yok.
- **supheli** (T06_E ile): donus_yok ∧ olum_sonra.
- Etik sayaç: SK_TELKIN, SUC_C, KY_SOR (+1), GL_YALAN (+2), T_03E (+1). XP etikte yarıya iner; ETIK'te 0.

## 7. Skor

- Kategoriler ve döküm satırları: Delil toplama (ARAŞTIRMA + DELİL ANALİZİ) · Çapraz sorgu (SORGULAMA) · İtiraz isabeti
  (USUL + HUKUKİ, `legal_hits`) · Savunma · Hatalı delil (`wrong`). Güvenilirlik bonusu ♥ × 100.
- Strateji çarpanı yalnızca uyumlu esas savunmada (MASUMIYET ×1,5 → T06_B; USUL ×1,2 → T06_E; INDIRIM ×0,8 → T06_T).
- Eşik çubuğu: Mahkûmiyet 0 · 87/4 3.000 · Beraat 9.000 (sonuç eşikleriyle aynı). `scaleMax` §13'te.
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
| G3 | NITELIK | Terditli; ölüm saati ve darbe kanıtlanmaz; dönüş yok hesap dökümüyle; ek savunmada süre; terditli savunma |
| G4 | MAHKUMIYET | Dağınık soruşturma, telkin, inkâr, dayanaksız talepler, olası kastın kabulü |
| G5 | ETIK | İyi bir soruşturma; Gülay'a “on bir buçuk deyin” |
| W | MAHKUMIYET (çöküş) | G3 benzeri yol; ikinci celsede bilirkişiye art arda yanlış delil, ♥0 |

## 10. Erken çözüm denetimi

Bkz. §13. Tipik yolun metni tarandı: Kenan'ın fail olduğu hiçbir satırda söylenmez; ilk celsedeki çatlaklar “yanıldı”
düzeyindedir; abone kaydı yalnızca 23.41 aramasını bulup talep eden oyuncuya ara evresinde gelir.

## 11–13. Ölçümler

Aşağıdaki bölüm `npm run case:duration` ve doğrulayıcı çıktısıyla doldurulmuştur.
