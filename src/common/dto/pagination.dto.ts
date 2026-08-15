import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'How many row do you need',
  })
  @IsOptional()
  @IsPositive()
  // This a transformation, we need to do this because the parameters always are strings
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'How many row do you want to skip',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
