import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ValidRoles } from '../interfaces/valid-roles';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsOptional()
  @IsArray()
  @IsEnum(ValidRoles, { each: true })
  roles?: string[] = ['user'];
}