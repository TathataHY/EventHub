import { DomainException } from './DomainException';

/**
 * Excepción para errores de validación
 */
export class ValidationException extends DomainException {
  constructor(
    message: string,
    public readonly errors: Record<string, string[]> = {}
  ) {
    super(message);
    this.name = 'ValidationException';
  }
} 