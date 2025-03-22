import { OrganizerDTO } from '../dtos/OrganizerDTO';
import { OrganizerMapper } from '../mappers/OrganizerMapper';
import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Query } from '../../core/interfaces/Query';

export class GetOrganizersByNameQuery implements Query<string, OrganizerDTO[]> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta la consulta para obtener organizadores por nombre
   */
  async execute(name: string): Promise<OrganizerDTO[]> {
    if (!name) {
      throw new Error('El nombre es requerido');
    }

    const organizers = await this.organizerRepository.findByName(name);
    return OrganizerMapper.toDTOList(organizers);
  }
} 