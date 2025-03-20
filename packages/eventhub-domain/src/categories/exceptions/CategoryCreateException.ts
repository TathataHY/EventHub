import { DomainException } from '../../core/exceptions/DomainException';

export class CategoryCreateException extends DomainException {
  constructor(message: string) {
    super(`Error al crear la categoría: ${message}`);
    this.name = 'CategoryCreateException';
  }
} 