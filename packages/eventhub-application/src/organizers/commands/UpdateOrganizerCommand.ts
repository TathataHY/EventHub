import { Organizer } from '@eventhub/domain/dist/organizers/entities/Organizer';
import { UpdateOrganizerDTO } from '../dtos/OrganizerDTO';
import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Command } from '../../core/interfaces/Command';
import { OrganizerMapper } from '../mappers/OrganizerMapper';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

export class UpdateOrganizerCommand implements Command<{ id: string; data: UpdateOrganizerDTO }, Organizer> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta el comando para actualizar un organizador existente
   */
  async execute({ id, data }: { id: string; data: UpdateOrganizerDTO }): Promise<Organizer> {
    const organizer = await this.organizerRepository.findById(id);
    if (!organizer) {
      throw new NotFoundException(`Organizador con ID ${id} no encontrado`);
    }

    await this.validateUpdateData(data);

    const update = OrganizerMapper.toPartialDomain(data);
    Object.assign(organizer, update);

    return this.organizerRepository.save(organizer);
  }

  /**
   * Valida los datos de actualización
   */
  private async validateUpdateData(data: UpdateOrganizerDTO): Promise<void> {
    if (data.name !== undefined && data.name.length > 100) {
      throw new Error('El nombre no puede exceder los 100 caracteres');
    }

    if (data.description !== undefined && data.description.length > 1000) {
      throw new Error('La descripción no puede exceder los 1000 caracteres');
    }

    if (data.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('El formato del email no es válido');
      }
    }

    // Validar URL del sitio web si está presente
    if (data.website) {
      try {
        new URL(data.website);
      } catch (error) {
        throw new Error('La URL del sitio web no es válida');
      }
    }

    // Validar URL del logo si está presente
    if (data.logoUrl) {
      try {
        new URL(data.logoUrl);
      } catch (error) {
        throw new Error('La URL del logo no es válida');
      }
    }
  }
} 