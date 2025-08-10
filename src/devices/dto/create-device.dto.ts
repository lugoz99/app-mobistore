import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateDeviceDto {



    @IsString()
    @MinLength(1)
    modelName: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    technicalDetails?: string;

    @IsString()
    @MinLength(1)
    modelSlug: string;

    @IsInt()
    @IsOptional()
    @IsPositive()
    unitsInStock?: number;

    @IsString({each:true})
    @IsArray()
    availableColor: string[];

    @IsIn(['premium','budget','mid-range','flagship'])
    targetMarket: string; // genders
    

}
