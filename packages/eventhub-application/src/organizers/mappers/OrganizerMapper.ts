import { Organizer } from '@eventhub/domain/dist/organizers/entities/Organizer';
import { OrganizerDTO, CreateOrganizerDTO, UpdateOrganizerDTO } from '../dtos/OrganizerDTO';

export class OrganizerMapper {
  /**
   * Convierte una entidad de dominio a DTO
   */
  static toDTO(domain: Organizer): OrganizerDTO {
    return {
      id: domain.id,
      userId: domain.userId,
      name: domain.name,
      description: domain.description,
      website: domain.website,
      email: domain.email,
      phone: domain.phone,
      logoUrl: domain.logoUrl,
      socialMedia: domain.socialMedia,
      verified: domain.verified,
      verificationDate: domain.verificationDate,
      rating: domain.rating,
      eventCount: domain.eventCount,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades de dominio a DTOs
   */
  static toDTOList(domains: Organizer[]): OrganizerDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Convierte un DTO de creación a entidad de dominio
   */
  static toDomain(dto: CreateOrganizerDTO): Organizer {
    return new Organizer({
      userId: dto.userId,
      name: dto.name,
      description: dto.description,
      website: dto.website,
      email: dto.email,
      phone: dto.phone,
      logoUrl: dto.logoUrl,
      socialMedia: dto.socialMedia,
      verified: false,
      rating: 0,
      eventCount: 0
    });
  }

  /**
   * Convierte un DTO de actualización a entidad de dominio parcial
   */
  static toPartialDomain(dto: UpdateOrganizerDTO): Partial<Organizer> {
    const update: Partial<Organizer> = {};

    if (dto.name !== undefined) update.name = dto.name;
    if (dto.description !== undefined) update.description = dto.description;
    if (dto.website !== undefined) update.website = dto.website;
    if (dto.email !== undefined) update.email = dto.email;
    if (dto.phone !== undefined) update.phone = dto.phone;
    if (dto.logoUrl !== undefined) update.logoUrl = dto.logoUrl;
    if (dto.socialMedia !== undefined) update.socialMedia = dto.socialMedia;

    return update;
  }
} 