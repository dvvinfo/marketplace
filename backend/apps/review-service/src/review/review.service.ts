import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getAllReviews(): Promise<Review[]> {
    return await this.reviewRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getProductRating(
    productId: number,
  ): Promise<{ averageRating: number; totalReviews: number }> {
    const reviews = await this.reviewRepository.find({
      where: { productId },
    });

    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

    return {
      averageRating,
      totalReviews: reviews.length,
    };
  }

  async createReview(reviewData: CreateReviewDto): Promise<Review> {
    const existingReview = await this.reviewRepository.findOne({
      where: {
        userId: reviewData.userId,
        productId: reviewData.productId,
      },
    });

    if (existingReview) {
      throw new ConflictException(
        'You have already reviewed this product. Use update instead.',
      );
    }

    const review = this.reviewRepository.create(reviewData);
    return await this.reviewRepository.save(review);
  }

  async updateReview(
    id: number,
    userId: number,
    reviewData: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.getReviewById(id);

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    if (reviewData.rating !== undefined) {
      review.rating = reviewData.rating;
    }

    if (reviewData.comment !== undefined) {
      review.comment = reviewData.comment;
    }

    return await this.reviewRepository.save(review);
  }

  async deleteReview(id: number, userId: number): Promise<void> {
    const review = await this.getReviewById(id);

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }
}
