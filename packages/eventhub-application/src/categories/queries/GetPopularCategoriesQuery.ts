import { CategoryDTO } from '../dtos/CategoryDTO';
import { CategoryMapper } from '../mappers/CategoryMapper';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { Query } from '../../core/interfaces/Query';

interface PopularCategoryDTO extends CategoryDTO {
  eventCount: number;
}

/**
 * Consulta para obtener las categorías más populares
 */
export class GetPopularCategoriesQuery implements Query<number, PopularCategoryDTO[]> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Ejecuta la consulta para obtener las categorías más populares
   * @param limit Límite de categorías a retornar
   * @returns Lista de DTOs de categorías populares
   */
  async execute(limit: number): Promise<PopularCategoryDTO[]> {
    const popularCategories = await this.categoryRepository.getPopularCategories(limit);
    return popularCategories.map(category => ({
      ...CategoryMapper.toDTO(category),
      eventCount: category.eventCount
    }));
  }
} 