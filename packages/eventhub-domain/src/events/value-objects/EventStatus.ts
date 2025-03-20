import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Enum para definir los posibles estados de un evento
 */
export enum EventStatusEnum {
  DRAFT = 'DRAFT',           // Borrador, no publicado
  PUBLISHED = 'PUBLISHED',   // Publicado y activo
  CANCELLED = 'CANCELLED',   // Cancelado
  COMPLETED = 'COMPLETED',   // Finalizado (la fecha de fin ha pasado)
  SUSPENDED = 'SUSPENDED'    // Suspendido temporalmente
}

/**
 * Value Object para representar el estado de un evento
 * Implementa la interfaz ValueObject para mantener consistencia
 */
export class EventStatus implements ValueObject<EventStatusEnum> {
  private readonly _value: EventStatusEnum;

  /**
   * Constructor de EventStatus
   * @param status Valor del estado o string a convertir
   * @throws Error si el estado no es válido
   */
  constructor(status: EventStatusEnum | string) {
    const statusValue = typeof status === 'string' ? status as EventStatusEnum : status;
    
    if (!this.isValid(statusValue)) {
      throw new Error(`Estado no válido: ${status}. Estados disponibles: ${Object.values(EventStatusEnum).join(', ')}`);
    }
    
    this._value = statusValue;
  }

  /**
   * Obtiene el valor del estado
   * @returns Valor del estado
   */
  value(): EventStatusEnum {
    return this._value;
  }

  /**
   * Compara si dos estados son iguales
   * @param vo Estado a comparar
   * @returns true si los estados son iguales
   */
  equals(vo: ValueObject<EventStatusEnum>): boolean {
    return this._value === vo.value();
  }

  /**
   * Representación en string del estado
   * @returns String representación del estado
   */
  toString(): string {
    return this._value;
  }

  /**
   * Verifica si un valor es un estado válido
   * @param status Valor a verificar
   * @returns true si el estado es válido
   */
  private isValid(status: EventStatusEnum | string): boolean {
    return Object.values(EventStatusEnum).includes(status as EventStatusEnum);
  }

  /**
   * Verifica si el evento está publicado
   * @returns true si está publicado
   */
  isPublished(): boolean {
    return this._value === EventStatusEnum.PUBLISHED;
  }

  /**
   * Verifica si el evento está cancelado
   * @returns true si está cancelado
   */
  isCancelled(): boolean {
    return this._value === EventStatusEnum.CANCELLED;
  }

  /**
   * Verifica si el evento está en borrador
   * @returns true si está en borrador
   */
  isDraft(): boolean {
    return this._value === EventStatusEnum.DRAFT;
  }

  /**
   * Verifica si el evento está completado
   * @returns true si está completado
   */
  isCompleted(): boolean {
    return this._value === EventStatusEnum.COMPLETED;
  }

  /**
   * Verifica si el evento está suspendido
   * @returns true si está suspendido
   */
  isSuspended(): boolean {
    return this._value === EventStatusEnum.SUSPENDED;
  }

  /**
   * Crea un estado DRAFT
   * @returns Instancia de EventStatus con valor DRAFT
   */
  static draft(): EventStatus {
    return new EventStatus(EventStatusEnum.DRAFT);
  }

  /**
   * Crea un estado PUBLISHED
   * @returns Instancia de EventStatus con valor PUBLISHED
   */
  static published(): EventStatus {
    return new EventStatus(EventStatusEnum.PUBLISHED);
  }

  /**
   * Crea un estado CANCELLED
   * @returns Instancia de EventStatus con valor CANCELLED
   */
  static cancelled(): EventStatus {
    return new EventStatus(EventStatusEnum.CANCELLED);
  }

  /**
   * Crea un estado COMPLETED
   * @returns Instancia de EventStatus con valor COMPLETED
   */
  static completed(): EventStatus {
    return new EventStatus(EventStatusEnum.COMPLETED);
  }

  /**
   * Crea un estado SUSPENDED
   * @returns Instancia de EventStatus con valor SUSPENDED
   */
  static suspended(): EventStatus {
    return new EventStatus(EventStatusEnum.SUSPENDED);
  }
} 