import { Payment } from '@eventhub/domain';
import { PaymentEntity } from '../entities/PaymentEntity';

/**
 * Mapper para convertir entre la entidad de dominio Payment y la entidad TypeORM
 */
export class PaymentMapper {
  /**
   * Convierte una entidad TypeORM a una entidad de dominio
   * @param entity Entidad TypeORM
   * @returns Entidad de dominio
   */
  static toDomain(entity: PaymentEntity): Payment {
    return Payment.create({
      id: entity.id,
      userId: entity.userId,
      eventId: entity.eventId,
      amount: Number(entity.amount),
      currency: entity.currency,
      status: entity.status,
      provider: entity.provider,
      providerPaymentId: entity.providerPaymentId,
      description: entity.description,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  /**
   * Convierte una entidad de dominio a una entidad TypeORM
   * @param domain Entidad de dominio
   * @returns Entidad TypeORM
   */
  static toEntity(domain: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    
    // Si la entidad de dominio tiene un ID, lo asignamos
    if (domain.id) {
      entity.id = domain.id;
    }
    
    entity.userId = domain.userId;
    entity.eventId = domain.eventId;
    entity.amount = domain.amount;
    entity.currency = domain.currency;
    entity.status = domain.status;
    entity.provider = domain.provider;
    entity.providerPaymentId = domain.providerPaymentId;
    entity.description = domain.description;
    entity.metadata = domain.metadata;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    
    return entity;
  }
} 