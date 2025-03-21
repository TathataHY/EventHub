import { EventRepository } from '../repositories/EventRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Comando para eliminar un evento existente
 */
export class DeleteEventCommand implements Command<void> {
  constructor(
    private readonly eventId: string,
    private readonly eventRepository: EventRepository
  ) {}

  /**
   * Ejecuta el comando para eliminar un evento
   * @returns Promise<void>
   * @throws NotFoundException si no se encuentra el evento
   */
  async execute(): Promise<void> {
    // Verificar que el evento exista
    const existingEvent = await this.eventRepository.findById(this.eventId);
    if (!existingEvent) {
      throw new NotFoundException(`Evento con ID ${this.eventId} no encontrado`);
    }

    // Eliminar el evento
    await this.eventRepository.delete(this.eventId);
  }
} 