import { LocationDTO } from '../dtos/LocationDTO';
import { LocationMapper } from '../mappers/LocationMapper';
import { LocationRepository } from '../repositories/LocationRepository';
import { Query } from '../../core/interfaces/Query';

interface NearbyLocationsParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
}

/**
 * Consulta para buscar ubicaciones cercanas a unas coordenadas
 */
export class FindNearbyLocationsQuery implements Query<NearbyLocationsParams, LocationDTO[]> {
  constructor(private readonly locationRepository: LocationRepository) {}

  /**
   * Ejecuta la consulta para buscar ubicaciones cercanas
   * @param params Parámetros de búsqueda (coordenadas y radio)
   * @returns Lista de DTOs de ubicaciones cercanas
   */
  async execute(params: NearbyLocationsParams): Promise<LocationDTO[]> {
    // Validar parámetros
    this.validateParams(params);

    // Buscar ubicaciones cercanas
    const locations = await this.locationRepository.findNearby(
      params.latitude,
      params.longitude,
      params.radiusKm
    );

    return LocationMapper.toDTOList(locations);
  }

  /**
   * Valida los parámetros de búsqueda
   * @param params Parámetros a validar
   * @throws Error si los parámetros son inválidos
   */
  private validateParams(params: NearbyLocationsParams): void {
    if (params.latitude < -90 || params.latitude > 90) {
      throw new Error('La latitud debe estar entre -90 y 90 grados');
    }

    if (params.longitude < -180 || params.longitude > 180) {
      throw new Error('La longitud debe estar entre -180 y 180 grados');
    }

    if (params.radiusKm <= 0) {
      throw new Error('El radio debe ser un número positivo');
    }
  }
} 