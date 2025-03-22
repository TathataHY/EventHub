import { Payment } from '@eventhub/domain/dist/payments/entities/Payment';
import { PaymentDTO } from '../dtos/PaymentDTO';
// Importamos enumeraciones de la aplicación para la conversión
import { PaymentStatus } from '../enums/PaymentStatus';
import { PaymentProvider } from '../enums/PaymentProvider';
import { PaymentMethod } from '../enums/PaymentMethod';
import { Currency } from '../../shared/enums/Currency';

// Importamos objetos de valor del dominio para conversión
import { PaymentStatus as DomainPaymentStatus, PaymentStatusEnum } from '@eventhub/domain/dist/payments/value-objects/PaymentStatus';
import { PaymentProvider as DomainPaymentProvider, PaymentProviderEnum } from '@eventhub/domain/dist/payments/value-objects/PaymentProvider';
import { PaymentMethod as DomainPaymentMethod, PaymentMethodEnum } from '@eventhub/domain/dist/payments/value-objects/PaymentMethod';
import { Currency as DomainCurrency, CurrencyEnum } from '@eventhub/domain/dist/payments/value-objects/Currency';

/**
 * Adaptador para conversión entre entidad de dominio Payment y su DTO
 */
export class PaymentAdapter {
  /**
   * Convierte una entidad de dominio Payment a su DTO
   */
  static toApplication(domain: Payment): PaymentDTO {
    if (!domain) return null;

    return {
      id: domain.id || '',
      userId: domain.userId || '',
      eventId: domain.eventId || '',
      ticketId: '', // El dominio no tiene ticketId, se maneja en la aplicación
      amount: domain.amount || 0,
      currency: domain.currency ? domain.currency.toString() : Currency.USD,
      status: domain.status ? domain.status.toString() : PaymentStatus.PENDING,
      provider: domain.provider ? domain.provider.toString() : PaymentProvider.STRIPE,
      providerPaymentId: domain.providerPaymentId || '',
      paymentMethod: domain.paymentMethod ? domain.paymentMethod.toString() : PaymentMethod.CREDIT_CARD,
      description: domain.description || '',
      metadata: domain.metadata || {},
      createdAt: domain.createdAt || new Date(),
      updatedAt: domain.updatedAt || new Date()
    };
  }

  /**
   * Convierte un PaymentDTO a entidad de dominio Payment
   */
  static toDomain(dto: PaymentDTO): Payment {
    if (!dto) return null;

    try {
      // Usamos el factory del dominio para crear el payment
      return Payment.create({
        id: dto.id,
        userId: dto.userId,
        eventId: dto.eventId,
        amount: dto.amount,
        currency: this.mapCurrency(dto.currency),
        status: this.mapStatus(dto.status),
        provider: this.mapProvider(dto.provider),
        providerPaymentId: dto.providerPaymentId,
        paymentMethod: this.mapPaymentMethod(dto.paymentMethod),
        description: dto.description,
        metadata: dto.metadata,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt
      });
    } catch (error) {
      console.error('Error al convertir PaymentDTO a dominio:', error);
      throw error;
    }
  }
  
  /**
   * Método para mapear una string de moneda al objeto Currency del dominio
   */
  private static mapCurrency(currencyString: string): DomainCurrency {
    try {
      // Utilizar el método apropiado según la implementación del dominio
      return DomainCurrency.fromString(currencyString);
    } catch (error) {
      console.warn(`Error al mapear moneda ${currencyString}, usando USD por defecto`, error);
      return DomainCurrency.usd();
    }
  }
  
  /**
   * Método para mapear una string de método de pago al objeto PaymentMethod del dominio
   */
  private static mapPaymentMethod(methodString: string): DomainPaymentMethod {
    try {
      // Utilizar el método apropiado según la implementación del dominio
      return DomainPaymentMethod.fromString(methodString);
    } catch (error) {
      console.warn(`Error al mapear método de pago ${methodString}, usando CREDIT_CARD por defecto`, error);
      return DomainPaymentMethod.creditCard();
    }
  }
  
  /**
   * Método para mapear una string de estado de pago al objeto PaymentStatus del dominio
   */
  private static mapStatus(statusString: string): DomainPaymentStatus {
    try {
      // Crear una instancia a partir del string
      return DomainPaymentStatus.create(statusString);
    } catch (error) {
      console.warn(`Error al mapear estado ${statusString}, usando PENDING por defecto`, error);
      return DomainPaymentStatus.pending();
    }
  }
  
  /**
   * Método para mapear una string de proveedor al objeto PaymentProvider del dominio
   */
  private static mapProvider(providerString: string): DomainPaymentProvider {
    try {
      // Crear una instancia a partir del enum o string
      const enumValue = providerString as PaymentProviderEnum;
      return DomainPaymentProvider.fromValue(enumValue);
    } catch (error) {
      console.warn(`Error al mapear proveedor ${providerString}, usando STRIPE por defecto`, error);
      return DomainPaymentProvider.stripe();
    }
  }
} 