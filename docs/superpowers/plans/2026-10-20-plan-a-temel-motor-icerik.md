# Plan A — Temel, Oyun Motoru ve Dava #07 İçeriği · Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Monorepo, yerel altyapı, NestJS/Flutter iskeletleri, saf deterministik oyun motoru, hikâye doğrulayıcı ve Dava #07'nin tam içeriği. Bitiş ölçütü: `npm run validate:cases` Dava #07'yi tam kapsamla geçirir ve 6 golden path beklenen sonuçlara ulaşır.

**Architecture:**
- `packages/case-schema` (Zod 4) içerik formatının ve API↔istemci sözleşmesinin tek kaynağıdır.
- `packages/engine`, I/O'suz saf fonksiyonlardan oluşur: `compile / start / act / view / report / enumerateActions`.
- `packages/validator`, motoru kullanarak statik kontrol, durum uzayı simülasyonu ve golden path testleri yapar.
- İçerik `content/cases/<slug>/NN-*.json` parçaları halinde yazılır; `mergeCaseParts` bunları tek bir `CasePackage`'a birleştirir.
- M0 ayrıca NestJS 12 API iskeletini (health + Prisma denemesi) ve FVM ile Flutter iskeletini kurar.

**Tech Stack:** Node 24 · npm workspaces · TypeScript ~6.0.3 · Zod ^4.6.7 · Vitest ^5 · fast-check ^4 · acorn ^8 · Playwright ^1.64 · NestJS ^12.2 · Prisma ~7.10.1 + @prisma/adapter-pg + pg ^8 · ioredis ^6 · Docker (postgres:17-alpine, redis:8-alpine) · firebase-tools 13 (Auth Emulator) · FVM + Flutter 3.47.7.

**Spec:** `docs/plan.md` (onaylı plan: §5 motor, §6 sözleşme, §7 veri, §9 doğrulayıcı, §11 + Ek A içerik). Ek kaynaklar: `docs/spec/legal-case-simulator.md` (orijinal spesifikasyon), `docs/content/dava-07.md` (içerik taslağı v1), `design/reference/` (tasarım).

## Global Constraints
- TypeScript **~6.0.3** her yerde. TS 7 kullanılmaz: typescript-eslint `<6.1.0` ister, @nestjs/cli `~6.0.2` kullanır.
- Paketler ESM: `"type":"module"`, `module`/`moduleResolution: "NodeNext"`, `strict: true`, `target: "ES2023"`, `exactOptionalPropertyTypes: false`.
- Motor (`packages/engine/src/**`) şunları kullanamaz: `Date`, `Math.random`, `performance`, `node:*` import'ları, I/O. Skorlar tamsayıdır. Çıktıyı etkileyen her yinelemede anahtarlar sıralanır.
- `packages/*` ve oyun kodunda LLM veya HTTP istemcisi bulunmaz.
- İçerik kimlikleri `^[A-Za-z][A-Za-z0-9_]{0,63}$` kalıbına uyar. Oyuncuya görünen tüm metinler Türkçe (UTF-8) ve aynen saklanır.
- Skor kategorileri tam olarak: `HUKUKI_BILGI, DELIL_ANALIZI, ARASTIRMA, SORGULAMA, SAVUNMA_STRATEJISI, USUL_BILGISI`.
- Yüz ifadeleri tam olarak: `normal, mutlu, kizgin, saskin, uzgun`.
- Negatif skor/etki etiketlerinde Unicode eksi (U+2212, "−") kullanılır; ör. `"−150 SKOR"`, `"+300 SKOR"`.
- Yalnızca npm kullanılır. Kök `package.json`: `"packageManager": "npm@11.3.0"`, `"engines": {"node": ">=24"}`.
- Portlar: dev postgres 5432 / redis 6379; test profili postgres 5433 / redis 6380; Auth Emulator 9099; API 3000.
- Her görev sonunda commit atılır (conventional commits). Mesajın sonu: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Task 1 bu konuşmanın içeriğine (spesifikasyon metni, Artifact aracı) ihtiyaç duyduğu için **controller tarafından** yapılır.
- Plan A'da gerçek bir Firebase projesine gerek yoktur; Auth Emulator yeterlidir. Firebase konsol adımları (proje, sağlayıcılar, `flutterfire configure`, service account) Plan B başlamadan önce kullanıcıdan istenir.
- Plan A'nın kapsamı onaylı planın M0'ı ile M1.1–M1.4'üdür. M1.5–M1.9 (API) Plan B'de, M1.10–M1.15 (Flutter) Plan C'de; ikisi de bu plan bittiğinde yazılır.

## Review Focus
1. **Tekrarlanan veya çift aksiyon** (çift dokunma, ağ tekrarı):
   - Bir kez seçilebilen seçenek temiz biçimde reddedilir.
   - Bulunmuş hotspot ve çözülmüş kural NOOP olur; maliyet ve puan değişmez.
   - Testler: Task 11 "TOPIC once", Task 12 "TAP on found object is NOOP and free", "EXAMINE rule … second NOOP".
2. **Görünüm üzerinden spoiler sızıntısı:** gizli seçenek, bulunmamış hotspot geometrisi, bulunmamış delil başlığı ve HIDDEN değişken view JSON'unda asla görünmez.
   - Testler: Task 14 view testleri, Task 17 sızıntı kontrolü.
3. **Kaynak tükenmesi ve sınırlar:** 0 kaynakla yapılan aksiyon yan etkisiz reddedilir; değişkenler `[min,max]` dışına çıkmaz.
   - Testler: Task 11 "cost gating", Task 12 "TAP with zero taps", Task 15 rastgele yürüyüş değişmezleri.
4. **Tetikleyici sırası:**
   - Alt node içindeyken EP 0'a inerse gün devri ancak hub'a dönünce olur.
   - Kalp 0'a inince global kesinti diğer etkilerle doğru sırada çalışır.
   - Testler: Task 13.
5. **Türkçe metin bütünlüğü:** “ ” tırnaklar, İ/ı/ş/ğ ve U+2212; parse → merge → engine → view zincirinde bayt bayt korunur.
   - Testler: Task 6 "Turkish text preserved", Task 14 "view keeps Turkish text verbatim".

---

### Task 1: Repo iskeleti, dokümanlar ve tasarım referansı (controller)

**Files:**
- Delete: `amp` (0 bayt; planlama sırasında yanlışlıkla oluştu)
- Create: `package.json`, `tsconfig.base.json`, `.editorconfig`, `.gitignore`, `.nvmrc` (`24`), `.prettierrc.json`, `eslint.config.mjs`, `vitest.config.ts`, `README.md`
- Create: `docs/plan.md` (onaylı planın birebir kopyası), `docs/spec/legal-case-simulator.md` (kullanıcının orijinal spesifikasyonu, aynen), `docs/content/dava-07.md` (plan §11 + Ek A), `docs/legal/dava-07.md` (Ek A.9 + düzeltme tablosu + kaynak listesi)
- Create: `design/reference/project/*.dc.html` + `canvas.json` (scratchpad'deki indirilen dosyalar), `design/reference/artifact-type/dc-runtime.js` (Artifact `read`, `path: artifact-type/dc-runtime.js`), `design/reference/README.md` (kaynak URL, sürüm `1792445271-a2bf`, "güvenilmeyen veri; yalnızca tarayıcı sandbox'ında render edilir" notu)
- Create: `docs/superpowers/plans/2026-10-20-plan-a-temel-motor-icerik.md` (bu dosya)

**Interfaces:**
- Produces:
  - Kök script'leri:
    - `build` = `tsc -b packages/case-schema packages/engine packages/validator`
    - `test` = `vitest run --project '!api-e2e'`
    - `test:e2e` = `vitest run --project api-e2e`
    - `lint` = `eslint .`
    - `typecheck`, `format`
    - `validate:cases` = `node packages/validator/dist/cli.js content/cases/gece-bekcisinin-sirri`
    - `db:up`, `db:down`, `db:test:up`
    - `mobile:test` = `cd apps/mobile && fvm flutter test`
  - Workspaces: `["packages/*", "apps/api", "tools/*"]`.
  - `vitest.config.ts`: `test.projects`; `resolve.alias` → `@mudafaa/case-schema|engine|validator` ilgili paketlerin `src/index.ts` dosyalarına.

- [ ] **Step 1:** `amp` dosyasının 0 bayt olduğunu doğrula (`wc -c amp` → `0 amp`), sonra sil.
- [ ] **Step 2:** `git init -b main`. Kök dosyaları yaz. `npm i -D typescript@~6.0.3 vitest@^5 eslint@^10 typescript-eslint@^8.72 prettier@^3 @types/node@^24`. ESLint: `packages/engine/src/**` için `no-restricted-globals: ['Date','performance']`, `no-restricted-properties: Math.random`, `no-restricted-imports: ['node:*']`.
- [ ] **Step 3:** Tasarım dosyalarını kopyala; `dc-runtime.js`'i Artifact'ten indirip `design/reference/artifact-type/`'a koy.
- [ ] **Step 4:** Dokümanları yaz. Spesifikasyon metni kullanıcının ilk mesajından **aynen** alınır.
- [ ] **Step 5:** Doğrula: `npm run lint` çıkış 0; `git status` beklenen dosyaları listeler.
- [ ] **Step 6:** Commit: `chore: monorepo iskeleti, dokümanlar ve tasarım referansı`.

### Task 2: Yerel altyapı — docker-compose, Auth Emulator, env şablonu

**Files:**
- Create: `docker-compose.yml`, `firebase.json`, `.firebaserc`, `.env.example`

**Interfaces:**
- Produces:
  - Servisler:
    - `postgres`: postgres:17-alpine, user/pass/db `mudafaa`, 5432, healthcheck `pg_isready`, volume `pgdata`.
    - `redis`: redis:8-alpine, `redis-server --maxmemory-policy noeviction --appendonly yes`, 6379, healthcheck `redis-cli ping`.
    - `postgres-test`: profile `test`, 5433, db `mudafaa_test`, tmpfs.
    - `redis-test`: profile `test`, 6380, noeviction.
  - `firebase.json`: `{"emulators":{"auth":{"host":"0.0.0.0","port":9099},"ui":{"enabled":false},"singleProjectMode":true}}`.
  - `.firebaserc`: `{"projects":{"default":"demo-mudafaa"}}`.
  - `.env.example` anahtarları: `DATABASE_URL`, `DATABASE_URL_TEST`, `REDIS_URL`, `REDIS_URL_TEST`, `FIREBASE_PROJECT_ID=demo-mudafaa`, `FIREBASE_AUTH_EMULATOR_HOST=localhost:9099`, `PORT=3000`, `APP_ROLE=api`.

- [ ] **Step 1:** Dosyaları yaz.
- [ ] **Step 2:** `npm run db:up && docker compose ps` → postgres ve redis `healthy`.
- [ ] **Step 3:** `docker compose exec redis redis-cli CONFIG GET maxmemory-policy` → `noeviction`.
- [ ] **Step 4:** `firebase emulators:exec --only auth --project demo-mudafaa "curl -s http://localhost:9099/"` → çıktıda `"authEmulator"` geçer.
- [ ] **Step 5:** Commit: `chore: docker-compose ve firebase auth emulator`.

### Task 3: API iskeleti ve araç zinciri denemesi (NestJS 12 + Prisma 7.10 + workspace paketi)

**Files:**
- Create: `packages/case-schema/{package.json,tsconfig.json,src/index.ts,test/format.test.ts}`
- Create: `apps/api/{package.json,nest-cli.json,tsconfig.json,tsconfig.build.json,prisma.config.ts,prisma/schema.prisma}`
- Create: `apps/api/src/{main.ts,app.module.ts,config/env.ts,database/{database.module.ts,prisma.service.ts},redis/redis.module.ts,modules/health/{health.module.ts,health.controller.ts}}`
- Create: `apps/api/test/e2e/health.e2e.test.ts`
- Create: `docs/decisions/0001-module-format.md`

**Interfaces:**
- Produces:
  - `@mudafaa/case-schema`: `export const CASE_FORMAT = 'mudafaa.case/v1' as const`.
  - `GET /v1/health` → `200 {status:'ok', db:'up'|'down', redis:'up'|'down', format:'mudafaa.case/v1'}`.
  - `loadEnv(env: NodeJS.ProcessEnv): Env`: Zod ile doğrulanır. `NODE_ENV=production` iken `FIREBASE_AUTH_EMULATOR_HOST` varsa hata verir.
  - `PrismaService extends PrismaClient` (`PrismaPg` adaptörü).
  - `REDIS` enjeksiyon token'ı (ioredis).
  - Prisma: generator `prisma-client`, output `../src/generated/prisma`; ilk model `User` (`@@map("users")`: id uuid, firebaseUid unique, email?, displayName, isAnonymous, provider, role `Role {PLAYER, EDITOR, ADMIN}`, status `UserStatus {ACTIVE, SUSPENDED, DELETED}`, createdAt, updatedAt, lastSeenAt?); migration `init_users`.

- [ ] **Step 1: Failing tests**
  - `format.test.ts`: `expect(CASE_FORMAT).toBe('mudafaa.case/v1')`.
  - `health.e2e.test.ts`: supertest `GET /v1/health` → 200, body `{status:'ok', db:'up', redis:'up', format:'mudafaa.case/v1'}`. `DATABASE_URL_TEST` / `REDIS_URL_TEST` kullanır.
- [ ] **Step 2:** `npm run db:test:up && npm run test:e2e` → FAIL (modül yok).
- [ ] **Step 3:** Uygula. Bağımlılıklar: `@nestjs/{common,core,platform-express}@^12.2`, `reflect-metadata`, `rxjs`, `ioredis@^6`, `prisma@~7.10.1`, `@prisma/client@~7.10.1`, `@prisma/adapter-pg@~7.10.1`, `pg@^8`, `zod@^4.6.7`; dev: `@nestjs/cli@^12`, `@nestjs/testing@^12.2`, `unplugin-swc@^2`, `@swc/core`, `supertest`.
  - **Modül formatı denemesi** (sırayla, ilk çalışan kalır):
    1. API'yi ESM yap (`"type":"module"`).
    2. Olmazsa CJS API + paketleri Node 24 `require(esm)` ile tüket.
    3. O da olmazsa paketleri `tsdown` ile çift (CJS/ESM) derle.
  - Sonucu `docs/decisions/0001-module-format.md`'ye yaz.
- [ ] **Step 4:** `npm run build && npx -w apps/api prisma migrate dev --name init_users` (dev DB'ye) → migration oluştu.
- [ ] **Step 5:** `npm test -- --project case-schema && npm run test:e2e` → PASS.
- [ ] **Step 6:** `npm run start:dev -w apps/api` & `curl -s localhost:3000/v1/health` → `{"status":"ok","db":"up","redis":"up","format":"mudafaa.case/v1"}`.
- [ ] **Step 7:** Commit: `feat(api): NestJS 12 iskeleti, health ve Prisma 7 denemesi`.

### Task 4: Flutter iskeleti (FVM 3.47.7)

**Files:**
- Create: `apps/mobile/**` (flutter create çıktısı), `apps/mobile/.fvmrc`
- Create: `apps/mobile/assets/fonts/{PixelifySans-Regular.ttf,PixelifySans-SemiBold.ttf,PixelifySans-Bold.ttf,VT323-Regular.ttf,OFL-PixelifySans.txt,OFL-VT323.txt}` (google/fonts GitHub deposundaki `ofl/pixelifysans` statik dosyaları ve `ofl/vt323`)
- Create: `apps/mobile/lib/{main.dart,app/app.dart,design_system/tokens/px_colors.dart}`, `apps/mobile/test/app_smoke_test.dart`
- Modify: `apps/mobile/pubspec.yaml`, `apps/mobile/analysis_options.yaml`

**Interfaces:**
- Produces: `class MudafaaApp extends StatelessWidget` (lib/app/app.dart); `abstract final class PxColors { static const bg = Color(0xFF1D1733); static const ink = Color(0xFF120D1C); static const gold = Color(0xFFE8B13C); static const text = Color(0xFFEFE8FF); }`; font aileleri `PixelifySans` (400/600/700) ve `VT323` (400).

- [ ] **Step 1:** `dart pub global activate fvm && fvm --version`; `fvm install 3.47.7`.
- [ ] **Step 2:** `cd apps && fvm spawn 3.47.7 create mobile --org com.monolithyazilim --project-name mudafaa --platforms android,ios,web && cd mobile && fvm use 3.47.7 --force`.
- [ ] **Step 3:** `fvm flutter pub add flutter_riverpod riverpod_annotation go_router dio freezed_annotation json_annotation flutter_secure_storage firebase_core firebase_auth google_sign_in flutter_svg uuid intl` ve `fvm flutter pub add -d build_runner riverpod_generator riverpod_lint freezed json_serializable mocktail`. Fontları indir ve pubspec'e kaydet.
- [ ] **Step 4: Failing test** `app_smoke_test.dart`: `pumpWidget(const MudafaaApp())` → `find.text('MÜDAFAA')` findsOneWidget; Scaffold `backgroundColor == const Color(0xFF1D1733)`.
- [ ] **Step 5:** `fvm flutter test` → FAIL.
- [ ] **Step 6:** Uygula: Scaffold(bg PxColors.bg) ortasında `Text('MÜDAFAA')` (PixelifySans 700, 62, gold).
- [ ] **Step 7:** `fvm flutter test && fvm flutter analyze && fvm flutter build web` → hepsi başarılı.
- [ ] **Step 8:** Commit: `feat(mobile): FVM'li Flutter 3.47.7 iskeleti, fontlar ve tema tabanı`.

### Task 5: case-schema — ifadeler, etkiler, değişkenler

**Files:**
- Create: `packages/case-schema/src/{primitives,expr,effect,variable}.ts`
- Test: `packages/case-schema/test/{expr,effect,variable}.test.ts`

**Interfaces:**
- Produces (Zod şemaları + `z.infer` tipleri, `src/index.ts`'ten dışa aktarılır):
```ts
Id            // z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,63}$/)
Hex           // /^#[0-9a-fA-F]{6}$/
Category      // enum(6 kategori)
Expression    // enum(normal, mutlu, kizgin, saskin, uzgun)
Tone          // enum(success, error, neutral, special, info)
Rect          // {x:int≥0, y:int≥0, w:int>0, h:int>0}
Val           // number|string|boolean|{var}|{score:'raw'|'final'|`cat:${Category}`}|{count:'evidence';kind?;tag?}|{uses:Id}|{visits:Id}
              // |{add:Val[]}|{sub:[Val,Val]}|{mul:Val[]}|{div:[Val,Val]}|{min:Val[]}|{max:Val[]}|{round:Val}|{if:{when:Cond;then:Val;else:Val}}
Cond          // {all:Cond[]}|{any:Cond[]}|{not:Cond}|{cmp:[Val,'=='|'!='|'<'|'<='|'>'|'>=',Val]}
              // |{hasEvidence}|{met}|{visited}|{atNode}|{chosen;variant?}|{found}|{flag}|{ref}
Effect        // {type:'VAR';var;op:'set'|'inc'|'dec';value:Val}|{type:'SCORE';category;amount:Val;line?}|{type:'DISCOVER';evidence}
              // |{type:'MEET';character}|{type:'MARK';quality:'GOOD'|'BAD'|'NEUTRAL';feedback;category?}
              // |{type:'IF';when;then:Effect[];else?:Effect[]}|{type:'GOTO';node}|{type:'END';outcome?}
VariableDef   // {id, type:'int'|'bool'|'enum', initial, min?, max?, enumValues?, visibility:'HIDDEN'|'VISIBLE', analysis?:'resource'|'counter',
              //  display?:{label, widget:'meter10'|'hearts'|'percentBar'|'minutes'|'pips'|'counter'|'score'|'label', max?, lowAt?, format?}}
```
Tüm nesne şemaları `.strict()` olarak tanımlanır (bilinmeyen anahtar = hata).

- [ ] **Step 1: Failing tests**
  - `Val parses nested arithmetic`: `{add:[1,{var:'trust'},{mul:[2,{score:'cat:SORGULAMA'}]}]}` → success.
  - `Cond parses combinators and atoms`: `{all:[{hasEvidence:'ev_fis'},{cmp:[{var:'trust'},'>=',40]},{not:{flag:'cokus'}}]}` → success.
  - `Cond rejects unknown operator`: `{cmp:[1,'=~',2]}` → `success === false`.
  - `Effect SCORE accepts Val amount`: `{type:'SCORE',category:'SAVUNMA_STRATEJISI',amount:{div:[{mul:[200,{var:'strategy_pct'}]},100]},line:'savunma'}` → success.
  - `Effect rejects unknown category`: category `'HUKUK'` → fail.
  - `VariableDef int bounds`: `{id:'cred',type:'int',initial:6,min:0,max:5,visibility:'VISIBLE'}` → fail; issue message `initial` içerir.
  - `VariableDef enum initial must be listed`: `{id:'strategy',type:'enum',initial:'X',enumValues:['MASUMIYET','USUL','INDIRIM'],visibility:'HIDDEN'}` → fail.
  - `Id rules`: `'7x'` fail; `'C_00'` ve `'ev_fis'` success.
- [ ] **Step 2:** `npx vitest run --project case-schema` → FAIL.
- [ ] **Step 3:** Şemaları uygula (`z.lazy` ile özyinelemeli Val/Cond; `superRefine` ile int sınırları ve enum üyeliği).
- [ ] **Step 4:** Aynı komut → PASS.
- [ ] **Step 5:** Commit: `feat(case-schema): ifade, etki ve değişken şemaları`.

### Task 6: case-schema — içerik varlıkları

**Files:**
- Create: `packages/case-schema/src/{sprite,character,evidence,scene,choice,node,court,outcome,scoring,trigger,report}.ts`
- Test: `packages/case-schema/test/entities.test.ts`

**Interfaces:**
- Produces:
```ts
SpriteDef      {id, rows: string[] (tam 20; her biri /^[A-Za-z.]{1,16}$/), skin?: string(1), noEyes?: boolean, noMouth?: boolean}
CharacterDef   {id, name, shortLabel, role:'CLIENT'|'DEFENDANT'|'VICTIM'|'WITNESS'|'PROSECUTOR'|'JUDGE'|'POLICE'|'EXPERT'|'CLERK'|'USHER'|'GUARD'|'MENTOR'|'ASSISTANT'|'FAMILY'|'SUSPECT'|'OTHER',
                age?, occupation?, bio?, accent: Hex, spriteId: Id, notes?, initiallyKnown?: boolean}
IconKey        'key'|'document'|'receipt'|'bulb'|'camera'|'phone'|'fingerprint'|'boot'|'cigarette'|'magnifier'|'uv'|'dust'|'compare'|'lock'|'check'
EvidenceDef    {id, kind:'EVIDENCE'|'CLUE'|'INSIGHT', type:'FIZIKSEL'|'DIJITAL'|'TANIK_IFADESI'|'KAMERA_KAYDI'|'TELEFON_KAYDI'|'ADLI_RAPOR'|'BELGE'|'FOTOGRAF',
                title, shortText, description, sourceLabel, tagLabel?, icon: IconKey, side?:'DEFENSE'|'PROSECUTION'|'NEUTRAL', strength?:'STRONG'|'MEDIUM'|'WEAK',
                legalValidity:'VALID'|'EXCLUDABLE'|'EXCLUDED'|'UNKNOWN', legalNote?, presentable, combinable, countsInBag, initiallyKnown,
                relatedCharacters?: Id[], relatedEvents?: string[], tags?: Id[], missedHint?}
EvidenceRelation {from, to, type:'SUPPORTS'|'CONTRADICTS'|'DERIVED_FROM'|'REFUTES'}
DiscoveryPath  {evidence, source:{type:'INITIAL'|'OBJECT'|'CHOICE'|'RULE'|'TRIGGER'|'NODE', id?}, requires?: Cond, hint?}
Shape          {rect: Rect} | {circle:{cx:int, cy:int, r:int>0}} | {polygon: [int,int][] (≥3)}
SceneObject    {id, name, marker:'HIDDEN'|'VISIBLE', shapes: Shape[]≥1, z?: int, activeWhen?: Cond, effects?: Effect[], feedback:{text, short}, badge?, inspectNode?: Id, maxUses?: int}
SceneDef       {id, title, description?, width:int, height:int, image: Id, touchPadding?: int, unlockWhen?: Cond, objects: SceneObject[]}
Line           {speaker: Id|'player'|'narrator', expression?: Expression, text}
ResponseBlock  {when?: Cond, lines: Line[]≥1}
Feedback       {title?, text?, label?, tone: Tone}
Cost           {var: Id, amount: int>0}
Next           Id | '$stay' | '$return' | {push: Id} | {routes: {when?: Cond, to: Id}[]≥1}
Quality        {q:'GOOD'|'BAD'|'NEUTRAL', feedback, category?: Category}
Variant        {id, label, prompt?, effects?: Effect[], responses?: ResponseBlock[], quality?: Quality}
ActionKind     'CHOOSE'|'TAP'|'EXAMINE'|'COMBINE'|'PRESS'|'PRESENT'|'OBJECT'
Match          {tool, target} | {a, b} | {statement} | {statement?, evidence: Id[]≥1} | {statement?, ground}
ChoiceDef      {id, kind:'OPTION'|'TOPIC'|'NAVIGATE'|'CONTINUE'|'EXAMINE'|'COMBINE'|'PRESS'|'PRESENT'|'OBJECT'|'FALLBACK',
                label?, description?, prompt?, group?, tags?: {label, tone:'witness'|'info'|'negative'|'neutral'}[],
                visibleWhen?, enabledWhen?, lockedReason?, cost?: Cost[], maxUses?: int, repeat?:'NOOP'|'REJECT'|'APPLY'|'ONCE_PER_PARAMS',
                quality?: Quality, effects?: Effect[], responses?: ResponseBlock[], feedback?: Feedback, next?: Next,
                variants?: Variant[], match?: Match, fallbackFor?: ActionKind, confirm?: string, role?:'PRIMARY'|'BACK'}
                // refine: OPTION/TOPIC/NAVIGATE/CONTINUE → label zorunlu; EXAMINE/COMBINE/PRESS/PRESENT/OBJECT → uygun biçimde match zorunlu; FALLBACK → fallbackFor zorunlu
Statement      {id, order:int, visibleWhen?, segments: {text, highlightWhen?: Cond}[]≥1}
Block          {type:'profileCard', character, label, lines: string[], charge, demand}
               | {type:'sentenceRange', segments: ('green'|'gold'|'red'|'darkred')[] (tam 8), markerPct: 0..100, labels: string[] (tam 4), demandLabel}
               | {type:'paragraph', title, text} | {type:'strengthList', title, items:{label, strength:'STRONG'|'MEDIUM'|'WEAK'}[]}
               | {type:'choiceGroup', title, group, hints?: Record<Id,string>}
NodeDef        discriminatedUnion('type'). Ortak alanlar: {id, title?, eyebrow?, chapter?, background?, hud?: Id[], onEnter?: Effect[], onFirstEnter?: Effect[],
                lines?: ResponseBlock[], choices: ChoiceDef[], exposeCounts?: boolean}
  STORY         {phase?:'BRIEFING', blocks?: Block[]}
  CHOICE        {prompt?: Line}
  EVIDENCE      {prompt?: Line, evidence: Id}
  INVESTIGATION {tabs:{id, label, kind:'SCENE'|'PEOPLE'|'ARCHIVE', choices: Id[]}[], scenePreview?:{scene: Id}, quickTalk?:{character: Id, line, choices: Id[]}}
  DIALOGUE      {mode:'CONVERSATION'|'INTERVIEW', room:{label, character: Id, expression?}, moodRules?:{when?, label, tone, expression}[],
                 objectives?:{id, when: Cond, known, unknown}[], tones?:{id, label, hint?}[], allowPresent?: boolean}
  SCENE         {scene: Id, instruction, actionCosts?:{TAP?: Cost[]}}
  DOCUMENT      {title, header:{left, right}, columns:{label, flex:number}[], rows:{id, cells: string[], lens?: Record<Id,{cells: string[], tone: Tone}>}[],
                 tools:{id, label, icon: IconKey, visualMode?:'UV'}[], actionCosts?:{EXAMINE?: Cost[]}}
  DEDUCTION     {pool: Id[]}
  COURTROOM     {mode:'STAGE'|'TESTIMONY'|'OBJECTION', stage:{banner, bench:{character, label, xFrac: 0..1}[], witness?: Id, counsel: Id},
                 statements?: Statement[], witnessLabel?, prosecutionEvidence?: Id, rulesText?, objectionGrounds?: Id[], courtStage?: CourtStageType}
  DECISION      {routes:{when?: Cond, to: Id}[]≥1}
  RESULT        {}
CourtStageType 'ACILIS'|'IDDIANAME'|'SANIK_SAVUNMASI'|'EK_SAVUNMA'|'TANIK_DINLEME'|'DELIL_TARTISMA'|'MUTALAA'|'SAVUNMA'|'SON_SOZ'|'KARAR'
CourtSessionDef {id, title, stages:{id, type: CourtStageType, entryNode: Id}[]}
OutcomeDef     {id, class:'ACQUITTAL'|'REDUCED'|'CONVICTION'|'RECHARACTERIZED'|'OTHER', priority:int, when: Cond, stamp, stampTone:'green'|'amber'|'red',
                header?, sentence, verdictText, reasoning:{when?: Cond, text}[], legalBasis, xp: Val, howToReach, ethicsCard?}
ScoringConfig  {categories:{id: Category, label, advice:{weak, medium?, strong?}}[] (tam 6), lines:{id, label, categories?: Category[]}[],
                bonuses:{id, label, value: Val, line?: Id}[], multiplierPct?: Val, scaleMax:int, thresholdBar:{label, from:int, tone:'red'|'amber'|'green'}[], displayClampMin?: int}
TriggerDef     {id, scope?: Id, priority:int, when: Cond, once?: boolean, effects?: Effect[], goto?: Id}
ReportHint     {id, when: Cond, text, category?: Category}
```

- [ ] **Step 1: Failing tests** (`entities.test.ts`)
  - `SpriteDef requires exactly 20 rows`: 19 satır → fail.
  - `ChoiceDef FALLBACK requires fallbackFor` → fail.
  - `ChoiceDef PRESENT requires match.evidence` → fail.
  - `NodeDef discriminates by type`: `{id:'n1',type:'DECISION',routes:[{to:'n2'}],choices:[]}` → success; `type:'FOO'` → fail.
  - `COURTROOM bench xFrac must be within 0..1`: 1.2 → fail.
  - `Next accepts $return and push`: `'$return'` ve `{push:'n_scene'}` → success; `'$jump'` → fail.
  - `Turkish text preserved`: `Line.parse({speaker:'player',text:'“Sokak lambası yanıyordu” — İ ı ş ğ −150'}).text` girdiyle `===`.
- [ ] **Step 2:** `npx vitest run --project case-schema` → FAIL.
- [ ] **Step 3:** Şemaları uygula (`.strict()`, refine kuralları yukarıdaki gibi).
- [ ] **Step 4:** Aynı komut → PASS.
- [ ] **Step 5:** Commit: `feat(case-schema): içerik varlık şemaları`.

### Task 7: case-schema — CasePackage, parça birleştirme, aksiyon/görünüm sözleşmesi, JSON Schema, mini-case fikstürü

**Files:**
- Create: `packages/case-schema/src/{package,merge,action,view,json-schema}.ts`
- Create: `packages/case-schema/fixtures/mini-case.json`; `package.json` `exports`'una `"./fixtures/*": "./fixtures/*"` ekle
- Test: `packages/case-schema/test/{package,merge,view,json-schema}.test.ts`

**Interfaces:**
- Produces:
```ts
CasePackage {format:'mudafaa.case/v1',
  meta:{slug:/^[a-z0-9-]+$/, number:int, title, crimeLabel, lawRef, demandText, possibleSentence, difficulty:1..5, category:'CEZA', estimatedMinutes:int,
        requiredRank?: Id, summary, coverCharacter: Id, legalReview:{status:'PENDING'|'APPROVED', by?, at?}},
  config:{startNode: Id, scoring: ScoringConfig, objectionGrounds:{id, label, legalBasis?}[], display:{showRunningScore: boolean}, chronology?:{id, time, text}[]},
  predicates:{id, label, when: Cond}[], variables: VariableDef[], sprites: SpriteDef[], characters: CharacterDef[],
  relationships:{from, to, type, description, hidden?: boolean, revealWhen?: Cond}[], evidence: EvidenceDef[], evidenceRelations: EvidenceRelation[],
  discoveryPaths: DiscoveryPath[], scenes: SceneDef[], court:{sessions: CourtSessionDef[]}, nodes: NodeDef[], triggers: TriggerDef[], outcomes: OutcomeDef[],
  report:{hints: ReportHint[]}, assets:{id, kind:'IMAGE'|'FILE', path, sha256?}[],
  tests?:{goldenPaths:{name, actions: Action[], expect:{outcome: Id, finalMin?: int, finalMax?: int}}[]}}
mergeCaseParts(parts: unknown[]): unknown        // diziler verilen sırayla birleştirilir; düz nesneler derin birleştirilir; skaler çakışma → MergeError (yol ile)
class MergeError extends Error { path: string }
Action  {kind:'CHOOSE', choiceId, variant?} | {kind:'TAP', x:int, y:int} | {kind:'EXAMINE', tool, target} | {kind:'COMBINE', a, b}
        | {kind:'PRESS', statementId} | {kind:'PRESENT', evidenceId, statementId?} | {kind:'OBJECT', groundId, statementId?}
SessionView, NodeView, ActionResult, HudItem, ChoiceView, EvidenceCard, ClueCard   // docs/plan.md §6'daki şekiller; strict Zod
EvidenceCard {id, title, shortText, description, kindLabel, sourceLabel, icon: IconKey, legalNote?}
ClueCard     {id, title, sourceLabel, icon: IconKey}
CaseReport   {outcome:{id, class, stamp, stampTone, header?, sentence, verdictText, reasoning, legalBasis, ethicsCard?}, raw:int, final:int,
              breakdown:{label, value:int, tone}[], good:{source, feedback, category?}[], bad:{source, feedback, category?}[], missed:{text, category?}[],
              alternatives:{outcomeId, howToReach}[], skills:{category, label, earned:int, max:int, level:'weak'|'medium'|'strong', advice}[], xp:int}
casePackageJsonSchema(): Record<string, unknown>   // z.toJSONSchema(CasePackage)
```
- **mini-case.json içeriği** (sonraki görevlerin testleri bu kimliklere ve sayılara dayanır):
  - **Değişkenler:**

    | id | başlangıç | aralık | görünürlük / widget |
    |---|---|---|---|
    | day | 1 | 1..3 | VISIBLE pips |
    | ap | 3 | 0..3 | VISIBLE pips |
    | trust | 50 | 0..100 | VISIBLE percentBar |
    | minutes | 6 | 0..6 | VISIBLE minutes |
    | taps | 3 | 0..3 | VISIBLE counter, analysis resource |
    | exam | 2 | 0..2 | VISIBLE counter |
    | cred | 3 | 0..3 | VISIBLE hearts |
    | pers | 2 | 0..10 | VISIBLE meter10 |
    | strategy_pct | 100 | 0..200 | HIDDEN |
    | wrong | 0 | – | HIDDEN counter |
  - **Karakterler ve sprite'lar:** karakterler `k` (CLIENT), `w` (WITNESS), `j` (JUDGE); sprite'lar `s_k`, `s_w`, `s_j`.
  - **Deliller:** `e_key` (EVIDENCE, presentable, initiallyKnown, countsInBag), `e_doc` (EVIDENCE, presentable), `c_a`, `c_b`, `c_uv` (CLUE, combinable), `i_ab` (INSIGHT, presentable).
  - **Sahne `sc1`** (100×100):
    - `o_lamp`: rect(10,10,20,20), HIDDEN → DISCOVER c_a + SCORE ARASTIRMA 40.
    - `o_cam`: circle(70,70,10) → DISCOVER c_b + SCORE ARASTIRMA 40.
    - `o_cover`: rect(20,20,10,10), z 2, efekt yok, yalnızca geri bildirim.
  - **Node'lar:**

    | Node | Tür | İçerik |
    |---|---|---|
    | `n_brief` | STORY phase BRIEFING | onFirstEnter MEET k; OPTION `ch_str_a` (strategy_pct=150), `ch_str_b` (strategy_pct=80); ikisi de → n_hub |
    | `n_hub` | INVESTIGATION | tabs t_scene[`ch_go_scene`], t_people[`ch_go_talk`], t_archive[`ch_go_doc`, `ch_go_board`]. `ch_go_scene` / `ch_go_talk` / `ch_go_doc`: NAVIGATE, cost ap 1, push. `ch_go_board`: NAVIGATE, cost yok, push. `ch_go_court`: NAVIGATE → n_court1 |
    | `n_talk` | DIALOGUE INTERVIEW | tones soft/hard. TOPIC `tp_night` cost minutes 2: soft trust +4; hard trust −8 + DISCOVER c_b. OPTION `ch_show_a`: visibleWhen hasEvidence c_a, cost minutes 2 → SCORE ARASTIRMA 200 + MARK GOOD. CONTINUE `ch_talk_end` → $return |
    | `n_scene` | SCENE | sc1, actionCosts TAP taps 1; FALLBACK(TAP) `fb_tap`: SCORE ARASTIRMA −10; CONTINUE `ch_scene_end` → $return |
    | `n_doc` | DOCUMENT | tools mag (magnifier), uv (uv, visualMode UV); rows r1["A","B"], r2["C","D"] (lens uv → ["C","D*"] tone special). EXAMINE `ex_uv_r2` {tool uv, target r2} → DISCOVER c_uv + SCORE DELIL_ANALIZI 150. EXAMINE `ex_mag_r1` {tool mag, target r1} → DISCOVER e_doc + SCORE DELIL_ANALIZI 100. FALLBACK(EXAMINE) `fb_ex`: SCORE DELIL_ANALIZI −20. actionCosts EXAMINE exam 1. CONTINUE `ch_doc_end` → $return |
    | `n_board` | DEDUCTION | pool [c_a, c_b, c_uv]. COMBINE `cb_ab` {a c_a, b c_b} → DISCOVER i_ab + SCORE DELIL_ANALIZI 300. FALLBACK(COMBINE) `fb_cb`: SCORE DELIL_ANALIZI −50, repeat ONCE_PER_PARAMS. CONTINUE `ch_board_end` → $return |
    | `n_court1` | COURTROOM TESTIMONY | witness w. st1 segments ["Lamba ", {text:"yanıyordu", highlightWhen:{any:[{hasEvidence:'i_ab'},{chosen:'pr_st1'}]}}]; st2. PRESS `pr_st1` {statement st1}: SCORE SORGULAMA 25. PRESENT `ps_st1` {statement st1, evidence [i_ab, e_doc]}: SCORE SORGULAMA 300 + pers +2 + MARK GOOD. FALLBACK(PRESENT) `fb_ps`: cred −1, wrong +1, SCORE SORGULAMA −150 line `hatali`. CONTINUE `ch_court_next` → n_obj |
    | `n_obj` | COURTROOM OBJECTION | prosecutionEvidence e_key. OPTION `ob_a`: SCORE USUL_BILGISI 150, pers +1. OPTION `ob_b`: cred −1, SCORE USUL_BILGISI −50. İkisi de → n_choice |
    | `n_choice` | CHOICE | OPTION `cl_a`: SCORE SAVUNMA_STRATEJISI amount `{div:[{mul:[200,{var:'strategy_pct'}]},100]}`. OPTION `cl_b`. İkisi de → n_ev |
    | `n_ev` | EVIDENCE | evidence e_key; OPTION `ev_ok` → n_dec |
    | `n_dec` | DECISION | routes [{when: pers ≥ 5, to n_story_good}, {to n_result}] |
    | `n_story_good` | STORY | CONTINUE `ch_good_next` → n_result |
    | `n_collapse` | STORY | CONTINUE `ch_collapse_next` → n_result |
    | `n_result` | RESULT | – |
  - **Tetikleyiciler:**
    - `tg_day`: scope n_hub, priority 1, when {all:[ap ≤ 0, day < 3]}, effects day +1, ap = 3.
    - `tg_collapse`: global, priority 0, once, when cred ≤ 0, goto n_collapse.
  - **Sonuçlar:**
    - `o_win` (priority 1): when {all:[pers ≥ 5, final ≥ 300]}, xp `{div:[{mul:[{score:'final'},12]},100]}`.
    - `o_mid` (priority 2): when final ≥ 100, xp `{div:[{score:'final'},10]}`.
    - `o_lose` (priority 3): when {all:[]}, xp 0.
  - **Skor:**
    - Satırlar: delil[ARASTIRMA, DELIL_ANALIZI], capraz[SORGULAMA], itiraz[USUL_BILGISI, HUKUKI_BILGI], savunma[SAVUNMA_STRATEJISI], hatali.
    - Bonus `b_cred` = cred × 100 (line guven).
    - scaleMax 1000; thresholdBar Mahkûmiyet 0 / İndirim 100 / Beraat 300.
  - **Bulunma yolları** (her DISCOVER için bir yol; doğrulayıcı 1:1 eşleşme ister): c_a ← OBJECT o_lamp; c_b ← OBJECT o_cam ve CHOICE tp_night; c_uv ← RULE ex_uv_r2; e_doc ← RULE ex_mag_r1; i_ab ← RULE cb_ab; e_key ← INITIAL.
  - **Rapor ipuçları:** `h_cam` (when not hasEvidence c_b), `h_uv` (when not hasEvidence c_uv).
  - **Golden path'ler:**
    - `gp_win`: ch_str_a, ch_go_scene, TAP(15,15), TAP(70,70), ch_scene_end, ch_go_board, COMBINE(c_a,c_b), ch_board_end, ch_go_court, PRESENT(i_ab,st1), ch_court_next, ob_a, cl_a, ev_ok, ch_good_next → `o_win`, final 1430.
    - `gp_mid`: ch_str_b, ch_go_court, ch_court_next, ob_a, cl_b, ev_ok → `o_mid`, final 450.
    - `gp_lose`: ch_str_b, ch_go_court, PRESENT(e_key,st1) ×3, ch_collapse_next → `o_lose`, final −450.

- [ ] **Step 1: Failing tests**
  - `mini-case.json parses as CasePackage` → success.
  - `mergeCaseParts concatenates arrays and deep-merges objects`: `[{nodes:[A]},{nodes:[B],meta:{title:'x'}}]` → `{nodes:[A,B],meta:{title:'x'}}`.
  - `mergeCaseParts throws on scalar conflict`: `[{meta:{title:'a'}},{meta:{title:'b'}}]` → `MergeError`, `path === 'meta.title'`.
  - `Action rejects float TAP`: `{kind:'TAP',x:1.5,y:2}` → fail.
  - `NodeView parses a SCENE view`: örnek `{type:'SCENE',id:'n_scene',imageUrl:'/a.png',width:100,height:100,instruction:'…',found:[],hiddenTotal:3}`.
  - `json schema exports object root`: `casePackageJsonSchema().type === 'object'`.
- [ ] **Step 2:** `npx vitest run --project case-schema` → FAIL.
- [ ] **Step 3:** Uygula ve mini-case.json'u yukarıdaki tabloya göre yaz.
- [ ] **Step 4:** Aynı komut → PASS.
- [ ] **Step 5:** Commit: `feat(case-schema): CasePackage, birleştirme, sözleşme ve mini-case fikstürü`.

### Task 8: engine — ifade değerlendirici

**Files:**
- Create: `packages/engine/{package.json,tsconfig.json}`, `packages/engine/src/{types,errors}.ts`, `packages/engine/src/expr/{eval,refs,typecheck}.ts`, `packages/engine/test/helpers/ctx.ts`
- Test: `packages/engine/test/expr.test.ts`

**Interfaces:**
- Consumes: case-schema `Val, Cond, Effect, CasePackage` tipleri.
- Produces:
```ts
interface SessionState { schema:1; seq:number; status:'ACTIVE'|'COMPLETED'; nodeId:string; stack:string[];
  vars:Record<string, number|boolean|string>; evidence:Record<string,{seq:number; via:string}>; characters:Record<string,number>;
  visits:Record<string,number>; uses:Record<string,number>; paramUses:Record<string,string[]>; found:Record<string,number>; latches:Record<string,boolean>;
  score:{cat:Record<Category,number>; line:Record<string,number>}; marks:{seq:number; source:string; quality:'GOOD'|'BAD'|'NEUTRAL'; feedback:string; category?:Category}[];
  last?: ActionResult; outcome?:{id:string; raw:number; final:number; xp:number} }
interface EvalCtx { c: CompiledCase; s: Readonly<SessionState>; final?: number }
class EngineError extends Error { code: 'UNKNOWN_VAR'|'UNKNOWN_PREDICATE'|'FINAL_UNAVAILABLE'|'TYPE' }
evalVal(v: Val, ctx: EvalCtx): number | string | boolean
evalCond(c: Cond, ctx: EvalCtx): boolean
collectRefs(x: Cond | Val | Effect | readonly Effect[], out?: RefSet): RefSet
interface RefSet { vars:Set<string>; evidence:Set<string>; characters:Set<string>; nodes:Set<string>; choices:Set<string>; objects:Set<string>; predicates:Set<string>; categories:Set<string> }
typeOf(v: Val, c: CompiledCase): 'int' | 'bool' | 'string' | `enum:${string}`
```
- **Anlam kuralları** (testlerle sabitlenir):
  - `div` aşağı yuvarlar (`7/2 = 3`, `−7/2 = −4`); sıfıra bölme `0` verir.
  - `round` yarımı yukarı yuvarlar (`2.5 → 3`).
  - `{uses:'ch'}` bir seçeneğin kaç kez seçildiğidir; varyantlar `uses['ch#variant']` anahtarıyla izlenir.
  - `{chosen:'ch', variant}` → `uses['ch#variant'] ≥ 1`.
  - `{score:'raw'}` = kategori toplamıdır. `{score:'final'}` yalnızca `ctx.final` doluyken kullanılabilir; değilse `FINAL_UNAVAILABLE` hatası.
  - `{flag:'x'}` → `vars.x === true`.
  - `{count:'evidence', kind?, tag?}` → bulunan ve süzgece uyan delil sayısı.
  - `{ref}` → `c.predicates`'tan çözülür.

- [ ] **Step 1: Failing tests** (`expr.test.ts`; `ctx.ts` mini-case'ten küçük bir `CompiledCase` taslağı ve ayarlanabilir durum kurar)
  - `div floors`: `{div:[7,2]}` → 3; `{div:[-7,2]}` → −4; `{div:[5,0]}` → 0.
  - `round half up`: `{round:2.5}` → 3.
  - `if selects branch`: `{if:{when:{flag:'f'},then:1,else:2}}`; f=false → 2.
  - `score raw sums categories`: cat SORGULAMA 300, USUL_BILGISI −50 → `{score:'raw'}` 250.
  - `score final requires ctx.final`: `FINAL_UNAVAILABLE` fırlatır; final:1430 ile 1430 döner.
  - `count evidence by kind`: e_key + c_a bulunmuş → `{count:'evidence',kind:'CLUE'}` 1.
  - `chosen with variant`: `uses['tp_night#soft']=1` → `{chosen:'tp_night',variant:'soft'}` true, `variant:'hard'` false.
  - `cmp numeric and enum equality`: `{cmp:[{var:'trust'},'>=',40]}`; `{cmp:[{var:'strategy'},'==','USUL']}`.
  - `unknown var throws UNKNOWN_VAR`.
  - `collectRefs gathers all namespaces`: `{all:[{hasEvidence:'c_a'},{cmp:[{var:'cred'},'<=',0]},{chosen:'ob_a'}]}` → evidence {c_a}, vars {cred}, choices {ob_a}.
  - `typeOf infers int for arithmetic and bool for flags`.
- [ ] **Step 2:** `npx vitest run --project engine` → FAIL.
- [ ] **Step 3:** Uygula.
- [ ] **Step 4:** Aynı komut → PASS.
- [ ] **Step 5:** Commit: `feat(engine): ifade değerlendirici ve referans toplayıcı`.

### Task 9: engine — compile, başlangıç durumu, kanonik JSON ve durum hash'i

**Files:**
- Create: `packages/engine/src/{compile,state,hash,version}.ts`
- Test: `packages/engine/test/compile.test.ts`

**Interfaces:**
- Produces:
```ts
interface Issue { severity:'ERROR'|'WARNING'|'INFO'; code:string; message:string; path:string }
compile(pkg: unknown): { ok:true; c: CompiledCase; warnings: Issue[] } | { ok:false; issues: Issue[] }
interface CNode { def: NodeDef; choices: Map<string, ChoiceDef>; rules: Record<'EXAMINE'|'COMBINE'|'PRESS'|'PRESENT'|'OBJECT', ChoiceDef[]>;
  fallbacks: Partial<Record<ActionKind, ChoiceDef>>; scopedTriggers: TriggerDef[] }
interface CompiledCase { key:string; hash:string; pkg: Readonly<CasePackage>; nodes: Map<string,CNode>; choiceIndex: Map<string,{node:string; choice:ChoiceDef}>;
  vars: Map<string,VariableDef>; evidence: Map<string,EvidenceDef>; characters: Map<string,CharacterDef>; sprites: Map<string,SpriteDef>;
  scenes: Map<string,SceneDef>; objects: Map<string,{scene:string; obj:SceneObject}>; statements: Map<string,{node:string; st:Statement}>;
  predicates: Map<string,Cond>; triggers: TriggerDef[]; outcomes: OutcomeDef[]; discovery: Map<string,DiscoveryPath[]>;
  grounds: Map<string,{id:string; label:string; legalBasis?:string}>; lineByCategory: Map<Category,string> }
initialState(c: CompiledCase): SessionState
canonicalJson(x: unknown): string      // sıralı anahtarlar, boşluksuz
stateHash(s: SessionState): string     // canonicalJson üzerinde FNV-1a 64-bit (BigInt), 16 hex karakter
ENGINE_VERSION = 1
```
- **Compile hata kodları:**
  - `SCHEMA`: Zod hataları; path = Zod yolu.
  - `DUPLICATE_ID`: ad alanları node, choice (global), var, evidence, character, sprite, scene, object, statement, outcome, trigger, predicate.
  - `DANGLING_REF`: startNode, next/push/routes, GOTO, DISCOVER/MEET, spriteId, scenePreview/scene, inspectNode, Match kimlikleri (node araçları/satırları, havuz delilleri, node ifadeleri, config gerekçeleri), hud/cost değişkenleri, koşul ref'leri.
  - `PREDICATE_CYCLE`.
- **Sıralama:** `triggers` priority artan, eşitlikte id; `outcomes` priority artan.
- **`lineByCategory`:** her kategori için onu içeren ilk `scoring.lines` girdisi.

- [ ] **Step 1: Failing tests**
  - `compiles mini-case cleanly` → `ok === true && warnings.length === 0`.
  - `duplicate choice id across nodes` → issue `DUPLICATE_ID`, path `nodes[2].choices[0].id` (yamalı kopya).
  - `dangling next target` → `DANGLING_REF`.
  - `predicate cycle` (p1 → p2 → p1) → `PREDICATE_CYCLE`.
  - `initialState`: `vars.cred === 3`, `evidence.e_key.via === 'INITIAL'`, `nodeId === 'n_brief'`, tüm `score.cat` değerleri 0.
  - `stateHash ignores key order and detects value change`.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula. **Step 4:** PASS.
- [ ] **Step 5:** Commit: `feat(engine): compile, başlangıç durumu ve durum hash'i`.

### Task 10: engine — etki uygulayıcı

**Files:**
- Create: `packages/engine/src/{effects,draft,format}.ts`
- Test: `packages/engine/test/effects.test.ts`

**Interfaces:**
- Produces:
```ts
interface FxItem { kind:'VAR'|'SCORE'|'EVIDENCE'|'CHARACTER'|'SHOUT'|'VERDICT'; label:string; delta?:number; id?:string }
type EngineEvent =
  | {type:'VAR'; var:string; from:unknown; to:unknown} | {type:'SCORE'; category:Category; amount:number; line?:string; source:string}
  | {type:'DISCOVER'; evidence:string; source:string} | {type:'MEET'; character:string}
  | {type:'MARK'; quality:'GOOD'|'BAD'|'NEUTRAL'; feedback:string; category?:Category; source:string}
  | {type:'NODE_ENTER'; node:string} | {type:'TRIGGER'; id:string} | {type:'OUTCOME'; id:string; raw:number; final:number; xp:number}
interface Draft { c: CompiledCase; s: SessionState; fx: FxItem[]; events: EngineEvent[]; discovered: string[]; source: string;
  goto?: string; end?: { outcome?: string }; hops: number }
newDraft(c: CompiledCase, s: SessionState, source: string): Draft    // s'yi structuredClone ile kopyalar
applyEffects(effects: readonly Effect[] | undefined, d: Draft): void
formatSigned(n: number): string    // 300 → "+300", −150 → "−150" (U+2212), 0 → "0"
```
- **Anlam kuralları:**
  - **VAR:** int değerler `[min,max]`'a sıkıştırılır. Değer değişmediyse olay ve fx üretilmez. VISIBLE değişkenler için fx `{kind:'VAR', label: display.label, delta}`.
  - **SCORE:** `amount = Math.trunc(evalVal)`. Açık `line` varsa ona, yoksa `lineByCategory`'ye yazılır. fx label `"${formatSigned(n)} SKOR"`.
  - **DISCOVER:** zaten bulunmuşsa hiçbir şey yapılmaz. Kaynağı `d.source` olan bir bulunma yolunun `requires` koşulu false ise atlanır. Bulununca `evidence[id] = {seq: s.seq, via: d.source}`; fx `{kind:'EVIDENCE', label: title, id}`.
  - **MEET:** yalnızca ilk karşılaşmada uygulanır.
  - **MARK:** `marks`'a eklenir.
  - **IF:** koşula göre dal seçer.
  - **GOTO / END:** `d.goto` / `d.end` ayarlanır.

- [ ] **Step 1: Failing tests**
  - `VAR inc clamps to max and emits nothing when unchanged`: cred 3, inc 5 → cred 3, `fx.length === 0`.
  - `VAR dec clamps to min`: taps 0, dec 1 → 0.
  - `SCORE Val amount with strategy_pct`: strategy_pct 150 → `score.cat.SAVUNMA_STRATEJISI === 300`, `score.line.savunma === 300`, fx label `'+300 SKOR'`.
  - `negative SCORE label uses U+2212`: −150 → label `'−150 SKOR'`, `score.line.hatali === −150`.
  - `DISCOVER idempotent`: iki kez → tek `DISCOVER` olayı, seq değişmez.
  - `DISCOVER respects discovery path requires`: yol `{evidence:'c_uv', source:{type:'RULE', id:'ex_uv_r2'}, requires:{flag:'never_var'}}`, `d.source = 'ex_uv_r2'` → bulunmaz.
  - `IF picks else branch`.
  - `MARK appends with source`.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula. **Step 4:** PASS.
- [ ] **Step 5:** Commit: `feat(engine): etki uygulayıcı`.

### Task 11: engine — CHOOSE aksiyonu, geçişler, DECISION, start()

**Files:**
- Create: `packages/engine/src/{act,start,transitions,legality,responses}.ts`
- Test: `packages/engine/test/act-choose.test.ts`

**Interfaces:**
- Consumes: Task 9 `compile/initialState`, Task 10 `newDraft/applyEffects`.
- Produces:
```ts
type RejectCode = 'SESSION_NOT_ACTIVE'|'ACTION_NOT_ALLOWED'|'CHOICE_UNAVAILABLE'|'RESOURCE_EXHAUSTED'|'INVALID_PARAMS'|'NO_MATCH'|'LOOP_LIMIT'
interface ActOk { ok:true; state: SessionState; events: EngineEvent[]; result: ActionResult }
interface ActReject { ok:false; code: RejectCode; message: string }
act(c: CompiledCase, s: SessionState, a: Action): ActOk | ActReject
start(c: CompiledCase): { state: SessionState; events: EngineEvent[] }
enterNode(d: Draft, nodeId: string): void          // visits++; ilk ziyarette onFirstEnter; sonra onEnter; node.lines → result satırları; DECISION ise rotayı hemen izler (hops'a sayılır)
resolveNext(d: Draft, next: Next | undefined): void
```
- **Node türüne göre kabul edilen aksiyonlar:**

  | Node türü | Aksiyonlar |
  |---|---|
  | STORY / CHOICE / EVIDENCE / INVESTIGATION | CHOOSE |
  | DIALOGUE | CHOOSE (+ `allowPresent` ise PRESENT) |
  | SCENE | CHOOSE, TAP |
  | DOCUMENT | CHOOSE, EXAMINE |
  | DEDUCTION | CHOOSE, COMBINE |
  | COURTROOM TESTIMONY | CHOOSE, PRESS, PRESENT, OBJECT |
  | COURTROOM STAGE / OBJECTION | CHOOSE |
  | RESULT | hiçbiri |

  Bunların dışı → `ACTION_NOT_ALLOWED`.
- **CHOOSE yasallığı:**
  - Seçenek türü OPTION / TOPIC / NAVIGATE / CONTINUE olmalı; `visibleWhen` ve `enabledWhen` true olmalı.
  - Varsayılan `maxUses`: OPTION/TOPIC için 1 (repeat REJECT); NAVIGATE/CONTINUE için sınırsız.
  - Gizli, kullanılmış veya hiç olmayan seçenek → aynı mesajlı `CHOICE_UNAVAILABLE`.
  - Maliyet karşılanamıyorsa → `RESOURCE_EXHAUSTED`.
  - Varyantlı seçenekte varyant zorunlu ve var olmalı; varyantsız seçenekte varyant gönderilemez → aksi halde `INVALID_PARAMS`.
- **Etki sırası:** maliyet (VAR dec) → choice.effects → variant.effects → quality (MARK) → `uses[id]++` ve `uses[id#variant]++`.
- **Yanıt:** `variant.responses ?? choice.responses` içinden, etkilerden sonra `when` koşulunu tutan ilk blok.
- **Geçiş:**
  - Varsayılan `'$stay'`; `d.goto` varsa `next`'in önüne geçer.
  - push: mevcut node yığına atılır. Yığın derinliği >4 olursa `LOOP_LIMIT` ile tüm aksiyon reddedilir.
  - `$return`: yığından çıkılır.
  - routes: ilk eşleşen rota.
  - Aksiyon başına toplam node girişi (hops) ≤ 16.
- **Reddetme:** hiçbir değişiklik yazılmaz; girdi durumu aynen kalır.

- [ ] **Step 1: Failing tests** (mini-case)
  - `start enters n_brief and meets k`: `characters.k ≥ 1`, `visits.n_brief === 1`.
  - `strategy choice sets pct and moves to hub`: `ch_str_a` → `strategy_pct 150`, `nodeId 'n_hub'`.
  - `hidden and unknown choices are indistinguishable`: `ch_show_a` (c_a yok) ve `'nope'` → ikisi de `{ok:false, code:'CHOICE_UNAVAILABLE'}`, mesajlar eşit.
  - `cost gating rejects without side effects`: ap 0 → `ch_go_scene` → `RESOURCE_EXHAUSTED`; girdi ve çıktı hash'i aynı.
  - `push and $return`: `ch_go_talk`, `ch_talk_end` → `nodeId 'n_hub'`, `stack []`.
  - `TOPIC requires variant`: varyantsız `tp_night` → `INVALID_PARAMS`; `variant 'soft'` → trust 54, minutes 4, soft yanıt satırları döner.
  - `TOPIC once`: ikinci `tp_night` → `CHOICE_UNAVAILABLE`.
  - `DECISION routes immediately`: pers 5 iken `ev_ok` → `nodeId 'n_story_good'`.
  - `COMPLETED session rejects`: status COMPLETED → `SESSION_NOT_ACTIVE`.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula. **Step 4:** PASS.
- [ ] **Step 5:** Commit: `feat(engine): CHOOSE, geçişler, DECISION ve start`.

### Task 12: engine — parametrik aksiyonlar, isabet testi, fallback ve tekrar politikaları

**Files:**
- Create: `packages/engine/src/resolve/{hit-test,match}.ts`
- Modify: `packages/engine/src/act.ts`
- Test: `packages/engine/test/{hit-test,act-params}.test.ts`

**Interfaces:**
- Produces:
```ts
hitTest(scene: SceneDef, x: number, y: number, isActive: (o: SceneObject) => boolean): SceneObject | null
// rect: x ≤ px < x+w && y ≤ py < y+h; circle: dx²+dy² ≤ r²; polygon: even-odd ışın; touchPadding rect'i ve dairenin r'sini büyütür; sıralama z azalan, sonra yazım sırası
boundingRect(shape: Shape): Rect
```
- **TAP:**
  - `0 ≤ x < width` ve `0 ≤ y < height` olmalı; değilse `INVALID_PARAMS`.
  - Aktif nesneye isabet:
    - Zaten bulunmuşsa: resolution `NOOP`, maliyet yok, geri bildirim yeniden gösterilir.
    - Bulunmamışsa: `actionCosts.TAP` düşülür, nesne etkileri uygulanır, `found[id] = seq`, resolution `HIT`, `result.hit = {objectId, rect: boundingRect(shapes[0]), text: feedback.text}`. `inspectNode` varsa o node'a push edilir.
  - Iska: maliyet düşülür, FALLBACK(TAP) uygulanır, resolution `MISS`. Fallback yoksa maliyetten önce `NO_MATCH` ile reddedilir.
- **EXAMINE:**
  - tool ve target node'da tanımlı olmalı; değilse `INVALID_PARAMS`.
  - Kural eşleşmesi: daha önce uygulanmışsa (uses ≥ maxUses=1) → `NOOP`, maliyet yok. Değilse maliyet + etkiler, resolution `RULE`.
  - Eşleşme yoksa: maliyet + fallback. Fallback repeat varsayılanı `APPLY`; `ONCE_PER_PARAMS` anahtarı `tool|target`.
- **COMBINE:**
  - a ≠ b; ikisi de bulunmuş, havuzda ve combinable olmalı; değilse `INVALID_PARAMS`.
  - Sıra fark etmez. `ONCE_PER_PARAMS` anahtarı sıralı çift.
- **PRESS:** ifade node'da var ve görünür olmalı. Kural varsa etkiler uygulanır; yoksa `NOOP`.
- **PRESENT:**
  - Delil bulunmuş olmalı; COURTROOM'da ayrıca `presentable` olmalı. TESTIMONY'de `statementId` zorunlu ve görünür olmalı.
  - Kural eşleşmesi: `match.statement` eşit veya yok, `evidence ∈ match.evidence`, `when` true.
  - Eşleşme yoksa FALLBACK(PRESENT).
- **OBJECT:** `groundId ∈ node.objectionGrounds` olmalı. Kural eşleşmesi `{statement?, ground}`; yoksa FALLBACK(OBJECT).

- [ ] **Step 1: Failing tests**
  - `hitTest picks topmost by z`: (25,25) → o_cover; (15,15) → o_lamp.
  - `hitTest circle and polygon`: circle(70,70,10) için (79,70) içeride, (81,70) dışarıda; üçgen [(0,0),(10,0),(0,10)] için (2,2) içeride, (9,9) dışarıda.
  - `TAP hit discovers and costs`: TAP(15,15) → c_a bulunur, taps 2, ARASTIRMA +40, resolution HIT.
  - `TAP on found object is NOOP and free`: tekrar TAP(15,15) → taps 2, ARASTIRMA 40 kalır, NOOP.
  - `TAP miss charges and applies fallback`: TAP(95,5) → taps −1, ARASTIRMA −10, MISS.
  - `TAP with zero taps`: → `RESOURCE_EXHAUSTED`. `TAP outside bounds` → `INVALID_PARAMS`.
  - `EXAMINE rule then NOOP`: (uv,r2) → c_uv, exam 1, DELIL_ANALIZI +150; ikinci (uv,r2) → NOOP, exam 1.
  - `EXAMINE fallback each time until exhausted`: (mag,r2) ×2 → toplam −40, exam 0; üçüncüsü → `RESOURCE_EXHAUSTED`.
  - `EXAMINE second rule discovers e_doc`: (mag,r1) → e_doc bulunur, DELIL_ANALIZI +100.
  - `COMBINE order-insensitive`: COMBINE(c_b,c_a) → i_ab bulunur, +300.
  - `COMBINE invalid inputs`: COMBINE(c_a,e_key) → `INVALID_PARAMS`.
  - `COMBINE wrong pair penalised once per pair`: COMBINE(c_a,c_uv) iki kez → yalnızca bir kez −50.
  - `PRESENT correct`: i_ab@st1 → pers +2, SORGULAMA +300, GOOD işareti.
  - `PRESENT wrong applies fallback`: e_key@st1 → cred −1, wrong +1, line hatali −150.
  - `PRESENT undiscovered evidence`: → `INVALID_PARAMS`, ceza yok.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula. **Step 4:** PASS.
- [ ] **Step 5:** Commit: `feat(engine): parametrik aksiyonlar, isabet testi ve fallback politikaları`.

### Task 13: engine — tetikleyiciler, RESULT sonlandırma, skor, sonuç, XP ve rapor

**Files:**
- Create: `packages/engine/src/{triggers,scoring,report}.ts`
- Modify: `packages/engine/src/{act,start}.ts` (her aksiyondan sonra tetikleyiciler; RESULT'a girişte sonlandırma)
- Test: `packages/engine/test/{triggers,result,golden-mini}.test.ts`

**Interfaces:**
- Produces:
```ts
runTriggers(d: Draft): void
computeScore(c: CompiledCase, s: SessionState): { raw:number; bonuses:{id:string; label:string; value:number}[]; final:number; lines:{id:string; label:string; value:number}[] }
selectOutcome(c: CompiledCase, s: SessionState, final: number): OutcomeDef
report(c: CompiledCase, s: SessionState, opts?: { categoryMax?: Partial<Record<Category, number>> }): CaseReport   // status COMPLETED değilse EngineError('TYPE')
renderLabel(template: string, c: CompiledCase, s: SessionState): string   // {{count.evidence:TAG}}, {{total.tag:TAG}}, {{var.NAME}}
```
- **Tetikleyici anlamı:**
  - Global tetikleyiciler + `scope === mevcut node` olanlar; priority artan, eşitlikte id.
  - Koşul false→true'ya döndüğünde ateşlenir (`latches[id]` son değeri tutar). `once` ise bir daha ateşlenmez.
  - Önce etkiler, sonra goto uygulanır. Bir tur hiçbir şey ateşlemeyene kadar turlar tekrarlanır.
  - Aksiyon başına toplam hops ≤ 16; aşılırsa tüm aksiyon `LOOP_LIMIT` ile reddedilir.
- **Sonlandırma** (RESULT'a girildiğinde):
  - `computeScore`; `final = raw + Σ bonus` (multiplierPct tanımlıysa `round(raw × pct / 100) + Σ bonus`).
  - Outcome: `END{outcome}` varsa o, yoksa `selectOutcome`.
  - `xp = max(0, floor(evalVal(outcome.xp, {final})))`.
  - `s.outcome` doldurulur; `status = 'COMPLETED'`; fx VERDICT; olay OUTCOME.
- **Rapor:**
  - good / bad: işaretlerden, sırayla.
  - missed: `when` koşulu true olan `report.hints` + bulunmamış delillerin `missedHint`'i; aynı metin tekilleştirilir.
  - alternatives: elde edilmeyen sonuçlar priority sırasıyla, `howToReach` ile.
  - skills: `earned = max(0, score.cat[k])`; `max = opts.categoryMax?.[k]`, yoksa pakette o kategoriye ait pozitif literal SCORE tutarlarının toplamı. Oran <0,4 → weak; ≤0,75 → medium; aksi halde strong.

- [ ] **Step 1: Failing tests**
  - `day rollover only at hub`: n_scene'deyken ap 0 → day 1 kalır; `ch_scene_end` → day 2, ap 3.
  - `latch fires once per edge`: patch'li tetikleyici `when cred ≤ 1, effects pers +1`. cred 2→1 ateşler; 1'de kalırken ateşlemez; 1→2→1 tekrar ateşler.
  - `global collapse`: üç yanlış PRESENT → `nodeId 'n_collapse'`, olaylarda `TRIGGER tg_collapse`.
  - `loop limit rejects`: patch'li ping-pong (`goto a ↔ b`) → `LOOP_LIMIT`, durum değişmez.
  - `mini golden paths`: gp_win → o_win, final 1430, xp 171; gp_mid → o_mid, final 450, xp 45; gp_lose → o_lose, final −450, xp 0.
  - `breakdown sums to final`: gp_win için Σ lines + Σ bonuses = 1430.
  - `report after gp_mid`: alternatives o_win'in howToReach'ini içerir; `skills.length === 6`; missed `h_cam` metnini içerir.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula. **Step 4:** PASS.
- [ ] **Step 5:** Commit: `feat(engine): tetikleyiciler, sonuç seçimi, skor ve rapor`.

### Task 14: engine — temizlenmiş view(), enumerateActions ve görünüm fikstürleri

**Files:**
- Create: `packages/engine/src/view/{index,common,story,investigation,dialogue,scene,document,deduction,courtroom,choice,result}.ts`, `packages/engine/src/enumerate.ts`, `packages/engine/scripts/export-view-fixtures.ts`
- Create (üretilen, commit'lenen): `packages/engine/fixtures/views/{story,investigation,dialogue,scene,document,deduction,courtroom-testimony,courtroom-objection,choice,evidence,result}.json`
- Test: `packages/engine/test/{view,enumerate}.test.ts`

**Interfaces:**
- Produces:
```ts
view(c: CompiledCase, s: SessionState, meta: { sessionId:string; caseId:string; stateVersion:number; mode:'NORMAL'|'TEST' }): SessionView   // case-schema SessionView.parse'tan geçer
enumerateActions(c: CompiledCase, s: SessionState): Action[]
```
- **View kuralları:**
  - `choices`: yalnızca `visibleWhen` true olanlar; `available` = enabled ∧ karşılanabilir ∧ kullanılabilir; `used` = uses ≥ 1.
  - `hud`: node `hud` listesindeki VISIBLE değişkenler.
  - `cast`: node'da görünen karakterler (oda/tezgâh/tanık/konuşmacılar).
  - `bag`: bulunmuş, `countsInBag` olan EVIDENCE/INSIGHT. `notebook`: bulunmuş CLUE'lar.
  - SCENE `found`: yalnızca bulunan nesneler. `hiddenTotal` = gizli nesne sayısı (`exposeCounts` ise).
  - TESTIMONY segment `highlight` = `evalCond(highlightWhen)`.
  - RESULT: `s.outcome` + `computeScore` satırları + eşik bandı.
- **`enumerateActions`:**
  - Görünür, kullanılabilir CHOOSE'lar (her varyant için ayrı).
  - TAP: her aktif ve bulunmamış nesnenin ilk şeklinin merkezi + tüm şekillerin dışında tek bir ıska noktası (fallback varsa ve maliyet karşılanabiliyorsa).
  - EXAMINE araç × satır (maliyet karşılanabiliyorsa).
  - COMBINE: bulunmuş havuz kartlarının sırasız tüm çiftleri.
  - PRESS: kuralı olan görünür ifadeler.
  - PRESENT: TESTIMONY'de presentable × görünür ifade; DIALOGUE `allowPresent` ise bulunmuş deliller.
  - OBJECT: gerekçe × görünür ifade.

- [ ] **Step 1: Failing tests**
  - `hidden choices never appear`: n_talk'ta c_a yokken `JSON.stringify(view)` içinde `'ch_show_a'` geçmez.
  - `scene exposes only found objects`: önce `found []`, JSON'da `'o_lamp'` yok, `hiddenTotal 3`; TAP(15,15) sonrası `found[0]` = `{objectId:'o_lamp', rect:{x:10,y:10,w:20,h:20}}`.
  - `hud excludes hidden vars`: hiçbir view'da `'strategy_pct'` yok.
  - `testimony highlight hidden until revealed`: st1 segment[1].highlight önce false; PRESS pr_st1 sonrası true.
  - `bag and notebook split by kind`: başlangıçta bag [e_key], notebook [].
  - `undiscovered evidence titles absent`: i_ab başlığı bulunmadan önce JSON'da yok.
  - `view keeps Turkish text verbatim`: st1 metni `"yanıyordu"` aynen.
  - `every golden-path view parses`: üç golden path'in her adımında `SessionView.parse(view(...))` başarılı.
  - `enumerateActions includes miss probe and excludes found objects`.
  - `view fixtures are up to date`: export script bellekte üretir; dosyalarla deep-equal.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula; `npx tsx packages/engine/scripts/export-view-fixtures.ts` ile fikstürleri yaz. **Step 4:** PASS.
- [ ] **Step 5:** Commit: `feat(engine): temizlenmiş görünüm, aksiyon numaralandırma ve sözleşme fikstürleri`.

### Task 15: engine — determinizm, özellik testleri ve migrateState

**Files:**
- Create: `packages/engine/src/migrate.ts`, `packages/engine/src/index.ts` (son dışa aktarımlar)
- Test: `packages/engine/test/{property,purity}.test.ts`

**Interfaces:**
- Produces:
  - `migrateState(s: unknown): SessionState`: schema 1 doğrulanıp geçirilir; bilinmeyen schema → `EngineError('TYPE')`.
  - `index.ts` dışa aktarımları: `compile, start, act, view, report, enumerateActions, stateHash, canonicalJson, computeScore, migrateState, ENGINE_VERSION`, tüm tipler.

- [ ] **Step 1: Failing tests**
  - `random walks keep invariants` (fast-check, `seed: 7`, `numRuns: 200`, ≤60 adım; her adımda `enumerateActions` içinden seçim):
    - her değişken `[min,max]` içinde;
    - `Σ score.cat` = SCORE olaylarının toplamı;
    - `SessionView.parse` başarılı;
    - HIDDEN değişken adları view JSON'unda yok;
    - hiçbir istisna yok.
  - `replay determinism`: aynı aksiyon günlüğünü iki kez oynat → `stateHash` eşit.
  - `engine sources are pure`: `packages/engine/src/**/*.ts` içinde `/\bDate\b|Math\.random|performance\.|from 'node:/` eşleşmesi yok.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula. **Step 4:** `npx vitest run --project engine` → PASS.
- [ ] **Step 5:** Commit: `test(engine): determinizm ve özellik testleri, migrateState`.

### Task 16: validator — statik kontroller

**Files:**
- Create: `packages/validator/{package.json,tsconfig.json}`, `packages/validator/src/{issues,index}.ts`, `packages/validator/src/static/{index,node-rules,texts,consistency,outcomes,scoring}.ts`
- Test: `packages/validator/test/static.test.ts` (mini-case'in yamalı kopyalarıyla; yardımcı: `withPatch(mini, mutate)`)

**Interfaces:**
- Consumes: engine `compile`, `collectRefs`, `typeOf`.
- Produces: `staticChecks(pkg: CasePackage, c: CompiledCase): Issue[]`.
- **Kodlar** (aksi belirtilmedikçe ERROR):

  | Kod | Ne zaman |
  |---|---|
  | `MISSING_FALLBACK` | SCENE'de TAP fallback'i yok; DOCUMENT'ta EXAMINE fallback'i yok; DEDUCTION'da COMBINE fallback'i yok; TESTIMONY'de PRESENT fallback'i yok; `objectionGrounds` olup OBJECT fallback'i yok |
  | `DECISION_NO_DEFAULT` | DECISION'ın koşulsuz rotası yok |
  | `RESULT_HAS_CHOICES` | RESULT node'unda seçenek var |
  | `NO_EXIT` | RESULT olmayan node'da seçenek/rota/goto yolu yok |
  | `MISSING_TEXT` | boş etiket, ifade segmenti, sonuç metni ya da MARK geri bildirimi |
  | `DISCOVERY_MISMATCH` | DISCOVER etkisi ile bulunma yolu 1:1 eşleşmiyor |
  | `UNDISCOVERABLE_EVIDENCE` | delilin ne başlangıç durumu ne bulunma yolu var |
  | `NOT_COMBINABLE` | COMBINE kuralı combinable olmayan delil kullanıyor |
  | `HUD_HIDDEN_VAR` | HUD gizli değişken gösteriyor |
  | `SCORE_LINE_UNMAPPED` | SCORE etkisinin satırı yok ve kategorisi hiçbir satırda değil |
  | `OUTCOME_PRIORITY_DUP` | iki sonuç aynı öncelikte |
  | `OUTCOME_DEFAULT_MISSING` | son sonucun `when`'i `{all:[]}` değil |
  | `TYPE_MISMATCH` | `cmp` işlenen tipleri uyumsuz |
  | `UNUSED_PRESENTABLE` | WARNING |
  | `INDISTINGUISHABLE_CHOICES` | WARNING: aynı node'da etkisi ve `next`'i aynı iki seçenek |
  | `THRESHOLD_MISMATCH` | WARNING |
  | `LEGAL_REVIEW_PENDING` | INFO; `strict` modda ERROR |

- [ ] **Step 1: Failing tests:** `mini-case has no static errors` + her kod için yamalı fikstürle `expect(issues.map(i=>i.code)).toContain('<KOD>')`.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula. **Step 4:** PASS.
- [ ] **Step 5:** Commit: `feat(validator): statik içerik kontrolleri`.

### Task 17: validator — simülasyon, golden path, rapor ve CLI

**Files:**
- Create: `packages/validator/src/simulate/{explore,reduce}.ts`, `packages/validator/src/{golden,report,load,cli}.ts`; `package.json`'a `"bin": {"mudafaa-validate": "dist/cli.js"}`
- Test: `packages/validator/test/{simulate,cli}.test.ts`

**Interfaces:**
- Produces:
```ts
explore(c: CompiledCase, opts?: { maxStates?: number /*250_000*/; maxMs?: number /*60_000*/ }): ExploreResult
interface ExploreResult { complete:boolean; states:number; edges:number;
  coverage: Record<'nodes'|'choices'|'variants'|'rules'|'fallbacks'|'objects'|'evidence'|'statements'|'outcomes', {total:number; reached:number; missing:string[]}>;
  deadEnds:{key:string; witness:Action[]}[]; softlocks:{key:string; witness:Action[]}[];
  outcomes: Record<string,{reached:boolean; witness?:Action[]; finalMin?:number; finalMax?:number}>;
  categoryMax: Record<Category,number>; finalMin:number; finalMax:number; scoreLoops:string[]; leaks:{key:string; token:string}[] }
runGoldenPaths(c: CompiledCase): { name:string; passed:boolean; outcome?:string; final?:number; error?:string }[]
validatePackage(input: unknown, opts?: { strict?: boolean; maxStates?: number; maxMs?: number }): ValidationReport   // docs/plan.md §9 şekli
loadCase(path: string): Promise<unknown>   // dosya → JSON.parse; dizin → ada göre sıralı *.json parçaları → mergeCaseParts
main(argv: string[]): Promise<number>      // 0 PASSED, 1 FAILED, 2 kullanım/IO hatası; --json, --strict, --max-states N
```
- **İndirgeme anahtarı:** `canonicalJson({nodeId, stack, vars (analysis 'counter' olanlar hariç), sıralı delil anahtarları, karakter anahtarları, found anahtarları, latches, 2 ile sınırlanmış uses ve visits})`.
- Skor bir anahtar başına `[min,max]` aralığı olarak tutulur. Aralık genişlerse durum yeniden genişletilir. Bir döngüde |V|'den fazla genişleme `scoreLoops` sayılır.
- BFS + ebeveyn işaretçileriyle tanık dizisi çıkarılır.
- **Softlock:** COMPLETED duruma ters erişilebilirliği olmayan durum.
- **Leak:** her durumda view JSON'u şu token'ları içeremez: bulunmamış delil kimlikleri ve başlıkları, görünmez seçenek kimlikleri, bulunmamış nesne kimlikleri, HIDDEN değişken kimlikleri.
- **Hata kodları** (rapor issues'una eklenir): `OUTCOME_UNREACHABLE`, `SOFTLOCK`, `DEAD_END`, `SCORE_LOOP`, `LEAK`, `GOLDEN_PATH_FAILED`, `SIMULATION_INCOMPLETE` (WARNING).

- [ ] **Step 1: Failing tests**
  - `mini-case explores completely`: `complete === true`, `coverage.nodes.missing` boş, o_win/o_mid/o_lose erişilmiş ve tanık dizileri var, `softlocks []`, `deadEnds []`.
  - `detects softlock`: cl_b → yalnızca `$stay` seçenekli bir node → `softlocks.length > 0`, rapor `SOFTLOCK` içerir.
  - `detects unreachable outcome`: o_win `when: {flag:'never_var'}` → `OUTCOME_UNREACHABLE`.
  - `detects leak`: her zaman görünen bir seçenek etiketine i_ab başlığı eklenir → `LEAK`.
  - `golden paths pass`: 3/3.
  - `cli exit codes`: `main([miniPath])` → 0; bozuk fikstür yolu → 1; olmayan yol → 2.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula. **Step 4:** PASS; `npm run build && node packages/validator/dist/cli.js packages/case-schema/fixtures/mini-case.json` → `PASSED` yazar, çıkış 0.
- [ ] **Step 5:** Commit: `feat(validator): durum uzayı simülasyonu, golden path ve CLI`.

### Task 18: İçerik araçları — sprite çıkarımı ve sahne PNG'leri

**Files:**
- Create: `tools/content/{package.json,tsconfig.json}`, `tools/content/src/{extract-sprites,render-scenes}.ts`
- Create: `tools/content/scenes/{olay-yeri-depo,depo-sokagi}.html`. Bunlar `design/reference/project/Sorusturma.dc.html` ve `Arama.dc.html` içindeki sahne `<section>`'larının **yalnızca dekoratif div'leridir**, birebir kopyalanır. Butonlar, durum katmanları, "42" büyüteç rozeti ve "2 nokta incelenmedi" etiketi alınmaz. Kök `#scene`, sırasıyla 344×214 ve 344×380.
- Create (üretilen): `content/shared/sprites/<who>.json` ×21, `content/cases/gece-bekcisinin-sirri/assets/scenes/{olay-yeri-depo,depo-sokagi}@4x.png`
- Test: `tools/content/test/{extract-sprites,scenes}.test.ts`

**Interfaces:**
- Produces:
```ts
extractSprites(dcHtml: string): Record<string, { id:string; rows:string[]; skin?:string; noEyes?:boolean; noMouth?:boolean }>
// <script type="text/x-dc"> metnini acorn ile parse eder; yalnızca ArrayExpression / Literal / const Identifier / `.concat(...)` değerlendirilir (KOD ÇALIŞTIRILMAZ); noEyes/noMouth/skin META nesne literalinden; satırlar 16 karaktere '.' ile doldurulur
renderScenes(outDir: string): Promise<void>   // Playwright chromium, deviceScaleFactor 4, ağ erişimi kapalı, '#scene' elementinin ekran görüntüsü
```

- [ ] **Step 1: Failing tests**
  - `extracts 21 sprites with 20 rows`.
  - `muvekkil row 10 is '...kkoowwookk...'`.
  - `polis skin 'Q'`, `huseyin noMouth true`, `hakim noEyes true`.
  - `every sprite parses as SpriteDef`.
  - `scene PNGs have expected sizes`: pngjs ile okunur → `olay-yeri-depo@4x.png` 1376×856, `depo-sokagi@4x.png` 1376×1520.
- [ ] **Step 2:** FAIL. **Step 3:** Uygula; `npx playwright install chromium`; `npx tsx tools/content/src/extract-sprites.ts && npx tsx tools/content/src/render-scenes.ts`. **Step 4:** PASS. Üretilen PNG'yi aç ve tasarımdaki sahneyle göz kontrolü yap (buton ve rozet olmamalı).
- [ ] **Step 5:** Commit: `feat(content-tools): sprite çıkarımı ve sahne render'ı`.

### Task 19: Dava #07 içeriği — kadro, deliller, sahneler, brifing ve soruşturma

**Files:**
- Create: `content/cases/gece-bekcisinin-sirri/{00-meta.json,10-cast.json,20-evidence.json,30-scenes.json,40-briefing.json,50-investigation.json}`
- Create (geçici, Task 20 değiştirecek): `60-trial.json` (`C_00` STAGE → `RESULT_STUB`), `70-outcomes.json` (tek varsayılan sonuç)
- Test: `tools/content/test/dava07-investigation.test.ts`

**Interfaces:**
- Consumes: `docs/content/dava-07.md` (A.1–A.5 ve A.3 değişkenleri; tasarımın verdiği metinler aynen: Gorusme yanıtları, Arama ipucu metinleri, Inceleme bulgu metinleri, Cikarim tarifleri), `content/shared/sprites/*.json` (dava kadrosunun sprite'ları `sprites` dizisine kopyalanır), Task 18 PNG'leri (`assets`).
- Produces (kimlikler A.2–A.4 ile birebir):
  - **Node'lar:** `BR_01, BR_02, INV_HUB, INV_DAY_END, INV_GORUSME, INV_ARAMA, INV_INCELEME, INV_CIKARIM, INV_BEL, INV_HTS, INV_HTS_SELIN, INV_DIL, INV_T_HUS, INV_T_SEL, INV_T_MUR`.
  - **Değişkenler:** A.3 tablosu + `strategy_pct` + `in_court` (bool) + A.3 bayrakları. `legal_hits`, `wrong`, `ethics` HIDDEN counter.
  - **Sahne `sc_depo_sokagi`** (344×380, görsel `depo-sokagi@4x.png`), nesneler HIDDEN:

    | Nesne | rect |
    |---|---|
    | lamba | (244,44,64,52) |
    | kamera | (144,76,56,90) |
    | iz | (180,302,60,66), badge "42" |
    | cop | (292,236,52,62) |
  - **Sahne `sc_olay_yeri_depo`** (344×214, yalnızca önizleme), işaretler VISIBLE: lamba (270,46,44,44), kamera (300,160,44,44), kapi (78,100,44,44).
  - **Evidence tag'leri:** `key` etiketi, oyuncunun toplayabildiği şu 6 delilde (hiçbiri başlangıçta bilinmez): ev_fis, ev_ariza_kaydi, ev_isg_zimmet, ev_kamera, ev_dna, ev_hts. ("Delil toplama x/6" satırı için; G1 6/6 toplar.)

- [ ] **Step 1: Failing tests** (parçalar birleştirilip compile edilir; aksiyonlar motorla oynatılır)
  - `case compiles without errors`.
  - `briefing quiz and strategy`: BR_01 doğru cevap → HUKUKI_BILGI +50; BR_02 Masumiyet → strategy 'MASUMIYET', strategy_pct 150, day 1, ap 3, node INV_HUB.
  - `interview soft topics`:
    - Anahtar(soft) + Hüseyin(soft) → fact_anahtar_ortak, fact_rizasiz_arama, fact_mazeret true; ev_fis bulunur; trust 70; min 8.
    - Yeni görüşme ziyaretinde min = 8.
  - `boot print present gated`: clue_iz42 yokken seçenek görünmez; arama sonrası görünür; trust 62 → ARASTIRMA +200, suspect_murat true.
  - `scene taps follow design rects`: her nesne rect'inin merkezine TAP → clue_ampul, clue_kablo, clue_iz42, clue_izmarit; (5,370) ıska → taps −1, ARASTIRMA −10.
  - `document UV and dust`: EXAMINE(uv, selin) → clue_uv_silinti; (dust, kerem) → DELIL_ANALIZI −20 + BAD işareti.
  - `day end delivers municipal record`: gün 1'de INV_BEL A + kalan EP harcanır → INV_DAY_END'den sonra ev_ariza_kaydi bulunmuş, day 2.
  - `deduction lamba`: COMBINE(clue_ampul, ev_ariza_kaydi) → ded_lamba (+300).
  - `illegal HTS`: operatör seçeneği → ethics 1, BAD işareti, ev_hts_illegal bulunur.
  - `petition slots`: 3 seçimden sonra dördüncü seçim görünmez veya `CHOICE_UNAVAILABLE`; "Dilekçeyi ver" en az 1 seçim olmadan görünmez.
- [ ] **Step 2:** FAIL. **Step 3:** İçerik parçalarını yaz. **Step 4:** `npx vitest run --project content-tools` → PASS.
- [ ] **Step 5:** Commit: `feat(content): Dava #07 kadro, deliller, sahneler, brifing ve soruşturma`.

### Task 20: Dava #07 içeriği — 2. celse, sonuçlar, rapor, golden path'ler; doğrulayıcı PASSED

**Files:**
- Modify (stub'ları değiştir): `content/cases/gece-bekcisinin-sirri/{60-trial.json,70-outcomes.json}`
- Create: `content/cases/gece-bekcisinin-sirri/{80-report.json,90-tests.json}`
- Modify: `docs/legal/dava-07.md` (metin değiştiyse ve yeni itiraz gerekçeleri için inceleme maddesi ekle)
- Test: `tools/content/test/dava07-golden.test.ts`

**Interfaces:**
- Consumes: `docs/content/dava-07.md` A.2 (2. Celse: `C_00…C_14, C_02D, C_06H, C_INT_COKUS`), A.5 (S1–S4), A.6 (sonuçlar ve metinler), A.7 (golden path'ler), A.8 (rapor metinleri).
- Produces:
  - **Skor yapılandırması:**
    - Satırlar ve etiketleri:
      - `delil` [ARASTIRMA, DELIL_ANALIZI] → "Delil toplama ({{count.evidence:key}}/6)"
      - `capraz` [SORGULAMA] → "Çapraz sorgu"
      - `itiraz` [USUL_BILGISI, HUKUKI_BILGI] → "İtiraz isabeti ({{var.legal_hits}}/7)"
      - `savunma` [SAVUNMA_STRATEJISI] → "Savunma"
      - `hatali` → "Hatalı delil ({{var.wrong}})"
    - Bonus `guven` = cred × 100, etiket "Güvenilirlik bonusu ({{var.cred}}♥)".
    - scaleMax 5000; thresholdBar Mahkûmiyet 0 (red) / İndirim 2000 (amber) / Beraat 3200 (green); displayClampMin 0.
  - **Sonuçlar** (priority sırası): `IKRAR` 1, `BERAAT_B` 2, `BERAAT_E` 3, `INDIRIM` 4, `MAHKUMIYET` 5 (varsayılan). Varyant metinleri `reasoning` parçalarıyla (`when`'li) yazılır; XP ifadeleri A.6'daki gibi (etik > 0 ise yarıya iner).
  - **Global tetikleyici:** `tg_cokus` = `{all:[{flag:'in_court'}, {cmp:[{var:'cred'},'<=',0]}]}` → `C_INT_COKUS` (once). `in_court`, C_00'ın onFirstEnter'ında true yapılır.
  - **TESTIMONY itiraz gerekçeleri** (yeni; hukuki incelemeye eklenir):
    - Gerekçeler: `g_duyum` "Tanık kendi gözlemini değil başkasının söylediğini aktarıyor", `g_kanaat` "Tanığın kişisel kanaati", `g_telkin` "Telkin edici soru (CMK 201/1)".
    - Kural: S4 × g_duyum → SORGULAMA +50, pers +1, GOOD (legal_hits'e sayılmaz).
    - FALLBACK(OBJECT): cred −1, SORGULAMA −50 line hatali, BAD "Dayanaksız itiraz."
  - **Golden path pencereleri** (`tests.goldenPaths`):

    | Yol | Beklenen sonuç | final penceresi |
    |---|---|---|
    | G1 | BERAAT_B | 4800–5400 |
    | G2 | BERAAT_E | 3300–3900 |
    | G3 | INDIRIM | 2000–2400 |
    | G4 | MAHKUMIYET | ≤ 800 |
    | G5 | IKRAR | – |
    | W | MAHKUMIYET | – (çöküş varyantı; `cokus` true) |

- [ ] **Step 1: Failing tests**
  - `all golden paths reach expected outcomes within windows` → `runGoldenPaths(c)` hepsi `passed`.
  - `validator passes Dava #07`: `validatePackage(merged)` → status `PASSED`, `coverage.nodes.missing`, `coverage.choices.missing` ve `coverage.outcomes.missing` boş; `softlocks`, `deadEnds`, `leaks` boş. `LEGAL_REVIEW_PENDING` yalnızca INFO.
  - `report for G2`: missed, suspect_murat ipucunu ("Bot izini Kerem'e göstermedin…") içerir; alternatives BERAAT_B'nin howToReach'ini içerir.
  - `collapse path`: W sonunda `vars.cokus === true` ve sonuç MAHKUMIYET.
- [ ] **Step 2:** FAIL. **Step 3:** İçeriği yaz; sayıları golden path pencerelerine oturtmak için yalnızca içerik tutarlarını (A.2'deki değerler) ince ayarla. **Step 4:** PASS; `npm run build && npm run validate:cases` → `PASSED`, çıkış 0.
- [ ] **Step 5:** Commit: `feat(content): Dava #07 2. celse, sonuçlar, rapor ve golden path'ler`.
- [ ] **Step 6 (controller):** Kullanıcıya hukuki inceleme bildirimi: `docs/legal/dava-07.md` + `content/cases/gece-bekcisinin-sirri/`. İnceleme Plan B/C ile paralel yürür.
