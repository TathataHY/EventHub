import { Media } from '@eventhub/shared/domain/media/Media';
import { MediaDTO, CreateMediaDTO } from '../dtos/MediaDTO';

export class MediaMapper {
  /**
   * Convierte una entidad de dominio a DTO
   */
  static toDTO(domain: Media): MediaDTO {
    return {
      id: domain.id,
      fileName: domain.fileName,
      fileSize: domain.fileSize,
      mimeType: domain.mimeType,
      url: domain.url,
      thumbnailUrl: domain.thumbnailUrl,
      entityId: domain.entityId,
      entityType: domain.entityType,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades de dominio a DTOs
   */
  static toDTOList(domains: Media[]): MediaDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Convierte un DTO de creación a entidad de dominio
   */
  static toDomain(dto: CreateMediaDTO): Media {
    return new Media({
      fileName: dto.fileName,
      fileSize: dto.fileSize,
      mimeType: dto.mimeType,
      url: dto.url,
      thumbnailUrl: dto.thumbnailUrl,
      entityId: dto.entityId,
      entityType: dto.entityType
    });
  }
} 