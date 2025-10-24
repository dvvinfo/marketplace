import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ProductServiceModule } from './product-service.module';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductServiceModule,
    getRabbitMQConfig(RABBITMQ_QUEUES.PRODUCT_SERVICE),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  console.log('🛍️ Product Service is listening on RabbitMQ');
}
bootstrap();
