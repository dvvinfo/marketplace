import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
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

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @MinLength(3)
  postalCode: string;

  @IsString()
  @MinLength(5)
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
