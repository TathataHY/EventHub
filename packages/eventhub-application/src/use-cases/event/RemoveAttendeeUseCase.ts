import { Injectable } from '@nestjs/common';
import { EventRepository, UserRepository, Event, EventAttendanceException } from 'eventhub-domain';
import { EventDto } from '../../dtos/event/EventDto';

/**
 * Caso de uso para remover un asistente de un evento
 */
@Injectable()
export class RemoveAttendeeUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Elimina un asistente de un evento
   * @param eventId ID del evento
   * @param userId ID del usuario a eliminar como asistente
   * @returns El evento actualizado sin el asistente
   */
  async execute(eventId: string, userId: string): Promise<EventDto> {
    try {
      // Buscar evento
      const event = await this.eventRepository.findById(eventId);
      if (!event) {
        throw new Error(`Evento con ID ${eventId} no encontrado`);
      }

      // Buscar usuario
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error(`Usuario con ID ${userId} no encontrado`);
      }

      // Eliminar asistente y guardar
      event.removeAttendee(userId);
      const updatedEvent = await this.eventRepository.save(event);

      // Convertir a DTO
      return this.toDto(updatedEvent);
    } catch (error) {
      if (error instanceof EventAttendanceException) {
        throw new Error(`Error al eliminar asistente: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Convierte un evento de dominio a un DTO
   * @param event Evento de dominio
   * @returns EventDto
   */
  private toDto(event: Event): EventDto {
    const dto = new EventDto();
    dto.id = event.id;
    dto.title = event.title;
    dto.description = event.description;
    dto.startDate = event.startDate;
    dto.endDate = event.endDate;
    dto.location = event.location;
    dto.organizerId = event.organizerId;
    dto.capacity = event.capacity;
    dto.attendees = event.attendees;
    dto.isActive = event.isActive;
    dto.tags = event.tags;
    dto.createdAt = event.createdAt;
    dto.updatedAt = event.updatedAt;
    return dto;
  }
} 