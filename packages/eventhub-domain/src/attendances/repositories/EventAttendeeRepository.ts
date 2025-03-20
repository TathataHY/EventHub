import { Repository } from '../../core/interfaces/Repository';
import { EventAttendee } from '../entities/EventAttendee';
import { AttendanceStatus, AttendanceStatusEnum } from '../value-objects/AttendanceStatus';

/**
 * Interfaz para filtros de búsqueda de asistencias a eventos
 */
export interface EventAttendeeFilters {
  /**
   * ID del evento
   */
  eventId?: string;
  
  /**
   * ID del usuario
   */
  userId?: string;
  
  /**
   * Estado de la asistencia
   */
  status?: AttendanceStatusEnum | AttendanceStatus;
  
  /**
   * Solo asistencias con check-in realizado
   */
  checkedInOnly?: boolean;
  
  /**
   * Solo asistencias con ticket asignado
   */
  withTicketOnly?: boolean;
  
  /**
   * Fecha de registro desde
   */
  registrationDateFrom?: Date;
  
  /**
   * Fecha de registro hasta
   */
  registrationDateTo?: Date;
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
  orderBy?: 'registrationDate' | 'createdAt';
  
  /**
   * Dirección del ordenamiento
   */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Interfaz para el repositorio de asistencias a eventos
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para asistencias a eventos
 */
export interface EventAttendeeRepository extends Repository<EventAttendee, string> {
  /**
   * Encuentra asistencias con filtros y paginación
   * @param filters Filtros para la búsqueda
   * @param options Opciones de paginación
   * @returns Lista de asistencias y total
   */
  findWithFilters(
    filters: EventAttendeeFilters,
    options?: PaginationOptions
  ): Promise<{ attendees: EventAttendee[]; total: number }>;
  
  /**
   * Encuentra asistencias a un evento
   * @param eventId ID del evento
   * @returns Lista de asistencias
   */
  findByEventId(eventId: string): Promise<EventAttendee[]>;
  
  /**
   * Encuentra asistencias de un usuario
   * @param userId ID del usuario
   * @returns Lista de asistencias
   */
  findByUserId(userId: string): Promise<EventAttendee[]>;
  
  /**
   * Encuentra asistencias por estado
   * @param status Estado de la asistencia
   * @returns Lista de asistencias
   */
  findByStatus(status: AttendanceStatusEnum | AttendanceStatus): Promise<EventAttendee[]>;
  
  /**
   * Encuentra una asistencia específica por evento y usuario
   * @param eventId ID del evento
   * @param userId ID del usuario
   * @returns Asistencia o null si no existe
   */
  findByEventAndUser(eventId: string, userId: string): Promise<EventAttendee | null>;
  
  /**
   * Actualiza el estado de una asistencia
   * @param id ID de la asistencia
   * @param status Nuevo estado
   * @returns Asistencia actualizada o null si no existe
   */
  updateStatus(id: string, status: AttendanceStatusEnum | AttendanceStatus): Promise<EventAttendee | null>;
  
  /**
   * Registra el check-in de una asistencia
   * @param id ID de la asistencia
   * @returns Asistencia actualizada o null si no existe
   */
  checkIn(id: string): Promise<EventAttendee | null>;
  
  /**
   * Asigna un ticket a una asistencia
   * @param id ID de la asistencia
   * @param ticketId ID del ticket
   * @returns Asistencia actualizada o null si no existe
   */
  assignTicket(id: string, ticketId: string): Promise<EventAttendee | null>;
  
  /**
   * Encuentra asistencias con check-in realizado para un evento
   * @param eventId ID del evento
   * @returns Lista de asistencias
   */
  findCheckedInByEventId(eventId: string): Promise<EventAttendee[]>;
  
  /**
   * Cancela todas las asistencias para un evento
   * @param eventId ID del evento
   * @returns Número de asistencias canceladas
   */
  cancelAllByEventId(eventId: string): Promise<number>;
  
  /**
   * Encuentra asistencias en lista de espera para un evento
   * @param eventId ID del evento
   * @returns Lista de asistencias
   */
  findWaitlistedByEventId(eventId: string): Promise<EventAttendee[]>;
  
  /**
   * Confirma una asistencia en lista de espera
   * @param id ID de la asistencia
   * @returns Asistencia actualizada o null si no existe
   */
  confirmFromWaitlist(id: string): Promise<EventAttendee | null>;
} 