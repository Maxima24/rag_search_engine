import { Injectable, Logger } from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { HttpService } from "@nestjs/axios"
import { mean_pooling, pipeline } from "@xenova/transformers"
import { normalize } from "path"

interface EmbeddingResult{
    embedding: number[]
    tokenCount: number
}
@Injectable()
export class EmbeddingService{
    private readonly logger = new Logger(EmbeddingService.name)

    private readonly model :string
    private readonly api_key :string
       private embedder: any = null;

    constructor(private readonly httpService:HttpService){
        this.model = process.env.MODEL ??"text-embedding-3-small"
       
        this.api_key = process.env.OPENAI_API_KEY?? ""      
    }
    async getEmbedder() {
    if (!this.embedder) {
      this.logger.log('Loading local embedding model...');
      this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      this.logger.log('Model loaded');
    }
    return this.embedder;
  }

    async embed(text:string):Promise<EmbeddingResult>{
        const embedder = await this.getEmbedder()
        // const response = await firstValueFrom(this.httpService.post(
        //     "https://api.openai.com/v1/embeddings",{
        //         input:text,model:this.model
        //     },
        //     {
        //         headers:{
        //             Authorization: `Bearer ${this.api_key}`,
        //             "Content-Type": "application/json"
        //         }
        //     }
        // ))
        const result = await this.embedBatch([text])
        // return {
        //     embedding: response.data.data[0].embedding,
        //     tokenCount:response.data.usage.total_tokens
        // }
        return result[0]

    }

    async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
  this.logger.log(`Embedding batch of ${texts.length} chunks`);
  const embedder = await this.getEmbedder()

  const batchSize = 100;
  const results: EmbeddingResult[] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    try {
    //   const response = await firstValueFrom(
    //     this.httpService.post(
    //       'https://api.openai.com/v1/embeddings',
    //       { input: batch, model: this.model },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${this.api_key}`,
    //           'Content-Type': 'application/json',
    //         },
    //       },
    //     ),
    //   );
        const output  = await embedder(texts,{mean_pooling,normalize:true})
    //   const batchResults = response.data.data.map(
    //     (item: { embedding: number[] }) => ({
    //       embedding: item.embedding,
    //       tokenCount: response.data.usage.total_tokens / batch.length,
    //     }),
    //   );

      results.push({
        embedding:Array.from(output.data).slice(0,384) as number[],
        tokenCount:0
      });

    } catch (error) {
      // log the full OpenAI error response
    //   this.logger.error(`OpenAI error: ${JSON.stringify(error.response?.data)}`);
    //   this.logger.error(`Request body: ${JSON.stringify({ input: batch, model: this.model })}`);
    this.logger.error("something went wrong",error)
      throw error;
    }
  }

  return results;
}
}