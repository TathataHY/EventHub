import { EventType } from '@eventhub/domain/dist/event-types/entities/EventType';
import { Command } from '../../core/interfaces/Command';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { CreateEventTypeDTO } from '../dtos/EventTypeDTO';
import { EventTypeRepository } from '@eventhub/domain/dist/event-types/repositories/EventTypeRepository';
import { EventTypeMapper } from '../mappers/EventTypeMapper';

export class CreateEventTypeCommand implements Command<CreateEventTypeDTO, EventType> {
  constructor(private readonly eventTypeRepository: EventTypeRepository) {}

  /**
   * Ejecuta el comando para crear un tipo de evento
   */
  async execute(data: CreateEventTypeDTO): Promise<EventType> {
    this.validateEventTypeData(data);
    
    const exists = await this.eventTypeRepository.existsByName(data.name);
    if (exists) {
      throw new ValidationException('Ya existe un tipo de evento con este nombre');
    }

    const eventType = EventTypeMapper.toDomain(data);
    return this.eventTypeRepository.save(eventType);
  }

  /**
   * Valida los datos del tipo de evento
   */
  private validateEventTypeData(data: CreateEventTypeDTO): void {
    if (!data.name) {
      throw new ValidationException('El nombre es requerido');
    }

    if (data.name.length > 50) {
      throw new ValidationException('El nombre no puede exceder los 50 caracteres');
    }

    if (!data.description) {
      throw new ValidationException('La descripción es requerida');
    }

    if (data.description.length > 500) {
      throw new ValidationException('La descripción no puede exceder los 500 caracteres');
    }

    if (data.iconUrl && data.iconUrl.length > 2000) {
      throw new ValidationException('La URL del icono no puede exceder los 2000 caracteres');
    }

    if (data.colorHex && !/^#[0-9A-Fa-f]{6}$/.test(data.colorHex)) {
      throw new ValidationException('El color debe estar en formato hexadecimal (#RRGGBB)');
    }
  }
} 