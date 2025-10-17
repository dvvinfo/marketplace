import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductView } from './product-view.entity';
import { Product } from '@modules/product/product.entity';
import { ProductViewController } from './product-view.controller';
import { ProductViewService } from './product-view.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductView, Product])],
  controllers: [ProductViewController],
  providers: [ProductViewService],
  exports: [ProductViewService],
})
export class ProductViewModule {}
