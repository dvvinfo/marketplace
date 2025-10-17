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

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateCartItemDto } from './dto/updateCartItem.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getCart(@Param('userId', ParseIntPipe) userId: number) {
    return await this.cartService.getCartByUserId(userId);
  }

  @Post('/add')
  @HttpCode(HttpStatus.OK)
  async addToCart(@Body() body: AddToCartDto) {
    return await this.cartService.addToCart(body);
  }

  @Put('/item/:itemId')
  @HttpCode(HttpStatus.OK)
  async updateCartItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() body: UpdateCartItemDto,
  ) {
    return await this.cartService.updateCartItem(itemId, body);
  }

  @Delete('/item/:itemId')
  @HttpCode(HttpStatus.OK)
  async removeCartItem(@Param('itemId', ParseIntPipe) itemId: number) {
    return await this.cartService.removeCartItem(itemId);
  }

  @Delete('/user/:userId/clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCart(@Param('userId', ParseIntPipe) userId: number) {
    await this.cartService.clearCart(userId);
  }
}
