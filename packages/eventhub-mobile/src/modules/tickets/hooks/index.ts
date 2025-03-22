/**
 * Hooks para el módulo de tickets
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { ticketService } from '../services';
import { Ticket, TicketPurchaseData } from '../types';

/**
 * Hook para gestionar los tickets del usuario actual
 * @param userId ID del usuario
 */
export const useUserTickets = (userId: string) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Función para cargar los tickets del usuario
  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      const userTickets = await ticketService.getUserTickets(userId);
      setTickets(userTickets);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
      Alert.alert('Error', 'No se pudieron cargar tus tickets');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId]);

  // Cargar tickets al inicializar
  useEffect(() => {
    if (userId) {
      loadTickets();
    }
  }, [userId, loadTickets]);

  // Función para refrescar los tickets
  const refreshTickets = useCallback(() => {
    setIsRefreshing(true);
    loadTickets();
  }, [loadTickets]);

  // Función para comprar un ticket
  const purchaseTicket = useCallback(
    async (eventId: string, ticketData: TicketPurchaseData) => {
      try {
        const newTicket = await ticketService.purchaseTicket(
          eventId,
          userId,
          ticketData
        );
        
        if (newTicket) {
          setTickets(prevTickets => [newTicket, ...prevTickets]);
          return newTicket;
        }
        
        return null;
      } catch (error) {
        console.error('Error al comprar ticket:', error);
        Alert.alert('Error', 'No se pudo completar la compra del ticket');
        return null;
      }
    },
    [userId]
  );

  // Función para cancelar un ticket
  const cancelTicket = useCallback(async (ticketId: string) => {
    try {
      const updatedTicket = await ticketService.cancelTicket(ticketId);
      
      if (updatedTicket) {
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === ticketId ? updatedTicket : ticket
          )
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al cancelar ticket:', error);
      Alert.alert('Error', 'No se pudo cancelar el ticket');
      return false;
    }
  }, []);

  return {
    tickets,
    isLoading,
    isRefreshing,
    refreshTickets,
    purchaseTicket,
    cancelTicket
  };
};

/**
 * Hook para obtener detalles de un ticket específico
 * @param ticketId ID del ticket
 */
export const useTicketDetails = (ticketId?: string) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cargar los detalles del ticket
  const loadTicketDetails = useCallback(async () => {
    if (!ticketId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const ticketData = await ticketService.getTicketById(ticketId);
      setTicket(ticketData);
    } catch (error) {
      console.error('Error al cargar detalles del ticket:', error);
      Alert.alert('Error', 'No se pudo cargar la información del ticket');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  // Cargar detalles al inicializar
  useEffect(() => {
    loadTicketDetails();
  }, [loadTicketDetails]);

  return {
    ticket,
    isLoading,
    refreshTicket: loadTicketDetails
  };
};

/**
 * Hook para la validación de tickets
 */
export const useTicketValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validatedTickets, setValidatedTickets] = useState<Ticket[]>([]);

  // Función para validar un ticket por su ID
  const validateTicket = useCallback(async (ticketId: string) => {
    try {
      setIsValidating(true);
      const updatedTicket = await ticketService.validateTicket(ticketId);
      
      if (updatedTicket) {
        setValidatedTickets(prev => [updatedTicket, ...prev]);
        return { success: true, ticket: updatedTicket };
      }
      
      return { 
        success: false, 
        message: 'No se pudo validar el ticket' 
      };
    } catch (error) {
      console.error('Error al validar ticket:', error);
      return { 
        success: false, 
        message: 'Error al validar el ticket' 
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Función para validar un ticket por su código QR
  const validateTicketByQR = useCallback(async (qrCode: string) => {
    try {
      setIsValidating(true);
      
      // Obtener todos los tickets para buscar el correspondiente al QR
      const allTickets = await ticketService.getUserTickets('');
      const ticket = allTickets.find(t => t.qrCode === qrCode);
      
      if (!ticket) {
        return { 
          success: false, 
          message: 'Ticket no encontrado' 
        };
      }
      
      // Verificar el estado del ticket
      if (ticket.status !== 'valid') {
        let message = '';
        switch (ticket.status) {
          case 'used':
            message = 'Este ticket ya ha sido utilizado';
            break;
          case 'expired':
            message = 'Este ticket ha expirado';
            break;
          case 'cancelled':
            message = 'Este ticket ha sido cancelado';
            break;
          default:
            message = 'Este ticket no es válido';
        }
        
        return { success: false, message };
      }
      
      // Validar el ticket
      const result = await validateTicket(ticket.id);
      return result;
      
    } catch (error) {
      console.error('Error al validar ticket por QR:', error);
      return { 
        success: false, 
        message: 'Error al validar el ticket' 
      };
    } finally {
      setIsValidating(false);
    }
  }, [validateTicket]);

  return {
    isValidating,
    validatedTickets,
    validateTicket,
    validateTicketByQR,
    clearValidatedTickets: () => setValidatedTickets([])
  };
}; 