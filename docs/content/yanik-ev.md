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
`clue_jenerator`, `clue_borc`), ara (`clue_buhar`, `clue_piroliz`, `clue_ayni`, `clue_prim`, `clue_tv`, `clue_notr`,
`clue_ark`, `clue_teneke`). Çeldiriciler: `clue_borc`, `clue_yan_ev`, `clue_gec`, `clue_foto_koridor`, `clue_moloz` (tek başına).

Çıkarımlar (1. evre, yangın tahtası ve iplik tahtası): `ded_temizlenmis` (foto_tavan + eksper_foto), `ded_zincir` (numune + eksper_giris), `ded_pano`
(pano + pano_yok), `ded_koken` (v_izi + baslangic), `ded_buat` (buat + necati), `ded_tasima` (esyalar + restorasyon),
`ded_bidon` (bidon + jenerator), `ded_banka` (banka + dain), `ded_artis` (kampanya + cagri), `ded_taze` (taze + su),
`ded_onlem` (restorasyon + necati), `ded_fener` (saadet_fener + devriye). 2. tahta (iki adımlı): `ded_yanmamis` (buhar +
piroliz: ham verinin profil ve matris satırları), `ded_ekilmis` (ded_yanmamis + teneke), `ded_notr` (notr + tv),
`ded_elektrik` (ark + buat), `ded_kopya` (ayni + prim).

Tahtalarda günde üç yanlış bağlantı hakkı vardır (`tah_yangin`, `tah_iplik`, `tah_ara`); her yanlış çift −50 skor ve bir hak
götürür, hak bitince tarifler kilitlenir ve hub kartı ertesi güne kadar kapanır. Son günde kilitlenen tahta celseye eksik delille
gitmek demektir.

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
(Q2'den sonra; `cevdet_dinlendi`; ara evresinde CV2_CANTA gerekir, o da komşunun "iki teneke" anlatımını ister: SA_ESYA ya da
1. celsede PR_S1). Bekçi ancak çizelge elde edildikten ve mahkemeye gelmeyi kabul ettikten sonra (CV_TANIK) tanık gösterilebilir
(DIL_CEVDET, T1_CEVDET).

**Tarık Sönmez (2. celse):** U1 polis izni → BASTIR, ev_cizelge (`contra_u1`); U2 molozun altında iz → BASTIR, ded_temizlenmis
(`contra_u2`); U3 numune zeminden → BASTIR, ded_ekilmis; tam çelişki (`contra_u3`) kendi temelini ister (`u3Temel`):
bilirkişinin kabulü (B2), refakatsiz giriş (CV_Q2 ya da U1), bekçinin tenekeleri (CV_Q3) ve laboratuvarın kabul (şahsi mühür)
ve not (tutanak yok) satırları; bir halka eksikse kısmi (PS_U3_MUHURSUZ) ve tanık açık halkadan kaçar; el koyma tutanağı tek başına kısmi (PS_U3_E); U4 raporlarım
doğrulandı → ev_tahkim; U5 beklentim yok → ded_kopya; U6 elektrik olsaydı görürdüm → BASTIR; ark raporu (`contra_u6_ark`, raporun
linye satırı okunmuş olmalı; okunmamışsa PS_U6_OKUNMAMIS) ve nötr kopması (`contra_u6_notr`) ayrı kurallar. Üç çelişkiden sonra
kırılma (CMK 48 uyarısı, susma).

**Ek savunma (T_05):** T05_A takvim — ded_onlem ∧ "acil değil" (NC_ACIL) ∧ ustanın tanıklığa gelmeyi kabul etmesi (NC_TANIK) ∧
çöküş yok; Necati hazır tanık olarak dinlenir. T05_B dış etken — ded_notr ∧ mahkemenin ark raporu. T05_C/T05_D yanlış.

## 5. Sonuçlar

| Öncelik | Kimlik | Sınıf | Koşul | Hüküm |
|---|---|---|---|---|
| 1 | ETIK | CONVICTION | Ismarlama rapor ∧ ¬`kast_coktu` | 170/1-a + 158/1-k, 35; mütalaa dışlanır; suç duyurusu, baroya bildirim; etik kartı |
| 2 | ETIK_E | OTHER | Ismarlama rapor ∧ `kayitBeraat` | Her iki suçtan 223/2-e beraat; suç duyurusu, baroya bildirim; etik kartı; XP 0 |
| 3 | ETIK_T | RECHARACTERIZED | Ismarlama rapor ∧ `kast_coktu` (taksire kayıtta karşılık yok) | TCK 171/1-a 5 ay, erteleme; 158/1-k'den 2-e beraat; suç duyurusu, baroya bildirim |
| 4 | BERAAT_B | ACQUITTAL (223/2-b) | `kayitBeraat` ∧ eksper kırıldı ∧ `elektrik_ispat` | Beraat, tahliye, tutanak başsavcılığa |
| 5 | BERAAT_E | ACQUITTAL (223/2-e) | `kayitBeraat` | Beraat |
| 6 | TAKSIR | RECHARACTERIZED | `kast_coktu` (taksire kayıtta karşılık yok) | TCK 171/1-a: 6 ay → TCK 62 ile 5 ay; TCK 51 erteleme; 158/1-k'den beraat |
| 7 | MAHKUMIYET | CONVICTION | Varsayılan: çekirdek kayıtta değil | 170/1-a 1 yıl 6 ay + 158/1-k, 35/2: 2 yıl ve 500 gün; TCK 63 mahsup |

**Hüküm skora bağlı değildir.** Hiçbir sonuç eşik skoru istemez; eşik çubuğu tek bantlıdır ("Hüküm kayda göre").

- `kast_coktu` (çekirdek) = contra_b2 ∧ contra_u3 ∧ (contra_u1 ∨ CV_Q2) ∧ cevdet_dinlendi. Dördü de ikinci celseye ya da araya
  bağlıdır. PS_U3 kendi temelini istediği için (`u3Temel`) `contra_u3` kayıttaysa çekirdek de kayıttadır.
- Çekirdek kayıttaysa **hiçbir yolda kasten mahkûmiyet yoktur**. Zemin (B1/U2), koku (S2), satın alınan benzin (S6), başlangıç
  (PS_B1_K), pano/buat (B3, PS_B3_BUAT), ark (U6) ve taze benzin (B4) ayakları hükmü değil gerekçe cümlelerini değiştirir; her
  biri için raporda "elinde tuttuğun ama sunmadığın" ipucu var (`h_sun_*`).
- `taksir_red` = taksir_cevap (T05_A ya da T05_B) ∨ contra_u6_notr ∨ dosyada ev_ariza. `kayitBeraat` = `kast_coktu` ∧ `taksir_red`.
- `elektrik_ispat` = (ev_ark ∨ ded_elektrik) ∧ ev_ariza ∧ (contra_u6_notr ∨ taksir_dis).

**Gerekçeler kayıtla çelişmez.** MAHKÛMİYET ve ETİK gerekçeleri (`kastGerekce`) kayıtta ne varsa onu tanır: zincirde usulsüzlük
yoksa "aykırılık kayda geçmemiştir"; eksperin teslimi, refakatsiz giriş ya da bekçinin tenekeleri kayıttaysa her biri ayrı cümleyle
tanınır ve "numunelerin olay yerine getirildiği duruşmada ileri sürülüp ortaya konmamıştır; laboratuvar bulgusu bu nedenle
hükme esas alınmıştır" denir; ark raporu dosyadaysa tartışılır. MAHKÛMİYET epilogu da zincir kayıttaysa "numunelerin kimin
elinden geldiğini söyletemedim" demez. TAKSİR ve ETİK_T gerekçesi (`taksirGerekce`) olumlu tespitlere dayanır: sanığın ek
savunmasında uyarıyı kabul etmesi (ek savunmanın iki varyantı da uyarıyı içerir), uyarıdan sonra beş hafta ve ev boşaltıldıktan
sonra enerjinin kesilmemesi, başlangıcın uyarının konusu olan hat olması; ark raporu dosyadaysa birincil ark ve panodaki aşırı
gerilim izi açıkça tartışılır. "Uyarıyı yapan elektrikçi de dinlenmemiştir" cümlesi kaldırıldı.

Beraatin dayanağını mahkeme seçer: 2-b talebi kayıtla örtüşmezse 2-e beraat; terditli talep ya da duygusal savunma (T06_D)
yalnızca skoru ve gerekçedeki bir cümleyi değiştirir. Ismarlama rapor müvekkili cezalandırmaz: mahkeme mütalaayı dışlar ve aynı
kayıt kurallarıyla karar verir. Çöküş (`cred` 0) yargılamayı bitirmez; ikinci celsede delil sunumu kapanır (T05_A görünmez),
mütalaa, esas savunma ve son söz alınır. XP: 223/2-b 1,2 · 223/2-e 1,0 · taksir 0,85 · mahkûmiyet 0,6 · etik 0.

**Delil zinciri kapıları (üçüncü inceleme).** Erken çözümü skorla değil zincirin kendisiyle kapatır:

- Bekçinin sabahı (CV_SABAH: eksperin girişi, çizelge) raporun eki (`clue_numune`) **ve** temizlenmiş zemin çıkarımı
  (`ded_temizlenmis`: 04.30 karesi + eksperin 09.40 fotoğrafı) ister; ilk ziyarette sorulamadıysa A_CEVDET2 (1 EP).
- Bekçi tanık gösterilmeden önce mahkemeye gelip gelmeyeceği sorulur (CV_TANIK; CV_SABAH'tan sonra açılır; unutulursa
  A_CEVDET2).
- Ham veri talebi (DIL_LAB) taze benzin çıkarımını (`ded_taze`: rapor + 04.30 su karesi), 1. celse talebi (T1_LAB) bu çıkarımı
  ya da bilirkişinin B4 kabulünü ister.
- Arada ham verinin iki satırı (profil → `clue_buhar`, matris → `clue_piroliz`) `ded_yanmamis`'ı, o da bekçinin tenekeleriyle
  `ded_ekilmis`'i verir. Tenekeler sorusu (CV2_CANTA) komşunun "iki teneke" anlatımını ister (SA_ESYA, raporun ekinden sonra; ya
  da 1. celsede S1 bastırılırken).
- Karar anları: 1. celsede tutukluluk beyanı (T1_TAHLIYE ya da T1_TAKDIR; CMK 108/3) alınmadan talepler kapanmaz; ikinci celseden
  önce eksper hakkında karar verilir (SC_DUYURU, SC_KENDIN, SC_BASIN ya da yeni SC_BEKLE; "sonra karar veririm" artık hakkı
  yakmaz).
- Aranın kendiliğinden gelen gelişmesi: Gülsüm Hanım tahkim kararını yanında getirir (okumak 1 EP). Acente poliçeyi okuyunca,
  Necati Usta Halil'in ilk görüşmede andığı restorasyon ekibinden bilinir.

Gün sonu kapıları (önceki turlardan): 1. celseye (GO_H1) yalnızca son gün, eylem puanı bitince ya da yapılacak etkinlik
kalmayınca gidilir; 2. celseye (GO_T) aranın son günü bitince, Leyla'yla o gün konuşulduktan ve eksper kararı verildikten sonra;
delil dilekçesi son gün Leyla taslağı okuduktan sonra yazılır. Necati'ye tanıklık sorulmadan takvim kartı kurulduysa A_NECATI2
(1 EP) açılır.

## 6. Node grafiği

Hikâye kitabı §4'teki harita. Soruşturma hub'ı (INV_HUB) `push`/`$return` ile çalışır; ara hub'ı (ARA_HUB) yığınsızdır,
her etkinlik doğrudan döner (kaçış uzaklığı sınırı, Dava #07 raporu §8.2).

## 7. Golden path'ler

| Ad | Sonuç | Aksiyon | Özet |
|---|---|---|---|
| TIPIK | BERAAT_E | 203 | Tipik oyuncu: çekirdeği eksiksiz kurar; 1. celsede zemin, başlangıç, zincir, pano, buat, taze benzin, koku, bidon; pano, lab ve bekçi talebi; arada lab (dört satır), ark raporu, tahkim; suç duyurusu; bekçi Q1–Q3; U1, U2, U3, U4, U6; Necati hazır tanık (T05_A); 2-e savunması. Yan konuları atlar |
| G_TAM | BERAAT_E | 246 | Kapsamlı yol (eski TIPIK): her konu, her kart, her çelişki |
| N_TIPIK_2B | BERAAT_E | 203 | Negatif: TIPIK kaydında 2-b talebi (ispatsız dayanak) → 2-e beraat, yalnızca skor düşer |
| N_TIPIK_TERDIT | BERAAT_E | 203 | Negatif: TIPIK kaydında terditli talep → 2-e beraat |
| G_B | BERAAT_B | 253 | Ayrıca arıza kaydı + ark raporu + nötr; U6'ya ark ve nötr ayrı ayrı; T05_B; 2-b savunması |
| N_KAYIT_ARIZA | BERAAT_E | 252 | Negatif (kayıt hükmü): dağıtım kaydı dosyada ama savunma taksire yanlış cevap verir (T05_C) ve nötr bağını kurmaz; 2-b ister → yine beraat, dayanak 2-e |
| G_T | TAKSIR | 233 | Çekirdek kurulur; elektrikçiye yalnızca keşif sorulur (tanıklık yok, takvim kartı yok); arıza kaydı istenmez; tutukluluk takdire bırakılır; eksper kararı SC_BEKLE |
| G_M | MAHKUMIYET | 206 | Yüzeysel soruşturma; ark raporu gelir ama satırı okunmaz (PS_U6_OKUNMAMIS), laboratuvarın mühür satırı okunmaz, bilirkişiye zincir sunulmaz (PS_U3_MUHURSUZ), T1_TARIK |
| G_ETIK_M | ETIK | 183 | G_M + ısmarlama rapor; ikinci celsede güven biter, yargılama mütalaa ve son sözle sürer |
| G_ETIK | ETIK_E | 245 | Tam soruşturma + ısmarlama rapor; Necati hazır tanık: kalan kayıt beraati taşır |
| G_ETIK_T | ETIK_T | 245 | G_ETIK ama taksire yanlış cevap (T05_C), dosyada arıza kaydı yok |
| W | TAKSIR (çöküş) | 240 | Çekirdek kurulur (U1, U2, U3, U6 dahil), sonra beş yanlış sunumla güven 0; delil sunumu kapanır, T05_A görünmez; taksir |

## 8. Ölçümler (2026-10-21, üçüncü inceleme sonrası)

`npm run case:duration -- yanik-ev`:

```
  TIPIK          96.5 dk   13724 sözcük   203 aksiyon  BERAAT_E (12985)
  G_TAM         110.6 dk   15486 sözcük   246 aksiyon  BERAAT_E (15695)
  N_TIPIK_2B     96.6 dk   13725 sözcük   203 aksiyon  BERAAT_E (12645)
  N_TIPIK_TERDIT   96.4 dk   13698 sözcük   203 aksiyon  BERAAT_E (12895)
  G_B           110.5 dk   15341 sözcük   253 aksiyon  BERAAT_B (16655)
  N_KAYIT_ARIZA  111.2 dk   15473 sözcük   252 aksiyon  BERAAT_E (15715)
  G_T           100.9 dk   13966 sözcük   233 aksiyon  TAKSIR (13735)
  G_M            89.8 dk   12452 sözcük   206 aksiyon  MAHKUMIYET (7525)
  G_ETIK_M       83.7 dk   11768 sözcük   183 aksiyon  ETIK (5635)
  G_ETIK        108.8 dk   15167 sözcük   245 aksiyon  ETIK_E (15065)
  G_ETIK_T      108.4 dk   15107 sözcük   245 aksiyon  ETIK_T (14855)
  W             103.7 dk   14337 sözcük   240 aksiyon  TAKSIR (12935)
  ==> TİPİK YOL (TIPIK): 96.5 dk  ✓ süre hedefte
```

TIPIK artık kapsamlı değil tipik bir oyuncunun yoludur (203 aksiyon, 13.724 sözcük); her şeyi yapan yol G_TAM olarak korunur
(246 aksiyon, 110,6 dk). `node tools/content/word-count.mjs content/cases/yanik-ev`: paket 1.392 satır, 18.455 satır sözcüğü;
ekran metinleriyle toplam 26.182. En uzun satır 216 karakter (tahta açıklamaları ikiye bölündü).

`npm run case:validate -- yanik-ev`: **PASSED — 0 hata**; 847.148 durum, 400 yürüyüş; yedi sonucun hepsine ulaşıldı; kapsam node
111/111, seçenek 221/221, kural 95/95, delil 68/68; golden path 12/12; süre ~521 sn (yük ortalaması ~5). Uyarılar:
SIMULATION_INCOMPLETE (BFS bütçesi) ve 20 SOFTLOCK_UNVERIFIED. Bütün 20 tanık durumu, eylem puanını etkinliklere harcayan ve
duruşmalara giden betikli bir kaçış politikasıyla dava sonuna ulaştı (20/20); 400 rastgele önek + aynı politika: 400/400 tamamlandı,
takılan yok. Uyarılar doğrulayıcının kaçış aramasının (4.000 durum) hub'da eylem puanı harcamadan tahtalar arasında dolaşmasından
gelir; gerçek kilitlenme yok.

### Erken çözüm denetimi (her sonuç)

Sınırlı, tek süreçli arama (her hedef için ≤ 4 dk): o sonuca giden her golden path tohumundan ve TIPIK, G_T, G_ETIK, G_M'den
ileri delta-küçültme (32→1 boyutlu parça silme, reddedilen aksiyonları atlayan yeniden oynatma, tohum başına 10–20 sn); ardından
isteğe bağlı talep zincirleri düşürülerek (pano talebi, arıza talebi, Gülsüm'ün sonucu sorusu) ara evresindeki etkinlik
bloklarının bütün sıralamaları (gün sınırını aşmak için) ve yeniden küçültme. Süreler `estimateActions` ile.

| Hedef | En kısa yol | Süre | TIPIK (203) oranı | Kendi golden path'i |
|---|---|---|---|---|
| BERAAT_E | 131 aksiyon | 71,8 dk | %64,5 | TIPIK 203 |
| BERAAT_B | 141 aksiyon | 75,9 dk | %69,5 | G_B 253 |
| TAKSIR | 125 aksiyon | 67,4 dk | %61,6 | G_T 233 |
| ETIK_E | 132 aksiyon | 72,5 dk | %65,0 | G_ETIK 245 |
| ETIK_T | 125 aksiyon | 69,6 dk | %61,6 | G_ETIK_T 245 |
| ETIK | 85 aksiyon | 53,3 dk | %41,9 | G_ETIK_M 183 (83,7 dk) |
| MAHKUMIYET | 86 aksiyon | 53,8 dk | varsayılan sonuç | G_M 206 (89,8 dk) |

En kısa beraat ve taksir yolu, numunenin getirildiğini kuran zincirin tamamını yürür: raporun eki ve iki fotoğraf (temizlenmiş
zemin çıkarımı) → bekçinin sabahı ve mahkemeye gelme sözü → taze benzin çıkarımıyla ham veri talebi → 1. celsede bilirkişiye
numunelerin kimden geldiğini söyletme (B2) ve tutukluluk beyanı → arada ham verinin dört satırı, iki adımlı çıkarım, bekçinin
tenekeleri (komşunun anlatımıyla açılır), Gülsüm Hanım'ın getirdiği karar ve eksper kararı → 2. celsede bekçiye Q1–Q3 ve
eksperle U3 yüzleşmesi. Beraat buna taksire kayıtla bir karşılık ekler (dağıtım kaydı ya da notun yazarı). Skor eşiği yoktur.

ETIK ve MAHKUMIYET mahkûmiyettir, çözüm değildir: ETIK aranın ilk akşamında her oyuncuya gelen teklifi kabul etmenin bedelidir;
golden path'leri 60 dakikanın üstündedir (83,7 ve 89,8 dk).

Önceki tur (14 ayaklı yüklem, kapsamlı TIPIK 242): en kısa beraat 153 aksiyon (%63) ama tek bir ayak eksik kalınca kasten
mahkûmiyete düşen bir uçurumla. Çekirdeğe geçişte uçurum kalktı; zincir kapıları ve tipik yolun tipik oyuncuya indirilmesiyle oran
%60'ın üstünde tutuldu.

Tahtalar: birinci evrede iki tahta (yangın: 14 kart, 6 tarif + 2 çeldirici; iplikler: 13 kart, 6 tarif + 2 çeldirici), arada
bir tahta (15 kart, 5 tarif, biri iki adımlı). Her tahtada günde üç yanlış bağlantı hakkı.
