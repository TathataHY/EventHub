import { Repository } from '../../core/interfaces/Repository';
import { Category } from '../entities/Category';

/**
 * Filtros para búsqueda de categorías
 */
export interface CategoryFilters {
  /** Filtrar por nombre */
  name?: string;
  /** Filtrar por estado activo/inactivo */
  isActive?: boolean;
  /** Filtrar por categoría padre */
  parentId?: string;
  /** Término de búsqueda general */
  query?: string;
}

/**
 * Opciones de paginación para resultados
 */
export interface PaginationOptions {
  /** Número de página (comienza en 1) */
  page: number;
  /** Elementos por página */
  limit: number;
  /** Campo por el cual ordenar */
  orderBy?: string;
  /** Dirección del ordenamiento */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Repositorio para gestionar categorías
 */
export interface CategoryRepository extends Repository<string, Category> {
  /**
   * Encuentra categorías con filtros y paginación
   * @param filters Filtros opcionales
   * @param pagination Opciones de paginación
   * @returns Categorías paginadas con metadatos
   */
  findAll(filters?: CategoryFilters, pagination?: PaginationOptions): Promise<{
    categories: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  /**
   * Busca categorías por nombre
   * @param name Nombre a buscar
   * @returns Lista de categorías que coinciden
   */
  findByName(name: string): Promise<Category[]>;
  
  /**
   * Busca una categoría por su slug
   * @param slug Slug a buscar
   * @returns Categoría encontrada o null
   */
  findBySlug(slug: string): Promise<Category | null>;
  
  /**
   * Busca categorías hijas de una categoría padre
   * @param parentId ID de la categoría padre
   * @returns Lista de categorías hijas
   */
  findByParentId(parentId: string): Promise<Category[]>;
  
  /**
   * Encuentra las categorías de nivel superior (sin padre)
   * @returns Lista de categorías raíz
   */
  findRootCategories(): Promise<Category[]>;
  
  /**
   * Encuentra todas las categorías activas
   * @returns Lista de categorías activas
   */
  findActiveCategories(): Promise<Category[]>;
  
  /**
   * Encuentra todas las categorías inactivas
   * @returns Lista de categorías inactivas
   */
  findInactiveCategories(): Promise<Category[]>;
  
  /**
   * Busca categorías por texto en nombre o descripción
   * @param query Texto a buscar
   * @returns Lista de categorías que coinciden
   */
  searchByText(query: string): Promise<Category[]>;
} 