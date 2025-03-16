import { Injectable } from '@nestjs/common';
import { EventRepository, Event } from 'eventhub-domain';

@Injectable()
export class EventRepositoryImpl implements EventRepository {
  private events: Event[] = [];

  async findById(id: string): Promise<Event | null> {
    const event = this.events.find(e => e.id === id);
    return event ? this.clone(event) : null;
  }

  async findAll(filters?: any): Promise<{ events: Event[], total: number }> {
    let filteredEvents = [...this.events];
    
    if (filters) {
      // Aplicar filtros si existen
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(searchTermLower) || 
          event.description.toLowerCase().includes(searchTermLower)
        );
      }
      
      if (filters.fromDate) {
        const fromDate = new Date(filters.fromDate);
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.startDate) >= fromDate
        );
      }
      
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.endDate) <= toDate
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        const isActive = filters.status === 'active';
        filteredEvents = filteredEvents.filter(event => event.isActive === isActive);
      }
      
      // Ordenar por fecha de inicio descendente
      filteredEvents.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      
      // Aplicar paginación
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      return {
        events: filteredEvents.slice(startIndex, endIndex).map(event => this.clone(event)),
        total: filteredEvents.length
      };
    }
    
    return {
      events: filteredEvents.map(event => this.clone(event)),
      total: filteredEvents.length
    };
  }

  async save(event: Event): Promise<Event> {
    const existingIndex = this.events.findIndex(e => e.id === event.id);
    
    if (existingIndex >= 0) {
      // Actualizar evento existente
      this.events[existingIndex] = this.clone(event);
      return this.clone(event);
    } else {
      // Crear nuevo evento
      const newEvent = this.clone(event);
      this.events.push(newEvent);
      return newEvent;
    }
  }

  async delete(id: string): Promise<void> {
    this.events = this.events.filter(event => event.id !== id);
  }

  // Método para clonar eventos y evitar mutaciones no deseadas
  private clone(event: Event): Event {
    return new Event(
      event.id,
      event.title,
      event.description,
      new Date(event.startDate),
      new Date(event.endDate),
      event.location,
      event.organizerId,
      event.capacity,
      [...event.attendees],
      event.isActive,
      event.tags ? [...event.tags] : undefined,
      event.createdAt ? new Date(event.createdAt) : undefined,
      event.updatedAt ? new Date(event.updatedAt) : undefined
    );
  }
} 