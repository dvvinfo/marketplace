import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { AnalyticsService } from './analytics.service';
import { DateRangeDto } from './dto/dateRange.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/overview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get sales overview statistics' })
  @ApiQuery({ name: 'startDate', required: false, example: '2025-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2025-12-31' })
  async getSalesOverview(@Query() dateRange: DateRangeDto) {
    const startDate = dateRange.startDate
      ? new Date(dateRange.startDate)
      : undefined;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : undefined;

    return await this.analyticsService.getSalesOverview(startDate, endDate);
  }

  @Get('/top-selling-products')
  @HttpCode(HttpStatus.OK)
  async getTopSellingProducts(
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query() dateRange: DateRangeDto,
  ) {
    const startDate = dateRange.startDate
      ? new Date(dateRange.startDate)
      : undefined;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : undefined;

    return await this.analyticsService.getTopSellingProducts(
      limit,
      startDate,
      endDate,
    );
  }

  @Get('/sales-by-category')
  @HttpCode(HttpStatus.OK)
  async getSalesByCategory(@Query() dateRange: DateRangeDto) {
    const startDate = dateRange.startDate
      ? new Date(dateRange.startDate)
      : undefined;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : undefined;

    return await this.analyticsService.getSalesByCategory(startDate, endDate);
  }

  @Get('/revenue-by-period')
  @HttpCode(HttpStatus.OK)
  async getRevenueByPeriod(
    @Query('period') period: 'day' | 'week' | 'month' = 'day',
    @Query() dateRange: DateRangeDto,
  ) {
    const startDate = dateRange.startDate
      ? new Date(dateRange.startDate)
      : undefined;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : undefined;

    return await this.analyticsService.getRevenueByPeriod(
      period,
      startDate,
      endDate,
    );
  }

  @Get('/customer-lifetime-value')
  @HttpCode(HttpStatus.OK)
  async getCustomerLifetimeValue(
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.analyticsService.getCustomerLifetimeValue(limit);
  }

  @Get('/order-status-distribution')
  @HttpCode(HttpStatus.OK)
  async getOrderStatusDistribution() {
    return await this.analyticsService.getOrderStatusDistribution();
  }

  @Get('/revenue-growth')
  @HttpCode(HttpStatus.OK)
  async getRevenueGrowth(
    @Query('period') period: 'day' | 'week' | 'month' = 'month',
  ) {
    return await this.analyticsService.getRevenueGrowth(period);
  }
}
