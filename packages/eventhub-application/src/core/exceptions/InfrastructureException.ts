import { DomainException } from './DomainException';

/**
 * Excepción para errores de infraestructura
 */
export class InfrastructureException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InfrastructureException';
  }
} 