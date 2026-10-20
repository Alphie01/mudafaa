# Müdafaa — Legal Case Simulator · Uygulama Planı

## 1. Bağlam
`/Users/onderalpselcuk/works/mudafaa` boş bir klasör; sistem sıfırdan kurulacak. Spesifikasyon: avukatlar ve hukuk öğrencileri için seçim tabanlı, **deterministik ve backend-otoriter** bir hukuk simülasyonu (Flutter + TypeScript/NestJS + PostgreSQL). Oyun sırasında **hiçbir LLM çağrısı yok**; AI yalnızca admin tarafında yeni dava taslağı üretir, içerik doğrulanıp onaylandıktan sonra normal PostgreSQL verisi olarak oynanır. Ana tasarım sistemi claude.ai'daki **"Müdafaa — Avukatlık Oyunu"** canvas'ı (piksel-art; 11 mobil ekran + karakter sayfası + sprite bileşeni). Mevcut ekranlar değiştirilmeden birebir uygulanacak, eksik ekranlar aynı dille eklenecek.
**İlk hedef:** tasarımın baştan sona anlattığı **Dava #07 "Gece Bekçisinin Sırrı"** uçtan uca oynanabilir olacak; farklı seçimler farklı sonuçlara götürecek (iki tür beraat, indirim/farklı nitelendirme, mahkûmiyet). Ardından admin panel (görsel node editörü) ve AI ile dava üretimi gelecek.

## 2. Kararlar
| Konu | Karar | Kaynak |
|---|---|---|
| İlk dava | Gece Bekçisinin Sırrı (Dava #07) | Siz |
| Admin panel | React + Vite + @xyflow/react (React Flow) | Siz |
| Animasyon | Retro efektler (piksel basma, daktilo, İTİRAZ! sarsıntı + flaş, damga, adımlı geçiş). Ayarlardan kapatılabilir, sistemin "hareketi azalt" ayarına uyar. | Siz |
| Yeni ekranlar | Doğrudan Flutter'da yapılır, aşama sonlarında ekran görüntüleriyle gözden geçirilir. | Siz |
| Giriş | Firebase Auth: e-posta/şifre, Google, Apple, misafir (anonim → hesaba bağlama). Yeni Firebase projesi açılacak. | Siz |
| Flutter | FVM ile projeye özel **Flutter 3.47.7 / Dart 3.13**. Global 3.35.6 ve diğer projeler etkilenmez. | Siz |
| Monorepo | npm workspaces (diğer projelerinizle aynı) | Benim |
| Backend sürümleri | NestJS 12, Prisma 7.10 (8 RC değil) + `@prisma/adapter-pg`, PostgreSQL 17, Redis 8 (`noeviction`), BullMQ 6 + `@nestjs/bullmq` 12, Zod 4, firebase-admin 14, Vitest (+SWC) | Benim |
| Koşul dili | Zod ile doğrulanan, tip güvenli küçük bir AST (json-logic yerine) | Benim |
| İçerik formatı | Tek **CasePackage JSON** formatı (seed, import/export, AI çıktısı, doğrulayıcı girdisi). DB'de ilişkisel ve sürümlü tutulur; yayın değişmez bir snapshot üretir; oturum o sürüme sabitlenir. | Benim |
| API | `/v1` öneki ve camelCase JSON. Spesifikasyondaki yollar korunur. | Benim |
| Skor | Tasarımdaki ölçek (yüzlük puanlar; Beraat eşiği 3.200, tavan ~5.000), dava bazında yapılandırılabilir. Sonuç = skor eşiği + zorunlu bulgular. | Benim |
| Sahneler | Olay yeri arka planları tasarımın kendi HTML'inden 4× PNG olarak üretilir; hotspot isabeti sunucuda hesaplanır. Görüş odası, mahkeme salonu ve adliye illüstrasyonları genel UI olduğu için Flutter widget'ıdır. | Benim |
| Sprite'lar | 16×20 karakter haritası JSON olarak backend'den gelir; palet ve 5 yüz ifadesi Flutter tasarım sistemindedir. | Benim |
| Oturum kuralı | (kullanıcı, dava) başına tek aktif oturum. "TEKRAR OYNA" yenisini açar, eskisi ABANDONED olur. XP yalnızca önceki en iyi sonucu aşan kısım için verilir (farm yok). | Benim |
| Diğer | Yalnızca Türkçe arayüz · oyuncu adı profildeki `displayName` (varsayılan "Deniz Arslan"; sprite sabit) · bundle id `com.monolithyazilim.mudafaa` · AI için Claude API, yalnızca worker sürecinde | Benim |
| Hukuki rakamlar | Tasarımdaki örnek ceza rakamları ve metinleri güncel TCK/CMK'ya göre düzeltilir (ör. "3–7 yıl" → "7,5–15 yıl", "Talep 5 yıl" → "İddianame: 142/2-h, 143"). Ekranlar aynı kalır, yalnızca dava verisi değişir. Ayrıntı: §11 ve Ek A.9. | Benim (hedef kitle avukatlar) |
| Strateji çarpanı | ×1,5 / ×1,2 / ×0,8 yalnızca stratejiyle uyumlu esas savunmanın puanına uygulanır; tüm skora uygulanmaz. Böylece beyan edilen strateji mahkemenin delil değerlendirmesini değiştirmez. | Benim |
| Hub sekmeleri | Tasarımdaki 4 sekme (OLAY YERİ / CEZAEVİ / TANIKLAR / ARŞİV) korunur. Çıkarım tahtası ARŞİV'de 0 EP'lik bir eylem olarak ve İnceleme ekranının CTA'sından açılır. | Benim |
| Hukuki inceleme | `case.json` ve `docs/legal/dava-07.md` hazır olur olmaz (M1.4) siz veya ekibinizden bir avukat inceler; bu sırada API ve ekranlar ilerler. Düzeltmeler yalnızca veriyi ve testleri değiştirir. İnceleme bitene kadar dava geliştirme ortamında "hukuki inceleme bekliyor" işaretiyle yayınlanır; M1 bu işaretle kapanabilir. Üretimde yayın hukuki onay gerektirir. | Siz |
| Ses | M1–M3'te ses yok, M4'te eklenecek. `fx` olay altyapısı ileride sesi de tetikleyecek biçimde kurulur. | Siz |
| Dava #08 | M2 kabulü için **tam** Dava #08 "Kırık Kadeh" (Dava #07 boyutunda; TCK 86 kasten yaralama, meşru müdafaa iddiası) admin panelden, kod değişikliği olmadan benim tarafımdan yazılır; ayrıca hukuki inceleme gerekir. | Siz |
| Spesifikasyonun yeri | Orijinal spesifikasyon M0'da `docs/spec/legal-case-simulator.md`'ye kaydedilir; özeti Ek B'de. Bu planın sessiz kaldığı yerde spesifikasyon geçerlidir; çeliştikleri yerde bu plan geçerlidir (ör. kendi JWT yerine Firebase Auth). | Benim |
| Tasarım render'ı | `.dc.html` dosyalarının istediği `support.js`, artifact'teki `artifact-type/dc-runtime.js`'tir. design-diff, sahne PNG'leri ve ölçümler bu çalışma zamanıyla yerelde render edilir; olmazsa canlı canvas'taki artboard'ların tarayıcıyla ekran görüntüsü alınır. | Benim |

## 3. Tasarım referansı ve sadakat
- **Kaynak:** artifact `A674ys9xVyXBt3hQiHbyr1`. İndirilen dosyalar M0'da `design/reference/` altına kopyalanır; şu an geçici scratchpad'de duruyor, gerekirse Artifact'ten yeniden indirilir.
- **Birebir uygulanacak mevcut ekranlar:** 01 Ana Menü · 02 Dava Dosyaları · 03 Brifing · 04 Soruşturma · 04a Müvekkil Görüşmesi · 04b Olay Yeri Araması · 04c Delil İnceleme · 04d Çıkarım Tahtası · 05 Duruşma · 06 Delil Sunma · 07 Karar ve Skor. Bunlara ek olarak 21 sprite × 5 ifade.
- **Tasarım dili:**
  - Yazı tipleri: Pixelify Sans (400/600/700) + VT323.
  - Palet: ink `#120d1c`, bg `#1d1733`, panel `#2b2350`, gold `#e8b13c`, parchment `#f4e7c5` … (tam liste `PxColors`'ta).
  - `.pxbtn`: 3px ink kenarlık + 4px iç bevel + 4px sert gölge.
  - Bileşenler: parchment kartlar, 44px sekmeler ve geri butonu, renkli etiketli seçenekler, sonuç kutuları, delil kareleri, hotspot işaretleri, karar damgası.
  - Göstergeler: 10 hücreli ikna, kalpler, güven, eylem puanı, ceza aralığı, karar eşiği.
- **Sadakat kuralı:** 390×844 ve sıfır safe-area'da piksel düzeyinde eşleşme; `tools/design-diff` ile ölçülür. Gerçek cihazlarda içerik kaydırılabilir gövde + sabit alt CTA ile taşmadan sığar; görsel dil değişmez.
- **Tasarımda olmayan, yeni yapılacak ekranlar:**
  - Giriş ve hesap: splash, giriş/kayıt/şifre sıfırlama, misafir için "hesabını kaydet".
  - Oyun dışı: kariyer (mobil), ayarlar, dava detayı (kapanan dava / tekrar oynama), dava sonu raporu.
  - Mahkeme: STAGE (açılış, iddianame, ek savunma, mütalaa, savunma, son söz) ve OBJECTION (savcı delili + A–D itiraz).
  - Oyun içi: hub'ın TANIKLAR ve ARŞİV sekmeleri, genel A–D seçim, delil detayı, not defteri ve delil çantası sayfaları.
  - Durumlar: yükleniyor, hata, boş.
  - Referansta animasyon tanımı yok; onaylanan retro set uygulanır.
- **Tasarımdaki tutarsızlıklar:** CSS box-sizing farkından doğuyorlar (KARİYER 60px / AYARLAR 54px; DELİL SUN 68px / 62px; kalp 20×18). Tarayıcıda göründükleri gibi uygulanır; ekran görüntüsü incelemesinde size sorulur.

## 4. Mimari
```
Flutter (Android/iOS/Web) ──HTTPS + Firebase ID token──►  NestJS API  /v1
React admin (M2) ───────────────────────────────────────►   ├─ Auth guard (firebase-admin verifyIdToken, JIT kullanıcı, DB rolleri)
                                                             ├─ GameSessions ─► packages/engine (saf, deterministik, I/O yok)
                                                             ├─ Cases / Content / Admin ─► case-schema, validator
                                                             ├─ PostgreSQL 17 (Prisma 7) · Redis 8 (cache, throttle, BullMQ)
                                                             └─ Worker (APP_ROLE=worker): content-validation, content-generation (Claude, M3)
```
```
mudafaa/
  package.json (workspaces: packages/*, apps/api, apps/admin, tools/*) · tsconfig.base.json · eslint.config.mjs · vitest.config.ts
  docker-compose.yml (postgres, redis; test profili ayrı portlarda) · firebase.json (auth emulator, proje demo-mudafaa)
  packages/case-schema   Zod 4 şemaları + TS tipleri + JSON Schema (AI structured output için)
  packages/engine        compile / start / view / act / report / enumerateActions
  packages/validator     statik kontroller + sınırlı durum uzayı simülasyonu + golden path + CLI
  apps/api               NestJS 12 (prisma/, src/{common,config,database,redis,queues,integrations,modules}, test/e2e)
  apps/admin             React admin (M2)
  apps/mobile            Flutter (npm workspace değil; .fvmrc = 3.47.7)
  content/shared/sprites/*.json · content/cases/gece-bekcisinin-sirri/{case.json, assets/}
  tools/design-diff      Playwright + pixelmatch ile tasarım karşılaştırma
  design/reference/      tasarım dosyalarının kopyası · docs/ (plan, mimari, içerik yazım kılavuzu, hukuki notlar)
```
**İlkeler:**
1. Motor saf ve deterministik: `Date`, `Math.random` ve I/O yasak; ESLint kuralıyla denetlenir.
2. Sunucu otoriter: istemci yalnızca aksiyon gönderir; puan, sonuç ve kilitler hep sunucuda belirlenir.
3. Temizlenmiş görünüm: gizli değişkenler, bulunmamış deliller, bulunmamış hotspot geometrisi, doğru kombinasyonlar ve kilitli seçenekler istemciye hiç gitmez.
4. Sürümlü, değişmez içerik: yayınlanan sürüm bir daha değişmez; oturumlar sürüme sabitlenir.
5. Her aksiyon tek transaction içinde ve idempotent işlenir.
6. AI izolasyonu: oyun kod yolları AI modülünü import edemez (ESLint + dependency-cruiser); modül yalnızca worker'da yüklenir.
7. İstemcide içerik yok: Flutter yalnızca genel UI metinlerini bilir.

## 5. Oyun motoru (`packages/engine`)
Tüm içerik kararlı string anahtarlar kullanır (`n_hub`, `ev_ariza`, `ch_str_masumiyet`). DB uuid'leri motora ve oturum durumuna girmez.

| Node türü | Ekran | Aksiyonlar |
|---|---|---|
| STORY | Brifing (`blocks`: profil kartı, ceza aralığı, olay özeti, savcılık delilleri, strateji grubu) veya anlatı | CHOOSE |
| CHOICE · EVIDENCE | Genel A–D · delil kartı + A–D inceleme (hotspot'un "incele" alt node'u) | CHOOSE |
| INVESTIGATION | Soruşturma hub'ı: sekmeler, gün/eylem puanı, sahne önizleme, delil çantası, hızlı diyalog | CHOOSE |
| DIALOGUE (CONVERSATION / INTERVIEW) | Görüşme: konu × ton, süre, güven, ruh hâli, OLAYI ANLA, ipucu göster | CHOOSE (+variant), PRESENT |
| SCENE | Olay yeri araması: gizli nesneler, büyüteç bütçesi, ıska cezası | TAP, CHOOSE |
| DOCUMENT | Belge inceleme: alet × satır, UV görünümü | EXAMINE, CHOOSE |
| DEDUCTION | Çıkarım tahtası: ipucu çifti → delil | COMBINE, CHOOSE |
| COURTROOM (STAGE / TESTIMONY / OBJECTION) | Duruşma aşamaları · ifade + BASTIR / DELİL SUN / İTİRAZ · savcı delili + itiraz gerekçeleri | CHOOSE, PRESS, PRESENT, OBJECT |
| DECISION | Görünmez yönlendirici (`routes[]`, ilk eşleşen kazanır) | otomatik |
| RESULT | Karar + rapor | — |

- **Seçenek türleri:**
  - OPTION, NAVIGATE, CONTINUE.
  - TOPIC: `variants[]` taşır (ör. yumuşak/sert ton).
  - Parametre eşleşmeli kurallar: EXAMINE, COMBINE, PRESS, PRESENT, OBJECT (`match` alanıyla).
  - FALLBACK `{for: ActionKind}`: hiçbir kurala uymayan girdiyi yakalar (ör. yanlış delil −1 kalp, −150).
  - Sahne nesneleri (`scene_objects` + `scene_hotspots`) TAP kuralı gibi davranır.
- **Hub tamamen veriyle kurulur:**
  - `day` (1–3) ve `ap` (0–3) görünür int değişkenlerdir.
  - Her etkinlik `cost:[{var:'ap',amount:1}]` + `next:{push:…}` taşıyan bir NAVIGATE seçeneğidir; alt node `$return` ile döner (yığın derinliği ≤4).
  - Gün devri bir tetikleyicidir: `ap ≤ 0 ∧ day < 3` → gün+1, ap=3.
  - Soruşturma sonu: `ap = 0 ∧ day = 3` olduğunda EP isteyen eylemler maliyet kapısı nedeniyle kapanır; yalnızca 0 EP'lik eylemler (çıkarım tahtası, DURUŞMAYA GİT) kalır.
  - "DURUŞMAYA GİT" (0 EP, onaylı) her zaman sıradan bir NAVIGATE seçeneğidir.
- **Aksiyonlar:**
```ts
type Action = { kind:'CHOOSE'; choiceId:string; variant?:string } | { kind:'TAP'; x:number; y:number } // sahne birimi, tamsayı
  | { kind:'EXAMINE'; tool:string; target:string } | { kind:'COMBINE'; a:string; b:string }
  | { kind:'PRESS'; statementId:string } | { kind:'PRESENT'; evidenceId:string; statementId?:string } | { kind:'OBJECT'; groundId:string; statementId?:string };
```
- **`act(c, s, a)` çözümleme sırası:**
  1. Oturum aktif mi?
  2. Aksiyon türü bu node'a uygun mu?
  3. Yasallık: görünür ve etkin seçenek, karşılanabilir maliyet, bulunmuş delil, mevcut ifade… Gizli bir kimlik ile hiç olmayan bir kimlik aynı `CHOICE_UNAVAILABLE` hatasını alır; ceza uygulanmaz.
  4. Eşleştirme:
     - CHOOSE → seçeneğin kendisi.
     - TAP → z-sırasına göre en üstteki aktif nesne; hiçbiri yoksa FALLBACK(TAP), yani ıska.
     - Diğerleri → `match`'i ve koşulu tutan ilk kural; yoksa FALLBACK; o da yoksa `NO_MATCH` (doğrulayıcı bu durumu önler).
  5. Tekrar politikası (`maxUses` aşılınca): kurallar NOOP olur ve metni yeniden gösterir; OPTION/TOPIC reddedilir; FALLBACK her seferinde ya da parametre başına bir kez uygulanır.
  6. Etkiler sabit sırada uygulanır: maliyet → seçenek/kural → varyant → kalite işareti. Değişkenler `[min,max]` aralığına sıkıştırılır; DISCOVER idempotenttir.
  7. Yanıt: `when` koşulunu tutan ilk blok + geri bildirim + `fx`.
  8. Geçiş: `GOTO`, `next`'e üstün gelir. `next` şunlardan biridir: hedef node, `$stay`, `$return`, `{push}`, `{routes}`. Node'a girişte `onFirstEnter`/`onEnter` çalışır; DECISION anında yönlendirir.
  9. Tetikleyiciler: dava geneli ve node kapsamlı; öncelik sırasıyla, koşul false→true'ya döndüğünde, isteğe bağlı `once`. Aksiyon başına en fazla 16 adım; aşılırsa `LOOP_LIMIT`. Örnek: `cred ≤ 0 ∧ inCourt → GOTO C_INT_COKUS`.
  10. RESULT'a girildiğinde sonuç, skor, rapor ve XP hesaplanır; `status=COMPLETED` olur.
  11. `seq++` yapılır ve `last` saklanır, böylece devam edildiğinde son sonuç tekrar gösterilir.
- **Koşul dili (AST):**
```ts
type Val = number|string|boolean|{var:string}|{score:'raw'|'final'|`cat:${string}`}|{count:'evidence';kind?:string;tag?:string}|{uses:string}|{visits:string}
  |{add:Val[]}|{sub:[Val,Val]}|{mul:Val[]}|{div:[Val,Val]}|{min:Val[]}|{max:Val[]}|{round:Val};
type Cond = {all:Cond[]}|{any:Cond[]}|{not:Cond}|{cmp:[Val,'=='|'!='|'<'|'<='|'>'|'>=',Val]}
  |{hasEvidence:string}|{met:string}|{visited:string}|{atNode:string}|{chosen:string;variant?:string}|{found:string}|{flag:string}|{ref:string};
```
  - `evalCond` / `evalVal` saf fonksiyonlardır.
  - `collectRefs`, doğrulayıcı ve editör için tüm referansları çıkarır.
  - `typeOf`, karşılaştırma işlenenlerinin tiplerini denetler.
  - `{ref}` adlandırılmış yüklemleri (`story_conditions`) gösterir; derleme sırasında çözülür ve döngüler tespit edilir.
- **Etkiler:**
  - `VAR{set|inc|dec}`
  - `SCORE{category, amount, line?}`: 6 kategori (HUKUKI_BILGI, DELIL_ANALIZI, ARASTIRMA, SORGULAMA, SAVUNMA_STRATEJISI, USUL_BILGISI); `line`, Karar ekranındaki döküm satırıdır.
  - `DISCOVER{evidence}`, `MEET{character}`
  - `MARK{GOOD|BAD|NEUTRAL, feedback, category?}`
  - `IF{when, then, else}`, `GOTO{node}`, `END{outcome?}`
- **Değişkenler ve kaynaklar:**
  - Tanım: `VariableDef{id, type int|bool|enum, initial, min, max, visibility HIDDEN|VISIBLE, display{label, widget meter10|hearts|percentBar|minutes|pips|counter|score|label, max, lowAt}}`.
  - Süre (14 dk), büyüteç (6), eylem puanı (3), güvenilirlik (5♥), heyet iknası (0–10) ve güven (%) sıradan değişkenlerdir.
  - `cost` hem kaynağı düşer hem de seçeneğe kapı olur.
  - Node'un `hud:[…]` listesi yalnızca VISIBLE değişkenleri gösterebilir.
- **Diyalog:**
  - Yanıt blokları `{when?, lines:[{speaker, expression, text}]}`: cevaplar önceki seçimlere göre değişir ama hepsi önceden yazılıdır.
  - TOPIC varyantının kendi soru metni, etkisi ve yanıtı vardır; maliyet ana konudadır.
  - "İPUCU GÖSTER", `hasEvidence` ile kilitli bir OPTION ya da `allowPresent` + PRESENT kurallarıyla yapılır.
  - `moodRules`: Temkinli / Gergin / Savunmada / Çözülüyor + sprite ifadesi.
  - `objectives`: OLAYI ANLA listesinin bilinen/bilinmeyen metinleri.
- **İfade (testimony):**
  - Yapı: `Statement{id, order, visibleWhen?, segments:[{text, highlightWhen?}]}`.
  - Çelişki vurgusu ("Sokak lambası yanıyordu") ancak ilgili çıkarımdan ya da BASTIR'dan sonra sunucuda açılır.
  - PRESS yeni satır, etki veya yeni ifade açar.
  - Doğru PRESENT: +300 skor, ikna +2, GOOD işareti. FALLBACK(PRESENT): −1 kalp, −150.
  - OBJECT kuralları (ifade × gerekçe) "İtiraz isabeti x/7" sayacına girer; İTİRAZ! butonu gerekçe sayfasını açar.
- **Skor, sonuç, rapor:**
  - Formül: `final = raw + Σ bonus` (bonusa örnek: güvenilirlik × 100). Döküm satırları her zaman tam olarak `final`'e toplanır.
  - Strateji çarpanı genel skora uygulanmaz; stratejiyle uyumlu esas savunma seçeneğinin `SCORE.amount` ifadesinin içindedir (ör. `{div:[{mul:[200,{var:'strategy_pct'}]},100]}`).
  - Dava bazında isteğe bağlı genel bir `multiplierPct` desteklenir; Dava #07 bunu kullanmaz.
  - Sonuç, önceliğe göre `when` koşulunu tutan ilk `OutcomeDef{class ACQUITTAL|REDUCED|CONVICTION|RECHARACTERIZED, stamp, sentence, verdictText, legalBasis, xp, howToReach}` olur; listedeki son sonuç varsayılandır.
  - Rapor tamamen kural tabanlıdır ve şunları içerir:
    - GOOD/BAD işaretleri ve hazır geri bildirimleri;
    - kaçırılan deliller ve ipuçları;
    - ulaşılmayan sonuçlar ve "nasıl ulaşılır" metinleri;
    - beceri tavsiyeleri: kazanılan/maksimum oranına göre <%40 zayıf, %40–75 orta, >%75 güçlü (maksimum, doğrulayıcının hesapladığı `categoryMax`).
- **Görünüm temizleme:**
  - Gönderilenler: node meta verisi, görünür HUD, çözülmüş satırlar, `last`, yalnızca görünür seçenekler (etiket, tag, varyant, maliyet, kullanılabilirlik, kilit nedeni), tür bazlı yük (§6).
  - Gönderilmeyenler: gizli değişkenler, seçeneklerin `next`/etki/koşulları, görünmez seçenekler (sayıları bile), bulunmamış delil ve karakterler, bulunmamış hotspot geometrisi, kural tanımları ve doğrulukları, sonuç koşulları, yazar notları.
  - Tasarımdaki sayaçlar ("Gizli ipucu: 3", "3/6") yalnızca sayı olarak gider (`exposeCounts`).
- **Motor API'si ve determinizm:**
  - Fonksiyonlar: `compile(pkg)` · `start(c)` · `view(c, s)` · `act(c, s, a)` · `report(c, s)` · `enumerateActions(c, s)` (doğrulayıcı için).
  - Determinizm önlemleri: tamsayı skor, sıralı yineleme, `ENGINE_VERSION` + `migrateState()`. CI, kayıtlı bir aksiyon korpusunu yeniden oynatır ve durum hash'lerini karşılaştırır.
- **Dava #07 içeriğinin gerektirdiği eklemeler:**
  - `SCORE.amount` bir `Val` ifadesi olabilir (strateji çarpanı için).
  - `Val`'a `{if:{when, then, else}}` eklenir.
  - Node düzeyinde parametrik aksiyon maliyeti: `actionCosts` (ör. TAP → `taps`, EXAMINE → `exam_left`).
  - Gecikmeli delil teslimi, bayrak + "gün sonu" / "duruşma girişi" tetikleyicisiyle yapılır; yeni motor özelliği gerekmez.
  - Rapor için `report.hints[{when, text, category?}]` (kaçırılan delil ve bilgilere dair ipuçları).
  - Kategori tavsiyeleri `{weak <%40, medium, strong >%75}`.
- **CasePackage (özet):**
  - Üst bilgi: `format`, `meta` (slug, number, title, crimeLabel, lawRef, demandText, possibleSentence, difficulty, category, requiredRank, summary, coverCharacter, legalReviewed).
  - Yapılandırma: `config` (startNode, resultNode, scoring, objectionGrounds, display, chronology), `predicates`, `variables`.
  - Kadro ve deliller: `characters`, `relationships`, `evidence` (kind EVIDENCE|CLUE|INSIGHT, type FIZIKSEL…FOTOGRAF, presentable, combinable, legalValidity, missedHint…), `evidenceRelations`, `discoveryPaths`.
  - Mekân ve mahkeme: `scenes` (boyut, katmanlar, nesneler + şekiller), `court.sessions[].stages[]`.
  - Akış: `nodes` (seçenekler ve ifadeler iç içe), `triggers`, `outcomes`.
  - Diğer: `assets`, `tests.goldenPaths`.

## 6. İstemci sözleşmesi (API ↔ Flutter)
`GET /v1/sessions/:id` → `SessionView`; `POST /v1/sessions/:id/choose` → `{ result: ActionResult, view: SessionView }`.
**Kural:** UI = f(view). `fx` yalnızca animasyon tetikler; kaçırılan bir efekt durumu bozamaz.
```ts
interface SessionView {
  session: { id; caseId; caseNumber; caseTitle; stateVersion; status:'ACTIVE'|'COMPLETED'|'ABANDONED'; mode:'NORMAL'|'TEST'; progressLabel? }
  header: { eyebrow?; title?; back?: { a11yLabel; choiceId } }          // geri butonu = sunucunun NAVIGATE seçeneği
  hud: { id; label; widget; value; max?; low? }[]
  cast: Record<string, { name; shortLabel; role; accent:'#RRGGBB'; sprite:{ rows:string[]; skin?; noEyes?; noMouth? }; expression? }>
  lines: { speaker; expression?; text }[]                              // speaker = karakter anahtarı | 'player' | 'narrator'
  choices: { id; kind; group?; label; description?; tags?:{label; tone}[]; variants?:{id; label}[]; cost?:{var; amount; label}[]; available; lockedReason?; used }[]
  primary?: { choiceId; label; tone:'gold'|'red'|'blue'|'objection'|'secondary' }
  bag: { items: EvidenceCard[]; total? }; notebook: { items: ClueCard[]; total? }   // yalnızca bulunanlar
  last?: ActionResult
  node: NodeView                                                       // `type` alanıyla ayrışan birleşim
}
// NodeView:
//  STORY{phase?, blocks[]}
//  INVESTIGATION{tabs[{id,label,kind:SCENE|PEOPLE|ARCHIVE,choiceIds}], scenePreview{imageUrl,width,height,markers[{id,label,rect,state}]}, quickTalk{characterKey,line,choiceIds}}
//  DIALOGUE{mode, room{label,characterKey,expression}, mood{label,tone}, objectives[{text,known}], tones[{id,label,hint}], allowPresent}
//  CHOICE|EVIDENCE{prompt?, evidence?}
//  SCENE{imageUrl,width,height,instruction,found[{objectId,rect,label,badge}],hiddenTotal}
//  DOCUMENT{title,header,columns[{label,flex}],rows[{id,cells,lens?{[toolId]:{cells,tone}}}],tools[{id,label,icon,visualMode?}],solved[],hiddenRemaining}
//  DEDUCTION{cards[{id,source,text}],solved[{title,hits}],recipesTotal}
//  COURTROOM{mode, stage{banner,bench[{characterKey,label,xFrac}],witness?,counsel}, statements?[{id,segments[{text,highlight}],pressed}], presentable?, objectionGrounds?, prosecutionEvidence?, rulesText?}
//  RESULT{outcome{id,class,stamp,tone}, strategyLabel, sentence{demand,result}, reasoning, breakdown[{label,value,tone}], total, thresholds{scaleMax,bands[]}, xp{gained,rankLabel,progressPct}}
interface ActionRequest { clientActionId: string /*uuid*/; expectedStateVersion: number; action: Action }
interface ActionResult { resolution:'CHOICE'|'RULE'|'FALLBACK'|'NOOP'|'HIT'|'MISS'; feedback?:{title?;text?;label?;tone}; lines;
  fx:{kind:'VAR'|'SCORE'|'EVIDENCE'|'CHARACTER'|'SHOUT'|'VERDICT'; label; delta?; id?}[]; discovered; hit?:{objectId;rect;text}; nodeChanged; completed }
```
- TAP koordinatları, sahnenin bildirdiği birimlerde tamsayıdır (Dava #07: 344×380). Flutter, dokunuşu çizilen görüntüden bu birime çevirir.
- **Sözleşme fikstürleri:** motor testleri her node türü için `packages/engine/fixtures/views/*.json` üretir. Flutter sözleşme testleri bunları `fromJson` ile ayrıştırır ve gidiş-dönüşü kontrol eder. Bilinmeyen node türü Flutter'da `UNSUPPORTED` ("Uygulamayı güncelle") ekranına düşer.

## 7. Veri modeli (Prisma 7, `apps/api/prisma/schema.prisma`)
**Kurallar:**
- Id'ler uuid7.
- Tablo adları spesifikasyondaki gibidir (`@@map`); kolonlar snake_case.
- İçerik tablolarında `case_version_id` + `key` ve `@@unique([caseVersionId, key])`.
- Koşullar JSONB tutulur ve her yazımda case-schema ile doğrulanır.
- Firebase kullanıldığı için parola ve refresh token tablosu yok.

| Grup | Tablolar (rol) |
|---|---|
| Kimlik | `users` (firebase_uid UNIQUE, email, display_name, is_anonymous, provider, role PLAYER/EDITOR/ADMIN, status) · `user_profiles` (avukat adı, büro, şehir, ayarlar JSONB) · `user_statistics` (xp, rütbe, kapanan dava, sonuç sınıfı sayıları) · `user_progress` (UNIQUE kullanıcı+dava; aktif/en iyi oturum, en iyi sonuç/skor, verilen XP) · `ranks` (ek; Stajyer Avukat → …) |
| Katalog | `case_categories` · `case_difficulties` · `cases` (slug, number, kategori, zorluk, gerekli rütbe, current_version_id) · `case_versions` (version_no, DRAFT/PUBLISHED/SUPERSEDED/ARCHIVED, kaynak, liste meta, config JSONB, package_hash, analysis JSONB, hukuki inceleme, yayınlayan) · `content_versions` (değişmez CasePackage snapshot'ları: IMPORT/AI_DRAFT/PUBLISH_SNAPSHOT/TEST_SNAPSHOT) · `assets` (ek; sha256 ile içerik adresli) |
| Hikâye | `story_variables` · `story_nodes` (tür, mod, başlık, sahne, mahkeme aşaması, config JSONB, editör x/y) · `story_choices` (tür, TOPIC varyantları alt satır olarak, fallback_for, grup, etiket, tag, match, cost, max_uses, tekrar politikası, kalite, geri bildirim, visible/enabled_when) · `story_transitions` (tüm kenarlar: CHOICE/ROUTE/TRIGGER; from null = dava geneli; spesifikasyondaki `next_node_id` burada; React Flow kenarları da buradan) · `story_effects` (sahip türü/id, sıra, tür, payload; score_effect/variable_effects/consequences burada) · `story_conditions` (adlandırılmış yüklem kütüphanesi) |
| Karakter | `characters` (rol, ad, yaş, meslek, profil, yazar notu, sprite asset, renk) · `character_dialogues` (yanıt blokları: node satırları, seçenek yanıtları, nesne, sonuç) · `character_relationships` (gizli/açılma koşulu) |
| Sahne | `scenes` (boyut, arka plan, açılma koşulu, dokunma payı) · `scene_assets` (katmanlar) · `scene_objects` (işaret HIDDEN/VISIBLE, bulma metni, delil mi, inspect node) · `scene_hotspots` (şekil + geometri) |
| Delil | `evidence` (tür/tip, metinler, ikon, taraf, güç, hukuki geçerlilik + not, presentable/combinable, ilgili karakter/olaylar, missed_hint) · `evidence_relationships` (SUPPORTS/CONTRADICTS/DERIVED_FROM/REFUTES) · `evidence_discovery_conditions` (bulunma yolları; DISCOVER etkileriyle 1:1) |
| Mahkeme | `court_sessions` (celse) · `court_stages` (aşama türü, sıra, giriş node'u) · `court_choices` (story_choices'ın 1:1 uzantısı: ifade, kabul edilen deliller, gerekçe, bağırma, sayım) · `court_outcomes` (öncelik, sınıf, damga, ceza, gerekçe, hukuki dayanak, koşul, XP, nasıl ulaşılır) · `testimony_statements` (ek) |
| Oturum | `game_sessions` (kullanıcı, dava, sürüm, snapshot, NORMAL/TEST, durum, state_version, engine_version, mevcut node, ilerleme etiketi, sonuç, skor, XP) · `session_states` (JSONB durum = doğruluk kaynağı) · `session_choices` (aksiyon günlüğü + idempotency deposu) · `session_variables` · `discovered_evidence` · `session_scores` (puan defteri) · `session_events` |
| İçerik yönetimi | `content_generation_jobs` · `content_validation_results` · `admin_audit_logs` |

- **Kritik kısıtlar:** `game_sessions` üzerinde kısmi unique `(user_id, case_id) WHERE status='ACTIVE' AND mode='NORMAL'`; `session_choices` üzerinde `@@unique([sessionId, clientActionId])` ve `@@unique([sessionId, seq])`.
- **Sürümleme:** içerik yalnızca DRAFT iken yazılabilir (`assertDraft()`; M2'de ek olarak DB trigger). Yeni taslak = export → import, yani derin kopya.
- **Yayın (tek transaction):**
  1. Dava satırını kilitle; sürüm DRAFT mı kontrol et.
  2. Export al ve kanonik hash'i hesapla. Bu hash son PASSED doğrulamanın hash'iyle aynı değilse 409 `validation_required`.
  3. PUBLISH_SNAPSHOT yaz.
  4. Sürümü PUBLISHED yap ve `analysis`'i kaydet.
  5. Önceki sürümü SUPERSEDED yap; ona sabitlenmiş oturumlar oynanmaya devam eder.
  6. `cases.current_version_id`'yi güncelle; audit log yaz.
- **Import/export:** Zod parse → `engine.compile` (hata varsa durur) → taslağın tüm satırları tek transaction'da değiştirilir. Export kanonik JSON üretir. Test: `export(import(p)) ≡ canonical(p)`.
- **Yükleme ve önbellek:** `CaseLoaderService.getCompiled(snapshotId)` sırayla bellek LRU (32 kayıt) → Redis (gzip, TTL 7 gün) → DB snapshot → `compile` dener. Her yükleme değişmez bir snapshot id'siyle yapıldığı için önbellek geçersizleştirmeye gerek yok.

## 8. Backend ve API (NestJS 12)
**Modüller:**
- **Auth:** global `FirebaseAuthGuard` → `verifyIdToken` → JIT `users` upsert (uid başına 60 sn önbellek); `RolesGuard` DB'deki rolü kontrol eder; admin yükseltme için CLI.
- **Users** (`/me`), **Ranks**, **Cases** (+ CaseLoader).
- **Content:** mapper, sürümler, yayın.
- **GameSessions:** `GameSessionService` transaction'ın sahibidir. Spesifikasyondaki motorlara karşılık gelen ince servisler: Decision/Evidence/Investigation/Courtroom/Scoring/ProgressionEngineService.
- **Assets:** yerel, içerik adresli depolama + statik servis; S3 arayüzü hazır.
- **Admin:** CRUD, import/export, doğrulama, yayın, test oturumu, rol yönetimi. Her mutasyon aynı transaction'da audit log yazar.
- **ContentValidation** (BullMQ işi), **ContentGeneration** (M3, yalnızca worker), **Health**.

**Ortak altyapı:**
- Helmet, CORS izin listesi, nestjs-pino (token'lar maskelenir).
- Zod env şeması: production'da emulator değişkeni yasak.
- `ZodValidationPipe`; plastik_backend tarzı hata zarfı `{message, error, errors?, requestId}`; request-id.
- Throttler: Redis deposu, kullanıcı başına.
- Gövde limiti 1 MB (import için 25 MB).

| Uç nokta (`/v1`) | Açıklama |
|---|---|
| `GET /health` (public) | db/redis durumu |
| `GET /me` · `PATCH /me/profile` · `DELETE /me` | kullanıcı + profil + rütbe · profil/ayarlar · hesap silme (DB + `firebase-admin deleteUser`) |
| `GET /me/progress` · `GET /me/sessions` · `GET /ranks` | rütbe/XP, sonuç sayıları, aktif oturum, dava durumları · oturum özetleri · rütbe listesi |
| `GET /cases?tab=active\|closed\|locked` · `GET /cases/:id` | kart listesi (NEW/IN_PROGRESS/COMPLETED/LOCKED, kilit nedeni, en iyi sonuç) · spoiler'sız detay |
| `POST /cases/:id/start {restart?}` | yeni oturum (201) veya mevcut aktif oturum (200); kilitliyse 403 `case_locked` |
| `GET /sessions/:id` · `/current-node` | özet · `SessionView` (ETag = stateVersion) |
| `POST /sessions/:id/choose` | aşağıdaki algoritma |
| `GET /sessions/:id/evidence` · `/scenes` · `/characters` · `/score` · `/result` | yalnızca bulunan deliller · açılmış sahneler ve bulunan nesneler · tanışılan karakterler · oyun sırasında ham skor, bitince döküm · `CaseReport` (dava bitmeden 409) |
| `POST /sessions/:id/abandon` | oturumu bırak |
| `POST /admin/cases` · `GET/PATCH/DELETE /admin/cases/:id` · `POST /admin/cases/import` · `GET /admin/cases/:id/versions` · `POST …/versions` · `GET/PUT …/versions/:vid/package` · `GET /admin/cases/:id/export` | dava ve sürüm yönetimi (M1'de ince API, M2'de arayüz) |
| `POST /admin/cases/:id/validate` · `GET /admin/validations/:id` · `POST /admin/cases/:id/publish {versionId, legalReviewConfirmed}` · `POST /admin/cases/:id/test-sessions` | doğrulama · yayın · taslağı test oynatma |
| `POST/GET /admin/assets` · `GET /admin/audit-logs` · `PATCH /admin/users/:id/role` | varlık yükleme · denetim kaydı · rol |
| `POST /admin/cases/generate` · `GET /admin/generation-jobs/:id` | M3 |

- **`POST /sessions/:id/choose` algoritması:**
  1. Guard + kullanıcı başına throttle.
  2. Oturumun `user_id` ve `snapshot_id`'sini kilitsiz oku; istek sahibine ait değilse **404**. CompiledCase transaction dışında yüklenir.
  3. Hızlı tekrar: `(session_id, client_action_id)` kaydı varsa ve `request_hash` aynıysa saklı yanıtı `X-Idempotent-Replay: true` ile döndür; hash farklıysa 422 `idempotency_key_reused`.
  4. Transaction (ReadCommitted, 10 sn):
     - `SELECT … FOR UPDATE`.
     - Idempotency kaydını tekrar kontrol et; eşzamanlı kopya kilitte bekler ve ardından tekrar yanıtını alır.
     - Oturum ACTIVE değilse 409 `session_not_active`; sürüm farklıysa 409 `state_version_mismatch`.
     - `engine.act` çalışır; reddederse 422 `action_rejected` döner ve hiçbir şey yazılmaz.
     - Aynı transaction'da yazılanlar: `session_states` (`WHERE state_version=$v`), `game_sessions`, `session_choices` (tam yanıt JSON'u), `session_events`, değişen `session_variables`, `discovered_evidence` (skipDuplicates), `session_scores`.
  5. Dava bittiyse aynı transaction'da:
     - Oturum COMPLETED olur.
     - NORMAL modda: `user_progress` FOR UPDATE, `xpDelta = max(0, xpEarned − xp_credited)`, en iyi sonuç güncellenir, `user_statistics` + rütbe güncellenir.
     - TEST modda ilerleme yazılmaz.
  6. Kilit sırası her zaman oturum → user_progress → user_statistics; `40P01`/`40001` hatasında bir kez yeniden denenir.
- **Hata kodları:** 400 `validation_error` · 401 · 403 `forbidden` / `case_locked` · 404 (başkasının oturumu dahil) · 409 `state_version_mismatch` / `session_not_active` / `validation_required` / `version_not_draft` · 422 `action_rejected` / `idempotency_key_reused` · 429.
- **AI izolasyonu:**
  - `@anthropic-ai/sdk` yalnızca `modules/content-generation/**` altında import edilebilir (ESLint `no-restricted-imports`).
  - dependency-cruiser, `game-sessions` / `cases` / `packages/*` → content-generation yolunu CI'da yasaklar.
  - Modül yalnızca `APP_ROLE=worker` ve `AI_GENERATION_ENABLED=true` iken yüklenir.

## 9. Hikâye doğrulayıcı (`packages/validator`)
- **CLI:** `mudafaa-validate <case.json…> [--json] [--strict] [--max-states N]` (çıkış kodu 0/1/2). CI'da `npm run validate:cases` olarak çalışır.
- **Statik kontroller:**
  - Zod şeması ve yinelenen kimlikler.
  - Sarkan referanslar: next, routes, push, GOTO, DISCOVER, MEET, konuşmacı, sahne, nesne, HUD, maliyet, asset ve tüm koşullar.
  - Koşul tip denetimi; yüklem döngüleri.
  - Node türü kuralları: SCENE'de TAP fallback'i; DOCUMENT, DEDUCTION ve TESTIMONY'de fallback'ler; DECISION'da varsayılan rota; RESULT'ta seçenek olmaması; son olmayan her node'un bir çıkışı.
  - Eksik metinler: etiketler, yanıtlar, ifadeler, işaretli seçeneklerin geri bildirimi, sonuç metinleri.
  - Tutarlılık: bulunma yolu ↔ DISCOVER 1:1; her delil bulunabilir ya da başlangıçta var; çıkarım girdileri combinable; presentable deliller bir yerde kullanılıyor; tanıkların rolü doğru.
  - Sonuçlar: benzersiz öncelik, varsayılan en sonda, eşik çubuğu ile koşullardaki skorlar uyumlu.
  - DECISION ve tetikleyici döngüleri; ayırt edilemeyen seçenekler için uyarı; yayın öncesi hukuki inceleme şartı.
- **Simülasyon** (`enumerateActions` + `act` ile sınırlı tam arama):
  - Durum indirgeme anahtarı: node, yığın, değişkenler (sayaçlar hariç), deliller, karakterler, bulunan nesneler, mandallar, eşiğe kadar sınırlanmış kullanım/ziyaret sayıları.
  - Skor ve sayaçlar `[min,max]` aralığı olarak izlenir; skor-farm döngüsü hata sayılır.
  - Sınır 250 bin durum / 60 sn; aşılırsa sonuç `complete:false` işaretlenir.
  - Raporlananlar:
    - kapsam (node, seçenek, varyant, kural, fallback, nesne, delil, ifade, sonuç);
    - çıkmaz durumlar;
    - softlock'lar (RESULT'a artık ulaşılamayan durumlar);
    - her sonuç için erişilebilirlik ve tanık aksiyon dizisi;
    - `categoryMax` ve min/max final skor;
    - **sızıntı kontrolü:** keşfedilen her durumun serileştirilmiş görünümünde gizli kimlik veya metin bulunmamalı.
- **Golden path'ler:** `tests.goldenPaths` yeniden oynatılır; beklenen sonuç ve skor aralığı tutmalıdır.
- **Yayın kapısı:**
  - hata yok;
  - her sonuç simülasyonla ya da golden path ile ulaşılabilir;
  - softlock ve çıkmaz yok;
  - hukuki inceleme onaylanmış.

  Rapor `content_validation_results.report`'a yazılır.

## 10. Flutter uygulaması (`apps/mobile`)
- **Sürümler:** FVM + Flutter 3.47.7 / Dart 3.13 (`.fvmrc`). Paketler M0'da `fvm flutter pub add` ile en güncel uyumlu sürümlere sabitlenir:
  - Durum ve gezinme: flutter_riverpod 3 + riverpod_annotation / riverpod_generator 4 + riverpod_lint, go_router 18.
  - Ağ ve veri: dio 5, freezed 4 + freezed_annotation, json_serializable, flutter_secure_storage.
  - Kimlik: firebase_core, firebase_auth, google_sign_in 7, sign_in_with_apple 8 (yalnızca gerekirse).
  - Diğer: flutter_svg, uuid, intl.
  - Geliştirme: build_runner, mocktail, integration_test.
  - Fontlar pakete gömülür: Pixelify Sans 400/600/700 ve VT323; OFL lisansları `LicenseRegistry`'ye eklenir; google_fonts kullanılmaz.
- **Yapı:** `lib/` altında:
  - `bootstrap` (env, firebase_options)
  - `app` (router, shell/GameFrame, PopScope)
  - `core` (errors, l10n/trUpper, storage)
  - `data` (api + interceptor'lar, auth, repositories, models/session/*)
  - `design_system` (tokens, painting/PxBoxPainter, icons, motion, sprites, components, illustrations, scene, hud, layout, states)
  - `features` (auth, home, cases, career, settings, report, play/{session_controller, node_switch, nodes/*, overlays}, dev)

  Testler `test/` (golden, widget, sağlayıcı, sözleşme, parity) ve `integration_test/` altında.
- **Tasarım sistemi:**
  - `PxColors`: tasarımdaki her hex, anlamsal adlarla.
  - `PxText`: font, boyut, ağırlık, harf aralığı ve satır yüksekliği tasarımdaki gibi; `leadingDistribution: even`.
  - `PxMetrics`: kenarlık 3/4/2, sert gölge 4/3, bevel 4, radius 0, kenar boşlukları 20/16/28, ölçülen buton yükseklikleri.
  - Tüm kenarlıklı öğeler tek bir `PxBoxPainter` ile çizilir: dış sert gölge + halka + kenarlık + dolgu + CSS iç-bevel bantları. Kenarlar piksele hizalı, AA kapalı. Basılınca 4,4 kayar ve gölge kalkar. Kesikli kenarlık ve web odak halkası da burada.
  - Tasarım kalıplarına 1:1 karşılık gelen bileşenler:
    - Butonlar ve gezinme: PxButton (gold/blue/red/objection/secondary), PxBackButton, PxTabs.
    - Kartlar ve kutular: PxCard / PxPanel / PxSectionHeader, StatusChip, ResultBox.
    - Göstergeler: DifficultyPips, ProgressBar, SegmentedMeter, PixelHearts, TrustBar, ActionPointPips, SentenceRangeBar, ThresholdBar, VerdictStamp.
    - Konuşma ve seçim: SpeechBox / SpeechBubble / TestimonyBox, ChoiceButton (+ tag tonları).
    - Delil ve sahne: EvidenceTile + PxIcon (tasarımın stroke SVG'leri + aynı stilde alet ikonları), HotspotMarker, PixelScene.
    - Karakterler: PortraitFrame; PixelSprite (`Sprite.dc.html`'in birebir portu: 42 renkli palet, FACES katmanları, noEyes/noMouth, `ui.Picture` önbelleği).
    - İllüstrasyonlar ve listeler: NightSky / CourthouseHero / InterviewRoom / CourtroomStage, NotebookList / ObjectivesList.
    - Yeni: PxTextField, PxSwitch, PxDialog / PxSheet.
  - Metinlerde ■ ● ♥ ✓ ‹ › gibi glifler yerine çizim kullanılır (web'de Noto fontunun indirilmesini önler). Türkçe büyük harf için `trUpper`.
- **Ekran ↔ node eşlemesi:**

  | Ekran | Kaynak | Not |
  |---|---|---|
  | Ana Menü `/` | `GET /me` | ad, rütbe, ilerleme, sonuç sayıları, aktif oturum, yeni dava sayısı |
  | Dava Dosyaları `/cases?tab=` | `GET /cases` | |
  | Brifing | STORY (phase BRIEFING) | |
  | Soruşturma | INVESTIGATION | sekme değişimi yalnızca UI; etkinlik seçimi eylem puanı harcar |
  | Görüşme | DIALOGUE | ton UI durumu; konu + ton → CHOOSE + variant |
  | Arama | SCENE | dokunuş → TAP |
  | İnceleme | DOCUMENT | seçili alet ve UV görünümü UI durumu; satıra dokunuş → EXAMINE |
  | Çıkarım | DEDUCTION | tasarımdaki gibi ikinci kartta otomatik COMBINE |
  | Duruşma | COURTROOM / TESTIMONY | ifade imleci UI; BASTIR → PRESS; DELİL SUN → `/play/:id/present` seçicisi → PRESENT; İTİRAZ! → gerekçe sayfası → OBJECT |
  | Delil Sunma | PresentEvidenceScreen | |
  | Karar | RESULT + `/sessions/:id/report` | |

  Yeni ekranlar: COURTROOM/STAGE ve OBJECTION, genel CHOICE/EVIDENCE/STORY, hub'ın TANIKLAR/ARŞİV sekmeleri, kariyer, ayarlar, giriş ekranları, durum ekranları.
- **Durum ve veri akışı:**
  - Riverpod sağlayıcıları: authState stream, `meProvider`, `casesProvider`, `caseDetail` / `report` family, `sessionControllerProvider` (AsyncNotifier family).
  - `SessionController.dispatch` aynı anda tek aksiyon yürütür ve her aksiyonla `clientActionId` (uuid v4) + `expectedStateVersion` gönderir.
  - **Bekleyen aksiyon, gönderilmeden önce `flutter_secure_storage` outbox'ına yazılır.** Ağ hatasında aynı kimlikle 2 kez yeniden denenir. Uygulama öldürülürse açılışta aynı kimlikle tekrar gönderilir; bu yüzden çift puan imkânsızdır.
  - 409 → görünüm yeniden çekilir; 422 → hata bandı gösterilir.
  - Riverpod'un global yeniden deneme davranışı yalnızca ağ/5xx hatalarında devrededir.
  - İstemcide tutulmasına izin verilen UI durumu: seçili alet/UV, ton, seçili kartlar, ifade imleci, seçili strateji/delil, hub sekmesi, bekleyen dokunuş işareti. Geri kalan her şey sunucudan gelir.
- **Kimlik doğrulama akışları:**
  - Splash'ten sonra oturum yoksa Giriş ekranı açılır: e-posta/şifre (kayıt, şifre sıfırlama), Google, Apple, "MİSAFİR OLARAK OYNA" (anonim).
  - Misafir, kariyer veya ayarlardaki "HESABINI KAYDET" ile e-posta, Google ya da Apple hesabına bağlanır. UID aynı kaldığı için ilerleme korunur.
  - `credential-already-in-use` çakışmasında M1'de mevcut hesaba giriş önerilir; misafir ilerlemesi birleştirilmez (birleştirme M4'te).
  - Dio `QueuedInterceptor` her isteğe ID token ekler. 401'de `getIdToken(true)` ile bir kez yeniler; ikinci 401'de "Tekrar giriş yap" gösterilir. Misafir otomatik olarak çıkış yaptırılmaz.
  - Ayarlarda hesap silme; gerekirse önce yeniden kimlik doğrulama istenir.
- **Yönlendirme (GoRouter):**
  - Rotalar: `/splash`, `/login`, `/register`, `/`, `/cases`, `/cases/:caseId`, `/play/:sessionId` (+ `present`, `evidence/:id`), `/sessions/:id/report`, `/career`, `/settings`, `/_dev/*`.
  - Auth yönlendirmesi `refreshListenable` ile yapılır.
  - `/play/:id` node türüne göre çizilir; `node.id` anahtarlı adımlı geçiş kullanılır.
  - Başlıktaki geri butonu yalnızca sunucu `back` gönderdiğinde görünür ve NAVIGATE gönderir. Katmanlar yerel `pop` ile kapanır.
  - Android geri tuşu: önce katmanı kapatır, yoksa NAVIGATE gönderir, o da yoksa "Ana menüye dön?" diyaloğunu açar.
  - Web'de path URL stratejisi kullanılır.
- **Responsive, erişilebilirlik, web:**
  - <600px: akışkan genişlik + sabit ölçüler (tasarımın flex/grid davranışı); illüstrasyon yükseklikleri esnek (mahkeme 220–330); sprite konumları genişliğe oranlı.
  - ≥600px: ortalanmış 430px çerçeve + gece gökyüzü arka planı.
  - Safe area: başlık üstte; CTA altta `max(26, inset+8)` boşlukla.
  - Metin ölçeği 1.0–1.3 ile sınırlı.
  - Tasarımdaki aria-label'lar `Semantics`'e taşınır; dokunma alanları ≥44px.
  - Gizli hotspot araması için ekran okuyucu kullanıcılarına "bölge incele" ızgarası.
  - Sahne PNG'leri tamsayı ölçekte `FilterQuality.none` ile çizilir; CanvasKit.
- **Retro hareket sistemi:** `RetroMotion` üç seviyeli: full / reduced / off.
  - Basma: 4,4 kayma, en az 80 ms.
  - Daktilo: ~35 karakter/sn; dokununca tamamlanır; ekran okuyucuya tam metin verilir.
  - İTİRAZ!: 60 ms flaş → 3 adımlı banner → ±6/4/2 px sarsıntı.
  - Göstergeler hücre hücre dolar; kaybedilen kalp yanıp söner; skor adım adım sayar.
  - Karar damgası 3 adımda "çarpar".
  - Node geçişlerinde 6 adımlı perde silme (240 ms).

## 11. Dava #07 "Gece Bekçisinin Sırrı" — içerik tasarımı (özet; ayrıntı Ek A)
Hukuk metinleri mevzuat.gov.tr'deki güncel PDF'lerle (TCK 5237, CMK 5271, 5188, Av.K. 1136, Yakalama Yönetmeliği) karşılaştırıldı.

- **Gerçek:**
  - Hırsızlığı Depo 3 işçisi **Murat Koç** yaptı: 42 numara zimmetli iş botu giyiyor, sigara içiyor, tefeciye borçlu.
  - Özel güvenlik görevlisi **Selin Kaya** Murat'ın gizli nişanlısı. 23.05'te Murat'la 6 dk konuştu ve "Kerem'di de" talimatını aldı. Ana kapıdaki kulübeden arka sokağı göremeyeceğini fark edince vardiyasını 18–24'ten 22–06'ya silerek değiştirdi.
  - 14 no'lu sokak lambası 9–14 Mart arasında arızalıydı. Kamera kablosu 22.40'ta kesildi, 23.30'da bantla eklendi.
  - Kerem'in parmak izi, 19.30'da Murat'ın isteğiyle top taşımasından kaldı.
  - Anahtar tüm vardiyada ortak. Ertesi sabah görev süresi dışındaki Selin, Kerem'in çantasını rızası olmadan arayıp anahtarı buldu; ne arama kararı ne arama tutanağı var.
  - Kerem 22.30–23.15 arasında çay ocağında Hüseyin Tan'laydı (22.57 tarihli fiş).
- **Yapı (tasarımdaki akışla aynı):**
  - **Brifing:** mentorun dosyayı devretmesi + ceza aralığı sorusu → Dosya ekranı + strateji seçimi.
  - **Soruşturma:** 3 gün × 3 eylem puanı.
    - OLAY YERİ: 13 Mart fotoğraf albümünde arama.
    - CEZAEVİ: Kerem görüşmesi (14 dk; ikinci ziyarette 8 dk).
    - TANIKLAR: Hüseyin, Selin, Murat.
    - ARŞİV: emanetteki vardiya çizelgesinin incelenmesi (CMK 153/4), belediye arıza kaydı, telefon kayıtları (öğretici yol ayrımı), CMK 177 delil dilekçesi (3 hak), çıkarım tahtası (0 EP).
  - **2. Celse:** tek oturumda tüm aşamalar sırayla:
    1. açılış (CMK 191);
    2. ek savunma hakkı hatırlatması (CMK 226);
    3. sanığın ve avukatın ek savunması (142/2-d);
    4. Selin'in yemini ve ifadesi; telkin edici soruya itiraz (CMK 201);
    5. çapraz sorgu: 4 ifade, BASTIR / DELİL SUN;
    6. Hüseyin'in dinlenmesi;
    7. anahtar ve teslim tutanağı: hukuka aykırı arama (5188 md. 7, 9; CMK 119; Anayasa 38/6; CMK 206/2-a, 217/2);
    8. parmak izi raporu; kolluk ifadesi (CMK 148/4);
    9. mütalaa + cevap hakkı (CMK 216/2);
    10. esas savunma, son söz, hüküm.

    Güvenilirlik 0'a düşerse "çöküş" kesintisi devreye girer.
- **Sonuçlar (öncelik sırasıyla):**
  1. **İKRAR:** müvekkili sahte ikrara yönlendirmek → mahkûmiyet 6 yıl 3 ay + etik kartı (Av.K. md. 34).
  2. **BERAAT — CMK 223/2-b:** gerçek fail gösterildi → tahliye, tazminat hakkı bildirimi, dosyanın Başsavcılığa gönderilmesi. Koşul: TOPLAM ≥3.600, ikna ≥8, HTS çelişkisi + bot izi çıkarımı + mazeret + teşhisin çöküşü.
  3. **BERAAT — CMK 223/2-e:** şüpheden sanık yararlanır. Koşul: ikna ≥6, en az 2 bulgu, TOPLAM ≥3.200 (iki temel dayanak birlikte varsa ≥2.600).
  4. **İNDİRİM:** 142/2-d düşer; 142/2-h + 143 + TCK 62 = 6 yıl 3 ay. Koşul: TOPLAM ≥2.000.
  5. **MAHKÛMİYET** (varsayılan): 7 yıl 6 ay; ayrıca çöküş varyantı.
- **Skor:**
  - Tasarımdaki ekran tutarları korunur (+300/−150, +300/−50, +100/+150/−20, +200).
  - TOPLAM = olay puanları + kalp × 100. Teorik tavan ~5.500; çubuk 5.000'de kırpılır.
  - Karar satırları: Delil toplama (x/6) = AR+DA · Çapraz sorgu = SO · İtiraz isabeti (x/7) = UB+HB · Savunma = SS · Güvenilirlik bonusu · Hatalı delil.
  - XP = ⌊TOPLAM/10 × f⌋ (f: 1,2 / 1,0 / 0,85 / 0,6 / 0,3 / 0); etik ihlali varsa yarıya iner.
- **Golden path'ler:** G1→BERAAT_B (5.130) · G2→BERAAT_E (3.645) · G3→İNDİRİM (2.010) · G4→MAHKÛMİYET (100) · G5→İKRAR · W→ÇÖKÜŞ. Hepsi `tests.goldenPaths`'e girer; sayılar yazım sırasında ince ayarlanır.
- **Tasarımdaki hukuki rakamların düzeltilmesi (UI aynı, veri değişir; tam liste Ek A.9):**
  - Kart: "TCK 142 · 3–7 yıl" → "TCK 142/2-h, 143 · 7,5–15 yıl".
  - "Savcılık talebi 5 yıl" → "İddianame: 142/2-h, 143".
  - Ceza aralığı etiketleri → "Beraat · TCK 62: 6y3a · 7,5 yıl · 15 yıl". HAGB etiketi kaldırıldı, çünkü HAGB ceza ≤2 yıl şartı ister.
  - "Ceza indirimi" ipucunda "etkin pişmanlık" yerine terditli savunma.
  - Karar metinleri 142/2-h + 143 + 62 hesabıyla ve istinaf süresiyle (CMK 273/1) yazılır.
  - HTS kaynağı → "CMK 135/6 hâkim kararı".
  - Kamera → "23.30'da bantla eklenmiş".
  - Görüşme süresi → "görüş salonunun kapanışı" (avukat–müvekkil görüşmesi süresiz ve gizlidir).
  - Arama ekranı → "13 Mart olay yeri fotoğrafları".
  - "Gece bekçisi" başlık olarak kalır; hukuki metinlerde "özel güvenlik görevlisi (5188)" kullanılır.
  - Mahkemeye hitap: "Sayın Başkan".
- **Hub düzeni:** 4 sekme korunur; çıkarım tahtası ARŞİV'de ve İnceleme CTA'sında. Hızlı müvekkil kartı, son görüşmeden bir cümle ve görüşmeye kısa yol seçenekleri gösterir.

## 12. Admin panel (M2) ve AI üretimi (M3)
- **Admin panel** (React + Vite + @xyflow/react + TanStack Query + Firebase Web Auth):
  - Dava listesi, sürümler ve doğrulama raporları.
  - **Görsel hikâye editörü:** node'lar türe göre renkli; kenarlar `story_transitions`'tan gelir ve üzerlerinde koşul rozetleri gösterilir; mini harita ve otomatik yerleşim var.
  - Node türüne özel denetçi formları (Zod JSON Schema'dan üretilir + özel bileşenler); koşul oluşturucu (AST ↔ form) ve etki editörü.
  - Editörler: karakter (16×20 sprite ızgarası + palet), delil, sahne (görsel yükleme + hotspot dikdörtgen/çokgen çizimi), değişken, skor ve sonuç.
  - Tarayıcıda **canlı doğrulama**: aynı validator paketi çalışır; hataya tıklayınca ilgili node'a odaklanır.
  - **Test oynatma**: TEST oturumu açılır ve normal oturum uç noktalarıyla oynanır.
  - Hukuki inceleme onayı isteyen yayın akışı; audit log görünümü.
  - Backend tarafı: `/v1/admin/versions/:vid/{nodes,choices,transitions,…,graph}` altında ince taneli CRUD, sürüm klonlama ve diff, yayınlanmış içeriği koruyan DB trigger.
  - **Dava #08 "Kırık Kadeh" (tam dava):**
    - Önce içerik taslağı çıkarılır: gerçek, kronoloji, kadro (Bora Yalçın, Av. Tolga Şen, …), delil zinciri, sonuçlar.
    - Hukuki çerçeve mevzuat.gov.tr'den doğrulanır: TCK 86–87 kasten yaralama, TCK 25 meşru müdafaa, TCK 27/2 sınırın aşılması, TCK 29 haksız tahrik.
    - Ardından içerik tamamen admin panelden girilir; `docs/legal/dava-08.md` sizin incelemenize sunulur.
    - Sprite'lar mevcut 21 kişilik kadrodan gelir; yeni karakter gerekirse admin'in sprite editöründe çizilir.
  - **Kabul:** Dava #08 tamamen admin panelden, kod değişikliği olmadan yazılır, doğrulanır, yayınlanır ve uygulamada baştan sona oynanır.
- **AI üretimi:**
  - Admin formu: kategori, TCK maddesi, zorluk, süre, şüpheli sayısı, istenen mekanikler.
  - Form bir BullMQ işi başlatır (yalnızca worker). İş Claude API'yi (`claude-opus-5-5`) `z.toJSONSchema(CasePackage)` ile yapısal çıktı modunda çağırır.
  - Aşamalar:
    1. Hikâye incili: gerçek, kronoloji, kadro, delil zinciri, çelişkiler, sonuçlar.
    2. Faz faz node grafiği.
    3. Doğrulayıcı geri bildirimiyle sınırlı sayıda onarım turu.
    4. Hukuki gözden geçirme uyarıları.
  - Sistem istemi (şema + hukuk kılavuzu + Dava #07 örneği) prompt caching ile önbelleğe alınır.
  - Çıktı: AI_DRAFT snapshot + DRAFT sürüm + iş kaydı (durum, kullanım, maliyet). Yönetici editörde inceler, test oynar, hukuki onay verir ve yayınlar.
  - **Kabul:** 30 dakikalık, orta zorlukta bir dava üretilir, doğrulayıcıdan geçer, yayınlanır ve oynanır; oyun süreci AI modülünü hiç yüklemez (test ile doğrulanır).

## 13. Milestone'lar ve uygulama sırası
Onaydan sonra bu plan `docs/` altına kaydedilir. M0–M1 küçük TDD görevlerine bölünerek uygulanır; her alt milestone sonunda durumu ve (UI işlerinde) ekran görüntülerini paylaşırım.

**M0 — Kurulum ve araç zinciri**
1. Repo iskeleti:
   - Planlama sırasında yanlışlıkla oluşan boş `amp` dosyasını sil (0 bayt; içi kontrol edildi).
   - `git init`; monorepo iskeleti: npm workspaces, tsconfig.base, ESLint/Prettier, .gitignore, README.
   - Tasarım dosyalarını ve `artifact-type/dc-runtime.js`'i `design/reference/`'a kopyala (gerekirse Artifact'ten yeniden indir).
   - Orijinal spesifikasyonu `docs/spec/legal-case-simulator.md`'ye kaydet.
   - Planı `docs/plan.md`'ye, Ek A'yı `docs/content/dava-07.md` ve `docs/legal/dava-07.md`'ye yaz.
2. `docker-compose.yml` (postgres 17, redis 8 `noeviction`; `test` profili 5434/6380 portlarında) ve `firebase.json` (auth emulator, proje `demo-mudafaa`).
3. Gün-1 denemesi:
   - NestJS 12 modül formatı (ESM mi CJS mi) ve workspace paketlerinin API'den tüketimi.
   - Prisma 7.10 `prisma-client` üreteci ve `PrismaPg` adaptörü.
   - Vitest/SWC.
   - Olmazsa paketler `tsdown` ile çift formatta (CJS/ESM) derlenir.
4. Flutter kurulumu:
   - FVM kur: `dart pub global activate fvm`.
   - `fvm install 3.47.7`.
   - `fvm flutter create apps/mobile --org com.monolithyazilim --project-name mudafaa --platforms android,ios,web`.
5. Firebase (sizin yapacağınız adımlar):
   - `! firebase login` ve proje oluşturma.
   - Konsolda sağlayıcıları etkinleştirme: E-posta/Şifre, Google, Apple, Anonim. Apple için Apple Developer Services ID/anahtar; Android için SHA-1/256.
   - `! fvm exec flutterfire configure`.
   - Backend service account JSON'unu `.env`'e koyma (git dışında).
   - Android build için `! flutter doctor --android-licenses`.
   - Bu adımlar bitene kadar her şey Auth Emulator ile çalışır.
- **Bitti sayılır:**
  - `npm run build && npm test` yeşil.
  - `docker compose up` sağlıklı.
  - `GET /v1/health` OK.
  - `fvm flutter run -d chrome` temalı boş uygulamayı açıyor.

**M1 — Dava #07 dikey dilimi (Faz 2–6)**
1. `packages/case-schema`: Zod şemaları + tipler + JSON Schema.
2. `packages/engine` + her node türünü kapsayan mini-case fikstürü; birim ve özellik (fast-check) testleri; görünüm fikstürleri.
3. `packages/validator` + CLI + bozuk dava fikstürleri (DANGLING_REF, DECISION_CYCLE, SOFTLOCK, SCORE_LOOP, OUTCOME_UNREACHABLE, MISSING_FALLBACK).
4. Dava #07 içeriği (`content/cases/gece-bekcisinin-sirri/case.json`, §11):
   - Sahne PNG'leri tasarım HTML'inden Playwright ile 4× üretilir.
   - 21 sprite `Sprite.dc.html`'den JSON'a çıkarılır.
   - Her sonuç için bir golden path yazılır; doğrulayıcı tam kapsamla PASSED vermeli.
   - Hukuki notlar `docs/legal/dava-07.md`'ye yazılır.
   - Bu noktada hukuki inceleme için size haber veririm. İnceleme M1.5–M1.13 ile paralel yürür; gelen düzeltmeler `case.json` ve golden path'lere işlenir.
5. API temeli: Prisma şeması + migration, config, Firebase guard + JIT kullanıcı, hata filtresi, Zod pipe, throttler, health, assets.
6. İçerik hattı: mapper (gidiş-dönüş testiyle), yayın, `case:import` CLI, seed (rütbeler, kategoriler, zorluklar; Dava #07 import → validate → publish).
7. Oyun API'si:
   - cases; start / devam / yeniden başlat; `SessionView`; choose (transaction + idempotency).
   - evidence / scenes / characters / score / result uç noktaları.
   - İlerleme: user_progress / statistics / ranks, XP farm koruması.
   - `/me`: profil, ilerleme, hesap silme.
8. İnce admin API'si (import / validate / publish / export / test-session / audit) + BullMQ doğrulama işi.
9. API e2e testleri + eşzamanlılık paketi + HTTP üzerinden golden path'ler (Auth Emulator ile).
10. Flutter temeli: tasarım sistemi (token, PxBoxPainter, bileşenler, sprite, ikon, illüstrasyon), `/_dev/gallery` + golden'lar; `tools/design-diff` (referans render'lar + geometri karşılaştırma).
11. Flutter kabuğu: bootstrap/env, Firebase (+ emulator), giriş ekranları (e-posta, Google, Apple, misafir, bağlama, sıfırlama, silme), Dio + interceptor'lar, router, splash.
12. Oyun dışı ekranlar: ana menü, dava dosyaları, dava detayı, kariyer, ayarlar.
13. Oyun ekranları, oynanış sırasıyla: Brifing → Hub (+ TANIKLAR/ARŞİV) → Görüşme → Arama → İnceleme → Çıkarım → Duruşma + Delil Sunma → İtiraz/Aşama → genel Seçim/Delil/Anlatı → Karar + Rapor. Ayrıca not defteri ve delil çantası sayfaları.
14. Hareket katmanı + responsive / erişilebilirlik / web cilası.
15. Uçtan uca doğrulama (§14) ve sizinle ekran görüntüsü incelemesi.
- **Kabul ölçütleri:**
  - Gerçek bir kullanıcı Flutter uygulamasında (web, iOS simülatörü, Android emülatörü) giriş yapıp Dava #07'yi baştan sona oynayabiliyor.
  - Farklı seçimlerle en az 4 farklı sonuca ulaşılıyor.
  - Uygulama kapatılıp açıldığında kaldığı yerden devam ediyor; tekrar oynama yeni oturum açıyor.
  - Aynı aksiyonun tekrarı çift puan vermiyor; başkasının oturumuna erişilemiyor.
  - Doğrulayıcı Dava #07'yi tam kapsamla geçiriyor.
  - 11 mevcut ekran, design-diff raporunda tasarımla eşleşiyor.
  - Oyun yolunda hiçbir LLM çağrısı yok.

**M2 — Admin panel (Faz 7)** ve **M3 — AI içerik üretimi (Faz 8)**: §12.

**M4 — Sertleştirme ve yayına hazırlık (Faz 9):**
- choose uç noktası için yük testi (k6) ve indeks gözden geçirmesi; güvenlik incelemesi.
- Misafir → mevcut hesap birleştirme.
- Yerel flavor'lar (dev/prod Firebase projeleri), imzalama, ikon/splash, KVKK aydınlatma metni.
- Docker imajları (api, worker), prod ortamı, deploy sırasında migration, yedekleme.
- Admin için seçim istatistikleri.
- **Ses:** İTİRAZ! sesi, daktilo tıkırtısı, tokmak, doğru/yanlış sinyali, isteğe bağlı müzik.
  - Lisansı serbest (CC0) dosyalar kullanılır.
  - Sesler aynı `fx` olaylarıyla tetiklenir.
  - Ayarlardan kapatılabilir; web'in otomatik oynatma kısıtına uyulur.

## 14. Doğrulama
- `npm run validate:cases` → Dava #07 PASSED: node/seçenek/sonuç kapsamı %100, tüm sonuçlar ulaşılabilir, softlock/çıkmaz yok, sızıntı yok.
- `npm test`:
  - case-schema testleri;
  - engine: geçişler, koşullar, puanlama, sınır değerler (3199/3200), hit-test, kilitli içerik, determinizm, rastgele yürüyüş değişmezleri;
  - validator fikstürleri;
  - mapper gidiş-dönüşü.
- `npm run test:e2e` (`firebase emulators:exec --only auth … "vitest run --project api-e2e"`, docker test profili):
  - her sonuç için HTTP golden path;
  - 20 paralel aynı istek → tek uygulama, 19 replay;
  - aynı sürümle iki farklı aksiyon → 200 + 409;
  - paralel start → tek aktif oturum;
  - son aksiyonun kopyası → XP bir kez;
  - aynı `clientActionId`, farklı gövde → 422;
  - başka kullanıcı → her `/sessions` ucunda 404; PLAYER → `/admin`'de 403;
  - kaydet/devam: API yeniden başlatılır, `current-node` son görünümle aynı;
  - tekrar oynamada XP farm yok.
- `cd apps/mobile && fvm flutter test`:
  - bileşen ve ekran golden'ları (390×844);
  - widget testleri;
  - sağlayıcı testleri: aynı kimlikle yeniden gönderim, outbox, 409'da yeniden çekme, 401'de token yenileme;
  - sözleşme fikstürleri.
- `fvm flutter test integration_test` (iOS simülatörü, Android emülatörü, Chrome):
  - beraat ve mahkûmiyet yolları;
  - uygulamayı öldürüp devam etme;
  - yanıtı düşürülen istekte çift puan olmaması.
- `npm run design:diff` → 11 ekran için yan yana / pixelmatch / geometri raporu; etiketli dikdörtgenlerde >2px sapma başarısız sayılır.
- Elle:
  - Dava #07'yi web, iOS simülatörü ve Android emülatöründe 4 farklı sonuca oynamak;
  - misafir → hesap bağlama sonrası ilerlemenin korunduğunu görmek;
  - hesap silme;
  - retro animasyonları kapatma.

## 15. Riskler ve açık noktalar
1. **Hukuki doğruluk:** Dava #07 metinleri madde atıflarıyla yazılır ve mevzuat.gov.tr'den doğrulanır. İşaretli noktaları siz veya bir avukat, M1.4 biter bitmez paralel olarak inceler. Düzeltmeler veri ve test düzeyinde kalır. Üretimde yayın hukuki onay ister.
2. **İçerik hacmi:** ~30 node + tüm mahkeme aşamaları. Önce `case.json` yazılır, ardından doğrulayıcının tanık yollarıyla yinelenir.
3. **Doğrulayıcıda durum patlaması / orta skor aralığındaki sonuçlar:** her sonuç için golden path zorunlu; arama sınırları raporlanır.
4. **Araç zinciri:** NestJS 12 modül formatı, Prisma 7 çıktı formatı, `require(esm)`. Gün-1 denemesiyle çözülür; yedek plan `tsdown`.
5. **Yayın sonrası motor değişimi:** `ENGINE_VERSION`, durum migrasyonu ve kayıtlı aksiyon korpusu ile korunur.
6. **Sizin yapmanız gerekenler:** Firebase konsol adımları, Apple Developer hesabı (Sign in with Apple), Android lisansları.
7. **Tasarım tutarsızlıkları** (buton yükseklikleri, kalp boyutu): göründükleri gibi uygulanır, incelemede size sorulur.
8. **Gizli hotspot adaleti ve erişilebilirlik:** dokunma payı (≥44px) + bölge ızgarası.
9. **Mahkeme heyeti:** dava ağır cezalık (üst sınır 15 yıl), gerçekte heyet başkan + 2 üye hâkimden oluşur. Tasarımdaki salonda yalnızca 1 üye hâkim var. M1'de tasarım korunur; ikinci üyeyi eklemek görsel bir değişiklik olacağı için ekran görüntüsü incelemesinde size sorulur.
10. **Hukuki inceleme gerektiren başlıca noktalar** (tam liste Ek A.9):
    - görev dışı özel güvenlik görevlisinin rızasız aramasında delil yasağı (5188 md. 7/a + 9/1);
    - tanık HTS'sinin CMK 135/6 dışında kalması ve ayrı soruşturmadaki HTS'nin bu davada kullanımı;
    - işverenin verdiği anahtarın 142/2-d dışında kalması;
    - ek savunma (CMK 226);
    - sahte ikrar ve TCK 270 / TCK 38.
- **Varsayılanlarım (itiraz edebilirsiniz):**
  - Çıkarımda ikinci kart seçilince otomatik birleştirme (tasarımdaki gibi).
  - İTİRAZ! butonu gerekçe sayfasını açar.
  - Hub sekmeleri yalnızca UI'da değişir.
  - Oyun sırasında skor görünür (tasarımdaki gibi).
  - Masaüstünde tamsayı yakınlaştırma ertelendi.

---

## Ek A — Dava #07 içerik taslağı v1 (M1.4'te `case.json`'a dönüştürülecek)
**Kısaltmalar**
- Skor kategorileri: HB = Hukuki bilgi, DA = Delil analizi, AR = Araştırma, SO = Sorgulama, SS = Savunma stratejisi, UB = Usul bilgisi.
- ♥ = güvenilirlik · İk = heyet iknası · G/B/N = iyi/kötü/nötr işaret · "isabet" = İtiraz isabeti sayacına girer.
- Hub'da her eylem −1 EP harcar. `+x` = keşif.

### A.1 Gerçek ve kronoloji
Arka plan:
- 22–06 gece devriye kadrosu Şubat'ta kaldırıldı; geceleri tur atan kimse yok.
- Selin, 5188 sayılı Kanun kapsamında özel güvenlik görevlisi; vardiyası 18–24, görev yeri ana kapı kulübesi (CCTV monitörü burada).
- Murat: Depo 3, vardiyası 16–24; İSG zimmetinde 42 numara bot; sigara içiyor; tefeciye borçlu.
- Turuncu mont tüm çalışanların iş üniforması.

| Zaman | Olay |
|---|---|
| 9 Mart | 14 no'lu direk arızalanır, belediye kaydı açılır. Murat bunu fark edip planı kurar. |
| 12 Mart 19.30 | Murat, Kerem'den (Depo 1, 18–24) 40 top kumaşı Depo 3'e taşımaya yardım ister. Kerem'in izi dış kapı koluna geçer; bunu Murat kurgulamıştır. |
| 22.30 | Kerem çay ocağına geçer, Hüseyin Tan'la oturur. |
| 22.40 | Murat Depo 3 kamera kablosunu temiz keser; DVR "sinyal yok" gösterir. Selin monitörde görür ama kayda geçirmez. |
| 22.45–23.00 | Murat'ın kuzeni karanlık arka sokağa minibüs çeker; toplar arka kapıdan yüklenir; 42 no bot izleri kapıdan sokağa uzanır. |
| 22.57 | Hüseyin fiş keser: 2 çay + tost (fiş no 0412). |
| 23.00 | Minibüs ayrılır; Murat çöp kutusunun yanında sigara içer (taze izmarit). |
| 23.05 | Murat Selin'i arar (6 dk): "Bitti. Sorarlarsa turuncu montlu birini gördün; Kerem'di." |
| 23.15 | Kerem Depo 1'e döner. |
| 23.30 | Murat kesik kabloyu bantla ekler (arıza süsü verir; kayıt boşluğu 22.40–23.30). |
| 24.00 | Murat Depo 3'ü kilitler; Selin'in vardiyası biter. |
| 13 Mart 07.30 | Hırsızlık fark edilir; polis ve gece personeli çağrılır. |
| 08.05 | Görevi bitmiş olan Selin, Kerem'in çantasını zorla alır ve anahtarı çıkarır (anahtar tüm vardiyada aynı). |
| 08.20 | Kom. Yusuf Er teslim tutanağı düzenler; arama kararı, emri ya da tutanağı yok. Murat "Gece Depo 3'te Kerem dolaşıyordu" der; Selin Kerem'i "tanır". |
| 08.40 | Olay yeri fotoğrafları çekilir. İzmarit Emanet No. 3 olarak alınır ama incelemeye gönderilmez; kamera "arızalı" diye kaydedilir. |
| 09.10 | Selin'in kolluk ifadesi: "Uzaktan, karanlıktı, yüzünü tam seçemedim; turuncu iş montu. Sabah Murat 'Kerem'di' deyince…" |
| 09.30 | Kerem'in müdafisiz kolluk ifadesi: "19.30'da Murat abinin isteğiyle Depo 3'e top taşıdım." |
| 13 Mart (sonra) | Selin ana kapıdan arka sokağın görünmediğini fark eder; çizelgedeki "18.00–24.00"ı silip "22.00–06.00" yazar. Kolluk 14 Mart'ta değiştirilmiş asla el koyar. |
| 14 / 15 Mart | Lamba onarılır / Kerem tutuklanır. |
| Sonra | İddianame TCK 142/2-h, 143 ile Ağır Ceza'ya gider. 1. celsede Kerem sorgulandı, Selin gelmedi. Annesi Av. Deniz Arslan'ı tutar; 2. celseye 14 gün var. |

### A.2 Node grafiği
**Brifing**
- **BR_01 · STORY + CHOICE.** Mentor Leyla Erdem dosyayı devreder (UYAP, CMK 153/4).
  - Başlangıç delilleri: ev_anahtar, ev_teslim_tutanagi, ev_parmak_izi_raporu, ev_selin_kolluk, ev_kerem_kolluk, ev_vardiya.
  - Soru: "Olası ceza aralığı?"
    - "142/2-h + 143: 7 yıl 6 ay–15 yıl" → HB+50, G.
    - "142/1: 3–7 yıl" → 0, B: "142/1 bentleri depo içi eşyaya uymaz."
    - "141: 1–3 yıl" → 0, B: "Bina içinde muhafaza nitelikli haldir."
  - Benim kararım: soru Dosya ekranından önce gelir, yoksa cevap ekranda görünürdü.
- **BR_02 · STORY (phase BRIEFING).** Dosya ekranı (düzeltilmiş rakamlarla) + strateji grubu: Masumiyet / Usul hatası / Ceza indirimi. `strategy` ayarlanır, `day=1`, `ap=3` → "SORUŞTURMAYA BAŞLA" → INV_HUB.

**Soruşturma**
- **INV_HUB · INVESTIGATION.** Başlık "GÜN d/3 · 2. celseye 14/10/6 gün". Bu takvim, CMK 177'deki "duruşmadan en az 5 gün önce" şartına uyar.

  | Sekme | Eylem | Not |
  |---|---|---|
  | OLAY YERİ | "Olay yeri fotoğraflarını ara" → INV_ARAMA | bir kez |
  | CEZAEVİ | "Kerem'le görüş" → INV_GORUSME | min=14 |
  | CEZAEVİ | "Tekrar görüş" | min=8 |
  | TANIKLAR | Hüseyin → INV_T_HUS · Selin → INV_T_SEL · Murat → INV_T_MUR | her biri bir kez |
  | ARŞİV | Vardiya çizelgesi → INV_INCELEME · Belediye arıza kaydı → INV_BEL · Telefon kayıtları → INV_HTS · Delil dilekçesi → INV_DIL | |
  | ARŞİV | Çıkarım tahtası → INV_CIKARIM | 0 EP, en az 2 kart |

  - "DURUŞMAYA GİT" (0 EP, onay ister) → C_00.
  - Tetikleyici: ap=0 ∧ day<3 → INV_DAY_END (o günün teslimatları gelir, day+1, ap=3).
  - ap=0 ∧ day=3 → yalnızca Çıkarım ve Duruşma kalır.
- **INV_GORUSME · DIALOGUE.**
  - İlk ziyarette kapıda Saniye Aydın: +fact_sigara_yok, +fact_kerem_39.
  - Çerçeve metni: "Görüş salonu 17.00'de kapanıyor; Ali Çetin konuşmaları duyamaz."
  - Ton: Yumuşak güven +4 / Sert güven −8 + ek bilgi.
  - Her konu 3 dk, SO+20:
    - **"O gece":** "19.30'da Murat abi Depo 3'e top taşımaya çağırdı; 22.30 gibi çay ocağına geçtim." → +fact_gece, +fact_19_30. Sert tonla ayrıca +fact_murat_cagirdi.
    - **"Anahtar":** "Bütün vardiyaya aynı anahtar… Selin abla çantamı elimden alıp açtı." → +fact_anahtar_ortak, +fact_rizasiz_arama. Sert tonla ayrıca "Vardiyası gece bitmişti, sabah orada ne işi vardı?" → +hint_selin_offduty.
    - **"Hüseyin abi":** "23.15'e kadar beraberdik; fiş cüzdanımda, cüzdan annemde." → +fact_mazeret, +ev_fis, AR+50.
    - **"Kendisi":** Yumuşak "Sigara bile içmem." (+fact_sigara_yok) / Sert "Annemin ilaç borcu var…" (+fact_borc).
  - PRESENT "Çamurda 42 numara bot izi" {clue_iz42, en az 5 dk}:
    - güven ≥40 → AR+200, güven +6, +fact_murat_reveal, suspect_murat; tasarımdaki "39'um ben… Murat abi o gece Depo 3'teydi…" cevabı; G.
    - güven <40 → 0, B: "Güveni düşük müvekkil sakladığını açmaz."
  - "Görüşmeyi bitir" → INV_HUB.
- **INV_ARAMA · SCENE** ("Depo Sokağı · 13 Mart olay yeri fotoğrafları", büyüteç 6):
  - lamba → AR+40, +clue_ampul.
  - kamera → AR+40, +clue_kablo ("temiz kesilmiş, üstü bantlanmış").
  - iz → AR+60, +clue_iz42 ("ölçekli fotoğrafta 28,5 cm (~42 no)").
  - çöp → AR+40, +clue_izmarit ("Emanet No. 3, incelenmemiş").
  - Boş alan → büyüteç −1, AR−10.
  - Hak bitince veya butonla → INV_HUB.
- **INV_INCELEME · DOCUMENT** (zabıt kâtibi Zeynep Kılıç'ın önünde; 8 deneme hakkı):
  - UV × Selin → DA+150, +clue_uv_silinti.
  - Büyüteç × Kerem → DA+100, +clue_kerem_depo1.
  - Karşılaştır × Murat → DA+150, +clue_murat_42, +ev_isg_zimmet.
  - İz tozu × herhangi bir satır → DA−20, B: "Emanetteki delile toz uygulanmaz; bilirkişi, CMK 63."
  - Diğer tüm eşleşmeler → DA−20.
- **INV_CIKARIM · DEDUCTION** (0 EP): geçerli çiftler DA+300; diğer her çift DA−50 ("Bu ikisi birbirini açıklamıyor.").
- **INV_BEL · CHOICE** (belediye arıza kaydı):
  - "Avukat sıfatıyla belediyeye başvur (Av.K. 2/3)" → AR+20, UB+20; kayıt ertesi günün sonunda gelir (3. gün seçilirse duruşmada); G.
  - "Mahkemeden müzekkere (CMK 177)" → UB+20; kayıt C_00'da gelir, çıkarım tahtasına yetişmez; G.
  - "Bilgi edinme başvurusu (4982)" → 0, N: "15 iş günü; yetişmez."
- **INV_HTS · CHOICE** (telefon kayıtları; öğretici yol ayrımı):
  - "Operatördeki tanıdıktan Selin'in kaydını al" → UB−100, etik +1, +ev_hts_illegal; B: "TCK 136; delil olamaz (Anayasa 38/6, CMK 206/2-a, 217/2); disiplin."
  - "Mahkemeden tanığın HTS'sini iste" → 0, N: "CMK 135/6 yalnızca şüpheli ve sanığın iletişimini kapsar."
  - "Murat hakkında suç duyurusu + iletişim tespiti talebi (CMK 158, 135/6)":
    - {suspect_murat ∨ clue_murat_42} → UB+40, AR+20, sucduyurusu_murat; ev_hts C_00'da gelir; G.
    - Alt seçim "Selin'i de ekle (TCK 272/267, çizelge)" {clue_uv_silinti} → HB+20, sucduyurusu_selin.
    - Dayanak yoksa → UB−40, B: "Somut dayanaksız; iftira riski (TCK 267)."
  - "Kerem'in kendi HTS'si" → 0, N: "Aynı baz istasyonu; ayırt edici değil."
- **INV_DIL · CHOICE** (CMK 177 delil dilekçesi; 3 hak; yararlı her seçim UB+20; seçimler geri alınamaz; "Dilekçeyi ver" en az 1 seçimle döner):
  - Hüseyin'in tanık olarak çağrılması → huseyin_summoned.
  - İzmarit DNA incelemesi (CMK 78–79) {clue_izmarit} → ev_dna C_00'da gelir.
  - Bilirkişinin duruşmada dinlenmesi (CMK 68/1) → bilirkisi_present.
  - Kamera/kablo bilirkişi incelemesi {clue_kablo} → ev_kamera C_00'da gelir.
  - Belediyeye müzekkere {arıza kaydı henüz yoksa}.
  - "Tanık Selin'in HTS'si" ve "Keşif" → 0, N (ikisi de reddedilir).
- **Tanık ziyaretleri:**
  - **INV_T_HUS:** "22.30–23.15 yanımdaydı; rulo kopyası kasada." → AR+40, +clue_huseyin.
    - "Duruşmaya gel; tanık bildir (CMK 179)" → UB+20, huseyin_will_attend, G.
    - "Yazılı beyan yeter" → 0, N: "CMK 210/1: duruşmada dinlenmeli."
  - **INV_T_SEL:**
    - "Görüşme iste" → 0, N: "Tanık mahkeme dışında görüşmeye zorlanamaz."
    - "Baskı yap" → UB−100, etik +1, selin_pressured (duruşmaya ♥4 ile başlanır); B: "TCK 277."
  - **INV_T_MUR:** Murat yalan söyler ("22.30'da kilitledim…") → SS−50, B: "Olası faili, delil güvenceye alınmadan uyardın."

**2. Celse** (başlangıç ♥5, selin_pressured ise ♥4; İk 2)
- **C_00 · STAGE — açılış (CMK 191/1–2):** "Sanık bağsız alındı; tanıklar salondan çıkarıldı; ara karar cevapları okundu: [gelenler / ret gerekçeleri]."
- **C_01 · OBJECTION L1 (CMK 191/3-b, 226/1).** Başkan, eylemin 142/2-d kapsamında da değerlendirilebileceği için ek savunma hakkını hatırlatır.
  - "Ek savunma için süre iste (226/3)" → UB+50, isabet; arada güven <50 ise güven +10; G.
  - "Devam" → 0, N.
  - "İtiraz: iddianameye bağlısınız" → UB−50, ♥−1, İk−1; B: "CMK 225/2."
- **C_02 · DIALOGUE — sanığın ek savunması** (Kerem'e tavsiye):
  - "Reddet; 22.30–23.15 çay ocağı; 19.30 yardım; anahtar herkeste" → SS+100, G. İstisna: güven <40 ve ara verilmediyse Kerem patlar → ♥−1, İk−1.
  - "Susma hakkı (CMK 147/1-e)" → 0, N: "Mazereti kendi ağzından anlatma fırsatı kaçtı."
  - "Murat'ı suçlasın" → {fact_murat_reveal} SS+25, N; değilse SS−50, ♥−1, B: "TCK 267 riski."
  - "Suçu kabul etsin; 168 + 62 isteyelim" → C_02D. Kerem: "Ama ben yapmadım…"
    - "Israr et" → false_confession, SS−300, İk−2, etik +1; B: "Av.K. 34; sahte ikrar TCK 270; 168 tam tazmin ister."
    - "Geri adım at" → SS−50, güven −10; B.
- **C_03 · OBJECTION L2 — avukatın ek savunması:**
  - "142/2-d oluşmadı: işverence verilen anahtar 'haksız yere elde bulundurulan' değil; kullanıldığına delil yok" → HB+150, arg_142_2d, isabet; G.
  - "142/1-e uygulansın" veya "TCK 145" → HB−50, İk−1; B.
  - "Diyecek yok" → 0.
- **C_04 · STAGE — Selin** (kimlik, uyarı, yemin; CMK 58, 53–55):
  - {sucduyurusu_selin} "CMK 50/1-c: yeminsiz dinlensin" → UB+25, G.
  - Ardından Selin dört ifadesini kesintisiz verir (CMK 59/1).
- **C_05 · OBJECTION L3.** Savcı: "Gördüğünüz kişi sanıktı, değil mi?"
  - "İtiraz: telkin edici soru (CMK 201/1)" → UB+100, isabet; G.
  - "Sessiz kal" → İk−1, N.
  - "Tanık yalan söylüyor!" → UB−50, ♥−1; B.
- **C_06 · TESTIMONY** (ayrıntı A.5); "Çapraz sorguyu bitir" → C_07.
  - **C_06H** (doğru HTS sunumundan sonra; başkan CMK 48'i hatırlatır):
    - "TCK 274'ün hatırlatılmasını talep et" → HB+50, selin_cozuldu. Selin: "Murat… nişanlım. 'Kerem'di de' dedi. Çizelgeyi ben düzelttim." G.
    - "Tehdit et" → UB−50, ♥−1; B.
    - "Geri çek" → 0.
- **C_07 · STAGE — Hüseyin** {huseyin_will_attend ∨ huseyin_summoned}:
  - "Fişle sor: kasanızdan mı, saat?" → SO+100 (ded_mazeret varsa +50 daha), İk+1 (ded_mazeret varsa +2), huseyin_testified; G.
  - "İyi çocuk mudur?" → huseyin_testified, N: "Karakter tanıklığı mazereti ispatlamaz."
  - Koşul sağlanmazsa: "Mazeret tanığı dinlenmedi."
- **C_08 · OBJECTION L4 — anahtar + teslim tutanağı** ("Diyeceğiniz?", CMK 215):
  - "Hukuka aykırı arama: görev süresi dışında (5188 md. 9/1), yetki aşımı (md. 7/a yalnızca cihazla giriş kontrolü), karar/emir yok (CMK 119/1), rıza yok → Anayasa 38/6, CMK 206/2-a, 217/2, 230/1-b" → UB+150 (fact_rizasiz_arama yoksa 100), key_excluded, İk+1, isabet; G.
  - "İspat gücü yok" → DA+75; G.
  - "CMK 118 gece araması" → UB−50, ♥−1; B: "Arama 08.05'te."
  - "Yok" → 0; B.
- **C_09 · OBJECTION L5 — parmak izi raporu:**
  - {bilirkisi_present} "Bilirkişiye: iz zamanı belirlenebilir mi?" → SO+50, DA+100, fp_neutralized, İk+1, isabet. Dr. Kaan Öz: "Hayır."
  - {bilirkişi yoksa} "Çalışan; zaman belirsiz; 19.30 taşıma" → DA+100 (fact_19_30 varsa +50), fp_neutralized, İk+1, isabet.
  - "Hukuka aykırı alındı" → UB−50, ♥−1; B: "CMK 81/1 savcı emriyle alındı."
  - "Yeni bilirkişi" → 0, N.
  - "Yok" → 0; B.
- **C_10 · OBJECTION L6 — savcının karşı delili** (Kerem'in müdafisiz kolluk ifadesi):
  - "CMK 148/4 + bağlam (19.30, 23.00 değil)" → UB+100, isabet; G.
  - {fact_19_30} "Kerem 19.30'u açıklasın" → SS+75, isabet; G.
  - "İşkence" → UB−50, ♥−1; B.
  - "Yok" → 0.
  - Ardından otomatik okuma: ev_dna ve ev_kamera her biri İk+1.
- **C_11 · STAGE — mütalaa (CMK 216/1).** Mütalaa iki varyantlıdır: {selin_cozuldu ∧ ded_iz_murat} ise "beraat + suç duyurusu", değilse "142/2-d, h, 143, 53; tutukluluğun devamı". Ardından **OBJECTION L7 — cevap hakkı (216/2):**
  - "Hukuka aykırı delil hükme esas alınamaz (217/2, 230/1-b)" → UB+100, isabet. Beraat varyantında bunun yerine "Katılıyoruz; dayanak 223/2-b olmalı" → HB+100.
  - "Cevap yok" → 0.
  - "Mütalaa tutanaktan çıkarılsın" → −50, ♥−1; B.
- **C_12 · CHOICE — esas savunma.** Taban SS puanı; seçilen savunma stratejiyle uyumluysa çarpan uygulanır (Masumiyet→A, Usul→B, İndirim→C).
  - A "Gerçek fail başkası: 223/2-b + suç duyurusu": {contra_s4_hts ∧ ded_iz_murat ∧ (mazeret ∨ contra_s2)} → +200, İk+1, murat_theory; değilse −100, İk−1.
  - B "Şüpheden sanık yararlanır: 223/2-e": {en az 2 bulgu ∧ (contra_s2 ∨ alibi)} → +200, İk+1; değilse −100.
  - C "Öncelikle beraat; aksi halde 142/2-d düşsün, alt sınır, TCK 62 (terditli)" → +150, closing_lehe.
  - D "Etkin pişmanlık + HAGB" → HB−150, İk−2; B: "168 failin tazminini, HAGB ≤2 yıl ceza ve tam tazmini ister; masumiyetle çelişir."
  - E "Duygusal saldırı" → SS−50, İk−1; B.
- **C_13 · CHOICE — son söz (CMK 216/3):**
  - "Ben yapmadım. Adaletinize güveniyorum." → SS+25; G.
  - "Ağlayarak merhamet" → 0, N: "TCK 62/2: şeklî tutum indirim nedeni değildir."
  - "Selin'e öfke" → SS−25, İk−1; B.
  - {false_confession} ise son söz otomatik "Pişmanım." olur.
- **C_14 · DECISION** ("Hüküm fıkrası ayakta dinlenir", CMK 231/4) → A.6.
- **C_INT_COKUS · STORY** (♥ ≤ 0 olunca global kesinti): "Heyet nezdinde savunmanın inandırıcılığı kalmadı." → cokus → kısa son söz → C_14.

### A.3 Değişkenler

| Anahtar | Tip | Başlangıç | Aralık | Gösterim |
|---|---|---|---|---|
| strategy | enum MASUMIYET/USUL/INDIRIM | – | – | Karar başlığı |
| day / ap | int | 1 / 3 | 1–3 / 0–3 | HUD sayaç + pips |
| trust | int | 62 | 0–100 | percentBar |
| min | int | 14 (ikinci ziyarette 8) | 0–14 | minutes |
| tone | enum | soft | – | UI toggle |
| taps / exam_left / slots | int | 6 / 8 / 3 | 0'a kadar | counter |
| cred | int | 5 | 0–5 | hearts |
| pers | int | 2 | 0–10 | meter10 |
| wrong, legal_hits, ethics, visits | int | 0 | – | gizli |

- **Bayraklar (bool):**
  - Görüşme bilgileri: fact_gece, fact_19_30, fact_murat_cagirdi, fact_anahtar_ortak, fact_rizasiz_arama, hint_selin_offduty, fact_mazeret, fact_sigara_yok, fact_borc, fact_murat_reveal, fact_kerem_39, suspect_murat.
  - Talepler ve tanıklar: huseyin_will_attend, huseyin_summoned, huseyin_testified, bilirkisi_present, sucduyurusu_murat, sucduyurusu_selin, illegal_hts, selin_pressured.
  - Duruşma: arg_142_2d, contra_s1, contra_s2, contra_s4_kolluk, contra_s4_mazeret, contra_s4_hts, press_{s1,s2,s3a,s3b,s4a,s4b}, selin_cozuldu, key_excluded, fp_neutralized, illegal_presented, false_confession, murat_theory, closing_lehe, cokus.
- **Türetilmiş değerler:**
  - `alibi` = ded_mazeret ∧ huseyin_testified.
  - `findings` = şu bulgulardan doğru olanların sayısı: contra_s1, contra_s2, herhangi bir S4 çelişkisi, alibi, key_excluded, fp_neutralized.

### A.4 Delil ve ipucu kataloğu

| id | Ad | Tür / tip | İkon | Keşif | Hukuki not | Sunulabilir |
|---|---|---|---|---|---|---|
| ev_anahtar | Depo anahtarı | EV / FİZİKSEL | key | başlangıç | rızasız, yetkisiz arama → dışlanabilir | evet (ifadede hep yanlış) |
| ev_teslim_tutanagi | Teslim tutanağı 08.20 | EV / BELGE | document | başlangıç | arama kararı/tutanağı yok | hayır |
| ev_parmak_izi_raporu | Parmak izi raporu | EV / ADLİ_RAPOR | fingerprint | başlangıç | CMK 81/1'e uygun; iz zamanlanamaz | evet |
| ev_selin_kolluk | Selin'in kolluk ifadesi | EV / TANIK_İFADESİ | document | başlangıç | CMK 212/2 | S2 ✓, S4 kısmi |
| ev_kerem_kolluk | Kerem'in kolluk ifadesi | EV / BELGE | document | başlangıç | CMK 148/4 | hayır |
| ev_vardiya | Vardiya çizelgesi (aslı) | EV / BELGE | document | başlangıç; UV ile güçlenir | CMK 153/4 | S1 (UV ile) |
| ev_fis | Çay ocağı fişi 22.57 | EV / BELGE | receipt | görüşme: "Hüseyin abi" | Hüseyin doğrular | çıkarım girdisi |
| ev_ariza_kaydi | Belediye arıza kaydı (14 no, 9–14 Mart) | EV / BELGE | bulb | INV_BEL / dilekçe | Av.K. 2/3 | S2 ✓ |
| ev_kamera | DVR + kablo raporu | EV / KAMERA_KAYDI | camera | dilekçe {clue_kablo} | bilirkişi (CMK 63) | duruşmada okunur |
| ev_hts | Murat↔Selin 23.05, 6 dk | EV / TELEFON_KAYDI | phone | suç duyurusu → C_00 | CMK 135/6 hâkim kararı | S4 ✓ (S4b'den sonra) |
| ev_hts_illegal | Gayriresmî döküm | EV / TELEFON_KAYDI | phone (kırmızı) | INV_HTS ilk seçenek | TCK 136; dışlanır | sunulursa ♥−2 |
| ev_dna | İzmarit DNA ≠ Kerem | EV / ADLİ_RAPOR | cigarette | dilekçe {clue_izmarit} | CMK 78–79 | duruşmada okunur |
| ev_isg_zimmet | İSG zimmet listesi (Murat 42, Kerem 39) | EV / BELGE | boot | Karşılaştır × Murat | – | – |
| clue_ampul, clue_kablo, clue_iz42, clue_izmarit | Fotoğraf bulguları | CLUE / FOTOĞRAF | bulb, camera, boot, cigarette | INV_ARAMA | – | hayır |
| clue_uv_silinti, clue_kerem_depo1, clue_murat_42 | Belge bulguları | CLUE / BELGE | document, boot | INV_INCELEME | – | hayır |
| clue_huseyin | "23.15'e kadar yanımdaydı" | CLUE / TANIK_İFADESİ | receipt | INV_T_HUS | duruşmada dinlenmeli | hayır |

Yeni ikonlar (tasarımın stroke stilinde): fingerprint, boot, cigarette, magnifier, uv, dust, compare.

### A.5 Çıkarımlar ve tanık ifadeleri
- **Çıkarımlar** (her biri DA+300; diğer her çift DA−50):
  - ampul + arıza → **ded_lamba** "Lamba o gece yanmıyordu" (teşhisi çürütür).
  - iz42 + murat42 → **ded_iz_murat** "İz Murat Koç'a ait olabilir".
  - fiş + Hüseyin → **ded_mazeret** "Kerem'in mazereti doğrulandı".
  - Çeldirici kartlar: kablo, izmarit, uv_silinti, kerem_depo1.
- **Selin Kaya'nın ifadeleri:**
  - BASTIR SO puanı verir.
  - Doğru sunum: SO+300, İk+2.
  - Yanlış sunum: −150 (HATALI_DELIL), ♥−1, İk−1.
  - Kısmi sunum: SO+100; ifade açık kalır.
  - **S1** "O gece 22.00–06.00 vardiyasındaydım. Depo kapısını her saat kontrol ederim."
    - BASTIR (+25): "23.00'te neredeydiniz?" → "Depo 3'ün arka sokağında, devriyede."
    - Vurgu, bastırıldıysa ya da UV ipucu bulunduysa açılır.
    - ✓ ev_vardiya, yalnızca clue_uv_silinti varsa: "…18–24'teydim, ana kapıda." Ardından üye hâkim (CMK 201/2): "Ana kapıdan arka sokak görünür mü?" → "…Görünmez."
    - UV ipucu olmadan ev_vardiya sunmak yanlış sayılır: "Çizelgede de 22–06 yazıyor."
  - **S2** "Saat 23.00 gibi depodan çıkan birini gördüm. ‹Sokak lambası yanıyordu›, yüzünü net seçtim."
    - Vurgu hep açık. BASTIR (+25): "Yirmi metre; 14 numaralı direk."
    - ✓ ev_ariza_kaydi, ded_lamba ya da ev_selin_kolluk (CMK 212/2 ile okunur): "…Belki yanmıyordu. Ama montunu gördüm!"
  - **S3** "Turuncu bir mont giyiyordu, elinde büyük bir çuval vardı."
    - BASTIR A (+50, İk+1): "Firmanın iş montu; herkes giyer, Murat da Kerem de."
    - BASTIR B (+25): "40 top bir çuvala sığar mı?" → "Belki bir araç vardı."
    - Bu ifadede hiçbir sunum kabul edilmez ("Çelişki yok; bastırmak yeterliydi.").
  - **S4** "Ertesi sabah Kerem'i görünce hemen tanıdım. Aynı adamdı."
    - BASTIR A (+50, İk+1): "Murat Koç 'Kerem'di' dedi; baktım, oydu."
    - BASTIR B (+25, A'dan sonra): "Murat'ı ne kadar tanırsınız?" → "‹Pek tanımam›." Bu yeni ve vurgulu bir satır ekler.
    - Kısmi kabul: ev_selin_kolluk (BASTIR A'dan sonra) veya ded_mazeret.
    - ✓ ev_hts, BASTIR B'den sonra → C_06H.
    - ev_hts_illegal sunulursa: savcı itiraz eder, mahkeme dışlar (CMK 206/2-a) → −150, UB−150, ♥−2, illegal_presented.

### A.6 Sonuçlar (öncelik sırasıyla; İKRAR ve varsayılan dışındakiler ayrıca ¬cokus ister)
1. **İKRAR** {false_confession}
   - Damga MAHKÛMİYET, ceza **6 yıl 3 ay**.
   - Hüküm: "…TCK 142/2-h uyarınca alt sınırdan 5 YIL; TCK 143 ile 7 YIL 6 AY; TCK 62/1 ile 6 YIL 3 AY HAPİS; zarar giderilmediğinden TCK 168/2 uygulanmasına yer olmadığına; TCK 53; TCK 63 mahsup; tutukluluğun devamına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf (CMK 273/1)."
   - Etik kartı: "Masum olduğunu söyleyen müvekkili suçu üstlenmeye yönlendirdin (Av.K. md. 34; TBB Meslek Kuralları). Gerçeğe aykırı ikrar TCK 270 kapsamında ayrı suç olabilir."
2. **BERAAT_B — CMK 223/2-b**
   - Koşul: contra_s4_hts ∧ ded_iz_murat ∧ murat_theory ∧ alibi ∧ contra_s2 ∧ ¬illegal_presented ∧ pers ≥8 ∧ TOPLAM ≥3.600.
   - "Ceza yok · Tahliye"; başlık "TÜRK MİLLETİ ADINA" (CMK 232/1).
   - Hüküm: "Sanık Kerem Aydın'ın üzerine atılı suçu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; başka suçtan tutuklu değilse derhal TAHLİYESİNE; CMK 141/1-e uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142/2 ile 6384 sayılı Kanuna göre yapılabileceğinin bildirilmesine (CMK 231/3); karar ve dosya örneklerinin Murat Koç ve Selin Kaya hakkındaki soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere."
   - Gerekçe: fiş + yeminli tanık ile mazeret; arıza kaydı, değiştirilmiş çizelge ve CMK 135/6 kayıtlarıyla teşhisin çöküşü; bot izinin Murat'ın zimmetli botuyla örtüşmesi; anahtarın hukuka aykırı aramayla elde edilmiş olması (Anayasa 38/6, CMK 206/2-a, 217/2, 230/1-b); parmak izinin 19.30'daki taşıma ile açıklanması → suçun sanık tarafından işlenmediği sabit.
3. **BERAAT_E — CMK 223/2-e**
   - Koşul: pers ≥6 ∧ (contra_s2 ∨ alibi) ∧ findings ≥2 ∧ (TOPLAM ≥3.200 ∨ (alibi ∧ contra_s2 ∧ TOPLAM ≥2.600)).
   - Hüküm: tasarımdaki metin doğru ("…işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE…"), tahliye, tazminat bildirimi ve istinaf eklenir.
   - Gerekçe koşullu parçalardan oluşur: teşhisin [arıza kaydı | önceki beyan] karşısında güvenilirliğini yitirmesi; [mazeretin desteklenmesi]; anahtarın tüm vardiyada bulunması [ve hukuka aykırı aramayla elde edilmesi]; parmak izinin tek başına irtibat kurmaması; kesin ve inandırıcı delil yokluğu; Anayasa 38/4, AİHS 6/2, "şüpheden sanık yararlanır".
4. **İNDİRİM** {arg_142_2d ∧ TOPLAM ≥2.000}
   - Ceza **6 yıl 3 ay**.
   - Hüküm: "TCK 142/2-h uyarınca takdiren alt sınırdan 5 YIL; gece vakti nedeniyle TCK 143 ile 7 YIL 6 AY; … TCK 62/1 ile 6 YIL 3 AY HAPİS; işverence teslim edilen anahtar 'haksız yere elde bulundurulan' nitelikte olmadığından TCK 142/2-d'nin uygulanmasına yer olmadığına; TCK 53; TCK 63; cezanın süresi nedeniyle HAGB (CMK 231/5) ve erteleme (TCK 51/1) koşulları bulunmadığına; tutukluluğun devamına; istinaf."
5. **MAHKÛMİYET** (varsayılan), ceza **7 yıl 6 ay**:
   - Varyant A {¬arg_142_2d}: "142/2-d ve h birlikte, zararın ağırlığı gözetilerek alt sınırdan uzaklaşılarak 6 YIL; TCK 143 ile 9 YIL; TCK 62/1 ile 7 YIL 6 AY HAPİS; TCK 53; TCK 63; tutukluluğun devamına; istinaf."
   - Varyant B {arg_142_2d ∧ TOPLAM <2.000}: yalnızca 142/2-h ile aynı hesap; 142/2-d açıkça düşer.
   - ÇÖKÜŞ varyantı: A metni + çöküş notu.

**XP** = ⌊TOPLAM/10 × f⌋. f: BERAAT_B 1,2 · BERAAT_E 1,0 · İNDİRİM 0,85 · MAHKÛMİYET 0,6 · ÇÖKÜŞ 0,3 · İKRAR 0. Etik > 0 ise XP yarıya iner.

### A.7 Golden path'ler (otomatik testler; H = hub eylemi)

> **v2 (2026-10-20, hikâye ve oyun yüzeyi; docs/content/dava-07.md Ek B):** yollar soğuk açılış, 4 günlük soruşturma,
> 2. celse, 3 günlük ara ve 3. celseden geçer; eşikler 3.000 / 7.000 (5.500) / 8.000. Güncel beklenen değerler:
> G1 → BERAAT_B **9.620**, XP 1.154 · G2 = TIPIK → BERAAT_E **8.845**, XP 884, 204 aksiyon, 97,3 dk · G3 → İNDİRİM **3.340**,
> XP 283 · G4 → MAHKÛMİYET **−125** · G5 → İKRAR **4.670**, XP 0 · W → ÇÖKÜŞ (3. celsede) **−445**. Aşağıdaki liste v1 kaydıdır.
- **G1 → BERAAT_B** (Masumiyet)
  - Brifing: BR_01 A.
  - Gün 1: Arama (4 nokta, ıska yok) · İnceleme: UV×Selin, Büyüteç×Kerem, Karşılaştır×Murat · Görüşme (yumuşak): Anahtar, Hüseyin, O gece, ardından bot izini göster.
  - Gün 2: Belediye A · Hüseyin + tanık bildir · HTS: suç duyurusu + Selin.
  - Gün 3: Çıkarım (3 tarif) · Dilekçe: DNA, bilirkişi, kamera → duruşma.
  - Duruşma: L1 A · ek savunma A · L2 A · 50/1-c · L3 A · S1 bastır + vardiya · S2 bastır + ded_lamba · S3a, S3b · S4a, S4b + HTS · C_06H A · Hüseyin A · L4 A · L5 bilirkişi · L6 A · L7 A · esas savunma A · son söz A.
  - Beklenen: **TOPLAM 5.130**, delil 6/6, isabet 7/7, ikna 10, **XP 615**.
- **G2 → BERAAT_E** (Usul)
  - Gün 1: Görüşme (yumuşak, 4 konu) · Arama: lamba, kamera, 1 ıska, çöp · İnceleme: UV×Selin, Büyüteç×Kerem, İz tozu×Selin.
  - Gün 2: Belediye A · Hüseyin + bildir · Dilekçe: bilirkişi, DNA, kamera.
  - Gün 3: Çıkarım: lamba + mazeret + 1 yanlış çift.
  - Duruşma: L1–L3 A · S1 vardiya · S2 ded_lamba · S3'te anahtar (yanlış) · S4a + ded_mazeret (kısmi) · Hüseyin A · L4–L7 A · esas savunma B.
  - Beklenen: **TOPLAM 3.545**, ♥4, **XP 354**. (İlk taslakta 3.645 yazıyordu; A.2 tutarlarıyla yeniden hesap 3.545 verir.)
- **G3 → İNDİRİM** (İndirim)
  - Akış: zayıf soruşturma, Murat ziyareti, yanlış sunumlar.
  - Duruşma: L2 A (arg_142_2d) · L3 B · S2'de fiş (yanlış) · S4 kolluk (kısmi) · Hüseyin yok · L4 B · L5 bilirkişi · L6 "Kerem açıklasın" · L7 A · esas savunma C.
  - Beklenen: **TOPLAM 2.125**, ikna 4, **XP 180** (yazılan içerikteki somut soruşturma adımlarıyla).
- **G4 → MAHKÛMİYET A** (Masumiyet)
  - Akış: sert görüşme (güven 38), zayıf arama/inceleme.
  - Duruşma: L1 B · ek savunma B · L2 D · L3 B · iki yanlış sunum · L4 D · L5 D · L6 C · L7 B · desteksiz esas savunma A.
  - Beklenen: **TOPLAM 55**, ♥3, **XP 3** (L6'da "Yok"; "L6 C" bir kalp götürdüğü için ♥3 ile çelişiyordu).
- **G5 → İKRAR** (İndirim)
  - Akış: makul soruşturma; ek savunmada D → "ısrar et"; esas savunma C.
  - Beklenen: TOPLAM 2.945 → **İKRAR**, XP 0, etik kartı gösterilir.
- **W → ÇÖKÜŞ**
  - Akış: Selin'e baskı (♥4 ile başlar) · operatördeki tanıdık · sert görüşmeler · çok ıska.
  - Duruşma: L1 C · ek savunma C · L3 C · S4a, S4b + ev_hts_illegal (♥0) → C_INT_COKUS.
  - Beklenen: TOPLAM −595 (0 gösterilir), XP 0 (iki sert görüşme konusunun +20'leri dahil).

### A.8 Rapor metinleri
- **Kaçırılanlar** (`report.hints`):
  - clue_iz42: "Arka kapıdan sokağa uzanan çamurlu bot izini kaçırdın; ölçekli fotoğraf numarayı veriyordu."
  - clue_uv_silinti: "Selin satırına UV tutmadın; saat sonradan değiştirilmişti."
  - clue_murat_42: "Çizelgeyi İSG zimmetiyle karşılaştırmadın; Murat'ın botu 42'ydi."
  - ev_ariza_kaydi: "14 no'lu direğin arıza kaydını avukat olarak doğrudan isteyebilirdin (Av.K. 2/3)."
  - ev_fis / huseyin_testified: "Mazeret tanığını dilekçeyle bildirmedin ya da duruşmaya getirmedin (CMK 177–179); yazılı beyan yetmez (CMK 210/1)."
  - ev_hts: "Gerçek faile giden yol: Murat hakkında suç duyurusu ve CMK 135/6 tespit talebi."
  - ev_dna / ev_kamera: "Emanetteki izmarit (CMK 78–79) ve kesik kablo bilirkişiye gönderilmeliydi."
  - fact_rizasiz_arama / fact_19_30: "Aramanın rızasız olduğunu ve parmak izinin masum açıklamasını Kerem anlatacaktı; sormadın."
  - suspect_murat: "Bot izini Kerem'e göstermedin; sakladığı bilgi açığa çıkmadı."
- **Alternatif yollar** (ulaşılamayan her sonuç için):
  - 223/2-b: "Mazeret + çöken teşhis + yasal HTS ile Selin–Murat bağlantısını birleştir; esas savunmada gerçek faili göster."
  - 223/2-e: "S2'yi çürüt ya da mazereti duruşmada ispatla; anahtarın hukuka aykırı aramayla elde edildiğini ileri sür."
  - İNDİRİM: "Ek savunmada 142/2-d'nin unsurlarının oluşmadığını savun."
  - İKRAR: "Terditli savunma (önce beraat, aksi halde lehe hükümler) meşru yoldur; sahte ikrar asla."
  - ÇÖKÜŞ: "Dayanaksız itiraz ve yanlış delil güvenilirliği eritir; hukuka aykırı delil iki kalp götürür."
- **Beceri tavsiyeleri** (kazanılan ÷ maksimum: <%40 zayıf, %40–75 orta, >%75 güçlü):
  - HB: "142/2-d ve h, 143 ve 62 hesabını tekrar et." / güçlüyse: "Vasıf ve ceza hesabında isabetlisin."
  - DA: "Her delilin neyi çürüttüğünü sor; ipuçlarını tahtada birleştir."
  - AR: "Fotoğrafları ve resmî kayıtları sistematik tara."
  - SO: "Önce bastır, sonra sun; S3 ve S4 baskıyla açılır."
  - SS: "Stratejinle uyumlu, delille desteklenen bir esas savunma kur."
  - UB: "Arama yetkisi (CMK 116–119; 5188 md. 7 ve 9), delil yasakları (Anayasa 38/6; CMK 206/2-a, 217/2) ve soru itirazı (CMK 201)."

### A.9 Hukuki inceleme listesi ve tasarım düzeltmeleri
**İnceleme gerektirenler** (önem sırasıyla):
1. Görev süresi dışındaki özel güvenlik görevlisinin rızaya aykırı el aramasında delil yasağının uygulanması (5188 md. 7/a + 9/1).
2. Tanık HTS'sinin CMK 135/6 dışında kalması; Murat'ın şüpheli olduğu ayrı soruşturmadaki HTS'nin bu davada kullanılabilmesi.
3. İşverenin verdiği anahtarın 142/2-d dışında kalması (Yargıtay uygulaması); iki bentle temel cezanın alt sınırdan uzaklaşması.
4. Görevli mahkeme (5235 md. 12; 143 dahil) ve heyetin 3 hâkimden oluşması (tasarımda 1 üye var).
5. 2. celsede 142/2-d için ek savunma (CMK 226/1, 226/3).
6. Sanığın kendi sahte ikrarında TCK 270; avukatın azmettirici olarak sorumluluğu (TCK 38); ikrarın mazeretle çeliştiği durumda mahkûmiyetin gerçekçiliği.
7. Savunmanın talebiyle TCK 274/2 hatırlatması (CMK 48 ile birlikte).
8. İlgili soruşturmada şüpheli hâline gelmiş tanığın CMK 50/1-c ile yeminsiz dinlenmesi.
9. Teşhis usulü: mevzuatta düzenlenmemiş; telkinli yüzleştirme CMK 217 ve içtihat çerçevesinde değerlendirilir.
10. Düşük riskli noktalar:
    - CMK 153/4 ile emanete erişim ve kâtip önünde UV kullanımı;
    - 5275 md. 59/2 (görüş saatleri);
    - "telkin edici soru" itirazı (CMK 201/1);
    - 4982 md. 11'deki 15 iş günü süresi;
    - 2026 tarihli 7589 sayılı Kanun'un CMK 231 metnine etkisi (ceza 2 yılın üstünde olduğu için bu davayı etkilemez).

**Tasarımdaki hukuki rakam/metin düzeltmeleri** (UI aynı kalır, yalnızca veri değişir):

| # | Tasarımda | Sorun | Düzeltme |
|---|---|---|---|
| 1 | Davalar: "TCK 142 · 3–7 yıl" | 3–7 yıl ya bugünkü 142/1'in ya da 2014 öncesi 142/2'nin aralığı | "TCK 142/2-h, 143 · 7,5–15 yıl" |
| 2 | Dosya: "Savcılık talebi 5 yıl" | 143'ten sonraki alt sınırın altında; iddianame süre değil madde belirtir | "İddianame: 142/2-h, 143 (7 yıl 6 ay–15 yıl)" |
| 3 | Ceza aralığı: "TALEP: 5 YIL", "Beraat / İndirim / HAGB / 3 yıl / 7 yıl" | HAGB ve erteleme ≤2 yıl ceza (CMK 231/5, TCK 51/1) ve tam tazmin (231/6-c) ister | "İSTEM: 142/2-h + 143"; etiketler "Beraat · TCK 62: 6y3a · 7,5 yıl · 15 yıl" |
| 4 | İpucu: "etkin pişmanlık ve takdiri indirim" | TCK 168 failin tam tazminini ister; masum müvekkil için bu sahte ikrar demek | "Terditli: önce beraat; aksi halde 142/2-d'nin düşmesi, alt sınır, TCK 62" |
| 5 | Karar İNDİRİM: "142/1 + 62 = 2 yıl 6 ay" | 142/1 bu olaya uymuyor ve 143 unutulmuş | "142/2-h 5 yıl → 143: 7 yıl 6 ay → 62: 6 yıl 3 ay" |
| 6 | Karar MAHKÛMİYET: "142/1, 5 yıl" | Yanlış madde ve aralık; istinaf süresi yok | "142/2-d,h 6 yıl → 9 yıl → 62: 7 yıl 6 ay"; istinaf: tebliğden itibaren iki hafta (CMK 273/1) |
| 7 | Karar BERAAT: "223/2-e" | Şüphe sonucu için doğru | 223/2-b varyantı eklenir; tahliye, tazminat bildirimi (CMK 141/1-e, 142/2–6384, 231/3) ve "TÜRK MİLLETİ ADINA" |
| 8 | "Talep: 5 yıl › …" | 2. maddeyle aynı sorun | "İstem: 7,5–15 yıl › …" |
| 9 | HTS kaynağı: "Operatör kaydı" | Operatör kayıtları yalnızca hâkim kararıyla verir | "Başsavcılık soruşturması, CMK 135/6 hâkim kararı · Murat↔Selin 23.05, 6 dk" |
| 10 | Kamera: "22.40–23.30 kayıt dışı, kablo kesik" | Kesik kabloyla kayıt yeniden başlayamaz | "23.30'da bantla eklenmiş" eklenir |
| 11 | Görüşme: "14 dk", süreyi gardiyan tutuyor | Avukat–müvekkil görüşmesi süresiz ve gizli (CMK 149/3, 154/1) | "Görüş salonunun kapanışına 14 dk" (5275 md. 59/2); gardiyan görür ama duymaz |
| 12 | "Depo Sokağı 23.00": aylar sonra taze izmarit ve çamur izi | Sonraki bir keşifte gerçekçi değil | 13 Mart fotoğraf albümü; izmarit emanetten |
| 13 | İz tozu, el konulmuş delil üzerinde | Avukat inceleyebilir, delile müdahale edemez | Ceza + bilirkişi geri bildirimi |
| 14 | "Gece bekçisi" | Bekçi kamu görevlisidir (7245), yetkileri farklı | Başlık kalır; hukuki metinlerde "özel güvenlik görevlisi (5188)" |
| 15 | İTİRAZ! / "Sayın Hâkim" | Türk usulünde belirli dayanaklar var | İTİRAZ!, CMK 201/1, 192/2, 215, 216/2'ye bağlanır; heyete "Sayın Başkan" |
| 16 | Turuncu mont "eşleşiyor" | Yanıltıcı | Şirketin iş üniforması olduğu açıklanır |
| 17 | ×1,5 tüm skora | Beyan edilen strateji hükmü değiştirirdi | Yalnızca stratejiyle uyumlu esas savunmanın SS puanına |

Ana menüdeki "Müvekkilim masum, Sayın Hâkim!" balonu davadan bağımsız bir tasarım öğesi olduğu için korunur.

---

## Ek B — Orijinal spesifikasyonun özeti
Tam metin M0'da `docs/spec/legal-case-simulator.md`'ye kaydedilir. Bu plan, spesifikasyonun sessiz kaldığı yerde onu tamamlar; çeliştikleri yerde bu plan geçerlidir.

- **Amaç:** avukatlar, hukuk öğrencileri, stajyerler ve meraklılar için hikâye ve seçim tabanlı hukuk simülasyonu. Oyuncu müdafidir: olay yerini inceler, tanıklarla görüşür, delil toplar, hukuki kararlar verir, mahkeme sürecini yönetir.
- **İçerik ve LLM:**
  - Tüm içerik (karakterler, diyaloglar, olay yerleri, deliller, karar noktaları, seçenekler, puanlar, dallanmalar, sonuçlar) önceden tanımlıdır.
  - Oyunda LLM yok, serbest metin yok; oyuncu yalnızca sunulan seçenekleri kullanır.
  - Tüm mantık backend'deki deterministik motordadır.
  - AI yalnızca yönetimde yeni dava üretir; içerik doğrulanıp PostgreSQL'e yazılır.
- **Tasarım:**
  - Referans tasarım ana tasarım sistemidir; mevcut ekranlar, renkler, tipografi, kartlar, butonlar, navigasyon ve animasyon karakteri korunur.
  - Eksik özellikler için aynı dilde yeni sayfalar yapılır.
  - Mobil öncelikli; Android, iOS ve Web.
  - Tasarıma erişilemezse bildirilir, görülmeyen özellikler tahminle uygulanmaz.
- **Teknoloji:**
  - Frontend: Flutter, Dart, Riverpod, GoRouter, Dio, Freezed, JSON Serialization, Flutter Secure Storage.
  - Backend: Node.js, TypeScript, NestJS, PostgreSQL, Prisma, Redis, BullMQ, REST, JWT (bu planda: Firebase ID token), Docker.
  - Backend modülleri: Case, Story, Dialogue Mgmt; Decision, Evidence, Investigation, Courtroom, Scoring, Progression Engine; Content Generation; Admin Mgmt.
  - Flutter'da hikâye/diyalog/delil/sonuç hardcoded olmaz.
- **Story engine:**
  - Hikâyeler tamamen PostgreSQL'de, birbirine bağlı node'lardan oluşur. Örnek node türleri: STORY, DIALOGUE, CHOICE, SCENE, INVESTIGATION, EVIDENCE, DOCUMENT, COURTROOM, DECISION, RESULT.
  - Doğrusal değildir; dallanır.
  - Koşullu node'lar vardır, koşullar DB'de saklanır.
  - Oturuma özel değişkenler: trust_client, evidence_score, legal_score, investigation_progress, witness_cooperation, courtroom_score…
- **Decision engine:**
  - Choice alanları: id, node_id, title, description, next_node_id, score_effect, variable_effects, unlock_conditions, consequences.
  - İşleme: node kontrolü → geçerlilik → etkiler → puan → değişkenler → yeni delil/karakter → sonraki node → PostgreSQL'e kayıt → Flutter'a ekran verisi.
  - Transaction içinde; tekrar eden istek ödülü ikinci kez uygulamaz.
- **Karakterler:**
  - Roller: müvekkil, sanık, mağdur, tanık, savcı, hâkim, polis, bilirkişi; profilleri DB'de.
  - Diyaloglar seçim tabanlı; cevaplar önceki seçimlere göre değişebilir ama hepsi önceden yazılıdır.
- **Olay yeri:**
  - Örnek mekânlar: ofis, ev, sokak, otopark, araç, fabrika, depo, restoran.
  - Alanlar: id, dava, görsel, açıklama, etkileşimli nesneler, gizli deliller, açılma koşulları.
  - Hotspot'a dokununca A–D inceleme seçenekleri çıkar. Her nesne delil değildir; yanlış nesne zaman kaybettirir.
- **Delil:**
  - Türler: fiziksel, dijital, tanık ifadesi, kamera, telefon kaydı, adli rapor, belge, fotoğraf.
  - Alanlar: id, ad, açıklama, tür, görsel/dosya, bulunma koşulu, hukuki geçerlilik, ilgili karakterler ve olaylar.
  - İnceleme seçenekleri sunulur.
- **Mahkeme:**
  - Tamamen seçim tabanlı. Aşamalar: açılış, iddianame, sanık savunması, tanıklar, deliller, savcılık görüşü, savunma, karar.
  - Karar tanımlı kurallarla verilir; çok sonuçludur (beraat, mahkûmiyet, daha düşük ceza, farklı nitelendirme); gerekçeler önceden yazılıdır.
- **Puan:**
  - Kategoriler: hukuki bilgi, delil analizi, araştırma, sorgulama, savunma stratejisi, usul bilgisi; dava bazında yapılandırılabilir.
  - Dava sonu raporu: toplam skor, sonuç, doğru/yanlış seçimler, kaçırılan deliller, alternatif yollar, geliştirilecek beceriler. Kural tabanlıdır, LLM yok.
- **AI üretimi:**
  - Yapısal JSON; doğrulama (bağlantılar, eksik diyalog, ulaşılamayan bölüm, sonuca ulaşılabilirlik, puanlar, karakter tutarlılığı, delil mantığı, hukuki doğruluk, anlamlı seçimler).
  - Önce taslak, sonra admin onayı, sonra yayın. Oyun sırasında AI asla çağrılmaz.
- **Admin:**
  - Dava, node, diyalog, seçenek, puan, karakter, olay yeri, görsel, hotspot, delil ve alternatif sonuç yönetimi; AI üretimi; test; yayın.
  - Görsel node editörü, bağlantılara koşul eklenebilir. Yeni dava için kod değişikliği gerekmez.
- **Veri:** §7'deki tablo listesi (users … admin_audit_logs). İlişkiler Prisma ile kurulur. İçerik ile oyuncu durumu ayrıdır; oyuncular birbirini etkilemez.
- **API:** GET /cases, GET /cases/:id, POST /cases/:id/start, GET /sessions/:id, /current-node, POST /sessions/:id/choose, GET /sessions/:id/evidence, /scenes, /score, /result, POST /admin/cases, /admin/cases/generate, /admin/cases/:id/validate, /admin/cases/:id/publish. Flutter yalnızca bu API'lerle konuşur.
- **Kayıt ve güvenlik:**
  - Tüm seçimler kaydedilir; kaldığı node'dan devam edilir; tekrar oynama yeni oturum açar.
  - Seçimler sunucuda doğrulanır; istemci puan/sonucuna güvenilmez.
  - Kilitli node'a ve bulunmamış delile erişim yok; skor/sonuç manipülasyonu yok; başkasının oturumuna erişim yok.
- **Test:** node geçişleri, koşullar, puan, delil keşfi, kilitli içerik, alternatif sonuçlar, kayıt, tekrar oynama, hatalı bağlantılar, döngüler, ulaşılamayan sonuçlar. Her yayınlanan dava için otomatik doğrulama.
- **Faz → milestone eşlemesi:** Faz 1 → bu plan + M0 · Faz 2–6 → M1 · Faz 7 → M2 · Faz 8 → M3 · Faz 9 → M4 (testler her milestone'da sürekli).
- **20 kesin kural:**
  - Oyunda LLM yok; yalnızca önceden tanımlı seçenekler.
  - Hikâyeler backend'de; Flutter'da hikâye mantığı yok.
  - Diyaloglar, olay yerleri ve hotspot'lar backend'de, önceden hazırlanmış.
  - Seçim sonuçları önceden tanımlı; puan deterministik; mahkeme kararı kurallarla.
  - AI yalnızca backend'de içerik üretimi için.
  - Yeni dava için kod değişikliği yok.
  - Mevcut ekranlar korunur; yeni sayfalar aynı dilde; mobil öncelikli.
  - Tüm oyun verisi PostgreSQL'de; ilerlemeler bağımsız.
  - Çok sonuçlu davalar; farklı hukuk kategorilerine genişletilebilir.
  - Oyun mekanikleri AI'dan bağımsız.
  - Gerçek bir kullanıcı bir davayı baştan sona oynayıp tamamlayabilir.
- **Son hedef:** dosyayı aç → müvekkille görüş → soruları seçeneklerden seç → olay yerini incele → delilleri keşfet → tanık çelişkilerini bul → strateji belirle → mahkemede karar ver → sonucu gör. İlk hedef: baştan sona oynanabilen, farklı seçimlerle farklı sonuçlara ulaşılabilen eksiksiz bir dava.
