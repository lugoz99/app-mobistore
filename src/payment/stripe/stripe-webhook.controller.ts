import { Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { PaymentService } from '../payment.service';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Endpoint que Stripe llama automáticamente.
   *
   * POST /stripe/webhook
   */
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req()
    request: Request & {
      rawBody: Buffer;
    },
    @Headers('stripe-signature')
    signature: string,
  ) {
    const event = this.stripeService.constructWebhookEvent(
      request.rawBody,
      signature,
    );

    await this.paymentService.processStripeEvent(event);

    return {
      received: true,
    };
  }
}
