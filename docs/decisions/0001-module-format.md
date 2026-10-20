# 0001 — Modül formatı: her yerde ESM (API dahil)

- **Durum:** Kabul edildi (Plan A, Task 3 — gün-1 araç zinciri denemesi)
- **Tarih:** 2026-10-20
- **Kapsam:** `packages/*` (case-schema, engine, validator), `tools/*`, `apps/api`

## Bağlam

Plan, API'nin modül formatını (ESM mi CJS mi) ve workspace paketlerinin API'den nasıl tüketileceğini gün-1 denemesine bırakmıştı. Sırayla denenecek seçenekler:

1. API'yi ESM yapmak (`"type": "module"`).
2. Olmazsa CJS API + paketleri Node 24 `require(esm)` ile tüketmek.
3. O da olmazsa paketleri `tsdown` ile çift (CJS/ESM) derlemek.

Kural: **ilk çalışan kalır.**

Denemeden önce kayıt defterinde (npm registry) görülen durum:

- NestJS 12.2.0 paketlerinin hepsi kendisi ESM'dir: `@nestjs/common`, `core`, `platform-express`, `testing` ve `@nestjs/cli` 12.0.9 `package.json`'larında `"type": "module"` var.
- Prisma 7.10.1'in `prisma-client` üreteci ESM TypeScript üretir: `.js` uzantılı göreli import'lar, `import.meta.url`.
- Paketler zaten ESM'dir (Global Constraints: `"type": "module"`, NodeNext).

Bu yüzden CJS bir API, NestJS'in kendisini bile `require(esm)` ile yüklemek zorunda kalacaktı.

## Karar

**Deneme 1 çalıştı: API ESM'dir.** Deneme 2 ve 3 denenmedi; gerek kalmadı. Depoda CJS çıktı ve çift derleme yoktur.

Doğrulanan zincir (Node 24.1.0, npm 11.3.0, TypeScript 6.0.3):

| Adım | Sonuç |
| --- | --- |
| `npm run build` (`tsc -b tsconfig.build.json`: case-schema → api) | çıkış 0 |
| `npm run build -w @mudafaa/api` (`nest build`) | çıkış 0 |
| `npm run start:dev -w apps/api` (`nest start --watch` → `node --enable-source-maps dist/main`) + `curl localhost:3000/v1/health` | `{"status":"ok","db":"up","redis":"up","format":"mudafaa.case/v1"}` |
| `node dist/main.js` (`start:prod`) | çalışıyor; SIGTERM ile temiz kapanıyor |
| Vitest: `case-schema`, `api-unit`, `api-e2e` (SWC ile) | geçiyor |
| `npx -w apps/api prisma generate` / `prisma migrate dev --name init_users` | çalışıyor; migration `init_users` oluştu |

- API, `@mudafaa/case-schema`'yı çalışma zamanında doğrudan ESM olarak tüketir: workspace bağı → paketin `exports`'u → `dist/index.js`.
- Testler aynı paketi kaynaktan kullanır: `vitest.config.ts` alias'ı → `src/index.ts`.

## Sonraki paketleri bağlayan kurallar

1. **Paket `package.json`:**
   - `"type": "module"`.
   - Yalnızca `exports` ile dışa açılır: `{ ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } }`.
   - `main`/`require` koşulu ve CJS çıktı yoktur.
   - Ek alt yollar `exports`'a eklenir (ör. Task 7: `"./fixtures/*"`).
2. **`tsconfig.json`:**
   - `../../tsconfig.base.json`'u genişletir (NodeNext, `verbatimModuleSyntax`, `composite`).
   - Ayarlar: `rootDir: "src"`, `outDir: "dist"`, `tsBuildInfoFile: "dist/tsconfig.tsbuildinfo"`.
   - Build bilgisi `dist` içinde durur. `rootDir` ile varsayılan konum paket köküne düşerdi; o durumda `dist` silindiğinde `tsc -b` paketi güncel sanıp yeniden üretmezdi.
3. **Kök build'e ekleme:**
   - Her yeni paket kökteki `tsconfig.build.json` `references` listesine eklenir.
   - Başka bir pakete bağımlı paket, o paketi kendi `tsconfig`'inde `references` olarak verir. API için bu `apps/api/tsconfig.build.json`'dır; `references` `extends` ile miras alınmaz.
4. **Bağımlılık bildirimi:** Bir workspace paketini kullanan paket onu `dependencies`'e yazar (ör. `"@mudafaa/case-schema": "^0.0.0"`). npm bunu workspace bağı olarak kurar.
5. **Kod yazımı:**
   - Göreli import'lar `.js` uzantısıyla yazılır (NodeNext bunu ister).
   - Yalnızca tip olan import'lar `import type` ile yazılır (`verbatimModuleSyntax`).
   - `__dirname` yerine `import.meta.dirname` kullanılır.
6. **Testler:**
   - Paketler testlerde kaynaktan kullanılır; kök giriş noktası alias'ı `vitest.config.ts`'te tanımlıdır.
   - Derlenmiş `dist`'e gerek yoktur; çalışma zamanı (API, CLI) `dist`'i kullanır. Bu yüzden önce `npm run build` çalışır.
7. **CLI'lar** (ör. validator `bin` → `dist/cli.js`) ESM olarak `#!/usr/bin/env node` ile çalışır. `tsdown`/çift derleme kullanılmaz.

## API'ye özgü notlar

### TypeScript ayarları

- `apps/api/tsconfig.json`: editör ve tip denetimi. `src`, `test` ve `prisma.config.ts`'i kapsar; `noEmit` açıktır.
- Aynı dosyada NestJS DI için `experimentalDecorators` ve `emitDecoratorMetadata` açıktır.
- `verbatimModuleSyntax: true` korunur. Decorator metadata'sı için kapatmak gerekmedi.
- `apps/api/tsconfig.build.json`: derleme ayarları (`composite`, `rootDir: src`, `outDir: dist`). Hem `nest build`/`nest start` hem kök `tsc -b` bu dosyayı kullanır.

### ESM ve DI tuzakları

- **Tipiyle enjekte edilen sınıflar** (ör. `constructor(private prisma: PrismaService)`) **değer olarak import edilmelidir, asla `import type` ile değil.**
  - `import type` ile tsc hata vermez, ama `design:paramtypes` içine sınıf yerine `Function` yazar ve DI çalışma zamanında kırılır.
  - Açık token'la (`@Inject(REDIS)`) enjekte edilen parametrelerde tip-only import sorun değildir.
- **Modüller arası döngüsel import'lardan kaçınılır.**
  - ESM'de döngü "Cannot access 'X' before initialization" (TDZ) hatası verir.
  - Gerekirse `forwardRef(() => X)` kullanılır. Modüller arası barrel (`index.ts`) dosyası yazılmaz.
- `ioredis` 6 CJS'dir, ama ESM'den `import { Redis } from 'ioredis'` adlandırılmış import'u çalışır.

### Vitest

- API projeleri (`api-unit`, `api-e2e`) `unplugin-swc` (`swc.vite()`) ile dönüştürülür. Bu, NestJS'in Vitest tarifidir; ayarlar `apps/api/tsconfig.json`'dan okunur.
- Gözlem: Vitest 5'in kullandığı Vite 8'in oxc dönüştürücüsü de tsconfig'teki `experimentalDecorators` + `emitDecoratorMetadata`'yı uygular.
  - e2e testi SWC olmadan da geçti; oxc çıktısında `design:paramtypes` üretildiği görüldü.
  - SWC plandaki gibi tutuldu. İleride sorun çıkarırsa (ya da bağımlılık azaltmak istenirse) kaldırılabilir.

### Prisma 7.10

- Üreteç `prisma-client`; `moduleFormat = "esm"` ve `importFileExtension = "js"` açıkça sabitlendi (normalde tsconfig'ten çıkarılır).
- Çıktı `src/generated/prisma`'dır ve git dışıdır (`**/generated/`). `apps/api`'deki `postinstall: prisma generate` kök `npm install` sırasında çalışır; temiz klonda `npm run build` bu sayede geçer.
- `prisma.config.ts`:
  - Prisma 7 `.env`'i kendisi yüklemez. Yerel `.env` Node'un yerleşik `process.loadEnvFile`'ı ile okunur; `dotenv` bağımlılığı yoktur, ortamda tanımlı değişkenler ezilmez.
  - `datasource.url: process.env.DATABASE_URL`. `generate` adres istemez, `migrate` ister.
- `PrismaService extends PrismaClient`, `PrismaPg({ connectionString })` adaptörüyle çalışır.
  - `$connect()` WASM sorgu derleyicisini yükler; veritabanı bağlantısını ise ilk sorgu açar.
  - API veritabanı kapalıyken de açılır; health `db: "down"` raporlar.
- `@default(uuid(7))` Prisma 7.10'da desteklenir. Kimlik istemci tarafında üretilir ve kolon `@db.Uuid`'dir; oluşturulan kimliklerin sürüm hanesi `7` olarak doğrulandı.

### `main.ts`

- ESM top-level `await` kullanır.
- Yerel `.env`, `process.loadEnvFile(join(import.meta.dirname, '..', '.env'))` ile yüklenir; dosya yoksa atlanır (üretimde değişkenler ortamdan gelir).
- Ortam modül yüklenirken değil, `NestFactory.create` sırasında (`EnvModule`) okunur.

## Sonuçlar ve açık noktalar

- Sonraki tüm paketler ve API tek formatta (ESM) kalır. `require(esm)` ve `tsdown` yedek planlarına gerek yoktur.
- `@nestjs/cli` 12.0.9, Node `^22.22.3 || ^24.15.0 || >=26` isteyen `@angular-devkit/*` 22'yi getirir. Node 24.1.0'da `npm install` EBADENGINE uyarısı verir.
  - `nest build`/`nest start` etkilenmez. `nest generate` şemaları bu sürümde denenmedi.
  - Yerel Node'un ≥ 24.15'e yükseltilmesi önerilir (`.nvmrc` `24` buna izin verir).
- Odaklı test komutu `npx vitest run --project <ad>`'dır. `npm test -- --project <ad>` script'teki proje listesine ekleme yapar (birleşim), yalnızca o projeyi çalıştırmaz.
