import { Payment } from '@eventhub/domain/dist/payments/entities/Payment';
import { UpdatePaymentDTO } from '../dtos/UpdatePaymentDTO';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';

/**
 * Comando para actualizar un pago existente
 */
export class UpdatePaymentCommand implements Command<Payment> {
  private id: string;
  private updateData: UpdatePaymentDTO;

  constructor(private readonly paymentRepository: PaymentRepositoryAdapter) {}

  /**
   * Establece los datos para ejecutar el comando
   */
  setData(id: string, data: UpdatePaymentDTO): UpdatePaymentCommand {
    this.id = id;
    this.updateData = data;
    return this;
  }

  /**
   * Ejecuta el comando para actualizar un pago
   * @returns Pago actualizado
   */
  async execute(): Promise<Payment> {
    // Buscar pago existente
    const existingPayment = await this.paymentRepository.findById(this.id);
    if (!existingPayment) {
      throw new NotFoundException(`No se encontró el pago con ID ${this.id}`);
    }

    // Crear un nuevo objeto con los campos actualizados
    const updatedPaymentData = {
      ...existingPayment,
      ...this.updateData,
      updatedAt: new Date()
    };

    // Guardar cambios
    await this.paymentRepository.save(updatedPaymentData);

    return updatedPaymentData as unknown as Payment;
  }
} 