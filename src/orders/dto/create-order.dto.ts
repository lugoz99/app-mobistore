import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  IsUppercase,
  Length,
  MinLength,
} from 'class-validator';
import { User } from '../../auth/entities/user.entity';

export class CreateOrderDto {
  @ApiProperty({
    example: 'USD',
    description: 'ISO 4217 currency code',
  })
  @IsString()
  @IsUppercase()
  @Length(3, 3)
  currency: string;

  @ApiProperty({
    example: '123 Main Street, Apartment 4',
  })
  @IsString()
  @MinLength(1)
  shippingAddress: string;

  user: User;
}
