/*
  Warnings:

  - Made the column `embedding` on table `DocumentChunks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "document_chunk_embedding_idx";

-- AlterTable
ALTER TABLE "DocumentChunks" ALTER COLUMN "embedding" SET NOT NULL;

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "resultCount" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "threshold" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);
