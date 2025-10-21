import { Transport, RmqOptions } from '@nestjs/microservices';

export const getRabbitMQConfig = (queue: string): RmqOptions => {
  const user = process.env.RABBITMQ_USER || 'marketplace';
  const password = process.env.RABBITMQ_PASSWORD || 'marketplace';
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || '5672';
  const vhost = process.env.RABBITMQ_VHOST || 'marketplace_vhost';

  return {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}:${port}/${vhost}`],
      queue,
      queueOptions: {
        durable: true,
      },
      noAck: false,
      prefetchCount: 1,
    },
  };
};
