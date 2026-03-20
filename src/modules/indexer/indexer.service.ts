import { Injectable } from '@nestjs/common';

interface ChunkObject {
  chunkIndex: number;
  content: string;
}
@Injectable()
export class IndexerService {
  private readonly chunkSize;
  private readonly chunkOverlap;
  constructor() {
    this.chunkSize = parseInt(process.env.CHUNK_SIZE ?? '500');
    this.chunkOverlap = parseInt(process.env.CHUNCK_OVERLAP ?? '50');
  }

  chunk(text: string): ChunkObject[] {
    const words = text.split(/\s+/).filter(Boolean);
    const chunks: ChunkObject[] = [];
    let i = 0;
    let chunkIndex = 0;
    while (i< words.length){
        const chunk_word = words.splice(i,i+this.chunkSize)
        chunks.push({
            content:chunk_word.join(""),
            chunkIndex: chunkIndex++
        })

        i += this.chunkSize-this.chunkOverlap
        
   
    }
    return chunks
  }
}
