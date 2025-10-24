import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        ...getRabbitMQConfig(RABBITMQ_QUEUES.PRODUCT_SERVICE),
      },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
