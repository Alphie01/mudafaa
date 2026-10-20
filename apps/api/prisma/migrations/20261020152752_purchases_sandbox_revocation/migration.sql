-- Satın alma ortamı (production / sandbox-test), sandbox hakları ve iade/geri alma zamanları.

-- CreateEnum
CREATE TYPE "store_environment" AS ENUM ('PRODUCTION', 'SANDBOX');

-- AlterTable
ALTER TABLE "case_entitlements" ADD COLUMN     "sandbox" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "environment" "store_environment" NOT NULL DEFAULT 'PRODUCTION',
ADD COLUMN     "revoked_at" TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "environment" "store_environment" NOT NULL DEFAULT 'PRODUCTION',
ADD COLUMN     "revoked_at" TIMESTAMPTZ(3);
