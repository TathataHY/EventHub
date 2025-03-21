import { Event } from 'eventhub-domain';
import { EventDTO } from '../dtos/EventDTO';

/**
 * Clase para mapear entre entidades de dominio Event y DTOs de aplicación
 */
export class EventMapper {
  /**
   * Convierte una entidad Event de dominio a un DTO de aplicación
   * @param domain Entidad de dominio
   * @returns DTO de aplicación
   */
  static toDTO(domain: Event): EventDTO {
    return {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      startDate: domain.startDate,
      endDate: domain.endDate,
      location: domain.location,
      organizerId: domain.organizerId,
      capacity: domain.capacity,
      attendees: domain.attendees || [],
      isActive: domain.isActive,
      tags: domain.tags || [],
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades Event a una lista de DTOs
   * @param domains Lista de entidades
   * @returns Lista de DTOs
   */
  static toDTOList(domains: Event[]): EventDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Convierte un DTO a una entidad de dominio parcial (para actualizaciones)
   * @param dto DTO parcial con propiedades a actualizar
   * @returns Objeto con propiedades actualizables
   */
  static toPartialDomain(dto: Partial<EventDTO>): Partial<Event> {
    const partialEvent: Partial<Event> = {};

    if (dto.title !== undefined) partialEvent.title = dto.title;
    if (dto.description !== undefined) partialEvent.description = dto.description;
    if (dto.startDate !== undefined) partialEvent.startDate = dto.startDate;
    if (dto.endDate !== undefined) partialEvent.endDate = dto.endDate;
    if (dto.location !== undefined) partialEvent.location = dto.location;
    if (dto.capacity !== undefined) partialEvent.capacity = dto.capacity;
    if (dto.tags !== undefined) partialEvent.tags = dto.tags;
    if (dto.isActive !== undefined) partialEvent.isActive = dto.isActive;

    return partialEvent;
  }
} 