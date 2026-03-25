-- This is an empty migration.
CREATE INDEX document_chunk_embedding_idx
ON "DocumentChunks"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100)