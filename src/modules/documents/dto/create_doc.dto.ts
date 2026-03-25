import {IsObject, IsOptional, IsString} from "class-validator"
export class CREATEDOCDTO{
 
    @IsString()
    content: string
    @IsString()
    title:string
    @IsOptional()
    metaData ?: Record<string,any>
}