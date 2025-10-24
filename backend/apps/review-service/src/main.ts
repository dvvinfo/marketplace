import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ReviewServiceModule } from './review-service.module';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ReviewServiceModule,
    getRabbitMQConfig(RABBITMQ_QUEUES.REVIEW_SERVICE),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  console.log('⭐ Review Service is listening on RabbitMQ');
}
bootstrap();
