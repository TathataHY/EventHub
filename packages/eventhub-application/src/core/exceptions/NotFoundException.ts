import { ApplicationException } from './ApplicationException';

/**
 * Excepción para recursos no encontrados
 */
export class NotFoundException extends ApplicationException {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` con ID ${id}` : ''} no encontrado`);
    this.name = 'NotFoundException';
  }
} 