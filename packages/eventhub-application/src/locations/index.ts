// Re-exportamos las interfaces de dominio
export { 
  LocationRepository,
  LocationFilters,
  PaginationOptions
} from '@eventhub/domain/src/locations/repositories/LocationRepository';

// DTOs
export * from './dtos/LocationDTO';
export * from './dtos/PopularLocationDTO';

// Commands
export * from './commands/CreateLocationCommand';
export * from './commands/UpdateLocationCommand';
export * from './commands/DeleteLocationCommand';

// Queries
export * from './queries/GetLocationByIdQuery';
export * from './queries/GetLocationsQuery';
export * from './queries/GetPopularLocationsQuery';

// Mappers
export * from './mappers/LocationMapper';

// Services
export * from './services/LocationService'; 