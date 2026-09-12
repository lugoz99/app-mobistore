import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 2,
    description: 'Number of devices in the order item',
  })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    example: 'Black',
    description: 'Color selected by the customer',
  })
  @IsString()
  @MinLength(1)
  selectedColor: string;

  @ApiProperty({ example: '041afad2-3bdb-4b4b-ac5f-f4f649752e21' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: '7d4f6b7e-5e62-4f6d-8c9d-2f9e5d1b4c12' })
  @IsUUID()
  deviceId: string;
}
