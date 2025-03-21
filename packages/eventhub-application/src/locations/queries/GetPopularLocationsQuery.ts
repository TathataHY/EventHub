import { LocationRepository } from '../repositories/LocationRepository';
import { Query } from '../../core/interfaces/Query';

interface PopularCityDTO {
  city: string;
  country: string;
  eventCount: number;
}

interface PopularCountryDTO {
  country: string;
  eventCount: number;
}

interface PopularLocationsResult {
  cities: PopularCityDTO[];
  countries: PopularCountryDTO[];
}

/**
 * Consulta para obtener las ubicaciones más populares
 */
export class GetPopularLocationsQuery implements Query<number, PopularLocationsResult> {
  constructor(private readonly locationRepository: LocationRepository) {}

  /**
   * Ejecuta la consulta para obtener las ubicaciones más populares
   * @param limit Límite de ubicaciones a retornar por categoría
   * @returns Resultado con ciudades y países populares
   */
  async execute(limit: number): Promise<PopularLocationsResult> {
    // Validar límite
    if (limit <= 0) {
      throw new Error('El límite debe ser un número positivo');
    }

    // Obtener ciudades y países populares en paralelo
    const [popularCities, popularCountries] = await Promise.all([
      this.locationRepository.getPopularCities(limit),
      this.locationRepository.getPopularCountries(limit)
    ]);

    return {
      cities: popularCities,
      countries: popularCountries
    };
  }
} 