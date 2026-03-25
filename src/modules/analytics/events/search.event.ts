import { Injectable } from "@nestjs/common";

@Injectable()
export class SearchEvent {
  constructor(
    public readonly query:string,
    public readonly resultCount:number,
    public readonly responseTime:number,
    public readonly threshold:number
  ) {}
}
