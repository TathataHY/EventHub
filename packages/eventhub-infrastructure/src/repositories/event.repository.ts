import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
import { Event } from 'eventhub-application';
import { 
  EventRepository as EventRepositoryInterface,
  EventSearchFilters 
} from 'eventhub-application';

@Injectable()
export class EventRepository implements EventRepositoryInterface {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async findById(id: string): Promise<Event | null> {
    const eventEntity = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!eventEntity) {
      return null;
    }

    return this.mapToDomain(eventEntity);
  }

  async findByOrganizerId(organizerId: string): Promise<Event[]> {
    const eventEntities = await this.eventRepository.find({
      where: { organizerId },
      relations: ['organizer'],
    });

    return eventEntities.map(entity => this.mapToDomain(entity));
  }

  async save(event: Event): Promise<Event> {
    const eventEntity = this.mapToEntity(event);
    const savedEntity = await this.eventRepository.save(eventEntity);
    
    // Recargar la entidad con relaciones
    const refreshedEntity = await this.eventRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['organizer'],
    });

    if (!refreshedEntity) {
      throw new Error(`Evento con ID ${savedEntity.id} no encontrado después de guardar`);
    }

    return this.mapToDomain(refreshedEntity);
  }

  async update(event: Event): Promise<Event> {
    const eventEntity = this.mapToEntity(event);
    await this.eventRepository.update({ id: event.id }, eventEntity);
    
    // Recargar la entidad actualizada con relaciones
    const updatedEntity = await this.eventRepository.findOne({
      where: { id: event.id },
      relations: ['organizer'],
    });

    if (!updatedEntity) {
      throw new Error(`Evento con ID ${event.id} no encontrado después de actualizar`);
    }

    return this.mapToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.eventRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findAll(): Promise<Event[]> {
    const eventEntities = await this.eventRepository.find({
      relations: ['organizer'],
    });

    return eventEntities.map(entity => this.mapToDomain(entity));
  }

  async searchEvents(filters: EventSearchFilters): Promise<Event[]> {
    const queryBuilder = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer');
    
    this.applyFiltersToQuery(queryBuilder, filters);
    
    // Aplicar ordenación
    if (filters.sort) {
      const order = filters.order === 'desc' ? 'DESC' : 'ASC';
      switch (filters.sort) {
        case 'date':
          queryBuilder.orderBy('event.startDate', order);
          break;
        case 'price':
          queryBuilder.orderBy('event.price', order);
          break;
        case 'popularity':
          // Ordenar por número de tickets vendidos (requiere una relación con tickets)
          queryBuilder
            .leftJoin('event.tickets', 'ticket')
            .addSelect('COUNT(ticket.id)', 'ticketCount')
            .groupBy('event.id')
            .orderBy('ticketCount', order);
          break;
        case 'rating':
          // Ordenar por puntuación media (requiere una relación con ratings)
          queryBuilder
            .leftJoin('event.ratings', 'rating')
            .addSelect('AVG(rating.score)', 'avgRating')
            .groupBy('event.id')
            .orderBy('avgRating', order);
          break;
        default:
          queryBuilder.orderBy('event.createdAt', 'DESC');
      }
    } else {
      // Ordenación predeterminada: eventos más recientes primero
      queryBuilder.orderBy('event.createdAt', 'DESC');
    }
    
    // Aplicar paginación
    if (filters.limit !== undefined) {
      queryBuilder.take(filters.limit);
    }
    
    if (filters.offset !== undefined) {
      queryBuilder.skip(filters.offset);
    }
    
    const events = await queryBuilder.getMany();
    return events.map(event => this.mapToDomain(event));
  }

  async countEvents(filters: EventSearchFilters): Promise<number> {
    const queryBuilder = this.eventRepository.createQueryBuilder('event');
    
    this.applyFiltersToQuery(queryBuilder, filters);
    
    return await queryBuilder.getCount();
  }

  private applyFiltersToQuery(queryBuilder, filters: EventSearchFilters): void {
    // Filtro de texto por título o descripción
    if (filters.query) {
      queryBuilder.andWhere(
        '(event.title LIKE :query OR event.description LIKE :query)',
        { query: `%${filters.query}%` }
      );
    }
    
    // Filtro por ubicación
    if (filters.location) {
      queryBuilder.andWhere('event.location LIKE :location', { location: `%${filters.location}%` });
    }
    
    // Filtros por fecha
    if (filters.startDate) {
      queryBuilder.andWhere('event.startDate >= :startDate', { startDate: filters.startDate });
    }
    
    if (filters.endDate) {
      queryBuilder.andWhere('event.endDate <= :endDate', { endDate: filters.endDate });
    }
    
    // Filtros por precio
    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('event.price >= :minPrice', { minPrice: filters.minPrice });
    }
    
    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('event.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    
    // Filtro por organizador
    if (filters.organizerId) {
      queryBuilder.andWhere('event.organizerId = :organizerId', { organizerId: filters.organizerId });
    }
    
    // Filtros por estado
    if (filters.isPublished !== undefined) {
      queryBuilder.andWhere('event.isPublished = :isPublished', { isPublished: filters.isPublished });
    }
    
    if (filters.isCancelled !== undefined) {
      queryBuilder.andWhere('event.isCancelled = :isCancelled', { isCancelled: filters.isCancelled });
    }
    
    // Filtro por categorías (asumiendo que hay una relación con categorías)
    if (filters.categories && filters.categories.length > 0) {
      queryBuilder
        .innerJoin('event.categories', 'category')
        .andWhere('category.id IN (:...categoryIds)', { categoryIds: filters.categories });
    }
  }

  private mapToDomain(entity: EventEntity): Event {
    const event = new Event();
    event.id = entity.id;
    event.title = entity.title;
    event.description = entity.description;
    event.location = entity.location;
    event.startDate = entity.startDate;
    event.endDate = entity.endDate;
    event.imageUrl = entity.imageUrl;
    event.price = Number(entity.price);
    event.maxParticipants = entity.maxParticipants;
    event.isPublished = entity.isPublished;
    event.isCancelled = entity.isCancelled;
    event.organizerId = entity.organizerId;
    event.metadata = entity.metadata;
    event.createdAt = entity.createdAt;
    event.updatedAt = entity.updatedAt;
    
    // Datos del organizador si están disponibles
    if (entity.organizer) {
      event.organizerName = entity.organizer.name;
      event.organizerEmail = entity.organizer.email;
    }
    
    return event;
  }

  private mapToEntity(domain: Event): EventEntity {
    const entity = new EventEntity();
    
    if (domain.id) {
      entity.id = domain.id;
    }
    
    entity.title = domain.title;
    entity.description = domain.description;
    entity.location = domain.location;
    entity.startDate = domain.startDate;
    entity.endDate = domain.endDate;
    entity.imageUrl = domain.imageUrl;
    entity.price = domain.price;
    entity.maxParticipants = domain.maxParticipants;
    entity.isPublished = domain.isPublished;
    entity.isCancelled = domain.isCancelled;
    entity.organizerId = domain.organizerId;
    entity.metadata = domain.metadata;
    
    return entity;
  }
} 