import { Injectable, Logger } from "@nestjs/common";
import { OnEvent} from "@nestjs/event-emitter";
import { SearchEvent } from "./events/search.event";
import { AnalyticsService } from "./analytics.service";



@Injectable()
export class AnalyticsListener{
private readonly logger = new Logger(AnalyticsListener.name)
constructor(private readonly analyticsService:AnalyticsService){}

@OnEvent('search.completed')
async handleSearchComplete(event:SearchEvent){
    this.logger.log(` Recording analytics for query "${event.query}"`)
    await this.analyticsService.record(event)

}

}