import { OrganizerDTO } from '../dtos/OrganizerDTO';
import { OrganizerMapper } from '../mappers/OrganizerMapper';
import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Query } from '../../core/interfaces/Query';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

export class GetOrganizerByUserIdQuery implements Query<string, OrganizerDTO> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta la consulta para obtener un organizador por ID de usuario
   */
  async execute(userId: string): Promise<OrganizerDTO> {
    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    const organizer = await this.organizerRepository.findByUserId(userId);
    if (!organizer) {
      throw new NotFoundException(`No se encontró un organizador para el usuario con ID ${userId}`);
    }

    return OrganizerMapper.toDTO(organizer);
  }
} 