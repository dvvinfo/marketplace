import {
  IsEmail,
  IsString,
  IsISO8601,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

import { E_Gender } from '../types';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  nameFirst?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  nameLast?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsISO8601()
  birthDate?: Date;

  @IsOptional()
  @IsEnum(E_Gender)
  gender?: E_Gender;
}
