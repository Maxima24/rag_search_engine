import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {PrismaClient} from "@prisma/client"
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

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
