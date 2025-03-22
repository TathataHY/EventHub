import { Organizer } from '@eventhub/domain/dist/organizers/entities/Organizer';
import { OrganizerRepository } from '@eventhub/domain/dist/organizers/repositories/OrganizerRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

interface UpdateRatingParams {
  id: string;
  rating: number;
}

export class UpdateOrganizerRatingCommand implements Command<UpdateRatingParams, Organizer> {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  /**
   * Ejecuta el comando para actualizar la calificación de un organizador
   */
  async execute({ id, rating }: UpdateRatingParams): Promise<Organizer> {
    const organizer = await this.organizerRepository.findById(id);
    if (!organizer) {
      throw new NotFoundException(`Organizador con ID ${id} no encontrado`);
    }

    this.validateRating(rating);
    await this.organizerRepository.updateRating(id, rating);
    
    organizer.rating = rating;
    return organizer;
  }

  /**
   * Valida que la calificación esté dentro del rango permitido
   */
  private validateRating(rating: number): void {
    if (rating < 0 || rating > 5) {
      throw new Error('La calificación debe estar entre 0 y 5');
    }
  }
} 