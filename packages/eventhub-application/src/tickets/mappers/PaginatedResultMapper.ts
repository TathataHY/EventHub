import { Mapper } from '../../core/interfaces/Mapper';
import { PaginatedTicketsResult } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { TicketMapper } from './TicketMapper';
import { TicketDTO } from '../dtos/TicketDTO';

/**
 * Resultado paginado de tickets para la capa de aplicación
 */
export interface PaginatedTicketsDTO {
  tickets: TicketDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Mapper para convertir resultados paginados de tickets entre el dominio y la capa de aplicación
 */
export class PaginatedResultMapper implements Mapper<PaginatedTicketsResult, PaginatedTicketsDTO> {
  constructor(private ticketMapper: TicketMapper) {}

  /**
   * Convierte un resultado paginado del dominio a un DTO para la capa de aplicación
   * @param domain Resultado paginado del dominio
   * @returns DTO con el resultado paginado
   */
  toDTO(domain: PaginatedTicketsResult): PaginatedTicketsDTO {
    if (!domain) {
      return {
        tickets: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
    
    return {
      tickets: domain.tickets.map(ticket => this.ticketMapper.toDTO(ticket)),
      total: domain.total,
      page: domain.page,
      limit: domain.limit,
      totalPages: Math.ceil(domain.total / domain.limit)
    };
  }

  /**
   * Convierte un DTO de resultado paginado a su equivalente en el dominio
   * (Este método no suele utilizarse directamente)
   * @param dto DTO de resultado paginado
   * @returns Resultado paginado en formato de dominio
   */
  toDomain(dto: PaginatedTicketsDTO): PaginatedTicketsResult {
    if (!dto) {
      return {
        tickets: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };
    }
    
    return {
      tickets: dto.tickets.map(ticket => this.ticketMapper.toDomain(ticket)),
      total: dto.total,
      page: dto.page,
      limit: dto.limit,
      totalPages: dto.totalPages
    };
  }
} 