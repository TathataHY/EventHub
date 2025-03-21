import { Organizer } from '@eventhub/domain/dist/organizers/entities/Organizer';
import { VerifyOrganizerDTO } from '../dtos/OrganizerDTO';
import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

export class VerifyOrganizerCommand implements Command<{ id: string; data: VerifyOrganizerDTO }, Organizer> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta el comando para verificar o desverificar un organizador
   */
  async execute({ id, data }: { id: string; data: VerifyOrganizerDTO }): Promise<Organizer> {
    const organizer = await this.organizerRepository.findById(id);
    if (!organizer) {
      throw new NotFoundException(`Organizador con ID ${id} no encontrado`);
    }

    await this.organizerRepository.verify(id, data.verified);

    // Actualizar la fecha de verificación si se está verificando
    if (data.verified) {
      organizer.verificationDate = new Date();
    } else {
      organizer.verificationDate = undefined;
    }

    organizer.verified = data.verified;
    return this.organizerRepository.save(organizer);
  }
} 