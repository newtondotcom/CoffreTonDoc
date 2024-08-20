/*
  Warnings:

  - The primary key for the `fileToDelete` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `fileToDelete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fileToDelete" DROP CONSTRAINT "fileToDelete_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "fileToDelete_pkey" PRIMARY KEY ("file_id");
