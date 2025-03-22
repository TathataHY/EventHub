import { Query } from '../../core/interfaces/Query';
import { TicketRepositoryAdapter } from '../adapters/TicketRepositoryAdapter';
import { TicketFilterOptions, PaginationOptions } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { PaginatedResultMapper, PaginatedTicketsDTO } from '../mappers/PaginatedResultMapper';

/**
 * Consulta para buscar tickets aplicando filtros y paginación
 */
export class FindTicketsQuery implements Query<{filters?: TicketFilterOptions, pagination?: PaginationOptions}, PaginatedTicketsDTO> {
  constructor(
    private ticketRepository: TicketRepositoryAdapter,
    private paginatedResultMapper: PaginatedResultMapper
  ) {}

  /**
   * Ejecuta la consulta para buscar tickets
   * @param params Parámetros con filtros y opciones de paginación
   * @returns Resultado paginado con los tickets que coinciden con los filtros
   */
  async execute(params?: {filters?: TicketFilterOptions, pagination?: PaginationOptions}): Promise<PaginatedTicketsDTO> {
    const filters = params?.filters || {};
    const pagination = params?.pagination || { page: 1, limit: 10 };
    
    // Obtener tickets con filtros y paginación
    const result = await this.ticketRepository.findWithFilters(filters, pagination);
    
    // Transformar a DTO y devolver
    return result;
  }
} 