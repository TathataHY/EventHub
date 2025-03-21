import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar los tickets en AsyncStorage
const TICKETS_STORAGE_KEY = 'userTickets';

// Tipos de tickets
export enum TicketStatus {
  VALID = 'valid',
  USED = 'used',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

// Interfaz para el ticket
export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: string;
  status: TicketStatus;
  validationDate?: string;
  qrCode: string;
  price: number;
  seat?: string;
  ticketType: string;
  ticketHolder: {
    name: string;
    email: string;
  };
}

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
    ticketType: string;
    ticketHolder: {
      name: string;
      email: string;
    };
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
        status: TicketStatus.VALID,
        qrCode: this.generateQRCode(),
        price: ticketData.price,
        ticketType: ticketData.ticketType,
        ticketHolder: ticketData.ticketHolder,
        seat: ticketData.seat
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
   * Valida un ticket (marca como usado)
   * @param ticketId ID del ticket
   * @returns El ticket actualizado o null si no existe
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
      
      // Verificar que el ticket sea válido
      if (tickets[ticketIndex].status !== TicketStatus.VALID) {
        return tickets[ticketIndex];
      }
      
      // Actualizar el estado del ticket
      tickets[ticketIndex] = {
        ...tickets[ticketIndex],
        status: TicketStatus.USED,
        validationDate: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
      
      return tickets[ticketIndex];
    } catch (error) {
      console.error('Error al validar ticket:', error);
      return null;
    }
  }

  /**
   * Cancela un ticket
   * @param ticketId ID del ticket
   * @returns El ticket actualizado o null si no existe
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
      
      // Actualizar el estado del ticket
      tickets[ticketIndex] = {
        ...tickets[ticketIndex],
        status: TicketStatus.CANCELLED
      };
      
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
      
      return tickets[ticketIndex];
    } catch (error) {
      console.error('Error al cancelar ticket:', error);
      return null;
    }
  }

  /**
   * Verifica si un ticket es válido
   * @param ticketId ID del ticket
   * @returns true si es válido, false en caso contrario
   */
  async isTicketValid(ticketId: string): Promise<boolean> {
    try {
      const ticket = await this.getTicketById(ticketId);
      return !!ticket && ticket.status === TicketStatus.VALID;
    } catch (error) {
      console.error('Error al verificar validez del ticket:', error);
      return false;
    }
  }

  /**
   * Agrega tickets de ejemplo para desarrollo
   * @param userId ID del usuario
   */
  async addSampleTickets(userId: string): Promise<void> {
    try {
      const userTickets = await this.getUserTickets(userId);
      
      // Sólo agregamos ejemplos si no hay tickets
      if (userTickets.length > 0) {
        return;
      }
      
      const sampleTickets: Ticket[] = [
        {
          id: generateId(),
          eventId: '1',
          userId: userId,
          purchaseDate: new Date().toISOString(),
          status: TicketStatus.VALID,
          qrCode: this.generateQRCode(),
          price: 25.99,
          ticketType: 'General',
          ticketHolder: {
            name: 'Usuario de Prueba',
            email: 'usuario@example.com'
          }
        },
        {
          id: generateId(),
          eventId: '2',
          userId: userId,
          purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días atrás
          status: TicketStatus.USED,
          validationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
          qrCode: this.generateQRCode(),
          price: 50,
          ticketType: 'VIP',
          ticketHolder: {
            name: 'Usuario de Prueba',
            email: 'usuario@example.com'
          }
        },
        {
          id: generateId(),
          eventId: '3',
          userId: userId,
          purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días atrás
          status: TicketStatus.EXPIRED,
          qrCode: this.generateQRCode(),
          price: 15,
          ticketType: 'Standard',
          ticketHolder: {
            name: 'Usuario de Prueba',
            email: 'usuario@example.com'
          }
        }
      ];
      
      const storedTickets = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
      const tickets: Ticket[] = storedTickets ? JSON.parse(storedTickets) : [];
      
      tickets.push(...sampleTickets);
      await AsyncStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error al agregar tickets de ejemplo:', error);
    }
  }
}

export const ticketService = new TicketService(); 