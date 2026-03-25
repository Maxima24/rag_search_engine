import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../indexer/embedder.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  controllers: [SearchController],
  imports:[HttpModule],
  providers: [SearchService,PrismaService,EmbeddingService],
})
export class SearchModule {}
