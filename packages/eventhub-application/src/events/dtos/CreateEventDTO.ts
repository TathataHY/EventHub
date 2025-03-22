/**
 * DTO para crear un evento nuevo
 */
export interface CreateEventDTO {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organizerId?: string;
  capacity?: number;
  tags?: string[];
} 