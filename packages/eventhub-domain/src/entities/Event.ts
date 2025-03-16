import { EventCreateException } from '../exceptions/EventCreateException';
import { EventUpdateException } from '../exceptions/EventUpdateException';
import { EventAttendanceException } from '../exceptions/EventAttendanceException';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidad de dominio para eventos
 * Encapsula reglas de negocio relacionadas con eventos
 */
export class Event {
  private _id: string;
  private _title: string;
  private _description: string;
  private _startDate: Date;
  private _endDate: Date;
  private _location: string;
  private _organizerId: string;
  private _capacity: number | null;
  private _attendees: string[];
  private _isActive: boolean;
  private _isCancelled: boolean;
  private _tags: string[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: EventParams) {
    this._id = params.id || uuidv4();
    this._title = params.title;
    this._description = params.description;
    this._startDate = new Date(params.startDate);
    this._endDate = new Date(params.endDate);
    this._location = params.location;
    this._organizerId = params.organizerId;
    this._capacity = params.capacity || null;
    this._attendees = params.attendees || [];
    this._isActive = params.isActive !== undefined ? params.isActive : true;
    this._isCancelled = params.isCancelled || false;
    this._tags = params.tags || [];
    this._createdAt = params.createdAt || new Date();
    this._updatedAt = params.updatedAt || new Date();

    this.validate();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get location(): string {
    return this._location;
  }

  get organizerId(): string {
    return this._organizerId;
  }

  get capacity(): number | null {
    return this._capacity;
  }

  get attendees(): string[] {
    return [...this._attendees]; // Retornar copia para evitar modificación externa
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get isCancelled(): boolean {
    return this._isCancelled;
  }

  get tags(): string[] {
    return [...this._tags]; // Retornar copia para evitar modificación externa
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Validación de los datos del evento
   * @throws EventCreateException si los datos no son válidos
   */
  private validate(): void {
    // Validar campos requeridos
    if (!this._title || this._title.trim().length === 0) {
      throw new EventCreateException('El título es requerido');
    }

    if (!this._description || this._description.trim().length === 0) {
      throw new EventCreateException('La descripción es requerida');
    }

    if (!this._location || this._location.trim().length === 0) {
      throw new EventCreateException('La ubicación es requerida');
    }

    if (!this._organizerId) {
      throw new EventCreateException('El organizador es requerido');
    }

    // Validar longitud de campos
    if (this._title.length > 100) {
      throw new EventCreateException('El título no puede tener más de 100 caracteres');
    }

    if (this._description.length > 2000) {
      throw new EventCreateException('La descripción no puede tener más de 2000 caracteres');
    }

    if (this._location.length > 200) {
      throw new EventCreateException('La ubicación no puede tener más de 200 caracteres');
    }

    // Validar fechas
    const now = new Date();
    
    if (isNaN(this._startDate.getTime())) {
      throw new EventCreateException('La fecha de inicio no es válida');
    }
    
    if (isNaN(this._endDate.getTime())) {
      throw new EventCreateException('La fecha de fin no es válida');
    }
    
    if (this._startDate < now && this._id === this._id) {
      // Solo validar para eventos nuevos
      throw new EventCreateException('La fecha de inicio debe ser posterior a la fecha actual');
    }
    
    if (this._endDate < this._startDate) {
      throw new EventCreateException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Validar capacidad
    if (this._capacity !== null && this._capacity < 1) {
      throw new EventCreateException('La capacidad debe ser mayor que cero');
    }

    // Validar que no haya asistentes duplicados
    const uniqueAttendees = new Set(this._attendees);
    if (uniqueAttendees.size !== this._attendees.length) {
      throw new EventCreateException('No puede haber asistentes duplicados');
    }

    // Validar que no se exceda la capacidad
    if (this._capacity !== null && this._attendees.length > this._capacity) {
      throw new EventCreateException(`El evento ha excedido su capacidad máxima de ${this._capacity} asistentes`);
    }
  }

  /**
   * Actualiza los datos básicos del evento
   * @throws EventUpdateException si los datos actualizados no son válidos
   */
  update(params: EventUpdateParams): void {
    if (this._isCancelled) {
      throw new EventUpdateException('No se puede actualizar un evento cancelado');
    }

    if (params.title !== undefined) {
      this._title = params.title;
    }

    if (params.description !== undefined) {
      this._description = params.description;
    }

    if (params.startDate !== undefined) {
      this._startDate = new Date(params.startDate);
    }

    if (params.endDate !== undefined) {
      this._endDate = new Date(params.endDate);
    }

    if (params.location !== undefined) {
      this._location = params.location;
    }

    if (params.capacity !== undefined) {
      this._capacity = params.capacity;
    }

    if (params.tags !== undefined) {
      this._tags = params.tags;
    }

    this._updatedAt = new Date();
    
    try {
      this.validate();
    } catch (error) {
      if (error instanceof EventCreateException) {
        // Convertir excepciones de creación a excepciones de actualización
        throw new EventUpdateException(error.message);
      }
      throw error;
    }
  }

  /**
   * Añade un asistente al evento
   * @throws EventAttendanceException si no se puede añadir el asistente
   */
  addAttendee(userId: string): void {
    if (this._isCancelled) {
      throw new EventAttendanceException('No se puede registrar en un evento cancelado');
    }

    if (!this._isActive) {
      throw new EventAttendanceException('No se puede registrar en un evento inactivo');
    }

    if (this._endDate < new Date()) {
      throw new EventAttendanceException('No se puede registrar en un evento que ya ha finalizado');
    }

    if (this._attendees.includes(userId)) {
      throw new EventAttendanceException('El usuario ya está registrado en este evento');
    }

    if (this._capacity !== null && this._attendees.length >= this._capacity) {
      throw new EventAttendanceException('El evento ha alcanzado su capacidad máxima');
    }

    this._attendees.push(userId);
    this._updatedAt = new Date();
  }

  /**
   * Elimina un asistente del evento
   * @throws EventAttendanceException si no se puede eliminar el asistente
   */
  removeAttendee(userId: string): void {
    if (this._isCancelled) {
      throw new EventAttendanceException('No se puede cancelar registro en un evento cancelado');
    }

    if (!this._attendees.includes(userId)) {
      throw new EventAttendanceException('El usuario no está registrado en este evento');
    }

    this._attendees = this._attendees.filter(id => id !== userId);
    this._updatedAt = new Date();
  }

  /**
   * Cancela el evento
   */
  cancelEvent(): void {
    if (this._isCancelled) {
      return; // Ya está cancelado
    }

    this._isCancelled = true;
    this._isActive = false;
    this._updatedAt = new Date();
  }

  /**
   * Verifica si un usuario es el organizador del evento
   */
  isOrganizer(userId: string): boolean {
    return this._organizerId === userId;
  }

  /**
   * Verifica si el evento ha finalizado
   */
  hasEnded(): boolean {
    return new Date() > this._endDate;
  }

  /**
   * Verifica si el evento tiene espacio para más asistentes
   */
  hasAvailableSpace(): boolean {
    if (this._capacity === null) {
      return true; // Sin límite de capacidad
    }
    return this._attendees.length < this._capacity;
  }
}

export interface EventParams {
  id?: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  location: string;
  organizerId: string;
  capacity?: number | null;
  attendees?: string[];
  isActive?: boolean;
  isCancelled?: boolean;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventUpdateParams {
  title?: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  location?: string;
  capacity?: number | null;
  tags?: string[];
} 