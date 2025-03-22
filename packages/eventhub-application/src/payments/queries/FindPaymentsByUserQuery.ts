import { Query } from '../../core/interfaces/Query';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Consulta para obtener pagos por ID de usuario
 */
export class FindPaymentsByUserQuery implements Query<string, PaymentDTO[]> {
  private mapper: PaymentMapper;

  constructor(private paymentRepository: PaymentRepositoryAdapter) {
    this.mapper = new PaymentMapper();
  }

  /**
   * Ejecuta la consulta para obtener pagos por ID de usuario
   */
  async execute(userId: string): Promise<PaymentDTO[]> {
    if (!userId) {
      throw new ValidationException('El ID de usuario es requerido');
    }
    
    const payments = await this.paymentRepository.findByUserId(userId);
    
    return this.mapper.toDTOList(payments);
  }
} 