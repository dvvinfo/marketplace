import { IsEnum, IsString, IsOptional } from 'class-validator';
import { E_OrderStatus } from '../order.entity';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(E_OrderStatus)
  status?: E_OrderStatus;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
