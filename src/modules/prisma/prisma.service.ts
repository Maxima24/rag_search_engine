import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {PrismaClient} from "@prisma/client"
import {Pool} from 'pg'
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor(private readonly configService:ConfigService){
    const pool =  new Pool({
      connectionString:configService.get("DATABASE_URL")!
    })
    const adapter = new PrismaPg(pool)
    super({
      adapter
    })
  }

    async onModuleInit() {
        this.$connect()
    }
    async onModuleDestroy() {
        this.$disconnect()
    }

    async checkHealth(){
        const now  = Date.now()
        try{
            await this.$queryRaw`SELECT 1;`
            return {
                service:"Prisma",
                status:"up",
                message:"Prisma is Up",
                duration:Date.now()
            }
        }catch(err){
                return {
                    service:"Prisma",
                    status:"Down",
                    message:"Prisma is Down",
                    duration:Date.now()
                }
        }
    }
}
