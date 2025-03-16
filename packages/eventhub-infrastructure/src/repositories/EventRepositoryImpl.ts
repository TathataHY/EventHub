import { Event, EventRepository } from 'eventhub-domain';
import { EventEntity } from '../entities/EventEntity';

/**
 * Implementación concreta del repositorio de eventos
 * Esta clase implementa la interfaz definida en el dominio
 */
export class EventRepositoryImpl implements EventRepository {
  // En un caso real, aquí inyectaríamos un ORM o cliente de base de datos
  private events: EventEntity[] = [];

  /**
   * Convierte una entidad de dominio a una entidad de base de datos
   */
  private toEntity(event: Event): EventEntity {
    return new EventEntity({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      organizerId: event.organizerId,
      capacity: event.capacity,
      attendees: event.attendees,
      isActive: event.isActive,
      tags: event.tags,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    });
  }

  /**
   * Convierte una entidad de base de datos a una entidad de dominio
   */
  private toDomain(entity: EventEntity): Event {
    return new Event({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      startDate: entity.startDate,
      endDate: entity.endDate,
      location: entity.location,
      organizerId: entity.organizerId,
      capacity: entity.capacity,
      attendees: entity.attendees,
      isActive: entity.isActive,
      tags: entity.tags,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async findById(id: string): Promise<Event | null> {
    // En un caso real, aquí consultaríamos la base de datos
    const entity = this.events.find(e => e.id === id);
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    organizerId?: string;
    fromDate?: Date;
    toDate?: Date;
    searchTerm?: string;
    tags?: string[];
  }): Promise<{
    events: Event[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    
    // Aplicar filtros
    let filteredEvents = this.events;
    
    if (options?.isActive !== undefined) {
      filteredEvents = filteredEvents.filter(e => e.isActive === options.isActive);
    }
    
    if (options?.organizerId) {
      filteredEvents = filteredEvents.filter(e => e.organizerId === options.organizerId);
    }
    
    if (options?.fromDate) {
      filteredEvents = filteredEvents.filter(e => e.startDate >= options.fromDate);
    }
    
    if (options?.toDate) {
      filteredEvents = filteredEvents.filter(e => e.endDate <= options.toDate);
    }
    
    if (options?.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(e => 
        e.title.toLowerCase().includes(term) || 
        e.description.toLowerCase().includes(term) ||
        e.location.toLowerCase().includes(term)
      );
    }
    
    if (options?.tags && options.tags.length > 0) {
      filteredEvents = filteredEvents.filter(e => 
        options.tags.some(tag => e.tags.includes(tag))
      );
    }
    
    // Paginación
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedEvents = filteredEvents.slice(start, end);
    
    return {
      events: paginatedEvents.map(entity => this.toDomain(entity)),
      total: filteredEvents.length,
      page,
      limit,
    };
  }

  async save(event: Event): Promise<Event> {
    const entity = this.toEntity(event);
    
    // Buscar si ya existe
    const index = this.events.findIndex(e => e.id === entity.id);
    
    if (index !== -1) {
      // Actualizar existente
      this.events[index] = entity;
    } else {
      // Crear nuevo
      this.events.push(entity);
    }
    
    return event;
  }

  async delete(id: string): Promise<void> {
    const index = this.events.findIndex(e => e.id === id);
    
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }
} 