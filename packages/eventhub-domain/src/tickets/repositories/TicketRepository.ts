import { Repository } from '../../core/interfaces/Repository';
import { Ticket } from '../entities/Ticket';
import { TicketType } from '../value-objects/TicketType';
import { TicketStatus } from '../value-objects/TicketStatus';
import { Event } from '../../events/entities/Event';
import { User } from '../../users/entities/User';

/**
 * Opciones de filtrado para búsqueda de tickets
 * 
 * Define los criterios que pueden utilizarse para filtrar tickets
 * en las operaciones de búsqueda del repositorio. Permite combinar
 * múltiples filtros para consultas precisas.
 */
export interface TicketFilterOptions {
  /** ID del evento asociado para filtrar tickets de un evento específico */
  eventId?: string;
  
  /** ID del usuario que compró los tickets, para encontrar compras de un cliente */
  userId?: string;
  
  /** Tipo de ticket para filtrar (ejemplo: GENERAL, VIP) */
  type?: TicketType;
  
  /** Estado del ticket para filtrar (ejemplo: AVAILABLE, SOLD) */
  status?: TicketStatus;
  
  /** Precio mínimo para filtrar tickets en un rango de precios */
  minPrice?: number;
  
  /** Precio máximo para filtrar tickets en un rango de precios */
  maxPrice?: number;
  
  /** Filtrar solo tickets activos (true) o inactivos (false) */
  isActive?: boolean;
  
  /** Texto para búsqueda por coincidencia en nombre o descripción */
  query?: string;
}

/**
 * Opciones de paginación y ordenamiento para resultados
 * 
 * Permite configurar cómo se presentarán los resultados de las
 * consultas, incluyendo paginación para grandes conjuntos de datos
 * y criterios de ordenamiento personalizables.
 */
export interface PaginationOptions {
  /** Número de página a recuperar (comienza en 1) */
  page: number;
  
  /** Cantidad de items por página (tamaño de página) */
  limit: number;
  
  /** Campo por el cual ordenar los resultados (ejemplo: 'price', 'name') */
  orderBy?: string;
  
  /** Dirección del ordenamiento (ascendente o descendente) */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Resultado de una búsqueda paginada de tickets
 * 
 * Encapsula tanto la lista de tickets encontrados como la información
 * de paginación para facilitar la navegación entre páginas de resultados.
 */
export interface PaginatedTicketsResult {
  /** Lista de tickets encontrados en la página actual */
  tickets: Ticket[];
  
  /** Número total de tickets que coinciden con los filtros aplicados */
  total: number;
  
  /** Número de página actual que se está visualizando */
  page: number;
  
  /** Cantidad de items por página configurada */
  limit: number;
  
  /** Número total de páginas disponibles con los filtros actuales */
  totalPages: number;
}

/**
 * Interfaz del repositorio de tickets
 * 
 * Define todos los métodos necesarios para gestionar la persistencia y
 * recuperación de tickets en el sistema. Proporciona operaciones específicas
 * para búsqueda, filtrado y recuperación de tickets según diferentes criterios.
 * 
 * Este repositorio es fundamental para la gestión de entradas a eventos,
 * permitiendo consultas complejas para necesidades como reportes, gestión
 * de inventario de tickets y seguimiento de ventas.
 * 
 * @extends {Repository<string, Ticket>} Extiende el repositorio base con ID de tipo string
 */
export interface TicketRepository extends Repository<string, Ticket> {
  /**
   * Busca tickets aplicando filtros y paginación
   * 
   * Permite realizar búsquedas complejas combinando múltiples criterios
   * de filtrado y controlando la presentación de resultados mediante paginación.
   * 
   * @param filters Opciones de filtrado para refinar la búsqueda (opcional)
   * @param pagination Opciones de paginación y ordenamiento (opcional)
   * @returns Resultado paginado con tickets que coinciden con los filtros
   */
  findWithFilters(
    filters?: TicketFilterOptions, 
    pagination?: PaginationOptions
  ): Promise<PaginatedTicketsResult>;

  /**
   * Busca tickets asociados a un evento específico
   * 
   * Útil para obtener todas las entradas disponibles o vendidas
   * para un evento determinado.
   * 
   * @param event Evento para el cual se buscan los tickets
   * @returns Lista de todos los tickets del evento especificado
   */
  findByEvent(event: Event): Promise<Ticket[]>;
  
  /**
   * Busca tickets comprados por un usuario específico
   * 
   * Permite obtener el historial de compras de un usuario o
   * verificar sus entradas actuales a eventos.
   * 
   * @param user Usuario cuyas compras se desean consultar
   * @returns Lista de tickets adquiridos por el usuario
   */
  findByUser(user: User): Promise<Ticket[]>;
  
  /**
   * Busca tickets de un tipo específico
   * 
   * Permite filtrar tickets por su categoría, como General, VIP, etc.
   * 
   * @param type Tipo de ticket a buscar
   * @returns Lista de tickets del tipo especificado
   */
  findByType(type: TicketType): Promise<Ticket[]>;
  
  /**
   * Busca tickets en un estado específico
   * 
   * Útil para consultar tickets disponibles, vendidos, cancelados, etc.
   * 
   * @param status Estado por el cual filtrar los tickets
   * @returns Lista de tickets con el estado especificado
   */
  findByStatus(status: TicketStatus): Promise<Ticket[]>;
  
  /**
   * Busca tickets disponibles para compra
   * 
   * Método conveniente para obtener solo tickets que pueden ser adquiridos.
   * 
   * @returns Lista de tickets disponibles para venta
   */
  findAvailableTickets(): Promise<Ticket[]>;
  
  /**
   * Busca tickets ya vendidos
   * 
   * Útil para reportes de ventas o seguimiento de asistencia.
   * 
   * @returns Lista de tickets que han sido vendidos
   */
  findSoldTickets(): Promise<Ticket[]>;
  
  /**
   * Busca tickets activos en el sistema
   * 
   * Tickets activos pueden ser comprados o gestionados.
   * 
   * @returns Lista de tickets marcados como activos
   */
  findActiveTickets(): Promise<Ticket[]>;
  
  /**
   * Busca tickets inactivos en el sistema
   * 
   * Tickets inactivos generalmente han sido deshabilitados
   * por alguna razón administrativa.
   * 
   * @returns Lista de tickets marcados como inactivos
   */
  findInactiveTickets(): Promise<Ticket[]>;
  
  /**
   * Busca tickets por coincidencia textual en nombre o descripción
   * 
   * Permite búsquedas por texto libre para encontrar tickets
   * que coincidan con términos específicos.
   * 
   * @param query Texto a buscar en nombre o descripción de tickets
   * @returns Lista de tickets que coinciden con la búsqueda textual
   */
  searchByText(query: string): Promise<Ticket[]>;
} 