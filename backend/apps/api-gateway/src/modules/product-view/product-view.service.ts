import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { RecordViewDto } from './dto/recordView.dto';

@Injectable()
export class ProductViewService {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  public async recordView(viewData: RecordViewDto) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.TRACK_PRODUCT_VIEW, viewData),
    );
    return response.data;
  }

  public async getRecentlyViewedByUser(userId: number, limit: number = 10) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_RECENTLY_VIEWED, {
        userId,
        limit,
      }),
    );
    return response.data;
  }

  public async getProductViewCount(productId: number) {
    const response = await firstValueFrom(
      this.productClient.send(
        RABBITMQ_PATTERNS.GET_PRODUCT_VIEW_COUNT,
        productId,
      ),
    );
    return response.data.viewCount;
  }

  public async getTrendingProducts(hours: number = 24, limit: number = 10) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_TRENDING_PRODUCTS, {
        hours,
        limit,
      }),
    );
    return response.data;
  }

  public async getPopularProducts(limit: number = 10) {
    const response = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_POPULAR_PRODUCTS, {
        limit,
      }),
    );
    return response.data;
  }
}
