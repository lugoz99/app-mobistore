import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Endpoint que utiliza nuestro frontend
   * para iniciar el proceso de pago.
   *
   * POST /payments/:orderId/checkout
   */
  @Post(':orderId/checkout')
  async createCheckout(@Param('orderId') orderId: string) {
    return this.paymentService.createCheckout(orderId);
  }
}
