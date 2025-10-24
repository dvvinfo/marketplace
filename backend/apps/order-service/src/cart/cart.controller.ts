import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RABBITMQ_PATTERNS } from '@app/shared';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern(RABBITMQ_PATTERNS.GET_CART)
  async getCart(@Payload() userId: number) {
    try {
      const cart = await this.cartService.getCartByUserId(userId);
      return { success: true, data: cart };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.ADD_TO_CART)
  async addToCart(@Payload() addToCartDto: AddToCartDto) {
    try {
      const cart = await this.cartService.addToCart(addToCartDto);
      return { success: true, data: cart };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.UPDATE_CART_ITEM)
  async updateCartItem(
    @Payload() payload: { itemId: number; data: UpdateCartItemDto },
  ) {
    try {
      const cart = await this.cartService.updateCartItem(
        payload.itemId,
        payload.data,
      );
      return { success: true, data: cart };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.REMOVE_CART_ITEM)
  async removeCartItem(@Payload() itemId: number) {
    try {
      const cart = await this.cartService.removeCartItem(itemId);
      return { success: true, data: cart };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern(RABBITMQ_PATTERNS.CLEAR_CART)
  async clearCart(@Payload() userId: number) {
    try {
      await this.cartService.clearCart(userId);
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
