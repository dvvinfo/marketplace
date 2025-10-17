import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '@modules/product/product.entity';
import { User } from '@modules/user/user.entity';
import { AddToCartDto } from './dto/addToCart.dto';
import { UpdateCartItemDto } from './dto/updateCartItem.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getCartByUserId(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      cart = this.cartRepository.create({ userId, items: [], totalAmount: 0 });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  public async addToCart(addToCartDto: AddToCartDto): Promise<Cart> {
    const { userId, productId, quantity } = addToCartDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

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
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

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

  public async updateCartItem(
    cartItemId: number,
    updateDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    if (cartItem.product.stock < updateDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${cartItem.product.stock}`,
      );
    }

    cartItem.quantity = updateDto.quantity;
    cartItem.subtotal = cartItem.price * updateDto.quantity;
    await this.cartItemRepository.save(cartItem);

    return await this.recalculateCart(cartItem.cartId);
  }

  public async removeCartItem(cartItemId: number): Promise<Cart> {
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

  public async clearCart(userId: number): Promise<void> {
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
      relations: ['items', 'items.product'],
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
