import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';

import { User, UserRole } from '@modules/user/user.entity';
import { Product } from '@modules/product/product.entity';
import { Order } from '@modules/order/order.entity';
import { Review } from '@modules/review/review.entity';
import { PromoCode } from '@modules/promo-code/promo-code.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(PromoCode)
    private readonly promoCodeRepository: Repository<PromoCode>,
  ) {}

  public async getDashboardStats(): Promise<{
    users: { total: number; admins: number; regular: number };
    products: { total: number; inStock: number; outOfStock: number };
    orders: {
      total: number;
      pending: number;
      processing: number;
      completed: number;
    };
    revenue: { total: number; thisMonth: number };
    reviews: { total: number; averageRating: number };
  }> {
    const totalUsers = await this.userRepository.count();
    const adminUsers = await this.userRepository.count({
      where: { role: UserRole.ADMIN },
    });

    const totalProducts = await this.productRepository.count();
    const inStockProducts = await this.productRepository
      .createQueryBuilder('product')
      .where('product.stock > 0')
      .getCount();

    const totalOrders = await this.orderRepository.count();
    const pendingOrders = await this.orderRepository.count({
      where: { status: 'pending' as any },
    });
    const processingOrders = await this.orderRepository.count({
      where: { status: 'processing' as any },
    });
    const completedOrders = await this.orderRepository.count({
      where: { status: 'delivered' as any },
    });

    const ordersForRevenue = await this.orderRepository.find();
    const totalRevenue = ordersForRevenue.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const monthOrders = await this.orderRepository.find({
      where: { createdAt: MoreThan(firstDayOfMonth) },
    });
    const monthRevenue = monthOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    const totalReviews = await this.reviewRepository.count();
    const reviews = await this.reviewRepository.find();
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      users: {
        total: totalUsers,
        admins: adminUsers,
        regular: totalUsers - adminUsers,
      },
      products: {
        total: totalProducts,
        inStock: inStockProducts,
        outOfStock: totalProducts - inStockProducts,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
      },
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        thisMonth: Math.round(monthRevenue * 100) / 100,
      },
      reviews: {
        total: totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    };
  }

  public async updateUserRole(
    userId: number,
    role: UserRole,
  ): Promise<{ success: boolean; message: string }> {
    await this.userRepository.update({ id: userId }, { role });
    return {
      success: true,
      message: `User role updated to ${role}`,
    };
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'nameFirst', 'nameLast', 'role'],
      order: { id: 'ASC' },
    });
  }

  public async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  public async getActivePromoCodes(): Promise<PromoCode[]> {
    const now = new Date();
    return await this.promoCodeRepository
      .createQueryBuilder('promo')
      .where('promo.isActive = :isActive', { isActive: true })
      .andWhere('promo.validFrom <= :now', { now })
      .andWhere('promo.validUntil >= :now', { now })
      .getMany();
  }

  public async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.stock <= :threshold', { threshold })
      .andWhere('product.stock > 0')
      .orderBy('product.stock', 'ASC')
      .getMany();
  }
}
