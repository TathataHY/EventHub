import { Repository } from '../../../core/interfaces/Repository';
import { Ticket } from '../entities/Ticket';
import { TicketStatus } from '../value-objects/TicketStatus';

/**
 * Opciones para buscar tickets con filtrado y paginación
 */
export interface FindTicketsOptions {
  page?: number;
  limit?: number;
  status?: TicketStatus | string;
  ticketType?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'createdAt' | 'ticketPrice' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Repositorio para operaciones con tickets
 * Extiende la interfaz Repository para operaciones comunes
 */
export interface TicketRepository extends Repository<Ticket, string> {
  /**
   * Busca tickets por ID de usuario
   * @param userId ID del usuario
   * @returns Arreglo de tickets
   */
  findByUserId(userId: string): Promise<Ticket[]>;

  /**
   * Busca tickets por ID de evento
   * @param eventId ID del evento
   * @returns Arreglo de tickets
   */
  findByEventId(eventId: string): Promise<Ticket[]>;

  /**
   * Busca tickets por ID de pago
   * @param paymentId ID del pago
   * @returns Arreglo de tickets
   */
  findByPaymentId(paymentId: string): Promise<Ticket[]>;

  /**
   * Busca tickets por ID de evento y usuario
   * @param eventId ID del evento
   * @param userId ID del usuario
   * @returns Arreglo de tickets
   */
  findByEventIdAndUserId(eventId: string, userId: string): Promise<Ticket[]>;

  /**
   * Busca tickets por estado
   * @param status Estado del ticket
   * @returns Arreglo de tickets
   */
  findByStatus(status: TicketStatus | string): Promise<Ticket[]>;

  /**
   * Busca tickets con opciones de filtrado y paginación
   * @param options Opciones de búsqueda
   * @returns Objeto con tickets encontrados y total
   */
  findWithOptions(options: FindTicketsOptions): Promise<{ 
    tickets: Ticket[], 
    total: number 
  }>;

  /**
   * Busca un ticket por su código QR
   * @param qrCode Código QR del ticket
   * @returns Ticket encontrado o null
   */
  findByQRCode(qrCode: string): Promise<Ticket | null>;

  /**
   * Obtiene el conteo de tickets por tipo para un evento
   * @param eventId ID del evento
   * @returns Mapa con conteo por tipo de ticket
   */
  getTicketCountByType(eventId: string): Promise<Record<string, number>>;

  /**
   * Obtiene el conteo de tickets por estado para un evento
   * @param eventId ID del evento
   * @returns Mapa con conteo por estado
   */
  getTicketCountByStatus(eventId: string): Promise<Record<string, number>>;

  /**
   * Verifica si un ticket es válido para un evento
   * @param ticketId ID del ticket
   * @param eventId ID del evento
   * @returns true si el ticket es válido
   */
  isTicketValidForEvent(ticketId: string, eventId: string): Promise<boolean>;
} 