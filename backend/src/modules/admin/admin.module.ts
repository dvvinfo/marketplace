import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@modules/user/user.entity';
import { Product } from '@modules/product/product.entity';
import { Order } from '@modules/order/order.entity';
import { Review } from '@modules/review/review.entity';
import { PromoCode } from '@modules/promo-code/promo-code.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product, Order, Review, PromoCode]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
