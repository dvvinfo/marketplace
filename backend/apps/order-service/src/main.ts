import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { OrderServiceModule } from './order-service.module';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderServiceModule,
    getRabbitMQConfig(RABBITMQ_QUEUES.ORDER_SERVICE),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  console.log('🛒 Order Service is listening on RabbitMQ');
}
bootstrap();
