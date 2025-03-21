import { EventType } from '@eventhub/domain/dist/event-types/EventType';
import { EventTypeDTO, CreateEventTypeDTO } from '../dtos/EventTypeDTO';

export class EventTypeMapper {
  /**
   * Convierte una entidad de dominio a DTO
   */
  static toDTO(domain: EventType): EventTypeDTO {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      iconUrl: domain.iconUrl,
      colorHex: domain.colorHex,
      isActive: domain.isActive,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades de dominio a DTOs
   */
  static toDTOList(domains: EventType[]): EventTypeDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Convierte un DTO de creación a entidad de dominio
   */
  static toDomain(dto: CreateEventTypeDTO): EventType {
    return new EventType({
      name: dto.name,
      description: dto.description,
      iconUrl: dto.iconUrl,
      colorHex: dto.colorHex,
      isActive: true
    });
  }
} 