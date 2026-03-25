import { Module } from '@nestjs/common';
import { ChunkerService } from './chunker.service';
import { IndexerController } from './indexer.controller';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { IndexerProcessor } from './indexer.processor';
import { EmbeddingService } from './embedder.service';
import { IndexerService } from './indexer.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [IndexerController],
  providers: [IndexerProcessor,ChunkerService,EmbeddingService,IndexerService,HttpModule,PrismaService],
  imports:[
    BullModule.registerQueue({name:"indexer"}),
    HttpModule
],
exports:[IndexerService,EmbeddingService,ChunkerService,HttpModule]
})
export class IndexerModule {}
