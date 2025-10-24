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
import { RABBITMQ_PATTERNS } from '@app/shared';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  async getCartByUserId(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [], totalAmount: 0 });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(addToCartDto: AddToCartDto): Promise<Cart> {
    const { userId, productId, quantity } = addToCartDto;

    const productResponse = await firstValueFrom(
      this.productClient.send(RABBITMQ_PATTERNS.GET_PRODUCT, productId),
    );

    if (!productResponse.success || !productResponse.data) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const product = productResponse.data;

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product ${product.title}. Available: ${product.stock}`,
      );
    }

    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [], totalAmount: 0 });
      cart = await this.cartRepository.save(cart);
    }

    const existingItem = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId },
    });

    const price = product.discountPrice || product.price;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        throw new BadRequestException(
          `Cannot add ${quantity} more. Max available: ${product.stock - existingItem.quantity}`,
        );
      }

      existingItem.quantity = newQuantity;
      existingItem.subtotal = price * newQuantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        quantity,
        price,
        subtotal: price * quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return await this.recalculateCart(cart.id);
  }

  async updateCartItem(
    cartItemId: number,
    updateDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    const productResponse = await firstValueFrom(
      this.productClient.send(
        RABBITMQ_PATTERNS.GET_PRODUCT,
        cartItem.productId,
      ),
    );

    if (!productResponse.success || !productResponse.data) {
      throw new NotFoundException(`Product not found`);
    }

    const product = productResponse.data;

    if (product.stock < updateDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}`,
      );
    }

    cartItem.quantity = updateDto.quantity;
    cartItem.subtotal = cartItem.price * updateDto.quantity;
    await this.cartItemRepository.save(cartItem);

    return await this.recalculateCart(cartItem.cartId);
  }

  async removeCartItem(cartItemId: number): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    const cartId = cartItem.cartId;
    await this.cartItemRepository.remove(cartItem);

    return await this.recalculateCart(cartId);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart not found for user ${userId}`);
    }

    await this.cartItemRepository.remove(cart.items);
    cart.totalAmount = 0;
    await this.cartRepository.save(cart);
  }

  private async recalculateCart(cartId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    );

    await this.cartRepository.save(cart);
    return cart;
  }
}
