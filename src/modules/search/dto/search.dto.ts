import { Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";


export class CreateSearchDto{

    @IsNotEmpty()
    @IsString()
    q:string

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(20)
    @Type(()=>Number)
    limit?:number =5

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    @Type(()=> Number)
    threshold?:number = 75
}