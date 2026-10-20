# Müdafaa — Avukatlık Oyunu

Avukatlar ve hukuk öğrencileri için seçim tabanlı, deterministik ve backend-otoriter hukuk simülasyonu. Oyun sırasında hiçbir LLM çağrısı yapılmaz; AI yalnızca yönetim tarafında yeni dava taslağı üretir.

- Onaylı plan: [docs/plan.md](docs/plan.md) · Orijinal spesifikasyon: [docs/spec/legal-case-simulator.md](docs/spec/legal-case-simulator.md)
- Tasarım referansı: [design/reference/](design/reference/README.md)
- İlk dava: Dava #07 "Gece Bekçisinin Sırrı" — [içerik taslağı](docs/content/dava-07.md), [hukuki notlar](docs/legal/dava-07.md)

## Yapı

| Yol                    | İçerik                                                 |
| ---------------------- | ------------------------------------------------------ |
| `packages/case-schema` | İçerik formatı ve API↔istemci sözleşmesi (Zod)         |
| `packages/engine`      | Saf, deterministik oyun motoru                         |
| `packages/validator`   | Hikâye doğrulayıcı (statik + simülasyon + golden path) |
| `apps/api`             | NestJS API                                             |
| `apps/mobile`          | Flutter uygulaması (Android, iOS, Web)                 |
| `content/`             | Dava içerikleri (CasePackage JSON parçaları)           |
| `tools/`               | İçerik ve tasarım araçları                             |

## Komutlar

```bash
npm install
npm run build          # TypeScript paketleri
npm test               # birim testleri
npm run db:up          # PostgreSQL + Redis (docker)
npm run validate:cases # Dava #07 doğrulaması
npm run mobile:test    # Flutter testleri (FVM)
```
