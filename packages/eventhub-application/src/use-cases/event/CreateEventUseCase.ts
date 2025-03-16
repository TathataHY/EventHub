import { Injectable } from '@nestjs/common';
import { Event, EventRepository, EventCreateException } from 'eventhub-domain';
import { CreateEventDto } from '../../dtos/event/CreateEventDto';
import { EventDto } from '../../dtos/event/EventDto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de uso para crear un nuevo evento
 */
@Injectable()
export class CreateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param dto Datos para crear el evento
   * @returns Datos del evento creado
   * @throws Error si los datos del evento no son válidos o si ocurre un error al guardar
   */
  async execute(dto: CreateEventDto): Promise<EventDto> {
    try {
      // Crear la entidad de dominio
      const event = new Event({
        id: uuidv4(),
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        location: dto.location,
        organizerId: dto.organizerId,
        capacity: dto.capacity,
        tags: dto.tags,
      });

      // Guardar en el repositorio
      const savedEvent = await this.eventRepository.save(event);

      // Transformar a DTO para la respuesta
      return this.toDto(savedEvent);
    } catch (error) {
      // Manejar excepciones del dominio
      if (error instanceof EventCreateException) {
        throw new Error(`Error de validación: ${error.message}`);
      }

      // Otros errores
      throw new Error(`Error al crear el evento: ${error.message}`);
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