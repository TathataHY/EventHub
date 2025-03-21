import { Ticket } from '@eventhub/domain/dist/tickets/entities/Ticket';
import { TicketStatus } from '@eventhub/domain/dist/tickets/value-objects/TicketStatus';
import { TicketType } from '@eventhub/domain/dist/tickets/value-objects/TicketType';

/**
 * Adaptador para convertir entre los tipos de Ticket de la capa de dominio y aplicación
 */
export class TicketAdapter {
  /**
   * Convierte un ticket del dominio a la representación de la capa de aplicación
   * @param domainTicket Ticket del dominio
   */
  static toApplication(domainTicket: any): any {
    if (!domainTicket) return null;
    
    // Extraer valores primitivos de los objetos de valor
    const priceValue = domainTicket.price?._amount || 0;
    const priceCurrency = domainTicket.price?._currency || 'USD';
    const statusValue = domainTicket.status?.value || 'available';
    const typeValue = domainTicket.type?.value || 'general';
    
    return {
      id: domainTicket.id,
      code: domainTicket.code,
      eventId: domainTicket.eventId,
      userId: domainTicket.userId,
      price: priceValue,
      currency: priceCurrency,
      status: statusValue,
      type: typeValue,
      seat: domainTicket.seat,
      section: domainTicket.section,
      isReserved: domainTicket.isReserved,
      reservedUntil: domainTicket.reservedUntil,
      purchasedAt: domainTicket.purchasedAt,
      validatedAt: domainTicket.validatedAt,
      canceledAt: domainTicket.canceledAt,
      cancellationReason: domainTicket.cancellationReason,
      createdAt: domainTicket.createdAt,
      updatedAt: domainTicket.updatedAt
    };
  }

  /**
   * Convierte un ticket de la capa de aplicación al tipo de dominio
   * @param appTicket Ticket de la capa de aplicación
   */
  static toDomain(appTicket: any): any {
    if (!appTicket) return null;
    
    // Crear una representación válida para el dominio usando formato simple
    // en lugar de crear instancias de los objetos de valor que pueden ser privados
    return {
      id: appTicket.id,
      code: appTicket.code,
      eventId: appTicket.eventId,
      userId: appTicket.userId,
      // Simulamos los objetos de valor con estructuras similares
      price: {
        _amount: appTicket.price,
        _currency: appTicket.currency || 'USD',
        toString: () => `${appTicket.price} ${appTicket.currency || 'USD'}`
      },
      status: {
        value: appTicket.status || 'available'
      },
      type: {
        value: appTicket.type || 'general'
      },
      seat: appTicket.seat,
      section: appTicket.section,
      isReserved: appTicket.isReserved,
      reservedUntil: appTicket.reservedUntil,
      purchasedAt: appTicket.purchasedAt,
      validatedAt: appTicket.validatedAt,
      canceledAt: appTicket.canceledAt,
      cancellationReason: appTicket.cancellationReason,
      createdAt: appTicket.createdAt,
      updatedAt: appTicket.updatedAt
    };
  }
} 