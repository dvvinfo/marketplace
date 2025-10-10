import {
  IsEmail,
  IsString,
  IsISO8601,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';

import { E_Gender } from '@modules/user/types';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(1)
  nameFirst: string;

  @IsString()
  @MinLength(1)
  nameLast: string;

  @IsISO8601()
  @IsOptional()
  birthDate?: Date;

  @IsOptional()
  @IsEnum(E_Gender)
  gender?: E_Gender;
}
