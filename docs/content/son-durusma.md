# Dava #15 "Son Duruşma" — Dava Tasarımı

> Kaynak: `content/src/son-durusma/` (yazım kiti) → `content/cases/son-durusma/` (`npm run case:build -- son-durusma`).
> Hikâye kitabı: `docs/content/son-durusma-hikaye.md`. Hukuki notlar: `docs/legal/son-durusma.md`. Lineup: `docs/content/lineup.md` #15.
> Rütbe şartı ORTAK · zorluk 5/5 · üç celse, iki ara evre · dizi finali (Leyla'nın ters çerçevesi).

## 1. Logline ve tema

- **Tek cümle:** Mudanya'daki bir meyhanenin sahibi ofisinde bıçaklanır; bıçak aşçı yardımcısı Emir'in, baş tanık onu elinde
  bıçakla kaçarken görmüştür; Emir'in babası yirmi iki yıl önce Leyla Erdem'in "ikrar et" dediği müvekkildir — ve gerçek
  fail davanın baş tanığı, maktulün ortağı Tarık Sezer'dir.
- **Dramatik soru:** Bir avukat, mentorunun yirmi iki yıl önce yaptığı hatayı (kolay yol: ikrar) tekrar etmeden bir çocuğu
  kurtarabilir mi?
- **Tema:** okunmamış satırlar. Polis bir tanığa yalnızca bir soru sordu; savcı bir mesajı yarıda kesti; Leyla 2004'te
  tutanaktaki üçüncü adı okumadı; Kemal bir sesli mesajı dinlemedi; Emir bir mektubu almadı.
- **Ton:** noir dram; şubat–mart, Bursa ve Mudanya; yağmur, iskele, neonun yanmayan I harfi.

## 2. Gerçek ve kronoloji

Ayrıntılı tablo hikâye kitabı §2'de. Özet:

| Zaman | Olay | Oyuncu nasıl öğrenir |
|---|---|---|
| 2004 | Görükle'deki öğrenci evinde esrar ve terazi; evde Kemal, Ercan ve "misafir" Tarık. Kemal ikrar etti, dört yıl yattı. | BR_00–BR_01B; ARA2 çerçeve; 2004 arşivi (ev_arsiv) |
| 10.11 21.14 | Emir: "…hesabını soracağım. Neden yaptığını yüzüne soracağım." | INV_TEL (büyüteç) |
| 12.11 | Şefin "bıçaklar bileylensin" talimatı; Emir taş alır. | INV_MUTFAK tahta, INV_EV taş, INV_TEL şef mesajı |
| 14.11 22.47 | Ercan → Emir: "Kapanıştan sonra ofise uğra." | INV_TEL (karşılaştır) |
| 23.12 | Nişan fotoğrafı: Tarık lacivert gömlekli. | ARA_CANSU |
| 23.25 | Tarık, Cansu'yu erken gönderir. | INV_NURI, ARA_CANSU |
| 23.35 | "Babamın hayatını çaldın!" | dosya (Süleyman'ın ifadesi) |
| 23.40 | Emir arka kapıdan elleri boş, önlüksüz çıkar. | INV_SULEYMAN, H1 S3–S4 |
| 23.44.10 | DVR'ın fişi çekilir. | ARA_DVR (dilekçe) |
| 23.48.11 | Z raporu basılır. | ARA_Z (dilekçe) |
| 23.52.40 | Emir'in kartı İskele'de 1/M otobüsünde. | ARA_KENT (dilekçe) |
| 23.58.07 | Ercan Kemal'e sesli mesaj: "Kapıda biri var. Gel, otur." | INV_HTS → INV_KEMAL → bilirkişi (ARA_SESLI) |
| ~00.00 | Tarık, Emir'in bıçağıyla Ercan'ı öldürür, mektubu alır, gömleği değiştirir. | ARA_EMANET iz yazısı, ded_gomlek, T3 |
| 00.16 | Tarık 112'yi arar. | dosya |

## 3. Kadro

Hikâye kitabı §1. Yeni sprite'lar satır içi (`sprites.ts`): `sd_kemal`, `sd_tarik`, `sd_cansu`, `sd_gulay`. Ortak sprite'lar:
avukat_cubbe, mentor, muvekkil (Emir), anne (Meral), hakim, uye_hakim, savci, mubasir, gardiyan (Cemil), bora (Şef Nuri),
bilirkisi (Dr. Ilgaz), huseyin (Süleyman), tanik (Ercan), polis.

## 4. Delil zinciri

| Kimlik | Ad | Tür | Keşif | Neyi çürütür / destekler | Sunulabilir |
|---|---|---|---|---|---|
| ev_tarik_ifade | Tarık'ın kolluk ifadesi | EVIDENCE (savcılık) | başta | 23.55, bıçak, kan, sayım, kamera | evet (S2/S4'te karşılaştırma) |
| ev_bicak, ev_mesaj_pzt, ev_suleyman_ifade, ev_tas_fis, ev_otopsi | savcılık delilleri | EVIDENCE | başta | — | evet (cezalı kurallar) |
| ev_olay_foto, ev_hts, ev_tel_rapor | dosya | EVIDENCE | başta | sahne, belge kaynakları | evet (kısmi / cezalı) |
| ev_kentkart | Kentkart dökümü | EVIDENCE | dilekçe/H1 talebi → ARA girişi | T1 (23.55) | evet |
| ev_dvr | DVR raporu | EVIDENCE | dilekçe/H1 → ARA | T4 (kamera arızalı) | evet |
| ev_z | Z raporu | EVIDENCE | dilekçe/H1 → ARA | T3 (sayım) | evet |
| ev_sesli | sesli mesaj raporu | EVIDENCE | Kemal'in rızası + dilekçe → ARA / ARA2 | T2, R2 | evet |
| ev_cansu_foto | nişan fotoğrafı | EVIDENCE | ARA_CANSU | T6, R1 | evet |
| ev_iz_yazisi | not bloğu tutanağı | EVIDENCE | ARA_EMANET (yan ışık) | T5, R4 | evet |
| ev_arsiv | 2004 arama tutanağı | EVIDENCE | ARA2 dilekçe → 3. celse girişi | R3 | evet |
| clue_* (31) | tahta kartları | CLUE | sahneler, belgeler, görüşmeler | çıkarımlar | hayır |
| ded_davet, ded_bileme, ded_niyet | tasarlamanın üç ayağı | INSIGHT | tahta | tasarlama (T0) | davet/bileme evet, niyet dayanak |
| ded_onluk, ded_bicak_yeri, ded_saat | tanığın çıkış anlatımı | INSIGHT | tahta | S2/S4, T1/T2 | evet |
| ded_kasa, ded_kamera, ded_yol, ded_gomlek, ded_mektup | ara evre çıkarımları | INSIGHT | ara tahtası | T3, T4, T1, T6/R1, T5/R4 | evet |
| ded_canli | maktul 23.58'de yaşıyordu | INSIGHT | ara tahtası (sesli + Kentkart) | T2, R2; 2-b | evet |

**Tahta tarifleri (13 + 4 çeldirici):** DAVET (davet+dolandı) · BILEME / BILEME2 (tahta+taş / tahta+çanta) · NIYET (mesajın
tamamı+kavga) · ONLUK · BICAK · SAAT · KASA · KAMERA · YOL / YOL2 · CANLI · GOMLEK · MEKTUP; çeldiriciler: rakı+son arama,
boks+mesaj, beyaz+önlük, durak kamerası+davet.

**Gecikmeli teslimler:** Kentkart / DVR / Z / sesli mesaj — INV dilekçesi (`dil_*`) ya da H1 sözlü talep (`h1_*`) → ARA_GIRIS_1;
ARA ek dilekçesi (`ara_dil_*`) → ARA_SON_1 (sesli mesaj → ARA2_G0); arşiv (`arsiv_talep`) → T3_00G_1.

## 5. Çelişkiler (çapraz sorgu)

- **Süleyman (H1, S1–S5):** S1 bastır → kâğıt sesi; S2 bastır → dolmuş 23.45; S2'ye ev_tarik_ifade/ded_saat → contra_s2;
  S3 bastır → S4 açılır ("elinde bir şey yoktu"); S4'e ev_tarik_ifade/ded_onluk/ded_bicak_yeri → contra_s4 (ev_olay_foto kısmi);
  S5 kanaat itirazı. İkisi birden → H1_03K ("kimse sormadı").
- **Tarık (H2, T0–T6):** T0 ded_davet/ded_bileme + duyum itirazı; T1 ded_yol/ev_kentkart/ded_saat; T2 ded_onluk/ded_bicak_yeri/
  ded_canli/ev_sesli; T3 ev_z/ded_kasa (uyarıldıysa kısmi ikna); T4 ev_dvr/ded_kamera; T5 ded_mektup/ev_iz_yazisi; T6 (T3 bastırılınca)
  ded_gomlek/ev_cansu_foto. Üç çelişki → T2_02K ("saatler karışmış olabilir"). T5 bastırılınca "Gemlik" sürçmesi.
- **Tarık yeniden (H3, R1–R4):** R1 ded_gomlek; R2 ev_sesli/ded_canli; R3 ev_arsiv; R4 ded_mektup. Dört beyanın dördü de
  önce bastırılıp (tanığa açıklama fırsatı) sonra kendi kâğıdıyla çürütülünce → T3_01K (CMK 48 ile susma; arama kararı
  çıktıysa savcılığın bulduğu gömlekte kan izi ve gözaltı; Başsavcılık bulgusu skoru en az +1.000, son skoru en az
  11.600'e çeker, böylece çubuk hükümle aynı bandı gösterir). Kontrol hem bastırma hem sunum kuralında yapılır.

## 6. Sonuçlar

| Öncelik | Kimlik | Sınıf | Koşul | Ceza | XP |
|---|---|---|---|---|---|
| 1 | IKRAR_BERAAT | ACQUITTAL 223/2-e (etik kartlı) | `sahte_ikrar` ∧ fail_belli | — (tahliye) | 0,4 |
| 2 | IKRAR | OTHER (etik) | `sahte_ikrar` ∧ ¬fail_belli | 12 yıl 6 ay (81/1 + 29 + 62) | 0 |
| 3 | BERAAT_B | ACQUITTAL 223/2-b | ¬çöküş ∧ alibi_tam ∧ fail_belli ∧ ikna ≥ 8 ∧ final ≥ 12.500 | — | 1,2 |
| 4 | BERAAT_E | ACQUITTAL 223/2-e | ¬çöküş ∧ ((tanik_coktu ∧ (tasarlama_coktu ∨ lehe2) ∧ ikna ≥ 6 ∧ final ≥ 11.000) ∨ fail_belli) | — | 1,0 |
| 5 | INDIRIM | RECHARACTERIZED | ¬çöküş ∧ tahrik dayanağı (`arg_tahrik`) ∧ tasarlama_coktu ∧ final ≥ 3.500 | 12 yıl 6 ay (81/1 + 29 + 62/1) | 0,85 |
| 6 | MAHKUMIYET | CONVICTION | ¬tasarlama_dustu | ağırlaştırılmış müebbet → 62/1 müebbet | 0,6 (çöküş 0,3) |
| 7 | NITELIK | RECHARACTERIZED (varsayılan) | — (tasarlama düştü, beraat ve tahrik yok) | 25 yıl (81/1 müebbet → 62/1) | 0,7 |

**Etik sonu delilin önüne geçmez.** Sahte ikrardan sonra gerçek fail ortaya çıkarsa (Başsavcılık gömleği bulmuş, tanık son
celsede susup gözaltına alınmışsa) savcı ikrara itibar etmeden 223/2-e beraat ister ve mahkeme ikrarı hükme esas almaz
(IKRAR_BERAAT; etik kartı ve Leyla'nın çerçevesi kalır). Arama yapılmış ama tanık salonda çökmemişse savcı ikrarı
mütalaasına dayanak yapmaz, yine de 81/1 + 29 ister; IKRAR gerekçesi soruşturmanın sonuçlanmadığını yazar ve katılanın
koridordaki sorusu buna göre değişir. Sahte ikrar yolunda ikinci celsede tutukluluk "sanığın ikrarı ve beklenen ceza"
gerekçesiyle devam eder (sanık bu yolda hiç tahliye edilmez). Mahkemenin bilmediği öneri gerekçede değil, Deniz'in iç
sesinde ve etik kartındadır.

**Çöküş.** Çöküşte mütalaa T_COKUS_MUT'tan okunur ve savcı beraat istemez; NITELIK gerekçesi "beraat yönündeki mütalaa"
cümlesini ancak çöküş yokken ve savcı gerçekten beraat istediyse kurar, çöküşte "savcının 81/1 mütalaası doğrultusunda"
yazar. Arama yapılmışsa çöküş mütalaası Başsavcılığın tanık hakkındaki soruşturmasının sürdüğünü, kriminal raporun
gelmediğini söyler; MAHKUMIYET/NITELIK/IKRAR gerekçeleri de mahkemenin dosyada olmayan bir sonucu hükme esas
alamayacağını yazar.

**Tahta cezası sınırlı.** Yanlış çift başına −50, iki tahtada toplam en çok 6 kez (−300); belge ve olay yeri ıskaları zaten
hak sayaçlarıyla sınırlı. Böylece tıklama hatası tanığın çöktüğü, savcının beraat istediği bir dosyayı 25 yıla çeviremez
(tipik yol + 200 yanlış çift → BERAAT_E 12.420).

**Hüküm kapanış etiketine değil delile bağlıdır.** Mahkeme ne savunmanın talebiyle ne iddianamedeki vasıfla bağlıdır (CMK
225/2, 217): esas savunmada hangi talep seçilirse seçilsin (beraat, şüphe, terdit, duygu), beraatin koşulları kâğıtlar,
ikna ve skordur; S_DUYGU yalnızca skor ve ikna kaybettirir. `tasarlama_dustu` = (¬çöküş ∧ tasarlama_coktu) ∨ contra_t0
(çöküşte heyetin önünde mesajın tamamı okunmuşsa): tasarlaması düşen bir dosyada 82/1-a hiçbir yolda uygulanmaz; tahrik
dayanağı kurulmamışsa ya da skor 3.500'ün altındaysa sonuç 81/1 + 62/1'dir (NITELIK). Mahkûmiyet hükümlerinde (INDIRIM,
NITELIK, MAHKUMIYET, IKRAR) tutukluluk kararı tek bir karar olarak epilogda okunur: tahliye edilmişse hükümle birlikte
tutuklama, değilse tutukluluğun devamı. Gerekçeler koşulludur: tanığın çöktüğü dosyada "tanık beyanı" gerekçe olarak
kullanılmaz, savcının beraat istediği dosyada mütalaaya neden itibar edilmediği yazılır, `alibi_tam` varken üye hâkimin
karşı oyu eklenir; MAHKUMIYET ve BERAAT_E epiloglarında Tarık'ın koridordan çıkışı `fail_belli`ye göre değişir.

Yüklemler: `tasarlama_sarsildi` (bir ayak), `tasarlama_coktu` (iki ayak), `tanik_celiski` (S2 ∨ S4), `tarik_sarsildi` (≥3 T),
`tanik_coktu` (tarik_sarsildi ∨ S2/S4/R1/R4'ten en az üçü: tek celsedeki iki çelişki yetmez), `lehe2`, `alibi_tam` (ded_canli ∧ (ded_yol ∨ ev_kentkart)), `arama` (arama_karari ∧ ¬yüzleşme; `arama_karari` ARA2_BILDIR'e girişte ded_canli ∧ ded_mektup ∧ ded_gomlek ∧ tarik_sarsildi ∧ fact_mektup_emir ∧ (fact_fatura ∨ fact_hesaplar) ise kalkar: savcı arama kararını ancak aranacak eşya, mektubun 23.40'ta masada kaldığını söyleyen sanığın anlatımı, tanık için bir sebep ve ikinci celse tutanağındaki çöküşle ister), `fail_belli` (tarik_ifsa ∧ arama). Bildirim daha zayıf bir dosyayla yapılırsa savcı soruşturma açar ama arama yaptırmaz (ARA2_BILDIR'de dört ayrı metin; biri "masa ve sebep eksik"). Emanetteki not bloğunun incelenmesi (A_EMANET) Leyla'ya danışılıp CMK 153/4 yolunun öğrenilmesine (AL_EMANET, `emanet_izin`) bağlıdır; kilitliyken sebebi görünür.
Etik sayaç: SK_BICAK, CK_IS, AKS_EVET, AR_NOT (+1), AE_IKRAR (+2). XP etikte yarıya iner.

## 7. Skor

- Kategoriler ve döküm satırları: Delil toplama (ARAŞTIRMA + DELİL ANALİZİ, `key` etiketli 22 delil) · Çapraz sorgu ·
  İtiraz isabeti (`legal_hits`/9) · Savunma · Hatalı delil (`wrong`). Güvenilirlik bonusu ♥ × 100.
- Strateji çarpanı yalnızca uyumlu esas savunmada: Masumiyet ×1,5 (S_MASUMIYET) · Tasarlama ×1,2 (S_SUPHE) · Terdit ×0,8.
- Eşik çubuğu: Mahkûmiyet 0 · Farklı nitelendirme 3.500 · Beraat 11.000 (sonuç eşikleriyle aynı); B ayrıca 12.500.
- Tutarlar: nesne +10…+60 / ıska −10; belge +100/+150, yanlış alet −20; tarif +300 (CANLI +400), yanlış çift −50 (toplam en çok 6); BASTIR +25;
  sunum +200/+300 (R2 +400), kısmi +150; yanlış −150 ♥−1; usul +40…+120, dayanaksız −50 ♥−1; dayanak +60/−40; esas savunma
  150–300 (çarpanlı); etik −50…−200.

## 8. Node grafiği

Hikâye kitabı §3. Soruşturma hub'ı push/`$return`; iki ara hub'ı yığınsız (`retarget`, doğrudan dönüş). Koşullu parçalar
DECISION zincirleriyle (INV_GECE_1…5, H1_00G_*, H1_03S*, ARA_GIRIS_*, ARA_SON_1…5, T2_00G_*, ARA2_G0, T3_00G_1…5, T3_00I,
T3_04G). Tekrarlayan ceza kuralları `maxUses`; iki tahtadaki tarifler `IF ¬hasEvidence` ile yalnızca ilk kurulumda puanlı.

## 9. Golden path'ler

| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| G1 | BERAAT_B | 14.795 | Masumiyet; HTS → Kemal → sesli mesaj korunur ve bilirkişiye gider; ara evrede bütün kayıtlar, Leyla'dan emanet yolu; arşiv + savcılığa bildirim (arama kararı); son celsede R1–R4 bastır + göster → tanık susar, gözaltı |
| TIPIK | BERAAT_E | 12.720 | Tasarlamayı çürüt; sesli mesaj yolu yok; tanık ikinci celsede çöker; arşiv istenir ama bildirim yapılmaz |
| G1_TERDIT | BERAAT_B | 14.645 | G1, esas savunmada terditli talep: hüküm yine 2-b |
| G3 | INDIRIM | 7.860 | Terditli; tipik soruşturma, kısa ara, zayıf çapraz sorgu (tanık çökmez); esas savunmada tahrik |
| G6 | NITELIK | 7.760 | G3, tahrik dayanağı yerine kâğıtsız bir fail iddiası: tasarlama düşer, tahrik yok → 81/1 + 62/1 = 25 yıl |
| TIPIK_TERDIT | BERAAT_E | 12.630 | Tipik yol, esas savunmada terditli talep: hüküm yine 2-e |
| TIPIK_DUYGU | BERAAT_E | 12.430 | Tipik yol, esas savunmada duygusal çağrı: skor ve ikna kaybı, hüküm yine 2-e |
| G4 | MAHKUMIYET | 550 | Dağınık soruşturma, sert tonlar, tanığa söz ezberletme, menfaat vaadi, yüzleşme, dayanaksız savunma |
| G5 | IKRAR | 12.320 | Tipik yol; Kemal'in önerisi Emir'e taşınır, Emir ikinci celsede sahte ikrar eder; tutukluluk sürer |
| G5_IFSA | IKRAR_BERAAT | 14.395 | G1 + sahte ikrar: arama, tanığın susması ve gözaltı; savcı ikrara itibar etmez, beraat (2-e), etik kartı kalır |
| W_ARAMA | NITELIK (çöküş) | 10.715 | G1 son celseye kadar (arama kararı çıkmış); tanığa art arda savcılık delili, ♥0; savcı soruşturmanın sürdüğünü söyleyip 81/1 ister; gerekçe kriminal raporun dosyada olmadığını yazar |
| W | MAHKUMIYET (çöküş) | 7.490 | Tipik yol ikinci celseye kadar; baş tanığa art arda savcılık delili, ♥0 → başkan talepleri CMK 206 ile reddeder, delil tartışmasını kapatır; mütalaa, kısa esas savunma (T_COKUS_SAV) ve son söz alınır, sonra hüküm |

## 10. Erken çözüm denetimi

Ölçüm (2026-10-21, ikinci inceleme düzeltmelerinden sonra): açgözlü delta en küçükleme (golden path'ten 1/4 uzunluktan
başlayıp yarıya inen aksiyon parçaları silinir; motorun reddettiği aksiyonlar atlanarak yeniden oynatılır, hâlâ bir
beraate — BERAAT_B, BERAAT_E ya da IKRAR_BERAAT — ulaşan en kısa kabul edilmiş dizi tutulur), ardından ikili silme geçişi.
Tek süreç, her koşu 6–22 sn.

- **`fail_belli` yolu** (arama_karari ∧ tarik_ifsa ∧ ¬yüzleşme şartıyla; G1 ve G5_IFSA'dan): **143 aksiyon**, BERAAT_E,
  final 11.770 (TIPIK 226; oran **0,633**; hedef ≥ 0,60). İkili geçiş kısaltamadı.
- **Kısıtsız** (TIPIK, G1, TIPIK_TERDIT'ten): 178 / 185 / 182 aksiyon (oran 0,79), hepsi final 11.005 ile BERAAT_E.

İnceleme bulgusu: önceki sürümde `fail_belli` yolu 133 aksiyonla (oran 0,588) beraate iniyor ve 7.825 skorla çubukta
"Farklı nitelendirme" bandında kalıyordu; önceki ölçüm (176) `fail_belli` yolunu ayrıca denememişti. Düzeltmeler:
(1) arama kararı ayrıca sanığın "zarfı masada bıraktım" anlatımını (TP_MEKTUP) ve tanık için bir sebebi (CQ_PERSEMBE ya da
GQ_TAZIYE→GQ_TARIK) ister; (2) emanetteki not bloğu ancak Leyla'dan CMK 153/4 yolu öğrenilince incelenir (A_LEYLA →
AL_EMANET); (3) tanık son celsede dört beyanın dördünde bastırma + sunumla susar (önceden R2 ∧ R3 ∧ (R1 ∨ R4), bastırmasız);
(4) Başsavcılık bulgusu ve susma skoru en az 11.600'e çeker, böylece en kısa `fail_belli` yolu da çubukta "Beraat"
bandındadır. Bu en kısa yol hâlâ Leyla danışmalarının çoğunu, INV_EV'i, Emir'in birinci celsedeki sorgusunu, ARA_EMIR,
ARA_DURAK ve ARA2_AILE'yi atlar; ama sesli mesaj zinciri, Kentkart, iki tahtadaki dört çıkarım, garsonun fotoğrafı,
katılanla iki konuşma, emanet incelemesi, ikinci celsede üç çelişki, arşiv talebi, bildirim ve son celsede sekiz
hamle zorunludur.

Tipik yolun bütün görünür metni (2026-10-21, 1.320 satır, seçenekler dâhil) yeniden döküldü ve tarandı; yeni satırlar
(Leyla'nın emanet açıklaması, T0/T5 bastırma metinleri, mutfak masası sahnesi, son celse koridoru) faile işaret etmez. Soğuk açılış saat vermez (kart "GECE"), DVR'ın
ışığı yalnızca bir eşya olarak görünür (sönmesi gösterilmez), 112 araması nitelenmez; Leyla'nın 2. gün satırı tanığı
nitelemeden yöntemi anlatır; kare 44 ve ifade metni yansızdır; Tarık'ı sahneye getiren seçenek ve ara evredeki gece ziyareti
sesli mesajın sözlerini tekrarlamaz. Tarık Sezer'in fail olduğu, ikinci celsedeki çelişkilerden ve ara evredeki kayıtlardan
önce söylenmez; erken ayrıntılar (şeridin dışındaki beyaz gömlek, erken gönderilen garson, "kamera arızalıydı", bileği
taşını bilmesi, Süleyman'a "gördüğünü söyle") yalnızca tohumdur. Sesli mesajın "kapıda biri var" cümlesi bir ad vermez;
yalnızca Kemal yolunu kat eden oyuncuya, bir kayıtla, gelir; Deniz o kaydı olmayan oyuncu için mahkemede alıntılamaz.

Puanlı seçenek setleri (21) uzunluk ve üslup bakımından dengelendi: doğru seçenek yalnızca 3 sette en uzun etikettir
(%14; hedef ≤ %40); tahliye, tanıklık ve esas savunma setlerinde yanlış seçenekler de teknik ve makul.

## 11. Süre ve sözcük ölçümü

`npm run case:duration -- son-durusma` (2026-10-21, ikinci inceleme düzeltmelerinden sonra):

```
  G1            100.8 dk   14076 sözcük   226 aksiyon  BERAAT_B (14795)
  G1_TERDIT     100.7 dk   14057 sözcük   226 aksiyon  BERAAT_B (14645)
  G3             83.5 dk   11640 sözcük   188 aksiyon  INDIRIM (7860)
  G6             83.3 dk   11618 sözcük   188 aksiyon  NITELIK (7760)
  G4             71.0 dk   10041 sözcük   152 aksiyon  MAHKUMIYET (550)
  G5             97.8 dk   13522 sözcük   227 aksiyon  IKRAR (12320)
  G5_IFSA       100.7 dk   14033 sözcük   227 aksiyon  IKRAR_BERAAT (14395)
  W_ARAMA        96.0 dk   13346 sözcük   219 aksiyon  NITELIK (10715)
  W              78.1 dk   10682 sözcük   188 aksiyon  MAHKUMIYET (7490)
  TIPIK_TERDIT   97.7 dk   13519 sözcük   226 aksiyon  BERAAT_E (12630)
  TIPIK_DUYGU    97.6 dk   13506 sözcük   226 aksiyon  BERAAT_E (12430)
  TIPIK          97.8 dk   13530 sözcük   226 aksiyon  BERAAT_E (12720)
  ==> TİPİK YOL (TIPIK): 97.8 dk  ✓ süre hedefte
  ==> KAPI: ✓ GEÇTİ
```

Doğrulama: varsayılan komut `npm run case:validate -- son-durusma` → **PASSED**, 0 hata; kapsam node 126/126, seçenek
242/242, kural 93/93, delil 56/56; 7/7 sonuç; 12/12 golden path; tek uyarı SIMULATION_INCOMPLETE (uzun davada beklenir).
Süre 67,7 sn.
