import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsInt()
  userId: number;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  @MinLength(5)
  phone: string;

  @IsString()
  @MinLength(2)
  country: string;

  @IsString()
  @MinLength(2)
  city: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsString()
  @MinLength(3)
  postalCode: string;

  @IsString()
  @MinLength(5)
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
