import {
  IsEmail,
  IsString,
  IsISO8601,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { E_Gender } from '@modules/user/types';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @MinLength(1)
  nameFirst: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @MinLength(1)
  nameLast: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Birth date in ISO format',
  })
  @IsISO8601()
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional({ enum: E_Gender, description: 'User gender' })
  @IsOptional()
  @IsEnum(E_Gender)
  gender?: E_Gender;
}
