import { Event } from 'eventhub-domain';
import { EventDto } from 'eventhub-application';

/**
 * Mapper para convertir entre entidad Event y DTO
 */
export class EventMapper {
  /**
   * Convierte una entidad Event a un DTO
   * @param event Entidad Event
   * @param attendeesCount Número de asistentes (opcional)
   * @returns DTO del evento
   */
  static toDto(event: Event, attendeesCount?: number): EventDto {
    return {
      id: event.id as string,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      organizerId: event.organizerId,
      capacity: event.capacity,
      attendees: attendeesCount !== undefined ? attendeesCount : (Array.isArray(event.attendees) ? event.attendees.length : 0),
      isActive: event.isActive,
      tags: event.tags || [],
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    };
  }

  /**
   * Convierte un array de entidades Event a un array de DTOs
   * @param events Array de entidades Event
   * @returns Array de DTOs
   */
  static toDtoArray(events: Event[]): EventDto[] {
    return events.map(event => this.toDto(event));
  }
} 