import { DomainException } from '../../core/exceptions/DomainException';

export class LocationCreateException extends DomainException {
  constructor(message: string) {
    super(`Error al crear la ubicación: ${message}`);
    this.name = 'LocationCreateException';
  }
} 