import { DomainException } from '../../core/exceptions/DomainException';

/**
 * Excepción lanzada cuando ocurre un error durante la creación de un evento
 * 
 * Esta excepción se utiliza para encapsular todos los errores que pueden ocurrir
 * durante el proceso de creación de un evento, como datos inválidos, fechas incorrectas,
 * o reglas de negocio no satisfechas.
 * 
 * @extends {DomainException} Hereda de la excepción base del dominio
 */
export class EventCreateException extends DomainException {
  /**
   * Constructor de EventCreateException
   * 
   * @param message Mensaje descriptivo del error ocurrido
   * @param code Código de error opcional (por defecto 'EVENT_CREATE_ERROR')
   * que permite identificar el tipo específico de error
   */
  constructor(message: string, code: string = 'EVENT_CREATE_ERROR') {
    super(message, code);
    this.name = 'EventCreateException';
  }
} 