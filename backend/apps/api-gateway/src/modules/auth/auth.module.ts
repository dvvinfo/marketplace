import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRabbitMQConfig, RABBITMQ_QUEUES } from '@app/shared';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...getRabbitMQConfig(RABBITMQ_QUEUES.USER_SERVICE),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
