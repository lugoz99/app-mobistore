import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrdersModule } from '../orders/orders.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookService, StripeService } from './stripe';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, WebhookService],
  imports: [OrdersModule, AuthModule, ConfigModule],
  exports: [TypeOrmModule],
})
export class PaymentModule {}
