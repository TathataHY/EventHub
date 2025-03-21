import { Mapper } from '../../core/interfaces/Mapper';
import { Payment } from '@eventhub/domain/dist/payments/entities/Payment';
import { PaymentDTO } from '../dtos/PaymentDTO';
import { PaymentStatus } from '@eventhub/domain/dist/payments/value-objects/PaymentStatus';
import { PaymentProvider } from '@eventhub/domain/dist/payments/value-objects/PaymentProvider';
import { Currency } from '@eventhub/domain/dist/payments/value-objects/Currency';
import { PaymentAdapter } from '../adapters/PaymentAdapter';

/**
 * Mapeador para convertir entre entidades Payment del dominio y DTOs
 */
export class PaymentMapper implements Mapper<Payment, PaymentDTO> {
  /**
   * Convierte una entidad Payment del dominio a un DTO
   */
  toDTO(domain: Payment | null): PaymentDTO | null {
    if (!domain) {
      return null;
    }

    return PaymentAdapter.toApplication(domain);
  }

  /**
   * Convierte un DTO a una entidad Payment del dominio
   */
  toDomain(dto: PaymentDTO | null): Payment | null {
    if (!dto) {
      return null;
    }

    return PaymentAdapter.toDomain(dto);
  }

  /**
   * Convierte una lista de entidades del dominio a DTOs
   */
  toDTOList(domainList: Payment[] | null): PaymentDTO[] {
    if (!domainList) return [];
    
    return domainList
      .filter(domain => domain !== null)
      .map(domain => this.toDTO(domain))
      .filter((dto): dto is PaymentDTO => dto !== null);
  }

  /**
   * Convierte un DTO a una entidad de dominio parcial (para actualizaciones)
   * @param dto DTO parcial con propiedades a actualizar
   * @returns Objeto con propiedades actualizables
   */
  static toPartialDomain(dto: Partial<PaymentDTO>): Partial<Payment> {
    const partialPayment: Record<string, any> = {};

    if (dto.status !== undefined) {
      partialPayment.status = PaymentStatus.fromValue(dto.status);
    }
    if (dto.providerPaymentId !== undefined) {
      partialPayment.providerPaymentId = dto.providerPaymentId;
    }
    if (dto.metadata !== undefined) {
      partialPayment.metadata = dto.metadata;
    }

    return partialPayment as Partial<Payment>;
  }
} 