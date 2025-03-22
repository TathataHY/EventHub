import { Query } from '../../core/interfaces/Query';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Consulta para obtener los pagos de un evento
 * @deprecated Utilizar FindPaymentsByEventQuery en su lugar
 */
export class GetEventPaymentsQuery implements Query<string, PaymentDTO[]> {
  private mapper: PaymentMapper;
  private eventId: string;

  constructor(private readonly paymentRepository: PaymentRepositoryAdapter) {
    this.mapper = new PaymentMapper();
  }

  /**
   * Establece el ID del evento
   */
  setEventId(eventId: string): GetEventPaymentsQuery {
    this.eventId = eventId;
    return this;
  }

  /**
   * Ejecuta la consulta para obtener los pagos de un evento
   * @returns Lista de DTOs de pagos
   */
  async execute(eventId?: string): Promise<PaymentDTO[]> {
    const id = eventId || this.eventId;
    
    if (!id) {
      throw new ValidationException('El ID del evento es requerido');
    }
    
    const payments = await this.paymentRepository.findByEventId(id);
    
    return this.mapper.toDTOList(payments);
  }
} 