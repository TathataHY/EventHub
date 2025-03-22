import { Repository } from '../../core/interfaces/Repository';
import { MediaFile } from '../entities/MediaFile';

/**
 * Filtros para búsqueda de archivos multimedia
 */
export interface MediaFilters {
  /**
   * ID de la entidad relacionada
   */
  entityId?: string;
  
  /**
   * Tipo de entidad relacionada
   */
  entityType?: string;
  
  /**
   * Tipo de archivo
   */
  mimeType?: string;
  
  /**
   * Términos de búsqueda
   */
  query?: string;
}

/**
 * Opciones de paginación
 */
export interface PaginationOptions {
  /**
   * Número de página
   */
  page: number;
  
  /**
   * Elementos por página
   */
  limit: number;
  
  /**
   * Campo por el cual ordenar
   */
  orderBy?: string;
  
  /**
   * Dirección del ordenamiento
   */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Repositorio para gestionar archivos multimedia
 */
export interface MediaRepository extends Repository<string, MediaFile> {
  /**
   * Encuentra archivos multimedia con filtros y paginación
   */
  findAll(filters?: MediaFilters, pagination?: PaginationOptions): Promise<{
    items: MediaFile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  /**
   * Busca archivos multimedia por ID de entidad y tipo de entidad
   * @param entityId ID de la entidad relacionada
   * @param entityType Tipo de entidad relacionada (opcional)
   * @returns Lista de archivos multimedia
   */
  findByEntityId(entityId: string, entityType?: string): Promise<MediaFile[]>;

  /**
   * Busca archivos multimedia con paginación
   * @param page Número de página
   * @param limit Elementos por página
   * @param entityType Tipo de entidad (opcional)
   * @returns Resultado paginado
   */
  findWithPagination(page: number, limit: number, entityType?: string): Promise<{
    items: MediaFile[];
    total: number;
  }>;
  
  /**
   * Busca archivos multimedia por tipo MIME
   * @param mimeType Tipo MIME a buscar
   * @returns Lista de archivos multimedia
   */
  findByMimeType(mimeType: string): Promise<MediaFile[]>;
  
  /**
   * Busca los archivos multimedia más recientes
   * @param limit Cantidad máxima de archivos a retornar
   * @returns Lista de archivos multimedia
   */
  findLatest(limit: number): Promise<MediaFile[]>;

  /**
   * Elimina un archivo multimedia físicamente
   * @param id ID del archivo multimedia
   */
  deletePhysically(id: string): Promise<void>;
  
  /**
   * Elimina todos los archivos multimedia relacionados con una entidad
   * @param entityId ID de la entidad
   * @param entityType Tipo de entidad
   * @returns Cantidad de archivos eliminados
   */
  deleteByEntity(entityId: string, entityType: string): Promise<number>;
} 