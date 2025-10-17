import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { TypeOrmModule } from '@db/typeorm.module';
import { UserModule } from '@modules/user/user.module';
import { ProductModule } from '@modules/product/product.module';
import { AuthModule } from '@modules/auth/auth.module';
import { OrderModule } from '@modules/order/order.module';
import { FavoriteModule } from '@modules/favorite/favorite.module';
import { CartModule } from '@modules/cart/cart.module';
import { ReviewModule } from '@modules/review/review.module';
import { CategoryModule } from '@modules/category/category.module';
import { AddressModule } from '@modules/address/address.module';
import { PromoCodeModule } from '@modules/promo-code/promo-code.module';
import { ProductViewModule } from '@modules/product-view/product-view.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    UserModule,
    ProductModule,
    AuthModule,
    OrderModule,
    FavoriteModule,
    CartModule,
    ReviewModule,
    CategoryModule,
    AddressModule,
    PromoCodeModule,
    ProductViewModule,
  ],
})
export class AppModule {}
