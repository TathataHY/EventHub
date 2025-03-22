import { OrganizerDTO } from '../dtos/OrganizerDTO';
import { OrganizerMapper } from '../mappers/OrganizerMapper';
import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Query } from '../../core/interfaces/Query';

export class GetTopRatedOrganizersQuery implements Query<number, OrganizerDTO[]> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta la consulta para obtener los organizadores mejor valorados
   */
  async execute(limit: number): Promise<OrganizerDTO[]> {
    if (limit <= 0) {
      throw new Error('El límite debe ser mayor a 0');
    }

    const organizers = await this.organizerRepository.findTopRated(limit);
    return OrganizerMapper.toDTOList(organizers);
  }
} 