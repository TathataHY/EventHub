import { Query } from '../../core/interfaces/Query';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { ValidationException } from '../../core/exceptions/ValidationException';

/**
 * Consulta para obtener los pagos de un usuario
 * @deprecated Utilizar FindPaymentsByUserQuery en su lugar
 */
export class GetUserPaymentsQuery implements Query<string, PaymentDTO[]> {
  private mapper: PaymentMapper;
  private userId: string;

  constructor(private readonly paymentRepository: PaymentRepositoryAdapter) {
    this.mapper = new PaymentMapper();
  }

  /**
   * Establece el ID del usuario
   */
  setUserId(userId: string): GetUserPaymentsQuery {
    this.userId = userId;
    return this;
  }

  /**
   * Ejecuta la consulta para obtener los pagos de un usuario
   * @returns Lista de DTOs de pagos
   */
  async execute(userId?: string): Promise<PaymentDTO[]> {
    const id = userId || this.userId;
    
    if (!id) {
      throw new ValidationException('El ID del usuario es requerido');
    }
    
    const payments = await this.paymentRepository.findByUserId(id);
    
    return this.mapper.toDTOList(payments);
  }
} 