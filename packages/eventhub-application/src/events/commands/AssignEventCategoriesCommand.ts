import { EventRepository } from '../repositories/EventRepository';
import { CategoryRepository } from '../../categories/repositories/CategoryRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException } from '../../core/exceptions';

/**
 * Comando para asignar categorías a un evento
 */
export class AssignEventCategoriesCommand implements Command<string[]> {
  constructor(
    private readonly eventId: string,
    private readonly categoryIds: string[],
    private readonly eventRepository: EventRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  /**
   * Ejecuta el comando para asignar categorías a un evento
   * @returns Promise<string[]> IDs de las categorías asignadas
   * @throws NotFoundException si el evento o alguna categoría no existe
   * @throws ValidationException si hay problemas de validación
   */
  async execute(): Promise<string[]> {
    // Validación de parámetros
    if (!this.eventId) {
      throw new ValidationException('ID de evento es requerido');
    }

    if (!this.categoryIds || this.categoryIds.length === 0) {
      throw new ValidationException('Se requiere al menos una categoría para asignar');
    }

    // Verificar que el evento existe
    const event = await this.eventRepository.findById(this.eventId);
    if (!event) {
      throw new NotFoundException('Evento', this.eventId);
    }

    // Verificar que todas las categorías existen
    const categoriesPromises = this.categoryIds.map(categoryId => 
      this.categoryRepository.findById(categoryId)
    );
    
    const categories = await Promise.all(categoriesPromises);
    
    // Comprobar si alguna categoría no existe
    const nonExistentCategories = categories
      .map((category, index) => category ? null : this.categoryIds[index])
      .filter(categoryId => categoryId !== null);
    
    if (nonExistentCategories.length > 0) {
      throw new NotFoundException(
        'Categorías', 
        nonExistentCategories.join(', ')
      );
    }

    // Asignar categorías al evento
    event.categoryIds = [...new Set(this.categoryIds)]; // Eliminar duplicados
    
    // Actualizar evento con las nuevas categorías
    await this.eventRepository.update(event);
    
    return event.categoryIds;
  }
} 