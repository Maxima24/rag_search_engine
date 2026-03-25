import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bull";

@Injectable()
export class IndexerService{
     
    constructor (@InjectQueue('indexer') private readonly indexerQueue: Queue){}
    async queueDocument(documentId:string){
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