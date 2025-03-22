import { Query } from '../../core/interfaces/Query';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { FindPaymentsOptions } from '../interfaces/FindPaymentsOptions';

/**
 * Consulta para buscar pagos aplicando filtros opcionales
 */
export class FindPaymentsQuery implements Query<FindPaymentsOptions, PaymentDTO[]> {
  private mapper: PaymentMapper;

  constructor(private paymentRepository: PaymentRepositoryAdapter) {
    this.mapper = new PaymentMapper();
  }

  /**
   * Ejecuta la consulta para buscar pagos con filtros
   */
  async execute(options: FindPaymentsOptions = {}): Promise<PaymentDTO[]> {
    const payments = await this.paymentRepository.findWithFilters(options);
    
    return this.mapper.toDTOList(payments);
  }
} 