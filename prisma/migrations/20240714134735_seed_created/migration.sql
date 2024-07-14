-- AlterTable
ALTER TABLE "File" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "seed_created" BOOLEAN DEFAULT false;
