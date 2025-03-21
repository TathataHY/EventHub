/**
 * DTO para representar una ubicación
 */
export interface LocationDTO {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear una nueva ubicación
 */
export interface CreateLocationDTO {
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  description?: string;
}

/**
 * DTO para actualizar una ubicación existente
 */
export interface UpdateLocationDTO {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  description?: string;
} 