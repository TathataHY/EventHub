import { Repository } from '../../../core/interfaces/Repository';
import { Payment } from '../entities/Payment';
import { PaymentStatus } from '../value-objects/PaymentStatus';

/**
 * Opciones para buscar pagos con filtrado y paginación
 */
export interface FindPaymentsOptions {
  page?: number;
  limit?: number;
  status?: PaymentStatus | string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'createdAt' | 'amount' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Repositorio para operaciones con pagos
 * Extiende la interfaz Repository para operaciones comunes
 */
export interface PaymentRepository extends Repository<Payment, string> {
  /**
   * Busca pagos por ID de usuario
   * @param userId ID del usuario
   * @returns Arreglo de pagos
   */
  findByUserId(userId: string): Promise<Payment[]>;

  /**
   * Busca pagos por ID de evento
   * @param eventId ID del evento
   * @returns Arreglo de pagos
   */
  findByEventId(eventId: string): Promise<Payment[]>;

  /**
   * Busca pagos por ID de evento y usuario
   * @param eventId ID del evento
   * @param userId ID del usuario
   * @returns Arreglo de pagos
   */
  findByEventIdAndUserId(eventId: string, userId: string): Promise<Payment[]>;

  /**
   * Busca pagos por estado
   * @param status Estado del pago
   * @returns Arreglo de pagos
   */
  findByStatus(status: PaymentStatus | string): Promise<Payment[]>;

  /**
   * Busca pagos con opciones de filtrado y paginación
   * @param options Opciones de búsqueda
   * @returns Objeto con pagos encontrados y total
   */
  findWithOptions(options: FindPaymentsOptions): Promise<{ 
    payments: Payment[], 
    total: number 
  }>;

  /**
   * Busca un pago por su identificador en el proveedor de pagos
   * @param providerPaymentId ID del pago en el proveedor
   * @returns Pago encontrado o null
   */
  findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null>;

  /**
   * Obtiene la suma total de pagos completados en un período
   * @param startDate Fecha de inicio
   * @param endDate Fecha de fin
   * @returns Suma total
   */
  getTotalRevenue(startDate: Date, endDate: Date): Promise<number>;

  /**
   * Obtiene un resumen de pagos agrupados por estado
   * @returns Mapa con conteo por estado
   */
  getPaymentsSummaryByStatus(): Promise<Record<string, number>>;
} 