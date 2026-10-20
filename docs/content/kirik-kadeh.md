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
ARA_GIRIS_1..3 (gelen zarflar; koşullu teslim) → ARA_GIRIS → ARA_HUB (2 gün × 4 EP; yığınsız, doğrudan dönüş)
  KİŞİLER: ARA_ECE · ARA_SINAN · ARA_DEFNE (masa 7 ipucuyla açılır) · ARA_BORA
  ARŞİV: ARA_ATK · ARA_KRIM (Kriminal rapor geldiyse) · ARA_ECZ (eczane kaydı geldiyse) · ARA_DIL (2 hak) · ARA_CIKARIM · ARA_LEYLA1–2
  Gün sonu: tg_ara_day → ARA_DAY_END (Onur kapıda; etik sınır) → ARA_SABAH2* (asansörde savcı) → ARA_HUB
GO_T → ARA_SON_1..3 → ARA_SON
T_00G (video/Kriminal teslimi) → T_00G2 → T_00 → T_01 özel rapor (itiraz) → T_02V → T_02 Onur (O1–O5; kırılma seçeneği)
  ⇢ T_02H kırılma → T_02S salon → T_03D: Ece çağrıldıysa T_03 → T_03O (Tolga'nın sorusu; itiraz) → T_03Y
     → T_03C (yönlendirilmiş tanık çöker: ETIK) | T_03K (yönlendirme düzeltilmiş) | T_03B (baskı) | T_03E (temiz anlatım)
  | T_03X boş sandalye → T_04D → T_04V video → T_04SD → T_04S memur → T_04K kamera → T_04 tutanak (itiraz)
  → T_05P ara → T_05D → T_05A (savcı 223/2-d ister) | T_05B (tahrik, silah düşer) | T_05C (mahkûmiyet) → T_05R cevap
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
- **Gecikmeli teslimler:** ev_kriminal — `req_kriminal ∨ h1_kriminal` (ARA_GIRIS_1) ya da `ara_kriminal` (T_00G); ev_eczane —
  `req_eczane ∨ h1_eczane` (ARA_GIRIS_1); ev_video — `defne_video` (T_00G); ev_atk koşulsuz (ARA_GIRIS_1).

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

- **Kırılma (T02_SON → T_02H):** `contra_o*` en az 3, ya da `onur_vicdan` (ARAG_DOGRU) ile en az 2. Onur çalışanı olduğunu,
  kollukta yalan söylediğini, yerde tekme görmediğini söyler (`onur_kirildi`, +150, ikna +2).
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

| Öncelik | Kimlik | Sınıf | Koşul | Ceza | XP |
|---|---|---|---|---|---|
| 0 | ETIK | CONVICTION | `ece_coktu` (Ece yönlendirildi, düzeltilmedi, kürsüde çöktü) | 2 yıl 11 ay + baro bildirimi | 0 |
| 1 | BERAAT_D | ACQUITTAL (223/2-d) | ¬çöküş ∧ `mm_kabul` ∧ ikna ≥ 7 ∧ final ≥ 9500 | yok | 1,2 |
| 2 | BERAAT_E | ACQUITTAL (223/2-e) | ¬çöküş ∧ (`supheden` ∨ `mm_kabul`) ∧ final ≥ 9500 | yok | 1,0 |
| 3 | CVYO | OTHER (223/3-c; TCK 27/2) | ¬çöküş ∧ `sinir_kabul` ∧ final ≥ 6000 | ceza verilmesine yer yok | 0,9 |
| 4 | INDIRIM | REDUCED | ¬çöküş ∧ `terditli` ∧ tahrik_kanit ∧ final ≥ 6000 | 11 ay 20 gün, HAGB | 0,85 |
| 5 | MAHKUMIYET | CONVICTION (varsayılan) | — (çöküş dahil) | 2 yıl 11 ay | 0,6 (çöküşte 0,3) |

Esas savunma bayrakları (T_06): `mm_kabul` ← T06_MM ∧ mm_tam (saldırı + tekme yok + tanık çöktü + bağımsız anlatım);
T06_MM yalnız saldırı kanıtıyla `sinir_kabul`; `supheden` ← T06_E ∧ findings (≥ 4 çelişki); `sinir_kabul` ← T06_SINIR ∧
saldırı kanıtı; `terditli` ← T06_T. Mütalaa üç varyant (T_05A/B/C) delil gücüne göre.

**Ceza hesabı** (ayrıntı `docs/legal/kirik-kadeh.md` §2): mahkûmiyet 2 yıl → ×1,5 = 3 yıl → +1/6 = 3 yıl 6 ay → −1/6 =
2 yıl 11 ay; indirim 1 yıl 6 ay → +1/6 = 1 yıl 9 ay → −1/3 (tahrik) = 1 yıl 2 ay → −1/6 = 11 ay 20 gün, HAGB.

## 8. Skor

- Kategoriler: altı sabit kategori; döküm satırları delil (ARASTIRMA+DELIL_ANALIZI), çapraz sorgu (SORGULAMA), itiraz
  (USUL+HUKUKI), savunma (SAVUNMA_STRATEJISI), hatalı delil. Güvenilirlik bonusu `cred × 100`.
- Eşik çubuğu: Mahkûmiyet 0 · İndirim 6000 · Beraat 9500 (sonuç koşullarıyla aynı). Teorik tavan 12 110 (validator);
  `scaleMax` 11 500 (~%95).
- Strateji çarpanı: MASUMIYET ×1,5 (T06_MM 250), USUL ×1,2 (T06_E 200), INDIRIM ×0,8 (T06_T 150).

## 9. Golden path'ler

| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 11 995 | USUL stratejisi; bütün sahneler, belgeler, 8 tarif; Ece dürüstçe; K1–K5; ara dönemde ATK/Kriminal/eczane, Sinan, Ece, Bora, Defne + ek dilekçe; Onur O1–O5 ve kırılma; video, memur; esas savunmada 223/2-e |
| G_D | BERAAT_D | 12 110 | MASUMIYET; aynı zincir + T04_C, D_KACIS; esas savunmada 223/2-d (savcı da beraat ister) |
| G_CVYO | CVYO | 10 760 | Tekme çürütülmez (O4 sunulmaz, kırılma yok); T06_SINIR |
| G_I | INDIRIM | 10 410 | INDIRIM stratejisi; yalnız O1/O5; tutanağa itiraz yok; terditli savunma |
| G_M | MAHKUMIYET | 9 805 | Güçlü soruşturma, zayıf kürsü; D_KARAKTER/D_BOKS, duygusal savunma, inkâr |
| W | MAHKUMIYET (çöküş) | 8 000 | Özel rapora yanlış itiraz + dört yanlış delil → T_COKUS |
| G_DUZELT | BERAAT_E | 10 715 | Ece yönlendirilir, ara dönemde düzeltilir (T_03K); kamera yalanı düzeltilir (ARAB_KAMERA); Kriminal'de ıska |
| G_BILGI | BERAAT_E | 11 445 | Ece'ye yanlış bilgi (zorunlu değil) → ARAE_BILGI ile düzeltme ve ek dilekçe; keşif talebi |
| G_BASKI | BERAAT_E | 11 025 | Ece'ye baskı (T_03B) ve Tolga'ya aşırı tepki |
| G_ETIK | ETIK | 11 320 | Ece yönlendirilir, düzeltilmez; kürsüde çöker |

## 10. Erken çözüm denetimi

- Beraat iki kapıya bağlı: bayrak (en az dört kürsü çelişkisi ya da meşru savunmanın dört şartı) **ve** final ≥ 9500.
- Elle kurulan en yalın beraat denemesi (soruşturmada yalnız üç sahne + üç belge + tahta, Bora/Ece/Onur/Tolga görüşmeleri yok,
  ara dönemde yalnız ATK + Kriminal + eczane kaydı, iki celsede bütün bastır/sun/itirazlar): **136 aksiyon, final 9 325 →
  MAHKUMIYET**. Beraat için en az birkaç görüşme/teslim daha gerekir; en kısa beraat ≥ ~140 aksiyon (tipik yolun 211
  aksiyonunun ≥ %64'ü).
- Tipik yol satırları döküldü (`case:duration` görünüm metinleri): soğuk açılış ve karakol isimsiz; Onur'un Serkan'la ilişkisi
  oyuncu adisyonu/eczaneyi bulmadan söylenmez (ilk taslaktaki "yarın erken toplantı" satırı ve Bora görüşmesindeki açık
  bağlantı düşünceden çıkarıldı); kimin saldırdığı yalnızca müvekkilin kendi anlatımı olarak geçer, kâğıtla kanıtlanana dek
  iç ses "kanıtlayabilirsem" kaydıyla konuşur.

## 11. Süre ve sözcük ölçümü

`npm run case:duration -- kirik-kadeh` (2026-10-20):

```
  TIPIK          93.0 dk   12937 sözcük   211 aksiyon  BERAAT_E (11995)
  G_D            92.6 dk   12861 sözcük   211 aksiyon  BERAAT_D (12110)
  G_CVYO         86.7 dk   11984 sözcük   201 aksiyon  CVYO (10760)
  G_I            86.0 dk   11879 sözcük   200 aksiyon  INDIRIM (10410)
  G_M            85.2 dk   11752 sözcük   199 aksiyon  MAHKUMIYET (9805)
  W              76.7 dk   10500 sözcük   184 aksiyon  MAHKUMIYET (8000)
  G_DUZELT       85.9 dk   12012 sözcük   192 aksiyon  BERAAT_E (10715)
  G_BILGI        88.0 dk   12215 sözcük   201 aksiyon  BERAAT_E (11445)
  G_BASKI        87.9 dk   12250 sözcük   198 aksiyon  BERAAT_E (11025)
  G_ETIK         87.6 dk   12098 sözcük   204 aksiyon  ETIK (11320)
  ==> TİPİK YOL (TIPIK): 93.0 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```

Davanın bütün metni (satırlar, yanıtlar, geri bildirimler, delil ve hüküm metinleri) ~24 500 sözcüktür.
