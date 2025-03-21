import { Query } from '../../core/interfaces/Query';
import { EventTypeDTO } from '../dtos/EventTypeDTO';
import { EventTypeRepository } from '@eventhub/domain/dist/event-types/repositories/EventTypeRepository';
import { EventTypeMapper } from '../mappers/EventTypeMapper';

export class GetActiveEventTypesQuery implements Query<void, EventTypeDTO[]> {
  constructor(private readonly eventTypeRepository: EventTypeRepository) {}

  /**
   * Ejecuta la consulta para obtener los tipos de eventos activos
   */
  async execute(): Promise<EventTypeDTO[]> {
    const eventTypes = await this.eventTypeRepository.findActive();
    return EventTypeMapper.toDTOList(eventTypes);
  }
} 