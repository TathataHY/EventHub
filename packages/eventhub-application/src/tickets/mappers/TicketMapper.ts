import { Mapper } from '../../core/interfaces/Mapper';
import { TicketDTO } from '../dtos/TicketDTO';
import { Ticket } from '../../../../eventhub-domain/src/tickets/entities/Ticket';
import { TicketProps } from '../../../../eventhub-domain/src/tickets/entities/Ticket';
import { CreateTicketDTO } from '../dtos/CreateTicketDTO';
import { UpdateTicketDTO } from '../dtos/UpdateTicketDTO';
import { Money } from '../../../../eventhub-domain/src/core/value-objects/Money';
import { TicketType } from '../../../../eventhub-domain/src/tickets/value-objects/TicketType';
import { TicketStatus, TicketStatusEnum } from '../../../../eventhub-domain/src/tickets/value-objects/TicketStatus';
import { Event } from '../../../../eventhub-domain/src/events/entities/Event';

export class TicketMapper implements Mapper<Ticket, TicketDTO> {
  // Método mock para crear un evento 
  private createEventMock(eventId: string): Event {
    // Crear un objeto de evento mínimo para usar en la capa de aplicación
    const mockEvent = {
      id: eventId,
      name: 'Evento Mock',
      title: 'Evento Mock',
      description: 'Descripción de evento mock',
      startDate: new Date(),
      endDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      location: { value: () => 'Mock Location' },
      organizerId: 'mock-organizer-id',
      capacity: 100,
      equals: (other: any) => other && other.id === eventId,
      // Añadir las propiedades mínimas para satisfacer la interfaz Event
    } as unknown as Event;
    
    return mockEvent;
  }

  toDomain(dto: TicketDTO | (Partial<TicketDTO> & CreateTicketDTO) | (TicketDTO & UpdateTicketDTO)): Ticket {
    if ('id' in dto && dto.id && dto.createdAt && dto.updatedAt) {
      // Si tiene ID y las fechas, es un DTO completo o una actualización
      const [amount, currency] = this.parsePrice(dto.price);
      
      return Ticket.reconstitute({
        id: dto.id,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
        isActive: true,
        name: 'Nombre por defecto', // Añadir un nombre por defecto ya que no viene en el DTO
        description: dto.description,
        price: Money.create(amount, currency),
        quantity: dto.quantity,
        availableQuantity: dto.quantity, // Inicializar con la cantidad total
        type: TicketType.create(dto.type),
        status: TicketStatus.create(dto.status as TicketStatusEnum),
        event: this.createEventMock(dto.eventId)
      });
    } else {
      // Es un CreateTicketDTO
      const createDto = dto as CreateTicketDTO;
      const [amount, currency] = this.parsePrice(createDto.price);
      
      return Ticket.create({
        name: 'Nombre por defecto', // Añadir un nombre por defecto ya que no viene en el DTO
        description: createDto.description,
        price: Money.create(amount, currency),
        quantity: createDto.quantity,
        type: TicketType.create(createDto.type),
        event: this.createEventMock(createDto.eventId)
      });
    }
  }

  toDTO(entity: Ticket): TicketDTO {
    return {
      id: entity.id,
      eventId: entity.event.id,
      type: entity.type.value(),
      price: entity.price.toString(),
      quantity: entity.quantity,
      status: entity.status.value(),
      description: entity.description,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }
  
  private parsePrice(price: string): [number, string] {
    const match = price.match(/^(\d+(?:\.\d{1,2})?)\s([A-Z]{3})$/);
    if (!match) {
      throw new Error(`Formato de precio inválido: ${price}. Debe ser "XX.XX CUR" (ej: "10.50 EUR")`);
    }
    
    const amount = parseFloat(match[1]);
    const currency = match[2];
    
    return [amount, currency];
  }
} 