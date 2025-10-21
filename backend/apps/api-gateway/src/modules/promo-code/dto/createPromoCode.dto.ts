import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
  MinLength,
} from 'class-validator';
import { DiscountType } from '../promo-code.entity';

export class CreatePromoCodeDto {
  @IsString()
  @MinLength(3)
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minPurchaseAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDiscountAmount?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  usageLimit?: number;

  @IsDateString()
  validFrom: string;

  @IsDateString()
  validUntil: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
