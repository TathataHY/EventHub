import { DomainException } from '../../core/exceptions/DomainException';

export class CategoryUpdateException extends DomainException {
  constructor(message: string) {
    super(`Error al actualizar la categoría: ${message}`);
    this.name = 'CategoryUpdateException';
  }
} 