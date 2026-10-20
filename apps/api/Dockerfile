# Müdafaa API imajı. Bağlam repo köküdür (workspace paketleri: case-schema, engine, validator; dava içerikleri):
#   docker compose --profile prod build api
FROM node:24-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY . .
# Betikler atlanır (playwright vb. indirmeleri olmasın); Prisma istemcisi ayrıca üretilir.
RUN npm ci --ignore-scripts && (cd apps/api && npx prisma generate) && npm run build
ENV NODE_ENV=production
WORKDIR /app/apps/api
EXPOSE 3000
# Açılışta bekleyen migration'lar uygulanır, ardından API (APP_ROLE'e göre API ve/veya doğrulama işçisi) başlar.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
