ALTER TABLE "DocumentChunks" DROP COLUMN IF EXISTS embedding;
ALTER TABLE "DocumentChunks" ADD COLUMN embedding vector(384);

DROP INDEX IF EXISTS document_chunk_embedding_idx;
CREATE INDEX document_chunk_embedding_idx
ON "DocumentChunks"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);