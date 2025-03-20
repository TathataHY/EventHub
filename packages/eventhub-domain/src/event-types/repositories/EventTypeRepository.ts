import { Repository } from '../../core/interfaces/Repository';
import { EventType } from '../entities/EventType';

export interface EventTypeFilters {
  name?: string;
  isActive?: boolean;
  query?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface EventTypeRepository extends Repository<string, EventType> {
  findAll(filters?: EventTypeFilters, pagination?: PaginationOptions): Promise<{
    eventTypes: EventType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  findByName(name: string): Promise<EventType[]>;
  
  findActiveEventTypes(): Promise<EventType[]>;
  
  findInactiveEventTypes(): Promise<EventType[]>;
  
  searchByText(query: string): Promise<EventType[]>;
} 