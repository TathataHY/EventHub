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
  
  findByName(name: string): Promise<Location[]>;
  
  findByCity(city: string): Promise<Location[]>;
  
  findByCountry(country: string): Promise<Location[]>;
  
  findNearby(coordinates: Coordinates, radiusKm: number): Promise<Location[]>;
  
  searchByText(query: string): Promise<Location[]>;
  
  findByCapacityRange(minCapacity: number, maxCapacity: number): Promise<Location[]>;
  
  findActiveLocations(): Promise<Location[]>;
  
  findInactiveLocations(): Promise<Location[]>;
} 