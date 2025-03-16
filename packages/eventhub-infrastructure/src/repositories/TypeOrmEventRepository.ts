import { Event, EventFilters, EventRepository } from 'eventhub-domain';
import { Repository, Like } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '../entities/EventEntity';

/**
 * Implementación de EventRepository utilizando TypeORM
 */
@Injectable()
export class TypeOrmEventRepository implements EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>
  ) {}

  /**
   * Convierte una entidad de dominio a una entidad de base de datos
   */
  private toEntity(event: Event): EventEntity {
    return {
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
    };
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
    const entity = await this.eventRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Event[]> {
    const entities = await this.eventRepository.find();
    return entities.map(entity => this.toDomain(entity));
  }

  /**
   * Encuentra eventos con filtros
   */
  async findWithFilters(
    filters: EventFilters,
    page = 1,
    limit = 10
  ): Promise<{ events: Event[]; total: number }> {
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event');

    // Aplicar filtros
    if (filters.organizerId) {
      queryBuilder.andWhere('event.organizerId = :organizerId', {
        organizerId: filters.organizerId
      });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('event.isActive = :isActive', {
        isActive: filters.isActive
      });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('event.startDate >= :startDate', {
        startDate: filters.startDate
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('event.endDate <= :endDate', {
        endDate: filters.endDate
      });
    }

    if (filters.query) {
      queryBuilder.andWhere(
        '(event.title LIKE :query OR event.description LIKE :query)',
        { query: `%${filters.query}%` }
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      // La implementación depende de cómo se almacenan las etiquetas en la base de datos
      // Esta es una implementación simplificada
      queryBuilder.andWhere('event.tags @> :tags', { 
        tags: filters.tags 
      });
    }

    // Aplicar paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Ordenar por fecha de creación (más recientes primero)
    queryBuilder.orderBy('event.createdAt', 'DESC');

    // Ejecutar la consulta
    const [eventEntities, total] = await queryBuilder.getManyAndCount();

    // Mapear entidades a objetos de dominio
    const events = eventEntities.map(entity => this.toDomain(entity));

    return { events, total };
  }

  async findByOrganizerId(organizerId: string): Promise<Event[]> {
    const entities = await this.eventRepository.find({
      where: { organizerId }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async save(event: Event): Promise<Event> {
    const entity = this.toEntity(event);
    const savedEntity = await this.eventRepository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(event: Event): Promise<Event> {
    const entity = this.toEntity(event);
    const updatedEntity = await this.eventRepository.save(entity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
} 