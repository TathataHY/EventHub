import { DomainException } from '../../core/exceptions/DomainException';

export class LocationUpdateException extends DomainException {
  constructor(message: string) {
    super(`Error al actualizar la ubicación: ${message}`);
    this.name = 'LocationUpdateException';
  }
} 