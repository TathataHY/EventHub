import { useState, useEffect } from 'react';
import { eventService, ServiceEvent } from '../services/event.service';
import { Event } from '../types';
import { useAuth } from '@modules/auth/hooks/useAuth';
import { useRouter } from 'expo-router';

/**
 * Hook para obtener y gestionar los detalles de un evento
 */
export const useEventDetails = (eventId?: string) => {
  const [event, setEvent] = useState<ServiceEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAttending, setIsAttending] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const router = useRouter();

  // Cargar los detalles del evento
  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      setError('ID de evento no proporcionado');
      return;
    }

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(eventId);
        
        if (!eventData) {
          setError('Evento no encontrado');
          setEvent(null);
        } else {
          // Convertir el ID a string si es necesario
          const processedEvent: ServiceEvent = {
            ...eventData,
            id: String(eventData.id),
            organizerId: String(eventData.organizerId)
          };
          setEvent(processedEvent);
          
          // Verificar si el usuario está asistiendo a este evento
          if (currentUser) {
            const attending = await eventService.isUserAttending(eventId);
            setIsAttending(attending);
          }
        }
      } catch (err) {
        setError('Error al cargar los detalles del evento');
        console.error('Error al cargar detalles del evento:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, currentUser]);

  // Función para asistir a un evento
  const attendEvent = async () => {
    if (!currentUser) {
      router.push('/auth/login');
      return false;
    }

    if (!eventId) return false;

    try {
      const success = await eventService.attendEvent((currentUser as any).id, eventId);
      if (success) {
        setIsAttending(true);
      }
      return success;
    } catch (error) {
      console.error('Error al registrar asistencia a evento:', error);
      return false;
    }
  };

  // Función para cancelar asistencia a un evento
  const cancelAttendance = async () => {
    if (!currentUser || !eventId) return false;

    try {
      await eventService.cancelAttendance(eventId);
      setIsAttending(false);
      return true;
    } catch (err) {
      console.error('Error al cancelar asistencia:', err);
      return false;
    }
  };

  // Función para compartir un evento
  const shareEvent = async () => {
    if (!currentUser || !eventId) return false;

    try {
      const success = await eventService.shareEvent((currentUser as any).id, eventId);
      return success;
    } catch (err) {
      console.error('Error al compartir evento:', err);
      return false;
    }
  };

  return {
    event,
    loading,
    error,
    isAttending,
    isFavorite,
    attendEvent,
    cancelAttendance,
    shareEvent
  };
}; 