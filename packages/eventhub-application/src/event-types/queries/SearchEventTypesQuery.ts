import { Query } from 'eventhub-domain/queries/Query';
import { ValidationException } from 'eventhub-domain/exceptions/ValidationException';
import { EventTypeSearchResultDTO } from '../dtos/EventTypeDTO';
import { EventTypeRepository } from '../repositories/EventTypeRepository';
import { EventTypeMapper } from '../mappers/EventTypeMapper';

interface SearchEventTypesParams {
  page: number;
  limit: number;
  search?: string;
}

export class SearchEventTypesQuery implements Query<SearchEventTypesParams, EventTypeSearchResultDTO> {
  constructor(private readonly eventTypeRepository: EventTypeRepository) {}

  /**
   * Ejecuta la consulta para buscar tipos de eventos con paginación
   */
  async execute(params: SearchEventTypesParams): Promise<EventTypeSearchResultDTO> {
    const { page, limit, search } = params;

    this.validateParams(params);

    const result = await this.eventTypeRepository.findWithPagination(page, limit, search);

    return {
      eventTypes: EventTypeMapper.toDTOList(result.eventTypes),
      total: result.total,
      page,
      limit
    };
  }

  /**
   * Valida los parámetros de búsqueda
   */
  private validateParams(params: SearchEventTypesParams): void {
    if (params.page <= 0) {
      throw new ValidationException('La página debe ser mayor a 0');
    }

    if (params.limit <= 0) {
      throw new ValidationException('El límite debe ser mayor a 0');
    }

    if (params.limit > 100) {
      throw new ValidationException('El límite no puede ser mayor a 100');
    }
  }
} 