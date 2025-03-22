import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';

/**
 * Comando para eliminar un pago
 */
export class DeletePaymentCommand implements Command<void> {
  private paymentId: string;

  constructor(private readonly paymentRepository: PaymentRepositoryAdapter) {}

  /**
   * Establece el ID del pago a eliminar
   */
  setPaymentId(id: string): DeletePaymentCommand {
    this.paymentId = id;
    return this;
  }

  /**
   * Ejecuta el comando para eliminar un pago
   */
  async execute(): Promise<void> {
    // Verificar que el pago existe
    const existingPayment = await this.paymentRepository.findById(this.paymentId);
    if (!existingPayment) {
      throw new NotFoundException(`No se encontró el pago con ID ${this.paymentId}`);
    }

    // Eliminar pago
    await this.paymentRepository.delete(this.paymentId);
  }
} 