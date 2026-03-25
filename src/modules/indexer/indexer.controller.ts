import { Controller } from '@nestjs/common';
import { ChunkerService } from './chunker.service';

@Controller('indexer')
export class IndexerController {
  constructor(private readonly indexerService: ChunkerService) {}
}
