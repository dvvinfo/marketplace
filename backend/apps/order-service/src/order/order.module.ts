import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        ...getRabbitMQConfig(RABBITMQ_QUEUES.PRODUCT_SERVICE),
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
