import { Event } from 'eventhub-domain';
import { CreateEventDTO } from '../dtos/CreateEventDTO';
import { EventRepository } from '../repositories/EventRepository';
import { Command } from '../../core/interfaces/Command';
import { v4 as uuidv4 } from 'uuid';

/**
 * Comando para crear un nuevo evento
 */
export class CreateEventCommand implements Command<void> {
  constructor(
    private readonly eventData: CreateEventDTO,
    private readonly eventRepository: EventRepository
  ) {}

  /**
   * Ejecuta el comando para crear un evento
   * @returns Promise<void>
   * @throws Error si hay problemas durante la creación
   */
  async execute(): Promise<void> {
    // Validar los datos del evento
    this.validate();
    
    // Crear el evento con los valores proporcionados
    const event = Event.create({
      id: uuidv4(),
      title: this.eventData.title,
      description: this.eventData.description,
      startDate: this.eventData.startDate,
      endDate: this.eventData.endDate,
      location: this.eventData.location,
      organizerId: this.eventData.organizerId || '',
      capacity: this.eventData.capacity || null,
      tags: this.eventData.tags || [],
      isActive: true,
      attendees: []
    });

    // Guardar el evento en el repositorio
    await this.eventRepository.save(event);
  }

  /**
   * Valida los datos del evento
   * @throws Error si los datos son inválidos
   */
  private validate(): void {
    if (!this.eventData) {
      throw new Error('Los datos del evento son requeridos');
    }

    if (!this.eventData.title || this.eventData.title.trim() === '') {
      throw new Error('El título es obligatorio');
    }

    if (!this.eventData.description || this.eventData.description.trim() === '') {
      throw new Error('La descripción es obligatoria');
    }

    if (!this.eventData.startDate) {
      throw new Error('La fecha de inicio es obligatoria');
    }

    if (!this.eventData.endDate) {
      throw new Error('La fecha de fin es obligatoria');
    }

    const startDate = new Date(this.eventData.startDate);
    const endDate = new Date(this.eventData.endDate);
    if (startDate > endDate) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    if (!this.eventData.location || this.eventData.location.trim() === '') {
      throw new Error('La ubicación es obligatoria');
    }
  }
} 