import { IsInt, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsInt()
  userId: number;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
