import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ticket, TicketStatus, TicketType, TicketHolder } from '../types';

// Clave para almacenar los tickets en AsyncStorage
const TICKETS_STORAGE_KEY = 'userTickets';

// Función para generar un ID único
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

class TicketService {
  /**
   * Obtiene todos los tickets del usuario
   * @param userId ID del usuario
   * @returns Array con tickets del usuario
   */
  async getUserTickets(userId: string): Promise<Ticket[]> {
    try {
      // En producción, esto sería una llamada a API
      // return await api.get(`/users/${userId}/tickets`);
      
      const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      if (!storedTickets) {
        return [];
      }
      
      const tickets: Ticket[] = JSON.parse(storedTickets);
      return tickets.filter(ticket => ticket.userId === userId);
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      return [];
    }
  }

  /**
   * Obtiene los tickets de un usuario para un evento específico
   * @param userId ID del usuario
   * @param eventId ID del evento
   * @returns Array con tickets del usuario para el evento
   */
  async getUserTicketsForEvent(userId: string, eventId: string): Promise<Ticket[]> {
    try {
      const userTickets = await this.getUserTickets(userId);
      return userTickets.filter(ticket => ticket.eventId === eventId);
    } catch (error) {
      console.error('Error al obtener tickets para evento:', error);
      return [];
    }
  }

  /**
   * Obtiene un ticket específico por su ID
   * @param ticketId ID del ticket
   * @returns El ticket o null si no existe
   */
  async getTicketById(ticketId: string): Promise<Ticket | null> {
    try {
      const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      if (!storedTickets) {
        return null;
      }
      
      const tickets: Ticket[] = JSON.parse(storedTickets);
      const ticket = tickets.find(t => t.id === ticketId);
      
      return ticket || null;
    } catch (error) {
      console.error('Error al obtener ticket:', error);
      return null;
    }
  }

  /**
   * Genera un QR code para el ticket
   * @returns String representando el código QR
   */
  private generateQRCode(): string {
    // En una implementación real, aquí se generaría un QR más complejo
    // Para este ejemplo, generamos un ID aleatorio
    return generateId();
  }

  /**
   * Crea un nuevo ticket para un usuario
   * @param ticketData Datos del ticket
   * @returns El ticket creado
   */
  async createTicket(ticketData: {
    eventId: string;
    userId: string;
    price: number;
    ticketType: TicketType;
    ticketHolder: TicketHolder;
    seat?: string;
  }): Promise<Ticket> {
    try {
      // En producción, esto sería una llamada a API
      // return await api.post(`/tickets`, ticketData);
      
      const newTicket: Ticket = {
        id: generateId(),
        eventId: ticketData.eventId,
        userId: ticketData.userId,
        purchaseDate: new Date().toISOString(),
        status: 'valid',
        qrCode: this.generateQRCode(),
        price: ticketData.price,
        ticketType: ticketData.ticketType,
        ticketHolder: ticketData.ticketHolder,
        seat: ticketData.seat,
        ticketNumber: `T${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        isTransferable: true,
        validationCount: 0,
        currency: 'EUR'
      };
      
      const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      const tickets: Ticket[] = storedTickets ? JSON.parse(storedTickets) : [];
      
      tickets.push(newTicket);
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
      
      return newTicket;
    } catch (error) {
      console.error('Error al crear ticket:', error);
      throw new Error('No se pudo crear el ticket');
    }
  }

  /**
   * Valida un ticket
   * @param ticketId ID del ticket a validar
   * @returns El ticket validado o null si no existe o ya fue validado
   */
  async validateTicket(ticketId: string): Promise<Ticket | null> {
    try {
      const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      if (!storedTickets) {
        return null;
      }
      
      const tickets: Ticket[] = JSON.parse(storedTickets);
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return null;
      }
      
      const ticket = tickets[ticketIndex];
      
      // Verificar si el ticket ya fue validado
      if (ticket.status !== 'valid') {
        return null;
      }
      
      // Actualizar estado del ticket
      ticket.status = 'used';
      ticket.lastValidatedAt = new Date().toISOString();
      ticket.validationCount++;
      
      // Guardar cambios
      tickets[ticketIndex] = ticket;
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
      
      return ticket;
    } catch (error) {
      console.error('Error al validar ticket:', error);
      return null;
    }
  }

  /**
   * Cancela un ticket
   * @param ticketId ID del ticket a cancelar
   * @returns El ticket cancelado o null si no existe
   */
  async cancelTicket(ticketId: string): Promise<Ticket | null> {
    try {
      const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      if (!storedTickets) {
        return null;
      }
      
      const tickets: Ticket[] = JSON.parse(storedTickets);
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        return null;
      }
      
      const ticket = tickets[ticketIndex];
      
      // Actualizar estado del ticket
      ticket.status = 'cancelled';
      
      // Guardar cambios
      tickets[ticketIndex] = ticket;
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
      
      return ticket;
    } catch (error) {
      console.error('Error al cancelar ticket:', error);
      return null;
    }
  }

  /**
   * Verifica si un ticket es válido
   * @param ticketId ID del ticket a verificar
   * @returns true si el ticket es válido, false en caso contrario
   */
  async isTicketValid(ticketId: string): Promise<boolean> {
    try {
      const ticket = await this.getTicketById(ticketId);
      return ticket !== null && ticket.status === 'valid';
    } catch (error) {
      console.error('Error al verificar ticket:', error);
      return false;
    }
  }

  /**
   * Agrega tickets de ejemplo para el usuario
   * @param userId ID del usuario
   */
  async addSampleTickets(userId: string): Promise<void> {
    // Implementación para agregar tickets de ejemplo
  }
}

export const ticketService = new TicketService(); 