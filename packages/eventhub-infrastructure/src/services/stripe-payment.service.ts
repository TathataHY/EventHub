import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentService } from '@eventhub/application/services/PaymentService';

@Injectable()
export class StripePaymentService implements PaymentService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY no está configurado');
    }
    
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    description?: string;
    metadata?: Record<string, string>;
    customerId?: string;
  }): Promise<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    client_secret?: string;
  }> {
    try {
      const { amount, currency, description, metadata, customerId } = params;
      
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(amount * 100), // Stripe trabaja en centavos
        currency,
        description,
        metadata,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
      };
      
      const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentParams);
      
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convertir de centavos a la unidad
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret || undefined,
      };
    } catch (error) {
      console.error('Error al crear PaymentIntent en Stripe:', error);
      throw new Error(`Error al crear pago: ${error.message}`);
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<{
    id: string;
    amount: number;
    currency: string;
    status: string;
  }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Error al recuperar PaymentIntent de Stripe:', error);
      throw new Error(`Error al recuperar pago: ${error.message}`);
    }
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<{
    id: string;
    amount: number;
    currency: string;
    status: string;
  }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Error al confirmar PaymentIntent en Stripe:', error);
      throw new Error(`Error al confirmar pago: ${error.message}`);
    }
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<{
    id: string;
    status: string;
  }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Error al cancelar PaymentIntent en Stripe:', error);
      throw new Error(`Error al cancelar pago: ${error.message}`);
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<{
    id: string;
    status: string;
  }> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };
      
      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }
      
      const refund = await this.stripe.refunds.create(refundParams);
      
      return {
        id: refund.id,
        status: refund.status,
      };
    } catch (error) {
      console.error('Error al reembolsar pago en Stripe:', error);
      throw new Error(`Error al reembolsar pago: ${error.message}`);
    }
  }

  async createCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>
  ): Promise<{
    id: string;
  }> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata,
      });
      
      return {
        id: customer.id,
      };
    } catch (error) {
      console.error('Error al crear cliente en Stripe:', error);
      throw new Error(`Error al crear cliente: ${error.message}`);
    }
  }

  async retrieveCustomer(customerId: string): Promise<{
    id: string;
    email: string;
    name?: string;
  }> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      
      if (customer.deleted) {
        throw new Error('Cliente eliminado');
      }
      
      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || undefined,
      };
    } catch (error) {
      console.error('Error al recuperar cliente de Stripe:', error);
      throw new Error(`Error al recuperar cliente: ${error.message}`);
    }
  }

  async createSetupIntent(customerId: string): Promise<{
    client_secret: string;
  }> {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });
      
      if (!setupIntent.client_secret) {
        throw new Error('No se pudo obtener client_secret del SetupIntent');
      }
      
      return {
        client_secret: setupIntent.client_secret,
      };
    } catch (error) {
      console.error('Error al crear SetupIntent en Stripe:', error);
      throw new Error(`Error al crear SetupIntent: ${error.message}`);
    }
  }
} 