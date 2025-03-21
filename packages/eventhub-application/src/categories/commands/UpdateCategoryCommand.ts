import { Category } from '@eventhub/domain/dist/categories/entities/Category';
import { UpdateCategoryDTO } from '../dtos/CategoryDTO';
import { CategoryMapper } from '../mappers/CategoryMapper';
import { CategoryRepository } from '@eventhub/domain/dist/categories/repositories/CategoryRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Comando para actualizar una categoría existente
 */
export class UpdateCategoryCommand implements Command<{ id: string; data: UpdateCategoryDTO }, Category> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Ejecuta el comando para actualizar una categoría
   * @param params Parámetros con ID de la categoría y datos a actualizar
   * @returns Categoría actualizada
   */
  async execute({ id, data }: { id: string; data: UpdateCategoryDTO }): Promise<Category> {
    // Buscar categoría existente
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException(`No se encontró la categoría con ID ${id}`);
    }

    // Validar datos de actualización
    this.validateUpdateData(data);

    // Actualizar categoría
    const updatedCategory = existingCategory.update(data);

    // Guardar cambios
    await this.categoryRepository.save(updatedCategory);

    return updatedCategory;
  }

  /**
   * Valida los datos de actualización de la categoría
   * @param updateData Datos a actualizar
   * @throws Error si los datos son inválidos
   */
  private validateUpdateData(updateData: UpdateCategoryDTO): void {
    if (updateData.name && updateData.name.length < 3) {
      throw new Error('El nombre de la categoría debe tener al menos 3 caracteres');
    }

    if (updateData.parentId) {
      // Verificar que la categoría padre existe
      this.categoryRepository.findById(updateData.parentId)
        .then(parent => {
          if (!parent) {
            throw new Error('La categoría padre no existe');
          }
        });
    }
  }
} 