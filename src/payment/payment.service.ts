import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { StripeService } from './stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { OrdersService } from '../orders/orders.service';
import Stripe from 'stripe';
import { Order, OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly OrderService: OrdersService,
    private readonly dataSource: DataSource,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  /**
   * Crea un Checkout Session de Stripe para una orden.
   *
   * Flujo:
   * 1. Buscar la orden.
   * 2. Verificar que pueda ser pagada.
   * 3. Crear Payment en estado PENDING.
   * 4. Crear Checkout Session en Stripe.
   * 5. Guardar el ID de la sesión de Stripe.
   * 6. Devolver la URL de Checkout.
   */

  async createPayment(order: Order): Promise<Payment> {
    const payment = this.paymentRepository.create({
      order: order,
      amount: order.totalAmount,
      currency: order.currency,
      status: PaymentStatus.PENDING,
    });
    return await this.paymentRepository.save(payment);
  }
  async createCheckout(orderId: string) {
    const order = await this.OrderService.findPendingOrder(orderId);
    const newPayment = await this.createPayment(order);
    try {
      const session = await this.stripeService.createSessionCheckout({
        paymentId: newPayment.id,
        orderId: order.id,
        currency: order.currency,
        items: order.orderItems.map((item) => ({
          name: item.device.modelName,
          quantity: item.quantity,
          unitAmount: item.order.totalAmount,
        })),
      });

      await this.paymentRepository.update(newPayment.id, {
        stripeSessionId: session.id,
      });

      return {
        paymentId: newPayment.id,
        session: session.id,
        checkouUrl: session.url,
      };
    } catch (error) {
      await this.paymentRepository.update(newPayment.id, {
        status: PaymentStatus.FAILED,
      });

      throw error;
    }
  }

  /**
   * Recibe un evento que Stripe nos envió mediante webhook.
   *
   * Aquí decidimos qué hacer dependiendo del tipo de evento.
   */
  async processStripeEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      // Este evento indica que el Checkout terminó.
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event);

      // Por ahora no necesitamos manejar otros eventos.
      default:
        break;
    }
  }
  private async handleCheckoutCompleted(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== 'paid') return;

    // retrieve paymentId
    const paymentId = session.metadata?.paymentId;
    const orderId = session.metadata?.orderId;

    if (!paymentId || !orderId)
      throw new BadRequestException('Missing metadata');
    // Update payment and order in a single transaction

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const payment = await transactionalEntityManager.findOne(Payment, {
        where: { id: paymentId },
        relations: { order: { user: true } },
      });

      if (!payment) throw new NotFoundException(`Payment doesn't exist`);

      if (payment.stripeSessionId !== session.id)
        throw new BadRequestException('Stripe session mismatch');

      if (payment.order.id !== orderId)
        throw new BadRequestException('Payment order mismatch');

      if (payment.status === PaymentStatus.SUCCEEDED) return;

      await transactionalEntityManager.update(
        Payment,
        { id: paymentId },
        {
          status: PaymentStatus.SUCCEEDED,
          paidAt: new Date(),
          stripePaymentIntentId:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : null,
        },
      );

      await transactionalEntityManager.update(
        Order,
        {
          id: orderId,
          status: OrderStatus.PENDING_PAYMENT, // condicion
        },
        {
          status: OrderStatus.PAID,
        },
      );
    });
    // TODO ENVIAR CORREO DE CONFIRMACION
  }

  private async handlePaymentFailed(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const paymentId = paymentIntent.metadata?.paymentId;

    if (!paymentId) {
      return;
    }

    await this.paymentRepository.update(
      {
        id: paymentId,
        status: PaymentStatus.PENDING,
      },
      {
        status: PaymentStatus.FAILED,
        failureCode: paymentIntent.last_payment_error?.code ?? null,
        failureMessage: paymentIntent.last_payment_error?.message ?? null,
      },
    );
  }
}
