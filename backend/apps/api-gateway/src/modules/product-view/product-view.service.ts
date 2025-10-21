import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';

import { ProductView } from './product-view.entity';
import { Product } from '@modules/product/product.entity';
import { RecordViewDto } from './dto/recordView.dto';

@Injectable()
export class ProductViewService {
  constructor(
    @InjectRepository(ProductView)
    private readonly productViewRepository: Repository<ProductView>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async recordView(viewData: RecordViewDto): Promise<ProductView> {
    const product = await this.productRepository.findOne({
      where: { id: viewData.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${viewData.productId} not found`,
      );
    }

    const productView = this.productViewRepository.create(viewData);
    return await this.productViewRepository.save(productView);
  }

  public async getRecentlyViewedByUser(
    userId: number,
    limit: number = 10,
  ): Promise<ProductView[]> {
    return await this.productViewRepository
      .createQueryBuilder('view')
      .leftJoinAndSelect('view.product', 'product')
      .where('view.userId = :userId', { userId })
      .orderBy('view.viewedAt', 'DESC')
      .distinctOn(['view.productId'])
      .take(limit)
      .getMany();
  }

  public async getProductViewCount(productId: number): Promise<number> {
    return await this.productViewRepository.count({
      where: { productId },
    });
  }

  public async getProductViewsInPeriod(
    productId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.productViewRepository
      .createQueryBuilder('view')
      .where('view.productId = :productId', { productId })
      .andWhere('view.viewedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getCount();
  }

  public async getTrendingProducts(
    hours: number = 24,
    limit: number = 10,
  ): Promise<{ product: Product; viewCount: number }[]> {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);

    const results = await this.productViewRepository
      .createQueryBuilder('view')
      .select('view.productId', 'productId')
      .addSelect('COUNT(view.id)', 'viewCount')
      .where('view.viewedAt > :startDate', { startDate })
      .groupBy('view.productId')
      .orderBy('"viewCount"', 'DESC')
      .limit(limit)
      .getRawMany();

    if (results.length === 0) {
      return [];
    }

    const productIds = results.map((r) => r.productId);
    const products = await this.productRepository
      .createQueryBuilder('product')
      .whereInIds(productIds)
      .getMany();

    return results.map((result) => ({
      product: products.find((p) => p.id === result.productId)!,
      viewCount: parseInt(result.viewCount),
    }));
  }

  public async getPopularProducts(
    limit: number = 10,
  ): Promise<{ product: Product; viewCount: number }[]> {
    const results = await this.productViewRepository
      .createQueryBuilder('view')
      .select('view.productId', 'productId')
      .addSelect('COUNT(view.id)', 'viewCount')
      .groupBy('view.productId')
      .orderBy('"viewCount"', 'DESC')
      .limit(limit)
      .getRawMany();

    if (results.length === 0) {
      return [];
    }

    const productIds = results.map((r) => r.productId);
    const products = await this.productRepository
      .createQueryBuilder('product')
      .whereInIds(productIds)
      .getMany();

    return results.map((result) => ({
      product: products.find((p) => p.id === result.productId)!,
      viewCount: parseInt(result.viewCount),
    }));
  }

  public async clearOldViews(daysToKeep: number = 90): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    await this.productViewRepository
      .createQueryBuilder()
      .delete()
      .where('viewedAt < :cutoffDate', { cutoffDate })
      .execute();
  }
}
