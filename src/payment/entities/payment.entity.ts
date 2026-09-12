import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: '7d4f6b7e-5e62-4f6d-8c9d-2f9e5d1b4c12',
    description: 'Payment unique identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'card', description: 'Payment method used' })
  @Column()
  paymentMethod: string;

  @ApiProperty({
    example: '2026-09-11T14:35:00.000Z',
    description: 'Date when the payment was confirmed',
    required: false,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  paymentDate: Date;

  @ApiProperty({
    example: 2499.99,
    description: 'Amount of this payment attempt',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.pending })
  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ example: 'pi_3NExamplePaymentIntent' })
  @Column({ unique: true })
  stripePaymentIntentId: string;

  @ApiProperty({
    example: 'ch_3NExampleCharge',
    required: false,
    nullable: true,
  })
  @Column({ nullable: true })
  stripeChargeId: string;

  @ApiProperty({ example: 'USD', description: 'ISO 4217 currency code' })
  @Column({ length: 3 })
  currency: string;

  @ApiProperty({ example: 1, description: 'Payment attempt number' })
  @Column({ default: 1 })
  attemptNumber: number;

  @ApiProperty({ example: 'card_declined', required: false, nullable: true })
  @Column({ nullable: true })
  failureCode: string;

  @ApiProperty({
    example: 'The card was declined.',
    required: false,
    nullable: true,
  })
  @Column({ nullable: true })
  failureMessage: string;

  @ApiProperty({
    example: '2026-09-11T14:30:00.000Z',
    description: 'Date when the payment record was created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.payments)
  order: Order;
}
