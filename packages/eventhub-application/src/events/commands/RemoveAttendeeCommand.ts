import { EventRepository } from '../repositories/EventRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException } from '../../core/exceptions';

/**
 * Command para eliminar un asistente de un evento
 */
export class RemoveAttendeeCommand implements Command<void> {
  constructor(
    private readonly eventId: string,
    private readonly attendeeId: string,
    private readonly eventRepository: EventRepository
  ) {}

  /**
   * Ejecuta el comando para eliminar un asistente de un evento
   * @returns Promise<void>
   * @throws NotFoundException si el evento no existe
   * @throws ValidationException si hay problemas de validación
   */
  async execute(): Promise<void> {
    // Validar datos
    if (!this.eventId || !this.attendeeId) {
      throw new ValidationException('ID de evento y asistente son requeridos');
    }

    // Obtener el evento
    const event = await this.eventRepository.findById(this.eventId);
    if (!event) {
      throw new NotFoundException('Evento', this.eventId);
    }

    // Verificar si el asistente está registrado
    if (!event.attendees || !event.attendees.includes(this.attendeeId)) {
      throw new ValidationException('El usuario no está registrado en este evento');
    }

    // Eliminar asistente
    event.attendees = event.attendees.filter(id => id !== this.attendeeId);

    // Guardar el evento actualizado
    await this.eventRepository.update(event);
  }
} 