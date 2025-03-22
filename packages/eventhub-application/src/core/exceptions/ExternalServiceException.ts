import { DomainException } from './DomainException';

/**
 * Excepción para errores de servicio externos
 */
export class ExternalServiceException extends DomainException {
  constructor(service: string, details?: string) {
    super(`Error en servicio externo ${service}${details ? `: ${details}` : ''}`);
    this.name = 'ExternalServiceException';
  }
} 