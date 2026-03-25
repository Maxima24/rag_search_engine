import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchEvent } from './events/search.event';

@Injectable()
export class AnalyticsService {
    constructor(private readonly db:PrismaService){}
    async record (event:SearchEvent){
        await this.db.analytics.create({
            data:{
                query:event.query,
                threshold:event.threshold,
                responseTime:event.responseTime,
                 resultCount:event.resultCount
        }
    })

    }
    async getTopQueries(){
        return this.db.analytics.groupBy({
            by:['query'],
            _count:{query:true},
            _avg:{responseTime:true,resultCount:true},
            orderBy:{_count:{query:'desc'}},
            take:10
        })
    }

    async getSummary(){
        const [total,avgResponseTime,searchResultQueries]=await  Promise.all([
            this.db.analytics.count(),
            this.db.analytics.aggregate({
                _avg:{responseTime:true}
            }),
            this.db.analytics.count({
                where:{
                    resultCount:0
                }
            })
        ])
    }
}
