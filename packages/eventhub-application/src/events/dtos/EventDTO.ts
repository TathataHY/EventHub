/**
 * DTO para representar un evento en la aplicación
 */
export interface EventDTO {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organizerId: string;
  capacity: number | null;
  attendees: string[];
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
} 