import { DomainException } from '../../core/exceptions/DomainException';

export class EventTypeCreateException extends DomainException {
  constructor(message: string) {
    super(`Error al crear el tipo de evento: ${message}`);
    this.name = 'EventTypeCreateException';
  }
} 