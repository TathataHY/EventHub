import { Query } from '../../core/interfaces/Query';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentMapper } from '../mappers/PaymentMapper';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Consulta para obtener un pago por ID
 * @deprecated Utilizar GetPaymentByIdQuery en su lugar
 */
export class GetPaymentQuery implements Query<string, PaymentDTO> {
  private mapper: PaymentMapper;

  constructor(
    private readonly paymentId: string,
    private readonly paymentRepository: PaymentRepositoryAdapter
  ) {
    this.mapper = new PaymentMapper();
  }

  /**
   * Ejecuta la consulta para obtener un pago
   * @returns DTO del pago
   */
  async execute(): Promise<PaymentDTO> {
    const payment = await this.paymentRepository.findById(this.paymentId);
    if (!payment) {
      throw new NotFoundException(`No se encontró el pago con ID ${this.paymentId}`);
    }

    const paymentDTO = this.mapper.toDTO(payment);
    if (!paymentDTO) {
      throw new NotFoundException(`Error al convertir el pago con ID ${this.paymentId}`);
    }

    return paymentDTO;
  }
} 