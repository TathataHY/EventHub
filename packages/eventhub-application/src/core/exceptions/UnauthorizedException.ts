import { DomainException } from './DomainException';

/**
 * Excepción para acciones no autorizadas
 */
export class UnauthorizedException extends DomainException {
  constructor(message: string = 'No autorizado para realizar esta acción') {
    super(message);
    this.name = 'UnauthorizedException';
  }
} 