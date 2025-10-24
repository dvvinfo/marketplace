import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cart_id', type: 'int' })
  cartId: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    name: 'subtotal',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  subtotal: number;
}
