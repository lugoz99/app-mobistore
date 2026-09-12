import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUppercase,
  IsPositive,
  Length,
  MinLength,
} from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: '2026-09-11T14:30:00.000Z' })
  @IsDateString()
  @IsOptional()
  orderDate?: string;

  @ApiProperty({ example: 2499.99 })
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @ApiProperty({ example: 'USD', description: 'ISO 4217 currency code' })
  @IsString()
  @IsUppercase()
  @Length(3, 3)
  currency: string;

  @ApiPropertyOptional({ enum: ['PENDING', 'CONFIRMED', 'CANCELLED'] })
  @IsIn(['PENDING', 'CONFIRMED', 'CANCELLED'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: '123 Main Street, Apartment 4' })
  @IsString()
  @MinLength(1)
  shippingAddress: string;

  @ApiProperty({ example: '041afad2-3bdb-4b4b-ac5f-f4f649752e21' })
  @IsUUID()
  userId: string;
}
