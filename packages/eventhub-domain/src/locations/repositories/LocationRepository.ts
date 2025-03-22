import { Repository } from '../../core/interfaces/Repository';
import { Location } from '../entities/Location';
import { Coordinates } from '../value-objects/Coordinates';

export interface LocationFilters {
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive?: boolean;
  minCapacity?: number;
  maxCapacity?: number;
  query?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface LocationRepository extends Repository<string, Location> {
  findAll(filters?: LocationFilters, pagination?: PaginationOptions): Promise<{
    locations: Location[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  /**
   * Busca ubicaciones por nombre
   * @param name Nombre o parte del nombre de la ubicación
   * @returns Lista de ubicaciones que coinciden con el nombre
   */
  findByName(name: string): Promise<Location[]>;
  
  /**
   * Busca ubicaciones por ciudad
   * @param city Nombre de la ciudad
   * @returns Lista de ubicaciones en la ciudad
   */
  findByCity(city: string): Promise<Location[]>;
  
  /**
   * Busca ubicaciones por país
   * @param country Nombre del país
   * @returns Lista de ubicaciones en el país
   */
  findByCountry(country: string): Promise<Location[]>;
  
  /**
   * Busca ubicaciones cercanas a unas coordenadas
   * @param coordinates Coordenadas del punto central
   * @param radiusKm Radio en kilómetros
   * @returns Lista de ubicaciones dentro del radio
   */
  findNearby(coordinates: Coordinates, radiusKm: number): Promise<Location[]>;
  
  /**
   * Busca ubicaciones por texto
   * @param query Texto a buscar
   * @returns Lista de ubicaciones que coinciden con el texto
   */
  searchByText(query: string): Promise<Location[]>;
  
  /**
   * Busca ubicaciones por rango de capacidad
   * @param minCapacity Capacidad mínima
   * @param maxCapacity Capacidad máxima
   * @returns Lista de ubicaciones dentro del rango de capacidad
   */
  findByCapacityRange(minCapacity: number, maxCapacity: number): Promise<Location[]>;
  
  /**
   * Busca ubicaciones activas
   * @returns Lista de ubicaciones activas
   */
  findActiveLocations(): Promise<Location[]>;
  
  /**
   * Busca ubicaciones inactivas
   * @returns Lista de ubicaciones inactivas
   */
  findInactiveLocations(): Promise<Location[]>;
  
  /**
   * Obtiene las ciudades más populares basadas en la cantidad de eventos
   * @param limit Límite de ciudades a retornar
   * @returns Lista de ciudades con su conteo de eventos
   */
  getPopularCities(limit: number): Promise<{ city: string; country: string; eventCount: number }[]>;
  
  /**
   * Obtiene los países más populares basados en la cantidad de eventos
   * @param limit Límite de países a retornar
   * @returns Lista de países con su conteo de eventos
   */
  getPopularCountries(limit: number): Promise<{ country: string; eventCount: number }[]>;
} 