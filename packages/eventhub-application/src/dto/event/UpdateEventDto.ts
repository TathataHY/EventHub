/**
 * DTO para la actualización de eventos
 */
export interface UpdateEventDto {
  title?: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  location?: string;
  capacity?: number;
  tags?: string[];
} 