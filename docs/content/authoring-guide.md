# Müdafaa — Dava Yazım Kılavuzu

> Bu kılavuz 15 davanın (docs/content/lineup.md) her birini yazan ajanın uyacağı kurallardır. Yazım kiti
> `tools/content/src/kit/`, komutlar `npm run case:*`. Ölçümler ve gerekçeler: docs/content/kit-report.md.
>
> **Kullanıcı kararı (2026-10-20):** Dava #07 "hikâyesiz" bulundu: 34 node'da ~1 150 sözcük; 90–120 dakikalık bir dava
> değil, hukuk sınavı gibi okunuyor. Bu yüzden: **önce hikâye**, tipik yolda **15–25 bin sözcük**, madde atıfları
> karakterlerin ağzında değil geri bildirimde. Dava #07 mekanik kalıpları için örnektir; hikâye yoğunluğu için örnek
> **değildir**.

## 0. İş akışı

| Adım | Komut / dosya | Çıktı |
|---|---|---|
| 1. İskelet | `npm run case:new -- <slug> <numara>` | `content/src/<slug>/` (çalışan örnek dava), `docs/content/<slug>.md`, `docs/legal/<slug>.md` |
| 2. Hikâye kitabı | `docs/content/<slug>.md` §1–6 | Logline, prolog, karakterler, sahne listesi, ters köşeler, epiloglar (kod yazmadan önce) |
| 3. Hukuki çerçeve | `docs/legal/<slug>.md` | Maddeler, ceza hesabı, mevzuat.gov.tr doğrulaması |
| 4. Kaynak | `content/src/<slug>/*.ts` | Sahneleri kit yardımcılarıyla node'lara dök |
| 5. Derle | `npm run case:build -- <slug>` | `content/cases/<slug>/NN-*.json` (Prettier biçiminde), derleme hatası → çıkış 1 |
| 6. Doğrula | `npm run case:validate -- <slug>` | Doğrulayıcı raporu + süre/sözcük kapısı; 0 hata ve kapı ✓ → çıkış 0 |
| 7. Süre | `npm run case:duration -- <slug>` | Golden path başına sözcük, aksiyon, dakika; `TIPIK` kapısı |
| 8. Görseller | `npm run case:scenes -- <slug>`, `npm run case:sprite-preview -- <ad>` | Sahne PNG'leri, sprite önizlemesi |

Ara aşamada süre kapısını geçici olarak susturmak için: `npm run case:validate -- <slug> --no-duration-gate`.
Teslimde kapı açık olmalıdır.

Kaynak düzeni (iskelet böyle gelir; parçalar bölünebilir, iki basamaklı önek zorunludur):

```
content/src/<slug>/
  index.ts            default export defineCase(() => withDiscoveryPaths({ '00-meta': …, '10-cast': …, … }))
  shared.ts           bölümler (chapter), soruşturma evreleri (phase), duruşma salonları (court)
  meta.ts             00-meta: künye, skor, yüklemler, değişkenler
  cast.ts             10-cast · evidence.ts 20-evidence · scenes.ts 30-scenes (+ scenes/*.html)
  briefing.ts         40: prolog + brifing · investigation-1.ts 50 · hearing-1.ts 60 · investigation-2.ts 70
  trial.ts            80: son celse · outcomes.ts 90 · report.ts 95 · tests.ts 99 (golden path'ler)
```

Uzun bölümler alt parçalara ayrılır (`52-investigation-1-tanıklar`, `84-trial-capraz-2`…). Her anahtar bir JSON
dosyasıdır; parçalar ad sırasıyla birleşir (diziler uç uca eklenir).

## 1. Önce hikâye

1. **Hikâye kitabı koddan önce gelir.** `docs/content/<slug>.md` §1–6 dolmadan kaynak yazılmaz: logline ve tema,
   soğuk açılış (prolog), karakterler, gerçek ve kronoloji, sahne listesi (dramatik vuruşlar, dakika ve sözcük
   bütçesiyle), ters köşeler ve sonuç başına epiloglar.
2. **Mekanikler sahnelere asılır, tersi değil.** Önce "bu sahnede ne değişiyor?" sorusu yanıtlanır (yeni bilgi, karar,
   çatışma, duygu); sonra o değişimi oyuncuya yaptıracak mekanik seçilir. "Bir DOCUMENT ekranı lazım" diye belge
   uydurulmaz.
3. **Her karakter ayrı bir ses.** Motivasyon, sır, konuşma biçimi (ağız, tik, sözcük seçimi, cümle uzunluğu) hikâye
   kitabında yazılı olur ve her replikte duyulur. Mübaşir bile kendi tonuyla konuşur. Bürodaki mentor Leyla Erdem
   sakin ve öğreticidir; asistan kadrosu sabittir.
4. **Soğuk açılış.** Her dava, oyuncu dosyayı açmadan önce bir sahneyle başlar (300–800 sözcük): olay gecesinden ya
   da yakalanıştan bir an. İskelette `PROLOG` node'u başlangıç node'udur.
5. **Ters köşeler hazırlanır.** Her ters köşenin en az iki ipucu önceden ekilir (bir sahne nesnesi, bir görüşme satırı,
   bir belge hücresi). Ters köşe "kimsenin bilmediği bir şeyin" birden çıkması değildir.
6. **Sonuç başına epilog.** Şema RESULT'tan sonra sahne taşımaz (kit raporu, öneri 1). Bugün epilog şöyle yazılır:
   karar ekranının `verdictText` + koşullu `reasoning` parçaları + (varsa) `ethicsCard`; ayrıca son sözden önce,
   oyuncunun duruşmadaki kazanımlarına göre (bayrak/yüklem; `{score:'final'}` burada kullanılamaz) dallanan kısa bir
   kapanış sahnesi (`decisionNode` → STORY → hüküm). Her sonuç sınıfı için en az 150–300 sözcük kapanış metni olur.
7. **Madde atfı karakterin ağzında değil.** Gündelik konuşmada "(CMK 201/1)" geçmez. Atıf; seçenek geri bildiriminde
   (`good` / `bad` / `neutral`), rapor ipucunda, delil `legalNote`'unda, hüküm metninde ve mentorun açıklamalarında
   yer alır. Hâkim usul cümlelerini sade dille kurar ("Müdafi, diyeceğiniz?"); avukatın A–D seçenek etiketleri kısa
   bir hukuki dayanak içerebilir (oyuncunun kararıdır).
8. **Ekran metni hikâyedir.** Satırlar (`lines`), yanıtlar (`responses`), ifade parçaları ve geri bildirimler davanın
   sözcük bütçesini taşır. Bilgi kartları (delil açıklaması) ölçülmez; hikâyeyi oraya gömme.

## 2. 90–120 dakikalık yapı

Ölçüm modeli (`case:duration`): `dakika = sözcük / 180 + aksiyon × 6 sn / 60`. Sözcükler, tipik yolda oyuncuya **yeni**
gösterilen metindir (aynı metin bir kez sayılır). Tipik yol (`TIPIK`) için hedef:

- **15–25 bin sözcük** (10 binin altı kapıdan geçmez: "hikâye yok");
- **90–120 dakika**.

İkisi birlikte tutmalıdır: 180 sözcük/dk ile 18 bin sözcük 100 dakikalık okumadır, aksiyonlar (100–250 × 6 sn =
10–25 dk) üstüne eklenir. Pratik hedef **16–19 bin sözcük ve 120–220 aksiyon**; 21 binin üstünde 120 dakika sınırı
aşılır (bkz. kit raporu).

| Bölüm | Node'lar (iskelet) | ~dk | ~sözcük | İçerik |
|---|---|---|---|---|
| Prolog + brifing | PROLOG, BR_* | 8–12 | 1 500–2 500 | Soğuk açılış; büroda dosya devri (mentor); ceza aralığı sorusu (A–D); dosya ekranı; strateji |
| Soruşturma 1. evre | INV1_* | 25–35 | 4 000–5 500 | 2–3 gün × 3 eylem puanı; 3–6 mekân/tanık; müvekkil görüşmesi; olay yeri araması; belge; dilekçe; çıkarım tahtası |
| 1. celse | H1_* | 12–18 | 2 000–3 000 | Açılış, iddianame, sanık savunması (oyuncu yönlendirir), ilk tanık ya da delil tartışması, 1–2 A–D usul kararı |
| Ters köşe + 2. evre | H1_02, INV2_* | 20–28 | 3 500–4 500 | Ara kararla gelen yeni bilgi; 1–2 gün; yeni tanık/mekân; gecikmeli teslimler |
| Son celse | T_* | 25–35 | 4 000–5 500 | 2–3 tanığın çapraz sorgusu; 3–6 itiraz/A–D kararı; mütalaa ve cevap; esas savunma; son söz |
| Karar + epilog | T_08, R_KARAR | 3–6 | 600–1 200 | Hüküm, gerekçe, sonuç başına kapanış |

Zorluk 5 davalarda (lineup #14–15) son celse iki ya da üç celseye bölünür (`courtSession` başına bir `court()` salonu).

## 3. Tempo

- **Sık ve anlamlı seçim.** Okuma aralığı en çok ~400 sözcüktür (≈ 2 dk); ardından bir karar gelir. "Devam" düğmesi
  bir karar değildir; bir sahnede art arda en çok iki "Devam".
- **Dolgu yok.** Her satır ya karakteri, ya gerçeği, ya da gerilimi ilerletir. Aynı bilgiyi iki tanığa söyletme;
  söyletiyorsan çelişki için söylet.
- **Sonuçlu seçimler.** Her A–D kararının en az bir sonraki sahnede görünür bir izi olur (yanıt, kalp, ikna, bayrak).
  Sadece skoru değiştiren seçenekler toplamın yarısını geçmez.
- **Bilgi ödülü.** Soruşturmada her eylem puanı yeni bir bilgi, ipucu ya da karakter anı verir; boş etkinlik yok.
- **Ritim.** Soruşturma ile duruşma dönüşümlüdür; uzun bir okuma bloğunun ardından mekanik bir ekran (arama, inceleme,
  tahta) gelir.

## 4. Mekanikler

Her dava her mekaniği **en az bir kez** kullanır; zorluk arttıkça karışım büyür. Kit yardımcısı ↔ Dava #07 karşılığı:

| Mekanik | Kit | Dava #07 örneği | Zorluk 1 | Zorluk 3 | Zorluk 5 |
|---|---|---|---|---|---|
| Soruşturma hub'ı, eylem puanı, gün sonu | `phase().hub/activity/free/dayEnd` | INV_HUB, tg_day_end | 1 evre | 2 evre | 2–3 evre |
| Görüşme (konu × ton) | `interview`, `topic`, `mood`, `objective` | INV_GORUSME | 1 | 2 | 3+ |
| Serbest konuşma | `conversation` | INV_T_HUS | 2 | 3–4 | 5+ |
| Olay yeri araması | `sceneSearch`, `sceneDef`, `sceneObject` | INV_ARAMA | 1 | 1–2 | 2 |
| Belge incelemesi (aletler) | `documentExam`, `row`, `tool`, `examine` | INV_INCELEME | 1 | 1–2 | 2–3 |
| Çıkarım tahtası | `deductionBoard`, `recipe` | INV_CIKARIM | 1 tarif | 2–3 tarif | 4+ tarif, çeldiriciler |
| Tanık ifadesi: BASTIR, DELİL SUN, İTİRAZ | `court().testimony`, `statement`, `hl`, `pressRule`, `presentRule`, `objectRule` | C_06 | 1 tanık | 2 tanık | 3 tanık, celseler arası |
| A–D usul/esas kararı | `court().objection`, `choiceNode`, `option` | C_01, C_08–C_11 | 3–4 | 5–7 | 8+ |
| Gecikmeli delil | `deliver`, `phase().dayEnd({deliveries})` | ev_ariza_kaydi, ev_hts | 1 | 2–3 | 4+ |
| Çöküş kesintisi | tetikleyici (iskelette `tg_cokus`) | tg_cokus | var | var | var |
| Rapor ipuçları | `hint`, `missedEvidence` | report.hints | her önemli delil | | |

Notlar ve doğrulayıcının yakaladığı tuzaklar:

- **Hub:** etkinlikler `phase.activity(id, etiket, hedef, { once: true })` (NAVIGATE + maliyet + `{push}`); alt ekran
  `back(…)` ya da `$return` ile döner. Yığın derinliği ≤ 4, aksiyon başına ≤ 16 node geçişi (motor). "DURUŞMAYA GİT"
  0 EP'lik, `confirm`'lu bir `nav`'dır; son gün EP bitince yalnızca 0 EP'lik seçenekler kalır.
- **Gün sonu:** `phase.dayEnd` STORY node'u + tetikleyici (`ap ≤ 0 ∧ day < days`) üretir; teslimler o node'dan
  bulunur. Teslim **son gün** istenirse gün sonu olmadığından bir sonraki teslim noktasına (celse açılışı) konur.
- **Görüşme:** konu maliyeti konuda (`cost: costOf('min', 3)`), tona özgü soru/etki/yanıt varyantta. `toneEffects`
  her tonun ortak etkisini (güven ±, `tone`) bütün konulara açıkça ekler. Sert ton bilgi verdiyse o bilgi bir yerde
  **okunmalı** (UNREAD_VARIABLE uyarısı; Dava #07'de dört bayrak okunmuyor).
- **Arama / belge / tahta:** her ekran kendi FALLBACK'ini alır (`miss: fallback(id, 'TAP' | 'EXAMINE' | 'COMBINE')`);
  kit bunu zorunlu tutar (MISSING_FALLBACK). Tahtadaki her kart `combinable` olmalı (`clue()` varsayılanı).
- **Tanık ifadesi:** `presentMiss` (yanlış delil) zorunlu; itiraz gerekçesi varsa `objectMiss` da. Kurallar yazım
  sırasıyla eşleşir; aynı ifadeye iki BASTIR için `visibleWhen`/`enabledWhen` ile sıralı kurallar yaz (Dava #07
  PR_S3A/B). Vurgu (`hl`) çelişki ancak bastırıldıktan ya da ilgili ipucu bulunduktan sonra yanar.
- **Sunulabilir delil** her zaman bir PRESENT kuralında geçmeli (UNUSED_PRESENTABLE); savcılık delili için Dava #07'deki
  gibi cezalı bir kural yaz.
- **Delil başlığı** bulunmadan önce hiçbir ekran metninde geçmez (LEAK hatası).
- **Bulunma yolu:** her DISCOVER'ın bir yolu olmalı (DISCOVERY_MISMATCH). `withDiscoveryPaths` koşulsuz olanları ekler;
  koşullu teslim (`requires`) yolları `deliver()` ile açıkça yazılır.
- **Ham nesne her zaman geçerli.** Yardımcısı olmayan her şey şemadaki nesne olarak yazılır; yardımcılar ham alanları
  olduğu gibi geçirir (`option('X', '…', { visibleWhen, repeat, tags, confirm })`).
- **Kimlikler** yazarındır ve ad alanı içinde tekildir; `case:build` yineleneni yazmadan önce parça:yol konumlarıyla
  durdurur. Önerilen önekler: node `BR_`, `INV1_`, `H1_`, `INV2_`, `T_`; seçenek node önekinden türetilir (`T04_A`);
  delil `ev_`, ipucu `clue_`, çıkarım `ded_`, nesne `ob_`, sahne `sc_`, tetikleyici `tg_`, gerekçe `g_`.

## 5. Skor

- **Altı kategori:** HUKUKI_BILGI, DELIL_ANALIZI, ARASTIRMA, SORGULAMA, SAVUNMA_STRATEJISI, USUL_BILGISI (`categories()`
  sabit etiketlerle; tavsiyeler davaya özgü: zayıf <%40, orta %40–75, güçlü >%75).
- **Döküm satırları** (Karar ekranı): Delil toplama = ARASTIRMA + DELIL_ANALIZI · Çapraz sorgu = SORGULAMA · İtiraz
  isabeti = USUL_BILGISI + HUKUKI_BILGI · Savunma = SAVUNMA_STRATEJISI · Hatalı delil (`line: 'hatali'`). Her
  kategori bir satıra bağlı olmalı (SCORE_LINE_UNMAPPED).
- **Tutar ölçeği** (Dava #07): olay yeri nesnesi +40/+60, ıska −10; belge isabeti +100/+150, yanlış alet −20; tarif +300,
  yanlış çift −50; BASTIR +25/+50; doğru sunum +300, kısmi +100, yanlış −150; usul itirazı +50…+150, dayanaksız −50;
  esas savunma +150/+200 (strateji çarpanı yalnızca uyumlu esas savunmada: `strategyAmount(200, 'MASUMIYET')`).
- **İkna ve güvenilirlik:** `pers` (heyet iknası, `meter10`, başlangıç 2) iyi sunum/itirazla artar, sonuç koşullarına
  girer; `cred` (güvenilirlik, `hearts` 5) yanlış delil ve dayanaksız itirazla düşer, 0'da çöküş kesintisi; bonus
  `cred × 100` (`bonuses`). `trust` müvekkil güveni (görüşmede ton), `min`, `taps`, `exam_left` kaynaklardır.
- **XP:** `xp(f, { ethicsVar: 'ethics' })` = ⌊final / 10 × f⌋; etik ihlalinde yarı. Ölçek: 223/2-b 1,2 · 223/2-e 1,0 ·
  indirim/farklı nitelendirme 0,85 · mahkûmiyet 0,6 · çöküş 0,3 · etik ihlali sonucu 0. Uzun davada final skor da
  büyür; `scaleMax`'ı teorik tavanın (doğrulayıcı "final skor aralığı") ~%95'ine koy.
- **Eşikler:** sonuç koşullarındaki `finalAtLeast(n)` değerleri eşik çubuğunun `from` değerleriyle aynı olmalı
  (THRESHOLD_MISMATCH). Tipik yol (223/2-e) beraat bandının biraz üstünde, indirim yolu indirim bandında kalmalı.
- **Sonuçlar:** en az dört sınıf (iki beraat, indirim ya da farklı nitelendirme, mahkûmiyet); öncelikler benzersiz;
  son sonuç koşulsuz (`always`). Davaya özgü "kötü avukatlık" sonu olabilir (etik kartıyla).

## 6. Yazım üslubu

- Türkçe, doğal diyalog; kısa ve orta cümleler karışık. Resmî dil yalnızca hüküm metninde ve usul cümlelerinde.
- Tırnak: “ ” (ör. etiket `'“Ben yapmadım.”'`); kesme işareti ’ (Kerem’in). Negatif skor etiketleri U+2212: `−150 SKOR`
  (ASCII `-` değil).
- Glif bağımlılığı yok: ■ ● ♥ ✓ ‹ › gibi simgeler metne yazılmaz (istemci bunları çizer).
- Konuşmacı kimliği karakter kimliğidir; `player` (Deniz'in kendi satırı), `narrator`. Kadroda olmayan kimlik derleme
  hatasıdır.
- Yüz ifadeleri: `normal | mutlu | kizgin | saskin | uzgun`; ruh hâli kuralları görüşmede sprite ifadesini seçer.
- Başlıklar: `eyebrow` büyük harf (DAVA #NN · SORUŞTURMA); `chapter` ilerleme etiketidir.
- Hitap: mahkemeye "Sayın Başkan"; savcıya "Sayın Savcı".

## 7. Hukuki doğruluk

- Güncel TCK (5237), CMK (5271) ve ilgili kanunlar; atıf madde/fıkra/bent düzeyinde ve doğru (TCK 142/2-h, CMK 223/2-e).
- Her madde mevzuat.gov.tr'deki güncel metinle karşılaştırılır; kontrol `docs/legal/<slug>.md` §1 tablosuna erişim
  tarihiyle yazılır.
- Ceza aritmetiği adım adım ve sınırlar içinde: temel ceza → artırım → indirim (TCK 61 sırası); TCK 62/1 altıda bir;
  HAGB (CMK 231/5) ve erteleme (TCK 51/1) ≤ 2 yıl şartı; hükümde istinaf (CMK 273/1, tebliğden itibaren iki hafta).
- Gerçekçi usul: görevli mahkeme ve heyet; celse aşamaları (CMK 191 açılış, 201 soru, 206 delil reddi, 215 diyecek,
  216 mütalaa/son söz, 217 takdir, 226 ek savunma, 231/4 hükmün ayakta dinlenmesi).
- Hassas konu sınırı (lineup): **cinsel suçlar, çocuklara yönelik suçlar ve terör davaları yok.**
- Etik ihlal seçenekleri doğru maddeye bağlanır (Av.K., TCK 136, 267, 270, 277) ve `ethics` sayacını artırır.
- Hukuki öz-inceleme tamamlanınca `meta.legalReview = { status: 'APPROVED', by: 'Claude', at: 'YYYY-AA-GG' }`.

## 8. Kapılar

**Doğrulayıcı** (`case:validate`): `loadCase` + `validatePackage`, uzun dava bütçeleriyle (`maxStates` 20 000,
`walks` 400, `maxMs` 600 000; `--max-states`, `--walks`, `--max-ms` ile değişir). Teslim şartı:

- 0 hata (PASSED); her sonuca bir golden path; softlock / çıkmaz / sızıntı yok;
- SIMULATION_INCOMPLETE uzun davada beklenir (uyarı); UNREACHED_* uyarıları gözden geçirilir;
- uyarılar (UNUSED_PRESENTABLE, UNREAD_VARIABLE, INDISTINGUISHABLE_CHOICES, THRESHOLD_MISMATCH) temizlenir.

Süre: iskelet ~12 sn, Dava #07 ~53 sn; uzun dava 1–4 dk beklenir.

**Süre ve sözcük** (`case:duration`, `case:validate`'in sonunda da çalışır): `TIPIK` golden path'i 90–120 dk **ve**
≥ 10 000 sözcük olmalı (15–25 bin hedef; altı ve üstü uyarı). Golden path'ler: her sonuç için en az bir yol, ayrıca
çöküş yolu; final pencereleri (`finalMin`/`finalMax`) ölçülen değerin ±%5'i.

**Biçim:** `case:build` JSON'u Prettier biçiminde yazar; `npx prettier --check content/src/<slug> content/cases/<slug>`
temiz olmalı. Tip denetimi: `npx tsc -p tools/content/tsconfig.json --noEmit` kitin kendisini; dava kaynağını
`case:build` çalıştırır (tsx tip denetlemez; editörde kırmızı kalan satırı bırakma).

## 9. Sprite ve sahne iş akışı

- **Sprite:** ortak karakterler `content/shared/sprites/*.json` (tasarımdan çıkarılmış, 21 adet; `sharedSprite('ad')`).
  Yeni karakter `content/shared/sprites/<slug>-<ad>.json`: `{ id, rows: [20 satır × en çok 16 karakter], skin?, noEyes?,
  noMouth? }`; harfler ortak paletten (42 renk, `tools/content/src/lib/sprite.ts`), `.` saydam. Satır 4–8 yüz
  ifadesinin çizildiği bölgedir (göz 5, ağız 7–8); `skin` ten harfidir (varsayılan `s`).
  `npm run case:sprite-preview -- <slug>-<ad>` doğrular (16×20, palet) ve beş ifadeyi yan yana PNG olarak geçici
  dizine yazar (`--out <dizin>`); dosyayı açıp bak.
- **Sahne:** `content/src/<slug>/scenes/<ad>.html` statik HTML'dir (betik, düğme, ağ adresi yok); `#scene` elementi
  SceneDef'in `width × height` sahne biriminde olur. Renkler tasarımın paletinden (zemin #141026, duvar #2b2350, kenar
  #120d1c). `npm run case:scenes -- <slug>` ağsız Chromium'da ×4 render eder:
  `content/cases/<slug>/assets/scenes/<ad>@4x.png`; derlenmiş davadaki SceneDef boyutuyla karşılaştırır. Dokunma
  alanları ve rozetler HTML'e değil `sceneObject`'lere yazılır; golden path'te `step.tapCenter(OB_X)`.
  (İlk çalıştırmada tarayıcı yoksa: `npx playwright install chromium`.)

## 10. Kit başvurusu (özet)

| Dosya | Yardımcılar |
|---|---|
| text | `L(konuşmacı, metin, ifade?)`, `N`, `P`, `says(...)`, `when(koşul, ...)`, `otherwise(...)` |
| expr | koşul: `flag has visited chosen met found ref not all any always cmp v atLeast oneIf evidenceCount finalScore`; etki: `set inc dec raise score discover meet mark ifThen goto end scores strategyAmount` |
| choices | `option(id, etiket, { discovers, score, good/bad/neutral, category, effects, next, … })`, `cont`, `nav`, `back`, `rawChoice`, `withNext` |
| nodes | `chapter`, `story`, `choiceNode(id, { prompt, next, choices })`, `evidenceNode`, `decisionNode`, `resultNode` |
| investigation | `phase({ hub, dayEnd, trigger, dayVar, apVar, days, ap })` → `variables start dayLines activity free hub dayEnd`; `deliver(node, [{ evidence, requires, hint }])` |
| dialogue | `interview(id, { room, tones, toneEffects, topics, moodRules, objectives, finish })`, `topic(id, etiket, { cost, tones: { soft, hard } })`, `conversation`, `mood`, `objective`, `costOf` |
| mechanics | `sceneSearch`, `sceneDef`, `sceneObject`, `sceneAsset`, `rect`, `centerOf`; `documentExam`, `row`, `tool`, `examine`; `deductionBoard`, `recipe`; `fallback` |
| court | `court({ bench, counsel, hud, chapter, eyebrow })` → `base stage objection testimony`; `statement`, `hl`, `pressRule`, `presentRule`, `objectRule`, `ground`, `courtSession`, `announce` |
| data | `flags counter hiddenInt hiddenEnum meter labelEnum`; `sharedSprite character`; `evidence clue insight` (varsayılan bayraklarla); `categories CATEGORY_LABELS thresholdBar xp`; `outcome because finalAtLeast hint missedEvidence` |
| golden | `step.{choose tap tapCenter examine combine press present object}`, `chooseAll`, `goldenPath(ad, beklenen, ...adımlar)`, `TYPICAL_PATH` |
| case | `defineCase`, `withDiscoveryPaths`, `CASE_FORMAT_ID`, `CasePart`, `findDuplicateIds`, `assertUniqueIds` |

## 11. Son kontrol listesi

- [ ] Hikâye kitabı §1–6 dolu: logline, prolog, karakter sesleri, sahne listesi (dk + sözcük), ters köşeler, epiloglar.
- [ ] Prolog ve her sonuç için kapanış metni var; karakterler kendi sesleriyle konuşuyor; gündelik konuşmada madde atfı yok.
- [ ] Bütün mekanikler en az bir kez; karışım zorluğa uygun (§4 tablosu).
- [ ] `npm run case:build -- <slug>` → Derleme: OK.
- [ ] `npm run case:validate -- <slug>` → PASSED, 0 hata, uyarılar gözden geçirildi; KAPI ✓.
- [ ] `TIPIK`: 90–120 dk ve 15–25 bin sözcük (taban 10 bin); her sonuca golden path; çöküş yolu.
- [ ] Eşik çubuğu = sonuç eşikleri; XP ölçeği; `scaleMax`.
- [ ] `docs/legal/<slug>.md`: maddeler mevzuat.gov.tr'de doğrulandı (tarihli); ceza hesapları; hassas konu yok;
      `legalReview` onaylandı.
- [ ] Yeni sprite'lar `content/shared/sprites/<slug>-<ad>.json` ve önizlemesi; sahne PNG'leri `case:scenes` ile.
- [ ] `npx prettier --check` temiz; `npm run lint` temiz.
- [ ] `docs/content/<slug>.md` §13'e `case:duration` çıktısı yapıştırıldı.
