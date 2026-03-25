import { InjectQueue } from "@nestjs/bull";
import type { Queue } from "bull";

export class IndexerService{
     
    constructor (@InjectQueue('indexer') private readonly indexerQueue: Queue){}
    async queueDocuments(documentId:string){
        await this.indexerQueue.add("index-document",{documentId},{
            attempts:3,
            backoff:{
                type:'exponential',
                delay:2000,

            },
            removeOnComplete:true
        })
    }
}