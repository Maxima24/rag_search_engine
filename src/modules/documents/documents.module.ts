import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { IndexerModule } from '../indexer/indexer.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports:[IndexerModule],
  controllers: [DocumentsController],
  providers: [DocumentsService,PrismaService],
})
export class DocumentsModule {}
