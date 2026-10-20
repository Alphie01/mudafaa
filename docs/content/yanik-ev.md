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
| Taksir (TCK 171) alternatifi | Necati'nin keşfi | Yenileme takvimdeydi; yangının sebebi dış etken (nötr kopukluğu) | ded_onlem, ded_notr |
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

**Saadet Koru (1. celse):** S1 el fenerli adam → ded_fener / ev_cizelge; S2 benzin kokusu → BASTIR (polisin sorusu), ev_itfaiye;
S3 eşyalar → ded_tasima; S4 televizyon → BASTIR (yangından önce; `fact_tv`); S5 "borçlu adam" → İTİRAZ (kanaat); S6 kırmızı
bidon → ded_bidon. Savcılık delilleri (fiş, icra, ekspertiz) cezalı.

**Dr. Orhan Tezel (1. celse):** B1 salon zemininde döküntü izi → ded_temizlenmis (tam), ded_koken (kısmi); B2 numunelerde benzin
→ ded_zincir (tam), ev_cizelge (kısmi); B3 elektrik izi yok → BASTIR, ded_pano (tam), ded_buat (kısmi); B4 yoğun benzin →
ded_taze; B5 poliçe ve borç → İTİRAZ (uzmanlık dışı, CMK 67/3).

**Tarık Sönmez (2. celse):** U1 polis izni → ev_cizelge; U2 molozun altında iz → ded_temizlenmis; U3 numune zeminden →
ded_ekilmis / ev_elkoyma (tam), ev_lab / ded_taze (kısmi); U4 raporlarım doğrulandı → ev_tahkim; U5 beklentim yok → ded_kopya;
U6 elektrik olsaydı görürdüm → iki ayrı kural: ark (ev_ark / ded_elektrik → `contra_u6_ark`) ve nötr kopması (ev_ariza /
ded_notr → `contra_u6_notr`); her yanıt yalnızca sunulan kaydı söyler. Üç çelişkiden sonra kırılma (CMK 48 uyarısı, susma).

## 5. Sonuçlar

| Öncelik | Kimlik | Sınıf | Koşul (özet) | Hüküm |
|---|---|---|---|---|
| 1 | ETIK | CONVICTION | Ismarlama rapor kabul edildi ∧ hızlandırıcı tespiti ayakta | 170/1-a + 158/1-k, 35; mütalaa hükme esas alınmaz; suç duyurusu, baroya bildirim; etik kartı |
| 2 | ETIK_T | RECHARACTERIZED | Ismarlama rapor kabul edildi ∧ hızlandırıcı tespiti çöktü | TCK 171/1-a 5 ay, erteleme; 158/1-k’den 2-e beraat; mütalaa hükme esas alınmaz; suç duyurusu, baroya bildirim; etik kartı |
| 3 | BERAAT_B | ACQUITTAL (223/2-b) | Hızlandırıcı çöktü + eksper kırıldı + `elektrik_ispat` (elektrik bilirkişisi raporu ve nötr kopması) + taksire cevap + gerçek savunması + ikna ≥ 8 + final eşiği | Beraat, tahliye, eksper hakkında suç duyurusu |
| 4 | BERAAT_E | ACQUITTAL (223/2-e) | Hızlandırıcı çöktü + motif ipliklerinden ≥ 2 + taksire cevap + beraat savunması + final eşiği | Beraat |
| 5 | TAKSIR | RECHARACTERIZED | Hızlandırıcı çöktü: zincir + zemin + laboratuvar (skor ve çöküşten bağımsız) | TCK 171/1-a: 6 ay → TCK 62 ile 5 ay; zarar giderilmediğinden HAGB yok, TCK 51 erteleme; 158/1-k’den beraat |
| 6 | MAHKUMIYET | CONVICTION | Varsayılan: hızlandırıcı tespiti ayakta (çöküş dahil) | 170/1-a 1 yıl 6 ay + 158/1-k, 35/2: 2 yıl ve 500 gün; TCK 63 mahsup |

Eşikler (eşik çubuğuyla aynı): Mahkûmiyet 0 · Beraat 12.500; 223/2-b ayrıca 13.500 ve hâkimin kanaati
(`pers`) ≥ 8. `scaleMax` 14.800. Hukuki tavan kuralı (inceleme, 2026-10-20): kastın tek dayanağı numune zinciridir; zincir
çöktüyse (`hizlandirici_coktu`) kötü savunma, düşük skor ya da çöküş kesintisi sonucu kasten mahkûmiyete indiremez, en kötü
sonuç taksirdir. Bu yüzden eşik çubuğunda taksir bandı yoktur (eski 7.000 bandı hiçbir sonucun eşiği değildi;
doğrulayıcının THRESHOLD_MISMATCH uyarısı da böylece kalktı). Çöküş (`cred` 0) zincir kurulmadan
olursa MAHKUMIYET'e, kurulduktan sonra olursa TAKSIR'e gider; hiçbir gerekçe "müdafiin sunumlarını" mahkûmiyet dayanağı yapmaz.
XP: 223/2-b 1,2 · 223/2-e 1,0 · taksir 0,85 · mahkûmiyet 0,6 · etik 0 (etik ihlalinde yarı).

Gerekçe parçaları kayda bağlıdır: BERAAT_B'de ark cümlesi `ev_ark`, nötr cümlesi `ded_notr`/`ev_ariza`, zemin ve piroliz
cümleleri ilgili çelişkilere; BERAAT_E'de banka, artış, eşya, benzin cümleleri sırasıyla `motif_banka`, `motif_artis`,
`contra_s3`, `contra_s6`'ya; takvim cümlesi taksire takvimle verilen cevaba, dış etken cümlesi `taksir_dis`'e; "elektrik
kaynaklı olması kuvvetle muhtemel" cümlesi elektrik kaydına (yoksa nötr bir cümle). T06_B ve T06_E konuşmaları da kayda göre
üç değişkelidir.

Ek koşul yüklemleri (`meta.predicates`): `hizlandirici_coktu` = contra_b2 ∧ (contra_b1 ∨ contra_u2) ∧ (contra_b4 ∨ contra_u3) — zincir, zemin ve laboratuvar
bulgusu birlikte (eski tanım zincir + herhangi biriyle yetiniyordu; taksir 61 aksiyonda, ara evresine hiç girmeden
alınabiliyordu);
`motif_coktu` = en az ikisi: contra_s3, contra_s6, motif_banka, motif_artis; `elektrik_ispat` = (ev_ark ∨ ded_elektrik) ∧ ded_notr
(eski tanım `contra_u6`'yı da kabul ediyordu: ark raporu hiç istenmeden U6'ya nötr kopması sunularak 2-b alınabiliyor, hükümde
hiç alınmamış bir rapor anılıyordu; `N_B_ARKSIZ` negatif testi bunu kapatır).

## 6. Node grafiği

Hikâye kitabı §4'teki harita. Soruşturma hub'ı (INV_HUB) `push`/`$return` ile çalışır; ara hub'ı (ARA_HUB) yığınsızdır,
her etkinlik doğrudan döner (kaçış uzaklığı sınırı, Dava #07 raporu §8.2).

## 7. Golden path'ler

| Ad | Sonuç | Özet |
|---|---|---|
| TIPIK | BERAAT_E | Bütün soruşturma; 1. celsede numune zinciri, temizlenmiş zemin ve atölye kapı defteri (Q_GECE); pano ve lab talebi; arada tahkim ve lab; suç duyurusu (SC_DUYURU, el koyma); Necati hazır tanık; 2-e savunması |
| G_B | BERAAT_B | Ayrıca arıza kaydı + ark raporu + nötr; U6'ya ark ve nötr ayrı ayrı; eksper kırılır; 2-b savunması |
| N_B_ARKSIZ | TAKSIR | Negatif test: pano incelemesi hiç istenmez, U6'ya yalnızca nötr kopması; 2-b savunması ispatsız kalır (BERAAT_B'ye ulaşılamaz) |
| G_T | TAKSIR | Hızlandırıcı çöker, ama yenileme takvimi ve nötr bulunmaz; taksire cevap verilemez |
| G_M | MAHKUMIYET | Yüzeysel soruşturma, çelişkiler kurulamaz |
| G_ETIK_M | ETIK | G_M + ısmarlama rapor; ikinci celsede güven biter (çöküş) |
| G_ETIK | ETIK_T | Tam soruşturma + ısmarlama rapor; zincir kurulmuş olduğundan Halil taksirden hüküm giyer |
| W | TAKSIR (çöküş) | Birinci celsede zincir kurulur, ikinci celsede yanlış delil sunumlarıyla güvenilirlik 0: tavan kuralı gereği taksir |

## 8. Ölçümler (2026-10-21)

`npm run case:duration -- yanik-ev`:

```
  TIPIK         107.3 dk   15010 sözcük   239 aksiyon  BERAAT_E (14865)
  G_B           107.8 dk   14982 sözcük   246 aksiyon  BERAAT_B (15825)
  N_B_ARKSIZ    105.0 dk   14592 sözcük   239 aksiyon  TAKSIR (14605)
  G_T            94.8 dk   13151 sözcük   217 aksiyon  TAKSIR (11940)
  G_M            84.1 dk   11759 sözcük   188 aksiyon  MAHKUMIYET (6445)
  G_ETIK_M       77.1 dk   10811 sözcük   170 aksiyon  ETIK (5560)
  G_ETIK        105.2 dk   14684 sözcük   236 aksiyon  ETIK_T (14225)
  W              91.6 dk   12629 sözcük   214 aksiyon  TAKSIR (10635)
  ==> TİPİK YOL (TIPIK): 107.3 dk  ✓ süre hedefte
  ==> SÖZCÜK BÜTÇESİ: ✓ 15010 sözcük: hedefte (15–25 bin)
```

`node tools/content/word-count.mjs content/cases/yanik-ev`: TIPIK'te görülen satırlar 12.012 sözcük; paket 1.301 satır,
17.073 satır sözcüğü; ekran metinleriyle toplam 23.095. En uzun satır 216 karakter.

`npm run case:validate -- yanik-ev --max-ms 3000000`: **PASSED — 0 hata**, 1 uyarı (SIMULATION_INCOMPLETE); 56.344 durum,
400 yürüyüş; altı sonucun hepsine ulaşıldı; kapsam node 110/110, seçenek 213/213, kural 80/80, delil 66/66; golden path 8/8;
softlock, sızıntı yok. Süre 57,6 sn, varsayılan 600 sn sınırıyla (2026-10-21 yeniden doğrulama, yük ortalaması ~6).

Seçenek etiketi denetimi (derlenmiş pakette GOOD ile GOOD olmayanı karışık 13 notlu seçenek kümesi): en uzun etiketin doğru
seçenek olduğu küme 0/13. Yeniden denetim (2026-10-21, NEUTRAL seçenekleri de "doğru değil" sayan geniş ölçüt, 18 küme): en uzun
etiket 3/18 kümede doğru (H1_00K4, ARA_CEVDET, ARA_HALIL; fark ≤ 13 karakter), T_06'da doğru seçenek en kısasıdır. Yanlış seçenekler aynı uzunlukta ve aynı hukuki dilde (yanlış dayanak, yanlış aralık, yanlış talep).

Erken çözüm denetimi (golden path'ten aksiyon silerek, reddedilen aksiyonları atlayan yeniden oynatmayla yerel en kısa yol):

| Hedef | Tohum | En kısa | Oran |
|---|---|---|---|
| BERAAT_E / BERAAT_B | TIPIK, G_B | 172 aksiyon (final 12.505) | TIPIK'in %72'si |
| BERAAT_B | G_B | 183 aksiyon (final 13.515) | G_B'nin %74'ü |
| TAKSIR | G_T, W, N_B_ARKSIZ | 75 aksiyon (W'den 79) | G_T'nin %35'i |
| MAHKUMIYET | G_M | 36 aksiyon | varsayılan sonuç |

Beraat; numune zinciri, temizlenmiş zemin, laboratuvar bulgusu, iki iplik ve taksire cevap olmadan kurulamıyor; 2-b ayrıca
ark raporu ve nötr kaydını istiyor. Taksir kısa yolu bilinçli bir ödünleşimdir: zincir, zemin ve laboratuvar çelişkisi birinci
celsede kurulduğunda kasten mahkûmiyet hukuken mümkün değildir (tavan kuralı), bu yüzden taksir skordan bağımsızdır. Yüklem
sıkılaştırması bu yolu 61'den 75 aksiyona çıkardı; daha fazlası ancak hukuki tavanı bozarak yapılabilirdi.

Tahtalar: birinci evrede iki tahta (yangın: 14 kart, 6 tarif + 2 çeldirici; iplikler: 13 kart, 6 tarif + 2 çeldirici), arada
bir tahta (13 kart, 4 tarif); tek havuzlu 28 kartlık tahta simülasyonu patlattığı için bölündü.
