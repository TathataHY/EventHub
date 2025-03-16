import { Event, EventFilters, EventRepository } from 'eventhub-domain';
import { Injectable } from '@nestjs/common';

/**
 * Implementación en memoria de EventRepository para pruebas
 */
@Injectable()
export class InMemoryEventRepository implements EventRepository {
  private events: Map<string, Event> = new Map();

  async findById(id: string): Promise<Event | null> {
    return this.events.get(id) || null;
  }

  async findAll(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async findWithFilters(
    filters: EventFilters,
    page = 1,
    limit = 10
  ): Promise<{ events: Event[]; total: number }> {
    let filteredEvents = Array.from(this.events.values());

    // Aplicar filtros
    if (filters.organizerId) {
      filteredEvents = filteredEvents.filter(
        event => event.organizerId === filters.organizerId
      );
    }

    if (filters.isActive !== undefined) {
      filteredEvents = filteredEvents.filter(
        event => event.isActive === filters.isActive
      );
    }

    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(
        event => event.startDate >= filters.startDate
      );
    }

    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(
        event => event.endDate <= filters.endDate
      );
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredEvents = filteredEvents.filter(
        event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredEvents = filteredEvents.filter(event =>
        event.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    // Ordenar por fecha de creación (más recientes primero)
    filteredEvents.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Aplicar paginación
    const total = filteredEvents.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedEvents = filteredEvents.slice(start, end);

    return {
      events: paginatedEvents,
      total
    };
  }

  async findByOrganizerId(organizerId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      event => event.organizerId === organizerId
    );
  }

  async save(event: Event): Promise<Event> {
    this.events.set(event.id, event);
    return event;
  }

  async update(event: Event): Promise<Event> {
    if (!this.events.has(event.id)) {
      throw new Error(`Evento con ID ${event.id} no encontrado`);
    }
    this.events.set(event.id, event);
    return event;
  }

  async delete(id: string): Promise<void> {
    this.events.delete(id);
  }

  // Método para limpiar todos los eventos (útil para pruebas)
  clear(): void {
    this.events.clear();
  }
} 