import { Inject, Logger } from "@nestjs/common"
import { Process, Processor } from "@nestjs/bull"
import { ChunkerService } from "./chunker.service"
import { EmbeddingService } from "./embedder.service"
import { PrismaService } from "../prisma/prisma.service"
import type { Job } from "bull"
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager"

interface IndexDocumentJob {
  documentId: string
}

@Processor('indexer')
export class IndexerProcessor {
  private readonly logger = new Logger(IndexerProcessor.name)

  constructor(
    private readonly chunker: ChunkerService,
    private readonly embedder: EmbeddingService,
    private readonly db: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  @Process("index-document")
  async handleIndexDocument(job: Job<IndexDocumentJob>) {
    try {
      const { documentId } = job.data
      this.logger.log(`Indexing document ${documentId}`)

      const document = await this.db.document.findUniqueOrThrow({
        where: { id: documentId }
      })

      const chunks = this.chunker.chunk(document.content)
      this.logger.log(`Created ${chunks.length} chunks for document ${documentId}`)

      const embeddings = await this.embedder.embedBatch(
        chunks.map((chunk) => chunk.content)
      )
      this.logger.log(`Got ${embeddings.length} embeddings`)

      // insert all chunks first
      for (let i = 0; i < chunks.length; i++) {
        const vector = `[${embeddings[i].embedding.join(",")}]`

        await this.db.$executeRaw`
          INSERT INTO "DocumentChunks" (id, "documentId", content, embedding, "chunkIndex", "createdAt")
          VALUES (
            gen_random_uuid(),
            ${documentId},
            ${chunks[i].content},
            ${vector}::vector,
            ${chunks[i].chunkIndex},
            NOW()
          )
        `
      }

      // mark as indexed only after all chunks are saved
      await this.db.document.update({
        where: { id: documentId },
        data: { indexed: true }
      })

      await this.clearCache(documentId)
      this.logger.log(`Document ${documentId} indexed successfully`)

    } catch (error) {
      this.logger.error(`Failed to index document: ${error.message}`, error.stack)
      throw error
    }
  }

  async clearCache(id: string) {
    try {
      const store = (this.cache as any).stores[0]
      const keys: string[] = await store.keys('search:*')
      if (keys.length > 0) {
        await store.mdel(...keys)
      }
      this.logger.log(`Cache cleared after indexing document ${id}`)
    } catch (error) {
      this.logger.warn(`Cache clear failed: ${error.message}`)
    }
  }
}