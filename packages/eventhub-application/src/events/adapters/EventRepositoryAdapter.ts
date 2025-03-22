import { EventRepository } from '@eventhub/domain/dist/events/repositories/EventRepository';
import { EventAdapter } from './EventAdapter';

/**
 * Adaptador para el repositorio de eventos que resuelve incompatibilidades de tipos
 * entre la capa de dominio y aplicación
 */
export class EventRepositoryAdapter {
  constructor(private repository: EventRepository) {}

  async findById(id: string): Promise<any> {
    const event = await this.repository.findById(id);
    return EventAdapter.toApplication(event);
  }

  async findByOrganizerId(organizerId: string): Promise<any[]> {
    const events = await this.repository.findByOrganizerId(organizerId);
    return events.map(event => EventAdapter.toApplication(event));
  }

  async findAll(): Promise<any[]> {
    const events = await this.repository.findAll();
    return events.map(event => EventAdapter.toApplication(event));
  }

  async findActive(): Promise<any[]> {
    const events = await this.repository.findActive();
    return events.map(event => EventAdapter.toApplication(event));
  }

  async findUpcoming(limit?: number): Promise<any[]> {
    const events = await this.repository.findUpcoming(limit);
    return events.map(event => EventAdapter.toApplication(event));
  }

  async findByCategory(categoryId: string): Promise<any[]> {
    const events = await this.repository.findByCategory(categoryId);
    return events.map(event => EventAdapter.toApplication(event));
  }

  async findWithFilters(filters: any, options: any): Promise<any> {
    const result = await this.repository.findWithFilters(filters, options);
    return {
      events: result.events.map(event => EventAdapter.toApplication(event)),
      total: result.total
    };
  }

  async save(event: any): Promise<void> {
    const domainEvent = EventAdapter.toDomain(event);
    await this.repository.save(domainEvent);
  }

  async delete(eventId: string): Promise<void> {
    await this.repository.delete(eventId);
  }
} 