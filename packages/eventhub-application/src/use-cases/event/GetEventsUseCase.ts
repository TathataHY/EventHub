import { Injectable } from '@nestjs/common';
import { Event, EventRepository } from 'eventhub-domain';
import { EventDto } from '../../dtos/event/EventDto';

/**
 * DTO para los filtros de búsqueda de eventos
 */
export interface EventFilters {
  organizerId?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  query?: string; // búsqueda en título o descripción
  tags?: string[];
}

/**
 * Caso de uso para obtener eventos con filtros opcionales
 */
@Injectable()
export class GetEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param filters Filtros opcionales para la búsqueda
   * @param page Número de página para paginación
   * @param limit Límite de resultados por página
   * @returns Lista de eventos que cumplen con los filtros
   */
  async execute(filters: EventFilters = {}, page = 1, limit = 10): Promise<{ events: EventDto[], total: number }> {
    // Obtener los eventos según los filtros
    const { events, total } = await this.eventRepository.findWithFilters(
      filters,
      page,
      limit
    );

    // Transformar a DTOs para la respuesta
    const eventDtos = events.map(event => this.toDto(event));

    return {
      events: eventDtos,
      total
    };
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