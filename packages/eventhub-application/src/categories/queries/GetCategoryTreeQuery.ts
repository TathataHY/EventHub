import { Category } from '@eventhub/domain/dist/categories/entities/Category';
import { CategoryDTO } from '../dtos/CategoryDTO';
import { CategoryMapper } from '../mappers/CategoryMapper';
import { CategoryRepository } from '@eventhub/domain/dist/categories/repositories/CategoryRepository';
import { Query } from '../../core/interfaces/Query';

interface CategoryTreeDTO extends CategoryDTO {
  children: CategoryTreeDTO[];
}

/**
 * Consulta para obtener el árbol de categorías
 */
export class GetCategoryTreeQuery implements Query<void, CategoryTreeDTO[]> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Ejecuta la consulta para obtener el árbol de categorías
   * @returns Lista de DTOs de categorías organizadas en árbol
   */
  async execute(): Promise<CategoryTreeDTO[]> {
    const categories = await this.categoryRepository.getCategoryTree();
    return this.buildCategoryTree(categories);
  }

  /**
   * Construye el árbol de categorías
   * @param categories Lista de categorías
   * @returns Lista de categorías organizadas en árbol
   */
  private buildCategoryTree(categories: Category[]): CategoryTreeDTO[] {
    const categoryMap = new Map<string, CategoryTreeDTO>();
    const rootCategories: CategoryTreeDTO[] = [];

    // Primero, crear todos los DTOs
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...CategoryMapper.toDTO(category),
        children: []
      });
    });

    // Luego, organizar en árbol
    categories.forEach(category => {
      const categoryDTO = categoryMap.get(category.id)!;
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryDTO);
        }
      } else {
        rootCategories.push(categoryDTO);
      }
    });

    return rootCategories;
  }
} 