import { Command } from '../../core/interfaces/Command';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { EventRepositoryAdapter } from '../../events/adapters/EventRepositoryAdapter';
import { Payment } from '@eventhub/domain/dist/payments/entities/Payment';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { PaymentStatus } from '../enums/PaymentStatus';
import { PaymentProvider } from '../enums/PaymentProvider';
import { PaymentMethod } from '../enums/PaymentMethod';
import { Currency } from '../../shared/enums/Currency';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentAdapter } from '../adapters/PaymentAdapter';
import { PaymentProcessor } from '@eventhub/domain/dist/payments/services/PaymentProcessor';
import { v4 as uuidv4 } from 'uuid';

/**
 * Implementación simple del procesador de pagos para la demostración
 * En una aplicación real, esto se implementaría en la capa de infraestructura
 */
class DemoPaymentProcessor implements PaymentProcessor {
  async processPayment(payment: Payment): Promise<Payment> {
    // Simulación de procesamiento exitoso
    const updatedPayment = Payment.create({
      ...payment.toObject(),
      providerPaymentId: `demo_${uuidv4()}`,
      status: PaymentStatus.COMPLETED
    });
    
    return updatedPayment;
  }
  
  async refundPayment(payment: Payment, reason?: string): Promise<Payment> {
    // Simulación de reembolso exitoso
    return Payment.create({
      ...payment.toObject(),
      status: PaymentStatus.REFUNDED,
      metadata: {
        ...payment.metadata,
        refundReason: reason || 'Reembolso solicitado',
        refundDate: new Date()
      }
    });
  }
  
  async checkPaymentStatus(payment: Payment): Promise<Payment> {
    // Simulación de verificación de estado
    return payment;
  }
  
  async cancelPayment(payment: Payment): Promise<Payment> {
    // Simulación de cancelación exitosa
    return Payment.create({
      ...payment.toObject(),
      status: PaymentStatus.CANCELLED,
      metadata: {
        ...payment.metadata,
        cancellationDate: new Date()
      }
    });
  }
}

/**
 * Comando para procesar un pago
 */
export class ProcessPaymentCommand implements Command<PaymentDTO, PaymentDTO> {
  private paymentProcessor: PaymentProcessor;
  
  constructor(
    private paymentRepository: PaymentRepositoryAdapter,
    private eventRepository: EventRepositoryAdapter
  ) {
    this.paymentProcessor = new DemoPaymentProcessor();
  }

  /**
   * Ejecuta el comando para procesar un pago
   */
  async execute(payment: PaymentDTO): Promise<PaymentDTO> {
    // Validar datos de entrada
    if (!payment) {
      throw new ValidationException('El pago es requerido');
    }

    if (!payment.userId) {
      throw new ValidationException('El ID de usuario es requerido');
    }

    if (!payment.eventId) {
      throw new ValidationException('El ID de evento es requerido');
    }

    if (!payment.ticketId) {
      throw new ValidationException('El ID de ticket es requerido');
    }

    if (payment.amount === undefined || payment.amount === null || payment.amount <= 0) {
      throw new ValidationException('El monto debe ser mayor que cero');
    }

    // Verificar si el evento existe
    const event = await this.eventRepository.findById(payment.eventId);
    if (!event) {
      throw new NotFoundException(`Evento no encontrado con ID: ${payment.eventId}`);
    }

    // Verificar si el usuario tiene un ticket para ese evento
    // Aquí se podría agregar una verificación adicional con un repositorio de tickets

    // Convertir el DTO a entidad de dominio
    const domainPayment = PaymentAdapter.toDomain(payment);
    
    // Crear un pago inicial con estado PENDING
    const savedPayment = await this.paymentRepository.create(payment);
    
    try {
      // Procesar el pago usando el procesador
      const processedPayment = await this.paymentProcessor.processPayment(domainPayment);
      
      // Actualizar el pago en la base de datos con el estado y detalles del procesamiento
      const updatedPaymentDTO = PaymentAdapter.toApplication(processedPayment);
      const finalPayment = await this.paymentRepository.updateStatus(
        savedPayment.id, 
        updatedPaymentDTO.status
      );
      
      if (!finalPayment) {
        throw new NotFoundException(`No se pudo actualizar el pago con ID: ${savedPayment.id}`);
      }
      
      // Devolver el DTO del pago procesado
      return PaymentAdapter.toApplication(finalPayment);
    } catch (error) {
      // Si ocurre un error, actualizar el pago a estado FAILED
      const failedPayment = await this.paymentRepository.updateStatus(
        savedPayment.id,
        PaymentStatus.FAILED
      );
      
      throw new Error(`Error al procesar el pago: ${error.message}`);
    }
  }

  /**
   * Convierte un string de moneda al enum Currency
   */
  private mapStringToCurrency(currencyStr: string): Currency {
    try {
      return Currency[currencyStr.toUpperCase() as keyof typeof Currency] || Currency.USD;
    } catch (error) {
      return Currency.USD;
    }
  }

  /**
   * Convierte un string de proveedor al enum PaymentProvider
   */
  private mapStringToProvider(providerStr: string): PaymentProvider {
    try {
      return PaymentProvider[providerStr.toUpperCase() as keyof typeof PaymentProvider] || PaymentProvider.STRIPE;
    } catch (error) {
      return PaymentProvider.STRIPE;
    }
  }

  /**
   * Convierte un string de método de pago al enum PaymentMethod
   */
  private mapStringToPaymentMethod(methodStr: string): PaymentMethod {
    try {
      return PaymentMethod[methodStr.toUpperCase() as keyof typeof PaymentMethod] || PaymentMethod.CREDIT_CARD;
    } catch (error) {
      return PaymentMethod.CREDIT_CARD;
    }
  }
}