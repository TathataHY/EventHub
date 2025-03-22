import { Category } from '@eventhub/domain/dist/categories/entities/Category';
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryDTO } from '../dtos/CategoryDTO';
import { CreateCategoryCommand } from '../commands/CreateCategoryCommand';
import { UpdateCategoryCommand } from '../commands/UpdateCategoryCommand';
import { DeleteCategoryCommand } from '../commands/DeleteCategoryCommand';
import { GetCategoryQuery } from '../queries/GetCategoryQuery';
import { GetCategoryTreeQuery } from '../queries/GetCategoryTreeQuery';
import { GetPopularCategoriesQuery } from '../queries/GetPopularCategoriesQuery';
import { CategoryRepository } from '@eventhub/domain/dist/categories/repositories/CategoryRepository';
import { CategoryMapper } from '../mappers/CategoryMapper';

interface CategoryTreeDTO extends CategoryDTO {
  children: CategoryTreeDTO[];
}

interface PopularCategoryDTO extends CategoryDTO {
  eventCount: number;
}

/**
 * Servicio para gestionar categorías
 */
export class CategoryService {
  private readonly createCategoryCommand: CreateCategoryCommand;
  private readonly updateCategoryCommand: UpdateCategoryCommand;
  private readonly deleteCategoryCommand: DeleteCategoryCommand;
  private readonly getCategoryQuery: GetCategoryQuery;
  private readonly getCategoryTreeQuery: GetCategoryTreeQuery;
  private readonly getPopularCategoriesQuery: GetPopularCategoriesQuery;

  constructor(private readonly categoryRepository: CategoryRepository) {
    this.createCategoryCommand = new CreateCategoryCommand(categoryRepository);
    this.updateCategoryCommand = new UpdateCategoryCommand(categoryRepository);
    this.deleteCategoryCommand = new DeleteCategoryCommand(categoryRepository);
    this.getCategoryQuery = new GetCategoryQuery(categoryRepository);
    this.getCategoryTreeQuery = new GetCategoryTreeQuery(categoryRepository);
    this.getPopularCategoriesQuery = new GetPopularCategoriesQuery(categoryRepository);
  }

  /**
   * Crea una nueva categoría
   * @param categoryData Datos de la categoría a crear
   * @returns DTO de la categoría creada
   */
  async createCategory(categoryData: CreateCategoryDTO): Promise<CategoryDTO> {
    const category = await this.createCategoryCommand.execute(categoryData);
    return CategoryMapper.toDTO(category);
  }

  /**
   * Actualiza una categoría existente
   * @param id ID de la categoría a actualizar
   * @param updateData Datos a actualizar
   * @returns DTO de la categoría actualizada
   */
  async updateCategory(id: string, updateData: UpdateCategoryDTO): Promise<CategoryDTO> {
    const category = await this.updateCategoryCommand.execute({ id, data: updateData });
    return CategoryMapper.toDTO(category);
  }

  /**
   * Elimina una categoría
   * @param id ID de la categoría a eliminar
   */
  async deleteCategory(id: string): Promise<void> {
    await this.deleteCategoryCommand.execute(id);
  }

  /**
   * Obtiene una categoría por ID
   * @param id ID de la categoría a obtener
   * @returns DTO de la categoría
   */
  async getCategory(id: string): Promise<CategoryDTO> {
    return this.getCategoryQuery.execute(id);
  }

  /**
   * Obtiene el árbol de categorías
   * @returns Lista de DTOs de categorías organizadas en árbol
   */
  async getCategoryTree(): Promise<CategoryTreeDTO[]> {
    return this.getCategoryTreeQuery.execute();
  }

  /**
   * Obtiene las categorías más populares
   * @param limit Límite de categorías a retornar
   * @returns Lista de DTOs de categorías populares
   */
  async getPopularCategories(limit: number): Promise<PopularCategoryDTO[]> {
    return this.getPopularCategoriesQuery.execute(limit);
  }
} 