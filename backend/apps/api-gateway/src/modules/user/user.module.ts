import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';
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
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
