import { Query } from '../../core/interfaces/Query';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { PaginationOptions } from '../../core/interfaces/PaginationOptions';

/**
 * Interfaz para los parámetros de filtrado
 */
export interface CategoryFilters {
  parentId?: string;
  searchTerm?: string;
  includeEmpty?: boolean;
}

/**
 * Representa una categoría con la cantidad de eventos asociados
 */
export interface CategoryWithCount {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  eventCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interfaz para el resultado paginado
 */
export interface PaginatedCategories {
  items: CategoryWithCount[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Consulta para obtener categorías con opciones de filtrado y paginación
 */
export class GetCategoriesQuery implements Query<PaginatedCategories> {
  private filters: CategoryFilters;
  private pagination: PaginationOptions;

  constructor(
    filters: CategoryFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 10 },
    private readonly categoryRepository: CategoryRepository
  ) {
    this.filters = filters;
    this.pagination = {
      page: pagination.page || 1,
      limit: pagination.limit || 10
    };
  }

  /**
   * Ejecuta la consulta para obtener categorías
   * @returns Promise<PaginatedCategories> Lista paginada de categorías
   */
  async execute(): Promise<PaginatedCategories> {
    // Asegurar que los valores de paginación sean válidos
    const page = Math.max(1, this.pagination.page);
    const limit = Math.min(50, Math.max(1, this.pagination.limit)); // Limitar entre 1 y 50
    
    // Obtener categorías con conteo
    const result = await this.categoryRepository.findWithFilters(
      this.filters,
      { page, limit }
    );

    // Calcular total de páginas
    const totalPages = Math.ceil(result.total / limit);

    return {
      items: result.items,
      total: result.total,
      page,
      limit,
      totalPages
    };
  }
} 