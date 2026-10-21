# Dava #14 "Yanık Ev" — Dava Tasarımı

> Kaynak: `content/src/yanik-ev/` (yazım kiti) → `content/cases/yanik-ev/` (`npm run case:build -- yanik-ev`).
> Hikâye kitabı: `docs/content/yanik-ev-hikaye.md`. Hukuki notlar: `docs/legal/yanik-ev.md`. Lineup: #14, ORTAK, zorluk 5.

## 1. Künye

- **Suç:** Genel güvenliği kasten tehlikeye sokma (TCK 170/1-a) ve sigorta bedelini almak maksadıyla nitelikli
  dolandırıcılığa teşebbüs (TCK 158/1-k, 35). Görevli mahkeme: Bursa 7. Asliye Ceza Mahkemesi (tek hâkim; 5235 s. K. md. 12'ye
  göre ağır cezanın görev alanına girmez). Katılan: Kalkan Sigorta A.Ş. (vekili Av. Sinan Varol).
- **Müvekkil:** Halil Bozkurt, 54, döşemeci. Tutuklu.
- **Savunmanın ekseni:** yangın bilirkişi raporu (elektrik mi, hızlandırıcı mı), numune zinciri, poliçenin zamanlaması ve
  dolaylı delillerin halatı.
- **Gerçek:** yangın 02.08'deki nötr kopukluğunun yarattığı aşırı gerilimle eski koridor buatında çıkmıştır. Hızlandırıcı izi,
  olay yerine muhafaza altındayken giren sigorta eksperi Tarık Sönmez'in önceden benzine batırılmış tenekelerinden ve sahte
  ekspertiz raporundan gelir.

## 2. Savcılığın halatı ve savunmanın ipliklere ayırması

| İplik (iddia) | Dayanak | Savunmanın cevabı | Delil / çıkarım |
|---|---|---|---|
| Hızlandırıcı | Bilirkişi raporu, laboratuvar | Numuneleri kolluk değil eksper getirdi; zemin izi molozun kaldırılmasıyla ortaya çıktı; söndürmeden sağ çıkan "taze" benzin; numunede yanma ürünü yok | ded_zincir, ded_temizlenmis, ded_taze, ded_ekilmis, ev_lab, ev_elkoyma |
| Başlangıç noktası salon | Eksper ve bilirkişi | İtfaiye: mutfak–koridor; koridor buatında eriyik bakır; V izi koridora bakıyor | ded_koken, ded_buat |
| Elektrik izi yok | Bilirkişi | Pano emanette kaldı, incelenmedi; ara kararla incelenince birincil ark | ded_pano, ev_ark, ded_elektrik |
| Benzin fişi | Cüzdandaki fiş | Jeneratör için; bidon atölyede, 4 litre dolu | ded_bidon |
| Eşyaların taşınması | Saadet ifadesi | Restorasyon sözleşmesi: odalar 15 Ocak'a kadar boşaltılacak | ded_tasima |
| Poliçenin zamanlaması | Poliçe | Kredi şartı; dain-i mürtehin bankada | ded_banka |
| Teminat artışı | Zeyilname | Acentenin kampanya araması | ded_artis, ev_cagri |
| Benzin kokusu | Saadet | İtfaiye: akaryakıt kokusu alınmadı; polis "benzin gibi mi" diye sormuş | ev_itfaiye |
| El fenerli adam | Saadet | 01.30 bekçi devriyesi | ded_fener, ev_cizelge |
| Taksir (TCK 171) alternatifi | Necati'nin keşfi (buat notu kayda savunmayla girer) | Yenileme takvimdeydi ve notu yazan usta hazır tanık; ya da dosyada nötr kopması kaydı | ded_onlem + NC_ACIL + NC_TANIK, ev_ariza / ded_notr |
| Eksperin güvenilirliği | Ekspertiz raporu | Tahkim kararı, aynı paragraf, suiistimal primi | ev_tahkim, ded_kopya |

## 3. Delil listesi

Savcılık dosyası (başlangıçta bilinen): `ev_bilirkisi`, `ev_ekspertiz`, `ev_fis`, `ev_police`, `ev_icra`, `ev_itfaiye`,
`ev_saadet_ifade`, `ev_foto`.

Savunmanın toplayacakları: `ev_cizelge` (bekçi devriye çizelgesi; INV_CEVDET), `ev_cagri` (acente çağrı kaydı; INV_KADER),
`ev_tahkim` (Sigorta Tahkim Komisyonu kararı; ARA_GULSUM), `ev_lab` (laboratuvar ham verisi; 1. celsede talep → ARA_GIRIS),
`ev_ariza` (dağıtım arıza kaydı; delil dilekçesi ya da 1. celse talebi → ARA_GIRIS), `ev_ark` (elektrik bilirkişi raporu;
pano incelemesi talebi → ARA_GIRIS), `ev_elkoyma` (savcılığın eksperin aracında el koyduğu bidon ve tenekeler; suç duyurusu
→ T_00).

İpuçları (tahta kartı): sahneler (`clue_buat`, `clue_v_izi`, `clue_moloz`, `clue_pano`, `clue_foto_tavan`,
`clue_foto_koridor`, `clue_su`, `clue_bidon`, `clue_esyalar`, `clue_restorasyon`), belgeler (`clue_numune`, `clue_gec`,
`clue_pano_yok`, `clue_taze`, `clue_eksper_foto`, `clue_koku_yok`, `clue_baslangic`, `clue_yan_ev`, `clue_dain`, `clue_banka`,
`clue_kampanya`), kişiler (`clue_necati`, `clue_cagri`, `clue_eksper_giris`, `clue_devriye`, `clue_saadet_fener`,
`clue_jenerator`, `clue_borc`), ara (`clue_piroliz`, `clue_ayni`, `clue_prim`, `clue_tv`, `clue_notr`, `clue_ark`,
`clue_teneke`). Çeldiriciler: `clue_borc`, `clue_yan_ev`, `clue_gec`, `clue_foto_koridor`, `clue_moloz` (tek başına).

Çıkarımlar (1. evre, yangın tahtası ve iplik tahtası): `ded_temizlenmis` (foto_tavan + eksper_foto), `ded_zincir` (numune + eksper_giris), `ded_pano`
(pano + pano_yok), `ded_koken` (v_izi + baslangic), `ded_buat` (buat + necati), `ded_tasima` (esyalar + restorasyon),
`ded_bidon` (bidon + jenerator), `ded_banka` (banka + dain), `ded_artis` (kampanya + cagri), `ded_taze` (taze + su),
`ded_onlem` (restorasyon + necati), `ded_fener` (saadet_fener + devriye). 2. tahta: `ded_ekilmis` (piroliz + teneke),
`ded_notr` (notr + tv), `ded_elektrik` (ark + buat), `ded_kopya` (ayni + prim).

## 4. Çapraz sorgu

Genel kural (yeniden dengeleme): çelişkiyi kuran belge, ifade önce **bastırılmadan** sunulursa çelişki kayda geçmez; ceza yok,
tanık bir açıklama kapısı bulur (`erkenSunum`, `*_ERKEN` kuralları; rapor ipucu `h_baglan`). Saadet'in S2'si bu kalıbı zaten
kullanıyordu; B1–B4, S6, U1–U3 ve U6'ya genişletildi.

**Saadet Koru (1. celse):** S1 el fenerli adam → ded_fener / ev_cizelge; S2 benzin kokusu → BASTIR, ev_itfaiye (`contra_s2`);
S3 eşyalar → ded_tasima; S4 televizyon → BASTIR (`fact_tv`); S5 "borçlu adam" → İTİRAZ (kanaat); S6 kırmızı bidon → BASTIR,
ded_bidon (`contra_s6`; hâkim kolluk tespiti ister). Savcılık delilleri (fiş, icra, ekspertiz) cezalı.

**Dr. Orhan Tezel (1. celse):** B1 başlangıç ve döküntü izi → BASTIR; ded_koken (`contra_koken`: "salonu zemindeki iz yüzünden
seçtim; o iz olmasa desen koridoru gösterir") ve ded_temizlenmis (`contra_b1`); B2 numunelerde benzin → BASTIR, ded_zincir
(`contra_b2`), ev_cizelge (kısmi); B3 elektrik izi yok → BASTIR, ded_pano (`contra_b3`) ve ded_buat (`contra_buat`: buat incelenmedi;
ustanın notu tutanağa girer), ded_koken (kısmi); B4 yoğun benzin → BASTIR, ded_taze (`contra_b4`); B5 poliçe ve borç → İTİRAZ
(uzmanlık dışı, CMK 67/3).

**Cevdet Alkan (2. celse, doğrudan soru):** CV_Q1 muhafaza → CV_Q2 arada giren (Q1'den sonra) → CV_Q3 eldeki tenekeler
(`cevdet_dinlendi`; ara evresinde CV2_CANTA gerekir). Bekçi ancak çizelge elde edildikten sonra tanık gösterilebilir (DIL_CEVDET,
T1_CEVDET).

**Tarık Sönmez (2. celse):** U1 polis izni → BASTIR, ev_cizelge (`contra_u1`); U2 molozun altında iz → BASTIR, ded_temizlenmis
(`contra_u2`); U3 numune zeminden → BASTIR, ded_ekilmis **ve** laboratuvarın kabul satırı (şahsi mühür) ile not satırı (tutanak
yok) okunmuşsa `contra_u3`; okunmamışsa kısmi (PS_U3_MUHURSUZ); el koyma tutanağı tek başına kısmi (PS_U3_E); U4 raporlarım
doğrulandı → ev_tahkim; U5 beklentim yok → ded_kopya; U6 elektrik olsaydı görürdüm → BASTIR; ark raporu (`contra_u6_ark`, raporun
linye satırı okunmuş olmalı; okunmamışsa PS_U6_OKUNMAMIS) ve nötr kopması (`contra_u6_notr`) ayrı kurallar. Üç çelişkiden sonra
kırılma (CMK 48 uyarısı, susma).

**Ek savunma (T_05):** T05_A takvim — ded_onlem ∧ "acil değil" (NC_ACIL) ∧ ustanın tanıklığa gelmeyi kabul etmesi (NC_TANIK) ∧
çöküş yok; Necati hazır tanık olarak dinlenir. T05_B dış etken — ded_notr ∧ mahkemenin ark raporu. T05_C/T05_D yanlış.

## 5. Sonuçlar

| Öncelik | Kimlik | Sınıf | Koşul | Hüküm |
|---|---|---|---|---|
| 1 | ETIK | CONVICTION | Ismarlama rapor ∧ ¬`hizlandirici_coktu` | 170/1-a + 158/1-k, 35; mütalaa dışlanır; suç duyurusu, baroya bildirim; etik kartı |
| 2 | ETIK_E | OTHER | Ismarlama rapor ∧ `kayitBeraat` | Her iki suçtan 223/2-e beraat; suç duyurusu, baroya bildirim; etik kartı; XP 0 |
| 3 | ETIK_T | RECHARACTERIZED | Ismarlama rapor ∧ `hizlandirici_coktu` (taksire kayıtta karşılık yok) | TCK 171/1-a 5 ay, erteleme; 158/1-k'den 2-e beraat; suç duyurusu, baroya bildirim |
| 4 | BERAAT_B | ACQUITTAL (223/2-b) | `kayitBeraat` ∧ eksper kırıldı ∧ `elektrik_ispat` | Beraat, tahliye, tutanak başsavcılığa |
| 5 | BERAAT_E | ACQUITTAL (223/2-e) | `kayitBeraat` | Beraat |
| 6 | TAKSIR | RECHARACTERIZED | `hizlandirici_coktu` (taksire kayıtta karşılık yok) | TCK 171/1-a: 6 ay → TCK 62 ile 5 ay; TCK 51 erteleme; 158/1-k'den beraat |
| 7 | MAHKUMIYET | CONVICTION | Varsayılan: hızlandırıcı iddiası ayakta | 170/1-a 1 yıl 6 ay + 158/1-k, 35/2: 2 yıl ve 500 gün; TCK 63 mahsup |

**Hüküm skora bağlı değildir.** Hiçbir sonuç eşik skoru istemez (eski 12.500 / 13.500 ve hâkimin kanaati ≥ 8 kaldırıldı); eşik
çubuğu tek bantlıdır ("Hüküm kayda göre"). Skor yalnızca savunmanın performansını ve XP'yi ölçer.

- `hizlandirici_coktu` = contra_b2 ∧ CV_Q2 ∧ cevdet_dinlendi ∧ contra_u1 ∧ contra_b1 ∧ contra_u2 ∧ contra_s2 ∧ contra_s6 ∧
  contra_koken ∧ contra_b3 ∧ contra_buat ∧ contra_u6_ark ∧ contra_b4 ∧ contra_u3. Bilirkişi raporunun her ayağı (zincir, zemin,
  koku, satın alınan benzin, başlangıç, elektrik dışlaması, laboratuvar) kayıtla çöker.
- `taksir_red` = taksir_cevap (T05_A ya da T05_B) ∨ contra_u6_notr ∨ dosyada ev_ariza. Mahkemenin getirttiği dağıtım kaydı,
  savunma tartışmasa da taksiri karşılar (hukuki notlar §4.17).
- `kayitBeraat` = `hizlandirici_coktu` ∧ `taksir_red`.
- `elektrik_ispat` = (ev_ark ∨ ded_elektrik) ∧ ev_ariza ∧ (contra_u6_notr ∨ taksir_dis): nötr kopmasının bu yangınla bağı duruşmada
  kuruldu.

Beraatin dayanağını mahkeme seçer: 2-b talebi kayıtla örtüşmezse 2-e beraat; 2-e talebi varken kayıt 2-b'yi taşıyorsa 2-b beraat;
terditli talep ya da duygusal savunma (T06_D) yalnızca skoru ve gerekçedeki bir cümleyi değiştirir. Dolaylı delillerin iplikleri
(`motif_coktu`: eşya, bidon, banka, artış) hükmü değil, gerekçe cümlelerini, esas savunmanın skorunu ve D_IPLIK dayanağını
etkiler (kast çöktükten sonra iplikler tek başına kastı ispatlamaz). Ismarlama rapor müvekkili cezalandırmaz: mahkeme mütalaayı
dışlar ve aynı kayıt kurallarıyla karar verir. Çöküş (`cred` 0) yargılamayı bitirmez; ikinci celsede delil sunumu kapanır
(T05_A görünmez), mütalaa, esas savunma ve son söz alınır. XP: 223/2-b 1,2 · 223/2-e 1,0 · taksir 0,85 · mahkûmiyet 0,6 · etik 0.

**Tutarlılık düzeltmesi (bu tur):** önceki sürümde nötr kopması cevabı TAKSIR/ETIK_T'de "ortak illiyet" gerekçesiyle taksir
mahkûmiyetine, BERAAT_E'de beraate götürüyordu. Artık dış etken kayıtta ise sonuç her yolda beraattir; TAKSIR ve ETIK_T
gerekçeleri "dosyada dağıtım hattına ilişkin bir kayıt yoktur, uyarıyı yapan elektrikçi de dinlenmemiştir" der.

Gün sonu kapıları (önceki turdan, değişmedi): 1. celseye (GO_H1) yalnızca son gün, eylem puanı bitince ya da yapılacak etkinlik
kalmayınca gidilir (duruşma tarihi sabit, 14 Nisan); 2. celseye (GO_T) aranın son günü bitince (ya da etkinlik kalmayınca) ve
Leyla'yla o gün konuşulduktan sonra; delil dilekçesi son gün Leyla taslağı okuduktan sonra yazılır. Bekçinin sabah sorusu
(CV_SABAH: eksper girişi, çizelge) `clue_numune` ∧ (INV_FOTO ∨ `clue_eksper_foto`) ∧ önce gece devriyesinin sorulmasını (CV_GECE)
ister; ilk ziyarette sorulamadıysa A_CEVDET2 (1 EP) açılır. Necati'ye tanıklık sorulmadan takvim kartı kurulduysa A_NECATI2
(1 EP) açılır; Leyla bunu söyler.

## 6. Node grafiği

Hikâye kitabı §4'teki harita. Soruşturma hub'ı (INV_HUB) `push`/`$return` ile çalışır; ara hub'ı (ARA_HUB) yığınsızdır,
her etkinlik doğrudan döner (kaçış uzaklığı sınırı, Dava #07 raporu §8.2).

## 7. Golden path'ler

| Ad | Sonuç | Aksiyon | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 242 | Bütün soruşturma; Necati'ye keşif, "acil miydi" ve tanıklık sorulur; 1. celsede başlangıç, zemin, zincir, pano, buat, taze benzin, koku ve bidon; pano, lab ve bekçi talebi; arada lab (üç satır), ark raporu, tahkim; suç duyurusu; bekçi Q1–Q3; U1, U2, U3, U6 (ark); Necati hazır tanık (T05_A); 2-e savunması |
| N_TIPIK_2B | BERAAT_E | 242 | Negatif: TIPIK kaydında 2-b talebi (ispatsız dayanak) → 2-e beraat, yalnızca skor düşer |
| N_TIPIK_TERDIT | BERAAT_E | 242 | Negatif: TIPIK kaydında terditli talep → 2-e beraat |
| G_B | BERAAT_B | 249 | Ayrıca arıza kaydı + ark raporu + nötr; U6'ya ark ve nötr ayrı ayrı; T05_B; 2-b savunması |
| N_KAYIT_ARIZA | BERAAT_E | 248 | Negatif (kayıt hükmü): dağıtım kaydı dosyada ama savunma taksire yanlış cevap verir (T05_C) ve nötr bağını kurmaz; 2-b ister → yine beraat, dayanak 2-e |
| G_T | TAKSIR | 226 | Hızlandırıcı iddiası bütünüyle çöker; elektrikçiye yalnızca keşif sorulur (tanıklık yok, takvim kartı yok); arıza kaydı istenmez: taksire kayıtta karşılık yok |
| G_M | MAHKUMIYET | 204 | Yüzeysel soruşturma; ark raporu gelir ama satırı okunmaz (PS_U6_OKUNMAMIS), laboratuvarın mühür satırı okunmaz (PS_U3_MUHURSUZ), T1_TARIK |
| G_ETIK_M | ETIK | 182 | G_M + ısmarlama rapor; ikinci celsede güven biter, yargılama mütalaa ve son sözle sürer |
| G_ETIK | ETIK_E | 239 | Tam soruşturma + ısmarlama rapor; Necati hazır tanık: kalan kayıt beraati taşır |
| G_ETIK_T | ETIK_T | 239 | G_ETIK ama taksire yanlış cevap (T05_C), dosyada arıza kaydı yok |
| W | TAKSIR (çöküş) | 234 | Bütün ayaklar kurulur (U1, U2, U3, U6 dahil), sonra beş yanlış sunumla güven 0; delil sunumu kapanır, T05_A görünmez; taksir |

## 8. Ölçümler (2026-10-21, yeniden dengeleme sonrası)

`npm run case:duration -- yanik-ev`:

```
  TIPIK         108.4 dk   15155 sözcük   242 aksiyon  BERAAT_E (15295)
  N_TIPIK_2B    108.3 dk   15133 sözcük   242 aksiyon  BERAAT_E (14955)
  N_TIPIK_TERDIT  108.1 dk   15106 sözcük   242 aksiyon  BERAAT_E (15205)
  G_B           109.0 dk   15138 sözcük   249 aksiyon  BERAAT_B (16255)
  N_KAYIT_ARIZA  108.9 dk   15142 sözcük   248 aksiyon  BERAAT_E (15315)
  G_T            98.0 dk   13575 sözcük   226 aksiyon  TAKSIR (13325)
  G_M            88.3 dk   12215 sözcük   204 aksiyon  MAHKUMIYET (7105)
  G_ETIK_M       82.7 dk   11608 sözcük   182 aksiyon  ETIK (5515)
  G_ETIK        106.3 dk   14826 sözcük   239 aksiyon  ETIK_E (14655)
  G_ETIK_T      105.5 dk   14689 sözcük   239 aksiyon  ETIK_T (14445)
  W             100.8 dk   13927 sözcük   234 aksiyon  TAKSIR (12525)
  ==> TİPİK YOL (TIPIK): 108.4 dk  ✓ süre hedefte
```

`node tools/content/word-count.mjs content/cases/yanik-ev`: paket 1.358 satır, 17.879 satır sözcüğü; ekran metinleriyle toplam
24.696. En uzun satır 216 karakter.

`npm run case:validate -- yanik-ev`: **PASSED — 0 hata**; 853.946 durum, 400 yürüyüş; yedi sonucun hepsine ulaşıldı; kapsam node
111/111, seçenek 219/219, kural 93/93, delil 66/66; golden path 11/11; süre ~500 sn (yük ortalaması ~4). Uyarılar:
SIMULATION_INCOMPLETE (BFS bütçesi) ve 20 SOFTLOCK_UNVERIFIED. Bütün 20 tanık durumu, eylem puanını etkinliklere harcayan ve
duruşmalara giden betikli bir kaçış politikasıyla dava sonuna ulaştı (20/20); 1.000 rastgele önek + aynı politika: 1.000/1.000
tamamlandı, takılan yok. Uyarılar doğrulayıcının kaçış aramasının (4.000 durum) hub'da eylem puanı harcamadan tahtalar arasında
dolaşmasından gelir; gerçek kilitlenme yok. (Bu tur ilk çalıştırmada Necati'nin ikinci ziyaretinde gerçek bir DEAD_END çıktı:
çıkış seçeneği ilk ziyarette harcanmıştı; NC_BITIR2 eklenerek düzeltildi.)

### Erken çözüm denetimi (her sonuç)

Sınırlı, tek süreçli arama: her golden path tohumundan delta-küçültme (48→1 boyutlu parça silme, ileri ve geri tarama, reddedilen
aksiyonları atlayan yeniden oynatma, tohum başına ≤ 60 sn), ardından ara evresinde etkinlik sırasını değiştiren bir yeniden
sıralama (tahkim etkinliğini düşürüp bekçiyi ilk güne alarak etkinlik tükenmesiyle erken çıkış) ve yeniden küçültme. Süreler
`estimateActions` ile.

| Hedef | En kısa yol | Süre | Golden path | Oran |
|---|---|---|---|---|
| BERAAT_E | 153 aksiyon | 78,7 dk | TIPIK 242 | %63 |
| BERAAT_B | 158 aksiyon | 79,2 dk | G_B 249 (TIPIK 242) | %63 (%65) |
| TAKSIR | 149 aksiyon | 74,3 dk | G_T 226 | %66 |
| ETIK_E | 153 aksiyon | 78,4 dk | G_ETIK 239 (TIPIK 242) | %64 (%63) |
| ETIK_T | 149 aksiyon | 76,1 dk | G_ETIK_T 239 | %62 |
| ETIK | 79 aksiyon | 50,2 dk | G_ETIK_M 182 | %43 |
| MAHKUMIYET | 75 aksiyon | 47,8 dk | G_M 204 | varsayılan sonuç |

Önceki tur: TAKSIR 106 aksiyon / 60,6 dk (G_T'nin %47'si), ETIK_E 129 (%54), BERAAT_E 190 (skor eşiğiyle). Skor eşikleri
kaldırıldığı hâlde beraat artık daha uzun bir zincir ister, çünkü kayıt zincirin kendisini ister: başlangıç noktası (V izi +
itfaiye), buat (ev + Necati'nin keşfi), koku (itfaiye), satın alınan benzin (atölye + Halil), mahkemenin ark raporu (1. celse
talebi + aradaki okuma), laboratuvarın mühür ve tutanak satırları (ara), eksperin girişi (çizelge, 2. celse) ve her çelişkide
önce bastırma. Taksire kayıtla karşılık da bir temel ister: notun yazarının tanıklığı ya da mahkemenin getirttiği dağıtım kaydı.

ETIK (ısmarlama raporla kasten mahkûmiyet) %60'ın altında kalır: bu bir çözüm değil, aranın ilk akşamında her oyuncuya gelen
teklifi kabul etmenin bedelidir; en kısa yolu oyunun yapısal tabanıdır (MAHKUMIYET 75 + bir seçim). Golden path'i 82,7 dk.

Tahtalar: birinci evrede iki tahta (yangın: 14 kart, 6 tarif + 2 çeldirici; iplikler: 13 kart, 6 tarif + 2 çeldirici), arada
bir tahta (13 kart, 4 tarif).
