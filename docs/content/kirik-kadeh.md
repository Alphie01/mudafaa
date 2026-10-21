# Dava #08 "Kırık Kadeh" — Tasarım Belgesi

> Kaynak: `content/src/kirik-kadeh/` (yazım kiti) → `content/cases/kirik-kadeh/` (`npm run case:build -- kirik-kadeh`).
> Hikâye kitabı: `docs/content/kirik-kadeh-hikaye.md` (ton, sesler, sahne vuruşları). Hukuki notlar: `docs/legal/kirik-kadeh.md`.
> Lineup satırı: #08 · Kasten yaralama (TCK 86/1, 86/3-e) · meşru müdafaa (TCK 25/1), sınırın aşılması (27/2), haksız tahrik
> (29), kemik kırığının derecesi (87/3) · rütbe şartı yok · zorluk 3/5.

## 1. Logline ve tema

- **Tek cümle:** Setbaşı'nda küçük bir barın sahibi, eski amatör boksör Bora Yalçın, bir müşterinin burnunu kırık bir kadehle
  kırmak ve yerde tekmelemekle suçlanıyor; gerçekte kadehi kıran ve saldıran müşteridir, tek görgü tanığı da müşterinin
  çalışanıdır.
- **Dramatik soru:** "Haklıydın" ile "haklı olmadığın ispatlanamadı" arasındaki fark bir insan için ne kadar büyüktür?
  Yan tema: korumak ile saklamak (Bora garsonu korumak için onu dosyanın dışına koymuştur).
- **Ton:** noir dram; yağmur, Gökdere'nin taşkın sesi, sarı sokak lambası, kuru ve seyrek mizah.
- **Ana mekânlar:** Gölge bar (kapalı), kolluk fotoğrafları (pano), Gökdere Sokağı, Arslan Hukuk, Görükle kampüsü, sigorta
  acentesinin önü, Şen Hukuk (Çekirge), Setbaşı karakolu, Bursa Adliyesi (7. Asliye Ceza).

## 2. Gerçek ve kronoloji

| Saat | Olay | Kim biliyor | Nasıl keşfedilir (sahne · mekanik) |
|---|---|---|---|
| 2 Kasım 22.10 | Serkan ve Onur kol kola Gölge'ye girer; masa 4 (kolonun arkası). | Onur, Serkan, eczacı | Eczane kaydı (ARA_ECZ), adisyon (INV_ARAMA), Bora görüşmesi, Ece (TE_MASA) |
| 23.30–00.50 | Altı duble rakı; hesabı Onur'un kartı öder. | Bora, Ece | Adisyon fişi masa 4 (clue_adisyon) |
| 01.00 | Kayıt cihazı zaman ayarlı prizle kesilir (her gece; ruhsat saati). | Bora | Priz (INV_ARAMA) + TB_KAMERA (clue_ruhsat) → ded_kamera |
| 01.35 | Serkan tezgâha gelir, Ece'nin bileğini tutar; Bora "Bırak" der; hakaret. | Bora, Ece, Defne | TB_GECE/TB_SERKAN, TE_GECE, Ece kürsüde |
| 01.40 | Serkan kadehi tezgâhın dış kenarına vurur, sapla Bora'ya savurur; Bora'nın sol önkolu kesilir, kan tezgâhın içine damlar. | Bora, Ece, Defne (video) | Fotoğraf 3 ve 5, darp raporu, Kriminal rapor, video |
| 01.40:30 | Bora bileği tutar, tek yumruk: burun kırığı. Serkan düşerken sapı kavradığı avucu kesilir. | herkes | Acil kaydı (anamnez "yumrukla", avuç içi kesi), darp raporu (sağ el ödemi) |
| 01.41 | Defne Yurt (masa 7) doğum günü hikâyesi çeker: arka planda saldırı. Onur kolonun arkasından kalkıp Bora'yı tutar. | Defne, Ece | Adisyon masa 7 (01.43 ödeme), Ece (clue_story), ARA_DEFNE, Sinan (ARAS_ONUR) |
| 01.41:20 | Serkan yerde sapı yeniden kaldırır; Bora tezgâhtan çıkar, ayağıyla sağ bileğe basar, sapı bıraktırır. | Bora, Onur | ATK raporu (bilek bası izi, gövdede iz yok) → ded_bilek |
| 01.45 | Bora Ece'yi arka kapıdan gönderir ("Seni burada görmedim"). | Bora, Ece | Önlük (INV_ARAMA), TB_ONLUK sert, arka sokak (toka), eczane kaydı 01.52 |
| 01.50 | Bora 112'yi kendisi arar. | tutanak | Acil kaydı karşılaştırma (fact_112) |
| 02.05–02.10 | Polis/ambulans; Sinan Kurt tutanağa "tezgâh önü" yazar; fotoğraf 7 sapı Serkan'ın elinin yanında gösterir. | Sinan | Kolluk fotoğrafları (INV_ARAMA2), ARA_SINAN |
| 02.25 | Acil: 1,9 promil; "yumrukla vuruldum"; deplasmansız kırık, septum normal; sağ avuçta enine kesi. | dosya ekinde | INV_HASTANE (belge) |
| 03.30 | Onur: "Müştekiyi tanımam… kadehle yüzüne vurdu… yerde tekmeledi." Bora: "Saldırdı. Vurdum. Bir kere." | dosya | INV_IFADE (belge) |
| Aralık | İddianame: TCK 86/1, 86/3-e, 87/3. Serkan katılan (vekili Tolga Şen); Serkan hakkında Bora'nın kolu için ayrı soruşturma. | dosya | BR_02, TOLGA_KARSI |
| Ocak | Bora büroya gelir (BR_00). Oyun başlar. | — | — |

## 3. Yapı ve node haritası

```
PR_00 soğuk açılış (isimsiz sesler; kimin saldırdığı görünmez) → PR_01 karakol (TANIK/POLİS isimsiz)
BR_00 Bora büroda (3 seçenek) → BR00_B2 Leyla → BR_01 ceza aralığı (A–D) → BR_01B devir → BR_02 dosya + strateji → BR_03 dosya gecesi
INV_SABAH → INV_HUB (3 gün × 4 EP; push + $return)
  OLAY YERİ: INV_ARAMA (bar, 6 nesne, 5 büyüteç) · INV_ARAMA2 (fotoğraflar) · INV_ARAMA3 (sokak)
  KİŞİLER: INV_BORA (görüşme: 7 konu × ton; KAMERA/ÖNLÜK konuları ipucuyla açılır) · INV_BORA2 · INV_ONUR · INV_TOLGA (0 EP)
           · INV_ECE (önlük ya da Bora'nın itirafıyla açılır; 5 konu) · INV_ECZANE (kamera ipucuyla açılır)
  ARŞİV: INV_HASTANE · INV_DARP · INV_IFADE (belgeler) · INV_DIL (3 talep) · INV_CIKARIM (tahta, 0 EP) · INV_LEYLA1–3 (0 EP)
  Gün sonu: tg_inv_day → INV_DAY_END (DECISION) → INV_AKSAM1 (Tolga'nın teklifi) → INV_SABAH2* / INV_AKSAM2 (gece telefonu) → INV_SABAH3*
GO_H1 → INV_GECE_1..4 (koşullu hafıza zinciri) → INV_GECE
H1_00G → H1_00G2 → H1_00K koridor → H1_00 açılış → H1_01 iddianame → H1_02 Bora'nın savunması (A–D) → H1_02R
  → H1_03 boksörlük sorusu (itiraz) → H1_03R → H1_03S savcının sorusu → H1_04V → H1_04 katılanın beyanı (K1–K5)
  → H1_04R → H1_MOLA → H1_05 delil talepleri (2 hak) → H1_ARA1..3 ara karar → H1_ARA erteleme
ARA_GIRIS_1..3 (gelen zarflar; kartlar ancak okununca) → ARA_SERKAN (katılan kapıda; vekili olmadan konuşulmaz) → ARA_GIRIS
  → ARA_HUB (2 gün × 4 EP; yığınsız, doğrudan dönüş)
  KİŞİLER: ARA_ECE · ARA_SINAN (4 soru) · ARA_DEFNE (masa 7 ipucuyla açılır) · ARA_BORA
  ARŞİV: ARA_ATK (ev_atk okununca) · ARA_KRIM (zarf geldiyse; ev_kriminal okununca) · ARA_ECZ (zarf geldiyse; ev_eczane
         okununca) · ARA_DIL (2 hak) · ARA_CIKARIM (BİLEK tarifi) · ARA_LEYLA1–2
  Gün sonu: tg_ara_day → ARA_DAY_END (Onur kapıda; etik sınır) → ARA_SABAH2* (asansörde savcı) → ARA_HUB
GO_T → ARA_SON_1..3 → ARA_SON
T_00G (video/Kriminal teslimi) → T_00G2 → T_00 → T_01 özel rapor (itiraz) → T_02V → T_02 Onur (O1–O5; kırılma seçeneği)
  ⇢ T_02H kırılma → T_02HB yerdeki an (bilek kurulduysa “ayağı bileğindeydi”, değilse “görmedim”) → T_02S salon → T_03D: Ece çağrıldıysa T_03 → T_03O (Tolga'nın sorusu; itiraz) → T_03Y
     → T_03C (yönlendirilmiş tanık çöker: ETIK) | T_03K (yönlendirme düzeltilmiş) | T_03B (baskı) | T_03E (temiz anlatım)
  | T_03X boş sandalye → T_04D → T_04V video → T_04SD → T_04S memur → T_04K kamera → T_04 tutanak (itiraz)
  → T_05P ara → T_05D → T_05A1..3 + T_05A (savcı 223/2-d ister; yalnızca dinlenen tanıkları ve dosyadaki raporları sayar)
     | T_05B (tahrik, silah düşer; tanık kırıldıysa “yerdeki an aydınlanmadı”) | T_05C (mahkûmiyet) → T_05R cevap
  → T_06P dayanaklar (3 hak) → T_06 esas savunma → T_06R → T_07P → T_07 son söz → T_08 → R_KARAR (+ epilog)
tg_cokus (cred 0) → T_COKUS → T_08
```

## 4. Delil zinciri

| Kimlik | Ad | Tür | Keşif | Neyi çürütür / destekler | Sunulabilir |
|---|---|---|---|---|---|
| ev_tutanak, ev_onur_ifade, ev_gecici_rapor, ev_kadeh, ev_bora_ifade | Savcılık dosyası | EVIDENCE | başlangıç | İddia; savunma sunarsa cezalı kural | evet (cezalı) |
| ev_hastane | Acil servis kaydı | EVIDENCE | INV_HASTANE girişi | K1 (alkol), K3/K4 kısmi | evet |
| ev_darp | Bora'nın darp raporu | EVIDENCE | INV_DARP girişi | K5, O5 | evet |
| ev_eczane | Eczane kaydı | EVIDENCE | ARA girişi (dilekçe/duruşma talebi) | K2, O1 | evet |
| ev_kriminal | Kriminal rapor | EVIDENCE | ARA girişi ya da T_00G (ek dilekçe) | K3, O3; tutanak (T04_C) | evet |
| ev_atk | Adli Tıp kesin raporu | EVIDENCE | ARA girişi (mahkeme re'sen) | O4 kısmi; ARA_ATK belgesi | evet |
| ev_video | Defne'nin videosu | EVIDENCE | T_00G (defne_video) | O3, O5; T_04V | evet |
| ev_ozel_rapor | Özel klinik raporu | EVIDENCE | T_01 | 3. derece iddiası (itiraz) | evet (cezalı) |
| clue_* (24 + clue_bilek) | sahne, belge, görüşme ipuçları | CLUE | sahneler, belgeler, görüşmeler | tahta kartları | hayır |
| ded_tanidik | Onur ile Serkan birlikte gelmiş | INSIGHT | tahta: adisyon + "tanımam" | K2, O1 | evet |
| ded_kadeh_serkan | Kadeh Serkan'ın elindeydi | INSIGHT | tahta: fotoğraf 7 + avuç içi kesi | K3, O3 | evet |
| ded_savunma | Bora tezgâhın arkasında kesildi | INSIGHT | tahta: önkol kesisi + iç kenardaki kan | K5, O5 | evet |
| ded_gorus | Onur yeri göremezdi | INSIGHT | tahta: kolon + "her yeri gördüm" | O2 | evet |
| ded_yumruk | Kırık yumruktan | INSIGHT | tahta: anamnez + "kadehle yüzüne" | K4, O3 | evet |
| ded_saldirgan | Kadeh müşteri tarafında kırıldı | INSIGHT | tahta: 1,9 promil + kırılma noktası | K1, K5 | evet |
| ded_kamera | Kamera her gece 01.00'de kapanıyor | INSIGHT | tahta: priz + ruhsat | T_04K, D_KAMERA | hayır (dayanak) |
| ded_video | Masa 7'de bir kayıt var | INSIGHT | tahta: Ece'nin sözü + masa 7 adisyonu | ARA_DEFNE'yi açar | hayır |
| ded_bilek | "Tekme" bileğe basmaktı | INSIGHT | ara tahtası: bilek bası izi + "tekme" | O4 | evet |

- **Tahta:** soruşturmada 8 tarif (TANIDIK, KADEH, SAVUNMA, GÖRÜŞ, YUMRUK, SALDIRGAN, KAMERA, VIDEO), ara tahtasında aynıları +
  BİLEK (9). Çeldiriciler: boks fotoğrafı, taksi defteri, masa 4 fotoğrafı, deplasmansız kırık, arka sokak, önlük, eczane
  kamerası, "tekme" (bilek bulunana dek). Yanlış çift −50 (ONCE_PER_PARAMS), `wrong_pair` raporda okunur.
- **Gecikmeli teslimler:** zarflar ARA_GIRIS'te gelir ama delil kartı ancak belge okununca (1 EP) deftere girer:
  ev_atk — ARA_ATK'ye girişte (koşulsuz zarf); ev_kriminal — `req_kriminal ∨ h1_kriminal` ise ARA_KRIM'e girişte, ya da
  `ara_kriminal` ile T_00G'de; ev_eczane — `req_eczane ∨ h1_eczane` ise ARA_ECZ'ye girişte; ev_video — `defne_video` (T_00G).
  Okunmayan rapor kürsüye taşınamaz.

## 5. Çelişkiler (çapraz sorgu)

**1. celse — Serkan (katılan, yeminsiz; CMK 236/1):**

| İfade | Vurgu | BASTIR | Tam isabet (+250/300) | Kısmi | İtiraz |
|---|---|---|---|---|---|
| K1 "bir iki kadeh, ayıktım" | press ∨ clue_alkol | PR_K1 | ev_hastane, ded_saldirgan → contra_k1 | — | — |
| K2 "Onur'u o gece tanıdım" | ded_tanidik | — | ded_tanidik, ev_eczane → contra_k2 | — | — |
| K3 "elimde bir şey yoktu" | press ∨ ded_kadeh_serkan | PR_K3 | ded_kadeh_serkan, ev_kriminal → contra_k3 | ev_hastane (+100, bastırdıktan sonra) | — |
| K4 "kırık tarafıyla yüzüme" | press ∨ ded_yumruk | PR_K4 | ded_yumruk → contra_k4 | ev_hastane (+100) | — |
| K5 "kimseye dokunmadım… herkes bilir" | press ∨ Ece/taciz; "herkes bilir" hep | PR_K5 | ded_savunma, ded_saldirgan, ev_darp → contra_k5 | — | g_kanaat (+50) |

**2. celse — Onur (yeminli):**

| İfade | Vurgu | Tam isabet | Kısmi | İtiraz |
|---|---|---|---|---|
| O1 "tesadüfen, tek başıma" | press ∨ ded_tanidik ∨ contra_k2 | ded_tanidik, ev_eczane → contra_o1 | — | — |
| O2 "her şeyi net gördüm… belalı biriydi" | press ∨ ded_gorus | ded_gorus → contra_o2 | — | g_kanaat (+50) |
| O3 "kırık tarafıyla yüzüne" | press ∨ ded_yumruk ∨ ev_kriminal | ded_yumruk, ev_kriminal, ded_kadeh_serkan, ev_video → contra_o3 | — | — |
| O4 "yerde tekmeledi" | press ∨ ded_bilek ∨ atk_govde | ded_bilek → contra_o4 | ev_atk (+120) | — |
| O5 "elini hiç kaldırmadı" | press ∨ ded_savunma ∨ ev_video | ded_savunma, ev_video, ev_darp → contra_o5 | — | — |

- **Kırılma (T02_SON → T_02H):** ara döneminden bir dayanak (`atk_govde ∨ krim_avuc ∨ ara_sinan ∨ ded_bilek ∨ onur_vicdan`)
  **ve** `contra_o*` en az 3, ya da `onur_vicdan` ile en az 2. Onur çalışanı olduğunu, kollukta yalan söylediğini söyler
  (`onur_kirildi`, +150, ikna +2). Yerdeki an T_02HB'de: bilek tahtada kurulduysa "ayağı bileğindeydi", değilse "görmedim;
  kolon vardı" (tanık zemini göremezdi; an aydınlanmaz).
- Savcılık belgeleri her iki tanığa karşı cezalı kural (−150, güvenilirlik −1, en çok 3 kez); yanlış delil FALLBACK aynı bedel.

## 6. Ters köşeler ve tohumlar

1. **Onur, Serkan'ın çalışanıdır.** Tohumlar: soğuk açılışta iki ceketli masa; karakolda "bir bağınız var mı? — Hayır"; Bora'nın
   "gözlüklü hesabı öder" sözü; Onur'un üçüncü kattaki pencereye bakışı ve camdaki şirket adı; adisyon; eczacının "müdürüm"
   kulak misafirliği; eczane kaydı (kol kola); Sinan'ın "Onur, arabayı sen al". Açılış: K2/O1 sunumu.
2. **Saklanan tanık Ece.** Tohumlar: soğuk açılışta KADIN SESİ ve "Arka kapı. Git."; önlük; arka sokaktaki toka; Bora'nın
   "kızın bileğini"; Leyla'nın "tepsiyi kim taşıyordu?"; eczane kaydı 01.52.
3. **"Tekme" bileğe basmaktır.** Tohumlar: Bora'nın sert tondaki anlatımı; savcının "neden tezgâhtan çıktınız?" sorusu; Onur'un
   "ayağı onun üstündeydi"; ATK satırları. Açılış: ARA tahtası ded_bilek → O4.
4. **Masa 7'de bir video.** Tohumlar: soğuk açılışta doğum günü pastası; masa 7 adisyonu (01.43); Ece'nin "ışığı yüzüme geldi".

## 7. Sonuçlar

Sonucu esas savunma düğmesi değil, kayıttaki delil belirler (CMK 217/1, 225/2). Yüklemler (`meta.ts`):

- `saldiri_kanit` — (ded_kadeh_serkan ∨ ev_kriminal ∨ ev_video) ∧ (ded_savunma ∨ ev_video)
- `tekme_yok` — contra_o4 ∨ onur_kirildi · `tanik_coktu` — contra_o1 ∨ contra_o2 ∨ contra_k2
- `bagimsiz_anlatim` — video_izlendi ∨ ece_tanikti ∨ onur_kirildi · `bilek_kanit` — ded_bilek (ara tahtası)
- `mm_tam` — saldiri_kanit ∧ tekme_yok ∧ tanik_coktu ∧ bagimsiz_anlatim ∧ bilek_kanit
- `ara_gelisme` — atk_govde ∨ krim_avuc ∨ ecz_birlikte ∨ ara_sinan ∨ ded_bilek ∨ onur_vicdan ∨ video_izlendi
- `tanik_guvenilmez` — onur_kirildi ∨ en az üç contra_o* · `kadeh_curudu` — contra_k3 ∨ contra_k4 ∨ contra_o3 ∨ krim_avuc ∨ saldiri_kanit
- `tahrik_kanit` — ece_tanikti ∨ krim_avuc ∨ saldiri_kanit ∨ (contra_k5 ∧ contra_o5) · `findings` — en az dört contra_k*/contra_o*

| Öncelik | Kimlik | Sınıf | Koşul | Ceza | XP |
|---|---|---|---|---|---|
| 0 | ETIK | CONVICTION | `ece_coktu` ∧ ¬saldiri_kanit ∧ ¬kadeh_curudu ∧ ¬tanik_guvenilmez ∧ ¬video ∧ ¬ev_kriminal (Ece tek bağımsız anlatımdı) | 2 yıl 11 ay + baro bildirimi | 0 |
| 1 | BERAAT_D | ACQUITTAL (223/2-d) | ¬çöküş ∧ `mm_tam` ∧ final ≥ 9500 | yok | 1,2 |
| 2 | BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş ∧ ¬mm_tam ∧ tanik_guvenilmez ∧ ara_gelisme ∧ final ≥ 9500 | yok | 1,0 |
| 3 | CVYO | OTHER (223/3-c; TCK 27/2) | ¬çöküş ∧ saldiri_kanit ∧ (final ≥ 7500 ∨ mm_tam) | ceza verilmesine yer yok | 0,9 |
| 4 | INDIRIM | REDUCED | ¬çöküş ∧ ¬saldiri_kanit ∧ tahrik_kanit ∧ kadeh_curudu ∧ final ≥ 7500 | 11 ay 20 gün, HAGB | 0,85 |
| 5 | MAHKUMIYET | CONVICTION (varsayılan) | — (çöküş; ya da saldırı, tahrik veya kadeh çürümesi kurulmamışsa) | 2 yıl 11 ay | 0,6 (çöküşte 0,3) |

Değişmezler (2026-10-21 yoklaması: her golden path'te T_06'nın beş seçeneği tek tek denendi, sınıf hiçbirinde değişmedi):
esas savunma düğmesi sınıfı değil yalnızca skoru belirler; `mm_tam` ∧ ¬çöküş → final ≥ 9500 ise BERAAT_D, altındaysa CVYO
(ceza yok), asla mahkûmiyet ya da indirim — çöküş tetikleyicisi de mm_tam varken çalışmaz; `saldiri_kanit` ∧ ¬çöküş ∧
final ≥ 7500 → asla mahkûmiyet; kadeh çürümesi + tahrik → silah artırımsız İNDİRİM (mahkeme TCK 29'u re'sen uygular);
savcının 2-d mütalaası (T_05A ⇔ mm_tam) ile BERAAT_E aynı oyunda olamaz. Ece yönlendirilip
çöktüğünde ETIK dışındaki sonuçlarda gerekçeye "beyan hükme esas alınmadı" satırı ve disiplin soruşturması epilogu eklenir.

Esas savunma (T_06) yalnızca skor ve iknayı belirler: T06_MM ∧ mm_tam +250 (×1,5 MASUMIYET) ve `mm_kabul`; mm_tam yokken
saldırı kanıtıyla `sinir_kabul` +60; T06_E ∧ findings +200 (×1,2 USUL) ve `supheden`, mm_tam varken yalnız +60 (NÖTR);
T06_SINIR ∧ saldırı +120 `sinir_kabul`, mm_tam varken +20 (NÖTR); T06_T `terditli` +150 (×0,8 INDIRIM); T06_D (taksir,
TCK 89) −50, ikna −1. Bu bayraklar yalnızca gerekçe satırlarını, epilog parçalarını ve rapor ipuçlarını seçer. Mütalaa üç varyant (T_05A/B/C) delil gücüne göre.

**Ceza hesabı** (ayrıntı `docs/legal/kirik-kadeh.md` §2): mahkûmiyet 2 yıl → ×1,5 = 3 yıl → +1/6 = 3 yıl 6 ay → −1/6 =
2 yıl 11 ay; indirim 1 yıl 6 ay → +1/6 = 1 yıl 9 ay → −1/3 (tahrik) = 1 yıl 2 ay → −1/6 = 11 ay 20 gün, HAGB.

## 8. Skor

- Kategoriler: altı sabit kategori; döküm satırları delil (ARASTIRMA+DELIL_ANALIZI), çapraz sorgu (SORGULAMA), itiraz
  (USUL+HUKUKI), savunma (SAVUNMA_STRATEJISI), hatalı delil. Güvenilirlik bonusu `cred × 100`.
- Eşik çubuğu: Mahkûmiyet 0 · İndirim 7500 · Beraat 9500 (sonuç koşullarıyla aynı). Teorik tavan 12 110 (validator);
  `scaleMax` 11 500 (~%95).
- Strateji çarpanı: MASUMIYET ×1,5 (T06_MM 250), USUL ×1,2 (T06_E 200), INDIRIM ×0,8 (T06_T 150).

## 9. Golden path'ler

| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 11 545 | USUL stratejisi; bütün sahneler, belgeler, 8 tarif; Ece dürüstçe; K1–K5; ara dönemde ATK/Kriminal/eczane, Sinan, Ece, Bora, Defne + ek dilekçe; bilek tahtada kurulmaz (O4'e ATK raporu); Onur O1–O5 ve kırılma; video, memur; esas savunmada 223/2-e. Yerdeki an aydınlanmadığı için mm_tam yok |
| G_D | BERAAT_D | 12 140 | MASUMIYET; aynı zincir + ara tahtasında bilek, O4'e ded_bilek, T04_C, D_KACIS; savcı 2-d ister |
| G_CVYO | CVYO | 10 790 | Saldırı kâğıtla kurulur ama tanık çökmez (yalnız O1/O3) |
| G_I | INDIRIM | 9 495 | Tahtada önkol + kan kurulmaz, video yok → saldırı kanıtı yok; Ece tanıklık eder, Kriminal avuç bulgusu ve K3/K4 → kadeh çürür, tahrik kurulur; terditli savunma |
| G_M | MAHKUMIYET | 7 775 | Saldırı kurulmaz, Kriminal istenmez, Ece çağrılmaz, K3/K4 yalnız bastırılır; D_KARAKTER/D_BOKS, taksir savunması, inkâr |
| W | MAHKUMIYET (çöküş) | 8 030 | Özel rapora yanlış itiraz + dört yanlış delil → T_COKUS |
| G_DUZELT | BERAAT_E | 10 235 | Ece yönlendirilir, ara dönemde düzeltilir (T_03K); kamera yalanı düzeltilir (ARAB_KAMERA); Kriminal'de ıska |
| G_BILGI | BERAAT_E | 10 995 | Ece'ye yanlış bilgi (zorunlu değil) → ARAE_BILGI ile düzeltme ve ek dilekçe; keşif talebi |
| G_BASKI | BERAAT_E | 10 575 | Ece'ye baskı (T_03B) ve Tolga'ya aşırı tepki |
| G_ETIK | ETIK | 8 620 | Ece yönlendirilir, düzeltilmez; kürsüde çöker; saldırı, kadeh ve video kurulmaz |

## 10. Erken çözüm denetimi

- Beraat iki kapıya bağlı: delil (BERAAT_D için mm_tam — ara tahtasındaki bilek dahil; BERAAT_E için ikinci celsede çöken
  tanık **ve** ara dönemden en az bir gelişme) **ve** final ≥ 9500. ATK, Kriminal ve eczane yalnızca zarf/CD olarak gelir;
  delil kartı belge ara dönemde açılınca verilir, açılmadan kürsüde sunulamaz.
- Ara dönem atlama yoklaması (ARAGIRIS_DEVAM'dan doğrudan GO_T): hiçbir yol beraate ulaşmıyor (TIPIK/G_D/G_DUZELT/G_BILGI/
  G_BASKI ikinci celsede sunacak kâğıt bulamıyor); G_CVYO → CVYO 8 400, G_I → İNDİRİM 7 695, G_M → MAHKUMIYET.
- Kısayol yoklaması (2026-10-21, ikinci tur; her golden path'ten başlayıp reddedilen aksiyonları atlayarak 64→1 boyutlu
  parçaları silen açgözlü küçültme, tek süreç, kabul edilen aksiyonlar sayıldı): BERAAT_E en kısa **145** (G_BASKI'dan;
  G_DUZELT'ten 147, TIPIK'ten 152, G_BILGI'den 161), BERAAT_D **165** (G_D'den). Önceki turda CVYO 161, İNDİRİM 143. En kısa
  beraat tipik yolun 209 aksiyonunun **%69**'u; hepsi üç arama sahnesi, hastane/darp/ifade belgeleri, sekiz tahta tarifi, Ece görüşmesi ve ara dönemde ATK +
  Kriminal + eczane + Sinan gerektiriyor.
- Tipik yol satırları döküldü (`case:duration` görünüm metinleri): soğuk açılış ve karakol isimsiz; Onur'un Serkan'la ilişkisi
  oyuncu adisyonu/eczaneyi bulmadan söylenmez (Bora görüşmesindeki "patronu mu", ifade belgesindeki "sigortacının imzası",
  Ece'nin "iş arkadaşı galiba" sözü ve birinci celsede ded_tanidik'e bağlı olmayan iki "patron/çalışan" iç sesi çıkarıldı); kimin saldırdığı yalnızca müvekkilin kendi anlatımı olarak geçer, kâğıtla kanıtlanana dek iç ses
  "kanıtlayabilirsem" kaydıyla konuşur.

## 11. Süre ve sözcük ölçümü

`npm run case:duration -- kirik-kadeh` (2026-10-21):

```
  TIPIK          98.7 dk   14009 sözcük   209 aksiyon  BERAAT_E (11545)
  G_D            98.0 dk   13832 sözcük   212 aksiyon  BERAAT_D (12140)
  G_CVYO         92.5 dk   13008 sözcük   202 aksiyon  CVYO (10790)
  G_I            88.5 dk   12456 sözcük   193 aksiyon  INDIRIM (9495)
  G_M            81.1 dk   11391 sözcük   178 aksiyon  MAHKUMIYET (7775)
  W              81.8 dk   11392 sözcük   185 aksiyon  MAHKUMIYET (8030)
  G_DUZELT       89.7 dk   12742 sözcük   189 aksiyon  BERAAT_E (10235)
  G_BILGI        92.6 dk   13077 sözcük   199 aksiyon  BERAAT_E (10995)
  G_BASKI        91.9 dk   13015 sözcük   196 aksiyon  BERAAT_E (10575)
  G_ETIK         85.4 dk   12033 sözcük   186 aksiyon  ETIK (8620)
  ==> TİPİK YOL (TIPIK): 98.7 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```

Davanın bütün metni (satırlar, yanıtlar, geri bildirimler, delil ve hüküm metinleri) ~26 900 sözcüktür.
