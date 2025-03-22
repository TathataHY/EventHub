import { EventRepository } from '../repositories/EventRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException } from '../../core/exceptions';

/**
 * Command para añadir un asistente a un evento
 */
export class AddAttendeeCommand implements Command<void> {
  constructor(
    private readonly eventId: string,
    private readonly attendeeId: string,
    private readonly eventRepository: EventRepository
  ) {}

  /**
   * Ejecuta el comando para añadir un asistente a un evento
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

    // Verificar si el asistente ya está registrado
    if (event.attendees && event.attendees.includes(this.attendeeId)) {
      throw new ValidationException('El usuario ya está registrado en este evento');
    }

    // Verificar si el evento está lleno
    if (event.capacity && event.attendees && event.attendees.length >= event.capacity) {
      throw new ValidationException('El evento ha alcanzado su capacidad máxima');
    }

    // Verificar si el evento está activo
    if (!event.isActive) {
      throw new ValidationException('No se puede registrar en un evento inactivo o cancelado');
    }

    // Añadir asistente
    event.attendees = event.attendees || [];
    event.attendees.push(this.attendeeId);

    // Guardar el evento actualizado
    await this.eventRepository.update(event);
  }
} 