import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRepository, Event, EventFilters } from 'eventhub-domain';
import { EventEntity } from '../../entities/typeorm/EventEntity';

@Injectable()
export class TypeOrmEventRepository implements EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>
  ) {}

  async findById(id: string): Promise<Event | null> {
    const eventEntity = await this.eventRepository.findOne({
      where: { id },
      relations: ['attendees'],
    });

    if (!eventEntity) {
      return null;
    }

    return this.mapToDomain(eventEntity);
  }

  async findAll(): Promise<Event[]> {
    const events = await this.eventRepository.find({
      relations: ['attendees'],
    });
    
    return events.map(event => this.mapToDomain(event));
  }

  async findWithFilters(
    filters: EventFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ events: Event[], total: number }> {
    const queryBuilder = this.eventRepository.createQueryBuilder('event');
    queryBuilder.leftJoinAndSelect('event.attendees', 'attendee');
    
    // Aplicar filtros si existen
    if (filters) {
      // Filtrar por organizador
      if (filters.organizerId) {
        queryBuilder.andWhere('event.organizerId = :organizerId', { organizerId: filters.organizerId });
      }
      
      // Filtrar por estado activo
      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('event.isActive = :isActive', { isActive: filters.isActive });
      }
      
      // Filtrar por fecha de inicio
      if (filters.startDate) {
        queryBuilder.andWhere('event.startDate >= :startDate', { startDate: filters.startDate });
      }
      
      // Filtrar por fecha de fin
      if (filters.endDate) {
        queryBuilder.andWhere('event.endDate <= :endDate', { endDate: filters.endDate });
      }
      
      // Búsqueda por término
      if (filters.query) {
        queryBuilder.andWhere(
          '(event.title LIKE :query OR event.description LIKE :query)',
          { query: `%${filters.query}%` }
        );
      }
      
      // Filtrar por etiquetas
      if (filters.tags && filters.tags.length > 0) {
        // Esto es una simplificación; en un escenario real, 
        // necesitaríamos una implementación más sofisticada para buscar en arrays
        queryBuilder.andWhere('event.tags LIKE :tags', { tags: `%${filters.tags.join('%')}%` });
      }
    }
    
    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    
    // Ordenar por fecha de inicio descendente
    queryBuilder.orderBy('event.startDate', 'DESC');
    
    const [events, total] = await queryBuilder.getManyAndCount();
    
    return {
      events: events.map(event => this.mapToDomain(event)),
      total
    };
  }

  async findByOrganizerId(organizerId: string): Promise<Event[]> {
    const events = await this.eventRepository.find({
      where: { organizerId },
      relations: ['attendees'],
    });
    
    return events.map(event => this.mapToDomain(event));
  }

  async save(event: Event): Promise<Event> {
    const eventEntity = this.mapToEntity(event);
    const savedEvent = await this.eventRepository.save(eventEntity);
    return this.mapToDomain(savedEvent);
  }

  async update(event: Event): Promise<Event> {
    const eventEntity = this.mapToEntity(event);
    const updatedEvent = await this.eventRepository.save(eventEntity);
    return this.mapToDomain(updatedEvent);
  }

  async delete(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }

  private mapToDomain(entity: EventEntity): Event {
    return new Event(
      entity.id,
      entity.title,
      entity.description,
      entity.startDate,
      entity.endDate,
      entity.location,
      entity.organizerId,
      entity.capacity,
      entity.attendees?.map(attendee => attendee.id) || [],
      entity.isActive,
      entity.tags,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private mapToEntity(event: Event): EventEntity {
    const entity = new EventEntity();
    entity.id = event.id;
    entity.title = event.title;
    entity.description = event.description;
    entity.startDate = event.startDate;
    entity.endDate = event.endDate;
    entity.location = event.location;
    entity.organizerId = event.organizerId;
    entity.capacity = event.capacity;
    entity.isActive = event.isActive;
    entity.tags = event.tags;
    entity.createdAt = event.createdAt;
    entity.updatedAt = event.updatedAt;
    
    // No mapeamos los asistentes directamente, se gestionan por relaciones
    
    return entity;
  }
} 