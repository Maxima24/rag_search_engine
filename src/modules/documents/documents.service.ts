import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CREATEDOCDTO } from './dto/create_doc.dto';
import { Prisma } from '@prisma/client';
import { IndexerService } from '../indexer/indexer.service';

@Injectable()
export class DocumentsService {
    private readonly logger = new Logger(DocumentsService.name)
    constructor(private readonly db:PrismaService,
        private readonly indexer:IndexerService
    ){}

    public async createDoc(dto:CREATEDOCDTO){
        const document = await this.db.document.create({
            data:{
                content:dto.content,
                title:dto.title,
                metaData:dto.metaData ?? Prisma.JsonNull
            }
        })
        
        await this.indexer.queueDocuments(document.id)
        return{
            id:document.id,
            title:document.title,
            indexed:document.indexed,
            createdAt:document.createdAt
        }
    }
    public async findOne(id:string){
        const doc = await this.db.document.findUnique({
            where:{
                id
            },
            include:{
                chunk:{
                    select:{
                        id:true,
                        chunkIndex:true,
                        content:true
                    },
                     orderBy:{chunkIndex:"asc"},
                }
            },
        })
        if(!document) throw new NotFoundException( `Document ${id} not found`);
        return doc
    }
    public async findAll(){
        return this.db.document.findMany({
            select:{
                id:true,
                title:true,
                indexed:true,
                createdAt:true,
                _count:{select:{chunk:true}},
                
            },
            orderBy:{createdAt:"asc"}
        })
    }
    public async remove(id:string){
        const document = await this.db.document.findUnique({
            where:{
                id
            }
        })
        if(!document) throw new NotFoundException(`Docuemnt ${id} not found` )
        await this.db.document.delete({
            where:{
                id
            }
        })
        return {
            message:    `Document ${id} deleted `
        }
    }

}
