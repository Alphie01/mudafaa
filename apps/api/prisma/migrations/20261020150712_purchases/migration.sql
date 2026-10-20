-- Uygulama içi satın alma (docs/iap.md): satın almalar, dava hakları, abonelikler.

-- CreateEnum
CREATE TYPE "store_platform" AS ENUM ('ANDROID', 'IOS');

-- CreateEnum
CREATE TYPE "purchase_status" AS ENUM ('VERIFIED', 'REVOKED');

-- CreateEnum
CREATE TYPE "entitlement_source" AS ENUM ('PURCHASE', 'PREMIUM_PICK', 'GRANT');

-- CreateTable
CREATE TABLE "purchases" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "platform" "store_platform" NOT NULL,
    "product_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "order_id" TEXT,
    "case_id" UUID,
    "status" "purchase_status" NOT NULL DEFAULT 'VERIFIED',
    "verification" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_entitlements" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "source" "entitlement_source" NOT NULL,
    "purchase_id" UUID,
    "subscription_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_entitlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "platform" "store_platform" NOT NULL,
    "product_id" TEXT NOT NULL,
    "original_id" TEXT NOT NULL,
    "latest_token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "auto_renewing" BOOLEAN NOT NULL DEFAULT true,
    "picks_period_end" TIMESTAMPTZ(3),
    "picks_used" INTEGER NOT NULL DEFAULT 0,
    "checked_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchases_token_key" ON "purchases"("token");

-- CreateIndex
CREATE INDEX "purchases_user_id_idx" ON "purchases"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "case_entitlements_purchase_id_key" ON "case_entitlements"("purchase_id");

-- CreateIndex
CREATE UNIQUE INDEX "case_entitlements_user_id_case_id_key" ON "case_entitlements"("user_id", "case_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_expires_at_idx" ON "subscriptions"("user_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_platform_original_id_key" ON "subscriptions"("platform", "original_id");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_entitlements" ADD CONSTRAINT "case_entitlements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_entitlements" ADD CONSTRAINT "case_entitlements_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_entitlements" ADD CONSTRAINT "case_entitlements_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_entitlements" ADD CONSTRAINT "case_entitlements_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seçim sayacı negatif olamaz.
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_picks_used_check" CHECK ("picks_used" >= 0);
