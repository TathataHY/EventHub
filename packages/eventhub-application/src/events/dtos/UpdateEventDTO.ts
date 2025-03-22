/**
 * DTO para actualizar un evento existente
 */
export interface UpdateEventDTO {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  capacity?: number;
  tags?: string[];
  isActive?: boolean;
} 