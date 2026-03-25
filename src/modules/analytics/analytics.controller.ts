import { Controller, Get, HttpCode } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}
  @Get('queries')
  @HttpCode(200)
  async getTopQueries() {
    return await this.analyticsService.getTopQueries();
  }
  @Get('summary')
  @HttpCode(200)
  async getSummary(){
    return await this.analyticsService.getSummary()
  }
}
