import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 5, description: 'Rating (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Great product!', description: 'Review comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
