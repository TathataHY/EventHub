import { Entity } from '../../core/interfaces/Entity';
import { TicketStatus, TicketStatusEnum } from '../value-objects/TicketStatus';
import { TicketType } from '../value-objects/TicketType';
import { TicketCreateException } from '../exceptions/TicketCreateException';
import { TicketUpdateException } from '../exceptions/TicketUpdateException';
import { Event } from '../../events/entities/Event';
import { User } from '../../users/entities/User';
import { Money } from '../../core/value-objects/Money';
import { v4 as uuidv4 } from 'uuid';

/**
 * Propiedades completas de un ticket
 * 
 * Define todos los atributos necesarios para representar completamente
 * un ticket en el sistema, incluyendo su información básica, estado,
 * relaciones con otras entidades y metadatos.
 */
export interface TicketProps {
  /** Identificador único del ticket */
  id: string;
  /** Fecha de creación del ticket en el sistema */
  createdAt: Date;
  /** Fecha de última actualización del ticket */
  updatedAt: Date;
  /** Indica si el ticket está activo en el sistema */
  isActive: boolean;
  /** Nombre o título del ticket (ej: "Entrada General", "Pase VIP") */
  name: string;
  /** Descripción detallada del ticket con información adicional */
  description: string;
  /** Precio del ticket representado como un value object Money */
  price: Money;
  /** Cantidad total de tickets de este tipo disponibles inicialmente */
  quantity: number;
  /** Cantidad de tickets que aún no han sido vendidos */
  availableQuantity: number;
  /** Tipo de ticket (general, VIP, etc.) como value object */
  type: TicketType;
  /** Estado actual del ticket (disponible, vendido, etc.) como value object */
  status: TicketStatus;
  /** Evento al que pertenece este ticket */
  event: Event;
  /** Usuario que compró el ticket (opcional, solo presente si está vendido) */
  purchasedBy?: User;
  /** Fecha exacta en que se realizó la compra (opcional) */
  purchasedAt?: Date;
}

/**
 * Propiedades necesarias para crear un nuevo ticket
 * 
 * Contiene los campos mínimos requeridos para la creación inicial de un ticket.
 * Algunos campos como ID, fechas y estado se generan automáticamente.
 */
export interface TicketCreateProps {
  /** Nombre o título del ticket */
  name: string;
  /** Descripción detallada del ticket */
  description: string;
  /** Precio del ticket */
  price: Money;
  /** Cantidad total de tickets disponibles */
  quantity: number;
  /** Tipo de ticket */
  type: TicketType;
  /** Evento al que pertenece */
  event: Event;
  /** ID único (opcional, se genera automáticamente si no se proporciona) */
  id?: string;
}

/**
 * Propiedades para actualizar un ticket existente
 * 
 * Define los campos que pueden ser modificados después de la creación inicial.
 * Todos los campos son opcionales ya que solo se actualizan los proporcionados.
 */
export interface TicketUpdateProps {
  /** Nuevo nombre del ticket */
  name?: string;
  /** Nueva descripción del ticket */
  description?: string;
  /** Nuevo precio del ticket */
  price?: Money;
  /** Nueva cantidad total de tickets */
  quantity?: number;
  /** Nuevo tipo de ticket */
  type?: TicketType;
}

/**
 * Entidad que representa un ticket para un evento
 * 
 * Implementa la lógica de negocio relacionada con los tickets, incluyendo
 * su creación, validación, actualización, compra y cancelación. Un ticket
 * es una entidad que representa el derecho de un usuario a asistir a un evento,
 * con un tipo específico, precio y estado.
 * 
 * Esta entidad es inmutable, cada operación devuelve una nueva instancia.
 * 
 * @implements {Entity<string>} Implementa la interfaz de entidad con ID de tipo string
 */
export class Ticket implements Entity<string> {
  /** Identificador único del ticket */
  readonly id: string;
  /** Fecha de creación */
  readonly createdAt: Date;
  /** Fecha de última actualización */
  readonly updatedAt: Date;
  /** Indica si está activo en el sistema */
  readonly isActive: boolean;
  /** Nombre o título del ticket */
  readonly name: string;
  /** Descripción detallada */
  readonly description: string;
  /** Precio (value object Money) */
  readonly price: Money;
  /** Cantidad total de tickets disponibles originalmente */
  readonly quantity: number;
  /** Cantidad de tickets aún disponibles para venta */
  readonly availableQuantity: number;
  /** Tipo de ticket (value object) */
  readonly type: TicketType;
  /** Estado actual del ticket (value object) */
  readonly status: TicketStatus;
  /** Evento al que pertenece este ticket */
  readonly event: Event;
  /** Usuario que realizó la compra (si aplica) */
  readonly purchasedBy?: User;
  /** Fecha y hora exacta de la compra (si aplica) */
  readonly purchasedAt?: Date;

  /**
   * Constructor privado de Ticket
   * 
   * Se utiliza el patrón Factory para asegurar la creación válida de tickets.
   * 
   * @param props Propiedades completas del ticket
   */
  private constructor(props: TicketProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.isActive = props.isActive;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.quantity = props.quantity;
    this.availableQuantity = props.availableQuantity;
    this.type = props.type;
    this.status = props.status;
    this.event = props.event;
    this.purchasedBy = props.purchasedBy;
    this.purchasedAt = props.purchasedAt;
  }

  /**
   * Crea un nuevo ticket con validación de reglas de negocio
   * 
   * @param props Propiedades para crear el ticket
   * @returns Nueva instancia de Ticket
   * @throws {TicketCreateException} Si los datos son inválidos o violan reglas de negocio
   */
  public static create(props: TicketCreateProps): Ticket {
    // Validación de nombre
    if (!props.name || props.name.trim().length === 0) {
      throw new TicketCreateException('El nombre del ticket es obligatorio');
    }

    // Validación de descripción
    if (!props.description || props.description.trim().length === 0) {
      throw new TicketCreateException('La descripción del ticket es obligatoria');
    }

    // Validación de precio
    if (!props.price) {
      throw new TicketCreateException('El precio del ticket es obligatorio');
    }

    // El precio debe ser mayor que cero
    if (props.price.value() <= 0) {
      throw new TicketCreateException('El precio del ticket debe ser mayor a cero');
    }

    // Validación de cantidad
    if (props.quantity <= 0) {
      throw new TicketCreateException('La cantidad de tickets debe ser mayor a cero');
    }

    // Validación de tipo de ticket
    if (!props.type) {
      throw new TicketCreateException('El tipo de ticket es obligatorio');
    }

    // Validación de evento
    if (!props.event) {
      throw new TicketCreateException('El evento es obligatorio');
    }

    // Fecha actual para creación y actualización
    const now = new Date();

    return new Ticket({
      id: props.id || uuidv4(), // Generar ID si no se proporciona
      createdAt: now,
      updatedAt: now,
      isActive: true,
      name: props.name.trim(),
      description: props.description.trim(),
      price: props.price,
      quantity: props.quantity,
      availableQuantity: props.quantity,
      type: props.type,
      status: TicketStatus.create(TicketStatusEnum.AVAILABLE), // Estado inicial siempre es AVAILABLE
      event: props.event
    });
  }

  /**
   * Reconstruye un ticket desde la persistencia sin validaciones
   * 
   * @param props Propiedades completas del ticket
   * @returns Instancia reconstruida del ticket
   */
  public static reconstitute(props: TicketProps): Ticket {
    return new Ticket(props);
  }

  /**
   * Compara si este ticket es igual a otra entidad
   * 
   * @param entity Entidad a comparar
   * @returns true si tienen el mismo identificador
   */
  equals(entity: Entity<string>): boolean {
    return this.id === entity.id;
  }

  /**
   * Actualiza las propiedades modificables del ticket
   * 
   * @param props Propiedades a actualizar
   * @returns Nueva instancia con las propiedades actualizadas
   * @throws {TicketUpdateException} Si los datos son inválidos o violan reglas de negocio
   */
  update(props: TicketUpdateProps): Ticket {
    if (this.isPurchased()) {
      throw new TicketUpdateException(
        'No se puede actualizar un ticket que ya ha sido comprado'
      );
    }

    let updated = false;
    let newProps: Partial<TicketProps> = {};
 
    // Actualizar nombre si se proporciona
    if (props.name !== undefined) {
      if (props.name.trim().length === 0) {
        throw new TicketUpdateException('El nombre del ticket no puede estar vacío');
      }
      if (props.name.trim() !== this.name) {
        newProps.name = props.name.trim();
        updated = true;
      }
    }

    // Actualizar descripción si se proporciona
    if (props.description !== undefined) {
      if (props.description.trim().length === 0) {
        throw new TicketUpdateException('La descripción del ticket no puede estar vacía');
      }
      if (props.description.trim() !== this.description) {
        newProps.description = props.description.trim();
        updated = true;
      }
    }

    // Actualizar precio si se proporciona
    if (props.price) {
      if (props.price.value() <= 0) {
        throw new TicketUpdateException('El precio debe ser mayor a cero');
      }
      if (!this.price.equals(props.price)) {
        newProps.price = props.price;
        updated = true;
      }
    }

    // Actualizar cantidad si se proporciona
    if (props.quantity !== undefined) {
      if (props.quantity <= 0) {
        throw new TicketUpdateException('La cantidad de tickets debe ser mayor a cero');
      }
      
      // Calcular cuántos tickets se han vendido
      const soldTickets = this.quantity - this.availableQuantity;
      
      // Verificar que la nueva cantidad no sea menor que los tickets vendidos
      if (props.quantity < soldTickets) {
        throw new TicketUpdateException(
          'No se puede reducir la cantidad por debajo de los tickets ya vendidos'
        );
      }
      
      if (props.quantity !== this.quantity) {
        // Calcular la diferencia para ajustar la cantidad disponible
        const difference = props.quantity - this.quantity;
        newProps.quantity = props.quantity;
        newProps.availableQuantity = this.availableQuantity + difference;
        updated = true;
      }
    }

    // Actualizar tipo si se proporciona
    if (props.type && !this.type.equals(props.type)) {
      newProps.type = props.type;
      updated = true;
    }

    // Si no se actualizó nada, devolver la misma instancia
    if (!updated) {
      return this;
    }

    // Actualizar fecha de modificación
    newProps.updatedAt = new Date();

    // Crear una nueva instancia con las propiedades actualizadas
    return this.copyWith(newProps);
  }

  /**
   * Marca el ticket como comprado por un usuario
   * 
   * @param user Usuario que realiza la compra
   * @returns Nueva instancia con el ticket marcado como comprado
   * @throws {TicketUpdateException} Si el ticket no está disponible o hay otro problema
   */
  purchase(user: User): Ticket {
    if (!user) {
      throw new TicketUpdateException('Se requiere un usuario para comprar un ticket');
    }

    if (!this.isActive) {
      throw new TicketUpdateException('No se puede comprar un ticket inactivo');
    }

    if (this.status.value() !== TicketStatusEnum.AVAILABLE) {
      throw new TicketUpdateException('El ticket no está disponible para compra');
    }

    if (this.availableQuantity <= 0) {
      throw new TicketUpdateException('No hay tickets disponibles para compra');
    }

    return this.copyWith({
      availableQuantity: this.availableQuantity - 1,
      purchasedBy: user,
      purchasedAt: new Date(),
      status: TicketStatus.create(TicketStatusEnum.SOLD),
      updatedAt: new Date()
    });
  }

  /**
   * Cancela la compra del ticket, devolviéndolo al inventario disponible
   * 
   * @returns Nueva instancia con el ticket cancelado y disponible nuevamente
   * @throws {TicketUpdateException} Si el ticket no está en estado comprado
   */
  cancelPurchase(): Ticket {
    if (this.status.value() !== TicketStatusEnum.SOLD) {
      throw new TicketUpdateException('El ticket no está vendido, no se puede cancelar');
    }

    return this.copyWith({
      availableQuantity: this.availableQuantity + 1,
      purchasedBy: undefined,
      purchasedAt: undefined,
      status: TicketStatus.create(TicketStatusEnum.AVAILABLE),
      updatedAt: new Date()
    });
  }

  /**
   * Verifica si el ticket está disponible para compra
   * 
   * @returns true si el ticket está disponible
   */
  isAvailable(): boolean {
    return this.status.value() === TicketStatusEnum.AVAILABLE;
  }

  /**
   * Verifica si el ticket ha sido comprado
   * 
   * @returns true si el ticket ha sido comprado
   */
  isPurchased(): boolean {
    return this.status.value() === TicketStatusEnum.SOLD;
  }

  /**
   * Verifica si el ticket ha sido cancelado
   * 
   * @returns true si el ticket ha sido cancelado
   */
  isCancelled(): boolean {
    return this.status.value() === TicketStatusEnum.CANCELLED;
  }

  /**
   * Crea una copia del ticket con propiedades actualizadas
   * 
   * Método de utilidad para crear una nueva instancia preservando
   * la inmutabilidad del objeto.
   * 
   * @param props Propiedades parciales a actualizar
   * @returns Nueva instancia con las propiedades actualizadas
   * @private Método de uso interno
   */
  private copyWith(props: Partial<TicketProps>): Ticket {
    return new Ticket({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
      name: this.name,
      description: this.description,
      price: this.price,
      quantity: this.quantity,
      availableQuantity: this.availableQuantity,
      type: this.type,
      status: this.status,
      event: this.event,
      purchasedBy: this.purchasedBy,
      purchasedAt: this.purchasedAt,
      ...props,
    });
  }

  /**
   * Convierte la entidad a un objeto plano
   * 
   * @returns Objeto con todas las propiedades del ticket
   */
  toObject(): TicketProps {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
      name: this.name,
      description: this.description,
      price: this.price,
      quantity: this.quantity,
      availableQuantity: this.availableQuantity,
      type: this.type,
      status: this.status,
      event: this.event,
      purchasedBy: this.purchasedBy,
      purchasedAt: this.purchasedAt,
    };
  }

  /**
   * Activa el ticket permitiendo que pueda ser vendido
   * 
   * @returns Nueva instancia con el ticket activado
   */
  activate(): Ticket {
    if (this.isActive) {
      return this;
    }

    return this.copyWith({
      isActive: true,
      updatedAt: new Date()
    });
  }

  /**
   * Desactiva el ticket impidiendo su venta
   * 
   * @returns Nueva instancia con el ticket desactivado
   */
  deactivate(): Ticket {
    if (!this.isActive) {
      return this;
    }

    return this.copyWith({
      isActive: false,
      updatedAt: new Date()
    });
  }

  /**
   * Cancela la compra del ticket, devolviéndolo al inventario disponible
   * 
   * @returns Nueva instancia con el ticket cancelado y disponible nuevamente
   * @throws {TicketUpdateException} Si el ticket no está en estado comprado
   */
  cancel(): Ticket {
    return this.cancelPurchase();
  }
} 