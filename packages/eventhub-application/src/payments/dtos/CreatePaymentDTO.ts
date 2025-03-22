import { PaymentProvider } from '@eventhub/domain/dist/payments/value-objects/PaymentProvider';

/**
 * DTO para crear un nuevo pago
 */
export interface CreatePaymentDTO {
  userId: string;
  eventId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  providerPaymentId?: string;
  description?: string;
  metadata?: Record<string, any>;
} 