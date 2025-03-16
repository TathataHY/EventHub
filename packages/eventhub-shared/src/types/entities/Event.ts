export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  startDate: Date;
  endDate: Date;
  image?: string;
  capacity?: number;
  status: EventStatus;
  isFree: boolean;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
  organizerId: number;
  categoryId?: number;
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
} 