import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [AuthModule],
  exports:[TypeOrmModule,]
})
export class OrdersModule {}
