-- AlterTable
ALTER TABLE "users" ADD COLUMN "two_factor_enabled" Boolean DEFAULT false;
ALTER TABLE "users" ADD COLUMN "two_factor_secret" TEXT;
