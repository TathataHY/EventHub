import { Query } from '../../core/interfaces/Query';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { EventTypeDTO } from '../dtos/EventTypeDTO';
import { EventTypeRepository } from '../repositories/EventTypeRepository';
import { EventTypeMapper } from '../mappers/EventTypeMapper';

export class GetEventTypeQuery implements Query<string, EventTypeDTO> {
  constructor(private readonly eventTypeRepository: EventTypeRepository) {}

  /**
   * Ejecuta la consulta para obtener un tipo de evento por ID
   */
  async execute(id: string): Promise<EventTypeDTO> {
    if (!id) {
      throw new ValidationException('El ID del tipo de evento es requerido');
    }

    const eventType = await this.eventTypeRepository.findById(id);
    if (!eventType) {
      throw new NotFoundException(`Tipo de evento con ID ${id} no encontrado`);
    }

    return EventTypeMapper.toDTO(eventType);
  }
} 