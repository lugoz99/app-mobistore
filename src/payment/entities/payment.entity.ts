import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

enum PaymentStatus {
  pending = 'PENDING',
  succeded = 'SUCCEEDED',
  failed = 'FAILED',
  cancelled = 'CANCELED',
  refunded = 'REFUNDED',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentMethod: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ unique: true })
  stripePaymentIntentId: string;

  @Column({ nullable: true })
  stripeChargeId: string;

  @Column({ length: 3 })
  currency: string;

  @Column({ default: 1 })
  attemptNumber: number;

  @Column({ nullable: true })
  failureCode: string;

  @Column({ nullable: true })
  failureMessage: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;
}
