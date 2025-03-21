import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentService, CreatePaymentParams, PaymentResult, RefundResult } from 'eventhub-application';
import { PaymentStatus } from 'eventhub-domain';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_API_KEY');
    if (!apiKey) {
      throw new Error('STRIPE_API_KEY no está definida en las variables de entorno');
    }
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16', // Utilizar la versión más reciente
    });
  }

  /**
   * Crea un nuevo pago a través de Stripe
   * @param paymentData Datos del pago
   * @returns Resultado del pago
   */
  async createPayment(paymentData: CreatePaymentParams): Promise<PaymentResult> {
    try {
      // Crear una sesión de checkout
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: paymentData.currency,
              product_data: {
                name: paymentData.description || 'Pago de evento',
              },
              unit_amount: this.convertToCents(paymentData.amount),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.configService.get('APP_URL')}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get('APP_URL')}/payments/cancel`,
        metadata: {
          userId: paymentData.userId,
          eventId: paymentData.eventId,
          ...paymentData.metadata,
        },
      });

      return {
        paymentId: '', // Se completará al guardar en la base de datos
        providerPaymentId: session.id,
        status: PaymentStatus.PENDING,
        redirectUrl: session.url || undefined,
      };
    } catch (error) {
      console.error('Error al crear pago en Stripe:', error);
      return {
        paymentId: '',
        providerPaymentId: '',
        status: PaymentStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Error desconocido al procesar el pago',
      };
    }
  }

  /**
   * Verifica el estado de un pago en Stripe
   * @param paymentId ID del pago interno
   * @param providerPaymentId ID de la sesión en Stripe
   * @returns Estado actual del pago
   */
  async checkPaymentStatus(paymentId: string, providerPaymentId: string): Promise<PaymentStatus> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(providerPaymentId);
      
      switch (session.payment_status) {
        case 'paid':
          return PaymentStatus.COMPLETED;
        case 'unpaid':
          return PaymentStatus.PENDING;
        case 'no_payment_required':
          return PaymentStatus.COMPLETED;
        default:
          return PaymentStatus.PENDING;
      }
    } catch (error) {
      console.error('Error al verificar estado del pago en Stripe:', error);
      throw error;
    }
  }

  /**
   * Reembolsa un pago realizado en Stripe
   * @param paymentId ID del pago interno
   * @param amount Monto a reembolsar (opcional)
   * @returns Resultado del reembolso
   */
  async refundPayment(paymentId: string, amount?: number): Promise<RefundResult> {
    try {
      // Primero necesitamos obtener el pago para encontrar el payment_intent
      // Suponemos que guardamos el payment_intent_id en el providerPaymentId
      const session = await this.stripe.checkout.sessions.retrieve(paymentId);
      
      if (!session.payment_intent) {
        return {
          success: false,
          errorMessage: 'No se encontró el payment_intent asociado a esta sesión',
        };
      }

      // Reembolsar el pago
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: typeof session.payment_intent === 'string' 
          ? session.payment_intent 
          : session.payment_intent.id,
      };

      // Si se especifica un monto, aplicar reembolso parcial
      if (amount) {
        refundParams.amount = this.convertToCents(amount);
      }

      const refund = await this.stripe.refunds.create(refundParams);

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
        amount: refund.amount ? this.convertFromCents(refund.amount) : undefined,
      };
    } catch (error) {
      console.error('Error al reembolsar pago en Stripe:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Error desconocido al procesar el reembolso',
      };
    }
  }

  /**
   * Convierte un monto de la moneda base a centavos para Stripe
   * @param amount Monto en la moneda base (ej. 10.99)
   * @returns Monto en centavos (ej. 1099)
   */
  private convertToCents(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convierte un monto de centavos a la moneda base
   * @param cents Monto en centavos (ej. 1099)
   * @returns Monto en la moneda base (ej. 10.99)
   */
  private convertFromCents(cents: number): number {
    return cents / 100;
  }
} 