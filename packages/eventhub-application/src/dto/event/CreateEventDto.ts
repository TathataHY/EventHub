/**
 * DTO para la creación de eventos
 */
export interface CreateEventDto {
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  location: string;
  organizerId: string;
  capacity: number;
  tags?: string[];
} 