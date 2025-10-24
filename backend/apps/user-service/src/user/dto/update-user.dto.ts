import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { E_Gender, UserRole } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nameFirst?: string;

  @IsOptional()
  @IsString()
  nameLast?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(E_Gender)
  gender?: E_Gender;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
