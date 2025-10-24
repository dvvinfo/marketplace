import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        ...getRabbitMQConfig(RABBITMQ_QUEUES.PRODUCT_SERVICE),
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
