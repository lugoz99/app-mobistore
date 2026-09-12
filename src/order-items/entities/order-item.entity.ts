import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Device } from '../../devices/entities/device.entity';

@Entity('orderItems')
export class OrderItem {
  @ApiProperty({
    example: '7d4f6b7e-5e62-4f6d-8c9d-2f9e5d1b4c12',
    description: 'Order item unique identifier',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 2, description: 'Number of devices bought' })
  @Column('int')
  quantity: number;

  @ApiProperty({
    example: 2499.99,
    description: 'Device price saved when the order was created',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @ApiProperty({
    example: 'Black',
    description: 'Color selected by the customer',
  })
  @Column('text')
  selectedColor: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Device, (device) => device.orderItems, {
    onDelete: 'CASCADE',
  })
  device: Device;
}
