import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentRepository } from '@eventhub/application/repositories/PaymentRepository';
import { PaymentStatus } from '@eventhub/application/domain/entities/Payment';

@Injectable()
export class StripeWebhookService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentRepository: PaymentRepository
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY no está configurado');
    }
    
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async handleWebhookEvent(
    payload: Buffer,
    signature: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
      
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET no está configurado');
      }

      // Verificar que el evento proviene de Stripe
      const event = this.stripe.webhooks.constructEvent(
        payload.toString(),
        signature,
        webhookSecret
      );

      // Procesar el evento según su tipo
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        case 'charge.refunded':
          await this.handleChargeRefunded(event.data.object as Stripe.Charge);
          break;
        default:
          this.logger.log(`Evento de Stripe no manejado: ${event.type}`);
      }

      return { success: true, message: `Evento procesado: ${event.type}` };
    } catch (error) {
      this.logger.error(`Error procesando webhook de Stripe: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      // Buscar el pago en nuestra base de datos por el paymentIntent
      const payment = await this.findPaymentByPaymentIntentId(paymentIntent.id);
      
      if (payment) {
        // Actualizar estado y datos adicionales
        payment.markAsCompleted(
          paymentIntent.id,
          paymentIntent.charges.data[0]?.receipt_url
        );
        
        // Guardar cambios
        await this.paymentRepository.update(payment);
        
        this.logger.log(`Pago completado: ${payment.id}`);
      } else {
        this.logger.warn(`No se encontró pago para el PaymentIntent: ${paymentIntent.id}`);
      }
    } catch (error) {
      this.logger.error(`Error procesando pago exitoso: ${error.message}`);
    }
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      // Buscar el pago en nuestra base de datos por el paymentIntent
      const payment = await this.findPaymentByPaymentIntentId(paymentIntent.id);
      
      if (payment) {
        // Marcar como fallido
        payment.markAsFailed();
        
        // Guardar cambios
        await this.paymentRepository.update(payment);
        
        this.logger.log(`Pago fallido: ${payment.id}`);
      } else {
        this.logger.warn(`No se encontró pago para el PaymentIntent fallido: ${paymentIntent.id}`);
      }
    } catch (error) {
      this.logger.error(`Error procesando pago fallido: ${error.message}`);
    }
  }

  private async handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
    try {
      if (charge.payment_intent) {
        // Buscar el pago en nuestra base de datos por el paymentIntent
        const payment = await this.findPaymentByPaymentIntentId(charge.payment_intent as string);
        
        if (payment) {
          // Si está totalmente reembolsado
          if (charge.amount_refunded === charge.amount) {
            payment.refund();
          }
          
          // Guardar cambios
          await this.paymentRepository.update(payment);
          
          this.logger.log(`Pago reembolsado: ${payment.id}`);
        } else {
          this.logger.warn(`No se encontró pago para el cargo reembolsado: ${charge.id}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error procesando reembolso: ${error.message}`);
    }
  }

  private async findPaymentByPaymentIntentId(paymentIntentId: string) {
    // Esto funcionaría mejor con un método específico en el repositorio
    // Por ahora, obtenemos todos los pagos y filtramos
    const allPayments = await this.paymentRepository.findByEventId('all');
    return allPayments.find(payment => payment.paymentIntent === paymentIntentId);
  }
} 