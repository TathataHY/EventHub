import { Injectable } from '@nestjs/common';
import { Event, EventRepository } from 'eventhub-domain';
import { EventDto } from '../../dtos/event/EventDto';

/**
 * Caso de uso para obtener un evento por su ID
 */
@Injectable()
export class GetEventByIdUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param eventId ID del evento a obtener
   * @returns Datos del evento encontrado
   * @throws Error si el evento no existe
   */
  async execute(eventId: string): Promise<EventDto> {
    const event = await this.eventRepository.findById(eventId);
    
    if (!event) {
      throw new Error('Evento no encontrado');
    }

    return this.toDto(event);
  }

  /**
   * Convierte una entidad de dominio a un DTO
   */
  private toDto(event: Event): EventDto {
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
      updatedAt: event.updatedAt
    };
  }
} 