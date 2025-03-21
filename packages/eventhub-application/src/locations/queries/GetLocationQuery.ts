import { Location } from 'eventhub-domain';
import { LocationDTO } from '../dtos/LocationDTO';
import { LocationMapper } from '../mappers/LocationMapper';
import { LocationRepository } from '../repositories/LocationRepository';
import { Query } from '../../core/interfaces/Query';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Consulta para obtener una ubicación por ID
 */
export class GetLocationQuery implements Query<string, LocationDTO> {
  constructor(private readonly locationRepository: LocationRepository) {}

  /**
   * Ejecuta la consulta para obtener una ubicación
   * @param id ID de la ubicación a obtener
   * @returns DTO de la ubicación
   */
  async execute(id: string): Promise<LocationDTO> {
    const location = await this.locationRepository.findById(id);
    if (!location) {
      throw new NotFoundException(`No se encontró la ubicación con ID ${id}`);
    }

    return LocationMapper.toDTO(location);
  }
} 