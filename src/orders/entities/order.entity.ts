import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../auth/entities/user.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

enum OrderStatus {
  pending = 'PENDING',
  confirmed = 'CONFIRMED',
  cancelled = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @ApiProperty({
    example: '041afad2-3bdb-4b4b-ac5f-f4f649752e21',
    description: 'Order unique identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '2026-09-11T14:30:00.000Z',
    description: 'Date and time when the order was created',
  })
  @Column({ type: 'timestamp' })
  orderDate: Date;

  @ApiProperty({ example: 2499.99, description: 'Total order amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @ApiProperty({ example: 'USD', description: 'ISO 4217 currency code' })
  @Column({ length: 3 })
  currency: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.pending })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.pending,
  })
  status: OrderStatus;

  @ApiProperty({
    example: '123 Main Street, Apartment 4',
    description: 'Address used for delivery',
  })
  @Column()
  shippingAddress: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}
