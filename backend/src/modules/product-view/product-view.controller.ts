import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ProductViewService } from './product-view.service';
import { RecordViewDto } from './dto/recordView.dto';

@Controller('product-views')
export class ProductViewController {
  constructor(private readonly productViewService: ProductViewService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async recordView(@Body() body: RecordViewDto) {
    return await this.productViewService.recordView(body);
  }

  @Get('/user/:userId/recent')
  @HttpCode(HttpStatus.OK)
  async getRecentlyViewed(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.productViewService.getRecentlyViewedByUser(userId, limit);
  }

  @Get('/product/:productId/count')
  @HttpCode(HttpStatus.OK)
  async getViewCount(@Param('productId', ParseIntPipe) productId: number) {
    const count = await this.productViewService.getProductViewCount(productId);
    return { productId, viewCount: count };
  }

  @Get('/trending')
  @HttpCode(HttpStatus.OK)
  async getTrending(
    @Query('hours', ParseIntPipe) hours: number = 24,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.productViewService.getTrendingProducts(hours, limit);
  }

  @Get('/popular')
  @HttpCode(HttpStatus.OK)
  async getPopular(@Query('limit', ParseIntPipe) limit: number = 10) {
    return await this.productViewService.getPopularProducts(limit);
  }
}
