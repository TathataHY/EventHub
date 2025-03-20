import { DomainException } from '../../core/exceptions/DomainException';

export class MediaFileCreateException extends DomainException {
  constructor(message: string) {
    super(`Error al crear el archivo multimedia: ${message}`);
    this.name = 'MediaFileCreateException';
  }
} 