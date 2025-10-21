import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PromoCodeController } from './promo-code.controller';
import { PromoCodeService } from './promo-code.service';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PROMO_SERVICE',
        ...getRabbitMQConfig(RABBITMQ_QUEUES.PROMO_CODE_SERVICE),
      },
    ]),
  ],
  controllers: [PromoCodeController],
  providers: [PromoCodeService],
  exports: [PromoCodeService],
})
export class PromoCodeModule {}
