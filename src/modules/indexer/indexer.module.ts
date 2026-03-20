import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { IndexerController } from './indexer.controller';

@Module({
  controllers: [IndexerController],
  providers: [IndexerService],
})
export class IndexerModule {}
