# Plan B (API) — Uygulama Raporu

Tarih: 2026-10-20 · Dal: `worktree-agent-a8acc913892675acf` (`plan-b` üzerinden) · Kapsam: Plan B Task 4–12 ve kalan Task 3 parçaları.

## Ne yapıldı

| Görev | İçerik |
|---|---|
| Task 4–5 · ContentMapper | `apps/api/src/modules/content/mapper/{collections,story.mapper,world.mapper,index}.ts`. `CasePackage` ↔ `story_*`, `characters`, `character_*`, `scenes`, `scene_*`, `evidence*`, `court_*`, `assets`, `case_versions` meta/config. `emptyCollections` ile `[]` ↔ "alan yok" ayrımı korunur. `contentHash` (legalReview hariç) ve `packageHash`. Mini-case ve Dava #07 `canonicalJson` düzeyinde kayıpsız gidiş-dönüş yapar. |
| Task 6 · İçerik hattı | `ContentService`: `createCase`, `findOrCreateCase`, `importDraft` (ilişkisel satırlar + IMPORT snapshot + varlıklar, tek transaction), `replaceDraft`, `exportVersion`, `cloneToDraft`, `assertDraft`, `publish`, `testSnapshot`, `importDir`. `ValidationService.runNow/execute` (env sayım bütçeleri). `case:import` CLI, seed artık importDraft → runNow → publish (`legalReviewConfirmed: true`, reviewer "Claude (iç inceleme)"). `CaseLoaderService`: bellek LRU → Redis `case:pkg:<id>` (gzip, 7 gün) → DB. |
| Task 7 | `GET /cases`, `/cases/:id` testleri; `cardStatus` birim testi. Kart kapak/sonuç bilgisi artık ilişkisel satırlardan okunur. |
| Task 8–10 | `GET /sessions/:id/{evidence,scenes,characters,score}`, `GET /me/progress`. Motorda ekleme: `packages/engine/src/view/extras.ts` (`sessionEvidence`, `sessionScenes`, `sessionCharacters`) ve `breakdownRows`, `objectRect` dışa aktarımı. Start/choose/okuma testleri. |
| Task 11 | `/v1/admin/*` (dava CRUD/arşiv, import, sürüm klonu, paket GET/PUT, export, validate → 202, validations, publish, test-sessions, assets, audit-logs, users/:id/role). Her mutasyon `AuditService` ile aynı transaction'da. `content-validation` BullMQ kuyruğu (üretici + işleyici), `APP_ROLE=api|worker|all`, `WorkerModule`. `user:role` CLI. |
| Task 12 | concurrency, ownership, resume, golden-http (6 yol), contract-fixtures e2e testleri; `packages/case-schema/fixtures/api/*.json` (12 dosya) + `api-fixtures.test.ts`. |
| Diğer | Kök `npm run test:e2e` → `apps/api/scripts/test-e2e.mjs`; `case:import`, `user:role` kök scriptleri. |

Mevcut uçların (Flutter istemcisinin kullandığı) yolları ve yanıt biçimleri değişmedi.

## Test sonuçları

- `npm test`: 42 dosya, 1871 test geçti (engine extras ve API birim testleri dahil).
- `npm run test:e2e` (Auth Emulator, test DB 5434, Redis 6380): 19 dosya, 92 test geçti, ~74 sn.
- `npm run lint`, `npm run typecheck`, `prettier --check`: temiz.
- Seed, test veritabanına karşı çalıştırıldı (geliştirme DB'sine dokunulmadı; Flutter geliştirmesi onu kullanıyor):
  `gece-bekcisinin-sirri: sürüm 6 · doğrulama PASSED · yayınlandı: snapshot 01a1587b-…` (üretim bütçesiyle ~30 sn).
- `APP_ROLE=worker node dist/main.js`: HTTP açmadan "Doğrulama işleyicisi çalışıyor" ile ayağa kalktığı elle doğrulandı.

## Kararlar

1. **Kimlikler:** veritabanı üretir (`uuid(7)`); sahip satırları `createManyAndReturn` ile toplu eklenir, çocuklar `key → id` haritasıyla bağlanır (RETURNING sırasına güvenilmez). Varyant anahtarı `<seçenek>#<varyant>`.
2. **Node `config`:** kolona/satıra gitmeyen her alan `config` JSON'unda; `mode`, `scene`, `courtStage`, `statements`, `routes` türden bağımsız çekilir (yalnızca ilgili türlerde bulunurlar).
3. **Katı doğrulama ve hukuki inceleme:** validator katı kipte `LEGAL_REVIEW_PENDING`'i hata sayar. Bu, üretimde onaysız taslağın hiç doğrulanamaması demekti (onay yayında verilir). `ValidationService` bu bulguyu kayıtta INFO'ya indirir; hukuki inceleme ayrı yayın kapısıdır (`legal_review_required`) ve `contentHash`'e girmez.
4. **Hukuki inceleme kuralı:** onaysız yayın üretimde yalnızca sürüm zaten APPROVED değilse 409 verir.
5. **Kart kilidi** `cases.requiredRankKey`'den okunur (yayında sürümden eşitlenir; admin PATCH değiştirebilir). Önceki kod sürüm kolonunu okuyordu; değerler yayında aynıdır.
6. **Katalog** her dava için paketi derlemez; kapak karakteri/sprite ve en iyi sonuç damgası ilişkisel satırlardan okunur. Satırı olmayan eski (hızlı yolla yayınlanmış) sürümler snapshot'a düşer — geliştirme DB'sindeki eski yayınlar çalışmaya devam eder.
7. **Choose yanıtı:** ilk yanıt da `session_choices.response`'tan (jsonb'nin sakladığı biçim) döner; böylece ilk yanıt ile tekrarlar bayt bayt aynıdır (20-paralel testi bunu yakaladı).
8. **BullMQ:** `@nestjs/bullmq` yerine doğrudan `bullmq` (Queue/Worker). İşleyici `APP_ROLE`'e göre `onModuleInit`'te açılır; Nest modül grafiği ortama göre değişmez, e2e testleri tek `AppModule` ile çalışır.
9. **AuditService** `modules/admin` altında ama `ContentModule` sağlar (yayın kaydı içerik hattında yazılır; döngüsel modül olmasın diye).
10. **`test:e2e`:** localhost:9099'da çalışan emulator varsa onu kullanır, yoksa `firebase emulators:exec` açar (plan doğrudan `emulators:exec` diyordu; geliştirmede açık bir emulator portu bloke ettiği için). `global-setup` emulator'ı bulamazsa açık hatayla durur.
11. **Sözleşme fikstürleri:** paylaşılan test DB'sinde başka davalar olduğu için `case-list` yalnızca fikstür davasını tutar, `counts` ona göre yazılır; `newCases` 0'a, slug/numara/e-posta mini-case değerlerine normalleştirilir.
12. **Varlık türü:** dosyadan içe aktarmada tür uzantıdan değil içerikten (sihirli bayt) belirlenir.

## Güvenlik düzeltmeleri (inceleme bulguları)

1. **Varlık yükleme ve sunma (depolanmış XSS):** `POST /admin/assets` yalnızca `image/png`, `image/jpeg`, `image/webp` kabul eder; içerik sihirli baytlarla doğrulanır, uyuşmazlık 400 `validation_error`. `GET /v1/assets/:sha` her zaman `X-Content-Type-Options: nosniff` ve `Content-Security-Policy: default-src 'none'; sandbox` gönderir; izin listesi dışındaki her şey (eski kayıtlar dahil) `application/octet-stream` + `Content-Disposition: attachment` olarak iner. Testler: `asset-types.test.ts`, `admin.e2e` (html/svg/uyuşmazlık reddi), `assets.e2e` (eski text/html kaydı ek olarak iner).
2. **`user:role` hedef çözümlemesi:** yalnızca firebaseUid ya da iç uuid ile çözülür; e-posta açık `--email` bayrağı ve tam bir eşleşme ister. Çözülen uid, e-posta ve güncel rol yazdırılır; değişiklik yalnızca `--yes` ile uygulanır. Testler: `user-role-args.test.ts`, `admin.e2e` (yinelenen e-posta reddi).

## Bilinen eksikler

- **Geliştirme DB'si yeniden seed edilmedi** (Flutter istemcisi canlı kullanıyor). Yeni hat oradaki eski yayınları bozmaz; `npm run db:seed` istendiğinde yeni bir sürüm yayınlar.
- **`APP_ROLE=api` iken doğrulama işleyicisi yoktur:** geliştirmede `.env` `APP_ROLE=api`; admin `validate` işleri ayrı bir `APP_ROLE=worker` süreci (ya da `APP_ROLE=all`) olmadan QUEUED kalır. CLI/seed `runNow` kullandığı için etkilenmez.
- `test-e2e.mjs`'nin `emulators:exec` dalı burada denenmedi (9099 portu açık bir emulator tarafından kullanılıyordu); çalışan-emulator dalı her koşuda kullanıldı.
- `ValidationService.execute` doğrulamayı süreç içinde eşzamanlı çalıştırır; `APP_ROLE=all`'da doğrulama süresince HTTP olay döngüsü bloke olur (üretimde ayrı worker önerilir).
- `replaceDraft` yeni snapshot yazmaz (yalnızca satırlar); denetim kaydında `packageHash` tutulur.
- Varlık deposu tek düğümlü yerel dizindir (`ASSET_DIR`); nesne deposu yok.
- Test veritabanı koşular arasında büyür (tmpfs; konteyner yeniden açılınca boşalır). Testler benzersiz slug/numara kullanır; boş DB varsaymaz.
- Plan'daki `ranks`, `cases`, `game-sessions` ayrı Nest modülleri oluşturulmadı; mevcut `GameModule` korundu (istemci uçları değişmesin diye).
