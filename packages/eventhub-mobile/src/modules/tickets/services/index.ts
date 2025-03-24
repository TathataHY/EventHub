/** 
 * Servicios para la gestión de tickets
 */

import { apiClient } from '@core/api';
import { mockTickets } from '@core/mocks';
import { Ticket, TicketStatus, TicketType, TicketPurchaseData, CreateTicketData } from '@modules/tickets/types';

// Convertir tickets mock para asegurar tipos correctos
const typedMockTickets: Ticket[] = mockTickets.map(ticket => ({
  ...ticket,
  ticketType: ticket.ticketType as TicketType,
  status: ticket.status as TicketStatus
}));

/**
 * Servicio para gestionar tickets
 */
export const ticketService = {
  /**
   * Obtener tickets del usuario
   * @param userId ID del usuario
   * @returns Lista de tickets del usuario
   */
  getUserTickets: async (userId: string): Promise<Ticket[]> => {
    try {
      // En una implementación real, se haría una llamada a la API
      // const response = await apiClient.get(`/tickets/user/${userId}`);
      // return response.data;
      
      // Por ahora, devolvemos datos simulados
      // Si se proporciona un userId, filtrar por ese usuario, sino devolver todos
      return userId 
        ? typedMockTickets.filter(ticket => ticket.userId === userId) 
        : typedMockTickets;
    } catch (error) {
      console.error('Error al obtener tickets del usuario:', error);
      return [];
    }
  },
  
  /**
   * Obtener un ticket por su ID
   * @param ticketId ID del ticket
   * @returns Ticket encontrado o null si no existe
   */
  getTicketById: async (ticketId: string): Promise<Ticket | null> => {
    try {
      // En una implementación real, se haría una llamada a la API
      // const response = await apiClient.get(`/tickets/${ticketId}`);
      // return response.data;
      
      // Por ahora, devolvemos datos simulados
      const ticket = typedMockTickets.find(t => t.id === ticketId);
      return ticket || null;
    } catch (error) {
      console.error('Error al obtener ticket por ID:', error);
      return null;
    }
  },
  
  /**
   * Validar un ticket (cambiar su estado a 'usado')
   * @param ticketId ID del ticket a validar
   * @returns Ticket actualizado o null si hubo un error
   */
  validateTicket: async (ticketId: string): Promise<Ticket | null> => {
    try {
      // En una implementación real, se haría una llamada a la API
      // const response = await apiClient.put(`/tickets/${ticketId}/validate`);
      // return response.data;
      
      // Por ahora, actualizamos datos simulados
      const ticketIndex = typedMockTickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return null;
      }
      
      // Actualizar estado del ticket a 'usado'
      const updatedTicket = {
        ...typedMockTickets[ticketIndex],
        status: 'used' as TicketStatus
      };
      
      // Actualizar en el array de tickets simulados
      typedMockTickets[ticketIndex] = updatedTicket;
      
      return updatedTicket;
    } catch (error) {
      console.error('Error al validar ticket:', error);
      return null;
    }
  },
  
  /**
   * Comprar un ticket para un evento
   * @param eventId ID del evento
   * @param userId ID del usuario
   * @param ticketData Datos del ticket a comprar
   * @returns Ticket comprado o null si hubo un error
   */
  purchaseTicket: async (
    eventId: string,
    userId: string,
    ticketData: TicketPurchaseData
  ): Promise<Ticket | null> => {
    try {
      // En una implementación real, se haría una llamada a la API
      // const response = await apiClient.post(`/tickets/purchase`, {
      //   eventId,
      //   userId,
      //   ...ticketData
      // });
      // return response.data;
      
      // Asegurar que el tipo de ticket sea válido
      const ticketType = (ticketData.ticketType as TicketType) || 'general';
      
      // Por ahora, creamos un ticket simulado
      const newTicket: Ticket = {
        id: `ticket-${Date.now()}`,
        eventId,
        userId,
        ticketNumber: `T-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        ticketType: ticketType,
        seat: ticketData.seat,
        price: ticketData.price,
        status: 'valid',
        purchaseDate: new Date().toISOString(),
        qrCode: `EH-${eventId}-${Date.now()}`,
        ticketHolder: ticketData.ticketHolder,
        isTransferable: false,
        validationCount: 0
      };
      
      // Agregar al array de tickets simulados
      typedMockTickets.push(newTicket);
      
      return newTicket;
    } catch (error) {
      console.error('Error al comprar ticket:', error);
      return null;
    }
  },
  
  /**
   * Cancelar un ticket
   * @param ticketId ID del ticket a cancelar
   * @returns Ticket actualizado o null si hubo un error
   */
  cancelTicket: async (ticketId: string): Promise<Ticket | null> => {
    try {
      // En una implementación real, se haría una llamada a la API
      // const response = await apiClient.put(`/tickets/${ticketId}/cancel`);
      // return response.data;
      
      // Por ahora, actualizamos datos simulados
      const ticketIndex = typedMockTickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return null;
      }
      
      // Actualizar estado del ticket a 'cancelado'
      const updatedTicket = {
        ...typedMockTickets[ticketIndex],
        status: 'cancelled' as TicketStatus
      };
      
      // Actualizar en el array de tickets simulados
      typedMockTickets[ticketIndex] = updatedTicket;
      
      return updatedTicket;
    } catch (error) {
      console.error('Error al cancelar ticket:', error);
      return null;
    }
  }
}; 