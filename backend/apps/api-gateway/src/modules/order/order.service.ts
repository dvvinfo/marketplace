import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientProxy,
  ) {}

  async getAllOrders() {
    const response = await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.GET_ALL_ORDERS, {}),
    );
    return response.data;
  }

  async getOrderById(id: number) {
    const response = await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.GET_ORDER, id),
    );
    return response.data;
  }

  async getOrdersByUserId(userId: number) {
    const response = await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.GET_USER_ORDERS, userId),
    );
    return response.data;
  }

  async createOrder(orderData: CreateOrderDto) {
    const response = await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.CREATE_ORDER, orderData),
    );
    return response.data;
  }

  async updateOrder(id: number, orderData: UpdateOrderDto) {
    const response = await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.UPDATE_ORDER, {
        id,
        data: orderData,
      }),
    );
    return response.data;
  }

  async deleteOrder(id: number): Promise<void> {
    await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.DELETE_ORDER, id),
    );
  }
}
