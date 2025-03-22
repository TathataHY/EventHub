import { PaymentStatus } from '@eventhub/domain/dist/payments/value-objects/PaymentStatus';

/**
 * DTO para actualizar un pago existente
 */
export interface UpdatePaymentDTO {
  status?: PaymentStatus;
  providerPaymentId?: string;
  metadata?: Record<string, any>;
} 