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

Çıkarımlar (1. tahta): `ded_temizlenmis` (foto_tavan + eksper_foto), `ded_zincir` (numune + eksper_giris), `ded_pano`
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
U6 elektrik olsaydı görürdüm → ev_ark / ded_elektrik / ded_notr. Üç çelişkiden sonra kırılma (CMK 48 uyarısı, susma).

## 5. Sonuçlar

| Öncelik | Kimlik | Sınıf | Koşul (özet) | Hüküm |
|---|---|---|---|---|
| 1 | ETIK | CONVICTION | Para karşılığı karşı rapor kabul edildi | 170/1-a + 158/1-k, 35; etik kartı |
| 2 | BERAAT_B | ACQUITTAL (223/2-b) | Hızlandırıcı çöktü + eksper kırıldı + elektrik kaynağı ispatlandı (ark ya da elektrik çıkarımı ve nötr) + taksire cevap + gerçek savunması + ikna ≥ 8 + final eşiği | Beraat, tahliye, eksper hakkında suç duyurusu |
| 3 | BERAAT_E | ACQUITTAL (223/2-e) | Hızlandırıcı çöktü + motif ipliklerinden ≥ 2 + taksire cevap + beraat savunması + final eşiği | Beraat |
| 4 | TAKSIR | RECHARACTERIZED | Hızlandırıcı çöktü + final eşiği | TCK 171/1-a: 6 ay → TCK 62 ile 5 ay; HAGB (CMK 231/5); 158/1-k'den beraat |
| 5 | MAHKUMIYET | CONVICTION | Varsayılan (çöküş dahil) | 170/1-a 1 yıl 6 ay + 158/1-k, 35/2: 2 yıl ve 500 gün |

Eşikler ve skor, ölçümle birlikte §8'de.

## 6. Node grafiği

Hikâye kitabı §4'teki harita. Soruşturma hub'ı (INV_HUB) `push`/`$return` ile çalışır; ara hub'ı (ARA_HUB) yığınsızdır,
her etkinlik doğrudan döner (kaçış uzaklığı sınırı, Dava #07 raporu §8.2).

## 7. Golden path'ler

| Ad | Sonuç | Özet |
|---|---|---|
| TIPIK | BERAAT_E | Bütün soruşturma; 1. celsede numune zinciri ve temizlenmiş zemin; pano ve lab talebi; arada tahkim ve lab; suç duyurusu yok; 2-e savunması |
| G_B | BERAAT_B | Ayrıca arıza kaydı + ark raporu + nötr; suç duyurusu (el koyma); eksper kırılır; 2-b savunması |
| G_T | TAKSIR | Hızlandırıcı çöker, ama yenileme takvimi ve nötr bulunmaz; taksire cevap verilemez |
| G_M | MAHKUMIYET | Yüzeysel soruşturma, çelişkiler kurulamaz |
| G_ETIK | ETIK | Karşı rapor teklifi kabul edilir |
| W | MAHKUMIYET (çöküş) | Yanlış delil sunumlarıyla güvenilirlik 0 |

## 8. Ölçümler

Bkz. §8 sonu (yazım tamamlanınca `case:duration` çıktısı eklenir).
