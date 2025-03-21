import { OrganizerDTO } from '../dtos/OrganizerDTO';
import { OrganizerMapper } from '../mappers/OrganizerMapper';
import { OrganizerRepository } from '@eventhub/domain/src/organizers/repositories/OrganizerRepository';
import { Query } from '../../core/interfaces/Query';

export class GetMostActiveOrganizersQuery implements Query<number, OrganizerDTO[]> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta la consulta para obtener los organizadores más activos
   */
  async execute(limit: number): Promise<OrganizerDTO[]> {
    if (limit <= 0) {
      throw new Error('El límite debe ser mayor a 0');
    }

    const organizers = await this.organizerRepository.findMostActive(limit);
    return OrganizerMapper.toDTOList(organizers);
  }
} 