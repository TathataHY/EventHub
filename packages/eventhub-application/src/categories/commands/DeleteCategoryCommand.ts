import { Category } from '@eventhub/domain/dist/categories/entities/Category';
import { CategoryRepository } from '@eventhub/domain/dist/categories/repositories/CategoryRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Comando para eliminar una categoría
 */
export class DeleteCategoryCommand implements Command<string, void> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Ejecuta el comando para eliminar una categoría
   * @param id ID de la categoría a eliminar
   */
  async execute(id: string): Promise<void> {
    // Verificar que la categoría existe
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException(`No se encontró la categoría con ID ${id}`);
    }

    // Verificar que no tiene categorías hijas
    const childCategories = await this.categoryRepository.findByParentId(id);
    if (childCategories.length > 0) {
      throw new Error('No se puede eliminar una categoría que tiene subcategorías');
    }

    // Eliminar categoría
    await this.categoryRepository.delete(id);
  }
} 