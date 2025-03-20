import { DomainException } from '../../core/exceptions/DomainException';

export class EventTypeUpdateException extends DomainException {
  constructor(message: string) {
    super(`Error al actualizar el tipo de evento: ${message}`);
    this.name = 'EventTypeUpdateException';
  }
} 