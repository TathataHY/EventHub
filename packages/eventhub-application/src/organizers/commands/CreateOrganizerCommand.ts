import { Organizer } from '@eventhub/domain/dist/organizers/entities/Organizer';
import { CreateOrganizerDTO } from '../dtos/OrganizerDTO';
import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Command } from '../../core/interfaces/Command';
import { OrganizerMapper } from '../mappers/OrganizerMapper';
import { BusinessRuleException } from '../../core/exceptions/BusinessRuleException';

export class CreateOrganizerCommand implements Command<CreateOrganizerDTO, Organizer> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta el comando para crear un nuevo organizador
   */
  async execute(organizerData: CreateOrganizerDTO): Promise<Organizer> {
    await this.validateOrganizerData(organizerData);

    const organizer = OrganizerMapper.toDomain(organizerData);
    return this.organizerRepository.save(organizer);
  }

  /**
   * Valida los datos del organizador
   */
  private async validateOrganizerData(data: CreateOrganizerDTO): Promise<void> {
    if (!data.userId) {
      throw new Error('El ID del usuario es requerido');
    }

    if (!data.name) {
      throw new Error('El nombre es requerido');
    }

    if (!data.description) {
      throw new Error('La descripción es requerida');
    }

    if (!data.email) {
      throw new Error('El email es requerido');
    }

    if (data.name.length > 100) {
      throw new Error('El nombre no puede exceder los 100 caracteres');
    }

    if (data.description.length > 1000) {
      throw new Error('La descripción no puede exceder los 1000 caracteres');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('El formato del email no es válido');
    }

    // Validar que no exista un organizador con el mismo userId
    const existingOrganizer = await this.organizerRepository.findByUserId(data.userId);
    if (existingOrganizer) {
      throw new BusinessRuleException('Ya existe un organizador asociado a este usuario');
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