import { EventRepository } from '@eventhub/domain/src/events/repositories/EventRepository';
import { CreateEventCommand } from '../commands/CreateEventCommand';
import { UpdateEventCommand } from '../commands/UpdateEventCommand';
import { DeleteEventCommand } from '../commands/DeleteEventCommand';
import { GetEventByIdQuery } from '../queries/GetEventByIdQuery';
import { GetEventsByOrganizerQuery } from '../queries/GetEventsByOrganizerQuery';
import { SearchEventsQuery } from '../queries/SearchEventsQuery';
import { CreateEventDTO } from '../dtos/CreateEventDTO';
import { UpdateEventDTO } from '../dtos/UpdateEventDTO';
import { EventDTO } from '../dtos/EventDTO';
import { EventFiltersDTO } from '../dtos/EventFiltersDTO';

/**
 * Servicio que coordina todas las operaciones relacionadas con eventos
 */
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Crea un nuevo evento
   * @param eventData Datos del evento a crear
   */
  async createEvent(eventData: CreateEventDTO): Promise<void> {
    const command = new CreateEventCommand(eventData, this.eventRepository);
    await command.execute();
  }

  /**
   * Actualiza un evento existente
   * @param eventId ID del evento a actualizar
   * @param eventData Datos a actualizar
   */
  async updateEvent(eventId: string, eventData: UpdateEventDTO): Promise<void> {
    const command = new UpdateEventCommand(eventId, eventData, this.eventRepository);
    await command.execute();
  }

  /**
   * Elimina un evento existente
   * @param eventId ID del evento a eliminar
   */
  async deleteEvent(eventId: string): Promise<void> {
    const command = new DeleteEventCommand(eventId, this.eventRepository);
    await command.execute();
  }

  /**
   * Obtiene un evento por su ID
   * @param eventId ID del evento a buscar
   * @returns Datos del evento
   */
  async getEventById(eventId: string): Promise<EventDTO> {
    const query = new GetEventByIdQuery(eventId, this.eventRepository);
    return query.execute();
  }

  /**
   * Obtiene eventos por organizador
   * @param organizerId ID del organizador
   * @param status Estado opcional de los eventos
   * @returns Lista de eventos del organizador
   */
  async getEventsByOrganizer(organizerId: string, status?: string): Promise<EventDTO[]> {
    const query = new GetEventsByOrganizerQuery(organizerId, status, this.eventRepository);
    return query.execute();
  }

  /**
   * Busca eventos según filtros
   * @param filters Filtros para la búsqueda
   * @returns Eventos y total que coinciden con los filtros
   */
  async searchEvents(filters: EventFiltersDTO): Promise<{ events: EventDTO[]; total: number }> {
    const query = new SearchEventsQuery(filters, this.eventRepository);
    return query.execute();
  }

  /**
   * Cuenta eventos publicados
   * @returns Total de eventos publicados
   */
  async countPublishedEvents(): Promise<number> {
    return this.eventRepository.countPublishedEvents();
  }

  /**
   * Cuenta eventos próximos
   * @returns Total de eventos próximos
   */
  async countUpcomingEvents(): Promise<number> {
    return this.eventRepository.countUpcomingEvents();
  }

  /**
   * Cuenta eventos cancelados
   * @returns Total de eventos cancelados
   */
  async countCancelledEvents(): Promise<number> {
    return this.eventRepository.countCancelledEvents();
  }

  /**
   * Obtiene estadísticas de eventos por día
   * @param since Fecha desde la que obtener estadísticas
   * @returns Estadísticas de eventos por día
   */
  async getEventsPerDay(since?: Date): Promise<{ date: string; count: number }[]> {
    return this.eventRepository.getEventsPerDay(since);
  }

  /**
   * Obtiene los eventos más populares
   * @param limit Número de eventos a obtener
   * @param since Fecha desde la que contar
   * @returns Lista de eventos más populares
   */
  async getMostPopularEvents(limit: number, since?: Date): Promise<EventDTO[]> {
    const events = await this.eventRepository.getMostPopularEvents(limit, since);
    return events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      organizerId: event.organizerId,
      capacity: event.capacity,
      attendees: event.attendees || [],
      isActive: event.isActive,
      tags: event.tags || [],
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));
  }
} 