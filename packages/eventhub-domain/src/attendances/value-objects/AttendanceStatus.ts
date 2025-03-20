import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Enum para definir los posibles estados de una asistencia a evento
 */
export enum AttendanceStatusEnum {
  REGISTERED = 'REGISTERED',   // Registrado pero sin confirmar
  CONFIRMED = 'CONFIRMED',     // Confirmado (pago realizado si es necesario)
  WAITLISTED = 'WAITLISTED',   // En lista de espera
  CANCELLED = 'CANCELLED',     // Cancelado por el usuario
  ATTENDED = 'ATTENDED',       // Asistió al evento (check-in realizado)
  NO_SHOW = 'NO_SHOW'          // No asistió al evento
}

/**
 * Value Object para representar el estado de asistencia a un evento
 * Implementa la interfaz ValueObject para mantener consistencia
 */
export class AttendanceStatus implements ValueObject<AttendanceStatusEnum> {
  private readonly _value: AttendanceStatusEnum;

  /**
   * Constructor de AttendanceStatus
   * @param status Valor del estado o string a convertir
   * @throws Error si el estado no es válido
   */
  constructor(status: AttendanceStatusEnum | string) {
    const statusValue = typeof status === 'string' ? status as AttendanceStatusEnum : status;
    
    if (!this.isValid(statusValue)) {
      throw new Error(`Estado de asistencia no válido: ${status}. Estados disponibles: ${Object.values(AttendanceStatusEnum).join(', ')}`);
    }
    
    this._value = statusValue;
  }

  /**
   * Obtiene el valor del estado
   * @returns Valor del estado
   */
  value(): AttendanceStatusEnum {
    return this._value;
  }

  /**
   * Compara si dos estados son iguales
   * @param vo Estado a comparar
   * @returns true si los estados son iguales
   */
  equals(vo: ValueObject<AttendanceStatusEnum>): boolean {
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
  private isValid(status: AttendanceStatusEnum | string): boolean {
    return Object.values(AttendanceStatusEnum).includes(status as AttendanceStatusEnum);
  }

  /**
   * Verifica si la asistencia está registrada
   * @returns true si está registrada
   */
  isRegistered(): boolean {
    return this._value === AttendanceStatusEnum.REGISTERED;
  }

  /**
   * Verifica si la asistencia está confirmada
   * @returns true si está confirmada
   */
  isConfirmed(): boolean {
    return this._value === AttendanceStatusEnum.CONFIRMED;
  }

  /**
   * Verifica si la asistencia está en lista de espera
   * @returns true si está en lista de espera
   */
  isWaitlisted(): boolean {
    return this._value === AttendanceStatusEnum.WAITLISTED;
  }

  /**
   * Verifica si la asistencia está cancelada
   * @returns true si está cancelada
   */
  isCancelled(): boolean {
    return this._value === AttendanceStatusEnum.CANCELLED;
  }

  /**
   * Verifica si la asistencia está marcada como asistida
   * @returns true si está marcada como asistida
   */
  isAttended(): boolean {
    return this._value === AttendanceStatusEnum.ATTENDED;
  }

  /**
   * Verifica si la asistencia está marcada como no-show
   * @returns true si está marcada como no-show
   */
  isNoShow(): boolean {
    return this._value === AttendanceStatusEnum.NO_SHOW;
  }

  /**
   * Crea un estado REGISTERED
   * @returns Instancia de AttendanceStatus con valor REGISTERED
   */
  static registered(): AttendanceStatus {
    return new AttendanceStatus(AttendanceStatusEnum.REGISTERED);
  }

  /**
   * Crea un estado CONFIRMED
   * @returns Instancia de AttendanceStatus con valor CONFIRMED
   */
  static confirmed(): AttendanceStatus {
    return new AttendanceStatus(AttendanceStatusEnum.CONFIRMED);
  }

  /**
   * Crea un estado WAITLISTED
   * @returns Instancia de AttendanceStatus con valor WAITLISTED
   */
  static waitlisted(): AttendanceStatus {
    return new AttendanceStatus(AttendanceStatusEnum.WAITLISTED);
  }

  /**
   * Crea un estado CANCELLED
   * @returns Instancia de AttendanceStatus con valor CANCELLED
   */
  static cancelled(): AttendanceStatus {
    return new AttendanceStatus(AttendanceStatusEnum.CANCELLED);
  }

  /**
   * Crea un estado ATTENDED
   * @returns Instancia de AttendanceStatus con valor ATTENDED
   */
  static attended(): AttendanceStatus {
    return new AttendanceStatus(AttendanceStatusEnum.ATTENDED);
  }

  /**
   * Crea un estado NO_SHOW
   * @returns Instancia de AttendanceStatus con valor NO_SHOW
   */
  static noShow(): AttendanceStatus {
    return new AttendanceStatus(AttendanceStatusEnum.NO_SHOW);
  }
} 