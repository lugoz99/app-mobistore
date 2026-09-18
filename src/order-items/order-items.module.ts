import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { OrdersModule } from '../orders/orders.module';
import { DevicesModule } from '../devices/devices.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [OrderItemsController],
  providers: [OrderItemsService],
  imports: [OrdersModule, DevicesModule],
  exports: [TypeOrmModule],
})
export class OrderItemsModule {}
