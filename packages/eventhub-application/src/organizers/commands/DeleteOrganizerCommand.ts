import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { BusinessRuleException } from '../../core/exceptions/BusinessRuleException';

export class DeleteOrganizerCommand implements Command<string, void> {
  constructor(
    private readonly organizerRepository: OrganizerRepository,
    private readonly eventRepository?: any // EventRepository
  ) {}

  /**
   * Ejecuta el comando para eliminar un organizador
   */
  async execute(id: string): Promise<void> {
    const organizer = await this.organizerRepository.findById(id);
    if (!organizer) {
      throw new NotFoundException(`Organizador con ID ${id} no encontrado`);
    }

    // Verificar si el organizador tiene eventos asociados
    if (this.eventRepository && organizer.eventCount > 0) {
      const events = await this.eventRepository.findByOrganizerId(id);
      if (events.length > 0) {
        throw new BusinessRuleException(
          `No se puede eliminar el organizador porque tiene ${events.length} eventos asociados`
        );
      }
    }

    await this.organizerRepository.delete(id);
  }
} 