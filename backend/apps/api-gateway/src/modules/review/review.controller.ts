import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllReviews() {
    return await this.reviewService.getAllReviews();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getReview(@Param('id', ParseIntPipe) id: number) {
    return await this.reviewService.getReviewById(id);
  }

  @Get('/product/:productId')
  @HttpCode(HttpStatus.OK)
  async getReviewsByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.reviewService.getReviewsByProductId(productId);
  }

  @Get('/product/:productId/rating')
  @HttpCode(HttpStatus.OK)
  async getProductRating(@Param('productId', ParseIntPipe) productId: number) {
    return await this.reviewService.getProductRating(productId);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getReviewsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.reviewService.getReviewsByUserId(userId);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createReview(@Body() body: CreateReviewDto) {
    return await this.reviewService.createReview(body);
  }

  @Put('/:id/user/:userId')
  @HttpCode(HttpStatus.OK)
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UpdateReviewDto,
  ) {
    return await this.reviewService.updateReview(id, userId, body);
  }

  @Delete('/:id/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.reviewService.deleteReview(id, userId);
  }
}
