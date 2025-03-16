/**
 * DTO para la representación de eventos
 */
export interface EventDto {
  id: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  location: string;
  organizerId: string;
  capacity: number;
  attendees: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
} 