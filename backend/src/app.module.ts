import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { TypeOrmModule } from '@db/typeorm.module';
import { UserModule } from '@modules/user/user.module';
import { ProductModule } from '@modules/product/product.module';
import { AuthModule } from '@modules/auth/auth.module';
import { OrderModule } from '@modules/order/order.module';
import { FavoriteModule } from '@modules/favorite/favorite.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    UserModule,
    ProductModule,
    AuthModule,
    OrderModule,
    FavoriteModule,
  ],
})
export class AppModule {}
