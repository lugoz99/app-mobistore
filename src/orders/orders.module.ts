import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Device } from '../devices/entities/device.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Order, OrderItem, Device]),
  ],
  exports: [TypeOrmModule, OrdersService],
})
export class OrdersModule {}
