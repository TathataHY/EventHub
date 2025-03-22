import { Query } from '../../core/interfaces/Query';
import { EventDTO } from '../dtos/EventDTO';
import { EventRepository } from '../repositories/EventRepository';
import { EventMapper } from '../mappers/EventMapper';

/**
 * Query para obtener eventos por organizador
 */
export class GetEventsByOrganizerQuery implements Query<EventDTO[]> {
  constructor(
    private readonly organizerId: string,
    private readonly status: string | undefined,
    private readonly eventRepository: EventRepository
  ) {}

  /**
   * Ejecuta la query para obtener eventos por organizador
   * @returns Promise<EventDTO[]>
   */
  async execute(): Promise<EventDTO[]> {
    const events = await this.eventRepository.getEventsByOrganizer(this.organizerId, this.status);
    return EventMapper.toDTOList(events);
  }
} 