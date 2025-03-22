import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../core/interfaces/Entity';
import { EventStatus, EventStatusEnum } from '../value-objects/EventStatus';
import { EventLocation, EventLocationProps } from '../value-objects/EventLocation';
import { EventTags } from '../value-objects/EventTags';
import { EventCreateException } from '../exceptions/EventCreateException';
import { EventUpdateException } from '../exceptions/EventUpdateException';
import { EventAttendanceException } from '../exceptions/EventAttendanceException';

/**
 * Interfaz que define las propiedades de un evento
 * Contiene todos los datos necesarios para representar completamente un evento
 */
export interface EventProps {
  /** Identificador único del evento */
  id: string;
  /** Fecha de creación del evento en el sistema */
  createdAt: Date;
  /** Fecha de última actualización del evento */
  updatedAt: Date;
  /** Indica si el evento está activo en el sistema */
  isActive: boolean;
  /** Título o nombre del evento */
  title: string;
  /** Descripción detallada del evento */
  description: string;
  /** Fecha y hora de inicio del evento */
  startDate: Date;
  /** Fecha y hora de finalización del evento */
  endDate: Date;
  /** Ubicación donde se realizará el evento */
  location: EventLocation;
  /** Identificador del usuario organizador del evento */
  organizerId: string;
  /** Capacidad máxima de asistentes (null si es ilimitada) */
  capacity: number | null;
  /** Lista de identificadores de usuarios que asistirán al evento */
  attendees: string[];
  /** Estado actual del evento (borrador, publicado, etc.) */
  status: EventStatus;
  /** Etiquetas para categorizar el evento */
  tags: EventTags;
}

/**
 * Interfaz para la creación de eventos
 * Contiene solo las propiedades necesarias para crear un evento nuevo
 */
export interface EventCreateProps {
  /** Identificador único opcional para el evento (se genera automáticamente si no se proporciona) */
  id?: string;
  /** Título o nombre del evento */
  title: string;
  /** Descripción detallada del evento */
  description: string;
  /** Fecha y hora de inicio del evento */
  startDate: Date;
  /** Fecha y hora de finalización del evento */
  endDate: Date;
  /** Ubicación donde se realizará el evento */
  location: EventLocation | EventLocationProps;
  /** Identificador del usuario organizador del evento */
  organizerId: string;
  /** Capacidad máxima de asistentes (opcional) */
  capacity?: number;
  /** Lista de asistentes al evento (opcional) */
  attendees?: string[];
  /** Estado del evento (opcional) */
  status?: EventStatus | EventStatusEnum;
  /** Etiquetas para categorizar el evento (opcional) */
  tags?: string[] | EventTags;
  /** Indica si el evento está activo (opcional) */
  isActive?: boolean;
  /** Fecha de creación (opcional) */
  createdAt?: Date;
  /** Fecha de última actualización (opcional) */
  updatedAt?: Date;
}

/**
 * Interfaz para actualización de eventos
 * Todas las propiedades son opcionales para permitir actualizaciones parciales
 */
export interface EventUpdateProps {
  /** Título o nombre del evento */
  title?: string;
  /** Descripción detallada del evento */
  description?: string;
  /** Fecha y hora de inicio del evento */
  startDate?: Date;
  /** Fecha y hora de finalización del evento */
  endDate?: Date;
  /** Ubicación donde se realizará el evento */
  location?: EventLocation | EventLocationProps;
  /** Capacidad máxima de asistentes */
  capacity?: number | null;
  /** Etiquetas para categorizar el evento */
  tags?: string[] | EventTags;
}

/**
 * Entidad de dominio para eventos
 * 
 * Representa un evento organizado dentro de la plataforma, con todas sus propiedades
 * y comportamientos asociados. Implementa las reglas de negocio relacionadas con
 * la creación, modificación y gestión de eventos, así como la administración de asistentes.
 * 
 * Esta entidad es inmutable para garantizar la integridad de los datos y usa el patrón
 * de métodos factory para validar la creación.
 * 
 * @implements {Entity<string>} Implementa la interfaz base Entity con identificador de tipo string
 */
export class Event implements Entity<string> {
  /** Identificador único del evento */
  readonly id: string;
  /** Fecha de creación del evento en el sistema */
  readonly createdAt: Date;
  /** Fecha de última actualización del evento */
  readonly updatedAt: Date;
  /** Indica si el evento está activo en el sistema */
  readonly isActive: boolean;

  /** Título o nombre del evento */
  readonly title: string;
  /** Descripción detallada del evento */
  readonly description: string;
  /** Fecha y hora de inicio del evento */
  readonly startDate: Date;
  /** Fecha y hora de finalización del evento */
  readonly endDate: Date;
  /** Ubicación donde se realizará el evento */
  readonly location: EventLocation;
  /** Identificador del usuario organizador del evento */
  readonly organizerId: string;
  /** Capacidad máxima de asistentes (null si es ilimitada) */
  readonly capacity: number | null;
  /** Lista de identificadores de usuarios que asistirán al evento */
  readonly attendees: string[];
  /** Estado actual del evento (borrador, publicado, etc.) */
  readonly status: EventStatus;
  /** Etiquetas para categorizar el evento */
  readonly tags: EventTags;

  /**
   * Constructor privado de Event
   * Se utiliza el patrón de constructor privado para forzar la creación a través
   * del método estático create() que garantiza la validación de los datos.
   * 
   * @param props Propiedades completas del evento
   */
  private constructor(props: EventProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.location = props.location;
    this.organizerId = props.organizerId;
    this.capacity = props.capacity;
    this.attendees = [...props.attendees]; // Copia para evitar modificación externa
    this.status = props.status;
    this.tags = props.tags;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea una nueva instancia de Event validando los datos
   * @param props Propiedades para crear el evento
   * @returns Nueva instancia de Event
   * @throws EventCreateException si los datos no son válidos
   */
  static create(props: EventCreateProps): Event {
    // Generar ID si no se proporciona
    const id = props.id || uuidv4();
    
    // Validar título
    if (!props.title || props.title.trim().length === 0) {
      throw new EventCreateException('El título es requerido');
    }

    if (props.title.length > 100) {
      throw new EventCreateException('El título no puede tener más de 100 caracteres');
    }

    // Validar descripción
    if (!props.description || props.description.trim().length === 0) {
      throw new EventCreateException('La descripción es requerida');
    }

    if (props.description.length > 2000) {
      throw new EventCreateException('La descripción no puede tener más de 2000 caracteres');
    }

    // Validar organizador
    if (!props.organizerId) {
      throw new EventCreateException('El organizador es requerido');
    }

    // Convertir fechas a objetos Date si son strings
    const startDate = props.startDate instanceof Date ? 
      props.startDate : 
      new Date(props.startDate);
    
    const endDate = props.endDate instanceof Date ? 
      props.endDate : 
      new Date(props.endDate);

    // Validar fechas
    if (isNaN(startDate.getTime())) {
      throw new EventCreateException('La fecha de inicio no es válida');
    }
    
    if (isNaN(endDate.getTime())) {
      throw new EventCreateException('La fecha de fin no es válida');
    }
    
    const now = new Date();
    
    if (startDate < now && !props.id) {
      // Solo validar para eventos nuevos
      throw new EventCreateException('La fecha de inicio debe ser posterior a la fecha actual');
    }
    
    if (endDate < startDate) {
      throw new EventCreateException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Validar capacidad
    if (props.capacity !== undefined && props.capacity !== null && props.capacity < 1) {
      throw new EventCreateException('La capacidad debe ser mayor que cero');
    }

    // Convertir ubicación a EventLocation si es un objeto plano
    const location = props.location instanceof EventLocation ? 
      props.location : 
      new EventLocation(props.location);

    // Convertir etiquetas a EventTags
    const tags = props.tags instanceof EventTags ? 
      props.tags : 
      new EventTags(props.tags || []);

    // Convertir estado a EventStatus con valor por defecto DRAFT
    const status = props.status instanceof EventStatus ? 
      props.status : 
      props.status ? new EventStatus(props.status) : EventStatus.draft();

    // Validar que no haya asistentes duplicados
    const attendees = props.attendees || [];
    const uniqueAttendees = [...new Set(attendees)];
    
    if (uniqueAttendees.length !== attendees.length) {
      throw new EventCreateException('No puede haber asistentes duplicados');
    }

    // Validar que no se exceda la capacidad
    if (props.capacity !== undefined && props.capacity !== null && attendees.length > props.capacity) {
      throw new EventCreateException(`El evento ha excedido su capacidad máxima de ${props.capacity} asistentes`);
    }

    // Crear evento
    return new Event({
      id,
      title: props.title,
      description: props.description,
      startDate,
      endDate,
      location,
      organizerId: props.organizerId,
      capacity: props.capacity ?? null,
      attendees,
      status,
      tags,
      isActive: props.isActive !== undefined ? props.isActive : true,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye un Event desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir el evento
   * @returns Instancia de Event reconstruida
   */
  static reconstitute(props: EventProps): Event {
    return new Event(props);
  }

  /**
   * Compara si dos entidades Event son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Event)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Actualiza los datos básicos del evento
   * @param props Propiedades a actualizar
   * @returns Evento actualizado
   * @throws EventUpdateException si los datos actualizados no son válidos
   */
  update(props: EventUpdateProps): Event {
    if (this.status.isCancelled()) {
      throw new EventUpdateException('No se puede actualizar un evento cancelado');
    }

    // Validar título si se proporciona
    if (props.title && props.title.length > 100) {
      throw new EventUpdateException('El título no puede tener más de 100 caracteres');
    }

    // Validar descripción si se proporciona
    if (props.description && props.description.length > 2000) {
      throw new EventUpdateException('La descripción no puede tener más de 2000 caracteres');
    }

    // Convertir fechas a objetos Date si son strings y validar
    let startDate = this.startDate;
    let endDate = this.endDate;
    
    if (props.startDate) {
      startDate = props.startDate instanceof Date ? 
        props.startDate : 
        new Date(props.startDate);
        
      if (isNaN(startDate.getTime())) {
        throw new EventUpdateException('La fecha de inicio no es válida');
      }
    }
    
    if (props.endDate) {
      endDate = props.endDate instanceof Date ? 
        props.endDate : 
        new Date(props.endDate);
        
      if (isNaN(endDate.getTime())) {
        throw new EventUpdateException('La fecha de fin no es válida');
      }
    }
    
    if (endDate < startDate) {
      throw new EventUpdateException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Validar capacidad si se proporciona
    let capacity = this.capacity;
    if (props.capacity !== undefined) {
      capacity = props.capacity;
      
      if (capacity !== null && capacity < 1) {
        throw new EventUpdateException('La capacidad debe ser mayor que cero');
      }
      
      if (capacity !== null && this.attendees.length > capacity) {
        throw new EventUpdateException(`El evento ya tiene ${this.attendees.length} asistentes, no se puede reducir la capacidad a ${capacity}`);
      }
    }

    // Convertir ubicación a EventLocation si se proporciona
    const location = props.location instanceof EventLocation ? 
      props.location : 
      props.location ? new EventLocation(props.location) : this.location;

    // Convertir etiquetas a EventTags si se proporcionan
    const tags = props.tags instanceof EventTags ? 
      props.tags : 
      props.tags ? new EventTags(props.tags) : this.tags;

    // Crear evento actualizado
    return new Event({
      ...this.toObject(),
      title: props.title || this.title,
      description: props.description || this.description,
      startDate,
      endDate,
      location,
      capacity,
      tags,
      updatedAt: new Date()
    });
  }

  /**
   * Añade un asistente al evento
   * @param userId ID del usuario a añadir
   * @returns Evento actualizado con el nuevo asistente
   * @throws EventAttendanceException si no se puede añadir el asistente
   */
  addAttendee(userId: string): Event {
    if (this.status.isCancelled()) {
      throw new EventAttendanceException('No se puede registrar en un evento cancelado');
    }

    if (!this.isActive) {
      throw new EventAttendanceException('No se puede registrar en un evento inactivo');
    }

    if (this.hasEnded()) {
      throw new EventAttendanceException('No se puede registrar en un evento que ya ha finalizado');
    }

    if (this.attendees.includes(userId)) {
      throw new EventAttendanceException('El usuario ya está registrado en este evento');
    }

    if (this.capacity !== null && this.attendees.length >= this.capacity) {
      throw new EventAttendanceException('El evento ha alcanzado su capacidad máxima');
    }

    // Crear copia de los asistentes y añadir el nuevo
    const newAttendees = [...this.attendees, userId];

    // Crear evento actualizado
    return new Event({
      ...this.toObject(),
      attendees: newAttendees,
      updatedAt: new Date()
    });
  }

  /**
   * Elimina un asistente del evento
   * @param userId ID del usuario a eliminar
   * @returns Evento actualizado sin el asistente
   * @throws EventAttendanceException si no se puede eliminar el asistente
   */
  removeAttendee(userId: string): Event {
    if (this.status.isCancelled()) {
      throw new EventAttendanceException('No se puede modificar la asistencia de un evento cancelado');
    }

    if (!this.attendees.includes(userId)) {
      throw new EventAttendanceException('El usuario no está registrado en este evento');
    }

    // Crear copia de los asistentes sin el usuario
    const newAttendees = this.attendees.filter(id => id !== userId);

    // Crear evento actualizado
    return new Event({
      ...this.toObject(),
      attendees: newAttendees,
      updatedAt: new Date()
    });
  }

  /**
   * Cancela el evento
   * @returns Evento actualizado como cancelado
   */
  cancel(): Event {
    if (this.status.isCancelled()) {
      return this; // Ya está cancelado
    }

    // Crear evento actualizado con estado CANCELLED
    return new Event({
      ...this.toObject(),
      status: EventStatus.cancelled(),
      updatedAt: new Date()
    });
  }

  /**
   * Cambia el estado del evento
   * @param status Nuevo estado
   * @returns Evento actualizado con el nuevo estado
   */
  changeStatus(status: EventStatus | EventStatusEnum): Event {
    const newStatus = status instanceof EventStatus ? 
      status : 
      new EventStatus(status);
      
    // Si el estado es el mismo, no hacer nada
    if (this.status.equals(newStatus)) {
      return this;
    }

    // Crear evento actualizado con el nuevo estado
    return new Event({
      ...this.toObject(),
      status: newStatus,
      updatedAt: new Date()
    });
  }

  /**
   * Verifica si el usuario es el organizador del evento
   * @param userId ID del usuario
   * @returns true si el usuario es el organizador
   */
  isOrganizer(userId: string): boolean {
    return this.organizerId === userId;
  }

  /**
   * Verifica si el evento ha finalizado
   * @returns true si el evento ha finalizado
   */
  hasEnded(): boolean {
    return this.endDate < new Date();
  }

  /**
   * Verifica si el evento tiene espacio disponible
   * @returns true si hay espacio disponible
   */
  hasAvailableCapacity(): boolean {
    if (this.capacity === null) {
      return true; // Capacidad ilimitada
    }
    
    return this.attendees.length < this.capacity;
  }

  /**
   * Obtiene el número de asistentes
   * @returns Número de asistentes
   */
  get attendeeCount(): number {
    return this.attendees.length;
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades del evento
   */
  toObject(): EventProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
      location: this.location,
      organizerId: this.organizerId,
      capacity: this.capacity,
      attendees: [...this.attendees],
      status: this.status,
      tags: this.tags,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 