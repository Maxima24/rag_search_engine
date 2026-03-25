import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../indexer/embedder.service';
import { CreateSearchDto } from './dto/search.dto';
import {EventEmitter2} from "@nestjs/event-emitter"
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';
import { SearchEvent } from '../analytics/events/search.event';

export interface ChunkResult {
  id: string;
  content: string;
  chunkIndex: number;
  similarity: number;
  documentId: string;
  documentTitle: string;
}
export interface SearchResponse{
  query:string
  totalChunks:number
  documents:SearchResultDocument[]
}
export interface SearchResultDocument {
  documentId: string;
  documentTitle: string;
  chunks: SearchResultChunk[];
}
export interface SearchResultChunk {
  id: string;
  content: string;
  chunkIndex: number;
  similarity: number;
}
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  constructor(
    private readonly db: PrismaService,
    private readonly embedder: EmbeddingService,
    private readonly emitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private readonly cache:Cache
  ) {}
  async search(dto: CreateSearchDto) {
    const { q, limit, threshold } = dto;
    const start = Date.now()

    /// Check in Cache fror Query
    const cacheKey = `search:${q.toLowerCase().trim()}:${limit ??5}:${threshold ?? 75}`
    const cached = await this.cache.get<SearchResponse>(cacheKey)
    if(cached){
      this.logger.log(` Cache hit for query "${q}"`)
      return cached
    }
           this.logger.log(` Cache Miss for query "${q}"`)
    

    // embed then search       
    this.logger.log(`Embedding query: ${q}`);
    const { embedding } = await this.embedder.embed(q);
    const queryVector = `[${embedding.join(',')}]`;
    const similarityThreshold = (threshold ?? 75) / 100;

    const results = await this.db.$queryRaw<ChunkResult[]>`
    SELECT 
    dc.id,
    dc.content,
    dc."chunkIndex",
    dc."documentId",
    d.title as "documentTitle",
    1 -(dc.embedding <=> ${queryVector}::vector) AS similarity
    FROM "DocumentChunks" dc
    JOIN "Document" d ON d.id = dc."documentId"
    WHERE  d.indexed = true
    AND 1-(dc.embedding <=> ${queryVector}::vector) >= ${similarityThreshold}
    ORDER BY dc.embedding <=> ${queryVector}::vector
    LIMIT ${limit ?? 5}
    `;
    const response :SearchResponse = {
      query:q,
      totalChunks:results.length,
      documents:this.groupByDocument(results)
    }
      await this.cache.set(cacheKey,response)
      this.emitter.emit(
       'search.completed', new SearchEvent(q,results.length,Date.now() - start,threshold??75)
      )
    return response
  }


  private groupByDocument(chunks:ChunkResult[]){
    const map = new Map<string,{
        documentId:string,
        documentTitle:string,
        chunks:Omit<ChunkResult, 'documentId' | 'documentTitle'>[]
    }>()
    for (const chunk of chunks){
        const {documentId,documentTitle,...chunkData} = chunk
        if(!map.has(documentId)){
            map.set(documentId,{
                documentId,
                documentTitle,
                chunks:[]
            })
        }
        map.get(documentId)!.chunks.push(chunkData)
    }
    return Array.from(map.values())
  }

}
