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
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewProxyController {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewClient: ClientProxy,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Returns all reviews' })
  async getAllReviews() {
    return await firstValueFrom(
      this.reviewClient.send({ cmd: 'get_all_reviews' }, {}),
    );
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Returns review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async getReview(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(
      this.reviewClient.send({ cmd: 'get_review_by_id' }, { id }),
    );
  }

  @Get('/product/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get reviews by product ID' })
  @ApiResponse({ status: 200, description: 'Returns product reviews' })
  async getReviewsByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await firstValueFrom(
      this.reviewClient.send({ cmd: 'get_reviews_by_product' }, { productId }),
    );
  }

  @Get('/product/:productId/rating')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get product rating' })
  @ApiResponse({
    status: 200,
    description: 'Returns average rating and total reviews',
  })
  async getProductRating(@Param('productId', ParseIntPipe) productId: number) {
    return await firstValueFrom(
      this.reviewClient.send({ cmd: 'get_product_rating' }, { productId }),
    );
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get reviews by user ID' })
  @ApiResponse({ status: 200, description: 'Returns user reviews' })
  async getReviewsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await firstValueFrom(
      this.reviewClient.send({ cmd: 'get_reviews_by_user' }, { userId }),
    );
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 409, description: 'Review already exists' })
  async createReview(@Body() body: CreateReviewDto) {
    return await firstValueFrom(
      this.reviewClient.send({ cmd: 'create_review' }, body),
    );
  }

  @Put('/:id/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: UpdateReviewDto,
  ) {
    return await firstValueFrom(
      this.reviewClient.send(
        { cmd: 'update_review' },
        { id, userId, reviewData: body },
      ),
    );
  }

  @Delete('/:id/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await firstValueFrom(
      this.reviewClient.send({ cmd: 'delete_review' }, { id, userId }),
    );
  }
}
