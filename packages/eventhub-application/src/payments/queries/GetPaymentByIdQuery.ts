import { Query } from '../../core/interfaces/Query';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Consulta para obtener un pago por su ID
 */
export class GetPaymentByIdQuery implements Query<string, PaymentDTO | null> {
  private mapper: PaymentMapper;

  constructor(private paymentRepository: PaymentRepositoryAdapter) {
    this.mapper = new PaymentMapper();
  }

  /**
   * Ejecuta la consulta para obtener un pago por su ID
   */
  async execute(id: string): Promise<PaymentDTO | null> {
    const payment = await this.paymentRepository.findById(id);
    
    if (!payment) {
      return null;
    }
    
    return this.mapper.toDTO(payment);
  }
} 