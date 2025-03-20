import { Repository } from '../../core/interfaces/Repository';
import { NotificationTemplate } from '../value-objects/NotificationTemplate';
import { NotificationChannel } from '../value-objects/NotificationChannel';
import { NotificationType } from '../../../notifications/value-objects/NotificationType';

/**
 * Opciones para filtrar plantillas de notificación
 */
export interface NotificationTemplateFilters {
  /**
   * Tipo de notificación
   */
  notificationType?: NotificationType;

  /**
   * Canal de notificación
   */
  channel?: NotificationChannel;

  /**
   * Solo plantillas activas
   */
  isActive?: boolean;

  /**
   * Término de búsqueda para nombre o descripción
   */
  query?: string;
}

/**
 * Opciones de paginación y ordenamiento
 */
export interface PaginationOptions {
  /**
   * Número de página (comienza en 1)
   */
  page: number;

  /**
   * Cantidad de elementos por página
   */
  limit: number;

  /**
   * Campo por el cual ordenar
   */
  orderBy?: 'name' | 'createdAt';

  /**
   * Dirección del ordenamiento
   */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Interfaz del repositorio de plantillas de notificación
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para plantillas de notificación
 */
export interface NotificationTemplateRepository extends Repository<NotificationTemplate, string> {
  /**
   * Encuentra plantillas con filtros y paginación
   * @param filters Filtros para la búsqueda
   * @param options Opciones de paginación
   * @returns Lista de plantillas y total
   */
  findWithFilters(
    filters: NotificationTemplateFilters,
    options?: PaginationOptions
  ): Promise<{ templates: NotificationTemplate[]; total: number }>;

  /**
   * Busca plantillas por tipo de notificación
   * @param type Tipo de notificación
   * @returns Lista de plantillas del tipo especificado
   */
  findByType(type: NotificationType): Promise<NotificationTemplate[]>;

  /**
   * Busca plantillas por canal de notificación
   * @param channel Canal de notificación
   * @returns Lista de plantillas del canal especificado
   */
  findByChannel(channel: NotificationChannel): Promise<NotificationTemplate[]>;

  /**
   * Busca la plantilla activa para un tipo y canal específicos
   * @param type Tipo de notificación
   * @param channel Canal de notificación
   * @returns Plantilla activa o null si no existe
   */
  findActiveTemplateForTypeAndChannel(
    type: NotificationType,
    channel: NotificationChannel
  ): Promise<NotificationTemplate | null>;

  /**
   * Activa una plantilla
   * @param id ID de la plantilla
   * @returns Plantilla activada o null si no existe
   */
  activate(id: string): Promise<NotificationTemplate | null>;

  /**
   * Desactiva una plantilla
   * @param id ID de la plantilla
   * @returns Plantilla desactivada o null si no existe
   */
  deactivate(id: string): Promise<NotificationTemplate | null>;

  /**
   * Busca plantillas por término de búsqueda en nombre o descripción
   * @param query Término de búsqueda
   * @returns Lista de plantillas que coinciden con el término
   */
  searchByNameOrDescription(query: string): Promise<NotificationTemplate[]>;
} 