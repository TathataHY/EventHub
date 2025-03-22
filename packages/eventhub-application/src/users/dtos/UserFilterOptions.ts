/**
 * Opciones de filtrado para consultas de usuarios
 */
export interface UserFilterOptions {
  /** Filtrar por nombre (búsqueda parcial) */
  name?: string;
  
  /** Filtrar por correo electrónico (búsqueda parcial) */
  email?: string;
  
  /** Filtrar por rol específico */
  role?: string;
  
  /** Filtrar por estado activo/inactivo */
  isActive?: boolean;
  
  /** Filtrar por fecha de creación (desde) */
  createdFrom?: Date;
  
  /** Filtrar por fecha de creación (hasta) */
  createdTo?: Date;
  
  /** Ordenar por campo */
  orderBy?: 'name' | 'email' | 'role' | 'createdAt' | 'updatedAt';
  
  /** Dirección de ordenamiento */
  orderDirection?: 'asc' | 'desc';
} 