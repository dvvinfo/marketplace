import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern({ cmd: 'get_all_reviews' })
  async getAllReviews() {
    return await this.reviewService.getAllReviews();
  }

  @MessagePattern({ cmd: 'get_review_by_id' })
  async getReviewById(@Payload() data: { id: number }) {
    return await this.reviewService.getReviewById(data.id);
  }

  @MessagePattern({ cmd: 'get_reviews_by_product' })
  async getReviewsByProduct(@Payload() data: { productId: number }) {
    return await this.reviewService.getReviewsByProductId(data.productId);
  }

  @MessagePattern({ cmd: 'get_product_rating' })
  async getProductRating(@Payload() data: { productId: number }) {
    return await this.reviewService.getProductRating(data.productId);
  }

  @MessagePattern({ cmd: 'get_reviews_by_user' })
  async getReviewsByUser(@Payload() data: { userId: number }) {
    return await this.reviewService.getReviewsByUserId(data.userId);
  }

  @MessagePattern({ cmd: 'create_review' })
  async createReview(@Payload() data: CreateReviewDto) {
    return await this.reviewService.createReview(data);
  }

  @MessagePattern({ cmd: 'update_review' })
  async updateReview(
    @Payload() data: { id: number; userId: number; reviewData: UpdateReviewDto },
  ) {
    return await this.reviewService.updateReview(
      data.id,
      data.userId,
      data.reviewData,
    );
  }

  @MessagePattern({ cmd: 'delete_review' })
  async deleteReview(@Payload() data: { id: number; userId: number }) {
    return await this.reviewService.deleteReview(data.id, data.userId);
  }
}
