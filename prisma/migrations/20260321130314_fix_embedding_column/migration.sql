/*
  Warnings:

  - Made the column `embedding` on table `DocumentChunks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "document_chunk_embedding_idx";

-- AlterTable
ALTER TABLE "DocumentChunks" ALTER COLUMN "embedding" SET NOT NULL;

ALTER TABLE "DocumentChunks" DROP COLUMN IF EXISTS embedding;
ALTER TABLE "DocumentChunks" ADD COLUMN embedding vector(384);

CREATE INDEX document_chunk_embedding_idx
ON "DocumentChunks"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
