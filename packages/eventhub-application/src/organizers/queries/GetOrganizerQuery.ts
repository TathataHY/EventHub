import { OrganizerDTO } from '../dtos/OrganizerDTO';
import { OrganizerMapper } from '../mappers/OrganizerMapper';
import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Query } from '../../core/interfaces/Query';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

export class GetOrganizerQuery implements Query<string, OrganizerDTO> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta la consulta para obtener un organizador por ID
   */
  async execute(id: string): Promise<OrganizerDTO> {
    const organizer = await this.organizerRepository.findById(id);
    if (!organizer) {
      throw new NotFoundException(`Organizador con ID ${id} no encontrado`);
    }

    return OrganizerMapper.toDTO(organizer);
  }
} 