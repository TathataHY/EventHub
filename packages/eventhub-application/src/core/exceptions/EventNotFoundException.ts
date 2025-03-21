import { NotFoundException } from './NotFoundException';

/**
 * Excepción específica para eventos no encontrados
 */
export class EventNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super('Evento', id);
    this.name = 'EventNotFoundException';
  }
} 