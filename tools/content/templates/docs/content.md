# Dava #__NN__ "TODO Başlık" — Hikâye Kitabı

> Kaynak: `content/src/__SLUG__/` (yazım kiti) → `content/cases/__SLUG__/` (`npm run case:build -- __SLUG__`).
> Hukuki notlar: `docs/legal/__SLUG__.md`. Kılavuz: `docs/content/authoring-guide.md`. Lineup satırı: `docs/content/lineup.md`.

## 1. Künye
- Suç ve madde: TODO (TCK md.)
- Hukuki çekirdek (savunmanın ekseni): TODO
- Rütbe · zorluk: TODO · TODO
- Hedef süre: tipik yol (`TIPIK`) 90–120 dk.

## 2. Gerçek ve kronoloji
TODO: olay gerçekte nasıl oldu? Saat saat kronoloji (oyuncu bunun bir kısmını keşfeder).

| Saat | Olay | Kim biliyor | Nasıl keşfedilir |
|---|---|---|---|
| TODO | TODO | TODO | TODO |

## 3. Kadro
| Kimlik | Ad | Rol | Sprite | Sakladığı / gerçek |
|---|---|---|---|---|
| muvekkil | TODO | CLIENT | muvekkil | TODO |

## 4. Delil zinciri
| Kimlik | Ad | Tür | Keşif yolu | Neyi çürütür / destekler | Sunulabilir |
|---|---|---|---|---|---|
| TODO | TODO | EVIDENCE / CLUE / INSIGHT | TODO | TODO | TODO |

Çıkarımlar (tahta): TODO kart + kart → çıkarım. Çeldirici kartlar: TODO.
Gecikmeli teslimler: TODO delil — talep (bayrak) — teslim yeri (gün sonu / celse girişi).

## 5. Çelişkiler (çapraz sorgu)
Her tanık için ifade listesi; hangi BASTIR yeni satır açar, hangi delil hangi ifadeyi çürütür, kısmi isabetler.

## 6. Node grafiği özeti
Bölüm bölüm (dakika bütçesiyle):
1. Brifing (~5–8 dk): TODO
2. Soruşturma 1. evre (~25–35 dk): TODO
3. 1. celse (~12–18 dk): TODO
4. Ters köşe + 2. evre (~20–30 dk): TODO
5. 2. celse (~25–35 dk): TODO
6. Karar.

## 7. Sonuçlar
| Öncelik | Kimlik | Sınıf | Koşul | Ceza | XP çarpanı |
|---|---|---|---|---|---|
| 1 | BERAAT_B | ACQUITTAL (223/2-b) | TODO | Ceza yok | 1,2 |
| 2 | BERAAT_E | ACQUITTAL (223/2-e) | TODO | Ceza yok | 1,0 |
| 3 | INDIRIM | REDUCED | TODO | TODO | 0,85 |
| 4 | MAHKUMIYET | CONVICTION (varsayılan) | — | TODO | 0,6 |

Ceza hesabı (adım adım): TODO temel ceza → artırım → indirim (TCK 61 sırası).

## 8. Skor
- Kategoriler ve döküm satırları: TODO
- Eşik çubuğu: Mahkûmiyet 0 · İndirim TODO · Beraat TODO (sonuç koşullarıyla aynı).
- Teorik tavan: TODO (`case:validate` çıktısındaki finalMax).

## 9. Golden path'ler
| Ad | Sonuç | Final | Özet |
|---|---|---|---|
| TIPIK | TODO | TODO | Tipik oyun |

## 10. Süre ölçümü
`npm run case:duration -- __SLUG__` çıktısı (tarih, sözcük, aksiyon, dakika):

```
TODO
```
