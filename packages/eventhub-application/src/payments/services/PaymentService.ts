import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { EventRepositoryAdapter } from '../../events/adapters/EventRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { ProcessPaymentCommand } from '../commands/ProcessPaymentCommand';
import { RefundPaymentCommand } from '../commands/RefundPaymentCommand';
import { GetPaymentByIdQuery } from '../queries/GetPaymentByIdQuery';
import { FindPaymentsByUserQuery } from '../queries/FindPaymentsByUserQuery';
import { FindPaymentsByEventQuery } from '../queries/FindPaymentsByEventQuery';
import { FindPaymentsQuery } from '../queries/FindPaymentsQuery';
import { GetTotalRevenueQuery } from '../queries/GetTotalRevenueQuery';
import { RevenueDTO } from '../dtos/RevenueDTO';
import { FindPaymentsOptions } from '../interfaces/FindPaymentsOptions';

/**
 * Servicio para gestionar pagos
 */
export class PaymentService {
  private paymentRepository: PaymentRepositoryAdapter;
  private eventRepository: EventRepositoryAdapter;

  constructor(
    paymentRepository: PaymentRepositoryAdapter,
    eventRepository: EventRepositoryAdapter
  ) {
    this.paymentRepository = paymentRepository;
    this.eventRepository = eventRepository;
  }

  /**
   * Procesa un pago
   */
  async processPayment(payment: PaymentDTO): Promise<PaymentDTO> {
    if (!payment) {
      throw new ValidationException('El pago es requerido');
    }

    const command = new ProcessPaymentCommand(
      this.paymentRepository,
      this.eventRepository
    );

    return command.execute(payment);
  }

  /**
   * Reembolsa un pago
   */
  async refundPayment(paymentId: string, reason?: string): Promise<PaymentDTO> {
    if (!paymentId) {
      throw new ValidationException('El ID del pago es requerido');
    }

    const command = new RefundPaymentCommand(this.paymentRepository);
    return command.execute({ paymentId, reason });
  }

  /**
   * Obtiene un pago por su ID
   */
  async getPaymentById(id: string): Promise<PaymentDTO | null> {
    if (!id) {
      throw new ValidationException('El ID del pago es requerido');
    }

    const query = new GetPaymentByIdQuery(this.paymentRepository);
    return query.execute(id);
  }

  /**
   * Obtiene los pagos de un usuario
   */
  async getPaymentsByUser(userId: string): Promise<PaymentDTO[]> {
    if (!userId) {
      throw new ValidationException('El ID de usuario es requerido');
    }

    const query = new FindPaymentsByUserQuery(this.paymentRepository);
    return query.execute(userId);
  }

  /**
   * Obtiene los pagos de un evento
   */
  async getPaymentsByEvent(eventId: string): Promise<PaymentDTO[]> {
    if (!eventId) {
      throw new ValidationException('El ID del evento es requerido');
    }

    const query = new FindPaymentsByEventQuery(this.paymentRepository);
    return query.execute(eventId);
  }

  /**
   * Busca pagos con filtros
   */
  async findPayments(options: FindPaymentsOptions = {}): Promise<PaymentDTO[]> {
    const query = new FindPaymentsQuery(this.paymentRepository);
    return query.execute(options);
  }

  /**
   * Obtiene las estadísticas de ingresos
   */
  async getTotalRevenue(timeframe?: string): Promise<RevenueDTO> {
    const query = new GetTotalRevenueQuery(this.paymentRepository);
    return query.execute(timeframe);
  }

  /**
   * Valida los datos de un pago
   * @private
   */
  private validatePaymentRequest(data: PaymentDTO): void {
    if (!data) {
      throw new ValidationException('No se proporcionaron datos de pago');
    }

    if (!data.userId) {
      throw new ValidationException('Se requiere el ID del usuario');
    }

    if (!data.eventId) {
      throw new ValidationException('Se requiere el ID del evento');
    }

    if (!data.ticketId) {
      throw new ValidationException('Se requiere el ID del ticket');
    }

    if (!data.amount || data.amount <= 0) {
      throw new ValidationException('El monto debe ser mayor que cero');
    }

    if (!data.currency) {
      throw new ValidationException('Se requiere la moneda');
    }

    if (!data.paymentMethod) {
      throw new ValidationException('Se requiere el método de pago');
    }
  }
} 