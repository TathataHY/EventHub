import { Query } from '../../core/interfaces/Query';
import { EventDTO } from '../dtos/EventDTO';
import { EventRepository } from '../../../../eventhub-domain/src/events/repositories/EventRepository';
import { EventMapper } from '../mappers/EventMapper';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Query para obtener un evento por su ID
 */
export class GetEventByIdQuery implements Query<EventDTO> {
  constructor(
    private readonly eventId: string,
    private readonly eventRepository: EventRepository
  ) {}

  /**
   * Ejecuta la query para obtener un evento por ID
   * @returns Promise<EventDTO>
   * @throws NotFoundException si no se encuentra el evento
   */
  async execute(): Promise<EventDTO> {
    const event = await this.eventRepository.findById(this.eventId);
    
    if (!event) {
      throw new NotFoundException(`Evento con ID ${this.eventId} no encontrado`);
    }
    
    return EventMapper.toDTO(event);
  }
} 