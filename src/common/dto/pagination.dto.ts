import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min, min } from "class-validator";

export class PaginationDto{




    @IsOptional()
    @IsPositive()
    // This a transformation, we need to do this because the parameters always are strings
    @Type(() => Number)
    limit?: number;


    @IsOptional()
    @Min(0)
    @Type(()=> Number)
    offset?: number;
}