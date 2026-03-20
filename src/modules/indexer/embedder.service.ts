import { Injectable, Logger } from "@nestjs/common"
import { firstValueFrom } from "rxjs"
import { HttpService } from "@nestjs/axios"

interface EmbeddingResult{
    embedding: number[]
    tokenCount: number
}
@Injectable()
export class EmbeddingService{
    private readonly logger = new Logger(EmbeddingService.name)

    private readonly model :string
    private readonly api_key :string

    constructor(private readonly httpService:HttpService){
        this.model = process.env.MODEL ??"text-embedding-3-small"
        this.api_key = process.env.API_KEY ?? ""
    }

    async embed(text:string):Promise<EmbeddingResult>{
        const response = await firstValueFrom(this.httpService.post(
            "https://api.openai.com/v1/embeddings",{
                input:text,model:this.model
            },
            {
                headers:{
                    Authorization: `Bearer ${this.api_key}`,
                    "Content-Type": "application/json"
                }
            }
        ))
        return {
            embedding: response.data.data[0].embedding,
            tokenCount:response.data.usage.total_tokens
        }

    }

    async embedBatch(text: string[]):Promise<EmbeddingResult[]>{
        this.logger.log(`Currently Embedding ${text.length} chunks`)
        const batchSize = 100
        const results:EmbeddingResult[] = []

        for(let i=0; i<text.length;i+batchSize ){
            const batch = text.slice(i,i+batchSize)
            const response = await firstValueFrom(this.httpService.post("https://api.openai.com/v1/embeddings",{
                input:batch,
                mdoel:this.model
            },{
                headers:{
                    Authorization:`Bearer ${this.api_key}`,
                    "Content-Type":"application/json"
                }
            }))
            const batchResult = response.data.data.map((item: {embedding:number[]},idx:number)=>({
                embedding: item.embedding,
                tokenCount :response.data.usage.total_tokens/batch.length
            }))

            results.push(...batchResult)
        }
        return results
    }
}