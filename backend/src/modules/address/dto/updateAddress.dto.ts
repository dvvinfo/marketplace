import {
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  fullName?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  country?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  postalCode?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  addressLine1?: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
