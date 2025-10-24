import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  RABBITMQ_PATTERNS,
  ServiceResponse,
  ProductResponse,
} from '@app/shared';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of orderData.items) {
      const productResponse = await firstValueFrom(
        this.productClient.send<ServiceResponse<ProductResponse>>(
          RABBITMQ_PATTERNS.GET_PRODUCT,
          item.productId,
        ),
      );

      if (!productResponse.success || !productResponse.data) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      const product = productResponse.data;

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.title}. Available: ${product.stock}`,
        );
      }

      const price =
        product.discountPrice !== null ? product.discountPrice : product.price;
      const subtotal = Number(price) * item.quantity;
      totalAmount += subtotal;

      const orderItem = this.orderItemRepository.create({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(price),
        subtotal: Number(subtotal),
      });

      orderItems.push(orderItem);

      await firstValueFrom(
        this.productClient.send(RABBITMQ_PATTERNS.UPDATE_STOCK, {
          id: item.productId,
          quantity: product.stock - item.quantity,
        }),
      );
    }

    const order = this.orderRepository.create({
      userId: orderData.userId,
      items: orderItems,
      totalAmount,
      shippingAddress: orderData.shippingAddress,
      phone: orderData.phone,
      notes: orderData.notes,
    });

    return await this.orderRepository.save(order);
  }

  async updateOrder(id: number, orderData: UpdateOrderDto): Promise<Order> {
    const order = await this.getOrderById(id);

    if (orderData.status) {
      order.status = orderData.status;
    }

    if (orderData.shippingAddress) {
      order.shippingAddress = orderData.shippingAddress;
    }

    if (orderData.phone) {
      order.phone = orderData.phone;
    }

    if (orderData.notes !== undefined) {
      order.notes = orderData.notes;
    }

    return await this.orderRepository.save(order);
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.getOrderById(id);
    await this.orderRepository.remove(order);
  }
}
