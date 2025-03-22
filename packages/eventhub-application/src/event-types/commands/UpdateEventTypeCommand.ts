import { EventType } from '@eventhub/domain/dist/event-types/entities/EventType';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { UpdateEventTypeDTO } from '../dtos/EventTypeDTO';
import { EventTypeRepository } from '@eventhub/domain/dist/event-types/repositories/EventTypeRepository';

interface UpdateEventTypeParams {
  id: string;
  data: UpdateEventTypeDTO;
}

export class UpdateEventTypeCommand implements Command<UpdateEventTypeParams, EventType> {
  constructor(private readonly eventTypeRepository: EventTypeRepository) {}

  /**
   * Ejecuta el comando para actualizar un tipo de evento
   */
  async execute(params: UpdateEventTypeParams): Promise<EventType> {
    const { id, data } = params;

    // Validar los datos
    this.validateUpdateData(data);

    // Obtener el tipo de evento existente
    const eventType = await this.eventTypeRepository.findById(id);
    if (!eventType) {
      throw new NotFoundException(`Tipo de evento con ID ${id} no encontrado`);
    }

    // Si se intenta cambiar el nombre, verificar que no exista otro con ese nombre
    if (data.name && data.name !== eventType.name) {
      const exists = await this.eventTypeRepository.existsByName(data.name);
      if (exists) {
        throw new ValidationException('Ya existe otro tipo de evento con este nombre');
      }
    }

    // Actualizar campos
    if (data.name !== undefined) {
      eventType.name = data.name;
    }

    if (data.description !== undefined) {
      eventType.description = data.description;
    }

    if (data.iconUrl !== undefined) {
      eventType.iconUrl = data.iconUrl;
    }

    if (data.colorHex !== undefined) {
      eventType.colorHex = data.colorHex;
    }

    if (data.isActive !== undefined) {
      eventType.isActive = data.isActive;
    }

    eventType.updatedAt = new Date();

    // Guardar los cambios
    return this.eventTypeRepository.save(eventType);
  }

  /**
   * Valida los datos de actualización
   */
  private validateUpdateData(data: UpdateEventTypeDTO): void {
    if (data.name && data.name.length > 50) {
      throw new ValidationException('El nombre no puede exceder los 50 caracteres');
    }

    if (data.description && data.description.length > 500) {
      throw new ValidationException('La descripción no puede exceder los 500 caracteres');
    }

    // Validar formato de colorHex si se proporciona
    if (data.colorHex && !/^#[0-9A-Fa-f]{6}$/.test(data.colorHex)) {
      throw new ValidationException('El color debe estar en formato hexadecimal (#RRGGBB)');
    }
  }
} 