import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(RABBITMQ_PATTERNS.GET_ALL_ORDERS)
  async getAllOrders() {
    try {
      const orders = await this.orderService.getAllOrders();
      return { success: true, data: orders };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_ORDER)
  async getOrder(@Payload() id: number) {
    try {
      const order = await this.orderService.getOrderById(id);
      return { success: true, data: order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.GET_USER_ORDERS)
  async getUserOrders(@Payload() userId: number) {
    try {
      const orders = await this.orderService.getOrdersByUserId(userId);
      return { success: true, data: orders };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.CREATE_ORDER)
  async createOrder(@Payload() orderData: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(orderData);
      return { success: true, data: order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.UPDATE_ORDER)
  async updateOrder(@Payload() payload: { id: number; data: UpdateOrderDto }) {
    try {
      const order = await this.orderService.updateOrder(
        payload.id,
        payload.data,
      );
      return { success: true, data: order };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.DELETE_ORDER)
  async deleteOrder(@Payload() id: number) {
    try {
      await this.orderService.deleteOrder(id);
      return { success: true, message: 'Order deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
