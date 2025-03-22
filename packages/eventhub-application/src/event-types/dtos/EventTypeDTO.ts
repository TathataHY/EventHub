/**
 * DTO para representar un tipo de evento
 */
export interface EventTypeDTO {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  colorHex?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear un tipo de evento
 */
export interface CreateEventTypeDTO {
  name: string;
  description: string;
  iconUrl?: string;
  colorHex?: string;
}

/**
 * DTO para actualizar un tipo de evento
 */
export interface UpdateEventTypeDTO {
  name?: string;
  description?: string;
  iconUrl?: string;
  colorHex?: string;
  isActive?: boolean;
}

/**
 * DTO para la respuesta de búsqueda de tipos de eventos
 */
export interface EventTypeSearchResultDTO {
  eventTypes: EventTypeDTO[];
  total: number;
  page: number;
  limit: number;
} 