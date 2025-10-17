import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './review.entity';
import { User } from '@modules/user/user.entity';
import { Product } from '@modules/product/product.entity';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getAllReviews(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  public async getReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  public async getReviewsByProductId(productId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  public async getReviewsByUserId(userId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  public async getProductRating(
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

  public async createReview(reviewData: CreateReviewDto): Promise<Review> {
    const user = await this.userRepository.findOne({
      where: { id: reviewData.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${reviewData.userId} not found`,
      );
    }

    const product = await this.productRepository.findOne({
      where: { id: reviewData.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${reviewData.productId} not found`,
      );
    }

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

  public async updateReview(
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

  public async deleteReview(id: number, userId: number): Promise<void> {
    const review = await this.getReviewById(id);

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }
}
