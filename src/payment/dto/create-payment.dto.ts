import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsUppercase,
  IsPositive,
  Length,
  MinLength,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'card' })
  @IsString()
  @MinLength(1)
  paymentMethod: string;

  @ApiPropertyOptional({ example: '2026-09-11T14:35:00.000Z' })
  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @ApiProperty({ example: 2499.99 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    enum: ['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED'],
  })
  @IsIn(['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED'])
  status: string;

  @ApiProperty({ example: 'pi_3NExamplePaymentIntent' })
  @IsString()
  @MinLength(1)
  stripePaymentIntentId: string;

  @ApiPropertyOptional({ example: 'ch_3NExampleCharge' })
  @IsString()
  @IsOptional()
  stripeChargeId?: string;

  @ApiProperty({ example: 'USD', description: 'ISO 4217 currency code' })
  @IsString()
  @IsUppercase()
  @Length(3, 3)
  currency: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  attemptNumber?: number;

  @ApiPropertyOptional({ example: 'card_declined' })
  @IsString()
  @IsOptional()
  failureCode?: string;

  @ApiPropertyOptional({ example: 'The card was declined.' })
  @IsString()
  @IsOptional()
  failureMessage?: string;

  @ApiProperty({ example: '041afad2-3bdb-4b4b-ac5f-f4f649752e21' })
  @IsUUID()
  orderId: string;
}
