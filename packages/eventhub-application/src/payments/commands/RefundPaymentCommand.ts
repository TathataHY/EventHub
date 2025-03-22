import { Command } from '../../core/interfaces/Command';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { PaymentStatus } from '../enums/PaymentStatus';
import { PaymentAdapter } from '../adapters/PaymentAdapter';

/**
 * Interfaz para los parámetros del comando de reembolso
 */
export interface RefundParams {
  paymentId: string;
  reason?: string;
}

/**
 * Comando para reembolsar un pago
 */
export class RefundPaymentCommand implements Command<RefundParams, PaymentDTO> {
  constructor(private paymentRepository: PaymentRepositoryAdapter) {}

  /**
   * Ejecuta el comando para reembolsar un pago
   */
  async execute(params: RefundParams): Promise<PaymentDTO> {
    if (!params || !params.paymentId) {
      throw new ValidationException('El ID del pago es requerido');
    }

    // Obtener el pago a reembolsar
    const payment = await this.paymentRepository.findById(params.paymentId);
    if (!payment) {
      throw new NotFoundException(`No se encontró el pago con ID: ${params.paymentId}`);
    }

    // Validar que el pago pueda ser reembolsado
    const paymentDTO = PaymentAdapter.toApplication(payment);
    
    if (paymentDTO.status === PaymentStatus.REFUNDED.toString()) {
      throw new ValidationException('Este pago ya ha sido reembolsado');
    }

    if (paymentDTO.status !== PaymentStatus.COMPLETED.toString()) {
      throw new ValidationException('Solo se pueden reembolsar pagos completados');
    }

    // Actualizar el estado del pago a REFUNDED
    const updatedPayment = await this.paymentRepository.updateStatus(
      params.paymentId,
      PaymentStatus.REFUNDED
    );
    
    if (!updatedPayment) {
      throw new NotFoundException(`No se pudo actualizar el pago con ID: ${params.paymentId}`);
    }

    // Aquí se podría agregar lógica para registrar la razón del reembolso
    // o para integrar con un servicio de pagos externo

    // Devolver el DTO del pago actualizado
    return PaymentAdapter.toApplication(updatedPayment);
  }
} 