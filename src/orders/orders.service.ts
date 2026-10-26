import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderWithDevicesDto } from './dto/create-order-with-devices.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../auth/entities/user.entity';
import { Device } from '../devices/entities';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async create(createOrderDto: CreateOrderWithDevicesDto, user: User) {
    const { currency, shippingAddress, orderItems } = createOrderDto;

    if (!orderItems?.length) {
      throw new BadRequestException('An order must contain at least one item');
    }

    const deviceIds = orderItems.map((item) => item.deviceId);
    const uniqueDeviceIds = [...new Set(deviceIds)];
    const devices = await this.deviceRepository.findBy({
      id: In(uniqueDeviceIds),
    });

    // [[1, { id: 1, name: 'iPhone', price: 999, ... }],]
    const devicesById = new Map(
      devices.map((device) => [device.id, device]),
    );
    const missingIds = uniqueDeviceIds.filter(
      (id) => !devicesById.has(id),
    );

    if (missingIds.length > 0) {
      throw new BadRequestException(
        `Some devices don't exist: ${missingIds.join(', ')}`,
      );
    }

    const totalAmount = orderItems.reduce((total, item) => {
      const device = devicesById.get(item.deviceId)!// trust me;
      return total + item.quantity * device.price;
    }, 0);

    const order = this.orderRepository.create({
      currency,
      shippingAddress,
      user,
      totalAmount,
      status: OrderStatus.PENDING_PAYMENT,
    });

    const savedOrder = await this.orderRepository.save(order);
    const items = orderItems.map((item) => {
      const device = devicesById.get(item.deviceId);

      if (!device) {
        throw new BadRequestException(
          `Device ${item.deviceId} was not found`,
        );
      }

      return this.orderItemRepository.create({
        order: savedOrder,
        device,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        unitPrice: device.price,
      });
    });

    const savedItems = await this.orderItemRepository.save(items);

    return {
      ...savedOrder,
      orderItems: savedItems,
    };
  }

  async findPendingOrder(orderId: string) {
    const orderPending = await this.orderRepository.findOne({
      where: {
        id: orderId,
        status: OrderStatus.PENDING_PAYMENT,
      },
      relations: {
        orderItems: true,
      },
    });

    if (!orderPending)
      throw new NotFoundException(`Order with ${orderId} doesn't exist`);

    return orderPending;
  }

  // TODO : 
  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
