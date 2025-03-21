import { Event, EventFilters, EventRepository } from 'eventhub-domain';
import { Repository, Like, Between, EntityManager } from 'typeorm';
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
   * Obtiene el repositorio de eventos adecuado (default o transaccional)
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  private getRepository(entityManager?: EntityManager): Repository<EventEntity> {
    return entityManager ? entityManager.getRepository(EventEntity) : this.eventRepository;
  }

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
      attendees: entity.attendees || [],
      isActive: entity.isActive,
      tags: entity.tags || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  /**
   * Encuentra un evento por su ID
   * @param id ID del evento
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findById(id: string, entityManager?: EntityManager): Promise<Event | null> {
    const repository = this.getRepository(entityManager);
    const eventEntity = await repository.findOne({ where: { id } });
    return eventEntity ? this.toDomain(eventEntity) : null;
  }

  /**
   * Encuentra todos los eventos
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findAll(entityManager?: EntityManager): Promise<Event[]> {
    const repository = this.getRepository(entityManager);
    const eventEntities = await repository.find();
    return eventEntities.map(entity => this.toDomain(entity));
  }

  /**
   * Encuentra eventos con filtros
   * @param filters Filtros para la búsqueda
   * @param page Número de página (opcional)
   * @param limit Límite de eventos por página (opcional)
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findWithFilters(
    filters: EventFilters,
    page: number = 1,
    limit: number = 10,
    entityManager?: EntityManager
  ): Promise<{ events: Event[]; total: number }> {
    const repository = this.getRepository(entityManager);
    const { organizerId, isActive, startDate, endDate, query, tags } = filters;
    
    // Construir las condiciones de búsqueda
    const where: any = {};
    
    if (organizerId) {
      where.organizerId = organizerId;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    
    if (startDate && endDate) {
      where.startDate = Between(startDate, endDate);
    } else if (startDate) {
      where.startDate = Between(startDate, new Date('3000-01-01'));
    } else if (endDate) {
      where.endDate = Between(new Date('1970-01-01'), endDate);
    }
    
    if (query) {
      where.title = Like(`%${query}%`);
      // También podríamos buscar en la descripción, pero TypeORM no permite OR en objetos
    }
    
    // Para tags, necesitaríamos una lógica más compleja con un query builder
    
    // Aplicar paginación
    const skip = (page - 1) * limit;
    
    const [entities, total] = await repository.findAndCount({
      where,
      skip,
      take: limit,
      order: { startDate: 'ASC' }
    });
    
    const events = entities.map(entity => this.toDomain(entity));
    
    return { events, total };
  }

  /**
   * Encuentra eventos por ID del organizador
   * @param organizerId ID del organizador
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findByOrganizerId(organizerId: string, entityManager?: EntityManager): Promise<Event[]> {
    const repository = this.getRepository(entityManager);
    const entities = await repository.find({ 
      where: { organizerId },
      order: { startDate: 'ASC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  /**
   * Guarda un nuevo evento
   * @param event Evento a guardar
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async save(event: Event, entityManager?: EntityManager): Promise<Event> {
    const repository = this.getRepository(entityManager);
    const entity = this.toEntity(event);
    const savedEntity = await repository.save(entity);
    return this.toDomain(savedEntity);
  }

  /**
   * Actualiza un evento existente
   * @param event Evento a actualizar
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async update(event: Event, entityManager?: EntityManager): Promise<Event> {
    const repository = this.getRepository(entityManager);
    const entity = this.toEntity(event);
    const updatedEntity = await repository.save(entity);
    return this.toDomain(updatedEntity);
  }

  /**
   * Elimina un evento
   * @param id ID del evento a eliminar
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async delete(id: string, entityManager?: EntityManager): Promise<void> {
    const repository = this.getRepository(entityManager);
    await repository.delete(id);
  }
} 