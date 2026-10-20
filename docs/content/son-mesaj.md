# Dava #06 "TODO Başlık" — Hikâye Kitabı

> Kaynak: `content/src/son-mesaj/` (yazım kiti) → `content/cases/son-mesaj/` (`npm run case:build -- son-mesaj`).
> Hukuki notlar: `docs/legal/son-mesaj.md`. Kılavuz: `docs/content/authoring-guide.md`. Lineup satırı: `docs/content/lineup.md`.
>
> **Önce hikâye.** Bölüm 1–6 (hikâye kitabı) tamamlanmadan tek satır kaynak kod yazılmaz. Mekanikler sahnelere asılır;
> bir mekanik için sahne uydurulmaz. Tipik yol 15–25 bin sözcük diyalog ve anlatı taşır (10 binin altı kapıdan geçmez).

## 1. Logline ve tema
- Tek cümle: TODO (kim, neyle suçlanıyor, neyi kaybedebilir, gerçek ne?)
- Tema / dramatik soru: TODO (ör. "sadakat mi, adalet mi?")
- Ton: TODO (gerilim, dram, kara mizah…) · Ana mekânlar: TODO

## 2. Soğuk açılış (prolog)
Oyuncu dosyayı açmadan önce yaşanan sahne (300–800 sözcük): olay gecesinden ya da müvekkilin yakalanışından bir an. Kim
konuşuyor, ne görüyoruz, hangi soru akılda kalıyor? TODO

## 3. Karakterler (her biri ayrı bir ses)
| Kimlik | Ad, yaş, iş | İstediği (motivasyon) | Sakladığı | Konuşma biçimi (ağız, tik, sözcük seçimi) | Örnek replik |
|---|---|---|---|---|---|
| muvekkil | TODO | TODO | TODO | TODO | “TODO” |
| tanik | TODO | TODO | TODO | TODO | “TODO” |
| leyla (mentor) | Av. Leyla Erdem | Deniz’i yetiştirmek | TODO (davaya özgü) | Sakin, öğretici; hukuki açıklamaları O yapar | “TODO” |

Kural: hukuki madde atıfları karakterlerin gündelik konuşmasında geçmez; yeri mentor açıklaması, seçenek geri bildirimi
(`good` / `bad` / `neutral`) ve rapordur. Hâkim usul cümlelerini sade dille kurar (“Müdafi, diyeceğiniz?”).

## 4. Gerçek ve kronoloji
Olay gerçekte nasıl oldu? Saat saat; oyuncunun hangisini nerede öğrendiği.

| Saat | Olay | Kim biliyor | Nasıl keşfedilir (sahne · mekanik) |
|---|---|---|---|
| TODO | TODO | TODO | TODO |

## 5. Sahne listesi ve dramatik vuruşlar
Her sahne bir dramatik vuruş taşır (yeni bilgi, karar, çatışma, duygu değişimi). Dakika ve sözcük bütçesi tipik yol içindir.

| # | Sahne (node'lar) | Bölüm | Vuruş: ne değişiyor? | Mekanik (varsa) | ~dk | ~sözcük |
|---|---|---|---|---|---|---|
| 1 | Soğuk açılış (PROLOG_*) | Prolog | TODO | — | 4 | 700 |
| 2 | Büroda dosya devri (BR_*) | Brifing | TODO | A–D hukuki soru, strateji | 6 | 1 000 |
| 3 | TODO | Soruşturma 1 | TODO | görüşme / arama / belge | TODO | TODO |
| … | 1. celse | Duruşma 1 | TODO | itiraz, sanık savunması | TODO | TODO |
| … | Ters köşe | Ara | TODO | gecikmeli delil | TODO | TODO |
| … | 2. celse | Duruşma 2 | TODO | çapraz sorgu × 2–3, itirazlar, esas savunma | TODO | TODO |
| … | Karar ve epilog | Karar | TODO | — | TODO | TODO |
| **Toplam** | | | | | **90–120** | **15–25 bin** |

## 6. Ters köşeler ve epiloglar
- Ters köşe 1 (1. celse sonrası): TODO — nasıl hazırlandı (önceden ekilen ipuçları)?
- Ters köşe 2 (2. celse içinde): TODO
- Sonuç başına epilog (karar ekranından önceki kapanış sahnesi ya da `verdictText` + gerekçe; kılavuz §3.6):
  - BERAAT_B: TODO · BERAAT_E: TODO · INDIRIM: TODO · MAHKUMIYET: TODO

## 7. Delil zinciri
| Kimlik | Ad | Tür | Keşif sahnesi / yolu | Neyi çürütür / destekler | Sunulabilir |
|---|---|---|---|---|---|
| TODO | TODO | EVIDENCE / CLUE / INSIGHT | TODO | TODO | TODO |

Çıkarımlar (tahta): TODO kart + kart → çıkarım. Çeldirici kartlar: TODO.
Gecikmeli teslimler: TODO delil — talep (bayrak) — teslim yeri (gün sonu / celse girişi).

## 8. Çelişkiler (çapraz sorgu)
Her tanık için ifade listesi; hangi BASTIR yeni satır açar, hangi delil hangi ifadeyi çürütür, kısmi isabetler.

## 9. Node grafiği özeti
Sahne listesinin node'lara dökümü (kimlikler, seçenek grupları, tetikleyiciler).

## 10. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul | Ceza | XP çarpanı |
|---|---|---|---|---|---|
| 1 | BERAAT_B | ACQUITTAL (223/2-b) | TODO | Ceza yok | 1,2 |
| 2 | BERAAT_E | ACQUITTAL (223/2-e) | TODO | Ceza yok | 1,0 |
| 3 | INDIRIM | REDUCED | TODO | TODO | 0,85 |
| 4 | MAHKUMIYET | CONVICTION (varsayılan) | — | TODO | 0,6 |

Ceza hesabı (adım adım): TODO temel ceza → artırım → indirim (TCK 61 sırası).

## 11. Skor
- Kategoriler ve döküm satırları: TODO
- Eşik çubuğu: Mahkûmiyet 0 · İndirim TODO · Beraat TODO (sonuç koşullarıyla aynı).
- Teorik tavan: TODO (`case:validate` çıktısındaki final skor aralığı).

## 12. Golden path'ler
| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | TODO | TODO | Tipik oyun |

## 13. Süre ve sözcük ölçümü
`npm run case:duration -- son-mesaj` çıktısı (tarih, sözcük, aksiyon, dakika, kapı):

```
TODO
```
