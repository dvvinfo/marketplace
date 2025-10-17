import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.getOrderById(id);
  }

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getOrdersByUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.orderService.getOrdersByUserId(userId);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() body: CreateOrderDto) {
    return await this.orderService.createOrder(body);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderDto,
  ) {
    return await this.orderService.updateOrder(id, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    await this.orderService.deleteOrder(id);
  }
}
