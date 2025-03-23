import { useState, useCallback, useEffect } from 'react';
import { eventService } from '../services';
import { Share } from 'react-native';

export const useEventDetails = (eventId: string | number) => {
  const [event, setEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAttending, setIsAttending] = useState<boolean>(false);

  // Cargar detalles del evento
  const loadEventDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const eventDetails = await eventService.getEventById(eventId);
      setEvent(eventDetails);
      
      // Verificar si el usuario está asistiendo al evento
      const isUserAttending = await eventService.isUserAttending(eventId);
      setIsAttending(isUserAttending);
    } catch (err) {
      console.error('Error loading event details:', err);
      setError('Error al cargar los detalles del evento');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  // Cambiar estado de asistencia
  const toggleAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (isAttending) {
        // Cancelar asistencia
        await eventService.cancelAttendance(eventId);
      } else {
        // Registrar asistencia
        await eventService.attendEvent(eventId);
      }
      
      setIsAttending(!isAttending);
      
      // Recargar el evento para actualizar el contador de asistentes
      const updatedEvent = await eventService.getEventById(eventId);
      setEvent(updatedEvent);
      
      return true;
    } catch (err) {
      console.error('Error toggling attendance:', err);
      setError('Error al actualizar la asistencia');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [eventId, isAttending]);

  // Compartir evento
  const shareEvent = useCallback(async () => {
    if (!event) return false;
    
    try {
      const description = event.description || '';
      await Share.share({
        title: event.title,
        message: `¡Mira este evento: ${event.title}!\n${description.substring(0, 100)}...\n\nFecha: ${event.startDate}`
      });
      
      return true;
    } catch (err) {
      console.error('Error sharing event:', err);
      return false;
    }
  }, [event]);

  // Cargar los detalles al montar el componente
  useEffect(() => {
    loadEventDetails();
  }, [loadEventDetails]);

  return {
    event,
    isLoading,
    error,
    isAttending,
    loadEventDetails,
    toggleAttendance,
    shareEvent
  };
}; 