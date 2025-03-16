import { Injectable } from '@nestjs/common';
import { Event, EventRepository, EventUpdateException, EventCreateException } from 'eventhub-domain';
import { UpdateEventDto } from '../../dtos/event/UpdateEventDto';
import { EventDto } from '../../dtos/event/EventDto';

/**
 * Caso de uso para actualizar un evento existente
 */
@Injectable()
export class UpdateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param id ID del evento a actualizar
   * @param dto Datos para actualizar el evento
   * @param userId ID del usuario que realiza la actualización
   * @returns Datos del evento actualizado
   * @throws Error si los datos del evento no son válidos, si el evento no existe o si el usuario no es el organizador
   */
  async execute(id: string, dto: UpdateEventDto, userId: string): Promise<EventDto> {
    try {
      // Buscar el evento en el repositorio
      const event = await this.eventRepository.findById(id);
      
      // Verificar si el evento existe
      if (!event) {
        throw new Error('Evento no encontrado');
      }

      // Verificar si el usuario es el organizador del evento
      if (!event.isOrganizer(userId)) {
        throw new Error('No tienes permiso para actualizar este evento');
      }

      // Actualizar la entidad de dominio
      event.update({
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        location: dto.location,
        capacity: dto.capacity,
        tags: dto.tags
      });

      // Guardar en el repositorio
      const updatedEvent = await this.eventRepository.update(event);

      // Transformar a DTO para la respuesta
      return this.toDto(updatedEvent);
    } catch (error) {
      // Manejar excepciones específicas del dominio
      if (error instanceof EventUpdateException) {
        throw new Error(`Error de validación: ${error.message}`);
      }
      
      if (error instanceof EventCreateException) {
        throw new Error(`Error de validación: ${error.message}`);
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