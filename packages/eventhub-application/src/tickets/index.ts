// Repositorios y adaptadores
import { TicketRepositoryAdapter } from './adapters/TicketRepositoryAdapter';

// Importaciones de tipos
import type { 
  TicketRepository, 
  TicketFilterOptions, 
  PaginationOptions, 
  PaginatedTicketsResult 
} from '@eventhub/domain/dist/tickets/repositories/TicketRepository';

// DTOs
import { CreateTicketDTO } from './dtos/CreateTicketDTO';
import { UpdateTicketDTO } from './dtos/UpdateTicketDTO';
import { TicketDTO } from './dtos/TicketDTO';

// Mappers
import { TicketMapper } from './mappers/TicketMapper';
import { PaginatedResultMapper } from './mappers/PaginatedResultMapper';

// Commands
import { CreateTicketCommand } from './commands/CreateTicketCommand';
import { UpdateTicketCommand } from './commands/UpdateTicketCommand';
import { ValidateTicketCommand } from './commands/ValidateTicketCommand';
import { CancelTicketCommand } from './commands/CancelTicketCommand';
import { GenerateTicketPdfCommand } from './commands/GenerateTicketPdfCommand';
import { SendTicketByEmailCommand } from './commands/SendTicketByEmailCommand';

// Queries
import { GetTicketQuery } from './queries/GetTicketQuery';
import { GetTicketsByEventQuery } from './queries/GetTicketsByEventQuery';
import { GetTicketsByUserQuery } from './queries/GetTicketsByUserQuery';
import { GetTicketsByStatusQuery } from './queries/GetTicketsByStatusQuery';
import { GetTicketsByTypeQuery } from './queries/GetTicketsByTypeQuery';
import { FindTicketsQuery } from './queries/FindTicketsQuery';

// Tipos
export type {
  TicketRepository,
  TicketFilterOptions,
  PaginationOptions,
  PaginatedTicketsResult,
  // DTOs
  CreateTicketDTO,
  UpdateTicketDTO,
  TicketDTO
};

// Adaptadores
export {
  TicketRepositoryAdapter
};

// Mappers
export {
  TicketMapper,
  PaginatedResultMapper
};

// Commands
export {
  CreateTicketCommand,
  UpdateTicketCommand,
  ValidateTicketCommand,
  CancelTicketCommand,
  GenerateTicketPdfCommand,
  SendTicketByEmailCommand
};

// Queries
export {
  GetTicketQuery,
  GetTicketsByEventQuery,
  GetTicketsByUserQuery,
  GetTicketsByStatusQuery,
  GetTicketsByTypeQuery,
  FindTicketsQuery
}; 