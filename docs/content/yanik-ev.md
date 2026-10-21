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
| 1 | ETIK | CONVICTION | Ismarlama rapor ∧ hızlandırıcı tespiti ayakta | 170/1-a + 158/1-k, 35; mütalaa hükme esas alınmaz; suç duyurusu, baroya bildirim; etik kartı |
| 2 | ETIK_E | OTHER | Ismarlama rapor ∧ kalan kayıt beraati taşıyor (`kayitBeraat`) | Her iki suçtan 223/2-e beraat; suç duyurusu, baroya bildirim; etik kartı; XP 0 |
| 3 | ETIK_T | RECHARACTERIZED | Ismarlama rapor ∧ hızlandırıcı tespiti çöktü (kalan kayıt beraati taşımıyor) | TCK 171/1-a 5 ay, erteleme; 158/1-k’den 2-e beraat; suç duyurusu, baroya bildirim; etik kartı |
| 4 | BERAAT_B | ACQUITTAL (223/2-b) | Hızlandırıcı çöktü + eksper kırıldı + `elektrik_ispat` + taksire cevap + 2-b savunması kayıtla örtüşüyor (`gercek`) + ikna ≥ 8 + final ≥ 13.500 | Beraat, tahliye, eksper hakkında suç duyurusu |
| 5 | BERAAT_E | ACQUITTAL (223/2-e) | `kayitBeraat` ∧ final ≥ 12.500 | Beraat |
| 6 | TAKSIR | RECHARACTERIZED | Hızlandırıcı çöktü (skor ve çöküşten bağımsız) | TCK 171/1-a: 6 ay → TCK 62 ile 5 ay; HAGB yok, TCK 51 erteleme; 158/1-k’den beraat |
| 7 | MAHKUMIYET | CONVICTION | Varsayılan: hızlandırıcı tespiti ayakta | 170/1-a 1 yıl 6 ay + 158/1-k, 35/2: 2 yıl ve 500 gün; TCK 63 mahsup |

`kayitBeraat` = ¬çöküş ∧ `hizlandirici_coktu` ∧ `motif_coktu` ∧ `taksir_cevap` ∧ `beraat_talep`. **Beraatin dayanağını mahkeme
seçer (CMK 223):** T06_B (2-b), T06_E (2-e) ve T06_T (öncelikle beraat, terditli taksir) üçü de `beraat_talep`'i kaldırır; 2-b
talebi kayıtla örtüşmezse (`gercek` yok) ya da terditli talep seçilirse hüküm yine 2-e beraattir, yanlış dayanak yalnızca skor ve
`pers` kaybettirir ve gerekçeye bir cümle ekler ("talebi kabul görmemiş; ancak mahkeme beraatin dayanağını kendisi belirler" /
"terditli talebin incelenmesine yer olmamıştır"). T06_D (duygusal savunma) beraat istemez; beraate ulaşmaz (bilinçli
sadeleştirme, hukuki notlar §4.13). **Ismarlama rapor müvekkili cezalandırmaz:** mahkeme mütalaayı dışlar, kalan kayıt beraati
taşıyorsa ETIK_E (skor eşiği aranmaz: müdafiin ihlalinin skor bedeli müvekkilin hükmüne yansımaz), taşımıyorsa ETIK_T/ETIK.

Eşikler (eşik çubuğuyla aynı): Mahkûmiyet 0 · Beraat 12.500; 223/2-b ayrıca 13.500 ve `pers` ≥ 8. `scaleMax` 14.800. Hukuki
tavan kuralı: kastın tek dayanağı numune zinciridir; zincir çöktüyse (`hizlandirici_coktu`) kötü savunma, düşük skor ya da
çöküş sonucu kasten mahkûmiyete indiremez, en kötü sonuç taksirdir; bu yüzden eşik çubuğunda taksir bandı yoktur. İkinci
celsedeki çöküş (`cred` 0) yargılamayı bitirmez: hâkim delil sunumunu kapatır, yargılama CMK 226, mütalaa, esas savunma ve son
sözle sürer (T_COKUS_D); çöküşte beraat yoktur (`kayitBeraat` ¬çöküş ister). XP: 223/2-b 1,2 · 223/2-e 1,0 · taksir 0,85 ·
mahkûmiyet 0,6 · etik 0 (etik ihlalinde yarı). ETIK_E, müvekkil beraat etse de bir etik sonu olduğundan sınıfı OTHER'dır
(istatistikte beraat sayılmaz).

Gerekçe parçaları kayda bağlıdır: BERAAT_B'de ark cümlesi `ev_ark`, nötr cümlesi `ded_notr`/`ev_ariza`, zemin ve piroliz
cümleleri ilgili çelişkilere; BERAAT_E'de banka, artış, eşya, benzin cümleleri sırasıyla `motif_banka`, `motif_artis`,
`contra_s3`, `contra_s6`'ya; takvim cümlesi takvim cevabına, dış etken cümlesi `taksir_dis`'e. TAKSIR ve ETIK_T'de dış etken
cevabı varsa ortak illiyet cümlesi (aşırı gerilim tek ve öngörülemez sebep değil), takvim cevabı varsa "takvim yetmez" cümlesi;
TAKSIR'deki eski "üçüncü kişinin kusuru illiyet bağını kesmemiştir" cümlesi kaldırıldı. ETIK_T'nin özen cümlesi artık dışlanan
mütalaaya dayanmaz.

Ek koşul yüklemleri (`meta.predicates`): `hizlandirici_coktu` = contra_b2 ∧ CV_Q2 ∧ `cevdet_dinlendi` (CV_Q3) ∧ (contra_b1 ∨
contra_u2) ∧ contra_b4 ∧ contra_u3 — bilirkişinin "numuneleri ben almadım" kabulü, bunu yeminle doğrulayan bekçi (eksper
muhafazadaki olay yerine refakatsiz ve dolu tenekelerle girdi), zemin izi, birinci celsedeki "taze benzin" çelişkisi ve aradaki
ham veri (piroliz yok, tenekeler aynı). Eski tanım (zincir ∧ zemin ∧ (b4 ∨ u3)) taksiri 75 aksiyonda veriyordu; `motif_coktu` = en
az ikisi: contra_s3, contra_s6, motif_banka, motif_artis; `elektrik_ispat` = (ev_ark ∨ ded_elektrik) ∧ ded_notr.

Erken çözüm kapıları (ikinci inceleme, blocker 3): 1. celseye (GO_H1) yalnızca son gün, eylem puanı bitince ya da yapılacak
etkinlik kalmayınca gidilir (duruşma tarihi sabit, 14 Nisan); 2. celseye (GO_T) aranın son günü bitince (ya da etkinlik
kalmayınca) ve Leyla'yla o gün konuşulduktan sonra; delil dilekçesi son gün Leyla taslağı okuduktan sonra yazılır; bekçinin
sabah sorusu (CV_SABAH: eksper girişi, çizelge) `clue_numune` ∧ (INV_FOTO ∨ `clue_eksper_foto`) ister, ilk ziyarette sorulamadıysa
A_CEVDET2 (1 EP) açılır. Etkinlik tükenmesi koşulları gün beklemeden de geçerlidir; aksi hâlde az teslimatlı arada hub
kilitleniyordu (kendi kaçış betiğimle bulundu, düzeltildi).

## 6. Node grafiği

Hikâye kitabı §4'teki harita. Soruşturma hub'ı (INV_HUB) `push`/`$return` ile çalışır; ara hub'ı (ARA_HUB) yığınsızdır,
her etkinlik doğrudan döner (kaçış uzaklığı sınırı, Dava #07 raporu §8.2).

## 7. Golden path'ler

| Ad | Sonuç | Özet |
|---|---|---|
| TIPIK | BERAAT_E | Bütün soruşturma; 1. celsede numune zinciri, temizlenmiş zemin, taze benzin ve atölye kapı defteri (Q_GECE); pano, lab ve bekçi talebi; arada tahkim ve lab; suç duyurusu; bekçi Q1–Q3; Necati hazır tanık; 2-e savunması |
| N_TIPIK_2B | BERAAT_E | Negatif test: TIPIK kaydında 2-b talebi (ispatsız dayanak) → yine 2-e beraat, yalnızca skor düşer |
| N_TIPIK_TERDIT | BERAAT_E | Negatif test: TIPIK kaydında terditli talep → yine 2-e beraat |
| G_B | BERAAT_B | Ayrıca arıza kaydı + ark raporu + nötr; U6'ya ark ve nötr ayrı ayrı; eksper kırılır; 2-b savunması |
| N_B_ARKSIZ | BERAAT_E | Negatif test: pano incelemesi hiç istenmez, U6'ya yalnızca nötr; 2-b ispatsız → BERAAT_B değil, 2-e beraat |
| G_T | TAKSIR | Hızlandırıcı çöker; elektrikçiye uğranır ama bir şey sorulmaz, önlem kartı kurulmaz; taksire cevap verilemez |
| G_M | MAHKUMIYET | Yüzeysel soruşturma, çelişkiler kurulamaz |
| G_ETIK_M | ETIK | G_M + ısmarlama rapor; ikinci celsede güven biter, yargılama mütalaa ve son sözle sürer |
| G_ETIK | ETIK_E | Tam soruşturma + ısmarlama rapor; kalan kayıt (bekçi, fotoğraflar, tenekeler, Necati) beraati taşır |
| G_ETIK_T | ETIK_T | G_ETIK ama taksir sorusuna cevap yok (T05_C): kalan kayıt beraati taşımaz |
| W | TAKSIR (çöküş) | Zincir kurulur (U3 dahil), ikinci celsede yanlış delil sunumlarıyla güven 0; yargılama sürer, tavan kuralı gereği taksir |

## 8. Ölçümler (2026-10-21, ikinci inceleme düzeltmelerinden sonra)

`npm run case:duration -- yanik-ev`:

```
  TIPIK         107.3 dk   15014 sözcük   239 aksiyon  BERAAT_E (14865)
  N_TIPIK_2B    107.2 dk   14992 sözcük   239 aksiyon  BERAAT_E (14525)
  N_TIPIK_TERDIT  107.0 dk   14965 sözcük   239 aksiyon  BERAAT_E (14775)
  G_B           107.9 dk   14986 sözcük   246 aksiyon  BERAAT_B (15825)
  N_B_ARKSIZ    106.6 dk   14877 sözcük   239 aksiyon  BERAAT_E (14605)
  G_T            97.3 dk   13452 sözcük   226 aksiyon  TAKSIR (12535)
  G_M            85.4 dk   11910 sözcük   192 aksiyon  MAHKUMIYET (6445)
  G_ETIK_M       82.5 dk   11599 sözcük   181 aksiyon  ETIK (5485)
  G_ETIK        105.2 dk   14690 sözcük   236 aksiyon  ETIK_E (14225)
  G_ETIK_T      104.4 dk   14541 sözcük   236 aksiyon  ETIK_T (14015)
  W              97.6 dk   13524 sözcük   225 aksiyon  TAKSIR (11170)
  ==> TİPİK YOL (TIPIK): 107.3 dk  ✓ süre hedefte
  ==> SÖZCÜK BÜTÇESİ: ✓ 15014 sözcük: hedefte (15–25 bin)
```

`node tools/content/word-count.mjs content/cases/yanik-ev`: TIPIK'te görülen satırlar 12.008 sözcük; paket 1.322 satır,
17.360 satır sözcüğü; ekran metinleriyle toplam 23.860. En uzun satır 216 karakter.

`npm run case:validate -- yanik-ev`: **PASSED — 0 hata**, 21 uyarı (1 SIMULATION_INCOMPLETE, 20 SOFTLOCK_UNVERIFIED); 861.438
durum, 400 yürüyüş; yedi sonucun hepsine ulaşıldı; kapsam node 111/111, seçenek 216/216, kural 80/80, delil 66/66; golden path
11/11; süre 399 sn (yük ortalaması ~3). SOFTLOCK_UNVERIFIED uyarıları yeni gün sonu kapılarından gelir: doğrulayıcının kaçış
araması (4.000 durum bütçesi) hub'da eylem puanı harcamadan tahtalar arasında dolaşıyor. Bütün 20 tanık durumu, eylem puanını
etkinliklere harcayan ve duruşmalara giden betikli bir kaçış politikasıyla sona ulaştı (20/20); 1.000 rastgele önek + aynı politika:
1.000/1.000 tamamlandı, takılan yok. Bu betik, ilk denemede gerçek bir kilitlenmeyi de buldu (arada az teslimatla eylem puanı
kalırken etkinliğin tükenmesi); tükenme koşulu güne bağlı olmaktan çıkarılarak düzeltildi. Etkinlikler hub'da ücretsiz
seçeneklerden sonra gelir (BÜRO sekmesi ilk sırada), böylece arama önce eylem puanı harcamayı dener.

Erken çözüm denetimi (golden path'ten aksiyon silerek, reddedilen aksiyonları atlayan yeniden oynatmayla yerel en kısa yol;
taksir için ayrıca elle küçültülmüş ara tohumu ve çöküş tohumu):

| Hedef | Tohum | En kısa | Süre | Oran |
|---|---|---|---|---|
| BERAAT_E | N_TIPIK_2B, TIPIK, N_TIPIK_TERDIT, N_B_ARKSIZ | 190 aksiyon (final 12.515) | 90,4 dk | TIPIK'in %79'u |
| BERAAT_B | G_B | 204 aksiyon (final 13.505) | 94,1 dk | G_B'nin %83'ü |
| TAKSIR | elle küçültülmüş ara (4 etkinlik), G_T, W, çöküş | 106 aksiyon (G_T'den 113, W'den 122) | 60,6 dk | G_T'nin %47'si |
| ETIK_E (OTHER) | G_ETIK | 129 aksiyon | 70,5 dk | etik sonu, skor eşiği yok |
| ETIK_T | G_ETIK_T | 113 aksiyon | 64,8 dk | — |
| MAHKUMIYET | G_M | varsayılan sonuç | — | — |

Önceki ölçüm (ilk düzeltme): taksir 75 aksiyon / 46,3 dk (G_T'nin %35'i), beraat 172. Taksir artık bilirkişinin kabulünü,
yeminli bekçiyi (refakatsiz giriş + dolu tenekeler), zemini, birinci celsedeki taze benzin çelişkisini, aradaki ham veriyi ve
iki duruşmaya kadar bütün günleri ister; 60 dk tabanını geçer. Aksiyon oranı (%47) incelemenin önerdiği %60'ın altında kalır:
G_T'nin ek aksiyonları isteğe bağlı derinliktir (konular, büyüteç dokunuşları, Saadet'in tam çapraz sorgusu); bunları zorunlu
kılmak ya da taksiri skora bağlamak hukuki tavanı bozardı (zincir çöktüyse kasten mahkûmiyet olamaz).

Tahtalar: birinci evrede iki tahta (yangın: 14 kart, 6 tarif + 2 çeldirici; iplikler: 13 kart, 6 tarif + 2 çeldirici), arada
bir tahta (13 kart, 4 tarif); tek havuzlu 28 kartlık tahta simülasyonu patlattığı için bölündü.
