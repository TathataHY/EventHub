import { Injectable } from '@nestjs/common';
import { Event, EventRepository, EventUpdateException } from 'eventhub-domain';
import { EventDto } from '../../dtos/event/EventDto';

/**
 * Caso de uso para cancelar un evento
 */
@Injectable()
export class CancelEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param eventId ID del evento a cancelar
   * @param userId ID del usuario que cancela el evento (debe ser el organizador)
   * @returns Datos del evento cancelado
   * @throws Error si el evento no existe, si el usuario no es el organizador o si ocurre otro error
   */
  async execute(eventId: string, userId: string): Promise<EventDto> {
    try {
      // Verificar si el evento existe
      const event = await this.eventRepository.findById(eventId);
      if (!event) {
        throw new Error('Evento no encontrado');
      }

      // Verificar si el usuario es el organizador
      if (!event.isOrganizer(userId)) {
        throw new Error('Solo el organizador puede cancelar el evento');
      }

      // Cancelar el evento
      event.cancelEvent();

      // Guardar los cambios
      const updatedEvent = await this.eventRepository.update(event);

      // Transformar a DTO para la respuesta
      return this.toDto(updatedEvent);
    } catch (error) {
      // Manejar excepciones específicas del dominio
      if (error instanceof EventUpdateException) {
        throw new Error(`Error al cancelar el evento: ${error.message}`);
      }

      // Re-lanzar el error original si no es una excepción específica
      throw error;
    }
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