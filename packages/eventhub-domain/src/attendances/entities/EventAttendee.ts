import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../../core/interfaces/Entity';
import { AttendanceStatus, AttendanceStatusEnum } from '../value-objects/AttendanceStatus';
import { EventAttendeeCreateException } from '../exceptions/EventAttendeeCreateException';
import { EventAttendeeUpdateException } from '../exceptions/EventAttendeeUpdateException';

/**
 * Entidad de dominio para asistencia a eventos
 * Modela la relación entre un evento y un asistente
 */
export class EventAttendee implements Entity<string> {
  // Propiedades base de la entidad
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isActive: boolean;

  // Propiedades específicas de la asistencia
  readonly eventId: string;
  readonly userId: string;
  readonly status: AttendanceStatus;
  readonly registrationDate: Date;
  readonly checkedIn: boolean;
  readonly checkedInDate: Date | null;
  readonly ticketId: string | null;
  readonly notes: string | null;

  /**
   * Constructor privado de EventAttendee
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: EventAttendeeProps) {
    this.id = props.id;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.status = props.status;
    this.registrationDate = props.registrationDate;
    this.checkedIn = props.checkedIn;
    this.checkedInDate = props.checkedInDate;
    this.ticketId = props.ticketId;
    this.notes = props.notes;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea una nueva instancia de EventAttendee validando los datos
   * @param props Propiedades para crear la asistencia
   * @returns Nueva instancia de EventAttendee
   * @throws EventAttendeeCreateException si los datos no son válidos
   */
  static create(props: EventAttendeeCreateProps): EventAttendee {
    // Generar ID si no se proporciona
    const id = props.id || uuidv4();
    
    // Validar eventId
    if (!props.eventId) {
      throw new EventAttendeeCreateException('El ID del evento es requerido');
    }

    // Validar userId
    if (!props.userId) {
      throw new EventAttendeeCreateException('El ID del usuario es requerido');
    }

    // Convertir estado a AttendanceStatus con valor por defecto REGISTERED
    const status = props.status instanceof AttendanceStatus ? 
      props.status : 
      props.status ? new AttendanceStatus(props.status) : AttendanceStatus.registered();

    // Establecer fecha de registro
    const registrationDate = props.registrationDate || new Date();

    // Crear asistencia
    return new EventAttendee({
      id,
      eventId: props.eventId,
      userId: props.userId,
      status,
      registrationDate,
      checkedIn: props.checkedIn || false,
      checkedInDate: props.checkedInDate || null,
      ticketId: props.ticketId || null,
      notes: props.notes || null,
      isActive: props.isActive !== undefined ? props.isActive : true,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye un EventAttendee desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir la asistencia
   * @returns Instancia de EventAttendee reconstruida
   */
  static reconstitute(props: EventAttendeeProps): EventAttendee {
    return new EventAttendee(props);
  }

  /**
   * Compara si dos entidades EventAttendee son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof EventAttendee)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Registra el check-in del asistente
   * @returns Asistencia actualizada con check-in realizado
   * @throws EventAttendeeUpdateException si no se puede realizar el check-in
   */
  checkIn(): EventAttendee {
    if (this.checkedIn) {
      throw new EventAttendeeUpdateException('El asistente ya ha realizado el check-in');
    }

    if (!this.status.isConfirmed() && !this.status.isRegistered()) {
      throw new EventAttendeeUpdateException('No se puede realizar check-in si la asistencia no está confirmada o registrada');
    }

    // Crear asistencia actualizada
    return new EventAttendee({
      ...this.toObject(),
      checkedIn: true,
      checkedInDate: new Date(),
      status: AttendanceStatus.attended(),
      updatedAt: new Date()
    });
  }

  /**
   * Cambia el estado de la asistencia
   * @param status Nuevo estado
   * @returns Asistencia actualizada con el nuevo estado
   */
  changeStatus(status: AttendanceStatus | AttendanceStatusEnum): EventAttendee {
    const newStatus = status instanceof AttendanceStatus ? 
      status : 
      new AttendanceStatus(status);
      
    // Si el estado es el mismo, no hacer nada
    if (this.status.equals(newStatus)) {
      return this;
    }

    // Crear asistencia actualizada con el nuevo estado
    return new EventAttendee({
      ...this.toObject(),
      status: newStatus,
      updatedAt: new Date()
    });
  }

  /**
   * Asigna un ticket a la asistencia
   * @param ticketId ID del ticket
   * @returns Asistencia actualizada con el ticket asignado
   */
  assignTicket(ticketId: string): EventAttendee {
    if (this.ticketId) {
      throw new EventAttendeeUpdateException('Ya existe un ticket asignado a esta asistencia');
    }

    if (!this.status.isConfirmed() && !this.status.isRegistered()) {
      throw new EventAttendeeUpdateException('No se puede asignar ticket si la asistencia no está confirmada o registrada');
    }

    // Crear asistencia actualizada
    return new EventAttendee({
      ...this.toObject(),
      ticketId,
      updatedAt: new Date()
    });
  }

  /**
   * Añade notas a la asistencia
   * @param notes Notas a añadir
   * @returns Asistencia actualizada con las notas
   */
  addNotes(notes: string): EventAttendee {
    if (!notes || notes.trim().length === 0) {
      throw new EventAttendeeUpdateException('Las notas no pueden estar vacías');
    }

    // Combinar notas existentes con las nuevas si ya hay notas
    const updatedNotes = this.notes 
      ? `${this.notes}\n${notes}` 
      : notes;

    // Crear asistencia actualizada
    return new EventAttendee({
      ...this.toObject(),
      notes: updatedNotes,
      updatedAt: new Date()
    });
  }

  /**
   * Cancela la asistencia
   * @returns Asistencia actualizada como cancelada
   */
  cancel(): EventAttendee {
    if (this.status.isCancelled()) {
      return this; // Ya está cancelada
    }

    if (this.checkedIn) {
      throw new EventAttendeeUpdateException('No se puede cancelar una asistencia con check-in realizado');
    }

    // Crear asistencia actualizada con estado CANCELLED
    return new EventAttendee({
      ...this.toObject(),
      status: AttendanceStatus.cancelled(),
      updatedAt: new Date()
    });
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades de la asistencia
   */
  toObject(): EventAttendeeProps {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      status: this.status,
      registrationDate: this.registrationDate,
      checkedIn: this.checkedIn,
      checkedInDate: this.checkedInDate,
      ticketId: this.ticketId,
      notes: this.notes,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Props para reconstruir una asistencia existente
 */
export interface EventAttendeeProps {
  id: string;
  eventId: string;
  userId: string;
  status: AttendanceStatus;
  registrationDate: Date;
  checkedIn: boolean;
  checkedInDate: Date | null;
  ticketId: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear una nueva asistencia
 */
export interface EventAttendeeCreateProps {
  id?: string;
  eventId: string;
  userId: string;
  status?: AttendanceStatus | AttendanceStatusEnum;
  registrationDate?: Date;
  checkedIn?: boolean;
  checkedInDate?: Date | null;
  ticketId?: string | null;
  notes?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Props para actualizar una asistencia
 */
export interface EventAttendeeUpdateProps {
  status?: AttendanceStatus | AttendanceStatusEnum;
  checkedIn?: boolean;
  checkedInDate?: Date | null;
  ticketId?: string | null;
  notes?: string | null;
} 