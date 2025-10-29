import { Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/user.entity';
import { Product } from '@modules/product/product.entity';
import { Category } from '@modules/category/category.entity';
import { Order } from '@modules/order/order.entity';
import { OrderItem } from '@modules/order/order-item.entity';
import { Favorite } from '@modules/favorite/favorite.entity';
import { Cart } from '@modules/cart/cart.entity';
import { CartItem } from '@modules/cart/cart-item.entity';
import { Review } from '@modules/review/review.entity';
import { Address } from '@modules/address/address.entity';
import { PromoCode } from '@modules/promo-code/promo-code.entity';
import { ProductView } from '@modules/product-view/product-view.entity';

@Module({
  imports: [
    NestTypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        User,
        Product,
        Category,
        Order,
        OrderItem,
        Favorite,
        Cart,
        CartItem,
        Review,
        Address,
        PromoCode,
        ProductView,
      ],
      synchronize: true,
      // migrations: [ 'dist/db/migrations/**/*.js' ],
      // cli: { migrationsDir: 'src/db/migrations' },
    }),
  ],
})
export class TypeOrmModule {}
