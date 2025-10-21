import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '@modules/product/product.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  public async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  public async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  public async createOrder(orderData: CreateOrderDto): Promise<Order> {
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of orderData.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.title}. Available: ${product.stock}`,
        );
      }

      const price = product.discountPrice || product.price;
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      const orderItem = this.orderItemRepository.create({
        productId: item.productId,
        quantity: item.quantity,
        price,
        subtotal,
      });

      orderItems.push(orderItem);

      product.stock -= item.quantity;
      await this.productRepository.save(product);
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

  public async updateOrder(
    id: number,
    orderData: UpdateOrderDto,
  ): Promise<Order> {
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

  public async deleteOrder(id: number): Promise<void> {
    const order = await this.getOrderById(id);
    await this.orderRepository.remove(order);
  }
}
