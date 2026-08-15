import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Model Name (unique)',
    nullable: false,
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  modelName: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  technicalDetails?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  modelSlug: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @IsPositive()
  unitsInStock?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  availableColor: string[];

  @ApiProperty()
  @IsIn(['premium', 'budget', 'mid-range', 'flagship'], {
    message: "targetMarket must be: premium, budget, mid-range o flagship',",
  })
  targetMarket: string; // genders

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  accessoriesIncluded?: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
