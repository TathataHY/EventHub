/**
 * Opciones de paginación para consultas
 */
export interface PaginationOptions {
  /** Número de página (empezando desde 1) */
  page: number;
  
  /** Número de elementos por página */
  limit: number;
}
