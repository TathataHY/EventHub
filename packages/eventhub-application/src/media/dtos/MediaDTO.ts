/**
 * DTO para representar un archivo multimedia
 */
export interface MediaDTO {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  entityId?: string;
  entityType?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear un archivo multimedia
 */
export interface CreateMediaDTO {
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  entityId?: string;
  entityType?: string;
}

/**
 * DTO para actualizar un archivo multimedia
 */
export interface UpdateMediaDTO {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  url?: string;
  thumbnailUrl?: string;
  entityId?: string;
  entityType?: string;
}

/**
 * DTO para la respuesta de búsqueda de archivos multimedia
 */
export interface MediaSearchResultDTO {
  items: MediaDTO[];
  total: number;
  page: number;
  limit: number;
} 