import {IsObject, IsString} from "class-validator"
export class CREATEDOCDTO{
 
    @IsString()
    content: string
    @IsString()
    title:string
    metaData : Record<string,any>
}