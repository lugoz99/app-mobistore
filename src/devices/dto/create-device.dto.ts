import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class DeviceImageDto {
  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/example/image/upload/device.jpg',
    description: 'Image URL',
  })
  @IsString()
  @MinLength(1)
  url: string;

  @ApiPropertyOptional({
    example: 'store-devices/device',
    description: 'Cloudinary public ID',
  })
  @IsString()
  @IsOptional()
  publicId?: string;
}

export class CreateDeviceDto {
  @ApiProperty({
    example: 'MacBook Pro M5',
    description: 'Device model name',
  })
  @IsString()
  @MinLength(1)
  modelName: string;

  @ApiProperty({
    example: 'IPH-15-128-BLK',
    description: 'Unique stock keeping unit for the device',
  })
  @IsString()
  @MinLength(1)
  sku: string;

  @ApiProperty({
    example: 'Apple',
    description: 'Device brand name',
  })
  @IsString()
  @MinLength(1)
  brand: string;

  @ApiPropertyOptional({
    example: 2499.99,
    description: 'Device price',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Shows if the device is available in the catalog',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: '1TB, 32GB RAM',
    description: 'Technical details of the device',
  })
  @IsString()
  @IsOptional()
  technicalDetails?: string;

  @ApiProperty({
    example: 'macbook-pro-m5',
    description: 'Unique device slug',
  })
  @IsString()
  @MinLength(1)
  @IsOptional()
  modelSlug?: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Number of devices in stock',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  unitsInStock?: number;

  @ApiProperty({
    example: ['Silver', 'Black'],
    type: [String],
    description: 'Available device colors',
  })
  @IsArray()
  @IsString({ each: true })
  availableColor: string[];

  @ApiProperty({
    example: 'premium',
    enum: ['premium', 'budget', 'mid-range', 'flagship'],
    description: 'Device market category',
  })
  @IsIn(['premium', 'budget', 'mid-range', 'flagship'])
  targetMarket: string;

  @ApiPropertyOptional({
    example: ['Charger', 'USB-C cable'],
    type: [String],
    description: 'Accessories included with the device',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  accessoriesIncluded?: string[];

  @ApiPropertyOptional({
    type: [DeviceImageDto],
    description: 'Images associated with the device',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeviceImageDto)
  @IsOptional()
  images?: DeviceImageDto[];

  @IsUUID()
  categoryId: string;
}
