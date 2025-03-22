import { OrganizerDTO } from '../dtos/OrganizerDTO';
import { OrganizerMapper } from '../mappers/OrganizerMapper';
import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Query } from '../../core/interfaces/Query';

export class GetVerifiedOrganizersQuery implements Query<void, OrganizerDTO[]> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta la consulta para obtener organizadores verificados
   */
  async execute(): Promise<OrganizerDTO[]> {
    const organizers = await this.organizerRepository.findVerified();
    return OrganizerMapper.toDTOList(organizers);
  }
} 