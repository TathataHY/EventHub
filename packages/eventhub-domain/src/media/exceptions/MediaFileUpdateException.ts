import { DomainException } from '../../core/exceptions/DomainException';

export class MediaFileUpdateException extends DomainException {
  constructor(message: string) {
    super(`Error al actualizar el archivo multimedia: ${message}`);
    this.name = 'MediaFileUpdateException';
  }
} 