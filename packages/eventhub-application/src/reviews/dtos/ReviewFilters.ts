/**
 * Interfaz para definir los filtros disponibles al buscar reseñas
 */
export interface ReviewFilters {
  /** Filtrar por ID del evento */
  eventId?: string;
  
  /** Filtrar por ID del usuario */
  userId?: string;
  
  /** Filtrar por rango mínimo de puntuación */
  minScore?: number;
  
  /** Filtrar por rango máximo de puntuación */
  maxScore?: number;
  
  /** Filtrar solo reseñas activas/inactivas */
  isActive?: boolean;
  
  /** Filtrar solo reseñas verificadas/no verificadas */
  isVerified?: boolean;
  
  /** Filtrar por presencia de contenido textual */
  hasContent?: boolean;
  
  /** Filtrar por término de búsqueda en el contenido */
  searchTerm?: string;
  
  /** Filtrar por rango de fecha desde */
  fromDate?: Date;
  
  /** Filtrar por rango de fecha hasta */
  toDate?: Date;
} 