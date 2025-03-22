import { Query } from '../../core/interfaces/Query';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Consulta para obtener pagos por ID de evento
 */
export class FindPaymentsByEventQuery implements Query<string, PaymentDTO[]> {
  private mapper: PaymentMapper;

  constructor(private paymentRepository: PaymentRepositoryAdapter) {
    this.mapper = new PaymentMapper();
  }

  /**
   * Ejecuta la consulta para obtener pagos por ID de evento
   */
  async execute(eventId: string): Promise<PaymentDTO[]> {
    if (!eventId) {
      throw new ValidationException('El ID del evento es requerido');
    }
    
    const payments = await this.paymentRepository.findByEventId(eventId);
    
    return this.mapper.toDTOList(payments);
  }
} 