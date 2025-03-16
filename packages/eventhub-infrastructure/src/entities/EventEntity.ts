/**
 * Entidad ORM para eventos
 * Representa la estructura de la tabla de eventos en la base de datos
 */
export class EventEntity {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organizerId: string;
  capacity: number;
  attendees: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    organizerId: string;
    capacity: number;
    attendees: number;
    isActive: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.location = params.location;
    this.organizerId = params.organizerId;
    this.capacity = params.capacity;
    this.attendees = params.attendees;
    this.isActive = params.isActive;
    this.tags = params.tags;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
} 