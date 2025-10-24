import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { ProductViewService } from './product-view.service';
import { RecordViewDto } from './dto/recordView.dto';

@Controller()
export class ProductViewController {
  constructor(private readonly productViewService: ProductViewService) {}

  @MessagePattern(RABBITMQ_PATTERNS.TRACK_PRODUCT_VIEW)
  async recordView(@Payload() viewData: RecordViewDto) {
    try {
      const view = await this.productViewService.recordView(viewData);
      return { success: true, data: view };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_RECENTLY_VIEWED)
  async getRecentlyViewed(@Payload() payload: { userId: number; limit?: number }) {
    try {
      const limit = payload.limit || 10;
      const views = await this.productViewService.getRecentlyViewedByUser(payload.userId, limit);
      return { success: true, data: views };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_PRODUCT_VIEW_COUNT)
  async getViewCount(@Payload() productId: number) {
    try {
      const count = await this.productViewService.getProductViewCount(productId);
      return { success: true, data: { productId, viewCount: count } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_TRENDING_PRODUCTS)
  async getTrending(@Payload() payload: { hours?: number; limit?: number }) {
    try {
      const hours = payload.hours || 24;
      const limit = payload.limit || 10;
      const products = await this.productViewService.getTrendingProducts(hours, limit);
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_POPULAR_PRODUCTS)
  async getPopular(@Payload() payload: { limit?: number }) {
    try {
      const limit = payload.limit || 10;
      const products = await this.productViewService.getPopularProducts(limit);
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
