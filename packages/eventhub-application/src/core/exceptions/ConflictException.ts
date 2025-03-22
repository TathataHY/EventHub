import { DomainException } from './DomainException';

/**
 * Excepción para conflictos (recursos duplicados)
 */
export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictException';
  }
} 