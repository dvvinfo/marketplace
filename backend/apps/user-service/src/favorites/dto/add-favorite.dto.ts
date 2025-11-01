import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class AddFavoriteDto {
  @ApiProperty({
    description: 'ID товара',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  productId: number;
}
