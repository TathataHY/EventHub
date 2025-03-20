import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../../core/interfaces/Entity';
import { TicketStatus } from '../value-objects/TicketStatus';
import { TicketCreateException } from '../exceptions/TicketCreateException';
import { TicketUpdateException } from '../exceptions/TicketUpdateException';

/**
 * Entidad de boleto/ticket en el dominio
 * Implementa Entity para seguir el patrón común de entidades
 */
export class Ticket implements Entity<string> {
  readonly id: string;
  readonly userId: string;
  readonly eventId: string;
  readonly paymentId: string;
  readonly ticketType: string;
  readonly ticketPrice: number;
  readonly status: TicketStatus;
  readonly qrCode: string;
  readonly usedAt: Date | null;
  readonly metadata: Record<string, any> | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Constructor privado de Ticket
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: TicketProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.eventId = props.eventId;
    this.paymentId = props.paymentId;
    this.ticketType = props.ticketType;
    this.ticketPrice = props.ticketPrice;
    this.status = props.status;
    this.qrCode = props.qrCode;
    this.usedAt = props.usedAt;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea un nuevo ticket validando los datos
   * @param props Propiedades para crear el ticket
   * @returns Nueva instancia de Ticket
   * @throws TicketCreateException si los datos no son válidos
   */
  static create(props: TicketCreateProps): Ticket {
    const id = props.id || uuidv4();
    
    // Validar userId
    if (!props.userId) {
      throw new TicketCreateException('El ID del usuario es requerido');
    }

    // Validar eventId
    if (!props.eventId) {
      throw new TicketCreateException('El ID del evento es requerido');
    }

    // Validar paymentId
    if (!props.paymentId) {
      throw new TicketCreateException('El ID del pago es requerido');
    }

    // Validar ticketType
    if (!props.ticketType) {
      throw new TicketCreateException('El tipo de ticket es requerido');
    }

    // Validar ticketPrice
    if (props.ticketPrice < 0) {
      throw new TicketCreateException('El precio del ticket no puede ser negativo');
    }

    // Convertir o crear status
    let status: TicketStatus;
    if (props.status instanceof TicketStatus) {
      status = props.status;
    } else if (typeof props.status === 'string') {
      try {
        status = TicketStatus.create(props.status);
      } catch (error) {
        throw new TicketCreateException(`Estado inválido: ${error.message}`);
      }
    } else {
      status = TicketStatus.valid();
    }

    // Generar código QR si no se proporciona
    const qrCode = props.qrCode || `EHTICKET-${id.substring(0, 8)}`;

    // Crear ticket
    return new Ticket({
      id,
      userId: props.userId,
      eventId: props.eventId,
      paymentId: props.paymentId,
      ticketType: props.ticketType,
      ticketPrice: props.ticketPrice,
      status,
      qrCode,
      usedAt: props.usedAt || null,
      metadata: props.metadata || null,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye un Ticket desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir el ticket
   * @returns Instancia de Ticket reconstruida
   */
  static reconstitute(props: TicketProps): Ticket {
    return new Ticket(props);
  }

  /**
   * Compara si dos entidades Ticket son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Ticket)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Marca el ticket como usado
   * @returns Ticket usado
   * @throws TicketUpdateException si el ticket no puede ser marcado como usado
   */
  useTicket(): Ticket {
    if (this.status.isUsed()) {
      throw new TicketUpdateException('El ticket ya ha sido utilizado');
    }

    if (!this.status.isValid()) {
      throw new TicketUpdateException('Solo tickets válidos pueden ser utilizados');
    }

    return new Ticket({
      ...this.toObject(),
      status: TicketStatus.used(),
      usedAt: new Date(),
      updatedAt: new Date()
    });
  }

  /**
   * Cancela el ticket
   * @param reason Motivo de la cancelación (opcional)
   * @returns Ticket cancelado
   * @throws TicketUpdateException si el ticket no puede ser cancelado
   */
  cancelTicket(reason?: string): Ticket {
    if (this.status.isUsed()) {
      throw new TicketUpdateException('No se puede cancelar un ticket ya utilizado');
    }

    if (this.status.isCancelled()) {
      throw new TicketUpdateException('El ticket ya está cancelado');
    }

    const newMetadata = reason ? {
      ...this.metadata,
      cancellationReason: reason
    } : this.metadata;

    return new Ticket({
      ...this.toObject(),
      status: TicketStatus.cancelled(),
      metadata: newMetadata,
      updatedAt: new Date()
    });
  }

  /**
   * Marca el ticket como expirado
   * @returns Ticket expirado
   * @throws TicketUpdateException si el ticket no puede ser marcado como expirado
   */
  expireTicket(): Ticket {
    if (!this.status.isValid()) {
      throw new TicketUpdateException('Solo tickets válidos pueden ser marcados como expirados');
    }

    return new Ticket({
      ...this.toObject(),
      status: TicketStatus.expired(),
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza los metadatos del ticket
   * @param metadata Nuevos metadatos
   * @returns Ticket con metadatos actualizados
   */
  updateMetadata(metadata: Record<string, any>): Ticket {
    return new Ticket({
      ...this.toObject(),
      metadata: {
        ...this.metadata,
        ...metadata
      },
      updatedAt: new Date()
    });
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades del ticket
   */
  toObject(): TicketProps {
    return {
      id: this.id,
      userId: this.userId,
      eventId: this.eventId,
      paymentId: this.paymentId,
      ticketType: this.ticketType,
      ticketPrice: this.ticketPrice,
      status: this.status,
      qrCode: this.qrCode,
      usedAt: this.usedAt,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Props para reconstruir un ticket existente
 */
export interface TicketProps {
  id: string;
  userId: string;
  eventId: string;
  paymentId: string;
  ticketType: string;
  ticketPrice: number;
  status: TicketStatus;
  qrCode: string;
  usedAt: Date | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear un nuevo ticket
 */
export interface TicketCreateProps {
  id?: string;
  userId: string;
  eventId: string;
  paymentId: string;
  ticketType: string;
  ticketPrice: number;
  status?: TicketStatus | string;
  qrCode?: string;
  usedAt?: Date;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
} 