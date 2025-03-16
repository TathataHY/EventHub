import { EventRepository } from 'eventhub-domain';
import { EventDto } from '../../dto/event/EventDto';

/**
 * Caso de uso para obtener un evento por ID
 */
export class GetEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param id ID del evento a buscar
   * @returns DTO con los datos del evento o null si no existe
   */
  async execute(id: string): Promise<EventDto | null> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      return null;
    }

    // Mapear a DTO para retornar
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      organizerId: event.organizerId,
      capacity: event.capacity,
      attendees: event.attendees,
      isActive: event.isActive,
      tags: event.tags,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
} 