import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { PromoServiceModule } from './promo-service.module';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PromoServiceModule,
    getRabbitMQConfig(RABBITMQ_QUEUES.PROMO_CODE_SERVICE),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  console.log('🎫 Promo Code Service is listening on RabbitMQ');
}
bootstrap();
