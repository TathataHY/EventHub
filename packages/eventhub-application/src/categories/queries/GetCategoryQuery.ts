import { Category } from '@eventhub/domain/dist/categories/entities/Category';
import { CategoryDTO } from '../dtos/CategoryDTO';
import { CategoryMapper } from '../mappers/CategoryMapper';
import { CategoryRepository } from '@eventhub/domain/dist/categories/repositories/CategoryRepository';
import { Query } from '../../core/interfaces/Query';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Consulta para obtener una categoría por ID
 */
export class GetCategoryQuery implements Query<string, CategoryDTO> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Ejecuta la consulta para obtener una categoría
   * @param id ID de la categoría a obtener
   * @returns DTO de la categoría
   */
  async execute(id: string): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`No se encontró la categoría con ID ${id}`);
    }

    return CategoryMapper.toDTO(category);
  }
} 