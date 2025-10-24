import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { UserServiceModule } from './user-service.module';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    getRabbitMQConfig(RABBITMQ_QUEUES.USER_SERVICE),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  console.log('👤 User Service is listening on RabbitMQ');
}

void bootstrap();
