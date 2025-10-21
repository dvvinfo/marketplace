import { IsNumber, IsString, IsOptional } from 'class-validator';

export class RecordViewDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsString()
  @IsOptional()
  userAgent?: string;
}
