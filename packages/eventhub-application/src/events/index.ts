// Re-exportamos las interfaces de dominio
export { 
  EventRepository,
  EventFilters,
  PaginationOptions,
  PaginatedEventsResult
} from '@eventhub/domain/src/events/repositories/EventRepository';

// DTOs
export * from './dtos/CreateEventDTO';
export * from './dtos/EventDTO';
export * from './dtos/UpdateEventDTO';
export * from './dtos/EventFiltersDTO';

// Commands
export * from './commands/CreateEventCommand';
export * from './commands/UpdateEventCommand';
export * from './commands/DeleteEventCommand';
export * from './commands/AddAttendeeCommand';
export * from './commands/RemoveAttendeeCommand';
export * from './commands/AssignEventCategoriesCommand';
export * from './commands/UploadEventImageCommand';
export * from './commands/SendEventConfirmationCommand';

// Queries
export * from './queries/GetEventByIdQuery';
export * from './queries/GetEventsByOrganizerQuery';
export * from './queries/SearchEventsQuery';

// Mappers
export * from './mappers/EventMapper';

// Services
export * from './services/EventService';

// Adapters
export { EventAdapter } from './adapters/EventAdapter';
export { EventRepositoryAdapter } from './adapters/EventRepositoryAdapter';

// Service factory
export const createEventService = (dependencies: any): EventService => {
  return new EventService(dependencies);
}; 