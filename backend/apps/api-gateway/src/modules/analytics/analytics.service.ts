import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Order } from '@modules/order/order.entity';
import { OrderItem } from '@modules/order/order-item.entity';
import { Product } from '@modules/product/product.entity';
import { User } from '@modules/user/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getSalesOverview(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalProducts: number;
    totalCustomers: number;
  }> {
    const whereCondition = this.buildDateFilter(startDate, endDate);

    const orders = await this.orderRepository.find({
      where: whereCondition,
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const totalProducts = await this.productRepository.count();
    const totalCustomers = await this.userRepository.count();

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      totalProducts,
      totalCustomers,
    };
  }

  public async getTopSellingProducts(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date,
  ): Promise<
    Array<{
      product: Product;
      totalSold: number;
      totalRevenue: number;
    }>
  > {
    const query = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('orderItem.product', 'product')
      .select('orderItem.productId', 'productId')
      .addSelect('SUM(orderItem.quantity)', 'totalSold')
      .addSelect('SUM(orderItem.price * orderItem.quantity)', 'totalRevenue')
      .groupBy('orderItem.productId');

    if (startDate && endDate) {
      query.where('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const results = await query
      .orderBy('"totalRevenue"', 'DESC')
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
      totalSold: parseInt(result.totalSold),
      totalRevenue: Math.round(parseFloat(result.totalRevenue) * 100) / 100,
    }));
  }

  public async getSalesByCategory(
    startDate?: Date,
    endDate?: Date,
  ): Promise<
    Array<{
      categoryId: number;
      categoryName: string;
      totalRevenue: number;
      totalOrders: number;
    }>
  > {
    const query = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('orderItem.product', 'product')
      .leftJoin('product.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('SUM(orderItem.price * orderItem.quantity)', 'totalRevenue')
      .addSelect('COUNT(DISTINCT order.id)', 'totalOrders')
      .where('category.id IS NOT NULL')
      .groupBy('category.id')
      .addGroupBy('category.name');

    if (startDate && endDate) {
      query.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const results = await query.orderBy('"totalRevenue"', 'DESC').getRawMany();

    return results.map((result) => ({
      categoryId: result.categoryId,
      categoryName: result.categoryName,
      totalRevenue: Math.round(parseFloat(result.totalRevenue) * 100) / 100,
      totalOrders: parseInt(result.totalOrders),
    }));
  }

  public async getRevenueByPeriod(
    period: 'day' | 'week' | 'month' = 'day',
    startDate?: Date,
    endDate?: Date,
  ): Promise<
    Array<{
      date: string;
      revenue: number;
      orders: number;
    }>
  > {
    const dateFormat =
      period === 'day'
        ? 'YYYY-MM-DD'
        : period === 'week'
          ? 'YYYY-IW'
          : 'YYYY-MM';

    const query = this.orderRepository
      .createQueryBuilder('order')
      .select(`TO_CHAR(order.createdAt, '${dateFormat}')`, 'date')
      .addSelect('SUM(order.totalAmount)', 'revenue')
      .addSelect('COUNT(order.id)', 'orders')
      .groupBy('date')
      .orderBy('date', 'ASC');

    if (startDate && endDate) {
      query.where('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const results = await query.getRawMany();

    return results.map((result) => ({
      date: result.date,
      revenue: Math.round(parseFloat(result.revenue) * 100) / 100,
      orders: parseInt(result.orders),
    }));
  }

  public async getCustomerLifetimeValue(limit: number = 10): Promise<
    Array<{
      userId: number;
      userEmail: string;
      totalSpent: number;
      orderCount: number;
      averageOrderValue: number;
    }>
  > {
    const results = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.user', 'user')
      .select('user.id', 'userId')
      .addSelect('user.email', 'userEmail')
      .addSelect('SUM(order.totalAmount)', 'totalSpent')
      .addSelect('COUNT(order.id)', 'orderCount')
      .addSelect('AVG(order.totalAmount)', 'averageOrderValue')
      .groupBy('user.id')
      .addGroupBy('user.email')
      .orderBy('"totalSpent"', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map((result) => ({
      userId: result.userId,
      userEmail: result.userEmail,
      totalSpent: Math.round(parseFloat(result.totalSpent) * 100) / 100,
      orderCount: parseInt(result.orderCount),
      averageOrderValue:
        Math.round(parseFloat(result.averageOrderValue) * 100) / 100,
    }));
  }

  public async getOrderStatusDistribution(): Promise<
    Array<{
      status: string;
      count: number;
      percentage: number;
    }>
  > {
    const totalOrders = await this.orderRepository.count();

    const results = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .getRawMany();

    return results.map((result) => ({
      status: result.status,
      count: parseInt(result.count),
      percentage:
        totalOrders > 0
          ? Math.round((parseInt(result.count) / totalOrders) * 10000) / 100
          : 0,
    }));
  }

  public async getRevenueGrowth(
    period: 'day' | 'week' | 'month' = 'month',
  ): Promise<{
    currentPeriod: number;
    previousPeriod: number;
    growthRate: number;
    growthAmount: number;
  }> {
    const now = new Date();
    let currentStart: Date;
    let currentEnd: Date;
    let previousStart: Date;
    let previousEnd: Date;

    if (period === 'day') {
      currentStart = new Date(now.setHours(0, 0, 0, 0));
      currentEnd = new Date(now.setHours(23, 59, 59, 999));
      previousStart = new Date(currentStart);
      previousStart.setDate(previousStart.getDate() - 1);
      previousEnd = new Date(previousStart);
      previousEnd.setHours(23, 59, 59, 999);
    } else if (period === 'week') {
      const dayOfWeek = now.getDay();
      currentStart = new Date(now);
      currentStart.setDate(now.getDate() - dayOfWeek);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = new Date();
      previousStart = new Date(currentStart);
      previousStart.setDate(previousStart.getDate() - 7);
      previousEnd = new Date(currentStart);
      previousEnd.setSeconds(previousEnd.getSeconds() - 1);
    } else {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentEnd = new Date();
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    }

    const currentOrders = await this.orderRepository.find({
      where: {
        createdAt: Between(currentStart, currentEnd),
      },
    });

    const previousOrders = await this.orderRepository.find({
      where: {
        createdAt: Between(previousStart, previousEnd),
      },
    });

    const currentRevenue = currentOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );
    const previousRevenue = previousOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    const growthAmount = currentRevenue - previousRevenue;
    const growthRate =
      previousRevenue > 0 ? (growthAmount / previousRevenue) * 100 : 0;

    return {
      currentPeriod: Math.round(currentRevenue * 100) / 100,
      previousPeriod: Math.round(previousRevenue * 100) / 100,
      growthRate: Math.round(growthRate * 100) / 100,
      growthAmount: Math.round(growthAmount * 100) / 100,
    };
  }

  private buildDateFilter(startDate?: Date, endDate?: Date): any {
    if (startDate && endDate) {
      return { createdAt: Between(startDate, endDate) };
    }
    return {};
  }
}
