-- CreateTable
CREATE TABLE "fileToDelete" (
    "id" SERIAL NOT NULL,
    "file_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_name_on_s3" TEXT NOT NULL,
    "s3_server_name" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "fileToDelete_pkey" PRIMARY KEY ("id")
);
