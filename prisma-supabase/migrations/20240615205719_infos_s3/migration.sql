-- AlterTable
ALTER TABLE "File" ADD COLUMN     "file_name_on_s3" TEXT,
ADD COLUMN     "s3_server_name" TEXT;

-- CreateTable
CREATE TABLE "S3" (
    "endpoint" TEXT NOT NULL,
    "ssl" BOOLEAN NOT NULL,
    "port" INTEGER NOT NULL,
    "access_key" TEXT NOT NULL,
    "secret_key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "S3_pkey" PRIMARY KEY ("name")
);
