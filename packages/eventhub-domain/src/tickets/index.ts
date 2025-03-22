/**
 * Módulo de tickets
 * 
 * Este módulo gestiona todo lo relacionado con los tickets para eventos,
 * incluyendo su creación, actualización, compra y cancelación.
 * 
 * Exporta entidades, objetos de valor, repositorios y excepciones para
 * facilitar la integración con otras partes del sistema.
 * 
 * @module tickets
 */

// Entities
export { Ticket, TicketProps, TicketCreateProps, TicketUpdateProps } from './entities/Ticket';

// Value Objects
export { TicketType, TicketTypeEnum } from './value-objects/TicketType';
export { TicketStatus, TicketStatusEnum } from './value-objects/TicketStatus';

// Repositories
export { 
  TicketRepository, 
  TicketFilterOptions, 
  PaginationOptions,
  PaginatedTicketsResult
} from './repositories/TicketRepository';

// Exceptions
export { TicketCreateException } from './exceptions/TicketCreateException';
export { TicketUpdateException } from './exceptions/TicketUpdateException'; 