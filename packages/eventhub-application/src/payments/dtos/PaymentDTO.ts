/**
 * DTO para transferir datos de pagos entre capas
 */
export interface PaymentDTO {
  id: string;
  userId: string;
  eventId: string;
  ticketId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  providerPaymentId?: string;
  paymentMethod: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
} 