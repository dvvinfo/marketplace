import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateCartItemDto } from './dto/updateCartItem.dto';

@Injectable()
export class CartService {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientProxy,
  ) {}

  async getCartByUserId(userId: number) {
    const response = await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.GET_CART, userId),
    );
    return response.data;
  }

  async addToCart(addToCartDto: AddToCartDto) {
    const response = await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.ADD_TO_CART, addToCartDto),
    );
    return response.data;
  }

  async updateCartItem(cartItemId: number, updateDto: UpdateCartItemDto) {
    const response = await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.UPDATE_CART_ITEM, {
        itemId: cartItemId,
        data: updateDto,
      }),
    );
    return response.data;
  }

  async removeCartItem(cartItemId: number) {
    const response = await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.REMOVE_CART_ITEM, cartItemId),
    );
    return response.data;
  }

  async clearCart(userId: number): Promise<void> {
    await firstValueFrom(
      this.orderClient.send(RABBITMQ_PATTERNS.CLEAR_CART, userId),
    );
  }
}
