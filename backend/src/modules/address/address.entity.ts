import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@modules/user/user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'full_name', type: 'varchar' })
  fullName: string;

  @Column({ name: 'phone', type: 'varchar' })
  phone: string;

  @Column({ name: 'country', type: 'varchar' })
  country: string;

  @Column({ name: 'city', type: 'varchar' })
  city: string;

  @Column({ name: 'state', type: 'varchar', nullable: true })
  state: string | null;

  @Column({ name: 'postal_code', type: 'varchar' })
  postalCode: string;

  @Column({ name: 'address_line1', type: 'varchar' })
  addressLine1: string;

  @Column({ name: 'address_line2', type: 'varchar', nullable: true })
  addressLine2: string | null;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
