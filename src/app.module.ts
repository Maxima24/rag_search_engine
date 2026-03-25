import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './modules/prisma/prisma.service';
import {EventEmitterModule} from "@nestjs/event-emitter"
import {ConfigModule} from "@nestjs/config"
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { PrismaModule } from './modules/prisma/prisma.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { IndexerModule } from './modules/indexer/indexer.module';
import { SearchModule } from './modules/search/search.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:".env"
    }),
    EventEmitterModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal:true,
      useFactory: async ()=>({
        stores: [
          new KeyvRedis('redis://localhost:6379')
        ],
        ttl:60*5
      })
    }),
    BullModule.forRoot({
      redis:{
        host:'localhost',port:6379
      }
    }),
    PrismaModule,
    DocumentsModule,
    IndexerModule,
    SearchModule,
    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
