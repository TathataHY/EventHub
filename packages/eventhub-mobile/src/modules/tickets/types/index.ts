/**
 * Tipos para el módulo de tickets
 */

/**
 * Estado posible de un ticket
 */
export type TicketStatus = 'valid' | 'used' | 'expired' | 'cancelled';

/**
 * Tipos de ticket
 */
export type TicketType = 'general' | 'vip' | 'early-bird' | 'premium' | 'free';

/**
 * Información básica de un evento asociado a un ticket
 */
export interface TicketEventData {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  organizer: {
    id: string;
    name: string;
  };
}

/**
 * Información del portador del ticket
 */
export interface TicketHolder {
  name: string;
  email: string;
  phone?: string;
  documentId?: string;
}

/**
 * Interfaz para un ticket
 */
export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  ticketNumber: string;
  ticketType: TicketType;
  status: TicketStatus;
  price: number;
  purchaseDate: string;
  seat?: string;
  qrCode: string;
  isTransferable: boolean;
  validationCount: number;
  lastValidatedAt?: string;
  ticketHolder: TicketHolder;
  event?: TicketEventData;
}

/**
 * Datos para la compra de un ticket
 */
export interface TicketPurchaseData {
  ticketType: string;
  price: number;
  seat?: string;
  ticketHolder: TicketHolder;
}

/**
 * Datos para la creación de un ticket
 */
export interface CreateTicketData {
  eventId: string;
  userId: string;
  ticketType: TicketType;
  price: number;
  ticketHolder: TicketHolder;
  seat?: string;
}

/**
 * Datos para la actualización de un ticket
 */
export interface UpdateTicketData {
  status?: TicketStatus;
  ticketHolder?: TicketHolder;
  isTransferable?: boolean;
}

/**
 * Respuesta de validación de ticket
 */
export interface TicketValidationResult {
  isValid: boolean;
  ticket?: Ticket;
  message: string;
  validatedAt?: string;
  validatedBy?: string;
}

/**
 * Estadísticas de tickets para un evento
 */
export interface EventTicketStats {
  eventId: string;
  sold: number;
  used: number;
  available: number;
  cancelled: number;
  revenue: number;
} 