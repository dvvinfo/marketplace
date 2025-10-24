import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({ example: 4, description: 'Rating (1-5)', minimum: 1, maximum: 5, required: false })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 'Updated comment', description: 'Review comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
