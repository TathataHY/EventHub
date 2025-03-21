import { UserDTO } from './UserDTO';

/**
 * Resultado paginado de la consulta de usuarios
 */
export interface PaginatedUsersResult {
  /** Lista de usuarios en la página actual */
  users: UserDTO[];
  
  /** Número total de usuarios que coinciden con los filtros */
  total: number;
  
  /** Número de página actual */
  page: number;
  
  /** Número de elementos por página */
  limit: number;
  
  /** Número total de páginas */
  totalPages: number;
  
  /** Indica si hay una página anterior */
  hasPreviousPage: boolean;
  
  /** Indica si hay una página siguiente */
  hasNextPage: boolean;
} 