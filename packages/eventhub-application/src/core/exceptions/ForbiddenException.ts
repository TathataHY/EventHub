import { DomainException } from './DomainException';

/**
 * Excepción para acceso prohibido
 */
export class ForbiddenException extends DomainException {
  constructor(message: string = 'Acceso prohibido a este recurso') {
    super(message);
    this.name = 'ForbiddenException';
  }
} 