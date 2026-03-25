import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsListener } from './analytics.listener';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsListener,AnalyticsService],
})
export class AnalyticsModule {}
