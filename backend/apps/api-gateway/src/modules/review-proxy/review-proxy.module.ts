import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ReviewProxyController } from './review-proxy.controller';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REVIEW_SERVICE',
        ...getRabbitMQConfig(RABBITMQ_QUEUES.REVIEW_SERVICE),
      },
    ]),
  ],
  controllers: [ReviewProxyController],
})
export class ReviewProxyModule {}
