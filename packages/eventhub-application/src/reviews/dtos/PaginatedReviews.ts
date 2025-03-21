import { ReviewDTO } from './ReviewDTO';

/**
 * Interfaz para el resultado paginado de reseñas
 */
export interface PaginatedReviews {
  /** Lista de reseñas para la página actual */
  items: ReviewDTO[];
  
  /** Número total de reseñas que coinciden con los filtros */
  total: number;
  
  /** Número de página actual (comienza en 1) */
  page: number;
  
  /** Tamaño de página (cantidad de elementos por página) */
  limit: number;
  
  /** Número total de páginas disponibles */
  totalPages: number;
} 