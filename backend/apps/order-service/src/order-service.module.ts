import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cart/cart-item.entity';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USERNAME'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [Order, OrderItem, Cart, CartItem],
        synchronize: false,
      }),
    }),
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        ...getRabbitMQConfig(RABBITMQ_QUEUES.PRODUCT_SERVICE),
      },
    ]),
    OrderModule,
    CartModule,
  ],
})
export class OrderServiceModule {}
