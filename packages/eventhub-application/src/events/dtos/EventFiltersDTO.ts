/**
 * DTO para filtrar eventos en la aplicación
 */
export interface EventFiltersDTO {
  organizerId?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  query?: string;
  tags?: string[];
  page?: number;
  limit?: number;
} 