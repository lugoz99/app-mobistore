import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

interface CartItem {
  name: string;
  quantity: number;
  unitAmount: number;
}

// 2. Interfaz principal para los parámetros de pago
interface PaymentParams {
  paymentId: string;
  orderId: string;
  currency: string;
  items: CartItem[]; // También se puede escribir como: Array<CartItem>
}

@Injectable()
export class StripeService {
  public readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      {
        maxNetworkRetries: 2, // red
        timeout: 15_000, // 15 s
        telemetry: false,
      },
    );
  }

  async createSessionCheckout(
    params: PaymentParams,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.stripe.checkout.sessions.create(
        {
          mode: 'payment',
          client_reference_id: '',
          customer_email: '',
          line_items: params.items.map((item) => ({
            quantity: item.quantity,
            price_data: {
              currency: params.currency,
              unit_amount: item.unitAmount,
              product_data: {
                name: item.name,
              },
            },
          })),
          metadata: { orderId: params.orderId, paymentId: params.paymentId },
          success_url:
            this.configService.getOrThrow<string>('STRIPE_SUCCESS_URL'),

          cancel_url:
            this.configService.getOrThrow<string>('STRIPE_CANCEL_URL'),
        },
        { idempotencyKey: `payment-${params.paymentId}` },
      );

      return session;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to create Stripe Checkout Session',
      );
    }
  }

  constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
    );
  }
}
