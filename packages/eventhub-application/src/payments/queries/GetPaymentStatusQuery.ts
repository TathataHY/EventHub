import { Query } from '../../core/interfaces/Query';
import { NotFoundException } from '../../core/exceptions';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { PaymentMapper } from '../mappers/PaymentMapper';

/**
 * Modelo del resultado de la consulta de estado de pago
 */
export interface PaymentStatusResult {
  paymentId: string;
  status: string;
  providerPaymentId: string;
  amount: number;
  currency: string;
  eventId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Query para obtener el estado de un pago
 */
export class GetPaymentStatusQuery implements Query<string, PaymentStatusResult> {
  private mapper: PaymentMapper;
  
  constructor(
    private readonly paymentId: string,
    private readonly paymentRepository: PaymentRepositoryAdapter
  ) {
    this.mapper = new PaymentMapper();
  }

  /**
   * Ejecuta la consulta para obtener el estado de un pago
   * @returns Promise<PaymentStatusResult> Información del estado del pago
   * @throws NotFoundException si el pago no existe
   */
  async execute(): Promise<PaymentStatusResult> {
    // Obtener el pago
    const payment = await this.paymentRepository.findById(this.paymentId);
    if (!payment) {
      throw new NotFoundException('Pago', this.paymentId);
    }

    // Obtener el DTO del pago a través del mapper
    const paymentDTO = this.mapper.toDTO(payment);
    if (!paymentDTO) {
      throw new NotFoundException(`Error al convertir el pago con ID ${this.paymentId}`);
    }

    // Retornar los datos del estado
    return {
      paymentId: paymentDTO.id,
      status: paymentDTO.status,
      providerPaymentId: paymentDTO.providerPaymentId || '',
      amount: paymentDTO.amount,
      currency: paymentDTO.currency,
      eventId: paymentDTO.eventId,
      userId: paymentDTO.userId,
      createdAt: paymentDTO.createdAt,
      updatedAt: paymentDTO.updatedAt
    };
  }
} 