import { Location } from 'eventhub-domain';
import { LocationDTO } from '../dtos/LocationDTO';

/**
 * Clase para mapear entre entidades de dominio Location y DTOs de aplicación
 */
export class LocationMapper {
  /**
   * Convierte una entidad Location de dominio a un DTO de aplicación
   * @param domain Entidad de dominio
   * @returns DTO de aplicación
   */
  static toDTO(domain: Location): LocationDTO {
    return {
      id: domain.id,
      name: domain.name,
      address: domain.address,
      city: domain.city,
      state: domain.state,
      country: domain.country,
      postalCode: domain.postalCode,
      latitude: domain.latitude,
      longitude: domain.longitude,
      capacity: domain.capacity,
      description: domain.description,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades Location a una lista de DTOs
   * @param domains Lista de entidades
   * @returns Lista de DTOs
   */
  static toDTOList(domains: Location[]): LocationDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Convierte un DTO a una entidad de dominio parcial (para actualizaciones)
   * @param dto DTO parcial con propiedades a actualizar
   * @returns Objeto con propiedades actualizables
   */
  static toPartialDomain(dto: Partial<LocationDTO>): Partial<Location> {
    const partialLocation: Partial<Location> = {};

    if (dto.name !== undefined) partialLocation.name = dto.name;
    if (dto.address !== undefined) partialLocation.address = dto.address;
    if (dto.city !== undefined) partialLocation.city = dto.city;
    if (dto.state !== undefined) partialLocation.state = dto.state;
    if (dto.country !== undefined) partialLocation.country = dto.country;
    if (dto.postalCode !== undefined) partialLocation.postalCode = dto.postalCode;
    if (dto.latitude !== undefined) partialLocation.latitude = dto.latitude;
    if (dto.longitude !== undefined) partialLocation.longitude = dto.longitude;
    if (dto.capacity !== undefined) partialLocation.capacity = dto.capacity;
    if (dto.description !== undefined) partialLocation.description = dto.description;

    return partialLocation;
  }
} 