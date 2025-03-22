import { PaymentStatus } from '../enums/PaymentStatus';
import { PaymentProvider } from '../enums/PaymentProvider';
import { PaymentMethod } from '../enums/PaymentMethod';

/**
 * Opciones para la búsqueda de pagos
 */
export interface FindPaymentsOptions {
  userId?: string;
  eventId?: string;
  ticketId?: string;
  status?: PaymentStatus;
  provider?: PaymentProvider;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
} 