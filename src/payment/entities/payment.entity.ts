import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Order } from '../../orders/entities/order.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({
    length: 3,
  })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    nullable: true,
    unique: true,
  })
  stripeSessionId: string | null;

  @Column({
    nullable: true,
    unique: true,
  })
  stripePaymentIntentId: string | null;

  @Column({
    nullable: true,
  })
  failureCode: string | null;

  @Column({
    nullable: true,
  })
  failureMessage: string | null;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  paidAt: Date | null;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;
}
