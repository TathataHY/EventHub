import { Query } from '../../core/interfaces/Query';
import { EventDTO } from '../dtos/EventDTO';
import { EventFiltersDTO } from '../dtos/EventFiltersDTO';
import { EventRepository } from '../repositories/EventRepository';
import { EventMapper } from '../mappers/EventMapper';

/**
 * Query para buscar eventos según filtros
 */
export class SearchEventsQuery implements Query<{ events: EventDTO[]; total: number }> {
  constructor(
    private readonly filters: EventFiltersDTO,
    private readonly eventRepository: EventRepository
  ) {}

  /**
   * Ejecuta la query para buscar eventos
   * @returns Promise con lista de eventos y total
   */
  async execute(): Promise<{ events: EventDTO[]; total: number }> {
    // Obtener eventos según los filtros
    const [events, total] = await Promise.all([
      this.eventRepository.searchEvents(this.filters),
      this.eventRepository.countEvents(this.filters)
    ]);

    return {
      events: EventMapper.toDTOList(events),
      total
    };
  }
} 