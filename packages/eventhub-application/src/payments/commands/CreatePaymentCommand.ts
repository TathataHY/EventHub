import { Command } from '../../core/interfaces/Command';
import { CreatePaymentDTO } from '../dtos/CreatePaymentDTO';
import { Payment } from '@eventhub/domain/dist/payments/entities/Payment';
import { PaymentStatus, PaymentStatusEnum } from '@eventhub/domain/dist/payments/value-objects/PaymentStatus';
import { PaymentProvider, PaymentProviderEnum } from '@eventhub/domain/dist/payments/value-objects/PaymentProvider';
import { Currency } from '@eventhub/domain/dist/payments/value-objects/Currency';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';

/**
 * Comando para crear un nuevo pago
 */
export class CreatePaymentCommand implements Command<Payment> {
  private paymentData: CreatePaymentDTO;

  constructor(private readonly paymentRepository: PaymentRepositoryAdapter) {}

  /**
   * Establece los datos del pago para ejecutar el comando
   */
  setData(data: CreatePaymentDTO): CreatePaymentCommand {
    this.paymentData = data;
    return this;
  }

  /**
   * Ejecuta el comando para crear un nuevo pago
   * @returns Entidad de pago creada
   */
  async execute(): Promise<Payment> {
    const { userId, eventId, amount, currency, provider, description, metadata } = this.paymentData;

    // Crear objeto de dominio
    const paymentProps = {
      userId,
      eventId,
      amount,
      currency: Currency.fromString(currency),
      status: PaymentStatus.fromValue(PaymentStatusEnum.PENDING),
      provider: PaymentProvider.fromValue(provider as unknown as PaymentProviderEnum),
      description: description || '',
      metadata: metadata || {},
      providerPaymentId: null
    };

    const payment = Payment.create(paymentProps);
    
    // Guardar en repositorio
    await this.paymentRepository.save(payment);
    
    return payment;
  }
} 