import { Location } from 'eventhub-domain';
import { LocationRepository } from '../repositories/LocationRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Comando para eliminar una ubicación
 */
export class DeleteLocationCommand implements Command<string, void> {
  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly eventRepository?: any // Esto debería ser EventRepository, pero lo definimos como any para evitar dependencias circulares
  ) {}

  /**
   * Ejecuta el comando para eliminar una ubicación
   * @param id ID de la ubicación a eliminar
   */
  async execute(id: string): Promise<void> {
    // Verificar que la ubicación existe
    const existingLocation = await this.locationRepository.findById(id);
    if (!existingLocation) {
      throw new NotFoundException(`No se encontró la ubicación con ID ${id}`);
    }

    // Verificar que no hay eventos asociados a esta ubicación
    if (this.eventRepository) {
      const relatedEvents = await this.eventRepository.findByLocationId(id);
      if (relatedEvents.length > 0) {
        throw new Error('No se puede eliminar una ubicación que tiene eventos asociados');
      }
    }

    // Eliminar ubicación
    await this.locationRepository.delete(id);
  }
} 