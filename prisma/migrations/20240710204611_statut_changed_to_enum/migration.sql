/*
  Warnings:

  - Changed the type of `statut` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('USER', 'SHARED', 'COMPANY');

-- AlterTable
ALTER TABLE "File" DROP COLUMN "statut",
ADD COLUMN     "statut" "AccessStatus" NOT NULL;
