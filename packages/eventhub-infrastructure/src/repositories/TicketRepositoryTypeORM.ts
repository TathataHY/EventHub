import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, FindOptionsWhere, EntityManager } from 'typeorm';
import { 
  FindTicketsOptions, 
  ITicketRepository, 
  Ticket, 
  TicketStatus 
} from 'eventhub-domain';
import { TicketEntity } from '../entities/TicketEntity';

/**
 * Implementación del repositorio de tickets usando TypeORM
 */
@Injectable()
export class TicketRepositoryTypeORM implements ITicketRepository {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
  ) {}

  /**
   * Convierte una entidad de Ticket del dominio a una entidad de TypeORM
   */
  private toEntity(ticket: Ticket): TicketEntity {
    return {
      id: ticket.id,
      userId: ticket.userId,
      eventId: ticket.eventId,
      paymentId: ticket.paymentId,
      code: ticket.code,
      status: ticket.status,
      price: ticket.price,
      description: ticket.description,
      isUsed: ticket.isUsed,
      validFrom: ticket.validFrom,
      validUntil: ticket.validUntil,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      // Estas propiedades son para relacionarse con otras entidades
      // pero no se usan al guardar, TypeORM las maneja automáticamente
      user: undefined,
      event: undefined,
      payment: undefined
    };
  }

  /**
   * Convierte una entidad de TypeORM a una entidad de Ticket del dominio
   */
  private toDomain(entity: TicketEntity): Ticket {
    return new Ticket({
      id: entity.id,
      userId: entity.userId,
      eventId: entity.eventId,
      paymentId: entity.paymentId,
      code: entity.code,
      status: entity.status,
      price: entity.price,
      description: entity.description,
      isUsed: entity.isUsed,
      validFrom: entity.validFrom,
      validUntil: entity.validUntil,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  /**
   * Obtiene el repositorio de tickets adecuado (default o transaccional)
   */
  private getRepository(entityManager?: EntityManager): Repository<TicketEntity> {
    return entityManager ? entityManager.getRepository(TicketEntity) : this.ticketRepository;
  }

  /**
   * Guarda un ticket en la base de datos
   * @param ticket Ticket a guardar
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async save(ticket: Ticket, entityManager?: EntityManager): Promise<Ticket> {
    const repository = this.getRepository(entityManager);
    const entity = this.toEntity(ticket);
    const savedEntity = await repository.save(entity);
    return this.toDomain(savedEntity);
  }

  /**
   * Busca un ticket por su ID
   * @param id ID del ticket
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findById(id: string, entityManager?: EntityManager): Promise<Ticket | null> {
    const repository = this.getRepository(entityManager);
    const entity = await repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  /**
   * Busca un ticket por su código único
   * @param code Código del ticket
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findByCode(code: string, entityManager?: EntityManager): Promise<Ticket | null> {
    const repository = this.getRepository(entityManager);
    const entity = await repository.findOne({ where: { code } });
    return entity ? this.toDomain(entity) : null;
  }

  /**
   * Busca tickets con opciones de filtrado
   * @param options Opciones de filtrado
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findTickets(options: FindTicketsOptions, entityManager?: EntityManager): Promise<{ tickets: Ticket[]; total: number }> {
    const repository = this.getRepository(entityManager);
    const { 
      userId, 
      eventId, 
      status, 
      validFrom, 
      validUntil, 
      code,
      page = 1, 
      perPage = 10 
    } = options;

    // Construir las condiciones de búsqueda
    const where: FindOptionsWhere<TicketEntity> = {};

    if (userId) where.userId = userId;
    if (eventId) where.eventId = eventId;
    if (status) where.status = status;
    if (code) where.code = code;

    // Validez del ticket (rango de fechas)
    if (validFrom && validUntil) {
      where.validFrom = Between(validFrom, validUntil);
      where.validUntil = Between(validFrom, validUntil);
    } else if (validFrom) {
      where.validFrom = Between(validFrom, new Date('3000-01-01'));
    } else if (validUntil) {
      where.validUntil = Between(new Date('1970-01-01'), validUntil);
    }

    // Realizar la consulta con paginación
    const [entities, total] = await repository.findAndCount({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      order: { createdAt: 'DESC' }
    });

    // Convertir los resultados al dominio
    const tickets = entities.map(entity => this.toDomain(entity));

    return { tickets, total };
  }

  /**
   * Busca tickets por usuario
   * @param userId ID del usuario
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findByUserId(userId: string, entityManager?: EntityManager): Promise<Ticket[]> {
    const repository = this.getRepository(entityManager);
    const entities = await repository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  /**
   * Busca tickets por evento
   * @param eventId ID del evento
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findByEventId(eventId: string, entityManager?: EntityManager): Promise<Ticket[]> {
    const repository = this.getRepository(entityManager);
    const entities = await repository.find({ 
      where: { eventId },
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  /**
   * Busca tickets por pago
   * @param paymentId ID del pago
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findByPaymentId(paymentId: string, entityManager?: EntityManager): Promise<Ticket[]> {
    const repository = this.getRepository(entityManager);
    const entities = await repository.find({ 
      where: { paymentId },
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  /**
   * Busca tickets por evento y estado
   * @param eventId ID del evento
   * @param status Estado del ticket
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async findByEventIdAndStatus(eventId: string, status: TicketStatus, entityManager?: EntityManager): Promise<Ticket[]> {
    const repository = this.getRepository(entityManager);
    const entities = await repository.find({ 
      where: { eventId, status },
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  /**
   * Cuenta tickets por evento y estado
   * @param eventId ID del evento
   * @param status Estado del ticket
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async countByEventIdAndStatus(eventId: string, status: TicketStatus, entityManager?: EntityManager): Promise<number> {
    const repository = this.getRepository(entityManager);
    return repository.count({ where: { eventId, status } });
  }

  /**
   * Verifica si un usuario tiene un ticket válido para un evento
   * @param userId ID del usuario
   * @param eventId ID del evento
   * @param entityManager Opcional: EntityManager para operaciones en transacción
   */
  async hasValidTicket(userId: string, eventId: string, entityManager?: EntityManager): Promise<boolean> {
    const repository = this.getRepository(entityManager);
    const now = new Date();
    
    // Buscar tickets válidos (no usados o en ciertos estados) para el evento y usuario
    const validStates = [TicketStatus.PAID, TicketStatus.VALIDATED, TicketStatus.RESERVED];
    
    const count = await repository.count({
      where: {
        userId,
        eventId,
        status: In(validStates),
        validFrom: Between(new Date('1970-01-01'), now),
        validUntil: Between(now, new Date('3000-01-01')),
        isUsed: false
      }
    });
    
    return count > 0;
  }
} 