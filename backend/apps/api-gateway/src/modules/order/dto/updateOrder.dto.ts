import { IsString, IsEnum, IsOptional } from 'class-validator';
import { E_OrderStatus } from '../order.entity';

export class UpdateOrderDto {
  @IsEnum(E_OrderStatus)
  @IsOptional()
  status?: E_OrderStatus;

  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
