-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('USER', 'SHARED', 'COMPANY');

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFolder" BOOLEAN NOT NULL,
    "extension" TEXT,
    "idParent" INTEGER,
    "size" INTEGER NOT NULL,
    "statut" "AccessStatus" NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_idParent_fkey" FOREIGN KEY ("idParent") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
