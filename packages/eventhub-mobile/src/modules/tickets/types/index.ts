/**
 * Tipos para el módulo de tickets
 */

/**
 * Estado posible de un ticket
 */
export type TicketStatus = 'valid' | 'used' | 'expired' | 'cancelled';

/**
 * Información del portador del ticket
 */
export interface TicketHolder {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Información básica de un evento asociado a un ticket
 */
export interface TicketEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  image?: string;
  description?: string;
  organizer?: {
    id: string;
    name: string;
  };
}

/**
 * Interfaz para un ticket
 */
export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  ticketNumber: string;
  ticketType: string;
  seat?: string;
  price: number;
  status: TicketStatus;
  purchaseDate: string;
  qrCode: string;
  ticketHolder: TicketHolder;
  event?: TicketEvent;
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
 * Respuesta de validación de ticket
 */
export interface TicketValidationResponse {
  success: boolean;
  ticket?: Ticket;
  message?: string;
} 