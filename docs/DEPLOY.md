# Müdafaa — Sunucuda çalıştırma

Bu rehber uygulamayı bir Linux sunucuda **test ortamı** olarak ayağa kaldırır: PostgreSQL + Redis (docker), NestJS API, Firebase Auth Emulator ve Flutter web. Gerçek Firebase projesi henüz kurulmadığı için giriş emülatör üzerinden yapılır (`NODE_ENV=development`). Üretim kurulumu (gerçek Firebase, HTTPS, imzalı mobil derlemeler) M4'tedir.

## 1. Gereksinimler

| Araç | Sürüm | Not |
|---|---|---|
| Node.js | ≥ 24 | `npm` (repo npm workspaces kullanır; pnpm/yarn değil) |
| Docker + Compose | güncel | postgres:17, redis:8 |
| Java | ≥ 21 | Firebase Auth Emulator için |
| firebase-tools | güncel | `npm i -g firebase-tools` |
| FVM + Flutter | 3.47.7 | `dart pub global activate fvm && fvm install 3.47.7` (yalnızca web derlemesi için) |

## 2. Kurulum

```bash
git clone <repo-url> mudafaa && cd mudafaa
npm ci
cp .env.example apps/api/.env      # gerekirse portları/host'ları düzenle
npm run db:up                       # postgres 5432 + redis 6379 (yalnızca 127.0.0.1)
npm run build                       # TS paketleri
npm run db:migrate                  # Prisma migration'ları
```

`apps/api/.env` için sunucuda eklenmesi gerekenler:

```
CORS_ORIGINS=http://<sunucu-ip-veya-alan-adı>:8090
FIREBASE_PROJECT_ID=demo-mudafaa
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
APP_ROLE=all            # API + doğrulama kuyruğu işçisi tek süreçte
```

## 3. Davaları yükle

```bash
npm run validate:cases   # content/cases altındaki tüm davaları doğrular (uzun sürebilir)
npm run db:seed          # tüm davaları içe aktarır → doğrular → yayınlar
```

Tek bir davayı yeniden yüklemek için: `npm run db:seed -- content/cases/<slug>`.

## 4. Servisleri başlat

Her biri ayrı bir süreç olarak (tmux / systemd / pm2):

```bash
npm run emulators                         # Firebase Auth Emulator :9099 (veri .emulator-data'da kalıcı)
npm run build -w @mudafaa/api && npm run start:prod -w @mudafaa/api   # API :3000
```

Sağlık kontrolü: `curl http://localhost:3000/v1/health`.

## 5. Web istemcisi

Tarayıcının API'ye ve emülatöre ulaşabilmesi için sunucunun dış adresi derlemeye gömülür:

```bash
cd apps/mobile
fvm flutter pub get
fvm flutter build web --release \
  --dart-define=API_URL=http://<sunucu>:3000 \
  --dart-define=USE_AUTH_EMULATOR=true \
  --dart-define=AUTH_EMULATOR_HOST=<sunucu>
# çıktı: apps/mobile/build/web → herhangi bir statik sunucuyla yayınla, ör.:
npx serve -s build/web -l 8090
```

Not: release derlemede emülatör oturumu sayfa yenilenince düşebilir (firebase_auth web eklentisinin sınırı). Oynanış testi için `npm run dev:web` (debug, :8090) de kullanılabilir.

Açılması gereken portlar: 8090 (web), 3000 (API), 9099 (emülatör). Postgres/Redis dışarı açılmaz.

## 6. Kullanıcı rolü (admin API için)

```bash
npm run user:role -- <firebase-uid> ADMIN --yes      # veya: --email <e-posta> ADMIN --yes
```

## 7. Güncelleme

```bash
git pull && npm ci && npm run build && npm run db:migrate && npm run db:seed
# ardından API'yi yeniden başlat ve web'i yeniden derle
```

## 8. Dava üretimini sunucuda sürdürmek (isteğe bağlı)

Dava yazım/inceleme hattı Claude Code iş akışı olarak `tools/content/workflows/` altında durur:

- `cases-split.js` — yaz → şeytanın avukatı incelemesi → düzelt → (≥3 engel varsa) yeniden incele.
- `cases.json` — 14 davanın künyesi (suç, hukuki eksen, gerçek, rütbe, zorluk).

Sunucuda Claude Code ile repo kökünde çalıştırılır; argüman `{"items":[{...dava, "mode":"new"}]}` biçimindedir (`mode`: `new` sıfırdan yazar, `resume` + `worktreePath`/`branch` yarım kalanı sürdürür, `done` + `w` doğrudan incelemeye geçer, `review7` Dava #07'yi inceler). Her dava kendi git worktree'sinde yazılır; bittiğinde dal `plan-b`'ye birleştirilir ve `npm run db:seed` ile yüklenir.

## Sorun giderme

- **`Geçersiz ortam değişkenleri`**: `apps/api/.env` eksik/yanlış; `DATABASE_URL`, `REDIS_URL`, `FIREBASE_PROJECT_ID` zorunlu.
- **`api-key-not-valid` girişte**: web derlemesi emülatöre bağlanamıyor; `AUTH_EMULATOR_HOST` ve 9099 portunu kontrol et.
- **CORS hatası**: `CORS_ORIGINS` web adresini (şema + port dahil) içermeli.
- **Seed'de doğrulama hatası**: `npm run case:validate -- <slug>` ile ayrıntıyı gör.
