import { Event } from 'eventhub-domain';
import { UpdateEventDTO } from '../dtos/UpdateEventDTO';
import { EventRepository } from '../repositories/EventRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Comando para actualizar un evento existente
 */
export class UpdateEventCommand implements Command<void> {
  constructor(
    private readonly eventId: string,
    private readonly eventData: UpdateEventDTO,
    private readonly eventRepository: EventRepository
  ) {}

  /**
   * Ejecuta el comando para actualizar un evento
   * @returns Promise<void>
   * @throws NotFoundException si no se encuentra el evento
   * @throws Error si hay problemas durante la actualización
   */
  async execute(): Promise<void> {
    // Buscar el evento por ID
    const event = await this.eventRepository.findById(this.eventId);
    if (!event) {
      throw new NotFoundException(`Evento con ID ${this.eventId} no encontrado`);
    }

    // Validar los datos de actualización
    this.validate();

    // Actualizar propiedades si se proporcionaron
    if (this.eventData.title !== undefined) {
      event.updateTitle(this.eventData.title);
    }

    if (this.eventData.description !== undefined) {
      event.updateDescription(this.eventData.description);
    }

    if (this.eventData.startDate !== undefined) {
      event.updateStartDate(this.eventData.startDate);
    }

    if (this.eventData.endDate !== undefined) {
      event.updateEndDate(this.eventData.endDate);
    }

    if (this.eventData.location !== undefined) {
      event.updateLocation(this.eventData.location);
    }

    if (this.eventData.capacity !== undefined) {
      event.updateCapacity(this.eventData.capacity);
    }

    if (this.eventData.tags !== undefined) {
      event.updateTags(this.eventData.tags);
    }

    if (this.eventData.isActive !== undefined) {
      if (this.eventData.isActive) {
        event.activate();
      } else {
        event.deactivate();
      }
    }

    // Guardar el evento actualizado
    await this.eventRepository.save(event);
  }

  /**
   * Valida los datos de actualización
   * @throws Error si los datos son inválidos
   */
  private validate(): void {
    if (this.eventData.startDate && this.eventData.endDate) {
      const startDate = new Date(this.eventData.startDate);
      const endDate = new Date(this.eventData.endDate);
      if (startDate > endDate) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    if (this.eventData.capacity !== undefined && this.eventData.capacity < 0) {
      throw new Error('La capacidad no puede ser negativa');
    }
  }
} 