import { FindPaymentsOptions } from '../interfaces/FindPaymentsOptions';
import { Payment } from '@eventhub/domain/dist/payments/entities/Payment';
import { PaymentStatus } from '../enums/PaymentStatus';
import { PaymentProvider } from '../enums/PaymentProvider';
import { PaymentMethod } from '../enums/PaymentMethod';
import { Currency } from '../../../src/shared/enums/Currency';

/**
 * Estadísticas de pagos
 */
export interface PaymentStats {
  totalAmount: number;
  totalCount: number;
  paymentsByStatus: Record<string, number>;
  averageAmount: number;
  revenueByPeriod?: Record<string, number>;
}

/**
 * Opciones de filtrado para pagos
 */
export interface PaymentFilterOptions {
  userId?: string;
  eventId?: string;
  status?: PaymentStatus;
  provider?: PaymentProvider;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Propiedades para crear un pago
 */
export interface PaymentCreateProps {
  userId: string;
  eventId: string;
  ticketId: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  paymentMethod: PaymentMethod;
  description?: string;
  metadata?: any;
}

/**
 * Adaptador para el repositorio de pagos
 */
export class PaymentRepositoryAdapter {
  constructor(private repository: any) {}

  /**
   * Guarda un pago en el repositorio
   */
  async save(payment: Payment): Promise<Payment> {
    return this.repository.save(payment);
  }

  /**
   * Busca un pago por su ID
   */
  async findById(id: string): Promise<Payment | null> {
    return this.repository.findById(id);
  }

  /**
   * Busca pagos por ID de usuario
   */
  async findByUserId(userId: string): Promise<Payment[]> {
    return this.repository.findByUserId(userId);
  }

  /**
   * Busca pagos por ID de evento
   */
  async findByEventId(eventId: string): Promise<Payment[]> {
    return this.repository.findByEventId(eventId);
  }

  /**
   * Obtiene todos los pagos
   */
  async findAll(): Promise<Payment[]> {
    return this.repository.findAll();
  }

  /**
   * Crea un nuevo pago
   */
  async create(paymentData: PaymentCreateProps): Promise<Payment> {
    return this.repository.create(paymentData);
  }

  /**
   * Elimina un pago
   */
  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Actualiza el estado de un pago
   */
  async updateStatus(id: string, status: PaymentStatus): Promise<Payment | null> {
    return this.repository.updateStatus(id, status);
  }

  /**
   * Obtiene estadísticas de pagos
   */
  async getPaymentStats(startDate?: Date, endDate?: Date): Promise<PaymentStats> {
    const payments = await this.repository.findAll();
    
    // Filtrar pagos por fecha si se proporcionan fechas
    const filteredPayments = payments.filter(payment => {
      if (!payment) return false;
      
      const paymentDate = payment.createdAt;
      
      if (startDate && (!paymentDate || paymentDate < startDate)) {
        return false;
      }
      
      if (endDate && (!paymentDate || paymentDate > endDate)) {
        return false;
      }
      
      return true;
    });
    
    // Calcular estadísticas
    const totalCount = filteredPayments.length;
    
    const totalAmount = filteredPayments.reduce((sum, payment) => {
      return sum + (payment && payment.amount ? payment.amount : 0);
    }, 0);
    
    const paymentsByStatus: Record<string, number> = {};
    for (const payment of filteredPayments) {
      if (!payment || !payment.status) continue;
      
      const status = payment.status.toString();
      paymentsByStatus[status] = (paymentsByStatus[status] || 0) + 1;
    }
    
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;
    
    return {
      totalAmount,
      totalCount,
      paymentsByStatus,
      averageAmount
    };
  }

  /**
   * Busca pagos con filtros
   */
  async findWithFilters(options: PaymentFilterOptions): Promise<Payment[]> {
    const payments = await this.repository.findAll();
    
    return payments.filter(payment => {
      if (!payment) return false;
      
      if (options.userId && payment.userId !== options.userId) {
        return false;
      }
      
      if (options.eventId && payment.eventId !== options.eventId) {
        return false;
      }
      
      if (options.status && payment.status !== options.status) {
        return false;
      }
      
      if (options.provider && payment.provider !== options.provider) {
        return false;
      }
      
      if (options.paymentMethod && payment.paymentMethod !== options.paymentMethod) {
        return false;
      }
      
      if (options.minAmount !== undefined && (payment.amount === null || payment.amount === undefined || payment.amount < options.minAmount)) {
        return false;
      }
      
      if (options.maxAmount !== undefined && (payment.amount === null || payment.amount === undefined || payment.amount > options.maxAmount)) {
        return false;
      }
      
      if (options.startDate && (!payment.createdAt || payment.createdAt < options.startDate)) {
        return false;
      }
      
      if (options.endDate && (!payment.createdAt || payment.createdAt > options.endDate)) {
        return false;
      }
      
      return true;
    });
  }
} 