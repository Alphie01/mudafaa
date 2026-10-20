# Yazım Kiti Raporu

> Kapsam: 15 davanın (docs/content/lineup.md) yazımı için kit, komutlar, kılavuz ve ölçümler. `packages/*`, `apps/*` ve
> Dava #07 içeriği değiştirilmedi. Kılavuz: docs/content/authoring-guide.md.

## 1. Ne yapıldı

**Yazım kiti** — `tools/content/src/kit/` (11 modül, `index.ts` hepsini ve şema tiplerini dışa aktarır). Her yardımcı
düz bir CasePackage nesnesi döndürür; ham nesneler her yerde karıştırılabilir, kimlikleri yazar seçer.

| Modül | Kalıp | Ne kazandırır |
|---|---|---|
| `text` | satır, yanıt bloğu | `L('kerem', '…', 'kizgin')`, `says(...)`, `when(koşul, ...)` |
| `expr` | koşul, değer, etki | `flag has cmp v atLeast …`, `set inc raise score discover mark ifThen …`, `strategyAmount` |
| `choices` | A–D seçenekleri | `option(id, etiket, { discovers, score, good/bad/neutral, effects, next })`: kalite işareti, skor, keşif tek nesnede; `withNext` ortak `next` |
| `nodes` | bölüm, STORY, CHOICE, EVIDENCE, DECISION, RESULT | `chapter()` ilerleme etiketi + eyebrow; `choiceNode({ prompt, next })` |
| `investigation` | çok günlü hub, eylem puanı, gün sonu, gecikmeli teslim | `phase({...})` → `variables start dayLines activity free hub dayEnd`; `deliver(node, [{ evidence, requires }])` |
| `dialogue` | konu × ton görüşmesi, serbest konuşma | `interview({ toneEffects, topics, finish })`, `topic(…, { tones: { soft, hard } })` |
| `mechanics` | olay yeri araması, belge incelemesi, çıkarım tahtası | FALLBACK ve "bitir" zorunlu (MISSING_FALLBACK yazım anında önlenir) |
| `court` | celseler, kürsü, OBJECTION A–D, tanık ifadesi | `court({ bench, counsel, hud, chapter })` kürsüyü bir kez yazar (Dava #07'de 14 kez yinelenir); `testimony({ statements, rules, presentMiss, objectMiss, finish })` |
| `data` | değişken, kadro, delil, skor, sonuç, rapor | `meter flags counter`; `sharedSprite`; `evidence/clue/insight` varsayılan bayraklarla; `categories thresholdBar xp outcome because hint missedEvidence` |
| `golden` | golden path | `step.*`, `chooseAll`, `goldenPath('TIPIK', …, gün1, gün2, celse1)` (iç içe gruplar düzleşir) |
| `case` | parçalar, denetimler | `defineCase`, `withDiscoveryPaths` (koşulsuz DISCOVER yolları), `findDuplicateIds` / `assertUniqueIds` |

**Yinelenen kimlik** — `case:build` derlemeden ve yazmadan önce motorun bütün ad alanlarını (node, seçenek, değişken,
delil, karakter, sprite, sahne, nesne, ifade, sonuç, tetikleyici, yüklem, gerekçe, varlık) ve kitin ek ad alanlarını
(golden path, rapor ipucu, celse ve aşaması, skor satırı, bonus, kronoloji, node içi sekme/satır/alet/hedef/ton, seçenek
içi varyant) denetler; hata `node "HUB": 40-akis:nodes[1], 45-ek:nodes[0]` biçiminde parça:yol verir.

**Komutlar** — tek giriş `tools/content/src/cli.ts`; kök ve `@mudafaa/content-tools` `package.json`'larında betik:

| Komut | Ne yapar |
|---|---|
| `npm run case:new -- <slug> <numara>` | `content/src/<slug>/` iskeleti (12 parça, çalışan örnek dava, sahne HTML'i) + `docs/content/<slug>.md` (hikâye kitabı) + `docs/legal/<slug>.md`; üzerine yazmaz |
| `npm run case:build -- <slug>` | Kaynağı tsx ile çalıştırır; parça adı ve kimlik denetimi; `content/cases/<slug>/NN-ad.json` (Prettier'ın yazacağı biçim, eski parçaları siler); `mergeCaseParts` + `compile`; hata → bulgular + çıkış 1 |
| `npm run case:validate -- <slug>` | `loadCase` + `validatePackage` (uzun dava bütçeleri), insan okunur rapor, ardından süre/sözcük kapısı; kaynak JSON'dan yeniyse uyarı; `--max-states --walks --max-ms --strict --no-duration-gate` |
| `npm run case:duration -- <slug>` | Bütün golden path'leri motorda oynatır, yeni gösterilen sözcükleri sayar; `TIPIK` kapısı |
| `npm run case:scenes -- <slug>` | `content/src/<slug>/scenes/*.html` → `content/cases/<slug>/assets/scenes/<ad>@4x.png`; ağsız Chromium, boyut SceneDef'le karşılaştırılır |
| `npm run case:sprite-preview -- <dosya\|ad>` | 16×20 ve palet denetimi, beş ifade yan yana PNG (geçici dizin ya da `--out`) |

`tools/content/tsconfig.json`'a `@mudafaa/*` → `packages/*/src` yol eşlemesi eklendi: komutlar `dist` derlemesi
olmadan çalışır (Vitest'in takma adlarıyla aynı yaklaşım). Sahne render'ı `lib/scenes.ts`'e genelleştirildi; Dava #07
PNG'leri yeni kodla bayt bayt aynı üretiliyor. Sprite önizlemesi tarayıcısız (pngjs); palet ve yüz katmanları
Sprite.dc.html'le birebir (test denetler).

**Kılavuz** — docs/content/authoring-guide.md (Türkçe): iş akışı, önce hikâye, 90–120 dk yapı (dakika ve sözcük
bütçesiyle), tempo, mekanik karışımı (zorluğa göre tablo), skor, üslup, hukuki doğruluk, kapılar, sprite/sahne, kit
başvurusu, son kontrol listesi.

**Testler** — `tools/content/test/` altında 5 yeni dosya, 30 test (~2 sn): kit çıktıları şemaya birebir uyar ve
örnek dava (`fixtures/mini-case.ts`) derlenip oynanır; `case:build` gidiş-dönüşü, Prettier sabit noktası, eski parça
silme, yinelenen kimlikte yazmadan durma; süre tahmincisi elle sayılmış fikstürde 15 sözcük / 1 aksiyon / 0,2 dk ve
sözcük kapısı; iskelet geçici köke yazılıp derlenir ve 5 golden path'i geçer; sprite paleti/ifadeleri/doğrulaması.

## 2. Kullanıcı düzeltmesi (2026-10-20) ve uygulanışı

"Dava #07'de hikâye yok" kararı üzerine:

1. **Önce hikâye:** hikâye kitabı şablonu logline, soğuk açılış, karakter sesleri, sahne listesi (dk + sözcük), ters
   köşeler ve sonuç başına epiloglarla başlar; kılavuz §1 "mekanik sahneye asılır" kuralını koyar. İskelete `PROLOG`
   node'u eklendi.
2. **Sözcük bütçesi:** `WORD_BUDGET = { floor: 10 000, min: 15 000, max: 25 000 }`; `TIPIK` 10 binin altındaysa kapı
   düşer ("HİKÂYE YOK"), 15–25 bin dışı uyarıdır.
3. **Madde atfı:** iskeletin konuşma satırlarından atıflar çıkarıldı; kılavuz atfı geri bildirim, rapor, `legalNote`,
   hüküm ve mentor açıklamasına yönlendirir.
4. **Süre modeli:** `dakika = sözcük / 180 + aksiyon × 6 sn / 60` (`lib/duration.ts`'te tek yerde, kalibrasyon sabiti
   olarak). Kapı süreyle **ve** sözcük tabanıyla birlikte karar verir; kısa metinli bir dava aksiyon ekleyerek
   geçemez (test: 5 000 sözcük + 700 aksiyon ≈ 98 dk → KALDI).

## 3. Dava #07 kalibrasyonu

`npm run case:duration -- gece-bekcisinin-sirri` (Dava #07'de `TIPIK` yok; hepsi listelenir, kapı "tipik yol yok" der):

| Yol | Sonuç | Sözcük | Aksiyon | 180 sözcük/dk | (ilk model, 160 sözcük/dk) |
|---|---|---|---|---|---|
| G1 | BERAAT_B | 1 596 | 63 | **15,2 dk** | 16,3 dk |
| G2 | BERAAT_E | 1 398 | 55 | **13,3 dk** | 14,2 dk |
| G3 | INDIRIM | 1 378 | 53 | 13,0 dk | 13,9 dk |
| G4 | MAHKUMIYET | 1 018 | 35 | 9,2 dk | 9,9 dk |
| G5 | IKRAR | 1 293 | 50 | 12,2 dk | 13,1 dk |
| W | çöküş | 856 | 30 | 7,8 dk | 8,4 dk |

- Sayılan metin: yeni görünen satırlar, STORY blokları, ifade parçaları, sunulan seçeneklerin etiket/açıklaması,
  görüşme hedefleri, belge hücreleri, son aksiyonun yanıt ve geri bildirimi, RESULT'ta ceza/hüküm/gerekçe (aynı metin
  yol başına bir kez). Bu yüzden G1 1 596 sözcüktür (kullanıcının "34 node'da 1 154 sözcük" sayımı yalnızca anlatı).
- Tasarımın 25–45 dk tahminine karşı model 13–15 dk verir: tipik yol (G2) yeni hedefin **%9'u** sözcük (1,4 bin / 15
  bin) ve 90 dakikanın **%15'i**. Dava #07'nin 90–120 dakikaya genişletilmesi (lineup) yaklaşık 10 kat metin ister.
- İskelet: TIPIK 7,6 dk, 616 sözcük, 42 aksiyon (kapı bilerek düşer; yer tutucu metin).

## 4. Doğrulayıcı bütçeleri (uzun dava önerisi)

`case:validate` varsayılanı: **`maxStates` 20 000, `walks` 400, `maxMs` 600 000** (sayı bütçeleri deterministik;
`maxMs` yalnızca sert güvenlik sınırı). Ölçümler (Apple Silicon, Node 24):

| Dava | Bütçe | Durum / geçiş | Süre | Sonuç |
|---|---|---|---|---|
| Dava #07 | 20 000 / 400 | 36 116 / 394 783 | 53 sn | PASSED, kapsam node 34/34, seçenek 107/107, kural 25/25, delil 24/24 |
| Dava #07 | 50 000 / 400 | 66 489 / 933 549 | 72 sn | aynı kapsam |
| İskelet | 20 000 / 400 | ~24 000 / ~234 000 | 12 sn | PASSED, tam kapsam, 4 sonuç |
| İskelet | 50 000 / 800 | 55 070 / 1 304 371 | 72–111 sn | aynı kapsam |

Öneri: uzun davada 20 000 / 400 ile başla (1–4 dk); kapsamda UNREACHED_* kalırsa `--max-states 50000 --walks 800`.
BFS uzun davada her zaman kesilir (SIMULATION_INCOMPLETE uyarısı beklenir); güvence golden path'lerden ve yürüyüşlerden
gelir. **Eksik seçenek:** `ExploreOptions` artık `walkSteps`, `escapeBudget`, `frontierSample` alıyor ama
`ValidateOptions` / `validatePackage` yalnızca `maxStates`, `walks`, `maxMs`, `strict` geçiriyor; uzun dava için
gerekenler aşağıda (öneri 2). `packages/*` değiştirilmedi.

## 5. Önerilen şema / motor / doğrulayıcı değişiklikleri

1. **Sonuç başına epilog (şema + motor + istemci).** `OutcomeDef.epilogue?: ResponseBlock[]` (ya da RESULT'tan önce
   sonuca göre seçilen bir kapanış node'u). Bugün epilog yalnızca `verdictText`/`reasoning` ile ya da son sözden önce
   bayraklarla dallanan bir sahneyle yazılabiliyor; `{score:'final'}` RESULT dışında kullanılamadığı için kapanış
   sahnesi sonucu kesin bilemez. Kullanıcının "sonuç başına epilog" şartı için en değerli değişiklik budur.
2. **`ValidateOptions`'a `walkSteps`, `escapeBudget`, `frontierSample` (+ CLI bayrakları).** Varsayılan `walkSteps` 400;
   uzun bir davanın tipik yolu 150–300 aksiyon, yürüyüşler golden önekin rastgele bir noktasından başlıyor. Öneri:
   `walkSteps ≥ 2 × TIPIK uzunluğu` (≈ 600–1 000), `escapeBudget` 20 000. Aksi hâlde SOFTLOCK_UNVERIFIED uyarıları
   (`--strict`'te hata) artar.
3. **Uzun anlatı için sayfa.** Bir node tek satır bloğu gösterir; 300–800 sözcüklük bir prolog ya bir node'a sığar
   (istemci satırları sayfalar) ya da CONTINUE zinciriyle bölünür (her "Devam" 6 sn sayılır ve node sayısını şişirir).
   İstemci sözleşmesinde `lines`'ın daktilo + sayfa ile gösterileceği açıkça yazılmalı; gerekirse STORY'ye
   `pages?: ResponseBlock[][]`.
4. **Okunmayan bilgi bayrakları.** UNREAD_VARIABLE uyarı; uzun davada "sert ton bilgi verdi ama hiç kullanılmadı"
   hikâye hatasıdır. `--strict`'te hata olması ya da `analysis: 'narrative'` ile bilinçli işaretlenmesi önerilir.
5. **Sözcük sayımının doğrulayıcıya taşınması.** Süre/sözcük kapısı şimdilik kitte; yayın kapısı (plan §9) için
   `validatePackage` raporuna `duration` alanı eklenebilir (aynı sabitler).
6. **Dava kaynağının tip denetimi.** tsx tip denetlemez; `case:build` tipi bozuk kaynağı da çalıştırır. Kök
   `typecheck`'e `content/src/**/*.ts`'i kapsayan bir tsconfig eklenmesi (ilk dava geldiğinde) önerilir.

## 6. Riskler

- **Süre modeli kalibre değil.** 180 sözcük/dk ve 6 sn/aksiyon varsayımdır; Dava #07 tasarım tahmini (25–45 dk) ile
  model (13–15 dk) arasında 2–3 kat fark var. Gerçek oyun testiyle sabitler `lib/duration.ts`'te ayarlanmalı; değişince
  bütün davalar yeniden ölçülür.
- **Sözcük bütçesi ile süre üst sınırı çelişir.** 180 sözcük/dk'da 25 bin sözcük yalnızca okuma için 139 dk'dır;
  ~20 binin üstünde (120 aksiyonla) 120 dk aşılır. Kılavuz pratik hedefi 15–18 bin sözcük + 100–180 aksiyon olarak verir.
- **Doğrulayıcı süresi.** 4–10 kat büyük davalarda tek `case:validate` 1–4 dk sürebilir; 15 ajan paralel çalışınca
  makine yükü artar. Bütçeler sayıyla deterministik; `maxMs` 10 dk sert sınırdır.
