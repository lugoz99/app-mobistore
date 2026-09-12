import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class CreateOrderDeviceDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 'Black' })
  @IsString()
  @MinLength(1)
  selectedColor: string;

  @ApiProperty({ example: '7d4f6b7e-5e62-4f6d-8c9d-2f9e5d1b4c12' })
  @IsUUID()
  deviceId: string;
}

export class CreateOrderWithDevidesDto extends CreateOrderDto {
  @ApiProperty({ type: [CreateOrderDeviceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDeviceDto)
  orderItems: CreateOrderDeviceDto[];
}
